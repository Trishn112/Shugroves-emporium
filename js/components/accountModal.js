/**
 * Shugroves Emporium - My Account & Order History Portal
 * Connected to Firebase Authentication & Cloud Firestore Database.
 * Allows clients to view real-time orders, shipment tracking, and manage delivery addresses.
 */

import { store } from '../store.js';
import { showToast } from './toast.js';

export function renderAccountView(container, params = {}) {
  let activeTab = params.tab || 'orders'; // orders, addresses, profile
  let showAddAddressModal = false;
  let cachedOrders = store.orders || [];

  function updateView() {
    const user = store.user;
    const orders = cachedOrders;
    const addresses = user.addresses || [];

    container.innerHTML = `
      <div class="account-page" style="padding-top: 8.5rem;">
        <!-- Account Header -->
        <header class="collections-header">
          <div class="collections-header-inner">
            <span class="collections-eyebrow">Client Privilege</span>
            <h1 class="collections-title">My Account</h1>
            <p class="collections-description">
              Welcome back, <strong>${user.name || user.email || 'Client'}</strong>. Manage your orders, delivery addresses, and personal atelier preferences.
            </p>

            <!-- Account Nav Tabs -->
            <div class="category-tabs" style="margin-top: 2rem;">
              <button class="category-tab-btn ${activeTab === 'orders' ? 'tab-active' : ''}" data-tab="orders">Orders & Tracking (${orders.length})</button>
              <button class="category-tab-btn ${activeTab === 'addresses' ? 'tab-active' : ''}" data-tab="addresses">Saved Delivery Addresses (${addresses.length})</button>
              <button class="category-tab-btn ${activeTab === 'profile' ? 'tab-active' : ''}" data-tab="profile">Personal Details</button>
              <a href="#wishlist" class="category-tab-btn">Saved Wishlist (${store.wishlist.length})</a>
            </div>
          </div>
        </header>

        <div class="section-container" style="max-width: 1100px; margin: 2.5rem auto 5rem; padding: 0 1.5rem;">
          ${activeTab === 'orders' ? renderOrdersTab(orders) : 
            activeTab === 'addresses' ? renderAddressesTab(user, addresses) : 
            renderProfileTab(user)}
        </div>
      </div>
    `;

    attachListeners();
  }

  function renderOrdersTab(orders) {
    if (orders.length === 0) {
      return `
        <div class="empty-state-card" style="text-align:center; padding:5rem 2rem; background:var(--bg-cream-tint); border:1px solid var(--border-subtle); border-radius:18px;">
          <div class="empty-state-icon" style="margin-bottom:1.2rem; color:var(--accent-sage-dark);">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
            </svg>
          </div>
          <h3 class="empty-state-title" style="font-family:var(--font-serif); font-size:1.8rem; margin-bottom:0.6rem;">No orders placed yet</h3>
          <p class="empty-state-desc" style="color:var(--text-charcoal-muted); max-width:480px; margin:0 auto 1.8rem; font-size:0.9rem;">When you acquire pieces from Shugroves Emporium, your Cloud Firestore order tracking, receipts, and delivery updates will appear here.</p>
          <a href="#collections" class="btn-primary" style="display:inline-block; padding:0.8rem 1.8rem; border-radius:24px;">Discover Collections</a>
        </div>
      `;
    }

    return `
      <div class="account-orders-list" style="display:flex; flex-direction:column; gap:1.8rem;">
        ${orders.map(order => `
          <article class="order-card" style="background:var(--bg-cream-tint); border:1px solid var(--border-subtle); border-radius:16px; padding:2rem; box-shadow:var(--shadow-subtle);">
            <div class="order-card-top" style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1.5rem; border-bottom:1px solid var(--border-subtle); padding-bottom:1rem;">
              <div class="order-header-info">
                <span class="order-id" style="font-size:1.1rem; font-weight:700; color:var(--text-charcoal); display:block;">Order Reference: <strong>${order.id}</strong></span>
                <span class="order-date" style="font-size:0.8rem; color:var(--text-charcoal-muted);">${order.date}</span>
              </div>
              <div class="order-status-badge status-${(order.status || 'processing').toLowerCase().replace(/\s+/g, '-')}" style="padding:0.4rem 0.9rem; border-radius:20px; font-size:0.75rem; font-weight:700; letter-spacing:0.08em; text-transform:uppercase; background:rgba(168,173,142,0.2); color:var(--accent-sage-dark);">
                ${order.status || 'Processing'}
              </div>
            </div>

            <!-- Order Timeline Progress -->
            <div class="order-timeline-card" style="background: rgba(43,38,32,0.02); border: 1px solid var(--border-subtle); border-radius: 12px; padding: 1.4rem; margin-bottom: 1.5rem;">
              <div class="timeline-steps" style="display:flex; justify-content:space-between; position:relative;">
                <div class="timeline-step ${order.status !== 'Cancelled' ? 'step-done' : ''}">
                  <span class="dot" style="width:16px; height:16px; border-radius:50%; background:var(--accent-sage-dark); display:inline-block; margin-bottom:0.3rem;"></span>
                  <span class="lbl" style="font-size:0.72rem; font-weight:600; display:block;">Placed</span>
                  <span class="date" style="font-size:0.65rem; color:var(--text-charcoal-muted);">Logged in DB</span>
                </div>
                <div class="timeline-step ${order.status === 'Processing' || order.status === 'Confirmed' || order.status === 'In Transit' || order.status === 'Delivered' ? 'step-done' : ''}">
                  <span class="dot" style="width:16px; height:16px; border-radius:50%; background:var(--accent-sage-dark); display:inline-block; margin-bottom:0.3rem;"></span>
                  <span class="lbl" style="font-size:0.72rem; font-weight:600; display:block;">Processing</span>
                  <span class="date" style="font-size:0.65rem; color:var(--text-charcoal-muted);">At Atelier</span>
                </div>
                <div class="timeline-step ${order.status === 'In Transit' || order.status === 'Delivered' ? 'step-done' : ''}">
                  <span class="dot" style="width:16px; height:16px; border-radius:50%; background:${order.status === 'In Transit' || order.status === 'Delivered' ? 'var(--accent-sage-dark)' : 'var(--border-subtle)'}; display:inline-block; margin-bottom:0.3rem;"></span>
                  <span class="lbl" style="font-size:0.72rem; font-weight:600; display:block;">In Transit</span>
                  <span class="date" style="font-size:0.65rem; color:var(--text-charcoal-muted);">${order.carrier || 'BlueDart'}</span>
                </div>
                <div class="timeline-step ${order.status === 'Delivered' ? 'step-done' : ''}">
                  <span class="dot" style="width:16px; height:16px; border-radius:50%; background:${order.status === 'Delivered' ? 'var(--accent-sage-dark)' : 'var(--border-subtle)'}; display:inline-block; margin-bottom:0.3rem;"></span>
                  <span class="lbl" style="font-size:0.72rem; font-weight:600; display:block;">Delivered</span>
                  <span class="date" style="font-size:0.65rem; color:var(--text-charcoal-muted);">Completed</span>
                </div>
              </div>
            </div>

            <!-- Order Items Preview -->
            <div class="order-items-grid" style="display:grid; grid-template-columns:repeat(auto-fill, minmax(260px, 1fr)); gap:1rem; margin-bottom:1.5rem;">
              ${(order.items || []).map(item => `
                <div class="order-item-chip" style="display:flex; align-items:center; gap:0.8rem; background:rgba(43,38,32,0.02); border:1px solid var(--border-subtle); border-radius:10px; padding:0.8rem;">
                  <img src="${item.image}" alt="${item.name}" class="chip-img" style="width:48px; height:58px; object-fit:cover; border-radius:6px;">
                  <div class="chip-info" style="flex:1; min-width:0;">
                    <span class="chip-title" style="font-size:0.82rem; font-weight:600; color:var(--text-charcoal); display:block; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${item.name}</span>
                    <span class="chip-meta" style="font-size:0.72rem; color:var(--text-charcoal-muted); display:block;">${item.size ? `Size: ${item.size} • ` : ''}${item.color ? `${item.color} • ` : ''}Qty: ${item.quantity}</span>
                    <span class="chip-price" style="font-size:0.82rem; font-weight:700; color:var(--text-charcoal);">₹${(item.price * item.quantity).toLocaleString('en-IN')}</span>
                  </div>
                </div>
              `).join('')}
            </div>

            <!-- Delivery Address Card & Shipping Info -->
            ${order.shippingAddress ? `
              <div class="order-shipping-summary-box" style="background: rgba(43,38,32,0.03); border: 1px solid var(--border-subtle); border-radius: 10px; padding: 1rem 1.4rem; margin: 1.2rem 0;">
                <span style="font-size:0.68rem; letter-spacing:0.14em; text-transform:uppercase; color:var(--accent-sage-dark); font-weight:700; display:block; margin-bottom:0.3rem;">Dispatched Delivery Address</span>
                <strong style="font-size:0.9rem; color:var(--text-charcoal);">${order.shippingAddress.name || order.shippingAddress.fullName || 'Recipient'} • Tel: ${order.shippingAddress.phone || 'N/A'}</strong>
                <p style="font-size:0.84rem; color:var(--text-charcoal-muted); margin:0.2rem 0 0;">
                  ${order.shippingAddress.street}, ${order.shippingAddress.city}, ${order.shippingAddress.state} - ${order.shippingAddress.postalCode || order.shippingAddress.zip}, ${order.shippingAddress.country || 'India'}
                </p>
              </div>
            ` : ''}

            <div class="order-card-bottom" style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:1rem; padding-top:1rem; border-top:1px solid var(--border-subtle); font-size:0.85rem;">
              <div class="order-carrier-info" style="color:var(--text-charcoal-muted);">
                <span>Courier: <strong>${order.carrier || 'BlueDart Express'}</strong></span>
                <span style="margin-left:1rem;">Tracking: <strong>${order.trackingNumber || 'IND-EXP-TRACK'}</strong></span>
              </div>
              <div class="order-total-info">
                <span style="font-size:1.05rem; font-weight:700; color:var(--text-charcoal);">Total Paid: <strong>₹${(order.total || 0).toLocaleString('en-IN')}</strong></span>
              </div>
            </div>
          </article>
        `).join('')}
      </div>
    `;
  }

  function renderAddressesTab(user, addresses) {
    return `
      <div class="account-card" style="background:var(--bg-cream-tint); border:1px solid var(--border-subtle); border-radius:16px; padding:2.5rem; box-shadow:var(--shadow-subtle);">
        <div class="account-card-header-row" style="display:flex; justify-content:space-between; align-items:center; margin-bottom: 2rem; flex-wrap:wrap; gap:1rem;">
          <div>
            <h2 class="account-section-heading" style="font-family:var(--font-serif); font-size:1.8rem; margin-bottom:0.2rem;">Saved Delivery Addresses</h2>
            <p style="font-size:0.85rem; color:var(--text-charcoal-muted); margin:0;">These addresses are saved to your account and Cloud Firestore for 1-click checkout.</p>
          </div>
          <button class="btn-primary" id="btnOpenAddAddress" style="padding: 0.65rem 1.4rem; font-size: 0.8rem; border-radius:24px;">
            <span>+ Add New Address</span>
          </button>
        </div>

        ${showAddAddressModal ? `
          <!-- Inline New Address Form -->
          <div class="inline-add-address-box" style="background: rgba(43,38,32,0.03); border: 1px solid var(--border-subtle); border-radius: 14px; padding: 1.8rem; margin-bottom: 2.5rem;">
            <h3 style="font-family:var(--font-serif); font-size:1.4rem; margin-bottom:1rem;">Add New Delivery Address</h3>
            <form id="newAddressForm">
              <div class="form-row-2">
                <div class="form-group">
                  <label for="newAddrName">Recipient Full Name *</label>
                  <input type="text" id="newAddrName" required placeholder="Full Name">
                </div>
                <div class="form-group">
                  <label for="newAddrPhone">Contact Phone *</label>
                  <input type="tel" id="newAddrPhone" required placeholder="Phone Number">
                </div>
              </div>

              <div class="form-group">
                <label for="newAddrStreet">Street Address & Landmark *</label>
                <input type="text" id="newAddrStreet" required placeholder="Flat/House No., Building, Street">
              </div>

              <div class="form-row-3">
                <div class="form-group">
                  <label for="newAddrCity">City *</label>
                  <input type="text" id="newAddrCity" required placeholder="e.g. Mumbai">
                </div>
                <div class="form-group">
                  <label for="newAddrState">State *</label>
                  <input type="text" id="newAddrState" required placeholder="e.g. Maharashtra">
                </div>
                <div class="form-group">
                  <label for="newAddrPostal">Postal Code *</label>
                  <input type="text" id="newAddrPostal" required placeholder="e.g. 400026">
                </div>
              </div>

              <div style="display:flex; gap:1rem; margin-top:1.2rem;">
                <button type="submit" class="btn-primary" style="padding:0.7rem 1.6rem; border-radius:20px;">Save Address to Cloud</button>
                <button type="button" class="btn-secondary" id="cancelAddAddressBtn" style="border-radius:20px;">Cancel</button>
              </div>
            </form>
          </div>
        ` : ''}

        <div class="address-cards-list" style="display:grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 1.5rem;">
          ${addresses.length === 0 ? `
            <div style="padding:2.5rem; text-align:center; grid-column:1/-1; background:rgba(43,38,32,0.02); border-radius:12px; border:1px dashed var(--border-subtle);">
              <p style="color:var(--text-charcoal-muted); margin:0 0 1rem;">No saved delivery addresses. Click "+ Add New Address" above or save one during checkout.</p>
              <button class="btn-primary" id="btnOpenAddAddressEmpty" style="padding: 0.6rem 1.2rem; font-size: 0.78rem; border-radius:20px;">Add First Address</button>
            </div>
          ` : addresses.map(addr => `
            <div class="address-book-card" style="background:var(--bg-cream); border:1px solid var(--border-subtle); border-radius:14px; padding:1.6rem; position:relative;">
              <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.8rem;">
                <span class="address-type-badge" style="font-size:0.68rem; letter-spacing:0.12em; text-transform:uppercase; color:var(--accent-sage-dark); font-weight:700;">
                  ${addr.isDefault ? '★ Primary Delivery Address' : 'Saved Address'}
                </span>
                <button class="btn-delete-addr" data-addr-id="${addr.id}" style="background:none; border:none; color:var(--accent-terracotta-dark); cursor:pointer; font-size:0.75rem; font-weight:600;" title="Delete Address">Delete</button>
              </div>
              <strong style="color:var(--text-charcoal); font-size:1rem; display:block; margin-bottom:0.3rem;">
                ${addr.fullName || addr.name || user.name}
              </strong>
              <p class="address-text" style="color:var(--text-charcoal-muted); font-size:0.86rem; line-height:1.6; margin:0 0 1rem;">
                ${addr.street}<br>
                ${addr.city}, ${addr.state} - ${addr.postalCode || addr.zip}<br>
                ${addr.country || 'India'}<br>
                Phone: ${addr.phone || user.phone || 'N/A'}
              </p>
              ${!addr.isDefault ? `
                <button class="btn-set-default-addr" data-addr-id="${addr.id}" style="background:none; border:1px solid var(--border-subtle); border-radius:20px; padding:0.35rem 0.9rem; font-size:0.74rem; font-weight:600; color:var(--text-charcoal); cursor:pointer;">
                  Set as Default
                </button>
              ` : ''}
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  function renderProfileTab(user) {
    return `
      <div class="account-card" style="background:var(--bg-cream-tint); border:1px solid var(--border-subtle); border-radius:16px; padding:2.5rem; box-shadow:var(--shadow-subtle);">
        <h2 class="account-section-heading" style="font-family:var(--font-serif); font-size:1.8rem; margin-bottom:0.4rem;">Personal Information</h2>
        <p style="font-size:0.85rem; color:var(--text-charcoal-muted); margin-bottom:2rem;">Manage your name, contact information, and atelier communication preferences.</p>
        
        <form class="checkout-form" id="profileForm">
          <div class="form-row-2">
            <div class="form-group">
              <label for="profName">Full Name</label>
              <input type="text" id="profName" value="${user.name || ''}" placeholder="Full Name">
            </div>
            <div class="form-group">
              <label for="profEmail">Email Address</label>
              <input type="email" id="profEmail" value="${user.email || ''}" placeholder="Email Address">
            </div>
          </div>
          <div class="form-group">
            <label for="profPhone">Mobile Phone</label>
            <input type="tel" id="profPhone" value="${user.phone || ''}" placeholder="Phone Number">
          </div>
          <button type="submit" class="btn-primary" style="margin-top: 1.5rem; padding:0.85rem 2rem; border-radius:24px; font-size:0.82rem; font-weight:700; letter-spacing:0.1em; text-transform:uppercase;">
            Save Profile Changes &rarr;
          </button>
        </form>
      </div>
    `;
  }

  function attachListeners() {
    // Tab switching buttons
    const tabs = container.querySelectorAll('.category-tab-btn[data-tab]');
    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        activeTab = tab.getAttribute('data-tab');
        window.location.hash = `#account?tab=${activeTab}`;
        showAddAddressModal = false;
        updateView();
      });
    });

    // Open/Cancel Add Address Form
    const openAddBtn = document.getElementById('btnOpenAddAddress');
    const openAddEmptyBtn = document.getElementById('btnOpenAddAddressEmpty');
    const cancelAddBtn = document.getElementById('cancelAddAddressBtn');

    if (openAddBtn) {
      openAddBtn.addEventListener('click', () => {
        showAddAddressModal = true;
        updateView();
      });
    }
    if (openAddEmptyBtn) {
      openAddEmptyBtn.addEventListener('click', () => {
        showAddAddressModal = true;
        updateView();
      });
    }
    if (cancelAddBtn) {
      cancelAddBtn.addEventListener('click', () => {
        showAddAddressModal = false;
        updateView();
      });
    }

    // Submit New Address Form
    const newAddrForm = document.getElementById('newAddressForm');
    if (newAddrForm) {
      newAddrForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const addressData = {
          fullName: document.getElementById('newAddrName').value.trim(),
          phone: document.getElementById('newAddrPhone').value.trim(),
          street: document.getElementById('newAddrStreet').value.trim(),
          city: document.getElementById('newAddrCity').value.trim(),
          state: document.getElementById('newAddrState').value.trim(),
          postalCode: document.getElementById('newAddrPostal').value.trim(),
          country: "India"
        };
        store.addUserAddress(addressData);
        showToast("Delivery address saved to cloud successfully.", 'success');
        showAddAddressModal = false;
        updateView();
      });
    }

    // Delete Address
    const delBtns = container.querySelectorAll('.btn-delete-addr');
    delBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-addr-id');
        store.deleteUserAddress(id);
        showToast("Address removed.", 'info');
        updateView();
      });
    });

    // Set Default Address
    const defBtns = container.querySelectorAll('.btn-set-default-addr');
    defBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-addr-id');
        store.setDefaultUserAddress(id);
        showToast("Default address updated.", 'success');
        updateView();
      });
    });

    // Profile Save Form
    const profForm = document.getElementById('profileForm');
    if (profForm) {
      profForm.addEventListener('submit', (e) => {
        e.preventDefault();
        store.setUser({
          ...store.user,
          name: document.getElementById('profName').value.trim(),
          email: document.getElementById('profEmail').value.trim(),
          phone: document.getElementById('profPhone').value.trim()
        });
        showToast("Profile details updated successfully.", 'success');
        updateView();
      });
    }
  }

  // Render initial view immediately
  updateView();

  // Async refresh orders in background from Firestore
  store.getOrdersForCurrentUser().then(orders => {
    if (orders && orders.length !== cachedOrders.length) {
      cachedOrders = orders;
      if (activeTab === 'orders') {
        updateView();
      }
    }
  }).catch(() => {});
}
