# Boat Data Scripts - Usage Guide

This document explains how to use the boat data population scripts.

## 📋 **Available Scripts**

### 1. `add_boats_data.py` (Local Development)
Use this script for local development and testing.

### 2. `add_boats_data_railway.py` (Production/Railway)
Use this script for Railway deployment and production environments.

---

## 🚀 **Running the Scripts**

### **Local Development**

```bash
# Make sure you're in the project root directory
python add_boats_data.py
```

### **Railway Production**

```bash
# Run on Railway
railway run python add_boats_data_railway.py
```

---

## 📦 **What Gets Created**

### **Amenities (14 items)**
- Full Cabin
- Onboard Toilet
- Freshwater Shower
- Premium Sound System
- GPS Navigation
- Fish Finder
- Radar System
- Outriggers
- Live Bait Well
- Rod Holders
- Underwater Lights
- Search Lights
- Towels
- Cooler/Ice Box

### **Boats (2 items)**

**1. 38ft Premium Sportfishing**
- Triple Mercury 300HP engines
- Top speed: 58 knots
- Capacity: 10 passengers
- Full cabin with premium amenities
- Price range: $2,799 - $2,999

**2. 26ft Center Console**
- Twin Mercury 150 SEAPRO engines
- Top speed: 38 knots
- Capacity: 10 passengers
- Center console layout
- Price range: $1,950 - $2,250

### **Activities (6 items)**
1. **Big Game Fishing** (Featured)
   - Target: Yellowfin Tuna, Sailfish, Wahoo, Marlin
   - Duration: 8 hours
   - Difficulty: Moderate

2. **Trolling**
   - Target: Tuna, Mahi-Mahi, Wahoo, Sailfish
   - Duration: 8 hours
   - Difficulty: Easy

3. **Casting & Popping** (Featured)
   - Target: Giant Trevally, Bluefin Trevally
   - Duration: 6-8 hours
   - Difficulty: Challenging

4. **Jigging**
   - Target: Dogtooth Tuna, Amberjacks, Groupers
   - Duration: 6-8 hours
   - Difficulty: Challenging

5. **Island Hopping**
   - Type: Excursion
   - Duration: 4-8 hours
   - Difficulty: Easy

6. **Whale Shark & Manta Ray Watch** (Featured)
   - Type: Wildlife Watching
   - Duration: 4 hours
   - Difficulty: Easy

### **Packages (4 items)**

**38ft Boat Packages:**
1. **Silver Package - $2,799** (Featured)
   - Full-day charter (8 hours)
   - All fishing gear & equipment
   - Captain & crew
   - Refreshments

2. **Gold Package - $2,999** (Featured)
   - Everything in Silver PLUS:
   - Meals for 2 persons
   - Snorkeling equipment
   - GoPro video
   - "From Ocean to Plate" service
   - 20% discount active

**26ft Boat Packages:**
3. **Silver Package - $1,950**
   - Same inclusions as 38ft Silver
   - Perfect for smaller groups

4. **Gold Package - $2,250**
   - Same inclusions as 38ft Gold
   - 20% discount active

---

## ✅ **Script Features**

- ✅ **Idempotent**: Safe to run multiple times (won't create duplicates)
- ✅ **Comprehensive**: Creates all necessary data relationships
- ✅ **Production-ready**: Includes all real content from your pricing docs
- ✅ **Error handling**: Clear error messages if something goes wrong
- ✅ **Progress feedback**: Shows what's being created in real-time

---

## 🔄 **Re-running the Scripts**

The scripts are designed to be safe to run multiple times:
- If data already exists, it will skip creation
- If data doesn't exist, it will create it
- No duplicates will be created

This means you can safely run the script again if:
- You want to add new boats/activities/packages
- You accidentally deleted some data
- You're setting up a new environment

---

## 📝 **After Running the Scripts**

1. **Verify Data Creation**
   - Visit Django admin at `/admin/`
   - Check: Boats, Boat Activities, Boat Packages

2. **Upload Images**
   - Go to Django admin
   - Edit each boat and upload hero image
   - Add gallery images
   - Upload activity images
   - Upload package images

3. **Test the Frontend**
   - Visit `/boats` to see the boats page
   - Check homepage for boat sections
   - Test WhatsApp booking links
   - Verify mobile responsiveness

4. **Customize if Needed**
   - Edit boat descriptions
   - Adjust pricing
   - Update special offers
   - Modify activity details

---

## 🎯 **Troubleshooting**

### **Error: "No module named 'api'"**
Make sure you're running the script from the project root directory.

### **Error: "django.core.exceptions.ImproperlyConfigured"**
Make sure your Django settings are properly configured and database is accessible.

### **Error: "UNIQUE constraint failed"**
This usually means the data already exists. The script should handle this automatically, but if you see this error, check your database.

### **Script runs but no data appears**
- Check that migrations have been run: `python manage.py migrate`
- Verify database connection
- Check Django admin to see if data was created

---

## 🔧 **Customization**

To modify the data being created, edit the script files:

- **Boat specifications**: Edit `boats_data` list in `create_boats()` function
- **Activities**: Edit `activities_data` list in `create_activities()` function
- **Packages**: Edit `packages_data` list in `create_packages()` function
- **Amenities**: Edit `amenities_data` list in `create_amenities()` function

After making changes, simply run the script again.

---

## 📞 **Support**

If you encounter any issues:
1. Check the error message in the console
2. Verify migrations are up to date
3. Check database connectivity
4. Review Django logs

---

**Status**: ✅ Scripts ready to use in both local and production environments!

