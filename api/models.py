from django.db import models
from django.contrib.auth.models import User

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
    latitude = models.FloatField()
    longitude = models.FloatField()
    
    def __str__(self):
        return f"{self.island}, {self.atoll}" if self.atoll else self.island

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
    properties = models.ManyToManyField(Property, related_name='packages')
    price = models.DecimalField(max_digits=10, decimal_places=2)
    original_price = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    discount_percentage = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    duration = models.PositiveIntegerField(default=1)  # Duration in days
    is_featured = models.BooleanField(default=False)
    start_date = models.DateField(null=True, blank=True)
    end_date = models.DateField(null=True, blank=True)
    
    # Enhanced package information
    category = models.CharField(max_length=100, blank=True)
    difficulty_level = models.CharField(max_length=20, choices=DIFFICULTY_CHOICES, default='easy')
    
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
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return self.name

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
    package = models.ForeignKey(Package, on_delete=models.CASCADE, related_name='images')
    image = models.ImageField(upload_to='package_images/')
    caption = models.CharField(max_length=255, blank=True)
    order = models.PositiveIntegerField(default=0)
    is_featured = models.BooleanField(default=False)
    
    def __str__(self):
        return f"Image for {self.package.name}"

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
    og_image = models.ForeignKey('MediaAsset', on_delete=models.SET_NULL, null=True, blank=True, related_name='og_pages')
    
    # Publishing fields
    publish_at = models.DateTimeField(null=True, blank=True)
    unpublish_at = models.DateTimeField(null=True, blank=True)
    template = models.CharField(max_length=100, blank=True, default='default')
    parent = models.ForeignKey('self', on_delete=models.CASCADE, null=True, blank=True, related_name='children')
    path = models.CharField(max_length=500, blank=True)
    
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
    file = models.FileField(upload_to='media/')
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
    def usage_count(self):
        # Count how many times this asset is used
        # This could be implemented by tracking references in content
        return 0  # Implement usage tracking if needed

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
