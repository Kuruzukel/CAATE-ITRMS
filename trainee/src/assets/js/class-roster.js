const enrolledCourses = [
    { id: 1, name: 'Beauty Care (Skin Care) NC II', code: 'SOCBCS220', hours: '307 hours', type: 'NC II', status: 'active', image: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=400&h=250&fit=crop' },
    { id: 2, name: 'Beauty Care (Nail Care) NC II', code: 'SOCBCN220', hours: '307 hours', type: 'NC II', status: 'active', image: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=400&h=250&fit=crop' },
    { id: 3, name: 'Aesthetic Services Level III', code: 'SOCAES320', hours: '264 hours', type: 'Level III', status: 'completed', image: 'https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=400&h=250&fit=crop' }
];

// Sample trainee data with applications and registrations
const traineesData = [
    { id: 1, name: 'Maria Santos', traineeId: 'TRN-001', initials: 'MS', courseId: 1, applicationStatus: 'approved', registrationStatus: 'approved' },
    { id: 2, name: 'Anna Cruz', traineeId: 'TRN-002', initials: 'AC', courseId: 1, applicationStatus: 'approved', registrationStatus: 'pending' },
    { id: 3, name: 'Rosa Garcia', traineeId: 'TRN-003', initials: 'RG', courseId: 1, applicationStatus: 'pending', registrationStatus: 'pending' },
    { id: 4, name: 'Elena Lopez', traineeId: 'TRN-004', initials: 'EL', courseId: 1, applicationStatus: 'approved', registrationStatus: 'approved' },
    { id: 5, name: 'Sofia Martinez', traineeId: 'TRN-005', initials: 'SM', courseId: 1, applicationStatus: 'cancelled', registrationStatus: 'cancelled' },
    { id: 6, name: 'Isabella Reyes', traineeId: 'TRN-006', initials: 'IR', courseId: 2, applicationStatus: 'approved', registrationStatus: 'approved' },
    { id: 7, name: 'Carmen Flores', traineeId: 'TRN-007', initials: 'CF', courseId: 2, applicationStatus: 'approved', registrationStatus: 'approved' },
    { id: 8, name: 'Lucia Morales', traineeId: 'TRN-008', initials: 'LM', courseId: 2, applicationStatus: 'pending', registrationStatus: 'approved' },
    { id: 9, name: 'Valentina Ruiz', traineeId: 'TRN-009', initials: 'VR', courseId: 3, applicationStatus: 'approved', registrationStatus: 'approved' },
    { id: 10, name: 'Gabriela Soto', traineeId: 'TRN-010', initials: 'GS', courseId: 3, applicationStatus: 'approved', registrationStatus: 'pending' }
];

let selectedCourseId = 1;
let filteredCourses = [...enrolledCourses];
let filteredTrainees = [...traineesData];

const avatarColors = [
    'linear-gradient(135deg, #3691bf 0%, #325596 100%)',
    'linear-gradient(135deg, #10b981 0%, #059669 100%)',
    'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
    'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
    'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
    'linear-gradient(135deg, #ec4899 0%, #db2777 100%)',
    'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)',
    'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
    'linear-gradient(135deg, #14b8a6 0%, #0d9488 100%)',
    'linear-gradient(135deg, #f97316 0%, #ea580c 100%)',
    'linear-gradient(135deg, #a855f7 0%, #9333ea 100%)',
    'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)',
    'linear-gradient(135deg, #84cc16 0%, #65a30d 100%)',
    'linear-gradient(135deg, #f43f5e 0%, #e11d48 100%)',
    'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)'
];

const attendanceStatus = ['Present', 'Absent'];

function getRandomAttendance() {
    return attendanceStatus[Math.floor(Math.random() * attendanceStatus.length)];
}

function getBadgeColor(status) {
    return status === 'Present' ? 'bg-success' : 'bg-danger';
}

function initializeCourses() {
    const container = document.getElementById('coursesContainer');
    container.innerHTML = '';

    if (filteredCourses.length === 0) {
        container.innerHTML = `
            <div class="col-12 text-center py-5">
                <i class="bx bx-search" style="font-size: 3rem; color: #6c757d;"></i>
                <p class="mt-3 text-muted" style="color: white !important;">No courses found matching your filters</p>
            </div>
        `;
        return;
    }

    filteredCourses.forEach((course, index) => {
        const statusBadge = course.status === 'active'
            ? '<span class="badge bg-success">Active</span>'
            : course.status === 'completed'
                ? '<span class="badge bg-info">Completed</span>'
                : '<span class="badge bg-warning">Pending</span>';

        const card = document.createElement('div');
        card.className = 'col-md-6 col-lg-4 mb-4';
        card.innerHTML = `
            <div class="card course-card" data-course-id="${course.id}" onclick="viewStudents(${course.id}, '${course.name}', this)">
                <div class="card-body">
                    <div class="d-flex justify-content-between align-items-start mb-3">
                        <img src="${course.image}" alt="${course.name}" style="width: 60px; height: 60px; object-fit: cover; border-radius: 50%; border: 3px solid #3691bf;" />
                        ${statusBadge}
                    </div>
                    <h5 class="card-title">${course.name}</h5>
                    <p class="text-muted mb-2">
                        <i class="bx bx-code-alt me-1"></i>${course.code}
                    </p>
                    <p class="text-muted mb-0">
                        <i class="bx bx-time-five me-1"></i>${course.hours}
                    </p>
                </div>
            </div>
        `;
        container.appendChild(card);
    });

    // Auto-select first course if available
    if (filteredCourses.length > 0) {
        setTimeout(() => {
            const firstCard = document.querySelector('.course-card');
            if (firstCard) {
                firstCard.classList.add('active');
                viewStudents(filteredCourses[0].id, filteredCourses[0].name, firstCard);
            }
        }, 100);
    }
}

function viewStudents(courseId, courseName, cardElement) {
    selectedCourseId = courseId;

    // Update the selected course name in the student list view
    const selectedCourseNameElement = document.getElementById('selectedCourseName');
    if (selectedCourseNameElement) {
        selectedCourseNameElement.textContent = courseName;
    }

    // Show student list view and hide courses view
    document.getElementById('coursesView').parentElement.style.display = 'none';
    document.getElementById('studentListView').style.display = 'block';

    document.querySelectorAll('.course-card').forEach(card => {
        card.classList.remove('active');
        card.style.border = '';
        card.style.boxShadow = '';
        card.style.transform = '';

        const titleElement = card.querySelector('.card-title');
        if (titleElement) {
            titleElement.style.color = '';
            titleElement.style.fontWeight = '';
        }

        const imageElement = card.querySelector('img');
        if (imageElement) {
            imageElement.style.border = '3px solid #3691bf';
        }

        const timeIcon = card.querySelector('.bx-time-five');
        if (timeIcon) {
            timeIcon.style.color = '';
        }

        const hoursText = card.querySelector('.text-muted');
        if (hoursText) {
            hoursText.style.color = '';
        }
    });

    if (cardElement) {
        cardElement.classList.add('active');
        cardElement.style.border = '3px solid #10b981';
        cardElement.style.boxShadow = '0 0 15px rgba(16, 185, 129, 1), 0 0 30px rgba(16, 185, 129, 0.8), 0 0 45px rgba(5, 150, 105, 0.6), 0 4px 20px rgba(5, 150, 105, 0.4)';
        cardElement.style.transform = 'scale(1.02)';

        const titleElement = cardElement.querySelector('.card-title');
        if (titleElement) {
            titleElement.style.color = '#10b981';
            titleElement.style.fontWeight = '600';
        }

        const imageElement = cardElement.querySelector('img');
        if (imageElement) {
            imageElement.style.border = '3px solid #10b981';
        }

        const timeIcon = cardElement.querySelector('.bx-time-five');
        if (timeIcon) {
            timeIcon.style.color = '#10b981';
        }

        const hoursText = cardElement.querySelector('.text-muted');
        if (hoursText) {
            hoursText.style.color = '#10b981';
        }
    }

    // Get filtered trainees for this course
    const students = filteredTrainees.filter(t => t.courseId === courseId);
    const studentsList = document.getElementById('studentsList');
    studentsList.innerHTML = '';

    if (students.length === 0) {
        studentsList.innerHTML = '<p class="text-muted" style="color: white !important;">No students found matching your filters.</p>';
        return;
    }

    students.forEach((student, index) => {
        const studentItem = document.createElement('div');
        studentItem.className = 'student-item';
        const avatarColor = avatarColors[index % avatarColors.length];

        // Status badges
        const appStatusBadge = student.applicationStatus === 'approved'
            ? '<span class="badge bg-success">App: Approved</span>'
            : student.applicationStatus === 'pending'
                ? '<span class="badge bg-warning">App: Pending</span>'
                : '<span class="badge bg-danger">App: Cancelled</span>';

        const regStatusBadge = student.registrationStatus === 'approved'
            ? '<span class="badge bg-success">Reg: Approved</span>'
            : student.registrationStatus === 'pending'
                ? '<span class="badge bg-warning">Reg: Pending</span>'
                : '<span class="badge bg-danger">Reg: Cancelled</span>';

        studentItem.innerHTML = `
            <div class="student-avatar" style="background: linear-gradient(135deg, rgba(54, 145, 191, 0.1) 0%, rgba(50, 85, 150, 0.1) 100%); backdrop-filter: blur(10px) saturate(180%); -webkit-backdrop-filter: blur(10px) saturate(180%); border: 1px solid rgba(54, 145, 191, 0.4); box-shadow: 0 4px 12px rgba(22, 56, 86, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.3); color: white;">${student.initials}</div>
            <div class="grow">
                <h6 class="mb-0">${student.name}</h6>
                <small class="text-muted">Trainee ID: ${student.traineeId}</small>
            </div>
            <div class="d-flex gap-2">
                ${appStatusBadge}
                ${regStatusBadge}
            </div>
        `;
        studentsList.appendChild(studentItem);
    });
}

// Filter function
function applyFilters() {
    const searchTerm = document.getElementById('searchTraineeInput').value.toLowerCase();
    const courseFilter = document.getElementById('courseFilter').value;
    const appStatus = document.getElementById('applicationStatusFilter').value;
    const regStatus = document.getElementById('registrationStatusFilter').value;

    filteredTrainees = traineesData.filter(trainee => {
        const matchesSearch = trainee.name.toLowerCase().includes(searchTerm) ||
            trainee.traineeId.toLowerCase().includes(searchTerm);
        const matchesCourse = !courseFilter || trainee.courseId === parseInt(courseFilter);
        const matchesAppStatus = !appStatus || trainee.applicationStatus === appStatus;
        const matchesRegStatus = !regStatus || trainee.registrationStatus === regStatus;

        return matchesSearch && matchesCourse && matchesAppStatus && matchesRegStatus;
    });

    // Update the student list if a course is selected
    if (selectedCourseId) {
        const selectedCourse = enrolledCourses.find(c => c.id === selectedCourseId);
        if (selectedCourse) {
            viewStudents(selectedCourseId, selectedCourse.name, document.querySelector(`.course-card[data-course-id="${selectedCourseId}"]`));
        }
    }
}

// Reset filters
function resetFilters() {
    document.getElementById('searchTraineeInput').value = '';
    document.getElementById('courseFilter').value = '';
    document.getElementById('applicationStatusFilter').value = '';
    document.getElementById('registrationStatusFilter').value = '';
    filteredTrainees = [...traineesData];

    // Refresh the current view
    if (selectedCourseId) {
        const selectedCourse = enrolledCourses.find(c => c.id === selectedCourseId);
        if (selectedCourse) {
            viewStudents(selectedCourseId, selectedCourse.name, document.querySelector(`.course-card[data-course-id="${selectedCourseId}"]`));
        }
    }
}

// Populate course filter dropdown
function populateCourseFilter() {
    const courseFilter = document.getElementById('courseFilter');
    enrolledCourses.forEach(course => {
        const option = document.createElement('option');
        option.value = course.id;
        option.textContent = course.name;
        courseFilter.appendChild(option);
    });
}

document.addEventListener('DOMContentLoaded', function () {
    // Populate course filter
    populateCourseFilter();

    // Initialize courses
    initializeCourses();

    // Add event listeners for filters
    document.getElementById('searchTraineeInput').addEventListener('input', applyFilters);
    document.getElementById('courseFilter').addEventListener('change', applyFilters);
    document.getElementById('applicationStatusFilter').addEventListener('change', applyFilters);
    document.getElementById('registrationStatusFilter').addEventListener('change', applyFilters);
    document.getElementById('resetCourseFilters').addEventListener('click', resetFilters);

    // Back to courses button
    const backBtn = document.getElementById('backToCoursesBtn');
    if (backBtn) {
        backBtn.addEventListener('click', function () {
            document.getElementById('studentListView').style.display = 'none';
            document.getElementById('coursesView').parentElement.style.display = 'block';
        });
    }

    setTimeout(() => {
        const firstCard = document.querySelector('.course-card');
        if (firstCard) {
            firstCard.classList.add('active');
            viewStudents(1, enrolledCourses[0].name, firstCard);
        }
    }, 200);
});
