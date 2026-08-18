/**
 * Shugroves Emporium - Wishlist View / Drawer Component
 * Persistent wishlist management with "Move to Bag" and stock indicators.
 */

import { store } from '../store.js';
import { showToast } from './toast.js';

export function renderWishlistView(container) {
  const wishlistProducts = store.getWishlistProducts();

  container.innerHTML = `
    <div class="wishlist-page">
      <header class="collections-header">
        <div class="collections-header-inner">
          <span class="collections-eyebrow">Personal Curation</span>
          <h1 class="collections-title">Saved Wishlist</h1>
          <p class="collections-description">
            Your saved pieces crafted from organic linens, vegetal dyes, and artisanal materials.
          </p>
        </div>
      </header>

      <div class="section-container">
        ${wishlistProducts.length > 0 ? `
          <div class="wishlist-grid">
            ${wishlistProducts.map(product => {
              const defaultSize = product.availableSizes[0];
              const variant = product.variants ? product.variants.find(v => v.size === defaultSize) : null;
              const isAvailable = variant ? variant.stock > 0 : true;

              return `
                <div class="wishlist-item-card" data-id="${product.id}">
                  <div class="wishlist-item-media">
                    <a href="#product/${product.slug}">
                      <img src="${product.thumbnail || product.images[0]}" alt="${product.name}">
                    </a>
                    <button class="wishlist-remove-btn" data-id="${product.id}" title="Remove from Wishlist">&times;</button>
                  </div>
                  <div class="wishlist-item-info">
                    <span class="wishlist-item-cat">${product.material}</span>
                    <h3 class="wishlist-item-title">
                      <a href="#product/${product.slug}">${product.name}</a>
                    </h3>
                    <p class="wishlist-item-price">₹${(product.salePrice || product.price).toLocaleString('en-IN')}</p>
                    
                    <div class="wishlist-action-wrap">
                      ${isAvailable ? `
                        <button class="btn-primary wishlist-move-bag-btn" data-id="${product.id}" data-size="${defaultSize}">
                          <span>Move to Bag (${defaultSize})</span>
                        </button>
                      ` : `
                        <button class="btn-secondary" disabled>Currently Sold Out</button>
                      `}
                    </div>
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        ` : `
          <div class="empty-state-card" style="margin: 4rem auto;">
            <div class="empty-state-icon">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
              </svg>
            </div>
            <h3 class="empty-state-title">Your wishlist is empty</h3>
            <p class="empty-state-desc">Explore our seasonal collections and tap the heart icon on any piece to curate your private selection.</p>
            <a href="#collections" class="btn-primary" style="display:inline-block; margin-top:1.5rem;">Explore Creations</a>
          </div>
        `}
      </div>
    </div>
  `;

  attachWishlistListeners(container);
}

function attachWishlistListeners(container) {
  // Remove from Wishlist
  const removeBtns = container.querySelectorAll('.wishlist-remove-btn');
  removeBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const id = btn.getAttribute('data-id');
      store.toggleWishlist(id);
      renderWishlistView(container);
      showToast("Removed from wishlist.", 'info');
    });
  });

  // Move to Bag
  const moveBtns = container.querySelectorAll('.wishlist-move-bag-btn');
  moveBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const id = btn.getAttribute('data-id');
      const size = btn.getAttribute('data-size');
      const product = store.getProductById(id);

      if (product) {
        const res = store.addToCart(product, size, product.color, 1);
        if (res.success) {
          store.toggleWishlist(id); // remove from wishlist once moved
          renderWishlistView(container);
          showToast(`${product.name} moved to your bag.`, 'success');
        } else {
          showToast(res.message, 'error');
        }
      }
    });
  });
}
