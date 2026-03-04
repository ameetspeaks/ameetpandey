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
import GRCProjects from "./pages/grc/GRCProjects";
import AuditReports from "./pages/grc/AuditReports";
import Compliance from "./pages/grc/Compliance";
import RiskAssessments from "./pages/grc/RiskAssessments";
import Resume from "./pages/Resume";

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
            <Route path="frameworks" element={<Frameworks />} />
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

