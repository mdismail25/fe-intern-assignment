import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import api from '../api/client.js';
import { Link, useNavigate } from 'react-router-dom';
import GlassCard from '../components/GlassCard.jsx';

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(6)
});

export default function Login() {
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({ resolver: zodResolver(schema) });

  const onSubmit = async (data) => {
    const res = await api.post('/api/auth/login', data);
    localStorage.setItem('token', res.data.token);
    navigate('/dashboard');
  };

  return (
    <div className="max-w-md mx-auto">
      <GlassCard className="p-6">
        <h1 className="text-2xl font-semibold mb-4">Login</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
          <button className="btn btn-primary w-full" disabled={isSubmitting}>Login</button>
        </form>
        <p className="mt-3 text-sm">
          No account? <Link to="/register" className="link">Create one</Link>
        </p>
      </GlassCard>
    </div>
  );
}
