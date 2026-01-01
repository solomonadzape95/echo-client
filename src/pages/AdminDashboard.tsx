import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AdminLayout } from "../components/AdminLayout";
import { useAdminStats, useAdminVoters } from "../hooks/useAdmin";
import { 
  MdHowToVote, 
  MdPeople, 
  MdBarChart, 
  MdCheckCircle,
  MdSchedule,
  MdTrendingUp
} from "react-icons/md";

export function AdminDashboard() {
  const navigate = useNavigate();
  const { data: statsResponse, isLoading, isFetching, error } = useAdminStats();
  const { data: votersResponse } = useAdminVoters(); // Get all voters to count unique voters

  // Redirect to admin login if authentication fails
  useEffect(() => {
    if (error) {
      // Check if it's an authentication error (401 or 403)
      const errorMessage = error instanceof Error ? error.message : String(error);
      if (
        errorMessage.includes("401") ||
        errorMessage.includes("403") ||
        errorMessage.includes("Authentication") ||
        errorMessage.includes("Unauthorized") ||
        errorMessage.includes("Admin access required")
      ) {
        navigate("/admin/login", { replace: true });
      }
    }
  }, [error, navigate]);

  // Show loading only on initial load (not on background refetches)
  if (isLoading && !statsResponse) {
    return (
      <AdminLayout>
        <div className="p-8 flex items-center justify-center min-h-[calc(100vh-8rem)]">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-[#13ecec] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-white text-lg">Loading dashboard...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  if (error || !statsResponse?.success) {
    return (
      <AdminLayout>
        <div className="p-8">
          <div className="bg-red-900/20 border border-red-500/50 text-red-400 p-4 rounded-lg">
            <p className="font-medium">Error loading dashboard</p>
            <p className="text-sm mt-1">
              {error instanceof Error ? error.message : "Failed to load dashboard data"}
            </p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  const stats = statsResponse.data;
  
  // Get the actual total number of unique voters in the system
  // This is the count of all voter accounts, not the sum of eligible voters across elections
  const totalUniqueVoters = votersResponse?.success ? votersResponse.data.length : 0;

  return (
    <AdminLayout>
    <div className="p-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">Admin Dashboard</h1>
              <p className="text-[#92c9c9]">Overview of system statistics and activity</p>
            </div>
            {isFetching && (
              <div className="flex items-center gap-2 text-[#568888] text-sm">
                <div className="w-4 h-4 border-2 border-[#13ecec] border-t-transparent rounded-full animate-spin"></div>
                <span>Updating...</span>
              </div>
            )}
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Elections */}
          <div className="bg-[#142828] border border-[#234848] p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-[#13ecec]/20 rounded-lg flex items-center justify-center">
                <MdHowToVote className="w-6 h-6 text-[#13ecec]" />
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-white">{stats.summary.totalElections}</div>
                <div className="text-sm text-[#568888]">Total Elections</div>
              </div>
            </div>
            <div className="flex items-center gap-4 text-xs text-[#92c9c9]">
              <div className="flex items-center gap-1">
                <MdSchedule className="w-4 h-4 text-orange-400" />
                <span>{stats.summary.electionsByStatus.pending} Pending</span>
              </div>
              <div className="flex items-center gap-1">
                <MdTrendingUp className="w-4 h-4 text-[#13ecec]" />
                <span>{stats.summary.electionsByStatus.active} Active</span>
              </div>
            </div>
          </div>

          {/* Total Voters */}
          <div className="bg-[#142828] border border-[#234848] p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-[#13ecec]/20 rounded-lg flex items-center justify-center">
                <MdPeople className="w-6 h-6 text-[#13ecec]" />
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-white">{totalUniqueVoters.toLocaleString()}</div>
                <div className="text-sm text-[#568888]">Total Voters</div>
              </div>
            </div>
            <div className="text-xs text-[#92c9c9]">
              Registered voters in the system
            </div>
          </div>

          {/* Total Votes Cast */}
          <div className="bg-[#142828] border border-[#234848] p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-[#13ecec]/20 rounded-lg flex items-center justify-center">
                <MdCheckCircle className="w-6 h-6 text-[#13ecec]" />
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-white">{stats.summary.totalVotesCast.toLocaleString()}</div>
                <div className="text-sm text-[#568888]">Votes Cast</div>
              </div>
            </div>
            <div className="text-xs text-[#92c9c9]">
              {stats.summary.electionsByStatus.completed} completed elections
            </div>
          </div>

          {/* Overall Turnout */}
          <div className="bg-[#142828] border border-[#234848] p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-[#13ecec]/20 rounded-lg flex items-center justify-center">
                <MdBarChart className="w-6 h-6 text-[#13ecec]" />
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-white">{stats.summary.overallTurnoutPercentage.toFixed(1)}%</div>
                <div className="text-sm text-[#568888]">Overall Turnout</div>
              </div>
            </div>
            <div className="w-full bg-[#102222] rounded-full h-2 mt-2">
              <div
                className="bg-[#13ecec] h-2 rounded-full transition-all"
                style={{ width: `${stats.summary.overallTurnoutPercentage}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Elections by Type */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-[#142828] border border-[#234848] p-6">
            <div className="text-[#568888] text-sm uppercase tracking-wider mb-2">Class Elections</div>
            <div className="text-3xl font-bold text-white mb-2">{stats.summary.electionsByType.class}</div>
            <div className="text-xs text-[#92c9c9]">Department-level voting</div>
          </div>
          <div className="bg-[#142828] border border-[#234848] p-6">
            <div className="text-[#568888] text-sm uppercase tracking-wider mb-2">Department Elections</div>
            <div className="text-3xl font-bold text-white mb-2">{stats.summary.electionsByType.department}</div>
            <div className="text-xs text-[#92c9c9]">Department-level voting</div>
          </div>
          <div className="bg-[#142828] border border-[#234848] p-6">
            <div className="text-[#568888] text-sm uppercase tracking-wider mb-2">Faculty Elections</div>
            <div className="text-3xl font-bold text-white mb-2">{stats.summary.electionsByType.faculty}</div>
            <div className="text-xs text-[#92c9c9]">Campus-wide voting</div>
          </div>
        </div>

        {/* Recent Elections */}
        <div className="bg-[#142828] border border-[#234848] rounded-lg p-6">
          <h2 className="text-xl font-bold text-white mb-4">Recent Elections</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#234848]">
                  <th className="text-left py-3 px-4 text-sm text-[#568888] uppercase tracking-wider">Election</th>
                  <th className="text-left py-3 px-4 text-sm text-[#568888] uppercase tracking-wider">Type</th>
                  <th className="text-left py-3 px-4 text-sm text-[#568888] uppercase tracking-wider">Status</th>
                  <th className="text-left py-3 px-4 text-sm text-[#568888] uppercase tracking-wider">Votes Cast</th>
                  <th className="text-left py-3 px-4 text-sm text-[#568888] uppercase tracking-wider">Turnout</th>
                </tr>
              </thead>
              <tbody>
                {stats.elections.slice(0, 10).map((election) => (
                  <tr key={election.electionId} className="border-b border-[#234848] hover:bg-[#1a3333] transition-colors">
                    <td className="py-3 px-4 text-white font-medium">{election.electionName}</td>
                    <td className="py-3 px-4 text-[#92c9c9] text-sm capitalize">{election.electionType}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium ${
                          election.electionStatus === "active"
                            ? "bg-[#13ecec]/20 text-[#13ecec]"
                            : election.electionStatus === "completed"
                            ? "bg-green-500/20 text-green-400"
                            : "bg-orange-500/20 text-orange-400"
                        }`}
                      >
                        {election.electionStatus.toUpperCase()}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-[#92c9c9]">
                      {election.votesCast} / {election.eligibleVoters}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <div className="w-16 bg-[#102222] rounded-full h-2">
                          <div
                            className="bg-[#13ecec] h-2 rounded-full"
                            style={{ width: `${election.turnoutPercentage}%` }}
                          ></div>
                        </div>
                        <span className="text-[#92c9c9] text-sm">{election.turnoutPercentage.toFixed(1)}%</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
    </div>
    </AdminLayout>
  );
}
