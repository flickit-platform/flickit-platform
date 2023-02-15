import axios from "axios";
import { ECustomErrorType } from "@types";
import { ICustomError } from "./CustomError";
import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useServiceContext } from "@providers/ServiceProvider";
import { authActions, useAuthContext } from "@providers/AuthProvider";

/**
 * Checks if any token is available and then checks if the user with the founded token is still authenticated or not.
 *
 */
const useGetSignedInUserInfo = (props: { runOnMount: boolean } = { runOnMount: true }) => {
  const { runOnMount } = props;
  const location = useLocation();
  const navigate = useNavigate();
  const { service } = useServiceContext();
  const [error, setError] = useState(false);
  const abortController = useRef(new AbortController());
  const { dispatch, isAuthenticatedUser, userInfo, loadingUserInfo } = useAuthContext();

  const getUser = async (token?: string) => {
    setError(false);
    dispatch(authActions.setUserInfoLoading(true));
    try {
      const { data } = await service.getSignedInUser(undefined, {
        signal: abortController.current.signal,
        //@ts-expect-error
        headers: token
          ? {
              ...axios.defaults.headers,
              Authorization: `JWT ${token}`,
            }
          : axios.defaults.headers,
      });

      dispatch(authActions.setUserInfoLoading(false));
      dispatch(authActions.setUserInfo(data));

      if (!isAuthenticatedUser) {
        dispatch(authActions.signIn());
      }
      return true;
    } catch (e) {
      const err = e as ICustomError;

      dispatch(authActions.setUserInfoLoading(false));
      dispatch(authActions.setUserInfo());

      if (err?.type === ECustomErrorType.UNAUTHORIZED) {
        if (location.pathname == "/sign-up") {
          navigate("/sign-up");
        } else {
          navigate("/sign-in");
        }
      } else if (err?.action && err?.action !== "signOut") {
        setError(true);
      }

      return false;
    }
  };

  useEffect(() => {
    if (runOnMount) {
      getUser().then((res) => {
        // This will save the url which user was attempting to open before being redirected to sign-in page
        if (!res) {
          location.pathname &&
            !location.pathname.includes("sign-") &&
            location.pathname !== "/" &&
            !isAuthenticatedUser &&
            dispatch(authActions.setRedirectRoute(location.pathname));
        }
      });
    }

    return () => {
      // abortController.current?.abort();
    };
  }, []);

  return { error, loading: loadingUserInfo, userInfo, getUser };
};

export default useGetSignedInUserInfo;
