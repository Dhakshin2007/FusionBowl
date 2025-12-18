import { Ingredient, Service, FAQItem } from './types';
import { Truck, Utensils, CalendarHeart, Leaf, Star, Sparkles, Box, ChefHat } from 'lucide-react';

export interface JuiceIngredient extends Ingredient {
  shotPrice: number;
  regularPrice: number;
}

export const INGREDIENTS: (Ingredient | JuiceIngredient)[] = [
  // Cold Pressed Juices (category: shake-item)
  { id: 'juice-orange', name: 'Orange (Vitamin C Burst)', category: 'shake-item', price: 80, shotPrice: 35, regularPrice: 80, calories: 110, color: 'bg-orange-500', emoji: '🍊' },
  { id: 'juice-watermelon', name: 'Watermelon (Just Watermelon)', category: 'shake-item', price: 80, shotPrice: 40, regularPrice: 80, calories: 90, color: 'bg-red-400', emoji: '🍉' },
  { id: 'juice-beetroot', name: 'Beetroot (Red-Revive)', category: 'shake-item', price: 80, shotPrice: 35, regularPrice: 80, calories: 80, color: 'bg-pink-800', emoji: '🟣' },
  { id: 'juice-mango', name: 'Mango (Sip of Golden Summer)', category: 'shake-item', price: 90, shotPrice: 40, regularPrice: 90, calories: 150, color: 'bg-yellow-500', emoji: '🥭' },
  { id: 'juice-pineapple', name: 'Pineapple (Pineapple Bliss)', category: 'shake-item', price: 100, shotPrice: 45, regularPrice: 100, calories: 120, color: 'bg-yellow-400', emoji: '🍍' },
  { id: 'juice-muskmelon', name: 'Muskmelon (Golden Melon)', category: 'shake-item', price: 100, shotPrice: 45, regularPrice: 100, calories: 100, color: 'bg-orange-200', emoji: '🍈' },
  { id: 'juice-carrot', name: 'Carrot (Carrot Powerhouse)', category: 'shake-item', price: 110, shotPrice: 45, regularPrice: 110, calories: 95, color: 'bg-orange-600', emoji: '🥕' },
  { id: 'juice-abc', name: 'ABC (ABC Goodness)', category: 'shake-item', price: 130, shotPrice: 50, regularPrice: 130, calories: 110, color: 'bg-red-700', emoji: '🥤' },
  { id: 'juice-apple', name: 'Apple (Apple-Solutely Healthy)', category: 'shake-item', price: 150, shotPrice: 60, regularPrice: 150, calories: 120, color: 'bg-red-500', emoji: '🍎' },
  { id: 'juice-pomegranate', name: 'Pomegranate (The Pomegranate Punch)', category: 'shake-item', price: 150, shotPrice: 60, regularPrice: 150, calories: 140, color: 'bg-red-800', emoji: '🔴' },
];

export interface PlatterCategory {
  id: string;
  name: string;
  teluguName: string;
  items: string[];
}

export const PLATTER_CATEGORIES: Record<string, PlatterCategory> = {
  citrus: {
    id: 'citrus',
    name: 'Citrus',
    teluguName: 'సిట్రస్',
    items: ['Pineapple (అనాస)', 'Orange (నారింజ)', 'Grapes (ద్రాక్ష)', 'Mosambi (బత్తాయి)', 'Mango (మామిడి)']
  },
  hydrating: {
    id: 'hydrating',
    name: 'Hydrating',
    teluguName: 'తేమను అందించే',
    items: ['Watermelon (పుచ్చకాయ)', 'Muskmelon (ఖర్బూజ)', 'Papaya (బొప్పాయి)', 'Cucumber (దోసకాయ)']
  },
  fiber_rich: {
    id: 'fiber_rich',
    name: 'Fiber Rich',
    teluguName: 'ఫైబర్ అధికంగా ఉన్నవి',
    items: ['Pomegranate (దానిమ్మ)', 'Apples (ఆపిల్)', 'Pear (పియర్)', 'Dragon Fruit']
  },
  digestive: {
    id: 'digestive',
    name: 'Digestive',
    teluguName: 'జీర్ణక్రియకు సహాయకమైనవి',
    items: ['Guava (జామకాయ)', 'Sapota (సపోటా / చీకూ)', 'Banana (అరటిపండు)']
  },
  protein: {
    id: 'protein',
    name: 'Protein Filler',
    teluguName: 'ప్రోటీన్ అధికంగా ఉన్నవి',
    items: ['Boiled Egg (ఉడికించిన గుడ్డు)', 'Sprouts']
  },
  nourish: {
    id: 'nourish',
    name: 'Daily Nourish',
    teluguName: 'రోజువారీ పోషణ',
    items: ['Mixed Seeds (మిశ్రమ గింజలు)', 'Soaked Seeds', 'Pumpkin Seeds (గుమ్మడికాయ గింజలు)', 'Sunflower Seeds', 'Watermelon Seeds', 'Till / Sesame (నువ్వులు)', 'Mahabeera', 'Flax Seeds', 'Chia Seeds']
  },
  dry_fruits: {
    id: 'dry_fruits',
    name: 'Dry Fruits',
    teluguName: 'ఎండు ఫలాలు',
    items: ['Royal Mix', 'Cashews', 'Almonds', 'Anjeer', 'Pista', 'Walnut', 'Kimia Dates', 'Kismiss']
  },
  exotic: {
    id: 'exotic',
    name: 'Exotic Fruits',
    teluguName: 'ఎగ్జోటిక్ ఫ్రూట్స్',
    items: ['Persimmon (పెర్సిమన్)', 'Kiwi (కివీ)', 'Avocado (అవకాడో)', 'Rambutan (రాంబుటాన్)', 'Strawberry (స్ట్రాబెర్రీ)', 'Litchi (లిచీ)', 'Longan (లాంగన్)']
  }
};

export const PACKS = {
  classic: {
    id: 'classic',
    name: 'Classic Platter',
    sections: 5,
    price: 135,
    categories: ['citrus', 'hydrating', 'fiber_rich', 'digestive', 'protein'],
    weights: {
      citrus: '180 Gm',
      hydrating: '400 Gm',
      fiber_rich: '140 Gm',
      digestive: '180 Gm',
      protein: '1 Whole Egg / 100 Gm Sprouts'
    }
  },
  prime: {
    id: 'prime',
    name: 'Prime Platter',
    sections: 8,
    price: 249,
    categories: ['fiber_rich', 'digestive', 'citrus', 'hydrating', 'protein', 'nourish', 'dry_fruits', 'exotic'],
    weights: {
      citrus: '135 Gm',
      hydrating: '350 Gm',
      fiber_rich: '100 Gm',
      digestive: '250 Gm',
      protein: '1 Whole Egg / 100 Gm Sprouts',
      nourish: '100 Gm',
      dry_fruits: '50 Gm',
      exotic: '100 Gm'
    }
  }
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
    rating: 5
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
    id: 'sprout-salad',
    name: 'Green Sprout Salad',
    ingredients: 'Mixed Sprouted legumes, herbs, lemon & olive oil, Mild spices',
    price: 99,
    calories: 250,
    tag: 'Best Seller'
  },
  {
    id: 'veggie-salad',
    name: 'Steamed Vegetable Salad',
    ingredients: 'Steamed vegetables, aromatic herbs, simple seasoning , mild spices & olive oil dressing',
    price: 129,
    calories: 320,
    tag: 'Vegetarian Fav'
  },
  {
    id: 'chick-kick',
    name: 'Protien Rich Chicken Salad',
    ingredients: 'Tender chicken, mixed greens, spices, olive oil , signature dressing',
    price: 149,
    calories: 180,
    tag: 'Gym Favorite'
  }
];

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

export type PlanType = 'Standard' | 'Essential' | 'Signature';
export type PlanDuration = '15 Days' | '1 Month';
export type PlanSize = 'Mini' | 'Compact' | 'Grand';

export const SIZE_DETAILS = {
  Mini: '40 - 45 g per item',
  Compact: '50 - 60 g per item',
  Grand: '80 - 90 g per item'
};

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
    { name: 'JackFruit (పనసకాయ)', emoji: '🍈' },
    { name: 'Pink Dragon (పింక్ ద్రాగన్ ఫ్రూట్)', emoji: '🍥' },
    { name: 'White Dragon (వైట్ ద్రాగన్ ఫ్రూట్)', emoji: '🍥' }
  ],
  'Exotic Fruits': [
    { name: 'Persimmon (పెర్సిమన్)', emoji: '🍑' },
    { name: 'Kiwi (కివీ)', emoji: '🥝' },
    { name: 'Avocado (అవకాడో)', emoji: '🥑' },
    { name: 'Rambutan (రాంబుటాన్)', emoji: '🍒' },
    { name: 'Strawberry (స్ట్రాబెర్రీ)', emoji: '🍓' },
    { name: 'Litchi (లిచీ)', emoji: '🍒' },
    { name: 'Longan (లాంగన్)', emoji: '🍈' },
    { name: 'Cherries (చెర్రీలు)', emoji: '🍒' },
    { name: 'Mangosteen (మాంగోస్టీన్)', emoji: '🍇' },
    { name: 'BlueBerry (బ్లూబెర్రీ)', emoji: '🫐' },
  ],
  'Mixed Veggie': [
    { name: 'Carrot (క్యారెట్)', emoji: '🥕' },
    { name: 'Beetroot (బీట్‌రూట్)', emoji: '🟣' },
    { name: 'Cucumber (దోసకాయ)', emoji: '🥒' },
  ],
  'Boiled Veggie': [
    { name: 'SweetCorn (స్వీట్ కార్న్)', emoji: '🌽' },
    { name: 'SweetPotato (చిలగడదుంప)', emoji: '🍠' },
  ],
  'Mixed Sprouts': [
    { name: 'Green Moong (పచ్చ పెసలు)', emoji: '🌱' },
    { name: 'Red Chowli (ఎర్ర అలసందలు)', emoji: '🫘' },
    { name: 'Channa (సెనగలు)', emoji: '🫂' },
    { name: 'Peanuts (వేరుశెనగలు)', emoji: '🥜' },
    { name: 'Chopped Carrot (తరిగిన క్యారెట్)', emoji: '🥕' },
  ],
  'Boiled Egg': [
    { name: 'Full Egg', emoji: '🥚' },
    { name: 'Egg Whites Only', emoji: '⚪' }
  ],
  'Soaked Seeds': [
    { name: 'Mahabeera (మహావీర గింజలు)', emoji: '⚫' },
    { name: 'Pumpkin Seeds', emoji: '🎃' },
    { name: 'Flax Seeds', emoji: '🟤' },
    { name: 'Chia Seeds', emoji: '⚫' }
  ],
  'Mixed Dry Fruit Set': [
    { name: 'Badam (బాదం)', emoji: '🥜' },
    { name: 'Cashew (జీడిపప్పు)', emoji: '🥜' },
    { name: 'Anjeer (అంజీర్)', emoji: '🍈' },
    { name: 'Pista (పిస్తా)', emoji: '🥜' },
    { name: 'Walnut (వాల్నట్)', emoji: '🥜' },
    { name: 'Kimia Dates (ఖర్జూరం)', emoji: '🌴' },
    { name: 'Kismiss (ఎండు ద్రాక్ష)', emoji: '🍇' },
  ],
  'Mixed Seeds': [
    { name: 'Pumpkin Seeds (గుమ్మడికాయ గింజలు)', emoji: '🥧' },
    { name: 'Sunflower Seeds (సూర్యకాంతి గింజలు)', emoji: '🌻' },
    { name: 'Watermelon Seeds (పుచ్చకాయ గింజలు)', emoji: '🍉' },
    { name: 'Till / Sesame (నువ్వులు)', emoji: '⚪' }
  ]
};

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
    'Mixed Dry Fruit Set',
    'Mixed Seeds'
  ]
};

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
    '1 Exotic Fruit',
    'Mixed Sprouts',
    'Mixed Dry Fruits/Mixed Seeds'
  ]
};
