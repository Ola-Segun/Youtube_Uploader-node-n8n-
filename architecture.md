# YouTube Uploader App - System Architecture and Technical Specifications

## Overview
The YouTube uploader app enables users to upload videos to YouTube with metadata, supports user authentication, and provides progress tracking. The design focuses on simplicity, functionality, and scalability for basic multi-user use.

## Tech Stack
- **Backend**: Node.js with Express.js (lightweight, scalable web framework)
- **Frontend**: React.js (component-based UI for web interface)
- **Database**: PostgreSQL (relational database for user and video data)
- **Authentication**: OAuth 2.0 (Google/YouTube integration)
- **File Storage**: AWS S3 (cloud storage for video files)
- **Integrations**: YouTube Data API v3, n8n (workflow automation)
- **Deployment**: Docker, AWS ECS (containerized, scalable)

## System Components
- **Web Server**: Express.js server handling HTTP requests and routing
- **OAuth Handler**: Manages Google OAuth flow for user authentication
- **Upload Service**: Processes video uploads, metadata extraction, and file storage
- **Database Layer**: ORM (e.g., Sequelize) for data persistence
- **YouTube API Client**: Handles interactions with YouTube Data API
- **Progress Tracker**: Monitors upload status and provides real-time updates
- **n8n Integration**: Automates workflows like notifications or scheduling

## Data Flow
1. User initiates OAuth login via frontend
2. OAuth handler authenticates with Google and retrieves access token
3. User selects video file and enters metadata on frontend
4. Upload service validates input, stores file in S3, and queues for YouTube upload
5. YouTube API client uploads video using access token and metadata
6. Progress tracker updates status in database and sends real-time updates to frontend
7. n8n workflows trigger on upload completion (e.g., email notifications)

## API Endpoints
- `POST /auth/login`: Initiates OAuth flow, redirects to Google
- `GET /auth/callback`: Handles OAuth callback, stores user session
- `POST /upload`: Accepts video file and metadata, returns upload ID
- `GET /videos`: Lists user's uploaded videos
- `GET /progress/:uploadId`: Returns current upload progress
- `DELETE /videos/:id`: Deletes a video from YouTube and database

## Database Schema
### Users Table
- id (Primary Key, UUID)
- email (String, unique)
- google_id (String, unique)
- access_token (Text)
- refresh_token (Text)
- created_at (Timestamp)

### Videos Table
- id (Primary Key, UUID)
- user_id (Foreign Key to Users)
- title (String)
- description (Text)
- youtube_id (String, nullable)
- status (Enum: pending, uploading, completed, failed)
- progress (Integer, 0-100)
- file_url (String, S3 URL)
- created_at (Timestamp)
- updated_at (Timestamp)

## Integrations
- **YouTube Data API v3**: Used for video uploads, retrieving channel info, and managing uploads
- **n8n**: Automates post-upload tasks such as sending notifications, scheduling content, or integrating with other platforms

## Security Considerations
- HTTPS enforced for all communications
- JWT tokens for session management after OAuth
- Input validation and sanitization for metadata
- Rate limiting on API endpoints to prevent abuse
- Secure storage of OAuth tokens (encrypted in database)
- CORS configured for frontend domain only
- File type validation for video uploads

## Deployment Considerations
- Containerized with Docker for consistent environments
- Deployed on AWS ECS with load balancer for scalability
- Database on AWS RDS PostgreSQL with backups
- File storage on AWS S3 with versioning
- Monitoring with AWS CloudWatch
- Auto-scaling based on traffic
- Environment variables for configuration (API keys, secrets)