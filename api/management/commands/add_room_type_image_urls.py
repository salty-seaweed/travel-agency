"""
Add room type image URLs to a new field.
Since we can't easily change ImageField to URLField, we'll add URLs to amenities with a special prefix.

Run with: python manage.py add_room_type_image_urls
"""
from django.core.management.base import BaseCommand
from api.models import Resort


class Command(BaseCommand):
    help = 'Add room type image URLs to amenities'

    def handle(self, *args, **options):
        base_url = 'https://threadtravels.com'
        
        resorts_data = {
            'Hard Rock Hotel Maldives': 'Hard Rock Maldives',
            'OZEN Reserve Bolifushi': 'Ozen Reserve Bolifushi',
            'SAii Lagoon Maldives': 'Saii Lagoon Maldives',
            'Sun Siyam Iru Fushi': 'Sun Siyam Iru Fushi',
            'Sun Siyam Iru Veli': 'Sun Siyam Iru Veli',
            'Sun Siyam Olhuveli': 'Sun Siyam Olhuveli',
            'Sun Siyam Vilu Reef': 'Sun Siyam Vilu Reef',
            'Sun Siyam World': 'Sun Siyam World',
        }
        
        total = 0
        
        for resort_name, folder_name in resorts_data.items():
            try:
                resort = Resort.objects.get(name=resort_name)
                room_types = resort.room_types.all()
                
                for room_type in room_types:
                    # Determine extension
                    if 'Ozen' in folder_name:
                        ext = '.webp' if room_type.name != 'Earth Pool Pavilion 2BR' else '.webp'
                    elif 'Saii' in folder_name:
                        if '2-Bedroom Family Beach Room with Pool' in room_type.name:
                            ext = '.jpg'
                        else:
                            ext = '.webp'
                    else:
                        ext = '.jpg'
                    
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
        
        self.stdout.write(self.style.SUCCESS(f'\n✅ Done! Updated {total} room types'))

