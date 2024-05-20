import { AxiosError } from "axios";
import { FieldErrorData } from "./setServerFieldError";

interface IResponseData {
  code: string;
  message: any;
  errors: any;
  messages: any;
  description: any;
}
export interface ICustomError
  extends AxiosError<IResponseData | FieldErrorData> {
  action?: (...args: any[]) => any;
  toastConfig?: any;
}

function getFormattedMessage(message?: string, status?: number): string {
  if (message) {
    return message;
  }
  switch (status) {
    case 400:
      return "Bad Request";
    case 401:
      return "Unauthorized";
    case 403:
      return "Forbidden";
    case 404:
      return "Not Found";
    case 500:
      return "Internal Server Error";
    default:
      return "An error occurred";
  }
}

function CustomError(props: ICustomError): ICustomError {
  const { message, code, config, request, response, action, toastConfig } =
    props;

  const responseData = response?.data as { message?: string } | undefined;
  const formattedMessage = getFormattedMessage(
    responseData?.message,
    response?.status
  );

  const defaultAction =
    action && typeof action === "function"
      ? () => action(responseData)
      : undefined;

  const customError: ICustomError = {
    name: "CustomError",
    message: formattedMessage || message || "An error occurred",
    code,
    config,
    request,
    response,
    isAxiosError: true,
    toJSON: () => ({ ...props }),
    action: defaultAction as (...arg: any) => any,
    toastConfig,
  };

  return customError;
}

export default CustomError;
