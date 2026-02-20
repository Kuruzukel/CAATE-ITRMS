# 👨‍🎓 Trainee Dashboard - CAATE-ITRMS

Student/trainee dashboard for CAATE (Creative Aesthetic Academy & Technical Education Inc.) Integrated Training & Resource Management System. Provides trainees with access to their courses, admission information, attendance records, competency tracking, profile management, and account settings.

## Folder Structure

```
trainee/
├── 📂 public/                          # Static files
├── 📂 src/
│   ├── 📂 assets/
│   │   ├── 📂 css/                     # Stylesheets (12 files)
│   │   │   ├── admission-slip.css      # Admission slip styles
│   │   │   ├── application-form.css    # Application form styles
│   │   │   ├── attendance.css          # Attendance styles
│   │   │   ├── change-password.css     # Password change styles
│   │   │   ├── class-roster.css        # Class roster styles
│   │   │   ├── courses.css             # Courses styles
│   │   │   ├── custom-theme.css        # Custom theme
│   │   │   ├── dashboard.css           # Dashboard styles
│   │   │   ├── demo.css                # Demo styles
│   │   │   ├── enrollment.css          # Enrollment styles
│   │   │   ├── manage-profile.css      # Profile management styles
│   │   │   └── style.css               # Main styles
│   │   ├── 📂 images/                  # Application images (17 files)
│   │   │   ├── 📂 CAATE FB COURSES/    # Course promotional images (5)
│   │   │   ├── CAATE logos/            # CAATE branding (8)
│   │   │   ├── TESDA logos/            # TESDA branding (4)
│   │   │   └── Other assets/           # Miscellaneous
│   │   ├── 📂 img/
│   │   │   └── 📂 illustrations/       # Illustration assets (3)
│   │   │       ├── girl-doing-yoga-light.png
│   │   │       ├── man-with-laptop-light.png
│   │   │       └── page-misc-error-light.png
│   │   ├── 📂 js/                      # JavaScript files (13 files)
│   │   │   ├── admission-slip.js       # Admission slip functionality
│   │   │   ├── application-form.js     # Application form handling
│   │   │   ├── attendance.js           # Attendance functionality
│   │   │   ├── change-password.js      # Password change functionality
│   │   │   ├── class-roster.js         # Class roster functionality
│   │   │   ├── competencies.js         # Competencies functionality
│   │   │   ├── config.js               # Configuration
│   │   │   ├── courses.js              # Courses functionality
│   │   │   ├── dashboard.js            # Dashboard functionality
│   │   │   ├── enrollment.js           # Enrollment functionality
│   │   │   ├── main.js                 # Main application logic
│   │   │   ├── manage-profile.js       # Profile management
│   │   │   ├── menu-toggle.js          # Menu toggle functionality
│   │   │   └── student-id.js           # Student ID functionality
│   │   └── 📂 vendor/                  # Third-party libraries
│   └── 📂 pages/                       # Trainee pages (10 files)
│       ├── admission-slip.html         # Admission slip/certificate
│       ├── application-form.html       # Application form
│       ├── attendance.html             # Attendance tracking
│       ├── change-password.html        # Password management
│       ├── class-roster.html           # Class roster
│       ├── competencies.html           # Competencies tracking
│       ├── courses.html                # Courses and programs
│       ├── dashboard.html              # Main trainee dashboard
│       ├── enrollment.html             # Enrollment management
│       └── manage-profile.html         # Profile management
├── package.json                        # Dependencies and scripts
└── README.md                           # This file
```

## Features

### Dashboard

- Overview of enrolled courses
- Progress tracking
- Upcoming schedules
- Important announcements
- Quick access to key functions
- Profile summary

### Admission Slip

- View and download admission slip
- Print admission certificate
- Admission details
- Important dates and information
- QR code for verification

### Application Form

- View submitted application
- Edit application information (if allowed)
- Application status tracking
- Document uploads
- Application history

### Attendance

- View attendance records
- Track attendance percentage
- View attendance history
- Mark attendance (if applicable)
- Attendance reports

### Change Password

- Secure password change
- Password strength validation
- Current password verification
- Change history tracking

### Class Roster

- View classmates and instructors
- Contact information
- Class schedules
- Group assignments
- Communication tools

### Competencies

- Track competency progress
- View competency requirements
- Assessment results
- Skill development tracking
- Certification progress

### Courses & Programs

- View enrolled courses
- Course progress tracking
- Course materials and resources
- Schedule information
- Instructor contact information
- Course completion status

### Enrollment

- Enrollment status tracking
- Course registration
- Enrollment history
- Payment status
- Enrollment documents

### Profile Management

- Update personal information
- Manage contact details
- Update emergency contacts
- Manage profile picture
- View profile history

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

### Application Form (`application-form.html`)

- Display submitted application data
- Edit capability (if allowed)
- Status indicators
- Document management
- Submission history
- Resubmission options

### Attendance (`attendance.html`)

- Attendance record display
- Attendance percentage tracking
- Calendar view of attendance
- Attendance history
- Absence notifications
- Attendance reports

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

### Enrollment (`enrollment.html`)

- Enrollment status overview
- Course registration interface
- Payment tracking
- Enrollment documents
- Registration history
- Course availability

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
- Course enrollment data
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
