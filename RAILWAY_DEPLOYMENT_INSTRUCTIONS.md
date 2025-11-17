# Railway Production Deployment Instructions

## Prerequisites
- Railway CLI installed (`npm install -g @railway/cli`)
- Logged into Railway (`railway login`)
- Your project linked (`railway link`)
- **Frontend deployed** with images in `/images/Resort Accomodation types images/`

## Step 0: Deploy Frontend First (CRITICAL!)

Before running ANY backend scripts, make sure your frontend is deployed with all the resort images in:
```
frontend/public/images/Resort Accomodation types images/
```

These images MUST be accessible at `https://threadtravels.com/images/Resort%20Accomodation%20types%20images/`

## Step 1: Apply Database Migrations

Apply the migration for the new `hide_price` field:

```bash
railway run python manage.py migrate
```

This will add the `hide_price` field to the `ResortRoomType` model in production.

## Step 2: Create Resorts (Data Only)

Run the management command to create all 18 resorts with 161 accommodation types:

```bash
railway run python manage.py create_resorts_with_images
```

**Note**: The script will automatically detect that it's running in production (no local images available) and will:
- Create all resort records with correct data
- Create all accommodation types with correct data
- Set `hide_price=True` for all room types
- Set `is_packaged=False` and `is_room_type=True` for all resorts
- Skip image uploads (images will be referenced from frontend in next steps)

## Step 3: Add Card Images & Hero Banners to Gallery

Add Card Image and Resort Hero Banner URLs to each resort's `gallery_images` field:

```bash
railway run python manage.py add_card_images_to_gallery
```

This will add 3 images per resort (54 total):
- Card Image (for resort cards)
- Resort Hero Banner 1 (for gallery)
- Resort Hero Banner 2 (for gallery)

All URLs point to `https://threadtravels.com/images/...`

## Step 4: Add Room Type Image URLs

Add room type image URLs to each room type's `amenities` field (with special `__IMAGE_URL__:` prefix):

```bash
railway run python manage.py add_room_type_image_urls
```

This will add image URLs for all 161 room types across 18 resorts.

The serializer will automatically:
- Extract the image URL from amenities
- Filter it out from the amenities list shown to users
- Use it as the `image_url` field

## Step 5: Verify the Data

Check that the resorts and image URLs were added successfully:

```bash
railway run python manage.py shell -c "from api.models import Resort, ResortRoomType; resorts = Resort.objects.filter(is_room_type=True); print(f'Resorts: {resorts.count()}'); print(f'Room Types: {ResortRoomType.objects.count()}'); print(f'Resorts with gallery images: {resorts.exclude(gallery_images=[]).count()}')"
```

Expected output:
```
Resorts: 18
Room Types: 161
Resorts with gallery images: 18
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
# 0. Make sure frontend is deployed first at https://threadtravels.com!

# 1. Apply migrations
railway run python manage.py migrate

# 2. Create resorts (data only, no images)
railway run python manage.py create_resorts_with_images

# 3. Add card images & hero banners to gallery_images
railway run python manage.py add_card_images_to_gallery

# 4. Add room type image URLs to amenities
railway run python manage.py add_room_type_image_urls

# 5. Verify everything
railway run python manage.py shell -c "from api.models import Resort, ResortRoomType; resorts = Resort.objects.filter(is_room_type=True); print(f'Resorts: {resorts.count()}'); print(f'Room Types: {ResortRoomType.objects.count()}'); print(f'Resorts with gallery: {resorts.exclude(gallery_images=[]).count()}')"
```

**That's it! All resorts with image URLs will be in production.**

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
9. **Cinnamon Velifushi Maldives** - 5 accommodation types
10. **Cinnamon Hakuraa Huraa Maldives** - 4 accommodation types
11. **Cinnamon Dhonveli Maldives** - 8 accommodation types
12. **Ellaidhoo Maldives by Cinnamon** - 3 accommodation types
13. **Velassaru Maldives** - 10 accommodation types
14. **Kuramathi Maldives** - 12 accommodation types
15. **Kurumba Maldives** - 10 accommodation types
16. **Dhigufaru Island Resort** - 8 accommodation types
17. **Villa Nautica Paradise Island** - 10 accommodation types
18. **Holiday Inn Resort Kandooma Maldives** - 8 accommodation types

**Total: 161 accommodation types across 18 resorts**

