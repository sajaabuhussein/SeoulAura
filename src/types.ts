export interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
  brand: string;
  skinType: string[];
  rating?: number;
  description?: string;
  ingredients: string[];
  tags?: string[];
  isNew?: boolean;
  isBestSeller?: boolean;
}

export interface RecommendedProduct extends Product {
  reason: string;
}

export interface QuizResult {
  primary: string;
  secondary: string | null;
  confidence: number;
  profile: {
    hydration: 'Low' | 'Medium' | 'High';
    oilControl: 'Low' | 'Medium' | 'High';
    sensitivity: 'Low' | 'Medium' | 'High';
  };
}

export interface CartItem extends Product {
  quantity: number;
}

export interface Review {
  id: string;
  user: string;
  rating: number;
  comment: string;
  image?: string;
}

export interface Category {
  id: string;
  name: string;
  image: string;
}

export interface Brand {
  id: string;
  name: string;
  image: string;
  description: string;
}
