import { useParams } from "react-router-dom";

const BlogPost = () => {
  const { slug } = useParams();

  return (
    <section className="page-shell">
      <div className="site-container space-y-4">
        <h1 className="text-3xl">Article Preview</h1>
        <p className="text-muted-foreground">Slug: {slug}</p>
      </div>
    </section>
  );
};

export default BlogPost;
