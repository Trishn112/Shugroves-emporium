/**
 * Shugroves Emporium - Trending Now Section
 * Editorial luxury product cards with hover secondary image swap, live wishlist toggle, and quick add.
 */

import { store } from '../store.js';
import { showToast } from './toast.js';

export function renderTrending(container) {
  const trendingProducts = store.getProducts({ sort: 'featured' }).slice(0, 4);

  container.innerHTML = `
    <div class="section-container">
      <!-- Section Editorial Header -->
      <div class="section-header">
        <div class="section-header-left">
          <span class="section-eyebrow">Curated Pieces</span>
          <h2 class="section-heading">Trending Now</h2>
        </div>
        <div class="section-header-right">
          <a href="#collections" class="btn-text-link">View All Creations &rarr;</a>
        </div>
      </div>

      <!-- Product Cards Grid -->
      <div class="product-grid product-grid-4">
        ${trendingProducts.map(product => renderProductCard(product)).join('')}
      </div>
    </div>
  `;

  attachTrendingCardListeners(container);
}

export function renderProductCard(product) {
  const inWishlist = store.isInWishlist(product.id);
  const primaryImg = product.images[0] || product.thumbnail;
  const secondaryImg = product.images[1] || primaryImg;
  const hasSale = product.salePrice && product.salePrice < product.price;

  // Check total stock across variants
  const totalStock = product.variants ? product.variants.reduce((sum, v) => sum + v.stock, 0) : 10;
  const isOutOfStock = totalStock === 0;
  const isLowStock = !isOutOfStock && totalStock <= 5;

  return `
    <article class="product-card" data-id="${product.id}">
      <!-- Card Media -->
      <div class="product-card-media">
        <a href="#product/${product.slug}" class="product-card-img-link" aria-label="View ${product.name}">
          <img 
            src="${primaryImg}" 
            alt="${product.name}" 
            class="product-img product-img-primary" 
            loading="lazy"
          >
          <img 
            src="${secondaryImg}" 
            alt="${product.name} alternate view" 
            class="product-img product-img-secondary" 
            loading="lazy"
          >
        </a>

        <!-- Badges -->
        <div class="product-badges">
          ${product.isNewArrival ? '<span class="badge-tag badge-new">New Arrival</span>' : ''}
          ${hasSale ? '<span class="badge-tag badge-sale">Special Price</span>' : ''}
          ${isLowStock ? '<span class="badge-tag badge-low">Low Stock</span>' : ''}
          ${isOutOfStock ? '<span class="badge-tag badge-sold">Out of Stock</span>' : ''}
        </div>

        <!-- Wishlist Button -->
        <button 
          class="product-wishlist-btn ${inWishlist ? 'is-active' : ''}" 
          data-wishlist-id="${product.id}" 
          aria-label="Add to Wishlist"
          title="${inWishlist ? 'Remove from Wishlist' : 'Add to Wishlist'}"
        >
          <svg viewBox="0 0 24 24" fill="${inWishlist ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="1.8">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
          </svg>
        </button>

        <!-- Quick Add Drawer / Bar -->
        ${!isOutOfStock ? `
          <div class="product-quick-add">
            <button class="quick-add-trigger-btn" data-quick-id="${product.id}">
              <span>+ Quick Add</span>
            </button>
            <div class="quick-size-picker" id="quickSize-${product.id}">
              <span class="quick-size-label">Select Size:</span>
              <div class="quick-size-list">
                ${product.availableSizes.map(size => {
                  const variant = product.variants ? product.variants.find(v => v.size === size) : null;
                  const available = variant ? variant.stock > 0 : true;
                  return `
                    <button 
                      class="quick-size-btn ${!available ? 'size-disabled' : ''}" 
                      data-product-id="${product.id}" 
                      data-size="${size}"
                      ${!available ? 'disabled title="Out of stock"' : ''}
                    >
                      ${size}
                    </button>
                  `;
                }).join('')}
              </div>
            </div>
          </div>
        ` : `
          <div class="product-soldout-bar">
            <span>Sold Out</span>
          </div>
        `}
      </div>

      <!-- Card Details -->
      <div class="product-card-body">
        <span class="product-card-material">${product.material}</span>
        <h3 class="product-card-title">
          <a href="#product/${product.slug}">${product.name}</a>
        </h3>
        <div class="product-card-price-row">
          ${hasSale ? `
            <span class="product-price-current">₹${product.salePrice.toLocaleString('en-IN')}</span>
            <span class="product-price-original">₹${product.price.toLocaleString('en-IN')}</span>
          ` : `
            <span class="product-price-current">₹${product.price.toLocaleString('en-IN')}</span>
          `}
        </div>
      </div>
    </article>
  `;
}

export function attachTrendingCardListeners(container) {
  // 1. Wishlist Toggles
  const wishBtns = container.querySelectorAll('.product-wishlist-btn');
  wishBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const id = btn.getAttribute('data-wishlist-id');
      const added = store.toggleWishlist(id);
      btn.classList.toggle('is-active', added);
      btn.querySelector('svg').setAttribute('fill', added ? 'currentColor' : 'none');
      const prod = store.getProductById(id);
      showToast(added ? `${prod.name} saved to your wishlist.` : `${prod.name} removed from wishlist.`, added ? 'success' : 'info');
    });
  });

  // 2. Quick Size Picker Trigger Toggle
  const quickTriggers = container.querySelectorAll('.quick-add-trigger-btn');
  quickTriggers.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const card = btn.closest('.product-card');
      const picker = card.querySelector('.quick-size-picker');
      if (picker) {
        picker.classList.toggle('picker-visible');
      }
    });
  });

  // 3. Quick Size Button Selection & Add to Cart
  const sizeBtns = container.querySelectorAll('.quick-size-btn');
  sizeBtns.forEach(btn => {
    btn.addEventListener('click', async (e) => {
      e.preventDefault();
      e.stopPropagation();
      const prodId = btn.getAttribute('data-product-id');
      const size = btn.getAttribute('data-size');
      const product = store.getProductById(prodId);

      if (product) {
        const res = await store.addToCart(product, size, product.color, 1);
        if (res.success) {
          showToast(res.message, 'success');
          // Open cart drawer for smooth high-end conversion
          const cartDrawer = document.getElementById('cartDrawer');
          if (cartDrawer) {
            cartDrawer.classList.add('drawer-open');
            document.body.classList.add('scroll-locked');
          }
        } else {
          showToast(res.message, 'error');
        }
      }
    });
  });
}
