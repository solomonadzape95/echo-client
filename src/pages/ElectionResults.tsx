import { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { MdArrowBack, MdBarChart, MdTrendingUp, MdHowToVote, MdPerson, MdVerified, MdRefresh } from "react-icons/md";
import { FloatingMenu } from "../components/FloatingMenu";
import { FloatingHelpButton } from "../components/FloatingHelpButton";
import { Footer } from "../components/Footer";
import { AdminLayout } from "../components/AdminLayout";
import { authService } from "../lib/auth";
import { useElectionResults, useCalculateResults } from "../hooks/useAdmin";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "../hooks/useToast";
import { dashboardHelpSteps } from "../constants/helpContent";
import { api } from "../lib/api";
import type { ApiResponse } from "../lib/api";

type OfficeFilter = "all" | string;

interface CandidateResult {
  candidateId: string;
  candidateName: string;
  voteCount: number;
  percentage: number;
  isWinner: boolean;
  image?: string;
}

interface OfficeResult {
  officeId: string;
  officeName: string;
  officeDescription: string;
  totalVotes: number;
  candidates: CandidateResult[];
}

export function ElectionResults() {
  const navigate = useNavigate();
  const location = useLocation();
  const { id: electionId } = useParams();
  const [officeFilter, setOfficeFilter] = useState<OfficeFilter>("all");
  const { showToast, ToastContainer } = useToast();
  
  // Check if this is an admin view
  const isAdminView = location.pathname.startsWith("/admin");
  
  // Fetch results
  const { data: resultsResponse, isLoading: isLoadingResults, refetch: refetchResults } = useElectionResults(electionId);
  const calculateResults = useCalculateResults();
  
  // Auto-calculate results if admin and results don't exist
  useEffect(() => {
    if (isAdminView && resultsResponse?.success && !resultsResponse.data.hasResults && !calculateResults.isPending) {
      // Auto-calculate results for admin
      calculateResults.mutateAsync(electionId!).then(() => {
        refetchResults();
      }).catch((error) => {
        console.error("Failed to calculate results:", error);
      });
    }
  }, [isAdminView, resultsResponse, electionId, calculateResults, refetchResults]);

  const handleLogout = async () => {
    try {
      await authService.logout();
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
      navigate("/login");
    }
  };

  const handleCalculateResults = async () => {
    if (!electionId) return;
    try {
      await calculateResults.mutateAsync(electionId);
      showToast("Results calculated successfully", "success");
      refetchResults();
    } catch (error) {
      showToast(error instanceof Error ? error.message : "Failed to calculate results", "error");
    }
  };

  const menuItems = [
    { path: "/dashboard", label: "Dashboard", icon: MdBarChart },
    { path: "/elections", label: "Elections", icon: MdHowToVote },
    { path: "/profile", label: "Profile", icon: MdPerson },
    { path: "/verify", label: "Verify Receipt", icon: MdVerified },
  ];

  // Get election info
  const { data: electionResponse } = useQuery({
    queryKey: ["election", electionId],
    queryFn: async () => {
      if (!electionId) throw new Error("Election ID is required");
      const response = await api.get<ApiResponse<any>>(`/election/${electionId}`);
      return response;
    },
    enabled: !!electionId,
  });

  const election = electionResponse?.success ? electionResponse.data : null;
  const results = resultsResponse?.success ? resultsResponse.data : null;

  // Transform API results to component format
  const allResults: OfficeResult[] = results?.offices || [];
  
  // Get unique office names for filter
  const officeNames = allResults.map(r => r.officeName.toLowerCase());
  const uniqueOfficeNames = ["all", ...new Set(officeNames)];

  // Calculate summary statistics
  const totalVotesCast = allResults.reduce(
    (sum, office) => sum + office.totalVotes,
    0
  );

  const filteredResults = officeFilter === "all" 
    ? allResults 
    : allResults.filter((r) => r.officeName.toLowerCase() === officeFilter);

  const formatNumber = (num: number) => {
    return num.toLocaleString();
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleString();
  };

  // Loading state
  if (isLoadingResults || calculateResults.isPending) {
    const content = (
      <div className="flex items-center justify-center min-h-[calc(100vh-8rem)]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#13ecec] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-lg">
            {calculateResults.isPending ? "Counting votes..." : "Loading results..."}
          </p>
        </div>
      </div>
    );

    return isAdminView ? (
      <AdminLayout>
        <ToastContainer />
        {content}
      </AdminLayout>
    ) : (
      <div className="min-h-full w-full bg-[#102222] relative overflow-y-auto overflow-x-hidden">
        <ToastContainer />
        {content}
      </div>
    );
  }

  // No results state
  if (resultsResponse?.success && !resultsResponse.data.hasResults) {
    const content = (
      <div className="p-8">
        <button
          onClick={() => navigate(isAdminView ? "/admin/elections" : "/elections")}
          className="mb-6 text-[#92c9c9] hover:text-white flex items-center gap-2 transition-colors"
        >
          <MdArrowBack className="w-5 h-5" />
          <span>Back</span>
        </button>

        <div className="bg-[#142828] border border-[#234848] rounded-lg p-8 text-center">
          <MdBarChart className="w-16 h-16 text-[#92c9c9] mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Results Not Available</h2>
          <p className="text-[#92c9c9] mb-6">
            {resultsResponse.data.message || "Results have not been calculated yet."}
          </p>
          {isAdminView && (
            <button
              onClick={handleCalculateResults}
              disabled={calculateResults.isPending}
              className="px-6 py-3 bg-[#13ecec] hover:bg-[#0fd6d6] text-[#112222] font-bold rounded-lg disabled:opacity-50 flex items-center gap-2 mx-auto"
            >
              <MdRefresh className="w-5 h-5" />
              {calculateResults.isPending ? "Calculating..." : "Calculate Results"}
            </button>
          )}
        </div>
      </div>
    );

    return isAdminView ? (
      <AdminLayout>
        <ToastContainer />
        {content}
      </AdminLayout>
    ) : (
      <div className="min-h-full w-full bg-[#102222] relative overflow-y-auto overflow-x-hidden">
        <ToastContainer />
        {content}
      </div>
    );
  }

  // Error state
  if (resultsResponse && !resultsResponse.success) {
    const content = (
      <div className="p-8">
        <button
          onClick={() => navigate(isAdminView ? "/admin/elections" : "/elections")}
          className="mb-6 text-[#92c9c9] hover:text-white flex items-center gap-2 transition-colors"
        >
          <MdArrowBack className="w-5 h-5" />
          <span>Back</span>
        </button>

        <div className="bg-red-900/20 border border-red-500/50 text-red-400 p-4 rounded-lg">
          <p className="font-medium">Error loading results</p>
          <p className="text-sm mt-2">{resultsResponse.message}</p>
        </div>
      </div>
    );

    return isAdminView ? (
      <AdminLayout>
        <ToastContainer />
        {content}
      </AdminLayout>
    ) : (
      <div className="min-h-full w-full bg-[#102222] relative overflow-y-auto overflow-x-hidden">
        <ToastContainer />
        {content}
      </div>
    );
  }

  const mainContent = (
    <div className="min-h-full w-full bg-[#102222] relative overflow-y-auto overflow-x-hidden">
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

      <div className="max-w-7xl mx-auto relative z-10 p-4 md:p-8 pb-20">
        {/* Header with Back Button */}
        <div className="mb-6">
          <button
            onClick={() => navigate(isAdminView ? "/admin/elections" : "/elections")}
            className="flex items-center gap-2 text-[#92c9c9] hover:text-white transition-colors mb-4"
          >
            <MdArrowBack className="w-5 h-5" />
            <span className="text-sm font-medium">Back</span>
          </button>

          {/* Title and Info */}
          <div className="mb-6">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-2">
              {election?.name || results?.electionName || "Election Results"}
            </h1>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#13ecec] mb-4">
              Results
            </h2>
            <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
              {results?.calculatedAt && (
                <span className="text-sm text-[#92c9c9]">
                  Calculated: {formatDate(results.calculatedAt)}
                </span>
              )}
              {isAdminView && (
                <button
                  onClick={handleCalculateResults}
                  disabled={calculateResults.isPending}
                  className="px-4 py-2 bg-[#234848] hover:bg-[#2a5555] text-white rounded text-sm transition-all flex items-center gap-2 disabled:opacity-50"
                >
                  <MdRefresh className="w-4 h-4" />
                  {calculateResults.isPending ? "Recalculating..." : "Recalculate"}
                </button>
              )}
            </div>
          </div>

          {/* Summary Statistics */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            {/* Total Votes */}
            <div className="bg-[#1a2a2a] border border-[#234848] p-6 rounded">
              <div className="flex items-center justify-between mb-3">
                <div className="text-white text-xs uppercase tracking-wider font-medium">TOTAL VOTES</div>
                <MdBarChart className="w-5 h-5 text-[#13ecec]" />
              </div>
              <div className="text-4xl font-bold text-white mb-3">{formatNumber(totalVotesCast)}</div>
              <div className="text-sm text-[#92c9c9]">Across all offices</div>
            </div>

            {/* Offices */}
            <div className="bg-[#1a2a2a] border border-[#234848] p-6 rounded">
              <div className="flex items-center justify-between mb-3">
                <div className="text-white text-xs uppercase tracking-wider font-medium">OFFICES</div>
                <MdHowToVote className="w-5 h-5 text-[#13ecec]" />
              </div>
              <div className="text-4xl font-bold text-white mb-3">{allResults.length}</div>
              <div className="text-sm text-[#92c9c9]">Contested positions</div>
            </div>

            {/* Candidates */}
            <div className="bg-[#1a2a2a] border border-[#234848] p-6 rounded">
              <div className="flex items-center justify-between mb-3">
                <div className="text-white text-xs uppercase tracking-wider font-medium">CANDIDATES</div>
                <MdPerson className="w-5 h-5 text-[#13ecec]" />
              </div>
              <div className="text-4xl font-bold text-white mb-3">
                {formatNumber(allResults.reduce((sum, office) => sum + office.candidates.length, 0))}
              </div>
              <div className="text-sm text-[#92c9c9]">Total candidates</div>
            </div>
          </div>

          {/* Office Filter Tabs */}
          {uniqueOfficeNames.length > 1 && (
          <div className="mb-6 flex gap-2 overflow-x-auto">
              {uniqueOfficeNames.map((officeName) => (
            <button
                  key={officeName}
                  onClick={() => setOfficeFilter(officeName)}
              className={`px-4 py-2 font-bold text-sm uppercase tracking-wider transition-colors whitespace-nowrap ${
                    officeFilter === officeName
                  ? "bg-[#13ecec] text-[#112222]"
                  : "bg-[#142828] border border-[#234848] text-[#92c9c9] hover:text-white"
              }`}
            >
                  {officeName === "all" ? "ALL OFFICES" : officeName.toUpperCase()}
            </button>
              ))}
          </div>
          )}
        </div>

        {/* Results Display */}
        <div className="space-y-8">
          {filteredResults.length === 0 ? (
            <div className="bg-[#142828] border border-[#234848] p-8 text-center">
              <p className="text-[#92c9c9]">No results to display</p>
            </div>
          ) : (
            filteredResults.map((officeResult) => {
              const sortedCandidates = [...officeResult.candidates].sort((a, b) => b.voteCount - a.voteCount);
            const leadingCandidate = sortedCandidates[0];
            const maxVotes = leadingCandidate?.voteCount || 0;
            // Check for ties - multiple candidates with the same highest vote count
            const tiedCandidates = sortedCandidates.filter(c => c.voteCount === maxVotes && maxVotes > 0);
            const isTie = tiedCandidates.length > 1;

            return (
                <div key={officeResult.officeId} className="bg-[#142828] border border-[#234848] p-6 rounded-lg">
                {/* Office Header */}
                <div className="flex items-center justify-between mb-6">
                    <div>
                      <h2 className="text-2xl md:text-3xl font-bold text-white uppercase mb-2">
                        {officeResult.officeName}
                  </h2>
                      {officeResult.officeDescription && (
                        <p className="text-[#92c9c9] text-sm">{officeResult.officeDescription}</p>
                      )}
                      {isTie && (
                        <p className="text-[#13ecec] text-sm font-bold mt-2">⚠️ TIE - Multiple candidates tied for first place</p>
                      )}
                    </div>
                    <div className="bg-[#234848] text-[#92c9c9] text-xs font-bold px-3 py-1 uppercase tracking-wider rounded">
                      {officeResult.totalVotes} TOTAL VOTES
                    </div>
                </div>

                {/* Candidates List */}
                <div className="space-y-3">
                  {sortedCandidates.map((candidate, candidateIndex) => {
                      const isLeading = candidate.isWinner || (candidateIndex === 0 && !isTie);
                      const isTied = isTie && candidate.voteCount === maxVotes;
                    return (
                      <div
                          key={candidate.candidateId}
                          className={`bg-[#1a2a2a] border p-4 rounded ${
                            isTied ? "border-yellow-500" : isLeading ? "border-[#13ecec]" : "border-[#234848]"
                          }`}
                      >
                        <div className="flex items-center gap-4">
                            {/* Candidate Info */}
                            <div className="flex-1 min-w-[220px]">
                              <div className="flex items-center gap-2 mb-1">
                                <h3 className="text-xl font-bold text-white">{candidate.candidateName}</h3>
                                {isTied && (
                                  <span className="px-2 py-0.5 bg-yellow-500 text-[#112222] text-xs font-bold rounded">
                                    TIE
                                  </span>
                                )}
                                {candidate.isWinner && !isTied && (
                                  <span className="px-2 py-0.5 bg-[#13ecec] text-[#112222] text-xs font-bold rounded">
                                    WINNER
                                  </span>
                                )}
                              </div>
                          </div>

                            {/* Progress Bar */}
                          <div className="flex-1 relative h-12">
                            <div className="absolute inset-0 flex items-center">
                              <div
                                className={`h-full flex items-center ${
                                  isTied ? "bg-yellow-500" : isLeading ? "bg-[#13ecec]" : "bg-[#234848]"
                                }`}
                                  style={{ width: `${Math.min(candidate.percentage, 100)}%` }}
                              >
                                {(isLeading || isTied) && (
                                  <MdBarChart className="w-5 h-5 text-[#112222] ml-2" />
                                )}
                              </div>
                            </div>
                          </div>

                            {/* Vote Stats */}
                          <div className="flex-shrink-0 text-right min-w-[140px]">
                            <div className={`text-2xl font-bold mb-1 ${isTied ? "text-yellow-500" : isLeading ? "text-[#13ecec]" : "text-[#92c9c9]"}`}>
                              {candidate.percentage.toFixed(1)}%
                            </div>
                              <div className="text-white text-xl font-bold">{formatNumber(candidate.voteCount)}</div>
                            <div className="text-white text-sm">VOTES</div>
                            </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
            })
          )}
        </div>
      </div>

      {/* Floating Menu (only for user view) */}
      {!isAdminView && (
        <>
          <FloatingMenu
            items={menuItems}
            title="echo"
            onLogout={handleLogout}
          />
          <FloatingHelpButton
            steps={dashboardHelpSteps}
            title="Platform Guide"
            position="dashboard"
          />
          <Footer />
        </>
      )}
    </div>
  );

  return isAdminView ? (
    <AdminLayout>
      <ToastContainer />
      {mainContent}
    </AdminLayout>
  ) : (
    <>
      <ToastContainer />
      {mainContent}
    </>
  );
}
