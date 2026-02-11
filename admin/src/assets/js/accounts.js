/* Menu Toggle Script for Accounts Page */
document.addEventListener('DOMContentLoaded', function () {
    const menuToggleBtn = document.querySelector('.menu-toggle-btn');
    const layoutMenu = document.getElementById('layout-menu');
    const layoutOverlay = document.querySelector('.layout-overlay');
    const layoutContainer = document.querySelector('.layout-container');

    if (menuToggleBtn && layoutMenu) {
        menuToggleBtn.addEventListener('click', function (e) {
            e.preventDefault();
            layoutMenu.classList.toggle('menu-hidden');

            // Toggle class on layout container to expand content
            if (layoutContainer) {
                layoutContainer.classList.toggle('menu-collapsed');
            }
        });
    }

    // Also toggle when clicking the overlay
    if (layoutOverlay && layoutMenu) {
        layoutOverlay.addEventListener('click', function () {
            layoutMenu.classList.toggle('menu-hidden');

            // Toggle class on layout container
            if (layoutContainer) {
                layoutContainer.classList.toggle('menu-collapsed');
            }
        });
    }

    // Password Toggle for View Modal
    const toggleViewPassword = document.getElementById('toggleViewPassword');
    const viewPasswordInput = document.getElementById('viewTraineePassword');
    const viewPasswordIcon = document.getElementById('viewPasswordIcon');

    if (toggleViewPassword && viewPasswordInput && viewPasswordIcon) {
        toggleViewPassword.addEventListener('click', function () {
            // Toggle password visibility
            if (viewPasswordInput.type === 'password') {
                viewPasswordInput.type = 'text';
                viewPasswordIcon.classList.remove('bx-hide');
                viewPasswordIcon.classList.add('bx-show');
            } else {
                viewPasswordInput.type = 'password';
                viewPasswordIcon.classList.remove('bx-show');
                viewPasswordIcon.classList.add('bx-hide');
            }
        });
    }
});