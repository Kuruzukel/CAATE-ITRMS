(function () {
    'use strict';

    const API_BASE_URL = config.api.baseUrl + '/api/v1';
    const SEARCH_DEBOUNCE_DELAY = 300;

    let searchInput;
    let suggestionsDropdown;
    let debounceTimer;

    document.addEventListener('DOMContentLoaded', function () {
        initializeGlobalSearch();
    });

    function initializeGlobalSearch() {
        searchInput = document.getElementById('globalSearchInput');
        suggestionsDropdown = document.getElementById('searchSuggestionsDropdown');

        if (!searchInput || !suggestionsDropdown) {
            console.error('Global search elements not found');
            return;
        }

        searchInput.addEventListener('input', handleSearchInput);
        searchInput.addEventListener('focus', handleSearchFocus);

        document.addEventListener('click', function (e) {
            if (!searchInput.contains(e.target) && !suggestionsDropdown.contains(e.target)) {
                hideSuggestions();
            }
        });

        suggestionsDropdown.addEventListener('click', function (e) {
            e.stopPropagation();
        });
    }

    function handleSearchInput(e) {
        const query = e.target.value.trim();

        clearTimeout(debounceTimer);

        if (query.length === 0) {
            hideSuggestions();
            return;
        }

        if (query.length < 2) {
            showMessage('Type at least 2 characters to search...');
            return;
        }

        showLoading();

        debounceTimer = setTimeout(() => {
            performSearch(query);
        }, SEARCH_DEBOUNCE_DELAY);
    }

    function handleSearchFocus(e) {
        const query = e.target.value.trim();
        if (query.length >= 2) {
            performSearch(query);
        }
    }

    async function performSearch(query) {
        try {
            showLoading();

            const [trainees, applications, registrations, admissions] = await Promise.all([
                searchCollection('trainees', query),
                searchCollection('applications', query),
                searchCollection('registrations', query),
                searchCollection('admissions', query)
            ]);

            const results = processSearchResults({
                accounts: trainees,
                applications,
                registrations,
                admissions
            }, query);

            displayResults(results);

        } catch (error) {
            console.error('Search error:', error);
            showMessage('An error occurred while searching. Please try again.');
        }
    }

    async function searchCollection(collectionName, query) {
        try {
            const token = localStorage.getItem('token');

            const response = await fetch(`${API_BASE_URL}/${collectionName}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                console.warn(`Failed to fetch ${collectionName}: ${response.status}`);
                return [];
            }

            const contentType = response.headers.get('content-type');
            if (!contentType || !contentType.includes('application/json')) {
                console.warn(`${collectionName} returned non-JSON response`);
                return [];
            }

            const data = await response.json();

            let items = [];
            if (data.success && data.data) {
                items = data.data;
            } else if (Array.isArray(data)) {
                items = data;
            } else if (data[collectionName]) {
                items = data[collectionName];
            }

            return items.filter(item => {
                const fullName = getFullName(item);
                return fullName.toLowerCase().includes(query.toLowerCase());
            });

        } catch (error) {
            console.error(`Error searching ${collectionName}:`, error);
            return [];
        }
    }

    function getFullName(item) {
        if (item.fullName) return item.fullName;
        if (item.full_name) return item.full_name;
        if (item.name) return item.name;

        const firstName = item.firstName || item.first_name || '';
        const middleName = item.middleName || item.middle_name || '';
        const lastName = item.lastName || item.last_name || '';

        return `${firstName} ${middleName} ${lastName}`.trim();
    }

    function processSearchResults(collections, query) {
        const traineeMap = new Map();

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

        return Array.from(traineeMap.values()).sort((a, b) => {
            if (a.collections.size !== b.collections.size) {
                return b.collections.size - a.collections.size;
            }
            return a.name.localeCompare(b.name);
        });
    }

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

    function createResultItem(result) {
        const actions = [];

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

    function highlightMatch(text, query) {
        if (!query) return text;

        const regex = new RegExp(`(${escapeRegex(query)})`, 'gi');
        return text.replace(regex, '<span class="search-highlight">$1</span>');
    }

    function escapeRegex(string) {
        return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }

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

    function showNoResults() {
        suggestionsDropdown.innerHTML = `
      <div class="search-no-results">
        <i class="bx bx-search-alt"></i>
        <p class="mb-0">No trainees found matching your search.</p>
      </div>
    `;
        showSuggestions();
    }

    function showMessage(message) {
        suggestionsDropdown.innerHTML = `
      <div class="search-no-results">
        <p class="mb-0">${message}</p>
      </div>
    `;
        showSuggestions();
    }

    function showSuggestions() {
        suggestionsDropdown.classList.add('show');
    }

    function hideSuggestions() {
        suggestionsDropdown.classList.remove('show');
    }

})();
