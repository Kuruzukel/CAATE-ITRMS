# 🌐 Public Website & Course Portal - ESCAATE

Public-facing website for ESCAATE (Enterprise Skills & Competency Administration & Training Excellence) providing landing page, course information, and trainer directory. Showcases training programs and enables course discovery for prospective trainees.

## Folder Structure

```
public/
├── src/
│   ├── pages/                                  # Public pages
│   │   ├── index.html                         # Landing page
│   │   └── courses/                           # Course information pages
│   │       ├── skincare.html                  # Skincare course
│   │       ├── nailcare.html                  # Nail care course
│   │       ├── advanced-skincare.html         # Advanced skincare course
│   │       ├── aesthetic.html                 # Aesthetic services course
│   │       ├── collagen-hairloss.html         # Collagen & hair loss course
│   │       ├── eyelash-eyebrow.html           # Eyelash & eyebrow course
│   │       ├── facial-peeling.html            # Facial peeling course
│   │       ├── light-heat-therapy.html        # Light & heat therapy course
│   │       ├── permanent-makeup.html          # Permanent makeup course
│   │       └── trainers.html                  # Trainers directory
│   ├── assets/
│   │   ├── css/                               # Stylesheets
│   │   │   ├── style.css                      # Main styles
│   │   │   ├── skincare.css                   # Skincare page styles
│   │   │   ├── nailcare.css                   # Nail care page styles
│   │   │   ├── advanced-skincare.css          # Advanced skincare styles
│   │   │   ├── aesthetic.css                  # Aesthetic services styles
│   │   │   ├── collagen-hairloss.css          # Collagen & hair loss styles
│   │   │   ├── eyelash-eyebrow.css            # Eyelash & eyebrow styles
│   │   │   ├── facial-peeling.css             # Facial peeling styles
│   │   │   ├── light-heat-therapy.css         # Light & heat therapy styles
│   │   │   ├── permanent-makeup.css           # Permanent makeup styles
│   │   │   └── trainers.css                   # Trainers directory styles
│   │   ├── js/                                # JavaScript files
│   │   │   ├── script.js                      # Main application logic
│   │   │   ├── service-worker.js              # Service worker for PWA
│   │   │   ├── skincare.js                    # Skincare page functionality
│   │   │   ├── nailcare.js                    # Nail care page functionality
│   │   │   ├── advanced-skincare.js           # Advanced skincare functionality
│   │   │   ├── aesthetic.js                   # Aesthetic services functionality
│   │   │   ├── collagen-hairloss.js           # Collagen & hair loss functionality
│   │   │   ├── eyelash-eyebrow.js             # Eyelash & eyebrow functionality
│   │   │   ├── facial-peeling.js              # Facial peeling functionality
│   │   │   ├── light-heat-therapy.js          # Light & heat therapy functionality
│   │   │   ├── permanent-makeup.js            # Permanent makeup functionality
│   │   │   └── trainers.js                    # Trainers directory functionality
│   │   ├── images/                            # Application-specific images
│   │   └── vendor/                            # Third-party libraries
│   └── layouts/                               # Layout templates (if applicable)
├── public/                                    # Static files
├── dist/                                      # Built files (generated)
├── docs/
│   └── STRUCTURE.md                           # Structure documentation
├── package.json                               # Dependencies and scripts
├── .gitignore                                 # Git ignore rules
└── README.md                                  # This file
```

## Features

### Landing Page

- Hero section with call-to-action
- Featured courses showcase
- About CAATE section
- Testimonials and success stories
- Contact information
- Navigation to course pages

### Course Pages (10 Courses)

#### 1. Skincare (`skincare.html`)

- Course overview and objectives
- Curriculum details
- Duration and schedule
- Trainer information
- Enrollment information
- Course benefits

#### 2. Nail Care (`nailcare.html`)

- Nail care techniques and practices
- Course modules
- Tools and materials overview
- Certification details
- Enrollment process

#### 3. Advanced Skincare (`advanced-skincare.html`)

- Advanced skincare techniques
- Specialized treatments
- Prerequisites
- Advanced modules
- Professional development

#### 4. Aesthetic Services (`aesthetic.html`)

- Aesthetic service offerings
- Treatment options
- Professional standards
- Client care protocols
- Certification requirements

#### 5. Collagen & Hair Loss (`collagen-hairloss.html`)

- Collagen therapy techniques
- Hair loss treatments
- Scientific background
- Treatment protocols
- Results and outcomes

#### 6. Eyelash & Eyebrow (`eyelash-eyebrow.html`)

- Eyelash extension techniques
- Eyebrow design and shaping
- Product information
- Safety protocols
- Certification

#### 7. Facial Peeling (`facial-peeling.html`)

- Chemical peeling techniques
- Skin types and treatments
- Safety procedures
- Aftercare instructions
- Professional standards

#### 8. Light & Heat Therapy (`light-heat-therapy.html`)

- Light therapy techniques
- Heat therapy applications
- Equipment overview
- Treatment protocols
- Health and safety

#### 9. Permanent Makeup (`permanent-makeup.html`)

- Permanent makeup techniques
- Design and color theory
- Safety and hygiene
- Client consultation
- Certification

#### 10. Trainers Directory (`trainers.html`)

- Trainer profiles
- Specializations
- Experience and credentials
- Contact information
- Availability

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

```bash
# Navigate to public folder
cd public

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## Technologies Used

- **Frontend**: HTML5, CSS3, JavaScript
- **Build Tools**: Webpack (if configured)
- **PWA**: Service Worker support
- **Responsive Design**: Mobile-first approach
- **Performance**: Optimized assets and lazy loading

## Asset References

### Images

All images are stored in `/img/` folder at project root:

- CAATE logos and branding
- TESDA logos
- Course images
- Trainer photos

Update image paths in HTML to reference: `../../img/[image-name]`

### Course Images

Course-specific images are in `/img/CAATE FB COURSES/`:

- ADVANCEDSKINCARE.png
- AESTHETICSERVICES.png
- BEAUTYCARE(NAILCARE).png
- BEAUTYCARE(SKINCARE).png
- PERMANENTMAKEUPTATTOO.png

## Development Guidelines

1. **Responsive Design**: All pages must be mobile-friendly
2. **Performance**: Optimize images and minimize CSS/JS
3. **SEO**: Include proper meta tags and semantic HTML
4. **Accessibility**: Follow WCAG guidelines
5. **Consistency**: Use consistent styling across all course pages

## Page Structure

Each course page typically includes:

- Header with navigation
- Course title and hero image
- Course overview section
- Curriculum/modules section
- Trainer information
- Enrollment call-to-action
- Footer with contact information

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
2. Deploy contents of `dist/` folder to web server
3. Configure CDN for static assets
4. Set up SSL/TLS certificate
5. Configure domain and DNS

## Progressive Web App (PWA)

The site includes service worker support for:

- Offline functionality
- Caching strategies
- Push notifications (optional)
- App-like experience

## SEO Optimization

- Meta tags for all pages
- Open Graph tags for social sharing
- Structured data markup
- Sitemap generation
- Robot.txt configuration

## Performance Optimization

- Image optimization and lazy loading
- CSS and JavaScript minification
- Gzip compression
- Browser caching
- CDN integration

## Support

For issues or questions, refer to:

- `docs/STRUCTURE.md` - Detailed structure information

---

**Developer:** KEL TO ROR  
**Last Updated**: February 2026  
**Status**: Active Development  
**Part of:** [ESCAATE Project](../README.md)
