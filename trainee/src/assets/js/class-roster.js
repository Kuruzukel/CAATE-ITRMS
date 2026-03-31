let allTrainees = [];
let allApplications = [];
let allRegistrations = [];
let filteredTrainees = [];

// Get initials from name
function getInitials(name) {
    if (!name) return '??';
    const parts = name.split(' ');
    if (parts.length >= 2) {
        return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
}

// Fetch all data from database
async function fetchAllData() {
    try {
        // Fetch trainees
        const traineesResponse = await fetch(`${config.api.baseUrl}/api/v1/trainees`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        const traineesResult = await traineesResponse.json();
        allTrainees = traineesResult.data || [];

        // Fetch applications
        const applicationsResponse = await fetch(`${config.api.baseUrl}/api/v1/applications`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        const applicationsResult = await applicationsResponse.json();
        allApplications = applicationsResult.data || [];

        // Fetch registrations
        const registrationsResponse = await fetch(`${config.api.baseUrl}/api/v1/registrations`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        const registrationsResult = await registrationsResponse.json();
        allRegistrations = registrationsResult.data || [];

        // Populate course filter
        populateCourseFilter();

        // Process and render data
        processTraineesData();

    } catch (error) {
        console.error('Error fetching data:', error);
        showError('Failed to load data. Please refresh the page.');
    }
}

// Process trainees data - only show approved applications and registrations
function processTraineesData() {
    const combinedData = [];

    console.log('Processing data - Trainees:', allTrainees.length, 'Applications:', allApplications.length, 'Registrations:', allRegistrations.length);

    // For each trainee, find their APPROVED applications and registrations
    allTrainees.forEach(trainee => {
        const traineeIdStr = trainee._id?.$oid || trainee._id;

        // Find APPROVED applications for this trainee
        const traineeApplications = allApplications.filter(app => {
            const appTraineeId = app.trainee_id || app.traineeId;
            return appTraineeId === traineeIdStr && app.status === 'approved';
        });

        // Find APPROVED registration for this trainee
        const registration = allRegistrations.find(r => {
            const rTraineeId = r.trainee_id || r.traineeId;
            return rTraineeId === traineeIdStr && r.status === 'approved';
        });

        const fullName = `${trainee.firstName || ''} ${trainee.middleName || ''} ${trainee.lastName || ''}`.trim();

        // Only show trainees with APPROVED applications AND registrations
        if (traineeApplications.length > 0 && registration) {
            traineeApplications.forEach(application => {
                combinedData.push({
                    id: traineeIdStr,
                    traineeId: trainee.traineeId || trainee.trainee_id || 'N/A',
                    name: fullName || trainee.username || 'Unknown',
                    initials: getInitials(fullName),
                    course: application.assessment_title || application.course || 'N/A',
                    email: trainee.email || 'N/A',
                    phone: trainee.phoneNumber || trainee.phone || 'N/A'
                });
            });
        }
    });

    console.log('Combined data (approved only):', combinedData.length);
    filteredTrainees = combinedData;
    renderTraineesTable();
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
        // Check if any filters are active
        const searchTerm = document.getElementById('searchTraineeInput').value;
        const courseFilter = document.getElementById('courseFilter').value;

        const hasActiveFilters = searchTerm || courseFilter;

        if (hasActiveFilters) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="4" class="text-center" style="padding: 60px 20px;">
                        <i class="bx bx-search" style="font-size: 3rem; color: #6c757d;"></i>
                        <p class="mt-3 text-muted" style="color: white !important;">No trainees found matching your filters</p>
                    </td>
                </tr>
            `;
        } else {
            tbody.innerHTML = `
                <tr>
                    <td colspan="4" class="text-center" style="padding: 60px 20px;">
                        <i class="bx bx-info-circle" style="font-size: 3rem; color: #6c757d;"></i>
                        <p class="mt-3 text-muted" style="color: white !important;">No approved trainees enrolled yet</p>
                    </td>
                </tr>
            `;
        }
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
            <td>${trainee.course}</td>
            <td>
                <button class="btn btn-sm btn-primary" onclick="viewTraineeDetails('${trainee.id}')">
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
    const courseFilter = document.getElementById('courseFilter').value.toLowerCase();

    // Get all combined data again from the original arrays (approved only)
    const combinedData = [];

    allTrainees.forEach(trainee => {
        const traineeIdStr = trainee._id?.$oid || trainee._id;

        // Find APPROVED applications for this trainee
        const traineeApplications = allApplications.filter(app => {
            const appTraineeId = app.trainee_id || app.traineeId;
            return appTraineeId === traineeIdStr && app.status === 'approved';
        });

        // Find APPROVED registration for this trainee
        const registration = allRegistrations.find(r => {
            const rTraineeId = r.trainee_id || r.traineeId;
            return rTraineeId === traineeIdStr && r.status === 'approved';
        });

        const fullName = `${trainee.firstName || ''} ${trainee.middleName || ''} ${trainee.lastName || ''}`.trim();

        // Only show trainees with APPROVED applications AND registrations
        if (traineeApplications.length > 0 && registration) {
            traineeApplications.forEach(application => {
                combinedData.push({
                    id: traineeIdStr,
                    traineeId: trainee.traineeId || trainee.trainee_id || 'N/A',
                    name: fullName || trainee.username || 'Unknown',
                    initials: getInitials(fullName),
                    course: application.assessment_title || application.course || 'N/A',
                    email: trainee.email || 'N/A',
                    phone: trainee.phoneNumber || trainee.phone || 'N/A'
                });
            });
        }
    });

    // Apply filters
    filteredTrainees = combinedData.filter(trainee => {
        const matchesSearch = !searchTerm ||
            trainee.name.toLowerCase().includes(searchTerm) ||
            trainee.traineeId.toLowerCase().includes(searchTerm);
        const matchesCourse = !courseFilter || trainee.course.toLowerCase().includes(courseFilter);

        return matchesSearch && matchesCourse;
    });

    console.log('Total combined:', combinedData.length, 'Filtered:', filteredTrainees.length);
    renderTraineesTable();
}

// Reset filters
function resetFilters() {
    document.getElementById('searchTraineeInput').value = '';
    document.getElementById('courseFilter').value = '';
    processTraineesData();
}

// Populate course filter dropdown
function populateCourseFilter() {
    const courseFilter = document.getElementById('courseFilter');

    // Get unique courses from APPROVED applications only
    const approvedApplications = allApplications.filter(app => app.status === 'approved');
    const uniqueCourses = [...new Set(approvedApplications.map(app => app.assessment_title || app.course).filter(c => c))];

    uniqueCourses.forEach(course => {
        const option = document.createElement('option');
        option.value = course.toLowerCase();
        option.textContent = course;
        courseFilter.appendChild(option);
    });
}

// View trainee details
function viewTraineeDetails(traineeId) {
    const trainee = filteredTrainees.find(t => t.id === traineeId);
    if (trainee) {
        alert(`Viewing details for: ${trainee.name}\nTrainee ID: ${trainee.traineeId}\nCourse: ${trainee.course}\nEmail: ${trainee.email}\nPhone: ${trainee.phone}`);
    }
}

// Show error message
function showError(message) {
    const tbody = document.getElementById('traineesTableBody');
    tbody.innerHTML = `
        <tr>
            <td colspan="4" class="text-center" style="padding: 60px 20px;">
                <i class="bx bx-error-circle" style="font-size: 3rem; color: #ff3e1d;"></i>
                <p class="mt-3 text-danger">${message}</p>
            </td>
        </tr>
    `;
}

document.addEventListener('DOMContentLoaded', function () {
    // Fetch all data
    fetchAllData();

    // Add event listeners for filters
    document.getElementById('searchTraineeInput').addEventListener('input', applyFilters);
    document.getElementById('courseFilter').addEventListener('change', applyFilters);
    document.getElementById('resetCourseFilters').addEventListener('click', resetFilters);
});
