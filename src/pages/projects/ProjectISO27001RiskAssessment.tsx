import CaseStudyPage from "@/components/projects/CaseStudyPage";

const ProjectISO27001RiskAssessment = () => {
  return (
    <CaseStudyPage
      title="ISO 27001 Risk Assessment Case Study"
      summary="Comprehensive risk assessment engagement using ISO 27001-aligned methodology covering asset inventory, threat analysis, and treatment planning."
      frameworks={["ISO 27001", "Risk Assessment", "Control Mapping"]}
      methodology={[
        "Defined assessment scope and critical information assets.",
        "Performed threat and vulnerability analysis with likelihood-impact scoring.",
        "Mapped existing controls to Annex A and identified residual risks.",
        "Prioritized treatment roadmap with owner accountability and review cadence.",
      ]}
      outcomes={[
        "Produced risk register with prioritized remediation actions.",
        "Improved control visibility for governance reporting.",
        "Established repeatable assessment template for future cycles.",
      ]}
    />
  );
};

export default ProjectISO27001RiskAssessment;
