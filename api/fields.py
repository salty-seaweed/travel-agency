from django.db import models
from django.core.files.base import ContentFile
from django.core.files.storage import default_storage
from PIL import Image
import io
import os
from django.conf import settings

class OptimizedImageField(models.ImageField):
    """
    Custom ImageField that automatically optimizes uploaded images
    - Compresses images to reduce file size
    - Creates multiple sizes for responsive design
    - Converts to WebP format when possible
    """
    
    def __init__(self, *args, **kwargs):
        # Extract optimization options
        self.max_width = kwargs.pop('max_width', 1920)
        self.max_height = kwargs.pop('max_height', 1080)
        self.quality = kwargs.pop('quality', 85)
        self.create_webp = kwargs.pop('create_webp', True)
        self.create_thumbnails = kwargs.pop('create_thumbnails', True)
        
        super().__init__(*args, **kwargs)
    
    def save_form_data(self, instance, data):
        """Override to optimize image before saving"""
        if data and hasattr(data, 'read'):
            # Optimize the image
            optimized_data = self.optimize_image(data)
            if optimized_data:
                # Create optimized filename
                filename = self.get_optimized_filename(data.name)
                optimized_data.name = filename
                data = optimized_data
        
        super().save_form_data(instance, data)
    
    def optimize_image(self, image_file):
        """Optimize uploaded image"""
        try:
            # Open image with PIL
            img = Image.open(image_file)
            
            # Convert to RGB if necessary (for JPEG compatibility)
            if img.mode in ('RGBA', 'LA', 'P'):
                # Create white background for transparent images
                background = Image.new('RGB', img.size, (255, 255, 255))
                if img.mode == 'P':
                    img = img.convert('RGBA')
                background.paste(img, mask=img.split()[-1] if img.mode == 'RGBA' else None)
                img = background
            elif img.mode != 'RGB':
                img = img.convert('RGB')
            
            # Resize if image is too large
            if img.width > self.max_width or img.height > self.max_height:
                img.thumbnail((self.max_width, self.max_height), Image.Resampling.LANCZOS)
            
            # Save optimized JPEG
            output = io.BytesIO()
            img.save(output, format='JPEG', quality=self.quality, optimize=True)
            output.seek(0)
            
            # Create ContentFile
            optimized_data = ContentFile(output.getvalue())
            
            # Create WebP version if enabled
            if self.create_webp:
                self.create_webp_version(img, image_file.name)
            
            # Create thumbnails if enabled
            if self.create_thumbnails:
                self.create_thumbnails(img, image_file.name)
            
            return optimized_data
            
        except Exception as e:
            print(f"Error optimizing image: {e}")
            # Return original if optimization fails
            return None
    
    def create_webp_version(self, img, original_name):
        """Create WebP version of the image"""
        try:
            # Create WebP filename
            base_name = os.path.splitext(original_name)[0]
            webp_filename = f"{base_name}.webp"
            
            # Save WebP version
            output = io.BytesIO()
            img.save(output, format='WebP', quality=self.quality, method=6)
            output.seek(0)
            
            # Save to storage
            webp_path = os.path.join(os.path.dirname(self.upload_to), webp_filename)
            default_storage.save(webp_path, ContentFile(output.getvalue()))
            
        except Exception as e:
            print(f"Error creating WebP version: {e}")
    
    def create_thumbnails(self, img, original_name):
        """Create thumbnail versions"""
        try:
            base_name = os.path.splitext(original_name)[0]
            thumbnail_sizes = [
                ('thumb', 150, 150),
                ('small', 400, 300),
                ('medium', 800, 600),
                ('large', 1200, 900)
            ]
            
            for size_name, width, height in thumbnail_sizes:
                # Create thumbnail
                thumb = img.copy()
                thumb.thumbnail((width, height), Image.Resampling.LANCZOS)
                
                # Save thumbnail
                output = io.BytesIO()
                thumb.save(output, format='JPEG', quality=self.quality, optimize=True)
                output.seek(0)
                
                # Save to storage
                thumb_filename = f"{base_name}_{size_name}.jpg"
                thumb_path = os.path.join(os.path.dirname(self.upload_to), 'thumbnails', thumb_filename)
                default_storage.save(thumb_path, ContentFile(output.getvalue()))
                
        except Exception as e:
            print(f"Error creating thumbnails: {e}")
    
    def get_optimized_filename(self, original_name):
        """Generate optimized filename"""
        base_name = os.path.splitext(original_name)[0]
        return f"{base_name}_optimized.jpg"
