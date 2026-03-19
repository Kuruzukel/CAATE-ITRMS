/* Courses specific JavaScript */

// API Configuration - Use global API_BASE_URL if available
if (typeof window.API_BASE_URL === 'undefined') {
    window.API_BASE_URL = (typeof config !== 'undefined' && config.api)
        ? config.api.baseUrl
        : window.location.origin + '/CAATE-ITRMS/backend/public';
}

// Use API_BASE_URL directly from window object to avoid redeclaration conflicts
const getApiBaseUrl = () => window.API_BASE_URL;

// Store courses data globally
let coursesData = [];

// Handle enroll button clicks and course functionality
document.addEventListener('DOMContentLoaded', function () {
    loadCourses();
    initializeCourseSearch();
    initializeEnrollButtonHandlers();
});

// Initialize enroll button handlers
function initializeEnrollButtonHandlers() {
    document.addEventListener('click', function (e) {
        if (e.target.closest('.enroll-course-btn')) {
            const button = e.target.closest('.enroll-course-btn');
            const card = button.closest('.card');
            const enrollmentStatus = card.dataset.enrollmentStatus;

            // If enrollment is not open, show notification
            if (enrollmentStatus !== 'Open Enrollment') {
                let message = '';
                if (enrollmentStatus === 'Closed') {
                    message = 'Enrollment for this course is currently closed.';
                } else if (enrollmentStatus === 'Unpublished') {
                    message = 'This course is not yet available for enrollment.';
                } else {
                    message = 'Enrollment is not available at this time.';
                }
                showNotification(message, 'warning');
                return;
            }

            // If enrollment is open, proceed with enrollment logic
            const courseId = card.dataset.courseId;
            const courseTitle = card.querySelector('.card-title').textContent;
            handleEnrollment(courseId, courseTitle);
        }
    });
}

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
        const response = await fetch(`${window.API_BASE_URL}/api/v1/courses`);

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

    // Get enrollment status or default to 'Unpublished'
    const enrollmentStatus = course.enrollment_status || 'Unpublished';

    // Determine status badge color
    let statusBadgeClass = 'bg-secondary';
    if (enrollmentStatus === 'Open Enrollment') {
        statusBadgeClass = 'bg-success';
    } else if (enrollmentStatus === 'Closed') {
        statusBadgeClass = 'bg-danger';
    }

    // Determine if enrollment is allowed
    const isEnrollmentOpen = enrollmentStatus === 'Open Enrollment';
    const enrollButtonDisabled = !isEnrollmentOpen ? 'disabled' : '';
    const enrollButtonClass = isEnrollmentOpen ? 'btn-primary' : 'btn-secondary';
    const enrollButtonText = isEnrollmentOpen ? 'Enroll' : 'Not Available';

    col.innerHTML = `
        <div class="card h-100" data-course-id="${course._id?.$oid || ''}" data-enrollment-status="${enrollmentStatus}">
            <div class="position-relative">
                <img src="${course.image || 'https://via.placeholder.com/400x250?text=Course+Image'}"
                    class="card-img-top" alt="${course.title || 'Course'}"
                    style="height: 200px; object-fit: cover;" 
                    onerror="this.src='https://via.placeholder.com/400x250?text=Course+Image'" />
                <div class="position-absolute top-0 end-0 p-2">
                    <span class="badge ${statusBadgeClass}">${enrollmentStatus}</span>
                </div>
            </div>
            <div class="card-body d-flex flex-column">
                <span class="badge ${badgeClass} mb-2 align-self-start">${badgeText}</span>
                <h5 class="card-title">${course.title || 'Untitled Course'}</h5>
                <p class="card-text flex-grow-1">${course.description || 'No description available.'}</p>
                <div class="d-flex justify-content-between align-items-center mt-3">
                    <small><i class="fas fa-clock me-1"></i> ${course.hours || course.duration || 'Duration TBA'}</small>
                    <button class="btn btn-sm ${enrollButtonClass} enroll-course-btn" ${enrollButtonDisabled}>
                        <i class="bx ${isEnrollmentOpen ? 'bx-user-plus' : 'bx-lock-alt'}"></i> ${enrollButtonText}
                    </button>
                </div>
            </div>
        </div>
    `;

    return col;
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
function handleEnrollment(courseId, courseTitle) {
    // TODO: Implement actual enrollment logic here
    console.log('Enrolling in course:', courseId, courseTitle);
    // Add your enrollment logic here when ready
}

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `alert alert-${type} alert-dismissible fade show position-fixed`;
    notification.style.cssText = 'top: 20px; right: 20px; z-index: 9999; min-width: 300px;';

    // Determine icon based on type
    let icon = 'bx-info-circle';
    if (type === 'success') icon = 'bx-check-circle';
    else if (type === 'warning') icon = 'bx-error';
    else if (type === 'danger' || type === 'error') icon = 'bx-x-circle';

    notification.innerHTML = `
        <i class="bx ${icon} me-2"></i>${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;

    document.body.appendChild(notification);

    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 5000);
}
