# CAATE-ITRMS Backend - Quick Access Guide

## 🚀 Access URLs

### Main Pages

- **Backend Home**: http://localhost/backend/public/
- **Database Viewer**: http://localhost/backend/public/view-data.php
- **JSON API Data**: http://localhost/backend/public/api-data.php

### API Endpoints

#### Authentication

```
POST http://localhost/backend/public/api/v1/auth/register
POST http://localhost/backend/public/api/v1/auth/login
POST http://localhost/backend/public/api/v1/auth/logout
```

#### Users

```
GET http://localhost/backend/public/api/v1/users
GET http://localhost/backend/public/api/v1/users/{id}
POST http://localhost/backend/public/api/v1/users
PUT http://localhost/backend/public/api/v1/users/{id}
DELETE http://localhost/backend/public/api/v1/users/{id}
```

## 📊 Sample Data Summary

### Users (3)

- Admin User (admin@caate.edu) - Role: admin
- Maria Santos (maria.santos@caate.edu) - Role: staff
- John Reyes (john.reyes@caate.edu) - Role: instructor

### Courses (5)

1. BC-NC-001 - Beauty Care (Nail Care) - ₱15,000
2. BC-SC-002 - Beauty Care (Skin Care) - ₱18,000
3. AS-001 - Aesthetic Services - ₱22,000
4. PMT-001 - Permanent Makeup Tattoo - ₱25,000
5. ASC-001 - Advanced Skin Care - ₱28,000

### Trainees (5)

1. TRN-2024-001 - Anna Cruz
2. TRN-2024-002 - Sofia Garcia
3. TRN-2024-003 - Isabella Mendoza
4. TRN-2024-004 - Mia Torres
5. TRN-2024-005 - Emma Ramos

### Inventory Items (5)

1. INV-001 - Nail Polish Set (50 sets)
2. INV-002 - Facial Steamer (5 units)
3. INV-003 - Makeup Brush Set (30 sets)
4. INV-004 - Microblading Pen (15 units)
5. INV-005 - Facial Cleanser (100 bottles)

### Applications (3)

1. Olivia Santos - Beauty Care (Nail Care) - Pending
2. Ava Reyes - Aesthetic Services - Approved
3. Charlotte Dela Cruz - Advanced Skin Care - Pending

### Graduates (2)

1. Maria Clara Santos - Beauty Care (Nail Care) - CERT-2023-050
2. Jasmine Reyes - Beauty Care (Skin Care) - CERT-2023-051

## 🔑 Login Credentials

**Admin Account:**

- Email: admin@caate.edu
- Password: admin123

**Staff Account:**

- Email: maria.santos@caate.edu
- Password: staff123

**Instructor Account:**

- Email: john.reyes@caate.edu
- Password: instructor123

## 📝 Testing API with cURL

### Login Example

```bash
curl -X POST http://localhost/backend/public/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"admin@caate.edu\",\"password\":\"admin123\"}"
```

### Get All Users

```bash
curl http://localhost/backend/public/api/v1/users
```

### Get Specific Collection Data

```bash
# Get only trainees
curl http://localhost/backend/public/api-data.php?collection=trainees

# Get only courses
curl http://localhost/backend/public/api-data.php?collection=courses

# Get all data
curl http://localhost/backend/public/api-data.php?collection=all
```

## 🗄️ Database Information

**Database Name:** CAATE-ITRMS

**Collections:**

- users
- trainees
- courses
- enrollments
- schedules
- attendance
- competencies
- applications
- admissions
- graduates
- inventory
- requests

## 🔧 Maintenance Commands

### Re-seed Database

```bash
cd backend
php database/seeders/ComprehensiveSampleData.php
```

### Initialize Collections

```bash
cd backend
php database/seeders/InitializeCollections.php
```
