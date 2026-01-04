"""
Django management command to populate GalleryMedia from files in frontend/public/images/Gallery Media
Run with: python manage.py populate_gallery_media
"""
from django.core.management.base import BaseCommand
from django.core.files import File
from django.conf import settings
from pathlib import Path
import os
from api.models import GalleryMedia


class Command(BaseCommand):
    help = 'Populate GalleryMedia from files in Gallery Media folder'

    def add_arguments(self, parser):
        parser.add_argument(
            '--clear',
            action='store_true',
            help='Clear existing gallery media before populating',
        )
        parser.add_argument(
            '--folder',
            type=str,
            help='Path to Gallery Media folder (if not provided, will search common locations)',
        )

    def get_media_type(self, filename):
        """Determine media type from file extension"""
        ext = os.path.splitext(filename)[1].lower()
        if ext in ['.jpg', '.jpeg', '.png', '.webp']:
            return 'image'
        elif ext in ['.mp4', '.mov', '.avi', '.webm']:
            return 'video'
        elif ext == '.gif':
            return 'gif'
        return 'image'  # Default

    def find_gallery_folder(self, custom_path=None):
        """Find the Gallery Media folder in common locations"""
        if custom_path:
            path = Path(custom_path)
            if path.exists() and path.is_dir():
                return path
        
        # Use settings.BASE_DIR for project root
        from django.conf import settings
        base_dir = Path(settings.BASE_DIR)
        possible_paths = [
            Path('/app/gallery_source'),  # Docker build copies files here for production
            base_dir / 'frontend' / 'public' / 'images' / 'Gallery Media',
            base_dir / 'frontend' / 'public' / 'Gallery Media',
            base_dir / 'Gallery Media',
            Path('/app/frontend/public/images/Gallery Media'),  # Railway/Docker path
            Path('/app/Gallery Media'),  # Alternative Railway path
        ]
        
        for path in possible_paths:
            if path.exists() and path.is_dir():
                return path
        
        return None

    def clear_existing_gallery(self):
        """Delete all existing gallery media"""
        self.stdout.write("\n[CLEARING] Removing existing gallery media...")
        count = GalleryMedia.objects.count()
        GalleryMedia.objects.all().delete()
        self.stdout.write(self.style.SUCCESS(f"  [OK] Deleted {count} existing gallery items"))
        return count

    def handle(self, *args, **options):
        self.stdout.write(self.style.SUCCESS('=' * 60))
        self.stdout.write(self.style.SUCCESS('Populating Gallery Media from Folder'))
        self.stdout.write(self.style.SUCCESS('=' * 60))
        
        # Print settings info
        self.stdout.write(f"\n[CONFIG] Django Settings:")
        self.stdout.write(f"  DJANGO_SETTINGS_MODULE: {os.environ.get('DJANGO_SETTINGS_MODULE', 'Not set')}")
        self.stdout.write(f"  MEDIA_ROOT: {settings.MEDIA_ROOT}")
        self.stdout.write(f"  MEDIA_URL: {settings.MEDIA_URL}")
        self.stdout.write(f"  BASE_DIR: {settings.BASE_DIR}")
        
        # Ensure media directories exist
        gallery_images_dir = os.path.join(settings.MEDIA_ROOT, 'gallery', 'images')
        gallery_videos_dir = os.path.join(settings.MEDIA_ROOT, 'gallery', 'videos')
        try:
            os.makedirs(gallery_images_dir, exist_ok=True)
            os.makedirs(gallery_videos_dir, exist_ok=True)
            self.stdout.write(f"  [INFO] Created/verified media directories:")
            self.stdout.write(f"    - {gallery_images_dir}")
            self.stdout.write(f"    - {gallery_videos_dir}")
        except Exception as e:
            self.stdout.write(self.style.WARNING(f"  [WARNING] Could not create media directories: {e}"))
        
        if hasattr(settings, 'DEFAULT_FILE_STORAGE'):
            self.stdout.write(f"  DEFAULT_FILE_STORAGE: {settings.DEFAULT_FILE_STORAGE}")
            if 's3' in str(settings.DEFAULT_FILE_STORAGE).lower():
                self.stdout.write(f"  [INFO] Using AWS S3 for media storage")
                if hasattr(settings, 'AWS_STORAGE_BUCKET_NAME'):
                    self.stdout.write(f"  AWS_STORAGE_BUCKET_NAME: {settings.AWS_STORAGE_BUCKET_NAME}")
            elif 'cloudinary' in str(settings.DEFAULT_FILE_STORAGE).lower():
                self.stdout.write(f"  [INFO] Using Cloudinary for media storage")
        else:
            self.stdout.write(f"  [INFO] Using local file storage")
        
        # Check if GalleryMedia table exists
        try:
            GalleryMedia.objects.first()
        except Exception as e:
            self.stdout.write(self.style.ERROR(f"\n[ERROR] GalleryMedia model not found. Please run migrations first:"))
            self.stdout.write("   python manage.py makemigrations")
            self.stdout.write("   python manage.py migrate")
            return
        
        # Clear existing gallery if requested
        deleted_count = 0
        if options['clear']:
            deleted_count = self.clear_existing_gallery()
        
        # Find gallery folder
        custom_folder = options.get('folder')
        gallery_folder = self.find_gallery_folder(custom_folder)
        
        if not gallery_folder:
            self.stdout.write(self.style.ERROR(f"\n  [ERROR] Gallery Media folder not found in common locations"))
            self.stdout.write(self.style.ERROR(f"\n  [NOTE] In production, you may need to:"))
            self.stdout.write(self.style.ERROR(f"    1. Ensure files are copied to /app/gallery_source during Docker build"))
            self.stdout.write(self.style.ERROR(f"    2. Or provide --folder path to specify location"))
            return
        
        self.stdout.write(f"\n[POPULATING] Adding files from Gallery Media folder...")
        self.stdout.write(f"  [INFO] Found gallery folder at: {gallery_folder}")
        
        # Get all files
        files = list(gallery_folder.iterdir())
        files = [f for f in files if f.is_file()]
        
        if not files:
            self.stdout.write(self.style.WARNING(f"  [ERROR] No files found in {gallery_folder}"))
            return
        
        self.stdout.write(f"  [INFO] Found {len(files)} files in folder")
        
        count = 0
        image_count = 0
        video_count = 0
        
        for idx, file_path in enumerate(sorted(files)):
            try:
                filename = file_path.name
                
                # Verify file exists and is readable
                if not file_path.exists():
                    self.stdout.write(self.style.WARNING(f"  [ERROR] File does not exist: {filename}"))
                    continue
                
                if not file_path.is_file():
                    self.stdout.write(self.style.WARNING(f"  [ERROR] Not a file: {filename}"))
                    continue
                
                # Check file size
                file_size = file_path.stat().st_size
                if file_size == 0:
                    self.stdout.write(self.style.WARNING(f"  [WARNING] Empty file, skipping: {filename}"))
                    continue
                
                media_type = self.get_media_type(filename)
                
                # Create a clean title from filename
                title = os.path.splitext(filename)[0]
                title = title.replace('IMG-', '').replace('VID-', '').replace('WA', '').replace('_', ' ').replace('-', ' ')
                title = title.strip()
                
                # Check if file already exists in database (skip duplicates by filename)
                existing = GalleryMedia.objects.filter(alt_text=filename).first()
                
                if existing:
                    self.stdout.write(f"  [SKIP] Already exists: {filename} (ID: {existing.id})")
                    continue
                
                # Use the EXACT same pattern as resort scripts: File(f) directly from open file
                if media_type == 'video':
                    # For videos, use temporary video_url to pass validation, then replace with file
                    gallery_media = GalleryMedia(
                        media_type='video',
                        video_url='https://temp.com/video.mp4',  # Temporary to pass validation
                        title=title or f"Video {idx + 1}",
                        caption=f"Video from gallery collection",
                        alt_text=filename,
                        display_order=idx * 10,
                        is_featured=False,
                        is_active=True,
                        tags="gallery,video"
                    )
                    # Save object first (passes validation because video_url is set)
                    gallery_media.save()
                    # Now save the actual file using field.save() with File(f) - EXACT pattern from resort scripts
                    with open(file_path, 'rb') as f:
                        gallery_media.video.save(
                            filename,
                            File(f),  # Use File(f) directly, not ContentFile
                            save=True
                        )
                    # Clear temporary video_url
                    gallery_media.video_url = ''
                    gallery_media.save(update_fields=['video_url'])
                    video_count += 1
                else:
                    # For images, use the EXACT same pattern as resort scripts:
                    # Create object first with skip_validation, then use field.save() with File(f)
                    gallery_media = GalleryMedia(
                        media_type='image' if media_type != 'gif' else 'gif',
                        title=title or f"Image {idx + 1}",
                        caption=f"Image from gallery collection",
                        alt_text=filename,
                        display_order=idx * 10,
                        is_featured=False,
                        is_active=True,
                        tags="gallery,image"
                    )
                    # Save object first WITHOUT image, skipping validation
                    gallery_media.save(skip_validation=True)
                    
                    # Now add the file using field.save() - EXACT pattern from resort scripts
                    with open(file_path, 'rb') as f:
                        gallery_media.image.save(
                            filename,
                            File(f),  # Use File(f) directly - EXACT pattern from resort scripts
                            save=True
                        )
                    image_count += 1
                
                # Verify file was saved
                gallery_media.refresh_from_db()  # Refresh to get updated file paths
                if media_type == 'video' and gallery_media.video:
                    file_url = gallery_media.video.url
                    self.stdout.write(self.style.SUCCESS(f"  [OK] Added video: {filename}"))
                    self.stdout.write(f"       URL: {file_url}")
                    # Check if using cloud storage
                    if hasattr(settings, 'DEFAULT_FILE_STORAGE') and 's3' in str(settings.DEFAULT_FILE_STORAGE).lower():
                        self.stdout.write(f"       [INFO] Using cloud storage (S3)")
                    elif hasattr(settings, 'DEFAULT_FILE_STORAGE') and 'cloudinary' in str(settings.DEFAULT_FILE_STORAGE).lower():
                        self.stdout.write(f"       [INFO] Using cloud storage (Cloudinary)")
                    else:
                        # Local storage - check if file exists
                        try:
                            file_path_check = gallery_media.video.path
                            exists = os.path.exists(file_path_check)
                            self.stdout.write(f"       File exists: {exists} at {file_path_check}")
                        except Exception as e:
                            self.stdout.write(f"       [INFO] Could not verify local file (may be cloud storage): {e}")
                elif gallery_media.image:
                    file_url = gallery_media.image.url
                    self.stdout.write(self.style.SUCCESS(f"  [OK] Added image: {filename}"))
                    self.stdout.write(f"       URL: {file_url}")
                    # Check if using cloud storage
                    if hasattr(settings, 'DEFAULT_FILE_STORAGE') and 's3' in str(settings.DEFAULT_FILE_STORAGE).lower():
                        self.stdout.write(f"       [INFO] Using cloud storage (S3)")
                    elif hasattr(settings, 'DEFAULT_FILE_STORAGE') and 'cloudinary' in str(settings.DEFAULT_FILE_STORAGE).lower():
                        self.stdout.write(f"       [INFO] Using cloud storage (Cloudinary)")
                    else:
                        # Local storage - check if file exists
                        try:
                            file_path_check = gallery_media.image.path
                            exists = os.path.exists(file_path_check)
                            self.stdout.write(f"       File exists: {exists} at {file_path_check}")
                        except Exception as e:
                            self.stdout.write(f"       [INFO] Could not verify local file (may be cloud storage): {e}")
                else:
                    self.stdout.write(self.style.WARNING(f"  [WARNING] File not saved for: {filename}"))
                
                count += 1
                    
            except Exception as e:
                self.stdout.write(self.style.ERROR(f"  [ERROR] Error adding {file_path.name}: {e}"))
                import traceback
                self.stdout.write(traceback.format_exc())
        
        self.stdout.write(f"\n  [STATS] Added {count} items total:")
        self.stdout.write(f"    - Images: {image_count}")
        self.stdout.write(f"    - Videos: {video_count}")
        
        # Verify saved files
        self.stdout.write("\n" + "=" * 60)
        self.stdout.write("[VERIFICATION] Checking saved files...")
        all_media = GalleryMedia.objects.filter(is_active=True)
        for media in all_media[:5]:  # Check first 5
            if media.media_type in ['image', 'gif'] and media.image:
                file_path = media.image.path if hasattr(media.image, 'path') else None
                if file_path:
                    exists = os.path.exists(file_path)
                    self.stdout.write(f"  {media.title}: File exists={exists}, URL={media.image.url}")
            elif media.media_type == 'video' and media.video:
                file_path = media.video.path if hasattr(media.video, 'path') else None
                if file_path:
                    exists = os.path.exists(file_path)
                    self.stdout.write(f"  {media.title}: File exists={exists}, URL={media.video.url}")
        
        self.stdout.write("\n" + "=" * 60)
        self.stdout.write(self.style.SUCCESS(f"[SUCCESS] Gallery update complete!"))
        if deleted_count > 0:
            self.stdout.write(f"[STATS] Deleted: {deleted_count} items")
        self.stdout.write(f"[STATS] Added: {count} items")
        self.stdout.write(f"[STATS] Total gallery items: {GalleryMedia.objects.filter(is_active=True).count()}")
        self.stdout.write("=" * 60)
        self.stdout.write("\n[TIP] You can now view the gallery at /gallery")
        self.stdout.write("[TIP] Manage gallery items in Django admin at /dashboard")
        self.stdout.write(f"\n[NOTE] If files show as unavailable, check:")
        self.stdout.write(f"  1. MEDIA_ROOT is writable: {settings.MEDIA_ROOT}")
        self.stdout.write(f"  2. MEDIA_URL is configured: {settings.MEDIA_URL}")
        self.stdout.write(f"  3. Media files are being served correctly")
        self.stdout.write(f"  4. If using cloud storage, ensure credentials are set")

