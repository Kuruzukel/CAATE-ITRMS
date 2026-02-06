# 👨‍🎓 Trainee Portal - ESCAATE

Student/trainee dashboard and management interface for ESCAATE (Enterprise Skills & Competency Administration & Training Excellence). Provides trainees with access to their courses, admission information, profile management, and account settings.

## Folder Structure

```
trainee/
├── src/
│   ├── pages/                                  # Trainee pages
│   │   ├── dashboard.html                     # Main trainee dashboard
│   │   ├── admission-slip.html                # Admission slip/certificate
│   │   ├── application-form.html              # Application form
│   │   ├── courses-programs.html              # Courses and programs
│   │   ├── manage-profile.html                # Profile management
│   │   └── change-password.html               # Password management
│   ├── assets/
│   │   ├── css/                               # Stylesheets
│   │   │   ├── style.css                      # Main styles
│   │   │   ├── custom-theme.css               # Custom theme
│   │   │   ├── demo.css                       # Demo styles
│   │   │   ├── admission-slip.css             # Admission slip styles
│   │   │   └── application-form.css           # Application form styles
│   │   ├── js/                                # JavaScript files
│   │   │   ├── main.js                        # Main application logic
│   │   │   ├── config.js                      # Configuration
│   │   │   ├── admission-slip.js              # Admission slip functionality
│   │   │   ├── application-form.js            # Application form handling
│   │   │   ├── change-password.js             # Password change functionality
│   │   │   └── student-id.js                  # Student ID functionality
│   │   ├── images/                            # Application-specific images
│   │   ├── img/
│   │   │   └── illustrations/                 # Illustration assets
│   │   │       ├── girl-doing-yoga-light.png
│   │   │       ├── man-with-laptop-light.png
│   │   │       └── page-misc-error-light.png
│   │   └── vendor/                            # Third-party libraries
├── public/                                    # Static files
├── package.json                               # Dependencies and scripts
├── .gitignore                                 # Git ignore rules
└── README.md                                  # This file
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

### Courses & Programs

- View enrolled courses
- Course progress tracking
- Course materials and resources
- Schedule information
- Instructor contact information
- Course completion status

### Profile Management

- Update personal information
- Manage contact details
- Update emergency contacts
- Manage profile picture
- View profile history

### Change Password

- Secure password change
- Password strength validation
- Current password verification
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

- **Frontend**: HTML5, CSS3, JavaScript
- **UI Framework**: Bootstrap
- **Build Tools**: Webpack (if configured)
- **Utilities**: jQuery, Popper.js, Perfect Scrollbar

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

### Courses & Programs (`courses-programs.html`)

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

### Change Password (`change-password.html`)

- Current password verification
- New password entry
- Password confirmation
- Password strength indicator
- Security tips
- Change history

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

**Developer:** KEL TO ROR  
**Last Updated**: February 2026  
**Status**: Active Development  
**Part of:** [ESCAATE Project](../README.md)
