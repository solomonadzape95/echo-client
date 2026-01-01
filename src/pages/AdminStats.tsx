import { AdminLayout } from "../components/AdminLayout";
import { useAdminStats } from "../hooks/useAdmin";
import { MdBarChart, MdHowToVote, MdPeople, MdTrendingUp, MdSchedule, MdCheckCircle } from "react-icons/md";

export function AdminStats() {
  const { data: statsResponse, isLoading, error } = useAdminStats();

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="p-8 flex items-center justify-center min-h-[calc(100vh-8rem)]">
          <div className="w-16 h-16 border-4 border-[#13ecec] border-t-transparent rounded-full animate-spin"></div>
        </div>
      </AdminLayout>
    );
  }

  if (error || !statsResponse?.success) {
    return (
      <AdminLayout>
        <div className="p-8">
          <div className="bg-red-900/20 border border-red-500/50 text-red-400 p-4 rounded-lg">
            <p className="font-medium">Error loading statistics</p>
            <p className="text-sm mt-1">
              {error instanceof Error ? error.message : "Failed to load statistics"}
            </p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  const stats = statsResponse.data;

  return (
    <AdminLayout>
      <div className="p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Statistics</h1>
          <p className="text-[#92c9c9]">Comprehensive analytics and insights</p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-[#142828] border border-[#234848] rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-[#13ecec]/20 rounded-lg flex items-center justify-center">
                <MdHowToVote className="w-6 h-6 text-[#13ecec]" />
              </div>
            </div>
            <div className="text-3xl font-bold text-white mb-1">{stats.summary.totalElections}</div>
            <div className="text-sm text-[#568888]">Total Elections</div>
            <div className="mt-4 flex items-center gap-4 text-xs text-[#92c9c9]">
              <div className="flex items-center gap-1">
                <MdSchedule className="w-4 h-4 text-orange-400" />
                <span>{stats.summary.electionsByStatus.pending} Pending</span>
              </div>
              <div className="flex items-center gap-1">
                <MdTrendingUp className="w-4 h-4 text-[#13ecec]" />
                <span>{stats.summary.electionsByStatus.active} Active</span>
              </div>
              <div className="flex items-center gap-1">
                <MdCheckCircle className="w-4 h-4 text-green-400" />
                <span>{stats.summary.electionsByStatus.completed} Completed</span>
              </div>
            </div>
          </div>

          <div className="bg-[#142828] border border-[#234848] rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-[#13ecec]/20 rounded-lg flex items-center justify-center">
                <MdPeople className="w-6 h-6 text-[#13ecec]" />
              </div>
            </div>
            <div className="text-3xl font-bold text-white mb-1">
              {stats.summary.totalEligibleVoters.toLocaleString()}
            </div>
            <div className="text-sm text-[#568888]">Eligible Voters</div>
            <div className="mt-4 text-xs text-[#92c9c9]">Across all classes and departments</div>
          </div>

          <div className="bg-[#142828] border border-[#234848] rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-[#13ecec]/20 rounded-lg flex items-center justify-center">
                <MdCheckCircle className="w-6 h-6 text-[#13ecec]" />
              </div>
            </div>
            <div className="text-3xl font-bold text-white mb-1">
              {stats.summary.totalVotesCast.toLocaleString()}
            </div>
            <div className="text-sm text-[#568888]">Votes Cast</div>
            <div className="mt-4 text-xs text-[#92c9c9]">
              {stats.summary.electionsByStatus.completed} completed elections
            </div>
          </div>

          <div className="bg-[#142828] border border-[#234848] rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-[#13ecec]/20 rounded-lg flex items-center justify-center">
                <MdBarChart className="w-6 h-6 text-[#13ecec]" />
              </div>
            </div>
            <div className="text-3xl font-bold text-white mb-1">
              {stats.summary.overallTurnoutPercentage.toFixed(1)}%
            </div>
            <div className="text-sm text-[#568888]">Overall Turnout</div>
            <div className="mt-4 w-full bg-[#102222] rounded-full h-2">
              <div
                className="bg-[#13ecec] h-2 rounded-full transition-all"
                style={{ width: `${stats.summary.overallTurnoutPercentage}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Elections by Type */}
        <div className="bg-[#142828] border border-[#234848] rounded-lg p-6 mb-8">
          <h2 className="text-2xl font-bold text-white mb-6">Elections by Type</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-[#102222] border border-[#234848] rounded-lg p-6">
              <div className="text-[#568888] text-sm uppercase tracking-wider mb-2">Class Elections</div>
              <div className="text-4xl font-bold text-white mb-2">{stats.summary.electionsByType.class}</div>
              <div className="text-xs text-[#92c9c9]">Class-level voting</div>
            </div>
            <div className="bg-[#102222] border border-[#234848] rounded-lg p-6">
              <div className="text-[#568888] text-sm uppercase tracking-wider mb-2">Department Elections</div>
              <div className="text-4xl font-bold text-white mb-2">{stats.summary.electionsByType.department}</div>
              <div className="text-xs text-[#92c9c9]">Department-level voting</div>
            </div>
            <div className="bg-[#102222] border border-[#234848] rounded-lg p-6">
              <div className="text-[#568888] text-sm uppercase tracking-wider mb-2">Faculty Elections</div>
              <div className="text-4xl font-bold text-white mb-2">{stats.summary.electionsByType.faculty}</div>
              <div className="text-xs text-[#92c9c9]">Campus-wide voting</div>
            </div>
          </div>
        </div>

        {/* Elections Table */}
        <div className="bg-[#142828] border border-[#234848] rounded-lg p-6">
          <h2 className="text-2xl font-bold text-white mb-6">All Elections</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#234848]">
                  <th className="text-left py-4 px-6 text-sm text-[#568888] uppercase tracking-wider font-bold">
                    Election
                  </th>
                  <th className="text-left py-4 px-6 text-sm text-[#568888] uppercase tracking-wider font-bold">
                    Type
                  </th>
                  <th className="text-left py-4 px-6 text-sm text-[#568888] uppercase tracking-wider font-bold">
                    Status
                  </th>
                  <th className="text-left py-4 px-6 text-sm text-[#568888] uppercase tracking-wider font-bold">
                    Eligible Voters
                  </th>
                  <th className="text-left py-4 px-6 text-sm text-[#568888] uppercase tracking-wider font-bold">
                    Votes Cast
                  </th>
                  <th className="text-left py-4 px-6 text-sm text-[#568888] uppercase tracking-wider font-bold">
                    Turnout
                  </th>
                </tr>
              </thead>
              <tbody>
                {stats.elections.map((election) => (
                  <tr key={election.electionId} className="border-b border-[#234848] hover:bg-[#1a3333] transition-colors">
                    <td className="py-4 px-6 text-white font-medium">{election.electionName}</td>
                    <td className="py-4 px-6 text-[#92c9c9] text-sm capitalize">{election.electionType}</td>
                    <td className="py-4 px-6">
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
                    <td className="py-4 px-6 text-[#92c9c9]">{election.eligibleVoters.toLocaleString()}</td>
                    <td className="py-4 px-6 text-[#92c9c9]">{election.votesCast.toLocaleString()}</td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2">
                        <div className="w-20 bg-[#102222] rounded-full h-2">
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

