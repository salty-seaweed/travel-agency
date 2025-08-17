from django.contrib import admin
from django.utils.html import format_html
from django.urls import reverse
from django.utils.safestring import mark_safe
from ..models import (
    TransferType, AtollTransfer, ResortTransfer, TransferFAQ, 
    TransferContactMethod, TransferBookingStep, TransferBenefit, 
    TransferPricingFactor, TransferContent
)

# Inline Admin Classes
class ResortTransferInline(admin.TabularInline):
    model = ResortTransfer
    extra = 1
    fields = ('resort_name', 'price', 'duration', 'transfer_type', 'is_active', 'order')
    ordering = ('order',)

class TransferFAQInline(admin.TabularInline):
    model = TransferFAQ
    extra = 1
    fields = ('question', 'answer', 'category', 'is_active', 'order')
    ordering = ('category', 'order')

# Transfer Type Admin
@admin.register(TransferType)
class TransferTypeAdmin(admin.ModelAdmin):
    list_display = ('name', 'pricing_range', 'best_for', 'is_active', 'order', 'get_features_count')
    list_filter = ('is_active', 'order')
    search_fields = ('name', 'description', 'best_for')
    ordering = ('order', 'name')
    list_editable = ('is_active', 'order')
    
    fieldsets = (
        ('Basic Information', {
            'fields': ('name', 'description', 'icon', 'gradient')
        }),
        ('Pricing & Features', {
            'fields': ('pricing_range', 'best_for', 'features')
        }),
        ('Pros & Cons', {
            'fields': ('pros', 'cons'),
            'classes': ('collapse',)
        }),
        ('Settings', {
            'fields': ('is_active', 'order')
        })
    )
    
    def get_features_count(self, obj):
        return len(obj.features) if obj.features else 0
    get_features_count.short_description = 'Features Count'

# Atoll Transfer Admin
@admin.register(AtollTransfer)
class AtollTransferAdmin(admin.ModelAdmin):
    list_display = ('atoll_name', 'description', 'is_active', 'order', 'get_resorts_count')
    list_filter = ('is_active', 'order')
    search_fields = ('atoll_name', 'description')
    ordering = ('order', 'atoll_name')
    list_editable = ('is_active', 'order')
    inlines = [ResortTransferInline]
    
    fieldsets = (
        ('Basic Information', {
            'fields': ('atoll_name', 'description', 'icon', 'gradient')
        }),
        ('Settings', {
            'fields': ('is_active', 'order')
        })
    )
    
    def get_resorts_count(self, obj):
        return obj.resorts.count()
    get_resorts_count.short_description = 'Resorts Count'

# Resort Transfer Admin
@admin.register(ResortTransfer)
class ResortTransferAdmin(admin.ModelAdmin):
    list_display = ('resort_name', 'atoll', 'price', 'duration', 'transfer_type', 'is_active', 'order')
    list_filter = ('atoll', 'transfer_type', 'is_active', 'order')
    search_fields = ('resort_name', 'atoll__atoll_name')
    ordering = ('atoll', 'order', 'resort_name')
    list_editable = ('price', 'duration', 'is_active', 'order')
    
    fieldsets = (
        ('Resort Information', {
            'fields': ('atoll', 'resort_name')
        }),
        ('Transfer Details', {
            'fields': ('price', 'duration', 'transfer_type')
        }),
        ('Settings', {
            'fields': ('is_active', 'order')
        })
    )

# Transfer FAQ Admin
@admin.register(TransferFAQ)
class TransferFAQAdmin(admin.ModelAdmin):
    list_display = ('question', 'category', 'is_active', 'order', 'get_answer_preview')
    list_filter = ('category', 'is_active', 'order')
    search_fields = ('question', 'answer', 'category')
    ordering = ('category', 'order')
    list_editable = ('category', 'is_active', 'order')
    
    fieldsets = (
        ('FAQ Information', {
            'fields': ('question', 'answer', 'category', 'icon')
        }),
        ('Settings', {
            'fields': ('is_active', 'order')
        })
    )
    
    def get_answer_preview(self, obj):
        return obj.answer[:100] + '...' if len(obj.answer) > 100 else obj.answer
    get_answer_preview.short_description = 'Answer Preview'

# Transfer Contact Method Admin
@admin.register(TransferContactMethod)
class TransferContactMethodAdmin(admin.ModelAdmin):
    list_display = ('method', 'contact', 'response_time', 'is_active', 'order', 'get_description_preview')
    list_filter = ('is_active', 'order')
    search_fields = ('method', 'contact', 'description')
    ordering = ('order', 'method')
    list_editable = ('contact', 'response_time', 'is_active', 'order')
    
    fieldsets = (
        ('Contact Information', {
            'fields': ('method', 'contact', 'description', 'response_time')
        }),
        ('Styling', {
            'fields': ('icon', 'color')
        }),
        ('Settings', {
            'fields': ('is_active', 'order')
        })
    )
    
    def get_description_preview(self, obj):
        return obj.description[:50] + '...' if len(obj.description) > 50 else obj.description
    get_description_preview.short_description = 'Description Preview'

# Transfer Booking Step Admin
@admin.register(TransferBookingStep)
class TransferBookingStepAdmin(admin.ModelAdmin):
    list_display = ('step_number', 'title', 'is_active', 'get_description_preview')
    list_filter = ('is_active', 'step_number')
    search_fields = ('title', 'description', 'tips')
    ordering = ('step_number',)
    list_editable = ('is_active',)
    
    fieldsets = (
        ('Step Information', {
            'fields': ('step_number', 'title', 'description', 'icon')
        }),
        ('Details & Tips', {
            'fields': ('details', 'tips'),
            'classes': ('collapse',)
        }),
        ('Settings', {
            'fields': ('is_active',)
        })
    )
    
    def get_description_preview(self, obj):
        return obj.description[:80] + '...' if len(obj.description) > 80 else obj.description
    get_description_preview.short_description = 'Description Preview'

# Transfer Benefit Admin
@admin.register(TransferBenefit)
class TransferBenefitAdmin(admin.ModelAdmin):
    list_display = ('benefit', 'color', 'is_active', 'order', 'get_description_preview')
    list_filter = ('is_active', 'color', 'order')
    search_fields = ('benefit', 'description')
    ordering = ('order', 'benefit')
    list_editable = ('color', 'is_active', 'order')
    
    fieldsets = (
        ('Benefit Information', {
            'fields': ('benefit', 'description', 'icon', 'color')
        }),
        ('Settings', {
            'fields': ('is_active', 'order')
        })
    )
    
    def get_description_preview(self, obj):
        return obj.description[:60] + '...' if len(obj.description) > 60 else obj.description
    get_description_preview.short_description = 'Description Preview'

# Transfer Pricing Factor Admin
@admin.register(TransferPricingFactor)
class TransferPricingFactorAdmin(admin.ModelAdmin):
    list_display = ('factor', 'impact', 'is_active', 'order', 'get_description_preview')
    list_filter = ('impact', 'is_active', 'order')
    search_fields = ('factor', 'description')
    ordering = ('order', 'factor')
    list_editable = ('impact', 'is_active', 'order')
    
    fieldsets = (
        ('Factor Information', {
            'fields': ('factor', 'description', 'icon', 'impact')
        }),
        ('Examples', {
            'fields': ('examples',),
            'classes': ('collapse',)
        }),
        ('Settings', {
            'fields': ('is_active', 'order')
        })
    )
    
    def get_description_preview(self, obj):
        return obj.description[:70] + '...' if len(obj.description) > 70 else obj.description
    get_description_preview.short_description = 'Description Preview'

# Transfer Content Admin
@admin.register(TransferContent)
class TransferContentAdmin(admin.ModelAdmin):
    list_display = ('section', 'title', 'is_active', 'order', 'get_description_preview')
    list_filter = ('section', 'is_active', 'order')
    search_fields = ('title', 'description', 'subtitle')
    ordering = ('order', 'section')
    list_editable = ('is_active', 'order')
    
    fieldsets = (
        ('Content Information', {
            'fields': ('section', 'title', 'subtitle', 'description')
        }),
        ('Badge Information', {
            'fields': ('badge_text', 'badge_icon')
        }),
        ('Settings', {
            'fields': ('is_active', 'order')
        })
    )
    
    def get_description_preview(self, obj):
        return obj.description[:80] + '...' if len(obj.description) > 80 else obj.description
    get_description_preview.short_description = 'Description Preview'

# Custom Admin Site Configuration
class TransportationAdminSite(admin.AdminSite):
    site_header = 'Thread Travels Transportation Admin'
    site_title = 'Transportation Admin'
    index_title = 'Transportation Management'

# Register with custom admin site
transportation_admin_site = TransportationAdminSite(name='transportation_admin')

# Register models with custom admin site
transportation_admin_site.register(TransferType, TransferTypeAdmin)
transportation_admin_site.register(AtollTransfer, AtollTransferAdmin)
transportation_admin_site.register(ResortTransfer, ResortTransferAdmin)
transportation_admin_site.register(TransferFAQ, TransferFAQAdmin)
transportation_admin_site.register(TransferContactMethod, TransferContactMethodAdmin)
transportation_admin_site.register(TransferBookingStep, TransferBookingStepAdmin)
transportation_admin_site.register(TransferBenefit, TransferBenefitAdmin)
transportation_admin_site.register(TransferPricingFactor, TransferPricingFactorAdmin)
transportation_admin_site.register(TransferContent, TransferContentAdmin) 