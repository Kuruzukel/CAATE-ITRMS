/* Requests Page Script */
document.addEventListener('DOMContentLoaded', function () {
    // Fix passive event listeners for better performance
    if (typeof EventTarget !== 'undefined') {
        const originalAddEventListener = EventTarget.prototype.addEventListener;
        EventTarget.prototype.addEventListener = function (type, listener, options) {
            const passiveEvents = ['touchstart', 'touchmove', 'wheel', 'mousewheel'];
            if (passiveEvents.includes(type)) {
                if (typeof options === 'object' && options !== null) {
                    if (!('passive' in options)) {
                        options.passive = true;
                    }
                } else {
                    options = { passive: true, capture: typeof options === 'boolean' ? options : false };
                }
            }
            return originalAddEventListener.call(this, type, listener, options);
        };
    }

    // Update copyright year
    const currentYearElement = document.getElementById('currentYear');
    if (currentYearElement) {
        currentYearElement.textContent = new Date().getFullYear();
    }

    // Service Category and Type Filtering
    const serviceCategories = {
        'skincare': [
            { value: 'facial-treatment', text: 'Facial Treatment' },
            { value: 'skin-care-treatment', text: 'Skin Care Treatment' },
            { value: 'advanced-skin-care', text: 'Advanced Skin Care' },
            { value: 'collagen-treatment', text: 'Collagen Treatment' },
            { value: 'facial-peeling', text: 'Facial Peeling' }
        ],
        'haircare': [
            { value: 'hair-spa-treatment', text: 'Hair Spa Treatment' },
            { value: 'hairloss-treatment', text: 'Hairloss Treatment' }
        ],
        'nailcare': [
            { value: 'nail-care-service', text: 'Nail Care Service' }
        ],
        'bodytreatment': [
            { value: 'body-massage', text: 'Body Massage' }
        ],
        'aesthetic': [
            { value: 'permanent-makeup', text: 'Permanent Makeup' },
            { value: 'eyelash-extension', text: 'Eyelash Extension' },
            { value: 'eyebrow-threading', text: 'Eyebrow Threading' },
            { value: 'eyebrow-microblading', text: 'Eyebrow Microblading' },
            { value: 'aesthetic-consultation', text: 'Aesthetic Consultation' }
        ]
    };

    const filterServiceCategory = document.getElementById('filterServiceCategory');
    const filterServiceType = document.getElementById('filterServiceType');

    if (filterServiceCategory && filterServiceType) {
        // Initialize with all service types on page load
        Object.values(serviceCategories).flat().forEach(service => {
            const option = document.createElement('option');
            option.value = service.value;
            option.textContent = service.text;
            filterServiceType.appendChild(option);
        });

        // Listen for category changes
        filterServiceCategory.addEventListener('change', function () {
            const selectedCategory = this.value;

            // Clear current service type options
            filterServiceType.innerHTML = '<option value="">All Service Types</option>';

            if (selectedCategory && serviceCategories[selectedCategory]) {
                // Add service types for selected category
                serviceCategories[selectedCategory].forEach(service => {
                    const option = document.createElement('option');
                    option.value = service.value;
                    option.textContent = service.text;
                    filterServiceType.appendChild(option);
                });
            } else {
                // Show all service types if no category selected
                Object.values(serviceCategories).flat().forEach(service => {
                    const option = document.createElement('option');
                    option.value = service.value;
                    option.textContent = service.text;
                    filterServiceType.appendChild(option);
                });
            }
        });
    }

    // Menu toggle is handled by main.js
});
