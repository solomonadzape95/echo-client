import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { MdPerson, MdLocalFlorist, MdCheckBox, MdCheckBoxOutlineBlank } from "react-icons/md";
import candidate1 from "../assets/candidate-1.png";
import candidate2 from "../assets/candidate-2.png";
import candidate3 from "../assets/candidate-3.png";
import candidate4 from "../assets/candidate-4.png";
import candidate5 from "../assets/candidate-5.png";

interface BallotCandidate {
  id: string;
  name: string;
  party: string;
  platform: string;
  image: string;
}

interface BallotRace {
  id: string;
  title: string;
  icon: React.ReactNode;
  voteFor: number;
  candidates: BallotCandidate[];
}

interface BallotProposition {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
}

export function Ballot() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [currentStep, setCurrentStep] = useState(3);
  const [totalSteps] = useState(5);
  const [selectedVotes, setSelectedVotes] = useState<Record<string, string[]>>({});
  const [selectedPropositions, setSelectedPropositions] = useState<Record<string, "yes" | "no" | "abstain">>({});

  const ballotId = `#${Math.random().toString(36).substring(2, 9).toUpperCase()}-VOTE`;

  // Example ballot data
  const races: BallotRace[] = [
    {
      id: "presidential",
      title: "PRESIDENTIAL RACE",
      icon: <MdPerson className="w-5 h-5" />,
      voteFor: 1,
      candidates: [
        {
          id: "1",
          name: "Alex Chen",
          party: "FORWARD TOGETHER PARTY",
          platform: "Advocating for sustainable campus initiatives, mental health resources, and tuition freezes for all students.",
          image: candidate1,
        },
        {
          id: "2",
          name: "Sarah Jenkins",
          party: "STUDENT VOICE ALLIANCE",
          platform: "Focused on transparency in student government spending, expanded library hours, and improved campus dining options.",
          image: candidate2,
        },
      ],
    },
    {
      id: "vp-finance",
      title: "VP OF FINANCE",
      icon: <MdPerson className="w-5 h-5" />,
      voteFor: 1,
      candidates: [
        {
          id: "3",
          name: "Marcus Johnson",
          party: "INNOVATION PARTY",
          platform: "Experienced treasurer promising streamlined club funding processes.",
          image: candidate3,
        },
        {
          id: "4",
          name: "Emily Dao",
          party: "UNITY COALITION",
          platform: "Pledging to increase funding for diversity organizations and cultural events.",
          image: candidate4,
        },
      ],
    },
  ];

  const handleCandidateSelect = (raceId: string, candidateId: string) => {
    setSelectedVotes((prev) => {
      const race = races.find((r) => r.id === raceId);
      if (!race) return prev;

      const current = prev[raceId] || [];
      
      // If voteFor is 1, replace selection; otherwise toggle
      if (race.voteFor === 1) {
        return { ...prev, [raceId]: [candidateId] };
      } else {
        if (current.includes(candidateId)) {
          return { ...prev, [raceId]: current.filter((id) => id !== candidateId) };
        } else if (current.length < race.voteFor) {
          return { ...prev, [raceId]: [...current, candidateId] };
        }
        return prev;
      }
    });
  };

  const handleAbstain = (raceId: string) => {
    setSelectedVotes((prev) => ({
      ...prev,
      [raceId]: ["abstain"],
    }));
  };

  const handlePropositionSelect = (propId: string, value: "yes" | "no" | "abstain") => {
    setSelectedPropositions((prev) => ({
      ...prev,
      [propId]: value,
    }));
  };

  const progressPercentage = (currentStep / totalSteps) * 100;

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

      <div className="max-w-4xl mx-auto relative z-10 p-4 md:p-8 pb-12">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-2 uppercase tracking-tight">
                OFFICIAL BALLOT
              </h1>
              <p className="text-white text-sm">Select candidates for each position below.</p>
            </div>
            <div className="text-right">
              <div className="text-white font-bold text-sm mb-1">STEP {currentStep} OF {totalSteps}</div>
              <div className="text-[#92c9c9] text-xs">ID: {ballotId}</div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full h-2 bg-[#234848] overflow-hidden">
            <div
              className="h-full bg-[#13ecec] transition-all duration-300"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>

        {/* Races */}
        <div className="space-y-8">
          {races.map((race) => {
            const selected = selectedVotes[race.id] || [];
            const isAbstainSelected = selected.includes("abstain");

            return (
              <div key={race.id} className="bg-[#142828] border border-[#234848] p-6">
                {/* Race Header */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2">
                    <div className="text-[#13ecec]">{race.icon}</div>
                    <h2 className="text-xl font-bold text-white uppercase">{race.title}</h2>
                  </div>
                  <div className="bg-[#234848] border border-[#234848] text-[#92c9c9] text-xs font-medium px-3 py-1 uppercase tracking-wider">
                    VOTE FOR {race.voteFor}
                  </div>
                </div>

                {/* Candidates */}
                <div className="space-y-3">
                  {race.candidates.map((candidate) => {
                    const isSelected = selected.includes(candidate.id);
                    return (
                      <div
                        key={candidate.id}
                        onClick={() => handleCandidateSelect(race.id, candidate.id)}
                        className={`bg-[#1a2a2a] border-2 cursor-pointer transition-all p-4 flex items-center gap-4 ${
                          isSelected ? "border-[#13ecec]" : "border-[#234848] hover:border-[#13ecec]/50"
                        }`}
                      >
                        {/* Candidate Image */}
                        <div className="flex-shrink-0">
                          <img
                            src={candidate.image}
                            alt={candidate.name}
                            className="w-16 h-16 object-cover"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.style.display = "none";
                            }}
                          />
                        </div>

                        {/* Candidate Info */}
                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg font-bold text-white mb-1">{candidate.name}</h3>
                          <div className="text-[#13ecec] text-sm font-medium mb-2">{candidate.party}</div>
                          <p className="text-[#92c9c9] text-sm line-clamp-2">{candidate.platform}</p>
                        </div>

                        {/* Checkbox */}
                        <div className="flex-shrink-0">
                          {isSelected ? (
                            <MdCheckBox className="w-6 h-6 text-[#13ecec]" />
                          ) : (
                            <MdCheckBoxOutlineBlank className="w-6 h-6 text-[#568888]" />
                          )}
                        </div>
                      </div>
                    );
                  })}

                  {/* Abstain Option */}
                  <div
                    onClick={() => handleAbstain(race.id)}
                    className={`bg-[#1a2a2a] border-2 cursor-pointer transition-all p-4 flex items-center gap-4 ${
                      isAbstainSelected ? "border-[#13ecec]" : "border-[#234848] hover:border-[#13ecec]/50"
                    }`}
                  >
                    <div className="flex-shrink-0 w-16 h-16 flex items-center justify-center">
                      <svg className="w-8 h-8 text-[#568888]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <div className="text-white font-medium">Abstain / None of the Above</div>
                    </div>
                    <div className="flex-shrink-0">
                      {isAbstainSelected ? (
                        <MdCheckBox className="w-6 h-6 text-[#13ecec]" />
                      ) : (
                        <MdCheckBoxOutlineBlank className="w-6 h-6 text-[#568888]" />
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        {/* Navigation Buttons */}
        <div className="flex justify-between items-center mt-8">
          <button
            onClick={() => navigate(-1)}
            className="bg-[#234848] hover:bg-[#2a5555] text-white font-bold px-6 py-3 transition-colors"
          >
            BACK
          </button>
          <button
            onClick={() => {
              console.log("Submitting ballot:", { selectedVotes, selectedPropositions });
              // Navigate to confirmation or next step
            }}
            className="bg-[#13ecec] hover:bg-[#0fd6d6] text-[#112222] font-bold px-6 py-3 transition-colors uppercase"
          >
            CONTINUE
          </button>
        </div>
      </div>
    </div>
  );
}

