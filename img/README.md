# 🖼️ Shared Assets Directory - CAATE-ITRMS

Centralized repository for images, logos, and visual assets used across all CAATE (Creative Aesthetic Academy & Technical Education Inc.) Integrated Training & Resource Management System applications (Admin, Auth, Public, and Trainee).

## Folder Structure

```
img/
├── 📂 CAATE FB COURSES/                 # Course promotional images (5 files)
│   ├── ADVANCEDSKINCARE.png
│   ├── AESTHETICSERVICES.png
│   ├── BEAUTYCARE(NAILCARE).png
│   ├── BEAUTYCARE(SKINCARE).png
│   └── PERMANENTMAKEUPTATTOO.png
├── 📂 COURSES/                          # Course detail images (10 files)
│   ├── Advanced Skin Care Services Level III.jpg
│   ├── Aesthetic Services Level III.jpg
│   ├── Beauty Care (Nail Care) Services NC II.jpg
│   ├── Beauty Care (Skin Care) Services NC II.jpg
│   ├── Eyelash and Eyebrow Services Level III.jpg
│   ├── Perform Advanced Facial Treatment & Chemical Skin Peeling.jpg
│   ├── Perform Collagen Induction Therapy & Hair Loss Treatment.jpg
│   ├── Perform Light Therapy & Heat Therapy.jpg
│   ├── Permanent Make-Up Tattoo Services Level III.jpg
│   └── Trainers Methodology Level I.jpg
├── 📂 GRADUATES/                        # Graduate photos (21 files)
│   ├── 1.png
│   ├── AIRAH.png
│   ├── ANDREA.png
│   ├── ANDREA (2).png
│   ├── CLARISSA.png
│   ├── EUNICE.png
│   ├── JARWYNE.png
│   ├── JELLIE.png
│   ├── JOAN.png
│   ├── JONATHAN.png
│   ├── KRIZIA.png
│   ├── LOURDES.png
│   ├── MARA.png
│   ├── MARGOT.png
│   ├── MARISOL.png
│   ├── MELINDA.png
│   ├── NICOLE.png
│   ├── PIA.png
│   ├── RENZ.png
│   ├── SAIRA.png
│   └── SHAINNA.png
├── 📄 CAATE Logos & Branding (8 files)
│   ├── CAATELOGOGRADIENT.png            # Gradient version
│   ├── CAATELOGOROUNDED.png             # Rounded version
│   ├── CAATELOGOREMOVEBG-removebg-preview.png  # Transparent background
│   ├── ROUNDCAATELOGO.png               # Round format
│   ├── ADMINCAATELOGO.png               # Admin-specific logo
│   ├── ADMINLOGONOBG.png                # Admin logo no background
│   ├── CAATE_META_LOGO.png              # Meta/social media logo
│   └── color.jpg                        # Color palette reference
├── 📄 TESDA Logos & Branding (7 files)
│   ├── TESDALOGOGRADIENT.png            # Gradient version
│   ├── TESDANOTEXTLOGO.png              # Logo without text
│   ├── TESDA-LOGO-TEXT.png              # Logo with text
│   ├── TESDALOGONOBG.png                # No background version
│   ├── TESDALOGOWHITEBG.png             # White background version
│   ├── tesda-logo.webp                  # WebP format
│   └── TESDALOGOGRADIENT.png            # Gradient version
├── 📄 Background Images (5 files)
│   ├── CAATEBG.png
│   ├── CAATEBGEDITED.png
│   ├── CAATEBGFINAL.png
│   ├── CAATEBGX.png
│   └── color.jpg
├── 📄 Other Assets (4 files)
│   ├── 11.png
│   ├── AVATARNIKEL.jpg                  # Avatar image
│   ├── DEFAULT_AVATAR.png               # Default avatar/profile image
│   └── default_avatar.jpg               # Default avatar alternate
└── 📄 README.md                         # This file
```

## Asset Categories

### CAATE Course Images (`CAATE FB COURSES/`)

Promotional images for course offerings on social media and public website:

- **ADVANCEDSKINCARE.png** - Advanced skincare course promotion
- **AESTHETICSERVICES.png** - Aesthetic services course promotion
- **BEAUTYCARE(NAILCARE).png** - Nail care course promotion
- **BEAUTYCARE(SKINCARE).png** - Skincare course promotion
- **PERMANENTMAKEUPTATTOO.png** - Permanent makeup course promotion

**Usage**: Public website course pages, social media, marketing materials

### Course Detail Images (`COURSES/`)

Detailed course images for course pages and documentation:

- **Advanced Skin Care Services Level III.jpg**
- **Aesthetic Services Level III.jpg**
- **Beauty Care (Nail Care) Services NC II.jpg**
- **Beauty Care (Skin Care) Services NC II.jpg**
- **Eyelash and Eyebrow Services Level III.jpg**
- **Perform Advanced Facial Treatment & Chemical Skin Peeling.jpg**
- **Perform Collagen Induction Therapy & Hair Loss Treatment.jpg**
- **Perform Light Therapy & Heat Therapy.jpg**
- **Permanent Make-Up Tattoo Services Level III.jpg**
- **Trainers Methodology Level I.jpg**

**Usage**: Course detail pages, curriculum documentation, certificates

### Graduate Photos (`GRADUATES/`)

Professional photos of program graduates for:

- Graduate directory/portfolio
- Success stories
- Alumni recognition
- Marketing materials

**Usage**: Admin graduates page, public testimonials, marketing

### CAATE Logos

Various formats and styles of CAATE branding:

- **CAATELOGOGRADIENT.png** - Gradient design for modern look
- **CAATELOGOROUNDED.png** - Rounded corners version
- **CAATELOGOREMOVEBG-removebg-preview.png** - Transparent background for overlays
- **ROUNDCAATELOGO.png** - Circular format for favicons/avatars
- **ADMINCAATELOGO.png** - Admin dashboard branding
- **CAATE_META_LOGO.png** - Social media and meta tags

**Usage**: Headers, navigation, branding, social media

### TESDA Logos

Philippine TESDA (Technical Education and Skills Development Authority) branding:

- **TESDALOGOGRADIENT.png** - Gradient version
- **TESDANOTEXTLOGO.png** - Logo only, no text
- **TESDA-LOGO-TEXT.png** - Logo with text
- **TESDALOGONOBG.png** - Transparent background
- **TESDALOGOWHITEBG.png** - White background version
- **tesda-logo.webp** - Modern WebP format

**Usage**: Official documentation, certificates, compliance materials

### Background Images

Decorative and functional background assets:

- **CAATEBG.png** - Main background
- **CAATEBGEDITED.png** - Edited version
- **CAATEBGFINAL.png** - Final version
- **CAATEBGX.png** - Alternative version
- **color.jpg** - Color palette reference

**Usage**: Page backgrounds, hero sections, design elements

### Other Assets

Miscellaneous images:

- **11.png** - Generic asset
- **DEFAULT_AVATAR.png** - Default avatar/profile picture
- **ADMINLOGONOBG.png** - Admin logo without background

## Usage Guidelines

### Referencing Images in HTML

From any application, reference shared images using relative paths:

```html
<!-- From admin application -->
<img src="../../img/CAATELOGOGRADIENT.png" alt="CAATE Logo" />

<!-- From auth application -->
<img src="../../img/TESDA-LOGO-TEXT.png" alt="TESDA Logo" />

<!-- From public application -->
<img
  src="../../img/CAATE FB COURSES/ADVANCEDSKINCARE.png"
  alt="Advanced Skincare"
/>

<!-- From trainee application -->
<img src="../../img/GRADUATES/AIRAH.png" alt="Graduate Photo" />
```

### Image Optimization

When adding new images:

1. Optimize file size (use tools like TinyPNG, ImageOptim)
2. Use appropriate format:
   - PNG for logos and graphics with transparency
   - JPG for photographs
   - WebP for modern browsers (with fallback)
3. Provide multiple sizes for responsive design
4. Include descriptive alt text

### Naming Conventions

- Use UPPERCASE for logo and branding files
- Use descriptive names for course and graduate images
- Use lowercase for utility images
- Avoid spaces; use underscores or hyphens
- Include format in name if multiple versions exist (e.g., `_gradient`, `_nobg`)

## File Formats

- **PNG**: Logos, graphics, images with transparency
- **JPG**: Photographs, complex images
- **WebP**: Modern format for better compression (with PNG fallback)
- **SVG**: Vector graphics (if available)

## Image Specifications

### Logos

- Minimum size: 200x200px
- Recommended size: 500x500px or larger
- Format: PNG with transparency
- Color space: RGB

### Course Images

- Recommended size: 800x600px or 1200x900px
- Format: PNG or JPG
- Aspect ratio: 4:3 or 16:9
- Optimized for web (< 500KB)

### Graduate Photos

- Recommended size: 400x400px to 600x600px
- Format: JPG
- Aspect ratio: 1:1 (square)
- Optimized for web (< 200KB)

### Background Images

- Recommended size: 1920x1080px or larger
- Format: JPG or WebP
- Optimized for web (< 1MB)

## Adding New Images

1. Optimize the image for web
2. Place in appropriate subfolder
3. Use descriptive filename
4. Update this README with new asset information
5. Update all applications that reference the image

## Maintenance

### Regular Tasks

- Review unused images quarterly
- Update outdated branding materials
- Optimize large files
- Maintain consistent naming conventions

### Cleanup

- Remove duplicate images
- Delete outdated versions
- Archive old graduate photos (if needed)

## Asset Inventory

| Category          | Count  | Total Size   | Format   |
| ----------------- | ------ | ------------ | -------- |
| Course Promo      | 5      | ~2 MB        | PNG      |
| Course Details    | 10     | ~4 MB        | JPG      |
| Graduate Photos   | 21     | ~5 MB        | PNG/JPG  |
| CAATE Logos       | 8      | ~1 MB        | PNG      |
| TESDA Logos       | 7      | ~1 MB        | PNG/WebP |
| Background Images | 5      | ~3 MB        | PNG/JPG  |
| Other Assets      | 4      | ~500 KB      | PNG/JPG  |
| **TOTAL**         | **60** | **~16.5 MB** | Mixed    |

## Best Practices

1. **Centralization**: Always use images from this folder, not duplicates
2. **Consistency**: Use consistent branding across all applications
3. **Performance**: Optimize images before adding to repository
4. **Documentation**: Update this README when adding new assets
5. **Versioning**: Keep old versions if needed, but mark as deprecated
6. **Accessibility**: Always include descriptive alt text in HTML

## Support

For questions about specific images or to request new assets, refer to the main project README.md

---

**Developer:** KEL TO YAHHHH!  
**Email:** developer@example.com  
**Last Updated**: March 2026  
**Total Assets**: 60 files  
**Status**: Active  
**Part of:** [CAATE-ITRMS Project](../README.md)
