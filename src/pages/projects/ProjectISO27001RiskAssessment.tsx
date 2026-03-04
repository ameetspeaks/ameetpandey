import CaseStudyPage from "@/components/projects/CaseStudyPage";

const ProjectISO27001RiskAssessment = () => {
  return (
    <CaseStudyPage
      title="ISO 27001 Risk Assessment Case Study"
      publishedDate="04 March 2026"
      readingTime="12 min read"
      frameworks={["ISO 27001", "Risk Assessment", "Control Mapping"]}
      objective="Evaluate information security risks across critical business assets and provide prioritized control recommendations aligned with ISO/IEC 27001 expectations."
      scope="Assessment covered identity systems, endpoint fleet, cloud workloads, backup processes, and third-party integrations supporting core operations."
      assessmentTimeline="6 weeks (planning, interviews, control review, analysis, and reporting)"
      keyDeliverables={[
        "Asset inventory register",
        "Risk analysis matrix",
        "Prioritized risk register",
        "Control recommendation mapping to Annex A",
      ]}
      methodology={[
        "Asset Identification",
        "Threat Analysis",
        "Vulnerability Assessment",
        "Risk Scoring",
        "Control Recommendation",
        "Documentation",
      ]}
      assetInventory={[
        { asset: "Identity Provider", owner: "IT Security", criticality: "High", dataClassification: "Confidential" },
        { asset: "Customer CRM", owner: "Business Ops", criticality: "High", dataClassification: "Restricted" },
        { asset: "Email Platform", owner: "IT Infrastructure", criticality: "Medium", dataClassification: "Internal" },
        { asset: "Endpoint Fleet", owner: "IT Support", criticality: "High", dataClassification: "Internal" },
        { asset: "Cloud Storage", owner: "Engineering", criticality: "High", dataClassification: "Restricted" },
        { asset: "Backup Repository", owner: "Platform Team", criticality: "Medium", dataClassification: "Confidential" },
      ]}
      riskAnalysis={[
        {
          asset: "Identity Provider",
          threat: "Credential Theft",
          vulnerability: "MFA not enforced for contractors",
          likelihood: "High",
          impact: "High",
          riskScore: 25,
        },
        {
          asset: "Customer CRM",
          threat: "Data Exfiltration",
          vulnerability: "Excessive role permissions",
          likelihood: "High",
          impact: "High",
          riskScore: 24,
        },
        {
          asset: "Endpoint Fleet",
          threat: "Ransomware",
          vulnerability: "Patch lag over 45 days",
          likelihood: "Medium",
          impact: "High",
          riskScore: 18,
        },
        {
          asset: "Cloud Storage",
          threat: "Public Exposure",
          vulnerability: "Misconfigured access policies",
          likelihood: "Medium",
          impact: "High",
          riskScore: 16,
        },
        {
          asset: "Backup Repository",
          threat: "Backup Tampering",
          vulnerability: "No immutable backup copy",
          likelihood: "Medium",
          impact: "Medium",
          riskScore: 12,
        },
        {
          asset: "Email Platform",
          threat: "Business Email Compromise",
          vulnerability: "Inconsistent anti-phishing training",
          likelihood: "Low",
          impact: "Medium",
          riskScore: 8,
        },
        {
          asset: "Cloud Storage",
          threat: "Unauthorized API Access",
          vulnerability: "Long-lived access tokens",
          likelihood: "Medium",
          impact: "Medium",
          riskScore: 10,
        },
      ]}
      riskRegister={[
        {
          riskId: "R-01",
          description: "Weak MFA coverage creates elevated account takeover risk.",
          likelihood: "High",
          impact: "High",
          score: 25,
          priority: "High",
        },
        {
          riskId: "R-02",
          description: "CRM privilege sprawl could expose customer records.",
          likelihood: "High",
          impact: "High",
          score: 24,
          priority: "High",
        },
        {
          riskId: "R-03",
          description: "Patch delays increase exploitability across endpoints.",
          likelihood: "Medium",
          impact: "High",
          score: 18,
          priority: "High",
        },
        {
          riskId: "R-04",
          description: "Cloud policy gaps may enable unauthorized data access.",
          likelihood: "Medium",
          impact: "High",
          score: 16,
          priority: "Medium",
        },
        {
          riskId: "R-05",
          description: "Lack of immutable backups increases recovery uncertainty.",
          likelihood: "Medium",
          impact: "Medium",
          score: 12,
          priority: "Medium",
        },
        {
          riskId: "R-06",
          description: "Inconsistent phishing awareness exposes user population.",
          likelihood: "Low",
          impact: "Medium",
          score: 8,
          priority: "Low",
        },
      ]}
      controlRecommendations={[
        {
          riskArea: "Identity & Access",
          recommendedControl: "Mandatory phishing-resistant MFA and quarterly access recertification.",
          isoControlReference: { label: "Annex A 5.17 / 8.5", url: "https://advisera.com/27001academy/knowledgebase/annex-a-controls-list/" },
          implementationPriority: "High (0-30 days)",
        },
        {
          riskArea: "Endpoint Security",
          recommendedControl: "Enforce 14-day critical patch SLA with compliance dashboard reporting.",
          isoControlReference: { label: "Annex A 8.8", url: "https://advisera.com/27001academy/knowledgebase/annex-a-controls-list/" },
          implementationPriority: "High (0-30 days)",
        },
        {
          riskArea: "Cloud Configuration",
          recommendedControl: "Deploy baseline policy guardrails and continuous misconfiguration scanning.",
          isoControlReference: { label: "Annex A 8.9", url: "https://advisera.com/27001academy/knowledgebase/annex-a-controls-list/" },
          implementationPriority: "Medium (30-90 days)",
        },
        {
          riskArea: "Resilience",
          recommendedControl: "Implement immutable backups with monthly restore testing evidence.",
          isoControlReference: { label: "Annex A 8.13", url: "https://advisera.com/27001academy/knowledgebase/annex-a-controls-list/" },
          implementationPriority: "Medium (30-90 days)",
        },
      ]}
      keyFindings={[
        "High-risk identity and privilege management gaps were identified in core systems.",
        "Control ownership existed but monitoring cadence was inconsistent across teams.",
        "Critical patching and backup resilience controls required formalized governance oversight.",
        "Compliance evidence quality varied, reducing audit readiness confidence.",
      ]}
      recommendations={{
        high: [
          "Enforce strong MFA across all workforce and contractor accounts.",
          "Remediate excessive CRM privileges using least-privilege principles.",
        ],
        medium: [
          "Establish cloud configuration baseline and drift detection process.",
          "Introduce immutable backup controls and restoration drills.",
        ],
        low: ["Expand security awareness metrics and refresher campaign frequency."],
      }}
      conclusion={{
        summary:
          "The assessment established a clear risk profile and prioritized treatment plan for high-value assets.",
        nextSteps:
          "Track remediation in monthly risk committee reviews and re-score residual risk after control deployment.",
        lessonsLearned:
          "Early control-owner alignment significantly improves evidence quality and remediation speed.",
      }}
      previousCaseStudy={{ title: "Vendor Security Assessment", to: "/projects/vendor-security-assessment" }}
      nextCaseStudy={{ title: "IT Security Audit Report", to: "/projects/it-audit-report" }}
    />
  );
};

export default ProjectISO27001RiskAssessment;

