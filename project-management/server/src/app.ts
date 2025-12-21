import express from 'express';
import cors from 'cors';

import authRoutes from "./routes/auth.route.js";

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ status: "ok" });
});

app.use('/api/auth', authRoutes);

export default app;