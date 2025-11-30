# YouTube Uploader App - Comprehensive Development Guide

## 1. Overview of the App

The YouTube Uploader App is a web-based application that allows users to upload videos to YouTube seamlessly. Key features include:

- **User Authentication**: OAuth 2.0 integration with Google for secure login and access to YouTube accounts.
- **Video Upload**: Support for uploading video files with metadata (title, description, tags).
- **Progress Tracking**: Real-time monitoring of upload status and progress.
- **File Storage**: Secure storage of video files in AWS S3 before uploading to YouTube.
- **Workflow Automation**: Integration with n8n for post-upload tasks like notifications or scheduling.
- **Multi-User Support**: Basic user management with database persistence.

The app is built with a modern tech stack: Node.js/Express backend, React frontend, PostgreSQL database, AWS S3 for storage, and Docker for deployment. It emphasizes simplicity, scalability, and security.

## 2. Prerequisites

Before starting development, ensure the following are installed and configured:

- **Node.js** (v16 or later) and npm
- **PostgreSQL** database (local or cloud instance)
- **AWS Account** with access to S3, ECS, RDS, and CloudWatch
- **Google Cloud Console** account for YouTube Data API v3 credentials
- **n8n** instance (self-hosted or cloud)
- **Docker** and Docker Compose for containerization
- **Git** for version control
- **VS Code** or preferred IDE with extensions for JavaScript/React
- **Postman** or similar for API testing

Obtain API keys and credentials:
- Google OAuth client ID and secret
- YouTube Data API key
- AWS access keys and S3 bucket
- n8n webhook URLs

## 3. Step-by-Step Development Plan

1. **Project Initialization**
   - Create project directory structure
   - Initialize Git repository
   - Set up package.json for backend and frontend

2. **Backend Setup**
   - Install Express.js and dependencies
   - Configure database connection with Sequelize
   - Implement basic server structure

3. **Authentication Implementation**
   - Set up OAuth 2.0 flow with Google
   - Create user model and session management

4. **Frontend Setup**
   - Initialize React app
   - Set up routing and basic components

5. **Video Upload Functionality**
   - Implement file upload handling
   - Integrate AWS S3 for storage
   - Create upload service

6. **YouTube API Integration**
   - Implement YouTube Data API client
   - Handle video uploads to YouTube

7. **Progress Tracking**
   - Add real-time progress updates
   - Implement WebSocket or polling for status

8. **n8n Integration**
   - Set up webhooks for workflow automation
   - Configure post-upload triggers

9. **Security and Validation**
   - Add input validation, rate limiting, CORS
   - Implement JWT for sessions

10. **Testing and Quality Assurance**
    - Write unit and integration tests
    - Perform end-to-end testing

11. **Deployment Preparation**
    - Dockerize the application
    - Configure environment variables
    - Set up CI/CD pipeline

12. **Deployment and Monitoring**
    - Deploy to AWS ECS
    - Configure monitoring and logging

## 4. Code Structure and Organization

```
yt_uploader/
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   │   ├── authController.js
│   │   │   ├── uploadController.js
│   │   │   └── videoController.js
│   │   ├── models/
│   │   │   ├── User.js
│   │   │   └── Video.js
│   │   ├── routes/
│   │   │   ├── auth.js
│   │   │   ├── upload.js
│   │   │   └── videos.js
│   │   ├── services/
│   │   │   ├── oauthService.js
│   │   │   ├── youtubeService.js
│   │   │   ├── uploadService.js
│   │   │   └── n8nService.js
│   │   ├── middleware/
│   │   │   ├── auth.js
│   │   │   ├── upload.js
│   │   │   └── validation.js
│   │   ├── config/
│   │   │   ├── database.js
│   │   │   └── index.js
│   │   └── app.js
│   ├── package.json
│   ├── server.js
│   └── Dockerfile
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Auth/
│   │   │   ├── Upload/
│   │   │   ├── VideoList/
│   │   │   └── Progress/
│   │   ├── pages/
│   │   │   ├── Login.js
│   │   │   ├── Dashboard.js
│   │   │   └── Upload.js
│   │   ├── services/
│   │   │   ├── api.js
│   │   │   └── auth.js
│   │   ├── App.js
│   │   └── index.js
│   ├── package.json
│   └── Dockerfile
├── docker-compose.yml
├── .env.example
├── README.md
└── docs/
    └── architecture.md
```

## 5. Key Components Implementation Details

### Backend Components

- **Web Server (Express.js)**:
  - Use Express to handle HTTP requests
  - Implement middleware for CORS, body parsing, and logging
  - Define routes for auth, upload, and video management

- **OAuth Handler**:
  - Use `passport-google-oauth20` for Google authentication
  - Store access and refresh tokens securely
  - Handle token refresh for long-term access

- **Upload Service**:
  - Use `multer` for file uploads
  - Validate file types (video formats)
  - Upload to S3 using `aws-sdk`
  - Queue uploads for processing

- **Database Layer**:
  - Use Sequelize ORM for PostgreSQL
  - Define User and Video models with relationships
  - Implement migrations for schema changes

- **YouTube API Client**:
  - Use `googleapis` library
  - Authenticate with OAuth tokens
  - Upload videos with metadata
  - Handle API rate limits and errors

- **Progress Tracker**:
  - Use Socket.io for real-time updates
  - Update progress in database
  - Send status to frontend

- **n8n Integration**:
  - Send HTTP requests to n8n webhooks
  - Trigger workflows on upload events

### Frontend Components

- **Authentication Components**:
  - Login button redirecting to OAuth
  - Handle callback and store session

- **Upload Interface**:
  - File input with drag-and-drop
  - Form for metadata input
  - Progress bar component

- **Video Management**:
  - List component for uploaded videos
  - Delete functionality

## 6. Integrations

### YouTube OAuth and API

1. Set up Google Cloud project and enable YouTube Data API v3
2. Configure OAuth consent screen
3. Implement OAuth flow in backend
4. Use API client for uploads:
   ```javascript
   const youtube = google.youtube({ version: 'v3', auth: oauth2Client });
   const response = await youtube.videos.insert({
     part: 'snippet,status',
     requestBody: {
       snippet: { title, description },
       status: { privacyStatus: 'private' }
     },
     media: { body: fs.createReadStream(filePath) }
   });
   ```

### n8n Workflows

1. Create n8n workflow with webhook trigger
2. Configure nodes for email notifications, scheduling, etc.
3. Send POST requests from app on upload completion:
   ```javascript
   axios.post(n8nWebhookUrl, { videoId, userEmail, status });
   ```

## 7. Testing Strategies

- **Unit Tests**: Use Jest for backend services and React Testing Library for components
- **Integration Tests**: Test API endpoints with Supertest
- **End-to-End Tests**: Use Cypress for full user flows
- **API Testing**: Use Postman for manual testing
- **Load Testing**: Use Artillery for performance testing

## 8. Deployment Steps

1. **Containerization**:
   - Create Dockerfiles for backend and frontend
   - Use multi-stage builds for optimization

2. **AWS Setup**:
   - Create ECS cluster and services
   - Set up RDS PostgreSQL instance
   - Configure S3 bucket and IAM roles

3. **CI/CD**:
   - Use GitHub Actions for automated builds
   - Push images to ECR
   - Deploy to ECS on push to main branch

4. **Monitoring**:
   - Set up CloudWatch for logs and metrics
   - Configure alerts for errors and performance

5. **Security**:
   - Use HTTPS with AWS Certificate Manager
   - Implement WAF for protection
   - Regular security audits

This guide provides a complete roadmap for developing the YouTube Uploader App. Follow the steps sequentially, implementing and testing each component before moving to the next. Refer to the architecture.md for detailed specifications.