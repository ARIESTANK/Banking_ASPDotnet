import { useState, useCallback } from "react";
import {useNavigate} from "react-router-dom";
// ── SVG Icons ─────────────────────────────────────────────────────────────────
const ShieldIcon = ({ size = 22, color = "#0a192f" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    <line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
  </svg>
);
const BellIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#c9a84c" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" />
  </svg>
);
const LogOutIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#c9a84c" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" />
  </svg>
);
const HomeIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" />
  </svg>
);
const XIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);
const UserPlusIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#c9a84c" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="8.5" cy="7" r="4" />
    <line x1="20" y1="8" x2="20" y2="14" /><line x1="23" y1="11" x2="17" y2="11" />
  </svg>
);
const TrendingUpIcon = ({ color = "#4ade80", size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" /><polyline points="17 6 23 6 23 12" />
  </svg>
);
const UsersIcon = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);
const LockIcon = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#f87171" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
);
const MenuIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#e2e8f0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" />
  </svg>
);
const CloseMenuIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#e2e8f0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

// ── Seed Data ─────────────────────────────────────────────────────────────────
const SEED_USERS = [
  { user_id: "user-1", full_name: "Alice Johnson",  email: "alice@example.com", phone: "+1 555-001", account_type: "Premium",  account_balance: 12500.00, status: "Active",   created_at: "2024-01-15T09:00:00Z" },
  { user_id: "user-2", full_name: "Bob Martinez",   email: "bob@example.com",   phone: "+1 555-002", account_type: "Basic",    account_balance: 3200.50,  status: "Active",   created_at: "2024-02-20T10:00:00Z" },
  { user_id: "user-3", full_name: "Carol White",    email: "carol@example.com", phone: "+1 555-003", account_type: "Business", account_balance: 87600.00, status: "Inactive", created_at: "2024-03-05T08:00:00Z" },
  { user_id: "user-4", full_name: "David Kim",      email: "david@example.com", phone: "+1 555-004", account_type: "Premium",  account_balance: 5400.75,  status: "Pending",  created_at: "2024-04-10T14:00:00Z" },
];
const SEED_TRANSACTIONS = [
  { transaction_id: "t1", user_id_ref: "user-1", transaction_type: "Deposit",  amount: 5000, description: "Salary",     timestamp: "2024-06-01T09:00:00Z", status_trans: "Completed" },
  { transaction_id: "t2", user_id_ref: "user-2", transaction_type: "Withdraw", amount: 800,  description: "Rent",       timestamp: "2024-06-02T11:00:00Z", status_trans: "Completed" },
  { transaction_id: "t3", user_id_ref: "user-1", transaction_type: "Deposit",  amount: 1200, description: "Freelance",  timestamp: "2024-06-03T14:00:00Z", status_trans: "Completed" },
  { transaction_id: "t4", user_id_ref: "user-3", transaction_type: "Withdraw", amount: 3000, description: "Equipment",  timestamp: "2024-06-04T16:00:00Z", status_trans: "Pending"   },
];

// ── Helpers ───────────────────────────────────────────────────────────────────
const fmt     = (n) => `$${Number(n).toFixed(2)}`;
const fmtDate = (s) => new Date(s).toLocaleDateString();

// ── Shared UI ─────────────────────────────────────────────────────────────────
const BADGE_MAP = {
  active:    { bg: "rgba(74,222,128,0.2)",  color: "#4ade80" },
  inactive:  { bg: "rgba(148,163,184,0.2)", color: "#94a3b8" },
  pending:   { bg: "rgba(201,168,76,0.2)",  color: "#c9a84c" },
  completed: { bg: "rgba(74,222,128,0.2)",  color: "#4ade80" },
  deposit:   { bg: "rgba(59,130,246,0.2)",  color: "#3b82f6" },
  withdraw:  { bg: "rgba(248,113,113,0.2)", color: "#f87171" },
};
function Badge({ label }) {
  const s = BADGE_MAP[label?.toLowerCase()] || BADGE_MAP.inactive;
  return <span style={{ display:"inline-block", padding:"5px 12px", borderRadius:20, fontSize:12, fontWeight:600, background:s.bg, color:s.color }}>{label}</span>;
}
function GoldLine({ style }) {
  return <div className="gold-shimmer" style={style} />;
}
function StatCard({ label, value, valueColor = "#c9a84c" }) {
  return (
    <div style={{ padding:24, borderRadius:12, background:"linear-gradient(135deg,rgba(15,35,63,0.9) 0%,rgba(201,168,76,0.08) 100%)", border:"1px solid rgba(201,168,76,0.2)", textAlign:"center" }}>
      <div style={{ color:"#94a3b8", fontSize:13, marginBottom:8 }}>{label}</div>
      <div style={{ fontSize:28, fontWeight:700, color:valueColor }}>{value}</div>
    </div>
  );
}
function Toast({ msg, type }) {
  if (!msg) return null;
  const c = { success:{ bg:"#4ade80", color:"#0a192f" }, error:{ bg:"#f87171", color:"#fff" }, info:{ bg:"#3b82f6", color:"#fff" } }[type] || { bg:"#3b82f6", color:"#fff" };
  return <div style={{ position:"fixed", bottom:24, right:24, zIndex:200, background:c.bg, color:c.color, padding:"16px 24px", borderRadius:8, fontWeight:500, fontSize:14, animation:"slideUp 0.4s ease-out" }}>{msg}</div>;
}
function Modal({ show, onClose, title, children }) {
  if (!show) return null;
  return (
    <div onClick={e => e.target===e.currentTarget && onClose()} style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.7)", zIndex:100, display:"flex", alignItems:"center", justifyContent:"center" }}>
      <div style={{ background:"#0f233f", borderRadius:16, padding:32, maxWidth:600, width:"90%", maxHeight:"90vh", overflowY:"auto", border:"1px solid rgba(201,168,76,0.2)", animation:"slideUp 0.4s ease-out" }}>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:24 }}>
          <h2 style={{ fontSize:20, fontWeight:600, color:"#e2e8f0" }}>{title}</h2>
          <button onClick={onClose} style={{ background:"none", border:"none", cursor:"pointer", padding:0 }}><XIcon /></button>
        </div>
        {children}
      </div>
    </div>
  );
}
function Field({ label, children }) {
  return (
    <div style={{ marginBottom:20 }}>
      <label style={{ display:"block", fontWeight:500, marginBottom:8, color:"#e2e8f0", fontSize:14 }}>{label}</label>
      {children}
    </div>
  );
}

// ── Landing Page ──────────────────────────────────────────────────────────────
function LandingPage({ onEnterDashboard }) {
  return (
    <div style={{ minHeight:"100vh", backgroundColor:"#0a192f", backgroundImage:"radial-gradient(circle at 20% 50%,rgba(201,168,76,0.06) 0%,transparent 50%),radial-gradient(circle at 80% 20%,rgba(201,168,76,0.04) 0%,transparent 40%)" }}>

      {/* Nav */}
      <header className="anim-slide-down" style={{ position:"sticky", top:0, zIndex:50, background:"rgba(10,25,47,0.95)", backdropFilter:"blur(10px)" }}>
        <nav style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"16px 48px" }} className="landing-nav">
          <div style={{ display:"flex", alignItems:"center", gap:12 }}>
            <div style={{ background:"#c9a84c", width:40, height:40, borderRadius:8, display:"flex", alignItems:"center", justifyContent:"center" }}>
              <ShieldIcon />
            </div>
            <div>
              <div className="font-display" style={{ fontSize:18, fontWeight:700, color:"#e2e8f0" }}>Apex Bank</div>
              <div style={{ fontSize:11, color:"#94a3b8" }}>Banking Solutions</div>
            </div>
          </div>
          <button onClick={onEnterDashboard} className="btn-gold">Dashboard</button>
        </nav>
        <GoldLine />
      </header>

      {/* Hero */}
      <section className="anim-slide-up" style={{ padding:"80px 48px", textAlign:"center" }} className="hero-section">
        <div style={{ maxWidth:800, margin:"0 auto" }}>
          <h1 className="font-display" style={{ fontSize:"clamp(2rem,5vw,3.5rem)", lineHeight:1.2, color:"#e2e8f0", marginBottom:24 }}>
            Complete Banking <span style={{ color:"#c9a84c" }}>Administration</span> Control
          </h1>
          <p style={{ fontSize:"clamp(1rem,2vw,1.2rem)", color:"#94a3b8", marginBottom:32, lineHeight:1.7 }}>
            Manage users, track transactions, and control accounts — all in one powerful admin dashboard.
          </p>
          <button onClick={onEnterDashboard} className="btn-gold" style={{ fontSize:16, padding:"14px 32px" }}>
            Get Started →
          </button>
        </div>

        {/* Feature preview cards */}
        <div style={{ maxWidth:900, margin:"56px auto 0", padding:32, background:"linear-gradient(135deg,rgba(201,168,76,0.1) 0%,rgba(59,130,246,0.05) 100%)", border:"1px solid rgba(201,168,76,0.2)", borderRadius:16 }}>
          <div className="hero-cards-grid">
            {[
              { icon:<UsersIcon />,       label:"User Management",    sub:"Create & manage customer accounts" },
              { icon:<TrendingUpIcon />,  label:"Transaction Control", sub:"Track deposits & withdrawals"       },
              { icon:<LockIcon />,        label:"Account Security",    sub:"Freeze & manage accounts"           },
            ].map(({ icon, label, sub }) => (
              <div key={label} style={{ padding:"24px 16px", borderRadius:10, textAlign:"center", background:"rgba(15,35,63,0.8)", border:"1px solid rgba(201,168,76,0.2)" }}>
                <div style={{ display:"flex", justifyContent:"center", marginBottom:12 }}>{icon}</div>
                <p style={{ color:"#e2e8f0", fontWeight:600, fontSize:14, marginBottom:4 }}>{label}</p>
                <p style={{ color:"#94a3b8", fontSize:12 }}>{sub}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section style={{ padding:"80px 48px" }} className="features-section">
        <div style={{ maxWidth:1100, margin:"0 auto" }}>
          <h2 className="font-display" style={{ fontSize:"clamp(1.8rem,4vw,2.5rem)", textAlign:"center", color:"#e2e8f0", marginBottom:56 }}>
            Powerful Features for Complete Control
          </h2>
          <div className="features-grid">
            {[
              { icon:<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/><line x1="20" y1="8" x2="20" y2="14"/><line x1="23" y1="11" x2="17" y2="11"/></svg>,
                bg:"rgba(59,130,246,0.2)", border:"rgba(59,130,246,0.2)", accent:"rgba(59,130,246,0.08)",
                title:"User Management", desc:"Create, manage, and monitor customer accounts with complete visibility over user information and account status." },
              { icon:<TrendingUpIcon size={24} />,
                bg:"rgba(74,222,128,0.2)", border:"rgba(74,222,128,0.2)", accent:"rgba(74,222,128,0.08)",
                title:"Transaction Tracking", desc:"Record and track all deposits and withdrawals with real-time balance updates and comprehensive transaction history." },
              { icon:<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#f87171" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><polyline points="9 12 11 14 15 10"/></svg>,
                bg:"rgba(248,113,113,0.2)", border:"rgba(248,113,113,0.2)", accent:"rgba(248,113,113,0.08)",
                title:"Account Control", desc:"Connect accounts, update status, freeze suspicious accounts, and maintain full control over your banking operations." },
            ].map(({ icon, bg, border, accent, title, desc }) => (
              <div key={title} className="feature-card" style={{ padding:32, borderRadius:12, background:`linear-gradient(135deg,rgba(15,35,63,0.9) 0%,${accent} 100%)`, border:`1px solid ${border}` }}>
                <div style={{ width:48, height:48, borderRadius:10, background:bg, display:"flex", alignItems:"center", justifyContent:"center", marginBottom:20 }}>{icon}</div>
                <h3 style={{ fontSize:18, fontWeight:600, color:"#e2e8f0", marginBottom:12 }}>{title}</h3>
                <p style={{ color:"#94a3b8", lineHeight:1.7, fontSize:14 }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section style={{ padding:"40px 48px" }} className="stats-section">
        <div style={{ maxWidth:1100, margin:"0 auto" }}>
          <div className="landing-stats-grid">
            {[
              { val:"100%", color:"#c9a84c", label:"Uptime"        },
              { val:"24/7",  color:"#3b82f6", label:"Support"       },
              { val:"500+",  color:"#4ade80", label:"Banks Using"   },
              { val:"$100M+",color:"#f87171", label:"Managed Daily" },
            ].map(({ val, color, label }) => (
              <div key={label} style={{ padding:24, borderRadius:12, background:"linear-gradient(135deg,rgba(15,35,63,0.9) 0%,rgba(201,168,76,0.08) 100%)", border:"1px solid rgba(201,168,76,0.2)", textAlign:"center" }}>
                <div style={{ fontSize:28, fontWeight:700, color }}>{val}</div>
                <div style={{ color:"#94a3b8", fontSize:14, marginTop:8 }}>{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding:"80px 48px" }} className="cta-section">
        <div style={{ maxWidth:700, margin:"0 auto", padding:56, borderRadius:16, textAlign:"center", background:"linear-gradient(135deg,rgba(201,168,76,0.15) 0%,rgba(59,130,246,0.1) 100%)", border:"2px solid rgba(201,168,76,0.3)" }}>
          <h2 className="font-display" style={{ fontSize:"clamp(1.6rem,3vw,2rem)", color:"#e2e8f0", marginBottom:16 }}>Ready to Take Control?</h2>
          <p style={{ color:"#94a3b8", fontSize:16, marginBottom:32, lineHeight:1.7 }}>Start managing your banking operations with confidence. Access the admin dashboard now.</p>
          <button onClick={onEnterDashboard} className="btn-gold" style={{ fontSize:16, padding:"14px 36px" }}>Enter Dashboard</button>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ borderTop:"1px solid rgba(201,168,76,0.2)", padding:"32px 48px", textAlign:"center" }}>
        <p style={{ color:"#94a3b8", fontSize:13 }}>© 2024 Apex Bank Admin. All rights reserved. | Secure Banking Solutions</p>
      </footer>
    </div>
  );
}

// ── Dashboard Tabs ────────────────────────────────────────────────────────────





// ── Dashboard Shell ───────────────────────────────────────────────────────────

// ── App Root ──────────────────────────────────────────────────────────────────
export default function Landing() {
  const [page, setPage] = useState("landing"); // "landing" | "dashboard"
const navigate = useNavigate();
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'Plus Jakarta Sans', sans-serif; background: #0a192f; }
        .font-display { font-family: 'DM Serif Display', serif; }

        .gold-shimmer { height:1px; background:linear-gradient(90deg,transparent,#c9a84c,#e8d48b,#c9a84c,transparent); background-size:200% 100%; animation:shimmer 3s ease-in-out infinite; }
        @keyframes shimmer   { 0%   { background-position:-200% 0; } 100% { background-position:200% 0; } }
        @keyframes fadeIn    { from { opacity:0; } to { opacity:1; } }
        @keyframes slideUp   { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }
        @keyframes slideDown { from { opacity:0; transform:translateY(-10px); } to { opacity:1; transform:translateY(0); } }

        .anim-slide-up   { animation:slideUp   0.6s ease-out both; }
        .anim-slide-down { animation:slideDown  0.5s ease-out; }
        .anim-fade-in    { animation:fadeIn     0.6s ease-out; }

        .btn-gold { background:#c9a84c; color:#0a192f; border:none; padding:10px 20px; border-radius:8px; font-weight:600; font-size:14px; cursor:pointer; font-family:inherit; transition:transform 0.2s,box-shadow 0.2s; }
        .btn-gold:hover { transform:translateY(-2px); box-shadow:0 8px 25px rgba(201,168,76,0.35); }

        .action-card { transition:transform 0.2s ease; }
        .action-card:hover { transform:translateY(-4px); }
        .feature-card { transition:transform 0.3s ease; }
        .feature-card:hover { transform:translateY(-4px); }
        .account-action-card { transition:transform 0.3s ease; }
        .account-action-card:hover { transform:translateY(-4px); }

        .tab-btn { padding:10px 18px; border-radius:8px; font-weight:500; font-size:14px; border:none; cursor:pointer; font-family:inherit; white-space:nowrap; transition:all 0.2s; }
        .tab-btn.active   { background:#c9a84c; color:#0a192f; }
        .tab-btn.inactive { background:transparent; color:#94a3b8; }
        .tab-btn.inactive:hover { color:#e2e8f0; }

        .table-wrapper { overflow-x:auto; border-radius:12px; border:1px solid rgba(201,168,76,0.2); }
        .admin-table { width:100%; border-collapse:collapse; min-width:560px; }
        .admin-table th { background:rgba(15,35,63,0.8); padding:14px 16px; text-align:left; font-weight:600; color:#e2e8f0; font-size:13px; border-bottom:1px solid rgba(201,168,76,0.2); white-space:nowrap; }
        .admin-table td { padding:13px 16px; border-bottom:1px solid rgba(201,168,76,0.08); color:#e2e8f0; font-size:13px; }
        .admin-table tr:last-child td { border-bottom:none; }
        .admin-table tr:hover td { background:rgba(15,35,63,0.4); }

        .form-input, .form-select { width:100%; padding:12px 16px; border:1px solid rgba(201,168,76,0.3); border-radius:8px; background:rgba(15,35,63,0.5); color:#e2e8f0; font-size:14px; font-family:inherit; outline:none; transition:border-color 0.2s,box-shadow 0.2s; }
        .form-input:focus, .form-select:focus { border-color:#c9a84c; box-shadow:0 0 0 3px rgba(201,168,76,0.1); }
        .form-select option { background:#0f233f; }
        .form-input::placeholder { color:#475569; }

        .search-input { flex:1; padding:10px 16px; border:1px solid rgba(201,168,76,0.3); border-radius:8px; background:rgba(15,35,63,0.5); color:#e2e8f0; font-size:14px; font-family:inherit; outline:none; }
        .search-input:focus { border-color:#c9a84c; }
        .search-input::placeholder { color:#475569; }

        /* ── Responsive grids ── */
        .stats-grid          { display:grid; grid-template-columns:repeat(4,1fr); gap:16px; }
        .quick-grid          { display:grid; grid-template-columns:repeat(2,1fr); gap:16px; }
        .accounts-grid       { display:grid; grid-template-columns:repeat(3,1fr); gap:20px; }
        .features-grid       { display:grid; grid-template-columns:repeat(3,1fr); gap:28px; }
        .hero-cards-grid     { display:grid; grid-template-columns:repeat(3,1fr); gap:16px; }
        .landing-stats-grid  { display:grid; grid-template-columns:repeat(4,1fr); gap:16px; }
        .main-content { padding:32px 48px; }
        .landing-nav, .dash-nav { padding-left:48px; padding-right:48px; }
        .desktop-nav { display:flex; }
        .hamburger { display:none !important; }

        @media (max-width:1024px) {
          .stats-grid { grid-template-columns:repeat(2,1fr); }
          .features-grid { grid-template-columns:repeat(2,1fr); }
          .accounts-grid { grid-template-columns:repeat(2,1fr); }
          .landing-stats-grid { grid-template-columns:repeat(2,1fr); }
        }
        @media (max-width:768px) {
          .landing-nav, .dash-nav { padding-left:20px; padding-right:20px; }
          .desktop-nav { display:none !important; }
          .hamburger { display:flex !important; }
          .main-content { padding:24px 20px; }
          .hero-section, .features-section, .stats-section, .cta-section { padding-left:20px !important; padding-right:20px !important; }
          .hero-section { padding-top:48px !important; }
          .stats-grid { grid-template-columns:repeat(2,1fr); }
          .quick-grid { grid-template-columns:1fr; }
          .accounts-grid { grid-template-columns:1fr; }
          .features-grid { grid-template-columns:1fr; }
          .hero-cards-grid { grid-template-columns:1fr; gap:10px; }
          .landing-stats-grid { grid-template-columns:repeat(2,1fr); }
          .tab-btn { font-size:12px; padding:8px 12px; }
        }
        @media (max-width:480px) {
          .main-content { padding:16px; }
          .stats-grid { gap:10px; }
          .landing-nav, .dash-nav { padding-left:16px; padding-right:16px; }
        }
      `}</style>

      {page === "landing"
        ? <LandingPage   onEnterDashboard={() => {
            const authUser = localStorage.getItem("authUser");
            if(!authUser) navigate('/login');
            else{
                if(localStorage.getItem("userRole")=="user") navigate('/home');
                else navigate('/admin');
            }
        }} />
        : <DashboardPage onGoLanding={()      => setPage("landing")} />
      }
    </>
  );
}