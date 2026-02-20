# Competencies Seeding Guide

This guide explains how to seed competencies data into the MongoDB database for the CAATE-ITRMS system.

## Overview

The competencies seeder populates the `competencies` collection with Basic, Common, and Core competencies for all 10 courses offered by CAATE.

## Database Structure

Each competency document contains:

- `course_code`: Unique identifier matching the course (e.g., "NC II - SOCBCN220")
- `course_title`: Full name of the course
- `basic_competencies`: Array of basic competency descriptions
- `common_competencies`: Array of common competency descriptions
- `core_competencies`: Array of core competency descriptions
- `created_at`: Timestamp of creation
- `updated_at`: Timestamp of last update

## Courses Included

1. **Beauty Care (Nail Care) Services NC II** - 11 total competencies
2. **Beauty Care (Skin Care) Services NC II** - 16 total competencies
3. **Aesthetic Services Level III** - 17 total competencies
4. **Advanced Skin Care Services Level III** - 18 total competencies
5. **Permanent Make-Up Tattoo Services Level III** - 17 total competencies
6. **Perform Collagen Induction Therapy & Hair Loss Treatment** - 2 core competencies
7. **Perform Advanced Facial Treatment & Chemical Skin Peeling** - 2 core competencies
8. **Perform Light Therapy & Heat Therapy** - 4 core competencies
9. **Trainers Methodology Level I** - 18 total competencies
10. **Eyelash and Eyebrow Services Level III** - 16 total competencies

## How to Run

### Method 1: Using Batch File (Windows)

```bash
cd backend
seed_competencies.bat
```

### Method 2: Using PHP Directly

```bash
cd backend
php seed_competencies.php
```

## Prerequisites

1. MongoDB must be running on `127.0.0.1:27017` (or configured in `.env`)
2. PHP must be installed and accessible from command line
3. MongoDB PHP extension must be installed
4. Composer dependencies must be installed (`composer install`)

## What Happens During Seeding

1. Connects to MongoDB database `CAATE-ITRMS`
2. Clears existing data in the `competencies` collection
3. Inserts 10 course competency documents
4. Displays progress for each course with competency counts
5. Shows summary of total records inserted

## Sample Output

```
Clearing existing competencies...
Inserting competencies...

✓ Inserted: Beauty Care (Nail Care) Services NC II
  - Basic: 4 | Common: 4 | Core: 3 | Total: 11

✓ Inserted: Beauty Care (Skin Care) Services NC II
  - Basic: 9 | Common: 4 | Core: 3 | Total: 16

...

========================================
Seeding completed successfully!
Total course competencies inserted: 10
========================================
```

## Modifying the Data

To add or modify competencies:

1. Open `backend/seed_competencies.php`
2. Locate the `$competencies` array
3. Add/modify competency entries
4. Run the seeder again

## Troubleshooting

### MongoDB Connection Error

- Ensure MongoDB is running: `mongod --version`
- Check connection settings in `.env` file
- Verify database name is `CAATE-ITRMS`

### PHP MongoDB Extension Missing

```bash
# Install MongoDB PHP extension
pecl install mongodb
```

### Composer Dependencies Missing

```bash
cd backend
composer install
```

## Integration with Frontend

The competencies can be fetched via API endpoints (to be created in `routes/api.php`):

```php
// Example API endpoint
GET /api/competencies
GET /api/competencies/{course_code}
```

## Notes

- The seeder clears existing data before inserting. Comment out `deleteMany([])` to preserve existing records.
- Course codes must match those in the `courses` collection for proper linking.
- Timestamps are automatically added using MongoDB's UTCDateTime.
