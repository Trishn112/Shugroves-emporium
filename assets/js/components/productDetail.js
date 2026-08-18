/**
 * Shugroves Emporium - Product Detail Component
 * High-end luxury product detail view with multi-image gallery, variant stock check,
 * size guide modal, accordions, and related creations.
 */

import { store } from '../store.js';
import { showToast } from './toast.js';
import { renderProductCard, attachTrendingCardListeners } from './trending.js';

export function renderProductDetail(container, slug) {
  const product = store.getProductBySlug(slug);

  if (!product) {
    container.innerHTML = `
      <div class="section-container" style="padding-top: 10rem; text-align: center;">
        <h2 class="section-heading">Garment Not Found</h2>
        <p class="empty-state-desc">The requested piece may have been archived or retired from the collection.</p>
        <a href="#collections" class="btn-primary" style="margin-top: 2rem; display: inline-block;">Return to Collections</a>
      </div>
    `;
    return;
  }

  const inWishlist = store.isInWishlist(product.id);
  const hasSale = product.salePrice && product.salePrice < product.price;
  const initialSize = product.availableSizes.find(s => {
    const v = product.variants.find(item => item.size === s);
    return v && v.stock > 0;
  }) || product.availableSizes[0];

  let selectedSize = initialSize;
  let selectedColor = product.color;
  let selectedQty = 1;
  let activeImageIndex = 0;

  function renderView() {
    const currentVariant = product.variants.find(v => v.size === selectedSize && v.color === selectedColor) ||
                           product.variants.find(v => v.size === selectedSize) ||
                           product.variants[0];

    const currentStock = currentVariant ? currentVariant.stock : 0;
    const isOutOfStock = currentStock === 0;
    const isLowStock = !isOutOfStock && currentStock <= 3;

    const relatedProducts = store.getProducts({ category: product.category })
      .filter(p => p.id !== product.id)
      .slice(0, 3);

    container.innerHTML = `
      <div class="product-detail-page">
        <!-- Breadcrumbs -->
        <nav class="pdp-breadcrumbs" aria-label="Breadcrumb">
          <a href="#home">Home</a>
          <span class="breadcrumb-sep">/</span>
          <a href="#collections">Collections</a>
          <span class="breadcrumb-sep">/</span>
          <a href="#collections?category=${product.category}">${product.category.toUpperCase()}</a>
          <span class="breadcrumb-sep">/</span>
          <span class="breadcrumb-current">${product.name}</span>
        </nav>

        <div class="pdp-layout">
          <!-- Left: Multi-Image Editorial Gallery -->
          <div class="pdp-gallery">
            <div class="pdp-thumbnails">
              ${product.images.map((img, idx) => `
                <button 
                  class="pdp-thumb-btn ${idx === activeImageIndex ? 'thumb-active' : ''}" 
                  data-thumb-index="${idx}"
                  aria-label="View Image ${idx + 1}"
                >
                  <img src="${img}" alt="${product.name} thumbnail ${idx + 1}">
                </button>
              `).join('')}
            </div>

            <div class="pdp-main-image-wrap" id="pdpMainImageWrap">
              <img 
                src="${product.images[activeImageIndex] || product.thumbnail}" 
                alt="${product.name}" 
                class="pdp-main-image"
                id="pdpMainImage"
              >
              <div class="pdp-image-zoom-hint">Hover / Click to Zoom</div>
            </div>
          </div>

          <!-- Right: Product Purchase Details -->
          <div class="pdp-details">
            <div class="pdp-header">
              <span class="pdp-eyebrow">${product.brand} • ${product.material}</span>
              <h1 class="pdp-title">${product.name}</h1>

              <div class="pdp-price-box">
                ${hasSale ? `
                  <span class="pdp-price-current">₹${product.salePrice.toLocaleString('en-IN')}</span>
                  <span class="pdp-price-original">₹${product.price.toLocaleString('en-IN')}</span>
                  <span class="pdp-sale-tag">Save ₹${(product.price - product.salePrice).toLocaleString('en-IN')}</span>
                ` : `
                  <span class="pdp-price-current">₹${product.price.toLocaleString('en-IN')}</span>
                `}
                <span class="pdp-tax-note">Inclusive of all duties & taxes</span>
              </div>
            </div>

            <p class="pdp-description">${product.description}</p>

            <!-- Color Options -->
            <div class="pdp-option-group">
              <div class="pdp-option-label-row">
                <span class="pdp-option-label">Color:</span>
                <span class="pdp-option-val">${selectedColor}</span>
              </div>
              <div class="pdp-color-swatches">
                ${product.availableColors.map(col => `
                  <button 
                    class="pdp-color-swatch-btn ${col === selectedColor ? 'swatch-active' : ''}" 
                    data-color="${col}"
                    title="${col}"
                  >
                    <span>${col}</span>
                  </button>
                `).join('')}
              </div>
            </div>

            <!-- Size Options -->
            <div class="pdp-option-group">
              <div class="pdp-option-label-row">
                <div class="pdp-size-header-left">
                  <span class="pdp-option-label">Size:</span>
                  <span class="pdp-option-val">${selectedSize}</span>
                </div>
                <button class="btn-size-guide-trigger" id="openSizeGuideBtn">Size Guide &rarr;</button>
              </div>

              <div class="pdp-size-selector">
                ${product.availableSizes.map(size => {
                  const variant = product.variants.find(v => v.size === size);
                  const available = variant ? variant.stock > 0 : true;
                  const isSelected = size === selectedSize;
                  return `
                    <button 
                      class="pdp-size-btn ${isSelected ? 'size-active' : ''} ${!available ? 'size-out-of-stock' : ''}"
                      data-size="${size}"
                      ${!available ? 'disabled' : ''}
                    >
                      <span>${size}</span>
                      ${!available ? '<span class="size-strike"></span>' : ''}
                    </button>
                  `;
                }).join('')}
              </div>

              <!-- Stock Availability Indicator -->
              <div class="pdp-stock-status">
                ${isOutOfStock ? `
                  <span class="stock-badge stock-out">Out of Stock in size ${selectedSize}</span>
                ` : isLowStock ? `
                  <span class="stock-badge stock-low">Only ${currentStock} piece${currentStock > 1 ? 's' : ''} remaining</span>
                ` : `
                  <span class="stock-badge stock-in">In Stock & Ready to Dispatch</span>
                `}
              </div>
            </div>

            <!-- Quantity & Actions -->
            <div class="pdp-actions-row">
              <div class="pdp-quantity-wrap">
                <button class="pdp-qty-btn" id="qtyMinus" ${selectedQty <= 1 ? 'disabled' : ''}>&minus;</button>
                <span class="pdp-qty-value">${selectedQty}</span>
                <button class="pdp-qty-btn" id="qtyPlus" ${selectedQty >= currentStock || isOutOfStock ? 'disabled' : ''}>&#43;</button>
              </div>

              <button 
                class="btn-primary pdp-add-cart-btn ${isOutOfStock ? 'btn-disabled' : ''}" 
                id="pdpAddToCartBtn"
                ${isOutOfStock ? 'disabled' : ''}
              >
                ${isOutOfStock ? 'Sold Out' : 'Add to Bag'}
              </button>

              <button 
                class="pdp-wishlist-toggle ${inWishlist ? 'is-active' : ''}" 
                id="pdpWishlistBtn" 
                aria-label="Save to Wishlist"
                title="${inWishlist ? 'Remove from Wishlist' : 'Add to Wishlist'}"
              >
                <svg viewBox="0 0 24 24" fill="${inWishlist ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="1.8">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                </svg>
              </button>
            </div>

            ${!isOutOfStock ? `
              <button class="btn-pdp-buynow" id="pdpBuyNowBtn">
                Express Buy Now &rarr;
              </button>
            ` : ''}

            <!-- Product Details Accordions -->
            <div class="pdp-accordions">
              <details class="pdp-accordion-item" open>
                <summary class="pdp-accordion-title">
                  <span>Details & Silhouette</span>
                  <span class="accordion-icon">+</span>
                </summary>
                <div class="pdp-accordion-body">
                  <ul class="pdp-details-list">
                    ${product.details ? product.details.map(d => `<li>${d}</li>`).join('') : ''}
                  </ul>
                </div>
              </details>

              <details class="pdp-accordion-item">
                <summary class="pdp-accordion-title">
                  <span>Textile & Slow Craft</span>
                  <span class="accordion-icon">+</span>
                </summary>
                <div class="pdp-accordion-body">
                  <p><strong>Primary Material:</strong> ${product.material}</p>
                  <p>Garments are pre-washed and treated with botanical extracts to cultivate an organic, living patina over time.</p>
                </div>
              </details>

              <details class="pdp-accordion-item">
                <summary class="pdp-accordion-title">
                  <span>Care Instructions</span>
                  <span class="accordion-icon">+</span>
                </summary>
                <div class="pdp-accordion-body">
                  <p>${product.care}</p>
                </div>
              </details>

              <details class="pdp-accordion-item">
                <summary class="pdp-accordion-title">
                  <span>Shipping & Returns</span>
                  <span class="accordion-icon">+</span>
                </summary>
                <div class="pdp-accordion-body">
                  <p>${product.shipping}</p>
                  <p>${product.returns}</p>
                </div>
              </details>
            </div>
          </div>
        </div>

        <!-- Related Creations Carousel -->
        ${relatedProducts.length > 0 ? `
          <div class="pdp-related-section">
            <div class="section-header">
              <div class="section-header-left">
                <span class="section-eyebrow">Complete The Aesthetic</span>
                <h2 class="section-heading">You May Also Admire</h2>
              </div>
            </div>
            <div class="product-grid product-grid-3">
              ${relatedProducts.map(p => renderProductCard(p)).join('')}
            </div>
          </div>
        ` : ''}
      </div>

      <!-- Size Guide Modal -->
      <div class="size-guide-modal" id="sizeGuideModal">
        <div class="size-guide-backdrop" id="sizeGuideBackdrop"></div>
        <div class="size-guide-content">
          <div class="size-guide-header">
            <h3>Size & Measurements Guide</h3>
            <button class="size-guide-close" id="sizeGuideClose">&times;</button>
          </div>
          <div class="size-guide-table-wrap">
            <table class="size-guide-table">
              <thead>
                <tr>
                  <th>Size</th>
                  <th>Chest (in)</th>
                  <th>Waist (in)</th>
                  <th>Hip (in)</th>
                  <th>Length (in)</th>
                </tr>
              </thead>
              <tbody>
                <tr><td>XS</td><td>32 - 34</td><td>24 - 26</td><td>34 - 36</td><td>44.5</td></tr>
                <tr><td>S</td><td>34 - 36</td><td>26 - 28</td><td>36 - 38</td><td>45.0</td></tr>
                <tr><td>M</td><td>36 - 38</td><td>28 - 30</td><td>38 - 40</td><td>45.5</td></tr>
                <tr><td>L</td><td>38 - 41</td><td>30 - 33</td><td>40 - 43</td><td>46.0</td></tr>
                <tr><td>XL</td><td>41 - 44</td><td>33 - 36</td><td>43 - 46</td><td>46.5</td></tr>
              </tbody>
            </table>
            <p class="size-guide-note">Garments feature a relaxed, unstructured drape. For a tailored silhouette, order one size down.</p>
          </div>
        </div>
      </div>
    `;

    attachListeners();
  }

  function attachListeners() {
    // 1. Thumbnails
    const thumbs = container.querySelectorAll('.pdp-thumb-btn');
    thumbs.forEach(thumb => {
      thumb.addEventListener('click', () => {
        activeImageIndex = parseInt(thumb.getAttribute('data-thumb-index'), 10);
        renderView();
      });
    });

    // 2. Color Swatches
    const colorSwatches = container.querySelectorAll('.pdp-color-swatch-btn');
    colorSwatches.forEach(swatch => {
      swatch.addEventListener('click', () => {
        selectedColor = swatch.getAttribute('data-color');
        renderView();
      });
    });

    // 3. Size Buttons
    const sizeBtns = container.querySelectorAll('.pdp-size-btn');
    sizeBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        if (!btn.disabled) {
          selectedSize = btn.getAttribute('data-size');
          selectedQty = 1;
          renderView();
        }
      });
    });

    // 4. Quantity Adjusters
    const qtyMinus = document.getElementById('qtyMinus');
    const qtyPlus = document.getElementById('qtyPlus');
    if (qtyMinus) {
      qtyMinus.addEventListener('click', () => {
        if (selectedQty > 1) {
          selectedQty--;
          renderView();
        }
      });
    }
    if (qtyPlus) {
      qtyPlus.addEventListener('click', () => {
        selectedQty++;
        renderView();
      });
    }

    // 5. Add to Cart
    const addCartBtn = document.getElementById('pdpAddToCartBtn');
    if (addCartBtn) {
      addCartBtn.addEventListener('click', async () => {
        const res = await store.addToCart(product, selectedSize, selectedColor, selectedQty);
        if (res.success) {
          showToast(res.message, 'success');
          const cartDrawer = document.getElementById('cartDrawer');
          if (cartDrawer) {
            cartDrawer.classList.add('drawer-open');
            document.body.classList.add('scroll-locked');
          }
        } else {
          showToast(res.message, 'error');
        }
      });
    }

    // 6. Buy Now
    const buyNowBtn = document.getElementById('pdpBuyNowBtn');
    if (buyNowBtn) {
      buyNowBtn.addEventListener('click', async () => {
        const res = await store.addToCart(product, selectedSize, selectedColor, selectedQty);
        if (res.success) {
          window.location.hash = '#checkout';
        } else {
          showToast(res.message, 'error');
        }
      });
    }

    // 7. Wishlist Toggle
    const wishBtn = document.getElementById('pdpWishlistBtn');
    if (wishBtn) {
      wishBtn.addEventListener('click', () => {
        const added = store.toggleWishlist(product.id);
        wishBtn.classList.toggle('is-active', added);
        wishBtn.querySelector('svg').setAttribute('fill', added ? 'currentColor' : 'none');
        showToast(added ? `${product.name} saved to wishlist.` : `${product.name} removed from wishlist.`, added ? 'success' : 'info');
      });
    }

    // 8. Size Guide Modal
    const sizeGuideModal = document.getElementById('sizeGuideModal');
    const openGuideBtn = document.getElementById('openSizeGuideBtn');
    const closeGuideBtn = document.getElementById('sizeGuideClose');
    const backdrop = document.getElementById('sizeGuideBackdrop');

    const closeGuide = () => {
      if (sizeGuideModal) sizeGuideModal.classList.remove('modal-open');
    };

    if (openGuideBtn) openGuideBtn.addEventListener('click', () => sizeGuideModal.classList.add('modal-open'));
    if (closeGuideBtn) closeGuideBtn.addEventListener('click', closeGuide);
    if (backdrop) backdrop.addEventListener('click', closeGuide);

    // Attach card listeners for related products
    attachTrendingCardListeners(container);
  }

  renderView();
}
