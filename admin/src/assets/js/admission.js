/* Admission Page Script */
document.addEventListener('DOMContentLoaded', function () {
    // Menu toggle is handled by main.js - no need to duplicate here

    // Date filter functionality
    const dateFilter = document.getElementById('admissionDateFilter');

    if (dateFilter) {
        dateFilter.addEventListener('change', function () {
            const selectedDate = this.value;

            if (!selectedDate) {
                // If no date selected, show all rows
                filterAdmissionsByDate(null);
                return;
            }

            // Filter admissions by selected date
            filterAdmissionsByDate(selectedDate);
        });
    }

    function filterAdmissionsByDate(dateString) {
        const tableRows = document.querySelectorAll('#admissionTable tbody tr');

        tableRows.forEach(row => {
            if (!dateString) {
                // Show all rows if no date filter
                row.style.display = '';
                return;
            }

            // Get the admission date from the row (adjust column index as needed)
            // Assuming admission date is in a specific column - you may need to adjust this
            const admissionDateCell = row.querySelector('td:nth-child(6)'); // Adjust column index

            if (admissionDateCell) {
                const cellText = admissionDateCell.textContent.trim();

                // Parse the date from the cell (adjust format as needed)
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
        // Try to parse common date formats
        // Adjust this function based on your actual date format in the table

        // Example: "01/15/2024" -> "2024-01-15"
        const dateMatch = cellText.match(/(\d{1,2})\/(\d{1,2})\/(\d{4})/);
        if (dateMatch) {
            const month = dateMatch[1].padStart(2, '0');
            const day = dateMatch[2].padStart(2, '0');
            const year = dateMatch[3];
            return `${year}-${month}-${day}`;
        }

        // Example: "2024-01-15" (already in correct format)
        const isoMatch = cellText.match(/(\d{4})-(\d{2})-(\d{2})/);
        if (isoMatch) {
            return cellText;
        }

        return null;
    }
});