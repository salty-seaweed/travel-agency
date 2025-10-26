from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
from api.models import (
    Resort, Location, Amenity, PropertyType, ResortImage, ResortReview, ResortAmenity
)
from decimal import Decimal
import random

class Command(BaseCommand):
    help = 'Populate database with sample resort data'

    def handle(self, *args, **options):
        self.stdout.write('Creating sample resort data...')

        # Create or get locations
        locations = []
        location_data = [
            {'island': 'Velaa Private Island', 'atoll': 'Noonu Atoll', 'latitude': 4.2167, 'longitude': 73.5333},
            {'island': 'Soneva Fushi', 'atoll': 'Baa Atoll', 'latitude': 5.1167, 'longitude': 72.9833},
            {'island': 'Conrad Maldives', 'atoll': 'South Ari Atoll', 'latitude': 3.8333, 'longitude': 72.8333},
            {'island': 'Four Seasons Resort', 'atoll': 'Baa Atoll', 'latitude': 5.2167, 'longitude': 72.9167},
            {'island': 'St. Regis Maldives', 'atoll': 'Dhaalu Atoll', 'latitude': 2.8333, 'longitude': 72.8333},
            {'island': 'Waldorf Astoria', 'atoll': 'South Malé Atoll', 'latitude': 3.7167, 'longitude': 73.4167},
            {'island': 'Cheval Blanc Randheli', 'atoll': 'Noonu Atoll', 'latitude': 4.3167, 'longitude': 73.6167},
            {'island': 'Soneva Jani', 'atoll': 'Noonu Atoll', 'latitude': 4.4167, 'longitude': 73.7167},
        ]
        
        for data in location_data:
            location, created = Location.objects.get_or_create(
                island=data['island'],
                atoll=data['atoll'],
                defaults={
                    'latitude': data['latitude'],
                    'longitude': data['longitude']
                }
            )
            locations.append(location)
            if created:
                self.stdout.write(f'Created location: {data["island"]}, {data["atoll"]}')

        # Create or get amenities
        amenities = []
        amenity_names = [
            'WiFi', 'Air Conditioning', 'Pool', 'Beach Access', 'Restaurant',
            'Bar', 'Spa', 'Gym', 'Free Breakfast', 'Room Service',
            'Ocean View', 'Private Balcony', 'Kitchen', 'Laundry', 'Airport Transfer',
            'Diving Center', 'Water Sports', 'Tennis Court', 'Golf Course', 'Kids Club',
            'Library', 'Business Center', 'Concierge', 'Butler Service', 'Private Beach',
            'Overwater Villa', 'Beach Villa', 'Garden Villa', 'Presidential Suite', 'Honeymoon Suite'
        ]
        
        for name in amenity_names:
            amenity, created = Amenity.objects.get_or_create(name=name)
            amenities.append(amenity)
            if created:
                self.stdout.write(f'Created amenity: {name}')

        # Create resort data
        resort_data = [
            {
                'name': 'Velaa Private Island',
                'description': 'Ultra-luxury private island resort offering unparalleled privacy and exclusivity in the Maldives.',
                'detailed_description': 'Velaa Private Island is a masterpiece of luxury and exclusivity. This ultra-luxury resort offers 47 private villas and residences, each with its own infinity pool and direct beach access. The resort features world-class dining, a championship golf course, and exceptional spa services.',
                'category': 'luxury',
                'star_rating': 6,
                'location': 'Velaa Private Island',
                'atoll': 'Noonu Atoll',
                'island_name': 'Velaa Private Island',
                'coordinates': '4.2167, 73.5333',
                'phone': '+960 656 5000',
                'email': 'info@velaaprivateisland.com',
                'website': 'https://www.velaaprivateisland.com',
                'whatsapp_number': '+960 656 5000',
                'price_per_night_from': Decimal('2500.00'),
                'price_per_night_to': Decimal('15000.00'),
                'total_villas': 47,
                'beach_villas': 20,
                'water_villas': 20,
                'overwater_villas': 7,
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
                'transfer_duration': '45 minutes',
                'transfer_cost': Decimal('800.00'),
                'is_adults_only': False,
                'is_family_friendly': True,
                'is_honeymoon_special': True,
                'is_eco_friendly': True,
                'is_private_island': True,
                'has_house_reef': True,
                'has_private_beach': True,
                'is_featured': True,
                'featured_highlights': [
                    'Private Island Experience',
                    'Championship Golf Course',
                    'World-Class Spa',
                    'Exclusive Dining',
                    'Personal Butler Service'
                ],
                'amenities': ['WiFi', 'Pool', 'Beach Access', 'Restaurant', 'Bar', 'Spa', 'Gym', 'Ocean View', 'Private Balcony', 'Butler Service', 'Private Beach', 'Overwater Villa', 'Beach Villa', 'Presidential Suite']
            },
            {
                'name': 'Soneva Fushi',
                'description': 'Barefoot luxury resort with a focus on sustainability and authentic experiences.',
                'detailed_description': 'Soneva Fushi redefines luxury with its "no news, no shoes" philosophy. This eco-friendly resort offers spacious beach and water villas, world-class dining, and unique experiences like stargazing and marine conservation programs.',
                'category': 'luxury',
                'star_rating': 6,
                'location': 'Soneva Fushi',
                'atoll': 'Baa Atoll',
                'island_name': 'Kunfunadhoo Island',
                'coordinates': '5.1167, 72.9833',
                'phone': '+960 660 0304',
                'email': 'reservations@soneva.com',
                'website': 'https://www.soneva.com/soneva-fushi',
                'whatsapp_number': '+960 660 0304',
                'price_per_night_from': Decimal('1800.00'),
                'price_per_night_to': Decimal('12000.00'),
                'total_villas': 65,
                'beach_villas': 40,
                'water_villas': 25,
                'overwater_villas': 25,
                'restaurants': 6,
                'bars': 4,
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
                'transfer_type': 'Seaplane',
                'transfer_duration': '30 minutes',
                'transfer_cost': Decimal('600.00'),
                'is_adults_only': False,
                'is_family_friendly': True,
                'is_honeymoon_special': True,
                'is_eco_friendly': True,
                'is_private_island': True,
                'has_house_reef': True,
                'has_private_beach': True,
                'is_featured': True,
                'featured_highlights': [
                    'Barefoot Luxury',
                    'Eco-Friendly Design',
                    'Observatory & Stargazing',
                    'Organic Gardens',
                    'Marine Conservation'
                ],
                'amenities': ['WiFi', 'Pool', 'Beach Access', 'Restaurant', 'Bar', 'Spa', 'Gym', 'Ocean View', 'Private Balcony', 'Kids Club', 'Library', 'Business Center', 'Concierge', 'Private Beach', 'Overwater Villa', 'Beach Villa']
            },
            {
                'name': 'Conrad Maldives Rangali Island',
                'description': 'Iconic resort featuring the world-famous underwater restaurant and pristine beaches.',
                'detailed_description': 'Conrad Maldives Rangali Island is home to the world-famous Ithaa Undersea Restaurant and offers a perfect blend of luxury and adventure. The resort features overwater and beach villas, world-class dining, and exceptional water activities.',
                'category': 'luxury',
                'star_rating': 5,
                'location': 'Conrad Maldives',
                'atoll': 'South Ari Atoll',
                'island_name': 'Rangali Island',
                'coordinates': '3.8333, 72.8333',
                'phone': '+960 668 0629',
                'email': 'conrad.maldives@conradhotels.com',
                'website': 'https://www.conradmaldives.com',
                'whatsapp_number': '+960 668 0629',
                'price_per_night_from': Decimal('1200.00'),
                'price_per_night_to': Decimal('8000.00'),
                'total_villas': 150,
                'beach_villas': 75,
                'water_villas': 75,
                'overwater_villas': 75,
                'restaurants': 8,
                'bars': 5,
                'spa_centers': 1,
                'fitness_centers': 1,
                'pools': 4,
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
                'transfer_duration': '25 minutes',
                'transfer_cost': Decimal('500.00'),
                'is_adults_only': False,
                'is_family_friendly': True,
                'is_honeymoon_special': True,
                'is_eco_friendly': False,
                'is_private_island': False,
                'has_house_reef': True,
                'has_private_beach': True,
                'is_featured': True,
                'featured_highlights': [
                    'Underwater Restaurant',
                    'Overwater Spa',
                    'Manta Ray Spotting',
                    'Wine Cellar',
                    'Sunset Cruises'
                ],
                'amenities': ['WiFi', 'Pool', 'Beach Access', 'Restaurant', 'Bar', 'Spa', 'Gym', 'Ocean View', 'Private Balcony', 'Kids Club', 'Library', 'Business Center', 'Concierge', 'Private Beach', 'Overwater Villa', 'Beach Villa', 'Honeymoon Suite']
            },
            {
                'name': 'Four Seasons Resort Maldives at Landaa Giraavaru',
                'description': 'Luxury resort with pristine beaches, world-class spa, and exceptional marine life.',
                'detailed_description': 'Four Seasons Resort Maldives at Landaa Giraavaru offers an authentic Maldivian experience with modern luxury. The resort features spacious beach and water villas, a world-class spa, and exceptional dining options.',
                'category': 'luxury',
                'star_rating': 5,
                'location': 'Four Seasons Resort',
                'atoll': 'Baa Atoll',
                'island_name': 'Landaa Giraavaru',
                'coordinates': '5.2167, 72.9167',
                'phone': '+960 660 0888',
                'email': 'maldives@fourseasons.com',
                'website': 'https://www.fourseasons.com/maldives',
                'whatsapp_number': '+960 660 0888',
                'price_per_night_from': Decimal('1000.00'),
                'price_per_night_to': Decimal('6000.00'),
                'total_villas': 103,
                'beach_villas': 50,
                'water_villas': 53,
                'overwater_villas': 53,
                'restaurants': 5,
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
                'transfer_duration': '35 minutes',
                'transfer_cost': Decimal('550.00'),
                'is_adults_only': False,
                'is_family_friendly': True,
                'is_honeymoon_special': True,
                'is_eco_friendly': True,
                'is_private_island': False,
                'has_house_reef': True,
                'has_private_beach': True,
                'is_featured': True,
                'featured_highlights': [
                    'UNESCO Biosphere Reserve',
                    'Marine Discovery Center',
                    'World-Class Spa',
                    'Turtle Conservation',
                    'Manta Ray Research'
                ],
                'amenities': ['WiFi', 'Pool', 'Beach Access', 'Restaurant', 'Bar', 'Spa', 'Gym', 'Ocean View', 'Private Balcony', 'Kids Club', 'Library', 'Business Center', 'Concierge', 'Private Beach', 'Overwater Villa', 'Beach Villa', 'Honeymoon Suite']
            },
            {
                'name': 'The St. Regis Maldives Vommuli Resort',
                'description': 'Contemporary luxury resort with innovative design and exceptional service.',
                'detailed_description': 'The St. Regis Maldives Vommuli Resort offers contemporary luxury with innovative design. The resort features spacious villas, world-class dining, and the signature St. Regis Butler Service.',
                'category': 'luxury',
                'star_rating': 5,
                'location': 'St. Regis Maldives',
                'atoll': 'Dhaalu Atoll',
                'island_name': 'Vommuli Island',
                'coordinates': '2.8333, 72.8333',
                'phone': '+960 678 0000',
                'email': 'maldives@stregis.com',
                'website': 'https://www.marriott.com/hotels/travel/mlewi-the-st-regis-maldives-vommuli-resort',
                'whatsapp_number': '+960 678 0000',
                'price_per_night_from': Decimal('1500.00'),
                'price_per_night_to': Decimal('9000.00'),
                'total_villas': 77,
                'beach_villas': 40,
                'water_villas': 37,
                'overwater_villas': 37,
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
                'transfer_duration': '40 minutes',
                'transfer_cost': Decimal('650.00'),
                'is_adults_only': False,
                'is_family_friendly': True,
                'is_honeymoon_special': True,
                'is_eco_friendly': False,
                'is_private_island': False,
                'has_house_reef': True,
                'has_private_beach': True,
                'is_featured': False,
                'featured_highlights': [
                    'Contemporary Design',
                    'Butler Service',
                    'Overwater Spa',
                    'Innovative Dining',
                    'Sunset Bar'
                ],
                'amenities': ['WiFi', 'Pool', 'Beach Access', 'Restaurant', 'Bar', 'Spa', 'Gym', 'Ocean View', 'Private Balcony', 'Butler Service', 'Private Beach', 'Overwater Villa', 'Beach Villa', 'Honeymoon Suite']
            },
            {
                'name': 'Waldorf Astoria Maldives Ithaafushi',
                'description': 'Ultra-luxury resort with private island experiences and world-class amenities.',
                'detailed_description': 'Waldorf Astoria Maldives Ithaafushi offers ultra-luxury with private island experiences. The resort features spacious villas, world-class dining, and exclusive experiences in a pristine natural setting.',
                'category': 'luxury',
                'star_rating': 6,
                'location': 'Waldorf Astoria',
                'atoll': 'South Malé Atoll',
                'island_name': 'Ithaafushi Island',
                'coordinates': '3.7167, 73.4167',
                'phone': '+960 400 0000',
                'email': 'maldives@waldorfastoria.com',
                'website': 'https://www.waldorfastoria.com/maldives',
                'whatsapp_number': '+960 400 0000',
                'price_per_night_from': Decimal('2000.00'),
                'price_per_night_to': Decimal('12000.00'),
                'total_villas': 122,
                'beach_villas': 60,
                'water_villas': 62,
                'overwater_villas': 62,
                'restaurants': 6,
                'bars': 4,
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
                'transfer_duration': '45 minutes',
                'transfer_cost': Decimal('300.00'),
                'is_adults_only': False,
                'is_family_friendly': True,
                'is_honeymoon_special': True,
                'is_eco_friendly': True,
                'is_private_island': True,
                'has_house_reef': True,
                'has_private_beach': True,
                'is_featured': True,
                'featured_highlights': [
                    'Private Island Experience',
                    'Ultra-Luxury Villas',
                    'World-Class Dining',
                    'Exclusive Experiences',
                    'Personal Concierge'
                ],
                'amenities': ['WiFi', 'Pool', 'Beach Access', 'Restaurant', 'Bar', 'Spa', 'Gym', 'Ocean View', 'Private Balcony', 'Butler Service', 'Private Beach', 'Overwater Villa', 'Beach Villa', 'Presidential Suite', 'Honeymoon Suite']
            }
        ]

        # Create resorts
        created_resorts = []
        for data in resort_data:
            location = next((loc for loc in locations if loc.island == data['location']), locations[0])
            
            resort, created = Resort.objects.get_or_create(
                name=data['name'],
                defaults={
                    'description': data['description'],
                    'detailed_description': data['detailed_description'],
                    'category': data['category'],
                    'star_rating': data['star_rating'],
                    'location': location,
                    'atoll': data['atoll'],
                    'island_name': data['island_name'],
                    'coordinates': data['coordinates'],
                    'phone': data['phone'],
                    'email': data['email'],
                    'website': data['website'],
                    'whatsapp_number': data['whatsapp_number'],
                    'price_per_night_from': data['price_per_night_from'],
                    'price_per_night_to': data['price_per_night_to'],
                    'total_villas': data['total_villas'],
                    'beach_villas': data['beach_villas'],
                    'water_villas': data['water_villas'],
                    'overwater_villas': data['overwater_villas'],
                    'restaurants': data['restaurants'],
                    'bars': data['bars'],
                    'spa_centers': data['spa_centers'],
                    'fitness_centers': data['fitness_centers'],
                    'pools': data['pools'],
                    'dive_centers': data['dive_centers'],
                    'water_sports_centers': data['water_sports_centers'],
                    'diving_available': data['diving_available'],
                    'snorkeling_available': data['snorkeling_available'],
                    'fishing_available': data['fishing_available'],
                    'sailing_available': data['sailing_available'],
                    'spa_services': data['spa_services'],
                    'water_sports': data['water_sports'],
                    'land_activities': data['land_activities'],
                    'cultural_experiences': data['cultural_experiences'],
                    'transfer_type': data['transfer_type'],
                    'transfer_duration': data['transfer_duration'],
                    'transfer_cost': data['transfer_cost'],
                    'is_adults_only': data['is_adults_only'],
                    'is_family_friendly': data['is_family_friendly'],
                    'is_honeymoon_special': data['is_honeymoon_special'],
                    'is_eco_friendly': data['is_eco_friendly'],
                    'is_private_island': data['is_private_island'],
                    'has_house_reef': data['has_house_reef'],
                    'has_private_beach': data['has_private_beach'],
                    'is_featured': data['is_featured'],
                    'featured_highlights': data['featured_highlights'],
                    'is_active': True,
                    'is_available': True,
                }
            )
            
            if created:
                # Add amenities
                amenity_names = data['amenities']
                resort_amenities = [a for a in amenities if a.name in amenity_names]
                resort.amenities.set(resort_amenities)
                
                # Add sample images
                sample_images = [
                    'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&h=600&fit=crop',
                    'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800&h=600&fit=crop',
                    'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&h=600&fit=crop',
                    'https://images.unsplash.com/photo-1571003123894-15f9e880e2d1?w=800&h=600&fit=crop',
                    'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=600&fit=crop',
                ]
                
                for i, image_url in enumerate(sample_images):
                    ResortImage.objects.create(
                        resort=resort,
                        image=image_url,
                        image_type='gallery',
                        caption=f'{resort.name} - Image {i+1}',
                        alt_text=f'{resort.name} resort view',
                        order=i,
                        is_featured=(i == 0),
                        is_active=True
                    )
                
                # Add sample reviews
                review_data = [
                    {'rating': 5, 'name': 'Sarah Johnson', 'comment': 'Absolutely stunning resort with exceptional service. The overwater villa was beyond our expectations!'},
                    {'rating': 5, 'name': 'Michael Chen', 'comment': 'Perfect honeymoon destination. The staff went above and beyond to make our stay memorable.'},
                    {'rating': 4, 'name': 'Emma Wilson', 'comment': 'Beautiful property with amazing views. The spa treatments were incredible.'},
                    {'rating': 5, 'name': 'David Brown', 'comment': 'Luxury at its finest. The dining experiences were world-class and the location is breathtaking.'},
                    {'rating': 4, 'name': 'Lisa Garcia', 'comment': 'Wonderful resort with excellent amenities. The marine life around the island is spectacular.'},
                ]
                
                for review in review_data:
                    ResortReview.objects.create(
                        resort=resort,
                        guest_name=review['name'],
                        rating=review['rating'],
                        comment=review['comment'],
                        is_approved=True,
                        is_featured=True
                    )
                
                created_resorts.append(resort)
                self.stdout.write(f'Created resort: {data["name"]}')

        self.stdout.write(
            self.style.SUCCESS(
                f'Successfully created:\n'
                f'- {len(locations)} locations\n'
                f'- {len(amenities)} amenities\n'
                f'- {len(created_resorts)} resorts\n'
                f'- Sample images for each resort\n'
                f'- Sample reviews for each resort'
            )
        )
