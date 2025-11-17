"""
Add room type image URLs to amenities field.

Since we can't easily change ImageField to URLField, we'll add URLs to amenities with a special prefix.

Run with: python manage.py add_room_type_image_urls
"""
from django.core.management.base import BaseCommand
from api.models import Resort


class Command(BaseCommand):
    help = 'Add room type image URLs to amenities for all 18 resorts'

    def get_image_filename_map(self):
        """Map room type names to actual image filenames that don't match - RESORT SPECIFIC"""
        return {
            'Sun Siyam Iru Fushi': {
                'Horizon Water Villa with Pool': 'horizon-water-villa-with-pool-aerial-view.jpg',
                'Celebrity Retreat': 'irufushi_-celeb_retreat_0009.jpg',
                'Infinity Water Villa': 'irufushi_infinity_water_villa_0471.jpg',
            },
            'Sun Siyam Iru Veli': {
                'Beach Suite with Pool': 'beach-suite-with-pool.jpg',
                'Dolphin Suite': 'iruveli_dolphin_suite_0543.jpg',
                'Family Suite with Pool': 'iruveli_family_suite_with_pool_0035.jpg',
                'Grand Beach Suite': 'iruveli_grand_beach_suite_1.jpg',
                'Grand Ocean Suite': 'iruveli_grand_ocean_suite_0152.jpg',
                'King Ocean Suite': 'iruveli_king_ocean_suite_0523.jpg',
                'Ocean Suite with Pool': 'iruveli_ocean_suite_with_pool_1.jpg',
                'Sun Aqua Sultan Suite': 'sun-aqua-sultan-suite.jpg',
            },
            'Sun Siyam Olhuveli': {
                '2BR Beach Residence with Pool': '2br-beach-residence-with-pool.jpg',
                'Beach Villa': 'olhuveli_beachvilla_0044.jpg',
                'Deluxe Beach Villa': 'deluxe-beach-villa-bedroom-1.jpg',
                'Deluxe Water Villa': 'deluxe-water-villa.jpg',
                'Grand Beach Suite with Pool': 'grand-beach-suite-with-pool-view.jpg',
                'Prestige Jacuzzi Water Villa': 'olhuveli-prestige-jacuzzi-water-villa-deck-2.jpg',
                'Romantic Beach Villa with Pool': 'romantic_beach_villa_with_pool.jpg',
                'Romantic Water Villa with Pool': 'romantic_water_villa_with_pool.jpg',
                'Two Bedroom Beach Suite': 'two-bed-room-beach-suite2.jpg',
                'Water Villa': 'olhuveli-water-villa-bedroom-4.jpg',
            },
            'Sun Siyam Vilu Reef': {
                'Beach Villa': 'vilu_reef_beach_villa_0064.jpg',
                'Aqua Villa': 'vilu_reef_aqua_villa_0124.jpg',
                'Jacuzzi Deluxe Beach Villa': 'vilu_reef_jacuzzi_deluxe_beach_villa_0116-1.jpg',
                'Reef Villa': 'vilu_reef_reef_villa_0233.jpg',
                'Sun Aqua Pool Villa': 'vilu_reef_sun_aqua_pool_villa_0078.jpg',
                'Sunset Reef Villa': 'vilu_reef_sunset-_reef_villa_0122.jpg',
            },
            'Sun Siyam World': {
                'Beach Suite with Pool': 'beach-suite-with-pool-view.jpg',
                'Grand Beach Residence with Pool': 'grand-beach-residence-with-pool-8.jpg',
                'Lagoon Villa with Pool Slide': 'lagoon-villa-with-pool-slide-pool-view.jpg',
                'Pool Beach Villa': 'pool-beach-villa-bedroom-1.jpg',
                'Sunset Pool Beach Villa': 'sunset-pool-beach-villa.jpg',
                'Two Bedroom Lagoon Villa with Pool and Slide': 'two-bedroom-lagoon-villa-with-pool-and-slide-aerial-2.jpg',
                'Two Bedroom Pool Beach Villa': 'two-bedroom-pool-beach-villa-pool-view.jpg',
                'Water Pavilion with Slide': 'water-pavilion-with-slide-aerial-view.jpg',
                'Water Villa with Pool and Slide': 'water-villa-with-pool-and-slide-bedroom-2.jpg',
            },
            'Cinnamon Dhonveli Maldives': {
                'Overwater Suite': 'Over%20Water%20Suite.jpg',
            },
            'Dhigufaru Island Resort': {
                'Bodhanfulhu Pool Water Villa': 'Pool%20Water%20Villa.jpg',
            },
            'Holiday Inn Resort Kandooma Maldives': {
                'Beach House': 'Standard%20Rooms.avif',
                'Seaview Villa': 'Standard%20Rooms.avif',
                'Overwater Villa': 'Suite.avif',
                'Standard Room': 'Standard%20Rooms.avif',
                'Two and Three Bedroom Villa': 'Two%20and%20Three%20Bedroom%20Villa.jpg',
            },
            'Kuramathi Maldives': {
                'Beach Villa': '00-beach-villas.jpg',
                'Beach Villa with Jacuzzi': '01-beach-villas-with-jacuzzi.jpg',
                'Water Villa': '00-beach-villas.jpg',
                'Superior Beach Villa with Jacuzzi': '02-superior-beach-villas-with-jacuzzi.jpg',
                'Deluxe Beach Villa with Jacuzzi': '03-deluxe-beach-villas-with-jacuzzi.jpg',
                'Two Bedroom Beach House': '04-two-bedroom-beach-houses.jpg',
                'Water Villa with Jacuzzi': '05-water-villas-with-jacuzzi.jpg',
                'Deluxe Water Villa': '06-deluxe-water-villas.jpg',
                'Water Villa with Pool': '07-water-villas-with-pool.jpg',
                'Sunset Pool Villa': '08-sunset-pool-villas.jpg',
                'Honeymoon Pool Villa': '10-honeymoon-pool-villas.jpg',
                'Thundi Water Villa with Pool': 'Thundi%20Water%20Villas%20with%20Pool.jpg',
            },
            'Kurumba Maldives': {
                'Beachfront Deluxe Bungalow': 'Beachfront%20Deluxe%20Bungalow.jpeg',
                'Royal Kurumba Residence': 'Two%20Bedroom%20Kurumba%20Residence.png',
            },
            'Velassaru Maldives': {
                'Deluxe Bungalow': 'Deluxe-Villa.webp',
            },
            'Villa Nautica Paradise Island': {
                'Beach Villa': 'Villa-Nautica-Beach-Villa.jpg',
                'Deluxe Beach Pool Villa': 'Villa-Nautica-Deluxe-Beach-Pool-Villa.jpg',
                'Sunset Beach Pool Villa': 'Villa-Nautica-Sunset-Beach-Pool-Villa.jpg',
                'Sunset Deluxe Beach Pool Villa': 'Villa-Nautica-Sunset-Deluxe-Beach-Pool-Villa.jpg',
                'Ocean Beach Pool Villa': 'Villa-Nautica-Ocean-Beach-Pool-Villa.jpg',
                'Two Bedroom Beach Pool Villa with Two Pools': 'Villa-Nautica-Two-Bedroom-Beach-Pool-Villa-with-Two-Pools.jpg',
                'Water Villa': 'Villa-Nautica-Water-Villa.jpg',
                'Water Villa with Whirlpool': 'Villa-Nautica-Water-Villa-with-Whirlpool.jpg',
                'One Bedroom Ocean Suite with Pool': 'Villa-Nautica-One-Bedroom-Ocean-Suite-with-Pool.jpg',
                'Two Bedroom Ocean Suite': 'Villa-Nautica-Two-Bedroom-Ocean-Suite.jpg',
            },
        }

    def handle(self, *args, **options):
        base_url = 'https://threadtravels.com'
        
        # Get custom filename mappings
        filename_map = self.get_image_filename_map()
        
        # Map: Resort Name -> (Folder Name, Default Extension)
        resorts_data = {
            'Hard Rock Hotel Maldives': ('Hard Rock Maldives', '.jpg'),
            'OZEN Reserve Bolifushi': ('Ozen Reserve Bolifushi', '.webp'),
            'SAii Lagoon Maldives': ('Saii Lagoon Maldives', '.webp'),
            'Sun Siyam Iru Fushi': ('Sun Siyam Iru Fushi', '.jpg'),
            'Sun Siyam Iru Veli': ('Sun Siyam Iru Veli', '.jpg'),
            'Sun Siyam Olhuveli': ('Sun Siyam Olhuveli', '.jpg'),
            'Sun Siyam Vilu Reef': ('Sun Siyam Vilu Reef', '.jpg'),
            'Sun Siyam World': ('Sun Siyam World', '.jpg'),
            'Cinnamon Velifushi Maldives': ('Cinnamon Velifushi Maldives', '.jpg'),
            'Cinnamon Hakuraa Huraa Maldives': ('Cinnamon Hakuraa Huraa Maldives', '.jpg'),
            'Cinnamon Dhonveli Maldives': ('Cinnamon Dhonveli Maldives', '.jpg'),
            'Ellaidhoo Maldives by Cinnamon': ('Ellaidhoo Maldives by Cinnamon', '.jpg'),
            'Velassaru Maldives': ('Velassaru Maldives', '.webp'),
            'Kuramathi Maldives': ('Kuramathi Maldives', '.jpg'),
            'Kurumba Maldives': ('Kurumba Maldives', '.jpg'),
            'Dhigufaru Island Resort': ('Dhigufaru Island Resort', '.jpg'),
            'Villa Nautica Paradise Island': ('Villa Nautica Paradise Island', '.jpg'),
            'Holiday Inn Resort Kandooma Maldives': ('Holiday Inn Resort Kandooma Maldives', '.avif'),
        }
        
        # Special cases for specific room types with different extensions
        special_cases = {
            'SAii Lagoon Maldives': {
                '2-Bedroom Family Beach Room with Pool': '.jpg',
            },
            'Kurumba Maldives': {
                'Deluxe Pool Villa': '.png',
                'Garden Pool Villa': '.png',
                'Two Bedroom Kurumba Residence': '.png',
            },
            'Holiday Inn Resort Kandooma Maldives': {
                'Two and Three Bedroom Villa': '.jpg',
            },
        }
        
        total = 0
        
        for resort_name, (folder_name, default_ext) in resorts_data.items():
            try:
                resort = Resort.objects.get(name=resort_name)
                room_types = resort.room_types.all()
                
                for room_type in room_types:
                    # Check if there's a resort-specific custom filename mapping
                    if resort_name in filename_map and room_type.name in filename_map[resort_name]:
                        image_filename = filename_map[resort_name][room_type.name]
                    else:
                        # Check for special case extension
                        ext = default_ext
                        if resort_name in special_cases and room_type.name in special_cases[resort_name]:
                            ext = special_cases[resort_name][room_type.name]
                        
                        # Build standard image filename
                        image_filename = room_type.name.replace(' ', '%20') + ext
                    
                    # Build full image URL
                    image_url = f'{base_url}/images/Resort%20Accomodation%20types%20images/{folder_name.replace(" ", "%20")}/{image_filename}'
                    
                    if not room_type.amenities:
                        room_type.amenities = []
                    
                    # Remove old image URL
                    room_type.amenities = [a for a in room_type.amenities if not a.startswith('__IMAGE_URL__:')]
                    
                    # Add new image URL
                    room_type.amenities.append(f'__IMAGE_URL__:{image_url}')
                    room_type.save()
                    total += 1
                
                self.stdout.write(self.style.SUCCESS(f'✓ {resort_name}: {room_types.count()} room types'))
            except Resort.DoesNotExist:
                self.stdout.write(self.style.ERROR(f'✗ {resort_name} not found'))
        
        self.stdout.write(self.style.SUCCESS(f'\n✅ Done! Updated {total} room types across 18 resorts'))

