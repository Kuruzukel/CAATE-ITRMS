/**
 * Custom Menu Toggle Script - Close Button and Overlay Handler
 * Handles menu close button and overlay clicks
 * Main toggle logic is in main.js to avoid conflicts
 */

(function () {
    'use strict';

    // Wait for DOM to be ready
    document.addEventListener('DOMContentLoaded', function () {
        const layoutOverlay = document.querySelector('.layout-overlay');
        const menuCloseBtn = document.querySelector('.menu-close-btn');

        // Function to check if we're on a small screen
        function isSmallScreen() {
            return window.innerWidth < 1200;
        }

        // Function to close menu
        function closeMenu() {
            document.documentElement.classList.remove('layout-menu-expanded');
            document.documentElement.classList.remove('layout-menu-collapsed');
        }

        // Close button functionality
        if (menuCloseBtn) {
            menuCloseBtn.addEventListener('click', function (e) {
                e.preventDefault();
                e.stopPropagation();
                closeMenu();
            });
        }

        // Close menu when clicking overlay
        if (layoutOverlay) {
            layoutOverlay.addEventListener('click', function (e) {
                e.preventDefault();
                e.stopPropagation();
                closeMenu();
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

        // Listen for window resize with debounce
        let resizeTimer;
        window.addEventListener('resize', function () {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(handleResize, 100);
        });

        // Initial check
        handleResize();
    });
})();
