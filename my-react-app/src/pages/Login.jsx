import { useState } from "react";
import {useNavigate} from "react-router-dom";
// ── Inline SVG Icons ──────────────────────────────────────────────────────────
const LandmarkIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0a192f" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="3" y1="22" x2="21" y2="22" />
    <line x1="6" y1="18" x2="6" y2="11" />
    <line x1="10" y1="18" x2="10" y2="11" />
    <line x1="14" y1="18" x2="14" y2="11" />
    <line x1="18" y1="18" x2="18" y2="11" />
    <polygon points="12 2 20 7 4 7" />
  </svg>
);

const ShieldIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#c9a84c" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    <polyline points="9 12 11 14 15 10" />
  </svg>
);

const TrendingIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#c9a84c" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
    <polyline points="17 6 23 6 23 12" />
  </svg>
);

const HeadphonesIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#c9a84c" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 18v-6a9 9 0 0 1 18 0v6" />
    <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3z" />
    <path d="M3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z" />
  </svg>
);

// ── Toast ─────────────────────────────────────────────────────────────────────
function Toast({ msg, type }) {
  if (!msg) return null;
  const isError = type === "error";
  return (
    <div
      style={{
        marginTop: 16,
        borderRadius: 10,
        padding: "12px 16px",
        textAlign: "center",
        fontSize: 14,
        fontWeight: 500,
        background: isError ? "rgba(239,68,68,0.15)" : "rgba(34,197,94,0.15)",
        color: isError ? "#f87171" : "#4ade80",
        animation: "fadeUp 0.3s ease-out",
      }}
    >
      {msg}
    </div>
  );
}

// ── Shared Input Label ────────────────────────────────────────────────────────
function Label({ children }) {
  return (
    <label
      style={{
        display: "block",
        fontSize: 11,
        fontWeight: 600,
        letterSpacing: "0.15em",
        textTransform: "uppercase",
        color: "#94a3b8",
        marginBottom: 6,
      }}
    >
      {children}
    </label>
  );
}

// ── Inquiry Form ──────────────────────────────────────────────────────────────
function InquiryForm() {
    const navigate = useNavigate();
  const [fields, setFields] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const set = (key) => (e) => setFields((f) => ({ ...f, [key]: e.target.value }));

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    const response = await fetch("http://localhost:5288/api/User", {
        method: "POST",
        headers: {'Content-Type': 'application/json',},
        body : JSON.stringify({
            name: fields.name,
            email: fields.email,
            password:fields.password,
            role:"user",
        })
    })
    if(response.status==201){
        const res= await response.json();
        setLoading(false);
        setFields({ name: "", email: "", password: "" });
        localStorage.setItem("authUser",res.userID);
        localStorage.setItem("userRole",res.role);
        if(res.role=="user") navigate("/home");
        else navigate('/admin');
    }else{
        setLoading(false);
        setToast({ msg: "Error creating user account.", type: "success" });
        setFields({ name: "", email: "", password: "" });
        setTimeout(() => setToast(null), 4000);
    }
    
  };
  

  return (
    <form onSubmit={handleSignup}>
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <div>
          <Label>Full Name</Label>
          <input
            className="apex-input"
            type="text"
            required
            placeholder="John Doe"
            value={fields.name}
            onChange={set("name")}
          />
        </div>
        <div>
          <Label>Email</Label>
          <input
            className="apex-input"
            type="email"
            required
            placeholder="john@example.com"
            value={fields.email}
            onChange={set("email")}
          />
        </div>
        <div>
          <Label>Password</Label>
          <input
            className="apex-input"
            type="password"
            placeholder="........."
            value={fields.password}
            onChange={set("password")}
          />
        </div>
      </div>
      <button className="apex-btn" type="submit" disabled={loading}>
        {loading ? "Submitting…" : "Sign Up"}
      </button>
      {toast && <Toast msg={toast.msg} type={toast.type} />}
    </form>
  );
}

// ── Newsletter Form ───────────────────────────────────────────────────────────
function NewsletterForm() {
    const navigate = useNavigate();
  const [fields, setFields] = useState({ email: "" , password:"" });
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const set = (key) => (e) => setFields((f) => ({ ...f, [key]: e.target.value }));

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    console.log(fields);
    const response = await fetch("http://localhost:5288/api/Auth/", {
        method: "POST",
        headers: {'Content-Type': 'application/json',},
        body : JSON.stringify({
            email: fields.email,
            password:fields.password,
            role:"user",
        })
    })
    if(response.status==200){
        setLoading(false);
        const res=await response.json();
        localStorage.setItem("authUser",res.userID)
        localStorage.setItem("userRole",res.role);
        if(res.role=="user") navigate("/home");
        else navigate("/admin");
        setTimeout(() => setToast(null), 4000);
    }else if(response.status==404){
        setLoading(false);
        setToast({ msg: "User not found with this email !", type: "error" });
        setFields({ email: "" , password:"" });
        setTimeout(() => setToast(null), 4000);
    }else{
        setLoading(false);
        setToast({ msg: "Password Wrong !", type: "error" });
        setFields({ email: "" , password:"" });
        setTimeout(() => setToast(null), 4000);
    }
    };

  return (
    <form onSubmit={handleLogin}>
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <div>
          <Label>Email Address</Label>
          <input
            className="apex-input"
            type="email"
            required
            placeholder="jane@example.com"
            value={fields.email}
            onChange={set("email")}
          />
        </div>
        <div>
          <Label>Password</Label>
          <input
            className="apex-input"
            type="password"
            required
            placeholder="......."
            value={fields.password}
            onChange={set("password")}
          />
        </div>
      </div>
      <button className="apex-btn" type="submit" disabled={loading}>
        {loading ? "Loging In…" : "Login"}
      </button>
      {toast && <Toast msg={toast.msg} type={toast.type} />}
    </form>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────
export default function ApexBank() {
    
  const [activeTab, setActiveTab] = useState("inquiry");

  const features = [
    { icon: <ShieldIcon />, label: "256-bit Encryption" },
    { icon: <TrendingIcon />, label: "Smart Investments" },
    { icon: <HeadphonesIcon />, label: "24/7 Support" },
  ];

//   const navLinks = ["Personal", "Business", "About"];
    const navLinks=[];
  return (
    <>
      {/* ── Global Styles ── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        body {
          font-family: 'Plus Jakarta Sans', sans-serif;
          background-color: #0a192f;
        }

        .apex-input {
          width: 100%;
          background: rgba(10, 25, 47, 0.6);
          border: 1px solid rgba(148, 163, 184, 0.2);
          color: #e2e8f0;
          border-radius: 10px;
          padding: 12px 16px;
          font-size: 14px;
          font-family: 'Plus Jakarta Sans', sans-serif;
          transition: border-color 0.2s, box-shadow 0.2s;
          outline: none;
        }
        .apex-input::placeholder { color: #475569; }
        .apex-input:focus {
          border-color: #c9a84c;
          box-shadow: 0 0 0 3px rgba(201, 168, 76, 0.15);
        }

        .apex-btn {
          width: 100%;
          background: #c9a84c;
          color: #0a192f;
          border: none;
          border-radius: 10px;
          padding: 14px;
          font-size: 14px;
          font-weight: 700;
          letter-spacing: 0.05em;
          cursor: pointer;
          margin-top: 24px;
          font-family: 'Plus Jakarta Sans', sans-serif;
          transition: transform 0.2s, box-shadow 0.2s;
        }
        .apex-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(201, 168, 76, 0.35);
        }
        .apex-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none;
        }

        .gold-shimmer {
          height: 2px;
          background: linear-gradient(90deg, transparent, #c9a84c, #e8d48b, #c9a84c, transparent);
          background-size: 200% 100%;
          animation: shimmer 3s ease-in-out infinite;
        }

        @keyframes shimmer {
          0%   { background-position: -200% 0; }
          100% { background-position:  200% 0; }
        }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(30px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        @keyframes slideIn {
          from { opacity: 0; transform: translateX(40px); }
          to   { opacity: 1; transform: translateX(0); }
        }

        .fade-up   { animation: fadeUp  0.8s ease-out 0.00s both; }
        .fade-up-1 { animation: fadeUp  0.8s ease-out 0.15s both; }
        .fade-up-2 { animation: fadeUp  0.8s ease-out 0.30s both; }
        .fade-up-3 { animation: fadeUp  0.8s ease-out 0.45s both; }
        .slide-in  { animation: slideIn 0.7s ease-out 0.30s both; }
      `}</style>

      <div
        style={{
          background: "#0a192f",
          minHeight: "100vh",
          backgroundImage:
            "radial-gradient(circle at 20% 50%, rgba(201,168,76,0.06) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(201,168,76,0.04) 0%, transparent 40%)",
        }}
      >
        {/* ── Navbar ── */}
        <nav
          className="fade-up"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "20px 48px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div
              style={{
                background: "#c9a84c",
                width: 36,
                height: 36,
                borderRadius: 8,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <LandmarkIcon />
            </div>
            <span
              style={{
                fontFamily: "'DM Serif Display', serif",
                fontSize: 20,
                color: "#e2e8f0",
              }}
            >
              Apex Bank
            </span>
          </div>
          <div style={{ display: "flex", gap: 32 }}>
            {navLinks.map((link) => (
              <span
                key={link}
                style={{ fontSize: 14, fontWeight: 500, color: "#94a3b8", cursor: "pointer" }}
              >
                {link}
              </span>
            ))}
          </div>
        </nav>

        {/* ── Gold Divider ── */}
        <div className="gold-shimmer" />

        {/* ── Main Content ── */}
        <main
          style={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "center",
            gap: 64,
            padding: "60px 48px",
          }}
        >
          {/* Hero Copy */}
          <div style={{ flex: 1, maxWidth: 520 }}>
            <p
              className="fade-up"
              style={{
                fontSize: 11,
                fontWeight: 600,
                letterSpacing: "0.25em",
                textTransform: "uppercase",
                color: "#c9a84c",
                marginBottom: 16,
              }}
            >
              Trusted Since 1987
            </p>
            <h1
              className="fade-up-1"
              style={{
                fontFamily: "'DM Serif Display', serif",
                fontSize: "clamp(2rem, 4vw, 3.5rem)",
                lineHeight: 1.2,
                color: "#e2e8f0",
                marginBottom: 20,
              }}
            >
              Banking Built for Your Future
            </h1>
            <p
              className="fade-up-2"
              style={{ fontSize: 17, lineHeight: 1.7, color: "#94a3b8", marginBottom: 32 }}
            >
              Secure accounts, smart investments, and personalized service — all in one place.
            </p>
            <div className="fade-up-3" style={{ display: "flex", flexWrap: "wrap", gap: 24 }}>
              {features.map(({ icon, label }) => (
                <div key={label} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  {icon}
                  <span style={{ fontSize: 13, color: "#94a3b8" }}>{label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Form Card */}
          <div className="slide-in" style={{ width: "100%", maxWidth: 420 }}>
            <div
              style={{
                backdropFilter: "blur(20px)",
                WebkitBackdropFilter: "blur(20px)",
                background: "rgba(15, 35, 63, 0.85)",
                border: "1px solid rgba(201, 168, 76, 0.2)",
                borderRadius: 20,
                padding: 32,
              }}
            >
              {/* Tabs */}
              <div
                style={{
                  display: "flex",
                  marginBottom: 32,
                  borderBottom: "1px solid rgba(148, 163, 184, 0.15)",
                }}
              >
                {[
                  { key: "inquiry", label: "Get Started" },
                  { key: "newsletter", label: "Newsletter" },
                ].map(({ key, label }) => (
                  <button
                    key={key}
                    onClick={() => setActiveTab(key)}
                    style={{
                      flex: 1,
                      paddingBottom: 12,
                      fontSize: 14,
                      fontWeight: 600,
                      color: activeTab === key ? "#c9a84c" : "#94a3b8",
                      background: "none",
                      border: "none",
                      borderBottom: activeTab === key ? "2px solid #c9a84c" : "2px solid transparent",
                      cursor: "pointer",
                      transition: "all 0.2s",
                      fontFamily: "'Plus Jakarta Sans', sans-serif",
                    }}
                  >
                    {label}
                  </button>
                ))}
              </div>

              {/* Active Form */}
              {activeTab === "inquiry" ? <InquiryForm /> : <NewsletterForm />}
            </div>
          </div>
        </main>

        {/* ── Footer ── */}
        <footer style={{ textAlign: "center", padding: "32px 24px" }}>
          <div className="gold-shimmer" style={{ width: 192, margin: "0 auto 24px" }} />
          <p style={{ fontSize: 12, color: "#475569" }}>
            © 2024 Apex Bank. All rights reserved. This is a demo page.
          </p>
        </footer>
      </div>
    </>
  );
}