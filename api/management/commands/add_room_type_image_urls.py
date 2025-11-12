"""
Add room type image URLs to amenities field.
Since we can't easily change ImageField to URLField, we'll add URLs to amenities with a special prefix.

Run with: python manage.py add_room_type_image_urls
"""
from django.core.management.base import BaseCommand
from api.models import Resort


class Command(BaseCommand):
    help = 'Add room type image URLs to amenities for all 18 resorts'

    def handle(self, *args, **options):
        base_url = 'https://threadtravels.com'
        
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
            'Kuramathi Maldives': {
                # Most are .jpg, but some specific ones might differ
            },
        }
        
        total = 0
        
        for resort_name, (folder_name, default_ext) in resorts_data.items():
            try:
                resort = Resort.objects.get(name=resort_name)
                room_types = resort.room_types.all()
                
                for room_type in room_types:
                    # Check for special case extension
                    ext = default_ext
                    if resort_name in special_cases and room_type.name in special_cases[resort_name]:
                        ext = special_cases[resort_name][room_type.name]
                    
                    # Build image URL
                    image_name = room_type.name.replace(' ', '_')
                    image_url = f'{base_url}/images/Resort%20Accomodation%20types%20images/{folder_name.replace(" ", "%20")}/{image_name.replace("_", "%20")}{ext}'
                    
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

