#!/usr/bin/env python3
"""
Script to add Maldives Nurse Shark Snorkeling Island Escape Package to the development database.
This script creates a comprehensive 5-day snorkeling adventure package with Nurse Sharks at Vaavu Atoll.
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
    """Create or get the locations and destinations for Dhidhoo and Maamigili"""
    print("Creating locations and destinations for Dhidhoo and Maamigili...")

    # Create or get Dhidhoo location
    dhidhoo_location, created = Location.objects.get_or_create(
        island="Dhidhoo",
        atoll="Vaavu",
        defaults={
            'latitude': 3.4667,  # Approximate coordinates for Dhidhoo, Vaavu Atoll
            'longitude': 73.3833
        }
    )
    print(f"Dhidhoo Location: {'Created' if created else 'Found'} - {dhidhoo_location}")

    # Create or get Maamigili location
    maamigili_location, created = Location.objects.get_or_create(
        island="Maamigili",
        atoll="Alif Dhaal",
        defaults={
            'latitude': 3.4833,  # Approximate coordinates for Maamigili
            'longitude': 72.9167
        }
    )
    print(f"Maamigili Location: {'Created' if created else 'Found'} - {maamigili_location}")

    # Create or get Dhidhoo destination
    dhidhoo_destination, created = Destination.objects.get_or_create(
        island="Dhidhoo",
        atoll="Vaavu",
        defaults={
            'name': "Dhidhoo Island",
            'description': "A stunning island in Vaavu Atoll, famous for world-class Nurse Shark snorkeling and incredible marine life encounters. Perfect for divers and ocean lovers seeking authentic Maldivian adventures.",
            'latitude': 3.4667,
            'longitude': 73.3833,
            'is_featured': True,
            'is_active': True
        }
    )
    print(f"Dhidhoo Destination: {'Created' if created else 'Found'} - {dhidhoo_destination}")

    # Get Maamigili destination (should already exist from previous script)
    maamigili_destination, created = Destination.objects.get_or_create(
        island="Maamigili",
        atoll="Alif Dhaal",
        defaults={
            'name': "Maamigili Island",
            'description': "A beautiful island in Alif Dhaal Atoll, perfect for marine life encounters with whale sharks, manta rays, and sea turtles.",
            'latitude': 3.4833,
            'longitude': 72.9167,
            'is_featured': True,
            'is_active': True
        }
    )
    print(f"Maamigili Destination: {'Created' if created else 'Found'} - {maamigili_destination}")

    return dhidhoo_location, maamigili_location, dhidhoo_destination, maamigili_destination

def create_experiences():
    """Create reusable experiences for Maldives snorkeling activities"""
    print("Creating snorkeling experiences...")

    experiences_data = [
        {
            'name': 'Nurse Shark Snorkeling',
            'description': 'Swim alongside majestic Nurse Sharks at the world-famous Vaavu Atoll. Experience the thrill of encountering these gentle giants in their natural habitat.',
            'experience_type': 'diving',
            'duration': 'Full day',
            'price': Decimal('150.00'),
            'difficulty_level': 'moderate',
            'includes': ['Snorkeling equipment', 'Professional guide', 'Safety briefing', 'Boat transportation'],
            'excludes': ['Photography services', 'Additional meals'],
            'requirements': ['Basic swimming skills', 'Comfortable in deep water']
        },
        {
            'name': 'Professional Diving Experience',
            'description': 'Three incredible dives with professional guides, exploring the underwater world of the Maldives.',
            'experience_type': 'diving',
            'duration': 'Full day',
            'price': Decimal('200.00'),
            'difficulty_level': 'moderate',
            'includes': ['Diving equipment', 'Professional instructor', 'Safety briefing', 'Boat transportation'],
            'excludes': ['Underwater camera rental', 'Dive certification'],
            'requirements': ['Basic diving experience or PADI certification']
        },
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

def create_nurse_shark_package(dhidhoo_location, maamigili_location, dhidhoo_destination, maamigili_destination, experiences):
    """Create the Nurse Shark Island Escape Package"""
    print(f"\nCreating package: Island Escape - Nurse Shark Snorkeling")

    # Calculate pricing with discount
    final_price = Decimal('3499.00')  # Final price as specified
    discount_percentage = Decimal('15.00')  # Assuming 15% discount
    original_price = final_price / (1 - discount_percentage / 100)

    # Create the main package
    package = Package.objects.create(
        name='Island Escape',
        description='Dive into one of the Maldives\' most thrilling marine adventures – swim alongside majestic Nurse Sharks at the world-famous Vaavu Atoll.',
        detailed_description='''Experience the ultimate Maldives snorkeling adventure with our Island Escape package, featuring the world-famous Nurse Shark snorkeling at Vaavu Atoll. This comprehensive 5-day experience combines thrilling marine encounters with authentic Maldivian hospitality.

What makes this package special is the unique opportunity to swim alongside majestic Nurse Sharks in their natural habitat at Vaavu Atoll. This is one of the Maldives' most exclusive marine experiences, available only to a few select locations.

You'll spend your first day exploring the incredible underwater world of Vaavu Atoll, swimming with Nurse Sharks and experiencing the thrill of encountering these gentle giants up close. The following days take you to Maamigili Island for additional marine life encounters including whale sharks, manta rays, and sea turtles.

The package includes comfortable accommodation at the Adh. Dhidhoo Dive Guest House, where you'll enjoy all-inclusive meals and the warm hospitality that makes the Maldives so special. Professional dive guides ensure your safety and maximize your enjoyment throughout the experience.

This carefully crafted itinerary provides the perfect balance of adventure and relaxation, making it ideal for ocean lovers, divers, and anyone seeking an unforgettable Maldivian experience.''',
        price=final_price,
        original_price=original_price,
        discount_percentage=discount_percentage,
        duration=5,  # 5 days
        category='adventure',
        difficulty_level='moderate',
        highlights='Nurse Shark Snorkeling, Whale Shark Snorkeling, Manta Ray Encounter, Turtle Snorkeling, Professional Diving, All-Inclusive Stay',
        pricing_type='per_person',
        group_size_min=2,  # 2 people minimum
        group_size_max=8,  # 8 people maximum
        group_size_recommended=4,  # Recommended for group experience
        accommodation_type='dive_guesthouse',
        room_type='comfortable_room',
        meal_plan='full_board',
        transportation_details='''International Arrival:
Fly into Velana International Airport (Malé - MLE), the main international gateway to the Maldives.

Domestic Transfer to Dhidhoo:
Enjoy a scenic speedboat journey from Malé to Dhidhoo Island in Vaavu Atoll, taking approximately 1.5-2 hours through the crystal-clear waters of the Indian Ocean.

Island Transfers:
Daily transfers between Dhidhoo and Maamigili via speedboat for your snorkeling adventures.

Airport Meet & Greet:
Our team will warmly welcome you upon arrival in Malé and assist with your domestic transfer check-in.''',
        airport_transfers=True,
        best_time_to_visit='Year-round, best from November to April',
        weather_info='Tropical climate with warm temperatures year-round. Marine conditions are optimal during the dry season (November to April) with calm seas and excellent visibility.',
        what_to_bring=[
            'Swimwear and beachwear',
            'Sunscreen (reef-safe)',
            'Underwater camera',
            'Light clothing',
            'Comfortable sandals',
            'Personal toiletries',
            'Snorkeling gear (optional - provided)',
            'Light jacket for evenings'
        ],
        important_notes=[
            'International flights not included',
            'Valid passport required',
            'Travel insurance recommended',
            'Check-in: 2:00 PM, Check-out: 11:00 AM',
            'Diving experience preferred but not required',
            'Weather-dependent activities',
            'Minimum age 12 years for Nurse Shark snorkeling'
        ],
        booking_terms='Full payment required at time of booking. Package is non-refundable but can be rescheduled with 30 days notice.',
        cancellation_policy='Cancellations made 30+ days before arrival: 50% refund. Cancellations made less than 30 days before arrival: no refund.',
        payment_terms='Full payment required at booking. We accept major credit cards and bank transfers.',
        is_featured=True
    )

    # Create package destinations
    # Day 1-2: Dhidhoo (Vaavu Atoll)
    PackageDestination.objects.create(
        package=package,
        location=dhidhoo_location,
        duration=2,  # Days 1-2
        description='''Stay at the renowned Adh. Dhidhoo Dive Guest House in Vaavu Atoll, famous for its proximity to the world-class Nurse Shark snorkeling sites. Experience authentic Maldivian hospitality with all-inclusive meals and comfortable accommodations.''',
        highlights=[
            'World-famous Nurse Shark snorkeling',
            'Professional dive center',
            'All-inclusive guest house stay',
            'Authentic Maldivian hospitality',
            'Vaavu Atoll marine biodiversity',
            'Three professional dives included'
        ],
        activities=[
            'Nurse Shark snorkeling at Vaavu Atoll',
            'Professional diving excursions',
            'Marine life observation',
            'Beach relaxation',
            'Local island exploration',
            'Sunset viewing'
        ]
    )

    # Days 3-5: Maamigili (Alif Dhaal Atoll)
    PackageDestination.objects.create(
        package=package,
        location=maamigili_location,
        duration=3,  # Days 3-5
        description='''Continue your Maldives adventure at Maamigili Island in Alif Dhaal Atoll. Enjoy additional marine life encounters including whale sharks, manta rays, and sea turtles, all while staying in comfortable island accommodations.''',
        highlights=[
            'Whale Shark snorkeling',
            'Manta Ray encounters',
            'Sea Turtle snorkeling',
            'Crystal clear waters',
            'Island-style accommodations',
            'Marine biodiversity hotspot'
        ],
        activities=[
            'Whale Shark snorkeling',
            'Manta Ray encounters',
            'Turtle snorkeling',
            'Beach relaxation',
            'Island exploration',
            'Cultural experiences with locals'
        ]
    )

    # Create package inclusions
    inclusions_data = [
        {'category': 'included', 'item': '5-Day Island Escape Experience', 'description': 'Complete 5-day snorkeling adventure package', 'icon': '🏝️'},
        {'category': 'included', 'item': 'Speedboat Transfers', 'description': 'All transfers between islands and snorkeling sites', 'icon': '🚤'},
        {'category': 'included', 'item': '1 Night at Dhidhoo Guest House', 'description': 'All-inclusive stay at Adh. Dhidhoo Dive Guest House', 'icon': '🏨'},
        {'category': 'included', 'item': '4 Nights Island Accommodation', 'description': 'Comfortable island-style rooms with modern amenities', 'icon': '🏠'},
        {'category': 'included', 'item': 'All Meals Included', 'description': 'Full board meal plan (breakfast, lunch, dinner)', 'icon': '🍽️'},
        {'category': 'included', 'item': '3 Professional Dives', 'description': 'Guided diving experiences with professional instructors', 'icon': '🤿'},
        {'category': 'included', 'item': 'Nurse Shark Snorkeling', 'description': 'Full day Nurse Shark encounter at Vaavu Atoll', 'icon': '🦈'},
        {'category': 'included', 'item': 'Whale Shark Snorkeling', 'description': 'Swim with whale sharks in their natural habitat', 'icon': '🐋'},
        {'category': 'included', 'item': 'Manta Snorkeling', 'description': 'Experience graceful manta rays', 'icon': '🐠'},
        {'category': 'included', 'item': 'Turtle Snorkeling', 'description': 'Swim alongside sea turtles (FREE)', 'icon': '🐢'},
        {'category': 'included', 'item': 'Professional Guides', 'description': 'Experienced local guides for all activities', 'icon': '👨‍🏫'},
        {'category': 'included', 'item': 'Snorkeling Equipment', 'description': 'All snorkeling gear and safety equipment', 'icon': '🤿'},
        {'category': 'included', 'item': 'Safety Briefing', 'description': 'Comprehensive safety and activity briefings', 'icon': '🛡️'},
        {'category': 'excluded', 'item': 'International Flights', 'description': 'Flights to and from Maldives', 'icon': '✈️'},
        {'category': 'excluded', 'item': 'Travel Insurance', 'description': 'Travel and medical insurance', 'icon': '🛡️'},
        {'category': 'excluded', 'item': 'Personal Expenses', 'description': 'Souvenirs, additional meals, tips', 'icon': '💰'},
        {'category': 'excluded', 'item': 'Underwater Camera Rental', 'description': 'Underwater camera and photography service', 'icon': '📷'},
        {'category': 'excluded', 'item': 'Diving Certification', 'description': 'PADI diving certification courses', 'icon': '📜'}
    ]

    for inc_data in inclusions_data:
        PackageInclusion.objects.create(
            package=package,
            **inc_data
        )

    # Create package activities
    activities_data = [
        {
            'name': 'Nurse Shark Snorkeling',
            'description': 'Swim alongside majestic Nurse Sharks at the world-famous Vaavu Atoll. Experience the thrill of encountering these gentle giants in their natural habitat.',
            'duration': 'Full day',
            'category': 'marine_life',
            'difficulty': 'moderate',
            'included': True,
            'price': ''
        },
        {
            'name': 'Professional Diving',
            'description': 'Three incredible dives with professional guides, exploring the underwater world of the Maldives.',
            'duration': 'Full day',
            'category': 'diving',
            'difficulty': 'moderate',
            'included': True,
            'price': ''
        },
        {
            'name': 'Whale Shark Snorkeling',
            'description': 'Swim with the gentle giants of the ocean in their natural habitat. An unforgettable experience with the world\'s largest fish.',
            'duration': '3-4 hours',
            'category': 'marine_life',
            'difficulty': 'moderate',
            'included': True,
            'price': ''
        },
        {
            'name': 'Manta Ray Encounter',
            'description': 'Experience the grace of manta rays as they glide through the crystal-clear waters. A magical underwater ballet.',
            'duration': '2-3 hours',
            'category': 'marine_life',
            'difficulty': 'easy',
            'included': True,
            'price': ''
        },
        {
            'name': 'Turtle Snorkeling',
            'description': 'Swim alongside sea turtles in their natural environment. A peaceful and educational experience.',
            'duration': '2 hours',
            'category': 'marine_life',
            'difficulty': 'easy',
            'included': True,
            'price': 'FREE'
        }
    ]

    for act_data in activities_data:
        PackageActivity.objects.create(
            package=package,
            **act_data
        )

    print(f"✅ Created package: {package.name}")
    print(f"   💰 Original Price: ${package.original_price}")
    print(f"   🎯 Final Price: ${package.price} (Save ${package.original_price - package.price})")
    print(f"   📊 Discount: {package.discount_percentage}%")
    print(f"   🏨 Duration: {package.duration} days")
    print(f"   👥 Group Size: {package.group_size_min}-{package.group_size_max} people")
    print(f"   💵 Pricing: {package.pricing_type}")

    return package

def main():
    """Main function to create the Nurse Shark Island Escape package"""
    print("🦈 Starting Maldives Nurse Shark Island Escape Package Creation Script 🦈")
    print("=" * 70)

    # Create locations and destinations
    dhidhoo_location, maamigili_location, dhidhoo_destination, maamigili_destination = create_location_and_destination()

    # Create experiences
    experiences = create_experiences()

    # Create the Nurse Shark package
    package = create_nurse_shark_package(
        dhidhoo_location, maamigili_location,
        dhidhoo_destination, maamigili_destination,
        experiences
    )

    print("\n" + "=" * 70)
    print("🎉 NURSE SHARK ISLAND ESCAPE PACKAGE CREATION COMPLETE! 🎉")
    print("=" * 70)
    print(f"✅ Created package: {package.name}")
    print(f"   💰 ${package.original_price} → ${package.price} (Save ${package.original_price - package.price} - {package.discount_percentage}% off)")
    print(f"   🏨 {package.duration} days total")
    print(f"   👥 {package.group_size_min}-{package.group_size_max} people")
    print(f"   💵 Pricing: {package.pricing_type}")

    print(f"\n✅ Created {len(experiences)} reusable experiences")
    print(f"✅ Created locations: Dhidhoo, Maamigili")
    print(f"✅ Created destinations: {dhidhoo_destination}, {maamigili_destination}")

    print("\n📋 Package Itinerary:")
    print("   • Day 1: Nurse Shark snorkeling at Vaavu Atoll")
    print("   • Day 2: Dhidhoo stay with 3 professional dives")
    print("   • Day 3: Maamigili - Whale Shark Snorkeling")
    print("   • Day 4: Maamigili - Manta Snorkeling")
    print("   • Day 5: Maamigili - Turtle Snorkeling")

    print("\n📋 Package Summary:")
    print("   • 5-day snorkeling adventure")
    print("   • World-famous Nurse Shark experience")
    print("   • All-inclusive accommodation")
    print("   • Multiple marine life encounters")
    print("   • Professional dive guides")
    print("   • International flights NOT included")

    print("\n🚀 Package is now ready for development!")

if __name__ == '__main__':
    main()
