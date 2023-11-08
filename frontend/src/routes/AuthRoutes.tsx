import React, { PropsWithChildren } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuthContext } from "@providers/AuthProvider";
import keycloakService from "@/service/keyCloakService";
const AuthRoutes = (props: PropsWithChildren<{}>) => {
  const { isAuthenticatedUser } = useAuthContext();

  if (keycloakService.isLoggedIn()) {
    return <Navigate to={"/"} />;
  }

  return <Outlet />;
};

export default AuthRoutes;
