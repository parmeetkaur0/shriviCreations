import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { cartService } from '../../services/cartService';
import toast from 'react-hot-toast';

export const fetchCart = createAsyncThunk('cart/fetch', async (_, { rejectWithValue }) => {
  try {
    const res = await cartService.get();
    return res.cart;
  } catch (err) {
    return rejectWithValue(err.message);
  }
});

export const addItemToCart = createAsyncThunk(
  'cart/addItem',
  async ({ productId, quantity, variant }, { rejectWithValue }) => {
    try {
      const res = await cartService.add(productId, quantity, variant);
      toast.success('Added to cart');
      return res.cart;
    } catch (err) {
      toast.error(err.message);
      return rejectWithValue(err.message);
    }
  }
);

export const updateItemQuantity = createAsyncThunk(
  'cart/updateItem',
  async ({ itemId, quantity }, { rejectWithValue }) => {
    try {
      const res = await cartService.update(itemId, quantity);
      return res.cart;
    } catch (err) {
      toast.error(err.message);
      return rejectWithValue(err.message);
    }
  }
);

export const removeItemFromCart = createAsyncThunk('cart/removeItem', async (itemId, { rejectWithValue }) => {
  try {
    const res = await cartService.remove(itemId);
    toast.success('Removed from cart');
    return res.cart;
  } catch (err) {
    return rejectWithValue(err.message);
  }
});

export const clearCartItems = createAsyncThunk('cart/clear', async (_, { rejectWithValue }) => {
  try {
    const res = await cartService.clear();
    return res.cart;
  } catch (err) {
    return rejectWithValue(err.message);
  }
});

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    cart: { items: [] },
    isDrawerOpen: false,
    loading: false,
  },
  reducers: {
    openCartDrawer: (state) => {
      state.isDrawerOpen = true;
    },
    closeCartDrawer: (state) => {
      state.isDrawerOpen = false;
    },
    resetCartLocal: (state) => {
      state.cart = { items: [] };
    },
  },
  extraReducers: (builder) => {
    builder
      .addMatcher(
        (action) => action.type.startsWith('cart/') && action.type.endsWith('/pending'),
        (state) => {
          state.loading = true;
        }
      )
      .addMatcher(
        (action) => action.type.startsWith('cart/') && action.type.endsWith('/fulfilled'),
        (state, action) => {
          state.loading = false;
          if (action.payload) state.cart = action.payload;
        }
      )
      .addMatcher(
        (action) => action.type.startsWith('cart/') && action.type.endsWith('/rejected'),
        (state) => {
          state.loading = false;
        }
      );
  },
});

export const { openCartDrawer, closeCartDrawer, resetCartLocal } = cartSlice.actions;
export default cartSlice.reducer;
