import mongoose from 'mongoose';

const couponSchema = new mongoose.Schema(
  {
    code: { type: String, required: true, uppercase: true, trim: true, unique: true },
    franchiseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Franchise' },
    restaurantId: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant' },
    type: { type: String, enum: ['flat', 'percentage'], required: true },
    value: { type: Number, required: true, min: 0 },
    usageLimit: { type: Number, default: 1, min: 1 },
    usedCount: { type: Number, default: 0, min: 0 },
    isActive: { type: Boolean, default: true }
  },
  { timestamps: true }
);

export const Coupon = mongoose.model('Coupon', couponSchema);
