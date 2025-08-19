# 🧪 Complete UMaT SAFEBOT Testing Guide

## ✅ System Status - All Services Running!

- **Backend API**: http://localhost:5000 ✅
- **Auth Gateway**: http://localhost:3000 ✅  
- **Frontend**: http://localhost:5173 ✅
- **Database**: MongoDB Atlas ✅ (9 students + 6 incidents loaded)

## 🎯 Complete Flow Testing

### **Step 1: Test Telegram Bot → Auth Gateway Flow**

1. **Open Telegram** and go to your bot: `@UMaT_safebot`
2. **Send `/start`** - You should receive a verification link
3. **Click the verification link** - It should open: `http://localhost:3000?chat_id=XXXXX&session=XXXXX`

### **Step 2: Test Student Verification**

1. **In the Auth Gateway form**, enter these test credentials:
   - **Full Name**: `John Kwame Asante`
   - **Index Number**: `BCS/21/001`
2. **Click "Verify Student Status"**
3. **Expected Result**: Success message + "Return to Telegram" button

### **Step 3: Test Telegram Return & Authentication**

1. **Click "Return to Telegram"** button
2. **Expected Result**: Redirects to `https://t.me/UMaT_safebot?start=verified_XXXXX`
3. **In Telegram**: Should show welcome message with student info

### **Step 4: Test Report Submission**

1. **In Telegram**, send `/report`
2. **Follow the prompts**:
   - Title: `Test incident from integration`
   - Category: Choose any (e.g., `Theft`)
   - Location: `Test Building - Room 101`
   - When: `Today at 2pm`
   - Description: `This is a test incident to verify integration`
3. **Expected Result**: Success message with Report ID and student info

### **Step 5: Test Status Check**

1. **In Telegram**, send `/status`
2. **Expected Result**: Shows your submitted report with details

### **Step 6: Test Frontend Analytics**

1. **Visit**: http://localhost:5173/Analytics
2. **Expected Result**: Real incident data displayed in charts and statistics
3. **Check**: Your new report should appear in the data

### **Step 7: Test Admin Dashboard**

1. **Visit**: http://localhost:5173/AdminDashboard
2. **Expected Result**: All incidents including your new report
3. **Verify**: Student information is linked to reports

## 📊 Available Test Students

Use any of these for verification testing:

1. **John Kwame Asante** - `BCS/21/001` (Computer Science)
2. **Michael Kofi Osei** - `MIN/19/023` (Mining Engineering)
3. **Grace Ama Boateng** - `GEO/21/012` (Geological Engineering)
4. **Emmanuel Yaw Oppong** - `MET/20/008` (Metallurgical Engineering)
5. **Priscilla Akua Nyame** - `ENV/22/067` (Environmental Engineering)
6. **Kwame Nkrumah Asiedu** - `CIV/21/078` (Civil Engineering)
7. **Akosua Ama Serwaa** - `BCS/22/156` (Computer Science)
8. **Yaw Berko Amponsah** - `ELEC/20/234` (Electronics Engineering)
9. **Efua Akoto Mensah** - `CHE/23/098` (Chemical Engineering)

## 🔧 Manual Testing URLs

If you want to test components individually:

### **Auth Gateway Direct Test**:
```
http://localhost:3000?chat_id=123456789&session=test123
```

### **Frontend Pages**:
- **Home**: http://localhost:5173/Home
- **Analytics**: http://localhost:5173/Analytics
- **Report Form**: http://localhost:5173/ReportIncident
- **Admin Dashboard**: http://localhost:5173/AdminDashboard

### **API Endpoints**:
- **Get Incidents**: http://localhost:5000/api/incidents
- **Health Check**: http://localhost:5000

## 🎉 Expected Results

After completing the full flow:

1. **Student verified** and linked to Telegram account
2. **Report submitted** with student information attached
3. **Database updated** with new incident record
4. **Frontend displays** real data including new report
5. **Admin dashboard** shows incident with student details

## 🚨 Troubleshooting

### **If Auth Gateway doesn't work**:
- Check if backend is running on port 5000
- Verify MongoDB connection
- Check browser console for errors

### **If Telegram redirect fails**:
- Ensure bot username is correct: `UMaT_safebot`
- Check if verification token was generated

### **If reports don't appear**:
- Check if student was properly verified
- Verify database connection
- Check browser network tab for API errors

## ✅ Success Indicators

- ✅ Telegram bot responds to `/start`
- ✅ Auth gateway loads and accepts student credentials
- ✅ Successful redirect back to Telegram
- ✅ Report submission works with student info
- ✅ Frontend shows real data
- ✅ Admin dashboard displays linked student information

**The system is now fully integrated and ready for testing!** 🎯
