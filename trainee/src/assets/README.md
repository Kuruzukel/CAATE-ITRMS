<div align="center">

# 🎨 Trainee Assets

### CAATE-ITRMS Trainee Dashboard

<p align="center">
  <i>All assets (CSS, JavaScript, images, fonts) for the trainee dashboard application</i>
</p>

</div>

---

## 📂 Structure

### Stylesheets (`css/`)

Stylesheets for trainee pages:

- Page-specific styles
- Component styles
- Responsive design styles
- Custom theme overrides

### JavaScript (`js/`)

JavaScript files for trainee functionality:

- Dashboard features
- Form handling and validation
- Data fetching and display
- User interactions
- Profile management
- Schedule & appointment tracking
- Competency tracking

### Images (`images/`)

Local images and branding assets:

- CAATE logos
- TESDA logos
- Course images
- UI graphics

### Additional Images (`img/`)

Additional UI images and illustrations:

- `avatars/` - User avatar images
- `backgrounds/` - Background images
- `elements/` - UI elements
- `favicon/` - Favicon files
- `icons/` - Icon sets
- `illustrations/` - Illustration graphics
  - girl-doing-yoga-light.png
  - man-with-laptop-light.png
  - page-misc-error-light.png
- `layouts/` - Layout images

### Vendor (`vendor/`)

Third-party libraries:

- Bootstrap
- jQuery
- Perfect Scrollbar
- Popper.js
- Other dependencies

---

## 🎯 Asset Organization

### Modular Structure

Each page typically has its own CSS and JS files for:

- **Modularity** - Easy to maintain and update
- **Performance** - Load only what's needed
- **Scalability** - Add new features without conflicts
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
<!-- Correct path from trainee pages -->
<img src="../../img/CAATELOGOGRADIENT.png" alt="CAATE Logo" />

<!-- Course images -->
<img
  src="../../img/COURSES/Beauty Care (Nail Care) Services NC II.jpg"
  alt="Nail Care Course"
/>

<!-- Graduate photos -->
<img src="../../img/GRADUATES/AIRAH.png" alt="Graduate" />
```

### Asset Loading

```javascript
// JavaScript asset loading
const logoPath = "../../img/CAATELOGOGRADIENT.png";
const coursePath = "../../img/COURSES/";
```

---

## 📝 Development Guidelines

### CSS

1. Keep styles modular and page-specific
2. Use CSS variables for theming
3. Follow BEM naming convention
4. Minimize use of !important
5. Optimize for performance
6. Ensure mobile responsiveness

### JavaScript

1. Use ES6+ features
2. Implement proper error handling
3. Add JSDoc comments
4. Follow consistent code style
5. Optimize for performance
6. Validate user inputs

### Images

1. Optimize before adding to repository
2. Use appropriate formats (PNG, JPG, WebP)
3. Provide alt text in HTML
4. Use responsive images
5. Implement lazy loading

---

## 🚀 Performance Optimization

- Minify CSS and JavaScript for production
- Compress images
- Use CDN for vendor libraries
- Implement code splitting
- Enable browser caching
- Lazy load images and components

---

## 📱 Responsive Design

All assets should support:

- Desktop (1920px+)
- Laptop (1366px - 1920px)
- Tablet (768px - 1365px)
- Mobile (320px - 767px)

---

**Developer:** KEL TO YAHHHH!  
**Last Updated:** February 2026  
**Status:** Active Development  
**Part of:** [CAATE-ITRMS Trainee](../../README.md)
