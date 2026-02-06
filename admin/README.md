# 🔧 Admin Dashboard - ESCAATE

Professional administration dashboard for ESCAATE (Enterprise Skills & Competency Administration & Training Excellence). Provides comprehensive tools for managing courses, trainees, schedules, competencies, and inventory operations.

## Folder Structure

```
admin/
├── src/
│   ├── pages/                          # Admin pages
│   │   ├── dashboard.html              # Main dashboard
│   │   ├── competencies.html           # Competencies management
│   │   ├── courses.html                # Courses management
│   │   ├── schedule.html               # Schedule management
│   │   ├── graduates.html              # Graduates tracking
│   │   ├── accounts.html               # User accounts
│   │   ├── attendance.html             # Attendance records
│   │   ├── enrollment.html             # Enrollment management
│   │   ├── application.html            # Application processing
│   │   ├── audit-inventory.html        # Audit inventory
│   │   ├── caate-inventory.html        # CAATE inventory
│   │   ├── manage-profile.html         # Profile management
│   │   ├── change-password.html        # Password management
│   │   └── requests.html               # Request management
│   ├── assets/
│   │   ├── css/                        # Stylesheets
│   │   │   ├── style.css               # Main styles
│   │   │   ├── custom-theme.css        # Custom theme
│   │   │   ├── demo.css                # Demo styles
│   │   │   ├── table-scrollbar.css     # Table scrollbar styling
│   │   │   ├── graduates.css           # Graduates page styles
│   │   │   ├── schedule.css            # Schedule page styles
│   │   │   ├── audit-inventory.css     # Audit inventory styles
│   │   │   └── caate-inventory.css     # CAATE inventory styles
│   │   ├── js/                         # JavaScript files
│   │   │   ├── main.js                 # Main application logic
│   │   │   ├── config.js               # Configuration
│   │   │   ├── menu-toggle.js          # Menu toggle functionality
│   │   │   ├── dashboards-analytics.js # Dashboard analytics
│   │   │   ├── competencies.js         # Competencies management
│   │   │   ├── graduates.js            # Graduates management
│   │   │   ├── schedule.js             # Schedule management
│   │   │   ├── audit-inventory.js      # Audit inventory logic
│   │   │   ├── caate-inventory.js      # CAATE inventory logic
│   │   │   ├── form-basic-inputs.js    # Form handling
│   │   │   ├── pages-account-settings-account.js # Account settings
│   │   │   ├── ui-modals.js            # Modal functionality
│   │   │   ├── ui-popover.js           # Popover functionality
│   │   │   ├── ui-toasts.js            # Toast notifications
│   │   │   └── extended-ui-perfect-scrollbar.js # Scrollbar
│   │   ├── images/                     # Application-specific images
│   │   ├── fonts/                      # Font files
│   │   └── vendor/                     # Third-party libraries
│   └── layouts/                        # Layout templates (if applicable)
├── public/                             # Static files
├── config/
│   └── gulpfile.js                     # Gulp build configuration
├── docs/
│   ├── STRUCTURE.md                    # Detailed structure documentation
│   ├── MIGRATION_GUIDE.md              # Migration guide
│   └── QUICK_START.md                  # Quick start guide
├── package.json                        # Dependencies and scripts
├── gulpfile.js                         # Gulp configuration
├── webpack.config.js                   # Webpack configuration
├── build-config.js                     # Build configuration
├── .gitignore                          # Git ignore rules
└── README.md                           # This file
```

## Features

### Dashboard

- Overview of key metrics and statistics
- Quick access to main functions
- Real-time data visualization

### Competencies Management

- Create and manage competency frameworks
- Track competency progress
- Assign competencies to courses

### Courses Management

- Add and edit courses
- Manage course schedules
- Track course enrollment
- Manage course materials

### Schedule Management

- Create and manage training schedules
- View calendar-based schedules
- Manage instructor assignments
- Track schedule changes

### Graduates Tracking

- Maintain graduate records
- Track graduate achievements
- Generate graduate reports
- Manage graduate profiles

### Accounts Management

- User account creation and management
- Role and permission assignment
- Account status management
- User activity tracking

### Attendance Records

- Record attendance
- Generate attendance reports
- Track attendance patterns
- Manage attendance exceptions

### Enrollment Management

- Process enrollments
- Manage enrollment status
- Track enrollment history
- Generate enrollment reports

### Application Processing

- Review applications
- Process application approvals
- Manage application status
- Generate application reports

### Inventory Management

- Audit Inventory tracking
- CAATE Inventory management
- Stock level monitoring
- Inventory reports

### Profile Management

- Update admin profile
- Manage profile information
- View profile history

### Change Password

- Secure password change
- Password strength validation
- Change history tracking

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

```bash
# Navigate to admin folder
cd admin

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## Technologies Used

- **Frontend**: HTML5, CSS3, JavaScript
- **Build Tools**: Webpack, Gulp
- **UI Framework**: Bootstrap
- **Icons**: Boxicons
- **Utilities**: jQuery, Popper.js, Perfect Scrollbar

## Asset References

### Images

All images are stored in `/img/` folder at project root:

- CAATE logos and branding
- TESDA logos
- Course images
- Graduate photos

Update image paths in HTML to reference: `../../img/[image-name]`

### Shared Assets

- Custom theme CSS is shared across applications
- Configuration files are application-specific

## Development Guidelines

1. **Page Structure**: Each page should have corresponding CSS and JS files
2. **Naming Convention**: Use kebab-case for file names
3. **CSS Organization**: Keep styles modular and page-specific
4. **JavaScript**: Maintain separate JS files for each major feature
5. **Images**: Reference shared images from `/img/` folder

## Build Process

The application uses Webpack and Gulp for building:

```bash
# Development build with watch
npm run dev

# Production build
npm run build

# Clean build
npm run clean
```

## Deployment

1. Run production build: `npm run build`
2. Deploy contents of `dist/` folder to web server
3. Ensure proper routing configuration for single-page navigation

## Support

For issues or questions, refer to:

- `docs/STRUCTURE.md` - Detailed structure information
- `docs/QUICK_START.md` - Quick start guide
- `docs/MIGRATION_GUIDE.md` - Migration information

---

**Developer:** KEL TO ROR  
**Last Updated**: February 2026  
**Status**: Active Development  
**Part of:** [ESCAATE Project](../README.md)
