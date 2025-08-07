#!/usr/bin/env python3
"""
Ngrok setup script for Travel Agency project
This script helps you start ngrok and configure external access to your Django backend
"""

import subprocess
import sys
import os
import requests
import json
from pathlib import Path

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

def install_ngrok():
    """Provide instructions to install ngrok"""
    print("\n📦 To install ngrok:")
    print("1. Go to https://ngrok.com/")
    print("2. Sign up for a free account")
    print("3. Download ngrok for your platform")
    print("4. Extract and add to your PATH")
    print("5. Run: ngrok config add-authtoken YOUR_TOKEN")

def start_django_server():
    """Start Django server on all interfaces"""
    print("\n🚀 Starting Django server on 0.0.0.0:8000...")
    try:
        subprocess.run([
            sys.executable, 'manage.py', 'runserver', '0.0.0.0:8000'
        ], check=True)
    except KeyboardInterrupt:
        print("\n👋 Django server stopped")
    except subprocess.CalledProcessError as e:
        print(f"❌ Error starting Django server: {e}")

def start_ngrok_tunnel():
    """Start ngrok tunnel to Django server"""
    print("\n🌐 Starting ngrok tunnel...")
    try:
        subprocess.run([
            'ngrok', 'http', '8000'
        ], check=True)
    except KeyboardInterrupt:
        print("\n👋 Ngrok tunnel stopped")
    except subprocess.CalledProcessError as e:
        print(f"❌ Error starting ngrok: {e}")

def get_ngrok_url():
    """Get the ngrok public URL"""
    try:
        response = requests.get('http://localhost:4040/api/tunnels')
        if response.status_code == 200:
            tunnels = response.json()['tunnels']
            if tunnels:
                return tunnels[0]['public_url']
    except:
        pass
    return None

def update_frontend_config():
    """Update frontend API configuration for ngrok URL"""
    ngrok_url = get_ngrok_url()
    if ngrok_url:
        print(f"\n🔗 Ngrok URL: {ngrok_url}")
        print(f"📝 Update your frontend API configuration to use: {ngrok_url}")
        
        # Update the API service file
        api_service_file = Path("frontend/src/services/api.ts")
        if api_service_file.exists():
            print("\n📝 Updating frontend API configuration...")
            with open(api_service_file, 'r') as f:
                content = f.read()
            
            # Replace localhost URLs with ngrok URL
            new_content = content.replace(
                'http://localhost:8000',
                ngrok_url
            )
            
            with open(api_service_file, 'w') as f:
                f.write(new_content)
            
            print("✅ Frontend API configuration updated")
        else:
            print("⚠️  Could not find frontend API configuration file")
    else:
        print("❌ Could not get ngrok URL")

def main():
    print("🌐 Travel Agency - Ngrok Setup")
    print("=" * 40)
    
    if not check_ngrok_installed():
        install_ngrok()
        return
    
    print("\n📋 Instructions for external access:")
    print("1. Start Django server: python manage.py runserver 0.0.0.0:8000")
    print("2. Start ngrok: ngrok http 8000")
    print("3. Use the ngrok URL to access your API from external devices")
    print("4. Update frontend API configuration with the ngrok URL")
    
    choice = input("\nChoose an option:\n1. Start Django server\n2. Start ngrok tunnel\n3. Update frontend config\n4. Exit\nEnter choice (1-4): ")
    
    if choice == '1':
        start_django_server()
    elif choice == '2':
        start_ngrok_tunnel()
    elif choice == '3':
        update_frontend_config()
    elif choice == '4':
        print("👋 Goodbye!")
    else:
        print("❌ Invalid choice")

if __name__ == "__main__":
    main() 