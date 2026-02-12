import express from 'express';
import cors from 'cors';

import { apiLimiter } from './middleware/rate-limit.middleware';
import authRoutes from './routes/auth.route';
import organizationRoutes from './routes/organization.route';

const app = express();

app.use(cors());
app.use(express.json());

// Apply global rate limiter
app.use(apiLimiter);

app.get('/', (req, res) => res.json({ status: 'ok' }));
app.use('/api/auth', authRoutes);
app.use('/api/organization', organizationRoutes);

export default app;
