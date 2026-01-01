import { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MdArrowBack, MdBarChart, MdHowToVote, MdPerson, MdVerified } from "react-icons/md";
import { useElections } from "../hooks/useElections";
import { FloatingMenu } from "../components/FloatingMenu";
import { FloatingHelpButton } from "../components/FloatingHelpButton";
import { Footer } from "../components/Footer";
import { authService } from "../lib/auth";
import { dashboardHelpSteps } from "../constants/helpContent";

type ElectionStatus = "all" | "upcoming" | "ongoing" | "completed";

export function Elections() {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState<ElectionStatus>("all");
  const { data: electionsResponse, isLoading, error } = useElections();

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
    { path: "/verify", label: "Verify Receipt", icon: MdVerified },
  ];

  // Determine election status based on dates
  const getElectionStatus = (election: { startDate: string; endDate: string; status: string }) => {
    const now = new Date();
    const startDate = new Date(election.startDate);
    const endDate = new Date(election.endDate);

    if (now < startDate) {
      return "upcoming";
    } else if (now >= startDate && now <= endDate) {
      return "ongoing";
    } else {
      return "completed";
    }
  };

  const elections = useMemo(() => {
    if (!electionsResponse?.success) return [];
    
    return electionsResponse.data.map((election) => ({
      ...election,
      status: getElectionStatus(election) as "upcoming" | "ongoing" | "completed",
    }));
  }, [electionsResponse]);

  const filteredElections = useMemo(() => {
    if (activeFilter === "all") return elections;
    return elections.filter((election) => election.status === activeFilter);
  }, [elections, activeFilter]);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const totalPages = Math.ceil(filteredElections.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedElections = filteredElections.slice(startIndex, endIndex);

  useEffect(() => {
    setCurrentPage(1);
  }, [activeFilter, filteredElections.length]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#102222] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#13ecec] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading elections...</p>
        </div>
      </div>
    );
  }

  if (error || !electionsResponse?.success) {
    return (
      <div className="min-h-screen bg-[#102222] flex items-center justify-center p-4">
        <div className="text-center">
          <p className="text-red-400 text-lg mb-4">
            {error instanceof Error ? error.message : "Failed to load elections"}
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

  return (
    <div className="min-h-screen bg-[#102222] p-4 md:p-8 pb-20 relative">
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
        {/* Header with Back Button */}
        <div className="mb-6 sm:mb-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-[#92c9c9] hover:text-white transition-colors mb-4"
          >
            <MdArrowBack className="w-5 h-5" />
            <span className="text-sm font-medium">Back</span>
          </button>
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">Elections</h1>
          <p className="text-[#92c9c9] text-sm sm:text-base">
            Browse and participate in campus elections
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="mb-6 flex gap-2 overflow-x-auto">
          <button
            onClick={() => setActiveFilter("all")}
            className={`px-4 py-2 font-bold text-sm uppercase tracking-wider transition-colors whitespace-nowrap ${
              activeFilter === "all"
                ? "bg-[#13ecec] text-[#112222]"
                : "bg-[#142828] border border-[#234848] text-[#92c9c9] hover:text-white"
            }`}
          >
            ALL ELECTIONS
          </button>
          <button
            onClick={() => setActiveFilter("upcoming")}
            className={`px-4 py-2 font-bold text-sm uppercase tracking-wider transition-colors whitespace-nowrap ${
              activeFilter === "upcoming"
                ? "bg-[#13ecec] text-[#112222]"
                : "bg-[#142828] border border-[#234848] text-[#92c9c9] hover:text-white"
            }`}
          >
            UPCOMING
          </button>
          <button
            onClick={() => setActiveFilter("ongoing")}
            className={`px-4 py-2 font-bold text-sm uppercase tracking-wider transition-colors whitespace-nowrap ${
              activeFilter === "ongoing"
                ? "bg-[#13ecec] text-[#112222]"
                : "bg-[#142828] border border-[#234848] text-[#92c9c9] hover:text-white"
            }`}
          >
            ONGOING
          </button>
          <button
            onClick={() => setActiveFilter("completed")}
            className={`px-4 py-2 font-bold text-sm uppercase tracking-wider transition-colors whitespace-nowrap ${
              activeFilter === "completed"
                ? "bg-[#13ecec] text-[#112222]"
                : "bg-[#142828] border border-[#234848] text-[#92c9c9] hover:text-white"
            }`}
          >
            COMPLETED
          </button>
        </div>

        {/* Elections List */}
        <div className="space-y-4">
          {filteredElections.length === 0 ? (
            <div className="bg-[#142828] border border-[#234848] p-8 text-center">
              <p className="text-[#92c9c9]">No elections found in this category.</p>
            </div>
          ) : (
            <>
              {paginatedElections.map((election) => (
              <div
                key={election.id}
                className="bg-[#142828] border border-[#234848] p-6 hover:border-[#13ecec] transition-colors cursor-pointer"
                onClick={() => {
                  navigate(`/elections/${election.slug || election.id}`);
                }}
              >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-3 mb-2">
                      <h3 className="text-xl font-bold text-white">{election.name}</h3>
                      <span
                        className={`text-xs font-bold px-3 py-1 uppercase tracking-wider ${
                          election.status === "ongoing"
                            ? "bg-[#13ecec] text-[#112222]"
                            : election.status === "upcoming"
                            ? "bg-[#568888] text-white"
                            : "bg-[#234848] text-[#92c9c9]"
                        }`}
                      >
                        {election.status.toUpperCase()}
                      </span>
                    </div>
                    {election.description && (
                    <p className="text-[#92c9c9] text-sm mb-2">{election.description}</p>
                    )}
                    <div className="space-y-1">
                      <p className="text-[#568888] text-xs">
                        Starts: {new Date(election.startDate).toLocaleDateString()}
                      </p>
                      <p className="text-[#568888] text-xs">
                        {election.status === "ongoing"
                          ? `Ends: ${new Date(election.endDate).toLocaleDateString()}`
                          : election.status === "completed"
                          ? `Ended: ${new Date(election.endDate).toLocaleDateString()}`
                          : `Ends: ${new Date(election.endDate).toLocaleDateString()}`}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              ))}
              {/* Pagination */}
              {filteredElections.length > itemsPerPage && (
                <div className="mt-6 flex items-center justify-between">
                  <div className="text-[#568888] text-sm">
                    Showing {startIndex + 1} to {Math.min(endIndex, filteredElections.length)} of {filteredElections.length} elections
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
            </>
          )}
        </div>
      </div>

      {/* Floating Menu */}
      <FloatingMenu
        items={menuItems}
        title="echo"
        onLogout={handleLogout}
      />

      {/* Floating Help Button */}
      <FloatingHelpButton
        steps={dashboardHelpSteps}
        title="Platform Guide"
        position="dashboard"
      />

      {/* Footer */}
      <Footer />
    </div>
  );
}
