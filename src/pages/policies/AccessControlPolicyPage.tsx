import PolicyDocumentPage from "@/components/policies/PolicyDocumentPage";

const AccessControlPolicyPage = () => {
  return (
    <PolicyDocumentPage
      policyTitle="Access Control Policy"
      version="1.0"
      effectiveDate="2026-03-20"
      lastReviewDate="2026-03-20"
      downloadPath="/policies/access-control-policy.pdf"
      sections={[
        {
          title: "Purpose",
          paragraphs: [
            "Establish consistent access governance requirements to ensure systems and data are accessed only by authorized individuals with approved business need.",
          ],
        },
        {
          title: "Scope",
          paragraphs: [
            "Applies to all workforce members, contractors, third-party users, and systems that create, process, transmit, or store organizational information assets.",
          ],
        },
        {
          title: "Policy Statements",
          items: [
            "Access must be granted using least-privilege and role-based principles.",
            "All access requests require documented owner approval before provisioning.",
            "Privileged accounts must be separately assigned, monitored, and periodically reviewed.",
            "Access must be revoked within defined SLA upon role change or termination.",
            "Quarterly access recertification is mandatory for critical systems.",
          ],
        },
        {
          title: "Roles and Responsibilities",
          items: [
            "System Owners approve access aligned to business role requirements.",
            "IT Security defines access standards and monitors privileged activities.",
            "Managers validate user entitlement changes and periodic recertification.",
            "Users must protect credentials and report unauthorized access immediately.",
          ],
        },
        {
          title: "Enforcement and Compliance",
          paragraphs: [
            "Violations may result in access suspension, disciplinary action, or contractual remediation requirements based on severity and business impact.",
          ],
        },
        {
          title: "Review Schedule",
          paragraphs: [
            "This policy is reviewed at least annually, or earlier upon material technology, regulatory, or organizational changes.",
          ],
        },
      ]}
    />
  );
};

export default AccessControlPolicyPage;
