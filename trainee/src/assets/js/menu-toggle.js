

(function () {
    'use strict';

    document.addEventListener('DOMContentLoaded', function () {
        const layoutOverlay = document.querySelector('.layout-overlay');
        const menuCloseBtn = document.querySelector('.menu-close-btn');

        function isSmallScreen() {
            return window.innerWidth < 1200;
        }

        function closeMenu() {
            document.documentElement.classList.remove('layout-menu-expanded');
            document.documentElement.classList.remove('layout-menu-collapsed');
        }

        if (menuCloseBtn) {
            menuCloseBtn.addEventListener('click', function (e) {
                e.preventDefault();
                e.stopPropagation();
                closeMenu();
            });
        }

        if (layoutOverlay) {
            layoutOverlay.addEventListener('click', function (e) {
                e.preventDefault();
                e.stopPropagation();
                closeMenu();
            });
        }

        function handleResize() {
            if (isSmallScreen()) {
                document.documentElement.classList.remove('layout-menu-collapsed');
            } else {
                document.documentElement.classList.remove('layout-menu-expanded');
            }
        }

        let resizeTimer;
        window.addEventListener('resize', function () {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(handleResize, 100);
        });

        handleResize();
    });
})();
