import { useState } from 'react';
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
    <svg
      className="absolute bottom-0 left-0 right-0 w-full pointer-events-none z-0"
      viewBox="0 0 1200 320"
      preserveAspectRatio="xMidYMax meet"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#e0eaff" stopOpacity="0" />
          <stop offset="100%" stopColor="#c7d9f7" stopOpacity="0.55" />
        </linearGradient>
      </defs>
      
      <rect width="1200" height="320" fill="url(#sky)" />
      <g fill="#94a3b8" opacity="0.3">
        <rect x="30" y="200" width="25" height="120" /><rect x="160" y="210" width="30" height="110" />
        <rect x="310" y="205" width="20" height="115" /><rect x="500" y="198" width="35" height="122" />
        <rect x="700" y="200" width="28" height="120" /><rect x="900" y="195" width="32" height="125" />
        <rect x="1070" y="200" width="25" height="120" />
      </g>
      <g fill="#cbd5e1" opacity="0.45">
        <rect x="0" y="180" width="60" height="140" /><rect x="15" y="160" width="30" height="20" /><rect x="22" y="148" width="16" height="14" />
        <rect x="65" y="200" width="50" height="120" /><rect x="75" y="185" width="30" height="16" />
        <rect x="120" y="170" width="70" height="150" /><rect x="130" y="155" width="50" height="16" /><rect x="148" y="143" width="14" height="13" />
        <rect x="195" y="195" width="45" height="125" /><rect x="205" y="180" width="25" height="16" />
        <rect x="245" y="165" width="80" height="155" /><rect x="255" y="148" width="60" height="18" /><rect x="278" y="136" width="14" height="13" />
        <rect x="330" y="185" width="55" height="135" /><rect x="340" y="170" width="35" height="16" />
        <rect x="390" y="150" width="65" height="170" /><rect x="400" y="133" width="45" height="18" /><rect x="420" y="122" width="5" height="12" />
        <rect x="460" y="175" width="50" height="145" /><rect x="470" y="160" width="30" height="16" />
        <rect x="515" y="160" width="75" height="160" /><rect x="525" y="142" width="55" height="19" /><rect x="548" y="130" width="9" height="13" />
        <rect x="595" y="188" width="55" height="132" /><rect x="605" y="173" width="35" height="16" />
        <rect x="655" y="155" width="60" height="165" /><rect x="665" y="138" width="40" height="18" /><rect x="682" y="127" width="6" height="12" />
        <rect x="720" y="178" width="50" height="142" /><rect x="730" y="163" width="30" height="16" />
        <rect x="775" y="168" width="70" height="152" /><rect x="785" y="151" width="50" height="18" /><rect x="808" y="140" width="4" height="12" />
        <rect x="850" y="185" width="55" height="135" /><rect x="860" y="170" width="35" height="16" />
        <rect x="910" y="155" width="65" height="165" /><rect x="920" y="138" width="45" height="18" /><rect x="940" y="127" width="5" height="12" />
        <rect x="980" y="172" width="60" height="148" /><rect x="990" y="156" width="40" height="17" />
        <rect x="1045" y="185" width="50" height="135" /><rect x="1055" y="170" width="30" height="16" />
        <rect x="1100" y="162" width="75" height="158" /><rect x="1110" y="145" width="55" height="18" /><rect x="1133" y="134" width="9" height="12" />
      </g>
      <rect x="0" y="300" width="1200" height="20" fill="#cbd5e1" opacity="0.3" />
      <g fill="#bfdbfe" opacity="0.55">
        <rect x="9" y="194" width="5" height="5" /><rect x="17" y="194" width="5" height="5" />
        <rect x="9" y="202" width="5" height="5" /><rect x="17" y="202" width="5" height="5" />
        <rect x="135" y="178" width="5" height="5" /><rect x="143" y="178" width="5" height="5" />
        <rect x="260" y="172" width="5" height="5" /><rect x="268" y="172" width="5" height="5" />
        <rect x="396" y="158" width="5" height="5" /><rect x="404" y="158" width="5" height="5" />
        <rect x="522" y="168" width="5" height="5" /><rect x="530" y="168" width="5" height="5" />
        <rect x="662" y="163" width="5" height="5" /><rect x="670" y="163" width="5" height="5" />
        <rect x="782" y="175" width="5" height="5" /><rect x="790" y="175" width="5" height="5" />
        <rect x="917" y="163" width="5" height="5" /><rect x="925" y="163" width="5" height="5" />
        <rect x="1112" y="152" width="5" height="5" /><rect x="1120" y="152" width="5" height="5" />
      </g>
    </svg>
  );
}

export default function ComplaintForm() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: '', description: '', category: params.get('category') || '',
    location: '', name: '', phone: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!form.title.trim()) e.title = 'Title is required';
    if (!form.description.trim()) e.description = 'Description is required';
    if (!form.category) e.category = 'Please select a category';
    if (!form.location.trim()) e.location = 'Location is required';
    return e;
  };

  const handleSubmit = async () => {
    const e2 = validate();
    if (Object.keys(e2).length) { setErrors(e2); return; }
    setLoading(true);
    await new Promise(r => setTimeout(r, 1200));
    const complaint = {
      ...form,
      id: `CR-${Date.now().toString().slice(-6)}`,
      status: 'Pending',
      date: new Date().toISOString(),
      reporter: form.name || 'Anonymous',
    };
    const existing = JSON.parse(localStorage.getItem('complaints') || '[]');
    localStorage.setItem('complaints', JSON.stringify([complaint, ...existing]));
    setLoading(false);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-slate-50 relative overflow-hidden flex items-center justify-center px-6">
        <CityscapeBg />
        <div className="relative z-10 text-center max-w-md bg-white rounded-3xl shadow-xl border border-slate-100 p-12">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-3xl mx-auto mb-6 shadow-lg shadow-emerald-200">
            ✓
          </div>
          <h2 className="text-3xl font-black text-slate-900 mb-2">Submitted!</h2>
          <p className="text-slate-500 mb-4">Your complaint has been registered.</p>
          <div className="inline-block px-5 py-2 rounded-xl bg-blue-50 border border-blue-200 text-blue-700 font-mono font-bold text-lg mb-8">
            {form.id || 'CR-' + Date.now().toString().slice(-6)}
          </div>
          <p className="text-slate-400 mb-8 text-sm">We'll review your report and keep you updated on the resolution progress.</p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={() => { setSubmitted(false); setForm({ title: '', description: '', category: '', location: '', name: '', phone: '' }); }}
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
              <button
                key={cat}
                type="button"
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
          {[
            { key: 'title', label: 'Complaint Title', placeholder: 'e.g. Broken streetlight on MG Road', required: true },
            { key: 'location', label: 'Location / Address', placeholder: 'e.g. Sector 22, Chandigarh', required: true },
          ].map(field => (
            <div key={field.key}>
              <label className="block text-xs font-bold tracking-widest uppercase text-slate-400 mb-2">
                {field.label} {field.required && <span className="text-red-500">*</span>}
              </label>
              <input
                type="text"
                placeholder={field.placeholder}
                value={form[field.key]}
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
            <textarea
              rows={4}
              placeholder="Describe the issue in detail..."
              value={form.description}
              onChange={e => { setForm(f => ({ ...f, description: e.target.value })); setErrors(x => ({ ...x, description: '' })); }}
              className={`w-full bg-slate-50 border rounded-xl px-4 py-3 text-slate-900 placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition-all resize-none ${errors.description ? 'border-red-300 bg-red-50' : 'border-slate-200'}`}
            />
            {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            {[
              { key: 'name', label: 'Your Name', placeholder: 'Optional', type: 'text' },
              { key: 'phone', label: 'Phone Number', placeholder: 'Optional', type: 'tel' },
            ].map(field => (
              <div key={field.key}>
                <label className="block text-xs font-bold tracking-widest uppercase text-slate-400 mb-2">{field.label}</label>
                <input
                  type={field.type}
                  placeholder={field.placeholder}
                  value={form[field.key]}
                  onChange={e => setForm(f => ({ ...f, [field.key]: e.target.value }))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition-all"
                />
              </div>
            ))}
          </div>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full py-4 bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold rounded-xl shadow-lg shadow-blue-200 hover:shadow-blue-300 transition-all duration-200 active:scale-[0.99] text-base mt-2"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-3">
                <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Submitting...
              </span>
            ) : 'Submit Complaint ↗'}
          </button>
        </div>
      </div>
    </div>
  );
}