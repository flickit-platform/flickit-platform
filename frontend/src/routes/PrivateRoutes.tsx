import React, { PropsWithChildren } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuthContext } from "../providers/AuthProvider";

const PrivateRoutes = (props: PropsWithChildren<{}>) => {
  const { children } = props;
  const { isAuthenticatedUser } = useAuthContext();
  let location = useLocation();

  if (!isAuthenticatedUser) {
    return <Navigate to="/sign-in" state={{ from: location }} />;
  }

  return <Outlet />;
};

export default PrivateRoutes;
