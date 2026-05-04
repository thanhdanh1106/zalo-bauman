import { productProps } from '@shared/types/product';
import { promotionProps } from '@shared/types/promotion';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface CartItem extends productProps {
  quantity: number;
}

interface CartState {
  items: CartItem[];
  total: number;
  subtotal: number;
  discount: number;
  appliedPromotion: promotionProps | null;
  appliedReward: any | null;
  loading: boolean;
  error: string | null;
  promotionError: string | null;
}

// Type for adding item to cart
export type AddToCartPayload = Omit<CartItem, 'quantity'> & { quantity?: number };

// Type for updating quantity
export type UpdateQuantityPayload = { id: number; quantity: number };

// Type for updating price
export type UpdatePricePayload = { id: number; price: number };

// Type for updating stock
export type UpdateStockPayload = { id: number; stock: number };

// Export CartItem type for use in components
export type { CartItem, CartState };

const CART_STORAGE_KEY = 'li_cart';

const loadCartFromStorage = (): CartState | null => {
  try {
    const serializedState = localStorage.getItem(CART_STORAGE_KEY);
    if (serializedState === null) return null;
    const parsed = JSON.parse(serializedState);
    return {
      ...parsed,
      loading: false,
      error: null,
      promotionError: null
    };
  } catch (err) {
    return null;
  }
};

const saveCartToStorage = (state: CartState) => {
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem(CART_STORAGE_KEY, serializedState);
  } catch (err) {
    console.error('Failed to save cart:', err);
  }
};

const initialState: CartState = loadCartFromStorage() || {
  items: [],
  total: 0,
  subtotal: 0,
  discount: 0,
  appliedPromotion: null,
  appliedReward: null,
  loading: false,
  error: null,
  promotionError: null,
};

const calculateTotal = (items: CartItem[]): number => {
  return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
};

const calculateDiscount = (subtotal: number, promotion: promotionProps | null): number => {
  if (!promotion) return 0;
  
  // Check if promotion is still valid
  const now = new Date();
  const startDate = new Date(promotion.start_date);
  const endDate = new Date(promotion.end_date);
  
  if (now < startDate || now > endDate) return 0;
  
  // Calculate discount amount
  return Math.floor((subtotal * promotion.discount) / 100);
};

const calculateFinalTotal = (subtotal: number, discount: number): number => {
  return Math.max(0, subtotal - discount);
};

// Helper function to format cart data for API
export const formatCartForAPI = (items: CartItem[]) => {
  return items.map(item => ({
    product_id: item.id,
    quantity: item.quantity,
    price: item.price,
    total: item.price * item.quantity
  }));
};

// Helper function to calculate cart summary
export const calculateCartSummary = (items: CartItem[], promotion: promotionProps | null = null) => {
  const subtotal = calculateTotal(items);
  const discount = calculateDiscount(subtotal, promotion);
  const total = calculateFinalTotal(subtotal, discount);
  const itemCount = items.reduce((total, item) => total + item.quantity, 0);
  
  return {
    subtotal,
    discount,
    total,
    itemCount,
    isEmpty: items.length === 0
  };
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addItem(state, action: PayloadAction<AddToCartPayload>) {
      const newItem = { ...action.payload, quantity: action.payload.quantity || 1 };
      
      // Check if product has stock
      if (!newItem.stock || newItem.stock <= 0) {
        state.error = 'Sản phẩm hiện đang hết hàng';
        return;
      }

      const existingItem = state.items.find(item => item.id === newItem.id);
      
      if (existingItem) {
        // Check if adding quantity exceeds stock
        const newQuantity = existingItem.quantity + newItem.quantity;
        if (newQuantity > newItem.stock) {
          state.error = `Chỉ còn ${newItem.stock} sản phẩm trong kho`;
          return;
        }
        existingItem.quantity = newQuantity;
        // Update stock info in existing item
        existingItem.stock = newItem.stock;
        existingItem.price = newItem.price; // Update price in case it changed
      } else {
        // Check if initial quantity exceeds stock
        if (newItem.quantity > newItem.stock) {
          state.error = `Chỉ còn ${newItem.stock} sản phẩm trong kho`;
          return;
        }
        state.items.push(newItem as CartItem);
      }
      
      state.subtotal = calculateTotal(state.items);
      state.discount = calculateDiscount(state.subtotal, state.appliedPromotion);
      state.total = calculateFinalTotal(state.subtotal, state.discount);
      state.error = null; // Clear any previous errors
      saveCartToStorage(state);
    },
    
    removeItem(state, action: PayloadAction<number>) {
      state.items = state.items.filter(item => item.id !== action.payload);
      state.subtotal = calculateTotal(state.items);
      state.discount = calculateDiscount(state.subtotal, state.appliedPromotion);
      state.total = calculateFinalTotal(state.subtotal, state.discount);
      state.error = null;
      saveCartToStorage(state);
    },
    
    updateQuantity(state, action: PayloadAction<UpdateQuantityPayload>) {
      const item = state.items.find(item => item.id === action.payload.id);
      if (item) {
        // Validate quantity
        if (action.payload.quantity <= 0) {
          state.items = state.items.filter(i => i.id !== action.payload.id);
        } else if (action.payload.quantity > item.stock) {
          state.error = `Chỉ còn ${item.stock} sản phẩm trong kho`;
          return;
        } else {
          item.quantity = action.payload.quantity;
          state.error = null;
        }
        state.subtotal = calculateTotal(state.items);
        state.discount = calculateDiscount(state.subtotal, state.appliedPromotion);
        state.total = calculateFinalTotal(state.subtotal, state.discount);
        saveCartToStorage(state);
      }
    },
    
    increaseQuantity(state, action: PayloadAction<number>) {
      const item = state.items.find(item => item.id === action.payload);
      if (item) {
        if (item.quantity >= item.stock) {
          state.error = `Chỉ còn ${item.stock} sản phẩm trong kho`;
          return;
        }
        item.quantity += 1;
        state.subtotal = calculateTotal(state.items);
        state.discount = calculateDiscount(state.subtotal, state.appliedPromotion);
        state.total = calculateFinalTotal(state.subtotal, state.discount);
        state.error = null;
        saveCartToStorage(state);
      }
    },
    
    decreaseQuantity(state, action: PayloadAction<number>) {
      const item = state.items.find(item => item.id === action.payload);
      if (item) {
        if (item.quantity <= 1) {
          state.items = state.items.filter(i => i.id !== action.payload);
        } else {
          item.quantity -= 1;
        }
        state.subtotal = calculateTotal(state.items);
        state.discount = calculateDiscount(state.subtotal, state.appliedPromotion);
        state.total = calculateFinalTotal(state.subtotal, state.discount);
        state.error = null;
        saveCartToStorage(state);
      }
    },
    
    clearCart(state) {
      state.items = [];
      state.subtotal = 0;
      state.discount = 0;
      state.total = 0;
      state.appliedPromotion = null;
      state.appliedReward = null;
      state.error = null;
      state.promotionError = null;
      saveCartToStorage(state);
    },
    
    // Promotion actions
    applyPromotion(state, action: PayloadAction<promotionProps>) {
      const promotion = action.payload;
      
      // Validate promotion dates
      const now = new Date();
      const startDate = new Date(promotion.start_date);
      const endDate = new Date(promotion.end_date);
      
      if (now < startDate) {
        state.promotionError = 'Mã giảm giá chưa có hiệu lực';
        return;
      }
      
      if (now > endDate) {
        state.promotionError = 'Mã giảm giá đã hết hạn';
        return;
      }
      
      state.appliedPromotion = promotion;
      state.appliedReward = null; // Mutually exclusive
      state.discount = calculateDiscount(state.subtotal, promotion);
      state.total = calculateFinalTotal(state.subtotal, state.discount);
      state.promotionError = null;
      saveCartToStorage(state);
    },
    
    applyReward(state, action: PayloadAction<any>) {
      state.appliedReward = action.payload;
      state.appliedPromotion = null; // Mutually exclusive
      state.discount = 0; // Rewards don't apply monetary discount currently
      state.total = state.subtotal;
      state.promotionError = null;
      saveCartToStorage(state);
    },
    
    removeReward(state) {
      state.appliedReward = null;
      saveCartToStorage(state);
    },
    
    removePromotion(state) {
      state.appliedPromotion = null;
      state.discount = 0;
      state.total = state.subtotal;
      state.promotionError = null;
      saveCartToStorage(state);
    },
    
    setPromotionError(state, action: PayloadAction<string | null>) {
      state.promotionError = action.payload;
    },
    
    clearPromotionError(state) {
      state.promotionError = null;
    },
    
    syncCartWithStock(state, action: PayloadAction<productProps[]>) {
      // Update cart items with latest product information
      action.payload.forEach(product => {
        const item = state.items.find(item => item.id === product.id);
        if (item) {
          // Update product information
          item.title = product.title;
          item.price = product.price;
          item.stock = product.stock;
          item.thumbnail = product.thumbnail;
          item.status = product.status;
          
          // Check if product is still available
          if (product.status !== 'published' || !product.stock || product.stock === 0) {
            // Remove item if product is not available or out of stock
            state.items = state.items.filter(i => i.id !== product.id);
          } else if (item.quantity > product.stock) {
            // Reduce quantity to available stock
            item.quantity = product.stock;
          }
        }
      });
      
      // Remove items that are no longer in the product list (deleted products)
      const productIds = action.payload.map(p => p.id);
      state.items = state.items.filter(item => productIds.includes(item.id));
      
      state.total = calculateTotal(state.items);
    },
    
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    
    setError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
    },
    
    clearError(state) {
      state.error = null;
    },

    // New actions for better product data handling
    updateItemPrice(state, action: PayloadAction<UpdatePricePayload>) {
      const item = state.items.find(item => item.id === action.payload.id);
      if (item) {
        item.price = action.payload.price;
        state.subtotal = calculateTotal(state.items);
        state.discount = calculateDiscount(state.subtotal, state.appliedPromotion);
        state.total = calculateFinalTotal(state.subtotal, state.discount);
      }
    },

    updateItemStock(state, action: PayloadAction<UpdateStockPayload>) {
      const item = state.items.find(item => item.id === action.payload.id);
      if (item) {
        item.stock = action.payload.stock;
        // Adjust quantity if it exceeds new stock
        if (item.quantity > action.payload.stock) {
          if (action.payload.stock === 0) {
            state.items = state.items.filter(i => i.id !== action.payload.id);
          } else {
            item.quantity = action.payload.stock;
          }
          state.subtotal = calculateTotal(state.items);
          state.discount = calculateDiscount(state.subtotal, state.appliedPromotion);
          state.total = calculateFinalTotal(state.subtotal, state.discount);
        }
      }
    },

    validateCartItems(state) {
      // Remove items with invalid data
      state.items = state.items.filter(item => {
        return item.stock > 0 && 
               item.status === 'published' && 
               item.quantity > 0 && 
               item.price > 0;
      });
      state.subtotal = calculateTotal(state.items);
      state.discount = calculateDiscount(state.subtotal, state.appliedPromotion);
      state.total = calculateFinalTotal(state.subtotal, state.discount);
    },
    setCartItems(state, action: PayloadAction<CartItem[]>) {
      state.items = action.payload;
      state.subtotal = calculateTotal(state.items);
      state.discount = calculateDiscount(state.subtotal, state.appliedPromotion);
      state.total = calculateFinalTotal(state.subtotal, state.discount);
      saveCartToStorage(state);
    },
  },
});

// Helper selectors (to be used with useSelector)
export const selectCartItemCount = (state: { cart: CartState }) => {
  return state.cart.items.reduce((total, item) => total + item.quantity, 0);
};

export const selectCartItemById = (id: number) => (state: { cart: CartState }) => {
  return state.cart.items.find(item => item.id === id);
};

export const selectCartTotal = (state: { cart: CartState }) => state.cart.total;
export const selectCartSubtotal = (state: { cart: CartState }) => state.cart.subtotal;
export const selectCartDiscount = (state: { cart: CartState }) => state.cart.discount;
export const selectAppliedPromotion = (state: { cart: CartState }) => state.cart.appliedPromotion;
export const selectAppliedReward = (state: { cart: CartState }) => state.cart.appliedReward;
export const selectCartItems = (state: { cart: CartState }) => state.cart.items;
export const selectCartError = (state: { cart: CartState }) => state.cart.error;
export const selectPromotionError = (state: { cart: CartState }) => state.cart.promotionError;
export const selectCartLoading = (state: { cart: CartState }) => state.cart.loading;

export const { 
  addItem, 
  removeItem, 
  updateQuantity, 
  increaseQuantity, 
  decreaseQuantity, 
  clearCart, 
  syncCartWithStock, 
  setLoading, 
  setError, 
  clearError,
  updateItemPrice,
  updateItemStock,
  validateCartItems,
  applyPromotion,
  removePromotion,
  applyReward,
  removeReward,
  setPromotionError,
  clearPromotionError,
  setCartItems
} = cartSlice.actions;
export default cartSlice.reducer;