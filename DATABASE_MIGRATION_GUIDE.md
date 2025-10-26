# Database Migration & Management Guide

## 🗄️ Database Strategy

### **Development vs Production**

| Environment | Database | Purpose | Data Persistence |
|-------------|----------|---------|------------------|
| **Local** | SQLite | Development & Testing | File-based, resets on deployment |
| **Production** | PostgreSQL | Live Application | Persistent, survives deployments |

## 📊 Data Migration Options

### **Option 1: Fresh Start (Recommended for New Apps)**
```bash
# Production will start with empty database
# Run migrations to create tables
python manage.py migrate

# Populate with sample data
python manage.py populate_sample_data

# Create admin user
python manage.py createsuperuser
```

### **Option 2: Migrate Local Data to Production**

#### **Step 1: Export Local Data**
```bash
# Export all data to JSON
python manage.py dumpdata --exclude auth.permission --exclude contenttypes > local_data.json

# Export specific apps
python manage.py dumpdata api > api_data.json
```

#### **Step 2: Import to Production**
```bash
# After deployment, import data
python manage.py loaddata local_data.json
```

### **Option 3: Database Backup/Restore**

#### **For SQLite to PostgreSQL:**
```bash
# Install django-extensions
pip install django-extensions

# Add to INSTALLED_APPS
INSTALLED_APPS = [
    ...
    'django_extensions',
]

# Export with natural keys
python manage.py dumpdata --natural-foreign --natural-primary > data.json
```

## 🔄 Continuous Database Management

### **Automated Migrations**
Your deployment setup includes automatic migrations:
```bash
# In Procfile
web: python manage.py migrate && python manage.py collectstatic --noinput && gunicorn travel_agency.wsgi:application --bind 0.0.0.0:$PORT
```

### **Manual Database Operations**
```bash
# Connect to production database
python manage.py dbshell

# Check migration status
python manage.py showmigrations

# Run specific migration
python manage.py migrate api 0005

# Reset database (DANGEROUS!)
python manage.py flush
```

## 📁 Assets Management

### **Static Files**
- **Local**: Served by Django development server
- **Production**: Collected and served by web server

### **Media Files**
- **Local**: Stored in `media/` directory
- **Production**: Need cloud storage solution

## ☁️ Cloud Storage for Media Files

### **Option 1: AWS S3 (Recommended)**
```bash
# Install boto3
pip install boto3 django-storages

# Add to requirements.txt
boto3==1.34.0
django-storages==1.14.2
```

#### **Configure S3 in settings_production.py:**
```python
# AWS S3 Configuration
AWS_ACCESS_KEY_ID = os.getenv('AWS_ACCESS_KEY_ID')
AWS_SECRET_ACCESS_KEY = os.getenv('AWS_SECRET_ACCESS_KEY')
AWS_STORAGE_BUCKET_NAME = os.getenv('AWS_STORAGE_BUCKET_NAME')
AWS_S3_REGION_NAME = os.getenv('AWS_S3_REGION_NAME', 'us-east-1')
AWS_S3_FILE_OVERWRITE = False
AWS_DEFAULT_ACL = None
AWS_S3_VERIFY = True

# Use S3 for media files
DEFAULT_FILE_STORAGE = 'storages.backends.s3boto3.S3Boto3Storage'
MEDIA_URL = f'https://{AWS_STORAGE_BUCKET_NAME}.s3.amazonaws.com/'
```

### **Option 2: Cloudinary (Free Tier)**
```bash
# Install cloudinary
pip install cloudinary django-cloudinary-storage

# Add to requirements.txt
cloudinary==1.36.0
django-cloudinary-storage==0.3.0
```

#### **Configure Cloudinary:**
```python
# Cloudinary Configuration
CLOUDINARY_STORAGE = {
    'CLOUD_NAME': os.getenv('CLOUDINARY_CLOUD_NAME'),
    'API_KEY': os.getenv('CLOUDINARY_API_KEY'),
    'API_SECRET': os.getenv('CLOUDINARY_API_SECRET'),
}

DEFAULT_FILE_STORAGE = 'cloudinary_storage.storage.MediaCloudinaryStorage'
```

### **Option 3: Railway/Platform Storage**
- Some platforms provide built-in file storage
- Check your hosting platform's documentation

## 🚀 Easy Deployment Workflow

### **Development Workflow:**
```bash
# 1. Make changes locally
# 2. Test with local database
# 3. Commit changes
git add .
git commit -m "Add new feature"

# 4. Push to GitHub
git push origin master

# 5. Automatic deployment (Railway/Vercel)
# - Railway detects changes and redeploys backend
# - Vercel detects changes and redeploys frontend
```

### **Database Changes:**
```bash
# 1. Create migration
python manage.py makemigrations

# 2. Test locally
python manage.py migrate

# 3. Commit migration files
git add api/migrations/
git commit -m "Add new database fields"
git push origin master

# 4. Production automatically runs migrations
```

### **Environment Variables:**
```bash
# Update in hosting platform dashboard
# No code changes needed for config updates
```

## 🔧 Deployment Commands

### **Railway Commands:**
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login to Railway
railway login

# Link to project
railway link

# Deploy manually
railway up

# View logs
railway logs

# Open shell
railway shell
```

### **Vercel Commands:**
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel

# Deploy to production
vercel --prod
```

## 📈 Scaling Considerations

### **Database Scaling:**
- **Railway**: Automatic scaling with usage
- **Render**: Manual scaling options
- **AWS**: RDS with auto-scaling

### **File Storage Scaling:**
- **S3**: Virtually unlimited
- **Cloudinary**: Free tier + paid plans
- **CDN**: CloudFront, Cloudflare

## 🛡️ Backup Strategy

### **Database Backups:**
```bash
# Railway automatic backups
# Manual backup
python manage.py dumpdata > backup_$(date +%Y%m%d).json

# Restore backup
python manage.py loaddata backup_20241217.json
```

### **File Backups:**
- **S3**: Versioning enabled
- **Cloudinary**: Automatic backups
- **Local**: Regular sync to cloud storage

## 🎯 Best Practices

### **Development:**
1. **Always test migrations locally**
2. **Use fixtures for test data**
3. **Keep database schema in version control**

### **Production:**
1. **Never modify production database directly**
2. **Always backup before major changes**
3. **Use environment variables for configuration**
4. **Monitor database performance**

### **Deployment:**
1. **Deploy during low-traffic hours**
2. **Test in staging environment first**
3. **Have rollback plan ready**
4. **Monitor deployment logs**

## 🚨 Emergency Procedures

### **Database Issues:**
```bash
# Check migration status
python manage.py showmigrations

# Rollback specific migration
python manage.py migrate api 0004

# Reset database (LAST RESORT)
python manage.py flush --noinput
python manage.py migrate
python manage.py loaddata backup.json
```

### **File Storage Issues:**
```bash
# Re-upload missing files
python manage.py collectstatic --noinput

# Check file permissions
ls -la media/
ls -la staticfiles/
```

## 💡 Pro Tips

1. **Use Django's built-in admin for data management**
2. **Set up automated backups**
3. **Monitor database size and performance**
4. **Use database indexes for better performance**
5. **Consider read replicas for high-traffic apps**
