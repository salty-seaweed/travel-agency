"""
Script to update boat packages with gallery images from the 'Boat related pics' folder.
This script assigns appropriate images to each of the 4 boat packages.

Usage:
    python update_boat_package_images.py
"""

import os
import sys
import django

# Setup Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'travel_agency.settings')
django.setup()

from api.models import BoatPackage

# Log file for output
LOG_FILE = os.path.join(os.path.dirname(__file__), 'update_images_log.txt')


def log(message):
    """Write message to both console and log file"""
    print(message, flush=True)
    with open(LOG_FILE, 'a', encoding='utf-8') as f:
        f.write(message + '\n')


def update_boat_package_images():
    """Update boat packages with gallery images from the 'Boat related pics' folder"""
    # Clear log file
    with open(LOG_FILE, 'w', encoding='utf-8') as f:
        f.write('')
    
    log("=" * 60)
    log("BOAT PACKAGE IMAGE UPDATE SCRIPT")
    log("=" * 60)
    log("")
    
    # All available images in the 'Boat related pics' folder
    # Images are named photo_6136538003267062987_y.jpg to photo_6136538003267063008_y.jpg (22 images)
    all_images = [
        f"photo_6136538003267062{num}_y.jpg" for num in range(987, 1000)
    ] + [
        f"photo_6136538003267063{str(num).zfill(3)}_y.jpg" for num in range(0, 9)
    ]
    
    # Base path for images (relative to public folder)
    # Note: URL encode the space as %20 for proper browser loading
    base_path = "/images/Boat%20related%20pics"
    
    # Full image paths
    full_image_paths = [f"{base_path}/{img}" for img in all_images]
    
    log(f"Found {len(full_image_paths)} images to distribute:")
    for i, img in enumerate(full_image_paths[:5]):
        log(f"  {i+1}. {img}")
    log(f"  ... and {len(full_image_paths) - 5} more")
    log("")
    
    # Distribution of images to packages:
    # We'll assign images based on visual appropriateness
    # Each package gets 5-6 images, with the first being used as hero image
    
    package_image_assignments = {
        # Silver Package - 38ft Premium: Action fishing shots
        'Silver Package - 38ft Premium': {
            'hero_image': full_image_paths[0],  # Main fishing action shot
            'gallery_images': [
                full_image_paths[0],   # Fishing action
                full_image_paths[1],   # Catch display
                full_image_paths[2],   # Ocean view
                full_image_paths[3],   # Boat in action
                full_image_paths[4],   # Equipment
                full_image_paths[5],   # Group fishing
            ]
        },
        # Gold Package - 38ft Premium: Premium experience shots
        'Gold Package - 38ft Premium': {
            'hero_image': full_image_paths[6],  # Premium experience shot
            'gallery_images': [
                full_image_paths[6],   # Premium experience
                full_image_paths[7],   # Luxury amenities
                full_image_paths[8],   # Food service
                full_image_paths[9],   # Big catch
                full_image_paths[10],  # Sunset fishing
                full_image_paths[11],  # Happy guests
            ]
        },
        # Silver Package - 26ft Center Console: Agile boat shots
        'Silver Package - 26ft Center Console': {
            'hero_image': full_image_paths[12],  # Center console action
            'gallery_images': [
                full_image_paths[12],  # Center console boat
                full_image_paths[13],  # Sport fishing
                full_image_paths[14],  # Island backdrop
                full_image_paths[15],  # Fresh catch
                full_image_paths[16],  # Clear waters
            ]
        },
        # Gold Package - 26ft Center Console: Premium center console experience
        'Gold Package - 26ft Center Console': {
            'hero_image': full_image_paths[17],  # Premium experience
            'gallery_images': [
                full_image_paths[17],  # Gold package experience
                full_image_paths[18],  # Multiple catches
                full_image_paths[19],  # Crew service
                full_image_paths[20],  # Maldives scenery
                full_image_paths[21],  # Best moments
            ]
        }
    }
    
    # Update each package
    packages_updated = 0
    for package_name, images in package_image_assignments.items():
        try:
            package = BoatPackage.objects.get(name=package_name)
            
            # Update hero image (stored as path string)
            package.hero_image = images['hero_image']
            
            # Update gallery images (JSONField - list of strings)
            package.gallery_images = images['gallery_images']
            
            package.save()
            
            packages_updated += 1
            log(f"✓ Updated: {package_name}")
            log(f"  - Hero image: {images['hero_image']}")
            log(f"  - Gallery images: {len(images['gallery_images'])} images")
            log("")
            
        except BoatPackage.DoesNotExist:
            log(f"✗ Package not found: {package_name}")
            log("")
        except Exception as e:
            log(f"✗ Error updating {package_name}: {str(e)}")
            log("")
    
    log("=" * 60)
    log(f"COMPLETED: {packages_updated}/4 packages updated")
    log("=" * 60)
    log("")
    log("Next steps:")
    log("  1. Restart your Django server")
    log("  2. Visit /boats?tab=packages to see updated package cards")
    log("  3. Click on a package to see the image gallery")
    log("")


if __name__ == '__main__':
    update_boat_package_images()
