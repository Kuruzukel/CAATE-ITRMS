/**
 * Registration Records Management
 */

'use strict';

(function () {
    let registrations = [];
    let currentPage = 1;
    const limit = 10;

    // Initialize on page load
    document.addEventListener('DOMContentLoaded', function () {
        loadRegistrations();
        loadCoursesForFilter();
        setupEventListeners();
    });

    /**
     * Load registrations from API
     */
    async function loadRegistrations(filters = {}) {
        try {
            const queryParams = new URLSearchParams({
                page: currentPage,
                limit: limit,
                ...filters
            });

            const response = await fetch(`${config.api.baseUrl}/api/v1/registrations?${queryParams}`);
            const data = await response.json();

            if (data.success) {
                registrations = data.data;
                renderRegistrations(registrations);
                updateStatistics();
            } else {
                console.error('Failed to load registrations:', data.message);
                showError('Failed to load registrations');
            }
        } catch (error) {
            console.error('Error loading registrations:', error);
            showError('Error connecting to server');
        }
    }

    /**
     * Load courses for filter dropdown
     */
    async function loadCoursesForFilter() {
        const courseSelect = document.querySelectorAll('select')[1];
        if (!courseSelect) return;

        try {
            const response = await fetch(`${config.api.baseUrl}/api/v1/courses`);
            const result = await response.json();

            if (result.success && result.data && result.data.length > 0) {
                // Keep the "All Courses" option
                courseSelect.innerHTML = '<option value="">All Courses</option>';

                // Add courses from API
                result.data.forEach(course => {
                    const option = document.createElement('option');
                    const courseTitle = course.title || 'Untitled Course';
                    option.value = courseTitle;
                    option.textContent = courseTitle;
                    courseSelect.appendChild(option);
                });
            } else {
                console.log('No courses available or failed to load');
            }
        } catch (error) {
            console.error('Error loading courses for filter:', error);
        }
    }

    /**
     * Render registrations table
     */
    function renderRegistrations(data) {
        const tbody = document.querySelector('.table tbody');

        if (!data || data.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="6" class="text-center py-4">
                        <i class="bx bx-info-circle" style="font-size: 3rem; color: #8592a3;"></i>
                        <p class="mt-2 mb-0">No registration records found</p>
                    </td>
                </tr>
            `;
            return;
        }

        tbody.innerHTML = data.map(registration => {
            // Use traineeFullName if available, otherwise construct from form data
            const fullName = registration.traineeFullName ||
                `${registration.firstName} ${registration.middleName || ''} ${registration.lastName}`.trim();
            const initials = getInitials(fullName);
            const formattedDate = formatDate(registration.submittedAt);
            const statusBadge = getStatusBadge(registration.status);
            const traineeId = registration.traineeId || 'N/A';
            const course = registration.selectedCourse || registration.courseQualification || 'N/A';

            return `
                <tr data-id="${registration._id.$oid}">
                    <td>
                        <div class="d-flex align-items-center">
                            <div class="avatar avatar-sm me-3"
                                style="background: linear-gradient(135deg, rgba(54, 145, 191, 0.1) 0%, rgba(50, 85, 150, 0.1) 100%); 
                                backdrop-filter: blur(10px) saturate(180%); 
                                -webkit-backdrop-filter: blur(10px) saturate(180%); 
                                border: 1px solid rgba(54, 145, 191, 0.4); 
                                box-shadow: 0 4px 12px rgba(22, 56, 86, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.3); 
                                color: white; 
                                display: flex; 
                                align-items: center; 
                                justify-content: center; 
                                border-radius: 50%; 
                                width: 38px; 
                                height: 38px; 
                                font-weight: 600;">
                                ${initials}
                            </div>
                            <span>${fullName}</span>
                        </div>
                    </td>
                    <td><strong>${traineeId}</strong></td>
                    <td>${course}</td>
                    <td>${formattedDate}</td>
                    <td>${statusBadge}</td>
                    <td>
                        <div class="btn-group" role="group">
                            <button type="button"
                                class="btn btn-sm btn-primary dropdown-toggle"
                                data-bs-toggle="dropdown" aria-expanded="false">
                                <i class="bx bx-refresh"></i> Change Status
                            </button>
                            <ul class="dropdown-menu">
                                <li><a class="dropdown-item status-change" data-status="approved" data-id="${registration._id.$oid}"
                                        style="color: #10b981 !important;"
                                        href="javascript:void(0);"><i
                                            class="bx bx-check-circle me-2"
                                            style="color: #10b981 !important;"></i>Approved</a>
                                </li>
                                <li><a class="dropdown-item status-change" data-status="pending" data-id="${registration._id.$oid}"
                                        style="color: #ffc107 !important;"
                                        href="javascript:void(0);"><i
                                            class="bx bx-time-five me-2"
                                            style="color: #ffc107 !important;"></i>Pending</a>
                                </li>
                                <li><a class="dropdown-item text-danger status-change" data-status="cancelled" data-id="${registration._id.$oid}"
                                        href="javascript:void(0);"><i
                                            class="bx bx-block me-2"></i>Cancelled</a>
                                </li>
                            </ul>
                            <button type="button"
                                class="btn btn-sm dropdown-toggle-split"
                                data-bs-toggle="dropdown" aria-expanded="false"
                                style="background: none; border: none; color: white;">
                                <i class="bx bx-dots-vertical-rounded"></i>
                            </button>
                            <ul class="dropdown-menu dropdown-menu-end">
                                <li><a class="dropdown-item view-details" data-id="${registration._id.$oid}"
                                        href="javascript:void(0);"><i
                                            class="bx bx-show me-2"></i>View Details</a></li>
                                <li><a class="dropdown-item edit-details" data-id="${registration._id.$oid}"
                                        href="javascript:void(0);"><i
                                            class="bx bx-edit me-2"></i>Edit Details</a></li>
                                <li>
                                    <hr class="dropdown-divider">
                                </li>
                                <li><a class="dropdown-item text-danger delete-record" data-id="${registration._id.$oid}"
                                        href="javascript:void(0);"><i
                                            class="bx bx-trash me-2"></i>Delete Record</a>
                                </li>
                            </ul>
                        </div>
                    </td>
                </tr>
            `;
        }).join('');

        // Attach event listeners to action buttons
        attachActionListeners();
    }

    /**
     * Get initials from full name
     */
    function getInitials(name) {
        return name
            .split(' ')
            .filter(n => n)
            .map(n => n[0])
            .join('')
            .toUpperCase()
            .substring(0, 2);
    }

    /**
     * Format date
     */
    function formatDate(dateString) {
        if (!dateString) return 'N/A';

        try {
            let date;

            // Handle MongoDB BSON date format
            if (dateString.$date) {
                if (typeof dateString.$date === 'number') {
                    date = new Date(dateString.$date);
                } else if (typeof dateString.$date === 'string') {
                    date = new Date(dateString.$date);
                } else if (dateString.$date.$numberLong) {
                    date = new Date(parseInt(dateString.$date.$numberLong));
                } else {
                    date = new Date(dateString.$date);
                }
            } else if (typeof dateString === 'string') {
                date = new Date(dateString);
            } else if (typeof dateString === 'number') {
                date = new Date(dateString);
            } else {
                return 'N/A';
            }

            // Check if date is valid
            if (isNaN(date.getTime())) {
                return 'N/A';
            }

            return date.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            });
        } catch (error) {
            console.error('Date formatting error:', error, dateString);
            return 'N/A';
        }
    }

    /**
     * Get status badge HTML
     */
    function getStatusBadge(status) {
        const statusMap = {
            'approved': '<span class="badge bg-success">Approved</span>',
            'pending': '<span class="badge bg-warning">Pending</span>',
            'cancelled': '<span class="badge bg-danger">Cancelled</span>'
        };
        return statusMap[status] || '<span class="badge bg-secondary">Unknown</span>';
    }

    /**
     * Update statistics cards
     */
    async function updateStatistics() {
        try {
            const response = await fetch(`${config.api.baseUrl}/api/v1/registrations?limit=1000`);
            const data = await response.json();

            if (data.success) {
                const all = data.data;

                // Current counts
                const total = all.length;
                const approved = all.filter(r => r.status === 'approved').length;
                const pending = all.filter(r => r.status === 'pending').length;
                const cancelled = all.filter(r => r.status === 'cancelled').length;

                // Calculate previous month counts for percentage change
                const now = new Date();
                const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
                const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);

                const lastMonthData = all.filter(r => {
                    if (!r.submittedAt && !r.createdAt) return false;
                    const dateValue = r.submittedAt || r.createdAt;
                    if (!dateValue) return false;
                    const date = new Date(dateValue.$date || dateValue);
                    return date >= lastMonth && date < thisMonth;
                });

                const thisMonthData = all.filter(r => {
                    if (!r.submittedAt && !r.createdAt) return false;
                    const dateValue = r.submittedAt || r.createdAt;
                    if (!dateValue) return false;
                    const date = new Date(dateValue.$date || dateValue);
                    return date >= thisMonth;
                });

                // Calculate percentages
                const totalPercentage = calculatePercentage(thisMonthData.length, lastMonthData.length);
                const approvedPercentage = calculatePercentage(
                    thisMonthData.filter(r => r.status === 'approved').length,
                    lastMonthData.filter(r => r.status === 'approved').length
                );
                const pendingPercentage = calculatePercentage(
                    thisMonthData.filter(r => r.status === 'pending').length,
                    lastMonthData.filter(r => r.status === 'pending').length
                );
                const cancelledPercentage = calculatePercentage(
                    thisMonthData.filter(r => r.status === 'cancelled').length,
                    lastMonthData.filter(r => r.status === 'cancelled').length
                );

                // Update cards (if they exist)
                updateStatCard(0, total, totalPercentage);
                updateStatCard(1, approved, approvedPercentage);
                updateStatCard(2, pending, pendingPercentage);
                updateStatCard(3, cancelled, cancelledPercentage);
            }
        } catch (error) {
            console.error('Error updating statistics:', error);
        }
    }

    /**
     * Calculate percentage change
     */
    function calculatePercentage(current, previous) {
        if (previous === 0) {
            return current > 0 ? 100 : 0;
        }
        return ((current - previous) / previous * 100).toFixed(1);
    }

    /**
     * Update individual stat card
     */
    function updateStatCard(index, value, percentage) {
        const cards = document.querySelectorAll('.card-body h3');
        if (cards[index]) {
            cards[index].textContent = value.toLocaleString();
        }

        // Update percentage if provided
        if (percentage !== undefined) {
            const percentageElements = document.querySelectorAll('.card-body small');
            if (percentageElements[index]) {
                const percentageValue = parseFloat(percentage);
                let icon, colorClass, sign;

                if (percentageValue > 0) {
                    icon = 'bx-up-arrow-alt';
                    colorClass = 'text-success';
                    sign = '+';
                } else if (percentageValue < 0) {
                    icon = 'bx-down-arrow-alt';
                    colorClass = 'text-danger';
                    sign = '';
                } else {
                    icon = 'bx-minus';
                    colorClass = 'text-muted';
                    sign = '';
                }

                percentageElements[index].className = `${colorClass} fw-semibold`;
                percentageElements[index].innerHTML = `<i class="bx ${icon}"></i> ${sign}${Math.abs(percentageValue)}%`;
            }
        }
    }

    /**
     * Setup event listeners
     */
    function setupEventListeners() {
        // Filter inputs
        const searchInput = document.querySelector('input[placeholder="Name or Trainee ID"]');
        const statusSelect = document.querySelector('select');
        const courseSelect = document.querySelectorAll('select')[1];
        const dateInput = document.querySelector('#registrationDateFilter');
        const resetBtn = document.querySelector('.btn-outline-secondary');

        if (searchInput) {
            searchInput.addEventListener('input', debounce(applyFilters, 500));
        }

        if (statusSelect) {
            statusSelect.addEventListener('change', applyFilters);
        }

        if (courseSelect) {
            courseSelect.addEventListener('change', applyFilters);
        }

        if (dateInput) {
            dateInput.addEventListener('change', applyFilters);
        }

        if (resetBtn) {
            resetBtn.addEventListener('click', resetFilters);
        }

        // Export buttons
        const exportCsvBtn = document.getElementById('exportCsvBtn');
        const exportJsonBtn = document.getElementById('exportJsonBtn');
        const addRegistrationBtn = document.getElementById('addRegistrationBtn');

        if (exportCsvBtn) {
            exportCsvBtn.addEventListener('click', exportToCSV);
        }

        if (exportJsonBtn) {
            exportJsonBtn.addEventListener('click', exportToJSON);
        }

        if (addRegistrationBtn) {
            addRegistrationBtn.addEventListener('click', () => {
                openAddRegistrationModal();
            });
        }

        // Save registration button
        const saveRegistrationBtn = document.getElementById('saveRegistrationBtn');
        if (saveRegistrationBtn) {
            saveRegistrationBtn.addEventListener('click', saveNewRegistration);
        }

        // Save edit button
        const saveEditBtn = document.getElementById('saveEditBtn');
        if (saveEditBtn) {
            saveEditBtn.addEventListener('click', saveEditedRegistration);
        }
    }

    /**
     * Apply filters
     */
    function applyFilters() {
        const searchValue = document.querySelector('input[placeholder="Name or Trainee ID"]')?.value.toLowerCase().trim();
        const statusValue = document.querySelector('select')?.value;
        const courseValue = document.querySelectorAll('select')[1]?.value;
        const dateValue = document.querySelector('#registrationDateFilter')?.value;

        let filtered = [...registrations];

        // Only filter (hide rows) for non-search filters
        if (statusValue) {
            filtered = filtered.filter(r => r.status === statusValue);
        }

        if (courseValue) {
            filtered = filtered.filter(r => {
                const course = (r.selectedCourse || r.courseQualification || '').trim();
                // Exact match with the selected course
                return course === courseValue;
            });
        }

        if (dateValue) {
            filtered = filtered.filter(r => {
                try {
                    let regDate;

                    // Handle MongoDB BSON date format
                    if (r.submittedAt && r.submittedAt.$date) {
                        if (typeof r.submittedAt.$date === 'number') {
                            regDate = new Date(r.submittedAt.$date);
                        } else if (typeof r.submittedAt.$date === 'string') {
                            regDate = new Date(r.submittedAt.$date);
                        } else if (r.submittedAt.$date.$numberLong) {
                            regDate = new Date(parseInt(r.submittedAt.$date.$numberLong));
                        } else {
                            regDate = new Date(r.submittedAt.$date);
                        }
                    } else if (r.submittedAt) {
                        regDate = new Date(r.submittedAt);
                    } else {
                        return false;
                    }

                    // Check if date is valid
                    if (isNaN(regDate.getTime())) {
                        return false;
                    }

                    const filterDate = new Date(dateValue);

                    // Compare dates (year, month, day only - ignore time)
                    return regDate.getFullYear() === filterDate.getFullYear() &&
                        regDate.getMonth() === filterDate.getMonth() &&
                        regDate.getDate() === filterDate.getDate();
                } catch (error) {
                    console.error('Date filter error:', error, r.submittedAt);
                    return false;
                }
            });
        }

        // Render filtered data (this shows/hides rows based on dropdown filters)
        renderRegistrations(filtered);

        // Apply search highlighting without filtering
        if (searchValue) {
            setTimeout(() => {
                clearAllHighlights();
                highlightSearchResults(searchValue);
            }, 50);
        } else {
            clearAllHighlights();
        }
    }

    /**
     * Clear all row highlights
     */
    function clearAllHighlights() {
        const tbody = document.querySelector('.table tbody');
        if (tbody) {
            const rows = tbody.querySelectorAll('tr');
            rows.forEach(row => {
                row.style.boxShadow = '';
                row.style.border = '';
                row.style.borderLeft = '';
                row.style.borderRadius = '';
                row.style.background = '';
                row.style.transition = '';
                row.style.transform = '';
                row.style.outline = '';
                row.style.outlineOffset = '';
                row.style.zIndex = '';
                row.style.position = '';
            });
        }
    }

    /**
     * Highlight search results
     */
    function highlightSearchResults(searchTerm) {
        const tbody = document.querySelector('.table tbody');
        if (!tbody) return;

        const rows = tbody.querySelectorAll('tr');
        let firstMatch = null;

        rows.forEach(row => {
            // Get row text content
            const rowText = row.textContent.toLowerCase();

            // Check if row matches search term
            if (rowText.includes(searchTerm)) {
                // Apply card hover design with proper spacing
                row.style.position = 'relative';
                row.style.boxShadow = '0 8px 24px rgba(22, 56, 86, 0.5), 0 4px 12px rgba(54, 145, 191, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.15)';
                row.style.outline = '2px solid rgba(54, 145, 191, 0.6)';
                row.style.outlineOffset = '2px';
                row.style.borderRadius = '10px';
                row.style.background = 'linear-gradient(135deg, rgba(54, 145, 191, 0.08) 0%, rgba(50, 85, 150, 0.08) 100%)';
                row.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
                row.style.zIndex = '10';

                // Store first match for scrolling
                if (!firstMatch) {
                    firstMatch = row;
                }
            }
        });

        // Scroll to first match
        if (firstMatch) {
            firstMatch.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }

    /**
     * Reset filters
     */
    function resetFilters() {
        document.querySelector('input[placeholder="Name or Trainee ID"]').value = '';
        document.querySelector('select').value = '';
        document.querySelectorAll('select')[1].value = '';
        document.querySelector('#registrationDateFilter').value = '';
        clearAllHighlights();
        renderRegistrations(registrations);
    }

    /**
     * Attach action listeners
     */
    function attachActionListeners() {
        // Status change
        document.querySelectorAll('.status-change').forEach(btn => {
            btn.addEventListener('click', async function () {
                const id = this.dataset.id;
                const status = this.dataset.status;
                await updateStatus(id, status);
            });
        });

        // View details
        document.querySelectorAll('.view-details').forEach(btn => {
            btn.addEventListener('click', function () {
                const id = this.dataset.id;
                viewDetails(id);
            });
        });

        // Edit details
        document.querySelectorAll('.edit-details').forEach(btn => {
            btn.addEventListener('click', function () {
                const id = this.dataset.id;
                editDetails(id);
            });
        });

        // Delete record
        document.querySelectorAll('.delete-record').forEach(btn => {
            btn.addEventListener('click', function () {
                const id = this.dataset.id;
                deleteRecord(id);
            });
        });
    }

    /**
     * Update registration status
     */
    async function updateStatus(id, status) {
        try {
            const response = await fetch(`${config.api.baseUrl}/api/v1/registrations/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ status })
            });

            const data = await response.json();

            if (data.success) {
                showSuccess('Status updated successfully');
                loadRegistrations();
            } else {
                showError('Failed to update status');
            }
        } catch (error) {
            console.error('Error updating status:', error);
            showError('Error updating status');
        }
    }

    /**
     * View registration details
     */
    function viewDetails(id) {
        const registration = registrations.find(r => r._id.$oid === id);
        if (!registration) {
            showError('Registration not found');
            return;
        }

        console.log('Registration data:', registration); // Debug log

        // T2MIS Auto Generated
        document.getElementById('viewUliNumber').textContent = registration.uliNumber || '-';
        document.getElementById('viewEntryDate').textContent = registration.entryDate || '-';

        // Populate view modal - Name
        document.getElementById('viewLastName').textContent = registration.lastName || '-';
        document.getElementById('viewFirstName').textContent = registration.firstName || '-';
        document.getElementById('viewMiddleName').textContent = registration.middleName || '-';

        // Address
        document.getElementById('viewStreet').textContent = registration.numberStreet || '-';
        document.getElementById('viewBarangay').textContent = registration.barangay || '-';
        document.getElementById('viewDistrict').textContent = registration.district || '-';
        document.getElementById('viewCity').textContent = registration.cityMunicipality || '-';
        document.getElementById('viewProvince').textContent = registration.province || '-';
        document.getElementById('viewRegion').textContent = registration.region || '-';

        // Contact
        document.getElementById('viewNationality').textContent = registration.nationality || '-';
        document.getElementById('viewEmail').textContent = registration.emailFacebook || '-';
        document.getElementById('viewContactNo').textContent = registration.contactNo || '-';

        // Personal Info
        document.getElementById('viewSex').textContent = registration.sex ? registration.sex.charAt(0).toUpperCase() + registration.sex.slice(1) : '-';
        document.getElementById('viewAge').textContent = registration.age || '-';
        document.getElementById('viewCivilStatus').textContent = registration.civilStatus ? registration.civilStatus.charAt(0).toUpperCase() + registration.civilStatus.slice(1) : '-';
        document.getElementById('viewEmploymentStatus').textContent = registration.employmentStatus || '-';
        document.getElementById('viewEmploymentType').textContent = registration.employmentType || '-';

        // Birth Info
        document.getElementById('viewBirthMonth').textContent = registration.birthMonth || '-';
        document.getElementById('viewBirthDay').textContent = registration.birthDay || '-';
        document.getElementById('viewBirthYear').textContent = registration.birthYear || '-';
        document.getElementById('viewBirthCity').textContent = registration.birthCity || '-';
        document.getElementById('viewBirthProvince').textContent = registration.birthProvince || '-';
        document.getElementById('viewBirthRegion').textContent = registration.birthRegion || '-';

        // Education
        document.getElementById('viewEducation').textContent = registration.education || '-';

        // Parent/Guardian
        document.getElementById('viewParentName').textContent = registration.parentName || '-';
        document.getElementById('viewParentAddress').textContent = registration.parentAddress || '-';

        // Client Classification - handle array properly (support both field names)
        let clientClass = '-';
        const clientClassData = registration.clientClassificationArray || registration.clientClassification;
        if (clientClassData && Array.isArray(clientClassData) && clientClassData.length > 0) {
            clientClass = clientClassData.map(item => {
                // Capitalize first letter and handle different formats
                const str = String(item).trim();
                return str.charAt(0).toUpperCase() + str.slice(1);
            }).join(', ');
        }
        console.log('Client Classification:', clientClass); // Debug log
        document.getElementById('viewClientClassification').textContent = clientClass;

        // Disability Type - handle array properly (support both field names)
        let disabilityType = '-';
        const disabilityTypeData = registration.disabilityTypeArray || registration.disabilityType;
        if (disabilityTypeData && Array.isArray(disabilityTypeData) && disabilityTypeData.length > 0) {
            disabilityType = disabilityTypeData.map(item => {
                // Capitalize first letter and handle different formats
                const str = String(item).trim();
                return str.charAt(0).toUpperCase() + str.slice(1);
            }).join(', ');
        }
        console.log('Disability Type:', disabilityType); // Debug log
        document.getElementById('viewDisabilityType').textContent = disabilityType;

        // Disability Cause - handle array properly (support both field names)
        let disabilityCause = '-';
        const disabilityCauseData = registration.disabilityCauseArray || registration.disabilityCause;
        if (disabilityCauseData && Array.isArray(disabilityCauseData) && disabilityCauseData.length > 0) {
            disabilityCause = disabilityCauseData.map(item => {
                // Capitalize first letter and handle different formats
                const str = String(item).trim();
                return str.charAt(0).toUpperCase() + str.slice(1);
            }).join(', ');
        }
        console.log('Disability Cause:', disabilityCause); // Debug log
        document.getElementById('viewDisabilityCause').textContent = disabilityCause;

        // Course Info
        document.getElementById('viewCourseQualification').textContent = registration.courseQualification || '-';
        document.getElementById('viewCourse').textContent = registration.selectedCourse || registration.courseQualification || '-';
        document.getElementById('viewScholarshipType').textContent = registration.scholarshipType || '-';
        document.getElementById('viewPrivacyConsent').textContent = registration.privacyConsent || '-';

        // Registration Info
        document.getElementById('viewTraineeId').textContent = registration.traineeId || '-';

        // Format status with badge
        const statusElement = document.getElementById('viewStatus');
        const statusBadge = getStatusBadge(registration.status);
        statusElement.innerHTML = statusBadge;

        document.getElementById('viewSubmittedAt').textContent = formatDate(registration.submittedAt) || '-';

        // Show modal
        const modal = new bootstrap.Modal(document.getElementById('viewDetailsModal'));
        modal.show();
    }

    /**
     * Edit registration details
     */
    async function editDetails(id) {
        const registration = registrations.find(r => r._id.$oid === id);
        if (!registration) {
            showError('Registration not found');
            return;
        }

        // Store original data for change detection
        window.originalRegistrationData = {
            uliNumber: registration.uliNumber || '',
            entryDate: registration.entryDate || '',
            firstName: registration.firstName || '',
            middleName: registration.middleName || '',
            lastName: registration.lastName || '',
            numberStreet: registration.numberStreet || '',
            barangay: registration.barangay || '',
            district: registration.district || '',
            cityMunicipality: registration.cityMunicipality || '',
            province: registration.province || '',
            region: registration.region || '',
            emailFacebook: registration.emailFacebook || '',
            contactNo: registration.contactNo || '',
            nationality: registration.nationality || '',
            sex: registration.sex || '',
            civilStatus: registration.civilStatus || '',
            age: registration.age || '',
            employmentStatus: registration.employmentStatus || '',
            employmentType: registration.employmentType || '',
            birthMonth: registration.birthMonth || '',
            birthDay: registration.birthDay || '',
            birthYear: registration.birthYear || '',
            birthCity: registration.birthCity || '',
            birthProvince: registration.birthProvince || '',
            birthRegion: registration.birthRegion || '',
            education: registration.education || '',
            parentName: registration.parentName || '',
            parentAddress: registration.parentAddress || '',
            clientClassificationArray: (registration.clientClassificationArray || []).join(', '),
            disabilityTypeArray: (registration.disabilityTypeArray || []).join(', '),
            disabilityCauseArray: (registration.disabilityCauseArray || []).join(', '),
            courseQualification: registration.courseQualification || '',
            selectedCourse: registration.selectedCourse || '',
            scholarshipType: registration.scholarshipType || '',
            privacyConsent: registration.privacyConsent || '',
            traineeId: registration.traineeId || '',
            status: registration.status || ''
        };

        // Populate edit modal with registration data
        document.getElementById('editRegistrationId').value = id;

        // T2MIS Auto Generated
        document.getElementById('editUliNumber').value = registration.uliNumber || '';
        document.getElementById('editEntryDate').value = registration.entryDate || '';

        // Name
        document.getElementById('editFirstName').value = registration.firstName || '';
        document.getElementById('editMiddleName').value = registration.middleName || '';
        document.getElementById('editLastName').value = registration.lastName || '';

        // Address
        document.getElementById('editStreet').value = registration.numberStreet || '';
        document.getElementById('editBarangay').value = registration.barangay || '';
        document.getElementById('editDistrict').value = registration.district || '';
        document.getElementById('editCity').value = registration.cityMunicipality || '';
        document.getElementById('editProvince').value = registration.province || '';
        document.getElementById('editRegion').value = registration.region || '';

        // Contact
        document.getElementById('editEmail').value = registration.emailFacebook || '';
        document.getElementById('editContactNo').value = registration.contactNo || '';
        document.getElementById('editNationality').value = registration.nationality || '';

        // Personal Info
        document.getElementById('editSex').value = registration.sex || '';
        document.getElementById('editCivilStatus').value = registration.civilStatus || '';
        document.getElementById('editAge').value = registration.age || '';
        document.getElementById('editEmploymentStatus').value = registration.employmentStatus || '';
        document.getElementById('editEmploymentType').value = registration.employmentType || '';

        // Birth Info
        document.getElementById('editBirthMonth').value = registration.birthMonth || '';
        document.getElementById('editBirthDay').value = registration.birthDay || '';
        document.getElementById('editBirthYear').value = registration.birthYear || '';
        document.getElementById('editBirthCity').value = registration.birthCity || '';
        document.getElementById('editBirthProvince').value = registration.birthProvince || '';
        document.getElementById('editBirthRegion').value = registration.birthRegion || '';

        // Education
        document.getElementById('editEducation').value = registration.education || '';

        // Parent/Guardian
        document.getElementById('editParentName').value = registration.parentName || '';
        document.getElementById('editParentAddress').value = registration.parentAddress || '';

        // Client Classification - handle array
        let clientClassValue = '';
        if (registration.clientClassificationArray && Array.isArray(registration.clientClassificationArray)) {
            clientClassValue = registration.clientClassificationArray.join(', ');
        } else if (registration.clientClassification) {
            // Fallback for non-array format
            if (Array.isArray(registration.clientClassification)) {
                clientClassValue = registration.clientClassification.join(', ');
            } else if (typeof registration.clientClassification === 'string') {
                clientClassValue = registration.clientClassification;
            }
        }
        document.getElementById('editClientClassification').value = clientClassValue;

        // Disability Type - handle array and set select value
        let disabilityTypeValue = '';
        if (registration.disabilityTypeArray && Array.isArray(registration.disabilityTypeArray) && registration.disabilityTypeArray.length > 0) {
            disabilityTypeValue = registration.disabilityTypeArray[0];
        } else if (registration.disabilityType) {
            // Fallback for non-array format
            if (Array.isArray(registration.disabilityType) && registration.disabilityType.length > 0) {
                disabilityTypeValue = registration.disabilityType[0];
            } else if (typeof registration.disabilityType === 'string') {
                disabilityTypeValue = registration.disabilityType;
            }
        }
        document.getElementById('editDisabilityType').value = disabilityTypeValue;

        // Disability Cause - handle array and set select value
        let disabilityCauseValue = '';
        if (registration.disabilityCauseArray && Array.isArray(registration.disabilityCauseArray) && registration.disabilityCauseArray.length > 0) {
            disabilityCauseValue = registration.disabilityCauseArray[0];
        } else if (registration.disabilityCause) {
            // Fallback for non-array format
            if (Array.isArray(registration.disabilityCause) && registration.disabilityCause.length > 0) {
                disabilityCauseValue = registration.disabilityCause[0];
            } else if (typeof registration.disabilityCause === 'string') {
                disabilityCauseValue = registration.disabilityCause;
            }
        }
        document.getElementById('editDisabilityCause').value = disabilityCauseValue;

        // Course Info
        document.getElementById('editCourseQualification').value = registration.courseQualification || '';
        document.getElementById('editScholarshipType').value = registration.scholarshipType || '';
        document.getElementById('editPrivacyConsent').value = registration.privacyConsent || '';

        // Registration Info
        document.getElementById('editTraineeId').value = registration.traineeId || '';
        document.getElementById('editStatus').value = registration.status || '';

        // Load courses and set selected course
        await loadCoursesForEditModal();
        const editCourseSelect = document.getElementById('editCourse');
        if (editCourseSelect) {
            editCourseSelect.value = registration.selectedCourse || registration.courseQualification || '';
        }

        // Show modal
        const modal = new bootstrap.Modal(document.getElementById('editRegistrationModal'));
        modal.show();
    }

    /**
     * Load courses for edit modal dropdown
     */
    async function loadCoursesForEditModal() {
        const dropdown = document.getElementById('editCourse');
        if (!dropdown) return;

        try {
            const response = await fetch(`${config.api.baseUrl}/api/v1/courses`);
            const result = await response.json();

            if (result.success && result.data && result.data.length > 0) {
                dropdown.innerHTML = '<option value="">Select a course...</option>';

                result.data.forEach(course => {
                    const option = document.createElement('option');
                    option.value = course.title || 'Untitled Course';
                    option.dataset.courseId = course._id?.$oid || course._id || '';
                    option.textContent = `${course.title || 'Untitled Course'} (${course.badge || course.course_code || ''})`;
                    dropdown.appendChild(option);
                });
            } else {
                dropdown.innerHTML = '<option value="">No courses available</option>';
            }
        } catch (error) {
            console.error('Error loading courses:', error);
            dropdown.innerHTML = '<option value="">Error loading courses</option>';
        }
    }

    /**
     * Save edited registration
     */
    async function saveEditedRegistration() {
        const form = document.getElementById('editRegistrationForm');

        // Custom validation with toast notifications
        // Validate age field
        const ageElement = document.getElementById('editAge');
        const ageValue = parseInt(ageElement.value);
        if (ageValue && (ageValue < 1 || ageValue > 120)) {
            showError('Age must be between 1 and 120');
            ageElement.focus();
            return;
        }

        // Validate birth month
        const birthMonth = parseInt(document.getElementById('editBirthMonth').value);
        if (birthMonth && (birthMonth < 1 || birthMonth > 12)) {
            showError('Birth month must be between 1 and 12');
            document.getElementById('editBirthMonth').focus();
            return;
        }

        // Validate birth day
        const birthDay = parseInt(document.getElementById('editBirthDay').value);
        if (birthDay && (birthDay < 1 || birthDay > 31)) {
            showError('Birth day must be between 1 and 31');
            document.getElementById('editBirthDay').focus();
            return;
        }

        const id = document.getElementById('editRegistrationId').value;
        const courseSelect = document.getElementById('editCourse');
        const selectedOption = courseSelect.options[courseSelect.selectedIndex];

        // Parse client classification array
        const clientClassText = document.getElementById('editClientClassification').value.trim();
        const clientClassArray = clientClassText ? clientClassText.split(',').map(item => item.trim()).filter(item => item) : [];

        // Get disability type value from select dropdown
        const disabilityTypeValue = document.getElementById('editDisabilityType').value.trim();
        const disabilityTypeArray = disabilityTypeValue ? [disabilityTypeValue] : [];

        // Get disability cause value from select dropdown
        const disabilityCauseValue = document.getElementById('editDisabilityCause').value.trim();
        const disabilityCauseArray = disabilityCauseValue ? [disabilityCauseValue] : [];

        // Check for changes
        if (window.originalRegistrationData) {
            const currentData = {
                uliNumber: document.getElementById('editUliNumber').value.trim(),
                entryDate: document.getElementById('editEntryDate').value,
                firstName: document.getElementById('editFirstName').value.trim(),
                middleName: document.getElementById('editMiddleName').value.trim(),
                lastName: document.getElementById('editLastName').value.trim(),
                numberStreet: document.getElementById('editStreet').value.trim(),
                barangay: document.getElementById('editBarangay').value.trim(),
                district: document.getElementById('editDistrict').value.trim(),
                cityMunicipality: document.getElementById('editCity').value.trim(),
                province: document.getElementById('editProvince').value.trim(),
                region: document.getElementById('editRegion').value.trim(),
                emailFacebook: document.getElementById('editEmail').value.trim(),
                contactNo: document.getElementById('editContactNo').value.trim(),
                nationality: document.getElementById('editNationality').value.trim(),
                sex: document.getElementById('editSex').value,
                civilStatus: document.getElementById('editCivilStatus').value,
                age: document.getElementById('editAge').value,
                employmentStatus: document.getElementById('editEmploymentStatus').value,
                employmentType: document.getElementById('editEmploymentType').value,
                birthMonth: document.getElementById('editBirthMonth').value,
                birthDay: document.getElementById('editBirthDay').value,
                birthYear: document.getElementById('editBirthYear').value,
                birthCity: document.getElementById('editBirthCity').value.trim(),
                birthProvince: document.getElementById('editBirthProvince').value.trim(),
                birthRegion: document.getElementById('editBirthRegion').value.trim(),
                education: document.getElementById('editEducation').value,
                parentName: document.getElementById('editParentName').value.trim(),
                parentAddress: document.getElementById('editParentAddress').value.trim(),
                clientClassificationArray: clientClassArray.join(', '),
                disabilityTypeArray: disabilityTypeArray.join(', '),
                disabilityCauseArray: disabilityCauseArray.join(', '),
                courseQualification: document.getElementById('editCourseQualification').value.trim(),
                selectedCourse: courseSelect.value,
                scholarshipType: document.getElementById('editScholarshipType').value,
                privacyConsent: document.getElementById('editPrivacyConsent').value,
                traineeId: document.getElementById('editTraineeId').value.trim(),
                status: document.getElementById('editStatus').value
            };

            // Compare with original data
            let hasChanges = false;
            for (const key in currentData) {
                if (String(currentData[key]) !== String(window.originalRegistrationData[key])) {
                    hasChanges = true;
                    break;
                }
            }

            if (!hasChanges) {
                showToast('No changes were made to the registration', 'info');
                return;
            }
        }

        const updatedData = {
            // T2MIS Auto Generated
            uliNumber: document.getElementById('editUliNumber').value.trim(),
            entryDate: document.getElementById('editEntryDate').value,

            // Name
            firstName: document.getElementById('editFirstName').value.trim(),
            middleName: document.getElementById('editMiddleName').value.trim(),
            lastName: document.getElementById('editLastName').value.trim(),

            // Address
            numberStreet: document.getElementById('editStreet').value.trim(),
            barangay: document.getElementById('editBarangay').value.trim(),
            district: document.getElementById('editDistrict').value.trim(),
            cityMunicipality: document.getElementById('editCity').value.trim(),
            province: document.getElementById('editProvince').value.trim(),
            region: document.getElementById('editRegion').value.trim(),

            // Contact
            emailFacebook: document.getElementById('editEmail').value.trim(),
            contactNo: document.getElementById('editContactNo').value.trim(),
            nationality: document.getElementById('editNationality').value.trim(),

            // Personal Info
            sex: document.getElementById('editSex').value,
            civilStatus: document.getElementById('editCivilStatus').value,
            age: parseInt(document.getElementById('editAge').value),
            employmentStatus: document.getElementById('editEmploymentStatus').value,
            employmentType: document.getElementById('editEmploymentType').value,

            // Birth Info
            birthMonth: document.getElementById('editBirthMonth').value,
            birthDay: document.getElementById('editBirthDay').value,
            birthYear: document.getElementById('editBirthYear').value,
            birthCity: document.getElementById('editBirthCity').value.trim(),
            birthProvince: document.getElementById('editBirthProvince').value.trim(),
            birthRegion: document.getElementById('editBirthRegion').value.trim(),

            // Education
            education: document.getElementById('editEducation').value,

            // Parent/Guardian
            parentName: document.getElementById('editParentName').value.trim(),
            parentAddress: document.getElementById('editParentAddress').value.trim(),

            // Client Classification
            clientClassificationArray: clientClassArray,

            // Disability Info
            disabilityTypeArray: disabilityTypeArray,
            disabilityCauseArray: disabilityCauseArray,

            // Course Info
            courseQualification: document.getElementById('editCourseQualification').value.trim(),
            selectedCourse: courseSelect.value,
            selectedCourseId: selectedOption.dataset.courseId || '',
            scholarshipType: document.getElementById('editScholarshipType').value,
            privacyConsent: document.getElementById('editPrivacyConsent').value,

            // Registration Info
            traineeId: document.getElementById('editTraineeId').value.trim(),
            status: document.getElementById('editStatus').value
        };

        try {
            const response = await fetch(`${config.api.baseUrl}/api/v1/registrations/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(updatedData)
            });

            const result = await response.json();

            if (result.success) {
                showSuccess('Registration updated successfully');

                // Close modal
                const modal = bootstrap.Modal.getInstance(document.getElementById('editRegistrationModal'));
                if (modal) {
                    modal.hide();
                }

                // Reload registrations
                loadRegistrations();
            } else {
                throw new Error(result.message || 'Failed to update registration');
            }
        } catch (error) {
            console.error('Error updating registration:', error);
            showError('Failed to update registration: ' + error.message);
        }
    }

    /**
     * Delete registration record
     */
    async function deleteRecord(id) {
        if (!confirm('Are you sure you want to delete this registration record?')) {
            return;
        }

        try {
            const response = await fetch(`${config.api.baseUrl}/api/v1/registrations/${id}`, {
                method: 'DELETE'
            });

            const data = await response.json();

            if (data.success) {
                showSuccess('Record deleted successfully');
                loadRegistrations();
            } else {
                showError('Failed to delete record');
            }
        } catch (error) {
            console.error('Error deleting record:', error);
            showError('Error deleting record');
        }
    }

    /**
     * Utility: Debounce function
     */
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    /**
     * Show success message
     */
    function showSuccess(message) {
        showToast(message, 'success');
    }

    /**
     * Show error message
     */
    function showError(message) {
        showToast(message, 'error');
    }

    /**
     * Show toast notification
     */
    function showToast(message, type = 'success') {
        const container = document.getElementById('toastContainer');
        if (!container) return;

        const toast = document.createElement('div');
        toast.className = `toast-notification ${type}`;

        const icon = type === 'success' ? 'bx-check' :
            type === 'error' ? 'bx-x' :
                type === 'warning' ? 'bx-error-alt' : 'bxs-info-circle';

        toast.innerHTML = `
            <i class="bx ${icon} toast-icon"></i>
            <div class="toast-content">
                <div class="toast-message">${message}</div>
            </div>
        `;

        container.appendChild(toast);

        // Auto remove after 5 seconds
        setTimeout(() => {
            toast.classList.add('hiding');
            setTimeout(() => toast.remove(), 300);
        }, 5000);
    }

    /**
     * Close toast notification
     */
    function closeToast(button) {
        const toast = button.closest('.toast-notification');
        if (toast) {
            toast.classList.add('hiding');
            setTimeout(() => {
                toast.remove();
            }, 300);
        }
    }

    /**
     * Export to CSV
     */
    function exportToCSV() {
        try {
            if (!registrations || registrations.length === 0) {
                showError('No data to export');
                return;
            }

            // Prepare CSV headers
            const headers = ['Name', 'Trainee ID', 'Course', 'Date', 'Status', 'Contact', 'Email'];

            // Prepare CSV rows
            const rows = registrations.map(registration => {
                const fullName = registration.traineeFullName ||
                    `${registration.firstName} ${registration.middleName || ''} ${registration.lastName}`.trim();
                const traineeId = registration.traineeId || 'N/A';
                const course = registration.selectedCourse || registration.courseQualification || 'N/A';
                const date = formatDate(registration.submittedAt);
                const status = registration.status || 'N/A';
                const contact = registration.contactNo || 'N/A';
                const email = registration.emailFacebook || 'N/A';

                return [
                    `"${fullName}"`,
                    `"${traineeId}"`,
                    `"${course}"`,
                    `"${date}"`,
                    `"${status}"`,
                    `"${contact}"`,
                    `"${email}"`
                ].join(',');
            });

            // Combine headers and rows
            const csv = [headers.join(','), ...rows].join('\n');

            // Create blob and download
            const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
            const link = document.createElement('a');
            const url = URL.createObjectURL(blob);

            link.setAttribute('href', url);
            link.setAttribute('download', `registrations_${new Date().toISOString().split('T')[0]}.csv`);
            link.style.visibility = 'hidden';

            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            showSuccess('CSV exported successfully');
        } catch (error) {
            console.error('Export CSV error:', error);
            showError('Failed to export CSV');
        }
    }

    /**
     * Export to JSON
     */
    function exportToJSON() {
        try {
            if (!registrations || registrations.length === 0) {
                showError('No data to export');
                return;
            }

            // Prepare JSON data
            const jsonData = registrations.map(registration => ({
                name: registration.traineeFullName ||
                    `${registration.firstName} ${registration.middleName || ''} ${registration.lastName}`.trim(),
                traineeId: registration.traineeId || 'N/A',
                course: registration.selectedCourse || registration.courseQualification || 'N/A',
                date: formatDate(registration.submittedAt),
                status: registration.status || 'N/A',
                contact: registration.contactNo || 'N/A',
                email: registration.emailFacebook || 'N/A',
                fullData: registration
            }));

            // Create blob and download
            const blob = new Blob([JSON.stringify(jsonData, null, 2)], { type: 'application/json' });
            const link = document.createElement('a');
            const url = URL.createObjectURL(blob);

            link.setAttribute('href', url);
            link.setAttribute('download', `registrations_${new Date().toISOString().split('T')[0]}.json`);
            link.style.visibility = 'hidden';

            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            showSuccess('JSON exported successfully');
        } catch (error) {
            console.error('Export JSON error:', error);
            showError('Failed to export JSON');
        }
    }

    /**
     * Open add registration modal
     */
    async function openAddRegistrationModal() {
        // Load courses for the dropdown
        await loadCoursesForModal();

        // Show modal
        const modal = new bootstrap.Modal(document.getElementById('addRegistrationModal'));
        modal.show();
    }

    /**
     * Load courses for modal dropdown
     */
    async function loadCoursesForModal() {
        const dropdown = document.getElementById('addCourse');
        if (!dropdown) return;

        try {
            const response = await fetch(`${config.api.baseUrl}/api/v1/courses`);
            const result = await response.json();

            if (result.success && result.data && result.data.length > 0) {
                dropdown.innerHTML = '<option value="">Select a course...</option>';

                result.data.forEach(course => {
                    const option = document.createElement('option');
                    option.value = course.title || 'Untitled Course';
                    option.dataset.courseId = course._id?.$oid || course._id || '';
                    option.textContent = `${course.title || 'Untitled Course'} (${course.badge || course.course_code || ''})`;
                    dropdown.appendChild(option);
                });
            } else {
                dropdown.innerHTML = '<option value="">No courses available</option>';
            }
        } catch (error) {
            console.error('Error loading courses:', error);
            dropdown.innerHTML = '<option value="">Error loading courses</option>';
        }
    }

    /**
     * Save new registration
     */
    async function saveNewRegistration() {
        const form = document.getElementById('addRegistrationForm');

        // Custom validation with toast notifications
        const requiredFields = [
            { id: 'addFirstName', label: 'First Name' },
            { id: 'addStreet', label: 'Number, Street' },
            { id: 'addBarangay', label: 'Barangay' },
            { id: 'addDistrict', label: 'District' },
            { id: 'addCity', label: 'City/Municipality' },
            { id: 'addProvince', label: 'Province' },
            { id: 'addRegion', label: 'Region' },
            { id: 'addEmail', label: 'Email/Facebook' },
            { id: 'addContactNo', label: 'Contact Number' },
            { id: 'addNationality', label: 'Nationality' },
            { id: 'addSex', label: 'Sex' },
            { id: 'addCivilStatus', label: 'Civil Status' },
            { id: 'addBirthMonth', label: 'Birth Month' },
            { id: 'addBirthDay', label: 'Birth Day' },
            { id: 'addBirthYear', label: 'Birth Year' },
            { id: 'addEducation', label: 'Educational Attainment' },
            { id: 'addCourse', label: 'Course' }
        ];

        // Validate required fields
        for (const field of requiredFields) {
            const element = document.getElementById(field.id);
            if (!element.value || element.value.trim() === '') {
                showError(`Please fill out the ${field.label} field`);
                element.focus();
                return;
            }
        }

        // Validate age field
        const ageElement = document.getElementById('addAge');
        const ageValue = parseInt(ageElement.value);
        if (ageValue && (ageValue < 1 || ageValue > 120)) {
            showError('Age must be between 1 and 120');
            ageElement.focus();
            return;
        }

        // Validate birth month
        const birthMonth = parseInt(document.getElementById('addBirthMonth').value);
        if (birthMonth && (birthMonth < 1 || birthMonth > 12)) {
            showError('Birth month must be between 1 and 12');
            document.getElementById('addBirthMonth').focus();
            return;
        }

        // Validate birth day
        const birthDay = parseInt(document.getElementById('addBirthDay').value);
        if (birthDay && (birthDay < 1 || birthDay > 31)) {
            showError('Birth day must be between 1 and 31');
            document.getElementById('addBirthDay').focus();
            return;
        }

        const courseSelect = document.getElementById('addCourse');
        const selectedOption = courseSelect.options[courseSelect.selectedIndex];

        const registrationData = {
            uliNumber: document.getElementById('addUliNumber')?.value.trim() || '',
            entryDate: document.getElementById('addEntryDate')?.value || '',
            firstName: document.getElementById('addFirstName').value.trim(),
            middleName: document.getElementById('addMiddleName').value.trim(),
            lastName: document.getElementById('addLastName').value.trim(),
            emailFacebook: document.getElementById('addEmail').value.trim(),
            contactNo: document.getElementById('addContactNo').value.trim(),
            nationality: document.getElementById('addNationality').value.trim(),
            numberStreet: document.getElementById('addStreet').value.trim(),
            barangay: document.getElementById('addBarangay').value.trim(),
            district: document.getElementById('addDistrict').value.trim(),
            cityMunicipality: document.getElementById('addCity').value.trim(),
            province: document.getElementById('addProvince').value.trim(),
            region: document.getElementById('addRegion').value.trim(),
            sex: document.getElementById('addSex').value,
            age: parseInt(document.getElementById('addAge')?.value || 0),
            civilStatus: document.getElementById('addCivilStatus').value,
            employmentType: document.getElementById('addEmploymentType')?.value || '',
            employmentStatus: document.getElementById('addEmploymentStatus')?.value || '',
            birthMonth: document.getElementById('addBirthMonth').value,
            birthDay: document.getElementById('addBirthDay').value,
            birthYear: document.getElementById('addBirthYear').value,
            birthCity: document.getElementById('addBirthCity')?.value || '',
            birthProvince: document.getElementById('addBirthProvince')?.value || '',
            birthRegion: document.getElementById('addBirthRegion')?.value || '',
            education: document.getElementById('addEducation').value,
            parentName: document.getElementById('addParentName')?.value.trim() || '',
            parentAddress: document.getElementById('addParentAddress')?.value.trim() || '',
            clientClassification: document.getElementById('addClientClassification')?.value.trim() || '',
            disabilityType: document.getElementById('addDisabilityType')?.value.trim() || '',
            disabilityCause: document.getElementById('addDisabilityCause')?.value.trim() || '',
            courseQualification: document.getElementById('addCourseQualification')?.value.trim() || '',
            selectedCourse: courseSelect.value,
            selectedCourseId: selectedOption.dataset.courseId || '',
            scholarshipType: document.getElementById('addScholarshipType')?.value || '',
            privacyConsent: document.getElementById('addPrivacyConsent')?.value || '',
            traineeId: document.getElementById('addTraineeId')?.value.trim() || '',
            status: document.getElementById('addStatus').value,
            submittedAt: new Date().toISOString()
        };

        try {
            const response = await fetch(`${config.api.baseUrl}/api/v1/registrations`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(registrationData)
            });

            const result = await response.json();

            if (result.success) {
                showSuccess('Registration added successfully');

                // Close modal
                const modal = bootstrap.Modal.getInstance(document.getElementById('addRegistrationModal'));
                if (modal) {
                    modal.hide();
                }

                // Reset form
                form.reset();

                // Reload registrations
                loadRegistrations();
            } else {
                throw new Error(result.message || 'Failed to add registration');
            }
        } catch (error) {
            console.error('Error adding registration:', error);
            showError('Failed to add registration: ' + error.message);
        }
    }

})();