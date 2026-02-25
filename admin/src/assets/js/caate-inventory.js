/* CAATE Inventory Page Script */

// Store current row for modal operations
let currentRow = null;
let inventoryData = [];

// API Configuration
const API_BASE_URL = config?.api?.baseURL || '/CAATE-ITRMS/backend/public/index.php';

// Prevent aria-hidden focus warnings by managing modal focus properly
document.addEventListener('DOMContentLoaded', function () {
    // Load inventory data
    loadInventoryData();

    // Handle modal shown events to prevent aria-hidden warnings
    const modals = ['editEquipmentModal', 'viewEquipmentModal', 'deleteEquipmentModal'];
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
                    addInventoryText.textContent = 'Add Equipment';
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
                    addInventoryText.textContent = 'Add Equipment';
                    break;
            }

            loadInventoryData();
        });
    }

    // Handle search input
    const searchInput = document.getElementById('filterSearchInput');
    if (searchInput) {
        searchInput.addEventListener('input', debounce(function () {
            loadInventoryData();
        }, 500));
    }
});

// Debounce function for search
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

// Load inventory data from API
async function loadInventoryData() {
    try {
        const inventoryTypeFilter = document.getElementById('inventoryTypeFilter');
        const searchInput = document.getElementById('filterSearchInput');

        let url = `${API_BASE_URL}/api/v1/inventory?collection=caate-inventory&`;

        if (inventoryTypeFilter && inventoryTypeFilter.value) {
            url += `inventory_type=${encodeURIComponent(inventoryTypeFilter.value)}&`;
        }

        if (searchInput && searchInput.value) {
            url += `search=${encodeURIComponent(searchInput.value)}&`;
        }

        const response = await fetch(url);
        const result = await response.json();

        if (result.success) {
            inventoryData = result.data;
            renderInventoryTable(inventoryData);
            updateStatistics();
        } else {
            console.error('Failed to load inventory:', result.error);
            showError('Failed to load inventory data');
        }
    } catch (error) {
        console.error('Error loading inventory:', error);
        showError('Error connecting to server');
    }
}

// Render inventory table
// Render inventory table
function renderInventoryTable(data) {
    const tbody = document.querySelector('.table tbody');
    if (!tbody) return;

    if (data.length === 0) {
        tbody.innerHTML = '<tr><td colspan="8" class="text-center">No inventory items found</td></tr>';
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
                            <li><a class="dropdown-item" style="color: #10b981 !important;" href="javascript:void(0);"><i class="bx bx-check-circle me-2" style="color: #10b981 !important;"></i>In Stock</a></li>
                            <li><a class="dropdown-item" style="color: #f59e0b !important;" href="javascript:void(0);"><i class="bx bx-error-circle me-2" style="color: #f59e0b !important;"></i>Low Stock</a></li>
                            <li><a class="dropdown-item" style="color: #ef4444 !important;" href="javascript:void(0);"><i class="bx bx-x-circle me-2" style="color: #ef4444 !important;"></i>Out of Stock</a></li>
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
        const response = await fetch(`${API_BASE_URL}/api/v1/inventory/statistics`);
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
        console.error('Error loading statistics:', error);
    }
}

// Show error message
function showError(message) {
    alert(message);
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
    document.getElementById('editRemarks').value = remarksBadge ? remarksBadge.textContent.trim() : '';

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

    try {
        const response = await fetch(`${API_BASE_URL}/api/v1/inventory/${itemId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                item_name: document.getElementById('editEquipmentName').value,
                specification: document.getElementById('editSpecification').value,
                quantity_required: qtyRequired,
                quantity_on_site: qtyOnSite,
                inspector_remarks: document.getElementById('editRemarks').value
            })
        });

        const result = await response.json();

        if (result.success) {
            const modal = bootstrap.Modal.getInstance(document.getElementById('editEquipmentModal'));
            modal.hide();
            loadInventoryData();
            currentRow = null;
        } else {
            showError('Failed to update item: ' + result.error);
        }
    } catch (error) {
        console.error('Error updating item:', error);
        showError('Error connecting to server');
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

    try {
        const response = await fetch(`${API_BASE_URL}/api/v1/inventory/${itemId}?collection=caate-inventory`, {
            method: 'DELETE'
        });

        const result = await response.json();

        if (result.success) {
            const modal = bootstrap.Modal.getInstance(document.getElementById('deleteEquipmentModal'));
            modal.hide();
            loadInventoryData();
            currentRow = null;
        } else {
            showError('Failed to delete item: ' + result.error);
        }
    } catch (error) {
        console.error('Error deleting item:', error);
        showError('Error connecting to server');
    }
}

// Change Status Function
async function changeStatus(element, newStatus) {
    const row = element.closest('tr');
    const itemId = row.getAttribute('data-id');

    try {
        const response = await fetch(`${API_BASE_URL}/api/v1/inventory/${itemId}`, {
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
            loadInventoryData();
        } else {
            showError('Failed to update status: ' + result.error);
        }
    } catch (error) {
        console.error('Error updating status:', error);
        showError('Error connecting to server');
    }
}
