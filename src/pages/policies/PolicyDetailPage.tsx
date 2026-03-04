import { useQuery } from "@tanstack/react-query";
import { Navigate, useParams } from "react-router-dom";
import PolicyDocumentPage from "@/components/policies/PolicyDocumentPage";
import { useSeo } from "@/hooks/use-seo";
import { fetchPolicyBySlug } from "@/lib/cms";

const formatDate = (value?: string | null) => {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return date.toLocaleDateString();
};

const splitList = (content: string) =>
  content
    .split(/\n|;/)
    .map((item) => item.trim())
    .filter(Boolean);

const PolicyDetailPage = () => {
  const { slug = "" } = useParams();

  const { data, isLoading, error } = useQuery({
    queryKey: ["cms-policy", slug],
    queryFn: () => fetchPolicyBySlug(slug),
    enabled: Boolean(slug),
  });

  const policy = data?.policy;

  useSeo({
    title: policy?.policy_name || "Security Policy",
    description: policy?.purpose || "Security policy document",
    canonicalPath: `/policies/${slug}`,
    jsonLd: policy
      ? {
          "@context": "https://schema.org",
          "@type": "CreativeWork",
          name: policy.policy_name,
          description: policy.purpose,
          version: policy.version,
        }
      : undefined,
  });

  if (isLoading) {
    return (
      <section className="page-shell">
        <div className="site-container">
          <div className="surface-card p-8 text-sm text-muted-foreground">Loading policy...</div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="page-shell">
        <div className="site-container">
          <div className="surface-card p-8 text-sm text-muted-foreground">Could not load this policy.</div>
        </div>
      </section>
    );
  }

  if (!policy) return <Navigate to="/404" replace />;

  const sections = (data?.sections ?? []).map((section: any) => {
    const contentType = section.content_type;
    const content = String(section.content ?? "");

    if (contentType === "bullet_list" || contentType === "numbered_list" || contentType === "requirement") {
      return {
        title: section.section_title,
        sectionNumber: section.section_number,
        items: splitList(content),
      };
    }

    return {
      title: section.section_title,
      sectionNumber: section.section_number,
      paragraphs: [content],
    };
  });

  return (
    <PolicyDocumentPage
      policyTitle={policy.policy_name}
      version={policy.version}
      effectiveDate={formatDate(policy.effective_date)}
      lastReviewDate={formatDate(policy.review_date)}
      sections={sections}
      downloadPath={null}
    />
  );
};

export default PolicyDetailPage;
