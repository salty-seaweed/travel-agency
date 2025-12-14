"""
Django management command to add Centara Maldives resorts with room types.
Run with: python manage.py add_centara_resorts
Works on both dev and production environments (PostgreSQL).

IMPORTANT: This script uses placeholder images. To get real Centara images:

1. Visit these official gallery pages:
   - Centara Grand Island: https://www.centarahotelsresorts.com/the-centara-collection/cirm/gallery
   - Centara Ras Fushi: https://www.centarahotelsresorts.com/centara/crf/gallery  
   - Centara Mirage Lagoon: https://www.centarahotelsresorts.com/centara/cmlm/gallery
   - Centara Grand Lagoon: https://www.centarahotelsresorts.com/centaragrand/cglm/gallery

2. Right-click on images and select "Copy image address"
3. Replace the placeholder URLs in the IMAGES dictionary below
"""
from decimal import Decimal
from django.core.management.base import BaseCommand
from django.db import transaction
from api.models import Location, Resort, ResortRoomType


# =============================================================================
# IMAGE URLS - REPLACE THESE WITH ACTUAL CENTARA IMAGES
# =============================================================================
# Instructions: 
# 1. Go to the gallery pages listed above
# 2. Right-click on appropriate images -> "Copy image address"
# 3. Paste the URLs below replacing the placeholder text
#
# The placeholder format is: REPLACE_WITH_ACTUAL_URL_FOR_[description]
# =============================================================================

IMAGES = {
    # -------------------------------------------------------------------------
    # MACHCHAFUSHI ISLAND RESORT & SPA MALDIVES (The Centara Collection)
    # Accommodation: https://www.centarahotelsresorts.com/the-centara-collection/cirm/accommodation
    # Gallery: https://www.centarahotelsresorts.com/the-centara-collection/cirm/gallery
    # -------------------------------------------------------------------------
    'machchafushi_island': {
        # Card image - main resort exterior shot (used in resort listing cards)
        'card': 'https://www.centarahotelsresorts.com/the-centara-collection/sites/centara-the-centara-collection/files/styles/850x472/public/2020-10/cirm-drone-20.jpg.JPG?itok=q0MnD2bH',
        # Banner images - resort overview photos (used in detail page gallery)
        'banner': [
            'https://www.centarahotelsresorts.com/the-centara-collection/sites/centara-the-centara-collection/files/styles/850x472/public/2020-10/cirm-drone-23.jpg.JPG?itok=x-feXaSM',
            'https://www.centarahotelsresorts.com/the-centara-collection/sites/centara-the-centara-collection/files/styles/850x472/public/2020-10/05-06-cirm-luxury-beachfront-pool-villa-12_0.jpg.JPG?itok=PVeRD-OA',
            'https://www.centarahotelsresorts.com/the-centara-collection/sites/centara-the-centara-collection/files/styles/850x472/public/2020-10/04-cirm-ocean-water-villa-03.JPG?itok=gQBwBweV',
            'https://www.centarahotelsresorts.com/the-centara-collection/sites/centara-the-centara-collection/files/styles/850x472/public/2025-01/cirm-reef-restaurant-08.jpg.JPG?itok=9yE8IRJZ',
            'https://www.centarahotelsresorts.com/the-centara-collection/sites/centara-the-centara-collection/files/styles/850x472/public/2020-10/04-cirm-ocean-water-villa-05.jpg.JPG?itok=3zYA2Y8L',
        ],
        # Room type images - EXACT names from Centara website
        'rooms': {
            'duplex_beach_villa': 'https://www.centarahotelsresorts.com/the-centara-collection/sites/centara-the-centara-collection/files/styles/room_listing/public/2020-10/01-cirm-beach-suite-01.jpg.JPG?itok=tOz2EW-W',
            'family_overwater_villa': 'https://www.centarahotelsresorts.com/the-centara-collection/sites/centara-the-centara-collection/files/styles/room_listing/public/2021-05/CIRM_03-cirm-deluxe-family-water-villa-08-Crop.jpg.JPG?itok=FFYadfQm',
            'reethi_muraka_villa': 'https://www.centarahotelsresorts.com/the-centara-collection/sites/centara-the-centara-collection/files/styles/room_listing/public/2020-09/CIRM_04-cirm-ocean-water-villa-07.jpg.JPG?itok=X-0klFYh',
            'sunrise_overwater_villa': 'https://www.centarahotelsresorts.com/the-centara-collection/sites/centara-the-centara-collection/files/styles/room_listing/public/2020-10/02-cirm-deluxe-water-villa-05.jpg.JPG?itok=3I-dg12N',
            'sunset_overwater_villa': 'https://www.centarahotelsresorts.com/the-centara-collection/sites/centara-the-centara-collection/files/styles/room_listing/public/2023-10/02-cirm-deluxe-water-villa-07.jpg.JPG?itok=sL-DqOnY',
            'club_sunset_pool_villa': 'https://www.centarahotelsresorts.com/the-centara-collection/sites/centara-the-centara-collection/files/styles/room_listing/public/2022-10/05-cirm-premium-sunset-overwater-villa-10.jpg.JPG?itok=9ZUFBOno',
            'club_two_bed_villa': 'https://www.centarahotelsresorts.com/the-centara-collection/sites/centara-the-centara-collection/files/styles/room_listing/public/2022-10/06-cirm-two-bedroom-beach-villa-with-private-pool-14.jpg.JPG?itok=NXVD_T9q',
        }
    },
    
    # -------------------------------------------------------------------------
    # CENTARA RAS FUSHI RESORT & SPA MALDIVES (Adults Only)
    # Accommodation: https://www.centarahotelsresorts.com/centara/crf/accommodation
    # Gallery: https://www.centarahotelsresorts.com/centara/crf/gallery
    # -------------------------------------------------------------------------
    'centara_ras_fushi': {
        'card': 'https://www.centarahotelsresorts.com/centara/sites/centara-centara/files/styles/850x472/public/2021-03/CRF_drone-17.jpg.JPG?itok=NVks6abD',
        'banner': [
            'https://www.centarahotelsresorts.com/centara/sites/centara-centara/files/styles/850x472/public/2021-03/CRF_drone-19.jpg.JPG?itok=EyLL3h0A',
            'https://www.centarahotelsresorts.com/centara/sites/centara-centara/files/styles/850x472/public/2021-03/CRF_suan-bua-09.jpg.JPG?itok=Hs-jxfLe',
            'https://www.centarahotelsresorts.com/centara/sites/centara-centara/files/styles/850x472/public/2021-03/CRF_beach-10.jpg.JPG?itok=QZmdXlu9',
            'https://www.centarahotelsresorts.com/centara/sites/centara-centara/files/styles/850x472/public/2021-03/CRF_drone-26.jpg.JPG?itok=LFizlDdq',
            'https://www.centarahotelsresorts.com/centara/sites/centara-centara/files/styles/850x472/public/2021-03/CRF_suan-bua-09.jpg.JPG?itok=Hs-jxfLe',
        ],
        # Room type images - EXACT names from Centara website
        'rooms': {
            'beachfront_deluxe': 'https://www.centarahotelsresorts.com/centara/sites/centara-centara/files/styles/room_listing/public/2024-03/02-crf-deluxe-ocean-front-beach-villa-03.jpg.JPG?itok=k5XeITOX',
            'deluxe_water_villa': 'https://www.centarahotelsresorts.com/centara/sites/centara-centara/files/styles/room_listing/public/2021-02/CRF_02-deluxe-ocean-front-beach-villa-06.jpg.JPG?itok=isL8g6Lj',
            'ocean_front_beach_villa': 'https://www.centarahotelsresorts.com/centara/sites/centara-centara/files/styles/room_listing/public/2021-03/CRF_03-deluxe-water-villa-08.jpg.JPG?itok=EWk3mo6P',
            'sunrise_overwater_pool_villa': 'https://www.centarahotelsresorts.com/centara/sites/centara-centara/files/styles/room_listing/public/2021-02/CRF_04-deluxe-sunset-water-villa-05.jpg.JPG?itok=ngv2_zrK',
            'sunset_overwater_villa': 'https://www.centarahotelsresorts.com/centara/sites/centara-centara/files/styles/room_listing/public/2021-02/CRF_04-deluxe-sunset-water-villa-05.jpg.JPG?itok=ngv2_zrK',
            'sunset_overwater_swirl_pool': 'https://www.centarahotelsresorts.com/centara/sites/centara-centara/files/styles/room_listing/public/2021-02/CRF_06-premium-deluxe-spa-water-villa-06.jpg.JPG?itok=kaC2OCLr',
        }
    },
    
    # -------------------------------------------------------------------------
    # CENTARA MIRAGE LAGOON MALDIVES (Family Resort)
    # Accommodation: https://www.centarahotelsresorts.com/centara/cmlm/accommodation
    # Gallery: https://www.centarahotelsresorts.com/centara/cmlm/gallery
    # -------------------------------------------------------------------------
    'centara_mirage': {
        'card': 'https://www.centarahotelsresorts.com/centara/sites/centara-centara/files/styles/850x472/public/2025-01/cmlm-swimming-pool-03.jpg.JPG?itok=eppO4NmP',
        'banner': [
            'https://www.centarahotelsresorts.com/centara/sites/centara-centara/files/styles/850x472/public/2025-02/CMLM_Water%20Complex_06.jpg.JPG?itok=ydxg8Fam',
            'https://www.centarahotelsresorts.com/centara/sites/centara-centara/files/styles/850x472/public/2025-02/CMLM_Arrival%20Jetty.jpg.JPG?itok=uhGLvyyJ',
            'https://www.centarahotelsresorts.com/centara/sites/centara-centara/files/styles/850x472/public/2025-02/CMLM_Water%20Complex_01.jpg.JPG?itok=qzBApjbb',
            'https://www.centarahotelsresorts.com/centara/sites/centara-centara/files/styles/850x472/public/2025-02/CMLM_Beach%20dinner_01.jpg.JPG?itok=kMFCIHuo',
            'https://www.centarahotelsresorts.com/centara/sites/centara-centara/files/styles/850x472/public/2024-12/cmlm-suan-bua-01.jpg.JPG?itok=ITUhW6ds',
        ],
        # Room type images - EXACT names from Centara website
        'rooms': {
            'panoramic_lagoon_room': 'https://www.centarahotelsresorts.com/centara/sites/centara-centara/files/styles/room_listing/public/2024-09/02-cmlm-panoramic-%20lagoon-room-with-open-air-%20bath-01.jpg.JPG?itok=Ee-KvLFI',
            'panoramic_lagoon_open_air_bath': 'https://www.centarahotelsresorts.com/centara/sites/centara-centara/files/styles/room_listing/public/2025-01/02-cmlm-panoramic-lagoon-room-with-open-air-bath-05.jpg.JPG?itok=LJlU0fxB',
            'beachfront_room': 'https://www.centarahotelsresorts.com/centara/sites/centara-centara/files/styles/room_listing/public/2024-09/03-cmlm-mirage-beachfront-room-04.jpg.JPG?itok=fvIwn6ls',
            'beachfront_open_air_bath': 'https://www.centarahotelsresorts.com/centara/sites/centara-centara/files/styles/room_listing/public/2025-01/04-cmlm-beachfront-room-with-open-air-bath-09_0.jpg.JPG?itok=P0sLMpdW',
            'panoramic_room_jacuzzi': 'https://www.centarahotelsresorts.com/centara/sites/centara-centara/files/styles/room_listing/public/2025-01/05-cmlm-mirage-panoramic-room-with-jacuzzi-03.jpg.JPG?itok=v5Z5joX_',
            'beachfront_room_jacuzzi': 'https://www.centarahotelsresorts.com/centara/sites/centara-centara/files/styles/room_listing/public/2025-01/06-cmlm-mirage-beachfront-room-with-jacuzzi-01.jpg.JPG?itok=NGnsOktM',
            'overwater_villa_jacuzzi': 'https://www.centarahotelsresorts.com/centara/sites/centara-centara/files/styles/room_listing/public/2025-01/08-cmlm-overwater-villa-with-jacuzzi-06_0.jpg.JPG?itok=9aVyQCDs',
            'overwater_sunrise_villa_jacuzzi': 'https://www.centarahotelsresorts.com/centara/sites/centara-centara/files/styles/room_listing/public/2024-12/10-cmlm-overwater-sunrise-villa-with-jacuzzi_0.jpg.JPG?itok=1RT3MLTo',
            'mirage_overwater_villa_with_jacuzzi': 'https://www.centarahotelsresorts.com/centara/sites/centara-centara/files/styles/room_listing/public/2024-09/07-cmlm-mirage-overwater-villa-with-jacuzzi-04.jpg.JPG?itok=wNvTWGg3',
            'mirage_overwater_sunset_villa_with_jacuzzi': 'https://www.centarahotelsresorts.com/centara/sites/centara-centara/files/styles/room_listing/public/2024-09/09-cmlm-mirage-overwater-sunset-villa-with-jacuzzi-02.jpg.JPG?itok=6F_2dzEH',
            'overwater_sunset_pool_villa': 'https://www.centarahotelsresorts.com/centara/sites/centara-centara/files/styles/room_listing/public/2024-12/12-cmlm-mirage-overwater-sunset-pool-villa-02_0.jpg.JPG?itok=-9F-UOfu',
            'mirage_overwater_sunrise_pool_villa': 'https://www.centarahotelsresorts.com/centara/sites/centara-centara/files/styles/room_listing/public/2024-12/11-cmlm-mirage-overwater-sunrise-pool-villa-01_0.jpg.JPG?itok=x0bWha9V',
            'four_bedroom_beach_house': 'https://www.centarahotelsresorts.com/centara/sites/centara-centara/files/styles/room_listing/public/2024-04/15.jpg.JPG?itok=s9G07FHw',
            'four_bedroom_mirage_beach_house': 'https://www.centarahotelsresorts.com/centara/sites/centara-centara/files/styles/room_listing/public/2024-04/15.jpg.JPG?itok=s9G07FHw',
        }
    },
    
    # -------------------------------------------------------------------------
    # CENTARA GRAND LAGOON MALDIVES (Ultra Luxury)
    # Accommodation: https://www.centarahotelsresorts.com/centaragrand/cglm/accommodation
    # Gallery: https://www.centarahotelsresorts.com/centaragrand/cglm/gallery
    # -------------------------------------------------------------------------
    'centara_grand_lagoon': {
        'card': 'https://www.centarahotelsresorts.com/centaragrand/sites/centara-centaragrand/files/styles/850x472/public/2024-06/cglm06.jpg.JPG?itok=-E7Qo4cf',
        'banner': [
            'https://www.centarahotelsresorts.com/centaragrand/sites/centara-centaragrand/files/styles/850x472/public/2025-08/cglm-aerial-view.jpg.JPG?itok=zQESruxm',
            'https://www.centarahotelsresorts.com/centaragrand/sites/centara-centaragrand/files/styles/850x472/public/2025-07/CGLM%20-%2002%20One%20Bedroom%20Overwater%20Pool%20Villa%2002.jpg.JPG?itok=pVuNgUqd',
            'https://www.centarahotelsresorts.com/centaragrand/sites/centara-centaragrand/files/styles/850x472/public/2025-07/CGLM%20-%2009%20Three-Bedroom%20Sunset%20Beach%20Pool%20Residence.jpg.JPG?itok=yztJITBW',
            'https://www.centarahotelsresorts.com/centaragrand/sites/centara-centaragrand/files/styles/850x472/public/2025-03/SPA_Couple%20Treatment%20Room%202.jpg.JPG?itok=Z1ArM83N',
            'https://www.centarahotelsresorts.com/centaragrand/sites/centara-centaragrand/files/styles/850x472/public/2025-04/02_Specialty%20Restaurant_3.jpg.JPG?itok=Bpw_BHYy',
        ],
        # Room type images - EXACT names from Centara website
        'rooms': {
            'two_bed_family_overwater_jacuzzi': 'https://www.centarahotelsresorts.com/centaragrand/sites/centara-centaragrand/files/styles/room_listing/public/2025-12/cglm-two-bedroom-family-with-jacuzzi8.jpg.JPG?itok=Ircogpqi',
            'one_bed_overwater_pool': 'https://www.centarahotelsresorts.com/centaragrand/sites/centara-centaragrand/files/styles/room_listing/public/2025-07/02%20CGLM%20-%20One-Bedroom%20Overwater%20Pool%20Villa%2003.jpg.JPG?itok=l2pWoDzT',
            'two_bed_family_overwater_pool': 'https://www.centarahotelsresorts.com/centaragrand/sites/centara-centaragrand/files/styles/room_listing/public/2025-12/cglm-two-bedroom-family-overwater-pool-villa.jpg.JPG?itok=CnSaudU2',
            'one_bed_sunset_overwater_pool': 'https://www.centarahotelsresorts.com/centaragrand/sites/centara-centaragrand/files/styles/room_listing/public/2025-07/02%20CGLM%20-%20One-Bedroom%20Overwater%20Pool%20Villa%2001.jpg.JPG?itok=JTlcnDUs',
            'one_bed_sunset_beach_pool': 'https://www.centarahotelsresorts.com/centaragrand/sites/centara-centaragrand/files/styles/room_listing/public/2024-09/01-cglm-one-bedroom-sunset-beach-pool-villa-03.jpg.JPG?itok=NRikydo1',
            'two_bed_family_sunset_beach_pool': 'https://www.centarahotelsresorts.com/centaragrand/sites/centara-centaragrand/files/styles/room_listing/public/2025-12/cglm-two-bedroom-family-sunset.jpg.JPG?itok=17U_PFAH',
            'one_bed_sunrise_beach_pool': 'https://www.centarahotelsresorts.com/centaragrand/sites/centara-centaragrand/files/styles/room_listing/public/2025-07/02-cglm-one-bedroom-sunrise-beach-pool-villa-02.jpg.JPG?itok=tFQhjzpH',
            'grand_two_bedromm_beach_pool_villa': 'https://www.centarahotelsresorts.com/centaragrand/sites/centara-centaragrand/files/styles/room_listing/public/2025-07/CGLM%20-%2007%20Grand%20Two%20Bedroom%20Beach%20Pool%20Villa.jpg.JPG?itok=RJfR45tI',
            'grand_two_bed_overwater_pool': 'https://www.centarahotelsresorts.com/centaragrand/sites/centara-centaragrand/files/styles/room_listing/public/2025-07/06-CGLM_Grand%20Two%20Bedroom%20Overwater%20Pool%20Villa%2006.jpg.JPG?itok=KXiSF0xA',
            'one_bed_overwater_jacuzzi': 'https://www.centarahotelsresorts.com/centaragrand/sites/centara-centaragrand/files/styles/room_listing/public/2024-09/05-cglm-one-bedroom-overwater-villa-with-jacuzzi-01.jpg.JPG?itok=zRPNGpjN',
        }
    },
}


class Command(BaseCommand):
    help = 'Add all Centara Maldives resorts with room types. Pricing is set to "Contact to get price".'

    def add_arguments(self, parser):
        parser.add_argument(
            '--update',
            action='store_true',
            help='Update existing resorts and room types if they already exist',
        )

    def _validate_all_images(self):
        """Validate that all room type images are valid (not placeholders)."""
        issues = []
        
        for resort_key, resort_images in IMAGES.items():
            # Check card and banner images
            if resort_images.get('card', '').startswith('REPLACE_WITH'):
                issues.append(f"{resort_key}: Card image is a placeholder")
            
            for banner_url in resort_images.get('banner', []):
                if banner_url.startswith('REPLACE_WITH'):
                    issues.append(f"{resort_key}: Banner image is a placeholder")
            
            # Check all room type images
            for room_key, room_url in resort_images.get('rooms', {}).items():
                if not room_url or room_url.startswith('REPLACE_WITH'):
                    issues.append(f"{resort_key}: Room '{room_key}' has placeholder or missing image")
                elif not room_url.startswith('http'):
                    issues.append(f"{resort_key}: Room '{room_key}' has invalid image URL")
        
        return issues


    @transaction.atomic
    def handle(self, *args, **options):
        # Validate all images
        image_issues = self._validate_all_images()
        if image_issues:
            self.stdout.write(self.style.WARNING('=' * 70))
            self.stdout.write(self.style.WARNING('WARNING: Found image placeholder issues!'))
            self.stdout.write(self.style.WARNING(''))
            for issue in image_issues:
                self.stdout.write(self.style.WARNING(f'  - {issue}'))
            self.stdout.write(self.style.WARNING(''))
            self.stdout.write(self.style.WARNING('To fix:'))
            self.stdout.write(self.style.WARNING('1. Open api/management/commands/add_centara_resorts.py'))
            self.stdout.write(self.style.WARNING('2. Visit the gallery URLs listed in the IMAGES section'))
            self.stdout.write(self.style.WARNING('3. Right-click images -> "Copy image address"'))
            self.stdout.write(self.style.WARNING('4. Replace the REPLACE_WITH_... URLs with real URLs'))
            self.stdout.write(self.style.WARNING('5. Run this command again'))
            self.stdout.write(self.style.WARNING('=' * 70))
            self.stdout.write('')
            
            # Ask for confirmation to continue with placeholders
            self.stdout.write('Continuing with placeholder URLs...')
            self.stdout.write('')
        else:
            self.stdout.write(self.style.SUCCESS('✓ All room type images validated - no placeholders found'))
            self.stdout.write('')

        self.stdout.write(self.style.SUCCESS('=' * 60))
        self.stdout.write(self.style.SUCCESS('Adding Centara Maldives Resorts'))
        self.stdout.write(self.style.SUCCESS('=' * 60))

        resorts_data = self._get_resorts_data()
        
        created_resorts = 0
        updated_resorts = 0
        created_room_types = 0
        updated_room_types = 0

        for resort_data in resorts_data:
            room_types_data = resort_data.pop('room_types', [])
            location_data = resort_data.pop('location_data')

            # Get or create location
            location, loc_created = Location.objects.get_or_create(
                island=location_data['island'],
                defaults={
                    'atoll': location_data['atoll'],
                    'latitude': location_data.get('latitude'),
                    'longitude': location_data.get('longitude'),
                }
            )
            
            if loc_created:
                self.stdout.write(f"  ✓ Created location: {location}")
            
            resort_data['location'] = location

            # Get or create resort
            existing_resort = Resort.objects.filter(name=resort_data['name']).first()
            
            if existing_resort:
                if options['update']:
                    for key, value in resort_data.items():
                        setattr(existing_resort, key, value)
                    existing_resort.save()
                    updated_resorts += 1
                    self.stdout.write(self.style.WARNING(f"  ↻ Updated resort: {existing_resort.name}"))
                    resort = existing_resort
                else:
                    self.stdout.write(self.style.WARNING(f"  ⊘ Skipped existing resort: {existing_resort.name}"))
                    resort = existing_resort
            else:
                resort = Resort.objects.create(**resort_data)
                created_resorts += 1
                self.stdout.write(self.style.SUCCESS(f"  ✓ Created resort: {resort.name}"))

            # Add room types
            for rt_data in room_types_data:
                rt_data['resort'] = resort
                existing_rt = ResortRoomType.objects.filter(
                    resort=resort, 
                    name=rt_data['name']
                ).first()
                
                if existing_rt:
                    if options['update']:
                        for key, value in rt_data.items():
                            if key != 'resort':
                                setattr(existing_rt, key, value)
                        existing_rt.save()
                        updated_room_types += 1
                        self.stdout.write(f"    ↻ Updated room type: {rt_data['name']}")
                else:
                    ResortRoomType.objects.create(**rt_data)
                    created_room_types += 1
                    self.stdout.write(f"    ✓ Created room type: {rt_data['name']}")

            self.stdout.write('')

        # Summary
        self.stdout.write(self.style.SUCCESS('=' * 60))
        self.stdout.write(self.style.SUCCESS('Summary:'))
        self.stdout.write(self.style.SUCCESS(f'  Resorts created: {created_resorts}'))
        self.stdout.write(self.style.SUCCESS(f'  Resorts updated: {updated_resorts}'))
        self.stdout.write(self.style.SUCCESS(f'  Room types created: {created_room_types}'))
        self.stdout.write(self.style.SUCCESS(f'  Room types updated: {updated_room_types}'))
        self.stdout.write(self.style.SUCCESS('=' * 60))
        self.stdout.write('')
        self.stdout.write(self.style.SUCCESS('✓ Centara Maldives resorts have been added successfully!'))
        self.stdout.write(self.style.NOTICE('Note: All room types have hide_price=True for "Contact to get price" display.'))

    def _build_gallery_images(self, imgs):
        """Build gallery images list, filtering out placeholder URLs."""
        gallery = []
        # Card image first (for resort listing) - mark it so serializer can find it
        if imgs.get('card') and not imgs['card'].startswith('REPLACE_WITH'):
            # Add marker so serializer can identify card image (looks for 'Card' or 'card' in URL)
            gallery.append(f"__CARD_IMAGE__:{imgs['card']}")
        # Then banner images
        for url in imgs.get('banner', []):
            if url and not url.startswith('REPLACE_WITH'):
                gallery.append(url)
        return gallery if gallery else ['']  # Return empty string if no valid images

    def _build_room_amenities(self, image_url, amenities_list):
        """Build amenities list with image URL if valid."""
        result = []
        # Add image URL if it's not a placeholder
        if image_url and not image_url.startswith('REPLACE_WITH'):
            result.append(f"__IMAGE_URL__:{image_url}")
        # Add regular amenities
        result.extend(amenities_list)
        return result

    def _get_resorts_data(self):
        """Return all Centara Maldives resort data with room types."""
        
        # Resort 1: Machchafushi Island Resort & Spa Maldives (The Centara Collection)
        # Formerly known as Centara Grand Island Resort & Spa Maldives
        imgs = IMAGES['machchafushi_island']
        resort1 = {
            'name': 'Machchafushi Island Resort & Spa Maldives',
            'description': 'Set on the secluded Machchafushi Island in South Ari Atoll, this all-inclusive resort features 112 stunning villas, an award-winning spa, and one of the best house reefs in the Maldives for snorkeling and diving.',
            'detailed_description': '''Centara Grand Island Resort & Spa Maldives is a premium all-inclusive resort nestled on the pristine Machchafushi Island in the South Ari Atoll. The resort is renowned for its exceptional house reef, which is home to a kaleidoscope of marine life including whale sharks, manta rays, and vibrant coral formations.

The resort features 112 elegantly designed villas, ranging from beachfront suites to overwater villas with direct lagoon access. Every villa is designed with contemporary Thai-inspired touches and offers panoramic views of the turquoise lagoon.

Guests can indulge in world-class dining at multiple restaurants offering Thai, Italian, and international cuisines. The award-winning SPA Cenvaree provides holistic wellness treatments, while the PADI dive center offers underwater adventures for all skill levels.

The resort is perfect for families, couples, and honeymooners seeking an unforgettable tropical escape with exceptional service and amenities.''',
            'category': 'luxury',
            'star_rating': 5,
            'location_data': {
                'island': 'Machchafushi',
                'atoll': 'South Ari Atoll',
                'latitude': 3.5856,
                'longitude': 72.8167,
            },
            'atoll': 'South Ari Atoll',
            'island_name': 'Machchafushi',
            'coordinates': '3.5856, 72.8167',
            'phone': '+960 668 0500',
            'email': 'cgm@chr.co.th',
            'website': 'https://www.centarahotelsresorts.com/the-centara-collection/cirm/accommodation',
            'whatsapp_number': '+960 668 0500',
            'currency': 'USD',
            'pricing_notes': 'Contact us for the best available rates and special packages.',
            'total_villas': 112,
            'beach_villas': 56,
            'water_villas': 56,
            'overwater_villas': 36,
            'restaurants': 4,
            'bars': 3,
            'spa_centers': 1,
            'fitness_centers': 1,
            'pools': 2,
            'dive_centers': 1,
            'water_sports_centers': 1,
            'diving_available': True,
            'snorkeling_available': True,
            'fishing_available': True,
            'sailing_available': True,
            'spa_services': True,
            'water_sports': True,
            'land_activities': True,
            'cultural_experiences': True,
            'transfer_type': 'Seaplane',
            'transfer_duration': '25 minutes from Malé',
            'transfer_cost': Decimal('0.00'),
            'is_adults_only': False,
            'is_family_friendly': True,
            'is_honeymoon_special': True,
            'is_eco_friendly': True,
            'is_private_island': True,
            'has_house_reef': True,
            'is_packaged': False,
            'is_room_type': True,
            'has_private_beach': True,
            'is_featured': True,
            'is_active': True,
            'display_order': 1,
            'meta_title': 'Centara Grand Island Resort & Spa Maldives - Luxury All-Inclusive',
            'meta_description': 'Experience luxury all-inclusive at Centara Grand Island Resort in South Ari Atoll with stunning overwater villas and exceptional house reef.',
            'gallery_images': self._build_gallery_images(imgs),
            'featured_highlights': [
                'Award-winning all-inclusive resort',
                'Exceptional house reef with whale sharks',
                'SPA Cenvaree wellness center',
                'PADI 5-Star dive center',
                'Multiple dining options',
                'Family-friendly with Kids Club',
            ],
            'room_types': [
                {
                    'name': 'Duplex Beach Villa',
                    'description': 'Navy- and sky-blue hues match the chic white aesthetic of the Duplex Beach Villa. Here, the plush king-sized bed invites rest and relaxation. 87 sqm of modern beachfront elegance.',
                    'price_per_night': None,
                    'currency': 'USD',
                    'occupancy_adults': 2,
                    'occupancy_children': 2,
                    'bed_configuration': '1 King Bed',
                    'amenities': self._build_room_amenities(imgs['rooms']['duplex_beach_villa'], [
                        'Sea View',
                        'Flat screen TV',
                        'Shower',
                        'Free WiFi',
                        'Air Conditioning',
                        'Bathrobes',
                    ]),
                    'order': 1,
                    'is_active': True,
                    'hide_price': True,
                },
                {
                    'name': 'Family Overwater Villa with Kids Bedroom',
                    'description': 'Positioned over the turquoise waters of the Indian Ocean, the 93-sqm Family Overwater Villa is perfect for families with a separate kids bedroom and jacuzzi in bathroom.',
                    'price_per_night': None,
                    'currency': 'USD',
                    'occupancy_adults': 2,
                    'occupancy_children': 2,
                    'bed_configuration': '1 King Bed + Kids Beds',
                    'amenities': self._build_room_amenities(imgs['rooms']['family_overwater_villa'], [
                        'Sea View',
                        'Jacuzzi in Bathroom',
                        'Separate Kids Bedroom',
                        'Shower and Bathtub',
                        'Free WiFi',
                        'Air Conditioning',
                    ]),
                    'order': 2,
                    'is_active': True,
                    'hide_price': True,
                },
                {
                    'name': 'Reethi Muraka Overwater Villa',
                    'description': 'Studded throughout the shoreline, each of the 106-sqm Reethi Muraka Overwater Villa offers endless ocean views with premium amenities and spacious design.',
                    'price_per_night': None,
                    'currency': 'USD',
                    'occupancy_adults': 2,
                    'occupancy_children': 1,
                    'bed_configuration': '1 King Bed',
                    'amenities': self._build_room_amenities(imgs['rooms']['reethi_muraka_villa'], [
                        'Sea View',
                        'Flat screen TV',
                        'Shower and Bathtub',
                        'Free WiFi',
                        'Air Conditioning',
                        'Bathrobes',
                    ]),
                    'order': 3,
                    'is_active': True,
                    'hide_price': True,
                },
                {
                    'name': 'Sunrise Overwater Villa',
                    'description': 'Surround yourself in brilliant blues in an overwater villa, where you can wake up to stunning sunrises over the Indian Ocean. 86-87 sqm of pure bliss.',
                    'price_per_night': None,
                    'currency': 'USD',
                    'occupancy_adults': 2,
                    'occupancy_children': 1,
                    'bed_configuration': '1 King Bed',
                    'amenities': self._build_room_amenities(imgs['rooms']['sunrise_overwater_villa'], [
                        'Sea View',
                        'Jacuzzi in Bathroom',
                        'Shower and Bathtub',
                        'Free WiFi',
                        'Air Conditioning',
                        'Bathrobes',
                    ]),
                    'order': 4,
                    'is_active': True,
                    'hide_price': True,
                },
                {
                    'name': 'Sunset Overwater Villa',
                    'description': 'Surround yourself in brilliant blues in an overwater villa, where you can wake up to stunning sunsets over the lagoon. 86-87 sqm of romantic paradise.',
                    'price_per_night': None,
                    'currency': 'USD',
                    'occupancy_adults': 2,
                    'occupancy_children': 1,
                    'bed_configuration': '1 King Bed',
                    'amenities': self._build_room_amenities(imgs['rooms']['sunset_overwater_villa'], [
                        'Sea View',
                        'Jacuzzi in Bathroom',
                        'Shower and Bathtub',
                        'Free WiFi',
                        'Air Conditioning',
                        'Bathrobes',
                    ]),
                    'order': 5,
                    'is_active': True,
                    'hide_price': True,
                },
                {
                    'name': 'Club Sunset Overwater Pool Villa',
                    'description': 'Blending the blues of the lagoon with a modern aesthetic, the 114-sqm Club Sunset Overwater Pool Villa defines the ultimate luxury experience with private pool.',
                    'price_per_night': None,
                    'currency': 'USD',
                    'occupancy_adults': 2,
                    'occupancy_children': 1,
                    'bed_configuration': '1 King Bed',
                    'amenities': self._build_room_amenities(imgs['rooms']['club_sunset_pool_villa'], [
                        'Sea View',
                        'Private Pool',
                        'Shower and Bathtub',
                        'Free WiFi',
                        'Air Conditioning',
                        'Bathrobes',
                    ]),
                    'order': 6,
                    'is_active': True,
                    'hide_price': True,
                },
                {
                    'name': 'Club Two Bedroom Beach Pool Villa',
                    'description': 'Tastefully furnished with fresh, all-white interior design, these 159-sqm two-bedroom beachfront villas feature a private pool and direct beach access.',
                    'price_per_night': None,
                    'currency': 'USD',
                    'occupancy_adults': 2,
                    'occupancy_children': 3,
                    'bed_configuration': '2 King Beds',
                    'amenities': self._build_room_amenities(imgs['rooms']['club_two_bed_villa'], [
                        'Sea View',
                        'Private Pool',
                        'Two Bedrooms',
                        'Shower and Bathtub',
                        'Free WiFi',
                        'Air Conditioning',
                    ]),
                    'order': 7,
                    'is_active': True,
                    'hide_price': True,
                },
            ],
        }
        
        # Resort 2: Centara Ras Fushi
        imgs = IMAGES['centara_ras_fushi']
        resort2 = {
            'name': 'Centara Ras Fushi Resort & Spa Maldives',
            'description': 'An exclusive adults-only retreat in North Malé Atoll, just 15 minutes by speedboat from the airport, featuring 140 villas, overwater bungalows with swirl pools, and all-inclusive dining.',
            'detailed_description': '''Centara Ras Fushi Resort & Spa Maldives offers an exclusive adults-only escape designed for couples and friends seeking romance, relaxation, and adventure. Located in North Malé Atoll, the resort is easily accessible - just 15 minutes by speedboat from Velana International Airport.

The resort features 140 beautifully appointed villas and bungalows, including stunning overwater accommodations with private swirl pools. Each villa is designed with contemporary elegance and offers breathtaking views of the Indian Ocean.

As an all-inclusive resort, guests enjoy unlimited dining at multiple restaurants and bars, from authentic Thai cuisine to international favorites. The resort also features an infinity pool overlooking the ocean, a world-class spa, and excellent water sports facilities.

Perfect for honeymooners and couples celebrating special occasions, Centara Ras Fushi creates memorable experiences with romantic sunset cruises, private beach dinners, and couples spa treatments.''',
            'category': 'adults_only',
            'star_rating': 5,
            'location_data': {
                'island': 'Giraavaru',
                'atoll': 'North Malé Atoll',
                'latitude': 4.2744,
                'longitude': 73.4333,
            },
            'atoll': 'North Malé Atoll',
            'island_name': 'Giraavaru',
            'coordinates': '4.2744, 73.4333',
            'phone': '+960 664 6500',
            'email': 'crf@chr.co.th',
            'website': 'https://www.centarahotelsresorts.com/centara/crf',
            'whatsapp_number': '+960 664 6500',
            'currency': 'USD',
            'pricing_notes': 'Contact us for exclusive rates and honeymoon packages.',
            'total_villas': 140,
            'beach_villas': 70,
            'water_villas': 70,
            'overwater_villas': 40,
            'restaurants': 4,
            'bars': 2,
            'spa_centers': 1,
            'fitness_centers': 1,
            'pools': 1,
            'dive_centers': 1,
            'water_sports_centers': 1,
            'diving_available': True,
            'snorkeling_available': True,
            'fishing_available': True,
            'sailing_available': True,
            'spa_services': True,
            'water_sports': True,
            'land_activities': True,
            'cultural_experiences': False,
            'transfer_type': 'Speedboat',
            'transfer_duration': '15 minutes from Malé',
            'transfer_cost': Decimal('0.00'),
            'is_adults_only': True,
            'is_family_friendly': False,
            'is_honeymoon_special': True,
            'is_eco_friendly': True,
            'is_private_island': True,
            'has_house_reef': True,
            'is_packaged': False,
            'is_room_type': True,
            'has_private_beach': True,
            'is_featured': True,
            'is_active': True,
            'display_order': 2,
            'meta_title': 'Centara Ras Fushi Resort & Spa Maldives - Adults Only All-Inclusive',
            'meta_description': 'Exclusive adults-only resort in North Malé Atoll with overwater villas, swirl pools, and all-inclusive dining just 15 minutes from the airport.',
            'gallery_images': self._build_gallery_images(imgs),
            'featured_highlights': [
                'Adults-only exclusive retreat',
                'Only 15 minutes from airport',
                'All-inclusive dining & drinks',
                'Overwater villas with swirl pools',
                'SPA Cenvaree wellness',
                'Romantic sunset cruises',
            ],
            'room_types': [
                {
                    'name': 'Lagoon View Beach Villa',
                    'description': 'Stylish 45 sqm beachfront room with direct beach access, modern amenities, and stunning lagoon views. Perfect for couples.',
                    'price_per_night': None,
                    'currency': 'USD',
                    'occupancy_adults': 2,
                    'occupancy_children': 0,
                    'bed_configuration': '1 King Bed',
                    'amenities': self._build_room_amenities(imgs['rooms']['beachfront_deluxe'], [
                        'Sea View',
                        'Direct beach access',
                        'Flat screen TV',
                        'Free WiFi',
                        'Air Conditioning',
                    ]),
                    'order': 1,
                    'is_active': True,
                    'hide_price': True,
                },
                {
                    'name': 'Lagoon View Beach Villa with Swirl Pool',
                    'description': 'Elegant 51 sqm overwater villa with direct lagoon access, glass floor panel, and spacious sun deck.',
                    'price_per_night': None,
                    'currency': 'USD',
                    'occupancy_adults': 2,
                    'occupancy_children': 0,
                    'bed_configuration': '1 King Bed',
                    'amenities': self._build_room_amenities(imgs['rooms']['deluxe_water_villa'], [
                        'Sea View',
                        'Direct lagoon access',
                        'Glass floor panel',
                        'Private sundeck',
                        'Free WiFi',
                    ]),
                    'order': 2,
                    'is_active': True,
                    'hide_price': True,
                },
                {
                    'name': 'Overwater Villa',
                    'description': 'Premium 42 sqm beachfront villa with panoramic ocean views, outdoor bathtub, and direct beach access.',
                    'price_per_night': None,
                    'currency': 'USD',
                    'occupancy_adults': 2,
                    'occupancy_children': 0,
                    'bed_configuration': '1 King Bed',
                    'amenities': self._build_room_amenities(imgs['rooms']['ocean_front_beach_villa'], [
                        'Sea View',
                        'Ocean Front',
                        'Outdoor Bathtub',
                        'Direct beach access',
                        'Free WiFi',
                    ]),
                    'order': 3,
                    'is_active': True,
                    'hide_price': True,
                },
                {
                    'name': 'Sunset Overwater Villa',
                    'description': 'Romantic 42 sqm overwater villa positioned for spectacular sunset views, featuring direct lagoon access.',
                    'price_per_night': None,
                    'currency': 'USD',
                    'occupancy_adults': 2,
                    'occupancy_children': 0,
                    'bed_configuration': '1 King Bed',
                    'amenities': self._build_room_amenities(imgs['rooms']['sunset_overwater_villa'], [
                        'Sea View',
                        'Sunset orientation',
                        'Direct lagoon access',
                        'Private sundeck',
                        'Free WiFi',
                    ]),
                    'order': 4,
                    'is_active': True,
                    'hide_price': True,
                },
                {
                    'name': 'Sunset Overwater Villa with Swirl Pool',
                    'description': 'Ultimate 42 sqm overwater villa with private swirl pool facing the sunset, direct lagoon access, and premium amenities.',
                    'price_per_night': None,
                    'currency': 'USD',
                    'occupancy_adults': 2,
                    'occupancy_children': 0,
                    'bed_configuration': '1 King Bed',
                    'amenities': self._build_room_amenities(imgs['rooms']['sunset_overwater_swirl_pool'], [
                        'Sea View',
                        'Private Swirl Pool',
                        'Sunset orientation',
                        'Direct lagoon access',
                        'Free WiFi',
                    ]),
                    'order': 5,
                    'is_active': True,
                    'hide_price': True,
                },
                {
                    'name': 'Overwater Villa with Swirl Pool',
                    'description': 'Expansive 42 sqm overwater villa with private pool, stunning sunrise views, and luxurious amenities.',
                    'price_per_night': None,
                    'currency': 'USD',
                    'occupancy_adults': 2,
                    'occupancy_children': 0,
                    'bed_configuration': '1 King Bed',
                    'amenities': self._build_room_amenities(imgs['rooms']['sunrise_overwater_pool_villa'], [
                        'Sea View',
                        'Private Pool',
                        'Sunrise orientation',
                        'Direct lagoon access',
                        'Premium Amenities',
                    ]),
                    'order': 6,
                    'is_active': True,
                    'hide_price': True,
                },
            ],
        }
        
        # Resort 3: Centara Mirage Lagoon
        imgs = IMAGES['centara_mirage']
        resort3 = {
            'name': 'Centara Mirage Lagoon Maldives',
            'description': 'A spectacular family-friendly resort featuring the Maldives\' largest water park, adventure activities, and unique overwater villas connected by a floating boardwalk.',
            'detailed_description': '''Centara Mirage Lagoon Maldives is a groundbreaking family resort that redefines the Maldivian holiday experience. Located in North Malé Atoll, the resort features the largest water theme park in the Maldives - Mirage Waterworld - with thrilling slides, a lazy river, and splash zones for all ages.

The resort offers 145 rooms and villas, from panoramic rooms with stunning ocean views to luxurious overwater villas with private jacuzzis. The unique floating boardwalk connects the overwater villas, creating a sense of community while maintaining privacy.

Families can enjoy the Camp Safari kids club, themed adventure activities, and multiple dining options including family-friendly restaurants and a floating cocktail bar. The resort also features an adults-only sanctuary for parents seeking relaxation.

With easy accessibility from Malé (just 10 minutes by speedboat) and exceptional value, Centara Mirage Lagoon is the perfect choice for families seeking adventure and memories that last a lifetime.''',
            'category': 'family_friendly',
            'star_rating': 5,
            'location_data': {
                'island': 'Huraa',
                'atoll': 'North Malé Atoll',
                'latitude': 4.3236,
                'longitude': 73.5903,
            },
            'atoll': 'North Malé Atoll',
            'island_name': 'Huraa',
            'coordinates': '4.3236, 73.5903',
            'phone': '+960 665 7000',
            'email': 'cmlm@chr.co.th',
            'website': 'https://www.centarahotelsresorts.com/centara/cmlm',
            'whatsapp_number': '+960 665 7000',
            'currency': 'USD',
            'pricing_notes': 'Contact us for family packages and special offers.',
            'total_villas': 145,
            'beach_villas': 45,
            'water_villas': 60,
            'overwater_villas': 40,
            'restaurants': 5,
            'bars': 3,
            'spa_centers': 1,
            'fitness_centers': 1,
            'pools': 3,
            'dive_centers': 1,
            'water_sports_centers': 1,
            'diving_available': True,
            'snorkeling_available': True,
            'fishing_available': True,
            'sailing_available': True,
            'spa_services': True,
            'water_sports': True,
            'land_activities': True,
            'cultural_experiences': True,
            'transfer_type': 'Speedboat',
            'transfer_duration': '10 minutes from Malé',
            'transfer_cost': Decimal('0.00'),
            'is_adults_only': False,
            'is_family_friendly': True,
            'is_honeymoon_special': False,
            'is_eco_friendly': True,
            'is_private_island': True,
            'has_house_reef': True,
            'is_packaged': False,
            'is_room_type': True,
            'has_private_beach': True,
            'is_featured': True,
            'is_active': True,
            'display_order': 3,
            'meta_title': 'Centara Mirage Lagoon Maldives - Family Water Park Resort',
            'meta_description': 'Ultimate family resort in the Maldives with the largest water park, adventure activities, and overwater villas just 10 minutes from the airport.',
            'gallery_images': self._build_gallery_images(imgs),
            'featured_highlights': [
                'Largest water park in the Maldives',
                'Only 10 minutes from airport',
                'Camp Safari kids club',
                'Floating overwater boardwalk',
                'Adventure activities for all ages',
                'Adults-only sanctuary area',
            ],
            'room_types': [
                {
                    'name': 'Panoramic Lagoon Room',
                    'description': 'Modern room with floor-to-ceiling windows offering stunning lagoon views, king bed, and access to water park.',
                    'price_per_night': None,
                    'currency': 'USD',
                    'occupancy_adults': 2,
                    'occupancy_children': 2,
                    'bed_configuration': '1 King Bed or 2 Twin Beds',
                    'amenities': self._build_room_amenities(imgs['rooms']['panoramic_lagoon_room'], [
                        'Panoramic lagoon views',
                        'Floor-to-ceiling windows',
                        'Water park access',
                        'Private balcony',
                        'Free WiFi',
                    ]),
                    'order': 1,
                    'is_active': True,
                    'hide_price': True,
                },
                {
                    'name': 'Panoramic Lagoon Room with Open-Air Bath',
                    'description': 'Modern room with stunning lagoon views and unique open-air bath experience, perfect for relaxation.',
                    'price_per_night': None,
                    'currency': 'USD',
                    'occupancy_adults': 2,
                    'occupancy_children': 2,
                    'bed_configuration': '1 King Bed or 2 Twin Beds',
                    'amenities': self._build_room_amenities(imgs['rooms']['panoramic_lagoon_open_air_bath'], [
                        'Panoramic lagoon views',
                        'Open-Air Bath',
                        'Water park access',
                        'Private balcony',
                        'Free WiFi',
                    ]),
                    'order': 2,
                    'is_active': True,
                    'hide_price': True,
                },
                {
                    'name': 'Beachfront Room',
                    'description': 'Spacious beachfront room with direct beach access, private terrace, and stunning sunrise views.',
                    'price_per_night': None,
                    'currency': 'USD',
                    'occupancy_adults': 2,
                    'occupancy_children': 2,
                    'bed_configuration': '1 King Bed or 2 Twin Beds',
                    'amenities': self._build_room_amenities(imgs['rooms']['beachfront_room'], [
                        'Direct beach access',
                        'Private terrace',
                        'Sunrise views',
                        'Water park access',
                        'Free WiFi',
                    ]),
                    'order': 3,
                    'is_active': True,
                    'hide_price': True,
                },
                {
                    'name': 'Beachfront Room with Open Air-bath',
                    'description': 'Beachfront room with direct beach access and unique open-air bath experience for ultimate relaxation.',
                    'price_per_night': None,
                    'currency': 'USD',
                    'occupancy_adults': 2,
                    'occupancy_children': 2,
                    'bed_configuration': '1 King Bed or 2 Twin Beds',
                    'amenities': self._build_room_amenities(imgs['rooms']['beachfront_open_air_bath'], [
                        'Direct beach access',
                        'Open-Air Bath',
                        'Private terrace',
                        'Water park access',
                        'Free WiFi',
                    ]),
                    'order': 4,
                    'is_active': True,
                    'hide_price': True,
                },
                {
                    'name': 'Mirage Panoramic Room with Jacuzzi',
                    'description': 'Modern panoramic room with private jacuzzi, floor-to-ceiling windows, and stunning lagoon views.',
                    'price_per_night': None,
                    'currency': 'USD',
                    'occupancy_adults': 2,
                    'occupancy_children': 2,
                    'bed_configuration': '1 King Bed or 2 Twin Beds',
                    'amenities': self._build_room_amenities(imgs['rooms']['panoramic_room_jacuzzi'], [
                        'Panoramic lagoon views',
                        'Private Jacuzzi',
                        'Floor-to-ceiling windows',
                        'Water park access',
                        'Free WiFi',
                    ]),
                    'order': 5,
                    'is_active': True,
                    'hide_price': True,
                },
                {
                    'name': 'Mirage Beachfront Room with Jacuzzi',
                    'description': 'Beachfront room with private jacuzzi, direct beach access, and stunning ocean views.',
                    'price_per_night': None,
                    'currency': 'USD',
                    'occupancy_adults': 2,
                    'occupancy_children': 2,
                    'bed_configuration': '1 King Bed or 2 Twin Beds',
                    'amenities': self._build_room_amenities(imgs['rooms']['beachfront_room_jacuzzi'], [
                        'Direct beach access',
                        'Private Jacuzzi',
                        'Private terrace',
                        'Water park access',
                        'Free WiFi',
                    ]),
                    'order': 6,
                    'is_active': True,
                    'hide_price': True,
                },
                {
                    'name': 'Overwater Villa with Jacuzzi',
                    'description': 'Stunning overwater villa with private jacuzzi, direct lagoon access, and glass floor panel for underwater viewing.',
                    'price_per_night': None,
                    'currency': 'USD',
                    'occupancy_adults': 2,
                    'occupancy_children': 2,
                    'bed_configuration': '1 King Bed',
                    'amenities': self._build_room_amenities(imgs['rooms']['overwater_villa_jacuzzi'], [
                        'Private jacuzzi',
                        'Direct lagoon access',
                        'Glass floor panel',
                        'Private sundeck',
                        'Water park access',
                    ]),
                    'order': 7,
                    'is_active': True,
                    'hide_price': True,
                },
                {
                    'name': 'Mirage Overwater Sunset Pool Villa',
                    'description': 'Luxurious overwater villa with private pool facing the sunset, spacious living area, and premium amenities.',
                    'price_per_night': None,
                    'currency': 'USD',
                    'occupancy_adults': 2,
                    'occupancy_children': 2,
                    'bed_configuration': '1 King Bed',
                    'amenities': self._build_room_amenities(imgs['rooms']['overwater_sunset_pool_villa'], [
                        'Private infinity pool',
                        'Sunset orientation',
                        'Direct lagoon access',
                        'Spacious sundeck',
                        'Water park access',
                    ]),
                    'order': 8,
                    'is_active': True,
                    'hide_price': True,
                },
                {
                    'name': 'Four Bedroom Beach House',
                    'description': 'Extraordinary four-bedroom beach house perfect for large families or groups, featuring private patio, multiple bathrooms, and exclusive amenities.',
                    'price_per_night': None,
                    'currency': 'USD',
                    'occupancy_adults': 8,
                    'occupancy_children': 4,
                    'bed_configuration': '4 King Beds',
                    'amenities': self._build_room_amenities(imgs['rooms']['four_bedroom_beach_house'], [
                        'Four separate bedrooms',
                        'Direct beach access',
                        'Private patio with pool',
                        'Full kitchen',
                        'Dedicated butler',
                        'Exclusive kids amenities',
                    ]),
                    'order': 9,
                    'is_active': True,
                    'hide_price': True,
                },
                {
                    'name': 'Overwater Sunrise Villa with Jacuzzi',
                    'description': 'Embark on a tropical escape in our Overwater Sunrise Villa with Jacuzzi. Revel at the stunning sunrise views over crystalline waters, lounge in the hammock and rest easy in the comfort of your King bed. 110 sqm of luxury suspended over the lagoon.',
                    'price_per_night': None,
                    'currency': 'USD',
                    'occupancy_adults': 2,
                    'occupancy_children': 1,
                    'bed_configuration': '1 King Bed',
                    'amenities': self._build_room_amenities(imgs['rooms']['overwater_sunrise_villa_jacuzzi'], [
                        'Sunrise views',
                        'Outdoor Jacuzzi',
                        'Direct lagoon access',
                        'Hammock',
                        'Spacious bathroom with bathtub',
                        'Furnished terrace',
                        'Free WiFi',
                        'Air Conditioning',
                        'In-room safe',
                        'Coffee/Tea Maker',
                        'Mini Bar',
                    ]),
                    'order': 10,
                    'is_active': True,
                    'hide_price': True,
                },
                {
                    'name': 'Mirage Overwater Villa with Jacuzzi',
                    'description': 'Embark on a tropical escape in our Mirage Overwater Villa with Jacuzzi with 59.9 square metres of luxury suspended over crystalline waters. Revel at the views, lounge in the hammock and rest easy in the comfort of your King bed. Bunk beds for your children make this the ideal family retreat.',
                    'price_per_night': None,
                    'currency': 'USD',
                    'occupancy_adults': 2,
                    'occupancy_children': 2,
                    'bed_configuration': '1 King Bed + Bunk Beds',
                    'amenities': self._build_room_amenities(imgs['rooms']['mirage_overwater_villa_with_jacuzzi'], [
                        'Outdoor Jacuzzi',
                        'Direct lagoon access',
                        'Hammock',
                        'Bunk beds for children',
                        'Shower',
                        'Free WiFi',
                        'Air Conditioning',
                        'In-room safe',
                        'Coffee/Tea Maker',
                        'Mini Bar',
                    ]),
                    'order': 11,
                    'is_active': True,
                    'hide_price': True,
                },
                {
                    'name': 'Mirage Overwater Sunset Villa with Jacuzzi',
                    'description': 'Embark on a tropical escape in our Mirage Overwater Sunset Villa with Jacuzzi. Revel at the stunning sunset views over crystalline waters, lounge in the hammock and rest easy in the comfort of your King bed. 110 sqm of luxury suspended over the lagoon.',
                    'price_per_night': None,
                    'currency': 'USD',
                    'occupancy_adults': 2,
                    'occupancy_children': 1,
                    'bed_configuration': '1 King Bed',
                    'amenities': self._build_room_amenities(imgs['rooms']['mirage_overwater_sunset_villa_with_jacuzzi'], [
                        'Sunset views',
                        'Outdoor Jacuzzi',
                        'Direct lagoon access',
                        'Hammock',
                        'Spacious bathroom with bathtub',
                        'Furnished terrace',
                        'Free WiFi',
                        'Air Conditioning',
                        'In-room safe',
                        'Coffee/Tea Maker',
                        'Mini Bar',
                    ]),
                    'order': 12,
                    'is_active': True,
                    'hide_price': True,
                },
                {
                    'name': 'Mirage Overwater Sunrise Pool Villa',
                    'description': 'Embark on a tropical escape in our Mirage Overwater Sunrise Pool Villa. Revel at the stunning sunrise views over crystalline waters and enjoy your private plunge pool. 110 sqm of luxury suspended over the lagoon with direct access to the turquoise waters.',
                    'price_per_night': None,
                    'currency': 'USD',
                    'occupancy_adults': 2,
                    'occupancy_children': 1,
                    'bed_configuration': '1 King Bed',
                    'amenities': self._build_room_amenities(imgs['rooms']['mirage_overwater_sunrise_pool_villa'], [
                        'Sunrise views',
                        'Private plunge pool',
                        'Direct lagoon access',
                        'Spacious bathroom with bathtub',
                        'Furnished terrace',
                        'Free WiFi',
                        'Air Conditioning',
                        'In-room safe',
                        'Coffee/Tea Maker',
                        'Mini Bar',
                    ]),
                    'order': 13,
                    'is_active': True,
                    'hide_price': True,
                },
                {
                    'name': 'Four Bedroom Mirage Beach House',
                    'description': 'Extraordinary four-bedroom beach house perfect for large families or groups. This expansive 297 sqm residence features four bedrooms with king-size beds, spacious living and dining areas, fully equipped kitchen, private pool, and direct beach access. Ideal for up to 12 adults or 8 adults and 4 children.',
                    'price_per_night': None,
                    'currency': 'USD',
                    'occupancy_adults': 8,
                    'occupancy_children': 4,
                    'bed_configuration': '4 King Beds',
                    'amenities': self._build_room_amenities(imgs['rooms']['four_bedroom_mirage_beach_house'], [
                        'Four separate bedrooms',
                        'Direct beach access',
                        'Private pool',
                        'Fully equipped kitchen',
                        'Spacious living and dining areas',
                        'Multiple bathrooms with bathtubs',
                        'Furnished terrace',
                        'Free WiFi',
                        'Air Conditioning',
                        'Flat-screen TVs',
                        'In-room safe',
                        'Coffee/Tea Maker',
                        'Mini Bar',
                    ]),
                    'order': 14,
                    'is_active': True,
                    'hide_price': True,
                },
            ],
        }
        
        # Resort 4: Centara Grand Lagoon
        imgs = IMAGES['centara_grand_lagoon']
        resort4 = {
            'name': 'Centara Grand Lagoon Maldives',
            'description': 'An ultra-luxury resort featuring expansive pool villas, two and three-bedroom residences, world-class dining, and impeccable butler service in a pristine lagoon setting.',
            'detailed_description': '''Centara Grand Lagoon Maldives represents the pinnacle of luxury hospitality in the Maldives. This exclusive resort offers spacious pool villas and residences, each designed for discerning travelers seeking privacy, space, and uncompromising service.

Every villa features a private infinity pool, direct lagoon access, and butler service as standard. The resort's two and three-bedroom residences are perfect for families or groups traveling together, offering generous living spaces and interconnecting options.

Dining at Centara Grand Lagoon is a culinary journey, with multiple restaurants offering Thai, Japanese, Mediterranean, and international cuisines. The resort's signature overwater restaurant provides an unforgettable setting for romantic dinners under the stars.

The SPA Cenvaree offers holistic wellness treatments in stunning overwater pavilions, while the resort's PADI dive center provides access to pristine dive sites. With meticulous attention to detail and personalized service, Centara Grand Lagoon creates extraordinary experiences for every guest.''',
            'category': 'luxury',
            'star_rating': 6,
            'location_data': {
                'island': 'Olhuveli',
                'atoll': 'South Malé Atoll',
                'latitude': 3.8422,
                'longitude': 73.4514,
            },
            'atoll': 'South Malé Atoll',
            'island_name': 'Olhuveli',
            'coordinates': '3.8422, 73.4514',
            'phone': '+960 664 8000',
            'email': 'cglm@chr.co.th',
            'website': 'https://www.centarahotelsresorts.com/centaragrand/cglm',
            'whatsapp_number': '+960 664 8000',
            'currency': 'USD',
            'pricing_notes': 'Contact us for exclusive rates and bespoke experiences.',
            'total_villas': 80,
            'beach_villas': 30,
            'water_villas': 50,
            'overwater_villas': 40,
            'restaurants': 6,
            'bars': 4,
            'spa_centers': 1,
            'fitness_centers': 1,
            'pools': 2,
            'dive_centers': 1,
            'water_sports_centers': 1,
            'diving_available': True,
            'snorkeling_available': True,
            'fishing_available': True,
            'sailing_available': True,
            'spa_services': True,
            'water_sports': True,
            'land_activities': True,
            'cultural_experiences': True,
            'transfer_type': 'Speedboat',
            'transfer_duration': '45 minutes from Malé',
            'transfer_cost': Decimal('0.00'),
            'is_adults_only': False,
            'is_family_friendly': True,
            'is_honeymoon_special': True,
            'is_eco_friendly': True,
            'is_private_island': True,
            'has_house_reef': True,
            'is_packaged': False,
            'is_room_type': True,
            'has_private_beach': True,
            'is_featured': True,
            'is_active': True,
            'display_order': 4,
            'meta_title': 'Centara Grand Lagoon Maldives - Ultra-Luxury Pool Villas',
            'meta_description': 'Ultra-luxury resort featuring expansive pool villas, residences, world-class dining, and butler service in a pristine Maldivian lagoon.',
            'gallery_images': self._build_gallery_images(imgs),
            'featured_highlights': [
                'All villas with private pools',
                'Butler service as standard',
                '6-star ultra-luxury experience',
                'World-class dining venues',
                'Overwater spa pavilions',
                'Multi-bedroom residences',
            ],
            'room_types': [
                {
                    'name': 'Two-Bedroom Family Overwater Villa with Jacuzzi',
                    'description': 'Spacious two-bedroom overwater villa with private outdoor Jacuzzi, perfect for families. Features direct lagoon access and premium amenities.',
                    'price_per_night': None,
                    'currency': 'USD',
                    'occupancy_adults': 4,
                    'occupancy_children': 2,
                    'bed_configuration': '2 King Beds',
                    'amenities': self._build_room_amenities(imgs['rooms']['two_bed_family_overwater_jacuzzi'], [
                        'Sea View',
                        'Two Bedrooms',
                        'Private Outdoor Jacuzzi',
                        'Direct lagoon access',
                        'Dedicated butler',
                    ]),
                    'order': 1,
                    'is_active': True,
                    'hide_price': True,
                },
                {
                    'name': 'One-Bedroom Overwater Pool Villa',
                    'description': 'Luxurious one-bedroom overwater villa with private infinity pool, direct lagoon access, and stunning ocean views.',
                    'price_per_night': None,
                    'currency': 'USD',
                    'occupancy_adults': 2,
                    'occupancy_children': 2,
                    'bed_configuration': '1 King Bed',
                    'amenities': self._build_room_amenities(imgs['rooms']['one_bed_overwater_pool'], [
                        'Sea View',
                        'Private infinity pool',
                        'Direct lagoon access',
                        'Glass floor panels',
                        'Dedicated butler',
                    ]),
                    'order': 2,
                    'is_active': True,
                    'hide_price': True,
                },
                {
                    'name': 'Two-Bedroom Family Overwater Pool Villa',
                    'description': 'Expansive two-bedroom overwater villa with private pool, perfect for families. Features separate living area and premium butler service.',
                    'price_per_night': None,
                    'currency': 'USD',
                    'occupancy_adults': 4,
                    'occupancy_children': 2,
                    'bed_configuration': '2 King Beds',
                    'amenities': self._build_room_amenities(imgs['rooms']['two_bed_family_overwater_pool'], [
                        'Sea View',
                        'Two Bedrooms',
                        'Private infinity pool',
                        'Direct lagoon access',
                        'Separate living area',
                        'Dedicated butler team',
                    ]),
                    'order': 3,
                    'is_active': True,
                    'hide_price': True,
                },
                {
                    'name': 'One-Bedroom Sunset Overwater Pool Villa',
                    'description': 'Stunning one-bedroom overwater villa with private pool facing the sunset, direct lagoon access, and panoramic ocean views.',
                    'price_per_night': None,
                    'currency': 'USD',
                    'occupancy_adults': 2,
                    'occupancy_children': 2,
                    'bed_configuration': '1 King Bed',
                    'amenities': self._build_room_amenities(imgs['rooms']['one_bed_sunset_overwater_pool'], [
                        'Sea View',
                        'Private infinity pool',
                        'Sunset orientation',
                        'Direct lagoon access',
                        'Dedicated butler',
                    ]),
                    'order': 4,
                    'is_active': True,
                    'hide_price': True,
                },
                {
                    'name': 'One-Bedroom Sunset Beach Pool Villa',
                    'description': 'Exquisite one-bedroom beachfront villa with private pool, stunning sea views, and direct beach access. Perfect for couples.',
                    'price_per_night': None,
                    'currency': 'USD',
                    'occupancy_adults': 2,
                    'occupancy_children': 1,
                    'bed_configuration': '1 King Bed',
                    'amenities': self._build_room_amenities(imgs['rooms']['one_bed_sunset_beach_pool'], [
                        'Sea View',
                        'Private Pool',
                        'Direct beach access',
                        'Sunset views',
                        'Dedicated butler',
                    ]),
                    'order': 5,
                    'is_active': True,
                    'hide_price': True,
                },
                {
                    'name': 'Two-Bedroom Family Sunset Beach Pool Villa',
                    'description': 'Spacious two-bedroom beachfront villa with private pool facing the sunset, perfect for families. Features direct beach access.',
                    'price_per_night': None,
                    'currency': 'USD',
                    'occupancy_adults': 4,
                    'occupancy_children': 2,
                    'bed_configuration': '2 King Beds',
                    'amenities': self._build_room_amenities(imgs['rooms']['two_bed_family_sunset_beach_pool'], [
                        'Sea View',
                        'Two Bedrooms',
                        'Private Pool',
                        'Sunset views',
                        'Direct beach access',
                        'Dedicated butler',
                    ]),
                    'order': 6,
                    'is_active': True,
                    'hide_price': True,
                },
                {
                    'name': 'One-Bedroom Sunrise Beach Pool Villa',
                    'description': 'Magnificent one-bedroom beachfront villa oriented for stunning sunrise views, featuring private pool and lush tropical gardens.',
                    'price_per_night': None,
                    'currency': 'USD',
                    'occupancy_adults': 2,
                    'occupancy_children': 1,
                    'bed_configuration': '1 King Bed',
                    'amenities': self._build_room_amenities(imgs['rooms']['one_bed_sunrise_beach_pool'], [
                        'Sea View',
                        'Private Pool',
                        'Sunrise orientation',
                        'Direct beach access',
                        'Dedicated butler',
                    ]),
                    'order': 7,
                    'is_active': True,
                    'hide_price': True,
                },
                {
                    'name': 'Grand Two Bedroom Beach Pool Villa',
                    'description': 'Ultimate two-bedroom beachfront villa with private pool, expansive outdoor area, and exclusive butler service. Ideal for families.',
                    'price_per_night': None,
                    'currency': 'USD',
                    'occupancy_adults': 4,
                    'occupancy_children': 2,
                    'bed_configuration': '2 King Beds',
                    'amenities': self._build_room_amenities(imgs['rooms']['grand_two_bedromm_beach_pool_villa'], [
                        'Sea View',
                        'Two Bedrooms',
                        'Private Pool',
                        'Direct beach access',
                        'Dedicated butler team',
                    ]),
                    'order': 8,
                    'is_active': True,
                    'hide_price': True,
                },
                {
                    'name': 'One-Bedroom Overwater Villa with Jacuzzi',
                    'description': 'Stunning one-bedroom overwater villa with private outdoor Jacuzzi and direct access to the lagoon. Accommodates up to 2 adults and 2 children.',
                    'price_per_night': None,
                    'currency': 'USD',
                    'occupancy_adults': 2,
                    'occupancy_children': 2,
                    'bed_configuration': '1 King Bed',
                    'amenities': self._build_room_amenities(imgs['rooms']['one_bed_overwater_jacuzzi'], [
                        'Sea View',
                        'Private Outdoor Jacuzzi',
                        'Direct lagoon access',
                        'Glass floor panels',
                        'Dedicated butler',
                    ]),
                    'order': 9,
                    'is_active': True,
                    'hide_price': True,
                },
                {
                    'name': 'Grand Two Bedroom Overwater Pool Villa',
                    'description': 'Ultimate luxury two-bedroom overwater villa with private infinity pool, spacious living area, and panoramic lagoon views. This 162 sqm villa features two bedrooms with king-size beds, each with en-suite bathrooms, and offers direct lagoon access from the furnished terrace. Perfect for families seeking the ultimate overwater experience.',
                    'price_per_night': None,
                    'currency': 'USD',
                    'occupancy_adults': 4,
                    'occupancy_children': 2,
                    'bed_configuration': '2 King Beds',
                    'amenities': self._build_room_amenities(imgs['rooms']['grand_two_bed_overwater_pool'], [
                        'Two Bedrooms with en-suite bathrooms',
                        'Private infinity pool',
                        'Spacious living area',
                        'Dining space',
                        'Direct lagoon access',
                        'Furnished terrace with sun loungers',
                        'Panoramic lagoon views',
                        'Free WiFi',
                        'Air Conditioning',
                        'Flat-screen TVs',
                        'In-room safe',
                        'Coffee/Tea Maker',
                        'Mini Bar',
                        'Dedicated butler team',
                    ]),
                    'order': 10,
                    'is_active': True,
                    'hide_price': True,
                },
            ],
        }
        
        return [resort1, resort2, resort3, resort4]
