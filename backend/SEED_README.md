# Database Seeding Instructions

## Seeding Courses Collection

This script will populate your MongoDB `courses` collection with 10 predefined courses.

### Prerequisites

- PHP installed with MongoDB extension
- MongoDB server running
- Database connection configured in `app/config/database.php`

### How to Run

1. Open your terminal/command prompt

2. Navigate to the backend directory:

   ```bash
   cd backend
   ```

3. Run the seed script:
   ```bash
   php seed_courses.php
   ```

### What the Script Does

- Clears existing courses in the database (optional - you can comment out the `deleteMany` line to keep existing data)
- Inserts 10 courses with the following data:
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

### Expected Output

```
Clearing existing courses...
Inserting courses...
✓ Inserted: Beauty Care (Nail Care) Services NC II
✓ Inserted: Beauty Care (Skin Care) Services NC II
...
========================================
Seeding completed successfully!
Total courses inserted: 10
========================================
```

### Viewing the Courses

After seeding, the courses will automatically appear on:

- Admin Dashboard: `admin/src/pages/courses.html`
- The courses are fetched via API: `/api/v1/courses`

### Troubleshooting

If you encounter errors:

1. Check MongoDB connection in `app/config/database.php`
2. Ensure MongoDB server is running
3. Verify PHP MongoDB extension is installed: `php -m | grep mongodb`
4. Check file permissions on the backend directory
