# Testing Image Upload for Courses

## Quick Test Steps

### 1. Start the Application

```bash
# Start MongoDB (if not running)
mongod

# Start PHP backend
cd backend/public
php -S localhost:80

# Open the admin panel
# Navigate to: admin/src/pages/courses.html
```

### 2. Test Image Upload

#### Test Case 1: Upload New Image

1. Open courses.html in browser
2. Click "Edit" on any course card
3. Click the upload area or drag an image file
4. Verify:
   - ✓ Image preview appears
   - ✓ View and Remove buttons are visible
   - ✓ File size validation works (try > 5MB)
5. Click "Save Changes"
6. Verify:
   - ✓ Success toast appears
   - ✓ Modal closes
   - ✓ Course card shows new image

#### Test Case 2: View Full Image

1. Edit a course with an image
2. Click the eye icon (👁️) on the preview
3. Verify:
   - ✓ Modal opens with full-size image
   - ✓ Image is clear and properly sized
4. Close the preview modal
5. Verify:
   - ✓ Edit modal is still open
   - ✓ Form data is preserved

#### Test Case 3: Remove Image

1. Edit a course with an image
2. Click the trash icon (🗑️) on the preview
3. Verify:
   - ✓ Preview clears
   - ✓ "No image selected" text appears
4. Save the course
5. Verify:
   - ✓ Course card shows default placeholder

#### Test Case 4: Replace Existing Image

1. Edit a course that already has an image
2. Upload a different image
3. Verify:
   - ✓ Old image is replaced in preview
   - ✓ New image appears immediately
4. Save changes
5. Verify:
   - ✓ Course card shows new image

#### Test Case 5: Drag & Drop

1. Edit any course
2. Drag an image file from your file explorer
3. Drop it on the upload area
4. Verify:
   - ✓ Upload area highlights during drag
   - ✓ Image preview appears after drop
   - ✓ Same behavior as click-to-upload

### 3. Validation Tests

#### File Size Validation

```
Test: Upload 6MB image
Expected: Error toast "Image size must be less than 5MB"
```

#### File Type Validation

```
Test: Upload .pdf or .txt file
Expected: Error toast "Please select a valid image file"
```

#### Required Fields Validation

```
Test: Clear title field and save
Expected: Error toast "Please fill in all required fields"
```

### 4. Database Verification

Check MongoDB to verify image is stored:

```javascript
// Connect to MongoDB
use caate_itrms

// Find a course with image
db.courses.findOne({ image: { $exists: true, $ne: "" } })

// Verify image field contains base64 data
// Should start with: "data:image/png;base64,..." or "data:image/jpeg;base64,..."
```

### 5. API Testing

Test the API directly:

```bash
# Get all courses
curl http://localhost/CAATE-ITRMS/backend/public/api/v1/courses

# Update course with image
curl -X PUT http://localhost/CAATE-ITRMS/backend/public/api/v1/courses/{id} \
  -H "Content-Type: application/json" \
  -d '{
    "badge": "NC II",
    "title": "Test Course",
    "description": "Test Description",
    "hours": "100 Hours",
    "image": "data:image/png;base64,iVBORw0KGgo..."
  }'
```

### 6. Browser Console Checks

Open browser DevTools (F12) and check:

#### Console Tab

- No JavaScript errors
- Successful API responses
- Proper base64 conversion logs

#### Network Tab

- PUT request to `/api/v1/courses/{id}`
- Request payload includes `image` field
- Response status: 200 OK
- Response body: `{"success": true, ...}`

#### Application Tab

- Check localStorage (if used)
- Verify no CORS errors

### 7. Visual Verification

Check the UI for:

- ✓ Images display correctly in course cards
- ✓ Images maintain aspect ratio (object-fit: cover)
- ✓ No broken image icons
- ✓ Smooth transitions and animations
- ✓ Responsive design on mobile

### 8. Edge Cases

#### Empty Image Field

```
Test: Edit course, remove image, save
Expected: Course saves with empty image field, shows placeholder
```

#### Very Small Image

```
Test: Upload 10x10 pixel image
Expected: Image uploads and displays (may look pixelated)
```

#### Very Large Dimensions

```
Test: Upload 5000x5000 pixel image (under 5MB)
Expected: Image uploads, displays with proper scaling
```

#### Special Characters in Filename

```
Test: Upload "image (1) - copy.png"
Expected: Image uploads successfully
```

### 9. Performance Testing

```
Test: Upload multiple images in sequence
Expected: Each upload completes without memory leaks
```

```
Test: Load page with 10+ courses with images
Expected: Page loads within 3 seconds
```

### 10. Cross-Browser Testing

Test in:

- ✓ Chrome/Edge (Chromium)
- ✓ Firefox
- ✓ Safari (if available)

## Expected Results Summary

All tests should pass with:

- No console errors
- Proper validation messages
- Smooth user experience
- Images stored in MongoDB
- Images display correctly
- Fallback to placeholder when needed

## Common Issues & Solutions

### Issue: Image not displaying

**Solution**: Check if base64 string is complete and valid

### Issue: Upload fails silently

**Solution**: Check browser console and network tab for errors

### Issue: Image too large error

**Solution**: Compress image or reduce dimensions

### Issue: Modal backdrop issues

**Solution**: Check Bootstrap version and modal event handlers

## Success Criteria

✅ All test cases pass
✅ No console errors
✅ Images stored in MongoDB
✅ Images display in course cards
✅ Validation works correctly
✅ User feedback is clear
✅ Performance is acceptable

## Next Steps After Testing

If all tests pass:

1. Document any issues found
2. Test with real course images
3. Train users on the feature
4. Monitor for any production issues

If tests fail:

1. Note which test failed
2. Check browser console
3. Review error messages
4. Check backend logs
5. Verify MongoDB connection
