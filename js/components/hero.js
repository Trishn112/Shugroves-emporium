/**
 * Shugroves Emporium - Editorial Hero Section
 * Preserves signature entrance animation, organic color backing blobs, and interactive editorial frames.
 */

export function renderHero(container) {
  container.innerHTML = `
    <!-- Decorative Dots Texture -->
    <div class="deco-dots-grid" aria-hidden="true"></div>

    <!-- Left Column: Editorial Headline & Story -->
    <section class="hero-content">
      <div class="hero-tag-wrap">
        <div class="hero-tag-line"></div>
        <span class="hero-eyebrow">Autumn / Winter '26 Collection</span>
      </div>

      <h1 class="hero-heading">
        Formed by nature,<br>
        <em>tailored for ease.</em>
      </h1>

      <p class="hero-description">
        Thoughtfully designed everyday garments crafted with raw organic linens, rich vegetal dyes, and unstructured silhouettes that move gracefully with you.
      </p>

      <div class="hero-actions">
        <a href="#collections" class="btn-primary" id="heroShopBtn">
          <span>Shop Collection</span>
          <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="5" y1="12" x2="19" y2="12"></line>
            <polyline points="12 5 19 12 12 19"></polyline>
          </svg>
        </a>
        <a href="#lookbook" class="btn-secondary" id="heroLookbookBtn">
          <span>Explore Lookbook</span>
        </a>
      </div>

      <!-- Integrated Meta Bar (No Overlapping Badges) -->
      <div class="hero-meta-badge">
        <div class="meta-item">
          <span>Textiles</span>
          <span>100% Belgian Flax</span>
        </div>
        <div class="meta-divider"></div>
        <div class="meta-item">
          <span>Dye Process</span>
          <span>Botanical Extracts</span>
        </div>
        <div class="meta-divider"></div>
        <div class="meta-item">
          <span>Origin</span>
          <span>Slow Crafted</span>
        </div>
        <div class="meta-stamp-pill">
          Handcrafted • 2026
        </div>
      </div>
    </section>

    <!-- Right Column: Organic Blobs & Layered Editorial Frames -->
    <section class="hero-visual-stage" aria-label="Fashion Showcase Visuals">
      
      <!-- Organic Colored Blobs (Sage Green, Terracotta Pink, Mustard Yellow) -->
      <div class="organic-blob blob-sage" aria-hidden="true"></div>
      <div class="organic-blob blob-mustard" aria-hidden="true"></div>
      <div class="organic-blob blob-terracotta" aria-hidden="true"></div>
      <div class="blob-ring" aria-hidden="true"></div>

      <!-- Floating Limited Edition Pill -->
      <div class="floating-card-tag">
        <div class="dot-indicator"></div>
        <p>Pure Linen & Wool • 18 Limited Pieces</p>
      </div>

      <!-- Layered Frames (Interactive Editorial Models) -->
      
      <!-- Frame 1: Left Model -->
      <a href="#collections" class="editorial-frame frame-model-left" title="Seasonal Knitwear">
        <img 
          src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=85" 
          alt="Artisanal knitwear showcase"
          loading="eager"
        >
        <div class="frame-label">Look 01 • Knitwear</div>
      </a>

      <!-- Frame 2: Center-Right Arch Model -->
      <a href="#collections" class="editorial-frame frame-model-center" title="Linen Outerwear">
        <img 
          src="https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=800&q=85" 
          alt="Artisanal linen coat showcase"
          loading="eager"
        >
        <div class="frame-label">Look 02 • Linen Tailoring</div>
      </a>

      <!-- Frame 3: Accent Circular Frame -->
      <a href="#collections" class="editorial-frame frame-model-accent" title="Sculptural Jewellery">
        <img 
          src="https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&w=500&q=85" 
          alt="Artisanal craft detail"
          loading="eager"
        >
      </a>

    </section>
  `;
}
