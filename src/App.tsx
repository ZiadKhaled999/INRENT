
import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import RoleSelection from "./pages/RoleSelection";
import CreateHousehold from "./pages/CreateHousehold";
import HouseholdDetail from "./pages/HouseholdDetail";
import JoinHousehold from "./pages/JoinHousehold";
import Documentation from "./pages/Documentation";

import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";
import Landing from "./pages/Landing";
import Download from "./pages/Download";
import Security from "./pages/Security";
import Support from "./pages/Support";
import FAQ from "./pages/FAQ";
import NotFound from "./pages/NotFound";
import PaymentsDashboard from "./pages/PaymentsDashboard";
import ProtectedRoute from "./components/ProtectedRoute";

const queryClient = new QueryClient();

const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <LanguageProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/landing" element={<Landing />} />
                <Route path="/download" element={<Download />} />
                <Route path="/documentation" element={<Documentation />} />
                
                <Route path="/privacy" element={<PrivacyPolicy />} />
                <Route path="/terms" element={<TermsOfService />} />
                <Route path="/security" element={<Security />} />
                <Route path="/support" element={<Support />} />
                <Route path="/faq" element={<FAQ />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/join" element={<JoinHousehold />} />
                <Route path="/join/:id" element={<JoinHousehold />} />
                <Route path="/role-selection" element={
                  <ProtectedRoute>
                    <RoleSelection />
                  </ProtectedRoute>
                } />
                <Route path="/dashboard" element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                } />
                <Route path="/create-household" element={
                  <ProtectedRoute>
                    <CreateHousehold />
                  </ProtectedRoute>
                } />
                <Route path="/household/:id" element={
                  <ProtectedRoute>
                    <HouseholdDetail />
                  </ProtectedRoute>
                } />
                <Route path="/payments" element={
                  <ProtectedRoute>
                    <PaymentsDashboard />
                  </ProtectedRoute>
                } />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </LanguageProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;
