/* Competencies Page Functionality */

// API Configuration
const API_BASE_URL = (typeof config !== 'undefined' && config.api)
    ? config.api.baseUrl
    : (window.location.hostname === 'localhost'
        ? 'http://localhost/CAATE-ITRMS/backend/public'
        : '/backend/public');

let coursesData = [];

document.addEventListener('DOMContentLoaded', function () {
    loadCourses();
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

        // Fetch competencies (one document per course)
        const response = await fetch(`${API_BASE_URL}/api/v1/competencies`);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();

        if (result.success && result.data && result.data.length > 0) {
            coursesData = result.data;
            renderCourses(coursesData);

            // Hide loading, show courses
            if (loadingSpinner) loadingSpinner.classList.add('d-none');
            if (coursesGrid) coursesGrid.classList.remove('d-none');
        } else {
            // No courses found
            if (loadingSpinner) loadingSpinner.classList.add('d-none');
            if (emptyState) emptyState.classList.remove('d-none');
        }
    } catch (error) {
        console.error('Error loading competencies:', error);

        // Show error
        if (loadingSpinner) loadingSpinner.classList.add('d-none');
        if (errorState) errorState.classList.remove('d-none');
        const errorMessage = document.getElementById('errorMessage');
        if (errorMessage) {
            errorMessage.textContent = `Failed to load competencies: ${error.message}`;
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
    const col = document.createElement('div');
    col.className = 'col';

    // Determine badge color
    let badgeClass = 'bg-primary';
    const badgeText = course.badge || course.course_code || '';

    if (badgeText.includes('Level III') || badgeText.includes('L3')) {
        badgeClass = 'bg-info';
    } else if (badgeText.includes('Specialized') || badgeText.includes('SPEC')) {
        badgeClass = 'bg-warning';
    } else if (badgeText.includes('Level I') || badgeText.includes('L1')) {
        badgeClass = 'bg-secondary';
    }

    // Parse competencies
    const basicComp = course.basic_competencies || [];
    const commonComp = course.common_competencies || [];
    const coreComp = course.core_competencies || [];

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
                </div>
            </div>
        </div>
    `;

    return col;
}
