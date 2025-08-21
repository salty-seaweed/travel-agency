from rest_framework import serializers
from .models import (
    PropertyType, Amenity, Location, Destination, Experience, PropertyImage, Property, Package, PackageImage, Review, 
    Booking, Availability, Customer, Page, PageBlock, MediaAsset, Menu, MenuItem, 
    Redirect, PageVersion, PageReview, CommentThread, Comment, PackageItinerary, PackageInclusion, 
    PackageActivity, PackageDestination, TransferType, AtollTransfer, ResortTransfer, TransferFAQ,
    TransferContactMethod, TransferBookingStep, TransferBenefit, TransferPricingFactor, TransferContent, FerrySchedule,
    HomepageHero, HomepageFeature, HomepageTestimonial, HomepageStatistic, HomepageCTASection, HomepageSettings, HomepageContent, HomepageImage
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

class DestinationSerializer(serializers.ModelSerializer):
    property_count = serializers.SerializerMethodField()
    package_count = serializers.SerializerMethodField()
    
    class Meta:
        model = Destination
        fields = '__all__'
    
    def get_property_count(self, obj):
        """Calculate property count dynamically"""
        from .models import Property
        return Property.objects.filter(
            location__island__iexact=obj.island
        ).count()
    
    def get_package_count(self, obj):
        """Calculate package count dynamically"""
        from .models import Package
        return Package.objects.filter(
            properties__location__island__iexact=obj.island
        ).distinct().count()

class ExperienceSerializer(serializers.ModelSerializer):
    location = LocationSerializer(read_only=True)
    location_id = serializers.PrimaryKeyRelatedField(queryset=Location.objects.all(), source='location', write_only=True)
    destination = DestinationSerializer(read_only=True)
    destination_id = serializers.PrimaryKeyRelatedField(queryset=Destination.objects.all(), source='destination', write_only=True, required=False)
    
    class Meta:
        model = Experience
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
    parent = serializers.PrimaryKeyRelatedField(queryset=Page.objects.all(), required=False, allow_null=True)
    parent_title = serializers.ReadOnlyField(source='parent.title')
    children_count = serializers.SerializerMethodField()
    versions_count = serializers.SerializerMethodField()
    reviews_count = serializers.SerializerMethodField()
    full_url = serializers.SerializerMethodField()
    
    class Meta:
        model = Page
        fields = [
            'id', 'title', 'slug', 'content', 'meta_description', 'meta_keywords',
            'status', 'locale', 'is_home', 'template', 'path',
            'seo_title', 'seo_description', 'canonical_url', 'robots', 'json_ld',
            'og_title', 'og_description', 'og_image',
            'publish_at', 'unpublish_at', 'parent', 'parent_title',
            'created_by', 'updated_by', 'created_at', 'updated_at', 'version',
            'blocks', 'children_count', 'versions_count', 'reviews_count', 'full_url',
            'notes'
        ]
        read_only_fields = ['created_by', 'updated_by', 'version', 'created_at', 'updated_at', 'children_count', 'versions_count', 'reviews_count']

    def get_children_count(self, obj):
        return obj.children.count()

    def get_versions_count(self, obj):
        return obj.versions.count()

    def get_reviews_count(self, obj):
        return obj.reviews.count()

    def get_full_url(self, obj):
        return f"/{obj.slug}/"

    def validate_slug(self, value):
        """Validate slug uniqueness"""
        if self.instance:
            if Page.objects.filter(slug=value).exclude(id=self.instance.id).exists():
                raise serializers.ValidationError("A page with this slug already exists.")
        else:
            if Page.objects.filter(slug=value).exists():
                raise serializers.ValidationError("A page with this slug already exists.")
        return value

    def validate(self, data):
        """Custom validation"""
        # Auto-generate slug from title if not provided
        if not data.get('slug') and data.get('title'):
            data['slug'] = self.generate_slug(data['title'])
        
        # Auto-generate path if not provided
        if not data.get('path') and data.get('slug'):
            data['path'] = f"/{data['slug']}/"
        
        # Validate publish/unpublish dates
        if data.get('publish_at') and data.get('unpublish_at'):
            if data['publish_at'] >= data['unpublish_at']:
                raise serializers.ValidationError("Publish date must be before unpublish date.")
        
        return data

    def generate_slug(self, title):
        """Generate URL-friendly slug from title"""
        import re
        slug = title.lower()
        slug = re.sub(r'[^a-z0-9\s-]', '', slug)
        slug = re.sub(r'\s+', '-', slug)
        slug = re.sub(r'-+', '-', slug)
        slug = slug.strip('-')
        
        # Ensure uniqueness
        base_slug = slug
        counter = 1
        while Page.objects.filter(slug=slug).exists():
            slug = f"{base_slug}-{counter}"
            counter += 1
        
        return slug

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

class PageDetailSerializer(PageSerializer):
    """Detailed page serializer with all related data"""
    blocks = PageBlockSerializer(many=True, read_only=True)
    versions = PageVersionSerializer(many=True, read_only=True)
    reviews = PageReviewSerializer(many=True, read_only=True)
    children = serializers.SerializerMethodField()
    
    def get_children(self, obj):
        children = obj.children.all()
        return PageSerializer(children, many=True).data

class PageCreateSerializer(PageSerializer):
    """Serializer for creating new pages"""
    class Meta(PageSerializer.Meta):
        fields = [
            'title', 'slug', 'content', 'meta_description', 'meta_keywords',
            'status', 'locale', 'template', 'seo_title', 'seo_description',
            'canonical_url', 'robots', 'og_title', 'og_description',
            'publish_at', 'unpublish_at', 'parent', 'notes'
        ]

class PageUpdateSerializer(PageSerializer):
    """Serializer for updating existing pages"""
    class Meta(PageSerializer.Meta):
        fields = [
            'title', 'slug', 'content', 'meta_description', 'meta_keywords',
            'status', 'locale', 'template', 'seo_title', 'seo_description',
            'canonical_url', 'robots', 'og_title', 'og_description',
            'publish_at', 'unpublish_at', 'parent', 'notes'
        ]

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

class HomepageImageSerializer(serializers.ModelSerializer):
    """Serializer for homepage images"""
    image_url = serializers.SerializerMethodField()
    
    class Meta:
        model = HomepageImage
        fields = '__all__'
    
    def get_image_url(self, obj):
        if obj.image:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.image.url)
            return obj.image.url
        return None

class HomepageHeroSerializer(serializers.ModelSerializer):
    """Serializer for homepage hero section"""
    background_image_url = serializers.SerializerMethodField()
    
    class Meta:
        model = HomepageHero
        fields = '__all__'
    
    def get_background_image_url(self, obj):
        if obj.background_image:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.background_image.url)
            return obj.background_image_url
        return obj.background_image_url


class HomepageFeatureSerializer(serializers.ModelSerializer):
    """Serializer for homepage features"""
    image_url = serializers.SerializerMethodField()
    
    class Meta:
        model = HomepageFeature
        fields = '__all__'
    
    def get_image_url(self, obj):
        if obj.image:
            return self.context['request'].build_absolute_uri(obj.image.url)
        return obj.image_url


class HomepageTestimonialSerializer(serializers.ModelSerializer):
    """Serializer for homepage testimonials"""
    avatar_url = serializers.SerializerMethodField()
    
    class Meta:
        model = HomepageTestimonial
        fields = '__all__'
    
    def get_avatar_url(self, obj):
        if obj.avatar:
            return self.context['request'].build_absolute_uri(obj.avatar.url)
        return obj.avatar_url


class HomepageStatisticSerializer(serializers.ModelSerializer):
    """Serializer for homepage statistics"""
    
    class Meta:
        model = HomepageStatistic
        fields = '__all__'


class HomepageCTASectionSerializer(serializers.ModelSerializer):
    """Serializer for homepage CTA section"""
    background_image_url = serializers.SerializerMethodField()
    
    class Meta:
        model = HomepageCTASection
        fields = '__all__'
    
    def get_background_image_url(self, obj):
        if obj.background_image:
            return self.context['request'].build_absolute_uri(obj.background_image.url)
        return obj.background_image_url


class HomepageSettingsSerializer(serializers.ModelSerializer):
    """Serializer for homepage settings"""
    
    class Meta:
        model = HomepageSettings
        fields = '__all__'


class HomepageContentSerializer(serializers.ModelSerializer):
    """Serializer for homepage content sections"""
    
    class Meta:
        model = HomepageContent
        fields = '__all__'


class HomepageDataSerializer(serializers.Serializer):
    """Combined serializer for all homepage data"""
    hero = HomepageHeroSerializer()
    features = HomepageFeatureSerializer(many=True)
    testimonials = HomepageTestimonialSerializer(many=True)
    statistics = HomepageStatisticSerializer(many=True)
    cta_section = HomepageCTASectionSerializer()
    settings = HomepageSettingsSerializer()


class FerryScheduleSerializer(serializers.ModelSerializer):
    """Serializer for ferry schedules"""
    
    class Meta:
        model = FerrySchedule
        fields = '__all__' 