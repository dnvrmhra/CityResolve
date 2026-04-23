import { fetchComplaints, updateComplaintStatus, deleteComplaint } from '../services/api';
import { useState, useEffect } from 'react';

// ─── Shared image gallery used inside expanded complaint cards ────────────────
function ImageGallery({ images }) {
  const [lightbox, setLightbox] = useState(null);
  if (!images || images.length === 0) return null;

  return (
    <>
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 mb-4">
        <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-3">
          Attached Photos <span className="text-slate-300 font-normal normal-case">({images.length})</span>
        </p>
        <div className="flex flex-wrap gap-3">
          {images.map((url, i) => (
            <div key={i} className="relative group cursor-pointer" onClick={() => setLightbox(i)}>
              <img
                src={url}
                alt={`Evidence ${i + 1}`}
                className="w-24 h-24 object-cover rounded-xl border border-slate-200 hover:opacity-90 transition-opacity shadow-sm"
              />
              <div className="absolute inset-0 rounded-xl bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                <svg className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity drop-shadow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                </svg>
              </div>
            </div>
          ))}
        </div>
      </div>

      {lightbox !== null && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4" onClick={() => setLightbox(null)}>
          <div className="relative max-w-3xl w-full" onClick={e => e.stopPropagation()}>
            <img src={images[lightbox]} alt={`Evidence ${lightbox + 1}`} className="w-full max-h-[80vh] object-contain rounded-2xl shadow-2xl" />
            <button onClick={() => setLightbox(null)} className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/60 text-white flex items-center justify-center text-lg hover:bg-black/80 transition-colors">×</button>
            {images.length > 1 && (
              <>
                <button onClick={e => { e.stopPropagation(); setLightbox(i => (i - 1 + images.length) % images.length); }} className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black/80 text-xl">‹</button>
                <button onClick={e => { e.stopPropagation(); setLightbox(i => (i + 1) % images.length); }} className="absolute right-12 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black/80 text-xl">›</button>
                <div className="flex justify-center gap-2 mt-3">
                  {images.map((_, i) => <button key={i} onClick={() => setLightbox(i)} className={`w-2 h-2 rounded-full transition-all ${i === lightbox ? 'bg-white scale-125' : 'bg-white/40'}`} />)}
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}

const ADMIN_PASSWORD = '1234';

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

const ALL_STATUSES = ['Pending', 'In Progress', 'Resolved', 'Rejected'];

const SAMPLE = [
  { _id: 's1', title: 'Pothole on MG Road', category: 'Roads', location: 'Sector 17, Chandigarh', status: 'In Progress', priority: 'High', createdAt: '2026-04-18T09:00:00Z', name: 'Amit Sharma', description: 'Large pothole near the bus stop.' },
  { _id: 's2', title: 'Garbage not collected', category: 'Garbage', location: 'Phase 7, Mohali', status: 'Pending', priority: 'Medium', createdAt: '2026-04-19T11:00:00Z', name: 'Priya Nair', description: 'Overflowing garbage bins outside D-block market.' },
];

function StatusPill({ status }) {
  const s = STATUS_STYLES[status] || STATUS_STYLES['Pending'];
  return (
    <span className={'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-semibold ' + s.pill}>
      <span className={'w-1.5 h-1.5 rounded-full ' + s.dot} />{status}
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

function ComplaintCard({ complaint, onStatusChange, onDelete }) {
  const [expanded, setExpanded] = useState(false);
  const [pending, setPending] = useState(complaint.status);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => { setPending(complaint.status); }, [complaint.status]);

  const handleApply = async () => {
    if (pending === complaint.status) return;
    setSaving(true);
    await onStatusChange(complaint._id, pending);
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2200);
  };

  return (
    <div className={'rounded-2xl border transition-all duration-200 overflow-hidden shadow-sm ' +
      (expanded ? 'border-blue-300 shadow-blue-100' : 'border-slate-200 hover:border-slate-300 hover:shadow-md')}>

      <div onClick={() => setExpanded(e => !e)}
        className={'flex items-center gap-4 px-5 py-4 cursor-pointer transition-colors ' +
          (expanded ? 'bg-blue-50' : 'bg-white hover:bg-slate-50')}>
        <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-xl flex-shrink-0">
          {CATEGORY_ICONS[complaint.category] || '📋'}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-mono text-blue-500 text-xs font-bold">#{complaint._id?.slice(-6).toUpperCase()}</span>
            <span className="text-slate-900 text-sm font-semibold truncate">{complaint.title}</span>
          </div>
          <p className="text-slate-400 text-xs mt-0.5">{complaint.location} · {complaint.category}</p>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <PriorityBadge priority={complaint.priority || 'Low'} />
          <StatusPill status={complaint.status} />
          <div className={'w-7 h-7 rounded-lg border flex items-center justify-center transition-all ' +
            (expanded ? 'border-blue-300 bg-blue-100 text-blue-600' : 'border-slate-200 text-slate-400')}>
            <svg className="w-3.5 h-3.5 transition-transform duration-200"
              style={{ transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)' }}
              fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </div>

      {expanded && (
        <div className="border-t border-blue-100 bg-white px-5 pb-5 pt-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
            {[
              { label: 'Reporter',     value: complaint.name || 'Anonymous' },
              { label: 'Category',     value: (CATEGORY_ICONS[complaint.category] || '') + ' ' + complaint.category },
              { label: 'Date Filed',   value: new Date(complaint.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) },
              { label: 'Priority',     value: <PriorityBadge priority={complaint.priority || 'Low'} /> },
            ].map(f => (
              <div key={f.label} className="bg-slate-50 border border-slate-200 rounded-xl p-3">
                <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-1">{f.label}</p>
                <div className="text-slate-800 text-sm font-semibold">{f.value}</div>
              </div>
            ))}
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 mb-4">
            <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-2">Description</p>
            <p className="text-slate-700 text-sm leading-relaxed">{complaint.description}</p>
          </div>

          <ImageGallery images={complaint.images} />

          <div className="flex flex-wrap items-center gap-3 bg-blue-50 border border-blue-200 rounded-xl px-4 py-3">
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-blue-700 text-xs font-bold uppercase tracking-wider">Update Status</span>
            </div>
            <select value={pending} onChange={e => setPending(e.target.value)}
              onClick={e => e.stopPropagation()}
              className="bg-white border border-blue-200 text-slate-700 text-sm rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-200 cursor-pointer">
              {ALL_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
            <button onClick={e => { e.stopPropagation(); handleApply(); }}
              disabled={pending === complaint.status || saving}
              className="px-4 py-1.5 bg-blue-500 hover:bg-blue-600 disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed text-white text-sm font-bold rounded-lg transition-all active:scale-95 shadow-sm">
              {saving ? 'Saving...' : 'Apply'}
            </button>
            <button onClick={e => { e.stopPropagation(); onDelete(complaint._id); }}
              className="px-4 py-1.5 bg-red-500 hover:bg-red-600 text-white text-sm font-bold rounded-lg transition-all active:scale-95 shadow-sm">
              Delete
            </button>
            {saved && (
              <span className="text-emerald-600 text-xs font-semibold flex items-center gap-1.5">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
                Status updated!
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default function Admin() {
  const [authed, setAuthed] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [complaints, setComplaints] = useState([]);
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (authed) {
      setLoading(true);
      fetchComplaints()
        .then(data => { setComplaints(data); setLoading(false); })
        .catch(() => { setComplaints(SAMPLE); setLoading(false); });
    }
  }, [authed]);

  const handleLogin = () => {
    if (password === ADMIN_PASSWORD) { setAuthed(true); setError(''); }
    else { setError('Incorrect password. Please try again.'); setPassword(''); }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await updateComplaintStatus(id, newStatus);
      setComplaints(prev => prev.map(c => c._id === id ? { ...c, status: newStatus } : c));
    } catch {
      alert('Failed to update status. Check your backend connection.');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this complaint permanently?')) return;
    try {
      await deleteComplaint(id);
      setComplaints(prev => prev.filter(c => c._id !== id));
    } catch {
      alert('Failed to delete. Check your backend connection.');
    }
  };

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

  /* LOGIN SCREEN */
  if (!authed) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-6">
        <div className="w-full max-w-sm">
          <div className="flex flex-col items-center mb-8">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center shadow-lg shadow-blue-200 mb-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h1 className="text-2xl font-black text-slate-900">Admin Access</h1>
            <p className="text-slate-400 text-sm mt-1 text-center">Enter your admin password to continue</p>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8">
            <label className="block text-xs font-bold tracking-widest uppercase text-slate-400 mb-2">Password</label>
            <div className="relative mb-4">
              <input type={showPw ? 'text' : 'password'} value={password}
                onChange={e => { setPassword(e.target.value); setError(''); }}
                onKeyDown={e => e.key === 'Enter' && handleLogin()}
                placeholder="Enter admin password"
                className={'w-full bg-slate-50 border rounded-xl px-4 py-3 text-slate-900 placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition-all pr-11 ' +
                  (error ? 'border-red-300 bg-red-50' : 'border-slate-200')}
              />
              <button type="button" onClick={() => setShowPw(s => !s)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors">
                {showPw ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
            </div>

            {error && (
              <div className="flex items-center gap-2 text-red-600 text-xs font-semibold mb-4 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {error}
              </div>
            )}

            <button onClick={handleLogin}
              className="w-full py-3 bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white font-bold rounded-xl shadow-md shadow-blue-200 transition-all active:scale-95">
              Sign In
            </button>
          </div>
          <p className="text-center text-slate-400 text-xs mt-5">Restricted to authorised city administrators only.</p>
        </div>
      </div>
    );
  }

  /* ADMIN DASHBOARD */
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-600 text-xs font-bold">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                Admin Panel
              </span>
            </div>
            <h1 className="text-3xl font-black tracking-tight text-slate-900">Complaint Management</h1>
            <p className="text-slate-400 text-sm mt-1 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse inline-block" />
              {complaints.length} total · {counts.Pending} awaiting review
            </p>
          </div>
          <button onClick={() => { setAuthed(false); setPassword(''); }}
            className="self-start sm:self-auto flex items-center gap-2 px-4 py-2.5 border border-slate-200 hover:border-red-200 hover:bg-red-50 text-slate-500 hover:text-red-500 font-semibold rounded-xl text-sm transition-all">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Sign Out
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-7">
          {[
            { label: 'Total',       value: counts.All,            color: 'text-slate-900',   bg: 'border-slate-200' },
            { label: 'Pending',     value: counts.Pending,        color: 'text-yellow-600',  bg: 'border-yellow-200' },
            { label: 'In Progress', value: counts['In Progress'], color: 'text-blue-600',    bg: 'border-blue-200' },
            { label: 'Resolved',    value: counts.Resolved,       color: 'text-emerald-600', bg: 'border-emerald-200' },
          ].map(s => (
            <div key={s.label} className={'bg-white border rounded-2xl px-5 py-4 shadow-sm ' + s.bg}>
              <div className={'text-2xl font-black ' + s.color}>{s.value}</div>
              <div className="text-slate-400 text-xs font-semibold uppercase tracking-widest mt-1">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Search + filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-5">
          <div className="relative flex-1">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input type="text" placeholder="Search by title, location, or ID..." value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-xl pl-9 pr-4 py-2.5 text-sm text-slate-700 placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition-all"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {filters.map(f => (
              <button key={f} onClick={() => setFilter(f)}
                className={'px-3.5 py-2 rounded-xl text-sm font-semibold border transition-all duration-150 ' +
                  (filter === f ? 'bg-blue-50 border-blue-300 text-blue-700' : 'border-slate-200 text-slate-500 hover:text-slate-700 hover:border-slate-300 bg-white')}>
                {f} <span className="ml-1 text-xs opacity-50">({counts[f] ?? 0})</span>
              </button>
            ))}
          </div>
        </div>

        {/* Cards */}
        {loading ? (
          <div className="bg-white border border-slate-200 rounded-2xl py-16 text-center text-slate-400 text-sm shadow-sm">
            Loading complaints from database...
          </div>
        ) : filtered.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-2xl py-16 text-center shadow-sm">
            <p className="text-slate-500 font-semibold text-sm">No complaints found</p>
            <p className="text-slate-400 text-xs mt-1">Try adjusting your search or filter.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map(c => (
              <ComplaintCard key={c._id} complaint={c}
                onStatusChange={handleStatusChange} onDelete={handleDelete} />
            ))}
          </div>
        )}

        <p className="text-center text-slate-400 text-xs mt-6">Click any card to expand details and update status</p>
      </div>
    </div>
  );
}