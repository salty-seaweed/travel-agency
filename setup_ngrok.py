#!/usr/bin/env python3
"""
Ngrok Setup Script for Travel Agency
This script helps you configure ngrok authentication
"""

import subprocess
import sys
import os

def check_ngrok_installed():
    """Check if ngrok is installed"""
    try:
        result = subprocess.run(['ngrok', 'version'], capture_output=True, text=True)
        if result.returncode == 0:
            print("✅ Ngrok is installed")
            return True
        else:
            print("❌ Ngrok is not installed or not in PATH")
            return False
    except FileNotFoundError:
        print("❌ Ngrok is not installed")
        return False

def get_auth_token():
    """Get ngrok auth token from user"""
    print("\n🔑 Ngrok Authentication Setup")
    print("=" * 40)
    
    print("\n📋 To get your ngrok auth token:")
    print("1. Go to https://ngrok.com/")
    print("2. Sign up for a free account")
    print("3. Go to https://dashboard.ngrok.com/get-started/your-authtoken")
    print("4. Copy your auth token")
    
    token = input("\n🔑 Enter your ngrok auth token: ").strip()
    
    if not token:
        print("❌ No token provided")
        return False
    
    if len(token) < 20:
        print("❌ Token seems too short. Please check your token")
        return False
    
    return token

def configure_ngrok(token):
    """Configure ngrok with the auth token"""
    try:
        print(f"\n🔧 Configuring ngrok with your auth token...")
        result = subprocess.run([
            'ngrok', 'config', 'add-authtoken', token
        ], capture_output=True, text=True)
        
        if result.returncode == 0:
            print("✅ Ngrok configured successfully!")
            return True
        else:
            print(f"❌ Error configuring ngrok: {result.stderr}")
            return False
            
    except Exception as e:
        print(f"❌ Error: {e}")
        return False

def test_ngrok():
    """Test if ngrok is working"""
    try:
        print("\n🧪 Testing ngrok configuration...")
        result = subprocess.run(['ngrok', 'version'], capture_output=True, text=True)
        
        if result.returncode == 0:
            print("✅ Ngrok is working correctly!")
            return True
        else:
            print("❌ Ngrok test failed")
            return False
            
    except Exception as e:
        print(f"❌ Error testing ngrok: {e}")
        return False

def show_next_steps():
    """Show next steps after configuration"""
    print("\n🎉 Ngrok Setup Complete!")
    print("=" * 30)
    print("\n📋 Next steps:")
    print("1. Start Django server: python manage.py runserver 0.0.0.0:8000")
    print("2. Start ngrok tunnel: ngrok http 8000")
    print("3. Use the ngrok URL to access from external devices")
    print("\n💡 Quick commands:")
    print("   # Terminal 1: Django")
    print("   python manage.py runserver 0.0.0.0:8000")
    print("   ")
    print("   # Terminal 2: Ngrok")
    print("   ngrok http 8000")
    print("   ")
    print("   # Terminal 3: Frontend (optional)")
    print("   cd frontend")
    print("   npm run dev")

def main():
    print("🌐 Travel Agency - Ngrok Setup")
    print("=" * 40)
    
    # Check if ngrok is installed
    if not check_ngrok_installed():
        print("\n📦 To install ngrok:")
        print("1. Go to https://ngrok.com/")
        print("2. Download for your platform")
        print("3. Extract and add to your PATH")
        print("4. Run this script again")
        return
    
    # Get auth token
    token = get_auth_token()
    if not token:
        return
    
    # Configure ngrok
    if configure_ngrok(token):
        # Test configuration
        if test_ngrok():
            show_next_steps()
        else:
            print("❌ Ngrok configuration test failed")
    else:
        print("❌ Failed to configure ngrok")

if __name__ == "__main__":
    main() 