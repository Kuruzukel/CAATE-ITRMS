

if (typeof window.API_BASE_URL === 'undefined') {
    window.API_BASE_URL = (typeof config !== 'undefined' && config.api)
        ? config.api.baseUrl
        : window.location.origin + '/CAATE-ITRMS/backend/public';
}

const getApiBaseUrl = () => window.API_BASE_URL;

let coursesData = [];

document.addEventListener('DOMContentLoaded', function () {
    loadCourses();
    initializeCourseSearch();
    initializeEnrollButtonHandlers();
});

function initializeEnrollButtonHandlers() {
    document.addEventListener('click', function (e) {
        if (e.target.closest('.enroll-course-btn')) {
            const button = e.target.closest('.enroll-course-btn');
            const card = button.closest('.card');
            const enrollmentStatus = card.dataset.enrollmentStatus;

            if (enrollmentStatus !== 'Open Enrollment') {
                let message = '';
                if (enrollmentStatus === 'Closed') {
                    message = 'Enrollment for this course is currently closed.';
                } else if (enrollmentStatus === 'Unpublished') {
                    message = 'This course is not yet available for enrollment.';
                } else {
                    message = 'Enrollment is not available at this time.';
                }
                showToast(message, 'warning');
                return;
            }

            const courseId = card.dataset.courseId;
            const courseTitle = card.querySelector('.card-title').textContent;
            const badgeText = card.querySelector('.card-body .badge').textContent.trim();
            handleEnrollment(courseId, courseTitle, badgeText);
        }
    });
}

async function loadCourses() {
    const loadingState = document.getElementById('loading-state');
    const errorState = document.getElementById('error-state');
    const emptyState = document.getElementById('empty-state');
    const coursesGrid = document.getElementById('courses-grid');

    try {
        loadingState.classList.remove('d-none');
        errorState.classList.add('d-none');
        emptyState.classList.add('d-none');
        coursesGrid.classList.add('d-none');

        const response = await fetch(`${window.API_BASE_URL}/api/v1/courses`);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();

        if (result.success && result.data && result.data.length > 0) {
            coursesData = result.data;
            renderCourses(coursesData);

            loadingState.classList.add('d-none');
            coursesGrid.classList.remove('d-none');

            initializeCourseFilters();
        } else {
            loadingState.classList.add('d-none');
            emptyState.classList.remove('d-none');
        }
    } catch (error) {
        console.error('Error loading courses:', error);

        loadingState.classList.add('d-none');
        errorState.classList.remove('d-none');
        document.getElementById('error-message').textContent =
            `Failed to load courses: ${error.message}`;
    }
}

function renderCourses(courses) {
    const coursesGrid = document.getElementById('courses-grid');
    coursesGrid.innerHTML = '';

    courses.forEach(course => {
        const courseCard = createCourseCard(course);
        coursesGrid.appendChild(courseCard);
    });
}

function createCourseCard(course) {
    const col = document.createElement('div');
    col.className = 'col';

    let badgeClass = 'bg-primary';
    const badgeText = course.badge || course.course_code || '';

    if (badgeText.includes('Level III')) {
        badgeClass = 'bg-info';
    } else if (badgeText.includes('Specialized')) {
        badgeClass = 'bg-warning';
    } else if (badgeText.includes('Level I')) {
        badgeClass = 'bg-secondary';
    }

    const enrollmentStatus = course.enrollment_status || 'Unpublished';

    let statusBadgeClass = 'bg-secondary';
    if (enrollmentStatus === 'Open Enrollment') {
        statusBadgeClass = 'bg-success';
    } else if (enrollmentStatus === 'Closed') {
        statusBadgeClass = 'bg-danger';
    }

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
                <p class="card-text grow">${course.description || 'No description available.'}</p>
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

function initializeCourseFilters() {
    createFilterButtons();
}

function createFilterButtons() {
    const container = document.querySelector('.container-xxl');
    if (!container) return;

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

    const coursesGrid = container.querySelector('#courses-grid');
    if (coursesGrid) {
        container.insertBefore(filterContainer, coursesGrid);

        const filterButtons = filterContainer.querySelectorAll('.filter-btn');
        filterButtons.forEach(button => {
            button.addEventListener('click', function () {
                filterButtons.forEach(btn => btn.classList.remove('active'));
                this.classList.add('active');

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

function handleEnrollment(courseId, courseTitle, badgeText) {
    console.log('Enrolling in course:', courseId, courseTitle, badgeText);

    const badgeUpper = badgeText.toUpperCase();

    if (badgeUpper.includes('NC II') || badgeUpper.includes('NC-II') || badgeUpper.includes('NCII')) {
        showToast('Please fill up the Application Form and Admission Slip to complete your enrollment.', 'info');

        setTimeout(() => {
            window.location.href = 'application-form.html';
        }, 5000);

    } else if (badgeUpper.includes('LEVEL III') || badgeUpper.includes('LEVEL 3') || badgeUpper.includes('LEVEL-III')) {
        showToast('Please fill up the Registration Form to complete your enrollment.', 'info');

        setTimeout(() => {
            window.location.href = 'registration-form.html';
        }, 5000);

    } else {
        showToast('Please complete the required forms to enroll in this course.', 'info');
    }
}

function showToast(message, type = 'success') {
    const container = document.getElementById('toastContainer');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast-notification ${type}`;

    const icon = type === 'success' ? 'bx-check' :
        type === 'error' ? 'bx-x' :
            type === 'warning' ? 'bx-error-alt' : 'bxs-info-circle';

    toast.innerHTML = `
        <i class="bx ${icon} toast-icon"></i>
        <div class="toast-content">
            <div class="toast-message">${message}</div>
        </div>
    `;

    container.appendChild(toast);

    setTimeout(() => {
        toast.classList.add('hiding');
        setTimeout(() => toast.remove(), 300);
    }, 5000);
}

function showNotification(message, type = 'info', duration = 5000) {
    showToast(message, type);
}
