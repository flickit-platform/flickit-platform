import React, { PropsWithChildren } from "react";
import { Box } from "@mui/material";
import { styles } from "../../config/styles";
import { ECustomErrorType } from "../../types";
import { ICustomError } from "../../utils/CustomError";
import ErrorEmptyData from "./errors/ErrorEmptyData";
import ErrorDataLoading from "./errors/ErrorDataLoading";
import { ErrorNotFoundOrAccessDenied } from "./errors/ErrorNotFoundOrAccessDenied";
import GettingThingsReadyLoading from "./loadings/GettingThingsReadyLoading";

interface IQueryDataProps<T> {
  loadingComponent?: JSX.Element;
  emptyDataComponent?: JSX.Element;
  errorComponent?: JSX.Element;
  data: T;
  loading: boolean;
  error: boolean;
  loaded: boolean;
  errorObject: ICustomError | undefined;
  render: (data: T) => JSX.Element;
  renderLoading?: () => JSX.Element;
  renderError?: (
    err:
      | ICustomError
      | (ICustomError | ICustomError[] | undefined)[]
      | undefined
  ) => JSX.Element;
  isDataEmpty?: (data: T) => boolean;
}

const QueryData = <T extends any = any>(props: IQueryDataProps<T>) => {
  const {
    render,
    data,
    loading,
    loaded,
    error,
    errorObject,
    isDataEmpty = defaultIsDataEmpty,
    errorComponent = <ErrorDataLoading />,
    renderLoading = () => loadingComponent,
    loadingComponent = (
      <Box sx={{ ...styles.centerVH }} pt={3}>
        <GettingThingsReadyLoading />
      </Box>
    ),
    renderError = defaultRenderError,
    emptyDataComponent = <ErrorEmptyData />,
  } = props;

  if (loading) {
    return renderLoading();
  }
  if (error) {
    return renderError(errorObject, errorComponent);
  }
  const isEmpty = loaded && data ? isDataEmpty(data) : false;
  if (isEmpty) {
    return emptyDataComponent;
  }
  return <>{loaded && data ? render(data) : null}</>;
};

const defaultIsDataEmpty = (data: any) => {
  if (Array.isArray(data)) {
    if (data.length === 0) {
      return true;
    }
    return false;
  }
  if (typeof data === "object") {
    const keys = Object.keys(data);
    if (keys && keys.length === 0) {
      return true;
    }
    if (data?.results?.length === 0) {
      return true;
    }
  }

  return false;
};

export const defaultRenderError = (
  err: ICustomError | undefined,
  errorComponent: JSX.Element = <ErrorDataLoading />
): any => {
  if (!err) {
    return errorComponent;
  }
  if (
    err.type === ECustomErrorType.NOT_FOUND ||
    err.type === ECustomErrorType.ACCESS_DENIED
  ) {
    return <ErrorNotFoundOrAccessDenied />;
  }
  return errorComponent;
};

export default QueryData;
