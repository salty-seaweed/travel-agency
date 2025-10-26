#!/usr/bin/env python3
"""
Script to add Maldives Big Game Fishing & Adventure Package to the development database.
This script creates a comprehensive 5-night adventure package with big game fishing and marine life encounters.
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
            'description': "A beautiful island in Alif Dhaal Atoll, perfect for adventure getaways with pristine beaches, crystal-clear waters, and world-class fishing opportunities.",
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
            'name': 'Big Game Fishing',
            'description': 'Experience the thrill of fishing for the ocean\'s giants with professional equipment and expert crew. Target marlin, tuna, and other big game fish.',
            'experience_type': 'fishing',
            'duration': '4-5 hours',
            'price': Decimal('300.00'),
            'difficulty_level': 'moderate',
            'includes': ['All fishing gear', 'Professional Captain & crew', 'Refreshments', 'Safety equipment'],
            'excludes': ['Transportation to fishing site', 'Fish processing'],
            'requirements': ['Basic fishing knowledge helpful', 'Comfortable with boat travel']
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

def create_big_game_fishing_package(location, destination, experiences):
    """Create the Big Game Fishing & Adventure Package"""
    print(f"\nCreating package: Maldives Big Game Fishing & Adventure Package")
    
    # Calculate pricing with discount
    original_price = Decimal('2599.00')  # Original price
    final_price = Decimal('2199.00')     # Final price
    discount_percentage = ((original_price - final_price) / original_price) * 100
    
    # Create the main package
    package = Package.objects.create(
        name='Maldives Big Game Fishing & Adventure Package',
        description='Early Morning Big Game Fishing (4 hrs + 1 hr FREE!) with full Maldives holiday inclusions. Perfect for anglers and adventurers.',
        detailed_description='''Experience the ultimate Maldives adventure with our comprehensive 5-night Big Game Fishing package. This isn't just a fishing trip – it's a complete Maldivian holiday that combines world-class angling with unforgettable marine life encounters.

What makes this package special is the perfect blend of adrenaline-pumping fishing and authentic Maldivian island experiences. You'll stay in comfortable island-style accommodations and enjoy full board meals while exploring the incredible underwater world of the Maldives.

The fishing experience is conducted on our professional Mercury 150 Twin Engine boat, equipped with all necessary gear including casting rods, jigging rods, trolling rods, and spear guns. Our experienced Captain and crew will guide you through the best fishing spots while ensuring your safety and comfort.

Beyond fishing, you'll have the opportunity to swim with whale sharks, encounter graceful manta rays, and snorkel alongside sea turtles. These marine life encounters are included in your package, making this a truly comprehensive Maldivian experience.

This package is perfect for couples, families, and adventure seekers who want to experience the best of what the Maldives has to offer – from world-class fishing to pristine beaches and incredible marine life.''',
        price=final_price,
        original_price=original_price,
        discount_percentage=discount_percentage,
        duration=5,  # 5 nights
        category='adventure',
        difficulty_level='moderate',
        highlights='Big Game Fishing, Whale Shark Snorkeling, Manta Ray Encounters, Turtle Snorkeling, Full Board Meals, Speedboat Transfers',
        pricing_type='per_room',
        group_size_min=2,  # 2 people per room
        group_size_max=8,  # 4 groups of 2 = 8 people total
        group_size_recommended=2,  # Couples
        accommodation_type='island_guesthouse',
        room_type='island_style_room',
        meal_plan='full_board',
        transportation_details='''International Arrival:
Fly into Velana International Airport (Malé - MLE), the main international gateway to the Maldives.

Domestic Transfer:
Enjoy a scenic speedboat journey from Malé to Maamigili Island, taking approximately 45-60 minutes through the crystal-clear waters of the Indian Ocean. Experience the beauty of the Maldivian atolls as you cruise past pristine islands and coral reefs.

Airport Meet & Greet:
Our team will warmly welcome you upon arrival in Malé and assist with your domestic transfer check-in.

Maamigili Arrival:
Upon arriving in Maamigili, you'll be greeted by our local hosts and transferred directly to your accommodation in a comfortable private vehicle.

Fishing Activity Transportation:
Daily transfers to fishing sites via our Mercury 150 Twin Engine boat with professional crew.''',
        airport_transfers=True,
        best_time_to_visit='Year-round, best fishing from November to April',
        weather_info='Tropical climate with warm temperatures year-round. Fishing conditions are optimal during the dry season (November to April) with calm seas and clear visibility.',
        what_to_bring=[
            'Fishing gear (optional - all provided)',
            'Swimwear and beachwear',
            'Sunscreen (reef-safe)',
            'Underwater camera',
            'Light clothing',
            'Comfortable sandals',
            'Personal toiletries',
            'Motion sickness medication (if needed)'
        ],
        important_notes=[
            'International flights not included',
            'Valid passport required',
            'Travel insurance recommended',
            'Check-in: 2:00 PM, Check-out: 11:00 AM',
            'Fishing license included',
            'Catch and release policy applies',
            'Weather-dependent activities'
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
        duration=5,  # 5 nights
        description='''Stay at a comfortable island guesthouse in Maamigili, Alif Dhaal Atoll. Experience authentic Maldivian hospitality in island-style rooms with modern amenities and stunning ocean views. Perfect base for your fishing adventure and marine life encounters.''',
        highlights=[
            'Island-style rooms with ocean views',
            'Private beach access',
            'Authentic Maldivian hospitality',
            'Modern amenities and comfort',
            'Local island atmosphere',
            'Crystal clear waters for swimming',
            'Close to fishing sites',
            'Marine life encounter locations'
        ],
        activities=[
            'Big game fishing expeditions',
            'Whale shark snorkeling',
            'Manta ray encounters',
            'Turtle snorkeling',
            'Beach relaxation',
            'Local island exploration',
            'Cultural experiences with locals',
            'Sunset viewing from private beach'
        ]
    )
    
    # Create package inclusions
    inclusions_data = [
        {'category': 'included', 'item': '5 Nights Accommodation', 'description': '5 nights in island-style room with ocean views', 'icon': '🏨'},
        {'category': 'included', 'item': 'All Meals', 'description': 'Full board meal plan (breakfast, lunch, dinner)', 'icon': '🍽️'},
        {'category': 'included', 'item': 'Airport Pickup & Transfer', 'description': 'Meet & greet at airport + speedboat transfers to Maamigili', 'icon': '🚤'},
        {'category': 'included', 'item': 'Big Game Fishing', 'description': '4+1 hours fishing with all equipment and professional crew', 'icon': '🎣'},
        {'category': 'included', 'item': 'Whale Shark Snorkeling', 'description': 'Swim with gentle giants of the ocean', 'icon': '🐋'},
        {'category': 'included', 'item': 'Manta Snorkeling', 'description': 'FREE manta ray encounters', 'icon': '🐠'},
        {'category': 'included', 'item': 'Turtle Snorkeling', 'description': 'Swim alongside sea turtles', 'icon': '🐢'},
        {'category': 'included', 'item': 'All Fishing Equipment', 'description': 'Casting rods, jigging rods, trolling rods, spear guns', 'icon': '🎣'},
        {'category': 'included', 'item': 'Professional Crew', 'description': 'Experienced Captain and crew for all activities', 'icon': '👨‍✈️'},
        {'category': 'included', 'item': 'Boat Refreshments', 'description': 'Water, soft drinks, sandwiches, fruits & snacks', 'icon': '🥤'},
        {'category': 'included', 'item': 'Snorkeling Equipment', 'description': 'All snorkeling gear and safety equipment', 'icon': '🤿'},
        {'category': 'included', 'item': 'Private Beach Access', 'description': 'Access to private beach area', 'icon': '🏖️'},
        {'category': 'excluded', 'item': 'International Flights', 'description': 'Flights to and from Maldives', 'icon': '✈️'},
        {'category': 'excluded', 'item': 'Travel Insurance', 'description': 'Travel and medical insurance', 'icon': '🛡️'},
        {'category': 'excluded', 'item': 'Personal Expenses', 'description': 'Souvenirs, additional meals, tips', 'icon': '💰'},
        {'category': 'excluded', 'item': 'Alcoholic Beverages', 'description': 'Alcoholic drinks and beverages', 'icon': '🍷'},
        {'category': 'excluded', 'item': 'Fish Processing', 'description': 'Processing and shipping of caught fish', 'icon': '🐟'},
        {'category': 'excluded', 'item': 'Underwater Camera Rental', 'description': 'Underwater camera and photography service', 'icon': '📷'}
    ]
    
    for inc_data in inclusions_data:
        PackageInclusion.objects.create(
            package=package,
            **inc_data
        )
    
    # Create package activities
    activities_data = [
        {
            'name': 'Big Game Fishing',
            'description': 'Experience the thrill of fishing for the ocean\'s giants with professional equipment and expert crew. Target marlin, tuna, and other big game fish in the deep waters of the Indian Ocean.',
            'duration': '4+1 hours (extra hour free)',
            'category': 'fishing',
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
            'price': 'FREE'
        },
        {
            'name': 'Turtle Snorkeling',
            'description': 'Swim alongside sea turtles in their natural environment. A peaceful and educational experience.',
            'duration': '2 hours',
            'category': 'marine_life',
            'difficulty': 'easy',
            'included': True,
            'price': ''
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
    print(f"   📊 Discount: {package.discount_percentage:.2f}%")
    print(f"   🏨 Duration: {package.duration} nights")
    print(f"   👥 Group Size: {package.group_size_min}-{package.group_size_max} people")
    print(f"   💵 Pricing: {package.pricing_type}")
    
    return package

def main():
    """Main function to create the Big Game Fishing package"""
    print("🎣 Starting Maldives Big Game Fishing Package Creation Script 🎣")
    print("=" * 70)
    
    # Create location and destination
    location, destination = create_location_and_destination()
    
    # Create experiences
    experiences = create_experiences()
    
    # Create the Big Game Fishing package
    package = create_big_game_fishing_package(location, destination, experiences)
    
    print("\n" + "=" * 70)
    print("🎉 BIG GAME FISHING PACKAGE CREATION COMPLETE! 🎉")
    print("=" * 70)
    print(f"✅ Created package: {package.name}")
    print(f"   💰 ${package.original_price} → ${package.price} (Save ${package.original_price - package.price} - {package.discount_percentage:.2f}% off)")
    print(f"   🏨 {package.duration} nights accommodation")
    print(f"   👥 {package.group_size_min}-{package.group_size_max} people per room")
    print(f"   💵 Pricing: {package.pricing_type}")
    
    print(f"\n✅ Created {len(experiences)} reusable experiences")
    print(f"✅ Created location: {location}")
    print(f"✅ Created destination: {destination}")
    
    print("\n📋 Package Summary:")
    print("   • 5 nights accommodation in island-style rooms")
    print("   • Full board meals included")
    print("   • Big game fishing (4+1 hours) with professional crew")
    print("   • Whale shark, manta ray, and turtle snorkeling")
    print("   • Speedboat transfers included")
    print("   • All fishing equipment provided")
    print("   • International flights NOT included")
    
    print("\n🚀 Package is now ready for development!")

if __name__ == '__main__':
    main()
