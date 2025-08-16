import bcrypt from "bcryptjs";
import mongoose from "mongoose";

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please add a name"],
    },
    email: {
      type: String,
      required: [true, "Please add an email"],
      unique: true,
      trim: true,
      match: [
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        "Please enter a valid email",
      ],
    },
    
    indexNumber: {
      type: String,
      unique: true,
      sparse: true, // Allow multiple null values but unique non-null values
      trim: true,
      match: [
        /^[A-Z]{2,4}\/\d{2}\/\d{4}$/,
        "Please enter a valid index number format (e.g., BCS/21/001)",
      ],
    },
    
    password: {
      type: String,
      minLength: [8, "Password must be at least 8 characters"],
    },
    
    role: {
      type: String,
      default: "users",
      enum: ["admin", "users"],
    },
    active: {
      type: Boolean,
      default: true,
    },

  },
  { timestamps: true }
);

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare passwords
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};



const User = mongoose.model("User", userSchema);
export default User;
