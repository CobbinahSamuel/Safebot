import asyncHandler from "express-async-handler";
import User from '../models/userModels.js'
import generateToken from '../utils/generateToken.js'

// Register
export const register = asyncHandler(async (req, res) => {
  const {name, email, indexNumber, password, role} = req.body; 

    //Validation
    if (!name || !email || !password) {
        res.status(400);
        throw new Error('Please fill in all required fields');
    }
    
    if (password.length < 8 ) {
        res.status(400);
        throw new Error('Password must not be less than 8 characters');
    }

    // Check if user already exists by email or index number
    const existingUser = await User.findOne({
        $or: [
            { email },
            ...(indexNumber ? [{ indexNumber }] : [])
        ]
    }); 

    if (existingUser) {
        if (existingUser.email === email) {
            res.status(400);
            throw new Error('A user with this email already exists');
        }
        if (existingUser.indexNumber === indexNumber) {
            res.status(400);
            throw new Error('A user with this index number already exists');
        }
    }

    const user = await User.create({
        name,
        email,
        indexNumber,
        password,
        role: role || "users",
    });

    if(user) {
        generateToken(res, user._id)

        const newUser = {
            _id: user._id,
            name: user.name,
            email: user.email,
            indexNumber: user.indexNumber,
            role: user.role,
        };
        
        res.status(201).json(newUser);
       
    } else{
        res.status(400);
        throw new Error('Invalid user data');
    }

});

// Login
export const login = asyncHandler(async (req, res) => {
  const {email, indexNumber, password } = req.body;

        //Validation
        if ((!email && !indexNumber) || !password) {
            res.status(400);
            throw new Error('Please provide either email or index number along with password');
        }
        
        // Find user by email or index number
        let user;
        if (email) {
            user = await User.findOne({email});
        } else if (indexNumber) {
            user = await User.findOne({indexNumber});
        }

    if(user && (await user.matchPassword(password))) {
        generateToken(res, user._id);
        const loggedInUser = {
            _id: user._id,
            name: user.name,
            email: user.email,
            indexNumber: user.indexNumber,
            role: user.role,
        };
        
        res.status(200).json(loggedInUser);
    } else{
        res.status(401);
        throw new Error('Invalid credentials');
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
