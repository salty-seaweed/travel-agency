from django.contrib import admin
from .models import (
    PropertyType, Amenity, Location, Property, PropertyImage, Package, Review,
    Page, PageBlock, MediaAsset, Menu, MenuItem, Redirect, PageVersion, PageReview, CommentThread, Comment,
    TransferType, AtollTransfer, ResortTransfer, TransferFAQ, TransferContactMethod, 
    TransferBookingStep, TransferBenefit, TransferPricingFactor, TransferContent
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

# Transportation Admin Models
@admin.register(TransferType)
class TransferTypeAdmin(admin.ModelAdmin):
    list_display = ('name', 'pricing_range', 'best_for', 'is_active', 'order')
    list_filter = ('is_active',)
    search_fields = ('name', 'description')
    ordering = ('order',)

@admin.register(AtollTransfer)
class AtollTransferAdmin(admin.ModelAdmin):
    list_display = ('atoll_name', 'description', 'is_active', 'order')
    list_filter = ('is_active',)
    search_fields = ('atoll_name', 'description')
    ordering = ('order',)

class ResortTransferInline(admin.TabularInline):
    model = ResortTransfer
    extra = 1
    fields = ('resort_name', 'price', 'duration', 'transfer_type', 'is_active', 'order')

@admin.register(ResortTransfer)
class ResortTransferAdmin(admin.ModelAdmin):
    list_display = ('resort_name', 'atoll', 'price', 'duration', 'transfer_type', 'is_active')
    list_filter = ('atoll', 'transfer_type', 'is_active')
    search_fields = ('resort_name',)
    ordering = ('atoll', 'order')

@admin.register(TransferFAQ)
class TransferFAQAdmin(admin.ModelAdmin):
    list_display = ('question', 'category', 'is_active', 'order')
    list_filter = ('category', 'is_active')
    search_fields = ('question', 'answer')
    ordering = ('category', 'order')

@admin.register(TransferContactMethod)
class TransferContactMethodAdmin(admin.ModelAdmin):
    list_display = ('method', 'contact', 'response_time', 'is_active', 'order')
    list_filter = ('is_active',)
    search_fields = ('method', 'contact', 'description')
    ordering = ('order',)

@admin.register(TransferBookingStep)
class TransferBookingStepAdmin(admin.ModelAdmin):
    list_display = ('step_number', 'title', 'is_active')
    list_filter = ('is_active',)
    search_fields = ('title', 'description')
    ordering = ('step_number',)

@admin.register(TransferBenefit)
class TransferBenefitAdmin(admin.ModelAdmin):
    list_display = ('benefit', 'color', 'is_active', 'order')
    list_filter = ('is_active',)
    search_fields = ('benefit', 'description')
    ordering = ('order',)

@admin.register(TransferPricingFactor)
class TransferPricingFactorAdmin(admin.ModelAdmin):
    list_display = ('factor', 'impact', 'is_active', 'order')
    list_filter = ('impact', 'is_active')
    search_fields = ('factor', 'description')
    ordering = ('order',)

@admin.register(TransferContent)
class TransferContentAdmin(admin.ModelAdmin):
    list_display = ('section', 'title', 'is_active', 'order')
    list_filter = ('section', 'is_active')
    search_fields = ('title', 'description')
    ordering = ('order',)
