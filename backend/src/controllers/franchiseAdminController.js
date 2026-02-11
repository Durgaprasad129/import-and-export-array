import { Coupon } from '../models/Coupon.js';
import { DeliveryPartner } from '../models/DeliveryPartner.js';
import { Franchise } from '../models/Franchise.js';
import { Order } from '../models/Order.js';
import { Restaurant } from '../models/Restaurant.js';

export const reviewRestaurant = async (req, res, next) => {
  try {
    const { restaurantId, isApproved } = req.body;
    const doc = await Restaurant.findOneAndUpdate(
      { _id: restaurantId, franchiseId: req.user.franchiseId },
      { isApproved: !!isApproved },
      { new: true }
    );
    res.json(doc);
  } catch (err) {
    next(err);
  }
};

export const reviewDeliveryPartner = async (req, res, next) => {
  try {
    const { partnerId, isApproved } = req.body;
    const doc = await DeliveryPartner.findOneAndUpdate(
      { _id: partnerId, franchiseId: req.user.franchiseId },
      { isApproved: !!isApproved },
      { new: true }
    );
    res.json(doc);
  } catch (err) {
    next(err);
  }
};

export const cityOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ franchiseId: req.user.franchiseId }).sort({ createdAt: -1 }).lean();
    res.json(orders);
  } catch (err) {
    next(err);
  }
};

export const assignDeliveryPartner = async (req, res, next) => {
  try {
    const { orderId, partnerId } = req.body;
    const order = await Order.findOne({ _id: orderId, franchiseId: req.user.franchiseId });
    const partner = await DeliveryPartner.findOne({ _id: partnerId, franchiseId: req.user.franchiseId });

    if (!order || !partner) return res.status(404).json({ message: 'Order or partner not found' });
    if (partner.activeOrderId) return res.status(400).json({ message: 'Partner already has active order' });

    partner.activeOrderId = order._id;
    order.deliveryPartnerId = partner._id;
    order.status = 'assigned';

    await Promise.all([order.save(), partner.save()]);
    res.json(order);
  } catch (err) {
    next(err);
  }
};

export const updateCityConfig = async (req, res, next) => {
  try {
    const { commissionRate } = req.body;
    const franchise = await Franchise.findByIdAndUpdate(req.user.franchiseId, { commissionRate }, { new: true });
    res.json(franchise);
  } catch (err) {
    next(err);
  }
};

export const createCoupon = async (req, res, next) => {
  try {
    const coupon = await Coupon.create({ ...req.body, franchiseId: req.user.franchiseId });
    res.status(201).json(coupon);
  } catch (err) {
    next(err);
  }
};
