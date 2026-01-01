import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { MdLogout, MdBarChart, MdHowToVote, MdPerson, MdCheckCircle, MdVerified } from "react-icons/md";
import { ActiveElectionCard } from "../components/ActiveElectionCard";
import { UpcomingElectionCard } from "../components/UpcomingElectionCard";
import { ProfileCard } from "../components/ProfileCard";
import { StatsCard } from "../components/StatsCard";
import { ElectionsCard } from "../components/ElectionsCard";
import { FloatingMenu } from "../components/FloatingMenu";
import { authService } from "../lib/auth";
import { useDashboard } from "../hooks/useDashboard";

export function Dashboard() {
  const navigate = useNavigate();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const { data: dashboardResponse, isLoading, error } = useDashboard();

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

  if (isLoading) {
    return (
      <div className="h-screen bg-[#102222] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#13ecec] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error || !dashboardResponse?.success) {
    return (
      <div className="h-screen bg-[#102222] flex items-center justify-center p-4">
        <div className="text-center">
          <p className="text-red-400 text-lg mb-4">
            {error instanceof Error ? error.message : "Failed to load dashboard"}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-[#13ecec] text-[#112222] rounded font-medium"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const dashboardData = dashboardResponse.data;
  const activeElection = dashboardData.activeElection;
  const upcomingElection = dashboardData.upcomingElection;

  const menuItems = [
    { path: "/dashboard", label: "Dashboard", icon: MdBarChart },
    { path: "/elections", label: "Elections", icon: MdHowToVote },
    { path: "/profile", label: "Profile", icon: MdPerson },
  //  { path: "/stats", label: "Stats", icon: MdBarChart },
    { path: "/verify", label: "Verify Receipt", icon: MdVerified },
  ];

  return (
    <div className="min-h-screen bg-[#102222] p-4 md:p-8 relative">
      {/* Grid pattern overlay */}
      <div
        className="fixed inset-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(to right, #234848 1px, transparent 1px),
            linear-gradient(to bottom, #234848 1px, transparent 1px)
          `,
          backgroundSize: "40px 40px",
        }}
      />
      
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Logout Button and User Info */}
        <div className="flex justify-between items-center mb-4">
          {dashboardData.profile && (
            <div className="text-[#92c9c9] text-lg">
              <span>Logged in as </span>
              <span className="font-bold text-white uppercase">{dashboardData.profile.name}</span>
            </div>
          )}
          <button
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="px-4 py-2 bg-[#234848] hover:bg-[#2a5050] text-white rounded font-medium uppercase tracking-wide flex items-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <MdLogout className="w-5 h-5" />
            <span>{isLoggingOut ? "LOGGING OUT..." : "LOGOUT"}</span>
          </button>
        </div>

        <div className="flex flex-col gap-4 md:gap-6 pb-8">
          {/* Active Election - Full width */}
          {activeElection && (
            <div>
              <ActiveElectionCard
                id={activeElection.id}
                title={activeElection.name}
                description={activeElection.description}
                endTime={new Date(activeElection.endDate)}
                onVote={() => navigate(`/elections/${activeElection.id}`)}
              />
            </div>
          )}

          {/* Upcoming Election - Full width, below active */}
          {upcomingElection && (
            <div>
              <UpcomingElectionCard
                title={upcomingElection.name}
                description={upcomingElection.description}
                startDate={new Date(upcomingElection.startDate)}
                onView={() => navigate("/elections")}
              />
            </div>
          )}
 {/* Election Stats Section */}
 <div className="bg-[#142828] border border-[#234848] p-6 md:p-8 rounded-lg">
            <div className="flex items-center gap-3 mb-6">
              <MdBarChart className="w-6 h-6 text-[#13ecec]" />
              <h2 className="text-2xl font-bold text-white">Election Statistics</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Total Elections */}
              <div className="bg-[#102222] border border-[#234848] p-6 rounded-lg">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-[#234848] flex items-center justify-center">
                    <MdHowToVote className="w-5 h-5 text-[#13ecec]" />
                  </div>
                  <div>
                    <p className="text-[#568888] text-xs uppercase tracking-wider">Total Elections</p>
                    <p className="text-2xl font-bold text-white">{dashboardData.stats.totalElections}</p>
                  </div>
                </div>
                <p className="text-[#92c9c9] text-sm">All elections in the system</p>
              </div>

              {/* Eligible Elections */}
              <div className="bg-[#102222] border border-[#234848] p-6 rounded-lg">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-[#234848] flex items-center justify-center">
                    <MdCheckCircle className="w-5 h-5 text-[#13ecec]" />
                  </div>
                  <div>
                    <p className="text-[#568888] text-xs uppercase tracking-wider">Eligible Elections</p>
                    <p className="text-2xl font-bold text-white">{dashboardData.stats.eligibleElections}</p>
                  </div>
                </div>
                <p className="text-[#92c9c9] text-sm">Elections you can vote in</p>
              </div>

              {/* Elections Voted In */}
              <div className="bg-[#102222] border border-[#234848] p-6 rounded-lg">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-[#234848] flex items-center justify-center">
                    <MdPerson className="w-5 h-5 text-[#13ecec]" />
                  </div>
                  <div>
                    <p className="text-[#568888] text-xs uppercase tracking-wider">Elections Voted</p>
                    <p className="text-2xl font-bold text-white">{dashboardData.stats.electionsVotedIn}</p>
                  </div>
                </div>
                <p className="text-[#92c9c9] text-sm">Elections you've participated in</p>
              </div>

              {/* Votes Cast */}
              <div className="bg-[#102222] border border-[#234848] p-6 rounded-lg">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-[#234848] flex items-center justify-center">
                    <MdBarChart className="w-5 h-5 text-[#13ecec]" />
                  </div>
                  <div>
                    <p className="text-[#568888] text-xs uppercase tracking-wider">Votes Cast</p>
                    <p className="text-2xl font-bold text-white">{dashboardData.stats.votesCast}</p>
                  </div>
                </div>
                <p className="text-[#92c9c9] text-sm">Total votes you've cast</p>
              </div>
            </div>

            {/* Progress indicator */}
            {dashboardData.stats.eligibleElections > 0 && (
              <div className="mt-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-[#92c9c9] text-sm">Voting Participation</span>
                  <span className="text-[#13ecec] font-bold">
                    {Math.round((dashboardData.stats.electionsVotedIn / dashboardData.stats.eligibleElections) * 100)}%
                  </span>
                </div>
                <div className="w-full bg-[#102222] rounded-full h-3 overflow-hidden">
                  <div
                    className="bg-[#13ecec] h-full transition-all duration-500"
                    style={{
                      width: `${(dashboardData.stats.electionsVotedIn / dashboardData.stats.eligibleElections) * 100}%`,
                    }}
                  />
                </div>
              </div>
            )}
          </div>
          {/* Smaller square cards - Profile, Stats, Elections */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6 ">
            <ProfileCard />
            <ElectionsCard />
          </div>

         
        </div>
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

