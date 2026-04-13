import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { HelmetProvider } from "react-helmet-async";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import SignUp from "./pages/SignUp";
import Login from "./pages/Login";
import ResetPassword from "./pages/ResetPassword";
import UpdatePassword from "./pages/UpdatePassword";
import Dashboard from "./pages/Dashboard";
import Schools from "./pages/Schools";
import SchoolProfile from "./pages/SchoolProfile";
import CadetPrograms from "./pages/CadetPrograms";
import CadetProgramDetail from "./pages/CadetProgramDetail";
import Compare from "./pages/Compare";
import Admin from "./pages/Admin";
import Jobs from "./pages/Jobs";
import JobDetail from "./pages/JobDetail";
import PostJob from "./pages/PostJob";
import Scholarships from "./pages/Scholarships";
import ScholarshipDetail from "./pages/ScholarshipDetail";
import Financing from "./pages/Financing";
import Community from "./pages/Community";
import CommunityPost from "./pages/CommunityPost";
import { CompareProvider } from "@/contexts/CompareContext";
import { CompareBar } from "@/components/CompareBar";
import { AdminRoute } from "@/components/admin/AdminRoute";

const queryClient = new QueryClient();

const App = () => (
  <HelmetProvider>
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <CompareProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/login" element={<Login />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/update-password" element={<UpdatePassword />} />
            <Route path="/schools" element={<Schools />} />
            <Route path="/schools/:slug" element={<SchoolProfile />} />
            <Route path="/jobs" element={<Jobs />} />
            <Route path="/jobs/post" element={<PostJob />} />
            <Route path="/jobs/:slug" element={<JobDetail />} />
            <Route path="/cadet-programs" element={<CadetPrograms />} />
            <Route path="/cadet-programs/:slug" element={<CadetProgramDetail />} />
            <Route path="/scholarships" element={<Scholarships />} />
            <Route path="/scholarships/:slug" element={<ScholarshipDetail />} />
            <Route path="/financing" element={<Financing />} />
            <Route path="/community" element={<Community />} />
            <Route path="/community/:postId" element={<CommunityPost />} />
            <Route path="/compare" element={<Compare />} />
            <Route
              path="/admin/*"
              element={
                <AdminRoute>
                  <Admin />
                </AdminRoute>
              }
            />
            <Route
              path="/dashboard/*"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
          <CompareBar />
          </CompareProvider>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
  </HelmetProvider>
);

export default App;
