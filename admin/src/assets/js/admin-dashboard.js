var API_BASE_URL_DASHBOARD = window.location.origin.includes('localhost')
    ? 'http://localhost/CAATE-ITRMS/backend/public'
    : '/CAATE-ITRMS/backend/public';

let selectedYear = new Date().getFullYear();

let pendingGrowthData = null;

function updateYearLabels(year) {

    const chartTitle = document.querySelector('#chartYearTitle');
    if (chartTitle) {
        chartTitle.textContent = year;
    }

    const currentYearLabel = document.getElementById('currentYearLabel');
    const previousYearLabel = document.getElementById('previousYearLabel');

    if (currentYearLabel) {
        currentYearLabel.textContent = year;
    }

    if (previousYearLabel) {
        previousYearLabel.textContent = year - 1;
    }

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

    }
}

function showErrorMessage(message) {

}

function updateDashboardUI(data) {

    const totalTraineesElement = document.querySelector('.col-sm-5 h2.mb-2');
    if (totalTraineesElement) {
        totalTraineesElement.textContent = data.total.toLocaleString();
    }

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

    updateWelcomeChart(approvedPercentage, pendingPercentage, cancelledPercentage);

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

    const approvedCard = document.querySelector('.avatar .bx-check-circle');
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
        const pendingPercentageElement = pendingCard.closest('.card-body').querySelector('small.fw-semibold');

        if (pendingCountElement) {
            pendingCountElement.textContent = data.pendingEnrollments || 0;
        }

        if (pendingPercentageElement && data.pendingPercentageChange !== undefined) {
            const isPositive = data.pendingPercentageChange >= 0;
            const icon = isPositive ? 'bx-up-arrow-alt' : 'bx-down-arrow-alt';
            const colorClass = isPositive ? 'text-danger' : 'text-success';

            pendingPercentageElement.className = `fw-semibold ${colorClass}`;
            pendingPercentageElement.innerHTML = `<i class="bx ${icon}"></i> ${isPositive ? '+' : ''}${data.pendingPercentageChange}%`;
        }
    }

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
            const colorClass = isPositive ? 'text-danger' : 'text-success';

            cancelledPercentageElement.className = `fw-semibold ${colorClass}`;
            cancelledPercentageElement.innerHTML = `<i class="bx ${icon}"></i> ${isPositive ? '+' : ''}${data.cancelledPercentageChange}%`;
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

    const updateGrowthChart = () => {
        if (window.growthChartInstance && data.yearGrowthPercentage !== undefined && data.yearGrowthPercentage !== null) {
            const growthValue = isNaN(data.yearGrowthPercentage) ? 0 : Math.max(0, Math.min(100, data.yearGrowthPercentage));
            window.growthChartInstance.updateSeries([growthValue]);
            pendingGrowthData = null;
        } else if (data.yearGrowthPercentage !== undefined) {

            pendingGrowthData = data.yearGrowthPercentage;
            setTimeout(updateGrowthChart, 100);
        }
    };
    updateGrowthChart();

    const currentYearCount = document.getElementById('currentYearCount');
    const previousYearCount = document.getElementById('previousYearCount');

    if (currentYearCount) {
        currentYearCount.textContent = data.currentYearEnrollments || 0;
    }

    if (previousYearCount) {
        previousYearCount.textContent = data.previousYearEnrollments || 0;
    }

    if (window.totalRevenueChartInstance && data.monthly_enrollments) {

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

function stylePresentTodayElements() {
    const elements = document.querySelectorAll('*');

    elements.forEach(element => {
        if (element.textContent && element.textContent.includes('Present Today')) {
            element.style.color = '#28a745';
            element.style.fontWeight = 'bold';
        }
    });
}

function ensureSuccessBadgeStyling() {
    const successBadges = document.querySelectorAll('.badge.bg-success');

    successBadges.forEach(badge => {
        badge.style.backgroundColor = '#28a745';
        badge.style.color = '#ffffff';
    });
}

function initYearFilter() {

    fetchAndPopulateYears();
}

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

            populateYearDropdown([new Date().getFullYear()]);
        }
    } catch (error) {

        populateYearDropdown([new Date().getFullYear()]);
    }
}

function populateYearDropdown(years) {
    const yearMenu = document.getElementById('growthReportYearMenu');
    const yearTextElement = document.getElementById('selectedYearText');
    if (!yearMenu) return;

    const currentYear = new Date().getFullYear();

    if (!years.includes(currentYear)) {
        years.unshift(currentYear);
        years.sort((a, b) => b - a);
    }

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

        if (year === currentYear) {
            item.classList.add('active');
        }

        item.addEventListener('click', function (e) {
            e.preventDefault();
            const selectedYear = parseInt(this.getAttribute('data-year'));

            if (!isNaN(selectedYear)) {
                window.selectedYear = selectedYear;

                if (yearTextElement) {
                    yearTextElement.textContent = selectedYear;
                }

                updateYearLabels(selectedYear);
                fetchDashboardStatistics(selectedYear);

                yearMenu.querySelectorAll('.dropdown-item').forEach(i => i.classList.remove('active'));
                this.classList.add('active');
            }
        });

        yearMenu.appendChild(item);
    });
}

function updateWelcomeChart(approvedPercentage, pendingPercentage, cancelledPercentage) {

    if (typeof ApexCharts === 'undefined') {
        setTimeout(() => updateWelcomeChart(approvedPercentage, pendingPercentage, cancelledPercentage), 500);
        return;
    }

    const chartElement = document.querySelector('#welcomeStatisticsChart');
    if (!chartElement) return;

    const approved = isNaN(approvedPercentage) || approvedPercentage === null || approvedPercentage === undefined ? 0 : approvedPercentage;
    const pending = isNaN(pendingPercentage) || pendingPercentage === null || pendingPercentage === undefined ? 0 : pendingPercentage;
    const cancelled = isNaN(cancelledPercentage) || cancelledPercentage === null || cancelledPercentage === undefined ? 0 : cancelledPercentage;

    if (!window.welcomeChartInstance) {

        window.welcomeChartData = {
            enrolled: approved,
            pending: pending,
            completed: cancelled
        };
        return;
    }

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

        const avatarDiv = document.createElement('div');
        avatarDiv.className = 'avatar flex-shrink-0 me-3';

        const img = document.createElement('img');
        img.alt = course.name;
        img.className = 'rounded course-image';
        img.style.cssText = 'width: 40px; height: 40px; object-fit: cover;';
        img.setAttribute('data-course-id', course.id);

        if (course.image && course.image.trim() !== '') {
            img.src = course.image;
            img.onerror = function () {
                this.src = '../assets/images/DEFAULT_AVATAR.png';
            };
        } else {
            img.src = '../assets/images/DEFAULT_AVATAR.png';
        }

        avatarDiv.appendChild(img);

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

async function fetchRecentEnrollmentActivity() {
    try {

        const fetchPromises = [
            fetch(`${config.api.baseUrl}/api/v1/enrollments/recent?limit=10`).then(res => res.json()),
            fetch(`${config.api.baseUrl}/api/v1/registrations?limit=10&sort=createdAt&order=desc`).then(res => res.json())
        ];

        const [enrollmentsData, registrationsData] = await Promise.all(fetchPromises);

        const combinedData = [];

        if (enrollmentsData.success && enrollmentsData.data) {
            for (const enrollment of enrollmentsData.data) {

                let profileImage = null;
                if (enrollment.traineeId) {
                    try {
                        const traineeResponse = await fetch(`${config.api.baseUrl}/api/v1/trainees/${enrollment.traineeId}`);
                        const traineeData = await traineeResponse.json();
                        if (traineeData.success && traineeData.data && traineeData.data.profile_image) {
                            profileImage = traineeData.data.profile_image;
                        }
                    } catch (error) {
                        console.log('Could not fetch trainee profile:', error);
                    }
                }

                combinedData.push({
                    traineeName: enrollment.traineeName || 'Unknown',
                    courseName: enrollment.courseName || 'No Course Selected',
                    status: enrollment.status || 'pending',
                    createdAt: enrollment.enrollmentDate || enrollment.enrollment_date || new Date().toISOString(),
                    profileImage: profileImage,
                    type: 'enrollment'
                });
            }
        }

        if (registrationsData.success && registrationsData.data) {
            for (const reg of registrationsData.data) {

                let profileImage = null;
                if (reg.userId) {
                    try {
                        const traineeResponse = await fetch(`${config.api.baseUrl}/api/v1/trainees/${reg.userId}`);
                        const traineeData = await traineeResponse.json();
                        if (traineeData.success && traineeData.data && traineeData.data.profile_image) {
                            profileImage = traineeData.data.profile_image;
                        }
                    } catch (error) {
                        console.log('Could not fetch trainee profile:', error);
                    }
                }

                combinedData.push({
                    traineeName: reg.traineeFullName || `${reg.firstName || ''} ${reg.lastName || ''}`.trim() || 'Unknown',
                    courseName: reg.selectedCourse || reg.courseTitle || reg.course || 'No Course Selected',
                    status: reg.status || 'pending',
                    createdAt: reg.createdAt || reg.created_at || new Date().toISOString(),
                    profileImage: profileImage,
                    type: 'registration'
                });
            }
        }

        combinedData.sort((a, b) => {
            const dateA = new Date(a.createdAt);
            const dateB = new Date(b.createdAt);
            return dateB - dateA;
        });

        const recentActivities = combinedData.slice(0, 11);

        updateRecentEnrollmentActivityUI(recentActivities);
    } catch (error) {
        console.error('Error fetching recent enrollment activity:', error);

        const activityList = document.getElementById('recentEnrollmentActivityList');
        if (activityList) {
            activityList.innerHTML = `
                <li class="d-flex justify-content-center align-items-center py-5">
                    <p class="text-muted">Unable to load enrollment activity</p>
                </li>
            `;
        }
    }
}

function updateRecentEnrollmentActivityUI(activities) {
    const activityList = document.getElementById('recentEnrollmentActivityList');
    if (!activityList) return;

    if (!activities || activities.length === 0) {
        activityList.innerHTML = `
            <li class="d-flex justify-content-center align-items-center py-5">
                <p class="text-muted">No recent enrollment activity</p>
            </li>
        `;
        return;
    }

    activityList.innerHTML = '';

    activities.forEach((activity, index) => {
        const isLast = index === activities.length - 1;
        const li = document.createElement('li');
        li.className = isLast ? 'd-flex' : 'd-flex mb-4 pb-1';

        let badgeClass = 'bg-secondary';
        let badgeText = 'Unknown';
        let iconColor = 'label-secondary';

        const status = (activity.status || '').toLowerCase();

        switch (status) {
            case 'approved':
            case 'enrolled':
                badgeClass = 'bg-success';
                badgeText = 'Approved';
                iconColor = 'label-success';
                break;
            case 'pending':
                badgeClass = 'bg-warning';
                badgeText = 'Pending';
                iconColor = 'label-warning';
                break;
            case 'cancelled':
            case 'rejected':
            case 'withdrawn':
                badgeClass = 'bg-danger';
                badgeText = 'Cancelled';
                iconColor = 'label-danger';
                break;
            case 'completed':
                badgeClass = 'bg-primary';
                badgeText = 'Completed';
                iconColor = 'label-primary';
                break;
        }

        const traineeName = activity.traineeName || 'Unknown';

        let avatarHTML = '';
        const defaultAvatar = '../assets/images/DEFAULT_AVATAR.png';

        if (activity.profileImage) {

            let imageUrl = activity.profileImage;

            if (imageUrl.startsWith('/CAATE-ITRMS/')) {
                imageUrl = window.location.origin + imageUrl;
            }

            else if (!imageUrl.startsWith('http')) {
                imageUrl = `${config.api.baseUrl}/${imageUrl}`;
            }

            avatarHTML = `
                <img src="${imageUrl}" alt="${traineeName}" class="rounded-circle" style="width: 38px; height: 38px; object-fit: cover;" 
                     onerror="this.src='${defaultAvatar}';">
            `;
        } else {
            avatarHTML = `
                <img src="${defaultAvatar}" alt="${traineeName}" class="rounded-circle" style="width: 38px; height: 38px; object-fit: cover;">
            `;
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

function getStatusConfig(status) {
    const statusLower = (status || '').toLowerCase();
    const statusMap = {
        'approved': { color: 'success', label: 'Approved' },
        'enrolled': { color: 'success', label: 'Approved' },
        'pending': { color: 'warning', label: 'Pending' },
        'cancelled': { color: 'danger', label: 'Cancelled' },
        'rejected': { color: 'danger', label: 'Cancelled' },
        'withdrawn': { color: 'danger', label: 'Cancelled' },
        'completed': { color: 'primary', label: 'Completed' }
    };

    return statusMap[statusLower] || { color: 'secondary', label: status || 'Unknown' };
}

document.addEventListener('DOMContentLoaded', function () {

    updateYearLabels(selectedYear);

    initYearFilter();

    fetchDashboardStatistics();
    fetchRecentEnrollmentActivity();
    fetchCourseEnrollmentStatistics();

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

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    setInterval(() => {
        fetchDashboardStatistics(selectedYear);
        fetchRecentEnrollmentActivity();
        fetchCourseEnrollmentStatistics();
    }, 30000);
});