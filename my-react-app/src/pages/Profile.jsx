import { useState ,useEffect} from "react";
import {useNavigate} from "react-router-dom";
// ── SVG Icons ─────────────────────────────────────────────────────────────────
const LandmarkIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#0a192f" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="3" y1="22" x2="21" y2="22" /><line x1="6" y1="18" x2="6" y2="11" />
    <line x1="10" y1="18" x2="10" y2="11" /><line x1="14" y1="18" x2="14" y2="11" />
    <line x1="18" y1="18" x2="18" y2="11" /><polygon points="12 2 20 7 4 7" />
  </svg>
);
const LogOutIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#c9a84c" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" />
  </svg>
);
const UserIcon = ({ size = 48, color = "#0a192f" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
  </svg>
);
const CreditCardIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#c9a84c" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="1" y="4" width="22" height="16" rx="2" /><line x1="1" y1="10" x2="23" y2="10" />
  </svg>
);
const PlusIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#c9a84c" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);
const SmartphoneIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="5" y="2" width="14" height="20" rx="2" /><line x1="12" y1="18" x2="12" y2="18" />
  </svg>
);
const MonitorIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="3" width="20" height="14" rx="2" /><line x1="8" y1="21" x2="16" y2="21" /><line x1="12" y1="17" x2="12" y2="21" />
  </svg>
);
const XIcon = ({ color = "#94a3b8" }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);
const MenuIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#e2e8f0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" />
  </svg>
);

// ── Reusable Components ───────────────────────────────────────────────────────

function GoldLine({ style }) {
  return <div className="gold-shimmer" style={style} />;
}

function Badge({ variant, children }) {
  const styles = {
    premium: { background: "rgba(201,168,76,0.2)", color: "#c9a84c" },
    standard: { background: "rgba(148,163,184,0.2)", color: "#94a3b8" },
    active: { background: "rgba(201,168,76,0.2)", color: "#c9a84c" },
  };
  return (
    <span style={{ display: "inline-block", padding: "6px 12px", borderRadius: 20, fontSize: 12, fontWeight: 600, ...styles[variant] }}>
      {children}
    </span>
  );
}

function Toggle({ checked, onChange }) {
  return (
    <div
      onClick={onChange}
      style={{
        width: 48, height: 28, borderRadius: 14, cursor: "pointer",
        position: "relative", transition: "all 0.3s ease", flexShrink: 0,
        background: checked ? "#c9a84c" : "#1e3a52",
        border: checked ? "2px solid #c9a84c" : "2px solid rgba(201,168,76,0.3)",
      }}
    >
      <div style={{
        position: "absolute", width: 20, height: 20, borderRadius: "50%",
        background: "white", top: 2, left: checked ? 22 : 2,
        transition: "left 0.3s ease",
      }} />
    </div>
  );
}

function SettingItem({ children }) {
  return (
    <div className="setting-item" style={{
      display: "flex", justifyContent: "space-between", alignItems: "center",
      padding: 16, borderRadius: 8, marginBottom: 12,
      background: "rgba(15,35,63,0.5)",
      border: "1px solid rgba(201,168,76,0.1)",
    }}>
      {children}
    </div>
  );
}

function FormInput({ label, type = "text", value, onChange, placeholder, readOnly }) {
  return (
    <div>
      <label style={{ display: "block", fontWeight: 500, marginBottom: 8, color: "#e2e8f0", fontSize: 14 }}>
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        readOnly={readOnly}
        required
        className="apex-input"
        style={{
          width: "100%", padding: "12px 16px",
          border: "1px solid rgba(201,168,76,0.3)",
          borderRadius: 8, fontSize: 14,
          background: "rgba(15,35,63,0.5)", color: "#e2e8f0",
          fontFamily: "inherit",
        }}
      />
    </div>
  );
}

// ── Modal Wrapper ─────────────────────────────────────────────────────────────
function Modal({ show, onClose, title, children }) {
  if (!show) return null;
  return (
    <div
      onClick={(e) => e.target === e.currentTarget && onClose()}
      style={{
        position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)",
        zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center",
        animation: "fadeIn 0.3s ease-out",
      }}
    >
      <div style={{
        background: "#0f233f", borderRadius: 16, padding: 32,
        maxWidth: 500, width: "90%",
        border: "1px solid rgba(201,168,76,0.2)",
        animation: "slideUp 0.4s ease-out",
      }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
          <h2 style={{ fontSize: 20, fontWeight: 600, color: "#e2e8f0" }}>{title}</h2>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", padding: 0 }}>
            <XIcon />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

// ── Toast ─────────────────────────────────────────────────────────────────────
function Toast({ msg, type }) {
  if (!msg) return null;
  const colors = { success: { bg: "#4ade80", color: "#0a192f" }, error: { bg: "#f87171", color: "#fff" } };
  const c = colors[type] || colors.success;
  return (
    <div style={{
      position: "fixed", bottom: 24, right: 24, zIndex: 200,
      background: c.bg, color: c.color,
      padding: "16px 24px", borderRadius: 8, fontWeight: 500, fontSize: 14,
      animation: "slideUp 0.4s ease-out",
    }}>
      {msg}
    </div>
  );
}

// ── Profile Tab ───────────────────────────────────────────────────────────────
function ProfileTab({ profile, onEditClick ,account}) {
  return (
    <div className="anim-slide-up">
      <h1 className="font-display" style={{ fontSize: "clamp(1.5rem,3vw,2rem)", color: "#e2e8f0", marginBottom: 24 }}>
        Profile Information
      </h1>
      <div style={{
        borderRadius: 20, padding: 32,
        background: "linear-gradient(135deg, rgba(15,35,63,0.9) 0%, rgba(201,168,76,0.08) 100%)",
        border: "1px solid rgba(201,168,76,0.2)",
        backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)",
      }} className="profile-card">
        {/* Avatar Row */}
        <div className="avatar-row">
          <div style={{
            width: 96, height: 96, borderRadius: "50%", flexShrink: 0,
            background: "linear-gradient(135deg, #c9a84c, #e8d48b)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <UserIcon size={48} color="#0a192f" />
          </div>
          <div>
            <h2 className="font-display" style={{ fontSize: "1.5rem", color: "#e2e8f0", marginBottom: 8 }}>{profile.name}</h2>
            <p style={{ color: "#94a3b8", fontSize: 14, marginBottom: 8 }}>{profile.email}</p>
            <div style={{ display: "flex", gap: 8 }}>
              <Badge variant="premium">{account.type} Member</Badge>
              <Badge variant="standard">Verified</Badge>
            </div>
          </div>
        </div>

        <GoldLine style={{ marginBottom: 32 }} />

        {/* Info Grid */}
        <div className="profile-grid">
          <FormInput label="Full Name" value={profile.name} readOnly />
          <FormInput label="Email" type="email" value={profile.email} readOnly />
          <FormInput label="Member Since" value={profile.memberSince} readOnly />
        </div>

        <button
          onClick={onEditClick}
          className="btn-gold-primary"
          style={{ marginTop: 24, padding: "12px 24px", borderRadius: 8, fontWeight: 500, fontSize: 14 }}
        >
          Edit Profile
        </button>
      </div>
    </div>
  );
}

// ── Account Tab ───────────────────────────────────────────────────────────────
function AccountTab({ onToast }) {
  return (
    <div className="anim-slide-up">
      <h1 className="font-display" style={{ fontSize: "clamp(1.5rem,3vw,2rem)", color: "#e2e8f0", marginBottom: 24 }}>
        Account &amp; Billing
      </h1>

      {/* Plan Card */}
      <div style={{ marginBottom: 32 }}>
        <h2 style={{ fontSize: 20, fontWeight: 600, color: "#e2e8f0", marginBottom: 16 }}>Your Plan</h2>
        <div style={{
          padding: 24, borderRadius: 12,
          border: "2px solid rgba(201,168,76,0.3)",
          background: "linear-gradient(135deg, rgba(15,35,63,0.9) 0%, rgba(201,168,76,0.08) 100%)",
        }}>
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 16 }}>
            <div>
              <h3 style={{ fontSize: 18, fontWeight: 600, color: "#e2e8f0", marginBottom: 4 }}>Premium Account</h3>
              <p style={{ color: "#94a3b8", fontSize: 13 }}>Advanced features and priority support</p>
            </div>
            <Badge variant="active">Active</Badge>
          </div>

          <GoldLine style={{ margin: "16px 0" }} />

          <div className="plan-grid" style={{ marginBottom: 16 }}>
            {[
              { label: "Monthly Fee", value: "$9.99", color: "#e2e8f0" },
              { label: "Transaction Limit", value: "Unlimited", color: "#e2e8f0" },
              { label: "Cashback", value: "2%", color: "#e2e8f0" },
              { label: "Priority Support", value: "Included", color: "#4ade80" },
            ].map(({ label, value, color }) => (
              <div key={label}>
                <p style={{ color: "#94a3b8", fontSize: 13, marginBottom: 4 }}>{label}</p>
                <p style={{ fontWeight: 600, color, fontSize: 14 }}>{value}</p>
              </div>
            ))}
          </div>

          <button
            onClick={() => onToast("Upgrade options coming soon", "success")}
            style={{
              width: "100%", padding: "10px 16px", borderRadius: 8,
              background: "rgba(201,168,76,0.1)", color: "#c9a84c",
              border: "none", fontSize: 14, fontWeight: 500, cursor: "pointer", fontFamily: "inherit",
            }}
          >
            View All Plans
          </button>
        </div>
      </div>

      {/* Payment Methods */}
      <div>
        <h2 style={{ fontSize: 20, fontWeight: 600, color: "#e2e8f0", marginBottom: 16 }}>Payment Methods</h2>
        <SettingItem>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <CreditCardIcon />
            <div>
              <p style={{ fontWeight: 600, color: "#e2e8f0", fontSize: 14, marginBottom: 2 }}>Visa ending in 4242</p>
              <p style={{ color: "#94a3b8", fontSize: 12 }}>Expires 12/25</p>
            </div>
          </div>
          <button onClick={() => onToast("Card settings updated", "success")}
            style={{ background: "none", border: "none", color: "#c9a84c", fontSize: 13, cursor: "pointer", fontFamily: "inherit" }}>
            Edit
          </button>
        </SettingItem>

        <button
          onClick={() => onToast("Payment method added", "success")}
          style={{
            display: "flex", alignItems: "center", gap: 6,
            background: "rgba(201,168,76,0.1)", color: "#c9a84c",
            border: "none", padding: "10px 16px", borderRadius: 8,
            fontSize: 14, fontWeight: 500, cursor: "pointer", fontFamily: "inherit", marginTop: 8,
          }}
        >
          <PlusIcon /> Add Payment Method
        </button>
      </div>
    </div>
  );
}

// ── Security Tab ──────────────────────────────────────────────────────────────
function SecurityTab({ onChangePasswordClick, onToast }) {
  const [twoFA, setTwoFA] = useState(true);
  const [txAlerts, setTxAlerts] = useState(true);
  const [secAlerts, setSecAlerts] = useState(true);

  const toggleTwoFA = () => {
    const next = !twoFA;
    setTwoFA(next);
    onToast(next ? "Two-factor authentication enabled" : "Two-factor authentication disabled", "success");
  };

  return (
    <div className="anim-slide-up">
      <h1 className="font-display" style={{ fontSize: "clamp(1.5rem,3vw,2rem)", color: "#e2e8f0", marginBottom: 24 }}>
        Security Settings
      </h1>

      {/* Password & Auth */}
      <div style={{ marginBottom: 32 }}>
        <h2 style={{ fontSize: 20, fontWeight: 600, color: "#e2e8f0", marginBottom: 16 }}>Password &amp; Authentication</h2>
        <SettingItem>
          <div>
            <p style={{ fontWeight: 600, color: "#e2e8f0", fontSize: 14, marginBottom: 2 }}>Password</p>
            <p style={{ color: "#94a3b8", fontSize: 12 }}>Last changed 3 months ago</p>
          </div>
          <button onClick={onChangePasswordClick}
            style={{ background: "none", border: "none", color: "#c9a84c", fontSize: 13, fontWeight: 500, cursor: "pointer", fontFamily: "inherit" }}>
            Change
          </button>
        </SettingItem>
        <SettingItem>
          <div>
            <p style={{ fontWeight: 600, color: "#e2e8f0", fontSize: 14, marginBottom: 2 }}>Two-Factor Authentication</p>
            <p style={{ color: "#94a3b8", fontSize: 12 }}>Add an extra layer of security</p>
          </div>
          <Toggle checked={twoFA} onChange={toggleTwoFA} />
        </SettingItem>
      </div>

      {/* Sessions */}
      <div style={{ marginBottom: 32 }}>
        <h2 style={{ fontSize: 20, fontWeight: 600, color: "#e2e8f0", marginBottom: 16 }}>Active Sessions</h2>
        <SettingItem>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <SmartphoneIcon />
            <div>
              <p style={{ fontWeight: 600, color: "#e2e8f0", fontSize: 14, marginBottom: 2 }}>iPhone 14 Pro</p>
              <p style={{ color: "#94a3b8", fontSize: 12 }}>Active now · Safari</p>
            </div>
          </div>
          <span style={{ color: "#4ade80", fontSize: 12 }}>Current</span>
        </SettingItem>
        <SettingItem>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <MonitorIcon />
            <div>
              <p style={{ fontWeight: 600, color: "#e2e8f0", fontSize: 14, marginBottom: 2 }}>Mac Studio</p>
              <p style={{ color: "#94a3b8", fontSize: 12 }}>Last active 2 hours ago · Chrome</p>
            </div>
          </div>
          <button onClick={() => onToast("Session logged out", "success")}
            style={{ background: "none", border: "none", color: "#f87171", fontSize: 13, fontWeight: 500, cursor: "pointer", fontFamily: "inherit" }}>
            Logout
          </button>
        </SettingItem>
      </div>

      {/* Notifications */}
      <div>
        <h2 style={{ fontSize: 20, fontWeight: 600, color: "#e2e8f0", marginBottom: 16 }}>Notifications</h2>
        <SettingItem>
          <div>
            <p style={{ fontWeight: 600, color: "#e2e8f0", fontSize: 14, marginBottom: 2 }}>Transaction Alerts</p>
            <p style={{ color: "#94a3b8", fontSize: 12 }}>Get notified for every transaction</p>
          </div>
          <Toggle checked={txAlerts} onChange={() => setTxAlerts(v => !v)} />
        </SettingItem>
        <SettingItem>
          <div>
            <p style={{ fontWeight: 600, color: "#e2e8f0", fontSize: 14, marginBottom: 2 }}>Security Alerts</p>
            <p style={{ color: "#94a3b8", fontSize: 12 }}>Account login and suspicious activity</p>
          </div>
          <Toggle checked={secAlerts} onChange={() => setSecAlerts(v => !v)} />
        </SettingItem>
      </div>
    </div>
  );
}
function Loader() {
  return (
    <div style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "60vh",
      color: "#c9a84c",
      fontSize: 18,
      fontWeight: 600
    }}>
      Loading profile...
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────
export default function BankingProfile() {
    const [loading, setLoading] = useState(true);
    const [account , setAccount] =useState({});
  const [activeTab, setActiveTab] = useState("profile");
  const [toast, setToast] = useState(null);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const [profile, setProfile] = useState({
    name: "",
    email: "",
    memberSince: "January 15, 2023",
  });

  const userDataFetch= async(userID)=>{
    try{
        setLoading(true);
        const response= await fetch(`http://localhost:5288/api/User/by-id/${userID}`,{method:"GET"});
        if(response.status==200){
            const res= await response.json();
            setProfile({name:res.name,email:res.email,memberSince:"January 15, 2023"});
            
        }else{
            console.log(response);
        }
        setLoading(false);
  }catch(error){
    console.log(error);
  }
}
const AccountDataFetch= async(userID)=>{
    try{
        setLoading(true);
        const response= await fetch(`http://localhost:5288/api/Account/by-userID/${userID}`,{method:"GET"});
        if(response.status==200){
            const res= await response.json();
            setAccount(res);
        }else{
            console.log(response);
        }
        setLoading(false);
  }catch(error){
    console.log(error);
  }
}
useEffect(()=>{
    const authUser = localStorage.getItem("authUser");
    userDataFetch(authUser);
    AccountDataFetch(authUser);
},[])

  const [editForm, setEditForm] = useState({ ...profile });
  const [passwordForm, setPasswordForm] = useState({ current: "", next: "", confirm: "" });

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    setProfile({ ...profile, name: editForm.name, email: editForm.email, phone: editForm.phone });
    setShowEditModal(false);
    showToast("Profile updated successfully!");
  };

  const handlePasswordSubmit = async(e) => {
    e.preventDefault();
    if(passwordForm.next==passwordForm.confirm && passwordForm.current!=passwordForm.next && passwordForm.current!=passwordForm.confirm){
    const id = localStorage.getItem("authUser");
    const response = await fetch(`http://localhost:5288/api/User/change-password/${id}`,{method:"POST",headers:{'Content-Type': 'application/json',},body: JSON.stringify(passwordForm)});
    console.log(response);  
    if(response.status==401) showToast("Password updated Failed , Current Password is not Matched with Input");
    else {
    setShowPasswordModal(false);
      showToast("Password updated successfully!");
    }
    }else{
      showToast("Password updated Failed , The Crenditentials are not match");
    }
  };
  const navigate = useNavigate();
  
  const Logout = async()=>{
    
    localStorage.removeItem("authUser");
    localStorage.removeItem("userRole");
    navigate('/');
  }
  const TABS = [
    { key: "profile", label: "Profile" },
    { key: "account", label: "Account & Billing" },
    { key: "security", label: "Security" },
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'Plus Jakarta Sans', sans-serif; background: #0a192f; }
        .font-display { font-family: 'DM Serif Display', serif; }

        .gold-shimmer {
          height: 1px;
          background: linear-gradient(90deg, transparent, #c9a84c, #e8d48b, #c9a84c, transparent);
          background-size: 200% 100%;
          animation: shimmer 3s ease-in-out infinite;
        }
        @keyframes shimmer  { 0% { background-position: -200% 0; } 100% { background-position: 200% 0; } }
        @keyframes fadeIn   { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideUp  { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes slideDown { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }

        .anim-slide-up   { animation: slideUp   0.6s ease-out both; }
        .anim-slide-down { animation: slideDown  0.5s ease-out; }
        .anim-fade-in    { animation: fadeIn     0.6s ease-out; }

        .setting-item:hover { background: rgba(15,35,63,0.7) !important; border-color: rgba(201,168,76,0.2) !important; }

        .apex-input:focus {
          outline: none;
          border-color: #c9a84c !important;
          box-shadow: 0 0 0 3px rgba(201,168,76,0.1);
        }
        .apex-input[readonly] { opacity: 0.75; cursor: default; }

        .btn-gold-primary {
          background: #c9a84c;
          color: #0a192f;
          border: none;
          cursor: pointer;
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-weight: 600;
          transition: transform 0.2s, box-shadow 0.2s;
        }
        .btn-gold-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(201,168,76,0.35);
        }

        .tab-btn {
          padding: 9px 16px;
          border-radius: 8px;
          font-weight: 500;
          font-size: 13px;
          border: none;
          cursor: pointer;
          font-family: 'Plus Jakarta Sans', sans-serif;
          white-space: nowrap;
          transition: all 0.2s ease;
        }
        .tab-btn.active   { background: #c9a84c; color: #0a192f; }
        .tab-btn.inactive { background: transparent; color: #94a3b8; }
        .tab-btn.inactive:hover { color: #e2e8f0; }

        /* Responsive nav */
        .nav-inner { padding: 16px 48px; }
        .desktop-nav { display: flex; }
        .hamburger-btn { display: none !important; }
        .main-content { padding: 32px 48px; }

        .profile-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
        }

        .plan-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 16px;
          font-size: 13px;
        }

        .avatar-row {
          display: flex;
          align-items: center;
          gap: 24px;
          margin-bottom: 32px;
        }

        /* ── Tablet (≤ 768px) ── */
        @media (max-width: 768px) {
          .nav-inner { padding: 14px 20px; }
          .desktop-nav { display: none !important; }
          .hamburger-btn { display: flex !important; align-items: center; justify-content: center; }
          .main-content { padding: 24px 20px; }
          .plan-grid { grid-template-columns: 1fr 1fr; }
        }

        /* ── Mobile (≤ 480px) ── */
        @media (max-width: 480px) {
          .main-content { padding: 20px 16px; }
          .profile-grid { grid-template-columns: 1fr; }
          .plan-grid { grid-template-columns: 1fr 1fr; }
          .avatar-row { flex-direction: column; align-items: flex-start; gap: 16px; }
          .tab-btn { padding: 8px 14px; font-size: 12px; }
          .profile-card { padding: 20px !important; }
        }

        .nav-link {
          background: none; border: none;
          font-size: 14px; font-weight: 500;
          color: #94a3b8; cursor: pointer;
          font-family: 'Plus Jakarta Sans', sans-serif;
          transition: opacity 0.2s;
        }
        .nav-link:hover { opacity: 0.75; }
      `}</style>

      <div style={{
        minHeight: "100vh", backgroundColor: "#0a192f",
        backgroundImage: "radial-gradient(circle at 20% 50%, rgba(201,168,76,0.06) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(201,168,76,0.04) 0%, transparent 40%)",
      }}>

        {/* ── Header ── */}
        <header className="anim-slide-down" style={{
          position: "sticky", top: 0, zIndex: 50,
          background: "rgba(10,25,47,0.95)",
          backdropFilter: "blur(10px)", WebkitBackdropFilter: "blur(10px)",
        }}>
          <nav style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 24px" }} className="nav-inner">
            {/* Logo */}
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ background: "#c9a84c", width: 40, height: 40, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <LandmarkIcon />
              </div>
              <div>
                <div className="font-display" style={{ fontSize: 18, fontWeight: 700, color: "#e2e8f0" }}>Apex Bank</div>
                <div style={{ fontSize: 12, color: "#94a3b8" }}>{account.type} Account</div>
              </div>
            </div>

            {/* Desktop nav links — hidden on mobile */}
            <div className="desktop-nav" style={{ display: "flex", alignItems: "center", gap: 24 }}>
              {TABS.map(({ key, label }) => (
                <button key={key} className="nav-link" onClick={() => setActiveTab(key)}>{label}</button>
              ))}
              <button onClick={()=>Logout()} style={{
                display: "flex", alignItems: "center", gap: 8,
                background: "rgba(201,168,76,0.1)", color: "#c9a84c",
                border: "none", padding: "8px 16px", borderRadius: 8,
                fontSize: 14, fontWeight: 500, cursor: "pointer", fontFamily: "inherit",
              }}>
                <LogOutIcon /> Logout
              </button>
            </div>

            {/* Hamburger — shown only on mobile */}
            <button
              className="hamburger-btn"
              onClick={() => setMobileMenuOpen(o => !o)}
              style={{ background: "none", border: "none", cursor: "pointer", padding: 4, display: "none" }}
            >
              {mobileMenuOpen ? <XIcon color="#e2e8f0" /> : <MenuIcon />}
            </button>
          </nav>

          {/* Mobile dropdown menu */}
          {mobileMenuOpen && (
            <div className="mobile-menu" style={{
              background: "rgba(10,25,47,0.98)",
              borderTop: "1px solid rgba(201,168,76,0.15)",
              padding: "12px 24px 20px",
              display: "flex", flexDirection: "column", gap: 4,
              animation: "slideDown 0.25s ease-out",
            }}>
              {TABS.map(({ key, label }) => (
                <button key={key} onClick={() => { setActiveTab(key); setMobileMenuOpen(false); }}
                  style={{
                    background: activeTab === key ? "rgba(201,168,76,0.12)" : "none",
                    border: "none", color: activeTab === key ? "#c9a84c" : "#94a3b8",
                    fontSize: 15, fontWeight: 500, padding: "12px 16px", borderRadius: 8,
                    textAlign: "left", cursor: "pointer", fontFamily: "inherit",
                    transition: "all 0.2s",
                  }}
                >
                  {label}
                </button>
              ))}
              <div style={{ borderTop: "1px solid rgba(148,163,184,0.1)", marginTop: 8, paddingTop: 12 }}>
                <button style={{
                  display: "flex", alignItems: "center", gap: 8,
                  background: "rgba(201,168,76,0.1)", color: "#c9a84c",
                  border: "none", padding: "10px 16px", borderRadius: 8,
                  fontSize: 14, fontWeight: 500, cursor: "pointer", fontFamily: "inherit", width: "100%",
                }}>
                  <LogOutIcon /> Logout
                </button>
              </div>
            </div>
          )}

          <div className="gold-shimmer" />
        </header>

        {/* ── Main ── */}
        <main className="main-content">

          {/* Tab Buttons */}
          <div className="anim-fade-in" style={{ display: "flex", gap: 8, marginBottom: 32, overflowX: "auto", paddingBottom: 4 }}>
            {TABS.map(({ key, label }) => (
              <button key={key} className={`tab-btn ${activeTab === key ? "active" : "inactive"}`} onClick={() => setActiveTab(key)}>
                {label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          {activeTab === "profile" && (
            loading ? (
                <Loader />   // or <Loader />
            ) : (
            <ProfileTab profile={profile} account={account} onEditClick={() => { setEditForm({ ...profile }); setShowEditModal(true); }} />
          ))}
          {activeTab === "account" && (
            <AccountTab onToast={showToast} />
          )}
          {activeTab === "security" && (
            <SecurityTab onChangePasswordClick={() => setShowPasswordModal(true)} onToast={showToast} />
          )}
        </main>
      </div>

      {/* ── Change Password Modal ── */}
      <Modal show={showPasswordModal} onClose={() => setShowPasswordModal(false)} title="Change Password">
        <form onSubmit={handlePasswordSubmit} style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <FormInput label="Current Password" type="password" value={passwordForm.current}
            onChange={e => setPasswordForm(f => ({ ...f, current: e.target.value }))} placeholder="Enter current password" />
          <FormInput label="New Password" type="password" value={passwordForm.next}
            onChange={e => setPasswordForm(f => ({ ...f, next: e.target.value }))} placeholder="Enter new password" />
          <FormInput label="Confirm Password" type="password" value={passwordForm.confirm}
            onChange={e => setPasswordForm(f => ({ ...f, confirm: e.target.value }))} placeholder="Confirm new password" />
          <button type="submit" className="btn-gold-primary" style={{ width: "100%", padding: "14px", borderRadius: 8, fontSize: 14, marginTop: 4 }}>
            Update Password
          </button>
        </form>
      </Modal>

      {/* ── Edit Profile Modal ── */}
      <Modal show={showEditModal} onClose={() => setShowEditModal(false)} title="Edit Profile">
        <form onSubmit={handleEditSubmit} style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <FormInput label="Full Name" value={editForm.name}
            onChange={e => setEditForm(f => ({ ...f, name: e.target.value }))} placeholder="Enter full name" />
          <FormInput label="Email" type="email" value={editForm.email}
            onChange={e => setEditForm(f => ({ ...f, email: e.target.value }))} placeholder="Enter email" />
          <FormInput label="Phone Number" type="tel" value={editForm.phone}
            onChange={e => setEditForm(f => ({ ...f, phone: e.target.value }))} placeholder="Enter phone number" />
          <button type="submit" className="btn-gold-primary" style={{ width: "100%", padding: "14px", borderRadius: 8, fontSize: 14, marginTop: 4 }}>
            Save Changes
          </button>
        </form>
      </Modal>

      {/* ── Toast ── */}
      {toast && <Toast msg={toast.msg} type={toast.type} />}
    </>
  );
}