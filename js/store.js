/**
 * Shugroves Emporium - Central State Store with Shopify Storefront API Integration
 * Manages Products, Shopify Cart, Wishlist, User, and Real Shopify Checkout.
 */

import { INITIAL_PRODUCTS } from './data/products.js';
import { INITIAL_LOOKBOOK } from './data/lookbook.js';
import { INITIAL_JOURNAL } from './data/journal.js';
import * as shopify from './shopify.js';
import { shopifyConfig } from './config.js';
import { firebaseService } from './firebase.js';

// Safe Storage Wrapper (handles private browsing / SSR environments)
const storage = {
  get(key) {
    try {
      if (typeof localStorage !== 'undefined') {
        return localStorage.getItem(key);
      }
    } catch (e) {}
    return null;
  },
  set(key, val) {
    try {
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem(key, val);
      }
    } catch (e) {}
  },
  remove(key) {
    try {
      if (typeof localStorage !== 'undefined') {
        localStorage.removeItem(key);
      }
    } catch (e) {}
  }
};

class Store {
  constructor() {
    this.listeners = [];
    this.isShopifyConnected = false;
    this.shopifyCart = null;
    this.shopifyCartId = storage.get('shopify_cart_id') || null;
    this.init();
  }

  init() {
    // 1. Initial Products Setup
    const savedProducts = storage.get('shugroves_products');
    if (savedProducts) {
      try {
        this.products = JSON.parse(savedProducts);
      } catch (e) {
        this.products = [...INITIAL_PRODUCTS];
      }
    } else {
      this.products = [...INITIAL_PRODUCTS];
    }

    // 2. Cart Setup
    const savedCart = storage.get('shugroves_cart');
    this.cart = savedCart ? JSON.parse(savedCart) : [];

    // 3. Wishlist Setup
    const savedWishlist = storage.get('shugroves_wishlist');
    this.wishlist = savedWishlist ? JSON.parse(savedWishlist) : [];

    // 4. User Profile
    const savedUser = storage.get('shugroves_user');
    this.user = savedUser ? JSON.parse(savedUser) : {
      isLoggedIn: false,
      name: "Guest",
      email: "",
      phone: "",
      addresses: []
    };

    // 5. Lookbook & Journal
    this.lookbook = [...INITIAL_LOOKBOOK];
    this.journal = [...INITIAL_JOURNAL];

    // 6. Collections
    const savedCollections = storage.get('shugroves_collections');
    this.collections = savedCollections ? JSON.parse(savedCollections) : [];

    // 7. Media Library
    const savedMedia = storage.get('shugroves_media');
    this.mediaLibrary = savedMedia ? JSON.parse(savedMedia) : [];

    // 8. Orders Setup
    const savedOrders = storage.get('shugroves_orders');
    this.orders = savedOrders ? JSON.parse(savedOrders) : [];

    // 8. Promo Codes Configuration
    this.appliedPromo = null;
    this.promoCodes = {
      'SLOWLUXURY10': { rate: 0.10, desc: '10% Conscious Fashion Privilege' },
      'WELCOME500': { fixed: 500, desc: '₹500 Welcome Gift' },
      'EMPORIUM15': { rate: 0.15, desc: '15% Seasonal Editorial Privilege' }
    };

    // Asynchronously synchronize with live Shopify Storefront API
    this.syncWithShopify();
  }

  // --- Subscriptions ---
  subscribe(listener) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  notify() {
    this.listeners.forEach(listener => listener(this));
  }

  // --- Persistence Helpers ---
  saveProducts() {
    storage.set('shugroves_products', JSON.stringify(this.products));
    this.notify();
  }

  saveCollections() {
    storage.set('shugroves_collections', JSON.stringify(this.collections));
    this.notify();
  }

  saveCart() {
    storage.set('shugroves_cart', JSON.stringify(this.cart));
    this.notify();
  }

  saveWishlist() {
    storage.set('shugroves_wishlist', JSON.stringify(this.wishlist));
    this.notify();
  }

  saveOrders() {
    storage.set('shugroves_orders', JSON.stringify(this.orders));
    this.notify();
  }

  saveUser() {
    storage.set('shugroves_user', JSON.stringify(this.user));
    this.notify();
  }

  saveMedia() {
    storage.set('shugroves_media', JSON.stringify(this.mediaLibrary));
    this.notify();
  }

  // --- Live Shopify Storefront Synchronization ---
  async syncWithShopify() {
    // 1. Fetch live Shopify Products
    try {
      const shopifyProducts = await shopify.getProducts({ first: 50 });
      if (shopifyProducts && shopifyProducts.length > 0) {
        this.products = shopifyProducts;
        this.isShopifyConnected = true;
        this.saveProducts();
      }
    } catch (e) {
      console.log("Using cached product catalog:", e.message);
    }

    // 2. Fetch live Shopify Collections
    try {
      const shopifyCollections = await shopify.getCollections(50);
      if (shopifyCollections && shopifyCollections.length > 0) {
        this.collections = shopifyCollections;
        this.saveCollections();
      }
    } catch (e) {
      console.log("Using cached collections:", e.message);
    }

    // 3. Fetch live Shopify Cart
    if (this.shopifyCartId) {
      try {
        const liveCart = await shopify.getCart(this.shopifyCartId);
        if (liveCart) {
          this.shopifyCart = liveCart;
          this.cart = liveCart.lines;
          this.saveCart();
        }
      } catch (e) {
        console.log("Could not sync remote cart:", e.message);
      }
    }
  }

  // --- Collections API ---
  getCollections(searchTerm = '') {
    const list = this.collections || [];
    const clean = (searchTerm || '').trim().toLowerCase();
    if (!clean) return list;
    return list.filter(c => 
      c.title.toLowerCase().includes(clean) || 
      c.handle.toLowerCase().includes(clean)
    );
  }

  // --- Popular & Offers Filters ---
  getPopularProducts() {
    const popular = this.products.filter(p => 
      p.isBestseller || 
      p.isTrending || 
      p.isFeatured || 
      (p.tags && p.tags.some(t => t.toLowerCase() === 'popular' || t.toLowerCase() === 'bestseller'))
    );
    return popular.length > 0 ? popular : this.products.slice(0, 8);
  }

  getOfferProducts() {
    return this.products.filter(p => 
      (p.salePrice && p.salePrice < p.price) || 
      (p.compareAtPrice && p.compareAtPrice > p.price) || 
      (p.tags && p.tags.some(t => t.toLowerCase() === 'sale' || t.toLowerCase() === 'offer' || t.toLowerCase() === 'offers'))
    );
  }

  // --- Products API ---
  getProducts(filters = {}) {
    let result = [...this.products];

    // Category filter
    if (filters.category && filters.category !== 'all') {
      result = result.filter(p => p.category.toLowerCase() === filters.category.toLowerCase());
    }

    // Subcategory
    if (filters.subcategory) {
      result = result.filter(p => p.subcategory.toLowerCase() === filters.subcategory.toLowerCase());
    }

    // Size filter
    if (filters.size && filters.size !== 'all') {
      result = result.filter(p => p.variants && p.variants.some(v => v.size === filters.size && (v.availableForSale || v.stock > 0)));
    }

    // Color filter
    if (filters.color && filters.color !== 'all') {
      result = result.filter(p => p.color.toLowerCase().includes(filters.color.toLowerCase()) || 
        (p.availableColors && p.availableColors.some(c => c.toLowerCase().includes(filters.color.toLowerCase()))));
    }

    // Material filter
    if (filters.material && filters.material !== 'all') {
      result = result.filter(p => p.material.toLowerCase().includes(filters.material.toLowerCase()));
    }

    // Price range
    if (filters.minPrice !== undefined) {
      result = result.filter(p => (p.salePrice || p.price) >= filters.minPrice);
    }
    if (filters.maxPrice !== undefined) {
      result = result.filter(p => (p.salePrice || p.price) <= filters.maxPrice);
    }

    // Availability
    if (filters.inStockOnly) {
      result = result.filter(p => p.variants.some(v => v.availableForSale || v.stock > 0));
    }

    // Search query
    if (filters.search) {
      const q = filters.search.toLowerCase();
      result = result.filter(p => 
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.material.toLowerCase().includes(q) ||
        (p.tags && p.tags.some(t => t.toLowerCase().includes(q)))
      );
    }

    // Sorting
    if (filters.sort) {
      switch (filters.sort) {
        case 'price-low':
          result.sort((a, b) => (a.salePrice || a.price) - (b.salePrice || b.price));
          break;
        case 'price-high':
          result.sort((a, b) => (b.salePrice || b.price) - (a.salePrice || a.price));
          break;
        case 'newest':
          result.sort((a, b) => (b.isNewArrival ? 1 : 0) - (a.isNewArrival ? 1 : 0));
          break;
        case 'bestseller':
          result.sort((a, b) => (b.isBestseller ? 1 : 0) - (a.isBestseller ? 1 : 0));
          break;
        case 'featured':
        default:
          result.sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0));
          break;
      }
    }

    return result;
  }

  getProductById(id) {
    return this.products.find(p => p.id === id || p.shopifyId === id);
  }

  getProductBySlug(slug) {
    return this.products.find(p => p.slug === slug || p.handle === slug);
  }

  // --- Real Shopify Cart Operations ---
  async addToCart(product, selectedSize, selectedColor = null, quantity = 1) {
    const color = selectedColor || product.color;
    const variant = product.variants.find(v => v.size === selectedSize && v.color === color) || 
                    product.variants.find(v => v.size === selectedSize) || 
                    product.variants[0];

    if (!variant || (!variant.availableForSale && variant.stock < 1)) {
      return { success: false, message: "Selected size is currently out of stock in Shopify." };
    }

    const variantId = variant.id;

    // Check if Shopify Cart is connected
    if (this.shopifyCartId) {
      try {
        const updatedCart = await shopify.addCartLines(this.shopifyCartId, [{ variantId, quantity }]);
        if (updatedCart) {
          this.shopifyCart = updatedCart;
          this.cart = updatedCart.lines;
          this.saveCart();
          return { success: true, message: `${product.name} (${selectedSize}) added to bag.` };
        }
      } catch (e) {
        console.warn("Could not add to remote Shopify cart, using local fallback:", e.message);
      }
    }

    // If no cart exists, try creating one via Shopify Storefront API
    try {
      const newCart = await shopify.createCart([{ variantId, quantity }]);
      if (newCart) {
        this.shopifyCart = newCart;
        this.shopifyCartId = newCart.id;
        storage.set('shopify_cart_id', newCart.id);
        this.cart = newCart.lines;
        this.saveCart();
        return { success: true, message: `${product.name} (${selectedSize}) added to bag.` };
      }
    } catch (e) {
      console.warn("Could not create remote Shopify cart, using local fallback:", e.message);
    }

    // Fallback local persistence if offline / configuring Storefront API token
    const sku = variant.sku || `${product.id}-${selectedSize}`;
    const existingIndex = this.cart.findIndex(item => item.variantSku === sku || item.variantId === variantId);

    if (existingIndex > -1) {
      this.cart[existingIndex].quantity += quantity;
    } else {
      this.cart.push({
        lineId: `line-${Date.now()}`,
        productId: product.id,
        variantId: variantId,
        variantSku: sku,
        name: product.name,
        slug: product.slug,
        size: selectedSize,
        color: color,
        price: product.salePrice || product.price,
        originalPrice: product.price,
        image: variant.image || product.thumbnail || product.images[0],
        quantity: quantity,
        maxStock: variant.stock || 20
      });
    }

    this.saveCart();
    return { success: true, message: `${product.name} (${selectedSize}) added to bag.` };
  }

  async removeFromCart(lineOrSku) {
    const item = this.cart.find(i => i.lineId === lineOrSku || i.variantSku === lineOrSku || i.variantId === lineOrSku);
    
    if (this.shopifyCartId && item?.lineId && item.lineId.startsWith('gid://shopify/')) {
      try {
        const updatedCart = await shopify.removeCartLines(this.shopifyCartId, [item.lineId]);
        if (updatedCart) {
          this.shopifyCart = updatedCart;
          this.cart = updatedCart.lines;
          this.saveCart();
          return;
        }
      } catch (e) {
        console.warn("Remote cart line removal failed:", e.message);
      }
    }

    this.cart = this.cart.filter(i => i.lineId !== lineOrSku && i.variantSku !== lineOrSku && i.variantId !== lineOrSku);
    this.saveCart();
  }

  async updateCartQuantity(lineOrSku, newQuantity) {
    if (newQuantity <= 0) {
      return this.removeFromCart(lineOrSku);
    }

    const item = this.cart.find(i => i.lineId === lineOrSku || i.variantSku === lineOrSku || i.variantId === lineOrSku);
    if (!item) return;

    if (this.shopifyCartId && item.lineId && item.lineId.startsWith('gid://shopify/')) {
      try {
        const updatedCart = await shopify.updateCartLines(this.shopifyCartId, [{ lineId: item.lineId, quantity: newQuantity }]);
        if (updatedCart) {
          this.shopifyCart = updatedCart;
          this.cart = updatedCart.lines;
          this.saveCart();
          return;
        }
      } catch (e) {
        console.warn("Remote cart quantity update failed:", e.message);
      }
    }

    item.quantity = newQuantity;
    this.saveCart();
  }

  async applyPromoCode(code) {
    const cleanCode = code.trim().toUpperCase();

    if (this.shopifyCartId) {
      try {
        const updatedCart = await shopify.applyCartDiscount(this.shopifyCartId, [cleanCode]);
        if (updatedCart) {
          this.shopifyCart = updatedCart;
          this.appliedPromo = updatedCart.appliedPromo;
          this.notify();
          return { success: true, message: `Shopify discount code '${cleanCode}' applied.` };
        }
      } catch (e) {}
    }

    // Local promotional engine fallback
    if (this.promoCodes[cleanCode]) {
      this.appliedPromo = {
        code: cleanCode,
        ...this.promoCodes[cleanCode]
      };
      this.notify();
      return { success: true, message: `Promo code '${cleanCode}' applied!` };
    }
    return { success: false, message: "Invalid or expired promotional code." };
  }

  removePromoCode() {
    this.appliedPromo = null;
    this.notify();
  }

  getCheckoutUrl() {
    if (this.shopifyCart?.checkoutUrl) {
      return this.shopifyCart.checkoutUrl;
    }
    
    // Construct direct permalink checkout URL if cart exists with variants
    const domain = shopifyConfig.get().storeDomain.replace(/^https?:\/\//, '').replace(/\/$/, '');
    if (this.cart.length > 0 && this.cart[0].variantId) {
      const itemsParam = this.cart
        .filter(it => it.variantId)
        .map(it => {
          const numericId = it.variantId.replace(/[^0-9]/g, '');
          return `${numericId}:${it.quantity}`;
        })
        .join(',');
      
      if (itemsParam) {
        return `https://${domain}/cart/${itemsParam}`;
      }
    }

    return `https://${domain}/cart`;
  }

  getCartTotals() {
    const subtotal = this.shopifyCart?.subtotal !== undefined 
      ? this.shopifyCart.subtotal 
      : this.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      
    const itemCount = this.shopifyCart?.totalQuantity !== undefined 
      ? this.shopifyCart.totalQuantity 
      : this.cart.reduce((sum, item) => sum + item.quantity, 0);

    let discount = 0;
    if (this.appliedPromo) {
      if (this.appliedPromo.rate) {
        discount = Math.round(subtotal * this.appliedPromo.rate);
      } else if (this.appliedPromo.fixed) {
        discount = Math.min(this.appliedPromo.fixed, subtotal);
      }
    }

    // Free shipping threshold: ₹10,000
    const freeShippingThreshold = 10000;
    const shipping = (subtotal >= freeShippingThreshold || subtotal === 0) ? 0 : 450;
    const freeShippingRemaining = Math.max(0, freeShippingThreshold - subtotal);
    const total = Math.max(0, subtotal - discount + shipping);

    return {
      subtotal,
      discount,
      shipping,
      total,
      itemCount,
      freeShippingThreshold,
      freeShippingRemaining,
      appliedPromo: this.appliedPromo,
      checkoutUrl: this.getCheckoutUrl()
    };
  }

  clearCart() {
    this.cart = [];
    this.shopifyCart = null;
    this.shopifyCartId = null;
    this.appliedPromo = null;
    storage.remove('shopify_cart_id');
    this.saveCart();
  }

  // --- Wishlist API ---
  toggleWishlist(productId) {
    const exists = this.wishlist.includes(productId);
    if (exists) {
      this.wishlist = this.wishlist.filter(id => id !== productId);
    } else {
      this.wishlist.push(productId);
    }
    this.saveWishlist();
    return !exists;
  }

  isInWishlist(productId) {
    return this.wishlist.includes(productId);
  }

  getWishlistProducts() {
    return this.products.filter(p => this.wishlist.includes(p.id) || this.wishlist.includes(p.shopifyId));
  }

  // --- Admin Product Operations ---
  saveProduct(productData) {
    if (productData.id) {
      const index = this.products.findIndex(p => p.id === productData.id || p.shopifyId === productData.id);
      if (index > -1) {
        this.products[index] = { ...this.products[index], ...productData, updatedDate: new Date().toISOString().split('T')[0] };
      }
    } else {
      const newId = `shu-${String(this.products.length + 1).padStart(3, '0')}`;
      const newSlug = productData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      const newProduct = {
        id: newId,
        slug: newSlug,
        createdDate: new Date().toISOString().split('T')[0],
        status: "active",
        ...productData
      };
      this.products.unshift(newProduct);
    }
    this.saveProducts();
  }

  deleteProduct(productId) {
    this.products = this.products.filter(p => p.id !== productId && p.shopifyId !== productId);
    this.saveProducts();
  }

  duplicateProduct(productId) {
    const source = this.products.find(p => p.id === productId || p.shopifyId === productId);
    if (!source) return;

    const newId = `shu-${Date.now().toString().slice(-4)}`;
    const duplicate = JSON.parse(JSON.stringify(source));
    duplicate.id = newId;
    duplicate.name = `${source.name} (Copy)`;
    duplicate.slug = `${source.slug}-copy-${Date.now().toString().slice(-4)}`;
    duplicate.createdDate = new Date().toISOString().split('T')[0];

    this.products.unshift(duplicate);
    this.saveProducts();
  }

  updateVariantStock(productId, size, newStock) {
    const product = this.products.find(p => p.id === productId || p.shopifyId === productId);
    if (product) {
      const variant = product.variants.find(v => v.size === size);
      if (variant) {
        variant.stock = Math.max(0, parseInt(newStock, 10) || 0);
        this.saveProducts();
      }
    }
  }

  // --- User Authentication API ---
  setUser(userData) {
    if (userData) {
      this.user = {
        ...this.user,
        ...userData,
        isLoggedIn: true
      };
    } else {
      this.user = {
        isLoggedIn: false,
        name: "Guest",
        email: "",
        phone: "",
        addresses: []
      };
    }
    this.saveUser();
  }

  logout() {
    this.user = {
      isLoggedIn: false,
      name: "Guest",
      email: "",
      phone: "",
      addresses: []
    };
    this.saveUser();
  }

  // --- Orders & Firestore Database API ---
  async placeOrder(shippingAddress, paymentMethod = "Shopify Hosted Payments") {
    const totals = this.getCartTotals();
    const orderId = `SHU-${Math.floor(1000 + Math.random() * 9000)}`;
    const trackingNumber = `IND-${Math.floor(1000000 + Math.random() * 9000000)}-EXP`;

    const orderData = {
      id: orderId,
      userId: this.user?.uid || null,
      userEmail: this.user?.email || shippingAddress.email || "guest@shugroves.com",
      date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
      status: "Processing",
      total: totals.total,
      subtotal: totals.subtotal,
      discount: totals.discount,
      shipping: totals.shipping,
      paymentMethod: paymentMethod,
      trackingNumber: trackingNumber,
      carrier: "BlueDart Express Courier",
      shippingAddress: shippingAddress,
      items: this.cart.map(item => ({
        id: item.id,
        productId: item.productId,
        name: item.name,
        price: item.price,
        size: item.size,
        color: item.color,
        quantity: item.quantity,
        image: item.image
      }))
    };

    // Save to Firestore Database
    await firebaseService.createOrderInDatabase(orderData);
    this.orders.unshift(orderData);
    this.saveOrders();

    // If customer selected to save address
    if (shippingAddress.saveAddress && this.user) {
      this.addUserAddress(shippingAddress);
    }

    // Clear cart
    this.clearCart();

    return orderData;
  }

  async getOrdersForCurrentUser() {
    if (this.user?.uid || this.user?.email) {
      const remoteOrders = await firebaseService.fetchOrdersFromDatabase(this.user.uid, this.user.email);
      if (remoteOrders && remoteOrders.length > 0) {
        return remoteOrders;
      }
    }
    return this.orders;
  }

  async getAllOrders() {
    const all = await firebaseService.fetchOrdersFromDatabase();
    if (all && all.length > 0) {
      this.orders = all;
      this.saveOrders();
      return all;
    }
    return this.orders;
  }

  async updateOrderStatus(orderId, newStatus, trackingNumber = "") {
    await firebaseService.updateOrderStatusInDatabase(orderId, newStatus, trackingNumber);
    const found = this.orders.find(o => o.id === orderId);
    if (found) {
      found.status = newStatus;
      if (trackingNumber) found.trackingNumber = trackingNumber;
      this.saveOrders();
    }
  }

  // --- Address Management ---
  addUserAddress(addressData) {
    if (!this.user.addresses) this.user.addresses = [];
    const newAddr = {
      id: `addr-${Date.now()}`,
      isDefault: this.user.addresses.length === 0,
      fullName: addressData.fullName || addressData.name || this.user.name,
      phone: addressData.phone || this.user.phone || "",
      street: addressData.street || "",
      city: addressData.city || "",
      state: addressData.state || "",
      postalCode: addressData.postalCode || addressData.zip || "",
      country: addressData.country || "India"
    };
    this.user.addresses.unshift(newAddr);
    this.saveUser();

    if (this.user.uid) {
      firebaseService.saveUserAddressInDatabase(this.user.uid, newAddr);
    }
    return newAddr;
  }

  deleteUserAddress(addressId) {
    if (!this.user.addresses) return;
    this.user.addresses = this.user.addresses.filter(a => a.id !== addressId);
    this.saveUser();
  }

  setDefaultUserAddress(addressId) {
    if (!this.user.addresses) return;
    this.user.addresses.forEach(a => {
      a.isDefault = a.id === addressId;
    });
    this.saveUser();
  }

  // --- Media Library ---
  addMediaItem(item) {
    const newMedia = {
      id: `med-${Date.now().toString().slice(-4)}`,
      ...item
    };
    this.mediaLibrary.unshift(newMedia);
    this.saveMedia();
    return newMedia;
  }
}

export const store = new Store();
