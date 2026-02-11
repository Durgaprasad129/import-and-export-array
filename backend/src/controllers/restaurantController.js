import { Order } from '../models/Order.js';
import { Restaurant } from '../models/Restaurant.js';

export const getProfile = async (req, res, next) => {
  try {
    const profile = await Restaurant.findOne({ ownerUserId: req.user._id });
    if (!profile) return res.status(404).json({ message: 'Restaurant not found' });
    res.json(profile);
  } catch (err) {
    next(err);
  }
};

export const updateProfile = async (req, res, next) => {
  try {
    const updated = await Restaurant.findOneAndUpdate(
      { ownerUserId: req.user._id },
      { name: req.body.name },
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    next(err);
  }
};

export const setOpenStatus = async (req, res, next) => {
  try {
    const updated = await Restaurant.findOneAndUpdate(
      { ownerUserId: req.user._id },
      { isOpen: !!req.body.isOpen },
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    next(err);
  }
};

export const updateMenu = async (req, res, next) => {
  try {
    const updated = await Restaurant.findOneAndUpdate(
      { ownerUserId: req.user._id },
      { menu: req.body.menu || [] },
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    next(err);
  }
};

export const listIncomingOrders = async (req, res, next) => {
  try {
    const restaurant = await Restaurant.findOne({ ownerUserId: req.user._id });
    const orders = await Order.find({ restaurantId: restaurant._id, status: 'pending_restaurant' }).lean();
    res.json(orders);
  } catch (err) {
    next(err);
  }
};

export const setOrderStatus = async (req, res, next) => {
  try {
    const { orderId, action } = req.body;
    const restaurant = await Restaurant.findOne({ ownerUserId: req.user._id });
    const order = await Order.findOne({ _id: orderId, restaurantId: restaurant._id });
    if (!order) return res.status(404).json({ message: 'Order not found' });

    if (action === 'accept') order.status = 'accepted_by_restaurant';
    if (action === 'reject') order.status = 'rejected_by_restaurant';

    await order.save();
    res.json(order);
  } catch (err) {
    next(err);
  }
};
