import React, { useState } from 'react';
import { Button, TextField, Box, Typography } from '@mui/material';
import { useAuth } from '../../context/AuthContext';
import DragDropZone from './DragDropZone';

const UploadForm = ({ onUploadStart }) => {
  const { userEmail } = useAuth();
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const handleFileSelect = (selectedFile) => {
    console.log('UploadForm: File selected', selectedFile);
    setFile(selectedFile);
  };

  const handleRemoveFile = () => {
    setFile(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('UploadForm: Form submitted', { title, description, file: file?.name });
    const formData = new FormData();
    formData.append('file', file);
    formData.append('title', title);
    formData.append('description', description);

    try {
      console.log('UploadForm: Sending to backend');
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/upload`, {
        method: 'POST',
        body: formData,
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log('UploadForm: Upload initiated', data);
      onUploadStart(data.uploadId);
    } catch (error) {
      console.error('UploadForm: Upload failed', error);
      alert('Upload failed: ' + error.message);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
      <Typography variant="h6" gutterBottom>
        Upload Video
      </Typography>
      <TextField
        fullWidth
        label="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        margin="normal"
        required
      />
      <TextField
        fullWidth
        label="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        margin="normal"
        multiline
        rows={4}
      />
      <DragDropZone
        onFileSelect={handleFileSelect}
        selectedFile={file}
        onRemoveFile={handleRemoveFile}
      />
      <Button
        type="submit"
        variant="contained"
        color="primary"
        sx={{ mt: 2 }}
        disabled={!file}
      >
        Upload
      </Button>
    </Box>
  );
};

export default UploadForm;