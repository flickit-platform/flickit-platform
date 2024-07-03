import axios from "axios";
import { ICustomError } from "./CustomError";
import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { useServiceContext } from "@providers/ServiceProvider";
import { authActions, useAuthContext } from "@providers/AuthProvider";
import keycloakService from "@/service//keycloakService";
import toastError from "@utils/toastError";
/**
 * Checks if any token is available and then checks if the user with the founded token is still authenticated or not.
 *
 */
const useGetSignedInUserInfo = (
  props: { runOnMount: boolean } = { runOnMount: true }
) => {
  const { runOnMount } = props;
  const location = useLocation();
  const { service } = useServiceContext();
  const [error, setError] = useState(false);
  const abortController = useRef(new AbortController());
  const { dispatch, isAuthenticatedUser, userInfo, loadingUserInfo } =
    useAuthContext();

  const getUser = async (token?: string) => {
    setError(false);
    dispatch(authActions.setUserInfoLoading(true));
    try {
      const accessToken = keycloakService.getToken();
      const { data } = await service.getUserProfile(undefined, {
        signal: abortController.current.signal,
        //@ts-expect-error
        headers: accessToken
          ? {
              ...axios.defaults.headers,
              Authorization: `Bearer ${accessToken}`,
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
      setError(true);
      toastError(err);
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
