# Database Migrations

This directory contains database migration scripts for the CAATE-ITRMS system.

## Available Migrations

### RemoveTraineeStatusField.php

Removes the `status` field from all trainee documents in the trainees collection.

**What it does:**

- Removes the `status` field from all existing trainee documents
- Drops the `status` index from the trainees collection
- Reports the number of documents modified

**How to run:**

```bash
cd backend/database/migrations
php RemoveTraineeStatusField.php
```

**Expected output:**

```
Starting migration: Remove status field from trainees collection...

Found X trainee documents with status field
✓ Removed status field from X documents
✓ Dropped status index from trainees collection

✅ Migration completed successfully!
Total trainees in database: X
```

## Important Notes

- Always backup your database before running migrations
- Migrations are designed to be run once
- Check the migration output to ensure it completed successfully
- If a migration fails, check the error message and resolve any issues before re-running
