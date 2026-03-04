import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import SiteLayout from "./components/layout/SiteLayout";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Frameworks from "./pages/Frameworks";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Resume from "./pages/Resume";
import AccessControlPolicyPage from "./pages/policies/AccessControlPolicyPage";
import DataClassificationPolicyPage from "./pages/policies/DataClassificationPolicyPage";
import IncidentResponsePolicyPage from "./pages/policies/IncidentResponsePolicyPage";
import PasswordPolicyPage from "./pages/policies/PasswordPolicyPage";
import ProjectISO27001RiskAssessment from "./pages/projects/ProjectISO27001RiskAssessment";
import ProjectITAuditReport from "./pages/projects/ProjectITAuditReport";
import ProjectVendorSecurityAssessment from "./pages/projects/ProjectVendorSecurityAssessment";
import AuditReports from "./pages/grc/AuditReports";
import Compliance from "./pages/grc/Compliance";
import GRCProjects from "./pages/grc/GRCProjects";
import RiskAssessments from "./pages/grc/RiskAssessments";
import VendorAssessments from "./pages/grc/VendorAssessments";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
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
            <Route path="policies/access-control" element={<AccessControlPolicyPage />} />
            <Route path="policies/password" element={<PasswordPolicyPage />} />
            <Route path="policies/data-classification" element={<DataClassificationPolicyPage />} />
            <Route path="policies/incident-response" element={<IncidentResponsePolicyPage />} />
            <Route path="resume" element={<Resume />} />
            <Route path="contact" element={<Contact />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;


