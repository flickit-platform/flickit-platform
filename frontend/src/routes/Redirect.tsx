import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuthContext } from "../providers/AuthProvider";

const Redirect = () => {
  const location = useLocation();
  const { isAuthenticatedUser, userInfo } = useAuthContext();
  const isRoot = location.pathname === "/";
  const shouldNavigateToLoginPage = !isAuthenticatedUser && isRoot;
  const spaceId = userInfo.current_space?.id;

  return (
    <Navigate
      to={
        shouldNavigateToLoginPage
          ? "/sign-in"
          : isRoot
          ? spaceId
            ? `/${spaceId}/assessments`
            : "/spaces"
          : location.pathname
      }
      state={{ from: location }}
      replace={true}
    />
  );
};

export default Redirect;
