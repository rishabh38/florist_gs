
import { configureStore, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Product, CartItem, Language, User, Order } from '../types';
import { products as initialProducts } from '../data/products';

// Helper to load/save to localStorage
const PERSIST_KEY = 'florist_inventory';
const ORDERS_KEY = 'florist_orders';

const loadProducts = (): Product[] => {
  const saved = localStorage.getItem(PERSIST_KEY);
  return saved ? JSON.parse(saved) : initialProducts;
};

const loadOrders = (): Order[] => {
  const saved = localStorage.getItem(ORDERS_KEY);
  return saved ? JSON.parse(saved) : [];
};

const productsSlice = createSlice({
  name: 'products',
  initialState: { items: loadProducts() },
  reducers: {
    updateProduct: (state, action: PayloadAction<Product>) => {
      const index = state.items.findIndex(p => p.id === action.payload.id);
      if (index !== -1) {
        state.items[index] = action.payload;
        localStorage.setItem(PERSIST_KEY, JSON.stringify(state.items));
      }
    },
    addProduct: (state, action: PayloadAction<Product>) => {
      state.items.unshift(action.payload);
      localStorage.setItem(PERSIST_KEY, JSON.stringify(state.items));
    },
    deleteProduct: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(p => p.id !== action.payload);
      localStorage.setItem(PERSIST_KEY, JSON.stringify(state.items));
    },
    resetInventory: (state) => {
      state.items = initialProducts;
      localStorage.setItem(PERSIST_KEY, JSON.stringify(initialProducts));
    }
  }
});

const cartSlice = createSlice({
  name: 'cart',
  initialState: { items: [] as CartItem[] },
  reducers: {
    addToCart: (state, action: PayloadAction<Product>) => {
      const existing = state.items.find(item => item.id === action.payload.id);
      if (existing) {
        existing.quantity += 1;
      } else {
        state.items.push({ ...action.payload, quantity: 1 });
      }
    },
    removeFromCart: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(item => item.id !== action.payload);
    },
    updateQuantity: (state, action: PayloadAction<{ id: string, quantity: number }>) => {
      const item = state.items.find(i => i.id === action.payload.id);
      if (item) item.quantity = action.payload.quantity;
    },
    clearCart: (state) => {
      state.items = [];
    },
    reorderItems: (state, action: PayloadAction<CartItem[]>) => {
      action.payload.forEach(reorderItem => {
        const existing = state.items.find(item => item.id === reorderItem.id);
        if (existing) {
          existing.quantity += reorderItem.quantity;
        } else {
          state.items.push({ ...reorderItem });
        }
      });
    }
  }
});

const ordersSlice = createSlice({
  name: 'orders',
  initialState: { items: loadOrders() },
  reducers: {
    addOrder: (state, action: PayloadAction<Order>) => {
      state.items.unshift(action.payload);
      localStorage.setItem(ORDERS_KEY, JSON.stringify(state.items));
    },
    clearOrders: (state) => {
      state.items = [];
      localStorage.removeItem(ORDERS_KEY);
    }
  }
});

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState: { items: [] as Product[] },
  reducers: {
    toggleWishlist: (state, action: PayloadAction<Product>) => {
      const index = state.items.findIndex(item => item.id === action.payload.id);
      if (index >= 0) {
        state.items.splice(index, 1);
      } else {
        state.items.push(action.payload);
      }
    }
  }
});

const authSlice = createSlice({
  name: 'auth',
  initialState: { user: null as User | null },
  reducers: {
    login: (state, action: PayloadAction<User>) => {
      state.user = { ...action.payload, isLoggedIn: true };
    },
    logout: (state) => {
      state.user = null;
    }
  }
});

const languageSlice = createSlice({
  name: 'language',
  initialState: { current: 'en' as Language },
  reducers: {
    setLanguage: (state, action: PayloadAction<Language>) => {
      state.current = action.payload;
    }
  }
});

export const store = configureStore({
  reducer: {
    products: productsSlice.reducer,
    cart: cartSlice.reducer,
    wishlist: wishlistSlice.reducer,
    auth: authSlice.reducer,
    language: languageSlice.reducer,
    orders: ordersSlice.reducer,
  }
});

export const { updateProduct, addProduct, deleteProduct, resetInventory } = productsSlice.actions;
export const { addToCart, removeFromCart, updateQuantity, clearCart, reorderItems } = cartSlice.actions;
export const { addOrder, clearOrders } = ordersSlice.actions;
export const { toggleWishlist } = wishlistSlice.actions;
export const { login, logout } = authSlice.actions;
export const { setLanguage } = languageSlice.actions;

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
