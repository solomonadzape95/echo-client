import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MdSearch, MdContentCopy, MdVisibility, MdLock, MdCheckCircle, MdErrorOutline, MdHowToVote, MdBarChart, MdPerson, MdVerified } from "react-icons/md";
import { useReceiptVerification } from "../hooks/useReceiptVerification";
import { FloatingMenu } from "../components/FloatingMenu";
import { authService } from "../lib/auth";

export function VoteVerification() {
  const navigate = useNavigate();
  const [receiptCode, setReceiptCode] = useState("");
  const { mutate: verifyReceipt, data: verificationResponse, isPending, error } = useReceiptVerification();

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

  const handleSearch = () => {
    if (receiptCode.trim()) {
      verifyReceipt(receiptCode.trim());
    }
  };

  const handleCopyCode = () => {
    if (receiptCode) {
      navigator.clipboard.writeText(receiptCode);
    }
  };

  const verificationData = verificationResponse?.success ? verificationResponse.data : null;
  const hasError = error || (verificationResponse && !verificationResponse.success);

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
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Panel - Vote Verification Ledger */}
          <div className="lg:col-span-2 space-y-6">
            {/* Header */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-2 h-2 bg-[#13ecec] rounded-full shadow-[0_0_8px_rgba(19,236,236,0.8)]"></div>
                <span className="text-[#13ecec] text-xs font-medium uppercase tracking-wider">SYSTEM ONLINE</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
                Vote Verification <span className="text-[#13ecec]">Record</span>
              </h1>
              <p className="text-white text-sm leading-relaxed max-w-2xl">
                Enter your unique receipt code to verify your vote is permanently recorded and cannot be changed.
              </p>
            </div>

            {/* Receipt Code Input */}
            <div className="bg-[#142828] border border-[#234848] p-6">
              <label className="block text-white text-sm font-bold uppercase tracking-wider mb-3">
                RECEIPT CODE
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <MdVisibility className="w-5 h-5 text-[#568888]" />
                </div>
                <input
                  type="text"
                  value={receiptCode}
                  onChange={(e) => setReceiptCode(e.target.value.toUpperCase())}
                  placeholder="Enter your receipt code (e.g., ABC123)"
                  className="w-full h-14 pl-12 pr-12 bg-[#102222] text-white border-2 border-[#234848] focus:border-[#13ecec] focus:ring-0 font-mono text-sm transition-all placeholder:text-[#3a5c5c]"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleSearch();
                    }
                  }}
                />
                <div className="absolute inset-y-0 right-0 pr-4 flex items-center gap-2">
                  {receiptCode && (
                    <button
                      onClick={handleCopyCode}
                      className="text-[#568888] hover:text-[#13ecec] transition-colors"
                      title="Copy code"
                    >
                      <MdContentCopy className="w-5 h-5" />
                    </button>
                  )}
                </div>
              </div>

              {/* Security Status */}
              <div className="flex items-center gap-2 mt-3">
                <MdLock className="w-4 h-4 text-[#13ecec]" />
                <span className="text-[#92c9c9] text-xs">Vote secured and permanently recorded</span>
              </div>

              {/* Search Button */}
              <button
                onClick={handleSearch}
                disabled={!receiptCode.trim() || isPending}
                className="w-full mt-6 bg-[#13ecec] hover:bg-[#0fd6d6] text-[#112222] font-bold px-6 py-4 flex items-center justify-center gap-2 transition-all uppercase tracking-wider disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isPending ? (
                  <>
                    <div className="w-5 h-5 border-2 border-[#112222] border-t-transparent rounded-full animate-spin"></div>
                    <span>VERIFYING...</span>
                  </>
                ) : (
                  <>
                    <MdSearch className="w-5 h-5" />
                    <span>SEARCH RECORDS</span>
                  </>
                )}
              </button>
            </div>

            {/* Error State */}
            {hasError && !isPending && (
              <div className="bg-[#142828] border border-red-500/50 p-6">
                <div className="flex items-center gap-3 mb-4">
                  <MdErrorOutline className="w-6 h-6 text-red-400" />
                  <div>
                    <div className="text-red-400 text-xl font-bold">Receipt Not Found</div>
                    <div className="text-[#92c9c9] text-sm mt-1">
                      {verificationResponse && !verificationResponse.success
                        ? verificationResponse.message || "The receipt code you entered was not found in the records."
                        : error instanceof Error
                        ? error.message
                        : "Failed to verify receipt. Please check your receipt code and try again."}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Verification Results */}
            {verificationData && !isPending && (
              <div className="bg-[#142828] border border-[#234848] p-6 relative overflow-hidden">
                {/* Background checkmark */}
                <div className="absolute right-0 top-0 opacity-10">
                  <MdCheckCircle className="w-32 h-32 text-[#4ade80]" />
                </div>

                <div className="relative z-10 space-y-6">
                  {/* Vote Status */}
                  <div className="flex items-center gap-3">
                    <MdCheckCircle className="w-6 h-6 text-[#4ade80]" />
                    <div>
                      <div className="text-[#568888] text-xs uppercase tracking-wider mb-1">VOTE STATUS</div>
                      <div className="text-[#4ade80] text-xl font-bold">RECORDED & VERIFIED</div>
                    </div>
                  </div>

                  {/* Election Info */}
                  <div className="border-t border-[#234848] pt-4">
                    <div className="text-[#568888] text-xs uppercase tracking-wider mb-2">ELECTION</div>
                    <div className="text-white text-lg font-bold mb-1">{verificationData.election.name}</div>
                    {verificationData.election.description && (
                      <div className="text-[#92c9c9] text-sm">{verificationData.election.description}</div>
                    )}
                    <div className="flex items-center gap-4 mt-3">
                      <div>
                        <div className="text-[#568888] text-xs uppercase tracking-wider">Status</div>
                        <div className="text-[#13ecec] text-sm font-medium">{verificationData.election.status.toUpperCase()}</div>
                      </div>
                      <div>
                        <div className="text-[#568888] text-xs uppercase tracking-wider">Type</div>
                        <div className="text-[#13ecec] text-sm font-medium">{verificationData.election.type.toUpperCase()}</div>
                      </div>
                    </div>
                  </div>

                  {/* Vote Reference Code */}
                  <div className="border-t border-[#234848] pt-4">
                    <div className="text-[#568888] text-xs uppercase tracking-wider mb-2">VOTE REFERENCE CODE</div>
                    <div className="bg-[#102222] border border-[#234848] p-3 font-mono text-xs text-white break-all">
                      {verificationData.vote.currentHash}
                    </div>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(verificationData.vote.currentHash);
                      }}
                      className="mt-2 text-[#568888] hover:text-[#13ecec] text-xs flex items-center gap-1 transition-colors"
                    >
                      <MdContentCopy className="w-3 h-3" />
                      Copy Code
                    </button>
                  </div>

                  {/* Timestamp */}
                  <div className="border-t border-[#234848] pt-4">
                    <div className="flex items-center gap-3">
                      <svg className="w-6 h-6 text-[#13ecec]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <div>
                        <div className="text-[#568888] text-xs uppercase tracking-wider mb-1">TIMESTAMP (UTC)</div>
                        <div className="text-white text-lg font-bold">
                          {new Date(verificationData.vote.createdAt).toLocaleString("en-US", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                            second: "2-digit",
                            timeZone: "UTC",
                          })}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Receipt Info */}
                  <div className="border-t border-[#234848] pt-4">
                    <div className="text-[#568888] text-xs uppercase tracking-wider mb-2">RECEIPT CODE</div>
                    <div className="text-white text-lg font-mono font-bold">{verificationData.receipt.code}</div>
                    <div className="text-[#92c9c9] text-xs mt-1">
                      Created: {new Date(verificationData.receipt.createdAt).toLocaleString()}
                    </div>
                  </div>

                  {/* View Election Button */}
                  <button
                    onClick={() => navigate(`/elections/${verificationData.election.id}`)}
                    className="w-full bg-[#234848] hover:bg-[#2a5555] text-white font-bold px-6 py-3 flex items-center justify-center gap-2 transition-colors uppercase tracking-wider"
                  >
                    <MdHowToVote className="w-5 h-5" />
                    <span>VIEW ELECTION</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Right Panel - Info */}
          <div className="lg:col-span-1 space-y-6">
            {/* Header */}
            <div>
              <h2 className="text-white font-bold text-lg uppercase tracking-wider mb-2">HOW IT WORKS</h2>
              <p className="text-[#92c9c9] text-sm leading-relaxed">
                Every vote is assigned a unique receipt code when cast. Use this code to verify that your vote was successfully recorded and counted in the election.
              </p>
            </div>

            {/* Info Cards */}
            <div className="bg-[#142828] border border-[#234848] p-6 space-y-4">
              <div>
                <div className="text-[#568888] text-xs uppercase tracking-wider mb-2">SECURITY</div>
                <div className="text-white text-sm">
                  Your vote is secured and linked to a unique reference code in the voting record. The receipt code allows you to verify your vote without revealing your choices.
                </div>
              </div>
              <div className="border-t border-[#234848] pt-4">
                <div className="text-[#568888] text-xs uppercase tracking-wider mb-2">PERMANENCE</div>
                <div className="text-white text-sm">
                  Once recorded, votes cannot be altered or deleted. Each vote is securely linked to the previous vote in the record.
                </div>
              </div>
              <div className="border-t border-[#234848] pt-4">
                <div className="text-[#568888] text-xs uppercase tracking-wider mb-2">TRANSPARENCY</div>
                <div className="text-white text-sm">
                  The voting record is publicly verifiable. Anyone can check that a receipt code corresponds to a valid, recorded vote.
                </div>
              </div>
            </div>

            {/* Where to Find Receipt */}
            <div className="bg-[#142828] border border-[#234848] p-6">
              <div className="text-[#568888] text-xs uppercase tracking-wider mb-3">WHERE TO FIND YOUR RECEIPT</div>
              <div className="text-white text-sm space-y-2">
                <p>• After voting, you'll receive a receipt code on the confirmation screen</p>
                <p>• Check your profile page for a history of all your votes and receipts</p>
                <p>• Receipt codes are unique and cannot be duplicated</p>
              </div>
            </div>
          </div>
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
