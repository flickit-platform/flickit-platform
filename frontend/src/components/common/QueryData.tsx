import React, { createContext, PropsWithChildren, useContext } from "react";
import Box from "@mui/material/Box";
import { styles } from "@styles";
import { ECustomErrorType, TQueryFunction, TQueryProps } from "@types";
import { ICustomError } from "@utils/CustomError";
import ErrorEmptyData from "./errors/ErrorEmptyData";
import ErrorDataLoading from "./errors/ErrorDataLoading";
import { ErrorNotFoundOrAccessDenied } from "./errors/ErrorNotFoundOrAccessDenied";
import GettingThingsReadyLoading from "./loadings/GettingThingsReadyLoading";
import ErrorRecalculating from "./errors/ErrorRecalculating";

interface IQueryDataProps<T> {
  loadingComponent?: JSX.Element;
  emptyDataComponent?: JSX.Element;
  errorComponent?: JSX.Element;
  data: T;
  loading: boolean;
  error: boolean;
  loaded: boolean;
  errorObject: ICustomError | undefined;
  abortController?: AbortController;
  render: (data: T) => JSX.Element;
  renderLoading?: () => JSX.Element;
  renderError?: (
    err:
      | ICustomError
      | (ICustomError | ICustomError[] | undefined)[]
      | undefined
  ) => JSX.Element;
  isDataEmpty?: (data: T) => boolean;
  showEmptyError?: boolean;
  query?: TQueryFunction<T>;
}

const QueryDataContext = createContext<TQueryProps>({
  data: undefined,
  error: false,
  loading: true,
  loaded: false,
  query: async () => null,
  errorObject: undefined,
  abortController: undefined as any,
});

/**
 *
 * - Can be use with useQuery together
 * - This component will take whatever useQuery returns and renders an appropriate component
 * - You should pass the render method to render your component after request resolve
 * - It will make the data available for all children through context api so you don't need to drill down the data
 */
const QueryData = <T extends any = any>(props: IQueryDataProps<T>) => {
  const {
    render,
    data,
    loading,
    loaded,
    error,
    errorObject,
    isDataEmpty = defaultIsDataEmpty,
    showEmptyError,
    errorComponent = <ErrorDataLoading />,
    renderLoading = () => loadingComponent,
    loadingComponent = (
      <Box sx={{ ...styles.centerVH }} pt={3}>
        <GettingThingsReadyLoading />
      </Box>
    ),
    renderError = defaultRenderError,
    emptyDataComponent = <ErrorEmptyData />,
    abortController,
    query = async () => null,
  } = props;

  if (loading) {
    return renderLoading();
  }
  if (error) {
    return renderError(errorObject, errorComponent);
  }
  const isEmpty = loaded && data ? isDataEmpty(data) : false;
  if (isEmpty && showEmptyError) {
    return emptyDataComponent;
  }
  return (
    <QueryDataContext.Provider
      value={{
        data,
        error,
        errorObject,
        loaded,
        loading,
        query,
        abortController,
      }}
    >
      {loaded && data ? render(data) : null}
    </QueryDataContext.Provider>
  );
};

export const useQueryDataContext = () => {
  const context = useContext(QueryDataContext);
  if (context === undefined) {
    throw new Error(
      "useQueryDataContext must be used within a QueryData render method"
    );
  }
  return context;
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
    err.code === ECustomErrorType.NOT_FOUND ||
    err.code === ECustomErrorType.ACCESS_DENIED
  ) {
    return <ErrorNotFoundOrAccessDenied />;
  }
  if (err?.response?.data?.code == "CALCULATE_NOT_VALID") {
    return <ErrorRecalculating />;
  }
  if (err?.response?.data?.code == "CONFIDENCE_CALCULATION_NOT_VALID") {
    return <ErrorRecalculating />;
  }
  return errorComponent;
};

export default QueryData;
