import CaseStudyPage from "@/components/projects/CaseStudyPage";

const ProjectITAuditReport = () => {
  return (
    <CaseStudyPage
      title="IT Security Audit Report"
      summary="Security control audit project aligned to ISACA-style assurance practices with testing evidence, findings analysis, and remediation recommendations."
      frameworks={["IT Audit", "ISACA", "Control Testing"]}
      methodology={[
        "Planned audit scope around key control domains and process owners.",
        "Collected evidence from system configurations, logs, and policy records.",
        "Tested control design and operating effectiveness against criteria.",
        "Documented findings with impact ratings and remediation priorities.",
      ]}
      outcomes={[
        "Delivered structured audit report with evidence-backed observations.",
        "Enabled management action tracking for corrective controls.",
        "Strengthened readiness for external audit and compliance reviews.",
      ]}
    />
  );
};

export default ProjectITAuditReport;
