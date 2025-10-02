# MTO Maintenance Plan - Deployment Guide

## Overview
A comprehensive Military Transport Operations maintenance management system with session-based authentication, cloud storage, PDF reports, and WhatsApp notifications.

## Features
- 🔐 **Session-Based Authentication** - Secure user sessions with device tracking
- 🆔 **UN ID System** - Unique identification numbers for all task orders
- 📸 **Cloud Photo Storage** - Automatic photo upload with 7-day auto-deletion
- 📄 **PDF Completion Reports** - Automated PDF generation and cloud storage
- 📧 **Email Notifications** - Task creation and completion notifications
- 📱 **WhatsApp Integration** - PDF reports sent via WhatsApp
- 👥 **Role-Based Access Control** - Military hierarchy with proper permissions
- 🚗 **Real Vehicle Data** - Integration with actual vehicle inventory (180+ vehicles)

## Tech Stack

### Backend
- **Node.js** with Express.js
- **MongoDB** with Mongoose
- **Session Management** with express-session + MongoDB store
- **File Upload** with Multer + Cloudinary
- **PDF Generation** with PDFKit
- **Email Service** with Nodemailer (Gmail)
- **WhatsApp** with Twilio
- **Security** with Helmet, Rate Limiting, CORS

### Frontend
- **React** with Vite
- **Axios** for API calls
- **Session Management** with localStorage
- **Responsive Design** with CSS Grid/Flexbox

## Environment Setup

### Required Environment Variables

Create `.env` file in backend directory:

```env
# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/mto-maintenance?retryWrites=true&w=majority
NODE_ENV=production
PORT=5000

# Session Security
SESSION_SECRET=your-super-secret-session-key-here-make-it-long-and-random
SESSION_NAME=mto_session
JWT_SECRET=your-jwt-secret-key-here-also-make-it-very-secure
JWT_EXPIRES_IN=24h

# Email Configuration (Gmail)
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-specific-password

# Cloudinary (Image Storage)
CLOUDINARY_CLOUD_NAME=your-cloudinary-cloud-name
CLOUDINARY_API_KEY=your-cloudinary-api-key
CLOUDINARY_API_SECRET=your-cloudinary-api-secret

# Twilio (WhatsApp)
TWILIO_ACCOUNT_SID=your-twilio-account-sid
TWILIO_AUTH_TOKEN=your-twilio-auth-token
TWILIO_WHATSAPP_NUMBER=whatsapp:+14155238886

# Security
FRONTEND_URL=https://your-vercel-frontend-url.vercel.app
BCRYPT_SALT_ROUNDS=12
MAX_LOGIN_ATTEMPTS=5
```

Create `.env.local` file in frontend directory:

```env
VITE_API_URL=https://your-vercel-backend-url.vercel.app/api
```

## Service Setup Guide

### 1. MongoDB Atlas Setup
1. Create account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create new cluster
3. Create database user
4. Whitelist IP addresses (0.0.0.0/0 for Vercel)
5. Get connection string

### 2. Cloudinary Setup
1. Create account at [Cloudinary](https://cloudinary.com/)
2. Go to Dashboard
3. Copy Cloud Name, API Key, and API Secret
4. Configure upload presets (optional)

### 3. Gmail Setup (for emails)
1. Enable 2-Factor Authentication on Gmail
2. Generate App-Specific Password:
   - Google Account → Security → 2-Step Verification → App passwords
3. Use app password in EMAIL_PASSWORD

### 4. Twilio Setup (for WhatsApp)
1. Create account at [Twilio](https://www.twilio.com/)
2. Go to Console Dashboard
3. Copy Account SID and Auth Token
4. Enable WhatsApp Sandbox:
   - Console → Develop → Messaging → Try it out → Send a WhatsApp message
5. Get WhatsApp number (sandbox: whatsapp:+14155238886)

## Vercel Deployment

### Backend Deployment

1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Deploy Backend**
   ```bash
   cd backend
   vercel --prod
   ```

3. **Set Environment Variables in Vercel**
   - Go to Vercel Dashboard → Project → Settings → Environment Variables
   - Add all environment variables from `.env`

### Frontend Deployment

1. **Deploy Frontend**
   ```bash
   cd frontend
   vercel --prod
   ```

2. **Update Environment Variables**
   - Set `VITE_API_URL` to your backend Vercel URL

### Complete Deployment Steps

1. **Clone and Setup**
   ```bash
   git clone <repository-url>
   cd MTO-Maint-Plan
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   # Create .env file with all variables
   vercel --prod
   ```

3. **Frontend Setup**
   ```bash
   cd ../frontend
   npm install
   # Create .env.local with VITE_API_URL
   vercel --prod
   ```

4. **Configure Vercel Environment Variables**
   - Backend: Add all environment variables
   - Frontend: Add VITE_API_URL

## User Roles and Permissions

### Role Hierarchy
1. **Commanding Officer** - Full system access
2. **Transport Officer** - Approves task orders
3. **Maintenance Officer** - Manages maintenance operations
4. **Transport JCO** - Creates task orders
5. **Maintenance JCO** - Executes maintenance tasks

### Workflow
1. **Transport JCO** creates task order with photos
2. **Transport Officer** approves task order
3. **Maintenance JCO** receives approved task and starts work
4. **Maintenance JCO** completes task with photos and report
5. **System** generates PDF report and sends via WhatsApp
6. **Email notifications** sent to relevant stakeholders

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/validate` - Validate session
- `GET /api/auth/profile` - Get user profile

### Task Orders
- `POST /api/task-orders` - Create task order (with photos)
- `GET /api/task-orders` - Get all task orders (filtered by role)
- `GET /api/task-orders/:id` - Get specific task order
- `PATCH /api/task-orders/:id/approve` - Approve task order
- `PATCH /api/task-orders/:id/complete` - Complete task order (with photos)

### Data Models
- `GET /api/drivers` - Get all drivers
- `GET /api/equipment` - Get all vehicles
- `GET /api/maintenance` - Get maintenance schedules

## Security Features

- **Session Management**: Secure sessions with MongoDB store
- **Rate Limiting**: API rate limiting (100 requests/15 minutes)
- **CORS Protection**: Configured for production domains
- **Helmet Security**: Security headers protection
- **Input Validation**: Express-validator for all inputs
- **File Upload Security**: File type and size validation
- **Password Hashing**: bcrypt with salt rounds
- **Device Tracking**: Session includes device information

## Monitoring and Maintenance

### Photo Cleanup
- Automatic cleanup runs every 24 hours
- Deletes photos older than 7 days from Cloudinary
- Reduces storage costs

### Session Management
- Sessions expire after 24 hours
- Automatic cleanup of expired sessions
- Multiple device support

### Error Handling
- Global error handler with proper status codes
- Detailed logging for debugging
- Production-safe error messages

## Testing Checklist

### Pre-Deployment
- [ ] All environment variables configured
- [ ] MongoDB connection working
- [ ] Cloudinary upload working
- [ ] Email sending working
- [ ] WhatsApp sending working
- [ ] All API endpoints responding
- [ ] Frontend authentication flow working
- [ ] File upload working
- [ ] PDF generation working

### Post-Deployment
- [ ] Production URLs updated in environment variables
- [ ] CORS configured for production domains
- [ ] SSL certificates working
- [ ] Database permissions correct
- [ ] File upload limits appropriate
- [ ] Email notifications working
- [ ] WhatsApp notifications working
- [ ] User registration and login working
- [ ] Task order creation and completion working

## Support and Troubleshooting

### Common Issues

1. **Database Connection Failed**
   - Check MongoDB URI and network access
   - Verify IP whitelist includes 0.0.0.0/0

2. **File Upload Failed**
   - Check Cloudinary credentials
   - Verify file size limits (10MB default)

3. **Email Not Sending**
   - Verify Gmail app password
   - Check firewall/network restrictions

4. **WhatsApp Not Working**
   - Verify Twilio credentials
   - Check WhatsApp sandbox setup

5. **Session Issues**
   - Check SESSION_SECRET configuration
   - Verify MongoDB session store connection

### Performance Optimization

- Enable compression middleware
- Use CDN for static assets
- Optimize database queries with indexes
- Implement caching for frequently accessed data
- Use image optimization in Cloudinary

## Version Information

- **Version**: 2.0.0
- **Last Updated**: October 2024
- **Node.js**: 18.x or higher
- **MongoDB**: 6.x or higher
- **React**: 18.x

## License

Military Use Only - Authorized Personnel Access Required

---

**Note**: This system handles sensitive military data. Ensure all security best practices are followed and access is restricted to authorized personnel only.