# Database Migrations

This folder contains migration scripts for updating the database schema and data.

## Available Migrations

### migrate_student_id_to_trainee_id.php

Renames the `student_id` field to `trainee_id` in the trainees collection.

**How to run:**

```bash
cd backend/database/migrations
php migrate_student_id_to_trainee_id.php
```

**What it does:**

- Finds all documents in the `trainees` collection with a `student_id` field
- Renames `student_id` to `trainee_id` for all matching documents
- Verifies the migration was successful

**Safe to run multiple times:** Yes, the script checks if documents need migration before proceeding.

## Notes

- Always backup your database before running migrations
- Migrations are designed to be idempotent (safe to run multiple times)
- Check the output to verify the migration completed successfully
