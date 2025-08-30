# Google Maps API Configuration Guide

## Overview
This guide will help you set up Google Maps API to enable interactive mapping features in your travel agency application.

## Step 1: Get a Google Maps API Key

### 1.1 Create a Google Cloud Project
1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Sign in with your Google account
3. Click "Create Project" or select an existing project
4. Give your project a name (e.g., "Travel Agency Maps")
5. Click "Create"

### 1.2 Enable the Maps JavaScript API
1. In the Google Cloud Console, go to the **APIs & Services** > **Library**
2. Search for "Maps JavaScript API"
3. Click on "Maps JavaScript API"
4. Click the **"Enable"** button

### 1.3 Create API Credentials
1. Go to **APIs & Services** > **Credentials**
2. Click **"+ CREATE CREDENTIALS"** > **"API key"**
3. Your new API key will be created and displayed
4. **Important**: Copy this key immediately and store it securely

### 1.4 Restrict Your API Key (Recommended for Security)
1. Click on your newly created API key to edit it
2. Under **"Application restrictions"**:
   - Select **"HTTP referrers (web sites)"**
   - Add your website domains:
     - `http://localhost:*` (for development)
     - `https://yourdomain.com/*` (for production)
     - `https://*.yourdomain.com/*` (for subdomains)
3. Under **"API restrictions"**:
   - Select **"Restrict key"**
   - Choose **"Maps JavaScript API"**
4. Click **"Save"**

## Step 2: Configure Your Application

### 2.1 Environment Variables
Create or update your `.env` file in the frontend directory:

```bash
# Frontend/.env
REACT_APP_GOOGLE_MAPS_API_KEY=your_api_key_here
```

**Example:**
```bash
REACT_APP_GOOGLE_MAPS_API_KEY=AIzaSyBFw0Qbyq9zTFTd-tUY6dOWTgHz-TrU_T4
```

### 2.2 Alternative: Pass API Key Directly
You can also pass the API key directly to the GoogleMap component:

```tsx
<GoogleMap 
  destinations={packageData.destinations} 
  height={400}
  apiKey="your_api_key_here"
/>
```

## Step 3: Verify Setup

### 3.1 Check Console
1. Open your browser's Developer Tools (F12)
2. Go to the Console tab
3. Refresh your package details page
4. You should see no Google Maps errors

### 3.2 Expected Behavior
- **With Valid API Key**: You'll see both the Journey Route AND an Interactive Google Map
- **Without Valid API Key**: You'll see the Journey Route with a helpful message about configuring Google Maps

## Step 4: Billing Setup (Important!)

### 4.1 Enable Billing
1. Go to **Billing** in the Google Cloud Console
2. Link a billing account to your project
3. **Note**: Google provides $200 in free credits monthly for Maps API usage

### 4.2 Set Usage Limits (Recommended)
1. Go to **APIs & Services** > **Quotas**
2. Find "Maps JavaScript API"
3. Set daily quotas to prevent unexpected charges:
   - Recommended: 1,000-10,000 requests per day depending on your traffic

## Troubleshooting

### Common Issues

#### 1. "InvalidKeyMapError"
- **Cause**: Invalid or missing API key
- **Solution**: Verify your API key is correct and the Maps JavaScript API is enabled

#### 2. "RefererNotAllowedMapError"
- **Cause**: Your domain is not allowed in API key restrictions
- **Solution**: Add your domain to the API key's HTTP referrer restrictions

#### 3. "QuotaExceededError"
- **Cause**: You've exceeded your daily quota
- **Solution**: Increase quotas or wait until the next day

#### 4. Map shows but is grayed out
- **Cause**: Billing not enabled
- **Solution**: Enable billing in Google Cloud Console

### Debug Steps
1. Check browser console for specific error messages
2. Verify API key in Network tab (should not show 403 errors)
3. Test API key with a simple HTML page
4. Check Google Cloud Console for API usage statistics

## Cost Estimation

### Free Tier
- **$200 monthly credit** covers approximately:
  - 28,000 map loads per month
  - 40,000 geocoding requests per month

### Typical Usage for Travel Agency
- Small agency (< 1,000 visitors/month): **Free**
- Medium agency (< 10,000 visitors/month): **$10-50/month**
- Large agency (> 50,000 visitors/month): **$100-500/month**

## Security Best Practices

1. **Never commit API keys to version control**
2. **Use environment variables** for API keys
3. **Restrict API keys** to specific domains
4. **Monitor usage** regularly in Google Cloud Console
5. **Set up billing alerts** to avoid unexpected charges

## Support

If you encounter issues:
1. Check the [Google Maps JavaScript API documentation](https://developers.google.com/maps/documentation/javascript)
2. Review the [Google Cloud Console](https://console.cloud.google.com/) for error details
3. Contact Google Cloud Support if needed

---

## Quick Setup Checklist

- [ ] Create Google Cloud Project
- [ ] Enable Maps JavaScript API
- [ ] Create API Key
- [ ] Restrict API Key (domains + API)
- [ ] Add API Key to `.env` file
- [ ] Enable Billing
- [ ] Set Usage Quotas
- [ ] Test on your website
- [ ] Monitor usage and costs

Once configured, your package details pages will show both the beautiful Journey Route AND an interactive Google Map! 🗺️✨
