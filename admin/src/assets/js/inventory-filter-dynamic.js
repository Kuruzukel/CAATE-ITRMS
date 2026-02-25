/* Dynamic Search Placeholder and Header Update Script */
document.addEventListener('DOMContentLoaded', function () {
    const inventoryTypeFilter = document.getElementById('inventoryTypeFilter');
    const filterSearchInput = document.getElementById('filterSearchInput');
    const equipmentNameHeader = document.getElementById('equipmentNameHeader');

    if (inventoryTypeFilter && filterSearchInput) {
        inventoryTypeFilter.addEventListener('change', function () {
            const selectedValue = this.value;
            let placeholder = 'Equipment Name';
            let headerText = 'Name of Equipment';

            switch (selectedValue) {
                case '':
                    placeholder = 'Equipment Name';
                    headerText = 'Name of Equipment';
                    break;
                case 'equipment':
                    placeholder = 'Equipment Name';
                    headerText = 'Name of Equipment';
                    break;
                case 'tools':
                    placeholder = 'Tool Name';
                    headerText = 'Name of Tool';
                    break;
                case 'consumables':
                    placeholder = 'Consumable/Material Name';
                    headerText = 'Name of Consumable/Material';
                    break;
                default:
                    placeholder = 'Equipment Name';
                    headerText = 'Name of Equipment';
            }

            filterSearchInput.placeholder = placeholder;
            if (equipmentNameHeader) {
                equipmentNameHeader.textContent = headerText;
            }
        });
    }
});
