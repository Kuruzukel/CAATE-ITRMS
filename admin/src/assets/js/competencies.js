/* Competencies Page Functionality */

document.addEventListener('DOMContentLoaded', function () {
    let currentCourseCard = null;

    // When edit button is clicked, populate modal with course data
    document.querySelectorAll('.edit-course-btn').forEach(btn => {
        btn.addEventListener('click', function () {
            currentCourseCard = this.closest('.card');

            // Populate course info banner in modal body
            const badgeBannerEl = document.getElementById('editCourseBadgeBody');
            const titleBannerEl = document.getElementById('editCourseTitleBody');
            const durationBannerEl = document.getElementById('editCourseDurationBody');

            if (badgeBannerEl) badgeBannerEl.textContent = this.dataset.badge || '';
            if (titleBannerEl) titleBannerEl.textContent = this.dataset.title || '';
            if (durationBannerEl) {
                const durationSpan = durationBannerEl.querySelector('span');
                if (durationSpan) durationSpan.textContent = this.dataset.hours || '';
            }

            // Populate competency textareas if they exist
            const basicComp = document.getElementById('editBasicCompetencies');
            const commonComp = document.getElementById('editCommonCompetencies');
            const coreComp = document.getElementById('editCoreCompetencies');

            if (basicComp) basicComp.value = this.dataset.basicCompetencies || '';
            if (commonComp) commonComp.value = this.dataset.commonCompetencies || '';
            if (coreComp) coreComp.value = this.dataset.coreCompetencies || '';
        });
    });

    // Save changes
    document.getElementById('saveCourseBtn').addEventListener('click', function () {
        if (!currentCourseCard) return;

        // Get competency values
        const basicComp = document.getElementById('editBasicCompetencies');
        const commonComp = document.getElementById('editCommonCompetencies');
        const coreComp = document.getElementById('editCoreCompetencies');

        // Update button data attributes with competencies
        const editBtn = currentCourseCard.querySelector('.edit-course-btn');
        if (basicComp) editBtn.dataset.basicCompetencies = basicComp.value;
        if (commonComp) editBtn.dataset.commonCompetencies = commonComp.value;
        if (coreComp) editBtn.dataset.coreCompetencies = coreComp.value;

        // Close modal
        const modal = bootstrap.Modal.getInstance(document.getElementById('editCourseModal'));
        modal.hide();

        // Show success message
        alert('Competencies updated successfully!');
    });

    // Set current year in footer
    const yearSpan = document.getElementById('currentYear');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }

    // Menu toggle is handled by main.js - no need to duplicate here
});