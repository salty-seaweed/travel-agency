from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
from api.models import Property, Package, PropertyType, Amenity, Location, PropertyImage, Review
from decimal import Decimal
import random

class Command(BaseCommand):
    help = 'Populate database with sample data for the travel agency'

    def handle(self, *args, **options):
        self.stdout.write('Creating sample data...')

        # Create superuser if it doesn't exist
        if not User.objects.filter(username='admin').exists():
            User.objects.create_superuser('admin', 'admin@example.com', 'admin123')
            self.stdout.write('Created admin user: admin/admin123')

        # Create Property Types
        property_types = []
        type_names = ['Resort', 'Guesthouse', 'Villa', 'Hotel', 'Bungalow']
        for name in type_names:
            prop_type, created = PropertyType.objects.get_or_create(name=name)
            property_types.append(prop_type)
            if created:
                self.stdout.write(f'Created property type: {name}')

        # Create Amenities
        amenities = []
        amenity_names = [
            'WiFi', 'Air Conditioning', 'Pool', 'Beach Access', 'Restaurant',
            'Bar', 'Spa', 'Gym', 'Free Breakfast', 'Room Service',
            'Ocean View', 'Private Balcony', 'Kitchen', 'Laundry', 'Airport Transfer'
        ]
        for name in amenity_names:
            amenity, created = Amenity.objects.get_or_create(name=name)
            amenities.append(amenity)
            if created:
                self.stdout.write(f'Created amenity: {name}')

        # Create Locations
        locations = []
        location_data = [
            {'island': 'Male', 'atoll': 'Kaafu Atoll', 'latitude': 3.2028, 'longitude': 73.2207},
            {'island': 'Hulhumale', 'atoll': 'Kaafu Atoll', 'latitude': 4.2167, 'longitude': 73.5333},
            {'island': 'Maafushi', 'atoll': 'Kaafu Atoll', 'latitude': 3.2333, 'longitude': 73.4667},
            {'island': 'Gulhi', 'atoll': 'Kaafu Atoll', 'latitude': 3.1833, 'longitude': 73.4500},
            {'island': 'Thulusdhoo', 'atoll': 'Kaafu Atoll', 'latitude': 4.3667, 'longitude': 73.6500},
            {'island': 'Rasdhoo', 'atoll': 'Ari Atoll', 'latitude': 4.2500, 'longitude': 72.9833},
            {'island': 'Ukulhas', 'atoll': 'Ari Atoll', 'latitude': 4.2167, 'longitude': 72.8667},
            {'island': 'Thoddoo', 'atoll': 'Ari Atoll', 'latitude': 4.4333, 'longitude': 72.9500},
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

        # Create Properties
        properties = []
        property_data = [
            {
                'name': 'Paradise Beach Resort',
                'description': 'Luxury beachfront resort with stunning ocean views and world-class amenities.',
                'price_per_night': '450.00',
                'property_type': 'Resort',
                'location': 'Male',
                'is_featured': True,
                'amenities': ['WiFi', 'Air Conditioning', 'Pool', 'Beach Access', 'Restaurant', 'Bar', 'Spa', 'Ocean View']
            },
            {
                'name': 'Coral Guesthouse',
                'description': 'Cozy guesthouse perfect for budget travelers seeking authentic Maldivian experience.',
                'price_per_night': '120.00',
                'property_type': 'Guesthouse',
                'location': 'Maafushi',
                'is_featured': True,
                'amenities': ['WiFi', 'Air Conditioning', 'Beach Access', 'Free Breakfast']
            },
            {
                'name': 'Ocean View Villa',
                'description': 'Private villa with panoramic ocean views and direct beach access.',
                'price_per_night': '350.00',
                'property_type': 'Villa',
                'location': 'Hulhumale',
                'is_featured': True,
                'amenities': ['WiFi', 'Air Conditioning', 'Pool', 'Beach Access', 'Kitchen', 'Ocean View', 'Private Balcony']
            },
            {
                'name': 'Sunset Lodge',
                'description': 'Charming lodge with spectacular sunset views and local hospitality.',
                'price_per_night': '180.00',
                'property_type': 'Hotel',
                'location': 'Gulhi',
                'is_featured': False,
                'amenities': ['WiFi', 'Air Conditioning', 'Beach Access', 'Restaurant', 'Ocean View']
            },
            {
                'name': 'Island Retreat',
                'description': 'Secluded island retreat offering privacy and tranquility.',
                'price_per_night': '280.00',
                'property_type': 'Bungalow',
                'location': 'Thulusdhoo',
                'is_featured': False,
                'amenities': ['WiFi', 'Air Conditioning', 'Beach Access', 'Kitchen', 'Ocean View']
            },
            {
                'name': 'Blue Lagoon Resort',
                'description': 'Premium resort with crystal clear waters and marine life.',
                'price_per_night': '520.00',
                'property_type': 'Resort',
                'location': 'Rasdhoo',
                'is_featured': True,
                'amenities': ['WiFi', 'Air Conditioning', 'Pool', 'Beach Access', 'Restaurant', 'Bar', 'Spa', 'Gym', 'Ocean View']
            },
            {
                'name': 'Tropical Haven',
                'description': 'Peaceful haven surrounded by tropical gardens and pristine beaches.',
                'price_per_night': '220.00',
                'property_type': 'Guesthouse',
                'location': 'Ukulhas',
                'is_featured': False,
                'amenities': ['WiFi', 'Air Conditioning', 'Beach Access', 'Free Breakfast', 'Ocean View']
            },
            {
                'name': 'Palm Paradise',
                'description': 'Elegant accommodation with palm-fringed beaches and turquoise waters.',
                'price_per_night': '380.00',
                'property_type': 'Villa',
                'location': 'Thoddoo',
                'is_featured': False,
                'amenities': ['WiFi', 'Air Conditioning', 'Pool', 'Beach Access', 'Kitchen', 'Ocean View', 'Private Balcony']
            }
        ]

        for data in property_data:
            location = next((loc for loc in locations if loc.island == data['location']), locations[0])
            prop_type = next((pt for pt in property_types if pt.name == data['property_type']), property_types[0])
            
            property_obj, created = Property.objects.get_or_create(
                name=data['name'],
                defaults={
                    'description': data['description'],
                    'price_per_night': Decimal(data['price_per_night']),
                    'property_type': prop_type,
                    'location': location,
                    'is_featured': data['is_featured'],
                    'whatsapp_number': '+960 123 4567',
                    'address': f"{data['location']}, Maldives"
                }
            )
            
            if created:
                # Add amenities
                amenity_names = data['amenities']
                property_amenities = [a for a in amenities if a.name in amenity_names]
                property_obj.amenities.set(property_amenities)
                
                # Add sample images
                sample_images = [
                    'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&h=600&fit=crop',
                    'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800&h=600&fit=crop',
                    'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&h=600&fit=crop',
                ]
                
                for i, image_url in enumerate(sample_images):
                    PropertyImage.objects.create(
                        property=property_obj,
                        image=image_url,
                        is_featured=(i == 0)
                    )
                
                properties.append(property_obj)
                self.stdout.write(f'Created property: {data["name"]}')

        # Create Packages
        packages = []
        package_data = [
            {
                'name': 'Maldives Adventure Package',
                'description': '7-day adventure package including water sports, island hopping, and cultural experiences.',
                'price': '1200.00',
                'is_featured': True,
                'properties': ['Paradise Beach Resort', 'Coral Guesthouse']
            },
            {
                'name': 'Luxury Escape',
                'description': 'Premium 5-day luxury package with spa treatments, private dining, and exclusive experiences.',
                'price': '2500.00',
                'is_featured': True,
                'properties': ['Ocean View Villa', 'Blue Lagoon Resort']
            },
            {
                'name': 'Budget Explorer',
                'description': 'Affordable 4-day package perfect for budget-conscious travelers.',
                'price': '600.00',
                'is_featured': False,
                'properties': ['Sunset Lodge', 'Tropical Haven']
            }
        ]

        for data in package_data:
            package, created = Package.objects.get_or_create(
                name=data['name'],
                defaults={
                    'description': data['description'],
                    'price': Decimal(data['price']),
                    'is_featured': data['is_featured']
                }
            )
            
            if created:
                # Add properties to package
                property_names = data['properties']
                package_properties = [p for p in properties if p.name in property_names]
                package.properties.set(package_properties)
                
                packages.append(package)
                self.stdout.write(f'Created package: {data["name"]}')

        # Create Sample Reviews
        review_data = [
            {'rating': 5, 'name': 'Sarah Johnson', 'comment': 'Perfect location and excellent service. Highly recommended!'},
            {'rating': 4, 'name': 'Mike Chen', 'comment': 'Beautiful property with friendly staff. Will definitely return.'},
            {'rating': 5, 'name': 'Emma Wilson', 'comment': 'Exceeded all expectations. The views are breathtaking!'},
            {'rating': 4, 'name': 'David Brown', 'comment': 'Clean rooms, great amenities, and perfect location.'},
            {'rating': 5, 'name': 'Lisa Garcia', 'comment': 'Could not have asked for a better experience. Perfect in every way.'},
        ]

        for i, data in enumerate(review_data):
            if i < len(properties):
                Review.objects.get_or_create(
                    property=properties[i],
                    name=data['name'],
                    rating=data['rating'],
                    comment=data['comment'],
                    approved=True
                )

        self.stdout.write(
            self.style.SUCCESS(
                f'Successfully created:\n'
                f'- {len(property_types)} property types\n'
                f'- {len(amenities)} amenities\n'
                f'- {len(locations)} locations\n'
                f'- {len(properties)} properties\n'
                f'- {len(packages)} packages\n'
                f'- Sample reviews\n'
                f'- Admin user (admin/admin123)'
            )
        ) 