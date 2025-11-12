"""
Django management command to upload resort images from URLs (for production).
This script downloads images from your deployed frontend and uploads them to Django media storage.

Prerequisites:
1. Frontend must be deployed with images in /images/Resort Accomodation types images/
2. Run AFTER create_resorts_with_images has created the resorts

Run with: python manage.py upload_resort_images_from_urls --base-url https://your-frontend-url.com
"""
from django.core.management.base import BaseCommand
from django.core.files.base import ContentFile
from django.db import transaction
from api.models import Resort, ResortRoomType
import requests
import os
from urllib.parse import quote


class Command(BaseCommand):
    help = 'Upload resort images from URLs to Django media storage'

    def add_arguments(self, parser):
        parser.add_argument(
            '--base-url',
            type=str,
            required=True,
            help='Base URL of your deployed frontend (e.g., https://your-site.com)',
        )
        parser.add_argument(
            '--skip-existing',
            action='store_true',
            help='Skip images that are already uploaded',
        )

    def handle(self, *args, **options):
        self.stdout.write(self.style.SUCCESS('=' * 80))
        self.stdout.write(self.style.SUCCESS('Uploading Resort Images from URLs'))
        self.stdout.write(self.style.SUCCESS('=' * 80))
        
        base_url = options['base_url'].rstrip('/')
        skip_existing = options['skip_existing']
        
        # Get all resorts that need images
        resorts = Resort.objects.filter(is_room_type=True)
        
        if not resorts.exists():
            self.stdout.write(
                self.style.ERROR('No resorts found. Run create_resorts_with_images first!')
            )
            return
        
        self.stdout.write(f'\nFound {resorts.count()} resorts to process')
        self.stdout.write(f'Base URL: {base_url}\n')
        
        total_uploaded = 0
        total_skipped = 0
        total_failed = 0
        
        for resort in resorts:
            self.stdout.write(f'\n{"="*60}')
            self.stdout.write(f'Processing: {resort.name}')
            self.stdout.write(f'{"="*60}')
            
            # Get folder name from resort data
            folder_name = self.get_folder_name(resort.name)
            
            # Upload hero image (Card Image)
            if not resort.hero_image or not skip_existing:
                card_image_url = f'{base_url}/images/Resort Accomodation types images/{quote(folder_name)}/Card Image.jpg'
                success = self.upload_image_from_url(
                    card_image_url,
                    resort,
                    'hero_image',
                    'Card_Image.jpg'
                )
                if success:
                    total_uploaded += 1
                    self.stdout.write(self.style.SUCCESS(f'  ✓ Uploaded hero image'))
                else:
                    # Try .png extension
                    card_image_url = f'{base_url}/images/Resort Accomodation types images/{quote(folder_name)}/Card Image.png'
                    success = self.upload_image_from_url(
                        card_image_url,
                        resort,
                        'hero_image',
                        'Card_Image.png'
                    )
                    if success:
                        total_uploaded += 1
                        self.stdout.write(self.style.SUCCESS(f'  ✓ Uploaded hero image'))
                    else:
                        # Try .webp extension
                        card_image_url = f'{base_url}/images/Resort Accomodation types images/{quote(folder_name)}/Card Image.webp'
                        success = self.upload_image_from_url(
                            card_image_url,
                            resort,
                            'hero_image',
                            'Card_Image.webp'
                        )
                        if success:
                            total_uploaded += 1
                            self.stdout.write(self.style.SUCCESS(f'  ✓ Uploaded hero image'))
                        else:
                            total_failed += 1
                            self.stdout.write(self.style.ERROR(f'  ✗ Failed to upload hero image'))
            else:
                total_skipped += 1
                self.stdout.write(self.style.WARNING(f'  ⊘ Skipped hero image (already exists)'))
            
            # Upload room type images
            room_types = resort.room_types.all()
            self.stdout.write(f'\n  Processing {room_types.count()} room types...')
            
            for room_type in room_types:
                if room_type.image and skip_existing:
                    total_skipped += 1
                    continue
                
                # Get image filename from room type name
                image_patterns = self.get_image_patterns(room_type.name)
                
                uploaded = False
                for pattern in image_patterns:
                    for ext in ['.jpg', '.jpeg', '.png', '.webp']:
                        image_url = f'{base_url}/images/Resort Accomodation types images/{quote(folder_name)}/{quote(pattern)}{ext}'
                        success = self.upload_image_from_url(
                            image_url,
                            room_type,
                            'image',
                            f'{pattern}{ext}'
                        )
                        if success:
                            total_uploaded += 1
                            self.stdout.write(self.style.SUCCESS(f'    ✓ {room_type.name}'))
                            uploaded = True
                            break
                    if uploaded:
                        break
                
                if not uploaded:
                    total_failed += 1
                    self.stdout.write(self.style.ERROR(f'    ✗ {room_type.name} - No image found'))
        
        # Summary
        self.stdout.write('')
        self.stdout.write(self.style.SUCCESS('=' * 80))
        self.stdout.write(self.style.SUCCESS('Summary:'))
        self.stdout.write(self.style.SUCCESS(f'  Uploaded: {total_uploaded}'))
        if skip_existing:
            self.stdout.write(self.style.WARNING(f'  Skipped: {total_skipped}'))
        self.stdout.write(self.style.ERROR(f'  Failed: {total_failed}'))
        self.stdout.write(self.style.SUCCESS('=' * 80))

    def upload_image_from_url(self, url, obj, field_name, filename):
        """Download image from URL and upload to Django model field"""
        try:
            response = requests.get(url, timeout=30)
            if response.status_code == 200:
                # Get the field
                field = getattr(obj, field_name)
                
                # Save the image
                field.save(
                    filename,
                    ContentFile(response.content),
                    save=True
                )
                return True
            else:
                return False
        except Exception as e:
            # Silently fail and try next pattern
            return False

    def get_folder_name(self, resort_name):
        """Get folder name for a resort"""
        folder_mapping = {
            'Hard Rock Hotel Maldives': 'Hard Rock Maldives',
            'OZEN Reserve Bolifushi': 'Ozen Reserve Bolifushi',
            'SAii Lagoon Maldives': 'Saii Lagoon Maldives',
            'Sun Siyam Iru Fushi': 'Sun Siyam Iru Fushi',
            'Sun Siyam Iru Veli': 'Sun Siyam Iru Veli',
            'Sun Siyam Olhuveli': 'Sun Siyam Olhuveli',
            'Sun Siyam Vilu Reef': 'Sun Siyam Vilu Reef',
            'Sun Siyam World': 'Sun Siyam World',
        }
        return folder_mapping.get(resort_name, resort_name)

    def get_image_patterns(self, room_type_name):
        """Get possible image filename patterns for a room type"""
        # Return the room type name with spaces replaced by underscores
        patterns = [
            room_type_name.replace(' ', '_'),
            room_type_name.replace(' ', ' '),  # Original with spaces
            room_type_name.replace(' ', '-'),  # With dashes
        ]
        return patterns

