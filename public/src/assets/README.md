<div align="center">

# 🎨 Public Assets

### CAATE-ITRMS Landing Page

<p align="center">
  <i>All assets (CSS, JavaScript, images, fonts) for the public landing page</i>
</p>

</div>

---

## 📂 Structure

### Stylesheets (`css/`)

Stylesheets for public pages:

- **landing.css** - Main landing page styles
- **courses.css** - Course pages styles
- **trainers.css** - Trainer directory styles
- **responsive.css** - Responsive design styles
- **custom.css** - Custom theme and overrides

### JavaScript (`js/`)

JavaScript files for public functionality:

- **main.js** - Main application logic
- **navigation.js** - Navigation menu functionality
- **forms.js** - Form handling and validation
- **animations.js** - Page animations and transitions
- **course-filter.js** - Course filtering functionality
- **contact.js** - Contact form handling

### Images (`images/`)

Local images and branding assets:

- CAATE logos and branding
- TESDA logos
- Course promotional images
- Hero section images
- Background images

### Fonts (`fonts/`)

Font files for typography:

- Custom fonts
- Icon fonts
- Web fonts

---

## 🎯 Asset Organization

### Modular Structure

Each course page has its own CSS and JS files for:

- **Modularity** - Easy to maintain and update
- **Performance** - Load only what's needed
- **Scalability** - Add new courses without conflicts
- **Maintainability** - Clear separation of concerns

### Naming Convention

- Use kebab-case for file names
- Match file names to page names
- Use descriptive names for utilities

---

## 🖼️ Shared Assets

### Image References

For shared images and branding, reference the `/img/` folder at project root:

```html
<!-- Correct path from public pages -->
<img src="../../img/CAATELOGOGRADIENT.png" alt="CAATE Logo" />

<!-- Course images -->
<img
  src="../../img/CAATE FB COURSES/ADVANCEDSKINCARE.png"
  alt="Advanced Skincare"
/>

<!-- Trainer photos -->
<img src="../../img/GRADUATES/AIRAH.png" alt="Trainer" />
```

### Asset Loading

```javascript
// JavaScript asset loading
const logoPath = "../../img/CAATELOGOGRADIENT.png";
const coursePath = "../../img/CAATE FB COURSES/";
```

---

## 📝 Development Guidelines

### CSS

1. Mobile-first approach
2. Use CSS variables for theming
3. Follow BEM naming convention
4. Minimize use of !important
5. Optimize for performance
6. Ensure cross-browser compatibility

### JavaScript

1. Use vanilla JavaScript or jQuery
2. Implement proper error handling
3. Add comments for complex logic
4. Follow consistent code style
5. Optimize for performance
6. Ensure progressive enhancement

### Images

1. Optimize before adding to repository
2. Use appropriate formats (PNG, JPG, WebP)
3. Provide alt text in HTML
4. Use responsive images
5. Implement lazy loading
6. Use modern image formats with fallbacks

---

## 🚀 Performance Optimization

### Critical Assets

- Inline critical CSS
- Defer non-critical JavaScript
- Preload important resources
- Use resource hints (preconnect, prefetch)

### Asset Optimization

- Minify CSS and JavaScript for production
- Compress images (TinyPNG, ImageOptim)
- Use CDN for vendor libraries
- Implement code splitting
- Enable browser caching
- Use Gzip/Brotli compression

---

## 🌐 Progressive Web App (PWA)

### Service Worker

- Offline functionality
- Caching strategies
- Background sync
- Push notifications (optional)

### Manifest

- App icons
- Theme colors
- Display mode
- Start URL

---

## 📱 Responsive Design

All assets should support:

- Desktop (1920px+)
- Laptop (1366px - 1920px)
- Tablet (768px - 1365px)
- Mobile (320px - 767px)

---

## 🔍 SEO Optimization

### Image SEO

- Descriptive file names
- Alt text for all images
- Proper image dimensions
- Structured data markup

### Asset Loading

- Lazy load below-the-fold images
- Use appropriate image formats
- Implement responsive images
- Optimize loading priority

---

**Developer:** KEL TO YAHHHH!  
**Last Updated:** February 2026  
**Status:** Active Development  
**Part of:** [CAATE-ITRMS Public](../../README.md)

- **main.js** - Main application logic
- **navigation.js** - Navigation menu functionality
- **forms.js** - Form handling and validation
- **animations.js** - Page animations and trans- **trainers.css** - Trainer d

```

```
