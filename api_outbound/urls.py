from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    ContinentViewSet, CountryViewSet, ActivityCategoryViewSet,
    TourPackageViewSet, TourBookingViewSet, CurrencyViewSet,
    HomepageDataView, StatisticsView
)

# Create a router for ViewSets
router = DefaultRouter()
router.register(r'continents', ContinentViewSet)
router.register(r'countries', CountryViewSet)
router.register(r'activities', ActivityCategoryViewSet)
router.register(r'tours', TourPackageViewSet)
router.register(r'bookings', TourBookingViewSet)
router.register(r'currencies', CurrencyViewSet)

# URL patterns
urlpatterns = [
    # Include router URLs
    path('', include(router.urls)),

    # Custom endpoints
    path('homepage/', HomepageDataView.as_view(), name='homepage-data'),
    path('statistics/', StatisticsView.as_view(), name='statistics'),
]
