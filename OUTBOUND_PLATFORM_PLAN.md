# 🚀 Thread Global Travels - Outbound Platform Plan

## 📋 Project Overview

**Goal**: Create a simplified, Bookmundi-style outbound travel platform for Maldivian locals to book international tours.

**Domain**: `local.threadtravels.com`

**Inspiration**: [Bookmundi.com](https://www.bookmundi.com/) - Global tour booking platform

---

## 🎯 Key Differences from Current Maldives Site

| Aspect | Current Site (Maldives) | New Outbound Platform |
|--------|------------------------|----------------------|
| **Destinations** | Islands/Atolls | Countries |
| **Products** | Hotel packages | Tour packages |
| **Complexity** | High (properties, transport, etc.) | Low (tours only) |
| **Scope** | Maldives-only | Global (130+ countries) |
| **Pricing** | Per room/night | Per person/tour |
| **Features** | Complex booking workflows | Simple direct booking |
| **Admin** | Multi-section management | Simple CRUD operations |

---

## 🏗 Architecture Overview

### **Multi-Brand Architecture**
```
threadtravels.com       → Maldives Tourism (existing)
local.threadtravels.com → International Travel (new)
```

### **Tech Stack**
- **Backend**: Django + Django REST Framework (shared)
- **Frontend**: React + TypeScript + Chakra UI
- **Database**: PostgreSQL/SQLite (shared)
- **Deployment**: Separate subdomain routing

### **Django Apps**
```
api/                    # Maldives inbound (existing)
├── models.py          # Properties, packages, transport
├── views.py           # Complex booking workflows
└── ...

api_outbound/          # International outbound (new)
├── models.py          # Countries, tours, bookings
├── views.py           # Simple CRUD operations
└── ...
```

---

## 📊 Database Models

### **Core Models**

#### **1. Continent**
```python
class Continent(models.Model):
    name = models.CharField(max_length=50)  # "Europe", "Asia", etc.
    code = models.CharField(max_length=10)  # "EUR", "ASI"
    display_order = models.PositiveIntegerField()
```

#### **2. Country**
```python
class Country(models.Model):
    name = models.CharField(max_length=100)      # "Thailand", "Spain"
    code = models.CharField(max_length=3)        # "THA", "ESP"
    continent = models.ForeignKey(Continent, ...)
    capital = models.CharField(max_length=100)
    currency = models.CharField(max_length=10)
    description = models.TextField()
    image = models.ImageField()
    is_featured = models.BooleanField(default=False)
```

#### **3. ActivityCategory**
```python
class ActivityCategory(models.Model):
    name = models.CharField(max_length=100)      # "Adventure", "Culture"
    slug = models.SlugField()
    description = models.TextField()
    icon = models.CharField(max_length=100)      # Icon class name
```

#### **4. TourPackage**
```python
class TourPackage(models.Model):
    name = models.CharField(max_length=200)
    slug = models.SlugField(unique=True)
    country = models.ForeignKey(Country, ...)
    description = models.TextField()
    duration_days = models.PositiveIntegerField()
    difficulty = models.CharField(choices=['easy', 'moderate', 'challenging'])
    price_usd = models.DecimalField(max_digits=8, decimal_places=2)
    discount_percentage = models.PositiveIntegerField(default=0)
    activity_categories = models.ManyToManyField(ActivityCategory)
    is_featured = models.BooleanField(default=False)
```

#### **5. TourItinerary**
```python
class TourItinerary(models.Model):
    tour = models.ForeignKey(TourPackage, ...)
    day_number = models.PositiveIntegerField()
    title = models.CharField(max_length=200)
    description = models.TextField()
    activities = models.JSONField(default=list)
    meals = models.JSONField(default=list)
```

#### **6. TourBooking**
```python
class TourBooking(models.Model):
    tour = models.ForeignKey(TourPackage, ...)
    user = models.ForeignKey(User, ...)
    booking_reference = models.CharField(max_length=20, unique=True)
    full_name = models.CharField(max_length=100)
    email = models.EmailField()
    number_of_travelers = models.PositiveIntegerField()
    travel_date = models.DateField()
    total_amount = models.DecimalField(max_digits=10, decimal_places=2)
    status = models.CharField(choices=['pending', 'confirmed', 'cancelled'])
```

---

## 🎨 Frontend Pages & Components

### **Core Pages**

#### **1. Homepage (`/`)**
- Hero section with featured tours
- Country grid (6 continents)
- Deal banners (up to 65% off)
- Activity categories
- Newsletter signup

#### **2. Countries Page (`/countries`)**
- Filter by continent
- Country cards with images
- Featured destinations
- Quick tour previews

#### **3. Tour Detail Page (`/tours/[slug]`)**
- Tour overview
- Itinerary (day-by-day)
- What's included/excluded
- Pricing & booking form
- Related tours

#### **4. Search Results (`/search`)**
- Filters: destination, activity, duration, price
- Sort options: price, rating, duration
- Tour grid with pagination

#### **5. Deals Page (`/deals`)**
- Current promotions
- Discounted packages
- Seasonal offers
- Limited time deals

### **Key Components**

#### **CountryGrid**
```tsx
<CountryGrid
  countries={countries}
  continent="Europe"
  featuredOnly={false}
/>
```

#### **TourCard**
```tsx
<TourCard
  tour={tour}
  showDiscount={true}
  variant="grid"
/>
```

#### **DealBanner**
```tsx
<DealBanner
  title="September Super Sales"
  discount="Up to 65% Off"
  countries={["Thailand", "Vietnam", "Spain"]}
/>
```

#### **SearchFilters**
```tsx
<SearchFilters
  onFilterChange={handleFilterChange}
  filters={{
    destination: "",
    activity: "",
    duration: "",
    priceRange: [0, 5000]
  }}
/>
```

---

## 🚀 Implementation Phases

### **Phase 1: Core Setup** ✅
- [x] Create Django app (`api_outbound`)
- [x] Add to INSTALLED_APPS
- [x] Create simplified models
- [x] Basic React app structure

### **Phase 2: Data & API** 🔄
- [ ] Create database migrations
- [ ] Add initial data (continents, countries, activities)
- [ ] Create serializers
- [ ] Build API views
- [ ] Test endpoints

### **Phase 3: Frontend Core**
- [ ] Homepage with country grid
- [ ] Tour listing components
- [ ] Search functionality
- [ ] Deal system
- [ ] Responsive design

### **Phase 4: Features**
- [ ] Currency selector
- [ ] Booking system
- [ ] User authentication
- [ ] Newsletter signup
- [ ] Travel guides

### **Phase 5: Polish & Launch**
- [ ] SEO optimization
- [ ] Performance optimization
- [ ] Testing & QA
- [ ] Deployment setup
- [ ] Admin panel

---

## 📱 User Experience Flow

### **Typical User Journey**

1. **Discovery**: Visit `local.threadtravels.com`
2. **Browse**: Explore countries by continent
3. **Search**: Filter tours by activity/duration
4. **Details**: View tour itinerary & inclusions
5. **Book**: Simple booking form
6. **Confirm**: Instant confirmation

### **Key UX Principles**
- **Simple**: No complex workflows
- **Fast**: Quick loading, minimal steps
- **Deals**: Prominent discount messaging
- **Visual**: High-quality destination images
- **Mobile**: Responsive design first

---

## 🔧 Technical Implementation

### **Backend Setup**
```bash
# Create migrations
python manage.py makemigrations api_outbound
python manage.py migrate

# Create superuser
python manage.py createsuperuser
```

### **API Endpoints**
```python
# Countries
GET /api/outbound/countries/           # List countries
GET /api/outbound/countries/{id}/      # Country details

# Tours
GET /api/outbound/tours/               # List tours
GET /api/outbound/tours/{slug}/        # Tour details
POST /api/outbound/tours/{id}/book/    # Book tour

# Activities
GET /api/outbound/activities/           # Activity categories
```

### **Frontend Routing**
```tsx
<Route path="/" element={<HomePage />} />
<Route path="/countries" element={<CountriesPage />} />
<Route path="/countries/:continent" element={<CountriesPage />} />
<Route path="/tours/:slug" element={<TourDetailPage />} />
<Route path="/search" element={<SearchResultsPage />} />
<Route path="/deals" element={<DealsPage />} />
```

### **State Management**
```tsx
// Context for global state
const OutboundContext = createContext({
  currency: 'USD',
  searchFilters: {},
  user: null,
});
```

---

## 🎯 Key Features to Implement

### **1. Deal System**
- Percentage discounts (up to 65%)
- Seasonal promotions
- Limited-time offers
- Deal banners & notifications

### **2. Currency Support**
- USD (default)
- EUR, GBP, AUD, CAD
- Real-time exchange rates
- Automatic conversion

### **3. Search & Filtering**
- By destination (country)
- By activity type
- By duration (days)
- By price range
- By difficulty

### **4. Booking System**
- Simple form (name, email, date, travelers)
- Instant confirmation
- Email notifications
- Booking reference numbers

### **5. Content Management**
- Country descriptions
- Tour itineraries
- Activity categories
- Deal management

---

## 📊 Data Strategy

### **Initial Data Load**
```python
# Sample countries to add first
countries = [
    {'name': 'Thailand', 'code': 'THA', 'continent': 'Asia'},
    {'name': 'Spain', 'code': 'ESP', 'continent': 'Europe'},
    {'name': 'Vietnam', 'code': 'VNM', 'continent': 'Asia'},
    {'name': 'Italy', 'code': 'ITA', 'continent': 'Europe'},
    {'name': 'Costa Rica', 'code': 'CRI', 'continent': 'North America'},
    {'name': 'Peru', 'code': 'PER', 'continent': 'South America'},
    {'name': 'South Africa', 'code': 'ZAF', 'continent': 'Africa'},
    {'name': 'Morocco', 'code': 'MAR', 'continent': 'Africa'},
]
```

### **Activity Categories**
```python
activities = [
    'Adventure & Sport',
    'Culture & History',
    'Food & Wine',
    'Nature & Wildlife',
    'Beach & Relaxation',
    'City & Sightseeing',
]
```

---

## 🚀 Deployment Strategy

### **Subdomain Setup**
```
Domain: local.threadtravels.com
Points to: Same server as threadtravels.com
Routing: Based on subdomain detection
```

### **Nginx Configuration**
```nginx
server {
    listen 80;
    server_name local.threadtravels.com;

    location / {
        proxy_pass http://127.0.0.1:3001;  # Outbound React app
    }

    location /api/ {
        proxy_pass http://127.0.0.1:8000;  # Django backend
    }
}
```

### **Environment Variables**
```bash
# Outbound specific
OUTBOUND_APP_TYPE=outbound
OUTBOUND_BRAND_NAME="Thread Global Travels"
OUTBOUND_DOMAIN=local.threadtravels.com

# Shared with main app
DJANGO_SETTINGS_MODULE=travel_agency.settings
DATABASE_URL=postgresql://...
```

---

## 📈 Success Metrics

### **Business KPIs**
- **Conversion Rate**: Bookings per visitor
- **Average Order Value**: Revenue per booking
- **Popular Destinations**: Top 5 countries
- **Deal Performance**: Discount effectiveness
- **User Retention**: Repeat bookings

### **Technical KPIs**
- **Page Load Speed**: <2 seconds
- **Mobile Responsiveness**: 100% mobile users
- **Search Functionality**: Accurate results
- **Booking Completion**: Smooth process
- **API Performance**: <500ms response time

---

## 🎨 Design System

### **Color Scheme**
- **Primary**: Blue (#1e40af) - Trust & Travel
- **Secondary**: Green (#059669) - Nature & Growth
- **Accent**: Orange (#ea580c) - Deals & Action
- **Background**: Light blue (#f0f9ff)

### **Typography**
- **Headings**: Inter Bold
- **Body**: Inter Regular
- **Accent**: Inter Medium

### **Components**
- **Cards**: Rounded corners, subtle shadows
- **Buttons**: Full width on mobile, inline on desktop
- **Forms**: Simple, minimal fields
- **Images**: High-quality destination photos

---

## 🔗 Integration Points

### **Shared Services**
- **Authentication**: Same user accounts
- **Payments**: Stripe/PayPal integration
- **Email**: SendGrid/Mailgun
- **Analytics**: Google Analytics
- **SEO**: Same meta tags structure

### **Data Sharing**
- **Users**: Shared user database
- **Bookings**: Separate but linked tables
- **Payments**: Shared payment processing
- **Content**: Separate media directories

---

## 📋 Development Checklist

### **Week 1: Foundation**
- [ ] Database models & migrations
- [ ] API serializers & views
- [ ] Basic React components
- [ ] Routing setup
- [ ] Initial styling

### **Week 2: Core Features**
- [ ] Homepage with country grid
- [ ] Tour listing & detail pages
- [ ] Search functionality
- [ ] Deal system implementation
- [ ] Booking form

### **Week 3: Polish & Testing**
- [ ] Currency support
- [ ] Mobile optimization
- [ ] Performance optimization
- [ ] Testing & bug fixes
- [ ] Content population

### **Week 4: Launch**
- [ ] Deployment setup
- [ ] Domain configuration
- [ ] SEO optimization
- [ ] Admin panel setup
- [ ] Launch monitoring

---

## 📞 Support & Maintenance

### **Admin Panel**
- Manage countries & tours
- Handle bookings
- Update deals & pricing
- Monitor analytics
- Customer support

### **Content Strategy**
- Regular tour updates
- Seasonal deals
- Destination guides
- Customer reviews
- Email newsletters

---

## 🎯 Next Steps

1. **Immediate**: Create database migrations
2. **Short-term**: Build core API endpoints
3. **Medium-term**: Develop React components
4. **Long-term**: Launch and iterate

**Ready to start implementation! 🚀**

---

*Document created: September 2025*
*Based on Bookmundi.com analysis*
*Target launch: local.threadtravels.com*
