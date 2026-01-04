#!/usr/bin/env python
"""
Script to populate GalleryMedia from files in frontend/public/images/Gallery Media
This will clear existing gallery media and add new files from the specified folder.
Run with: python populate_gallery_from_folder.py
"""

import os
import sys
import django
from pathlib import Path

# Setup Django
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'travel_agency.settings')
django.setup()

from api.models import GalleryMedia
from django.core.files import File
from django.conf import settings

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
    
    # Get the folder path
    base_dir = Path(__file__).parent
    gallery_folder = base_dir / 'frontend' / 'public' / 'images' / 'Gallery Media'
    
    if not gallery_folder.exists():
        print(f"  [ERROR] Folder not found: {gallery_folder}")
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
            media_type = get_media_type(filename)
            
            # Create a clean title from filename
            title = os.path.splitext(filename)[0]
            title = title.replace('IMG-', '').replace('VID-', '').replace('WA', '').replace('_', ' ').replace('-', ' ')
            title = title.strip()
            
            # Open file and create GalleryMedia entry
            with open(file_path, 'rb') as f:
                django_file = File(f, name=filename)
                
                if media_type == 'video':
                    gallery_media = GalleryMedia.objects.create(
                        media_type='video',
                        video=django_file,
                        title=title or f"Video {idx + 1}",
                        caption=f"Video from gallery collection",
                        alt_text=title or filename,
                        display_order=idx * 10,
                        is_featured=False,
                        is_active=True,
                        tags="gallery,video"
                    )
                    video_count += 1
                    print(f"  [OK] Added video: {filename}")
                else:
                    gallery_media = GalleryMedia.objects.create(
                        media_type='image' if media_type != 'gif' else 'gif',
                        image=django_file,
                        title=title or f"Image {idx + 1}",
                        caption=f"Image from gallery collection",
                        alt_text=title or filename,
                        display_order=idx * 10,
                        is_featured=False,
                        is_active=True,
                        tags="gallery,image"
                    )
                    image_count += 1
                    print(f"  [OK] Added image: {filename}")
                
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
    
    print("\n" + "=" * 60)
    print(f"[SUCCESS] Gallery update complete!")
    print(f"[STATS] Deleted: {deleted_count} items")
    print(f"[STATS] Added: {added_count} items")
    print(f"[STATS] Total gallery items: {GalleryMedia.objects.filter(is_active=True).count()}")
    print("=" * 60)
    print("\n[TIP] You can now view the gallery at /gallery")
    print("[TIP] Manage gallery items in Django admin at /dashboard")

if __name__ == '__main__':
    main()


