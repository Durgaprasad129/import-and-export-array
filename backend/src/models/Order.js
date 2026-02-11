import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema(
  {
    franchiseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Franchise', required: true },
    restaurantId: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant', required: true },
    customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    deliveryPartnerId: { type: mongoose.Schema.Types.ObjectId, ref: 'DeliveryPartner' },
    items: [
      {
        name: { type: String, required: true },
        quantity: { type: Number, required: true, min: 1 },
        price: { type: Number, required: true, min: 0 }
      }
    ],
    total: { type: Number, required: true, min: 0 },
    status: {
      type: String,
      enum: ['pending_restaurant', 'rejected_by_restaurant', 'accepted_by_restaurant', 'assigned', 'picked_up', 'delivered'],
      default: 'pending_restaurant'
    },
    paymentMethod: { type: String, enum: ['cod', 'razorpay'], required: true },
    paymentStatus: { type: String, enum: ['authorized', 'failed', 'refunded'], default: 'authorized' },
    couponCode: { type: String },
    reviewUnlocked: { type: Boolean, default: false }
  },
  { timestamps: true }
);

export const Order = mongoose.model('Order', orderSchema);
