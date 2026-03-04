import CaseStudyPage from "@/components/projects/CaseStudyPage";

const ProjectITAuditReport = () => {
  return (
    <CaseStudyPage
      title="IT Security Audit Report"
      publishedDate="10 March 2026"
      readingTime="11 min read"
      frameworks={["IT Audit", "ISACA", "Control Testing"]}
      objective="Assess control design and operating effectiveness across key IT security processes to strengthen assurance readiness and remediation governance."
      scope="Review included access management, vulnerability management, logging and monitoring, incident response, and change management controls."
      assessmentTimeline="5 weeks (planning, walkthroughs, testing, reporting)"
      keyDeliverables={[
        "Audit planning memo",
        "Control testing worksheet",
        "Evidence index and traceability map",
        "Final audit report with recommendations",
      ]}
      methodology={[
        "Audit Planning",
        "Control Walkthrough",
        "Evidence Collection",
        "Control Testing",
        "Finding Validation",
        "Reporting & Documentation",
      ]}
      assetInventory={[
        { asset: "Access Management Process", owner: "IAM Team", criticality: "High", dataClassification: "Confidential" },
        { asset: "SIEM Platform", owner: "SOC Team", criticality: "High", dataClassification: "Restricted" },
        { asset: "Patch Management Workflow", owner: "Infrastructure", criticality: "Medium", dataClassification: "Internal" },
        { asset: "Incident Response Playbooks", owner: "SecOps", criticality: "Medium", dataClassification: "Internal" },
        { asset: "Change Management Tool", owner: "IT Operations", criticality: "High", dataClassification: "Confidential" },
        { asset: "Audit Evidence Repository", owner: "GRC Team", criticality: "Medium", dataClassification: "Confidential" },
      ]}
      riskAnalysis={[
        {
          asset: "Access Management Process",
          threat: "Unauthorized Access",
          vulnerability: "Delayed offboarding approvals",
          likelihood: "High",
          impact: "High",
          riskScore: 25,
        },
        {
          asset: "SIEM Platform",
          threat: "Missed Incident Detection",
          vulnerability: "Log source onboarding gaps",
          likelihood: "Medium",
          impact: "High",
          riskScore: 18,
        },
        {
          asset: "Patch Management Workflow",
          threat: "Exploit Execution",
          vulnerability: "No exception governance",
          likelihood: "Medium",
          impact: "Medium",
          riskScore: 12,
        },
        {
          asset: "Incident Response Playbooks",
          threat: "Slow Breach Containment",
          vulnerability: "Outdated escalation matrix",
          likelihood: "Medium",
          impact: "High",
          riskScore: 16,
        },
        {
          asset: "Change Management Tool",
          threat: "Unapproved Changes",
          vulnerability: "Emergency change override misuse",
          likelihood: "Medium",
          impact: "Medium",
          riskScore: 10,
        },
        {
          asset: "Audit Evidence Repository",
          threat: "Evidence Tampering",
          vulnerability: "Lack of immutable logs",
          likelihood: "Low",
          impact: "Medium",
          riskScore: 8,
        },
      ]}
      riskRegister={[
        {
          riskId: "A-01",
          description: "Access revocation delays create unauthorized account exposure.",
          likelihood: "High",
          impact: "High",
          score: 25,
          priority: "High",
        },
        {
          riskId: "A-02",
          description: "SIEM coverage gaps weaken detection and response capability.",
          likelihood: "Medium",
          impact: "High",
          score: 18,
          priority: "High",
        },
        {
          riskId: "A-03",
          description: "IR contact matrix gaps may delay critical incident escalation.",
          likelihood: "Medium",
          impact: "High",
          score: 16,
          priority: "Medium",
        },
        {
          riskId: "A-04",
          description: "Patch exception process lacks formal risk acceptance controls.",
          likelihood: "Medium",
          impact: "Medium",
          score: 12,
          priority: "Medium",
        },
        {
          riskId: "A-05",
          description: "Emergency change controls insufficiently monitored.",
          likelihood: "Medium",
          impact: "Medium",
          score: 10,
          priority: "Low",
        },
        {
          riskId: "A-06",
          description: "Evidence repository integrity controls are limited.",
          likelihood: "Low",
          impact: "Medium",
          score: 8,
          priority: "Low",
        },
      ]}
      controlRecommendations={[
        {
          riskArea: "Access Governance",
          recommendedControl: "Automate de-provisioning SLA checks with weekly exception reporting.",
          isoControlReference: { label: "Annex A 5.18", url: "https://advisera.com/27001academy/knowledgebase/annex-a-controls-list/" },
          implementationPriority: "High (0-30 days)",
        },
        {
          riskArea: "Monitoring",
          recommendedControl: "Define minimum log source baseline and quarterly SIEM completeness review.",
          isoControlReference: { label: "Annex A 8.15", url: "https://advisera.com/27001academy/knowledgebase/annex-a-controls-list/" },
          implementationPriority: "High (0-30 days)",
        },
        {
          riskArea: "Incident Response",
          recommendedControl: "Refresh response playbooks and test escalation matrix via tabletop exercises.",
          isoControlReference: { label: "Annex A 5.24", url: "https://advisera.com/27001academy/knowledgebase/annex-a-controls-list/" },
          implementationPriority: "Medium (30-90 days)",
        },
        {
          riskArea: "Audit Evidence",
          recommendedControl: "Apply write-once audit trails for evidence repository operations.",
          isoControlReference: { label: "Annex A 8.16", url: "https://advisera.com/27001academy/knowledgebase/annex-a-controls-list/" },
          implementationPriority: "Medium (30-90 days)",
        },
      ]}
      keyFindings={[
        "High-risk access governance weaknesses were identified in user lifecycle controls.",
        "Control testing showed monitoring coverage variance across critical systems.",
        "Incident response documentation existed but lacked periodic validation discipline.",
        "Evidence handling controls needed stronger integrity and traceability measures.",
      ]}
      recommendations={{
        high: [
          "Implement automated access revocation and escalation workflow.",
          "Close SIEM onboarding gaps for high-value systems.",
        ],
        medium: [
          "Run quarterly control effectiveness tests for patch and change controls.",
          "Institutionalize IR tabletop testing and post-exercise tracking.",
        ],
        low: ["Enhance evidence repository logging with immutable retention controls."],
      }}
      conclusion={{
        summary:
          "The audit confirmed material control strengths while highlighting key governance and operating-effectiveness gaps.",
        nextSteps:
          "Assign remediation owners, track closure milestones, and validate controls in the next quarterly audit cycle.",
        lessonsLearned:
          "Consistent evidence standards dramatically improve audit efficiency and decision quality.",
      }}
      previousCaseStudy={{ title: "ISO 27001 Risk Assessment Case Study", to: "/projects/iso27001-risk-assessment" }}
      nextCaseStudy={{ title: "Vendor Security Assessment", to: "/projects/vendor-security-assessment" }}
    />
  );
};

export default ProjectITAuditReport;

