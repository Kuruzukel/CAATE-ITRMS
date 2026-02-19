/* Courses Page Functionality */

// API Configuration
const API_BASE_URL = 'http://localhost/CAATE-ITRMS/backend/public/api/v1';

// State
let courses = [];
let currentCourseId = null;
let currentCourseCard = null;

document.addEventListener('DOMContentLoaded', function () {
    // Load courses from database
    loadCourses();

    // When edit button is clicked, populate modal with course data
    document.addEventListener('click', function (e) {
        if (e.target.closest('.edit-course-btn')) {
            const btn = e.target.closest('.edit-course-btn');
            currentCourseCard = btn.closest('.card');
            currentCourseId = btn.dataset.id;

            document.getElementById('editCourseBadge').value = btn.dataset.badge;
            document.getElementById('editCourseTitle').value = btn.dataset.title;
            document.getElementById('editCourseDescription').value = btn.dataset.description;
            document.getElementById('editCourseHours').value = btn.dataset.hours;
            document.getElementById('editCourseImage').value = btn.dataset.image;
        }
    });

    // Save changes
    document.getElementById('saveCourseBtn').addEventListener('click', async function () {
        if (!currentCourseId) return;

        const courseData = {
            badge: document.getElementById('editCourseBadge').value,
            title: document.getElementById('editCourseTitle').value,
            description: document.getElementById('editCourseDescription').value,
            hours: document.getElementById('editCourseHours').value,
            image: document.getElementById('editCourseImage').value
        };

        try {
            const response = await fetch(`${API_BASE_URL}/courses/${currentCourseId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(courseData)
            });

            const result = await response.json();

            if (result.success) {
                // Reload courses to reflect changes
                await loadCourses();

                // Close modal
                const modal = bootstrap.Modal.getInstance(document.getElementById('editCourseModal'));
                modal.hide();

                // Show success toast notification
                showToast('Course updated successfully!', 'success');
            } else {
                showToast(result.error || 'Failed to update course', 'error');
            }
        } catch (error) {
            console.error('Error updating course:', error);
            showToast('Error updating course. Please try again.', 'error');
        }
    });

    // Menu toggle is handled by main.js - no need to duplicate here
});

// Load courses from database
async function loadCourses() {
    const loadingSpinner = document.getElementById('loadingSpinner');
    const coursesGrid = document.getElementById('coursesGrid');

    console.log('Loading courses from:', `${API_BASE_URL}/courses`);

    try {
        const response = await fetch(`${API_BASE_URL}/courses`);
        console.log('Response status:', response.status);

        const result = await response.json();
        console.log('API Result:', result);

        if (result.success && result.data) {
            courses = result.data;
            console.log('Courses loaded:', courses.length);

            renderCourses(courses);

            // Hide loading, show grid
            if (loadingSpinner) loadingSpinner.style.display = 'none';
            if (coursesGrid) coursesGrid.style.display = 'flex';
        } else {
            console.error('API returned error:', result);
            if (loadingSpinner) loadingSpinner.style.display = 'none';
            if (coursesGrid) {
                coursesGrid.style.display = 'block';
                coursesGrid.innerHTML = '<div class="col-12 text-center"><p>No courses found. Please add courses to the database.</p></div>';
            }
            showToast(result.error || 'No courses found', 'error');
        }
    } catch (error) {
        console.error('Error loading courses:', error);
        if (loadingSpinner) loadingSpinner.style.display = 'none';
        if (coursesGrid) {
            coursesGrid.style.display = 'block';
            coursesGrid.innerHTML = '<div class="col-12 text-center"><p class="text-danger">Error loading courses. Check console for details.</p></div>';
        }
        showToast('Error loading courses. Please check your connection.', 'error');
    }
}

// Render courses to the page
// Render courses to the page
function renderCourses(coursesData) {
    const container = document.getElementById('coursesGrid');
    if (!container) return;

    container.innerHTML = '';

    coursesData.forEach(course => {
        const courseId = course._id.$oid || course._id;
        const col = document.createElement('div');
        col.className = 'col';

        // Use badge/hours if available, fallback to course_code/duration
        const badge = course.badge || course.course_code || 'N/A';
        const hours = course.hours || course.duration || 'N/A';

        // Determine badge color based on badge text
        let badgeClass = 'bg-primary';
        if (badge.includes('Level III')) {
            badgeClass = 'bg-info';
        } else if (badge.includes('Level I')) {
            badgeClass = 'bg-secondary';
        } else if (badge.includes('Specialized')) {
            badgeClass = 'bg-warning';
        } else if (badge.includes('NC II')) {
            badgeClass = 'bg-primary';
        }

        col.innerHTML = `
            <div class="card h-100">
                <img src="${course.image || 'https://via.placeholder.com/400x250'}"
                    class="card-img-top" alt="${course.title}"
                    style="height: 200px; object-fit: cover;" />
                <div class="card-body d-flex flex-column">
                    <span class="badge ${badgeClass} mb-2 align-self-start">${badge}</span>
                    <h5 class="card-title">${course.title}</h5>
                    <p class="card-text flex-grow-1">${course.description}</p>
                    <div class="d-flex justify-content-between align-items-center mt-3">
                        <small><i class="fas fa-clock me-1"></i> ${hours}</small>
                        <button class="btn btn-sm btn-outline-primary edit-course-btn"
                            data-bs-toggle="modal" data-bs-target="#editCourseModal"
                            data-id="${courseId}"
                            data-badge="${badge}"
                            data-title="${course.title}"
                            data-description="${course.description}"
                            data-hours="${hours}"
                            data-image="${course.image || ''}">
                            <i class="bx bx-edit"></i> Edit
                        </button>
                    </div>
                </div>
            </div>
        `;

        container.appendChild(col);
    });
}


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