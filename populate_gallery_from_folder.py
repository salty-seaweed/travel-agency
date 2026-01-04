#!/usr/bin/env python
"""
Script to populate GalleryMedia from files in frontend/public/images/Gallery Media
This will add new files from the specified folder to the gallery.
Run with: python populate_gallery_from_folder.py
"""

import os
import sys
import django
from pathlib import Path

# Setup Django
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'travel_agency.settings_minimal')
django.setup()

from api.models import GalleryMedia
from django.core.files import File
from django.core.files.base import ContentFile
from django.conf import settings
from django.db import connection

def clear_existing_gallery():
    """Delete all existing gallery media"""
    print("\n[CLEARING] Removing existing gallery media...")
    count = GalleryMedia.objects.count()
    GalleryMedia.objects.all().delete()
    print(f"  [OK] Deleted {count} existing gallery items")
    return count

def get_media_type(filename):
    """Determine media type from file extension"""
    ext = os.path.splitext(filename)[1].lower()
    if ext in ['.jpg', '.jpeg', '.png', '.webp', '.gif']:
        return 'image'
    elif ext in ['.mp4', '.mov', '.avi', '.webm']:
        return 'video'
    elif ext == '.gif':
        return 'gif'
    return 'image'  # Default

def populate_from_folder():
    """Populate gallery from files in frontend/public/images/Gallery Media"""
    print("\n[POPULATING] Adding files from Gallery Media folder...")
    
    # Get the folder path - try multiple possible locations
    base_dir = Path(__file__).parent
    possible_paths = [
        base_dir / 'frontend' / 'public' / 'images' / 'Gallery Media',
        base_dir / 'frontend' / 'public' / 'Gallery Media',
        base_dir / 'Gallery Media',
        Path('/app/frontend/public/images/Gallery Media'),  # Railway/Docker path
        Path('/app/Gallery Media'),  # Alternative Railway path
    ]
    
    gallery_folder = None
    for path in possible_paths:
        if path.exists() and path.is_dir():
            gallery_folder = path
            print(f"  [INFO] Found gallery folder at: {gallery_folder}")
            break
    
    if not gallery_folder:
        print(f"  [ERROR] Gallery Media folder not found in any of these locations:")
        for path in possible_paths:
            print(f"    - {path}")
        print(f"\n  [NOTE] In production, you may need to:")
        print(f"    1. Upload files to the server first")
        print(f"    2. Or use a script that downloads from URLs (like resort scripts)")
        return 0
    
    # Get all files
    files = list(gallery_folder.iterdir())
    files = [f for f in files if f.is_file()]
    
    if not files:
        print(f"  [ERROR] No files found in {gallery_folder}")
        return 0
    
    print(f"  [INFO] Found {len(files)} files in folder")
    
    count = 0
    image_count = 0
    video_count = 0
    
    for idx, file_path in enumerate(sorted(files)):
        try:
            filename = file_path.name
            
            # Verify file exists and is readable
            if not file_path.exists():
                print(f"  [ERROR] File does not exist: {filename}")
                continue
            
            if not file_path.is_file():
                print(f"  [ERROR] Not a file: {filename}")
                continue
            
            # Check file size
            file_size = file_path.stat().st_size
            if file_size == 0:
                print(f"  [WARNING] Empty file, skipping: {filename}")
                continue
            
            media_type = get_media_type(filename)
            
            # Create a clean title from filename
            title = os.path.splitext(filename)[0]
            title = title.replace('IMG-', '').replace('VID-', '').replace('WA', '').replace('_', ' ').replace('-', ' ')
            title = title.strip()
            
            # Check if file already exists in database (skip duplicates by filename)
            existing = GalleryMedia.objects.filter(
                alt_text=filename
            ).first()
            
            if existing:
                print(f"  [SKIP] Already exists: {filename} (ID: {existing.id})")
                continue
            
            # Use the EXACT same pattern as resort scripts: File(f) directly from open file
            # This is the key difference - resort scripts use File(f), not ContentFile
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
                print(f"  [OK] Added video: {filename}")
                print(f"       URL: {file_url}")
                # Check if using cloud storage
                if hasattr(settings, 'DEFAULT_FILE_STORAGE') and 's3' in str(settings.DEFAULT_FILE_STORAGE).lower():
                    print(f"       [INFO] Using cloud storage (S3)")
                elif hasattr(settings, 'DEFAULT_FILE_STORAGE') and 'cloudinary' in str(settings.DEFAULT_FILE_STORAGE).lower():
                    print(f"       [INFO] Using cloud storage (Cloudinary)")
                else:
                    # Local storage - check if file exists
                    try:
                        file_path_check = gallery_media.video.path
                        exists = os.path.exists(file_path_check)
                        print(f"       File exists: {exists} at {file_path_check}")
                    except Exception as e:
                        print(f"       [INFO] Could not verify local file (may be cloud storage): {e}")
            elif gallery_media.image:
                file_url = gallery_media.image.url
                print(f"  [OK] Added image: {filename}")
                print(f"       URL: {file_url}")
                # Check if using cloud storage
                if hasattr(settings, 'DEFAULT_FILE_STORAGE') and 's3' in str(settings.DEFAULT_FILE_STORAGE).lower():
                    print(f"       [INFO] Using cloud storage (S3)")
                elif hasattr(settings, 'DEFAULT_FILE_STORAGE') and 'cloudinary' in str(settings.DEFAULT_FILE_STORAGE).lower():
                    print(f"       [INFO] Using cloud storage (Cloudinary)")
                else:
                    # Local storage - check if file exists
                    try:
                        file_path_check = gallery_media.image.path
                        exists = os.path.exists(file_path_check)
                        print(f"       File exists: {exists} at {file_path_check}")
                    except Exception as e:
                        print(f"       [INFO] Could not verify local file (may be cloud storage): {e}")
            else:
                print(f"  [WARNING] File not saved for: {filename}")
            
            count += 1
                
        except Exception as e:
            print(f"  [ERROR] Error adding {file_path.name}: {e}")
            import traceback
            traceback.print_exc()
    
    print(f"\n  [STATS] Added {count} items total:")
    print(f"    - Images: {image_count}")
    print(f"    - Videos: {video_count}")
    
    return count

def main():
    print("=" * 60)
    print("Populating Gallery Media from Folder")
    print("=" * 60)
    
    # Print settings info
    print(f"\n[CONFIG] Django Settings:")
    print(f"  MEDIA_ROOT: {settings.MEDIA_ROOT}")
    print(f"  MEDIA_URL: {settings.MEDIA_URL}")
    print(f"  BASE_DIR: {Path(__file__).parent.parent}")
    if hasattr(settings, 'DEFAULT_FILE_STORAGE'):
        print(f"  DEFAULT_FILE_STORAGE: {settings.DEFAULT_FILE_STORAGE}")
        if 's3' in str(settings.DEFAULT_FILE_STORAGE).lower():
            print(f"  [INFO] Using AWS S3 for media storage")
            if hasattr(settings, 'AWS_STORAGE_BUCKET_NAME'):
                print(f"  AWS_STORAGE_BUCKET_NAME: {settings.AWS_STORAGE_BUCKET_NAME}")
        elif 'cloudinary' in str(settings.DEFAULT_FILE_STORAGE).lower():
            print(f"  [INFO] Using Cloudinary for media storage")
    else:
        print(f"  [INFO] Using local file storage")
    
    # Check if GalleryMedia table exists
    try:
        GalleryMedia.objects.first()
    except Exception as e:
        print(f"\n[ERROR] GalleryMedia model not found. Please run migrations first:")
        print("   python manage.py makemigrations")
        print("   python manage.py migrate")
        return
    
    # Clear existing gallery
    deleted_count = clear_existing_gallery()
    
    # Populate from folder
    added_count = populate_from_folder()
    
    # Verify saved files
    print("\n" + "=" * 60)
    print("[VERIFICATION] Checking saved files...")
    all_media = GalleryMedia.objects.filter(is_active=True)
    for media in all_media[:5]:  # Check first 5
        if media.media_type in ['image', 'gif'] and media.image:
            file_path = media.image.path if hasattr(media.image, 'path') else None
            if file_path:
                exists = os.path.exists(file_path)
                print(f"  {media.title}: File exists={exists}, URL={media.image.url}")
        elif media.media_type == 'video' and media.video:
            file_path = media.video.path if hasattr(media.video, 'path') else None
            if file_path:
                exists = os.path.exists(file_path)
                print(f"  {media.title}: File exists={exists}, URL={media.video.url}")
    
    print("\n" + "=" * 60)
    print(f"[SUCCESS] Gallery update complete!")
    print(f"[STATS] Deleted: {deleted_count} items")
    print(f"[STATS] Added: {added_count} items")
    print(f"[STATS] Total gallery items: {GalleryMedia.objects.filter(is_active=True).count()}")
    print("=" * 60)
    print("\n[TIP] You can now view the gallery at /gallery")
    print("[TIP] Manage gallery items in Django admin at /dashboard")
    print(f"\n[NOTE] If files show as unavailable, check:")
    print(f"  1. MEDIA_ROOT is writable: {settings.MEDIA_ROOT}")
    print(f"  2. MEDIA_URL is configured: {settings.MEDIA_URL}")
    print(f"  3. Media files are being served correctly")
    print(f"  4. If using cloud storage, ensure credentials are set")

if __name__ == '__main__':
    main()


