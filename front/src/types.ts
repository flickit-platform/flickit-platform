import { AxiosPromise } from "axios";
import { ToastOptions } from "react-toastify";

export enum ECustomErrorType {
  "DEFAULT" = "DEFAULT",
  "UNAUTHORIZED" = "UNAUTHORIZED",
  "NETWORK_CONNECTION" = "NETWORK_CONNECTION",
  "INVALID_TOKEN" = "INVALID_TOKEN",
  "NOT_FOUND" = "NOT_FOUND",
}

export enum ESystemStatus {
  "OPTIMIZED" = "OPTIMIZED",
  "GOOD" = "GOOD",
  "NORMAL" = "NORMAL",
  "RISKY" = "RISKY",
  "WEAK" = "WEAK",
}

export type TAnswerTemplate = { caption: string; value: number }[];
export interface IMetricInfo {
  id: any;
  index: number;
  answer: null | TAnswer;
  title: string;
  metricResultId?: string | number;
  answer_templates: TAnswerTemplate;
}
export type TMetricsInfo = {
  total_number_of_metrics: number;
  resultId: string | null;
  metrics?: IMetricInfo[];
};

export type TAnswer = {
  id: string | number;
  value: string | number;
  caption: string;
};

export type TStatus = "WEAK" | "RISKY" | "NORMAL" | "GOOD" | "OPTIMIZED";

export interface IUserInfo {
  id: number | string;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  current_space: ISpaceInfo | null;
}

export interface ISpaceInfo {
  id: number | string;
  code: string;
  title: string;
  owner: {
    first_name: string;
    id: string | number;
    last_name: string;
    username: string;
  };
}

export type TToastConfig = ToastOptions & {
  message: string | JSX.Element;
};
