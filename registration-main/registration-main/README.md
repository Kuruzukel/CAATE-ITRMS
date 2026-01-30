# TESDA Learner's Profile Form (MIS 03-01, ver. 2021)

## Overview
A fully responsive, mobile-first web application for completing the official TESDA Registration Form - Learner's Profile Form (MIS 03-01, version 2021).

## Features

### Screen Experience
- ✅ Professional TESDA-branded design with glassmorphism effects
- ✅ Elegant patterned background with TESDA blue color scheme
- ✅ Modern, card-based user interface with smooth animations
- ✅ Mobile-first responsive design
- ✅ Real-time form validation
- ✅ Digital signature capture (touch/mouse enabled)
- ✅ Auto-calculation of age from birthdate
- ✅ Clear error messages for required fields
- ✅ Subtle watermark and branded footer
- ✅ Works completely offline

### Print Experience
- ✅ Transforms into official TESDA government format
- ✅ A4-sized document layout
- ✅ CAATE and TESDA logos in header
- ✅ Proper field alignment and spacing
- ✅ Print-safe watermark
- ✅ Save as PDF via browser Print-to-PDF

## How to Use

### Option 1: Standalone Version (Recommended for Quick Use)
1. **Open the Form**
   - Simply open `tesda-learners-profile.html` in any modern web browser
   - This file contains everything embedded - no other files needed
   - Works on desktop, tablet, and mobile devices
   - No internet connection required

### Option 2: Modular Version (For Development)
1. **Setup**
   - Ensure all files are in their correct folders (css/, js/, img/)
   - Open `index.html` in any modern web browser
   - All external CSS and JS files will load automatically

2. **Fill Out the Form**
   - Complete all required fields (marked with red asterisk *)
   - Required sections include:
     - Entry Date
     - Name (Last, First)
     - Address (Barangay, City, Province, Region)
     - Contact Number
     - Nationality
     - Sex
     - Civil Status
     - Employment Status
     - Birthdate
     - Educational Attainment
     - Course/Qualification Title
     - Privacy Consent
     - Date Accomplished

3. **Save Your Progress**
   - Click "Save" button to save form data locally
   - Data is stored in browser's localStorage
   - Can be loaded later when you reopen the form

4. **Add Your Signature**
   - Click on the signature pad
   - Draw your signature using mouse or touch
   - Click "Clear" to redraw if needed

5. **Submit the Form**
   - Click "Submit" button when ready
   - Form will validate all required fields
   - If valid: Browser print dialog will open
   - Choose "Save as PDF" as destination
   - Document will be formatted in official TESDA layout

## Form Sections

### 1. T2MIS Auto Generated
- ULI Number
- Entry Date

### 2. Learner / Manpower Profile
- Full name and address details
- Contact information

### 3. Personal Information
- Sex, Civil Status
- Employment status before training
- Birthdate and birthplace
- Educational attainment
- Parent/Guardian information

### 4. Learner Classification
- 23 different classification options including:
  - 4Ps Beneficiary
  - Indigenous People
  - OFW Dependent
  - Student
  - And more...

### 5. Type of Disability
- For PWD applicants only
- Multiple disability types available

### 6. Causes of Disability
- Congenital/Inborn
- Illness
- Injury

### 7. Course Information
- Course/Qualification title

### 8. Scholarship Information
- TWSP, PESFA, STEP, or others

### 9. Privacy Consent
- Required consent acknowledgment

### 10. Applicant's Signature
- Digital signature
- Date accomplished
- Registrar/Administrator section

## Technical Details

- **File Type**: Single HTML file (standalone) or modular HTML with external CSS/JS
- **Dependencies**: None (vanilla HTML, CSS, JavaScript)
- **Browser Support**: All modern browsers (Chrome, Firefox, Safari, Edge)
- **Standalone File Size**: ~95KB
- **Modular Total Size**: ~53KB (HTML) + ~17KB (CSS) + ~24KB (JS)
- **Offline Capable**: Yes
- **Print Format**: A4 (210mm × 297mm)
- **Design**: TESDA-branded with glassmorphism and patterned background
- **Color Scheme**: Official TESDA Blue (#1a5490)

## Project Structure

```
registration/
├── index.html                      # Modular version (links to external files)
├── tesda-learners-profile.html    # Standalone version (all-in-one)
├── README.md                       # This file
│
├── css/                            # Stylesheets folder
│   ├── styles.css                  # Main styles
│   ├── navbar.css                  # Navigation styles
│   ├── print.css                   # Print styles
│   └── responsive.css              # Mobile responsive styles
│
├── js/                             # JavaScript folder
│   ├── app.js                      # Main application
│   ├── form-validation.js          # Form validation
│   ├── signature.js                # Signature pad
│   └── navbar.js                   # Navigation menu
│
└── img/                            # Images folder
    └── (place logos here)
```

## Tips

1. **Mobile Users**: Rotate to landscape for better experience on small screens
2. **Signature**: Use a stylus or finger for cleaner signatures on touch devices
3. **Saving**: Click "Save" button frequently to preserve your progress
4. **Auto-Load**: Form will ask to load saved data when reopened
5. **Submit**: Use Ctrl+P (Windows) or Cmd+P (Mac) for quick print dialog after clicking Submit
6. **Data Loss Prevention**: Form warns before closing if data is entered
7. **Review**: Use "Save" to preserve data, review later, then "Submit" when ready

## Compliance

This form follows the official TESDA MIS 03-01 (ver. 2021) structure and includes:
- All required fields from the official form
- Proper field ordering and numbering
- Official terminology and classifications
- Data Privacy Act of 2012 compliance notice

## Support

For issues or questions about the TESDA form requirements, please contact your local TESDA office or training center.

---

**Version**: 1.0  
**Last Updated**: January 2026  
**Form Version**: MIS 03-01 (ver. 2021)
