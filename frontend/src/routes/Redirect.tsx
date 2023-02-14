import { Location, Navigate, useLocation } from "react-router-dom";
import { IAuthContext, useAuthContext } from "@providers/AuthProvider";

const Redirect = () => {
  const location = useLocation();
  const authContext = useAuthContext();

  return <Navigate to={getWhereToGo(location, authContext)} state={{ from: location }} replace={true} />;
};

const getWhereToGo = (location: Location, authContext: IAuthContext) => {
  const { isAuthenticatedUser, userInfo, redirectRoute } = authContext;
  const isRoot = location.pathname === "/";
  const shouldNavigateToLoginPage = !isAuthenticatedUser && isRoot;
  const spaceId = userInfo.current_space?.id;

  if (shouldNavigateToLoginPage) {
    // If user is not signed in and not on
    return "/sign-in";
  }
  if (redirectRoute) {
    return redirectRoute;
  }
  if (isRoot) {
    // If user has current space navigate to it otherwise navigate to spaces
    return spaceId ? `/${spaceId}/assessments` : "/spaces";
  }
  return location.pathname;
};

export default Redirect;
