import { Franchise } from '../models/Franchise.js';
import { Order } from '../models/Order.js';
import { User } from '../models/User.js';

export const listFranchises = async (req, res, next) => {
  try {
    const docs = await Franchise.find().lean();
    res.json(docs);
  } catch (err) {
    next(err);
  }
};

export const createFranchise = async (req, res, next) => {
  try {
    const franchise = await Franchise.create(req.body);
    res.status(201).json(franchise);
  } catch (err) {
    next(err);
  }
};

export const assignFranchiseAdmin = async (req, res, next) => {
  try {
    const { userId, franchiseId } = req.body;
    const user = await User.findByIdAndUpdate(userId, { role: 'franchise_admin', franchiseId }, { new: true });
    res.json(user);
  } catch (err) {
    next(err);
  }
};

export const overrideOrder = async (req, res, next) => {
  try {
    const { orderId, status, paymentStatus } = req.body;
    const order = await Order.findByIdAndUpdate(orderId, { status, paymentStatus }, { new: true });
    res.json(order);
  } catch (err) {
    next(err);
  }
};

export const health = async (req, res, next) => {
  try {
    const [franchises, users, orders] = await Promise.all([
      Franchise.countDocuments(),
      User.countDocuments(),
      Order.countDocuments()
    ]);
    res.json({ franchises, users, orders, status: 'ok' });
  } catch (err) {
    next(err);
  }
};
