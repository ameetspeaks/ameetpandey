import CaseStudyPage from "@/components/projects/CaseStudyPage";

const ProjectVendorSecurityAssessment = () => {
  return (
    <CaseStudyPage
      title="Vendor Security Assessment"
      summary="Third-party security due diligence assessment evaluating vendor control posture, questionnaire responses, and compliance alignment before onboarding."
      frameworks={["Vendor Risk", "Third-Party Assessment", "Due Diligence"]}
      methodology={[
        "Classified vendor criticality based on data access and business dependency.",
        "Issued security questionnaires and reviewed supporting control artifacts.",
        "Validated compliance claims against contractual and policy requirements.",
        "Assigned risk ratings and defined mitigation or acceptance decisions.",
      ]}
      outcomes={[
        "Established risk-based vendor onboarding assessment model.",
        "Improved visibility into third-party control maturity gaps.",
        "Created standardized reporting for procurement and security governance.",
      ]}
    />
  );
};

export default ProjectVendorSecurityAssessment;
