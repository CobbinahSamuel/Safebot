# 🧪 UMaT SAFEBOT - Testing Guide

Complete testing guide for the UMaT SAFEBOT system with real MongoDB integration.

## 📋 System Status

### ✅ Completed Updates
- **Analytics page** integrated with real backend data
- **Incident model** updated with status and response time fields
- **API endpoints** created for incident management
- **Sample data generator** ready for testing
- **Frontend-backend** integration completed
- **Removed UX clutter** - incident categories and response metrics cards

### 🔧 Current Setup
- **Backend**: Ready (requires MongoDB connection)
- **Frontend**: Running on http://localhost:5175/
- **Auth Gateway**: Ready for testing
- **Telegram Bot**: Configured for verification

## 🚀 Quick Start Testing

### 1. Connect MongoDB
Choose one option:
```bash
# Option A: Local MongoDB
net start MongoDB

# Option B: MongoDB Atlas
# Update MONGO_URI in .env with your Atlas connection string
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/safebot-db
```

### 2. Start Backend
```bash
cd backend
npm start
# Should show "Connected to MongoDB" if successful
```

### 3. Create Sample Data
```bash
# Add sample incidents for analytics testing
Invoke-WebRequest -Uri "http://localhost:5000/api/incidents/add-sample-data" -Method POST

# Add test students for verification
Invoke-WebRequest -Uri "http://localhost:5000/api/auth/add-test-students" -Method POST
```

## 📊 Analytics Testing

### Expected Analytics Data
With sample data, Analytics page should show:
- **6 total incidents** (various categories and statuses)
- **Success Rate**: ~67% (4 resolved/closed out of 6)
- **Avg Response Time**: ~20 minutes
- **Status Distribution**: 
  - 1 pending
  - 2 investigating  
  - 2 resolved
  - 1 closed

### Analytics API Endpoint
```bash
GET http://localhost:5000/api/incidents
```

Response format:
```json
[
  {
    "_id": "...",
    "title": "Incident Title",
    "category": "harassment", 
    "description": "Detailed description",
    "location": "Campus location",
    "urgency": "high",
    "status": "resolved",
    "anonymous": true,
    "contact_email": "email@umat.edu.gh",
    "incident_date": "2025-01-15T...",
    "created_date": "2025-01-15T...", 
    "response_time": 15
  }
]
```

## 🛡️ Verification System Testing

### Test Students Available
Use these credentials for verification testing:
- **Name**: John Kwame Asante, **Index**: BCS/21/001
- **Name**: Sarah Akosua Mensah, **Index**: ENG/20/045

### Verification Flow Test
1. Go to http://localhost:3000 (auth gateway)
2. Enter test student credentials
3. Should redirect to Telegram with verification token
4. Bot should confirm verification

## 🔗 API Endpoints Reference

### Incident Management
```bash
# Get all incidents
GET /api/incidents

# Create new incident  
POST /api/incidents
{
  "incidentTitle": "Brief title",
  "category": "Harassment",
  "detailedDescription": "Full description", 
  "location": "Campus location",
  "whenOccurred": "2025-01-15T10:00:00Z",
  "urgencyLevel": "High",
  "submitAnonymously": true,
  "contactEmail": "email@umat.edu.gh"
}

# Add sample incidents for testing
POST /api/incidents/add-sample-data
```

### Student Verification
```bash
# Add test students
POST /api/auth/add-test-students

# Verify student credentials
POST /api/auth/verify-student
{
  "fullName": "John Kwame Asante",
  "indexNumber": "BCS/21/001"
}

# Confirm verification
POST /api/auth/confirm-verification
{
  "verificationToken": "token_here",
  "chatId": "telegram_chat_id",
  "userId": "telegram_user_id"
}
```

## 🎯 Testing Checklist

### Backend API Testing
- [ ] MongoDB connection successful
- [ ] Sample incidents created (6 records)
- [ ] Test students created (2 records)
- [ ] GET /api/incidents returns data
- [ ] POST /api/incidents creates new incident
- [ ] Verification endpoints working

### Frontend Testing  
- [ ] Analytics page loads without errors
- [ ] Real data displayed in analytics cards
- [ ] Incident categories card removed
- [ ] Response metrics card removed
- [ ] Success rate calculated correctly
- [ ] Response time averaged correctly

### Integration Testing
- [ ] Frontend fetches data from backend
- [ ] Analytics updates with new incidents
- [ ] Auth gateway connects to backend
- [ ] Telegram bot verification flow
- [ ] End-to-end incident reporting

## 🔧 Troubleshooting

### MongoDB Connection Issues
```bash
# Check if MongoDB service is running
sc query type=service | findstr -i mongo

# Restart MongoDB service
net stop MongoDB
net start MongoDB
```

### Backend Errors
- **ECONNREFUSED**: MongoDB not running
- **Port 5000 in use**: Kill existing Node process
- **Module not found**: Run `npm install` in backend directory

### Frontend Errors
- **Network Error**: Backend not running on port 5000
- **CORS Error**: Check CORS_ORIGIN in backend .env
- **Module not found**: Run `npm install` in safebot-ui directory

## 📈 Sample Data Details

The sample data includes realistic incidents:
1. **Suspicious Activity** - investigating, 15min response
2. **Harassment Incident** - resolved, 8min response  
3. **Theft Report** - pending, no response yet
4. **Safety Violation** - resolved, 45min response
5. **Accident Report** - closed, 5min response
6. **Vandalism** - investigating, 30min response

This provides good test coverage for analytics calculations and status distributions.
