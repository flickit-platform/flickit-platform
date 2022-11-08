import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { authActions, useAuthContext } from "../providers/AuthProvider";
import { useServiceContext } from "../providers/ServiceProvider";
import { ECustomErrorType } from "../types";
import { ICustomError } from "./CustomError";

const useGetSignedInUserInfo = (
  props: { runOnMount: boolean } = { runOnMount: true }
) => {
  const { runOnMount } = props;
  const { service } = useServiceContext();
  const location = useLocation();
  const navigate = useNavigate();
  const { dispatch, isAuthenticatedUser, userInfo, loadingUserInfo } =
    useAuthContext();
  const [error, setError] = useState(false);
  const abortController = useRef(new AbortController());

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
      getUser();
    }

    return () => {
      // abortController.current?.abort();
    };
  }, []);

  return { error, loading: loadingUserInfo, userInfo, getUser };
};

export default useGetSignedInUserInfo;
