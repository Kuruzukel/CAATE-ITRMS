(function () {
    'use strict';

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initToggle);
    } else {
        initToggle();
    }

    function initToggle() {

        const toggleButtons = document.querySelectorAll('.layout-menu-toggle, .menu-toggle-btn');

        toggleButtons.forEach((btn, index) => {

            btn.addEventListener('click', function (e) {
                e.preventDefault();
                e.stopPropagation();
                e.stopImmediatePropagation();

                const isSmallScreen = window.innerWidth < 1200;

                if (isSmallScreen) {
                    const html = document.documentElement;
                    const wasExpanded = html.classList.contains('layout-menu-expanded');

                    if (wasExpanded) {
                        html.classList.remove('layout-menu-expanded');
                    } else {
                        html.classList.add('layout-menu-expanded');
                    }
                } else {
                    const html = document.documentElement;
                    const wasCollapsed = html.classList.contains('layout-menu-collapsed');

                    if (wasCollapsed) {
                        html.classList.remove('layout-menu-collapsed');
                    } else {
                        html.classList.add('layout-menu-collapsed');
                    }
                }
            }, true);
        });
    }
})();