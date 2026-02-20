/* Competencies Page Functionality */

// API Configuration
const API_BASE_URL = (typeof config !== 'undefined' && config.api)
    ? config.api.baseUrl
    : (window.location.hostname === 'localhost'
        ? 'http://localhost/CAATE-ITRMS/backend/public'
        : '/backend/public');

let coursesData = [];
let currentCourseCard = null;

document.addEventListener('DOMContentLoaded', function () {
    loadCourses();

    // Set current year in footer
    const yearSpan = document.getElementById('currentYear');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }
});

// Load courses from API
async function loadCourses() {
    const loadingSpinner = document.getElementById('loadingSpinner');
    const errorState = document.getElementById('errorState');
    const emptyState = document.getElementById('emptyState');
    const coursesGrid = document.getElementById('coursesGrid');

    try {
        // Show loading
        if (loadingSpinner) loadingSpinner.classList.remove('d-none');
        if (errorState) errorState.classList.add('d-none');
        if (emptyState) emptyState.classList.add('d-none');
        if (coursesGrid) coursesGrid.classList.add('d-none');

        // Fetch courses
        const response = await fetch(`${API_BASE_URL}/api/v1/courses`);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        console.log('API Response:', result);
        console.log('Courses data:', result.data);

        if (result.success && result.data && result.data.length > 0) {
            coursesData = result.data;
            console.log('First course:', coursesData[0]);
            renderCourses(coursesData);

            // Hide loading, show courses
            if (loadingSpinner) loadingSpinner.classList.add('d-none');
            if (coursesGrid) coursesGrid.classList.remove('d-none');

            // Initialize edit buttons
            initializeEditButtons();
        } else {
            // No courses found
            if (loadingSpinner) loadingSpinner.classList.add('d-none');
            if (emptyState) emptyState.classList.remove('d-none');
        }
    } catch (error) {
        console.error('Error loading courses:', error);

        // Show error
        if (loadingSpinner) loadingSpinner.classList.add('d-none');
        if (errorState) errorState.classList.remove('d-none');
        const errorMessage = document.getElementById('errorMessage');
        if (errorMessage) {
            errorMessage.textContent = `Failed to load courses: ${error.message}`;
        }
    }
}

// Render courses to grid
function renderCourses(courses) {
    const coursesGrid = document.getElementById('coursesGrid');
    if (!coursesGrid) return;

    coursesGrid.innerHTML = '';

    courses.forEach(course => {
        const courseCard = createCourseCard(course);
        coursesGrid.appendChild(courseCard);
    });
}

// Create course card
function createCourseCard(course) {
    console.log('Creating card for course:', course);
    const col = document.createElement('div');
    col.className = 'col';

    // Determine badge color
    let badgeClass = 'bg-primary';
    const badgeText = course.badge || course.course_code || '';
    console.log('Badge text:', badgeText);

    if (badgeText.includes('Level III')) {
        badgeClass = 'bg-info';
    } else if (badgeText.includes('Specialized')) {
        badgeClass = 'bg-warning';
    } else if (badgeText.includes('Level I')) {
        badgeClass = 'bg-secondary';
    }

    // Parse competencies
    const basicComp = course.basic_competencies || [];
    const commonComp = course.common_competencies || [];
    const coreComp = course.core_competencies || [];
    console.log('Competencies:', { basic: basicComp.length, common: commonComp.length, core: coreComp.length });

    col.innerHTML = `
        <div class="card h-100">
            <img src="${course.image || 'https://via.placeholder.com/400x250?text=Course+Image'}"
                class="card-img-top" alt="${course.title || 'Course'}"
                style="height: 200px; object-fit: cover;"
                onerror="this.src='https://via.placeholder.com/400x250?text=Course+Image'" />
            <div class="card-body d-flex flex-column">
                <span class="badge ${badgeClass} mb-2 align-self-start">${badgeText}</span>
                <h5 class="card-title">${course.title || 'Untitled Course'}</h5>
                <div class="card-text flex-grow-1">
                    ${basicComp.length > 0 ? `
                        <div class="mb-2">
                            <strong class="text-primary">Basic Competencies:</strong>
                            <ul class="small mb-2" style="padding-left: 1.25rem;">
                                ${basicComp.map(comp => `<li>${comp}</li>`).join('')}
                            </ul>
                        </div>
                    ` : ''}
                    ${commonComp.length > 0 ? `
                        <div class="mb-2">
                            <strong class="text-primary">Common Competencies:</strong>
                            <ul class="small mb-2" style="padding-left: 1.25rem;">
                                ${commonComp.map(comp => `<li>${comp}</li>`).join('')}
                            </ul>
                        </div>
                    ` : ''}
                    ${coreComp.length > 0 ? `
                        <div>
                            <strong class="text-primary">Core Competencies:</strong>
                            <ul class="small" style="padding-left: 1.25rem;">
                                ${coreComp.map(comp => `<li>${comp}</li>`).join('')}
                            </ul>
                        </div>
                    ` : ''}
                </div>
                <div class="d-flex justify-content-between align-items-center mt-3">
                    <small><i class="fas fa-clock me-1"></i> ${course.hours || course.duration || 'Duration TBA'}</small>
                    <button class="btn btn-sm btn-outline-primary edit-course-btn"
                        data-bs-toggle="modal"
                        data-bs-target="#editCourseModal"
                        data-course-id="${course._id?.$oid || ''}"
                        data-badge="${badgeText}"
                        data-title="${course.title || ''}"
                        data-hours="${course.hours || course.duration || ''}"
                        data-basic-competencies="${JSON.stringify(basicComp).replace(/"/g, '&quot;')}"
                        data-common-competencies="${JSON.stringify(commonComp).replace(/"/g, '&quot;')}"
                        data-core-competencies="${JSON.stringify(coreComp).replace(/"/g, '&quot;')}">
                        <i class="bx bx-edit"></i> Edit
                    </button>
                </div>
            </div>
        </div>
    `;

    return col;
}

// Initialize edit buttons
function initializeEditButtons() {
    document.querySelectorAll('.edit-course-btn').forEach(btn => {
        btn.addEventListener('click', function () {
            currentCourseCard = this.closest('.card');

            // Populate course info banner
            const badgeBannerEl = document.getElementById('editCourseBadgeBody');
            const titleBannerEl = document.getElementById('editCourseTitleBody');
            const durationBannerEl = document.getElementById('editCourseDurationBody');

            if (badgeBannerEl) badgeBannerEl.textContent = this.dataset.badge || '';
            if (titleBannerEl) titleBannerEl.textContent = this.dataset.title || '';
            if (durationBannerEl) {
                const durationSpan = durationBannerEl.querySelector('span');
                if (durationSpan) durationSpan.textContent = this.dataset.hours || '';
            }

            // Populate competency textareas
            const basicComp = document.getElementById('editBasicCompetencies');
            const commonComp = document.getElementById('editCommonCompetencies');
            const coreComp = document.getElementById('editCoreCompetencies');

            try {
                if (basicComp) {
                    const basicData = JSON.parse(this.dataset.basicCompetencies || '[]');
                    basicComp.value = Array.isArray(basicData) ? basicData.join('\n') : '';
                }
                if (commonComp) {
                    const commonData = JSON.parse(this.dataset.commonCompetencies || '[]');
                    commonComp.value = Array.isArray(commonData) ? commonData.join('\n') : '';
                }
                if (coreComp) {
                    const coreData = JSON.parse(this.dataset.coreCompetencies || '[]');
                    coreComp.value = Array.isArray(coreData) ? coreData.join('\n') : '';
                }
            } catch (e) {
                console.error('Error parsing competencies:', e);
            }
        });
    });

    // Save button handler
    const saveBtn = document.getElementById('saveCourseBtn');
    if (saveBtn) {
        saveBtn.replaceWith(saveBtn.cloneNode(true)); // Remove old listeners
        document.getElementById('saveCourseBtn').addEventListener('click', saveCompetencies);
    }
}

// Save competencies
async function saveCompetencies() {
    if (!currentCourseCard) return;

    const editBtn = currentCourseCard.querySelector('.edit-course-btn');
    const courseId = editBtn?.dataset.courseId;

    if (!courseId) {
        alert('Course ID not found');
        return;
    }

    // Get competency values
    const basicComp = document.getElementById('editBasicCompetencies');
    const commonComp = document.getElementById('editCommonCompetencies');
    const coreComp = document.getElementById('editCoreCompetencies');

    const competencies = {
        basic_competencies: basicComp ? basicComp.value.split('\n').filter(line => line.trim()) : [],
        common_competencies: commonComp ? commonComp.value.split('\n').filter(line => line.trim()) : [],
        core_competencies: coreComp ? coreComp.value.split('\n').filter(line => line.trim()) : []
    };

    try {
        const response = await fetch(`${API_BASE_URL}/api/v1/courses/${courseId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(competencies)
        });

        const result = await response.json();

        if (result.success) {
            alert('Competencies updated successfully!');

            // Close modal
            const modal = bootstrap.Modal.getInstance(document.getElementById('editCourseModal'));
            if (modal) modal.hide();

            // Reload courses
            loadCourses();
        } else {
            alert('Failed to update competencies: ' + (result.error || 'Unknown error'));
        }
    } catch (error) {
        console.error('Error saving competencies:', error);
        alert('Failed to save competencies: ' + error.message);
    }
}
