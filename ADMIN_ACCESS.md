# Django Admin Access Guide

## Admin URL

The Django admin panel should be accessible at:

**Production:** `https://threadtravels.com/admin/`

If you get a 404 error, try:

1. **Direct Backend URL:** If your backend is deployed separately (e.g., on Railway), access it directly:
   - `https://your-backend-url.railway.app/admin/`
   - Check your `BACKEND_URL` environment variable for the exact URL

2. **Check Nginx Configuration:** Ensure nginx is properly configured to proxy `/admin/` requests to Django. The nginx config should include:
   ```nginx
   location /admin/ {
       proxy_pass http://django;
       proxy_set_header Host $host;
       proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
       proxy_set_header X-Forwarded-Proto $scheme;
   }
   ```

3. **Check Django Settings:** Ensure `DEBUG=False` and `ALLOWED_HOSTS` includes your domain

## Default Credentials

**Username:** `admin`  
**Password:** `changeme123!` (default from `ADMIN_PASSWORD` env var)

**⚠️ IMPORTANT:** Change the default password after first login!

## Creating/Updating Admin User

### Option 1: Using Management Command
```bash
python manage.py create_production_admin --username admin --password your-secure-password --email admin@threadtravels.com
```

### Option 2: Using Django Shell
```bash
python manage.py shell
```
```python
from django.contrib.auth.models import User
user = User.objects.get(username='admin')
user.set_password('your-new-password')
user.save()
```

### Option 3: Using createsuperuser
```bash
python manage.py createsuperuser
```

## Troubleshooting

### 404 Error
- Check if backend service is running
- Verify nginx is proxying `/admin/` correctly
- Check Django logs for errors
- Try accessing the backend URL directly (bypassing nginx)

### 403 Forbidden
- Check if user has `is_staff=True` and `is_superuser=True`
- Verify CORS settings allow admin access
- Check if IP is blocked by rate limiting

### Login Issues
- Reset password using Django shell (see above)
- Check if user account is active: `user.is_active = True`
- Verify database connection is working

