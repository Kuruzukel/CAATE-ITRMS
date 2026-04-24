/**
 * Global Search Functionality
 * Searches across trainees in applications, registrations, admissions, and accounts collections
 */

(function () {
    'use strict';

    // Configuration
    const API_BASE_URL = config.api.baseUrl;
    const SEARCH_DEBOUNCE_DELAY = 300; // milliseconds

    // DOM Elements
    let searchInput;
    let suggestionsDropdown;
    let debounceTimer;

    // Initialize when DOM is ready
    document.addEventListener('DOMContentLoaded', function () {
        initializeGlobalSearch();
    });

    /**
     * Initialize the global search functionality
     */
    function initializeGlobalSearch() {
        searchInput = document.getElementById('globalSearchInput');
        suggestionsDropdown = document.getElementById('searchSuggestionsDropdown');

        if (!searchInput || !suggestionsDropdown) {
            console.error('Global search elements not found');
            return;
        }

        // Add event listeners
        searchInput.addEventListener('input', handleSearchInput);
        searchInput.addEventListener('focus', handleSearchFocus);

        // Close dropdown when clicking outside
        document.addEventListener('click', function (e) {
            if (!searchInput.contains(e.target) && !suggestionsDropdown.contains(e.target)) {
                hideSuggestions();
            }
        });

        // Prevent dropdown from closing when clicking inside it
        suggestionsDropdown.addEventListener('click', function (e) {
            e.stopPropagation();
        });
    }

    /**
     * Handle search input with debouncing
     */
    function handleSearchInput(e) {
        const query = e.target.value.trim();

        // Clear previous timer
        clearTimeout(debounceTimer);

        if (query.length === 0) {
            hideSuggestions();
            return;
        }

        if (query.length < 2) {
            showMessage('Type at least 2 characters to search...');
            return;
        }

        // Show loading state
        showLoading();

        // Debounce the search
        debounceTimer = setTimeout(() => {
            performSearch(query);
        }, SEARCH_DEBOUNCE_DELAY);
    }

    /**
     * Handle search input focus
     */
    function handleSearchFocus(e) {
        const query = e.target.value.trim();
        if (query.length >= 2) {
            performSearch(query);
        }
    }

    /**
     * Perform the actual search across all collections
     */
    async function performSearch(query) {
        try {
            showLoading();

            // Search across all collections in parallel
            const [applications, registrations, admissions, accounts] = await Promise.all([
                searchCollection('applications', query),
                searchCollection('registrations', query),
                searchCollection('admissions', query),
                searchCollection('accounts', query)
            ]);

            // Combine and process results
            const results = processSearchResults({
                applications,
                registrations,
                admissions,
                accounts
            }, query);

            displayResults(results);

        } catch (error) {
            console.error('Search error:', error);
            showMessage('An error occurred while searching. Please try again.');
        }
    }

    /**
     * Search a specific collection
     */
    async function searchCollection(collectionName, query) {
        try {
            const token = localStorage.getItem('token');

            const response = await fetch(`${API_BASE_URL}/api/v1/${collectionName}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error(`Failed to fetch ${collectionName}`);
            }

            const data = await response.json();

            // Filter results based on name match
            const items = data.data || data[collectionName] || [];
            return items.filter(item => {
                const fullName = getFullName(item);
                return fullName.toLowerCase().includes(query.toLowerCase());
            });

        } catch (error) {
            console.error(`Error searching ${collectionName}:`, error);
            return [];
        }
    }

    /**
     * Get full name from item (handles different field structures)
     */
    function getFullName(item) {
        // Try different name field combinations
        if (item.fullName) return item.fullName;
        if (item.full_name) return item.full_name;
        if (item.name) return item.name;

        // Construct from first, middle, last names
        const firstName = item.firstName || item.first_name || '';
        const middleName = item.middleName || item.middle_name || '';
        const lastName = item.lastName || item.last_name || '';

        return `${firstName} ${middleName} ${lastName}`.trim();
    }

    /**
     * Process search results and group by trainee
     */
    function processSearchResults(collections, query) {
        const traineeMap = new Map();

        // Process each collection
        Object.entries(collections).forEach(([collectionName, items]) => {
            items.forEach(item => {
                const fullName = getFullName(item);
                const key = fullName.toLowerCase();

                if (!traineeMap.has(key)) {
                    traineeMap.set(key, {
                        name: fullName,
                        collections: new Set(),
                        data: {}
                    });
                }

                const trainee = traineeMap.get(key);
                trainee.collections.add(collectionName);
                trainee.data[collectionName] = item;
            });
        });

        // Convert map to array and sort by relevance
        return Array.from(traineeMap.values()).sort((a, b) => {
            // Sort by number of collections (more matches = more relevant)
            if (a.collections.size !== b.collections.size) {
                return b.collections.size - a.collections.size;
            }
            // Then alphabetically
            return a.name.localeCompare(b.name);
        });
    }

    /**
     * Display search results
     */
    function displayResults(results) {
        if (results.length === 0) {
            showNoResults();
            return;
        }

        let html = `
      <div class="search-suggestions-header">
        <h6>Search Results <span class="result-count-badge">${results.length}</span></h6>
      </div>
    `;

        results.forEach(result => {
            html += createResultItem(result);
        });

        suggestionsDropdown.innerHTML = html;
        showSuggestions();
    }

    /**
     * Create HTML for a single result item
     */
    function createResultItem(result) {
        const actions = [];

        // Add action buttons based on which collections the trainee appears in
        if (result.collections.has('accounts')) {
            actions.push({
                label: 'View Account',
                icon: 'bx-user',
                page: 'accounts.html',
                color: '#696cff'
            });
        }

        if (result.collections.has('applications')) {
            actions.push({
                label: 'View Application',
                icon: 'bx-file',
                page: 'application.html',
                color: '#03c3ec'
            });
        }

        if (result.collections.has('registrations')) {
            actions.push({
                label: 'View Registration',
                icon: 'bx-edit',
                page: 'registration.html',
                color: '#ffab00'
            });
        }

        if (result.collections.has('admissions')) {
            actions.push({
                label: 'View Admission',
                icon: 'bx-check-circle',
                page: 'admission.html',
                color: '#71dd37'
            });
        }

        // Also add requests option if they have any records
        if (result.collections.size > 0) {
            actions.push({
                label: 'View Requests',
                icon: 'bx-calendar',
                page: 'requests.html',
                color: '#8592a3'
            });
        }

        const actionsHtml = actions.map(action => `
      <a href="${action.page}" class="search-action-btn" style="border-color: ${action.color};">
        <i class="bx ${action.icon}"></i>
        ${action.label}
      </a>
    `).join('');

        return `
      <div class="search-result-item">
        <div class="search-result-name">${highlightMatch(result.name, searchInput.value)}</div>
        <div class="search-result-actions">
          ${actionsHtml}
        </div>
      </div>
    `;
    }

    /**
     * Highlight matching text in the result
     */
    function highlightMatch(text, query) {
        if (!query) return text;

        const regex = new RegExp(`(${escapeRegex(query)})`, 'gi');
        return text.replace(regex, '<span class="search-highlight">$1</span>');
    }

    /**
     * Escape special regex characters
     */
    function escapeRegex(string) {
        return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }

    /**
     * Show loading state
     */
    function showLoading() {
        suggestionsDropdown.innerHTML = `
      <div class="search-loading">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
        <p class="mt-2 mb-0">Searching...</p>
      </div>
    `;
        showSuggestions();
    }

    /**
     * Show no results message
     */
    function showNoResults() {
        suggestionsDropdown.innerHTML = `
      <div class="search-no-results">
        <i class="bx bx-search-alt"></i>
        <p class="mb-0">No trainees found matching your search.</p>
      </div>
    `;
        showSuggestions();
    }

    /**
     * Show custom message
     */
    function showMessage(message) {
        suggestionsDropdown.innerHTML = `
      <div class="search-no-results">
        <p class="mb-0">${message}</p>
      </div>
    `;
        showSuggestions();
    }

    /**
     * Show suggestions dropdown
     */
    function showSuggestions() {
        suggestionsDropdown.classList.add('show');
    }

    /**
     * Hide suggestions dropdown
     */
    function hideSuggestions() {
        suggestionsDropdown.classList.remove('show');
    }

})();
