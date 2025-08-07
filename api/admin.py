from django.contrib import admin
from .models import PropertyType, Amenity, Location, Property, PropertyImage, Package, Review

@admin.register(PropertyType)
class PropertyTypeAdmin(admin.ModelAdmin):
    list_display = ('name', 'description')

@admin.register(Amenity)
class AmenityAdmin(admin.ModelAdmin):
    list_display = ('name', 'icon')

@admin.register(Location)
class LocationAdmin(admin.ModelAdmin):
    list_display = ('island', 'atoll', 'latitude', 'longitude')

class PropertyImageInline(admin.TabularInline):
    model = PropertyImage
    extra = 1

@admin.register(Property)
class PropertyAdmin(admin.ModelAdmin):
    list_display = ('name', 'property_type', 'location', 'price_per_night', 'is_featured')
    list_filter = ('property_type', 'is_featured', 'location')
    search_fields = ('name', 'description', 'address')
    inlines = [PropertyImageInline]

@admin.register(Package)
class PackageAdmin(admin.ModelAdmin):
    list_display = ('name', 'price', 'is_featured', 'start_date', 'end_date')
    filter_horizontal = ('properties',)

@admin.register(Review)
class ReviewAdmin(admin.ModelAdmin):
    list_display = ('property', 'name', 'rating', 'approved', 'created_at')
    list_filter = ('approved', 'rating', 'property')
    search_fields = ('name', 'comment')
