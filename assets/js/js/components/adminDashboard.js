/**
 * Shugroves Emporium - Admin Portal & Store Management Dashboard
 * Features KPI metrics, Product CRUD, Live Variant Inventory Management,
 * Order Status Updating, Media Library, and Shopify Storefront Integration Settings.
 */

import { store } from '../store.js';
import { shopifyConfig } from '../config.js';
import * as shopify from '../shopify.js';
import { showToast } from './toast.js';

export function renderAdminDashboard(container, params = {}) {
  let isAuthorized = false;
  try {
    isAuthorized = sessionStorage.getItem('shugroves_admin_auth') === 'true';
  } catch (e) {}

  if (!isAuthorized) {
    renderAdminSecurityGate(container);
    return;
  }

  let activeTab = params.section || 'overview'; // overview, products, inventory, orders, media, shopify
  let editingProductId = null;
  let isCreateModalOpen = false;

  function updateView() {
    const products = store.products;
    const orders = store.orders;
    const media = store.mediaLibrary;
    const config = shopifyConfig.get();

    // Calculate KPIs
    const totalRevenue = orders.reduce((sum, o) => sum + (o.total || 0), 0);
    const activeOrdersCount = orders.filter(o => o.status !== 'Delivered' && o.status !== 'Cancelled').length;
    
    // Low stock items (any variant <= 3)
    const lowStockItems = [];
    products.forEach(p => {
      p.variants.forEach(v => {
        if (v.stock <= 3) {
          lowStockItems.push({ product: p, variant: v });
        }
      });
    });

    container.innerHTML = `
      <div class="admin-page">
        <!-- Admin Top Navigation -->
        <header class="admin-header">
          <div class="admin-header-inner">
            <div class="admin-brand-col">
              <span class="admin-badge">Merchant Portal</span>
              <h1 class="admin-title">Store Management</h1>
            </div>
            
            <div class="admin-nav-tabs">
              <button class="admin-tab-btn ${activeTab === 'overview' ? 'tab-active' : ''}" data-tab="overview">Overview</button>
              <button class="admin-tab-btn ${activeTab === 'products' ? 'tab-active' : ''}" data-tab="products">Products (${products.length})</button>
              <button class="admin-tab-btn ${activeTab === 'inventory' ? 'tab-active' : ''}" data-tab="inventory">Live Inventory</button>
              <button class="admin-tab-btn ${activeTab === 'orders' ? 'tab-active' : ''}" data-tab="orders">Orders (${orders.length})</button>
              <button class="admin-tab-btn ${activeTab === 'media' ? 'tab-active' : ''}" data-tab="media">Media Library (${media.length})</button>
              <button class="admin-tab-btn ${activeTab === 'shopify' ? 'tab-active' : ''}" data-tab="shopify">Shopify Settings</button>
              <button class="admin-tab-btn" id="btnLockAdmin" style="color: var(--accent-terracotta-dark);">&#128274; Lock Session</button>
              <a href="#home" class="admin-tab-btn btn-exit-admin">&larr; Return to Store</a>
            </div>
          </div>
        </header>

        <div class="admin-content-container">
          ${activeTab === 'overview' ? renderOverviewSection(totalRevenue, activeOrdersCount, products.length, lowStockItems, orders) :
            activeTab === 'products' ? renderProductsSection(products) :
            activeTab === 'inventory' ? renderInventorySection(products) :
            activeTab === 'orders' ? renderOrdersSection(orders) :
            activeTab === 'media' ? renderMediaSection(media) :
            renderShopifySettingsSection(config)}
        </div>

        <!-- Product Create / Edit Modal -->
        ${isCreateModalOpen || editingProductId ? renderProductFormModal(editingProductId) : ''}
      </div>
    `;

    attachAdminListeners();
  }

  function renderOverviewSection(revenue, activeOrders, productCount, lowStock, recentOrders) {
    return `
      <!-- KPI Metric Cards -->
      <div class="admin-kpi-grid">
        <div class="kpi-card">
          <span class="kpi-label">Gross Revenue</span>
          <h3 class="kpi-val">₹${revenue.toLocaleString('en-IN')}</h3>
          <span class="kpi-sub">Across ${recentOrders.length} client orders</span>
        </div>

        <div class="kpi-card">
          <span class="kpi-label">Active Orders</span>
          <h3 class="kpi-val">${activeOrders}</h3>
          <span class="kpi-sub">In atelier processing & shipment</span>
        </div>

        <div class="kpi-card">
          <span class="kpi-label">Live Creations</span>
          <h3 class="kpi-val">${productCount}</h3>
          <span class="kpi-sub">Active in online collection</span>
        </div>

        <div class="kpi-card ${lowStock.length > 0 ? 'kpi-card-alert' : ''}">
          <span class="kpi-label">Low Stock Alerts</span>
          <h3 class="kpi-val">${lowStock.length}</h3>
          <span class="kpi-sub">Sizes with &le; 3 pieces available</span>
        </div>
      </div>

      <!-- Overview Tables Grid -->
      <div class="admin-overview-grid">
        <!-- Recent Orders -->
        <div class="admin-panel-card">
          <div class="panel-header">
            <h3>Recent Client Orders</h3>
            <button class="btn-text-link" data-tab-switch="orders">View All &rarr;</button>
          </div>
          <div class="admin-table-wrap">
            <table class="admin-table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Client</th>
                  <th>Total</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                ${recentOrders.slice(0, 5).map(o => `
                  <tr>
                    <td><strong>${o.id}</strong></td>
                    <td>${o.shippingAddress.name}</td>
                    <td>₹${o.total.toLocaleString('en-IN')}</td>
                    <td><span class="order-status-badge status-${o.status.toLowerCase()}">${o.status}</span></td>
                    <td><button class="admin-action-link" data-tab-switch="orders">Manage</button></td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>

        <!-- Low Stock Items List -->
        <div class="admin-panel-card">
          <div class="panel-header">
            <h3>Variant Inventory Alerts</h3>
            <button class="btn-text-link" data-tab-switch="inventory">Manage Stock &rarr;</button>
          </div>
          <div class="low-stock-list">
            ${lowStock.length > 0 ? lowStock.map(item => `
              <div class="low-stock-row">
                <img src="${item.product.thumbnail || item.product.images[0]}" alt="${item.product.name}" class="low-stock-thumb">
                <div class="low-stock-info">
                  <strong>${item.product.name}</strong>
                  <span>Size: ${item.variant.size} • Color: ${item.variant.color}</span>
                </div>
                <span class="stock-pill ${item.variant.stock === 0 ? 'pill-soldout' : 'pill-low'}">
                  ${item.variant.stock === 0 ? 'Sold Out' : `${item.variant.stock} left`}
                </span>
              </div>
            `).join('') : '<p class="empty-state-desc" style="padding:1rem;">All product variants have healthy stock levels.</p>'}
          </div>
        </div>
      </div>
    `;
  }

  function renderProductsSection(products) {
    return `
      <div class="admin-panel-card">
        <div class="panel-header">
          <div>
            <h3>Product Catalog Management</h3>
            <p class="panel-desc">All products are dynamically synchronized with your headless Shopify Storefront catalog.</p>
          </div>
          <button class="btn-primary" id="openCreateProductBtn">+ Create New Garment</button>
        </div>

        <div class="admin-table-wrap">
          <table class="admin-table">
            <thead>
              <tr>
                <th>Piece</th>
                <th>Category</th>
                <th>Price</th>
                <th>Available Sizes</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              ${products.map(p => {
                const totalStock = p.variants.reduce((sum, v) => sum + v.stock, 0);
                return `
                  <tr>
                    <td>
                      <div class="admin-prod-cell">
                        <img src="${p.thumbnail || p.images[0]}" alt="${p.name}" class="admin-prod-thumb">
                        <div>
                          <strong>${p.name}</strong>
                          <span class="admin-prod-sku">${p.material}</span>
                        </div>
                      </div>
                    </td>
                    <td><span class="category-pill">${p.category}</span></td>
                    <td>
                      ${p.salePrice ? `
                        <strong>₹${p.salePrice.toLocaleString('en-IN')}</strong>
                        <del style="opacity:0.6; font-size:0.8rem;">₹${p.price.toLocaleString('en-IN')}</del>
                      ` : `<strong>₹${p.price.toLocaleString('en-IN')}</strong>`}
                    </td>
                    <td>
                      <div class="admin-sizes-tags">
                        ${p.variants.map(v => `
                          <span class="size-tag ${v.stock === 0 ? 'size-tag-out' : ''}" title="${v.stock} in stock">
                            ${v.size} (${v.stock})
                          </span>
                        `).join('')}
                      </div>
                    </td>
                    <td>
                      <span class="stock-pill ${totalStock > 5 ? 'pill-in' : totalStock > 0 ? 'pill-low' : 'pill-soldout'}">
                        ${totalStock > 0 ? `${totalStock} in stock` : 'Sold out'}
                      </span>
                    </td>
                    <td>
                      <div class="admin-actions-group">
                        <button class="admin-btn-edit" data-edit-id="${p.id}">Edit</button>
                        <button class="admin-btn-dup" data-dup-id="${p.id}">Duplicate</button>
                        <button class="admin-btn-del" data-del-id="${p.id}">&times;</button>
                      </div>
                    </td>
                  </tr>
                `;
              }).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;
  }

  function renderInventorySection(products) {
    return `
      <div class="admin-panel-card">
        <div class="panel-header">
          <div>
            <h3>Live Variant Inventory Tracker</h3>
            <p class="panel-desc">Adjust variant stock quantities directly in real-time. Changes immediately update customer purchase availability.</p>
          </div>
        </div>

        <div class="admin-table-wrap">
          <table class="admin-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Size Variant</th>
                <th>SKU</th>
                <th>Current Stock</th>
                <th>Availability</th>
                <th>Quick Update</th>
              </tr>
            </thead>
            <tbody>
              ${products.flatMap(p => 
                p.variants.map(v => `
                  <tr>
                    <td>
                      <div class="admin-prod-cell">
                        <img src="${p.thumbnail || p.images[0]}" alt="${p.name}" class="admin-prod-thumb">
                        <strong>${p.name}</strong>
                      </div>
                    </td>
                    <td><strong>${v.size}</strong> (${v.color || p.color})</td>
                    <td><code>${v.sku || `${p.id}-${v.size}`}</code></td>
                    <td>
                      <input 
                        type="number" 
                        min="0" 
                        class="inventory-stock-input" 
                        data-product-id="${p.id}" 
                        data-size="${v.size}" 
                        value="${v.stock}"
                      >
                    </td>
                    <td>
                      <span class="stock-pill ${v.stock > 3 ? 'pill-in' : v.stock > 0 ? 'pill-low' : 'pill-soldout'}">
                        ${v.stock > 3 ? 'In Stock' : v.stock > 0 ? 'Low Stock' : 'Sold Out'}
                      </span>
                    </td>
                    <td>
                      <button 
                        class="btn-secondary btn-save-stock" 
                        data-product-id="${p.id}" 
                        data-size="${v.size}"
                      >
                        Save
                      </button>
                    </td>
                  </tr>
                `)
              ).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;
  }

  function renderOrdersSection(orders) {
    return `
      <div class="admin-panel-card">
        <div class="panel-header">
          <div>
            <h3>Customer Orders & Fulfillment</h3>
            <p class="panel-desc">Orders and checkouts are managed directly via your Shopify store and synchronized here.</p>
          </div>
        </div>

        <div class="admin-table-wrap">
          <table class="admin-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Date</th>
                <th>Client & Address</th>
                <th>Items Ordered</th>
                <th>Total</th>
                <th>Fulfillment Status</th>
              </tr>
            </thead>
            <tbody>
              ${orders.map(o => `
                <tr>
                  <td><strong>${o.id}</strong><br><small>${o.paymentMethod}</small></td>
                  <td>${o.date}</td>
                  <td>
                    <strong>${o.shippingAddress.name}</strong><br>
                    <small>${o.shippingAddress.street}, ${o.shippingAddress.city} - ${o.shippingAddress.postalCode}</small>
                  </td>
                  <td>
                    <div class="admin-order-items-preview">
                      ${o.items.map(it => `
                        <span class="order-item-tag">
                          ${it.name} (${it.size}) &times; ${it.quantity}
                        </span>
                      `).join('')}
                    </div>
                  </td>
                  <td><strong>₹${o.total.toLocaleString('en-IN')}</strong></td>
                  <td>
                    <select class="order-status-select" data-order-id="${o.id}">
                      <option value="Placed" ${o.status === 'Placed' ? 'selected' : ''}>Placed</option>
                      <option value="Confirmed" ${o.status === 'Confirmed' ? 'selected' : ''}>Confirmed</option>
                      <option value="Packed" ${o.status === 'Packed' ? 'selected' : ''}>Packed</option>
                      <option value="Shipped" ${o.status === 'Shipped' ? 'selected' : ''}>Shipped</option>
                      <option value="Delivered" ${o.status === 'Delivered' ? 'selected' : ''}>Delivered</option>
                      <option value="Cancelled" ${o.status === 'Cancelled' ? 'selected' : ''}>Cancelled</option>
                    </select>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;
  }

  function renderMediaSection(media) {
    return `
      <div class="admin-panel-card">
        <div class="panel-header">
          <div>
            <h3>Media Library & License Verification</h3>
            <p class="panel-desc">All photography sourced from legitimate commercial repositories (Unsplash Commercial License). No unauthorized scrapers or AI-generated models.</p>
          </div>
          <button class="btn-primary" id="openAddMediaBtn">+ Add Image Asset</button>
        </div>

        <div class="media-library-grid">
          ${media.map(item => `
            <div class="media-card">
              <div class="media-card-img-wrap">
                <img src="${item.url}" alt="${item.title}" class="media-card-img">
              </div>
              <div class="media-card-body">
                <span class="media-category">${item.category}</span>
                <h4 class="media-title">${item.title}</h4>
                <p class="media-meta"><strong>Source:</strong> ${item.source}</p>
                <p class="media-meta"><strong>License:</strong> <span class="license-badge">${item.licenseStatus}</span></p>
                <p class="media-meta"><strong>Garment:</strong> ${item.productAssoc || 'General Editorial'}</p>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  function renderShopifySettingsSection(config) {
    return `
      <div class="admin-panel-card">
        <div class="panel-header">
          <div>
            <h3>Shopify Storefront API Settings</h3>
            <p class="panel-desc">Configure your Shopify Store Domain and public Storefront Access Token for live Headless Commerce synchronization.</p>
          </div>
          <button class="btn-primary" id="testShopifyConnBtn">Test Connection</button>
        </div>

        <form class="checkout-form" id="shopifyConfigForm" style="max-width: 680px;">
          <div class="form-group">
            <label for="cfgStoreDomain">Shopify Store Domain (myshopify.com)</label>
            <input type="text" id="cfgStoreDomain" required value="${config.storeDomain}" placeholder="your-store.myshopify.com">
            <span class="form-hint">e.g. shugroves-atelier.myshopify.com (found in your Shopify Admin URL)</span>
          </div>

          <div class="form-group">
            <label for="cfgStorefrontToken">Public Storefront Access Token</label>
            <input type="password" id="cfgStorefrontToken" required value="${config.storefrontAccessToken}" placeholder="••••••••••••••••••••••••••••••••">
            <span class="form-hint">Client-safe public token created under Shopify Admin > Develop apps > Storefront API.</span>
          </div>

          <div class="form-group">
            <label for="cfgApiVersion">Shopify API Version</label>
            <input type="text" id="cfgApiVersion" required value="${config.apiVersion}" placeholder="2024-07">
          </div>

          <div class="admin-modal-actions" style="margin-top: 1.5rem; justify-content: flex-start; gap: 1rem;">
            <button type="submit" class="btn-primary">Save & Sync with Shopify</button>
            <button type="button" class="btn-secondary" id="resetShopifyConfigBtn">Reset Defaults</button>
          </div>
        </form>
      </div>
    `;
  }

  function renderProductFormModal(productId) {
    const isEdit = !!productId;
    const prod = isEdit ? store.getProductById(productId) : {
      name: "",
      category: "clothing",
      subcategory: "coats",
      brand: "Shugroves Atelier",
      material: "100% Belgian Linen",
      color: "Dusty Terracotta",
      price: 12000,
      salePrice: null,
      description: "",
      care: "Dry clean only.",
      images: ["https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=800&q=85"],
      availableSizes: ["XS", "S", "M", "L", "XL"],
      variants: [
        { size: "XS", stock: 5 },
        { size: "S", stock: 10 },
        { size: "M", stock: 8 },
        { size: "L", stock: 4 },
        { size: "XL", stock: 2 }
      ]
    };

    return `
      <div class="admin-modal-backdrop" id="adminModalBackdrop"></div>
      <div class="admin-modal-sheet">
        <div class="admin-modal-header">
          <h3>${isEdit ? `Edit Garment: ${prod.name}` : 'Create New Garment'}</h3>
          <button class="admin-modal-close" id="adminModalClose">&times;</button>
        </div>

        <form class="admin-product-form" id="adminProductForm">
          <div class="form-row-2">
            <div class="form-group">
              <label>Garment Name</label>
              <input type="text" id="formProdName" required value="${prod.name}" placeholder="e.g. Madder Linen Blazer">
            </div>
            <div class="form-group">
              <label>Brand Line</label>
              <input type="text" id="formProdBrand" required value="${prod.brand}">
            </div>
          </div>

          <div class="form-row-3">
            <div class="form-group">
              <label>Category</label>
              <select id="formProdCat">
                <option value="clothing" ${prod.category === 'clothing' ? 'selected' : ''}>Clothing</option>
                <option value="bags" ${prod.category === 'bags' ? 'selected' : ''}>Bags</option>
                <option value="shoes" ${prod.category === 'shoes' ? 'selected' : ''}>Shoes</option>
                <option value="accessories" ${prod.category === 'accessories' ? 'selected' : ''}>Accessories</option>
              </select>
            </div>
            <div class="form-group">
              <label>Regular Price (INR)</label>
              <input type="number" id="formProdPrice" required value="${prod.price}">
            </div>
            <div class="form-group">
              <label>Sale Price (Optional)</label>
              <input type="number" id="formProdSalePrice" value="${prod.salePrice || ''}" placeholder="Leave blank if none">
            </div>
          </div>

          <div class="form-row-2">
            <div class="form-group">
              <label>Material & Craft</label>
              <input type="text" id="formProdMaterial" required value="${prod.material}" placeholder="e.g. 100% Organic Belgian Flax">
            </div>
            <div class="form-group">
              <label>Primary Color</label>
              <input type="text" id="formProdColor" required value="${prod.color}">
            </div>
          </div>

          <div class="form-group">
            <label>Primary Image URL (Real High-Res Fashion Photography)</label>
            <input type="url" id="formProdImage" required value="${prod.images[0] || ''}">
          </div>

          <div class="form-group">
            <label>Editorial Description</label>
            <textarea id="formProdDesc" rows="3" required>${prod.description}</textarea>
          </div>

          <div class="admin-modal-actions">
            <button type="button" class="btn-secondary" id="cancelProdFormBtn">Cancel</button>
            <button type="submit" class="btn-primary">${isEdit ? 'Save Changes' : 'Create Garment'}</button>
          </div>
        </form>
      </div>
    `;
  }

  function attachAdminListeners() {
    // 1. Tab switches
    const tabBtns = container.querySelectorAll('.admin-tab-btn[data-tab]');
    tabBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        activeTab = btn.getAttribute('data-tab');
        updateView();
      });
    });

    const quickSwitchBtns = container.querySelectorAll('[data-tab-switch]');
    quickSwitchBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        activeTab = btn.getAttribute('data-tab-switch');
        updateView();
      });
    });

    // 2. Open Create Modal
    const openCreateBtn = document.getElementById('openCreateProductBtn');
    if (openCreateBtn) {
      openCreateBtn.addEventListener('click', () => {
        isCreateModalOpen = true;
        editingProductId = null;
        updateView();
      });
    }

    // 3. Edit Product
    const editBtns = container.querySelectorAll('.admin-btn-edit');
    editBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        editingProductId = btn.getAttribute('data-edit-id');
        isCreateModalOpen = false;
        updateView();
      });
    });

    // 4. Duplicate Product
    const dupBtns = container.querySelectorAll('.admin-btn-dup');
    dupBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-dup-id');
        store.duplicateProduct(id);
        showToast("Garment duplicated in catalog.", 'success');
        updateView();
      });
    });

    // 5. Delete Product
    const delBtns = container.querySelectorAll('.admin-btn-del');
    delBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-del-id');
        if (confirm("Are you sure you want to retire this garment from the collection?")) {
          store.deleteProduct(id);
          showToast("Garment removed from catalog.", 'info');
          updateView();
        }
      });
    });

    // 6. Close Modal
    const closeModal = () => {
      isCreateModalOpen = false;
      editingProductId = null;
      updateView();
    };
    const modalClose = document.getElementById('adminModalClose');
    const modalBackdrop = document.getElementById('adminModalBackdrop');
    const cancelBtn = document.getElementById('cancelProdFormBtn');
    if (modalClose) modalClose.addEventListener('click', closeModal);
    if (modalBackdrop) modalBackdrop.addEventListener('click', closeModal);
    if (cancelBtn) cancelBtn.addEventListener('click', closeModal);

    // 7. Submit Product Form
    const prodForm = document.getElementById('adminProductForm');
    if (prodForm) {
      prodForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('formProdName').value;
        const brand = document.getElementById('formProdBrand').value;
        const category = document.getElementById('formProdCat').value;
        const price = parseInt(document.getElementById('formProdPrice').value, 10);
        const salePriceVal = document.getElementById('formProdSalePrice').value;
        const salePrice = salePriceVal ? parseInt(salePriceVal, 10) : null;
        const material = document.getElementById('formProdMaterial').value;
        const color = document.getElementById('formProdColor').value;
        const image = document.getElementById('formProdImage').value;
        const description = document.getElementById('formProdDesc').value;

        if (editingProductId) {
          store.saveProduct({
            id: editingProductId,
            name, brand, category, price, salePrice, material, color,
            images: [image], thumbnail: image, description
          });
          showToast(`Saved changes to ${name}.`, 'success');
        } else {
          store.saveProduct({
            name, brand, category, price, salePrice, material, color,
            images: [image], thumbnail: image, description,
            availableColors: [color],
            availableSizes: ["XS", "S", "M", "L", "XL"],
            variants: [
              { size: "XS", stock: 4, color },
              { size: "S", stock: 8, color },
              { size: "M", stock: 6, color },
              { size: "L", stock: 3, color },
              { size: "XL", stock: 2, color }
            ],
            details: ["Artisanal crafted", "Consciously tailored", "Natural dyes"],
            care: "Dry clean or hand wash cold.",
            shipping: "Dispatched within 24 hours.",
            returns: "30 days returns policy.",
            isFeatured: true,
            isTrending: false,
            isBestseller: false,
            isNewArrival: true,
            tags: [category, "linen", "new-arrival"]
          });
          showToast(`Created new garment: ${name}.`, 'success');
        }

        closeModal();
      });
    }

    // 8. Live Variant Stock Input
    const stockInputs = container.querySelectorAll('.inventory-stock-input');
    stockInputs.forEach(input => {
      input.addEventListener('change', (e) => {
        const prodId = input.getAttribute('data-product-id');
        const size = input.getAttribute('data-size');
        const val = e.target.value;
        store.updateVariantStock(prodId, size, val);
        showToast(`Stock for size ${size} updated to ${val}.`, 'success');
      });
    });

    const saveStockBtns = container.querySelectorAll('.btn-save-stock');
    saveStockBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const prodId = btn.getAttribute('data-product-id');
        const size = btn.getAttribute('data-size');
        const row = btn.closest('tr');
        const input = row.querySelector('.inventory-stock-input');
        if (input) {
          store.updateVariantStock(prodId, size, input.value);
          showToast(`Stock updated to ${input.value}.`, 'success');
          updateView();
        }
      });
    });

    // 9. Order Status Selector
    const orderSelects = container.querySelectorAll('.order-status-select');
    orderSelects.forEach(sel => {
      sel.addEventListener('change', (e) => {
        const orderId = sel.getAttribute('data-order-id');
        const newStatus = e.target.value;
        store.updateOrderStatus(orderId, newStatus);
        showToast(`Order ${orderId} marked as ${newStatus}.`, 'success');
        updateView();
      });
    });

    // 10. Shopify Config Form
    const shopifyForm = document.getElementById('shopifyConfigForm');
    if (shopifyForm) {
      shopifyForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const storeDomain = document.getElementById('cfgStoreDomain').value.trim();
        const storefrontAccessToken = document.getElementById('cfgStorefrontToken').value.trim();
        const apiVersion = document.getElementById('cfgApiVersion').value.trim();

        shopifyConfig.update({ storeDomain, storefrontAccessToken, apiVersion });
        store.syncWithShopify();
        showToast("Shopify Storefront configuration updated & synchronized.", 'success');
      });
    }

    const testConnBtn = document.getElementById('testShopifyConnBtn');
    if (testConnBtn) {
      testConnBtn.addEventListener('click', async () => {
        showToast("Testing connection to Shopify Storefront API...", 'info');
        const testRes = await shopify.getProducts({ first: 1 });
        if (testRes && testRes.length > 0) {
          showToast(`Connection successful! Loaded piece: "${testRes[0].name}"`, 'success');
        } else {
          showToast("Connected to endpoint. Ready for your live Shopify products.", 'info');
        }
      });
    }

    const resetCfgBtn = document.getElementById('resetShopifyConfigBtn');
    if (resetCfgBtn) {
      resetCfgBtn.addEventListener('click', () => {
        shopifyConfig.reset();
        store.syncWithShopify();
        showToast("Reset Shopify Storefront configuration to defaults.", 'info');
        updateView();
      });
    }

    // 11. Lock Session
    const lockBtn = document.getElementById('btnLockAdmin');
    if (lockBtn) {
      lockBtn.addEventListener('click', () => {
        try {
          sessionStorage.removeItem('shugroves_admin_auth');
        } catch (e) {}
        showToast("Merchant session locked.", 'info');
        renderAdminSecurityGate(container);
      });
    }
  }

  updateView();
}

function renderAdminSecurityGate(container) {
  container.innerHTML = `
    <div class="admin-auth-gate" style="padding: 10rem 2rem 6rem; max-width: 480px; margin: 0 auto; text-align: center;">
      <div style="width: 64px; height: 64px; border-radius: 50%; background: rgba(216,156,148,0.15); display: flex; align-items: center; justify-content: center; margin: 0 auto 1.5rem;">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--accent-terracotta)" stroke-width="2">
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
          <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
        </svg>
      </div>
      <span style="font-size:0.72rem; letter-spacing:0.18em; text-transform:uppercase; color:var(--accent-sage-dark); font-weight:700; display:block; margin-bottom:0.4rem;">Merchant Security Gate</span>
      <h2 style="font-family:var(--font-serif); font-size:2rem; margin-bottom:0.6rem; color:var(--text-charcoal);">Store Owner Access</h2>
      <p style="font-size:0.86rem; color:var(--text-charcoal-muted); margin-bottom:2rem; line-height:1.5;">This portal is reserved strictly for store administration and order management.</p>
      
      <form id="adminAuthGateForm" style="background:var(--bg-cream-tint); border:1px solid var(--border-subtle); border-radius:16px; padding:2rem; text-align:left; box-shadow: var(--shadow-subtle);">
        <div class="form-group" style="margin-bottom:1.4rem;">
          <label for="inputAdminKey" style="font-size:0.75rem; letter-spacing:0.1em; text-transform:uppercase; color:var(--text-charcoal-muted); font-weight:600; display:block; margin-bottom:0.4rem;">Merchant Key / Passcode</label>
          <input type="password" id="inputAdminKey" required placeholder="Enter passcode (e.g. shugroves2026)" style="width:100%; padding:0.85rem 1rem; border-radius:8px; border:1px solid var(--border-subtle); background:var(--bg-cream); font-size:0.9rem;">
        </div>
        <button type="submit" class="btn-primary" style="width:100%; padding:0.9rem; border-radius:24px; font-size:0.82rem; font-weight:700; letter-spacing:0.1em; text-transform:uppercase;">
          Unlock Merchant Portal &rarr;
        </button>
      </form>

      <div style="margin-top:2rem;">
        <a href="#home" style="font-size:0.82rem; color:var(--text-charcoal-muted); text-decoration:underline;">&larr; Return to Client Storefront</a>
      </div>
    </div>
  `;

  const gateForm = document.getElementById('adminAuthGateForm');
  if (gateForm) {
    gateForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const val = document.getElementById('inputAdminKey').value.trim();
      const validKeys = ['shugroves2026', 'admin123', 'owner', 'shugroves'];

      if (validKeys.includes(val.toLowerCase())) {
        try {
          sessionStorage.setItem('shugroves_admin_auth', 'true');
        } catch (err) {}
        showToast("Merchant access authorized.", 'success');
        renderAdminDashboard(container);
      } else {
        showToast("Invalid merchant passcode.", 'error');
      }
    });
  }
}
