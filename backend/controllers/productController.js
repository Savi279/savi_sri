const products = [
  {
    id: 1,
    title: "Floral Bloom Essence",
    description: "Beautiful floral patterns perfect for casual wear with intricate embroidery",
    price: "₹1299",
    category: "Short",
    image: "/assests/Images/varsham.jpg",
    rating: 5,
    views: 124
  },
  {
    id: 2,
    title: "Embroidered Elegance",
    description: "Delicate embroidery with modern cut and premium cotton fabric",
    price: "₹1599",
    category: "Short",
    image: "/assests/Images/varsham.jpg",
    rating: 4,
    views: 98
  },
  {
    id: 3,
    title: "Royal Radiance",
    description: "Long royal kurti with zardosi thread work and elegant drape",
    price: "₹1999",
    category: "Long",
    image: "/assests/Images/love.jpeg",
    rating: 5,
    views: 150
  },
  {
    id: 4,
    title: "Elegance Trail",
    description: "Full-length kurti with floral prints and a soft flowing hem",
    price: "₹1799",
    category: "Long",
    image: "/assests/Images/love.jpeg",
    rating: 3,
    views: 75
  },
  {
    id: 5,
    title: "Anarkali Aura",
    description: "Graceful Anarkali kurti with sequin embroidery and churidar sleeves",
    price: "₹2199",
    category: "Anarkali",
    image: "/assests/Images/sunflower.jpeg",
    rating: 4,
    views: 110
  },
  {
    id: 6,
    title: "Twilight Tradition",
    description: "Classic Anarkali cut with gold foil prints and pastel tones",
    price: "₹2099",
    category: "Anarkali",
    image: "/assests/Images/sunflower.jpeg",
    rating: 5,
    views: 130
  }
];

exports.getProducts = (req, res) => {
  res.json(products);
};

exports.incrementView = (req, res) => {
  const productId = parseInt(req.params.id);
  const product = products.find(p => p.id === productId);
  if (product) {
    product.views += 1;
    res.json({ success: true, views: product.views });
  } else {
    res.status(404).json({ success: false, message: 'Product not found' });
  }
};
