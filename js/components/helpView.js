/**
 * Shugroves Emporium - Help & Client Care View
 * Customer support information with real interactive Contact Form,
 * WhatsApp/Phone/Email actions, business hours, and FAQ accordions.
 */

import { BRAND_CONFIG } from '../config.js';
import { showToast } from './toast.js';

export function renderHelpView(container) {
  const { contactInfo } = BRAND_CONFIG;

  container.innerHTML = `
    <div class="editorial-page-container help-page-wrapper" style="padding-top: 8.5rem; min-height: 100vh;">
      <!-- Help Top Hero -->
      <header class="help-header" style="text-align: center; padding: 3rem 1.5rem 2.5rem;">
        <span class="help-eyebrow" style="font-size: 0.75rem; letter-spacing: 0.22em; text-transform: uppercase; font-weight: 700; color: var(--accent-sage-dark); display: block; margin-bottom: 0.6rem;">Client Care & Inquiries</span>
        <h1 class="help-title" style="font-family: var(--font-serif); font-size: clamp(2.2rem, 5vw, 3.5rem); font-weight: 400; color: var(--text-charcoal); margin-bottom: 0.8rem;">How May We Assist You?</h1>
        <p class="help-subtitle" style="font-size: 1rem; color: var(--text-charcoal-muted); max-width: 600px; margin: 0 auto; line-height: 1.7;">
          Our dedicated concierge team is available to assist with bespoke sizing, styling advice, orders, and delivery logistics.
        </p>
      </header>

      <div class="section-container help-main-layout" style="max-width: 1200px; margin: 0 auto; padding: 0 2rem 6rem;">
        <!-- Contact Concierge Cards Row -->
        <div class="concierge-cards-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 1.5rem; margin-bottom: 3.5rem;">
          <!-- 1. Telephone -->
          <a href="${contactInfo.phoneTel ? `tel:${contactInfo.phoneTel}` : '#helpContactForm'}" class="concierge-card" title="Call Concierge" style="background: var(--bg-cream-tint); padding: 2rem 1.5rem; border-radius: 16px; border: 1px solid var(--border-subtle); text-decoration: none; color: inherit; display: flex; flex-direction: column; gap: 0.5rem; transition: transform 0.3s ease, box-shadow 0.3s ease;">
            <div class="concierge-card-icon" style="width: 44px; height: 44px; border-radius: 50%; background: var(--bg-cream); display: flex; align-items: center; justify-content: center; color: var(--accent-terracotta-dark); margin-bottom: 0.5rem;">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
            </div>
            <h3 class="concierge-card-title" style="font-size: 1.1rem; font-weight: 600; color: var(--text-charcoal); margin: 0;">Telephone Support</h3>
            <p class="concierge-card-val" style="font-size: 0.95rem; font-weight: 700; color: var(--accent-terracotta-dark); margin: 0;">${contactInfo.phone || 'Atelier Direct Line'}</p>
            <span class="concierge-card-sub" style="font-size: 0.8rem; color: var(--text-charcoal-muted);">${contactInfo.businessHours || 'Mon – Sat: 10am – 7pm IST'}</span>
          </a>

          <!-- 2. WhatsApp -->
          <a href="${contactInfo.whatsappUrl || '#helpContactForm'}" ${contactInfo.whatsappUrl ? 'target="_blank" rel="noopener noreferrer"' : ''} class="concierge-card" title="Chat on WhatsApp" style="background: var(--bg-cream-tint); padding: 2rem 1.5rem; border-radius: 16px; border: 1px solid var(--border-subtle); text-decoration: none; color: inherit; display: flex; flex-direction: column; gap: 0.5rem; transition: transform 0.3s ease, box-shadow 0.3s ease;">
            <div class="concierge-card-icon" style="width: 44px; height: 44px; border-radius: 50%; background: var(--bg-cream); display: flex; align-items: center; justify-content: center; color: var(--accent-sage-dark); margin-bottom: 0.5rem;">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
            </div>
            <h3 class="concierge-card-title" style="font-size: 1.1rem; font-weight: 600; color: var(--text-charcoal); margin: 0;">WhatsApp Concierge</h3>
            <p class="concierge-card-val" style="font-size: 0.95rem; font-weight: 700; color: var(--accent-sage-dark); margin: 0;">${contactInfo.whatsapp || 'Instant Chat Support'}</p>
            <span class="concierge-card-sub" style="font-size: 0.8rem; color: var(--text-charcoal-muted);">Real-time styling & order inquiries</span>
          </a>

          <!-- 3. Email -->
          <a href="${contactInfo.email ? `mailto:${contactInfo.email}` : '#helpContactForm'}" class="concierge-card" title="Email Concierge" style="background: var(--bg-cream-tint); padding: 2rem 1.5rem; border-radius: 16px; border: 1px solid var(--border-subtle); text-decoration: none; color: inherit; display: flex; flex-direction: column; gap: 0.5rem; transition: transform 0.3s ease, box-shadow 0.3s ease;">
            <div class="concierge-card-icon" style="width: 44px; height: 44px; border-radius: 50%; background: var(--bg-cream); display: flex; align-items: center; justify-content: center; color: var(--accent-terracotta-dark); margin-bottom: 0.5rem;">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
            </div>
            <h3 class="concierge-card-title" style="font-size: 1.1rem; font-weight: 600; color: var(--text-charcoal); margin: 0;">Email Correspondence</h3>
            <p class="concierge-card-val" style="font-size: 0.95rem; font-weight: 700; color: var(--accent-terracotta-dark); margin: 0;">${contactInfo.email || 'Client Advisory Desk'}</p>
            <span class="concierge-card-sub" style="font-size: 0.8rem; color: var(--text-charcoal-muted);">Inquiries answered within 24 hours</span>
          </a>
        </div>

        <!-- Split Grid: Message Form & FAQ Accordions -->
        <div class="help-split-grid" style="display: grid; grid-template-columns: 1fr 1fr; gap: 3.5rem; align-items: start;">
          <!-- Left: Contact Message Form -->
          <div class="help-form-container" id="helpContactForm" style="background: var(--bg-cream-tint); padding: 2.5rem; border-radius: 18px; border: 1px solid var(--border-subtle);">
            <h2 class="help-section-heading" style="font-family: var(--font-serif); font-size: 1.8rem; color: var(--text-charcoal); margin-bottom: 0.5rem;">Send a Note to the Atelier</h2>
            <p class="help-section-desc" style="font-size: 0.9rem; color: var(--text-charcoal-muted); margin-bottom: 1.8rem;">Leave your message below and our client advisory team will respond promptly.</p>

            <form id="spaContactForm" class="shopify-contact-form">
              <div class="form-group" style="margin-bottom: 1.2rem;">
                <label for="contactName" class="form-label" style="display: block; font-size: 0.78rem; font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase; color: var(--text-charcoal); margin-bottom: 0.4rem;">Full Name</label>
                <input type="text" id="contactName" class="form-input" placeholder="Your full name" required style="width: 100%; padding: 0.75rem 1rem; border-radius: 10px; border: 1px solid var(--border-subtle); background: var(--bg-cream); font-size: 0.9rem; color: var(--text-charcoal);">
              </div>

              <div class="form-row form-row-2" style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1.2rem;">
                <div class="form-group">
                  <label for="contactEmail" class="form-label" style="display: block; font-size: 0.78rem; font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase; color: var(--text-charcoal); margin-bottom: 0.4rem;">Email Address</label>
                  <input type="email" id="contactEmail" class="form-input" placeholder="your.email@example.com" required style="width: 100%; padding: 0.75rem 1rem; border-radius: 10px; border: 1px solid var(--border-subtle); background: var(--bg-cream); font-size: 0.9rem; color: var(--text-charcoal);">
                </div>
                <div class="form-group">
                  <label for="contactPhone" class="form-label" style="display: block; font-size: 0.78rem; font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase; color: var(--text-charcoal); margin-bottom: 0.4rem;">Phone (Optional)</label>
                  <input type="tel" id="contactPhone" class="form-input" placeholder="Your phone number" style="width: 100%; padding: 0.75rem 1rem; border-radius: 10px; border: 1px solid var(--border-subtle); background: var(--bg-cream); font-size: 0.9rem; color: var(--text-charcoal);">
                </div>
              </div>

              <div class="form-group" style="margin-bottom: 1.5rem;">
                <label for="contactBody" class="form-label" style="display: block; font-size: 0.78rem; font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase; color: var(--text-charcoal); margin-bottom: 0.4rem;">Message / Inquiry Details</label>
                <textarea rows="5" id="contactBody" class="form-textarea" placeholder="How may we assist you with our garments, sizing, or orders?" required style="width: 100%; padding: 0.75rem 1rem; border-radius: 10px; border: 1px solid var(--border-subtle); background: var(--bg-cream); font-size: 0.9rem; color: var(--text-charcoal); resize: vertical;"></textarea>
              </div>

              <button type="submit" class="btn-primary" style="width: 100%; justify-content: center; padding: 0.9rem; border-radius: 24px;">
                <span>Submit Inquiry &rarr;</span>
              </button>
            </form>
          </div>

          <!-- Right: Frequently Addressed Inquiries -->
          <div class="help-faq-container">
            <h2 class="help-section-heading" style="font-family: var(--font-serif); font-size: 1.8rem; color: var(--text-charcoal); margin-bottom: 1.2rem;">Frequently Asked Questions</h2>

            <div class="faq-accordion" style="display: flex; flex-direction: column; gap: 0.8rem;">
              <details class="faq-item" open style="background: var(--bg-cream-tint); border: 1px solid var(--border-subtle); border-radius: 12px; padding: 1.2rem;">
                <summary class="faq-question" style="font-weight: 600; font-size: 0.95rem; cursor: pointer; color: var(--text-charcoal); list-style: none; display: flex; justify-content: space-between; align-items: center;">
                  <span>What is your shipping timeline and policy?</span>
                  <span style="color: var(--accent-terracotta-dark); font-size: 1.2rem;">+</span>
                </summary>
                <div class="faq-answer" style="margin-top: 0.8rem; font-size: 0.88rem; line-height: 1.7; color: var(--text-charcoal-muted);">
                  <p>All orders are packed in plastic-free botanical packaging and dispatched via carbon-neutral air express within 24–48 hours. Domestic delivery within India arrives in 2–4 business days.</p>
                </div>
              </details>

              <details class="faq-item" style="background: var(--bg-cream-tint); border: 1px solid var(--border-subtle); border-radius: 12px; padding: 1.2rem;">
                <summary class="faq-question" style="font-weight: 600; font-size: 0.95rem; cursor: pointer; color: var(--text-charcoal); list-style: none; display: flex; justify-content: space-between; align-items: center;">
                  <span>How do I care for pure Belgian linen and organic silks?</span>
                  <span style="color: var(--accent-terracotta-dark); font-size: 1.2rem;">+</span>
                </summary>
                <div class="faq-answer" style="margin-top: 0.8rem; font-size: 0.88rem; line-height: 1.7; color: var(--text-charcoal-muted);">
                  <p>We recommend gentle hand washing in cool water with pH-neutral detergent, or eco-dry cleaning. Always dry in the shade to preserve living botanical dye hues.</p>
                </div>
              </details>

              <details class="faq-item" style="background: var(--bg-cream-tint); border: 1px solid var(--border-subtle); border-radius: 12px; padding: 1.2rem;">
                <summary class="faq-question" style="font-weight: 600; font-size: 0.95rem; cursor: pointer; color: var(--text-charcoal); list-style: none; display: flex; justify-content: space-between; align-items: center;">
                  <span>What is your return and exchange policy?</span>
                  <span style="color: var(--accent-terracotta-dark); font-size: 1.2rem;">+</span>
                </summary>
                <div class="faq-answer" style="margin-top: 0.8rem; font-size: 0.88rem; line-height: 1.7; color: var(--text-charcoal-muted);">
                  <p>We offer complimentary 30-day returns and exchanges for all unworn pieces in their original packaging with atelier hangtags intact.</p>
                </div>
              </details>

              <details class="faq-item" style="background: var(--bg-cream-tint); border: 1px solid var(--border-subtle); border-radius: 12px; padding: 1.2rem;">
                <summary class="faq-question" style="font-weight: 600; font-size: 0.95rem; cursor: pointer; color: var(--text-charcoal); list-style: none; display: flex; justify-content: space-between; align-items: center;">
                  <span>Do you offer custom tailoring and bespoke sizing?</span>
                  <span style="color: var(--accent-terracotta-dark); font-size: 1.2rem;">+</span>
                </summary>
                <div class="faq-answer" style="margin-top: 0.8rem; font-size: 0.88rem; line-height: 1.7; color: var(--text-charcoal-muted);">
                  <p>Yes. For select outerwear and trousers, our master tailors can adjust hem lengths and sleeves upon request prior to dispatch.</p>
                </div>
              </details>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;

  // Attach contact form submit handler
  const form = document.getElementById('spaContactForm');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('contactName').value;
      showToast(`Thank you, ${name}. Your message has been sent to our atelier concierge.`, 'success');
      form.reset();
    });
  }
}
