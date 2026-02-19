# Seeding Courses to MongoDB

This guide explains how to populate your MongoDB database with the 10 CAATE courses.

## Prerequisites

- PHP installed with MongoDB extension
- MongoDB server running
- Database connection configured in `app/config/database.php`

## Steps to Seed Courses

### Option 1: Run via Command Line

```bash
cd backend
php seed_courses.php
```

### Option 2: Run via Browser

Navigate to:

```
http://localhost/CAATE-ITRMS/backend/seed_courses.php
```

## What Gets Seeded

The script will insert 10 courses into the `courses` collection:

1. Beauty Care (Nail Care) Services NC II
2. Beauty Care (Skin Care) Services NC II
3. Aesthetic Services Level III
4. Advanced Skin Care Services Level III
5. Permanent Make-Up Tattoo Services Level III
6. Perform Collagen Induction Therapy & Hair Loss Treatment
7. Perform Advanced Facial Treatment & Chemical Skin Peeling
8. Perform Light Therapy & Heat Therapy
9. Trainers Methodology Level I
10. Eyelash and Eyebrow Services Level III

## Data Structure

Each course contains:

- `badge`: Course code/level (e.g., "NC II - SOCBCN220", "Level III", "Specialized")
- `title`: Course name
- `description`: Course description
- `hours`: Duration (e.g., "307 Hours (39 Days)")
- `image`: Course image URL
- `created_at`: Timestamp
- `updated_at`: Timestamp

## Verification

After seeding, you can verify the courses by:

1. Opening the admin courses page: `http://localhost/CAATE-ITRMS/admin/src/pages/courses.html`
2. The page should display all 10 courses with proper styling
3. Each course should have the correct badge color:
   - NC II courses: Blue (primary)
   - Level III courses: Cyan (info)
   - Level I courses: Gray (secondary)
   - Specialized courses: Yellow (warning)

## Troubleshooting

If courses don't appear:

1. Check browser console for errors
2. Verify MongoDB connection in `app/config/database.php`
3. Ensure the API endpoint is accessible: `http://localhost/CAATE-ITRMS/backend/public/api/v1/courses`
4. Check that the courses collection exists in MongoDB

## Re-seeding

To clear and re-seed courses, uncomment this line in `seed_courses.php`:

```php
$coursesCollection->deleteMany([]);
```

This will delete all existing courses before inserting new ones.
