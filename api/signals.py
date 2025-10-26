from django.db.models.signals import post_save, pre_save, post_delete
from django.dispatch import receiver
from django.core.files.base import ContentFile
from django.core.files.storage import default_storage
from PIL import Image
import io
import os
from .models import (
    PropertyImage, PackageImage, Destination, Experience,
    HomepageHero, HomepageFeature, HomepageTestimonial, HomepageImage,
    PageHero, AboutPageContent, FeaturedDestination, Location, Package, PackageDestination
)

def optimize_image_file(image_field, instance):
    """Optimize an image file and create variants"""
    if not image_field:
        return
    
    try:
        # Open image with PIL
        img = Image.open(image_field)
        
        # Convert to RGB if necessary
        if img.mode in ('RGBA', 'LA', 'P'):
            background = Image.new('RGB', img.size, (255, 255, 255))
            if img.mode == 'P':
                img = img.convert('RGBA')
            background.paste(img, mask=img.split()[-1] if img.mode == 'RGBA' else None)
            img = background
        elif img.mode != 'RGB':
            img = img.convert('RGB')
        
        # Get file path info
        file_path = image_field.name
        base_name = os.path.splitext(os.path.basename(file_path))[0]
        upload_dir = os.path.dirname(file_path)
        
        # Create optimized versions
        variants = [
            ('thumb', 150, 150),
            ('small', 400, 300),
            ('medium', 800, 600),
            ('large', 1200, 900),
            ('webp', 800, 600)  # WebP version
        ]
        
        for variant_name, width, height in variants:
            try:
                # Create variant
                variant_img = img.copy()
                variant_img.thumbnail((width, height), Image.Resampling.LANCZOS)
                
                # Determine format and quality
                if variant_name == 'webp':
                    format = 'WebP'
                    quality = 85
                    filename = f"{base_name}.webp"
                else:
                    format = 'JPEG'
                    quality = 85
                    filename = f"{base_name}_{variant_name}.jpg"
                
                # Save variant
                output = io.BytesIO()
                if format == 'WebP':
                    variant_img.save(output, format='WebP', quality=quality, method=6)
                else:
                    variant_img.save(output, format='JPEG', quality=quality, optimize=True)
                output.seek(0)
                
                # Save to storage
                variant_path = os.path.join(upload_dir, 'optimized', filename)
                default_storage.save(variant_path, ContentFile(output.getvalue()))
                
            except Exception as e:
                print(f"Error creating {variant_name} variant: {e}")
        
        # Also create a compressed original
        try:
            output = io.BytesIO()
            img.save(output, format='JPEG', quality=85, optimize=True)
            output.seek(0)
            
            compressed_path = os.path.join(upload_dir, 'optimized', f"{base_name}_compressed.jpg")
            default_storage.save(compressed_path, ContentFile(output.getvalue()))
            
        except Exception as e:
            print(f"Error creating compressed original: {e}")
            
    except Exception as e:
        print(f"Error optimizing image {image_field.name}: {e}")

@receiver(post_save, sender=PropertyImage)
def optimize_property_image(sender, instance, created, **kwargs):
    """Optimize property images when saved"""
    if created and instance.image:
        optimize_image_file(instance.image, instance)

@receiver(post_save, sender=PackageImage)
def optimize_package_image(sender, instance, created, **kwargs):
    """Optimize package images when saved"""
    if created and instance.image:
        optimize_image_file(instance.image, instance)

@receiver(post_save, sender=Destination)
def optimize_destination_image(sender, instance, created, **kwargs):
    """Ensure Location exists for Destination, and optimize image when created"""
    # Upsert Location from Destination geo fields
    try:
        if instance.island:
            loc, created_loc = Location.objects.get_or_create(
                island=instance.island,
                atoll=instance.atoll or '',
                defaults={
                    'latitude': instance.latitude,
                    'longitude': instance.longitude,
                }
            )
            # If Destination lat/lon updated later, optionally sync Location if it exists
            if not created_loc:
                updated = False
                if instance.latitude is not None and loc.latitude != instance.latitude:
                    loc.latitude = instance.latitude
                    updated = True
                if instance.longitude is not None and loc.longitude != instance.longitude:
                    loc.longitude = instance.longitude
                    updated = True
                if updated:
                    loc.save(update_fields=['latitude', 'longitude'])
    except Exception:
        pass

    # Optimize image on create
    if created and instance.image:
        optimize_image_file(instance.image, instance)

@receiver(post_save, sender=Experience)
def optimize_experience_image(sender, instance, created, **kwargs):
    """Optimize experience images when saved"""
    if created and instance.image:
        optimize_image_file(instance.image, instance)

@receiver(post_save, sender=HomepageHero)
def optimize_homepage_hero_image(sender, instance, created, **kwargs):
    """Optimize homepage hero images when saved"""
    if created and instance.background_image:
        optimize_image_file(instance.background_image, instance)

@receiver(post_save, sender=HomepageFeature)
def optimize_homepage_feature_image(sender, instance, created, **kwargs):
    """Optimize homepage feature images when saved"""
    if created and instance.image:
        optimize_image_file(instance.image, instance)

@receiver(post_save, sender=HomepageTestimonial)
def optimize_homepage_testimonial_image(sender, instance, created, **kwargs):
    """Optimize homepage testimonial images when saved"""
    if created and instance.avatar:
        optimize_image_file(instance.avatar, instance)

@receiver(post_save, sender=HomepageImage)
def optimize_homepage_image(sender, instance, created, **kwargs):
    """Optimize homepage images when saved"""
    if created and instance.image:
        optimize_image_file(instance.image, instance)

@receiver(post_save, sender=PageHero)
def optimize_page_hero_image(sender, instance, created, **kwargs):
    """Optimize page hero images when saved"""
    if created and instance.background_image:
        optimize_image_file(instance.background_image, instance)

@receiver(post_save, sender=AboutPageContent)
def optimize_about_page_image(sender, instance, created, **kwargs):
    """Optimize about page images when saved"""
    if created and instance.image:
        optimize_image_file(instance.image, instance)

@receiver(post_save, sender=FeaturedDestination)
def optimize_featured_destination_image(sender, instance, created, **kwargs):
    """Optimize featured destination images when saved"""
    if created and instance.image:
        optimize_image_file(instance.image, instance)


# Package-related signals for updating destination counts
@receiver(post_save, sender=PackageDestination)
def update_destination_counts_on_package_destination_save(sender, instance, created, **kwargs):
    """Update destination package counts when package destinations are created/updated"""
    try:
        instance.location.destination_set.all().update_counts()
    except Exception:
        pass


@receiver(post_save, sender=Package)
def update_destination_counts_on_package_save(sender, instance, created, **kwargs):
    """Update destination package counts when packages are created/updated"""
    try:
        # Get all destinations related to this package and update their counts
        destinations = Destination.objects.filter(
            island__in=instance.destinations.values_list('location__island', flat=True).distinct()
        )
        for destination in destinations:
            destination.update_counts()
            destination.save(update_fields=['property_count', 'package_count'])
    except Exception:
        pass


@receiver(post_delete, sender=PackageDestination)
def update_destination_counts_on_package_destination_delete(sender, instance, **kwargs):
    """Update destination package counts when package destinations are deleted"""
    try:
        instance.location.destination_set.all().update_counts()
    except Exception:
        pass


@receiver(post_delete, sender=Package)
def update_destination_counts_on_package_delete(sender, instance, **kwargs):
    """Update destination package counts when packages are deleted"""
    try:
        # Get all destinations that were related to this package and update their counts
        destinations = Destination.objects.filter(
            island__in=instance.destinations.values_list('location__island', flat=True).distinct()
        )
        for destination in destinations:
            destination.update_counts()
            destination.save(update_fields=['property_count', 'package_count'])
    except Exception:
        pass
