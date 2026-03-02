/* Course Enrollment Statistics JavaScript */

// API Base URL
const API_BASE_URL = window.location.origin.includes('localhost')
    ? 'http://localhost/CAATE-ITRMS/backend/public'
    : '/CAATE-ITRMS/backend/public';

// Function to fetch course enrollment statistics
async function fetchCourseEnrollmentStatistics() {
    try {
        const response = await fetch(`${API_BASE_URL}/api/v1/courses/enrollment-statistics`);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();

        if (result.success) {
            updateCourseEnrollmentUI(result.data);
        }
    } catch (error) {
        console.error('Error fetching course enrollment statistics:', error);
        // Show default empty state
        updateCourseEnrollmentUI({ topCourses: [] });
    }
}

// Function to update Course Enrollment Statistics UI
function updateCourseEnrollmentUI(data) {
    // Update top enrolled courses list
    const coursesList = document.getElementById('topEnrolledCoursesList');
    if (!coursesList) return;

    if (!data.topCourses || data.topCourses.length === 0) {
        coursesList.innerHTML = `
            <li class="d-flex justify-content-center align-items-center py-5">
                <p class="text-muted">No course enrollment data available</p>
            </li>
        `;
        return;
    }

    coursesList.innerHTML = '';

    data.topCourses.forEach((course, index) => {
        const isLast = index === data.topCourses.length - 1;
        const li = document.createElement('li');
        li.className = isLast ? 'd-flex course-item' : 'd-flex mb-4 pb-1 course-item';
        li.style.cursor = 'pointer';
        li.style.transition = 'all 0.3s ease';
        li.setAttribute('data-course-id', course.id);
        li.setAttribute('data-course-name', course.name);
        li.setAttribute('data-course-hours', course.hours);
        li.setAttribute('data-course-description', course.description || '');

        li.innerHTML = `
            <div class="avatar flex-shrink-0 me-3">
                <img src="${course.image || 'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=400&h=250&fit=crop'}" 
                     alt="${course.name}" 
                     class="rounded" 
                     style="width: 38px; height: 38px; object-fit: cover;" />
            </div>
            <div class="d-flex w-100 flex-wrap align-items-center justify-content-between gap-2">
                <div class="me-2">
                    <h6 class="mb-0">${course.name}</h6>
                    <small class="text-muted">${course.hours} hours</small>
                </div>
                <div class="user-progress">
                    <small class="fw-semibold">${course.enrollmentCount || 0}</small>
                </div>
            </div>
        `;

        // Add hover effect
        li.addEventListener('mouseenter', function () {
            this.style.backgroundColor = 'rgba(54, 145, 191, 0.1)';
            this.style.borderRadius = '8px';
            this.style.padding = '8px';
            this.style.margin = '-8px';
            showCourseTooltip(this, course);
        });

        li.addEventListener('mouseleave', function () {
            this.style.backgroundColor = 'transparent';
            this.style.padding = '0';
            this.style.margin = '0';
            hideCourseTooltip();
        });

        coursesList.appendChild(li);
    });
}

// Function to show course tooltip on hover
function showCourseTooltip(element, course) {
    // Remove existing tooltip if any
    hideCourseTooltip();

    const tooltip = document.createElement('div');
    tooltip.id = 'courseTooltip';
    tooltip.className = 'course-tooltip';
    tooltip.innerHTML = `
        <div class="tooltip-header">
            <h6 class="mb-1">${course.name}</h6>
        </div>
        <div class="tooltip-body">
            <p class="mb-2"><strong>Duration:</strong> ${course.hours} hours</p>
            <p class="mb-2"><strong>Enrolled Trainees:</strong> ${course.enrollmentCount || 0}</p>
            ${course.description ? `<p class="mb-0"><strong>Description:</strong> ${course.description}</p>` : ''}
        </div>
    `;

    document.body.appendChild(tooltip);

    // Position tooltip
    const rect = element.getBoundingClientRect();
    tooltip.style.position = 'fixed';
    tooltip.style.top = `${rect.top}px`;
    tooltip.style.left = `${rect.right + 10}px`;
    tooltip.style.zIndex = '9999';
}

// Function to hide course tooltip
function hideCourseTooltip() {
    const tooltip = document.getElementById('courseTooltip');
    if (tooltip) {
        tooltip.remove();
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function () {
    fetchCourseEnrollmentStatistics();

    // Refresh every 30 seconds
    setInterval(fetchCourseEnrollmentStatistics, 30000);
});
