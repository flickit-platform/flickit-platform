import { PropsWithChildren } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuthContext } from "../providers/AuthProvider";

const PrivateRoutes = (props: PropsWithChildren<{}>) => {
  const { isAuthenticatedUser } = useAuthContext();

  if (!isAuthenticatedUser) {
    return <Navigate to="/sign-in" />;
  }

  return <Outlet />;
};

export default PrivateRoutes;
