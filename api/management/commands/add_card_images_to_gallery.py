"""
Add Card Image and Hero Banner URLs to gallery_images for resorts.
This makes hero images work in production by referencing frontend URLs.

Run with: python manage.py add_card_images_to_gallery
"""
from django.core.management.base import BaseCommand
from api.models import Resort


class Command(BaseCommand):
    help = 'Add Card Image and Hero Banner URLs to gallery_images'

    def handle(self, *args, **options):
        # Use relative path (no domain) so it works in both dev and production
        base_url = ''
        
        # Map: Resort Name -> (Folder Name, Card Extension, Hero Banner 1 Extension, Hero Banner 2 Extension)
        resorts_data = {
            'Hard Rock Hotel Maldives': ('Hard Rock Maldives', '.jpg', '.jpeg', '.jpeg'),
            'OZEN Reserve Bolifushi': ('Ozen Reserve Bolifushi', '.png', '.png', '.png'),
            'SAii Lagoon Maldives': ('Saii Lagoon Maldives', '.webp', '.jpg', '.jpg'),
            'Sun Siyam Iru Fushi': ('Sun Siyam Iru Fushi', '.jpg', '.jpg', '.jpg'),
            'Sun Siyam Iru Veli': ('Sun Siyam Iru Veli', '.jpg', '.jpg', '.jpg'),
            'Sun Siyam Olhuveli': ('Sun Siyam Olhuveli', '.jpg', '.jpg', '.jpg'),
            'Sun Siyam Vilu Reef': ('Sun Siyam Vilu Reef', '.jpg', '.jpg', '.jpg'),
            'Sun Siyam World': ('Sun Siyam World', '.jpg', '.jpg', '.jpg'),
            'Cinnamon Velifushi Maldives': ('Cinnamon Velifushi Maldives', '.jpg', '.jpg', '.jpg'),
            'Cinnamon Hakuraa Huraa Maldives': ('Cinnamon Hakuraa Huraa Maldives', '.jpg', '.jpg', '.jpg'),
            'Cinnamon Dhonveli Maldives': ('Cinnamon Dhonveli Maldives', '.jpg', '.jpg', '.jpg'),
            'Ellaidhoo Maldives by Cinnamon': ('Ellaidhoo Maldives by Cinnamon', '.jpg', '.jpg', '.jpg'),
            'Velassaru Maldives': ('Velassaru Maldives', '.webp', '.webp', '.webp'),
            'Kuramathi Maldives': ('Kuramathi Maldives', '.webp', '.jpg', '.jpg'),
            'Kurumba Maldives': ('Kurumba Maldives', '.jpg', '.jpg', '.jpg'),
            'Dhigufaru Island Resort': ('Dhigufaru Island Resort', '.jpg', '.jpg', '.jpg'),
            'Villa Nautica Paradise Island': ('Villa Nautica Paradise Island', '.jpg', '.jpg', '.jpg'),
            'Holiday Inn Resort Kandooma Maldives': ('Holiday Inn Resort Kandooma Maldives', '.avif', '.webp', '.avif'),
        }
        
        updated_count = 0
        for resort_name, (folder_name, card_ext, hero1_ext, hero2_ext) in resorts_data.items():
            try:
                resort = Resort.objects.get(name=resort_name)
                
                # Build URLs
                folder_encoded = folder_name.replace(" ", "%20")
                card_image_url = f'{base_url}/images/Resort%20Accomodation%20types%20images/{folder_encoded}/Card%20Image{card_ext}'
                
                # Try different hero banner naming patterns
                hero_banner_patterns = [
                    ('Resort%20Hero%20Banner%20Image%201', hero1_ext),
                    ('Resort%20Hero%20Banner%201', hero1_ext),
                    ('Resort%20Hero%20banner%20image%201', hero1_ext),
                ]
                hero_banner_2_patterns = [
                    ('Resort%20Hero%20Banner%20Image%202', hero2_ext),
                    ('Resort%20Hero%20Banner%202', hero2_ext),
                    ('Resort%20Hero%20banner%20image%202', hero2_ext),
                    ('Reosrt%20Hero%20Banner%202', hero2_ext),  # Typo in Sun Siyam Iru Veli
                ]
                
                hero1_url = f'{base_url}/images/Resort%20Accomodation%20types%20images/{folder_encoded}/{hero_banner_patterns[0][0]}{hero1_ext}'
                hero2_url = f'{base_url}/images/Resort%20Accomodation%20types%20images/{folder_encoded}/{hero_banner_2_patterns[0][0]}{hero2_ext}'
                
                # Special case for Cinnamon Velifushi (lowercase "banner")
                if resort_name == 'Cinnamon Velifushi Maldives':
                    hero1_url = f'{base_url}/images/Resort%20Accomodation%20types%20images/{folder_encoded}/Resort%20Hero%20banner%20image%201{hero1_ext}'
                    hero2_url = f'{base_url}/images/Resort%20Accomodation%20types%20images/{folder_encoded}/Resort%20Hero%20banner%20image%202{hero2_ext}'
                
                # Special case for Sun Siyam Iru Veli (typo in banner 2)
                if resort_name == 'Sun Siyam Iru Veli':
                    hero2_url = f'{base_url}/images/Resort%20Accomodation%20types%20images/{folder_encoded}/Reosrt%20Hero%20Banner%202{hero2_ext}'
                
                # Special cases for old resorts (different naming)
                if resort_name in ['Hard Rock Hotel Maldives', 'OZEN Reserve Bolifushi', 'SAii Lagoon Maldives']:
                    hero1_url = f'{base_url}/images/Resort%20Accomodation%20types%20images/{folder_encoded}/Resort%20Hero%20Banner%201{hero1_ext}'
                    hero2_url = f'{base_url}/images/Resort%20Accomodation%20types%20images/{folder_encoded}/Resort%20Hero%20Banner%202{hero2_ext}'
                
                if not resort.gallery_images:
                    resort.gallery_images = []
                
                # Remove existing Card and Hero Banner images
                resort.gallery_images = [
                    img for img in resort.gallery_images 
                    if not any(x in img for x in ['Card', 'Hero', 'Banner', 'banner'])
                ]
                
                # Add images: Card Image, Hero Banner 1, Hero Banner 2
                new_gallery = [card_image_url, hero1_url, hero2_url]
                resort.gallery_images = new_gallery + resort.gallery_images
                resort.save()
                
                updated_count += 1
                self.stdout.write(self.style.SUCCESS(f'✓ {resort_name} (3 images added)'))
            except Resort.DoesNotExist:
                self.stdout.write(self.style.ERROR(f'✗ {resort_name} not found'))
        
        self.stdout.write(self.style.SUCCESS(f'\n✅ Done! Updated {updated_count} resorts with card + hero banner images'))

