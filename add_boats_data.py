"""
Script to add boats, activities, and packages to the database.
Run this script after migrations to populate the boat data.

Usage:
    python add_boats_data.py
"""

import os
import django

# Setup Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'travel_agency.settings')
django.setup()

from api.models import Boat, BoatActivity, BoatPackage, BoatAmenity, Location

def create_amenities():
    """Create boat amenities"""
    print("Creating boat amenities...")
    
    amenities_data = [
        {'name': 'Full Cabin', 'icon': 'home', 'description': 'Spacious cabin with seating'},
        {'name': 'Onboard Toilet', 'icon': 'toilet', 'description': 'Clean onboard toilet facilities'},
        {'name': 'Freshwater Shower', 'icon': 'shower', 'description': 'Freshwater shower available'},
        {'name': 'Premium Sound System', 'icon': 'speaker', 'description': 'Rockford premium sound system'},
        {'name': 'GPS Navigation', 'icon': 'map', 'description': 'Advanced GPS navigation system'},
        {'name': 'Fish Finder', 'icon': 'fish', 'description': 'Professional fish finder equipment'},
        {'name': 'Radar System', 'icon': 'radar', 'description': 'Marine radar for safety'},
        {'name': 'Outriggers', 'icon': 'anchor', 'description': 'Professional fishing outriggers'},
        {'name': 'Live Bait Well', 'icon': 'water', 'description': 'Large live bait well system'},
        {'name': 'Rod Holders', 'icon': 'fishing', 'description': 'Multiple rod holders'},
        {'name': 'Underwater Lights', 'icon': 'light', 'description': 'LED underwater lighting'},
        {'name': 'Search Lights', 'icon': 'flashlight', 'description': 'Powerful search lights'},
        {'name': 'Towels', 'icon': 'towel', 'description': 'Fresh towels provided'},
        {'name': 'Cooler/Ice Box', 'icon': 'cooler', 'description': 'Large cooler for catches and drinks'},
    ]
    
    created_amenities = {}
    for amenity_data in amenities_data:
        amenity, created = BoatAmenity.objects.get_or_create(
            name=amenity_data['name'],
            defaults={
                'icon': amenity_data['icon'],
                'description': amenity_data['description'],
                'is_active': True
            }
        )
        created_amenities[amenity.name] = amenity
        if created:
            print(f"  ✓ Created amenity: {amenity.name}")
        else:
            print(f"  - Amenity already exists: {amenity.name}")
    
    return created_amenities


def create_boats(amenities):
    """Create the two boats"""
    print("\nCreating boats...")
    
    # Get or create location
    location, _ = Location.objects.get_or_create(
        island='Maamigili',
        defaults={
            'atoll': 'Alif Dhaal',
            'latitude': 3.4667,
            'longitude': 72.8333
        }
    )
    
    boats_data = [
        {
            'name': '38ft Premium Sportfishing',
            'description': 'Premium sportfishing vessel powered by triple Mercury 300HP engines for unmatched speed and stability on the open ocean.',
            'detailed_description': '''Step aboard our 38-foot Big Game Fishing Beast — a premium sportfishing vessel powered by triple Mercury 300HP engines for unmatched speed and stability on the open ocean. 

Designed for comfort and performance, the boat features a spacious 9-foot-wide center console layout, freshwater shower, onboard toilet, towels, stereo system, and seating for up to 10 guests with an expert captain and crew. 

Equipped with advanced radar, fish finder, bird finder, outriggers, a 600-liter live bait well, and a massive 1000-liter fuel tank, this vessel is built for serious offshore adventures. All premium fishing gear is included — casting, jigging, trolling rods, and spearguns — ensuring you have everything you need for a world-class fishing experience in the Maldives.''',
            'boat_type': 'sportfishing',
            'length_feet': 38,
            'engine_details': 'Triple Mercury 300HP',
            'cruising_speed_knots': 45,
            'top_speed_knots': 58,
            'passenger_capacity': 10,
            'crew_size': 2,
            'fuel_tank_liters': 1000,
            'live_bait_well_liters': 600,
            'hero_image': 'images/Boats/38 feet boat.jpg',
            'has_cabin': True,
            'has_toilet': True,
            'has_shower': True,
            'has_sound_system': True,
            'has_gps': True,
            'has_fish_finder': True,
            'has_radar': True,
            'has_outriggers': True,
            'departure_location': 'ADh. Maamigili',
            'location': location,
            'featured_highlights': [
                'Triple Mercury 300HP engines',
                'Top speed 58 knots',
                'Full cabin with premium comfort',
                '600L live bait well',
                '1000L fuel tank for long trips',
                'Advanced radar & fish finder',
                'Seats up to 10 guests'
            ],
            'meta_title': '38ft Premium Sportfishing Boat Charter - Maldives',
            'meta_description': 'Experience ultimate big game fishing with our 38ft premium sportfishing boat. Triple 300HP engines, 58 knot top speed, full cabin comfort.',
            'meta_keywords': 'sportfishing maldives, big game fishing, 38ft boat charter, premium fishing boat',
            'is_featured': True,
            'is_active': True,
            'is_available': True,
            'display_order': 1,
            'amenities_list': [
                'Full Cabin', 'Onboard Toilet', 'Freshwater Shower', 'Premium Sound System',
                'GPS Navigation', 'Fish Finder', 'Radar System', 'Outriggers',
                'Live Bait Well', 'Rod Holders', 'Underwater Lights', 'Search Lights',
                'Towels', 'Cooler/Ice Box'
            ]
        },
        {
            'name': '26ft Center Console',
            'description': 'Sport fishing boat powered by twin Mercury 150 SEAPRO engines delivering full speed of 38 miles per hour.',
            'detailed_description': '''Experience unmatched performance on the water with our 26-foot sport fishing boat, powered by twin Mercury 150 SEAPRO engines delivering a full speed of 38 miles per hour. 

Designed for both comfort and capability, this vessel offers a spacious 9.11-inch wide center console layout, a clean onboard toilet, freshwater system, and seating for up to 10 guests with captain and crew. 

Equipped with a live bait well, search lights, cockpit lights, underwater lights, deck lights, and Rockford premium sound system, every trip feels elevated and effortless. Built for serious anglers, the boat includes 10 rod holders, leader attachments, two reliable batteries, and dual bilge pumps—ensuring safety, efficiency, and outstanding performance on every adventure.''',
            'boat_type': 'center_console',
            'length_feet': 26,
            'engine_details': 'Twin Mercury 150 SEAPRO',
            'cruising_speed_knots': 35,
            'top_speed_knots': 38,
            'passenger_capacity': 10,
            'crew_size': 2,
            'hero_image': 'images/Boats/26 feet boat.jpg',
            'fuel_tank_liters': 500,
            'live_bait_well_liters': 300,
            'has_cabin': False,
            'has_toilet': True,
            'has_shower': True,
            'has_sound_system': True,
            'has_gps': True,
            'has_fish_finder': True,
            'has_radar': False,
            'has_outriggers': False,
            'departure_location': 'ADh. Maamigili',
            'location': location,
            'featured_highlights': [
                'Twin Mercury 150 SEAPRO engines',
                'Top speed 38 knots',
                'Spacious center console layout',
                'Live bait well system',
                '10 rod holders',
                'Premium sound system',
                'Seats up to 10 guests'
            ],
            'meta_title': '26ft Center Console Boat Charter - Maldives',
            'meta_description': 'Sport fishing with our 26ft center console boat. Twin 150HP engines, premium equipment, perfect for fishing adventures.',
            'meta_keywords': 'center console maldives, sport fishing, 26ft boat charter, fishing boat maldives',
            'is_featured': True,
            'is_active': True,
            'is_available': True,
            'display_order': 2,
            'amenities_list': [
                'Onboard Toilet', 'Freshwater Shower', 'Premium Sound System',
                'GPS Navigation', 'Fish Finder', 'Live Bait Well', 'Rod Holders',
                'Underwater Lights', 'Search Lights', 'Towels', 'Cooler/Ice Box'
            ]
        }
    ]
    
    created_boats = {}
    for boat_data in boats_data:
        amenities_list = boat_data.pop('amenities_list')
        
        boat, created = Boat.objects.update_or_create(
            name=boat_data['name'],
            defaults=boat_data
        )
        
        # Add amenities
        for amenity_name in amenities_list:
            if amenity_name in amenities:
                boat.amenities.add(amenities[amenity_name])
        
        created_boats[boat.name] = boat
        
        if created:
            print(f"  ✓ Created boat: {boat.name}")
        else:
            print(f"  ✓ Updated boat: {boat.name}")
    
    return created_boats


def create_activities(boats):
    """Create boat activities"""
    print("\nCreating boat activities...")
    
    activities_data = [
        {
            'name': 'Big Game Fishing',
            'description': 'Experience the thrill of big game fishing in the Maldives. Target Yellowfin Tuna, Sailfish, Wahoo, and more.',
            'detailed_description': '''Embark on the ultimate big game fishing adventure in the pristine waters of the Maldives. Our expert crew will take you to the best fishing grounds where you can target some of the ocean's most prized game fish.

The Maldives is famous for its rich marine life and world-class offshore fishing. Yellowfin Tuna frequently exceed 50 kg (110 lbs) and are known for their explosive speed and unstoppable fight.

Our experienced Maldivian crew knows the reefs, currents, and deep-sea hotspots like no one else. Their expertise gives you the best chance at landing trophy tuna, sailfish, marlin, and more.''',
            'activity_type': 'fishing',
            'duration_hours': 8,
            'duration_description': 'Full day (8 hours)',
            'min_participants': 1,
            'max_participants': 10,
            'difficulty_level': 'moderate',
            'hero_image': 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800',
            'includes': [
                'Expert Maldivian captain and crew',
                'All premium fishing gear',
                'Live bait well',
                'Casting, jigging, and trolling equipment',
                'Safety equipment',
                'Fishing licenses'
            ],
            'excludes': [
                'Meals (available in Gold package)',
                'Personal items',
                'Tips for crew (optional)'
            ],
            'requirements': [
                'Minimum 48 hours advance booking',
                'Basic physical fitness',
                'Sun protection recommended'
            ],
            'target_species': [
                'Yellowfin Tuna',
                'Sailfish',
                'Wahoo',
                'Mahi-Mahi',
                'Dogtooth Tuna',
                'Barracuda',
                'Marlin'
            ],
            'featured_highlights': [
                'Target Yellowfin Tuna over 50kg',
                'Expert local crew',
                'World-class fishing grounds',
                'Premium fishing equipment'
            ],
            'meta_title': 'Big Game Fishing Maldives - Yellowfin Tuna, Sailfish, Wahoo',
            'meta_description': 'Experience world-class big game fishing in the Maldives. Target Yellowfin Tuna, Sailfish, Wahoo with expert crew.',
            'is_featured': True,
            'is_active': True,
            'display_order': 1,
            'suitable_boats': list(boats.values())
        },
        {
            'name': 'Trolling',
            'description': 'Glide over deep Maldivian waters as vibrant lures tempt the ocean\'s most powerful hunters.',
            'detailed_description': '''Chase the ocean's fastest predators with trolling - one of the most thrilling fishing techniques. Glide over deep Maldivian waters as vibrant lures streak behind the boat, tempting powerful hunters like tuna, mahi-mahi, wahoo, sailfish, and marlin.

With expert navigation through prime channels, current lines, and offshore hotspots, our experienced crew positions you exactly where the action happens. Every run, every strike, every moment is designed to give you the best possible chance at landing a trophy fish.

Perfect for thrill-seekers and big game enthusiasts ready for a heart-pounding fishing experience.''',
            'hero_image': 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800',
            'activity_type': 'fishing',
            'duration_hours': 8,
            'duration_description': 'Full day (8 hours)',
            'min_participants': 1,
            'max_participants': 10,
            'difficulty_level': 'easy',
            'includes': [
                'Trolling lures and equipment',
                'Expert crew guidance',
                'All fishing gear',
                'Safety equipment'
            ],
            'excludes': ['Meals', 'Personal items'],
            'requirements': ['48 hours advance booking'],
            'target_species': ['Tuna', 'Mahi-Mahi', 'Wahoo', 'Sailfish', 'Marlin'],
            'featured_highlights': [
                'Fast-paced action',
                'Multiple species',
                'Expert navigation',
                'Prime fishing grounds'
            ],
            'is_featured': False,
            'is_active': True,
            'display_order': 2,
            'suitable_boats': list(boats.values())
        },
        {
            'name': 'Casting & Popping',
            'description': 'Experience explosive topwater action as powerful predators strike your lure.',
            'detailed_description': '''Experience the pure adrenaline of surface strikes as powerful predators explode onto your lure. Casting and popping put you right in the heart of the action — a hands-on, technique-driven style perfect for anglers who crave intensity and skill.

Skim lures across pristine coral reefs, shallow lagoons, and reef edges, targeting some of the Maldives' most aggressive species: Giant Trevally (GT), Bluefin Trevally, Reef Snappers, and other hard-hitting topwater predators.

Every cast carries the potential for a violent, heart-stopping strike. Every hookup is a test of strength, precision, and endurance.

Our expert crew guides you to the prime reef zones and bait-rich waters, ensuring maximum action and unforgettable battles.''',
            'hero_image': 'https://images.unsplash.com/photo-1503756234508-e32369269deb?w=800',
            'activity_type': 'fishing',
            'duration_hours': 6,
            'duration_description': 'Half to full day (6-8 hours)',
            'min_participants': 1,
            'max_participants': 10,
            'difficulty_level': 'challenging',
            'includes': [
                'Casting and popping equipment',
                'Expert crew guidance',
                'Access to prime reef zones',
                'Safety equipment'
            ],
            'excludes': ['Meals', 'Personal items'],
            'requirements': [
                '48 hours advance booking',
                'Good physical fitness required',
                'Previous fishing experience recommended'
            ],
            'target_species': [
                'Giant Trevally (GT)',
                'Bluefin Trevally',
                'Reef Snappers',
                'Barracuda'
            ],
            'featured_highlights': [
                'Explosive topwater action',
                'Target Giant Trevally',
                'Technique-driven fishing',
                'Prime reef zones'
            ],
            'is_featured': True,
            'is_active': True,
            'display_order': 3,
            'suitable_boats': list(boats.values())
        },
        {
            'name': 'Jigging',
            'description': 'Deep power fishing targeting Dogtooth Tuna, Amberjacks, and Groupers.',
            'detailed_description': '''Drop heavy metal jigs into the deep blue and feel the instant surge of power from below. Jigging is one of the most intense and physically demanding fishing styles — designed for anglers who want pure strength, fast strikes, and nonstop action.

This vertical technique targets some of the ocean's hardest-fighting predators: Dogtooth Tuna, Amberjacks, Groupers, and other powerful deep-water species.

Every drop is a workout. Every hook-up is a battle. Every fight is unforgettable.

Our experienced crew positions you over deep reefs, drop-offs, and underwater pinnacles, giving you the best chance to connect with trophy-sized monsters hidden in the depths.''',
            'hero_image': 'https://images.unsplash.com/photo-1534043464124-3be32fe000c9?w=800',
            'activity_type': 'fishing',
            'duration_hours': 6,
            'duration_description': 'Half to full day (6-8 hours)',
            'min_participants': 1,
            'max_participants': 10,
            'difficulty_level': 'challenging',
            'includes': [
                'Heavy jigging equipment',
                'Expert crew positioning',
                'Access to deep reefs',
                'Safety equipment'
            ],
            'excludes': ['Meals', 'Personal items'],
            'requirements': [
                '48 hours advance booking',
                'Excellent physical fitness required',
                'Previous fishing experience recommended'
            ],
            'target_species': [
                'Dogtooth Tuna',
                'Amberjacks',
                'Groupers',
                'Deep-water species'
            ],
            'featured_highlights': [
                'Intense physical challenge',
                'Deep-water monsters',
                'Trophy-sized catches',
                'Expert crew positioning'
            ],
            'is_featured': False,
            'is_active': True,
            'display_order': 4,
            'suitable_boats': list(boats.values())
        },
        {
            'name': 'Island Hopping',
            'description': 'Explore remote atolls and pristine islands in the Maldives.',
            'detailed_description': '''Discover the beauty of the Maldives with our island hopping excursions. Visit remote atolls, pristine beaches, and local islands. Experience the authentic Maldivian culture and breathtaking natural beauty.

Your journey, your way. Crafted just for you. Whether you want to discover remote atolls, hop between pristine islands, or explore the Maldives' crystal-clear underwater world — we design fully customized trips tailored to your exact desires.

You dream it. We create it. A truly personalized Maldives adventure.''',
            'activity_type': 'island_hopping',
            'duration_hours': 4,
            'duration_description': 'Half day to full day (4-8 hours)',
            'min_participants': 2,
            'max_participants': 10,
            'difficulty_level': 'easy',
            'includes': [
                'Island visits',
                'Snorkeling equipment',
                'Refreshments',
                'Expert local guide',
                'Safety equipment'
            ],
            'excludes': ['Meals', 'Island entrance fees (if any)', 'Personal items'],
            'requirements': ['48 hours advance booking', 'Swimming ability for snorkeling'],
            'target_species': [],
            'featured_highlights': [
                'Visit pristine islands',
                'Snorkeling opportunities',
                'Local culture experience',
                'Customizable itinerary'
            ],
            'is_featured': False,
            'is_active': True,
            'display_order': 5,
            'suitable_boats': list(boats.values())
        },
        {
            'name': 'Whale Shark & Manta Ray Watch',
            'description': 'Swim with whale sharks and glide with manta rays in their natural habitat.',
            'detailed_description': '''Dive into magical encounters with the Maldives' most iconic sea creatures. Experience the thrill of swimming alongside gentle whale sharks and graceful manta rays in their natural habitat.

The Maldives is one of the best places in the world to encounter these magnificent creatures. Our expert crew knows the best spots and times to find them, ensuring you have the best chance for an unforgettable encounter.

Perfect for photography lovers, ocean explorers, and anyone seeking a once-in-a-lifetime thrill. Also includes opportunities to snorkel with turtles and meet friendly nurse sharks.''',
            'activity_type': 'wildlife_watching',
            'duration_hours': 4,
            'duration_description': 'Half day (4 hours)',
            'min_participants': 2,
            'max_participants': 10,
            'difficulty_level': 'easy',
            'includes': [
                'Snorkeling equipment',
                'Expert wildlife guide',
                'Refreshments',
                'Safety equipment',
                'Underwater photography tips'
            ],
            'excludes': ['Underwater camera rental', 'Meals', 'Personal items'],
            'requirements': [
                '48 hours advance booking',
                'Swimming ability required',
                'Respect for marine life mandatory'
            ],
            'target_species': [
                'Whale Sharks',
                'Manta Rays',
                'Sea Turtles',
                'Nurse Sharks'
            ],
            'featured_highlights': [
                'Swim with whale sharks',
                'Glide with manta rays',
                'Snorkel with turtles',
                'Expert wildlife guides'
            ],
            'is_featured': True,
            'is_active': True,
            'display_order': 6,
            'suitable_boats': list(boats.values())
        }
    ]
    
    created_activities = {}
    for activity_data in activities_data:
        suitable_boats = activity_data.pop('suitable_boats')
        
        activity, created = BoatActivity.objects.update_or_create(
            name=activity_data['name'],
            defaults=activity_data
        )
        
        # Add suitable boats
        for boat in suitable_boats:
            activity.suitable_boats.add(boat)
        
        created_activities[activity.name] = activity
        
        if created:
            print(f"  ✓ Created activity: {activity.name}")
        else:
            print(f"  ✓ Updated activity: {activity.name}")
    
    return created_activities


def create_packages(boats, activities):
    """Create boat packages"""
    print("\nCreating boat packages...")
    
    # Get the boats
    boat_38ft = boats['38ft Premium Sportfishing']
    boat_26ft = boats['26ft Center Console']
    
    # Get main activities
    big_game_fishing = activities.get('Big Game Fishing')
    trolling = activities.get('Trolling')
    casting = activities.get('Casting & Popping')
    
    packages_data = [
        {
            'name': 'Silver Package - 38ft Premium',
            'description': 'Affordable & essential full-day charter with all the basics for an amazing fishing experience.',
            'detailed_description': '''Our Silver Package provides everything you need for an incredible day of big game fishing. This affordable option includes all essential equipment and services for a memorable adventure on our premium 38ft sportfishing boat.

Perfect for anglers who want to experience world-class fishing without the extra frills. You'll have access to our expert crew, premium fishing gear, and the best fishing grounds in the Maldives.''',
            'hero_image': 'images/Boats/38 feet boat.jpg',
            'boat': boat_38ft,
            'package_tier': 'silver',
            'price': '2799.00',
            'currency': 'USD',
            'pricing_notes': 'The more days you book, the cheaper the price. Contact us for multi-day discounts.',
            'duration_hours': 8,
            'duration_description': 'Full-day charter (8 hours)',
            'includes': [
                'Full-day charter (8 hours)',
                'Seasonal fresh fruits',
                'Soft drinks & water',
                'Captain & crew',
                'All fishing gear',
                'Live bait well',
                'Towels'
            ],
            'max_participants': 10,
            'booking_notice_hours': 48,
            'booking_notice_description': '48 hours advance booking required',
            'special_offers': ['Year-End Celebration Offer – 20% OFF'],
            'discount_percentage': 20,
            'featured_highlights': [
                'Full-day charter',
                'Expert crew',
                'Premium fishing gear',
                'Live bait included',
                'Refreshments provided'
            ],
            'meta_title': 'Silver Package - 38ft Sportfishing Charter Maldives',
            'meta_description': 'Affordable full-day fishing charter on our 38ft premium sportfishing boat. $2,799 includes crew, gear, and refreshments.',
            'is_featured': True,
            'is_active': True,
            'is_available': True,
            'display_order': 1,
            'activities': [big_game_fishing, trolling, casting] if all([big_game_fishing, trolling, casting]) else []
        },
        {
            'name': 'Gold Package - 38ft Premium',
            'description': 'Best value + premium experience. Full luxury big game charter with all-inclusive amenities.',
            'detailed_description': '''Our Gold Package is the ultimate all-inclusive big game fishing experience. Everything from Silver Package PLUS meals, snorkeling equipment, GoPro video, and our exclusive "From Ocean to Plate" service where we cook your catch exactly how YOU want it.

This is our most popular package, offering the best value and the most comprehensive experience. Perfect for those who want to make the most of their fishing adventure with enhanced services and personalized guidance.

Grilled, fried, curry — your choice. Your flavor. Your moment.''',
            'hero_image': 'images/Boats/38 feet boat.jpg',
            'boat': boat_38ft,
            'package_tier': 'gold',
            'price': '2999.00',
            'currency': 'USD',
            'pricing_notes': 'The more days you book, the cheaper the price. Contact us for multi-day discounts.',
            'duration_hours': 8,
            'duration_description': 'Full-day charter (8 hours)',
            'includes': [
                'Everything in Silver Package',
                'Full-day charter (8 hours)',
                'Seasonal fresh fruits',
                'Meal for 2 persons',
                'Snorkeling equipment',
                'All fishing gear',
                'Phone/GoPro video',
                'Enhanced service experience',
                'Itinerary assistance',
                'Personalized guidance for fishing techniques',
                'From Ocean to Plate — Your Catch, Your Style',
                'We cook your fish exactly how YOU want it'
            ],
            'max_participants': 10,
            'booking_notice_hours': 48,
            'booking_notice_description': '48 hours advance booking required',
            'special_offers': ['Year-End Celebration Offer – 20% OFF', 'Add-On Meals – Save 30%'],
            'discount_percentage': 20,
            'featured_highlights': [
                'All-inclusive experience',
                'Meals included',
                'GoPro video included',
                'Cook your catch service',
                'Personalized guidance',
                'Best value package'
            ],
            'meta_title': 'Gold Package - Premium All-Inclusive Fishing Charter Maldives',
            'meta_description': 'Ultimate luxury fishing experience on 38ft boat. $2,999 includes meals, GoPro video, and cook your catch service.',
            'is_featured': True,
            'is_active': True,
            'is_available': True,
            'display_order': 2,
            'activities': [big_game_fishing, trolling, casting] if all([big_game_fishing, trolling, casting]) else []
        },
        {
            'name': 'Silver Package - 26ft Center Console',
            'description': 'Affordable & essential full-day charter on our versatile center console boat.',
            'detailed_description': '''Experience excellent sport fishing on our 26ft center console boat. This Silver Package provides all the essentials for a great day on the water at an affordable price point.

Perfect for smaller groups or those who prefer the agility and speed of a center console boat. You'll still have access to expert crew, quality fishing gear, and the best fishing spots.''',
            'hero_image': 'images/Boats/26 feet boat.jpg',
            'boat': boat_26ft,
            'package_tier': 'silver',
            'price': '1950.00',
            'currency': 'USD',
            'pricing_notes': 'The more days you book, the cheaper the price. Contact us for multi-day discounts.',
            'duration_hours': 8,
            'duration_description': 'Full-day charter (8 hours)',
            'includes': [
                'Full-day charter (8 hours)',
                'Seasonal fresh fruits',
                'Soft drinks & water',
                'Captain & crew',
                'All fishing gear',
                'Live bait well',
                'Towels'
            ],
            'max_participants': 10,
            'booking_notice_hours': 48,
            'booking_notice_description': '48 hours advance booking required',
            'special_offers': ['Year-End Celebration Offer – 20% OFF'],
            'discount_percentage': 20,
            'featured_highlights': [
                'Full-day charter',
                'Expert crew',
                'Quality fishing gear',
                'Live bait included',
                'Refreshments provided'
            ],
            'meta_title': 'Silver Package - 26ft Center Console Fishing Charter Maldives',
            'meta_description': 'Affordable sport fishing on our 26ft center console boat. $1,950 includes crew, gear, and refreshments.',
            'is_featured': False,
            'is_active': True,
            'is_available': True,
            'display_order': 3,
            'activities': [big_game_fishing, trolling] if all([big_game_fishing, trolling]) else []
        },
        {
            'name': 'Gold Package - 26ft Center Console',
            'description': 'Best value + premium experience on our agile center console boat.',
            'detailed_description': '''Our Gold Package on the 26ft center console offers the perfect blend of value and premium service. Everything from Silver PLUS meals, snorkeling equipment, GoPro video, and our exclusive "Fresh From the Sea, Crafted for Your Plate" service.

Tell us how you want it — we make it delicious. This package is ideal for those who want enhanced services and the flexibility of our center console boat.''',
            'hero_image': 'images/Boats/26 feet boat.jpg',
            'boat': boat_26ft,
            'package_tier': 'gold',
            'price': '2250.00',
            'currency': 'USD',
            'pricing_notes': 'The more days you book, the cheaper the price. Contact us for multi-day discounts.',
            'duration_hours': 8,
            'duration_description': 'Full-day charter (8 hours)',
            'includes': [
                'Everything in Silver Package',
                'Full-day charter (8 hours)',
                'Seasonal fresh fruits',
                'Meal for 2 persons',
                'Snorkeling equipment',
                'All fishing gear',
                'Phone/GoPro video',
                'Enhanced service experience',
                'Itinerary assistance',
                'Personalized guidance for fishing techniques',
                'Fresh From the Sea, Crafted for Your Plate',
                'Tell us how you want it — we make it delicious'
            ],
            'max_participants': 10,
            'booking_notice_hours': 48,
            'booking_notice_description': '48 hours advance booking required',
            'special_offers': ['Year-End Celebration Offer – 20% OFF', 'Add-On Meals – Save 30%'],
            'discount_percentage': 20,
            'featured_highlights': [
                'All-inclusive experience',
                'Meals included',
                'GoPro video included',
                'Cook your catch service',
                'Personalized guidance',
                'Great value'
            ],
            'meta_title': 'Gold Package - Premium 26ft Center Console Charter Maldives',
            'meta_description': 'Premium sport fishing on 26ft boat. $2,250 includes meals, GoPro video, and cook your catch service.',
            'is_featured': False,
            'is_active': True,
            'is_available': True,
            'display_order': 4,
            'activities': [big_game_fishing, trolling] if all([big_game_fishing, trolling]) else []
        }
    ]
    
    for package_data in packages_data:
        activities_list = package_data.pop('activities')
        
        package, created = BoatPackage.objects.update_or_create(
            name=package_data['name'],
            defaults=package_data
        )
        
        # Add activities
        for activity in activities_list:
            if activity:
                package.activities_included.add(activity)
        
        if created:
            print(f"  ✓ Created package: {package.name} - ${package.price}")
        else:
            print(f"  ✓ Updated package: {package.name}")


def main():
    """Main function to run all data creation"""
    print("=" * 60)
    print("BOAT DATA CREATION SCRIPT")
    print("=" * 60)
    print()
    
    try:
        # Step 1: Create amenities
        amenities = create_amenities()
        
        # Step 2: Create boats
        boats = create_boats(amenities)
        
        # Step 3: Create activities
        activities = create_activities(boats)
        
        # Step 4: Create packages
        create_packages(boats, activities)
        
        print()
        print("=" * 60)
        print("✅ BOAT DATA CREATION COMPLETED SUCCESSFULLY!")
        print("=" * 60)
        print()
        print("Summary:")
        print(f"  • Amenities: {len(amenities)}")
        print(f"  • Boats: {len(boats)}")
        print(f"  • Activities: {len(activities)}")
        print(f"  • Packages: 4 (2 Silver, 2 Gold)")
        print()
        print("Next steps:")
        print("  1. Upload boat images via Django admin")
        print("  2. Upload activity images via Django admin")
        print("  3. Upload package images via Django admin")
        print("  4. Visit /boats to see your boats page")
        print("  5. Check homepage for boat sections")
        print()
        
    except Exception as e:
        print()
        print("=" * 60)
        print("❌ ERROR OCCURRED")
        print("=" * 60)
        print(f"Error: {str(e)}")
        print()
        import traceback
        traceback.print_exc()
        print()


if __name__ == '__main__':
    main()

