<div align="center">

# 📐 Admin Layouts

### CAATE-ITRMS Admin Dashboard

<p align="center">
  <i>Reusable layout templates and components for the admin dashboard application</i>
</p>

</div>

---

## 🎯 Purpose

This directory contains layout templates and components that are shared across multiple pages, ensuring consistency and reducing code duplication throughout the admin dashboard.

---

## 📂 Layout Components

### Common Templates

- **Header/Navigation** - Top navigation bar with user menu
- **Sidebar** - Side navigation menu with page links
- **Footer** - Footer with copyright and links
- **Page Wrapper** - Common page structure and container
- **Content Area** - Main content layout structure

### Reusable Components

- **Breadcrumbs** - Navigation breadcrumb trail
- **Page Header** - Consistent page title and actions
- **Card Layout** - Card-based content containers
- **Table Layout** - Data table structures
- **Form Layout** - Form container and structure
- **Modal Layout** - Modal dialog templates

---

## 🎨 Layout Structure

### Base Layout

```html
<!DOCTYPE html>
<html>
  <head>
    <!-- Meta tags, title, CSS -->
  </head>
  <body>
    <!-- Navigation -->
    <nav><!-- Sidebar or top nav --></nav>

    <!-- Main Content -->
    <main>
      <!-- Page content -->
    </main>

    <!-- Footer -->
    <footer><!-- Footer content --></footer>

    <!-- Scripts -->
  </body>
</html>
```

### Dashboard Layout

- Sidebar navigation
- Top header with user menu
- Main content area
- Footer

### Full-Width Layout

- Top navigation only
- Full-width content area
- Minimal footer

---

## 💡 Usage

### Benefits

1. **Consistency** - Uniform look and feel across all pages
2. **Maintainability** - Update once, apply everywhere
3. **Efficiency** - Faster development with reusable templates
4. **Scalability** - Easy to add new pages with existing layouts
5. **Code Quality** - Reduced duplication and cleaner code

### Implementation

```html
<!-- Include layout template -->
<!-- Header -->
<?php include 'layouts/header.php'; ?>

<!-- Sidebar -->
<?php include 'layouts/sidebar.php'; ?>

<!-- Page Content -->
<main>
  <!-- Your page content here -->
</main>

<!-- Footer -->
<?php include 'layouts/footer.php'; ?>
```

---

## 🔧 Customization

### Layout Variants

- **Default Layout** - Standard dashboard layout
- **Compact Layout** - Reduced spacing for data-heavy pages
- **Full-Screen Layout** - Maximized content area
- **Print Layout** - Optimized for printing

### Responsive Behavior

- Mobile-first approach
- Collapsible sidebar on mobile
- Responsive navigation
- Adaptive content areas

---

## 📝 Development Guidelines

1. **Modularity** - Keep layouts modular and reusable
2. **Flexibility** - Allow customization through parameters
3. **Accessibility** - Follow WCAG guidelines
4. **Performance** - Optimize for fast loading
5. **Documentation** - Document layout usage and options

---

## 🎯 Best Practices

- Use semantic HTML5 elements
- Implement proper ARIA labels
- Ensure keyboard navigation
- Test across different screen sizes
- Validate HTML structure

---

**Developer:** KEL TO YAHHHH!  
**Last Updated:** February 2026  
**Status:** Active Development  
**Part of:** [CAATE-ITRMS Admin](../../README.md)
