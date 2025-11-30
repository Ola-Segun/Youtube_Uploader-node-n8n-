import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Box, Typography, IconButton } from '@mui/material';
import { CloudUpload, VideoFile, Close } from '@mui/icons-material';

const DragDropZone = ({ onFileSelect, selectedFile, onRemoveFile }) => {
  const onDrop = useCallback((acceptedFiles, rejectedFiles) => {
    console.log('DragDropZone: onDrop called', { acceptedFiles: acceptedFiles.length, rejectedFiles: rejectedFiles.length });
    if (acceptedFiles.length > 0) {
      console.log('DragDropZone: File selected', acceptedFiles[0]);
      onFileSelect(acceptedFiles[0]);
    }
    if (rejectedFiles.length > 0) {
      console.log('DragDropZone: Files rejected', rejectedFiles);
    }
  }, [onFileSelect]);

  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    onDrop,
    accept: {
      'video/*': ['.mp4', '.avi', '.mov', '.wmv', '.flv', '.webm', '.mkv']
    },
    maxFiles: 1,
    maxSize: 500 * 1024 * 1024, // 500MB
  });

  const getBorderColor = () => {
    if (isDragReject) return 'error.main';
    if (isDragActive) return 'primary.main';
    return 'grey.400';
  };

  const getBackgroundColor = () => {
    if (isDragReject) return 'error.light';
    if (isDragActive) return 'primary.light';
    return 'grey.50';
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <Box>
      {!selectedFile ? (
        <Box
          {...getRootProps()}
          sx={{
            border: `2px dashed ${getBorderColor()}`,
            backgroundColor: getBackgroundColor(),
            borderRadius: 2,
            p: 4,
            textAlign: 'center',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            '&:hover': {
              borderColor: 'primary.main',
              backgroundColor: 'primary.light',
            },
            minHeight: 200,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          role="button"
          tabIndex={0}
          aria-label="Drag and drop video file here or click to select"
        >
          <input {...getInputProps()} />
          <CloudUpload sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
          <Typography variant="h6" gutterBottom>
            {isDragActive ? 'Drop the video here' : 'Drag & drop a video file here'}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            or click to select a file
          </Typography>
          <Typography variant="caption" color="text.secondary" sx={{ mt: 1 }}>
            Supported formats: MP4, AVI, MOV, WMV, FLV, WebM, MKV (max 500MB)
          </Typography>
          {isDragReject && (
            <Typography variant="body2" color="error" sx={{ mt: 1 }}>
              File type not supported or file too large
            </Typography>
          )}
        </Box>
      ) : (
        <Box
          sx={{
            border: '2px solid',
            borderColor: 'primary.main',
            borderRadius: 2,
            p: 2,
            display: 'flex',
            alignItems: 'center',
            backgroundColor: 'primary.light',
          }}
        >
          <VideoFile sx={{ fontSize: 40, color: 'primary.main', mr: 2 }} />
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="body1" fontWeight="bold">
              {selectedFile.name}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {formatFileSize(selectedFile.size)}
            </Typography>
          </Box>
          <IconButton onClick={onRemoveFile} aria-label="Remove file">
            <Close />
          </IconButton>
        </Box>
      )}
    </Box>
  );
};

export default DragDropZone;