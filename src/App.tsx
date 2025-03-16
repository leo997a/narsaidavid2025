
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'sonner';
import Index from './pages/Index';
import Groups from './pages/Groups';
import Matches from './pages/Matches';
import Knockout from './pages/Knockout';
import Stats from './pages/Stats';
import NotFound from './pages/NotFound';
import Admin from './pages/Admin';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/groups" element={<Groups />} />
        <Route path="/matches" element={<Matches />} />
        <Route path="/knockout" element={<Knockout />} />
        <Route path="/stats" element={<Stats />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Toaster position="top-center" dir="rtl" />
    </Router>
  );
}

export default App;
