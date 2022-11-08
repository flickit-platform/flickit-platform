import { AxiosResponse } from "axios";
import React, { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import { ICustomError } from "./CustomError";
import dataExist from "./dataExist";
import defToastError, { IToastErrorOptions } from "./toastError";

interface IUseQueryProps<T> {
  initialData?: any;
  runOnMount?: boolean;
  toastError?:
    | boolean
    | ((err: ICustomError, options?: IToastErrorOptions) => void);
  toastErrorOptions?: IToastErrorOptions;
  service: (...arg: any) => Promise<AxiosResponse<any, any>>;
}

export const useQuery = <T extends any = any>(props: IUseQueryProps<T>) => {
  const {
    initialData,
    service,
    runOnMount = true,
    toastError = false,
    toastErrorOptions,
  } = props;
  const [data, setData] = useState(initialData);
  const [loading, setLoading] = useState(() => (runOnMount ? true : false));
  const [error, setError] = useState(false);
  const [errorObject, setErrorObject] = useState<undefined | ICustomError>(
    undefined
  );

  useEffect(() => {
    if (runOnMount) {
      query();
    }
  }, []);

  const query = async (...arg: any) => {
    setLoading(true);
    setErrorObject(undefined);

    try {
      const { data } = await service(...arg);
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

  return { data, loading, loaded, error, errorObject, query };
};

export type TQueryData = ReturnType<typeof useQuery>;
