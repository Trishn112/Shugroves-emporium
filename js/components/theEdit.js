/**
 * Shugroves Emporium - The Edit: Pinterest-Inspired Visual Discovery
 * Editorial masonry grid with interactive "Shop the Look" product overlays.
 */

import { store } from '../store.js';

export const EDIT_CURATIONS = [
  {
    id: "edit-01",
    title: "The Autumn Layering Formula",
    category: "Styling Inspiration",
    aspectRatio: "tall",
    image: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&w=900&q=85",
    description: "Pairing fluid Belgian linen outerwear with structural leather accessories in tonal earthy hues.",
    linkedProductIds: ["shu-001", "shu-004"]
  },
  {
    id: "edit-02",
    title: "Tactile Sage & Raw Flax",
    category: "Material Focus",
    aspectRatio: "wide",
    image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=900&q=85",
    description: "The interplay of open-knit merino wool against double-pleated Belgian linen trousers.",
    linkedProductIds: ["shu-002", "shu-003"]
  },
  {
    id: "edit-03",
    title: "Vegetal Silk in Afternoon Sun",
    category: "Color Study",
    aspectRatio: "tall",
    image: "https://images.unsplash.com/photo-1509967419530-da38b4704bc6?auto=format&fit=crop&w=900&q=85",
    description: "Marigold-dyed Ahimsa peace silk reflecting warm amber light.",
    linkedProductIds: ["shu-005", "shu-008"]
  },
  {
    id: "edit-04",
    title: "Unstructured Everyday Carry",
    category: "Object Curation",
    aspectRatio: "square",
    image: "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=900&q=85",
    description: "Velvety olive-sage suede tote with artisan hand-finished details.",
    linkedProductIds: ["shu-006", "shu-007"]
  },
  {
    id: "edit-05",
    title: "Sculptural Brass & Warm Skin",
    category: "Jewellery Study",
    aspectRatio: "wide",
    image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=900&q=85",
    description: "Hand-hammered gold vermeil jewelry catching soft ambient shadows.",
    linkedProductIds: ["shu-008"]
  }
];

export function renderTheEdit(container) {
  container.innerHTML = `
    <div class="section-container">
      <!-- Editorial Section Header -->
      <div class="section-header">
        <div class="section-header-left">
          <span class="section-eyebrow">Visual Discovery</span>
          <h2 class="section-heading">The Edit</h2>
        </div>
        <div class="section-header-right">
          <p class="section-subtitle">Visual outfit studies, tonal harmonies & curated seasonal styling.</p>
        </div>
      </div>

      <!-- Masonry Editorial Grid -->
      <div class="edit-masonry-grid">
        ${EDIT_CURATIONS.map(curation => `
          <div class="edit-card edit-card-${curation.aspectRatio}" data-edit-id="${curation.id}">
            <div class="edit-card-inner">
              <img 
                src="${curation.image}" 
                alt="${curation.title}" 
                class="edit-card-img" 
                loading="lazy"
              >
              <div class="edit-card-overlay">
                <span class="edit-card-category">${curation.category}</span>
                <h3 class="edit-card-title">${curation.title}</h3>
                <a href="#collections" class="btn-shop-look" style="text-decoration:none;">
                  <span>Explore Curation</span>
                  <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2">
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                    <polyline points="12 5 19 12 12 19"></polyline>
                  </svg>
                </a>
              </div>
            </div>
          </div>
        `).join('')}
      </div>
    </div>

    <!-- Shop The Look Modal / Drawer -->
    <div class="shop-look-modal" id="shopLookModal">
      <div class="shop-look-backdrop" id="shopLookBackdrop"></div>
      <div class="shop-look-sheet">
        <div class="shop-look-header">
          <div>
            <span class="shop-look-eyebrow" id="shopLookEyebrow">Curation</span>
            <h3 class="shop-look-title" id="shopLookTitle">Featured In This Look</h3>
          </div>
          <button class="shop-look-close" id="shopLookClose" aria-label="Close">&times;</button>
        </div>
        <div class="shop-look-products-list" id="shopLookProducts">
          <!-- Populated dynamically -->
        </div>
      </div>
    </div>
  `;

  attachTheEditListeners(container);
}

function attachTheEditListeners(container) {
  const modal = document.getElementById('shopLookModal');
  const backdrop = document.getElementById('shopLookBackdrop');
  const closeBtn = document.getElementById('shopLookClose');
  const productsContainer = document.getElementById('shopLookProducts');
  const titleEl = document.getElementById('shopLookTitle');
  const eyebrowEl = document.getElementById('shopLookEyebrow');

  const closeModal = () => {
    if (modal) modal.classList.remove('modal-open');
    document.body.classList.remove('scroll-locked');
  };

  if (backdrop) backdrop.addEventListener('click', closeModal);
  if (closeBtn) closeBtn.addEventListener('click', closeModal);

  const shopLookBtns = container.querySelectorAll('.btn-shop-look');
  shopLookBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const curationId = btn.getAttribute('data-curation-id');
      const curation = EDIT_CURATIONS.find(c => c.id === curationId);

      if (curation && modal && productsContainer) {
        titleEl.textContent = curation.title;
        eyebrowEl.textContent = curation.category;

        const linkedProducts = curation.linkedProductIds.map(id => store.getProductById(id)).filter(Boolean);

        productsContainer.innerHTML = linkedProducts.map(product => `
          <div class="shop-look-item">
            <a href="#product/${product.slug}" class="shop-look-item-img-link">
              <img src="${product.thumbnail || product.images[0]}" alt="${product.name}">
            </a>
            <div class="shop-look-item-info">
              <span class="shop-look-item-material">${product.material}</span>
              <h4 class="shop-look-item-name">
                <a href="#product/${product.slug}">${product.name}</a>
              </h4>
              <p class="shop-look-item-price">₹${(product.salePrice || product.price).toLocaleString('en-IN')}</p>
              <a href="#product/${product.slug}" class="btn-look-view">View Garment &rarr;</a>
            </div>
          </div>
        `).join('');

        modal.classList.add('modal-open');
        document.body.classList.add('scroll-locked');
      }
    });
  });
}
