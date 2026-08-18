/**
 * Shugroves Emporium - Journal & Editorial Essays Component
 * Listing view and full article reader with pull-quotes, typography, and shoppable links.
 */

import { store } from '../store.js';

export function renderJournalListing(container) {
  const articles = store.journal;

  container.innerHTML = `
    <div class="journal-page">
      <header class="collections-header">
        <div class="collections-header-inner">
          <span class="collections-eyebrow">Essays & Perspectives</span>
          <h1 class="collections-title">The Journal</h1>
          <p class="collections-description">
            Conversations on textile heritage, vegetal color philosophy, and the intentional pursuit of slow dressing.
          </p>
        </div>
      </header>

      <div class="section-container">
        <div class="journal-grid">
          ${articles.map((art, idx) => `
            <article class="journal-card ${idx === 0 ? 'journal-card-featured' : ''}">
              <a href="#journal/${art.slug}" class="journal-card-img-wrap">
                <img src="${art.heroImage}" alt="${art.title}" class="journal-card-img" loading="lazy">
              </a>
              <div class="journal-card-body">
                <div class="journal-card-meta">
                  <span class="journal-category">${art.eyebrow}</span>
                  <span class="journal-meta-dot">•</span>
                  <span class="journal-readtime">${art.readTime}</span>
                </div>
                <h2 class="journal-card-title">
                  <a href="#journal/${art.slug}">${art.title}</a>
                </h2>
                <p class="journal-card-excerpt">${art.excerpt}</p>
                <div class="journal-card-footer">
                  <span class="journal-author">Words by ${art.author}</span>
                  <a href="#journal/${art.slug}" class="journal-read-link">Read Essay &rarr;</a>
                </div>
              </div>
            </article>
          `).join('')}
        </div>
      </div>
    </div>
  `;
}

export function renderJournalArticle(container, slug) {
  const article = store.journal.find(a => a.slug === slug);

  if (!article) {
    container.innerHTML = `
      <div class="section-container" style="padding-top: 10rem; text-align: center;">
        <h2 class="section-heading">Essay Not Found</h2>
        <a href="#journal" class="btn-primary" style="margin-top:2rem; display:inline-block;">Return to Journal</a>
      </div>
    `;
    return;
  }

  const relatedProducts = (article.relatedProductIds || []).map(id => store.getProductById(id)).filter(Boolean);

  container.innerHTML = `
    <article class="journal-article-page">
      <!-- Article Header -->
      <header class="article-header">
        <div class="article-header-inner">
          <a href="#journal" class="article-back-link">&larr; Back to Journal</a>
          <span class="article-eyebrow">${article.eyebrow} • ${article.readTime}</span>
          <h1 class="article-title">${article.title}</h1>
          <div class="article-author-row">
            <span>By <strong>${article.author}</strong>, ${article.authorRole}</span>
            <span class="article-date">${article.date}</span>
          </div>
        </div>
      </header>

      <!-- Main Editorial Cover -->
      <div class="article-hero-cover">
        <img src="${article.heroImage}" alt="${article.title}">
      </div>

      <!-- Essay Content Body -->
      <div class="article-body-container">
        <div class="article-prose">
          <p class="article-lead">${article.excerpt}</p>

          ${article.content.map(para => `<p>${para}</p>`).join('')}

          ${article.pullQuote ? `
            <blockquote class="article-pull-quote">
              &ldquo;${article.pullQuote}&rdquo;
            </blockquote>
          ` : ''}
        </div>

        <!-- Linked Shoppable Creations -->
        ${relatedProducts.length > 0 ? `
          <aside class="article-shoppable-sidebar">
            <h3 class="shoppable-sidebar-heading">Mentioned In This Essay</h3>
            <div class="shoppable-sidebar-list">
              ${relatedProducts.map(p => `
                <div class="shoppable-item-card">
                  <a href="#product/${p.slug}" class="shoppable-thumb">
                    <img src="${p.thumbnail || p.images[0]}" alt="${p.name}">
                  </a>
                  <div class="shoppable-info">
                    <h4 class="shoppable-name">
                      <a href="#product/${p.slug}">${p.name}</a>
                    </h4>
                    <span class="shoppable-price">₹${(p.salePrice || p.price).toLocaleString('en-IN')}</span>
                    <a href="#product/${p.slug}" class="shoppable-view-btn">View Piece &rarr;</a>
                  </div>
                </div>
              `).join('')}
            </div>
          </aside>
        ` : ''}
      </div>
    </article>
  `;
}
