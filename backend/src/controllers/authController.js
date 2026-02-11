import { Franchise } from '../models/Franchise.js';
import { User } from '../models/User.js';
import { signToken } from '../utils/token.js';

export const signup = async (req, res, next) => {
  try {
    const { role = 'customer', name, phone, email, password, franchiseId } = req.body;

    if (!name || !phone || !email || !password) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    if (role !== 'customer') return res.status(400).json({ message: 'Public signup is customer only' });

    if (franchiseId) {
      const franchise = await Franchise.findById(franchiseId);
      if (!franchise || !franchise.isActive) return res.status(400).json({ message: 'Invalid franchise' });
    }

    const user = await User.create({ role, name, phone, email, password, franchiseId: franchiseId || null });
    return res.status(201).json({ token: signToken(user), user: { id: user._id, role: user.role } });
  } catch (err) {
    if (err.code === 11000) return res.status(409).json({ message: 'Email already exists' });
    return next(err);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });

    const matches = await user.comparePassword(password);
    if (!matches) return res.status(401).json({ message: 'Invalid credentials' });

    return res.json({
      token: signToken(user),
      user: { id: user._id, role: user.role, franchiseId: user.franchiseId }
    });
  } catch (err) {
    return next(err);
  }
};
