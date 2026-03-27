var API_BASE_URL = window.location.origin + '/CAATE-ITRMS/backend/public/api/v1';

let courses = [];
let currentCourseId = null;
let currentCourseCard = null;
let editImageFile = null;
let originalCourseData = {};
let pendingStatusChange = null;

document.addEventListener('DOMContentLoaded', function () {

    const yearElement = document.getElementById('currentYear');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }

    loadCourses();

    initializeEditImageUpload();

    const editModal = document.getElementById('editCourseModal');
    editModal.addEventListener('hidden.bs.modal', function () {

        document.getElementById('editCourseForm').reset();

        editImageFile = null;
        resetEditImagePreview();

        document.getElementById('editImageInput').value = '';

        currentCourseId = null;
        currentCourseCard = null;
    });

    document.addEventListener('click', function (e) {
        if (e.target.closest('.edit-course-btn')) {
            const btn = e.target.closest('.edit-course-btn');
            currentCourseCard = btn.closest('.card');
            currentCourseId = btn.dataset.id;

            originalCourseData = {
                badge: btn.dataset.badge,
                title: btn.dataset.title,
                description: btn.dataset.description,
                hours: btn.dataset.hours,
                image: btn.dataset.image || ''
            };

            document.getElementById('editCourseBadge').value = originalCourseData.badge;
            document.getElementById('editCourseTitle').value = originalCourseData.title;
            document.getElementById('editCourseDescription').value = originalCourseData.description;
            document.getElementById('editCourseHours').value = originalCourseData.hours;

            const imageUrl = originalCourseData.image;
            if (imageUrl && imageUrl !== '') {
                loadExistingImage(imageUrl);
            } else {
                resetEditImagePreview();
            }
        }
    });

    document.getElementById('confirmStatusChangeBtn').addEventListener('click', async function () {
        if (!pendingStatusChange) return;

        const currentStatus = pendingStatusChange.buttonElement.dataset.status;
        const newStatus = pendingStatusChange.newStatus;

        if (currentStatus === newStatus) {

            const modal = bootstrap.Modal.getInstance(document.getElementById('enrollmentStatusModal'));
            if (modal) {
                modal.hide();
            }

            setTimeout(() => {
                const backdrops = document.querySelectorAll('.modal-backdrop');
                backdrops.forEach(backdrop => backdrop.remove());
                document.body.classList.remove('modal-open');
                document.body.style.overflow = '';
                document.body.style.paddingRight = '';
            }, 300);

            showToast('Enrollment status is already set to "' + newStatus + '"', 'info');
            pendingStatusChange = null;
            return;
        }

        document.body.focus();
        this.blur();

        const modal = bootstrap.Modal.getInstance(document.getElementById('enrollmentStatusModal'));
        if (modal) {
            modal.hide();
        }

        setTimeout(() => {
            const backdrops = document.querySelectorAll('.modal-backdrop');
            backdrops.forEach(backdrop => backdrop.remove());
            document.body.classList.remove('modal-open');
            document.body.style.overflow = '';
            document.body.style.paddingRight = '';
        }, 300);

        await updateEnrollmentStatus(
            pendingStatusChange.courseId,
            pendingStatusChange.newStatus,
            pendingStatusChange.buttonElement
        );

        pendingStatusChange = null;
    });

    document.getElementById('saveCourseBtn').addEventListener('click', async function () {
        if (!currentCourseId) return;

        const badge = document.getElementById('editCourseBadge').value.trim();
        const title = document.getElementById('editCourseTitle').value.trim();
        const description = document.getElementById('editCourseDescription').value.trim();
        const hours = document.getElementById('editCourseHours').value.trim();

        if (!badge || !title || !description || !hours) {
            showToast('Please fill in all required fields', 'error');
            return;
        }

        const hasTextChanges =
            badge !== String(originalCourseData.badge) ||
            title !== String(originalCourseData.title) ||
            description !== String(originalCourseData.description) ||
            hours !== String(originalCourseData.hours);

        const hasImageChange = editImageFile !== null;

        if (!hasTextChanges && !hasImageChange) {
            showToast('No changes were made to the course', 'info');
            return;
        }

        const courseData = {
            badge: badge,
            title: title,
            description: description,
            hours: hours
        };

        if (editImageFile) {
            const reader = new FileReader();
            reader.onload = async function (e) {
                courseData.image = e.target.result;
                await updateCourse(courseData);
            };
            reader.readAsDataURL(editImageFile);
        } else {

            courseData.image = originalCourseData.image;
            await updateCourse(courseData);
        }
    });

    document.addEventListener('click', function (e) {
        if (e.target.closest('.status-option')) {
            e.preventDefault();
            const statusOption = e.target.closest('.status-option');
            const newStatus = statusOption.dataset.status;
            const dropdownBtn = statusOption.closest('.dropdown').querySelector('.enrollment-status-btn');
            const courseId = dropdownBtn.dataset.id;

            pendingStatusChange = {
                courseId: courseId,
                newStatus: newStatus,
                buttonElement: dropdownBtn
            };

            const confirmBadge = document.getElementById('confirmStatusBadge');
            confirmBadge.textContent = newStatus;

            confirmBadge.className = 'badge fs-6 px-3 py-2';
            if (newStatus === 'Open Enrollment') {
                confirmBadge.classList.add('bg-success');
            } else if (newStatus === 'Closed') {
                confirmBadge.classList.add('bg-danger');
            } else {
                confirmBadge.classList.add('bg-secondary');
            }

            const modal = new bootstrap.Modal(document.getElementById('enrollmentStatusModal'));
            modal.show();
        }
    });

    const enrollmentModal = document.getElementById('enrollmentStatusModal');
    if (enrollmentModal) {

        enrollmentModal.addEventListener('hidden.bs.modal', function () {
            cleanupModalBackdrop();
            pendingStatusChange = null;
        });

        const cancelButtons = enrollmentModal.querySelectorAll('[data-bs-dismiss="modal"]');
        cancelButtons.forEach(btn => {
            btn.addEventListener('click', function () {
                cleanupModalBackdrop();
                pendingStatusChange = null;
            });
        });
    }

    function cleanupModalBackdrop() {

        const activeElement = document.activeElement;
        if (activeElement && activeElement.closest('.modal')) {

            document.body.focus();
            activeElement.blur();
        }

        setTimeout(() => {

            const backdrops = document.querySelectorAll('.modal-backdrop');
            backdrops.forEach(backdrop => backdrop.remove());

            document.body.classList.remove('modal-open');

            document.body.style.overflow = '';
            document.body.style.paddingRight = '';
            document.body.style.removeProperty('overflow');
            document.body.style.removeProperty('padding-right');

            document.querySelectorAll('.modal').forEach(modal => {
                modal.classList.remove('show');
                modal.style.display = 'none';
                modal.setAttribute('aria-hidden', 'true');
                modal.removeAttribute('aria-modal');
                modal.removeAttribute('role');
            });
        }, 100);
    }

});

async function updateCourse(courseData) {
    const saveBtn = document.getElementById('saveCourseBtn');
    const originalText = saveBtn.innerHTML;

    try {

        saveBtn.disabled = true;
        saveBtn.innerHTML = '<i class="bx bx-loader-alt bx-spin me-2"></i>Saving...';

        const response = await fetch(`${API_BASE_URL}/courses/${currentCourseId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(courseData)
        });

        const result = await response.json();

        if (result.success) {

            const modal = bootstrap.Modal.getInstance(document.getElementById('editCourseModal'));
            modal.hide();

            editImageFile = null;
            resetEditImagePreview();

            if (result.modified === false) {
                showToast('No changes were made to the course', 'info');
            } else {

                await loadCourses();
                showToast('Course updated successfully!', 'success');
            }
        } else {
            showToast(result.error || 'Failed to update course', 'error');
        }
    } catch (error) {
        console.error('Error updating course:', error);
        showToast('Error updating course. Please try again.', 'error');
    } finally {

        saveBtn.disabled = false;
        saveBtn.innerHTML = originalText;
    }
}

async function updateEnrollmentStatus(courseId, newStatus, buttonElement) {
    const originalText = buttonElement.innerHTML;

    try {

        buttonElement.disabled = true;
        buttonElement.innerHTML = '<i class="bx bx-loader-alt bx-spin"></i>';

        const response = await fetch(`${API_BASE_URL}/courses/${courseId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                enrollment_status: newStatus
            })
        });

        const result = await response.json();

        if (result.success) {

            let statusBadgeClass = 'bg-secondary';
            if (newStatus === 'Open Enrollment') {
                statusBadgeClass = 'bg-success';
            } else if (newStatus === 'Closed') {
                statusBadgeClass = 'bg-danger';
            }

            buttonElement.dataset.status = newStatus;
            buttonElement.innerHTML = `<span class="badge ${statusBadgeClass}">${newStatus}</span>`;

            showToast(`Enrollment status updated to "${newStatus}"`, 'success');
        } else {
            showToast(result.error || 'Failed to update enrollment status', 'error');
            buttonElement.innerHTML = originalText;
        }
    } catch (error) {
        console.error('Error updating enrollment status:', error);
        showToast('Error updating enrollment status. Please try again.', 'error');
        buttonElement.innerHTML = originalText;
    } finally {

        buttonElement.disabled = false;
    }
}

async function loadCourses() {
    const loadingSpinner = document.getElementById('loadingSpinner');
    const coursesGrid = document.getElementById('coursesGrid');

    try {
        const response = await fetch(`${API_BASE_URL}/courses`);

        const result = await response.json();

        if (result.success && result.data) {
            courses = result.data;

            renderCourses(courses);

            if (loadingSpinner) loadingSpinner.style.display = 'none';
            if (coursesGrid) coursesGrid.style.display = 'flex';
        } else {
            console.error('API returned error:', result);
            if (loadingSpinner) loadingSpinner.style.display = 'none';
            if (coursesGrid) {
                coursesGrid.style.display = 'block';
                coursesGrid.innerHTML = '<div class="col-12 text-center"><p>No courses found. Please add courses to the database.</p></div>';
            }
            showToast(result.error || 'No courses found', 'error');
        }
    } catch (error) {
        console.error('Error loading courses:', error);
        if (loadingSpinner) loadingSpinner.style.display = 'none';
        if (coursesGrid) {
            coursesGrid.style.display = 'block';
            coursesGrid.innerHTML = '<div class="col-12 text-center"><p class="text-danger">Error loading courses. Check console for details.</p></div>';
        }
        showToast('Error loading courses. Please check your connection.', 'error');
    }
}

function renderCourses(coursesData) {
    const container = document.getElementById('coursesGrid');
    if (!container) return;

    container.innerHTML = '';

    coursesData.forEach(course => {
        const courseId = course._id.$oid || course._id;
        const col = document.createElement('div');
        col.className = 'col';

        const badge = course.badge || course.course_code || 'N/A';
        const hours = course.hours || course.duration || 'N/A';

        let badgeClass = 'bg-primary';
        if (badge.includes('Level III')) {
            badgeClass = 'bg-info';
        } else if (badge.includes('Level I')) {
            badgeClass = 'bg-secondary';
        } else if (badge.includes('Specialized')) {
            badgeClass = 'bg-warning';
        } else if (badge.includes('NC II')) {
            badgeClass = 'bg-primary';
        }

        const imageUrl = course.image && course.image.trim() !== ''
            ? course.image
            : '../assets/images/CAATE_META_LOGO.png';

        const enrollmentStatus = course.enrollment_status || 'Unpublished';

        let statusBadgeClass = 'bg-secondary';
        if (enrollmentStatus === 'Open Enrollment') {
            statusBadgeClass = 'bg-success';
        } else if (enrollmentStatus === 'Closed') {
            statusBadgeClass = 'bg-danger';
        }

        col.innerHTML = `
            <div class="card h-100">
                <div class="position-relative">
                    <img src="${imageUrl}"
                        class="card-img-top" alt="${course.title}"
                        style="height: 200px; object-fit: cover;"
                        onerror="this.src='../assets/images/CAATE_META_LOGO.png'" />
                    <div class="position-absolute top-0 end-0 p-2">
                        <div class="dropdown">
                            <button class="btn btn-sm dropdown-toggle enrollment-status-btn px-2 py-1" 
                                type="button" 
                                data-bs-toggle="dropdown" 
                                aria-expanded="false"
                                data-id="${courseId}"
                                data-status="${enrollmentStatus}"
                                style="border: none; background: transparent;">
                                <span class="badge ${statusBadgeClass}">${enrollmentStatus}</span>
                            </button>
                            <ul class="dropdown-menu dropdown-menu-end">
                                <li><a class="dropdown-item status-option" href="#" data-status="Open Enrollment">
                                    <span class="badge bg-success me-2">Open Enrollment</span>
                                </a></li>
                                <li><a class="dropdown-item status-option" href="#" data-status="Closed">
                                    <span class="badge bg-danger me-2">Closed</span>
                                </a></li>
                                <li><a class="dropdown-item status-option" href="#" data-status="Unpublished">
                                    <span class="badge bg-secondary me-2">Unpublished</span>
                                </a></li>
                            </ul>
                        </div>
                    </div>
                </div>
                <div class="card-body d-flex flex-column">
                    <span class="badge ${badgeClass} mb-2 align-self-start">${badge}</span>
                    <h5 class="card-title">${course.title}</h5>
                    <p class="card-text grow">${course.description}</p>
                    <div class="d-flex justify-content-between align-items-center mt-3">
                        <small><i class="fas fa-clock me-1"></i> ${hours}</small>
                        <button class="btn btn-sm btn-outline-primary edit-course-btn"
                            data-bs-toggle="modal" data-bs-target="#editCourseModal"
                            data-id="${courseId}"
                            data-badge="${badge}"
                            data-title="${course.title}"
                            data-description="${course.description}"
                            data-hours="${hours}"
                            data-image="${course.image || ''}">
                            <i class="bx bx-edit"></i> Edit
                        </button>
                    </div>
                </div>
            </div>
        `;

        container.appendChild(col);
    });
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

function closeToast(button) {
    const toast = button.closest('.toast-notification');
    if (toast) {
        toast.classList.add('hiding');
        setTimeout(() => {
            toast.remove();
        }, 300);
    }
}

function initializeEditImageUpload() {
    const uploadArea = document.getElementById('editUploadArea');
    const imageInput = document.getElementById('editImageInput');
    const imagePreview = document.getElementById('editImagePreview');
    const noImageText = document.getElementById('editNoImageText');
    const imageActionButtons = document.getElementById('editImageActionButtons');
    const viewImageBtn = document.getElementById('editViewImageBtn');
    const removeImageBtn = document.getElementById('editRemoveImageBtn');

    uploadArea.addEventListener('click', () => {
        imageInput.click();
    });

    imageInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            handleEditImageFile(file);
        }
    });

    uploadArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadArea.classList.add('dragover');
    });

    uploadArea.addEventListener('dragleave', () => {
        uploadArea.classList.remove('dragover');
    });

    uploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadArea.classList.remove('dragover');
        const file = e.dataTransfer.files[0];
        if (file && file.type.startsWith('image/')) {
            handleEditImageFile(file);
        }
    });

    viewImageBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const imgSrc = imagePreview.src;
        if (imgSrc) {

            const modalImagePreview = document.getElementById('editModalImagePreview');
            modalImagePreview.src = imgSrc;

            const imagePreviewModalElement = document.getElementById('editImagePreviewModal');
            const imagePreviewModal = new bootstrap.Modal(imagePreviewModalElement);
            imagePreviewModal.show();

            imagePreviewModalElement.addEventListener('hidden.bs.modal', function handleModalClose() {

                document.body.classList.add('modal-open');

                setTimeout(() => {
                    const backdrops = document.querySelectorAll('.modal-backdrop');
                    if (backdrops.length === 0) {
                        const backdrop = document.createElement('div');
                        backdrop.className = 'modal-backdrop fade show';
                        document.body.appendChild(backdrop);
                    } else if (backdrops.length > 1) {

                        for (let i = 1; i < backdrops.length; i++) {
                            backdrops[i].remove();
                        }
                    }
                }, 100);
            }, { once: true });
        }
    });

    removeImageBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        resetEditImagePreview();
        editImageFile = null;
        imageInput.value = '';
    });
}

function handleEditImageFile(file) {

    if (file.size > 5 * 1024 * 1024) {
        showToast('Image size must be less than 5MB', 'error');
        return;
    }

    if (!file.type.startsWith('image/')) {
        showToast('Please select a valid image file', 'error');
        return;
    }

    editImageFile = file;

    const fileSizeKB = (file.size / 1024).toFixed(2);
    const fileSizeMB = (file.size / (1024 * 1024)).toFixed(2);
    const sizeText = file.size > 1024 * 1024 ? `${fileSizeMB} MB` : `${fileSizeKB} KB`;

    const reader = new FileReader();
    reader.onload = (e) => {
        const imagePreview = document.getElementById('editImagePreview');
        const noImageText = document.getElementById('editNoImageText');
        const imageActionButtons = document.getElementById('editImageActionButtons');

        imagePreview.src = e.target.result;
        imagePreview.style.display = 'block';
        noImageText.style.display = 'none';
        imageActionButtons.style.display = 'flex';

        showToast(`Image loaded: ${file.name} (${sizeText})`, 'success');
    };
    reader.readAsDataURL(file);
}

function loadExistingImage(imageUrl) {
    const imagePreview = document.getElementById('editImagePreview');
    const noImageText = document.getElementById('editNoImageText');
    const imageActionButtons = document.getElementById('editImageActionButtons');

    if (imageUrl && imageUrl !== '') {
        imagePreview.src = imageUrl;
        imagePreview.style.display = 'block';
        noImageText.style.display = 'none';
        imageActionButtons.style.display = 'flex';
    } else {
        resetEditImagePreview();
    }
}

function resetEditImagePreview() {
    const imagePreview = document.getElementById('editImagePreview');
    const noImageText = document.getElementById('editNoImageText');
    const imageActionButtons = document.getElementById('editImageActionButtons');

    imagePreview.src = '';
    imagePreview.style.display = 'none';
    noImageText.style.display = 'block';
    imageActionButtons.style.display = 'none';
}
