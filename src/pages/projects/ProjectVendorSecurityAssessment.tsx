import CaseStudyPage from "@/components/projects/CaseStudyPage";

const ProjectVendorSecurityAssessment = () => {
  return (
    <CaseStudyPage
      title="Vendor Security Assessment"
      publishedDate="15 March 2026"
      readingTime="10 min read"
      frameworks={["Vendor Risk", "Third-Party Assessment", "Due Diligence"]}
      objective="Evaluate third-party security posture and compliance readiness to reduce supply-chain exposure and support risk-informed onboarding decisions."
      scope="Assessment covered SaaS and service vendors with access to sensitive data, focusing on controls, evidence, contractual clauses, and risk treatment."
      assessmentTimeline="4 weeks (vendor intake, evidence review, scoring, recommendation)"
      keyDeliverables={[
        "Vendor risk assessment report",
        "Due diligence evidence checklist",
        "Risk scoring model outputs",
        "Vendor treatment and monitoring plan",
      ]}
      methodology={[
        "Vendor Tiering",
        "Questionnaire & Evidence Review",
        "Control Validation",
        "Risk Scoring",
        "Remediation Recommendation",
        "Assessment Documentation",
      ]}
      assetInventory={[
        { asset: "Cloud Payroll Vendor", owner: "HR Systems", criticality: "High", dataClassification: "Restricted" },
        { asset: "Customer Support SaaS", owner: "Support Ops", criticality: "High", dataClassification: "Confidential" },
        { asset: "Marketing Automation Platform", owner: "Marketing", criticality: "Medium", dataClassification: "Internal" },
        { asset: "Managed SOC Partner", owner: "Security", criticality: "High", dataClassification: "Restricted" },
        { asset: "Procurement Portal", owner: "Finance", criticality: "Medium", dataClassification: "Internal" },
        { asset: "File Transfer Vendor", owner: "IT Operations", criticality: "High", dataClassification: "Confidential" },
      ]}
      riskAnalysis={[
        {
          asset: "Cloud Payroll Vendor",
          threat: "Sensitive Data Exposure",
          vulnerability: "Limited encryption evidence",
          likelihood: "High",
          impact: "High",
          riskScore: 25,
        },
        {
          asset: "Customer Support SaaS",
          threat: "Unauthorized Data Access",
          vulnerability: "Insufficient role segmentation",
          likelihood: "High",
          impact: "High",
          riskScore: 22,
        },
        {
          asset: "Managed SOC Partner",
          threat: "Service Misconfiguration",
          vulnerability: "Incomplete change governance evidence",
          likelihood: "Medium",
          impact: "High",
          riskScore: 18,
        },
        {
          asset: "File Transfer Vendor",
          threat: "Data Interception",
          vulnerability: "Legacy transfer protocol fallback",
          likelihood: "Medium",
          impact: "High",
          riskScore: 16,
        },
        {
          asset: "Marketing Automation Platform",
          threat: "API Abuse",
          vulnerability: "Excessive API key lifetime",
          likelihood: "Medium",
          impact: "Medium",
          riskScore: 12,
        },
        {
          asset: "Procurement Portal",
          threat: "Supply Chain Disruption",
          vulnerability: "No tested BC/DR evidence",
          likelihood: "Low",
          impact: "Medium",
          riskScore: 8,
        },
      ]}
      riskRegister={[
        {
          riskId: "V-01",
          description: "Payroll vendor encryption assurance is insufficiently evidenced.",
          likelihood: "High",
          impact: "High",
          score: 25,
          priority: "High",
        },
        {
          riskId: "V-02",
          description: "Support platform role design may allow over-privileged access.",
          likelihood: "High",
          impact: "High",
          score: 22,
          priority: "High",
        },
        {
          riskId: "V-03",
          description: "Managed SOC partner change controls are partially documented.",
          likelihood: "Medium",
          impact: "High",
          score: 18,
          priority: "High",
        },
        {
          riskId: "V-04",
          description: "Legacy file transfer options increase interception exposure.",
          likelihood: "Medium",
          impact: "High",
          score: 16,
          priority: "Medium",
        },
        {
          riskId: "V-05",
          description: "Long-lived API credentials increase abuse window.",
          likelihood: "Medium",
          impact: "Medium",
          score: 12,
          priority: "Medium",
        },
        {
          riskId: "V-06",
          description: "BC/DR assurance evidence is not periodically validated.",
          likelihood: "Low",
          impact: "Medium",
          score: 8,
          priority: "Low",
        },
      ]}
      controlRecommendations={[
        {
          riskArea: "Data Protection",
          recommendedControl: "Require updated encryption attestations and key management documentation.",
          isoControlReference: { label: "Annex A 8.24", url: "https://advisera.com/27001academy/knowledgebase/annex-a-controls-list/" },
          implementationPriority: "High (0-30 days)",
        },
        {
          riskArea: "Access Control",
          recommendedControl: "Mandate role-based access matrices and quarterly access attestations.",
          isoControlReference: { label: "Annex A 5.15", url: "https://advisera.com/27001academy/knowledgebase/annex-a-controls-list/" },
          implementationPriority: "High (0-30 days)",
        },
        {
          riskArea: "Secure Transfer",
          recommendedControl: "Enforce modern secure transfer protocols and disable legacy fallback channels.",
          isoControlReference: { label: "Annex A 8.20", url: "https://advisera.com/27001academy/knowledgebase/annex-a-controls-list/" },
          implementationPriority: "Medium (30-90 days)",
        },
        {
          riskArea: "Resilience Assurance",
          recommendedControl: "Include annual BC/DR evidence validation in vendor review cycle.",
          isoControlReference: { label: "Annex A 5.30", url: "https://advisera.com/27001academy/knowledgebase/annex-a-controls-list/" },
          implementationPriority: "Low (ongoing)",
        },
      ]}
      keyFindings={[
        "High-risk third-party exposures were concentrated in data protection and access governance.",
        "Evidence maturity varied significantly between strategic and operational vendors.",
        "Critical control attestations were missing for select high-impact suppliers.",
        "Contractual compliance clauses did not consistently map to assurance requirements.",
      ]}
      recommendations={{
        high: [
          "Block onboarding for vendors lacking current encryption and access control evidence.",
          "Enforce mandatory corrective action plans for high-risk vendors.",
        ],
        medium: [
          "Integrate vendor risk scoring into procurement approval workflow.",
          "Require annual control self-assessment refresh with evidence submission.",
        ],
        low: ["Standardize assurance clause library for future third-party contracts."],
      }}
      conclusion={{
        summary:
          "The assessment improved visibility into supply-chain security risk and established a repeatable due diligence model.",
        nextSteps:
          "Track vendor remediation milestones and re-assess high-risk vendors at 90-day intervals.",
        lessonsLearned:
          "Tier-based review depth ensures resources are focused where third-party impact is highest.",
      }}
      previousCaseStudy={{ title: "IT Security Audit Report", to: "/projects/it-audit-report" }}
      nextCaseStudy={{ title: "ISO 27001 Risk Assessment Case Study", to: "/projects/iso27001-risk-assessment" }}
    />
  );
};

export default ProjectVendorSecurityAssessment;

