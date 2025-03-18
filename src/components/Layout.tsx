
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Menu, X } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const location = useLocation();
  const isMobile = useIsMobile();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const links = [
    { path: "/", label: "الرئيسية" },
    { path: "/groups", label: "المجموعات" },
    { path: "/matches", label: "المباريات" },
    { path: "/knockout", label: "الأدوار الإقصائية" },
    { path: "/stats", label: "الإحصائيات" },
    { path: "/admin", label: "الإدارة" },
  ];

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

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
          
          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <nav className="py-4 md:hidden">
              <div className="flex flex-col space-y-2">
                {links.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => setMobileMenuOpen(false)}
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
              </div>
            </nav>
          )}
        </div>
      </header>
      
      <main className="container mx-auto px-4 py-6">
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
