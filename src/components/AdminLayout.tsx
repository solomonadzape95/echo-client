import { useState, useEffect, type ReactNode } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { 
  MdDashboard, 
  MdPeople, 
  MdHowToVote, 
  MdAdminPanelSettings,
  MdSearch,
  MdSchool,
  MdLogout
} from "react-icons/md";
import { FloatingMenu } from "./FloatingMenu";

interface AdminLayoutProps {
  children: ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString());

  // Update time every second instead of on every render
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const navItems = [
    { path: "/admin/dashboard", label: "Dashboard", icon: MdDashboard },
    { path: "/admin/elections", label: "Elections", icon: MdHowToVote },
    { path: "/admin/voters", label: "Voters", icon: MdPeople },
    { path: "/admin/classes", label: "Classes", icon: MdSchool },
    { path: "/admin/admins", label: "Admins", icon: MdAdminPanelSettings },
  ];

  return (
    <div className="min-h-screen bg-[#0a1a1a] flex flex-col">
      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Bar */}
        <header className="h-16 bg-[#142828] border-b border-[#234848] flex items-center justify-between px-6">
          {/* Left side - Title */}
          <div className="text-[#92c9c9] text-lg">
              <span>Logged in as </span>
              <span className="font-bold text-white uppercase">Admin</span>
            </div>  

          {/* Right side - User and Logout */}
          <div className="flex items-center gap-4">
            {/* Logout Button */}
            <button
              onClick={() => navigate("/admin/login")}
              className="flex items-center gap-2 px-4 py-2 bg-red-900/20 hover:bg-red-900/30 border border-red-500/50 text-red-400 hover:text-red-300  transition-all"
            >
              <MdLogout className="w-4 h-4" />
              <span className="text-sm font-medium">Logout</span>
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto bg-[#0a1a1a]">
          {children}
        </main>

        {/* Bottom Bar */}
        <footer className="h-8 bg-[#142828] border-t border-[#234848] flex items-center justify-between px-6 text-xs text-[#568888]">
          <span>LAST UPDATED: {currentTime}</span>
          <span>SERVER: US-EAST-1 // STATUS: ONLINE</span>
        </footer>
      </div>

      {/* Floating Menu */}
      <FloatingMenu
        items={navItems}
        title="echo"
        subtitle="ADMIN_CONSOLE"
        onLogout={() => navigate("/admin/login")}
      />
    </div>
  );
}
