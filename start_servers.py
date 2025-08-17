#!/usr/bin/env python3
"""
Script to start both Django and Frontend servers
"""
import subprocess
import sys
import os
import time
from pathlib import Path

def run_command(command, cwd=None, shell=True):
    """Run a command and return the process"""
    print(f"Running: {command}")
    if cwd:
        print(f"Working directory: {cwd}")
    
    process = subprocess.Popen(
        command,
        cwd=cwd,
        shell=shell,
        stdout=subprocess.PIPE,
        stderr=subprocess.STDOUT,
        universal_newlines=True,
        bufsize=1
    )
    return process

def main():
    # Get the project root directory
    project_root = Path(__file__).parent.absolute()
    frontend_dir = project_root / "frontend"
    
    print("🚀 Starting Travel Agency Servers...")
    print(f"Project root: {project_root}")
    print(f"Frontend directory: {frontend_dir}")
    
    # Check if .env file exists, if not create from example
    env_file = project_root / ".env"
    env_example = project_root / "env.example"
    
    if not env_file.exists() and env_example.exists():
        print("📝 Creating .env file from env.example...")
        with open(env_example, 'r') as f:
            content = f.read()
        with open(env_file, 'w') as f:
            f.write(content)
        print("✅ .env file created")
    
    # Check if frontend .env file exists
    frontend_env_file = frontend_dir / ".env"
    frontend_env_example = frontend_dir / "env.example"
    
    if not frontend_env_file.exists() and frontend_env_example.exists():
        print("📝 Creating frontend .env file from env.example...")
        with open(frontend_env_example, 'r') as f:
            content = f.read()
        with open(frontend_env_file, 'w') as f:
            f.write(content)
        print("✅ Frontend .env file created")
    
    # Start Django server on port 8001
    print("\n🐍 Starting Django server on port 8001...")
    django_process = run_command(
        "python manage.py runserver 8001",
        cwd=project_root
    )
    
    # Wait a moment for Django to start
    time.sleep(3)
    
    # Start Frontend server on port 5174
    print("\n⚛️  Starting Frontend server on port 5174...")
    frontend_process = run_command(
        "npm run dev",
        cwd=frontend_dir
    )
    
    print("\n🎉 Both servers are starting...")
    print("📱 Frontend: http://localhost:5174")
    print("🔧 Backend API: http://localhost:8001/api")
    print("🔧 Django Admin: http://localhost:8001/admin")
    print("\nPress Ctrl+C to stop both servers")
    
    try:
        # Wait for both processes
        django_process.wait()
        frontend_process.wait()
    except KeyboardInterrupt:
        print("\n🛑 Stopping servers...")
        django_process.terminate()
        frontend_process.terminate()
        print("✅ Servers stopped")

if __name__ == "__main__":
    main() 