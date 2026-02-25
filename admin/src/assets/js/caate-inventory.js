/* CAATE Inventory Page Script */

// Store current row for modal operations
let currentRow = null;

// Prevent aria-hidden focus warnings by managing modal focus properly
document.addEventListener('DOMContentLoaded', function () {
    // Handle modal shown events to prevent aria-hidden warnings
    const modals = ['editEquipmentModal', 'viewEquipmentModal', 'deleteEquipmentModal'];
    modals.forEach(modalId => {
        const modalEl = document.getElementById(modalId);
        if (modalEl) {
            modalEl.addEventListener('shown.bs.modal', function () {
                // Remove aria-hidden when modal is shown
                this.removeAttribute('aria-hidden');
            });
            modalEl.addEventListener('hidden.bs.modal', function () {
                // Don't add aria-hidden back - let Bootstrap handle it naturally
            });
        }
    });

    // Menu toggle is handled by main.js - no need to duplicate here

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
        });
    }
});

// Edit Equipment Function
function editEquipment(element) {
    currentRow = element.closest('tr');
    const cells = currentRow.cells;

    // Populate modal fields - extract numbers from text like "3 Units"
    document.getElementById('editEquipmentName').value = cells[0].textContent.trim();
    document.getElementById('editSpecification').value = cells[1].textContent.trim();
    document.getElementById('editQuantityRequired').value = cells[2].textContent.replace(/[^\d]/g, '');
    document.getElementById('editQuantityOnSite').value = cells[3].textContent.replace(/[^\d]/g, '');
    document.getElementById('editDifference').value = cells[4].textContent.trim();

    // Get stock status from badge
    const stockBadge = cells[5].querySelector('.badge');
    document.getElementById('editStockStatus').value = stockBadge ? stockBadge.textContent.trim() : '';

    // Get remarks from badge
    const remarksBadge = cells[6].querySelector('.badge');
    document.getElementById('editRemarks').value = remarksBadge ? remarksBadge.textContent.trim() : '';

    // Show modal
    const modal = new bootstrap.Modal(document.getElementById('editEquipmentModal'));
    modal.show();

    // Add event listeners to auto-calculate difference
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
function saveEquipmentChanges() {
    if (!currentRow) return;

    const cells = currentRow.cells;

    // Get values from modal
    const qtyRequired = document.getElementById('editQuantityRequired').value;
    const qtyOnSite = document.getElementById('editQuantityOnSite').value;

    // Update row data
    cells[0].innerHTML = '<strong>' + document.getElementById('editEquipmentName').value + '</strong>';
    cells[1].textContent = document.getElementById('editSpecification').value;
    cells[2].textContent = qtyRequired + ' Units';
    cells[3].textContent = qtyOnSite + ' Units';

    // Update stock status badge
    const stockStatus = document.getElementById('editStockStatus').value;
    let stockBadgeClass = 'badge bg-success';
    if (stockStatus === 'Low Stock') stockBadgeClass = 'badge bg-warning';
    if (stockStatus === 'Out of Stock') stockBadgeClass = 'badge bg-danger';
    cells[5].innerHTML = '<span class="' + stockBadgeClass + '">' + stockStatus + '</span>';

    // Update remarks badge
    const remarks = document.getElementById('editRemarks').value;
    const remarksBadgeClass = remarks === 'Compliant' ? 'badge bg-success' : 'badge bg-danger';
    cells[6].innerHTML = '<span class="' + remarksBadgeClass + '">' + remarks + '</span>';

    // Calculate and update difference
    const qtyRequiredNum = parseInt(qtyRequired) || 0;
    const qtyOnSiteNum = parseInt(qtyOnSite) || 0;
    const difference = qtyOnSiteNum + '/' + (qtyRequiredNum - qtyOnSiteNum);
    cells[4].textContent = difference;

    // Close modal
    const modal = bootstrap.Modal.getInstance(document.getElementById('editEquipmentModal'));
    modal.hide();

    currentRow = null;
}

// View Equipment Details
function viewDetails(element) {
    const row = element.closest('tr');
    const cells = row.cells;

    // Populate modal fields
    document.getElementById('viewEquipmentName').textContent = cells[0].textContent.trim();
    document.getElementById('viewSpecification').textContent = cells[1].textContent.trim();
    document.getElementById('viewQuantityRequired').textContent = cells[2].textContent.trim();
    document.getElementById('viewQuantityOnSite').textContent = cells[3].textContent.trim();
    document.getElementById('viewDifference').textContent = cells[4].textContent.trim();

    // Get stock status with badge styling
    const stockBadge = cells[5].querySelector('.badge');
    if (stockBadge) {
        document.getElementById('viewStockStatus').innerHTML = stockBadge.outerHTML;
    }

    // Get remarks with badge styling
    const remarksBadge = cells[6].querySelector('.badge');
    if (remarksBadge) {
        document.getElementById('viewRemarks').innerHTML = remarksBadge.outerHTML;
    }

    // Show modal
    const modal = new bootstrap.Modal(document.getElementById('viewEquipmentModal'));
    modal.show();
}

// Delete Equipment Function
function deleteEquipment(element) {
    currentRow = element.closest('tr');
    const equipmentName = currentRow.cells[0].textContent.trim();

    // Set equipment name in modal
    document.getElementById('deleteEquipmentName').textContent = equipmentName;

    // Show modal
    const modal = new bootstrap.Modal(document.getElementById('deleteEquipmentModal'));
    modal.show();
}

// Confirm Delete Equipment
function confirmDeleteEquipment() {
    if (!currentRow) return;

    // Remove the row
    currentRow.remove();

    // Close modal
    const modal = bootstrap.Modal.getInstance(document.getElementById('deleteEquipmentModal'));
    modal.hide();

    currentRow = null;
}