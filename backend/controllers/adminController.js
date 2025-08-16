import asyncHandler from "express-async-handler";
import User from '../models/userModels.js';       
import generateToken from '../utils/generateToken.js'; 

// @desc    Auth admin & get token
// @route   POST /api/admin/login
// @access  Public (for the login request itself)
export const adminLogin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400);
    throw new Error('Please enter both email and password.');
  }

  // --- Check if user exists ---
  const user = await User.findOne({ email });

  // --- Validate user and password ---
  if (user && (await user.matchPassword(password))) {
    if (user.role !== 'admin') {
      res.status(403); 
      throw new Error('Access Denied: Not an administrator account.');
    }
    generateToken(res, user._id);

    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      message: 'Admin logged in successfully.'
    });
  } else {
    res.status(401); 
    throw new Error('Invalid email or password.');
  }
});

// @desc    Logout admin
// @route   POST /api/admin/logout
// @access  Private 
export const adminLogout = asyncHandler(async (req, res) => {
  // Clear the JWT cookie to log out the user
  res.cookie('jwt', '', {
    httpOnly: true,
    expires: new Date(0) // Set expiry to past date to delete the cookie
  });



  res.status(200).json({ message: 'Admin logged out successfully' });
});
