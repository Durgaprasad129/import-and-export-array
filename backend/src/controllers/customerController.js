import { Coupon } from '../models/Coupon.js';
import { Order } from '../models/Order.js';
import { Restaurant } from '../models/Restaurant.js';
import { Review } from '../models/Review.js';

export const listRestaurants = async (req, res, next) => {
  try {
    const data = await Restaurant.find({ franchiseId: req.user.franchiseId, isApproved: true }).lean();
    res.json(data);
  } catch (err) {
    next(err);
  }
};

export const placeOrder = async (req, res, next) => {
  try {
    const { restaurantId, items, total, paymentMethod, couponCode } = req.body;
    let discount = 0;

    if (couponCode) {
      const coupon = await Coupon.findOne({ code: couponCode.toUpperCase(), isActive: true });
      if (!coupon || coupon.usedCount >= coupon.usageLimit) {
        return res.status(400).json({ message: 'Invalid coupon' });
      }
      discount = coupon.type === 'flat' ? coupon.value : (total * coupon.value) / 100;
      coupon.usedCount += 1;
      await coupon.save();
    }

    const order = await Order.create({
      franchiseId: req.user.franchiseId,
      restaurantId,
      customerId: req.user._id,
      items,
      total: Math.max(0, total - discount),
      paymentMethod,
      paymentStatus: 'authorized',
      couponCode
    });

    res.status(201).json(order);
  } catch (err) {
    next(err);
  }
};

export const listMyOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ customerId: req.user._id }).sort({ createdAt: -1 }).limit(50).lean();
    res.json(orders);
  } catch (err) {
    next(err);
  }
};

export const reorderLastFive = async (req, res, next) => {
  try {
    const orders = await Order.find({ customerId: req.user._id }).sort({ createdAt: -1 }).limit(5).lean();
    res.json(orders);
  } catch (err) {
    next(err);
  }
};

export const addReview = async (req, res, next) => {
  try {
    const { orderId, rating, comment } = req.body;
    const order = await Order.findOne({ _id: orderId, customerId: req.user._id });

    if (!order || order.status !== 'delivered') {
      return res.status(400).json({ message: 'Review allowed only after delivered orders' });
    }

    const review = await Review.create({
      orderId: order._id,
      customerId: req.user._id,
      restaurantId: order.restaurantId,
      rating,
      comment
    });

    res.status(201).json(review);
  } catch (err) {
    next(err);
  }
};
