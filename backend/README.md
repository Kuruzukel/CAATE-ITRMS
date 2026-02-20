# CAATE-ITRMS Backend

## Setup

### 1. Install Dependencies

```bash
composer install
```

### 2. Environment Configuration

The application uses environment variables for sensitive configuration. These are loaded from the system environment or can be set in your web server configuration.

**Required Environment Variables:**

- `DB_HOST` - MongoDB host (default: 127.0.0.1)
- `DB_PORT` - MongoDB port (default: 27017)
- `DB_NAME` - Database name (default: CAATE-ITRMS)
- `DB_USERNAME` - MongoDB username (optional)
- `DB_PASSWORD` - MongoDB password (optional)

**Setting Environment Variables:**

**For Apache (.htaccess):**

```apache
SetEnv DB_HOST "127.0.0.1"
SetEnv DB_PORT "27017"
SetEnv DB_NAME "CAATE-ITRMS"
SetEnv DB_USERNAME "your_username"
SetEnv DB_PASSWORD "your_password"
```

**For PHP-FPM (.env file):**
Create a `.env` file in the backend directory (this file is gitignored):

```
DB_HOST=127.0.0.1
DB_PORT=27017
DB_NAME=CAATE-ITRMS
DB_USERNAME=your_username
DB_PASSWORD=your_password
```

**For Windows (System Environment Variables):**

```cmd
setx DB_HOST "127.0.0.1"
setx DB_PORT "27017"
setx DB_NAME "CAATE-ITRMS"
```

### 3. Database Setup

**Seed the database:**

```bash
php seed_all.php
```

This will seed:

- Courses
- Competencies
- Sample users (admin, staff, instructor)

**Default Admin Credentials:**

- Email: admin@caate.edu
- Password: admin123

**⚠️ IMPORTANT:** Change the default admin password after first login!

## Security Notes

- Never commit `.env` files or files containing passwords/API keys
- Always use environment variables for sensitive configuration
- The `.gitignore` file is configured to exclude sensitive files
- Change default passwords in production
- Use strong passwords for database and admin accounts

## API Endpoints

Base URL: `http://localhost/CAATE-ITRMS/backend/public`

### Courses

- `GET /api/v1/courses` - Get all courses
- `GET /api/v1/courses/{id}` - Get course by ID
- `POST /api/v1/courses` - Create course
- `PUT /api/v1/courses/{id}` - Update course (also syncs competencies collection)
- `DELETE /api/v1/courses/{id}` - Delete course

### Authentication

- `POST /api/v1/auth/register` - Register new user
- `POST /api/v1/auth/login` - Login user

## Dual Collection Update

When updating course competencies through the API, the system automatically:

1. Updates the `courses` collection (competencies as arrays)
2. Syncs to the `competencies` collection (individual documents)

This ensures data consistency across both collections. API

Laravel-inspired folder structure with PHP and MongoDB for CAATE Integrated Training & Resource Management System.

## Database Configuration

**Database Name:** `CAATE-ITRMS`

## Collections

The system includes the following MongoDB collections:

### Admin Collections

- `users` - System users (admin, staff)
- `trainees` - Student/trainee records
- `courses` - Course catalog
- `enrollments` - Trainee course enrollments
- `schedules` - Class schedules
- `attendance` - Attendance records
- `competencies` - Course competencies
- `applications` - New applications
- `admissions` - Admission records
- `graduates` - Graduate records
- `inventory` - Equipment and supplies inventory
- `requests` - Trainee requests

## Folder Structure

```
backend/
├── app/
│   ├── config/          # Configuration files
│   │   ├── app.php
│   │   └── database.php
│   ├── controllers/     # API Controllers
│   │   ├── AuthController.php
│   │   └── UserController.php
│   ├── models/          # MongoDB Models
│   │   ├── User.php
│   │   ├── Trainee.php
│   │   ├── Course.php
│   │   ├── Enrollment.php
│   │   ├── Schedule.php
│   │   ├── Attendance.php
│   │   ├── Competency.php
│   │   ├── Application.php
│   │   ├── Admission.php
│   │   ├── Graduate.php
│   │   ├── Inventory.php
│   │   └── Request.php
│   ├── middleware/      # Custom middleware
│   └── helpers/         # Helper functions
│       └── JwtHelper.php
├── routes/
│   └── api.php          # API route definitions
├── public/
│   ├── index.php        # Entry point
│   └── .htaccess
├── database/
│   └── seeders/         # Database seeders
│       ├── InitializeCollections.php
│       └── SampleData.php
├── storage/
│   └── logs/            # Application logs
└── tests/               # Test files
```

## Requirements

- PHP >= 7.4
- MongoDB
- MongoDB PHP Extension
- Apache/Nginx with mod_rewrite

## Installation

1. Copy environment file:

```bash
copy .env.example .env
```

2. Configure MongoDB in `.env`:

```
DB_HOST=127.0.0.1
DB_PORT=27017
DB_NAME=CAATE-ITRMS
```

3. Install MongoDB PHP extension if not installed:

```bash
pecl install mongodb
```

4. Add to php.ini:

```
extension=mongodb
```

5. Initialize database collections:

```bash
php database/seeders/InitializeCollections.php
```

6. Seed comprehensive sample data:

```bash
php database/seeders/ComprehensiveSampleData.php
```

7. Access the backend:
   - Main page: `http://localhost/backend/public/`
   - View data: `http://localhost/backend/public/view-data.php`
   - JSON API: `http://localhost/backend/public/api-data.php`

## Sample Data

The database includes:

- 3 Users (Admin, Staff, Instructor)
- 5 Courses (Nail Care, Skin Care, Aesthetic Services, Permanent Makeup, Advanced Skin Care)
- 5 Active Trainees
- 5 Enrollments
- 5 Inventory Items
- 3 Applications
- 2 Graduates

### Sample Login Credentials

- **Email:** admin@caate.edu
- **Password:** admin123

## API Endpoints

### Authentication

- `POST /api/v1/auth/register` - Register new user
- `POST /api/v1/auth/login` - User login
- `POST /api/v1/auth/logout` - User logout

### Users

- `GET /api/v1/users` - Get all users
- `GET /api/v1/users/{id}` - Get user by ID
- `POST /api/v1/users` - Create user
- `PUT /api/v1/users/{id}` - Update user
- `DELETE /api/v1/users/{id}` - Delete user

## Sample Credentials

After running the sample data seeder:

- **Email:** admin@caate.edu
- **Password:** admin123

## Usage Example

### Register User

```bash
curl -X POST http://localhost/backend/public/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"John Doe","email":"john@example.com","password":"password123"}'
```

### Login

```bash
curl -X POST http://localhost/backend/public/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@caate.edu","password":"admin123"}'
```

## Adding New Features

### Create a new Model

Add to `app/models/YourModel.php`

### Create a new Controller

Add to `app/controllers/YourController.php`

### Add Routes

Update `routes/api.php`

## Collections Schema

### Trainees

```json
{
  "student_id": "TRN-2024-001",
  "first_name": "John",
  "last_name": "Doe",
  "email": "trainee@example.com",
  "phone": "09123456789",
  "address": "Address",
  "status": "active",
  "created_at": "ISODate",
  "updated_at": "ISODate"
}
```

### Courses

```json
{
  "course_code": "BC-NC-001",
  "title": "Beauty Care (Nail Care)",
  "description": "Course description",
  "duration": "3 months",
  "status": "active",
  "created_at": "ISODate",
  "updated_at": "ISODate"
}
```

### Enrollments

```json
{
  "trainee_id": "ObjectId",
  "course_id": "ObjectId",
  "enrollment_date": "ISODate",
  "status": "active",
  "updated_at": "ISODate"
}
```
