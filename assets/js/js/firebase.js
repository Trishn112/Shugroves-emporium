/**
 * Shugroves Emporium - Firebase Authentication, Realtime Database & Firestore Service
 * Connects to Firebase Realtime Database and Cloud Firestore
 * for real-time user order recording, courier delivery address management, and live order tracking.
 */

import { DEFAULT_FIREBASE_CONFIG } from './config.js';

class FirebaseService {
  constructor() {
    this.app = null;
    this.auth = null;
    this.rtdb = null;
    this.db = null; // Firestore
    this.googleProvider = null;
    this.isInitialized = false;
    this.hasRealtimeDb = false;
    this.hasFirestore = false;
    this.listeners = [];
    this.currentUser = null;

    this.init();
  }

  getFirebaseConfig() {
    try {
      if (typeof localStorage !== 'undefined') {
        const saved = localStorage.getItem('shugroves_firebase_config');
        if (saved) return JSON.parse(saved);
      }
    } catch (e) {}

    const envWindow = (typeof window !== 'undefined' && window.__FIREBASE_CONFIG__) || {};
    return { ...DEFAULT_FIREBASE_CONFIG, ...envWindow };
  }

  async init() {
    if (typeof window === 'undefined') return;

    const config = this.getFirebaseConfig();
    const isCustomized = config.apiKey && !config.apiKey.includes('PLACEHOLDER');

    if (isCustomized) {
      try {
        // 1. Initialize Firebase App
        const { initializeApp } = await import('https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js');
        this.app = initializeApp(config);

        // 2. Initialize Firebase Auth
        const { 
          getAuth, 
          GoogleAuthProvider, 
          signInWithPopup, 
          signInWithEmailAndPassword, 
          createUserWithEmailAndPassword, 
          updateProfile,
          sendPasswordResetEmail,
          signOut,
          onAuthStateChanged 
        } = await import('https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js');

        this.auth = getAuth(this.app);
        this.googleProvider = new GoogleAuthProvider();
        this.googleProvider.setCustomParameters({ prompt: 'select_account' });

        this.signInWithPopup = signInWithPopup;
        this.signInWithEmailAndPassword = signInWithEmailAndPassword;
        this.createUserWithEmailAndPassword = createUserWithEmailAndPassword;
        this.updateProfile = updateProfile;
        this.sendPasswordResetEmail = sendPasswordResetEmail;
        this.signOut = signOut;

        onAuthStateChanged(this.auth, (user) => {
          this.currentUser = user ? this.normalizeFirebaseUser(user) : null;
          this.notifyListeners();
        });

        // 3. Initialize Firebase Realtime Database
        try {
          const { 
            getDatabase, 
            ref, 
            set, 
            get, 
            child, 
            push, 
            update, 
            onValue 
          } = await import('https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js');

          this.rtdb = getDatabase(this.app);
          this.dbRef = ref;
          this.dbSet = set;
          this.dbGet = get;
          this.dbChild = child;
          this.dbPush = push;
          this.dbUpdate = update;
          this.dbOnValue = onValue;
          this.hasRealtimeDb = true;
          console.log("Firebase Realtime Database initialized successfully.");
        } catch (rtdbErr) {
          console.warn("Realtime Database module notice:", rtdbErr.message);
        }

        // 4. Initialize Cloud Firestore Database
        try {
          const { 
            getFirestore, 
            collection, 
            doc, 
            setDoc, 
            getDocs, 
            query, 
            where, 
            updateDoc 
          } = await import('https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js');

          this.db = getFirestore(this.app);
          this.collection = collection;
          this.doc = doc;
          this.setDoc = setDoc;
          this.getDocs = getDocs;
          this.query = query;
          this.where = where;
          this.updateDoc = updateDoc;
          this.hasFirestore = true;
          console.log("Cloud Firestore Database initialized.");
        } catch (fsErr) {
          console.warn("Firestore module notice:", fsErr.message);
        }

        this.isInitialized = true;
      } catch (err) {
        console.warn("Operating in resilient local mode:", err.message);
        this.initFallbackMode();
      }
    } else {
      this.initFallbackMode();
    }
  }

  initFallbackMode() {
    try {
      if (typeof localStorage !== 'undefined') {
        const savedAuth = localStorage.getItem('shugroves_auth_user');
        if (savedAuth) {
          this.currentUser = JSON.parse(savedAuth);
        }
      }
    } catch (e) {}
    this.isInitialized = true;
  }

  normalizeFirebaseUser(user) {
    if (!user) return null;
    return {
      uid: user.uid,
      email: user.email,
      name: user.displayName || user.email.split('@')[0],
      displayName: user.displayName || user.email.split('@')[0],
      photoURL: user.photoURL || null,
      isLoggedIn: true,
      provider: user.providerData && user.providerData[0] ? user.providerData[0].providerId : 'firebase'
    };
  }

  subscribe(callback) {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter(cb => cb !== callback);
    };
  }

  notifyListeners() {
    this.listeners.forEach(cb => cb(this.currentUser));
  }

  // =========================================================================
  // AUTHENTICATION METHODS
  // =========================================================================

  async signInWithGoogle() {
    if (this.auth && this.googleProvider && this.signInWithPopup) {
      try {
        const result = await this.signInWithPopup(this.auth, this.googleProvider);
        this.currentUser = this.normalizeFirebaseUser(result.user);
        this.notifyListeners();
        return { success: true, user: this.currentUser, message: `Welcome back, ${this.currentUser.name}!` };
      } catch (err) {
        console.error("Google Auth error:", err);
        return { success: false, message: err.message || "Failed to sign in with Google." };
      }
    } else {
      const demoUser = {
        uid: "google-usr-" + Date.now(),
        email: "client.atelier@gmail.com",
        name: "Google Client",
        displayName: "Google Client",
        photoURL: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
        isLoggedIn: true,
        provider: "google.com"
      };
      this.currentUser = demoUser;
      this.notifyListeners();
      return { success: true, user: demoUser, message: `Signed in successfully via Google.` };
    }
  }

  async signUpWithEmail(email, password, displayName = "") {
    if (!email || !password) {
      return { success: false, message: "Email and password are required." };
    }
    if (password.length < 6) {
      return { success: false, message: "Password must be at least 6 characters long." };
    }

    if (this.auth && this.createUserWithEmailAndPassword) {
      try {
        const res = await this.createUserWithEmailAndPassword(this.auth, email, password);
        if (displayName && this.updateProfile) {
          await this.updateProfile(res.user, { displayName });
        }
        this.currentUser = this.normalizeFirebaseUser(res.user);
        if (displayName) this.currentUser.name = displayName;
        this.notifyListeners();
        return { success: true, user: this.currentUser, message: `Account created successfully!` };
      } catch (err) {
        console.error("Sign up error:", err);
        return { success: false, message: err.message || "Failed to create account." };
      }
    } else {
      const name = displayName || email.split('@')[0];
      const newUser = {
        uid: "usr-" + Date.now(),
        email: email,
        name: name,
        displayName: name,
        photoURL: null,
        isLoggedIn: true,
        provider: "password"
      };
      this.currentUser = newUser;
      this.notifyListeners();
      return { success: true, user: newUser, message: `Welcome to Shugroves Emporium, ${name}!` };
    }
  }

  async signInWithEmail(email, password) {
    if (!email || !password) {
      return { success: false, message: "Please provide your email and password." };
    }

    if (this.auth && this.signInWithEmailAndPassword) {
      try {
        const res = await this.signInWithEmailAndPassword(this.auth, email, password);
        this.currentUser = this.normalizeFirebaseUser(res.user);
        this.notifyListeners();
        return { success: true, user: this.currentUser, message: `Signed in successfully!` };
      } catch (err) {
        console.error("Sign in error:", err);
        let msg = "Invalid email or password.";
        if (err.code === 'auth/user-not-found') msg = "No account found with this email.";
        if (err.code === 'auth/wrong-password') msg = "Incorrect password.";
        if (err.code === 'auth/invalid-credential') msg = "Invalid login credentials.";
        return { success: false, message: msg };
      }
    } else {
      const existing = {
        uid: "usr-" + Date.now(),
        email: email,
        name: email.split('@')[0],
        displayName: email.split('@')[0],
        photoURL: null,
        isLoggedIn: true,
        provider: "password"
      };
      this.currentUser = existing;
      this.notifyListeners();
      return { success: true, user: existing, message: `Welcome back, ${existing.name}!` };
    }
  }

  async sendPasswordReset(email) {
    if (!email) return { success: false, message: "Please enter your registered email address." };

    if (this.auth && this.sendPasswordResetEmail) {
      try {
        await this.sendPasswordResetEmail(this.auth, email);
        return { success: true, message: `Password reset link sent to ${email}. Check your inbox.` };
      } catch (err) {
        return { success: false, message: err.message || "Failed to send reset email." };
      }
    } else {
      return { success: true, message: `Password reset link simulated for ${email}.` };
    }
  }

  async signOutUser() {
    if (this.auth && this.signOut) {
      try {
        await this.signOut(this.auth);
      } catch (err) {
        console.warn("Firebase signout note:", err);
      }
    }
    this.currentUser = null;
    try {
      if (typeof localStorage !== 'undefined') {
        localStorage.removeItem('shugroves_auth_user');
      }
    } catch (e) {}
    this.notifyListeners();
    return { success: true, message: "Signed out successfully." };
  }

  // =========================================================================
  // FIREBASE REALTIME DATABASE & FIRESTORE ORDER RECORDING
  // =========================================================================

  /**
   * Save a newly placed order into Firebase Realtime Database & Cloud Firestore
   */
  async createOrderInDatabase(orderData) {
    const payload = {
      ...orderData,
      createdAt: new Date().toISOString(),
      timestamp: Date.now()
    };

    const config = this.getFirebaseConfig();
    const rtdbBaseUrl = config.databaseURL || `https://${config.projectId}-default-rtdb.firebaseio.com`;

    // 1. Write to Firebase Realtime Database via Modular SDK
    if (this.hasRealtimeDb && this.rtdb && this.dbSet && this.dbRef) {
      try {
        const orderRef = this.dbRef(this.rtdb, `orders/${orderData.id}`);
        await this.dbSet(orderRef, payload);

        // Also record under user's order index if logged in
        if (orderData.userId) {
          const userOrderRef = this.dbRef(this.rtdb, `users/${orderData.userId}/orders/${orderData.id}`);
          await this.dbSet(userOrderRef, payload);
        }
        console.log("✓ Order recorded in Firebase Realtime Database:", orderData.id);
      } catch (rtdbErr) {
        console.warn("Realtime Database write note:", rtdbErr.message);
      }
    }

    // 2. Direct Realtime Database REST API Write (Ensures recording even if SDK rules are in test mode)
    try {
      fetch(`${rtdbBaseUrl}/orders/${orderData.id}.json`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      }).catch(() => {});

      if (orderData.userId) {
        fetch(`${rtdbBaseUrl}/users/${orderData.userId}/orders/${orderData.id}.json`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        }).catch(() => {});
      }
    } catch (restErr) {}

    // 3. Write to Cloud Firestore as Secondary Sync
    if (this.hasFirestore && this.db && this.setDoc && this.doc) {
      try {
        const fsDocRef = this.doc(this.db, "orders", orderData.id);
        await this.setDoc(fsDocRef, payload);
        console.log("✓ Order recorded in Cloud Firestore:", orderData.id);
      } catch (fsErr) {
        console.warn("Firestore write note:", fsErr.message);
      }
    }

    // 4. Always persist to Local Storage as Instant Backup
    this.saveOrderLocally(payload);
    return payload;
  }

  /**
   * Fetch all orders from Firebase Realtime Database / Firestore / Local
   */
  async fetchOrdersFromDatabase(userId = null, userEmail = null) {
    const config = this.getFirebaseConfig();
    const rtdbBaseUrl = config.databaseURL || `https://${config.projectId}-default-rtdb.firebaseio.com`;

    // 1. Fetch from Firebase Realtime Database SDK
    if (this.hasRealtimeDb && this.rtdb && this.dbGet && this.dbRef) {
      try {
        const orderPath = userId ? `users/${userId}/orders` : `orders`;
        const snapshot = await this.dbGet(this.dbRef(this.rtdb, orderPath));
        if (snapshot.exists()) {
          const data = snapshot.val();
          const list = Object.keys(data).map(k => ({ id: k, ...data[k] }));
          if (list.length > 0) {
            return list.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
          }
        }
      } catch (err) {
        console.warn("Realtime Database read note:", err.message);
      }
    }

    // 2. Fetch via Realtime Database REST API
    try {
      const restPath = userId ? `${rtdbBaseUrl}/users/${userId}/orders.json` : `${rtdbBaseUrl}/orders.json`;
      const res = await fetch(restPath);
      if (res.ok) {
        const data = await res.json();
        if (data) {
          const list = Object.keys(data).map(k => ({ id: k, ...data[k] }));
          if (list.length > 0) {
            return list.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
          }
        }
      }
    } catch (e) {}

    // 3. Fetch from Cloud Firestore
    if (this.hasFirestore && this.db && this.getDocs && this.collection) {
      try {
        const ordersCol = this.collection(this.db, "orders");
        let q = ordersCol;

        if (userId) {
          q = this.query(ordersCol, this.where("userId", "==", userId));
        } else if (userEmail) {
          q = this.query(ordersCol, this.where("userEmail", "==", userEmail));
        }

        const snapshot = await this.getDocs(q);
        const orders = [];
        snapshot.forEach(docSnap => {
          orders.push({ id: docSnap.id, ...docSnap.data() });
        });

        if (orders.length > 0) {
          return orders.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
        }
      } catch (err) {
        console.warn("Firestore orders read note:", err.message);
      }
    }

    // 4. Fallback: Return stored local orders
    return this.getLocalOrders(userId, userEmail);
  }

  /**
   * Update Order Status and Tracking in Realtime Database & Firestore
   */
  async updateOrderStatusInDatabase(orderId, newStatus, trackingNumber = "") {
    const updateData = { status: newStatus };
    if (trackingNumber) updateData.trackingNumber = trackingNumber;

    const config = this.getFirebaseConfig();
    const rtdbBaseUrl = config.databaseURL || `https://${config.projectId}-default-rtdb.firebaseio.com`;

    // 1. Realtime Database SDK
    if (this.hasRealtimeDb && this.rtdb && this.dbUpdate && this.dbRef) {
      try {
        await this.dbUpdate(this.dbRef(this.rtdb, `orders/${orderId}`), updateData);
      } catch (e) {}
    }

    // 2. Realtime Database REST
    try {
      fetch(`${rtdbBaseUrl}/orders/${orderId}.json`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updateData)
      }).catch(() => {});
    } catch (e) {}

    // 3. Firestore
    if (this.hasFirestore && this.db && this.updateDoc && this.doc) {
      try {
        const orderRef = this.doc(this.db, "orders", orderId);
        await this.updateDoc(orderRef, updateData);
      } catch (err) {}
    }

    // 4. Local
    this.updateOrderLocally(orderId, newStatus, trackingNumber);
  }

  /**
   * Save a User Delivery Address in Realtime Database & Firestore
   */
  async saveUserAddressInDatabase(userId, addressData) {
    if (!userId) return;
    const addressId = addressData.id || `addr-${Date.now()}`;
    const payload = { ...addressData, id: addressId, updatedAt: new Date().toISOString() };

    const config = this.getFirebaseConfig();
    const rtdbBaseUrl = config.databaseURL || `https://${config.projectId}-default-rtdb.firebaseio.com`;

    // 1. Realtime Database
    if (this.hasRealtimeDb && this.rtdb && this.dbSet && this.dbRef) {
      try {
        await this.dbSet(this.dbRef(this.rtdb, `users/${userId}/addresses/${addressId}`), payload);
      } catch (e) {}
    }

    // 2. Realtime Database REST
    try {
      fetch(`${rtdbBaseUrl}/users/${userId}/addresses/${addressId}.json`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      }).catch(() => {});
    } catch (e) {}

    // 3. Firestore
    if (this.hasFirestore && this.db && this.setDoc && this.doc) {
      try {
        const addrRef = this.doc(this.db, `users/${userId}/addresses`, addressId);
        await this.setDoc(addrRef, payload);
      } catch (err) {}
    }
  }

  /**
   * Fetch User Delivery Addresses from Realtime Database & Firestore
   */
  async fetchUserAddressesFromDatabase(userId) {
    if (!userId) return null;

    const config = this.getFirebaseConfig();
    const rtdbBaseUrl = config.databaseURL || `https://${config.projectId}-default-rtdb.firebaseio.com`;

    // 1. Realtime Database
    if (this.hasRealtimeDb && this.rtdb && this.dbGet && this.dbRef) {
      try {
        const snapshot = await this.dbGet(this.dbRef(this.rtdb, `users/${userId}/addresses`));
        if (snapshot.exists()) {
          const data = snapshot.val();
          return Object.keys(data).map(k => ({ id: k, ...data[k] }));
        }
      } catch (e) {}
    }

    // 2. Realtime Database REST
    try {
      const res = await fetch(`${rtdbBaseUrl}/users/${userId}/addresses.json`);
      if (res.ok) {
        const data = await res.json();
        if (data) return Object.keys(data).map(k => ({ id: k, ...data[k] }));
      }
    } catch (e) {}

    // 3. Firestore
    if (this.hasFirestore && this.db && this.getDocs && this.collection) {
      try {
        const addrCol = this.collection(this.db, `users/${userId}/addresses`);
        const snapshot = await this.getDocs(addrCol);
        const addresses = [];
        snapshot.forEach(docSnap => {
          addresses.push({ id: docSnap.id, ...docSnap.data() });
        });
        if (addresses.length > 0) return addresses;
      } catch (err) {}
    }

    return null;
  }

  // --- Local Storage Helpers ---
  getLocalOrders(userId = null, userEmail = null) {
    try {
      if (typeof localStorage !== 'undefined') {
        const raw = localStorage.getItem('shugroves_orders');
        if (raw) {
          const list = JSON.parse(raw);
          if (userId) return list.filter(o => o.userId === userId);
          if (userEmail) return list.filter(o => o.userEmail === userEmail || o.shippingAddress?.email === userEmail);
          return list;
        }
      }
    } catch (e) {}
    return [];
  }

  saveOrderLocally(order) {
    try {
      if (typeof localStorage !== 'undefined') {
        const list = this.getLocalOrders();
        const index = list.findIndex(o => o.id === order.id);
        if (index >= 0) {
          list[index] = order;
        } else {
          list.unshift(order);
        }
        localStorage.setItem('shugroves_orders', JSON.stringify(list));
      }
    } catch (e) {}
  }

  updateOrderLocally(orderId, newStatus, trackingNumber = "") {
    try {
      if (typeof localStorage !== 'undefined') {
        const list = this.getLocalOrders();
        const found = list.find(o => o.id === orderId);
        if (found) {
          found.status = newStatus;
          if (trackingNumber) found.trackingNumber = trackingNumber;
          localStorage.setItem('shugroves_orders', JSON.stringify(list));
        }
      }
    } catch (e) {}
  }
}

export const firebaseAuth = new FirebaseService();
export const firebaseService = firebaseAuth;
