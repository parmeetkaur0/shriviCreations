import { createSlice } from '@reduxjs/toolkit';

const RECENTLY_VIEWED_KEY = 'sc_recently_viewed';
const MAX_RECENT = 8;

const loadRecentlyViewed = () => {
  try {
    return JSON.parse(localStorage.getItem(RECENTLY_VIEWED_KEY)) || [];
  } catch {
    return [];
  }
};

const uiSlice = createSlice({
  name: 'ui',
  initialState: {
    isMobileMenuOpen: false,
    isSearchOpen: false,
    recentlyViewed: loadRecentlyViewed(),
  },
  reducers: {
    toggleMobileMenu: (state) => {
      state.isMobileMenuOpen = !state.isMobileMenuOpen;
    },
    closeMobileMenu: (state) => {
      state.isMobileMenuOpen = false;
    },
    toggleSearch: (state) => {
      state.isSearchOpen = !state.isSearchOpen;
    },
    closeSearch: (state) => {
      state.isSearchOpen = false;
    },
    addRecentlyViewed: (state, action) => {
      const product = action.payload;
      state.recentlyViewed = [product, ...state.recentlyViewed.filter((p) => p._id !== product._id)].slice(
        0,
        MAX_RECENT
      );
      localStorage.setItem(RECENTLY_VIEWED_KEY, JSON.stringify(state.recentlyViewed));
    },
  },
});

export const { toggleMobileMenu, closeMobileMenu, toggleSearch, closeSearch, addRecentlyViewed } = uiSlice.actions;
export default uiSlice.reducer;
