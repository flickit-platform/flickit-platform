import { t } from "i18next";
import { toast } from "react-toastify";
import { AxiosError } from "axios";
import { ECustomErrorType } from "@types";
import { ICustomError } from "./CustomError";

export interface IToastErrorOptions {
  /**
   * Don't show error if status is one of
   */
  filterByStatus?: number[];
  /**
   * Don't show error if its type is one of
   */
  filterByType?: ECustomErrorType[];
  /**
   * Don't show error if it has any data
   */
  filterIfHasData?: boolean;
}

const toastError = (
  err: ICustomError | AxiosError | string | true,
  options?: IToastErrorOptions
) => {
  if (typeof err === "boolean" && err) {
    toast.error(t("someThingWentWrong") as string);
    return;
  }
  if (typeof err === "string") {
    toast.error(err);
    return;
  }

  const {
    filterByStatus = [],
    filterByType = [],
    filterIfHasData = true,
  } = options || {};

  if (!err) {
    return;
  }

  let status: number | undefined;
  let data: any;
  let type: ECustomErrorType | undefined;
  let message: string | undefined;

  if (err.isAxiosError) {
    const axiosError = err as AxiosError;
    status = axiosError.response?.status;
    data = axiosError.response?.data;
    message = axiosError.message;
  } else {
    const customError = err as ICustomError;
    status = customError.response?.status;
    data = customError.response?.data;
    type = customError.code as ECustomErrorType; 
    message = customError.message;
  }

  if (filterByStatus.length > 0 && status) {
    if (filterByStatus.includes(status)) {
      return;
    }
  }

  if (filterByType.length > 0 && type) {
    if (filterByType.includes(type)) {
      return;
    }
  }

  if (filterIfHasData) {
    if (
      typeof data === "object" &&
      data !== null &&
      Object.keys(data).length > 0 &&
      !data?.message &&
      !data?.detail &&
      !(data?.non_field_errors?.length > 0)
    ) {
      return;
    }
  }

  if (
    status === 401 ||
    type === ECustomErrorType.INVALID_TOKEN ||
    type === ECustomErrorType.CANCELED
  ) {
    return;
  }

  toast.error(
    data?.message || data?.detail || data?.non_field_errors?.[0] || message
  );
};

export default toastError;
