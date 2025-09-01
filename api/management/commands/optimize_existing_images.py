from django.core.management.base import BaseCommand
from django.core.files.storage import default_storage
from django.core.files.base import ContentFile
from PIL import Image
import io
import os
from api.models import (
    PropertyImage, PackageImage, Destination, Experience,
    HomepageHero, HomepageFeature, HomepageTestimonial,
    PageHero, AboutPageContent, FeaturedDestination
)

class Command(BaseCommand):
    help = 'Optimize all existing images in the database'

    def add_arguments(self, parser):
        parser.add_argument(
            '--force',
            action='store_true',
            help='Force re-optimization of already optimized images'
        )
        parser.add_argument(
            '--model',
            type=str,
            help='Only optimize images from specific model (e.g., PropertyImage, Destination)'
        )

    def handle(self, *args, **options):
        force = options['force']
        model_name = options['model']
        
        self.stdout.write('Starting image optimization...')
        
        # Define models to process
        models_to_process = [
            (PropertyImage, 'image'),
            (PackageImage, 'image'),
            (Destination, 'image'),
            (Experience, 'image'),
            (HomepageHero, 'background_image'),
            (HomepageFeature, 'image'),
            (HomepageTestimonial, 'avatar'),
            (PageHero, 'background_image'),
            (AboutPageContent, 'image'),
            (FeaturedDestination, 'image'),
        ]
        
        if model_name:
            # Filter to specific model
            models_to_process = [m for m in models_to_process if m[0].__name__ == model_name]
            if not models_to_process:
                self.stdout.write(
                    self.style.ERROR(f'Model "{model_name}" not found or has no image fields')
                )
                return
        
        total_processed = 0
        total_optimized = 0
        
        for model_class, field_name in models_to_process:
            self.stdout.write(f'\nProcessing {model_class.__name__}...')
            
            # Get all instances with images
            filter_kwargs = {f'{field_name}__isnull': False}
            instances = model_class.objects.filter(**filter_kwargs)
            
            for instance in instances:
                image_field = getattr(instance, field_name)
                if not image_field:
                    continue
                
                try:
                    # Check if already optimized
                    if not force and self.is_already_optimized(image_field.name):
                        self.stdout.write(f'  Skipping {image_field.name} (already optimized)')
                        continue
                    
                    # Optimize the image
                    if self.optimize_single_image(image_field):
                        total_optimized += 1
                        self.stdout.write(
                            self.style.SUCCESS(f'  ✓ Optimized {image_field.name}')
                        )
                    else:
                        self.stdout.write(
                            self.style.WARNING(f'  ⚠ Failed to optimize {image_field.name}')
                        )
                    
                    total_processed += 1
                    
                except Exception as e:
                    self.stdout.write(
                        self.style.ERROR(f'  ✗ Error processing {image_field.name}: {e}')
                    )
        
        # Summary
        self.stdout.write('\n' + '='.repeat(50))
        self.stdout.write('OPTIMIZATION SUMMARY')
        self.stdout.write('='.repeat(50))
        self.stdout.write(f'Total images processed: {total_processed}')
        self.stdout.write(f'Successfully optimized: {total_optimized}')
        self.stdout.write(f'Failed: {total_processed - total_optimized}')
        
        if total_optimized > 0:
            self.stdout.write(
                self.style.SUCCESS('\n🎉 Image optimization completed successfully!')
            )
        else:
            self.stdout.write(
                self.style.WARNING('\n⚠️  No images were optimized. Check if images exist.')
            )
    
    def is_already_optimized(self, image_path):
        """Check if image already has optimized versions"""
        base_name = os.path.splitext(os.path.basename(image_path))[0]
        upload_dir = os.path.dirname(image_path)
        
        # Check for optimized directory
        optimized_dir = os.path.join(upload_dir, 'optimized')
        if not default_storage.exists(optimized_dir):
            return False
        
        # Check for at least one optimized version
        thumb_path = os.path.join(optimized_dir, f'{base_name}_thumb.jpg')
        return default_storage.exists(thumb_path)
    
    def optimize_single_image(self, image_field):
        """Optimize a single image file"""
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
                ('webp', 800, 600)
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
            
            # Create compressed original
            try:
                output = io.BytesIO()
                img.save(output, format='JPEG', quality=85, optimize=True)
                output.seek(0)
                
                compressed_path = os.path.join(upload_dir, 'optimized', f"{base_name}_compressed.jpg")
                default_storage.save(compressed_path, ContentFile(output.getvalue()))
                
            except Exception as e:
                print(f"Error creating compressed original: {e}")
            
            return True
            
        except Exception as e:
            print(f"Error optimizing image {image_field.name}: {e}")
            return False
