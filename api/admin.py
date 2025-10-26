from django.contrib import admin
from .models import (
    PropertyType, Amenity, Location, Destination, Experience, Property, PropertyImage, Package, PackageDestination, Review,
    Page, PageBlock, MediaAsset, Menu, MenuItem, Redirect, PageVersion, PageReview, CommentThread, Comment,
    TransferType, AtollTransfer, ResortTransfer, TransferFAQ, TransferContactMethod, 
    TransferBookingStep, TransferBenefit, TransferPricingFactor, TransferContent,
    PageHero, Resort, ResortImage, ResortReview, ResortAmenity
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

@admin.register(Destination)
class DestinationAdmin(admin.ModelAdmin):
    list_display = ['name', 'island', 'atoll', 'is_featured', 'property_count', 'package_count', 'is_active']
    list_filter = ['is_featured', 'is_active', 'atoll']
    search_fields = ['name', 'island', 'atoll', 'description']
    list_editable = ['is_featured', 'is_active']
    readonly_fields = ['property_count', 'package_count', 'created_at', 'updated_at']
    fieldsets = (
        ('Basic Information', {
            'fields': ('name', 'description', 'island', 'atoll')
        }),
        ('Location', {
            'fields': ('latitude', 'longitude')
        }),
        ('Media', {
            'fields': ('image',)
        }),
        ('Settings', {
            'fields': ('is_featured', 'is_active')
        }),
        ('Statistics', {
            'fields': ('property_count', 'package_count'),
            'classes': ('collapse',)
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )

@admin.register(Experience)
class ExperienceAdmin(admin.ModelAdmin):
    list_display = ['name', 'experience_type', 'duration', 'price', 'destination', 'is_featured', 'is_active']
    list_filter = ['experience_type', 'is_featured', 'is_active', 'difficulty_level', 'destination']
    search_fields = ['name', 'description', 'destination__name', 'destination__island', 'destination__atoll']
    list_editable = ['is_featured', 'is_active', 'price']
    readonly_fields = ['created_at', 'updated_at']
    fieldsets = (
        ('Basic Information', {
            'fields': ('name', 'description', 'experience_type', 'duration', 'price', 'currency')
        }),
        ('Destination', {
            'fields': ('destination',)
        }),
        ('Details', {
            'fields': ('max_participants', 'min_age', 'difficulty_level')
        }),
        ('Content', {
            'fields': ('includes', 'excludes', 'requirements')
        }),
        ('Media', {
            'fields': ('image',)
        }),
        ('Settings', {
            'fields': ('is_featured', 'is_active')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )

class PropertyImageInline(admin.TabularInline):
    model = PropertyImage
    extra = 1

@admin.register(Property)
class PropertyAdmin(admin.ModelAdmin):
    list_display = ('name', 'property_type', 'location', 'price_per_night', 'is_featured')
    list_filter = ('property_type', 'is_featured', 'location')
    search_fields = ('name', 'description', 'address')
    inlines = [PropertyImageInline]

class PackageDestinationInline(admin.TabularInline):
    model = PackageDestination
    extra = 1
    fields = ('location', 'duration', 'description', 'highlights', 'activities')

@admin.register(Package)
class PackageAdmin(admin.ModelAdmin):
    list_display = ('name', 'price', 'pricing_type', 'is_featured', 'start_date', 'end_date')
    list_filter = ('is_featured', 'category', 'difficulty_level', 'pricing_type')
    search_fields = ('name', 'description', 'highlights')
    inlines = [PackageDestinationInline]
    fieldsets = (
        ('Basic Information', {
            'fields': ('name', 'description', 'detailed_description', 'highlights', 'category', 'difficulty_level')
        }),
        ('Pricing & Duration', {
            'fields': ('price', 'original_price', 'discount_percentage', 'pricing_type', 'duration')
        }),
        ('Group Size', {
            'fields': ('group_size_min', 'group_size_max', 'group_size_recommended')
        }),
        ('Dates & Status', {
            'fields': ('start_date', 'end_date', 'is_featured')
        }),
        ('Accommodation & Transportation', {
            'fields': ('accommodation_type', 'room_type', 'meal_plan', 'transportation_details', 'airport_transfers')
        }),
        ('Additional Information', {
            'fields': ('best_time_to_visit', 'weather_info', 'what_to_bring', 'important_notes')
        }),
        ('Pricing & Availability', {
            'fields': ('seasonal_pricing_peak', 'seasonal_pricing_off_peak', 'seasonal_pricing_shoulder', 'availability_calendar')
        }),
        ('Booking Information', {
            'fields': ('booking_terms', 'cancellation_policy', 'payment_terms')
        }),
    )

@admin.register(PackageDestination)
class PackageDestinationAdmin(admin.ModelAdmin):
    list_display = ('package', 'location', 'duration', 'get_highlights_count', 'get_activities_count')
    list_filter = ('package', 'location__atoll', 'duration')
    search_fields = ('package__name', 'location__island', 'location__atoll', 'description')
    fieldsets = (
        ('Package & Location', {
            'fields': ('package', 'location')
        }),
        ('Duration & Description', {
            'fields': ('duration', 'description')
        }),
        ('Highlights & Activities', {
            'fields': ('highlights', 'activities')
        }),
    )
    
    def get_highlights_count(self, obj):
        return len(obj.highlights) if obj.highlights else 0
    get_highlights_count.short_description = 'Highlights'
    
    def get_activities_count(self, obj):
        return len(obj.activities) if obj.activities else 0
    get_activities_count.short_description = 'Activities'

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


@admin.register(PageHero)
class PageHeroAdmin(admin.ModelAdmin):
    list_display = ('page_key', 'title', 'is_active', 'updated_at')
    list_filter = ('page_key', 'is_active')
    search_fields = ('page_key', 'title', 'subtitle')
    readonly_fields = ('created_at', 'updated_at')
    fieldsets = (
        ('Page', {'fields': ('page_key', 'is_active')}),
        ('Content', {'fields': ('title', 'subtitle')}),
        ('Background', {'fields': ('background_image', 'background_image_url', 'overlay_opacity')}),
        ('Timestamps', {'fields': ('created_at', 'updated_at'), 'classes': ('collapse',)}),
    )

# Resort Admin Models
class ResortImageInline(admin.TabularInline):
    model = ResortImage
    extra = 1
    fields = ('image', 'image_type', 'caption', 'alt_text', 'order', 'is_featured', 'is_active')

class ResortReviewInline(admin.TabularInline):
    model = ResortReview
    extra = 0
    fields = ('guest_name', 'rating', 'title', 'comment', 'is_approved', 'is_featured')
    readonly_fields = ('created_at',)

@admin.register(Resort)
class ResortAdmin(admin.ModelAdmin):
    list_display = ('name', 'category', 'star_rating', 'atoll', 'island_name', 'price_per_night_from', 'is_featured', 'is_active')
    list_filter = ('category', 'star_rating', 'is_featured', 'is_active', 'is_adults_only', 'is_family_friendly', 'is_honeymoon_special', 'atoll')
    search_fields = ('name', 'description', 'atoll', 'island_name', 'meta_keywords')
    list_editable = ('is_featured', 'is_active')
    readonly_fields = ('created_at', 'updated_at', 'full_location', 'price_range', 'total_villa_count')
    inlines = [ResortImageInline, ResortReviewInline]
    fieldsets = (
        ('Basic Information', {
            'fields': ('name', 'description', 'detailed_description', 'category', 'star_rating')
        }),
        ('Location', {
            'fields': ('location', 'atoll', 'island_name', 'coordinates', 'full_location')
        }),
        ('Contact Information', {
            'fields': ('phone', 'email', 'website', 'whatsapp_number')
        }),
        ('Pricing', {
            'fields': ('price_per_night_from', 'price_per_night_to', 'currency', 'pricing_notes', 'price_range')
        }),
        ('Resort Features', {
            'fields': ('total_villas', 'beach_villas', 'water_villas', 'overwater_villas', 'garden_villas', 'total_villa_count')
        }),
        ('Amenities & Facilities', {
            'fields': ('amenities', 'restaurants', 'bars', 'spa_centers', 'fitness_centers', 'pools', 'dive_centers', 'water_sports_centers')
        }),
        ('Activities', {
            'fields': ('diving_available', 'snorkeling_available', 'fishing_available', 'sailing_available', 'spa_services', 'water_sports', 'land_activities', 'cultural_experiences')
        }),
        ('Transportation', {
            'fields': ('transfer_type', 'transfer_duration', 'transfer_cost')
        }),
        ('Special Features', {
            'fields': ('is_adults_only', 'is_family_friendly', 'is_honeymoon_special', 'is_eco_friendly', 'is_private_island', 'has_house_reef', 'has_private_beach')
        }),
        ('Media', {
            'fields': ('hero_image', 'gallery_images', 'virtual_tour_url', 'drone_video_url')
        }),
        ('SEO & Marketing', {
            'fields': ('meta_title', 'meta_description', 'meta_keywords', 'featured_highlights', 'special_offers')
        }),
        ('Status & Display', {
            'fields': ('is_featured', 'is_active', 'is_available', 'display_order')
        }),
        ('Internationalization', {
            'fields': ('language', 'localized_name', 'localized_description', 'localized_highlights')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    
    def get_queryset(self, request):
        return super().get_queryset(request).select_related('location', 'language')

@admin.register(ResortImage)
class ResortImageAdmin(admin.ModelAdmin):
    list_display = ('resort', 'image_type', 'caption', 'order', 'is_featured', 'is_active', 'created_at')
    list_filter = ('image_type', 'is_featured', 'is_active', 'created_at')
    search_fields = ('resort__name', 'caption', 'alt_text')
    list_editable = ('order', 'is_featured', 'is_active')
    readonly_fields = ('created_at',)
    
    def get_queryset(self, request):
        return super().get_queryset(request).select_related('resort')

@admin.register(ResortReview)
class ResortReviewAdmin(admin.ModelAdmin):
    list_display = ('resort', 'guest_name', 'rating', 'title', 'is_approved', 'is_featured', 'created_at')
    list_filter = ('rating', 'is_approved', 'is_featured', 'is_verified', 'created_at')
    search_fields = ('resort__name', 'guest_name', 'title', 'comment')
    list_editable = ('is_approved', 'is_featured')
    readonly_fields = ('created_at', 'updated_at')
    
    def get_queryset(self, request):
        return super().get_queryset(request).select_related('resort')

@admin.register(ResortAmenity)
class ResortAmenityAdmin(admin.ModelAdmin):
    list_display = ('name', 'category', 'icon', 'is_active', 'order')
    list_filter = ('category', 'is_active')
    search_fields = ('name', 'description')
    list_editable = ('is_active', 'order')
    ordering = ('category', 'order', 'name')
