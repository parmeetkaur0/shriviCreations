import { useSelector, useDispatch } from 'react-redux';
import { login, register, logout } from '../store/slices/authSlice';

export const useAuth = () => {
  const dispatch = useDispatch();
  const { user, isAuthenticated, loading, error } = useSelector((state) => state.auth);

  return {
    user,
    isAuthenticated,
    loading,
    error,
    isAdmin: user?.role === 'admin',
    login: (data) => dispatch(login(data)),
    register: (data) => dispatch(register(data)),
    logout: () => dispatch(logout()),
  };
};
