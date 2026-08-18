/**
 * Shugroves Emporium - About Us Page View
 * High-end editorial storytelling about the atelier, craft philosophy, botanical dyes,
 * sustainable slow fashion, client dedication, and clickable social media links.
 */

import { BRAND_CONFIG } from '../config.js';

export function renderAboutView(container) {
  const { socialLinks, contactInfo } = BRAND_CONFIG;

  container.innerHTML = `
    <div class="editorial-page-container">
      <!-- About Us Editorial Hero Header -->
      <header class="about-hero-header">
        <span class="about-eyebrow">The Atelier & Legacy</span>
        <h1 class="about-hero-title">Shugroves Emporium</h1>
        <p class="about-hero-lead">
          A sanctuary of conscious slow fashion, rooted in unbleached Belgian flax, botanical vegetable dyes, and timeless tailored silhouettes.
        </p>
      </header>

      <!-- Editorial Image Showcase -->
      <div class="about-visual-spread">
        <div class="about-image-card image-card-main">
          <img 
            src="https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&w=1200&q=85" 
            alt="Shugroves Atelier Autumn Editorial"
            loading="lazy"
          >
          <span class="about-image-caption">Autumn / Winter Atelier Study • Hand-loomed raw linen</span>
        </div>
      </div>

      <!-- Core Brand Narrative Grid -->
      <div class="about-narrative-grid">
        <!-- Story Column -->
        <div class="about-story-col">
          <span class="section-eyebrow">Who We Are</span>
          <h2 class="about-section-heading">Formed by Nature, Tailored for Life</h2>
          
          <div class="about-body-text">
            <p>
              Founded on the belief that clothing should be a tactile, living extension of natural beauty, <strong>Shugroves Emporium</strong> creates heirloom-quality garments designed to mature gracefully over decades rather than fleeting seasons.
            </p>
            <p>
              We reject the rapid churn of synthetic mass production. Every piece in our collection is conscientiously developed in small, numbered atelier batches using only pure, biodegradable fibers — certified Belgian linen, Ahimsa peace silk, and ultra-fine organic Merino wool.
            </p>
            
            <blockquote class="about-pullquote">
              &ldquo;True luxury is not defined by excess, but by the quiet patience of human hands and the reverence for unadorned raw textiles.&rdquo;
            </blockquote>

            <p>
              Our signature color palette — warm earthen ochre, dusty madder terracotta, and muted wild sage — is derived exclusively from botanical extracts and mineral earth pigments. These natural dyes interact gently with sunlight, breathing life and unique patina into every warp and weft.
            </p>
          </div>
        </div>

        <!-- Values & Customer Focus Sidebar -->
        <div class="about-values-col">
          <div class="about-value-card">
            <span class="value-number">01</span>
            <h3 class="value-title">Artisanal Integrity</h3>
            <p class="value-desc">Every seam is French-finished, every horn button hand-carved, and every textile pre-washed with rainwater to ensure unmatched durability.</p>
          </div>

          <div class="about-value-card">
            <span class="value-number">02</span>
            <h3 class="value-title">Zero Synthetic Waste</h3>
            <p class="value-desc">We use zero polyester or nylon blends. All packaging is 100% post-consumer recycled paper and plastic-free plant starch.</p>
          </div>

          <div class="about-value-card">
            <span class="value-number">03</span>
            <h3 class="value-title">Dedicated Client Concierge</h3>
            <p class="value-desc">Personalized fit consultations, complimentary garment repairs, and white-glove client support on every bespoke and ready-to-wear piece.</p>
          </div>
        </div>
      </div>

      <!-- Social Media & Community Connection Section -->
      <div class="about-social-section">
        <div class="about-social-inner">
          <span class="social-section-eyebrow">Connect With Our Atelier</span>
          <h3 class="social-section-heading">Follow The Visual Journey</h3>
          <p class="social-section-desc">
            Explore behind-the-scenes dye vats, seasonal lookbook previews, and textile studies across our official channels.
          </p>

          <div class="about-social-links">
            <!-- Instagram Link -->
            <a 
              href="${socialLinks.instagram}" 
              target="_blank" 
              rel="noopener noreferrer" 
              class="about-social-btn" 
              aria-label="Follow Shugroves Emporium on Instagram"
              title="Instagram"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
              </svg>
              <span>Instagram</span>
            </a>

            <!-- Facebook Link -->
            <a 
              href="${socialLinks.facebook}" 
              target="_blank" 
              rel="noopener noreferrer" 
              class="about-social-btn" 
              aria-label="Follow Shugroves Emporium on Facebook"
              title="Facebook"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
              </svg>
              <span>Facebook</span>
            </a>

            <!-- Twitter / X Link -->
            <a 
              href="${socialLinks.twitter}" 
              target="_blank" 
              rel="noopener noreferrer" 
              class="about-social-btn" 
              aria-label="Follow Shugroves Emporium on Twitter / X"
              title="Twitter / X"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path>
              </svg>
              <span>Twitter / X</span>
            </a>
          </div>
        </div>
      </div>

      <!-- Atelier Contact Quick Bar -->
      <div class="about-contact-strip">
        <div class="contact-strip-col">
          <span class="contact-strip-label">Atelier Flagship</span>
          <p class="contact-strip-val">${contactInfo.atelierAddress}</p>
        </div>
        <div class="contact-strip-col">
          <span class="contact-strip-label">Client Concierge</span>
          <p class="contact-strip-val"><a href="mailto:${contactInfo.email}">${contactInfo.email}</a></p>
        </div>
        <div class="contact-strip-col">
          <span class="contact-strip-label">Direct Line</span>
          <p class="contact-strip-val"><a href="tel:${contactInfo.phoneTel}">${contactInfo.phone}</a></p>
        </div>
      </div>
    </div>
  `;
}
