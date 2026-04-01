<div align="center">

# 🎨 Admin Assets

### CAATE-ITRMS Admin Dashboard

<p align="center">
  <i>All assets (CSS, JavaScript, images, fonts) for the admin dashboard application</i>
</p>

</div>

---

## 📂 Structure

### Stylesheets (`css/`)

**16 CSS files** for different pages and components:

- `admin-dashboard-scrollbar.css` - Custom scrollbar styling
- `admin-dashboard.css` - Main dashboard styles
- `admission.css` - Admission page styles
- `application.css` - Application management styles
- `attendance.css` - Attendance tracking styles
- `audit-inventory.css` - Audit inventory styles
- `caate-inventory.css` - CAATE inventory styles
- `change-password.css` - Password change page styles
- `custom-theme.css` - Custom theme overrides
- `dashboard.css` - Dashboard layout styles
- `demo.css` - Demo and example styles
- `graduates.css` - Graduates page styles
- `registration.css` - Registration page styles
- `schedule.css` - Schedule management styles
- `style.css` - Global styles
- `table-scrollbar.css` - Table scrollbar customization

### JavaScript (`js/`)

**37 JavaScript files** for application functionality:

#### Core Files

- `config.js` - Application configuration
- `main.js` - Main application entry point
- `auth-guard.js` - Authentication protection
- `auth-dashboard.js` - Dashboard authentication

#### Page-Specific Files

- `accounts.js` - Account management
- `admin-dashboard.js` - Admin dashboard functionality
- `admission.js` - Admission processing
- `application.js` - Application management
- `attendance.js` - Attendance tracking
- `competencies.js` - Competency management
- `courses.js` - Course management
- `dashboard.js` - Dashboard features
- `graduates.js` - Graduate tracking
- `registration.js` - Registration processing
- `requests.js` - Request management
- `schedule.js` - Schedule management

#### Inventory Management

- `audit-inventory.js` - Audit inventory
- `audit-inventory-filter.js` - Audit inventory filtering
- `caate-inventory.js` - CAATE inventory
- `caate-inventory-filter.js` - CAATE inventory filtering
- `inventory-filter-dynamic.js` - Dynamic inventory filtering

#### UI Components

- `admin-navbar.js` - Navigation bar
- `menu-toggle.js` - Menu toggle functionality
- `menu-toggle-debug.js` - Menu debugging
- `navbar-utils.js` - Navigation utilities
- `ui-modals.js` - Modal dialogs
- `ui-popover.js` - Popover components
- `ui-toasts.js` - Toast notifications

#### Utilities

- `change-password.js` - Password management
- `manage-profile.js` - Profile management
- `pages-account-settings-account.js` - Account settings
- `dashboards-analytics.js` - Analytics dashboard
- `extended-ui-perfect-scrollbar.js` - Scrollbar enhancement
- `fix-scrollbar-warnings.js` - Scrollbar fixes
- `form-basic-inputs.js` - Form input handling
- `performance-fixes.js` - Performance optimizations
- `requests-optimized-functions.js` - Optimized request functions

### Images (`images/`)

**30+ local images and branding assets:**

- **CAATE FB COURSES/** - Course promotional images (5 files)
- **CAATE logos** - Various logo formats (8 files)
- **TESDA logos** - TESDA branding (6 files)
- **Other assets** - Miscellaneous images

### Additional Images (`img/`)

**UI images and illustrations:**

- `avatars/` - User avatar images
- `backgrounds/` - Background images
- `elements/` - UI elements
- `favicon/` - Favicon files
- `icons/` - Icon sets (brands, unicons)
- `illustrations/` - Illustration graphics
- `layouts/` - Layout images

### Fonts (`fonts/`)

Font files for typography and icons

### Vendor (`vendor/`)

Third-party libraries and dependencies

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
<!-- Correct path from admin pages -->
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

### JavaScript

1. Use ES6+ features
2. Implement proper error handling
3. Add JSDoc comments
4. Follow consistent code style
5. Optimize for performance

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

---

**Developer:** KEL TO YAHHHH!  
**Last Updated:** February 2026  
**Total Files:** 53+ assets  
**Status:** Active Development  
**Part of:** [CAATE-ITRMS Admin](../../README.md)
