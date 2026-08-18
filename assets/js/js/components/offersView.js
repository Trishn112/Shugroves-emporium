/**
 * Shugroves Emporium - Offers & Promotional Sale View
 * Displays pieces with active promotional pricing or archive privileges.
 * Seamless luxury editorial layout with filter pills and sorting.
 */

import { store } from '../store.js';
import { renderProductCard, attachTrendingCardListeners } from './trending.js';

export function renderOffersView(container, params = {}) {
  let activeCategory = params.category || 'all';
  let sortBy = params.sort || 'featured';

  function updateView() {
    let offerProducts = store.getOfferProducts();

    if (activeCategory !== 'all') {
      offerProducts = offerProducts.filter(p => p.category.toLowerCase() === activeCategory.toLowerCase());
    }

    if (sortBy === 'price-low') {
      offerProducts.sort((a, b) => (a.salePrice || a.price) - (b.salePrice || b.price));
    } else if (sortBy === 'price-high') {
      offerProducts.sort((a, b) => (b.salePrice || b.price) - (a.salePrice || a.price));
    }

    container.innerHTML = `
      <div class="collections-page">
        <!-- Offers Page Editorial Header -->
        <header class="collections-header">
          <div class="collections-header-inner">
            <span class="collections-eyebrow">Private Archive & Seasonal Privileges</span>
            <h1 class="collections-title">Seasonal Offers</h1>
            <p class="collections-description">
              Conscious slow-fashion creations and atelier archive silhouettes presented with seasonal privileges. All pieces are crafted in limited quantities with pure natural fibers.
            </p>

            <!-- Category Filter Tabs -->
            <div class="category-tabs">
              <button class="category-tab-btn ${activeCategory === 'all' ? 'tab-active' : ''}" data-cat="all">
                All Offers (${store.getOfferProducts().length})
              </button>
              <button class="category-tab-btn ${activeCategory === 'clothing' ? 'tab-active' : ''}" data-cat="clothing">
                Clothing & Knitwear
              </button>
              <button class="category-tab-btn ${activeCategory === 'bags' ? 'tab-active' : ''}" data-cat="bags">
                Leather & Bags
              </button>
              <button class="category-tab-btn ${activeCategory === 'shoes' ? 'tab-active' : ''}" data-cat="shoes">
                Footwear
              </button>
              <button class="category-tab-btn ${activeCategory === 'accessories' ? 'tab-active' : ''}" data-cat="accessories">
                Jewellery & Objects
              </button>
            </div>
          </div>
        </header>

        <div class="section-container" style="max-width: 1320px; margin: 0 auto; padding: 2rem 2.5rem 6rem;">
          <!-- Filter Count & Sort Row -->
          <div class="collections-action-row" style="display:flex; justify-content:space-between; align-items:center; margin-bottom: 2.5rem; border-bottom: 1px solid var(--border-subtle); padding-bottom: 1.2rem;">
            <span class="results-count" style="font-size:0.85rem; color:var(--text-charcoal-muted); letter-spacing:0.04em;">
              Displaying <strong>${offerProducts.length}</strong> privileged creations
            </span>

            <div class="sort-selector-wrap" style="display:flex; align-items:center; gap:0.6rem;">
              <label for="offersSortSelect" style="font-size:0.75rem; letter-spacing:0.1em; text-transform:uppercase; color:var(--text-charcoal-muted); font-weight:600;">Sort By:</label>
              <select id="offersSortSelect" class="filter-select" style="background:var(--bg-cream); border:1px solid var(--border-subtle); border-radius:20px; padding:0.4rem 1rem; font-size:0.8rem; color:var(--text-charcoal); cursor:pointer;">
                <option value="featured" ${sortBy === 'featured' ? 'selected' : ''}>Featured Privileges</option>
                <option value="price-low" ${sortBy === 'price-low' ? 'selected' : ''}>Price: Low to High</option>
                <option value="price-high" ${sortBy === 'price-high' ? 'selected' : ''}>Price: High to Low</option>
              </select>
            </div>
          </div>

          <!-- Product Grid -->
          ${offerProducts.length > 0 ? `
            <div class="product-grid product-grid-3" id="offersGrid">
              ${offerProducts.map(p => renderProductCard(p)).join('')}
            </div>
          ` : `
            <div class="empty-state-card" style="text-align:center; padding:5rem 2rem; background:var(--bg-cream-tint); border:1px solid var(--border-subtle); border-radius:18px;">
              <h3 class="empty-state-title" style="font-family:var(--font-serif); font-size:1.8rem; margin-bottom:0.6rem;">No offers in this category</h3>
              <p class="empty-state-desc" style="color:var(--text-charcoal-muted); max-width:480px; margin:0 auto 1.8rem; font-size:0.9rem;">Check back for seasonal release privileges or explore our core collection.</p>
              <a href="#collections" class="btn-primary" style="display:inline-block; padding:0.8rem 1.8rem; border-radius:24px;">Explore All Collections</a>
            </div>
          `}
        </div>
      </div>
    `;

    attachOffersListeners();
  }

  function attachOffersListeners() {
    attachTrendingCardListeners(container);

    const tabs = container.querySelectorAll('.category-tab-btn[data-cat]');
    tabs.forEach(btn => {
      btn.addEventListener('click', () => {
        activeCategory = btn.getAttribute('data-cat');
        updateView();
      });
    });

    const sortSelect = document.getElementById('offersSortSelect');
    if (sortSelect) {
      sortSelect.addEventListener('change', (e) => {
        sortBy = e.target.value;
        updateView();
      });
    }
  }

  updateView();
}
