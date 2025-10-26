#!/usr/bin/env python3
"""
External Access Setup Script
This script helps you start both frontend and backend with ngrok tunnels
"""

import subprocess
import sys
import os
import time
import requests
import json

def check_ngrok_status():
    """Check current ngrok tunnels"""
    try:
        response = requests.get('http://localhost:4040/api/tunnels', timeout=5)
        if response.status_code == 200:
            tunnels = response.json()['tunnels']
            return tunnels
        return []
    except:
        return []

def start_django_server():
    """Start Django server"""
    print("🚀 Starting Django server on 0.0.0.0:8000...")
    try:
        subprocess.run([
            sys.executable, 'manage.py', 'runserver', '0.0.0.0:8000'
        ], check=True)
    except KeyboardInterrupt:
        print("\n👋 Django server stopped")
    except subprocess.CalledProcessError as e:
        print(f"❌ Error starting Django server: {e}")

def start_frontend():
    """Start frontend development server"""
    print("🚀 Starting frontend on localhost:5173...")
    try:
        os.chdir('frontend')
        subprocess.run(['npm', 'run', 'dev'], check=True)
    except KeyboardInterrupt:
        print("\n👋 Frontend server stopped")
    except subprocess.CalledProcessError as e:
        print(f"❌ Error starting frontend: {e}")

def show_tunnel_info():
    """Show current tunnel information"""
    tunnels = check_ngrok_status()
    
    if tunnels:
        print("\n🌐 Current Ngrok Tunnels:")
        print("=" * 40)
        
        for tunnel in tunnels:
            public_url = tunnel['public_url']
            local_url = tunnel['config']['addr']
            
            print(f"🌐 Public URL: {public_url}")
            print(f"🔗 Local URL: {local_url}")
            print(f"📡 Protocol: {tunnel['proto']}")
            print()
            
            # Show specific access URLs based on port
            if '5173' in local_url:
                print("📱 Frontend Access:")
                print(f"   Website: {public_url}")
                print(f"   Share this URL for external access")
                print()
            elif '8000' in local_url:
                print("🗄️ Backend Access:")
                print(f"   API Base: {public_url}")
                print(f"   Admin Panel: {public_url}/admin/")
                print(f"   Properties API: {public_url}/api/properties/")
                print(f"   Packages API: {public_url}/api/packages/")
                print()
    else:
        print("❌ No ngrok tunnels found")
        print("💡 Start ngrok with: ngrok http 5173 (for frontend)")
        print("💡 Or: ngrok http 8000 (for backend)")

def main():
    print("🌐 Travel Agency - External Access Setup")
    print("=" * 50)
    
    print("\n📋 Available options:")
    print("1. Start Django server (backend)")
    print("2. Start frontend server")
    print("3. Show current tunnel status")
    print("4. Exit")
    
    while True:
        choice = input("\nEnter choice (1-4): ").strip()
        
        if choice == '1':
            start_django_server()
        elif choice == '2':
            start_frontend()
        elif choice == '3':
            show_tunnel_info()
        elif choice == '4':
            print("👋 Goodbye!")
            break
        else:
            print("❌ Invalid choice")

if __name__ == "__main__":
    main() 