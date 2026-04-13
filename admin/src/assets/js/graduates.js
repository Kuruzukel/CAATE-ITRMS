document.addEventListener('DOMContentLoaded', function () {
    // Pagination variables
    const cardsPerPage = 8;
    let currentPage = 1;
    let allGraduateCards = [];

    // Fetch and display graduates from database
    async function loadGraduates() {
        try {
            const response = await fetch(`${config.api.baseUrl}/api/v1/graduates`);
            const result = await response.json();

            if (result.success && result.data && Array.isArray(result.data)) {
                const graduatesGrid = document.getElementById('graduatesGrid');
                const emptyState = document.getElementById('emptyState');

                if (graduatesGrid) {
                    // Clear existing cards before loading from database
                    graduatesGrid.innerHTML = '';

                    // Check if there are any graduates
                    if (result.data.length === 0) {
                        // Show empty state
                        graduatesGrid.innerHTML = `
                            <div class="col-12" style="display: flex; justify-content: center; align-items: center; min-height: 350px;">
                                <div style="text-align: center;">
                                    <i class="bx bxs-graduation" style="font-size: 4rem; opacity: 0.3; color: #697a8d; display: block; margin: 0 auto 15px;"></i>
                                    <h5 style="margin-bottom: 10px; color: #697a8d;">No Graduates Yet</h5>
                                    <p style="margin: 5px 0 0 0; font-size: 0.9rem; opacity: 0.7; color: #697a8d;">Click "Add New Graduate" to create your first graduate record.</p>
                                </div>
                            </div>
                        `;
                        return;
                    }

                    // Add each graduate from database
                    result.data.forEach(graduate => {
                        const graduateData = graduate;
                        const name = graduateData.name || 'Unknown';
                        const id = graduateData.trainee_id || 'N/A';
                        const course = graduateData.course || 'N/A';
                        const certification = graduateData.certification || 'N/A';
                        const email = graduateData.email || 'N/A';
                        const imageUrl = graduateData.image_url || '../assets/images/DEFAULT_AVATAR.png';

                        // Format graduation date
                        let graduatedFormatted = 'N/A';
                        if (graduateData.graduation_date) {
                            const dateObj = new Date(graduateData.graduation_date);
                            const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
                            const day = dateObj.getDate();
                            const month = monthNames[dateObj.getMonth()];
                            const year = dateObj.getFullYear();
                            graduatedFormatted = `${month} ${day}, ${year}`;
                        }

                        // Create card
                        const newCard = document.createElement('div');
                        newCard.className = 'col';
                        newCard.innerHTML = `
                            <div class="card h-100">
                                <div class="position-relative">
                                    <img src="${imageUrl}" class="card-img-top" alt="${name}" style="height: 200px; object-fit: cover;">
                                    <button class="btn btn-danger position-absolute top-0 end-0 m-2 delete-graduate-btn rounded-circle p-0"
                                        data-bs-toggle="modal" data-bs-target="#deleteGraduateModal"
                                        data-name="${name}" data-id="${id}"
                                        style="width: 38px; height: 28px; display: flex; align-items: center; justify-content: center; box-shadow: 0 2px 8px rgba(0,0,0,0.3);">
                                        <i class="bx bx-trash" style="font-size: 14px;"></i>
                                    </button>
                                </div>
                                <div class="card-body">
                                    <span class="badge mb-2" style="background-color: #5bc0de; color: #ffffff;">${certification}</span>
                                    <h5 class="card-title mb-2">${name}</h5>
                                    <p class="text-muted small mb-2">ID: ${id}</p>
                                    <p class="card-text small mb-2 graduate-course-text">
                                        <i class="bx bx-book-open me-1"></i><span class="course-name">${course}</span>
                                    </p>
                                    <p class="card-text small mb-2">
                                        <i class="bx bx-calendar me-1"></i>Graduated: ${graduatedFormatted}
                                    </p>
                                    <p class="card-text small mb-3">
                                        <i class="bx bx-envelope me-1"></i>${email}
                                    </p>
                                    <div class="d-flex gap-2">
                                        <button class="btn btn-sm btn-outline-primary flex-fill view-graduate-btn" 
                                            data-bs-toggle="modal" data-bs-target="#viewGraduateModal"
                                            data-name="${name}" data-id="${id}" data-course="${course}" 
                                            data-graduated="${graduatedFormatted}" data-email="${email}" 
                                            data-certification="${certification}" data-image="${imageUrl}">
                                            <i class="bx bx-show"></i> View
                                        </button>
                                        <button class="btn btn-sm btn-outline-secondary flex-fill edit-graduate-btn" 
                                            data-bs-toggle="modal" data-bs-target="#editGraduateModal"
                                            data-name="${name}" data-id="${id}" data-course="${course}" 
                                            data-graduated="${graduatedFormatted}" data-email="${email}" 
                                            data-certification="${certification}" data-image="${imageUrl}">
                                            <i class="bx bx-edit"></i> Edit
                                        </button>
                                    </div>
                                </div>
                            </div>
                        `;

                        graduatesGrid.appendChild(newCard);

                        // Add event listeners
                        const deleteBtn = newCard.querySelector('.delete-graduate-btn');
                        const viewBtn = newCard.querySelector('.view-graduate-btn');
                        const editBtn = newCard.querySelector('.edit-graduate-btn');

                        if (deleteBtn) {
                            deleteBtn.addEventListener('click', function () {
                                graduateToDelete = { name, id, button: deleteBtn };
                                document.getElementById('deleteGraduateName').textContent = name;
                                document.getElementById('deleteGraduateId').textContent = 'ID: ' + id;
                            });
                        }

                        if (viewBtn) {
                            viewBtn.addEventListener('click', function () {
                                document.getElementById('modalGraduateName').value = name;
                                document.getElementById('modalGraduateId').value = id;
                                document.getElementById('modalGraduateCourse').value = course;
                                document.getElementById('modalGraduateDate').value = graduatedFormatted;
                                document.getElementById('modalGraduateEmail').value = email;
                                document.getElementById('modalGraduateImage').src = imageUrl;
                            });
                        }

                        if (editBtn) {
                            editBtn.addEventListener('click', function () {
                                document.getElementById('editGraduateName').value = name;
                                document.getElementById('editGraduateId').value = id;
                                document.getElementById('editGraduateCourse').value = course;
                                document.getElementById('editGraduateDate').value = graduateData.graduation_date;
                                document.getElementById('editGraduateEmail').value = email;
                                document.getElementById('editGraduateCertification').value = certification;
                                document.getElementById('editGraduateImage').src = imageUrl;
                            });
                        }
                    });

                    // Initialize pagination after loading
                    initializePagination();
                }
            }
        } catch (error) {
            console.error('Error loading graduates:', error);
        }
    }

    // Load graduates on page load
    loadGraduates();

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

    // Load courses for filter dropdown
    async function loadCoursesFilter() {
        try {
            const response = await fetch(`${config.api.baseUrl}/api/v1/courses`);
            const result = await response.json();

            if (result.success && result.data && Array.isArray(result.data)) {
                const courseFilter = document.getElementById('graduateCourseFilter');
                const certificationFilter = document.getElementById('graduateCertificationFilter');

                if (courseFilter) {
                    // Keep the "All Courses" option
                    courseFilter.innerHTML = '<option value="">All Courses</option>';

                    // Add each course as an option
                    result.data.forEach(course => {
                        const option = document.createElement('option');
                        option.value = course.course_name || course.title;
                        option.textContent = course.course_name || course.title;
                        courseFilter.appendChild(option);
                    });
                }

                if (certificationFilter) {
                    // Keep the "All Certifications" option
                    certificationFilter.innerHTML = '<option value="">All Certifications</option>';

                    // Get unique certifications from courses
                    const certifications = new Set();
                    result.data.forEach(course => {
                        const badge = course.badge || course.course_code;
                        if (badge) {
                            certifications.add(badge);
                        }
                    });

                    // Convert to array and sort
                    const sortedCertifications = Array.from(certifications).sort();

                    // Add each certification as an option
                    sortedCertifications.forEach(cert => {
                        const option = document.createElement('option');
                        option.value = cert;
                        option.textContent = cert;
                        certificationFilter.appendChild(option);
                    });
                }
            }
        } catch (error) {
            console.error('Error loading courses for filter:', error);
        }
    }

    // Load courses on page load
    loadCoursesFilter();

    // Update certification card when filter changes
    const certificationFilter = document.getElementById('graduateCertificationFilter');
    if (certificationFilter) {
        certificationFilter.addEventListener('change', function () {
            const selectedCert = this.value;
            const certLabel = document.getElementById('certificationCardLabel');
            const certCount = document.getElementById('certificationCardCount');

            if (certLabel) {
                if (selectedCert) {
                    certLabel.textContent = selectedCert;
                } else {
                    certLabel.textContent = 'All Certifications';
                }
            }

            // Count graduates with selected certification
            if (certCount) {
                let count = 0;
                document.querySelectorAll('.view-graduate-btn').forEach(btn => {
                    const certification = btn.getAttribute('data-certification');
                    if (!selectedCert || certification === selectedCert) {
                        count++;
                    }
                });
                certCount.textContent = count;
            }
        });
    }

    // Add delete buttons to all existing graduate cards that don't have them
    function addDeleteButtonsToExistingCards() {
        const graduateCards = document.querySelectorAll('.row.row-cols-1.row-cols-md-2.row-cols-lg-3.row-cols-xl-4 .col');

        graduateCards.forEach(col => {
            const card = col.querySelector('.card');
            if (!card) return;

            // Check if delete button already exists
            if (card.querySelector('.delete-graduate-btn')) return;

            // Find the image container
            let imageContainer = card.querySelector('.position-relative');
            const image = card.querySelector('.card-img-top');

            if (!image) return;

            // If no position-relative container, wrap the image
            if (!imageContainer) {
                const wrapper = document.createElement('div');
                wrapper.className = 'position-relative';
                image.parentNode.insertBefore(wrapper, image);
                wrapper.appendChild(image);
                imageContainer = wrapper;
            }

            // Get graduate data from view button
            const viewBtn = card.querySelector('.view-graduate-btn');
            if (!viewBtn) return;

            const name = viewBtn.getAttribute('data-name');
            const id = viewBtn.getAttribute('data-id');

            // Create delete button
            const deleteBtn = document.createElement('button');
            deleteBtn.className = 'btn btn-danger position-absolute top-0 end-0 m-2 delete-graduate-btn rounded-circle p-0';
            deleteBtn.setAttribute('data-bs-toggle', 'modal');
            deleteBtn.setAttribute('data-bs-target', '#deleteGraduateModal');
            deleteBtn.setAttribute('data-name', name);
            deleteBtn.setAttribute('data-id', id);
            deleteBtn.style.cssText = 'width: 38px; height: 28px; display: flex; align-items: center; justify-content: center; box-shadow: 0 2px 8px rgba(0,0,0,0.3);';

            const icon = document.createElement('i');
            icon.className = 'bx bx-trash';
            icon.style.fontSize = '14px';

            deleteBtn.appendChild(icon);
            imageContainer.appendChild(deleteBtn);

            // Add event listener
            deleteBtn.addEventListener('click', function () {
                graduateToDelete = { name, id, button: deleteBtn };
                document.getElementById('deleteGraduateName').textContent = name;
                document.getElementById('deleteGraduateId').textContent = 'ID: ' + id;
            });
        });
    }

    // Call the function to add delete buttons to existing cards
    addDeleteButtonsToExistingCards();

    // Initialize pagination
    function initializePagination() {
        // Get the specific graduates grid container
        const graduatesGrid = document.querySelector('.row.row-cols-1.row-cols-md-2.row-cols-lg-3.row-cols-xl-4');

        if (graduatesGrid) {
            // Get only direct children .col elements from this specific grid
            allGraduateCards = Array.from(graduatesGrid.children).filter(el => el.classList.contains('col'));
        }

        if (allGraduateCards.length === 0) {
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
        const modalElement = document.getElementById('addGraduateModal');
        const modal = new bootstrap.Modal(modalElement);
        modal.show();
    });

    // Handle modal cleanup when closed
    const addGraduateModal = document.getElementById('addGraduateModal');
    if (addGraduateModal) {
        // Move focus away BEFORE Bootstrap sets aria-hidden during hide transition
        addGraduateModal.addEventListener('hide.bs.modal', function () {
            // Blur any focused element inside the modal
            if (document.activeElement && addGraduateModal.contains(document.activeElement)) {
                document.activeElement.blur();
            }
            // Move focus to body
            document.body.focus();
        });

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
        // Move focus away BEFORE Bootstrap sets aria-hidden during hide transition
        editGraduateModal.addEventListener('hide.bs.modal', function () {
            // Blur any focused element inside the modal
            if (document.activeElement && editGraduateModal.contains(document.activeElement)) {
                document.activeElement.blur();
            }
            // Move focus to body
            document.body.focus();
        });

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
        // Move focus away BEFORE Bootstrap sets aria-hidden during hide transition
        viewGraduateModal.addEventListener('hide.bs.modal', function () {
            // Blur any focused element inside the modal
            if (document.activeElement && viewGraduateModal.contains(document.activeElement)) {
                document.activeElement.blur();
            }
            // Move focus to body
            document.body.focus();
        });

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

    // Save new graduate button (use once to prevent multiple listeners)
    const saveNewGraduateBtn = document.getElementById('saveNewGraduateBtn');
    if (saveNewGraduateBtn && !saveNewGraduateBtn.dataset.listenerAttached) {
        saveNewGraduateBtn.dataset.listenerAttached = 'true';
        saveNewGraduateBtn.addEventListener('click', async function () {
            // Get form values
            const certification = document.getElementById('addGraduateCertification').value;
            const name = document.getElementById('addGraduateName').value.trim();
            const id = document.getElementById('addGraduateId').value.trim();
            const course = document.getElementById('addGraduateCourse').value;
            const graduatedDate = document.getElementById('addGraduateDate').value;
            const email = document.getElementById('addGraduateEmail').value.trim();
            const imageFile = document.getElementById('addGraduateImageInput').files[0];

            // Custom validation with toast notifications
            if (!certification) {
                showError('Please select a certification');
                return;
            }
            if (!name) {
                showError('Please enter the full name');
                return;
            }
            if (!id) {
                showError('Please enter the trainee ID');
                return;
            }
            if (!course) {
                showError('Please select a course');
                return;
            }
            if (!graduatedDate) {
                showError('Please select the graduation date');
                return;
            }
            if (!email) {
                showError('Please enter the email address');
                return;
            }
            // Validate email format
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                showError('Please enter a valid email address');
                return;
            }

            // Disable button to prevent double submission
            if (saveNewGraduateBtn.disabled) return;
            saveNewGraduateBtn.disabled = true;
            saveNewGraduateBtn.innerHTML = '<i class="bx bx-loader bx-spin"></i> Saving...';

            try {
                // Prepare form data for API
                const formData = new FormData();
                formData.append('name', name);
                formData.append('trainee_id', id);
                formData.append('course', course);
                formData.append('certification', certification);
                formData.append('graduation_date', graduatedDate);
                formData.append('email', email);

                // Add image if uploaded
                if (imageFile) {
                    formData.append('image', imageFile);
                }

                // Send to backend API
                const response = await fetch(`${config.api.baseUrl}/api/v1/graduates`, {
                    method: 'POST',
                    body: formData
                });

                const result = await response.json();

                if (result.success) {
                    // Close modal
                    const modal = bootstrap.Modal.getInstance(document.getElementById('addGraduateModal'));
                    modal.hide();

                    // Reset form
                    document.getElementById('addGraduateForm').reset();
                    document.getElementById('addGraduateImagePreview').src = '../assets/images/DEFAULT_AVATAR.png';

                    // Show success toast and reload page
                    showSuccess('Graduate added successfully!');
                    setTimeout(() => window.location.reload(), 1000);
                } else {
                    showError('Error saving graduate: ' + (result.message || 'Unknown error'));
                    saveNewGraduateBtn.disabled = false;
                    saveNewGraduateBtn.innerHTML = '<i class="bx bx-user-plus"></i> Add Graduate';
                }
            } catch (error) {
                console.error('Error saving graduate:', error);
                showError('Error saving graduate to database. Please try again.');
                saveNewGraduateBtn.disabled = false;
                saveNewGraduateBtn.innerHTML = '<i class="bx bx-user-plus"></i> Add Graduate';
            }
        });
    }

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

    // Store original values for change detection
    let originalGraduateData = {};

    document.querySelectorAll('.edit-graduate-btn').forEach(button => {
        button.addEventListener('click', function () {
            const name = this.getAttribute('data-name');
            const id = this.getAttribute('data-id');
            const course = this.getAttribute('data-course');
            const graduated = this.getAttribute('data-graduated');
            const email = this.getAttribute('data-email');
            const certification = this.getAttribute('data-certification');
            const image = this.getAttribute('data-image');

            // Store original values for comparison
            originalGraduateData = {
                name,
                id,
                course,
                graduated,
                email,
                certification: certification || 'NC II - SOCBCN220',
                image
            };

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

    // Delete graduate button handlers
    let graduateToDelete = null;

    document.querySelectorAll('.delete-graduate-btn').forEach(button => {
        button.addEventListener('click', function () {
            const name = this.getAttribute('data-name');
            const id = this.getAttribute('data-id');

            // Store the graduate info for deletion
            graduateToDelete = { name, id, button: this };

            // Update modal content
            document.getElementById('deleteGraduateName').textContent = name;
            document.getElementById('deleteGraduateId').textContent = 'ID: ' + id;
        });
    });

    // Confirm delete button
    document.getElementById('confirmDeleteGraduateBtn')?.addEventListener('click', async function () {
        if (!graduateToDelete) return;

        try {
            // Here you would call the API to delete from database
            // For now, we'll just remove the card from the DOM
            const card = graduateToDelete.button.closest('.col');

            if (card) {
                card.remove();

                // Re-initialize pagination after deletion
                initializePagination();

                // Close the modal
                const modal = bootstrap.Modal.getInstance(document.getElementById('deleteGraduateModal'));
                modal.hide();

                showSuccess('Graduate deleted successfully!');
            }

            graduateToDelete = null;
        } catch (error) {
            console.error('Error deleting graduate:', error);
            showError('Error deleting graduate. Please try again.');
        }
    });

    document.getElementById('confirmExportBtn').addEventListener('click', function () {

        const selectedCourses = Array.from(document.querySelectorAll('.export-course-filter:checked')).map(cb => cb.value);
        const selectedDate = document.getElementById('graduationDateFilter')?.value;

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

            const courseMatch = selectedCourses.length === 0 || selectedCourses.includes(course);

            // Check if graduation date matches selected date
            let dateMatch = true;
            if (selectedDate) {
                // Compare the graduation date with selected date
                // Assuming graduated is in format like "June 2026" or a date string
                dateMatch = graduated.includes(selectedDate) || graduated === selectedDate;
            }

            if (courseMatch && dateMatch) {
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
            // Get current values
            const currentData = {
                name: document.getElementById('editGraduateName').value,
                id: document.getElementById('editGraduateId').value,
                course: document.getElementById('editGraduateCourse').value,
                graduated: document.getElementById('editGraduateDate').value,
                email: document.getElementById('editGraduateEmail').value,
                certification: document.getElementById('editGraduateCertification').value
            };

            // Check if any changes were made
            const hasChanges =
                currentData.name !== originalGraduateData.name ||
                currentData.id !== originalGraduateData.id ||
                currentData.course !== originalGraduateData.course ||
                currentData.graduated !== originalGraduateData.graduated ||
                currentData.email !== originalGraduateData.email ||
                currentData.certification !== originalGraduateData.certification;

            if (!hasChanges) {
                showInfo('No changes detected');
                return;
            }

            showSuccess('Graduate information updated successfully!');

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


// Toast Notification Functions
function showSuccess(message) {
    showToast(message, 'success');
}

function showError(message) {
    showToast(message, 'error');
}

function showInfo(message) {
    showToast(message, 'info');
}

function showWarning(message) {
    showToast(message, 'warning');
}

function showToast(message, type = 'success') {
    const container = document.getElementById('toastContainer');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast-notification ${type}`;

    const icon = type === 'success' ? 'bx-check' :
        type === 'error' ? 'bx-x' :
            type === 'warning' ? 'bx-error-alt' : 'bxs-info-circle';

    toast.innerHTML = `
        <i class="bx ${icon} toast-icon"></i>
        <div class="toast-content">
            <div class="toast-message">${message}</div>
        </div>
    `;

    container.appendChild(toast);

    setTimeout(() => {
        toast.classList.add('hiding');
        setTimeout(() => toast.remove(), 300);
    }, 5000);
}
