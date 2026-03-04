import PolicyDocumentPage from "@/components/policies/PolicyDocumentPage";

const IncidentResponsePolicyPage = () => {
  return (
    <PolicyDocumentPage
      policyTitle="Incident Response Policy"
      version="1.0"
      effectiveDate="2026-03-20"
      lastReviewDate="2026-03-20"
      downloadPath="/policies/incident-response-policy.pdf"
      sections={[
        {
          title: "Purpose and Scope",
          paragraphs: [
            "Define incident response governance to ensure cybersecurity incidents are identified, contained, investigated, and resolved in a timely and consistent manner.",
          ],
        },
        {
          title: "Incident Definition and Categories",
          items: [
            "Security incidents include unauthorized access, malware, data leakage, service disruption, and policy violations.",
            "Incidents are categorized by severity and business impact to guide escalation urgency.",
            "Potential incidents must be logged and triaged before classification closure.",
          ],
        },
        {
          title: "Response Team Roles",
          items: [
            "Incident Manager coordinates investigation, containment, and communication.",
            "Technical Responders execute analysis, eradication, and recovery tasks.",
            "Business Stakeholders support impact assessment and decision approvals.",
            "Legal/Compliance advisors support regulatory and contractual obligations.",
          ],
        },
        {
          title: "Escalation Procedures",
          items: [
            "High-severity incidents must be escalated immediately to security leadership.",
            "Critical incidents trigger executive and legal notification workflows.",
            "Escalation timelines and approvals must be documented in incident records.",
          ],
        },
        {
          title: "Reporting Requirements",
          paragraphs: [
            "Incident reports must capture timeline, affected assets, indicators, root cause, containment actions, and residual risk status.",
          ],
        },
        {
          title: "Post-Incident Review Process",
          paragraphs: [
            "Post-incident review is mandatory for material incidents to capture lessons learned, corrective actions, and control improvement opportunities.",
          ],
        },
      ]}
    />
  );
};

export default IncidentResponsePolicyPage;
