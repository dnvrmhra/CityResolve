import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const STATUS_STYLES = {
  'Pending':     { pill: 'bg-yellow-50 text-yellow-700 border-yellow-200',    dot: 'bg-yellow-400' },
  'In Progress': { pill: 'bg-blue-50 text-blue-700 border-blue-200',          dot: 'bg-blue-500' },
  'Resolved':    { pill: 'bg-emerald-50 text-emerald-700 border-emerald-200', dot: 'bg-emerald-500' },
  'Rejected':    { pill: 'bg-red-50 text-red-700 border-red-200',             dot: 'bg-red-400' },
};

const CATEGORY_ICONS = {
  Garbage: '🗑️', Water: '💧', Roads: '🛣️', Electricity: '⚡',
  Parks: '🌳', Traffic: '🚦', Infrastructure: '🏗️', Other: '📋',
};

const SAMPLE = [
  { id: 'CR-001', title: 'Pothole on MG Road', category: 'Roads', location: 'Sector 17, Chandigarh', status: 'In Progress', date: '2026-04-18T09:00:00Z', reporter: 'Amit Sharma', description: 'Large pothole near the bus stop causing accidents and vehicle damage. Has been present for over 2 weeks.' },
  { id: 'CR-002', title: 'Garbage not collected for 3 days', category: 'Garbage', location: 'Phase 7, Mohali', status: 'Pending', date: '2026-04-19T11:00:00Z', reporter: 'Priya Nair', description: 'Overflowing garbage bins outside D-block market. Residents have complained multiple times.' },
  { id: 'CR-003', title: 'Streetlight out on corner junction', category: 'Electricity', location: 'Sector 8, Kharar', status: 'Resolved', date: '2026-04-15T08:00:00Z', reporter: 'Rahul Gupta', description: 'Street light at the junction has been non-functional for a week. Safety concern at night.' },
  { id: 'CR-004', title: 'Water pipe leaking near park', category: 'Water', location: 'Sector 22, Chandigarh', status: 'Pending', date: '2026-04-20T07:00:00Z', reporter: 'Sunita Mehta', description: "Underground pipe leaking near the children's park. Road surface is getting damaged." },
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

export default function Dashboard() {
  const [complaints, setComplaints] = useState([]);
  const [filter, setFilter] = useState('All');
  const [expanded, setExpanded] = useState(null);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('complaints') || '[]');
    setComplaints([...saved, ...SAMPLE]);
  }, []);

  const filters = ['All', 'Pending', 'In Progress', 'Resolved', 'Rejected'];
  const filtered = filter === 'All' ? complaints : complaints.filter(c => c.status === filter);
  const counts = {
    All: complaints.length,
    Pending: complaints.filter(c => c.status === 'Pending').length,
    'In Progress': complaints.filter(c => c.status === 'In Progress').length,
    Resolved: complaints.filter(c => c.status === 'Resolved').length,
    Rejected: complaints.filter(c => c.status === 'Rejected').length,
  };

  return (
    <div
      className="min-h-screen text-slate-900"
      style={{ background: 'linear-gradient(135deg, #f0f7ff 0%, #ffffff 40%, #f5f3ff 70%, #eff6ff 100%)' }}
    >
      {/* Subtle decorative blobs */}
      <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0, overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '-10%', right: '-5%', width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle, rgba(191,219,254,0.35) 0%, transparent 70%)' }} />
        <div style={{ position: 'absolute', bottom: '10%', left: '-8%', width: 420, height: 420, borderRadius: '50%', background: 'radial-gradient(circle, rgba(196,181,253,0.2) 0%, transparent 70%)' }} />
        <div style={{ position: 'absolute', top: '40%', left: '30%', width: 300, height: 300, borderRadius: '50%', background: 'radial-gradient(circle, rgba(186,230,253,0.18) 0%, transparent 70%)' }} />
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
          <Link
            to="/complaint"
            className="self-start sm:self-auto px-5 py-2.5 bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white font-bold rounded-xl text-sm shadow-md shadow-blue-200 transition-all active:scale-95"
          >
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
            <div key={s.label} className="rounded-2xl px-5 py-4 shadow-sm" style={{ background: s.bg, border: `1px solid ${s.border}`, backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)' }}>
              <div className={'text-2xl font-black ' + s.color}>{s.value}</div>
              <div className="text-slate-400 text-xs font-semibold uppercase tracking-widest mt-1">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-2 mb-5">
          {filters.map(f => (
            <button
              key={f}
              onClick={() => { setFilter(f); setExpanded(null); }}
              className={'px-4 py-1.5 rounded-xl text-sm font-semibold border transition-all duration-150 ' +
                (filter === f
                  ? 'bg-blue-50 border-blue-300 text-blue-700 shadow-sm'
                  : 'border-slate-200 text-slate-500 hover:text-slate-700 hover:border-slate-300 bg-white/70 backdrop-blur-sm')}
            >
              {f} <span className="ml-1 text-xs opacity-50">({counts[f] ?? 0})</span>
            </button>
          ))}
        </div>

        {/* List */}
        <div
          className="rounded-2xl overflow-hidden shadow-sm"
          style={{ background: 'rgba(255,255,255,0.75)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', border: '1px solid rgba(226,232,240,0.8)' }}
        >
          <div
            className="grid gap-4 items-center px-6 py-3 border-b"
            style={{ gridTemplateColumns: '1fr auto auto auto', background: 'rgba(248,250,252,0.9)', borderColor: 'rgba(226,232,240,0.8)' }}
          >
            <span className="text-slate-400 text-xs font-bold uppercase tracking-wider">Complaint</span>
            <span className="hidden sm:block text-slate-400 text-xs font-bold uppercase tracking-wider">Category</span>
            <span className="text-slate-400 text-xs font-bold uppercase tracking-wider">Status</span>
            <span className="w-7" />
          </div>

          {filtered.length === 0 ? (
            <div className="py-16 text-center">
              <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto mb-4">
                <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <p className="text-slate-500 font-semibold text-sm">No complaints found</p>
              <p className="text-slate-400 text-xs mt-1">Try a different filter or raise a new complaint.</p>
            </div>
          ) : (
            filtered.map(c => (
              <div key={c.id} className="border-b last:border-b-0" style={{ borderColor: 'rgba(226,232,240,0.6)' }}>
                <div
                  onClick={() => setExpanded(prev => prev === c.id ? null : c.id)}
                  className="grid gap-4 items-center px-6 py-4 cursor-pointer transition-colors duration-150"
                  style={{
                    gridTemplateColumns: '1fr auto auto auto',
                    background: expanded === c.id ? 'rgba(239,246,255,0.7)' : 'transparent',
                  }}
                  onMouseEnter={e => { if (expanded !== c.id) e.currentTarget.style.background = 'rgba(248,250,252,0.8)'; }}
                  onMouseLeave={e => { if (expanded !== c.id) e.currentTarget.style.background = 'transparent'; }}
                >
                  <div className="min-w-0">
                    <span className="font-mono text-blue-500 text-xs font-bold mr-2">{c.id}</span>
                    <span className="text-slate-900 text-sm font-semibold">{c.title}</span>
                    <p className="text-slate-400 text-xs mt-0.5 truncate">{c.location}</p>
                  </div>
                  <div className="hidden sm:flex items-center gap-1.5 text-slate-500 text-xs whitespace-nowrap">
                    <span style={{ fontSize: 15 }}>{CATEGORY_ICONS[c.category] || '📋'}</span>
                    {c.category}
                  </div>
                  <StatusPill status={c.status} />
                  <button className="w-7 h-7 rounded-lg border border-slate-200 hover:border-blue-300 hover:bg-blue-50 flex items-center justify-center text-slate-400 hover:text-blue-500 transition-all">
                    <svg
                      className="w-3.5 h-3.5 transition-transform duration-200"
                      style={{ transform: expanded === c.id ? 'rotate(180deg)' : 'rotate(0deg)' }}
                      fill="none" stroke="currentColor" viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                </div>

                {expanded === c.id && (
                  <div
                    className="px-6 pb-6 pt-3 border-t"
                    style={{ background: 'rgba(239,246,255,0.4)', borderColor: 'rgba(219,234,254,0.6)' }}
                  >
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-4">
                      {[
                        { label: 'Reporter',   value: c.reporter || 'Anonymous' },
                        { label: 'Date Filed', value: new Date(c.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) },
                        { label: 'Status',     value: <StatusPill status={c.status} /> },
                      ].map(field => (
                        <div key={field.label} className="bg-white/80 border border-slate-200 rounded-xl p-3 shadow-sm backdrop-blur-sm">
                          <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-1.5">{field.label}</p>
                          <div className="text-slate-800 text-sm font-medium">{field.value}</div>
                        </div>
                      ))}
                    </div>
                    <div className="bg-white/80 border border-slate-200 rounded-xl p-4 shadow-sm backdrop-blur-sm">
                      <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-2">Description</p>
                      <p className="text-slate-600 text-sm leading-relaxed">{c.description}</p>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        <p className="text-center text-slate-400 text-xs mt-5">Click any row to expand details</p>
      </div>
    </div>
  );
}