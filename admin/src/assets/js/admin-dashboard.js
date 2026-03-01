/* Admin Dashboard specific JavaScript */

// API Base URL
const API_BASE_URL = window.location.origin.includes('localhost')
    ? 'http://localhost/CAATE-ITRMS/backend/public'
    : '/CAATE-ITRMS/backend/public';

// Global variable to store selected year
let selectedYear = 2026;

// Function to update all year labels on the dashboard
function updateYearLabels(year) {
    // Update chart title
    const chartTitle = document.querySelector('.col-md-8 h5.card-header');
    if (chartTitle) {
        chartTitle.textContent = `Monthly Trainee Enrollment ${year}`;
    }

    // Update enrollment activity trend badge
    const activityBadge = document.getElementById('activityTrendYearBadge');
    if (activityBadge) {
        activityBadge.textContent = `Year ${year}`;
    }

    // Update year statistics labels (current year and previous year)
    const currentYearLabel = document.getElementById('currentYearLabel');
    const previousYearLabel = document.getElementById('previousYearLabel');

    if (currentYearLabel) {
        currentYearLabel.textContent = year;
    }

    if (previousYearLabel) {
        previousYearLabel.textContent = year - 1;
    }

    // Update chart series names if chart exists
    if (window.totalRevenueChartInstance) {
        window.totalRevenueChartInstance.updateOptions({
            series: [
                {
                    name: year.toString(),
                    data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
                },
                {
                    name: (year - 1).toString(),
                    data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
                }
            ]
        });
    }
}

// Function to fetch dashboard statistics
async function fetchDashboardStatistics(year = selectedYear) {
    try {
        const response = await fetch(`${API_BASE_URL}/api/v1/trainees/statistics?year=${year}`);

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

    // Update this month's enrollments card (Approved Enrollments)
    const approvedCard = document.querySelector('.bx-check-circle');
    if (approvedCard) {
        const approvedCountElement = approvedCard.closest('.card-body').querySelector('h3.card-title');
        const approvedPercentageElement = approvedCard.closest('.card-body').querySelector('small.fw-semibold');

        if (approvedCountElement) {
            approvedCountElement.textContent = data.approvedEnrollments.toLocaleString();
        }

        if (approvedPercentageElement && data.monthPercentageIncrease !== undefined) {
            const isPositive = data.monthPercentageIncrease >= 0;
            const icon = isPositive ? 'bx-up-arrow-alt' : 'bx-down-arrow-alt';
            const colorClass = isPositive ? 'text-success' : 'text-danger';

            approvedPercentageElement.className = `fw-semibold ${colorClass}`;
            approvedPercentageElement.innerHTML = `<i class="bx ${icon}"></i> ${isPositive ? '+' : ''}${data.monthPercentageIncrease}%`;
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

    // Update cancelled enrollments card
    const cancelledCard = document.querySelector('.bx-x-circle');
    if (cancelledCard) {
        const cancelledCountElement = cancelledCard.closest('.card-body').querySelector('h3.card-title');
        if (cancelledCountElement) {
            cancelledCountElement.textContent = data.cancelledEnrollments || 0;
        }
    }

    // Update enrollment activity trend card
    const activityTrendCount = document.getElementById('activityTrendCount');
    const activityTrendPercentage = document.getElementById('activityTrendPercentage');

    if (activityTrendCount) {
        activityTrendCount.textContent = data.monthEnrollments || 0;
    }

    if (activityTrendPercentage && data.monthPercentageIncrease !== undefined) {
        const isPositive = data.monthPercentageIncrease >= 0;
        const icon = isPositive ? 'bx-chevron-up' : 'bx-chevron-down';
        const colorClass = isPositive ? 'text-success' : 'text-danger';

        activityTrendPercentage.className = `text-nowrap fw-semibold ${colorClass}`;
        activityTrendPercentage.innerHTML = `<i class="bx ${icon}"></i> ${Math.abs(data.monthPercentageIncrease)}%`;
    }

    // Update growth chart percentage
    const growthTextElement = document.querySelector('.text-center.fw-semibold.pt-3.mb-2');
    if (growthTextElement && data.yearGrowthPercentage !== undefined) {
        growthTextElement.textContent = `${data.yearGrowthPercentage}% Enrollment Growth`;
    }

    // Update growth chart if it exists
    if (window.growthChartInstance && data.yearGrowthPercentage !== undefined) {
        window.growthChartInstance.updateSeries([data.yearGrowthPercentage]);
    }

    // Update year statistics counts
    const currentYearCount = document.getElementById('currentYearCount');
    const previousYearCount = document.getElementById('previousYearCount');

    if (currentYearCount) {
        currentYearCount.textContent = data.currentYearEnrollments || 0;
    }

    if (previousYearCount) {
        previousYearCount.textContent = data.previousYearEnrollments || 0;
    }
}

// Function to style Present status badges
function stylePresentBadges() {
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

// Initialize year filter functionality
function initYearFilter() {
    const yearDropdownItems = document.querySelectorAll('#growthReportId + .dropdown-menu .dropdown-item');

    yearDropdownItems.forEach(item => {
        item.addEventListener('click', function (e) {
            e.preventDefault();
            const year = parseInt(this.textContent.trim());

            if (!isNaN(year)) {
                selectedYear = year;
                updateYearLabels(year);
                fetchDashboardStatistics(year);
            }
        });
    });
}

// Initialize styling when DOM is loaded
document.addEventListener('DOMContentLoaded', function () {
    // Initialize year filter
    initYearFilter();

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
    setInterval(() => fetchDashboardStatistics(selectedYear), 30000);
});


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
