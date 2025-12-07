from decimal import Decimal
from urllib.parse import quote_plus

from django.core.management.base import BaseCommand
from django.db import transaction

from api.models import Location, Resort


def build_placeholder(text: str, size: str = "1600x900") -> str:
    """Return a remote placeholder image URL with legible text."""
    return f"https://placehold.co/{size}?text={quote_plus(text)}"


RESORT_DEFINITIONS = [
    {
        "name": "Hard Rock Hotel Maldives",
        "slug": "Hard Rock",
        "category": "luxury",
        "star_rating": 5,
        "island": "Enboodhoo Lagoon",
        "atoll": "South Malé Atoll",
        "coordinates": "4.1300, 73.4200",
        "price_from": Decimal("450.00"),
        "price_to": Decimal("1250.00"),
        "restaurants": 6,
        "bars": 3,
        "pools": 2,
        "total_villas": 178,
        "featured": True,
        "accommodations": [
            "Silver Sky Studio",
            "Gold Beach Villa",
            "Platinum Overwater Villa",
        ],
    },
    {
        "name": "SAii Lagoon Maldives",
        "slug": "SAii Lagoon",
        "category": "semi_luxury",
        "star_rating": 5,
        "island": "Enboodhoo Lagoon",
        "atoll": "South Malé Atoll",
        "coordinates": "4.1350, 73.4240",
        "price_from": Decimal("380.00"),
        "price_to": Decimal("950.00"),
        "restaurants": 5,
        "bars": 2,
        "pools": 2,
        "total_villas": 198,
        "featured": False,
        "accommodations": [
            "Sky Room",
            "Beach Room",
            "Overwater Villa",
        ],
    },
    {
        "name": "OZEN Reserve Bolifushi",
        "slug": "OZEN Bolifushi",
        "category": "luxury",
        "star_rating": 6,
        "island": "Bolifushi Island",
        "atoll": "South Malé Atoll",
        "coordinates": "3.9400, 73.4800",
        "price_from": Decimal("980.00"),
        "price_to": Decimal("2800.00"),
        "restaurants": 5,
        "bars": 3,
        "pools": 3,
        "total_villas": 90,
        "featured": True,
        "accommodations": [
            "Earth Pool Villa",
            "Ocean Pool Suite",
            "Royal Reserve",
        ],
    },
    {
        "name": "Sun Siyam Iru Fushi",
        "slug": "Sun Siyam",
        "category": "luxury",
        "star_rating": 5,
        "island": "Iru Fushi",
        "atoll": "Noonu Atoll",
        "coordinates": "5.7290, 73.3440",
        "price_from": Decimal("320.00"),
        "price_to": Decimal("980.00"),
        "restaurants": 14,
        "bars": 6,
        "pools": 2,
        "total_villas": 221,
        "featured": False,
        "accommodations": [
            "Beach Villa",
            "Water Villa",
            "Family Deluxe Beach Villa",
        ],
    },
    {
        "name": "Cinnamon Dhonveli Maldives",
        "slug": "Cinnamon Dhonveli",
        "category": "family_friendly",
        "star_rating": 4,
        "island": "Kanuoiy Huraa",
        "atoll": "North Malé Atoll",
        "coordinates": "4.2500, 73.5400",
        "price_from": Decimal("260.00"),
        "price_to": Decimal("620.00"),
        "restaurants": 4,
        "bars": 3,
        "pools": 1,
        "total_villas": 148,
        "featured": False,
        "accommodations": [
            "Beach Bungalow",
            "Water Bungalow",
            "Overwater Suite",
        ],
    },
    {
        "name": "Velassaru Maldives",
        "slug": "Velassaru",
        "category": "luxury",
        "star_rating": 5,
        "island": "Velassaru",
        "atoll": "South Malé Atoll",
        "coordinates": "4.1230, 73.3960",
        "price_from": Decimal("420.00"),
        "price_to": Decimal("1180.00"),
        "restaurants": 5,
        "bars": 2,
        "pools": 1,
        "total_villas": 129,
        "featured": True,
        "accommodations": [
            "Deluxe Bungalow",
            "Water Villa",
            "Pool Villa",
        ],
    },
    {
        "name": "Kuramathi Maldives",
        "slug": "Kuramathi",
        "category": "family_friendly",
        "star_rating": 4,
        "island": "Kuramathi",
        "atoll": "Rasdhoo Atoll",
        "coordinates": "4.2630, 72.9980",
        "price_from": Decimal("310.00"),
        "price_to": Decimal("860.00"),
        "restaurants": 9,
        "bars": 6,
        "pools": 3,
        "total_villas": 360,
        "featured": False,
        "accommodations": [
            "Beach Villa",
            "Water Villa",
            "Honeymoon Pool Villa",
        ],
    },
    {
        "name": "Kurumba Maldives",
        "slug": "Kurumba",
        "category": "family_friendly",
        "star_rating": 5,
        "island": "Vihamanafushi",
        "atoll": "North Malé Atoll",
        "coordinates": "4.2320, 73.5090",
        "price_from": Decimal("280.00"),
        "price_to": Decimal("780.00"),
        "restaurants": 8,
        "bars": 3,
        "pools": 2,
        "total_villas": 180,
        "featured": False,
        "accommodations": [
            "Superior Room",
            "Deluxe Pool Villa",
            "Royal Kurumba Residence",
        ],
    },
    {
        "name": "Dhigufaru Island Resort",
        "slug": "Dhigufaru",
        "category": "boutique",
        "star_rating": 5,
        "island": "Dhigufaru",
        "atoll": "Baa Atoll",
        "coordinates": "5.5530, 73.2570",
        "price_from": Decimal("340.00"),
        "price_to": Decimal("880.00"),
        "restaurants": 3,
        "bars": 2,
        "pools": 1,
        "total_villas": 85,
        "featured": False,
        "accommodations": [
            "Beach Villa",
            "Semi Water Villa",
            "Bodhanfulhu Pool Water Villa",
        ],
    },
    {
        "name": "Paradise Island Resort (Nautica Collection)",
        "slug": "Paradise Nautica",
        "category": "family_friendly",
        "star_rating": 4,
        "island": "Lankanfinolhu",
        "atoll": "North Malé Atoll",
        "coordinates": "4.2160, 73.5460",
        "price_from": Decimal("240.00"),
        "price_to": Decimal("720.00"),
        "restaurants": 5,
        "bars": 3,
        "pools": 1,
        "total_villas": 282,
        "featured": False,
        "accommodations": [
            "Beach Villa",
            "Water Villa",
            "Ocean Suite with Pool",
        ],
    },
    {
        "name": "Holiday Inn Resort Kandooma Maldives",
        "slug": "Holiday Inn Kandooma",
        "category": "family_friendly",
        "star_rating": 4,
        "island": "Kandooma Fushi",
        "atoll": "South Malé Atoll",
        "coordinates": "3.9450, 73.4710",
        "price_from": Decimal("220.00"),
        "price_to": Decimal("640.00"),
        "restaurants": 3,
        "bars": 2,
        "pools": 2,
        "total_villas": 160,
        "featured": False,
        "accommodations": [
            "Beach House",
            "Seaview Villa",
            "Overwater Villa",
        ],
    },
]


def build_gallery(placeholders: list[str]) -> list[str]:
    """Ensure gallery URLs are unique and deduplicated."""
    seen = set()
    gallery = []
    for url in placeholders:
        if url not in seen:
            gallery.append(url)
            seen.add(url)
    return gallery


class Command(BaseCommand):
    help = (
        "Create non-packaged, non-room-type resorts with placeholder imagery. "
        "Update the generated placeholder URLs with real assets when available."
    )

    @transaction.atomic
    def handle(self, *args, **options):
        created = 0
        updated = 0

        for data in RESORT_DEFINITIONS:
            location, _ = Location.objects.get_or_create(
                island=data["island"],
                defaults={
                    "atoll": data["atoll"],
                    "latitude": None,
                    "longitude": None,
                },
            )

            hero_placeholder = build_placeholder(f"{data['slug']} Hero")
            accommodation_placeholders = [
                build_placeholder(f"{data['slug']} {acc}", size="1280x720")
                for acc in data["accommodations"]
            ]

            gallery_images = build_gallery([hero_placeholder] + accommodation_placeholders)

            details = {
                "description": f"{data['name']} is one of the Maldives resorts on our radar. "
                "Replace this copy with a richer description before publishing.",
                "detailed_description": (
                    "Placeholder copy for detailed description. "
                    "Be sure to replace this with property-verified content."
                ),
                "category": data["category"],
                "star_rating": data["star_rating"],
                "location": location,
                "atoll": data["atoll"],
                "island_name": data["island"],
                "coordinates": data["coordinates"],
                "currency": "USD",
                "price_per_night_from": data["price_from"],
                "price_per_night_to": data["price_to"],
                "restaurants": data["restaurants"],
                "bars": data["bars"],
                "pools": data["pools"],
                "total_villas": data["total_villas"],
                "beach_villas": None,
                "water_villas": None,
                "overwater_villas": None,
                "gallery_images": gallery_images,
                "featured_highlights": [f"{acc} accommodation" for acc in data["accommodations"]],
                "special_offers": [],
                "is_featured": data["featured"],
                "is_packaged": False,
                "is_room_type": False,
                "is_adults_only": False,
                "is_family_friendly": True,
                "is_honeymoon_special": True,
                "is_eco_friendly": True,
                "is_private_island": False,
                "has_house_reef": True,
                "has_private_beach": True,
            }

            resort, created_flag = Resort.objects.update_or_create(
                name=data["name"],
                defaults=details,
            )

            if created_flag:
                created += 1
                action = "Created"
            else:
                updated += 1
                action = "Updated"

            self.stdout.write(
                self.style.SUCCESS(
                    f"{action} resort '{resort.name}' with {len(gallery_images)} placeholder image URLs."
                )
            )

        self.stdout.write(
            self.style.NOTICE(
                "Placeholders use https://placehold.co URLs. "
                "Swap these with real hero and accommodation imagery when assets are ready."
            )
        )
        self.stdout.write(
            self.style.SUCCESS(f"Completed: {created} created, {updated} updated.")
        )




