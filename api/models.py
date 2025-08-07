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
    whatsapp_number = models.CharField(max_length=20)
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
    is_featured = models.BooleanField(default=False)
    
    def __str__(self):
        return f"Image for {self.property.name}"

class Package(models.Model):
    name = models.CharField(max_length=200)
    description = models.TextField()
    properties = models.ManyToManyField(Property, related_name='packages')
    price = models.DecimalField(max_digits=10, decimal_places=2)
    is_featured = models.BooleanField(default=False)
    start_date = models.DateField(null=True, blank=True)
    end_date = models.DateField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return self.name

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
