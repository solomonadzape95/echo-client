import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AdminLayout } from "../components/AdminLayout";
import { useAdminVoters, useAdminVoter } from "../hooks/useAdmin";
import { useQuery } from "@tanstack/react-query";
import { api } from "../lib/api";
import type { ApiResponse } from "../lib/api";
import { MdSearch, MdPerson, MdSchool, MdCalendarToday, MdHowToVote } from "react-icons/md";

export function AdminVoters() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedClassId, setSelectedClassId] = useState<string | undefined>(undefined);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const { data: votersResponse, isLoading } = useAdminVoters(selectedClassId);

  const voters = votersResponse?.success ? votersResponse.data : [];
  const filteredVoters = voters.filter((voter) =>
    voter.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
    voter.regNumber.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Pagination calculations
  const totalPages = Math.ceil(filteredVoters.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedVoters = filteredVoters.slice(startIndex, endIndex);

  // Reset to page 1 when search or filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedClassId]);

  return (
    <AdminLayout>
      <div className="p-8">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Voters</h1>
            <p className="text-[#92c9c9]">Manage and view all registered voters</p>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="mb-6 flex gap-4">
          <div className="flex-1 relative">
            <MdSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#568888]" />
            <input
              type="text"
              placeholder="Search by username or registration number..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-[#142828] border border-[#234848] rounded-lg text-white placeholder:text-[#568888] focus:outline-none focus:border-[#13ecec]"
            />
          </div>
          <button
            onClick={() => setSelectedClassId(undefined)}
            className={`px-4 py-3 rounded-lg border transition-all ${
              !selectedClassId
                ? "bg-[#13ecec] text-[#112222] border-[#13ecec] font-bold"
                : "bg-[#142828] text-[#92c9c9] border-[#234848] hover:border-[#13ecec]"
            }`}
          >
            All Classes
          </button>
        </div>

        {/* Voters List */}
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="w-16 h-16 border-4 border-[#13ecec] border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : filteredVoters.length === 0 ? (
          <div className="bg-[#142828] border border-[#234848] rounded-lg p-12 text-center">
            <MdPerson className="w-16 h-16 text-[#568888] mx-auto mb-4" />
            <p className="text-[#92c9c9] text-lg mb-2">No voters found</p>
            <p className="text-[#568888] text-sm">
              {searchQuery ? "Try adjusting your search query" : "No voters registered yet"}
            </p>
          </div>
        ) : (
          <div className="bg-[#142828] border border-[#234848] rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[#234848] bg-[#102222]">
                    <th className="text-left py-4 px-6 text-sm text-[#568888] uppercase tracking-wider font-bold">
                      Voter
                    </th>
                    <th className="text-left py-4 px-6 text-sm text-[#568888] uppercase tracking-wider font-bold">
                      Registration Number
                    </th>
                    <th className="text-left py-4 px-6 text-sm text-[#568888] uppercase tracking-wider font-bold">
                      Class
                    </th>
                    <th className="text-left py-4 px-6 text-sm text-[#568888] uppercase tracking-wider font-bold">
                      Registered
                    </th>
                    <th className="text-left py-4 px-6 text-sm text-[#568888] uppercase tracking-wider font-bold">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedVoters.map((voter) => (
                    <tr
                      key={voter.id}
                      className="border-b border-[#234848] hover:bg-[#1a3333] transition-colors cursor-pointer"
                      onClick={() => navigate(`/admin/voters/${voter.id}`)}
                    >
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          {voter.profilePicture ? (
                            <img
                              src={voter.profilePicture}
                              alt={voter.username}
                              className="w-10 h-10 rounded-full object-cover border-2 border-[#13ecec]"
                              onError={(e) => {
                                // Fallback to initials if image fails to load
                                const target = e.target as HTMLImageElement;
                                target.style.display = 'none';
                                const fallback = target.nextElementSibling as HTMLElement;
                                if (fallback) fallback.style.display = 'flex';
                              }}
                            />
                          ) : null}
                          <div
                            className={`w-10 h-10 bg-[#13ecec] rounded-full flex items-center justify-center text-[#112222] font-bold ${voter.profilePicture ? 'hidden' : ''}`}
                          >
                            {voter.username.substring(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <div className="text-white font-medium">{voter.username}</div>
                            <div className="text-[#568888] text-xs">ID: {voter.id.substring(0, 8)}...</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-[#92c9c9] font-mono text-sm">{voter.regNumber}</td>
                      <td className="py-4 px-6 text-[#92c9c9]">{voter.class || "N/A"}</td>
                      <td className="py-4 px-6 text-[#92c9c9] text-sm">
                        {new Date(voter.createdAt).toLocaleDateString()}
                      </td>
                      <td className="py-4 px-6">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/admin/voters/${voter.id}`);
                          }}
                          className="px-4 py-2 bg-[#13ecec] hover:bg-[#0fd6d6] text-[#112222] font-bold rounded text-sm transition-all"
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Pagination */}
        {filteredVoters.length > itemsPerPage && (
          <div className="mt-6 flex items-center justify-between">
            <div className="text-[#568888] text-sm">
              Showing {startIndex + 1} to {Math.min(endIndex, filteredVoters.length)} of {filteredVoters.length} voters
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 bg-[#142828] border border-[#234848] text-white rounded disabled:opacity-50 disabled:cursor-not-allowed hover:border-[#13ecec] transition-all"
              >
                Previous
              </button>
              <div className="flex items-center gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-3 py-2 rounded ${
                      currentPage === page
                        ? "bg-[#13ecec] text-[#112222] font-bold"
                        : "bg-[#142828] border border-[#234848] text-white hover:border-[#13ecec]"
                    } transition-all`}
                  >
                    {page}
                  </button>
                ))}
              </div>
              <button
                onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 bg-[#142828] border border-[#234848] text-white rounded disabled:opacity-50 disabled:cursor-not-allowed hover:border-[#13ecec] transition-all"
              >
                Next
              </button>
            </div>
          </div>
        )}

        {/* Stats Footer */}
        {votersResponse?.success && filteredVoters.length <= itemsPerPage && (
          <div className="mt-6 text-center text-[#568888] text-sm">
            Showing {filteredVoters.length} of {voters.length} voters
          </div>
        )}
      </div>
    </AdminLayout>
  );
}

export function AdminVoterDetail() {
  const navigate = useNavigate();
  const voterId = window.location.pathname.split("/").pop();
  const { data: voterResponse, isLoading, error } = useAdminVoter(voterId);
  
  // Fetch voting history
  const { data: votingHistoryResponse } = useQuery({
    queryKey: ["admin", "stats", "voter", voterId],
    queryFn: async () => {
      if (!voterId) throw new Error("Voter ID is required");
      const response = await api.get<ApiResponse<{
        voterId: string;
        totalEligibleElections: number;
        totalElectionsVotedIn: number;
        participationRate: number;
        elections: Array<{
          electionId: string;
          electionName: string;
          electionType: string;
          electionStatus: string;
          hasVoted: boolean;
          eligibleVoters: number;
          votesCast: number;
          turnoutPercentage: number;
        }>;
      }>>(`/admin/stats/voter/${voterId}`);
      return response;
    },
    enabled: !!voterId,
  });
  
  const votingHistory = votingHistoryResponse?.success ? votingHistoryResponse.data : null;

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="p-8 flex items-center justify-center min-h-[calc(100vh-8rem)]">
          <div className="w-16 h-16 border-4 border-[#13ecec] border-t-transparent rounded-full animate-spin"></div>
        </div>
      </AdminLayout>
    );
  }

  if (error || !voterResponse?.success) {
    return (
      <AdminLayout>
        <div className="p-8">
          <div className="bg-red-900/20 border border-red-500/50 text-red-400 p-4 rounded-lg">
            <p className="font-medium">Error loading voter</p>
            <p className="text-sm mt-1">
              {error instanceof Error ? error.message : "Voter not found"}
            </p>
            <button
              onClick={() => navigate("/admin/voters")}
              className="mt-4 px-4 py-2 bg-[#234848] text-white rounded hover:bg-[#2a5555] transition-colors"
            >
              Back to Voters
            </button>
          </div>
        </div>
      </AdminLayout>
    );
  }

  const voter = voterResponse.data;

  return (
    <AdminLayout>
      <div className="p-8">
        {/* Back Button */}
        <button
          onClick={() => navigate("/admin/voters")}
          className="mb-6 text-[#92c9c9] hover:text-white flex items-center gap-2 transition-colors"
        >
          <span>← Back to Voters</span>
        </button>

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            {voter.profilePicture ? (
              <img
                src={voter.profilePicture}
                alt={voter.username}
                className="w-20 h-20 rounded-full object-cover border-2 border-[#13ecec]"
                onError={(e) => {
                  // Fallback to initials if image fails to load
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  const fallback = target.nextElementSibling as HTMLElement;
                  if (fallback) fallback.style.display = 'flex';
                }}
              />
            ) : null}
            <div
              className={`w-20 h-20 bg-[#13ecec] rounded-full flex items-center justify-center text-[#112222] font-bold text-2xl ${voter.profilePicture ? 'hidden' : ''}`}
            >
              {voter.username.substring(0, 2).toUpperCase()}
            </div>
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">{voter.username}</h1>
              <p className="text-[#92c9c9]">Voter Details</p>
            </div>
          </div>
        </div>

        {/* Details Card */}
        <div className="bg-[#142828] border border-[#234848] rounded-lg p-6 mb-6">
          <h2 className="text-xl font-bold text-white mb-6">Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div className="text-[#568888] text-sm uppercase tracking-wider mb-2">Registration Number</div>
              <div className="text-white font-mono text-lg">{voter.regNumber}</div>
            </div>
            <div>
              <div className="text-[#568888] text-sm uppercase tracking-wider mb-2">Voter ID</div>
              <div className="text-white font-mono text-sm">{voter.id}</div>
            </div>
            <div>
              <div className="text-[#568888] text-sm uppercase tracking-wider mb-2">Class</div>
              <div className="text-white">{voter.class || "Not assigned"}</div>
              {voter.classDetails && (
                <div className="text-[#92c9c9] text-sm mt-1">
                  {voter.classDetails.department && `Dept: ${voter.classDetails.department} • `}
                  {voter.classDetails.faculty && `Faculty: ${voter.classDetails.faculty}`}
                </div>
              )}
            </div>
            <div>
              <div className="text-[#568888] text-sm uppercase tracking-wider mb-2">Registered</div>
              <div className="text-white">
                {new Date(voter.createdAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Voting History */}
        <div className="bg-[#142828] border border-[#234848] rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-white">Voting History</h2>
            {votingHistory && (
              <div className="text-sm text-[#568888]">
                {votingHistory.totalElectionsVotedIn} of {votingHistory.totalEligibleElections} elections ({votingHistory.participationRate.toFixed(1)}% participation)
              </div>
            )}
          </div>
          {votingHistory && votingHistory.elections.length > 0 ? (
            <div className="space-y-3">
              {votingHistory.elections.map((election) => (
                <div
                  key={election.electionId}
                  className="bg-[#102222] border border-[#234848] rounded-lg p-4 hover:border-[#13ecec] transition-all cursor-pointer"
                  onClick={() => navigate(`/admin/elections/${election.electionId}`)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-white font-bold">{election.electionName}</h3>
                        {election.hasVoted && (
                          <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded text-xs font-medium">
                            VOTED
                          </span>
                        )}
                        <span className="px-2 py-1 bg-[#234848] text-[#92c9c9] rounded text-xs capitalize">
                          {election.electionType}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-[#568888]">
                        <span>Status: {election.electionStatus}</span>
                        <span>Turnout: {election.turnoutPercentage.toFixed(1)}%</span>
                      </div>
                    </div>
                    <MdHowToVote className="w-5 h-5 text-[#13ecec]" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-[#568888]">
              <p>No voting history available</p>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}

