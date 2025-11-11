import express from 'express';
import { Op } from 'sequelize';
import { z } from 'zod';
import Task from '../models/Task.js';
import auth from '../middleware/auth.js';
import { taskCreateSchema, taskUpdateSchema, querySchema } from '../validators/task.js';

const router = express.Router();
router.use(auth);

router.get('/', async (req, res) => {
  try {
    const q = querySchema.parse(req.query);
    const where = { userId: req.userId };

    if (q.search) {
      const like = `%${q.search}%`;
      where[Op.or] = [{ title: { [Op.like]: like } }, { description: { [Op.like]: like } }];
    }
    if (q.status) where.status = q.status;

    const tasks = await Task.findAll({
      where,
      order: [['createdAt', 'DESC']],
      limit: q.limit,
      offset: q.skip,
    });
    res.json({ tasks });
  } catch {
    res.status(400).json({ message: 'Invalid query' });
  }
});

router.post('/', async (req, res) => {
  try {
    const data = taskCreateSchema.parse(req.body);
    const task = await Task.create({ ...data, userId: req.userId });
    res.status(201).json({ task });
  } catch (err) {
    if (err instanceof z.ZodError) return res.status(400).json({ message: 'Validation failed', errors: err.errors });
    res.status(500).json({ message: 'Server error' });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const data = taskUpdateSchema.parse(req.body);
    const [count] = await Task.update(data, { where: { id: req.params.id, userId: req.userId } });
    if (!count) return res.status(404).json({ message: 'Not found' });
    const task = await Task.findByPk(req.params.id);
    res.json({ task });
  } catch (err) {
    if (err instanceof z.ZodError) return res.status(400).json({ message: 'Validation failed', errors: err.errors });
    res.status(500).json({ message: 'Server error' });
  }
});

router.delete('/:id', async (req, res) => {
  const count = await Task.destroy({ where: { id: req.params.id, userId: req.userId } });
  if (!count) return res.status(404).json({ message: 'Not found' });
  res.json({ ok: true });
});

export default router;
