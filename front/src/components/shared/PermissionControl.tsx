import React, { PropsWithChildren } from "react";
import { ECustomErrorType } from "../../types";
import { ICustomError } from "../../utils/CustomError";
import { NotFoundOrAccessDenied } from "./errors/NotFoundOrAccessDenied";

interface IPermissionControl {
  error: (ICustomError | undefined) | (ICustomError | undefined)[];
  loading?: boolean;
}

const PermissionControl = (props: PropsWithChildren<IPermissionControl>) => {
  const { children, error, loading } = props;

  if (loading) {
    return <>{children}</>;
  }

  const hasViewPermission = getHasViewPermission(error);

  if (!hasViewPermission) {
    return <NotFoundOrAccessDenied />;
  }

  return <>{children}</>;
};

const getHasViewPermission = (
  error: (ICustomError | undefined) | (ICustomError | undefined)[]
) => {
  if (
    !error ||
    (typeof error === "object" && Object.keys(error).length === 0)
  ) {
    return true;
  }
  if (Array.isArray(error)) {
    if (error.length === 0) {
      return true;
    }
    if (
      error.findIndex(
        (err) =>
          err?.type === ECustomErrorType.ACCESS_DENIED ||
          err?.type === ECustomErrorType.NOT_FOUND
      ) !== -1
    ) {
      return false;
    }
    return true;
  }
  if (
    error.type === ECustomErrorType.ACCESS_DENIED ||
    error.type === ECustomErrorType.NOT_FOUND
  ) {
    return false;
  }
  return true;
};

export default PermissionControl;
