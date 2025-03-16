
import { ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import { Trophy, Users, Calendar, BarChart3, Home, Award } from "lucide-react";
import { cn } from "@/lib/utils";

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const location = useLocation();
  
  const navItems = [
    { path: "/", label: "الرئيسية", icon: <Home className="h-5 w-5" /> },
    { path: "/groups", label: "المجموعات", icon: <Users className="h-5 w-5" /> },
    { path: "/matches", label: "المباريات", icon: <Calendar className="h-5 w-5" /> },
    { path: "/bracket", label: "الأدوار الإقصائية", icon: <Trophy className="h-5 w-5" /> },
    { path: "/statistics", label: "الإحصائيات", icon: <BarChart3 className="h-5 w-5" /> },
    { path: "/players", label: "اللاعبين", icon: <Award className="h-5 w-5" /> },
  ];

  return (
    <div className="min-h-screen bg-tournament-darkNavy text-white">
      <div className="fixed top-0 left-0 right-0 h-16 glassmorphism z-30 border-b border-tournament-accent/20">
        <div className="container h-full flex items-center justify-between px-4">
          <div className="flex items-center">
            <Trophy className="h-8 w-8 text-tournament-pink" />
            <h1 className="text-2xl font-bold mr-2 bg-gradient-to-r from-white to-tournament-pink bg-clip-text text-transparent">
              بطولة نرسي 2025
            </h1>
          </div>
        </div>
      </div>
      
      <div className="fixed left-0 right-0 bottom-0 glassmorphism border-t border-tournament-accent/20 z-30">
        <nav className="container px-4 py-2">
          <ul className="flex justify-between items-center">
            {navItems.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={cn(
                    "flex flex-col items-center p-2 rounded-lg transition-colors",
                    location.pathname === item.path
                      ? "text-tournament-pink"
                      : "text-gray-400 hover:text-white"
                  )}
                >
                  {item.icon}
                  <span className="text-xs mt-1">{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
      
      <main className="container px-4 pt-20 pb-20">
        {children}
      </main>
    </div>
  );
};

export default Layout;
