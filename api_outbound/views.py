from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticatedOrReadOnly, IsAuthenticated
from django_filters.rest_framework import DjangoFilterBackend
from django.db.models import Q, Count
from .models import (
    Continent, Country, ActivityCategory, TourPackage,
    TourBooking, Currency
)
from .serializers import (
    ContinentSerializer, CountrySerializer, ActivityCategorySerializer,
    TourPackageSerializer, TourPackageListSerializer, CountryDetailSerializer,
    TourBookingSerializer, CurrencySerializer, SearchResultSerializer
)


class ContinentViewSet(viewsets.ReadOnlyModelViewSet):
    """ViewSet for continents"""
    queryset = Continent.objects.all().order_by('display_order')
    serializer_class = ContinentSerializer

    @action(detail=True, methods=['get'])
    def countries(self, request, pk=None):
        """Get countries for a specific continent"""
        continent = self.get_object()
        countries = continent.countries.filter(is_active=True).order_by('display_order')
        serializer = CountrySerializer(countries, many=True)
        return Response(serializer.data)


class CountryViewSet(viewsets.ReadOnlyModelViewSet):
    """ViewSet for countries"""
    queryset = Country.objects.filter(is_active=True).order_by('display_order')
    serializer_class = CountrySerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['continent', 'is_featured']

    def get_serializer_class(self):
        if self.action == 'retrieve':
            return CountryDetailSerializer
        return CountrySerializer

    @action(detail=False, methods=['get'])
    def featured(self, request):
        """Get featured countries"""
        countries = self.get_queryset().filter(is_featured=True)[:6]
        serializer = self.get_serializer(countries, many=True)
        return Response(serializer.data)


class ActivityCategoryViewSet(viewsets.ReadOnlyModelViewSet):
    """ViewSet for activity categories"""
    queryset = ActivityCategory.objects.filter(is_active=True).order_by('display_order')
    serializer_class = ActivityCategorySerializer


class TourPackageViewSet(viewsets.ReadOnlyModelViewSet):
    """ViewSet for tour packages"""
    queryset = TourPackage.objects.filter(is_active=True).order_by('-is_featured', 'name')
    serializer_class = TourPackageSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = [
        'country', 'difficulty', 'is_featured',
        'activity_categories', 'duration_days'
    ]

    def get_serializer_class(self):
        if self.action == 'list':
            return TourPackageListSerializer
        return TourPackageSerializer

    @action(detail=False, methods=['get'])
    def featured(self, request):
        """Get featured tours"""
        tours = self.get_queryset().filter(is_featured=True)[:8]
        serializer = TourPackageListSerializer(tours, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def deals(self, request):
        """Get tours with discounts"""
        tours = self.get_queryset().filter(discount_percentage__gt=0).order_by('-discount_percentage')
        serializer = TourPackageListSerializer(tours, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def search(self, request):
        """Search tours by query"""
        query = request.query_params.get('q', '')
        if not query:
            return Response({'error': 'Search query is required'}, status=400)

        # Search in tour names and descriptions
        tours = self.get_queryset().filter(
            Q(name__icontains=query) |
            Q(description__icontains=query) |
            Q(country__name__icontains=query) |
            Q(highlights__icontains=query)
        )[:20]

        # Search in countries
        countries = Country.objects.filter(
            Q(name__icontains=query) |
            Q(description__icontains=query)
        )[:10]

        serializer = SearchResultSerializer({
            'countries': countries,
            'tours': tours,
            'total_countries': countries.count(),
            'total_tours': tours.count()
        })

        return Response(serializer.data)


class TourBookingViewSet(viewsets.ModelViewSet):
    """ViewSet for tour bookings"""
    serializer_class = TourBookingSerializer
    permission_classes = [IsAuthenticated]
    queryset = TourBooking.objects.all().order_by('-created_at')

    def get_queryset(self):
        return TourBooking.objects.filter(user=self.request.user).order_by('-created_at')

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    @action(detail=False, methods=['get'])
    def history(self, request):
        """Get user's booking history"""
        bookings = self.get_queryset()
        serializer = self.get_serializer(bookings, many=True)
        return Response(serializer.data)


class CurrencyViewSet(viewsets.ReadOnlyModelViewSet):
    """ViewSet for currencies"""
    queryset = Currency.objects.filter(is_active=True).order_by('name')
    serializer_class = CurrencySerializer

    @action(detail=False, methods=['get'])
    def default(self, request):
        """Get default currency"""
        currency = self.get_queryset().filter(is_default=True).first()
        if not currency:
            currency = self.get_queryset().first()
        serializer = self.get_serializer(currency)
        return Response(serializer.data)


# Additional utility views

from rest_framework.views import APIView


class HomepageDataView(APIView):
    """View for homepage data"""
    permission_classes = [IsAuthenticatedOrReadOnly]

    def get(self, request):
        # Get featured continents with countries
        continents = Continent.objects.all().order_by('display_order')
        continents_data = ContinentSerializer(continents, many=True).data

        # Get featured countries
        featured_countries = Country.objects.filter(
            is_featured=True, is_active=True
        ).order_by('display_order')[:6]
        countries_data = CountrySerializer(featured_countries, many=True).data

        # Get featured tours
        featured_tours = TourPackage.objects.filter(
            is_featured=True, is_active=True
        ).order_by('-created_at')[:8]
        tours_data = TourPackageListSerializer(featured_tours, many=True).data

        # Get deals
        deals = TourPackage.objects.filter(
            discount_percentage__gt=0, is_active=True
        ).order_by('-discount_percentage')[:6]
        deals_data = TourPackageListSerializer(deals, many=True).data

        # Get activity categories
        activities = ActivityCategory.objects.filter(is_active=True).order_by('display_order')
        activities_data = ActivityCategorySerializer(activities, many=True).data

        return Response({
            'continents': continents_data,
            'featured_countries': countries_data,
            'featured_tours': tours_data,
            'deals': deals_data,
            'activity_categories': activities_data,
        })


class StatisticsView(APIView):
    """View for platform statistics"""
    permission_classes = [IsAuthenticatedOrReadOnly]

    def get(self, request):
        total_countries = Country.objects.filter(is_active=True).count()
        total_tours = TourPackage.objects.filter(is_active=True).count()
        total_bookings = TourBooking.objects.count()
        featured_countries = Country.objects.filter(is_featured=True, is_active=True).count()
        deals_count = TourPackage.objects.filter(discount_percentage__gt=0, is_active=True).count()

        return Response({
            'total_countries': total_countries,
            'total_tours': total_tours,
            'total_bookings': total_bookings,
            'featured_countries': featured_countries,
            'deals_count': deals_count,
        })