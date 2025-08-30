#!/bin/bash

# Production Deployment Script for Travel Agency Website
# This script automates the deployment process

set -e  # Exit on any error

echo "🚀 Starting Production Deployment..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if required files exist
check_requirements() {
    print_status "Checking deployment requirements..."
    
    if [ ! -f "env.production" ]; then
        print_error "env.production file not found! Please create it from env.production.example"
        exit 1
    fi
    
    if [ ! -f "travel_agency/settings_production.py" ]; then
        print_error "Production settings file not found!"
        exit 1
    fi
    
    if [ ! -d "frontend" ]; then
        print_error "Frontend directory not found!"
        exit 1
    fi
    
    print_status "✅ All required files found"
}

# Build frontend
build_frontend() {
    print_status "Building frontend for production..."
    
    cd frontend
    
    # Install dependencies
    if [ ! -d "node_modules" ]; then
        print_status "Installing frontend dependencies..."
        npm install
    fi
    
    # Copy production environment file
    if [ -f "../frontend/env.production" ]; then
        cp ../frontend/env.production .env.production
        print_status "✅ Production environment file copied"
    fi
    
    # Build for production
    print_status "Building React application..."
    npm run build
    
    if [ $? -eq 0 ]; then
        print_status "✅ Frontend build completed successfully"
    else
        print_error "Frontend build failed!"
        exit 1
    fi
    
    cd ..
}

# Prepare backend
prepare_backend() {
    print_status "Preparing backend for production..."
    
    # Copy production environment
    cp env.production .env
    
    # Install production requirements
    if [ -f "requirements-production.txt" ]; then
        print_status "Installing production Python dependencies..."
        pip install -r requirements-production.txt
    else
        print_status "Installing standard Python dependencies..."
        pip install -r requirements.txt
    fi
    
    # Run Django checks
    print_status "Running Django system checks..."
    python manage.py check --settings=travel_agency.settings_production
    
    if [ $? -eq 0 ]; then
        print_status "✅ Django checks passed"
    else
        print_error "Django checks failed!"
        exit 1
    fi
}

# Database operations
setup_database() {
    print_status "Setting up production database..."
    
    # Run migrations
    print_status "Running database migrations..."
    python manage.py migrate --settings=travel_agency.settings_production
    
    # Collect static files
    print_status "Collecting static files..."
    python manage.py collectstatic --noinput --settings=travel_agency.settings_production
    
    print_status "✅ Database setup completed"
}

# Deploy to Railway (if using Railway)
deploy_railway() {
    print_status "Deploying to Railway..."
    
    # Check if Railway CLI is installed
    if ! command -v railway &> /dev/null; then
        print_warning "Railway CLI not found. Please install it:"
        print_warning "npm install -g @railway/cli"
        print_warning "Then run: railway login"
        return 1
    fi
    
    # Deploy
    railway up
    
    if [ $? -eq 0 ]; then
        print_status "✅ Railway deployment completed"
    else
        print_error "Railway deployment failed!"
        return 1
    fi
}

# Deploy to Vercel (for frontend)
deploy_vercel() {
    print_status "Deploying frontend to Vercel..."
    
    cd frontend
    
    # Check if Vercel CLI is installed
    if ! command -v vercel &> /dev/null; then
        print_warning "Vercel CLI not found. Please install it:"
        print_warning "npm install -g vercel"
        print_warning "Then run: vercel login"
        cd ..
        return 1
    fi
    
    # Deploy to production
    vercel --prod
    
    if [ $? -eq 0 ]; then
        print_status "✅ Vercel deployment completed"
    else
        print_error "Vercel deployment failed!"
        cd ..
        return 1
    fi
    
    cd ..
}

# Main deployment function
main() {
    print_status "🌟 Travel Agency Production Deployment"
    print_status "======================================="
    
    # Check requirements
    check_requirements
    
    # Build frontend
    build_frontend
    
    # Prepare backend
    prepare_backend
    
    # Setup database
    setup_database
    
    # Ask user which deployment method to use
    echo ""
    print_status "Choose deployment method:"
    echo "1) Railway (Backend) + Vercel (Frontend) [Recommended]"
    echo "2) Railway only (Backend)"
    echo "3) Vercel only (Frontend)"
    echo "4) Docker deployment"
    echo "5) Skip deployment (just build)"
    
    read -p "Enter your choice (1-5): " choice
    
    case $choice in
        1)
            deploy_railway
            deploy_vercel
            ;;
        2)
            deploy_railway
            ;;
        3)
            deploy_vercel
            ;;
        4)
            print_status "Building Docker containers..."
            docker-compose -f docker-compose.prod.yml build
            print_status "✅ Docker build completed"
            print_warning "To start: docker-compose -f docker-compose.prod.yml up -d"
            ;;
        5)
            print_status "Skipping deployment"
            ;;
        *)
            print_error "Invalid choice"
            exit 1
            ;;
    esac
    
    echo ""
    print_status "🎉 Deployment process completed!"
    print_status "==============================="
    
    # Show next steps
    echo ""
    print_status "Next Steps:"
    echo "1. Update your DNS records in Namecheap"
    echo "2. Configure SSL certificates"
    echo "3. Set up monitoring and alerts"
    echo "4. Test your production deployment"
    echo "5. Set up automated backups"
    
    print_status "📚 For detailed instructions, see: PRODUCTION_DEPLOYMENT_GUIDE.md"
}

# Run main function
main "$@"
