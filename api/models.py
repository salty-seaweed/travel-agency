from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone

# Create your models here.

class PropertyType(models.Model):
    name = models.CharField(max_length=50)
    description = models.TextField(blank=True)
    
    def __str__(self):
        return self.name

class Amenity(models.Model):
    name = models.CharField(max_length=50)
    icon = models.CharField(max_length=100, blank=True)  # For frontend icon reference
    
    def __str__(self):
        return self.name

class Location(models.Model):
    island = models.CharField(max_length=100)
    atoll = models.CharField(max_length=100, blank=True)
    latitude = models.FloatField(null=True, blank=True)
    longitude = models.FloatField(null=True, blank=True)
    
    def __str__(self):
        return f"{self.island}, {self.atoll}" if self.atoll else self.island

class Destination(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField()
    island = models.CharField(max_length=100)
    atoll = models.CharField(max_length=100)
    latitude = models.FloatField(null=True, blank=True)
    longitude = models.FloatField(null=True, blank=True)
    image = models.ImageField(upload_to='destinations/', null=True, blank=True)
    is_featured = models.BooleanField(default=False)
    property_count = models.IntegerField(default=0)  # Computed field
    package_count = models.IntegerField(default=0)   # Computed field
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    # Localized fields (no language FK enforcement)
    localized_name = models.CharField(max_length=100, blank=True, help_text="Localized name if different from base name")
    localized_description = models.TextField(blank=True, help_text="Localized description")
    
    class Meta:
        ordering = ['-is_featured', 'name']
        # Removed unique_together on (name, language)
    
    def __str__(self):
        return self.name
    
    def save(self, *args, **kwargs):
        # Update computed fields
        self.update_counts()
        super().save(*args, **kwargs)
    
    def update_counts(self):
        """Update property and package counts for this destination"""
        # Count properties in this destination (by island name)
        self.property_count = Property.objects.filter(
            location__island__iexact=self.island
        ).count()
        
        # Count packages that include this destination
        self.package_count = Package.objects.filter(
            destinations__location__island__iexact=self.island
        ).distinct().count()
    
    @classmethod
    def update_all_counts(cls):
        """Update property and package counts for all destinations"""
        for destination in cls.objects.all():
            destination.update_counts()
            destination.save(update_fields=['property_count', 'package_count'])

class Experience(models.Model):
    EXPERIENCE_TYPES = [
        ('water_sports', 'Water Sports'),
        ('cultural', 'Cultural'),
        ('adventure', 'Adventure'),
        ('wellness', 'Wellness'),
        ('food', 'Food & Dining'),
        ('photography', 'Photography'),
        ('fishing', 'Fishing'),
        ('diving', 'Diving & Snorkeling'),
        ('sailing', 'Sailing & Cruises'),
        ('spa', 'Spa & Relaxation'),
    ]
    
    name = models.CharField(max_length=200)
    description = models.TextField()
    experience_type = models.CharField(max_length=50, choices=EXPERIENCE_TYPES)
    duration = models.CharField(max_length=50, help_text="e.g., '2 hours', 'Full day'")
    price = models.DecimalField(max_digits=10, decimal_places=2)
    currency = models.CharField(max_length=3, default='USD')
    destination = models.ForeignKey(Destination, on_delete=models.CASCADE, related_name='experiences', null=True, blank=True)
    image = models.ImageField(upload_to='experiences/', null=True, blank=True)
    is_featured = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    max_participants = models.IntegerField(default=10)
    min_age = models.IntegerField(default=0)
    difficulty_level = models.CharField(max_length=20, choices=[
        ('easy', 'Easy'),
        ('moderate', 'Moderate'),
        ('challenging', 'Challenging'),
        ('expert', 'Expert'),
    ], default='easy')
    includes = models.JSONField(default=list, help_text="List of what's included")
    excludes = models.JSONField(default=list, help_text="List of what's not included")
    requirements = models.JSONField(default=list, help_text="List of requirements")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-is_featured', 'name']
    
    def __str__(self):
        return self.name

class Property(models.Model):
    name = models.CharField(max_length=200)
    description = models.TextField()
    property_type = models.ForeignKey(PropertyType, on_delete=models.CASCADE, related_name='properties')
    location = models.ForeignKey(Location, on_delete=models.SET_NULL, null=True, related_name='properties')
    address = models.CharField(max_length=255, blank=True)
    whatsapp_number = models.CharField(max_length=20, blank=True)
    price_per_night = models.DecimalField(max_digits=10, decimal_places=2)
    amenities = models.ManyToManyField(Amenity, blank=True, related_name='properties')
    is_featured = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    # Add internationalization support
    language = models.ForeignKey('Language', on_delete=models.CASCADE, related_name='properties', null=True, blank=True)
    localized_name = models.CharField(max_length=200, blank=True, help_text="Localized property name")
    localized_description = models.TextField(blank=True, help_text="Localized description")
    localized_amenities = models.JSONField(default=list, blank=True, help_text="Localized amenities")
    
    class Meta:
        ordering = ['-is_featured', 'name']
        unique_together = ['name', 'language']
    
    def __str__(self):
        return self.name
    
    def save(self, *args, **kwargs):
        # Save the property first
        super().save(*args, **kwargs)
        
        # Update destination property count if location changed
        if self.location and self.location.island:
            try:
                destination = Destination.objects.get(island__iexact=self.location.island)
                destination.update_counts()
                destination.save(update_fields=['property_count'])
            except Destination.DoesNotExist:
                pass

class Resort(models.Model):
    """Model for luxury resorts in the Maldives"""
    RESORT_CATEGORIES = [
        ('luxury', 'Luxury Resort'),
        ('semi_luxury', 'Semi Luxury Resort'),
        ('boutique', 'Boutique Resort'),
        ('adults_only', 'Adults Only Resort'),
        ('family_friendly', 'Family Friendly Resort'),
        ('honeymoon', 'Honeymoon Resort'),
        ('adventure', 'Adventure Resort'),
        ('wellness', 'Wellness Resort'),
    ]
    
    STAR_RATINGS = [
        (3, '3 Stars'),
        (4, '4 Stars'),
        (5, '5 Stars'),
        (6, '6 Stars'),
    ]
    
    # Basic Information
    name = models.CharField(max_length=200)
    description = models.TextField()
    detailed_description = models.TextField(blank=True)
    category = models.CharField(max_length=50, choices=RESORT_CATEGORIES, default='luxury')
    star_rating = models.PositiveIntegerField(choices=STAR_RATINGS, default=5)
    
    # Location Information
    location = models.ForeignKey(Location, on_delete=models.SET_NULL, null=True, related_name='resorts')
    atoll = models.CharField(max_length=100, blank=True)
    island_name = models.CharField(max_length=100, blank=True)
    coordinates = models.CharField(max_length=100, blank=True, help_text="Latitude, Longitude")
    
    # Contact Information
    phone = models.CharField(max_length=20, blank=True)
    email = models.EmailField(blank=True)
    website = models.URLField(blank=True)
    whatsapp_number = models.CharField(max_length=20, blank=True)
    
    # Pricing Information
    price_per_night_from = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    price_per_night_to = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    currency = models.CharField(max_length=3, default='USD')
    pricing_notes = models.TextField(blank=True, help_text="Additional pricing information")
    
    # Resort Features
    total_villas = models.PositiveIntegerField(null=True, blank=True)
    beach_villas = models.PositiveIntegerField(null=True, blank=True)
    water_villas = models.PositiveIntegerField(null=True, blank=True)
    overwater_villas = models.PositiveIntegerField(null=True, blank=True)
    garden_villas = models.PositiveIntegerField(null=True, blank=True)
    
    # Amenities and Facilities
    amenities = models.ManyToManyField(Amenity, blank=True, related_name='resorts')
    restaurants = models.PositiveIntegerField(default=0)
    bars = models.PositiveIntegerField(default=0)
    spa_centers = models.PositiveIntegerField(default=0)
    fitness_centers = models.PositiveIntegerField(default=0)
    pools = models.PositiveIntegerField(default=0)
    dive_centers = models.PositiveIntegerField(default=0)
    water_sports_centers = models.PositiveIntegerField(default=0)
    
    # Activities and Experiences
    diving_available = models.BooleanField(default=False)
    snorkeling_available = models.BooleanField(default=False)
    fishing_available = models.BooleanField(default=False)
    sailing_available = models.BooleanField(default=False)
    spa_services = models.BooleanField(default=False)
    water_sports = models.BooleanField(default=False)
    land_activities = models.BooleanField(default=False)
    cultural_experiences = models.BooleanField(default=False)
    
    # Transportation
    transfer_type = models.CharField(max_length=50, blank=True, help_text="Speedboat, Seaplane, etc.")
    transfer_duration = models.CharField(max_length=50, blank=True, help_text="e.g., '45 minutes'")
    transfer_cost = models.DecimalField(max_digits=8, decimal_places=2, null=True, blank=True)
    
    # Special Features
    is_adults_only = models.BooleanField(default=False)
    is_family_friendly = models.BooleanField(default=True)
    is_honeymoon_special = models.BooleanField(default=False)
    is_eco_friendly = models.BooleanField(default=False)
    is_private_island = models.BooleanField(default=False)
    has_house_reef = models.BooleanField(default=False)
    is_packaged = models.BooleanField(default=False, help_text="If true, shows simple booking form. If false, shows multi-step booking form.")
    is_room_type = models.BooleanField(default=False, help_text="If true, booking flow requires room type selection with tiered pricing.")
    has_private_beach = models.BooleanField(default=True)
    
    # Country/Region Restrictions (for packaged resorts only)
    # List of ISO 3166-1 alpha-2 country codes (e.g., ['US', 'GB', 'CA'])
    # If empty, resort is visible to all countries when is_packaged=True
    # If populated, resort is only visible to users from these countries
    allowed_countries = models.JSONField(
        default=list, 
        blank=True, 
        help_text="ISO 3166-1 alpha-2 country codes (e.g., ['US', 'GB', 'CA']). Only applies to packaged resorts. Empty list means visible to all countries."
    )
    restricted_regions = models.JSONField(
        default=list, 
        blank=True, 
        help_text="Region names for additional filtering (e.g., ['Europe', 'North America']). Optional, works with allowed_countries."
    )
    
    # Media and Images
    hero_image = models.ImageField(upload_to='resorts/hero/', blank=True, null=True)
    gallery_images = models.JSONField(default=list, blank=True, help_text="List of image URLs")
    virtual_tour_url = models.URLField(blank=True)
    drone_video_url = models.URLField(blank=True)
    
    # SEO and Marketing
    meta_title = models.CharField(max_length=200, blank=True)
    meta_description = models.TextField(blank=True)
    meta_keywords = models.CharField(max_length=500, blank=True)
    featured_highlights = models.JSONField(default=list, blank=True, help_text="Key selling points")
    special_offers = models.JSONField(default=list, blank=True, help_text="Current offers and promotions")
    
    # Status and Visibility
    is_featured = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    is_available = models.BooleanField(default=True)
    display_order = models.PositiveIntegerField(default=0)
    
    # Internationalization
    language = models.ForeignKey('Language', on_delete=models.CASCADE, related_name='resorts', null=True, blank=True)
    localized_name = models.CharField(max_length=200, blank=True, help_text="Localized resort name")
    localized_description = models.TextField(blank=True, help_text="Localized description")
    localized_highlights = models.JSONField(default=list, blank=True, help_text="Localized highlights")
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-is_featured', 'display_order', 'name']
        unique_together = ['name', 'language']
        verbose_name = 'Resort'
        verbose_name_plural = 'Resorts'
    
    def __str__(self):
        return self.name
    
    @property
    def full_location(self):
        """Return formatted location string"""
        parts = []
        if self.island_name:
            parts.append(self.island_name)
        if self.atoll:
            parts.append(self.atoll)
        if self.location and self.location.atoll:
            parts.append(self.location.atoll)
        return ', '.join(parts) if parts else 'Maldives'
    
    @property
    def price_range(self):
        """Return formatted price range"""
        if self.price_per_night_from and self.price_per_night_to:
            return f"${self.price_per_night_from} - ${self.price_per_night_to}"
        elif self.price_per_night_from:
            return f"From ${self.price_per_night_from}"
        return "Contact for pricing"
    
    @property
    def total_villa_count(self):
        """Calculate total villa count"""
        total = 0
        for field in ['beach_villas', 'water_villas', 'overwater_villas', 'garden_villas']:
            value = getattr(self, field)
            if value:
                total += value
        return total if total > 0 else self.total_villas
    
    def save(self, *args, **kwargs):
        # Auto-populate atoll from location if not set
        if not self.atoll and self.location and self.location.atoll:
            self.atoll = self.location.atoll
        
        # Auto-populate island_name from location if not set
        if not self.island_name and self.location and self.location.island:
            self.island_name = self.location.island
            
        super().save(*args, **kwargs)
        
        # Update destination resort count if location changed
        if self.location and self.location.island:
            try:
                destination = Destination.objects.get(island__iexact=self.location.island)
                destination.update_counts()
                destination.save(update_fields=['property_count'])
            except Destination.DoesNotExist:
                pass

class ResortRoomType(models.Model):
    """Model representing room categories with tiered pricing for resorts."""
    resort = models.ForeignKey(Resort, on_delete=models.CASCADE, related_name='room_types')
    name = models.CharField(max_length=150)
    slug = models.SlugField(max_length=160, blank=True, help_text="Optional identifier for linking with external systems.")
    description = models.TextField(blank=True)
    price_per_night = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    currency = models.CharField(max_length=3, default='USD')
    occupancy_adults = models.PositiveSmallIntegerField(default=2, help_text="Recommended number of adults.")
    occupancy_children = models.PositiveSmallIntegerField(default=0, help_text="Recommended number of children.")
    bed_configuration = models.CharField(max_length=120, blank=True, help_text="e.g., 1 King Bed, 2 Queen Beds")
    amenities = models.JSONField(default=list, blank=True, help_text="Highlights specific to this room type.")
    image = models.ImageField(upload_to='resorts/room-types/', null=True, blank=True)
    order = models.PositiveIntegerField(default=0)
    is_active = models.BooleanField(default=True)
    hide_price = models.BooleanField(default=False, help_text="If true, price will be hidden on frontend and in WhatsApp messages")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['resort', 'order', 'name']
        verbose_name = 'Resort Room Type'
        verbose_name_plural = 'Resort Room Types'
        unique_together = ('resort', 'name')

    def __str__(self):
        return f"{self.resort.name} - {self.name}"

    def save(self, *args, **kwargs):
        if not self.slug:
            from django.utils.text import slugify
            base_slug = slugify(self.name)
            slug_candidate = base_slug
            suffix = 1
            while ResortRoomType.objects.filter(resort=self.resort, slug=slug_candidate).exclude(pk=self.pk).exists():
                suffix += 1
                slug_candidate = f"{base_slug}-{suffix}"
            self.slug = slug_candidate
        super().save(*args, **kwargs)

class ResortImage(models.Model):
    """Model for resort images and media"""
    IMAGE_TYPES = [
        ('hero', 'Hero Image'),
        ('gallery', 'Gallery Image'),
        ('villa', 'Villa Image'),
        ('facility', 'Facility Image'),
        ('activity', 'Activity Image'),
        ('aerial', 'Aerial View'),
        ('beach', 'Beach View'),
        ('sunset', 'Sunset View'),
    ]
    
    resort = models.ForeignKey(Resort, on_delete=models.CASCADE, related_name='images')
    image = models.ImageField(upload_to='resorts/images/')
    image_type = models.CharField(max_length=20, choices=IMAGE_TYPES, default='gallery')
    caption = models.CharField(max_length=255, blank=True)
    alt_text = models.CharField(max_length=255, blank=True)
    order = models.PositiveIntegerField(default=0)
    is_featured = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['resort', 'order', 'created_at']
        verbose_name = 'Resort Image'
        verbose_name_plural = 'Resort Images'
    
    def __str__(self):
        return f"{self.resort.name} - {self.get_image_type_display()}"

class ResortReview(models.Model):
    """Model for resort reviews and ratings"""
    RATING_CHOICES = [
        (1, '1 Star'),
        (2, '2 Stars'),
        (3, '3 Stars'),
        (4, '4 Stars'),
        (5, '5 Stars'),
    ]
    
    resort = models.ForeignKey(Resort, on_delete=models.CASCADE, related_name='reviews')
    guest_name = models.CharField(max_length=100)
    guest_email = models.EmailField(blank=True)
    guest_country = models.CharField(max_length=100, blank=True)
    rating = models.PositiveIntegerField(choices=RATING_CHOICES, default=5)
    title = models.CharField(max_length=200, blank=True)
    comment = models.TextField()
    stay_date = models.DateField(null=True, blank=True)
    room_type = models.CharField(max_length=100, blank=True)
    is_verified = models.BooleanField(default=False)
    is_approved = models.BooleanField(default=False)
    is_featured = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-created_at']
        verbose_name = 'Resort Review'
        verbose_name_plural = 'Resort Reviews'
    
    def __str__(self):
        return f"Review for {self.resort.name} by {self.guest_name}"

class ResortAmenity(models.Model):
    """Model for resort-specific amenities"""
    AMENITY_CATEGORIES = [
        ('accommodation', 'Accommodation'),
        ('dining', 'Dining & Bars'),
        ('wellness', 'Wellness & Spa'),
        ('activities', 'Activities & Sports'),
        ('facilities', 'Facilities'),
        ('services', 'Services'),
        ('transportation', 'Transportation'),
    ]
    
    name = models.CharField(max_length=100)
    category = models.CharField(max_length=50, choices=AMENITY_CATEGORIES, default='facilities')
    description = models.TextField(blank=True)
    icon = models.CharField(max_length=100, blank=True)
    is_active = models.BooleanField(default=True)
    order = models.PositiveIntegerField(default=0)
    
    class Meta:
        ordering = ['category', 'order', 'name']
        verbose_name = 'Resort Amenity'
        verbose_name_plural = 'Resort Amenities'
    
    def __str__(self):
        return self.name

class PropertyImage(models.Model):
    property = models.ForeignKey(Property, on_delete=models.CASCADE, related_name='images')
    image = models.ImageField(upload_to='property_images/')
    caption = models.CharField(max_length=255, blank=True)
    order = models.PositiveIntegerField(default=0)
    is_featured = models.BooleanField(default=False)
    
    def __str__(self):
        return f"Image for {self.property.name}"

class Package(models.Model):
    DIFFICULTY_CHOICES = [
        ('easy', 'Easy'),
        ('moderate', 'Moderate'),
        ('challenging', 'Challenging'),
        ('expert', 'Expert'),
    ]
    
    name = models.CharField(max_length=200)
    description = models.TextField()
    detailed_description = models.TextField(blank=True)

    price = models.DecimalField(max_digits=10, decimal_places=2)
    original_price = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    discount_percentage = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    duration = models.PositiveIntegerField(default=1)  # Duration in days
    nights = models.PositiveIntegerField(default=0, help_text="Number of nights (usually duration - 1)")
    is_featured = models.BooleanField(default=False)
    start_date = models.DateField(null=True, blank=True)
    end_date = models.DateField(null=True, blank=True)
    
    # Enhanced package information
    category = models.CharField(max_length=100, blank=True)
    difficulty_level = models.CharField(max_length=20, choices=DIFFICULTY_CHOICES, default='easy')
    highlights = models.TextField(blank=True, help_text="Package highlights, one per line or separated by commas")
    
    # Pricing information
    pricing_type = models.CharField(
        max_length=20,
        choices=[
            ('per_person', 'Per Person'),
            ('per_couple', 'Per Couple'),
            ('per_room', 'Per Room'),
            ('per_group', 'Per Group'),
        ],
        default='per_person',
        help_text="How the price is calculated and displayed"
    )
    
    # Group size
    group_size_min = models.PositiveIntegerField(default=1)
    group_size_max = models.PositiveIntegerField(default=10)
    group_size_recommended = models.PositiveIntegerField(default=4)
    
    # Accommodation details
    accommodation_type = models.CharField(max_length=100, blank=True)
    room_type = models.CharField(max_length=100, blank=True)
    meal_plan = models.CharField(max_length=100, blank=True)
    
    # Transportation
    transportation_details = models.TextField(blank=True)
    airport_transfers = models.BooleanField(default=False)
    
    # Additional information
    best_time_to_visit = models.CharField(max_length=200, blank=True)
    weather_info = models.TextField(blank=True)
    what_to_bring = models.JSONField(default=list, blank=True)  # List of strings
    important_notes = models.JSONField(default=list, blank=True)  # List of strings
    
    # Pricing and availability
    seasonal_pricing_peak = models.CharField(max_length=200, blank=True)
    seasonal_pricing_off_peak = models.CharField(max_length=200, blank=True)
    seasonal_pricing_shoulder = models.CharField(max_length=200, blank=True)
    availability_calendar = models.TextField(blank=True)
    
    # Booking information
    booking_terms = models.TextField(blank=True)
    cancellation_policy = models.TextField(blank=True)
    payment_terms = models.TextField(blank=True)
    
    # Add internationalization support
    language = models.ForeignKey('Language', on_delete=models.CASCADE, related_name='packages', null=True, blank=True)
    localized_name = models.CharField(max_length=200, blank=True, help_text="Localized package name")
    localized_description = models.TextField(blank=True, help_text="Localized description")
    localized_highlights = models.JSONField(default=list, blank=True, help_text="Localized highlights")
    localized_included = models.JSONField(default=list, blank=True, help_text="Localized included items")
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['name']
        unique_together = ['name', 'language']
    
    def __str__(self):
        return self.name

class PackageVariant(models.Model):
    package = models.ForeignKey(Package, on_delete=models.CASCADE, related_name='variants')
    duration_days = models.PositiveIntegerField(help_text="Duration in days")
    nights = models.PositiveIntegerField(default=0, help_text="Number of nights (usually duration_days - 1)")
    price = models.DecimalField(max_digits=10, decimal_places=2)
    original_price = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    is_default = models.BooleanField(default=False)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['duration_days', 'price']
        unique_together = ['package', 'duration_days']

    def __str__(self):
        return f"{self.package.name} - {self.duration_days} days"

class PackageItinerary(models.Model):
    package = models.ForeignKey(Package, on_delete=models.CASCADE, related_name='itinerary')
    day = models.PositiveIntegerField()
    title = models.CharField(max_length=200)
    description = models.TextField()
    activities = models.JSONField(default=list)  # List of strings
    meals = models.JSONField(default=list)  # List of strings
    accommodation = models.CharField(max_length=200, blank=True)
    transportation = models.CharField(max_length=200, blank=True)
    
    class Meta:
        ordering = ['day']
        unique_together = ['package', 'day']
    
    def __str__(self):
        return f"{self.package.name} - Day {self.day}: {self.title}"

class PackageInclusion(models.Model):
    CATEGORY_CHOICES = [
        ('included', 'Included'),
        ('excluded', 'Excluded'),
        ('optional', 'Optional'),
    ]
    
    package = models.ForeignKey(Package, on_delete=models.CASCADE, related_name='inclusions')
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES)
    item = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    icon = models.CharField(max_length=100, blank=True)
    
    class Meta:
        ordering = ['category', 'item']
    
    def __str__(self):
        return f"{self.package.name} - {self.get_category_display()}: {self.item}"

class PackageActivity(models.Model):
    DIFFICULTY_CHOICES = [
        ('easy', 'Easy'),
        ('moderate', 'Moderate'),
        ('challenging', 'Challenging'),
    ]
    
    package = models.ForeignKey(Package, on_delete=models.CASCADE, related_name='activities')
    name = models.CharField(max_length=200)
    description = models.TextField()
    duration = models.CharField(max_length=100)
    difficulty = models.CharField(max_length=20, choices=DIFFICULTY_CHOICES, default='easy')
    category = models.CharField(max_length=100)
    included = models.BooleanField(default=True)
    price = models.CharField(max_length=100, blank=True)
    
    class Meta:
        ordering = ['name']
        verbose_name_plural = 'Package activities'
    
    def __str__(self):
        return f"{self.package.name} - {self.name}"

class PackageDestination(models.Model):
    package = models.ForeignKey(Package, on_delete=models.CASCADE, related_name='destinations')
    location = models.ForeignKey(Location, on_delete=models.CASCADE)
    duration = models.PositiveIntegerField(help_text="Days at this destination")
    description = models.TextField()
    highlights = models.JSONField(default=list)  # List of strings
    activities = models.JSONField(default=list)  # List of strings
    
    class Meta:
        ordering = ['duration']
    
    def __str__(self):
        return f"{self.package.name} - {self.location.island} ({self.duration} days)"

class PackageImage(models.Model):
    MEDIA_TYPES = [
        ('image', 'Image'),
        ('video', 'Video'),
    ]

    package = models.ForeignKey(Package, on_delete=models.CASCADE, related_name='images')
    media_type = models.CharField(max_length=10, choices=MEDIA_TYPES, default='image')

    # Image fields
    image = models.ImageField(upload_to='package_images/', null=True, blank=True)

    # Video fields
    video = models.FileField(upload_to='package_videos/', null=True, blank=True)
    video_thumbnail = models.ImageField(upload_to='package_video_thumbnails/', null=True, blank=True)

    # Common fields
    caption = models.CharField(max_length=255, blank=True)
    order = models.PositiveIntegerField(default=0)
    is_featured = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['order', 'created_at']
        verbose_name = 'Package Media'
        verbose_name_plural = 'Package Media'

    def __str__(self):
        media_type_display = self.get_media_type_display()
        return f"{media_type_display} for {self.package.name}"

    @property
    def file_url(self):
        """Get the URL of the media file"""
        if self.media_type == 'image' and self.image:
            return self.image.url
        elif self.media_type == 'video' and self.video:
            return self.video.url
        return ''

    @property
    def thumbnail_url(self):
        """Get the URL of the thumbnail for display"""
        if self.media_type == 'image':
            return self.image.url if self.image else ''
        elif self.media_type == 'video':
            return self.video_thumbnail.url if self.video_thumbnail else '/video-placeholder.png'
        return ''

    def clean(self):
        """Ensure only appropriate fields are set based on media type"""
        from django.core.exceptions import ValidationError

        if self.media_type == 'image':
            if not self.image:
                raise ValidationError('Image file is required for image media type')
            if self.video:
                raise ValidationError('Video file should not be set for image media type')
        elif self.media_type == 'video':
            if not self.video:
                raise ValidationError('Video file is required for video media type')
            if self.image:
                raise ValidationError('Image file should not be set for video media type')

    def save(self, *args, **kwargs):
        self.clean()
        super().save(*args, **kwargs)

class Review(models.Model):
    property = models.ForeignKey(Property, on_delete=models.CASCADE, related_name='reviews')
    name = models.CharField(max_length=100)
    rating = models.PositiveSmallIntegerField()  # 1-5
    comment = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    approved = models.BooleanField(default=False)
    
    def __str__(self):
        return f"Review for {self.property.name} by {self.name}"

# New Booking Models
class Booking(models.Model):
    BOOKING_STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('confirmed', 'Confirmed'),
        ('cancelled', 'Cancelled'),
        ('completed', 'Completed'),
    ]
    
    property_obj = models.ForeignKey(Property, on_delete=models.CASCADE, related_name='bookings')
    customer = models.ForeignKey('Customer', on_delete=models.CASCADE, related_name='bookings', null=True, blank=True)
    customer_name = models.CharField(max_length=100)
    customer_email = models.EmailField()
    customer_phone = models.CharField(max_length=20)
    check_in_date = models.DateField()
    check_out_date = models.DateField()
    number_of_guests = models.PositiveIntegerField(default=1)
    total_price = models.DecimalField(max_digits=10, decimal_places=2)
    status = models.CharField(max_length=20, choices=BOOKING_STATUS_CHOICES, default='pending')
    special_requests = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"Booking {self.id} - {self.property_obj.name} by {self.customer_name}"
    
    @property
    def number_of_nights(self):
        return (self.check_out_date - self.check_in_date).days
    
    @property
    def is_active(self):
        return self.status in ['pending', 'confirmed']

class Availability(models.Model):
    property_obj = models.ForeignKey(Property, on_delete=models.CASCADE, related_name='availability')
    date = models.DateField()
    is_available = models.BooleanField(default=True)
    price_override = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    notes = models.TextField(blank=True)
    
    class Meta:
        unique_together = ['property_obj', 'date']
    
    def __str__(self):
        return f"{self.property_obj.name} - {self.date} - {'Available' if self.is_available else 'Not Available'}"

class Customer(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, null=True, blank=True)
    name = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    phone = models.CharField(max_length=20, blank=True)
    date_of_birth = models.DateField(null=True, blank=True)
    nationality = models.CharField(max_length=100, blank=True)
    passport_number = models.CharField(max_length=50, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return self.name

# Global locale choices
LOCALE_CHOICES = [
    ('en', 'English'),
    ('ru', 'Russian'),
    ('zh', 'Chinese'),
]

# CMS Models
class Page(models.Model):
    STATUS_CHOICES = [
        ('draft', 'Draft'),
        ('published', 'Published'),
        ('archived', 'Archived'),
    ]
    
    title = models.CharField(max_length=200)
    slug = models.SlugField(max_length=200, unique=True)
    content = models.TextField(blank=True)
    meta_description = models.TextField(blank=True)
    meta_keywords = models.CharField(max_length=500, blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='draft')
    locale = models.CharField(max_length=10, choices=LOCALE_CHOICES, default='en')
    is_home = models.BooleanField(default=False)
    
    # SEO fields
    seo_title = models.CharField(max_length=200, blank=True)
    seo_description = models.TextField(blank=True)
    canonical_url = models.URLField(blank=True)
    robots = models.CharField(max_length=100, blank=True, default='index, follow')
    json_ld = models.JSONField(default=dict, blank=True)
    
    # Open Graph fields
    og_title = models.CharField(max_length=200, blank=True)
    og_description = models.TextField(blank=True)
    og_image = models.ForeignKey('MediaAsset', on_delete=models.SET_NULL, null=True, blank=True, related_name='og_pages')
    
    # Publishing fields
    publish_at = models.DateTimeField(null=True, blank=True)
    unpublish_at = models.DateTimeField(null=True, blank=True)
    template = models.CharField(max_length=100, blank=True, default='default')
    parent = models.ForeignKey('self', on_delete=models.CASCADE, null=True, blank=True, related_name='children')
    path = models.CharField(max_length=500, blank=True)
    notes = models.TextField(blank=True, help_text="Internal notes for content management")
    
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='pages_created')
    updated_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='pages_updated')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    version = models.PositiveIntegerField(default=1)
    
    class Meta:
        ordering = ['-updated_at']
    
    def __str__(self):
        return self.title
    
    @property
    def page_path(self):
        return f"/{self.slug}/"
    
    def save(self, *args, **kwargs):
        # Auto-generate path if not provided
        if not self.path:
            self.path = f"/{self.slug}/"
        super().save(*args, **kwargs)

class PageBlock(models.Model):
    BLOCK_TYPES = [
        ('text', 'Text Block'),
        ('image', 'Image Block'),
        ('gallery', 'Gallery Block'),
        ('video', 'Video Block'),
        ('quote', 'Quote Block'),
        ('cta', 'Call to Action'),
    ]
    
    page = models.ForeignKey(Page, on_delete=models.CASCADE, related_name='blocks')
    type = models.CharField(max_length=20, choices=BLOCK_TYPES)
    order = models.PositiveIntegerField(default=0)
    data = models.JSONField(default=dict)
    experiment_id = models.CharField(max_length=100, blank=True)  # For A/B testing
    locale_override = models.CharField(max_length=10, choices=LOCALE_CHOICES, blank=True)  # Override page locale
    visibility_rules = models.JSONField(default=dict, blank=True)  # Conditional visibility rules
    
    class Meta:
        ordering = ['order']
    
    def __str__(self):
        return f"{self.page.title} - {self.type} (Order: {self.order})"

class MediaAsset(models.Model):
    file = models.FileField(upload_to='')
    alt_text = models.CharField(max_length=255, blank=True)
    caption = models.TextField(blank=True)
    mime_type = models.CharField(max_length=100, blank=True)
    width = models.PositiveIntegerField(null=True, blank=True)
    height = models.PositiveIntegerField(null=True, blank=True)
    file_size = models.PositiveIntegerField(null=True, blank=True)
    tags = models.CharField(max_length=500, blank=True)
    focal_x = models.FloatField(null=True, blank=True)  # Focal point X coordinate
    focal_y = models.FloatField(null=True, blank=True)  # Focal point Y coordinate
    variants = models.JSONField(default=dict, blank=True)  # Image variants (thumbnails, etc.)
    usage_count = models.PositiveIntegerField(default=0)
    usage_locations = models.JSONField(default=list, blank=True)  # Track where image is used: ['page-hero', 'package-image', etc.]
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='media_assets')
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return self.file.name
    
    @property
    def file_url(self):
        return self.file.url if self.file else ''
    
    @property
    def thumbnail_url(self):
        # You can implement thumbnail generation here
        return self.file_url
    
    @property
    def computed_usage_count(self):
        """Optionally compute dynamic usage; keep DB field `usage_count` intact."""
        try:
            return int(self.usage_count or 0)
        except Exception:
            return 0

class Menu(models.Model):
    name = models.CharField(max_length=100)
    slug = models.SlugField(max_length=100, unique=True)
    locale = models.CharField(max_length=10, choices=LOCALE_CHOICES, default='en')
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['name']
    
    def __str__(self):
        return self.name

class MenuItem(models.Model):
    LINK_TYPES = [
        ('external', 'External Link'),
        ('internal', 'Internal Page'),
        ('anchor', 'Page Anchor'),
    ]
    
    menu = models.ForeignKey(Menu, on_delete=models.CASCADE, related_name='items')
    title = models.CharField(max_length=100)
    url = models.CharField(max_length=500, default='#')
    link_type = models.CharField(max_length=20, choices=LINK_TYPES, default='external')
    link_value = models.CharField(max_length=500, blank=True)  # Alternative link value
    order = models.PositiveIntegerField(default=0)
    parent = models.ForeignKey('self', on_delete=models.CASCADE, null=True, blank=True, related_name='children')
    is_active = models.BooleanField(default=True)
    target_blank = models.BooleanField(default=False)
    target = models.CharField(max_length=50, blank=True)  # Target attribute
    
    class Meta:
        ordering = ['order']
    
    def __str__(self):
        return f"{self.menu.name} - {self.title}"

class Redirect(models.Model):
    from_path = models.CharField(max_length=500, unique=True)
    to_path = models.CharField(max_length=500)
    status_code = models.PositiveIntegerField(default=301, choices=[(301, '301 - Permanent'), (302, '302 - Temporary')])
    locale = models.CharField(max_length=10, choices=LOCALE_CHOICES, default='en')
    is_active = models.BooleanField(default=True)
    starts_at = models.DateTimeField(null=True, blank=True)  # When redirect becomes active
    ends_at = models.DateTimeField(null=True, blank=True)    # When redirect expires
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.from_path} → {self.to_path}"

class PageVersion(models.Model):
    page = models.ForeignKey(Page, on_delete=models.CASCADE, related_name='versions')
    version_number = models.PositiveIntegerField()
    title = models.CharField(max_length=200)
    content = models.TextField(default='')
    meta_description = models.TextField(blank=True)
    meta_keywords = models.CharField(max_length=500, blank=True)
    blocks_data = models.JSONField(default=dict, blank=True)  # Store block data for this version
    seo_data = models.JSONField(default=dict, blank=True)     # Store SEO data for this version
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        unique_together = ['page', 'version_number']
        ordering = ['-version_number']
    
    def __str__(self):
        return f"{self.page.title} - Version {self.version_number}"

class PageReview(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('approved', 'Approved'),
        ('rejected', 'Rejected'),
    ]
    
    page = models.ForeignKey(Page, on_delete=models.CASCADE, related_name='reviews')
    reviewer = models.ForeignKey(User, on_delete=models.CASCADE)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    comments = models.TextField(blank=True)
    due_date = models.DateTimeField(null=True, blank=True)  # When review is due
    completed_at = models.DateTimeField(null=True, blank=True)  # When review was completed
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return f"Review of {self.page.title} by {self.reviewer.username}"

class CommentThread(models.Model):
    title = models.CharField(max_length=200)
    page = models.ForeignKey(Page, on_delete=models.CASCADE, related_name='comment_threads')
    block_id = models.CharField(max_length=100, blank=True)  # Reference to specific block
    created_by = models.ForeignKey(User, on_delete=models.CASCADE)
    is_resolved = models.BooleanField(default=False)
    resolved_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return self.title

class Comment(models.Model):
    thread = models.ForeignKey(CommentThread, on_delete=models.CASCADE, related_name='comments')
    author = models.ForeignKey(User, on_delete=models.CASCADE)
    content = models.TextField()
    mentions = models.JSONField(default=list, blank=True)  # List of mentioned users
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['created_at']
    
    def __str__(self):
        return f"Comment by {self.author.username} on {self.thread.title}"

# Transportation Models
class TransferType(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField()
    icon = models.CharField(max_length=100, blank=True)
    gradient = models.CharField(max_length=100, default='from-blue-500 to-indigo-600')
    features = models.JSONField(default=list)  # List of features
    pricing_range = models.CharField(max_length=100)  # e.g., "From $50 to $300 per person"
    best_for = models.CharField(max_length=200)
    pros = models.JSONField(default=list)  # List of pros
    cons = models.JSONField(default=list)  # List of cons
    is_active = models.BooleanField(default=True)
    order = models.PositiveIntegerField(default=0)
    
    class Meta:
        ordering = ['order']
    
    def __str__(self):
        return self.name

class AtollTransfer(models.Model):
    atoll_name = models.CharField(max_length=100)
    description = models.TextField()
    icon = models.CharField(max_length=100, blank=True)
    gradient = models.CharField(max_length=100, default='from-blue-500 to-indigo-600')
    is_active = models.BooleanField(default=True)
    order = models.PositiveIntegerField(default=0)
    
    class Meta:
        ordering = ['order']
    
    def __str__(self):
        return self.atoll_name

class ResortTransfer(models.Model):
    atoll = models.ForeignKey(AtollTransfer, on_delete=models.CASCADE, related_name='resorts')
    resort_name = models.CharField(max_length=200)
    price = models.DecimalField(max_digits=8, decimal_places=2)
    duration = models.CharField(max_length=100)  # e.g., "45 minutes"
    transfer_type = models.CharField(max_length=50, default='speedboat')  # speedboat, seaplane, ferry
    is_active = models.BooleanField(default=True)
    order = models.PositiveIntegerField(default=0)
    
    class Meta:
        ordering = ['atoll', 'order']
    
    def __str__(self):
        return f"{self.resort_name} - {self.atoll.atoll_name}"

class TransferFAQ(models.Model):
    question = models.CharField(max_length=500)
    answer = models.TextField()
    category = models.CharField(max_length=100)
    icon = models.CharField(max_length=100, blank=True)
    is_active = models.BooleanField(default=True)
    order = models.PositiveIntegerField(default=0)
    
    class Meta:
        ordering = ['category', 'order']
        verbose_name = 'Transfer FAQ'
        verbose_name_plural = 'Transfer FAQs'
    
    def __str__(self):
        return self.question

class TransferContactMethod(models.Model):
    method = models.CharField(max_length=100)  # WhatsApp, Phone, Email
    icon = models.CharField(max_length=100, blank=True)
    color = models.CharField(max_length=50, default='blue')
    contact = models.CharField(max_length=100)
    description = models.TextField()
    response_time = models.CharField(max_length=100)  # e.g., "Within 5 minutes"
    is_active = models.BooleanField(default=True)
    order = models.PositiveIntegerField(default=0)
    
    class Meta:
        ordering = ['order']
    
    def __str__(self):
        return self.method

class TransferBookingStep(models.Model):
    step_number = models.PositiveIntegerField()
    title = models.CharField(max_length=200)
    description = models.TextField()
    icon = models.CharField(max_length=100, blank=True)
    details = models.JSONField(default=list)  # List of details
    tips = models.TextField(blank=True)
    is_active = models.BooleanField(default=True)
    
    class Meta:
        ordering = ['step_number']
    
    def __str__(self):
        return f"Step {self.step_number}: {self.title}"

class TransferBenefit(models.Model):
    benefit = models.CharField(max_length=200)
    description = models.TextField()
    icon = models.CharField(max_length=100, blank=True)
    color = models.CharField(max_length=50, default='blue')
    is_active = models.BooleanField(default=True)
    order = models.PositiveIntegerField(default=0)
    
    class Meta:
        ordering = ['order']
    
    def __str__(self):
        return self.benefit

class TransferPricingFactor(models.Model):
    factor = models.CharField(max_length=200)
    description = models.TextField()
    icon = models.CharField(max_length=100, blank=True)
    impact = models.CharField(max_length=20, choices=[
        ('High', 'High'),
        ('Medium', 'Medium'),
        ('Low', 'Low'),
    ], default='Medium')
    examples = models.JSONField(default=list)  # List of examples
    is_active = models.BooleanField(default=True)
    order = models.PositiveIntegerField(default=0)
    
    class Meta:
        ordering = ['order']
    
    def __str__(self):
        return self.factor

class FerrySchedule(models.Model):
    """Model for storing ferry schedules and timings"""
    route_name = models.CharField(max_length=200)  # e.g., "Male to Maafushi"
    departure_time = models.TimeField()
    arrival_time = models.TimeField()
    duration = models.CharField(max_length=50)  # e.g., "90 minutes"
    price = models.DecimalField(max_digits=8, decimal_places=2)
    days_of_week = models.JSONField(default=list)  # ['Monday', 'Tuesday', etc.]
    is_active = models.BooleanField(default=True)
    notes = models.TextField(blank=True)
    order = models.PositiveIntegerField(default=0)
    
    class Meta:
        ordering = ['route_name', 'departure_time']
    
    def __str__(self):
        return f"{self.route_name} - {self.departure_time}"

class TransferContent(models.Model):
    """Main content model for transportation page sections"""
    SECTION_CHOICES = [
        ('hero', 'Hero Section'),
        ('transfer_types', 'Transfer Types Section'),
        ('atoll_transfers', 'Atoll Transfers Section'),
        ('transfer_guide', 'Transfer Guide Section'),
        ('pricing', 'Pricing Section'),
        ('faq', 'FAQ Section'),
        ('booking', 'Booking Section'),
    ]
    
    section = models.CharField(max_length=50, choices=SECTION_CHOICES, unique=True)
    title = models.CharField(max_length=200)
    subtitle = models.TextField(blank=True)
    description = models.TextField(blank=True)
    badge_text = models.CharField(max_length=100, blank=True)
    badge_icon = models.CharField(max_length=100, blank=True)
    is_active = models.BooleanField(default=True)
    order = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['order']
        verbose_name = 'Transfer Content'
        verbose_name_plural = 'Transfer Content'
    
    def __str__(self):
        return f"{self.get_section_display()} - {self.title}"


class HomepageContent(models.Model):
    """Model for managing homepage content sections"""
    CONTENT_TYPES = [
        ('hero', 'Hero Section'),
        ('features', 'Features Section'),
        ('testimonials', 'Testimonials Section'),
        ('about_preview', 'About Preview Section'),
        ('cta', 'Call to Action Section'),
        ('stats', 'Statistics Section'),
    ]
    
    content_type = models.CharField(max_length=50, choices=CONTENT_TYPES, unique=True)
    title = models.CharField(max_length=200)
    subtitle = models.TextField(blank=True)
    description = models.TextField(blank=True)
    is_active = models.BooleanField(default=True)
    order = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['order', 'created_at']
    
    def __str__(self):
        return f"{self.get_content_type_display()} - {self.title}"


class HomepageHero(models.Model):
    """Model for homepage hero section"""
    title = models.CharField(max_length=200)
    subtitle = models.TextField()
    description = models.TextField()
    background_image = models.ImageField(upload_to='homepage/hero/', blank=True, null=True)
    background_image_url = models.URLField(blank=True, null=True)
    background_images = models.JSONField(default=list, blank=True, help_text="List of additional background images for rotation")
    cta_primary_text = models.CharField(max_length=100, default="Get Started")
    cta_primary_url = models.CharField(max_length=200, default="#")
    cta_secondary_text = models.CharField(max_length=100, default="Learn More")
    cta_secondary_url = models.CharField(max_length=200, default="#")
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = "Homepage Hero"
        verbose_name_plural = "Homepage Hero"
    
    def __str__(self):
        return f"Hero - {self.title}"

class HomepageImage(models.Model):
    """Model for managing multiple images for homepage sections"""
    IMAGE_TYPES = [
        ('hero', 'Hero Background'),
        ('feature', 'Feature Image'),
        ('testimonial', 'Testimonial Image'),
        ('gallery', 'Gallery Image'),
    ]
    
    image = models.ImageField(upload_to='homepage/images/')
    title = models.CharField(max_length=200, blank=True)
    alt_text = models.CharField(max_length=200, blank=True)
    image_type = models.CharField(max_length=20, choices=IMAGE_TYPES, default='gallery')
    order = models.IntegerField(default=0)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['order', 'created_at']
        verbose_name = 'Homepage Image'
        verbose_name_plural = 'Homepage Images'
    
    def __str__(self):
        return f"{self.get_image_type_display()}: {self.title or self.image.name}"


class HomepageFeature(models.Model):
    """Model for homepage features section"""
    title = models.CharField(max_length=200)
    description = models.TextField()
    icon = models.CharField(max_length=100, blank=True)  # Icon class or name
    image = models.ImageField(upload_to='homepage/features/', blank=True, null=True)
    image_url = models.URLField(blank=True, null=True)
    link_url = models.CharField(max_length=200, blank=True)
    order = models.IntegerField(default=0)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['order', 'created_at']
        verbose_name = "Homepage Feature"
        verbose_name_plural = "Homepage Features"
    
    def __str__(self):
        return f"Feature - {self.title}"


class HomepageTestimonial(models.Model):
    """Model for homepage testimonials section"""
    name = models.CharField(max_length=100)
    role = models.CharField(max_length=100, blank=True)
    company = models.CharField(max_length=100, blank=True)
    content = models.TextField()
    rating = models.IntegerField(choices=[(i, i) for i in range(1, 6)], default=5)
    avatar = models.ImageField(upload_to='homepage/testimonials/', blank=True, null=True)
    avatar_url = models.URLField(blank=True, null=True)
    order = models.IntegerField(default=0)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['order', 'created_at']
        verbose_name = "Homepage Testimonial"
        verbose_name_plural = "Homepage Testimonials"
    
    def __str__(self):
        return f"Testimonial - {self.name}"


class HomepageStatistic(models.Model):
    """Model for homepage statistics section"""
    label = models.CharField(max_length=100)
    value = models.CharField(max_length=50)  # Can be "500+", "4.8", etc.
    icon = models.CharField(max_length=100, blank=True)
    order = models.IntegerField(default=0)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['order', 'created_at']
        verbose_name = "Homepage Statistic"
        verbose_name_plural = "Homepage Statistics"
    
    def __str__(self):
        return f"Statistic - {self.label}: {self.value}"


class HomepageCTASection(models.Model):
    """Model for homepage call-to-action section"""
    title = models.CharField(max_length=200)
    description = models.TextField()
    background_image = models.ImageField(upload_to='homepage/cta/', blank=True, null=True)
    background_image_url = models.URLField(blank=True, null=True)
    cta_primary_text = models.CharField(max_length=100, default="Get Started")
    cta_primary_url = models.CharField(max_length=200, default="#")
    cta_secondary_text = models.CharField(max_length=100, default="Learn More")
    cta_secondary_url = models.CharField(max_length=200, default="#")
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = "Homepage CTA Section"
        verbose_name_plural = "Homepage CTA Section"
    
    def __str__(self):
        return f"CTA - {self.title}"


class HomepageSettings(models.Model):
    """Model for general homepage settings"""
    site_title = models.CharField(max_length=200, default="Thread Travels & Tours")
    site_description = models.TextField(blank=True)
    site_keywords = models.TextField(blank=True)
    contact_email = models.EmailField(blank=True)
    contact_phone = models.CharField(max_length=20, blank=True)
    whatsapp_number = models.CharField(max_length=20, blank=True)
    social_facebook = models.URLField(blank=True)
    social_instagram = models.URLField(blank=True)
    social_twitter = models.URLField(blank=True)
    social_linkedin = models.URLField(blank=True)
    footer_text = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = "Homepage Settings"
        verbose_name_plural = "Homepage Settings"
    
    def __str__(self):
        return "Homepage Settings"
    
    @classmethod
    def get_settings(cls):
        """Get or create homepage settings"""
        settings, created = cls.objects.get_or_create(pk=1)
        return settings


class FeaturedDestination(models.Model):
    """Model for featured destinations on homepage"""
    destination = models.ForeignKey(Destination, on_delete=models.CASCADE, related_name='featured_homepage')
    title = models.CharField(max_length=200, blank=True, help_text="Override destination name if needed")
    description = models.TextField(blank=True, help_text="Custom description for homepage")
    image = models.ImageField(upload_to='featured_destinations/', blank=True, null=True)
    image_url = models.URLField(blank=True, null=True, help_text="Alternative image URL")
    order = models.IntegerField(default=0)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['order', 'created_at']
        verbose_name = "Featured Destination"
        verbose_name_plural = "Featured Destinations"
    
    def __str__(self):
        return self.title or self.destination.name
    
    @property
    def display_name(self):
        return self.title or self.destination.name
    
    @property
    def display_image(self):
        if self.image:
            return self.image.url
        elif self.image_url:
            return self.image_url
        elif self.destination.image:
            return self.destination.image.url
        return None


# --- Page Hero configuration for non-home pages ---
PAGE_HERO_KEYS = (
    ('about', 'About Page'),
    ('contact', 'Contact Page'),
    ('transportation', 'Transportation Page'),
    ('map', 'Map Page'),
    ('faq', 'FAQ Page'),
    ('blog', 'Blog Page'),
    ('packages', 'Packages Page'),
    ('properties', 'Properties Page'),
)


class PageHero(models.Model):
    """Configurable hero/banner for top of pages (managed in TTM admin)."""
    page_key = models.CharField(max_length=50, choices=PAGE_HERO_KEYS, unique=True)
    title = models.CharField(max_length=200, blank=True)
    subtitle = models.TextField(blank=True)
    background_image = models.ImageField(upload_to='page_heroes/', blank=True, null=True)
    background_image_url = models.URLField(blank=True, null=True)
    overlay_opacity = models.FloatField(default=0.6)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = 'Page Hero'
        verbose_name_plural = 'Page Heroes'

    def __str__(self) -> str:
        return f"Hero: {self.page_key}"

    @property
    def image_url(self) -> str:
        if self.background_image and hasattr(self.background_image, 'url'):
            return self.background_image.url
        return self.background_image_url or ''

# --- Internationalization Models ---

class Language(models.Model):
    """Supported languages for the application"""
    code = models.CharField(max_length=10, unique=True, help_text="Language code (e.g., 'en', 'ru', 'zh')")
    name = models.CharField(max_length=100, help_text="Language name in English")
    native_name = models.CharField(max_length=100, help_text="Language name in native script")
    flag = models.CharField(max_length=10, help_text="Flag emoji or icon")
    direction = models.CharField(max_length=3, choices=[('ltr', 'Left to Right'), ('rtl', 'Right to Left')], default='ltr')
    is_active = models.BooleanField(default=True)
    is_default = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Language"
        verbose_name_plural = "Languages"
        ordering = ['-is_default', 'name']

    def __str__(self):
        return f"{self.name} ({self.code})"

    def save(self, *args, **kwargs):
        # Ensure only one default language
        if self.is_default:
            Language.objects.exclude(pk=self.pk).update(is_default=False)
        super().save(*args, **kwargs)


class TranslationKey(models.Model):
    """Translation keys for the application"""
    key = models.CharField(max_length=200, unique=True, help_text="Translation key (e.g., 'homepage.hero.title')")
    description = models.TextField(blank=True, help_text="Description of what this key is used for")
    context = models.CharField(max_length=100, blank=True, help_text="Context where this translation is used")
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Translation Key"
        verbose_name_plural = "Translation Keys"
        ordering = ['key']

    def __str__(self):
        return self.key


class Translation(models.Model):
    """Individual translations for each key and language"""
    key = models.ForeignKey(TranslationKey, on_delete=models.CASCADE, related_name='translations')
    language = models.ForeignKey(Language, on_delete=models.CASCADE, related_name='translations')
    value = models.TextField(help_text="Translated text")
    is_approved = models.BooleanField(default=False, help_text="Whether this translation has been approved")
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='translations_created')
    approved_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='translations_approved')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Translation"
        verbose_name_plural = "Translations"
        unique_together = ['key', 'language']
        ordering = ['key__key', 'language__code']

    def __str__(self):
        return f"{self.key.key} ({self.language.code}): {self.value[:50]}"


class CulturalContent(models.Model):
    """Cultural and region-specific content"""
    CONTENT_TYPES = [
        ('customs', 'Local Customs'),
        ('etiquette', 'Etiquette'),
        ('language', 'Language Tips'),
        ('currency', 'Currency Information'),
        ('weather', 'Weather Information'),
        ('transportation', 'Transportation Tips'),
        ('food', 'Food & Dining'),
        ('safety', 'Safety Information'),
        ('emergency', 'Emergency Information'),
        ('holidays', 'Holidays & Events'),
    ]

    language = models.ForeignKey(Language, on_delete=models.CASCADE, related_name='cultural_content')
    content_type = models.CharField(max_length=50, choices=CONTENT_TYPES)
    title = models.CharField(max_length=200)
    content = models.TextField()
    is_active = models.BooleanField(default=True)
    order = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Cultural Content"
        verbose_name_plural = "Cultural Content"
        ordering = ['language__code', 'content_type', 'order']
        unique_together = ['language', 'content_type', 'title']

    def __str__(self):
        return f"{self.language.code} - {self.get_content_type_display()}: {self.title}"


class RegionalSettings(models.Model):
    """Region-specific settings and configurations"""
    language = models.ForeignKey(Language, on_delete=models.CASCADE, related_name='regional_settings')
    currency_code = models.CharField(max_length=3, default='USD', help_text="ISO currency code")
    currency_symbol = models.CharField(max_length=5, default='$', help_text="Currency symbol")
    date_format = models.CharField(max_length=20, default='MM/DD/YYYY', help_text="Date format")
    time_format = models.CharField(max_length=10, default='12', choices=[('12', '12-hour'), ('24', '24-hour')])
    timezone = models.CharField(max_length=50, default='UTC', help_text="Timezone")
    phone_format = models.CharField(max_length=50, blank=True, help_text="Phone number format")
    address_format = models.TextField(blank=True, help_text="Address format template")
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Regional Settings"
        verbose_name_plural = "Regional Settings"
        unique_together = ['language']

    def __str__(self):
        return f"Regional Settings - {self.language.name}"


class AboutPageContent(models.Model):
    """Model for About page content sections"""
    SECTION_TYPES = [
        ('hero', 'Hero Section'),
        ('story', 'Our Story Section'),
        ('values', 'Our Values Section'),
        ('stats', 'Statistics Section'),
        ('why_choose', 'Why Choose Us Section'),
        ('cta', 'Call to Action Section'),
    ]
    
    section_type = models.CharField(max_length=50, choices=SECTION_TYPES, unique=True)
    title = models.CharField(max_length=200)
    subtitle = models.TextField(blank=True)
    content = models.TextField(blank=True)
    image = models.ImageField(upload_to='about/', blank=True, null=True)
    image_url = models.URLField(blank=True, null=True)
    is_active = models.BooleanField(default=True)
    order = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['order', 'created_at']
        verbose_name = "About Page Content"
        verbose_name_plural = "About Page Content"
    
    def __str__(self):
        return f"{self.get_section_type_display()} - {self.title}"


class AboutPageValue(models.Model):
    """Model for About page values/features"""
    title = models.CharField(max_length=200)
    description = models.TextField()
    icon = models.CharField(max_length=100, blank=True)  # Icon class or emoji
    order = models.IntegerField(default=0)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['order', 'created_at']
        verbose_name = "About Page Value"
        verbose_name_plural = "About Page Values"
    
    def __str__(self):
        return self.title


class AboutPageStatistic(models.Model):
    """Model for About page statistics"""
    label = models.CharField(max_length=100)
    value = models.CharField(max_length=50)  # Can be "500+", "4.8", etc.
    icon = models.CharField(max_length=100, blank=True)
    description = models.CharField(max_length=200, blank=True)
    order = models.IntegerField(default=0)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['order', 'created_at']
        verbose_name = "About Page Statistic"
        verbose_name_plural = "About Page Statistics"
    
    def __str__(self):
        return f"{self.label}: {self.value}"


class LocalizedPage(models.Model):
    """Localized versions of static pages"""
    PAGE_TYPES = [
        ('about', 'About Page'),
        ('contact', 'Contact Page'),
        ('faq', 'FAQ Page'),
        ('terms', 'Terms & Conditions'),
        ('privacy', 'Privacy Policy'),
        ('cancellation', 'Cancellation Policy'),
        ('refund', 'Refund Policy'),
        ('custom', 'Custom Page'),
    ]

    language = models.ForeignKey(Language, on_delete=models.CASCADE, related_name='localized_pages')
    page_type = models.CharField(max_length=50, choices=PAGE_TYPES)
    title = models.CharField(max_length=200)
    slug = models.SlugField(max_length=200, unique=True)
    content = models.TextField()
    meta_title = models.CharField(max_length=200, blank=True)
    meta_description = models.TextField(blank=True)
    meta_keywords = models.TextField(blank=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Localized Page"
        verbose_name_plural = "Localized Pages"
        unique_together = ['language', 'page_type']
        ordering = ['language__code', 'page_type']

    def __str__(self):
        return f"{self.language.code} - {self.get_page_type_display()}: {self.title}"


class LocalizedFAQ(models.Model):
    """Localized FAQ entries"""
    language = models.ForeignKey(Language, on_delete=models.CASCADE, related_name='localized_faqs')
    category = models.CharField(max_length=100)
    question = models.CharField(max_length=500)
    answer = models.TextField()
    order = models.IntegerField(default=0)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Localized FAQ"
        verbose_name_plural = "Localized FAQs"
        ordering = ['language__code', 'category', 'order']

    def __str__(self):
        return f"{self.language.code} - {self.category}: {self.question[:50]}"


# ============================================================================
# BOAT MODELS - Big Game Fishing & Excursions
# ============================================================================

class BoatAmenity(models.Model):
    """Amenities available on boats"""
    name = models.CharField(max_length=100)
    icon = models.CharField(max_length=100, blank=True, help_text="Icon name for frontend")
    description = models.TextField(blank=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = "Boat Amenity"
        verbose_name_plural = "Boat Amenities"
        ordering = ['name']
    
    def __str__(self):
        return self.name


class Boat(models.Model):
    """Physical boats available for charter"""
    BOAT_TYPES = [
        ('sportfishing', 'Sportfishing'),
        ('center_console', 'Center Console'),
        ('yacht', 'Yacht'),
        ('speedboat', 'Speedboat'),
        ('catamaran', 'Catamaran'),
    ]
    
    # Basic Information
    name = models.CharField(max_length=200, help_text="e.g., '38ft Premium Sportfishing'")
    description = models.TextField()
    detailed_description = models.TextField(blank=True)
    boat_type = models.CharField(max_length=50, choices=BOAT_TYPES, default='sportfishing')
    
    # Specifications
    length_feet = models.PositiveIntegerField(help_text="Length in feet")
    engine_details = models.CharField(max_length=200, help_text="e.g., 'Triple Mercury 300HP'")
    cruising_speed_knots = models.PositiveIntegerField(help_text="Cruising speed in knots")
    top_speed_knots = models.PositiveIntegerField(help_text="Top speed in knots")
    passenger_capacity = models.PositiveIntegerField(default=10)
    crew_size = models.PositiveIntegerField(default=2)
    fuel_tank_liters = models.PositiveIntegerField(null=True, blank=True)
    live_bait_well_liters = models.PositiveIntegerField(null=True, blank=True)
    
    # Features
    has_cabin = models.BooleanField(default=False)
    has_toilet = models.BooleanField(default=False)
    has_shower = models.BooleanField(default=False)
    has_sound_system = models.BooleanField(default=False)
    has_gps = models.BooleanField(default=True)
    has_fish_finder = models.BooleanField(default=True)
    has_radar = models.BooleanField(default=False)
    has_outriggers = models.BooleanField(default=False)
    amenities = models.ManyToManyField(BoatAmenity, blank=True, related_name='boats')
    
    # Location
    departure_location = models.CharField(max_length=200, help_text="e.g., 'ADh. Maamigili'")
    location = models.ForeignKey(Location, on_delete=models.SET_NULL, null=True, blank=True, related_name='boats')
    
    # Media
    hero_image = models.ImageField(upload_to='boats/hero/', blank=True, null=True)
    gallery_images = models.JSONField(default=list, blank=True, help_text="List of image URLs")
    video_url = models.URLField(blank=True, help_text="Boat video URL")
    
    # Marketing
    featured_highlights = models.JSONField(default=list, blank=True, help_text="Key selling points")
    meta_title = models.CharField(max_length=200, blank=True)
    meta_description = models.TextField(blank=True)
    meta_keywords = models.CharField(max_length=500, blank=True)
    
    # Status
    is_featured = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    is_available = models.BooleanField(default=True)
    display_order = models.PositiveIntegerField(default=0)
    
    # Internationalization
    language = models.ForeignKey(Language, on_delete=models.CASCADE, related_name='boats', null=True, blank=True)
    localized_name = models.CharField(max_length=200, blank=True)
    localized_description = models.TextField(blank=True)
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-is_featured', 'display_order', 'name']
        verbose_name = 'Boat'
        verbose_name_plural = 'Boats'
    
    def __str__(self):
        return f"{self.name} ({self.length_feet}ft)"
    
    @property
    def speed_range(self):
        """Return speed range as string"""
        return f"{self.cruising_speed_knots}-{self.top_speed_knots} knots"


class BoatImage(models.Model):
    """Images for boats"""
    boat = models.ForeignKey(Boat, on_delete=models.CASCADE, related_name='images')
    image = models.ImageField(upload_to='boats/gallery/')
    caption = models.CharField(max_length=200, blank=True)
    alt_text = models.CharField(max_length=200, blank=True)
    display_order = models.PositiveIntegerField(default=0)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['display_order', 'created_at']
        verbose_name = 'Boat Image'
        verbose_name_plural = 'Boat Images'
    
    def __str__(self):
        return f"{self.boat.name} - Image {self.display_order}"


class BoatActivity(models.Model):
    """Activities available on boats"""
    ACTIVITY_TYPES = [
        ('fishing', 'Fishing'),
        ('excursion', 'Excursion'),
        ('wildlife_watching', 'Wildlife Watching'),
        ('water_sports', 'Water Sports'),
        ('island_hopping', 'Island Hopping'),
        ('custom', 'Custom Experience'),
    ]
    
    DIFFICULTY_LEVELS = [
        ('easy', 'Easy'),
        ('moderate', 'Moderate'),
        ('challenging', 'Challenging'),
        ('expert', 'Expert'),
    ]
    
    # Basic Information
    name = models.CharField(max_length=200, help_text="e.g., 'Big Game Fishing', 'Trolling'")
    description = models.TextField()
    detailed_description = models.TextField(blank=True)
    activity_type = models.CharField(max_length=50, choices=ACTIVITY_TYPES)
    
    # Details
    duration_hours = models.PositiveIntegerField(default=8, help_text="Typical duration in hours")
    duration_description = models.CharField(max_length=100, blank=True, help_text="e.g., 'Full day', 'Half day'")
    min_participants = models.PositiveIntegerField(default=1)
    max_participants = models.PositiveIntegerField(default=10)
    difficulty_level = models.CharField(max_length=20, choices=DIFFICULTY_LEVELS, default='moderate')
    
    # Suitable Boats
    suitable_boats = models.ManyToManyField(Boat, related_name='activities', blank=True)
    
    # What's Included/Excluded
    includes = models.JSONField(default=list, help_text="List of what's included")
    excludes = models.JSONField(default=list, help_text="List of what's not included")
    requirements = models.JSONField(default=list, help_text="Requirements for participants")
    target_species = models.JSONField(default=list, blank=True, help_text="For fishing activities: target fish species")
    
    # Media
    hero_image = models.ImageField(upload_to='boat_activities/', blank=True, null=True)
    gallery_images = models.JSONField(default=list, blank=True)
    video_url = models.URLField(blank=True)
    
    # Marketing
    featured_highlights = models.JSONField(default=list, blank=True)
    meta_title = models.CharField(max_length=200, blank=True)
    meta_description = models.TextField(blank=True)
    
    # Status
    is_featured = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    display_order = models.PositiveIntegerField(default=0)
    
    # Internationalization
    language = models.ForeignKey(Language, on_delete=models.CASCADE, related_name='boat_activities', null=True, blank=True)
    localized_name = models.CharField(max_length=200, blank=True)
    localized_description = models.TextField(blank=True)
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-is_featured', 'display_order', 'name']
        verbose_name = 'Boat Activity'
        verbose_name_plural = 'Boat Activities'
    
    def __str__(self):
        return self.name


class BoatActivityImage(models.Model):
    """Images for boat activities"""
    activity = models.ForeignKey(BoatActivity, on_delete=models.CASCADE, related_name='images')
    image = models.ImageField(upload_to='boat_activities/gallery/')
    caption = models.CharField(max_length=200, blank=True)
    alt_text = models.CharField(max_length=200, blank=True)
    display_order = models.PositiveIntegerField(default=0)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['display_order', 'created_at']
        verbose_name = 'Activity Image'
        verbose_name_plural = 'Activity Images'
    
    def __str__(self):
        return f"{self.activity.name} - Image {self.display_order}"


class BoatPackage(models.Model):
    """Boat charter packages (Silver/Gold tiers)"""
    PACKAGE_TIERS = [
        ('silver', 'Silver Package'),
        ('gold', 'Gold Package'),
        ('platinum', 'Platinum Package'),
        ('custom', 'Custom Package'),
    ]
    
    # Basic Information
    name = models.CharField(max_length=200, help_text="e.g., 'Silver Package - 38ft'")
    description = models.TextField()
    detailed_description = models.TextField(blank=True)
    
    # Package Details
    boat = models.ForeignKey(Boat, on_delete=models.CASCADE, related_name='packages')
    package_tier = models.CharField(max_length=20, choices=PACKAGE_TIERS)
    
    # Pricing
    price = models.DecimalField(max_digits=10, decimal_places=2)
    currency = models.CharField(max_length=3, default='USD')
    pricing_notes = models.TextField(blank=True, help_text="e.g., 'More days = cheaper price'")
    
    # Duration
    duration_hours = models.PositiveIntegerField(default=8)
    duration_description = models.CharField(max_length=100, default='Full-day charter (8 hours)')
    
    # What's Included
    includes = models.JSONField(default=list, help_text="List of inclusions")
    
    # Activities
    activities_included = models.ManyToManyField(BoatActivity, blank=True, related_name='packages')
    
    # Special Offers
    special_offers = models.JSONField(default=list, blank=True, help_text="Current promotions")
    discount_percentage = models.PositiveIntegerField(default=0, help_text="Discount percentage if applicable")
    
    # Booking Requirements
    booking_notice_hours = models.PositiveIntegerField(default=48, help_text="Minimum advance booking in hours")
    booking_notice_description = models.CharField(max_length=200, default='48 hours advance booking required')
    
    # Additional Info
    max_participants = models.PositiveIntegerField(null=True, blank=True)
    additional_notes = models.TextField(blank=True)
    
    # Media
    hero_image = models.ImageField(upload_to='boat_packages/', blank=True, null=True)
    gallery_images = models.JSONField(default=list, blank=True)
    
    # Marketing
    featured_highlights = models.JSONField(default=list, blank=True)
    meta_title = models.CharField(max_length=200, blank=True)
    meta_description = models.TextField(blank=True)
    
    # Status
    is_featured = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    is_available = models.BooleanField(default=True)
    display_order = models.PositiveIntegerField(default=0)
    
    # Internationalization
    language = models.ForeignKey(Language, on_delete=models.CASCADE, related_name='boat_packages', null=True, blank=True)
    localized_name = models.CharField(max_length=200, blank=True)
    localized_description = models.TextField(blank=True)
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-is_featured', 'boat', 'display_order']
        verbose_name = 'Boat Package'
        verbose_name_plural = 'Boat Packages'
    
    def __str__(self):
        return f"{self.name} - ${self.price}"
    
    @property
    def discounted_price(self):
        """Calculate discounted price if discount is active"""
        if self.discount_percentage > 0:
            discount = (self.price * self.discount_percentage) / 100
            return self.price - discount
        return self.price


class BoatBooking(models.Model):
    """Boat booking inquiries and confirmations"""
    STATUS_CHOICES = [
        ('inquiry', 'Inquiry'),
        ('pending', 'Pending Confirmation'),
        ('confirmed', 'Confirmed'),
        ('completed', 'Completed'),
        ('cancelled', 'Cancelled'),
    ]
    
    # Customer Information
    customer = models.ForeignKey(Customer, on_delete=models.SET_NULL, null=True, blank=True, related_name='boat_bookings')
    customer_name = models.CharField(max_length=200)
    customer_email = models.EmailField()
    customer_phone = models.CharField(max_length=20)
    customer_whatsapp = models.CharField(max_length=20, blank=True)
    
    # Booking Details
    boat = models.ForeignKey(Boat, on_delete=models.SET_NULL, null=True, blank=True, related_name='bookings')
    activity = models.ForeignKey(BoatActivity, on_delete=models.SET_NULL, null=True, blank=True, related_name='bookings')
    package = models.ForeignKey(BoatPackage, on_delete=models.SET_NULL, null=True, blank=True, related_name='bookings')
    
    # Date and Participants
    preferred_date = models.DateField()
    preferred_time = models.TimeField(null=True, blank=True)
    number_of_participants = models.PositiveIntegerField(default=1)
    
    # Special Requests
    special_requests = models.TextField(blank=True)
    dietary_requirements = models.TextField(blank=True)
    
    # Pricing
    quoted_price = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    currency = models.CharField(max_length=3, default='USD')
    
    # Status
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='inquiry')
    admin_notes = models.TextField(blank=True)
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    confirmed_at = models.DateTimeField(null=True, blank=True)
    completed_at = models.DateTimeField(null=True, blank=True)
    
    class Meta:
        ordering = ['-created_at']
        verbose_name = 'Boat Booking'
        verbose_name_plural = 'Boat Bookings'
    
    def __str__(self):
        return f"{self.customer_name} - {self.preferred_date} ({self.status})"


class BoatReview(models.Model):
    """Customer reviews for boats and activities"""
    boat = models.ForeignKey(Boat, on_delete=models.CASCADE, related_name='reviews')
    activity = models.ForeignKey(BoatActivity, on_delete=models.SET_NULL, null=True, blank=True, related_name='reviews')
    booking = models.ForeignKey(BoatBooking, on_delete=models.SET_NULL, null=True, blank=True, related_name='reviews')
    
    # Reviewer Information
    customer = models.ForeignKey(Customer, on_delete=models.SET_NULL, null=True, blank=True)
    reviewer_name = models.CharField(max_length=200)
    reviewer_email = models.EmailField(blank=True)
    reviewer_country = models.CharField(max_length=100, blank=True)
    
    # Review Content
    rating = models.PositiveIntegerField(help_text="Rating out of 5")
    title = models.CharField(max_length=200)
    review_text = models.TextField()
    
    # Additional Ratings
    boat_condition_rating = models.PositiveIntegerField(null=True, blank=True, help_text="Rating out of 5")
    crew_rating = models.PositiveIntegerField(null=True, blank=True, help_text="Rating out of 5")
    value_rating = models.PositiveIntegerField(null=True, blank=True, help_text="Rating out of 5")
    
    # Verification
    is_verified = models.BooleanField(default=False)
    verified_booking = models.BooleanField(default=False)
    
    # Status
    is_approved = models.BooleanField(default=False)
    is_featured = models.BooleanField(default=False)
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-created_at']
        verbose_name = 'Boat Review'
        verbose_name_plural = 'Boat Reviews'
    
    def __str__(self):
        return f"{self.reviewer_name} - {self.boat.name} ({self.rating}/5)"


class GalleryMedia(models.Model):
    """Standalone gallery media for showcasing photos, videos, and GIFs"""
    MEDIA_TYPES = [
        ('image', 'Image'),
        ('video', 'Video'),
        ('gif', 'GIF'),
    ]
    
    # Media type and file
    media_type = models.CharField(max_length=10, choices=MEDIA_TYPES, default='image')
    image = models.ImageField(upload_to='gallery/images/', null=True, blank=True)
    video = models.FileField(upload_to='gallery/videos/', null=True, blank=True)
    video_url = models.URLField(blank=True, help_text="External video URL (YouTube, Vimeo, etc.)")
    video_thumbnail = models.ImageField(upload_to='gallery/video_thumbnails/', null=True, blank=True)
    
    # Metadata
    title = models.CharField(max_length=200, blank=True)
    caption = models.TextField(blank=True)
    alt_text = models.CharField(max_length=255, blank=True)
    photographer = models.CharField(max_length=200, blank=True)
    location = models.CharField(max_length=200, blank=True)
    
    # Display settings
    display_order = models.PositiveIntegerField(default=0, help_text="Lower numbers appear first")
    is_featured = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    
    # Optional linking (not required - can be standalone)
    package = models.ForeignKey(Package, on_delete=models.SET_NULL, null=True, blank=True, related_name='gallery_media')
    resort = models.ForeignKey(Resort, on_delete=models.SET_NULL, null=True, blank=True, related_name='gallery_media')
    boat = models.ForeignKey(Boat, on_delete=models.SET_NULL, null=True, blank=True, related_name='gallery_media')
    
    # Tags for filtering/searching
    tags = models.CharField(max_length=500, blank=True, help_text="Comma-separated tags")
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['display_order', '-is_featured', '-created_at']
        verbose_name = 'Gallery Media'
        verbose_name_plural = 'Gallery Media'
    
    def __str__(self):
        media_type_display = self.get_media_type_display()
        title = self.title or f"{media_type_display} #{self.id}"
        return title
    
    @property
    def file_url(self):
        """Get the URL of the media file"""
        if self.media_type == 'image' and self.image:
            return self.image.url
        elif self.media_type == 'gif' and self.image:
            return self.image.url
        elif self.media_type == 'video':
            if self.video:
                return self.video.url
            elif self.video_url:
                return self.video_url
        return ''
    
    @property
    def thumbnail_url(self):
        """Get the URL of the thumbnail for display"""
        if self.media_type == 'image' or self.media_type == 'gif':
            return self.image.url if self.image else ''
        elif self.media_type == 'video':
            if self.video_thumbnail:
                return self.video_thumbnail.url
            elif self.video:
                return self.video.url  # Fallback to video itself
            elif self.video_url:
                # Try to extract thumbnail from YouTube/Vimeo URL
                return self._extract_video_thumbnail(self.video_url)
        return ''
    
    def _extract_video_thumbnail(self, url):
        """Extract thumbnail URL from YouTube or Vimeo URL"""
        import re
        # YouTube
        youtube_match = re.search(r'(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]+)', url)
        if youtube_match:
            video_id = youtube_match.group(1)
            return f"https://img.youtube.com/vi/{video_id}/maxresdefault.jpg"
        
        # Vimeo
        vimeo_match = re.search(r'vimeo\.com\/(\d+)', url)
        if vimeo_match:
            video_id = vimeo_match.group(1)
            # Vimeo requires API call for thumbnail, return placeholder for now
            return ''
        
        return ''
    
    def clean(self):
        """Ensure only appropriate fields are set based on media type"""
        from django.core.exceptions import ValidationError
        
        # Skip validation if we're in the middle of saving a file (field.save() was called)
        # This allows us to create the object first, then add the file
        if hasattr(self, '_skip_validation'):
            return
        
        if self.media_type == 'image':
            if not self.image:
                raise ValidationError({'image': 'Image file is required for image media type.'})
        elif self.media_type == 'gif':
            if not self.image:
                raise ValidationError({'image': 'GIF file is required for GIF media type.'})
        elif self.media_type == 'video':
            if not self.video and not self.video_url:
                raise ValidationError({'video': 'Video file or URL is required for video media type.'})
    
    def save(self, *args, **kwargs):
        # Allow skipping validation for file uploads
        skip_validation = kwargs.pop('skip_validation', False)
        if skip_validation:
            self._skip_validation = True
        try:
            self.clean()
        finally:
            if hasattr(self, '_skip_validation'):
                delattr(self, '_skip_validation')
        super().save(*args, **kwargs)
