import { TQueryData } from "../types";
import { ICustomError } from "./CustomError";

type TCombinedQueryData = {
  data: any[];
  loading: boolean;
  loaded: boolean;
  error: boolean;
  errorObject: ICustomError[] | undefined;
  query: ((...arg: any) => Promise<any>)[];
};

const combineQueryData = (...args: TQueryData[]) => {
  const errorObject: undefined | ICustomError[] = [];
  const data: undefined | any[] = [];
  const query: ((...arg: any) => Promise<any>)[] = [];

  const combinedQueryData: any = args.reduce(
    (prevValue: any, currentValue: any) => {
      if (prevValue) {
        return {
          loading: prevValue.loading || currentValue.loading,
          loaded: prevValue.loaded && currentValue.loaded,
          error: prevValue.error || currentValue.error,
        } as any;
      }
      return {
        loading: currentValue.loading,
        loaded: currentValue.loaded,
        error: currentValue.error,
        errorObject: [prevValue.errorObject],
        data: [prevValue.data],
        query: [prevValue.query],
      };
    }
  );

  args.forEach((arg) => {
    arg.data && data.push(arg.data);
    arg.errorObject && errorObject.push(arg.errorObject);
    arg.query && query.push(arg.query);
  });

  return {
    ...combinedQueryData,
    data,
    errorObject,
    query,
  } as TCombinedQueryData;
};

export default combineQueryData;
