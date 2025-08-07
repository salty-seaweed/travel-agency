#!/usr/bin/env python3
"""
Dual Tunnel Setup Script
This script sets up both frontend and backend ngrok tunnels
"""

import subprocess
import sys
import os
import requests
import json
import time

def check_ngrok_tunnels():
    """Check current ngrok tunnels"""
    try:
        response = requests.get('http://localhost:4040/api/tunnels', timeout=5)
        if response.status_code == 200:
            tunnels = response.json()['tunnels']
            return tunnels
        return []
    except:
        return []

def get_tunnel_urls():
    """Get both frontend and backend tunnel URLs"""
    tunnels = check_ngrok_tunnels()
    
    frontend_url = None
    backend_url = None
    
    for tunnel in tunnels:
        local_url = tunnel['config']['addr']
        public_url = tunnel['public_url']
        
        if '5173' in local_url:
            frontend_url = public_url
        elif '8000' in local_url:
            backend_url = public_url
    
    return frontend_url, backend_url

def update_frontend_api_config(backend_url):
    """Update frontend API configuration to use backend ngrok URL"""
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
            backend_url
        )
        
        with open(api_file, 'w') as f:
            f.write(new_content)
        
        print(f"✅ Updated frontend API configuration to use: {backend_url}")
        return True
    except Exception as e:
        print(f"❌ Error updating API configuration: {e}")
        return False

def show_access_info(frontend_url, backend_url):
    """Show access information"""
    print("\n🎉 Dual Tunnel Setup Complete!")
    print("=" * 50)
    print(f"\n🌐 Frontend URL: {frontend_url}")
    print(f"🗄️ Backend URL: {backend_url}")
    print("\n📱 External Device Access:")
    print(f"   Website: {frontend_url}")
    print(f"   API Base: {backend_url}")
    print(f"   Admin Panel: {backend_url}/admin/")
    print("\n🔧 What's Included:")
    print("   ✅ Complete website access")
    print("   ✅ Direct API access")
    print("   ✅ Database access through admin")
    print("   ✅ All frontend features")
    print("   ✅ Package loading and booking")
    print("\n💡 How it works:")
    print("   1. Frontend tunnel: localhost:5173 → Public URL")
    print("   2. Backend tunnel: localhost:8000 → Public URL")
    print("   3. Frontend communicates with backend via ngrok")
    print("   4. All API calls work from external devices")

def wait_for_tunnels():
    """Wait for both tunnels to be available"""
    print("⏳ Waiting for ngrok tunnels to start...")
    
    for i in range(30):  # Wait up to 30 seconds
        tunnels = check_ngrok_tunnels()
        if len(tunnels) >= 2:
            print("✅ Both tunnels are ready!")
            return True
        
        print(f"⏳ Waiting... ({i+1}/30)")
        time.sleep(1)
    
    print("❌ Timeout waiting for tunnels")
    return False

def main():
    print("🌐 Dual Tunnel Setup")
    print("=" * 30)
    
    # Wait for tunnels to start
    if not wait_for_tunnels():
        return
    
    # Get tunnel URLs
    frontend_url, backend_url = get_tunnel_urls()
    
    if not frontend_url or not backend_url:
        print("❌ Could not get both tunnel URLs")
        print("💡 Make sure ngrok is running with: ngrok start --all --config ngrok.yml")
        return
    
    print(f"\n✅ Frontend tunnel: {frontend_url}")
    print(f"✅ Backend tunnel: {backend_url}")
    
    # Update frontend configuration
    if update_frontend_api_config(backend_url):
        show_access_info(frontend_url, backend_url)
    else:
        print("❌ Failed to update frontend configuration")

if __name__ == "__main__":
    main() 