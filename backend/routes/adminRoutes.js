import express from 'express';
import { adminLogin, adminLogout } from '../controllers/adminController.js';
import { protect, authorizeRoles } from '../middleware/authMiddleware.js'; 

const adminRoutes = express.Router();

// Public route for admin login
adminRoutes.post('/login', adminLogin);

// Protected route for admin logout
adminRoutes.post('/logout', protect, authorizeRoles(['admin']), adminLogout);

export default adminRoutes;

