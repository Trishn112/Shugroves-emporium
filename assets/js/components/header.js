/**
 * Shugroves Emporium - Luxury Header & Dynamic Navigation System
 * Top Navigation: COLLECTIONS (Dynamic Shopify with Live Search) | POPULAR | OFFERS | ABOUT US | HELP
 * Connects directly to Shopify collections, popular best-sellers, active offers, and real contact support actions.
 */

import { store } from '../store.js';
import { BRAND_CONFIG } from '../config.js';
import { firebaseAuth } from '../firebase.js';
import { showToast } from './toast.js';

export function renderHeader(container) {
  const cartTotals = store.getCartTotals();
  const wishlistCount = store.wishlist.length;
  const user = store.user;
  const { contactInfo } = BRAND_CONFIG;
  const allCollections = store.getCollections();

  container.innerHTML = `
    <!-- Brand Logo (Glides smoothly into navbar position) -->
    <a href="#home" class="brand-container" id="brandElement" title="Shugroves Emporium Home">
      <span class="brand-title">Shugroves Emporium</span>
      <div class="brand-swash-box">
        <svg viewBox="0 0 300 12" preserveAspectRatio="none">
          <path d="M 4,6 Q 150,-2 296,6" />
        </svg>
      </div>
    </a>

    <!-- Center Navigation Links (Desktop) -->
    <nav class="main-nav" aria-label="Main Navigation">
      <ul class="nav-links">
        <!-- 1. COLLECTIONS (Dynamic Shopify Collections with Live Search) -->
        <li class="nav-dropdown-parent">
          <a href="#collections" class="nav-item-link">Collections</a>
          <div class="nav-megamenu">
            <!-- Inline Search Collections Input -->
            <div class="megamenu-search-wrap">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
              <input 
                type="text" 
                class="megamenu-search-input" 
                id="collectionsSearchInput" 
                placeholder="Search Collections..." 
                autocomplete="off"
              >
            </div>

            <div class="megamenu-grid">
              <!-- Column 1: Dynamic Shopify Collections List -->
              <div class="megamenu-col" id="colListCol1">
                <span class="megamenu-heading">Apparel & Tailoring</span>
                <div class="megamenu-links-dynamic" id="dynColList1">
                  ${renderCollectionsLinks(allCollections.slice(0, 6))}
                </div>
              </div>

              <!-- Column 2: Objects & Curations -->
              <div class="megamenu-col" id="colListCol2">
                <span class="megamenu-heading">Objects & Archive</span>
                <div class="megamenu-links-dynamic" id="dynColList2">
                  ${renderCollectionsLinks(allCollections.slice(6))}
                </div>
                <a href="#collections" class="megamenu-view-all">View All Collections &rarr;</a>
              </div>

              <!-- Column 3: Featured Editorial Card -->
              <div class="megamenu-col megamenu-featured-card-col">
                <a href="#lookbook" class="megamenu-card-preview">
                  <div class="megamenu-card-img-wrap">
                    <img src="https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&w=600&q=85" alt="Autumn / Winter '26 Lookbook">
                    <div class="megamenu-card-overlay">
                      <span class="megamenu-card-badge">Seasonal Curation</span>
                      <h4 class="megamenu-card-title">Autumn / Winter '26</h4>
                      <span class="megamenu-card-link">Explore Lookbook &rarr;</span>
                    </div>
                  </div>
                </a>
              </div>
            </div>
          </div>
        </li>

        <!-- 2. POPULAR -->
        <li><a href="#collections?sort=bestseller" class="nav-item-link">Popular</a></li>

        <!-- 3. LOOKBOOK -->
        <li><a href="#lookbook" class="nav-item-link">Lookbook</a></li>

        <!-- 4. ABOUT US -->
        <li><a href="#about" class="nav-item-link">About Us</a></li>

        <!-- 5. HELP (With Full Page Access & Contact Cards) -->
        <li class="nav-dropdown-parent">
          <a href="#help" class="nav-item-link">Help</a>
          <div class="nav-dropdown-menu nav-help-dropdown">
            <div class="dropdown-header-tag">Atelier Client Concierge</div>
            
            <div class="dropdown-contacts-list">
              <!-- Phone -->
              <a href="tel:${contactInfo.phoneTel}" class="dropdown-contact-card" title="Call Atelier">
                <div class="contact-card-icon">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                  </svg>
                </div>
                <div class="contact-card-text">
                  <span class="contact-card-lbl">Telephone Inquiries</span>
                  <span class="contact-card-val">${contactInfo.phone}</span>
                </div>
              </a>

              <!-- WhatsApp -->
              <a href="${contactInfo.whatsappUrl}" target="_blank" rel="noopener noreferrer" class="dropdown-contact-card" title="Chat on WhatsApp">
                <div class="contact-card-icon contact-icon-whatsapp">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
                  </svg>
                </div>
                <div class="contact-card-text">
                  <span class="contact-card-lbl">WhatsApp Concierge</span>
                  <span class="contact-card-val">Live Instant Chat &rarr;</span>
                </div>
              </a>

              <!-- Email -->
              <a href="mailto:${contactInfo.email}" class="dropdown-contact-card" title="Email Concierge">
                <div class="contact-card-icon">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                    <polyline points="22,6 12,13 2,6"></polyline>
                  </svg>
                </div>
                <div class="contact-card-text">
                  <span class="contact-card-lbl">Email Atelier</span>
                  <span class="contact-card-val">${contactInfo.email}</span>
                </div>
              </a>
            </div>

            <div class="dropdown-divider"></div>
            <a href="#help" class="dropdown-link-item">
              <span>Shipping, Sizing & 30-Day Returns</span>
            </a>
            <a href="#help" class="dropdown-link-item dropdown-contact-item">
              <span>Open Full Help Center &rarr;</span>
            </a>
          </div>
        </li>
      </ul>
    </nav>

    <!-- Right Actions -->
    <div class="nav-actions">
      <!-- Search Trigger -->
      <button class="nav-action-btn" id="openSearchBtn" aria-label="Search Catalog" title="Search">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="11" cy="11" r="8"></circle>
          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
        </svg>
      </button>

      <!-- User / Account Dropdown Trigger (Firebase Auth Connected) -->
      <div class="nav-action-dropdown-parent">
        <button class="nav-action-btn ${user.isLoggedIn ? 'user-authenticated' : ''}" id="openAccountBtn" aria-label="${user.isLoggedIn ? user.name : 'Sign In'}" title="${user.isLoggedIn ? user.name : 'Sign In / Register'}">
          ${user.isLoggedIn && user.photoURL ? `
            <img src="${user.photoURL}" alt="${user.name}" class="nav-user-avatar">
          ` : `
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
          `}
        </button>

        <!-- Account / Sign-In Dropdown Menu -->
        <div class="nav-dropdown-menu nav-account-dropdown">
          ${user.isLoggedIn ? `
            <div class="dropdown-user-header">
              <span class="user-greeting">Client Ledger</span>
              <strong class="user-name-display">${user.name}</strong>
              <small class="user-email-display">${user.email}</small>
            </div>
            <div class="dropdown-divider"></div>
            <a href="#account?tab=orders" class="dropdown-link-item">
              <span>Orders & Live Tracking</span>
            </a>
            <a href="#account?tab=profile" class="dropdown-link-item">
              <span>Personal Information</span>
            </a>
            <a href="#account?tab=addresses" class="dropdown-link-item">
              <span>Saved Addresses</span>
            </a>
            <a href="#wishlist" class="dropdown-link-item">
              <span>Saved Wishlist</span>
              <span class="dropdown-badge-mini" id="dropdownWishlistCount">${wishlistCount}</span>
            </a>
            <div class="dropdown-divider"></div>
            <button class="dropdown-signout-btn" id="btnSignOutNav">
              <span>Sign Out</span>
            </button>
          ` : `
            <div class="dropdown-user-header">
              <span class="user-greeting">Client Portal</span>
              <strong class="user-name-display">Private Atelier Access</strong>
            </div>
            <div class="dropdown-divider"></div>
            <button class="btn-primary dropdown-auth-btn" id="dropdownSignInBtn">
              <span>Sign In / Create Account &rarr;</span>
            </button>
            <button class="btn-google-auth-mini" id="dropdownGoogleBtn">
              <svg width="15" height="15" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
              </svg>
              <span>Continue with Google</span>
            </button>
          `}
        </div>
      </div>

      <!-- Wishlist Trigger -->
      <a href="#wishlist" class="nav-action-btn nav-wishlist-btn" id="openWishlistBtn" aria-label="Wishlist" title="Wishlist">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
        </svg>
        <span class="nav-badge ${wishlistCount > 0 ? 'badge-visible' : ''}" id="wishlistCountBadge">${wishlistCount}</span>
      </a>

      <!-- Bag / Cart Trigger -->
      <button class="nav-cart-pill" id="openCartBtn" aria-label="Shopping Bag">
        <span>Bag</span>
        <span class="nav-cart-count" id="cartCountBadge">${cartTotals.itemCount}</span>
      </button>

      <!-- Mobile Hamburger Trigger -->
      <button class="nav-mobile-toggle" id="mobileMenuToggle" aria-label="Toggle Navigation Menu">
        <span class="hamburger-line"></span>
        <span class="hamburger-line"></span>
      </button>
    </div>

    <!-- Mobile Slide-out Drawer Navigation -->
    <div class="mobile-drawer" id="mobileDrawer">
      <div class="mobile-drawer-inner">
        <div class="mobile-drawer-header">
          <span class="mobile-drawer-brand">Shugroves</span>
          <button class="mobile-drawer-close" id="mobileDrawerClose" aria-label="Close Menu">&times;</button>
        </div>

        <nav class="mobile-nav-list">
          <!-- Collections -->
          <div class="mobile-nav-section">
            <span class="mobile-section-label">Collections</span>
            <a href="#collections" class="mobile-nav-link">All Collections</a>
            ${allCollections.slice(0, 5).map(c => `
              <a href="#collections?category=${c.handle}" class="mobile-nav-link">${c.title}</a>
            `).join('')}
          </div>

          <!-- Popular & Offers -->
          <div class="mobile-nav-section">
            <span class="mobile-section-label">Curations & Deals</span>
            <a href="#collections?sort=bestseller" class="mobile-nav-link">Popular Pieces</a>
            <a href="#offers" class="mobile-nav-link">Seasonal Offers & Sale</a>
          </div>

          <!-- About Us & Help -->
          <div class="mobile-nav-section">
            <span class="mobile-section-label">Atelier & Care</span>
            <a href="#about" class="mobile-nav-link">About Us & Atelier Story</a>
            <a href="#help" class="mobile-nav-link">Help & Customer Support</a>
            <a href="tel:${contactInfo.phoneTel}" class="mobile-nav-link">Call: ${contactInfo.phone}</a>
            <a href="${contactInfo.whatsappUrl}" target="_blank" class="mobile-nav-link">WhatsApp: ${contactInfo.whatsapp}</a>
          </div>

          <!-- Client Portal -->
          <div class="mobile-nav-section">
            <span class="mobile-section-label">Client Portal</span>
            <a href="#account?tab=orders" class="mobile-nav-link">My Orders & Tracking</a>
            <a href="#account?tab=profile" class="mobile-nav-link">Personal Details</a>
            <a href="#wishlist" class="mobile-nav-link">Saved Wishlist (${wishlistCount})</a>
          </div>
        </nav>

        <div class="mobile-drawer-footer">
          <p>Handcrafted Slow Fashion • Est. 2026</p>
        </div>
      </div>
    </div>
  `;

  // Attach Event Listeners
  attachHeaderListeners(container);

  // Subscribe to store updates
  store.subscribe(() => {
    const totals = store.getCartTotals();
    const cartBadge = document.getElementById('cartCountBadge');
    if (cartBadge) cartBadge.textContent = totals.itemCount;

    const wishBadge = document.getElementById('wishlistCountBadge');
    if (wishBadge) {
      wishBadge.textContent = store.wishlist.length;
      wishBadge.classList.toggle('badge-visible', store.wishlist.length > 0);
    }

    const dropWishCount = document.getElementById('dropdownWishlistCount');
    if (dropWishCount) dropWishCount.textContent = store.wishlist.length;
  });
}

function renderCollectionsLinks(collectionsList) {
  if (!collectionsList || collectionsList.length === 0) {
    return `<span class="empty-col-hint" style="font-size:0.8rem; color:var(--text-charcoal-muted); padding:0.4rem 0;">No matching collections</span>`;
  }
  return collectionsList.map(c => `
    <a href="#collections?category=${c.handle}">${c.title}</a>
  `).join('');
}

function attachHeaderListeners(container) {
  const mobileToggle = document.getElementById('mobileMenuToggle');
  const mobileDrawer = document.getElementById('mobileDrawer');
  const mobileClose = document.getElementById('mobileDrawerClose');

  if (mobileToggle && mobileDrawer) {
    mobileToggle.addEventListener('click', () => {
      mobileDrawer.classList.add('drawer-open');
      document.body.classList.add('scroll-locked');
    });
  }

  if (mobileClose && mobileDrawer) {
    mobileClose.addEventListener('click', () => {
      mobileDrawer.classList.remove('drawer-open');
      document.body.classList.remove('scroll-locked');
    });
  }

  // Close drawer on link click
  const drawerLinks = document.querySelectorAll('.mobile-nav-link');
  drawerLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (mobileDrawer) mobileDrawer.classList.remove('drawer-open');
      document.body.classList.remove('scroll-locked');
    });
  });

  // Account / Auth Modal Trigger Function
  const openAuthModal = () => {
    const authModal = document.getElementById('authModal');
    if (authModal) {
      authModal.classList.add('modal-open');
      document.body.classList.add('scroll-locked');
    }
  };

  const accountBtn = document.getElementById('openAccountBtn');
  if (accountBtn) {
    accountBtn.addEventListener('click', (e) => {
      if (!store.user.isLoggedIn) {
        e.preventDefault();
        openAuthModal();
      } else {
        window.location.hash = '#account';
      }
    });
  }

  const dropdownSignInBtn = document.getElementById('dropdownSignInBtn');
  if (dropdownSignInBtn) {
    dropdownSignInBtn.addEventListener('click', () => {
      openAuthModal();
    });
  }

  const dropdownGoogleBtn = document.getElementById('dropdownGoogleBtn');
  if (dropdownGoogleBtn) {
    dropdownGoogleBtn.addEventListener('click', async () => {
      showToast("Connecting to Google...", 'info');
      const res = await firebaseAuth.signInWithGoogle();
      if (res.success) {
        store.setUser(res.user);
        showToast(res.message, 'success');
        if (container) renderHeader(container);
      } else {
        showToast(res.message, 'error');
      }
    });
  }

  const signOutBtn = document.getElementById('btnSignOutNav');
  if (signOutBtn) {
    signOutBtn.addEventListener('click', async () => {
      await firebaseAuth.signOutUser();
      store.logout();
      showToast("Signed out of client session.", 'info');
      if (container) renderHeader(container);
    });
  }

  // Collections Search Input Live Filtering
  const colSearchInput = document.getElementById('collectionsSearchInput');
  if (colSearchInput) {
    colSearchInput.addEventListener('input', (e) => {
      const q = e.target.value;
      const matched = store.getCollections(q);
      const half = Math.ceil(matched.length / 2);
      const list1 = matched.slice(0, half);
      const list2 = matched.slice(half);

      const el1 = document.getElementById('dynColList1');
      const el2 = document.getElementById('dynColList2');
      if (el1) el1.innerHTML = renderCollectionsLinks(list1);
      if (el2) el2.innerHTML = renderCollectionsLinks(list2);
    });
  }

  // Cart Drawer Trigger
  const cartBtn = document.getElementById('openCartBtn');
  if (cartBtn) {
    cartBtn.addEventListener('click', () => {
      const cartDrawer = document.getElementById('cartDrawer');
      if (cartDrawer) {
        cartDrawer.classList.add('drawer-open');
        document.body.classList.add('scroll-locked');
      }
    });
  }

  // Search Trigger
  const searchBtn = document.getElementById('openSearchBtn');
  if (searchBtn) {
    searchBtn.addEventListener('click', () => {
      const searchOverlay = document.getElementById('searchOverlay');
      if (searchOverlay) {
        searchOverlay.classList.add('search-open');
        document.body.classList.add('scroll-locked');
        setTimeout(() => {
          const input = searchOverlay.querySelector('.search-input-field');
          if (input) input.focus();
        }, 150);
      }
    });
  }

  // Scroll state for fixed luxury header
  const siteHeaderEl = document.getElementById('siteHeader');
  if (siteHeaderEl && typeof window !== 'undefined') {
    window.addEventListener('scroll', () => {
      const isScrolled = window.scrollY > 20;
      siteHeaderEl.classList.toggle('header-scrolled', isScrolled);
    }, { passive: true });
  }
}
