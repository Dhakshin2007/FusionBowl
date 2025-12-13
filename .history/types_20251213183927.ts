export interface Ingredient {
  id: string;
  name: string;
  category: 'base' | 'fruit' | 'topping' | 'dressing' | 'vegetable';
  price: number;
  calories: number; // per serving
  color: string; // Tailwind color class for visualization
  image?: string;
}

export interface BowlItem {
  ingredient: Ingredient;
  quantity: number;
}

export interface Service {
  id: string;
  title: string;
  description: string;
  icon: string;
  cta: string;
}

export interface FAQItem {
  question: string;
  answer: string;
}

export enum SectionId {
  HERO = 'hero',
  STORY = 'story',
  SERVICES = 'services',
  BUILDER = 'builder',
  MENU = 'menu',
  TESTIMONIALS = 'testimonials',
  FAQ = 'faq',
  CONTACT = 'contact'
}