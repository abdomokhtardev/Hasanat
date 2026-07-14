import { Suspense } from "react";
import { Outlet } from "react-router-dom";
import Nav from "../Components/Nav.jsx";
import DeveloperBadge from "../Components/DeveloperBadge.jsx";
import { useData } from "../hooks/UseData.js";

const Layout = () => {
  const { Spinner } = useData();
  
  return (
    <>
      <Nav />
      <Suspense fallback={
        <div className="min-h-screen flex justify-center items-center bg-[var(--bg-main)]">
          {Spinner ? Spinner() : <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[var(--accent)]"></div>}
        </div>
      }>
        <Outlet />
      </Suspense>
      <DeveloperBadge />
    </>
  );
};

export default Layout;
