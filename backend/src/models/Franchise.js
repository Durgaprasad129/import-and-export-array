import mongoose from 'mongoose';

const franchiseSchema = new mongoose.Schema(
  {
    city: { type: String, required: true, unique: true, trim: true },
    commissionRate: { type: Number, required: true, min: 0, max: 100 },
    isActive: { type: Boolean, default: true }
  },
  { timestamps: true }
);

export const Franchise = mongoose.model('Franchise', franchiseSchema);
