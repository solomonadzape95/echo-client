import { useState, useEffect, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { MdArrowBack, MdLink, MdVideocam, MdVolumeUp, MdClose, MdHowToVote } from "react-icons/md";
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


type PositionFilter = "all" | "presidential" | "vp" | "secretary" | "treasurer";

interface Candidate {
  id: string;
  name: string;
  class: string;
  position: string;
  department: string;
  quote: string;
  image: string;
  isIncumbent?: boolean;
  year: string;
  gpa: string;
  experience: string;
  manifesto: {
    intro: string;
    pillars: Array<{
      title: string;
      description: string;
    }>;
  };
  website?: string;
  video?: string;
}

export function ElectionDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
  const [positionFilter, setPositionFilter] = useState<PositionFilter>("all");
  const [timeRemaining, setTimeRemaining] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  // Example election data - memoize endTime to prevent infinite loop
  const endTime = useMemo(() => {
    return new Date(Date.now() + 2 * 24 * 60 * 60 * 1000 + 14 * 60 * 60 * 1000 + 45 * 60 * 1000 + 12 * 1000);
  }, []);

  const election = {
    id: id || "1",
    title: "STUDENT BODY PRESIDENT",
    description: "Cast your vote for the next academic year's leadership. Review manifestos and candidate profiles below before submitting your ballot.",
    endTime,
  };

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

  useEffect(() => {
    const calculateTime = () => {
      const now = new Date().getTime();
      const end = endTime.getTime();
      const difference = end - now;

      if (difference > 0) {
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        setTimeRemaining({ hours, minutes, seconds });
      } else {
        setTimeRemaining({ hours: 0, minutes: 0, seconds: 0 });
      }
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);

    return () => clearInterval(interval);
  }, [endTime]);

  const filteredCandidates = candidates.filter((candidate) => {
    if (positionFilter === "all") return true;
    return candidate.position === positionFilter;
  });

  const formatTime = (value: number) => value.toString().padStart(2, "0");

  const getPositionLabel = (position: string) => {
    const labels: Record<string, string> = {
      presidential: "PRESIDENTIAL",
      vp: "VP",
      secretary: "SECRETARY",
      treasurer: "TREASURER",
    };
    return labels[position] || position.toUpperCase();
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

          {/* Election Status and Title */}
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-2 h-2 bg-[#13ecec] shadow-[0_0_8px_rgba(19,236,236,0.8)]"></div>
                <span className="text-[#13ecec] text-xs font-medium uppercase tracking-wider">
                  VOTING LIVE
                </span>
              </div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-3 uppercase">
                {election.title}
              </h1>
              <p className="text-[#92c9c9] text-sm sm:text-base max-w-2xl">
                {election.description}
              </p>
            </div>

            {/* Countdown Timer */}
            <div className="flex flex-col">
              <h3 className="text-[#568888] text-xs uppercase tracking-wider mb-4">TIME REMAINING</h3>
              
              <div className="grid grid-cols-2 gap-3 mb-4">
                {/* Hours */}
                <div className="bg-[#102222] border border-[#234848] p-4 text-center">
                  <div className="text-3xl font-bold text-white">{formatTime(timeRemaining.hours)}</div>
                  <div className="text-xs text-white mt-1">HOURS</div>
                </div>

                {/* Minutes */}
                <div className="bg-[#102222] border border-[#234848] p-4 text-center">
                  <div className="text-3xl font-bold text-white">{formatTime(timeRemaining.minutes)}</div>
                  <div className="text-xs text-white mt-1">MINUTES</div>
                </div>

                {/* Seconds */}
                <div className="bg-[#102222] border border-[#234848] p-4 text-center">
                  <div className="text-3xl font-bold text-white">{formatTime(timeRemaining.seconds)}</div>
                  <div className="text-xs text-white mt-1">SECONDS</div>
                </div>

                {/* Urgent indicator */}
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
              </div>

              <p className="text-[#568888] text-xs">
                Voting closes at {endTime.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true })} EST
              </p>
            </div>
          </div>
        </div>

        {/* Cast Vote Button */}
        <div className="mb-6 flex justify-end">
          <button
            onClick={() => navigate(`/elections/${id}/ballot`)}
            className="bg-[#13ecec] hover:bg-[#0fd6d6] text-[#112222] font-bold px-8 py-3 flex items-center gap-2 transition-all shadow-[0_0_20px_-5px_rgba(19,236,236,0.3)] hover:shadow-[0_0_25px_-5px_rgba(19,236,236,0.5)] uppercase tracking-wider"
          >
            <MdHowToVote className="w-5 h-5" />
            <span>CAST YOUR VOTE</span>
          </button>
        </div>

        {/* Position Filter Tabs */}
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
          <button
            onClick={() => setPositionFilter("presidential")}
            className={`px-4 py-2 font-bold text-sm uppercase tracking-wider transition-colors whitespace-nowrap ${
              positionFilter === "presidential"
                ? "bg-[#13ecec] text-[#112222]"
                : "bg-[#142828] border border-[#234848] text-[#92c9c9] hover:text-white"
            }`}
          >
            PRESIDENTIAL
          </button>
          <button
            onClick={() => setPositionFilter("vp")}
            className={`px-4 py-2 font-bold text-sm uppercase tracking-wider transition-colors whitespace-nowrap ${
              positionFilter === "vp"
                ? "bg-[#13ecec] text-[#112222]"
                : "bg-[#142828] border border-[#234848] text-[#92c9c9] hover:text-white"
            }`}
          >
            VP
          </button>
          <button
            onClick={() => setPositionFilter("secretary")}
            className={`px-4 py-2 font-bold text-sm uppercase tracking-wider transition-colors whitespace-nowrap ${
              positionFilter === "secretary"
                ? "bg-[#13ecec] text-[#112222]"
                : "bg-[#142828] border border-[#234848] text-[#92c9c9] hover:text-white"
            }`}
          >
            SECRETARY
          </button>
          <button
            onClick={() => setPositionFilter("treasurer")}
            className={`px-4 py-2 font-bold text-sm uppercase tracking-wider transition-colors whitespace-nowrap ${
              positionFilter === "treasurer"
                ? "bg-[#13ecec] text-[#112222]"
                : "bg-[#142828] border border-[#234848] text-[#92c9c9] hover:text-white"
            }`}
          >
            TREASURER
          </button>
        </div>

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
                <img
                  src={candidate.image}
                  alt={candidate.name}
                  className={`w-full h-full object-cover transition-all duration-300 ${
                    selectedCandidate?.id === candidate.id ? "grayscale-0" : "grayscale group-hover:grayscale-0"
                  }`}
                  onError={(e) => {
                    // Fallback if image doesn't exist
                    const target = e.target as HTMLImageElement;
                    target.style.display = "none";
                    const fallback = target.parentElement?.querySelector(".fallback");
                    if (fallback) {
                      (fallback as HTMLElement).style.display = "flex";
                    }
                  }}
                />
                <div className="fallback hidden absolute inset-0 bg-gradient-to-br from-[#13ecec]/20 to-[#234848] items-center justify-center text-4xl font-bold text-white">
                  {candidate.name.split(" ").map((n) => n[0]).join("")}
                </div>
                {candidate.isIncumbent && (
                  <div className="absolute top-2 right-2 bg-[#13ecec] text-[#112222] text-xs font-bold px-2 py-1 uppercase">
                    INCUMBENT
                  </div>
                )}
              </div>

              {/* Candidate Info */}
              <div className="p-4">
                <div className="text-[#568888] text-xs uppercase tracking-wider mb-1">
                  {candidate.department}
                  {positionFilter === "all" && (
                    <span className="ml-2 text-[#13ecec]">• {getPositionLabel(candidate.position)}</span>
                  )}
                </div>
                <h3 className="text-xl font-bold text-white mb-1 uppercase">{candidate.name}</h3>
                <p className="text-[#92c9c9] text-sm mb-3">{candidate.class}</p>
                <p className="text-[#92c9c9] text-sm italic mb-4">"{candidate.quote}"</p>
                <button className="w-full bg-[#234848] hover:bg-[#2a5555] text-white font-bold px-4 py-2 flex items-center justify-center gap-2 transition-colors text-sm">
                  <span>READ MANIFESTO</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
          ))}

          {/* Nominate Candidate Card */}
          <div className="bg-[#142828] border-2 border-dashed border-[#234848] p-8 flex flex-col items-center justify-center min-h-[400px] hover:border-[#13ecec]/50 transition-colors cursor-pointer">
            <div className="w-24 h-24 bg-[#234848] flex items-center justify-center mb-4">
              <svg className="w-12 h-12 text-[#13ecec]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-white mb-2 uppercase text-center">NOMINATE CANDIDATE</h3>
            <p className="text-[#92c9c9] text-sm text-center">
              Know someone who should run? Submit a nomination form.
            </p>
          </div>
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
                  <div className="text-[#13ecec] text-sm uppercase tracking-wider mb-4">
                    {selectedCandidate.department}
                  </div>
                  <div className="flex gap-2">
                    {selectedCandidate.website && (
                      <button className="bg-[#234848] hover:bg-[#2a5555] text-white px-4 py-2 flex items-center gap-2 transition-colors text-sm">
                        <MdLink className="w-4 h-4" />
                        <span>WEBSITE</span>
                      </button>
                    )}
                    {selectedCandidate.video && (
                      <button className="bg-[#234848] hover:bg-[#2a5555] text-white px-4 py-2 flex items-center gap-2 transition-colors text-sm">
                        <MdVideocam className="w-4 h-4" />
                        <span>VIDEO</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Key Stats */}
              <div>
                <h3 className="text-white font-bold uppercase tracking-wider text-sm mb-4">KEY STATS</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center py-2 border-b border-[#234848]">
                    <span className="text-[#92c9c9] text-sm">Year</span>
                    <span className="text-white font-medium">{selectedCandidate.year}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-[#234848]">
                    <span className="text-[#92c9c9] text-sm">GPA</span>
                    <span className="text-white font-medium">{selectedCandidate.gpa}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-[#234848]">
                    <span className="text-[#92c9c9] text-sm">Experience</span>
                    <span className="text-white font-medium">{selectedCandidate.experience}</span>
                  </div>
                </div>
              </div>

              {/* Manifesto Summary */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <MdVolumeUp className="w-5 h-5 text-[#13ecec]" />
                  <h3 className="text-[#13ecec] font-bold uppercase tracking-wider text-sm">MANIFESTO SUMMARY</h3>
                </div>
                <p className="text-[#92c9c9] text-sm leading-relaxed mb-6 relative">
                  <span className="absolute -left-4 -top-2 text-6xl text-[#234848] font-serif">"</span>
                  {selectedCandidate.manifesto.intro}
                </p>
                <div className="space-y-4">
                  {selectedCandidate.manifesto.pillars.map((pillar, index) => (
                    <div key={index} className="border-l-2 border-[#13ecec] pl-4">
                      <h4 className="text-white font-bold mb-2">
                        {index + 1}. {pillar.title}:
                      </h4>
                      <p className="text-[#92c9c9] text-sm leading-relaxed">{pillar.description}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Add to Ballot Button */}
              <button className="w-full bg-[#13ecec] hover:bg-[#0fd6d6] text-[#112222] font-bold px-6 py-4 flex items-center justify-center gap-2 transition-colors uppercase tracking-wider">
                <MdHowToVote className="w-5 h-5" />
                <span>ADD TO BALLOT</span>
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

