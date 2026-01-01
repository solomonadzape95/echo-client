import { useNavigate } from "react-router-dom";
import { MdBarChart, MdHowToVote, MdPerson, MdVerified } from "react-icons/md";
import { FloatingMenu } from "../components/FloatingMenu";
import { authService } from "../lib/auth";

export function Stats() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await authService.logout();
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
      navigate("/login");
    }
  };

  const menuItems = [
    { path: "/dashboard", label: "Dashboard", icon: MdBarChart },
    { path: "/elections", label: "Elections", icon: MdHowToVote },
    { path: "/profile", label: "Profile", icon: MdPerson },
    { path: "/stats", label: "Stats", icon: MdBarChart },
    { path: "/verify", label: "Verify Receipt", icon: MdVerified },
  ];

  return (
    <div className="min-h-screen bg-[#102222] p-4 md:p-8 relative">
      {/* Grid pattern overlay */}
      <div
        className="absolute inset-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(to right, #234848 1px, transparent 1px),
            linear-gradient(to bottom, #234848 1px, transparent 1px)
          `,
          backgroundSize: "40px 40px",
        }}
      />

      <div className="max-w-7xl mx-auto relative z-10">
        <h1 className="text-3xl font-bold text-white">Statistics</h1>
        <p className="text-[#92c9c9] mt-4">Stats page content coming soon...</p>
      </div>

      {/* Floating Menu */}
      <FloatingMenu
        items={menuItems}
        title="echo"
        onLogout={handleLogout}
      />
    </div>
  );
}

