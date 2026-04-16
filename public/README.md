# 🌐 Landing Page - CAATE-ITRMS

Professional public-facing website for CAATE (Creative Aesthetic Academy & Technical Education Inc.) Integrated Training & Resource Management System. Showcases training programs, course information, and trainer directory to attract prospective trainees.

## Overview

The Landing Page is one of **4 frontend applications** in the CAATE-ITRMS ecosystem:

1. **Admin Dashboard** (`/admin`) - Administrative management interface
2. **Authentication System** (`/auth`) - Login, registration, and admission workflow
3. **Landing Page** (this module) - Public-facing website with course information
4. **Trainee Dashboard** (`/trainee`) - Student portal for trainees
5. **Backend API** (`/backend`) - RESTful API with PHP and MongoDB

## Folder Structure

```
public/
├── 📂 dist/                            # Built files (generated)
│   └── README.md
├── 📂 docs/
│   └── README.md
├── 📂 src/
│   ├── 📂 assets/
│   │   ├── 📂 css/                     # Stylesheets
│   │   ├── 📂 fonts/                   # Font assets
│   │   ├── 📂 images/                  # Application images
│   │   ├── 📂 js/                      # JavaScript files
│   │   └── README.md
│   └── 📂 pages/
│       ├── 📂 courses/                 # Course information pages (10)
│       ├── index.html                  # Landing page
│       └── README.md
├── .gitignore                          # Git ignore rules
├── .htaccess
├── package.json                        # Dependencies and scripts
└── README.md                           # This file
```

## Features

The Landing Page provides **11+ pages** showcasing CAATE's training programs and services:

### Main Landing Page

#### Hero Section

- Eye-catching design with professional imagery
- Clear call-to-action buttons
- Quick navigation to key sections
- Responsive hero banner
- Engaging tagline and mission statement

#### Featured Courses Showcase

- Highlight of popular courses
- Course thumbnails and brief descriptions
- Quick links to detailed course pages
- Visual course catalog

#### About CAATE Section

- Institution overview and history
- Mission and vision statements
- TESDA accreditation information
- Facilities and resources
- Success stories and achievements

#### Testimonials and Success Stories

- Student testimonials
- Graduate success stories
- Industry partnerships
- Achievement highlights

#### Contact Information

- Contact form
- Location and address
- Phone and email
- Social media links
- Operating hours

### Course Information Pages (10 Courses)

#### 1. Beauty Care (Skin Care) NC II (`skincare.html`)

- Course overview and objectives
- Curriculum details and modules
- Duration and schedule information
- Trainer information and credentials
- Enrollment information and requirements
- Course benefits and career opportunities
- TESDA certification details

#### 2. Beauty Care (Nail Care) NC II (`nailcare.html`)

- Nail care techniques and practices
- Course modules and learning outcomes
- Tools and materials overview
- Certification details
- Enrollment process and requirements
- Career pathways

#### 3. Advanced Skin Care Level III (`advanced-skincare.html`)

- Advanced skincare techniques
- Specialized treatments and procedures
- Prerequisites and requirements
- Advanced modules and curriculum
- Professional development opportunities
- Industry standards and practices

#### 4. Aesthetic Services Level III (`aesthetic.html`)

- Aesthetic service offerings
- Treatment options and techniques
- Professional standards and ethics
- Client care protocols
- Certification requirements
- Career advancement opportunities

#### 5. Collagen & Hair Loss Treatment (`collagen-hairloss.html`)

- Collagen therapy techniques
- Hair loss treatment methods
- Scientific background and research
- Treatment protocols and procedures
- Expected results and outcomes
- Client consultation process

#### 6. Eyelash & Eyebrow Services (`eyelash-eyebrow.html`)

- Eyelash extension techniques
- Eyebrow design and shaping
- Product information and selection
- Safety protocols and hygiene
- Certification and licensing
- Business opportunities

#### 7. Facial Peeling & Treatment (`facial-peeling.html`)

- Chemical peeling techniques
- Skin types and appropriate treatments
- Safety procedures and protocols
- Aftercare instructions
- Professional standards
- Client assessment

#### 8. Light & Heat Therapy (`light-heat-therapy.html`)

- Light therapy techniques and applications
- Heat therapy applications
- Equipment overview and operation
- Treatment protocols
- Health and safety considerations
- Therapeutic benefits

#### 9. Permanent Makeup Tattoo (`permanent-makeup.html`)

- Permanent makeup techniques
- Design and color theory
- Safety and hygiene standards
- Client consultation process
- Certification requirements
- Portfolio development

#### 10. Trainers Methodology Level I (`trainers.html`)

- Trainer profiles and credentials
- Specializations and expertise
- Experience and qualifications
- Contact information
- Availability and schedules
- Teaching methodologies

### Additional Features

#### Navigation

- Responsive navigation menu
- Quick links to all sections
- Mobile-friendly hamburger menu
- Smooth scrolling

#### Technical Features

- Fully responsive design
- Mobile-first approach
- SEO optimized with meta tags
- Fast loading times
- Cross-browser compatible
- Progressive Web App (PWA) support
- Offline functionality
- Social media integration

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
