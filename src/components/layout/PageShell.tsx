type PageShellProps = {
  title: string;
  description: string;
  children?: React.ReactNode;
};

const PageShell = ({ title, description, children }: PageShellProps) => {
  return (
    <section className="page-shell">
      <div className="site-container">
        <div className="surface-card p-6 sm:p-8">
          <h1 className="text-3xl sm:text-4xl">{title}</h1>
          <p className="mt-3 max-w-3xl text-base text-muted-foreground">{description}</p>
          {children ? <div className="mt-6">{children}</div> : null}
        </div>
      </div>
    </section>
  );
};

export default PageShell;
