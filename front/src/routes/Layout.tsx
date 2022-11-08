import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { AuthLayout } from "../containers";
import { useAuthContext } from "../providers/AuthProvider";
import AppScreen from "../screens/AppScreen";

const Layout = () => {
  const { isAuthenticatedUser } = useAuthContext();

  return isAuthenticatedUser ? <AppScreen /> : <AuthLayout />;
};

export default Layout;
