# Courses Image Upload Feature - Complete Guide

## Overview

Your courses collection now fully supports image uploads! You can upload images directly from the courses.html page, and they will be stored in MongoDB as base64-encoded strings or URLs.

## Features Implemented

### 1. Image Upload Interface

- **Drag & Drop**: Drag image files directly onto the upload area
- **Click to Upload**: Click the upload area to browse and select files
- **Live Preview**: See your image immediately after selection
- **File Validation**:
  - Maximum file size: 5MB
  - Supported formats: JPG, PNG, GIF
  - Real-time validation with error messages

### 2. Image Management

- **View Full Image**: Click the eye icon to view the full-size image in a modal
- **Remove Image**: Click the trash icon to remove the selected image
- **Replace Image**: Upload a new image to replace the existing one
- **Keep Existing**: Save without uploading to keep the current image

### 3. Storage Options

The system supports two types of image storage:

#### Option A: Base64 Encoding (Current Implementation)

- Images are converted to base64 strings
- Stored directly in MongoDB
- No external file storage needed
- Ideal for small to medium images

#### Option B: URL References (Seeded Data)

- Store image URLs from external sources
- Smaller database footprint
- Requires external hosting
- Used in the seed data

## How to Use

### Editing a Course with Image Upload

1. **Open the Courses Page**
   - Navigate to Training Catalog > Courses
   - Wait for courses to load

2. **Click Edit on Any Course**
   - Click the "Edit" button on a course card
   - The edit modal will open with current course data

3. **Upload a New Image**
   - **Method 1 - Click**: Click the upload area and select an image file
   - **Method 2 - Drag & Drop**: Drag an image file onto the upload area
   - The image will preview immediately

4. **Manage the Image**
   - **View**: Click the eye icon to see full-size preview
   - **Remove**: Click the trash icon to remove the image
   - **Replace**: Upload a different image to replace it

5. **Save Changes**
   - Click "Save Changes" button
   - The button shows a loading spinner while saving
   - Success notification appears when complete
   - Modal closes automatically

### Image Validation

The system validates images before upload:

```javascript
✓ File size must be less than 5MB
✓ File must be a valid image (JPG, PNG, GIF)
✓ File type is checked before processing
✓ Error messages shown for invalid files
```

## Technical Details

### Frontend (courses.js)

**Key Functions:**

- `initializeEditImageUpload()` - Sets up drag & drop and click handlers
- `handleEditImageFile(file)` - Validates and previews images
- `loadExistingImage(imageUrl)` - Loads existing images from database
- `resetEditImagePreview()` - Clears image preview
- `updateCourse(courseData)` - Sends image data to backend

**Image Processing:**

```javascript
// Convert image to base64
const reader = new FileReader();
reader.onload = async function (e) {
  courseData.image = e.target.result; // base64 string
  await updateCourse(courseData);
};
reader.readAsDataURL(editImageFile);
```

### Backend (CourseController.php)

**Update Endpoint:**

```php
PUT /api/v1/courses/{id}

// Accepts JSON with image field
{
    "badge": "NC II - SOCBCN220",
    "title": "Course Title",
    "description": "Course description",
    "hours": "307 Hours (39 Days)",
    "image": "data:image/jpeg;base64,/9j/4AAQ..." // base64 or URL
}
```

### MongoDB Schema

**Course Document:**

```json
{
    "_id": ObjectId("..."),
    "badge": "NC II - SOCBCN220",
    "course_code": "NC II - SOCBCN220",
    "title": "Beauty Care (Nail Care) Services NC II",
    "description": "Master professional nail care techniques...",
    "hours": "307 Hours (39 Days)",
    "duration": "307 Hours (39 Days)",
    "image": "data:image/jpeg;base64,..." or "https://...",
    "created_at": ISODate("2024-01-01T00:00:00.000Z"),
    "updated_at": ISODate("2024-01-01T00:00:00.000Z")
}
```

## UI Components

### Upload Area

```html
<div class="upload-area" id="editUploadArea">
  <i class="bx bx-cloud-upload"></i>
  <p>Drag and drop your image here or click to select</p>
  <small>Supported formats: JPG, PNG, GIF (Max 5MB)</small>
  <input type="file" id="editImageInput" accept="image/*" />
</div>
```

### Image Preview Section

```html
<div class="image-preview-section">
  <div class="image-preview-container">
    <div id="editNoImageText">No image selected</div>
    <img id="editImagePreview" class="image-preview" />
    <div class="image-action-buttons">
      <button id="editViewImageBtn">👁️ View</button>
      <button id="editRemoveImageBtn">🗑️ Remove</button>
    </div>
  </div>
</div>
```

## User Experience Enhancements

### Visual Feedback

- ✅ Loading spinner while saving
- ✅ Success/error toast notifications
- ✅ File size display in notifications
- ✅ Drag & drop visual feedback
- ✅ Image preview with action buttons
- ✅ Modal reset on close

### Error Handling

- ✅ File size validation (5MB max)
- ✅ File type validation (images only)
- ✅ Network error handling
- ✅ Graceful fallback for broken images
- ✅ User-friendly error messages

## Testing the Feature

### Test Case 1: Upload New Image

1. Click Edit on any course
2. Upload a new image (< 5MB)
3. Verify preview appears
4. Click Save Changes
5. Verify course card shows new image

### Test Case 2: Replace Existing Image

1. Click Edit on a course with an image
2. Upload a different image
3. Verify new preview replaces old
4. Click Save Changes
5. Verify course card updates

### Test Case 3: Remove Image

1. Click Edit on a course with an image
2. Click the trash icon
3. Verify preview clears
4. Click Save Changes
5. Verify course card shows default image

### Test Case 4: Validation

1. Try uploading a file > 5MB
2. Verify error message appears
3. Try uploading a non-image file
4. Verify error message appears

### Test Case 5: Cancel Changes

1. Click Edit on any course
2. Upload a new image
3. Click Cancel
4. Verify modal closes without saving
5. Verify course card unchanged

## Troubleshooting

### Image Not Displaying

- Check browser console for errors
- Verify image URL or base64 string is valid
- Check MongoDB document has `image` field
- Verify API endpoint is returning image data

### Upload Fails

- Check file size (must be < 5MB)
- Verify file is a valid image format
- Check network connection
- Verify backend API is running

### Preview Not Showing

- Check browser console for errors
- Verify FileReader API is supported
- Check image file is not corrupted
- Clear browser cache and retry

## Best Practices

### For Base64 Storage

- Keep images under 2MB for optimal performance
- Compress images before upload
- Use appropriate image formats (JPEG for photos, PNG for graphics)

### For URL Storage

- Use reliable image hosting services
- Ensure URLs are accessible
- Use HTTPS URLs for security
- Consider CDN for better performance

## Future Enhancements

Potential improvements you could add:

1. **Image Compression**: Automatically compress images before upload
2. **Multiple Images**: Support image galleries for courses
3. **Crop Tool**: Allow users to crop images before saving
4. **Bulk Upload**: Upload images for multiple courses at once
5. **External Storage**: Integrate with cloud storage (AWS S3, Cloudinary)
6. **Image Optimization**: Automatically optimize images for web
7. **Thumbnail Generation**: Create thumbnails for faster loading

## Summary

Your courses collection is now fully equipped with image upload functionality! The system:

- ✅ Accepts image uploads via drag & drop or click
- ✅ Validates file size and type
- ✅ Provides live preview
- ✅ Stores images in MongoDB (base64 or URL)
- ✅ Handles errors gracefully
- ✅ Provides excellent user feedback

The feature is production-ready and fully integrated with your existing course management system.
