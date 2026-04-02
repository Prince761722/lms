import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';

const userSchema = new mongoose.Schema({
  firstname: {
    type: String,
    required: true


  },

  lastname: {
    type: String,
    required: true
  },

  username: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true

  },

  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    // match: [/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, 'is invalid']
    match: [
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      "Email is invalid"
    ]
  },

  password: {
    type: String,
    required: true,
    trim: true,
    minlength: 8,
    select: false
  },
  avtar: {
    public_id: {
      type: String,
      required: true
    },
    secure_url: {
      type: String
    }
  },

  subscription: {
  id: {
    type: String,
  },
  status: {
    type: String,
    default: "inactive",
  },
},

role: {
  type: String,
  enum: ["user", "admin", "creator"],
  default: "user",
},

creatorRequest: {
  status: {
    type: String,
    enum: ["none", "pending", "approved", "rejected"],
    default: "none",
  },
  requestedAt: Date,
},

  forgetpasswordtoken: String,
  forgetpasswordexpiry: Date,
}, {
  timestamps: true
});

userSchema.pre('save', async function () {
  if (!this.isModified('password')) {
    return;
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.getJWTToken = async function () {
  return await jwt.sign({ id: this._id, email: this.email, subscription: this.subscription, role: this.role },
    process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
}

userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
} 

userSchema.methods.getResetPasswordToken = async function () {
  const resetToken = crypto.randomBytes(20).toString("hex");

  this.forgetpasswordtoken = crypto.createHash("sha256").update(resetToken).digest("hex");
  this.forgetpasswordexpiry = Date.now() + 15 * 60 * 1000; // 15 minutes
  return resetToken;
}






const User = mongoose.model('User', userSchema);

export default User;
