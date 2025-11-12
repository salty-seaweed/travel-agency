# New Resorts Deployment Guide

## Summary
Added 10 new resorts with 70 room types to the database.

## New Resorts Added

### Cinnamon Collection (4 resorts)
1. **Cinnamon Velifushi Maldives** - 5 room types
   - South Malé Atoll, 4-star, Mid-range
   - Price range: $280-$620/night

2. **Cinnamon Hakuraa Huraa Maldives** - 4 room types
   - Meemu Atoll, 4-star, Mid-range
   - Price range: $260-$480/night

3. **Cinnamon Dhonveli Maldives** - 7 room types
   - North Malé Atoll, 4-star, Mid-range
   - Price range: $240-$580/night

4. **Ellaidhoo Maldives by Cinnamon** - 3 room types
   - North Ari Atoll, 3-star, Mid-range
   - Price range: $220-$380/night

### Luxury Resorts (3 resorts)
5. **Velassaru Maldives** - 9 room types
   - South Malé Atoll, 5-star, Luxury
   - Price range: $450-$980/night

6. **Kurumba Maldives** - 9 room types
   - North Malé Atoll, 5-star, Luxury
   - Price range: $380-$1,200/night

7. **Villa Nautica Paradise Island** - 10 room types
   - North Malé Atoll, 5-star, Luxury
   - Price range: $480-$1,150/night

### Mid-Range Resorts (3 resorts)
8. **Kuramathi Maldives** - 11 room types
   - Rasdhoo Atoll, 4-star, Mid-range
   - Price range: $320-$920/night

9. **Dhigufaru Island Resort** - 7 room types
   - Baa Atoll, 4-star, Mid-range
   - Price range: $350-$850/night

10. **Holiday Inn Resort Kandooma Maldives** - 5 room types
    - South Malé Atoll, 4-star, Mid-range
    - Price range: $280-$750/night

## Room Type Details

All room types include:
- ✅ Accurate bed configurations (King Beds, Day Beds, Sofa Beds)
- ✅ Correct occupancy (adults + children)
- ✅ Detailed amenities lists
- ✅ Proper ordering for display
- ✅ `hide_price=true` (query-only pricing)
- ✅ `is_room_type=true` (display as accommodation options)

## Image Files

All resorts have the following images in `frontend/public/images/Resort Accomodation types images/`:
- Card Image (for resort cards)
- Resort Hero Banner Image 1 & 2 (for gallery)
- Individual room type images (matching room names)

**Note:** Some resorts use different image formats:
- Most: `.jpg`
- Velassaru: `.webp`
- Kuramathi: `.jpg`, `.webp`
- Kurumba: `.jpg`, `.png`, `.jpeg`
- Holiday Inn: `.avif`, `.webp`, `.jpg`

## Deployment to Production

### Step 1: Deploy Frontend (if not already done)
Ensure all images are deployed to `https://threadtravels.com/images/Resort Accomodation types images/`

### Step 2: Run Management Command on Railway
```bash
railway run python manage.py create_resorts_with_images
```

This will:
- Create 4 new resorts (Cinnamon Velifushi, Cinnamon Hakuraa Huraa, Ellaidhoo, Villa Nautica)
- Update 6 existing resorts with new data (Cinnamon Dhonveli, Velassaru, Kuramathi, Kurumba, Dhigufaru, Holiday Inn)
- Create 70 new room types
- Set all to `is_room_type=true` and `hide_price=true`

### Step 3: Add Card Images to Gallery
```bash
railway run python manage.py add_card_images_to_gallery
```

This adds the Card Image URL to each resort's `gallery_images` field.

### Step 4: Add Room Type Image URLs
```bash
railway run python manage.py add_room_type_image_urls
```

This adds room type image URLs to the `amenities` field with the `__IMAGE_URL__:` prefix.

### Step 5: Verify
Check the frontend to ensure:
- ✅ All 18 resorts are visible (8 old + 10 new)
- ✅ Card images display correctly
- ✅ Room types show up on resort detail pages
- ✅ Room type images display correctly
- ✅ Prices are hidden (show "Contact us for pricing")
- ✅ Gallery includes hero banner images

## Database Statistics

After deployment:
- **Total Resorts:** 18 (with `is_room_type=true`)
- **Total Room Types:** 153 (83 old + 70 new)
- **All room types:** `hide_price=true`

## Notes

1. **No Image Uploads to Railway:** Images are referenced directly from the frontend URL to avoid ephemeral filesystem issues.

2. **Image URL Strategy:** 
   - Card images: In `gallery_images` JSON field
   - Room type images: In `amenities` JSON field with `__IMAGE_URL__:` prefix
   - Serializers handle extraction and filtering

3. **Price Display:** All prices are hidden on frontend and in WhatsApp messages due to `hide_price=true`.

4. **Future Updates:** When actual prices are available, simply set `hide_price=false` for specific room types.

## Troubleshooting

If images don't show:
1. Verify frontend deployment is complete
2. Check image URLs are accessible at `https://threadtravels.com/images/...`
3. Run `add_card_images_to_gallery` and `add_room_type_image_urls` again
4. Check browser console for 404 errors on image URLs
5. Verify image file extensions match (case-sensitive on some servers)

