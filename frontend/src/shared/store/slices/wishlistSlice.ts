import { productProps } from '@shared/types/product';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface WishlistState {
  items: productProps[];
  isLoading: boolean;
}

const initialState: WishlistState = {
  items: [],
  isLoading: false,
};

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState,
  reducers: {
    addToWishlist: (state, action: PayloadAction<productProps>) => {
      const existingItem = state.items.find(item => item.id === action.payload.id);
      if (!existingItem) {
        state.items.push(action.payload);
      }
    },
    removeFromWishlist: (state, action: PayloadAction<number>) => {
      state.items = state.items.filter(item => item.id !== action.payload);
    },
    clearWishlist: (state) => {
      state.items = [];
    },
    setWishlistItems: (state, action: PayloadAction<productProps[]>) => {
      state.items = action.payload;
    },
    setWishlistLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
  },
});

export const {
  addToWishlist,
  removeFromWishlist,
  clearWishlist,
  setWishlistItems,
  setWishlistLoading,
} = wishlistSlice.actions;

export default wishlistSlice.reducer;