import React, { useEffect, useRef, useState } from "react";
import { AxiosRequestConfig, AxiosResponse } from "axios";
import { ICustomError } from "./CustomError";
import dataExist from "./dataExist";
import defToastError, { IToastErrorOptions } from "./toastError";
import get from "lodash/get";

export type TQueryServiceFunction<T extends any = any, A extends any = any> = (
  args?: A,
  config?: AxiosRequestConfig<any> | undefined
) => Promise<AxiosResponse<T, any>>;
interface IUseQueryProps<T, A> {
  /**
   * its better to pass initialData equal to fetched data structure
   */
  initialData?: any;
  /**
   * true by default. pass false if you don't want to run it on component mount
   */
  runOnMount?: boolean;
  /**
   * initial value for loading
   */
  initialLoading?: boolean;
  /**
   * if true we call the toastError implicitly function by passing the error object. you can pass the function to get the error and do it your self
   */
  toastError?:
    | boolean
    | ((err: ICustomError, options?: IToastErrorOptions) => void);
  /**
   * toastError config object
   */
  toastErrorOptions?: IToastErrorOptions;
  /**
   * must be a function that returns the service
   *
   * #### example:
   *
   * ```jsx
   *   const { service } = useServiceContext();
   *   const { groupId } = useParams();
   *   const queryDataProps = useQuery({
   *      service: (args = { groupId }, config) => service.fetchGroupInfo(args, config),
   *    });
   * ```
   *
   */
  service: TQueryServiceFunction<T, A>;
  /**
   * If available will be use to find the data inside res otherwise data is res
   */
  accessor?: string;
}

/**
 * ### A hook for fetching data from server
 *
 * You must call it inside components body by passing service to it
 * It returns an object containing 4 items
 * - data: service returned data response
 * - loading: true when we start fetching and false when data loads. you can set the initial value by passing initialLoading if you don't pass it, it tries to get the runOnMount values as default value
 * - loaded: true when the data is loaded
 * - error: true when fetching is done and some errors happens
 * - errorObject: if error is true this object might contains error data
 * - query: Is the service function to be called again
 * - abortController: can be used for service clean up (canceling service call when component unmounts)
 *
 */
export const useQuery = <T extends any = any, A extends any = any>(
  props: IUseQueryProps<T, A>
) => {
  const {
    initialData,
    service,
    runOnMount = true,
    initialLoading = runOnMount,
    toastError = false,
    toastErrorOptions,
    accessor,
  } = props;
  const [data, setData] = useState<T>(initialData);
  const [loading, setLoading] = useState(initialLoading);
  const [error, setError] = useState(false);
  const [errorObject, setErrorObject] = useState<undefined | ICustomError>(
    undefined
  );
  const controller = useRef(new AbortController());

  useEffect(() => {
    if (runOnMount) {
      query();
    }
    return () => {
      controller.current.abort();
    };
  }, []);

  const query = async (
    args?: A | undefined,
    config: AxiosRequestConfig<any> | undefined = {}
  ) => {
    setLoading(true);
    setErrorObject(undefined);

    try {
      const { data: res } = await service(args, {
        signal: controller.current.signal,
        ...config,
      });
      const data = accessor ? get(res, accessor, initialData) : res;
      if (data) {
        setData(data);
        setError(false);
      } else {
        setData(initialData);
        setError(true);
      }

      setLoading(false);
      return Promise.resolve(data);
    } catch (e) {
      const err = e as ICustomError;
      if (typeof toastError === "function") {
        toastError(err, toastErrorOptions);
      } else if (typeof toastError === "boolean" && toastError) {
        defToastError(err, toastErrorOptions);
      }
      setErrorObject(err);
      setLoading(false);
      setError(true);
      return Promise.reject(err);
    }
  };

  const loaded = !loading && !error && dataExist(data);

  return {
    data,
    loading,
    loaded,
    error,
    errorObject,
    query,
    abortController: controller.current,
  };
};
