import React from 'react';
import { List, ListItem, ListItemText, Typography } from '@mui/material';

const VideoList = ({ videos }) => {
  return (
    <div>
      <Typography variant="h6" gutterBottom>
        Uploaded Videos
      </Typography>
      <List>
        {videos.map(video => (
          <ListItem key={video.id}>
            <ListItemText
              primary={video.title}
              secondary={`Status: ${video.status} | Progress: ${video.progress}%`}
            />
          </ListItem>
        ))}
      </List>
    </div>
  );
};

export default VideoList;