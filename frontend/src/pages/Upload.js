import React, { useState, useEffect } from 'react';
import { Container, Typography, Box, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import io from 'socket.io-client';
import UploadForm from '../components/Upload/UploadForm';
import ProgressTracker from '../components/Progress/ProgressTracker';

const Upload = () => {
  const [uploadId, setUploadId] = useState(null);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState('idle');
  const navigate = useNavigate();

  useEffect(() => {
    const socket = io(process.env.REACT_APP_API_BASE_URL);
    console.log('Upload page: Socket connected');
    socket.on('uploadProgress', (data) => {
      console.log('Upload page: Progress update received', data);
      if (data.uploadId === uploadId) {
        setProgress(data.progress);
        setStatus(data.progress === 100 ? 'completed' : 'uploading');
      }
    });
    return () => {
      console.log('Upload page: Socket disconnected');
      socket.disconnect();
    };
  }, [uploadId]);

  const handleUploadStart = (id) => {
    setUploadId(id);
    setProgress(0);
    setStatus('uploading');
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Upload Video
        </Typography>
        <UploadForm onUploadStart={handleUploadStart} />
        {uploadId && <ProgressTracker progress={progress} status={status} />}
        <Button variant="outlined" onClick={() => navigate('/dashboard')} sx={{ mt: 2 }}>
          Back to Dashboard
        </Button>
      </Box>
    </Container>
  );
};

export default Upload;