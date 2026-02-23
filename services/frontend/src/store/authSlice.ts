import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { User } from '@/types';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  token: string | null;
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
  token: localStorage.getItem('access_token'),
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User | null>) => {
      state.user = action.payload;
      state.isAuthenticated = !!action.payload;
    },
    setToken: (state, action: PayloadAction<string | null>) => {
      state.token = action.payload;
      if (action.payload) {
        localStorage.setItem('access_token', action.payload);
      } else {
        localStorage.removeItem('access_token');
      }
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    logout: (state) => {
      localStorage.removeItem('access_token');
      state.user = null;
      state.isAuthenticated = false;
      state.token = null;
    },
  },
});

export const { setUser, setToken, setLoading, logout } = authSlice.actions;
export default authSlice.reducer;
