
import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Menu, X, ChevronRight } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { useAuthStore } from "@/store/authStore";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isAuthenticated } = useAuthStore();
  
  const links = [
    { path: "/", label: "الرئيسية" },
    { path: "/groups", label: "المجموعات" },
    { path: "/matches", label: "المباريات" },
    { path: "/knockout", label: "الأدوار الإقصائية" },
    { path: "/stats", label: "الإحصائيات" },
  ];
  
  // إضافة رابط الإدارة فقط إذا كان المستخدم مسجل الدخول
  if (isAuthenticated) {
    links.push({ path: "/admin", label: "الإدارة" });
  }

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };
  
  // إغلاق القائمة عند تغيير المسار
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-tournament-navy text-white" dir="rtl">
      <header className="border-b border-white/10 glassmorphism backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-3">
          <div className="flex justify-between items-center">
            <div className="text-xl font-bold text-tournament-pink">بطولة كرة القدم</div>
            
            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-1 items-center">
              {links.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={cn(
                    "px-3 py-2 rounded-md text-sm font-medium transition-colors",
                    isActive(link.path)
                      ? "bg-tournament-accent/20 text-tournament-accent"
                      : "text-white/80 hover:text-white hover:bg-white/10"
                  )}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
            
            {/* Mobile Menu Button */}
            <button 
              className="md:hidden text-white hover:text-tournament-accent"
              onClick={toggleMobileMenu}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
          
          {/* Mobile Navigation - Improved with better styling */}
          {mobileMenuOpen && (
            <nav className="py-4 md:hidden absolute right-0 top-full w-full bg-tournament-darkNavy z-30 border-b border-white/10">
              <div className="flex flex-col">
                {links.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={cn(
                      "px-6 py-3 text-md font-medium border-b border-white/5 transition-colors flex items-center justify-between",
                      isActive(link.path)
                        ? "bg-tournament-accent/20 text-tournament-accent"
                        : "text-white/80 hover:text-white hover:bg-white/10"
                    )}
                  >
                    <span>{link.label}</span>
                    <ChevronRight size={18} className="opacity-70" />
                  </Link>
                ))}
              </div>
            </nav>
          )}
        </div>
      </header>
      
      <main className="container mx-auto px-4 py-6">
        {/* Add back button on pages other than home */}
        {location.pathname !== "/" && !location.pathname.includes("/admin") && (
          <button 
            onClick={() => navigate(-1)} 
            className="mb-4 flex items-center text-sm text-white/70 hover:text-white"
          >
            <ChevronRight size={16} className="ml-1" />
            <span>العودة</span>
          </button>
        )}
        
        {children}
      </main>
      
      <footer className="border-t border-white/10 py-6 mt-10">
        <div className="container mx-auto px-4 text-center text-white/60 text-sm">
          جميع الحقوق محفوظة © 2025
        </div>
      </footer>
    </div>
  );
};

export default Layout;
