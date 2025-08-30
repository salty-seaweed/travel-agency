from rest_framework import serializers
from .models import (
    PropertyType, Amenity, Location, Destination, Experience, PropertyImage, Property, Package, PackageImage, Review, 
    Booking, Availability, Customer, Page, PageBlock, MediaAsset, Menu, MenuItem, 
    Redirect, PageVersion, PageReview, CommentThread, Comment, PackageItinerary, PackageInclusion, 
    PackageActivity, PackageDestination, TransferType, AtollTransfer, ResortTransfer, TransferFAQ,
    TransferContactMethod, TransferBookingStep, TransferBenefit, TransferPricingFactor, TransferContent, FerrySchedule,
    HomepageHero, HomepageFeature, HomepageTestimonial, HomepageStatistic, HomepageCTASection, HomepageSettings, HomepageContent, HomepageImage,
    PageHero, Language, TranslationKey, Translation, CulturalContent, RegionalSettings, LocalizedPage, LocalizedFAQ,
    AboutPageContent, AboutPageValue, AboutPageStatistic, FeaturedDestination
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
            destinations__location__island__iexact=obj.island
        ).distinct().count()


class PageHeroSerializer(serializers.ModelSerializer):
    image_url = serializers.SerializerMethodField()

    class Meta:
        model = PageHero
        fields = [
            'id', 'page_key', 'title', 'subtitle', 'background_image', 'background_image_url',
            'image_url', 'overlay_opacity', 'is_active', 'created_at', 'updated_at'
        ]

    def get_image_url(self, obj):
        request = self.context.get('request')
        url = obj.image_url
        if request and url and url.startswith('/'):
            return request.build_absolute_uri(url)
        return url

class ExperienceSerializer(serializers.ModelSerializer):
    destination = DestinationSerializer(read_only=True)
    destination_id = serializers.PrimaryKeyRelatedField(queryset=Destination.objects.all(), source='destination', write_only=True)
    
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


    class Meta:
        model = Property
        fields = '__all__'

class PackageImageSerializer(serializers.ModelSerializer):
    image_url = serializers.SerializerMethodField(read_only=True)
    package_id = serializers.IntegerField(write_only=True, required=False)
    
    class Meta:
        model = PackageImage
        fields = ['id', 'package', 'image', 'caption', 'order', 'is_featured', 'image_url', 'package_id']
        extra_kwargs = {
            'package': {'required': False}  # Make package field not required during creation
        }

    def get_image_url(self, obj):
        request = self.context.get('request') if hasattr(self, 'context') else None
        try:
            url = obj.image.url
        except Exception:
            return None
        if request and url and url.startswith('/'):
            return request.build_absolute_uri(url)
        return url

class PackageItinerarySerializer(serializers.ModelSerializer):
    # Computed linkage: enrich plain string activities with matching PackageActivity details
    experience_details = serializers.SerializerMethodField(read_only=True)
    # Optional: allow posting explicit activity ids for a day without schema changes
    activity_ids = serializers.ListField(write_only=True, required=False)

    class Meta:
        model = PackageItinerary
        fields = '__all__'

    def get_experience_details(self, obj):
        try:
            # Try to match itinerary activities (strings) with PackageActivity of the same package
            package_obj = obj.package
            name_set = set([a.strip().lower() for a in (obj.activities or []) if isinstance(a, str)])
            activities_qs = package_obj.activities.all()
            matched = []
            request = self.context.get('request') if isinstance(self.context, dict) else None
            from .models import Experience
            for act in activities_qs:
                if (act.name or '').strip().lower() in name_set:
                    detail = {
                        'id': act.id,
                        'name': act.name,
                        'description': act.description,
                        'duration': act.duration,
                        'difficulty': act.difficulty,
                        'category': act.category,
                        'included': act.included,
                        'price': act.price,
                    }
                    # Try to enrich with Experience image by name match (best-effort)
                    try:
                        exp = Experience.objects.filter(name__iexact=act.name).first()
                        if exp and exp.image:
                            img_url = exp.image.url
                            if request:
                                try:
                                    img_url = request.build_absolute_uri(img_url)
                                except Exception:
                                    pass
                            detail['image'] = img_url
                    except Exception:
                        pass
                    matched.append(detail)
            return matched
        except Exception:
            return []

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

class PackageSerializerI18n(serializers.ModelSerializer):
    images = PackageImageSerializer(many=True, read_only=True)
    itinerary = PackageItinerarySerializer(many=True, read_only=True)
    inclusions = PackageInclusionSerializer(many=True, read_only=True)
    activities = PackageActivitySerializer(many=True, read_only=True)
    destinations = PackageDestinationSerializer(many=True, read_only=True)
    experiences = serializers.SerializerMethodField(read_only=True)
    # Accept experiences from the admin form and map them to PackageActivity(category='experience')
    experiences_write = serializers.ListField(write_only=True, required=False, source='experiences')
    destination_data = serializers.ListField(write_only=True, required=False)
    itinerary_data = serializers.ListField(write_only=True, required=False)
    inclusions_data = serializers.ListField(write_only=True, required=False)
    activities_data = serializers.ListField(write_only=True, required=False)
    
    class Meta:
        model = Package
        fields = '__all__'
    
    def get_experiences(self, obj):
        exp_qs = obj.activities.filter(category='experience')
        return [
            {
                'id': a.id,
                'name': a.name,
                'description': a.description,
                'duration': a.duration,
                'difficulty': a.difficulty,
                'included': a.included,
                'price': a.price,
                'category': a.category,
            }
            for a in exp_qs
        ]

    def create(self, validated_data):
        # Support both *_data keys and plain plural names
        destination_data = validated_data.pop('destination_data', [])
        itinerary_data = validated_data.pop('itinerary_data', [])
        inclusions_data = validated_data.pop('inclusions_data', [])
        activities_data = validated_data.pop('activities_data', [])
        # Accept experiences even if not in validated_data (because 'experiences' is read-only field)
        experiences_data = validated_data.pop('experiences', [])
        if not experiences_data:
            try:
                experiences_data = self.initial_data.get('experiences', [])
            except Exception:
                experiences_data = []
        package = super().create(validated_data)
        
        # Create PackageDestination objects
        for dest_data in destination_data:
            PackageDestination.objects.create(package=package, **dest_data)
        
        # Create inclusions rows
        for inc in inclusions_data:
            PackageInclusion.objects.create(
                package=package,
                category=inc.get('category', 'included'),
                item=inc.get('item', ''),
                description=inc.get('description', ''),
                icon=inc.get('icon', ''),
            )
        
        # Create activities rows FIRST so itinerary can reference activity_ids
        for act in activities_data:
            PackageActivity.objects.create(
                package=package,
                name=act.get('name', ''),
                description=act.get('description', ''),
                duration=act.get('duration', ''),
                difficulty=act.get('difficulty', 'easy'),
                category=act.get('category', ''),
                included=bool(act.get('included', True)),
                price=str(act.get('price') or ''),
            )

        # Map experiences to activities with category 'experience'
        for exp in experiences_data or []:
            if isinstance(exp, dict):
                name = exp.get('name') or exp.get('title') or str(exp.get('id') or '')
                description = exp.get('description', '')
                duration = exp.get('duration', '')
            else:
                name = str(exp)
                description = ''
                duration = ''
            if name:
                PackageActivity.objects.create(
                    package=package,
                    name=name,
                    description=description,
                    duration=duration,
                    difficulty='easy',
                    category='experience',
                    included=True,
                    price='',
                )
        
        # Now create itinerary rows (activity_ids can resolve)
        for item in itinerary_data:
            # Support linkage by activity_ids → convert to names for storage (backward compatible)
            activities_names = item.get('activities', []) or []
            activity_ids = item.get('activity_ids') or []
            if activity_ids:
                try:
                    acts = list(PackageActivity.objects.filter(package=package, id__in=activity_ids))
                    if acts:
                        activities_names = [a.name for a in acts if a and a.name]
                    else:
                        # Fallback: treat ids as 1-based indices into activities_data (same request)
                        tmp_names = []
                        for tmp_id in activity_ids:
                            idx = int(tmp_id) - 1
                            if 0 <= idx < len(activities_data or []):
                                nm = (activities_data[idx] or {}).get('name')
                                if nm:
                                    tmp_names.append(nm)
                        if tmp_names:
                            activities_names = tmp_names
                except Exception:
                    pass
            PackageItinerary.objects.create(
                package=package,
                day=item.get('day') or 1,
                title=item.get('title', ''),
                description=item.get('description', ''),
                activities=activities_names,
                meals=item.get('meals', []) or [],
                accommodation=item.get('accommodation', ''),
                transportation=item.get('transportation', ''),
            )

        return package
    
    def update(self, instance, validated_data):
        destination_data = validated_data.pop('destination_data', [])
        itinerary_data = validated_data.pop('itinerary_data', None)
        inclusions_data = validated_data.pop('inclusions_data', None)
        activities_data = validated_data.pop('activities_data', None)
        experiences_data = validated_data.pop('experiences', None)
        if experiences_data is None:
            try:
                experiences_data = self.initial_data.get('experiences', None)
            except Exception:
                experiences_data = None
        package = super().update(instance, validated_data)
        
        # Clear existing destinations and create new ones
        if destination_data:
            PackageDestination.objects.filter(package=package).delete()
            for dest_data in destination_data:
                PackageDestination.objects.create(package=package, **dest_data)
        
        # Replace itinerary if provided
        if itinerary_data is not None:
            PackageItinerary.objects.filter(package=package).delete()
            for item in itinerary_data:
                activities_names = item.get('activities', []) or []
                activity_ids = item.get('activity_ids') or []
                if activity_ids:
                    try:
                        acts = PackageActivity.objects.filter(id__in=activity_ids)
                        activities_names = [a.name for a in acts if a and a.name]
                    except Exception:
                        pass
                PackageItinerary.objects.create(
                    package=package,
                    day=item.get('day') or 1,
                    title=item.get('title', ''),
                    description=item.get('description', ''),
                    activities=activities_names,
                    meals=item.get('meals', []) or [],
                    accommodation=item.get('accommodation', ''),
                    transportation=item.get('transportation', ''),
                )
        
        # Replace inclusions if provided
        if inclusions_data is not None:
            PackageInclusion.objects.filter(package=package).delete()
            for inc in inclusions_data:
                PackageInclusion.objects.create(
                    package=package,
                    category=inc.get('category', 'included'),
                    item=inc.get('item', ''),
                    description=inc.get('description', ''),
                    icon=inc.get('icon', ''),
                )
        
        # Replace activities if provided
        if activities_data is not None:
            # Keep experiences separate; wipe only non-experience rows
            PackageActivity.objects.filter(package=package).exclude(category='experience').delete()
            for act in activities_data:
                PackageActivity.objects.create(
                    package=package,
                    name=act.get('name', ''),
                    description=act.get('description', ''),
                    duration=act.get('duration', ''),
                    difficulty=act.get('difficulty', 'easy'),
                    category=act.get('category', ''),
                    included=bool(act.get('included', True)),
                    price=str(act.get('price') or ''),
                )

        # Replace experiences if provided
        if experiences_data is not None:
            PackageActivity.objects.filter(package=package, category='experience').delete()
            for exp in experiences_data or []:
                if isinstance(exp, dict):
                    name = exp.get('name') or exp.get('title') or str(exp.get('id') or '')
                    description = exp.get('description', '')
                    duration = exp.get('duration', '')
                else:
                    name = str(exp)
                    description = ''
                    duration = ''
                if name:
                    PackageActivity.objects.create(
                        package=package,
                        name=name,
                        description=description,
                        duration=duration,
                        difficulty='easy',
                        category='experience',
                        included=True,
                        price='',
                    )
        
        return package

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

# Internationalization Serializers

class LanguageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Language
        fields = '__all__'


class TranslationKeySerializer(serializers.ModelSerializer):
    class Meta:
        model = TranslationKey
        fields = '__all__'


class TranslationSerializer(serializers.ModelSerializer):
    key_name = serializers.CharField(source='key.key', read_only=True)
    language_name = serializers.CharField(source='language.name', read_only=True)
    language_code = serializers.CharField(source='language.code', read_only=True)

    class Meta:
        model = Translation
        fields = '__all__'


class CulturalContentSerializer(serializers.ModelSerializer):
    language_name = serializers.CharField(source='language.name', read_only=True)
    language_code = serializers.CharField(source='language.code', read_only=True)

    class Meta:
        model = CulturalContent
        fields = '__all__'


class RegionalSettingsSerializer(serializers.ModelSerializer):
    language_name = serializers.CharField(source='language.name', read_only=True)
    language_code = serializers.CharField(source='language.code', read_only=True)

    class Meta:
        model = RegionalSettings
        fields = '__all__'


class LocalizedPageSerializer(serializers.ModelSerializer):
    language_name = serializers.CharField(source='language.name', read_only=True)
    language_code = serializers.CharField(source='language.code', read_only=True)

    class Meta:
        model = LocalizedPage
        fields = '__all__'


class LocalizedFAQSerializer(serializers.ModelSerializer):
    language_name = serializers.CharField(source='language.name', read_only=True)
    language_code = serializers.CharField(source='language.code', read_only=True)

    class Meta:
        model = LocalizedFAQ
        fields = '__all__'


# Enhanced serializers with internationalization support

class DestinationSerializer(serializers.ModelSerializer):
    # Include localized fields
    localized_name = serializers.CharField(read_only=True)
    localized_description = serializers.CharField(read_only=True)
    
    class Meta:
        model = Destination
        fields = '__all__'


class PackageSerializer(serializers.ModelSerializer):
    # Include localized fields
    localized_name = serializers.CharField(read_only=True)
    localized_description = serializers.CharField(read_only=True)
    localized_highlights = serializers.ListField(read_only=True)
    localized_included = serializers.ListField(read_only=True)
    
    class Meta:
        model = Package
        fields = '__all__'


class PropertySerializerI18n(serializers.ModelSerializer):
    # Include localized fields
    localized_name = serializers.CharField(read_only=True)
    localized_description = serializers.CharField(read_only=True)
    localized_amenities = serializers.ListField(read_only=True)
    
    class Meta:
        model = Property
        fields = '__all__'


# Translation management serializers

class TranslationBulkSerializer(serializers.Serializer):
    """Serializer for bulk translation operations"""
    language_code = serializers.CharField(max_length=10)
    translations = serializers.DictField(
        child=serializers.CharField(),
        help_text="Dictionary of translation keys and values"
    )


class TranslationExportSerializer(serializers.Serializer):
    """Serializer for exporting translations"""
    language_code = serializers.CharField(max_length=10)
    format = serializers.ChoiceField(choices=['json', 'csv', 'xlsx'], default='json')


class TranslationImportSerializer(serializers.Serializer):
    """Serializer for importing translations"""
    language_code = serializers.CharField(max_length=10)
    file = serializers.FileField(help_text="Translation file to import")
    format = serializers.ChoiceField(choices=['json', 'csv', 'xlsx'], default='json')
    overwrite = serializers.BooleanField(default=False, help_text="Whether to overwrite existing translations")


# Cultural content management serializers

class CulturalContentBulkSerializer(serializers.Serializer):
    """Serializer for bulk cultural content operations"""
    language_code = serializers.CharField(max_length=10)
    content_type = serializers.CharField(max_length=50)
    content_items = serializers.ListField(
        child=serializers.DictField(),
        help_text="List of cultural content items"
    )


# Regional settings management serializers

class RegionalSettingsBulkSerializer(serializers.Serializer):
    """Serializer for bulk regional settings operations"""
    settings = serializers.ListField(
        child=serializers.DictField(),
        help_text="List of regional settings for different languages"
    )


# Language detection and preference serializers

class LanguageDetectionSerializer(serializers.Serializer):
    """Serializer for language detection"""
    text = serializers.CharField(help_text="Text to detect language for")
    confidence_threshold = serializers.FloatField(default=0.8, help_text="Minimum confidence threshold")


class UserLanguagePreferenceSerializer(serializers.Serializer):
    """Serializer for user language preferences"""
    preferred_language = serializers.CharField(max_length=10, help_text="User's preferred language code")
    fallback_language = serializers.CharField(max_length=10, required=False, help_text="Fallback language code")
    auto_detect = serializers.BooleanField(default=True, help_text="Whether to auto-detect language")


# Translation statistics and analytics serializers

class TranslationStatsSerializer(serializers.Serializer):
    """Serializer for translation statistics"""
    language_code = serializers.CharField(max_length=10)
    total_keys = serializers.IntegerField()
    translated_keys = serializers.IntegerField()
    approved_keys = serializers.IntegerField()
    pending_keys = serializers.IntegerField()
    completion_percentage = serializers.FloatField()
    last_updated = serializers.DateTimeField()


class TranslationAnalyticsSerializer(serializers.Serializer):
    """Serializer for translation analytics"""
    period = serializers.ChoiceField(choices=['day', 'week', 'month', 'year'], default='month')
    language_codes = serializers.ListField(
        child=serializers.CharField(max_length=10),
        required=False,
        help_text="Specific language codes to analyze"
    )
    metrics = serializers.ListField(
        child=serializers.CharField(),
        default=['completion', 'accuracy', 'usage'],
        help_text="Metrics to include in analytics"
    )


# About Page Serializers

class AboutPageContentSerializer(serializers.ModelSerializer):
    """Serializer for About page content sections"""
    image_url = serializers.SerializerMethodField()
    
    class Meta:
        model = AboutPageContent
        fields = '__all__'
    
    def get_image_url(self, obj):
        if obj.image:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.image.url)
            return obj.image.url
        return obj.image_url


class AboutPageValueSerializer(serializers.ModelSerializer):
    """Serializer for About page values"""
    
    class Meta:
        model = AboutPageValue
        fields = '__all__'


class AboutPageStatisticSerializer(serializers.ModelSerializer):
    """Serializer for About page statistics"""
    
    class Meta:
        model = AboutPageStatistic
        fields = '__all__'


class AboutPageDataSerializer(serializers.Serializer):
    """Combined serializer for all About page data"""
    content_sections = AboutPageContentSerializer(many=True)
    values = AboutPageValueSerializer(many=True)
    statistics = AboutPageStatisticSerializer(many=True)


class FeaturedDestinationSerializer(serializers.ModelSerializer):
    """Serializer for featured destinations"""
    destination_name = serializers.CharField(source='destination.name', read_only=True)
    destination_island = serializers.CharField(source='destination.island', read_only=True)
    destination_atoll = serializers.CharField(source='destination.atoll', read_only=True)
    package_count = serializers.IntegerField(source='destination.package_count', read_only=True)
    display_name = serializers.CharField(read_only=True)
    display_image = serializers.CharField(read_only=True)
    image_url = serializers.SerializerMethodField()
    
    class Meta:
        model = FeaturedDestination
        fields = '__all__'
    
    def get_image_url(self, obj):
        if obj.image:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.image.url)
            return obj.image.url
        elif obj.image_url:
            return obj.image_url
        elif obj.destination.image:
            request = self.context.get('request')
            if request and obj.destination.image:
                return request.build_absolute_uri(obj.destination.image.url)
            return obj.destination.image.url if obj.destination.image else None
        return None 