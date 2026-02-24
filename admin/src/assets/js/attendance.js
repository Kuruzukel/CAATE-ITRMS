/* Attendance Page Script */
document.addEventListener('DOMContentLoaded', function () {
    // Menu toggle is handled by main.js - no need to duplicate here

    // Handle Time In Image Upload
    const editTimeInImage = document.getElementById('editTimeInImage');

    if (editTimeInImage) {
        editTimeInImage.addEventListener('change', function (e) {
            handleImageUpload(e.target.files[0], 'editTimeInImagePreview');
        });
    }

    // Handle Time Out Image Upload
    const editTimeOutImage = document.getElementById('editTimeOutImage');

    if (editTimeOutImage) {
        editTimeOutImage.addEventListener('change', function (e) {
            handleImageUpload(e.target.files[0], 'editTimeOutImagePreview');
        });
    }
});

// Handle image upload and preview
function handleImageUpload(file, previewElementId) {
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
        alert('Please select an image file');
        return;
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
        alert('File size must be less than 5MB');
        return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
        const previewContainer = document.getElementById(previewElementId);

        // Clear existing content
        previewContainer.innerHTML = '';

        // Create and add image element
        const img = document.createElement('img');
        img.src = e.target.result;
        img.alt = 'Preview';
        img.className = 'img-fluid rounded';
        img.style.maxHeight = '180px';
        img.style.objectFit = 'contain';

        previewContainer.appendChild(img);
    };
    reader.readAsDataURL(file);
}
