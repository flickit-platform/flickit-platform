import { AxiosRequestConfig, AxiosResponse } from "axios";
import React, { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import { ICustomError } from "./CustomError";
import dataExist from "./dataExist";
import defToastError, { IToastErrorOptions } from "./toastError";

interface IUseQueryProps<T, A> {
  initialData?: any;
  runOnMount?: boolean;
  toastError?:
    | boolean
    | ((err: ICustomError, options?: IToastErrorOptions) => void);
  toastErrorOptions?: IToastErrorOptions;
  service: (
    args?: A,
    config?: AxiosRequestConfig<any> | undefined
  ) => Promise<AxiosResponse<T, any>>;
}

export const useQuery = <T extends any = any, A extends any = any>(
  props: IUseQueryProps<T, A>
) => {
  const {
    initialData,
    service,
    runOnMount = true,
    toastError = false,
    toastErrorOptions,
  } = props;
  const [data, setData] = useState<T>(initialData);
  const [loading, setLoading] = useState(() => (runOnMount ? true : false));
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
      const { data } = await service(args, {
        signal: controller.current.signal,
        ...config,
      });
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

export type TQueryData = ReturnType<typeof useQuery>;
