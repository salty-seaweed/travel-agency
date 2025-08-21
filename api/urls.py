from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views
from .views import (
    HomepageHeroViewSet, HomepageFeatureViewSet, HomepageTestimonialViewSet,
    HomepageStatisticViewSet, HomepageCTASectionViewSet, HomepageSettingsViewSet,
    HomepageContentViewSet, HomepageManagementViewSet, HomepageImageViewSet
)

router = DefaultRouter()
router.register(r'properties', views.PropertyViewSet)
router.register(r'packages', views.PackageViewSet)
router.register(r'locations', views.LocationViewSet)
router.register(r'destinations', views.DestinationViewSet)
router.register(r'experiences', views.ExperienceViewSet)
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

# Transportation routes
router.register(r'transfer-types', views.TransferTypeViewSet)
router.register(r'atoll-transfers', views.AtollTransferViewSet)
router.register(r'resort-transfers', views.ResortTransferViewSet)
router.register(r'transfer-faqs', views.TransferFAQViewSet)
router.register(r'transfer-contact-methods', views.TransferContactMethodViewSet)
router.register(r'transfer-booking-steps', views.TransferBookingStepViewSet)
router.register(r'transfer-benefits', views.TransferBenefitViewSet)
router.register(r'transfer-pricing-factors', views.TransferPricingFactorViewSet)
router.register(r'transfer-content', views.TransferContentViewSet)
router.register(r'ferry-schedules', views.FerryScheduleViewSet)

# Homepage Management URLs
router.register(r'homepage/hero', HomepageHeroViewSet)
router.register(r'homepage/features', HomepageFeatureViewSet)
router.register(r'homepage/testimonials', HomepageTestimonialViewSet)
router.register(r'homepage/statistics', HomepageStatisticViewSet)
router.register(r'homepage/cta', HomepageCTASectionViewSet)
router.register(r'homepage/settings', HomepageSettingsViewSet)
router.register(r'homepage/content', HomepageContentViewSet)
router.register(r'homepage/images', HomepageImageViewSet)
router.register(r'homepage', HomepageManagementViewSet, basename='homepage')

urlpatterns = [
    path('', include(router.urls)),
    path('upload-image/', views.upload_image, name='upload_image'),
    path('search/', views.search, name='search'),
    path('analytics/', views.analytics, name='analytics'),
    path('analytics/content-stats/', views.content_stats, name='content_stats'),
    path('dashboard-stats/', views.dashboard_stats, name='dashboard_stats'),
    path('properties/<int:property_id>/availability/', views.check_availability, name='property_availability'),
    path('bookings/create-booking/', views.create_booking, name='create_booking'),
    path('transportation/', views.transportation_data, name='transportation_data'),
    path('homepage/public/', HomepageManagementViewSet.as_view({'get': 'public_content'}), name='homepage-public-content'),
    path('pages/', include(router.urls)),
    path('pages/by-slug/<str:slug>/', views.page_by_slug, name='page_by_slug'),
]

 