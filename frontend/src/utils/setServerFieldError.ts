import { ICustomError } from "./CustomError";

/**
 * Sets server field level errors on form fields
 *
 * Side effect on formMethods
 */
const setServerFieldErrors = (e: ICustomError | unknown, formMethods: any) => {
  const { data = {}, status } = e as ICustomError;
  if (status !== 400) {
    return;
  }
  Object.keys(data).forEach((key, index) => {
    if (key === "non_field_errors") {
      return;
    }
    formMethods.setError(
      key,
      { message: data[key][0], type: "server" },
      index === 0 ? { shouldFocus: true } : undefined
    );
  });
};

export default setServerFieldErrors;
