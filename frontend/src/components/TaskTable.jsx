import api from '../api/client.js';
import { useState } from 'react';

export default function TaskTable({ tasks, onChange }) {
  const [saving, setSaving] = useState(false);
  const updateStatus = async (id, status) => {
    setSaving(true);
    await api.put(`/api/tasks/${id}`, { status });
    setSaving(false);
    onChange && onChange();
  };
  const remove = async (id) => {
    if (!confirm('Delete task?')) return;
    await api.delete(`/api/tasks/${id}`);
    onChange && onChange();
  };
  return (
    <div className="overflow-x-auto">
      <table className="table">
        <thead>
          <tr className="text-white/80">
            <th>Title</th><th>Status</th><th>Due</th><th></th>
          </tr>
        </thead>
        <tbody>
          {tasks.map(t => (
            <tr key={t.id || t._id} className="border-t border-white/10">
              <td>
                <div className="font-medium">{t.title}</div>
                {t.description && <div className="text-sm text-white/70">{t.description}</div>}
              </td>
              <td>
                <select className="input" value={t.status} onChange={e=>updateStatus(t.id || t._id, e.target.value)} disabled={saving}>
                  <option value="todo">To do</option>
                  <option value="in-progress">In progress</option>
                  <option value="done">Done</option>
                </select>
              </td>
              <td>{t.dueDate ? new Date(t.dueDate).toLocaleDateString() : '-'}</td>
              <td className="text-right"><button className="btn" onClick={()=>remove(t.id || t._id)}>Delete</button></td>
            </tr>
          ))}
          {tasks.length === 0 && <tr><td className="p-4 text-white/70" colSpan="4">No tasks</td></tr>}
        </tbody>
      </table>
    </div>
  );
}
