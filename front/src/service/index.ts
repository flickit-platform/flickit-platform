import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import createCustomErrorFromResponseError from "../utils/createCustomErrorFromResponseError";
import { t } from "i18next";
import { ECustomErrorType, TId } from "../types";
import { BASE_URL } from "../config/constants";

declare module "axios" {
  interface AxiosRequestConfig {
    isRefreshTokenReq?: boolean;
  }
}

export const createService = (
  signOut: () => void,
  accessToken: string,
  setAccessToken: any
) => {
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
    const { isRefreshTokenReq } = config;
    const prevRequest = config;
    const Error = createCustomErrorFromResponseError(err);

    if (status) {
      if (status === 401 && !prevRequest.sent) {
        if (isRefreshTokenReq) {
          signOut();
          Error.action = "signOut";
          Error.type = ECustomErrorType.INVALID_TOKEN;
          throw Error;
        }
        prevRequest.sent = true;
        const lRefreshToken = localStorage.getItem("refreshToken");
        const refreshToken = lRefreshToken && JSON.parse(lRefreshToken);

        if (refreshToken) {
          const newAccessToken = await fetchNewAccessToken(refreshToken);
          if (newAccessToken) {
            setAccessToken(newAccessToken);
            //@ts-expect-error
            axios.defaults.headers["Authorization"] = `JWT ${newAccessToken}`;
            prevRequest.headers["Authorization"] = `JWT ${newAccessToken}`;
            const result = await axios.request(prevRequest);

            return result;
          } else {
            throw Error;
          }
        } else {
          signOut();
          Error.action = "signOut";
          Error.type = ECustomErrorType.INVALID_TOKEN;
        }
      }
    }
    throw Error;
  };

  const fulfillResponseInterceptor = (res: AxiosResponse<any, any>) => {
    const { config = {} } = res;

    if (config.url === "auth/jwt/create/" && res.data.access) {
      //@ts-expect-error
      axios.defaults.headers["Authorization"] = `JWT ${res.data.access}`;
    }

    return res;
  };

  axios.interceptors.request.use((req: AxiosRequestConfig = {}) => {
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
    activateUser(
      { uid, token }: { uid: string; token: string },
      config: AxiosRequestConfig<any> | undefined
    ) {
      return axios.get(`/activate/${uid}/${token}/`, config);
    },
    signIn(
      data: { username: string; password: string },
      config: AxiosRequestConfig<any> | undefined
    ) {
      return axios.post(`/auth/jwt/create/`, data, config);
    },
    signUp(
      data: { username: string; password: string },
      config: AxiosRequestConfig<any> | undefined
    ) {
      return axios.post(`/auth/users/`, data, config);
    },
    getSignedInUser(arg: any, config: AxiosRequestConfig<any> | undefined) {
      return axios.get(`/auth/users/me/`, config);
    },
    fetchSpaces(arg: any, config: AxiosRequestConfig<any> | undefined) {
      return axios.get(`/authinfo/spaces/`, config);
    },
    fetchSpace(
      { spaceId }: { spaceId: string },
      config: AxiosRequestConfig<any> | undefined
    ) {
      return axios.get(`/authinfo/spaces/${spaceId}/`, config);
    },
    deleteSpace(
      { spaceId }: { spaceId: string },
      config: AxiosRequestConfig<any> | undefined
    ) {
      return axios.delete(`/authinfo/spaces/${spaceId}/`, config);
    },
    createSpace(data: any, config: AxiosRequestConfig<any> | undefined) {
      return axios.post(`/authinfo/spaces/`, data, config);
    },
    updateSpace(
      { spaceId, data }: { spaceId: string; data: any },
      config: AxiosRequestConfig<any> | undefined
    ) {
      return axios.put(`/authinfo/spaces/${spaceId}/`, data, config);
    },
    addMember(
      { spaceId, user_id }: { spaceId: string; user_id: string | undefined },
      config: AxiosRequestConfig<any> | undefined
    ) {
      return axios.post(
        `/authinfo/spaces/${spaceId}/useraccess/`,
        {
          user_id,
        },
        config
      );
    },
    setCurrentSpace(
      { spaceId }: { spaceId: string | number },
      config: AxiosRequestConfig<any> | undefined
    ) {
      return axios.post(`/changecurrentspace/${spaceId}/`, config);
    },
    deleteSpaceMember(
      { spaceId, memberId }: { spaceId: string; memberId: string },
      config: AxiosRequestConfig<any> | undefined
    ) {
      return axios.delete(
        `/authinfo/spaces/${spaceId}/useraccess/${memberId}/`,
        config
      );
    },
    fetchSpaceMembers(
      { spaceId }: { spaceId: string },
      config: AxiosRequestConfig<any> | undefined
    ) {
      return axios.get(`/authinfo/spaces/${spaceId}/useraccess/`, config);
    },
    fetchAssessments(
      { spaceId }: { spaceId: string | undefined },
      config: AxiosRequestConfig<any> | undefined
    ) {
      return axios.get(`/authinfo/spaces/${spaceId}/assessments/`, config);
    },
    createAssessment(
      { data }: { data: any },
      config: AxiosRequestConfig<any> | undefined
    ) {
      return axios.post(`/assessment/projects/`, data, config);
    },
    loadAssessment(
      { rowId }: { rowId: any },
      config: AxiosRequestConfig<any> | undefined
    ) {
      return axios.get(`/assessment/projects/${rowId}/`, config);
    },
    updateAssessment(
      { rowId, data }: { rowId: any; data: any },
      config: AxiosRequestConfig<any> | undefined
    ) {
      return axios.put(`/assessment/projects/${rowId}/`, data, config);
    },
    deleteAssessment(
      { id }: { id: any },
      config: AxiosRequestConfig<any> | undefined
    ) {
      return axios.delete(`/assessment/projects/${id}/`, config);
    },
    fetchAssessment(
      { assessmentId }: { assessmentId: string },
      config: AxiosRequestConfig<any> | undefined
    ) {
      return axios.get(`/assessment/reports/${assessmentId}/`, config);
    },
    fetchSubject(
      { subjectId, resultId }: { subjectId: string; resultId: string },
      config: AxiosRequestConfig<any> | undefined = {}
    ) {
      return axios.get(`/assessment/reportsubject/`, {
        ...config,
        params: {
          assessment_subject_pk: subjectId,
          assessment_result_pk: resultId,
          ...(config.params || {}),
        },
      });
    },
    fetchQuestionnaires(
      args: { subjectId?: TId | null; assessmentId: TId },
      config: AxiosRequestConfig<any> | undefined
    ) {
      const { subjectId, assessmentId } = args || {};
      const params = subjectId ? { subjectId } : {};
      return axios.get(`/assessment/questionaries/${assessmentId}/`, {
        ...config,
        params,
      });
    },
    fetchQuestionnaire(
      { questionnaireId }: { questionnaireId: string | undefined },
      config: AxiosRequestConfig<any> | undefined
    ) {
      return axios.get(
        `/baseinfo/metriccategories/${questionnaireId}/`,
        config
      );
    },
    fetchOptions(
      { url }: { url: string },
      config: AxiosRequestConfig<any> | undefined
    ) {
      return axios.get(url?.startsWith("/") ? url : `baseinfo/${url}/`, config);
    },
    createResult(
      { subjectId = null }: { subjectId: string | undefined | null },
      config: AxiosRequestConfig<any> | undefined
    ) {
      return axios.post(
        "/assessment/results/",
        {
          assessment_project: subjectId,
        },
        config
      );
    },
    fetchResults(arg: any, config: AxiosRequestConfig<any> | undefined) {
      return axios.get(`/assessment/results/`, config);
    },
    submitAnswer(
      {
        resultId,
        questionnaireId,
        data,
      }: { resultId: TId | undefined; questionnaireId: string; data: any },
      config: AxiosRequestConfig<any> | undefined = {}
    ) {
      return axios.post(
        `/assessment/results/${resultId || ""}/metricvalues/`,
        data,
        {
          ...config,
          params: {
            metric_category_pk: questionnaireId,
            ...(config.params || {}),
          },
        }
      );
    },
    fetchMetrics(
      { questionnaireId }: { questionnaireId: string | undefined },
      config: AxiosRequestConfig<any> | undefined
    ) {
      return axios.get(
        `/baseinfo/metriccategories/${questionnaireId}/metrics/`,
        config
      );
    },
    fetchQuestionnaireResult(
      {
        resultId,
        questionnaireId,
      }: { resultId: string; questionnaireId: string },
      config: AxiosRequestConfig<any> | undefined = {}
    ) {
      return axios.get(`/assessment/results/${resultId}/metricvalues/`, {
        ...config,
        params: {
          metric_category_pk: questionnaireId,
          ...(config.params || {}),
        },
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
