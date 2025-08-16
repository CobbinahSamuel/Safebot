import asyncHandler from "express-async-handler";
import User from '../models/userModels.js'
import generateToken from '../utils/generateToken.js'

// Register
export const register = asyncHandler(async (req, res) => {
  const {name, email, password, role} = req.body; 

    //Validation
    if (!name || !email || !password || !role) {
        res.status(400);
        throw new Error('Please fill in all required fields');

    }
    if (password.length < 8 ) {
        res.status(400);
        throw new Error('Password must not be less than 8 characters');
    }

    const userExists = await User.findOne({email}); 

    if (userExists) {
        res.status(400);
        throw new Error('User already exists');
    }

    const user = await User.create({
        name,
        email,
        password,
        role,
    });

    if(user) {
        generateToken(res, user._id)

            const newUser = {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    };
     // Log activity
        res.status(201).json(newUser);
       
    } else{
        res.status(400);
        throw new Error('Invalid user data');
    }

});

// Login
export const login = asyncHandler(async (req, res) => {
  const {email, password } = req.body;

        //Validation
        if (!email || !password) {
            res.status(400);
            throw new Error('Please fill in all required fields');
    
        }
        //   check if user exists
      const user = await User.findOne({email});

    if(user && (await user.matchPassword(password))) {
        generateToken(res, user._id);
    const loggedInUser = {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,

    };
        // Log activity
    await logActivity(user._id, "Login", "Logged into account");
    res.status(200).json(loggedInUser);
    } else{
        res.status(404);
        throw new Error('Invalid email or password');
    }
});


//@desc  Logout user
//route  POST/api/users/logout
//@access public

export const logout = asyncHandler(async (req, res) => {
 res.cookie('jwt', '', {
        httpOnly:true,
        expires: new Date(0)
    })
        // Log activity
    await logActivity(req.user, "LOGOUT", {message: "User logged out"});
    
    res.status(200).json({ message: 'Logged out Successfully'});

});


//@desc  Get user profile
//route  GET/api/users/auth
//@access private

export const getUserProfile = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id).select("-password");
         
  if (user) {
    res.status(200).json(user);
} else {   
        res.status(404);
        throw new Error('User not Found');    
}

});
