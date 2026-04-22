import { fetchComplaints } from '../services/api';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const STATUS_STYLES = {
  'Pending':     { pill: 'bg-yellow-50 text-yellow-700 border-yellow-200', dot: 'bg-yellow-400' },
  'In Progress': { pill: 'bg-blue-50 text-blue-700 border-blue-200',       dot: 'bg-blue-500' },
  'Resolved':    { pill: 'bg-emerald-50 text-emerald-700 border-emerald-200', dot: 'bg-emerald-500' },
  'Rejected':    { pill: 'bg-red-50 text-red-700 border-red-200',          dot: 'bg-red-400' },
};

const PRIORITY_STYLES = {
  High:   'bg-red-50 text-red-700 border-red-200',
  Medium: 'bg-yellow-50 text-yellow-700 border-yellow-200',
  Low:    'bg-slate-50 text-slate-600 border-slate-200',
};

const CATEGORY_ICONS = {
  Garbage: '🗑️', Water: '💧', Roads: '🛣️', Electricity: '⚡',
  Parks: '🌳', Traffic: '🚦', Infrastructure: '🏗️', Other: '📋',
};

const SAMPLE = [
  { _id: 's1', title: 'Pothole on MG Road', category: 'Roads', location: 'Sector 17, Chandigarh', status: 'In Progress', priority: 'High', createdAt: '2026-04-18T09:00:00Z', name: 'Amit Sharma', description: 'Large pothole near the bus stop causing accidents.' },
  { _id: 's2', title: 'Garbage not collected', category: 'Garbage', location: 'Phase 7, Mohali', status: 'Pending', priority: 'Medium', createdAt: '2026-04-19T11:00:00Z', name: 'Priya Nair', description: 'Overflowing garbage bins outside D-block market.' },
];

function StatusPill({ status }) {
  const s = STATUS_STYLES[status] || STATUS_STYLES['Pending'];
  return (
    <span className={'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-semibold ' + s.pill}>
      <span className={'w-1.5 h-1.5 rounded-full ' + s.dot} />
      {status}
    </span>
  );
}

function PriorityBadge({ priority }) {
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-lg border text-xs font-bold ${PRIORITY_STYLES[priority] || PRIORITY_STYLES.Low}`}>
      {priority === 'High' ? '🔴' : priority === 'Medium' ? '🟡' : '🟢'} {priority}
    </span>
  );
}

export default function Dashboard() {
  const [complaints, setComplaints] = useState([]);
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [expanded, setExpanded] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchComplaints()
      .then(data => { setComplaints(data); setLoading(false); })
      .catch(() => { setComplaints(SAMPLE); setLoading(false); });
  }, []);

  const filters = ['All', 'Pending', 'In Progress', 'Resolved', 'Rejected'];
  const counts = {
    All: complaints.length,
    Pending: complaints.filter(c => c.status === 'Pending').length,
    'In Progress': complaints.filter(c => c.status === 'In Progress').length,
    Resolved: complaints.filter(c => c.status === 'Resolved').length,
    Rejected: complaints.filter(c => c.status === 'Rejected').length,
  };

  const filtered = complaints
    .filter(c => filter === 'All' || c.status === filter)
    .filter(c => !search ||
      c.title?.toLowerCase().includes(search.toLowerCase()) ||
      c.location?.toLowerCase().includes(search.toLowerCase()) ||
      c._id?.toLowerCase().includes(search.toLowerCase())
    );

  return (
    <div className="min-h-screen text-slate-900"
      style={{ background: 'linear-gradient(135deg, #f0f7ff 0%, #ffffff 40%, #f5f3ff 70%, #eff6ff 100%)' }}>
      <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0, overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '-10%', right: '-5%', width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle, rgba(191,219,254,0.35) 0%, transparent 70%)' }} />
        <div style={{ position: 'absolute', bottom: '10%', left: '-8%', width: 420, height: 420, borderRadius: '50%', background: 'radial-gradient(circle, rgba(196,181,253,0.2) 0%, transparent 70%)' }} />
      </div>

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-10" style={{ zIndex: 1 }}>
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <p className="text-blue-500 text-xs font-bold tracking-widest uppercase mb-1">Public View</p>
            <h1 className="text-3xl font-black tracking-tight text-slate-900">Complaints Dashboard</h1>
            <p className="text-slate-400 text-sm mt-1 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse inline-block" />
              {complaints.length} total complaints tracked
            </p>
          </div>
          <Link to="/complaint"
            className="self-start sm:self-auto px-5 py-2.5 bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white font-bold rounded-xl text-sm shadow-md shadow-blue-200 transition-all active:scale-95">
            + New Complaint
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-7">
          {[
            { label: 'Total',       value: counts.All,            color: 'text-slate-900',   bg: 'linear-gradient(135deg,#f8fafc,#ffffff)', border: 'rgba(226,232,240,0.8)' },
            { label: 'Pending',     value: counts.Pending,        color: 'text-yellow-600',  bg: 'linear-gradient(135deg,#fefce8,#ffffff)', border: 'rgba(253,230,138,0.6)' },
            { label: 'In Progress', value: counts['In Progress'], color: 'text-blue-600',    bg: 'linear-gradient(135deg,#eff6ff,#ffffff)', border: 'rgba(191,219,254,0.6)' },
            { label: 'Resolved',    value: counts.Resolved,       color: 'text-emerald-600', bg: 'linear-gradient(135deg,#ecfdf5,#ffffff)', border: 'rgba(167,243,208,0.6)' },
          ].map(s => (
            <div key={s.label} className="rounded-2xl px-5 py-4 shadow-sm"
              style={{ background: s.bg, border: `1px solid ${s.border}`, backdropFilter: 'blur(12px)' }}>
              <div className={'text-2xl font-black ' + s.color}>{s.value}</div>
              <div className="text-slate-400 text-xs font-semibold uppercase tracking-widest mt-1">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Search + Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-5">
          <div className="relative flex-1">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input type="text" placeholder="Search by title, location..." value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full bg-white/80 border border-slate-200 rounded-xl pl-9 pr-4 py-2.5 text-sm text-slate-700 placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition-all backdrop-blur-sm"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {filters.map(f => (
              <button key={f} onClick={() => { setFilter(f); setExpanded(null); }}
                className={'px-4 py-1.5 rounded-xl text-sm font-semibold border transition-all duration-150 ' +
                  (filter === f ? 'bg-blue-50 border-blue-300 text-blue-700 shadow-sm' : 'border-slate-200 text-slate-500 hover:text-slate-700 hover:border-slate-300 bg-white/70 backdrop-blur-sm')}>
                {f} <span className="ml-1 text-xs opacity-50">({counts[f] ?? 0})</span>
              </button>
            ))}
          </div>
        </div>

        {/* List */}
        <div className="rounded-2xl overflow-hidden shadow-sm"
          style={{ background: 'rgba(255,255,255,0.75)', backdropFilter: 'blur(12px)', border: '1px solid rgba(226,232,240,0.8)' }}>
          <div className="grid gap-4 items-center px-6 py-3 border-b"
            style={{ gridTemplateColumns: '1fr auto auto auto auto', background: 'rgba(248,250,252,0.9)', borderColor: 'rgba(226,232,240,0.8)' }}>
            <span className="text-slate-400 text-xs font-bold uppercase tracking-wider">Complaint</span>
            <span className="hidden sm:block text-slate-400 text-xs font-bold uppercase tracking-wider">Category</span>
            <span className="text-slate-400 text-xs font-bold uppercase tracking-wider">Priority</span>
            <span className="text-slate-400 text-xs font-bold uppercase tracking-wider">Status</span>
            <span className="w-7" />
          </div>

          {loading ? (
            <div className="py-16 text-center text-slate-400 text-sm">Loading complaints...</div>
          ) : filtered.length === 0 ? (
            <div className="py-16 text-center">
              <p className="text-slate-500 font-semibold text-sm">No complaints found</p>
              <p className="text-slate-400 text-xs mt-1">Try a different filter or raise a new complaint.</p>
            </div>
          ) : filtered.map(c => (
            <div key={c._id} className="border-b last:border-b-0" style={{ borderColor: 'rgba(226,232,240,0.6)' }}>
              <div onClick={() => setExpanded(prev => prev === c._id ? null : c._id)}
                className="grid gap-4 items-center px-6 py-4 cursor-pointer transition-colors duration-150"
                style={{ gridTemplateColumns: '1fr auto auto auto auto', background: expanded === c._id ? 'rgba(239,246,255,0.7)' : 'transparent' }}
                onMouseEnter={e => { if (expanded !== c._id) e.currentTarget.style.background = 'rgba(248,250,252,0.8)'; }}
                onMouseLeave={e => { if (expanded !== c._id) e.currentTarget.style.background = 'transparent'; }}
              >
                <div className="min-w-0">
                  <span className="font-mono text-blue-500 text-xs font-bold mr-2">#{c._id?.slice(-6).toUpperCase()}</span>
                  <span className="text-slate-900 text-sm font-semibold">{c.title}</span>
                  <p className="text-slate-400 text-xs mt-0.5 truncate">{c.location}</p>
                </div>
                <div className="hidden sm:flex items-center gap-1.5 text-slate-500 text-xs whitespace-nowrap">
                  <span style={{ fontSize: 15 }}>{CATEGORY_ICONS[c.category] || '📋'}</span>
                  {c.category}
                </div>
                <PriorityBadge priority={c.priority || 'Low'} />
                <StatusPill status={c.status} />
                <button className="w-7 h-7 rounded-lg border border-slate-200 hover:border-blue-300 hover:bg-blue-50 flex items-center justify-center text-slate-400 hover:text-blue-500 transition-all">
                  <svg className="w-3.5 h-3.5 transition-transform duration-200"
                    style={{ transform: expanded === c._id ? 'rotate(180deg)' : 'rotate(0deg)' }}
                    fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              </div>

              {expanded === c._id && (
                <div className="px-6 pb-6 pt-3 border-t" style={{ background: 'rgba(239,246,255,0.4)', borderColor: 'rgba(219,234,254,0.6)' }}>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
                    {[
                      { label: 'Reporter', value: c.name || 'Anonymous' },
                      { label: 'Date Filed', value: new Date(c.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) },
                      { label: 'Priority', value: <PriorityBadge priority={c.priority || 'Low'} /> },
                      { label: 'Status', value: <StatusPill status={c.status} /> },
                    ].map(field => (
                      <div key={field.label} className="bg-white/80 border border-slate-200 rounded-xl p-3 shadow-sm">
                        <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-1.5">{field.label}</p>
                        <div className="text-slate-800 text-sm font-medium">{field.value}</div>
                      </div>
                    ))}
                  </div>
                  <div className="bg-white/80 border border-slate-200 rounded-xl p-4 shadow-sm">
                    <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-2">Description</p>
                    <p className="text-slate-600 text-sm leading-relaxed">{c.description}</p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
        <p className="text-center text-slate-400 text-xs mt-5">Click any row to expand details</p>
      </div>
    </div>
  );
}