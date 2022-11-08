import React, { PropsWithChildren } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { AppSuspenseFallbackLoading } from "../components";
import { PageNotFound } from "../components/errors/PageNotFound";
import { useAuthContext } from "../providers/AuthProvider";

const ProtectedRoutes = (props: PropsWithChildren<{}>) => {
  const { children } = props;
  const { isAuthenticatedUser } = useAuthContext();
  let location = useLocation();

  if (!isAuthenticatedUser) {
    return <Navigate to="/sign-in" state={{ from: location }} />;
  }

  return (
    <React.Suspense fallback={<AppSuspenseFallbackLoading />}>
      <Outlet />
    </React.Suspense>
  );
};

export default ProtectedRoutes;
