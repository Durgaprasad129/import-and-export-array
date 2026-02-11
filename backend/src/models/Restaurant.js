import mongoose from 'mongoose';

const restaurantSchema = new mongoose.Schema(
  {
    franchiseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Franchise', required: true },
    ownerUserId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    name: { type: String, required: true, trim: true },
    isApproved: { type: Boolean, default: false },
    isOpen: { type: Boolean, default: false },
    menu: [
      {
        name: { type: String, required: true },
        price: { type: Number, required: true, min: 0 },
        isAvailable: { type: Boolean, default: true }
      }
    ]
  },
  { timestamps: true }
);

export const Restaurant = mongoose.model('Restaurant', restaurantSchema);
