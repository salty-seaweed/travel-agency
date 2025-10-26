#!/usr/bin/env python3
"""
Script to add Maldives honeymoon packages to the production database.
This script creates 4 separate packages with their variants, destinations, activities, and inclusions.
"""

import os
import sys
import django
from decimal import Decimal

# Setup Django environment
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'travel_agency.settings')
django.setup()

from api.models import (
    Package, PackageVariant, PackageDestination, PackageInclusion, 
    PackageActivity, Location, Destination, Experience
)

def create_location_and_destination():
    """Create or get the location and destination for Maamigili"""
    print("Creating location and destination for Maamigili...")
    
    # Create or get location
    location, created = Location.objects.get_or_create(
        island="Maamigili",
        atoll="Alif Dhaal",
        defaults={
            'latitude': 3.4833,  # Approximate coordinates for Maamigili
            'longitude': 72.9167
        }
    )
    print(f"Location: {'Created' if created else 'Found'} - {location}")
    
    # Create or get destination
    destination, created = Destination.objects.get_or_create(
        island="Maamigili",
        atoll="Alif Dhaal",
        defaults={
            'name': "Maamigili Island",
            'description': "A beautiful island in Alif Dhaal Atoll, perfect for honeymoon getaways with pristine beaches and crystal-clear waters.",
            'latitude': 3.4833,
            'longitude': 72.9167,
            'is_featured': True,
            'is_active': True
        }
    )
    print(f"Destination: {'Created' if created else 'Found'} - {destination}")
    
    return location, destination

def create_experiences():
    """Create reusable experiences for Maldives activities"""
    print("Creating experiences...")
    
    experiences_data = [
        {
            'name': 'Whale Shark Snorkeling',
            'description': 'Swim with the gentle giants of the ocean in their natural habitat. An unforgettable experience with the world\'s largest fish.',
            'experience_type': 'diving',
            'duration': '3-4 hours',
            'price': Decimal('120.00'),
            'difficulty_level': 'moderate',
            'includes': ['Snorkeling equipment', 'Professional guide', 'Safety briefing', 'Refreshments'],
            'excludes': ['Transportation to site', 'Underwater camera rental'],
            'requirements': ['Basic swimming skills', 'Comfortable in deep water']
        },
        {
            'name': 'Manta Ray Encounter',
            'description': 'Experience the grace of manta rays as they glide through the crystal-clear waters. A magical underwater ballet.',
            'experience_type': 'diving',
            'duration': '2-3 hours',
            'price': Decimal('100.00'),
            'difficulty_level': 'easy',
            'includes': ['Snorkeling equipment', 'Professional guide', 'Safety briefing'],
            'excludes': ['Transportation to site', 'Underwater camera rental'],
            'requirements': ['Basic swimming skills']
        },
        {
            'name': 'Turtle Snorkeling',
            'description': 'Swim alongside sea turtles in their natural environment. A peaceful and educational experience.',
            'experience_type': 'diving',
            'duration': '2 hours',
            'price': Decimal('80.00'),
            'difficulty_level': 'easy',
            'includes': ['Snorkeling equipment', 'Professional guide', 'Safety briefing'],
            'excludes': ['Transportation to site', 'Underwater camera rental'],
            'requirements': ['Basic swimming skills']
        },
        {
            'name': 'Sunset Cruise',
            'description': 'Enjoy a romantic sunset cruise with breathtaking views of the Maldivian horizon. Perfect for couples.',
            'experience_type': 'sailing',
            'duration': '2 hours',
            'price': Decimal('150.00'),
            'difficulty_level': 'easy',
            'includes': ['Boat ride', 'Refreshments', 'Professional crew', 'Sunset viewing'],
            'excludes': ['Alcoholic beverages', 'Photography service'],
            'requirements': ['No special requirements']
        },
        {
            'name': 'Private Island Picnic',
            'description': 'Exclusive private island experience with a romantic picnic setup. Ultimate privacy and luxury.',
            'experience_type': 'adventure',
            'duration': '4-5 hours',
            'price': Decimal('200.00'),
            'difficulty_level': 'easy',
            'includes': ['Private island access', 'Picnic setup', 'Refreshments', 'Beach activities'],
            'excludes': ['Alcoholic beverages', 'Photography service'],
            'requirements': ['No special requirements']
        },
        {
            'name': 'Dolphin Watching',
            'description': 'Watch playful dolphins in their natural habitat. A joyful experience for all ages.',
            'experience_type': 'sailing',
            'duration': '2-3 hours',
            'price': Decimal('90.00'),
            'difficulty_level': 'easy',
            'includes': ['Boat ride', 'Professional guide', 'Refreshments'],
            'excludes': ['Underwater camera rental'],
            'requirements': ['No special requirements']
        },
        {
            'name': 'Sandbank Excursion',
            'description': 'Visit pristine sandbanks that appear during low tide. Perfect for photography and relaxation.',
            'experience_type': 'adventure',
            'duration': '3-4 hours',
            'price': Decimal('110.00'),
            'difficulty_level': 'easy',
            'includes': ['Boat transportation', 'Sandbank access', 'Refreshments', 'Beach setup'],
            'excludes': ['Photography service', 'Snorkeling equipment'],
            'requirements': ['No special requirements']
        }
    ]
    
    created_experiences = []
    for exp_data in experiences_data:
        experience, created = Experience.objects.get_or_create(
            name=exp_data['name'],
            defaults=exp_data
        )
        created_experiences.append(experience)
        print(f"Experience: {'Created' if created else 'Found'} - {experience.name}")
    
    return created_experiences

def create_package(package_data, location, destination, experiences):
    """Create a single package with all its related data"""
    print(f"\nCreating package: {package_data['name']}")
    
    # Create the main package
    package = Package.objects.create(
        name=package_data['name'],
        description=package_data['description'],
        detailed_description=package_data['detailed_description'],
        price=package_data['price'],
        original_price=package_data['original_price'],
        discount_percentage=package_data['discount_percentage'],
        duration=package_data['duration'],
        category='honeymoon',
        difficulty_level='easy',
        highlights=package_data['highlights'],
        group_size_min=2,
        group_size_max=8,
        group_size_recommended=2,
        accommodation_type='romantic_guesthouse',
        room_type='romantic_couple_room',
        meal_plan='full_board',
        transportation_details='''International Arrival:
Fly into Velana International Airport (Malé - MLE), the main international gateway to the Maldives.

Domestic Transfer:
Enjoy a scenic speedboat journey from Malé to Maamigili Island, taking approximately 45-60 minutes through the crystal-clear waters of the Indian Ocean. Experience the beauty of the Maldivian atolls as you cruise past pristine islands and coral reefs.

Airport Meet & Greet:
Our team will warmly welcome you upon arrival in Malé and assist with your domestic transfer check-in.

Maamigili Arrival:
Upon arriving in Maamigili, you'll be greeted by our local hosts and transferred directly to your accommodation in a comfortable private vehicle.''',
        airport_transfers=True,
        best_time_to_visit='Year-round, best from November to April',
        what_to_bring=[
            'Swimwear and beachwear',
            'Sunscreen (reef-safe)',
            'Underwater camera',
            'Light clothing',
            'Comfortable sandals',
            'Personal toiletries'
        ],
        important_notes=[
            'International flights not included',
            'Valid passport required',
            'Travel insurance recommended',
            'Check-in: 2:00 PM, Check-out: 11:00 AM'
        ],
        booking_terms='Full payment required at time of booking. Package is non-refundable but can be rescheduled with 30 days notice.',
        cancellation_policy='Cancellations made 30+ days before arrival: 50% refund. Cancellations made less than 30 days before arrival: no refund.',
        payment_terms='Full payment required at booking. We accept major credit cards and bank transfers.',
        is_featured=True
    )
    
    # Create package destination
    PackageDestination.objects.create(
        package=package,
        location=location,
        duration=package_data['duration'],
        description=f"Stay at a romantic guesthouse in Maamigili, Alif Dhaal Atoll. Experience authentic Maldivian hospitality in comfortable couple-friendly accommodations with modern amenities and stunning ocean views.",
        highlights=[
            'Romantic couple rooms with ocean views',
            'Private beach access',
            'Authentic Maldivian hospitality',
            'Modern amenities and comfort',
            'Local island atmosphere',
            'Crystal clear waters for swimming'
        ],
        activities=[
            'Beach relaxation and romantic walks',
            'Local island exploration',
            'Cultural experiences with locals',
            'Water activities and snorkeling',
            'Sunset viewing from private beach',
            'Couple spa treatments (optional)'
        ]
    )
    
    # Create package inclusions
    inclusions_data = [
        {'category': 'included', 'item': 'Romantic Accommodation', 'description': f"{package_data['duration']} nights in romantic couple room with ocean views", 'icon': '🏨'},
        {'category': 'included', 'item': 'All Meals', 'description': 'Full board meal plan (breakfast, lunch, dinner)', 'icon': '🍽️'},
        {'category': 'included', 'item': 'Airport Pickup & Transfer', 'description': 'Meet & greet at airport + speedboat transfers to Maamigili', 'icon': '🚤'},
        {'category': 'included', 'item': 'Daily Activities', 'description': 'All mentioned activities and excursions', 'icon': '🏊‍♂️'},
        {'category': 'included', 'item': 'Professional Guide', 'description': 'Experienced local guide for all activities', 'icon': '👨‍🏫'},
        {'category': 'included', 'item': 'Equipment', 'description': 'Snorkeling equipment and safety gear', 'icon': '🤿'},
        {'category': 'included', 'item': 'Private Beach Access', 'description': 'Access to private beach area for couples', 'icon': '🏖️'},
        {'category': 'excluded', 'item': 'International Flights', 'description': 'Flights to and from Maldives', 'icon': '✈️'},
        {'category': 'excluded', 'item': 'Travel Insurance', 'description': 'Travel and medical insurance', 'icon': '🛡️'},
        {'category': 'excluded', 'item': 'Personal Expenses', 'description': 'Souvenirs, additional meals, tips', 'icon': '💰'},
        {'category': 'excluded', 'item': 'Alcoholic Beverages', 'description': 'Alcoholic drinks and beverages', 'icon': '🍷'},
        {'category': 'excluded', 'item': 'Spa Treatments', 'description': 'Optional couple spa treatments', 'icon': '💆‍♀️'}
    ]
    
    for inc_data in inclusions_data:
        PackageInclusion.objects.create(
            package=package,
            **inc_data
        )
    
    # Create package activities based on the package type
    activities_data = []
    if 'Island Escape' in package_data['name']:
        activities_data = [
            {'name': 'Whale Shark Snorkeling', 'description': 'Swim with gentle whale sharks', 'duration': '3-4 hours', 'category': 'marine_life'},
            {'name': 'Manta Ray Encounter', 'description': 'Experience graceful manta rays', 'duration': '2-3 hours', 'category': 'marine_life'},
            {'name': 'Turtle Snorkeling', 'description': 'Swim alongside sea turtles', 'duration': '2 hours', 'category': 'marine_life'}
        ]
    elif 'Adventure Break' in package_data['name']:
        activities_data = [
            {'name': 'Whale Shark Snorkeling', 'description': 'Swim with gentle whale sharks', 'duration': '3-4 hours', 'category': 'marine_life'},
            {'name': 'Manta Ray Encounter', 'description': 'Experience graceful manta rays', 'duration': '2-3 hours', 'category': 'marine_life'},
            {'name': 'Sunset Cruise', 'description': 'Romantic sunset boat ride', 'duration': '2 hours', 'category': 'romantic'},
            {'name': 'Turtle Snorkeling', 'description': 'Swim alongside sea turtles', 'duration': '2 hours', 'category': 'marine_life'}
        ]
    elif 'Romantic Escape' in package_data['name']:
        activities_data = [
            {'name': 'Private Island Picnic', 'description': 'Exclusive private island experience', 'duration': '4-5 hours', 'category': 'romantic'},
            {'name': 'Sunset Cruise', 'description': 'Romantic sunset boat ride', 'duration': '2 hours', 'category': 'romantic'},
            {'name': 'Manta Ray Encounter', 'description': 'Experience graceful manta rays', 'duration': '2-3 hours', 'category': 'marine_life'},
            {'name': 'Turtle Snorkeling', 'description': 'Swim alongside sea turtles', 'duration': '2 hours', 'category': 'marine_life'}
        ]
    elif 'Maldives Bliss' in package_data['name']:
        activities_data = [
            {'name': 'Whale Shark Snorkeling', 'description': 'Swim with gentle whale sharks', 'duration': '3-4 hours', 'category': 'marine_life'},
            {'name': 'Dolphin Watching', 'description': 'Watch playful dolphins', 'duration': '2-3 hours', 'category': 'marine_life'},
            {'name': 'Sandbank Excursion', 'description': 'Visit pristine sandbanks', 'duration': '3-4 hours', 'category': 'adventure'},
            {'name': 'Sunset Cruise', 'description': 'Romantic sunset boat ride', 'duration': '2 hours', 'category': 'romantic'},
            {'name': 'Manta Ray Encounter', 'description': 'Experience graceful manta rays', 'duration': '2-3 hours', 'category': 'marine_life'}
        ]
    
    for act_data in activities_data:
        PackageActivity.objects.create(
            package=package,
            **act_data,
            difficulty='easy',
            included=True,
            price=''
        )
    
    print(f"✅ Created package: {package.name}")
    print(f"   💰 Original Price: ${package.original_price}")
    print(f"   🎯 Final Price: ${package.price} (Save ${package.original_price - package.price})")
    print(f"   📊 Discount: {package.discount_percentage}%")
    return package

def main():
    """Main function to create all Maldives packages"""
    print("🌺 Starting Maldives Package Creation Script 🌺")
    print("=" * 60)
    
    # Create location and destination
    location, destination = create_location_and_destination()
    
    # Create experiences
    experiences = create_experiences()
    
    # Package data with pricing strategy
    packages_data = [
        {
            'name': '4 Nights – Island Escape',
            'description': 'Enjoy 4 nights of island bliss with Whale Shark, Manta & Turtle snorkeling. Perfect for a short romantic getaway.',
            'detailed_description': 'Experience the magic of the Maldives with this 4-night island escape. Stay in a comfortable guesthouse on Maamigili Island and enjoy world-class snorkeling with whale sharks, manta rays, and sea turtles. This package is perfect for couples looking for a short but unforgettable romantic getaway.',
            'original_price': Decimal('1199.00'),
            'price': Decimal('999.00'),
            'discount_percentage': Decimal('16.68'),
            'duration': 4,
            'highlights': 'Whale Shark Snorkeling, Manta Ray Encounters, Turtle Snorkeling, Full Board Meals, Speedboat Transfers'
        },
        {
            'name': '5 Nights – Adventure Break',
            'description': 'Whale Sharks, Mantas, Sunset Cruise, and Turtle Snorkeling in 5 magical nights. A perfect mix of adventure and romance.',
            'detailed_description': 'Dive into adventure with this 5-night package that combines thrilling marine encounters with romantic experiences. Swim with whale sharks and manta rays, enjoy a romantic sunset cruise, and explore the underwater world with sea turtles. Perfect for adventurous couples who want both excitement and romance.',
            'original_price': Decimal('1549.00'),
            'price': Decimal('1299.00'),
            'discount_percentage': Decimal('16.14'),
            'duration': 5,
            'highlights': 'Whale Shark Snorkeling, Manta Ray Encounters, Sunset Cruise, Turtle Snorkeling, Full Board Meals, Speedboat Transfers'
        },
        {
            'name': '6 Nights – Romantic Escape',
            'description': 'Private island picnic, Sunset Cruise, and marine encounters. Designed for couples who want more time together.',
            'detailed_description': 'Indulge in romance with this 6-night escape designed specifically for couples. Enjoy a private island picnic, romantic sunset cruises, and intimate marine encounters. This package offers the perfect balance of adventure and romance, giving you more time to create lasting memories together.',
            'original_price': Decimal('1799.00'),
            'price': Decimal('1499.00'),
            'discount_percentage': Decimal('16.68'),
            'duration': 6,
            'highlights': 'Private Island Picnic, Sunset Cruise, Manta Ray Encounters, Turtle Snorkeling, Full Board Meals, Speedboat Transfers'
        },
        {
            'name': '7 Nights – Maldives Bliss',
            'description': 'Whale Sharks, Dolphins, Sandbanks, and more. The perfect honeymoon package with all meals included.',
            'detailed_description': 'Experience the ultimate Maldives honeymoon with this comprehensive 7-night package. Swim with whale sharks and dolphins, visit pristine sandbanks, enjoy romantic sunset cruises, and encounter graceful manta rays. This is the perfect package for couples celebrating their honeymoon or special anniversary.',
            'original_price': Decimal('2149.00'),
            'price': Decimal('1799.00'),
            'discount_percentage': Decimal('16.28'),
            'duration': 7,
            'highlights': 'Whale Shark Snorkeling, Dolphin Watching, Sandbank Excursion, Sunset Cruise, Manta Ray Encounters, Full Board Meals, Speedboat Transfers'
        }
    ]
    
    # Create all packages
    created_packages = []
    for package_data in packages_data:
        package = create_package(package_data, location, destination, experiences)
        created_packages.append(package)
    
    print("\n" + "=" * 60)
    print("🎉 MALDIVES PACKAGES CREATION COMPLETE! 🎉")
    print("=" * 60)
    print(f"✅ Created {len(created_packages)} packages:")
    for package in created_packages:
        savings = package.original_price - package.price
        print(f"   • {package.name}")
        print(f"     💰 ${package.original_price} → ${package.price} (Save ${savings} - {package.discount_percentage}% off)")
    
    print(f"\n✅ Created {len(experiences)} reusable experiences")
    print(f"✅ Created location: {location}")
    print(f"✅ Created destination: {destination}")
    
    print("\n📋 Package Summary:")
    print("   • All packages include full board meals")
    print("   • All packages include speedboat transfers")
    print("   • All packages are couple-focused (2-8 people)")
    print("   • All packages feature marine life encounters")
    print("   • International flights are NOT included")
    
    print("\n🚀 Packages are now ready for production!")

if __name__ == '__main__':
    main()
