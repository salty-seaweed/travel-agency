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
        parser.add_argument(
            '--test-urls',
            action='store_true',
            help='Test mode: only print URLs without uploading',
        )
        parser.add_argument(
            '--verbose',
            action='store_true',
            help='Verbose mode: show all URL attempts',
        )

    def handle(self, *args, **options):
        self.stdout.write(self.style.SUCCESS('=' * 80))
        self.stdout.write(self.style.SUCCESS('Uploading Resort Images from URLs'))
        self.stdout.write(self.style.SUCCESS('=' * 80))
        
        base_url = options['base_url'].rstrip('/')
        skip_existing = options['skip_existing']
        self.test_mode = options['test_urls']
        self.verbose = options['verbose']
        
        if self.test_mode:
            self.stdout.write(self.style.WARNING('TEST MODE: Will only print URLs, not upload'))
        
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
                self.stdout.write(f'  Uploading hero image...')
                
                # Try different URL formats and extensions
                url_formats = [
                    # Without encoding (spaces as %20)
                    f'{base_url}/images/Resort%20Accomodation%20types%20images/{folder_name.replace(" ", "%20")}/Card%20Image',
                    # With full quote encoding
                    f'{base_url}/images/Resort Accomodation types images/{quote(folder_name)}/Card Image',
                    # Without any encoding (if server handles it)
                    f'{base_url}/images/Resort Accomodation types images/{folder_name}/Card Image',
                ]
                
                extensions = ['.jpg', '.png', '.webp', '.jpeg']
                success = False
                
                for url_format in url_formats:
                    for ext in extensions:
                        card_image_url = url_format + ext
                        success = self.upload_image_from_url(
                            card_image_url,
                            resort,
                            'hero_image',
                            f'Card_Image{ext}'
                        )
                        if success:
                            total_uploaded += 1
                            self.stdout.write(self.style.SUCCESS(f'  ✓ Uploaded hero image from: {card_image_url}'))
                            break
                    if success:
                        break
                
                if not success:
                    total_failed += 1
                    self.stdout.write(self.style.ERROR(f'  ✗ Failed to upload hero image for {resort.name}'))
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
                        # Try different URL encoding formats
                        url_formats = [
                            # Spaces as %20
                            f'{base_url}/images/Resort%20Accomodation%20types%20images/{folder_name.replace(" ", "%20")}/{pattern.replace(" ", "%20")}{ext}',
                            # Full quote encoding
                            f'{base_url}/images/Resort Accomodation types images/{quote(folder_name)}/{quote(pattern)}{ext}',
                            # No encoding
                            f'{base_url}/images/Resort Accomodation types images/{folder_name}/{pattern}{ext}',
                        ]
                        
                        for image_url in url_formats:
                            success = self.upload_image_from_url(
                                image_url,
                                room_type,
                                'image',
                                f'{pattern.replace(" ", "_")}{ext}'
                            )
                            if success:
                                total_uploaded += 1
                                self.stdout.write(self.style.SUCCESS(f'    ✓ {room_type.name}'))
                                uploaded = True
                                break
                        
                        if uploaded:
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
            if self.verbose:
                self.stdout.write(f'      Trying: {url}')
            
            # In test mode, just check if URL is accessible
            if self.test_mode:
                response = requests.head(url, timeout=10)
                if response.status_code == 200:
                    self.stdout.write(self.style.SUCCESS(f'      ✓ Found: {url}'))
                    return True
                return False
            
            # Try the URL as-is first
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
                # If failed, log the error for debugging
                if self.verbose and response.status_code != 404:
                    self.stdout.write(self.style.WARNING(f'      HTTP {response.status_code}: {url}'))
                return False
        except Exception as e:
            # Log exception for debugging
            if self.verbose:
                self.stdout.write(self.style.WARNING(f'      Error: {str(e)[:50]}'))
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

