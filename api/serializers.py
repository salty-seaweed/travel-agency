from rest_framework import serializers
from .models import PropertyType, Amenity, Location, PropertyImage, Property, Package, Review, Booking, Availability, Customer

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

class PackageSerializer(serializers.ModelSerializer):
    properties = PropertySerializer(many=True, read_only=True)
    property_ids = serializers.PrimaryKeyRelatedField(queryset=Property.objects.all(), many=True, source='properties', write_only=True, required=False)
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