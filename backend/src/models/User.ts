
import mongoose, { Document } from 'mongoose';
import bcrypt from 'bcryptjs';

// FIX: Define and export IUser interface for proper typing of User documents.
export interface IUser extends Document {
  email: string;
  password: string;
  username: string;
  avatar: string;
  online: boolean;
  lastSeen: Date;
  inviteId?: string;
  matchPassword: (enteredPassword: string) => Promise<boolean>;
}

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
    unique: true,
  },
  avatar: {
    type: String,
    default: '',
  },
  online: {
    type: Boolean,
    default: false,
  },
  lastSeen: {
    type: Date,
    default: Date.now,
  },
  inviteId: {
    type: String,
    unique: true,
    sparse: true
  }
}, {
  timestamps: true,
});

userSchema.pre<IUser>('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.matchPassword = async function (enteredPassword: string): Promise<boolean> {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model<IUser>('User', userSchema);
export default User;
