import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import User from '../models/User.js';
import auth from '../middleware/auth.js';
import { registerSchema, loginSchema, profileUpdateSchema } from '../validators/auth.js';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret';

router.post('/register', async (req, res) => {
  try {
    const data = registerSchema.parse(req.body);
    const existing = await User.findOne({ where: { email: data.email } });
    if (existing) return res.status(409).json({ message: 'Email already in use' });

    const hash = await bcrypt.hash(data.password, 10);
    const user = await User.create({ name: data.name, email: data.email, password: hash });

    const token = jwt.sign({ sub: user.id }, JWT_SECRET, { expiresIn: '7d' });
    res.status(201).json({ token, user: { id: user.id, name: user.name, email: user.email } });
  } catch (err) {
    if (err instanceof z.ZodError) return res.status(400).json({ message: 'Validation failed', errors: err.errors });
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = loginSchema.parse(req.body);
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(401).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ sub: user.id }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { id: user.id, name: user.name, email: user.email } });
  } catch (err) {
    if (err instanceof z.ZodError) return res.status(400).json({ message: 'Validation failed', errors: err.errors });
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/me', auth, async (_req, res) => {
  const user = await User.findByPk(_req.userId, { attributes: ['id', 'name', 'email'] });
  res.json({ user });
});

router.put('/me', auth, async (req, res) => {
  try {
    const data = profileUpdateSchema.parse(req.body);
    await User.update(data, { where: { id: req.userId } });
    const user = await User.findByPk(req.userId, { attributes: ['id', 'name', 'email'] });
    res.json({ user });
  } catch (err) {
    if (err instanceof z.ZodError) return res.status(400).json({ message: 'Validation failed', errors: err.errors });
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
