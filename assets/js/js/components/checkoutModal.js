/**
 * Shugroves Emporium - Luxury 3-Step Checkout Flow with Cloud Firestore Database
 * Complete delivery address prompt, saved address selector, payment processing,
 * and persistent order confirmation with live status tracking.
 */

import { store } from '../store.js';
import { showToast } from './toast.js';

export function renderCheckoutView(container) {
  const totals = store.getCartTotals();
  const items = store.cart;

  // Retrieve last placed order from session if user just completed checkout
  let lastOrder = null;
  try {
    const rawLast = sessionStorage.getItem('shugroves_last_order');
    if (rawLast) lastOrder = JSON.parse(rawLast);
  } catch (e) {}

  let step = lastOrder ? 3 : 1; // 1: Address & Delivery, 2: Payment, 3: Confirmation

  if (items.length === 0 && !lastOrder) {
    container.innerHTML = `
      <div class="checkout-page" style="padding: 10rem 2rem; text-align: center;">
        <h2 class="section-heading">Your Bag is Empty</h2>
        <p class="empty-state-desc">Please add garments or objects to your shopping bag before proceeding to checkout.</p>
        <a href="#collections" class="btn-primary" style="display: inline-block; margin-top: 2rem;">Explore Collections</a>
      </div>
    `;
    return;
  }

  const savedAddrs = store.user?.addresses || [];
  const defaultAddr = savedAddrs.find(a => a.isDefault) || savedAddrs[0] || {};

  let formData = {
    name: store.user?.name || defaultAddr.fullName || defaultAddr.name || "",
    email: store.user?.email || "",
    phone: store.user?.phone || defaultAddr.phone || "",
    street: defaultAddr.street || "",
    apartment: defaultAddr.apartment || "",
    city: defaultAddr.city || "",
    state: defaultAddr.state || "",
    postalCode: defaultAddr.postalCode || defaultAddr.zip || "",
    country: defaultAddr.country || "India",
    instructions: "",
    saveAddress: true,
    deliveryMethod: "standard", // standard (free) or express (₹350)
    paymentMethod: "upi", // upi, card, cod
    upiId: "client@upi",
    cardNumber: "•••• •••• •••• 4092",
    confirmedOrder: lastOrder || null
  };

  function updateView() {
    container.innerHTML = `
      <div class="checkout-page">
        <!-- Checkout Header -->
        <header class="checkout-header">
          <div class="checkout-header-inner">
            <a href="#home" class="checkout-brand-title">Shugroves Emporium</a>
            <div class="checkout-steps-indicator">
              <span class="step-badge ${step >= 1 ? 'step-active' : ''}">1. Delivery Address</span>
              <span class="step-sep">&rarr;</span>
              <span class="step-badge ${step >= 2 ? 'step-active' : ''}">2. Payment & Review</span>
              <span class="step-sep">&rarr;</span>
              <span class="step-badge ${step >= 3 ? 'step-active' : ''}">3. Confirmation</span>
            </div>
          </div>
        </header>

        <div class="checkout-container">
          ${step === 3 ? renderConfirmationStep() : `
            <div class="checkout-grid">
              <!-- Left: Step Forms -->
              <div class="checkout-main-col">
                ${step === 1 ? renderAddressStep() : renderPaymentStep()}
              </div>

              <!-- Right: Order Summary Sidebar -->
              <aside class="checkout-summary-sidebar">
                <div class="checkout-summary-box">
                  <h3 class="checkout-summary-title">Order Summary (${totals.itemCount})</h3>
                  
                  <div class="checkout-items-mini-list">
                    ${items.map(item => `
                      <div class="mini-item-row">
                        <img src="${item.image}" alt="${item.name}" class="mini-item-img">
                        <div class="mini-item-info">
                          <span class="mini-item-name">${item.name}</span>
                          <span class="mini-item-meta">${item.size ? `Size: ${item.size} • ` : ''}${item.color ? `Color: ${item.color} • ` : ''}Qty: ${item.quantity}</span>
                        </div>
                        <span class="mini-item-price">₹${(item.price * item.quantity).toLocaleString('en-IN')}</span>
                      </div>
                    `).join('')}
                  </div>

                  <div class="checkout-calc-table">
                    <div class="calc-row">
                      <span>Subtotal</span>
                      <span>₹${totals.subtotal.toLocaleString('en-IN')}</span>
                    </div>
                    ${totals.discount > 0 ? `
                      <div class="calc-row discount-row">
                        <span>Conscious Discount</span>
                        <span>&minus; ₹${totals.discount.toLocaleString('en-IN')}</span>
                      </div>
                    ` : ''}
                    <div class="calc-row">
                      <span>Shipping</span>
                      <span>${formData.deliveryMethod === 'express' ? '₹350 (Express)' : (totals.shipping === 0 ? 'Complimentary' : `₹${totals.shipping}`)}</span>
                    </div>
                    <div class="calc-row total-row">
                      <span>Total Due</span>
                      <span>₹${(totals.total + (formData.deliveryMethod === 'express' ? 350 : 0)).toLocaleString('en-IN')}</span>
                    </div>
                  </div>

                  <div class="checkout-trust-badges">
                    <div class="trust-item">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                        <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                      </svg>
                      <span>Cloud Firestore Stored & Encrypted</span>
                    </div>
                    <div class="trust-item">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                        <circle cx="12" cy="10" r="3"></circle>
                      </svg>
                      <span>Carbon-Neutral Doorstep Dispatch</span>
                    </div>
                  </div>
                </div>
              </aside>
            </div>
          `}
        </div>
      </div>
    `;

    attachCheckoutListeners();
  }

  function renderAddressStep() {
    return `
      <div class="checkout-card">
        <div class="checkout-card-header">
          <span class="step-num">Step 1 of 2</span>
          <h2 class="step-heading">Where should we deliver your order?</h2>
          <p class="step-subheading">Please provide your complete shipping address for secure doorstep courier dispatch.</p>
        </div>

        ${savedAddrs.length > 0 ? `
          <!-- Saved Address Quick Picker -->
          <div class="saved-address-picker-section">
            <label class="section-sublabel">Choose a Saved Address:</label>
            <div class="saved-address-cards-grid">
              ${savedAddrs.map((addr, idx) => `
                <div class="saved-addr-chip ${formData.street === addr.street ? 'chip-selected' : ''}" data-addr-idx="${idx}">
                  <span class="chip-title">${addr.type || (addr.isDefault ? 'Default Address' : `Address #${idx + 1}`)}</span>
                  <p class="chip-text">${addr.fullName || addr.name || store.user.name}, ${addr.street}, ${addr.city} - ${addr.postalCode || addr.zip}</p>
                  <small class="chip-phone">Tel: ${addr.phone || store.user.phone || 'N/A'}</small>
                </div>
              `).join('')}
            </div>
            <div class="auth-divider-line" style="margin: 1.5rem 0;"><span>or enter new address</span></div>
          </div>
        ` : ''}

        <form class="checkout-form" id="addressForm">
          <div class="form-row-2">
            <div class="form-group">
              <label for="inputName">Recipient Full Name *</label>
              <input type="text" id="inputName" required value="${formData.name}" placeholder="e.g. Sonia Kapoor">
            </div>
            <div class="form-group">
              <label for="inputPhone">Mobile Phone (for courier delivery SMS) *</label>
              <input type="tel" id="inputPhone" required value="${formData.phone}" placeholder="e.g. +91 98201 45678">
            </div>
          </div>

          <div class="form-group">
            <label for="inputEmail">Email Address (for dispatch tracking & order receipt) *</label>
            <input type="email" id="inputEmail" required value="${formData.email}" placeholder="e.g. sonia.kapoor@example.com">
          </div>

          <div class="form-group">
            <label for="inputStreet">Street Address & Landmark *</label>
            <input type="text" id="inputStreet" required value="${formData.street}" placeholder="House/Flat No., Building Name, Street, Landmark">
          </div>

          <div class="form-row-3">
            <div class="form-group">
              <label for="inputCity">City *</label>
              <input type="text" id="inputCity" required value="${formData.city}" placeholder="e.g. Mumbai">
            </div>
            <div class="form-group">
              <label for="inputState">State / Province *</label>
              <input type="text" id="inputState" required value="${formData.state}" placeholder="e.g. Maharashtra">
            </div>
            <div class="form-group">
              <label for="inputPostal">Postal PIN Code *</label>
              <input type="text" id="inputPostal" required value="${formData.postalCode}" placeholder="e.g. 400026">
            </div>
          </div>

          <div class="form-row-2">
            <div class="form-group">
              <label for="inputCountry">Country</label>
              <input type="text" id="inputCountry" required value="${formData.country}" readonly style="background: rgba(43,38,32,0.04);">
            </div>
            <div class="form-group">
              <label for="inputNotes">Delivery Instructions (optional)</label>
              <input type="text" id="inputNotes" value="${formData.instructions}" placeholder="e.g. Leave with concierge / gate code #402">
            </div>
          </div>

          <div class="form-group checkbox-group" style="margin-top: 0.6rem;">
            <label class="custom-checkbox-label">
              <input type="checkbox" id="checkSaveAddress" ${formData.saveAddress ? 'checked' : ''}>
              <span>Save this delivery address to my account for faster checkout next time</span>
            </label>
          </div>

          <!-- Delivery Option Selection -->
          <div class="delivery-options-group" style="margin-top: 2rem;">
            <label class="section-sublabel">Select Dispatch Speed:</label>
            <div class="delivery-cards-grid">
              <label class="delivery-card ${formData.deliveryMethod === 'standard' ? 'delivery-selected' : ''}">
                <input type="radio" name="deliveryMethod" value="standard" ${formData.deliveryMethod === 'standard' ? 'checked' : ''}>
                <div class="delivery-card-info">
                  <strong>Standard Carbon-Neutral Delivery</strong>
                  <span>3-5 Business Days • Dispatched in slow-crafted linen pouch</span>
                </div>
                <span class="delivery-price">Complimentary</span>
              </label>

              <label class="delivery-card ${formData.deliveryMethod === 'express' ? 'delivery-selected' : ''}">
                <input type="radio" name="deliveryMethod" value="express" ${formData.deliveryMethod === 'express' ? 'checked' : ''}>
                <div class="delivery-card-info">
                  <strong>Priority Express Air Dispatch</strong>
                  <span>1-2 Business Days • Dedicated white-glove courier</span>
                </div>
                <span class="delivery-price">₹350</span>
              </label>
            </div>
          </div>

          <div class="checkout-form-actions">
            <button type="submit" class="btn-primary btn-checkout-next">
              <span>Continue to Payment &rarr;</span>
            </button>
          </div>
        </form>
      </div>
    `;
  }

  function renderPaymentStep() {
    return `
      <div class="checkout-card">
        <div class="checkout-card-header">
          <button type="button" class="btn-back-step" id="backToAddressBtn">&larr; Edit Delivery Address</button>
          <span class="step-num">Step 2 of 2</span>
          <h2 class="step-heading">Payment & Final Review</h2>
        </div>

        <!-- Confirmed Delivery Address Preview -->
        <div class="shipping-summary-preview">
          <div class="preview-header">
            <strong>Dispatching To:</strong>
            <button type="button" class="btn-text-link" id="changeAddressLink">Change</button>
          </div>
          <p class="preview-recipient"><strong>${formData.name}</strong> • ${formData.phone}</p>
          <p class="preview-address">${formData.street}, ${formData.city}, ${formData.state} - ${formData.postalCode}, ${formData.country}</p>
          <p class="preview-email">Tracking updates to: ${formData.email}</p>
          ${formData.instructions ? `<p class="preview-notes"><em>Note: ${formData.instructions}</em></p>` : ''}
        </div>

        <!-- Payment Method Tabs -->
        <div class="payment-tabs-list">
          <label class="payment-method-tile ${formData.paymentMethod === 'upi' ? 'tile-active' : ''}">
            <input type="radio" name="paymentType" value="upi" ${formData.paymentMethod === 'upi' ? 'checked' : ''}>
            <div class="payment-tile-content">
              <strong>UPI (Google Pay, PhonePe, Paytm)</strong>
              <span>Instant QR / VPA zero-fee secure payment</span>
            </div>
          </label>

          <label class="payment-method-tile ${formData.paymentMethod === 'card' ? 'tile-active' : ''}">
            <input type="radio" name="paymentType" value="card" ${formData.paymentMethod === 'card' ? 'checked' : ''}>
            <div class="payment-tile-content">
              <strong>Credit / Debit Card (Visa, Mastercard, Amex, RuPay)</strong>
              <span>Protected by 256-bit bank encryption</span>
            </div>
          </label>

          <label class="payment-method-tile ${formData.paymentMethod === 'cod' ? 'tile-active' : ''}">
            <input type="radio" name="paymentType" value="cod" ${formData.paymentMethod === 'cod' ? 'checked' : ''}>
            <div class="payment-tile-content">
              <strong>Cash On Delivery (Doorstep Verification)</strong>
              <span>Pay upon arrival via Cash, Card, or UPI</span>
            </div>
          </label>
        </div>

        <div class="payment-details-box" style="margin-top: 1.5rem;">
          ${formData.paymentMethod === 'upi' ? `
            <div class="form-group">
              <label for="inputUpi">Enter UPI ID / VPA</label>
              <input type="text" id="inputUpi" value="${formData.upiId}" placeholder="yourname@okhdfcbank">
            </div>
          ` : formData.paymentMethod === 'card' ? `
            <div class="form-group">
              <label for="inputCardNum">Card Number</label>
              <input type="text" id="inputCardNum" value="${formData.cardNumber}" placeholder="•••• •••• •••• ••••">
            </div>
            <div class="form-row-2">
              <div class="form-group">
                <label>Expiry Date</label>
                <input type="text" value="08/29" placeholder="MM/YY">
              </div>
              <div class="form-group">
                <label>CVV</label>
                <input type="password" value="•••" placeholder="•••" maxlength="4">
              </div>
            </div>
          ` : `
            <div class="cod-notice" style="background: rgba(43,38,32,0.03); border: 1px solid var(--border-subtle); padding: 1rem 1.2rem; border-radius: 8px;">
              <p style="font-size:0.85rem; color:var(--text-charcoal-muted); margin:0;">Our courier agent will deliver your order to <strong>${formData.street}, ${formData.city}</strong>. You can pay securely upon receipt.</p>
            </div>
          `}
        </div>

        <div class="checkout-form-actions" style="margin-top: 2rem;">
          <button type="button" class="btn-primary btn-checkout-submit" id="placeOrderBtn">
            <span>Place Order & Store in Cloud Database &rarr;</span>
          </button>
        </div>
      </div>
    `;
  }

  function renderConfirmationStep() {
    const order = formData.confirmedOrder;
    if (!order) return '';

    return `
      <div class="confirmation-card">
        <div class="confirmation-icon">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--accent-sage)" stroke-width="2">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
            <polyline points="22 4 12 14.01 9 11.01"></polyline>
          </svg>
        </div>

        <span class="confirmation-eyebrow">Order Placed & Stored in Firestore</span>
        <h1 class="confirmation-title">Thank You, ${(order.shippingAddress?.name || formData.name || 'Client').split(' ')[0]}</h1>
        <p class="confirmation-desc">
          Your order <strong>${order.id}</strong> has been logged to the cloud database and sent to our atelier for packaging.
        </p>

        <!-- Live Order Timeline Tracker -->
        <div class="order-timeline-card">
          <h4 class="timeline-title">Dispatch & Delivery Timeline</h4>
          <div class="timeline-steps">
            <div class="timeline-step step-done">
              <span class="dot"></span>
              <span class="lbl">Order Placed</span>
              <span class="date">Logged in DB</span>
            </div>
            <div class="timeline-step step-current">
              <span class="dot"></span>
              <span class="lbl">Processing</span>
              <span class="date">At Atelier</span>
            </div>
            <div class="timeline-step">
              <span class="dot"></span>
              <span class="lbl">Shipped</span>
              <span class="date">${order.carrier || 'BlueDart Express'}</span>
            </div>
            <div class="timeline-step">
              <span class="dot"></span>
              <span class="lbl">Delivered</span>
              <span class="date">3-5 Days</span>
            </div>
          </div>
        </div>

        <!-- Confirmed Delivery Address & Details -->
        <div class="confirmation-details-box">
          <div class="conf-col">
            <span class="conf-label">Order Reference:</span>
            <strong>${order.id}</strong>
          </div>
          <div class="conf-col">
            <span class="conf-label">Tracking Number:</span>
            <strong>${order.trackingNumber || 'IND-TRACK-EXP'}</strong>
          </div>
          <div class="conf-col">
            <span class="conf-label">Payment Mode:</span>
            <strong>${order.paymentMethod || 'Paid'}</strong>
          </div>
          <div class="conf-col">
            <span class="conf-label">Total Amount:</span>
            <strong>₹${(order.total || 0).toLocaleString('en-IN')}</strong>
          </div>
        </div>

        ${order.shippingAddress ? `
          <div class="confirmation-shipping-card" style="background: rgba(43,38,32,0.03); border:1px solid var(--border-subtle); border-radius:12px; padding:1.4rem 1.6rem; margin: 1.5rem 0; text-align: left;">
            <span style="font-size:0.7rem; letter-spacing:0.12em; text-transform:uppercase; color:var(--accent-sage-dark); font-weight:700; display:block; margin-bottom:0.4rem;">Delivering To Address</span>
            <strong style="color:var(--text-charcoal); font-size:0.95rem;">${order.shippingAddress.name} (${order.shippingAddress.phone})</strong>
            <p style="margin:0.2rem 0 0; color:var(--text-charcoal-muted); font-size:0.86rem;">${order.shippingAddress.street}, ${order.shippingAddress.city}, ${order.shippingAddress.state} - ${order.shippingAddress.postalCode}</p>
          </div>
        ` : ''}

        <div class="confirmation-actions">
          <a href="#account?tab=orders" class="btn-primary">View in My Orders</a>
          <a href="#collections" class="btn-secondary" id="btnContinueShopping">Continue Exploring &rarr;</a>
        </div>
      </div>
    `;
  }

  function attachCheckoutListeners() {
    // Saved Address Chip selection
    const chips = container.querySelectorAll('.saved-addr-chip');
    chips.forEach(chip => {
      chip.addEventListener('click', () => {
        const idx = parseInt(chip.dataset.addrIdx, 10);
        const selected = savedAddrs[idx];
        if (selected) {
          formData.name = selected.fullName || selected.name || formData.name;
          formData.phone = selected.phone || formData.phone;
          formData.street = selected.street || "";
          formData.city = selected.city || "";
          formData.state = selected.state || "";
          formData.postalCode = selected.postalCode || selected.zip || "";
          formData.country = selected.country || "India";
          updateView();
        }
      });
    });

    // Step 1: Address Form Submit
    const addressForm = document.getElementById('addressForm');
    if (addressForm) {
      addressForm.addEventListener('submit', (e) => {
        e.preventDefault();
        formData.name = document.getElementById('inputName').value.trim();
        formData.email = document.getElementById('inputEmail').value.trim();
        formData.phone = document.getElementById('inputPhone').value.trim();
        formData.street = document.getElementById('inputStreet').value.trim();
        formData.city = document.getElementById('inputCity').value.trim();
        formData.state = document.getElementById('inputState').value.trim();
        formData.postalCode = document.getElementById('inputPostal').value.trim();
        formData.instructions = document.getElementById('inputNotes').value.trim();
        
        const saveCheck = document.getElementById('checkSaveAddress');
        if (saveCheck) formData.saveAddress = saveCheck.checked;

        const deliveryRadio = addressForm.querySelector('input[name="deliveryMethod"]:checked');
        if (deliveryRadio) formData.deliveryMethod = deliveryRadio.value;

        step = 2;
        updateView();
      });
    }

    // Step 2: Back to Address
    const backBtn = document.getElementById('backToAddressBtn');
    const changeAddrLink = document.getElementById('changeAddressLink');
    if (backBtn) backBtn.addEventListener('click', () => { step = 1; updateView(); });
    if (changeAddrLink) changeAddrLink.addEventListener('click', () => { step = 1; updateView(); });

    // Step 2: Payment Radio Change
    const paymentRadios = container.querySelectorAll('input[name="paymentType"]');
    paymentRadios.forEach(radio => {
      radio.addEventListener('change', (e) => {
        formData.paymentMethod = e.target.value;
        updateView();
      });
    });

    // Step 2: Place Order Button (Explicitly prevent default submit / navigation)
    const placeBtn = document.getElementById('placeOrderBtn');
    if (placeBtn) {
      placeBtn.addEventListener('click', async (e) => {
        if (e) {
          e.preventDefault();
          e.stopPropagation();
        }

        placeBtn.disabled = true;
        placeBtn.innerHTML = `<span>Saving Order to Database...</span>`;

        const paymentLabel = formData.paymentMethod === 'upi' ? `UPI (${formData.upiId || 'Instant'})` :
                             formData.paymentMethod === 'card' ? `Credit Card (${formData.cardNumber || 'Visa'})` :
                             'Cash On Delivery';

        const shippingAddress = {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          street: formData.street,
          city: formData.city,
          state: formData.state,
          postalCode: formData.postalCode,
          country: formData.country,
          instructions: formData.instructions,
          saveAddress: formData.saveAddress
        };

        try {
          const placedOrder = await store.placeOrder(shippingAddress, paymentLabel);
          formData.confirmedOrder = placedOrder;
          
          // Persist order in session so confirmation remains stable
          try {
            sessionStorage.setItem('shugroves_last_order', JSON.stringify(placedOrder));
          } catch (err) {}

          step = 3;
          updateView();
          showToast(`Order ${placedOrder.id} logged to Cloud Database!`, 'success');
        } catch (err) {
          showToast("Failed to place order: " + err.message, 'error');
          placeBtn.disabled = false;
          placeBtn.innerHTML = `<span>Place Order & Store in Cloud Database &rarr;</span>`;
        }
      });
    }

    // Step 3: Clear session order when clicking continue shopping
    const continueBtn = document.getElementById('btnContinueShopping');
    if (continueBtn) {
      continueBtn.addEventListener('click', () => {
        try {
          sessionStorage.removeItem('shugroves_last_order');
        } catch (e) {}
      });
    }
  }

  updateView();
}
