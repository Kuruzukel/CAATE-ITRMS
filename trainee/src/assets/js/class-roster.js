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

// Process trainees data - show ALL approved applications
async function processTraineesData() {
    const combinedData = [];

    console.log('Processing data - Trainees:', allTrainees.length, 'Applications:', allApplications.length, 'Registrations:', allRegistrations.length);
    const approvedApps = allApplications.filter(app => app.status === 'approved');

    // Show ALL approved applications with profile images
    for (const application of approvedApps) {
        const appTraineeId = application.trainee_id || application.user_id || 'N/A';

        // Extract name from application.name object
        let fullName = 'Unknown';
        if (application.name) {
            const firstName = application.name.first_name || '';
            const secondName = application.name.second_name || '';
            const middleName = application.name.middle_name || '';
            const surname = application.name.surname || '';
            const extension = application.name.name_extension || '';

            // Build full name: First Second Middle Surname Extension
            fullName = [firstName, secondName, middleName, surname, extension]
                .filter(part => part && part.trim())
                .join(' ');
        }

        // Fetch profile image from trainee data
        let profileImage = null;
        let userId = application.user_id || application.userId;

        // Handle MongoDB ObjectId format
        if (userId && typeof userId === 'object') {
            userId = userId.$oid || userId._id || null;
        }

        if (userId && typeof userId === 'string') {
            try {
                const traineeResponse = await fetch(`${config.api.baseUrl}/api/v1/trainees/${userId}`);
                const traineeData = await traineeResponse.json();
                if (traineeData.success && traineeData.data && traineeData.data.profile_image) {
                    profileImage = traineeData.data.profile_image;
                }
            } catch (error) {
                console.log('Could not fetch trainee profile:', error);
            }
        }

        combinedData.push({
            id: application._id?.$oid || application._id,
            traineeId: appTraineeId,
            name: fullName || 'Unknown',
            initials: getInitials(fullName),
            profileImage: profileImage,
            course: application.assessment_title || application.course || 'N/A',
            email: 'N/A',
            phone: 'N/A'
        });
    }

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
                    <td colspan="4" class="text-center" style="padding: 110px 20px;">
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

        const profileImage = trainee.profileImage;
        const initials = trainee.initials;
        const fullName = trainee.name;

        let avatarHtml;
        if (profileImage) {
            avatarHtml = `
                <div class="avatar avatar-sm me-3">
                    <img src="${profileImage}" 
                         alt="${fullName}" 
                         class="rounded-circle" 
                         style="width: 38px; height: 38px; object-fit: cover;"
                         onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
                    <div class="avatar-fallback" 
                         style="display: none; background: linear-gradient(135deg, rgba(54, 145, 191, 0.1) 0%, rgba(50, 85, 150, 0.1) 100%); 
                         backdrop-filter: blur(10px) saturate(180%); 
                         -webkit-backdrop-filter: blur(10px) saturate(180%); 
                         border: 1px solid rgba(54, 145, 191, 0.4); 
                         box-shadow: 0 4px 12px rgba(22, 56, 86, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.3); 
                         color: white; 
                         align-items: center; 
                         justify-content: center; 
                         border-radius: 50%; 
                         width: 38px; 
                         height: 38px; 
                         font-weight: 600;">
                        ${initials}
                    </div>
                </div>`;
        } else {
            avatarHtml = `
                <div class="avatar avatar-sm me-3"
                    style="background: linear-gradient(135deg, rgba(54, 145, 191, 0.1) 0%, rgba(50, 85, 150, 0.1) 100%); 
                    backdrop-filter: blur(10px) saturate(180%); 
                    -webkit-backdrop-filter: blur(10px) saturate(180%); 
                    border: 1px solid rgba(54, 145, 191, 0.4); 
                    box-shadow: 0 4px 12px rgba(22, 56, 86, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.3); 
                    color: white; 
                    display: flex; 
                    align-items: center; 
                    justify-content: center; 
                    border-radius: 50%; 
                    width: 38px; 
                    height: 38px; 
                    font-weight: 600;">
                    ${initials}
                </div>`;
        }

        row.innerHTML = `
            <td>
                <div class="d-flex align-items-center">
                    ${avatarHtml}
                    <span>${trainee.name}</span>
                </div>
            </td>
            <td>${trainee.traineeId}</td>
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

    // Get all approved applications again
    const approvedApps = allApplications.filter(app => app.status === 'approved');
    const combinedData = [];

    approvedApps.forEach(application => {
        const appTraineeId = application.trainee_id || application.user_id || 'N/A';

        // Extract name from application.name object
        let fullName = 'Unknown';
        if (application.name) {
            const firstName = application.name.first_name || '';
            const secondName = application.name.second_name || '';
            const middleName = application.name.middle_name || '';
            const surname = application.name.surname || '';
            const extension = application.name.name_extension || '';

            fullName = [firstName, secondName, middleName, surname, extension]
                .filter(part => part && part.trim())
                .join(' ');
        }

        // Find existing trainee data to preserve profile image
        const existingTrainee = filteredTrainees.find(t => t.id === (application._id?.$oid || application._id));
        const profileImage = existingTrainee ? existingTrainee.profileImage : null;

        combinedData.push({
            id: application._id?.$oid || application._id,
            traineeId: appTraineeId,
            name: fullName || 'Unknown',
            initials: getInitials(fullName),
            profileImage: profileImage,
            course: application.assessment_title || application.course || 'N/A',
            email: 'N/A',
            phone: 'N/A'
        });
    });

    // Apply filters
    filteredTrainees = combinedData.filter(trainee => {
        const matchesSearch = !searchTerm ||
            trainee.name.toLowerCase().includes(searchTerm) ||
            trainee.traineeId.toLowerCase().includes(searchTerm);
        const matchesCourse = !courseFilter || trainee.course.toLowerCase().includes(courseFilter);

        return matchesSearch && matchesCourse;
    });

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

    // Get unique courses from approved applications only
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
