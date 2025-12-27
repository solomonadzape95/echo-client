import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MdArrowBack } from "react-icons/md";

type ElectionStatus = "all" | "upcoming" | "ongoing" | "completed";

interface Election {
  id: string;
  title: string;
  description: string;
  status: "upcoming" | "ongoing" | "completed";
  startDate?: Date;
  endDate?: Date;
}

export function Elections() {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState<ElectionStatus>("all");

  // Example elections data - replace with API data
  const elections: Election[] = [
    {
      id: "1",
      title: "Student Government Election 2024",
      description: "Vote for your student government representatives",
      status: "ongoing",
      endDate: new Date(Date.now() + 4 * 60 * 60 * 1000),
    },
    {
      id: "2",
      title: "Class Representative Election",
      description: "Elect your class representatives",
      status: "upcoming",
      startDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    },
    {
      id: "3",
      title: "Campus Budget Proposal",
      description: "Vote on the annual campus budget allocation",
      status: "completed",
      endDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    },
  ];

  const filteredElections = elections.filter((election) => {
    if (activeFilter === "all") return true;
    return election.status === activeFilter;
  });

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
            filteredElections.map((election) => (
              <div
                key={election.id}
                className="bg-[#142828] border border-[#234848] p-6 hover:border-[#13ecec] transition-colors cursor-pointer"
                onClick={() => {
                  // Navigate to election details
                  console.log("View election:", election.id);
                }}
              >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-3 mb-2">
                      <h3 className="text-xl font-bold text-white">{election.title}</h3>
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
                    <p className="text-[#92c9c9] text-sm mb-2">{election.description}</p>
                    {election.startDate && (
                      <p className="text-[#568888] text-xs">
                        Starts: {election.startDate.toLocaleDateString()}
                      </p>
                    )}
                    {election.endDate && (
                      <p className="text-[#568888] text-xs">
                        {election.status === "ongoing"
                          ? `Ends: ${election.endDate.toLocaleDateString()}`
                          : `Ended: ${election.endDate.toLocaleDateString()}`}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
