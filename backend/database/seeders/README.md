# Database Seeders

This directory contains database seeding scripts for the CAATE-ITRMS system.

## Available Seeders

### 1. ComprehensiveSampleData.php

Seeds the database with initial sample data including:

- Users (admin, staff, instructor)
- Courses (5 beauty care courses)
- Trainees (5 initial trainees)
- Enrollments
- Inventory items
- Applications
- Graduates

### 2. AddTraineeAccounts.php

Adds 10 new trainee accounts with randomized passwords.

Features:

- Auto-generates unique trainee IDs
- Creates randomized secure passwords
- Includes complete trainee information
- Displays credentials after creation

## Running Seeders

### Prerequisites

- PHP 7.4 or higher
- MongoDB connection configured
- Composer dependencies installed

### Execute Seeders

From the `backend` directory:

```bash
# Run comprehensive sample data seeder
php database/seeders/ComprehensiveSampleData.php

# Add 10 trainee accounts
php database/seeders/AddTraineeAccounts.php
```

### Output

The AddTraineeAccounts seeder will display:

- Creation status for each trainee
- Complete credentials table with:
  - Trainee ID
  - Full name
  - Email
  - Plain text password (save these!)

## Important Notes

⚠️ **Security Warning**: The displayed passwords are shown in plain text only during seeding. Make sure to:

- Save the credentials securely
- Share them through secure channels
- Consider implementing a password reset mechanism

## Trainee Account Structure

```php
[
    'trainee_id' => 'TRN-2024-XXX',
    'first_name' => 'FirstName',
    'last_name' => 'LastName',
    'email' => 'email@example.com',
    'password' => 'hashed_password',
    'phone' => '09171234567',
    'address' => 'Complete Address',
    'date_of_birth' => UTCDateTime,
    'gender' => 'Male/Female',
    'status' => 'active',
    'created_at' => UTCDateTime,
    'updated_at' => UTCDateTime
]
```

## Troubleshooting

### Connection Issues

- Verify MongoDB is running
- Check database configuration in `app/config/database.php`
- Ensure proper credentials in `.env` file

### Duplicate Entries

- Seeders check for existing records before inserting
- Duplicate trainee IDs will be skipped with a warning

### Permission Issues

- Ensure PHP has write permissions
- Check MongoDB user permissions
