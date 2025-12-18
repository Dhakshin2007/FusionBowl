import { Ingredient, Service, FAQItem } from './types';
import { Truck, Utensils, CalendarHeart, Leaf, Star, Sparkles, Box, ChefHat } from 'lucide-react';

export const INGREDIENTS: Ingredient[] = [
  // Fruits (Bowl Base)
  { id: 'papaya', name: 'Papaya', category: 'fruit', price: 30, calories: 43, color: 'bg-orange-400', emoji: '🥭' },
  { id: 'muskmelon', name: 'Musk Melon', category: 'fruit', price: 35, calories: 34, color: 'bg-orange-200', emoji: '🍈' },
  { id: 'watermelon', name: 'Watermelon', category: 'fruit', price: 40, calories: 30, color: 'bg-red-400', emoji: '🍉' },
  { id: 'pineapple', name: 'Pineapple', category: 'fruit', price: 48, calories: 50, color: 'bg-yellow-400', emoji: '🍍' },
  { id: 'sapota', name: 'Sapota', category: 'fruit', price: 50, calories: 83, color: 'bg-stone-500', emoji: '🥔' },
  { id: 'grapes', name: 'Grapes', category: 'fruit', price: 100, calories: 67, color: 'bg-purple-600', emoji: '🍇' },
  { id: 'pomegranate', name: 'Pomegranate', category: 'fruit', price: 200, calories: 83, color: 'bg-red-600', emoji: '🔴' },
  { id: 'apple', name: 'Apple', category: 'fruit', price: 150, calories: 52, color: 'bg-red-500', emoji: '🍎' },
  { id: 'dragonfruit', name: 'Dragon Fruit', category: 'fruit', price: 25, calories: 60, color: 'bg-pink-200', emoji: '🍥' },
  { id: 'kiwi', name: 'Kiwi', category: 'fruit', price: 50, calories: 61, color: 'bg-lime-500', emoji: '🥝' },
  { id: 'banana', name: 'Banana', category: 'fruit', price: 60, calories: 89, color: 'bg-yellow-200', emoji: '🍌' },
  { id: 'orange', name: 'Orange', category: 'fruit', price: 80, calories: 47, color: 'bg-orange-500', emoji: '🍊' },
  { id: 'guava', name: 'Guava', category: 'fruit', price: 60, calories: 68, color: 'bg-green-400', emoji: '🍏' },
  { id: 'strawberry', name: 'Strawberry', category: 'fruit', price: 400, calories: 32, color: 'bg-red-500', emoji: '🍓' },
  { id: 'mango', name: 'Mango (Seasonal)', category: 'fruit', price: 150, calories: 60, color: 'bg-yellow-500', emoji: '🥭' },

  // Vegetables (Salad Base)
  { id: 'beetroot', name: 'Beetroot', category: 'vegetable', price: 50, calories: 43, color: 'bg-pink-800', emoji: '🟣' },
  { id: 'carrot', name: 'Carrot', category: 'vegetable', price: 70, calories: 41, color: 'bg-orange-500', emoji: '🥕' },

  // Shake Items (Cold Pressed Juices)
  { id: 'juice-orange', name: 'Orange (Vitamin C Burst)', category: 'shake-item', price: 80, calories: 110, color: 'bg-orange-500', emoji: '🍊' },
  { id: 'juice-watermelon', name: 'Watermelon (Just Watermelon)', category: 'shake-item', price: 80, calories: 90, color: 'bg-red-400', emoji: '🍉' },
  { id: 'juice-beetroot', name: 'Beetroot (Red-Revive)', category: 'shake-item', price: 80, calories: 80, color: 'bg-pink-800', emoji: '🟣' },
  { id: 'juice-mango', name: 'Mango (Sip of Golden Summer)', category: 'shake-item', price: 90, calories: 150, color: 'bg-yellow-500', emoji: '🥭' },
  { id: 'juice-pineapple', name: 'Pineapple (Pineapple Bliss)', category: 'shake-item', price: 100, calories: 120, color: 'bg-yellow-400', emoji: '🍍' },
  { id: 'juice-muskmelon', name: 'Muskmelon (Golden Melon)', category: 'shake-item', price: 100, calories: 100, color: 'bg-orange-200', emoji: '🍈' },
  { id: 'juice-carrot', name: 'Carrot (Carrot Powerhouse)', category: 'shake-item', price: 110, calories: 95, color: 'bg-orange-600', emoji: '🥕' },
  { id: 'juice-abc', name: 'ABC (ABC Goodness)', category: 'shake-item', price: 130, calories: 110, color: 'bg-red-700', emoji: '🥤' },
  { id: 'juice-apple', name: 'Apple (Apple-Solutely Healthy)', category: 'shake-item', price: 130, calories: 120, color: 'bg-red-500', emoji: '🍎' },
  { id: 'juice-pomegranate', name: 'Pomegranate (The Pomegranate Punch)', category: 'shake-item', price: 150, calories: 140, color: 'bg-red-800', emoji: '🔴' },
];

export const SUB_MENU_ITEMS: Record<string, { name: string; emoji: string }[]> = {
  'Basic Fruits': [
{ name: 'Mosambi (బత్తాయి)', emoji: '🍋' },
{ name: 'Papaya (బొప్పాయి)', emoji: '🧡' },
{ name: 'Muskmelon (ఖర్బూజ)', emoji: '🍈' },
{ name: 'Watermelon (పుచ్చకాయ)', emoji: '🍉' },
{ name: 'Guava (జామకాయ)', emoji: '🍏' },
{ name: 'Sapota (సపోటా / చీకూ)', emoji: '🍐' },
{ name: 'Orange (నారింజ)', emoji: '🍊' },
{ name: 'Pineapple (అనాస)', emoji: '🍍' },
{ name: 'Grapes (ద్రాక్ష)', emoji: '🍇' },
{ name: 'Mango (మామిడి)', emoji: '🥭' }


  ],
  'Premium Fruits': [
{ name: 'Jamun (నేరేడు పండు)', emoji: '🫐' },
{ name: 'Pomegranate (దానిమ్మ)', emoji: '🔴' },
{ name: 'Apple (ఆపిల్)', emoji: '🍎' },
{ name: 'Pears (పియర్)', emoji: '🍐' },
{ name: 'StarFruit (కమరకాయ)', emoji: '⭐' },
{ name: 'Red Globe Grapes (ఎర్ర ద్రాక్ష)', emoji: '🍇' },
{ name: 'Plums (ప్లమ్)', emoji: '🍑' },
{ name: 'JackFruit (పనసకాయ)', emoji: '' },
{ name: 'Pink Dragon (పింక్ డ్రాగన్ ఫ్రూట్)', emoji: '' },
{ name: 'White Dragon (వైట్ డ్రాగన్ ఫ్రూట్)', emoji: '' }

  ],
  'Exotic Fruits': [
{ name: 'Persimmon (పెర్సిమన్)', emoji: '' },
{ name: 'Kiwi (కివీ)', emoji: '🥝' },
{ name: 'Avocado (అవకాడో)', emoji: '🥑' },
{ name: 'Rambutan (రాంబుటాన్)', emoji: '' },
{ name: 'Strawberry (స్ట్రాబెర్రీ)', emoji: '🍓' },
{ name: 'Litchi (లిచీ)', emoji: '' },
{ name: 'Longan (లాంగన్)', emoji: '' },
{ name: 'Cherries (చెర్రీలు)', emoji: '🍒' },
{ name: 'Mangosteen (మాంగోస్టీన్)', emoji: '' },
{ name: 'BlueBerry (బ్లూబెర్రీ)', emoji: '🫐' },
  ],
  'Mixed Veggie': [
{ name: 'Carrot (క్యారెట్)', emoji: '🥕' },
{ name: 'Beetroot (బీట్‌రూట్)', emoji: '' },
{ name: 'Cucumber (దోసకాయ)', emoji: '🥒' },

  ],
  'Boiled Veggie': [
{ name: 'SweetCorn (స్వీట్ కార్న్)', emoji: '🌽' },
{ name: 'SweetPotato (చిలగడదుంప)', emoji: '🍠' },
  ],
  'Mixed Sprouts': [
{ name: 'Green Moong (పచ్చ పెసలు)', emoji: '🌱' },
{ name: 'Red Chowli (ఎర్ర అలసందలు)', emoji: '🫘' },
{ name: 'Channa (సెనగలు)', emoji: '🟤' },
{ name: 'Peanuts (వేరుశెనగలు)', emoji: '🥜' },
{ name: 'Chopped Carrot (తరిగిన క్యారెట్)', emoji: '🥕' },

  ],
  'Boiled Egg': [
    { name: 'Full Egg', emoji: '🥚' },
    { name: 'Egg Whites Only', emoji: '⚪' }
  ],
  'Soaked Seeds': [
    { name: 'Mahabeera (మహావీర గింజలు)', emoji: '' },
    { name: 'Pumpkin Seeds', emoji: '🎃' },
    { name: 'Flax Seeds', emoji: '🟤' },
    { name: 'Chia Seeds', emoji: '⚫' }
  ],
  'Mixed Dry Fruit Set': [
{ name: 'Badam (బాదం)', emoji: '' },
{ name: 'Cashew (జీడిపప్పు)', emoji: '' },
{ name: 'Anjeer (అంజీర్)', emoji: '' },
{ name: 'Pista (పిస్తా)', emoji: '' },
{ name: 'Walnut (వాల్నట్)', emoji: '' },
{ name: 'Kimia Dates (ఖర్జూరం)', emoji: '' },
{ name: 'Kismiss (ఎండు ద్రాక్ష)', emoji: '' },
  ],
  'Mixed Seeds': [
{ name: 'Pumpkin Seeds (గుమ్మడికాయ గింజలు)', emoji: '🥧' },
{ name: 'Sunflower Seeds (సూర్యకాంతి గింజలు)', emoji: '🌻' },
{ name: 'Watermelon Seeds (పుచ్చకాయ గింజలు)', emoji: '🍉' },
{ name: 'Till / Sesame (నువ్వులు)', emoji: '⚪' }
  ]
};

// Simplified category mapping for selection/logic
export const PLAN_CATEGORIES_MAP: Record<string, string[]> = {
  Standard: [
    'Basic Fruits',
    'Premium Fruits',
    'Mixed Veggie',
    'Mixed Sprouts',
    'Boiled Egg'
  ],
  Essential: [
    'Basic Fruits',
    'Premium Fruits',
    'Mixed Veggie',
    'Boiled Veggie',
    'Mixed Sprouts',
    'Boiled Egg',
    'Soaked Seeds'
  ],
  Signature: [
    'Basic Fruits',
    'Premium Fruits',
    'Exotic Fruits',
    'Mixed Sprouts',
    'Boiled Egg',
    'Mixed Dry Fruit Set',
    'Mixed Seeds'
  ]
};

// Detailed descriptions for the UI cards
export const PLAN_FEATURES: Record<string, string[]> = {
  Standard: [
    '3 Basic Fruits',
    '1 Premium Fruit',
    'Mixed Veggie',
    'Mixed Sprouts',
    'Boiled Egg'
  ],
  Essential: [
    '2 Basic Fruits',
    '2 Premium Fruits',
    'Mixed Veggie / Boiled Veggie',
    'Mixed Sprouts',
    'Boiled Egg / Soaked Seeds'
  ],
  Signature: [
    '2 Basic Fruits',
    '2 Premium Fruits',
    'Exotic Fruits',
    'Mixed Sprouts',
    'Mixed Dry Fruit Set',

    'Boiled Egg',
  ]
};

export const SERVICES: Service[] = [
  {
    id: 'daily',
    title: 'Daily Serving',
    description: 'A hassle-free morning ritual for consistent health.',
    icon: 'calendar',
    cta: 'Subscribe Now'
  },
  {
    id: 'bulk',
    title: 'Bulk Orders',
    description: 'Energize your team or guests with premium bowls.',
    icon: 'box',
    cta: 'Get Quote'
  },
  {
    id: 'catering',
    title: 'Catering',
    description: 'Live fruit stations that steal the show.',
    icon: 'chef',
    cta: 'Book Event'
  }
];

export const TESTIMONIALS = [
  {
    name: "Manikanta",
    role: "Charted Accountant",
    text: "I've never tasted freshness like this. The ability to customize my post-workout meal is a game changer.",
    rating: 5
  },
  {
    name: "Nitin Bhargav",
    role: "High Court Advocate",
    text: "Fusion Bowl transformed our office lunches. The team is healthier, happier, and more productive.",
    rating: 5
  },
  {
    name: "Dhakshin",
    role: "Student",
    text: "Finally, a healthy option that isn't boring. The student discount for subscriptions is a lifesaver!",
    rating: 4
  }
];

export const NAV_LINKS = [
  { name: 'Our Story', href: '#story' },
  { name: 'Services', href: '#services' },
  { name: 'Menu', href: '#menu' },
  { name: 'Bowl Builder', href: '#builder', highlight: true },
];

export const SIGNATURE_BOWLS = [
  {
    id: 'morning-glow',
    name: 'Morning Glow',
    ingredients: 'Papaya, Pomegranate, Apple',
    price: 180,
    calories: 250,
    tag: 'Best Seller'
  },
  {
    id: 'fiber-boost',
    name: 'Fiber Boost',
    ingredients: 'Banana, Guava, Kiwi',
    price: 220,
    calories: 320,
    tag: 'Gym Favorite'
  },
  {
    id: 'citrus-kick',
    name: 'Citrus Kick',
    ingredients: 'Orange, Pineapple, Kiwi',
    price: 190,
    calories: 180,
    tag: 'Vitamin C'
  }
];

export const SIZE_DETAILS = {
  Mini: '40 - 45 g per item',
  Compact: '50 - 60 g per item',
  Grand: '80 - 90 g per item'
};

// Matrix keys
export type PlanType = 'Standard' | 'Essential' | 'Signature';
export type PlanDuration = '15 Days' | '1 Month';
export type PlanSize = 'Mini' | 'Compact' | 'Grand';

export const PRICING_MATRIX: Record<PlanDuration, Record<PlanType, Record<PlanSize, number>>> = {
  '15 Days': {
    Standard: { Mini: 749, Compact: 949, Grand: 1149 },
    Essential: { Mini: 949, Compact: 1299, Grand: 1499 },
    Signature: { Mini: 1349, Compact: 1849, Grand: 2399 }
  },
  '1 Month': {
    Standard: { Mini: 1399, Compact: 1799, Grand: 2199 },
    Essential: { Mini: 1799, Compact: 2499, Grand: 2899 },
    Signature: { Mini: 2599, Compact: 3599, Grand: 4659 }
  }
};

export const FAQ_DATA: FAQItem[] = [
  {
    question: "What are your delivery timings?",
    answer: "We deliver twice a day to ensure freshness. Morning slots are from 6:30 AM to 10:30 AM, and Evening slots are from 3:30 PM to 6:30 PM."
  },
  {
    question: "Is Fusion Bowl open on Sundays?",
    answer: "No, every Sunday is a holiday. For subscription holders, Sundays are not counted as part of your plan duration, so you don't lose any days!"
  },
  {
    question: "How do I place an order?",
    answer: "You can build your custom bowl using our 'Bowl Builder' tool on this website and send the order via WhatsApp. Alternatively, you can message us directly on WhatsApp at +91 7207003062."
  },
  {
    question: "What items are included in the Subscription Plans?",
    answer: "Our plans (Standard, Essential, Signature) include a mix of Basic Fruits, Premium Fruits, Exotic Fruits, Sprouts, and Veggies. The specific composition depends on the plan tier you choose."
  },
  {
    question: "Where do you deliver?",
    answer: "We currently deliver to all areas within Narasaraopet (NRT). Delivery is free for all subscription plans."
  }
];