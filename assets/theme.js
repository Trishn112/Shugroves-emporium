/**
 * Shugroves Emporium - Official Shopify Theme Engine
 * High-performance vanilla JavaScript powering AJAX Cart, Predictive Search,
 * PDP Variant Selection, Quick Add Size Drawers, and UI interactions.
 */

document.addEventListener('DOMContentLoaded', () => {
  initHeader();
  initCartDrawer();
  initSearchOverlay();
  initQuickAdd();
  initWishlist();
  initPDP();
});

// =========================================================================
// 1. HEADER & MOBILE DRAWER
// =========================================================================
function initHeader() {
  const header = document.getElementById('siteHeader');
  const mobileToggle = document.getElementById('mobileMenuToggle');
  const mobileDrawer = document.getElementById('mobileDrawer');
  const mobileClose = document.getElementById('mobileDrawerClose');

  if (mobileToggle && mobileDrawer) {
    mobileToggle.addEventListener('click', () => {
      mobileDrawer.classList.toggle('is-open');
    });
  }

  if (mobileClose && mobileDrawer) {
    mobileClose.addEventListener('click', () => {
      mobileDrawer.classList.remove('is-open');
    });
  }

  // Megamenu search filter
  const colSearchInput = document.getElementById('collectionsSearchInput');
  if (colSearchInput) {
    colSearchInput.addEventListener('input', (e) => {
      const q = e.target.value.toLowerCase().trim();
      const links = document.querySelectorAll('.megamenu-link-item');
      links.forEach(link => {
        const text = link.textContent.toLowerCase();
        link.style.display = text.includes(q) ? 'flex' : 'none';
      });
    });
  }

  // Header scroll shadow
  window.addEventListener('scroll', () => {
    if (window.scrollY > 20) {
      header?.classList.add('is-scrolled');
    } else {
      header?.classList.remove('is-scrolled');
    }
  });
}

// =========================================================================
// 2. AJAX CART & SLIDE-OVER DRAWER
// =========================================================================
function initCartDrawer() {
  const openBtn = document.getElementById('openCartBtn');
  const backdrop = document.getElementById('cartDrawerBackdrop');
  const panel = document.getElementById('cartDrawerPanel');
  const closeBtn = document.getElementById('cartDrawerClose');

  function openDrawer() {
    backdrop?.classList.add('is-open');
    panel?.classList.add('is-open');
    document.body.classList.add('drawer-open');
  }

  function closeDrawer() {
    backdrop?.classList.remove('is-open');
    panel?.classList.remove('is-open');
    document.body.classList.remove('drawer-open');
  }

  openBtn?.addEventListener('click', (e) => {
    e.preventDefault();
    openDrawer();
  });

  backdrop?.addEventListener('click', closeDrawer);
  closeBtn?.addEventListener('click', closeDrawer);

  window.openShopifyCartDrawer = openDrawer;
  window.closeShopifyCartDrawer = closeDrawer;

  // Delegate Quantity and Removal buttons
  const panelEl = document.getElementById('cartDrawerPanel');
  if (panelEl) {
    panelEl.addEventListener('click', async (e) => {
      const removeBtn = e.target.closest('.cart-item-remove-btn');
      if (removeBtn) {
        const key = removeBtn.getAttribute('data-key');
        await updateCartItem(key, 0);
        return;
      }

      const incBtn = e.target.closest('.cart-qty-inc');
      if (incBtn) {
        const key = incBtn.getAttribute('data-key');
        const currentQty = parseInt(incBtn.getAttribute('data-current-qty'), 10) || 1;
        await updateCartItem(key, currentQty + 1);
        return;
      }

      const decBtn = e.target.closest('.cart-qty-dec');
      if (decBtn) {
        const key = decBtn.getAttribute('data-key');
        const currentQty = parseInt(decBtn.getAttribute('data-current-qty'), 10) || 1;
        await updateCartItem(key, Math.max(0, currentQty - 1));
        return;
      }
    });
  }
}

export async function addVariantToCart(variantId, quantity = 1) {
  try {
    const res = await fetch('/cart/add.js', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: variantId, quantity: quantity })
    });

    if (!res.ok) {
      const errData = await res.json();
      showToast(errData.description || 'Could not add piece to bag.', 'error');
      return;
    }

    const item = await res.json();
    showToast(`${item.product_title || 'Piece'} added to your Shopping Bag.`, 'success');
    await refreshCartDrawer();
    window.openShopifyCartDrawer?.();
  } catch (err) {
    console.error('Add to Cart error:', err);
    showToast('Failed to connect to store cart.', 'error');
  }
}

export async function updateCartItem(key, quantity) {
  try {
    const res = await fetch('/cart/change.js', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: key, quantity: quantity })
    });

    if (res.ok) {
      await refreshCartDrawer();
    }
  } catch (err) {
    console.error('Update Cart error:', err);
  }
}

export async function refreshCartDrawer() {
  try {
    const res = await fetch('/cart.js');
    if (!res.ok) return;
    const cart = await res.json();

    // 1. Update Badges
    const badge1 = document.getElementById('cartCountBadge');
    const drawerCount = document.getElementById('drawerItemCount');
    if (badge1) badge1.textContent = cart.item_count;
    if (drawerCount) drawerCount.textContent = `(${cart.item_count} ${cart.item_count === 1 ? 'piece' : 'pieces'})`;

    // 2. Update Subtotals & Totals
    const subtotalEl = document.getElementById('drawerSubtotal');
    const totalEl = document.getElementById('drawerTotal');
    const formattedTotal = formatMoney(cart.total_price);
    if (subtotalEl) subtotalEl.textContent = formattedTotal;
    if (totalEl) totalEl.textContent = formattedTotal;

    // 3. Update Free Shipping Meter
    const thresholdCents = 500000; // 5000 in cents
    const remainingCents = thresholdCents - cart.total_price;
    const progressFill = document.getElementById('shippingProgressFill');
    const barText = document.getElementById('shippingBarText');

    if (progressFill) {
      const pct = Math.min(100, Math.max(0, (cart.total_price / thresholdCents) * 100));
      progressFill.style.width = `${pct}%`;
    }

    if (barText) {
      if (cart.total_price >= thresholdCents && cart.item_count > 0) {
        barText.innerHTML = `<span>Complimentary Express Shipping Unlocked</span>`;
      } else if (cart.item_count > 0) {
        barText.innerHTML = `<span>Add <strong>${formatMoney(remainingCents)}</strong> for Complimentary Shipping</span>`;
      } else {
        barText.innerHTML = `<span>Complimentary Shipping on orders over ${formatMoney(thresholdCents)}</span>`;
      }
    }

    // 4. Update Empty State / List visibility
    const listEl = document.getElementById('drawerItemsList');
    const emptyEl = document.getElementById('drawerEmptyState');
    const footerEl = document.getElementById('cartDrawerFooter');

    if (cart.item_count === 0) {
      if (listEl) listEl.style.display = 'none';
      if (emptyEl) emptyEl.style.display = 'block';
      if (footerEl) footerEl.style.display = 'none';
    } else {
      if (listEl) {
        listEl.style.display = 'block';
        listEl.innerHTML = cart.items.map(item => `
          <div class="cart-item-row" data-line-item-key="${item.key}">
            <a href="${item.url}" class="cart-item-img-wrap">
              ${item.image ? `<img src="${item.image}" alt="${item.title}" width="80" height="100" loading="lazy">` : ''}
            </a>
            <div class="cart-item-details">
              <div class="cart-item-top">
                <h4 class="cart-item-name"><a href="${item.url}">${item.product_title}</a></h4>
                <button type="button" class="cart-item-remove-btn" data-key="${item.key}">&times;</button>
              </div>
              ${item.variant_title ? `<div class="cart-item-variant-pill"><span>${item.variant_title}</span></div>` : ''}
              <div class="cart-item-bottom">
                <div class="cart-qty-controller">
                  <button type="button" class="cart-qty-btn cart-qty-dec" data-key="${item.key}" data-current-qty="${item.quantity}">&minus;</button>
                  <span class="cart-qty-num">${item.quantity}</span>
                  <button type="button" class="cart-qty-btn cart-qty-inc" data-key="${item.key}" data-current-qty="${item.quantity}">&#43;</button>
                </div>
                <div class="cart-item-price-col">
                  <span class="cart-item-price">${formatMoney(item.final_line_price)}</span>
                </div>
              </div>
            </div>
          </div>
        `).join('');
      }
      if (emptyEl) emptyEl.style.display = 'none';
      if (footerEl) footerEl.style.display = 'block';
    }
  } catch (err) {
    console.error('Refresh cart error:', err);
  }
}

// =========================================================================
// 3. QUICK ADD SIZE PICKERS
// =========================================================================
function initQuickAdd() {
  document.addEventListener('click', (e) => {
    // 1. Direct Add for single-variant items
    const directBtn = e.target.closest('.btn-direct-add');
    if (directBtn) {
      e.preventDefault();
      const variantId = directBtn.getAttribute('data-variant-id');
      if (variantId) addVariantToCart(variantId, 1);
      return;
    }

    // 2. Toggle Size Picker Drawer
    const triggerBtn = e.target.closest('[data-toggle-picker]');
    if (triggerBtn) {
      e.preventDefault();
      const pickerId = triggerBtn.getAttribute('data-toggle-picker');
      const picker = document.getElementById(pickerId);
      if (picker) {
        picker.classList.toggle('is-open');
      }
      return;
    }

    // 3. Size Pill Click
    const sizeBtn = e.target.closest('.quick-size-btn');
    if (sizeBtn && !sizeBtn.disabled) {
      e.preventDefault();
      const variantId = sizeBtn.getAttribute('data-variant-id');
      if (variantId) addVariantToCart(variantId, 1);
      return;
    }
  });
}

// =========================================================================
// 4. PREDICTIVE SEARCH
// =========================================================================
function initSearchOverlay() {
  const openBtn = document.getElementById('openSearchBtn');
  const backdrop = document.getElementById('searchOverlayBackdrop');
  const container = document.getElementById('searchOverlayContainer');
  const closeBtn = document.getElementById('searchOverlayClose');
  const input = document.getElementById('searchOverlayInput');
  const clearBtn = document.getElementById('searchClearBtn');
  const grid = document.getElementById('searchResultsGrid');
  const noResults = document.getElementById('searchNoResults');
  let debounceTimer = null;

  function openSearch() {
    backdrop?.classList.add('is-open');
    container?.classList.add('is-open');
    document.body.classList.add('search-open');
    setTimeout(() => input?.focus(), 150);
  }

  function closeSearch() {
    backdrop?.classList.remove('is-open');
    container?.classList.remove('is-open');
    document.body.classList.remove('search-open');
  }

  openBtn?.addEventListener('click', openSearch);
  backdrop?.addEventListener('click', closeSearch);
  closeBtn?.addEventListener('click', closeSearch);

  input?.addEventListener('input', (e) => {
    const q = e.target.value.trim();
    if (clearBtn) clearBtn.style.display = q.length > 0 ? 'block' : 'none';

    clearTimeout(debounceTimer);
    if (q.length < 2) {
      if (grid) grid.innerHTML = '';
      if (noResults) noResults.style.display = 'none';
      return;
    }

    debounceTimer = setTimeout(async () => {
      try {
        const res = await fetch(`/search/suggest.json?q=${encodeURIComponent(q)}&resources[type]=product&resources[limit]=4`);
        if (!res.ok) return;
        const data = await res.json();
        const prods = data.resources.results.products;

        if (prods && prods.length > 0) {
          if (noResults) noResults.style.display = 'none';
          if (grid) {
            grid.innerHTML = prods.map(p => `
              <article class="product-card">
                <div class="product-card-media">
                  <a href="${p.url}" class="product-card-img-link">
                    <img src="${p.image}" alt="${p.title}" class="product-img product-img-primary" loading="lazy">
                  </a>
                </div>
                <div class="product-card-body">
                  ${p.vendor ? `<span class="product-card-material">${p.vendor}</span>` : ''}
                  <h3 class="product-card-title"><a href="${p.url}">${p.title}</a></h3>
                  <div class="product-card-price-row">
                    <span class="product-price-current">${p.price}</span>
                  </div>
                </div>
              </article>
            `).join('');
          }
        } else {
          if (grid) grid.innerHTML = '';
          if (noResults) noResults.style.display = 'block';
        }
      } catch (err) {
        console.error('Search suggest error:', err);
      }
    }, 250);
  });
}

// =========================================================================
// 5. PRODUCT DETAIL PAGE INTERACTIONS
// =========================================================================
function initPDP() {
  const form = document.getElementById('productForm');
  if (!form) return;

  // 1. Gallery Thumbnails
  const thumbs = document.querySelectorAll('.gallery-thumb-btn');
  const mainImg = document.getElementById('mainProductImage');
  thumbs.forEach(btn => {
    btn.addEventListener('click', () => {
      thumbs.forEach(t => t.classList.remove('thumb-active'));
      btn.classList.add('thumb-active');
      const src = btn.getAttribute('data-full-src');
      if (mainImg && src) mainImg.src = src;
    });
  });

  // 2. Variant Pills
  const variantJsonEl = document.getElementById('productVariantsJson');
  const variants = variantJsonEl ? JSON.parse(variantJsonEl.textContent) : [];
  const variantInput = document.getElementById('selectedVariantId');
  const priceEl = document.getElementById('pdpPrice');
  const comparePriceEl = document.getElementById('pdpComparePrice');
  const addBtn = document.getElementById('addToCartBtn');

  const selectedOptions = {};

  const pills = document.querySelectorAll('.pdp-variant-pill');
  pills.forEach(pill => {
    pill.addEventListener('click', () => {
      const group = pill.closest('.variant-option-group');
      group.querySelectorAll('.pdp-variant-pill').forEach(p => p.classList.remove('pill-active'));
      pill.classList.add('pill-active');

      const optName = pill.getAttribute('data-option-name');
      const optVal = pill.getAttribute('data-option-value');
      selectedOptions[optName] = optVal;

      const valLabel = group.querySelector('.option-selected-val');
      if (valLabel) valLabel.textContent = optVal;

      // Find matching variant
      const matching = variants.find(v => {
        return v.options.every((opt, idx) => {
          const key = Object.keys(selectedOptions)[idx];
          return !key || selectedOptions[key] === opt;
        });
      });

      if (matching) {
        if (variantInput) variantInput.value = matching.id;
        if (priceEl) priceEl.textContent = formatMoney(matching.price);
        if (comparePriceEl) {
          if (matching.compare_at_price > matching.price) {
            comparePriceEl.textContent = formatMoney(matching.compare_at_price);
            comparePriceEl.style.display = 'inline';
          } else {
            comparePriceEl.style.display = 'none';
          }
        }
        if (addBtn) {
          addBtn.disabled = !matching.available;
          addBtn.querySelector('span').textContent = matching.available ? 'Add to Shopping Bag →' : 'Sold Out';
        }
      }
    });
  });

  // 3. PDP Quantity
  const qtyInput = document.getElementById('Quantity');
  const dec = document.getElementById('pdpQtyDec');
  const inc = document.getElementById('pdpQtyInc');

  dec?.addEventListener('click', () => {
    if (qtyInput) qtyInput.value = Math.max(1, (parseInt(qtyInput.value, 10) || 1) - 1);
  });
  inc?.addEventListener('click', () => {
    if (qtyInput) qtyInput.value = (parseInt(qtyInput.value, 10) || 1) + 1;
  });

  // 4. AJAX Form Submission
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const variantId = variantInput?.value;
    const qty = parseInt(qtyInput?.value, 10) || 1;
    if (variantId) {
      await addVariantToCart(variantId, qty);
    }
  });
}

// =========================================================================
// 6. WISHLIST MANAGEMENT
// =========================================================================
function initWishlist() {
  function getWishlist() {
    try {
      return JSON.parse(localStorage.getItem('shugroves_wishlist') || '[]');
    } catch (e) {
      return [];
    }
  }

  function saveWishlist(list) {
    localStorage.setItem('shugroves_wishlist', JSON.stringify(list));
    updateWishlistBadges();
  }

  function updateWishlistBadges() {
    const list = getWishlist();
    const count = list.length;
    const badge = document.getElementById('wishlistCountBadge');
    const dropBadge = document.getElementById('dropdownWishlistCount');
    if (badge) badge.textContent = count;
    if (dropBadge) dropBadge.textContent = count;

    document.querySelectorAll('.product-wishlist-btn').forEach(btn => {
      const id = btn.getAttribute('data-wishlist-id');
      const active = list.includes(id);
      btn.classList.toggle('is-active', active);
      const svg = btn.querySelector('svg');
      if (svg) svg.setAttribute('fill', active ? 'currentColor' : 'none');
    });
  }

  document.addEventListener('click', (e) => {
    const wishBtn = e.target.closest('.product-wishlist-btn');
    if (wishBtn) {
      e.preventDefault();
      e.stopPropagation();
      const id = wishBtn.getAttribute('data-wishlist-id');
      let list = getWishlist();
      if (list.includes(id)) {
        list = list.filter(item => item !== id);
        showToast('Removed piece from your wishlist.', 'info');
      } else {
        list.push(id);
        showToast('Saved piece to your personal wishlist.', 'success');
      }
      saveWishlist(list);
    }
  });

  updateWishlistBadges();
}

// =========================================================================
// 7. TOAST NOTIFICATION CENTER
// =========================================================================
export function showToast(message, type = 'info') {
  const container = document.getElementById('toastContainer');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `toast-item toast-${type}`;
  toast.innerHTML = `
    <span class="toast-dot"></span>
    <span class="toast-msg">${message}</span>
  `;

  container.appendChild(toast);
  setTimeout(() => toast.classList.add('is-visible'), 10);

  setTimeout(() => {
    toast.classList.remove('is-visible');
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}

function formatMoney(cents) {
  if (!cents && cents !== 0) return '';
  return '₹' + (cents / 100).toLocaleString('en-IN', { maximumFractionDigits: 0 });
}
