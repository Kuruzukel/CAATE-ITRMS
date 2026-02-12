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

        // Show success message (optional)
        alert('Course updated successfully!');
    });

    // Menu toggle is handled by main.js - no need to duplicate here
});