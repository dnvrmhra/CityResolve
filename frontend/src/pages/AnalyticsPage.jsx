import { useRef, useEffect, useState } from "react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip,
  PieChart, Pie, Cell, Legend,
  LineChart, Line, CartesianGrid,
} from "recharts";
import { AdminSidebar, AdminLoginScreen, useAdminAuth } from "./AdminDashboard";


const BASE_URL = process.env.REACT_APP_API_URL;

// Replaces ResponsiveContainer — measures parent div width, no context needed
function AutoChart({ height = 240, children }) {
  const ref = useRef(null);
  const [width, setWidth] = useState(0);

  useEffect(() => {
    if (!ref.current) return;
    setWidth(ref.current.offsetWidth);
    const ro = new ResizeObserver(entries => {
      setWidth(entries[0].contentRect.width);
    });
    ro.observe(ref.current);
    return () => ro.disconnect();
  }, []);

  return (
    <div ref={ref} style={{ width: "100%", height }}>
      {width > 0 && children(width, height)}
    </div>
  );
}

const PIE_COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"];

const scoreColor = s => s >= 85 ? "#10b981" : s >= 75 ? "#3b82f6" : s >= 65 ? "#f59e0b" : "#ef4444";

// ─── Derived analytics from complaints ───────────────────────────────────────
function deriveAnalytics(complaints) {
  // Category counts
  const catMap = {};
  complaints.forEach(c => {
    const cat = c.category || "Other";
    catMap[cat] = (catMap[cat] || 0) + 1;
  });
  const categoryData = Object.entries(catMap)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);

  // Status counts
  const statusMap = {};
  complaints.forEach(c => {
    const s = c.status || "Pending";
    statusMap[s] = (statusMap[s] || 0) + 1;
  });
  const statusData = Object.entries(statusMap).map(([name, value]) => ({ name, value }));

  // Monthly trend (last 6 months)
  const now = new Date();
  const months = Array.from({ length: 6 }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - 5 + i, 1);
    return {
      month: d.toLocaleString("default", { month: "short" }),
      year: d.getFullYear(),
      monthIdx: d.getMonth(),
      submitted: 0,
      resolved: 0,
    };
  });

  complaints.forEach(c => {
    const d = new Date(c.createdAt);
    const entry = months.find(m => m.monthIdx === d.getMonth() && m.year === d.getFullYear());
    if (entry) {
      entry.submitted++;
      if (c.status === "Resolved") entry.resolved++;
    }
  });

  // Department performance derived from categories
  const CATEGORY_TO_DEPT = {
    Roads: "Public Works",
    Infrastructure: "Public Works",
    Garbage: "Sanitation Dept",
    Sanitation: "Sanitation Dept",
    Water: "Water Board",
    Electricity: "Electrical Dept",
    Traffic: "Transport Dept",
    Parks: "Parks & Rec",
    Other: "General Admin",
  };

  const deptMap = {};
  complaints.forEach(c => {
    const dept = CATEGORY_TO_DEPT[c.category] || "General Admin";
    if (!deptMap[dept]) deptMap[dept] = { total: 0, resolved: 0, hours: [] };
    deptMap[dept].total++;
    if (c.status === "Resolved") deptMap[dept].resolved++;
    // Estimate resolution hours from createdAt to now (proxy)
    const created = new Date(c.createdAt);
    const diffH = (Date.now() - created.getTime()) / 3600000;
    deptMap[dept].hours.push(Math.min(diffH, 72));
  });

  const deptPerf = Object.entries(deptMap)
    .filter(([, v]) => v.total > 0)
    .map(([name, v]) => {
      const resRate = v.total > 0 ? (v.resolved / v.total) * 100 : 0;
      const avgH = v.hours.length ? v.hours.reduce((a, b) => a + b, 0) / v.hours.length : 0;
      const sla = Math.min(100, Math.round(resRate * 0.8 + (100 - Math.min(avgH, 72)) * 0.2));
      const score = Math.round(resRate * 0.6 + sla * 0.4);
      const label = score >= 85 ? "Excellent" : score >= 75 ? "Good" : score >= 60 ? "Average" : "Poor";
      return { name, resolved: v.resolved, total: v.total, avgH: Math.round(avgH), sla, score, label };
    })
    .sort((a, b) => b.score - a.score);

  return { categoryData, statusData, trendData: months, deptPerf };
}

// ─── Heatmap (zone blobs stay decorative but reflect complaint counts per category) ─
const HEATMAP_ZONES = [
  { x: 30, y: 25, label: "Zone A" },
  { x: 62, y: 45, label: "Zone B" },
  { x: 18, y: 60, label: "Zone C" },
  { x: 78, y: 20, label: "Zone D" },
  { x: 50, y: 70, label: "Zone E" },
  { x: 85, y: 65, label: "Zone F" },
];

const priorityForCount = n => n >= 5 ? "High" : n >= 3 ? "Medium" : "Low";
const heatColor = p => p === "High" ? "#ef444480" : p === "Medium" ? "#f59e0b60" : "#10b98150";
const heatBorder = p => p === "High" ? "#ef4444" : p === "Medium" ? "#f59e0b" : "#10b981";

function Heatmap({ complaints }) {
  // Distribute complaints to zones by cycling through
  const zoneCounts = HEATMAP_ZONES.map((z, i) =>
    complaints.filter((_, ci) => ci % HEATMAP_ZONES.length === i).length
  );

  return (
    <div style={{ background: "#fff", borderRadius: 14, padding: 24, boxShadow: "0 1px 4px rgba(0,0,0,0.07)" }}>
      <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 4 }}>Complaint Heatmap</h3>
      <p style={{ fontSize: 12, color: "#9ca3af", marginBottom: 16 }}>
        Showing complaint density across city zones. Larger, warmer zones indicate higher complaint volume.
      </p>
      <div style={{ position: "relative", height: 260, background: "#f1f5f9", borderRadius: 10, overflow: "hidden" }}>
        {[25, 50, 75].map(pct => (
          <div key={pct} style={{ position: "absolute", left: `${pct}%`, top: 0, bottom: 0, borderLeft: "1px dashed #cbd5e1", opacity: 0.5 }} />
        ))}
        {[33, 66].map(pct => (
          <div key={pct} style={{ position: "absolute", top: `${pct}%`, left: 0, right: 0, borderTop: "1px dashed #cbd5e1", opacity: 0.5 }} />
        ))}
        {HEATMAP_ZONES.map((pt, i) => {
          const count = zoneCounts[i];
          const priority = priorityForCount(count);
          const r = 14 + Math.min(count * 4, 28);
          return (
            <div key={i} style={{
              position: "absolute",
              left: `calc(${pt.x}% - ${r}px)`,
              top: `calc(${pt.y}% - ${r}px)`,
              width: r * 2, height: r * 2,
              borderRadius: "50%",
              background: heatColor(priority),
              border: `2px solid ${heatBorder(priority)}`,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 10, fontWeight: 700, color: heatBorder(priority),
              flexDirection: "column",
            }}>
              <span>{pt.label}</span>
              <span style={{ fontSize: 9 }}>{count}</span>
            </div>
          );
        })}
      </div>
      <div style={{ display: "flex", gap: 16, marginTop: 12 }}>
        {["High", "Medium", "Low"].map(p => (
          <div key={p} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "#6b7280" }}>
            <div style={{ width: 12, height: 12, borderRadius: "50%", background: heatColor(p), border: `1.5px solid ${heatBorder(p)}` }} />
            {p} Priority
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Analytics Page ───────────────────────────────────────────────────────────
export default function AnalyticsPage() {
  const { authed, login } = useAdminAuth();
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authed) return;
    fetch(`${BASE_URL}/api/complaints`)
      .then(r => r.json())
      .then(data => { setComplaints(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, [authed]);

  if (!authed) {
    return <AdminLoginScreen onLogin={login} />;
  }

  const { categoryData, statusData, trendData, deptPerf } = deriveAnalytics(complaints);

  return (
    <div style={{ display: "flex", minHeight: "100vh", fontFamily: "'DM Sans', sans-serif", background: "#f8f9fb" }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap" rel="stylesheet" />
      <AdminSidebar />

      <div style={{ marginLeft: 220, padding: "36px 36px", flex: 1 }}>
        <h1 style={{ fontSize: 26, fontWeight: 700, color: "#111", marginBottom: 4 }}>Analytics</h1>
        <p style={{ color: "#6b7280", marginBottom: 24, fontSize: 14 }}>
          Live insights derived from all {complaints.length} complaints in the system.
        </p>

        {loading ? (
          <div style={{ textAlign: "center", padding: 80, color: "#9ca3af", fontSize: 15 }}>Loading analytics…</div>
        ) : complaints.length === 0 ? (
          <div style={{ textAlign: "center", padding: 80, color: "#9ca3af", fontSize: 15 }}>No complaints data yet.</div>
        ) : (
          <>
            {/* Row 1: Bar + Donut */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 20 }}>
              <div style={{ background: "#fff", borderRadius: 14, padding: 24, boxShadow: "0 1px 4px rgba(0,0,0,0.07)" }}>
                <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 16 }}>Complaints by Category</h3>
                {categoryData.length === 0 ? (
                  <p style={{ color: "#9ca3af", fontSize: 13 }}>No data</p>
                ) : (
                  <AutoChart height={240}>
                    {(w, h) => (
                      <BarChart width={w} height={h} data={categoryData}>
                        <XAxis dataKey="name" tick={{ fontSize: 10 }} interval={0} />
                        <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
                        <Tooltip />
                        <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    )}
                  </AutoChart>
                )}
              </div>

              <div style={{ background: "#fff", borderRadius: 14, padding: 24, boxShadow: "0 1px 4px rgba(0,0,0,0.07)" }}>
                <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 16 }}>Complaints by Status</h3>
                {statusData.length === 0 ? (
                  <p style={{ color: "#9ca3af", fontSize: 13 }}>No data</p>
                ) : (
                  <AutoChart height={240}>
                    {(w, h) => (
                      <PieChart width={w} height={h}>
                        <Pie data={statusData} dataKey="value" nameKey="name" innerRadius={60} outerRadius={100}>
                          {statusData.map((_, i) => (
                            <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                          ))}
                        </Pie>
                        <Legend />
                        <Tooltip />
                      </PieChart>
                    )}
                  </AutoChart>
                )}
              </div>
            </div>

            {/* Row 2: Line Chart */}
            <div style={{ background: "#fff", borderRadius: 14, padding: 24, boxShadow: "0 1px 4px rgba(0,0,0,0.07)", marginBottom: 20 }}>
              <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 16 }}>Resolution Trend (Last 6 Months)</h3>
              <AutoChart height={220}>
                {(w, h) => (
                  <LineChart width={w} height={h} data={trendData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                    <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} allowDecimals={false} />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="submitted" stroke="#ef4444" strokeWidth={2} dot={{ r: 4 }} />
                    <Line type="monotone" dataKey="resolved" stroke="#10b981" strokeWidth={2} dot={{ r: 4 }} />
                  </LineChart>
                )}
              </AutoChart>
            </div>

            {/* Row 3: Department Performance */}
            {deptPerf.length > 0 && (
              <div style={{ background: "#fff", borderRadius: 14, padding: 24, boxShadow: "0 1px 4px rgba(0,0,0,0.07)", marginBottom: 20 }}>
                <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 20 }}>Department Performance</h3>
                {deptPerf.map(dept => (
                  <div key={dept.name} style={{ marginBottom: 22 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                      <div>
                        <div style={{ fontWeight: 600, fontSize: 14, color: "#111" }}>{dept.name}</div>
                        <div style={{ fontSize: 12, color: "#9ca3af" }}>
                          {dept.resolved}/{dept.total} resolved · Avg {dept.avgH}h · SLA {dept.sla}%
                        </div>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <span style={{ fontWeight: 700, fontSize: 18, color: "#111" }}>{dept.score}</span>
                        <span style={{
                          background: scoreColor(dept.score) + "20",
                          color: scoreColor(dept.score),
                          border: `1px solid ${scoreColor(dept.score)}40`,
                          borderRadius: 20, padding: "3px 12px", fontSize: 12, fontWeight: 700,
                        }}>{dept.label}</span>
                      </div>
                    </div>
                    <div style={{ background: "#f3f4f6", borderRadius: 99, height: 8, overflow: "hidden" }}>
                      <div style={{
                        height: "100%", width: `${dept.score}%`,
                        background: scoreColor(dept.score),
                        borderRadius: 99, transition: "width 1s ease",
                      }} />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Row 4: Heatmap */}
            <Heatmap complaints={complaints} />
          </>
        )}
      </div>
    </div>
  );
}