import { PropsWithChildren } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useKeycloak } from "@react-keycloak/web";
import { authActions, useAuthContext } from "@providers/AuthProvider";
const PrivateRoutes = (props: PropsWithChildren<{}>) => {
  // const { isAuthenticatedUser } = useAuthContext();
  const { dispatch } = useAuthContext();
  const { keycloak, initialized } = useKeycloak();
  if (keycloak.authenticated) {
    console.log(keycloak.token);
    dispatch(authActions.signIn());
  }
  if (!keycloak.authenticated) {
    keycloak.login();

    return <></>;
  } else {
    return <Outlet />;
  }
  // if (!isAuthenticatedUser) {
  //   return <Navigate to="/sign-in" />;
  // }
};

export default PrivateRoutes;
