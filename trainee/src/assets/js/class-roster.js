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

let filteredTrainees = [...traineesData];

// Get status badge HTML
function getStatusBadge(status) {
    if (status === 'approved') {
        return '<span class="badge bg-success">Approved</span>';
    } else if (status === 'pending') {
        return '<span class="badge bg-warning">Pending</span>';
    } else if (status === 'cancelled') {
        return '<span class="badge bg-danger">Cancelled</span>';
    }
    return '<span class="badge bg-secondary">Unknown</span>';
}

// Get course name by ID
function getCourseName(courseId) {
    const course = enrolledCourses.find(c => c.id === courseId);
    return course ? course.name : 'Unknown Course';
}

// Render trainees table
function renderTraineesTable() {
    const tbody = document.getElementById('traineesTableBody');
    const loader = document.getElementById('tableLoader');

    if (loader) {
        loader.remove();
    }

    tbody.innerHTML = '';

    if (filteredTrainees.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="6" class="text-center" style="padding: 60px 20px;">
                    <i class="bx bx-search" style="font-size: 3rem; color: #6c757d;"></i>
                    <p class="mt-3 text-muted" style="color: white !important;">No trainees found matching your filters</p>
                </td>
            </tr>
        `;
        return;
    }

    filteredTrainees.forEach(trainee => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${trainee.traineeId}</td>
            <td>
                <div class="d-flex align-items-center">
                    <div class="avatar avatar-sm me-3" style="width: 38px; height: 38px; background: linear-gradient(135deg, rgba(54, 145, 191, 0.1) 0%, rgba(50, 85, 150, 0.1) 100%); backdrop-filter: blur(10px) saturate(180%); border: 1px solid rgba(54, 145, 191, 0.4); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-weight: 600;">
                        ${trainee.initials}
                    </div>
                    <span>${trainee.name}</span>
                </div>
            </td>
            <td>${getCourseName(trainee.courseId)}</td>
            <td>${getStatusBadge(trainee.applicationStatus)}</td>
            <td>${getStatusBadge(trainee.registrationStatus)}</td>
            <td>
                <button class="btn btn-sm btn-primary" onclick="viewTraineeDetails(${trainee.id})">
                    <i class="bx bx-show"></i> View
                </button>
            </td>
        `;
        tbody.appendChild(row);
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

    renderTraineesTable();
}

// Reset filters
function resetFilters() {
    document.getElementById('searchTraineeInput').value = '';
    document.getElementById('courseFilter').value = '';
    document.getElementById('applicationStatusFilter').value = '';
    document.getElementById('registrationStatusFilter').value = '';
    filteredTrainees = [...traineesData];
    renderTraineesTable();
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

// View trainee details (placeholder function)
function viewTraineeDetails(traineeId) {
    const trainee = traineesData.find(t => t.id === traineeId);
    if (trainee) {
        alert(`Viewing details for: ${trainee.name}\nTrainee ID: ${trainee.traineeId}\nCourse: ${getCourseName(trainee.courseId)}`);
    }
}

document.addEventListener('DOMContentLoaded', function () {
    // Populate course filter
    populateCourseFilter();

    // Initial render
    setTimeout(() => {
        renderTraineesTable();
    }, 500);

    // Add event listeners for filters
    document.getElementById('searchTraineeInput').addEventListener('input', applyFilters);
    document.getElementById('courseFilter').addEventListener('change', applyFilters);
    document.getElementById('applicationStatusFilter').addEventListener('change', applyFilters);
    document.getElementById('registrationStatusFilter').addEventListener('change', applyFilters);
    document.getElementById('resetCourseFilters').addEventListener('click', resetFilters);
});
