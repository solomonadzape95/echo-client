import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { MdLogout } from "react-icons/md";
import { ActiveElectionCard } from "../components/ActiveElectionCard";
import { UpcomingElectionCard } from "../components/UpcomingElectionCard";
import { ProfileCard } from "../components/ProfileCard";
import { StatsCard } from "../components/StatsCard";
import { ElectionsCard } from "../components/ElectionsCard";
import { authService } from "../lib/auth";

export function Dashboard() {
  const navigate = useNavigate();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await authService.logout();
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
      // Still navigate to login even if logout request fails
      navigate("/login");
    } finally {
      setIsLoggingOut(false);
    }
  };

  // Example data - replace with actual data from API
  const activeElection = {
    id: "1",
    title: "Student Government Election 2024",
    description: "Your voice shapes the future of our campus. Cast your vote for representatives and propositions before the deadline.",
    endTime: new Date(Date.now() + 4 * 60 * 60 * 1000 + 12 * 60 * 1000 + 35 * 1000), // 4 hours, 12 minutes, 35 seconds from now
  };

  const upcomingElection = {
    title: "Class Representative Election",
    description: "Vote for your class representatives. Election starts soon.",
    startDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
  };

  return (
    <div className="h-screen bg-[#102222] p-4 md:p-8 relative overflow-y-auto lg:overflow-hidden">
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
      
      <div className="max-w-7xl mx-auto h-full relative z-10 flex flex-col">
        {/* Logout Button */}
        <div className="flex justify-end mb-4">
          <button
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="px-4 py-2 bg-[#234848] hover:bg-[#2a5050] text-white rounded font-medium uppercase tracking-wide flex items-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <MdLogout className="w-5 h-5" />
            <span>{isLoggingOut ? "LOGGING OUT..." : "LOGOUT"}</span>
          </button>
        </div>

        <div className="flex flex-col gap-4 md:gap-6 flex-1 min-h-0">
          {/* Active Election - Full width */}
          <div className="flex-shrink-0">
            <ActiveElectionCard
              id={activeElection.id}
              title={activeElection.title}
              description={activeElection.description}
              endTime={activeElection.endTime}
              onVote={() => navigate(`/elections/${activeElection.id}`)}
            />
          </div>

          {/* Upcoming Election - Full width, below active */}
          <div className="flex-shrink-0">
            <UpcomingElectionCard
              title={upcomingElection.title}
              description={upcomingElection.description}
              startDate={upcomingElection.startDate}
              onView={() => navigate("/elections")}
            />
          </div>

          {/* Smaller square cards - Profile, Stats, Elections */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6 flex-1 h-screen lg:h-auto lg:min-h-0">
            <ProfileCard />
            <StatsCard />
            <ElectionsCard />
          </div>
        </div>
      </div>
    </div>
  );
}

