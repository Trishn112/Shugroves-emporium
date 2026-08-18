/**
 * Shugroves Emporium - Luxury Fashion Platform Bootstrap
 * Connects Router, State Store, and Modular Views (Collections, Popular, Offers, About Us, Help, etc.)
 */

import { store } from './js/store.js';
import { Router } from './js/router.js';
import { renderHeader } from './js/components/header.js';
import { renderHero } from './js/components/hero.js';
import { renderTrending } from './js/components/trending.js';
import { renderTheEdit } from './js/components/theEdit.js';
import { renderCollections } from './js/components/collections.js';
import { renderProductDetail } from './js/components/productDetail.js';
import { renderCartDrawer } from './js/components/cartDrawer.js';
import { renderSearchOverlay } from './js/components/searchOverlay.js';
import { renderLookbookView } from './js/components/lookbookView.js';
import { renderJournalListing, renderJournalArticle } from './js/components/journalView.js';
import { renderCheckoutView } from './js/components/checkoutModal.js';
import { renderAccountView } from './js/components/accountModal.js';
import { renderAdminDashboard } from './js/components/adminDashboard.js';
import { renderWishlistView } from './js/components/wishlistModal.js';
import { renderOffersView } from './js/components/offersView.js';
import { renderAboutView } from './js/components/aboutView.js';
import { renderHelpView } from './js/components/helpView.js';
import { renderAuthModal } from './js/components/authModal.js';

export function initApp() {
  if (typeof document === 'undefined') return;

  const headerEl = document.getElementById('siteHeader');
  const cartDrawerEl = document.getElementById('cartDrawer');
  const searchOverlayEl = document.getElementById('searchOverlay');
  const authModalEl = document.getElementById('authModal');
  const appMain = document.getElementById('appMain');
  const replayBtn = document.getElementById('replayBtn');

  // 1. Mount Persistent Global Chrome
  if (headerEl) renderHeader(headerEl);
  if (cartDrawerEl) renderCartDrawer(cartDrawerEl);
  if (searchOverlayEl) renderSearchOverlay(searchOverlayEl);
  if (authModalEl) renderAuthModal(authModalEl);

  // 2. Initialize Router & Route Handlers
  const router = new Router({
    'home': () => {
      if (replayBtn) replayBtn.style.display = 'flex';
      appMain.innerHTML = `
        <!-- Editorial Hero Section -->
        <div class="hero-container" id="heroSection"></div>

        <!-- Trending Now Showcase -->
        <section class="section-wrapper trending-wrapper" id="trendingSection"></section>

        <!-- The Edit: Visual Discovery Grid -->
        <section class="section-wrapper edit-wrapper" id="theEditSection"></section>

        <!-- Editorial Quote Banner -->
        <section class="quote-banner-section">
          <div class="quote-banner-inner">
            <span class="quote-eyebrow">Conscious Philosophy</span>
            <blockquote class="editorial-banner-quote">
              &ldquo;Formed by natural flax, tempered by slow vegetal dyes, tailored for perpetual ease.&rdquo;
            </blockquote>
            <span class="quote-author">Shugroves Atelier • Est. 2026</span>
          </div>
        </section>

        <!-- Footer -->
        <footer class="site-footer" id="siteFooter"></footer>
      `;

      // Mount Sub-components
      const heroSec = document.getElementById('heroSection');
      const trendingSec = document.getElementById('trendingSection');
      const theEditSec = document.getElementById('theEditSection');
      const footerSec = document.getElementById('siteFooter');

      if (heroSec) renderHero(heroSec);
      if (trendingSec) renderTrending(trendingSec);
      if (theEditSec) renderTheEdit(theEditSec);
      if (footerSec) renderFooter(footerSec);
    },

    'collections': (params) => {
      if (replayBtn) replayBtn.style.display = 'none';
      renderCollections(appMain, params);
    },

    'popular': () => {
      if (replayBtn) replayBtn.style.display = 'none';
      renderCollections(appMain, { sort: 'bestseller' });
    },

    'offers': (params) => {
      if (replayBtn) replayBtn.style.display = 'none';
      renderOffersView(appMain, params);
    },

    'about': () => {
      if (replayBtn) replayBtn.style.display = 'none';
      renderAboutView(appMain);
    },

    'help': () => {
      if (replayBtn) replayBtn.style.display = 'none';
      renderHelpView(appMain);
    },

    'product': (params) => {
      if (replayBtn) replayBtn.style.display = 'none';
      renderProductDetail(appMain, params.slug);
    },

    'lookbook': () => {
      if (replayBtn) replayBtn.style.display = 'none';
      renderLookbookView(appMain);
    },

    'journal': () => {
      if (replayBtn) replayBtn.style.display = 'none';
      renderJournalListing(appMain);
    },

    'journal-article': (params) => {
      if (replayBtn) replayBtn.style.display = 'none';
      renderJournalArticle(appMain, params.slug);
    },

    'account': (params) => {
      if (replayBtn) replayBtn.style.display = 'none';
      renderAccountView(appMain, params);
    },

    'admin': (params) => {
      if (replayBtn) replayBtn.style.display = 'none';
      renderAdminDashboard(appMain, params);
    },

    'wishlist': () => {
      if (replayBtn) replayBtn.style.display = 'none';
      renderWishlistView(appMain);
    },

    'checkout': () => {
      if (replayBtn) replayBtn.style.display = 'none';
      renderCheckoutView(appMain);
    }
  });

  // Replay entrance sequence button handler
  if (replayBtn) {
    replayBtn.addEventListener('click', () => {
      const animatedElements = document.querySelectorAll(
        '.brand-container, .brand-swash-box path, .nav-links, .nav-actions, .hero-content, .blob-sage, .blob-mustard, .blob-terracotta, .blob-ring, .frame-model-left, .frame-model-center, .frame-model-accent, .deco-dots-grid, .floating-card-tag'
      );
      
      animatedElements.forEach(el => {
        el.style.animation = 'none';
        el.offsetHeight; // trigger reflow
        el.style.animation = '';
      });
    });
  }

  // Start routing
  router.start();
}

function renderFooter(container) {
  container.innerHTML = `
    <div class="footer-container">
      <div class="footer-grid">
        <!-- Brand Col -->
        <div class="footer-brand-col">
          <span class="footer-brand-title">Shugroves Emporium</span>
          <p class="footer-brand-bio">
            An artisanal clothing and objects atelier dedicated to unbleached Belgian linen, vegetal extraction dyeing, and timeless everyday ease.
          </p>
          <div class="footer-eco-badge">
            <span>Slow Crafted • Zero Synthetic Blends</span>
          </div>
        </div>

        <!-- Navigation Col 1 -->
        <div class="footer-links-col">
          <h4 class="footer-heading">Collections</h4>
          <ul class="footer-links">
            <li><a href="#collections?category=clothing">Clothing & Outerwear</a></li>
            <li><a href="#collections?category=knitwear">Artisanal Knitwear</a></li>
            <li><a href="#collections?category=bags">Leather & Objects</a></li>
            <li><a href="#collections?category=accessories">Sculptural Jewellery</a></li>
            <li><a href="#offers">Seasonal Offers</a></li>
          </ul>
        </div>

        <!-- Navigation Col 2 -->
        <div class="footer-links-col">
          <h4 class="footer-heading">Atelier & Care</h4>
          <ul class="footer-links">
            <li><a href="#about">About Our Atelier</a></li>
            <li><a href="#lookbook">Seasonal Lookbook</a></li>
            <li><a href="#journal">Editorial Journal</a></li>
            <li><a href="#help">Help & Contact</a></li>
          </ul>
        </div>

        <!-- Newsletter Col -->
        <div class="footer-newsletter-col">
          <h4 class="footer-heading">Private Ledger</h4>
          <p class="footer-news-text">Receive private seasonal release previews and invitations to limited numbered dye drops.</p>
          <form class="footer-newsletter-form" onsubmit="event.preventDefault(); alert('Thank you for joining the Private Ledger.');">
            <input type="email" placeholder="Your email address" required class="footer-input">
            <button type="submit" class="footer-submit-btn">&rarr;</button>
          </form>
        </div>
      </div>

      <div class="footer-bottom-row">
        <span class="footer-copy">&copy; 2026 Shugroves Emporium. All rights reserved. Handcrafted slow fashion.</span>
        <div class="footer-legal-links">
          <a href="#help">Privacy Policy</a>
          <span>•</span>
          <a href="#help">Terms of Atelier</a>
          <span>•</span>
          <a href="#help">Carbon Neutral Dispatches</a>
        </div>
      </div>
    </div>
  `;
}

// Auto-initialize when loaded as module in browser
if (typeof window !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
  } else {
    initApp();
  }
}
