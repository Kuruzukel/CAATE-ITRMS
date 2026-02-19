/* Courses Page Functionality */

document.addEventListener('DOMContentLoaded', function () {
    let currentCourseCard = null;

    // When edit button is clicked, populate modal with course data
    document.querySelectorAll('.edit-course-btn').forEach(btn => {
        btn.addEventListener('click', function () {
            currentCourseCard = this.closest('.card');

            document.getElementById('editCourseBadge').value = this.dataset.badge;
            document.getElementById('editCourseTitle').value = this.dataset.title;
            document.getElementById('editCourseDescription').value = this.dataset.description;
            document.getElementById('editCourseHours').value = this.dataset.hours;
            document.getElementById('editCourseImage').value = this.dataset.image;
        });
    });

    // Save changes
    document.getElementById('saveCourseBtn').addEventListener('click', function () {
        if (!currentCourseCard) return;

        const badge = document.getElementById('editCourseBadge').value;
        const title = document.getElementById('editCourseTitle').value;
        const description = document.getElementById('editCourseDescription').value;
        const hours = document.getElementById('editCourseHours').value;
        const image = document.getElementById('editCourseImage').value;

        // Update the card
        currentCourseCard.querySelector('.badge').textContent = badge;
        currentCourseCard.querySelector('.card-title').textContent = title;
        currentCourseCard.querySelector('.card-text').textContent = description;
        currentCourseCard.querySelector('small').innerHTML = `<i class="fas fa-clock me-1"></i> ${hours}`;

        if (image) {
            currentCourseCard.querySelector('.card-img-top').src = image;
        }

        // Update button data attributes
        const editBtn = currentCourseCard.querySelector('.edit-course-btn');
        editBtn.dataset.badge = badge;
        editBtn.dataset.title = title;
        editBtn.dataset.description = description;
        editBtn.dataset.hours = hours;
        editBtn.dataset.image = image;

        // Close modal
        const modal = bootstrap.Modal.getInstance(document.getElementById('editCourseModal'));
        modal.hide();

        // Show success toast notification
        showToast('Course updated successfully!', 'success');
    });

    // Menu toggle is handled by main.js - no need to duplicate here
});

// Toast notification function
function showToast(message, type = 'success') {
    const container = document.getElementById('toastContainer');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast-notification ${type}`;

    const icon = type === 'success' ? 'bx-check-circle' :
        type === 'error' ? 'bx-error' :
            type === 'warning' ? 'bx-error' : 'bx-info-circle';

    toast.innerHTML = `
        <div class="toast-icon-wrapper">
            <i class="bx ${icon} toast-icon"></i>
        </div>
        <div class="toast-content">
            <div class="toast-message">${message}</div>
        </div>
        <button class="toast-close" onclick="closeToast(this)">
            <i class="bx bx-x"></i>
        </button>
    `;

    container.appendChild(toast);

    // Auto remove after 5 seconds
    setTimeout(() => {
        closeToast(toast.querySelector('.toast-close'));
    }, 5000);
}

// Close toast notification
function closeToast(button) {
    const toast = button.closest('.toast-notification');
    if (toast) {
        toast.classList.add('hiding');
        setTimeout(() => {
            toast.remove();
        }, 300);
    }
}