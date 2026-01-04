#!/usr/bin/env python
"""
Management script to populate GalleryMedia with existing images from packages, resorts, and boats.
Run with: python populate_gallery_media.py
"""

import os
import sys
import django

# Setup Django
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'travel_agency.settings')
django.setup()

from api.models import GalleryMedia, Package, PackageImage, Resort, ResortImage, Boat, BoatImage
from django.core.files import File
from django.core.files.base import ContentFile
import requests
from urllib.parse import urlparse

def get_image_from_url(url):
    """Download image from URL and return as ContentFile"""
    try:
        if url.startswith('http'):
            response = requests.get(url, timeout=10)
            response.raise_for_status()
            filename = os.path.basename(urlparse(url).path) or 'image.jpg'
            return ContentFile(response.content, name=filename)
        return None
    except Exception as e:
        print(f"  ⚠️  Could not download image from {url}: {e}")
        return None

def populate_from_packages():
    """Populate gallery from package images"""
    print("\n[PACKAGES] Populating from Packages...")
    packages = Package.objects.all().prefetch_related('images')
    count = 0
    
    for package in packages:
        package_images = package.images.filter(media_type='image').order_by('order', 'created_at')
        
        for idx, pkg_image in enumerate(package_images):
            # Check if already exists
            existing = GalleryMedia.objects.filter(
                package=package,
                media_type='image',
                title__icontains=package.name
            ).first()
            
            if existing:
                continue
            
            try:
                gallery_media = GalleryMedia.objects.create(
                    media_type='image',
                    image=pkg_image.image if pkg_image.image else None,
                    title=f"{package.name} - Image {idx + 1}",
                    caption=pkg_image.caption or f"Image from {package.name}",
                    alt_text=pkg_image.caption or package.name,
                    package=package,
                    display_order=count * 10 + idx,
                    is_featured=pkg_image.is_featured,
                    is_active=True,
                    tags=f"package,{package.category or 'travel'}"
                )
                count += 1
                print(f"  [OK] Added: {gallery_media.title}")
            except Exception as e:
                print(f"  [ERROR] Error adding {package.name} image: {e}")
    
    print(f"  [STATS] Added {count} images from packages")
    return count

def populate_from_resorts():
    """Populate gallery from resort images"""
    print("\n[RESORTS] Populating from Resorts...")
    resorts = Resort.objects.filter(is_active=True).prefetch_related('images') if hasattr(Resort, 'is_active') else Resort.objects.all().prefetch_related('images')
    count = 0
    
    for resort in resorts:
        resort_images = resort.images.filter(is_active=True).order_by('order', 'created_at')
        
        for idx, resort_image in enumerate(resort_images):
            # Check if already exists
            existing = GalleryMedia.objects.filter(
                resort=resort,
                media_type='image',
                title__icontains=resort.name
            ).first()
            
            if existing and idx == 0:
                continue
            
            try:
                gallery_media = GalleryMedia.objects.create(
                    media_type='image',
                    image=resort_image.image if resort_image.image else None,
                    title=f"{resort_image.get_image_type_display()} - {resort.name}",
                    caption=resort_image.caption or f"{resort_image.get_image_type_display()} of {resort.name}",
                    alt_text=resort_image.alt_text or resort.name,
                    resort=resort,
                    display_order=1000 + count * 10 + idx,
                    is_featured=resort_image.is_featured,
                    is_active=True,
                    location=resort.location.island if resort.location else "",
                    tags=f"resort,{resort_image.image_type}"
                )
                count += 1
                print(f"  [OK] Added: {gallery_media.title}")
            except Exception as e:
                print(f"  [ERROR] Error adding {resort.name} image: {e}")
    
    print(f"  [STATS] Added {count} images from resorts")
    return count

def populate_from_boats():
    """Populate gallery from boat images"""
    print("\n[BOATS] Populating from Boats...")
    boats = Boat.objects.filter(is_active=True).prefetch_related('images') if hasattr(Boat, 'is_active') else Boat.objects.all().prefetch_related('images')
    count = 0
    
    for boat in boats:
        boat_images = boat.images.filter(is_active=True).order_by('display_order', 'created_at')
        
        for idx, boat_image in enumerate(boat_images):
            # Check if already exists
            existing = GalleryMedia.objects.filter(
                boat=boat,
                media_type='image',
                title__icontains=boat.name
            ).first()
            
            if existing and idx == 0:
                continue
            
            try:
                gallery_media = GalleryMedia.objects.create(
                    media_type='image',
                    image=boat_image.image if boat_image.image else None,
                    title=f"{boat.name} - Image {idx + 1}",
                    caption=boat_image.caption or f"Image of {boat.name}",
                    alt_text=boat_image.alt_text or boat.name,
                    boat=boat,
                    display_order=2000 + count * 10 + idx,
                    is_featured=boat_image.is_featured,
                    is_active=True,
                    location=boat.location.island if boat.location else "",
                    tags=f"boat,{boat.boat_type or 'charter'}"
                )
                count += 1
                print(f"  [OK] Added: {gallery_media.title}")
            except Exception as e:
                print(f"  [ERROR] Error adding {boat.name} image: {e}")
    
    print(f"  [STATS] Added {count} images from boats")
    return count

def main():
    print("=" * 60)
    print("Populating Gallery Media from Existing Images")
    print("=" * 60)
    
    # Check if GalleryMedia table exists
    try:
        GalleryMedia.objects.first()
    except Exception as e:
        print(f"\n[ERROR] GalleryMedia model not found. Please run migrations first:")
        print("   python manage.py makemigrations")
        print("   python manage.py migrate")
        return
    
    total = 0
    
    # Populate from each source
    total += populate_from_packages()
    total += populate_from_resorts()
    total += populate_from_boats()
    
    print("\n" + "=" * 60)
    print(f"[SUCCESS] Gallery population complete!")
    print(f"[STATS] Total images added: {total}")
    print(f"[STATS] Total gallery items: {GalleryMedia.objects.filter(is_active=True).count()}")
    print("=" * 60)
    print("\n[TIP] You can now view the gallery at /gallery")
    print("[TIP] Manage gallery items in Django admin at /dashboard")

if __name__ == '__main__':
    main()

