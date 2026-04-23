import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';

// Import your page components (assuming these files exist in your src folder)
import ApexBank from './pages/Login';
import BankingDashboard from "./pages/Home";
import BankingProfile from "./pages/Profile";
import  AdminDashboard from "./pages/Admin";
import Landing from "./pages/LandingPage";
import TransactionList from "./pages/Transactions";
function App() {
  return (
    <Router>
        <Routes>
          <Route path='/' element={<Landing/>}/>
          <Route path="/admin" element={<AdminDashboard/>}/>
          <Route path="/login" element={<ApexBank />} />
          <Route path="/home" element={<BankingDashboard />} />
          <Route path="/profile" element={<BankingProfile />} />
          <Route path="/transactions" element={<TransactionList />} />
        </Routes>
    </Router>
  );
}

export default App;
