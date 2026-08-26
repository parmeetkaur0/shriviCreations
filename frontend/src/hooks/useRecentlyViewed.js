import { useDispatch, useSelector } from 'react-redux';
import { addRecentlyViewed } from '../store/slices/uiSlice';

export const useRecentlyViewed = () => {
  const dispatch = useDispatch();
  const recentlyViewed = useSelector((state) => state.ui.recentlyViewed);

  const trackView = (product) => dispatch(addRecentlyViewed(product));

  return { recentlyViewed, trackView };
};
