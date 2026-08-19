/**
 * Shugroves Emporium - Configuration & Brand Settings
 * Includes Shopify Storefront API endpoints, Firebase Auth credentials,
 * social handles, and contact support variables.
 */

// Default Shopify settings
const DEFAULT_CONFIG = {
  storeDomain: "shugroves-atelier.myshopify.com",
  storefrontAccessToken: "da257be91307ef11a5bc059a4b3d8869",
  apiVersion: "2024-07"
};

/**
 * Firebase Authentication Configuration
 * Replace the placeholder values with your official Firebase Project credentials.
 */
export const DEFAULT_FIREBASE_CONFIG = {
  apiKey: "AIzaSyCzSBVf_FYj7raDpuGRf4zKAZzWxbq-uKU",
  authDomain: "shougroves.firebaseapp.com",
  databaseURL: "https://shougroves-default-rtdb.firebaseio.com",
  projectId: "shougroves",
  storageBucket: "shougroves.firebasestorage.app",
  messagingSenderId: "388660229029",
  appId: "1:388660229029:web:43cd8cb7269b72f9a82e4c",
  measurementId: "G-H4P95DXGPY"
};

/**
 * Brand Identity, Social Handles & Contact Support Configuration
 * Replace placeholders below with your official business handles and numbers.
 */
export const BRAND_CONFIG = {
  socialLinks: {
    instagram: "",
    facebook: "",
    twitter: ""
  },
  contactInfo: {
    phone: "",
    phoneTel: "",
    whatsapp: "",
    whatsappUrl: "",
    email: "",
    businessHours: "",
    atelierAddress: ""
  }
};

class ShopifyConfig {
  constructor() {
    this.config = this.loadConfig();
  }

  loadConfig() {
    let saved = null;
    try {
      if (typeof localStorage !== 'undefined') {
        const raw = localStorage.getItem('shopify_storefront_config');
        if (raw) saved = JSON.parse(raw);
      }
    } catch (e) {}

    const envWindow = (typeof window !== 'undefined' && window.__SHOPIFY_CONFIG__) || {};

    return {
      storeDomain: saved?.storeDomain || envWindow.storeDomain || DEFAULT_CONFIG.storeDomain,
      storefrontAccessToken: saved?.storefrontAccessToken || envWindow.storefrontAccessToken || DEFAULT_CONFIG.storefrontAccessToken,
      apiVersion: saved?.apiVersion || envWindow.apiVersion || DEFAULT_CONFIG.apiVersion
    };
  }

  get() {
    return { ...this.config };
  }

  getEndpoint() {
    const domain = this.config.storeDomain.replace(/^https?:\/\//, '').replace(/\/$/, '');
    return `https://${domain}/api/${this.config.apiVersion}/graphql.json`;
  }

  update(newConfig) {
    this.config = { ...this.config, ...newConfig };
    try {
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem('shopify_storefront_config', JSON.stringify(this.config));
      }
    } catch (e) {}
  }

  reset() {
    this.config = { ...DEFAULT_CONFIG };
    try {
      if (typeof localStorage !== 'undefined') {
        localStorage.removeItem('shopify_storefront_config');
      }
    } catch (e) {}
  }
}

export const shopifyConfig = new ShopifyConfig();
