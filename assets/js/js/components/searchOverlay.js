/**
 * Shugroves Emporium - Fullscreen Live Search Overlay
 * Instant multi-field querying with trending pills and real-time result cards.
 */

import { store } from '../store.js';

export function renderSearchOverlay(container) {
  const TRENDING_SEARCHES = [
    "Linen",
    "Dresses",
    "Saddle Bag",
    "Merino Wool",
    "Terracotta",
    "Artisanal Jewellery"
  ];

  container.innerHTML = `
    <div class="search-overlay-backdrop" id="searchBackdrop"></div>
    <div class="search-overlay-dialog">
      <!-- Search Top Bar -->
      <div class="search-top-bar">
        <div class="search-input-wrap">
          <svg class="search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
          <input 
            type="text" 
            class="search-input-field" 
            id="globalSearchInput" 
            placeholder="Search by garment, textile, dye, or category..."
            autocomplete="off"
          >
          <button class="search-clear-btn" id="searchClearBtn" aria-label="Clear Search">&times;</button>
        </div>
        <button class="search-close-btn" id="searchOverlayClose" aria-label="Close Search">&times;</button>
      </div>

      <!-- Trending Search Tags -->
      <div class="search-trending-section" id="searchTrendingSection">
        <span class="trending-label">Trending Searches:</span>
        <div class="trending-pills-list">
          ${TRENDING_SEARCHES.map(tag => `
            <button class="trending-pill-btn" data-query="${tag}">${tag}</button>
          `).join('')}
        </div>
      </div>

      <!-- Live Search Results Container -->
      <div class="search-results-section" id="searchResultsSection">
        <div class="search-results-grid" id="searchResultsGrid">
          <!-- Populated in real-time -->
        </div>
      </div>
    </div>
  `;

  attachSearchListeners(container);
}

function attachSearchListeners(container) {
  const input = document.getElementById('globalSearchInput');
  const clearBtn = document.getElementById('searchClearBtn');
  const closeBtn = document.getElementById('searchOverlayClose');
  const backdrop = document.getElementById('searchBackdrop');
  const resultsGrid = document.getElementById('searchResultsGrid');
  const trendingSection = document.getElementById('searchTrendingSection');

  const closeSearch = () => {
    container.classList.remove('search-open');
    document.body.classList.remove('scroll-locked');
    if (input) input.value = '';
    if (resultsGrid) resultsGrid.innerHTML = '';
    if (trendingSection) trendingSection.style.display = 'block';
  };

  if (closeBtn) closeBtn.addEventListener('click', closeSearch);
  if (backdrop) backdrop.addEventListener('click', closeSearch);

  if (clearBtn && input) {
    clearBtn.addEventListener('click', () => {
      input.value = '';
      input.focus();
      resultsGrid.innerHTML = '';
      trendingSection.style.display = 'block';
    });
  }

  const performSearch = (query) => {
    const cleanQuery = query.trim();
    if (!cleanQuery) {
      resultsGrid.innerHTML = '';
      trendingSection.style.display = 'block';
      return;
    }

    trendingSection.style.display = 'none';
    const matches = store.getProducts({ search: cleanQuery });

    if (matches.length > 0) {
      resultsGrid.innerHTML = `
        <div class="search-results-header">
          <span>Found <strong>${matches.length}</strong> creations for "${cleanQuery}"</span>
        </div>
        <div class="search-cards-list">
          ${matches.map(product => `
            <a href="#product/${product.slug}" class="search-product-card" onclick="document.getElementById('searchOverlay').classList.remove('search-open'); document.body.classList.remove('scroll-locked');">
              <img src="${product.thumbnail || product.images[0]}" alt="${product.name}">
              <div class="search-product-meta">
                <span class="search-prod-cat">${product.material}</span>
                <h4 class="search-prod-name">${product.name}</h4>
                <p class="search-prod-price">₹${(product.salePrice || product.price).toLocaleString('en-IN')}</p>
              </div>
            </a>
          `).join('')}
        </div>
      `;
    } else {
      resultsGrid.innerHTML = `
        <div class="search-no-results">
          <p>No creations match "<strong>${cleanQuery}</strong>".</p>
          <span class="search-suggestion-hint">Try searching for 'Linen', 'Terracotta', 'Merino', or 'Coat'.</span>
        </div>
      `;
    }
  };

  if (input) {
    input.addEventListener('input', (e) => {
      performSearch(e.target.value);
    });
  }

  // Trending Pill Click
  const pills = container.querySelectorAll('.trending-pill-btn');
  pills.forEach(pill => {
    pill.addEventListener('click', () => {
      const q = pill.getAttribute('data-query');
      if (input) {
        input.value = q;
        performSearch(q);
      }
    });
  });
}
