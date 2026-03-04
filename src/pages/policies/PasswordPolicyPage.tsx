import PolicyDocumentPage from "@/components/policies/PolicyDocumentPage";

const PasswordPolicyPage = () => {
  return (
    <PolicyDocumentPage
      policyTitle="Password Policy"
      version="1.0"
      effectiveDate="2026-03-20"
      lastReviewDate="2026-03-20"
      downloadPath="/policies/password-policy.pdf"
      sections={[
        {
          title: "Purpose",
          paragraphs: [
            "Define secure credential standards for all authentication mechanisms to reduce account compromise and unauthorized access risk.",
          ],
        },
        {
          title: "Password Requirements",
          items: [
            "Minimum length must be at least 12 characters.",
            "Passwords must include a mix of letters, numbers, and special characters.",
            "Default and temporary passwords must be changed on first use.",
            "Password reuse for the last 12 passwords is prohibited.",
            "Password expiration follows system-specific risk and regulatory requirements.",
          ],
        },
        {
          title: "Multi-Factor Authentication Requirements",
          items: [
            "MFA is mandatory for privileged accounts and remote access channels.",
            "MFA enrollment must be completed before production access is granted.",
            "Fallback authentication methods require documented approval and time-bound validity.",
          ],
        },
        {
          title: "Exception Process",
          paragraphs: [
            "Any policy exception must be documented with business justification, compensating controls, explicit risk acceptance, and expiration date.",
          ],
        },
        {
          title: "Compliance Verification",
          paragraphs: [
            "Compliance is validated through periodic password configuration reviews, authentication logs, and internal control testing activities.",
          ],
        },
      ]}
    />
  );
};

export default PasswordPolicyPage;
