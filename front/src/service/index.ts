import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";
import { Id, toast } from "react-toastify";
import { createCustomErrorFromResponseError } from "./responseInterceptors";
import { t } from "i18next";
import { ECustomErrorType } from "../types";
import { BASE_URL } from "../config/constants";

declare module "axios" {
  interface AxiosRequestConfig {
    withToast?: boolean;
    usePromiseToast?: boolean;
    toastId?: false | Id | undefined;
    promiseToastLoadingMessage?: string;
    isRefreshTokenReq?: boolean;
    showSuccessToast?: boolean;
  }
}

export const createService = (unAuthenticateApp: () => void) => {
  const lAccessToken = localStorage.getItem("accessToken");
  let accessToken: any;
  try {
    accessToken = lAccessToken ? JSON.parse(lAccessToken) : undefined;
  } catch {
    unAuthenticateApp();
  }
  axios.defaults.baseURL = BASE_URL;
  axios.defaults.withCredentials = true;
  axios.defaults.timeoutErrorMessage = t("checkNetworkConnection");

  const rejectResponseInterceptor = async (err: any = {}) => {
    if (err._isCustomError) {
      throw err;
      return;
    }
    const { response = {}, config = {} } = err;
    const { status } = response;
    const { withToast, toastId, isRefreshTokenReq } = config;
    const prevRequest = config;
    const Error = createCustomErrorFromResponseError(err);
    const { message } = Error;

    if (withToast) {
      if (toastId) {
        toast.update(toastId, {
          render: message,
          type: "error",
          isLoading: false,
          autoClose: 4000,
        });
      } else {
        if (message !== "Given token not valid for any token type")
          toast.error(message);
      }
    }
    if (status) {
      if ((status === 401 || status === 403) && !prevRequest.sent) {
        if (isRefreshTokenReq) {
          unAuthenticateApp();
          Error.action = "signOut";
          Error.type = ECustomErrorType.INVALID_TOKEN;
          throw Error;
        }
        prevRequest.sent = true;
        localStorage.removeItem("accessToken");
        const lRefreshToken = localStorage.getItem("refreshToken");
        const refreshToken = lRefreshToken && JSON.parse(lRefreshToken);

        if (refreshToken) {
          const newAccessToken = await fetchNewAccessToken(refreshToken);
          if (newAccessToken) {
            localStorage.setItem("accessToken", JSON.stringify(newAccessToken));
            //@ts-expect-error
            axios.defaults.headers["Authorization"] = `JWT ${newAccessToken}`;
            prevRequest.headers["Authorization"] = `JWT ${newAccessToken}`;
            const result = await axios.request(prevRequest);

            return result;
          } else {
            throw Error;
          }
        } else {
          unAuthenticateApp();
          Error.action = "signOut";
          Error.type = ECustomErrorType.INVALID_TOKEN;
        }
      }
    }
    throw Error;
  };

  const fulfillResponseInterceptor = (res: AxiosResponse<any, any>) => {
    const { config = {} } = res;
    const { withToast, toastId, showSuccessToast } = config;

    if (config.url === "auth/jwt/create/" && res.data.access) {
      //@ts-expect-error
      axios.defaults.headers["Authorization"] = `JWT ${res.data.access}`;
    }
    if (withToast) {
      if (showSuccessToast) {
        if (toastId) {
          toast.update(toastId, {
            render: "success",
            type: "success",
            isLoading: false,
            autoClose: 4000,
          });
        } else {
          toast.success("success");
        }
      } else {
        if (toastId) {
          toast.dismiss(toastId);
        }
      }
    } else {
      if (toastId) {
        toast.dismiss(toastId);
      }
    }

    return res;
  };

  axios.interceptors.request.use((req: AxiosRequestConfig = {}) => {
    const { usePromiseToast, promiseToastLoadingMessage, withToast } = req;

    if (withToast) {
      const toastId =
        usePromiseToast &&
        toast.loading(promiseToastLoadingMessage || t("pleaseWait").toString());
      req.toastId = toastId;
    }
    if (!req.headers?.["Authorization"] && accessToken) {
      (req as any).headers["Authorization"] = `JWT ${accessToken}`;
    }
    return req;
  });

  axios.interceptors.response.use(
    (res) => fulfillResponseInterceptor(res),
    (err) => rejectResponseInterceptor(err)
  );

  const service = {
    activateUser(uid: string, token: string) {
      return axios.get(`/activate/${uid}/${token}/`);
    },
    signIn(data: { username: string; password: string }) {
      return axios.post(`/auth/jwt/create/`, data);
    },
    signUp(data: { username: string; password: string }) {
      return axios.post(`/auth/users/`, data);
    },
    getSignedInUser() {
      return axios.get(`/auth/users/me/`);
    },
    fetchSpaces() {
      return axios.get(`/authinfo/spaces/`);
    },
    fetchSpace(spaceId: string) {
      return axios.get(`/authinfo/spaces/${spaceId}/`);
    },
    deleteSpace(spaceId: string) {
      return axios.delete(`/authinfo/spaces/${spaceId}/`);
    },
    createSpace(data: any) {
      return axios.post(`/authinfo/spaces/`, data);
    },
    updateSpace(spaceId: string, data: any) {
      return axios.put(`/authinfo/spaces/${spaceId}/`, data);
    },
    addMember(spaceId: string, user_id: string | undefined) {
      return axios.post(`/authinfo/spaces/${spaceId}/useraccess/`, {
        user_id,
      });
    },
    setCurrentSpace(spaceId: string | number) {
      return axios.post(`/changecurrentspace/${spaceId}/`);
    },
    deleteSpaceMember(spaceId: string, memberId: string) {
      return axios.delete(
        `/authinfo/spaces/${spaceId}/useraccess/${memberId}/`
      );
    },
    fetchSpaceMembers(spaceId: string) {
      return axios.get(`/authinfo/spaces/${spaceId}/useraccess/`);
    },
    fetchAssessments(spaceId: string | undefined) {
      return axios.get(`/authinfo/spaces/${spaceId}/assessments/`);
    },
    createAssessment(data: any) {
      return axios.post(`/assessment/projects/`, data);
    },
    loadAssessment(rowId: any) {
      return axios.get(`/assessment/projects/${rowId}/`);
    },
    updateAssessment(rowId: any, data: any) {
      return axios.put(`/assessment/projects/${rowId}/`, data);
    },
    deleteAssessment(id: any) {
      return axios.delete(`/assessment/projects/${id}/`);
    },
    fetchAssessment(assessmentId: string) {
      return axios.get(`/assessment/reports/${assessmentId}/`);
    },
    fetchSubject(subjectId: string, resultId: string) {
      return axios.get(`/assessment/reportsubject/`, {
        params: {
          assessment_subject_pk: subjectId,
          assessment_result_pk: resultId,
        },
      });
    },
    fetchCategories(subjectId: string | undefined) {
      return axios.get(`/baseinfo/subjects/${subjectId}/metriccategories/`);
    },
    fetchCategory(categoryId: string | undefined) {
      return axios.get(`/baseinfo/metriccategories/${categoryId}/`);
    },
    fetchOptions(url: string) {
      return axios.get(url?.startsWith("/") ? url : `baseinfo/${url}/`);
    },
    createResult(subjectId: string | undefined | null = null) {
      return axios.post("/assessment/results/", {
        assessment_project: subjectId,
      });
    },
    fetchResults() {
      return axios.get(`/assessment/results/`);
    },
    submitAnswer(resultId: string | null, categoryId: string, data: any) {
      return axios.post(
        `/assessment/results/${resultId || ""}/metricvalues/`,
        data,
        {
          params: { metric_category_pk: categoryId },
        }
      );
    },
    fetchMetrics(categoryId: string | undefined) {
      return axios.get(`/baseinfo/metriccategories/${categoryId}/metrics/`);
    },
    fetchCategoryResult(resultId: string, categoryId: string) {
      return axios.get(`/assessment/results/${resultId}/metricvalues/`, {
        params: { metric_category_pk: categoryId },
      });
    },
  };

  return service;
};

const fetchNewAccessToken = async (refresh: string) => {
  const { data = {} } = await axios.post(
    "/auth/jwt/refresh",
    { refresh },
    { isRefreshTokenReq: true }
  );

  const { access } = data as any;

  return access;
};

export type TService = ReturnType<typeof createService>;
