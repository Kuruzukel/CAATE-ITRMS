/* Admin Dashboard specific JavaScript */

// API Base URL - Always use the base path for dashboard
var API_BASE_URL_DASHBOARD = window.location.origin.includes('localhost')
    ? 'http://localhost/CAATE-ITRMS/backend/public'
    : '/CAATE-ITRMS/backend/public';

// Global variable to store selected year - defaults to current year
let selectedYear = new Date().getFullYear();

// Store pending growth chart data
let pendingGrowthData = null;

// Function to update all year labels on the dashboard
function updateYearLabels(year) {
    // Update chart title
    const chartTitle = document.querySelector('#chartYearTitle');
    if (chartTitle) {
        chartTitle.textContent = year;
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
        const response = await fetch(`${API_BASE_URL_DASHBOARD}/api/v1/trainees/statistics?year=${year}`);

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

    // Calculate percentage for the chart based on overall enrollments
    const totalEnrollments = data.approvedEnrollments + data.pendingEnrollments + data.cancelledEnrollments;
    const approvedPercentage = totalEnrollments > 0
        ? Math.round((data.approvedEnrollments / totalEnrollments) * 100)
        : 0;
    const pendingPercentage = totalEnrollments > 0
        ? Math.round((data.pendingEnrollments / totalEnrollments) * 100)
        : 0;
    const cancelledPercentage = totalEnrollments > 0
        ? Math.round((data.cancelledEnrollments / totalEnrollments) * 100)
        : 0;

    // Update the welcome card chart
    updateWelcomeChart(approvedPercentage, pendingPercentage, cancelledPercentage);

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
        const pendingPercentageElement = pendingCard.closest('.card-body').querySelector('small.fw-semibold');

        if (pendingCountElement) {
            pendingCountElement.textContent = data.pendingEnrollments || 0;
        }

        if (pendingPercentageElement && data.pendingPercentageChange !== undefined) {
            const isPositive = data.pendingPercentageChange >= 0;
            const icon = isPositive ? 'bx-up-arrow-alt' : 'bx-down-arrow-alt';
            const colorClass = isPositive ? 'text-danger' : 'text-success'; // Reversed: more pending is bad

            pendingPercentageElement.className = `fw-semibold ${colorClass}`;
            pendingPercentageElement.innerHTML = `<i class="bx ${icon}"></i> ${isPositive ? '+' : ''}${data.pendingPercentageChange}%`;
        }
    }

    // Update cancelled enrollments card
    const cancelledCard = document.querySelector('.bx-x-circle');
    if (cancelledCard) {
        const cancelledCountElement = cancelledCard.closest('.card-body').querySelector('h3.card-title');
        const cancelledPercentageElement = cancelledCard.closest('.card-body').querySelector('small.fw-semibold');

        if (cancelledCountElement) {
            cancelledCountElement.textContent = data.cancelledEnrollments || 0;
        }

        if (cancelledPercentageElement && data.cancelledPercentageChange !== undefined) {
            const isPositive = data.cancelledPercentageChange >= 0;
            const icon = isPositive ? 'bx-up-arrow-alt' : 'bx-down-arrow-alt';
            const colorClass = isPositive ? 'text-danger' : 'text-success'; // Reversed: more cancelled is bad

            cancelledPercentageElement.className = `fw-semibold ${colorClass}`;
            cancelledPercentageElement.innerHTML = `<i class="bx ${icon}"></i> ${isPositive ? '+' : ''}${data.cancelledPercentageChange}%`;
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

    // Update growth chart - wait for it to be ready if needed
    const updateGrowthChart = () => {
        if (window.growthChartInstance && data.yearGrowthPercentage !== undefined && data.yearGrowthPercentage !== null) {
            const growthValue = isNaN(data.yearGrowthPercentage) ? 0 : Math.max(0, Math.min(100, data.yearGrowthPercentage));
            window.growthChartInstance.updateSeries([growthValue]);
            pendingGrowthData = null; // Clear pending data
        } else if (data.yearGrowthPercentage !== undefined) {
            // Store data for later and retry
            pendingGrowthData = data.yearGrowthPercentage;
            setTimeout(updateGrowthChart, 100);
        }
    };
    updateGrowthChart();

    // Update year statistics counts
    const currentYearCount = document.getElementById('currentYearCount');
    const previousYearCount = document.getElementById('previousYearCount');

    if (currentYearCount) {
        currentYearCount.textContent = data.currentYearEnrollments || 0;
    }

    if (previousYearCount) {
        previousYearCount.textContent = data.previousYearEnrollments || 0;
    }

    // Update the monthly enrollment chart with real data
    if (window.totalRevenueChartInstance && data.monthly_enrollments) {
        // Get previous year data (all zeros for now, can be enhanced later)
        const previousYearData = Array(12).fill(0);

        window.totalRevenueChartInstance.updateOptions({
            series: [
                {
                    name: data.year.toString(),
                    data: data.monthly_enrollments
                },
                {
                    name: (data.year - 1).toString(),
                    data: previousYearData
                }
            ]
        });
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
    // Fetch and populate year dropdown with years from database
    fetchAndPopulateYears();
}

// Function to fetch available years from database and populate dropdown
async function fetchAndPopulateYears() {
    try {
        const response = await fetch(`${API_BASE_URL_DASHBOARD}/get-available-years.php`);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();

        if (result.success && result.years && result.years.length > 0) {
            populateYearDropdown(result.years);
        } else {
            // Fallback to current year if no data
            populateYearDropdown([new Date().getFullYear()]);
        }
    } catch (error) {
        // Fallback to current year if fetch fails
        populateYearDropdown([new Date().getFullYear()]);
    }
}

// Function to populate year dropdown with available years from database
function populateYearDropdown(years) {
    const yearMenu = document.getElementById('growthReportYearMenu');
    const yearTextElement = document.getElementById('selectedYearText');
    if (!yearMenu) return;

    const currentYear = new Date().getFullYear();

    // Check if current year is in the list, if not add it
    if (!years.includes(currentYear)) {
        years.unshift(currentYear);
        years.sort((a, b) => b - a); // Sort descending
    }

    // Set button text to current year on initial load
    if (yearTextElement) {
        yearTextElement.textContent = currentYear;
    }

    yearMenu.innerHTML = '';

    years.forEach(year => {
        const item = document.createElement('a');
        item.className = 'dropdown-item';
        item.href = 'javascript:void(0);';
        item.setAttribute('data-year', year);
        item.textContent = year;

        // Highlight current year
        if (year === currentYear) {
            item.classList.add('active');
        }

        item.addEventListener('click', function (e) {
            e.preventDefault();
            const selectedYear = parseInt(this.getAttribute('data-year'));

            if (!isNaN(selectedYear)) {
                window.selectedYear = selectedYear;

                // Update button text
                if (yearTextElement) {
                    yearTextElement.textContent = selectedYear;
                }

                updateYearLabels(selectedYear);
                fetchDashboardStatistics(selectedYear);

                // Update active state
                yearMenu.querySelectorAll('.dropdown-item').forEach(i => i.classList.remove('active'));
                this.classList.add('active');
            }
        });

        yearMenu.appendChild(item);
    });
}

// Function to update the welcome chart with real data
function updateWelcomeChart(approvedPercentage, pendingPercentage, cancelledPercentage) {
    // Check if ApexCharts is available
    if (typeof ApexCharts === 'undefined') {
        setTimeout(() => updateWelcomeChart(approvedPercentage, pendingPercentage, cancelledPercentage), 500);
        return;
    }

    const chartElement = document.querySelector('#welcomeStatisticsChart');
    if (!chartElement) return;

    // Ensure all values are valid numbers, default to 0 if not
    const approved = isNaN(approvedPercentage) || approvedPercentage === null || approvedPercentage === undefined ? 0 : approvedPercentage;
    const pending = isNaN(pendingPercentage) || pendingPercentage === null || pendingPercentage === undefined ? 0 : pendingPercentage;
    const cancelled = isNaN(cancelledPercentage) || cancelledPercentage === null || cancelledPercentage === undefined ? 0 : cancelledPercentage;

    // Store the chart instance globally so we can update it
    if (!window.welcomeChartInstance) {
        // Store the data for when the chart is initialized
        window.welcomeChartData = {
            enrolled: approved,
            pending: pending,
            completed: cancelled
        };
        return;
    }

    // Update the chart data
    window.welcomeChartInstance.updateOptions({
        series: [approved, pending, cancelled],
        labels: ['Approved', 'Pending', 'Cancelled'],
        colors: [config.colors.success, config.colors.warning, config.colors.danger],
        plotOptions: {
            pie: {
                donut: {
                    labels: {
                        total: {
                            label: 'Approved',
                            formatter: function (w) {
                                return approved + '%';
                            }
                        }
                    }
                }
            }
        }
    });
}


// Function to fetch course enrollment statistics
async function fetchCourseEnrollmentStatistics() {
    try {
        const response = await fetch(`${API_BASE_URL_DASHBOARD}/api/v1/courses/enrollment-statistics`);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();

        if (result.success) {
            updateCourseEnrollmentUI(result.data);
        }
    } catch (error) {
        console.error('Error fetching course enrollment statistics:', error);
    }
}

// Function to update Course Enrollment Statistics UI
function updateCourseEnrollmentUI(data) {
    const coursesList = document.getElementById('topEnrolledCoursesList');
    if (!coursesList) {
        console.log('topEnrolledCoursesList element not found');
        return;
    }

    if (!data.topCourses || data.topCourses.length === 0) {
        coursesList.innerHTML = `
            <li class="d-flex justify-content-center align-items-center py-3">
                <p class="text-muted small">No enrollment data available</p>
            </li>
        `;
        return;
    }

    coursesList.innerHTML = '';

    data.topCourses.forEach((course, index) => {
        const isLast = index === data.topCourses.length - 1;
        const li = document.createElement('li');
        li.className = isLast ? 'd-flex' : 'd-flex mb-4 pb-1';

        // Create image element
        const avatarDiv = document.createElement('div');
        avatarDiv.className = 'avatar flex-shrink-0 me-3';

        const img = document.createElement('img');
        img.alt = course.name;
        img.className = 'rounded course-image';
        img.style.cssText = 'width: 40px; height: 40px; object-fit: cover;';
        img.crossOrigin = 'anonymous';
        img.setAttribute('data-course-id', course.id);

        // Set image source with fallback
        if (course.image && course.image.trim() !== '') {
            img.src = course.image;
            img.onerror = function () {
                this.src = '../assets/images/DEFAULT_AVATAR.png';
            };
        } else {
            img.src = '../assets/images/DEFAULT_AVATAR.png';
        }

        avatarDiv.appendChild(img);

        // Create content div
        const contentDiv = document.createElement('div');
        contentDiv.className = 'd-flex w-100 flex-wrap align-items-center justify-content-between gap-2';

        contentDiv.innerHTML = `
            <div class="me-2">
                <h6 class="mb-0">${course.name}</h6>
                <small class="text-muted d-block">${course.hours}</small>
            </div>
            <div class="user-progress d-flex align-items-center">
                <h6 class="mb-0 text-white">${course.enrollmentCount}</h6>
            </div>
        `;

        li.appendChild(avatarDiv);
        li.appendChild(contentDiv);
        coursesList.appendChild(li);
    });
}


// Function to fetch recent enrollment activity
async function fetchRecentEnrollmentActivity() {
    try {
        const response = await fetch(`${API_BASE_URL_DASHBOARD}/api/v1/enrollments/recent`);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();

        if (result.success) {
            updateRecentEnrollmentActivityUI(result.data);
        }
    } catch (error) {
        console.error('Error fetching recent enrollment activity:', error);
    }
}

// Function to update Recent Enrollment Activity UI
function updateRecentEnrollmentActivityUI(activities) {
    const activityList = document.getElementById('recentEnrollmentActivityList');
    if (!activityList || !activities || activities.length === 0) return;

    activityList.innerHTML = '';

    activities.forEach((activity, index) => {
        const isLast = index === activities.length - 1;
        const li = document.createElement('li');
        li.className = isLast ? 'd-flex' : 'd-flex mb-4 pb-1';

        // Determine badge class and text based on status
        let badgeClass = 'bg-label-primary';
        let badgeText = activity.status;

        switch (activity.status.toLowerCase()) {
            case 'enrolled':
                badgeClass = 'bg-success';
                badgeText = 'Enrolled';
                break;
            case 'pending':
                badgeClass = 'bg-warning';
                badgeText = 'Pending';
                break;
            case 'cancelled':
            case 'withdrawn':
                badgeClass = 'bg-danger';
                badgeText = 'Cancelled';
                break;
            case 'completed':
                badgeClass = 'bg-info';
                badgeText = 'Completed';
                break;
        }

        // Use traineeName from API response
        const traineeName = activity.traineeName || activity.name || 'Unknown';

        // Determine avatar (use image if available, otherwise use icon)
        let avatarHTML = '';
        if (activity.avatar) {
            avatarHTML = `<img src="${activity.avatar}" alt="${traineeName}" class="rounded-circle" />`;
        } else {
            avatarHTML = `<span class="avatar-initial rounded-circle bg-label-primary"><i class="bx bx-user"></i></span>`;
        }

        li.innerHTML = `
            <div class="avatar flex-shrink-0 me-3">
                ${avatarHTML}
            </div>
            <div class="d-flex w-100 flex-wrap align-items-center justify-content-between gap-2">
                <div class="me-2">
                    <h6 class="mb-0">${traineeName}</h6>
                    <small class="text-muted d-block">${activity.courseName}</small>
                </div>
                <div class="user-progress">
                    <span class="badge ${badgeClass}">${badgeText}</span>
                </div>
            </div>
        `;

        activityList.appendChild(li);
    });
}

// Initialize dashboard data fetching
// Removed duplicate function - consolidated below


// Function to update recent enrollment activity UI
function updateRecentEnrollmentUI(enrollments) {
    const listElement = document.getElementById('recentEnrollmentActivityList');
    if (!listElement) return;

    if (!enrollments || enrollments.length === 0) {
        listElement.innerHTML = `
            <li class="d-flex justify-content-center align-items-center py-5">
                <p class="text-muted">No recent enrollment activity</p>
            </li>
        `;
        return;
    }

    listElement.innerHTML = enrollments.map((enrollment, index) => {
        const statusConfig = getStatusConfig(enrollment.status);
        const isLast = index === enrollments.length - 1;

        return `
            <li class="d-flex ${isLast ? '' : 'mb-4 pb-1'}">
                <div class="avatar flex-shrink-0 me-3">
                    <span class="avatar-initial rounded-circle bg-label-${statusConfig.color}">
                        <i class="bx bx-user"></i>
                    </span>
                </div>
                <div class="d-flex w-100 flex-wrap align-items-center justify-content-between gap-2">
                    <div class="me-2">
                        <h6 class="mb-0">${enrollment.traineeName || 'Unknown'}</h6>
                        <small class="text-muted d-block">${enrollment.courseName || 'N/A'}</small>
                    </div>
                    <div class="user-progress">
                        <span class="badge bg-${statusConfig.color}">${statusConfig.label}</span>
                    </div>
                </div>
            </li>
        `;
    }).join('');
}

// Function to get status configuration
function getStatusConfig(status) {
    const statusMap = {
        'enrolled': { color: 'success', label: 'Enrolled' },
        'pending': { color: 'warning', label: 'Pending' },
        'cancelled': { color: 'danger', label: 'Cancelled' },
        'withdrawn': { color: 'danger', label: 'Cancelled' },
        'completed': { color: 'primary', label: 'Completed' }
    };

    return statusMap[status?.toLowerCase()] || { color: 'secondary', label: status || 'Unknown' };
}

// Single DOMContentLoaded event listener
document.addEventListener('DOMContentLoaded', function () {
    // Initialize year labels with current year
    updateYearLabels(selectedYear);

    // Initialize year filter
    initYearFilter();

    // Fetch and display real dashboard statistics
    fetchDashboardStatistics();
    fetchRecentEnrollmentActivity();
    fetchCourseEnrollmentStatistics();

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
    setInterval(() => {
        fetchDashboardStatistics(selectedYear);
        fetchRecentEnrollmentActivity();
        fetchCourseEnrollmentStatistics();
    }, 30000);
});
