import express from "express";

import { protect } from "../middleware/authMiddleware.js";
import { getUserProfile, login, logout, register } from "../controllers/userController.js";

const userRoutes = express.Router();

// @route   POST /api/auth/register
userRoutes.post("/register", register);

userRoutes.route('/profile').get(protect, getUserProfile);

// @route   POST /api/auth/login
userRoutes.post("/login", login);

// @route   POST /api/auth/logout
userRoutes.post("/logout", logout);

userRoutes.get("/me", protect, (req, res) => {
  res.status(200).json(req.user); 
});
export default userRoutes;
