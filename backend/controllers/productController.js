const products = [
  {
    id: 1,
    title: "Floral Bloom Essence",
    description: "Beautiful floral patterns perfect for casual wear with intricate embroidery",
    story: "Inspired by the vibrant colors of spring gardens, this piece captures the essence of blooming flowers in every stitch. Each pattern tells a story of nature's beauty and feminine grace.",
    price: "1299",
    category: "Short",
    images: ["/images/varsham.jpg", "/images/varsham.jpg", "/images/varsham.jpg"],
    views: 0,
    rating: 0,
    reviews: 0,
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    material: "100% Premium Cotton with Silk Thread Embroidery",
    care: "Hand wash cold separately, Do not bleach, Dry in shade, Iron on reverse"
  },
  {
    id: 2,
    title: "Embroidered Elegance",
    description: "Delicate embroidery with modern cut and premium cotton fabric",
    story: "A perfect blend of traditional craftsmanship and contemporary design. This piece represents hours of meticulous handwork by skilled artisans, bringing you timeless elegance.",
    price: "1599",
    category: "Short",
    images: ["/images/varsham.jpg", "/images/varsham.jpg", "/images/varsham.jpg"],
    views: 0,
    rating: 0,
    reviews: 0,
    sizes: ["XS", "S", "M", "L", "XL"],
    material: "Premium Cotton Blend with Zari Embroidery",
    care: "Dry clean recommended, Hand wash gentle cycle, Do not tumble dry"
  },
  {
    id: 3,
    title: "Royal Radiance",
    description: "Long royal kurti with zardosi thread work and elegant drape",
    story: "Regal and majestic, this piece draws inspiration from royal Indian heritage. The intricate zardosi work reflects the grandeur of palace courts and timeless traditions.",
    price: "1999",
    category: "Long",
    images: ["/images/love.jpeg", "/images/love.jpeg", "/images/love.jpeg"],
    views: 0,
    rating: 0,
    reviews: 0,
    sizes: ["S", "M", "L", "XL", "XXL"],
    material: "Pure Georgette with Gold Zardosi Work",
    care: "Dry clean only, Store in cool dry place, Steam iron recommended"
  },
  {
    id: 4,
    title: "Elegance Trail",
    description: "Full-length kurti with floral prints and a soft flowing hem",
    story: "Flowing like a gentle breeze, this piece embodies effortless grace. The soft floral prints dance across the fabric, creating a mesmerizing trail of beauty.",
    price: "1799",
    category: "Long",
    mainImage: "/images/love.jpeg",
    images: ["/images/love.jpeg", "/images/love.jpeg", "/images/love.jpeg"],
    views: 0,
    rating: 0,
    reviews: 0,
    sizes: ["XS", "S", "M", "L", "XL"],
    material: "Soft Rayon with Digital Floral Prints",
    care: "Machine wash cold, Gentle cycle, Hang to dry, Cool iron if needed"
  },
  {
    id: 5,
    title: "Anarkali Aura",
    description: "Graceful Anarkali kurti with sequin embroidery and churidar sleeves",
    story: "Step into the world of timeless Mughal elegance. This Anarkali silhouette has been crafted to make you feel like royalty, with every sequin catching the light beautifully.",
    price: "2199",
    category: "Anarkali",
    mainImage: "/images/sunflower.jpeg",
    images: ["/images/sunflower.jpeg", "/images/sunflower.jpeg", "/images/sunflower.jpeg"],
    views: 0,
    rating: 0,
    reviews: 0,
    sizes: ["S", "M", "L", "XL", "XXL"],
    material: "Silk Blend with Sequin and Thread Work",
    care: "Dry clean only, Handle with care, Store on hanger"
  },
  {
    id: 6,
    title: "Twilight Tradition",
    description: "Classic Anarkali cut with gold foil prints and pastel tones",
    story: "Where tradition meets twilight dreams. The soft pastel hues combined with gold foil prints create a magical effect that's perfect for evening occasions.",
    price: "2099",
    category: "Anarkali",
    mainImage: "/images/sunflower.jpeg",
    images: ["/images/sunflower.jpeg", "/images/sunflower.jpeg", "/images/sunflower.jpeg"],
    views: 0,
    rating: 0,
    reviews: 0,
    sizes: ["XS", "S", "M", "L", "XL"],
    material: "Chiffon with Gold Foil Printing",
    care: "Hand wash gently, Do not wring, Dry in shade, Light steam iron"
  }
];

exports.getProducts = (req, res) => {
  res.json(products);
};

exports.getProductById = (req, res) => {
  const productId = parseInt(req.params.id);
  const product = products.find(p => p.id === productId);
  if (product) {
    res.json(product);
  } else {
    res.status(404).json({ success: false, message: 'Product not found' });
  }
};

exports.incrementView = (req, res) => {
  const productId = parseInt(req.params.id);
  const product = products.find(p => p.id === productId);
  if (product) {
    product.views += 1;
    res.json({ success: true, views: product.views });
  } else {
    res.status(404).json({ success: false, message: 'Product not found' });
  };
};
