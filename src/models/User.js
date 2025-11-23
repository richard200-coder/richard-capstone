import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  name: { type: String, required: true, trim: true, maxlength: 80 },
  role: { type: String, enum: ['student', 'teacher', 'admin'], default: 'student' },
  passwordHash: { type: String, required: true },
  avatarUrl: { type: String, trim: true, default: '' },
  parentPhone: { type: String, trim: true, default: '' }, // Parent's phone number for SMS notifications
  parentName: { type: String, trim: true, default: '' }, // Parent's name
  smsEnabled: { type: Boolean, default: false } // Whether SMS notifications are enabled
}, { timestamps: true });

userSchema.methods.comparePassword = function(passwordPlain) {
  return bcrypt.compare(passwordPlain, this.passwordHash);
};

userSchema.statics.hashPassword = async function(passwordPlain) {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(passwordPlain, salt);
};

const User = mongoose.model('User', userSchema);
export default User;
