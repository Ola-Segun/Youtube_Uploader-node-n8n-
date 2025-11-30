# Comprehensive Implementation Instructions for YouTube Uploader App

These instructions provide detailed, step-by-step code-level guidance for implementing the YouTube Uploader App based on the development guide and architecture specifications. Each section includes terminal commands, code snippets, configuration files, API setups, and troubleshooting tips. Ensure all prerequisites from the guide are met before starting.

## 1. Project Setup

### Directory Structure and Initialization

1. Create the project directory structure as specified in the guide:

   ```bash
   mkdir yt_uploader
   cd yt_uploader
   mkdir -p backend/src/{controllers,models,routes,services,middleware,config} frontend/src/{components/{Auth,Upload,VideoList,Progress},pages,services} docs
   ```

2. Initialize Git repository:

   ```bash
   git init
   echo "node_modules/" > .gitignore
   echo ".env" >> .gitignore
   git add .
   git commit -m "Initial project structure"
   ```

3. Set up backend package.json:

   Create `backend/package.json`:

   ```json
   {
     "name": "yt-uploader-backend",
     "version": "1.0.0",
     "main": "server.js",
     "scripts": {
       "start": "node server.js",
       "dev": "nodemon server.js",
       "test": "jest"
     },
     "dependencies": {
       "express": "^4.18.2",
       "sequelize": "^6.35.0",
       "pg": "^8.11.3",
       "passport": "^0.6.0",
       "passport-google-oauth20": "^2.0.0",
       "googleapis": "^118.0.0",
       "multer": "^1.4.5-lts.1",
       "aws-sdk": "^2.1471.0",
       "socket.io": "^4.7.2",
       "axios": "^1.6.0",
       "jsonwebtoken": "^9.0.2",
       "bcryptjs": "^2.4.3",
       "cors": "^2.8.5",
       "helmet": "^7.1.0",
       "express-rate-limit": "^7.1.5",
       "dotenv": "^16.3.1"
     },
     "devDependencies": {
       "nodemon": "^3.0.1",
       "jest": "^29.7.0",
       "supertest": "^6.3.3"
     }
   }
   ```

4. Set up frontend package.json:

   Create `frontend/package.json`:

   ```json
   {
     "name": "yt-uploader-frontend",
     "version": "1.0.0",
     "private": true,
     "dependencies": {
       "react": "^18.2.0",
       "react-dom": "^18.2.0",
       "react-router-dom": "^6.20.1",
       "axios": "^1.6.0",
       "socket.io-client": "^4.7.2",
       "@mui/material": "^5.14.20",
       "@emotion/react": "^11.11.1",
       "@emotion/styled": "^11.11.0"
     },
     "scripts": {
       "start": "react-scripts start",
       "build": "react-scripts build",
       "test": "react-scripts test",
       "eject": "react-scripts eject"
     },
     "eslintConfig": {
       "extends": ["react-app"]
     },
     "browserslist": {
       "production": [">0.2%", "not dead", "not op_mini all"],
       "development": ["last 1 chrome version", "last 1 firefox version", "last 1 safari version"]
     },
     "devDependencies": {
       "react-scripts": "5.0.1",
       "@testing-library/react": "^13.4.0",
       "@testing-library/jest-dom": "^5.16.5",
       "@testing-library/user-event": "^13.5.0"
     }
   }
   ```

5. Install dependencies:

   ```bash
   cd backend
   npm install
   cd ../frontend
   npm install
   cd ..
   ```

   Troubleshooting: If npm install fails, check Node.js version (v16+) and internet connection. Clear npm cache with `npm cache clean --force`.

## 2. Backend Setup

### Express Server and Basic Structure

1. Create `backend/server.js`:

   ```javascript
   require('dotenv').config();
   const express = require('express');
   const http = require('http');
   const socketIo = require('socket.io');
   const cors = require('cors');
   const helmet = require('helmet');
   const rateLimit = require('express-rate-limit');
   const { sequelize } = require('./src/config/database');

   const app = express();
   const server = http.createServer(app);
   const io = socketIo(server, {
     cors: { origin: process.env.FRONTEND_URL || 'http://localhost:3000' }
   });

   app.use(helmet());
   app.use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost:3000' }));
   app.use(express.json());
   app.use(express.urlencoded({ extended: true }));

   const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 100 });
   app.use(limiter);

   // Routes
   app.use('/auth', require('./src/routes/auth'));
   app.use('/upload', require('./src/routes/upload'));
   app.use('/videos', require('./src/routes/videos'));

   // Socket.io for progress tracking
   io.on('connection', (socket) => {
     console.log('User connected:', socket.id);
   });

   const PORT = process.env.PORT || 5000;
   sequelize.sync().then(() => {
     server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
   });

   module.exports = { app, io };
   ```

2. Create `backend/src/app.js`:

   ```javascript
   const express = require('express');
   const app = express();

   // Middleware and routes setup here (similar to server.js but without server listen)

   module.exports = app;
   ```

3. Create `backend/src/config/database.js`:

   ```javascript
   const { Sequelize } = require('sequelize');

   const sequelize = new Sequelize(
     process.env.DB_NAME || 'yt_uploader',
     process.env.DB_USER || 'postgres',
     process.env.DB_PASS || 'password',
     {
       host: process.env.DB_HOST || 'localhost',
       dialect: 'postgres',
       logging: false
     }
   );

   module.exports = { sequelize };
   ```

4. Create `backend/src/config/index.js`:

   ```javascript
   require('dotenv').config();

   module.exports = {
     PORT: process.env.PORT || 5000,
     JWT_SECRET: process.env.JWT_SECRET,
     GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
     GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
     YOUTUBE_API_KEY: process.env.YOUTUBE_API_KEY,
     AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID,
     AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY,
     S3_BUCKET: process.env.S3_BUCKET,
     N8N_WEBHOOK_URL: process.env.N8N_WEBHOOK_URL,
     FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:3000'
   };
   ```

   Troubleshooting: Ensure PostgreSQL is running. Test connection with `psql -U postgres -d yt_uploader`.

## 3. Authentication Implementation

### OAuth 2.0 with Google

1. Create `backend/src/services/oauthService.js`:

   ```javascript
   const { google } = require('googleapis');
   const OAuth2 = google.auth.OAuth2;

   const oauth2Client = new OAuth2(
     process.env.GOOGLE_CLIENT_ID,
     process.env.GOOGLE_CLIENT_SECRET,
     `${process.env.FRONTEND_URL}/auth/callback`
   );

   const scopes = [
     'https://www.googleapis.com/auth/youtube.upload',
     'https://www.googleapis.com/auth/youtube',
     'https://www.googleapis.com/auth/userinfo.email',
     'https://www.googleapis.com/auth/userinfo.profile'
   ];

   module.exports = { oauth2Client, scopes };
   ```

2. Create `backend/src/models/User.js`:

   ```javascript
   const { DataTypes } = require('sequelize');
   const { sequelize } = require('../config/database');

   const User = sequelize.define('User', {
     id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
     email: { type: DataTypes.STRING, unique: true, allowNull: false },
     googleId: { type: DataTypes.STRING, unique: true, allowNull: false },
     accessToken: { type: DataTypes.TEXT },
     refreshToken: { type: DataTypes.TEXT },
     createdAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
   });

   module.exports = User;
   ```

3. Create `backend/src/controllers/authController.js`:

   ```javascript
   const passport = require('passport');
   const GoogleStrategy = require('passport-google-oauth20').Strategy;
   const jwt = require('jsonwebtoken');
   const User = require('../models/User');
   const { oauth2Client } = require('../services/oauthService');

   passport.use(new GoogleStrategy({
     clientID: process.env.GOOGLE_CLIENT_ID,
     clientSecret: process.env.GOOGLE_CLIENT_SECRET,
     callbackURL: `${process.env.FRONTEND_URL}/auth/callback`
   }, async (accessToken, refreshToken, profile, done) => {
     try {
       let user = await User.findOne({ where: { googleId: profile.id } });
       if (!user) {
         user = await User.create({
           email: profile.emails[0].value,
           googleId: profile.id,
           accessToken,
           refreshToken
         });
       } else {
         user.accessToken = accessToken;
         user.refreshToken = refreshToken;
         await user.save();
       }
       return done(null, user);
     } catch (error) {
       return done(error, null);
     }
   }));

   passport.serializeUser((user, done) => done(null, user.id));
   passport.deserializeUser(async (id, done) => {
     try {
       const user = await User.findByPk(id);
       done(null, user);
     } catch (error) {
       done(error, null);
     }
   });

   exports.login = passport.authenticate('google', { scope: ['profile', 'email', 'https://www.googleapis.com/auth/youtube.upload'] });

   exports.callback = passport.authenticate('google', { failureRedirect: '/login' });

   exports.callbackSuccess = (req, res) => {
     const token = jwt.sign({ userId: req.user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
     res.redirect(`${process.env.FRONTEND_URL}/dashboard?token=${token}`);
   };

   exports.logout = (req, res) => {
     req.logout();
     res.redirect(process.env.FRONTEND_URL);
   };
   ```

4. Create `backend/src/routes/auth.js`:

   ```javascript
   const express = require('express');
   const router = express.Router();
   const authController = require('../controllers/authController');

   router.get('/login', authController.login);
   router.get('/callback', authController.callback, authController.callbackSuccess);
   router.get('/logout', authController.logout);

   module.exports = router;
   ```

5. Create `backend/src/middleware/auth.js`:

   ```javascript
   const jwt = require('jsonwebtoken');

   module.exports = (req, res, next) => {
     const token = req.header('Authorization')?.replace('Bearer ', '');
     if (!token) return res.status(401).json({ error: 'Access denied' });

     try {
       const verified = jwt.verify(token, process.env.JWT_SECRET);
       req.user = verified;
       next();
     } catch (error) {
       res.status(400).json({ error: 'Invalid token' });
     }
   };
   ```

   API Setup: In Google Cloud Console, create OAuth 2.0 credentials, set redirect URI to `${FRONTEND_URL}/auth/callback`.

   Troubleshooting: Ensure callback URL matches exactly. Check console for OAuth errors.

## 4. Frontend Setup

### React App and Components

1. Create `frontend/src/App.js`:

   ```javascript
   import React from 'react';
   import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
   import Login from './pages/Login';
   import Dashboard from './pages/Dashboard';
   import Upload from './pages/Upload';

   function App() {
     return (
       <Router>
         <Routes>
           <Route path="/" element={<Login />} />
           <Route path="/dashboard" element={<Dashboard />} />
           <Route path="/upload" element={<Upload />} />
         </Routes>
       </Router>
     );
   }

   export default App;
   ```

2. Create `frontend/src/pages/Login.js`:

   ```javascript
   import React from 'react';

   const Login = () => {
     const handleLogin = () => {
       window.location.href = 'http://localhost:5000/auth/login';
     };

     return (
       <div>
         <h1>YouTube Uploader</h1>
         <button onClick={handleLogin}>Login with Google</button>
       </div>
     );
   };

   export default Login;
   ```

3. Create `frontend/src/pages/Dashboard.js`:

   ```javascript
   import React, { useEffect, useState } from 'react';
   import VideoList from '../components/VideoList/VideoList';

   const Dashboard = () => {
     const [videos, setVideos] = useState([]);

     useEffect(() => {
       // Fetch videos from API
       fetchVideos();
     }, []);

     const fetchVideos = async () => {
       const token = localStorage.getItem('token');
       const response = await fetch('http://localhost:5000/videos', {
         headers: { Authorization: `Bearer ${token}` }
       });
       const data = await response.json();
       setVideos(data);
     };

     return (
       <div>
         <h1>Dashboard</h1>
         <VideoList videos={videos} />
       </div>
     );
   };

   export default Dashboard;
   ```

4. Create `frontend/src/components/VideoList/VideoList.js`:

   ```javascript
   import React from 'react';

   const VideoList = ({ videos }) => {
     return (
       <ul>
         {videos.map(video => (
           <li key={video.id}>
             <h3>{video.title}</h3>
             <p>{video.status}</p>
           </li>
         ))}
       </ul>
     );
   };

   export default VideoList;
   ```

5. Create `frontend/src/services/api.js`:

   ```javascript
   import axios from 'axios';

   const api = axios.create({
     baseURL: 'http://localhost:5000',
     headers: {
       Authorization: `Bearer ${localStorage.getItem('token')}`
     }
   });

   export default api;
   ```

   Troubleshooting: Ensure React app runs on port 3000. Use `npm start` in frontend directory.

## 5. Video Upload Functionality

### File Handling and S3 Integration

1. Create `backend/src/services/uploadService.js`:

   ```javascript
   const AWS = require('aws-sdk');
   const multer = require('multer');
   const path = require('path');

   AWS.config.update({
     accessKeyId: process.env.AWS_ACCESS_KEY_ID,
     secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
     region: 'us-east-1'
   });

   const s3 = new AWS.S3();

   const storage = multer.memoryStorage();
   const upload = multer({
     storage,
     fileFilter: (req, file, cb) => {
       const allowedTypes = /mp4|avi|mov|mkv/;
       const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
       const mimetype = allowedTypes.test(file.mimetype);
       if (mimetype && extname) {
         return cb(null, true);
       } else {
         cb('Error: Videos Only!');
       }
     }
   });

   const uploadToS3 = (file) => {
     const params = {
       Bucket: process.env.S3_BUCKET,
       Key: `${Date.now()}-${file.originalname}`,
       Body: file.buffer,
       ContentType: file.mimetype,
       ACL: 'private'
     };
     return s3.upload(params).promise();
   };

   module.exports = { upload, uploadToS3 };
   ```

2. Create `backend/src/controllers/uploadController.js`:

   ```javascript
   const { upload, uploadToS3 } = require('../services/uploadService');
   const Video = require('../models/Video');
   const { io } = require('../../server');

   exports.uploadVideo = [
     upload.single('video'),
     async (req, res) => {
       try {
         const { title, description } = req.body;
         const userId = req.user.userId;

         // Upload to S3
         const s3Result = await uploadToS3(req.file);

         // Save to DB
         const video = await Video.create({
           userId,
           title,
           description,
           fileUrl: s3Result.Location,
           status: 'pending'
         });

         // Emit progress
         io.emit('uploadProgress', { uploadId: video.id, progress: 0 });

         res.status(201).json({ uploadId: video.id });
       } catch (error) {
         res.status(500).json({ error: error.message });
       }
     }
   ];
   ```

3. Create `backend/src/routes/upload.js`:

   ```javascript
   const express = require('express');
   const router = express.Router();
   const uploadController = require('../controllers/uploadController');
   const auth = require('../middleware/auth');

   router.post('/', auth, uploadController.uploadVideo);

   module.exports = router;
   ```

4. Create `frontend/src/pages/Upload.js`:

   ```javascript
   import React, { useState } from 'react';
   import api from '../services/api';

   const Upload = () => {
     const [file, setFile] = useState(null);
     const [title, setTitle] = useState('');
     const [description, setDescription] = useState('');

     const handleSubmit = async (e) => {
       e.preventDefault();
       const formData = new FormData();
       formData.append('video', file);
       formData.append('title', title);
       formData.append('description', description);

       try {
         const response = await api.post('/upload', formData, {
           headers: { 'Content-Type': 'multipart/form-data' }
         });
         alert('Upload started: ' + response.data.uploadId);
       } catch (error) {
         alert('Upload failed');
       }
     };

     return (
       <form onSubmit={handleSubmit}>
         <input type="file" onChange={(e) => setFile(e.target.files[0])} accept="video/*" />
         <input type="text" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
         <textarea placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
         <button type="submit">Upload</button>
       </form>
     );
   };

   export default Upload;
   ```

   API Setup: Create S3 bucket, set CORS for frontend domain.

   Troubleshooting: Check AWS credentials. Ensure bucket permissions allow uploads.

## 6. YouTube API Integration

### Video Uploads to YouTube

1. Create `backend/src/services/youtubeService.js`:

   ```javascript
   const { google } = require('googleapis');
   const fs = require('fs');
   const path = require('path');
   const AWS = require('aws-sdk');

   const s3 = new AWS.S3();

   const uploadToYouTube = async (video, user) => {
     const oauth2Client = new google.auth.OAuth2();
     oauth2Client.setCredentials({
       access_token: user.accessToken,
       refresh_token: user.refreshToken
     });

     const youtube = google.youtube({ version: 'v3', auth: oauth2Client });

     // Download from S3
     const s3Params = { Bucket: process.env.S3_BUCKET, Key: path.basename(video.fileUrl) };
     const s3Stream = s3.getObject(s3Params).createReadStream();

     const response = await youtube.videos.insert({
       part: 'snippet,status',
       requestBody: {
         snippet: {
           title: video.title,
           description: video.description,
           tags: []
         },
         status: { privacyStatus: 'private' }
       },
       media: { body: s3Stream }
     });

     return response.data.id;
   };

   module.exports = { uploadToYouTube };
   ```

2. Update `backend/src/controllers/uploadController.js` to include YouTube upload:

   ```javascript
   // After S3 upload
   const youtubeId = await uploadToYouTube(video, req.user);
   video.youtubeId = youtubeId;
   video.status = 'completed';
   await video.save();

   io.emit('uploadProgress', { uploadId: video.id, progress: 100 });
   ```

3. Create `backend/src/models/Video.js`:

   ```javascript
   const { DataTypes } = require('sequelize');
   const { sequelize } = require('../config/database');

   const Video = sequelize.define('Video', {
     id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
     userId: { type: DataTypes.UUID, allowNull: false },
     title: { type: DataTypes.STRING, allowNull: false },
     description: { type: DataTypes.TEXT },
     youtubeId: { type: DataTypes.STRING },
     status: { type: DataTypes.ENUM('pending', 'uploading', 'completed', 'failed'), defaultValue: 'pending' },
     progress: { type: DataTypes.INTEGER, defaultValue: 0 },
     fileUrl: { type: DataTypes.STRING, allowNull: false },
     createdAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
     updatedAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
   });

   module.exports = Video;
   ```

   API Setup: Enable YouTube Data API v3 in Google Cloud Console.

   Troubleshooting: Handle token refresh if access token expired. Check API quota limits.

## 7. Progress Tracking

### Real-Time Updates

1. Update `backend/src/controllers/uploadController.js` with progress updates:

   ```javascript
   // During upload
   io.emit('uploadProgress', { uploadId: video.id, progress: 50 }); // Midway
   ```

2. Create `backend/src/routes/videos.js`:

   ```javascript
   const express = require('express');
   const router = express.Router();
   const Video = require('../models/Video');
   const auth = require('../middleware/auth');

   router.get('/', auth, async (req, res) => {
     const videos = await Video.findAll({ where: { userId: req.user.userId } });
     res.json(videos);
   });

   router.get('/progress/:uploadId', auth, async (req, res) => {
     const video = await Video.findByPk(req.params.uploadId);
     res.json({ progress: video.progress, status: video.status });
   });

   module.exports = router;
   ```

3. Update frontend to listen for progress:

   ```javascript
   // In Upload.js or Dashboard.js
   import io from 'socket.io-client';
   const socket = io('http://localhost:5000');

   socket.on('uploadProgress', (data) => {
     console.log('Progress:', data.progress);
     // Update UI
   });
   ```

   Troubleshooting: Ensure Socket.io client and server versions match.

## 8. n8n Integration

### Webhooks for Workflows

1. Create `backend/src/services/n8nService.js`:

   ```javascript
   const axios = require('axios');

   const triggerN8nWorkflow = async (videoId, userEmail, status) => {
     try {
       await axios.post(process.env.N8N_WEBHOOK_URL, {
         videoId,
         userEmail,
         status
       });
     } catch (error) {
       console.error('n8n webhook failed:', error);
     }
   };

   module.exports = { triggerN8nWorkflow };
   ```

2. Update `backend/src/controllers/uploadController.js`:

   ```javascript
   const { triggerN8nWorkflow } = require('../services/n8nService');

   // After YouTube upload
   await triggerN8nWorkflow(video.id, user.email, 'completed');
   ```

   API Setup: Create n8n workflow with webhook trigger, add nodes for email or other actions.

   Troubleshooting: Test webhook URL with Postman. Check n8n logs for errors.

## 9. Security and Validation

### JWT, CORS, Rate Limiting

1. Already implemented in server.js and middleware.

2. Add validation middleware `backend/src/middleware/validation.js`:

   ```javascript
   const Joi = require('joi');

   const videoUploadSchema = Joi.object({
     title: Joi.string().min(1).max(100).required(),
     description: Joi.string().max(5000)
   });

   module.exports = (schema) => (req, res, next) => {
     const { error } = schema.validate(req.body);
     if (error) return res.status(400).json({ error: error.details[0].message });
     next();
   };

   module.exports.videoUpload = (req, res, next) => {
     const { error } = videoUploadSchema.validate(req.body);
     if (error) return res.status(400).json({ error: error.details[0].message });
     next();
   };
   ```

3. Update routes to use validation.

   Troubleshooting: Use tools like OWASP ZAP for security testing.

## 10. Database Setup

### PostgreSQL with Sequelize

1. Install Sequelize CLI globally: `npm install -g sequelize-cli`

2. Initialize Sequelize: `cd backend && sequelize init`

3. Update `backend/config/config.json` for production.

4. Run migrations: `sequelize db:migrate`

5. Create associations in models.

   Troubleshooting: Ensure DB credentials in .env. Run `createdb yt_uploader` if needed.

## 11. Testing

### Unit, Integration, E2E

1. Unit test example `backend/tests/authController.test.js`:

   ```javascript
   const request = require('supertest');
   const app = require('../src/app');

   describe('Auth Controller', () => {
     it('should login', async () => {
       const res = await request(app).get('/auth/login');
       expect(res.statusCode).toEqual(302); // Redirect to Google
     });
   });
   ```

2. Integration test for upload.

3. E2E with Cypress: Create `cypress/integration/upload.spec.js`

   ```javascript
   describe('Upload Flow', () => {
     it('uploads a video', () => {
       cy.visit('/upload');
       cy.get('input[type=file]').selectFile('video.mp4');
       cy.get('input[placeholder="Title"]').type('Test Video');
       cy.get('button[type=submit]').click();
       cy.contains('Upload started');
     });
   });
   ```

   Commands: `npm test` for Jest, `npx cypress run` for E2E.

   Troubleshooting: Mock external APIs in tests.

## 12. Deployment

### Docker, AWS, CI/CD

1. Create `backend/Dockerfile`:

   ```dockerfile
   FROM node:16-alpine
   WORKDIR /app
   COPY package*.json ./
   RUN npm install
   COPY . .
   EXPOSE 5000
   CMD ["npm", "start"]
   ```

2. Create `frontend/Dockerfile`:

   ```dockerfile
   FROM node:16-alpine as build
   WORKDIR /app
   COPY package*.json ./
   RUN npm install
   COPY . .
   RUN npm run build

   FROM nginx:alpine
   COPY --from=build /app/build /usr/share/nginx/html
   EXPOSE 80
   ```

3. Create `docker-compose.yml`:

   ```yaml
   version: '3.8'
   services:
     backend:
       build: ./backend
       ports:
         - "5000:5000"
       environment:
         - DB_HOST=db
       depends_on:
         - db
     frontend:
       build: ./frontend
       ports:
         - "3000:80"
     db:
       image: postgres:13
       environment:
         POSTGRES_DB: yt_uploader
         POSTGRES_USER: postgres
         POSTGRES_PASSWORD: password
   ```

4. AWS Setup: Create ECS cluster, push images to ECR.

5. CI/CD with GitHub Actions: Create `.github/workflows/deploy.yml`

   ```yaml
   name: Deploy to AWS
   on: [push]
   jobs:
     deploy:
       runs-on: ubuntu-latest
       steps:
         - uses: actions/checkout@v2
         - name: Deploy to ECS
           run: aws ecs update-service --cluster yt-uploader --service yt-uploader-service --force-new-deployment
   ```

6. Monitoring: Set up CloudWatch alarms.

   Commands: `docker-compose up --build` for local, `aws ecs create-service` for AWS.

   Troubleshooting: Check logs with `aws logs tail /aws/ecs/yt-uploader`.

This completes the comprehensive implementation instructions. Follow each section sequentially, testing at each step.