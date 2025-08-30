# Travel Agency Setup Instructions

## 🚀 Quick Start

### Prerequisites
- Python 3.8+
- Node.js 16+
- PostgreSQL (optional, SQLite will be used as fallback)

### 1. Environment Setup

#### Backend (Django)
```bash
# Copy environment file
cp env.example .env

# Edit .env file with your database settings
# For PostgreSQL:
DB_ENGINE=django.db.backends.postgresql
DB_NAME=travel_agency_db
DB_USER=postgres
DB_PASSWORD=your_password
DB_HOST=localhost
DB_PORT=5432

# For SQLite (default):
DB_ENGINE=django.db.backends.sqlite3
```

#### Frontend (React)
```bash
cd frontend
cp env.example .env
# The frontend .env is pre-configured for port 5174
```

### 2. Database Setup

#### Option A: PostgreSQL (Recommended)
```bash
# Install PostgreSQL dependencies
pip install -r requirements.txt

# Run PostgreSQL setup script
python setup_postgres.py
```

#### Option B: SQLite (Default)
```bash
# Install dependencies
pip install -r requirements.txt

# Run migrations
python manage.py migrate

# Create superuser
python manage.py createsuperuser

# Populate sample data
python manage.py populate_sample_data
```

### 3. Start Servers

#### Option A: Start Both Servers (Recommended)
```bash
python start_servers.py
```

#### Option B: Start Servers Separately

**Backend (Django) - Port 8001:**
```bash
python manage.py runserver 8001
```

**Frontend (React) - Port 5174:**
```bash
cd frontend
npm install
npm run dev
```

### 4. Access the Application

- **Frontend**: http://localhost:5174
- **Backend API**: http://localhost:8001/api
- **Django Admin**: http://localhost:8001/admin
  - Username: `admin`
  - Password: `admin123` (or what you set during setup)

## 🔧 Configuration

### Port Configuration
- **Django**: Port 8001 (configurable in .env)
- **Frontend**: Port 5174 (configurable in package.json)

### Database Configuration
The application supports both PostgreSQL and SQLite:

#### PostgreSQL (Production)
```env
DB_ENGINE=django.db.backends.postgresql
DB_NAME=travel_agency_db
DB_USER=postgres
DB_PASSWORD=your_password
DB_HOST=localhost
DB_PORT=5432
```

#### SQLite (Development)
```env
DB_ENGINE=django.db.backends.sqlite3
# Other DB_* variables are ignored
```

### Frontend Configuration
```env
VITE_API_BASE_URL=http://localhost:8001/api
VITE_WHATSAPP_NUMBER=+9607441097
VITE_SUPPORT_EMAIL=support@threadtravels.com
VITE_COMPANY_NAME=Thread Travels & Tours
```

## 📁 Project Structure

```
travel-agency-master/
├── api/                    # Django API app
├── frontend/              # React frontend
├── travel_agency/         # Django project settings
├── manage.py             # Django management
├── requirements.txt      # Python dependencies
├── env.example          # Environment variables template
├── setup_postgres.py    # PostgreSQL setup script
└── start_servers.py     # Server startup script
```

## 🛠️ Development Commands

### Backend
```bash
# Run migrations
python manage.py makemigrations
python manage.py migrate

# Create superuser
python manage.py createsuperuser

# Populate sample data
python manage.py populate_sample_data

# Run tests
python manage.py test

# Start development server
python manage.py runserver 8001
```

### Frontend
```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev          # Port 5174
npm run dev:5173     # Port 5173
npm run dev:5175     # Port 5175

# Build for production
npm run build

# Preview production build
npm run preview
```

## 🔍 Troubleshooting

### Port Already in Use
If ports 8000 or 5173 are in use:
- Django will run on port 8001
- Frontend will run on port 5174
- Update your .env files accordingly

### Database Connection Issues
1. Check PostgreSQL is running
2. Verify database credentials in .env
3. Ensure database exists: `createdb -U postgres travel_agency_db`

### Frontend API Connection Issues
1. Verify VITE_API_BASE_URL in frontend/.env
2. Check CORS settings in Django settings.py
3. Ensure Django server is running on the correct port

### Permission Issues
```bash
# Make scripts executable (Linux/Mac)
chmod +x setup_postgres.py
chmod +x start_servers.py
```

## 📊 Sample Data

The application comes with sample data including:
- 8 properties across different Maldives islands
- 3 travel packages
- Property types, amenities, and locations
- Sample reviews and ratings

## 🔐 Security Notes

- Change default admin password
- Update SECRET_KEY in production
- Set DEBUG=False in production
- Configure proper CORS settings
- Use HTTPS in production

## 🚀 Production Deployment

For production deployment:
1. Set DEBUG=False
2. Use PostgreSQL database
3. Configure static file serving
4. Set up HTTPS
5. Configure proper CORS settings
6. Use environment variables for sensitive data 