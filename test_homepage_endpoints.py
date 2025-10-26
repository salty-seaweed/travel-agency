#!/usr/bin/env python
"""
Test script for homepage endpoints
"""
import requests
import json
import os
import sys

# Add the api directory to the Python path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'api'))

def test_homepage_bulk_update():
    """Test the homepage bulk_update endpoint"""
    url = 'http://localhost:8001/api/homepage/bulk_update/'

    # Test data for homepage update
    test_data = {
        'hero': {
            'title': 'Test Hero Title',
            'subtitle': 'Test Hero Subtitle',
            'description': 'Test hero description',
            'cta_primary_text': 'Get Started',
            'cta_primary_url': '#',
            'cta_secondary_text': 'Learn More',
            'cta_secondary_url': '#',
            'is_active': True
        }
    }

    headers = {
        'Content-Type': 'application/json',
        # Note: You'll need to replace this with a valid token
        # 'Authorization': 'Bearer YOUR_TOKEN_HERE'
    }

    try:
        print(f"Testing endpoint: {url}")
        print(f"Sending data: {json.dumps(test_data, indent=2)}")

        # First test without authentication to see the error
        response = requests.post(url, json=test_data, headers=headers)

        print(f"Status Code: {response.status_code}")
        print(f"Response Headers: {dict(response.headers)}")

        if response.status_code == 401:
            print("✓ Endpoint exists but requires authentication (expected)")
        elif response.status_code == 200:
            print("✓ Endpoint is working!")
            print(f"Response: {response.json()}")
        else:
            print(f"✗ Unexpected status code: {response.status_code}")
            try:
                print(f"Response: {response.json()}")
            except:
                print(f"Response (text): {response.text}")

    except requests.exceptions.ConnectionError:
        print("✗ Cannot connect to server. Make sure Django is running on port 8001")
    except Exception as e:
        print(f"✗ Error: {e}")

def test_homepage_public_content():
    """Test the homepage public content endpoint"""
    url = 'http://localhost:8001/api/homepage/public/'

    try:
        print(f"\nTesting public content endpoint: {url}")
        response = requests.get(url)

        print(f"Status Code: {response.status_code}")

        if response.status_code == 200:
            print("✓ Public content endpoint is working!")
            data = response.json()
            print("Available sections:")
            for section in data.keys():
                print(f"  - {section}")
        else:
            print(f"✗ Unexpected status code: {response.status_code}")
            print(f"Response: {response.text}")

    except requests.exceptions.ConnectionError:
        print("✗ Cannot connect to server. Make sure Django is running on port 8001")
    except Exception as e:
        print(f"✗ Error: {e}")

if __name__ == '__main__':
    print("Homepage Endpoints Test")
    print("=" * 50)

    test_homepage_bulk_update()
    test_homepage_public_content()

    print("\n" + "=" * 50)
    print("Test completed!")
    print("\nTo fully test image upload functionality:")
    print("1. Start your Django server: python manage.py runserver")
    print("2. Start your frontend: cd frontend && npm run dev")
    print("3. Go to the homepage admin section")
    print("4. Try uploading hero images - they should now work!")
    print("\nNote: Make sure you have a valid authentication token for the bulk_update endpoint")
