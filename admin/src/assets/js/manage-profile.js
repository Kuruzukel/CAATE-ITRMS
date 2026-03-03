/* Manage Profile Page Script */
document.addEventListener('DOMContentLoaded', function () {
    // Menu toggle is handled by main.js - no need to duplicate here
    initializePhotoUpload();
});

// Photo upload functionality
function initializePhotoUpload() {
    const changePhotoBtn = document.getElementById('changePhotoBtn');
    const profileImageInput = document.getElementById('profileImageInput');
    const profileImage = document.getElementById('profileImage');

    if (!changePhotoBtn || !profileImageInput || !profileImage) return;

    // Trigger file input when button is clicked
    changePhotoBtn.addEventListener('click', function () {
        profileImageInput.click();
    });

    // Handle file selection
    profileImageInput.addEventListener('change', function (e) {
        const file = e.target.files[0];

        if (!file) return;

        // Validate file type
        const validTypes = ['image/jpeg', 'image/jpg', 'image/png'];
        if (!validTypes.includes(file.type)) {
            alert('Please select a valid image file (JPG or PNG)');
            return;
        }

        // Validate file size (2MB max)
        const maxSize = 2 * 1024 * 1024; // 2MB in bytes
        if (file.size > maxSize) {
            alert('File size must be less than 2MB');
            return;
        }

        // Preview the image
        const reader = new FileReader();
        reader.onload = function (event) {
            profileImage.src = event.target.result;

            // Optional: Show success message
            showNotification('Photo updated successfully!', 'success');
        };
        reader.readAsDataURL(file);
    });
}

// Show notification (optional)
function showNotification(message, type = 'info') {
    // You can implement a toast notification here
    console.log(`${type}: ${message}`);
}