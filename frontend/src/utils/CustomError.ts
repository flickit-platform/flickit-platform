import { t } from "i18next";
import { ECustomErrorType, TToastConfig } from "../types";

export interface ICustomError {
  name: string;
  message: string;
  status?: number;
  type: ECustomErrorType;
  action?: ((...arg: any) => any) | undefined | string;
  data: any;
  toastConfig?: TToastConfig | undefined;
  _isCustomError: boolean;
}

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
    action && typeof action === "function" && action.bind(this, data);
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
