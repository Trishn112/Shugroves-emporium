/**
 * Shugroves Emporium - Collections & Multi-Faceted Filter Component
 * Real database-driven product browser with category pills, live filters, and sorting.
 */

import { store } from '../store.js';
import { renderProductCard, attachTrendingCardListeners } from './trending.js';

export function renderCollections(container, params = {}) {
  const activeCategory = params.category || 'all';
  const activeFilterTag = params.filter || null;

  // Filter state
  let currentFilters = {
    category: activeCategory !== 'all' ? activeCategory : undefined,
    size: params.size || 'all',
    color: params.color || 'all',
    material: params.material || 'all',
    sort: params.sort || 'featured',
    inStockOnly: params.inStock === 'true',
    search: params.search || ''
  };

  // If specific curated tag filter was provided
  if (activeFilterTag === 'autumn-winter') {
    currentFilters.search = 'autumn';
  } else if (activeFilterTag === 'linen') {
    currentFilters.material = 'linen';
  }

  function getTitle() {
    if (activeCategory === 'clothing') return 'Clothing & Tailoring';
    if (activeCategory === 'bags') return 'Leather & Suede Bags';
    if (activeCategory === 'shoes') return 'Artisanal Footwear';
    if (activeCategory === 'accessories') return 'Sculptural Jewellery';
    if (activeFilterTag === 'autumn-winter') return "Autumn / Winter '26 Edit";
    if (activeFilterTag === 'linen') return 'The Pure Belgian Linen Edit';
    return 'All Creations';
  }

  function updateView() {
    const products = store.getProducts(currentFilters);

    container.innerHTML = `
      <div class="collections-page">
        <!-- Collection Header -->
        <header class="collections-header">
          <div class="collections-header-inner">
            <span class="collections-eyebrow">Autumn / Winter '26</span>
            <h1 class="collections-title">${getTitle()}</h1>
            <p class="collections-description">
              Garments and objects shaped by raw materiality, conscious slow craftsmanship, and enduring ease.
            </p>

            <!-- Category Navigation Tabs -->
            <div class="category-tabs">
              <a href="#collections" class="category-tab-btn ${activeCategory === 'all' && !activeFilterTag ? 'tab-active' : ''}">All</a>
              <a href="#collections?category=clothing" class="category-tab-btn ${activeCategory === 'clothing' ? 'tab-active' : ''}">Clothing</a>
              <a href="#collections?category=bags" class="category-tab-btn ${activeCategory === 'bags' ? 'tab-active' : ''}">Bags</a>
              <a href="#collections?category=shoes" class="category-tab-btn ${activeCategory === 'shoes' ? 'tab-active' : ''}">Footwear</a>
              <a href="#collections?category=accessories" class="category-tab-btn ${activeCategory === 'accessories' ? 'tab-active' : ''}">Jewellery</a>
              <a href="#collections?filter=linen" class="category-tab-btn ${activeFilterTag === 'linen' ? 'tab-active' : ''}">Linen Edit</a>
            </div>
          </div>
        </header>

        <!-- Filter Bar & Grid Container -->
        <div class="collections-layout">
          <!-- Filter Controls Bar -->
          <div class="filter-controls-bar">
            <div class="filter-controls-left">
              <span class="results-count">Showing <strong>${products.length}</strong> creations</span>
              
              <!-- Quick Filter Dropdowns -->
              <div class="filter-select-wrap">
                <select id="filterSizeSelect" class="filter-select" aria-label="Filter by Size">
                  <option value="all" ${currentFilters.size === 'all' ? 'selected' : ''}>Size: All</option>
                  <option value="XS" ${currentFilters.size === 'XS' ? 'selected' : ''}>XS</option>
                  <option value="S" ${currentFilters.size === 'S' ? 'selected' : ''}>S</option>
                  <option value="M" ${currentFilters.size === 'M' ? 'selected' : ''}>M</option>
                  <option value="L" ${currentFilters.size === 'L' ? 'selected' : ''}>L</option>
                  <option value="XL" ${currentFilters.size === 'XL' ? 'selected' : ''}>XL</option>
                  <option value="One Size" ${currentFilters.size === 'One Size' ? 'selected' : ''}>One Size</option>
                </select>
              </div>

              <div class="filter-select-wrap">
                <select id="filterColorSelect" class="filter-select" aria-label="Filter by Color">
                  <option value="all" ${currentFilters.color === 'all' ? 'selected' : ''}>Color: All</option>
                  <option value="Terracotta" ${currentFilters.color === 'Terracotta' ? 'selected' : ''}>Dusty Terracotta</option>
                  <option value="Sage" ${currentFilters.color === 'Sage' ? 'selected' : ''}>Sage Green</option>
                  <option value="Cream" ${currentFilters.color === 'Cream' ? 'selected' : ''}>Warm Cream</option>
                  <option value="Mustard" ${currentFilters.color === 'Mustard' ? 'selected' : ''}>Mustard Gold</option>
                </select>
              </div>

              <div class="filter-checkbox-wrap">
                <label class="checkbox-label">
                  <input type="checkbox" id="filterInStock" ${currentFilters.inStockOnly ? 'checked' : ''}>
                  <span>In Stock Only</span>
                </label>
              </div>
            </div>

            <div class="filter-controls-right">
              <label class="sort-label" for="sortSelect">Sort:</label>
              <select id="sortSelect" class="filter-select sort-select">
                <option value="featured" ${currentFilters.sort === 'featured' ? 'selected' : ''}>Featured</option>
                <option value="newest" ${currentFilters.sort === 'newest' ? 'selected' : ''}>New Arrivals</option>
                <option value="bestseller" ${currentFilters.sort === 'bestseller' ? 'selected' : ''}>Best Selling</option>
                <option value="price-low" ${currentFilters.sort === 'price-low' ? 'selected' : ''}>Price: Low &rarr; High</option>
                <option value="price-high" ${currentFilters.sort === 'price-high' ? 'selected' : ''}>Price: High &rarr; Low</option>
              </select>
            </div>
          </div>

          <!-- Product Grid or Empty State -->
          ${products.length > 0 ? `
            <div class="product-grid product-grid-4 collections-grid" id="collectionsGrid">
              ${products.map(p => renderProductCard(p)).join('')}
            </div>
          ` : `
            <div class="empty-state-card">
              <div class="empty-state-icon">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="8" y1="12" x2="16" y2="12"></line>
                </svg>
              </div>
              <h3 class="empty-state-title">No creations found</h3>
              <p class="empty-state-desc">We could not find any pieces matching your selected filters.</p>
              <button class="btn-primary" id="resetFiltersBtn">Reset Filters</button>
            </div>
          `}
        </div>
      </div>
    `;

    attachCollectionsListeners();
  }

  function attachCollectionsListeners() {
    attachTrendingCardListeners(container);

    const sizeSelect = document.getElementById('filterSizeSelect');
    if (sizeSelect) {
      sizeSelect.addEventListener('change', (e) => {
        currentFilters.size = e.target.value;
        updateView();
      });
    }

    const colorSelect = document.getElementById('filterColorSelect');
    if (colorSelect) {
      colorSelect.addEventListener('change', (e) => {
        currentFilters.color = e.target.value;
        updateView();
      });
    }

    const inStockCheck = document.getElementById('filterInStock');
    if (inStockCheck) {
      inStockCheck.addEventListener('change', (e) => {
        currentFilters.inStockOnly = e.target.checked;
        updateView();
      });
    }

    const sortSelect = document.getElementById('sortSelect');
    if (sortSelect) {
      sortSelect.addEventListener('change', (e) => {
        currentFilters.sort = e.target.value;
        updateView();
      });
    }

    const resetBtn = document.getElementById('resetFiltersBtn');
    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        currentFilters = {
          category: activeCategory !== 'all' ? activeCategory : undefined,
          size: 'all',
          color: 'all',
          material: 'all',
          sort: 'featured',
          inStockOnly: false,
          search: ''
        };
        updateView();
      });
    }
  }

  updateView();
}
