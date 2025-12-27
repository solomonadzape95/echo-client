import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { MdCheckCircle, MdLock, MdHistory, MdArrowBack, MdCameraAlt } from "react-icons/md";

export function Profile() {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [activeTab, setActiveTab] = useState("security");
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handlePasswordChange = (field: string, value: string) => {
    setPasswordData((prev) => ({ ...prev, [field]: value }));
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Changing password:", passwordData);
    // Handle password change logic here
  };

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

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
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-[#92c9c9] hover:text-white transition-colors mb-4"
          >
            <MdArrowBack className="w-5 h-5" />
            <span className="text-sm font-medium">Back</span>
          </button>
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">Student Profile</h1>
          <p className="text-[#92c9c9] text-sm sm:text-base">
            Manage your verified identity, account security settings, and notification preferences.
          </p>
        </div>

        <div className="space-y-6">
          {/* Main Content */}
          <div className="space-y-6">
            {/* Profile Summary */}
            <div className="bg-[#142828] border border-[#234848] p-4 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
              {/* Avatar - Clickable */}
              <div className="relative flex-shrink-0 cursor-pointer group" onClick={handleImageClick}>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageChange}
                  accept="image/*"
                  className="hidden"
                />
                <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 bg-[#234848] flex items-center justify-center overflow-hidden relative">
                  {profileImage ? (
                    <img
                      src={profileImage}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-[#13ecec]/20 to-[#234848] flex items-center justify-center text-2xl sm:text-3xl md:text-4xl font-bold text-white">
                      AC
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                    <MdCameraAlt className="w-6 h-6 sm:w-8 sm:h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </div>
                <div className="absolute -bottom-1 -right-1 w-5 h-5 sm:w-6 sm:h-6 bg-[#13ecec] flex items-center justify-center">
                  <MdCheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-[#112222]" />
                </div>
              </div>

              {/* Profile Info */}
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-3 mb-2">
                  <h2 className="text-xl sm:text-2xl font-bold text-white">Alex Chen</h2>
                  <span className="bg-[#13ecec] text-[#112222] text-xs font-bold px-3 py-1 uppercase tracking-wider">
                    VERIFIED VOTER
                  </span>
                </div>
                <p className="text-[#92c9c9] text-sm mb-3">Computer Science • Class of 2025</p>
                <div className="space-y-1 text-sm text-[#92c9c9]">
                  <div className="flex items-center gap-2">
                    <span className="w-4 h-4 flex items-center justify-center">ID</span>
                    <span>Reg. Number: S-2024-XXXX</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-4 h-4 flex items-center justify-center">🏛️</span>
                    <span>Faculty: Engineering & Technology</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Navigation Tabs */}
            <div className="flex gap-4 sm:gap-6 border-b border-[#234848] overflow-x-auto">
              <button
                onClick={() => setActiveTab("security")}
                className={`pb-3 px-2 font-bold text-xs sm:text-sm uppercase tracking-wider transition-colors whitespace-nowrap ${
                  activeTab === "security"
                    ? "text-[#13ecec] border-b-2 border-[#13ecec]"
                    : "text-[#568888] hover:text-white"
                }`}
              >
                SECURITY
              </button>
              <button
                onClick={() => setActiveTab("history")}
                className={`pb-3 px-2 font-bold text-xs sm:text-sm uppercase tracking-wider transition-colors whitespace-nowrap ${
                  activeTab === "history"
                    ? "text-[#13ecec] border-b-2 border-[#13ecec]"
                    : "text-[#568888] hover:text-white"
                }`}
              >
                VOTING HISTORY
              </button>
            </div>

            {/* Tab Content */}
            {activeTab === "security" && (
              <div className="bg-[#142828] border border-[#234848] p-6">
                <h3 className="text-xl font-bold text-white mb-6">Change Password</h3>
                <form onSubmit={handlePasswordSubmit} className="space-y-6 max-w-2xl">
                  <div>
                    <label className="block text-white text-sm font-bold uppercase tracking-wider mb-2">
                      CURRENT PASSWORD <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="password"
                      value={passwordData.currentPassword}
                      onChange={(e) => handlePasswordChange("currentPassword", e.target.value)}
                      placeholder="Enter your current password"
                      className="w-full h-14 px-4 bg-[#102222] text-white border-2 border-[#234848] focus:border-[#13ecec] focus:ring-0 font-medium transition-all placeholder:text-[#3a5c5c]"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-white text-sm font-bold uppercase tracking-wider mb-2">
                      NEW PASSWORD <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="password"
                      value={passwordData.newPassword}
                      onChange={(e) => handlePasswordChange("newPassword", e.target.value)}
                      placeholder="Enter your new password"
                      className="w-full h-14 px-4 bg-[#102222] text-white border-2 border-[#234848] focus:border-[#13ecec] focus:ring-0 font-medium transition-all placeholder:text-[#3a5c5c]"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-white text-sm font-bold uppercase tracking-wider mb-2">
                      CONFIRM NEW PASSWORD <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="password"
                      value={passwordData.confirmPassword}
                      onChange={(e) => handlePasswordChange("confirmPassword", e.target.value)}
                      placeholder="Confirm your new password"
                      className="w-full h-14 px-4 bg-[#102222] text-white border-2 border-[#234848] focus:border-[#13ecec] focus:ring-0 font-medium transition-all placeholder:text-[#3a5c5c]"
                      required
                    />
                  </div>
                  <div className="flex gap-4 pt-4">
                    <button
                      type="submit"
                      className="bg-[#13ecec] hover:bg-[#0fd6d6] text-[#112222] font-bold px-6 py-3 transition-colors"
                    >
                      UPDATE PASSWORD
                    </button>
                    <button
                      type="button"
                      onClick={() => setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" })}
                      className="bg-[#234848] hover:bg-[#2a5555] text-white font-bold px-6 py-3 transition-colors"
                    >
                      CANCEL
                    </button>
                  </div>
                </form>
              </div>
            )}

            {activeTab === "history" && (
              <div className="bg-[#142828] border border-[#234848] p-6">
                <h3 className="text-xl font-bold text-white mb-6">Voting History</h3>
                <div className="space-y-4">
                  {/* Example voting history items */}
                  <div className="border border-[#234848] p-4">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-2">
                      <div>
                        <h4 className="text-white font-bold text-lg mb-1">Student Government Election 2024</h4>
                        <p className="text-[#92c9c9] text-sm">Voted on March 15, 2024 at 2:34 PM</p>
                      </div>
                      <span className="bg-[#13ecec] text-[#112222] text-xs font-bold px-3 py-1 uppercase tracking-wider self-start">
                        COMPLETED
                      </span>
                    </div>
                    <div className="text-[#568888] text-xs mt-2">
                      <div>Vote ID: V-2024-001234</div>
                    </div>
                  </div>

                  <div className="border border-[#234848] p-4">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-2">
                      <div>
                        <h4 className="text-white font-bold text-lg mb-1">Class Representative Election</h4>
                        <p className="text-[#92c9c9] text-sm">Voted on February 28, 2024 at 10:15 AM</p>
                      </div>
                      <span className="bg-[#13ecec] text-[#112222] text-xs font-bold px-3 py-1 uppercase tracking-wider self-start">
                        COMPLETED
                      </span>
                    </div>
                    <div className="text-[#568888] text-xs mt-2">
                      <div>Vote ID: V-2024-000987</div>
                    </div>
                  </div>

                  <div className="border border-[#234848] p-4">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-2">
                      <div>
                        <h4 className="text-white font-bold text-lg mb-1">Campus Budget Proposal</h4>
                        <p className="text-[#92c9c9] text-sm">Voted on January 10, 2024 at 4:22 PM</p>
                      </div>
                      <span className="bg-[#13ecec] text-[#112222] text-xs font-bold px-3 py-1 uppercase tracking-wider self-start">
                        COMPLETED
                      </span>
                    </div>
                    <div className="text-[#568888] text-xs mt-2">
                      <div>Vote ID: V-2024-000456</div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
