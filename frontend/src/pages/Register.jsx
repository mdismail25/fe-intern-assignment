import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import api from '../api/client.js';
import { Link, useNavigate } from 'react-router-dom';
import GlassCard from '../components/GlassCard.jsx';

const schema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6)
});

export default function Register() {
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({ resolver: zodResolver(schema) });

  const onSubmit = async (data) => {
    const res = await api.post('/api/auth/register', data);
    localStorage.setItem('token', res.data.token);
    navigate('/dashboard');
  };

  return (
    <div className="max-w-md mx-auto">
      <GlassCard className="p-6">
        <h1 className="text-2xl font-semibold mb-4">Register</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="label">Name</label>
            <input className="input" {...register('name')} placeholder="Your name" />
            {errors.name && <p className="text-red-300 text-sm">{errors.name.message}</p>}
          </div>
          <div>
            <label className="label">Email</label>
            <input className="input" {...register('email')} placeholder="you@example.com" />
            {errors.email && <p className="text-red-300 text-sm">{errors.email.message}</p>}
          </div>
          <div>
            <label className="label">Password</label>
            <input className="input" type="password" {...register('password')} placeholder="••••••••" />
            {errors.password && <p className="text-red-300 text-sm">{errors.password.message}</p>}
          </div>
          <button className="btn btn-primary w-full" disabled={isSubmitting}>Create account</button>
        </form>
        <p className="mt-3 text-sm">
          Already have an account? <Link to="/login" className="link">Login</Link>
        </p>
      </GlassCard>
    </div>
  );
}
