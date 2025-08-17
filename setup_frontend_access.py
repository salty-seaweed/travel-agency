#!/usr/bin/env python3
"""
Frontend External Access Setup
This script helps you set up ngrok for frontend access and update API configuration
"""

import subprocess
import sys
import os
import requests
import json
import re

def check_frontend_running():
    """Check if frontend is running on port 5173"""
    try:
        response = requests.get('http://localhost:5173', timeout=5)
        if response.status_code == 200:
            print("✅ Frontend is running on localhost:5173")
            return True
        else:
            print(f"⚠️ Frontend responded with status: {response.status_code}")
            return False
    except requests.exceptions.ConnectionError:
        print("❌ Frontend is not running on localhost:5173")
        print("💡 Start frontend with: cd frontend && npm run dev")
        return False
    except Exception as e:
        print(f"❌ Error checking frontend: {e}")
        return False

def get_ngrok_url():
    """Get the current ngrok URL"""
    try:
        response = requests.get('http://localhost:4040/api/tunnels', timeout=5)
        if response.status_code == 200:
            tunnels = response.json()['tunnels']
            if tunnels:
                return tunnels[0]['public_url']
    except:
        pass
    return None

def update_frontend_api_config(ngrok_url):
    """Update frontend API configuration to use ngrok URL"""
    api_file = "frontend/src/services/api.ts"
    
    if not os.path.exists(api_file):
        print(f"❌ API configuration file not found: {api_file}")
        return False
    
    try:
        with open(api_file, 'r') as f:
            content = f.read()
        
        # Replace localhost URLs with ngrok URL
        new_content = content.replace(
            'http://localhost:8000',
            ngrok_url
        )
        
        with open(api_file, 'w') as f:
            f.write(new_content)
        
        print(f"✅ Updated frontend API configuration to use: {ngrok_url}")
        return True
    except Exception as e:
        print(f"❌ Error updating API configuration: {e}")
        return False

def show_access_info(ngrok_url):
    """Show access information"""
    print("\n🎉 Frontend External Access Setup Complete!")
    print("=" * 50)
    print(f"\n🌐 Your Public URL: {ngrok_url}")
    print("\n📱 External Device Access:")
    print(f"   Share this URL: {ngrok_url}")
    print("   Works on any device with internet connection")
    print("\n🔧 What's Included:")
    print("   ✅ Complete website access")
    print("   ✅ All frontend features")
    print("   ✅ API communication via ngrok")
    print("   ✅ Database access through frontend")
    print("\n💡 How it works:")
    print("   1. Frontend runs on localhost:5173")
    print("   2. Ngrok tunnels port 5173 to public URL")
    print("   3. Frontend communicates with backend via ngrok")
    print("   4. All features work from external devices")

def main():
    print("🌐 Frontend External Access Setup")
    print("=" * 40)
    
    # Check if frontend is running
    if not check_frontend_running():
        print("\n📋 To start frontend:")
        print("1. cd frontend")
        print("2. npm run dev")
        print("3. Run this script again")
        return
    
    # Get ngrok URL
    ngrok_url = get_ngrok_url()
    if not ngrok_url:
        print("\n❌ No ngrok tunnel found")
        print("💡 Start ngrok with: ngrok http 5173")
        return
    
    print(f"\n✅ Found ngrok tunnel: {ngrok_url}")
    
    # Update frontend configuration
    if update_frontend_api_config(ngrok_url):
        show_access_info(ngrok_url)
    else:
        print("❌ Failed to update frontend configuration")

if __name__ == "__main__":
    main() 