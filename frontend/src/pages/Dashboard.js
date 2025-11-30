import React, { useEffect, useState } from 'react';
import { Container, Typography, Button, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import VideoList from '../components/VideoList/VideoList';
import api from '../services/api';

const Dashboard = () => {
  const [videos, setVideos] = useState([]);
  const { logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = async () => {
    try {
      const response = await api.get('/videos');
      setVideos(response.data);
    } catch (error) {
      console.error('Failed to fetch videos', error);
    }
  };

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
        <VideoList videos={videos} />
      </Box>
    </Container>
  );
};

export default Dashboard;