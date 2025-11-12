# Railway Production Deployment Instructions

## Prerequisites
- Railway CLI installed (`npm install -g @railway/cli`)
- Logged into Railway (`railway login`)
- Your project linked (`railway link`)
- **Frontend deployed** with images in `/images/Resort Accomodation types images/`

## Step 1: Deploy Frontend First (IMPORTANT!)

Before running the backend scripts, make sure your frontend is deployed with all the resort images in:
```
frontend/public/images/Resort Accomodation types images/
```

These images will be served as static files and used by the upload script.

## Step 2: Apply Database Migrations

Apply the migration for the new `hide_price` field:

```bash
railway run python manage.py migrate
```

This will add the `hide_price` field to the `ResortRoomType` model in production.

## Step 3: Run the Resort Creation Script

Run the management command to create all 8 resorts with 83 accommodation types:

```bash
railway run python manage.py create_resorts_with_images
```

**Note**: The script will automatically detect that it's running in production (no local images available) and will:
- Create all resort records with correct data
- Create all accommodation types with correct data
- Set `hide_price=True` for all room types
- Set `is_packaged=False` and `is_room_type=True` for all resorts
- Skip image uploads (images will be uploaded in next step)

## Step 4: Upload Images from Frontend URLs

Now upload the images from your deployed frontend to Django media storage:

```bash
railway run python manage.py upload_resort_images_from_urls --base-url https://your-frontend-url.com
```

Replace `https://your-frontend-url.com` with your actual frontend URL.

This script will:
- Download images from your deployed frontend
- Upload them to Django's media storage (S3, Cloudinary, etc.)
- Upload hero images (Card Images) for all resorts
- Upload room type images for all accommodation types

**Example:**
```bash
railway run python manage.py upload_resort_images_from_urls --base-url https://travel-agency-frontend.vercel.app
```

## Step 5: Verify the Data

Check that the resorts and images were uploaded successfully:

```bash
railway run python manage.py shell -c "from api.models import Resort, ResortRoomType; resorts = Resort.objects.filter(is_room_type=True); print(f'Resorts: {resorts.count()}'); print(f'Room Types: {ResortRoomType.objects.count()}'); print(f'Resorts with hero images: {resorts.exclude(hero_image=\"\").count()}'); print(f'Room types with images: {ResortRoomType.objects.exclude(image=\"\").count()}')"
```

Expected output:
```
Resorts: 8
Room Types: 83
Resorts with hero images: 8
Room types with images: 83
```

## Alternative: Update Existing Resorts

If the resorts already exist and you want to update them:

```bash
railway run python manage.py create_resorts_with_images --update
```

This will update existing resorts with new data while preserving their IDs.

## Troubleshooting

### If the script fails:
```bash
# Check the error logs
railway logs

# Or run with verbose output
railway run python manage.py create_resorts_with_images --verbosity 2
```

### If you need to delete and recreate:
```bash
# Delete all room types first
railway run python manage.py shell -c "from api.models import Resort, ResortRoomType; ResortRoomType.objects.filter(resort__is_room_type=True).delete(); Resort.objects.filter(is_room_type=True).delete()"

# Then run the script again
railway run python manage.py create_resorts_with_images
```

## Important Notes

1. **Frontend Must Be Deployed First**: The image upload script downloads images from your deployed frontend. Make sure:
   - Frontend is deployed and accessible
   - All images are in `/images/Resort Accomodation types images/` folder
   - Images are served as static files

2. **Gallery Images**: The script references gallery images (hero banners) as static paths. These will be served directly from your frontend's static files.

3. **Hero & Room Type Images**: These are uploaded to Django's media storage (S3, Cloudinary, etc.) by the `upload_resort_images_from_urls` command.

4. **Price Visibility**: All room types are created with `hide_price=True`. To show prices later:
   ```bash
   railway run python manage.py shell -c "from api.models import ResortRoomType; ResortRoomType.objects.filter(resort__name='Resort Name').update(hide_price=False)"
   ```

5. **Re-uploading Images**: If you need to re-upload images, use the `--skip-existing` flag:
   ```bash
   railway run python manage.py upload_resort_images_from_urls --base-url https://your-frontend-url.com --skip-existing
   ```

## Verification Checklist

After deployment, verify:

- [ ] All 8 resorts are visible in the admin
- [ ] Each resort has the correct number of accommodation types
- [ ] Accommodation types show up on resort detail pages
- [ ] Prices show "Contact us for pricing" (hide_price=true)
- [ ] Gallery shows hero banner images (if uploaded)
- [ ] Amenities display as clean bullet list
- [ ] Price stays at bottom of room type cards

## Summary - Complete Deployment Steps

**Commands to run in Railway (in order):**

```bash
# 0. Make sure frontend is deployed first!

# 1. Apply migrations
railway run python manage.py migrate

# 2. Create resorts (without images)
railway run python manage.py create_resorts_with_images

# 3. Upload images from frontend URLs
railway run python manage.py upload_resort_images_from_urls --base-url https://your-frontend-url.com

# 4. Verify everything
railway run python manage.py shell -c "from api.models import Resort, ResortRoomType; print(f'Resorts: {Resort.objects.filter(is_room_type=True).count()}'); print(f'Room Types: {ResortRoomType.objects.count()}')"
```

**That's it! All resorts with images will be in production.**

---

## Quick Reference: Resorts Created

1. **Hard Rock Hotel Maldives** - 13 accommodation types
2. **OZEN Reserve Bolifushi** - 9 accommodation types
3. **SAii Lagoon Maldives** - 9 accommodation types
4. **Sun Siyam Iru Fushi** - 10 accommodation types
5. **Sun Siyam Iru Veli** - 9 accommodation types
6. **Sun Siyam Olhuveli** - 14 accommodation types
7. **Sun Siyam Vilu Reef** - 9 accommodation types
8. **Sun Siyam World** - 10 accommodation types

**Total: 83 accommodation types across 8 resorts**

