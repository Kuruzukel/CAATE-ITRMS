let allApplications = [];
let allRegistrations = [];
let filteredTrainees = [];
let displayTrainees = [];

function getInitials(name) {
    if (!name) return '??';
    const parts = name.split(' ');
    if (parts.length >= 2) {
        return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
}

async function fetchAllData() {
    try {
        const applicationsResponse = await fetch(`${config.api.baseUrl}/api/v1/applications`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        const applicationsResult = await applicationsResponse.json();
        allApplications = applicationsResult.data || [];
        console.log('Fetched applications:', allApplications.length);
        console.log('Approved applications:', allApplications.filter(app => (app.status || '').toLowerCase() === 'approved').length);

        const registrationsResponse = await fetch(`${config.api.baseUrl}/api/v1/registrations`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        const registrationsResult = await registrationsResponse.json();
        allRegistrations = registrationsResult.data || [];
        console.log('Fetched registrations:', allRegistrations.length);
        console.log('Approved registrations:', allRegistrations.filter(reg => (reg.status || '').toLowerCase() === 'approved').length);

        await populateCourseFilter();

        processTraineesData();

    } catch (error) {
        console.error('Error fetching data:', error);
        showError('Failed to load data. Please refresh the page.');
    }
}

async function processTraineesData() {
    const combinedData = [];

    // Filter for approved applications (case-insensitive)
    const approvedApps = allApplications.filter(app => {
        const status = (app.status || '').toLowerCase();
        return status === 'approved';
    });

    console.log('Processing approved applications:', approvedApps.length);
    if (approvedApps.length > 0) {
        console.log('Sample approved application:', approvedApps[0]);
    }

    // Process approved applications
    for (const application of approvedApps) {
        let appTraineeId = application.trainee_id || application.user_id || 'N/A';

        if (appTraineeId && typeof appTraineeId === 'object') {
            appTraineeId = appTraineeId.$oid || appTraineeId._id || 'N/A';
        }

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

        let profileImage = null;
        let userId = application.user_id || application.userId;

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

    // Filter for approved registrations (case-insensitive)
    const approvedRegs = allRegistrations.filter(reg => {
        const status = (reg.status || '').toLowerCase();
        return status === 'approved';
    });

    console.log('Processing approved registrations:', approvedRegs.length);
    if (approvedRegs.length > 0) {
        console.log('Sample approved registration:', approvedRegs[0]);
        console.log('Registration fields:', {
            traineeId: approvedRegs[0].traineeId,
            trainee_id: approvedRegs[0].trainee_id,
            userId: approvedRegs[0].userId,
            user_id: approvedRegs[0].user_id,
            firstName: approvedRegs[0].firstName,
            lastName: approvedRegs[0].lastName,
            selectedCourse: approvedRegs[0].selectedCourse,
            courseQualification: approvedRegs[0].courseQualification
        });
    }

    // Process approved registrations
    for (const registration of approvedRegs) {
        let regTraineeId = registration.traineeId || registration.trainee_id || registration.userId || registration.user_id || 'N/A';

        if (regTraineeId && typeof regTraineeId === 'object') {
            regTraineeId = regTraineeId.$oid || regTraineeId._id || 'N/A';
        }

        // Build full name from registration data
        let fullName = 'Unknown';
        const firstName = registration.firstName || registration.first_name || '';
        const middleName = registration.middleName || registration.middle_name || '';
        const lastName = registration.lastName || registration.last_name || '';

        fullName = [firstName, middleName, lastName]
            .filter(part => part && part.trim())
            .join(' ');

        let profileImage = null;
        let userId = registration.userId || registration.user_id;

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
            }
        }

        const traineeData = {
            id: registration._id?.$oid || registration._id,
            traineeId: regTraineeId,
            name: fullName || 'Unknown',
            initials: getInitials(fullName),
            profileImage: profileImage,
            course: registration.selectedCourse || registration.courseQualification || 'N/A',
            email: registration.emailFacebook || 'N/A',
            phone: registration.contactNo || 'N/A'
        };

        console.log('Adding trainee from registration:', traineeData);
        combinedData.push(traineeData);
    }

    console.log('Total combined data:', combinedData.length);
    console.log('Combined data:', combinedData);

    filteredTrainees = combinedData;
    displayTrainees = combinedData;
    renderTraineesTable();
}

function updateStatistics() {
    // Total Classmates (filtered count)
    const totalClassmates = filteredTrainees.length;
    document.getElementById('totalClassmates').textContent = totalClassmates;

    // Active Courses (unique courses in filtered data)
    const uniqueCourses = [...new Set(filteredTrainees.map(t => t.course))];
    const activeCourses = uniqueCourses.length;
    document.getElementById('activeCourses').textContent = activeCourses;

    // My Courses (get current user's enrolled courses from both applications and registrations)
    const currentUserId = localStorage.getItem('userId');
    let myCourses = 0;
    if (currentUserId) {
        // Check applications
        const myApplications = allApplications.filter(app => {
            let userId = app.user_id || app.userId;
            if (userId && typeof userId === 'object') {
                userId = userId.$oid || userId._id;
            }
            return userId === currentUserId && (app.status || '').toLowerCase() === 'approved';
        });

        // Check registrations
        const myRegistrations = allRegistrations.filter(reg => {
            let userId = reg.userId || reg.user_id;
            if (userId && typeof userId === 'object') {
                userId = userId.$oid || userId._id;
            }
            return userId === currentUserId && (reg.status || '').toLowerCase() === 'approved';
        });

        const myAppCourses = myApplications.map(app => app.assessment_title || app.course);
        const myRegCourses = myRegistrations.map(reg => reg.selectedCourse || reg.courseQualification);
        const myUniqueCourses = [...new Set([...myAppCourses, ...myRegCourses])];
        myCourses = myUniqueCourses.length;
    }
    document.getElementById('myCourses').textContent = myCourses;

    // Class Average (placeholder - can be calculated from grades if available)
    // For now, showing the number of trainees per course as average
    if (activeCourses > 0) {
        const avgPerCourse = (totalClassmates / activeCourses).toFixed(1);
        document.getElementById('classAverage').textContent = avgPerCourse;
    } else {
        document.getElementById('classAverage').textContent = '-';
    }
}

function renderTraineesTable() {
    const tbody = document.getElementById('traineesTableBody');
    const loader = document.getElementById('tableLoader');

    if (loader) {
        loader.remove();
    }

    tbody.innerHTML = '';

    // Update statistics based on display data
    updateStatistics();

    if (displayTrainees.length === 0) {
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

    displayTrainees.forEach(trainee => {
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

function applyFilters() {
    const searchTerm = document.getElementById('searchTraineeInput').value.toLowerCase();
    const courseFilter = document.getElementById('courseFilter').value.toLowerCase();

    // Filter from the full dataset (filteredTrainees) which has all profile images
    displayTrainees = filteredTrainees.filter(trainee => {
        const matchesSearch = !searchTerm ||
            trainee.name.toLowerCase().includes(searchTerm) ||
            trainee.traineeId.toLowerCase().includes(searchTerm);
        const matchesCourse = !courseFilter || trainee.course.toLowerCase().includes(courseFilter);

        return matchesSearch && matchesCourse;
    });

    renderTraineesTable();

    if (searchTerm) {
        setTimeout(() => {
            clearAllHighlights();
            highlightSearchResults(searchTerm);
        }, 50);
    } else {
        clearAllHighlights();
    }
}

function clearAllHighlights() {
    const tbody = document.getElementById('traineesTableBody');
    if (tbody) {
        const rows = tbody.querySelectorAll('tr');
        rows.forEach(row => {
            row.style.boxShadow = '';
            row.style.border = '';
            row.style.borderLeft = '';
            row.style.borderRadius = '';
            row.style.background = '';
            row.style.transition = '';
            row.style.transform = '';
            row.style.outline = '';
            row.style.outlineOffset = '';
            row.style.zIndex = '';
            row.style.position = '';
        });
    }
}

function highlightSearchResults(searchTerm) {
    const tbody = document.getElementById('traineesTableBody');
    if (!tbody) return;

    const rows = tbody.querySelectorAll('tr');
    let firstMatch = null;

    rows.forEach(row => {
        const rowText = row.textContent.toLowerCase();

        if (rowText.includes(searchTerm)) {
            row.style.position = 'relative';
            row.style.boxShadow = '0 8px 24px rgba(22, 56, 86, 0.5), 0 4px 12px rgba(54, 145, 191, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.15)';
            row.style.outline = '2px solid rgba(54, 145, 191, 0.6)';
            row.style.outlineOffset = '2px';
            row.style.borderRadius = '10px';
            row.style.background = 'linear-gradient(135deg, rgba(54, 145, 191, 0.08) 0%, rgba(50, 85, 150, 0.08) 100%)';
            row.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
            row.style.zIndex = '10';

            if (!firstMatch) {
                firstMatch = row;
            }
        }
    });

    if (firstMatch) {
        firstMatch.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
}

function resetFilters() {
    document.getElementById('searchTraineeInput').value = '';
    document.getElementById('courseFilter').value = '';
    clearAllHighlights();
    processTraineesData();
}

async function populateCourseFilter() {
    const courseFilter = document.getElementById('courseFilter');

    try {
        // Fetch courses from the courses collection
        const response = await fetch(`${config.api.baseUrl}/api/v1/courses`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (response.ok) {
            const result = await response.json();
            const courses = result.data || [];

            // Populate dropdown with courses from collection
            courses.forEach(course => {
                const option = document.createElement('option');
                option.value = (course.assessment_title || course.name || course.title || '').toLowerCase();
                option.textContent = course.assessment_title || course.name || course.title || 'Unknown Course';
                courseFilter.appendChild(option);
            });
        } else {
            // Fallback to unique courses from APPROVED applications and registrations
            const approvedApplications = allApplications.filter(app => {
                const status = (app.status || '').toLowerCase();
                return status === 'approved';
            });
            const approvedRegistrations = allRegistrations.filter(reg => {
                const status = (reg.status || '').toLowerCase();
                return status === 'approved';
            });

            const appCourses = approvedApplications.map(app => app.assessment_title || app.course).filter(c => c);
            const regCourses = approvedRegistrations.map(reg => reg.selectedCourse || reg.courseQualification).filter(c => c);
            const uniqueCourses = [...new Set([...appCourses, ...regCourses])];

            uniqueCourses.forEach(course => {
                const option = document.createElement('option');
                option.value = course.toLowerCase();
                option.textContent = course;
                courseFilter.appendChild(option);
            });
        }
    } catch (error) {
        console.error('Error fetching courses:', error);
        // Fallback to unique courses from APPROVED applications and registrations
        const approvedApplications = allApplications.filter(app => {
            const status = (app.status || '').toLowerCase();
            return status === 'approved';
        });
        const approvedRegistrations = allRegistrations.filter(reg => {
            const status = (reg.status || '').toLowerCase();
            return status === 'approved';
        });

        const appCourses = approvedApplications.map(app => app.assessment_title || app.course).filter(c => c);
        const regCourses = approvedRegistrations.map(reg => reg.selectedCourse || reg.courseQualification).filter(c => c);
        const uniqueCourses = [...new Set([...appCourses, ...regCourses])];

        uniqueCourses.forEach(course => {
            const option = document.createElement('option');
            option.value = course.toLowerCase();
            option.textContent = course;
            courseFilter.appendChild(option);
        });
    }
}

function viewTraineeDetails(traineeId) {
    const trainee = filteredTrainees.find(t => t.id === traineeId);
    if (trainee) {
        alert(`Viewing details for: ${trainee.name}\nTrainee ID: ${trainee.traineeId}\nCourse: ${trainee.course}\nEmail: ${trainee.email}\nPhone: ${trainee.phone}`);
    }
}

function showError(message) {
    const tbody = document.getElementById('traineesTableBody');
    tbody.innerHTML = `
        <tr>
            <td colspan="4" class="text-center" style="padding: 60px 20px;">
                <div class="d-flex flex-column align-items-center justify-content-center">
                    <i class="bx bx-error-circle" style="font-size: 3rem; color: #ff3e1d;"></i>
                    <p class="mt-3 text-danger text-center">${message}</p>
                </div>
            </td>
        </tr>
    `;
}

document.addEventListener('DOMContentLoaded', function () {
    fetchAllData();

    document.getElementById('searchTraineeInput').addEventListener('input', applyFilters);
    document.getElementById('courseFilter').addEventListener('change', applyFilters);
    document.getElementById('resetCourseFilters').addEventListener('click', resetFilters);
});
