/**
 * Shugroves Emporium - Real Shopify Checkout Gateway
 * Seamlessly routes all customer checkouts to Shopify's official hosted checkout.
 */

import { store } from '../store.js';

export function renderCheckoutView(container) {
  const totals = store.getCartTotals();
  const checkoutUrl = store.getCheckoutUrl();

  if (totals.itemCount === 0) {
    container.innerHTML = `
      <div class="checkout-page" style="padding: 10rem 2rem; text-align: center;">
        <h2 class="section-heading">Your Bag is Empty</h2>
        <p class="empty-state-desc" style="color:var(--text-charcoal-muted); margin-top:0.8rem;">Please add pieces to your shopping bag before proceeding to checkout.</p>
        <a href="#collections" class="btn-primary" style="display: inline-block; margin-top: 2rem; padding: 0.8rem 2rem; border-radius: 24px;">Explore Collections</a>
      </div>
    `;
    return;
  }

  // Redirect directly to Shopify Real Checkout
  container.innerHTML = `
    <div class="checkout-page" style="padding: 10rem 2rem; text-align: center;">
      <div style="max-width: 500px; margin: 0 auto; background: var(--bg-cream-tint); padding: 3rem 2rem; border-radius: 20px; border: 1px solid var(--border-subtle);">
        <span class="section-eyebrow" style="font-size: 0.75rem; letter-spacing: 0.2em; text-transform: uppercase; color: var(--accent-sage-dark); font-weight: 700;">Secure Atelier Gateway</span>
        <h2 class="section-heading" style="font-family: var(--font-serif); font-size: 2rem; margin: 1rem 0 0.5rem;">Connecting to Secure Checkout</h2>
        <p style="color: var(--text-charcoal-muted); font-size: 0.95rem; line-height: 1.6; margin-bottom: 2rem;">Transferring to Shopify official checkout for secure payment processing...</p>
        <a href="${checkoutUrl}" class="btn-primary" id="directCheckoutLink" style="display: inline-flex; align-items: center; gap: 0.6rem; padding: 1rem 2.5rem; border-radius: 30px;">
          <span>Proceed to Shopify Checkout &rarr;</span>
        </a>
      </div>
    </div>
  `;

  // Auto-redirect
  setTimeout(() => {
    if (checkoutUrl) {
      window.location.href = checkoutUrl;
    }
  }, 400);
}
