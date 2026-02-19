# Fix: E11000 Duplicate Key Error

## The Error

```
E11000 duplicate key error collection: CAATE-ITRMS.courses index: course_code_1 dup key: { course_code: null }
```

## What This Means

MongoDB has a unique index on the `course_code` field, but your seed data uses `badge` instead. When inserting documents without a `course_code` field, MongoDB sets it to `null`, and the unique index prevents multiple `null` values.

## Quick Fix (Easiest Solution)

Visit this page in your browser:

```
http://localhost/CAATE-ITRMS/backend/public/fix_and_seed.php
```

Click "Fix & Seed Database" - this will:

1. Drop the problematic index
2. Clear existing courses
3. Insert all 10 courses with both `badge` and `course_code` fields

## Alternative: Manual Fix

### Option 1: Drop the Index via Command Line

```bash
cd C:\xampp\htdocs\CAATE-ITRMS\backend
php fix_courses_index.php
```

Then run the seed script again:

```bash
php seed_courses.php
```

### Option 2: Drop Index via MongoDB Compass

1. Open MongoDB Compass
2. Connect to `mongodb://localhost:27017`
3. Select database: `CAATE-ITRMS`
4. Select collection: `courses`
5. Go to "Indexes" tab
6. Delete the `course_code_1` index
7. Run the seed script again

## What Was Fixed

The seed data now includes both fields for compatibility:

- `badge` - Used by the frontend (e.g., "NC II - SOCBCN220", "Level III")
- `course_code` - Used by the database index (unique identifier)
- `hours` - Used by the frontend (e.g., "307 Hours (39 Days)")
- `duration` - Alternative field name for compatibility

## Verify the Fix

After running the fix, check:

1. Visit: `http://localhost/CAATE-ITRMS/admin/src/pages/courses.html`
2. You should see all 10 courses displayed
3. Each course should have proper badge colors:
   - NC II courses: Blue
   - Level III courses: Cyan
   - Specialized courses: Yellow
   - Level I courses: Gray

## Files Created

- `backend/public/fix_and_seed.php` - One-click fix and seed
- `backend/fix_courses_index.php` - Drop index script
- `backend/seed_courses.php` - Updated with both field names

## Prevention

To avoid this in the future:

1. Always check existing indexes before creating seed data
2. Use consistent field names across your application
3. Document required fields in your data model

## Still Having Issues?

If you still see the error:

1. Make sure MongoDB server is running
2. Check that you have write permissions to the database
3. Try dropping the entire collection and recreating it:
   ```javascript
   // In MongoDB shell or Compass
   db.courses.drop();
   ```
4. Then run the seed script again
