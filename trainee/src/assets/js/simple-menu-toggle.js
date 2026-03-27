
(function () {
    'use strict';

    document.addEventListener('DOMContentLoaded', function () {
        setTimeout(function () {
            initializeMenuToggles();
        }, 200);
    });

    function initializeMenuToggles() {
        const menuToggles = document.querySelectorAll('.menu-toggle');

        menuToggles.forEach(function (toggle) {
            const newToggle = toggle.cloneNode(true);
            toggle.parentNode.replaceChild(newToggle, toggle);

            newToggle.addEventListener('click', function (e) {
                e.preventDefault();
                e.stopPropagation();

                const parentItem = this.closest('.menu-item');
                const submenu = this.nextElementSibling;

                if (submenu && submenu.classList.contains('menu-sub')) {
                    const isOpen = parentItem.classList.contains('open');

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

        const submenuLinks = document.querySelectorAll('.menu-sub .menu-link');
        submenuLinks.forEach(function (link) {
            link.addEventListener('click', function (e) {
                if (this.getAttribute('href') && this.getAttribute('href') !== 'javascript:void(0);') {
                    return true;
                }
            });
        });
    }
})();