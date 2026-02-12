/* Admin Dashboard specific JavaScript */

// Function to ensure Present status badges have green background with white text
function stylePresentBadges() {
    // Find all badges containing "Present" text
    const badges = document.querySelectorAll('.badge');

    badges.forEach(badge => {
        if (badge.textContent.trim() === 'Present') {
            badge.style.backgroundColor = '#10b981';
            badge.style.color = '#ffffff';
            badge.classList.add('present-status');
        }
    });
}

// Function to style any element containing "Present Today" text
function stylePresentTodayElements() {
    const elements = document.querySelectorAll('*');

    elements.forEach(element => {
        if (element.textContent && element.textContent.includes('Present Today')) {
            element.style.color = '#28a745';
            element.style.fontWeight = 'bold';
        }
    });
}

// Function to ensure all success badges have proper green styling
function ensureSuccessBadgeStyling() {
    const successBadges = document.querySelectorAll('.badge.bg-success');

    successBadges.forEach(badge => {
        badge.style.backgroundColor = '#28a745';
        badge.style.color = '#ffffff';
    });
}

// Function to ensure all dashboard text is white
function makeTextWhite() {
    // Target all text elements in cards
    const textElements = document.querySelectorAll(`
        .card-body h1, .card-body h2, .card-body h3, .card-body h4, .card-body h5, .card-body h6,
        .card-body span, .card-body small, .card-body p, .card-body div,
        .card-title, .card-text, .card-header h5, .card-header small,
        .fw-semibold, .d-block, .text-nowrap, .me-2 h6, .me-2 small,
        .user-progress small, .text-muted, .text-dark
    `);

    textElements.forEach(element => {
        // Don't change badge colors or button colors
        if (!element.classList.contains('badge') &&
            !element.classList.contains('btn') &&
            !element.closest('.dropdown-menu')) {
            element.style.color = '#ffffff';
        }
    });

    // Specifically target course names and statistics
    const courseElements = document.querySelectorAll('li .me-2 h6, li .me-2 small');
    courseElements.forEach(element => {
        element.style.color = '#ffffff';
    });

    // Target all numbers and statistics
    const statsElements = document.querySelectorAll('.card-body h2, .card-body h3, .card-title');
    statsElements.forEach(element => {
        element.style.color = '#ffffff';
        element.style.fontWeight = 'bold';
    });
}

// Initialize styling when DOM is loaded
document.addEventListener('DOMContentLoaded', function () {
    stylePresentBadges();
    stylePresentTodayElements();
    ensureSuccessBadgeStyling();

    // Re-apply styling after any dynamic content updates
    const observer = new MutationObserver(function (mutations) {
        mutations.forEach(function (mutation) {
            if (mutation.type === 'childList') {
                stylePresentBadges();
                ensureSuccessBadgeStyling();
            }
        });
    });

    // Start observing
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
});