import { useEffect, useState } from 'react';
import api from '../api/client.js';
import GlassCard from '../components/GlassCard.jsx';

export default function Profile() {
  const [form, setForm] = useState({ name: '', email: '' });
  const [msg, setMsg] = useState('');

  useEffect(() => {
    api.get('/api/auth/me').then(res => setForm(res.data.user));
  }, []);

  const save = async () => {
    await api.put('/api/auth/me', form);
    setMsg('Saved!');
    setTimeout(()=>setMsg(''), 1500);
  };

  return (
    <div className="max-w-md mx-auto">
      <GlassCard className="p-6">
        <h1 className="text-2xl font-semibold mb-4">Profile</h1>
        <div className="space-y-4">
          <div>
            <label className="label">Name</label>
            <input className="input" value={form.name} onChange={e=>setForm({...form, name: e.target.value})} />
          </div>
          <div>
            <label className="label">Email</label>
            <input className="input" value={form.email} onChange={e=>setForm({...form, email: e.target.value})} />
          </div>
          <button className="btn btn-primary w-full" onClick={save}>Save</button>
          {msg && <p className="text-emerald-300 text-sm">{msg}</p>}
        </div>
      </GlassCard>
    </div>
  );
}
