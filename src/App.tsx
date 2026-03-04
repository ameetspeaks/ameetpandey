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
import AdminPlaceholder from "./pages/admin/AdminPlaceholder";
import AdminPostsList from "./pages/admin/posts/AdminPostsList";
import AdminPostEditor from "./pages/admin/posts/AdminPostEditor";
import ForgotPassword from "./pages/auth/ForgotPassword";
import Login from "./pages/auth/Login";
import ResetPassword from "./pages/auth/ResetPassword";
import AuditReports from "./pages/grc/AuditReports";
import Compliance from "./pages/grc/Compliance";
import GRCProjects from "./pages/grc/GRCProjects";
import RiskAssessments from "./pages/grc/RiskAssessments";
import VendorAssessments from "./pages/grc/VendorAssessments";
import AccessControlPolicyPage from "./pages/policies/AccessControlPolicyPage";
import DataClassificationPolicyPage from "./pages/policies/DataClassificationPolicyPage";
import IncidentResponsePolicyPage from "./pages/policies/IncidentResponsePolicyPage";
import PasswordPolicyPage from "./pages/policies/PasswordPolicyPage";
import BlogHome from "./pages/blog/BlogHome";
import BlogPost from "./pages/blog/BlogPost";
import ProjectISO27001RiskAssessment from "./pages/projects/ProjectISO27001RiskAssessment";
import ProjectITAuditReport from "./pages/projects/ProjectITAuditReport";
import ProjectVendorSecurityAssessment from "./pages/projects/ProjectVendorSecurityAssessment";

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
              <Route path="projects/iso27001-risk-assessment" element={<ProjectISO27001RiskAssessment />} />
              <Route path="projects/it-audit-report" element={<ProjectITAuditReport />} />
              <Route path="projects/vendor-security-assessment" element={<ProjectVendorSecurityAssessment />} />
              <Route path="frameworks" element={<Frameworks />} />
              <Route path="blog" element={<BlogHome />} />
              <Route path="blog/:slug" element={<BlogPost />} />
              <Route path="policies/access-control" element={<AccessControlPolicyPage />} />
              <Route path="policies/password" element={<PasswordPolicyPage />} />
              <Route path="policies/data-classification" element={<DataClassificationPolicyPage />} />
              <Route path="policies/incident-response" element={<IncidentResponsePolicyPage />} />
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
              <Route path="categories" element={<AdminPlaceholder title="Categories" description="Categories CRUD will be added in Milestone D." />} />
              <Route path="tags" element={<AdminPlaceholder title="Tags" description="Tags CRUD will be added in Milestone D." />} />
              <Route path="media" element={<AdminPlaceholder title="Media Library" description="Media management will be added in Milestone D." />} />
              <Route path="comments" element={<AdminPlaceholder title="Comments" description="Comments moderation will be added in Milestone D." />} />
              <Route path="subscribers" element={<AdminPlaceholder title="Subscribers" description="Subscribers management will be added in Milestone D." />} />
              <Route path="analytics" element={<AdminPlaceholder title="Analytics" description="Analytics dashboards will be added in Milestone D." />} />
              <Route path="settings" element={<AdminPlaceholder title="Settings" description="Blog/site settings will be added in Milestone D." />} />
            </Route>

            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;


