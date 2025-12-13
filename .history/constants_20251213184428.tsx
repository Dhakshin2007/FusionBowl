import { Ingredient, Service, FAQItem } from './types';
import { Truck, Utensils, CalendarHeart, Leaf, Star, Sparkles } from 'lucide-react';

export const INGREDIENTS: Ingredient[] = [
  // Fruits
  { id: 'papaya', name: 'Papaya', category: 'fruit', price: 30, calories: 43, color: 'bg-orange-400' },
  { id: 'muskmelon', name: 'Musk Melon', category: 'fruit', price: 35, calories: 34, color: 'bg-orange-200' },
  { id: 'watermelon', name: 'Watermelon', category: 'fruit', price: 40, calories: 30, color: 'bg-red-400' },
  { id: 'pineapple', name: 'Pineapple', category: 'fruit', price: 48, calories: 50, color: 'bg-yellow-400' },
  { id: 'sapota', name: 'Sapota', category: 'fruit', price: 50, calories: 83, color: 'bg-stone-500' },
  { id: 'grapes', name: 'Grapes', category: 'fruit', price: 100, calories: 67, color: 'bg-purple-600' },
  { id: 'pomegranate', name: 'Pomegranate', category: 'fruit', price: 200, calories: 83, color: 'bg-red-600' },
  { id: 'apple', name: 'Apple', category: 'fruit', price: 150, calories: 52, color: 'bg-red-500' },
  { id: 'dragonfruit', name: 'Dragon Fruit (White)', category: 'fruit', price: 25, calories: 60, color: 'bg-pink-200' },
  { id: 'kiwi', name: 'Kiwi', category: 'fruit', price: 50, calories: 61, color: 'bg-lime-500' },
  { id: 'banana', name: 'Banana', category: 'fruit', price: 60, calories: 89, color: 'bg-yellow-200' },
  { id: 'orange', name: 'Orange', category: 'fruit', price: 80, calories: 47, color: 'bg-orange-500' },
  { id: 'guava', name: 'Guava', category: 'fruit', price: 60, calories: 68, color: 'bg-green-400' },
  { id: 'strawberry', name: 'Strawberry', category: 'fruit', price: 400, calories: 32, color: 'bg-red-500' },
  { id: 'mango', name: 'Mango (Seasonal)', category: 'fruit', price: 150, calories: 60, color: 'bg-yellow-500' },

  // Vegetables
  { id: 'beetroot', name: 'Beetroot', category: 'vegetable', price: 50, calories: 43, color: 'bg-pink-800' },
  { id: 'carrot', name: 'Carrot', category: 'vegetable', price: 70, calories: 41, color: 'bg-orange-500' },
];

export const SERVICES: Service[] = [
  {
    id: 'daily',
    title: 'Daily Subscription',
    description: 'Fresh bowls delivered to your office or home every morning. Start your day with vibrant energy.',
    icon: 'calendar',
    cta: 'Subscribe Now'
  },
  {
    id: 'bulk',
    title: 'Bulk Orders',
    description: 'Organizing a team lunch or wellness event? Get premium custom bowls at special bulk rates.',
    icon: 'truck',
    cta: 'Get Quote via WhatsApp'
  },
  {
    id: 'catering',
    title: 'Premium Catering',
    description: 'Elevate your weddings and corporate events with our live fruit stations and exotic displays.',
    icon: 'utensils',
    cta: 'Book Event via WhatsApp'
  }
];

export const TESTIMONIALS = [
  {
    name: "Nitin Bhargav",
    role: "High Court Lawyer",
    text: "I've never tasted freshness like this. The ability to customize my post-workout meal is a game changer.",
    rating: 5
  },
  {
    name: "Arjun Mehta",
    role: "Corporate Lead",
    text: "Fusion Bowl transformed our office lunches. The team is healthier, happier, and more productive.",
    rating: 5
  },
  {
    name: "Priya Sharma",
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

// --- SUBSCRIPTION DATA CONSTANTS ---

export const PLAN_FEATURES = {
  Standard: [
    '3 Basic Fruits',
    'Mixed Veggies',
    'Boiled Veggie',
    'Mixed Sprouts',
    'Boiled Egg'
  ],
  Essential: [
    '2 Basic Fruits',
    '2 Premium Fruits',
    'Mixed Veggies',
    'Mixed Sprouts',
    'Boiled Egg'
  ],
  Signature: [
    '2 Basic Fruits',
    '2 Premium Fruits',
    '1 Exotic Fruit',
    'Mixed Sprouts',
    'Mixed Dry Fruit Set'
  ]
};

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

// --- FAQ DATA ---
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