# ✅ Courses Setup Complete

## What Was Done

### 1. Database Seeding Scripts Created

- **CLI Script**: `backend/seed_courses.php` - Run from command line
- **Web Interface**: `backend/public/seed.php` - Run from browser

### 2. Course Data Structure

All 10 courses have been prepared with the following fields:

- `badge` - Course code/level (e.g., "NC II - SOCBCN220", "Level III", "Specialized")
- `title` - Course name
- `description` - Course description
- `hours` - Duration (e.g., "307 Hours (39 Days)")
- `image` - Course image URL
- `created_at` - Timestamp
- `updated_at` - Timestamp

### 3. Admin Page Updates

- **Toast Notifications**: Added success/error notifications
- **Dynamic Loading**: Courses load from MongoDB via API
- **Loading State**: Shows spinner while fetching data
- **Badge Colors**: Automatically colored based on course level:
  - NC II courses: Blue (primary)
  - Level III courses: Cyan (info)
  - Specialized courses: Yellow (warning)
  - Level I courses: Gray (secondary)

### 4. JavaScript Enhancements

- Updated `admin/src/assets/js/courses.js`:
  - Fetches courses from `/api/v1/courses`
  - Renders courses dynamically
  - Handles loading states
  - Shows toast notifications
  - Supports editing courses

## How to Use

### Option 1: Browser-Based Seeding (Easiest)

1. Open your browser
2. Navigate to: `http://localhost/CAATE-ITRMS/backend/public/seed.php`
3. Click "🚀 Seed Database" button
4. Wait for confirmation
5. Visit `admin/src/pages/courses.html` to see the courses

### Option 2: Command Line Seeding

```bash
cd backend
php seed_courses.php
```

## Courses Included

1. **Beauty Care (Nail Care) Services NC II** - 307 Hours (39 Days)
2. **Beauty Care (Skin Care) Services NC II** - 421 Hours (53 Days)
3. **Aesthetic Services Level III** - 80 Hours (10 Days)
4. **Advanced Skin Care Services Level III** - 100 Hours (13 Days)
5. **Permanent Make-Up Tattoo Services Level III** - 100 Hours (13 Days)
6. **Perform Collagen Induction Therapy & Hair Loss Treatment** - 8 Hours (1 Day)
7. **Perform Advanced Facial Treatment & Chemical Skin Peeling** - 16 Hours (2 Days)
8. **Perform Light Therapy & Heat Therapy** - 16 Hours (2 Days)
9. **Trainers Methodology Level I** - 264 Hours (33 Days)
10. **Eyelash and Eyebrow Services Level III** - 80 Hours (10 Days)

## Features

### Admin Dashboard

- ✅ View all courses in a responsive grid
- ✅ Edit course details via modal
- ✅ Dynamic badge colors
- ✅ Toast notifications for actions
- ✅ Loading spinner during data fetch
- ✅ Error handling with user-friendly messages

### API Endpoints

- `GET /api/v1/courses` - List all courses
- `GET /api/v1/courses/{id}` - Get single course
- `POST /api/v1/courses` - Create new course
- `PUT /api/v1/courses/{id}` - Update course
- `DELETE /api/v1/courses/{id}` - Delete course

## File Structure

```
backend/
├── seed_courses.php              # CLI seed script
├── SEED_README.md                # Seeding instructions
├── public/
│   └── seed.php                  # Web-based seed interface
├── app/
│   ├── models/
│   │   └── Course.php            # Course model
│   └── controllers/
│       └── CourseController.php  # Course API controller

admin/
└── src/
    ├── pages/
    │   └── courses.html          # Admin courses page (dynamic)
    └── assets/
        └── js/
            └── courses.js        # Course management logic
```

## Next Steps

1. **Seed the database** using one of the methods above
2. **Test the admin page** at `admin/src/pages/courses.html`
3. **Try editing a course** using the Edit button
4. **Add more courses** via the API or by modifying the seed script

## Troubleshooting

### Courses not showing?

- Check MongoDB is running
- Verify database connection in `backend/app/config/database.php`
- Check browser console for errors
- Ensure API endpoint is accessible: `http://localhost/CAATE-ITRMS/backend/public/api/v1/courses`

### Seed script errors?

- Verify PHP MongoDB extension is installed: `php -m | grep mongodb`
- Check file permissions
- Ensure MongoDB connection string is correct

### Badge colors not showing?

- Clear browser cache
- Check that `custom-theme.css` is loaded
- Verify Bootstrap CSS is included

## Success! 🎉

Your courses system is now fully dynamic and ready to use. The admin can view, edit, and manage courses through the web interface, and all data is stored in MongoDB.
