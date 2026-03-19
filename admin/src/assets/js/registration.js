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
            const fullName = `${registration.firstName} ${registration.middleName || ''} ${registration.lastName}`.trim();
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
            const date = new Date(dateString.$date || dateString);
            return date.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            });
        } catch (error) {
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
                const total = all.length;
                const approved = all.filter(r => r.status === 'approved').length;
                const pending = all.filter(r => r.status === 'pending').length;
                const cancelled = all.filter(r => r.status === 'cancelled').length;

                // Update cards (if they exist)
                updateStatCard(0, total);
                updateStatCard(2, approved);
                updateStatCard(3, pending);
                updateStatCard(4, cancelled);
            }
        } catch (error) {
            console.error('Error updating statistics:', error);
        }
    }

    /**
     * Update individual stat card
     */
    function updateStatCard(index, value) {
        const cards = document.querySelectorAll('.card-body h3');
        if (cards[index]) {
            cards[index].textContent = value.toLocaleString();
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
    }

    /**
     * Apply filters
     */
    function applyFilters() {
        const searchValue = document.querySelector('input[placeholder="Name or Trainee ID"]')?.value.toLowerCase();
        const statusValue = document.querySelector('select')?.value;
        const courseValue = document.querySelectorAll('select')[1]?.value;
        const dateValue = document.querySelector('#registrationDateFilter')?.value;

        let filtered = [...registrations];

        if (searchValue) {
            filtered = filtered.filter(r => {
                const fullName = `${r.firstName} ${r.middleName || ''} ${r.lastName}`.toLowerCase();
                const traineeId = (r.traineeId || '').toLowerCase();
                return fullName.includes(searchValue) || traineeId.includes(searchValue);
            });
        }

        if (statusValue) {
            filtered = filtered.filter(r => r.status === statusValue);
        }

        if (courseValue) {
            filtered = filtered.filter(r => {
                const course = (r.selectedCourse || r.courseQualification || '').toLowerCase();
                return course.includes(courseValue.toLowerCase());
            });
        }

        if (dateValue) {
            filtered = filtered.filter(r => {
                const regDate = new Date(r.submittedAt.$date || r.submittedAt);
                const filterDate = new Date(dateValue);
                return regDate.toDateString() === filterDate.toDateString();
            });
        }

        renderRegistrations(filtered);
    }

    /**
     * Reset filters
     */
    function resetFilters() {
        document.querySelector('input[placeholder="Name or Trainee ID"]').value = '';
        document.querySelector('select').value = '';
        document.querySelectorAll('select')[1].value = '';
        document.querySelector('#registrationDateFilter').value = '';
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
        if (registration) {
            console.log('View details:', registration);
            // TODO: Implement modal to show details
            alert('View details feature - Coming soon!');
        }
    }

    /**
     * Edit registration details
     */
    function editDetails(id) {
        const registration = registrations.find(r => r._id.$oid === id);
        if (registration) {
            console.log('Edit details:', registration);
            // TODO: Implement modal to edit details
            alert('Edit details feature - Coming soon!');
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
        // TODO: Implement toast notification
        console.log('Success:', message);
        alert(message);
    }

    /**
     * Show error message
     */
    function showError(message) {
        // TODO: Implement toast notification
        console.error('Error:', message);
        alert(message);
    }

})();
