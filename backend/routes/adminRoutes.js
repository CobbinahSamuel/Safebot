import express from 'express';
import { adminLogin, adminLogout } from '../controllers/adminController.js';
import { protect, authorizeRoles } from '../middleware/authMiddleware.js'; 

const userRoutes = express.Router();

// Public route for admin login
userRoutes.post('/login', adminLogin);

// Protected route for admin logout
userRoutes.post('/logout', protect, authorizeRoles(['admin']), adminLogout);

export default userRoutes;

