import { t } from "i18next";
import { toast } from "react-toastify";
import { ECustomErrorType } from "../types";
import { ICustomError } from "./CustomError";

export interface IToastErrorOptions {
  filterByStatus?: number[];
  filterByType?: ECustomErrorType[];
  filterIfHasData?: boolean;
}

const toastError = (
  err: ICustomError | string | true,
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
  if (filterByStatus?.length > 0 && err.status) {
    const shouldFilter =
      filterByStatus.findIndex((status) => status == err.status) === -1
        ? false
        : true;

    if (shouldFilter) {
      return;
    }
  }
  if (filterByType?.length > 0 && err.type) {
    const shouldFilter =
      filterByType.findIndex((type) => type == err.type) === -1 ? false : true;
    if (shouldFilter) {
      return;
    }
  }
  if (filterIfHasData) {
    if (
      typeof err.data === "object" &&
      Object.keys(err.data).length > 0 &&
      !err?.data?.message &&
      !err?.data?.detail
    )
      return;
  }
  if (
    err.status == 401 ||
    err.type == ECustomErrorType.INVALID_TOKEN ||
    err.type == ECustomErrorType.CANCELED
  ) {
    return;
  }
  toast.error(err?.data?.message || err?.data?.detail || err.message);
};

export default toastError;
