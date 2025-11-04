"""
Django management command to add packaged resorts with country restrictions.
Run with: python manage.py add_packaged_resorts
"""
from django.core.management.base import BaseCommand
from django.core.management import CommandError
from api.models import Resort, Location
from decimal import Decimal


class Command(BaseCommand):
    help = 'Add packaged resorts with country restrictions (CN and RU)'

    def add_arguments(self, parser):
        parser.add_argument(
            '--update',
            action='store_true',
            help='Update existing resorts if they already exist',
        )

    def handle(self, *args, **options):
        self.stdout.write(self.style.SUCCESS('Creating packaged resorts with country restrictions...'))

        # Define resort data
        resorts_data = [
            {
                'name': 'China Exclusive Resort Package',
                'description': 'Exclusive luxury resort package designed specifically for Chinese travelers. Experience the ultimate Maldivian paradise with premium amenities and personalized service.',
                'detailed_description': 'This exclusive resort package offers Chinese travelers a luxurious escape in the Maldives. Features include Mandarin-speaking staff, Chinese cuisine options, and culturally tailored experiences. Enjoy overwater villas, world-class diving, and spa treatments designed to provide an authentic yet comfortable experience.',
                'category': 'luxury',
                'star_rating': 5,
                'location_data': {
                    'island': 'Crystal Lagoon Island',
                    'atoll': 'South Ari Atoll',
                    'latitude': 3.8500,
                    'longitude': 72.9000
                },
                'atoll': 'South Ari Atoll',
                'island_name': 'Crystal Lagoon Island',
                'coordinates': '3.8500, 72.9000',
                'phone': '+960 123 4567',
                'email': 'info@chinaexclusive.mv',
                'website': 'https://www.chinaexclusive.mv',
                'whatsapp_number': '+960 123 4567',
                'price_per_night_from': Decimal('800.00'),
                'price_per_night_to': Decimal('2000.00'),
                'currency': 'USD',
                'total_villas': 50,
                'beach_villas': 20,
                'water_villas': 25,
                'overwater_villas': 5,
                'restaurants': 3,
                'bars': 2,
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
                'transfer_duration': '45 minutes',
                'transfer_cost': Decimal('200.00'),
                'is_adults_only': False,
                'is_family_friendly': True,
                'is_honeymoon_special': True,
                'is_eco_friendly': True,
                'is_private_island': True,
                'has_house_reef': True,
                'is_packaged': True,
                'has_private_beach': True,
                'allowed_countries': ['CN'],
                'restricted_regions': [],
                'is_featured': True,
                'is_active': True,
                'is_available': True,
                'display_order': 1,
                'meta_title': 'China Exclusive Maldives Resort Package',
                'meta_description': 'Exclusive luxury resort package for Chinese travelers in the Maldives',
                'featured_highlights': [
                    'Mandarin-speaking staff',
                    'Chinese cuisine available',
                    'Culturally tailored experiences',
                    'Luxury overwater villas'
                ]
            },
            {
                'name': 'Russia Exclusive Resort Package',
                'description': 'Premium resort package exclusively designed for Russian travelers. Discover pristine beaches, crystal-clear waters, and world-class hospitality in the Maldives.',
                'detailed_description': 'This premium resort package offers Russian travelers an exceptional Maldivian experience. Enjoy Russian-speaking staff, European and Russian cuisine options, and activities tailored to Russian preferences. Features include private beach access, luxury accommodations, exceptional diving sites, and spa facilities.',
                'category': 'luxury',
                'star_rating': 5,
                'location_data': {
                    'island': 'Azure Paradise Island',
                    'atoll': 'Baa Atoll',
                    'latitude': 5.1000,
                    'longitude': 72.9500
                },
                'atoll': 'Baa Atoll',
                'island_name': 'Azure Paradise Island',
                'coordinates': '5.1000, 72.9500',
                'phone': '+960 987 6543',
                'email': 'info@russiaexclusive.mv',
                'website': 'https://www.russiaexclusive.mv',
                'whatsapp_number': '+960 987 6543',
                'price_per_night_from': Decimal('850.00'),
                'price_per_night_to': Decimal('2200.00'),
                'currency': 'USD',
                'total_villas': 55,
                'beach_villas': 22,
                'water_villas': 28,
                'overwater_villas': 5,
                'restaurants': 3,
                'bars': 2,
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
                'transfer_duration': '30 minutes',
                'transfer_cost': Decimal('350.00'),
                'is_adults_only': False,
                'is_family_friendly': True,
                'is_honeymoon_special': True,
                'is_eco_friendly': True,
                'is_private_island': True,
                'has_house_reef': True,
                'is_packaged': True,
                'has_private_beach': True,
                'allowed_countries': ['RU'],
                'restricted_regions': [],
                'is_featured': True,
                'is_active': True,
                'is_available': True,
                'display_order': 2,
                'meta_title': 'Russia Exclusive Maldives Resort Package',
                'meta_description': 'Premium resort package for Russian travelers in the Maldives',
                'featured_highlights': [
                    'Russian-speaking staff',
                    'European and Russian cuisine',
                    'Tailored activities',
                    'Private beach access'
                ]
            }
        ]

        created_count = 0
        updated_count = 0
        skipped_count = 0

        for resort_data in resorts_data:
            location_data = resort_data.pop('location_data')
            
            # Get or create location
            location, location_created = Location.objects.get_or_create(
                island=location_data['island'],
                atoll=location_data['atoll'],
                defaults={
                    'latitude': location_data['latitude'],
                    'longitude': location_data['longitude']
                }
            )
            
            if location_created:
                self.stdout.write(self.style.SUCCESS(f'  ✓ Created location: {location}'))
            else:
                self.stdout.write(f'  → Using existing location: {location}')

            # Add location to resort data
            resort_data['location'] = location
            
            # Get or create resort
            resort_name = resort_data['name']
            allowed_countries = resort_data.get('allowed_countries', [])
            
            existing_resort = Resort.objects.filter(
                name=resort_name,
                is_packaged=True
            ).first()

            if existing_resort:
                if options['update']:
                    # Update existing resort
                    for key, value in resort_data.items():
                        setattr(existing_resort, key, value)
                    existing_resort.save()
                    updated_count += 1
                    country_str = ', '.join(allowed_countries) if allowed_countries else 'All countries'
                    self.stdout.write(
                        self.style.WARNING(f'  ↻ Updated resort: {resort_name} (Countries: {country_str})')
                    )
                else:
                    skipped_count += 1
                    country_str = ', '.join(allowed_countries) if allowed_countries else 'All countries'
                    self.stdout.write(
                        self.style.WARNING(f'  ⊘ Skipped existing resort: {resort_name} (Countries: {country_str})')
                    )
            else:
                # Create new resort
                resort = Resort.objects.create(**resort_data)
                created_count += 1
                country_str = ', '.join(allowed_countries) if allowed_countries else 'All countries'
                self.stdout.write(
                    self.style.SUCCESS(f'  ✓ Created resort: {resort_name} (Countries: {country_str})')
                )

        # Summary
        self.stdout.write('')
        self.stdout.write(self.style.SUCCESS('=' * 60))
        self.stdout.write(self.style.SUCCESS('Summary:'))
        self.stdout.write(self.style.SUCCESS(f'  Created: {created_count}'))
        if options['update']:
            self.stdout.write(self.style.SUCCESS(f'  Updated: {updated_count}'))
        if skipped_count > 0:
            self.stdout.write(self.style.WARNING(f'  Skipped: {skipped_count} (use --update to update existing)'))
        self.stdout.write(self.style.SUCCESS('=' * 60))
        
        if created_count > 0 or updated_count > 0:
            self.stdout.write(
                self.style.SUCCESS(
                    '\n✓ Packaged resorts with country restrictions have been added successfully!'
                )
            )
            self.stdout.write('\nNote: These resorts will only be visible to users from their respective countries.')
            self.stdout.write('  - China Exclusive Resort Package: Visible to CN only')
            self.stdout.write('  - Russia Exclusive Resort Package: Visible to RU only')
