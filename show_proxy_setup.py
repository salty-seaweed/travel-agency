#!/usr/bin/env python3
"""
Show Proxy Setup Information
This script shows the current proxy configuration and access URLs
"""

import requests
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

def check_frontend_running():
    """Check if frontend is running"""
    try:
        response = requests.get('http://localhost:5173', timeout=5)
        return response.status_code == 200
    except:
        return False

def main():
    print("🌐 Frontend Proxy Setup Status")
    print("=" * 40)
    
    # Check frontend
    if check_frontend_running():
        print("✅ Frontend is running on localhost:5173")
    else:
        print("❌ Frontend is not running")
        print("💡 Start with: cd frontend && npm run dev")
        return
    
    # Check ngrok tunnels
    tunnels = check_ngrok_tunnels()
    frontend_url = None
    
    for tunnel in tunnels:
        local_url = tunnel['config']['addr']
        if '5173' in local_url:
            frontend_url = tunnel['public_url']
            break
    
    if frontend_url:
        print(f"✅ Ngrok tunnel: {frontend_url}")
    else:
        print("❌ No frontend ngrok tunnel found")
        return
    
    print("\n🎉 Database Access Through Frontend URL!")
    print("=" * 50)
    print(f"\n🌐 Your Single URL: {frontend_url}")
    print("\n📱 External Access Points:")
    print(f"   🌐 Website: {frontend_url}")
    print(f"   🗄️ Admin Panel: {frontend_url}/admin/")
    print(f"   📊 API Base: {frontend_url}/api/")
    print(f"   📦 Properties: {frontend_url}/api/properties/")
    print(f"   📋 Packages: {frontend_url}/api/packages/")
    print("\n🔧 How It Works:")
    print("   ✅ All requests go through frontend URL")
    print("   ✅ Frontend proxies /api calls to backend")
    print("   ✅ Frontend proxies /admin calls to backend")
    print("   ✅ Database accessible through same URL")
    print("   ✅ No separate backend URL needed")
    print("\n💡 Test Your Setup:")
    print("   1. Open website: " + frontend_url)
    print("   2. Test packages loading")
    print("   3. Access admin: " + frontend_url + "/admin/")
    print("   4. Share single URL with others")

if __name__ == "__main__":
    main() 