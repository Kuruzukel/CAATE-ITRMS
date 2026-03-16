/**
 * Simple Menu Toggle - Fix for menu functionality
 */
(function () {
    'use strict';

    document.addEventListener('DOMContentLoaded', function () {
        // Wait for other scripts to load
        setTimeout(function () {
            initializeMenuToggles();
        }, 200);
    });

    function initializeMenuToggles() {
        const menuToggles = document.querySelectorAll('.menu-toggle');

        menuToggles.forEach(function (toggle) {
            // Remove existing event listeners by cloning
            const newToggle = toggle.cloneNode(true);
            toggle.parentNode.replaceChild(newToggle, toggle);

            newToggle.addEventListener('click', function (e) {
                e.preventDefault();
                e.stopPropagation();

                const parentItem = this.closest('.menu-item');
                const submenu = this.nextElementSibling;

                if (submenu && submenu.classList.contains('menu-sub')) {
                    const isOpen = parentItem.classList.contains('open');

                    // Close all other menu items
                    document.querySelectorAll('.menu-item.open').forEach(function (item) {
                        if (item !== parentItem) {
                            item.classList.remove('open');
                            const otherSubmenu = item.querySelector('.menu-sub');
                            const otherToggle = item.querySelector('.menu-toggle');
                            if (otherSubmenu) {
                                otherSubmenu.style.display = 'none';
                            }
                            if (otherToggle) {
                                otherToggle.classList.remove('open');
                            }
                        }
                    });

                    // Toggle current menu
                    if (isOpen) {
                        parentItem.classList.remove('open');
                        this.classList.remove('open');
                        submenu.style.display = 'none';
                    } else {
                        parentItem.classList.add('open');
                        this.classList.add('open');
                        submenu.style.display = 'block';
                    }
                }
            });
        });

        // Make sure submenu links are clickable
        const submenuLinks = document.querySelectorAll('.menu-sub .menu-link');
        submenuLinks.forEach(function (link) {
            link.addEventListener('click', function (e) {
                // Allow normal navigation for submenu links
                if (this.getAttribute('href') && this.getAttribute('href') !== 'javascript:void(0);') {
                    // Let the browser handle the navigation
                    return true;
                }
            });
        });
    }
})();