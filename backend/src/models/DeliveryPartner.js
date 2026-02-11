import mongoose from 'mongoose';

const deliveryPartnerSchema = new mongoose.Schema(
  {
    franchiseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Franchise', required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    isApproved: { type: Boolean, default: false },
    isOnline: { type: Boolean, default: false },
    activeOrderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', default: null },
    lastKnownLocation: {
      lat: Number,
      lng: Number,
      updatedAt: Date
    }
  },
  { timestamps: true }
);

export const DeliveryPartner = mongoose.model('DeliveryPartner', deliveryPartnerSchema);
