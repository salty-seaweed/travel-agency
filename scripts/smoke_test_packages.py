import os
import sys
import json
import time
from typing import Any, Dict, List, Optional

import requests


BASE_URL = os.environ.get("API_BASE_URL", "http://127.0.0.1:8001/api")

# Direct credentials (requested):
USERNAME = os.environ.get("API_USERNAME", "lenovo")
PASSWORD = os.environ.get("API_PASSWORD", "pitiri")

TOKEN: Optional[str] = None  # Will be fetched via /token/


def h(endpoint: str) -> str:
    if endpoint.startswith("http"):
        return endpoint
    return f"{BASE_URL.rstrip('/')}/{endpoint.lstrip('/')}"


def headers() -> Dict[str, str]:
    hdrs = {"Content-Type": "application/json"}
    if TOKEN:
        hdrs["Authorization"] = f"Bearer {TOKEN}"
    return hdrs


def fail(msg: str) -> None:
    print(f"FAIL: {msg}")
    sys.exit(1)


def get_first_location_id() -> int:
    r = requests.get(h("/locations/"), headers=headers(), timeout=15)
    if r.status_code != 200:
        fail(f"GET /locations/ -> {r.status_code} {r.text}")
    data = r.json()
    if isinstance(data, dict) and "results" in data:
        items = data.get("results", [])
    else:
        items = data
    if not items:
        fail("No locations available to attach to package destinations")
    return items[0]["id"]


def authenticate() -> None:
    global TOKEN
    # Common JWT obtain endpoint
    url = h("/token/")
    resp = requests.post(url, headers={"Content-Type": "application/json"},
                         data=json.dumps({"username": USERNAME, "password": PASSWORD}), timeout=15)
    if resp.status_code not in (200, 201):
        fail(f"POST /token/ -> {resp.status_code} {resp.text}")
    data = resp.json()
    TOKEN = data.get("access") or data.get("token")
    if not TOKEN:
        fail("Auth response missing 'access' token")


def create_package(location_id: int) -> Dict[str, Any]:
    payload = {
        "name": "Smoke Test Package",
        "description": "Initial description",
        "detailed_description": "Details",
        "price": 999.99,
        "duration": 3,
        "group_size_min": 1,
        "group_size_max": 4,
        "group_size_recommended": 2,
        "category": "test",
        "difficulty_level": "easy",
        "destination_data": [
            {
                "location_id": location_id,
                "duration": 2,
                "description": "Stay",
                "highlights": ["Beach", "Sunset"],
                "activities": ["Swimming"]
            }
        ],
        "itinerary_data": [
            {
                "day": 1,
                "title": "Arrival",
                "description": "Check-in",
                "activities": ["Welcome"],
                "meals": ["Dinner"],
                "accommodation": "Hotel",
                "transportation": "Speedboat"
            }
        ],
        "inclusions_data": [
            {"category": "included", "item": "Breakfast"},
            {"category": "optional", "item": "Spa"}
        ],
        "activities_data": [
            {
                "name": "Snorkeling",
                "description": "Reef visit",
                "duration": "2h",
                "difficulty": "easy",
                "category": "water",
                "included": True,
                "price": ""
            }
        ],
    }
    r = requests.post(h("/packages/"), headers=headers(), data=json.dumps(payload), timeout=30)
    if r.status_code not in (200, 201):
        fail(f"POST /packages/ -> {r.status_code} {r.text}")
    data = r.json()
    # Some serializers may not include nested write results in immediate response; fetch to verify
    pkg_id = data.get("id")
    if pkg_id:
        return fetch_package(pkg_id)
    return data


def fetch_package(pkg_id: int) -> Dict[str, Any]:
    r = requests.get(h(f"/packages/{pkg_id}/"), headers=headers(), timeout=15)
    if r.status_code != 200:
        fail(f"GET /packages/{pkg_id}/ -> {r.status_code} {r.text}")
    return r.json()


def update_package(pkg_id: int, location_id: int) -> Dict[str, Any]:
    payload = {
        "name": "Smoke Test Package (Updated)",
        "description": "Updated description",
        "price": 799.50,
        "duration": 4,
        "destination_data": [
            {
                "location_id": location_id,
                "duration": 3,
                "description": "Extended stay",
                "highlights": ["Lagoon"],
                "activities": ["Kayak"]
            }
        ],
        "itinerary_data": [
            {"day": 1, "title": "Arrival (Updated)", "description": "Check-in + Tour", "activities": ["Tour"], "meals": ["Lunch"]},
            {"day": 2, "title": "Excursion", "description": "Boat trip", "activities": ["Boat"], "meals": ["Dinner"]},
        ],
        "inclusions_data": [
            {"category": "included", "item": "Breakfast"},
            {"category": "included", "item": "Airport Transfer"}
        ],
        "activities_data": [
            {"name": "Snorkeling (Updated)", "description": "New Reef", "duration": "3h", "difficulty": "easy", "category": "water", "included": True, "price": ""},
            {"name": "Fishing", "description": "Sunset", "duration": "2h", "difficulty": "moderate", "category": "boat", "included": False, "price": "120"}
        ],
    }
    r = requests.put(h(f"/packages/{pkg_id}/"), headers=headers(), data=json.dumps(payload), timeout=30)
    if r.status_code not in (200, 202):
        fail(f"PUT /packages/{pkg_id}/ -> {r.status_code} {r.text}")
    return r.json()


def main() -> None:
    print(f"Using API base: {BASE_URL}")
    print(f"Authenticating as {USERNAME}...")
    authenticate()
    loc_id = get_first_location_id()
    print(f"Location id: {loc_id}")

    created = create_package(loc_id)
    pkg_id = created.get("id")
    if not pkg_id:
        fail("Created package missing id")
    print(f"Created package id: {pkg_id}")

    fetched = fetch_package(pkg_id)
    if fetched.get("name") != "Smoke Test Package":
        fail("Created package name mismatch")
    # allow slight delay for relational writes on slower backends
    if not fetched.get("destinations"):
        time.sleep(0.3)
        fetched = fetch_package(pkg_id)
        if not fetched.get("destinations"):
            fail("Created package missing destinations")
    if not fetched.get("itinerary"):
        fail("Created package missing itinerary")
    if not fetched.get("inclusions"):
        fail("Created package missing inclusions")
    if not fetched.get("activities"):
        fail("Created package missing activities")
    print("Create verification passed")

    updated = update_package(pkg_id, loc_id)
    if updated.get("name") != "Smoke Test Package (Updated)":
        fail("Updated package name mismatch")

    # Small delay for relational writes to reflect if needed
    time.sleep(0.5)
    fetched2 = fetch_package(pkg_id)
    if fetched2.get("name") != "Smoke Test Package (Updated)":
        fail("Fetch after update: name mismatch")
    if len(fetched2.get("itinerary", [])) < 2:
        fail("Fetch after update: itinerary not replaced correctly")
    if len(fetched2.get("inclusions", [])) < 2:
        fail("Fetch after update: inclusions not replaced correctly")
    if len(fetched2.get("activities", [])) < 2:
        fail("Fetch after update: activities not replaced correctly")

    print("PASS: Package create/update including destinations, itinerary, inclusions, activities")


if __name__ == "__main__":
    try:
        main()
    except Exception as e:
        fail(str(e))


