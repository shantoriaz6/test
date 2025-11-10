import React from "react";
import { Outlet } from "react-router-dom";
import ScrollToTop from "../components/ScrollToTop";

const Layout = () => {
  return (
    <div className="min-h-screen w-full">
      <ScrollToTop />
      <Outlet />
    </div>
  );
};

export default Layout;
