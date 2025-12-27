import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { MdArrowBack, MdBarChart, MdTrendingUp, MdHowToVote } from "react-icons/md";
import candidate1 from "../assets/candidate-1.png";
import candidate2 from "../assets/candidate-2.png";
import candidate3 from "../assets/candidate-3.png";
import candidate4 from "../assets/candidate-4.png";
import candidate5 from "../assets/candidate-5.png";

type OfficeFilter = "all" | "presidential" | "vp" | "secretary" | "treasurer";

interface CandidateResult {
  id: string;
  name: string;
  affiliation: string;
  party: string;
  image: string;
  votes: number;
  percentage: number;
  isIncumbent?: boolean;
}

interface OfficeResult {
  office: string;
  seats: number;
  candidates: CandidateResult[];
  abstainVotes: number;
  abstainPercentage: number;
}

export function ElectionResults() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [officeFilter, setOfficeFilter] = useState<OfficeFilter>("all");

  // Example election data
  const election = {
    id: id || "1",
    pollsCloseTime: "8:00 PM EST",
    lastUpdated: "2 mins ago",
  };

  // Example results data
  const allResults: OfficeResult[] = [
    {
      office: "Presidential",
      seats: 2,
      candidates: [
        {
          id: "1",
          name: "Sarah Chen",
          affiliation: "Progressive Alliance",
          party: "INCUMBENT",
          image: candidate1,
          votes: 1538,
          percentage: 45.2,
          isIncumbent: true,
        },
        {
          id: "2",
          name: "Michael Ross",
          affiliation: "STUDENT VOICE",
          party: "Independent",
          image: candidate2,
          votes: 1092,
          percentage: 32.1,
        },
        {
          id: "3",
          name: "Jessica Lee",
          affiliation: "CAMPUS UNITED",
          party: "Green Party",
          image: candidate3,
          votes: 629,
          percentage: 18.5,
        },
      ],
      abstainVotes: 143,
      abstainPercentage: 4.2,
    },
    {
      office: "VP",
      seats: 1,
      candidates: [
        {
          id: "4",
          name: "David Okonjo",
          affiliation: "LAW SCHOOL",
          party: "Independent",
          image: candidate4,
          votes: 892,
          percentage: 52.3,
        },
        {
          id: "5",
          name: "Emily Zhang",
          affiliation: "COMPUTER SCIENCE",
          party: "Tech Forward",
          image: candidate5,
          votes: 812,
          percentage: 47.7,
        },
      ],
      abstainVotes: 45,
      abstainPercentage: 2.6,
    },
    {
      office: "Secretary",
      seats: 1,
      candidates: [
        {
          id: "6",
          name: "Priya Patel",
          affiliation: "ARTS & SCIENCES",
          party: "Green Party",
          image: candidate3,
          votes: 1205,
          percentage: 58.1,
        },
        {
          id: "7",
          name: "Marcus Chen",
          affiliation: "BUSINESS",
          party: "Progressive Alliance",
          image: candidate2,
          votes: 869,
          percentage: 41.9,
        },
      ],
      abstainVotes: 32,
      abstainPercentage: 1.5,
    },
    {
      office: "Treasurer",
      seats: 1,
      candidates: [
        {
          id: "8",
          name: "Michael Ross",
          affiliation: "HUMANITIES",
          party: "Independent",
          image: candidate2,
          votes: 1103,
          percentage: 55.8,
        },
        {
          id: "9",
          name: "Sarah Jenkins",
          affiliation: "ENGINEERING",
          party: "Tech Forward",
          image: candidate1,
          votes: 874,
          percentage: 44.2,
        },
      ],
      abstainVotes: 28,
      abstainPercentage: 1.4,
    },
  ];

  // Calculate summary statistics
  // For believable stats: total votes should be less than registered voters
  const registeredVoters = 5000;
  
  // Calculate total votes from all offices
  const totalVotesCast = allResults.reduce(
    (sum, office) =>
      sum +
      office.candidates.reduce((candidateSum, candidate) => candidateSum + candidate.votes, 0) +
      office.abstainVotes,
    0
  );
  
  // For believable stats: assume each voter votes in multiple offices
  // Calculate unique voters (each voter can vote in ~2-3 offices on average)
  // So unique voters should be less than total votes cast
  const uniqueVoters = Math.min(Math.floor(totalVotesCast / 2.5), registeredVoters);
  const voterTurnout = ((uniqueVoters / registeredVoters) * 100).toFixed(1);
  
  // Calculate change vs 2023 (based on unique voters, not total votes)
  const totalVotes2023 = 3036;
  const votesChange = ((uniqueVoters - totalVotes2023) / totalVotes2023) * 100;

  const filteredResults = officeFilter === "all" ? allResults : allResults.filter((r) => r.office.toLowerCase() === officeFilter);

  const formatNumber = (num: number) => {
    return num.toLocaleString();
  };

  return (
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

      <div className="max-w-7xl mx-auto relative z-10 p-4 md:p-8 pb-12">
        {/* Header with Back Button */}
        <div className="mb-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-[#92c9c9] hover:text-white transition-colors mb-4"
          >
            <MdArrowBack className="w-5 h-5" />
            <span className="text-sm font-medium">Back</span>
          </button>

          {/* Title and Info */}
          <div className="mb-6">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-2">
              2024 Student Government
            </h1>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#13ecec] mb-4">
              Election Results
            </h2>
            <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
              <span className="text-sm text-[#92c9c9]">Real-time counting. Polls close at {election.pollsCloseTime}.</span>
              <div className="bg-[#1a2a2a] border border-[#234848] px-3 py-1.5 rounded flex items-center gap-2">
                <svg className="w-4 h-4 text-[#92c9c9]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-xs text-[#92c9c9]">Last updated: {election.lastUpdated}</span>
              </div>
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
              <div className="text-4xl font-bold text-white mb-3">{formatNumber(uniqueVoters)}</div>
              <div className="flex items-center gap-1 text-sm" style={{ color: '#4ade80' }}>
                <MdTrendingUp className="w-4 h-4" />
                <span>+{Math.abs(votesChange).toFixed(0)}% vs 2023</span>
              </div>
            </div>

            {/* Voter Turnout */}
            <div className="bg-[#1a2a2a] border border-[#234848] p-6 rounded">
              <div className="flex items-center justify-between mb-3">
                <div className="text-white text-xs uppercase tracking-wider font-medium">VOTER TURNOUT</div>
                <div className="w-6 h-6 relative">
                  <svg viewBox="0 0 24 24" className="w-6 h-6 text-[#13ecec]">
                    <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="1.5" opacity="0.3" />
                    <path
                      d="M 12 12 L 12 2 A 10 10 0 0 1 20 8 Z"
                      fill="currentColor"
                      opacity="0.6"
                    />
                    {/* Small voter figures */}
                    <circle cx="10" cy="8" r="1.5" fill="currentColor" />
                    <circle cx="14" cy="8" r="1.5" fill="currentColor" />
                  </svg>
                </div>
              </div>
              <div className="text-4xl font-bold text-white mb-3">{voterTurnout}%</div>
              <div className="flex items-center gap-3">
                <div className="flex-1 h-2 bg-[#102222] border border-[#234848] overflow-hidden">
                  <div
                    className="h-full bg-[#13ecec] transition-all"
                    style={{ width: `${voterTurnout}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Active Ballots */}
            <div className="bg-[#1a2a2a] border border-[#234848] p-6 rounded">
              <div className="flex items-center justify-between mb-3">
                <div className="text-white text-xs uppercase tracking-wider font-medium">ACTIVE BALLOTS</div>
                <MdHowToVote className="w-5 h-5 text-[#13ecec]" />
              </div>
              <div className="text-4xl font-bold text-white mb-3">{formatNumber(registeredVoters)}</div>
              <div className="text-sm text-[#92c9c9]">Registered Eligible Voters</div>
            </div>
          </div>

          {/* Office Filter Tabs */}
          <div className="mb-6 flex gap-2 overflow-x-auto">
            <button
              onClick={() => setOfficeFilter("all")}
              className={`px-4 py-2 font-bold text-sm uppercase tracking-wider transition-colors whitespace-nowrap ${
                officeFilter === "all"
                  ? "bg-[#13ecec] text-[#112222]"
                  : "bg-[#142828] border border-[#234848] text-[#92c9c9] hover:text-white"
              }`}
            >
              ALL OFFICES
            </button>
            <button
              onClick={() => setOfficeFilter("presidential")}
              className={`px-4 py-2 font-bold text-sm uppercase tracking-wider transition-colors whitespace-nowrap ${
                officeFilter === "presidential"
                  ? "bg-[#13ecec] text-[#112222]"
                  : "bg-[#142828] border border-[#234848] text-[#92c9c9] hover:text-white"
              }`}
            >
              PRESIDENTIAL
            </button>
            <button
              onClick={() => setOfficeFilter("vp")}
              className={`px-4 py-2 font-bold text-sm uppercase tracking-wider transition-colors whitespace-nowrap ${
                officeFilter === "vp"
                  ? "bg-[#13ecec] text-[#112222]"
                  : "bg-[#142828] border border-[#234848] text-[#92c9c9] hover:text-white"
              }`}
            >
              VP
            </button>
            <button
              onClick={() => setOfficeFilter("secretary")}
              className={`px-4 py-2 font-bold text-sm uppercase tracking-wider transition-colors whitespace-nowrap ${
                officeFilter === "secretary"
                  ? "bg-[#13ecec] text-[#112222]"
                  : "bg-[#142828] border border-[#234848] text-[#92c9c9] hover:text-white"
              }`}
            >
              SECRETARY
            </button>
            <button
              onClick={() => setOfficeFilter("treasurer")}
              className={`px-4 py-2 font-bold text-sm uppercase tracking-wider transition-colors whitespace-nowrap ${
                officeFilter === "treasurer"
                  ? "bg-[#13ecec] text-[#112222]"
                  : "bg-[#142828] border border-[#234848] text-[#92c9c9] hover:text-white"
              }`}
            >
              TREASURER
            </button>
          </div>
        </div>

        {/* Results Display */}
        <div className="space-y-8">
          {filteredResults.map((officeResult, index) => {
            const sortedCandidates = [...officeResult.candidates].sort((a, b) => b.votes - a.votes);
            const leadingCandidate = sortedCandidates[0];

            return (
              <div key={officeResult.office} className="bg-[#142828] border border-[#234848] p-6">
                {/* Office Header */}
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl md:text-3xl font-bold text-white uppercase">
                    {officeResult.office} Race
                  </h2>
                  <div className="bg-[#234848] text-[#92c9c9] text-xs font-bold px-3 py-1 uppercase tracking-wider">
                    {officeResult.seats} {officeResult.seats === 1 ? "SEAT" : "SEATS"} OPEN
                  </div>
                </div>

                {/* Candidates List */}
                <div className="space-y-3">
                  {sortedCandidates.map((candidate, candidateIndex) => {
                    const isLeading = candidateIndex === 0;
                    return (
                      <div
                        key={candidate.id}
                        className="bg-[#1a2a2a] border border-[#234848] p-4"
                      >
                        <div className="flex items-center gap-4">
                          {/* Candidate Image */}
                          <div className="flex-shrink-0">
                            <img
                              src={candidate.image}
                              alt={candidate.name}
                              className={`w-20 h-20 object-cover ${
                                isLeading ? "border-2 border-[#13ecec]" : "border border-[#234848]"
                              }`}
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.style.display = "none";
                              }}
                            />
                          </div>

                          {/* Candidate Info - Name, Affiliation, Party */}
                          <div className="flex-shrink-0 min-w-[220px]">
                            <h3 className="text-xl font-bold text-white mb-1">{candidate.name}</h3>
                            {candidate.isIncumbent ? (
                              <div className="text-[#13ecec] text-sm font-medium mb-1">INCUMBENT</div>
                            ) : (
                              <div className="text-[#92c9c9] text-xs uppercase tracking-wider mb-1">
                                {candidate.affiliation}
                              </div>
                            )}
                            <div className="text-[#92c9c9] text-sm">{candidate.party}</div>
                          </div>

                          {/* Progress Bar - Full Width Horizontal */}
                          <div className="flex-1 relative h-12">
                            <div className="absolute inset-0 flex items-center">
                              <div
                                className={`h-full flex items-center ${
                                  isLeading ? "bg-[#13ecec]" : "bg-[#234848]"
                                }`}
                                style={{ width: `${candidate.percentage}%` }}
                              >
                                {isLeading && (
                                  <MdBarChart className="w-5 h-5 text-[#112222] ml-2" />
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Vote Stats - Right Side */}
                          <div className="flex-shrink-0 text-right min-w-[140px]">
                            <div className={`text-2xl font-bold mb-1 ${isLeading ? "text-[#13ecec]" : "text-[#92c9c9]"}`}>
                              {candidate.percentage.toFixed(1)}%
                            </div>
                            <div className="text-white text-xl font-bold">{formatNumber(candidate.votes)}</div>
                            <div className="text-white text-sm">VOTES</div>
                          </div>
                        </div>
                      </div>
                    );
                  })}

                  {/* Abstain / Write-in */}
                  <div className="bg-[#1a2a2a] border border-[#234848] p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-white">Abstain / Write-in</span>
                      <span className="text-white">
                        {formatNumber(officeResult.abstainVotes)} Votes ({officeResult.abstainPercentage.toFixed(1)}%)
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

