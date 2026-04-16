let allGraduates = [];
let filteredGraduates = [];

function getInitials(name) {
    if (!name) return '??';
    const parts = name.split(' ');
    if (parts.length >= 2) {
        return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
}

async function fetchGraduatesData() {
    try {
        // Fetch graduates data from API
        const response = await fetch(`${config.api.baseUrl}/api/v1/graduates`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error('Failed to fetch graduates');
        }

        const result = await response.json();

        if (result.success && result.data && Array.isArray(result.data)) {
            allGraduates = result.data;
            filteredGraduates = [...allGraduates];

            await populateCourseFilter();
            populateYearFilter();
            updateStatistics();
            renderGraduatesGrid();
        } else {
            throw new Error('Invalid data format');
        }

    } catch (error) {
        console.error('Error fetching graduates:', error);
        showError('Failed to load graduates data. Please refresh the page.');
    }
}

function updateStatistics() {
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth();

    // Calculate statistics
    const totalGraduates = filteredGraduates.length;

    const thisYearCount = filteredGraduates.filter(grad => {
        const gradYear = new Date(grad.graduation_date).getFullYear();
        return gradYear === currentYear;
    }).length;

    const thisMonthCount = filteredGraduates.filter(grad => {
        const gradDate = new Date(grad.graduation_date);
        return gradDate.getFullYear() === currentYear && gradDate.getMonth() === currentMonth;
    }).length;

    const certifiedCount = filteredGraduates.filter(grad =>
        grad.certification && grad.certification.includes('NC II')
    ).length;

    // Update the cards using querySelector (matching admin approach)
    const totalCard = document.querySelector('#graduatesTotalCard .card-title.mb-2');
    const yearCard = document.querySelector('#graduatesThisYearCard .card-title.mb-2');
    const monthCard = document.querySelector('#graduatesThisMonthCard .card-title.mb-2');
    const certCard = document.querySelector('#graduatesCertifiedCard .card-title.mb-2');

    if (totalCard) totalCard.textContent = totalGraduates;
    if (yearCard) yearCard.textContent = thisYearCount;
    if (monthCard) monthCard.textContent = thisMonthCount;
    if (certCard) certCard.textContent = certifiedCount;
}

function renderGraduatesGrid() {
    const grid = document.getElementById('graduatesGrid');
    if (!grid) return;

    grid.innerHTML = '';

    if (filteredGraduates.length === 0) {
        const searchTerm = document.getElementById('graduateSearchInput').value;
        const courseFilter = document.getElementById('graduateCourseFilter').value;
        const hasActiveFilters = searchTerm || courseFilter;

        // Center the empty state
        grid.style.justifyContent = 'center';
        grid.style.alignItems = 'center';

        if (hasActiveFilters) {
            grid.innerHTML = `
                <div class="col-12" style="display: flex; justify-content: center; align-items: center;">
                    <div style="text-align: center;">
                        <i class="bx bx-search-alt" style="font-size: 4rem; opacity: 0.3; color: #697a8d; display: block; margin: 0 auto 15px;"></i>
                        <h5 style="margin-bottom: 10px; color: #697a8d;">No Graduates Found</h5>
                        <p style="margin: 5px 0 0 0; font-size: 0.9rem; opacity: 0.7; color: #697a8d;">Try adjusting your filters.</p>
                    </div>
                </div>
            `;
        } else {
            grid.innerHTML = `
                <div class="col-12" style="display: flex; justify-content: center; align-items: center;">
                    <div style="text-align: center;">
                        <i class="bx bxs-graduation" style="font-size: 4rem; opacity: 0.3; color: #697a8d; display: block; margin: 0 auto 15px;"></i>
                        <h5 style="margin-bottom: 10px; color: #697a8d;">No Graduates Yet</h5>
                        <p style="margin: 5px 0 0 0; font-size: 0.9rem; opacity: 0.7; color: #697a8d;">Graduate records will appear here.</p>
                    </div>
                </div>
            `;
        }
        return;
    }

    // Reset grid alignment when there are graduates
    grid.style.justifyContent = 'flex-start';
    grid.style.alignItems = 'flex-start';

    // Render each graduate card
    filteredGraduates.forEach(graduate => {
        const graduateData = graduate;
        const name = graduateData.name || 'Unknown';
        const traineeId = graduateData.trainee_id || 'N/A';
        const mongoId = graduateData._id?.$oid || graduateData._id || '';
        const course = graduateData.course || 'N/A';
        const certification = graduateData.certification || 'N/A';
        const email = graduateData.email || 'N/A';
        const imageUrl = graduateData.image_url || '../assets/images/DEFAULT_AVATAR.png';

        // Format graduation date
        let graduatedFormatted = 'N/A';
        if (graduateData.graduation_date) {
            const dateObj = new Date(graduateData.graduation_date);
            const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
            const day = dateObj.getDate();
            const month = monthNames[dateObj.getMonth()];
            const year = dateObj.getFullYear();
            graduatedFormatted = `${month} ${day}, ${year}`;
        }

        // Create card
        const newCard = document.createElement('div');
        newCard.className = 'col';
        newCard.innerHTML = `
            <div class="card h-100">
                <div class="position-relative">
                    <img src="${imageUrl}" class="card-img-top" alt="${name}" style="height: 200px; object-fit: cover;">
                </div>
                <div class="card-body">
                    <span class="badge mb-2" style="background-color: #5bc0de; color: #ffffff;">${certification}</span>
                    <h5 class="card-title mb-2">${name}</h5>
                    <p class="text-muted small mb-2">ID: ${traineeId}</p>
                    <p class="card-text small mb-2 graduate-course-text">
                        <i class="bx bx-book-open me-1"></i><span class="course-name">${course}</span>
                    </p>
                    <p class="card-text small mb-2">
                        <i class="bx bx-calendar me-1"></i>Graduated: ${graduatedFormatted}
                    </p>
                    <p class="card-text small mb-3">
                        <i class="bx bx-envelope me-1"></i>${email}
                    </p>
                    <div class="d-flex gap-2">
                        <button class="btn btn-sm btn-outline-primary w-100 view-graduate-btn" 
                            data-bs-toggle="modal" data-bs-target="#viewGraduateModal"
                            data-name="${name}" data-trainee-id="${traineeId}" data-course="${course}" 
                            data-graduated="${graduatedFormatted}" data-email="${email}" 
                            data-certification="${certification}" data-image="${imageUrl}">
                            <i class="bx bx-show"></i> View
                        </button>
                    </div>
                </div>
            </div>
        `;

        grid.appendChild(newCard);

        // Add event listener for view button
        const viewBtn = newCard.querySelector('.view-graduate-btn');
        if (viewBtn) {
            viewBtn.addEventListener('click', function () {
                document.getElementById('modalGraduateName').value = name;
                document.getElementById('modalGraduateId').value = traineeId;
                document.getElementById('modalGraduateCourse').value = course;
                document.getElementById('modalGraduateDate').value = graduatedFormatted;
                document.getElementById('modalGraduateEmail').value = email;
                document.getElementById('modalGraduateImage').src = imageUrl;

                // Update badge
                const badge = document.getElementById('modalGraduateBadge');
                if (badge) {
                    badge.textContent = certification;
                }
            });
        }
    });
}

function applyFilters() {
    const searchTerm = document.getElementById('graduateSearchInput').value.toLowerCase();
    const courseFilter = document.getElementById('graduateCourseFilter').value.toLowerCase();
    const certificationFilter = document.getElementById('graduateCertificationFilter').value.toLowerCase();
    const dateFilter = document.getElementById('graduationDateFilterMain').value;

    filteredGraduates = allGraduates.filter(graduate => {
        const matchesSearch = !searchTerm ||
            (graduate.name && graduate.name.toLowerCase().includes(searchTerm)) ||
            (graduate.graduate_id && graduate.graduate_id.toLowerCase().includes(searchTerm)) ||
            (graduate.trainee_id && graduate.trainee_id.toLowerCase().includes(searchTerm));

        const matchesCourse = !courseFilter ||
            (graduate.course && graduate.course.toLowerCase().includes(courseFilter));

        const matchesCertification = !certificationFilter ||
            (graduate.certification && graduate.certification.toLowerCase().includes(certificationFilter));

        let matchesDate = true;
        if (dateFilter && graduate.graduation_date) {
            const gradDate = new Date(graduate.graduation_date).toISOString().split('T')[0];
            matchesDate = gradDate === dateFilter;
        } else if (dateFilter && !graduate.graduation_date) {
            matchesDate = false;
        }

        return matchesSearch && matchesCourse && matchesCertification && matchesDate;
    });

    updateStatistics();
    renderGraduatesGrid();
}

function resetFilters() {
    document.getElementById('graduateSearchInput').value = '';
    document.getElementById('graduateCourseFilter').value = '';
    document.getElementById('graduateCertificationFilter').value = '';
    document.getElementById('graduationDateFilterMain').value = '';
    filteredGraduates = [...allGraduates];
    updateStatistics();
    renderGraduatesGrid();
}

async function populateCourseFilter() {
    const courseFilter = document.getElementById('graduateCourseFilter');
    if (!courseFilter) return;

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
            // Fallback to unique courses from graduates data
            const uniqueCourses = [...new Set(allGraduates.map(grad => grad.course).filter(c => c))];
            uniqueCourses.forEach(course => {
                const option = document.createElement('option');
                option.value = course.toLowerCase();
                option.textContent = course;
                courseFilter.appendChild(option);
            });
        }
    } catch (error) {
        console.error('Error fetching courses:', error);
        // Fallback to unique courses from graduates data
        const uniqueCourses = [...new Set(allGraduates.map(grad => grad.course).filter(c => c))];
        uniqueCourses.forEach(course => {
            const option = document.createElement('option');
            option.value = course.toLowerCase();
            option.textContent = course;
            courseFilter.appendChild(option);
        });
    }
}

function populateYearFilter() {
    // This function is no longer needed since we're using a date picker instead
    // But keeping it for compatibility
}

function viewGraduateDetails(graduateId) {
    const graduate = filteredGraduates.find(g => (g._id || g.id) === graduateId);
    if (graduate) {
        const graduationDate = graduate.graduation_date ? new Date(graduate.graduation_date).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : 'N/A';
        alert(`Graduate Details:\n\nName: ${graduate.name || 'Unknown'}\nID: ${graduate.graduate_id || graduate.trainee_id || 'N/A'}\nCourse: ${graduate.course || 'N/A'}\nGraduated: ${graduationDate}\nEmail: ${graduate.email || 'N/A'}\nCertification: ${graduate.certification || 'N/A'}`);
    }
}

function showError(message) {
    const grid = document.getElementById('graduatesGrid');
    grid.innerHTML = `
        <div class="col-12" style="display: flex; justify-content: center; align-items: center;">
            <div style="text-align: center;">
                <i class="bx bx-error-circle" style="font-size: 4rem; color: #ef4444; display: block; margin: 0 auto 15px;"></i>
                <h5 style="margin-bottom: 10px; color: #ef4444;">Error Loading Data</h5>
                <p style="margin: 5px 0 0 0; font-size: 0.9rem; color: #ef4444;">${message}</p>
            </div>
        </div>
    `;
}

document.addEventListener('DOMContentLoaded', function () {
    // Set current year in footer
    const currentYearSpan = document.getElementById('currentYear');
    if (currentYearSpan) {
        currentYearSpan.textContent = new Date().getFullYear();
    }

    fetchGraduatesData();

    // Add event listeners with null checks
    const searchInput = document.getElementById('graduateSearchInput');
    const courseFilter = document.getElementById('graduateCourseFilter');
    const certificationFilter = document.getElementById('graduateCertificationFilter');
    const dateFilter = document.getElementById('graduationDateFilterMain');
    const resetBtn = document.getElementById('graduateResetBtn');

    if (searchInput) searchInput.addEventListener('input', applyFilters);
    if (courseFilter) courseFilter.addEventListener('change', applyFilters);
    if (certificationFilter) certificationFilter.addEventListener('change', applyFilters);
    if (dateFilter) dateFilter.addEventListener('change', applyFilters);
    if (resetBtn) resetBtn.addEventListener('click', resetFilters);
});
