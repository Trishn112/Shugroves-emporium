/**
 * Shugroves Emporium - Seasonal Lookbook View
 * Immersive editorial magazine spread with Look 01-03 breakdown and "Shop the Look" integration.
 */

import { store } from '../store.js';

export function renderLookbookView(container) {
  const looks = store.lookbook;

  container.innerHTML = `
    <div class="lookbook-page">
      <!-- Lookbook Cover Header -->
      <header class="lookbook-header">
        <div class="lookbook-header-inner">
          <span class="lookbook-season">Autumn / Winter '26 Lookbook</span>
          <h1 class="lookbook-title">The Natural Form</h1>
          <p class="lookbook-intro">
            A study in architectural volume, raw Belgian flax, vegetal earth dyes, and the quiet dignity of slow tailoring.
          </p>
        </div>
      </header>

      <!-- Lookbook Sections -->
      <div class="lookbook-spreads-container">
        ${looks.map((look, idx) => {
          const products = look.productIds.map(id => store.getProductById(id)).filter(Boolean);

          return `
            <article class="lookbook-spread ${idx % 2 === 1 ? 'spread-reversed' : ''}" id="${look.id}">
              <!-- Spread Visuals -->
              <div class="spread-visuals">
                <div class="spread-hero-img-wrap">
                  <img src="${look.heroImage}" alt="${look.name} Hero Look" class="spread-hero-img">
                  <span class="spread-badge">Look ${look.lookNumber}</span>
                </div>
                ${look.detailImages.length > 0 ? `
                  <div class="spread-details-grid">
                    ${look.detailImages.map(img => `
                      <div class="spread-detail-img-wrap">
                        <img src="${img}" alt="${look.name} detail view" class="spread-detail-img">
                      </div>
                    `).join('')}
                  </div>
                ` : ''}
              </div>

              <!-- Spread Story & Product Links -->
              <div class="spread-story">
                <div class="spread-story-inner">
                  <span class="spread-eyebrow">${look.season} • Look ${look.lookNumber}</span>
                  <h2 class="spread-heading">${look.name}</h2>
                  <h3 class="spread-subtitle">${look.subtitle}</h3>

                  <blockquote class="spread-quote">
                    &ldquo;${look.quote}&rdquo;
                  </blockquote>

                  <p class="spread-description">${look.description}</p>

                  <!-- Linked Products in this Look -->
                  <div class="spread-products-box">
                    <span class="spread-box-label">Garments in this Look:</span>
                    <div class="spread-products-list">
                      ${products.map(p => `
                        <div class="spread-product-row">
                          <a href="#product/${p.slug}" class="spread-prod-thumb">
                            <img src="${p.thumbnail || p.images[0]}" alt="${p.name}">
                          </a>
                          <div class="spread-prod-info">
                            <h4 class="spread-prod-name">
                              <a href="#product/${p.slug}">${p.name}</a>
                            </h4>
                            <span class="spread-prod-price">₹${(p.salePrice || p.price).toLocaleString('en-IN')}</span>
                          </div>
                          <a href="#product/${p.slug}" class="spread-prod-view-btn">View &rarr;</a>
                        </div>
                      `).join('')}
                    </div>
                  </div>
                </div>
              </div>
            </article>
          `;
        }).join('')}
      </div>
    </div>
  `;
}
