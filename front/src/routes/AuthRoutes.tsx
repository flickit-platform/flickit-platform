import React, { PropsWithChildren } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuthContext } from "../providers/AuthProvider";

const AuthRoutes = (props: PropsWithChildren<{}>) => {
  const { isAuthenticatedUser } = useAuthContext();

  if (isAuthenticatedUser) {
    return <Navigate to="/" />;
  }

  return <Outlet />;
};

export default AuthRoutes;
