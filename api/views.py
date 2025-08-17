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
    TransferContactMethod, TransferBookingStep, TransferBenefit, TransferPricingFactor, TransferContent
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
    TransferPricingFactorSerializer, TransferContentSerializer
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
