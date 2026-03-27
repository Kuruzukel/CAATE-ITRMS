document.addEventListener('DOMContentLoaded', function () {

    const dateFilter = document.getElementById('admissionDateFilter');

    if (dateFilter) {
        dateFilter.addEventListener('change', function () {
            const selectedDate = this.value;

            if (!selectedDate) {

                filterAdmissionsByDate(null);
                return;
            }

            filterAdmissionsByDate(selectedDate);
        });
    }

    function filterAdmissionsByDate(dateString) {
        const tableRows = document.querySelectorAll('#admissionTable tbody tr');

        tableRows.forEach(row => {
            if (!dateString) {

                row.style.display = '';
                return;
            }

            const admissionDateCell = row.querySelector('td:nth-child(6)');

            if (admissionDateCell) {
                const cellText = admissionDateCell.textContent.trim();

                const cellDate = parseDateFromCell(cellText);

                if (cellDate && cellDate === dateString) {
                    row.style.display = '';
                } else {
                    row.style.display = 'none';
                }
            }
        });
    }

    function parseDateFromCell(cellText) {

        const dateMatch = cellText.match(/(\d{1,2})\/(\d{1,2})\/(\d{4})/);
        if (dateMatch) {
            const month = dateMatch[1].padStart(2, '0');
            const day = dateMatch[2].padStart(2, '0');
            const year = dateMatch[3];
            return `${year}-${month}-${day}`;
        }

        const isoMatch = cellText.match(/(\d{4})-(\d{2})-(\d{2})/);
        if (isoMatch) {
            return cellText;
        }

        return null;
    }
});