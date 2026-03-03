"""
Populate sample Maldives honeymoon packages with destinations, activities, and inclusions.
Run with: python manage.py populate_packages
"""

from decimal import Decimal

from django.core.management.base import BaseCommand

from api.models import (
    Destination,
    Experience,
    Location,
    Package,
    PackageActivity,
    PackageDestination,
    PackageInclusion,
)


class Command(BaseCommand):
    help = "Populate sample Maldives honeymoon packages with destinations, activities, inclusions"

    def add_arguments(self, parser):
        parser.add_argument(
            "--skip-existing",
            action="store_true",
            help="Skip packages that already exist (by name)",
        )

    def handle(self, *args, **options):
        skip_existing = options.get("skip_existing", False)

        self.stdout.write("Creating location and destination...")
        location, _ = Location.objects.get_or_create(
            island="Maamigili",
            atoll="Alif Dhaal",
            defaults={"latitude": 3.4833, "longitude": 72.9167},
        )

        Destination.objects.get_or_create(
            island="Maamigili",
            atoll="Alif Dhaal",
            defaults={
                "name": "Maamigili Island",
                "description": "A beautiful island in Alif Dhaal Atoll, perfect for honeymoon getaways.",
                "latitude": 3.4833,
                "longitude": 72.9167,
                "is_featured": True,
                "is_active": True,
            },
        )

        self.stdout.write("Creating experiences...")
        experiences_data = [
            {"name": "Whale Shark Snorkeling", "experience_type": "diving", "duration": "3-4 hours", "price": Decimal("120.00"), "difficulty_level": "moderate"},
            {"name": "Manta Ray Encounter", "experience_type": "diving", "duration": "2-3 hours", "price": Decimal("100.00"), "difficulty_level": "easy"},
            {"name": "Turtle Snorkeling", "experience_type": "diving", "duration": "2 hours", "price": Decimal("80.00"), "difficulty_level": "easy"},
            {"name": "Sunset Cruise", "experience_type": "sailing", "duration": "2 hours", "price": Decimal("150.00"), "difficulty_level": "easy"},
            {"name": "Private Island Picnic", "experience_type": "adventure", "duration": "4-5 hours", "price": Decimal("200.00"), "difficulty_level": "easy"},
            {"name": "Dolphin Watching", "experience_type": "sailing", "duration": "2-3 hours", "price": Decimal("90.00"), "difficulty_level": "easy"},
            {"name": "Sandbank Excursion", "experience_type": "adventure", "duration": "3-4 hours", "price": Decimal("110.00"), "difficulty_level": "easy"},
        ]
        for exp in experiences_data:
            Experience.objects.get_or_create(
                name=exp["name"],
                defaults={
                    "description": f"Experience: {exp['name']}",
                    **{k: v for k, v in exp.items() if k != "name"},
                    "includes": [],
                    "excludes": [],
                    "requirements": [],
                },
            )

        transport_text = (
            "International: Fly into Velana International Airport (MLE). "
            "Domestic: Speedboat from Male to Maamigili (45-60 min). "
            "Airport meet & greet included."
        )

        packages_data = [
            {
                "name": "4 Nights – Island Escape",
                "description": "4 nights with Whale Shark, Manta & Turtle snorkeling. Perfect for a short romantic getaway.",
                "detailed_description": "Stay on Maamigili Island and enjoy snorkeling with whale sharks, manta rays, and sea turtles.",
                "original_price": Decimal("1199.00"),
                "price": Decimal("999.00"),
                "discount_percentage": Decimal("16.68"),
                "duration": 4,
                "highlights": "Whale Shark Snorkeling, Manta Ray Encounters, Turtle Snorkeling, Full Board Meals, Speedboat Transfers",
                "activities": [
                    {"name": "Whale Shark Snorkeling", "description": "Swim with gentle whale sharks", "duration": "3-4 hours", "category": "marine_life"},
                    {"name": "Manta Ray Encounter", "description": "Experience graceful manta rays", "duration": "2-3 hours", "category": "marine_life"},
                    {"name": "Turtle Snorkeling", "description": "Swim alongside sea turtles", "duration": "2 hours", "category": "marine_life"},
                ],
            },
            {
                "name": "5 Nights – Adventure Break",
                "description": "Whale Sharks, Mantas, Sunset Cruise, and Turtle Snorkeling in 5 magical nights.",
                "detailed_description": "5-night package combining marine encounters with romantic experiences.",
                "original_price": Decimal("1549.00"),
                "price": Decimal("1299.00"),
                "discount_percentage": Decimal("16.14"),
                "duration": 5,
                "highlights": "Whale Shark Snorkeling, Manta Ray Encounters, Sunset Cruise, Turtle Snorkeling, Full Board Meals, Speedboat Transfers",
                "activities": [
                    {"name": "Whale Shark Snorkeling", "description": "Swim with gentle whale sharks", "duration": "3-4 hours", "category": "marine_life"},
                    {"name": "Manta Ray Encounter", "description": "Experience graceful manta rays", "duration": "2-3 hours", "category": "marine_life"},
                    {"name": "Sunset Cruise", "description": "Romantic sunset boat ride", "duration": "2 hours", "category": "romantic"},
                    {"name": "Turtle Snorkeling", "description": "Swim alongside sea turtles", "duration": "2 hours", "category": "marine_life"},
                ],
            },
            {
                "name": "6 Nights – Romantic Escape",
                "description": "Private island picnic, Sunset Cruise, and marine encounters for couples.",
                "detailed_description": "6-night escape with private island picnic and romantic sunset cruises.",
                "original_price": Decimal("1799.00"),
                "price": Decimal("1499.00"),
                "discount_percentage": Decimal("16.68"),
                "duration": 6,
                "highlights": "Private Island Picnic, Sunset Cruise, Manta Ray Encounters, Turtle Snorkeling, Full Board Meals, Speedboat Transfers",
                "activities": [
                    {"name": "Private Island Picnic", "description": "Exclusive private island experience", "duration": "4-5 hours", "category": "romantic"},
                    {"name": "Sunset Cruise", "description": "Romantic sunset boat ride", "duration": "2 hours", "category": "romantic"},
                    {"name": "Manta Ray Encounter", "description": "Experience graceful manta rays", "duration": "2-3 hours", "category": "marine_life"},
                    {"name": "Turtle Snorkeling", "description": "Swim alongside sea turtles", "duration": "2 hours", "category": "marine_life"},
                ],
            },
            {
                "name": "7 Nights – Maldives Bliss",
                "description": "Whale Sharks, Dolphins, Sandbanks, and more. The perfect honeymoon package.",
                "detailed_description": "Ultimate 7-night honeymoon with whale sharks, dolphins, sandbanks, and manta rays.",
                "original_price": Decimal("2149.00"),
                "price": Decimal("1799.00"),
                "discount_percentage": Decimal("16.28"),
                "duration": 7,
                "highlights": "Whale Shark Snorkeling, Dolphin Watching, Sandbank Excursion, Sunset Cruise, Manta Ray Encounters, Full Board Meals, Speedboat Transfers",
                "activities": [
                    {"name": "Whale Shark Snorkeling", "description": "Swim with gentle whale sharks", "duration": "3-4 hours", "category": "marine_life"},
                    {"name": "Dolphin Watching", "description": "Watch playful dolphins", "duration": "2-3 hours", "category": "marine_life"},
                    {"name": "Sandbank Excursion", "description": "Visit pristine sandbanks", "duration": "3-4 hours", "category": "adventure"},
                    {"name": "Sunset Cruise", "description": "Romantic sunset boat ride", "duration": "2 hours", "category": "romantic"},
                    {"name": "Manta Ray Encounter", "description": "Experience graceful manta rays", "duration": "2-3 hours", "category": "marine_life"},
                ],
            },
        ]

        inclusions_tpl = [
            ("included", "Romantic Accommodation", "{nights} nights in romantic couple room with ocean views"),
            ("included", "All Meals", "Full board meal plan (breakfast, lunch, dinner)"),
            ("included", "Airport Pickup & Transfer", "Meet & greet at airport + speedboat transfers to Maamigili"),
            ("included", "Daily Activities", "All mentioned activities and excursions"),
            ("included", "Professional Guide", "Experienced local guide for all activities"),
            ("included", "Equipment", "Snorkeling equipment and safety gear"),
            ("included", "Private Beach Access", "Access to private beach area for couples"),
            ("excluded", "International Flights", "Flights to and from Maldives"),
            ("excluded", "Travel Insurance", "Travel and medical insurance"),
            ("excluded", "Personal Expenses", "Souvenirs, additional meals, tips"),
            ("excluded", "Alcoholic Beverages", "Alcoholic drinks and beverages"),
            ("excluded", "Spa Treatments", "Optional couple spa treatments"),
        ]

        created = 0
        for pd in packages_data:
            if skip_existing and Package.objects.filter(name=pd["name"]).exists():
                self.stdout.write(f"Skipping existing: {pd['name']}")
                continue

            package = Package.objects.create(
                name=pd["name"],
                description=pd["description"],
                detailed_description=pd["detailed_description"],
                price=pd["price"],
                original_price=pd["original_price"],
                discount_percentage=pd["discount_percentage"],
                duration=pd["duration"],
                category="honeymoon",
                difficulty_level="easy",
                highlights=pd["highlights"],
                group_size_min=2,
                group_size_max=8,
                group_size_recommended=2,
                accommodation_type="romantic_guesthouse",
                room_type="romantic_couple_room",
                meal_plan="full_board",
                transportation_details=transport_text,
                airport_transfers=True,
                best_time_to_visit="Year-round, best from November to April",
                what_to_bring=["Swimwear", "Sunscreen", "Underwater camera"],
                important_notes=["International flights not included", "Valid passport required"],
                booking_terms="Full payment at booking. Non-refundable, reschedule with 30 days notice.",
                cancellation_policy="30+ days: 50% refund. Less than 30 days: no refund.",
                payment_terms="Full payment required. Credit cards and bank transfers accepted.",
                is_featured=True,
            )

            PackageDestination.objects.create(
                package=package,
                location=location,
                duration=pd["duration"],
                description=f"Romantic guesthouse in Maamigili, Alif Dhaal Atoll with ocean views.",
                highlights=["Ocean views", "Private beach access", "Local island atmosphere"],
                activities=["Beach relaxation", "Island exploration", "Snorkeling", "Sunset viewing"],
            )

            for cat, item, desc in inclusions_tpl:
                nights_sub = str(pd["duration"]) if "{nights}" in desc else ""
                PackageInclusion.objects.create(
                    package=package,
                    category=cat,
                    item=item,
                    description=desc.replace("{nights}", nights_sub),
                )

            for act in pd["activities"]:
                PackageActivity.objects.create(
                    package=package,
                    name=act["name"],
                    description=act["description"],
                    duration=act["duration"],
                    category=act["category"],
                    difficulty="easy",
                    included=True,
                    price="",
                )

            created += 1
            self.stdout.write(f"Created: {package.name} (${package.price})")

        self.stdout.write(
            self.style.SUCCESS(f"Successfully created {created} Maldives honeymoon packages.")
        )
