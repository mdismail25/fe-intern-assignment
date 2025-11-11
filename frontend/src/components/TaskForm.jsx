import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import api from '../api/client.js';

const schema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  status: z.enum(['todo','in-progress','done']).default('todo'),
  dueDate: z.string().optional()
});

export default function TaskForm({ onCreated }) {
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm({ resolver: zodResolver(schema) });

  const onSubmit = async (data) => {
    const payload = { ...data };
    if (!payload.dueDate) delete payload.dueDate;
    await api.post('/api/tasks', payload);
    reset();
    onCreated && onCreated();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid md:grid-cols-5 gap-3 mb-4">
      <input className="input md:col-span-1" placeholder="Title" {...register('title')} />
      <input className="input md:col-span-2" placeholder="Description" {...register('description')} />
      <select className="input" {...register('status')}>
        <option value="todo">To do</option>
        <option value="in-progress">In progress</option>
        <option value="done">Done</option>
      </select>
      <input className="input" type="date" {...register('dueDate')} />
      <button className="btn btn-primary md:col-span-5" disabled={isSubmitting}>Add Task</button>
      {errors.title && <p className="text-red-300 text-sm md:col-span-5">{errors.title.message}</p>}
    </form>
  );
}
