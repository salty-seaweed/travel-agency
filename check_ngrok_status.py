#!/usr/bin/env python3
"""
Check Ngrok Status Script
This script helps you check if ngrok is running and get the public URL
"""

import requests
import json
import time

def check_ngrok_status():
    """Check if ngrok is running and get tunnel information"""
    try:
        # Try to get tunnel information from ngrok API
        response = requests.get('http://localhost:4040/api/tunnels', timeout=5)
        
        if response.status_code == 200:
            tunnels = response.json()['tunnels']
            
            if tunnels:
                print("✅ Ngrok is running!")
                print("=" * 40)
                
                for tunnel in tunnels:
                    print(f"🌐 Public URL: {tunnel['public_url']}")
                    print(f"📡 Protocol: {tunnel['proto']}")
                    print(f"🔗 Local URL: {tunnel['config']['addr']}")
                    print(f"📊 Status: {tunnel['status']}")
                    print()
                
                # Show access URLs
                public_url = tunnels[0]['public_url']
                print("🚀 Access URLs:")
                print(f"   Backend API: {public_url}")
                print(f"   Django Admin: {public_url}/admin/")
                print(f"   API Properties: {public_url}/api/properties/")
                print(f"   API Packages: {public_url}/api/packages/")
                print()
                
                print("📱 External Device Access:")
                print(f"   Share this URL: {public_url}")
                print("   Works on any device with internet connection")
                print()
                
                return True
            else:
                print("❌ No tunnels found")
                return False
        else:
            print(f"❌ Error getting tunnel info: {response.status_code}")
            return False
            
    except requests.exceptions.ConnectionError:
        print("❌ Ngrok is not running")
        print("💡 Start ngrok with: ngrok http 8000")
        return False
    except Exception as e:
        print(f"❌ Error: {e}")
        return False

def check_django_server():
    """Check if Django server is running"""
    try:
        response = requests.get('http://localhost:8000/api/properties/', timeout=5)
        if response.status_code == 200:
            print("✅ Django server is running on localhost:8000")
            return True
        else:
            print(f"⚠️ Django server responded with status: {response.status_code}")
            return False
    except requests.exceptions.ConnectionError:
        print("❌ Django server is not running")
        print("💡 Start Django with: python manage.py runserver 0.0.0.0:8000")
        return False
    except Exception as e:
        print(f"❌ Error checking Django: {e}")
        return False

def main():
    print("🌐 Travel Agency - External Access Status")
    print("=" * 50)
    
    # Check Django server
    django_ok = check_django_server()
    print()
    
    # Check ngrok
    ngrok_ok = check_ngrok_status()
    
    if django_ok and ngrok_ok:
        print("🎉 Everything is working!")
        print("You can now access your website from external devices.")
    else:
        print("\n🔧 Setup Instructions:")
        print("1. Start Django: python manage.py runserver 0.0.0.0:8000")
        print("2. Start ngrok: ngrok http 8000")
        print("3. Run this script again to check status")

if __name__ == "__main__":
    main() 