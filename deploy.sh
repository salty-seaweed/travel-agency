#!/bin/bash

# Travel Agency Deployment Script
# This script helps prepare your application for deployment

echo "🚀 Travel Agency Deployment Preparation"
echo "======================================"

# Check if git is initialized
if [ ! -d ".git" ]; then
    echo "❌ Git repository not found. Please initialize git first:"
    echo "   git init"
    echo "   git add ."
    echo "   git commit -m 'Initial commit'"
    exit 1
fi

# Generate secret key
echo "🔑 Generating Django secret key..."
SECRET_KEY=$(python -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())")
echo "✅ Secret key generated: $SECRET_KEY"

# Create .env file if it doesn't exist
if [ ! -f ".env" ]; then
    echo "📝 Creating .env file..."
    cat > .env << EOF
# Django Settings
DEBUG=False
SECRET_KEY=$SECRET_KEY

# Database Settings (for PostgreSQL)
DB_ENGINE=django.db.backends.postgresql
DB_NAME=your_database_name
DB_USER=your_database_user
DB_PASSWORD=your_database_password
DB_HOST=your_database_host
DB_PORT=5432

# Frontend URL (for CORS)
FRONTEND_URL=https://your-frontend-domain.com

# API URL for frontend
VITE_API_URL=https://your-backend-domain.com
EOF
    echo "✅ .env file created"
else
    echo "ℹ️  .env file already exists"
fi

# Check if all required files exist
echo "📋 Checking deployment files..."
files=("Procfile" "railway.json" "requirements.txt" "travel_agency/settings_production.py")
for file in "${files[@]}"; do
    if [ -f "$file" ]; then
        echo "✅ $file exists"
    else
        echo "❌ $file missing"
    fi
done

# Build frontend
echo "🔨 Building frontend..."
cd frontend
npm install
npm run build
cd ..

echo ""
echo "🎉 Deployment preparation complete!"
echo ""
echo "📚 Next steps:"
echo "1. Push your code to GitHub:"
echo "   git add ."
echo "   git commit -m 'Prepare for deployment'"
echo "   git push origin master"
echo ""
echo "2. Deploy to Railway:"
echo "   - Go to https://railway.app"
echo "   - Create new project from GitHub"
echo "   - Add PostgreSQL database"
echo "   - Set environment variables"
echo ""
echo "3. Deploy frontend to Vercel:"
echo "   - Go to https://vercel.com"
echo "   - Import your repository"
echo "   - Set root directory to 'frontend'"
echo "   - Set VITE_API_URL environment variable"
echo ""
echo "📖 See DEPLOYMENT_GUIDE.md for detailed instructions"
