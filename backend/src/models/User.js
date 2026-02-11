import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const ROLES = ['customer', 'restaurant', 'delivery_partner', 'franchise_admin', 'super_admin'];

const userSchema = new mongoose.Schema(
  {
    role: { type: String, enum: ROLES, required: true },
    franchiseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Franchise' },
    name: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, minlength: 8 }
  },
  { timestamps: true }
);

userSchema.pre('save', async function hashPassword(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.comparePassword = function comparePassword(plain) {
  return bcrypt.compare(plain, this.password);
};

export const User = mongoose.model('User', userSchema);
