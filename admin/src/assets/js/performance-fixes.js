(function () {
    'use strict';

    const originalAddEventListener = EventTarget.prototype.addEventListener;
    const passiveEvents = ['touchstart', 'touchmove', 'wheel', 'mousewheel'];

    EventTarget.prototype.addEventListener = function (type, listener, options) {
        if (passiveEvents.includes(type)) {
            if (typeof options === 'boolean') {
                options = {
                    capture: options,
                    passive: true
                };
            } else if (typeof options === 'object' && options !== null) {
                if (options.passive === undefined) {
                    options.passive = true;
                }
            } else {
                options = {
                    passive: true
                };
            }
        }

        return originalAddEventListener.call(this, type, listener, options);
    };

    let supportsPassive = false;
    try {
        const opts = Object.defineProperty({}, 'passive', {
            get: function () {
                supportsPassive = true;
                return true;
            }
        });
        window.addEventListener('testPassive', null, opts);
        window.removeEventListener('testPassive', null, opts);
    } catch (e) {

    }

    window.supportsPassiveEvents = supportsPassive;

    const rafScheduler = {
        reads: [],
        writes: [],
        scheduled: false,

        scheduleRead: function (callback) {
            this.reads.push(callback);
            this.schedule();
        },

        scheduleWrite: function (callback) {
            this.writes.push(callback);
            this.schedule();
        },

        schedule: function () {
            if (this.scheduled) return;
            this.scheduled = true;

            requestAnimationFrame(() => {

                const reads = this.reads.slice();
                this.reads = [];
                reads.forEach(fn => fn());

                const writes = this.writes.slice();
                this.writes = [];
                writes.forEach(fn => fn());

                this.scheduled = false;
            });
        }
    };

    window.rafScheduler = rafScheduler;

    if (supportsPassive) {

        const scrollElements = document.querySelectorAll('.layout-menu, .perfect-scrollbar');
        scrollElements.forEach(element => {
            if (element) {
                element.addEventListener('touchstart', function () { }, { passive: true });
                element.addEventListener('touchmove', function () { }, { passive: true });
                element.addEventListener('wheel', function () { }, { passive: true });
            }
        });
    }

    function debounce(func, wait, immediate) {
        let timeout;
        return function executedFunction() {
            const context = this;
            const args = arguments;
            const later = function () {
                timeout = null;
                if (!immediate) func.apply(context, args);
            };
            const callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) func.apply(context, args);
        };
    }

    function throttle(func, limit) {
        let inThrottle;
        return function () {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    window.debounce = debounce;
    window.throttle = throttle;

    let resizeTimer;
    window.addEventListener('resize', throttle(function () {

        const event = new Event('optimizedResize');
        window.dispatchEvent(event);
    }, 250), { passive: true });

    window.addEventListener('scroll', throttle(function () {

        const event = new Event('optimizedScroll');
        window.dispatchEvent(event);
    }, 100), { passive: true });

})();

document.addEventListener('DOMContentLoaded', function () {

    requestAnimationFrame(() => {

        const layoutMenu = document.getElementById('layout-menu');
        if (layoutMenu) {

            layoutMenu.dataset.cachedHeight = layoutMenu.offsetHeight;
            layoutMenu.dataset.cachedWidth = layoutMenu.offsetWidth;
        }
    });

    const images = document.querySelectorAll('img[data-src]');
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });

        images.forEach(img => imageObserver.observe(img));
    } else {

        images.forEach(img => {
            img.src = img.dataset.src;
            img.classList.remove('lazy');
        });
    }

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (prefersReducedMotion.matches) {
        document.body.classList.add('reduce-motion');
    }

    if (!document.getElementById('reduce-motion-styles')) {
        const style = document.createElement('style');
        style.id = 'reduce-motion-styles';
        style.textContent = `
            .reduce-motion *,
            .reduce-motion *::before,
            .reduce-motion *::after {
                animation-duration: 0.01ms !important;
                animation-iteration-count: 1 !important;
                transition-duration: 0.01ms !important;
                scroll-behavior: auto !important;
            }
        `;
        document.head.appendChild(style);
    }

    if ('fonts' in document) {
        document.fonts.ready.then(() => {
            document.body.classList.add('fonts-loaded');
        });
    }

    const cards = document.querySelectorAll('.card');
    cards.forEach(card => {
        card.style.contain = 'layout style paint';
    });
});

if (window.requestIdleCallback) {
    requestIdleCallback(() => {

        const nonCriticalElements = document.querySelectorAll('[data-lazy-init]');
        nonCriticalElements.forEach(el => {

            if (el.dataset.lazyInit) {
                const initFn = window[el.dataset.lazyInit];
                if (typeof initFn === 'function') {
                    initFn(el);
                }
            }
        });
    });
}