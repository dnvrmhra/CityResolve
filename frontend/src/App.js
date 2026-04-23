import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import ComplaintForm from './pages/ComplaintForm';
import Dashboard from './pages/Dashboard';
import Admin from './pages/Admin';
import AdminDashboard from './pages/AdminDashboard';
import AnalyticsPage from './pages/AnalyticsPage';

// Wraps the app so we can use useLocation inside the Router
function AppLayout() {
  const location = useLocation();

  // Hide the top Navbar on admin pages — they use their own sidebar
  const hideNavbar = location.pathname.startsWith('/admin');

  return (
    <div className="min-h-screen bg-slate-50">
      {!hideNavbar && <Navbar />}
      <Routes>
        <Route path="/"                  element={<Home />} />
        <Route path="/complaint"         element={<ComplaintForm />} />
        <Route path="/dashboard"         element={<Dashboard />} />
        <Route path="/admin/login"       element={<Admin />} />
        <Route path="/admin"             element={<AdminDashboard />} />
        <Route path="/admin/analytics"   element={<AnalyticsPage />} />
      </Routes>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppLayout />
    </Router>
  );
}

export default App;