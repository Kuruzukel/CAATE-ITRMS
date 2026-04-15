

if (typeof window.API_BASE_URL === 'undefined') {
    window.API_BASE_URL = (typeof config !== 'undefined' && config.api)
        ? config.api.baseUrl
        : window.location.origin + '/CAATE-ITRMS/backend/public';
}

const getApiBaseUrl = () => window.API_BASE_URL;

document.addEventListener('DOMContentLoaded', function () {
    loadStatistics();
    loadMyCourses();
});

async function loadStatistics() {
    try {
        // Fetch trainees and graduates counts
        const [traineesResponse, graduatesResponse] = await Promise.all([
            fetch(`${window.API_BASE_URL}/api/v1/trainees`),
            fetch(`${window.API_BASE_URL}/api/v1/graduates`)
        ]);

        let totalTrainees = 0;
        let totalGraduates = 0;

        if (traineesResponse.ok) {
            const traineesResult = await traineesResponse.json();
            if (traineesResult.success && traineesResult.data) {
                totalTrainees = traineesResult.data.length;
            }
        }

        if (graduatesResponse.ok) {
            const graduatesResult = await graduatesResponse.json();
            if (graduatesResult.success && graduatesResult.data) {
                totalGraduates = graduatesResult.data.length;
            }
        }

        // Update the UI
        const totalTraineesElement = document.getElementById('totalTraineesCount');
        const totalGraduatesElement = document.getElementById('totalGraduatesCount');

        if (totalTraineesElement) {
            totalTraineesElement.textContent = totalTrainees;
        }

        if (totalGraduatesElement) {
            totalGraduatesElement.textContent = totalGraduates;
        }
    } catch (error) {
        console.error('Error loading statistics:', error);
    }
}

async function loadMyCourses() {
    const container = document.getElementById('my-courses-container');
    if (!container) return;

    try {
        const userId = localStorage.getItem('userId');
        if (!userId) {
            console.error('User ID not found');
            return;
        }

        const [applicationsResponse, registrationsResponse, coursesResponse] = await Promise.all([
            fetch(`${window.API_BASE_URL}/api/v1/applications`),
            fetch(`${window.API_BASE_URL}/api/v1/registrations`),
            fetch(`${window.API_BASE_URL}/api/v1/courses`)
        ]);

        if (!applicationsResponse.ok || !registrationsResponse.ok) {
            throw new Error('Failed to fetch data');
        }

        const applicationsResult = await applicationsResponse.json();
        const registrationsResult = await registrationsResponse.json();
        const coursesResult = coursesResponse.ok ? await coursesResponse.json() : { success: false, data: [] };

        const applications = applicationsResult.success ? applicationsResult.data : [];
        const registrations = registrationsResult.success ? registrationsResult.data : [];
        const allCourses = coursesResult.success ? coursesResult.data : [];

        // Filter applications for current user (handle both object and string user_id)
        const userApplications = applications.filter(app => {
            let appUserId = app.user_id || app.userId;
            if (appUserId && typeof appUserId === 'object') {
                appUserId = appUserId.$oid || appUserId._id;
            }
            const isApproved = (app.status || '').toLowerCase() === 'approved';
            return appUserId === userId && isApproved;
        });

        // Filter registrations for current user (handle both object and string user_id)
        const userRegistrations = registrations.filter(reg => {
            let regUserId = reg.userId || reg.user_id;
            if (regUserId && typeof regUserId === 'object') {
                regUserId = regUserId.$oid || regUserId._id;
            }
            const isApproved = (reg.status || '').toLowerCase() === 'approved';
            return regUserId === userId && isApproved;
        });

        // Collect course information from applications and registrations
        const courses = [];
        const courseSet = new Set();

        // Helper function to find course details from courses collection
        const findCourseDetails = (courseName) => {
            return allCourses.find(c => {
                const title = c.assessment_title || c.title || c.name || '';
                return title.toLowerCase() === courseName.toLowerCase();
            });
        };

        // Add courses from applications
        userApplications.forEach(app => {
            const courseName = app.assessment_title || app.course;
            if (courseName && !courseSet.has(courseName)) {
                courseSet.add(courseName);
                const courseDetails = findCourseDetails(courseName);
                courses.push({
                    title: courseName,
                    badge: courseDetails?.badge || courseDetails?.course_code || app.course_code || 'NC II',
                    hours: courseDetails?.duration || courseDetails?.hours || app.duration || app.hours || 'Duration TBA',
                    image: courseDetails?.image || courseDetails?.course_image || app.course_image || null
                });
            }
        });

        // Add courses from registrations
        userRegistrations.forEach(reg => {
            const courseName = reg.selectedCourse || reg.courseQualification;
            if (courseName && !courseSet.has(courseName)) {
                courseSet.add(courseName);
                const courseDetails = findCourseDetails(courseName);
                courses.push({
                    title: courseName,
                    badge: courseDetails?.badge || courseDetails?.course_code || reg.course_code || 'NC II',
                    hours: courseDetails?.duration || courseDetails?.hours || reg.duration || reg.hours || 'Duration TBA',
                    image: courseDetails?.image || courseDetails?.course_image || reg.course_image || null
                });
            }
        });

        if (courses.length > 0) {
            renderMyCourses(courses);
        }

    } catch (error) {
        console.error('Error loading my courses:', error);
    }
}

function renderMyCourses(courses) {
    const container = document.getElementById('my-courses-container');
    if (!container) return;

    container.innerHTML = '';

    // Default placeholder as data URI (gray gradient)
    const defaultPlaceholder = 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22400%22 height=%22250%22%3E%3Crect width=%22400%22 height=%22250%22 fill=%22%23e0e0e0%22/%3E%3Ctext x=%2250%25%22 y=%2250%25%22 dominant-baseline=%22middle%22 text-anchor=%22middle%22 font-family=%22Arial, sans-serif%22 font-size=%2220%22 fill=%22%23999%22%3ECourse Image%3C/text%3E%3C/svg%3E';

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

        const courseImage = course.image || defaultPlaceholder;

        col.innerHTML = `
            <div class="card h-100">
                <img src="${courseImage}"
                    class="card-img-top" alt="${course.title || 'Course'}"
                    style="height: 150px; object-fit: cover;" 
                    onerror="this.src='data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22400%22 height=%22250%22%3E%3Crect width=%22400%22 height=%22250%22 fill=%22%23e0e0e0%22/%3E%3Ctext x=%2250%25%22 y=%2250%25%22 dominant-baseline=%22middle%22 text-anchor=%22middle%22 font-family=%22Arial, sans-serif%22 font-size=%2220%22 fill=%22%23999%22%3ECourse Image%3C/text%3E%3C/svg%3E'" />
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

