import { Link } from 'react-router-dom';

const categories = [
  { icon: '🗑️', label: 'Garbage',       desc: 'Overflowing bins, illegal dumping',   bg: 'hover:border-emerald-300 hover:bg-emerald-50', accent: 'text-emerald-700' },
  { icon: '💧', label: 'Water',          desc: 'Leaks, supply issues, drainage',      bg: 'hover:border-blue-300 hover:bg-blue-50',      accent: 'text-blue-700' },
  { icon: '🛣️', label: 'Roads',          desc: 'Potholes, damaged pavements',         bg: 'hover:border-orange-300 hover:bg-orange-50',  accent: 'text-orange-700' },
  { icon: '⚡', label: 'Electricity',    desc: 'Power outages, faulty streetlights',  bg: 'hover:border-yellow-300 hover:bg-yellow-50',  accent: 'text-yellow-700' },
  { icon: '🌳', label: 'Parks',          desc: 'Maintenance, fallen trees',           bg: 'hover:border-green-300 hover:bg-green-50',    accent: 'text-green-700' },
  { icon: '🚦', label: 'Traffic',        desc: 'Signal issues, illegal parking',      bg: 'hover:border-red-300 hover:bg-red-50',        accent: 'text-red-700' },
  { icon: '🏗️', label: 'Infrastructure', desc: 'Buildings, public structures',        bg: 'hover:border-purple-300 hover:bg-purple-50',  accent: 'text-purple-700' },
  { icon: '📋', label: 'Other',          desc: 'Any other civic issues',              bg: 'hover:border-slate-300 hover:bg-slate-100',   accent: 'text-slate-700' },
];

const steps = [
  { num: 1, title: 'Spot',          desc: 'Notice an issue in your neighbourhood or city area.',  icon: '👁️' },
  { num: 2, title: 'Snap & Report', desc: 'Fill in the complaint form with details and submit.',  icon: '📸', active: true },
  { num: 3, title: 'Resolve',       desc: 'Track progress as authorities address the issue.',     icon: '✅' },
];

const CITYSCAPE_SVG = `data:image/svg+xml,${encodeURIComponent(`<svg viewBox="0 0 680 380" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="skyG" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#c7e2f8"/>
      <stop offset="60%" stop-color="#ddeeff"/>
      <stop offset="100%" stop-color="#eef6ff"/>
    </linearGradient>
    <linearGradient id="waterG" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#bfdbfe"/>
      <stop offset="100%" stop-color="#dbeafe"/>
    </linearGradient>
  </defs>
  <rect width="680" height="380" fill="url(#skyG)"/>
  <ellipse cx="110" cy="58" rx="58" ry="16" fill="white" opacity=".55"/>
  <ellipse cx="138" cy="47" rx="36" ry="22" fill="white" opacity=".6"/>
  <ellipse cx="84" cy="55" rx="28" ry="14" fill="white" opacity=".45"/>
  <ellipse cx="520" cy="66" rx="62" ry="17" fill="white" opacity=".5"/>
  <ellipse cx="550" cy="54" rx="40" ry="24" fill="white" opacity=".58"/>
  <ellipse cx="492" cy="63" rx="30" ry="15" fill="white" opacity=".42"/>
  <ellipse cx="320" cy="42" rx="44" ry="13" fill="white" opacity=".42"/>
  <ellipse cx="344" cy="34" rx="28" ry="17" fill="white" opacity=".48"/>
  <rect x="0" y="310" width="680" height="70" fill="url(#waterG)"/>
  <rect x="0" y="308" width="680" height="4" fill="#93c5fd" opacity=".35"/>
  <rect x="0" y="340" width="680" height="2" fill="white" opacity=".2"/>
  <rect x="60" y="245" width="36" height="135" fill="#c8dcf0" rx="2"/>
  <rect x="60" y="245" width="36" height="7" fill="#aacce8"/>
  <rect x="63" y="258" width="6" height="9" fill="#e8f2fb" opacity=".85"/>
  <rect x="73" y="258" width="6" height="9" fill="#e8f2fb" opacity=".7"/>
  <rect x="83" y="258" width="6" height="9" fill="#e8f2fb" opacity=".85"/>
  <rect x="63" y="275" width="6" height="9" fill="#e8f2fb" opacity=".6"/>
  <rect x="73" y="275" width="6" height="9" fill="#e8f2fb" opacity=".85"/>
  <rect x="83" y="275" width="6" height="9" fill="#e8f2fb" opacity=".85"/>
  <rect x="63" y="292" width="6" height="9" fill="#e8f2fb" opacity=".85"/>
  <rect x="73" y="292" width="6" height="9" fill="#e8f2fb" opacity=".5"/>
  <rect x="83" y="292" width="6" height="9" fill="#e8f2fb" opacity=".85"/>
  <rect x="102" y="215" width="48" height="165" fill="#b8d4ee" rx="2"/>
  <rect x="102" y="215" width="48" height="8" fill="#99bfe6"/>
  <rect x="124" y="204" width="5" height="13" fill="#99bfe6"/>
  <rect x="106" y="230" width="8" height="11" fill="#e8f2fb" opacity=".8"/>
  <rect x="118" y="230" width="8" height="11" fill="#e8f2fb" opacity=".85"/>
  <rect x="130" y="230" width="8" height="11" fill="#e8f2fb" opacity=".65"/>
  <rect x="140" y="230" width="6" height="11" fill="#e8f2fb" opacity=".8"/>
  <rect x="106" y="249" width="8" height="11" fill="#e8f2fb" opacity=".85"/>
  <rect x="118" y="249" width="8" height="11" fill="#e8f2fb" opacity=".5"/>
  <rect x="130" y="249" width="8" height="11" fill="#e8f2fb" opacity=".85"/>
  <rect x="140" y="249" width="6" height="11" fill="#e8f2fb" opacity=".85"/>
  <rect x="106" y="268" width="8" height="11" fill="#e8f2fb" opacity=".7"/>
  <rect x="118" y="268" width="8" height="11" fill="#e8f2fb" opacity=".85"/>
  <rect x="130" y="268" width="8" height="11" fill="#e8f2fb" opacity=".85"/>
  <rect x="106" y="287" width="8" height="11" fill="#e8f2fb" opacity=".85"/>
  <rect x="118" y="287" width="8" height="11" fill="#e8f2fb" opacity=".85"/>
  <rect x="130" y="287" width="8" height="11" fill="#e8f2fb" opacity=".4"/>
  <rect x="156" y="260" width="30" height="120" fill="#ccd8ec" rx="2"/>
  <rect x="160" y="272" width="5" height="8" fill="#e8f2fb" opacity=".8"/>
  <rect x="169" y="272" width="5" height="8" fill="#e8f2fb" opacity=".8"/>
  <rect x="160" y="287" width="5" height="8" fill="#e8f2fb" opacity=".85"/>
  <rect x="169" y="287" width="5" height="8" fill="#e8f2fb" opacity=".4"/>
  <rect x="192" y="250" width="26" height="128" fill="#cad6ec" rx="2"/>
  <rect x="196" y="263" width="5" height="8" fill="#e8f2fb" opacity=".8"/>
  <rect x="205" y="263" width="5" height="8" fill="#e8f2fb" opacity=".8"/>
  <rect x="196" y="277" width="5" height="8" fill="#e8f2fb" opacity=".55"/>
  <rect x="205" y="277" width="5" height="8" fill="#e8f2fb" opacity=".8"/>
  <rect x="224" y="235" width="46" height="143" fill="#b6ccec" rx="2"/>
  <rect x="224" y="235" width="46" height="8" fill="#98bae4"/>
  <rect x="246" y="224" width="5" height="13" fill="#98bae4"/>
  <rect x="228" y="251" width="8" height="11" fill="#e8f2fb" opacity=".85"/>
  <rect x="240" y="251" width="8" height="11" fill="#e8f2fb" opacity=".5"/>
  <rect x="252" y="251" width="8" height="11" fill="#e8f2fb" opacity=".85"/>
  <rect x="228" y="270" width="8" height="11" fill="#e8f2fb" opacity=".7"/>
  <rect x="240" y="270" width="8" height="11" fill="#e8f2fb" opacity=".85"/>
  <rect x="252" y="270" width="8" height="11" fill="#e8f2fb" opacity=".85"/>
  <rect x="228" y="289" width="8" height="11" fill="#e8f2fb" opacity=".85"/>
  <rect x="240" y="289" width="8" height="11" fill="#e8f2fb" opacity=".85"/>
  <rect x="278" y="180" width="56" height="200" fill="#adc8e8" rx="2"/>
  <rect x="278" y="180" width="56" height="9" fill="#8eb5df"/>
  <rect x="304" y="168" width="6" height="14" fill="#8eb5df"/>
  <rect x="283" y="197" width="9" height="13" fill="#e8f2fb" opacity=".85"/>
  <rect x="296" y="197" width="9" height="13" fill="#e8f2fb" opacity=".65"/>
  <rect x="309" y="197" width="9" height="13" fill="#e8f2fb" opacity=".85"/>
  <rect x="322" y="197" width="7" height="13" fill="#e8f2fb" opacity=".8"/>
  <rect x="283" y="218" width="9" height="13" fill="#e8f2fb" opacity=".5"/>
  <rect x="296" y="218" width="9" height="13" fill="#e8f2fb" opacity=".85"/>
  <rect x="309" y="218" width="9" height="13" fill="#e8f2fb" opacity=".85"/>
  <rect x="283" y="239" width="9" height="13" fill="#e8f2fb" opacity=".85"/>
  <rect x="296" y="239" width="9" height="13" fill="#e8f2fb" opacity=".85"/>
  <rect x="309" y="239" width="9" height="13" fill="#e8f2fb" opacity=".4"/>
  <rect x="283" y="260" width="9" height="13" fill="#e8f2fb" opacity=".85"/>
  <rect x="309" y="260" width="9" height="13" fill="#e8f2fb" opacity=".85"/>
  <rect x="283" y="281" width="9" height="13" fill="#e8f2fb" opacity=".7"/>
  <rect x="296" y="281" width="9" height="13" fill="#e8f2fb" opacity=".85"/>
  <rect x="309" y="281" width="9" height="13" fill="#e8f2fb" opacity=".85"/>
  <rect x="340" y="200" width="40" height="178" fill="#b5cfe6" rx="2"/>
  <rect x="340" y="200" width="40" height="8" fill="#96bade"/>
  <rect x="359" y="190" width="4" height="12" fill="#96bade"/>
  <rect x="344" y="216" width="7" height="10" fill="#e8f2fb" opacity=".8"/>
  <rect x="355" y="216" width="7" height="10" fill="#e8f2fb" opacity=".85"/>
  <rect x="366" y="216" width="7" height="10" fill="#e8f2fb" opacity=".55"/>
  <rect x="344" y="233" width="7" height="10" fill="#e8f2fb" opacity=".85"/>
  <rect x="355" y="233" width="7" height="10" fill="#e8f2fb" opacity=".45"/>
  <rect x="366" y="233" width="7" height="10" fill="#e8f2fb" opacity=".85"/>
  <rect x="344" y="250" width="7" height="10" fill="#e8f2fb" opacity=".85"/>
  <rect x="355" y="250" width="7" height="10" fill="#e8f2fb" opacity=".85"/>
  <rect x="344" y="267" width="7" height="10" fill="#e8f2fb" opacity=".6"/>
  <rect x="355" y="267" width="7" height="10" fill="#e8f2fb" opacity=".85"/>
  <rect x="366" y="267" width="7" height="10" fill="#e8f2fb" opacity=".85"/>
  <rect x="344" y="284" width="7" height="10" fill="#e8f2fb" opacity=".85"/>
  <rect x="366" y="284" width="7" height="10" fill="#e8f2fb" opacity=".85"/>
  <rect x="386" y="225" width="34" height="153" fill="#c4d6ec" rx="2"/>
  <rect x="390" y="238" width="6" height="9" fill="#e8f2fb" opacity=".8"/>
  <rect x="400" y="238" width="6" height="9" fill="#e8f2fb" opacity=".85"/>
  <rect x="410" y="238" width="6" height="9" fill="#e8f2fb" opacity=".6"/>
  <rect x="390" y="254" width="6" height="9" fill="#e8f2fb" opacity=".85"/>
  <rect x="400" y="254" width="6" height="9" fill="#e8f2fb" opacity=".4"/>
  <rect x="410" y="254" width="6" height="9" fill="#e8f2fb" opacity=".85"/>
  <rect x="390" y="270" width="6" height="9" fill="#e8f2fb" opacity=".85"/>
  <rect x="400" y="270" width="6" height="9" fill="#e8f2fb" opacity=".85"/>
  <rect x="390" y="286" width="6" height="9" fill="#e8f2fb" opacity=".5"/>
  <rect x="400" y="286" width="6" height="9" fill="#e8f2fb" opacity=".85"/>
  <rect x="426" y="250" width="22" height="128" fill="#c8d8ee" rx="2"/>
  <rect x="430" y="262" width="4" height="8" fill="#e8f2fb" opacity=".8"/>
  <rect x="438" y="262" width="4" height="8" fill="#e8f2fb" opacity=".55"/>
  <rect x="430" y="276" width="4" height="8" fill="#e8f2fb" opacity=".8"/>
  <rect x="438" y="276" width="4" height="8" fill="#e8f2fb" opacity=".8"/>
  <rect x="454" y="240" width="30" height="138" fill="#bccee8" rx="2"/>
  <rect x="458" y="252" width="5" height="9" fill="#e8f2fb" opacity=".85"/>
  <rect x="467" y="252" width="5" height="9" fill="#e8f2fb" opacity=".6"/>
  <rect x="476" y="252" width="5" height="9" fill="#e8f2fb" opacity=".85"/>
  <rect x="458" y="268" width="5" height="9" fill="#e8f2fb" opacity=".5"/>
  <rect x="467" y="268" width="5" height="9" fill="#e8f2fb" opacity=".85"/>
  <rect x="476" y="268" width="5" height="9" fill="#e8f2fb" opacity=".85"/>
  <rect x="458" y="284" width="5" height="9" fill="#e8f2fb" opacity=".85"/>
  <rect x="467" y="284" width="5" height="9" fill="#e8f2fb" opacity=".8"/>
  <rect x="490" y="218" width="50" height="162" fill="#b0caec" rx="2"/>
  <rect x="490" y="218" width="50" height="9" fill="#92b8e4"/>
  <rect x="514" y="207" width="5" height="13" fill="#92b8e4"/>
  <rect x="494" y="235" width="8" height="11" fill="#e8f2fb" opacity=".85"/>
  <rect x="506" y="235" width="8" height="11" fill="#e8f2fb" opacity=".6"/>
  <rect x="518" y="235" width="8" height="11" fill="#e8f2fb" opacity=".85"/>
  <rect x="530" y="235" width="6" height="11" fill="#e8f2fb" opacity=".75"/>
  <rect x="494" y="254" width="8" height="11" fill="#e8f2fb" opacity=".5"/>
  <rect x="506" y="254" width="8" height="11" fill="#e8f2fb" opacity=".85"/>
  <rect x="518" y="254" width="8" height="11" fill="#e8f2fb" opacity=".85"/>
  <rect x="494" y="273" width="8" height="11" fill="#e8f2fb" opacity=".85"/>
  <rect x="506" y="273" width="8" height="11" fill="#e8f2fb" opacity=".85"/>
  <rect x="518" y="273" width="8" height="11" fill="#e8f2fb" opacity=".4"/>
  <rect x="494" y="292" width="8" height="11" fill="#e8f2fb" opacity=".85"/>
  <rect x="518" y="292" width="8" height="11" fill="#e8f2fb" opacity=".85"/>
  <rect x="546" y="238" width="32" height="142" fill="#bfd2ea" rx="2"/>
  <rect x="550" y="250" width="6" height="9" fill="#e8f2fb" opacity=".8"/>
  <rect x="560" y="250" width="6" height="9" fill="#e8f2fb" opacity=".85"/>
  <rect x="550" y="266" width="6" height="9" fill="#e8f2fb" opacity=".85"/>
  <rect x="560" y="266" width="6" height="9" fill="#e8f2fb" opacity=".45"/>
  <rect x="550" y="282" width="6" height="9" fill="#e8f2fb" opacity=".7"/>
  <rect x="560" y="282" width="6" height="9" fill="#e8f2fb" opacity=".85"/>
  <rect x="550" y="298" width="6" height="9" fill="#e8f2fb" opacity=".85"/>
  <rect x="584" y="255" width="26" height="125" fill="#cad8ec" rx="2"/>
  <rect x="588" y="266" width="5" height="8" fill="#e8f2fb" opacity=".8"/>
  <rect x="597" y="266" width="5" height="8" fill="#e8f2fb" opacity=".8"/>
  <rect x="588" y="280" width="5" height="8" fill="#e8f2fb" opacity=".55"/>
  <rect x="597" y="280" width="5" height="8" fill="#e8f2fb" opacity=".8"/>
  <rect x="616" y="245" width="30" height="135" fill="#b8cee8" rx="2"/>
  <rect x="620" y="257" width="5" height="9" fill="#e8f2fb" opacity=".8"/>
  <rect x="629" y="257" width="5" height="9" fill="#e8f2fb" opacity=".6"/>
  <rect x="638" y="257" width="5" height="9" fill="#e8f2fb" opacity=".8"/>
  <rect x="620" y="273" width="5" height="9" fill="#e8f2fb" opacity=".85"/>
  <rect x="629" y="273" width="5" height="9" fill="#e8f2fb" opacity=".85"/>
  <rect x="620" y="289" width="5" height="9" fill="#e8f2fb" opacity=".45"/>
  <rect x="629" y="289" width="5" height="9" fill="#e8f2fb" opacity=".85"/>
  <rect x="652" y="268" width="18" height="112" fill="#ccd8ec" rx="2"/>
  <rect x="0" y="308" width="680" height="2" fill="#93c5fd" opacity=".3"/>
  <rect x="0" y="370" width="680" height="10" fill="white" opacity=".3"/>
</svg>`)}`;

export default function Home() {
  return (
    <div
      className="min-h-screen text-slate-900"
      style={{
        backgroundImage: `url("${CITYSCAPE_SVG}")`,
        backgroundAttachment: 'fixed',
        backgroundSize: 'cover',
        backgroundPosition: 'center top',
        backgroundRepeat: 'no-repeat',
        backgroundColor: '#eef6ff',
      }}
    >
      {/* Global blur/fade overlay — fixed so it also stays during scroll */}
      <div
        style={{
          position: 'fixed',
          inset: 0,
          backdropFilter: 'blur(1.5px)',
          WebkitBackdropFilter: 'blur(1.5px)',
          background: 'linear-gradient(to bottom, rgba(238,246,255,0.18) 0%, rgba(238,246,255,0.55) 60%, rgba(238,246,255,0.88) 100%)',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      {/* All page content sits above the fixed overlay */}
      <div style={{ position: 'relative', zIndex: 1 }}>

        {/* ── HERO ── */}
        <section className="min-h-[88vh] flex flex-col items-center justify-center text-center px-6 pt-16 pb-32">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-blue-200 bg-white/70 text-blue-600 text-xs font-semibold tracking-widest uppercase mb-7 backdrop-blur-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
            Smart City Platform
          </span>

          <h1 className="text-5xl md:text-6xl font-black leading-tight tracking-tight text-slate-900 mb-5">
            Simplifying{' '}
            <span className="bg-gradient-to-r from-blue-500 to-blue-700 bg-clip-text text-transparent">
              Service Requests,
            </span>
            <br />
            Resolving{' '}
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Citizen Issues
            </span>
          </h1>

          <p className="text-slate-600 text-lg max-w-xl mb-9 leading-relaxed">
            Report local civic problems — garbage, water, roads, electricity and more — and track resolution in real time.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 mb-16">
            <Link
              to="/complaint"
              className="px-8 py-4 bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white font-bold rounded-xl shadow-lg shadow-blue-200 hover:shadow-blue-300 transition-all duration-200 active:scale-95 text-base"
            >
              Raise a Complaint ↗
            </Link>
            <Link
              to="/dashboard"
              className="px-8 py-4 border border-blue-200 hover:border-blue-400 bg-white/70 hover:bg-white/90 text-slate-700 hover:text-blue-700 font-semibold rounded-xl backdrop-blur-sm transition-all duration-200 text-base"
            >
              View Dashboard
            </Link>
          </div>

          {/* Stats bar */}
          <div
            className="flex rounded-2xl overflow-hidden backdrop-blur-md"
            style={{
              background: 'rgba(255,255,255,0.82)',
              border: '1px solid rgba(203,213,225,0.6)',
              boxShadow: '0 2px 20px rgba(30,64,175,.07)',
            }}
          >
            {[
              { value: '12,400+', label: 'Issues Resolved' },
              { value: '98%',     label: 'Resolution Rate' },
              { value: '< 48hrs', label: 'Avg Response' },
            ].map((s, i) => (
              <div
                key={s.label}
                className="px-8 py-3 text-center"
                style={{ borderRight: i < 2 ? '1px solid rgba(203,213,225,0.5)' : 'none' }}
              >
                <div className="text-blue-600 font-black text-xl">{s.value}</div>
                <div className="text-slate-400 text-xs uppercase tracking-widest font-medium mt-0.5">{s.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* ── CATEGORIES ── */}
        <section
          className="py-20 px-6"
          style={{ background: 'rgba(248,250,252,0.88)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)' }}
        >
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <p className="text-blue-500 text-xs font-bold tracking-widest uppercase mb-3">Report By Category</p>
              <h2 className="text-3xl md:text-4xl font-black text-slate-900">What issue are you facing?</h2>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {categories.map(cat => (
                <Link
                  key={cat.label}
                  to={`/complaint?category=${cat.label}`}
                  className={`group p-5 rounded-2xl border border-slate-200 bg-white/80 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg ${cat.bg}`}
                >
                  <div className="text-3xl mb-3">{cat.icon}</div>
                  <div className={`font-bold text-base ${cat.accent}`}>{cat.label}</div>
                  <div className="text-slate-400 text-xs mt-1 leading-snug">{cat.desc}</div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ── 3-STEP PROCESS ── */}
        <section
          className="py-20 px-6"
          style={{ background: 'rgba(255,255,255,0.90)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', borderTop: '1px solid rgba(226,232,240,0.8)', borderBottom: '1px solid rgba(226,232,240,0.8)' }}
        >
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-14">
              <p className="text-blue-500 text-xs font-bold tracking-widest uppercase mb-3">How It Works</p>
              <h2 className="text-3xl md:text-4xl font-black text-slate-900">
                3-Step Citizen Complaints<br />Resolution System
              </h2>
            </div>
            <div className="grid md:grid-cols-3 gap-8 relative">
              <div className="hidden md:block absolute top-11 left-1/3 right-1/3 h-px bg-gradient-to-r from-blue-200 via-blue-400 to-blue-200" />
              {steps.map((step) => (
                <div key={step.num} className="flex flex-col items-center text-center group">
                  <div
                    className={`relative w-24 h-24 rounded-2xl flex items-center justify-center text-4xl mb-5 border-2 transition-all duration-300 shadow-sm
                      ${step.active
                        ? 'bg-blue-500 border-blue-500 shadow-blue-200 shadow-lg scale-110'
                        : 'bg-white border-slate-200 group-hover:border-blue-300 group-hover:shadow-md'}`}
                  >
                    {step.icon}
                    <span
                      className={`absolute -top-2.5 -right-2.5 w-7 h-7 rounded-full flex items-center justify-center text-xs font-black border-2 border-white shadow-sm
                        ${step.active ? 'bg-white text-blue-600' : 'bg-blue-500 text-white'}`}
                    >
                      {step.num}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">{step.title}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed">{step.desc}</p>
                </div>
              ))}
            </div>
            <div className="flex justify-center mt-12">
              <Link
                to="/complaint"
                className="px-8 py-3.5 bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white font-bold rounded-xl shadow-lg shadow-blue-200 transition-all duration-200 active:scale-95"
              >
                Get Started ↗
              </Link>
            </div>
          </div>
        </section>

        {/* ── FOOTER ── */}
        <footer
          className="px-6 py-8"
          style={{ background: 'rgba(248,250,252,0.88)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)' }}
        >
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-400 text-sm">
            <span>© 2026 CityResolve. All rights reserved.</span>
            <span className="flex items-center gap-2 text-emerald-600 font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              All systems operational
            </span>
          </div>
        </footer>

      </div>
    </div>
  );
}