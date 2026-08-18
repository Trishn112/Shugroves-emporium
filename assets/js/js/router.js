/**
 * Shugroves Emporium - Hash-based Client Router
 * Seamless single-page view transitions with URL state management.
 */

export class Router {
  constructor(routes = {}) {
    this.routes = routes;
    this.currentRoute = '';
    this.params = {};
    
    if (typeof window !== 'undefined') {
      window.addEventListener('hashchange', () => this.handleRoute());
    }
  }

  addRoute(path, handler) {
    this.routes[path] = handler;
  }

  navigate(path) {
    if (typeof window !== 'undefined') {
      window.location.hash = path.startsWith('#') ? path : `#${path}`;
    }
  }

  handleRoute() {
    if (typeof window === 'undefined') return;

    const rawHash = window.location.hash.slice(1) || 'home';
    const [pathPart, queryPart] = rawHash.split('?');
    const segments = pathPart.split('/').filter(Boolean);

    // Scroll to top on route change smoothly
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Parse Query Params
    const queryParams = {};
    if (queryPart) {
      new URLSearchParams(queryPart).forEach((val, key) => {
        queryParams[key] = val;
      });
    }

    // Match Routes
    if (segments.length === 0 || segments[0] === 'home') {
      this.currentRoute = 'home';
      this.params = { ...queryParams };
      if (this.routes['home']) this.routes['home'](this.params);
      return;
    }

    if (segments[0] === 'collections') {
      this.currentRoute = 'collections';
      this.params = {
        category: segments[1] || 'all',
        ...queryParams
      };
      if (this.routes['collections']) this.routes['collections'](this.params);
      return;
    }

    if (segments[0] === 'product' && segments[1]) {
      this.currentRoute = 'product';
      this.params = {
        slug: segments[1],
        ...queryParams
      };
      if (this.routes['product']) this.routes['product'](this.params);
      return;
    }

    if (segments[0] === 'lookbook') {
      this.currentRoute = 'lookbook';
      this.params = { ...queryParams };
      if (this.routes['lookbook']) this.routes['lookbook'](this.params);
      return;
    }

    if (segments[0] === 'journal') {
      if (segments[1]) {
        this.currentRoute = 'journal-article';
        this.params = { slug: segments[1], ...queryParams };
        if (this.routes['journal-article']) this.routes['journal-article'](this.params);
      } else {
        this.currentRoute = 'journal';
        this.params = { ...queryParams };
        if (this.routes['journal']) this.routes['journal'](this.params);
      }
      return;
    }

    if (segments[0] === 'account') {
      this.currentRoute = 'account';
      const activeTab = queryParams.tab || segments[1] || 'orders';
      this.params = { tab: activeTab, ...queryParams };
      if (this.routes['account']) this.routes['account'](this.params);
      return;
    }

    if (segments[0] === 'admin') {
      this.currentRoute = 'admin';
      this.params = { section: segments[1] || 'overview', ...queryParams };
      if (this.routes['admin']) this.routes['admin'](this.params);
      return;
    }

    if (segments[0] === 'wishlist') {
      this.currentRoute = 'wishlist';
      this.params = { ...queryParams };
      if (this.routes['wishlist']) this.routes['wishlist'](this.params);
      return;
    }

    if (segments[0] === 'checkout') {
      this.currentRoute = 'checkout';
      this.params = { ...queryParams };
      if (this.routes['checkout']) this.routes['checkout'](this.params);
      return;
    }

    if (segments[0] === 'popular') {
      this.currentRoute = 'popular';
      this.params = { sort: 'bestseller', ...queryParams };
      if (this.routes['popular']) this.routes['popular'](this.params);
      else if (this.routes['collections']) this.routes['collections']({ sort: 'bestseller', ...queryParams });
      return;
    }

    if (segments[0] === 'offers') {
      this.currentRoute = 'offers';
      this.params = { category: segments[1] || 'all', ...queryParams };
      if (this.routes['offers']) this.routes['offers'](this.params);
      return;
    }

    if (segments[0] === 'about') {
      this.currentRoute = 'about';
      this.params = { ...queryParams };
      if (this.routes['about']) this.routes['about'](this.params);
      return;
    }

    if (segments[0] === 'help') {
      this.currentRoute = 'help';
      this.params = { ...queryParams };
      if (this.routes['help']) this.routes['help'](this.params);
      return;
    }

    // Default fallback to home
    this.currentRoute = 'home';
    if (this.routes['home']) this.routes['home'](this.params);
  }

  start() {
    this.handleRoute();
  }
}
