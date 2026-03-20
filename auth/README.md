# 🔐 Authentication System - CAATE-ITRMS

Unified authentication system for CAATE (Creative Aesthetic Academy & Technical Education Inc.) Integrated Training & Resource Management System. Handles user login, registration, password recovery, and the complete admission workflow for new trainees.

## Folder Structure

```
auth/
├── 📂 docs/
│   ├── README.md                       # Auth documentation
│   └── STRUCTURE.md                    # Structure details
├── 📂 public/                          # Static files
│   └── README.md
├── 📂 src/
│   ├── 📂 assets/
│   │   ├── 📂 css/                     # Stylesheets
│   │   ├── 📂 fonts/                   # Boxicons fonts
│   │   │   └── 📂 boxicons/            # Boxicons font files
│   │   ├── 📂 images/                  # Application images
│   │   ├── 📂 js/                      # JavaScript files
│   │   └── README.md
│   └── 📂 pages/                       # Authentication pages
│       ├── 📂 account/                 # Account management
│       ├── 📂 admission/               # Admission workflow pages
│       ├── forgot-password.html        # Password recovery page
│       ├── login.html                  # User login page
│       ├── register.html               # User registration page
│       └── README.md
├── .gitignore                          # Git ignore rules
├── package.json                        # Dependencies and scripts
└── README.md                           # This file
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
|    <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/webpack/webpack-original.svg" width="40" height="40"/>    | **Webpack**           | Module bundler (if configured)    |

</div>

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

**Developer:** KEL TO YAHHHH!  
**Email:** [mikasaackerman.jme@gmail.com](mailto:mikasaackerman.jme@gmail.com)  
**Last Updated**: February 2026  
**Status**: Active Development  
**Part of:** [CAATE-ITRMS Project](../README.md)
