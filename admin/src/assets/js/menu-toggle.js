/**
 * Custom Menu Toggle Script
 * Handles menu toggle on ALL screen sizes
 */

(function () {
    'use strict';

    // Wait for DOM to be ready
    document.addEventListener('DOMContentLoaded', function () {
        const layoutOverlay = document.querySelector('.layout-overlay');
        const menuToggleBtn = document.querySelector('.menu-toggle-btn');

        // Function to check if we're on a small screen
        function isSmallScreen() {
            return window.innerWidth < 1200;
        }

        // Toggle menu when clicking the hamburger button
        if (menuToggleBtn) {
            menuToggleBtn.addEventListener('click', function (e) {
                e.preventDefault();
                e.stopPropagation();

                if (isSmallScreen()) {
                    // On small screens, toggle expanded class
                    document.documentElement.classList.toggle('layout-menu-expanded');
                } else {
                    // On large screens, toggle collapsed class
                    document.documentElement.classList.toggle('layout-menu-collapsed');
                }
            });
        }

        // Close menu when clicking overlay
        if (layoutOverlay) {
            layoutOverlay.addEventListener('click', function (e) {
                e.preventDefault();
                e.stopPropagation();

                // Remove both classes to close menu
                document.documentElement.classList.remove('layout-menu-expanded');
                document.documentElement.classList.remove('layout-menu-collapsed');
            });
        }

        // Handle window resize - adjust classes appropriately
        function handleResize() {
            if (isSmallScreen()) {
                // On small screens, remove collapsed class
                document.documentElement.classList.remove('layout-menu-collapsed');
            } else {
                // On large screens, remove expanded class
                document.documentElement.classList.remove('layout-menu-expanded');
            }
        }

        // Listen for window resize
        window.addEventListener('resize', handleResize);

        // Initial check
        handleResize();
    });
})();
