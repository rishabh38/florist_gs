
export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  image: string;
  category: string;
  funFact?: string;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface OrderItem extends CartItem {}

export interface Order {
  id: string;
  date: string;
  items: OrderItem[];
  total: number;
  status: 'Processing' | 'Shipped' | 'Delivered';
}

export type Language = 'en' | 'hi' | 'gu';

export interface User {
  name: string;
  email: string;
  phone: string;
  isLoggedIn: boolean;
}

export interface AppState {
  cart: {
    items: CartItem[];
  };
  wishlist: {
    items: Product[];
  };
  auth: {
    user: User | null;
  };
  language: {
    current: Language;
  };
  orders: {
    items: Order[];
  };
}
