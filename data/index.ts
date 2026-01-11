import { Category, Product, FAQItem } from "@/types";

export const categories: Category[] = [
  {
    id: "1",
    name: "Floor Mats",
    slug: "floor-mats",
    description: "Premium 7D & 9D floor mats for all car models",
    image:
      "https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=800&h=600&fit=crop",
    productCount: 12,
  },
  {
    id: "2",
    name: "Seat Covers",
    slug: "seat-covers",
    description: "High-quality leather and fabric seat covers",
    image:
      "https://images.unsplash.com/photo-1613234596566-2190b5a80af7?w=800&h=600&fit=crop",
    productCount: 18,
  },
  {
    id: "3",
    name: "Steering Covers",
    slug: "steering-covers",
    description: "Comfortable and stylish steering wheel covers",
    image:
      "https://images.unsplash.com/photo-1617531653520-bd6d568b32ca?w=800&h=600&fit=crop",
    productCount: 8,
  },
  {
    id: "4",
    name: "Car Care",
    slug: "car-care",
    description: "Premium car cleaning and maintenance products",
    image:
      "https://images.unsplash.com/photo-1607860108855-64acf2078ed9?w=800&h=600&fit=crop",
    productCount: 15,
  },
  {
    id: "5",
    name: "Interior Accessories",
    slug: "interior-accessories",
    description: "Enhance your car's interior with premium accessories",
    image:
      "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=800&h=600&fit=crop",
    productCount: 22,
  },
  {
    id: "6",
    name: "Exterior Accessories",
    slug: "exterior-accessories",
    description: "Stylish exterior upgrades for your vehicle",
    image:
      "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&h=600&fit=crop",
    productCount: 10,
  },
];

export const products: Product[] = [
  {
    id: "1",
    name: "Premium 7D Floor Mats - Honda Civic",
    slug: "premium-7d-floor-mats-honda-civic",
    description:
      "Luxurious 7D floor mats specifically designed for Honda Civic. Features anti-slip backing, waterproof material, and easy-to-clean surface. Perfect fit guaranteed.",
    price: 8500,
    originalPrice: 12000,
    category: "floor-mats",
    image:
      "https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=800&h=600&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=800&h=600&fit=crop",
    ],
    inStock: true,
    featured: true,
    badge: "Best Seller",
  },
  {
    id: "2",
    name: "Luxury 9D Floor Mats - Toyota Corolla",
    slug: "luxury-9d-floor-mats-toyota-corolla",
    description:
      "Top-of-the-line 9D floor mats for Toyota Corolla with enhanced cushioning and premium finish. Waterproof, durable, and designed for perfect fit.",
    price: 10500,
    originalPrice: 14000,
    category: "floor-mats",
    image:
      "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&h=600&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=800&h=600&fit=crop",
    ],
    inStock: true,
    featured: true,
    badge: "Premium",
  },
  {
    id: "3",
    name: "Leather Seat Covers - Universal",
    slug: "leather-seat-covers-universal",
    description:
      "High-quality PU leather seat covers suitable for most car models. Breathable, comfortable, and adds a premium look to your car interior.",
    price: 15000,
    category: "seat-covers",
    image:
      "https://images.unsplash.com/photo-1613234596566-2190b5a80af7?w=800&h=600&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1613234596566-2190b5a80af7?w=800&h=600&fit=crop",
    ],
    inStock: true,
    featured: true,
  },
  {
    id: "4",
    name: "Breathable Fabric Seat Covers",
    slug: "breathable-fabric-seat-covers",
    description:
      "Premium fabric seat covers with excellent breathability. Perfect for hot climates, available in multiple colors.",
    price: 12000,
    category: "seat-covers",
    image:
      "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=800&h=600&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=800&h=600&fit=crop",
    ],
    inStock: true,
  },
  {
    id: "5",
    name: "Carbon Fiber Steering Cover",
    slug: "carbon-fiber-steering-cover",
    description:
      "Stylish carbon fiber pattern steering wheel cover. Provides excellent grip and adds a sporty touch to your interior.",
    price: 2500,
    category: "steering-covers",
    image:
      "https://images.unsplash.com/photo-1617531653520-bd6d568b32ca?w=800&h=600&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1617531653520-bd6d568b32ca?w=800&h=600&fit=crop",
    ],
    inStock: true,
    featured: true,
  },
  {
    id: "6",
    name: "Premium Leather Steering Cover",
    slug: "premium-leather-steering-cover",
    description:
      "Genuine leather steering wheel cover for a luxurious feel. Anti-slip texture and comfortable grip.",
    price: 3500,
    category: "steering-covers",
    image:
      "https://images.unsplash.com/photo-1617531653520-bd6d568b32ca?w=800&h=600&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1617531653520-bd6d568b32ca?w=800&h=600&fit=crop",
    ],
    inStock: true,
  },
  {
    id: "7",
    name: "Professional Car Wash Kit",
    slug: "professional-car-wash-kit",
    description:
      "Complete car wash kit including shampoo, wax, microfiber cloths, and applicators. Everything you need for a professional finish.",
    price: 4500,
    category: "car-care",
    image:
      "https://images.unsplash.com/photo-1607860108855-64acf2078ed9?w=800&h=600&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1607860108855-64acf2078ed9?w=800&h=600&fit=crop",
    ],
    inStock: true,
  },
  {
    id: "8",
    name: "Dashboard Polish & Protectant",
    slug: "dashboard-polish-protectant",
    description:
      "Premium dashboard polish that cleans, shines, and protects against UV damage. Non-greasy formula.",
    price: 1800,
    category: "car-care",
    image:
      "https://images.unsplash.com/photo-1607860108855-64acf2078ed9?w=800&h=600&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1607860108855-64acf2078ed9?w=800&h=600&fit=crop",
    ],
    inStock: true,
    featured: true,
  },
];

export const faqs: FAQItem[] = [
  {
    question: "Do you offer installation services?",
    answer:
      "Yes! We provide both in-shop installation and home service installation for your convenience. You can book our installation service through our booking page.",
  },
  {
    question: "What payment methods do you accept?",
    answer:
      "We accept Cash on Delivery (COD) and bank transfers. Online payment options will be available soon.",
  },
  {
    question: "Do you deliver across Pakistan?",
    answer:
      "Yes, we deliver nationwide. Delivery charges may vary based on your location. Contact us for specific delivery details.",
  },
  {
    question: "How long does delivery take?",
    answer:
      "For local orders, delivery typically takes 2-3 business days. For other cities, it may take 4-7 business days depending on the location.",
  },
  {
    question: "Can I return or exchange a product?",
    answer:
      "Yes, we have a 7-day return/exchange policy for unused products in original packaging. Please contact us within 7 days of receiving your order.",
  },
  {
    question: "Are the floor mats custom-fitted for specific car models?",
    answer:
      "Yes, our 7D and 9D floor mats are custom-designed for specific car models to ensure perfect fit and maximum coverage.",
  },
  {
    question: "Do you provide car repair services?",
    answer:
      "Yes, we offer comprehensive car repair and maintenance services. You can book an appointment through our booking page or contact us directly.",
  },
  {
    question: "How can I contact customer support?",
    answer:
      "You can reach us via WhatsApp, phone, or visit our contact page. Our team is available during business hours to assist you.",
  },
];
