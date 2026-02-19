# Duplicate Key Error - FIXED ✅

## The Problem

You were getting this error:

```
E11000 duplicate key error collection: CAATE-ITRMS.courses index: course_code_1 dup key: { course_code: null }
```

## What Caused It

MongoDB had a unique index on the `course_code` field, but the seed data was using `badge` instead. When trying to insert multiple courses without a `course_code`, MongoDB saw them all as having `course_code: null`, which violated the unique constraint.

## The Fix

I've updated both seed scripts to:

1. **Drop the old index** before seeding
2. **Include both fields** for backward compatibility:
   - `badge` - For display (e.g., "NC II - SOCBCN220", "Level III")
   - `course_code` - For database uniqueness (e.g., "NC II - SOCBCN220", "AESTHETIC-L3")
   - `hours` - For display (e.g., "307 Hours (39 Days)")
   - `duration` - For backward compatibility

## Files Updated

- ✅ `backend/seed_courses.php` - CLI seed script
- ✅ `backend/public/seed.php` - Web-based seed interface

## How to Use Now

### Option 1: Web Interface (Easiest)

1. Visit: `http://localhost/CAATE-ITRMS/backend/public/seed.php`
2. Click "🚀 Seed Database"
3. Done!

### Option 2: Command Line

```bash
cd C:\xampp\htdocs\CAATE-ITRMS\backend
php seed_courses.php
```

## What Changed in the Data

Each course now has:

```php
[
    'badge' => 'NC II - SOCBCN220',        // Display badge
    'course_code' => 'NC II - SOCBCN220',  // Unique identifier
    'title' => 'Beauty Care (Nail Care) Services NC II',
    'description' => '...',
    'hours' => '307 Hours (39 Days)',      // Display duration
    'duration' => '307 Hours (39 Days)',   // Backward compatibility
    'image' => 'https://...'
]
```

## Unique Course Codes Assigned

1. `NC II - SOCBCN220` - Beauty Care (Nail Care) Services NC II
2. `NC II - SOCBEC219` - Beauty Care (Skin Care) Services NC II
3. `AESTHETIC-L3` - Aesthetic Services Level III
4. `SKINCARE-ADV-L3` - Advanced Skin Care Services Level III
5. `MAKEUP-TATTOO-L3` - Permanent Make-Up Tattoo Services Level III
6. `COLLAGEN-SPEC` - Collagen Induction Therapy & Hair Loss Treatment
7. `FACIAL-PEELING-SPEC` - Advanced Facial Treatment & Chemical Skin Peeling
8. `LIGHT-HEAT-SPEC` - Light Therapy & Heat Therapy
9. `TRAINERS-L1` - Trainers Methodology Level I
10. `EYELASH-BROW-L3` - Eyelash and Eyebrow Services Level III

## Verify It Works

After seeding:

1. Visit: `http://localhost/CAATE-ITRMS/admin/src/pages/courses.html`
2. You should see all 10 courses with proper badge colors
3. Try editing a course - it should work without errors

## If You Still Get Errors

Run the index fix script:

```bash
cd C:\xampp\htdocs\CAATE-ITRMS\backend
php fix_courses_index.php
```

Then run the seed script again.

## Success! 🎉

Your courses should now seed successfully without any duplicate key errors!
