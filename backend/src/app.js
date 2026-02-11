import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import authRoutes from './routes/authRoutes.js';
import customerRoutes from './routes/customerRoutes.js';
import deliveryRoutes from './routes/deliveryRoutes.js';
import franchiseAdminRoutes from './routes/franchiseAdminRoutes.js';
import restaurantRoutes from './routes/restaurantRoutes.js';
import superAdminRoutes from './routes/superAdminRoutes.js';
import { errorHandler, notFound } from './middleware/errorHandler.js';
import { enforceFranchiseScope } from './middleware/franchiseScope.js';
import { requireAuth } from './middleware/auth.js';

dotenv.config();

export const app = express();
app.use(cors());
app.use(express.json());

app.get('/api/healthz', (req, res) => res.json({ status: 'ok' }));
app.use('/api/auth', authRoutes);

app.use('/api/customer', requireAuth, enforceFranchiseScope, customerRoutes);
app.use('/api/restaurant', requireAuth, enforceFranchiseScope, restaurantRoutes);
app.use('/api/delivery', requireAuth, enforceFranchiseScope, deliveryRoutes);
app.use('/api/franchise-admin', requireAuth, enforceFranchiseScope, franchiseAdminRoutes);
app.use('/api/super-admin', requireAuth, superAdminRoutes);

app.use(notFound);
app.use(errorHandler);
