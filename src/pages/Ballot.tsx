import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { MdPerson, MdCheckBox, MdCheckBoxOutlineBlank, MdArrowBack, MdCheckCircle, MdVerified, MdErrorOutline, MdBarChart, MdHowToVote } from "react-icons/md";
import { useBallot } from "../hooks/useBallot";
import { useVoting, votingService } from "../hooks/useVoting";
import { useVoteStatus } from "../hooks/useVoteStatus";
import { FloatingMenu } from "../components/FloatingMenu";
import { authService } from "../lib/auth";

type VotingStep = "loading" | "ballot" | "verifying" | "submitting" | "success" | "error";

export function Ballot() {
  const navigate = useNavigate();
  const { id: electionId } = useParams();
  const { data: ballotResponse, isLoading: isLoadingBallot, error: ballotError } = useBallot(electionId);
  const { data: hasVoted, isLoading: isLoadingVoteStatus } = useVoteStatus(electionId);
  const { verifyEligibility, submitVote } = useVoting();

  const [votingStep, setVotingStep] = useState<VotingStep>("loading");
  const [selectedVotes, setSelectedVotes] = useState<Record<string, string>>({});
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [receiptCode, setReceiptCode] = useState<string | null>(null);

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
    { path: "/stats", label: "Stats", icon: MdBarChart },
    { path: "/verify", label: "Verify Receipt", icon: MdVerified },
  ];

  // Initialize voting step based on ballot loading state and vote status
  useEffect(() => {
    if (isLoadingBallot || isLoadingVoteStatus) {
      setVotingStep("loading");
    } else if (hasVoted) {
      // User has already voted - prevent access
      setVotingStep("error");
      setErrorMessage("You have already voted in this election. You cannot vote again.");
    } else if (ballotError || !ballotResponse?.success) {
      setVotingStep("error");
      setErrorMessage(ballotError instanceof Error ? ballotError.message : "Failed to load ballot");
    } else {
      setVotingStep("ballot");
    }
  }, [isLoadingBallot, isLoadingVoteStatus, hasVoted, ballotError, ballotResponse]);

  const handleCandidateSelect = (officeId: string, candidateId: string) => {
    setSelectedVotes((prev) => ({
      ...prev,
      [officeId]: candidateId,
    }));
  };

  const handleAbstain = (officeId: string) => {
    setSelectedVotes((prev) => ({
      ...prev,
      [officeId]: "abstain",
    }));
  };

  const handleSubmitVote = async () => {
    if (!electionId || !ballotResponse?.success) return;

    try {
      setVotingStep("verifying");
      setErrorMessage(null);

      // Step 1: Verify eligibility and get token
      const eligibilityResponse = await verifyEligibility.mutateAsync(electionId);
      
      if (!eligibilityResponse.success || !eligibilityResponse.data) {
        throw new Error(eligibilityResponse.message || "Failed to verify eligibility");
      }

      const token = eligibilityResponse.data.token;

      // Step 2: Get last vote reference for linking
      setVotingStep("submitting");
      const prevHash = await votingService.getLastVoteHash(electionId);

      // Step 3: Prepare vote data (convert abstain to empty selection)
      const voteData: Record<string, string> = {};
      for (const [officeId, candidateId] of Object.entries(selectedVotes)) {
        if (candidateId !== "abstain") {
          voteData[officeId] = candidateId;
        }
      }

      // Step 4: Submit vote
      const voteResponse = await submitVote.mutateAsync({
        electionId,
        tokenId: token.tokenHash, // Keep internal name but user won't see this
        voteData,
        prevHash: prevHash || undefined,
      });

      if (!voteResponse.success || !voteResponse.data) {
        throw new Error(voteResponse.message || "Failed to submit vote");
      }

      // Success!
      setReceiptCode(voteResponse.data.receipt.code);
      setVotingStep("success");
    } catch (error) {
      console.error("Voting error:", error);
      setErrorMessage(error instanceof Error ? error.message : "Failed to submit vote");
      setVotingStep("error");
    }
  };

  const ballotData = ballotResponse?.success ? ballotResponse.data : null;
  const offices = ballotData?.offices || [];
  const election = ballotData?.election;

  // Calculate progress
  const totalOffices = offices.length;
  const completedOffices = Object.keys(selectedVotes).length;
  const progressPercentage = totalOffices > 0 ? (completedOffices / totalOffices) * 100 : 0;

  // Loading state
  if (votingStep === "loading") {
    return (
      <div className="min-h-screen bg-[#102222] flex items-center justify-center p-4 relative">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#13ecec] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-lg font-medium mb-2">Loading Your Ballot</p>
          <p className="text-[#92c9c9] text-sm">Getting your ballot ready...</p>
        </div>
        <FloatingMenu
          items={menuItems}
          title="echo"
          onLogout={handleLogout}
        />
      </div>
    );
  }

  // Error state - including already voted
  if (votingStep === "error" && (!ballotData || hasVoted)) {
    return (
      <div className="min-h-screen bg-[#102222] flex items-center justify-center p-4 relative">
        <div className="text-center max-w-md">
          {hasVoted ? (
            <>
              <div className="w-16 h-16 bg-[#13ecec]/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <MdVerified className="w-8 h-8 text-[#13ecec]" />
              </div>
              <p className="text-[#13ecec] text-lg font-medium mb-2">Already Voted</p>
              <p className="text-[#92c9c9] text-sm mb-4">
                {errorMessage || "You have already cast your vote in this election. You cannot vote again."}
              </p>
              <div className="flex gap-4 justify-center">
                <button
                  onClick={() => navigate(`/elections/${electionId}`)}
                  className="px-4 py-2 bg-[#234848] text-white rounded font-medium"
                >
                  View Election
                </button>
                <button
                  onClick={() => navigate(`/vote-verification?electionId=${electionId}`)}
                  className="px-4 py-2 bg-[#13ecec] text-[#112222] rounded font-medium flex items-center gap-2"
                >
                  <MdVerified className="w-4 h-4" />
                  Verify Receipt
                </button>
              </div>
            </>
          ) : (
            <>
              <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <MdErrorOutline className="w-8 h-8 text-red-400" />
              </div>
              <p className="text-red-400 text-lg font-medium mb-2">Error Loading Ballot</p>
              <p className="text-[#92c9c9] text-sm mb-4">{errorMessage || "Failed to load ballot data"}</p>
              <div className="flex gap-4 justify-center">
                <button
                  onClick={() => navigate(-1)}
                  className="px-4 py-2 bg-[#234848] text-white rounded font-medium"
                >
                  Go Back
                </button>
                <button
                  onClick={() => window.location.reload()}
                  className="px-4 py-2 bg-[#13ecec] text-[#112222] rounded font-medium"
                >
                  Retry
                </button>
              </div>
            </>
          )}
        </div>
        <FloatingMenu
          items={menuItems}
          title="echo"
          onLogout={handleLogout}
        />
      </div>
    );
  }

  // Verifying eligibility state
  if (votingStep === "verifying") {
    return (
      <div className="min-h-screen bg-[#102222] flex items-center justify-center p-4 relative">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 border-4 border-[#13ecec] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-lg font-medium mb-2">Checking Eligibility</p>
          <p className="text-[#92c9c9] text-sm">Verifying you can vote in this election...</p>
          <div className="mt-6 w-full bg-[#234848] rounded-full h-2">
            <div className="bg-[#13ecec] h-2 rounded-full animate-pulse" style={{ width: "60%" }}></div>
          </div>
        </div>
        <FloatingMenu
          items={menuItems}
          title="echo"
          onLogout={handleLogout}
        />
      </div>
    );
  }

  // Submitting vote state
  if (votingStep === "submitting") {
    return (
      <div className="min-h-screen bg-[#102222] flex items-center justify-center p-4 relative">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 border-4 border-[#13ecec] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-lg font-medium mb-2">Submitting Your Vote</p>
          <p className="text-[#92c9c9] text-sm mb-4">Please wait while we securely save your vote...</p>
          <div className="space-y-2">
            <div className="w-full bg-[#234848] rounded-full h-2">
              <div className="bg-[#13ecec] h-2 rounded-full transition-all duration-500" style={{ width: "80%" }}></div>
            </div>
            <p className="text-[#568888] text-xs">Securing and saving your vote</p>
          </div>
        </div>
        <FloatingMenu
          items={menuItems}
          title="echo"
          onLogout={handleLogout}
        />
      </div>
    );
  }

  // Success state
  if (votingStep === "success") {
    return (
      <div className="min-h-screen bg-[#102222] flex items-center justify-center p-4 relative">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 bg-[#13ecec]/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <MdCheckCircle className="w-12 h-12 text-[#13ecec]" />
          </div>
          <h2 className="text-3xl font-bold text-white mb-4">Vote Submitted Successfully!</h2>
          <p className="text-[#92c9c9] text-sm mb-6">
            Your vote has been securely saved and recorded.
          </p>
          {receiptCode && (
            <div className="bg-[#142828] border border-[#234848] p-6 rounded-lg mb-6">
              <p className="text-[#568888] text-xs uppercase tracking-wider mb-2">Receipt Code</p>
              <p className="text-2xl font-bold text-[#13ecec] font-mono">{receiptCode}</p>
              <p className="text-[#92c9c9] text-xs mt-2">Save this code for your records</p>
            </div>
          )}
          <div className="flex gap-4 justify-center">
            <button
              onClick={() => navigate("/dashboard")}
              className="px-6 py-3 bg-[#13ecec] text-[#112222] rounded font-bold uppercase"
            >
              Return to Dashboard
            </button>
            <button
              onClick={() => navigate(`/elections/${electionId}`)}
              className="px-6 py-3 bg-[#234848] text-white rounded font-bold uppercase"
            >
              View Election
            </button>
          </div>
        </div>
        <FloatingMenu
          items={menuItems}
          title="echo"
          onLogout={handleLogout}
        />
      </div>
    );
  }

  // Main ballot view
  if (!ballotData || !election) {
    return null;
  }

  const canSubmit = offices.length > 0 && Object.keys(selectedVotes).length > 0;

  return (
    <div className="min-h-screen w-full bg-[#102222] relative overflow-y-auto overflow-x-hidden">
      {/* Grid pattern overlay */}
      <div
        className="fixed inset-0 opacity-10 pointer-events-none"
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
              <p className="text-white text-sm">{election.name}</p>
            </div>
            <div className="text-right">
              <div className="text-white font-bold text-sm mb-1">
                {completedOffices} OF {totalOffices} COMPLETE
              </div>
              <div className="text-[#92c9c9] text-xs">Election ID: {election.id.substring(0, 8)}...</div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full h-2 bg-[#234848] rounded-full overflow-hidden">
            <div
              className="h-full bg-[#13ecec] transition-all duration-300"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
          <p className="text-[#568888] text-xs mt-2 text-center">
            {progressPercentage.toFixed(0)}% Complete
          </p>
        </div>

        {/* Error Message */}
        {errorMessage && votingStep === "error" && (
          <div className="mb-6 p-4 bg-red-900/20 border border-red-500/50 text-red-400 rounded">
            <p className="font-medium mb-1">Error</p>
            <p className="text-sm">{errorMessage}</p>
            <button
              onClick={() => {
                setErrorMessage(null);
                setVotingStep("ballot");
              }}
              className="mt-2 text-sm underline hover:no-underline"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Offices (Races) */}
        <div className="space-y-8">
          {offices.length === 0 ? (
            <div className="bg-[#142828] border border-[#234848] p-8 text-center">
              <p className="text-[#92c9c9]">No offices found for this election.</p>
            </div>
          ) : (
            offices.map((office) => {
              const selected = selectedVotes[office.id];
              const isAbstainSelected = selected === "abstain";

              return (
                <div key={office.id} className="bg-[#142828] border border-[#234848] p-6">
                  {/* Office Header */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-2">
                      <div className="text-[#13ecec]">
                        <MdPerson className="w-5 h-5" />
                      </div>
                      <h2 className="text-xl font-bold text-white uppercase">{office.name}</h2>
                    </div>
                    <div className="bg-[#234848] border border-[#234848] text-[#92c9c9] text-xs font-medium px-3 py-1 uppercase tracking-wider">
                      VOTE FOR 1
                    </div>
                  </div>

                  {office.description && (
                    <p className="text-[#92c9c9] text-sm mb-4">{office.description}</p>
                  )}

                  {/* Candidates */}
                  <div className="space-y-3">
                    {office.candidates.map((candidate) => {
                      const isSelected = selected === candidate.id;
                      return (
                        <div
                          key={candidate.id}
                          onClick={() => handleCandidateSelect(office.id, candidate.id)}
                          className={`bg-[#1a2a2a] border-2 cursor-pointer transition-all p-4 flex items-center gap-4 ${
                            isSelected ? "border-[#13ecec]" : "border-[#234848] hover:border-[#13ecec]/50"
                          }`}
                        >
                          {/* Candidate Image/Placeholder */}
                          <div className="flex-shrink-0 w-16 h-16 bg-[#234848] flex items-center justify-center overflow-hidden">
                            {candidate.image ? (
                              <img
                                src={candidate.image}
                                alt={candidate.name}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  const target = e.target as HTMLImageElement;
                                      target.style.display = "none";
                                }}
                              />
                            ) : (
                              <div className="w-full h-full bg-gradient-to-br from-[#13ecec]/20 to-[#234848] flex items-center justify-center text-white font-bold">
                                {candidate.name.substring(0, 2).toUpperCase()}
                              </div>
                            )}
                          </div>

                          {/* Candidate Info */}
                          <div className="flex-1 min-w-0">
                            <h3 className="text-lg font-bold text-white mb-1">{candidate.name}</h3>
                            {candidate.regNumber && (
                              <div className="text-[#13ecec] text-sm font-medium mb-2">
                                {candidate.regNumber}
                              </div>
                            )}
                            {candidate.quote && (
                              <p className="text-[#92c9c9] text-sm line-clamp-2">{candidate.quote}</p>
                            )}
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
                      onClick={() => handleAbstain(office.id)}
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
            })
          )}
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between items-center mt-8">
          <button
            onClick={() => navigate(-1)}
            disabled={verifyEligibility.isPending || submitVote.isPending}
            className="bg-[#234848] hover:bg-[#2a5555] text-white font-bold px-6 py-3 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <MdArrowBack className="w-5 h-5" />
            BACK
          </button>
          <button
            onClick={handleSubmitVote}
            disabled={!canSubmit || verifyEligibility.isPending || submitVote.isPending}
            className="bg-[#13ecec] hover:bg-[#0fd6d6] text-[#112222] font-bold px-6 py-3 transition-colors uppercase disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {verifyEligibility.isPending || submitVote.isPending
              ? "SUBMITTING..."
              : "SUBMIT VOTE"}
          </button>
        </div>
      </div>

      {/* Floating Menu */}
      <FloatingMenu
        items={menuItems}
        title="echo"
        onLogout={handleLogout}
      />
    </div>
  );
}
