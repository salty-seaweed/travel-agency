from django.db import models
from django.contrib.auth.models import User


class Continent(models.Model):
    """Continents for organizing destinations"""
    name = models.CharField(max_length=50, unique=True)
    code = models.CharField(max_length=10, unique=True)  # EUR, ASI, NAM, etc.
    display_order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ['display_order', 'name']

    def __str__(self):
        return self.name


class Country(models.Model):
    """Countries as primary destinations"""
    name = models.CharField(max_length=100, unique=True)
    code = models.CharField(max_length=3, unique=True)  # ISO country code
    continent = models.ForeignKey(Continent, on_delete=models.CASCADE, related_name='countries')
    capital = models.CharField(max_length=100, blank=True)
    currency = models.CharField(max_length=10, blank=True)
    language = models.CharField(max_length=50, blank=True)
    description = models.TextField(blank=True)
    image = models.ImageField(upload_to='countries/', null=True, blank=True)
    is_featured = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    display_order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ['display_order', 'name']
        verbose_name_plural = 'Countries'

    def __str__(self):
        return self.name


class ActivityCategory(models.Model):
    """Activity categories like Adventure, Culture, Food, etc."""
    name = models.CharField(max_length=100, unique=True)
    slug = models.SlugField(unique=True)
    description = models.TextField(blank=True)
    icon = models.CharField(max_length=100, blank=True)  # Icon class name
    display_order = models.PositiveIntegerField(default=0)
    is_active = models.BooleanField(default=True)

    class Meta:
        ordering = ['display_order', 'name']
        verbose_name = 'Activity Category'
        verbose_name_plural = 'Activity Categories'

    def __str__(self):
        return self.name


class TourPackage(models.Model):
    """Main tour packages - simplified version"""
    DIFFICULTY_CHOICES = [
        ('easy', 'Easy'),
        ('moderate', 'Moderate'),
        ('challenging', 'Challenging'),
    ]

    name = models.CharField(max_length=200)
    slug = models.SlugField(unique=True)
    country = models.ForeignKey(Country, on_delete=models.CASCADE, related_name='packages')
    description = models.TextField()
    highlights = models.JSONField(default=list, blank=True)  # Key highlights

    # Tour details
    duration_days = models.PositiveIntegerField()
    difficulty = models.CharField(max_length=20, choices=DIFFICULTY_CHOICES, default='easy')
    group_size = models.CharField(max_length=50, default='2-12')  # e.g., "2-12 people"

    # Pricing
    price_usd = models.DecimalField(max_digits=8, decimal_places=2)
    original_price_usd = models.DecimalField(max_digits=8, decimal_places=2, null=True, blank=True)
    discount_percentage = models.PositiveIntegerField(default=0)

    # Activities
    activity_categories = models.ManyToManyField(ActivityCategory, blank=True, related_name='packages')

    # Media
    main_image = models.ImageField(upload_to='tours/', null=True, blank=True)
    images = models.JSONField(default=list, blank=True)

    # Status and SEO
    is_featured = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    meta_description = models.TextField(blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-is_featured', 'name']

    def __str__(self):
        return f"{self.name} - {self.country.name}"

    @property
    def is_on_sale(self):
        return self.discount_percentage > 0

    @property
    def final_price(self):
        if self.is_on_sale and self.original_price_usd:
            discount_amount = self.original_price_usd * (self.discount_percentage / 100)
            return self.original_price_usd - discount_amount
        return self.price_usd


class TourItinerary(models.Model):
    """Day-by-day itinerary for tours"""
    tour = models.ForeignKey(TourPackage, on_delete=models.CASCADE, related_name='itinerary')
    day_number = models.PositiveIntegerField()
    title = models.CharField(max_length=200)
    description = models.TextField()
    location = models.CharField(max_length=100, blank=True)
    activities = models.JSONField(default=list, blank=True)  # List of activities
    meals = models.JSONField(default=list, blank=True)  # breakfast, lunch, dinner

    class Meta:
        ordering = ['day_number']
        unique_together = ['tour', 'day_number']

    def __str__(self):
        return f"Day {self.day_number}: {self.title}"


class TourInclusion(models.Model):
    """What's included/excluded in the tour"""
    tour = models.ForeignKey(TourPackage, on_delete=models.CASCADE, related_name='inclusions')
    item = models.CharField(max_length=200)
    is_included = models.BooleanField(default=True)

    def __str__(self):
        return f"{self.item} ({'Included' if self.is_included else 'Excluded'})"


class TourBooking(models.Model):
    """Tour bookings"""
    BOOKING_STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('confirmed', 'Confirmed'),
        ('cancelled', 'Cancelled'),
        ('completed', 'Completed'),
    ]

    tour = models.ForeignKey(TourPackage, on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    booking_reference = models.CharField(max_length=20, unique=True)

    # Traveler details
    full_name = models.CharField(max_length=100)
    email = models.EmailField()
    phone = models.CharField(max_length=20)
    number_of_travelers = models.PositiveIntegerField(default=1)
    special_requests = models.TextField(blank=True)

    # Travel dates
    travel_date = models.DateField()
    status = models.CharField(max_length=20, choices=BOOKING_STATUS_CHOICES, default='pending')
    total_amount = models.DecimalField(max_digits=10, decimal_places=2)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"Booking {self.booking_reference} - {self.tour.name}"


class Currency(models.Model):
    """Supported currencies for pricing"""
    name = models.CharField(max_length=50)  # e.g., "US Dollar"
    code = models.CharField(max_length=3, unique=True)  # e.g., "USD"
    symbol = models.CharField(max_length=10)  # e.g., "$"
    exchange_rate = models.DecimalField(max_digits=10, decimal_places=6, default=1.0)
    is_default = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)

    class Meta:
        ordering = ['name']

    def __str__(self):
        return f"{self.code} - {self.name}"
