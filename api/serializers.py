from rest_framework import serializers
from .models import (
    PropertyType, Amenity, Location, PropertyImage, Property, Package, PackageImage, Review, 
    Booking, Availability, Customer, Page, PageBlock, MediaAsset, Menu, MenuItem, 
    Redirect, PageVersion, PageReview, CommentThread, Comment, PackageItinerary, PackageInclusion, 
    PackageActivity, PackageDestination, TransferType, AtollTransfer, ResortTransfer, TransferFAQ,
    TransferContactMethod, TransferBookingStep, TransferBenefit, TransferPricingFactor, TransferContent
)

class PropertyTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = PropertyType
        fields = '__all__'

class AmenitySerializer(serializers.ModelSerializer):
    class Meta:
        model = Amenity
        fields = '__all__'

class LocationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Location
        fields = '__all__'

class PropertyImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = PropertyImage
        fields = '__all__'

class PropertySerializer(serializers.ModelSerializer):
    property_type = PropertyTypeSerializer(read_only=True)
    property_type_id = serializers.PrimaryKeyRelatedField(queryset=PropertyType.objects.all(), source='property_type', write_only=True, required=False)
    location = LocationSerializer(read_only=True)
    location_id = serializers.PrimaryKeyRelatedField(queryset=Location.objects.all(), source='location', write_only=True, required=False)
    amenities = AmenitySerializer(many=True, read_only=True)
    amenity_ids = serializers.PrimaryKeyRelatedField(queryset=Amenity.objects.all(), many=True, source='amenities', write_only=True, required=False)
    images = PropertyImageSerializer(many=True, read_only=True)
    reviews = serializers.PrimaryKeyRelatedField(many=True, read_only=True)
    packages = serializers.PrimaryKeyRelatedField(many=True, read_only=True)

    class Meta:
        model = Property
        fields = '__all__'

class PackageImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = PackageImage
        fields = '__all__'

class PackageItinerarySerializer(serializers.ModelSerializer):
    class Meta:
        model = PackageItinerary
        fields = '__all__'

class PackageInclusionSerializer(serializers.ModelSerializer):
    class Meta:
        model = PackageInclusion
        fields = '__all__'

class PackageActivitySerializer(serializers.ModelSerializer):
    class Meta:
        model = PackageActivity
        fields = '__all__'

class PackageDestinationSerializer(serializers.ModelSerializer):
    location = LocationSerializer(read_only=True)
    location_id = serializers.PrimaryKeyRelatedField(queryset=Location.objects.all(), source='location', write_only=True)
    
    class Meta:
        model = PackageDestination
        fields = '__all__'

class PackageSerializer(serializers.ModelSerializer):
    properties = PropertySerializer(many=True, read_only=True)
    property_ids = serializers.PrimaryKeyRelatedField(queryset=Property.objects.all(), many=True, source='properties', write_only=True, required=False)
    images = PackageImageSerializer(many=True, read_only=True)
    itinerary = PackageItinerarySerializer(many=True, read_only=True)
    inclusions = PackageInclusionSerializer(many=True, read_only=True)
    activities = PackageActivitySerializer(many=True, read_only=True)
    destinations = PackageDestinationSerializer(many=True, read_only=True)
    
    class Meta:
        model = Package
        fields = '__all__'

class ReviewSerializer(serializers.ModelSerializer):
    class Meta:
        model = Review
        fields = '__all__'

# New Booking Serializers
class CustomerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Customer
        fields = '__all__'

class AvailabilitySerializer(serializers.ModelSerializer):
    property = PropertySerializer(read_only=True)
    property_id = serializers.PrimaryKeyRelatedField(queryset=Property.objects.all(), source='property_obj', write_only=True)
    
    class Meta:
        model = Availability
        fields = '__all__'

class BookingSerializer(serializers.ModelSerializer):
    property = PropertySerializer(read_only=True)
    property_id = serializers.PrimaryKeyRelatedField(queryset=Property.objects.all(), source='property_obj', write_only=True)
    customer = CustomerSerializer(read_only=True)
    
    class Meta:
        model = Booking
        fields = '__all__'
        read_only_fields = ('total_price', 'status', 'created_at', 'updated_at')

class BookingCreateSerializer(serializers.ModelSerializer):
    property_id = serializers.PrimaryKeyRelatedField(queryset=Property.objects.all(), source='property_obj')
    
    class Meta:
        model = Booking
        fields = [
            'property_id', 'customer_name', 'customer_email', 'customer_phone',
            'check_in_date', 'check_out_date', 'number_of_guests', 'special_requests'
        ]
    
    def validate(self, data):
        # Check if dates are valid
        if data['check_in_date'] >= data['check_out_date']:
            raise serializers.ValidationError("Check-out date must be after check-in date")
        
        # Check if property is available for the selected dates
        property_obj = data['property_obj']
        check_in = data['check_in_date']
        check_out = data['check_out_date']
        
        # Check for existing bookings that overlap
        overlapping_bookings = Booking.objects.filter(
            property_obj=property_obj,
            status__in=['pending', 'confirmed'],
            check_in_date__lt=check_out,
            check_out_date__gt=check_in
        )
        
        if overlapping_bookings.exists():
            raise serializers.ValidationError("Property is not available for the selected dates")
        
        # Calculate total price
        nights = (check_out - check_in).days
        total_price = property_obj.price_per_night * nights
        data['total_price'] = total_price
        
        return data

class BookingStatusUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Booking
        fields = ['status']

# CMS Serializers
class PageBlockSerializer(serializers.ModelSerializer):
    class Meta:
        model = PageBlock
        fields = '__all__'

class PageSerializer(serializers.ModelSerializer):
    blocks = PageBlockSerializer(many=True, read_only=True)
    created_by = serializers.ReadOnlyField(source='created_by.username')
    updated_by = serializers.ReadOnlyField(source='updated_by.username')
    
    class Meta:
        model = Page
        fields = '__all__'
        read_only_fields = ['created_by', 'updated_by', 'version', 'created_at', 'updated_at']

class MediaAssetSerializer(serializers.ModelSerializer):
    created_by = serializers.ReadOnlyField(source='created_by.username')
    
    class Meta:
        model = MediaAsset
        fields = '__all__'
        read_only_fields = ['id', 'file_url', 'thumbnail_url', 'usage_count', 'created_at', 'mime_type']
    
    def create(self, validated_data):
        file_obj = validated_data.get('file')
        if file_obj:
            validated_data['mime_type'] = file_obj.content_type
        return super().create(validated_data)
    
    def update(self, instance, validated_data):
        file_obj = validated_data.get('file')
        if file_obj:
            validated_data['mime_type'] = file_obj.content_type
        return super().update(instance, validated_data)

class MenuItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = MenuItem
        fields = '__all__'

class MenuSerializer(serializers.ModelSerializer):
    items = MenuItemSerializer(many=True, read_only=True)
    
    class Meta:
        model = Menu
        fields = '__all__'

class RedirectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Redirect
        fields = '__all__'

class PageVersionSerializer(serializers.ModelSerializer):
    created_by = serializers.ReadOnlyField(source='created_by.username')
    
    class Meta:
        model = PageVersion
        fields = '__all__'
        read_only_fields = ['created_by', 'created_at']

class PageReviewSerializer(serializers.ModelSerializer):
    reviewer = serializers.ReadOnlyField(source='reviewer.username')
    
    class Meta:
        model = PageReview
        fields = '__all__'
        read_only_fields = ['reviewer', 'created_at']

class CommentSerializer(serializers.ModelSerializer):
    author = serializers.ReadOnlyField(source='author.username')
    
    class Meta:
        model = Comment
        fields = '__all__'

# Transportation Serializers
class TransferTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = TransferType
        fields = '__all__'

class ResortTransferSerializer(serializers.ModelSerializer):
    atoll = serializers.StringRelatedField()
    
    class Meta:
        model = ResortTransfer
        fields = '__all__'

class AtollTransferSerializer(serializers.ModelSerializer):
    resorts = ResortTransferSerializer(many=True, read_only=True)
    
    class Meta:
        model = AtollTransfer
        fields = '__all__'

class TransferFAQSerializer(serializers.ModelSerializer):
    class Meta:
        model = TransferFAQ
        fields = '__all__'

class TransferContactMethodSerializer(serializers.ModelSerializer):
    class Meta:
        model = TransferContactMethod
        fields = '__all__'

class TransferBookingStepSerializer(serializers.ModelSerializer):
    class Meta:
        model = TransferBookingStep
        fields = '__all__'

class TransferBenefitSerializer(serializers.ModelSerializer):
    class Meta:
        model = TransferBenefit
        fields = '__all__'

class TransferPricingFactorSerializer(serializers.ModelSerializer):
    class Meta:
        model = TransferPricingFactor
        fields = '__all__'

class TransferContentSerializer(serializers.ModelSerializer):
    class Meta:
        model = TransferContent
        fields = '__all__'
        read_only_fields = ['author', 'created_at', 'updated_at']

class CommentThreadSerializer(serializers.ModelSerializer):
    comments = CommentSerializer(many=True, read_only=True)
    created_by = serializers.ReadOnlyField(source='created_by.username')
    
    class Meta:
        model = CommentThread
        fields = '__all__'
        read_only_fields = ['created_by', 'created_at'] 