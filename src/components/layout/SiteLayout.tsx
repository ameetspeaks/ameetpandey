import { Outlet } from "react-router-dom";
import SiteFooter from "./SiteFooter";
import SiteHeader from "./SiteHeader";

const SiteLayout = () => {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main className="pt-16">
        <Outlet />
      </main>
      <SiteFooter />
    </div>
  );
};

export default SiteLayout;
