import { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/client.js';
import TaskForm from '../components/TaskForm.jsx';
import TaskTable from '../components/TaskTable.jsx';
import GlassCard from '../components/GlassCard.jsx';

export default function Dashboard() {
  const [me, setMe] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const params = useMemo(() => ({ search, status }), [search, status]);

  const fetchMe = async () => {
    const res = await api.get('/api/auth/me');
    setMe(res.data.user);
  };
  const fetchTasks = async () => {
    const res = await api.get('/api/tasks', { params });
    setTasks(res.data.tasks);
  };

  useEffect(() => { fetchMe(); }, []);
  useEffect(() => { fetchTasks(); }, [search, status]);

  const logout = () => { localStorage.removeItem('token'); window.location.href = '/login'; };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <div className="space-x-3">
          <Link to="/profile" className="btn">Profile</Link>
          <button className="btn" onClick={logout}>Logout</button>
        </div>
      </div>

      <GlassCard className="p-4">
        <p className="mb-1 text-sm text-white/80">Signed in as</p>
        <p className="font-medium">{me ? `${me.name} (${me.email})` : '...'}</p>
      </GlassCard>

      <GlassCard className="p-4">
        <div className="flex gap-3 mb-4">
          <input className="input" placeholder="Search tasks..." value={search} onChange={e=>setSearch(e.target.value)} />
          <select className="input" value={status} onChange={e=>setStatus(e.target.value)}>
            <option value="">All</option>
            <option value="todo">To do</option>
            <option value="in-progress">In progress</option>
            <option value="done">Done</option>
          </select>
        </div>
        <TaskForm onCreated={fetchTasks} />
        <TaskTable tasks={tasks} onChange={fetchTasks} />
      </GlassCard>
    </div>
  );
}
