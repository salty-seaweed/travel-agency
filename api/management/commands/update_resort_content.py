from __future__ import annotations

from dataclasses import dataclass, field
from decimal import Decimal
from typing import Iterable, Sequence
from urllib.parse import quote_plus

from django.core.management.base import BaseCommand
from django.db import transaction

from api.models import Resort, ResortRoomType


PLACEHOLDER_HERO_SIZE = "1600x900"
PLACEHOLDER_ROOM_SIZE = "1280x720"


def build_placeholder(label: str, size: str) -> str:
    """Return a consistent remote placeholder URL with legible overlay text."""
    return f"https://placehold.co/{size}?text={quote_plus(label)}"


def unique(sequence: Iterable[str]) -> list[str]:
    """Return a list preserving order while removing duplicates."""
    seen = set()
    ordered: list[str] = []
    for item in sequence:
        if item not in seen:
            ordered.append(item)
            seen.add(item)
    return ordered


@dataclass(frozen=True)
class RoomTypeDefinition:
    name: str
    description: str
    price_per_night: Decimal
    occupancy_adults: int
    occupancy_children: int
    bed_configuration: str
    amenities: Sequence[str]
    order: int
    image_text: str


@dataclass(frozen=True)
class ResortContentDefinition:
    name: str
    short_label: str
    description: str
    detailed_description: str
    highlights: Sequence[str]
    gallery_labels: Sequence[str]
    room_types: Sequence[RoomTypeDefinition] = field(default_factory=tuple)


RESORT_CONTENT: Sequence[ResortContentDefinition] = (
    ResortContentDefinition(
        name="Hard Rock Hotel Maldives",
        short_label="Hard Rock Maldives",
        description=(
            "Amp up your island escape with iconic Hard Rock memorabilia, live entertainment, "
            "and effortless access to The Marina @ CROSSROADS Maldives."
        ),
        detailed_description=(
            "Hard Rock Hotel Maldives transforms the Emboodhoo Lagoon into a stage for curated experiences. "
            "Soundtracked amenities include in-room Crosley vinyl players, poolside music labs for kids, and "
            "exclusive JAM sessions for families. Guests tap into the culinary village at CROSSROADS, explore the "
            "Marine Discovery Centre, or wind down at the Rock Spa. Every stay includes the signature Sound of Your "
            "Stay® program plus 24/7 access to fitness, watersports, and live music programming."
        ),
        highlights=(
            "Direct bridge access to The Marina @ CROSSROADS Maldives",
            "Signature Sound of Your Stay® musical amenities",
            "Musically inspired kids club and teen programs",
        ),
        gallery_labels=(
            "Aerial Lagoon Views",
            "Rockstar Pool Scene",
            "Dining Stage",
        ),
        room_types=(
            RoomTypeDefinition(
                name="Silver Sky Studio",
                description=(
                    "Light-filled upper-floor studio with private balcony, rainfall shower, "
                    "and curated music playlists."
                ),
                price_per_night=Decimal("450.00"),
                occupancy_adults=2,
                occupancy_children=1,
                bed_configuration="1 King Bed or 2 Queen Beds",
                amenities=(
                    "Private balcony with lagoon glimpses",
                    "Rainfall shower and signature bath amenities",
                    "Crosley turntable with curated vinyl",
                    "Complimentary guitar rental via Sound of Your Stay®",
                ),
                order=1,
                image_text="Silver Sky Studio",
            ),
            RoomTypeDefinition(
                name="Gold Beach Villa",
                description=(
                    "Steps from the shoreline with an outdoor deck, indoor lounge, and "
                    "direct access to the music-infused main beach."
                ),
                price_per_night=Decimal("620.00"),
                occupancy_adults=2,
                occupancy_children=2,
                bed_configuration="1 King Bed + Sofa Bed",
                amenities=(
                    "Beachfront deck with loungers",
                    "Outdoor rain shower",
                    "Dedicated personal assistant",
                    "Curated minibar with craft beverages",
                ),
                order=2,
                image_text="Gold Beach Villa",
            ),
            RoomTypeDefinition(
                name="Platinum Overwater Pool Villa",
                description=(
                    "Signature overwater retreat featuring a plunge pool, panoramic lagoon "
                    "views, and private stairway to the Indian Ocean."
                ),
                price_per_night=Decimal("950.00"),
                occupancy_adults=3,
                occupancy_children=1,
                bed_configuration="1 King Bed + Day Bed",
                amenities=(
                    "Private infinity plunge pool",
                    "Outdoor dining pavilion",
                    "Dedicated villa host",
                    "Direct lagoon access with reef snorkeling",
                ),
                order=3,
                image_text="Platinum Overwater Villa",
            ),
        ),
    ),
    ResortContentDefinition(
        name="SAii Lagoon Maldives",
        short_label="SAii Lagoon",
        description=(
            "A tropical lifestyle hub where artfully designed spaces, artisanal dining, "
            "and barefoot fun unite at CROSSROADS Maldives."
        ),
        detailed_description=(
            "SAii Lagoon Maldives celebrates art-forward design and easygoing discovery. "
            "Sip handcrafted coffees at bean/Co, balance your senses at Len Be Well spa, and "
            "wander the vibrant eateries of The Marina. Families love the Junior Beach Club, while "
            "couples escape to sandbank picnics or sunset cruises. Sustainability initiatives include "
            "marine conservation workshops and a zero single-use plastic commitment."
        ),
        highlights=(
            "Creative hub access with dining and retail at CROSSROADS",
            "Len Be Well spa rituals inspired by island botanicals",
            "Complimentary non-motorised water sports",
        ),
        gallery_labels=(
            "Lagoon Boardwalk",
            "Poolside Cabana",
            "Artisanal Dining",
        ),
        room_types=(
            RoomTypeDefinition(
                name="Sky Room",
                description=(
                    "Upper-level retreat with private balcony, calming lagoon palette, and "
                    "rainfall shower bathroom."
                ),
                price_per_night=Decimal("380.00"),
                occupancy_adults=2,
                occupancy_children=1,
                bed_configuration="1 King Bed or 2 Twin Beds",
                amenities=(
                    "Private balcony with seating",
                    "Rainfall shower and premium bath amenities",
                    "Nespresso machine and tea bar",
                    "Complimentary Wi-Fi and Chromecast streaming",
                ),
                order=1,
                image_text="Sky Room",
            ),
            RoomTypeDefinition(
                name="Beach Villa",
                description=(
                    "Beachfront escape with shaded veranda, outdoor shower, and access to the "
                    "island's turquoise lagoon."
                ),
                price_per_night=Decimal("520.00"),
                occupancy_adults=2,
                occupancy_children=2,
                bed_configuration="1 King Bed + Day Bed",
                amenities=(
                    "Beachfront terrace with loungers",
                    "Open-air rain shower",
                    "Portable Bluetooth speaker",
                    "Curated pillow menu",
                ),
                order=2,
                image_text="Beach Villa",
            ),
            RoomTypeDefinition(
                name="Overwater Villa",
                description=(
                    "Stylish villa perched above the lagoon with overwater hammock, soaking tub, "
                    "and breezy indoor-outdoor living."
                ),
                price_per_night=Decimal("710.00"),
                occupancy_adults=3,
                occupancy_children=1,
                bed_configuration="1 King Bed + Sofa Bed",
                amenities=(
                    "Private terrace with overwater hammock",
                    "Freestanding soaking tub",
                    "Direct lagoon access ladder",
                    "Curated minibar with artisanal treats",
                ),
                order=3,
                image_text="Overwater Villa",
            ),
        ),
    ),
    ResortContentDefinition(
        name="OZEN Reserve Bolifushi",
        short_label="OZEN Bolifushi",
        description=(
            "Ultra-luxe private island delivering the exclusive INDULGENCE™ plan, curated dining, "
            "and tailored wellness every moment of the stay."
        ),
        detailed_description=(
            "OZEN Reserve Bolifushi is a sanctuary of refined privacy with expansive villas, "
            "world-class dining, and the ELE|NA Elements of Nature spa. Guests arrive by luxury "
            "catamaran, explore the house reef with marine biologists, and indulge in premium beverage "
            "pairings across signature restaurants. Little travelers enjoy the kid-friendly ice rink, "
            "while couples retreat to the overwater hammam or exclusive sandbank dinners."
        ),
        highlights=(
            "INDULGENCE™ all-inclusive fine dining and premium beverages",
            "Private butler service for every villa and residence",
            "Overwater hammam and world-class wellness journeys",
        ),
        gallery_labels=(
            "Sunset Jetty",
            "Reserve Pool",
            "Gourmet Dining",
        ),
        room_types=(
            RoomTypeDefinition(
                name="Earth Pool Villa",
                description=(
                    "Secluded beach villa with private lap pool, shaded cabana, and direct access "
                    "to powder-soft sands."
                ),
                price_per_night=Decimal("980.00"),
                occupancy_adults=3,
                occupancy_children=2,
                bed_configuration="1 King Bed + Day Bed",
                amenities=(
                    "Private 8-metre lap pool",
                    "Dedicated butler and buggy service",
                    "Outdoor rain shower and garden bathtub",
                    "Complimentary bicycles",
                ),
                order=1,
                image_text="Earth Pool Villa",
            ),
            RoomTypeDefinition(
                name="Ocean Pool Suite",
                description=(
                    "Overwater sanctuary with infinity pool, glass floor panels, and panoramic "
                    "lagoon sunrise views."
                ),
                price_per_night=Decimal("1450.00"),
                occupancy_adults=2,
                occupancy_children=2,
                bed_configuration="1 King Bed + Sofa Bed",
                amenities=(
                    "Private infinity pool overlooking lagoon",
                    "Glass floor living room",
                    "In-suite spa treatments on request",
                    "24-hour butler service",
                ),
                order=2,
                image_text="Ocean Pool Suite",
            ),
            RoomTypeDefinition(
                name="Royal Reserve",
                description=(
                    "Three-bedroom private reserve featuring its own spa pavilion, gym, private "
                    "beach, and opulent Arabian-style decor."
                ),
                price_per_night=Decimal("2800.00"),
                occupancy_adults=6,
                occupancy_children=3,
                bed_configuration="3 King Beds",
                amenities=(
                    "Private gym and spa pavilion",
                    "Dedicated chef and host team",
                    "Personalized dining at exclusive pier",
                    "Private stretch of beach with cabanas",
                ),
                order=3,
                image_text="Royal Reserve",
            ),
        ),
    ),
    ResortContentDefinition(
        name="Sun Siyam Iru Fushi",
        short_label="Sun Siyam Iru Fushi",
        description=(
            "Vast playground in Noonu Atoll with 15 dining destinations, award-winning spa, and "
            "immersive adventures for every traveler."
        ),
        detailed_description=(
            "Sun Siyam Iru Fushi spans 52 acres of tropical gardens with an acclaimed house reef, "
            "dedicated dive centre, and the region's most comprehensive spa sanctuary. Culinary discovery "
            "spans Maldivian seafood grills to Japanese teppanyaki. Families love the Koamas Kidz Club, "
            "while couples indulge in adults-only infinity pools, hydrotherapy journeys, and private dhoni cruises."
        ),
        highlights=(
            "15 dining and bar destinations across the island",
            "Overwater spa with hydrotherapy circuit",
            "Dedicated dive, snorkel, and water sports centre",
        ),
        gallery_labels=(
            "Lagoon Arrival",
            "Adults Only Infinity Pool",
            "Spa Hydrotherapy",
        ),
        room_types=(
            RoomTypeDefinition(
                name="Beach Villa",
                description=(
                    "Spacious villa nestled among palms with terrace daybed, open-air bathroom, and "
                    "direct beach access."
                ),
                price_per_night=Decimal("320.00"),
                occupancy_adults=2,
                occupancy_children=2,
                bed_configuration="1 King Bed + Day Bed",
                amenities=(
                    "Private outdoor cabana",
                    "Open-air bathroom with rain shower",
                    "Complimentary snorkelling gear",
                    "Personal butler on request",
                ),
                order=1,
                image_text="Beach Villa",
            ),
            RoomTypeDefinition(
                name="Water Villa",
                description=(
                    "Elegant overwater villa with glass floor panels, sundeck loungers, and "
                    "panoramic lagoon vistas."
                ),
                price_per_night=Decimal("510.00"),
                occupancy_adults=2,
                occupancy_children=1,
                bed_configuration="1 King Bed",
                amenities=(
                    "Private sun deck with loungers",
                    "Glass floor viewing panels",
                    "Direct lagoon access",
                    "In-villa dining service",
                ),
                order=2,
                image_text="Water Villa",
            ),
            RoomTypeDefinition(
                name="Family Deluxe Beach Villa",
                description=(
                    "Two-bedroom retreat with private courtyard pool, family lounge, and shaded "
                    "outdoor dining pavilion."
                ),
                price_per_night=Decimal("690.00"),
                occupancy_adults=4,
                occupancy_children=2,
                bed_configuration="1 King Bed + 2 Twin Beds",
                amenities=(
                    "Private freshwater pool",
                    "Family lounge with games and media",
                    "Outdoor rain shower and daybed",
                    "Personalized family activity planning",
                ),
                order=3,
                image_text="Family Deluxe Villa",
            ),
        ),
    ),
    ResortContentDefinition(
        name="Cinnamon Dhonveli Maldives",
        short_label="Cinnamon Dhonveli",
        description=(
            "Energetic surf-friendly island celebrated for turquoise breaks, barefoot dining, and "
            "relaxed Maldivian hospitality."
        ),
        detailed_description=(
            "Cinnamon Dhonveli Maldives is home to the iconic Pasta Point surf break in North Malé Atoll. "
            "Beyond the waves, guests savour themed buffets, à la carte seafood, and refreshing tropical cocktails. "
            "The island features multiple pools, the Chavana Spa, and daily excursions ranging from dolphin cruises "
            "to sunset fishing. Families appreciate the lively atmosphere, while surfers chase consistent swells "
            "right off the resort jetty."
        ),
        highlights=(
            "Exclusive access to Pasta Point surf break",
            "Daily themed dining and live entertainment",
            "Chavana Spa and oceanfront pools",
        ),
        gallery_labels=(
            "Surf Break",
            "Lagoon Pool",
            "Sunset Dining",
        ),
        room_types=(
            RoomTypeDefinition(
                name="Beach Bungalow",
                description=(
                    "Classic island bungalow steps from the surf with indoor-outdoor bathroom and "
                    "shaded veranda."
                ),
                price_per_night=Decimal("260.00"),
                occupancy_adults=2,
                occupancy_children=2,
                bed_configuration="1 King Bed or 2 Twin Beds",
                amenities=(
                    "Private veranda with seating",
                    "Open-air bathroom with rain shower",
                    "Complimentary surfboard storage",
                    "Tea and coffee making facilities",
                ),
                order=1,
                image_text="Beach Bungalow",
            ),
            RoomTypeDefinition(
                name="Water Bungalow",
                description=(
                    "Stilted bungalow with panoramic lagoon views, king bedroom, and split-level "
                    "sun deck for wave watching."
                ),
                price_per_night=Decimal("430.00"),
                occupancy_adults=2,
                occupancy_children=1,
                bed_configuration="1 King Bed",
                amenities=(
                    "Private deck with loungers",
                    "Indoor bathtub with ocean views",
                    "Direct ladder access to lagoon",
                    "Evening turndown service",
                ),
                order=2,
                image_text="Water Bungalow",
            ),
            RoomTypeDefinition(
                name="Overwater Suite",
                description=(
                    "Spacious suite featuring separate living area, glass floor viewing, and "
                    "private balcony for sunset vistas."
                ),
                price_per_night=Decimal("560.00"),
                occupancy_adults=3,
                occupancy_children=1,
                bed_configuration="1 King Bed + Sofa Bed",
                amenities=(
                    "Living area with glass floor panel",
                    "Outdoor jacuzzi",
                    "Dedicated butler on request",
                    "In-suite dining setup",
                ),
                order=3,
                image_text="Overwater Suite",
            ),
        ),
    ),
    ResortContentDefinition(
        name="Velassaru Maldives",
        short_label="Velassaru",
        description=(
            "Contemporary island escape with chic beachfront villas, award-winning spa pavilions, "
            "and cinematic sunset scenes."
        ),
        detailed_description=(
            "Velassaru Maldives invites guests to unwind in minimalist luxury with sparkling lagoon views. "
            "Dine barefoot at Sand, enjoy teppanyaki theatre, or cruise the atoll aboard a sleek dhoni. "
            "The overwater spa delivers signature coconut treatments, while the Dive Centre introduces thriving reefs. "
            "By night, mixologists craft artisan cocktails as the sun sets behind the overwater jetty."
        ),
        highlights=(
            "Minimalist contemporary architecture on a private lagoon",
            "Overwater spa with glass-floor treatment suites",
            "Sunset cruises aboard traditional dhoni boats",
        ),
        gallery_labels=(
            "Aerial Island",
            "Infinity Pool",
            "Overwater Spa",
        ),
        room_types=(
            RoomTypeDefinition(
                name="Deluxe Bungalow",
                description=(
                    "Standalone bungalow with tropical garden courtyard, outdoor shower, and "
                    "easy access to the lagoon pool."
                ),
                price_per_night=Decimal("420.00"),
                occupancy_adults=2,
                occupancy_children=1,
                bed_configuration="1 King Bed or 2 Twin Beds",
                amenities=(
                    "Private garden terrace",
                    "Outdoor rainfall shower",
                    "Complimentary snorkel gear",
                    "Nespresso machine",
                ),
                order=1,
                image_text="Deluxe Bungalow",
            ),
            RoomTypeDefinition(
                name="Water Villa",
                description=(
                    "Elegant overwater villa with oversized sun deck, private plunge pool, and "
                    "floor-to-ceiling lagoon views."
                ),
                price_per_night=Decimal("680.00"),
                occupancy_adults=2,
                occupancy_children=1,
                bed_configuration="1 King Bed",
                amenities=(
                    "Private plunge pool overlooking lagoon",
                    "Glass floor living space",
                    "Direct ocean ladder",
                    "Outdoor dining pavilion",
                ),
                order=2,
                image_text="Water Villa",
            ),
            RoomTypeDefinition(
                name="Pool Villa",
                description=(
                    "Expansive beachfront villa with lap pool, curated wine chiller, and dedicated "
                    "pavilion for al-fresco dining."
                ),
                price_per_night=Decimal("910.00"),
                occupancy_adults=3,
                occupancy_children=1,
                bed_configuration="1 King Bed + Sofa Bed",
                amenities=(
                    "Private lap pool and sun deck",
                    "Outdoor rain shower and bathtub",
                    "Dedicated villa host",
                    "Wine chiller with premium labels",
                ),
                order=3,
                image_text="Pool Villa",
            ),
        ),
    ),
    ResortContentDefinition(
        name="Kuramathi Maldives",
        short_label="Kuramathi",
        description=(
            "Lush island paradise stretching 1.8 kilometres with dive adventures, botanical trails, "
            "and curated dining along a sandbank."
        ),
        detailed_description=(
            "Kuramathi Maldives blends natural beauty with tailored experiences. "
            "Discover the Eco Centre and nature trail, explore the sandbank at sunset, or dive with resident marine "
            "biologists. Twelve restaurants span Mediterranean tapas to overwater fine dining. "
            "Families appreciate the Bageecha Kids Club, while couples retreat to the Champagne Loft or private spa villas."
        ),
        highlights=(
            "1.8 km island with stunning sandbank sunsets",
            "Eco Centre with resident marine biologists",
            "Twelve diverse dining venues and bars",
        ),
        gallery_labels=(
            "Sandbank Sunset",
            "Eco Centre",
            "Lagoon Villas",
        ),
        room_types=(
            RoomTypeDefinition(
                name="Beach Villa",
                description=(
                    "Crescent-shaped villa with semi-open bathroom, outdoor daybed, and proximity "
                    "to the vibrant sandbank."
                ),
                price_per_night=Decimal("310.00"),
                occupancy_adults=2,
                occupancy_children=2,
                bed_configuration="1 King Bed + Day Bed",
                amenities=(
                    "Private deck with daybed",
                    "Open-air bathroom with rain shower",
                    "Complimentary bicycles on request",
                    "Nespresso machine and minibar",
                ),
                order=1,
                image_text="Beach Villa",
            ),
            RoomTypeDefinition(
                name="Water Villa",
                description=(
                    "Elegantly appointed overwater villa with expansive deck, ocean-facing tub, "
                    "and lagoon stairs."
                ),
                price_per_night=Decimal("520.00"),
                occupancy_adults=2,
                occupancy_children=1,
                bed_configuration="1 King Bed",
                amenities=(
                    "Private sun deck with loungers",
                    "Ocean-facing freestanding tub",
                    "Direct lagoon access",
                    "Bluetooth sound system",
                ),
                order=2,
                image_text="Water Villa",
            ),
            RoomTypeDefinition(
                name="Honeymoon Pool Villa",
                description=(
                    "Secluded compound with infinity pool, separate living pavilion, and "
                    "dedicated butler assistance."
                ),
                price_per_night=Decimal("860.00"),
                occupancy_adults=2,
                occupancy_children=1,
                bed_configuration="1 King Bed",
                amenities=(
                    "Private infinity pool",
                    "Outdoor rain shower and jacuzzi",
                    "Dedicated villa host",
                    "Private dining gazebo",
                ),
                order=3,
                image_text="Honeymoon Pool Villa",
            ),
        ),
    ),
    ResortContentDefinition(
        name="Kurumba Maldives",
        short_label="Kurumba",
        description=(
            "Maldives' original resort offering warm Maldivian hospitality, lush gardens, "
            "and easy speedboat access from Malé."
        ),
        detailed_description=(
            "Kurumba Maldives delivers timeless island charm just ten minutes from the international airport. "
            "Journey through eight restaurants, including authentic Maldivian cuisine at Thila. "
            "Daily activities range from cooking classes to reef snorkeling, while the Veli Spa offers "
            "coconut-inspired therapies. Ideal for families and repeat guests seeking a vibrant yet convenient escape."
        ),
        highlights=(
            "Ten-minute speedboat transfer from Malé",
            "Extensive dining with live entertainment",
            "Lush tropical gardens and calm lagoon",
        ),
        gallery_labels=(
            "Aerial Lagoon",
            "Garden Paths",
            "Dining Under Stars",
        ),
        room_types=(
            RoomTypeDefinition(
                name="Superior Room",
                description=(
                    "Ground-floor retreat surrounded by gardens with private terrace and "
                    "spacious bathroom."
                ),
                price_per_night=Decimal("280.00"),
                occupancy_adults=2,
                occupancy_children=2,
                bed_configuration="1 King Bed or 2 Twin Beds",
                amenities=(
                    "Private terrace with daybed",
                    "Indoor bathtub and rain shower",
                    "Complimentary Wi-Fi",
                    "Coffee and tea station",
                ),
                order=1,
                image_text="Superior Room",
            ),
            RoomTypeDefinition(
                name="Deluxe Pool Villa",
                description=(
                    "Walled beachfront villa with plunge pool, outdoor rain shower, and "
                    "personalised butler service."
                ),
                price_per_night=Decimal("520.00"),
                occupancy_adults=3,
                occupancy_children=1,
                bed_configuration="1 King Bed + Sofa Bed",
                amenities=(
                    "Private courtyard plunge pool",
                    "Outdoor rain shower and jacuzzi",
                    "Dedicated Villa Host",
                    "Premium minibar selection",
                ),
                order=2,
                image_text="Deluxe Pool Villa",
            ),
            RoomTypeDefinition(
                name="Royal Kurumba Residence",
                description=(
                    "Two-bedroom beachfront residence with oversized pool, expansive deck, and "
                    "discreet butler team."
                ),
                price_per_night=Decimal("780.00"),
                occupancy_adults=4,
                occupancy_children=2,
                bed_configuration="2 King Beds",
                amenities=(
                    "Private 6-metre pool and day pavilion",
                    "24-hour butler team",
                    "Complimentary return transfers",
                    "Personalised in-residence dining",
                ),
                order=3,
                image_text="Royal Kurumba Residence",
            ),
        ),
    ),
    ResortContentDefinition(
        name="Dhigufaru Island Resort",
        short_label="Dhigufaru",
        description=(
            "Intimate Baa Atoll hideaway within a protected biosphere, famed for vibrant reefs "
            "and barefoot tranquility."
        ),
        detailed_description=(
            "Dhigufaru Island Resort is tucked inside the UNESCO Biosphere Reserve of Baa Atoll. "
            "Guests snorkel with manta rays at Hanifaru Bay, kayak across turquoise shallows, or rejuvenate "
            "at the Funa Spa. The resort emphasises eco-conscious excursions, local culinary flavours, "
            "and personalised service with just 85 villas on island and over lagoon."
        ),
        highlights=(
            "Located within UNESCO Biosphere Reserve",
            "Guided excursions to Hanifaru Bay during season",
            "Boutique scale with warm Maldivian hospitality",
        ),
        gallery_labels=(
            "Biosphere Aerial",
            "Lagoon Hammocks",
            "Sunset Jetty",
        ),
        room_types=(
            RoomTypeDefinition(
                name="Beach Villa",
                description=(
                    "Serene beachfront villa with thatched roof, shaded deck, and direct access "
                    "to the island's calm lagoon."
                ),
                price_per_night=Decimal("340.00"),
                occupancy_adults=2,
                occupancy_children=2,
                bed_configuration="1 King Bed or 2 Twin Beds",
                amenities=(
                    "Private veranda with loungers",
                    "Outdoor rain shower",
                    "Complimentary snorkelling gear",
                    "Evening turndown service",
                ),
                order=1,
                image_text="Beach Villa",
            ),
            RoomTypeDefinition(
                name="Semi Water Villa",
                description=(
                    "Split-level villa extending over the lagoon with indoor lounge, sundeck hammock, "
                    "and panoramic reef views."
                ),
                price_per_night=Decimal("460.00"),
                occupancy_adults=2,
                occupancy_children=1,
                bed_configuration="1 King Bed",
                amenities=(
                    "Lagoon-facing sun deck",
                    "Glass floor viewing panel",
                    "Direct lagoon access ladder",
                    "In-room espresso bar",
                ),
                order=2,
                image_text="Semi Water Villa",
            ),
            RoomTypeDefinition(
                name="Bodhanfulhu Pool Water Villa",
                description=(
                    "Exclusive overwater villa with private infinity pool, sunset-facing deck, and "
                    "dedicated lifestyle host."
                ),
                price_per_night=Decimal("880.00"),
                occupancy_adults=3,
                occupancy_children=1,
                bed_configuration="1 King Bed + Day Bed",
                amenities=(
                    "Private infinity pool",
                    "Outdoor rain shower and bathtub",
                    "Dedicated lifestyle host",
                    "Personalised in-villa dining",
                ),
                order=3,
                image_text="Pool Water Villa",
            ),
        ),
    ),
    ResortContentDefinition(
        name="Paradise Island Resort (Nautica Collection)",
        short_label="Paradise Nautica",
        description=(
            "Iconic Maldivian playground with lively lagoon, broad dining selection, and "
            "spacious beachfront residences."
        ),
        detailed_description=(
            "Paradise Island Resort's Nautica Collection blends modern comforts with classic island fun. "
            "Guests glide across the lagoon by catamaran, sample teppanyaki and Italian favourites, and unwind "
            "at Araamu Spa's garden pavilions. Families can access a vibrant sports complex and water park, "
            "while couples seek out private sandbank dinners under the stars."
        ),
        highlights=(
            "Expansive lagoon with water sports village",
            "Araamu Spa with garden and overwater treatment rooms",
            "Extensive dining and entertainment programme",
        ),
        gallery_labels=(
            "Aerial Lagoon Arrival",
            "Oceanfront Pool",
            "Sunset Pier Dining",
        ),
        room_types=(
            RoomTypeDefinition(
                name="Beach Villa",
                description=(
                    "Light-filled villa tucked into tropical foliage with shaded deck and "
                    "direct path to the beach."
                ),
                price_per_night=Decimal("240.00"),
                occupancy_adults=2,
                occupancy_children=2,
                bed_configuration="1 King Bed or 2 Twin Beds",
                amenities=(
                    "Private veranda with loungers",
                    "Indoor-outdoor bathroom",
                    "Coffee and tea facilities",
                    "Daily housekeeping and turndown",
                ),
                order=1,
                image_text="Beach Villa",
            ),
            RoomTypeDefinition(
                name="Water Villa",
                description=(
                    "Chic overwater villa with glass floor panel, sun deck loungers, and "
                    "direct steps into the lagoon."
                ),
                price_per_night=Decimal("360.00"),
                occupancy_adults=2,
                occupancy_children=1,
                bed_configuration="1 King Bed",
                amenities=(
                    "Overwater sun deck with loungers",
                    "Glass floor living area",
                    "Direct lagoon access",
                    "Daily sunrise breakfast delivery",
                ),
                order=2,
                image_text="Water Villa",
            ),
            RoomTypeDefinition(
                name="Ocean Suite with Pool",
                description=(
                    "Two-level retreat with private lap pool, separate living pavilion, and "
                    "full sunrise to sunset vistas."
                ),
                price_per_night=Decimal("540.00"),
                occupancy_adults=3,
                occupancy_children=1,
                bed_configuration="1 King Bed + Sofa Bed",
                amenities=(
                    "Private lap pool and sun terrace",
                    "Dedicated Villa Host",
                    "Indoor-outdoor living spaces",
                    "Personalised dining experiences",
                ),
                order=3,
                image_text="Ocean Suite with Pool",
            ),
        ),
    ),
    ResortContentDefinition(
        name="Holiday Inn Resort Kandooma Maldives",
        short_label="Holiday Inn Kandooma",
        description=(
            "Family-friendly resort with a celebrated surf break, kids club adventures, and "
            "laid-back beach living."
        ),
        detailed_description=(
            "Holiday Inn Resort Kandooma Maldives balances island adventure with relaxed comforts. "
            "Catch the legendary Kandooma Right surf break, join guided snorkel safaris, or unwind at the "
            "Kandooma Spa. Families adore the Kandoo Kids Club and weekly movie nights, while food lovers "
            "sample wood-fired pizzas, Asian street food, and seafood barbecues beneath the stars."
        ),
        highlights=(
            "Home to the famed Kandooma Right surf break",
            "Kandoo Kids Club with daily supervised adventures",
            "Curated dining spanning wood-fired pizzas to seafood BBQs",
        ),
        gallery_labels=(
            "Aerial Sandbank",
            "Surf Break",
            "Family Pool",
        ),
        room_types=(
            RoomTypeDefinition(
                name="Beach House",
                description=(
                    "Two-storey beach retreat with ground-floor living area, upper-level bedroom, "
                    "and sweeping ocean views."
                ),
                price_per_night=Decimal("220.00"),
                occupancy_adults=2,
                occupancy_children=2,
                bed_configuration="1 King Bed + Sofa Bed",
                amenities=(
                    "Two-level layout with ocean terrace",
                    "Outdoor rain shower",
                    "Complimentary beach gear",
                    "Mini fridge and tea station",
                ),
                order=1,
                image_text="Beach House",
            ),
            RoomTypeDefinition(
                name="Seaview Villa",
                description=(
                    "Single-level villa elevated above the lagoon with wraparound deck, hammock, "
                    "and breezy interiors."
                ),
                price_per_night=Decimal("320.00"),
                occupancy_adults=2,
                occupancy_children=1,
                bed_configuration="1 King Bed",
                amenities=(
                    "Wraparound balcony with hammock",
                    "Indoor-outdoor bathroom",
                    "Bluetooth speaker",
                    "Complimentary snorkel equipment",
                ),
                order=2,
                image_text="Seaview Villa",
            ),
            RoomTypeDefinition(
                name="Overwater Villa",
                description=(
                    "Iconic villa perched above turquoise waters with sun deck loungers and direct "
                    "steps into the ocean."
                ),
                price_per_night=Decimal("420.00"),
                occupancy_adults=2,
                occupancy_children=1,
                bed_configuration="1 King Bed",
                amenities=(
                    "Private sun deck with loungers",
                    "Outdoor shower",
                    "Direct lagoon access",
                    "In-room espresso machine",
                ),
                order=3,
                image_text="Overwater Villa",
            ),
        ),
    ),
)


class Command(BaseCommand):
    help = (
        "Update resort descriptions, highlights, gallery placeholders, and accommodation types "
        "for curated Maldives properties."
    )

    def handle(self, *args, **options):
        updated_resorts = 0
        missing_resorts: list[str] = []

        with transaction.atomic():
            for definition in RESORT_CONTENT:
                try:
                    resort = Resort.objects.get(name=definition.name)
                except Resort.DoesNotExist:
                    missing_resorts.append(definition.name)
                    self.stdout.write(
                        self.style.WARNING(
                            f"Resort '{definition.name}' not found. Skipping content update."
                        )
                    )
                    continue

                changed_fields = self._apply_resort_updates(resort, definition)
                room_summary = self._sync_room_types(resort, definition)

                if changed_fields or room_summary["created"] or room_summary["updated"]:
                    updated_resorts += 1

                self.stdout.write(
                    self.style.SUCCESS(
                        self._format_status(definition, changed_fields, room_summary)
                    )
                )

        self.stdout.write(self.style.SUCCESS(f"Updated content for {updated_resorts} resort(s)."))

        if missing_resorts:
            self.stdout.write(
                self.style.WARNING(
                    "The following resorts were not found in the database:\n"
                    + "\n".join(f" - {name}" for name in missing_resorts)
                )
            )

    def _apply_resort_updates(
        self,
        resort: Resort,
        definition: ResortContentDefinition,
    ) -> list[str]:
        hero_placeholder = build_placeholder(
            f"{definition.short_label} Hero",
            PLACEHOLDER_HERO_SIZE,
        )
        gallery_urls = unique(
            [hero_placeholder]
            + [
                build_placeholder(f"{definition.short_label} {label}", PLACEHOLDER_HERO_SIZE)
                for label in definition.gallery_labels
            ]
            + [
                build_placeholder(
                    f"{definition.short_label} {room.image_text}",
                    PLACEHOLDER_ROOM_SIZE,
                )
                for room in definition.room_types
            ]
        )

        updates = {
            "description": definition.description,
            "detailed_description": definition.detailed_description,
            "gallery_images": list(gallery_urls),
            "featured_highlights": list(definition.highlights),
            "meta_description": definition.description,
        }

        changed_fields: list[str] = []
        for field, value in updates.items():
            if getattr(resort, field) != value:
                setattr(resort, field, value)
                changed_fields.append(field)

        if changed_fields:
            resort.save(update_fields=changed_fields)

        return changed_fields

    def _sync_room_types(
        self,
        resort: Resort,
        definition: ResortContentDefinition,
    ) -> dict[str, int]:
        created = 0
        updated = 0

        for room in definition.room_types:
            defaults = {
                "description": room.description,
                "price_per_night": room.price_per_night,
                "currency": "USD",
                "occupancy_adults": room.occupancy_adults,
                "occupancy_children": room.occupancy_children,
                "bed_configuration": room.bed_configuration,
                "amenities": list(room.amenities),
                "order": room.order,
                "is_active": True,
            }

            room_type, created_flag = ResortRoomType.objects.update_or_create(
                resort=resort,
                name=room.name,
                defaults=defaults,
            )

            if created_flag:
                created += 1
            else:
                updated += 1

        return {"created": created, "updated": updated}

    def _format_status(
        self,
        definition: ResortContentDefinition,
        changed_fields: Sequence[str],
        room_summary: dict[str, int],
    ) -> str:
        fields_part = (
            f"fields updated: {', '.join(changed_fields)}"
            if changed_fields
            else "no description fields changed"
        )
        rooms_part = (
            f"{room_summary['created']} room type(s) created, "
            f"{room_summary['updated']} updated"
        )
        return f"{definition.name}: {fields_part}; {rooms_part}."

