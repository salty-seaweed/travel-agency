from django.shortcuts import render
from django.http import HttpResponse
from django.db import models
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import viewsets, status
from rest_framework.generics import ListAPIView, CreateAPIView, UpdateAPIView
from django_filters.rest_framework import DjangoFilterBackend
from django.utils import timezone
from datetime import datetime, timedelta
import os
import uuid
from django.conf import settings
from .models import (
    PropertyType, Amenity, Location, Destination, Experience, PropertyImage, Property, Package, PackageImage, Review, 
    Booking, Availability, Customer, Page, PageBlock, MediaAsset, Menu, MenuItem, 
    Redirect, PageVersion, PageReview, CommentThread, Comment, PackageItinerary, PackageInclusion,
    PackageActivity, PackageDestination, TransferType, AtollTransfer, ResortTransfer, TransferFAQ,
    TransferContactMethod, TransferBookingStep, TransferBenefit, TransferPricingFactor, TransferContent, FerrySchedule,
    HomepageHero, HomepageFeature, HomepageTestimonial, HomepageStatistic, 
    HomepageCTASection, HomepageSettings, HomepageContent, HomepageImage, PageHero,
    Language, Translation, TranslationKey, CulturalContent, RegionalSettings, LocalizedPage, LocalizedFAQ,
    AboutPageContent, AboutPageValue, AboutPageStatistic, FeaturedDestination
)
from .serializers import (
    PropertyTypeSerializer, AmenitySerializer, LocationSerializer, DestinationSerializer, ExperienceSerializer,
    PropertyImageSerializer, PackageImageSerializer, PropertySerializer, PackageSerializer, PackageSerializerI18n,
    ReviewSerializer, BookingSerializer, BookingCreateSerializer, 
    BookingStatusUpdateSerializer, AvailabilitySerializer, CustomerSerializer,
    PageSerializer, PageBlockSerializer, MediaAssetSerializer, MenuSerializer, MenuItemSerializer,
    RedirectSerializer, PageVersionSerializer, PageReviewSerializer, CommentThreadSerializer, CommentSerializer,
    PackageItinerarySerializer, PackageInclusionSerializer, PackageActivitySerializer, PackageDestinationSerializer,
    TransferTypeSerializer, AtollTransferSerializer, ResortTransferSerializer, TransferFAQSerializer,
    TransferContactMethodSerializer, TransferBookingStepSerializer, TransferBenefitSerializer,
    TransferPricingFactorSerializer, TransferContentSerializer, FerryScheduleSerializer, PageHeroSerializer,
    HomepageHeroSerializer, HomepageFeatureSerializer, HomepageTestimonialSerializer,
    HomepageStatisticSerializer, HomepageCTASectionSerializer, HomepageSettingsSerializer,
    HomepageContentSerializer, HomepageDataSerializer, HomepageImageSerializer,
    LanguageSerializer, TranslationSerializer, TranslationKeySerializer, CulturalContentSerializer,
    RegionalSettingsSerializer, LocalizedPageSerializer, LocalizedFAQSerializer,
    TranslationBulkSerializer, TranslationExportSerializer, TranslationImportSerializer,
    LanguageDetectionSerializer, AboutPageContentSerializer, AboutPageValueSerializer, 
    AboutPageStatisticSerializer, AboutPageDataSerializer, FeaturedDestinationSerializer
)
from rest_framework.decorators import permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated, IsAuthenticatedOrReadOnly
from rest_framework_simplejwt.tokens import RefreshToken
from django.db.models import Count, Avg, Sum
from .models import Property, Package, Review, PropertyType, Amenity, Location, Customer
from .serializers import (
    PropertyTypeSerializer, 
    AmenitySerializer, 
    LocationSerializer,
    PropertyImageSerializer,
    PropertySerializer,
    PackageSerializer,
    ReviewSerializer,
    BookingSerializer,
    AvailabilitySerializer,
    CustomerSerializer
)
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import status
from django.db import transaction
import json

# Create your views here.

@api_view(['GET'])
def hello_world(request):
    return Response({'message': 'Hello from Django API!'})

@api_view(['GET'])
def analytics(request):
    """Get analytics data for the admin dashboard"""
    try:
        # Basic counts
        total_packages = Package.objects.count()
        total_reviews = Review.objects.count()
        total_customers = Customer.objects.count()
        
        # Average ratings
        avg_rating = Review.objects.aggregate(avg_rating=Avg('rating'))['avg_rating'] or 0
        
        # Recent reviews
        recent_reviews = Review.objects.select_related('property').order_by('-created_at')[:5]
        reviews_data = ReviewSerializer(recent_reviews, many=True).data
        
        # Package categories distribution
        package_categories = Package.objects.values('category').annotate(count=Count('id'))
        package_categories_data = [
            {'category': pc['category'], 'count': pc['count']} 
            for pc in package_categories
        ]
        
        # Top packages by bookings (mock data for now)
        top_packages = Package.objects.all()[:5]
        top_packages_data = [
            {
                'id': pkg.id,
                'name': pkg.name,
                'bookings': 0,  # Mock data
                'revenue': 0,   # Mock data
                'rating': pkg.rating or 4.5
            }
            for pkg in top_packages
        ]
        
        analytics_data = {
            'totalPackages': total_packages,
            'totalBookings': 0,  # Mock data for now
            'totalRevenue': 0,   # Mock data for now
            'totalCustomers': total_customers,
            'averageRating': round(avg_rating, 1),
            'totalReviews': total_reviews,
            'recentReviews': reviews_data,
            'packageCategories': package_categories_data,
            'topPackages': top_packages_data,
            'bookingStatuses': {
                'pending': 0,
                'confirmed': 0,
                'completed': 0,
                'cancelled': 0
            },
            'monthlyBookings': [
                {'month': 'Jan', 'bookings': 0, 'revenue': 0},
                {'month': 'Feb', 'bookings': 0, 'revenue': 0},
                {'month': 'Mar', 'bookings': 0, 'revenue': 0},
                {'month': 'Apr', 'bookings': 0, 'revenue': 0},
                {'month': 'May', 'bookings': 0, 'revenue': 0},
                {'month': 'Jun', 'bookings': 0, 'revenue': 0},
            ]
        }
        
        return Response(analytics_data)
    except Exception as e:
        return Response(
            {'error': str(e)}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

class PropertyTypeViewSet(viewsets.ModelViewSet):
    queryset = PropertyType.objects.all()
    serializer_class = PropertyTypeSerializer
    permission_classes = [IsAuthenticated]

class AmenityViewSet(viewsets.ModelViewSet):
    queryset = Amenity.objects.all()
    serializer_class = AmenitySerializer
    permission_classes = [IsAuthenticated]

class LocationViewSet(viewsets.ModelViewSet):
    queryset = Location.objects.all()
    serializer_class = LocationSerializer
    permission_classes = [IsAuthenticated]

class DestinationViewSet(viewsets.ModelViewSet):
    queryset = Destination.objects.filter(is_active=True)
    serializer_class = DestinationSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['is_featured', 'atoll', 'is_active']
    
    def get_queryset(self):
        queryset = Destination.objects.filter(is_active=True)
        featured = self.request.query_params.get('featured', None)
        if featured is not None:
            queryset = queryset.filter(is_featured=featured.lower() == 'true')
        return queryset

class ExperienceViewSet(viewsets.ModelViewSet):
    queryset = Experience.objects.filter(is_active=True)
    serializer_class = ExperienceSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['experience_type', 'is_featured', 'is_active', 'difficulty_level']
    
    def get_queryset(self):
        queryset = Experience.objects.filter(is_active=True)
        featured = self.request.query_params.get('featured', None)
        experience_type = self.request.query_params.get('experience_type', None)
        if featured is not None:
            queryset = queryset.filter(is_featured=featured.lower() == 'true')
        if experience_type:
            queryset = queryset.filter(experience_type=experience_type)
        return queryset

class PropertyImageViewSet(viewsets.ModelViewSet):
    queryset = PropertyImage.objects.all()
    serializer_class = PropertyImageSerializer

class PropertyViewSet(viewsets.ModelViewSet):
    queryset = Property.objects.all()
    serializer_class = PropertySerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['amenities', 'property_type', 'location']

    def create(self, request, *args, **kwargs):
        images_data = request.data.pop('images', [])
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        property_obj = serializer.save()
        
        # Create PropertyImage objects
        for image_data in images_data:
            image_path = image_data.get('image')
            if isinstance(image_path, str) and image_path.startswith(settings.MEDIA_URL):
                image_path = image_path[len(settings.MEDIA_URL):]
            PropertyImage.objects.create(
                property=property_obj,
                image=image_path,
                caption=image_data.get('caption', ''),
                order=image_data.get('order', 0),
                is_featured=image_data.get('is_featured', False)
            )
        
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    def update(self, request, *args, **kwargs):
        images_data = request.data.pop('images', [])
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        property_obj = serializer.save()
        
        # Clear existing images if new ones are provided
        if images_data:
            PropertyImage.objects.filter(property=property_obj).delete()
            
            # Create new PropertyImage objects
            for image_data in images_data:
                image_path = image_data.get('image')
                if isinstance(image_path, str) and image_path.startswith(settings.MEDIA_URL):
                    image_path = image_path[len(settings.MEDIA_URL):]
                PropertyImage.objects.create(
                    property=property_obj,
                    image=image_path,
                    caption=image_data.get('caption', ''),
                    order=image_data.get('order', 0),
                    is_featured=image_data.get('is_featured', False)
                )
        
        return Response(serializer.data)

class PackageViewSet(viewsets.ModelViewSet):
    queryset = Package.objects.all()
    serializer_class = PackageSerializerI18n

    def list(self, request, *args, **kwargs):
        """Override list to ensure nested data is returned with proper context"""
        queryset = self.filter_queryset(self.get_queryset())
        serializer = self.get_serializer(queryset, many=True, context={'request': request})
        return Response(serializer.data)

    def _normalize_package_payload(self, data):
        # Normalize destinations: map frontend 'destinations' with nested location to destination_data with location_id
        try:
            destinations = data.get('destinations') or data.get('destination_data') or []
            normalized = []
            from .models import Location
            for dest in destinations:
                loc_obj = dest.get('location') or dest.get('destination') or dest.get('location_obj')
                location_id = dest.get('location_id')
                if not location_id and isinstance(loc_obj, dict):
                    island = loc_obj.get('island')
                    atoll = loc_obj.get('atoll', '')
                    latitude = loc_obj.get('latitude') or loc_obj.get('lat')
                    longitude = loc_obj.get('longitude') or loc_obj.get('lng')
                    if island and latitude is not None and longitude is not None:
                        location, _ = Location.objects.get_or_create(
                            island=island,
                            atoll=atoll,
                            defaults={'latitude': latitude, 'longitude': longitude}
                        )
                    elif island:
                        location, _ = Location.objects.get_or_create(
                            island=island,
                            atoll=atoll,
                            defaults={'latitude': 0.0, 'longitude': 0.0}
                        )
                    else:
                        location = None
                    if location:
                        location_id = location.id
                if location_id:
                    normalized.append({
                        'location_id': location_id,
                        'duration': dest.get('duration', 1),
                        'description': dest.get('description', ''),
                        'highlights': dest.get('highlights', []) or [],
                        'activities': dest.get('activities', []) or [],
                    })
            if normalized:
                data['destination_data'] = normalized
        except Exception:
            pass
        return data

    def create(self, request, *args, **kwargs):
        data = request.data.copy()
        data = self._normalize_package_payload(data)
        images_data = data.pop('images', [])
        serializer = self.get_serializer(data=data)
        serializer.is_valid(raise_exception=True)
        package_obj = serializer.save()
        
        # Create PackageImage objects
        for image_data in images_data:
            image_path = image_data.get('image')
            if isinstance(image_path, str) and image_path.startswith(settings.MEDIA_URL):
                image_path = image_path[len(settings.MEDIA_URL):]
            PackageImage.objects.create(
                package=package_obj,
                image=image_path,
                caption=image_data.get('caption', ''),
                order=image_data.get('order', 0),
                is_featured=image_data.get('is_featured', False)
            )
        
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    def update(self, request, *args, **kwargs):
        data = request.data.copy()
        data = self._normalize_package_payload(data)
        images_data = data.pop('images', [])
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=data, partial=partial)
        serializer.is_valid(raise_exception=True)
        package_obj = serializer.save()
        
        # Clear existing images if new ones are provided
        if images_data:
            PackageImage.objects.filter(package=package_obj).delete()
            
            # Create new PackageImage objects
            for image_data in images_data:
                image_path = image_data.get('image')
                if isinstance(image_path, str) and image_path.startswith(settings.MEDIA_URL):
                    image_path = image_path[len(settings.MEDIA_URL):]
                PackageImage.objects.create(
                    package=package_obj,
                    image=image_path,
                    caption=image_data.get('caption', ''),
                    order=image_data.get('order', 0),
                    is_featured=image_data.get('is_featured', False)
                )
        
        return Response(serializer.data)

class ReviewViewSet(viewsets.ModelViewSet):
    queryset = Review.objects.all()
    serializer_class = ReviewSerializer

# Package-related viewsets
class PackageItineraryViewSet(viewsets.ModelViewSet):
    queryset = PackageItinerary.objects.all()
    serializer_class = PackageItinerarySerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['package']
    ordering_fields = ['day']
    ordering = ['day']

class PackageInclusionViewSet(viewsets.ModelViewSet):
    queryset = PackageInclusion.objects.all()
    serializer_class = PackageInclusionSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['package', 'category']
    ordering_fields = ['category', 'item']
    ordering = ['category', 'item']

class PackageActivityViewSet(viewsets.ModelViewSet):
    queryset = PackageActivity.objects.all()
    serializer_class = PackageActivitySerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['package', 'difficulty', 'category', 'included']
    ordering_fields = ['name', 'difficulty']
    ordering = ['name']

class PackageDestinationViewSet(viewsets.ModelViewSet):
    queryset = PackageDestination.objects.all()
    serializer_class = PackageDestinationSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['package', 'location']
    ordering_fields = ['duration']
    ordering = ['duration']

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

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def upload_image(request):
    """Upload an image and return the URL"""
    try:
        if 'image' not in request.FILES:
            return Response({'error': 'No image file provided'}, status=status.HTTP_400_BAD_REQUEST)
        
        image_file = request.FILES['image']
        
        # Validate file type
        allowed_types = ['image/jpeg', 'image/png', 'image/webp']
        if image_file.content_type not in allowed_types:
            return Response({'error': 'Invalid file type. Only JPG, PNG, and WebP are allowed'}, status=status.HTTP_400_BAD_REQUEST)
        
        # Validate file size (5MB limit)
        if image_file.size > 5 * 1024 * 1024:
            return Response({'error': 'File too large. Maximum size is 5MB'}, status=status.HTTP_400_BAD_REQUEST)
        
        # Generate unique filename
        file_extension = os.path.splitext(image_file.name)[1]
        unique_filename = f"{uuid.uuid4()}{file_extension}"
        
        # Create upload directory if it doesn't exist
        upload_dir = os.path.join(settings.MEDIA_ROOT, 'uploads')
        os.makedirs(upload_dir, exist_ok=True)
        
        # Save file
        file_path = os.path.join(upload_dir, unique_filename)
        with open(file_path, 'wb+') as destination:
            for chunk in image_file.chunks():
                destination.write(chunk)
        
        # Return the URL
        image_url = f"{settings.MEDIA_URL}uploads/{unique_filename}"
        
        return Response({
            'url': image_url,
            'filename': unique_filename,
            'size': image_file.size
        }, status=status.HTTP_201_CREATED)
        
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET'])
@permission_classes([AllowAny])
def search(request):
    """Search across properties, packages, and locations"""
    try:
        query = request.GET.get('q', '').strip()
        if not query:
            return Response({'error': 'Search query is required'}, status=status.HTTP_400_BAD_REQUEST)
        
        # Search properties
        properties = Property.objects.filter(
            models.Q(name__icontains=query) |
            models.Q(description__icontains=query) |
            models.Q(address__icontains=query)
        )[:10]
        
        # Search packages
        packages = Package.objects.filter(
            models.Q(name__icontains=query) |
            models.Q(description__icontains=query)
        )[:10]
        
        # Search locations
        locations = Location.objects.filter(
            models.Q(island__icontains=query) |
            models.Q(atoll__icontains=query)
        )[:10]
        
        results = {
            'properties': PropertySerializer(properties, many=True).data,
            'packages': PackageSerializer(packages, many=True).data,
            'locations': LocationSerializer(locations, many=True).data,
            'query': query
        }
        
        return Response(results)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET'])
@permission_classes([AllowAny])
def content_stats(request):
    """Get content statistics for CMS"""
    try:
        stats = {
            'total_pages': Page.objects.count(),
            'published_pages': Page.objects.filter(status='published').count(),
            'draft_pages': Page.objects.filter(status='draft').count(),
            'total_media': MediaAsset.objects.count(),
            'total_menus': Menu.objects.count(),
            'total_redirects': Redirect.objects.count(),
            'recent_pages': PageSerializer(Page.objects.order_by('-created_at')[:5], many=True).data,
            'recent_media': MediaAssetSerializer(MediaAsset.objects.order_by('-created_at')[:5], many=True).data,
        }
        return Response(stats)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET'])
@permission_classes([AllowAny])
def dashboard_stats(request):
    """Get comprehensive dashboard statistics"""
    try:
        from django.db.models import Count, Avg, Sum
        from datetime import datetime, timedelta
        
        # Date ranges
        today = timezone.now().date()
        last_week = today - timedelta(days=7)
        last_month = today - timedelta(days=30)
        
        stats = {
            # Property stats
            'total_properties': Property.objects.count(),
            'featured_properties': Property.objects.filter(is_featured=True).count(),
            'properties_this_month': Property.objects.filter(created_at__gte=last_month).count(),
            
            # Package stats
            'total_packages': Package.objects.count(),
            'featured_packages': Package.objects.filter(is_featured=True).count(),
            'packages_this_month': Package.objects.filter(created_at__gte=last_month).count(),
            
            # Booking stats
            'total_bookings': Booking.objects.count(),
            'pending_bookings': Booking.objects.filter(status='pending').count(),
            'confirmed_bookings': Booking.objects.filter(status='confirmed').count(),
            'bookings_this_week': Booking.objects.filter(created_at__gte=last_week).count(),
            'bookings_this_month': Booking.objects.filter(created_at__gte=last_month).count(),
            
            # Review stats
            'total_reviews': Review.objects.count(),
            'approved_reviews': Review.objects.filter(approved=True).count(),
            'average_rating': Review.objects.aggregate(avg=Avg('rating'))['avg'] or 0,
            'reviews_this_month': Review.objects.filter(created_at__gte=last_month).count(),
            
            # Customer stats
            'total_customers': Customer.objects.count(),
            'customers_this_month': Customer.objects.filter(created_at__gte=last_month).count(),
            
            # Revenue stats (if you have pricing data)
            'total_revenue': Booking.objects.filter(status='confirmed').aggregate(total=Sum('total_price'))['total'] or 0,
            'revenue_this_month': Booking.objects.filter(status='confirmed', created_at__gte=last_month).aggregate(total=Sum('total_price'))['total'] or 0,
        }
        
        return Response(stats)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

# CMS Viewsets
class PageViewSet(viewsets.ModelViewSet):
    queryset = Page.objects.all()
    serializer_class = PageSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['status', 'locale', 'is_home', 'template', 'created_by']
    search_fields = ['title', 'slug', 'content', 'meta_description', 'meta_keywords']
    ordering_fields = ['created_at', 'updated_at', 'title', 'status']
    ordering = ['-updated_at']

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user, updated_by=self.request.user)

    def perform_update(self, serializer):
        serializer.save(updated_by=self.request.user)

    @action(detail=True, methods=['post'])
    def duplicate(self, request, pk=None):
        """Duplicate a page with all its content and blocks"""
        try:
            page = self.get_object()
            
            # Create new page
            new_page = Page.objects.create(
                title=f"{page.title} (Copy)",
                slug=f"{page.slug}-copy-{uuid.uuid4().hex[:8]}",
                content=page.content,
                meta_description=page.meta_description,
                meta_keywords=page.meta_keywords,
                status='draft',
                locale=page.locale,
                template=page.template,
                seo_title=page.seo_title,
                seo_description=page.seo_description,
                canonical_url=page.canonical_url,
                robots=page.robots,
                og_title=page.og_title,
                og_description=page.og_description,
                json_ld=page.json_ld,
                path=page.path,
                created_by=request.user,
                updated_by=request.user
            )
            
            # Duplicate blocks
            for block in page.blocks.all():
                PageBlock.objects.create(
                    page=new_page,
                    type=block.type,
                    order=block.order,
                    data=block.data,
                    locale_override=block.locale_override,
                    visibility_rules=block.visibility_rules
                )
            
            serializer = self.get_serializer(new_page)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=['post'])
    def publish(self, request, pk=None):
        """Publish a page"""
        try:
            page = self.get_object()
            page.status = 'published'
            page.updated_by = request.user
            page.save()
            
            # Create version snapshot
            PageVersion.objects.create(
                page=page,
                version_number=page.version + 1,
                title=page.title,
                content=page.content,
                meta_description=page.meta_description,
                meta_keywords=page.meta_keywords,
                blocks_data={'blocks': list(page.blocks.values())},
                seo_data={
                    'seo_title': page.seo_title,
                    'seo_description': page.seo_description,
                    'canonical_url': page.canonical_url,
                    'robots': page.robots,
                    'json_ld': page.json_ld,
                },
                created_by=request.user
            )
            
            page.version += 1
            page.save()
            
            serializer = self.get_serializer(page)
            return Response(serializer.data)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=['post'])
    def archive(self, request, pk=None):
        """Archive a page"""
        try:
            page = self.get_object()
            page.status = 'archived'
            page.updated_by = request.user
            page.save()
            serializer = self.get_serializer(page)
            return Response(serializer.data)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=['post'])
    def restore(self, request, pk=None):
        """Restore an archived page"""
        try:
            page = self.get_object()
            page.status = 'draft'
            page.updated_by = request.user
            page.save()
            serializer = self.get_serializer(page)
            return Response(serializer.data)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['post'])
    def bulk_publish(self, request):
        """Bulk publish multiple pages"""
        try:
            page_ids = request.data.get('page_ids', [])
            pages = Page.objects.filter(id__in=page_ids)
            
            for page in pages:
                page.status = 'published'
                page.updated_by = request.user
                page.save()
            
            return Response({'message': f'{pages.count()} pages published successfully'})
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['post'])
    def bulk_archive(self, request):
        """Bulk archive multiple pages"""
        try:
            page_ids = request.data.get('page_ids', [])
            pages = Page.objects.filter(id__in=page_ids)
            
            for page in pages:
                page.status = 'archived'
                page.updated_by = request.user
                page.save()
            
            return Response({'message': f'{pages.count()} pages archived successfully'})
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['post'])
    def bulk_delete(self, request):
        """Bulk delete multiple pages"""
        try:
            page_ids = request.data.get('page_ids', [])
            pages = Page.objects.filter(id__in=page_ids)
            count = pages.count()
            pages.delete()
            
            return Response({'message': f'{count} pages deleted successfully'})
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=['get'])
    def versions(self, request, pk=None):
        """Get all versions of a page"""
        try:
            page = self.get_object()
            versions = page.versions.all()
            serializer = PageVersionSerializer(versions, many=True)
            return Response(serializer.data)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=['post'])
    def revert_to_version(self, request, pk=None):
        """Revert page to a specific version"""
        try:
            page = self.get_object()
            version_number = request.data.get('version_number')
            
            if not version_number:
                return Response({'error': 'Version number is required'}, status=status.HTTP_400_BAD_REQUEST)
            
            version = page.versions.filter(version_number=version_number).first()
            if not version:
                return Response({'error': 'Version not found'}, status=status.HTTP_404_NOT_FOUND)
            
            # Revert page content
            page.title = version.title
            page.content = version.content
            page.meta_description = version.meta_description
            page.meta_keywords = version.meta_keywords
            page.updated_by = request.user
            page.save()
            
            # Revert blocks if available
            if version.blocks_data:
                page.blocks.all().delete()
                for block_data in version.blocks_data.get('blocks', []):
                    PageBlock.objects.create(
                        page=page,
                        type=block_data['type'],
                        order=block_data['order'],
                        data=block_data['data'],
                        locale_override=block_data.get('locale_override', ''),
                        visibility_rules=block_data.get('visibility_rules', {})
                    )
            
            serializer = self.get_serializer(page)
            return Response(serializer.data)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['get'])
    def templates(self, request):
        """Get available page templates"""
        templates = [
            {'id': 'default', 'name': 'Default Template', 'description': 'Standard page layout'},
            {'id': 'full-width', 'name': 'Full Width', 'description': 'Full width content layout'},
            {'id': 'sidebar', 'name': 'Sidebar Layout', 'description': 'Content with sidebar'},
            {'id': 'landing', 'name': 'Landing Page', 'description': 'Landing page template'},
            {'id': 'blog', 'name': 'Blog Post', 'description': 'Blog post template'},
            {'id': 'contact', 'name': 'Contact Page', 'description': 'Contact page template'},
            {'id': 'about', 'name': 'About Page', 'description': 'About page template'},
        ]
        return Response(templates)

    @action(detail=False, methods=['get'])
    def stats(self, request):
        """Get page statistics"""
        try:
            total_pages = Page.objects.count()
            published_pages = Page.objects.filter(status='published').count()
            draft_pages = Page.objects.filter(status='draft').count()
            archived_pages = Page.objects.filter(status='archived').count()
            
            # Pages by locale
            pages_by_locale = Page.objects.values('locale').annotate(count=Count('id'))
            
            # Recent activity
            recent_pages = Page.objects.select_related('created_by', 'updated_by').order_by('-updated_at')[:10]
            recent_data = PageSerializer(recent_pages, many=True).data
            
            stats = {
                'total_pages': total_pages,
                'published_pages': published_pages,
                'draft_pages': draft_pages,
                'archived_pages': archived_pages,
                'pages_by_locale': list(pages_by_locale),
                'recent_pages': recent_data,
            }
            
            return Response(stats)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

class PageBlockViewSet(viewsets.ModelViewSet):
    queryset = PageBlock.objects.all()
    serializer_class = PageBlockSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['page', 'type']
    ordering_fields = ['order']
    ordering = ['order']

class MediaAssetViewSet(viewsets.ModelViewSet):
    queryset = MediaAsset.objects.all()
    serializer_class = MediaAssetSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['mime_type', 'created_by']
    search_fields = ['alt_text', 'caption', 'tags']
    ordering_fields = ['created_at', 'file_size']
    ordering = ['-created_at']
    
    def list(self, request, *args, **kwargs):
        return super().list(request, *args, **kwargs)

class MenuViewSet(viewsets.ModelViewSet):
    queryset = Menu.objects.all()
    serializer_class = MenuSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['locale', 'is_active']
    search_fields = ['name', 'slug']
    ordering_fields = ['name', 'created_at']
    ordering = ['name']

class MenuItemViewSet(viewsets.ModelViewSet):
    queryset = MenuItem.objects.all()
    serializer_class = MenuItemSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['menu', 'link_type', 'is_active', 'parent']
    ordering_fields = ['order', 'title']
    ordering = ['order']

class RedirectViewSet(viewsets.ModelViewSet):
    queryset = Redirect.objects.all()
    serializer_class = RedirectSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['status_code', 'locale', 'is_active']
    search_fields = ['from_path', 'to_path']
    ordering_fields = ['created_at']
    ordering = ['-created_at']

class PageVersionViewSet(viewsets.ModelViewSet):
    queryset = PageVersion.objects.all()
    serializer_class = PageVersionSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['page', 'created_by']
    ordering_fields = ['version_number', 'created_at']
    ordering = ['-version_number']

class PageReviewViewSet(viewsets.ModelViewSet):
    queryset = PageReview.objects.all()
    serializer_class = PageReviewSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['page', 'reviewer', 'status']
    ordering_fields = ['created_at']
    ordering = ['-created_at']

class CommentThreadViewSet(viewsets.ModelViewSet):
    queryset = CommentThread.objects.all()
    serializer_class = CommentThreadSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['page', 'created_by', 'is_resolved']
    search_fields = ['title']
    ordering_fields = ['created_at']
    ordering = ['-created_at']

class CommentViewSet(viewsets.ModelViewSet):
    queryset = Comment.objects.all()
    serializer_class = CommentSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['thread', 'author']
    search_fields = ['content']
    ordering_fields = ['created_at']
    ordering = ['created_at']

# Transportation Viewsets
class TransferTypeViewSet(viewsets.ModelViewSet):
    queryset = TransferType.objects.filter(is_active=True)
    serializer_class = TransferTypeSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['is_active']
    ordering_fields = ['order', 'name']
    ordering = ['order']

class AtollTransferViewSet(viewsets.ModelViewSet):
    queryset = AtollTransfer.objects.filter(is_active=True)
    serializer_class = AtollTransferSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['is_active']
    ordering_fields = ['order', 'atoll_name']
    ordering = ['order']

class ResortTransferViewSet(viewsets.ModelViewSet):
    queryset = ResortTransfer.objects.filter(is_active=True)
    serializer_class = ResortTransferSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['atoll', 'transfer_type', 'is_active']
    ordering_fields = ['order', 'resort_name']
    ordering = ['atoll', 'order']

class TransferFAQViewSet(viewsets.ModelViewSet):
    queryset = TransferFAQ.objects.filter(is_active=True)
    serializer_class = TransferFAQSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['category', 'is_active']
    search_fields = ['question', 'answer']
    ordering_fields = ['order', 'category']
    ordering = ['category', 'order']

class TransferContactMethodViewSet(viewsets.ModelViewSet):
    queryset = TransferContactMethod.objects.filter(is_active=True)
    serializer_class = TransferContactMethodSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['is_active']
    ordering_fields = ['order', 'method']
    ordering = ['order']

class TransferBookingStepViewSet(viewsets.ModelViewSet):
    queryset = TransferBookingStep.objects.filter(is_active=True)
    serializer_class = TransferBookingStepSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['is_active']
    ordering_fields = ['step_number']
    ordering = ['step_number']

class TransferBenefitViewSet(viewsets.ModelViewSet):
    queryset = TransferBenefit.objects.filter(is_active=True)
    serializer_class = TransferBenefitSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['is_active']
    ordering_fields = ['order', 'benefit']
    ordering = ['order']

class TransferPricingFactorViewSet(viewsets.ModelViewSet):
    queryset = TransferPricingFactor.objects.filter(is_active=True)
    serializer_class = TransferPricingFactorSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['impact', 'is_active']
    ordering_fields = ['order', 'factor']
    ordering = ['order']

class TransferContentViewSet(viewsets.ModelViewSet):
    queryset = TransferContent.objects.filter(is_active=True)
    serializer_class = TransferContentSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['section', 'is_active']
    search_fields = ['title', 'description']
    ordering_fields = ['order', 'section']
    ordering = ['order']

class FerryScheduleViewSet(viewsets.ModelViewSet):
    queryset = FerrySchedule.objects.filter(is_active=True)
    serializer_class = FerryScheduleSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['is_active']
    search_fields = ['route_name']
    ordering_fields = ['route_name', 'departure_time']
    ordering = ['route_name', 'departure_time']

@api_view(['GET'])
def transportation_data(request):
    """Get all transportation data for the frontend"""
    try:
        data = {
            'transfer_types': TransferTypeSerializer(TransferType.objects.filter(is_active=True), many=True).data,
            'atoll_transfers': AtollTransferSerializer(AtollTransfer.objects.filter(is_active=True), many=True).data,
            'faqs': TransferFAQSerializer(TransferFAQ.objects.filter(is_active=True), many=True).data,
            'contact_methods': TransferContactMethodSerializer(TransferContactMethod.objects.filter(is_active=True), many=True).data,
            'booking_steps': TransferBookingStepSerializer(TransferBookingStep.objects.filter(is_active=True), many=True).data,
            'benefits': TransferBenefitSerializer(TransferBenefit.objects.filter(is_active=True), many=True).data,
            'pricing_factors': TransferPricingFactorSerializer(TransferPricingFactor.objects.filter(is_active=True), many=True).data,
            'content': TransferContentSerializer(TransferContent.objects.filter(is_active=True), many=True).data,
            'ferry_schedules': FerryScheduleSerializer(FerrySchedule.objects.filter(is_active=True), many=True).data,
        }
        return Response(data)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class HomepageHeroViewSet(viewsets.ModelViewSet):
    """ViewSet for managing homepage hero section"""
    queryset = HomepageHero.objects.all()
    serializer_class = HomepageHeroSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        if self.action == 'list':
            return HomepageHero.objects.filter(is_active=True)
        return HomepageHero.objects.all()
    
    @action(detail=False, methods=['get'])
    def active(self, request):
        """Get the active hero section"""
        hero = HomepageHero.objects.filter(is_active=True).first()
        if hero:
            serializer = self.get_serializer(hero)
            return Response(serializer.data)
        return Response({'error': 'No active hero section found'}, status=404)


class HomepageFeatureViewSet(viewsets.ModelViewSet):
    """ViewSet for managing homepage features"""
    queryset = HomepageFeature.objects.all()
    serializer_class = HomepageFeatureSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        if self.action == 'list':
            return HomepageFeature.objects.filter(is_active=True).order_by('order')
        return HomepageFeature.objects.all().order_by('order')
    
    @action(detail=False, methods=['post'])
    def reorder(self, request):
        """Reorder features"""
        feature_ids = request.data.get('feature_ids', [])
        for index, feature_id in enumerate(feature_ids):
            HomepageFeature.objects.filter(id=feature_id).update(order=index)
        return Response({'message': 'Features reordered successfully'})


class HomepageTestimonialViewSet(viewsets.ModelViewSet):
    """ViewSet for managing homepage testimonials"""
    queryset = HomepageTestimonial.objects.all()
    serializer_class = HomepageTestimonialSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        if self.action == 'list':
            return HomepageTestimonial.objects.filter(is_active=True).order_by('order')
        return HomepageTestimonial.objects.all().order_by('order')
    
    @action(detail=False, methods=['post'])
    def reorder(self, request):
        """Reorder testimonials"""
        testimonial_ids = request.data.get('testimonial_ids', [])
        for index, testimonial_id in enumerate(testimonial_ids):
            HomepageTestimonial.objects.filter(id=testimonial_id).update(order=index)
        return Response({'message': 'Testimonials reordered successfully'})


class HomepageStatisticViewSet(viewsets.ModelViewSet):
    """ViewSet for managing homepage statistics"""
    queryset = HomepageStatistic.objects.all()
    serializer_class = HomepageStatisticSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        if self.action == 'list':
            return HomepageStatistic.objects.filter(is_active=True).order_by('order')
        return HomepageStatistic.objects.all().order_by('order')
    
    @action(detail=False, methods=['post'])
    def reorder(self, request):
        """Reorder statistics"""
        statistic_ids = request.data.get('statistic_ids', [])
        for index, statistic_id in enumerate(statistic_ids):
            HomepageStatistic.objects.filter(id=statistic_id).update(order=index)
        return Response({'message': 'Statistics reordered successfully'})


class HomepageCTASectionViewSet(viewsets.ModelViewSet):
    """ViewSet for managing homepage CTA section"""
    queryset = HomepageCTASection.objects.all()
    serializer_class = HomepageCTASectionSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        if self.action == 'list':
            return HomepageCTASection.objects.filter(is_active=True)
        return HomepageCTASection.objects.all()
    
    @action(detail=False, methods=['get'])
    def active(self, request):
        """Get the active CTA section"""
        cta = HomepageCTASection.objects.filter(is_active=True).first()
        if cta:
            serializer = self.get_serializer(cta)
            return Response(serializer.data)
        return Response({'error': 'No active CTA section found'}, status=404)


class HomepageImageViewSet(viewsets.ModelViewSet):
    """ViewSet for homepage images"""
    queryset = HomepageImage.objects.all()
    serializer_class = HomepageImageSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        queryset = HomepageImage.objects.all()
        image_type = self.request.query_params.get('type', None)
        if image_type:
            queryset = queryset.filter(image_type=image_type)
        return queryset.order_by('order', 'created_at')
    
    @action(detail=False, methods=['post'])
    def upload_multiple(self, request):
        """Upload multiple images at once"""
        try:
            images = request.FILES.getlist('images')
            image_type = request.data.get('image_type', 'gallery')
            uploaded_images = []
            
            for i, image in enumerate(images):
                image_obj = HomepageImage.objects.create(
                    image=image,
                    title=request.data.get('title', f'Image {i+1}'),
                    alt_text=request.data.get('alt_text', ''),
                    image_type=image_type,
                    order=i
                )
                uploaded_images.append(self.get_serializer(image_obj).data)
            
            return Response({
                'message': f'Successfully uploaded {len(uploaded_images)} images',
                'images': uploaded_images
            })
        except Exception as e:
            return Response({'error': str(e)}, status=400)

class HomepageSettingsViewSet(viewsets.ModelViewSet):
    """ViewSet for managing homepage settings"""
    queryset = HomepageSettings.objects.all()
    serializer_class = HomepageSettingsSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return HomepageSettings.objects.all()
    
    def list(self, request):
        """Get or create settings"""
        settings = HomepageSettings.get_settings()
        serializer = self.get_serializer(settings)
        return Response(serializer.data)
    
    def create(self, request):
        """Update settings"""
        settings = HomepageSettings.get_settings()
        serializer = self.get_serializer(settings, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=400)


class HomepageContentViewSet(viewsets.ModelViewSet):
    """ViewSet for managing homepage content sections"""
    queryset = HomepageContent.objects.all()
    serializer_class = HomepageContentSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        if self.action == 'list':
            return HomepageContent.objects.filter(is_active=True).order_by('order')
        return HomepageContent.objects.all().order_by('order')


class HomepageManagementViewSet(viewsets.ViewSet):
    """ViewSet for comprehensive homepage management"""
    permission_classes = [IsAuthenticated]
    
    def get_permissions(self):
        """Allow public access to public_content endpoint"""
        if self.action == 'public_content':
            return []
        return super().get_permissions()
    
    @action(detail=False, methods=['get'])
    def dashboard_data(self, request):
        """Get all homepage data for dashboard"""
        try:
            hero = HomepageHero.objects.filter(is_active=True).first()
            features = HomepageFeature.objects.filter(is_active=True).order_by('order')
            testimonials = HomepageTestimonial.objects.filter(is_active=True).order_by('order')
            statistics = HomepageStatistic.objects.filter(is_active=True).order_by('order')
            cta_section = HomepageCTASection.objects.filter(is_active=True).first()
            settings = HomepageSettings.get_settings()
            page_heroes = {h.page_key: h for h in PageHero.objects.filter(is_active=True)}
            
            data = {
                'hero': HomepageHeroSerializer(hero, context={'request': request}).data if hero else None,
                'features': HomepageFeatureSerializer(features, many=True, context={'request': request}).data,
                'testimonials': HomepageTestimonialSerializer(testimonials, many=True, context={'request': request}).data,
                'statistics': HomepageStatisticSerializer(statistics, many=True).data,
                'cta_section': HomepageCTASectionSerializer(cta_section, context={'request': request}).data if cta_section else None,
                'settings': HomepageSettingsSerializer(settings).data,
                'page_heroes': {k: PageHeroSerializer(v, context={'request': request}).data for k, v in page_heroes.items()}
            }
            
            return Response(data)
        except Exception as e:
            return Response({'error': str(e)}, status=500)

    @action(detail=False, methods=['get'])
    def public_content(self, request):
        """Get public homepage content (no authentication required)"""
        try:
            hero = HomepageHero.objects.filter(is_active=True).first()
            features = HomepageFeature.objects.filter(is_active=True).order_by('order')
            testimonials = HomepageTestimonial.objects.filter(is_active=True).order_by('order')
            statistics = HomepageStatistic.objects.filter(is_active=True).order_by('order')
            cta_section = HomepageCTASection.objects.filter(is_active=True).first()
            settings = HomepageSettings.get_settings()
            page_heroes = {h.page_key: h for h in PageHero.objects.filter(is_active=True)}
            
            data = {
                'hero': HomepageHeroSerializer(hero, context={'request': request}).data if hero else None,
                'features': HomepageFeatureSerializer(features, many=True, context={'request': request}).data,
                'testimonials': HomepageTestimonialSerializer(testimonials, many=True, context={'request': request}).data,
                'statistics': HomepageStatisticSerializer(statistics, many=True).data,
                'cta_section': HomepageCTASectionSerializer(cta_section, context={'request': request}).data if cta_section else None,
                'settings': HomepageSettingsSerializer(settings).data,
                'page_heroes': {k: PageHeroSerializer(v, context={'request': request}).data for k, v in page_heroes.items()}
            }
            
            response = Response(data)
            # Add caching headers for better performance
            response['Cache-Control'] = 'public, max-age=300'  # Cache for 5 minutes
            response['ETag'] = f'"homepage-{hash(str(data))}"'  # ETag for conditional requests
            return response
        except Exception as e:
            return Response({'error': str(e)}, status=500)
    


class PageHeroViewSet(viewsets.ModelViewSet):
    queryset = PageHero.objects.all()
    serializer_class = PageHeroSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

    def get_permissions(self):
        if self.action in ['list', 'retrieve']:  # public read
            return [AllowAny()]
        return super().get_permissions()

    def get_queryset(self):
        qs = super().get_queryset()
        page_key = self.request.query_params.get('page_key')
        if page_key:
            qs = qs.filter(page_key=page_key)
        is_active = self.request.query_params.get('active')
        if is_active == 'true':
            qs = qs.filter(is_active=True)
        return qs
    
    @action(detail=False, methods=['post'])
    def bulk_update(self, request):
        """Bulk update homepage data"""
        try:
            with transaction.atomic():
                data = request.data
                
                # Handle hero section
                if 'hero' in data:
                    hero_data = data['hero']
                    if isinstance(hero_data, str):
                        hero_data = json.loads(hero_data)
                    
                    hero = HomepageHero.objects.filter(is_active=True).first()
                    if not hero:
                        hero = HomepageHero.objects.create(is_active=True)
                    
                    # Handle file upload for main background image
                    if 'hero.background_image' in request.FILES:
                        hero_data['background_image'] = request.FILES['hero.background_image']
                    
                    # Ensure background_images is properly handled
                    if 'background_images' in hero_data:
                        # Make sure it's a list of URLs
                        if isinstance(hero_data['background_images'], list):
                            # Filter out any None or empty values
                            hero_data['background_images'] = [
                                url for url in hero_data['background_images'] 
                                if url and url.strip()
                            ]
                    
                    serializer = HomepageHeroSerializer(hero, data=hero_data, partial=True, context={'request': request})
                    if serializer.is_valid():
                        serializer.save()
                    else:
                        print(f"Hero serializer errors: {serializer.errors}")
                
                # Update features
                if 'features' in data:
                    features_data = data['features']
                    if isinstance(features_data, str):
                        features_data = json.loads(features_data)
                    
                    # Get existing features to track which ones to keep
                    existing_feature_ids = set(HomepageFeature.objects.filter(is_active=True).values_list('id', flat=True))
                    updated_feature_ids = set()
                    
                    for feature_data in features_data:
                        feature_id = feature_data.get('id')
                        if feature_id and feature_id in existing_feature_ids:
                            # Update existing feature
                            try:
                                feature = HomepageFeature.objects.get(id=feature_id)
                                serializer = HomepageFeatureSerializer(feature, data=feature_data, partial=True, context={'request': request})
                                if serializer.is_valid():
                                    serializer.save()
                                    updated_feature_ids.add(feature_id)
                            except HomepageFeature.DoesNotExist:
                                continue
                        else:
                            # Create new feature
                            serializer = HomepageFeatureSerializer(data=feature_data, context={'request': request})
                            if serializer.is_valid():
                                feature = serializer.save()
                                updated_feature_ids.add(feature.id)
                    
                    # Deactivate features that weren't updated (optional cleanup)
                    # features_to_deactivate = existing_feature_ids - updated_feature_ids
                    # HomepageFeature.objects.filter(id__in=features_to_deactivate).update(is_active=False)
                
                # Update testimonials
                if 'testimonials' in data:
                    testimonials_data = data['testimonials']
                    if isinstance(testimonials_data, str):
                        testimonials_data = json.loads(testimonials_data)
                    
                    # Get existing testimonials to track which ones to keep
                    existing_testimonial_ids = set(HomepageTestimonial.objects.filter(is_active=True).values_list('id', flat=True))
                    updated_testimonial_ids = set()
                    
                    for testimonial_data in testimonials_data:
                        testimonial_id = testimonial_data.get('id')
                        if testimonial_id and testimonial_id in existing_testimonial_ids:
                            # Update existing testimonial
                            try:
                                testimonial = HomepageTestimonial.objects.get(id=testimonial_id)
                                serializer = HomepageTestimonialSerializer(testimonial, data=testimonial_data, partial=True, context={'request': request})
                                if serializer.is_valid():
                                    serializer.save()
                                    updated_testimonial_ids.add(testimonial_id)
                            except HomepageTestimonial.DoesNotExist:
                                continue
                        else:
                            # Create new testimonial
                            serializer = HomepageTestimonialSerializer(data=testimonial_data, context={'request': request})
                            if serializer.is_valid():
                                testimonial = serializer.save()
                                updated_testimonial_ids.add(testimonial.id)
                
                # Update statistics
                if 'statistics' in data:
                    statistics_data = data['statistics']
                    if isinstance(statistics_data, str):
                        statistics_data = json.loads(statistics_data)
                    
                    # Get existing statistics to track which ones to keep
                    existing_statistic_ids = set(HomepageStatistic.objects.filter(is_active=True).values_list('id', flat=True))
                    updated_statistic_ids = set()
                    
                    for statistic_data in statistics_data:
                        statistic_id = statistic_data.get('id')
                        if statistic_id and statistic_id in existing_statistic_ids:
                            # Update existing statistic
                            try:
                                statistic = HomepageStatistic.objects.get(id=statistic_id)
                                serializer = HomepageStatisticSerializer(statistic, data=statistic_data, partial=True)
                                if serializer.is_valid():
                                    serializer.save()
                                    updated_statistic_ids.add(statistic_id)
                            except HomepageStatistic.DoesNotExist:
                                continue
                        else:
                            # Create new statistic
                            serializer = HomepageStatisticSerializer(data=statistic_data)
                            if serializer.is_valid():
                                statistic = serializer.save()
                                updated_statistic_ids.add(statistic.id)
                
                # Update CTA section
                if 'cta_section' in data:
                    cta_data = data['cta_section']
                    if isinstance(cta_data, str):
                        cta_data = json.loads(cta_data)
                    
                    cta = HomepageCTASection.objects.filter(is_active=True).first()
                    if not cta:
                        cta = HomepageCTASection.objects.create(is_active=True)
                    
                    serializer = HomepageCTASectionSerializer(cta, data=cta_data, partial=True, context={'request': request})
                    if serializer.is_valid():
                        serializer.save()
                
                # Update settings
                if 'settings' in data:
                    settings_data = data['settings']
                    if isinstance(settings_data, str):
                        settings_data = json.loads(settings_data)
                    
                    settings = HomepageSettings.get_settings()
                    serializer = HomepageSettingsSerializer(settings, data=settings_data, partial=True)
                    if serializer.is_valid():
                        serializer.save()
                
                return Response({'message': 'Homepage updated successfully'})
        except Exception as e:
            return Response({'error': str(e)}, status=500)

@api_view(['GET'])
@permission_classes([AllowAny])
def page_by_slug(request, slug):
    """Get a published page by slug"""
    try:
        page = Page.objects.filter(slug=slug, status='published').first()
        if not page:
            return Response({'error': 'Page not found'}, status=status.HTTP_404_NOT_FOUND)
        
        serializer = PageSerializer(page, context={'request': request})
        return Response(serializer.data)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

# Internationalization Views

@api_view(['GET'])
@permission_classes([AllowAny])
def languages(request):
    """Get all supported languages"""
    languages = Language.objects.filter(is_active=True)
    serializer = LanguageSerializer(languages, many=True)
    return Response(serializer.data)


@api_view(['GET'])
@permission_classes([AllowAny])
def language_detail(request, code):
    """Get specific language details"""
    try:
        language = Language.objects.get(code=code, is_active=True)
        serializer = LanguageSerializer(language)
        return Response(serializer.data)
    except Language.DoesNotExist:
        return Response({'error': 'Language not found'}, status=404)


@api_view(['GET'])
@permission_classes([AllowAny])
def translations(request):
    """Get translations for a specific language"""
    language_code = request.GET.get('lang', 'en')
    context = request.GET.get('context', '')
    
    try:
        language = Language.objects.get(code=language_code, is_active=True)
    except Language.DoesNotExist:
        language = Language.objects.filter(is_default=True).first()
    
    if not language:
        return Response({'error': 'No default language found'}, status=404)
    
    # Get translations
    translations = Translation.objects.filter(
        language=language,
        is_approved=True
    ).select_related('key')
    
    if context:
        translations = translations.filter(key__context=context)
    
    # Format as nested dictionary
    translation_dict = {}
    for translation in translations:
        keys = translation.key.key.split('.')
        current = translation_dict
        for key in keys[:-1]:
            if key not in current:
                current[key] = {}
            current = current[key]
        current[keys[-1]] = translation.value
    
    return Response(translation_dict)


@api_view(['GET'])
@permission_classes([AllowAny])
def translation_keys(request):
    """Get all translation keys"""
    keys = TranslationKey.objects.filter(is_active=True)
    serializer = TranslationKeySerializer(keys, many=True)
    return Response(serializer.data)


@api_view(['POST'])
def create_translation(request):
    """Create a new translation"""
    serializer = TranslationSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save(created_by=request.user)
        return Response(serializer.data, status=201)
    return Response(serializer.errors, status=400)


@api_view(['PUT'])
def update_translation(request, pk):
    """Update a translation"""
    try:
        translation = Translation.objects.get(pk=pk)
        serializer = TranslationSerializer(translation, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=400)
    except Translation.DoesNotExist:
        return Response({'error': 'Translation not found'}, status=404)


@api_view(['POST'])
def bulk_translations(request):
    """Bulk create/update translations"""
    serializer = TranslationBulkSerializer(data=request.data)
    if serializer.is_valid():
        language_code = serializer.validated_data['language_code']
        translations_data = serializer.validated_data['translations']
        
        try:
            language = Language.objects.get(code=language_code)
        except Language.DoesNotExist:
            return Response({'error': 'Language not found'}, status=404)
        
        created_translations = []
        for key, value in translations_data.items():
            translation_key, created = TranslationKey.objects.get_or_create(
                key=key,
                defaults={'description': f'Auto-generated key: {key}'}
            )
            
            translation, created = Translation.objects.get_or_create(
                key=translation_key,
                language=language,
                defaults={'value': value, 'created_by': request.user}
            )
            
            if not created:
                translation.value = value
                translation.save()
            
            created_translations.append(translation)
        
        serializer = TranslationSerializer(created_translations, many=True)
        return Response(serializer.data, status=201)
    
    return Response(serializer.errors, status=400)


@api_view(['GET'])
@permission_classes([AllowAny])
def cultural_content(request):
    """Get cultural content for a specific language"""
    language_code = request.GET.get('lang', 'en')
    content_type = request.GET.get('type', '')
    
    try:
        language = Language.objects.get(code=language_code, is_active=True)
    except Language.DoesNotExist:
        language = Language.objects.filter(is_default=True).first()
    
    if not language:
        return Response({'error': 'No default language found'}, status=404)
    
    content = CulturalContent.objects.filter(
        language=language,
        is_active=True
    )
    
    if content_type:
        content = content.filter(content_type=content_type)
    
    serializer = CulturalContentSerializer(content, many=True)
    return Response(serializer.data)


@api_view(['GET'])
@permission_classes([AllowAny])
def regional_settings(request, language_code):
    """Get regional settings for a specific language"""
    try:
        settings = RegionalSettings.objects.get(
            language__code=language_code,
            is_active=True
        )
        serializer = RegionalSettingsSerializer(settings)
        return Response(serializer.data)
    except RegionalSettings.DoesNotExist:
        # Return default settings
        default_settings = {
            'currency_code': 'USD',
            'currency_symbol': '$',
            'date_format': 'MM/DD/YYYY',
            'time_format': '12',
            'timezone': 'UTC'
        }
        return Response(default_settings)


@api_view(['GET'])
@permission_classes([AllowAny])
def localized_page(request, page_type, language_code):
    """Get localized page content"""
    try:
        page = LocalizedPage.objects.get(
            page_type=page_type,
            language__code=language_code,
            is_active=True
        )
        serializer = LocalizedPageSerializer(page)
        return Response(serializer.data)
    except LocalizedPage.DoesNotExist:
        # Try to get default language version
        try:
            default_language = Language.objects.filter(is_default=True).first()
            if default_language:
                page = LocalizedPage.objects.get(
                    page_type=page_type,
                    language=default_language,
                    is_active=True
                )
                serializer = LocalizedPageSerializer(page)
                return Response(serializer.data)
        except LocalizedPage.DoesNotExist:
            pass
        
        return Response({'error': 'Page not found'}, status=404)


@api_view(['GET'])
@permission_classes([AllowAny])
def localized_faqs(request):
    """Get localized FAQs"""
    language_code = request.GET.get('lang', 'en')
    category = request.GET.get('category', '')
    
    try:
        language = Language.objects.get(code=language_code, is_active=True)
    except Language.DoesNotExist:
        language = Language.objects.filter(is_default=True).first()
    
    if not language:
        return Response({'error': 'No default language found'}, status=404)
    
    faqs = LocalizedFAQ.objects.filter(
        language=language,
        is_active=True
    )
    
    if category:
        faqs = faqs.filter(category=category)
    
    serializer = LocalizedFAQSerializer(faqs, many=True)
    return Response(serializer.data)


@api_view(['GET'])
@permission_classes([AllowAny])
def translation_stats(request):
    """Get translation statistics"""
    language_code = request.GET.get('lang', 'en')
    
    try:
        language = Language.objects.get(code=language_code)
    except Language.DoesNotExist:
        return Response({'error': 'Language not found'}, status=404)
    
    total_keys = TranslationKey.objects.filter(is_active=True).count()
    translated_keys = Translation.objects.filter(language=language).count()
    approved_keys = Translation.objects.filter(language=language, is_approved=True).count()
    pending_keys = translated_keys - approved_keys
    completion_percentage = (translated_keys / total_keys * 100) if total_keys > 0 else 0
    
    stats = {
        'language_code': language_code,
        'total_keys': total_keys,
        'translated_keys': translated_keys,
        'approved_keys': approved_keys,
        'pending_keys': pending_keys,
        'completion_percentage': round(completion_percentage, 2),
        'last_updated': Translation.objects.filter(language=language).aggregate(
            last_updated=models.Max('updated_at')
        )['last_updated']
    }
    
    return Response(stats)


@api_view(['POST'])
@permission_classes([AllowAny])
def detect_language(request):
    """Detect language from text"""
    serializer = LanguageDetectionSerializer(data=request.data)
    if serializer.is_valid():
        text = serializer.validated_data['text']
        confidence_threshold = serializer.validated_data['confidence_threshold']
        
        # Simple language detection (you can integrate with a proper service)
        # This is a basic implementation - consider using langdetect or similar
        detected_language = 'en'  # Default fallback
        
        # Simple heuristics for common languages
        if any(char in text for char in 'аеёиоуыэюя'):
            detected_language = 'ru'
        elif any(char in text for char in '的是一在有人我他她它'):
            detected_language = 'zh'
        
        return Response({
            'detected_language': detected_language,
            'confidence': 0.8,
            'text_length': len(text)
        })
    
    return Response(serializer.errors, status=400)


@api_view(['GET'])
@permission_classes([AllowAny])
def export_translations(request):
    """Export translations for a language"""
    serializer = TranslationExportSerializer(data=request.GET)
    if serializer.is_valid():
        language_code = serializer.validated_data['language_code']
        export_format = serializer.validated_data['format']
        
        try:
            language = Language.objects.get(code=language_code)
        except Language.DoesNotExist:
            return Response({'error': 'Language not found'}, status=404)
        
        translations = Translation.objects.filter(
            language=language,
            is_approved=True
        ).select_related('key')
        
        # Format translations for export
        export_data = {}
        for translation in translations:
            export_data[translation.key.key] = translation.value
        
        if export_format == 'json':
            return Response(export_data)
        else:
            # For CSV/XLSX, you would need to implement file generation
            return Response({'error': 'Format not yet implemented'}, status=501)
    
    return Response(serializer.errors, status=400)


@api_view(['POST'])
def import_translations(request):
    """Import translations from file"""
    serializer = TranslationImportSerializer(data=request.data)
    if serializer.is_valid():
        language_code = serializer.validated_data['language_code']
        file = serializer.validated_data['file']
        import_format = serializer.validated_data['format']
        overwrite = serializer.validated_data['overwrite']
        
        try:
            language = Language.objects.get(code=language_code)
        except Language.DoesNotExist:
            return Response({'error': 'Language not found'}, status=404)
        
        # Parse file based on format
        if import_format == 'json':
            import json
            try:
                translations_data = json.load(file)
            except json.JSONDecodeError:
                return Response({'error': 'Invalid JSON file'}, status=400)
        else:
            return Response({'error': 'Format not yet implemented'}, status=501)
        
        # Process translations
        imported_count = 0
        for key, value in translations_data.items():
            translation_key, created = TranslationKey.objects.get_or_create(
                key=key,
                defaults={'description': f'Imported key: {key}'}
            )
            
            if overwrite:
                translation, created = Translation.objects.get_or_create(
                    key=translation_key,
                    language=language,
                    defaults={'value': value, 'created_by': request.user}
                )
                if not created:
                    translation.value = value
                    translation.save()
            else:
                translation, created = Translation.objects.get_or_create(
                    key=translation_key,
                    language=language,
                    defaults={'value': value, 'created_by': request.user}
                )
            
            if created:
                imported_count += 1
        
        return Response({
            'message': f'Successfully imported {imported_count} translations',
            'imported_count': imported_count
        })
    
    return Response(serializer.errors, status=400)


# Enhanced existing views with internationalization support

@api_view(['GET'])
@permission_classes([AllowAny])
def destinations(request):
    """Get destinations with language support"""
    language_code = request.GET.get('lang', 'en')
    
    try:
        language = Language.objects.get(code=language_code, is_active=True)
    except Language.DoesNotExist:
        language = Language.objects.filter(is_default=True).first()
    
    destinations = Destination.objects.filter(is_active=True)
    
    # If language is specified, filter by language or show base content
    if language:
        # Get destinations with this language or base destinations
        destinations = destinations.filter(
            models.Q(language=language) | models.Q(language__isnull=True)
        )
    
    serializer = DestinationSerializer(destinations, many=True)
    return Response(serializer.data)


@api_view(['GET', 'POST'])
@permission_classes([AllowAny])
def packages(request):
    """Get packages with language support, and accept POST for create to match frontend."""
    if request.method == 'GET':
        language_code = request.GET.get('lang', 'en')
        try:
            language = Language.objects.get(code=language_code, is_active=True)
        except Language.DoesNotExist:
            language = Language.objects.filter(is_default=True).first()
        packages_qs = Package.objects.filter(is_active=True)
        if language:
            packages_qs = packages_qs.filter(
                models.Q(language=language) | models.Q(language__isnull=True)
            )
        serializer = PackageSerializerI18n(packages_qs, many=True, context={'request': request})
        return Response(serializer.data)

    # POST: normalize and create package with nested data and images
    data = request.data.copy()
    viewset = PackageViewSet()
    viewset.request = request
    data = viewset._normalize_package_payload(data)
    images_data = data.pop('images', [])
    serializer = PackageSerializerI18n(data=data)
    serializer.is_valid(raise_exception=True)
    package_obj = serializer.save()

    for image_data in images_data:
        image_path = image_data.get('image')
        if isinstance(image_path, str) and image_path.startswith(settings.MEDIA_URL):
            image_path = image_path[len(settings.MEDIA_URL):]
        PackageImage.objects.create(
            package=package_obj,
            image=image_path,
            caption=image_data.get('caption', ''),
            order=image_data.get('order', 0),
            is_featured=image_data.get('is_featured', False)
        )
    return Response(serializer.data, status=status.HTTP_201_CREATED)


@api_view(['GET'])
@permission_classes([AllowAny])
def properties(request):
    """Get properties with language support"""
    language_code = request.GET.get('lang', 'en')
    
    try:
        language = Language.objects.get(code=language_code, is_active=True)
    except Language.DoesNotExist:
        language = Language.objects.filter(is_default=True).first()
    
    properties = Property.objects.filter(is_active=True)
    
    # If language is specified, filter by language or show base content
    if language:
        properties = properties.filter(
            models.Q(language=language) | models.Q(language__isnull=True)
        )
    
    serializer = PropertySerializer(properties, many=True)
    return Response(serializer.data)

class PackageImageViewSet(viewsets.ModelViewSet):
    """ViewSet for managing package images separately"""
    queryset = PackageImage.objects.all()
    serializer_class = PackageImageSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        """Filter by package if package_id is provided"""
        queryset = PackageImage.objects.all()
        package_id = self.request.query_params.get('package_id', None)
        if package_id is not None:
            queryset = queryset.filter(package_id=package_id)
        return queryset.order_by('order', 'id')
    
    def create(self, request, *args, **kwargs):
        """Override create to add debugging and ensure proper context"""
        try:
            print(f"PackageImageViewSet.create called with data: {request.data}")
            print(f"Files: {request.FILES}")
            
            # Ensure serializer has request context for image_url generation
            serializer = self.get_serializer(data=request.data, context={'request': request})
            serializer.is_valid(raise_exception=True)
            self.perform_create(serializer)
            headers = self.get_success_headers(serializer.data)
            return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)
        except Exception as e:
            print(f"Error in PackageImageViewSet.create: {str(e)}")
            raise
    
    def perform_create(self, serializer):
        """Create image with proper file handling"""
        try:
            image_data = self.request.data
            package_id = image_data.get('package_id')
            
            if not package_id:
                raise serializers.ValidationError("package_id is required")
            
            # Check if image file is provided
            image_file = self.request.FILES.get('image')
            if not image_file:
                raise serializers.ValidationError("image file is required")
            
            try:
                package = Package.objects.get(id=package_id)
            except Package.DoesNotExist:
                raise serializers.ValidationError("Package not found")
            
            # Save to package_images directory
            file_extension = os.path.splitext(image_file.name)[1]
            unique_filename = f"{uuid.uuid4()}{file_extension}"
            
            upload_dir = os.path.join(settings.MEDIA_ROOT, 'package_images')
            os.makedirs(upload_dir, exist_ok=True)
            
            file_path = os.path.join(upload_dir, unique_filename)
            with open(file_path, 'wb+') as destination:
                for chunk in image_file.chunks():
                    destination.write(chunk)
            
            image_path = f"package_images/{unique_filename}"
            
            # Convert string boolean values to actual booleans
            is_featured = image_data.get('is_featured', False)
            if isinstance(is_featured, str):
                is_featured = is_featured.lower() == 'true'
            
            serializer.save(
                package=package,
                image=image_path,
                caption=image_data.get('caption', ''),
                order=int(image_data.get('order', 0)),
                is_featured=is_featured
            )
        except Exception as e:
            print(f"Error in PackageImageViewSet.perform_create: {str(e)}")
            raise
    
    def perform_update(self, serializer):
        """Update image with file handling"""
        image_data = self.request.data
        instance = self.get_object()
        
        # Handle new image file upload
        image_file = self.request.FILES.get('image')
        if image_file:
            # Delete old file if it exists
            if instance.image:
                old_file_path = os.path.join(settings.MEDIA_ROOT, str(instance.image))
                if os.path.exists(old_file_path):
                    os.remove(old_file_path)
            
            # Save new file
            file_extension = os.path.splitext(image_file.name)[1]
            unique_filename = f"{uuid.uuid4()}{file_extension}"
            
            upload_dir = os.path.join(settings.MEDIA_ROOT, 'package_images')
            os.makedirs(upload_dir, exist_ok=True)
            
            file_path = os.path.join(upload_dir, unique_filename)
            with open(file_path, 'wb+') as destination:
                for chunk in image_file.chunks():
                    destination.write(chunk)
            
            image_path = f"package_images/{unique_filename}"
            serializer.save(image=image_path)
        else:
            serializer.save()
    
    def perform_destroy(self, instance):
        """Delete image file when deleting record"""
        if instance.image:
            file_path = os.path.join(settings.MEDIA_ROOT, str(instance.image))
            if os.path.exists(file_path):
                os.remove(file_path)
        instance.delete()


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def transportation_export(request):
    """Export all transportation data as JSON"""
    try:
        import json
        from django.core.serializers.json import DjangoJSONEncoder
        
        # Start with a simple test
        data = {
            'message': 'Transportation export endpoint is working',
            'timestamp': timezone.now().isoformat(),
            'user': str(request.user)
        }
        
        # Try to add transportation data
        try:
            # Only add data that exists
            if TransferType.objects.exists():
                data['transfer_types'] = list(TransferType.objects.all().values())
            else:
                data['transfer_types'] = []
                
            if AtollTransfer.objects.exists():
                data['atoll_transfers'] = list(AtollTransfer.objects.all().values())
            else:
                data['atoll_transfers'] = []
                
            if ResortTransfer.objects.exists():
                data['resort_transfers'] = list(ResortTransfer.objects.all().values())
            else:
                data['resort_transfers'] = []
                
            if TransferFAQ.objects.exists():
                data['transfer_faqs'] = list(TransferFAQ.objects.all().values())
            else:
                data['transfer_faqs'] = []
                
            if TransferContactMethod.objects.exists():
                data['transfer_contact_methods'] = list(TransferContactMethod.objects.all().values())
            else:
                data['transfer_contact_methods'] = []
                
            if TransferBookingStep.objects.exists():
                data['transfer_booking_steps'] = list(TransferBookingStep.objects.all().values())
            else:
                data['transfer_booking_steps'] = []
                
            if TransferBenefit.objects.exists():
                data['transfer_benefits'] = list(TransferBenefit.objects.all().values())
            else:
                data['transfer_benefits'] = []
                
            if TransferPricingFactor.objects.exists():
                data['transfer_pricing_factors'] = list(TransferPricingFactor.objects.all().values())
            else:
                data['transfer_pricing_factors'] = []
                
            if TransferContent.objects.exists():
                data['transfer_content'] = list(TransferContent.objects.all().values())
            else:
                data['transfer_content'] = []
                
            if FerrySchedule.objects.exists():
                data['ferry_schedules'] = list(FerrySchedule.objects.all().values())
            else:
                data['ferry_schedules'] = []
                
        except Exception as model_error:
            data['model_error'] = str(model_error)
            print(f"Model access error: {model_error}")
        
        response = HttpResponse(
            json.dumps(data, cls=DjangoJSONEncoder, indent=2),
            content_type='application/json'
        )
        response['Content-Disposition'] = f'attachment; filename="transportation-data-{timezone.now().strftime("%Y%m%d")}.json"'
        
        return response
        
    except Exception as e:
        print(f"Transportation export error: {e}")
        import traceback
        traceback.print_exc()
        return Response({'error': str(e), 'details': traceback.format_exc()}, status=500)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def transportation_import(request):
    """Import transportation data from JSON file"""
    try:
        if 'file' not in request.FILES:
            return Response({'error': 'No file provided'}, status=400)
        
        file = request.FILES['file']
        
        if not file.name.endswith('.json'):
            return Response({'error': 'File must be a JSON file'}, status=400)
        
        # Read and parse JSON data
        try:
            import json
            data = json.loads(file.read().decode('utf-8'))
        except json.JSONDecodeError:
            return Response({'error': 'Invalid JSON file'}, status=400)
        
        imported_count = 0
        
        # Import each data type
        model_mapping = {
            'transfer_types': TransferType,
            'atoll_transfers': AtollTransfer,
            'resort_transfers': ResortTransfer,
            'transfer_faqs': TransferFAQ,
            'transfer_contact_methods': TransferContactMethod,
            'transfer_booking_steps': TransferBookingStep,
            'transfer_benefits': TransferBenefit,
            'transfer_pricing_factors': TransferPricingFactor,
            'transfer_content': TransferContent,
            'ferry_schedules': FerrySchedule,
        }
        
        # Use transaction to ensure data integrity
        from django.db import transaction
        
        with transaction.atomic():
            for data_type, model_class in model_mapping.items():
                if data_type in data:
                    # Clear existing data
                    model_class.objects.all().delete()
                    
                    # Import new data
                    for item_data in data[data_type]:
                        # Remove id to let Django auto-assign
                        item_data.pop('id', None)
                        
                        # Convert datetime strings back to datetime objects
                        for field in ['created_at', 'updated_at']:
                            if field in item_data and item_data[field]:
                                from django.utils.dateparse import parse_datetime
                                item_data[field] = parse_datetime(item_data[field])
                        
                        model_class.objects.create(**item_data)
                        imported_count += 1
        
        return Response({
            'message': 'Transportation data imported successfully',
            'imported_count': imported_count
        })
        
    except Exception as e:
        return Response({'error': str(e)}, status=500)


# About Page Views

@api_view(['GET'])
@permission_classes([AllowAny])
def about_page_data(request):
    """Get all About page data"""
    try:
        content_sections = AboutPageContent.objects.filter(is_active=True).order_by('order')
        values = AboutPageValue.objects.filter(is_active=True).order_by('order')
        statistics = AboutPageStatistic.objects.filter(is_active=True).order_by('order')
        
        data = {
            'content_sections': AboutPageContentSerializer(content_sections, many=True, context={'request': request}).data,
            'values': AboutPageValueSerializer(values, many=True).data,
            'statistics': AboutPageStatisticSerializer(statistics, many=True).data,
        }
        
        return Response(data)
        
    except Exception as e:
        return Response({'error': str(e)}, status=500)


class AboutPageContentViewSet(viewsets.ModelViewSet):
    """ViewSet for About page content sections"""
    queryset = AboutPageContent.objects.all()
    serializer_class = AboutPageContentSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    
    def get_queryset(self):
        queryset = super().get_queryset()
        if self.action == 'list':
            queryset = queryset.filter(is_active=True).order_by('order')
        return queryset


class AboutPageValueViewSet(viewsets.ModelViewSet):
    """ViewSet for About page values"""
    queryset = AboutPageValue.objects.all()
    serializer_class = AboutPageValueSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    
    def get_queryset(self):
        queryset = super().get_queryset()
        if self.action == 'list':
            queryset = queryset.filter(is_active=True).order_by('order')
        return queryset


class AboutPageStatisticViewSet(viewsets.ModelViewSet):
    """ViewSet for About page statistics"""
    queryset = AboutPageStatistic.objects.all()
    serializer_class = AboutPageStatisticSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    
    def get_queryset(self):
        queryset = super().get_queryset()
        if self.action == 'list':
            queryset = queryset.filter(is_active=True).order_by('order')
        return queryset


class FeaturedDestinationViewSet(viewsets.ModelViewSet):
    """ViewSet for featured destinations"""
    queryset = FeaturedDestination.objects.all()
    serializer_class = FeaturedDestinationSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    
    def get_queryset(self):
        queryset = super().get_queryset()
        if self.action == 'list':
            queryset = queryset.filter(is_active=True).order_by('order')
        return queryset


@api_view(['GET'])
@permission_classes([AllowAny])
def featured_destinations(request):
    """Get featured destinations for homepage"""
    try:
        destinations = FeaturedDestination.objects.filter(is_active=True).order_by('order')[:4]
        serializer = FeaturedDestinationSerializer(destinations, many=True, context={'request': request})
        return Response(serializer.data)
    except Exception as e:
        return Response({'error': str(e)}, status=500)
