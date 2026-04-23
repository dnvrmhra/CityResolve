import { submitComplaint } from '../services/api';
import { useState, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

const categories = ['Garbage', 'Water', 'Roads', 'Electricity', 'Parks', 'Traffic', 'Infrastructure', 'Other'];
const categoryIcons = {
  Garbage: '🗑️', Water: '💧', Roads: '🛣️', Electricity: '⚡',
  Parks: '🌳', Traffic: '🚦', Infrastructure: '🏗️', Other: '📋',
};
const categoryColors = {
  Garbage: 'border-emerald-300 bg-emerald-50 text-emerald-700',
  Water: 'border-blue-300 bg-blue-50 text-blue-700',
  Roads: 'border-orange-300 bg-orange-50 text-orange-700',
  Electricity: 'border-yellow-300 bg-yellow-50 text-yellow-700',
  Parks: 'border-green-300 bg-green-50 text-green-700',
  Traffic: 'border-red-300 bg-red-50 text-red-700',
  Infrastructure: 'border-purple-300 bg-purple-50 text-purple-700',
  Other: 'border-slate-300 bg-slate-50 text-slate-700',
};

function CityscapeBg() {
  return (
    <svg className="absolute bottom-0 left-0 right-0 w-full pointer-events-none z-0"
      viewBox="0 0 1200 320" preserveAspectRatio="xMidYMax meet" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#e0eaff" stopOpacity="0" />
          <stop offset="100%" stopColor="#c7d9f7" stopOpacity="0.55" />
        </linearGradient>
      </defs>
      <rect width="1200" height="320" fill="url(#sky)" />
      <g fill="#cbd5e1" opacity="0.45">
        <rect x="0" y="180" width="60" height="140" /><rect x="120" y="170" width="70" height="150" />
        <rect x="245" y="165" width="80" height="155" /><rect x="390" y="150" width="65" height="170" />
        <rect x="515" y="160" width="75" height="160" /><rect x="655" y="155" width="60" height="165" />
        <rect x="775" y="168" width="70" height="152" /><rect x="910" y="155" width="65" height="165" />
        <rect x="1100" y="162" width="75" height="158" />
      </g>
      <rect x="0" y="300" width="1200" height="20" fill="#cbd5e1" opacity="0.3" />
    </svg>
  );
}

const PRIORITY_COLORS = {
  High: 'bg-red-50 border-red-200 text-red-700',
  Medium: 'bg-yellow-50 border-yellow-200 text-yellow-700',
  Low: 'bg-slate-50 border-slate-200 text-slate-600',
};

const calcPriority = (title = '', description = '') => {
  const text = (title + ' ' + description).toLowerCase();
  const highWords = ['urgent', 'dangerous', 'accident', 'flood', 'fire', 'broken', 'emergency', 'hazard', 'toxic', 'sewage', 'overflow'];
  const medWords = ['leak', 'pothole', 'light', 'garbage', 'water', 'road', 'traffic', 'damage'];
  if (highWords.some(w => text.includes(w))) return 'High';
  if (medWords.some(w => text.includes(w))) return 'Medium';
  return 'Low';
};

const MAX_IMAGES = 3;
const MAX_SIZE_MB = 5;

export default function ComplaintForm() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [form, setForm] = useState({
    title: '', description: '', category: params.get('category') || '',
    location: '', name: '', phone: '',
  });
  const [images, setImages] = useState([]); // [{ file, preview, name }]
  const [submitted, setSubmitted] = useState(false);
  const [submittedData, setSubmittedData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [lightbox, setLightbox] = useState(null); // preview index

  const priority = calcPriority(form.title, form.description);

  const validate = () => {
    const e = {};
    if (!form.title.trim()) e.title = 'Title is required';
    if (!form.description.trim()) e.description = 'Description is required';
    if (!form.category) e.category = 'Please select a category';
    if (!form.location.trim()) e.location = 'Location is required';
    return e;
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const remaining = MAX_IMAGES - images.length;
    const toAdd = files.slice(0, remaining);
    const oversized = toAdd.filter(f => f.size > MAX_SIZE_MB * 1024 * 1024);

    if (oversized.length) {
      alert(`Some files exceed ${MAX_SIZE_MB}MB and were skipped.`);
    }

    const valid = toAdd.filter(f => f.size <= MAX_SIZE_MB * 1024 * 1024);
    const newImages = valid.map(file => ({
      file,
      name: file.name,
      preview: URL.createObjectURL(file),
    }));
    setImages(prev => [...prev, ...newImages]);
    e.target.value = '';
  };

  const removeImage = (idx) => {
    setImages(prev => {
      URL.revokeObjectURL(prev[idx].preview);
      return prev.filter((_, i) => i !== idx);
    });
  };

  const handleSubmit = async () => {
    const e2 = validate();
    if (Object.keys(e2).length) { setErrors(e2); return; }
    setLoading(true);
    try {
      const result = await submitComplaint(form, images.map(i => i.file));
      setSubmittedData(result);
      setSubmitted(true);
      images.forEach(i => URL.revokeObjectURL(i.preview));
    } catch (err) {
      alert('Failed to submit complaint. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    const p = submittedData?.priority || priority;
    return (
      <div className="min-h-screen bg-slate-50 relative overflow-hidden flex items-center justify-center px-6">
        <CityscapeBg />
        <div className="relative z-10 text-center max-w-md w-full bg-white rounded-3xl shadow-xl border border-slate-100 p-12">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-3xl mx-auto mb-6 shadow-lg shadow-emerald-200">
            ✓
          </div>
          <h2 className="text-3xl font-black text-slate-900 mb-2">Submitted!</h2>
          <p className="text-slate-500 mb-4">Your complaint has been registered.</p>
          <div className="inline-block px-5 py-2 rounded-xl bg-blue-50 border border-blue-200 text-blue-700 font-mono font-bold text-lg mb-4">
            {submittedData?._id?.slice(-6).toUpperCase() || 'XXXXXX'}
          </div>
          <div className="flex justify-center mb-6">
            <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl border text-sm font-bold ${PRIORITY_COLORS[p]}`}>
              <span className="text-base">{p === 'High' ? '🔴' : p === 'Medium' ? '🟡' : '🟢'}</span>
              Priority: {p}
            </span>
          </div>
          <p className="text-slate-400 mb-8 text-sm">We'll review your report and keep you updated on the resolution progress.</p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={() => { setSubmitted(false); setForm({ title: '', description: '', category: '', location: '', name: '', phone: '' }); setImages([]); }}
              className="px-6 py-3 border border-slate-200 hover:border-blue-300 text-slate-700 rounded-xl transition-all font-semibold hover:bg-blue-50"
            >
              New Complaint
            </button>
            <button
              onClick={() => navigate('/dashboard')}
              className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-700 text-white font-bold rounded-xl shadow-md shadow-blue-200 transition-all active:scale-95"
            >
              View Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 relative overflow-hidden py-14 px-6">
      <CityscapeBg />
      <div className="max-w-2xl mx-auto relative z-10">
        <div className="mb-10">
          <p className="text-blue-500 text-xs font-bold tracking-widest uppercase mb-2">Citizen Portal</p>
          <h1 className="text-4xl font-black text-slate-900 mb-2">Raise a Complaint</h1>
          <p className="text-slate-500">Fill in the details below and we'll route your complaint to the right department.</p>
        </div>

        {/* Category picker */}
        <div className="mb-8">
          <label className="block text-xs font-bold tracking-widest uppercase text-slate-400 mb-3">Select Category <span className="text-red-500">*</span></label>
          <div className="grid grid-cols-4 gap-2">
            {categories.map(cat => (
              <button key={cat} type="button"
                onClick={() => setForm(f => ({ ...f, category: cat }))}
                className={`flex flex-col items-center gap-1.5 py-3 px-2 rounded-xl border-2 text-xs font-semibold transition-all duration-200
                  ${form.category === cat ? categoryColors[cat] + ' shadow-sm' : 'border-slate-200 bg-white text-slate-500 hover:border-slate-300 hover:bg-slate-50'}`}
              >
                <span className="text-xl">{categoryIcons[cat]}</span>
                {cat}
              </button>
            ))}
          </div>
          {errors.category && <p className="text-red-500 text-xs mt-2">{errors.category}</p>}
        </div>

        {/* Form card */}
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-8 space-y-5">

          {/* Live priority indicator */}
          {(form.title || form.description) && (
            <div className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-semibold ${PRIORITY_COLORS[priority]}`}>
              <span>{priority === 'High' ? '🔴' : priority === 'Medium' ? '🟡' : '🟢'}</span>
              Auto-detected Priority: <strong>{priority}</strong>
              <span className="text-xs font-normal opacity-60 ml-1">— based on your description</span>
            </div>
          )}

          {[
            { key: 'title', label: 'Complaint Title', placeholder: 'e.g. Broken streetlight on MG Road', required: true },
            { key: 'location', label: 'Location / Address', placeholder: 'e.g. Sector 22, Chandigarh', required: true },
          ].map(field => (
            <div key={field.key}>
              <label className="block text-xs font-bold tracking-widest uppercase text-slate-400 mb-2">
                {field.label} {field.required && <span className="text-red-500">*</span>}
              </label>
              <input type="text" placeholder={field.placeholder} value={form[field.key]}
                onChange={e => { setForm(f => ({ ...f, [field.key]: e.target.value })); setErrors(x => ({ ...x, [field.key]: '' })); }}
                className={`w-full bg-slate-50 border rounded-xl px-4 py-3 text-slate-900 placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition-all ${errors[field.key] ? 'border-red-300 bg-red-50' : 'border-slate-200'}`}
              />
              {errors[field.key] && <p className="text-red-500 text-xs mt-1">{errors[field.key]}</p>}
            </div>
          ))}

          <div>
            <label className="block text-xs font-bold tracking-widest uppercase text-slate-400 mb-2">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea rows={4} placeholder="Describe the issue in detail..." value={form.description}
              onChange={e => { setForm(f => ({ ...f, description: e.target.value })); setErrors(x => ({ ...x, description: '' })); }}
              className={`w-full bg-slate-50 border rounded-xl px-4 py-3 text-slate-900 placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition-all resize-none ${errors.description ? 'border-red-300 bg-red-50' : 'border-slate-200'}`}
            />
            {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
          </div>

          {/* ── Image Upload ── */}
          <div>
            <label className="block text-xs font-bold tracking-widest uppercase text-slate-400 mb-2">
              Photos <span className="text-slate-300 font-normal normal-case tracking-normal">— optional, up to {MAX_IMAGES}</span>
            </label>

            {/* Thumbnails */}
            {images.length > 0 && (
              <div className="flex gap-3 flex-wrap mb-3">
                {images.map((img, idx) => (
                  <div key={idx} className="relative group">
                    <img
                      src={img.preview}
                      alt={img.name}
                      onClick={() => setLightbox(idx)}
                      className="w-24 h-24 object-cover rounded-xl border border-slate-200 cursor-pointer hover:opacity-90 transition-opacity shadow-sm"
                    />
                    {/* Remove button */}
                    <button
                      type="button"
                      onClick={() => removeImage(idx)}
                      className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-red-500 text-white flex items-center justify-center text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity shadow"
                    >
                      ×
                    </button>
                    {/* Filename tooltip */}
                    <p className="text-slate-400 text-xs mt-1 truncate w-24 text-center">{img.name}</p>
                  </div>
                ))}

                {/* Add more slot */}
                {images.length < MAX_IMAGES && (
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="w-24 h-24 rounded-xl border-2 border-dashed border-slate-300 hover:border-blue-400 bg-slate-50 hover:bg-blue-50 flex flex-col items-center justify-center text-slate-400 hover:text-blue-500 transition-all gap-1"
                  >
                    <span className="text-2xl leading-none">+</span>
                    <span className="text-xs">Add</span>
                  </button>
                )}
              </div>
            )}

            {/* Drop zone (shown when no images yet) */}
            {images.length === 0 && (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-slate-200 hover:border-blue-400 bg-slate-50 hover:bg-blue-50 rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer transition-all gap-2 group"
              >
                <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 group-hover:border-blue-200 flex items-center justify-center shadow-sm">
                  <svg className="w-5 h-5 text-slate-400 group-hover:text-blue-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <p className="text-slate-500 text-sm font-medium group-hover:text-blue-600 transition-colors">Click to upload photos</p>
                <p className="text-slate-400 text-xs">JPG, PNG, WEBP · up to {MAX_SIZE_MB}MB each · max {MAX_IMAGES} photos</p>
              </div>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              multiple
              onChange={handleImageChange}
              className="hidden"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            {[
              { key: 'name', label: 'Your Name', placeholder: 'Optional', type: 'text' },
              { key: 'phone', label: 'Phone Number', placeholder: 'Optional', type: 'tel' },
            ].map(field => (
              <div key={field.key}>
                <label className="block text-xs font-bold tracking-widest uppercase text-slate-400 mb-2">{field.label}</label>
                <input type={field.type} placeholder={field.placeholder} value={form[field.key]}
                  onChange={e => setForm(f => ({ ...f, [field.key]: e.target.value }))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition-all"
                />
              </div>
            ))}
          </div>

          <button onClick={handleSubmit} disabled={loading}
            className="w-full py-4 bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold rounded-xl shadow-lg shadow-blue-200 transition-all duration-200 active:scale-[0.99] text-base mt-2"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-3">
                <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Submitting...
              </span>
            ) : `Submit Complaint ↗${images.length ? ` (${images.length} photo${images.length > 1 ? 's' : ''})` : ''}`}
          </button>
        </div>
      </div>

      {/* Lightbox */}
      {lightbox !== null && (
        <div
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
          onClick={() => setLightbox(null)}
        >
          <div className="relative max-w-2xl w-full" onClick={e => e.stopPropagation()}>
            <img
              src={images[lightbox].preview}
              alt={images[lightbox].name}
              className="w-full max-h-[80vh] object-contain rounded-2xl shadow-2xl"
            />
            <button
              onClick={() => setLightbox(null)}
              className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/60 text-white flex items-center justify-center text-lg hover:bg-black/80 transition-colors"
            >
              ×
            </button>
            {images.length > 1 && (
              <div className="flex justify-center gap-2 mt-3">
                {images.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setLightbox(i)}
                    className={`w-2 h-2 rounded-full transition-all ${i === lightbox ? 'bg-white scale-125' : 'bg-white/40'}`}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}