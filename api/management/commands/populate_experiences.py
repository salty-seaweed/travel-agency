from django.core.management.base import BaseCommand
from django.db import transaction
from api.models import Experience, Location, Destination
import random

class Command(BaseCommand):
    help = 'Populate initial experience data for the Maldives travel agency'

    def handle(self, *args, **options):
        self.stdout.write(self.style.SUCCESS('Starting to populate experiences...'))
        
        # Get or create some locations and destinations first
        locations = Location.objects.all()
        destinations = Destination.objects.all()
        
        if not locations.exists():
            self.stdout.write(self.style.WARNING('No locations found. Please run populate_sample_data first.'))
            return
            
        if not destinations.exists():
            self.stdout.write(self.style.WARNING('No destinations found. Please run populate_destinations first.'))
            return

        experiences_data = [
            {
                'name': 'Sunset Dolphin Cruise',
                'description': 'Experience the magic of the Maldives with a sunset dolphin cruise. Watch these magnificent creatures play in their natural habitat while enjoying breathtaking sunset views.',
                'experience_type': 'sailing',
                'duration': '3 hours',
                'price': '120.00',
                'currency': 'USD',
                'max_participants': 20,
                'min_age': 5,
                'difficulty_level': 'easy',
                'includes': ['Professional guide', 'Refreshments', 'Life jackets', 'Hotel pickup'],
                'excludes': ['Gratuities', 'Personal expenses'],
                'requirements': ['Comfortable clothing', 'Camera', 'Sunscreen'],
                'is_featured': True,
            },
            {
                'name': 'Coral Reef Snorkeling Adventure',
                'description': 'Dive into the crystal-clear waters and explore vibrant coral reefs teeming with marine life. Perfect for beginners and experienced snorkelers alike.',
                'experience_type': 'diving',
                'duration': '4 hours',
                'price': '85.00',
                'currency': 'USD',
                'max_participants': 15,
                'min_age': 8,
                'difficulty_level': 'easy',
                'includes': ['Snorkeling equipment', 'Professional guide', 'Safety briefing', 'Refreshments'],
                'excludes': ['Underwater camera rental', 'Transportation'],
                'requirements': ['Swimming ability', 'Comfortable swimwear'],
                'is_featured': True,
            },
            {
                'name': 'Traditional Maldivian Cooking Class',
                'description': 'Learn to cook authentic Maldivian dishes from local chefs. Discover the secrets of traditional spices and cooking techniques.',
                'experience_type': 'food',
                'duration': '3 hours',
                'price': '75.00',
                'currency': 'USD',
                'max_participants': 12,
                'min_age': 12,
                'difficulty_level': 'easy',
                'includes': ['All ingredients', 'Recipe booklet', 'Apron', 'Meal included'],
                'excludes': ['Transportation', 'Alcoholic beverages'],
                'requirements': ['No cooking experience needed'],
                'is_featured': False,
            },
            {
                'name': 'Island Hopping Adventure',
                'description': 'Visit multiple local islands in one day, experiencing different cultures, beaches, and local life. A perfect way to see the diversity of the Maldives.',
                'experience_type': 'cultural',
                'duration': '8 hours',
                'price': '150.00',
                'currency': 'USD',
                'max_participants': 25,
                'min_age': 6,
                'difficulty_level': 'easy',
                'includes': ['Speedboat transfer', 'Local guide', 'Lunch', 'Beach activities'],
                'excludes': ['Personal expenses', 'Optional activities'],
                'requirements': ['Comfortable walking shoes', 'Swimwear', 'Sunscreen'],
                'is_featured': True,
            },
            {
                'name': 'Deep Sea Fishing Expedition',
                'description': 'Join experienced fishermen for an exciting deep sea fishing adventure. Catch big game fish like tuna, marlin, and sailfish.',
                'experience_type': 'fishing',
                'duration': '6 hours',
                'price': '200.00',
                'currency': 'USD',
                'max_participants': 8,
                'min_age': 16,
                'difficulty_level': 'moderate',
                'includes': ['Fishing equipment', 'Professional captain', 'Refreshments', 'Fish cleaning'],
                'excludes': ['Fishing license', 'Transportation to marina'],
                'requirements': ['No fishing experience needed', 'Motion sickness medication if needed'],
                'is_featured': False,
            },
            {
                'name': 'Underwater Photography Workshop',
                'description': 'Learn underwater photography techniques from professional photographers. Capture stunning images of marine life and coral reefs.',
                'experience_type': 'photography',
                'duration': '5 hours',
                'price': '180.00',
                'currency': 'USD',
                'max_participants': 6,
                'min_age': 14,
                'difficulty_level': 'moderate',
                'includes': ['Underwater camera rental', 'Professional instruction', 'Photo editing session'],
                'excludes': ['Personal camera', 'Transportation'],
                'requirements': ['Basic swimming ability', 'No photography experience needed'],
                'is_featured': False,
            },
            {
                'name': 'Spa & Wellness Retreat',
                'description': 'Indulge in traditional Maldivian spa treatments and wellness therapies. Rejuvenate your body and mind in paradise.',
                'experience_type': 'wellness',
                'duration': '4 hours',
                'price': '250.00',
                'currency': 'USD',
                'max_participants': 10,
                'min_age': 18,
                'difficulty_level': 'easy',
                'includes': ['Spa treatment', 'Wellness consultation', 'Herbal tea', 'Relaxation area access'],
                'excludes': ['Additional treatments', 'Transportation'],
                'requirements': ['Comfortable clothing', 'No health restrictions'],
                'is_featured': True,
            },
            {
                'name': 'Jet Ski Adventure',
                'description': 'Feel the thrill of riding a jet ski across the turquoise waters of the Maldives. Explore hidden lagoons and pristine beaches.',
                'experience_type': 'water_sports',
                'duration': '2 hours',
                'price': '120.00',
                'currency': 'USD',
                'max_participants': 4,
                'min_age': 16,
                'difficulty_level': 'moderate',
                'includes': ['Jet ski rental', 'Safety equipment', 'Briefing', 'Guide'],
                'excludes': ['Fuel', 'Insurance'],
                'requirements': ['Valid ID', 'No previous experience needed'],
                'is_featured': False,
            },
            {
                'name': 'Local Island Cultural Tour',
                'description': 'Immerse yourself in local Maldivian culture with a guided tour of a traditional island. Learn about customs, history, and daily life.',
                'experience_type': 'cultural',
                'duration': '3 hours',
                'price': '60.00',
                'currency': 'USD',
                'max_participants': 20,
                'min_age': 5,
                'difficulty_level': 'easy',
                'includes': ['Local guide', 'Cultural activities', 'Traditional refreshments'],
                'excludes': ['Transportation', 'Personal expenses'],
                'requirements': ['Respectful clothing', 'Comfortable walking shoes'],
                'is_featured': False,
            },
            {
                'name': 'Parasailing Experience',
                'description': 'Soar above the Maldives with a thrilling parasailing adventure. Enjoy breathtaking aerial views of the islands and ocean.',
                'experience_type': 'adventure',
                'duration': '1 hour',
                'price': '90.00',
                'currency': 'USD',
                'max_participants': 2,
                'min_age': 12,
                'difficulty_level': 'easy',
                'includes': ['Parasailing equipment', 'Safety briefing', 'Professional operator'],
                'excludes': ['Transportation', 'Photos'],
                'requirements': ['No experience needed', 'Comfortable clothing'],
                'is_featured': True,
            },
            {
                'name': 'Sunrise Yoga on the Beach',
                'description': 'Start your day with a peaceful yoga session on the beach. Connect with nature while practicing mindfulness and relaxation.',
                'experience_type': 'wellness',
                'duration': '1.5 hours',
                'price': '45.00',
                'currency': 'USD',
                'max_participants': 15,
                'min_age': 12,
                'difficulty_level': 'easy',
                'includes': ['Yoga mat', 'Professional instructor', 'Herbal tea'],
                'excludes': ['Personal yoga equipment', 'Transportation'],
                'requirements': ['Comfortable clothing', 'No yoga experience needed'],
                'is_featured': False,
            },
            {
                'name': 'Night Fishing Experience',
                'description': 'Experience the unique thrill of night fishing in the Maldives. Catch different species that are active after dark.',
                'experience_type': 'fishing',
                'duration': '4 hours',
                'price': '140.00',
                'currency': 'USD',
                'max_participants': 6,
                'min_age': 16,
                'difficulty_level': 'moderate',
                'includes': ['Fishing equipment', 'Professional guide', 'Lighting', 'Refreshments'],
                'excludes': ['Transportation', 'Personal expenses'],
                'requirements': ['No fishing experience needed', 'Warm clothing'],
                'is_featured': False,
            }
        ]

        with transaction.atomic():
            created_count = 0
            for exp_data in experiences_data:
                # Randomly select a location and destination
                location = random.choice(locations)
                destination = random.choice(destinations) if destinations.exists() else None
                
                experience, created = Experience.objects.get_or_create(
                    name=exp_data['name'],
                    defaults={
                        'description': exp_data['description'],
                        'experience_type': exp_data['experience_type'],
                        'duration': exp_data['duration'],
                        'price': exp_data['price'],
                        'currency': exp_data['currency'],
                        'location': location,
                        'destination': destination,
                        'max_participants': exp_data['max_participants'],
                        'min_age': exp_data['min_age'],
                        'difficulty_level': exp_data['difficulty_level'],
                        'includes': exp_data['includes'],
                        'excludes': exp_data['excludes'],
                        'requirements': exp_data['requirements'],
                        'is_featured': exp_data['is_featured'],
                        'is_active': True,
                    }
                )
                
                if created:
                    created_count += 1
                    self.stdout.write(f'Created experience: {experience.name}')

        self.stdout.write(
            self.style.SUCCESS(
                f'Successfully populated {created_count} experiences!'
            )
        )
