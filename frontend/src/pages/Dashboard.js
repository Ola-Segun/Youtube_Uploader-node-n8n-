import React from 'react';
import { Container, Typography, Button, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Dashboard
        </Typography>
        <Button variant="contained" onClick={() => navigate('/upload')} sx={{ mr: 2 }}>
          Upload Video
        </Button>
        <Button variant="outlined" onClick={handleLogout}>
          Logout
        </Button>
      </Box>
    </Container>
  );
};

export default Dashboard;