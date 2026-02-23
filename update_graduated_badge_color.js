const fs = require('fs');

// Update enrollment.html
const enrollmentPath = 'admin/src/pages/enrollment.html';
let enrollmentContent = fs.readFileSync(enrollmentPath, 'utf8');

// Change Graduated badge from bg-success to bg-primary
enrollmentContent = enrollmentContent.replace(
    /<span class="badge bg-success">Graduated<\/span>/g,
    '<span class="badge bg-primary">Graduated</span>'
);

fs.writeFileSync(enrollmentPath, enrollmentContent, 'utf8');
console.log('Updated enrollment.html - Changed Graduated badge to blue');
