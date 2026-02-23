import { useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '@/store/hooks';
import { setUser, setToken } from '@/store/authSlice';
import { backofficeApi } from '@/lib/api/backoffice';
import { isMockAuth } from '@/lib/auth/config';
import { toast } from 'react-toastify';

export function Login() {
  const [email, setEmail] = useState('worker@example.com');
  const [password, setPassword] = useState('password');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (isMockAuth) {
        // Mock authentication
        const mockToken = 'mock-token-' + Date.now();
        dispatch(setToken(mockToken));
        const user = await backofficeApi.getCurrentUser();
        dispatch(setUser(user));
        toast.success('Logged in');
        navigate('/');
      } else {
        // TODO: Implement real AWS Cognito authentication
        setError('AWS Cognito authentication not yet implemented');
      }
    } catch (err) {
      setError('Login failed');
      toast.error('Login failed');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', display: 'grid', placeItems: 'center', p: 2 }}>
      <Card sx={{ width: '100%', maxWidth: 440 }}>
        <CardContent sx={{ p: 4 }}>
          <Stack spacing={3}>
            <Box textAlign="center">
              <Typography variant="h4" fontWeight={800}>
                Backoffice
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Sign in to your account
              </Typography>
            </Box>
            {isMockAuth && (
              <Alert severity="warning" variant="outlined">
                Mock Auth Mode - any credentials work
              </Alert>
            )}

            {error && <Alert severity="error">{error}</Alert>}

            <Box component="form" onSubmit={handleSubmit}>
              <Stack spacing={2}>
                <TextField
                  label="Email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  fullWidth
                />
                <TextField
                  label="Password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  fullWidth
                />
                <Button type="submit" variant="contained" size="large" disabled={loading}>
                  {loading ? <CircularProgress size={22} color="inherit" /> : 'Sign In'}
                </Button>
              </Stack>
            </Box>
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
}
