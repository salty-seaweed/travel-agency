# Server Configuration Notes for Production

## Security Headers (Must be set by server, not meta tags)

### **For Nginx**
```nginx
# Add these to your nginx.conf or site config
add_header X-Frame-Options "DENY" always;
add_header X-Content-Type-Options "nosniff" always;
add_header X-XSS-Protection "1; mode=block" always;
add_header Referrer-Policy "strict-origin-when-cross-origin" always;
add_header Permissions-Policy "camera=(), microphone=(), geolocation=(self), payment=()" always;

# Content Security Policy (adjust URLs as needed)
add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https://images.unsplash.com; connect-src 'self' https:; frame-src 'none'; object-src 'none';" always;
```

### **For Apache**
```apache
# Add these to your .htaccess or apache config
Header always set X-Frame-Options "DENY"
Header always set X-Content-Type-Options "nosniff"
Header always set X-XSS-Protection "1; mode=block"
Header always set Referrer-Policy "strict-origin-when-cross-origin"
Header always set Permissions-Policy "camera=(), microphone=(), geolocation=(self), payment=()"

# Content Security Policy
Header always set Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https://images.unsplash.com; connect-src 'self' https:; frame-src 'none'; object-src 'none';"
```

### **For Express.js (Node.js)**
```javascript
const helmet = require('helmet');

app.use(helmet({
  frameguard: { action: 'deny' },
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https://images.unsplash.com"],
      connectSrc: ["'self'", "https:"],
      frameSrc: ["'none'"],
      objectSrc: ["'none'"]
    }
  }
}));
```

### **For Django (Python)**
```python
# In settings.py
SECURE_CONTENT_TYPE_NOSNIFF = True
SECURE_BROWSER_XSS_FILTER = True
X_FRAME_OPTIONS = 'DENY'
SECURE_REFERRER_POLICY = 'strict-origin-when-cross-origin'

# For CSP, use django-csp package
CSP_DEFAULT_SRC = ("'self'",)
CSP_SCRIPT_SRC = ("'self'", "'unsafe-inline'")
CSP_STYLE_SRC = ("'self'", "'unsafe-inline'", "https://fonts.googleapis.com")
CSP_FONT_SRC = ("'self'", "https://fonts.gstatic.com")
CSP_IMG_SRC = ("'self'", "data:", "https://images.unsplash.com")
CSP_CONNECT_SRC = ("'self'", "https:")
CSP_FRAME_SRC = ("'none'",)
CSP_OBJECT_SRC = ("'none'",)
```

## Important Notes

1. **X-Frame-Options**: Must be set by server headers, not meta tags
2. **Development**: CSP is relaxed in index.html for development - tighten for production
3. **API URLs**: Update connect-src to include your actual API endpoints
4. **Images**: Update img-src to include your image hosting domains
5. **Testing**: Use browser dev tools to verify headers are properly set

## Current Status

- ✅ Meta tags removed for headers that don't work via meta
- ✅ CSP relaxed for development in index.html
- ⚠️ Production server must implement proper headers
- ⚠️ Adjust CSP directives based on actual external resources used 