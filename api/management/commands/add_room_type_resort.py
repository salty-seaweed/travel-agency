from django.core.management.base import BaseCommand
from django.db import transaction

from api.models import Location, Resort, ResortRoomType


class Command(BaseCommand):
    help = "Create a sample resort configured with room-type-based pricing so the frontend flow can be previewed."

    RESORT_NAME = "Azure Lagoon Retreat"

    def handle(self, *args, **options):
        with transaction.atomic():
            resort = self._create_or_update_resort()
            created_room_types = self._ensure_room_types(resort)

        self.stdout.write(
            self.style.SUCCESS(
                f"Resort '{resort.name}' ready with {len(created_room_types)} room type(s). "
                f"Visit /resorts/{resort.id} to preview the room-type booking flow."
            )
        )

    def _create_or_update_resort(self) -> Resort:
        location, _ = Location.objects.get_or_create(
            island="Azure Lagoon Atoll",
            defaults={
                "atoll": "North Malé Atoll",
                "latitude": 4.2100,
                "longitude": 73.5400,
            },
        )

        resort, created = Resort.objects.get_or_create(
            name=self.RESORT_NAME,
            defaults={
                "description": (
                    "A contemporary hideaway featuring overwater and beach residences, "
                    "tailored wellness journeys, and chef-curated dining overlooking the lagoon."
                ),
                "detailed_description": (
                    "Azure Lagoon Retreat specialises in bespoke experiences for couples and families. "
                    "Enjoy sunrise paddle boarding, private sandbank picnics, and holistic spa therapies. "
                    "All villas include butler service, premium minibar selections, and flexible meal plans."
                ),
                "category": "luxury",
                "star_rating": 5,
                "location": location,
                "atoll": "North Malé Atoll",
                "island_name": "Azure Lagoon",
                "currency": "USD",
                "price_per_night_from": 950,
                "price_per_night_to": 3200,
                "restaurants": 5,
                "bars": 3,
                "spa_centers": 1,
                "pools": 2,
                "water_villas": 24,
                "beach_villas": 18,
                "is_packaged": False,
                "is_room_type": True,
                "is_featured": True,
                "is_active": True,
                "gallery_images": [
                    "https://images.unsplash.com/photo-1505760400348-3971842daf82",
                    "https://images.unsplash.com/photo-1505761671935-60b3a7427bad",
                    "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee",
                ],
                "featured_highlights": [
                    "Personal butler service for every villa",
                    "Floating breakfast experiences",
                    "Award-winning hydrotherapy spa circuit",
                ],
            },
        )

        if not created and not resort.is_room_type:
            resort.is_room_type = True
            resort.save(update_fields=["is_room_type"])

        return resort

    def _ensure_room_types(self, resort: Resort) -> list[ResortRoomType]:
        room_type_payload = [
            {
                "name": "Lagoon Sunrise Villa",
                "description": "Sunrise-facing villa with a private infinity pool, glass floor living room, and direct lagoon access.",
                "price_per_night": 1150,
                "currency": "USD",
                "occupancy_adults": 2,
                "occupancy_children": 1,
                "bed_configuration": "1 King Bed + Optional Day Bed",
                "amenities": [
                    "Private infinity plunge pool",
                    "In-villa breakfast service",
                    "Outdoor rain shower",
                    "Dedicated butler",
                ],
                "order": 1,
            },
            {
                "name": "Treetop Family Pavilion",
                "description": "Two-bedroom pavilion elevated among palms with panoramic lagoon views and spacious indoor-outdoor living areas.",
                "price_per_night": 1850,
                "currency": "USD",
                "occupancy_adults": 4,
                "occupancy_children": 2,
                "bed_configuration": "2 King Beds + Sofa Bed",
                "amenities": [
                    "Private rooftop deck",
                    "Family cinema nook",
                    "Complimentary kids club access",
                    "Daily sunset canapés",
                ],
                "order": 2,
            },
            {
                "name": "Celestial Overwater Residence",
                "description": "Signature two-bedroom residence with 360° lagoon views, expansive sundeck, and private spa treatment room.",
                "price_per_night": 2950,
                "currency": "USD",
                "occupancy_adults": 4,
                "occupancy_children": 1,
                "bed_configuration": "2 King Beds + Day Bed",
                "amenities": [
                    "Private spa suite with sauna",
                    "Chef's kitchen and dining deck",
                    "Sunken sunset lounge",
                    "Complimentary private snorkel guide",
                ],
                "order": 3,
            },
        ]

        created_room_types = []
        for payload in room_type_payload:
            room_type, _ = ResortRoomType.objects.update_or_create(
                resort=resort,
                name=payload["name"],
                defaults=payload,
            )
            created_room_types.append(room_type)

        return created_room_types




