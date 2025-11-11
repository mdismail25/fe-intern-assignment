import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import morgan from 'morgan';



import './src/models/Task.js';
import { User, Task } from './src/models/associations.js';

import authRoutes from './src/routes/auth.js';
import taskRoutes from './src/routes/tasks.js';

dotenv.config();

const app = express();
app.use(cors({ origin: '*', credentials: false }));
app.use(express.json());
app.use(morgan('dev'));

app.get('/', (_req, res) => res.json({ ok: true, service: 'backend', version: '1.0.0' }));

app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`✅ Server running successfully on port ${PORT}`);
});
