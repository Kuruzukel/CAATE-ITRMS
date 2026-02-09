/* Courses specific JavaScript */

// Handle enroll button clicks and course functionality
document.addEventListener('DOMContentLoaded', function () {
    initializeCourseEnrollment();
    initializeCourseSearch();
    initializeCourseFilters();
});

// Course enrollment functionality
function initializeCourseEnrollment() {
    const enrollButtons = document.querySelectorAll('.enroll-course-btn');

    enrollButtons.forEach(button => {
        button.addEventListener('click', function () {
            const card = this.closest('.card');
            const courseTitle = card.querySelector('.card-title').textContent;
            const courseBadge = card.querySelector('.badge').textContent;

            // Show confirmation dialog
            if (confirm(`Do you want to enroll in:\n\n${courseTitle}\n(${courseBadge})`)) {
                enrollInCourse(this, courseTitle, courseBadge);
            }
        });
    });
}

function enrollInCourse(button, courseTitle, courseBadge) {
    // Show loading state
    button.disabled = true;
    button.innerHTML = '<i class="bx bx-loader-alt bx-spin"></i> Enrolling...';

    // Simulate API call
    setTimeout(() => {
        // Show success message
        alert('Enrollment request submitted successfully!\n\nYou will be notified once your enrollment is confirmed.');

        // Update button state
        button.innerHTML = '<i class="bx bx-check"></i> Enrolled';
        button.classList.remove('btn-primary');
        button.classList.add('btn-success');

        // Keep button disabled to prevent multiple enrollments
        // button.disabled = false; // Uncomment if you want to allow re-enrollment
    }, 1500);
}

// Course search functionality
function initializeCourseSearch() {
    const searchInput = document.querySelector('input[placeholder*="Search"]');

    if (searchInput) {
        searchInput.addEventListener('input', function () {
            const searchTerm = this.value.toLowerCase();
            filterCourses(searchTerm);
        });
    }
}

function filterCourses(searchTerm) {
    const courseCards = document.querySelectorAll('.card');

    courseCards.forEach(card => {
        const title = card.querySelector('.card-title')?.textContent.toLowerCase() || '';
        const description = card.querySelector('.card-text')?.textContent.toLowerCase() || '';
        const badge = card.querySelector('.badge')?.textContent.toLowerCase() || '';

        const isVisible = title.includes(searchTerm) ||
            description.includes(searchTerm) ||
            badge.includes(searchTerm);

        const col = card.closest('.col');
        if (col) {
            col.style.display = isVisible ? 'block' : 'none';
        }
    });
}

// Course filters functionality
function initializeCourseFilters() {
    // Add filter buttons if needed
    createFilterButtons();
}

function createFilterButtons() {
    const container = document.querySelector('.container-xxl');
    if (!container) return;

    const filterContainer = document.createElement('div');
    filterContainer.className = 'mb-4';
    filterContainer.innerHTML = `
        <div class="d-flex gap-2 flex-wrap">
            <button class="btn btn-outline-primary filter-btn active" data-filter="all">All Courses</button>
            <button class="btn btn-outline-primary filter-btn" data-filter="nc-ii">NC II</button>
            <button class="btn btn-outline-primary filter-btn" data-filter="level-iii">Level III</button>
            <button class="btn btn-outline-primary filter-btn" data-filter="specialized">Specialized</button>
        </div>
    `;

    // Insert before the courses grid
    const coursesGrid = container.querySelector('.row.row-cols-1');
    if (coursesGrid) {
        container.insertBefore(filterContainer, coursesGrid);

        // Add event listeners to filter buttons
        const filterButtons = filterContainer.querySelectorAll('.filter-btn');
        filterButtons.forEach(button => {
            button.addEventListener('click', function () {
                // Update active button
                filterButtons.forEach(btn => btn.classList.remove('active'));
                this.classList.add('active');

                // Filter courses
                const filter = this.getAttribute('data-filter');
                filterCoursesByType(filter);
            });
        });
    }
}

function filterCoursesByType(filter) {
    const courseCards = document.querySelectorAll('.card');

    courseCards.forEach(card => {
        const badge = card.querySelector('.badge')?.textContent.toLowerCase() || '';
        let isVisible = true;

        if (filter !== 'all') {
            switch (filter) {
                case 'nc-ii':
                    isVisible = badge.includes('nc ii');
                    break;
                case 'level-iii':
                    isVisible = badge.includes('level iii');
                    break;
                case 'specialized':
                    isVisible = badge.includes('specialized');
                    break;
            }
        }

        const col = card.closest('.col');
        if (col) {
            col.style.display = isVisible ? 'block' : 'none';
        }
    });
}

// Utility functions
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `alert alert-${type} alert-dismissible fade show position-fixed`;
    notification.style.cssText = 'top: 20px; right: 20px; z-index: 9999; min-width: 300px;';
    notification.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;

    document.body.appendChild(notification);

    // Auto-remove after 5 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 5000);
}