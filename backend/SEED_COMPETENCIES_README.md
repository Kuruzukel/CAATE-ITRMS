# Seed Competencies to MongoDB

This script will populate the `competencies` collection in your `CAATE-ITRMS` MongoDB database with all the competencies extracted from your courses.

## Prerequisites

1. MongoDB must be running on your system
2. PHP must be installed with MongoDB extension
3. Composer dependencies must be installed

## What Gets Seeded

The script will insert competencies for all 10 courses:

1. **Beauty Care (Nail Care) Services NC II** - 11 competencies (4 Basic, 4 Common, 3 Core)
2. **Beauty Care (Skin Care) Services NC II** - 16 competencies (9 Basic, 4 Common, 3 Core)
3. **Aesthetic Services Level III** - 17 competencies (9 Basic, 4 Common, 4 Core)
4. **Advanced Skin Care Services Level III** - 18 competencies (9 Basic, 4 Common, 5 Core)
5. **Permanent Make-Up Tattoo Services Level III** - 17 competencies (9 Basic, 4 Common, 4 Core)
6. **Perform Collagen Induction Therapy & Hair Loss Treatment** - 2 competencies (Core only)
7. **Perform Advanced Facial Treatment & Chemical Skin Peeling** - 2 competencies (Core only)
8. **Perform Light Therapy & Heat Therapy** - 4 competencies (Core only)
9. **Trainers Methodology Level I** - 18 competencies (12 Basic, 6 Core)
10. **Eyelash and Eyebrow Services Level III** - 16 competencies (9 Basic, 4 Common, 3 Core)

**Total: 121 competencies**

## Document Structure

Each competency document contains:

```json
{
  "course_code": "NC II - SOCBCN220",
  "course_title": "Beauty Care (Nail Care) Services NC II",
  "competency_type": "Basic|Common|Core",
  "competency_name": "Participate in workplace communication",
  "created_at": ISODate("2024-01-01T00:00:00.000Z"),
  "updated_at": ISODate("2024-01-01T00:00:00.000Z")
}
```

## How to Run

### Option 1: Command Line (Recommended)

```bash
cd backend
php seed_competencies.php
```

### Option 2: Via Browser

Navigate to:

```
http://localhost/backend/public/seed_competencies.php
```

(You'll need to copy the script to the public folder first)

## What the Script Does

1. Connects to MongoDB database `CAATE-ITRMS`
2. Clears existing competencies (optional - can be commented out)
3. Inserts all 121 competencies
4. Creates indexes on:
   - `course_code`
   - `competency_type`
   - `course_code + competency_type` (compound index)

## Indexes Created

The script creates the following indexes for optimal query performance:

- `course_code_1` - For filtering by course
- `competency_type_1` - For filtering by type (Basic/Common/Core)
- `course_code_1_competency_type_1` - For combined filtering

## Querying Competencies

### Get all competencies for a course:

```javascript
db.competencies.find({ course_code: "NC II - SOCBCN220" });
```

### Get only Core competencies:

```javascript
db.competencies.find({ competency_type: "Core" });
```

### Get Basic competencies for a specific course:

```javascript
db.competencies.find({
  course_code: "AESTHETIC-L3",
  competency_type: "Basic",
});
```

### Count competencies by type:

```javascript
db.competencies.aggregate([
  { $group: { _id: "$competency_type", count: { $sum: 1 } } },
]);
```

## Troubleshooting

### MongoDB Connection Error

- Ensure MongoDB is running: `mongod --version`
- Check connection settings in `backend/.env`

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

## Notes

- The script will DELETE all existing competencies before inserting new ones
- To preserve existing data, comment out the line: `$collection->deleteMany([]);`
- Each competency is stored as a separate document for flexibility
- Course codes match those in the `courses` collection

## Next Steps

After seeding, you can:

1. View competencies in MongoDB Compass
2. Query them via your API endpoints
3. Display them in your admin/trainee interfaces
4. Link them to student assessments and progress tracking
