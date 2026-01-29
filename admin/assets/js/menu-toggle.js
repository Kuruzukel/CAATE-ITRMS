/**
 * Custom Menu Toggle Script
 * Handles hamburger menu toggle functionality for all screen sizes
 */

document.addEventListener('DOMContentLoaded', function () {
    const menuToggle = document.querySelector('.layout-menu-toggle');
    const layoutMenu = document.getElementById('layout-menu');
    const layoutContainer = document.querySelector('.layout-container');
    const layoutOverlay = document.querySelector('.layout-overlay');

    // Toggle menu when clicking hamburger icon
    if (menuToggle && layoutMenu) {
        menuToggle.addEventListener('click', function (e) {
            e.preventDefault();
            layoutMenu.classList.toggle('menu-hidden');

            // Toggle class on layout container to expand content
            if (layoutContainer) {
                layoutContainer.classList.toggle('menu-collapsed');
            }
        });
    }

    // Toggle menu when clicking overlay
    if (layoutOverlay && layoutMenu) {
        layoutOverlay.addEventListener('click', function () {
            layoutMenu.classList.toggle('menu-hidden');

            // Toggle class on layout container to expand content
            if (layoutContainer) {
                layoutContainer.classList.toggle('menu-collapsed');
            }
        });
    }
});
