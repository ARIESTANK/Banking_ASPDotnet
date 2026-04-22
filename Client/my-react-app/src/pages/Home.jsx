import { useState , useEffect} from "react";
import {useNavigate} from "react-router-dom";
import QRCode from "qrcode";
import {useRef} from "react";
// ── SVG Icons ─────────────────────────────────────────────────────────────────
const Icon = ({ d, size = 20, color = "#c9a84c", strokeWidth = 2, paths, polylines, lines, circles, rects, polygons }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
    {d && <path d={d} />}
    {paths?.map((p, i) => <path key={i} d={p} />)}
    {polylines?.map((p, i) => <polyline key={i} points={p} />)}
    {lines?.map((l, i) => <line key={i} x1={l[0]} y1={l[1]} x2={l[2]} y2={l[3]} />)}
    {circles?.map((c, i) => <circle key={i} cx={c[0]} cy={c[1]} r={c[2]} />)}
    {rects?.map((r, i) => <rect key={i} x={r[0]} y={r[1]} width={r[2]} height={r[3]} rx={r[4]} />)}
    {polygons?.map((p, i) => <polygon key={i} points={p} />)}
  </svg>
);

const LandmarkIcon = ({ size = 22, color = "#0a192f" }) => (
  <Icon size={size} color={color}
    lines={[[3,22,21,22],[6,18,6,11],[10,18,10,11],[14,18,14,11],[18,18,18,11]]}
    polygons={["12 2 20 7 4 7"]}
  />
);
const UserIcon = ({ size = 16, color = "#c9a84c" }) => (
  <Icon size={size} color={color}
    paths={["M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"]}
    circles={[[12, 7, 4]]}
  />
);
const SendIcon = ({ size = 24, color = "#c9a84c" }) => (
  <Icon size={size} color={color}
    lines={[[22,2,11,13],[22,2,15,22],[9,9,2,12],[15,22,9,9]]}
  />
);
const DownloadIcon = ({ size = 24, color = "#c9a84c" }) => (
  <Icon size={size} color={color}
    paths={["M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"]}
    polylines={["7 10 12 15 17 10"]}
    lines={[[12,15,12,3]]}
  />
);
const TrendingUpIcon = ({ size = 24, color = "#c9a84c" }) => (
  <Icon size={size} color={color}
    polylines={["23 6 13.5 15.5 8.5 10.5 1 18","17 6 23 6 23 12"]}
  />
);
const CreditCardIcon = ({ size = 24, color = "#c9a84c" }) => (
  <Icon size={size} color={color}
    rects={[[1,4,22,16,2]]}
    lines={[[1,10,23,10]]}
  />
);
const ArrowUpRightIcon = ({ size = 20, color }) => (
  <Icon size={size} color={color}
    lines={[[7,17,17,7],[7,7,17,7],[17,7,17,17]]}
  />
);
const ArrowDownLeftIcon = ({ size = 20, color }) => (
  <Icon size={size} color={color}
    lines={[[17,7,7,17],[17,17,7,17],[7,17,7,7]]}
  />
);

// ── Data ──────────────────────────────────────────────────────────────────────
const TRANSACTIONS = [
  { id: 1, label: "Amazon Purchase",    time: "Today at 2:45 PM",      amount: -127.50,  type: "debit"  },
  { id: 2, label: "Salary Deposit",     time: "Yesterday at 9:00 AM",  amount: 3500.00,  type: "credit" },
  { id: 3, label: "Netflix Subscription", time: "3 days ago",          amount: -15.99,   type: "debit"  },
  { id: 4, label: "Freelance Payment",  time: "5 days ago",            amount: 850.00,   type: "credit" },
];

const ACTIONS = [
  { key: "transfer", label: "Send Money",     sub: "Transfer funds",  icon: <SendIcon /> },
  { key: "request",  label: "Request Money",  sub: "Get paid back",   icon: <DownloadIcon /> },
  { key: "invest",   label: "Invest",         sub: "Grow wealth",     icon: <TrendingUpIcon /> },
  { key: "cards",    label: "Cards",          sub: "Manage cards",    icon: <CreditCardIcon /> },
];

const NAV_LINKS = ["Accounts", "Transfers", "Settings"];

// ── Toast ─────────────────────────────────────────────────────────────────────
function Toast({ msg }) {
  if (!msg) return null;
  return (
    <div style={{
      position: "fixed", bottom: 24, right: 24,
      background: "#c9a84c", color: "#0a192f",
      padding: "16px 24px", borderRadius: 12,
      fontWeight: 600, fontSize: 14,
      animation: "slideUp 0.4s ease-out",
      zIndex: 100,
    }}>
      {msg}
    </div>
  );
}

// ── GoldLine ──────────────────────────────────────────────────────────────────
function GoldLine({ style }) {
  return <div className="gold-shimmer" style={style} />;
}

// ── Transaction Row ───────────────────────────────────────────────────────────
function TransactionRow({ tx, isLast }) {
  const isCredit = tx.amount > 0;
  const iconColor = isCredit ? "#4ade80" : "#f87171";
  const bgColor   = isCredit ? "rgba(74,222,128,0.15)" : "rgba(239,68,68,0.15)";

  return (
    <div
      className="transaction-item"
      style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "16px 24px",
        borderBottom: isLast ? "none" : "1px solid rgba(148,163,184,0.1)",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        <div style={{
          width: 48, height: 48, borderRadius: "50%",
          display: "flex", alignItems: "center", justifyContent: "center",
          background: bgColor,
        }}>
          {isCredit
            ? <ArrowDownLeftIcon size={20} color={iconColor} />
            : <ArrowUpRightIcon  size={20} color={iconColor} />}
        </div>
        <div>
          <p style={{ fontWeight: 600, color: "#e2e8f0", fontSize: 14, marginBottom: 2 }}>{tx.label}</p>
          <p style={{ color: "#94a3b8", fontSize: 12 }}>{tx.time}</p>
        </div>
      </div>
      <p style={{ fontWeight: 600, fontSize: 14, color: isCredit ? "#4ade80" : "#e2e8f0" }}>
        {isCredit ? "+" : ""}${Math.abs(tx.amount).toFixed(2)}
      </p>
    </div>
  );
}

// ── Action Card ───────────────────────────────────────────────────────────────
function ActionCard({ action, onClick }) {
  return (
    <button
      className="action-card"
      onClick={() => onClick(action)}
      style={{
        background: "rgba(15,35,63,0.85)",
        border: "1px solid rgba(201,168,76,0.2)",
        borderRadius: 12, padding: 24,
        textAlign: "left", cursor: "pointer",
        width: "100%",
      }}
    >
      <div style={{ marginBottom: 12 }}>{action.icon}</div>
      <p style={{ fontWeight: 600, color: "#e2e8f0", fontSize: 14, marginBottom: 4 }}>{action.label}</p>
      <p style={{ color: "#94a3b8", fontSize: 12 }}>{action.sub}</p>
    </button>
  );
}
function LoadingCard() {
  return (
    <div style={{
      borderRadius: 20,
      padding: 32,
      background: "rgba(15,35,63,0.5)",
      border: "1px solid rgba(201,168,76,0.2)"
    }}>
      <p style={{ color: "#94a3b8" }}>Loading account...</p>
    </div>
  );
}

function NoAccount({ onCreate }) {
  return (
    <div style={{
      padding: 32,
      textAlign: "center",
      borderRadius: 20,
      border: "1px solid rgba(201,168,76,0.2)",
      background: "rgba(15,35,63,0.8)"
    }}>
      <h2 style={{ color: "#e2e8f0", marginBottom: 12 }}>
        No Bank Account Found
      </h2>
      <p style={{ color: "#94a3b8", marginBottom: 20 }}>
        You don’t have an account yet. Create one to start banking.
      </p>

    </div>
  );
}

function CreateAccountModal({ show, onClose, onCreate }) {
  const [amount, setAmount] = useState("");

  if (!show) return null;

  return (
    <div style={{
      position: "fixed",
      inset: 0,
      background: "rgba(0,0,0,0.6)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 100
    }}>
      <div style={{
        background: "#0f233f",
        padding: 24,
        borderRadius: 12,
        width: 300
      }}>
        <h3 style={{ color: "#e2e8f0", marginBottom: 16 }}>
          Create Account
        </h3>

        <input
          type="number"
          placeholder="Initial Balance"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          style={{
            width: "100%",
            padding: 10,
            marginBottom: 16,
            borderRadius: 8
          }}
        />

        <button
          onClick={() => onCreate(amount)}
          style={{
            width: "100%",
            background: "#c9a84c",
            padding: 10,
            border: "none",
            borderRadius: 8
          }}
        >
          Create
        </button>

        <button
          onClick={onClose}
          style={{
            marginTop: 10,
            width: "100%",
            background: "transparent",
            color: "#94a3b8",
            border: "none"
          }}
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
// ── Send Money Modal ──────────────────────────────────────────────────────────
function SendMoneyModal({ show, onClose, onSuccess, fromAccountId }) {
  const [recipientAccount, setRecipientAccount] = useState("");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!show) return null;

  const handleSubmit = async () => {
    if (!recipientAccount || !amount || parseFloat(amount) <= 0) {
      setError("Please fill in all required fields with valid values.");
      return;
    }
    setError("");
    setLoading(true);
    console.log(fromAccountId);
    try {
      const response = await fetch("http://localhost:5288/api/Transaction", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          senderId:fromAccountId,
          receiverId:recipientAccount,
          amount: parseFloat(amount),
          description,
          type: "transfer",
        }),
      });
      if (response.status === 201 || response.status === 200) {
        onSuccess("Money sent successfully!");
        setRecipientAccount(""); setAmount(""); setDescription("");
      } else {
        const data = await response.json();
        setError(data?.message || "Transaction failed. Please try again.");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      position: "fixed", inset: 0,
      background: "rgba(0,0,0,0.65)",
      display: "flex", justifyContent: "center", alignItems: "center",
      zIndex: 200,
      animation: "fadeIn 0.2s ease-out",
    }}>
      <div style={{
        background: "#0f233f",
        border: "1px solid rgba(201,168,76,0.25)",
        borderRadius: 16, padding: 28, width: 340,
        animation: "slideUp 0.3s ease-out",
      }}>
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <h3 style={{ color: "#e2e8f0", fontSize: 16, fontWeight: 600 }}>Send Money</h3>
          <button onClick={onClose} style={{ background: "none", border: "none", color: "#94a3b8", cursor: "pointer", fontSize: 20, lineHeight: 1 }}>×</button>
        </div>

        {/* Recipient */}
        <div style={{ marginBottom: 14 }}>
          <label style={{ color: "#94a3b8", fontSize: 12, display: "block", marginBottom: 6 }}>
            Recipient Account # <span style={{ color: "#f87171" }}>*</span>
          </label>
          <input
            type="text"
            placeholder="e.g. 1234 5678"
            value={recipientAccount}
            onChange={e => setRecipientAccount(e.target.value)}
            style={{
              width: "100%", padding: "10px 14px",
              background: "#0a192f",
              border: "1px solid rgba(201,168,76,0.2)",
              borderRadius: 8, color: "#e2e8f0", fontSize: 14,
              outline: "none", boxSizing: "border-box",
            }}
          />
        </div>

        {/* Amount */}
        <div style={{ marginBottom: 14 }}>
          <label style={{ color: "#94a3b8", fontSize: 12, display: "block", marginBottom: 6 }}>
            Amount ($) <span style={{ color: "#f87171" }}>*</span>
          </label>
          <input
            type="number"
            min="0.01"
            step="0.01"
            placeholder="0.00"
            value={amount}
            onChange={e => setAmount(e.target.value)}
            style={{
              width: "100%", padding: "10px 14px",
              background: "#0a192f",
              border: "1px solid rgba(201,168,76,0.2)",
              borderRadius: 8, color: "#e2e8f0", fontSize: 14,
              outline: "none", boxSizing: "border-box",
            }}
          />
        </div>

        {/* Description */}
        <div style={{ marginBottom: 20 }}>
          <label style={{ color: "#94a3b8", fontSize: 12, display: "block", marginBottom: 6 }}>Description (optional)</label>
          <input
            type="text"
            placeholder="e.g. Rent payment"
            value={description}
            onChange={e => setDescription(e.target.value)}
            style={{
              width: "100%", padding: "10px 14px",
              background: "#0a192f",
              border: "1px solid rgba(201,168,76,0.2)",
              borderRadius: 8, color: "#e2e8f0", fontSize: 14,
              outline: "none", boxSizing: "border-box",
            }}
          />
        </div>

        {error && (
          <p style={{ color: "#f87171", fontSize: 12, marginBottom: 14 }}>{error}</p>
        )}

        <button
          onClick={handleSubmit}
          disabled={loading}
          style={{
            width: "100%", padding: "11px",
            background: loading ? "rgba(201,168,76,0.5)" : "#c9a84c",
            border: "none", borderRadius: 8,
            color: "#0a192f", fontWeight: 600, fontSize: 14,
            cursor: loading ? "not-allowed" : "pointer",
            marginBottom: 8,
          }}
        >
          {loading ? "Sending..." : "Send Money"}
        </button>
        <button onClick={onClose} style={{ width: "100%", background: "none", border: "none", color: "#94a3b8", fontSize: 13, cursor: "pointer" }}>
          Cancel
        </button>
      </div>
    </div>
  );
}

// ── Request Money Modal ───────────────────────────────────────────────────────

function RequestMoneyModal({ show, onClose, account }) {
  const [step, setStep] = useState("form");   // "form" | "qr"
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [qrDataUrl, setQrDataUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const canvasRef = useRef(null);

  if (!show) return null;

  const reset = () => {
    setStep("form");
    setAmount("");
    setNote("");
    setQrDataUrl("");
    setError("");
  };

  const handleClose = () => { reset(); onClose(); };

  // The QR encodes a deep-link URL your app will read on the /send route
  const buildPaymentUrl = () => {
    const base = window.location.origin;
    const params = new URLSearchParams({
      to: account.accountNumber,   // recipient account number
      name: account.ownerName ?? "",
      amount: amount,
      note: note,
    });
    return `${base}/send?${params.toString()}`;
  };

  const handleGenerateQR = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      setError("Please enter a valid amount.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      const url = buildPaymentUrl();
      const dataUrl = await QRCode.toDataURL(url, {
        width: 220,
        margin: 2,
        color: {
          dark: "#0a192f",
          light: "#ffffff",
        },
      });
      setQrDataUrl(dataUrl);
      setStep("qr");
    } catch (error){
      console.log(error);
      setError("Failed to generate QR code.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(buildPaymentUrl());
  };

  const handleDownload = () => {
    const a = document.createElement("a");
    a.href = qrDataUrl;
    a.download = `apex-pay-request-${account.accountNumber}.png`;
    a.click();
  };

  const overlayStyle = {
    position: "fixed", inset: 0,
    background: "rgba(0,0,0,0.65)",
    display: "flex", justifyContent: "center", alignItems: "center",
    zIndex: 200,
    animation: "fadeIn 0.2s ease-out",
  };

  const modalStyle = {
    background: "#0f233f",
    border: "1px solid rgba(201,168,76,0.25)",
    borderRadius: 16, padding: 28, width: 340,
    animation: "slideUp 0.3s ease-out",
  };

  const inputStyle = {
    width: "100%", padding: "10px 14px",
    background: "#0a192f",
    border: "1px solid rgba(201,168,76,0.2)",
    borderRadius: 8, color: "#e2e8f0", fontSize: 14,
    outline: "none", boxSizing: "border-box",
    fontFamily: "inherit",
  };

  const btnPrimary = {
    width: "100%", padding: "11px",
    background: "#c9a84c",
    border: "none", borderRadius: 8,
    color: "#0a192f", fontWeight: 600, fontSize: 14,
    cursor: "pointer", marginBottom: 8,
    fontFamily: "inherit",
  };

  const btnGhost = {
    width: "100%", background: "none", border: "none",
    color: "#94a3b8", fontSize: 13, cursor: "pointer",
    fontFamily: "inherit",
  };

  // ── Step 1: Form ──
  if (step === "form") return (
    <div style={overlayStyle}>
      <div style={modalStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <h3 style={{ color: "#e2e8f0", fontSize: 16, fontWeight: 600 }}>Request Money</h3>
          <button onClick={handleClose} style={{ background: "none", border: "none", color: "#94a3b8", cursor: "pointer", fontSize: 22, lineHeight: 1 }}>×</button>
        </div>

        <div style={{ marginBottom: 14 }}>
          <label style={{ color: "#94a3b8", fontSize: 12, display: "block", marginBottom: 6 }}>
            Amount ($) <span style={{ color: "#f87171" }}>*</span>
          </label>
          <input
            type="number" min="0.01" step="0.01" placeholder="0.00"
            value={amount} onChange={e => setAmount(e.target.value)}
            style={inputStyle}
          />
        </div>

        <div style={{ marginBottom: 20 }}>
          <label style={{ color: "#94a3b8", fontSize: 12, display: "block", marginBottom: 6 }}>Note (optional)</label>
          <input
            type="text" placeholder="e.g. Split dinner"
            value={note} onChange={e => setNote(e.target.value)}
            style={inputStyle}
          />
        </div>

        {error && <p style={{ color: "#f87171", fontSize: 12, marginBottom: 14 }}>{error}</p>}

        <button onClick={handleGenerateQR} disabled={loading} style={{ ...btnPrimary, opacity: loading ? 0.6 : 1 }}>
          {loading ? "Generating..." : "Generate QR Code"}
        </button>
        <button onClick={handleClose} style={btnGhost}>Cancel</button>
      </div>
    </div>
  );

  // ── Step 2: QR Display ──
  return (
    <div style={overlayStyle}>
      <div style={modalStyle}>
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
          <h3 style={{ color: "#e2e8f0", fontSize: 16, fontWeight: 600 }}>
            Scan to pay ${parseFloat(amount).toFixed(2)}
          </h3>
          <button onClick={handleClose} style={{ background: "none", border: "none", color: "#94a3b8", cursor: "pointer", fontSize: 22, lineHeight: 1 }}>×</button>
        </div>
        <p style={{ color: "#94a3b8", fontSize: 12, marginBottom: 20 }}>
          to Account #{account.accountNumber}
          {note ? ` · ${note}` : ""}
        </p>

        {/* QR Code */}
        <div style={{
          background: "#ffffff", borderRadius: 12, padding: 16,
          display: "flex", justifyContent: "center", marginBottom: 20,
        }}>
          <img src={qrDataUrl} alt="Payment QR Code" style={{ width: 200, height: 200 }} />
        </div>

        {/* Info pill */}
        <div style={{
          background: "rgba(201,168,76,0.08)",
          border: "1px solid rgba(201,168,76,0.2)",
          borderRadius: 8, padding: "8px 14px",
          display: "flex", alignItems: "center", gap: 8,
          marginBottom: 16,
        }}>
          <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#c9a84c", flexShrink: 0 }} />
          <p style={{ color: "#94a3b8", fontSize: 12, margin: 0 }}>
            Scanner will be taken directly to the Send Money form pre-filled with your details.
          </p>
        </div>

        {/* Actions */}
        <div style={{ display: "flex", gap: 10, marginBottom: 10 }}>
          <button
            onClick={handleCopyLink}
            style={{
              flex: 1, padding: "10px",
              background: "rgba(201,168,76,0.1)",
              border: "1px solid rgba(201,168,76,0.25)",
              borderRadius: 8, color: "#c9a84c",
              fontWeight: 600, fontSize: 13, cursor: "pointer",
              fontFamily: "inherit",
            }}
          >
            Copy Link
          </button>
          <button
            onClick={handleDownload}
            style={{
              flex: 1, padding: "10px",
              background: "#c9a84c",
              border: "none", borderRadius: 8,
              color: "#0a192f", fontWeight: 600,
              fontSize: 13, cursor: "pointer",
              fontFamily: "inherit",
            }}
          >
            Download QR
          </button>
        </div>

        <button onClick={() => setStep("form")} style={btnGhost}>← Edit amount</button>
      </div>
    </div>
  );
}


// ── Main Dashboard ────────────────────────────────────────────────────────────
export default function BankingDashboard() {

    const navigate = useNavigate();
  const [toast, setToast] = useState(null);
  const [loading, setLoading] = useState(true);
  const [account, setAccount] = useState(null); // null = not fetched yet
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [user,setUser] =useState({});

  const [showSendModal, setShowSendModal] = useState(false);
const [showRequestModal, setShowRequestModal] = useState(false);

  const handleAction = (action) => {
  if (action.key === "transfer") { setShowSendModal(true); return; }
  if (action.key === "request")  { setShowRequestModal(true); return; }
  setToast(`${action.label} feature would open here.`);
  setTimeout(() => setToast(null), 3000);
};
const handleTransactionSuccess = (msg) => {
  setShowSendModal(false);
  setShowRequestModal(false);
  setToast(msg);
  setTimeout(() => setToast(null), 3000);
  fetchUserAccountData(localStorage.getItem("authUser")); // refresh balance
};

  const createAccount = async (amount) => {
  try {
    const userID = localStorage.getItem("authUser");

    const response = await fetch("http://localhost:5288/api/Account", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userID: userID,
        amount: amount
      })
    });

    if (response.status === 201) {
      const data = await response.json();
      setShowCreateModal(false);
      setToast("Account created successfully!");
    }

  } catch (err) {
    console.log(err);
  }
};

  const fetchUserAccountData = async (id) => {
  try {
    setLoading(true);

    const response = await fetch(`http://localhost:5288/api/Account/by-userID/${id}`);

    if (response.status === 200) {
      const data = await response.json();
      setAccount(data);
    } 
    else if (response.status === 404) {
      setAccount(null); // no account
    }

  } catch (error) {
    console.log(error);
    setAccount(null);
  } finally {
    setLoading(false);
  }
};
const fetchUserData = async (id) => {
  try {
    setLoading(true);

    const response = await fetch(`http://localhost:5288/api/User/by-id/${id}`);

    if (response.status === 200) {
      const data = await response.json();
      setUser(data);
    }
    else if (response.status === 404) {
      setUser(null); // no account
    }

  } catch (error) {
    console.log(error);
    setUser(null);
  } finally {
    setLoading(false);
  }
};

  useEffect(()=>{
    const userID = localStorage.getItem("authUser")
    fetchUserAccountData(userID);
    fetchUserData(userID);
  },[])
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        body {
          font-family: 'Plus Jakarta Sans', sans-serif;
          background-color: #0a192f;
        }

        .font-display { font-family: 'DM Serif Display', serif; }

        .gold-shimmer {
          height: 1px;
          background: linear-gradient(90deg, transparent, #c9a84c, #e8d48b, #c9a84c, transparent);
          background-size: 200% 100%;
          animation: shimmer 3s ease-in-out infinite;
        }

        @keyframes shimmer {
          0%   { background-position: -200% 0; }
          100% { background-position:  200% 0; }
        }
        @keyframes fadeIn   { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideDown { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes slideUp   { from { opacity: 0; transform: translateY(20px); }  to { opacity: 1; transform: translateY(0); } }

        .anim-fade-in    { animation: fadeIn   0.6s ease-out; }
        .anim-slide-down { animation: slideDown 0.5s ease-out; }
        .anim-slide-up   { animation: slideUp  0.6s ease-out both; }
        .anim-slide-up-d1 { animation: slideUp 0.6s 0.1s ease-out both; }
        .anim-slide-up-d2 { animation: slideUp 0.6s 0.2s ease-out both; }

        .action-card { transition: transform 0.3s ease; }
        .action-card:hover { transform: scale(1.05); }

        .transaction-item { transition: background 0.2s ease; }
        .transaction-item:hover { background: rgba(201,168,76,0.05); }

        .btn-gold {
          background: rgba(201,168,76,0.1);
          color: #c9a84c;
          border: none;
          padding: 8px 16px;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 500;
          font-family: 'Plus Jakarta Sans', sans-serif;
          cursor: pointer;
          transition: opacity 0.2s;
        }
        .btn-gold:hover { opacity: 0.85; }

        .nav-link {
          background: none;
          border: none;
          font-size: 14px;
          font-weight: 500;
          color: #94a3b8;
          cursor: pointer;
          font-family: 'Plus Jakarta Sans', sans-serif;
          transition: opacity 0.2s;
        }
        .nav-link:hover { opacity: 0.75; }

        .actions-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 16px;
        }
        @media (min-width: 768px) {
          .actions-grid { grid-template-columns: repeat(4, 1fr); }
        }

        .balance-sub-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 16px;
        }
        @media (min-width: 768px) {
          .balance-sub-grid { grid-template-columns: repeat(4, 1fr); }
        }
      `}</style>

      <div style={{
        minHeight: "100vh",
        backgroundColor: "#0a192f",
        backgroundImage:
          "radial-gradient(circle at 20% 50%, rgba(201,168,76,0.06) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(201,168,76,0.04) 0%, transparent 40%)",
      }}>

        {/* ── Header ── */}
        <header className="anim-slide-down" style={{
          position: "sticky", top: 0, zIndex: 50,
          background: "rgba(10,25,47,0.95)",
          backdropFilter: "blur(10px)",
          WebkitBackdropFilter: "blur(10px)",
        }}>
          <nav style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            padding: "16px 48px",
          }}>
            {/* Logo */}
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{
                background: "#c9a84c", width: 40, height: 40,
                borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center",
                flexShrink: 0,
              }}>
                <LandmarkIcon />
              </div>
              <div>
                <div className="font-display" style={{ fontSize: 18, fontWeight: 700, color: "#e2e8f0" }}>
                  Apex Bank
                </div>
                <div style={{ fontSize: 12, color: "#94a3b8" }}>Premium Account</div>
              </div>
            </div>

            {/* Nav */}
            <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
              {NAV_LINKS.map((link) => (
                <button key={link} className="nav-link">{link}</button>
              ))}
              <button onClick={()=>navigate("/profile")} className="btn-gold" style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <UserIcon />
                <span>Profile</span>
              </button>
            </div>
          </nav>
          <GoldLine />
        </header>

        {/* ── Main ── */}
        <main style={{ padding: "32px 48px" }}>

          {/* Welcome */}
          <div className="anim-fade-in" style={{ marginBottom: 40 }}>
            <h1 className="font-display" style={{ fontSize: "clamp(1.75rem,3vw,2.25rem)", color: "#e2e8f0", marginBottom: 8 }}>
              Welcome back, <span style={{ color: "#c9a84c" }}>{user.name}</span>
            </h1>
            <p style={{ color: "#94a3b8", fontSize: 14 }}>Here's your financial overview</p>
          </div>

          {/* Balance Card */}
          <div className="anim-slide-up" style={{ marginBottom: 40 }}>
            {loading ? (
            <LoadingCard />
          ) : account === null ? (
            <NoAccount onCreate={() => setShowCreateModal(true)} />
          ) : (

            <div style={{
              borderRadius: 20, padding: 32,
              border: "1px solid rgba(201,168,76,0.2)",
              background: "linear-gradient(135deg, rgba(15,35,63,0.9) 0%, rgba(201,168,76,0.08) 100%)",
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
            }}>
              {/* Top row */}
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 24 }}>
                <div>
                  <p style={{ color: "#94a3b8", fontSize: 13, fontWeight: 500, marginBottom: 4 }}>Total Balance</p>
                  <div className="font-display" style={{ fontSize: "clamp(2.5rem,5vw,3rem)", fontWeight: 700, color: "#e2e8f0", fontFeatureSettings: "'tnum' 1" }}>
                    ${account.amount}
                  </div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{
                    display: "inline-flex", alignItems: "center", gap: 4,
                    background: "rgba(74,222,128,0.15)",
                    padding: "4px 12px", borderRadius: 99, marginBottom: 4,
                  }}>
                    <TrendingUpIcon size={14} color="#4ade80" />
                    <span style={{ fontSize: 12, fontWeight: 600, color: "#4ade80" }}>+2.5%</span>
                  </div>
                  <p style={{ color: "#94a3b8", fontSize: 12 }}>vs last month</p>
                </div>
              </div>

              <GoldLine style={{ marginBottom: 24 }} />

              {/* Sub balances */}
              <div className="balance-sub-grid">
                {[
                  { label: "Checking",    value: "$15,200.00", mono: false },
                  { label: "Savings",     value: "$8,950.50",  mono: false },
                  { label: "Investments", value: "$700.00",    mono: false },
                  { label: "Account #",   value: "1234 5678",  mono: true  },
                ].map(({ label, value, mono }) => (
                  <div key={label}>
                    <p style={{ color: "#94a3b8", fontSize: 12, marginBottom: 4 }}>{label}</p>
                    <p style={{ fontWeight: 600, fontSize: 14, color: mono ? "#c9a84c" : "#e2e8f0", fontFamily: mono ? "monospace" : "inherit" }}>
                      {value}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
          </div>

          {/* Quick Actions */}
          <div className="anim-slide-up-d1" style={{ marginBottom: 40 }}>
            <h2 className="font-display" style={{ fontSize: "1.5rem", color: "#e2e8f0", marginBottom: 24 }}>Quick Actions</h2>
            <div className="actions-grid">
              {ACTIONS.map((action) => (
                <ActionCard key={action.key} action={action} onClick={handleAction} />
              ))}
            </div>
          </div>

          {/* Recent Transactions */}
          <div className="anim-slide-up-d2">
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
              <h2 className="font-display" style={{ fontSize: "1.5rem", color: "#e2e8f0" }}>Recent Transactions</h2>
              <button className="btn-gold">View All</button>
            </div>

            <div style={{
              background: "rgba(15,35,63,0.85)",
              border: "1px solid rgba(201,168,76,0.2)",
              borderRadius: 12, overflow: "hidden",
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
            }}>
              {TRANSACTIONS.map((tx, i) => (
                <TransactionRow key={tx.id} tx={tx} isLast={i === TRANSACTIONS.length - 1} />
              ))}
            </div>
          </div>
        </main>
              <SendMoneyModal
                show={showSendModal}
                onClose={() => setShowSendModal(false)}
                onSuccess={handleTransactionSuccess}
                fromAccountId={account?.userID}
              />
              <RequestMoneyModal
                show={showRequestModal}
                onClose={() => setShowRequestModal(false)}
                onSuccess={handleTransactionSuccess}
                toAccountId={account?.id}
              />
        {/* Toast */}
        <Toast msg={toast} />
      </div>
    </>
  );
}