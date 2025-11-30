import React from 'react';
import { LinearProgress, Typography, Box } from '@mui/material';

const ProgressTracker = ({ progress, status }) => {
  return (
    <Box sx={{ width: '100%', mt: 2 }}>
      <Typography variant="body2" color="text.secondary">
        Upload Status: {status}
      </Typography>
      <LinearProgress variant="determinate" value={progress} />
      <Typography variant="body2" color="text.secondary">
        {progress}%
      </Typography>
    </Box>
  );
};

export default ProgressTracker;