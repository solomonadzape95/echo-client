import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MdCheckCircle, MdLock, MdHistory, MdArrowBack, MdCameraAlt, MdBarChart, MdHowToVote, MdPerson, MdVerified } from "react-icons/md";
import { useProfile } from "../hooks/useProfile";
import { FloatingMenu } from "../components/FloatingMenu";
import { FloatingHelpButton } from "../components/FloatingHelpButton";
import { Footer } from "../components/Footer";
import { authService } from "../lib/auth";
import { useToast } from "../hooks/useToast";
import { dashboardHelpSteps } from "../constants/helpContent";
import { API_BASE_URL } from "../lib/api";

export function Profile() {
  const navigate = useNavigate();
  const { showToast, ToastContainer } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [activeTab, setActiveTab] = useState("security");
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const { data: profileResponse, isLoading, error, refetch } = useProfile();
  
  // Set profile image from API response
  useEffect(() => {
    if (profileResponse?.success && profileResponse.data.profile.profilePicture) {
      setProfileImage(profileResponse.data.profile.profilePicture);
    }
  }, [profileResponse]);
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [isChangingPassword, setIsChangingPassword] = useState(false);

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

  const handlePasswordChange = (field: string, value: string) => {
    setPasswordData((prev) => ({ ...prev, [field]: value }));
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      showToast("New passwords do not match", "error");
      return;
    }

    if (passwordData.newPassword.length < 6) {
      showToast("Password must be at least 6 characters", "error");
      return;
    }

    setIsChangingPassword(true);

    try {
      const response = await authService.changePassword(
        passwordData.currentPassword,
        passwordData.newPassword
      );
      if (response.success) {
        showToast("Password changed successfully", "success");
        setPasswordData({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
      } else {
        showToast(response.message || "Failed to change password", "error");
      }
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Failed to change password", "error");
    } finally {
      setIsChangingPassword(false);
    }
  };

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const [isUploadingImage, setIsUploadingImage] = useState(false);

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      showToast("Please select an image file", "error");
      return;
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      showToast("Image size must be less than 5MB", "error");
      return;
    }

    setIsUploadingImage(true);

    try {
      // Upload image to storage
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', 'profile-images');

      console.log('[PROFILE] Uploading image to:', `${API_BASE_URL}/storage/upload`);
      
      const response = await fetch(`${API_BASE_URL}/storage/upload`, {
        method: 'POST',
        body: formData,
        credentials: 'include',
      });

      console.log('[PROFILE] Upload response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('[PROFILE] Upload error response:', errorText);
        throw new Error(`Upload failed: ${response.status} ${response.statusText}`);
      }

      const result = await response.json();
      console.log('[PROFILE] Upload result:', result);

      if (!result.success || !result.data?.url) {
        throw new Error(result.message || 'Failed to upload image');
      }

      // Update profile picture in database
      console.log('[PROFILE] Updating profile picture with URL:', result.data.url);
      const updateResponse = await authService.updateProfilePicture(result.data.url);
      console.log('[PROFILE] Update response:', updateResponse);
      
      if (updateResponse.success) {
        setProfileImage(result.data.url);
        // Refetch profile data to get updated information
        await refetch();
        showToast("Profile picture updated successfully", "success");
      } else {
        throw new Error(updateResponse.message || 'Failed to update profile picture');
      }
    } catch (err) {
      console.error('[PROFILE] Error uploading image:', err);
      showToast(err instanceof Error ? err.message : "Failed to upload image", "error");
    } finally {
      setIsUploadingImage(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#102222] flex items-center justify-center">
        <div className="text-center">
          <div className="loader mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error || !profileResponse?.success) {
    return (
      <div className="min-h-screen bg-[#102222] flex items-center justify-center p-4">
        <div className="text-center">
          <p className="text-red-400 text-lg mb-4">
            {error instanceof Error ? error.message : "Failed to load profile"}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-[#13ecec] text-[#112222]  font-medium"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const profileData = profileResponse.data;
  const profile = profileData.profile;
  const votingHistory = profileData.votingHistory;

  // Get initials for avatar
  const getInitials = (name: string) => {
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) {
      const first = parts[0];
      const last = parts[parts.length - 1];
      if (first && last && first[0] && last[0]) {
        return (first[0] + last[0]).toUpperCase();
      }
    }
    return name.substring(0, 2).toUpperCase();
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  return (
    <div className="min-h-screen bg-[#102222] p-4 md:p-8 pb-20 relative">
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
                  {profileImage || profile?.profilePicture ? (
                    <img
                      src={profileImage || profile?.profilePicture || ''}
                      alt="Profile"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                      }}
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-[#13ecec]/20 to-[#234848] flex items-center justify-center text-2xl sm:text-3xl md:text-4xl font-bold text-white ">
                      {profile ? getInitials(profile.name) : "U"}
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                    {isUploadingImage ? (
                      <div className="loader" style={{ width: '24px', height: '24px' }}></div>
                    ) : (
                      <MdCameraAlt className="w-6 h-6 sm:w-8 sm:h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                    )}
                  </div>
                </div>
                <div className="absolute -bottom-1 -right-1 w-5 h-5 sm:w-6 sm:h-6 bg-[#13ecec] flex items-center justify-center">
                  <MdCheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-[#112222]" />
                </div>
              </div>

              {/* Profile Info */}
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-3 mb-2">
                  <h2 className="text-xl sm:text-2xl font-bold text-white">{profile.name}</h2>
                  {profile.isVerified && (
                  <span className="bg-[#13ecec] text-[#112222] text-xs font-bold px-3 py-1 uppercase tracking-wider">
                    VERIFIED VOTER
                  </span>
                  )}
                </div>
                <p className="text-[#92c9c9] text-sm mb-3">
                  {profile.class?.department || "N/A"} • {profile.class?.name || "N/A"}
                </p>
                <div className="space-y-1 text-sm text-[#92c9c9]">
                  <div className="flex items-center gap-2">
                    <span className="w-4 h-4 flex items-center justify-center">ID</span>
                    <span>Reg. Number: {profile.regNumber}</span>
                  </div>
                  {profile.class?.faculty && (
                  <div className="flex items-center gap-2">
                    <span className="w-4 h-4 flex items-center justify-center">🏛️</span>
                      <span>Faculty: {profile.class.faculty}</span>
                  </div>
                  )}
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
                      disabled={isChangingPassword}
                      className="bg-[#13ecec] hover:bg-[#0fd6d6] text-[#112222] font-bold px-6 py-3 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isChangingPassword ? "CHANGING..." : "UPDATE PASSWORD"}
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
                {votingHistory.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-[#92c9c9]">No voting history found.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {votingHistory.map((vote) => (
                      <div key={vote.voteId} className="border border-[#234848] p-4">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-2">
                      <div>
                            <h4 className="text-white font-bold text-lg mb-1">{vote.electionName}</h4>
                            <p className="text-[#92c9c9] text-sm">
                              Voted on {formatDate(vote.votedAt)} at {formatTime(vote.votedAt)}
                            </p>
                      </div>
                      <span className="bg-[#13ecec] text-[#112222] text-xs font-bold px-3 py-1 uppercase tracking-wider self-start">
                        COMPLETED
                      </span>
                    </div>
                        <div className="text-[#568888] text-xs mt-2 space-y-1">
                          <div>Vote ID: {vote.voteId.substring(0, 8)}...</div>
                          {vote.receiptCode && (
                            <div>Receipt: {vote.receiptCode}</div>
                          )}
                  </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

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

      {/* Toast Container */}
      <ToastContainer />
    </div>
  );
}
