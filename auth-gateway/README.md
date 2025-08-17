# 🛡️ UMaT SAFEBOT - Authentication Gateway

A secure student verification portal for the University of Mines and Technology (UMaT) safety reporting system.

## 🚀 Quick Start Guide

### Prerequisites
- Node.js (v16 or higher)
- NPM or Yarn package manager
- MongoDB (local installation) or MongoDB Atlas account
- A valid Telegram bot token from @BotFather

### 🔧 Setup Instructions

#### 1. Get Your Telegram Bot Token
1. Open Telegram and search for `@BotFather`
2. Send `/newbot` or `/token` to get your existing bot token
3. Copy the token (format: `1234567890:ABCdefGHijklMNopQRstuvWXYZ`)

#### 2. Setup MongoDB Database
Choose one of these options:

**Option A: Local MongoDB**
1. Install MongoDB Community Server from https://www.mongodb.com/try/download/community
2. Start MongoDB service:
   ```bash
   # Windows
   net start MongoDB
   
   # macOS
   brew services start mongodb/brew/mongodb-community
   
   # Linux
   sudo systemctl start mongod
   ```

**Option B: MongoDB Atlas (Cloud)**
1. Create free account at https://www.mongodb.com/atlas
2. Create a new cluster
3. Get connection string from "Connect" > "Connect your application"
4. Replace `<password>` and `<dbname>` in connection string

#### 3. Configure Environment Variables
1. Navigate to the `backend` directory
2. Copy `.env.example` to `.env`:
   ```bash
   cd backend
   copy .env.example .env
   ```
3. Edit the `.env` file:
   ```env
   # MongoDB Configuration
   MONGO_URI=mongodb://localhost:27017/safebot-db  # Local MongoDB
   # OR for Atlas:
   # MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/safebot-db
   
   # Telegram Bot Token
   TELEGRAM_BOT_TOKEN=YOUR_ACTUAL_BOT_TOKEN_HERE
   ```

#### 3. Install Dependencies
```bash
# In the backend directory
cd backend
npm install
```

#### 4. Start the Services

**Terminal 1: Start Backend API**
```bash
cd backend
npm start
```
*Backend will run on http://localhost:5000*

**Terminal 2: Start Auth Gateway**
```bash
# From project root
npx serve auth-gateway -p 3000
```
*Auth Gateway will run on http://localhost:3000*

### 🧪 Testing the Application

#### Add Test Student Data
```bash
# Add the two test students to MongoDB
curl -X POST http://localhost:5000/api/auth/add-test-students
```

#### Test Students Available (Always use these two for testing)
- **John Kwame Asante** - Index: `BCS/21/001` - Computer Science
- **Sarah Akosua Mensah** - Index: `ENG/20/045` - Electrical Engineering

*These are the only two student accounts created for verification testing. Use these credentials to test the verification flow.*

### 📱 Using the Telegram Bot

1. **Start the bot**: Go to your Telegram bot (e.g., `@UMaT_safebot`)
2. **Send `/start`**: The bot will provide a verification link
3. **Verify identity**: Click the link and enter student credentials
4. **Return to Telegram**: Complete verification and start reporting

### 🔄 Verification Flow

```
User sends /start → Bot generates session → User clicks verification link → 
Student enters credentials → Portal verifies against database → 
User returns to Telegram → Bot confirms verification → User can report incidents
```

### 🛠️ Development Commands

```bash
# Add test students to MongoDB
curl -X POST http://localhost:5000/api/auth/add-test-students

# View demo endpoints
curl http://localhost:5000/api/test/verify-demo

# Create test session
curl -X POST http://localhost:5000/api/test/create-session \
  -H "Content-Type: application/json" \
  -d '{"chatId":"test-123"}'

# Check verification status
curl http://localhost:5000/api/auth/verification-status/CHAT_ID
```

### 🚨 Troubleshooting

**Bot token errors (401 Unauthorized):**
- Verify token is correct in `.env` file
- Ensure no extra spaces in token
- Get fresh token from @BotFather if needed

**Connection errors:**
- Check if both services are running
- Verify ports 3000 and 5000 are available
- Ensure MongoDB connection (or use `USE_MOCK_DB=true`)

**Verification failures:**
- Use exact student names and index numbers
- Check sample data was loaded successfully
- Verify auth gateway is accessible

### 📊 API Endpoints

- `POST /api/auth/verify-student` - Verify student credentials
- `POST /api/auth/confirm-verification` - Confirm verification from Telegram  
- `GET /api/auth/verification-status/:chatId` - Check verification status
- `POST /api/auth/add-sample-students` - Add test student data

### 🔐 Security Features

- ✅ Session-based verification with expiry
- ✅ Secure token generation and validation
- ✅ Input sanitization and validation
- ✅ CORS protection
- ✅ Rate limiting ready for production

### 📝 Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `TELEGRAM_BOT_TOKEN` | Bot token from @BotFather | `1234567890:ABC...` |
| `MONGO_URI` | MongoDB connection string | `mongodb://localhost:27017/safebot-db` |
| `USE_MOCK_DB` | Use mock database for testing | `true` |
| `BACKEND_URL` | Backend API URL | `http://localhost:5000` |
| `AUTH_GATEWAY_URL` | Auth gateway URL | `http://localhost:3000` |

---

**🎓 Ready to secure UMaT campus with SAFEBOT!**
