from rest_framework import serializers
from .models import (
    Continent, Country, ActivityCategory, TourPackage,
    TourItinerary, TourInclusion, TourBooking, Currency
)


class ContinentSerializer(serializers.ModelSerializer):
    """Serializer for continents"""
    countries_count = serializers.SerializerMethodField()

    class Meta:
        model = Continent
        fields = ['id', 'name', 'code', 'display_order', 'countries_count']

    def get_countries_count(self, obj):
        return obj.countries.filter(is_active=True).count()


class CountrySerializer(serializers.ModelSerializer):
    """Serializer for countries"""
    continent_name = serializers.CharField(source='continent.name', read_only=True)
    packages_count = serializers.SerializerMethodField()

    class Meta:
        model = Country
        fields = [
            'id', 'name', 'code', 'continent', 'continent_name',
            'capital', 'currency', 'language', 'description',
            'image', 'is_featured', 'is_active', 'display_order',
            'packages_count'
        ]

    def get_packages_count(self, obj):
        return obj.packages.filter(is_active=True).count()


class ActivityCategorySerializer(serializers.ModelSerializer):
    """Serializer for activity categories"""
    packages_count = serializers.SerializerMethodField()

    class Meta:
        model = ActivityCategory
        fields = [
            'id', 'name', 'slug', 'description', 'icon',
            'display_order', 'is_active', 'packages_count'
        ]

    def get_packages_count(self, obj):
        return obj.packages.filter(is_active=True).count()


class TourItinerarySerializer(serializers.ModelSerializer):
    """Serializer for tour itinerary"""

    class Meta:
        model = TourItinerary
        fields = [
            'id', 'day_number', 'title', 'description',
            'location', 'activities', 'meals'
        ]


class TourInclusionSerializer(serializers.ModelSerializer):
    """Serializer for tour inclusions"""

    class Meta:
        model = TourInclusion
        fields = ['id', 'item', 'is_included']


class TourPackageSerializer(serializers.ModelSerializer):
    """Serializer for tour packages"""
    country_name = serializers.CharField(source='country.name', read_only=True)
    continent_name = serializers.CharField(source='country.continent.name', read_only=True)
    activity_categories = ActivityCategorySerializer(many=True, read_only=True)
    itinerary = TourItinerarySerializer(many=True, read_only=True, source='itinerary_set')
    inclusions = TourInclusionSerializer(many=True, read_only=True, source='inclusions_set')
    final_price = serializers.SerializerMethodField()
    is_on_sale = serializers.SerializerMethodField()

    class Meta:
        model = TourPackage
        fields = [
            'id', 'name', 'slug', 'country', 'country_name', 'continent_name',
            'description', 'highlights', 'duration_days', 'difficulty', 'group_size',
            'price_usd', 'original_price_usd', 'discount_percentage',
            'activity_categories', 'main_image', 'images', 'is_featured',
            'is_active', 'meta_description', 'created_at', 'final_price', 'is_on_sale',
            'itinerary', 'inclusions'
        ]

    def get_final_price(self, obj):
        return obj.final_price

    def get_is_on_sale(self, obj):
        return obj.is_on_sale


class TourBookingSerializer(serializers.ModelSerializer):
    """Serializer for tour bookings"""
    tour_name = serializers.CharField(source='tour.name', read_only=True)
    tour_image = serializers.CharField(source='tour.main_image.url', read_only=True)
    user_email = serializers.CharField(source='user.email', read_only=True)

    class Meta:
        model = TourBooking
        fields = [
            'id', 'tour', 'tour_name', 'tour_image', 'user', 'user_email',
            'booking_reference', 'full_name', 'email', 'phone',
            'number_of_travelers', 'special_requests', 'travel_date',
            'status', 'total_amount', 'created_at'
        ]
        read_only_fields = ['booking_reference', 'created_at', 'user']

    def create(self, validated_data):
        # Generate booking reference
        import uuid
        booking_ref = f"TT-{uuid.uuid4().hex[:8].upper()}"

        validated_data['booking_reference'] = booking_ref
        validated_data['user'] = self.context['request'].user

        return super().create(validated_data)


class CurrencySerializer(serializers.ModelSerializer):
    """Serializer for currencies"""

    class Meta:
        model = Currency
        fields = [
            'id', 'name', 'code', 'symbol', 'exchange_rate',
            'is_default', 'is_active'
        ]


# Specialized serializers for specific use cases

class TourPackageListSerializer(serializers.ModelSerializer):
    """Lightweight serializer for tour listings"""
    country_name = serializers.CharField(source='country.name', read_only=True)
    continent_name = serializers.CharField(source='country.continent.name', read_only=True)
    final_price = serializers.SerializerMethodField()
    is_on_sale = serializers.SerializerMethodField()

    class Meta:
        model = TourPackage
        fields = [
            'id', 'name', 'slug', 'country_name', 'continent_name',
            'duration_days', 'difficulty', 'price_usd', 'discount_percentage',
            'final_price', 'is_on_sale', 'main_image', 'is_featured'
        ]

    def get_final_price(self, obj):
        return obj.final_price

    def get_is_on_sale(self, obj):
        return obj.is_on_sale


class CountryDetailSerializer(serializers.ModelSerializer):
    """Detailed serializer for country pages"""
    continent_name = serializers.CharField(source='continent.name', read_only=True)
    packages = TourPackageListSerializer(many=True, read_only=True, source='packages')
    packages_count = serializers.SerializerMethodField()

    class Meta:
        model = Country
        fields = [
            'id', 'name', 'code', 'continent_name', 'capital', 'currency',
            'language', 'description', 'image', 'is_featured', 'packages',
            'packages_count'
        ]

    def get_packages_count(self, obj):
        return obj.packages.filter(is_active=True).count()


class SearchResultSerializer(serializers.Serializer):
    """Serializer for search results"""
    countries = CountrySerializer(many=True)
    tours = TourPackageListSerializer(many=True)
    total_countries = serializers.IntegerField()
    total_tours = serializers.IntegerField()
