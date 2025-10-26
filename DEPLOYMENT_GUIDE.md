# Travel Agency Deployment Guide

This guide will help you deploy your Travel Agency application to various hosting platforms.

## 🚀 Quick Start - Railway (Recommended for Beginners)

### Prerequisites
- GitHub account
- Railway account (free at [railway.app](https://railway.app))

### Step 1: Prepare Your Repository

1. **Push your code to GitHub** (if not already done):
   ```bash
   git add .
   git commit -m "Prepare for deployment"
   git push origin master
   ```

2. **Generate a new Django secret key**:
   ```bash
   python -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())"
   ```

### Step 2: Deploy Backend to Railway

1. **Go to [Railway.app](https://railway.app)** and sign in with GitHub
2. **Click "New Project"** → "Deploy from GitHub repo"
3. **Select your repository**
4. **Add a PostgreSQL database**:
   - Click "New" → "Database" → "PostgreSQL"
   - Railway will automatically link it to your app

5. **Set Environment Variables**:
   - Go to your app's "Variables" tab
   - Add these variables:
   ```
   DEBUG=False
   SECRET_KEY=your-generated-secret-key
   DB_ENGINE=django.db.backends.postgresql
   DJANGO_SETTINGS_MODULE=travel_agency.settings_production
   ```

6. **Deploy**:
   - Railway will automatically detect it's a Django app
   - It will run migrations and collect static files
   - Your backend will be available at `https://your-app.railway.app`

### Step 3: Deploy Frontend to Vercel

1. **Go to [Vercel.com](https://vercel.com)** and sign in with GitHub
2. **Click "New Project"** → Import your repository
3. **Configure the project**:
   - Framework Preset: Vite
   - Root Directory: `frontend`
   - Build Command: `npm run build`
   - Output Directory: `dist`

4. **Set Environment Variables**:
   ```
   VITE_API_URL=https://your-backend-railway-url.railway.app
   ```

5. **Deploy**:
   - Vercel will build and deploy your frontend
   - Your frontend will be available at `https://your-app.vercel.app`

### Step 4: Update CORS Settings

1. **Go back to Railway** and add this environment variable:
   ```
   FRONTEND_URL=https://your-frontend-vercel-url.vercel.app
   ```

2. **Redeploy** your Railway app

## 🌐 Alternative Hosting Options

### Option 1: Render (Free Tier Available)

#### Backend Deployment:
1. **Go to [Render.com](https://render.com)**
2. **Create a new Web Service**
3. **Connect your GitHub repository**
4. **Configure**:
   - Build Command: `pip install -r requirements.txt`
   - Start Command: `gunicorn travel_agency.wsgi:application --bind 0.0.0.0:$PORT`
   - Environment: Python 3

#### Frontend Deployment:
1. **Create a new Static Site**
2. **Configure**:
   - Build Command: `cd frontend && npm install && npm run build`
   - Publish Directory: `frontend/dist`

### Option 2: DigitalOcean App Platform

1. **Go to [DigitalOcean](https://digitalocean.com)**
2. **Create a new App**
3. **Connect your repository**
4. **Add both backend and frontend services**

### Option 3: Heroku (Paid)

1. **Install Heroku CLI**
2. **Create app**: `heroku create your-app-name`
3. **Add PostgreSQL**: `heroku addons:create heroku-postgresql:mini`
4. **Deploy**: `git push heroku master`

## 🔧 Environment Variables Reference

### Backend Variables:
```bash
DEBUG=False
SECRET_KEY=your-secret-key
DB_ENGINE=django.db.backends.postgresql
DB_NAME=your_db_name
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_HOST=your_db_host
DB_PORT=5432
FRONTEND_URL=https://your-frontend-domain.com
DJANGO_SETTINGS_MODULE=travel_agency.settings_production
```

### Frontend Variables:
```bash
VITE_API_URL=https://your-backend-domain.com
```

## 🗄️ Database Setup

### PostgreSQL (Recommended for Production):
- Most hosting platforms provide PostgreSQL
- Update your `DATABASES` setting in `settings_production.py`
- Run migrations: `python manage.py migrate`

### SQLite (Development Only):
- Not recommended for production
- File-based database
- Limited concurrent users

## 📁 Static Files

Your Django app will automatically:
1. Collect static files during deployment
2. Serve them through the web server
3. Handle media file uploads

## 🔒 Security Checklist

- [ ] Set `DEBUG=False` in production
- [ ] Use a strong `SECRET_KEY`
- [ ] Configure `ALLOWED_HOSTS`
- [ ] Set up HTTPS (automatic on most platforms)
- [ ] Configure CORS properly
- [ ] Use environment variables for sensitive data

## 🐛 Troubleshooting

### Common Issues:

1. **Database Connection Errors**:
   - Check database credentials
   - Ensure database is running
   - Verify network connectivity

2. **Static Files Not Loading**:
   - Run `python manage.py collectstatic`
   - Check `STATIC_ROOT` setting
   - Verify static files are being served

3. **CORS Errors**:
   - Update `CORS_ALLOWED_ORIGINS`
   - Check frontend URL is correct
   - Verify HTTPS/HTTP consistency

4. **Build Failures**:
   - Check `requirements.txt` is up to date
   - Verify Python version compatibility
   - Check for missing dependencies

## 📞 Support

If you encounter issues:
1. Check the hosting platform's documentation
2. Review Django deployment checklist
3. Check application logs in your hosting dashboard
4. Ensure all environment variables are set correctly

## 🎉 Success!

Once deployed, your Travel Agency will be accessible online with:
- **Backend API**: `https://your-backend-domain.com`
- **Frontend**: `https://your-frontend-domain.com`
- **Admin Panel**: `https://your-backend-domain.com/admin`

Remember to:
- Create a superuser for admin access
- Populate your database with sample data
- Test all functionality in production
- Set up monitoring and backups
