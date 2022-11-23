import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuthContext } from "../providers/AuthProvider";
import AppLayout from "./AppLayout";
import AuthLayout from "./AuthLayout";

const Layout = () => {
  const { isAuthenticatedUser } = useAuthContext();

  return isAuthenticatedUser ? <AppLayout /> : <AuthLayout />;
};

export default Layout;
