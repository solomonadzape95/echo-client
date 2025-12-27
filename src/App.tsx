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
import { AdminLogin } from "./pages/AdminLogin";
import { AdminDashboard } from "./pages/AdminDashboard";
import { CreateClass } from "./pages/CreateClass";
import { CreateElection } from "./pages/CreateElection";
import { queryClient } from "./lib/queryClient";
import { setupTokenRefresh } from "./lib/tokenRefresh";
import "./index.css";

export function App() {
  const [showAuth, setShowAuth] = useState(false);

  // Set up automatic token refresh
  useEffect(() => {
    const cleanup = setupTokenRefresh();
    return cleanup;
  }, []);

  if (!showAuth) {
    return <SplashPage onComplete={() => setShowAuth(true)} />;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<AuthPage />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          
          {/* User routes */}
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/elections" element={<Elections />} />
          <Route path="/elections/:id" element={<ElectionDetail />} />
          <Route path="/elections/:id/ballot" element={<Ballot />} />
          <Route path="/elections/:id/results" element={<ElectionResults />} />
          <Route path="/verify" element={<VoteVerification />} />
          <Route path="/stats" element={<Stats />} />
          <Route path="/profile" element={<Profile />} />
          
          {/* Admin routes */}
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/classes/create" element={<CreateClass />} />
          <Route path="/admin/elections/create" element={<CreateElection />} />
          
          {/* Default redirect */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
