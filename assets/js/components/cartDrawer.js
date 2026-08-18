/**
 * Shugroves Emporium - Shopping Bag Slide-Over Drawer
 * Live interactive cart with quantity modifiers, variant badges, promo code engine,
 * free shipping progress bar, and checkout gateway.
 */

import { store } from '../store.js';
import { showToast } from './toast.js';

export function renderCartDrawer(container) {
  function updateDrawer() {
    const totals = store.getCartTotals();
    const items = store.cart;
    const isFreeShipping = totals.shipping === 0 && totals.subtotal > 0;
    const progressPercent = Math.min(100, (totals.subtotal / totals.freeShippingThreshold) * 100);

    container.innerHTML = `
      <div class="cart-drawer-backdrop" id="cartDrawerBackdrop"></div>
      <div class="cart-drawer-panel">
        <!-- Drawer Header -->
        <div class="cart-drawer-header">
          <div class="cart-drawer-title-wrap">
            <h3 class="cart-drawer-title">Shopping Bag</h3>
            <span class="cart-drawer-count">(${totals.itemCount} ${totals.itemCount === 1 ? 'piece' : 'pieces'})</span>
          </div>
          <button class="cart-drawer-close" id="cartDrawerClose" aria-label="Close Shopping Bag">&times;</button>
        </div>

        <!-- Free Shipping Progress Bar -->
        ${items.length > 0 ? `
          <div class="cart-shipping-bar">
            <div class="shipping-bar-text">
              ${isFreeShipping ? `
                <span>Complimentary Express Shipping Unlocked</span>
              ` : `
                <span>Add <strong>₹${totals.freeShippingRemaining.toLocaleString('en-IN')}</strong> for Complimentary Shipping</span>
              `}
            </div>
            <div class="shipping-progress-track">
              <div class="shipping-progress-fill" style="width: ${progressPercent}%;"></div>
            </div>
          </div>
        ` : ''}

        <!-- Cart Items List or Empty State -->
        <div class="cart-items-scroll">
          ${items.length > 0 ? `
            <div class="cart-items-list">
              ${items.map(item => `
                <div class="cart-item-row" data-sku="${item.variantSku}">
                  <a href="#product/${item.slug}" class="cart-item-img-wrap">
                    <img src="${item.image}" alt="${item.name}">
                  </a>

                  <div class="cart-item-details">
                    <div class="cart-item-top">
                      <h4 class="cart-item-name">
                        <a href="#product/${item.slug}">${item.name}</a>
                      </h4>
                      <button class="cart-item-remove-btn" data-sku="${item.variantSku}" aria-label="Remove Item">&times;</button>
                    </div>

                    <div class="cart-item-variant-pill">
                      <span>Size: ${item.size}</span>
                      <span class="variant-dot">•</span>
                      <span>${item.color}</span>
                    </div>

                    <div class="cart-item-bottom">
                      <!-- Quantity Controller -->
                      <div class="cart-qty-controller">
                        <button class="cart-qty-btn cart-qty-dec" data-sku="${item.variantSku}">&minus;</button>
                        <span class="cart-qty-num">${item.quantity}</span>
                        <button class="cart-qty-btn cart-qty-inc" data-sku="${item.variantSku}" ${item.quantity >= item.maxStock ? 'disabled' : ''}>&#43;</button>
                      </div>

                      <div class="cart-item-price-col">
                        <span class="cart-item-price">₹${(item.price * item.quantity).toLocaleString('en-IN')}</span>
                      </div>
                    </div>
                  </div>
                </div>
              `).join('')}
            </div>
          ` : `
            <div class="cart-empty-state">
              <div class="cart-empty-icon">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2">
                  <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                  <line x1="3" y1="6" x2="21" y2="6"></line>
                  <path d="M16 10a4 4 0 0 1-8 0"></path>
                </svg>
              </div>
              <h4 class="cart-empty-title">Your shopping bag is empty</h4>
              <p class="cart-empty-desc">Discover our seasonless linen tailoring, artisanal knitwear, and conscious leather goods.</p>
              <a href="#collections" class="btn-primary cart-empty-btn" id="cartExploreBtn">Explore Collections</a>
            </div>
          `}
        </div>

        <!-- Drawer Footer (Subtotals, Promo & Checkout) -->
        ${items.length > 0 ? `
          <div class="cart-drawer-footer">
            <!-- Promo Code Input -->
            <div class="cart-promo-section">
              ${totals.appliedPromo ? `
                <div class="promo-applied-pill">
                  <span>${totals.appliedPromo.code} (${totals.appliedPromo.desc})</span>
                  <button class="promo-remove-btn" id="removePromoBtn">&times;</button>
                </div>
              ` : `
                <form class="promo-form" id="promoForm">
                  <input 
                    type="text" 
                    class="promo-input" 
                    id="promoCodeInput" 
                    placeholder="Enter Promo Code (e.g. SLOWLUXURY10)"
                  >
                  <button type="submit" class="promo-submit-btn">Apply</button>
                </form>
              `}
            </div>

            <!-- Price Breakdown -->
            <div class="cart-summary-breakdown">
              <div class="summary-row">
                <span>Subtotal</span>
                <span>₹${totals.subtotal.toLocaleString('en-IN')}</span>
              </div>
              ${totals.discount > 0 ? `
                <div class="summary-row summary-discount">
                  <span>Conscious Privilege</span>
                  <span>&minus; ₹${totals.discount.toLocaleString('en-IN')}</span>
                </div>
              ` : ''}
              <div class="summary-row">
                <span>Shipping</span>
                <span>${totals.shipping === 0 ? 'Complimentary' : `₹${totals.shipping}`}</span>
              </div>
              <div class="summary-row summary-total-row">
                <span>Total Amount</span>
                <span>₹${totals.total.toLocaleString('en-IN')}</span>
              </div>
            </div>

            <button class="btn-primary cart-checkout-btn" id="cartCheckoutBtn">
              <span>Proceed to Checkout &rarr;</span>
            </button>
          </div>
        ` : ''}
      </div>
    `;

    attachDrawerListeners();
  }

  function attachDrawerListeners() {
    const closeBtn = document.getElementById('cartDrawerClose');
    const backdrop = document.getElementById('cartDrawerBackdrop');
    const drawerEl = container;

    const closeCart = () => {
      drawerEl.classList.remove('drawer-open');
      document.body.classList.remove('scroll-locked');
    };

    if (closeBtn) closeBtn.addEventListener('click', closeCart);
    if (backdrop) backdrop.addEventListener('click', closeCart);

    const exploreBtn = document.getElementById('cartExploreBtn');
    if (exploreBtn) exploreBtn.addEventListener('click', closeCart);

    // Quantity Increment
    const incBtns = container.querySelectorAll('.cart-qty-inc');
    incBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const sku = btn.getAttribute('data-sku');
        const item = store.cart.find(i => i.variantSku === sku);
        if (item) {
          store.updateCartQuantity(sku, item.quantity + 1);
        }
      });
    });

    // Quantity Decrement
    const decBtns = container.querySelectorAll('.cart-qty-dec');
    decBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const sku = btn.getAttribute('data-sku');
        const item = store.cart.find(i => i.variantSku === sku);
        if (item) {
          store.updateCartQuantity(sku, item.quantity - 1);
        }
      });
    });

    // Remove Item
    const removeBtns = container.querySelectorAll('.cart-item-remove-btn');
    removeBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const sku = btn.getAttribute('data-sku');
        store.removeFromCart(sku);
        showToast("Item removed from your bag.", 'info');
      });
    });

    // Promo Code Form
    const promoForm = document.getElementById('promoForm');
    if (promoForm) {
      promoForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const codeInput = document.getElementById('promoCodeInput');
        if (codeInput && codeInput.value) {
          const res = store.applyPromoCode(codeInput.value);
          showToast(res.message, res.success ? 'success' : 'error');
        }
      });
    }

    const removePromo = document.getElementById('removePromoBtn');
    if (removePromo) {
      removePromo.addEventListener('click', () => {
        store.removePromoCode();
        showToast("Promo code removed.", 'info');
      });
    }

    // Checkout Button - In-App Delivery Address & Database Checkout
    const checkoutBtn = document.getElementById('cartCheckoutBtn');
    if (checkoutBtn) {
      checkoutBtn.addEventListener('click', () => {
        closeCart();
        window.location.hash = '#checkout';
      });
    }
  }

  // Subscribe to store updates
  store.subscribe(() => {
    updateDrawer();
  });

  updateDrawer();
}
