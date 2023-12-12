import { t } from "i18next";
import { ECustomErrorType, TToastConfig } from "@types";

export interface ICustomError {
  /**
   * Name of error
   */
  name: string;
  /**
   * Message to show
   */
  message: string;
  /**
   * If its service response it can contain status codes
   */
  status?: number;
  /**
   * Types of error
   */
  type: ECustomErrorType;
  /**
   * Action to perform on error
   */
  action?: ((...arg: any) => any) | undefined | string;
  /**
   * Error data, for services its equal to response data
   */
  data: any;
  errors?: any;
  response?:any;
  /**
   * Config for toast
   */
  toastConfig?: TToastConfig | undefined;
  _isCustomError: boolean;
}

/**
 *
 * Custom error object
 */
function CustomError(props: {
  type: ECustomErrorType;
  message: string;
  data: any;
  status?: number;
  action?: ((...arg: any) => any) | undefined;
  toastConfig?: TToastConfig | undefined;
}) {
  const {
    type = ECustomErrorType.DEFAULT,
    message = t("somethingWentWrong"),
    data = {},
    status,
    action,
    toastConfig,
  } = props;
  const defaultAction =
    //@ts-expect-error
    action && typeof action === "function" && action.bind(this as any, data);
  const formattedMessage = getFormattedMessage(message, status);
  const customError: ICustomError = {
    name: "CustomError",
    type,
    message: formattedMessage,
    status,
    data,
    action: action || (defaultAction as (...arg: any) => any),
    toastConfig,
    _isCustomError: true,
  };
  return customError;
}

const getFormattedMessage = (message: any, status: any) => {
  if (status) {
    if (status === 500) {
      return t("somethingSeemsOff");
    }
  }
  if (typeof message !== "string" || !message) {
    return message;
  }
  switch (message) {
    case "Network Error":
      return t("networkError");
    case "Token is invalid or expired":
      return "";

    default:
      return message;
  }
};

export default CustomError;
