import { useEffect } from 'react';
import { Provider } from 'react-redux';
import { Box, CircularProgress, CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { store } from '@/store';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setUser, setToken, setLoading } from '@/store/authSlice';
import { backofficeApi } from '@/lib/api/backoffice';
import { isMockAuth } from '@/lib/auth/config';
import { Layout } from '@/components/Layout';
import { Dashboard } from '@/pages/Dashboard';
import { Tasks } from '@/pages/Tasks';
import { Systems } from '@/pages/Systems';
import { Login } from '@/pages/Login';
import { ToastContainer } from 'react-toastify';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#0f172a',
    },
    background: {
      default: '#f8fafc',
    },
  },
  shape: {
    borderRadius: 12,
  },
});

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  const isLoading = useAppSelector((state) => state.auth.isLoading);

  if (isLoading) {
    return (
      <Box sx={{ minHeight: '100vh', display: 'grid', placeItems: 'center' }}>
        <CircularProgress />
      </Box>
    );
  }

  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
}

function AppContent() {
  const dispatch = useAppDispatch();
  const token = useAppSelector((state) => state.auth.token);

  useEffect(() => {
    const initAuth = async () => {
      try {
        if (token || isMockAuth) {
          if (isMockAuth && !token) {
            dispatch(setToken('mock-token'));
          }
          const user = await backofficeApi.getCurrentUser();
          dispatch(setUser(user));
        }
      } catch (error) {
        console.error('Failed to load user:', error);
        dispatch(setUser(null));
      } finally {
        dispatch(setLoading(false));
      }
    };

    initAuth();
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/"
          element={
            <PrivateRoute>
              <Layout />
            </PrivateRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="tasks" element={<Tasks />} />
          <Route path="systems" element={<Systems />} />
        </Route>
      </Routes>
      <ToastContainer position="top-right" autoClose={3000} />
    </BrowserRouter>
  );
}

export function App() {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <AppContent />
      </ThemeProvider>
    </Provider>
  );
}
