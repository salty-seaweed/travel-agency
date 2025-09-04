Media Management Guide

Overview
- Media assets are stored as `MediaAsset` records (file, alt text, caption, size, mime_type, dimensions).
- Frontend `MediaLibrary` supports upload (drag-and-drop, multi-select) and selection for assignment.
- Assignments: page heroes, destinations, experiences, and package images can use uploaded assets.

Key Flows
- Upload: Frontend uploads to `POST /api/media/` (FormData). Backend returns `file_url` and metadata.
- Select: Components receive an asset and use `asset.file_url`.
- Destinations/Experiences: Accept either a file upload or a URL via `image` field.
- Packages: Use `POST /api/package-images/` with either `image` file or `image_url_field` from MediaLibrary.

Endpoints
- GET/POST/PUT/DELETE `/api/media/`
- GET/POST/PUT/DELETE `/api/page-heroes/`
- GET/POST/PUT/DELETE `/api/destinations/`
- GET/POST/PUT/DELETE `/api/experiences/`
- GET/POST/PUT/DELETE `/api/package-images/`

Frontend Notes
- Always use `getApiUrl('endpoint/...')` for requests.
- `MediaLibrary.tsx` provides `onSelect(asset)` and supports `usageContext` hints.
- `ImagePicker` wraps `MediaLibrary` for a simple single-image selector.

Backend Notes
- `MediaAssetSerializer` computes absolute `file_url`/`thumbnail_url` and sets `mime_type`, size, and dimensions.
- `DestinationSerializer` and `ExperienceSerializer` accept both files and URLs via `FlexibleImageField`.
- `PackageImageViewSet` supports creating images from a `image_url_field`.

Troubleshooting
- If images show as `null/NaN`, ensure API returns `file_url` and `file_size`; clear cache and refresh.
- Verify `MEDIA_URL` and `MEDIA_ROOT` are correctly configured and exposed.

