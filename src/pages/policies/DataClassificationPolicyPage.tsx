import PolicyDocumentPage from "@/components/policies/PolicyDocumentPage";

const DataClassificationPolicyPage = () => {
  return (
    <PolicyDocumentPage
      policyTitle="Data Classification Policy"
      version="1.0"
      effectiveDate="2026-03-20"
      lastReviewDate="2026-03-20"
      downloadPath="/policies/data-classification-policy.pdf"
      sections={[
        {
          title: "Purpose",
          paragraphs: [
            "Define a standardized data classification model so information is handled and protected based on sensitivity and business impact.",
          ],
        },
        {
          title: "Classification Levels",
          items: [
            "Public: Information approved for unrestricted external disclosure.",
            "Internal: Operational information for authorized internal use only.",
            "Confidential: Sensitive data requiring controlled internal distribution.",
            "Restricted: Highest sensitivity data requiring strict access and enhanced protections.",
          ],
        },
        {
          title: "Handling Requirements by Classification",
          items: [
            "Public data may be shared externally with integrity safeguards.",
            "Internal data must remain within approved corporate systems.",
            "Confidential data requires encryption in transit and controlled storage.",
            "Restricted data requires encryption, strict access approvals, and activity monitoring.",
          ],
        },
        {
          title: "Labeling Standards",
          paragraphs: [
            "Documents and records must include clear classification labels in metadata, document headers, or system fields where technically supported.",
          ],
        },
        {
          title: "Access Controls by Classification",
          items: [
            "Public data access is unrestricted unless otherwise defined.",
            "Internal access is granted to authorized workforce roles.",
            "Confidential access requires approved business need and manager authorization.",
            "Restricted access requires explicit owner approval and periodic recertification.",
          ],
        },
      ]}
    />
  );
};

export default DataClassificationPolicyPage;
