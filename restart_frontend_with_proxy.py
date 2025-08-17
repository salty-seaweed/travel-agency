#!/usr/bin/env python3
"""
Restart Frontend with Proxy Configuration
This script restarts the frontend with the new proxy setup
"""

import subprocess
import sys
import os
import time
import requests

def check_frontend_running():
    """Check if frontend is running"""
    try:
        response = requests.get('http://localhost:5173', timeout=5)
        return response.status_code == 200
    except:
        return False

def stop_frontend():
    """Stop the frontend process"""
    print("🛑 Stopping frontend...")
    try:
        # On Windows, we need to find and kill the npm process
        subprocess.run(['taskkill', '/f', '/im', 'node.exe'], 
                      capture_output=True, shell=True)
        time.sleep(2)
        print("✅ Frontend stopped")
    except Exception as e:
        print(f"⚠️ Could not stop frontend: {e}")

def start_frontend():
    """Start the frontend with new configuration"""
    print("🚀 Starting frontend with proxy configuration...")
    try:
        os.chdir('frontend')
        subprocess.run(['npm', 'run', 'dev'], check=True)
    except KeyboardInterrupt:
        print("\n👋 Frontend stopped")
    except subprocess.CalledProcessError as e:
        print(f"❌ Error starting frontend: {e}")

def show_proxy_info():
    """Show proxy configuration information"""
    print("\n🎉 Frontend Proxy Setup Complete!")
    print("=" * 50)
    print("\n🌐 Your Frontend URL:")
    print("   https://3bb7a02c349b.ngrok-free.app")
    print("\n🔧 Proxy Configuration:")
    print("   ✅ /api → localhost:8000 (Backend API)")
    print("   ✅ /admin → localhost:8000 (Admin Panel)")
    print("   ✅ /static → localhost:8000 (Static Files)")
    print("   ✅ /media → localhost:8000 (Media Files)")
    print("\n📱 External Access:")
    print("   🌐 Website: https://3bb7a02c349b.ngrok-free.app")
    print("   🗄️ Admin: https://3bb7a02c349b.ngrok-free.app/admin/")
    print("   📊 API: https://3bb7a02c349b.ngrok-free.app/api/")
    print("\n💡 How it works:")
    print("   1. All requests go through frontend URL")
    print("   2. Frontend proxies API calls to backend")
    print("   3. Database accessible through same URL")
    print("   4. No separate backend URL needed")

def main():
    print("🔄 Restarting Frontend with Proxy")
    print("=" * 40)
    
    # Stop current frontend
    stop_frontend()
    
    # Wait a moment
    time.sleep(3)
    
    # Start frontend with new config
    print("\n⏳ Starting frontend with proxy configuration...")
    print("💡 This will take a moment to compile...")
    
    # Start in background
    try:
        os.chdir('frontend')
        process = subprocess.Popen(['npm', 'run', 'dev'])
        
        # Wait for frontend to start
        print("⏳ Waiting for frontend to start...")
        for i in range(30):
            if check_frontend_running():
                print("✅ Frontend is running!")
                show_proxy_info()
                break
            time.sleep(1)
            print(f"⏳ Waiting... ({i+1}/30)")
        else:
            print("❌ Frontend didn't start in time")
            
    except Exception as e:
        print(f"❌ Error: {e}")

if __name__ == "__main__":
    main() 