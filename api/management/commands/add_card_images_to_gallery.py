"""
Add Card Image URLs to gallery_images for resorts.
This makes hero images work in production by referencing frontend URLs.

Run with: python manage.py add_card_images_to_gallery
"""
from django.core.management.base import BaseCommand
from api.models import Resort


class Command(BaseCommand):
    help = 'Add Card Image URLs to gallery_images'

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
        
        for resort_name, folder_name in resorts_data.items():
            try:
                resort = Resort.objects.get(name=resort_name)
                
                # Determine Card Image extension
                if 'Ozen' in folder_name:
                    ext = '.png'
                elif 'Saii' in folder_name:
                    ext = '.webp'
                else:
                    ext = '.jpg'
                
                card_image_url = f'{base_url}/images/Resort%20Accomodation%20types%20images/{folder_name.replace(" ", "%20")}/Card%20Image{ext}'
                
                if not resort.gallery_images:
                    resort.gallery_images = []
                
                # Remove existing Card Image
                resort.gallery_images = [img for img in resort.gallery_images if 'Card' not in img]
                
                # Add Card Image at the beginning
                resort.gallery_images.insert(0, card_image_url)
                resort.save()
                
                self.stdout.write(self.style.SUCCESS(f'✓ {resort_name}'))
            except Resort.DoesNotExist:
                self.stdout.write(self.style.ERROR(f'✗ {resort_name} not found'))
        
        self.stdout.write(self.style.SUCCESS('\n✅ Done! Card images added to gallery_images'))

