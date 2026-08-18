/**
 * Shugroves Emporium - Official Product Catalog Dataset
 * Curated luxury fashion with authentic earthy palettes (raw linens, vegetal dyes, organic tailoring).
 */

export const INITIAL_PRODUCTS = [
  {
    id: "shu-001",
    name: "Sienna Raw Linen Coat",
    slug: "sienna-raw-linen-coat",
    description: "An unstructured, single-breasted coat crafted from heavy unbleached Belgian linen. Naturally dyed with madder root to achieve its signature dusty terracotta tone. Features horn buttons and deep patch pockets.",
    price: 14800,
    salePrice: null,
    currency: "INR",
    category: "clothing",
    subcategory: "coats",
    brand: "Shugroves Atelier",
    material: "100% Belgian Flax Linen",
    color: "Dusty Terracotta",
    availableColors: ["Dusty Terracotta", "Raw Oatmeal", "Washed Olive"],
    availableSizes: ["XS", "S", "M", "L", "XL"],
    variants: [
      { size: "XS", color: "Dusty Terracotta", stock: 3, sku: "SHU-COAT-001-XS" },
      { size: "S", color: "Dusty Terracotta", stock: 7, sku: "SHU-COAT-001-S" },
      { size: "M", color: "Dusty Terracotta", stock: 5, sku: "SHU-COAT-001-M" },
      { size: "L", color: "Dusty Terracotta", stock: 2, sku: "SHU-COAT-001-L" },
      { size: "XL", color: "Dusty Terracotta", stock: 0, sku: "SHU-COAT-001-XL" } // out of stock demo
    ],
    images: [
      "https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=1000&q=85",
      "https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&w=1000&q=85",
      "https://images.unsplash.com/photo-1485968579580-b6d095142e6e?auto=format&fit=crop&w=1000&q=85"
    ],
    thumbnail: "https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=600&q=85",
    status: "active",
    isFeatured: true,
    isTrending: true,
    isBestseller: true,
    isNewArrival: false,
    tags: ["linen", "outerwear", "terracotta", "slow-fashion", "autumn-winter"],
    details: [
      "Relaxed, dropped-shoulder silhouette",
      "Unlined with bound interior French seams",
      "Sustainably harvested corozo nut buttons",
      "Natural vegetal garment dye"
    ],
    care: "Dry clean or gentle hand wash cold with pH-neutral soap. Lay flat in shade to dry.",
    shipping: "Complimentary slow-crafted packaging on all domestic orders. Dispatched within 24-48 hours.",
    returns: "Complimentary 30-day returns and exchanges in original, unwashed condition with tags attached.",
    createdDate: "2026-08-01"
  },
  {
    id: "shu-002",
    name: "Sage Meadow Oversized Knit",
    slug: "sage-meadow-oversized-knit",
    description: "Spun from undyed merino wool blended with organic olive-tinted alpaca fibers. The open tactile knit offers warmth with featherweight breathability, designed to drape fluidly over tailored trousers.",
    price: 9400,
    salePrice: 8200,
    currency: "INR",
    category: "clothing",
    subcategory: "knitwear",
    brand: "Shugroves Atelier",
    material: "70% Merino Wool, 30% Baby Alpaca",
    color: "Sage Green",
    availableColors: ["Sage Green", "Warm Sand", "Charcoal Heather"],
    availableSizes: ["XS", "S", "M", "L", "XL"],
    variants: [
      { size: "XS", color: "Sage Green", stock: 4, sku: "SHU-KNIT-002-XS" },
      { size: "S", color: "Sage Green", stock: 9, sku: "SHU-KNIT-002-S" },
      { size: "M", color: "Sage Green", stock: 12, sku: "SHU-KNIT-002-M" },
      { size: "L", color: "Sage Green", stock: 6, sku: "SHU-KNIT-002-L" },
      { size: "XL", color: "Sage Green", stock: 3, sku: "SHU-KNIT-002-XL" }
    ],
    images: [
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1000&q=85",
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1000&q=85"
    ],
    thumbnail: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=85",
    status: "active",
    isFeatured: true,
    isTrending: true,
    isBestseller: false,
    isNewArrival: true,
    tags: ["knitwear", "wool", "sage", "sustainable", "cozy"],
    details: [
      "Chunky ribbed crewneck collar and cuffs",
      "Ethically sheared, non-mulesed wool",
      "Naturally moisture-wicking and thermal regulating",
      "Hand-finished by artisanal knitters"
    ],
    care: "Hand wash in cool water with wool shampoo. Reshape and dry flat on a clean towel.",
    shipping: "Standard carbon-neutral delivery within 3-5 business days.",
    returns: "30-day complimentary return guarantee.",
    createdDate: "2026-08-05"
  },
  {
    id: "shu-003",
    name: "Unstructured Linen Trouser",
    slug: "unstructured-linen-trouser",
    description: "High-waisted wide-leg trousers cut from dense 280gsm pure flax. Designed with double front pleats, an elasticated back waistband for all-day ease, and deep side slant pockets.",
    price: 7600,
    salePrice: null,
    currency: "INR",
    category: "clothing",
    subcategory: "trousers",
    brand: "Shugroves Studio",
    material: "100% Organic European Linen",
    color: "Warm Cream",
    availableColors: ["Warm Cream", "Deep Charcoal", "Dusty Terracotta"],
    availableSizes: ["XS", "S", "M", "L", "XL"],
    variants: [
      { size: "XS", color: "Warm Cream", stock: 2, sku: "SHU-TR-003-XS" },
      { size: "S", color: "Warm Cream", stock: 8, sku: "SHU-TR-003-S" },
      { size: "M", color: "Warm Cream", stock: 10, sku: "SHU-TR-003-M" },
      { size: "L", color: "Warm Cream", stock: 4, sku: "SHU-TR-003-L" },
      { size: "XL", color: "Warm Cream", stock: 1, sku: "SHU-TR-003-XL" }
    ],
    images: [
      "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1000&q=85",
      "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1000&q=85"
    ],
    thumbnail: "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=600&q=85",
    status: "active",
    isFeatured: false,
    isTrending: true,
    isBestseller: true,
    isNewArrival: false,
    tags: ["linen", "pants", "cream", "minimal", "capsule"],
    details: [
      "High-rise with relaxed wide leg",
      "Double forward pleats",
      "Clean concealed zip and button closure",
      "Pre-washed to prevent shrinkage"
    ],
    care: "Machine wash cold gentle cycle. Warm iron or steam for an effortless relaxed drape.",
    shipping: "Dispatched within 24 hours.",
    returns: "30 days easy exchange & return.",
    createdDate: "2026-07-28"
  },
  {
    id: "shu-004",
    name: "The Sculptural Saddle Bag",
    slug: "the-sculptural-saddle-bag",
    description: "A softly curved shoulder bag handcrafted from vegetal-tanned Italian calf leather. Features custom brushed brass hardware, magnetic flap closure, and an adjustable strap for cross-body or shoulder wear.",
    price: 18200,
    salePrice: null,
    currency: "INR",
    category: "bags",
    subcategory: "shoulder bags",
    brand: "Shugroves Leatherworks",
    material: "Full-Grain Vegetal-Tanned Leather, Cotton Canvas Lining",
    color: "Dusty Terracotta",
    availableColors: ["Dusty Terracotta", "Espresso Brown", "Warm Sand"],
    availableSizes: ["One Size"],
    variants: [
      { size: "One Size", color: "Dusty Terracotta", stock: 4, sku: "SHU-BAG-004-OS" }
    ],
    images: [
      "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=1000&q=85",
      "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=1000&q=85"
    ],
    thumbnail: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=600&q=85",
    status: "active",
    isFeatured: true,
    isTrending: true,
    isBestseller: true,
    isNewArrival: true,
    tags: ["bag", "leather", "terracotta", "handbag", "artisanal"],
    details: [
      "Dimensions: 24cm W x 18cm H x 7cm D",
      "Strap drop: 45cm - 56cm (adjustable)",
      "Interior slip pocket and zip compartment",
      "Ages with a rich, unique natural patina"
    ],
    care: "Treat with natural beeswax leather balsam. Store in provided cotton dust bag.",
    shipping: "Insured express shipping in signature luxury presentation box.",
    returns: "30-day return policy.",
    createdDate: "2026-08-08"
  },
  {
    id: "shu-005",
    name: "Botanical Silk Midi Dress",
    slug: "botanical-silk-midi-dress",
    description: "An ethereal wrap silhouette rendered in organic peace silk. Hand-dyed using pomegranate peel and marigold blossoms to achieve a radiant golden mustard hue with subtle color variation.",
    price: 16500,
    salePrice: 14200,
    currency: "INR",
    category: "clothing",
    subcategory: "dresses",
    brand: "Shugroves Atelier",
    material: "100% Organic Ahimsa (Peace) Silk",
    color: "Mustard Gold",
    availableColors: ["Mustard Gold", "Muted Rose", "Raw Ecru"],
    availableSizes: ["XS", "S", "M", "L"],
    variants: [
      { size: "XS", color: "Mustard Gold", stock: 2, sku: "SHU-DRS-005-XS" },
      { size: "S", color: "Mustard Gold", stock: 5, sku: "SHU-DRS-005-S" },
      { size: "M", color: "Mustard Gold", stock: 4, sku: "SHU-DRS-005-M" },
      { size: "L", color: "Mustard Gold", stock: 0, sku: "SHU-DRS-005-L" }
    ],
    images: [
      "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&w=1000&q=85",
      "https://images.unsplash.com/photo-1509967419530-da38b4704bc6?auto=format&fit=crop&w=1000&q=85"
    ],
    thumbnail: "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&w=600&q=85",
    status: "active",
    isFeatured: true,
    isTrending: false,
    isBestseller: true,
    isNewArrival: false,
    tags: ["dress", "silk", "mustard", "botanical", "occasion"],
    details: [
      "Self-tie wrap waist for a customized fit",
      "Subtle flutter sleeves with bias-cut hem",
      "Natural non-toxic botanical dye process",
      "Breathable and skin-kind"
    ],
    care: "Dry clean or delicate hand wash with mild silk cleanser in cold water.",
    shipping: "Dispatched in 2 business days.",
    returns: "Complimentary returns within 30 days.",
    createdDate: "2026-07-20"
  },
  {
    id: "shu-006",
    name: "The Slouchy Suede Tote",
    slug: "the-slouchy-suede-tote",
    description: "An unstructured everyday carry-all in velvety olive-sage suede. Spacious enough to hold a 15-inch laptop, a warm knit, and daily essentials with effortless elegance.",
    price: 15400,
    salePrice: null,
    currency: "INR",
    category: "bags",
    subcategory: "tote bags",
    brand: "Shugroves Leatherworks",
    material: "Suede Leather, Raw Canvas Lining",
    color: "Sage Green",
    availableColors: ["Sage Green", "Warm Sand", "Charcoal"],
    availableSizes: ["One Size"],
    variants: [
      { size: "One Size", color: "Sage Green", stock: 6, sku: "SHU-BAG-006-OS" }
    ],
    images: [
      "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=1000&q=85",
      "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=1000&q=85"
    ],
    thumbnail: "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=600&q=85",
    status: "active",
    isFeatured: false,
    isTrending: true,
    isBestseller: false,
    isNewArrival: true,
    tags: ["bags", "tote", "suede", "sage", "everyday"],
    details: [
      "Dimensions: 42cm W x 36cm H x 14cm D",
      "Internal brass zip pocket for valuables",
      "Magnetic top closure",
      "Double reinforced shoulder straps"
    ],
    care: "Protect with water-repellent suede spray. Brush gently with a suede brush.",
    shipping: "Standard domestic shipping included.",
    returns: "30-day exchange window.",
    createdDate: "2026-08-10"
  },
  {
    id: "shu-007",
    name: "Artisanal Woven Mule",
    slug: "artisanal-woven-mule",
    description: "Handcrafted in limited batches by multi-generational cordwainers. Features hand-woven natural raffia uppers with a padded vegetable-tanned leather insole and a stacked wooden kitten heel.",
    price: 11200,
    salePrice: null,
    currency: "INR",
    category: "shoes",
    subcategory: "mules",
    brand: "Shugroves Footwear",
    material: "Natural Raffia, Calf Leather Insole, Solid Beech Heel",
    color: "Natural Ecru",
    availableColors: ["Natural Ecru", "Espresso"],
    availableSizes: ["36", "37", "38", "39", "40", "41"],
    variants: [
      { size: "36", color: "Natural Ecru", stock: 3, sku: "SHU-SH-007-36" },
      { size: "37", color: "Natural Ecru", stock: 5, sku: "SHU-SH-007-37" },
      { size: "38", color: "Natural Ecru", stock: 8, sku: "SHU-SH-007-38" },
      { size: "39", color: "Natural Ecru", stock: 4, sku: "SHU-SH-007-39" },
      { size: "40", color: "Natural Ecru", stock: 2, sku: "SHU-SH-007-40" },
      { size: "41", color: "Natural Ecru", stock: 0, sku: "SHU-SH-007-41" }
    ],
    images: [
      "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=1000&q=85",
      "https://images.unsplash.com/photo-1560769629-975ec94e6a86?auto=format&fit=crop&w=1000&q=85"
    ],
    thumbnail: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=600&q=85",
    status: "active",
    isFeatured: true,
    isTrending: false,
    isBestseller: true,
    isNewArrival: false,
    tags: ["shoes", "mules", "raffia", "heels", "summer"],
    details: [
      "Heel height: 4.5cm (1.8 inches)",
      "Cushioned memory-foam insole",
      "Non-slip leather outsole",
      "Hand-braided artisanal finish"
    ],
    care: "Wipe clean with a dry soft cloth. Keep away from excessive moisture.",
    shipping: "Ships with protective dust bags in recycled luxury footwear box.",
    returns: "Try on carpeted surfaces for 30-day exchange.",
    createdDate: "2026-07-15"
  },
  {
    id: "shu-008",
    name: "Hammered Brass Choker & Earrings",
    slug: "hammered-brass-choker-earrings",
    description: "Organic, sculptural jewelry cast from recycled brass and hand-beaten with hammer textures that catch ambient light like sun on water. Dipped in a satin 18k gold vermeil finish.",
    price: 6200,
    salePrice: 5400,
    currency: "INR",
    category: "accessories",
    subcategory: "jewellery",
    brand: "Shugroves Metals",
    material: "Recycled Brass with 18k Satin Gold Vermeil",
    color: "Muted Gold",
    availableColors: ["Muted Gold", "Antique Silver"],
    availableSizes: ["One Size"],
    variants: [
      { size: "One Size", color: "Muted Gold", stock: 9, sku: "SHU-JW-008-OS" }
    ],
    images: [
      "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=1000&q=85",
      "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=1000&q=85"
    ],
    thumbnail: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=600&q=85",
    status: "active",
    isFeatured: false,
    isTrending: true,
    isBestseller: true,
    isNewArrival: true,
    tags: ["accessories", "jewellery", "gold", "brass", "sculptural"],
    details: [
      "Hypoallergenic sterling silver ear posts",
      "Hand-hammered organic curves",
      "Lightweight for all-day comfort",
      "Packaged in keepsake linen jewelry pouch"
    ],
    care: "Avoid contact with perfumes and water. Polish gently with included microfiber cloth.",
    shipping: "Express complimentary courier.",
    returns: "Unworn 30-day exchange policy.",
    createdDate: "2026-08-12"
  }
];
