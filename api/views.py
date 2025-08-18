from django.shortcuts import render
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
    PropertyType, Amenity, Location, PropertyImage, Property, Package, PackageImage, Review, 
    Booking, Availability, Customer, Page, PageBlock, MediaAsset, Menu, MenuItem, 
    Redirect, PageVersion, PageReview, CommentThread, Comment, PackageItinerary, PackageInclusion,
    PackageActivity, PackageDestination, TransferType, AtollTransfer, ResortTransfer, TransferFAQ,
    TransferContactMethod, TransferBookingStep, TransferBenefit, TransferPricingFactor, TransferContent,
    HomepageHero, HomepageFeature, HomepageTestimonial, HomepageStatistic, 
    HomepageCTASection, HomepageSettings, HomepageContent, HomepageImage
)
from .serializers import (
    PropertyTypeSerializer, AmenitySerializer, LocationSerializer, 
    PropertyImageSerializer, PackageImageSerializer, PropertySerializer, PackageSerializer, 
    ReviewSerializer, BookingSerializer, BookingCreateSerializer, 
    BookingStatusUpdateSerializer, AvailabilitySerializer, CustomerSerializer,
    PageSerializer, PageBlockSerializer, MediaAssetSerializer, MenuSerializer, MenuItemSerializer,
    RedirectSerializer, PageVersionSerializer, PageReviewSerializer, CommentThreadSerializer, CommentSerializer,
    PackageItinerarySerializer, PackageInclusionSerializer, PackageActivitySerializer, PackageDestinationSerializer,
    TransferTypeSerializer, AtollTransferSerializer, ResortTransferSerializer, TransferFAQSerializer,
    TransferContactMethodSerializer, TransferBookingStepSerializer, TransferBenefitSerializer,
    TransferPricingFactorSerializer, TransferContentSerializer,
    HomepageHeroSerializer, HomepageFeatureSerializer, HomepageTestimonialSerializer,
    HomepageStatisticSerializer, HomepageCTASectionSerializer, HomepageSettingsSerializer,
    HomepageContentSerializer, HomepageDataSerializer, HomepageImageSerializer
)
from rest_framework.decorators import permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from django.db.models import Count, Avg
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
        total_properties = Property.objects.count()
        total_packages = Package.objects.count()
        total_reviews = Review.objects.count()
        total_customers = Customer.objects.count()
        
        # Average ratings
        avg_rating = Review.objects.aggregate(avg_rating=Avg('rating'))['avg_rating'] or 0
        
        # Recent reviews
        recent_reviews = Review.objects.select_related('property').order_by('-created_at')[:5]
        reviews_data = ReviewSerializer(recent_reviews, many=True).data
        
        # Property types distribution
        property_types = PropertyType.objects.annotate(count=Count('properties'))
        property_types_data = [
            {'name': pt.name, 'count': pt.count} 
            for pt in property_types
        ]
        
        analytics_data = {
            'total_properties': total_properties,
            'total_packages': total_packages,
            'total_reviews': total_reviews,
            'total_customers': total_customers,
            'average_rating': round(avg_rating, 1),
            'recent_reviews': reviews_data,
            'property_types': property_types_data,
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
    serializer_class = PackageSerializer

    def create(self, request, *args, **kwargs):
        images_data = request.data.pop('images', [])
        serializer = self.get_serializer(data=request.data)
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
        images_data = request.data.pop('images', [])
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
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
    filterset_fields = ['status', 'locale', 'is_home']
    search_fields = ['title', 'slug', 'content']
    ordering_fields = ['created_at', 'updated_at', 'title']
    ordering = ['-updated_at']

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
            
            data = {
                'hero': HomepageHeroSerializer(hero, context={'request': request}).data if hero else None,
                'features': HomepageFeatureSerializer(features, many=True, context={'request': request}).data,
                'testimonials': HomepageTestimonialSerializer(testimonials, many=True, context={'request': request}).data,
                'statistics': HomepageStatisticSerializer(statistics, many=True).data,
                'cta_section': HomepageCTASectionSerializer(cta_section, context={'request': request}).data if cta_section else None,
                'settings': HomepageSettingsSerializer(settings).data,
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
            
            data = {
                'hero': HomepageHeroSerializer(hero, context={'request': request}).data if hero else None,
                'features': HomepageFeatureSerializer(features, many=True, context={'request': request}).data,
                'testimonials': HomepageTestimonialSerializer(testimonials, many=True, context={'request': request}).data,
                'statistics': HomepageStatisticSerializer(statistics, many=True).data,
                'cta_section': HomepageCTASectionSerializer(cta_section, context={'request': request}).data if cta_section else None,
                'settings': HomepageSettingsSerializer(settings).data,
            }
            
            response = Response(data)
            # Add caching headers for better performance
            response['Cache-Control'] = 'public, max-age=300'  # Cache for 5 minutes
            response['ETag'] = f'"homepage-{hash(str(data))}"'  # ETag for conditional requests
            return response
        except Exception as e:
            return Response({'error': str(e)}, status=500)
    

    
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
