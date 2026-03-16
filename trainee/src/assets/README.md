# Trainee Portal Assets

Frontend assets for the Trainee Portal application.

## Structure

```
assets/
├── css/        # Stylesheets (12 files)
├── images/     # Local images (17 files)
├── img/        # Illustrations
├── js/         # JavaScript files (13 files)
└── vendor/     # Third-party libraries
```

## Asset Categories

### CSS (Stylesheets)

Page-specific styles:

- admission-slip.css
- application-form.css
- attendance.css
- change-password.css
- class-roster.css
- courses.css
- custom-theme.css
- dashboard.css
- demo.css
- manage-profile.css
- style.css (main)

### JavaScript

Page-specific functionality:

- admission-slip.js
- application-form.js
- attendance.js
- change-password.js
- class-roster.js
- competencies.js
- config.js
- courses.js
- dashboard.js
- main.js
- manage-profile.js
- menu-toggle.js
- student-id.js

### Images

- CAATE branding and logos
- TESDA logos
- Course promotional images

### Illustrations

- girl-doing-yoga-light.png
- man-with-laptop-light.png
- page-misc-error-light.png

### Vendor

Third-party libraries:

- Bootstrap
- jQuery
- Perfect Scrollbar
- Other dependencies

## Usage

### Referencing Assets

```html
<!-- CSS -->
<link rel="stylesheet" href="../assets/css/style.css" />

<!-- JavaScript -->
<script src="../assets/js/main.js"></script>

<!-- Images -->
<img src="../assets/images/CAATELOGOGRADIENT.png" alt="CAATE Logo" />

<!-- Illustrations -->
<img
  src="../assets/img/illustrations/man-with-laptop-light.png"
  alt="Student"
/>

<!-- Shared images from root -->
<img src="../../../img/GRADUATES/AIRAH.png" alt="Graduate" />
```

## Best Practices

1. **Organization**: Keep assets organized by type
2. **Naming**: Use kebab-case for file names
3. **Optimization**: Optimize images for web
4. **Modularity**: Keep page-specific assets separate
5. **Performance**: Minimize and bundle for production

---

**Part of:** [CAATE-ITRMS Trainee Portal](../README.md)
