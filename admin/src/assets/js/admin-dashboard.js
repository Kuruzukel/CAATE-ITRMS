/* Admin Dashboard specific JavaScript */

// API Base URL
const API_BASE_URL = window.location.origin.includes('localhost')
    ? 'http://localhost/CAATE-ITRMS/backend/public'
    : '/CAATE-ITRMS/backend/public';

// Function to fetch dashboard statistics
async function fetchDashboardStatistics() {
    try {
        const response = await fetch(`${API_BASE_URL}/api/v1/trainees/statistics`);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const text = await response.text();
        const result = JSON.parse(text);

        if (result.success) {
            updateDashboardUI(result.data);
        }
    } catch (error) {
        // Silently fail
    }
}

// Function to show error message
function showErrorMessage(message) {
    // You can implement a toast notification here
}

// Function to update dashboard UI with real data
function updateDashboardUI(data) {
    // Update total trainees count in welcome card
    const totalTraineesElement = document.querySelector('.col-sm-5 h2.mb-2');
    if (totalTraineesElement) {
        totalTraineesElement.textContent = data.total.toLocaleString();
    }

    // Calculate percentage for the chart
    const totalEnrollments = data.approvedEnrollments + data.pendingEnrollments;
    const enrolledPercentage = totalEnrollments > 0
        ? Math.round((data.approvedEnrollments / totalEnrollments) * 100)
        : 0;
    const pendingPercentage = totalEnrollments > 0
        ? Math.round((data.pendingEnrollments / totalEnrollments) * 100)
        : 0;

    // Update the welcome card chart
    updateWelcomeChart(enrolledPercentage, pendingPercentage, Math.abs(data.todayPercentageIncrease));

    // Update percentage in welcome card text
    const percentageTextElement = document.querySelector('.col-sm-7 .fw-bold');
    if (percentageTextElement && data.todayPercentageIncrease !== undefined) {
        percentageTextElement.textContent = Math.abs(data.todayPercentageIncrease) + '%';
    }

    // Update today's enrollments card
    const todayEnrollmentsCard = document.querySelector('.profit-card-gradient');
    if (todayEnrollmentsCard) {
        const todayCountElement = todayEnrollmentsCard.querySelector('h3.card-title');
        const todayPercentageElement = todayEnrollmentsCard.querySelector('small.fw-semibold');

        if (todayCountElement) {
            todayCountElement.textContent = data.todayEnrollments || 0;
        }

        if (todayPercentageElement && data.todayPercentageIncrease !== undefined) {
            const isPositive = data.todayPercentageIncrease >= 0;
            const icon = isPositive ? 'bx-up-arrow-alt' : 'bx-down-arrow-alt';
            const colorClass = isPositive ? 'text-success' : 'text-danger';

            todayPercentageElement.className = `fw-semibold ${colorClass}`;
            todayPercentageElement.innerHTML = `<i class="bx ${icon}"></i> ${isPositive ? '+' : ''}${data.todayPercentageIncrease}%`;
        }
    }

    // Update this month's enrollments card
    const monthEnrollmentsCards = document.querySelectorAll('.col-lg-6.col-md-12.col-6.mb-4 .card');
    if (monthEnrollmentsCards.length > 1) {
        const monthCard = monthEnrollmentsCards[1];
        const monthCountElement = monthCard.querySelector('h3.card-title');
        const monthPercentageElement = monthCard.querySelector('small.fw-semibold');

        if (monthCountElement) {
            monthCountElement.textContent = data.monthEnrollments.toLocaleString();
        }

        if (monthPercentageElement && data.monthPercentageIncrease !== undefined) {
            const isPositive = data.monthPercentageIncrease >= 0;
            const icon = isPositive ? 'bx-up-arrow-alt' : 'bx-down-arrow-alt';
            const colorClass = isPositive ? 'text-success' : 'text-danger';

            monthPercentageElement.className = `fw-semibold ${colorClass}`;
            monthPercentageElement.innerHTML = `<i class="bx ${icon}"></i> ${isPositive ? '+' : ''}${data.monthPercentageIncrease}%`;
        }
    }

    // Update pending enrollments card
    const pendingCard = document.querySelector('.bx-time-five');
    if (pendingCard) {
        const pendingCountElement = pendingCard.closest('.card-body').querySelector('h3.card-title');
        if (pendingCountElement) {
            pendingCountElement.textContent = data.pendingEnrollments || 0;
        }
    }

    // Update approved enrollments card
    const approvedCard = document.querySelector('.bx-check-circle');
    if (approvedCard) {
        const approvedCountElement = approvedCard.closest('.card-body').querySelector('h3.card-title');
        if (approvedCountElement) {
            approvedCountElement.textContent = data.approvedEnrollments.toLocaleString();
        }
    }

    // Update enrollment activity trend card
    const activityTrendCard = document.querySelector('.badge.bg-label-warning');
    if (activityTrendCard) {
        const activityCountElement = activityTrendCard.closest('.card-body').querySelector('h3.mb-0');
        if (activityCountElement) {
            activityCountElement.textContent = data.monthEnrollments.toLocaleString();
        }
    }
}

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
    // Fetch and display real dashboard statistics
    fetchDashboardStatistics();

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

    // Refresh statistics every 30 seconds
    setInterval(fetchDashboardStatistics, 30000);
});


// Function to update the welcome statistics chart with real data
function updateWelcomeChart(enrolledPercentage, pendingPercentage, todayPercentage) {
    // Check if ApexCharts is available and chart exists
    if (typeof ApexCharts === 'undefined') {
        return;
    }

    const chartElement = document.querySelector('#welcomeStatisticsChart');
    if (!chartElement) {
        return;
    }

    // Try to update existing chart or create new one
    try {
        // Get the chart instance if it exists
        const chartInstance = ApexCharts.getChartByID('welcomeStatisticsChart');

        if (chartInstance) {
            // Update existing chart
            chartInstance.updateOptions({
                series: [enrolledPercentage, pendingPercentage, 100 - enrolledPercentage - pendingPercentage],
                plotOptions: {
                    pie: {
                        donut: {
                            labels: {
                                total: {
                                    formatter: function (w) {
                                        return todayPercentage + '%';
                                    }
                                }
                            }
                        }
                    }
                }
            });
        }
    } catch (error) {
        // Silently fail
    }
}


// Function to update the welcome chart with real data
function updateWelcomeChart(enrolledPercentage, pendingPercentage, completedPercentage) {
    // Check if ApexCharts is available
    if (typeof ApexCharts === 'undefined') {
        setTimeout(() => updateWelcomeChart(enrolledPercentage, pendingPercentage, completedPercentage), 500);
        return;
    }

    const chartElement = document.querySelector('#welcomeStatisticsChart');
    if (!chartElement) return;

    // Store the chart instance globally so we can update it
    if (!window.welcomeChartInstance) {
        // Store the data for when the chart is initialized
        window.welcomeChartData = {
            enrolled: enrolledPercentage,
            pending: pendingPercentage,
            completed: completedPercentage
        };
        return;
    }

    // Update the chart data
    window.welcomeChartInstance.updateOptions({
        series: [enrolledPercentage, pendingPercentage, completedPercentage],
        plotOptions: {
            pie: {
                donut: {
                    labels: {
                        total: {
                            formatter: function (w) {
                                return enrolledPercentage + '%';
                            }
                        }
                    }
                }
            }
        }
    });
}
