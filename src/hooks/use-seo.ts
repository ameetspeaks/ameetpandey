import { useEffect } from "react";

type SeoArgs = {
  title: string;
  description: string;
  canonicalPath?: string;
  ogImage?: string;
  jsonLd?: Record<string, unknown>;
};

const setMeta = (selector: string, attr: "name" | "property", value: string) => {
  let tag = document.head.querySelector<HTMLMetaElement>(selector);
  if (!tag) {
    tag = document.createElement("meta");
    tag.setAttribute(attr, selector.includes("property=") ? selector.split('"')[1] : selector.replace('meta[name="', '').replace('"]', ''));
    document.head.appendChild(tag);
  }
  tag.setAttribute("content", value);
};

export const useSeo = ({ title, description, canonicalPath, ogImage, jsonLd }: SeoArgs) => {
  useEffect(() => {
    document.title = title;

    setMeta('meta[name="description"]', "name", description);
    setMeta('meta[property="og:title"]', "property", title);
    setMeta('meta[property="og:description"]', "property", description);
    setMeta('meta[property="og:type"]', "property", "article");
    setMeta('meta[name="twitter:card"]', "name", ogImage ? "summary_large_image" : "summary");
    setMeta('meta[name="twitter:title"]', "name", title);
    setMeta('meta[name="twitter:description"]', "name", description);

    if (ogImage) {
      setMeta('meta[property="og:image"]', "property", ogImage);
      setMeta('meta[name="twitter:image"]', "name", ogImage);
    }

    if (canonicalPath) {
      const href = `${window.location.origin}${canonicalPath}`;
      let canonical = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
      if (!canonical) {
        canonical = document.createElement("link");
        canonical.setAttribute("rel", "canonical");
        document.head.appendChild(canonical);
      }
      canonical.setAttribute("href", href);
    }

    if (jsonLd) {
      const id = "seo-jsonld";
      const old = document.getElementById(id);
      if (old) old.remove();

      const script = document.createElement("script");
      script.type = "application/ld+json";
      script.id = id;
      script.text = JSON.stringify(jsonLd);
      document.head.appendChild(script);
    }
  }, [title, description, canonicalPath, ogImage, jsonLd]);
};
