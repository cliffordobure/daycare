# Nurtura Backend

This is the backend API for the Nurtura daycare management system.

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Variables

Create a `.env` file in the backend directory with the following variables:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# MongoDB Connection
MONGODB_URI=mongodb://localhost:27017/nurtura

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRE=30d
JWT_COOKIE_EXPIRE=30

# Frontend URL
FRONTEND_URL=http://localhost:3000

# Twilio Configuration (for SMS)
TWILIO_ACCOUNT_SID=your-twilio-account-sid
TWILIO_AUTH_TOKEN=your-twilio-auth-token
TWILIO_PHONE_NUMBER=your-twilio-phone-number

# Email Configuration (for nodemailer)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-email-password

# Cloudinary Configuration (for file uploads)
CLOUDINARY_CLOUD_NAME=your-cloudinary-cloud-name
CLOUDINARY_API_KEY=your-cloudinary-api-key
CLOUDINARY_API_SECRET=your-cloudinary-api-secret
```

### 3. MongoDB Setup

Make sure MongoDB is running on your system, or use MongoDB Atlas.

For local MongoDB:

```bash
# Install MongoDB (Windows)
# Download from https://www.mongodb.com/try/download/community

# Start MongoDB service
net start MongoDB
```

### 4. Run the Server

```bash
# Development mode
npm run dev

# Production mode
npm start
```

## Features

- User authentication and authorization
- Child management
- Class management
- Attendance tracking
- Activity management
- Payment processing
- Communication system
- Health records
- Reporting system
- Real-time notifications via Socket.IO
- SMS notifications via Twilio
- Email notifications via Nodemailer
- File uploads via Cloudinary

## API Endpoints

- `/api/auth` - Authentication routes
- `/api/users` - User management
- `/api/children` - Child management
- `/api/classes` - Class management
- `/api/attendance` - Attendance tracking
- `/api/activities` - Activity management
- `/api/payments` - Payment processing
- `/api/communication` - Communication system
- `/api/health` - Health records
- `/api/reports` - Reporting system

## Notes

- The server will run with default values if environment variables are not set
- SMS and email services will be disabled if credentials are not provided
- Socket.IO will be disabled if JWT secret is not configured
- All routes (except auth) require authentication via JWT token
