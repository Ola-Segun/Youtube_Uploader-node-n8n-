import React from 'react';
import { Button, Container, Typography, Box } from '@mui/material';
import { useAuth } from '../../context/AuthContext';

const Login = () => {
  const { login } = useAuth();

  const handleLogin = () => {
    window.location.href = 'http://localhost:5000/auth/google/login';
  };

  // Check for token in URL on mount
  React.useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    if (token) {
      login(token);
      window.location.href = '/dashboard';
    }
  }, [login]);

  return (
    <Container maxWidth="sm">
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        minHeight="100vh"
      >
        <Typography variant="h4" component="h1" gutterBottom>
          YouTube Uploader
        </Typography>
        <Button variant="contained" color="primary" onClick={handleLogin}>
          Login with Google
        </Button>
      </Box>
    </Container>
  );
};

export default Login;