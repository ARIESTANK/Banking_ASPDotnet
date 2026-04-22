import { useState, useEffect, useCallback } from "react";
import {useNavigate} from "react-router-dom";

// ── SVG Icons ─────────────────────────────────────────────────────────────────
const ShieldIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#0a192f" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
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
const XIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);
const UserPlusIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#c9a84c" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="8.5" cy="7" r="4" /><line x1="20" y1="8" x2="20" y2="14" /><line x1="23" y1="11" x2="17" y2="11" />
  </svg>
);
const TrendingUpIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" /><polyline points="17 6 23 6 23 12" />
  </svg>
);
const MenuIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#e2e8f0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" />
  </svg>
);


// ── Helpers ───────────────────────────────────────────────────────────────────
const fmt = (n) => `$${Number(n).toFixed(2)}`;
const fmtDate = (s) => new Date(s).toLocaleDateString();

// ── Badge ─────────────────────────────────────────────────────────────────────
const BADGE_STYLES = {
  active:     { background: "rgba(74,222,128,0.2)",  color: "#4ade80" },
  inactive:   { background: "rgba(148,163,184,0.2)", color: "#94a3b8" },
  pending:    { background: "rgba(201,168,76,0.2)",  color: "#c9a84c" },
  completed:  { background: "rgba(74,222,128,0.2)",  color: "#4ade80" },
  deposit:    { background: "rgba(59,130,246,0.2)",  color: "#3b82f6" },
  withdraw:   { background: "rgba(248,113,113,0.2)", color: "#f87171" },
};
function Badge({ label }) {
  const key = label?.toLowerCase() || "inactive";
  const s = BADGE_STYLES[key] || BADGE_STYLES.inactive;
  return (
    <span style={{ display: "inline-block", padding: "5px 12px", borderRadius: 20, fontSize: 12, fontWeight: 600, ...s }}>
      {label}
    </span>
  );
}

// ── GoldLine ──────────────────────────────────────────────────────────────────
function GoldLine({ style }) {
  return <div className="gold-shimmer" style={style} />;
}

// ── Toast ─────────────────────────────────────────────────────────────────────
function Toast({ msg, type }) {
  if (!msg) return null;
  const colors = { success: { bg: "#4ade80", color: "#0a192f" }, error: { bg: "#f87171", color: "#fff" }, info: { bg: "#3b82f6", color: "#fff" } };
  const c = colors[type] || colors.info;
  return (
    <div style={{ position: "fixed", bottom: 24, right: 24, zIndex: 200, background: c.bg, color: c.color, padding: "16px 24px", borderRadius: 8, fontWeight: 500, fontSize: 14, animation: "slideUp 0.4s ease-out" }}>
      {msg}
    </div>
  );
}

// ── Modal ─────────────────────────────────────────────────────────────────────
function Modal({ show, onClose, title, children }) {
  if (!show) return null;
  return (
    <div onClick={(e) => e.target === e.currentTarget && onClose()} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", animation: "fadeIn 0.3s ease-out" }}>
      <div style={{ background: "#0f233f", borderRadius: 16, padding: 32, maxWidth: 600, width: "90%", maxHeight: "90vh", overflowY: "auto", border: "1px solid rgba(201,168,76,0.2)", animation: "slideUp 0.4s ease-out" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
          <h2 style={{ fontSize: 20, fontWeight: 600, color: "#e2e8f0" }}>{title}</h2>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", padding: 0 }}><XIcon /></button>
        </div>
        {children}
      </div>
    </div>
  );
}

// ── Form Field ────────────────────────────────────────────────────────────────
function Field({ label, children }) {
  return (
    <div style={{ marginBottom: 20 }}>
      <label style={{ display: "block", fontWeight: 500, marginBottom: 8, color: "#e2e8f0", fontSize: 14 }}>{label}</label>
      {children}
    </div>
  );
}
const inputStyle = { width: "100%", padding: "12px 16px", border: "1px solid rgba(201,168,76,0.3)", borderRadius: 8, background: "rgba(15,35,63,0.5)", color: "#e2e8f0", fontSize: 14, fontFamily: "inherit", outline: "none" };

// ── Stat Card ─────────────────────────────────────────────────────────────────
function StatCard({ label, value, valueColor = "#c9a84c" }) {
  return (
    <div style={{ padding: 24, borderRadius: 12, background: "linear-gradient(135deg, rgba(15,35,63,0.9) 0%, rgba(201,168,76,0.08) 100%)", border: "1px solid rgba(201,168,76,0.2)", textAlign: "center" }}>
      <div style={{ color: "#94a3b8", fontSize: 13, marginBottom: 8 }}>{label}</div>
      <div style={{ fontSize: 28, fontWeight: 700, color: valueColor }}>{value}</div>
    </div>
  );
}

// ── Dashboard Tab ─────────────────────────────────────────────────────────────
function DashboardTab({ users, transactions, onOpenCreateUser, onOpenNewTx }) {
  const [totalBalance , setTotalBalance] = useState(0);
  const [activeCount,setActiveCount] = useState(0)
  const deposits = transactions.filter(t => t.transaction_type === "Deposit").reduce((s, t) => s + t.amount, 0);
  const withdrawals = transactions.filter(t => t.transaction_type === "Withdraw").reduce((s, t) => s + t.amount, 0);
    const AccountListFetch=async()=>{
    const response = await fetch('http://localhost:5288/api/Account/activeAccount',{method:"GET"});
    if(response.status==200){
        const userList = await response.json();
        setActiveCount(userList.length);
    }else{
        console.log("Account Not Found");
    }
  }
  const TotalBalanceFetch=async()=>{
    const response = await fetch('http://localhost:5288/api/Transaction',{method:"GET"})
    if(response.status==200){
      const transactions = await response.json()
        let total=0;
      transactions.map(t=>{
        total+=t.amount;
      })
      setTotalBalance(total)
    } 
  }
  
  useEffect(()=>{AccountListFetch();TotalBalanceFetch();},[])
  return (
    <div className="anim-slide-up">
      <h1 className="font-display" style={{ fontSize: "clamp(1.6rem,3vw,2rem)", color: "#e2e8f0", marginBottom: 24 }}>Dashboard Overview</h1>
      <div className="stats-grid" style={{ marginBottom: 32 }}>
        <StatCard label="Total Users"   value={users.length} />
        <StatCard label="Active Accounts" value={activeCount} />
        <StatCard label="Total Balance" value={fmt(totalBalance)} />
        <StatCard label="Transactions"  value={transactions.length} />
      </div>
      <h2 style={{ fontSize: 18, fontWeight: 600, color: "#e2e8f0", marginBottom: 16 }}>Quick Actions</h2>
      <div className="quick-grid">
        <button onClick={onOpenCreateUser} className="action-card" style={{ background: "rgba(15,35,63,0.5)", border: "1px solid rgba(201,168,76,0.2)", borderRadius: 12, padding: 20, textAlign: "left", cursor: "pointer", width: "100%" }}>
          <div style={{ marginBottom: 10 }}><UserPlusIcon /></div>
          <p style={{ fontWeight: 600, color: "#e2e8f0", marginBottom: 4 }}>Create New User</p>
          <p style={{ color: "#94a3b8", fontSize: 13 }}>Add a new customer account</p>
        </button>
        <button onClick={onOpenNewTx} className="action-card" style={{ background: "rgba(15,35,63,0.5)", border: "1px solid rgba(201,168,76,0.2)", borderRadius: 12, padding: 20, textAlign: "left", cursor: "pointer", width: "100%" }}>
          <div style={{ marginBottom: 10 }}><TrendingUpIcon /></div>
          <p style={{ fontWeight: 600, color: "#e2e8f0", marginBottom: 4 }}>New Transaction</p>
          <p style={{ color: "#94a3b8", fontSize: 13 }}>Record deposit or withdrawal</p>
        </button>
      </div>

      <div className="stats-grid" style={{ marginTop: 32, gridTemplateColumns: "repeat(2, 1fr)" }}>
        <StatCard label="Total Deposits"     value={fmt(deposits)}     valueColor="#3b82f6" />
        <StatCard label="Total Withdrawals"  value={fmt(withdrawals)}  valueColor="#f87171" />
      </div>
    </div>
  );
}

// ── Users Tab ─────────────────────────────────────────────────────────────────
function UsersTab({ users, onDelete, onOpenCreate , usersListFetch}) {
  const [search, setSearch] = useState("");
  const filtered = users.filter(u => u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase()));

  const PromoteHandle = async (id,name) => {
  const confirm = window.confirm(`Are you sure you want to promote user, ${name} `);
  if (!confirm) return;
  try {
    const response = await fetch(`http://localhost:5288/api/User/promote/${id}`, {
      method: "PUT"
    });
    if (response.status === 200) {
      alert("User promoted successfully!");
      usersListFetch();
    } else {
      alert("Promotion failed!");
    }
  } catch (error) {
    console.error(error);
    alert("Error occurred!");
  }
};
  return (
    <div className="anim-slide-up">
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24, flexWrap: "wrap", gap: 12 }}>
        <h1 className="font-display" style={{ fontSize: "clamp(1.6rem,3vw,2rem)", color: "#e2e8f0" }}>User Management</h1>
        <button onClick={onOpenCreate} className="btn-gold">+ New User</button>
      </div>
      <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search users…" className="search-input" />
        <button className="btn-gold" style={{ whiteSpace: "nowrap" }}>Search</button>
      </div>
      <div className="table-wrapper">
        <table className="admin-table">
          <thead>
            <tr>{["Name","Email","Role","Account Type"].map(h => <th style={{textAlign:"center"}} key={h}>{h}</th>)}<th colspan="2" style={{textAlign:"center"}}>Action</th></tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr><td colSpan={6} style={{ textAlign: "center", color: "#94a3b8", padding: 32 }}>No users found</td></tr>
            )}
            {filtered.map(u => (
              <tr key={u.userID}>
                <td>{u.name}</td>
                <td style={{ color: "#94a3b8" }}>{u.email}</td>
                <td>{u.role}</td>
                <td>{u.account_type}</td>
                {/* <td><Badge label={u.status} /></td> */}
                <td>
                  <button onClick={() => PromoteHandle(u.userID,u.name)} style={{ background: "none", border: "none", color: "#f87171", fontSize: 12, cursor: "pointer", fontFamily: "inherit" }}>Promote</button>
                </td>
                <td>
                  <button onClick={() => onDelete(u.userID)} style={{ background: "none", border: "none", color: "#f87171", fontSize: 12, cursor: "pointer", fontFamily: "inherit" }}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ── Transactions Tab ──────────────────────────────────────────────────────────
function TransactionsTab({ users, transactions, onDelete, onOpenNew }) {
  const deposits = transactions.filter(t => t.type === "deposit").reduce((s, t) => s + t.amount, 0);
  const withdrawals = transactions.filter(t => t.type === "withdraw").reduce((s, t) => s + t.amount, 0);

  return (
    <div className="anim-slide-up">
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24, flexWrap: "wrap", gap: 12 }}>
        <h1 className="font-display" style={{ fontSize: "clamp(1.6rem,3vw,2rem)", color: "#e2e8f0" }}>Transaction Management</h1>
        <button onClick={onOpenNew} className="btn-gold">+ New Transaction</button>
      </div>
      <div className="stats-grid" style={{ gridTemplateColumns: "repeat(2,1fr)", marginBottom: 24 }}>
        <StatCard label="Total Deposits"    value={fmt(deposits)}    valueColor="#3b82f6" />
        <StatCard label="Total Withdrawals" value={fmt(withdrawals)} valueColor="#f87171" />
      </div>
      <div className="table-wrapper">
        <table className="admin-table">
          <thead>
            <tr>{["User","Type","Amount","Description","Date","Status","Actions"].map(h => <th key={h}>{h}</th>)}</tr>
          </thead>
          <tbody>
            {transactions.length === 0 && (
              <tr><td colSpan={7} style={{ textAlign: "center", color: "#94a3b8", padding: 32 }}>No transactions yet</td></tr>
            )}
            {transactions.map(t => {
              const user = users.find(u => u.userID === t.user_id_ref);
              return (
                <tr key={t.transaction_id}>
                  <td>{user ? user.name : "Unknown"}</td>
                  <td><Badge label={t.type} /></td>
                  <td>{fmt(t.amount)}</td>
                  <td style={{ color: "#94a3b8" }}>{t.description || "—"}</td>
                  <td style={{ color: "#94a3b8" }}>{fmtDate(t.timestamp)}</td>
                  <td><Badge label={t.status} /></td>
                  <td>
                    <button onClick={() => onDelete(t.transaction_id)} style={{ background: "none", border: "none", color: "#f87171", fontSize: 12, cursor: "pointer", fontFamily: "inherit" }}>Delete</button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ── Accounts Tab ──────────────────────────────────────────────────────────────
function AccountsTab({ users, onOpenConnect, onOpenStatus, onOpenFreeze, onEditStatus }) {
  return (
    <div className="anim-slide-up">
      <h1 className="font-display" style={{ fontSize: "clamp(1.6rem,3vw,2rem)", color: "#e2e8f0", marginBottom: 24 }}>Account Management</h1>
      <div className="accounts-action-grid" style={{ marginBottom: 32 }}>
        {[
          { title: "Connect User Account", desc: "Link a user to a bank account", btn: "Connect", color: "#3b82f6", txtColor: "#fff", border: "rgba(59,130,246,0.2)", bg: "rgba(59,130,246,0.08)", onClick: onOpenConnect },
          { title: "Account Status",       desc: "Update account status/tier",    btn: "Update",  color: "#4ade80", txtColor: "#0a192f", border: "rgba(74,222,128,0.2)", bg: "rgba(74,222,128,0.08)", onClick: onOpenStatus },
          { title: "Freeze Account",       desc: "Temporarily suspend account",   btn: "Freeze",  color: "#f87171", txtColor: "#fff",    border: "rgba(248,113,113,0.2)", bg: "rgba(248,113,113,0.08)", onClick: onOpenFreeze },
        ].map(({ title, desc, btn, color, txtColor, border, bg, onClick }) => (
          <div key={title} style={{ padding: 24, borderRadius: 12, border: `1px solid ${border}`, background: `linear-gradient(135deg, rgba(15,35,63,0.9) 0%, ${bg} 100%)` }}>
            <h3 style={{ color: "#e2e8f0", fontWeight: 600, marginBottom: 8 }}>{title}</h3>
            <p style={{ color: "#94a3b8", fontSize: 13, marginBottom: 16 }}>{desc}</p>
            <button onClick={onClick} style={{ width: "100%", padding: "10px 16px", borderRadius: 8, background: color, color: txtColor, border: "none", fontWeight: 600, fontSize: 14, cursor: "pointer", fontFamily: "inherit" }}>{btn}</button>
          </div>
        ))}
      </div>
      <h2 style={{ fontSize: 18, fontWeight: 600, color: "#e2e8f0", marginBottom: 16 }}>Account Connections</h2>
      <div className="table-wrapper">
        <table className="admin-table">
          <thead>
            <tr>{["User","Account Number","Account Type","Status","Created Date","Actions"].map(h => <th key={h}>{h}</th>)}</tr>
          </thead>
          <tbody>
            {users.length === 0 && (
              <tr><td colSpan={6} style={{ textAlign: "center", color: "#94a3b8", padding: 32 }}>No accounts yet</td></tr>
            )}
            {users.map(u => (
              <tr key={u.userID}>
                <td>{u.name}</td>
                <td style={{ color: "#94a3b8", fontFamily: "monospace" }}>{u.userID.toUpperCase().slice(0, 12)}…</td>
                <td>{u.account_type}</td>
                <td><Badge label={u.status} /></td>
                <td style={{ color: "#94a3b8" }}>{fmtDate(u.created_at)}</td>
                <td>
                  <button onClick={() => onEditStatus(u.userID)} style={{ background: "none", border: "none", color: "#3b82f6", fontSize: 12, cursor: "pointer", fontFamily: "inherit" }}>Edit</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────
export default function AdminDashboard() {
    const navigate=useNavigate();
  const [activeTab, setActiveTab]   = useState("dashboard");
  const [users, setUsers]           = useState([]);
  const [transactions, setTrans]    = useState([]);
  const [toast, setToast]           = useState(null);
  const [mobileMenu, setMobileMenu] = useState(false);

  // Modal visibility
  const [modals, setModals] = useState({ createUser: false, newTx: false, connect: false, status: false, freeze: false });
  const openModal  = (k) => setModals(m => ({ ...m, [k]: true  }));
  const closeModal = (k) => setModals(m => ({ ...m, [k]: false }));

  // Form state
  const [createForm, setCreateForm] = useState({ name: "", email: "", phone: "", type: "", balance: "" });
  const [txForm,     setTxForm]     = useState({ userId: "", type: "", amount: "", desc: "" , accountNumber :""});
  const [connForm,   setConnForm]   = useState({ userId: "", accountNum: "", accountType: "" });
  const [statusForm, setStatusForm] = useState({ userId: "", status: "" });
  const [freezeForm, setFreezeForm] = useState({ userId: "", reason: "" });
    const [txLoading, setTxLoading] = useState(false);
  


  const usersListFetch=async()=>{
    const response = await fetch('http://localhost:5288/api/User',{method:"GET"});
    if(response.status==200){
        const userList = await response.json();
        setUsers(userList);
    }else{
        console.log("No User Found");
    }
  }
  const transactionAmount = async () =>{
    const response = await fetch("http://localhost:5288/api/Transaction",{method:"GET"})
    if(response.status==200){
        const res = await response.json();
        setTrans(res);
    }
  }
  const showToast = useCallback((msg, type = "info") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  }, []);

  // ── Handlers ──
  const handleCreateUser = async(e) => {
    e.preventDefault();
    const newUser = {
      userID: txForm.userId,
      account_type: createForm.type,
      account_balance: parseFloat(createForm.balance) || 0,
      status: "Active",
      created_at: new Date().toISOString(),
    };
    console.log(newUser)
    const response = await fetch("http://localhost:5288/api/Account",{method:"POST",headers:{'Content-Type': 'application/json',},body: JSON.stringify({
      userID:newUser.userID,
      type:newUser.account_type,
      amount:newUser.account_balance,
      status:newUser.status,
    })})
    if(response.status==201) {
      console.log(response);
      closeModal("createUser");
      showToast("Account created successfully!", "success");
    }else{
      console.log(response);
    }
};

  const handleNewTx = async (e) => {
    e.preventDefault();

    // ── Validate form ──
    if (!txForm.userId || !txForm.type || !txForm.amount || !txForm.accountNumber) {
      showToast("Please fill in all required fields", "error");
      return;
    }

    const amount = parseFloat(txForm.amount);
    if (amount <= 0) {
      showToast("Amount must be greater than zero", "error");
      return;
    }

    // ── Prepare request body ──
    const createTransactionDto = {
      senderId: parseInt(txForm.userId),
      receiverId: txForm.accountNumber,
      amount: amount,
      type: txForm.type.toLowerCase(), // "deposit" or "withdraw" (lowercase)
      description: txForm.desc || null,
    };

    try {
      setTxLoading(true);
      const response = await fetch("http://localhost:5288/api/Transaction", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(createTransactionDto),
      });

      if (response.status === 201) {
        // ── Transaction created successfully ──
        const createdTx = await response.json();
        
        // Refresh transaction list
        await transactionAmount();
        
        // Reset form
        setTxForm({ userId: "", type: "", amount: "", desc: "", accountNumber: "" });
        closeModal("newTx");
        setTxLoading(false);
        showToast("Transaction created successfully!", "success");
      } else if (response.status === 400) {
        const errorData = await response.json();
        showToast(errorData.message || "Invalid transaction details", "error");
      } else if (response.status === 404) {
        const errorData = await response.json();
        showToast(errorData.message || "Account not found", "error");
      } else {
        showToast("Failed to create transaction", "error");
      }
    } catch (error) {
      console.error("Transaction error:", error);
      showToast("Error: " + error.message, "error");
    }
  };

  const handleConnect = (e) => {
    e.preventDefault();
    closeModal("connect");
    setConnForm({ userId: "", accountNum: "", accountType: "" });
    showToast("Account connected successfully!", "success");
  };

  const handleStatus = (e) => {
    e.preventDefault();
    setUsers(prev => prev.map(u => u.userID === statusForm.userId ? { ...u, status: statusForm.status } : u));
    closeModal("status");
    setStatusForm({ userId: "", status: "" });
    showToast("Status updated successfully!", "success");
  };

  const handleFreeze = (e) => {
    e.preventDefault();
    setUsers(prev => prev.map(u => u.userID === freezeForm.userId ? { ...u, status: "Inactive" } : u));
    closeModal("freeze");
    setFreezeForm({ userId: "", reason: "" });
    showToast("Account frozen successfully!", "success");
  };

  const deleteUser = (id) => {
    setUsers(u => u.filter(x => x.userID !== id));
    showToast("User deleted successfully!", "success");
  };

  const deleteTx = (id) => {
    setTrans(t => t.filter(x => x.transaction_id !== id));
    showToast("Transaction deleted!", "success");
  };

  const editUserStatus = (userId) => {
    setStatusForm(f => ({ ...f, userId }));
    openModal("status");
  };

  const TABS = [
    { key: "dashboard",    label: "Dashboard"        },
    { key: "users",        label: "Users"            },
    { key: "transactions", label: "Transactions"     },
  ];

  useEffect(()=>{
    usersListFetch();
    transactionAmount();
  },[])

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'Plus Jakarta Sans', sans-serif; background: #0a192f; }
        .font-display { font-family: 'DM Serif Display', serif; }

        .gold-shimmer { height: 1px; background: linear-gradient(90deg, transparent, #c9a84c, #e8d48b, #c9a84c, transparent); background-size: 200% 100%; animation: shimmer 3s ease-in-out infinite; }
        @keyframes shimmer   { 0%   { background-position: -200% 0; } 100% { background-position: 200% 0; } }
        @keyframes fadeIn    { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideUp   { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes slideDown { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }

        .anim-slide-up   { animation: slideUp   0.6s ease-out both; }
        .anim-slide-down { animation: slideDown  0.5s ease-out; }
        .anim-fade-in    { animation: fadeIn     0.6s ease-out; }

        .btn-gold { background: #c9a84c; color: #0a192f; border: none; padding: 10px 18px; border-radius: 8px; font-weight: 600; font-size: 14px; cursor: pointer; font-family: inherit; transition: transform 0.2s, box-shadow 0.2s; }
        .btn-gold:hover { transform: translateY(-2px); box-shadow: 0 8px 25px rgba(201,168,76,0.35); }

        .action-card { transition: transform 0.2s ease; }
        .action-card:hover { transform: translateY(-4px); }

        .tab-btn { padding: 10px 18px; border-radius: 8px; font-weight: 500; font-size: 14px; border: none; cursor: pointer; font-family: inherit; white-space: nowrap; transition: all 0.2s; }
        .tab-btn.active   { background: #c9a84c; color: #0a192f; }
        .tab-btn.inactive { background: transparent; color: #94a3b8; }
        .tab-btn.inactive:hover { color: #e2e8f0; }

        .table-wrapper { overflow-x: auto; border-radius: 12px; border: 1px solid rgba(201,168,76,0.2); }
        .admin-table { width: 100%; border-collapse: collapse; min-width: 600px; }
        .admin-table th { background: rgba(15,35,63,0.8); padding: 14px 16px; text-align: left; font-weight: 600; color: #e2e8f0; font-size: 13px; border-bottom: 1px solid rgba(201,168,76,0.2); white-space: nowrap; }
        .admin-table td { padding: 13px 16px; border-bottom: 1px solid rgba(201,168,76,0.08); color: #e2e8f0; font-size: 13px; }
        .admin-table tr:last-child td { border-bottom: none; }
        .admin-table tr:hover td { background: rgba(15,35,63,0.4); }

        .form-input, .form-select { width: 100%; padding: 12px 16px; border: 1px solid rgba(201,168,76,0.3); border-radius: 8px; background: rgba(15,35,63,0.5); color: #e2e8f0; font-size: 14px; font-family: inherit; outline: none; transition: border-color 0.2s, box-shadow 0.2s; }
        .form-input:focus, .form-select:focus { border-color: #c9a84c; box-shadow: 0 0 0 3px rgba(201,168,76,0.1); }
        .form-select option { background: #0f233f; }

        .search-input { flex: 1; padding: 10px 16px; border: 1px solid rgba(201,168,76,0.3); border-radius: 8px; background: rgba(15,35,63,0.5); color: #e2e8f0; font-size: 14px; font-family: inherit; outline: none; }
        .search-input:focus { border-color: #c9a84c; }
        .search-input::placeholder { color: #475569; }

        /* ── Responsive grids ── */
        .stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; }
        .quick-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; }
        .accounts-action-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; }
        .main-content { padding: 32px 48px; }
        .nav-inner { padding: 14px 48px; }
        .hamburger { display: none !important; }
        .desktop-nav { display: flex; }

        @media (max-width: 1024px) {
          .stats-grid { grid-template-columns: repeat(2, 1fr); }
          .accounts-action-grid { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 768px) {
          .nav-inner { padding: 14px 20px; }
          .desktop-nav { display: none !important; }
          .hamburger { display: flex !important; align-items: center; justify-content: center; }
          .main-content { padding: 24px 20px; }
          .stats-grid { grid-template-columns: repeat(2, 1fr); }
          .quick-grid { grid-template-columns: 1fr; }
          .accounts-action-grid { grid-template-columns: 1fr; }
          .tab-btn { font-size: 13px; padding: 9px 14px; }
        }
        @media (max-width: 480px) {
          .main-content { padding: 16px; }
          .stats-grid { grid-template-columns: 1fr 1fr; gap: 10px; }
          .nav-inner { padding: 12px 16px; }
        }
      `}</style>

      <div style={{ minHeight: "100vh", backgroundColor: "#0a192f", backgroundImage: "radial-gradient(circle at 20% 50%, rgba(201,168,76,0.06) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(201,168,76,0.04) 0%, transparent 40%)" }}>

        {/* ── Header ── */}
        <header className="anim-slide-down" style={{ position: "sticky", top: 0, zIndex: 50, background: "rgba(10,25,47,0.95)", backdropFilter: "blur(10px)" }}>
          <nav className="nav-inner" style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            {/* Logo */}
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ background: "#c9a84c", width: 40, height: 40, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <ShieldIcon />
              </div>
              <div>
                <div className="font-display" style={{ fontSize: 18, fontWeight: 700, color: "#e2e8f0" }}>Apex Bank</div>
                <div style={{ fontSize: 11, color: "#94a3b8" }}>Admin Dashboard</div>
              </div>
            </div>

            {/* Desktop actions */}
            <div className="desktop-nav" style={{ gap: 12 }}>
              <button style={{ display: "flex", alignItems: "center", gap: 8, background: "rgba(201,168,76,0.1)", color: "#c9a84c", border: "none", padding: "8px 14px", borderRadius: 8, cursor: "pointer" }}>
                <BellIcon />
              </button>
              <button onClick={()=>navigate('/')} style={{ display: "flex", alignItems: "center", gap: 8, background: "rgba(201,168,76,0.1)", color: "#c9a84c", border: "none", padding: "8px 16px", borderRadius: 8, fontSize: 14, fontWeight: 500, cursor: "pointer", fontFamily: "inherit" }}>
                <LogOutIcon /> Logout
              </button>
            </div>

            {/* Hamburger */}
            <button className="hamburger" onClick={() => setMobileMenu(o => !o)} style={{ background: "none", border: "none", cursor: "pointer", padding: 4 }}>
              {mobileMenu
                ? <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#e2e8f0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                : <MenuIcon />}
            </button>
          </nav>

          {/* Mobile dropdown */}
          {mobileMenu && (
            <div style={{ background: "rgba(10,25,47,0.98)", borderTop: "1px solid rgba(201,168,76,0.15)", padding: "12px 20px 20px", display: "flex", flexDirection: "column", gap: 4 }}>
              {TABS.map(({ key, label }) => (
                <button key={key} onClick={() => { setActiveTab(key); setMobileMenu(false); }}
                  style={{ background: activeTab === key ? "rgba(201,168,76,0.12)" : "none", border: "none", color: activeTab === key ? "#c9a84c" : "#94a3b8", fontSize: 15, fontWeight: 500, padding: "12px 16px", borderRadius: 8, textAlign: "left", cursor: "pointer", fontFamily: "inherit" }}>
                  {label}
                </button>
              ))}
              <div style={{ borderTop: "1px solid rgba(148,163,184,0.1)", marginTop: 8, paddingTop: 12, display: "flex", gap: 10 }}>
                <button style={{ display: "flex", alignItems: "center", gap: 6, background: "rgba(201,168,76,0.1)", color: "#c9a84c", border: "none", padding: "10px 16px", borderRadius: 8, fontSize: 14, fontWeight: 500, cursor: "pointer", fontFamily: "inherit" }}>
                  <BellIcon />
                </button>
                <button style={{ display: "flex", alignItems: "center", gap: 8, background: "rgba(201,168,76,0.1)", color: "#c9a84c", border: "none", padding: "10px 16px", borderRadius: 8, fontSize: 14, fontWeight: 500, cursor: "pointer", fontFamily: "inherit" }}>
                  <LogOutIcon /> Logout
                </button>
              </div>
            </div>
          )}

          <GoldLine />
        </header>

        {/* ── Main ── */}
        <main className="main-content">
          {/* Tab bar */}
          <div className="anim-fade-in" style={{ display: "flex", gap: 8, marginBottom: 32, overflowX: "auto", paddingBottom: 4 }}>
            {TABS.map(({ key, label }) => (
              <button key={key} className={`tab-btn ${activeTab === key ? "active" : "inactive"}`} onClick={() => setActiveTab(key)}>{label}</button>
            ))}
          </div>

          {activeTab === "dashboard"    && <DashboardTab users={users} transactions={transactions} onOpenCreateUser={() => openModal("createUser")} onOpenNewTx={() => openModal("newTx")} />}
          {activeTab === "users"        && <UsersTab users={users} onDelete={deleteUser} onOpenCreate={() => openModal("createUser")} usersListFetch={usersListFetch} />}
          {activeTab === "transactions" && <TransactionsTab users={users} transactions={transactions} onDelete={deleteTx} onOpenNew={() => openModal("newTx")} />}
          {activeTab === "accounts"     && <AccountsTab users={users} onOpenConnect={() => openModal("connect")} onOpenStatus={() => openModal("status")} onOpenFreeze={() => openModal("freeze")} onEditStatus={editUserStatus} />}
        </main>
      </div>

      {/* ── Create User Modal ── */}
      <Modal show={modals.createUser} onClose={() => closeModal("createUser")} title="Create New User">
        <form onSubmit={handleCreateUser}>
          <Field label="Select Email">
            <select className="form-select" required value={txForm.userId} onChange={e => setTxForm(f => ({ ...f, userId: e.target.value }))}>
              <option value="">Choose a user…</option>
              {users.map(u => u.role=="user" ? <option key={u.userID} value={u.userID}>{u.email}</option>:"")}
            </select>
          </Field>
          <Field label="Account Type">
            <select className="form-select" required value={createForm.type} onChange={e => setCreateForm(f => ({ ...f, type: e.target.value }))}>
              <option value="">Select Account Type</option>
              {["normal","premium","business"].map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </Field>
          <Field label="Initial Balance"><input className="form-input" type="number" required placeholder="0.00" min="0" step="0.01" value={createForm.balance} onChange={e => setCreateForm(f => ({ ...f, balance: e.target.value }))} /></Field>
          <button type="submit" className="btn-gold" style={{ width: "100%", padding: "14px", borderRadius: 8, fontSize: 15, marginTop: 4 }}>Create User</button>
        </form>
      </Modal>

      {/* ── New Transaction Modal ── */}
      <Modal show={modals.newTx} onClose={() => closeModal("newTx")} title="New Transaction">
        <form onSubmit={handleNewTx}>
          <Field label="Sender (User)">
            <select className="form-select" required value={txForm.userId} onChange={e => setTxForm(f => ({ ...f, userId: e.target.value }))}>
              <option value="">Select sender…</option>
              {users.map(u => <option key={u.userID} value={u.userID}>{u.name} ({u.email})</option>)}
            </select>
          </Field>
          <Field label="Recipient Account Number">
            <label style={{ color: "#94a3b8", fontSize: 12, display: "block", marginBottom: 6 }}>
              Recipient Account # <span style={{ color: "#f87171" }}>*</span>
            </label>
            <input
              type="text"
              placeholder="e.g. 1234 5678"
              value={txForm.accountNumber}
              onChange={e => setTxForm(f => ({ ...f, accountNumber: e.target.value }))}
              style={{
                width: "100%", padding: "10px 14px",
                background: "#0a192f",
                border: "1px solid rgba(201,168,76,0.2)",
                borderRadius: 8, color: "#e2e8f0", fontSize: 14,
                outline: "none", boxSizing: "border-box",
              }}
            />
          </Field>
          <Field label="Transaction Type">
            <select className="form-select" required value={txForm.type} onChange={e => setTxForm(f => ({ ...f, type: e.target.value }))}>
              <option value="">Select Type</option>
              <option value="Deposit">Deposit</option>
              <option value="Withdraw">Withdraw</option>
            </select>
          </Field>
          <Field label="Amount"><input className="form-input" type="number" required placeholder="0.00" min="0.01" step="0.01" value={txForm.amount} onChange={e => setTxForm(f => ({ ...f, amount: e.target.value }))} /></Field>
          <Field label="Description"><input className="form-input" placeholder="Transaction description (optional)" value={txForm.desc} onChange={e => setTxForm(f => ({ ...f, desc: e.target.value }))} /></Field>
          <button type="submit" className="btn-gold" style={{ width: "100%", padding: "14px", borderRadius: 8, fontSize: 15, marginTop: 4 }}>{txLoading ? "Creating Transaction..." : "Create Transaction"}</button>
        </form>
      </Modal>

      {/* ── Connect Account Modal ── */}
      <Modal show={modals.connect} onClose={() => closeModal("connect")} title="Connect User to Account">
        <form onSubmit={handleConnect}>
          <Field label="Select User">
            <select className="form-select" required value={connForm.userId} onChange={e => setConnForm(f => ({ ...f, userId: e.target.value }))}>
              <option value="">Choose a user…</option>
              {users.map(u => <option key={u.userID} value={u.userID}>{u.name}</option>)}
            </select>
          </Field>
          <Field label="Account Number"><input className="form-input" required placeholder="1234 5678 9012 3456" value={connForm.accountNum} onChange={e => setConnForm(f => ({ ...f, accountNum: e.target.value }))} /></Field>
          <Field label="Account Type">
            <select className="form-select" required value={connForm.accountType} onChange={e => setConnForm(f => ({ ...f, accountType: e.target.value }))}>
              <option value="">Select Type</option>
              {["Checking","Savings","Business"].map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </Field>
          <button type="submit" className="btn-gold" style={{ width: "100%", padding: "14px", borderRadius: 8, fontSize: 15, marginTop: 4 }}>Connect Account</button>
        </form>
      </Modal>

      {/* ── Account Status Modal ── */}
      <Modal show={modals.status} onClose={() => closeModal("status")} title="Update Account Status">
        <form onSubmit={handleStatus}>
          <Field label="Select User">
            <select className="form-select" required value={statusForm.userId} onChange={e => setStatusForm(f => ({ ...f, userId: e.target.value }))}>
              <option value="">Choose a user…</option>
              {users.map(u => <option key={u.userID} value={u.userID}>{u.name}</option>)}
            </select>
          </Field>
          <Field label="Status">
            <select className="form-select" required value={statusForm.status} onChange={e => setStatusForm(f => ({ ...f, status: e.target.value }))}>
              <option value="">Select Status</option>
              {["Active","Inactive","Pending"].map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </Field>
          <button type="submit" className="btn-gold" style={{ width: "100%", padding: "14px", borderRadius: 8, fontSize: 15, marginTop: 4 }}>Update Status</button>
        </form>
      </Modal>

      {/* ── Freeze Account Modal ── */}
      <Modal show={modals.freeze} onClose={() => closeModal("freeze")} title="Freeze Account">
        <form onSubmit={handleFreeze}>
          <Field label="Select User">
            <select className="form-select" required value={freezeForm.userId} onChange={e => setFreezeForm(f => ({ ...f, userId: e.target.value }))}>
              <option value="">Choose a user…</option>
              {users.map(u => <option key={u.userID} value={u.userID}>{u.name}</option>)}
            </select>
          </Field>
          <Field label="Reason"><input className="form-input" required placeholder="Suspension reason" value={freezeForm.reason} onChange={e => setFreezeForm(f => ({ ...f, reason: e.target.value }))} /></Field>
          <button type="submit" style={{ width: "100%", padding: "14px", borderRadius: 8, background: "#f87171", color: "#fff", border: "none", fontWeight: 600, fontSize: 15, cursor: "pointer", fontFamily: "inherit", marginTop: 4 }}>Freeze Account</button>
        </form>
      </Modal>

      {toast && <Toast msg={toast.msg} type={toast.type} />}
    </>
  );
}

