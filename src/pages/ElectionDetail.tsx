import { useState, useEffect, useMemo, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { MdArrowBack, MdLink, MdVideocam, MdVolumeUp, MdClose, MdHowToVote, MdVerified, MdBarChart, MdPerson } from "react-icons/md";
import { useBallot } from "../hooks/useBallot";
import { useVoteStatus } from "../hooks/useVoteStatus";
import { FloatingMenu } from "../components/FloatingMenu";
import { FloatingHelpButton } from "../components/FloatingHelpButton";
import { Footer } from "../components/Footer";
import { authService } from "../lib/auth";
import { dashboardHelpSteps } from "../constants/helpContent";
import { api } from "../lib/api";
import type { ApiResponse } from "../lib/api";
import candidate1 from "../assets/candidate-1.png";
import candidate2 from "../assets/candidate-2.png";
import candidate3 from "../assets/candidate-3.png";
import candidate4 from "../assets/candidate-4.png";
import candidate5 from "../assets/candidate-5.png";

const candidateImages = {
  candidate1,
  candidate2,
  candidate3,
  candidate4,
  candidate5,
};

type PositionFilter = "all" | string;

export function ElectionDetail() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { slug: electionSlug } = useParams<{ slug: string }>();
  const hasInvalidatedOnTimerEnd = useRef(false);
  const hasInvalidatedOnTimerStart = useRef(false);
  const { data: electionResponse } = useQuery({
    queryKey: ["election", electionSlug],
    queryFn: async () => {
      if (!electionSlug) throw new Error("Election slug is required");
      const response = await api.get<ApiResponse<any>>(`/election/${electionSlug}`);
      return response;
    },
    enabled: !!electionSlug,
  });
  const electionId = electionResponse?.success ? electionResponse.data.id : undefined;
  const { data: ballotResponse, isLoading, error } = useBallot(electionId);
  const { data: hasVoted, isLoading: isLoadingVoteStatus } = useVoteStatus(electionId);
  const [selectedCandidate, setSelectedCandidate] = useState<any | null>(null);
  const [positionFilter, setPositionFilter] = useState<PositionFilter>("all");
  const [timeRemaining, setTimeRemaining] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [timeUntilStart, setTimeUntilStart] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

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

  const ballotData = ballotResponse?.success ? ballotResponse.data : null;
  const election = ballotData?.election;
  const offices = ballotData?.offices || [];

  // Determine election status based on dates
  const electionStatus = useMemo(() => {
    if (!election) return "upcoming";
    const now = new Date();
    const startDate = new Date(election.startDate);
    const endDate = new Date(election.endDate);

    if (now < startDate) {
      return "upcoming";
    } else if (now >= startDate && now <= endDate) {
      return "active";
    } else {
      return "completed";
    }
  }, [election]);

  // Calculate end time from election data
  const endTime = useMemo(() => {
    if (election?.endDate) {
      return new Date(election.endDate);
    }
    return new Date(Date.now() + 2 * 24 * 60 * 60 * 1000);
  }, [election]);

  // Calculate start time
  const startTime = useMemo(() => {
    if (election?.startDate) {
      return new Date(election.startDate);
    }
    return new Date(Date.now() + 1 * 24 * 60 * 60 * 1000);
  }, [election]);

  // Flatten candidates from all offices for display
  const allCandidates = useMemo(() => {
    return offices.flatMap(office =>
      office.candidates.map(candidate => ({
        ...candidate,
        officeId: office.id,
        officeName: office.name,
        position: office.name.toLowerCase().replace(/\s+/g, "-"),
      }))
    );
  }, [offices]);

  // Example candidates data
  const candidates: Candidate[] = [
    {
      id: "1",
      name: "Sarah Jenkins",
      class: "Class of 2025",
      position: "presidential",
      department: "ENGINEERING",
      quote: "Building a transparent bridge between faculty and students.",
      image: candidateImages.candidate1,
      isIncumbent: true,
      year: "Senior (2025)",
      gpa: "3.9",
      experience: "Student Senate, 2 years",
      manifesto: {
        intro: "Fellow students, our campus is at a turning point. We face challenges in sustainability, mental health support, and transparency. My platform is built on three core pillars designed to empower every single one of you.",
        pillars: [
          {
            title: "Green Campus Initiative",
            description: "Implementation of a zero-waste policy in the cafeteria and solar charging stations in the quad. We cannot wait for the administration to act; we must lead.",
          },
          {
            title: "Mental Health First",
            description: "Doubling the availability of walk-in counseling hours during finals week and creating 'de-stress zones' in the library.",
          },
          {
            title: "Open Budget",
            description: "Every dollar spent by the student government will be tracked on a public dashboard in real-time. You deserve to know where your fees are going.",
          },
        ],
      },
    },
    {
      id: "2",
      name: "Marcus Chen",
      class: "Class of 2026",
      position: "presidential",
      department: "BUSINESS",
      quote: "Allocate budget where it matters: Student spaces and mental health.",
      image: candidateImages.candidate2,
      year: "Junior (2026)",
      gpa: "3.8",
      experience: "Business Club President",
      manifesto: {
        intro: "As a business student, I understand the importance of fiscal responsibility and strategic planning. My vision for our student body focuses on practical solutions that deliver real results.",
        pillars: [
          {
            title: "Budget Transparency",
            description: "Complete financial transparency with quarterly reports and student input on budget allocation.",
          },
          {
            title: "Student Spaces",
            description: "Renovation and expansion of student study spaces and common areas across campus.",
          },
          {
            title: "Mental Health Resources",
            description: "Increased funding for mental health services and peer support programs.",
          },
        ],
      },
    },
    {
      id: "3",
      name: "Priya Patel",
      class: "Class of 2025",
      position: "presidential",
      department: "ARTS & SCIENCES",
      quote: "Sustainability first. Let's make our campus green and clean.",
      image: candidateImages.candidate3,
      year: "Junior (2025)",
      gpa: "3.8",
      experience: "Student Senate",
      manifesto: {
        intro: "Fellow students, our campus is at a turning point. We face challenges in sustainability, mental health support, and transparency. My platform is built on three core pillars designed to empower every single one of you.",
        pillars: [
          {
            title: "Green Campus Initiative",
            description: "Implementation of a zero-waste policy in the cafeteria and solar charging stations in the quad. We cannot wait for the administration to act; we must lead.",
          },
          {
            title: "Mental Health First",
            description: "Doubling the availability of walk-in counseling hours during finals week and creating 'de-stress zones' in the library.",
          },
          {
            title: "Open Budget",
            description: "Every dollar spent by the student government will be tracked on a public dashboard in real-time. You deserve to know where your fees are going.",
          },
        ],
      },
    },
    {
      id: "4",
      name: "David Okonjo",
      class: "Class of 2026",
      position: "vp",
      department: "LAW SCHOOL",
      quote: "Justice for students. Fair grading and better housing policies.",
      image: candidateImages.candidate4,
      year: "Junior (2026)",
      gpa: "3.7",
      experience: "Student Advocate",
      manifesto: {
        intro: "As a law student, I believe in justice, fairness, and advocacy for all students. My platform focuses on ensuring every student's voice is heard and their rights are protected.",
        pillars: [
          {
            title: "Fair Grading Policies",
            description: "Advocate for transparent and fair grading policies across all departments.",
          },
          {
            title: "Housing Reform",
            description: "Work with administration to improve housing conditions and policies.",
          },
          {
            title: "Student Rights",
            description: "Establish a student rights committee to address grievances and concerns.",
          },
        ],
      },
    },
    {
      id: "5",
      name: "Emily Zhang",
      class: "Class of 2025",
      position: "secretary",
      department: "COMPUTER SCIENCE",
      quote: "Tech for good. Upgrading campus WiFi and digital resources.",
      image: candidateImages.candidate5,
      year: "Senior (2025)",
      gpa: "3.9",
      experience: "Tech Club Founder",
      manifesto: {
        intro: "Technology can transform how we learn, communicate, and organize. As a computer science student, I'll bring innovative solutions to improve campus digital infrastructure.",
        pillars: [
          {
            title: "Campus WiFi Upgrade",
            description: "Comprehensive upgrade to campus WiFi infrastructure for better connectivity.",
          },
          {
            title: "Digital Resources",
            description: "Expand digital resources and online platforms for student services.",
          },
          {
            title: "Tech Accessibility",
            description: "Ensure all students have access to necessary technology and digital tools.",
          },
        ],
      },
    },
    {
      id: "6",
      name: "Michael Ross",
      class: "Class of 2026",
      position: "treasurer",
      department: "HUMANITIES",
      quote: "Preserving our culture. More funding for student art projects.",
      image: candidateImages.candidate5, // Using candidate5 as placeholder for candidate 6
      year: "Junior (2026)",
      gpa: "3.6",
      experience: "Arts Council Member",
      manifesto: {
        intro: "Arts and culture are essential to our campus community. I believe in preserving our cultural heritage while supporting new creative initiatives.",
        pillars: [
          {
            title: "Arts Funding",
            description: "Increased funding for student art projects, performances, and exhibitions.",
          },
          {
            title: "Cultural Events",
            description: "More diverse cultural events and celebrations throughout the academic year.",
          },
          {
            title: "Creative Spaces",
            description: "Dedicated spaces for artistic expression and collaboration.",
          },
        ],
      },
    },
  ];

  // Calculate time remaining for active elections
  useEffect(() => {
    if (electionStatus !== "active") {
      hasInvalidatedOnTimerEnd.current = false;
      return;
    }

    const calculateTime = () => {
      const now = new Date().getTime();
      const end = endTime.getTime();
      const difference = end - now;

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        setTimeRemaining({ days, hours, minutes, seconds });
      } else {
        setTimeRemaining({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        // Timer elapsed - invalidate queries to update election status (only once)
        if (!hasInvalidatedOnTimerEnd.current) {
          hasInvalidatedOnTimerEnd.current = true;
          queryClient.invalidateQueries({ queryKey: ["ballot", electionId] });
          queryClient.invalidateQueries({ queryKey: ["election", electionSlug] });
        }
      }
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);

    return () => clearInterval(interval);
  }, [endTime, electionStatus, electionId, electionSlug, queryClient]);

  // Calculate time until start for upcoming elections
  useEffect(() => {
    if (electionStatus !== "upcoming") {
      hasInvalidatedOnTimerStart.current = false;
      return;
    }

    const calculateTime = () => {
      const now = new Date().getTime();
      const start = startTime.getTime();
      const difference = start - now;

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        setTimeUntilStart({ days, hours, minutes, seconds });
      } else {
        setTimeUntilStart({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        // Timer elapsed - invalidate queries to update election status (election should now be active, only once)
        if (!hasInvalidatedOnTimerStart.current) {
          hasInvalidatedOnTimerStart.current = true;
          queryClient.invalidateQueries({ queryKey: ["ballot", electionId] });
          queryClient.invalidateQueries({ queryKey: ["election", electionSlug] });
        }
      }
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);

    return () => clearInterval(interval);
  }, [startTime, electionStatus, electionId, electionSlug, queryClient]);

  // Get unique office names for filter
  const officeNames = useMemo(() => {
    const unique = Array.from(new Set(offices.map(o => o.name.toLowerCase())));
    return unique;
  }, [offices]);

  const filteredCandidates = allCandidates.filter((candidate) => {
    if (positionFilter === "all") return true;
    return candidate.position === positionFilter || candidate.officeName.toLowerCase() === positionFilter;
  });

  const formatTime = (value: number) => value.toString().padStart(2, "0");

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#102222] flex items-center justify-center p-4">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#13ecec] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-lg font-medium mb-2">Loading Election</p>
          <p className="text-[#92c9c9] text-sm">Getting election information...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !ballotData || !election) {
    return (
      <div className="min-h-screen bg-[#102222] flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <p className="text-red-400 text-lg font-medium mb-2">Error Loading Election</p>
          <p className="text-[#92c9c9] text-sm mb-4">
            {error instanceof Error ? error.message : "Failed to load election data"}
          </p>
          <button
            onClick={() => navigate(-1)}
            className="px-6 py-3 bg-[#13ecec] text-[#112222] rounded font-bold uppercase"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

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

      <div className="max-w-7xl mx-auto relative z-10 p-4 md:p-8 pb-20">
        {/* Header with Back Button */}
        <div className="mb-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-[#92c9c9] hover:text-white transition-colors mb-4"
          >
            <MdArrowBack className="w-5 h-5" />
            <span className="text-sm font-medium">Back</span>
          </button>

          {/* Election Status and Title - Different based on status */}
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-3">
                {electionStatus === "upcoming" && (
                  <>
                    <div className="w-2 h-2 bg-yellow-400 shadow-[0_0_8px_rgba(250,204,21,0.8)]"></div>
                    <span className="text-yellow-400 text-xs font-medium uppercase tracking-wider">
                      UPCOMING
                    </span>
                  </>
                )}
                {electionStatus === "active" && (
                  <>
                    <div className="w-2 h-2 bg-[#13ecec] shadow-[0_0_8px_rgba(19,236,236,0.8)]"></div>
                    <span className="text-[#13ecec] text-xs font-medium uppercase tracking-wider">
                      VOTING LIVE
                    </span>
                  </>
                )}
                {electionStatus === "completed" && (
                  <>
                    <div className="w-2 h-2 bg-[#568888] shadow-[0_0_8px_rgba(86,136,136,0.8)]"></div>
                    <span className="text-[#568888] text-xs font-medium uppercase tracking-wider">
                      COMPLETED
                    </span>
                  </>
                )}
              </div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-3 uppercase">
                {election.name}
              </h1>
              <p className="text-[#92c9c9] text-sm sm:text-base max-w-2xl">
                {election.description || 
                  (electionStatus === "upcoming" 
                    ? "This election will begin soon. Review the candidates below and prepare to cast your vote."
                    : electionStatus === "active"
                    ? "Cast your vote for the next academic year's leadership. Review manifestos and candidate profiles below before submitting your ballot."
                    : "This election has ended. View the results to see the winners.")}
              </p>
              <div className="mt-4 space-y-2">
                <div className="text-sm text-[#568888]">
                  <span className="font-medium text-[#92c9c9]">Start:</span>{" "}
                  {new Date(election.startDate).toLocaleString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: true,
                  })}
                </div>
                <div className="text-sm text-[#568888]">
                  <span className="font-medium text-[#92c9c9]">End:</span>{" "}
                  {new Date(election.endDate).toLocaleString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: true,
                  })}
                </div>
              </div>
            </div>

            {/* Countdown Timer - Different for upcoming vs active */}
            {electionStatus === "upcoming" && (
              <div className="flex flex-col">
                <h3 className="text-[#568888] text-xs uppercase tracking-wider mb-4">STARTS IN</h3>
              
                <div className={`grid ${timeUntilStart.days > 0 ? 'grid-cols-2' : 'grid-cols-2'} gap-3 mb-4`}>
                  {timeUntilStart.days > 0 && (
                    <div className="bg-[#102222] border border-[#234848] p-4 text-center">
                      <div className="text-3xl font-bold text-white">{formatTime(timeUntilStart.days)}</div>
                      <div className="text-xs text-white mt-1">{timeUntilStart.days === 1 ? "DAY" : "DAYS"}</div>
                    </div>
                  )}
                  <div className="bg-[#102222] border border-[#234848] p-4 text-center">
                    <div className="text-3xl font-bold text-white">{formatTime(timeUntilStart.hours)}</div>
                    <div className="text-xs text-white mt-1">HOURS</div>
                  </div>
                  <div className="bg-[#102222] border border-[#234848] p-4 text-center">
                    <div className="text-3xl font-bold text-white">{formatTime(timeUntilStart.minutes)}</div>
                    <div className="text-xs text-white mt-1">MINUTES</div>
                  </div>
                  <div className="bg-[#102222] border border-[#234848] p-4 text-center">
                    <div className="text-3xl font-bold text-white">{formatTime(timeUntilStart.seconds)}</div>
                    <div className="text-xs text-white mt-1">SECONDS</div>
                  </div>
                </div>

                <p className="text-[#568888] text-xs">
                  Voting starts at {startTime.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true })} EST
                </p>
              </div>
            )}

            {electionStatus === "active" && (
              <div className="flex flex-col">
                <h3 className="text-[#568888] text-xs uppercase tracking-wider mb-4">TIME REMAINING</h3>
              
                <div className={`grid ${timeRemaining.days > 0 ? 'grid-cols-2' : 'grid-cols-2'} gap-3 mb-4`}>
                  {timeRemaining.days > 0 && (
                    <div className="bg-[#102222] border border-[#234848] p-4 text-center">
                      <div className="text-3xl font-bold text-white">{formatTime(timeRemaining.days)}</div>
                      <div className="text-xs text-white mt-1">{timeRemaining.days === 1 ? "DAY" : "DAYS"}</div>
                    </div>
                  )}
                  <div className="bg-[#102222] border border-[#234848] p-4 text-center">
                    <div className="text-3xl font-bold text-white">{formatTime(timeRemaining.hours)}</div>
                    <div className="text-xs text-white mt-1">HOURS</div>
                  </div>
                  <div className="bg-[#102222] border border-[#234848] p-4 text-center">
                    <div className="text-3xl font-bold text-white">{formatTime(timeRemaining.minutes)}</div>
                    <div className="text-xs text-white mt-1">MINUTES</div>
                  </div>
                  <div className="bg-[#102222] border border-[#234848] p-4 text-center">
                    <div className="text-3xl font-bold text-white">{formatTime(timeRemaining.seconds)}</div>
                    <div className="text-xs text-white mt-1">SECONDS</div>
                  </div>
                  {timeRemaining.days === 0 && (
                    <div className="bg-[#13ecec] p-4 text-center flex flex-col items-center justify-center">
                      <svg
                        viewBox="0 0 24 24"
                        className="w-6 h-6 text-[#112222] mb-1"
                        fill="currentColor"
                      >
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z" />
                      </svg>
                      <div className="text-xs font-bold text-[#112222] uppercase">URGENT</div>
                    </div>
                  )}
                </div>

                <p className="text-[#568888] text-xs">
                  Voting closes at {endTime.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true })} EST
                </p>
              </div>
            )}

            {electionStatus === "completed" && (
              <div className="flex flex-col">
                <div className="bg-[#102222] border border-[#234848] p-6 text-center">
                  <div className="text-2xl font-bold text-white mb-2">ELECTION ENDED</div>
                  <div className="text-sm text-[#92c9c9]">
                    {endTime.toLocaleDateString("en-US", { 
                      month: "long", 
                      day: "numeric", 
                      year: "numeric" 
                    })}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons - Different based on status */}
        <div className="mb-6 flex justify-end">
          {electionStatus === "upcoming" && (
            <div className="bg-[#234848] text-[#92c9c9] font-bold px-8 py-3 flex items-center gap-2 uppercase tracking-wider opacity-50 cursor-not-allowed">
              <span>VOTING NOT YET OPEN</span>
            </div>
          )}

          {electionStatus === "active" && (
            <>
              {isLoadingVoteStatus ? (
                <button
                  disabled
                  className="bg-[#234848] text-[#92c9c9] font-bold px-8 py-3 flex items-center gap-2 transition-all opacity-50 cursor-not-allowed uppercase tracking-wider"
                >
                  <span>Loading...</span>
                </button>
              ) : hasVoted ? (
                <button
                  onClick={() => navigate(`/vote-verification?electionId=${electionId}`)}
                  className="bg-[#13ecec] hover:bg-[#0fd6d6] text-[#112222] font-bold px-8 py-3 flex items-center gap-2 transition-all shadow-[0_0_20px_-5px_rgba(19,236,236,0.3)] hover:shadow-[0_0_25px_-5px_rgba(19,236,236,0.5)] uppercase tracking-wider"
                >
                  <MdVerified className="w-5 h-5" />
                  <span>VERIFY RECEIPT</span>
                </button>
              ) : (
                <button
                  onClick={() => navigate(`/elections/${electionSlug}/ballot`)}
                  className="bg-[#13ecec] hover:bg-[#0fd6d6] text-[#112222] font-bold px-8 py-3 flex items-center gap-2 transition-all shadow-[0_0_20px_-5px_rgba(19,236,236,0.3)] hover:shadow-[0_0_25px_-5px_rgba(19,236,236,0.5)] uppercase tracking-wider"
                >
                  <MdHowToVote className="w-5 h-5" />
                  <span>CAST YOUR VOTE</span>
                </button>
              )}
            </>
          )}

          {electionStatus === "completed" && (
            <button
              onClick={() => navigate(`/elections/${electionSlug}/results`)}
              className="bg-[#13ecec] hover:bg-[#0fd6d6] text-[#112222] font-bold px-8 py-3 flex items-center gap-2 transition-all shadow-[0_0_20px_-5px_rgba(19,236,236,0.3)] hover:shadow-[0_0_25px_-5px_rgba(19,236,236,0.5)] uppercase tracking-wider"
            >
              <MdBarChart className="w-5 h-5" />
              <span>VIEW RESULTS</span>
            </button>
          )}
        </div>

        {/* Position Filter Tabs */}
        {offices.length > 0 && (
          <div className="mb-6 flex gap-2 overflow-x-auto">
            <button
              onClick={() => setPositionFilter("all")}
              className={`px-4 py-2 font-bold text-sm uppercase tracking-wider transition-colors whitespace-nowrap ${
                positionFilter === "all"
                  ? "bg-[#13ecec] text-[#112222]"
                  : "bg-[#142828] border border-[#234848] text-[#92c9c9] hover:text-white"
              }`}
            >
              ALL CANDIDATES
            </button>
            {offices.map((office) => (
              <button
                key={office.id}
                onClick={() => setPositionFilter(office.name.toLowerCase())}
                className={`px-4 py-2 font-bold text-sm uppercase tracking-wider transition-colors whitespace-nowrap ${
                  positionFilter === office.name.toLowerCase()
                    ? "bg-[#13ecec] text-[#112222]"
                    : "bg-[#142828] border border-[#234848] text-[#92c9c9] hover:text-white"
                }`}
              >
                {office.name}
              </button>
            ))}
          </div>
        )}

        {/* Candidates Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          {filteredCandidates.map((candidate) => (
            <div
              key={candidate.id}
              onClick={() => setSelectedCandidate(candidate)}
              className={`bg-[#142828] border-2 cursor-pointer transition-all group relative overflow-hidden ${
                selectedCandidate?.id === candidate.id
                  ? "border-[#13ecec]"
                  : "border-[#234848] hover:border-[#13ecec]/50"
              }`}
            >
              {/* Candidate Image */}
              <div className="relative h-64 overflow-hidden">
                {candidate.image ? (
                  <img
                    src={candidate.image}
                    alt={candidate.name}
                    className={`w-full h-full object-cover transition-all duration-300 ${
                      selectedCandidate?.id === candidate.id ? "grayscale-0" : "grayscale group-hover:grayscale-0"
                    }`}
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = "none";
                      const fallback = target.parentElement?.querySelector(".fallback");
                      if (fallback) {
                        (fallback as HTMLElement).style.display = "flex";
                      }
                    }}
                  />
                ) : null}
                <div className={`${candidate.image ? 'fallback hidden' : ''} absolute inset-0 bg-gradient-to-br from-[#13ecec]/20 to-[#234848] items-center justify-center text-4xl font-bold text-white flex`}>
                  {candidate.name.split(" ").map((n) => n[0]).join("")}
                </div>
              </div>

              {/* Candidate Info */}
              <div className="p-4">
                {positionFilter === "all" && candidate.officeName && (
                  <div className="text-[#568888] text-xs uppercase tracking-wider mb-1">
                    <span className="text-[#13ecec]">{candidate.officeName}</span>
                  </div>
                )}
                <h3 className="text-xl font-bold text-white mb-1 uppercase">{candidate.name}</h3>
                {candidate.regNumber && (
                  <p className="text-[#92c9c9] text-sm mb-3">{candidate.regNumber}</p>
                )}
                {candidate.quote && (
                  <p className="text-[#92c9c9] text-sm italic mb-4">"{candidate.quote}"</p>
                )}
                <button className="w-full bg-[#234848] hover:bg-[#2a5555] text-white font-bold px-4 py-2 flex items-center justify-center gap-2 transition-colors text-sm">
                  <span>READ MANIFESTO</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Candidate Detail Sidebar */}
      {selectedCandidate && (
        <>
          {/* Overlay */}
          <div
            className="fixed inset-0 bg-black/50 z-40 transition-opacity duration-300"
            onClick={() => setSelectedCandidate(null)}
          />
          
          {/* Sidebar */}
          <div
            className={
              `fixed right-0 top-0 h-full w-full sm:w-[500px] lg:w-[600px] bg-[#102222] border-l border-[#234848] z-50 overflow-y-auto transform transition-all duration-300 ease-out ` +
              (selectedCandidate
                ? "translate-x-0"
                : "translate-x-full pointer-events-none opacity-0")
            }
            style={{ willChange: 'transform, opacity' }}
          >
            <div className="p-6 space-y-6">
              {/* Close Button */}
              <div className="flex justify-end">
                <button
                  onClick={() => setSelectedCandidate(null)}
                  className="w-8 h-8 flex items-center justify-center text-[#92c9c9] hover:text-white transition-colors"
                >
                  <MdClose className="w-6 h-6" />
                </button>
              </div>

              {/* Candidate Profile */}
              <div className="flex flex-col sm:flex-row items-start gap-4">
                <div className="relative flex-shrink-0">
                  <img
                    src={selectedCandidate.image}
                    alt={selectedCandidate.name}
                    className="w-32 h-32 object-cover border-2 border-[#13ecec] rounded"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = "none";
                      const fallback = target.parentElement?.querySelector(".fallback-sidebar");
                      if (fallback) {
                        (fallback as HTMLElement).style.display = "flex";
                      }
                    }}
                  />
                  <div className="fallback-sidebar hidden w-32 h-32 bg-gradient-to-br from-[#13ecec]/20 to-[#234848] items-center justify-center text-2xl font-bold text-white border-2 border-[#13ecec] rounded">
                    {selectedCandidate.name.split(" ").map((n) => n[0]).join("")}
                  </div>
                </div>
                <div className="flex-1">
                  <h2 className="text-3xl font-bold text-white mb-2">{selectedCandidate.name}</h2>
                  {selectedCandidate.officeName && (
                    <div className="text-[#13ecec] text-sm uppercase tracking-wider mb-4">
                      {selectedCandidate.officeName}
                    </div>
                  )}
                  {selectedCandidate.regNumber && (
                    <div className="text-[#92c9c9] text-sm mb-4">
                      {selectedCandidate.regNumber}
                    </div>
                  )}
                </div>
              </div>

              {/* Quote */}
              {selectedCandidate.quote && (
                <div>
                  <h3 className="text-white font-bold uppercase tracking-wider text-sm mb-4">QUOTE</h3>
                  <p className="text-[#92c9c9] text-sm leading-relaxed relative">
                    <span className="absolute -left-4 -top-2 text-6xl text-[#234848] font-serif">"</span>
                    {selectedCandidate.quote}
                  </p>
                </div>
              )}

              {/* Manifesto */}
              {selectedCandidate.manifesto && (
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <MdVolumeUp className="w-5 h-5 text-[#13ecec]" />
                    <h3 className="text-[#13ecec] font-bold uppercase tracking-wider text-sm">MANIFESTO</h3>
                  </div>
                  <p className="text-[#92c9c9] text-sm leading-relaxed mb-6">
                    {selectedCandidate.manifesto}
                  </p>
                </div>
              )}

              {/* Vote Button or Verify Receipt Button - Only show for active elections */}
              {electionStatus === "active" && (
                <>
                  {hasVoted ? (
                    <button 
                      onClick={() => {
                        navigate(`/vote-verification?electionId=${electionId || ''}`);
                        setSelectedCandidate(null);
                      }}
                      className="w-full bg-[#13ecec] hover:bg-[#0fd6d6] text-[#112222] font-bold px-6 py-4 flex items-center justify-center gap-2 transition-colors uppercase tracking-wider"
                    >
                      <MdVerified className="w-5 h-5" />
                      <span>VERIFY RECEIPT</span>
                    </button>
                  ) : (
                    <button 
                      onClick={() => {
                        navigate(`/elections/${electionSlug}/ballot`);
                        setSelectedCandidate(null);
                      }}
                      className="w-full bg-[#13ecec] hover:bg-[#0fd6d6] text-[#112222] font-bold px-6 py-4 flex items-center justify-center gap-2 transition-colors uppercase tracking-wider"
                    >
                      <MdHowToVote className="w-5 h-5" />
                      <span>CAST YOUR VOTE</span>
                    </button>
                  )}
                </>
              )}
            </div>
          </div>
        </>
      )}

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

