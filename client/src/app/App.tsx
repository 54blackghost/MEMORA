import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AppProvider, useApp } from "@/context/AppContext";
import Onboarding from "../pages/Onboarding";
import Profile from "../pages/Profile";
import Dashboard from "../pages/Dashboard";
import ChallengesList from "../pages/ChallengesList";
import ChallengeDetail from "../pages/ChallengeDetail";
import Feed from "../pages/Feed";
import Album from "../pages/Album";
import Subscription from "../pages/Subscription";
import NotFound from "../pages/NotFound";

const queryClient = new QueryClient();

const AppRoutes = () => {
  const { onboardingDone, profile } = useApp();

  return (
    <Routes>
      <Route
        path="/"
        element={
          !onboardingDone ? (
            <Navigate to="/onboarding" replace />
          ) : !profile ? (
            <Navigate to="/profile" replace />
          ) : (
            <Navigate to="/dashboard" replace />
          )
        }
      />
      <Route path="/onboarding" element={<Onboarding />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/challenges" element={<ChallengesList />} />
      <Route path="/challenge/:id" element={<ChallengeDetail />} />
      <Route path="/feed" element={<Feed />} />
      <Route path="/album" element={<Album />} />
      <Route path="/subscription" element={<Subscription />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AppProvider>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </AppProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
