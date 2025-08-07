from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    hello_world,
    PropertyTypeViewSet,
    AmenityViewSet,
    LocationViewSet,
    PropertyImageViewSet,
    PropertyViewSet,
    PackageViewSet,
    ReviewViewSet,
    PropertyPackagesList,
    PropertyReviewsList,
    PackageReviewsList,
    BookingViewSet,
    BookingCreateView,
    BookingStatusUpdateView,
    AvailabilityViewSet,
    CustomerViewSet,
    check_availability,
    property_bookings,
    create_booking,
    booking_summary,
    customer_register,
    customer_login,
    my_bookings,
)
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

router = DefaultRouter()
router.register(r'property-types', PropertyTypeViewSet)
router.register(r'amenities', AmenityViewSet)
router.register(r'locations', LocationViewSet)
router.register(r'property-images', PropertyImageViewSet)
router.register(r'properties', PropertyViewSet)
router.register(r'packages', PackageViewSet)
router.register(r'reviews', ReviewViewSet)
router.register(r'bookings', BookingViewSet)
router.register(r'availability', AvailabilityViewSet)
router.register(r'customers', CustomerViewSet)

urlpatterns = [
    path('hello/', hello_world, name='hello_world'),
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('properties/<int:pk>/packages/', PropertyPackagesList.as_view(), name='property-packages'),
    path('properties/<int:pk>/reviews/', PropertyReviewsList.as_view(), name='property-reviews'),
    path('packages/<int:pk>/reviews/', PackageReviewsList.as_view(), name='package-reviews'),
    
    # Customer Authentication endpoints
    path('customer/register/', customer_register, name='customer-register'),
    path('customer/login/', customer_login, name='customer-login'),
    
    # Booking endpoints
    path('bookings/create/', BookingCreateView.as_view(), name='booking-create'),
    path('bookings/<int:pk>/status/', BookingStatusUpdateView.as_view(), name='booking-status-update'),
    path('bookings/my-bookings/', my_bookings, name='my-bookings'),
    path('properties/<int:property_id>/availability/', check_availability, name='check-availability'),
    path('properties/<int:property_id>/bookings/', property_bookings, name='property-bookings'),
    path('bookings/create-booking/', create_booking, name='create-booking'),
    path('bookings/summary/', booking_summary, name='booking-summary'),
    
    path('', include(router.urls)),
] 