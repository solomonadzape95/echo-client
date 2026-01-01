import { useState, useEffect, type ReactNode } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { 
  MdDashboard, 
  MdPeople, 
  MdHowToVote, 
  MdAdminPanelSettings,
  MdSearch,
  MdSchool
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
          {/* Breadcrumbs */}
          <div className="flex items-center gap-2 text-sm text-[#92c9c9]">
            {location.pathname.split("/").filter(Boolean).map((segment, index, arr) => (
              <span key={index} className="flex items-center gap-2">
                <span className="capitalize">{segment === "admin" ? "Admin" : segment}</span>
                {index < arr.length - 1 && <span className="text-[#568888]">/</span>}
              </span>
            ))}
          </div>

          {/* Right side - Search and User */}
          <div className="flex items-center gap-4">
          
            {/* User */}
            <div className="flex items-center gap-2 px-3 py-1 bg-[#102222] border border-[#234848] rounded-lg">
              <div className="w-8 h-8 bg-[#13ecec] rounded-full flex items-center justify-center text-[#112222] font-bold text-xs">
                AD
              </div>
              <div className="text-xs">
                <div className="text-white font-medium">Logged in as Admin User</div>
                <div className="text-[#568888]">System Administrator</div>
              </div>
            </div>
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
