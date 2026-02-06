# 🔐 Authentication & Admission System - ESCAATE

Unified authentication and admission management system for ESCAATE (Enterprise Skills & Competency Administration & Training Excellence). Handles user login, registration, password recovery, and the complete admission workflow for new trainees.

## Folder Structure

```
auth/
├── src/
│   ├── pages/                                  # Authentication pages
│   │   ├── login.html                         # User login page
│   │   ├── register.html                      # User registration page
│   │   ├── forgot-password.html               # Password recovery page
│   │   ├── account/
│   │   │   └── change-password.html           # Change password page
│   │   └── admission/                         # Admission workflow pages
│   │       ├── admission.html                 # Admission overview
│   │       ├── application-form.html          # Application form
│   │       ├── appointment-form.html          # Appointment scheduling
│   │       └── consent-form.html              # Consent form
│   ├── assets/
│   │   ├── css/                               # Stylesheets
│   │   │   ├── page-auth.css                  # Authentication page styles
│   │   │   ├── auth-custom.css                # Custom auth styles
│   │   │   ├── core.css                       # Core styles
│   │   │   ├── theme-default.css              # Default theme
│   │   │   ├── demo.css                       # Demo styles
│   │   │   ├── admission.css                  # Admission page styles
│   │   │   ├── application-form.css           # Application form styles
│   │   │   ├── appointment-form.css           # Appointment form styles
│   │   │   ├── consent-form.css               # Consent form styles
│   │   │   ├── boxicons.css                   # Icon styles
│   │   │   └── perfect-scrollbar.css          # Scrollbar styles
│   │   ├── js/                                # JavaScript files
│   │   │   ├── main.js                        # Main application logic
│   │   │   ├── config.js                      # Configuration
│   │   │   ├── helpers.js                     # Helper functions
│   │   │   ├── menu.js                        # Menu functionality
│   │   │   ├── admission.js                   # Admission logic
│   │   │   ├── application-form.js            # Application form handling
│   │   │   ├── apppoinrment-form.js           # Appointment form handling
│   │   │   ├── consent-form.js                # Consent form handling
│   │   │   ├── bootstrap.js                   # Bootstrap initialization
│   │   │   ├── jquery.js                      # jQuery
│   │   │   ├── popper.js                      # Popper.js
│   │   │   └── perfect-scrollbar.js           # Perfect scrollbar
│   │   ├── images/                            # Application-specific images
│   │   ├── fonts/
│   │   │   ├── boxicons/                      # Boxicons font files
│   │   │   └── boxicons.css                   # Boxicons stylesheet
│   │   └── vendor/                            # Third-party libraries
│   └── layouts/                               # Layout templates (if applicable)
├── public/                                    # Static files
├── docs/
│   └── STRUCTURE.md                           # Structure documentation
├── package.json                               # Dependencies and scripts
├── .gitignore                                 # Git ignore rules
└── README.md                                  # This file
```

## Features

### Authentication

- **User Login**: Secure login with credentials validation
- **User Registration**: New user account creation with validation
- **Password Recovery**: Forgot password functionality with email verification
- **Change Password**: Secure password change for authenticated users

### Admission Workflow

- **Admission Overview**: Introduction and requirements for admission
- **Application Form**: Comprehensive application form for new trainees
- **Appointment Scheduling**: Schedule admission appointment
- **Consent Form**: Legal consent and agreement forms

### Account Management

- Profile information management
- Password change functionality
- Account settings

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

```bash
# Navigate to auth folder
cd auth

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
- **Icons**: Boxicons
- **Utilities**: jQuery, Popper.js, Perfect Scrollbar
- **Build Tools**: Webpack (if configured)

## Asset References

### Images

All images are stored in `/img/` folder at project root:

- CAATE logos and branding
- TESDA logos
- Course images

Update image paths in HTML to reference: `../../img/[image-name]`

### Fonts

Boxicons fonts are included in `src/assets/fonts/boxicons/`

## Page Descriptions

### Login (`login.html`)

- User authentication
- Credential validation
- Session management
- Links to registration and password recovery

### Register (`register.html`)

- New user account creation
- Form validation
- Email verification
- Terms and conditions acceptance

### Forgot Password (`forgot-password.html`)

- Password recovery initiation
- Email verification
- Password reset link generation
- New password creation

### Admission (`admission/admission.html`)

- Admission requirements overview
- Process explanation
- Document requirements
- Next steps guidance

### Application Form (`admission/application-form.html`)

- Personal information collection
- Educational background
- Course selection
- Contact information
- Form validation and submission

### Appointment Form (`admission/appointment-form.html`)

- Appointment date/time selection
- Appointment type selection
- Confirmation details
- Calendar integration

### Consent Form (`admission/consent-form.html`)

- Legal agreements
- Privacy policy acceptance
- Terms and conditions
- Digital signature/confirmation

### Change Password (`account/change-password.html`)

- Current password verification
- New password entry
- Password strength validation
- Confirmation

## Development Guidelines

1. **Form Handling**: Use dedicated JS files for form validation and submission
2. **Styling**: Keep auth-specific styles in `auth-custom.css`
3. **Responsive Design**: Ensure all pages are mobile-friendly
4. **Security**: Implement proper input validation and sanitization
5. **Accessibility**: Follow WCAG guidelines for accessibility

## Form Validation

All forms include client-side validation:

- Required field validation
- Email format validation
- Password strength requirements
- Confirmation field matching
- Custom validation rules

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
4. Set up email service for password recovery
5. Configure session management

## API Integration

The authentication system expects backend endpoints for:

- User login
- User registration
- Password recovery
- Password reset
- Admission form submission
- Appointment scheduling
- Consent form submission

## Support

For issues or questions, refer to:

- `docs/STRUCTURE.md` - Detailed structure information

---

**Developer:** KEL TO ROR  
**Last Updated**: February 2026  
**Status**: Active Development  
**Part of:** [ESCAATE Project](../README.md)
