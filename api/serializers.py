from rest_framework import serializers
from django.core.files.base import ContentFile
import requests
import os
from .models import (
    PropertyType, Amenity, Location, Destination, Experience, PropertyImage, Property, Package, PackageImage, Review, 
    Booking, Availability, Customer, Page, PageBlock, MediaAsset, Menu, MenuItem, 
    Redirect, PageVersion, PageReview, CommentThread, Comment, PackageItinerary, PackageInclusion, 
    PackageActivity, PackageDestination, TransferType, AtollTransfer, ResortTransfer, TransferFAQ,
    TransferContactMethod, TransferBookingStep, TransferBenefit, TransferPricingFactor, TransferContent, FerrySchedule,
    HomepageHero, HomepageFeature, HomepageTestimonial, HomepageStatistic, HomepageCTASection, HomepageSettings, HomepageContent, HomepageImage,
    PageHero, Language, TranslationKey, Translation, CulturalContent, RegionalSettings, LocalizedPage, LocalizedFAQ,
    AboutPageContent, AboutPageValue, AboutPageStatistic, FeaturedDestination, PackageVariant,
    Resort, ResortImage, ResortReview, ResortAmenity, ResortRoomType,
    Boat, BoatImage, BoatActivity, BoatActivityImage, BoatPackage, BoatBooking, BoatReview, BoatAmenity,
    GalleryMedia
)

class FlexibleImageField(serializers.ImageField):
    """Custom image field that can handle both file uploads and URL strings"""
    
    def to_internal_value(self, data):
        if data is None:
            return None
            
        # If it's already a file object, use the parent method directly
        if hasattr(data, 'read') and hasattr(data, 'name'):
            return super().to_internal_value(data)
        
        # If it's a string (URL), download and create a file
        if isinstance(data, str):
            try:
                # Check if it's a URL
                if data.startswith('http') or data.startswith('/'):
                    # Download the image
                    response = requests.get(data, timeout=30)
                    response.raise_for_status()
                    
                    # Get filename from URL or use a default
                    filename = os.path.basename(data.split('?')[0])
                    if not filename or '.' not in filename:
                        filename = 'image.jpg'
                    
                    # Create a ContentFile from the downloaded data
                    content_file = ContentFile(response.content, name=filename)
                    return super().to_internal_value(content_file)
                else:
                    # It's a file path, return as is
                    return data
            except Exception as e:
                raise serializers.ValidationError(f"Invalid image URL: {str(e)}")
        
        # For any other type, use the parent method
        return super().to_internal_value(data)
    
    def to_representation(self, value):
        """Convert the image to a URL for API responses"""
        if not value:
            return None
        
        try:
            # Return the URL of the image
            return value.url if hasattr(value, 'url') else str(value)
        except Exception:
            return None

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
    image = FlexibleImageField(required=False, allow_null=True)
    
    class Meta:
        model = Destination
        fields = '__all__'
    
    def validate(self, data):
        """Custom validation for destination data"""
        # Ensure required fields are present
        required_fields = ['name', 'description', 'island', 'atoll']
        for field in required_fields:
            if not data.get(field):
                raise serializers.ValidationError(f"{field} is required")
        
        # Coordinates: allow floats; normalize empty strings to None
        for coord in ['latitude', 'longitude']:
            if coord in data and data[coord] in ['', None]:
                data[coord] = None
        
        # Validate image if provided
        if 'image' in data and data['image'] is not None:
            if not hasattr(data['image'], 'read') and not isinstance(data['image'], str):
                raise serializers.ValidationError("Image must be a file upload or valid URL")
        
        return data
    
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
    image = FlexibleImageField(required=False, allow_null=True)
    
    class Meta:
        model = Experience
        fields = '__all__'
    
    def validate(self, data):
        """Custom validation for experience data"""
        # Ensure required fields are present (check internal keys)
        required_internal_fields = ['name', 'description', 'experience_type', 'duration', 'price']
        for field in required_internal_fields:
            if not data.get(field):
                raise serializers.ValidationError(f"{field} is required")
        
        # Validate image if provided
        if 'image' in data and data['image'] is not None:
            if not hasattr(data['image'], 'read') and not isinstance(data['image'], str):
                raise serializers.ValidationError("Image must be a file upload or valid URL")
        
        # Validate price is positive
        if 'price' in data and data['price'] <= 0:
            raise serializers.ValidationError("Price must be greater than 0")
        
        return data

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
    video_url = serializers.SerializerMethodField(read_only=True)
    thumbnail_url = serializers.SerializerMethodField(read_only=True)
    package_id = serializers.IntegerField(write_only=True, required=True)
    image_url_field = serializers.URLField(write_only=True, required=False)  # For selecting from media library
    video_url_field = serializers.URLField(write_only=True, required=False)  # For selecting video from media library
    thumbnail_url_field = serializers.URLField(write_only=True, required=False)  # For selecting thumbnail from media library

    class Meta:
        model = PackageImage
        fields = [
            'id', 'package', 'media_type', 'image', 'video', 'video_thumbnail',
            'caption', 'order', 'is_featured', 'created_at', 'updated_at',
            'image_url', 'video_url', 'thumbnail_url', 'package_id',
            'image_url_field', 'video_url_field', 'thumbnail_url_field'
        ]
        extra_kwargs = {
            'package': {'required': False},  # Make package field not required during creation
            'image': {'required': False},    # Make image optional when using image_url_field
            'video': {'required': False},    # Make video optional when using video_url_field
            'video_thumbnail': {'required': False},  # Make thumbnail optional
        }

    def create(self, validated_data):
        """Custom create method to handle package_id, image, and video selection"""
        package_id = validated_data.pop('package_id', None)
        image_url_field = validated_data.pop('image_url_field', None)
        video_url_field = validated_data.pop('video_url_field', None)
        thumbnail_url_field = validated_data.pop('thumbnail_url_field', None)

        if not package_id:
            raise serializers.ValidationError({'package_id': 'This field is required.'})

        media_type = validated_data.get('media_type', 'image')

        # Validation based on media type
        if media_type == 'image':
            if not validated_data.get('image') and not image_url_field:
                raise serializers.ValidationError({'image': 'Either an image file or image URL must be provided for image media type.'})
        elif media_type == 'video':
            if not validated_data.get('video') and not video_url_field:
                raise serializers.ValidationError({'video': 'Either a video file or video URL must be provided for video media type.'})

        try:
            from .models import Package
            package = Package.objects.get(id=package_id)
            validated_data['package'] = package
        except Package.DoesNotExist:
            raise serializers.ValidationError({'package_id': 'Package not found.'})
        except (ValueError, TypeError):
            raise serializers.ValidationError({'package_id': 'Invalid package ID.'})

        # Store URL fields for the view to handle
        if image_url_field:
            validated_data['_image_url_field'] = image_url_field
        if video_url_field:
            validated_data['_video_url_field'] = video_url_field
        if thumbnail_url_field:
            validated_data['_thumbnail_url_field'] = thumbnail_url_field

        # Ensure proper type conversion for order and is_featured
        if 'order' in validated_data:
            try:
                validated_data['order'] = int(validated_data['order'])
            except (ValueError, TypeError):
                validated_data['order'] = 0

        if 'is_featured' in validated_data:
            if isinstance(validated_data['is_featured'], str):
                validated_data['is_featured'] = validated_data['is_featured'].lower() in ('true', '1', 'yes')
            elif not isinstance(validated_data['is_featured'], bool):
                validated_data['is_featured'] = bool(validated_data['is_featured'])

        return super().create(validated_data)

    def get_image_url(self, obj):
        request = self.context.get('request') if hasattr(self, 'context') else None
        try:
            url = obj.image.url
        except Exception:
            return None
        if request and url and url.startswith('/'):
            return request.build_absolute_uri(url)
        return url

    def get_video_url(self, obj):
        request = self.context.get('request') if hasattr(self, 'context') else None
        try:
            url = obj.video.url
        except Exception:
            return None
        if request and url and url.startswith('/'):
            return request.build_absolute_uri(url)
        return url

    def get_thumbnail_url(self, obj):
        request = self.context.get('request') if hasattr(self, 'context') else None
        try:
            # Use video thumbnail if available, otherwise fall back to image
            if obj.video_thumbnail:
                url = obj.video_thumbnail.url
            elif obj.image:
                url = obj.image.url
            else:
                return None
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

class PackageVariantSerializer(serializers.ModelSerializer):
    class Meta:
        model = PackageVariant
        fields = '__all__'

class PackageSerializerI18n(serializers.ModelSerializer):
    images = PackageImageSerializer(many=True, read_only=True)
    itinerary = PackageItinerarySerializer(many=True, read_only=True)
    inclusions = PackageInclusionSerializer(many=True, read_only=True)
    activities = PackageActivitySerializer(many=True, read_only=True)
    destinations = PackageDestinationSerializer(many=True, read_only=True)
    variants = PackageVariantSerializer(many=True, read_only=True)
    experiences = serializers.SerializerMethodField(read_only=True)
    # Accept experiences from the admin form and map them to PackageActivity(category='experience')
    experiences_write = serializers.ListField(write_only=True, required=False, source='experiences')
    destination_data = serializers.ListField(write_only=True, required=False)
    itinerary_data = serializers.ListField(write_only=True, required=False)
    inclusions_data = serializers.ListField(write_only=True, required=False)
    activities_data = serializers.ListField(write_only=True, required=False)

    def validate(self, data):
        """Add custom validation with debugging"""
        print(f"=== PackageSerializerI18n.validate START ===")
        print(f"PackageSerializerI18n.validate called with data keys: {list(data.keys())}")
        print(f"PackageSerializerI18n.validate data: {data}")

        # Validate required fields
        # Allow variants_data to replace top-level price/duration on create/update
        initial = getattr(self, 'initial_data', {}) or {}
        variants_payload = initial.get('variants_data') or initial.get('variants') or data.get('variants_data')
        has_variants_payload = bool(variants_payload)

        base_required_fields = ['name', 'description', 'group_size_min', 'group_size_max']
        legacy_price_fields = ['price', 'duration']
        required_fields = base_required_fields + ([] if has_variants_payload else legacy_price_fields)
        errors = {}

        for field in required_fields:
            if field not in data or data[field] is None or data[field] == '':
                errors[field] = f'This field is required.'

        if errors:
            print(f"PackageSerializerI18n validation errors: {errors}")
            raise serializers.ValidationError(errors)

        print("PackageSerializerI18n.validate - no validation errors found")
        print("=== PackageSerializerI18n.validate END ===")
        return data

    class Meta:
        model = Package
        exclude = ['language', 'localized_name', 'localized_description', 'localized_highlights', 'localized_included']

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
        print(f"PackageSerializerI18n.create called with validated_data keys: {list(validated_data.keys())}")
        print(f"PackageSerializerI18n.create initial_data keys: {list(self.initial_data.keys()) if hasattr(self, 'initial_data') else 'None'}")

        # Support both *_data keys and plain plural names
        destination_data = validated_data.pop('destination_data', [])
        itinerary_data = validated_data.pop('itinerary_data', [])
        inclusions_data = validated_data.pop('inclusions_data', [])
        activities_data = validated_data.pop('activities_data', [])
        variants_data = validated_data.pop('variants_data', [])
        # Accept experiences even if not in validated_data (because 'experiences' is read-only field)
        experiences_data = validated_data.pop('experiences', [])
        if not experiences_data:
            try:
                experiences_data = self.initial_data.get('experiences', [])
            except Exception:
                experiences_data = []
        # If variants provided, set legacy fields from default/cheapest to keep model valid
        if variants_data and (('price' not in validated_data) or ('duration' not in validated_data)):
            try:
                chosen = None
                for v in variants_data:
                    if v.get('is_default'):
                        chosen = v
                        break
                if not chosen and variants_data:
                    chosen = sorted(
                        [v for v in variants_data if v.get('price') not in (None, '')],
                        key=lambda x: float(x.get('price'))
                    )[0]
                if chosen:
                    validated_data.setdefault('price', chosen.get('price'))
                    validated_data.setdefault('duration', int(chosen.get('duration_days') or chosen.get('duration') or 1))
                    if chosen.get('original_price') not in (None, '', 'null'):
                        validated_data.setdefault('original_price', chosen.get('original_price'))
            except Exception as e:
                print(f"Failed to set legacy fields from variants pre-create: {e}")

        package = super().create(validated_data)

        # Create variants
        try:
            provided_variants = variants_data or getattr(self, 'initial_data', {}).get('variants_data') or getattr(self, 'initial_data', {}).get('variants') or []
        except Exception:
            provided_variants = []

        created_variants = []
        if provided_variants:
            default_index = None
            for idx, v in enumerate(provided_variants):
                try:
                    duration_days = v.get('duration_days') or v.get('duration') or v.get('duration_in_days')
                    price = v.get('price')
                    original_price = v.get('original_price')
                    is_default = bool(v.get('is_default'))
                    if duration_days is None or price in (None, ''):
                        continue
                    variant = PackageVariant.objects.create(
                        package=package,
                        duration_days=int(duration_days),
                        price=price,
                        original_price=original_price if original_price not in (None, '', 'null') else None,
                        is_default=is_default,
                    )
                    created_variants.append(variant)
                    if is_default:
                        default_index = idx
                except Exception as e:
                    print(f"Variant creation error: {e}")

            # Ensure exactly one default
            if created_variants:
                if default_index is None:
                    # Pick the lowest price as default
                    cheapest = min(created_variants, key=lambda x: float(x.price))
                    PackageVariant.objects.filter(pk__in=[v.pk for v in created_variants]).update(is_default=False)
                    cheapest.is_default = True
                    cheapest.save(update_fields=['is_default'])
        else:
            # Fallback to legacy single price/duration
            try:
                PackageVariant.objects.create(
                    package=package,
                    duration_days=int(package.duration or 1),
                    price=package.price,
                    original_price=package.original_price,
                    is_default=True,
                )
            except Exception as e:
                print(f"Default variant creation error: {e}")

        # Create PackageDestination objects with robust Location handling
        # Accept either a valid Location ID, a Destination ID (fallback), or raw location fields
        from .models import Location as LocationModel, Destination as DestinationModel

        for dest_data in destination_data:
            # Extract fields safely
            location_id = dest_data.get('location_id')
            island = dest_data.get('island') or dest_data.get('location_island')
            atoll = dest_data.get('atoll') or dest_data.get('location_atoll') or ''
            latitude = dest_data.get('latitude')
            longitude = dest_data.get('longitude')

            location_instance = None

            # 1) Try direct Location by ID
            if location_id:
                try:
                    location_instance = LocationModel.objects.get(id=location_id)
                except LocationModel.DoesNotExist:
                    # 2) Fallback: treat provided ID as Destination ID and upsert Location from it
                    try:
                        src_dest = DestinationModel.objects.get(id=location_id)
                        location_instance, _ = LocationModel.objects.get_or_create(
                            island=src_dest.island,
                            atoll=src_dest.atoll or '',
                            defaults={
                                'latitude': src_dest.latitude,
                                'longitude': src_dest.longitude,
                            }
                        )
                    except DestinationModel.DoesNotExist:
                        location_instance = None

            # 3) If still missing, create/find by raw fields
            if location_instance is None and island:
                location_instance, _ = LocationModel.objects.get_or_create(
                    island=island,
                    atoll=atoll,
                    defaults={
                        'latitude': latitude,
                        'longitude': longitude,
                    }
                )

            # If we still don't have a location, raise a clear validation error
            if location_instance is None:
                raise serializers.ValidationError({
                    'destination_data': 'Destination is missing a valid location. Provide location_id (Location or Destination), or island/atoll.'
                })

            # Build PackageDestination fields explicitly, ignoring non-model keys
            PackageDestination.objects.create(
                package=package,
                location=location_instance,
                duration=dest_data.get('duration') or 1,
                description=dest_data.get('description') or '',
                highlights=dest_data.get('highlights') or [],
                activities=dest_data.get('activities') or [],
            )
        
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
        variants_data = validated_data.pop('variants_data', None)
        experiences_data = validated_data.pop('experiences', None)
        if experiences_data is None:
            try:
                experiences_data = self.initial_data.get('experiences', None)
            except Exception:
                experiences_data = None
        package = super().update(instance, validated_data)

        # Handle variants upsert if provided (from validated_data or initial_data)
        if variants_data is None:
            try:
                variants_data = self.initial_data.get('variants_data') or self.initial_data.get('variants')
            except Exception:
                variants_data = None

        if variants_data is not None:
            default_set = False
            for v in variants_data:
                try:
                    vid = v.get('id')
                    payload = {
                        'duration_days': int(v.get('duration_days') or v.get('duration') or 0),
                        'price': v.get('price'),
                        'original_price': v.get('original_price') if v.get('original_price') not in (None, '', 'null') else None,
                        'is_default': bool(v.get('is_default')),
                    }
                    if not payload['duration_days'] or payload['price'] in (None, ''):
                        continue
                    if vid:
                        try:
                            variant = PackageVariant.objects.get(pk=vid, package=package)
                            for key, value in payload.items():
                                setattr(variant, key, value)
                            variant.save()
                        except PackageVariant.DoesNotExist:
                            PackageVariant.objects.create(package=package, **payload)
                    else:
                        PackageVariant.objects.create(package=package, **payload)
                    if payload['is_default']:
                        default_set = True
                except Exception as e:
                    print(f"Variant upsert error: {e}")

            # Normalize exactly one default and sync legacy fields
            try:
                pkg_variants = list(package.variants.all())
                if pkg_variants:
                    if not default_set:
                        cheapest = min(pkg_variants, key=lambda x: float(x.price))
                        package.variants.update(is_default=False)
                        cheapest.is_default = True
                        cheapest.save(update_fields=['is_default'])
                    else:
                        defaults = [v for v in pkg_variants if v.is_default]
                        if len(defaults) > 1:
                            keep = min(defaults, key=lambda x: float(x.price))
                            package.variants.exclude(pk=keep.pk).update(is_default=False)

                    # Sync legacy fields on Package to default variant for backward compatibility
                    default_variant = next((v for v in package.variants.all() if v.is_default), None)
                    if default_variant:
                        changes = []
                        if package.price != default_variant.price:
                            package.price = default_variant.price
                            changes.append('price')
                        if package.duration != default_variant.duration_days:
                            package.duration = default_variant.duration_days
                            changes.append('duration')
                        if (package.original_price or None) != (default_variant.original_price or None):
                            package.original_price = default_variant.original_price
                            changes.append('original_price')
                        if changes:
                            package.save(update_fields=changes)
            except Exception as e:
                print(f"Variant default normalization/sync error: {e}")
        
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
    file_url = serializers.SerializerMethodField(read_only=True)
    thumbnail_url = serializers.SerializerMethodField(read_only=True)
    
    class Meta:
        model = MediaAsset
        fields = '__all__'
        read_only_fields = ['id', 'file_url', 'thumbnail_url', 'usage_count', 'created_at', 'mime_type']
    
    def get_file_url(self, obj):
        try:
            url = obj.file.url if obj.file else None
            request = self.context.get('request') if isinstance(self.context, dict) else None
            if request and url and isinstance(url, str) and url.startswith('/'):
                try:
                    return request.build_absolute_uri(url)
                except Exception:
                    return url
            return url
        except Exception:
            return None
    
    def get_thumbnail_url(self, obj):
        # Until thumbnail variants are generated, use main file URL as fallback
        return self.get_file_url(obj)
    
    def _augment_file_metadata(self, validated_data):
        """Populate mime_type, file_size, width, height when a file is uploaded."""
        file_obj = validated_data.get('file')
        if not file_obj:
            return validated_data
        # Mime type and size
        validated_data['mime_type'] = getattr(file_obj, 'content_type', validated_data.get('mime_type'))
        try:
            validated_data['file_size'] = getattr(file_obj, 'size', validated_data.get('file_size'))
        except Exception:
            pass
        # Dimensions (best-effort)
        try:
            from PIL import Image
            current_pos = None
            try:
                current_pos = file_obj.tell()
            except Exception:
                current_pos = None
            try:
                image = Image.open(file_obj)
                width, height = image.size
                validated_data['width'] = width
                validated_data['height'] = height
            finally:
                # Reset stream position if possible
                try:
                    if current_pos is not None:
                        file_obj.seek(current_pos)
                except Exception:
                    pass
        except Exception:
            # Non-image files or PIL not available; ignore silently
            pass
        return validated_data
    
    def create(self, validated_data):
        # Attach creator if available
        request = self.context.get('request') if isinstance(self.context, dict) else None
        if request and getattr(request, 'user', None) and request.user.is_authenticated:
            validated_data.setdefault('created_by', request.user)
        validated_data = self._augment_file_metadata(validated_data)
        return super().create(validated_data)
    
    def update(self, instance, validated_data):
        validated_data = self._augment_file_metadata(validated_data)
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
    # Accept either a file upload or an absolute URL (e.g., from MediaAsset.file_url)
    image = FlexibleImageField(required=False, allow_null=True)
    
    class Meta:
        model = Destination
        fields = '__all__'

    def validate(self, data):
        # Normalize empty coordinates
        for coord in ['latitude', 'longitude']:
            if coord in data and data[coord] in ['', None]:
                data[coord] = None
        return data


class PackageSerializer(serializers.ModelSerializer):
    # Include related data for frontend display
    destinations = serializers.SerializerMethodField()
    inclusions = serializers.SerializerMethodField()
    activities = serializers.SerializerMethodField()
    images = serializers.SerializerMethodField()
    
    class Meta:
        model = Package
        exclude = ['language', 'localized_name', 'localized_description', 'localized_highlights', 'localized_included']

    def get_destinations(self, obj):
        """Get package destinations with location info"""
        destinations = obj.destinations.all()
        return [
            {
                'id': dest.id,
                'island': dest.location.island if dest.location else None,
                'atoll': dest.location.atoll if dest.location else None,
                'name': dest.location.island if dest.location else None,
                'duration': dest.duration,
                'description': dest.description,
                'highlights': dest.highlights or [],
                'activities': dest.activities or []
            }
            for dest in destinations
        ]
    
    def get_inclusions(self, obj):
        """Get package inclusions/exclusions"""
        inclusions = obj.inclusions.all()
        return [
            {
                'id': inc.id,
                'category': inc.category,
                'item': inc.item,
                'description': inc.description,
                'icon': inc.icon
            }
            for inc in inclusions
        ]
    
    def get_activities(self, obj):
        """Get package activities"""
        activities = obj.activities.all()
        return [
            {
                'id': act.id,
                'name': act.name,
                'description': act.description,
                'duration': act.duration,
                'difficulty': act.difficulty,
                'category': act.category,
                'included': act.included,
                'price': act.price
            }
            for act in activities
        ]
    
    def get_images(self, obj):
        """Get package images and videos with URLs"""
        media = obj.images.all()
        request = self.context.get('request')
        result = []

        for item in media:
            media_data = {
                'id': item.id,
                'media_type': item.media_type,
                'caption': item.caption,
                'order': item.order,
                'is_featured': item.is_featured,
                'created_at': item.created_at,
                'updated_at': item.updated_at
            }

            if item.media_type == 'image':
                media_data['image'] = request.build_absolute_uri(item.image.url) if request and item.image else (item.image.url if item.image else None)
                media_data['thumbnail'] = media_data['image']  # For images, thumbnail is the same as the image
            elif item.media_type == 'video':
                media_data['video'] = request.build_absolute_uri(item.video.url) if request and item.video else (item.video.url if item.video else None)
                # Use thumbnail if available, otherwise fall back to video_thumbnail or None
                if item.video_thumbnail:
                    media_data['thumbnail'] = request.build_absolute_uri(item.video_thumbnail.url) if request else item.video_thumbnail.url
                elif hasattr(item, 'thumbnail_url') and item.thumbnail_url:
                    media_data['thumbnail'] = item.thumbnail_url
                else:
                    media_data['thumbnail'] = None

            result.append(media_data)

        return result


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


# Resort Serializers
class ResortAmenitySerializer(serializers.ModelSerializer):
    """Serializer for resort amenities"""
    
    class Meta:
        model = ResortAmenity
        fields = '__all__'


class ResortImageSerializer(serializers.ModelSerializer):
    """Serializer for resort images"""
    image_url = serializers.SerializerMethodField()
    
    class Meta:
        model = ResortImage
        fields = '__all__'
    
    def get_image_url(self, obj):
        if obj.image:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.image.url)
            return obj.image.url
        return None


class ResortReviewSerializer(serializers.ModelSerializer):
    """Serializer for resort reviews"""
    
    class Meta:
        model = ResortReview
        fields = '__all__'
        read_only_fields = ('created_at', 'updated_at')


class ResortRoomTypeSerializer(serializers.ModelSerializer):
    """Serializer for resort room types with pricing tiers."""
    image_url = serializers.SerializerMethodField()

    class Meta:
        model = ResortRoomType
        fields = (
            'id',
            'resort',
            'name',
            'slug',
            'description',
            'price_per_night',
            'currency',
            'occupancy_adults',
            'occupancy_children',
            'bed_configuration',
            'amenities',
            'image',
            'image_url',
            'order',
            'is_active',
            'hide_price',
            'created_at',
            'updated_at',
        )
        read_only_fields = ('created_at', 'updated_at')

    def get_image_url(self, obj):
        # First try to get image URL from amenities (frontend URL - works in production)
        if obj.amenities and isinstance(obj.amenities, list):
            for amenity in obj.amenities:
                if isinstance(amenity, str) and amenity.startswith('__IMAGE_URL__:'):
                    return amenity.replace('__IMAGE_URL__:', '')
        
        # Fall back to uploaded image
        if obj.image:
            request = self.context.get('request')
            try:
                url = obj.image.url
            except Exception:
                return None
            if request and url and url.startswith('/'):
                return request.build_absolute_uri(url)
            return url
        return None
    
    def to_representation(self, instance):
        """Override to filter out __IMAGE_URL__ from amenities"""
        data = super().to_representation(instance)
        
        # Filter out __IMAGE_URL__ entries from amenities
        if data.get('amenities') and isinstance(data['amenities'], list):
            data['amenities'] = [
                amenity for amenity in data['amenities']
                if not (isinstance(amenity, str) and amenity.startswith('__IMAGE_URL__:'))
            ]
        
        return data


class ResortSerializer(serializers.ModelSerializer):
    """Serializer for resorts"""
    images = ResortImageSerializer(many=True, read_only=True)
    reviews = ResortReviewSerializer(many=True, read_only=True)
    amenities_list = ResortAmenitySerializer(source='amenities', many=True, read_only=True)
    location_name = serializers.CharField(source='location.island', read_only=True)
    location_atoll = serializers.CharField(source='location.atoll', read_only=True)
    full_location = serializers.CharField(read_only=True)
    price_range = serializers.CharField(read_only=True)
    total_villa_count = serializers.IntegerField(read_only=True)
    hero_image_url = serializers.SerializerMethodField()
    average_rating = serializers.SerializerMethodField()
    review_count = serializers.SerializerMethodField()
    room_types = ResortRoomTypeSerializer(many=True, read_only=True)
    
    class Meta:
        model = Resort
        fields = '__all__'
        read_only_fields = ('created_at', 'updated_at', 'full_location', 'price_range', 'total_villa_count')
    
    def get_hero_image_url(self, obj):
        # First try gallery_images for Card Image (frontend URL - works in production)
        if obj.gallery_images and isinstance(obj.gallery_images, list) and len(obj.gallery_images) > 0:
            # Look for card image marker first
            for img_url in obj.gallery_images:
                if isinstance(img_url, str):
                    # Check for marker format
                    if img_url.startswith('__CARD_IMAGE__:'):
                        url = img_url.replace('__CARD_IMAGE__:', '').strip()
                        if url and (url.startswith('http') or url.startswith('https')):
                            return url
                    # Check for 'Card' or 'card' in URL (old format)
                    elif ('Card' in img_url or 'card' in img_url) and (img_url.startswith('http') or img_url.startswith('https')):
                        return img_url
            
            # Fallback: use first image in gallery (card image is always first)
            first_img = obj.gallery_images[0]
            if isinstance(first_img, str):
                # Extract from marker if present
                if first_img.startswith('__CARD_IMAGE__:'):
                    url = first_img.replace('__CARD_IMAGE__:', '').strip()
                    if url and (url.startswith('http') or url.startswith('https')):
                        return url
                # Use directly if it's a valid URL
                elif first_img.startswith('http') or first_img.startswith('https'):
                    return first_img
        
        # Try the resort's hero_image field
        if obj.hero_image:
            try:
                request = self.context.get('request')
                if request:
                    return request.build_absolute_uri(obj.hero_image.url)
                return obj.hero_image.url
            except:
                pass
        
        # If no hero_image, get from ResortImages
        # Priority: featured hero image > any featured image > first hero image > first image
        from api.models import ResortImage
        
        # Try featured hero image first
        featured_hero = ResortImage.objects.filter(
            resort=obj, 
            is_active=True, 
            is_featured=True, 
            image_type='hero'
        ).first()
        
        if featured_hero and featured_hero.image:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(featured_hero.image.url)
            return featured_hero.image.url
        
        # Try any featured image
        featured_image = ResortImage.objects.filter(
            resort=obj, 
            is_active=True, 
            is_featured=True
        ).first()
        
        if featured_image and featured_image.image:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(featured_image.image.url)
            return featured_image.image.url
        
        # Try first hero type image
        hero_image = ResortImage.objects.filter(
            resort=obj, 
            is_active=True, 
            image_type='hero'
        ).first()
        
        if hero_image and hero_image.image:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(hero_image.image.url)
            return hero_image.image.url
        
        # Fall back to first available image
        first_image = ResortImage.objects.filter(
            resort=obj, 
            is_active=True
        ).order_by('order').first()
        
        if first_image and first_image.image:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(first_image.image.url)
            return first_image.image.url
        
        return None
    
    def get_average_rating(self, obj):
        reviews = obj.reviews.filter(is_approved=True)
        if reviews.exists():
            return round(sum(review.rating for review in reviews) / reviews.count(), 1)
        return 0
    
    def get_review_count(self, obj):
        return obj.reviews.filter(is_approved=True).count()


class ResortListSerializer(serializers.ModelSerializer):
    """Simplified serializer for resort listings"""
    hero_image_url = serializers.SerializerMethodField()
    full_location = serializers.CharField(read_only=True)
    price_range = serializers.CharField(read_only=True)
    average_rating = serializers.SerializerMethodField()
    review_count = serializers.SerializerMethodField()
    
    class Meta:
        model = Resort
        fields = [
            'id', 'name', 'description', 'category', 'star_rating', 'atoll', 'island_name',
            'price_per_night_from', 'price_per_night_to', 'currency', 'is_featured', 'is_active',
            'is_packaged', 'is_room_type', 'is_adults_only', 'is_family_friendly', 'is_honeymoon_special', 'is_eco_friendly',
            'has_house_reef', 'has_private_beach', 'transfer_type', 'transfer_duration',
            'hero_image_url', 'full_location', 'price_range', 'average_rating', 'review_count',
            'display_order', 'created_at'
        ]
    
    def get_hero_image_url(self, obj):
        # First try gallery_images for Card Image (frontend URL - works in production)
        if obj.gallery_images and isinstance(obj.gallery_images, list) and len(obj.gallery_images) > 0:
            # Look for card image marker first
            for img_url in obj.gallery_images:
                if isinstance(img_url, str):
                    # Check for marker format
                    if img_url.startswith('__CARD_IMAGE__:'):
                        url = img_url.replace('__CARD_IMAGE__:', '').strip()
                        if url and (url.startswith('http') or url.startswith('https')):
                            return url
                    # Check for 'Card' or 'card' in URL (old format)
                    elif ('Card' in img_url or 'card' in img_url) and (img_url.startswith('http') or img_url.startswith('https')):
                        return img_url
            
            # Fallback: use first image in gallery (card image is always first)
            first_img = obj.gallery_images[0]
            if isinstance(first_img, str):
                # Extract from marker if present
                if first_img.startswith('__CARD_IMAGE__:'):
                    url = first_img.replace('__CARD_IMAGE__:', '').strip()
                    if url and (url.startswith('http') or url.startswith('https')):
                        return url
                # Use directly if it's a valid URL
                elif first_img.startswith('http') or first_img.startswith('https'):
                    return first_img
        
        # Try the resort's hero_image field
        if obj.hero_image:
            try:
                request = self.context.get('request')
                if request:
                    return request.build_absolute_uri(obj.hero_image.url)
                return obj.hero_image.url
            except:
                pass
        
        # If no hero_image, get from ResortImages
        # Priority: featured hero image > any featured image > first hero image > first image
        from api.models import ResortImage
        
        # Try featured hero image first
        featured_hero = ResortImage.objects.filter(
            resort=obj, 
            is_active=True, 
            is_featured=True, 
            image_type='hero'
        ).first()
        
        if featured_hero and featured_hero.image:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(featured_hero.image.url)
            return featured_hero.image.url
        
        # Try any featured image
        featured_image = ResortImage.objects.filter(
            resort=obj, 
            is_active=True, 
            is_featured=True
        ).first()
        
        if featured_image and featured_image.image:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(featured_image.image.url)
            return featured_image.image.url
        
        # Try first hero type image
        hero_image = ResortImage.objects.filter(
            resort=obj, 
            is_active=True, 
            image_type='hero'
        ).first()
        
        if hero_image and hero_image.image:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(hero_image.image.url)
            return hero_image.image.url
        
        # Fall back to first available image
        first_image = ResortImage.objects.filter(
            resort=obj, 
            is_active=True
        ).order_by('order').first()
        
        if first_image and first_image.image:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(first_image.image.url)
            return first_image.image.url
        
        return None
    
    def get_average_rating(self, obj):
        reviews = obj.reviews.filter(is_approved=True)
        if reviews.exists():
            return round(sum(review.rating for review in reviews) / reviews.count(), 1)
        return 0
    
    def get_review_count(self, obj):
        return obj.reviews.filter(is_approved=True).count()


class ResortDetailSerializer(ResortSerializer):
    """Detailed serializer for resort with all related data"""
    images = ResortImageSerializer(many=True, read_only=True)
    reviews = ResortReviewSerializer(many=True, read_only=True)
    amenities_list = ResortAmenitySerializer(source='amenities', many=True, read_only=True)
    
    class Meta(ResortSerializer.Meta):
        pass


# ============================================================================
# BOAT SERIALIZERS
# ============================================================================

class BoatAmenitySerializer(serializers.ModelSerializer):
    """Serializer for boat amenities"""
    
    class Meta:
        model = BoatAmenity
        fields = '__all__'


class BoatImageSerializer(serializers.ModelSerializer):
    """Serializer for boat images"""
    image_url = serializers.SerializerMethodField()
    
    class Meta:
        model = BoatImage
        fields = '__all__'
    
    def get_image_url(self, obj):
        if obj.image:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.image.url)
            return obj.image.url
        return None


class BoatActivityImageSerializer(serializers.ModelSerializer):
    """Serializer for boat activity images"""
    image_url = serializers.SerializerMethodField()
    
    class Meta:
        model = BoatActivityImage
        fields = '__all__'
    
    def get_image_url(self, obj):
        if obj.image:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.image.url)
            return obj.image.url
        return None


class BoatActivityListSerializer(serializers.ModelSerializer):
    """List serializer for boat activities"""
    suitable_boats_count = serializers.SerializerMethodField()
    hero_image_url = serializers.SerializerMethodField()
    
    class Meta:
        model = BoatActivity
        fields = [
            'id', 'name', 'description', 'activity_type', 'duration_hours',
            'duration_description', 'min_participants', 'max_participants',
            'difficulty_level', 'hero_image_url', 'is_featured', 'is_active',
            'suitable_boats_count', 'display_order'
        ]
    
    def get_suitable_boats_count(self, obj):
        return obj.suitable_boats.filter(is_active=True).count()
    
    def get_hero_image_url(self, obj):
        if obj.hero_image:
            # Check if it's a string path (frontend static file or URL)
            hero_image_str = str(obj.hero_image)
            if hero_image_str.startswith('http') or hero_image_str.startswith('images/'):
                # It's a URL or frontend path, return as is
                return f'/{hero_image_str}' if not hero_image_str.startswith('http') else hero_image_str
            
            # It's an uploaded file, build absolute URI
            try:
                request = self.context.get('request')
                if request:
                    return request.build_absolute_uri(obj.hero_image.url)
                return obj.hero_image.url
            except:
                pass
        return None


class BoatActivitySerializer(serializers.ModelSerializer):
    """Full serializer for boat activities"""
    suitable_boats_details = serializers.SerializerMethodField()
    images = BoatActivityImageSerializer(many=True, read_only=True)
    hero_image_url = serializers.SerializerMethodField()
    average_rating = serializers.SerializerMethodField()
    review_count = serializers.SerializerMethodField()
    
    class Meta:
        model = BoatActivity
        fields = '__all__'
    
    def get_suitable_boats_details(self, obj):
        from api.models import Boat
        boats = obj.suitable_boats.filter(is_active=True)
        return BoatListSerializer(boats, many=True, context=self.context).data
    
    def get_hero_image_url(self, obj):
        if obj.hero_image:
            # Check if it's a string path (frontend static file or URL)
            hero_image_str = str(obj.hero_image)
            if hero_image_str.startswith('http') or hero_image_str.startswith('images/'):
                # It's a URL or frontend path, return as is
                return f'/{hero_image_str}' if not hero_image_str.startswith('http') else hero_image_str
            
            # It's an uploaded file, build absolute URI
            try:
                request = self.context.get('request')
                if request:
                    return request.build_absolute_uri(obj.hero_image.url)
                return obj.hero_image.url
            except:
                pass
        return None
    
    def get_average_rating(self, obj):
        reviews = obj.reviews.filter(is_approved=True)
        if reviews.exists():
            return round(sum(review.rating for review in reviews) / reviews.count(), 1)
        return 0
    
    def get_review_count(self, obj):
        return obj.reviews.filter(is_approved=True).count()


class BoatListSerializer(serializers.ModelSerializer):
    """List serializer for boats"""
    hero_image_url = serializers.SerializerMethodField()
    activities_count = serializers.SerializerMethodField()
    packages_count = serializers.SerializerMethodField()
    average_rating = serializers.SerializerMethodField()
    review_count = serializers.SerializerMethodField()
    speed_range = serializers.CharField(read_only=True)
    
    class Meta:
        model = Boat
        fields = [
            'id', 'name', 'description', 'boat_type', 'length_feet',
            'engine_details', 'cruising_speed_knots', 'top_speed_knots',
            'passenger_capacity', 'hero_image_url', 'is_featured', 'is_active',
            'activities_count', 'packages_count', 'average_rating', 'review_count',
            'speed_range', 'display_order', 'departure_location'
        ]
    
    def get_hero_image_url(self, obj):
        if obj.hero_image:
            # Check if it's a string path (frontend static file or URL)
            hero_image_str = str(obj.hero_image)
            if hero_image_str.startswith('http') or hero_image_str.startswith('images/'):
                # It's a URL or frontend path, return as is
                return f'/{hero_image_str}' if not hero_image_str.startswith('http') else hero_image_str
            
            # It's an uploaded file, build absolute URI
            try:
                request = self.context.get('request')
                if request:
                    return request.build_absolute_uri(obj.hero_image.url)
                return obj.hero_image.url
            except:
                pass
        
        # Fallback to first gallery image
        if obj.gallery_images and len(obj.gallery_images) > 0:
            return obj.gallery_images[0]
        
        # Fallback to first image from images relation
        first_image = obj.images.filter(is_active=True).first()
        if first_image and first_image.image:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(first_image.image.url)
            return first_image.image.url
        
        return None
    
    def get_activities_count(self, obj):
        return obj.activities.filter(is_active=True).count()
    
    def get_packages_count(self, obj):
        return obj.packages.filter(is_active=True).count()
    
    def get_average_rating(self, obj):
        reviews = obj.reviews.filter(is_approved=True)
        if reviews.exists():
            return round(sum(review.rating for review in reviews) / reviews.count(), 1)
        return 0
    
    def get_review_count(self, obj):
        return obj.reviews.filter(is_approved=True).count()


class BoatSerializer(serializers.ModelSerializer):
    """Full serializer for boats"""
    amenities_list = BoatAmenitySerializer(source='amenities', many=True, read_only=True)
    images = BoatImageSerializer(many=True, read_only=True)
    activities = BoatActivityListSerializer(many=True, read_only=True)
    packages = serializers.SerializerMethodField()
    hero_image_url = serializers.SerializerMethodField()
    location_name = serializers.CharField(source='location.island', read_only=True)
    average_rating = serializers.SerializerMethodField()
    review_count = serializers.SerializerMethodField()
    speed_range = serializers.CharField(read_only=True)
    
    class Meta:
        model = Boat
        fields = '__all__'
    
    def get_packages(self, obj):
        packages = obj.packages.filter(is_active=True).order_by('display_order', 'price')
        return BoatPackageListSerializer(packages, many=True, context=self.context).data
    
    def get_hero_image_url(self, obj):
        if obj.hero_image:
            # Check if it's a string path (frontend static file or URL)
            hero_image_str = str(obj.hero_image)
            if hero_image_str.startswith('http') or hero_image_str.startswith('images/'):
                # It's a URL or frontend path, return as is
                return f'/{hero_image_str}' if not hero_image_str.startswith('http') else hero_image_str
            
            # It's an uploaded file, build absolute URI
            try:
                request = self.context.get('request')
                if request:
                    return request.build_absolute_uri(obj.hero_image.url)
                return obj.hero_image.url
            except:
                pass
        
        # Fallback to first gallery image
        if obj.gallery_images and len(obj.gallery_images) > 0:
            return obj.gallery_images[0]
        
        # Fallback to first image from images relation
        first_image = obj.images.filter(is_active=True).first()
        if first_image and first_image.image:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(first_image.image.url)
            return first_image.image.url
        
        return None
    
    def get_average_rating(self, obj):
        reviews = obj.reviews.filter(is_approved=True)
        if reviews.exists():
            return round(sum(review.rating for review in reviews) / reviews.count(), 1)
        return 0
    
    def get_review_count(self, obj):
        return obj.reviews.filter(is_approved=True).count()


class BoatPackageListSerializer(serializers.ModelSerializer):
    """List serializer for boat packages"""
    boat_name = serializers.CharField(source='boat.name', read_only=True)
    boat_id = serializers.IntegerField(source='boat.id', read_only=True)
    hero_image_url = serializers.SerializerMethodField()
    discounted_price = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)
    
    class Meta:
        model = BoatPackage
        fields = [
            'id', 'name', 'description', 'boat_id', 'boat_name', 'package_tier',
            'price', 'discounted_price', 'currency', 'duration_hours',
            'duration_description', 'hero_image_url', 'is_featured', 'is_active',
            'discount_percentage', 'display_order', 'booking_notice_description',
            'includes'
        ]
    
    def get_hero_image_url(self, obj):
        # First priority: gallery images (these are the package-specific images)
        if obj.gallery_images and len(obj.gallery_images) > 0:
            return obj.gallery_images[0]
        
        # Second priority: hero_image field
        if obj.hero_image:
            hero_image_str = str(obj.hero_image)
            # Check if it's already a full path or URL
            if hero_image_str.startswith('http'):
                return hero_image_str
            if hero_image_str.startswith('/images/') or hero_image_str.startswith('images/'):
                return hero_image_str if hero_image_str.startswith('/') else f'/{hero_image_str}'
            
            # It's an uploaded file, build absolute URI
            try:
                request = self.context.get('request')
                if request:
                    return request.build_absolute_uri(obj.hero_image.url)
                return obj.hero_image.url
            except:
                pass
        
        # Fallback to boat's hero image
        if obj.boat and obj.boat.hero_image:
            boat_image_str = str(obj.boat.hero_image)
            if boat_image_str.startswith('http'):
                return boat_image_str
            if boat_image_str.startswith('/images/') or boat_image_str.startswith('images/'):
                return boat_image_str if boat_image_str.startswith('/') else f'/{boat_image_str}'
            
            try:
                request = self.context.get('request')
                if request:
                    return request.build_absolute_uri(obj.boat.hero_image.url)
                return obj.boat.hero_image.url
            except:
                pass
        
        return None


class BoatPackageSerializer(serializers.ModelSerializer):
    """Full serializer for boat packages"""
    boat_details = BoatListSerializer(source='boat', read_only=True)
    activities_included_details = BoatActivityListSerializer(source='activities_included', many=True, read_only=True)
    hero_image_url = serializers.SerializerMethodField()
    discounted_price = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)
    
    class Meta:
        model = BoatPackage
        fields = '__all__'
    
    def get_hero_image_url(self, obj):
        if obj.hero_image:
            # Check if it's a string path (frontend static file or URL)
            hero_image_str = str(obj.hero_image)
            if hero_image_str.startswith('http') or hero_image_str.startswith('images/'):
                # It's a URL or frontend path, return as is
                return f'/{hero_image_str}' if not hero_image_str.startswith('http') else hero_image_str
            
            # It's an uploaded file, build absolute URI
            try:
                request = self.context.get('request')
                if request:
                    return request.build_absolute_uri(obj.hero_image.url)
                return obj.hero_image.url
            except:
                pass
        
        # Fallback to boat's hero image
        if obj.boat and obj.boat.hero_image:
            boat_image_str = str(obj.boat.hero_image)
            if boat_image_str.startswith('http') or boat_image_str.startswith('images/'):
                return f'/{boat_image_str}' if not boat_image_str.startswith('http') else boat_image_str
            
            try:
                request = self.context.get('request')
                if request:
                    return request.build_absolute_uri(obj.boat.hero_image.url)
                return obj.boat.hero_image.url
            except:
                pass
        
        return None


class BoatBookingSerializer(serializers.ModelSerializer):
    """Serializer for boat bookings"""
    boat_name = serializers.CharField(source='boat.name', read_only=True)
    activity_name = serializers.CharField(source='activity.name', read_only=True)
    package_name = serializers.CharField(source='package.name', read_only=True)
    
    class Meta:
        model = BoatBooking
        fields = '__all__'
        read_only_fields = ('created_at', 'updated_at', 'confirmed_at', 'completed_at')


class BoatReviewSerializer(serializers.ModelSerializer):
    """Serializer for boat reviews"""
    boat_name = serializers.CharField(source='boat.name', read_only=True)
    activity_name = serializers.CharField(source='activity.name', read_only=True)
    
    class Meta:
        model = BoatReview
        fields = '__all__'
        read_only_fields = ('created_at', 'updated_at')


class GalleryMediaSerializer(serializers.ModelSerializer):
    """Serializer for gallery media (images, videos, GIFs)"""
    file_url = serializers.SerializerMethodField()
    thumbnail_url = serializers.SerializerMethodField()
    package_name = serializers.CharField(source='package.name', read_only=True)
    resort_name = serializers.CharField(source='resort.name', read_only=True)
    boat_name = serializers.CharField(source='boat.name', read_only=True)
    tags_list = serializers.SerializerMethodField()
    
    class Meta:
        model = GalleryMedia
        fields = '__all__'
        read_only_fields = ('created_at', 'updated_at')
    
    def _build_absolute_url(self, raw_url):
        """Build absolute URL with proper fallbacks for production"""
        from django.conf import settings
        
        if not raw_url:
            return ''
        
        # If already absolute URL, return as-is
        if raw_url.startswith('http://') or raw_url.startswith('https://'):
            return raw_url
        
        # Try to build absolute URL from request context
        request = self.context.get('request')
        if request:
            try:
                # Try build_absolute_uri first
                absolute_url = request.build_absolute_uri(raw_url)
                # In production, ensure HTTPS is used
                if not settings.DEBUG and absolute_url.startswith('http://'):
                    absolute_url = absolute_url.replace('http://', 'https://', 1)
                return absolute_url
            except Exception:
                # Fallback: construct URL manually from request
                try:
                    scheme = request.scheme
                    # Force HTTPS in production
                    if not settings.DEBUG:
                        scheme = 'https'
                    host = request.get_host()
                    return f"{scheme}://{host}{raw_url}"
                except Exception:
                    pass
        
        # Final fallback: use BACKEND_URL from environment if available
        backend_url = os.getenv('BACKEND_URL', '')
        if backend_url:
            # Clean up backend URL (remove trailing slashes, ensure https in production)
            backend_url = backend_url.rstrip('/')
            if not settings.DEBUG and not backend_url.startswith('https://'):
                backend_url = backend_url.replace('http://', 'https://', 1)
            if not backend_url.startswith('http'):
                backend_url = f"https://{backend_url}" if not settings.DEBUG else f"http://{backend_url}"
            return f"{backend_url}{raw_url}"
        
        # Last resort: return relative URL (frontend should handle)
        return raw_url
    
    def get_file_url(self, obj):
        """Get the URL of the media file"""
        try:
            # Get the raw URL from the model property, handling potential errors
            if obj.media_type in ['image', 'gif'] and obj.image:
                raw_url = obj.image.url
            elif obj.media_type == 'video':
                if obj.video:
                    raw_url = obj.video.url
                elif obj.video_url:
                    raw_url = obj.video_url
                else:
                    raw_url = ''
            else:
                raw_url = ''
            return self._build_absolute_url(raw_url)
        except Exception as e:
            # If there's an error accessing the file URL, return empty string
            return ''
    
    def get_thumbnail_url(self, obj):
        """Get the URL of the thumbnail"""
        try:
            # Get the raw URL from the model property, handling potential errors
            if obj.media_type in ['image', 'gif']:
                raw_url = obj.image.url if obj.image else ''
            elif obj.media_type == 'video':
                if obj.video_thumbnail:
                    raw_url = obj.video_thumbnail.url
                elif obj.video:
                    raw_url = obj.video.url
                elif obj.video_url:
                    # Use model's thumbnail extraction method
                    raw_url = obj.thumbnail_url if hasattr(obj, 'thumbnail_url') else ''
                else:
                    raw_url = ''
            else:
                raw_url = ''
            return self._build_absolute_url(raw_url)
        except Exception as e:
            # If there's an error accessing the file URL, return empty string
            return ''
    
    def get_tags_list(self, obj):
        """Convert comma-separated tags to list"""
        if obj.tags:
            return [tag.strip() for tag in obj.tags.split(',') if tag.strip()]
        return [] 