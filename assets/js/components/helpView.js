/**
 * Shugroves Emporium - Help & Client Care View
 * Customer support information with real clickable actions (Phone dialer, WhatsApp chat, Email mailto),
 * business hours, shipping policies, returns, and FAQs.
 */

import { BRAND_CONFIG } from '../config.js';

export function renderHelpView(container) {
  const { contactInfo } = BRAND_CONFIG;

  container.innerHTML = `
    <div class="editorial-page-container">
      <!-- Help Top Hero -->
      <header class="about-hero-header">
        <span class="about-eyebrow">Client Support & Care</span>
        <h1 class="about-hero-title">Atelier Concierge</h1>
        <p class="about-hero-lead">
          We are dedicated to providing an exceptional client experience. Connect with our atelier team for styling advice, order tracking, bespoke sizing, or garment care assistance.
        </p>
      </header>

      <!-- Contact Actions Grid (Real Clickable Channels) -->
      <div class="help-contact-grid">
        <!-- Phone Action Card -->
        <a href="tel:${contactInfo.phoneTel}" class="help-action-card">
          <div class="help-card-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
            </svg>
          </div>
          <span class="help-card-tag">Telephone Support</span>
          <h3 class="help-card-title">Atelier Direct Line</h3>
          <p class="help-card-val-highlight">${contactInfo.phone}</p>
          <p class="help-card-sub">Direct telephone to atelier reception</p>
          <span class="help-card-btn-link">Call Atelier &rarr;</span>
        </a>

        <!-- WhatsApp Action Card -->
        <a href="${contactInfo.whatsappUrl}" target="_blank" rel="noopener noreferrer" class="help-action-card help-action-whatsapp">
          <div class="help-card-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
              <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
            </svg>
          </div>
          <span class="help-card-tag">Instant Chat</span>
          <h3 class="help-card-title">WhatsApp Concierge</h3>
          <p class="help-card-val-highlight">${contactInfo.whatsapp}</p>
          <p class="help-card-sub">Real-time styling & order inquiries</p>
          <span class="help-card-btn-link">Open WhatsApp Chat &rarr;</span>
        </a>

        <!-- Email Action Card -->
        <a href="mailto:${contactInfo.email}" class="help-action-card">
          <div class="help-card-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
              <polyline points="22,6 12,13 2,6"></polyline>
            </svg>
          </div>
          <span class="help-card-tag">Email Assistance</span>
          <h3 class="help-card-title">Concierge Desk</h3>
          <p class="help-card-val-highlight">${contactInfo.email}</p>
          <p class="help-card-sub">Inquiries answered within 24 hours</p>
          <span class="help-card-btn-link">Compose Email &rarr;</span>
        </a>
      </div>

      <!-- Business Hours & Atelier Location Strip -->
      <div class="help-schedule-panel">
        <div class="schedule-col">
          <span class="schedule-label">Concierge Hours</span>
          <h4 class="schedule-val">${contactInfo.businessHours}</h4>
          <span class="schedule-hint">Inquiries received outside hours answered the following morning</span>
        </div>
        <div class="schedule-col">
          <span class="schedule-label">Flagship Atelier</span>
          <h4 class="schedule-val">${contactInfo.atelierAddress}</h4>
          <span class="schedule-hint">Private fitting appointments available upon request</span>
        </div>
      </div>

      <!-- Policy Accordions & Help Topics -->
      <div class="help-faq-section">
        <span class="section-eyebrow">Assistance & Policies</span>
        <h2 class="about-section-heading">Frequently Addressed Inquiries</h2>

        <div class="pdp-accordions" style="margin-top: 1.5rem;">
          <!-- Shipping Information -->
          <details class="pdp-accordion-item" open>
            <summary class="pdp-accordion-title">
              <span>Carbon-Neutral Shipping & Dispatch</span>
              <span class="accordion-icon">+</span>
            </summary>
            <div class="pdp-accordion-body">
              <p>
                All orders are packed in plastic-free botanical paper and dispatched via carbon-neutral air express within 24–48 hours of order confirmation.
              </p>
              <ul class="pdp-details-list">
                <li><strong>Domestic (India):</strong> Complimentary express delivery within 2–4 business days.</li>
                <li><strong>International:</strong> DHL Express delivery within 4–7 business days with pre-cleared duties.</li>
                <li><strong>Tracking:</strong> Live real-time tracking links are emailed upon atelier dispatch.</li>
              </ul>
            </div>
          </details>

          <!-- Returns & Exchanges -->
          <details class="pdp-accordion-item">
            <summary class="pdp-accordion-title">
              <span>Complimentary 30-Day Returns & Exchanges</span>
              <span class="accordion-icon">+</span>
            </summary>
            <div class="pdp-accordion-body">
              <p>
                We offer complimentary doorstep pickup for returns and size exchanges within 30 days of delivery. Garments must be unworn, in original unwashed condition with all cotton tags attached.
              </p>
              <p>
                To initiate a return or exchange, visit your <a href="#account?tab=orders" style="color:var(--accent-terracotta-dark); text-decoration:underline;">Client Account Portal</a> or message our WhatsApp concierge.
              </p>
            </div>
          </details>

          <!-- Sizing & Tailoring Guide -->
          <details class="pdp-accordion-item">
            <summary class="pdp-accordion-title">
              <span>Size & Silhouette Consultation</span>
              <span class="accordion-icon">+</span>
            </summary>
            <div class="pdp-accordion-body">
              <p>
                Our silhouettes are intentionally tailored with comfortable ease. If you are between sizes or desire a custom sleeve or hem adjustment, our atelier offers complimentary bespoke sizing consultations prior to dispatch.
              </p>
            </div>
          </details>

          <!-- Textile & Natural Dye Care -->
          <details class="pdp-accordion-item">
            <summary class="pdp-accordion-title">
              <span>Textile Care & Botanical Patina</span>
              <span class="accordion-icon">+</span>
            </summary>
            <div class="pdp-accordion-body">
              <p>
                Because our textiles are dyed with madder root, indigo, and marigold extracts, we advise washing in cold water with pH-neutral detergent or gentle dry cleaning. Dry in ambient shade to preserve the brilliance of natural hues.
              </p>
            </div>
          </details>
        </div>
      </div>
    </div>
  `;
}
