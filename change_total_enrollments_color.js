const fs = require('fs');

const files = [
    'admin/src/pages/enrollment.html',
    'admin/src/pages/application.html',
    'admin/src/pages/admission.html'
];

files.forEach(filePath => {
    let content = fs.readFileSync(filePath, 'utf8');

    // Change Total Enrollments icon color from blue to purple
    content = content.replace(
        /<i class="bx bx-receipt" style="font-size: 2rem; color: #3b82f6;"><\/i>\s*<\/div>\s*<\/div>\s*<span class="fw-semibold d-block mb-1">Total Enrollments<\/span>/g,
        '<i class="bx bx-receipt" style="font-size: 2rem; color: #8b5cf6;"></i>\n                                            </div>\n                                        </div>\n                                        <span class="fw-semibold d-block mb-1">Total Enrollments</span>'
    );

    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`✓ Updated ${filePath} - Changed Total Enrollments icon to purple`);
});

console.log('\nSuccessfully changed Total Enrollments icon color to purple (#8b5cf6) in all three files!');
