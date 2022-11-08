import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { authActions, useAuthContext } from "../providers/AuthProvider";
import { useServiceContext } from "../providers/ServiceProvider";
import { ECustomErrorType } from "../types";
import { ICustomError } from "./CustomError";

const useGetSignedInUserInfo = () => {
  const { service } = useServiceContext();
  const location = useLocation();
  const navigate = useNavigate();
  const { dispatch, isAuthenticatedUser } = useAuthContext();
  const hasRunOnAuth = useRef(false);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  const getUser = () => {
    setError(false);
    setLoading(true);
    service
      .getSignedInUser()
      .then(({ data }: any) => {
        setLoading(false);

        dispatch(authActions.setUserInfo(data));
        const isAuthenticatedUser = localStorage.getItem("isAuthenticatedUser");
        if (isAuthenticatedUser && JSON.parse(isAuthenticatedUser)) {
          if (!data.current_space) {
            navigate("/spaces");
          } else {
            navigate(
              location.pathname.startsWith("/sign-in") ||
                location.pathname === "" ||
                location.pathname === "/"
                ? `/${data.current_space.id}/assessments`
                : location.pathname
            );
          }
        } else {
          localStorage.setItem("isAuthenticatedUser", JSON.stringify(false));
          navigate("/sign-in");
        }
      })
      .catch((e) => {
        setLoading(false);
        if ((e as ICustomError)?.type === ECustomErrorType.UNAUTHORIZED) {
          if (location.pathname == "/sign-up") {
            navigate("/sign-up");
          } else {
            navigate("/sign-in");
          }
        } else if (e?.action && e?.action !== "signOut") {
          setError(true);
        }
      });
  };

  useEffect(() => {
    if (!hasRunOnAuth.current && isAuthenticatedUser) {
      getUser();
      hasRunOnAuth.current = true;
    } else if (hasRunOnAuth.current && !isAuthenticatedUser) {
      hasRunOnAuth.current = false;
    }
  }, [isAuthenticatedUser]);

  return { error, loading };
};

export default useGetSignedInUserInfo;
