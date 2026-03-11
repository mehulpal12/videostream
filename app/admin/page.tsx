"use client";

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Users, BookOpen, BarChart3, Trash2, ShieldCheck, 
  ExternalLink, Search, RefreshCcw, MoreVertical, CheckCircle, GraduationCap
} from 'lucide-react';

export default function AdminDashboard() {
  const [data, setData] = useState<any>(null);
  const [view, setView] = useState<'users' | 'courses' | 'enrollments'>('users');
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    const res = await axios.get('/api/admin');
    setData(res.data);
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  const handleDelete = async (type: string, id: string) => {
    if (!confirm(`Are you sure you want to delete this ${type}?`)) return;
    await axios.delete(`/api/admin?type=${type}&id=${id}`);
    fetchData();
  };

  if (loading) return <div className="h-screen bg-[#0B0F17] flex items-center justify-center text-blue-500 animate-pulse">Loading System Data...</div>;

  return (
    <div className="min-h-screen bg-[#0B0F17] text-slate-100 p-8">
      {/* --- STATS GRID --- */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
        <StatCard title="Total Students" value={data?.users?.length} icon={<Users className="text-blue-500"/>} />
        <StatCard title="Active Courses" value={data?.courses?.length} icon={<BookOpen className="text-purple-500"/>} />
        <StatCard title="Enrollments" value={data?.enrollments?.length} icon={<GraduationCap className="text-green-500"/>} />
        <StatCard title="Revenue (est)" value={`₹${data?.courses?.reduce((acc: any, c: any) => acc + (c.price * c._count.enrollments), 0)}`} icon={<BarChart3 className="text-orange-500"/>} />
      </div>

      <div className="flex items-center justify-between mb-8">
        <div className="flex bg-white/5 p-1 rounded-xl border border-white/5">
          <TabBtn active={view === 'users'} label="Users" onClick={() => setView('users')} />
          <TabBtn active={view === 'courses'} label="Courses" onClick={() => setView('courses')} />
          <TabBtn active={view === 'enrollments'} label="Enrollments" onClick={() => setView('enrollments')} />
        </div>
        <button onClick={fetchData} className="p-2 hover:bg-white/5 rounded-lg transition-colors"><RefreshCcw size={18} /></button>
      </div>

      {/* --- DATA TABLE --- */}
      <div className="bg-white/5 border border-white/5 rounded-3xl overflow-hidden backdrop-blur-sm">
        <table className="w-full text-left">
          <thead className="bg-white/[0.02] border-b border-white/5 text-[10px] uppercase font-black text-slate-500 tracking-widest">
            {view === 'users' && (
              <tr>
                <th className="px-6 py-4">Student</th>
                <th className="px-6 py-4">Role</th>
                <th className="px-6 py-4">Enrollments</th>
                <th className="px-6 py-4">Joined</th>
                <th className="px-6 py-4">Actions</th>
              </tr>
            )}
            {view === 'courses' && (
              <tr>
                <th className="px-6 py-4">Course Title</th>
                <th className="px-6 py-4">Price</th>
                <th className="px-6 py-4">Sections</th>
                <th className="px-6 py-4">Students</th>
                <th className="px-6 py-4">Actions</th>
              </tr>
            )}
          </thead>
          <tbody className="divide-y divide-white/5">
            {view === 'users' && data.users.map((user: any) => (
              <tr key={user.id} className="hover:bg-white/[0.01] transition-colors">
                <td className="px-6 py-4 flex items-center gap-3">
                  <div className="size-8 rounded-full bg-blue-500/20 flex items-center justify-center font-bold text-xs text-blue-500">{user.email[0].toUpperCase()}</div>
                  <div>
                    <div className="text-sm font-bold">{user.email}</div>
                    <div className="text-[10px] text-slate-500">ID: {user.id}</div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={`text-[10px] font-black px-2 py-1 rounded-md ${user.role === 'ADMIN' ? 'bg-red-500/10 text-red-500' : 'bg-blue-500/10 text-blue-500'}`}>
                    {user.role}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm">{user._count.enrollments}</td>
                <td className="px-6 py-4 text-xs text-slate-500">{new Date(user.createdAt).toLocaleDateString()}</td>
                <td className="px-6 py-4">
                  <button onClick={() => handleDelete('user', user.id)} className="text-slate-500 hover:text-red-500 transition-colors"><Trash2 size={16}/></button>
                </td>
              </tr>
            ))}

            {view === 'courses' && data.courses.map((course: any) => (
              <tr key={course.id} className="hover:bg-white/[0.01] transition-colors">
                <td className="px-6 py-4">
                  <div className="text-sm font-bold">{course.title}</div>
                  <div className="text-[10px] text-slate-500">Mentor: {course.mentor}</div>
                </td>
                <td className="px-6 py-4 text-sm font-mono text-green-500">₹{course.price}</td>
                <td className="px-6 py-4 text-sm">{course._count.sections}</td>
                <td className="px-6 py-4 text-sm">{course._count.enrollments}</td>
                <td className="px-6 py-4 flex gap-3">
                  <button onClick={() => handleDelete('course', course.id)} className="text-slate-500 hover:text-red-500 transition-colors"><Trash2 size={16}/></button>
                  <a href={`/courses/${course.id}`} target="_blank" className="text-slate-500 hover:text-blue-500"><ExternalLink size={16}/></a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// Sub-components
function StatCard({ title, value, icon }: any) {
  return (
    <div className="bg-white/5 border border-white/5 p-6 rounded-3xl backdrop-blur-sm">
      <div className="flex items-center justify-between mb-4">
        <span className="text-[10px] font-black uppercase text-slate-500 tracking-tighter">{title}</span>
        <div className="p-2 bg-white/5 rounded-xl">{icon}</div>
      </div>
      <div className="text-2xl font-black">{value}</div>
    </div>
  );
}

function TabBtn({ active, label, onClick }: any) {
  return (
    <button 
      onClick={onClick}
      className={`px-6 py-2 rounded-lg text-xs font-bold transition-all ${active ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'text-slate-500 hover:text-white'}`}
    >
      {label}
    </button>
  );
}