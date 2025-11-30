import React, { useState } from 'react';
import { Button, TextField, Box, Typography } from '@mui/material';
import api from '../../services/api';
import DragDropZone from './DragDropZone';

const UploadForm = ({ onUploadStart }) => {
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
    formData.append('video', file);
    formData.append('title', title);
    formData.append('description', description);

    try {
      console.log('UploadForm: Making API call to /upload');
      const response = await api.post('/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      console.log('UploadForm: Upload successful', response.data);
      onUploadStart(response.data.uploadId);
    } catch (error) {
      console.error('UploadForm: Upload failed', error);
      alert('Upload failed');
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