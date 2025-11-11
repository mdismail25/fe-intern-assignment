import { z } from 'zod';

export const taskCreateSchema = z.object({
  title: z.string().min(1).max(120),
  description: z.string().max(1000).optional().default(''),
  status: z.enum(['todo', 'in-progress', 'done']).optional(),
  dueDate: z.coerce.date().optional()
});

export const taskUpdateSchema = taskCreateSchema.partial().refine((d) => Object.keys(d).length > 0, { message: 'No fields' });

export const querySchema = z.object({
  search: z.string().optional(),
  status: z.enum(['todo', 'in-progress', 'done']).optional(),
  limit: z.coerce.number().int().min(1).max(100).default(50),
  skip: z.coerce.number().int().min(0).default(0),
});
