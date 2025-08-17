from django.contrib import admin
from .models import (
    PropertyType, Amenity, Location, Property, PropertyImage, Package, Review,
    Page, PageBlock, MediaAsset, Menu, MenuItem, Redirect, PageVersion, PageReview, CommentThread, Comment
)

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

# CMS Admin Models
@admin.register(Page)
class PageAdmin(admin.ModelAdmin):
    list_display = ('title', 'path', 'status', 'locale', 'created_by', 'updated_at')
    list_filter = ('status', 'locale', 'is_home', 'created_at')
    search_fields = ('title', 'path', 'slug')
    readonly_fields = ('created_by', 'updated_by', 'version', 'created_at', 'updated_at')
    prepopulated_fields = {'slug': ('title',)}

class PageBlockInline(admin.TabularInline):
    model = PageBlock
    extra = 1
    fields = ('type', 'order', 'data')

@admin.register(MediaAsset)
class MediaAssetAdmin(admin.ModelAdmin):
    list_display = ('file', 'mime_type', 'width', 'height', 'created_by', 'created_at')
    list_filter = ('mime_type', 'created_at')
    search_fields = ('alt_text', 'caption', 'tags')
    readonly_fields = ('created_by', 'created_at')

@admin.register(Menu)
class MenuAdmin(admin.ModelAdmin):
    list_display = ('name', 'slug', 'locale', 'is_active', 'get_items_count')
    list_filter = ('locale', 'is_active')
    search_fields = ('name', 'slug')
    prepopulated_fields = {'slug': ('name',)}
    
    def get_items_count(self, obj):
        return obj.items.count()
    get_items_count.short_description = 'Items Count'

class MenuItemInline(admin.TabularInline):
    model = MenuItem
    extra = 1

@admin.register(Redirect)
class RedirectAdmin(admin.ModelAdmin):
    list_display = ('from_path', 'to_path', 'status_code', 'locale', 'is_active')
    list_filter = ('status_code', 'locale', 'is_active')
    search_fields = ('from_path', 'to_path')

@admin.register(PageVersion)
class PageVersionAdmin(admin.ModelAdmin):
    list_display = ('page', 'version_number', 'created_by', 'created_at')
    list_filter = ('created_at',)
    readonly_fields = ('created_by', 'created_at')

@admin.register(PageReview)
class PageReviewAdmin(admin.ModelAdmin):
    list_display = ('page', 'reviewer', 'status', 'created_at')
    list_filter = ('status', 'created_at')
    search_fields = ('page__title', 'reviewer__username')
    readonly_fields = ('reviewer', 'created_at')

@admin.register(CommentThread)
class CommentThreadAdmin(admin.ModelAdmin):
    list_display = ('title', 'page', 'is_resolved', 'created_by', 'created_at')
    list_filter = ('is_resolved', 'created_at')
    search_fields = ('title', 'page__title')
    readonly_fields = ('created_by', 'created_at', 'resolved_at')

@admin.register(Comment)
class CommentAdmin(admin.ModelAdmin):
    list_display = ('author', 'thread', 'created_at')
    list_filter = ('created_at',)
    search_fields = ('content', 'author__username')
    readonly_fields = ('author', 'created_at', 'updated_at')
