
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';
import Index from './pages/Index';
import Groups from './pages/Groups';
import Matches from './pages/Matches';
import Knockout from './pages/Knockout';
import Stats from './pages/Stats';
import Rules from './pages/Rules';
import NotFound from './pages/NotFound';
import Admin from './pages/Admin';
import Login from './pages/Login';
import { useAuthStore } from './store/authStore';
import './App.css';

// مكون حماية المسارات
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuthStore();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  return <>{children}</>;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/groups" element={<Groups />} />
        <Route path="/matches" element={<Matches />} />
        <Route path="/knockout" element={<Knockout />} />
        <Route path="/stats" element={<Stats />} />
        <Route path="/rules" element={<Rules />} />
        <Route path="/login" element={<Login />} />
        <Route 
          path="/admin" 
          element={
            <ProtectedRoute>
              <Admin />
            </ProtectedRoute>
          } 
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Toaster position="top-center" dir="rtl" />
    </Router>
  );
}

export default App;
