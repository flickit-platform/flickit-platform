import { ICustomError } from "./CustomError";

const setServerFieldErrors = (e: ICustomError | unknown, formMethods: any) => {
  const { data = {}, status } = e as ICustomError;
  if (status !== 400) {
    return;
  }
  Object.keys(data).forEach((key, index) => {
    formMethods.setError(
      key,
      { message: data[key][0], type: "server" },
      index === 0 ? { shouldFocus: true } : undefined
    );
  });
};

export default setServerFieldErrors;
