# 🌐 Landing Page - CAATE-ITRMS

Professional public-facing website for CAATE (Creative Aesthetic Academy & Technical Education Inc.) Integrated Training & Resource Management System. Showcases training programs, course information, and trainer directory to attract prospective trainees.

## Folder Structure

```
public/
├── 📂 dist/                            # Built files (generated)
├── 📂 docs/
│   └── STRUCTURE.md                    # Structure documentation
├── 📂 src/
│   ├── 📂 assets/
│   │   ├── 📂 css/                     # Stylesheets (11 files)
│   │   │   ├── advanced-skincare.css   # Advanced skincare styles
│   │   │   ├── aesthetic.css           # Aesthetic services styles
│   │   │   ├── collagen-hairloss.css   # Collagen & hair loss styles
│   │   │   ├── eyelash-eyebrow.css     # Eyelash & eyebrow styles
│   │   │   ├── facial-peeling.css      # Facial peeling styles
│   │   │   ├── light-heat-therapy.css  # Light & heat therapy styles
│   │   │   ├── nailcare.css            # Nail care styles
│   │   │   ├── permanent-makeup.css    # Permanent makeup styles
│   │   │   ├── skincare.css            # Skincare styles
│   │   │   ├── style.css               # Main styles
│   │   │   └── trainers.css            # Trainers directory styles
│   │   ├── 📂 fonts/                   # Font assets
│   │   ├── 📂 images/                  # Application images (17 files)
│   │   │   ├── 📂 CAATE FB COURSES/    # Course promotional images (5)
│   │   │   ├── CAATE logos/            # CAATE branding (8)
│   │   │   ├── TESDA logos/            # TESDA branding (4)
│   │   │   └── Other assets/           # Miscellaneous
│   │   └── 📂 js/                      # JavaScript files (12 files)
│   │       ├── advanced-skincare.js    # Advanced skincare functionality
│   │       ├── aesthetic.js            # Aesthetic services functionality
│   │       ├── collagen-hairloss.js    # Collagen & hair loss functionality
│   │       ├── eyelash-eyebrow.js      # Eyelash & eyebrow functionality
│   │       ├── facial-peeling.js       # Facial peeling functionality
│   │       ├── light-heat-therapy.js   # Light & heat therapy functionality
│   │       ├── nailcare.js             # Nail care functionality
│   │       ├── permanent-makeup.js     # Permanent makeup functionality
│   │       ├── script.js               # Main application logic
│   │       ├── service-worker.js       # Service worker for PWA
│   │       ├── skincare.js             # Skincare functionality
│   │       └── trainers.js             # Trainers directory functionality
│   └── 📂 pages/                       # Public pages (11 files)
│       ├── 📂 courses/                 # Course information pages (10)
│       │   ├── advanced-skincare.html  # Advanced skincare course
│       │   ├── aesthetic.html          # Aesthetic services course
│       │   ├── collagen-hairloss.html  # Collagen & hair loss course
│       │   ├── eyelash-eyebrow.html    # Eyelash & eyebrow course
│       │   ├── facial-peeling.html     # Facial peeling course
│       │   ├── light-heat-therapy.html # Light & heat therapy course
│       │   ├── nailcare.html           # Nail care course
│       │   ├── permanent-makeup.html   # Permanent makeup course
│       │   ├── skincare.html           # Skincare course
│       │   └── trainers.html           # Trainers directory
│       └── index.html                  # Landing page
├── .gitignore                          # Git ignore rules
├── package.json                        # Dependencies and scripts
└── README.md                           # This file
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

<div align="center">

|                                                           Logo                                                            | Technology            | Purpose                           |
| :-----------------------------------------------------------------------------------------------------------------------: | :-------------------- | :-------------------------------- |
|      <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg" width="40" height="40"/>      | **HTML5**             | Semantic markup & structure       |
|       <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg" width="40" height="40"/>       | **CSS3**              | Styling & responsive design       |
| <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg" width="40" height="40"/> | **JavaScript**        | Client-side logic & interactivity |
|    <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/webpack/webpack-original.svg" width="40" height="40"/>    | **Webpack**           | Module bundler (if configured)    |
|                                                            📱                                                             | **PWA**               | Service Worker support            |
|                                                            🎨                                                             | **Responsive Design** | Mobile-first approach             |
|                                                            ⚡                                                             | **Performance**       | Optimized assets & lazy loading   |

</div>

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

**Developer:** KEL TO YAHHHH!  
**Email:** developer@example.com  
**Last Updated**: February 2026  
**Status**: Active Development  
**Part of:** [CAATE-ITRMS Project](../README.md)
