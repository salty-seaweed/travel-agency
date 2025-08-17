#!/bin/bash

# 🚀 Easy Deployment Script for Travel Agency
# This script makes deploying changes super simple!

echo "🚀 Travel Agency - Easy Deployment"
echo "=================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

# Check if we're in the right directory
if [ ! -f "manage.py" ]; then
    print_error "Please run this script from the project root directory"
    exit 1
fi

# Check git status
print_info "Checking git status..."
if [ -n "$(git status --porcelain)" ]; then
    print_warning "You have uncommitted changes:"
    git status --short
    
    read -p "Do you want to commit these changes? (y/n): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        read -p "Enter commit message: " commit_message
        if [ -z "$commit_message" ]; then
            commit_message="Update $(date +%Y-%m-%d_%H-%M-%S)"
        fi
        
        git add .
        git commit -m "$commit_message"
        print_status "Changes committed"
    else
        print_warning "Skipping commit. Make sure to commit changes manually."
    fi
else
    print_status "No uncommitted changes"
fi

# Check if we have changes to push
if [ "$(git rev-list HEAD...origin/master --count)" -gt 0 ]; then
    print_info "Pushing changes to GitHub..."
    git push origin master
    print_status "Changes pushed to GitHub"
else
    print_status "No changes to push"
fi

# Check if we have database migrations
if [ -n "$(find api/migrations -name "*.py" -newer .git/HEAD 2>/dev/null)" ]; then
    print_warning "You have new database migrations"
    print_info "These will be automatically applied in production"
fi

# Check if we have new dependencies
if [ -n "$(git diff HEAD~1 requirements.txt 2>/dev/null)" ]; then
    print_warning "Requirements.txt has changed"
    print_info "Dependencies will be automatically installed in production"
fi

echo ""
print_status "Deployment Summary:"
echo "======================"

# Show what platforms will be updated
if command -v railway &> /dev/null; then
    print_info "Railway: Will auto-deploy backend changes"
else
    print_warning "Railway CLI not installed. Install with: npm install -g @railway/cli"
fi

if command -v vercel &> /dev/null; then
    print_info "Vercel: Will auto-deploy frontend changes"
else
    print_warning "Vercel CLI not installed. Install with: npm install -g vercel"
fi

echo ""
print_info "Deployment Status:"
echo "===================="

# Check Railway deployment status (if CLI is available)
if command -v railway &> /dev/null; then
    print_info "Checking Railway deployment status..."
    railway status 2>/dev/null || print_warning "Railway CLI not configured"
fi

# Check Vercel deployment status (if CLI is available)
if command -v vercel &> /dev/null; then
    print_info "Checking Vercel deployment status..."
    vercel ls 2>/dev/null || print_warning "Vercel CLI not configured"
fi

echo ""
print_status "🎉 Deployment initiated!"
echo ""
print_info "Next steps:"
echo "1. Check your hosting platform dashboard for deployment status"
echo "2. Monitor logs for any errors"
echo "3. Test your application after deployment"
echo ""
print_info "Useful commands:"
echo "- View Railway logs: railway logs"
echo "- View Vercel logs: vercel logs"
echo "- Manual Railway deploy: railway up"
echo "- Manual Vercel deploy: vercel --prod"
echo ""
print_info "Need help? Check DEPLOYMENT_GUIDE.md for detailed instructions"
