import {
  AppBar,
  Box,
  Button,
  Chip,
  Container,
  Stack,
  Toolbar,
  Typography,
} from '@mui/material';
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { logout } from '@/store/authSlice';
import { apiClient } from '@/lib/api/client';

export function Layout() {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const toggleMockMode = () => {
    const newMode = !apiClient.isMockMode();
    apiClient.setMockMode(newMode);
    window.location.reload();
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'grey.50' }}>
      <AppBar position="sticky" color="inherit" elevation={1}>
        <Toolbar>
          <Container maxWidth="lg" sx={{ px: '0 !important' }}>
            <Stack direction="row" alignItems="center" justifyContent="space-between">
              <Stack direction="row" spacing={1} alignItems="center">
                <Typography
                  component={Link}
                  to="/"
                  variant="h6"
                  sx={{ textDecoration: 'none', color: 'text.primary', fontWeight: 800 }}
                >
                  Backoffice
                </Typography>
                <Button
                  component={NavLink}
                  to="/"
                  sx={{ color: 'text.secondary', '&.active': { color: 'primary.main', fontWeight: 700 } }}
                >
                  Dashboard
                </Button>
                <Button
                  component={NavLink}
                  to="/tasks"
                  sx={{ color: 'text.secondary', '&.active': { color: 'primary.main', fontWeight: 700 } }}
                >
                  Tasks
                </Button>
                <Button
                  component={NavLink}
                  to="/systems"
                  sx={{ color: 'text.secondary', '&.active': { color: 'primary.main', fontWeight: 700 } }}
                >
                  Systems
                </Button>
              </Stack>
              <Stack direction="row" spacing={1} alignItems="center">
                <Chip
                  size="small"
                  color={apiClient.isMockMode() ? 'warning' : 'default'}
                  label={apiClient.isMockMode() ? 'Mock Mode' : 'API Mode'}
                  onClick={toggleMockMode}
                  clickable
                />
                <Typography variant="body2" color="text.secondary">
                  {user?.email}
                </Typography>
                <Button variant="outlined" size="small" onClick={handleLogout}>
                  Logout
                </Button>
              </Stack>
            </Stack>
          </Container>
        </Toolbar>
      </AppBar>
      <Container maxWidth="lg" sx={{ py: 3 }}>
        <Outlet />
      </Container>
    </Box>
  );
}
