# Dual Collection Update for Competencies

## Overview

When competencies are updated through the Edit Competencies modal in the admin interface, the changes are automatically synchronized to BOTH collections:

1. **courses collection** - Stores competencies as arrays within each course document
2. **competencies collection** - Stores individual competency documents for detailed querying

## How It Works

### Frontend (admin/src/assets/js/competencies.js)

- User edits competencies in the modal
- JavaScript sends PUT request to `/api/v1/courses/{id}` with updated competency arrays
- No changes needed in frontend code

### Backend (backend/app/models/Course.php)

The `update()` method now includes automatic synchronization:

1. Updates the course document in the `courses` collection
2. Detects if competencies were modified
3. If modified, calls `syncCompetenciesToCollection()` which:
   - Deletes all existing competency documents for that course
   - Inserts new competency documents based on updated arrays
   - Maintains the structure: `{course_code, course_title, competency_type, competency_name, created_at, updated_at}`

## Data Structure

### courses collection

```json
{
  "_id": ObjectId("..."),
  "course_code": "NC II - SOCBCN220",
  "course_title": "Beauty Care (Nail Care) Services NC II",
  "basic_competencies": [
    "Participate in workplace communication",
    "Work in a team environment"
  ],
  "common_competencies": [
    "Maintain an effective relationship with clients/customers"
  ],
  "core_competencies": [
    "Perform manicure and pedicure"
  ],
  "created_at": ISODate("..."),
  "updated_at": ISODate("...")
}
```

### competencies collection

```json
{
  "_id": ObjectId("..."),
  "course_code": "NC II - SOCBCN220",
  "course_title": "Beauty Care (Nail Care) Services NC II",
  "competency_type": "Basic",
  "competency_name": "Participate in workplace communication",
  "created_at": ISODate("..."),
  "updated_at": ISODate("...")
}
```

## Verification

Run the verification script to check if both collections are in sync:

```bash
cd backend
php verify_dual_update.php
```

Or use the batch file:

```bash
cd backend
.\verify_dual_update.bat
```

## Benefits

1. **Flexibility** - Query competencies as arrays (courses collection) or individual documents (competencies collection)
2. **Consistency** - Both collections stay synchronized automatically
3. **Performance** - Courses collection provides fast access to all competencies for a course
4. **Detailed Queries** - Competencies collection allows filtering by competency type or name across all courses

## Error Handling

- If syncing to competencies collection fails, the main course update still succeeds
- Errors are logged but don't interrupt the user experience
- The `course_code` field is required for syncing to work
