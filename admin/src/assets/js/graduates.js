// Graduates Page JavaScript

let currentPage = 1;
const cardsPerPage = 8;

/**
 * Display graduates for a specific page
 * @param {number} page - Page number to display
 */
function showPage(page) {
    currentPage = page;
    const allCards = document.querySelectorAll('.graduate-card');

    // Hide all cards first
    allCards.forEach(card => {
        card.style.display = 'none';
    });

    // Show cards for current page
    const startIndex = (page - 1) * cardsPerPage;
    const endIndex = startIndex + cardsPerPage;

    for (let i = startIndex; i < endIndex && i < allCards.length; i++) {
        allCards[i].style.display = 'block';
    }

    // Update pagination buttons
    updatePaginationButtons();

    // Update showing text
    const totalCards = allCards.length;
    const showingStart = startIndex + 1;
    const showingEnd = Math.min(endIndex, totalCards);
    const showingText = document.querySelector('.showing-text');
    if (showingText) {
        showingText.textContent = `Showing ${showingStart} to ${showingEnd} of ${totalCards} graduates`;
    }
}

/**
 * Update pagination button states
 */
function updatePaginationButtons() {
    const allCards = document.querySelectorAll('.graduate-card');
    const totalPages = Math.ceil(allCards.length / cardsPerPage);

    // Update active state for page numbers
    document.querySelectorAll('.page-num').forEach(pageLink => {
        const pageNum = parseInt(pageLink.getAttribute('data-page'));
        const parentLi = pageLink.parentElement;

        if (parentLi) {
            if (pageNum === currentPage) {
                parentLi.classList.add('active');
                pageLink.style.setProperty('background-color', 'var(--primary-blue)', 'important');
                pageLink.style.setProperty('border-color', 'var(--primary-blue)', 'important');
                pageLink.style.setProperty('color', '#ffffff', 'important');
            } else {
                parentLi.classList.remove('active');
                pageLink.style.setProperty('background-color', '#243447', 'important');
                pageLink.style.setProperty('border-color', '#3d4f63', 'important');
                pageLink.style.setProperty('color', '#b8c5d6', 'important');
            }
        }
    });

    // Enable/disable prev/next buttons
    const prevBtn = document.querySelector('.pagination .page-item:first-child');
    const nextBtn = document.querySelector('.pagination .page-item:last-child');

    if (prevBtn) {
        if (currentPage === 1) {
            prevBtn.classList.add('disabled');
        } else {
            prevBtn.classList.remove('disabled');
        }
    }

    if (nextBtn) {
        if (currentPage === totalPages) {
            nextBtn.classList.add('disabled');
        } else {
            nextBtn.classList.remove('disabled');
        }
    }
}

/**
 * Apply hover effects to pagination buttons
 */
function applyPaginationHoverEffects() {
    document.querySelectorAll('.pagination .page-item:not(.disabled):not(.active) .page-link').forEach(link => {
        link.addEventListener('mouseenter', function () {
            if (!this.parentElement.classList.contains('active') && !this.parentElement.classList.contains('disabled')) {
                this.style.setProperty('background-color', '#2d3e52', 'important');
                this.style.setProperty('border-color', '#4a5f78', 'important');
                this.style.setProperty('color', '#ffffff', 'important');
                this.style.transform = 'translateY(-2px)';
                this.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.3)';
            }
        });

        link.addEventListener('mouseleave', function () {
            if (!this.parentElement.classList.contains('active')) {
                this.style.setProperty('background-color', '#243447', 'important');
                this.style.setProperty('border-color', '#3d4f63', 'important');
                this.style.setProperty('color', '#b8c5d6', 'important');
                this.style.transform = 'translateY(0)';
                this.style.boxShadow = 'none';
            }
        });
    });

    // Add hover effect to active page button
    document.querySelectorAll('.pagination .page-item.active .page-link').forEach(link => {
        link.addEventListener('mouseenter', function () {
            this.style.opacity = '0.85';
            this.style.boxShadow = '0 4px 12px rgba(66, 133, 244, 0.5)';
        });

        link.addEventListener('mouseleave', function () {
            this.style.opacity = '1';
            this.style.boxShadow = 'none';
        });
    });
}

/**
 * Setup pagination button click handlers
 */
function setupPaginationHandlers() {
    // Previous button
    const prevBtn = document.querySelector('.pagination .page-item:first-child .page-link');
    if (prevBtn) {
        prevBtn.addEventListener('click', function (e) {
            e.preventDefault();
            if (currentPage > 1) {
                showPage(currentPage - 1);
            }
        });
    }

    // Next button
    const nextBtn = document.querySelector('.pagination .page-item:last-child .page-link');
    if (nextBtn) {
        nextBtn.addEventListener('click', function (e) {
            e.preventDefault();
            const allCards = document.querySelectorAll('.graduate-card');
            const totalPages = Math.ceil(allCards.length / cardsPerPage);
            if (currentPage < totalPages) {
                showPage(currentPage + 1);
            }
        });
    }

    // Number buttons
    document.querySelectorAll('.page-num').forEach((btn) => {
        btn.addEventListener('click', function (e) {
            e.preventDefault();
            const pageNum = parseInt(this.getAttribute('data-page'));
            showPage(pageNum);
        });
    });
}

/**
 * Setup view graduate modal functionality
 */
function setupViewGraduateModal() {
    document.querySelectorAll('.view-graduate-btn').forEach(button => {
        button.addEventListener('click', function () {
            const name = this.getAttribute('data-name');
            const id = this.getAttribute('data-id');
            const course = this.getAttribute('data-course');
            const graduated = this.getAttribute('data-graduated');
            const email = this.getAttribute('data-email');
            const image = this.getAttribute('data-image');

            document.getElementById('modalGraduateName').value = name;
            document.getElementById('modalGraduateId').value = id;
            document.getElementById('modalGraduateCourse').value = course;
            document.getElementById('modalGraduateDate').value = graduated;
            document.getElementById('modalGraduateEmail').value = email;
            document.getElementById('modalGraduateImage').src = image;
        });
    });
}

/**
 * Setup edit graduate modal functionality
 */
function setupEditGraduateModal() {
    document.querySelectorAll('.edit-graduate-btn').forEach(button => {
        button.addEventListener('click', function () {
            const name = this.getAttribute('data-name');
            const id = this.getAttribute('data-id');
            const course = this.getAttribute('data-course');
            const graduated = this.getAttribute('data-graduated');
            const email = this.getAttribute('data-email');
            const image = this.getAttribute('data-image');

            document.getElementById('editGraduateName').value = name;
            document.getElementById('editGraduateId').value = id;
            document.getElementById('editGraduateCourse').value = course;
            document.getElementById('editGraduateDate').value = graduated;
            document.getElementById('editGraduateEmail').value = email;
            document.getElementById('editGraduateImage').src = image;
        });
    });

    // Save changes button
    const saveBtn = document.getElementById('saveGraduateBtn');
    if (saveBtn) {
        saveBtn.addEventListener('click', function () {
            const form = document.getElementById('editGraduateForm');
            if (form.checkValidity() === false) {
                event.preventDefault();
                event.stopPropagation();
                form.classList.add('was-validated');
            } else {
                // Handle save logic here
                console.log('Graduate data saved');
                // Close modal
                const modal = bootstrap.Modal.getInstance(document.getElementById('editGraduateModal'));
                if (modal) {
                    modal.hide();
                }
            }
        });
    }
}

/**
 * Setup export modal functionality
 */
function setupExportModal() {
    const confirmExportBtn = document.getElementById('confirmExportBtn');
    if (confirmExportBtn) {
        confirmExportBtn.addEventListener('click', function () {
            const selectedCourses = Array.from(document.querySelectorAll('.export-course-filter:checked'))
                .map(checkbox => checkbox.value);
            const selectedYears = Array.from(document.querySelectorAll('.export-year-filter:checked'))
                .map(checkbox => checkbox.value);

            // Handle export logic here
            console.log('Exporting with courses:', selectedCourses);
            console.log('Exporting with years:', selectedYears);

            // Close modal
            const modal = bootstrap.Modal.getInstance(document.getElementById('exportModal'));
            if (modal) {
                modal.hide();
            }
        });
    }
}

/**
 * Setup search and filter functionality
 */
function setupSearchAndFilter() {
    const searchInput = document.querySelector('input[placeholder="Name, ID, Email"]');
    const courseFilter = document.querySelector('select');
    const yearFilter = document.querySelectorAll('select')[1];
    const resetBtn = document.querySelector('button[style*="reset"]');

    if (searchInput) {
        searchInput.addEventListener('input', function () {
            filterGraduates();
        });
    }

    if (courseFilter) {
        courseFilter.addEventListener('change', function () {
            filterGraduates();
        });
    }

    if (yearFilter) {
        yearFilter.addEventListener('change', function () {
            filterGraduates();
        });
    }

    if (resetBtn) {
        resetBtn.addEventListener('click', function () {
            if (searchInput) searchInput.value = '';
            if (courseFilter) courseFilter.value = '';
            if (yearFilter) yearFilter.value = '';
            filterGraduates();
        });
    }
}

/**
 * Filter graduates based on search and filter criteria
 */
function filterGraduates() {
    const searchInput = document.querySelector('input[placeholder="Name, ID, Email"]');
    const courseFilter = document.querySelector('select');
    const yearFilter = document.querySelectorAll('select')[1];

    const searchTerm = searchInput ? searchInput.value.toLowerCase() : '';
    const selectedCourse = courseFilter ? courseFilter.value : '';
    const selectedYear = yearFilter ? yearFilter.value : '';

    const allCards = document.querySelectorAll('.graduate-card');
    let visibleCount = 0;

    allCards.forEach(card => {
        const name = card.querySelector('.card-title')?.textContent.toLowerCase() || '';
        const id = card.querySelector('.text-muted')?.textContent.toLowerCase() || '';
        const email = card.querySelector('.bx-envelope')?.parentElement?.textContent.toLowerCase() || '';
        const course = card.querySelector('.bx-book-open')?.parentElement?.textContent.toLowerCase() || '';
        const graduated = card.querySelector('.bx-calendar')?.parentElement?.textContent.toLowerCase() || '';

        const matchesSearch = !searchTerm || name.includes(searchTerm) || id.includes(searchTerm) || email.includes(searchTerm);
        const matchesCourse = !selectedCourse || course.includes(selectedCourse.toLowerCase());
        const matchesYear = !selectedYear || graduated.includes(selectedYear);

        if (matchesSearch && matchesCourse && matchesYear) {
            card.style.display = 'block';
            visibleCount++;
        } else {
            card.style.display = 'none';
        }
    });

    // Reset pagination to page 1
    currentPage = 1;
    showPage(1);
}

/**
 * Initialize all event listeners and functionality
 */
document.addEventListener('DOMContentLoaded', function () {
    // Add graduate-card class to all graduate cards
    const graduateCards = document.querySelectorAll('.row-cols-1.row-cols-md-2.row-cols-lg-3.row-cols-xl-4 > .col');
    graduateCards.forEach((card, index) => {
        if (!card.classList.contains('graduate-card')) {
            card.classList.add('graduate-card');
        }
    });

    // Initialize pagination
    showPage(1);

    // Setup all handlers
    applyPaginationHoverEffects();
    setupPaginationHandlers();
    setupViewGraduateModal();
    setupEditGraduateModal();
    setupExportModal();
    setupSearchAndFilter();

    // Set current year in footer if exists
    const currentYearElement = document.getElementById('currentYear');
    if (currentYearElement) {
        currentYearElement.textContent = new Date().getFullYear();
    }
});

// Export functions for external use
window.graduatesModule = {
    showPage,
    updatePaginationButtons,
    filterGraduates
};
