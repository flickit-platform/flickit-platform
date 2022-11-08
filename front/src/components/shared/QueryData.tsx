import React, { PropsWithChildren } from "react";
import Box from "@mui/material/Box";
import { styles } from "../../config/styles";
import { ECustomErrorType } from "../../types";
import { ICustomError } from "../../utils/CustomError";
import EmptyError from "./errors/EmptyError";
import DataLoadingError from "./errors/DataLoadingError";
import { NotFoundOrAccessDenied } from "./errors/NotFoundOrAccessDenied";
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
    errorComponent = <DataLoadingError />,
    renderLoading = () => loadingComponent,
    loadingComponent = (
      <Box sx={{ ...styles.centerVH }} pt={3}>
        <GettingThingsReadyLoading />
      </Box>
    ),
    renderError = defaultRenderError,
    emptyDataComponent = <EmptyError />,
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
  errorComponent: JSX.Element = <DataLoadingError />
): any => {
  if (!err) {
    return errorComponent;
  }
  if (err.type === ECustomErrorType.NOT_FOUND) {
    return <NotFoundOrAccessDenied />;
  }
  return errorComponent;
};

export default QueryData;
