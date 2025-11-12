"""
Django management command to create resorts with accommodation types and images.
Run with: python manage.py create_resorts_with_images
"""
from django.core.management.base import BaseCommand
from django.core.files import File
from django.db import transaction
from api.models import Resort, ResortRoomType, Location
from decimal import Decimal
import os
import re


class Command(BaseCommand):
    help = 'Create resorts with accommodation types and images from local files'

    def add_arguments(self, parser):
        parser.add_argument(
            '--update',
            action='store_true',
            help='Update existing resorts if they already exist',
        )
        parser.add_argument(
            '--images-path',
            type=str,
            default='frontend/public/images/Resort Accomodation types images',
            help='Path to resort images directory',
        )

    def handle(self, *args, **options):
        self.stdout.write(self.style.SUCCESS('=' * 80))
        self.stdout.write(self.style.SUCCESS('Creating Resorts with Accommodation Types and Images'))
        self.stdout.write(self.style.SUCCESS('=' * 80))
        
        images_base_path = options['images_path']
        update_existing = options['update']
        
        # Check if images directory exists (skip images if not found - for production)
        images_available = os.path.exists(images_base_path)
        if not images_available:
            self.stdout.write(
                self.style.WARNING(f'Images directory not found: {images_base_path}')
            )
            self.stdout.write(
                self.style.WARNING('Will create resorts WITHOUT uploading images (production mode)')
            )
            self.stdout.write('')
        
        # Define resort data with accommodation details
        resorts_data = self.get_resorts_data()
        
        created_count = 0
        updated_count = 0
        skipped_count = 0
        
        for resort_data in resorts_data:
            resort_name = resort_data['name']
            folder_name = resort_data['folder_name']
            folder_path = os.path.join(images_base_path, folder_name) if images_available else None
            
            # Check if folder exists (skip check if images not available)
            if images_available and folder_path and not os.path.exists(folder_path):
                self.stdout.write(
                    self.style.WARNING(f'Folder not found for {resort_name}: {folder_path}')
                )
                continue
            
            self.stdout.write(f'\nProcessing: {resort_name}')
            
            try:
                with transaction.atomic():
                    # Check if resort exists
                    existing_resort = Resort.objects.filter(name=resort_name).first()
                    
                    if existing_resort:
                        if update_existing:
                            resort = existing_resort
                            self.update_resort_details(resort, resort_data, folder_path, images_available)
                            updated_count += 1
                            self.stdout.write(
                                self.style.WARNING(f'  ↻ Updated resort: {resort_name}')
                            )
                        else:
                            skipped_count += 1
                            self.stdout.write(
                                self.style.WARNING(f'  ⊘ Skipped existing resort: {resort_name}')
                            )
                            continue
                    else:
                        # Create new resort
                        resort = self.create_resort(resort_data, folder_path, images_available)
                        created_count += 1
                        self.stdout.write(
                            self.style.SUCCESS(f'  ✓ Created resort: {resort_name}')
                        )
                    
                    # Create/update accommodation types
                    room_types_created = self.create_room_types(
                        resort, 
                        resort_data['room_types'], 
                        folder_path,
                        images_available
                    )
                    self.stdout.write(
                        self.style.SUCCESS(f'    → Created/Updated {room_types_created} accommodation types')
                    )
                    
            except Exception as e:
                self.stdout.write(
                    self.style.ERROR(f'  ✗ Error processing {resort_name}: {str(e)}')
                )
                import traceback
                traceback.print_exc()
        
        # Summary
        self.stdout.write('')
        self.stdout.write(self.style.SUCCESS('=' * 80))
        self.stdout.write(self.style.SUCCESS('Summary:'))
        self.stdout.write(self.style.SUCCESS(f'  Created: {created_count}'))
        if update_existing:
            self.stdout.write(self.style.SUCCESS(f'  Updated: {updated_count}'))
        if skipped_count > 0:
            self.stdout.write(
                self.style.WARNING(f'  Skipped: {skipped_count} (use --update to update existing)')
            )
        self.stdout.write(self.style.SUCCESS('=' * 80))

    def create_resort(self, resort_data, folder_path, images_available=True):
        """Create a new resort with images"""
        # Get or create location
        location = self.get_or_create_location(resort_data)
        
        # Prepare gallery images (hero banners)
        gallery_images = []
        if images_available and folder_path:
            hero_banner_1 = self.find_image_file(folder_path, ['Resort Hero Banner 1'])
            hero_banner_2 = self.find_image_file(folder_path, ['Resort Hero Banner 2', 'Reosrt Hero Banner 2'])
            
            if hero_banner_1:
                gallery_images.append(f'/images/Resort Accomodation types images/{resort_data["folder_name"]}/{os.path.basename(hero_banner_1)}')
            if hero_banner_2:
                gallery_images.append(f'/images/Resort Accomodation types images/{resort_data["folder_name"]}/{os.path.basename(hero_banner_2)}')
        else:
            # Use static paths for production
            gallery_images.append(f'/images/Resort Accomodation types images/{resort_data["folder_name"]}/Resort Hero Banner 1.jpeg')
            gallery_images.append(f'/images/Resort Accomodation types images/{resort_data["folder_name"]}/Resort Hero Banner 2.jpeg')
        
        # Create resort
        resort = Resort.objects.create(
            name=resort_data['name'],
            description=resort_data['description'],
            detailed_description=resort_data['detailed_description'],
            category=resort_data.get('category', 'luxury'),
            star_rating=resort_data.get('star_rating', 5),
            location=location,
            atoll=resort_data.get('atoll', ''),
            island_name=resort_data.get('island_name', ''),
            price_per_night_from=resort_data.get('price_per_night_from'),
            price_per_night_to=resort_data.get('price_per_night_to'),
            currency='USD',
            is_packaged=False,  # As per requirements
            is_room_type=True,  # Set to True so accommodation types show up
            is_featured=resort_data.get('is_featured', False),
            is_active=True,
            gallery_images=gallery_images,
            featured_highlights=resort_data.get('highlights', []),
            meta_description=resort_data['description'],
        )
        
        # Set hero image (card image) - only if images available
        if images_available and folder_path:
            card_image_path = self.find_image_file(folder_path, ['Card Image'])
            if card_image_path:
                with open(card_image_path, 'rb') as f:
                    resort.hero_image.save(
                        os.path.basename(card_image_path),
                        File(f),
                        save=True
                    )
        
        return resort

    def update_resort_details(self, resort, resort_data, folder_path, images_available=True):
        """Update existing resort with new details"""
        # Update basic fields
        resort.description = resort_data['description']
        resort.detailed_description = resort_data['detailed_description']
        resort.category = resort_data.get('category', 'luxury')
        resort.star_rating = resort_data.get('star_rating', 5)
        resort.atoll = resort_data.get('atoll', '')
        resort.island_name = resort_data.get('island_name', '')
        resort.price_per_night_from = resort_data.get('price_per_night_from')
        resort.price_per_night_to = resort_data.get('price_per_night_to')
        resort.is_packaged = False
        resort.is_room_type = True  # Set to True so accommodation types show up
        resort.featured_highlights = resort_data.get('highlights', [])
        resort.meta_description = resort_data['description']
        
        # Update gallery images
        gallery_images = []
        if images_available and folder_path:
            hero_banner_1 = self.find_image_file(folder_path, ['Resort Hero Banner 1'])
            hero_banner_2 = self.find_image_file(folder_path, ['Resort Hero Banner 2', 'Reosrt Hero Banner 2'])
            
            if hero_banner_1:
                gallery_images.append(f'/images/Resort Accomodation types images/{resort_data["folder_name"]}/{os.path.basename(hero_banner_1)}')
            if hero_banner_2:
                gallery_images.append(f'/images/Resort Accomodation types images/{resort_data["folder_name"]}/{os.path.basename(hero_banner_2)}')
        else:
            # Use static paths for production
            gallery_images.append(f'/images/Resort Accomodation types images/{resort_data["folder_name"]}/Resort Hero Banner 1.jpeg')
            gallery_images.append(f'/images/Resort Accomodation types images/{resort_data["folder_name"]}/Resort Hero Banner 2.jpeg')
        
        resort.gallery_images = gallery_images
        
        # Update hero image if exists - only if images available
        if images_available and folder_path:
            card_image_path = self.find_image_file(folder_path, ['Card Image'])
            if card_image_path:
                with open(card_image_path, 'rb') as f:
                    resort.hero_image.save(
                        os.path.basename(card_image_path),
                        File(f),
                        save=False
                    )
        
        resort.save()

    def create_room_types(self, resort, room_types_data, folder_path, images_available=True):
        """Create or update room types for a resort"""
        count = 0
        
        for room_data in room_types_data:
            # Find matching image file - only if images available
            image_path = None
            if images_available and folder_path:
                image_path = self.find_image_file(folder_path, room_data['image_patterns'])
            
            # Create or update room type
            room_type, created = ResortRoomType.objects.update_or_create(
                resort=resort,
                name=room_data['name'],
                defaults={
                    'description': room_data['description'],
                    'price_per_night': room_data['price_per_night'],
                    'currency': 'USD',
                    'occupancy_adults': room_data['occupancy_adults'],
                    'occupancy_children': room_data['occupancy_children'],
                    'bed_configuration': room_data['bed_configuration'],
                    'amenities': room_data['amenities'],
                    'order': room_data['order'],
                    'is_active': True,
                    'hide_price': True,  # Hide prices for these resorts
                }
            )
            
            # Set image if found - only if images available
            if images_available and image_path and (created or not room_type.image):
                with open(image_path, 'rb') as f:
                    room_type.image.save(
                        os.path.basename(image_path),
                        File(f),
                        save=True
                    )
            
            count += 1
        
        return count

    def find_image_file(self, folder_path, patterns):
        """Find an image file matching any of the given patterns"""
        if not os.path.exists(folder_path):
            return None
        
        files = os.listdir(folder_path)
        
        for pattern in patterns:
            # Try exact match first (case-insensitive)
            for file in files:
                name_without_ext = os.path.splitext(file)[0]
                if name_without_ext.lower() == pattern.lower():
                    return os.path.join(folder_path, file)
            
            # Try partial match
            for file in files:
                if pattern.lower() in file.lower():
                    return os.path.join(folder_path, file)
        
        return None

    def get_or_create_location(self, resort_data):
        """Get or create a location for the resort"""
        island_name = resort_data.get('island_name', resort_data['name'])
        atoll = resort_data.get('atoll', '')
        
        location, created = Location.objects.get_or_create(
            island=island_name,
            defaults={
                'atoll': atoll,
                'latitude': resort_data.get('latitude'),
                'longitude': resort_data.get('longitude'),
            }
        )
        
        return location

    def get_resorts_data(self):
        """Define all resort data with accommodation types"""
        return [
            {
                'name': 'Hard Rock Hotel Maldives',
                'folder_name': 'Hard Rock Maldives',
                'description': 'Amp up your island escape with iconic Hard Rock memorabilia, live entertainment, and effortless access to The Marina @ CROSSROADS Maldives.',
                'detailed_description': 'Hard Rock Hotel Maldives transforms the Emboodhoo Lagoon into a stage for curated experiences. Soundtracked amenities include in-room Crosley vinyl players, poolside music labs for kids, and exclusive JAM sessions for families. Guests tap into the culinary village at CROSSROADS, explore the Marine Discovery Centre, or wind down at the Rock Spa.',
                'category': 'luxury',
                'star_rating': 5,
                'atoll': 'South Malé Atoll',
                'island_name': 'Emboodhoo Lagoon',
                'price_per_night_from': Decimal('450.00'),
                'price_per_night_to': Decimal('950.00'),
                'highlights': [
                    'Direct bridge access to The Marina @ CROSSROADS Maldives',
                    'Signature Sound of Your Stay® musical amenities',
                    'Musically inspired kids club and teen programs',
                ],
                'room_types': [
                    {
                        'name': 'Silver Sky Studio',
                        'description': 'Light-filled upper-floor studio with private balcony, rainfall shower, and curated music playlists.',
                        'price_per_night': Decimal('450.00'),
                        'occupancy_adults': 2,
                        'occupancy_children': 1,
                        'bed_configuration': '1 King Bed or 2 Queen Beds',
                        'amenities': [
                            'Private balcony with lagoon glimpses',
                            'Rainfall shower and signature bath amenities',
                            'Crosley turntable with curated vinyl',
                            'Complimentary guitar rental via Sound of Your Stay®',
                        ],
                        'order': 1,
                        'image_patterns': ['Silver Sky Studio'],
                    },
                    {
                        'name': 'Silver Beach Studio',
                        'description': 'Ground-level studio steps from the beach with outdoor terrace and direct lagoon access.',
                        'price_per_night': Decimal('480.00'),
                        'occupancy_adults': 2,
                        'occupancy_children': 1,
                        'bed_configuration': '1 King Bed',
                        'amenities': [
                            'Private outdoor terrace',
                            'Direct beach access',
                            'Rainfall shower',
                            'Music-themed amenities',
                        ],
                        'order': 2,
                        'image_patterns': ['Silver Beach Studio'],
                    },
                    {
                        'name': 'Silver Family Suite',
                        'description': 'Spacious two-bedroom suite perfect for families with separate living area and dual bathrooms.',
                        'price_per_night': Decimal('720.00'),
                        'occupancy_adults': 4,
                        'occupancy_children': 2,
                        'bed_configuration': '1 King Bed + 2 Twin Beds',
                        'amenities': [
                            'Two separate bedrooms',
                            'Living area with sofa bed',
                            'Two bathrooms',
                            'Family entertainment system',
                        ],
                        'order': 3,
                        'image_patterns': ['Silver Family Suite'],
                    },
                    {
                        'name': 'Silver Family Pool Suite',
                        'description': 'Family suite with private pool, multiple bedrooms, and dedicated kids play area.',
                        'price_per_night': Decimal('850.00'),
                        'occupancy_adults': 4,
                        'occupancy_children': 2,
                        'bed_configuration': '1 King Bed + 2 Twin Beds',
                        'amenities': [
                            'Private plunge pool',
                            'Kids play area',
                            'Multiple bedrooms',
                            'Outdoor dining area',
                        ],
                        'order': 4,
                        'image_patterns': ['Silver Family Pool Suite'],
                    },
                    {
                        'name': 'Gold Beach Villa',
                        'description': 'Steps from the shoreline with an outdoor deck, indoor lounge, and direct access to the music-infused main beach.',
                        'price_per_night': Decimal('620.00'),
                        'occupancy_adults': 2,
                        'occupancy_children': 2,
                        'bed_configuration': '1 King Bed + Sofa Bed',
                        'amenities': [
                            'Beachfront deck with loungers',
                            'Outdoor rain shower',
                            'Dedicated personal assistant',
                            'Curated minibar with craft beverages',
                        ],
                        'order': 5,
                        'image_patterns': ['Gold Beach Villa'],
                    },
                    {
                        'name': 'Gold Beach Private Pool Villa',
                        'description': 'Beachfront villa with private pool, outdoor pavilion, and personalized service.',
                        'price_per_night': Decimal('780.00'),
                        'occupancy_adults': 3,
                        'occupancy_children': 1,
                        'bed_configuration': '1 King Bed + Day Bed',
                        'amenities': [
                            'Private infinity pool',
                            'Beachfront location',
                            'Outdoor dining pavilion',
                            'Butler service',
                        ],
                        'order': 6,
                        'image_patterns': ['Gold Beach Private Pool Villa'],
                    },
                    {
                        'name': 'Beach Room',
                        'description': 'Contemporary beach-level room with direct beach access and modern amenities.',
                        'price_per_night': Decimal('520.00'),
                        'occupancy_adults': 2,
                        'occupancy_children': 1,
                        'bed_configuration': '1 King Bed',
                        'amenities': [
                            'Direct beach access',
                            'Private terrace',
                            'Modern bathroom',
                            'Music entertainment system',
                        ],
                        'order': 7,
                        'image_patterns': ['Beach Room.jpg', 'Beach Room'],
                    },
                    {
                        'name': 'Beach Room with Pool',
                        'description': 'Beach room featuring a private plunge pool and outdoor living space.',
                        'price_per_night': Decimal('650.00'),
                        'occupancy_adults': 2,
                        'occupancy_children': 1,
                        'bed_configuration': '1 King Bed',
                        'amenities': [
                            'Private plunge pool',
                            'Beach access',
                            'Outdoor shower',
                            'Premium amenities',
                        ],
                        'order': 8,
                        'image_patterns': ['Beach Room with Pool'],
                    },
                    {
                        'name': 'Platinum Overwater Villa',
                        'description': 'Elegant overwater villa with expansive deck, lagoon views, and direct water access.',
                        'price_per_night': Decimal('850.00'),
                        'occupancy_adults': 2,
                        'occupancy_children': 1,
                        'bed_configuration': '1 King Bed',
                        'amenities': [
                            'Overwater deck with loungers',
                            'Glass floor panels',
                            'Direct lagoon access',
                            'Premium entertainment system',
                        ],
                        'order': 9,
                        'image_patterns': ['Platinum Overwater Villa'],
                    },
                    {
                        'name': 'Platinum Overwater Private Pool Villa',
                        'description': 'Signature overwater retreat featuring a plunge pool, panoramic lagoon views, and private stairway to the Indian Ocean.',
                        'price_per_night': Decimal('950.00'),
                        'occupancy_adults': 3,
                        'occupancy_children': 1,
                        'bed_configuration': '1 King Bed + Day Bed',
                        'amenities': [
                            'Private infinity plunge pool',
                            'Outdoor dining pavilion',
                            'Dedicated villa host',
                            'Direct lagoon access with reef snorkeling',
                        ],
                        'order': 10,
                        'image_patterns': ['Platinum Overwater Private Pool Villa'],
                    },
                    {
                        'name': 'Diamond Overwater Private Pool Villa',
                        'description': 'Ultimate luxury overwater villa with expansive pool, multiple decks, and exclusive amenities.',
                        'price_per_night': Decimal('1200.00'),
                        'occupancy_adults': 3,
                        'occupancy_children': 2,
                        'bed_configuration': '1 King Bed + Sofa Bed',
                        'amenities': [
                            'Large private pool',
                            'Multiple sun decks',
                            'Butler service',
                            'Premium dining experiences',
                        ],
                        'order': 11,
                        'image_patterns': ['Diamond Overwater Private Pool Villa'],
                    },
                    {
                        'name': 'Rock Star Villa',
                        'description': 'Premium villa with rock-and-roll inspired design, private pool, and VIP amenities.',
                        'price_per_night': Decimal('1400.00'),
                        'occupancy_adults': 4,
                        'occupancy_children': 2,
                        'bed_configuration': '2 King Beds',
                        'amenities': [
                            'Rock memorabilia collection',
                            'Private recording studio access',
                            'Exclusive concert tickets',
                            'VIP lounge access',
                        ],
                        'order': 12,
                        'image_patterns': ['Rock Star Villa'],
                    },
                    {
                        'name': 'Rock Royalty Overwater Private Pool Villa',
                        'description': 'The ultimate Hard Rock experience with overwater luxury, private pool, and legendary service.',
                        'price_per_night': Decimal('1800.00'),
                        'occupancy_adults': 4,
                        'occupancy_children': 2,
                        'bed_configuration': '2 King Beds + Sofa Bed',
                        'amenities': [
                            'Expansive private pool',
                            'Multiple entertainment areas',
                            'Personal concierge',
                            'Exclusive experiences',
                        ],
                        'order': 13,
                        'image_patterns': ['Rock Royalty Overwater Private Pool Villa'],
                    },
                ],
            },
            {
                'name': 'OZEN Reserve Bolifushi',
                'folder_name': 'Ozen Reserve Bolifushi',
                'description': 'Ultra-luxe private island delivering the exclusive INDULGENCE™ plan, curated dining, and tailored wellness every moment of the stay.',
                'detailed_description': 'OZEN Reserve Bolifushi is a sanctuary of refined privacy with expansive villas, world-class dining, and the ELE|NA Elements of Nature spa. Guests arrive by luxury catamaran, explore the house reef with marine biologists, and indulge in premium beverage pairings across signature restaurants.',
                'category': 'luxury',
                'star_rating': 5,
                'atoll': 'South Malé Atoll',
                'island_name': 'Bolifushi',
                'price_per_night_from': Decimal('980.00'),
                'price_per_night_to': Decimal('2800.00'),
                'highlights': [
                    'INDULGENCE™ all-inclusive fine dining and premium beverages',
                    'Private butler service for every villa and residence',
                    'Overwater hammam and world-class wellness journeys',
                ],
                'room_types': [
                    {
                        'name': 'Earth Pool Villa Sunrise',
                        'description': 'Beachfront villa with private pool facing sunrise, offering tranquil mornings and direct beach access.',
                        'price_per_night': Decimal('980.00'),
                        'occupancy_adults': 3,
                        'occupancy_children': 2,
                        'bed_configuration': '1 King Bed + Day Bed',
                        'amenities': [
                            'Private 8-metre lap pool',
                            'Sunrise views',
                            'Dedicated butler service',
                            'Outdoor rain shower',
                        ],
                        'order': 1,
                        'image_patterns': ['Earth Pool Villa Sunrise'],
                    },
                    {
                        'name': 'Earth Pool Villa Sunset',
                        'description': 'Beachfront villa with private pool facing sunset, perfect for romantic evenings.',
                        'price_per_night': Decimal('980.00'),
                        'occupancy_adults': 3,
                        'occupancy_children': 2,
                        'bed_configuration': '1 King Bed + Day Bed',
                        'amenities': [
                            'Private 8-metre lap pool',
                            'Sunset views',
                            'Dedicated butler service',
                            'Garden bathtub',
                        ],
                        'order': 2,
                        'image_patterns': ['Earth Pool Villa Sunset'],
                    },
                    {
                        'name': 'Earth Pool Pavilion 2BR',
                        'description': 'Spacious two-bedroom beach pavilion with private pool and family-friendly amenities.',
                        'price_per_night': Decimal('1650.00'),
                        'occupancy_adults': 4,
                        'occupancy_children': 3,
                        'bed_configuration': '2 King Beds',
                        'amenities': [
                            'Two separate bedrooms',
                            'Large private pool',
                            'Family butler service',
                            'Multiple bathrooms',
                        ],
                        'order': 3,
                        'image_patterns': ['Earth Pool Pavilion 2BR'],
                    },
                    {
                        'name': 'Earth Pool RESERVE 2BR',
                        'description': 'Exclusive two-bedroom beach reserve with enhanced privacy and premium amenities.',
                        'price_per_night': Decimal('2200.00'),
                        'occupancy_adults': 4,
                        'occupancy_children': 3,
                        'bed_configuration': '2 King Beds',
                        'amenities': [
                            'Enhanced privacy',
                            'Premium pool area',
                            'Dedicated chef service',
                            'Private beach section',
                        ],
                        'order': 4,
                        'image_patterns': ['Earth Pool RESERVE 2BR'],
                    },
                    {
                        'name': 'Earth Pool RESERVE 3BR',
                        'description': 'Ultimate three-bedroom beach reserve with private spa, gym, and personalized service.',
                        'price_per_night': Decimal('2800.00'),
                        'occupancy_adults': 6,
                        'occupancy_children': 3,
                        'bed_configuration': '3 King Beds',
                        'amenities': [
                            'Three bedrooms',
                            'Private spa pavilion',
                            'Personal gym',
                            'Dedicated staff team',
                        ],
                        'order': 5,
                        'image_patterns': ['Earth Pool RESERVE 3BR'],
                    },
                    {
                        'name': 'Ocean Pool Suite',
                        'description': 'Overwater sanctuary with infinity pool, glass floor panels, and panoramic lagoon sunrise views.',
                        'price_per_night': Decimal('1450.00'),
                        'occupancy_adults': 2,
                        'occupancy_children': 2,
                        'bed_configuration': '1 King Bed + Sofa Bed',
                        'amenities': [
                            'Private infinity pool overlooking lagoon',
                            'Glass floor living room',
                            'In-suite spa treatments on request',
                            '24-hour butler service',
                        ],
                        'order': 6,
                        'image_patterns': ['Ocean Pool Suite.webp', 'Ocean Pool Suite'],
                    },
                    {
                        'name': 'Ocean Pool Suite with Slide',
                        'description': 'Fun overwater suite featuring a pool with water slide, perfect for families.',
                        'price_per_night': Decimal('1550.00'),
                        'occupancy_adults': 3,
                        'occupancy_children': 2,
                        'bed_configuration': '1 King Bed + Sofa Bed',
                        'amenities': [
                            'Private pool with water slide',
                            'Family-friendly design',
                            'Glass floor panels',
                            'Butler service',
                        ],
                        'order': 7,
                        'image_patterns': ['Ocean Pool Suite with Slide'],
                    },
                    {
                        'name': 'Ocean Pool RESERVE with Slide 2BR',
                        'description': 'Two-bedroom overwater reserve with pool slide and exclusive amenities.',
                        'price_per_night': Decimal('2400.00'),
                        'occupancy_adults': 4,
                        'occupancy_children': 3,
                        'bed_configuration': '2 King Beds',
                        'amenities': [
                            'Two bedrooms overwater',
                            'Pool with water slide',
                            'Private dining deck',
                            'Dedicated butler team',
                        ],
                        'order': 8,
                        'image_patterns': ['Ocean Pool RESERVE with Slide 2BR'],
                    },
                    {
                        'name': 'Royal RESERVE',
                        'description': 'Three-bedroom private reserve featuring its own spa pavilion, gym, private beach, and opulent Arabian-style decor.',
                        'price_per_night': Decimal('2800.00'),
                        'occupancy_adults': 6,
                        'occupancy_children': 3,
                        'bed_configuration': '3 King Beds',
                        'amenities': [
                            'Private gym and spa pavilion',
                            'Dedicated chef and host team',
                            'Personalized dining at exclusive pier',
                            'Private stretch of beach with cabanas',
                        ],
                        'order': 9,
                        'image_patterns': ['Royal RESERVE'],
                    },
                ],
            },
            {
                'name': 'SAii Lagoon Maldives',
                'folder_name': 'Saii Lagoon Maldives',
                'description': 'A tropical lifestyle hub where artfully designed spaces, artisanal dining, and barefoot fun unite at CROSSROADS Maldives.',
                'detailed_description': 'SAii Lagoon Maldives celebrates art-forward design and easygoing discovery. Sip handcrafted coffees at bean/Co, balance your senses at Len Be Well spa, and wander the vibrant eateries of The Marina. Families love the Junior Beach Club, while couples escape to sandbank picnics or sunset cruises.',
                'category': 'luxury',
                'star_rating': 5,
                'atoll': 'South Malé Atoll',
                'island_name': 'Emboodhoo Lagoon',
                'price_per_night_from': Decimal('380.00'),
                'price_per_night_to': Decimal('710.00'),
                'highlights': [
                    'Creative hub access with dining and retail at CROSSROADS',
                    'Len Be Well spa rituals inspired by island botanicals',
                    'Complimentary non-motorised water sports',
                ],
                'room_types': [
                    {
                        'name': 'Sky Room',
                        'description': 'Upper-level retreat with private balcony, calming lagoon palette, and rainfall shower bathroom.',
                        'price_per_night': Decimal('380.00'),
                        'occupancy_adults': 2,
                        'occupancy_children': 1,
                        'bed_configuration': '1 King Bed or 2 Twin Beds',
                        'amenities': [
                            'Private balcony with seating',
                            'Rainfall shower and premium bath amenities',
                            'Nespresso machine and tea bar',
                            'Complimentary Wi-Fi and Chromecast streaming',
                        ],
                        'order': 1,
                        'image_patterns': ['Sky Room'],
                    },
                    {
                        'name': 'Sky Family Room',
                        'description': 'Spacious family room on upper level with multiple sleeping areas and family amenities.',
                        'price_per_night': Decimal('520.00'),
                        'occupancy_adults': 3,
                        'occupancy_children': 2,
                        'bed_configuration': '1 King Bed + 2 Twin Beds',
                        'amenities': [
                            'Family-sized accommodation',
                            'Multiple sleeping areas',
                            'Kids entertainment',
                            'Balcony with lagoon views',
                        ],
                        'order': 2,
                        'image_patterns': ['Sky Family Room'],
                    },
                    {
                        'name': 'Beach Villa',
                        'description': 'Beachfront escape with shaded veranda, outdoor shower, and access to the island\'s turquoise lagoon.',
                        'price_per_night': Decimal('520.00'),
                        'occupancy_adults': 2,
                        'occupancy_children': 2,
                        'bed_configuration': '1 King Bed + Day Bed',
                        'amenities': [
                            'Beachfront terrace with loungers',
                            'Open-air rain shower',
                            'Portable Bluetooth speaker',
                            'Curated pillow menu',
                        ],
                        'order': 3,
                        'image_patterns': ['Beach Villa.webp', 'Beach Villa'],
                    },
                    {
                        'name': 'Beach Villa with Pool',
                        'description': 'Beachfront villa featuring a private pool and outdoor living spaces.',
                        'price_per_night': Decimal('650.00'),
                        'occupancy_adults': 2,
                        'occupancy_children': 2,
                        'bed_configuration': '1 King Bed + Day Bed',
                        'amenities': [
                            'Private plunge pool',
                            'Beachfront location',
                            'Outdoor shower',
                            'Premium amenities',
                        ],
                        'order': 4,
                        'image_patterns': ['Beach Villa with Pool'],
                    },
                    {
                        'name': '2-Bedroom Family Beach Room',
                        'description': 'Ground-level two-bedroom accommodation perfect for families, close to the beach.',
                        'price_per_night': Decimal('680.00'),
                        'occupancy_adults': 4,
                        'occupancy_children': 2,
                        'bed_configuration': '1 King Bed + 2 Twin Beds',
                        'amenities': [
                            'Two separate bedrooms',
                            'Family living area',
                            'Beach access',
                            'Kids amenities',
                        ],
                        'order': 5,
                        'image_patterns': ['2-Bedroom Family Beach Room.webp', '2-Bedroom Family Beach Room'],
                    },
                    {
                        'name': '2-Bedroom Family Beach Room with Pool',
                        'description': 'Two-bedroom family accommodation with private pool and beach access.',
                        'price_per_night': Decimal('820.00'),
                        'occupancy_adults': 4,
                        'occupancy_children': 2,
                        'bed_configuration': '1 King Bed + 2 Twin Beds',
                        'amenities': [
                            'Private pool',
                            'Two bedrooms',
                            'Beach access',
                            'Family entertainment',
                        ],
                        'order': 6,
                        'image_patterns': ['2-Bedroom Family Beach Room with Pool'],
                    },
                    {
                        'name': '2-Bedroom Beach Villa with Pool',
                        'description': 'Spacious two-bedroom beach villa with private pool and extensive outdoor areas.',
                        'price_per_night': Decimal('950.00'),
                        'occupancy_adults': 4,
                        'occupancy_children': 2,
                        'bed_configuration': '2 King Beds',
                        'amenities': [
                            'Large private pool',
                            'Two master bedrooms',
                            'Outdoor dining area',
                            'Butler service available',
                        ],
                        'order': 7,
                        'image_patterns': ['2-Bedroom Beach Villa with Pool'],
                    },
                    {
                        'name': 'Overwater Villa',
                        'description': 'Stylish villa perched above the lagoon with overwater hammock, soaking tub, and breezy indoor-outdoor living.',
                        'price_per_night': Decimal('710.00'),
                        'occupancy_adults': 3,
                        'occupancy_children': 1,
                        'bed_configuration': '1 King Bed + Sofa Bed',
                        'amenities': [
                            'Private terrace with overwater hammock',
                            'Freestanding soaking tub',
                            'Direct lagoon access ladder',
                            'Curated minibar with artisanal treats',
                        ],
                        'order': 8,
                        'image_patterns': ['Overwater Villa'],
                    },
                    {
                        'name': '2-Bedroom Overwater Villa with Pool',
                        'description': 'Luxurious two-bedroom overwater villa with private pool and panoramic views.',
                        'price_per_night': Decimal('1200.00'),
                        'occupancy_adults': 4,
                        'occupancy_children': 2,
                        'bed_configuration': '2 King Beds',
                        'amenities': [
                            'Private overwater pool',
                            'Two bedrooms',
                            'Multiple sun decks',
                            'Premium service',
                        ],
                        'order': 9,
                        'image_patterns': ['2-Bedroom Overwater Villa with Pool'],
                    },
                ],
            },
            {
                'name': 'Sun Siyam Iru Fushi',
                'folder_name': 'Sun Siyam Iru Fushi',
                'description': 'Vast playground in Noonu Atoll with 15 dining destinations, award-winning spa, and immersive adventures for every traveler.',
                'detailed_description': 'Sun Siyam Iru Fushi spans 52 acres of tropical gardens with an acclaimed house reef, dedicated dive centre, and the region\'s most comprehensive spa sanctuary. Culinary discovery spans Maldivian seafood grills to Japanese teppanyaki. Families love the Koamas Kidz Club, while couples indulge in adults-only infinity pools.',
                'category': 'luxury',
                'star_rating': 5,
                'atoll': 'Noonu Atoll',
                'island_name': 'Iru Fushi',
                'price_per_night_from': Decimal('320.00'),
                'price_per_night_to': Decimal('1200.00'),
                'highlights': [
                    '15 dining and bar destinations across the island',
                    'Overwater spa with hydrotherapy circuit',
                    'Dedicated dive, snorkel, and water sports centre',
                ],
                'room_types': [
                    {
                        'name': 'Deluxe Beach Villa',
                        'description': 'Spacious villa nestled among palms with terrace daybed, open-air bathroom, and direct beach access.',
                        'price_per_night': Decimal('320.00'),
                        'occupancy_adults': 2,
                        'occupancy_children': 2,
                        'bed_configuration': '1 King Bed + Day Bed',
                        'amenities': [
                            'Private outdoor cabana',
                            'Open-air bathroom with rain shower',
                            'Complimentary snorkelling gear',
                            'Personal butler on request',
                        ],
                        'order': 1,
                        'image_patterns': ['Deluxe Beach Villa.jpg', 'Deluxe Beach Villa'],
                    },
                    {
                        'name': 'Deluxe Beach Villa with Pool',
                        'description': 'Enhanced beach villa featuring a private pool and expanded outdoor living space.',
                        'price_per_night': Decimal('450.00'),
                        'occupancy_adults': 2,
                        'occupancy_children': 2,
                        'bed_configuration': '1 King Bed + Day Bed',
                        'amenities': [
                            'Private plunge pool',
                            'Beach access',
                            'Outdoor cabana',
                            'Premium amenities',
                        ],
                        'order': 2,
                        'image_patterns': ['Deluxe Beach Villa with Pool'],
                    },
                    {
                        'name': 'Family Deluxe Beach Villa with Pool',
                        'description': 'Two-bedroom retreat with private courtyard pool, family lounge, and shaded outdoor dining pavilion.',
                        'price_per_night': Decimal('690.00'),
                        'occupancy_adults': 4,
                        'occupancy_children': 2,
                        'bed_configuration': '1 King Bed + 2 Twin Beds',
                        'amenities': [
                            'Private freshwater pool',
                            'Family lounge with games and media',
                            'Outdoor rain shower and daybed',
                            'Personalized family activity planning',
                        ],
                        'order': 3,
                        'image_patterns': ['Family Deluxe Beach Villa with Pool'],
                    },
                    {
                        'name': 'Pool Beach Villa',
                        'description': 'Beachfront villa with generous pool and tropical garden setting.',
                        'price_per_night': Decimal('520.00'),
                        'occupancy_adults': 3,
                        'occupancy_children': 1,
                        'bed_configuration': '1 King Bed + Sofa Bed',
                        'amenities': [
                            'Large private pool',
                            'Garden setting',
                            'Beach access',
                            'Outdoor dining',
                        ],
                        'order': 4,
                        'image_patterns': ['Pool Beach Villa'],
                    },
                    {
                        'name': 'Water Villa',
                        'description': 'Elegant overwater villa with glass floor panels, sundeck loungers, and panoramic lagoon vistas.',
                        'price_per_night': Decimal('510.00'),
                        'occupancy_adults': 2,
                        'occupancy_children': 1,
                        'bed_configuration': '1 King Bed',
                        'amenities': [
                            'Private sun deck with loungers',
                            'Glass floor viewing panels',
                            'Direct lagoon access',
                            'In-villa dining service',
                        ],
                        'order': 5,
                        'image_patterns': ['Water Villa'],
                    },
                    {
                        'name': 'Infinity Water Villa',
                        'description': 'Overwater villa with infinity edge deck and uninterrupted ocean views.',
                        'price_per_night': Decimal('620.00'),
                        'occupancy_adults': 2,
                        'occupancy_children': 1,
                        'bed_configuration': '1 King Bed',
                        'amenities': [
                            'Infinity edge deck',
                            'Panoramic views',
                            'Glass floor',
                            'Premium service',
                        ],
                        'order': 6,
                        'image_patterns': ['irufushi_infinity_water_villa'],
                    },
                    {
                        'name': 'Horizon Water Villa with Pool',
                        'description': 'Overwater villa with private pool and horizon views.',
                        'price_per_night': Decimal('750.00'),
                        'occupancy_adults': 2,
                        'occupancy_children': 1,
                        'bed_configuration': '1 King Bed',
                        'amenities': [
                            'Private overwater pool',
                            'Horizon views',
                            'Sun deck',
                            'Butler service',
                        ],
                        'order': 7,
                        'image_patterns': ['horizon-water-villa-with-pool', 'sunset-horizon-water-villa-with-pool'],
                    },
                    {
                        'name': 'Aqua Retreat',
                        'description': 'Exclusive overwater retreat with enhanced privacy and luxury amenities.',
                        'price_per_night': Decimal('920.00'),
                        'occupancy_adults': 3,
                        'occupancy_children': 1,
                        'bed_configuration': '1 King Bed + Day Bed',
                        'amenities': [
                            'Enhanced privacy',
                            'Premium amenities',
                            'Large deck',
                            'Personalized service',
                        ],
                        'order': 8,
                        'image_patterns': ['Aqua Retreat'],
                    },
                    {
                        'name': 'Hidden Retreat',
                        'description': 'Secluded villa offering ultimate privacy with exclusive amenities.',
                        'price_per_night': Decimal('980.00'),
                        'occupancy_adults': 3,
                        'occupancy_children': 1,
                        'bed_configuration': '1 King Bed + Day Bed',
                        'amenities': [
                            'Ultimate privacy',
                            'Exclusive location',
                            'Premium facilities',
                            'Dedicated service',
                        ],
                        'order': 9,
                        'image_patterns': ['Hidden Retreat'],
                    },
                    {
                        'name': 'Celebrity Retreat',
                        'description': 'Ultra-luxurious retreat with VIP amenities and personalized service.',
                        'price_per_night': Decimal('1200.00'),
                        'occupancy_adults': 4,
                        'occupancy_children': 2,
                        'bed_configuration': '2 King Beds',
                        'amenities': [
                            'VIP amenities',
                            'Private chef available',
                            'Exclusive experiences',
                            'Concierge service',
                        ],
                        'order': 10,
                        'image_patterns': ['irufushi_-celeb_retreat'],
                    },
                ],
            },
            {
                'name': 'Sun Siyam Iru Veli',
                'folder_name': 'Sun Siyam Iru Veli',
                'description': 'Intimate boutique resort in Dhaalu Atoll offering personalized luxury, pristine beaches, and world-class diving.',
                'detailed_description': 'Sun Siyam Iru Veli is an adults-only paradise featuring spacious villas, gourmet dining, and exceptional dive sites. The resort combines contemporary design with Maldivian charm, offering guests a serene escape with personalized service and unforgettable experiences.',
                'category': 'luxury',
                'star_rating': 5,
                'atoll': 'Dhaalu Atoll',
                'island_name': 'Iru Veli',
                'price_per_night_from': Decimal('420.00'),
                'price_per_night_to': Decimal('1500.00'),
                'highlights': [
                    'Adults-only boutique resort',
                    'World-class diving and house reef',
                    'Personalized butler service',
                ],
                'room_types': [
                    {
                        'name': 'Beach Suite with Pool',
                        'description': 'Elegant beach suite with private pool and direct beach access.',
                        'price_per_night': Decimal('420.00'),
                        'occupancy_adults': 2,
                        'occupancy_children': 0,
                        'bed_configuration': '1 King Bed',
                        'amenities': [
                            'Private plunge pool',
                            'Direct beach access',
                            'Outdoor shower',
                            'Butler service',
                        ],
                        'order': 1,
                        'image_patterns': ['beach-suite-with-pool'],
                    },
                    {
                        'name': 'Grand Beach Suite',
                        'description': 'Spacious beach suite with enhanced amenities and larger pool.',
                        'price_per_night': Decimal('580.00'),
                        'occupancy_adults': 2,
                        'occupancy_children': 0,
                        'bed_configuration': '1 King Bed',
                        'amenities': [
                            'Large private pool',
                            'Expansive deck',
                            'Premium amenities',
                            'Personal butler',
                        ],
                        'order': 2,
                        'image_patterns': ['iruveli_grand_beach_suite'],
                    },
                    {
                        'name': 'Family Suite with Pool',
                        'description': 'Two-bedroom family suite with pool, perfect for families seeking luxury.',
                        'price_per_night': Decimal('720.00'),
                        'occupancy_adults': 4,
                        'occupancy_children': 2,
                        'bed_configuration': '2 King Beds',
                        'amenities': [
                            'Two bedrooms',
                            'Private pool',
                            'Family amenities',
                            'Beach access',
                        ],
                        'order': 3,
                        'image_patterns': ['iruveli_family_suite_with_pool'],
                    },
                    {
                        'name': 'Two Bedroom Beach Residence with Pool',
                        'description': 'Expansive two-bedroom residence with large pool and premium facilities.',
                        'price_per_night': Decimal('950.00'),
                        'occupancy_adults': 4,
                        'occupancy_children': 2,
                        'bed_configuration': '2 King Beds',
                        'amenities': [
                            'Expansive pool',
                            'Two master bedrooms',
                            'Private dining area',
                            'Dedicated butler',
                        ],
                        'order': 4,
                        'image_patterns': ['Two Bedroom Beach Residence with Pool'],
                    },
                    {
                        'name': 'King Ocean Suite',
                        'description': 'Overwater suite with king-sized luxury and ocean views.',
                        'price_per_night': Decimal('650.00'),
                        'occupancy_adults': 2,
                        'occupancy_children': 0,
                        'bed_configuration': '1 King Bed',
                        'amenities': [
                            'Overwater location',
                            'Ocean views',
                            'Glass floor',
                            'Premium service',
                        ],
                        'order': 5,
                        'image_patterns': ['iruveli_king_ocean_suite'],
                    },
                    {
                        'name': 'Grand Ocean Suite',
                        'description': 'Spacious overwater suite with enhanced amenities and panoramic views.',
                        'price_per_night': Decimal('780.00'),
                        'occupancy_adults': 2,
                        'occupancy_children': 0,
                        'bed_configuration': '1 King Bed',
                        'amenities': [
                            'Expansive deck',
                            'Panoramic views',
                            'Luxury bathroom',
                            'Butler service',
                        ],
                        'order': 6,
                        'image_patterns': ['iruveli_grand_ocean_suite'],
                    },
                    {
                        'name': 'Ocean Suite with Pool',
                        'description': 'Overwater suite featuring a private pool and stunning ocean vistas.',
                        'price_per_night': Decimal('920.00'),
                        'occupancy_adults': 2,
                        'occupancy_children': 0,
                        'bed_configuration': '1 King Bed',
                        'amenities': [
                            'Private overwater pool',
                            'Ocean views',
                            'Sun deck',
                            'Premium amenities',
                        ],
                        'order': 7,
                        'image_patterns': ['iruveli_ocean_suite_with_pool'],
                    },
                    {
                        'name': 'Dolphin Suite',
                        'description': 'Exclusive overwater suite with dolphin watching opportunities.',
                        'price_per_night': Decimal('1100.00'),
                        'occupancy_adults': 2,
                        'occupancy_children': 0,
                        'bed_configuration': '1 King Bed',
                        'amenities': [
                            'Prime location',
                            'Dolphin viewing',
                            'Private pool',
                            'VIP service',
                        ],
                        'order': 8,
                        'image_patterns': ['iruveli_dolphin_suite'],
                    },
                    {
                        'name': 'Sun Aqua Sultan Suite',
                        'description': 'The ultimate overwater experience with expansive space and royal treatment.',
                        'price_per_night': Decimal('1500.00'),
                        'occupancy_adults': 3,
                        'occupancy_children': 0,
                        'bed_configuration': '1 King Bed + Day Bed',
                        'amenities': [
                            'Royal amenities',
                            'Largest overwater villa',
                            'Private spa',
                            'Dedicated staff',
                        ],
                        'order': 9,
                        'image_patterns': ['sun-aqua-sultan-suite'],
                    },
                ],
            },
            {
                'name': 'Sun Siyam Olhuveli',
                'folder_name': 'Sun Siyam Olhuveli',
                'description': 'Expansive island resort in South Malé Atoll offering diverse accommodation, multiple dining options, and endless activities.',
                'detailed_description': 'Sun Siyam Olhuveli features pristine beaches, vibrant house reef, and a wide range of water sports. The resort caters to families, couples, and adventure seekers with its diverse villa types, excellent dining, and comprehensive facilities.',
                'category': 'luxury',
                'star_rating': 5,
                'atoll': 'South Malé Atoll',
                'island_name': 'Olhuveli',
                'price_per_night_from': Decimal('280.00'),
                'price_per_night_to': Decimal('1200.00'),
                'highlights': [
                    'Expansive island with diverse accommodation',
                    'Excellent house reef for snorkeling',
                    'Multiple dining and entertainment options',
                ],
                'room_types': [
                    {
                        'name': 'Beach Villa',
                        'description': 'Comfortable beach villa with modern amenities and beach access.',
                        'price_per_night': Decimal('280.00'),
                        'occupancy_adults': 2,
                        'occupancy_children': 2,
                        'bed_configuration': '1 King Bed',
                        'amenities': [
                            'Beach access',
                            'Private terrace',
                            'Modern bathroom',
                            'Air conditioning',
                        ],
                        'order': 1,
                        'image_patterns': ['olhuveli_beachvilla'],
                    },
                    {
                        'name': 'Deluxe Beach Villa',
                        'description': 'Enhanced beach villa with upgraded amenities and larger space.',
                        'price_per_night': Decimal('350.00'),
                        'occupancy_adults': 2,
                        'occupancy_children': 2,
                        'bed_configuration': '1 King Bed',
                        'amenities': [
                            'Upgraded amenities',
                            'Spacious layout',
                            'Beach access',
                            'Premium bathroom',
                        ],
                        'order': 2,
                        'image_patterns': ['deluxe-beach-villa'],
                    },
                    {
                        'name': 'Romantic Beach Villa with Pool',
                        'description': 'Intimate beach villa with private pool, perfect for couples.',
                        'price_per_night': Decimal('480.00'),
                        'occupancy_adults': 2,
                        'occupancy_children': 0,
                        'bed_configuration': '1 King Bed',
                        'amenities': [
                            'Private plunge pool',
                            'Romantic setting',
                            'Beach access',
                            'Premium amenities',
                        ],
                        'order': 3,
                        'image_patterns': ['romantic_beach_villa_with_pool'],
                    },
                    {
                        'name': 'Grand Beach Villa with Pool',
                        'description': 'Spacious beach villa with large pool and extensive outdoor areas.',
                        'price_per_night': Decimal('620.00'),
                        'occupancy_adults': 3,
                        'occupancy_children': 1,
                        'bed_configuration': '1 King Bed + Sofa Bed',
                        'amenities': [
                            'Large private pool',
                            'Spacious villa',
                            'Outdoor living',
                            'Premium service',
                        ],
                        'order': 4,
                        'image_patterns': ['Grand Beach Villa with Pool'],
                    },
                    {
                        'name': 'Grand Beach Suite with Pool',
                        'description': 'Luxurious beach suite with pool and separate living areas.',
                        'price_per_night': Decimal('750.00'),
                        'occupancy_adults': 3,
                        'occupancy_children': 2,
                        'bed_configuration': '1 King Bed + Sofa Bed',
                        'amenities': [
                            'Separate living area',
                            'Private pool',
                            'Beach access',
                            'Butler service',
                        ],
                        'order': 5,
                        'image_patterns': ['grand-beach-suite-with-pool'],
                    },
                    {
                        'name': '2BR Beach Residence with Pool',
                        'description': 'Two-bedroom beach residence with pool, ideal for families.',
                        'price_per_night': Decimal('920.00'),
                        'occupancy_adults': 4,
                        'occupancy_children': 2,
                        'bed_configuration': '2 King Beds',
                        'amenities': [
                            'Two bedrooms',
                            'Large pool',
                            'Family amenities',
                            'Spacious living',
                        ],
                        'order': 6,
                        'image_patterns': ['2br-beach-residence-with-pool'],
                    },
                    {
                        'name': 'Two Bedroom Beach Suite',
                        'description': 'Spacious two-bedroom suite on the beach with premium facilities.',
                        'price_per_night': Decimal('850.00'),
                        'occupancy_adults': 4,
                        'occupancy_children': 2,
                        'bed_configuration': '2 King Beds',
                        'amenities': [
                            'Two bedrooms',
                            'Beach location',
                            'Premium amenities',
                            'Family-friendly',
                        ],
                        'order': 7,
                        'image_patterns': ['two-bed-room-beach-suite'],
                    },
                    {
                        'name': 'Water Villa',
                        'description': 'Classic overwater villa with direct lagoon access.',
                        'price_per_night': Decimal('420.00'),
                        'occupancy_adults': 2,
                        'occupancy_children': 1,
                        'bed_configuration': '1 King Bed',
                        'amenities': [
                            'Overwater location',
                            'Direct lagoon access',
                            'Sun deck',
                            'Ocean views',
                        ],
                        'order': 8,
                        'image_patterns': ['olhuveli-water-villa'],
                    },
                    {
                        'name': 'Deluxe Water Villa',
                        'description': 'Enhanced overwater villa with upgraded amenities and views.',
                        'price_per_night': Decimal('520.00'),
                        'occupancy_adults': 2,
                        'occupancy_children': 1,
                        'bed_configuration': '1 King Bed',
                        'amenities': [
                            'Premium overwater',
                            'Enhanced amenities',
                            'Larger deck',
                            'Better views',
                        ],
                        'order': 9,
                        'image_patterns': ['deluxe-water-villa'],
                    },
                    {
                        'name': 'Romantic Water Villa with Pool',
                        'description': 'Overwater villa with private pool, designed for romance.',
                        'price_per_night': Decimal('680.00'),
                        'occupancy_adults': 2,
                        'occupancy_children': 0,
                        'bed_configuration': '1 King Bed',
                        'amenities': [
                            'Private overwater pool',
                            'Romantic ambiance',
                            'Premium service',
                            'Sunset views',
                        ],
                        'order': 10,
                        'image_patterns': ['romantic_water_villa_with_pool'],
                    },
                    {
                        'name': 'Grand Water Villa',
                        'description': 'Spacious overwater villa with extensive deck and amenities.',
                        'price_per_night': Decimal('620.00'),
                        'occupancy_adults': 2,
                        'occupancy_children': 1,
                        'bed_configuration': '1 King Bed',
                        'amenities': [
                            'Spacious layout',
                            'Large deck',
                            'Premium amenities',
                            'Ocean views',
                        ],
                        'order': 11,
                        'image_patterns': ['Grand Water Villa.jpg', 'Grand Water Villa'],
                    },
                    {
                        'name': 'Grand Water Villa with Pool',
                        'description': 'Luxurious overwater villa with private pool and premium service.',
                        'price_per_night': Decimal('780.00'),
                        'occupancy_adults': 3,
                        'occupancy_children': 1,
                        'bed_configuration': '1 King Bed + Day Bed',
                        'amenities': [
                            'Private pool',
                            'Spacious villa',
                            'Butler service',
                            'Premium facilities',
                        ],
                        'order': 12,
                        'image_patterns': ['Grand Water Villa with Pool'],
                    },
                    {
                        'name': 'Prestige Jacuzzi Water Villa',
                        'description': 'Premium overwater villa with outdoor jacuzzi and luxury amenities.',
                        'price_per_night': Decimal('920.00'),
                        'occupancy_adults': 2,
                        'occupancy_children': 1,
                        'bed_configuration': '1 King Bed',
                        'amenities': [
                            'Outdoor jacuzzi',
                            'Premium location',
                            'Luxury amenities',
                            'VIP service',
                        ],
                        'order': 13,
                        'image_patterns': ['olhuveli-prestige-jacuzzi-water-villa'],
                    },
                    {
                        'name': 'Presidential Water Suite',
                        'description': 'The ultimate overwater experience with presidential-level luxury.',
                        'price_per_night': Decimal('1200.00'),
                        'occupancy_adults': 4,
                        'occupancy_children': 2,
                        'bed_configuration': '2 King Beds',
                        'amenities': [
                            'Presidential amenities',
                            'Largest overwater',
                            'Private butler',
                            'Exclusive experiences',
                        ],
                        'order': 14,
                        'image_patterns': ['Presidential Water Suite'],
                    },
                ],
            },
            {
                'name': 'Sun Siyam Vilu Reef',
                'folder_name': 'Sun Siyam Vilu Reef',
                'description': 'Charming island resort in Dhaalu Atoll offering authentic Maldivian hospitality, pristine beaches, and excellent diving.',
                'detailed_description': 'Sun Siyam Vilu Reef combines natural beauty with modern comfort. The resort features spacious villas, diverse dining options, and a vibrant house reef. Perfect for families and couples seeking a relaxed island experience with quality service.',
                'category': 'luxury',
                'star_rating': 5,
                'atoll': 'Dhaalu Atoll',
                'island_name': 'Vilu Reef',
                'price_per_night_from': Decimal('320.00'),
                'price_per_night_to': Decimal('950.00'),
                'highlights': [
                    'Authentic Maldivian hospitality',
                    'Excellent house reef',
                    'Family-friendly facilities',
                ],
                'room_types': [
                    {
                        'name': 'Beach Villa',
                        'description': 'Comfortable beach villa with tropical garden and beach access.',
                        'price_per_night': Decimal('320.00'),
                        'occupancy_adults': 2,
                        'occupancy_children': 2,
                        'bed_configuration': '1 King Bed',
                        'amenities': [
                            'Beach access',
                            'Garden setting',
                            'Modern amenities',
                            'Private terrace',
                        ],
                        'order': 1,
                        'image_patterns': ['vilu_reef_beach_villa'],
                    },
                    {
                        'name': 'Deluxe Beach Villa',
                        'description': 'Enhanced beach villa with upgraded amenities and larger space.',
                        'price_per_night': Decimal('380.00'),
                        'occupancy_adults': 2,
                        'occupancy_children': 2,
                        'bed_configuration': '1 King Bed',
                        'amenities': [
                            'Upgraded amenities',
                            'Spacious layout',
                            'Beach access',
                            'Premium bathroom',
                        ],
                        'order': 2,
                        'image_patterns': ['Deluxe Beach Villa'],
                    },
                    {
                        'name': 'Jacuzzi Deluxe Beach Villa',
                        'description': 'Beach villa with outdoor jacuzzi and premium amenities.',
                        'price_per_night': Decimal('480.00'),
                        'occupancy_adults': 2,
                        'occupancy_children': 1,
                        'bed_configuration': '1 King Bed',
                        'amenities': [
                            'Outdoor jacuzzi',
                            'Beach access',
                            'Premium amenities',
                            'Private garden',
                        ],
                        'order': 3,
                        'image_patterns': ['vilu_reef_jacuzzi_deluxe_beach_villa'],
                    },
                    {
                        'name': 'Sun Aqua Pool Villa',
                        'description': 'Luxurious beach villa with private pool and premium service.',
                        'price_per_night': Decimal('620.00'),
                        'occupancy_adults': 3,
                        'occupancy_children': 1,
                        'bed_configuration': '1 King Bed + Day Bed',
                        'amenities': [
                            'Private pool',
                            'Beach location',
                            'Premium service',
                            'Outdoor living',
                        ],
                        'order': 4,
                        'image_patterns': ['vilu_reef_sun_aqua_pool_villa'],
                    },
                    {
                        'name': 'Reef Villa',
                        'description': 'Overwater villa with direct reef access and ocean views.',
                        'price_per_night': Decimal('450.00'),
                        'occupancy_adults': 2,
                        'occupancy_children': 1,
                        'bed_configuration': '1 King Bed',
                        'amenities': [
                            'Overwater location',
                            'Reef access',
                            'Ocean views',
                            'Sun deck',
                        ],
                        'order': 5,
                        'image_patterns': ['vilu_reef_reef_villa'],
                    },
                    {
                        'name': 'Sunset Reef Villa',
                        'description': 'Overwater villa positioned for stunning sunset views.',
                        'price_per_night': Decimal('480.00'),
                        'occupancy_adults': 2,
                        'occupancy_children': 1,
                        'bed_configuration': '1 King Bed',
                        'amenities': [
                            'Sunset views',
                            'Overwater location',
                            'Reef access',
                            'Premium amenities',
                        ],
                        'order': 6,
                        'image_patterns': ['vilu_reef_sunset-_reef_villa'],
                    },
                    {
                        'name': 'Aqua Villa',
                        'description': 'Spacious overwater villa with enhanced amenities and views.',
                        'price_per_night': Decimal('580.00'),
                        'occupancy_adults': 2,
                        'occupancy_children': 1,
                        'bed_configuration': '1 King Bed',
                        'amenities': [
                            'Spacious layout',
                            'Premium amenities',
                            'Ocean views',
                            'Large deck',
                        ],
                        'order': 7,
                        'image_patterns': ['vilu_reef_aqua_villa'],
                    },
                    {
                        'name': 'Grand Water Villa with Pool',
                        'description': 'Luxurious overwater villa with private pool and premium service.',
                        'price_per_night': Decimal('750.00'),
                        'occupancy_adults': 3,
                        'occupancy_children': 1,
                        'bed_configuration': '1 King Bed + Day Bed',
                        'amenities': [
                            'Private overwater pool',
                            'Spacious villa',
                            'Butler service',
                            'Premium facilities',
                        ],
                        'order': 8,
                        'image_patterns': ['Grand Water Villa with Pool'],
                    },
                    {
                        'name': 'Two Bedroom Water Villa with Pool',
                        'description': 'Expansive two-bedroom overwater villa with pool, perfect for families.',
                        'price_per_night': Decimal('950.00'),
                        'occupancy_adults': 4,
                        'occupancy_children': 2,
                        'bed_configuration': '2 King Beds',
                        'amenities': [
                            'Two bedrooms',
                            'Private pool',
                            'Family amenities',
                            'Spacious living',
                        ],
                        'order': 9,
                        'image_patterns': ['Two Bedroom Water Villa with Pool'],
                    },
                ],
            },
            {
                'name': 'Sun Siyam World',
                'folder_name': 'Sun Siyam World',
                'description': 'Revolutionary island resort offering unlimited experiences, diverse accommodation, and innovative entertainment in Dhaalu Atoll.',
                'detailed_description': 'Sun Siyam World redefines the Maldives experience with its unique "World of Experiences" concept. The resort features multiple islands, diverse dining, water sports, and entertainment options. From beach villas to overwater pavilions, every accommodation offers luxury and comfort.',
                'category': 'luxury',
                'star_rating': 5,
                'atoll': 'Dhaalu Atoll',
                'island_name': 'Sun Siyam World',
                'price_per_night_from': Decimal('380.00'),
                'price_per_night_to': Decimal('1200.00'),
                'highlights': [
                    'Unlimited experiences concept',
                    'Multiple islands to explore',
                    'Innovative entertainment and dining',
                ],
                'room_types': [
                    {
                        'name': 'Beach Suite with Pool',
                        'description': 'Contemporary beach suite with private pool and modern amenities.',
                        'price_per_night': Decimal('380.00'),
                        'occupancy_adults': 2,
                        'occupancy_children': 2,
                        'bed_configuration': '1 King Bed',
                        'amenities': [
                            'Private plunge pool',
                            'Beach access',
                            'Modern design',
                            'Outdoor living',
                        ],
                        'order': 1,
                        'image_patterns': ['beach-suite-with-pool'],
                    },
                    {
                        'name': 'Pool Beach Villa',
                        'description': 'Spacious beach villa with generous pool and tropical setting.',
                        'price_per_night': Decimal('480.00'),
                        'occupancy_adults': 2,
                        'occupancy_children': 2,
                        'bed_configuration': '1 King Bed',
                        'amenities': [
                            'Large private pool',
                            'Beach location',
                            'Tropical garden',
                            'Premium amenities',
                        ],
                        'order': 2,
                        'image_patterns': ['pool-beach-villa'],
                    },
                    {
                        'name': 'Sunset Pool Beach Villa',
                        'description': 'Beach villa with pool positioned for stunning sunset views.',
                        'price_per_night': Decimal('520.00'),
                        'occupancy_adults': 2,
                        'occupancy_children': 2,
                        'bed_configuration': '1 King Bed',
                        'amenities': [
                            'Private pool',
                            'Sunset views',
                            'Beach access',
                            'Premium service',
                        ],
                        'order': 3,
                        'image_patterns': ['sunset-pool-beach-villa'],
                    },
                    {
                        'name': 'Two Bedroom Pool Beach Villa',
                        'description': 'Family villa with two bedrooms, pool, and spacious living areas.',
                        'price_per_night': Decimal('720.00'),
                        'occupancy_adults': 4,
                        'occupancy_children': 2,
                        'bed_configuration': '2 King Beds',
                        'amenities': [
                            'Two bedrooms',
                            'Private pool',
                            'Family amenities',
                            'Beach access',
                        ],
                        'order': 4,
                        'image_patterns': ['two-bedroom-pool-beach-villa'],
                    },
                    {
                        'name': 'Grand Beach Residence with Pool',
                        'description': 'Luxurious beach residence with large pool and premium facilities.',
                        'price_per_night': Decimal('850.00'),
                        'occupancy_adults': 4,
                        'occupancy_children': 2,
                        'bed_configuration': '2 King Beds',
                        'amenities': [
                            'Expansive pool',
                            'Multiple bedrooms',
                            'Butler service',
                            'Premium facilities',
                        ],
                        'order': 5,
                        'image_patterns': ['grand-beach-residence-with-pool'],
                    },
                    {
                        'name': 'Two Story Pool Beach Residence',
                        'description': 'Unique two-story beach residence with pool and panoramic views.',
                        'price_per_night': Decimal('950.00'),
                        'occupancy_adults': 4,
                        'occupancy_children': 2,
                        'bed_configuration': '2 King Beds',
                        'amenities': [
                            'Two-story design',
                            'Private pool',
                            'Panoramic views',
                            'Spacious living',
                        ],
                        'order': 6,
                        'image_patterns': ['Two Story Pool Beach Residence'],
                    },
                    {
                        'name': 'Water Villa with Pool and Slide',
                        'description': 'Fun overwater villa with pool and water slide, perfect for families.',
                        'price_per_night': Decimal('680.00'),
                        'occupancy_adults': 3,
                        'occupancy_children': 2,
                        'bed_configuration': '1 King Bed + Sofa Bed',
                        'amenities': [
                            'Private pool with slide',
                            'Family-friendly',
                            'Overwater location',
                            'Direct lagoon access',
                        ],
                        'order': 7,
                        'image_patterns': ['water-villa-with-pool-and-slide'],
                    },
                    {
                        'name': 'Lagoon Villa with Pool Slide',
                        'description': 'Overwater villa with pool slide and lagoon views.',
                        'price_per_night': Decimal('720.00'),
                        'occupancy_adults': 3,
                        'occupancy_children': 2,
                        'bed_configuration': '1 King Bed + Sofa Bed',
                        'amenities': [
                            'Pool with slide',
                            'Lagoon views',
                            'Family amenities',
                            'Sun deck',
                        ],
                        'order': 8,
                        'image_patterns': ['lagoon-villa-with-pool-slide'],
                    },
                    {
                        'name': 'Two Bedroom Lagoon Villa with Pool and Slide',
                        'description': 'Spacious two-bedroom overwater villa with pool slide.',
                        'price_per_night': Decimal('980.00'),
                        'occupancy_adults': 4,
                        'occupancy_children': 2,
                        'bed_configuration': '2 King Beds',
                        'amenities': [
                            'Two bedrooms',
                            'Pool with slide',
                            'Family-friendly',
                            'Spacious deck',
                        ],
                        'order': 9,
                        'image_patterns': ['two-bedroom-lagoon-villa-with-pool-and-slide'],
                    },
                    {
                        'name': 'Water Pavilion with Slide',
                        'description': 'Premium overwater pavilion with slide and luxury amenities.',
                        'price_per_night': Decimal('1200.00'),
                        'occupancy_adults': 4,
                        'occupancy_children': 2,
                        'bed_configuration': '2 King Beds',
                        'amenities': [
                            'Premium pavilion',
                            'Water slide',
                            'Butler service',
                            'Exclusive amenities',
                        ],
                        'order': 10,
                        'image_patterns': ['water-pavilion-with-slide'],
                    },
                ],
            },
            {
                'name': 'Cinnamon Velifushi Maldives',
                'folder_name': 'Cinnamon Velifushi Maldives',
                'description': 'An intimate island retreat offering authentic Maldivian hospitality with vibrant house reef and water sports.',
                'detailed_description': 'Cinnamon Velifushi is a boutique resort perfect for adventure seekers and diving enthusiasts. The resort features a stunning house reef, multiple dining options, and a range of water sports activities. With its laid-back atmosphere and genuine Maldivian charm, it offers an authentic island experience.',
                'category': 'mid-range',
                'star_rating': 4,
                'atoll': 'South Malé Atoll',
                'island_name': 'Velifushi',
                'price_per_night_from': Decimal('280.00'),
                'price_per_night_to': Decimal('620.00'),
                'highlights': [
                    'Excellent house reef for snorkeling',
                    'Authentic Maldivian experience',
                    'Wide range of water sports',
                ],
                'room_types': [
                    {
                        'name': 'Beach Bungalow',
                        'description': 'Cozy beachfront bungalow with direct beach access and ocean views.',
                        'price_per_night': Decimal('280.00'),
                        'occupancy_adults': 2,
                        'occupancy_children': 1,
                        'bed_configuration': '1 King Bed',
                        'amenities': [
                            'Beach access',
                            'Ocean views',
                            'Air conditioning',
                            'Private terrace',
                        ],
                        'order': 1,
                        'image_patterns': ['Beach Bungalow'],
                    },
                    {
                        'name': 'Superior Beach Loft',
                        'description': 'Spacious loft-style beach accommodation with elevated design and panoramic views.',
                        'price_per_night': Decimal('350.00'),
                        'occupancy_adults': 3,
                        'occupancy_children': 1,
                        'bed_configuration': '1 King Bed + Day Bed',
                        'amenities': [
                            'Loft design',
                            'Panoramic views',
                            'Spacious layout',
                            'Beach access',
                        ],
                        'order': 2,
                        'image_patterns': ['Superior Beach Loft'],
                    },
                    {
                        'name': 'Water Bungalow',
                        'description': 'Overwater bungalow with direct lagoon access and stunning water views.',
                        'price_per_night': Decimal('420.00'),
                        'occupancy_adults': 2,
                        'occupancy_children': 1,
                        'bed_configuration': '1 King Bed',
                        'amenities': [
                            'Overwater deck',
                            'Direct lagoon access',
                            'Glass floor panels',
                            'Outdoor shower',
                        ],
                        'order': 3,
                        'image_patterns': ['Water Bungalow'],
                    },
                    {
                        'name': 'Sunset Water Bungalow with Jacuzzi',
                        'description': 'Premium overwater bungalow with private jacuzzi and sunset views.',
                        'price_per_night': Decimal('520.00'),
                        'occupancy_adults': 2,
                        'occupancy_children': 1,
                        'bed_configuration': '1 King Bed',
                        'amenities': [
                            'Private jacuzzi',
                            'Sunset views',
                            'Overwater deck',
                            'Premium amenities',
                        ],
                        'order': 4,
                        'image_patterns': ['Sunset Water Bungalow with Jacuzzi'],
                    },
                    {
                        'name': 'Water Suite with Pool',
                        'description': 'Luxurious overwater suite featuring private pool and spacious living area.',
                        'price_per_night': Decimal('620.00'),
                        'occupancy_adults': 3,
                        'occupancy_children': 1,
                        'bed_configuration': '1 King Bed + Sofa Bed',
                        'amenities': [
                            'Private pool',
                            'Spacious suite',
                            'Overwater location',
                            'Premium facilities',
                        ],
                        'order': 5,
                        'image_patterns': ['Water Suite with Pool'],
                    },
                ],
            },
            {
                'name': 'Cinnamon Hakuraa Huraa Maldives',
                'folder_name': 'Cinnamon Hakuraa Huraa Maldives',
                'description': 'A serene diving paradise with pristine beaches and world-class house reef.',
                'detailed_description': 'Cinnamon Hakuraa Huraa is renowned for its exceptional diving opportunities and vibrant marine life. This intimate resort offers a perfect blend of relaxation and adventure, with direct access to one of the Maldives\' best house reefs. The resort features comfortable accommodations and authentic Maldivian hospitality.',
                'category': 'mid-range',
                'star_rating': 4,
                'atoll': 'Meemu Atoll',
                'island_name': 'Hakuraa Huraa',
                'price_per_night_from': Decimal('260.00'),
                'price_per_night_to': Decimal('480.00'),
                'highlights': [
                    'World-class diving and snorkeling',
                    'Pristine house reef',
                    'Intimate island atmosphere',
                ],
                'room_types': [
                    {
                        'name': 'Beach Bungalow',
                        'description': 'Traditional beachfront bungalow with garden and ocean views.',
                        'price_per_night': Decimal('260.00'),
                        'occupancy_adults': 2,
                        'occupancy_children': 1,
                        'bed_configuration': '1 King Bed',
                        'amenities': [
                            'Beach access',
                            'Garden views',
                            'Air conditioning',
                            'Private terrace',
                        ],
                        'order': 1,
                        'image_patterns': ['Beach Bungalow'],
                    },
                    {
                        'name': 'Platinum Beach Bungalow',
                        'description': 'Premium beachfront bungalow with enhanced amenities and prime location.',
                        'price_per_night': Decimal('320.00'),
                        'occupancy_adults': 2,
                        'occupancy_children': 1,
                        'bed_configuration': '1 King Bed',
                        'amenities': [
                            'Prime beach location',
                            'Enhanced amenities',
                            'Spacious terrace',
                            'Ocean views',
                        ],
                        'order': 2,
                        'image_patterns': ['Platinum Beach Bungalow'],
                    },
                    {
                        'name': 'Water Bungalow',
                        'description': 'Classic overwater bungalow with direct lagoon access.',
                        'price_per_night': Decimal('380.00'),
                        'occupancy_adults': 2,
                        'occupancy_children': 1,
                        'bed_configuration': '1 King Bed',
                        'amenities': [
                            'Overwater deck',
                            'Direct lagoon access',
                            'Ocean views',
                            'Outdoor shower',
                        ],
                        'order': 3,
                        'image_patterns': ['Water Bungalow'],
                    },
                    {
                        'name': 'Sunset Water Bungalow',
                        'description': 'Overwater bungalow positioned for spectacular sunset views.',
                        'price_per_night': Decimal('480.00'),
                        'occupancy_adults': 2,
                        'occupancy_children': 1,
                        'bed_configuration': '1 King Bed',
                        'amenities': [
                            'Sunset views',
                            'Overwater deck',
                            'Premium location',
                            'Direct lagoon access',
                        ],
                        'order': 4,
                        'image_patterns': ['Sunset Water Bungalow'],
                    },
                ],
            },
            {
                'name': 'Cinnamon Dhonveli Maldives',
                'folder_name': 'Cinnamon Dhonveli Maldives',
                'description': 'A surfer\'s paradise with legendary waves and authentic Maldivian charm.',
                'detailed_description': 'Cinnamon Dhonveli is famous for its world-class surf breaks and vibrant atmosphere. The resort caters to both surfers and beach lovers, offering a perfect mix of adventure and relaxation. With its proximity to Malé and excellent facilities, it provides an ideal Maldivian getaway.',
                'category': 'mid-range',
                'star_rating': 4,
                'atoll': 'North Malé Atoll',
                'island_name': 'Dhonveli',
                'price_per_night_from': Decimal('240.00'),
                'price_per_night_to': Decimal('580.00'),
                'highlights': [
                    'World-famous surf breaks',
                    'Vibrant atmosphere',
                    'Close to Malé',
                ],
                'room_types': [
                    {
                        'name': 'Superior Room Ocean View',
                        'description': 'Comfortable room with stunning ocean views and modern amenities.',
                        'price_per_night': Decimal('240.00'),
                        'occupancy_adults': 2,
                        'occupancy_children': 1,
                        'bed_configuration': '1 King Bed',
                        'amenities': [
                            'Ocean views',
                            'Modern amenities',
                            'Air conditioning',
                            'Balcony',
                        ],
                        'order': 1,
                        'image_patterns': ['Superior Room Ocean View'],
                    },
                    {
                        'name': 'Duplex Garden Bungalow',
                        'description': 'Two-level garden bungalow perfect for families with spacious layout.',
                        'price_per_night': Decimal('320.00'),
                        'occupancy_adults': 3,
                        'occupancy_children': 2,
                        'bed_configuration': '1 King Bed + 2 Twin Beds',
                        'amenities': [
                            'Duplex design',
                            'Garden setting',
                            'Family-friendly',
                            'Spacious layout',
                        ],
                        'order': 2,
                        'image_patterns': ['Duplex Garden Bungalow'],
                    },
                    {
                        'name': 'Beach Bungalow',
                        'description': 'Traditional beachfront bungalow with direct beach access.',
                        'price_per_night': Decimal('350.00'),
                        'occupancy_adults': 2,
                        'occupancy_children': 1,
                        'bed_configuration': '1 King Bed',
                        'amenities': [
                            'Beach access',
                            'Ocean views',
                            'Private terrace',
                            'Traditional design',
                        ],
                        'order': 3,
                        'image_patterns': ['Beach Bungalow'],
                    },
                    {
                        'name': 'Junior Beach Suite',
                        'description': 'Spacious beachfront suite with enhanced amenities and living area.',
                        'price_per_night': Decimal('420.00'),
                        'occupancy_adults': 3,
                        'occupancy_children': 1,
                        'bed_configuration': '1 King Bed + Sofa Bed',
                        'amenities': [
                            'Spacious suite',
                            'Living area',
                            'Beach access',
                            'Premium amenities',
                        ],
                        'order': 4,
                        'image_patterns': ['Junior Beach Suite'],
                    },
                    {
                        'name': 'Beach Suite with Pool',
                        'description': 'Luxurious beach suite featuring private pool and direct beach access.',
                        'price_per_night': Decimal('520.00'),
                        'occupancy_adults': 3,
                        'occupancy_children': 1,
                        'bed_configuration': '1 King Bed + Day Bed',
                        'amenities': [
                            'Private pool',
                            'Beach access',
                            'Spacious suite',
                            'Premium facilities',
                        ],
                        'order': 5,
                        'image_patterns': ['Beach Suite with Pool'],
                    },
                    {
                        'name': 'Water Bungalow',
                        'description': 'Classic overwater bungalow with lagoon access and ocean views.',
                        'price_per_night': Decimal('450.00'),
                        'occupancy_adults': 2,
                        'occupancy_children': 1,
                        'bed_configuration': '1 King Bed',
                        'amenities': [
                            'Overwater deck',
                            'Direct lagoon access',
                            'Ocean views',
                            'Outdoor shower',
                        ],
                        'order': 6,
                        'image_patterns': ['Water Bungalow'],
                    },
                    {
                        'name': 'Over Water Suite',
                        'description': 'Premium overwater suite with spacious deck and luxurious amenities.',
                        'price_per_night': Decimal('580.00'),
                        'occupancy_adults': 3,
                        'occupancy_children': 1,
                        'bed_configuration': '1 King Bed + Sofa Bed',
                        'amenities': [
                            'Spacious suite',
                            'Large overwater deck',
                            'Premium amenities',
                            'Direct lagoon access',
                        ],
                        'order': 7,
                        'image_patterns': ['Over Water Suite'],
                    },
                ],
            },
            {
                'name': 'Ellaidhoo Maldives by Cinnamon',
                'folder_name': 'Ellaidhoo Maldives by Cinnamon',
                'description': 'A diver\'s haven with exceptional house reef and authentic island experience.',
                'detailed_description': 'Ellaidhoo Maldives by Cinnamon is a small, intimate resort perfect for diving enthusiasts. The resort is surrounded by one of the Maldives\' best house reefs, offering incredible marine biodiversity right at your doorstep. With its laid-back atmosphere and excellent diving facilities, it\'s ideal for underwater explorers.',
                'category': 'mid-range',
                'star_rating': 3,
                'atoll': 'North Ari Atoll',
                'island_name': 'Ellaidhoo',
                'price_per_night_from': Decimal('220.00'),
                'price_per_night_to': Decimal('380.00'),
                'highlights': [
                    'Exceptional house reef',
                    'Intimate diving resort',
                    'Authentic Maldivian experience',
                ],
                'room_types': [
                    {
                        'name': 'Standard Room',
                        'description': 'Comfortable garden-view room with essential amenities.',
                        'price_per_night': Decimal('220.00'),
                        'occupancy_adults': 2,
                        'occupancy_children': 1,
                        'bed_configuration': '1 King Bed',
                        'amenities': [
                            'Garden views',
                            'Air conditioning',
                            'Essential amenities',
                            'Close to beach',
                        ],
                        'order': 1,
                        'image_patterns': ['Standard Room'],
                    },
                    {
                        'name': 'Beach Bungalow',
                        'description': 'Beachfront bungalow with direct beach access and ocean views.',
                        'price_per_night': Decimal('280.00'),
                        'occupancy_adults': 2,
                        'occupancy_children': 1,
                        'bed_configuration': '1 King Bed',
                        'amenities': [
                            'Beach access',
                            'Ocean views',
                            'Private terrace',
                            'Traditional design',
                        ],
                        'order': 2,
                        'image_patterns': ['Beach Bungalow'],
                    },
                    {
                        'name': 'Water Bungalow',
                        'description': 'Overwater bungalow with direct reef access for snorkeling.',
                        'price_per_night': Decimal('380.00'),
                        'occupancy_adults': 2,
                        'occupancy_children': 1,
                        'bed_configuration': '1 King Bed',
                        'amenities': [
                            'Overwater deck',
                            'Direct reef access',
                            'Snorkeling from room',
                            'Ocean views',
                        ],
                        'order': 3,
                        'image_patterns': ['Water Bungalow'],
                    },
                ],
            },
            {
                'name': 'Velassaru Maldives',
                'folder_name': 'Velassaru Maldives',
                'description': 'A chic boutique resort offering sophisticated luxury and vibrant atmosphere near Malé.',
                'detailed_description': 'Velassaru Maldives combines contemporary design with Maldivian charm, creating a sophisticated island retreat. Located just minutes from Malé, the resort offers stylish accommodations, world-class dining, and a vibrant atmosphere. Perfect for couples and honeymooners seeking modern luxury.',
                'category': 'luxury',
                'star_rating': 5,
                'atoll': 'South Malé Atoll',
                'island_name': 'Velassaru',
                'price_per_night_from': Decimal('450.00'),
                'price_per_night_to': Decimal('980.00'),
                'highlights': [
                    'Contemporary boutique resort',
                    'Close to Malé',
                    'Vibrant dining scene',
                ],
                'room_types': [
                    {
                        'name': 'Deluxe Villa',
                        'description': 'Stylish beach villa with modern amenities and garden views.',
                        'price_per_night': Decimal('450.00'),
                        'occupancy_adults': 2,
                        'occupancy_children': 1,
                        'bed_configuration': '1 King Bed',
                        'amenities': [
                            'Garden views',
                            'Modern design',
                            'Outdoor shower',
                            'Close to beach',
                        ],
                        'order': 1,
                        'image_patterns': ['Deluxe-Villa'],
                    },
                    {
                        'name': 'Beach Villa with Pool',
                        'description': 'Beachfront villa featuring private pool and direct beach access.',
                        'price_per_night': Decimal('580.00'),
                        'occupancy_adults': 2,
                        'occupancy_children': 1,
                        'bed_configuration': '1 King Bed',
                        'amenities': [
                            'Private pool',
                            'Beach access',
                            'Modern design',
                            'Outdoor living',
                        ],
                        'order': 2,
                        'image_patterns': ['Beach-Villa-with-Pool'],
                    },
                    {
                        'name': 'Pool Villa',
                        'description': 'Garden villa with private pool and contemporary design.',
                        'price_per_night': Decimal('520.00'),
                        'occupancy_adults': 2,
                        'occupancy_children': 1,
                        'bed_configuration': '1 King Bed',
                        'amenities': [
                            'Private pool',
                            'Garden setting',
                            'Modern amenities',
                            'Outdoor shower',
                        ],
                        'order': 3,
                        'image_patterns': ['Pool-Villa'],
                    },
                    {
                        'name': 'Deluxe Villa with Pool',
                        'description': 'Enhanced villa with private pool and premium amenities.',
                        'price_per_night': Decimal('620.00'),
                        'occupancy_adults': 3,
                        'occupancy_children': 1,
                        'bed_configuration': '1 King Bed + Day Bed',
                        'amenities': [
                            'Private pool',
                            'Premium amenities',
                            'Spacious layout',
                            'Modern design',
                        ],
                        'order': 4,
                        'image_patterns': ['deluxe-deluxe-villa-with-pool'],
                    },
                    {
                        'name': 'Water Villa',
                        'description': 'Overwater villa with direct lagoon access and stunning views.',
                        'price_per_night': Decimal('680.00'),
                        'occupancy_adults': 2,
                        'occupancy_children': 1,
                        'bed_configuration': '1 King Bed',
                        'amenities': [
                            'Overwater deck',
                            'Direct lagoon access',
                            'Ocean views',
                            'Modern design',
                        ],
                        'order': 5,
                        'image_patterns': ['Water_Villas_Lagoon-2'],
                    },
                    {
                        'name': 'Water Bungalow with Pool',
                        'description': 'Overwater bungalow featuring private pool and spacious deck.',
                        'price_per_night': Decimal('780.00'),
                        'occupancy_adults': 2,
                        'occupancy_children': 1,
                        'bed_configuration': '1 King Bed',
                        'amenities': [
                            'Private pool',
                            'Overwater deck',
                            'Lagoon access',
                            'Premium amenities',
                        ],
                        'order': 6,
                        'image_patterns': ['Water-Bungalow-with-Pool'],
                    },
                    {
                        'name': 'Water Villa with Pool',
                        'description': 'Luxurious overwater villa with private pool and panoramic views.',
                        'price_per_night': Decimal('820.00'),
                        'occupancy_adults': 3,
                        'occupancy_children': 1,
                        'bed_configuration': '1 King Bed + Sofa Bed',
                        'amenities': [
                            'Private pool',
                            'Panoramic views',
                            'Spacious villa',
                            'Premium facilities',
                        ],
                        'order': 7,
                        'image_patterns': ['Water-Villa-with-Pool'],
                    },
                    {
                        'name': 'Water Suite',
                        'description': 'Spacious overwater suite with enhanced living space and premium amenities.',
                        'price_per_night': Decimal('880.00'),
                        'occupancy_adults': 3,
                        'occupancy_children': 1,
                        'bed_configuration': '1 King Bed + Sofa Bed',
                        'amenities': [
                            'Spacious suite',
                            'Living area',
                            'Overwater location',
                            'Premium amenities',
                        ],
                        'order': 8,
                        'image_patterns': ['water-suite'],
                    },
                    {
                        'name': '2BR Deluxe Villa',
                        'description': 'Two-bedroom villa perfect for families with spacious layout and pool.',
                        'price_per_night': Decimal('980.00'),
                        'occupancy_adults': 4,
                        'occupancy_children': 2,
                        'bed_configuration': '2 King Beds',
                        'amenities': [
                            'Two bedrooms',
                            'Private pool',
                            'Family-friendly',
                            'Spacious layout',
                        ],
                        'order': 9,
                        'image_patterns': ['2BR-Deluxe-Villa'],
                    },
                ],
            },
            {
                'name': 'Kuramathi Maldives',
                'folder_name': 'Kuramathi Maldives',
                'description': 'One of the largest resort islands offering diverse experiences and extensive facilities.',
                'detailed_description': 'Kuramathi Maldives spans across three islands connected by walkways, offering an unparalleled variety of accommodations, dining options, and activities. With its long sandbanks, vibrant house reef, and extensive facilities, the resort caters to all types of travelers from families to couples.',
                'category': 'mid-range',
                'star_rating': 4,
                'atoll': 'Rasdhoo Atoll',
                'island_name': 'Kuramathi',
                'price_per_night_from': Decimal('320.00'),
                'price_per_night_to': Decimal('920.00'),
                'highlights': [
                    'Largest resort island',
                    'Extensive dining options',
                    'Long pristine sandbanks',
                ],
                'room_types': [
                    {
                        'name': 'Beach Villa',
                        'description': 'Comfortable beachfront villa with garden and ocean views.',
                        'price_per_night': Decimal('320.00'),
                        'occupancy_adults': 2,
                        'occupancy_children': 1,
                        'bed_configuration': '1 King Bed',
                        'amenities': [
                            'Beach access',
                            'Garden views',
                            'Air conditioning',
                            'Private terrace',
                        ],
                        'order': 1,
                        'image_patterns': ['00-beach-villas'],
                    },
                    {
                        'name': 'Beach Villa with Jacuzzi',
                        'description': 'Beachfront villa featuring outdoor jacuzzi and enhanced amenities.',
                        'price_per_night': Decimal('420.00'),
                        'occupancy_adults': 2,
                        'occupancy_children': 1,
                        'bed_configuration': '1 King Bed',
                        'amenities': [
                            'Outdoor jacuzzi',
                            'Beach access',
                            'Premium amenities',
                            'Private terrace',
                        ],
                        'order': 2,
                        'image_patterns': ['01-beach-villas-with-jacuzzi'],
                    },
                    {
                        'name': 'Superior Beach Villa with Jacuzzi',
                        'description': 'Enhanced beach villa with jacuzzi and prime beachfront location.',
                        'price_per_night': Decimal('480.00'),
                        'occupancy_adults': 3,
                        'occupancy_children': 1,
                        'bed_configuration': '1 King Bed + Day Bed',
                        'amenities': [
                            'Outdoor jacuzzi',
                            'Prime location',
                            'Spacious villa',
                            'Beach access',
                        ],
                        'order': 3,
                        'image_patterns': ['02-superior-beach-villas-with-jacuzzi'],
                    },
                    {
                        'name': 'Deluxe Beach Villa with Jacuzzi',
                        'description': 'Luxurious beach villa with jacuzzi and premium facilities.',
                        'price_per_night': Decimal('550.00'),
                        'occupancy_adults': 3,
                        'occupancy_children': 1,
                        'bed_configuration': '1 King Bed + Sofa Bed',
                        'amenities': [
                            'Outdoor jacuzzi',
                            'Premium facilities',
                            'Spacious layout',
                            'Beach access',
                        ],
                        'order': 4,
                        'image_patterns': ['03-deluxe-beach-villas-with-jacuzzi'],
                    },
                    {
                        'name': 'Two Bedroom Beach House',
                        'description': 'Spacious two-bedroom beach house perfect for families.',
                        'price_per_night': Decimal('780.00'),
                        'occupancy_adults': 4,
                        'occupancy_children': 2,
                        'bed_configuration': '2 King Beds',
                        'amenities': [
                            'Two bedrooms',
                            'Family-friendly',
                            'Spacious layout',
                            'Beach access',
                        ],
                        'order': 5,
                        'image_patterns': ['04-two-bedroom-beach-houses'],
                    },
                    {
                        'name': 'Water Villa with Jacuzzi',
                        'description': 'Overwater villa with outdoor jacuzzi and lagoon access.',
                        'price_per_night': Decimal('520.00'),
                        'occupancy_adults': 2,
                        'occupancy_children': 1,
                        'bed_configuration': '1 King Bed',
                        'amenities': [
                            'Outdoor jacuzzi',
                            'Overwater deck',
                            'Lagoon access',
                            'Ocean views',
                        ],
                        'order': 6,
                        'image_patterns': ['05-water-villas-with-jacuzzi'],
                    },
                    {
                        'name': 'Deluxe Water Villa',
                        'description': 'Premium overwater villa with enhanced space and amenities.',
                        'price_per_night': Decimal('620.00'),
                        'occupancy_adults': 3,
                        'occupancy_children': 1,
                        'bed_configuration': '1 King Bed + Sofa Bed',
                        'amenities': [
                            'Spacious villa',
                            'Premium amenities',
                            'Overwater location',
                            'Lagoon access',
                        ],
                        'order': 7,
                        'image_patterns': ['06-deluxe-water-villas'],
                    },
                    {
                        'name': 'Water Villa with Pool',
                        'description': 'Luxurious overwater villa featuring private pool.',
                        'price_per_night': Decimal('720.00'),
                        'occupancy_adults': 3,
                        'occupancy_children': 1,
                        'bed_configuration': '1 King Bed + Day Bed',
                        'amenities': [
                            'Private pool',
                            'Overwater deck',
                            'Premium facilities',
                            'Lagoon access',
                        ],
                        'order': 8,
                        'image_patterns': ['07-water-villas-with-pool'],
                    },
                    {
                        'name': 'Sunset Pool Villa',
                        'description': 'Premium overwater villa with pool and spectacular sunset views.',
                        'price_per_night': Decimal('820.00'),
                        'occupancy_adults': 3,
                        'occupancy_children': 1,
                        'bed_configuration': '1 King Bed + Sofa Bed',
                        'amenities': [
                            'Private pool',
                            'Sunset views',
                            'Premium location',
                            'Spacious villa',
                        ],
                        'order': 9,
                        'image_patterns': ['08-sunset-pool-villas'],
                    },
                    {
                        'name': 'Honeymoon Pool Villa',
                        'description': 'Romantic overwater villa with pool, perfect for couples.',
                        'price_per_night': Decimal('850.00'),
                        'occupancy_adults': 2,
                        'occupancy_children': 0,
                        'bed_configuration': '1 King Bed',
                        'amenities': [
                            'Private pool',
                            'Romantic setting',
                            'Premium amenities',
                            'Overwater location',
                        ],
                        'order': 10,
                        'image_patterns': ['10-honeymoon-pool-villas'],
                    },
                    {
                        'name': 'Thundi Water Villa with Pool',
                        'description': 'Exclusive overwater villa with pool in prime location.',
                        'price_per_night': Decimal('920.00'),
                        'occupancy_adults': 3,
                        'occupancy_children': 1,
                        'bed_configuration': '1 King Bed + Sofa Bed',
                        'amenities': [
                            'Private pool',
                            'Exclusive location',
                            'Premium facilities',
                            'Spacious villa',
                        ],
                        'order': 11,
                        'image_patterns': ['Thundi Water Villas with Pool'],
                    },
                ],
            },
            {
                'name': 'Kurumba Maldives',
                'folder_name': 'Kurumba Maldives',
                'description': 'The Maldives\' first private island resort offering timeless luxury near Malé.',
                'detailed_description': 'Kurumba Maldives holds a special place in Maldivian tourism history as the first resort. Located just minutes from Malé, it combines convenience with luxury, offering diverse accommodations, excellent dining, and a beautiful beach. Perfect for both business and leisure travelers.',
                'category': 'luxury',
                'star_rating': 5,
                'atoll': 'North Malé Atoll',
                'island_name': 'Vihamanaafushi',
                'price_per_night_from': Decimal('380.00'),
                'price_per_night_to': Decimal('1200.00'),
                'highlights': [
                    'First resort in Maldives',
                    'Close to Malé airport',
                    'Extensive facilities',
                ],
                'room_types': [
                    {
                        'name': 'Superior Room',
                        'description': 'Comfortable garden-view room with modern amenities.',
                        'price_per_night': Decimal('380.00'),
                        'occupancy_adults': 2,
                        'occupancy_children': 1,
                        'bed_configuration': '1 King Bed',
                        'amenities': [
                            'Garden views',
                            'Modern amenities',
                            'Air conditioning',
                            'Close to beach',
                        ],
                        'order': 1,
                        'image_patterns': ['Superior Room'],
                    },
                    {
                        'name': 'Deluxe Bungalow',
                        'description': 'Spacious garden bungalow with private terrace.',
                        'price_per_night': Decimal('480.00'),
                        'occupancy_adults': 2,
                        'occupancy_children': 1,
                        'bed_configuration': '1 King Bed',
                        'amenities': [
                            'Garden setting',
                            'Private terrace',
                            'Spacious layout',
                            'Modern design',
                        ],
                        'order': 2,
                        'image_patterns': ['Deluxe Bungalow'],
                    },
                    {
                        'name': 'Two Bedroom Superior Room',
                        'description': 'Family room with two bedrooms and connecting layout.',
                        'price_per_night': Decimal('680.00'),
                        'occupancy_adults': 4,
                        'occupancy_children': 2,
                        'bed_configuration': '2 King Beds',
                        'amenities': [
                            'Two bedrooms',
                            'Family-friendly',
                            'Connecting rooms',
                            'Spacious layout',
                        ],
                        'order': 3,
                        'image_patterns': ['Two Bedroom Superior Room'],
                    },
                    {
                        'name': 'Beachfront Deluxe Bungalow',
                        'description': 'Premium beachfront bungalow with direct beach access.',
                        'price_per_night': Decimal('620.00'),
                        'occupancy_adults': 3,
                        'occupancy_children': 1,
                        'bed_configuration': '1 King Bed + Day Bed',
                        'amenities': [
                            'Beachfront location',
                            'Direct beach access',
                            'Premium amenities',
                            'Private terrace',
                        ],
                        'order': 4,
                        'image_patterns': ['Beachfront Deluxe Bungalow'],
                    },
                    {
                        'name': 'Beach Villa',
                        'description': 'Spacious beach villa with modern design and ocean views.',
                        'price_per_night': Decimal('720.00'),
                        'occupancy_adults': 3,
                        'occupancy_children': 1,
                        'bed_configuration': '1 King Bed + Sofa Bed',
                        'amenities': [
                            'Beach access',
                            'Ocean views',
                            'Modern design',
                            'Spacious villa',
                        ],
                        'order': 5,
                        'image_patterns': ['Beach Villa'],
                    },
                    {
                        'name': 'Garden Pool Villa',
                        'description': 'Garden villa featuring private pool and tropical setting.',
                        'price_per_night': Decimal('820.00'),
                        'occupancy_adults': 3,
                        'occupancy_children': 1,
                        'bed_configuration': '1 King Bed + Day Bed',
                        'amenities': [
                            'Private pool',
                            'Garden setting',
                            'Premium amenities',
                            'Outdoor living',
                        ],
                        'order': 6,
                        'image_patterns': ['Garden Pool Villa'],
                    },
                    {
                        'name': 'Deluxe Pool Villa',
                        'description': 'Luxurious villa with private pool and enhanced facilities.',
                        'price_per_night': Decimal('920.00'),
                        'occupancy_adults': 3,
                        'occupancy_children': 1,
                        'bed_configuration': '1 King Bed + Sofa Bed',
                        'amenities': [
                            'Private pool',
                            'Premium facilities',
                            'Spacious layout',
                            'Modern design',
                        ],
                        'order': 7,
                        'image_patterns': ['Deluxe Pool Villa'],
                    },
                    {
                        'name': 'Family Villa',
                        'description': 'Spacious family villa with multiple rooms and pool.',
                        'price_per_night': Decimal('1050.00'),
                        'occupancy_adults': 4,
                        'occupancy_children': 2,
                        'bed_configuration': '2 King Beds',
                        'amenities': [
                            'Private pool',
                            'Multiple rooms',
                            'Family-friendly',
                            'Spacious layout',
                        ],
                        'order': 8,
                        'image_patterns': ['Family Villa'],
                    },
                    {
                        'name': 'Two Bedroom Kurumba Residence',
                        'description': 'Ultimate luxury residence with two bedrooms and private pool.',
                        'price_per_night': Decimal('1200.00'),
                        'occupancy_adults': 4,
                        'occupancy_children': 2,
                        'bed_configuration': '2 King Beds',
                        'amenities': [
                            'Two bedrooms',
                            'Private pool',
                            'Premium residence',
                            'Butler service',
                        ],
                        'order': 9,
                        'image_patterns': ['Two Bedroom Kurumba Residence'],
                    },
                ],
            },
            {
                'name': 'Dhigufaru Island Resort',
                'folder_name': 'Dhigufaru Island Resort',
                'description': 'An intimate boutique resort offering barefoot luxury and pristine natural beauty.',
                'detailed_description': 'Dhigufaru Island Resort is a hidden gem in the Baa Atoll UNESCO Biosphere Reserve. This boutique resort offers an authentic Maldivian experience with its natural island beauty, excellent diving, and intimate atmosphere. Perfect for those seeking tranquility and unspoiled nature.',
                'category': 'mid-range',
                'star_rating': 4,
                'atoll': 'Baa Atoll',
                'island_name': 'Dhigufaru',
                'price_per_night_from': Decimal('350.00'),
                'price_per_night_to': Decimal('850.00'),
                'highlights': [
                    'UNESCO Biosphere Reserve',
                    'Intimate boutique resort',
                    'Pristine natural beauty',
                ],
                'room_types': [
                    {
                        'name': 'Beach Villa',
                        'description': 'Comfortable beachfront villa with direct beach access.',
                        'price_per_night': Decimal('350.00'),
                        'occupancy_adults': 2,
                        'occupancy_children': 1,
                        'bed_configuration': '1 King Bed',
                        'amenities': [
                            'Beach access',
                            'Ocean views',
                            'Private terrace',
                            'Modern amenities',
                        ],
                        'order': 1,
                        'image_patterns': ['Beach Villa'],
                    },
                    {
                        'name': 'Pool Beach Villa',
                        'description': 'Beach villa featuring private pool and direct beach access.',
                        'price_per_night': Decimal('480.00'),
                        'occupancy_adults': 2,
                        'occupancy_children': 1,
                        'bed_configuration': '1 King Bed',
                        'amenities': [
                            'Private pool',
                            'Beach access',
                            'Ocean views',
                            'Outdoor living',
                        ],
                        'order': 2,
                        'image_patterns': ['Pool Beach Villa'],
                    },
                    {
                        'name': 'Two Bedroom Family Beach Villa',
                        'description': 'Spacious family villa with two bedrooms and beach access.',
                        'price_per_night': Decimal('720.00'),
                        'occupancy_adults': 4,
                        'occupancy_children': 2,
                        'bed_configuration': '2 King Beds',
                        'amenities': [
                            'Two bedrooms',
                            'Family-friendly',
                            'Beach access',
                            'Spacious layout',
                        ],
                        'order': 3,
                        'image_patterns': ['Two Bedroom Family Beach Villa'],
                    },
                    {
                        'name': 'Semi Water Villa',
                        'description': 'Unique semi-overwater villa with lagoon and beach access.',
                        'price_per_night': Decimal('520.00'),
                        'occupancy_adults': 2,
                        'occupancy_children': 1,
                        'bed_configuration': '1 King Bed',
                        'amenities': [
                            'Semi-overwater design',
                            'Lagoon access',
                            'Beach proximity',
                            'Unique experience',
                        ],
                        'order': 4,
                        'image_patterns': ['Semi Water Villa'],
                    },
                    {
                        'name': 'Water Villa',
                        'description': 'Overwater villa with direct lagoon access and stunning views.',
                        'price_per_night': Decimal('580.00'),
                        'occupancy_adults': 2,
                        'occupancy_children': 1,
                        'bed_configuration': '1 King Bed',
                        'amenities': [
                            'Overwater deck',
                            'Direct lagoon access',
                            'Ocean views',
                            'Modern design',
                        ],
                        'order': 5,
                        'image_patterns': ['Water Villa'],
                    },
                    {
                        'name': 'Pool Water Villa',
                        'description': 'Overwater villa featuring private pool and spacious deck.',
                        'price_per_night': Decimal('720.00'),
                        'occupancy_adults': 3,
                        'occupancy_children': 1,
                        'bed_configuration': '1 King Bed + Sofa Bed',
                        'amenities': [
                            'Private pool',
                            'Overwater deck',
                            'Lagoon access',
                            'Premium amenities',
                        ],
                        'order': 6,
                        'image_patterns': ['Pool Water Villa'],
                    },
                    {
                        'name': 'Sangu Suite',
                        'description': 'Luxurious overwater suite with enhanced space and premium facilities.',
                        'price_per_night': Decimal('850.00'),
                        'occupancy_adults': 3,
                        'occupancy_children': 1,
                        'bed_configuration': '1 King Bed + Day Bed',
                        'amenities': [
                            'Spacious suite',
                            'Premium amenities',
                            'Overwater location',
                            'Exclusive facilities',
                        ],
                        'order': 7,
                        'image_patterns': ['Sangu Suite'],
                    },
                ],
            },
            {
                'name': 'Villa Nautica Paradise Island',
                'folder_name': 'Villa Nautica Paradise Island',
                'description': 'An exclusive boutique resort offering Italian-inspired luxury and personalized service.',
                'detailed_description': 'Villa Nautica Paradise Island brings Italian elegance to the Maldives with its sophisticated design and personalized service. This intimate resort features spacious villas, gourmet dining, and a tranquil atmosphere. Perfect for discerning travelers seeking privacy and luxury.',
                'category': 'luxury',
                'star_rating': 5,
                'atoll': 'North Malé Atoll',
                'island_name': 'Paradise Island',
                'price_per_night_from': Decimal('480.00'),
                'price_per_night_to': Decimal('1150.00'),
                'highlights': [
                    'Italian-inspired luxury',
                    'Exclusive boutique resort',
                    'Personalized service',
                ],
                'room_types': [
                    {
                        'name': 'Beach Villa',
                        'description': 'Elegant beach villa with modern design and ocean views.',
                        'price_per_night': Decimal('480.00'),
                        'occupancy_adults': 2,
                        'occupancy_children': 1,
                        'bed_configuration': '1 King Bed',
                        'amenities': [
                            'Beach access',
                            'Ocean views',
                            'Modern design',
                            'Private terrace',
                        ],
                        'order': 1,
                        'image_patterns': ['Villa-Nautica-Beach-Villa'],
                    },
                    {
                        'name': 'Deluxe Beach Pool Villa',
                        'description': 'Beach villa with private pool and enhanced amenities.',
                        'price_per_night': Decimal('620.00'),
                        'occupancy_adults': 2,
                        'occupancy_children': 1,
                        'bed_configuration': '1 King Bed',
                        'amenities': [
                            'Private pool',
                            'Beach access',
                            'Premium amenities',
                            'Outdoor living',
                        ],
                        'order': 2,
                        'image_patterns': ['Villa-Nautica-Deluxe-Beach-Pool-Villa'],
                    },
                    {
                        'name': 'Sunset Beach Pool Villa',
                        'description': 'Beach villa with pool and spectacular sunset views.',
                        'price_per_night': Decimal('680.00'),
                        'occupancy_adults': 2,
                        'occupancy_children': 1,
                        'bed_configuration': '1 King Bed',
                        'amenities': [
                            'Private pool',
                            'Sunset views',
                            'Beach access',
                            'Premium location',
                        ],
                        'order': 3,
                        'image_patterns': ['Villa-Nautica-Sunset-Beach-Pool-Villa'],
                    },
                    {
                        'name': 'Sunset Deluxe Beach Pool Villa',
                        'description': 'Enhanced beach villa with pool and prime sunset location.',
                        'price_per_night': Decimal('750.00'),
                        'occupancy_adults': 3,
                        'occupancy_children': 1,
                        'bed_configuration': '1 King Bed + Day Bed',
                        'amenities': [
                            'Private pool',
                            'Sunset views',
                            'Premium amenities',
                            'Spacious villa',
                        ],
                        'order': 4,
                        'image_patterns': ['Villa-Nautica-Sunset-Deluxe-Beach-Pool-Villa'],
                    },
                    {
                        'name': 'Ocean Beach Pool Villa',
                        'description': 'Beachfront villa with pool and panoramic ocean views.',
                        'price_per_night': Decimal('720.00'),
                        'occupancy_adults': 3,
                        'occupancy_children': 1,
                        'bed_configuration': '1 King Bed + Sofa Bed',
                        'amenities': [
                            'Private pool',
                            'Ocean views',
                            'Beach access',
                            'Premium facilities',
                        ],
                        'order': 5,
                        'image_patterns': ['Villa-Nautica-Ocean-Beach-Pool-Villa'],
                    },
                    {
                        'name': 'Two Bedroom Beach Pool Villa with Two Pools',
                        'description': 'Luxurious two-bedroom villa with two private pools.',
                        'price_per_night': Decimal('1050.00'),
                        'occupancy_adults': 4,
                        'occupancy_children': 2,
                        'bed_configuration': '2 King Beds',
                        'amenities': [
                            'Two bedrooms',
                            'Two private pools',
                            'Family-friendly',
                            'Spacious layout',
                        ],
                        'order': 6,
                        'image_patterns': ['Villa-Nautica-Two-Bedroom-Beach-Pool-Villa-with-Two-Pools'],
                    },
                    {
                        'name': 'Water Villa',
                        'description': 'Overwater villa with direct lagoon access.',
                        'price_per_night': Decimal('780.00'),
                        'occupancy_adults': 2,
                        'occupancy_children': 1,
                        'bed_configuration': '1 King Bed',
                        'amenities': [
                            'Overwater deck',
                            'Direct lagoon access',
                            'Ocean views',
                            'Modern design',
                        ],
                        'order': 7,
                        'image_patterns': ['Villa-Nautica-Water-Villa'],
                    },
                    {
                        'name': 'Water Villa with Whirlpool',
                        'description': 'Overwater villa featuring private whirlpool and spacious deck.',
                        'price_per_night': Decimal('880.00'),
                        'occupancy_adults': 2,
                        'occupancy_children': 1,
                        'bed_configuration': '1 King Bed',
                        'amenities': [
                            'Private whirlpool',
                            'Overwater deck',
                            'Lagoon access',
                            'Premium amenities',
                        ],
                        'order': 8,
                        'image_patterns': ['Villa-Nautica-Water-Villa-with-Whirlpool'],
                    },
                    {
                        'name': 'One Bedroom Ocean Suite with Pool',
                        'description': 'Spacious overwater suite with private pool and living area.',
                        'price_per_night': Decimal('950.00'),
                        'occupancy_adults': 3,
                        'occupancy_children': 1,
                        'bed_configuration': '1 King Bed + Sofa Bed',
                        'amenities': [
                            'Private pool',
                            'Spacious suite',
                            'Living area',
                            'Premium facilities',
                        ],
                        'order': 9,
                        'image_patterns': ['Villa-Nautica-One-Bedroom-Ocean-Suite-with-Pool'],
                    },
                    {
                        'name': 'Two Bedroom Ocean Suite',
                        'description': 'Ultimate overwater suite with two bedrooms and expansive deck.',
                        'price_per_night': Decimal('1150.00'),
                        'occupancy_adults': 4,
                        'occupancy_children': 2,
                        'bed_configuration': '2 King Beds',
                        'amenities': [
                            'Two bedrooms',
                            'Spacious suite',
                            'Overwater location',
                            'Premium amenities',
                        ],
                        'order': 10,
                        'image_patterns': ['Villa-Nautica-Two-Bedroom-Ocean-Suite'],
                    },
                ],
            },
            {
                'name': 'Holiday Inn Resort Kandooma Maldives',
                'folder_name': 'Holiday Inn Resort Kandooma Maldives',
                'description': 'A family-friendly resort offering great value with excellent surf breaks and diving.',
                'detailed_description': 'Holiday Inn Resort Kandooma Maldives combines affordability with quality, making it perfect for families and active travelers. The resort features a famous surf break, excellent diving sites, and a range of activities. With its relaxed atmosphere and good facilities, it offers great value in the Maldives.',
                'category': 'mid-range',
                'star_rating': 4,
                'atoll': 'South Malé Atoll',
                'island_name': 'Kandooma',
                'price_per_night_from': Decimal('280.00'),
                'price_per_night_to': Decimal('750.00'),
                'highlights': [
                    'Family-friendly resort',
                    'Famous surf break',
                    'Great value',
                ],
                'room_types': [
                    {
                        'name': 'Standard Room',
                        'description': 'Comfortable room with modern amenities and garden views.',
                        'price_per_night': Decimal('280.00'),
                        'occupancy_adults': 2,
                        'occupancy_children': 1,
                        'bed_configuration': '1 King Bed',
                        'amenities': [
                            'Garden views',
                            'Modern amenities',
                            'Air conditioning',
                            'Close to beach',
                        ],
                        'order': 1,
                        'image_patterns': ['Standard Rooms'],
                    },
                    {
                        'name': 'Suite',
                        'description': 'Spacious suite with separate living area and enhanced amenities.',
                        'price_per_night': Decimal('420.00'),
                        'occupancy_adults': 3,
                        'occupancy_children': 1,
                        'bed_configuration': '1 King Bed + Sofa Bed',
                        'amenities': [
                            'Living area',
                            'Spacious layout',
                            'Premium amenities',
                            'Ocean views',
                        ],
                        'order': 2,
                        'image_patterns': ['Suite'],
                    },
                    {
                        'name': 'Two Bedroom Suite',
                        'description': 'Family suite with two bedrooms and living space.',
                        'price_per_night': Decimal('580.00'),
                        'occupancy_adults': 4,
                        'occupancy_children': 2,
                        'bed_configuration': '2 King Beds',
                        'amenities': [
                            'Two bedrooms',
                            'Living area',
                            'Family-friendly',
                            'Spacious layout',
                        ],
                        'order': 3,
                        'image_patterns': ['Two Bedroom Suite'],
                    },
                    {
                        'name': 'Three Bedroom Suite',
                        'description': 'Large suite with three bedrooms, perfect for groups.',
                        'price_per_night': Decimal('750.00'),
                        'occupancy_adults': 6,
                        'occupancy_children': 2,
                        'bed_configuration': '3 King Beds',
                        'amenities': [
                            'Three bedrooms',
                            'Group-friendly',
                            'Spacious layout',
                            'Multiple bathrooms',
                        ],
                        'order': 4,
                        'image_patterns': ['Three Bedroom Suite'],
                    },
                    {
                        'name': 'Two and Three Bedroom Villa',
                        'description': 'Exclusive villa with multiple bedrooms and private facilities.',
                        'price_per_night': Decimal('680.00'),
                        'occupancy_adults': 5,
                        'occupancy_children': 2,
                        'bed_configuration': '2-3 King Beds',
                        'amenities': [
                            'Multiple bedrooms',
                            'Private facilities',
                            'Family-friendly',
                            'Spacious villa',
                        ],
                        'order': 5,
                        'image_patterns': ['Two and Three Bedroom Villa'],
                    },
                ],
            },
        ]

