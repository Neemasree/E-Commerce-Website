const mongoose = require("mongoose");
const Product = require("./models/Product");
require("dotenv").config();

const vegetables = [
  {
    name: "Fresh Tomatoes",
    price: 40,
    offerPrice: 35,
    image: "https://media.istockphoto.com/id/1095798054/photo/fresh-tomatoes-in-a-box.webp?a=1&b=1&s=612x612&w=0&k=20&c=UVnVRQ0TfdTL4Y_E5HVhpAJUxk4oZ1r9ny8atZbm-D8=",
    stock: 100,
    description: "Fresh juicy tomatoes",
  },
  {
    name: "Organic Carrots",
    price: 30,
    offerPrice: 25,
    image: "https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=400&h=400&fit=crop",
    stock: 80,
    description: "Organic carrots",
  },
  {
    name: "Fresh Spinach",
    price: 25,
    offerPrice: 20,
    image: "https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=400&h=400&fit=crop",
    stock: 60,
    description: "Fresh spinach leaves",
  },
  {
    name: "Bell Peppers",
    price: 60,
    offerPrice: 50,
    image: "https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?w=400&h=400&fit=crop",
    stock: 45,
    description: "Colorful bell peppers",
  },
  {
    name: "Fresh Broccoli",
    price: 80,
    offerPrice: 70,
    image: "https://images.unsplash.com/photo-1459411621453-7b03977f4bfc?w=400&h=400&fit=crop",
    stock: 35,
    description: "Fresh broccoli",
  },
  {
    name: "Red Onions",
    price: 35,
    offerPrice: 30,
    image: "https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?w=400&h=400&fit=crop",
    stock: 90,
    description: "Fresh red onions",
  },
];

const dairy = [
  {
    name: "Fresh Milk",
    price: 60,
    offerPrice: 55,
    image: "https://images.unsplash.com/photo-1550583724-b2692b85b150?w=400&h=400&fit=crop",
    stock: 50,
    description: "Fresh whole milk",
  },
  {
    name: "Greek Yogurt",
    price: 120,
    offerPrice: 100,
    image: "https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400&h=400&fit=crop",
    stock: 30,
    description: "Creamy Greek yogurt",
  },
  {
    name: "Cheddar Cheese",
    price: 200,
    offerPrice: 180,
    image: "https://images.unsplash.com/photo-1452195100486-9cc805987862?w=400&h=400&fit=crop",
    stock: 25,
    description: "Aged cheddar cheese",
  },
  {
    name: "Fresh Butter",
    price: 150,
    offerPrice: 140,
    image: "https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?w=400&h=400&fit=crop",
    stock: 40,
    description: "Creamy fresh butter",
  },
  {
    name: "Cottage Cheese",
    price: 80,
    offerPrice: 75,
    image: "https://images.unsplash.com/photo-1628088062854-d1870b4553da?w=400&h=400&fit=crop",
    stock: 35,
    description: "Fresh cottage cheese",
  },
  {
    name: "Paneer",
    price: 180,
    offerPrice: 160,
    image: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=400&h=400&fit=crop",
    stock: 30,
    description: "Fresh paneer",
  },
];

const fruits = [
  {
    name: "Fresh Apples",
    price: 120,
    offerPrice: 100,
    image: "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=400&h=400&fit=crop",
    stock: 70,
    description: "Crisp fresh apples",
  },
  {
    name: "Ripe Bananas",
    price: 50,
    offerPrice: 45,
    image: "https://images.unsplash.com/photo-1603833665858-e61d17a86224?w=400&h=400&fit=crop",
    stock: 85,
    description: "Sweet ripe bananas",
  },
  {
    name: "Fresh Oranges",
    price: 80,
    offerPrice: 70,
    image: "https://images.unsplash.com/photo-1547514701-42782101795e?w=400&h=400&fit=crop",
    stock: 60,
    description: "Juicy oranges",
  },
  {
    name: "Sweet Mangoes",
    price: 150,
    offerPrice: 130,
    image: "https://images.unsplash.com/photo-1601493700631-2b16ec4b4716?w=400&h=400&fit=crop",
    stock: 40,
    description: "Sweet mangoes",
  },
  {
    name: "Fresh Grapes",
    price: 90,
    offerPrice: 80,
    image: "https://media.istockphoto.com/id/171151560/photo/black-grapes.webp?a=1&b=1&s=612x612&w=0&k=20&c=ZJ3Q_A-S9DsiGgw_4fvIgaAcDVzFoEnY5VNmd3xh6zg=",
    stock: 55,
    description: "Sweet grapes",
  },
  {
    name: "Strawberries",
    price: 200,
    offerPrice: 180,
    image: "https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=400&h=400&fit=crop",
    stock: 35,
    description: "Fresh strawberries",
  },
];

const beverages = [
  {
    name: "Orange Juice",
    price: 80,
    offerPrice: 70,
    image: "https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=400&h=400&fit=crop",
    stock: 50,
    description: "Fresh orange juice",
  },
  {
    name: "Apple Juice",
    price: 75,
    offerPrice: 65,
    image: "https://media.istockphoto.com/id/1799497395/photo/apple-juice.webp?a=1&b=1&s=612x612&w=0&k=20&c=eq07sibK2A-_z4qM5nIqTRK59CCMXlv1YfpwPA1L3TY=",
    stock: 45,
    description: "Fresh apple juice",
  },
  {
    name: "Coconut Water",
    price: 50,
    offerPrice: 45,
    image: "https://plus.unsplash.com/premium_photo-1726718479272-10d3a9670cd3?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8Y29jb251dCUyMHdhdGVyfGVufDB8fDB8fHww",
    stock: 60,
    description: "Natural coconut water",
  },
  {
    name: "Green Tea",
    price: 120,
    offerPrice: 110,
    image: "https://plus.unsplash.com/premium_photo-1694540110881-84add98c0a75?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8Z3JlZW4lMjB0ZWF8ZW58MHx8MHx8fDA%3D",
    stock: 70,
    description: "Premium green tea",
  },
  {
    name: "Coffee Beans",
    price: 300,
    offerPrice: 280,
    image: "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=400&h=400&fit=crop",
    stock: 50,
    description: "Roasted coffee beans",
  },
  {
    name: "Mineral Water",
    price: 20,
    offerPrice: 18,
    image: "https://images.unsplash.com/photo-1548839140-29a749e1cf4d?w=400&h=400&fit=crop",
    stock: 100,
    description: "Pure mineral water",
  },
];

const grains = [
  {
    name: "Basmati Rice",
    price: 200,
    offerPrice: 180,
    image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&h=400&fit=crop",
    stock: 100,
    description: "Premium basmati rice",
  },
  {
    name: "Whole Wheat Flour",
    price: 80,
    offerPrice: 75,
    image: "https://media.istockphoto.com/id/162603261/photo/7-grain-whole-wheat-berries-grounded-into-a-fine-powder.webp?a=1&b=1&s=612x612&w=0&k=20&c=j2j7WgznZkIJDxP82oa4JFpTdlA79UW_ogkwYoFwfZY=",
    stock: 80,
    description: "Whole wheat flour",
  },
  {
    name: "Oats",
    price: 120,
    offerPrice: 110,
    image: "https://images.unsplash.com/photo-1614961233913-a5113a4a34ed?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8b2F0c3xlbnwwfHwwfHx8MA%3D%3D",
    stock: 60,
    description: "Rolled oats",
  },
  {
    name: "Quinoa",
    price: 300,
    offerPrice: 280,
    image: "https://media.istockphoto.com/id/1298922591/photo/cooked-quinoa-in-a-cast-iron-pan-on-rustic-wooden-table.webp?a=1&b=1&s=612x612&w=0&k=20&c=dufs_his63vnRRy0_9V-pxubhN8hsnqtmRalEdSIHrI=",
    stock: 40,
    description: "Organic quinoa",
  },
  {
    name: "Corn Flakes",
    price: 150,
    offerPrice: 140,
    image: "https://media.istockphoto.com/id/1456173516/photo/yellow-color-indian-spicy-snack-namkeen-mixture-with-fried-cornflakes.webp?a=1&b=1&s=612x612&w=0&k=20&c=mC6pmyUXXU8GPHQJeE42hgD7yXDQxccJIXqW1_se1b0=",
    stock: 60,
    description: "Crispy corn flakes",
  },
  {
    name: "Pasta",
    price: 120,
    offerPrice: 110,
    image: "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cGFzdGF8ZW58MHx8MHx8fDA%3D",
    stock: 70,
    description: "Durum wheat pasta",
  },
];

const products = [
  ...vegetables.map((p) => ({
    ...p,
    category: "vegetables",
    images: [p.image],
  })),
  ...dairy.map((p) => ({ ...p, category: "dairy", images: [p.image] })),
  ...fruits.map((p) => ({ ...p, category: "fruits", images: [p.image] })),
  ...beverages.map((p) => ({ ...p, category: "beverages", images: [p.image] })),
  ...grains.map((p) => ({ ...p, category: "grains", images: [p.image] })),
];

const seedDatabase = async () => {
  try {
    await mongoose.connect(
      process.env.MONGO_URI || "mongodb://localhost:27017/grocery_db"
    );
    console.log("Connected to MongoDB");
    await Product.deleteMany({});
    console.log("Cleared existing products");
    await Product.insertMany(products);
    console.log(`Seeded ${products.length} products (6 per category)`);
    process.exit(0);
  } catch (error) {
    console.error("Error:", error);
    process.exit(1);
  }
};

seedDatabase();