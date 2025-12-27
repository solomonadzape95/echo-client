import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MdSearch, MdContentCopy, MdVisibility, MdLock, MdCheckCircle, MdFilterList, MdRefresh, MdFolder } from "react-icons/md";

interface Transaction {
  id: string;
  type: "vote" | "verification" | "system";
  hash?: string;
  timestamp: string;
  status: string;
  icon: React.ReactNode;
}

export function VoteVerification() {
  const navigate = useNavigate();
  const [receiptHash, setReceiptHash] = useState("");
  const [verificationResult, setVerificationResult] = useState<{
    status: "Recorded" | "Not Found" | null;
    blockHeight: string | null;
    timestamp: string | null;
  }>({
    status: null,
    blockHeight: null,
    timestamp: null,
  });

  // Example live transactions
  const [transactions] = useState<Transaction[]>([
    {
      id: "1",
      type: "vote",
      hash: "0x7f8d...9a2b",
      timestamp: "Just now",
      status: "Block validated",
      icon: <MdCheckCircle className="w-4 h-4 text-[#4ade80]" />,
    },
    {
      id: "2",
      type: "verification",
      hash: "0x3a1c...f00d",
      timestamp: "4s ago",
      status: "Lookup performed",
      icon: <MdVisibility className="w-4 h-4 text-[#13ecec]" />,
    },
    {
      id: "3",
      type: "vote",
      hash: "0xb29e...11c4",
      timestamp: "12s ago",
      status: "Block validated",
      icon: <MdCheckCircle className="w-4 h-4 text-[#4ade80]" />,
    },
    {
      id: "4",
      type: "vote",
      hash: "0xc811...4a99",
      timestamp: "24s ago",
      status: "Block validated",
      icon: <MdCheckCircle className="w-4 h-4 text-[#4ade80]" />,
    },
    {
      id: "5",
      type: "system",
      timestamp: "1m ago",
      status: "Hourly backup",
      icon: <MdFolder className="w-4 h-4 text-[#568888]" />,
    },
    {
      id: "6",
      type: "vote",
      hash: "0xa1d4...88f2",
      timestamp: "1m 12s ago",
      status: "Block validated",
      icon: <MdCheckCircle className="w-4 h-4 text-[#4ade80]" />,
    },
  ]);

  const handleSearch = () => {
    if (receiptHash.trim()) {
      // Simulate verification
      setVerificationResult({
        status: "Recorded",
        blockHeight: "402,912",
        timestamp: "14:02:11",
      });
    }
  };

  const handleCopyHash = () => {
    navigator.clipboard.writeText(receiptHash);
  };

  const generateRandomHash = () => {
    const hash = "0x" + Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join("");
    setReceiptHash(hash);
  };

  const totalVotes = 12408;
  const hashRate = "42 MH/s";

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
                Vote Verification <span className="text-[#13ecec]">Ledger</span>
              </h1>
              <p className="text-white text-sm leading-relaxed max-w-2xl">
                Enter your unique 64-character receipt ID to verify your vote is immutable, timestamped, and recorded on the campus chain.
              </p>
            </div>

            {/* Receipt Hash Input */}
            <div className="bg-[#142828] border border-[#234848] p-6">
              <label className="block text-white text-sm font-bold uppercase tracking-wider mb-3">
                RECEIPT HASH (SHA-256)
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <MdVisibility className="w-5 h-5 text-[#568888]" />
                </div>
                <input
                  type="text"
                  value={receiptHash}
                  onChange={(e) => setReceiptHash(e.target.value)}
                  placeholder="0x8f2d...3a9b"
                  className="w-full h-14 pl-12 pr-12 bg-[#102222] text-white border-2 border-[#234848] focus:border-[#13ecec] focus:ring-0 font-mono text-sm transition-all placeholder:text-[#3a5c5c]"
                />
                <div className="absolute inset-y-0 right-0 pr-4 flex items-center gap-2">
                  <button
                    onClick={generateRandomHash}
                    className="text-[#568888] hover:text-[#13ecec] transition-colors"
                    title="Generate random hash"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                  </button>
                  <button
                    onClick={handleCopyHash}
                    className="text-[#568888] hover:text-[#13ecec] transition-colors"
                    title="Copy hash"
                  >
                    <MdContentCopy className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Encryption Status */}
              <div className="flex items-center gap-2 mt-3">
                <MdLock className="w-4 h-4 text-[#13ecec]" />
                <span className="text-[#92c9c9] text-xs">AES-256 Encryption Active</span>
              </div>

              {/* Search Button */}
              <button
                onClick={handleSearch}
                className="w-full mt-6 bg-[#13ecec] hover:bg-[#0fd6d6] text-[#112222] font-bold px-6 py-4 flex items-center justify-center gap-2 transition-all uppercase tracking-wider"
              >
                <MdSearch className="w-5 h-5" />
                <span>SEARCH LEDGER</span>
              </button>
            </div>

            {/* Verification Results */}
            {verificationResult.status && (
              <div className="bg-[#142828] border border-[#234848] p-6 relative overflow-hidden">
                {/* Background checkmark */}
                <div className="absolute right-0 top-0 opacity-10">
                  <MdCheckCircle className="w-32 h-32 text-[#4ade80]" />
                </div>

                <div className="relative z-10 space-y-4">
                  {/* Vote Status */}
                  <div className="flex items-center gap-3">
                    <MdCheckCircle className="w-6 h-6 text-[#4ade80]" />
                    <div>
                      <div className="text-[#568888] text-xs uppercase tracking-wider mb-1">VOTE STATUS</div>
                      <div className="text-[#13ecec] text-xl font-bold">{verificationResult.status}</div>
                    </div>
                  </div>

                  {/* Block Height */}
                  <div className="flex items-center gap-3">
                    <svg className="w-6 h-6 text-[#13ecec]" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z" />
                    </svg>
                    <div>
                      <div className="text-[#568888] text-xs uppercase tracking-wider mb-1">BLOCK HEIGHT</div>
                      <div className="text-white text-xl font-bold">#{verificationResult.blockHeight}</div>
                    </div>
                  </div>

                  {/* Timestamp */}
                  <div className="flex items-center gap-3">
                    <svg className="w-6 h-6 text-[#13ecec]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div>
                      <div className="text-[#568888] text-xs uppercase tracking-wider mb-1">TIMESTAMP (UTC)</div>
                      <div className="text-white text-xl font-bold">{verificationResult.timestamp}</div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Panel - Live Transactions */}
          <div className="lg:col-span-1 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-[#13ecec] rounded-full"></div>
                <h2 className="text-white font-bold text-lg uppercase tracking-wider">LIVE TRANSACTIONS</h2>
              </div>
              <div className="flex items-center gap-2">
                <button className="text-[#568888] hover:text-[#13ecec] transition-colors">
                  <MdFilterList className="w-5 h-5" />
                </button>
                <button className="text-[#568888] hover:text-[#13ecec] transition-colors">
                  <MdRefresh className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Transactions List */}
            <div className="bg-[#142828] border border-[#234848] p-4 space-y-3 max-h-[500px] overflow-y-auto">
              {transactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="bg-[#1a2a2a] border border-[#13ecec]/30 p-3"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      {transaction.icon}
                      <div>
                        <div className="text-white text-xs font-bold uppercase">
                          {transaction.type === "vote" ? "NEW VOTE" : transaction.type === "verification" ? "VERIFICATION" : "SYSTEM"}
                        </div>
                        {transaction.hash && (
                          <div className="text-[#92c9c9] text-xs font-mono mt-1">Hash: {transaction.hash}</div>
                        )}
                        {transaction.type === "verification" && (
                          <div className="text-[#92c9c9] text-xs font-mono mt-1">ID: {transaction.hash}</div>
                        )}
                        {transaction.type === "system" && (
                          <div className="text-[#92c9c9] text-xs mt-1">{transaction.status}</div>
                        )}
                      </div>
                    </div>
                    <div className="text-[#568888] text-xs">{transaction.timestamp}</div>
                  </div>
                  <div className="text-[#13ecec] text-xs">{transaction.status}</div>
                </div>
              ))}
            </div>

            {/* Footer Stats */}
            <div className="bg-[#142828] border border-[#234848] p-6 space-y-4">
              <div>
                <div className="text-[#568888] text-xs uppercase tracking-wider mb-2">TOTAL VOTES</div>
                <div className="text-white text-3xl font-bold">{totalVotes.toLocaleString()}</div>
              </div>
              <div>
                <div className="text-[#568888] text-xs uppercase tracking-wider mb-2">HASH RATE</div>
                <div className="text-white text-3xl font-bold">{hashRate}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

