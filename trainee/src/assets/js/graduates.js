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
        // Fetch trainees data from API (graduates are trainees with graduation_date)
        const response = await fetch(`${config.api.baseUrl}/api/v1/trainees`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error('Failed to fetch graduates');
        }

        const result = await response.json();
        // Filter only trainees who have graduated (have graduation_date)
        const allTrainees = result.data || [];
        allGraduates = allTrainees.filter(trainee => trainee.graduation_date);
        filteredGraduates = [...allGraduates];

        await populateCourseFilter();
        populateYearFilter();
        updateStatistics();
        renderGraduatesGrid();

    } catch (error) {
        console.error('Error fetching graduates:', error);
        showError('Failed to load graduates data. Please refresh the page.');
    }
}

function updateStatistics() {
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth();

    // Total Graduates
    document.getElementById('totalGraduates').textContent = filteredGraduates.length;

    // This Year
    const thisYearCount = filteredGraduates.filter(grad => {
        const gradYear = new Date(grad.graduation_date).getFullYear();
        return gradYear === currentYear;
    }).length;
    document.getElementById('thisYear').textContent = thisYearCount;

    // This Month
    const thisMonthCount = filteredGraduates.filter(grad => {
        const gradDate = new Date(grad.graduation_date);
        return gradDate.getFullYear() === currentYear && gradDate.getMonth() === currentMonth;
    }).length;
    document.getElementById('thisMonth').textContent = thisMonthCount;

    // Certified NC II
    const certifiedCount = filteredGraduates.filter(grad =>
        grad.certification && grad.certification.includes('NC II')
    ).length;
    document.getElementById('certifiedNC2').textContent = certifiedCount;
}

function renderGraduatesGrid() {
    const grid = document.getElementById('graduatesGrid');
    grid.innerHTML = '';

    if (filteredGraduates.length === 0) {
        const searchTerm = document.getElementById('searchGraduateInput').value;
        const courseFilter = document.getElementById('courseFilter').value;
        const hasActiveFilters = searchTerm || courseFilter;

        if (hasActiveFilters) {
            grid.innerHTML = `
                <div class="col-12" style="display: flex; justify-content: center; align-items: center; width: 100%;">
                    <div class="d-flex flex-column align-items-center justify-content-center text-center" style="padding: 60px 20px; width: 100%;">
                        <i class="bx bx-search" style="font-size: 3rem; color: #6c757d;"></i>
                        <p class="mt-3 text-muted" style="color: white !important; margin: 0 auto;">No graduates found matching your filters</p>
                    </div>
                </div>
            `;
        } else {
            grid.innerHTML = `
                <div class="col-12" style="display: flex; justify-content: center; align-items: center; width: 100%;">
                    <div class="d-flex flex-column align-items-center justify-content-center text-center" style="padding: 110px 20px; width: 100%;">
                        <i class="bx bx-info-circle" style="font-size: 3rem; color: #6c757d;"></i>
                        <p class="mt-3 text-muted" style="color: white !important; margin: 0 auto;">No graduates data available</p>
                    </div>
                </div>
            `;
        }
        return;
    }

    filteredGraduates.forEach(graduate => {
        const col = document.createElement('div');
        col.className = 'col';

        const initials = getInitials(graduate.name || 'Unknown');
        const profileImage = graduate.profile_image || graduate.image;
        const graduationDate = graduate.graduation_date ? new Date(graduate.graduation_date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : 'N/A';

        let imageHtml;
        if (profileImage) {
            imageHtml = `<img src="${profileImage}" class="card-img-top" alt="${graduate.name}" style="height: 200px; object-fit: cover;" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
                <div class="card-img-top d-none align-items-center justify-content-center" style="height: 200px; background: linear-gradient(135deg, rgba(54, 145, 191, 0.2) 0%, rgba(50, 85, 150, 0.2) 100%); font-size: 3rem; color: #696cff; font-weight: 600;">
                    ${initials}
                </div>`;
        } else {
            imageHtml = `<div class="card-img-top d-flex align-items-center justify-content-center" style="height: 200px; background: linear-gradient(135deg, rgba(54, 145, 191, 0.2) 0%, rgba(50, 85, 150, 0.2) 100%); font-size: 3rem; color: #696cff; font-weight: 600;">
                ${initials}
            </div>`;
        }

        col.innerHTML = `
            <div class="card h-100">
                ${imageHtml}
                <div class="card-body">
                    <span class="badge mb-2" style="background-color: #5bc0de; color: #ffffff;">${graduate.certification || 'NC II'}</span>
                    <h5 class="card-title mb-2">${graduate.name || 'Unknown'}</h5>
                    <p class="text-muted small mb-2">ID: ${graduate.graduate_id || graduate.trainee_id || 'N/A'}</p>
                    <p class="card-text small mb-2">
                        <i class="bx bx-book-open me-1"></i>${graduate.course || 'N/A'}
                    </p>
                    <p class="card-text small mb-2">
                        <i class="bx bx-calendar me-1"></i>Graduated: ${graduationDate}
                    </p>
                    <p class="card-text small mb-3">
                        <i class="bx bx-envelope me-1"></i>${graduate.email || 'N/A'}
                    </p>
                    <div class="d-flex gap-2">
                        <button class="btn btn-sm btn-outline-primary flex-fill" onclick="viewGraduateDetails('${graduate._id || graduate.id}')">
                            <i class="bx bx-show"></i> View
                        </button>
                    </div>
                </div>
            </div>
        `;
        grid.appendChild(col);
    });
}

function applyFilters() {
    const searchTerm = document.getElementById('searchGraduateInput').value.toLowerCase();
    const courseFilter = document.getElementById('courseFilter').value.toLowerCase();

    filteredGraduates = allGraduates.filter(graduate => {
        const matchesSearch = !searchTerm ||
            (graduate.name && graduate.name.toLowerCase().includes(searchTerm)) ||
            (graduate.graduate_id && graduate.graduate_id.toLowerCase().includes(searchTerm)) ||
            (graduate.trainee_id && graduate.trainee_id.toLowerCase().includes(searchTerm));

        const matchesCourse = !courseFilter ||
            (graduate.course && graduate.course.toLowerCase().includes(courseFilter));

        let matchesMonth = true;
        let matchesYear = true;

        if (graduate.graduation_date) {
            const gradDate = new Date(graduate.graduation_date);
            const monthFilter = document.getElementById('monthFilter').value;
            const yearFilter = document.getElementById('yearFilter').value;

            if (monthFilter !== '') {
                matchesMonth = gradDate.getMonth() === parseInt(monthFilter);
            }

            if (yearFilter !== '') {
                matchesYear = gradDate.getFullYear() === parseInt(yearFilter);
            }
        } else {
            const monthFilter = document.getElementById('monthFilter').value;
            const yearFilter = document.getElementById('yearFilter').value;
            // If no graduation date, exclude from month/year filters
            if (monthFilter !== '' || yearFilter !== '') {
                matchesMonth = false;
                matchesYear = false;
            }
        }

        return matchesSearch && matchesCourse && matchesMonth && matchesYear;
    });

    updateStatistics();
    renderGraduatesGrid();
}

function resetFilters() {
    document.getElementById('searchGraduateInput').value = '';
    document.getElementById('courseFilter').value = '';
    document.getElementById('monthFilter').value = '';
    document.getElementById('yearFilter').value = '';
    filteredGraduates = [...allGraduates];
    updateStatistics();
    renderGraduatesGrid();
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
    const yearFilter = document.getElementById('yearFilter');
    const years = allGraduates
        .map(grad => grad.graduation_date ? new Date(grad.graduation_date).getFullYear() : null)
        .filter(year => year !== null);

    const uniqueYears = [...new Set(years)].sort((a, b) => b - a); // Sort descending

    uniqueYears.forEach(year => {
        const option = document.createElement('option');
        option.value = year;
        option.textContent = year;
        yearFilter.appendChild(option);
    });
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
    fetchGraduatesData();

    document.getElementById('searchGraduateInput').addEventListener('input', applyFilters);
    document.getElementById('courseFilter').addEventListener('change', applyFilters);
    document.getElementById('monthFilter').addEventListener('change', applyFilters);
    document.getElementById('yearFilter').addEventListener('change', applyFilters);
    document.getElementById('resetFilters').addEventListener('click', resetFilters);
});
