import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import AdminLayout from "./components/layout/AdminLayout";
import SiteLayout from "./components/layout/SiteLayout";
import { AuthProvider } from "./hooks/use-auth";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Frameworks from "./pages/Frameworks";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Resume from "./pages/Resume";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminPostsList from "./pages/admin/posts/AdminPostsList";
import AdminPostEditor from "./pages/admin/posts/AdminPostEditor";
import AdminAnalytics from "./pages/admin/analytics/AdminAnalytics";
import AdminCategories from "./pages/admin/categories/AdminCategories";
import AdminComments from "./pages/admin/comments/AdminComments";
import AdminMedia from "./pages/admin/media/AdminMedia";
import AdminSettings from "./pages/admin/settings/AdminSettings";
import AdminSubscribers from "./pages/admin/subscribers/AdminSubscribers";
import AdminTags from "./pages/admin/tags/AdminTags";
import ForgotPassword from "./pages/auth/ForgotPassword";
import Login from "./pages/auth/Login";
import ResetPassword from "./pages/auth/ResetPassword";
import AuditReports from "./pages/grc/AuditReports";
import Compliance from "./pages/grc/Compliance";
import GRCProjects from "./pages/grc/GRCProjects";
import RiskAssessments from "./pages/grc/RiskAssessments";
import VendorAssessments from "./pages/grc/VendorAssessments";
import PolicyDetailPage from "./pages/policies/PolicyDetailPage";
import BlogHome from "./pages/blog/BlogHome";
import BlogPost from "./pages/blog/BlogPost";
import ProjectDetail from "./pages/projects/ProjectDetail";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<SiteLayout />}>
              <Route index element={<Index />} />
              <Route path="about" element={<About />} />
              <Route path="grc-projects" element={<GRCProjects />} />
              <Route path="grc-projects/risk-assessments" element={<RiskAssessments />} />
              <Route path="grc-projects/audit-reports" element={<AuditReports />} />
              <Route path="grc-projects/compliance" element={<Compliance />} />
              <Route path="grc-projects/vendor-assessments" element={<VendorAssessments />} />
              <Route path="projects/:slug" element={<ProjectDetail />} />
              <Route path="frameworks" element={<Frameworks />} />
              <Route path="blog" element={<BlogHome />} />
              <Route path="blog/:slug" element={<BlogPost />} />
              <Route path="policies/:slug" element={<PolicyDetailPage />} />
              <Route path="resume" element={<Resume />} />
              <Route path="contact" element={<Contact />} />
            </Route>

            <Route path="/auth/login" element={<Login />} />
            <Route path="/auth/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />

            <Route
              path="/admin"
              element={
                <ProtectedRoute requireAdmin>
                  <AdminLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<AdminDashboard />} />
              <Route path="posts" element={<AdminPostsList />} />
              <Route path="posts/new" element={<AdminPostEditor />} />
              <Route path="posts/edit/:id" element={<AdminPostEditor />} />
              <Route path="categories" element={<AdminCategories />} />
              <Route path="tags" element={<AdminTags />} />
              <Route path="media" element={<AdminMedia />} />
              <Route path="comments" element={<AdminComments />} />
              <Route path="subscribers" element={<AdminSubscribers />} />
              <Route path="analytics" element={<AdminAnalytics />} />
              <Route path="settings" element={<AdminSettings />} />
            </Route>

            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;


