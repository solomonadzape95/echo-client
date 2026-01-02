import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AdminLayout } from "../components/AdminLayout";
import {
  useAdminElections,
  useAdminElection,
  useAdminElectionStats,
  useCreateElection,
  useDeleteElection,
  useCalculateResults,
  useAdminOffices,
  useAdminCandidates,
} from "../hooks/useAdmin";
import {
  MdAdd,
  MdEdit,
  MdDelete,
  MdVisibility,
  MdBarChart,
  MdSchedule,
  MdCheckCircle,
  MdArrowBack,
  MdPerson,
} from "react-icons/md";
import { formatDateTimeGMT1, formatDateShortGMT1 } from "../lib/dateUtils";
import { useToast } from "../hooks/useToast";
import { useConfirm } from "../hooks/useConfirm";

type ElectionTab = "all" | "pending" | "active" | "completed";

// Timer hook for admin election detail
function useElectionTimer(startDate: string, endDate: string) {
  const [timeRemaining, setTimeRemaining] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [timeUntilStart, setTimeUntilStart] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [status, setStatus] = useState<"upcoming" | "active" | "completed">("upcoming");

  useEffect(() => {
    if (!startDate || !endDate) return;

    const updateTimer = () => {
      const now = new Date();
      const start = new Date(startDate);
      const end = new Date(endDate);

      if (now < start) {
        // Upcoming
        setStatus("upcoming");
        const diff = start.getTime() - now.getTime();
        setTimeUntilStart({
          days: Math.floor(diff / (1000 * 60 * 60 * 24)),
          hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((diff % (1000 * 60)) / 1000),
        });
      } else if (now >= start && now <= end) {
        // Active
        setStatus("active");
        const diff = end.getTime() - now.getTime();
        setTimeRemaining({
          days: Math.floor(diff / (1000 * 60 * 60 * 24)),
          hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((diff % (1000 * 60)) / 1000),
        });
      } else {
        // Completed
        setStatus("completed");
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, [startDate, endDate]);

  return { timeRemaining, timeUntilStart, status };
}

export function AdminElections() {
  const navigate = useNavigate();
  const { showToast, ToastContainer } = useToast();
  const { confirm, ConfirmDialogComponent } = useConfirm();
  const [activeTab, setActiveTab] = useState<ElectionTab>("all");
  const { data: electionsResponse, isLoading } = useAdminElections(
    undefined,
    activeTab === "all" ? undefined : activeTab
  );

  const elections = electionsResponse?.success ? electionsResponse.data : [];

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9; // 3 columns x 3 rows
  const totalPages = Math.ceil(elections.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedElections = elections.slice(startIndex, endIndex);

  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab, elections.length]);

  const tabs = [
    { id: "all" as ElectionTab, label: "All Elections", count: elections.length },
    {
      id: "pending" as ElectionTab,
      label: "Pending",
      count: elections.filter((e) => e.status === "pending").length,
    },
    {
      id: "active" as ElectionTab,
      label: "Active",
      count: elections.filter((e) => e.status === "active").length,
    },
    {
      id: "completed" as ElectionTab,
      label: "Completed",
      count: elections.filter((e) => e.status === "completed").length,
    },
  ];

  return (
    <AdminLayout>
      <div className="p-8">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Elections</h1>
            <p className="text-[#92c9c9]">Manage elections, offices, and candidates</p>
          </div>
          <button
            onClick={() => navigate("/admin/elections/create")}
            className="px-6 py-3 bg-[#13ecec] hover:bg-[#0fd6d6] text-[#112222] font-bold  flex items-center gap-2 transition-all"
          >
            <MdAdd className="w-5 h-5" />
            <span>New Election</span>
          </button>
        </div>

        {/* Tabs */}
        <div className="mb-6 flex gap-2 border-b border-[#234848]">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-3 font-bold transition-all border-b-2 ${
                activeTab === tab.id
                  ? "border-[#13ecec] text-[#13ecec]"
                  : "border-transparent text-[#92c9c9] hover:text-white"
              }`}
            >
              {tab.label} ({tab.count})
            </button>
          ))}
        </div>

        {/* Elections List */}
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="loader"></div>
          </div>
        ) : elections.length === 0 ? (
          <div className="bg-[#142828] border border-[#234848]  p-12 text-center">
            <MdSchedule className="w-16 h-16 text-[#568888] mx-auto mb-4" />
            <p className="text-[#92c9c9] text-lg mb-2">No elections found</p>
            <p className="text-[#568888] text-sm mb-4">
              {activeTab === "all" ? "Create your first election to get started" : `No ${activeTab} elections`}
            </p>
            {activeTab === "all" && (
              <button
                onClick={() => navigate("/admin/elections/create")}
                className="px-6 py-3 bg-[#13ecec] hover:bg-[#0fd6d6] text-[#112222] font-bold "
              >
                Create Election
              </button>
            )}
          </div>
        ) : (
          <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {paginatedElections.map((election) => (
              <div
                key={election.id}
                className="bg-[#142828] border border-[#234848]  p-6 hover:border-[#13ecec] transition-all cursor-pointer flex flex-col justify-between"
                onClick={() => navigate(`/admin/elections/${election.slug || election.id}`)}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-white mb-2">{election.name}</h3>
                    <p className="text-[#92c9c9] text-sm line-clamp-2">{election.description || "No description"}</p>
                  </div>
                  <span
                    className={`px-2 py-1  text-xs font-medium ${
                      election.status === "active"
                        ? "bg-[#13ecec]/20 text-[#13ecec]"
                        : election.status === "completed"
                        ? "bg-green-500/20 text-green-400"
                        : "bg-orange-500/20 text-orange-400"
                    }`}
                  >
                    {election.status.toUpperCase()}
                  </span>
                </div>
                <section>

                <div className="flex items-center gap-4 text-sm text-[#568888] mb-4">
                  <div className="flex items-center gap-1">
                    <MdSchedule className="w-4 h-4" />
                    <span>{formatDateShortGMT1(election.startDate)}</span>
                  </div>
                  <span>→</span>
                  <div className="flex items-center gap-1">
                    <MdCheckCircle className="w-4 h-4" />
                    <span>{formatDateShortGMT1(election.endDate)}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 ">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/admin/elections/${election.slug || election.id}`);
                    }}
                    className="flex-1 px-4 py-2 bg-[#13ecec] hover:bg-[#0fd6d6] text-[#112222] font-bold  text-sm transition-all"
                    >
                    View Details
                  </button>
                  {/* Only show Results button if election is not active */}
                  {election.status !== "active" && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/admin/elections/${election.slug || election.id}/results`);
                      }}
                      className="px-4 py-2 bg-[#234848] hover:bg-[#2a5555] text-white  text-sm transition-all"
                    >
                      <MdBarChart className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </section>
              </div>
            ))}
          </div>
            {/* Pagination */}
            {elections.length > itemsPerPage && (
              <div className="mt-6 flex items-center justify-between">
                <div className="text-[#568888] text-sm">
                  Showing {startIndex + 1} to {Math.min(endIndex, elections.length)} of {elections.length} elections
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                    className="px-4 py-2 bg-[#142828] border border-[#234848] text-white  disabled:opacity-50 disabled:cursor-not-allowed hover:border-[#13ecec] transition-all"
                  >
                    Previous
                  </button>
                  <div className="flex items-center gap-1">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`px-3 py-2  ${
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
                    className="px-4 py-2 bg-[#142828] border border-[#234848] text-white  disabled:opacity-50 disabled:cursor-not-allowed hover:border-[#13ecec] transition-all"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </AdminLayout>
  );
}

export function AdminElectionDetail() {
  const navigate = useNavigate();
  const { showToast, ToastContainer } = useToast();
  const { confirm, ConfirmDialogComponent } = useConfirm();
  const { slug: electionSlug } = useParams<{ slug: string }>();
  const { data: electionResponse, isLoading: isLoadingElection } = useAdminElection(electionSlug);
  const { data: statsResponse, isLoading: isLoadingStats } = useAdminElectionStats(electionResponse?.success ? electionResponse.data.id : undefined);
  const { data: officesResponse } = useAdminOffices(electionResponse?.success ? electionResponse.data.id : undefined);
  const deleteElection = useDeleteElection();
  const calculateResults = useCalculateResults();

  const election = electionResponse?.success ? electionResponse.data : null;
  const stats = statsResponse?.success ? statsResponse.data : null;
  const offices = officesResponse?.success ? officesResponse.data : [];
  const currentElectionSlug = election?.slug || electionSlug;
  
  // Timer for election
  const { timeRemaining, timeUntilStart, status } = useElectionTimer(
    election?.startDate || "",
    election?.endDate || ""
  );

  if (isLoadingElection) {
    return (
      <AdminLayout>
        <div className="p-8 flex items-center justify-center min-h-[calc(100vh-8rem)]">
          <div className="loader"></div>
        </div>
      </AdminLayout>
    );
  }

  if (!election) {
    return (
      <AdminLayout>
        <div className="p-8">
          <div className="bg-red-900/20 border border-red-500/50 text-red-400 p-4 ">
            <p className="font-medium">Election not found</p>
            <button
              onClick={() => navigate("/admin/elections")}
              className="mt-4 px-4 py-2 bg-[#234848] text-white  hover:bg-[#2a5555] transition-colors"
            >
              Back to Elections
            </button>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <ToastContainer />
      {ConfirmDialogComponent}
      <div className="p-8">
        {/* Back Button */}
        <button
          onClick={() => navigate("/admin/elections")}
          className="mb-6 text-[#92c9c9] hover:text-white flex items-center gap-2 transition-colors"
        >
          <MdArrowBack className="w-5 h-5" />
          <span>Back to Elections</span>
        </button>

        {/* Header */}
        <div className="mb-8 flex items-start justify-between">
          <div>
            <div className="flex flex-col items-start gap-3 mb-2">
              <h1 className="text-4xl font-bold text-white">{election.name}</h1>
            <p className="text-[#92c9c9]">{election.description || "No description"}</p>
            <span
                className={`px-3 py-1  text-sm font-medium ${
                  election.status === "active"
                    ? "bg-[#13ecec]/20 text-[#13ecec]"
                    : election.status === "completed"
                    ? "bg-green-500/20 text-green-400"
                    : "bg-orange-500/20 text-orange-400"
                }`}
              >
                {election.status.toUpperCase()}
              </span>
            </div>
            <div className="mt-4 space-y-2">
              <div className="text-sm text-[#568888]">
                <span className="font-medium text-[#92c9c9]">Start:</span>{" "}
                {formatDateTimeGMT1(election.startDate)}
              </div>
              <div className="text-sm text-[#568888]">
                <span className="font-medium text-[#92c9c9]">End:</span>{" "}
                {formatDateTimeGMT1(election.endDate)}
              </div>
            </div>
            {/* Timer */}
            {status === "active" && (
              <div className="mt-4 bg-[#13ecec]/10 border border-[#13ecec]/30  p-4">
                <div className="text-sm text-[#92c9c9] mb-2 font-medium">Time Remaining</div>
                <div className="flex gap-4 text-2xl font-bold text-[#13ecec]">
                  <div>
                    <div className="text-3xl">{String(timeRemaining.days).padStart(2, "0")}</div>
                    <div className="text-xs text-[#568888] uppercase">Days</div>
                  </div>
                  <div>:</div>
                  <div>
                    <div className="text-3xl">{String(timeRemaining.hours).padStart(2, "0")}</div>
                    <div className="text-xs text-[#568888] uppercase">Hours</div>
                  </div>
                  <div>:</div>
                  <div>
                    <div className="text-3xl">{String(timeRemaining.minutes).padStart(2, "0")}</div>
                    <div className="text-xs text-[#568888] uppercase">Minutes</div>
                  </div>
                  <div>:</div>
                  <div>
                    <div className="text-3xl">{String(timeRemaining.seconds).padStart(2, "0")}</div>
                    <div className="text-xs text-[#568888] uppercase">Seconds</div>
                  </div>
                </div>
              </div>
            )}
            {status === "upcoming" && (
              <div className="mt-4 bg-orange-500/10 border border-orange-500/30 p-4">
                <div className="text-sm text-[#92c9c9] mb-2 font-medium">Starts In</div>
                <div className="flex gap-4 text-2xl font-bold text-orange-400">
                  <div>
                    <div className="text-3xl">{String(timeUntilStart.days).padStart(2, "0")}</div>
                    <div className="text-xs text-[#568888] uppercase">Days</div>
                  </div>
                  <div>:</div>
                  <div>
                    <div className="text-3xl">{String(timeUntilStart.hours).padStart(2, "0")}</div>
                    <div className="text-xs text-[#568888] uppercase">Hours</div>
                  </div>
                  <div>:</div>
                  <div>
                    <div className="text-3xl">{String(timeUntilStart.minutes).padStart(2, "0")}</div>
                    <div className="text-xs text-[#568888] uppercase">Minutes</div>
                  </div>
                  <div>:</div>
                  <div>
                    <div className="text-3xl">{String(timeUntilStart.seconds).padStart(2, "0")}</div>
                    <div className="text-xs text-[#568888] uppercase">Seconds</div>
                  </div>
                </div>
              </div>
            )}
            {status === "completed" && (
              <div className="mt-4 bg-green-500/10 border border-green-500/30 p-4">
                <div className="text-sm text-green-400 font-medium">Election Completed</div>
              </div>
            )}
          </div>
          {/* Only show Edit and Results buttons if election is not active */}
          {election.status !== "active" && (
            <div className="flex gap-2">
               {election.status !== "completed" && (<button
                onClick={() => navigate(`/admin/elections/${electionSlug}/edit`)}
                className="px-4 py-2 bg-[#234848] hover:bg-[#2a5555] text-white  flex items-center gap-2"
              >
                <MdEdit className="w-4 h-4" />
                <span>Edit</span>
              </button>)}
              {election.status !== "pending" && ( <button
                onClick={() => navigate(`/admin/elections/${electionSlug}/results`)}
                className="px-4 py-2 bg-[#13ecec] hover:bg-[#0fd6d6] text-[#112222] font-bold  flex items-center gap-2"
              >
                <MdBarChart className="w-4 h-4" />
                <span>Results</span>
              </button>)}
            </div>
          )}
        </div>

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-[#142828] border border-[#234848]  p-6">
              <div className="text-[#568888] text-sm uppercase tracking-wider mb-2">Eligible Voters</div>
              <div className="text-3xl font-bold text-white">{stats.turnout?.eligibleVoters || 0}</div>
            </div>
            <div className="bg-[#142828] border border-[#234848]  p-6">
              <div className="text-[#568888] text-sm uppercase tracking-wider mb-2">Votes Cast</div>
              <div className="text-3xl font-bold text-white">{stats.turnout?.votesCast || 0}</div>
            </div>
            <div className="bg-[#142828] border border-[#234848]  p-6">
              <div className="text-[#568888] text-sm uppercase tracking-wider mb-2">Turnout</div>
              <div className="text-3xl font-bold text-white">
                {stats.turnout?.turnoutPercentage?.toFixed(1) || 0}%
              </div>
            </div>
            <div className="bg-[#142828] border border-[#234848]  p-6">
              <div className="text-[#568888] text-sm uppercase tracking-wider mb-2">Tokens Used</div>
              <div className="text-3xl font-bold text-white">
                {stats.tokens?.used || 0} / {stats.tokens?.issued || 0}
              </div>
            </div>
          </div>
        )}

        {/* Offices */}
        <div className="bg-[#142828] border border-[#234848]  p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">Offices</h2>
            {/* Only show New Office button if election is not active */}
            {election.status !== "active" && (
              <button
                onClick={() => navigate(`/admin/elections/${currentElectionSlug}/offices/create`)}
                className="px-4 py-2 bg-[#13ecec] hover:bg-[#0fd6d6] text-[#112222] font-bold  flex items-center gap-2"
              >
                <MdAdd className="w-4 h-4" />
                <span>New Office</span>
              </button>
            )}
          </div>
          {offices.length === 0 ? (
            <div className="text-center py-8 text-[#568888]">
              <p>No offices created yet</p>
            </div>
          ) : (
            <div className="space-y-4">
              {offices.map((office) => (
                <div
                  key={office.id}
                  className="bg-[#102222] border border-[#234848]  p-4 hover:border-[#13ecec] transition-all cursor-pointer"
                  onClick={() => navigate(`/admin/elections/${currentElectionSlug}/offices/${office.slug || office.id}`)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-[#13ecec]/20  flex items-center justify-center">
                        <MdPerson className="w-5 h-5 text-[#13ecec]" />
                      </div>
                      <div>
                        <h3 className="text-white font-bold">{office.name}</h3>
                        <p className="text-[#92c9c9] text-sm">{office.description}</p>
                      </div>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/admin/elections/${currentElectionSlug}/offices/${office.slug || office.id}`);
                      }}
                      className="px-4 py-2 bg-[#234848] hover:bg-[#2a5555] text-white  text-sm"
                    >
                      Manage
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Actions - Only show for non-active elections */}
        {election.status !== "active" && (
          <div className="bg-[#142828] border border-[#234848]  p-6">
            <h2 className="text-xl font-bold text-white mb-4">Election Actions</h2>
            <div className="flex gap-4">
              {election.status === "completed" && (
                <button
                  onClick={async () => {
                    const confirmed = await confirm({
                      title: "Calculate Results",
                      message: "Are you sure you want to calculate results? This will end the election.",
                      type: "warning",
                    });
                    if (confirmed) {
                      try {
                        await calculateResults.mutateAsync(election!.id);
                        showToast("Results calculated successfully!", "success");
                      } catch (error) {
                        showToast("Failed to calculate results", "error");
                      }
                    }
                  }}
                  disabled={calculateResults.isPending}
                  className="px-6 py-3 bg-[#13ecec] hover:bg-[#0fd6d6] text-[#112222] font-bold  disabled:opacity-50"
                >
                  {calculateResults.isPending ? "Calculating..." : "Calculate Results"}
                </button>
              )}
              <button
                onClick={async () => {
                  const confirmed = await confirm({
                    title: "Delete Election",
                    message: "Are you sure you want to delete this election? This action cannot be undone.",
                    type: "danger",
                    confirmText: "Delete",
                  });
                  if (confirmed) {
                    try {
                      await deleteElection.mutateAsync(election!.id);
                      showToast("Election deleted successfully", "success");
                      navigate("/admin/elections");
                    } catch (error) {
                      showToast("Failed to delete election", "error");
                    }
                  }
                }}
                disabled={deleteElection.isPending}
                className="px-6 py-3 bg-red-900/20 hover:bg-red-900/30 text-red-400 border border-red-500/50  disabled:opacity-50"
              >
                <MdDelete className="w-4 h-4 inline mr-2" />
                Delete Election
              </button>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
