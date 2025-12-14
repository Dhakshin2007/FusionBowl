
export interface Ingredient {
  id: string;
  name: string;
  category: 'base' | 'fruit' | 'topping' | 'dressing' | 'vegetable' | 'shake-item';
  price: number;
  calories: number; // per serving
  color: string; // Tailwind color class for visualization
  emoji: string; // Emoji representation
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

export interface SignatureBowl {
  id: string;
  name: string;
  ingredients: string;
  price: number;
  calories: number;
  tag?: string;
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
