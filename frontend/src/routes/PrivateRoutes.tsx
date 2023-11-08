import { PropsWithChildren } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuthContext } from "@providers/AuthProvider";
import keycloakService from "@/service/keyCloakService";
const PrivateRoutes = (props: PropsWithChildren<{}>) => {
  const { isAuthenticatedUser } = useAuthContext();

  if (!keycloakService.isLoggedIn()) {
    return <Navigate to="/sign-in" />;
  }

  return <Outlet />;
};

export default PrivateRoutes;
