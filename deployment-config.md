# SAFEBOT Deployment Configuration

## Required Environment Variables

### Backend (.env file in `/backend/` directory)

```env
# Database Configuration
MONGODB_URI=mongodb://localhost:27017/safebot

# Server Configuration  
PORT=5000
NODE_ENV=development
BACKEND_URL=http://localhost:5000

# Authentication Gateway URL
AUTH_GATEWAY_URL=http://localhost:3000/auth-gateway

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-here

# Telegram Bot Configuration
TELEGRAM_BOT_TOKEN=7697842660:AAFW1FFL6A3z5RgJ588yIAoNsxiXj9XQiWA

# CORS Configuration
FRONTEND_URL=http://localhost:5173
```

## Setup Instructions

### 1. Backend Setup
```bash
cd backend
npm install
# Create .env file with above variables
npm start
```

### 2. Frontend Setup  
```bash
cd safebot-ui
npm install
npm run dev
```

### 3. Auth Gateway Setup
```bash
# Serve the auth-gateway folder on port 3000
# You can use any static file server like:
npx serve auth-gateway -p 3000
# or
python -m http.server 3000
# or use live-server, http-server, etc.
```

### 4. Database Setup
- Ensure MongoDB is running
- The app will create collections automatically
- Use the `/api/auth/add-sample-students` endpoint to add test data

## Testing the Authentication Flow

1. **Start all services:**
   - Backend API (port 5000)
   - Auth Gateway (port 3000) 
   - MongoDB
   - Telegram Bot

2. **Test the flow:**
   - Go to https://t.me/UMaT_safebot
   - Click "Start"
   - Click "Verify Student Status"
   - Use sample student data:
     - Name: John Kwame Asante
     - Index: BCS/21/001

3. **Add sample students:**
   ```bash
   curl -X POST http://localhost:5000/api/auth/add-sample-students
   ```

## Production Deployment

### Security Considerations
- Use HTTPS for all endpoints
- Set strong JWT secrets
- Use environment-specific database connections
- Enable rate limiting
- Add request validation
- Use Redis for session storage (instead of in-memory)

### Telegram Bot Setup
- Set webhook URL for production
- Configure proper error handling
- Add logging and monitoring

### Database
- Use MongoDB Atlas or managed MongoDB
- Set up proper indexes
- Configure backup strategies
- Monitor performance

## API Endpoints

### Authentication
- `POST /api/auth/verify-student` - Verify student credentials
- `POST /api/auth/confirm-verification` - Confirm verification from Telegram
- `GET /api/auth/verification-status/:chatId` - Check verification status
- `POST /api/auth/revoke-verification` - Revoke student verification
- `POST /api/auth/add-sample-students` - Add test data (development only)

### Standard Routes
- `POST /api/users/register` - User registration  
- `POST /api/users/login` - User login
- `POST /api/incidents` - Create incident report
- `GET /api/incidents` - Get incidents (admin only)
