/* Admin Dashboard specific JavaScript - Optimized */

// API Base URL
const API_BASE_URL = window.location.origin.includes('localhost')
    ? 'http://localhost/CAATE-ITRMS/backend/public'
    : '/CAATE-ITRMS/backend/public';

// Global variable to store selected year
let selectedYear = 2026;

// Function to update all year labels on the dashboard
function updateYearLabels(year) {
    const chartTitle = document.querySelector('.col-md-8 h5.card-header');
    if (chartTitle) {
        chartTitle.textContent = `Monthly Trainee Enrollment ${year}`;
    }

    const activityBadge = document.getElementById('activityTrendYearBadge');
    if (activityBadge) {
        activityBadge.textContent = `Year ${year}`;
    }

    const currentYearLabel = document.getElementById('currentYearLabel');
    const previousYearLabel = document.getElementById('previousYearLabel');

    if (currentYearLabel) currentYearLabel.textContent = year;
    if (previousYearLabel) previousYearLabel.textContent = year - 1;

    if (window.totalRevenueChartInstance) {
        window.totalRevenueChartInstance.updateOptions({
            series: [
                { name: year.toString(), data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] },
                { name: (year - 1).toString(), data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] }
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

// Function to update dashboard UI with real data
function updateDashboardUI(data) {
    const totalTraineesElement = document.querySelector('.col-sm-5 h2.mb-2');
    if (totalTraineesElement) {
        totalTraineesElement.textContent = data.total.toLocaleString();
    }

    const totalEnrollments = data.approvedEnrollments + data.pendingEnrollments;
    const enrolledPercentage = totalEnrollments > 0
        ? Math.round((data.approvedEnrollments / totalEnrollments) * 100)
        : 0;
    const pendingPercentage = totalEnrollments > 0
        ? Math.round((data.pendingEnrollments / totalEnrollments) * 100)
        : 0;

    updateWelcomeChart(enrolledPercentage, pendingPercentage, Math.abs(data.todayPercentageIncrease));

    const percentageTextElement = document.querySelector('.col-sm-7 .fw-bold');
    if (percentageTextElement && data.todayPercentageIncrease !== undefined) {
        percentageTextElement.textContent = Math.abs(data.todayPercentageIncrease) + '%';
    }

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

    const pendingCard = document.querySelector('.bx-time-five');
    if (pendingCard) {
        const pendingCountElement = pendingCard.closest('.card-body').querySelector('h3.card-title');
        if (pendingCountElement) {
            pendingCountElement.textContent = data.pendingEnrollments || 0;
        }
    }

    const cancelledCard = document.querySelector('.bx-x-circle');
    if (cancelledCard) {
        const cancelledCountElement = cancelledCard.closest('.card-body').querySelector('h3.card-title');
        if (cancelledCountElement) {
            cancelledCountElement.textContent = data.cancelledEnrollments || 0;
        }
    }

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

    const growthTextElement = document.querySelector('.text-center.fw-semibold.pt-3.mb-2');
    if (growthTextElement && data.yearGrowthPercentage !== undefined) {
        growthTextElement.textContent = `${data.yearGrowthPercentage}% Enrollment Growth`;
    }

    if (window.growthChartInstance && data.yearGrowthPercentage !== undefined) {
        window.growthChartInstance.updateSeries([data.yearGrowthPercentage]);
    }

    const currentYearCount = document.getElementById('currentYearCount');
    const previousYearCount = document.getElementById('previousYearCount');

    if (currentYearCount) currentYearCount.textContent = data.currentYearEnrollments || 0;
    if (previousYearCount) previousYearCount.textContent = data.previousYearEnrollments || 0;
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

// Function to update the welcome chart with real data
function updateWelcomeChart(enrolledPercentage, pendingPercentage, completedPercentage) {
    if (typeof ApexCharts === 'undefined') {
        setTimeout(() => updateWelcomeChart(enrolledPercentage, pendingPercentage, completedPercentage), 500);
        return;
    }

    const chartElement = document.querySelector('#welcomeStatisticsChart');
    if (!chartElement) return;

    if (!window.welcomeChartInstance) {
        window.welcomeChartData = {
            enrolled: enrolledPercentage,
            pending: pendingPercentage,
            completed: completedPercentage
        };
        return;
    }

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

// Function to fetch course enrollment statistics (silently fails on 404)
async function fetchCourseEnrollmentStatistics() {
    try {
        const response = await fetch(`${API_BASE_URL}/api/v1/courses/enrollment-statistics`);
        if (!response.ok) {
            if (response.status === 404) return; // Silently fail for 404
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const result = await response.json();
        if (result.success && result.data) {
            updateCourseEnrollmentUI(result.data);
        }
    } catch (error) {
        if (!error.message.includes('404')) {
            console.error('Error fetching course enrollment statistics:', error);
        }
    }
}

// Function to update Course Enrollment Statistics UI
function updateCourseEnrollmentUI(data) {
    const totalEnrollmentsElement = document.getElementById('totalEnrollmentsCount');
    if (totalEnrollmentsElement && data.totalEnrollments !== undefined) {
        totalEnrollmentsElement.textContent = data.totalEnrollments.toLocaleString();
    }

    const coursesList = document.getElementById('topEnrolledCoursesList');
    if (coursesList && data.topCourses && data.topCourses.length > 0) {
        coursesList.innerHTML = '';
        data.topCourses.forEach((course, index) => {
            const isLast = index === data.topCourses.length - 1;
            const li = document.createElement('li');
            li.className = isLast ? 'd-flex' : 'd-flex mb-4 pb-1';
            li.innerHTML = `
                <div class="avatar flex-shrink-0 me-3">
                    <img src="${course.image || 'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=400&h=250&fit=crop'}" 
                         alt="${course.name}" 
                         class="rounded" 
                         style="width: 38px; height: 38px; object-fit: cover;" />
                </div>
                <div class="d-flex w-100 flex-wrap align-items-center justify-content-between gap-2">
                    <div class="me-2">
                        <h6 class="mb-0">${course.name}</h6>
                        <small class="text-muted">${course.hours}</small>
                    </div>
                </div>
            `;
            coursesList.appendChild(li);
        });
    }
}

// Function to fetch recent enrollment activity (silently fails on 404)
async function fetchRecentEnrollmentActivity() {
    try {
        const response = await fetch(`${API_BASE_URL}/api/v1/enrollments/recent-activity`);
        if (!response.ok) {
            if (response.status === 404) return; // Silently fail for 404
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const result = await response.json();
        if (result.success && result.data) {
            updateRecentEnrollmentActivityUI(result.data);
        }
    } catch (error) {
        if (!error.message.includes('404')) {
            console.error('Error fetching recent enrollment activity:', error);
        }
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

        let avatarHTML = activity.avatar
            ? `<img src="${activity.avatar}" alt="${activity.name}" class="rounded-circle" />`
            : `<span class="avatar-initial rounded-circle bg-label-primary"><i class="bx bx-user"></i></span>`;

        li.innerHTML = `
            <div class="avatar flex-shrink-0 me-3">
                ${avatarHTML}
            </div>
            <div class="d-flex w-100 flex-wrap align-items-center justify-content-between gap-2">
                <div class="me-2">
                    <h6 class="mb-0">${activity.name}</h6>
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

// Function to update the course donut chart
function updateCourseDonutChart(courses) {
    if (!courses || courses.length === 0) return;

    if (typeof ApexCharts === 'undefined') {
        setTimeout(() => updateCourseDonutChart(courses), 500);
        return;
    }

    const chartElement = document.querySelector('#orderStatisticsChart');
    if (!chartElement) return;

    const labels = courses.map(course => course.name);
    const series = courses.map(course => course.enrollmentCount);
    const colors = ['#696cff', '#03c3ec', '#8592a3', '#71dd37', '#ffab00'];

    if (window.orderStatisticsChartInstance) {
        window.orderStatisticsChartInstance.updateOptions({
            labels: labels,
            series: series,
            colors: colors.slice(0, courses.length)
        });
    } else {
        const chartConfig = {
            chart: { height: 165, width: 130, type: 'donut' },
            labels: labels,
            series: series,
            colors: colors.slice(0, courses.length),
            stroke: { width: 5, colors: ['#1a2942'] },
            dataLabels: { enabled: false, formatter: function (val, opt) { return parseInt(val) + '%'; } },
            legend: { show: false },
            grid: { padding: { top: 0, bottom: 0, right: 15 } },
            plotOptions: { pie: { donut: { size: '75%', labels: { show: false } } } },
            tooltip: {
                theme: 'dark',
                style: { fontSize: '12px', fontFamily: 'Public Sans' },
                y: {
                    formatter: function (val, opts) {
                        const courseName = opts.w.globals.labels[opts.seriesIndex];
                        return courseName + ': ' + val + ' trainees';
                    }
                }
            }
        };
        window.orderStatisticsChartInstance = new ApexCharts(chartElement, chartConfig);
        window.orderStatisticsChartInstance.render();
    }
}

// Consolidated DOMContentLoaded event listener
document.addEventListener('DOMContentLoaded', function () {
    initYearFilter();
    fetchDashboardStatistics();

    // Fetch optional data (will fail silently if endpoints don't exist)
    fetchCourseEnrollmentStatistics();
    fetchRecentEnrollmentActivity();

    stylePresentBadges();
    stylePresentTodayElements();
    ensureSuccessBadgeStyling();

    const observer = new MutationObserver(function (mutations) {
        mutations.forEach(function (mutation) {
            if (mutation.type === 'childList') {
                stylePresentBadges();
                ensureSuccessBadgeStyling();
            }
        });
    });

    observer.observe(document.body, { childList: true, subtree: true });

    // Refresh statistics every 60 seconds (reduced from 30s to minimize failed requests)
    setInterval(() => {
        fetchDashboardStatistics(selectedYear);
        fetchCourseEnrollmentStatistics();
        fetchRecentEnrollmentActivity();
    }, 60000);
});
