# 👨‍🎓 Trainee Dashboard - CAATE-ITRMS

Student/trainee dashboard for CAATE (Creative Aesthetic Academy & Technical Education Inc.) Integrated Training & Resource Management System. Provides trainees with access to their courses, admission information, schedule & appointment tracking, competency tracking, profile management, and account settings.

## Overview

The Trainee Dashboard is one of **4 frontend applications** in the CAATE-ITRMS ecosystem:

1. **Admin Dashboard** (`/admin`) - Administrative management interface
2. **Authentication System** (`/auth`) - Login, registration, and admission workflow
3. **Landing Page** (`/public`) - Public-facing website with course information
4. **Trainee Dashboard** (this module) - Student portal for trainees
5. **Backend API** (`/backend`) - RESTful API with PHP and MongoDB

## Folder Structure

```
trainee/
├── 📂 public/                          # Static files
│   └── README.md
├── 📂 src/
│   ├── 📂 assets/
│   │   ├── 📂 css/                     # Stylesheets
│   │   ├── 📂 images/                  # Application images
│   │   ├── 📂 img/                     # Additional images
│   │   │   ├── 📂 avatars/
│   │   │   ├── 📂 backgrounds/
│   │   │   ├── 📂 elements/
│   │   │   ├── 📂 favicon/
│   │   │   ├── 📂 icons/
│   │   │   ├── 📂 illustrations/
│   │   │   └── 📂 layouts/
│   │   ├── 📂 js/                      # JavaScript files
│   │   ├── 📂 vendor/                  # Third-party libraries
│   │   └── README.md
│   └── 📂 pages/                       # Trainee pages (9 files)
│       ├── admission-slip.html
│       ├── enrollment-form.html
│       ├── schedule.html
│       ├── change-password.html
│       ├── class-roster.html
│       ├── competencies.html
│       ├── courses.html
│       ├── dashboard.html
│       ├── manage-profile.html
│       └── README.md
├── package.json                        # Dependencies and scripts
└── README.md                           # This file
```

## Features

The Trainee Dashboard provides **9 comprehensive pages** for student management and tracking:

### Core Student Features

#### Personal Dashboard

- Welcome message with trainee name
- Overview of enrolled courses
- Enrolled courses summary
- Progress indicators and tracking
- Upcoming schedules and classes
- Important announcements and notifications
- Quick action buttons
- Recent activity feed

#### Admission Slip

- View and download admission slip
- Admission details display
- Print admission certificate
- Printable format
- QR code for verification
- Important dates and deadlines
- Certificate information
- Download functionality

#### Enrollment Form

- Complete enrollment process
- Application, registration & admission in one
- Personal information management
- Contact details
- Document submission
- Enrollment status tracking
- Course selection

#### Schedule & Appointments

- View appointment schedules
- Calendar view of appointments
- Appointment history
- Appointment notifications and alerts
- Upcoming appointments
- Appointment details

#### Course Enrollment

- List of enrolled courses
- Enrolled courses overview
- Course progress tracking
- Progress bars and indicators
- Course materials and resources access
- Course descriptions
- Schedule information
- Instructor contact information
- Instructor details
- Course completion status and certificates

#### Competency Tracking

- Track competency progress
- Competency framework display
- View competency requirements
- Progress monitoring and tracking
- Assessment results and scores
- Skill development tracking
- Skill development metrics
- Certification progress and tracking
- Achievement badges and recognition

#### Class Roster

- View classmates and instructors
- Classmate directory
- Instructor information and contacts
- Contact information
- Class schedules and timetables
- Group assignments
- Communication tools and features

#### Profile Management

- Update personal information
- Personal information form
- Manage contact details
- Update emergency contacts
- Emergency contact information
- Manage profile picture
- Profile picture upload
- Address information
- Educational background
- View profile history
- Save and update functionality

#### Password Management

- Secure password change
- Current password verification
- New password entry
- Password confirmation
- Password strength indicator and validation
- Security tips and recommendations
- Change history tracking

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

```bash
# Navigate to trainee folder
cd trainee

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
|    <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/webpack/webpack-original.svg" width="40" height="40"/>    | **Webpack**           | Module bundler (if configured)    |

</div>

## Asset References

### Images

All images are stored in `/img/` folder at project root:

- CAATE logos and branding
- TESDA logos
- Course images

Update image paths in HTML to reference: `../../img/[image-name]`

### Illustrations

Application-specific illustrations are in `src/assets/img/illustrations/`:

- girl-doing-yoga-light.png
- man-with-laptop-light.png
- page-misc-error-light.png

## Page Descriptions

### Dashboard (`dashboard.html`)

- Welcome message with trainee name
- Enrolled courses overview
- Progress indicators
- Upcoming schedules
- Announcements and notifications
- Quick action buttons

### Admission Slip (`admission-slip.html`)

- Admission details display
- Printable format
- QR code for verification
- Important dates
- Download functionality
- Certificate information

### Enrollment Form (`enrollment-form.html`)

- Complete enrollment process
- Application, registration & admission combined
- Personal information form
- Document upload and management
- Enrollment status tracking
- Course selection
- Submission confirmation

### Schedule & Appointments (`schedule.html`)

- View appointment schedules
- Calendar view of appointments
- Appointment history
- Appointment details
- Upcoming appointments
- Appointment notifications

### Change Password (`change-password.html`)

- Current password verification
- New password entry
- Password confirmation
- Password strength indicator
- Security tips
- Change history

### Class Roster (`class-roster.html`)

- Classmate directory
- Instructor information
- Contact details
- Class schedules
- Group assignments
- Communication features

### Competencies (`competencies.html`)

- Competency framework display
- Progress tracking
- Assessment results
- Skill development metrics
- Certification tracking
- Achievement badges

### Courses & Programs (`courses.html`)

- List of enrolled courses
- Course progress bars
- Course descriptions
- Schedule information
- Instructor details
- Course materials links
- Completion certificates

### Manage Profile (`manage-profile.html`)

- Personal information form
- Contact details
- Emergency contact information
- Profile picture upload
- Address information
- Educational background
- Save and update functionality

## Development Guidelines

1. **User Experience**: Ensure intuitive navigation and clear information hierarchy
2. **Responsive Design**: All pages must work on mobile and desktop
3. **Data Security**: Implement proper authentication and authorization
4. **Form Validation**: Validate all user inputs on client and server side
5. **Accessibility**: Follow WCAG guidelines for accessibility
6. **Performance**: Optimize load times and minimize resource usage

## Form Handling

All forms include:

- Client-side validation
- Error message display
- Success confirmation
- Loading states
- Accessibility features

## Build Process

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
2. Deploy to web server
3. Configure backend API endpoints
4. Set up session management
5. Configure authentication
6. Enable HTTPS

## API Integration

The trainee portal expects backend endpoints for:

- User authentication
- Profile data retrieval and updates
- Progress tracking
- Admission slip generation
- Application form submission
- Password change

## Security Considerations

- Implement proper authentication
- Use HTTPS for all communications
- Validate all user inputs
- Implement CSRF protection
- Secure session management
- Implement rate limiting
- Regular security audits

## Support

For issues or questions, refer to the main project README.md

---

**Developer:** KEL TO YAHHHH!  
**Email:** developer@example.com  
**Last Updated**: February 2026  
**Status**: Active Development  
**Part of:** [CAATE-ITRMS Project](../README.md)
