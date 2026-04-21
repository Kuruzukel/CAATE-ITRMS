# 🔧 Admin Dashboard - CAATE-ITRMS

Professional administration dashboard for CAATE (Creative Aesthetic Academy & Technical Education Inc.) Integrated Training & Resource Management System. Provides comprehensive tools for managing courses, trainees, schedules, competencies, and inventory operations.

## Overview

The Admin Dashboard is one of **4 frontend applications** in the CAATE-ITRMS ecosystem:

1. **Admin Dashboard** (this module) - Administrative management interface
2. **Authentication System** (`/auth`) - Login, registration, and admission workflow
3. **Landing Page** (`/public`) - Public-facing website with course information
4. **Trainee Dashboard** (`/trainee`) - Student portal for trainees
5. **Backend API** (`/backend`) - RESTful API with PHP and MongoDB

## Folder Structure

```
admin/
├── 📂 config/
│   ├── gulpfile.js                     # Gulp build configuration
│   └── README.md                       # Config documentation
├── 📂 docs/
│   ├── 📂 inventory-data/              # Inventory sample data
│   │   ├── nail-care-inventory.csv
│   │   ├── nail-care-inventory.json
│   │   ├── skin-care-inventory.csv
│   │   ├── skin-care-inventory.json
│   │   └── README.md
│   ├── MIGRATION_GUIDE.md              # Migration documentation
│   ├── nail-care-inventory.csv         # Legacy inventory data
│   ├── sample-trainees.csv             # Sample trainee data
│   ├── sample-trainees.json
│   └── README.md                       # Docs overview
├── 📂 public/                          # Static files
│   └── README.md
├── 📂 src/
│   ├── 📂 assets/
│   │   ├── 📂 css/                     # Stylesheets (16 files)
│   │   │   ├── admin-dashboard-scrollbar.css
│   │   │   ├── admin-dashboard.css
│   │   │   ├── admission.css
│   │   │   ├── application.css
│   │   │   ├── attendance.css
│   │   │   ├── audit-inventory.css
│   │   │   ├── caate-inventory.css
│   │   │   ├── change-password.css
│   │   │   ├── custom-theme.css
│   │   │   ├── dashboard.css
│   │   │   ├── demo.css
│   │   │   ├── graduates.css
│   │   │   ├── registration.css
│   │   │   ├── schedule.css
│   │   │   ├── style.css
│   │   │   └── table-scrollbar.css
│   │   ├── 📂 fonts/
│   │   │   └── 📂 fonts/               # Font files
│   │   ├── 📂 images/                  # Application images (30+ files)
│   │   │   ├── 📂 CAATE FB COURSES/    # Course promotional images (5)
│   │   │   ├── CAATE logos/            # CAATE branding (8)
│   │   │   ├── TESDA logos/            # TESDA branding (6)
│   │   │   └── Other assets/           # Miscellaneous
│   │   ├── 📂 img/                     # Additional images
│   │   │   ├── 📂 avatars/             # Avatar images
│   │   │   ├── 📂 backgrounds/         # Background images
│   │   │   ├── 📂 elements/            # UI elements
│   │   │   ├── 📂 favicon/             # Favicon
│   │   │   ├── 📂 icons/               # Icon sets
│   │   │   │   ├── 📂 brands/          # Brand icons
│   │   │   │   └── 📂 unicons/         # Unicons
│   │   │   ├── 📂 illustrations/       # Illustrations
│   │   │   └── 📂 layouts/             # Layout images
│   │   ├── 📂 js/                      # JavaScript files (37 files)
│   │   │   ├── accounts.js
│   │   │   ├── admin-dashboard.js
│   │   │   ├── admin-navbar.js
│   │   │   ├── admission.js
│   │   │   ├── application.js
│   │   │   ├── attendance.js
│   │   │   ├── audit-inventory-filter.js
│   │   │   ├── audit-inventory.js
│   │   │   ├── auth-dashboard.js
│   │   │   ├── auth-guard.js
│   │   │   ├── caate-inventory-filter.js
│   │   │   ├── caate-inventory.js
│   │   │   ├── change-password.js
│   │   │   ├── competencies.js
│   │   │   ├── config.js
│   │   │   ├── courses.js
│   │   │   ├── dashboard.js
│   │   │   ├── dashboards-analytics.js
│   │   │   ├── extended-ui-perfect-scrollbar.js
│   │   │   ├── fix-scrollbar-warnings.js
│   │   │   ├── form-basic-inputs.js
│   │   │   ├── graduates.js
│   │   │   ├── inventory-filter-dynamic.js
│   │   │   ├── main.js
│   │   │   ├── manage-profile.js
│   │   │   ├── menu-toggle-debug.js
│   │   │   ├── menu-toggle.js
│   │   │   ├── navbar-utils.js
│   │   │   ├── pages-account-settings-account.js
│   │   │   ├── performance-fixes.js
│   │   │   ├── registration.js
│   │   │   ├── requests-optimized-functions.js
│   │   │   ├── requests.js
│   │   │   ├── schedule.js
│   │   │   ├── ui-modals.js
│   │   │   ├── ui-popover.js
│   │   │   └── ui-toasts.js
│   │   ├── 📂 vendor/                  # Third-party libraries
│   │   └── README.md                   # Assets documentation
│   ├── 📂 layouts/                     # Layout templates
│   │   └── README.md
│   └── 📂 pages/                       # HTML pages (15 files)
│       ├── accounts.html
│       ├── admission.html
│       ├── application.html
│       ├── attendance.html
│       ├── audit-inventory.html
│       ├── caate-inventory.html
│       ├── change-password.html
│       ├── competencies.html
│       ├── courses.html
│       ├── dashboard.html
│       ├── graduates.html
│       ├── manage-profile.html
│       ├── registration.html
│       ├── requests.html
│       └── schedule.html
├── .gitignore                          # Git ignore rules
├── build-config.js                     # Build configuration
├── gulpfile.js                         # Main Gulp configuration
├── package.json                        # Dependencies and scripts
├── README.md                           # This file
└── webpack.config.js                   # Webpack configuration
```

## Features

The Admin Dashboard provides **15 comprehensive management pages** for complete administrative control:

### Core Management Modules

#### Dashboard

- Overview of key metrics and statistics
- Quick access to main functions
- Real-time data visualization
- Analytics and reporting

#### Competencies Management

- Create and manage competency frameworks
- Track competency progress
- Assign competencies to courses
- Assessment management

#### Courses Management

- Add and edit courses (10+ professional courses)
- Manage course schedules
- Track course enrollment
- Manage course materials
- Curriculum planning

#### Schedule Management

- Create and manage training schedules
- View calendar-based schedules
- Manage instructor assignments
- Track schedule changes
- Class timetable management

#### Graduates Tracking

- Maintain graduate records
- Track graduate achievements
- Generate graduate reports
- Manage graduate profiles
- Certificate management

#### Accounts Management

- User account creation and management
- Role and permission assignment (Admin, Staff, Instructor)
- Account status management
- User activity tracking
- Role-based access control

#### Enrollment Management

- Complete enrollment process
- Process application, registration & admission
- Manage enrollment status
- Track enrollment history
- Generate enrollment reports
- Batch enrollment support
- Document verification

#### Schedule Management (Appointments)

- View appointment requests from landing page
- Display appointments submitted via public appointment form
- Calendar view of all appointment records
- Appointment status management
- Appointment history and tracking
- No internal scheduling - appointments come from public site

#### Dual Inventory System

- **Audit Inventory** tracking
- **CAATE Inventory** management
- Stock level monitoring
- Inventory reports
- Equipment and supplies management

#### Profile Management

- Update admin profile
- Manage profile information
- View profile history
- Account settings

#### Change Password

- Secure password change
- Password strength validation
- Change history tracking
- Security recommendations

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

<div align="center">

|                                                           Logo                                                            | Technology            | Purpose                           |
| :-----------------------------------------------------------------------------------------------------------------------: | :-------------------- | :-------------------------------- |
|      <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg" width="40" height="40"/>      | **HTML5**             | Semantic markup & structure       |
|       <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg" width="40" height="40"/>       | **CSS3**              | Styling & responsive design       |
| <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg" width="40" height="40"/> | **JavaScript**        | Client-side logic & interactivity |
|  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/bootstrap/bootstrap-original.svg" width="40" height="40"/>  | **Bootstrap**         | UI framework & components         |
|     <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/jquery/jquery-original.svg" width="40" height="40"/>     | **jQuery**            | DOM manipulation & utilities      |
|          <img src="https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/popperdotjs.svg" width="40" height="40"/>           | **Popper.js**         | Tooltip & popover positioning     |
|                                                            📜                                                             | **Perfect Scrollbar** | Custom scrollbar styling          |
|            <img src="https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/boxicons.svg" width="40" height="40"/>            | **Boxicons**          | Icon library                      |
|    <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/webpack/webpack-original.svg" width="40" height="40"/>    | **Webpack**           | Module bundler & asset management |
|        <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/gulp/gulp-plain.svg" width="40" height="40"/>         | **Gulp**              | Task automation & build pipeline  |

</div>

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

**Developer:** KEL TO YAHHHH!  
**Email:** [mikasaackerman.jme@gmail.com](mailto:mikasaackerman.jme@gmail.com)  
**Last Updated**: February 2026  
**Status**: Active Development  
**Part of:** [CAATE-ITRMS Project](../README.md)
