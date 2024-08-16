import { Location, Navigate, useLocation } from "react-router-dom";
import { IAuthContext, useAuthContext } from "@providers/AuthProvider";

const Redirect = () => {
  const location = useLocation();
  const authContext = useAuthContext();

  return (
    <Navigate
      to={getWhereToGo(location, authContext)}
      state={{ from: location }}
      replace={true}
    />
  );
};

const getWhereToGo = (location: Location, authContext: IAuthContext) => {
  const { redirectRoute } = authContext;
  const isRoot = location.pathname === "/";
  // Will redirect user to the page which user wanted to visit while he wasn't sign in
  if (redirectRoute) {
    return redirectRoute;
  }
  if (isRoot) {
    // If user has current space navigate to it otherwise navigate to spaces
    return "/spaces/1";
  }
  return location.pathname;
};

export default Redirect;
