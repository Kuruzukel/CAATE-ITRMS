/* Audit Inventory Page Script */
document.addEventListener('DOMContentLoaded', function () {
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