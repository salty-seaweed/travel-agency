from django.contrib import admin
from .models import (
    Continent, Country, ActivityCategory, TourPackage,
    TourItinerary, TourInclusion, TourBooking, Currency
)


@admin.register(Continent)
class ContinentAdmin(admin.ModelAdmin):
    list_display = ['name', 'code', 'display_order']
    list_editable = ['display_order']
    ordering = ['display_order']


@admin.register(Country)
class CountryAdmin(admin.ModelAdmin):
    list_display = ['name', 'code', 'continent', 'capital', 'is_featured', 'is_active']
    list_filter = ['continent', 'is_featured', 'is_active']
    search_fields = ['name', 'code', 'capital']
    list_editable = ['is_featured', 'is_active']


@admin.register(ActivityCategory)
class ActivityCategoryAdmin(admin.ModelAdmin):
    list_display = ['name', 'slug', 'display_order', 'is_active']
    list_editable = ['display_order', 'is_active']
    ordering = ['display_order']


@admin.register(TourPackage)
class TourPackageAdmin(admin.ModelAdmin):
    list_display = ['name', 'country', 'duration_days', 'price_usd', 'discount_percentage', 'is_featured', 'is_active']
    list_filter = ['country', 'difficulty', 'is_featured', 'is_active']
    search_fields = ['name', 'slug']
    list_editable = ['is_featured', 'is_active']


@admin.register(TourItinerary)
class TourItineraryAdmin(admin.ModelAdmin):
    list_display = ['tour', 'day_number', 'title']
    list_filter = ['tour']
    ordering = ['tour', 'day_number']


@admin.register(TourInclusion)
class TourInclusionAdmin(admin.ModelAdmin):
    list_display = ['tour', 'item', 'is_included']
    list_filter = ['is_included']


@admin.register(TourBooking)
class TourBookingAdmin(admin.ModelAdmin):
    list_display = ['booking_reference', 'tour', 'user', 'full_name', 'travel_date', 'status', 'total_amount']
    list_filter = ['status', 'travel_date']
    search_fields = ['booking_reference', 'full_name', 'email']


@admin.register(Currency)
class CurrencyAdmin(admin.ModelAdmin):
    list_display = ['name', 'code', 'symbol', 'exchange_rate', 'is_default', 'is_active']
    list_editable = ['is_default', 'is_active']