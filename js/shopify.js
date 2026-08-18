/**
 * Shugroves Emporium - Official Shopify Storefront API (GraphQL) Client
 * Headless commerce service for Products, Collections, Cart, and Checkout.
 */

import { shopifyConfig } from './config.js';

/**
 * Core GraphQL Fetcher for Shopify Storefront API
 */
export async function shopifyFetch(query, variables = {}) {
  const endpoint = shopifyConfig.getEndpoint();
  const token = shopifyConfig.get().storefrontAccessToken;

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': token,
        'Accept': 'application/json'
      },
      body: JSON.stringify({ query, variables })
    });

    if (!response.ok) {
      throw new Error(`Shopify Storefront API HTTP error: ${response.status} ${response.statusText}`);
    }

    const json = await response.json();
    if (json.errors && json.errors.length > 0) {
      console.warn("Shopify GraphQL errors:", json.errors);
      return { data: null, errors: json.errors };
    }

    return { data: json.data, errors: null };
  } catch (error) {
    console.warn("Shopify Storefront network/execution error:", error.message);
    return { data: null, errors: [{ message: error.message }] };
  }
}

/**
 * Normalizes a raw Shopify GraphQL Product node to the internal UI object model
 */
export function normalizeProduct(node) {
  if (!node) return null;

  const minPrice = parseFloat(node.priceRange?.minVariantPrice?.amount || '0');
  const maxPrice = parseFloat(node.priceRange?.maxVariantPrice?.amount || '0');
  const compareAtMin = node.compareAtPriceRange?.minVariantPrice?.amount 
    ? parseFloat(node.compareAtPriceRange.minVariantPrice.amount) 
    : null;

  const images = (node.images?.edges || []).map(edge => edge.node.url);
  const primaryImage = images[0] || 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=800&q=85';
  const secondaryImage = images[1] || primaryImage;

  // Extract Variants
  const variants = (node.variants?.edges || []).map(vEdge => {
    const v = vEdge.node;
    const sizeOpt = (v.selectedOptions || []).find(o => o.name.toLowerCase() === 'size')?.value || 'One Size';
    const colorOpt = (v.selectedOptions || []).find(o => o.name.toLowerCase() === 'color' || o.name.toLowerCase() === 'colour')?.value || 'Default';

    return {
      id: v.id,
      title: v.title,
      size: sizeOpt,
      color: colorOpt,
      price: parseFloat(v.price?.amount || '0'),
      compareAtPrice: v.compareAtPrice ? parseFloat(v.compareAtPrice.amount) : null,
      availableForSale: v.availableForSale,
      stock: v.quantityAvailable !== null && v.quantityAvailable !== undefined ? v.quantityAvailable : (v.availableForSale ? 10 : 0),
      sku: v.sku || v.id,
      image: v.image?.url || primaryImage,
      selectedOptions: v.selectedOptions || []
    };
  });

  // Extract Sizes & Colors
  const sizeOption = (node.options || []).find(o => o.name.toLowerCase() === 'size');
  const colorOption = (node.options || []).find(o => o.name.toLowerCase() === 'color' || o.name.toLowerCase() === 'colour');

  const availableSizes = sizeOption ? sizeOption.values : (variants.length > 0 ? [...new Set(variants.map(v => v.size))] : ['One Size']);
  const availableColors = colorOption ? colorOption.values : (variants.length > 0 ? [...new Set(variants.map(v => v.color))] : ['Natural']);

  // Extract tags & category
  const tags = node.tags || [];
  let category = 'clothing';
  const typeLower = (node.productType || '').toLowerCase();
  if (typeLower.includes('bag') || tags.includes('bag') || tags.includes('bags')) category = 'bags';
  else if (typeLower.includes('shoe') || typeLower.includes('mule') || tags.includes('shoes')) category = 'shoes';
  else if (typeLower.includes('jewel') || typeLower.includes('accessory') || tags.includes('accessories')) category = 'accessories';
  else if (typeLower.includes('clothing') || typeLower.includes('dress') || typeLower.includes('coat') || typeLower.includes('knit')) category = 'clothing';

  // Material extraction
  const materialTag = tags.find(t => t.toLowerCase().startsWith('material:'));
  const material = materialTag ? materialTag.split(':')[1].trim() : (node.vendor || 'Artisanal Natural Fiber');

  return {
    id: node.id,
    shopifyId: node.id,
    slug: node.handle,
    handle: node.handle,
    name: node.title,
    title: node.title,
    brand: node.vendor || 'Shugroves Atelier',
    category: category,
    subcategory: node.productType || category,
    price: minPrice,
    salePrice: compareAtMin && compareAtMin > minPrice ? minPrice : null,
    compareAtPrice: compareAtMin,
    material: material,
    color: availableColors[0] || 'Natural',
    availableColors: availableColors,
    availableSizes: availableSizes,
    variants: variants,
    images: images.length > 0 ? images : [primaryImage, secondaryImage],
    thumbnail: primaryImage,
    secondaryImage: secondaryImage,
    description: node.description || 'Artisanal piece tailored with natural fibres and organic silhouettes.',
    descriptionHtml: node.descriptionHtml || '',
    details: [
      "Crafted with unbleached natural textiles",
      "Hand-finished organic contours",
      "Sustainably dyed with botanical extracts"
    ],
    care: "Dry clean or hand wash gently in cold water with neutral organic soap.",
    shipping: "Carbon-neutral worldwide dispatch in biodegradable linen packaging.",
    returns: "Complimentary 30-day returns on unworn pieces with atelier tags attached.",
    isFeatured: tags.includes('featured') || tags.includes('trending') || true,
    isTrending: tags.includes('trending'),
    isBestseller: tags.includes('bestseller'),
    isNewArrival: tags.includes('new-arrival') || true,
    tags: tags,
    availableForSale: node.availableForSale
  };
}

/**
 * Normalizes a raw Shopify GraphQL Cart node to the internal UI object model
 */
export function normalizeCart(cartNode) {
  if (!cartNode) return null;

  const lines = (cartNode.lines?.edges || []).map(edge => {
    const line = edge.node;
    const merchandise = line.merchandise || {};
    const product = merchandise.product || {};
    const sizeOpt = (merchandise.selectedOptions || []).find(o => o.name.toLowerCase() === 'size')?.value || 'One Size';
    const colorOpt = (merchandise.selectedOptions || []).find(o => o.name.toLowerCase() === 'color' || o.name.toLowerCase() === 'colour')?.value || 'Natural';

    return {
      lineId: line.id,
      variantId: merchandise.id,
      variantSku: merchandise.id,
      productId: product.id,
      slug: product.handle,
      name: product.title || 'Artisanal Creation',
      size: sizeOpt,
      color: colorOpt,
      price: parseFloat(merchandise.price?.amount || '0'),
      quantity: line.quantity,
      image: merchandise.image?.url || 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=300&q=85',
      maxStock: 99
    };
  });

  const subtotal = parseFloat(cartNode.cost?.subtotalAmount?.amount || '0');
  const total = parseFloat(cartNode.cost?.totalAmount?.amount || '0');
  const totalQuantity = cartNode.totalQuantity || lines.reduce((sum, l) => sum + l.quantity, 0);

  const appliedDiscount = (cartNode.discountCodes || []).find(d => d.applicable);

  return {
    id: cartNode.id,
    checkoutUrl: cartNode.checkoutUrl,
    totalQuantity: totalQuantity,
    subtotal: subtotal,
    total: total,
    lines: lines,
    appliedPromo: appliedDiscount ? { code: appliedDiscount.code, desc: 'Shopify Storefront Discount' } : null
  };
}

/* ==============================================================================
   GRAPHQL QUERIES & MUTATIONS
   ============================================================================== */

const PRODUCT_FIELDS = `
  id
  title
  handle
  description
  descriptionHtml
  productType
  vendor
  tags
  availableForSale
  priceRange {
    minVariantPrice { amount currencyCode }
    maxVariantPrice { amount currencyCode }
  }
  compareAtPriceRange {
    minVariantPrice { amount currencyCode }
    maxVariantPrice { amount currencyCode }
  }
  images(first: 8) {
    edges {
      node {
        url
        altText
        width
        height
      }
    }
  }
  options {
    name
    values
  }
  variants(first: 30) {
    edges {
      node {
        id
        title
        availableForSale
        quantityAvailable
        price { amount currencyCode }
        compareAtPrice { amount currencyCode }
        sku
        selectedOptions {
          name
          value
        }
        image {
          url
        }
      }
    }
  }
`;

const CART_FIELDS = `
  id
  checkoutUrl
  totalQuantity
  cost {
    subtotalAmount { amount currencyCode }
    totalAmount { amount currencyCode }
    totalTaxAmount { amount currencyCode }
  }
  discountCodes {
    code
    applicable
  }
  lines(first: 50) {
    edges {
      node {
        id
        quantity
        cost {
          totalAmount { amount currencyCode }
        }
        merchandise {
          ... on ProductVariant {
            id
            title
            sku
            price { amount currencyCode }
            image { url }
            selectedOptions {
              name
              value
            }
            product {
              id
              title
              handle
            }
          }
        }
      }
    }
  }
`;

/**
 * Fetch list of products with optional query, sorting, and pagination
 */
export async function getProducts({ query = null, sortKey = 'BEST_SELLING', reverse = false, first = 24 } = {}) {
  const gql = `
    query getProducts($first: Int!, $query: String, $sortKey: ProductSortKeys, $reverse: Boolean) {
      products(first: $first, query: $query, sortKey: $sortKey, reverse: $reverse) {
        edges {
          node {
            ${PRODUCT_FIELDS}
          }
        }
      }
    }
  `;

  const { data, errors } = await shopifyFetch(gql, { first, query, sortKey, reverse });
  if (data?.products?.edges) {
    return data.products.edges.map(edge => normalizeProduct(edge.node));
  }
  return null;
}

/**
 * Fetch a single product by handle
 */
export async function getProductByHandle(handle) {
  const gql = `
    query getProductByHandle($handle: String!) {
      product(handle: $handle) {
        ${PRODUCT_FIELDS}
      }
    }
  `;

  const { data, errors } = await shopifyFetch(gql, { handle });
  if (data?.product) {
    return normalizeProduct(data.product);
  }
  return null;
}

/**
 * Search products by keyword
 */
export async function searchProducts(searchTerm, first = 12) {
  const gql = `
    query searchProducts($first: Int!, $query: String!) {
      products(first: $first, query: $query) {
        edges {
          node {
            ${PRODUCT_FIELDS}
          }
        }
      }
    }
  `;

  const { data, errors } = await shopifyFetch(gql, { first, query: searchTerm });
  if (data?.products?.edges) {
    return data.products.edges.map(edge => normalizeProduct(edge.node));
  }
  return null;
}

/**
 * Fetch products from a specific Shopify collection
 */
export async function getProductsByCollection(collectionHandle, { first = 24, sortKey = 'BEST_SELLING', reverse = false } = {}) {
  const gql = `
    query getProductsByCollection($handle: String!, $first: Int!, $sortKey: ProductCollectionSortKeys, $reverse: Boolean) {
      collection(handle: $handle) {
        id
        title
        handle
        products(first: $first, sortKey: $sortKey, reverse: $reverse) {
          edges {
            node {
              ${PRODUCT_FIELDS}
            }
          }
        }
      }
    }
  `;

  const { data } = await shopifyFetch(gql, { handle: collectionHandle, first, sortKey, reverse });
  if (data?.collection?.products?.edges) {
    return data.collection.products.edges.map(edge => normalizeProduct(edge.node));
  }
  return null;
}

/**
 * Normalizes a Shopify Collection node
 */
export function normalizeCollection(node) {
  if (!node) return null;
  return {
    id: node.id,
    shopifyId: node.id,
    title: node.title,
    handle: node.handle,
    description: node.description || '',
    image: node.image?.url || null
  };
}

/**
 * Fetch all Collections available in Shopify
 */
export async function getCollections(first = 50) {
  const gql = `
    query getCollections($first: Int!) {
      collections(first: $first) {
        edges {
          node {
            id
            title
            handle
            description
            image {
              url
              altText
            }
          }
        }
      }
    }
  `;

  const { data } = await shopifyFetch(gql, { first });
  if (data?.collections?.edges) {
    return data.collections.edges.map(edge => normalizeCollection(edge.node));
  }
  return null;
}

/* ==============================================================================
   SHOPIFY CART API MUTATIONS
   ============================================================================== */

/**
 * Create a new Shopify Cart
 */
export async function createCart(lines = []) {
  const gql = `
    mutation cartCreate($input: CartInput!) {
      cartCreate(input: $input) {
        cart {
          ${CART_FIELDS}
        }
        userErrors {
          field
          message
        }
      }
    }
  `;

  const input = {
    lines: lines.map(l => ({
      merchandiseId: l.variantId,
      quantity: l.quantity || 1
    }))
  };

  const { data, errors } = await shopifyFetch(gql, { input });
  if (data?.cartCreate?.cart) {
    return normalizeCart(data.cartCreate.cart);
  }
  return null;
}

/**
 * Retrieve an existing Shopify Cart by ID
 */
export async function getCart(cartId) {
  if (!cartId) return null;

  const gql = `
    query getCart($id: ID!) {
      cart(id: $id) {
        ${CART_FIELDS}
      }
    }
  `;

  const { data } = await shopifyFetch(gql, { id: cartId });
  if (data?.cart) {
    return normalizeCart(data.cart);
  }
  return null;
}

/**
 * Add items to an existing Shopify Cart
 */
export async function addCartLines(cartId, lines) {
  const gql = `
    mutation cartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!) {
      cartLinesAdd(cartId: $cartId, lines: $lines) {
        cart {
          ${CART_FIELDS}
        }
        userErrors {
          field
          message
        }
      }
    }
  `;

  const formattedLines = lines.map(l => ({
    merchandiseId: l.variantId,
    quantity: l.quantity || 1
  }));

  const { data } = await shopifyFetch(gql, { cartId, lines: formattedLines });
  if (data?.cartLinesAdd?.cart) {
    return normalizeCart(data.cartLinesAdd.cart);
  }
  return null;
}

/**
 * Update line item quantities in Shopify Cart
 */
export async function updateCartLines(cartId, lines) {
  const gql = `
    mutation cartLinesUpdate($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
      cartLinesUpdate(cartId: $cartId, lines: $lines) {
        cart {
          ${CART_FIELDS}
        }
        userErrors {
          field
          message
        }
      }
    }
  `;

  const formattedLines = lines.map(l => ({
    id: l.lineId,
    quantity: l.quantity
  }));

  const { data } = await shopifyFetch(gql, { cartId, lines: formattedLines });
  if (data?.cartLinesUpdate?.cart) {
    return normalizeCart(data.cartLinesUpdate.cart);
  }
  return null;
}

/**
 * Remove line items from Shopify Cart
 */
export async function removeCartLines(cartId, lineIds) {
  const gql = `
    mutation cartLinesRemove($cartId: ID!, $lineIds: [ID!]!) {
      cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
        cart {
          ${CART_FIELDS}
        }
        userErrors {
          field
          message
        }
      }
    }
  `;

  const { data } = await shopifyFetch(gql, { cartId, lineIds });
  if (data?.cartLinesRemove?.cart) {
    return normalizeCart(data.cartLinesRemove.cart);
  }
  return null;
}

/**
 * Apply discount code to Shopify Cart
 */
export async function applyCartDiscount(cartId, discountCodes) {
  const gql = `
    mutation cartDiscountCodesUpdate($cartId: ID!, $discountCodes: [String!]) {
      cartDiscountCodesUpdate(cartId: $cartId, discountCodes: $discountCodes) {
        cart {
          ${CART_FIELDS}
        }
        userErrors {
          field
          message
        }
      }
    }
  `;

  const { data } = await shopifyFetch(gql, { cartId, discountCodes });
  if (data?.cartDiscountCodesUpdate?.cart) {
    return normalizeCart(data.cartDiscountCodesUpdate.cart);
  }
  return null;
}
