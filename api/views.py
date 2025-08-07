from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import viewsets, status
from rest_framework.generics import ListAPIView, CreateAPIView, UpdateAPIView
from django_filters.rest_framework import DjangoFilterBackend
from django.utils import timezone
from datetime import datetime, timedelta
from .models import PropertyType, Amenity, Location, PropertyImage, Property, Package, Review, Booking, Availability, Customer
from .serializers import (
    PropertyTypeSerializer, AmenitySerializer, LocationSerializer, 
    PropertyImageSerializer, PropertySerializer, PackageSerializer, 
    ReviewSerializer, BookingSerializer, BookingCreateSerializer, 
    BookingStatusUpdateSerializer, AvailabilitySerializer, CustomerSerializer
)
from rest_framework.decorators import permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken

# Create your views here.

@api_view(['GET'])
def hello_world(request):
    return Response({'message': 'Hello from Django API!'})

class PropertyTypeViewSet(viewsets.ModelViewSet):
    queryset = PropertyType.objects.all()
    serializer_class = PropertyTypeSerializer

class AmenityViewSet(viewsets.ModelViewSet):
    queryset = Amenity.objects.all()
    serializer_class = AmenitySerializer

class LocationViewSet(viewsets.ModelViewSet):
    queryset = Location.objects.all()
    serializer_class = LocationSerializer

class PropertyImageViewSet(viewsets.ModelViewSet):
    queryset = PropertyImage.objects.all()
    serializer_class = PropertyImageSerializer

class PropertyViewSet(viewsets.ModelViewSet):
    queryset = Property.objects.all()
    serializer_class = PropertySerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['amenities', 'property_type', 'location']

class PackageViewSet(viewsets.ModelViewSet):
    queryset = Package.objects.all()
    serializer_class = PackageSerializer

class ReviewViewSet(viewsets.ModelViewSet):
    queryset = Review.objects.all()
    serializer_class = ReviewSerializer

# Relationship endpoints
class PropertyPackagesList(ListAPIView):
    serializer_class = PackageSerializer
    def get_queryset(self):
        return Package.objects.filter(properties__id=self.kwargs['pk'])

class PropertyReviewsList(ListAPIView):
    serializer_class = ReviewSerializer
    def get_queryset(self):
        return Review.objects.filter(property_id=self.kwargs['pk'])

class PackageReviewsList(ListAPIView):
    serializer_class = ReviewSerializer
    def get_queryset(self):
        return Review.objects.filter(package_id=self.kwargs['pk'])

# New Booking Views
class BookingViewSet(viewsets.ModelViewSet):
    queryset = Booking.objects.all()
    serializer_class = BookingSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['property_obj', 'status', 'customer_email']

class BookingCreateView(CreateAPIView):
    queryset = Booking.objects.all()
    serializer_class = BookingCreateSerializer

class BookingStatusUpdateView(UpdateAPIView):
    queryset = Booking.objects.all()
    serializer_class = BookingStatusUpdateSerializer
    http_method_names = ['patch']

class AvailabilityViewSet(viewsets.ModelViewSet):
    queryset = Availability.objects.all()
    serializer_class = AvailabilitySerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['property_obj', 'date', 'is_available']

class CustomerViewSet(viewsets.ModelViewSet):
    queryset = Customer.objects.all()
    serializer_class = CustomerSerializer

# Custom API endpoints for booking functionality
@api_view(['GET'])
@permission_classes([AllowAny])
def check_availability(request, property_id):
    """Check availability for a property on specific dates"""
    try:
        property_obj = Property.objects.get(id=property_id)
        check_in_date = request.GET.get('check_in')
        check_out_date = request.GET.get('check_out')
        
        if not check_in_date or not check_out_date:
            return Response(
                {'error': 'check_in and check_out dates are required'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Convert string dates to date objects
        check_in = datetime.strptime(check_in_date, '%Y-%m-%d').date()
        check_out = datetime.strptime(check_out_date, '%Y-%m-%d').date()
        
        # Check for overlapping bookings
        overlapping_bookings = Booking.objects.filter(
            property_obj=property_obj,
            status__in=['pending', 'confirmed'],
            check_in_date__lt=check_out,
            check_out_date__gt=check_in
        )
        
        is_available = not overlapping_bookings.exists()
        nights = (check_out - check_in).days
        total_price = property_obj.price_per_night * nights
        
        return Response({
            'property_id': property_obj.id,
            'property_name': property_obj.name,
            'check_in': check_in_date,
            'check_out': check_out_date,
            'nights': nights,
            'is_available': is_available,
            'price_per_night': float(property_obj.price_per_night),
            'total_price': float(total_price),
            'currency': 'USD'
        })
        
    except Property.DoesNotExist:
        return Response(
            {'error': 'Property not found'}, 
            status=status.HTTP_404_NOT_FOUND
        )
    except ValueError:
        return Response(
            {'error': 'Invalid date format. Use YYYY-MM-DD'}, 
            status=status.HTTP_400_BAD_REQUEST
        )

@api_view(['GET'])
def property_bookings(request, property_id):
    """Get all bookings for a specific property"""
    try:
        property_obj = Property.objects.get(id=property_id)
        bookings = Booking.objects.filter(property_obj=property_obj).order_by('-created_at')
        serializer = BookingSerializer(bookings, many=True)
        return Response(serializer.data)
    except Property.DoesNotExist:
        return Response(
            {'error': 'Property not found'}, 
            status=status.HTTP_404_NOT_FOUND
        )

@api_view(['POST'])
@permission_classes([AllowAny])
def create_booking(request):
    """Create a new booking with validation"""
    serializer = BookingCreateSerializer(data=request.data)
    if serializer.is_valid():
        booking = serializer.save()
        
        # If user is authenticated, link booking to customer
        if request.user.is_authenticated:
            try:
                customer = Customer.objects.get(user=request.user)
                booking.customer = customer
                booking.save()
            except Customer.DoesNotExist:
                pass  # Continue without linking if customer profile doesn't exist
        
        return Response(BookingSerializer(booking).data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
def booking_summary(request):
    """Get booking summary statistics"""
    total_bookings = Booking.objects.count()
    pending_bookings = Booking.objects.filter(status='pending').count()
    confirmed_bookings = Booking.objects.filter(status='confirmed').count()
    completed_bookings = Booking.objects.filter(status='completed').count()
    cancelled_bookings = Booking.objects.filter(status='cancelled').count()
    
    # Recent bookings (last 30 days)
    thirty_days_ago = timezone.now().date() - timedelta(days=30)
    recent_bookings = Booking.objects.filter(created_at__date__gte=thirty_days_ago).count()
    
    return Response({
        'total_bookings': total_bookings,
        'pending_bookings': pending_bookings,
        'confirmed_bookings': confirmed_bookings,
        'completed_bookings': completed_bookings,
        'cancelled_bookings': cancelled_bookings,
        'recent_bookings': recent_bookings,
        'last_updated': timezone.now()
    })

# Customer Authentication Views
from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
from .models import Customer

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def my_bookings(request):
    """Get bookings for the authenticated customer"""
    try:
        # Get customer profile
        customer = Customer.objects.get(user=request.user)
        
        # Get bookings for this customer
        bookings = Booking.objects.filter(customer=customer).order_by('-created_at')
        
        # Serialize bookings with property details
        booking_data = []
        for booking in bookings:
            booking_data.append({
                'id': booking.id,
                'property': {
                    'id': booking.property_obj.id,
                    'name': booking.property_obj.name,
                    'image': booking.property_obj.images.first().image.url if booking.property_obj.images.exists() else None
                },
                'check_in': booking.check_in_date.isoformat(),
                'check_out': booking.check_out_date.isoformat(),
                'status': booking.status,
                'total_amount': float(booking.total_price),
                'created_at': booking.created_at.isoformat(),
                'number_of_guests': booking.number_of_guests,
                'special_requests': booking.special_requests
            })
        
        return Response({
            'results': booking_data,
            'count': len(booking_data)
        })
        
    except Customer.DoesNotExist:
        return Response({'error': 'Customer profile not found'}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['POST'])
@permission_classes([AllowAny])
def customer_register(request):
    """Register a new customer"""
    try:
        data = request.data
        
        # Check if user already exists
        if User.objects.filter(email=data.get('email')).exists():
            return Response({'error': 'User with this email already exists'}, status=status.HTTP_400_BAD_REQUEST)
        
        # Create Django User
        user = User.objects.create_user(
            username=data.get('email'),
            email=data.get('email'),
            password=data.get('password'),
            first_name=data.get('name', '').split()[0] if data.get('name') else '',
            last_name=' '.join(data.get('name', '').split()[1:]) if data.get('name') and len(data.get('name').split()) > 1 else ''
        )
        
        # Create Customer profile
        customer = Customer.objects.create(
            user=user,
            name=data.get('name'),
            email=data.get('email'),
            phone=data.get('phone', ''),
            date_of_birth=data.get('date_of_birth') if data.get('date_of_birth') else None,
            nationality=data.get('nationality', ''),
            passport_number=data.get('passport_number', '')
        )
        
        # Generate JWT token
        refresh = RefreshToken.for_user(user)
        
        return Response({
            'message': 'Registration successful',
            'token': str(refresh.access_token),
            'customer': {
                'id': customer.id,
                'name': customer.name,
                'email': customer.email,
                'phone': customer.phone
            }
        }, status=status.HTTP_201_CREATED)
        
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([AllowAny])
def customer_login(request):
    """Login customer and return JWT token"""
    try:
        data = request.data
        email = data.get('email')
        password = data.get('password')
        
        if not email or not password:
            return Response({'error': 'Email and password are required'}, status=status.HTTP_400_BAD_REQUEST)
        
        # Authenticate user
        user = authenticate(username=email, password=password)
        
        if user is None:
            return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)
        
        # Get customer profile
        try:
            customer = Customer.objects.get(user=user)
        except Customer.DoesNotExist:
            return Response({'error': 'Customer profile not found'}, status=status.HTTP_404_NOT_FOUND)
        
        # Generate JWT token
        refresh = RefreshToken.for_user(user)
        
        return Response({
            'message': 'Login successful',
            'token': str(refresh.access_token),
            'customer': {
                'id': customer.id,
                'name': customer.name,
                'email': customer.email,
                'phone': customer.phone
            }
        }, status=status.HTTP_200_OK)
        
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
