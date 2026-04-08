

if (typeof window.API_BASE_URL === 'undefined') {
    window.API_BASE_URL = (typeof config !== 'undefined' && config.api)
        ? config.api.baseUrl
        : window.location.origin + '/CAATE-ITRMS/backend/public';
}

const getApiBaseUrl = () => window.API_BASE_URL;

document.addEventListener('DOMContentLoaded', function () {
    loadMyCourses();
});

async function loadMyCourses() {
    const container = document.getElementById('my-courses-container');
    if (!container) return;

    try {
        const userId = localStorage.getItem('userId');
        if (!userId) {
            console.error('User ID not found');
            return;
        }

        const [applicationsResponse, registrationsResponse] = await Promise.all([
            fetch(`${window.API_BASE_URL}/api/v1/applications`),
            fetch(`${window.API_BASE_URL}/api/v1/registrations`)
        ]);

        if (!applicationsResponse.ok || !registrationsResponse.ok) {
            throw new Error('Failed to fetch data');
        }

        const applicationsResult = await applicationsResponse.json();
        const registrationsResult = await registrationsResponse.json();

        const applications = applicationsResult.success ? applicationsResult.data : [];
        const registrations = registrationsResult.success ? registrationsResult.data : [];

        const userApplications = applications.filter(app => app.user_id === userId);
        const userRegistrations = registrations.filter(reg => reg.user_id === userId);

        const courseIds = [
            ...userApplications.map(app => app.course_id).filter(Boolean),
            ...userRegistrations.map(reg => reg.course_id).filter(Boolean)
        ];

        if (courseIds.length === 0) {
            return;
        }

        const coursesResponse = await fetch(`${window.API_BASE_URL}/api/v1/courses`);
        if (!coursesResponse.ok) {
            throw new Error('Failed to fetch courses');
        }

        const coursesResult = await coursesResponse.json();
        const allCourses = coursesResult.success ? coursesResult.data : [];

        const enrolledCourses = allCourses.filter(course => {
            const courseId = course._id?.$oid || course._id;
            return courseIds.includes(courseId);
        });

        if (enrolledCourses.length > 0) {
            renderMyCourses(enrolledCourses);
        }

    } catch (error) {
        console.error('Error loading my courses:', error);
    }
}

function renderMyCourses(courses) {
    const container = document.getElementById('my-courses-container');
    if (!container) return;

    container.innerHTML = '';

    courses.forEach(course => {
        const col = document.createElement('div');
        col.className = 'col-md-4 mb-3';

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
            <div class="card h-100">
                <img src="${course.image || 'https://via.placeholder.com/400x250?text=Course+Image'}"
                    class="card-img-top" alt="${course.title || 'Course'}"
                    style="height: 150px; object-fit: cover;" 
                    onerror="this.src='https://via.placeholder.com/400x250?text=Course+Image'" />
                <div class="card-body">
                    <span class="badge ${badgeClass} mb-2">${badgeText}</span>
                    <h6 class="card-title">${course.title || 'Untitled Course'}</h6>
                    <small class="text-muted"><i class="bx bx-time-five me-1"></i>${course.hours || course.duration || 'Duration TBA'}</small>
                </div>
            </div>
        `;

        container.appendChild(col);
    });
}

