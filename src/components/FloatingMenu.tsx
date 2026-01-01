import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { MdMenu, MdClose, MdDashboard, MdPeople, MdHowToVote, MdBarChart, MdSettings, MdLogout, MdAdminPanelSettings, MdFingerprint } from "react-icons/md";

interface MenuItem {
  path: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface FloatingMenuProps {
  items: MenuItem[];
  showSettings?: boolean;
  showLogout?: boolean;
  onLogout?: () => void;
  title?: string;
  subtitle?: string;
}

export function FloatingMenu({ 
  items, 
  showSettings = false, 
  showLogout = true, 
  onLogout,
  title = "VOTETECH",
  subtitle 
}: FloatingMenuProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(path + "/");
  };

  return (
    <>
      {/* Floating Hamburger Button - Always visible */}
      <button
        onClick={() => setIsMenuOpen(true)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-[#13ecec] hover:bg-[#0fd6d6] text-[#112222] rounded-full shadow-lg flex items-center justify-center z-40 transition-all hover:scale-110"
        aria-label="Open navigation menu"
      >
        <MdMenu className="w-6 h-6" />
      </button>

      {/* Hamburger Menu Modal */}
      {isMenuOpen && (
        <>
          {/* Overlay */}
          <div
            className="fixed inset-0 bg-black/50 z-50"
            onClick={() => setIsMenuOpen(false)}
          />
          
          {/* Menu Modal */}
          <div className="fixed inset-y-0 right-0 w-80 bg-[#142828] border-l border-[#234848] z-50 shadow-2xl overflow-y-auto">
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="p-6 border-b border-[#234848] flex items-center justify-between sticky top-0 bg-[#142828] z-10">
                <div className="flex items-center gap-3">
                  <MdFingerprint className="w-6 h-6 text-[#13ecec]" />
                  <div>
                    <h2 className="text-xl font-bold text-white">{title}</h2>
                    {subtitle && (
                      <p className="text-xs text-[#568888] uppercase tracking-wider mt-1">{subtitle}</p>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => setIsMenuOpen(false)}
                  className="p-2 text-[#92c9c9] hover:text-white hover:bg-[#1a3333] rounded-lg transition-all"
                  aria-label="Close menu"
                >
                  <MdClose className="w-6 h-6" />
                </button>
              </div>

              {/* Navigation */}
              <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                {items.map((item) => {
                  const Icon = item.icon;
                  const active = isActive(item.path);
                  return (
                    <button
                      key={item.path}
                      onClick={() => {
                        navigate(item.path);
                        setIsMenuOpen(false);
                      }}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                        active
                          ? "bg-[#13ecec] text-[#112222] font-bold"
                          : "text-[#92c9c9] hover:bg-[#1a3333] hover:text-white"
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </nav>

              {/* Footer Actions */}
              {(showSettings || showLogout) && (
                <div className="p-4 border-t border-[#234848] space-y-2">
                  {showSettings && (
                    <button
                      onClick={() => {
                        navigate("/settings");
                        setIsMenuOpen(false);
                      }}
                      className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-[#92c9c9] hover:bg-[#1a3333] hover:text-white transition-all"
                    >
                      <MdSettings className="w-5 h-5" />
                      <span>Settings</span>
                    </button>
                  )}
                  {showLogout && (
                    <button
                      onClick={() => {
                        if (onLogout) {
                          onLogout();
                        } else {
                          navigate("/login");
                        }
                        setIsMenuOpen(false);
                      }}
                      className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-[#92c9c9] hover:bg-[#1a3333] hover:text-white transition-all"
                    >
                      <MdLogout className="w-5 h-5" />
                      <span>Logout</span>
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </>
  );
}

