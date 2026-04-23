import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

// ─── Inline image gallery for the admin table expanded row ────────────────────
function ImageGalleryInline({ images }) {
  const [lightbox, setLightbox] = useState(null);
  if (!images || images.length === 0) return null;

  return (
    <>
      <div>
        <div style={{ fontSize: 11, color: "#9ca3af", marginBottom: 8 }}>PHOTOS ({images.length})</div>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          {images.map((url, i) => (
            <div key={i} style={{ position: "relative", cursor: "pointer" }} onClick={() => setLightbox(i)}>
              <img
                src={url}
                alt={`Evidence ${i + 1}`}
                style={{ width: 80, height: 80, objectFit: "cover", borderRadius: 10, border: "1px solid #e5e7eb", boxShadow: "0 1px 3px rgba(0,0,0,0.08)" }}
              />
            </div>
          ))}
        </div>
      </div>

      {lightbox !== null && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.8)", zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}
          onClick={() => setLightbox(null)}>
          <div style={{ position: "relative", maxWidth: 800, width: "100%" }} onClick={e => e.stopPropagation()}>
            <img src={images[lightbox]} alt={`Evidence ${lightbox + 1}`} style={{ width: "100%", maxHeight: "80vh", objectFit: "contain", borderRadius: 16, boxShadow: "0 25px 50px rgba(0,0,0,0.5)" }} />
            <button onClick={() => setLightbox(null)} style={{ position: "absolute", top: 12, right: 12, width: 32, height: 32, borderRadius: "50%", background: "rgba(0,0,0,0.6)", color: "#fff", border: "none", cursor: "pointer", fontSize: 18, display: "flex", alignItems: "center", justifyContent: "center" }}>×</button>
            {images.length > 1 && (
              <>
                <button onClick={e => { e.stopPropagation(); setLightbox(i => (i - 1 + images.length) % images.length); }} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", width: 36, height: 36, borderRadius: "50%", background: "rgba(0,0,0,0.6)", color: "#fff", border: "none", cursor: "pointer", fontSize: 22 }}>‹</button>
                <button onClick={e => { e.stopPropagation(); setLightbox(i => (i + 1) % images.length); }} style={{ position: "absolute", right: 52, top: "50%", transform: "translateY(-50%)", width: 36, height: 36, borderRadius: "50%", background: "rgba(0,0,0,0.6)", color: "#fff", border: "none", cursor: "pointer", fontSize: 22 }}>›</button>
                <div style={{ display: "flex", justifyContent: "center", gap: 8, marginTop: 12 }}>
                  {images.map((_, i) => <button key={i} onClick={() => setLightbox(i)} style={{ width: 8, height: 8, borderRadius: "50%", border: "none", cursor: "pointer", background: i === lightbox ? "#fff" : "rgba(255,255,255,0.4)", transform: i === lightbox ? "scale(1.3)" : "scale(1)", transition: "all 0.2s" }} />)}
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}

const BASE_URL = process.env.REACT_APP_API_URL;
const ADMIN_PASSWORD = "1234";
const SESSION_KEY = "cityresolve_admin_auth";

export const DEPARTMENTS = {
  "Roads & Potholes": "Public Works",
  "Garbage Collection": "Sanitation Dept",
  "Water Supply": "Water Board",
  "Streetlights": "Electrical Dept",
  "Sanitation & Drains": "Health Dept",
};

export const SLA_HOURS = {
  High: 24,
  Medium: 48,
  Low: 72,
};

export const STATUS_COLORS = {
  Pending: "#f59e0b",
  "In Progress": "#3b82f6",
  Assigned: "#10b981",
  Resolved: "#ef4444",
  Submitted: "#f59e0b",
};

export function getSLAInfo(complaint) {
  const slaHours = SLA_HOURS[complaint.priority] || 72;
  const created = new Date(complaint.createdAt);
  const deadline = new Date(created.getTime() + slaHours * 3600000);
  const now = new Date();
  const diffMs = deadline - now;
  const diffH = diffMs / 3600000;

  if (complaint.status === "Resolved") return { label: "Completed", violated: false };
  if (diffH < 0) return { label: "VIOLATED", violated: true };
  return { label: `${diffH.toFixed(1)}h left`, violated: diffH < 6 };
}

export function getTrust(complaint) {
  let score = 100;
  const sla = getSLAInfo(complaint);
  if (sla.violated) score -= 20;
  if (complaint.priority === "High" && complaint.status === "Pending") score -= 15;
  if (complaint.priority === "Low") score += 5;
  return Math.min(99, Math.max(50, score + Math.floor(Math.random() * 10)));
}

// ─── Auth Gate ────────────────────────────────────────────────────────────────
// Call this hook in any admin page to check/enforce auth
export function useAdminAuth() {
  const [authed, setAuthed] = useState(() => sessionStorage.getItem(SESSION_KEY) === "true");

  const login = (password) => {
    if (password === ADMIN_PASSWORD) {
      sessionStorage.setItem(SESSION_KEY, "true");
      setAuthed(true);
      return true;
    }
    return false;
  };

  const logout = () => {
    sessionStorage.removeItem(SESSION_KEY);
    setAuthed(false);
  };

  return { authed, login, logout };
}

// ─── Login Screen ─────────────────────────────────────────────────────────────
export function AdminLoginScreen({ onLogin }) {
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = () => {
    const ok = onLogin(password);
    if (!ok) setError("Incorrect password. Please try again.");
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-6"
      style={{ background: "linear-gradient(135deg,#f0f7ff 0%,#ffffff 50%,#f5f3ff 100%)" }}>
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-2xl mx-auto mb-4 shadow-lg shadow-blue-200">
            🔒
          </div>
          <h1 className="text-2xl font-black text-slate-900">Admin Access</h1>
          <p className="text-slate-400 text-sm mt-1">Enter your password to continue</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-8">
          <label className="block text-xs font-bold tracking-widest uppercase text-slate-400 mb-2">Password</label>
          <div className="relative mb-4">
            <input
              type={showPw ? "text" : "password"}
              value={password}
              onChange={e => { setPassword(e.target.value); setError(""); }}
              onKeyDown={e => e.key === "Enter" && handleLogin()}
              placeholder="Enter admin password"
              className={`w-full bg-slate-50 border rounded-xl px-4 py-3 text-slate-900 placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition-all pr-11 ${error ? "border-red-300 bg-red-50" : "border-slate-200"}`}
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

// ─── Shared Sidebar ───────────────────────────────────────────────────────────
export function AdminSidebar({ onLogout }) {
  const navigate = useNavigate();
  const location = useLocation();
  const activePage = location.pathname.includes("analytics") ? "analytics" : "dashboard";

  const handleLogout = () => {
    if (onLogout) onLogout();
    else {
      sessionStorage.removeItem(SESSION_KEY);
      navigate("/");
    }
  };

  return (
    <div style={{
      width: 220, background: "#0f1117", minHeight: "100vh",
      display: "flex", flexDirection: "column", padding: "24px 0",
      position: "fixed", top: 0, left: 0, bottom: 0,
    }}>
      <div style={{ padding: "0 20px 28px", display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{
          width: 34, height: 34, background: "#3b82f6", borderRadius: 9,
          display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16,
        }}>⚡</div>
        <span style={{ color: "#fff", fontWeight: 700, fontSize: 16 }}>CityResolve</span>
      </div>

      {[
        { id: "dashboard", icon: "⊞", label: "Dashboard", path: "/admin" },
        { id: "analytics", icon: "📊", label: "Analytics", path: "/admin/analytics" },
      ].map(item => (
        <button key={item.id} onClick={() => navigate(item.path)}
          style={{
            display: "flex", alignItems: "center", gap: 12,
            padding: "11px 20px", margin: "2px 12px", borderRadius: 9,
            background: activePage === item.id ? "#1e2433" : "transparent",
            border: "none", cursor: "pointer",
            color: activePage === item.id ? "#fff" : "#6b7280",
            fontSize: 14, fontWeight: activePage === item.id ? 600 : 400, textAlign: "left",
          }}>
          <span style={{ fontSize: 16 }}>{item.icon}</span>
          {item.label}
        </button>
      ))}

      <div style={{ marginTop: "auto", padding: "0 20px", display: "flex", flexDirection: "column", gap: 4 }}>
        <button onClick={handleLogout}
          style={{
            display: "flex", alignItems: "center", gap: 8,
            background: "none", border: "none", cursor: "pointer",
            color: "#ef4444", fontSize: 13, padding: "8px 0",
          }}>
          🔓 Sign Out
        </button>
        <button onClick={() => navigate("/")}
          style={{
            display: "flex", alignItems: "center", gap: 8,
            background: "none", border: "none", cursor: "pointer",
            color: "#6b7280", fontSize: 13, padding: "8px 0",
          }}>
          ← Back to Home
        </button>
      </div>
    </div>
  );
}

// ─── Sub-components ───────────────────────────────────────────────────────────
function StatCard({ icon, label, value, color }) {
  return (
    <div style={{
      background: "#fff", borderRadius: 12, padding: "20px 24px",
      display: "flex", alignItems: "center", gap: 16,
      boxShadow: "0 1px 4px rgba(0,0,0,0.07)", flex: 1, minWidth: 180,
    }}>
      <div style={{
        width: 44, height: 44, borderRadius: 10,
        background: color + "18",
        display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20,
      }}>{icon}</div>
      <div>
        <div style={{ fontSize: 13, color: "#6b7280", marginBottom: 2 }}>{label}</div>
        <div style={{ fontSize: 28, fontWeight: 700, color: "#111" }}>{value}</div>
      </div>
    </div>
  );
}

function PriorityBadge({ priority }) {
  const colors = { High: "#ef4444", Medium: "#f59e0b", Low: "#6b7280" };
  return (
    <span style={{
      background: colors[priority] || "#6b7280", color: "#fff",
      borderRadius: 6, padding: "2px 10px", fontSize: 11,
      fontWeight: 700, letterSpacing: 1,
    }}>{priority?.toUpperCase()}</span>
  );
}

function StatusBadge({ status }) {
  return (
    <span style={{
      background: (STATUS_COLORS[status] || "#6b7280") + "18",
      color: STATUS_COLORS[status] || "#6b7280",
      borderRadius: 20, padding: "3px 12px", fontSize: 12, fontWeight: 600,
      border: `1px solid ${STATUS_COLORS[status] || "#e5e7eb"}40`,
    }}>{status}</span>
  );
}

// ─── Dashboard Page ───────────────────────────────────────────────────────────
function DashboardPage({ complaints, loading, onStatusChange, onDelete }) {
  const [search, setSearch] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("All Priorities");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [expanded, setExpanded] = useState(null);

  const totalComplaints = complaints.length;
  const highPriority = complaints.filter(c => c.priority === "High").length;
  const slaViolations = complaints.filter(c => getSLAInfo(c).violated).length;
  const resolved = complaints.filter(c => c.status === "Resolved").length;

  const filtered = complaints.filter(c => {
    const q = search.toLowerCase();
    const matchSearch = !q || c.name?.toLowerCase().includes(q) ||
      c.title?.toLowerCase().includes(q) || c._id?.toLowerCase().includes(q);
    const matchPriority = priorityFilter === "All Priorities" || c.priority === priorityFilter;
    const matchStatus = statusFilter === "All Status" || c.status === statusFilter;
    return matchSearch && matchPriority && matchStatus;
  });

  return (
    <div>
      <h1 style={{ fontSize: 26, fontWeight: 700, color: "#111", marginBottom: 4 }}>Dashboard</h1>
      <p style={{ color: "#6b7280", marginBottom: 24, fontSize: 14 }}>
        Overview of all urban grievances and service requests.
      </p>

      {/* Stat Cards */}
      <div style={{ display: "flex", gap: 16, marginBottom: 28, flexWrap: "wrap" }}>
        <StatCard icon="📋" label="Total Complaints" value={totalComplaints} color="#3b82f6" />
        <StatCard icon="⚠️" label="High Priority" value={highPriority} color="#ef4444" />
        <StatCard icon="⏰" label="SLA Violations" value={slaViolations} color="#f59e0b" />
        <StatCard icon="✅" label="Resolved" value={resolved} color="#10b981" />
      </div>

      {/* Filters */}
      <div style={{ background: "#fff", borderRadius: 12, padding: "16px 20px", marginBottom: 20, boxShadow: "0 1px 4px rgba(0,0,0,0.07)" }}>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
          <div style={{ position: "relative" }}>
            <span style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: "#9ca3af" }}>🔍</span>
            <input
              placeholder="Search ID, name, description..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{
                border: "1px solid #e5e7eb", borderRadius: 8,
                padding: "7px 12px 7px 32px", fontSize: 13, outline: "none", width: 220,
              }}
            />
          </div>
          <select value={priorityFilter} onChange={e => setPriorityFilter(e.target.value)}
            style={{ border: "1px solid #e5e7eb", borderRadius: 8, padding: "7px 12px", fontSize: 13 }}>
            <option>All Priorities</option>
            <option>High</option>
            <option>Medium</option>
            <option>Low</option>
          </select>
          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
            style={{ border: "1px solid #e5e7eb", borderRadius: 8, padding: "7px 12px", fontSize: 13 }}>
            <option>All Status</option>
            <option>Pending</option>
            <option>Submitted</option>
            <option>Assigned</option>
            <option>In Progress</option>
            <option>Resolved</option>
          </select>
        </div>
      </div>

      <div style={{ background: "#fff", borderRadius: 12, boxShadow: "0 1px 4px rgba(0,0,0,0.07)", overflow: "hidden" }}>
        {loading ? (
          <div style={{ textAlign: "center", padding: 40, color: "#9ca3af" }}>Loading complaints...</div>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
            <thead>
              <tr style={{ borderBottom: "1px solid #f3f4f6" }}>
                {["ID", "Citizen", "Category", "Priority", "Status", "Department", "SLA", "Trust", ""].map(h => (
                  <th key={h} style={{ textAlign: "left", padding: "8px 10px", color: "#6b7280", fontWeight: 600, fontSize: 12 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((c, i) => {
                const sla = getSLAInfo(c);
                const trust = getTrust(c);
                const grv = `GRV-${1001 + i}`;
                const dept = DEPARTMENTS[c.category] || "General";
                const isOpen = expanded === c._id;

                return (
                  <>
                    <tr key={c._id} style={{ borderBottom: "1px solid #f9fafb", cursor: "pointer" }}
                      onClick={() => setExpanded(isOpen ? null : c._id)}>
                      <td style={{ padding: "13px 10px", color: "#6b7280", fontFamily: "monospace" }}>{grv}</td>
                      <td style={{ padding: "13px 10px" }}>
                        <div style={{ fontWeight: 600, color: "#111" }}>{c.name}</div>
                        <div style={{ color: "#9ca3af", fontSize: 12, maxWidth: 180, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{c.title}</div>
                      </td>
                      <td style={{ padding: "13px 10px", color: "#374151" }}>{c.category}</td>
                      <td style={{ padding: "13px 10px" }}><PriorityBadge priority={c.priority} /></td>
                      <td style={{ padding: "13px 10px" }}><StatusBadge status={c.status} /></td>
                      <td style={{ padding: "13px 10px", fontWeight: 600, color: "#374151" }}>{dept}</td>
                      <td style={{ padding: "13px 10px" }}>
                        {sla.violated
                          ? <span style={{ color: "#ef4444", fontWeight: 700, fontSize: 12 }}>⚠ VIOLATED</span>
                          : <span style={{ color: "#6b7280", fontSize: 12 }}>🕐 {sla.label}</span>
                        }
                      </td>
                      <td style={{ padding: "13px 10px" }}>
                        <span style={{ color: trust > 85 ? "#10b981" : trust > 70 ? "#f59e0b" : "#6b7280", fontWeight: 600 }}>⊙ {trust}</span>
                      </td>
                      <td style={{ padding: "13px 10px", color: "#9ca3af" }}>{isOpen ? "▲" : "▼"}</td>
                    </tr>
                    {isOpen && (
                      <tr key={c._id + "_expanded"}>
                        <td colSpan={9} style={{ background: "#f9fafb", padding: "16px 20px", borderBottom: "2px solid #e5e7eb" }}>
                          <div style={{ display: "flex", gap: 32, flexWrap: "wrap" }}>
                            <div>
                              <div style={{ fontSize: 11, color: "#9ca3af", marginBottom: 2 }}>DESCRIPTION</div>
                              <div style={{ fontSize: 13, color: "#374151", maxWidth: 400 }}>{c.description}</div>
                            </div>
                            <div>
                              <div style={{ fontSize: 11, color: "#9ca3af", marginBottom: 2 }}>LOCATION</div>
                              <div style={{ fontSize: 13, color: "#374151" }}>{c.location}</div>
                            </div>
                            <div>
                              <div style={{ fontSize: 11, color: "#9ca3af", marginBottom: 2 }}>PHONE</div>
                              <div style={{ fontSize: 13, color: "#374151" }}>{c.phone}</div>
                            </div>
                            <ImageGalleryInline images={c.images} />
                            <div>
                              <div style={{ fontSize: 11, color: "#9ca3af", marginBottom: 8 }}>UPDATE STATUS</div>
                              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                                {["Pending", "Submitted", "Assigned", "In Progress", "Resolved"].map(s => (
                                  <button key={s} onClick={(e) => { e.stopPropagation(); onStatusChange(c._id, s); }}
                                    style={{
                                      padding: "4px 12px", borderRadius: 6, fontSize: 12, cursor: "pointer",
                                      border: `1px solid ${c.status === s ? STATUS_COLORS[s] : "#e5e7eb"}`,
                                      background: c.status === s ? STATUS_COLORS[s] + "18" : "#fff",
                                      color: c.status === s ? STATUS_COLORS[s] : "#374151",
                                      fontWeight: c.status === s ? 700 : 400,
                                    }}>{s}</button>
                                ))}
                              </div>
                            </div>
                            <div style={{ marginLeft: "auto" }}>
                              <button onClick={(e) => { e.stopPropagation(); onDelete(c._id); }}
                                style={{
                                  padding: "6px 16px", background: "#fee2e2", color: "#ef4444",
                                  border: "none", borderRadius: 8, cursor: "pointer", fontSize: 13, fontWeight: 600,
                                }}>🗑 Delete</button>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

// ─── Main Export ──────────────────────────────────────────────────────────────
export default function AdminDashboard() {
  const { authed, login, logout } = useAdminAuth();
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchComplaints = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${BASE_URL}/api/complaints`);
      const data = await res.json();
      setComplaints(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (authed) fetchComplaints();
  }, [authed]);

  const handleStatusChange = async (id, status) => {
    await fetch(`${BASE_URL}/api/complaints/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    fetchComplaints();
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this complaint?")) return;
    await fetch(`${BASE_URL}/api/complaints/${id}`, { method: "DELETE" });
    fetchComplaints();
  };

  if (!authed) {
    return <AdminLoginScreen onLogin={login} />;
  }

  return (
    <div style={{ display: "flex", minHeight: "100vh", fontFamily: "'DM Sans', sans-serif", background: "#f8f9fb" }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap" rel="stylesheet" />
      <AdminSidebar onLogout={logout} />
      <div style={{ marginLeft: 220, padding: "36px 36px", flex: 1 }}>
        <DashboardPage
          complaints={complaints}
          loading={loading}
          onStatusChange={handleStatusChange}
          onDelete={handleDelete}
        />
      </div>
    </div>
  );
}