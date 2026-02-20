/* Courses specific JavaScript */

// API Configuration - uses global config if available, otherwise fallback
const API_BASE_URL = (typeof config !== 'undefined' && config.api)
    ? config.api.baseUrl
    : (window.location.hostname === 'localhost'
        ? 'http://localhost/CAATE-ITRMS/backend/public'
        : '/backend/public');

// Store courses data globally
let coursesData = [];

// Handle enroll button clicks and course functionality
document.addEventListener('DOMContentLoaded', function () {
    loadCourses();
    initializeCourseSearch();
});

// Load courses from API
async function loadCourses() {
    const loadingState = document.getElementById('loading-state');
    const errorState = document.getElementById('error-state');
    const emptyState = document.getElementById('empty-state');
    const coursesGrid = document.getElementById('courses-grid');

    try {
        // Show loading state
        loadingState.classList.remove('d-none');
        errorState.classList.add('d-none');
        emptyState.classList.add('d-none');
        coursesGrid.classList.add('d-none');

        // Fetch courses from API
        const response = await fetch(`${API_BASE_URL}/api/v1/courses`);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();

        if (result.success && result.data && result.data.length > 0) {
            coursesData = result.data;
            renderCourses(coursesData);

            // Hide loading, show courses
            loadingState.classList.add('d-none');
            coursesGrid.classList.remove('d-none');

            // Initialize enrollment after courses are rendered
            initializeCourseEnrollment();
            initializeCourseFilters();
        } else {
            // No courses found
            loadingState.classList.add('d-none');
            emptyState.classList.remove('d-none');
        }
    } catch (error) {
        console.error('Error loading courses:', error);

        // Show error state
        loadingState.classList.add('d-none');
        errorState.classList.remove('d-none');
        document.getElementById('error-message').textContent =
            `Failed to load courses: ${error.message}`;
    }
}

// Render courses to the grid
function renderCourses(courses) {
    const coursesGrid = document.getElementById('courses-grid');
    coursesGrid.innerHTML = '';

    courses.forEach(course => {
        const courseCard = createCourseCard(course);
        coursesGrid.appendChild(courseCard);
    });
}

// Create a course card element
function createCourseCard(course) {
    const col = document.createElement('div');
    col.className = 'col';

    // Determine badge color based on badge text
    let badgeClass = 'bg-primary';
    const badgeText = course.badge || course.course_code || '';

    if (badgeText.includes('Level III')) {
        badgeClass = 'bg-info';
    } else if (badgeText.includes('Specialized')) {
        badgeClass = 'bg-warning';
    } else if (badgeText.includes('Level I')) {
        badgeClass = 'bg-secondary';
    }

    col.innerHTML = `
        <div class="card h-100" data-course-id="${course._id?.$oid || ''}">
            <img src="${course.image || 'https://via.placeholder.com/400x250?text=Course+Image'}"
                class="card-img-top" alt="${course.title || 'Course'}"
                style="height: 200px; object-fit: cover;" 
                onerror="this.src='https://via.placeholder.com/400x250?text=Course+Image'" />
            <div class="card-body d-flex flex-column">
                <span class="badge ${badgeClass} mb-2 align-self-start">${badgeText}</span>
                <h5 class="card-title">${course.title || 'Untitled Course'}</h5>
                <p class="card-text flex-grow-1">${course.description || 'No description available.'}</p>
                <div class="d-flex justify-content-between align-items-center mt-3">
                    <small><i class="fas fa-clock me-1"></i> ${course.duration || course.hours || 'Duration TBA'}</small>
                    <button class="btn btn-sm btn-primary enroll-course-btn">
                        <i class="bx bx-user-plus"></i> Enroll
                    </button>
                </div>
            </div>
        </div>
    `;

    return col;
}

// Course enrollment functionality
function initializeCourseEnrollment() {
    const enrollButtons = document.querySelectorAll('.enroll-course-btn');

    enrollButtons.forEach(button => {
        button.addEventListener('click', function () {
            const card = this.closest('.card');
            const courseTitle = card.querySelector('.card-title').textContent;
            const courseBadge = card.querySelector('.badge').textContent;
            const courseId = card.getAttribute('data-course-id');

            // Show confirmation dialog
            if (confirm(`Do you want to enroll in:\n\n${courseTitle}\n(${courseBadge})`)) {
                enrollInCourse(this, courseTitle, courseBadge, courseId);
            }
        });
    });
}

function enrollInCourse(button, courseTitle, courseBadge, courseId) {
    // Show loading state
    button.disabled = true;
    button.innerHTML = '<i class="bx bx-loader-alt bx-spin"></i> Enrolling...';

    // Simulate API call (replace with actual enrollment API when available)
    setTimeout(() => {
        // Show success message
        alert('Enrollment request submitted successfully!\n\nYou will be notified once your enrollment is confirmed.');

        // Update button state
        button.innerHTML = '<i class="bx bx-check"></i> Enrolled';
        button.classList.remove('btn-primary');
        button.classList.add('btn-success');
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
    createFilterButtons();
}

function createFilterButtons() {
    const container = document.querySelector('.container-xxl');
    if (!container) return;

    // Check if filter buttons already exist
    if (container.querySelector('.filter-container')) return;

    const filterContainer = document.createElement('div');
    filterContainer.className = 'mb-4 filter-container';
    filterContainer.innerHTML = `
        <div class="d-flex gap-2 flex-wrap">
            <button class="btn btn-outline-primary filter-btn active" data-filter="all">All Courses</button>
            <button class="btn btn-outline-primary filter-btn" data-filter="nc-ii">NC II</button>
            <button class="btn btn-outline-primary filter-btn" data-filter="level-iii">Level III</button>
            <button class="btn btn-outline-primary filter-btn" data-filter="specialized">Specialized</button>
        </div>
    `;

    // Insert before the courses grid
    const coursesGrid = container.querySelector('#courses-grid');
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
    const notification = document.createElement('div');
    notification.className = `alert alert-${type} alert-dismissible fade show position-fixed`;
    notification.style.cssText = 'top: 20px; right: 20px; z-index: 9999; min-width: 300px;';
    notification.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;

    document.body.appendChild(notification);

    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 5000);
}
