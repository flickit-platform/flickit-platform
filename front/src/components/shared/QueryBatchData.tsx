import React, { PropsWithChildren } from "react";
import Box from "@mui/material/Box";
import { styles } from "../../config/styles";
import { ECustomErrorType } from "../../types";
import { ICustomError } from "../../utils/CustomError";
import EmptyError from "./errors/EmptyError";
import DataLoadingError from "./errors/DataLoadingError";
import { NotFoundOrAccessDenied } from "./errors/NotFoundOrAccessDenied";
import GettingThingsReadyLoading from "./loadings/GettingThingsReadyLoading";
import { AxiosRequestConfig } from "axios";

interface IQueryData<T> {
  data: T;
  loading: boolean;
  error: boolean;
  loaded: boolean;
  errorObject: ICustomError | undefined;
  query?: (
    args?: any,
    config?: AxiosRequestConfig<any> | undefined
  ) => Promise<any>;
  abortController?: AbortController;
}

interface IQueryDataProps<T> {
  loadingComponent?: JSX.Element;
  emptyDataComponent?: JSX.Element;
  errorComponent?: JSX.Element;
  render: (data: T[]) => JSX.Element;
  renderLoading?: () => JSX.Element;
  renderError?: (
    err: (ICustomError | ICustomError[] | undefined)[] | undefined,
    errorComponent: JSX.Element
  ) => JSX.Element;
  isDataEmpty?: (data?: (T | undefined)[]) => boolean;
  queryBatchData: IQueryData<T>[];
  data?: T[];
  loading?: boolean;
  error?: boolean;
  loaded?: boolean;
  errorObject?: (ICustomError | undefined)[];
}

const QueryData = <T extends any = any>(props: IQueryDataProps<T>) => {
  const {
    render,
    queryBatchData = [],
    isDataEmpty,
    errorComponent = <DataLoadingError />,
    renderLoading = () => loadingComponent,
    loadingComponent = (
      <Box sx={{ ...styles.centerVH }} pt={3}>
        <GettingThingsReadyLoading />
      </Box>
    ),
    renderError = defaultRenderError,
    emptyDataComponent = <EmptyError />,
    data = reduceData<T>(queryBatchData),
    loading = reduceLoadings<T>(queryBatchData),
    loaded = reduceLoaded<T>(queryBatchData),
    error = reduceError<T>(queryBatchData),
    errorObject = reduceErrorObject<T>(queryBatchData),
  } = props;

  if (loading) {
    return renderLoading();
  }
  if (error) {
    return renderError(errorObject, errorComponent);
  }
  const isEmpty = loaded && isDataEmpty ? isDataEmpty(data) : false;
  if (isEmpty) {
    return emptyDataComponent;
  }
  return (
    <>
      {loaded && data?.length === queryBatchData?.length ? render(data) : null}
    </>
  );
};

export const defaultRenderError = (
  err: ICustomError | (ICustomError | ICustomError[] | undefined)[] | undefined,
  errorComponent: JSX.Element = <DataLoadingError />
): any => {
  if (!err) {
    return errorComponent;
  }
  if (Array.isArray(err)) {
    if (err.length === 0) {
      return errorComponent;
    }
    if (err[err.length - 1]) {
      return defaultRenderError(err[err.length - 1]);
    } else {
      const errTemp = err;
      const error = errTemp.find((er: any) => er?.type);
      if (error) {
        return defaultRenderError(error);
      }
      return errorComponent;
    }
  }
  if (err.type === ECustomErrorType.NOT_FOUND) {
    return <NotFoundOrAccessDenied />;
  }
  return errorComponent;
};

const reduceData = <T extends any = any>(queryBatchData: IQueryData<T>[]) => {
  return queryBatchData.map((query) => query.data);
};

const reduceLoadings = <T extends any = any>(
  queryBatchData: IQueryData<T>[]
) => {
  return queryBatchData.reduce((prevQuery, currentQuery) => ({
    ...currentQuery,
    loading: !!(prevQuery.loading || currentQuery.loading),
  })).loading;
};

const reduceLoaded = <T extends any = any>(queryBatchData: IQueryData<T>[]) => {
  return queryBatchData.reduce((prevQuery, currentQuery) => {
    return {
      ...currentQuery,
      loaded: !!(prevQuery.loaded && currentQuery.loaded),
    };
  })?.loaded;
};

const reduceError = <T extends any = any>(queryBatchData: IQueryData<T>[]) => {
  return queryBatchData.reduce((prevQuery, currentQuery) => ({
    ...currentQuery,
    error: !!(prevQuery.error || currentQuery.error),
  })).error;
};

const reduceErrorObject = <T extends any = any>(
  queryBatchData: IQueryData<T>[]
) => {
  return queryBatchData.map((query) => query.errorObject);
};

export default QueryData;
