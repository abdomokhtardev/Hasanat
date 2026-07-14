import { Outlet } from "react-router-dom";
import Nav from "../Components/Nav.jsx";
import DeveloperBadge from "../Components/DeveloperBadge.jsx";

const Layout = () => {
  return (
    <>
      <Nav />
      <Outlet />
      <DeveloperBadge />
    </>
  );
};

export default Layout;
