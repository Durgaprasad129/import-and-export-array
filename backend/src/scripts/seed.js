import dotenv from 'dotenv';
import { connectDb } from '../config/db.js';
import { DeliveryPartner } from '../models/DeliveryPartner.js';
import { Franchise } from '../models/Franchise.js';
import { Restaurant } from '../models/Restaurant.js';
import { User } from '../models/User.js';

dotenv.config();

const run = async () => {
  await connectDb();

  const city = await Franchise.findOneAndUpdate(
    { city: 'Demo City' },
    { city: 'Demo City', commissionRate: 15, isActive: true },
    { upsert: true, new: true }
  );

  const superAdmin = await User.findOneAndUpdate(
    { email: 'super@demo.com' },
    {
      role: 'super_admin',
      name: 'Super Admin',
      phone: '9999999999',
      email: 'super@demo.com',
      password: 'Password123!'
    },
    { upsert: true, new: true }
  );

  const franchiseAdmin = await User.findOneAndUpdate(
    { email: 'fradmin@demo.com' },
    {
      role: 'franchise_admin',
      franchiseId: city._id,
      name: 'Franchise Admin',
      phone: '9888888888',
      email: 'fradmin@demo.com',
      password: 'Password123!'
    },
    { upsert: true, new: true }
  );

  const restaurantOwner = await User.findOneAndUpdate(
    { email: 'restaurant@demo.com' },
    {
      role: 'restaurant',
      franchiseId: city._id,
      name: 'Restaurant Owner',
      phone: '9777777777',
      email: 'restaurant@demo.com',
      password: 'Password123!'
    },
    { upsert: true, new: true }
  );

  const deliveryUser = await User.findOneAndUpdate(
    { email: 'delivery@demo.com' },
    {
      role: 'delivery_partner',
      franchiseId: city._id,
      name: 'Delivery Partner',
      phone: '9666666666',
      email: 'delivery@demo.com',
      password: 'Password123!'
    },
    { upsert: true, new: true }
  );

  await Restaurant.findOneAndUpdate(
    { ownerUserId: restaurantOwner._id },
    {
      franchiseId: city._id,
      ownerUserId: restaurantOwner._id,
      name: 'Demo Kitchen',
      isApproved: true,
      isOpen: true,
      menu: [{ name: 'Classic Burger', price: 120, isAvailable: true }]
    },
    { upsert: true, new: true }
  );

  await DeliveryPartner.findOneAndUpdate(
    { userId: deliveryUser._id },
    {
      franchiseId: city._id,
      userId: deliveryUser._id,
      isApproved: true,
      isOnline: false
    },
    { upsert: true, new: true }
  );

  // eslint-disable-next-line no-console
  console.log('Seed complete', { superAdmin, franchiseAdmin });
  process.exit(0);
};

run().catch((err) => {
  // eslint-disable-next-line no-console
  console.error(err);
  process.exit(1);
});
