    import { useState, useMemo , useEffect} from "react";

    // ── SVG Icons ─────────────────────────────────────────────────────────────────
    const TrendingUpIcon = () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#0a192f" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
        <polyline points="17 6 23 6 23 12" />
    </svg>
    );
    const InboxIcon = () => (
    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="22 12 16 12 14 15 10 15 8 12 2 12" />
        <path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z" />
    </svg>
    );
    const FilterIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
    </svg>
    );
    const RefreshIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="1 4 1 10 7 10" />
        <path d="M3.51 15a9 9 0 1 0 .49-4.95" />
    </svg>
    );

    // ── Seed Data ─────────────────────────────────────────────────────────────────


    // ── Helpers ───────────────────────────────────────────────────────────────────
    const fmt = (n) => `$${Math.abs(n).toFixed(2)}`;
    const fmtDateTime = (s) => {
    const d = new Date(s);
    return d.toLocaleDateString() + " " + d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    };

    // ── Badge ─────────────────────────────────────────────────────────────────────
    const BADGE_STYLES = {
    deposit:   { bg: "rgba(59,130,246,0.2)",  color: "#3b82f6" },
    withdraw:  { bg: "rgba(248,113,113,0.2)", color: "#f87171" },
    pending:   { bg: "rgba(201,168,76,0.2)",  color: "#c9a84c" },
    completed: { bg: "rgba(74,222,128,0.2)",  color: "#4ade80" },
    };
    function Badge({ label }) {
    const s = BADGE_STYLES[label?.toLowerCase()] || BADGE_STYLES.pending;
    return (
        <span style={{ display: "inline-block", padding: "5px 12px", borderRadius: 20, fontSize: 12, fontWeight: 600, background: s.bg, color: s.color }}>
        {label}
        </span>
    );
    }

    // ── GoldLine ──────────────────────────────────────────────────────────────────
    function GoldLine() {
    return <div className="gold-shimmer" />;
    }

    // ── Toast ─────────────────────────────────────────────────────────────────────
    function Toast({ msg, type }) {
    if (!msg) return null;
    const c = { success: { bg: "#4ade80", color: "#0a192f" }, error: { bg: "#f87171", color: "#fff" }, info: { bg: "#3b82f6", color: "#fff" } }[type] || { bg: "#3b82f6", color: "#fff" };
    return (
        <div style={{ position: "fixed", bottom: 24, right: 24, zIndex: 200, background: c.bg, color: c.color, padding: "16px 24px", borderRadius: 8, fontWeight: 500, fontSize: 14, animation: "slideUp 0.4s ease-out" }}>
        {msg}
        </div>
    );
    }

    // ── Stat Card ─────────────────────────────────────────────────────────────────
    function StatCard({ label, value, valueColor = "#c9a84c" }) {
    return (
        <div style={{ padding: 24, borderRadius: 12, background: "linear-gradient(135deg,rgba(15,35,63,0.9) 0%,rgba(201,168,76,0.08) 100%)", border: "1px solid rgba(201,168,76,0.2)", textAlign: "center" }}>
        <div style={{ color: "#94a3b8", fontSize: 13, marginBottom: 8 }}>{label}</div>
        <div style={{ fontSize: 28, fontWeight: 700, color: valueColor }}>{value}</div>
        </div>
    );
    }

    // ── Filter Panel ──────────────────────────────────────────────────────────────
    function FilterPanel({ filters, onChange, onReset }) {
    const inputStyle = {
        width: "100%", padding: "11px 14px",
        border: "1px solid rgba(201,168,76,0.3)", borderRadius: 8,
        background: "rgba(15,35,63,0.5)", color: "#e2e8f0",
        fontSize: 14, fontFamily: "inherit", outline: "none",
    };

    
    return (
        <div style={{ padding: 24, borderRadius: 12, marginBottom: 28, background: "linear-gradient(135deg,rgba(15,35,63,0.9) 0%,rgba(59,130,246,0.08) 100%)", border: "1px solid rgba(59,130,246,0.2)" }}>
        <h2 style={{ fontSize: 17, fontWeight: 600, color: "#e2e8f0", marginBottom: 20 }}>Filter Transactions</h2>

        <div className="filter-grid">
            {/* Type */}
            <div>
            <label style={{ display: "block", fontWeight: 500, marginBottom: 8, color: "#e2e8f0", fontSize: 14 }}>Transaction Type</label>
            <select className="apex-select" value={filters.type} onChange={e => onChange("type", e.target.value)} style={inputStyle}>
                <option value="">All Types</option>
                <option value="Deposit">Deposit</option>
                <option value="Withdraw">Withdraw</option>
                <option value="transfer">Transfer</option>
            </select>
            </div>
            
            {/* Amount Range */}
            <div>
            <label style={{ display: "block", fontWeight: 500, marginBottom: 8, color: "#e2e8f0", fontSize: 14 }}>Amount Range</label>
            <select className="apex-select" value={filters.amountRange} onChange={e => onChange("amountRange", e.target.value)} style={inputStyle}>
                <option value="">All Amounts</option>
                <option value="0-100">$0 – $100</option>
                <option value="100-1000">$100 – $1,000</option>
                <option value="1000-10000">$1,000 – $10,000</option>
                <option value="10000+">$10,000+</option>
            </select>
            </div>

            {/* Start Date */}
            <div>
            <label style={{ display: "block", fontWeight: 500, marginBottom: 8, color: "#e2e8f0", fontSize: 14 }}>Start Date</label>
            <input type="date" className="apex-input" value={filters.startDate} onChange={e => onChange("startDate", e.target.value)} style={{ ...inputStyle, colorScheme: "dark" }} />
            </div>

            {/* End Date */}
            <div>
            <label style={{ display: "block", fontWeight: 500, marginBottom: 8, color: "#e2e8f0", fontSize: 14 }}>End Date</label>
            <input type="date" className="apex-input" value={filters.endDate} onChange={e => onChange("endDate", e.target.value)} style={{ ...inputStyle, colorScheme: "dark" }} />
            </div>

            
        </div>

        {/* Search row */}
        <div style={{ display: "flex", gap: 10, marginTop: 20, flexWrap: "wrap" }}>
            <input
            type="text"
            placeholder="Search by user name or description…"
            value={filters.search}
            onChange={e => onChange("search", e.target.value)}
            className="apex-input"
            style={{ ...inputStyle, flex: 1, minWidth: 200 }}
            />
            <button
            style={{ display: "flex", alignItems: "center", gap: 6, background: "#3b82f6", color: "#fff", border: "none", padding: "11px 18px", borderRadius: 8, fontWeight: 500, fontSize: 14, cursor: "pointer", fontFamily: "inherit", whiteSpace: "nowrap" }}
            >
            <FilterIcon /> Apply Filters
            </button>
            <button
            onClick={onReset}
            style={{ display: "flex", alignItems: "center", gap: 6, background: "rgba(201,168,76,0.2)", color: "#c9a84c", border: "none", padding: "11px 18px", borderRadius: 8, fontWeight: 500, fontSize: 14, cursor: "pointer", fontFamily: "inherit", whiteSpace: "nowrap" }}
            >
            <RefreshIcon /> Reset
            </button>
        </div>
        </div>
    );
    }

    // ── Transactions Table ────────────────────────────────────────────────────────
    function TransactionsTable({ transactions }) {
    if (transactions.length === 0) {
        return (
        <div style={{ textAlign: "center", padding: "56px 20px" }}>
            <div style={{ display: "flex", justifyContent: "center", marginBottom: 16 }}><InboxIcon /></div>
            <p style={{ color: "#94a3b8", fontSize: 16 }}>No transactions match your filters</p>
        </div>
        );
    }

    function getCDate(date1){
        const finalDate= new Date(date1);
        return `${finalDate.getDate()}-${finalDate.getMonth()+1}-${finalDate.getFullYear()}`;
        }

    return (
        <div style={{ overflowX: "auto", borderRadius: 12, border: "1px solid rgba(201,168,76,0.2)" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 640 }}>
            <thead>
            <tr>
                {["Date & Time", "Type", "Amount", "Description", "Status"].map(h => (
                <th key={h} style={{ background: "rgba(15,35,63,0.8)", padding: "14px 16px", textAlign: "left", fontWeight: 600, color: "#e2e8f0", fontSize: 13, borderBottom: "1px solid rgba(201,168,76,0.2)", whiteSpace: "nowrap" }}>{h}</th>
                ))}
            </tr>
            </thead>
            <tbody>
            {transactions.map((tx, i) => {
                const isDeposit = tx.type === "deposit" || (tx.type === "transfer" && tx.receiverId==localStorage.getItem("authUser"));
                return (
                <tr key={tx.transactionID} className="table-row">
                    <td style={{ padding: "13px 16px", borderBottom: i < transactions.length - 1 ? "1px solid rgba(201,168,76,0.08)" : "none", color: "#94a3b8", fontSize: 13, whiteSpace: "nowrap" }}>
                    {(getCDate(tx.createdAt))}
                    </td>
                    <td style={{ padding: "13px 16px", borderBottom: i < transactions.length - 1 ? "1px solid rgba(201,168,76,0.08)" : "none" }}>
                    <Badge label={tx.type} />
                    </td>
                    <td style={{ padding: "13px 16px", borderBottom: i < transactions.length - 1 ? "1px solid rgba(201,168,76,0.08)" : "none", fontWeight: 700, fontSize: 14, color: isDeposit ? "#3b82f6" : "#f87171" }}>
                    {isDeposit ? "+" : "−"}{fmt(tx.amount)}
                    </td>
                    <td style={{ padding: "13px 16px", borderBottom: i < transactions.length - 1 ? "1px solid rgba(201,168,76,0.08)" : "none", color: "#94a3b8", fontSize: 13 }}>
                    {tx.description || "—"}
                    </td>
                    <td style={{ padding: "13px 16px", borderBottom: i < transactions.length - 1 ? "1px solid rgba(201,168,76,0.08)" : "none" }}>
                    <Badge label={tx.status || "Pending"} />
                    </td>
                </tr>
                );
            })}
            </tbody>
        </table>
        </div>
    );
    }

    // ── Main Component ────────────────────────────────────────────────────────────
    export default function TransactionList() {
    const [transactions,setTransaction] = useState([]);
    const [txLoading,setTxLoading] = useState(null)
    const [toast, setToast] = useState(null);

    const [filters, setFilters] = useState({
        type: "", startDate: "", endDate: "", amountRange: "", search: "",
    });

    const handleFilterChange = (key, value) => setFilters(f => ({ ...f, [key]: value }));

    const handleReset = () => setFilters({ type: "", startDate: "", endDate: "", amountRange: "", search: "" });

    // ── Derived: filtered + sorted transactions ──

    const fetchUserTransactions = async (id)=>{
        try{
            setTxLoading(true);
            const response = await fetch(`http://localhost:5288/api/Transaction/by-userID/${id}`,{method:"GET"});
            if(response.status==200){
                const transaction= await response.json();
                setTransaction(transaction);
                console.log(transaction)
                setTxLoading(false);
            }else{
                setTransaction([]);
                setTxLoading(false);
            } 
        }catch(error){
            setTxLoading(false);
            console.log(error);
        }
    }

    const filtered = useMemo(() => {
        let result = transactions.filter(tx => {
        // Type
        if (filters.type && tx.type.toLowerCase() !== filters.type.toLowerCase()) return false;

        // Date range
        if (filters.startDate || filters.endDate) {
            const txDate = new Date(tx.createAt);
            if (filters.startDate && txDate < new Date(filters.startDate)) return false;
            if (filters.endDate) {
            const end = new Date(filters.endDate);
            end.setHours(23, 59, 59, 999);
            if (txDate > end) return false;
            }
        }

        // Amount range
        if (filters.amountRange) {
            const a = tx.amount;
            switch (filters.amountRange) {
            case "0-100":       if (a > 100)              return false; break;
            case "100-1000":    if (a <= 100 || a > 1000) return false; break;
            case "1000-10000":  if (a <= 1000 || a > 10000) return false; break;
            case "10000+":      if (a <= 10000)            return false; break;
            }
        }

        

        return true;
        });

        // Sort newest first
        return result.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    }, [transactions, filters]);

    // ── Derived: summary stats ──
    const stats = useMemo(() => {
        const deposits    = filtered.filter(t => t.type === "deposit").reduce((s, t) => s + t.amount, 0);
        const withdrawals = filtered.filter(t => t.type === "withdraw").reduce((s, t) => s + t.amount, 0);
        const send = filtered.filter(t => t.type === "transfer" && t.senderId==localStorage.getItem("authUser")).reduce((s, t) => s + t.amount, 0);
        const receive = filtered.filter(t => t.type === "transfer" && t.receiverId==localStorage.getItem("authUser")).reduce((s, t) => s + t.amount, 0);
        const net         = deposits + receive - withdrawals - send;
        return { count: filtered.length, deposits, withdrawals, receive , send, net };
    }, [filtered]);

    useEffect(()=>{
        fetchUserTransactions(localStorage.getItem("authUser"));
    },[])
    return (
        <>
        <style>{`
            @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');
            *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
            body { font-family: 'Plus Jakarta Sans', sans-serif; background: #0a192f; }
            .font-display { font-family: 'DM Serif Display', serif; }

            .gold-shimmer { height:1px; background:linear-gradient(90deg,transparent,#c9a84c,#e8d48b,#c9a84c,transparent); background-size:200% 100%; animation:shimmer 3s ease-in-out infinite; }
            @keyframes shimmer   { 0% { background-position:-200% 0; } 100% { background-position:200% 0; } }
            @keyframes fadeIn    { from { opacity:0; } to { opacity:1; } }
            @keyframes slideUp   { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }
            @keyframes slideDown { from { opacity:0; transform:translateY(-10px); } to { opacity:1; transform:translateY(0); } }

            .anim-slide-up   { animation:slideUp   0.6s ease-out both; }
            .anim-slide-down { animation:slideDown  0.5s ease-out; }
            .anim-fade-in    { animation:fadeIn     0.6s ease-out; }

            .apex-input:focus, .apex-select:focus { border-color:#c9a84c !important; box-shadow:0 0 0 3px rgba(201,168,76,0.1); outline:none; }
            .apex-input::placeholder { color:#475569; }
            .apex-select option { background:#0f233f; }

            .table-row:hover td { background:rgba(15,35,63,0.5); }

            /* ── Responsive grids ── */
            .filter-grid  { display:grid; grid-template-columns:repeat(4,1fr); gap:16px; }
            .stats-grid   { display:grid; grid-template-columns:repeat(4,1fr); gap:16px; margin-bottom:28px; }
            .main-pad     { padding:32px 48px; }
            .nav-pad      { padding:14px 48px; }

            @media (max-width:1024px) {
            .filter-grid { grid-template-columns:repeat(2,1fr); }
            .stats-grid  { grid-template-columns:repeat(2,1fr); }
            }
            @media (max-width:768px) {
            .main-pad { padding:24px 20px; }
            .nav-pad  { padding:14px 20px; }
            .filter-grid { grid-template-columns:1fr; }
            .stats-grid  { grid-template-columns:repeat(2,1fr); }
            }
            @media (max-width:480px) {
            .main-pad { padding:16px; }
            .nav-pad  { padding:12px 16px; }
            .stats-grid { grid-template-columns:1fr 1fr; gap:10px; }
            }
        `}</style>

        <div style={{
            minHeight: "100vh",
            backgroundColor: "#0a192f",
            backgroundImage: "radial-gradient(circle at 20% 50%,rgba(201,168,76,0.06) 0%,transparent 50%),radial-gradient(circle at 80% 20%,rgba(201,168,76,0.04) 0%,transparent 40%),radial-gradient(circle at 60% 80%,rgba(10,25,47,0.03) 0%,transparent 40%)",
        }}>

            {/* ── Header ── */}
            <header className="anim-slide-down" style={{ position: "sticky", top: 0, zIndex: 50, background: "rgba(10,25,47,0.95)", backdropFilter: "blur(10px)" }}>
            <nav className="nav-pad" style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ background: "#c9a84c", width: 40, height: 40, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <TrendingUpIcon />
                </div>
                <div>
                    <div className="font-display" style={{ fontSize: 18, fontWeight: 700, color: "#e2e8f0" }}>Transaction Manager</div>
                    <div style={{ fontSize: 11, color: "#94a3b8" }}>Real-time Transaction Tracking</div>
                </div>
                </div>

                {/* Live filter badge */}
                {(filters.type || filters.startDate || filters.endDate || filters.amountRange || filters.search) && (
                <div style={{ display: "flex", alignItems: "center", gap: 8, background: "rgba(201,168,76,0.15)", border: "1px solid rgba(201,168,76,0.3)", borderRadius: 20, padding: "6px 14px" }}>
                    <FilterIcon />
                    <span style={{ color: "#c9a84c", fontSize: 13, fontWeight: 600 }}>Filters active</span>
                    <button onClick={handleReset} style={{ background: "none", border: "none", color: "#c9a84c", cursor: "pointer", fontSize: 16, lineHeight: 1, padding: "0 0 0 4px" }}>×</button>
                </div>
                )}
            </nav>
            <GoldLine />
            </header>

            {/* ── Main ── */}
            <main className="main-pad">
            <div style={{ maxWidth: 1200, margin: "0 auto" }}>

                {/* Page heading */}
                <div className="anim-slide-up" style={{ marginBottom: 28 }}>
                <h1 className="font-display" style={{ fontSize: "clamp(1.6rem,3vw,2rem)", color: "#e2e8f0", marginBottom: 6 }}>
                    Transaction List
                </h1>
                <p style={{ color: "#94a3b8", fontSize: 15 }}>View and filter all transactions</p>
                </div>

                {/* Filter panel */}
                <div className="anim-slide-up">
                <FilterPanel filters={filters} onChange={handleFilterChange} onReset={handleReset} />
                </div>

                {/* Summary stats */}
                <div className="stats-grid anim-fade-in">
                <StatCard label="Total Transactions" value={stats.count} />
                <StatCard
                    label="Net Change"
                    value={`${stats.net >= 0 ? "+" : "−"}$${Math.abs(stats.net).toFixed(2)}`}
                    valueColor={stats.net >= 0 ? "#4ade80" : "#f87171"}
                />
                <StatCard label="Total Deposits"     value={`$${stats.deposits.toFixed(2)}`}    valueColor="#3b82f6" />
                <StatCard label="Total Withdrawals"  value={`$${stats.withdrawals.toFixed(2)}`} valueColor="#f87171" />
                <StatCard label="Total Transfer"  value={`$${stats.send.toFixed(2)}`} valueColor="#ffffff" />
                <StatCard label="Total Received"  value={`$${stats.receive.toFixed(2)}`} valueColor="#9a22fc" />
                </div>

                {/* Table */}
                <div className="anim-slide-up">
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16, flexWrap: "wrap", gap: 8 }}>
                    <h2 style={{ fontSize: 16, fontWeight: 600, color: "#e2e8f0" }}>
                    Transactions
                    <span style={{ marginLeft: 10, fontSize: 13, color: "#94a3b8", fontWeight: 400 }}>
                        {filtered.length} result{filtered.length !== 1 ? "s" : ""}
                    </span>
                    </h2>
                </div>
                <TransactionsTable transactions={filtered}  />
                </div>

            </div>
            </main>
        </div>

        {toast && <Toast msg={toast.msg} type={toast.type} />}
        </>
    );
    }