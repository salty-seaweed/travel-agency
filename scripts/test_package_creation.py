import argparse
import json
import sys
from typing import Optional, List, Dict

import requests


def get_access_token(base_url: str, username: str, password: str) -> str:
    url = f"{base_url.rstrip('/')}/api/token/"
    resp = requests.post(url, json={"username": username, "password": password}, timeout=20)
    if resp.status_code != 200:
        raise RuntimeError(f"JWT auth failed ({resp.status_code}): {resp.text}")
    data = resp.json()
    return data.get("access") or data.get("token")


def create_package(base_url: str, token: str, payload: dict) -> requests.Response:
    url = f"{base_url.rstrip('/')}/api/packages/"
    headers = {"Authorization": f"Bearer {token}", "Content-Type": "application/json"}
    resp = requests.post(url, headers=headers, json=payload, timeout=30)
    return resp

def get_packages(base_url: str, token: str) -> requests.Response:
    url = f"{base_url.rstrip('/')}/api/packages/"
    headers = {"Authorization": f"Bearer {token}"}
    return requests.get(url, headers=headers, timeout=20)

def get_package_detail(base_url: str, token: str, package_id: int) -> requests.Response:
    url = f"{base_url.rstrip('/')}/api/packages/{package_id}/"
    headers = {"Authorization": f"Bearer {token}"}
    return requests.get(url, headers=headers, timeout=20)

def list_related(base_url: str, token: str, package_id: int) -> dict:
    headers = {"Authorization": f"Bearer {token}"}
    base = base_url.rstrip('/')
    data = {}
    endpoints = {
        "destinations": f"{base}/api/package-destinations/?package={package_id}",
        "itinerary": f"{base}/api/package-itinerary/?package={package_id}",
        "inclusions": f"{base}/api/package-inclusions/?package={package_id}",
        "activities": f"{base}/api/package-activities/?package={package_id}",
    }
    for key, url in endpoints.items():
        r = requests.get(url, headers=headers, timeout=20)
        data[key] = r.json() if r.status_code == 200 else {"error": r.status_code, "body": r.text}
    return data

def list_related_counts(base_url: str, token: str, package_id: int) -> dict:
    headers = {"Authorization": f"Bearer {token}"}
    base = base_url.rstrip('/')
    counts = {}
    r = requests.get(f"{base}/api/package-destinations/?package={package_id}", headers=headers, timeout=20)
    counts["destinations"] = len(r.json()) if r.status_code == 200 else f"err:{r.status_code}"
    r = requests.get(f"{base}/api/package-itinerary/?package={package_id}", headers=headers, timeout=20)
    counts["itinerary"] = len(r.json()) if r.status_code == 200 else f"err:{r.status_code}"
    r = requests.get(f"{base}/api/package-inclusions/?package={package_id}", headers=headers, timeout=20)
    counts["inclusions"] = len(r.json()) if r.status_code == 200 else f"err:{r.status_code}"
    r = requests.get(f"{base}/api/package-activities/?package={package_id}", headers=headers, timeout=20)
    counts["activities"] = len(r.json()) if r.status_code == 200 else f"err:{r.status_code}"
    return counts


def create_location(base_url: str, token: str, island: str = "Maafushi", atoll: str = "Kaafu",
                    latitude: float = 4.191, longitude: float = 73.489) -> int:
    url = f"{base_url.rstrip('/')}/api/locations/"
    headers = {"Authorization": f"Bearer {token}", "Content-Type": "application/json"}
    payload = {
        "island": island,
        "atoll": atoll,
        "latitude": latitude,
        "longitude": longitude,
    }
    resp = requests.post(url, headers=headers, json=payload, timeout=20)
    if resp.status_code not in (200, 201):
        raise RuntimeError(f"Create location failed: {resp.status_code} {resp.text}")
    return resp.json()["id"]


def create_package_destinations(base_url: str, token: str, package_id: int, destinations: List[Dict]) -> None:
    url = f"{base_url.rstrip('/')}/api/package-destinations/"
    headers = {"Authorization": f"Bearer {token}", "Content-Type": "application/json"}
    for d in destinations:
        payload = {
            "package": package_id,
            "location_id": d["location_id"],
            "duration": d.get("duration", 2),
            "description": d.get("description", ""),
            "highlights": d.get("highlights", []),
            "activities": d.get("activities", []),
        }
        resp = requests.post(url, headers=headers, json=payload, timeout=20)
        if resp.status_code not in (200, 201):
            raise RuntimeError(f"Create destination failed: {resp.status_code} {resp.text}")


def create_package_itinerary(base_url: str, token: str, package_id: int, items: List[Dict]) -> None:
    url = f"{base_url.rstrip('/')}/api/package-itinerary/"
    headers = {"Authorization": f"Bearer {token}", "Content-Type": "application/json"}
    for it in items:
        payload = {"package": package_id, **it}
        resp = requests.post(url, headers=headers, json=payload, timeout=20)
        if resp.status_code not in (200, 201):
            raise RuntimeError(f"Create itinerary failed: {resp.status_code} {resp.text}")


def create_package_inclusions(base_url: str, token: str, package_id: int, inclusions: List[Dict]) -> None:
    url = f"{base_url.rstrip('/')}/api/package-inclusions/"
    headers = {"Authorization": f"Bearer {token}", "Content-Type": "application/json"}
    for inc in inclusions:
        payload = {"package": package_id, **inc}
        resp = requests.post(url, headers=headers, json=payload, timeout=20)
        if resp.status_code not in (200, 201):
            raise RuntimeError(f"Create inclusion failed: {resp.status_code} {resp.text}")


def create_package_activities(base_url: str, token: str, package_id: int, activities: List[Dict]) -> None:
    url = f"{base_url.rstrip('/')}/api/package-activities/"
    headers = {"Authorization": f"Bearer {token}", "Content-Type": "application/json"}
    for act in activities:
        payload = {"package": package_id, **act}
        resp = requests.post(url, headers=headers, json=payload, timeout=20)
        if resp.status_code not in (200, 201):
            raise RuntimeError(f"Create activity failed: {resp.status_code} {resp.text}")


def main(argv: Optional[list] = None) -> int:
    parser = argparse.ArgumentParser(description="Comprehensive Package creation test via API")
    parser.add_argument("--base-url", default="http://127.0.0.1:8000", help="API base URL, e.g. http://127.0.0.1:8000")
    parser.add_argument("--username", default="lenovo", help="API username for JWT")
    parser.add_argument("--password", default="pitiri", help="API password for JWT")
    parser.add_argument("--name", default="API Test Package", help="Package name")
    parser.add_argument("--price", default="199.99", help="Package price as string")
    parser.add_argument("--duration", type=int, default=3, help="Duration in days")
    parser.add_argument("--description", default="Created by automated script.", help="Package description")
    args = parser.parse_args(argv)

    try:
        print("Authenticating...")
        access_token = get_access_token(args.base_url, args.username, args.password)
        print("Auth OK.")

        # Build comprehensive payload mirroring admin form fields
        package_payload = {
            "name": args.name,
            "description": args.description,
            "detailed_description": "Detailed itinerary, FAQs, and fine print.",
            "price": str(args.price),
            "original_price": "299.99",
            "discount_percentage": "20.00",
            "duration": args.duration,
            "is_featured": True,
            "start_date": "2025-01-10",
            "end_date": "2025-01-14",
            "category": "adventure",
            "difficulty_level": "moderate",
            "highlights": "Snorkeling\nSandbank\nSunset cruise",
            "group_size_min": 2,
            "group_size_max": 10,
            "group_size_recommended": 4,
            "accommodation_type": "Resort",
            "room_type": "Deluxe Beach Villa",
            "meal_plan": "Half Board",
            "transportation_details": "Speedboat round-trip",
            "airport_transfers": True,
            "best_time_to_visit": "Jan-Mar",
            "weather_info": "Sunny with occasional showers",
            "what_to_bring": ["Sunscreen", "Hat", "Flip-flops"],
            "important_notes": ["Non-refundable deposit", "Bring passport"],
            "seasonal_pricing_peak": "High season pricing details",
            "seasonal_pricing_off_peak": "Low season promotions",
            "seasonal_pricing_shoulder": "Shoulder season specials",
            "availability_calendar": "Available most weekdays",
            "booking_terms": "50% deposit, balance on arrival",
            "cancellation_policy": "Free cancellation up to 7 days",
            "payment_terms": "Credit card or bank transfer",
            # Images handled in view: will create PackageImage entries
            "images": [
                {"image": "package_images/demo1.jpg", "caption": "Hero shot", "order": 0, "is_featured": True},
                {"image": "package_images/demo2.jpg", "caption": "Resort view", "order": 1, "is_featured": False},
            ],
        }

        print("Creating package (base fields and images)...")
        resp = create_package(args.base_url, access_token, package_payload)
        if resp.status_code not in (200, 201):
            print("Create failed:")
            print(f"Status: {resp.status_code}")
            try:
                print(json.dumps(resp.json(), indent=2))
            except Exception:
                print(resp.text)
            # Helpful hint if method not allowed due to routing conflict
            if resp.status_code == 405:
                print("Hint: A GET-only function view may be shadowing the DRF route at /api/packages/.")
            return 2

        created = resp.json()
        print("Create success (base):")
        print(json.dumps(created, indent=2))

        package_id = created.get("id")
        if not package_id:
            print("No package id returned, cannot continue with related data.")
            return 3

        # Create a location and add destinations
        print("Creating supporting location...")
        location_id = create_location(args.base_url, access_token)
        print(f"Location id: {location_id}")

        print("Creating destinations...")
        create_package_destinations(
            args.base_url, access_token, package_id,
            destinations=[
                {"location_id": location_id, "duration": 2, "description": "Explore reefs", "highlights": ["Turtles"], "activities": ["Snorkeling"]},
            ],
        )

        # Itinerary
        print("Creating itinerary...")
        create_package_itinerary(
            args.base_url, access_token, package_id,
            items=[
                {"day": 1, "title": "Arrival & Check-in", "description": "Airport pickup and resort check-in", "activities": ["Transfer"], "meals": ["Dinner"], "accommodation": "Resort", "transportation": "Speedboat"},
                {"day": 2, "title": "Reef Adventure", "description": "Snorkel with guide", "activities": ["Snorkeling"], "meals": ["Breakfast"], "accommodation": "Resort", "transportation": "Speedboat"},
            ],
        )

        # Inclusions
        print("Creating inclusions...")
        create_package_inclusions(
            args.base_url, access_token, package_id,
            inclusions=[
                {"category": "included", "item": "Daily breakfast", "description": "Buffet", "icon": "utensils"},
                {"category": "optional", "item": "Spa treatment", "description": "Discounted rates", "icon": "spa"},
                {"category": "excluded", "item": "International flights", "description": "Not included", "icon": "plane"},
            ],
        )

        # Activities
        print("Creating activities...")
        create_package_activities(
            args.base_url, access_token, package_id,
            activities=[
                {"name": "Snorkeling Tour", "description": "Guided reef tour", "duration": "2h", "difficulty": "easy", "category": "water_sports", "included": True, "price": ""},
                {"name": "Sunset Cruise", "description": "Evening boat ride", "duration": "1.5h", "difficulty": "easy", "category": "sailing", "included": False, "price": "49.00"},
            ],
        )

        # Verify persisted fields and relations
        try:
            counts = list_related_counts(args.base_url, access_token, package_id)
            print("Related counts:", counts)
        except Exception:
            pass

        # Fetch full detail and related objects
        try:
            detail = get_package_detail(args.base_url, access_token, package_id)
            if detail.status_code == 200:
                print("Package detail:")
                print(json.dumps(detail.json(), indent=2))
        except Exception:
            pass

        try:
            related = list_related(args.base_url, access_token, package_id)
            print("Related objects:")
            print(json.dumps(related, indent=2))
        except Exception:
            pass

        print("Package created with comprehensive data successfully (see counts above).")
        return 0
    except Exception as e:
        print(f"Error: {e}")
        return 1


if __name__ == "__main__":
    sys.exit(main())


