import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { wishlistService } from '../../services/wishlistService';
import toast from 'react-hot-toast';

export const fetchWishlist = createAsyncThunk('wishlist/fetch', async (_, { rejectWithValue }) => {
  try {
    const res = await wishlistService.get();
    return res.wishlist;
  } catch (err) {
    return rejectWithValue(err.message);
  }
});

export const toggleWishlistItem = createAsyncThunk(
  'wishlist/toggle',
  async ({ productId, isWishlisted }, { rejectWithValue }) => {
    try {
      const res = isWishlisted
        ? await wishlistService.remove(productId)
        : await wishlistService.add(productId);
      toast.success(isWishlisted ? 'Removed from wishlist' : 'Added to wishlist');
      return res.wishlist;
    } catch (err) {
      toast.error(err.message);
      return rejectWithValue(err.message);
    }
  }
);

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState: { wishlist: { products: [] }, loading: false },
  reducers: {
    resetWishlistLocal: (state) => {
      state.wishlist = { products: [] };
    },
  },
  extraReducers: (builder) => {
    builder
      .addMatcher(
        (action) => action.type.startsWith('wishlist/') && action.type.endsWith('/fulfilled'),
        (state, action) => {
          state.loading = false;
          if (action.payload) state.wishlist = action.payload;
        }
      )
      .addMatcher(
        (action) => action.type.startsWith('wishlist/') && action.type.endsWith('/pending'),
        (state) => {
          state.loading = true;
        }
      );
  },
});

export const { resetWishlistLocal } = wishlistSlice.actions;
export default wishlistSlice.reducer;
