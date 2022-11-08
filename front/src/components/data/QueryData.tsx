import Box from "@mui/material/Box";
import React, { PropsWithChildren } from "react";
import { styles } from "../../config/styles";
import { ECustomErrorType } from "../../types";
import { ICustomError } from "../../utils/CustomError";
import { Empty } from "../Empty";
import { DataLoadingError } from "../errors/DataLoadingError";
import { NotFoundOrAccessDenied } from "../errors/NotFoundOrAccessDenied";
import { GettingThingsReadyLoading } from "../loading/GettingThingsReadyLoading";

interface IQueryDataProps {
  loadingComponent?: JSX.Element;
  emptyDataComponent?: JSX.Element;
  errorComponent?: JSX.Element;
  data?: any;
  loading?: boolean;
  error?: boolean;
  loaded?: boolean;
  errorObject?: ICustomError | undefined;
  render: (data: any) => JSX.Element;
  renderLoading?: () => JSX.Element;
  renderError?: (
    err:
      | ICustomError
      | (ICustomError | ICustomError[] | undefined)[]
      | undefined
  ) => JSX.Element;
  isDataEmpty?: (data: any, isQueryBatch: boolean) => boolean;
  queryBatchData?: {
    data?: any;
    loading?: boolean;
    error?: boolean;
    loaded?: boolean;
    errorObject?: ICustomError | ICustomError[] | undefined;
  }[];
}

export const QueryData = (props: IQueryDataProps) => {
  const {
    render,
    queryBatchData = [],
    data = queryBatchData.length > 0
      ? queryBatchData.map((query) => query.data)
      : undefined,
    loading = queryBatchData.length > 0
      ? queryBatchData.reduce((prevQuery, currentQuery) => ({
          ...currentQuery,
          loading: !!(prevQuery.loading || currentQuery.loading),
        })).loading
      : false,
    loaded = queryBatchData.length > 0
      ? queryBatchData.reduce((prevQuery, currentQuery) => {
          return {
            ...currentQuery,
            loaded: !!(prevQuery.loaded && currentQuery.loaded),
          };
        })?.loaded
      : false,
    error = queryBatchData.length > 0
      ? queryBatchData.reduce((prevQuery, currentQuery) => ({
          ...currentQuery,
          error: !!(prevQuery.error || currentQuery.error),
        })).error
      : false,
    errorObject = queryBatchData.length > 0
      ? queryBatchData.map((query) => query.errorObject)
      : undefined,
    isDataEmpty = defaultIsDataEmpty,
    errorComponent = <DataLoadingError />,
    renderLoading = () => loadingComponent,
    loadingComponent = (
      <Box sx={{ ...styles.centerVH }} pt={3}>
        <GettingThingsReadyLoading />
      </Box>
    ),
    renderError = defaultRenderError,
    emptyDataComponent = <Empty />,
  } = props;

  const isQueryBatch = queryBatchData?.length > 0;

  if (loading) {
    return renderLoading();
  }
  if (error) {
    return renderError(errorObject, errorComponent);
  }
  const isEmpty = loaded ? isDataEmpty(data, isQueryBatch) : false;
  if (isEmpty) {
    return emptyDataComponent;
  }
  return <>{loaded ? render(data) : null}</>;
};

const defaultIsDataEmpty = (data: any, isQueryBatch: boolean) => {
  if (Array.isArray(data)) {
    if (isQueryBatch) {
      console.warn(
        "When you pass query batch data, it's on you to determine empty data"
      );
      return false;
    } else {
      if (data.length === 0) {
        return true;
      }
    }
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
