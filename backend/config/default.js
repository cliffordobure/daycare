export default {
  // Server Configuration
  port: process.env.PORT || 5000,
  nodeEnv: process.env.NODE_ENV || "development",

  // MongoDB Connection
  mongoUri: process.env.MONGO_URI || "mongodb+srv://cliffobure:cliff0759466446@daycare.ok9locw.mongodb.net/?retryWrites=true&w=majority&appName=daycare",

  // JWT Configuration
  jwtSecret:
    process.env.JWT_SECRET ||
    "your-super-secret-jwt-key-change-this-in-production",
  jwtExpire: process.env.JWT_EXPIRE || "30d",
  jwtCookieExpire: process.env.JWT_COOKIE_EXPIRE || 30,

  // Frontend URL
  frontendUrl: process.env.FRONTEND_URL || "http://localhost:3000",

  // Twilio Configuration (for SMS)
  twilio: {
    accountSid: process.env.TWILIO_ACCOUNT_SID || null,
    authToken: process.env.TWILIO_AUTH_TOKEN || null,
    phoneNumber: process.env.TWILIO_PHONE_NUMBER || null,    
  },

  // Email Configuration (for nodemailer)
  email: {
    host: process.env.SMTP_HOST || "smtp.gmail.com",
    port: process.env.SMTP_PORT || 587,
    user: process.env.SMTP_USER || null,
    pass: process.env.SMTP_PASS || null,
    from: process.env.SMTP_USER || null,
  },

  // Cloudinary Configuration (for file uploads)
  cloudinary: {
    cloudName: process.env.CLOUDINARY_CLOUD_NAME || null,
    apiKey: process.env.CLOUDINARY_API_KEY || null,
    apiSecret: process.env.CLOUDINARY_API_SECRET || null,
  },

  // File Upload Limits
  maxFileSize: process.env.MAX_FILE_SIZE || 5242880,
  maxFiles: process.env.MAX_FILES || 5,

  // Rate Limiting
  rateLimit: {
    windowMs: process.env.RATE_LIMIT_WINDOW_MS || 900000,
    max: process.env.RATE_LIMIT_MAX || 100,
  },
};
