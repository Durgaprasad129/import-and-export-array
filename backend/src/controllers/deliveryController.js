import { DeliveryPartner } from '../models/DeliveryPartner.js';
import { Order } from '../models/Order.js';

export const setOnlineStatus = async (req, res, next) => {
  try {
    const partner = await DeliveryPartner.findOneAndUpdate(
      { userId: req.user._id },
      { isOnline: !!req.body.isOnline },
      { new: true }
    );
    res.json(partner);
  } catch (err) {
    next(err);
  }
};

export const listAssignedOrders = async (req, res, next) => {
  try {
    const partner = await DeliveryPartner.findOne({ userId: req.user._id });
    const orders = await Order.find({ deliveryPartnerId: partner._id }).sort({ createdAt: -1 }).lean();
    res.json(orders);
  } catch (err) {
    next(err);
  }
};

export const updateAssignedOrderStatus = async (req, res, next) => {
  try {
    const { orderId, status, lat, lng } = req.body;
    const partner = await DeliveryPartner.findOne({ userId: req.user._id });
    const order = await Order.findOne({ _id: orderId, deliveryPartnerId: partner._id });

    if (!order) return res.status(404).json({ message: 'Assigned order not found' });
    if (!['picked_up', 'delivered'].includes(status)) return res.status(400).json({ message: 'Invalid status' });

    order.status = status;
    if (status === 'delivered') {
      partner.activeOrderId = null;
      order.reviewUnlocked = true;
    }

    partner.lastKnownLocation = { lat, lng, updatedAt: new Date() };

    await Promise.all([order.save(), partner.save()]);
    res.json(order);
  } catch (err) {
    next(err);
  }
};

export const todaysEarnings = async (req, res, next) => {
  try {
    const partner = await DeliveryPartner.findOne({ userId: req.user._id });
    const start = new Date();
    start.setHours(0, 0, 0, 0);

    const delivered = await Order.find({
      deliveryPartnerId: partner._id,
      status: 'delivered',
      updatedAt: { $gte: start }
    }).lean();

    const total = delivered.reduce((sum, o) => sum + o.total * 0.2, 0);
    res.json({ deliveredCount: delivered.length, estimatedEarnings: Number(total.toFixed(2)) });
  } catch (err) {
    next(err);
  }
};
