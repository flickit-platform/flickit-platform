import { PropsWithChildren } from "react";
import {  Outlet } from "react-router-dom";
import axios from "axios";
import keycloakService from "@/service//keycloakService";
const PrivateRoutes = (props: PropsWithChildren<{}>) => { 
  const isAuthenticated = keycloakService.isLoggedIn();
  if (isAuthenticated) {
    const accessToken = keycloakService.getToken();
    axios.defaults.headers["Authorization"] = `Bearer ${accessToken}`;
    localStorage.setItem("accessToken", JSON.stringify(accessToken));
  }
  return isAuthenticated ? <Outlet /> : <Login />;
};

export default PrivateRoutes;
const Login = () => {
  keycloakService.doLogin();
  return <></>;
};
