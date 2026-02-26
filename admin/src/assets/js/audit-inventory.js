/* Audit Inventory Page Script */

// API Configuration
const API_BASE_URL = window.location.origin.includes('localhost')
    ? 'http://localhost/CAATE-ITRMS/backend/public'
    : '/CAATE-ITRMS/backend/public';

// Store current row for modal operations
let currentRow = null;
let inventoryData = [];

// Prevent aria-hidden focus warnings by managing modal focus properly
document.addEventListener('DOMContentLoaded', function () {
    // Load filter options first
    // loadFilterOptions(); // Commented out - using static HTML options instead

    // Load inventory data
    loadInventoryData();

    // Handle modal shown events to prevent aria-hidden warnings
    const modals = ['addInventoryModal', 'editEquipmentModal', 'viewEquipmentModal', 'deleteEquipmentModal'];
    modals.forEach(modalId => {
        const modalEl = document.getElementById(modalId);
        if (modalEl) {
            modalEl.addEventListener('shown.bs.modal', function () {
                this.removeAttribute('aria-hidden');
            });
            modalEl.addEventListener('hidden.bs.modal', function () {
                // Don't add aria-hidden back - let Bootstrap handle it naturally
            });
        }
    });

    // Handle Add Inventory Button Click
    const addInventoryBtn = document.getElementById('addInventoryBtn');
    if (addInventoryBtn) {
        addInventoryBtn.addEventListener('click', function () {
            // Reset form
            document.getElementById('addInventoryForm').reset();
            // Open modal
            const modal = new bootstrap.Modal(document.getElementById('addInventoryModal'));
            modal.show();
        });
    }

    // Handle Save Inventory Button Click
    const saveInventoryBtn = document.getElementById('saveInventoryBtn');
    if (saveInventoryBtn) {
        saveInventoryBtn.addEventListener('click', function () {
            saveNewInventoryItem();
        });
    }

    // Handle Inventory Type Filter Change
    const inventoryTypeFilter = document.getElementById('inventoryTypeFilter');
    const inventoryListTitle = document.getElementById('inventoryListTitle');
    const addInventoryText = document.getElementById('addInventoryText');

    if (inventoryTypeFilter && inventoryListTitle && addInventoryText) {
        inventoryTypeFilter.addEventListener('change', function () {
            const selectedType = this.value;

            switch (selectedType) {
                case 'equipment':
                    inventoryListTitle.textContent = 'List of Equipments';
                    addInventoryText.textContent = 'Add Item';
                    break;
                case 'tools':
                    inventoryListTitle.textContent = 'List of Tools';
                    addInventoryText.textContent = 'Add Tool';
                    break;
                case 'consumables':
                    inventoryListTitle.textContent = 'List of Consumables/Materials';
                    addInventoryText.textContent = 'Add Consumable/Material';
                    break;
                default:
                    inventoryListTitle.textContent = 'List of Equipments';
                    addInventoryText.textContent = 'Add Item';
                    break;
            }

            applyFilters();
        });
    }

    // Handle Programs Filter Change
    const programsFilter = document.getElementById('programsFilter');
    if (programsFilter) {
        programsFilter.addEventListener('change', function () {
            applyFilters();
        });
    }

    // Handle Stock Status Filter Change
    const stockStatusFilter = document.getElementById('stockStatusFilter');
    if (stockStatusFilter) {
        stockStatusFilter.addEventListener('change', function () {
            applyFilters();
        });
    }

    // Handle search input with highlighting
    const searchInput = document.getElementById('filterSearchInput');
    if (searchInput) {
        searchInput.addEventListener('input', function () {
            applyFilters();
        });
    }

    // Handle Reset Button
    const resetButton = document.getElementById('resetFiltersBtn');
    if (resetButton) {
        resetButton.addEventListener('click', function () {
            // Reset all filters
            if (inventoryTypeFilter) inventoryTypeFilter.value = '';
            if (programsFilter) programsFilter.value = '';
            if (stockStatusFilter) stockStatusFilter.value = '';
            if (searchInput) searchInput.value = '';

            // Reset title
            if (inventoryListTitle) inventoryListTitle.textContent = 'List of Equipments';
            if (addInventoryText) addInventoryText.textContent = 'Add Item';

            // Clear highlights and reload data
            clearAllHighlights();
            loadInventoryData();
        });
    }
});

// Apply all filters together
function applyFilters() {
    const inventoryTypeFilter = document.getElementById('inventoryTypeFilter');
    const programsFilter = document.getElementById('programsFilter');
    const stockStatusFilter = document.getElementById('stockStatusFilter');
    const searchInput = document.getElementById('filterSearchInput');

    // Get filter values
    const selectedType = inventoryTypeFilter ? inventoryTypeFilter.value : '';
    const selectedProgram = programsFilter ? programsFilter.value : '';
    const selectedStatus = stockStatusFilter ? stockStatusFilter.value : '';
    const searchTerm = searchInput ? searchInput.value.toLowerCase().trim() : '';

    // Filter the data
    let filteredData = inventoryData.filter(item => {
        // Filter by inventory type
        if (selectedType && item.inventory_type !== selectedType) {
            return false;
        }

        // Filter by program
        if (selectedProgram && item.program !== selectedProgram) {
            return false;
        }

        // Filter by stock status
        if (selectedStatus && item.stock_status !== selectedStatus) {
            return false;
        }

        return true;
    });

    // Render filtered data
    renderInventoryTable(filteredData);

    // Apply search highlighting if search term exists
    if (searchTerm) {
        setTimeout(() => {
            clearAllHighlights();
            highlightSearchResults(searchTerm);
        }, 50);
    } else {
        clearAllHighlights();
    }
}

// Helper function to clear all row highlights
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

// Highlight search results without hiding other rows
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

// Load filter options from API - DISABLED: Using static HTML options instead
// async function loadFilterOptions() {
//     try {
//         const response = await fetch(`${API_BASE_URL}/api/v1/inventory/filter-options?collection=audit-inventory`);
//         const result = await response.json();
//         if (result.success) {
//             const { programs, stock_statuses } = result.data;
//             // Populate filters dynamically
//         }
//     } catch (error) {
//         console.error('Error loading filter options:', error);
//     }
// }

// Load inventory data from API
async function loadInventoryData() {
    // Show loader before fetching data
    showTableLoader();

    try {
        let url = `${API_BASE_URL}/api/v1/inventory?collection=audit-inventory`;

        const response = await fetch(url);
        const result = await response.json();

        if (result.success) {
            inventoryData = result.data;
            applyFilters();
            updateStatistics();
        } else {
            showToast('Failed to load inventory data', 'error');
        }
    } catch (error) {
        showToast('Error connecting to server', 'error');
    }
}

// Show loader in table
function showTableLoader() {
    const tbody = document.querySelector('.table tbody');
    if (!tbody) return;

    tbody.innerHTML = `
        <tr>
            <td colspan="8" class="text-center" style="padding: 60px 20px;">
                <div class="spinner-border text-primary" role="status" style="width: 3rem; height: 3rem;">
                    <span class="visually-hidden">Loading...</span>
                </div>
                <p class="mt-3 text-muted">Loading inventory data...</p>
            </td>
        </tr>
    `;
}

// Render inventory table
function renderInventoryTable(data) {
    const tbody = document.querySelector('.table tbody');
    if (!tbody) return;

    // Hide loader
    const loader = document.getElementById('tableLoader');
    if (loader) {
        loader.remove();
    }

    if (data.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="8" class="text-center" style="padding: 60px 20px;">
                    <div style="color: #697a8d;">
                        <i class="bx bx-package" style="font-size: 4rem; opacity: 0.3; display: block; margin-bottom: 15px;"></i>
                        <h5 style="margin-bottom: 10px; color: #697a8d;">No inventory items found</h5>
                        <p style="margin: 0; font-size: 0.9rem; opacity: 0.7;">The inventory database collection is empty or no items match your filters.</p>
                        <p style="margin: 5px 0 0 0; font-size: 0.9rem; opacity: 0.7;">Try adjusting your filters or click "Add Equipment" to create your first item.</p>
                    </div>
                </td>
            </tr>
        `;
        return;
    }

    tbody.innerHTML = data.map(item => {
        const stockBadgeClass = item.stock_status === 'In Stock' ? 'bg-success' :
            item.stock_status === 'Low Stock' ? 'bg-warning' : 'bg-danger';

        const remarksBadgeClass = item.inspector_remarks === 'Compliant' ? 'bg-success' : 'bg-danger';

        return `
            <tr data-id="${item._id}">
                <td><strong>${item.item_name}</strong></td>
                <td>${item.specification}</td>
                <td>${item.quantity_required} Units</td>
                <td>${item.quantity_on_site} Units</td>
                <td>${item.quantity_on_site}/${item.difference}</td>
                <td><span class="badge ${stockBadgeClass}">${item.stock_status}</span></td>
                <td><span class="badge ${remarksBadgeClass}">${item.inspector_remarks || 'N/A'}</span></td>
                <td>
                    <div class="btn-group" role="group">
                        <button type="button" class="btn btn-sm btn-primary dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
                            <i class="bx bx-refresh"></i> Change Status
                        </button>
                        <ul class="dropdown-menu">
                            <li><a class="dropdown-item" style="color: #10b981 !important;" href="javascript:void(0);" onclick="changeStatus(this, 'In Stock')"><i class="bx bx-check-circle me-2" style="color: #10b981 !important;"></i>In Stock</a></li>
                            <li><a class="dropdown-item" style="color: #f59e0b !important;" href="javascript:void(0);" onclick="changeStatus(this, 'Low Stock')"><i class="bx bx-error-circle me-2" style="color: #f59e0b !important;"></i>Low Stock</a></li>
                            <li><a class="dropdown-item" style="color: #ef4444 !important;" href="javascript:void(0);" onclick="changeStatus(this, 'Out of Stock')"><i class="bx bx-x-circle me-2" style="color: #ef4444 !important;"></i>Out of Stock</a></li>
                        </ul>
                    </div>
                    <div class="dropdown d-inline-block ms-2">
                        <button type="button" class="btn p-0 dropdown-toggle hide-arrow" data-bs-toggle="dropdown">
                            <i class="bx bx-dots-vertical-rounded"></i>
                        </button>
                        <div class="dropdown-menu">
                            <a class="dropdown-item" href="javascript:void(0);" onclick="editEquipment(this)"><i class="bx bx-edit-alt me-1"></i> Edit Details</a>
                            <a class="dropdown-item" href="javascript:void(0);" onclick="viewDetails(this)"><i class="bx bx-show me-1"></i> View Details</a>
                            <a class="dropdown-item text-danger" href="javascript:void(0);" onclick="deleteEquipment(this)"><i class="bx bx-trash me-1"></i> Delete</a>
                        </div>
                    </div>
                </td>
            </tr>
        `;
    }).join('');
}


// Update statistics
async function updateStatistics() {
    try {
        const response = await fetch(`${API_BASE_URL}/api/v1/inventory/statistics?collection=audit-inventory`);
        const result = await response.json();

        if (result.success) {
            const stats = result.data;

            const statCards = document.querySelectorAll('.card-title.mb-2');
            if (statCards.length >= 4) {
                statCards[0].textContent = stats.total_items.toLocaleString();
                statCards[1].textContent = stats.in_stock.toLocaleString();
                statCards[2].textContent = stats.low_stock.toLocaleString();
                statCards[3].textContent = stats.out_of_stock.toLocaleString();
            }
        }
    } catch (error) {
        // Silently fail - statistics are not critical
    }
}

// Show error message
function showError(message) {
    showToast(message, 'error');
}

// Toast notification function
function showToast(message, type = 'success') {
    const container = document.getElementById('toastContainer');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast-notification ${type}`;

    const icon = type === 'success' ? 'bx-check' :
        type === 'error' ? 'bx-x' :
            type === 'warning' ? 'bx-error-circle' : 'bxs-info-circle';

    toast.innerHTML = `
        <i class="bx ${icon} toast-icon"></i>
        <div class="toast-content">
            <div class="toast-message">${message}</div>
        </div>
        <button class="toast-close" onclick="closeToast(this)">
            <i class="bx bx-x"></i>
        </button>
    `;

    container.appendChild(toast);

    // Auto remove after 2.5 seconds (faster)
    setTimeout(() => {
        closeToast(toast.querySelector('.toast-close'));
    }, 2500);
}

// Close toast notification
function closeToast(button) {
    const toast = button.closest('.toast-notification');
    if (toast) {
        toast.classList.add('hiding');
        setTimeout(() => {
            toast.remove();
        }, 200);
    }
}

// Edit Equipment Function
function editEquipment(element) {
    currentRow = element.closest('tr');
    const cells = currentRow.cells;

    document.getElementById('editEquipmentName').value = cells[0].textContent.trim();
    document.getElementById('editSpecification').value = cells[1].textContent.trim();
    document.getElementById('editQuantityRequired').value = cells[2].textContent.replace(/[^\d]/g, '');
    document.getElementById('editQuantityOnSite').value = cells[3].textContent.replace(/[^\d]/g, '');
    document.getElementById('editDifference').value = cells[4].textContent.trim();

    const stockBadge = cells[5].querySelector('.badge');
    document.getElementById('editStockStatus').value = stockBadge ? stockBadge.textContent.trim() : '';

    const remarksBadge = cells[6].querySelector('.badge');
    const remarksText = remarksBadge ? remarksBadge.textContent.trim() : '';
    // Convert 'N/A' back to empty string
    document.getElementById('editRemarks').value = remarksText === 'N/A' ? '' : remarksText;

    const modal = new bootstrap.Modal(document.getElementById('editEquipmentModal'));
    modal.show();

    document.getElementById('editQuantityRequired').addEventListener('input', calculateDifference);
    document.getElementById('editQuantityOnSite').addEventListener('input', calculateDifference);
}

// Calculate Difference
function calculateDifference() {
    const qtyRequired = parseInt(document.getElementById('editQuantityRequired').value) || 0;
    const qtyOnSite = parseInt(document.getElementById('editQuantityOnSite').value) || 0;
    const difference = qtyOnSite + '/' + (qtyRequired - qtyOnSite);
    document.getElementById('editDifference').value = difference;
}

// Save Equipment Changes
async function saveEquipmentChanges() {
    if (!currentRow) return;

    const itemId = currentRow.getAttribute('data-id');
    const qtyRequired = parseInt(document.getElementById('editQuantityRequired').value);
    const qtyOnSite = parseInt(document.getElementById('editQuantityOnSite').value);
    const itemName = document.getElementById('editEquipmentName').value;
    const specification = document.getElementById('editSpecification').value;
    const inspectorRemarks = document.getElementById('editRemarks').value;

    try {
        const response = await fetch(`${API_BASE_URL}/api/v1/inventory/${itemId}?collection=audit-inventory`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                item_name: itemName,
                specification: specification,
                quantity_required: qtyRequired,
                quantity_on_site: qtyOnSite,
                inspector_remarks: inspectorRemarks
            })
        });

        const result = await response.json();

        if (result.success) {
            const modal = bootstrap.Modal.getInstance(document.getElementById('editEquipmentModal'));
            modal.hide();

            // Show appropriate message based on whether changes were made
            if (result.modified === false) {
                showToast('No changes were made to the item', 'info');
            } else {
                showToast('Inventory item updated successfully!', 'success');

                // Update the row immediately without reloading all data
                const cells = currentRow.cells;

                // Update item name (column 0)
                cells[0].innerHTML = `<strong>${itemName}</strong>`;

                // Update specification (column 1)
                cells[1].textContent = specification;

                // Update quantity required (column 2)
                cells[2].textContent = `${qtyRequired} Units`;

                // Update quantity on site (column 3)
                cells[3].textContent = `${qtyOnSite} Units`;

                // Calculate and update difference (column 4)
                const difference = qtyRequired - qtyOnSite;
                cells[4].textContent = `${qtyOnSite}/${difference}`;

                // Update stock status badge (column 5)
                let stockStatus = 'In Stock';
                let badgeClass = 'bg-success';
                if (qtyOnSite == 0) {
                    stockStatus = 'Out of Stock';
                    badgeClass = 'bg-danger';
                } else if (qtyOnSite < qtyRequired) {
                    stockStatus = 'Low Stock';
                    badgeClass = 'bg-warning';
                }

                const statusBadge = cells[5].querySelector('.badge');
                if (statusBadge) {
                    statusBadge.className = `badge ${badgeClass}`;
                    statusBadge.textContent = stockStatus;
                }

                // Update inspector remarks (column 6)
                const remarksBadge = cells[6].querySelector('.badge');
                if (remarksBadge) {
                    const remarksClass = inspectorRemarks === 'Compliant' ? 'bg-success' : 'bg-danger';
                    remarksBadge.className = `badge ${remarksClass}`;
                    remarksBadge.textContent = inspectorRemarks || 'N/A';
                }

                // Update statistics in background
                updateStatistics();
            }

            currentRow = null;
        } else {
            showToast('Failed to update item: ' + result.error, 'error');
        }
    } catch (error) {
        showToast('Error connecting to server', 'error');
    }
}

// View Equipment Details
function viewDetails(element) {
    const row = element.closest('tr');
    const cells = row.cells;

    document.getElementById('viewEquipmentName').value = cells[0].textContent.trim();
    document.getElementById('viewSpecification').value = cells[1].textContent.trim();
    document.getElementById('viewQuantityRequired').value = cells[2].textContent.trim();
    document.getElementById('viewQuantityOnSite').value = cells[3].textContent.trim();
    document.getElementById('viewDifference').value = cells[4].textContent.trim();

    const stockBadge = cells[5].querySelector('.badge');
    if (stockBadge) {
        document.getElementById('viewStockStatus').value = stockBadge.textContent.trim();
    }

    const remarksBadge = cells[6].querySelector('.badge');
    if (remarksBadge) {
        document.getElementById('viewRemarks').value = remarksBadge.textContent.trim();
    }

    const modal = new bootstrap.Modal(document.getElementById('viewEquipmentModal'));
    modal.show();
}

// Delete Equipment Function
function deleteEquipment(element) {
    currentRow = element.closest('tr');
    const equipmentName = currentRow.cells[0].textContent.trim();

    document.getElementById('deleteEquipmentName').textContent = equipmentName;

    const modal = new bootstrap.Modal(document.getElementById('deleteEquipmentModal'));
    modal.show();
}

// Confirm Delete Equipment
async function confirmDeleteEquipment() {
    if (!currentRow) return;

    const itemId = currentRow.getAttribute('data-id');
    const rowToDelete = currentRow;

    try {
        // Close modal immediately
        const modal = bootstrap.Modal.getInstance(document.getElementById('deleteEquipmentModal'));
        modal.hide();

        // Remove row immediately with fade animation
        rowToDelete.style.transition = 'opacity 0.3s ease-out';
        rowToDelete.style.opacity = '0';

        // Delete from server
        const response = await fetch(`${API_BASE_URL}/api/v1/inventory/${itemId}?collection=audit-inventory`, {
            method: 'DELETE'
        });

        const result = await response.json();

        if (result.success) {
            // Remove row from DOM after fade
            setTimeout(() => {
                rowToDelete.remove();
            }, 300);

            showToast('Inventory item deleted successfully!', 'success');

            // Update statistics in background
            updateStatistics();
            currentRow = null;
        } else {
            // Restore row if delete failed
            rowToDelete.style.opacity = '1';
            showToast('Failed to delete item: ' + result.error, 'error');
        }
    } catch (error) {
        // Restore row if error occurred
        rowToDelete.style.opacity = '1';
        showToast('Error connecting to server', 'error');
    }
}

// Change Status Function
async function changeStatus(element, newStatus) {
    const row = element.closest('tr');
    const itemId = row.getAttribute('data-id');
    const statusCell = row.cells[5];
    const statusBadge = statusCell.querySelector('.badge');

    // Store old status for rollback if needed
    const oldStatus = statusBadge ? statusBadge.textContent.trim() : '';
    const oldBadgeClass = statusBadge ? statusBadge.className : '';

    // Update UI immediately for instant feedback
    if (statusBadge) {
        statusBadge.classList.remove('bg-success', 'bg-warning', 'bg-danger');

        if (newStatus === 'In Stock') {
            statusBadge.classList.add('bg-success');
        } else if (newStatus === 'Low Stock') {
            statusBadge.classList.add('bg-warning');
        } else if (newStatus === 'Out of Stock') {
            statusBadge.classList.add('bg-danger');
        }

        statusBadge.textContent = newStatus;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/api/v1/inventory/${itemId}?collection=audit-inventory`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                stock_status: newStatus
            })
        });

        const result = await response.json();

        if (result.success) {
            if (result.modified === false) {
                // Rollback to old status if nothing changed
                if (statusBadge) {
                    statusBadge.className = oldBadgeClass;
                    statusBadge.textContent = oldStatus;
                }
                showToast('Status is already set to ' + newStatus, 'info');
            } else {
                showToast('Status updated to ' + newStatus + ' successfully!', 'success');
                updateStatistics();
            }
        } else {
            // Rollback on error
            if (statusBadge) {
                statusBadge.className = oldBadgeClass;
                statusBadge.textContent = oldStatus;
            }
            showToast('Failed to update status: ' + result.error, 'error');
        }
    } catch (error) {
        // Rollback on error
        if (statusBadge) {
            statusBadge.className = oldBadgeClass;
            statusBadge.textContent = oldStatus;
        }
        showToast('Error connecting to server', 'error');
    }
}

// Helper function to clear all row highlights
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

// Highlight search results without hiding other rows
function highlightSearchResults(searchTerm) {
    const tbody = document.querySelector('.table tbody');
    if (!tbody) return;

    const rows = tbody.querySelectorAll('tr');
    let firstMatch = null;

    rows.forEach(row => {
        // Remove any existing highlight
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


// Save new inventory item
async function saveNewInventoryItem() {
    const form = document.getElementById('addInventoryForm');

    // Get form values
    const program = document.getElementById('addProgram').value;
    const inventoryType = document.getElementById('addInventoryType').value;
    const itemName = document.getElementById('addItemName').value;
    const specification = document.getElementById('addSpecification').value;
    const quantityRequired = document.getElementById('addQuantityRequired').value;
    const quantityOnSite = document.getElementById('addQuantityOnSite').value;
    const remarks = document.getElementById('addRemarks').value;

    // Validate required fields manually and show toast
    if (!program || !inventoryType || !itemName || !specification || !quantityRequired || !quantityOnSite) {
        showToast('Please fill in all required fields before adding the item', 'warning');

        // Don't trigger browser validation tooltip
        return;
    }

    // Validate form
    if (!form.checkValidity()) {
        showToast('Please fill in all required fields correctly', 'warning');
        return;
    }

    // Prepare data
    const data = {
        program: program,
        inventory_type: inventoryType,
        item_name: itemName,
        specification: specification,
        quantity_required: parseInt(quantityRequired),
        quantity_on_site: parseInt(quantityOnSite),
        inspector_remarks: remarks
    };

    try {
        // Disable button and show loading
        const saveBtn = document.getElementById('saveInventoryBtn');
        saveBtn.disabled = true;
        saveBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Saving...';

        const response = await fetch(`${API_BASE_URL}/api/v1/inventory?collection=audit-inventory`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        const result = await response.json();

        if (result.success) {
            // Close modal
            const modal = bootstrap.Modal.getInstance(document.getElementById('addInventoryModal'));
            modal.hide();

            // Show success toast
            showToast('Inventory item added successfully!', 'success');

            // Reload data
            await loadInventoryData();
        } else {
            showToast('Error: ' + (result.error || 'Failed to add inventory item'), 'error');
        }
    } catch (error) {
        showToast('Error adding inventory item. Please try again.', 'error');
    } finally {
        // Re-enable button
        const saveBtn = document.getElementById('saveInventoryBtn');
        saveBtn.disabled = false;
        saveBtn.innerHTML = 'Add Item';
    }
}


