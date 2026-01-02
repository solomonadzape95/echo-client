import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";
import { SplashPage } from "./SplashPage";
import { AuthPage } from "./AuthPage";
import { Dashboard } from "./pages/Dashboard";
import { Elections } from "./pages/Elections";
import { ElectionDetail } from "./pages/ElectionDetail";
import { ElectionResults } from "./pages/ElectionResults";
import { Ballot } from "./pages/Ballot";
import { VoteVerification } from "./pages/VoteVerification";
import { Stats } from "./pages/Stats";
import { Profile } from "./pages/Profile";
import { ForgotPassword } from "./pages/ForgotPassword";
import { ResetPassword } from "./pages/ResetPassword";
import { AdminLogin } from "./pages/AdminLogin";
import { AdminDashboard } from "./pages/AdminDashboard";
import { AdminVoters, AdminVoterDetail } from "./pages/AdminVoters";
import { AdminElections, AdminElectionDetail } from "./pages/AdminElections";
import { AdminStats } from "./pages/AdminStats";
import { AdminManagement } from "./pages/AdminManagement";
import { AdminClasses } from "./pages/AdminClasses";
import { CreateClass } from "./pages/CreateClass";
import { CreateElection } from "./pages/CreateElection";
import { EditElection } from "./pages/EditElection";
import { CreateOffice } from "./pages/CreateOffice";
import { EditOffice } from "./pages/EditOffice";
import { OfficeDetail } from "./pages/OfficeDetail";
import { AddCandidate } from "./pages/AddCandidate";
import { EditCandidate } from "./pages/EditCandidate";
import { queryClient } from "./lib/queryClient";
import { setupTokenRefresh } from "./lib/tokenRefresh";
import "./index.css";

const SPLASH_SCREEN_SEEN_KEY = "echo_splash_seen";

export function App() {
  const [showAuth, setShowAuth] = useState(false);
  const [showSplash, setShowSplash] = useState(false);

  // Check if splash screen has been seen before
  useEffect(() => {
    const hasSeenSplash = localStorage.getItem(SPLASH_SCREEN_SEEN_KEY);
    if (!hasSeenSplash) {
      // First visit - show splash screen
      setShowSplash(true);
    } else {
      // Already seen - skip splash screen
      setShowAuth(true);
    }
  }, []);

  // Set up automatic token refresh
  useEffect(() => {
    const cleanup = setupTokenRefresh();
    return cleanup;
  }, []);

  const handleSplashComplete = () => {
    // Mark splash screen as seen
    localStorage.setItem(SPLASH_SCREEN_SEEN_KEY, "true");
    setShowSplash(false);
    setShowAuth(true);
  };

  if (showSplash) {
    return <SplashPage onComplete={handleSplashComplete} />;
  }

  if (!showAuth) {
    // Still loading - show nothing or a minimal loader
    return null;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<AuthPage />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          
          {/* User routes */}
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/elections" element={<Elections />} />
          <Route path="/elections/:slug" element={<ElectionDetail />} />
          <Route path="/elections/:slug/ballot" element={<Ballot />} />
          <Route path="/elections/:slug/results" element={<ElectionResults />} />
          <Route path="/verify" element={<VoteVerification />} />
          <Route path="/vote-verification" element={<VoteVerification />} />
          <Route path="/stats" element={<Stats />} />
          <Route path="/profile" element={<Profile />} />
          
          {/* Admin routes */}
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/voters" element={<AdminVoters />} />
          <Route path="/admin/voters/:id" element={<AdminVoterDetail />} />
          <Route path="/admin/elections" element={<AdminElections />} />
          <Route path="/admin/elections/create" element={<CreateElection />} />
          {/* More specific routes must come before less specific ones */}
                <Route path="/admin/elections/:slug/offices/:officeSlug/candidates/create" element={<AddCandidate />} />
                <Route path="/admin/elections/:slug/offices/:officeSlug/candidates/:candidateId/edit" element={<EditCandidate />} />
          <Route path="/admin/elections/:slug/offices/:officeSlug/edit" element={<EditOffice />} />
          <Route path="/admin/elections/:slug/offices/:officeSlug" element={<OfficeDetail />} />
          <Route path="/admin/elections/:slug/offices/create" element={<CreateOffice />} />
          <Route path="/admin/elections/:slug/results" element={<ElectionResults />} />
          <Route path="/admin/elections/:slug/edit" element={<EditElection />} />
          <Route path="/admin/elections/:slug" element={<AdminElectionDetail />} />
          <Route path="/admin/stats" element={<AdminStats />} />
          <Route path="/admin/admins" element={<AdminManagement />} />
          <Route path="/admin/classes" element={<AdminClasses />} />
          <Route path="/admin/classes/create" element={<CreateClass />} />
          
          {/* Default redirect */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
