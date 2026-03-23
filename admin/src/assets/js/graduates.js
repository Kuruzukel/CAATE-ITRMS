document.addEventListener('DOMContentLoaded', function () {

    document.querySelectorAll('.view-graduate-btn').forEach(button => {
        button.addEventListener('click', function () {
            const name = this.getAttribute('data-name');
            const id = this.getAttribute('data-id');
            const course = this.getAttribute('data-course');
            const graduated = this.getAttribute('data-graduated');
            const email = this.getAttribute('data-email');
            const image = this.getAttribute('data-image');

            document.getElementById('modalGraduateName').value = name;
            document.getElementById('modalGraduateId').value = id;
            document.getElementById('modalGraduateCourse').value = course;
            document.getElementById('modalGraduateDate').value = graduated;
            document.getElementById('modalGraduateEmail').value = email;
            document.getElementById('modalGraduateImage').src = image;
        });
    });

    document.querySelectorAll('.edit-graduate-btn').forEach(button => {
        button.addEventListener('click', function () {
            const name = this.getAttribute('data-name');
            const id = this.getAttribute('data-id');
            const course = this.getAttribute('data-course');
            const graduated = this.getAttribute('data-graduated');
            const email = this.getAttribute('data-email');
            const certification = this.getAttribute('data-certification');
            const image = this.getAttribute('data-image');

            document.getElementById('editGraduateBadge').textContent = certification || 'NC II - SOCBCN220';
            document.getElementById('editGraduateName').value = name;
            document.getElementById('editGraduateId').value = id;
            document.getElementById('editGraduateCourse').value = course;
            document.getElementById('editGraduateDate').value = graduated;
            document.getElementById('editGraduateEmail').value = email;
            document.getElementById('editGraduateImage').src = image;
        });
    });

    document.getElementById('confirmExportBtn').addEventListener('click', function () {

        const selectedCourses = Array.from(document.querySelectorAll('.export-course-filter:checked')).map(cb => cb.value);
        const selectedYears = Array.from(document.querySelectorAll('.export-year-filter:checked')).map(cb => cb.value);

        const csvData = [
            ['Name', 'Student ID', 'Course', 'Certification', 'Graduation Date', 'Email']
        ];

        document.querySelectorAll('.view-graduate-btn').forEach(btn => {
            const name = btn.getAttribute('data-name');
            const id = btn.getAttribute('data-id');
            const course = btn.getAttribute('data-course');
            const graduated = btn.getAttribute('data-graduated');
            const email = btn.getAttribute('data-email');
            const certification = 'NC II - SOCBCN220';

            const graduatedYear = graduated.split(' ')[1];

            const courseMatch = selectedCourses.length === 0 || selectedCourses.includes(course);
            const yearMatch = selectedYears.length === 0 || selectedYears.includes(graduatedYear);

            if (courseMatch && yearMatch) {
                csvData.push([name, id, course, certification, graduated, email]);
            }
        });

        if (csvData.length === 1) {
            alert('No graduates found matching the selected filters.');
            return;
        }

        const csvContent = csvData.map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', 'graduates_list_' + new Date().toISOString().split('T')[0] + '.csv');
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        const modal = bootstrap.Modal.getInstance(document.getElementById('exportModal'));
        modal.hide();

        alert('Graduates list exported successfully! (' + (csvData.length - 1) + ' records)');
    });

    document.getElementById('saveGraduateBtn').addEventListener('click', function () {
        const form = document.getElementById('editGraduateForm');
        if (form.checkValidity()) {

            alert('Graduate information updated successfully!');

            const modal = bootstrap.Modal.getInstance(document.getElementById('editGraduateModal'));
            modal.hide();


        } else {
            form.reportValidity();
        }
    });

    const modals = ['viewGraduateModal', 'editGraduateModal', 'exportModal'];
    modals.forEach(modalId => {
        const modalElement = document.getElementById(modalId);
        if (modalElement) {

            modalElement.addEventListener('shown.bs.modal', function () {
                this.removeAttribute('aria-hidden');
            });

            modalElement.addEventListener('hidden.bs.modal', function () {
                this.setAttribute('aria-hidden', 'true');
            });
        }
    });

});