document.addEventListener('DOMContentLoaded', function () {
    // Pagination variables
    const cardsPerPage = 8;
    let currentPage = 1;
    let allGraduateCards = [];

    // Load certifications from courses API
    async function loadCertifications() {
        try {
            const response = await fetch(`${config.api.baseUrl}/api/v1/courses`);
            const result = await response.json();

            if (result.success && result.data && Array.isArray(result.data)) {
                const addCertSelect = document.getElementById('addGraduateCertification');
                const editCertSelect = document.getElementById('editGraduateCertification');

                // Clear existing options except the first one
                if (addCertSelect) {
                    addCertSelect.innerHTML = '<option value="">Select Certification</option>';
                }
                if (editCertSelect) {
                    editCertSelect.innerHTML = '<option value="">Select Certification</option>';
                }

                // Get unique badges/certifications from courses
                const certifications = new Set();
                result.data.forEach(course => {
                    const badge = course.badge || course.course_code;
                    if (badge) {
                        certifications.add(badge);
                    }
                });

                // Convert to array and sort
                const sortedCertifications = Array.from(certifications).sort();

                // Add options to both dropdowns
                sortedCertifications.forEach(cert => {
                    if (addCertSelect) {
                        const option = document.createElement('option');
                        option.value = cert;
                        option.textContent = cert;
                        addCertSelect.appendChild(option);
                    }
                    if (editCertSelect) {
                        const option = document.createElement('option');
                        option.value = cert;
                        option.textContent = cert;
                        editCertSelect.appendChild(option);
                    }
                });

            }
        } catch (error) {
            console.error('Error loading certifications:', error);
        }
    }

    // Load certifications on page load
    loadCertifications();

    // Initialize pagination
    function initializePagination() {
        // Get the specific graduates grid container
        const graduatesGrid = document.querySelector('.row.row-cols-1.row-cols-md-2.row-cols-lg-3.row-cols-xl-4');

        if (graduatesGrid) {
            // Get only direct children .col elements from this specific grid
            allGraduateCards = Array.from(graduatesGrid.children).filter(el => el.classList.contains('col'));
        }

        if (allGraduateCards.length === 0) {
            console.warn('No graduate cards found');
            return;
        }

        const totalPages = Math.ceil(allGraduateCards.length / cardsPerPage);
        renderPagination(totalPages);
        showPage(1);
    }

    // Show specific page
    function showPage(pageNum) {
        currentPage = pageNum;
        const startIndex = (pageNum - 1) * cardsPerPage;
        const endIndex = startIndex + cardsPerPage;

        allGraduateCards.forEach((card, index) => {
            if (index >= startIndex && index < endIndex) {
                card.style.display = '';
            } else {
                card.style.display = 'none';
            }
        });

        updatePaginationButtons();
    }

    // Render pagination buttons
    function renderPagination(totalPages) {
        const paginationContainer = document.querySelector('.pagination');
        if (!paginationContainer) return;

        let paginationHTML = `
            <li class="page-item" id="prevPage">
                <a class="page-link" href="#" tabindex="-1" 
                   style="background-color: #243447 !important; border-color: #3d4f63 !important; color: #b8c5d6 !important;">
                    Previous
                </a>
            </li>
        `;

        for (let i = 1; i <= totalPages; i++) {
            paginationHTML += `
                <li class="page-item">
                    <a class="page-link page-num" href="#" data-page="${i}" 
                       style="background-color: #243447 !important; border-color: #3d4f63 !important; color: #b8c5d6 !important;">
                        ${i}
                    </a>
                </li>
            `;
        }

        paginationHTML += `
            <li class="page-item" id="nextPage">
                <a class="page-link" href="#" 
                   style="background-color: #243447 !important; border-color: #3d4f63 !important; color: #b8c5d6 !important;">
                    Next
                </a>
            </li>
        `;

        paginationContainer.innerHTML = paginationHTML;

        // Add event listeners
        document.querySelectorAll('.page-num').forEach(btn => {
            btn.addEventListener('click', function (e) {
                e.preventDefault();
                const page = parseInt(this.getAttribute('data-page'));
                showPage(page);
            });
        });

        document.getElementById('prevPage').addEventListener('click', function (e) {
            e.preventDefault();
            if (currentPage > 1) {
                showPage(currentPage - 1);
            }
        });

        document.getElementById('nextPage').addEventListener('click', function (e) {
            e.preventDefault();
            const totalPages = Math.ceil(allGraduateCards.length / cardsPerPage);
            if (currentPage < totalPages) {
                showPage(currentPage + 1);
            }
        });
    }

    // Update pagination button states
    function updatePaginationButtons() {
        const totalPages = Math.ceil(allGraduateCards.length / cardsPerPage);
        const prevBtn = document.getElementById('prevPage');
        const nextBtn = document.getElementById('nextPage');

        // Update Previous button
        if (currentPage === 1) {
            prevBtn.classList.add('disabled');
        } else {
            prevBtn.classList.remove('disabled');
        }

        // Update Next button
        if (currentPage === totalPages) {
            nextBtn.classList.add('disabled');
        } else {
            nextBtn.classList.remove('disabled');
        }

        // Update page number buttons
        document.querySelectorAll('.page-num').forEach(btn => {
            const page = parseInt(btn.getAttribute('data-page'));
            if (page === currentPage) {
                btn.style.backgroundColor = 'var(--primary-blue) !important';
                btn.style.borderColor = 'var(--primary-blue) !important';
                btn.style.color = '#ffffff !important';
                btn.parentElement.classList.add('active');
            } else {
                btn.style.backgroundColor = '#243447 !important';
                btn.style.borderColor = '#3d4f63 !important';
                btn.style.color = '#b8c5d6 !important';
                btn.parentElement.classList.remove('active');
            }
        });
    }

    // Initialize pagination on page load
    initializePagination();

    // Export as CSV button
    document.getElementById('exportGraduatesCsvBtn')?.addEventListener('click', function () {
        exportGraduatesToCSV();
    });

    // Export as JSON button
    document.getElementById('exportGraduatesJsonBtn')?.addEventListener('click', function () {
        exportGraduatesToJSON();
    });

    // Add Graduate button
    document.getElementById('addGraduateBtn')?.addEventListener('click', function () {
        // Reset form
        document.getElementById('addGraduateForm')?.reset();
        document.getElementById('addGraduateImagePreview').src = '../assets/images/DEFAULT_AVATAR.png';

        // Open add graduate modal
        const modal = new bootstrap.Modal(document.getElementById('addGraduateModal'));
        modal.show();
    });

    // Handle modal cleanup when closed
    const addGraduateModal = document.getElementById('addGraduateModal');
    if (addGraduateModal) {
        addGraduateModal.addEventListener('hidden.bs.modal', function () {
            // Remove any lingering backdrops
            const backdrops = document.querySelectorAll('.modal-backdrop');
            backdrops.forEach(backdrop => backdrop.remove());
            // Remove modal-open class from body
            document.body.classList.remove('modal-open');
            document.body.style.overflow = '';
            document.body.style.paddingRight = '';
        });
    }

    const editGraduateModal = document.getElementById('editGraduateModal');
    if (editGraduateModal) {
        editGraduateModal.addEventListener('hidden.bs.modal', function () {
            // Remove any lingering backdrops
            const backdrops = document.querySelectorAll('.modal-backdrop');
            backdrops.forEach(backdrop => backdrop.remove());
            // Remove modal-open class from body
            document.body.classList.remove('modal-open');
            document.body.style.overflow = '';
            document.body.style.paddingRight = '';
        });
    }

    const viewGraduateModal = document.getElementById('viewGraduateModal');
    if (viewGraduateModal) {
        viewGraduateModal.addEventListener('hidden.bs.modal', function () {
            // Remove any lingering backdrops
            const backdrops = document.querySelectorAll('.modal-backdrop');
            backdrops.forEach(backdrop => backdrop.remove());
            // Remove modal-open class from body
            document.body.classList.remove('modal-open');
            document.body.style.overflow = '';
            document.body.style.paddingRight = '';
        });
    }

    // Handle image upload preview for add graduate
    document.getElementById('addGraduateImageInput')?.addEventListener('change', function (e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function (event) {
                document.getElementById('addGraduateImagePreview').src = event.target.result;
            };
            reader.readAsDataURL(file);
        }
    });

    // Save new graduate button
    document.getElementById('saveNewGraduateBtn')?.addEventListener('click', function () {
        const form = document.getElementById('addGraduateForm');
        if (form.checkValidity()) {
            // Get form values
            const certification = document.getElementById('addGraduateCertification').value;
            const name = document.getElementById('addGraduateName').value;
            const id = document.getElementById('addGraduateId').value;
            const course = document.getElementById('addGraduateCourse').value;
            const graduated = document.getElementById('addGraduateDate').value;
            const email = document.getElementById('addGraduateEmail').value;
            const image = document.getElementById('addGraduateImagePreview').src;

            // Here you would typically send this data to your backend API
            // For now, we'll just show a success message
            alert('Graduate added successfully!\n\nName: ' + name + '\nID: ' + id + '\nCertification: ' + certification + '\nCourse: ' + course);

            // Close modal
            const modal = bootstrap.Modal.getInstance(document.getElementById('addGraduateModal'));
            modal.hide();

            // TODO: Add the new graduate card to the page dynamically
            // or reload the graduates list from the API
        } else {
            form.reportValidity();
        }
    });

    // Export to CSV function
    function exportGraduatesToCSV() {
        const csvData = [
            ['Name', 'Student ID', 'Course', 'Certification', 'Graduation Date', 'Email']
        ];

        document.querySelectorAll('.view-graduate-btn').forEach(btn => {
            const name = btn.getAttribute('data-name');
            const id = btn.getAttribute('data-id');
            const course = btn.getAttribute('data-course');
            const graduated = btn.getAttribute('data-graduated');
            const email = btn.getAttribute('data-email');
            const certification = btn.getAttribute('data-certification') || 'NC II - SOCBCN220';

            csvData.push([name, id, course, certification, graduated, email]);
        });

        if (csvData.length === 1) {
            alert('No graduates to export.');
            return;
        }

        const csvContent = csvData.map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `graduates_${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        alert('Graduates exported to CSV successfully! (' + (csvData.length - 1) + ' records)');
    }

    // Export to JSON function
    function exportGraduatesToJSON() {
        const graduatesData = [];

        document.querySelectorAll('.view-graduate-btn').forEach(btn => {
            const graduate = {
                name: btn.getAttribute('data-name'),
                id: btn.getAttribute('data-id'),
                course: btn.getAttribute('data-course'),
                certification: btn.getAttribute('data-certification') || 'NC II - SOCBCN220',
                graduated: btn.getAttribute('data-graduated'),
                email: btn.getAttribute('data-email'),
                image: btn.getAttribute('data-image')
            };
            graduatesData.push(graduate);
        });

        if (graduatesData.length === 0) {
            alert('No graduates to export.');
            return;
        }

        const jsonContent = JSON.stringify(graduatesData, null, 2);
        const blob = new Blob([jsonContent], { type: 'application/json' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `graduates_${new Date().toISOString().split('T')[0]}.json`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        alert('Graduates exported to JSON successfully! (' + graduatesData.length + ' records)');
    }

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

            // Set certification dropdown value
            const certSelect = document.getElementById('editGraduateCertification');
            if (certSelect) {
                certSelect.value = certification || 'NC II - SOCBCN220';
            }

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