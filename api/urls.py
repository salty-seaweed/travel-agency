from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'properties', views.PropertyViewSet)
router.register(r'packages', views.PackageViewSet)
router.register(r'locations', views.LocationViewSet)
router.register(r'property-types', views.PropertyTypeViewSet)
router.register(r'amenities', views.AmenityViewSet)
router.register(r'reviews', views.ReviewViewSet)
router.register(r'bookings', views.BookingViewSet)
router.register(r'availability', views.AvailabilityViewSet)
router.register(r'customers', views.CustomerViewSet)

# Package-related routes
router.register(r'package-itinerary', views.PackageItineraryViewSet)
router.register(r'package-inclusions', views.PackageInclusionViewSet)
router.register(r'package-activities', views.PackageActivityViewSet)
router.register(r'package-destinations', views.PackageDestinationViewSet)

# CMS routes
router.register(r'pages', views.PageViewSet)
router.register(r'page-blocks', views.PageBlockViewSet)
router.register(r'media', views.MediaAssetViewSet)
router.register(r'menus', views.MenuViewSet)
router.register(r'menu-items', views.MenuItemViewSet)
router.register(r'redirects', views.RedirectViewSet)
router.register(r'page-versions', views.PageVersionViewSet)
router.register(r'page-reviews', views.PageReviewViewSet)
router.register(r'comment-threads', views.CommentThreadViewSet)
router.register(r'comments', views.CommentViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('upload-image/', views.upload_image, name='upload_image'),
    path('search/', views.search, name='search'),
    path('analytics/', views.analytics, name='analytics'),
    path('analytics/content-stats/', views.content_stats, name='content_stats'),
    path('dashboard-stats/', views.dashboard_stats, name='dashboard_stats'),
    path('properties/<int:property_id>/availability/', views.check_availability, name='property_availability'),
    path('bookings/create-booking/', views.create_booking, name='create_booking'),
] 