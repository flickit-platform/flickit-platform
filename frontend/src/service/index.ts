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

export const createService = (signOut: () => void, accessToken: string, setAccessToken: any) => {
  axios.defaults.baseURL = BASE_URL;
  axios.defaults.withCredentials = true;
  axios.defaults.timeoutErrorMessage = t("checkNetworkConnection") as string;

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

    if (config.url === "authinfo/jwt/create/" && res.data?.access) {
      axios.defaults.headers["Authorization"] = `JWT ${res.data?.access}`;
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
    activateUser({ uid, token }: { uid: string; token: string }, config: AxiosRequestConfig<any> | undefined) {
      return axios.get(`/authinfo/activate/${uid}/${token}/`, config);
    },
    signIn(data: { email: string; password: string }, config: AxiosRequestConfig<any> | undefined) {
      return axios.post(`/authinfo/jwt/create/`, data, config);
    },
    signUp(data: { display_name: string; email: string; password: string }, config: AxiosRequestConfig<any> | undefined) {
      return axios.post(`/auth/users/`, data, config);
    },
    getSignedInUser(arg: any, config: AxiosRequestConfig<any> | undefined) {
      return axios.get(`/auth/users/me/`, config);
    },
    fetchSpaces(arg: any, config: AxiosRequestConfig<any> | undefined) {
      return axios.get(`/authinfo/spaces/`, config);
    },
    fetchSpace({ spaceId }: { spaceId: string }, config: AxiosRequestConfig<any> | undefined) {
      return axios.get(`/authinfo/spaces/${spaceId}/`, config);
    },
    deleteSpace({ spaceId }: { spaceId: string }, config: AxiosRequestConfig<any> | undefined) {
      return axios.delete(`/authinfo/spaces/${spaceId}/`, config);
    },
    createSpace(data: any, config: AxiosRequestConfig<any> | undefined) {
      return axios.post(`/authinfo/spaces/`, data, config);
    },
    updateSpace({ spaceId, data }: { spaceId: string; data: any }, config: AxiosRequestConfig<any> | undefined) {
      return axios.put(`/authinfo/spaces/${spaceId}/`, data, config);
    },
    addMemberToSpace(args: { spaceId: string; email: string | undefined }, config: AxiosRequestConfig<any> | undefined) {
      const { spaceId, email } = args || {};
      return axios.post(
        `/authinfo/spaces/adduser/${spaceId}/`,
        {
          email,
        },
        config
      );
    },
    setCurrentSpace({ spaceId }: { spaceId: string | number }, config: AxiosRequestConfig<any> | undefined) {
      return axios.post(`/authinfo/changecurrentspace/${spaceId}/`, config);
    },
    deleteSpaceMember({ spaceId, memberId }: { spaceId: string; memberId: string }, config: AxiosRequestConfig<any> | undefined) {
      return axios.delete(`/authinfo/spaces/${spaceId}/useraccess/${memberId}/`, config);
    },
    fetchSpaceMembers({ spaceId }: { spaceId: string }, config: AxiosRequestConfig<any> | undefined) {
      return axios.get(`/authinfo/spaces/${spaceId}/useraccess/`, config);
    },
    fetchAssessments({ spaceId }: { spaceId: string | undefined }, config: AxiosRequestConfig<any> | undefined) {
      return axios.get(`/authinfo/spaces/${spaceId}/assessments/`, config);
    },
    createAssessment({ data }: { data: any }, config: AxiosRequestConfig<any> | undefined) {
      return axios.post(`/assessment/projects/`, data, config);
    },
    loadAssessment({ rowId }: { rowId: any }, config: AxiosRequestConfig<any> | undefined) {
      return axios.get(`/assessment/projects/${rowId}/`, config);
    },
    updateAssessment({ rowId, data }: { rowId: any; data: any }, config: AxiosRequestConfig<any> | undefined) {
      return axios.put(`/assessment/projects/${rowId}/`, data, config);
    },
    deleteAssessment({ id }: { id: any }, config: AxiosRequestConfig<any> | undefined) {
      return axios.delete(`/assessment/projects/${id}/`, config);
    },
    fetchAssessment({ assessmentId }: { assessmentId: string }, config: AxiosRequestConfig<any> | undefined) {
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
    fetchQuestionnaires(args: { subject_pk?: TId | null; assessmentId: TId }, config: AxiosRequestConfig<any> | undefined) {
      const { subject_pk, assessmentId } = args || {};
      const params = subject_pk ? { subject_pk: subject_pk } : {};
      return axios.get(`/assessment/questionaries/${assessmentId}/`, {
        ...config,
        params,
      });
    },
    fetchQuestionnaire(
      { questionnaireId }: { questionnaireId: string | undefined },
      config: AxiosRequestConfig<any> | undefined
    ) {
      return axios.get(`/baseinfo/metriccategories/${questionnaireId}/`, config);
    },
    fetchOptions({ url }: { url: string }, config: AxiosRequestConfig<any> | undefined) {
      return axios.get(url?.startsWith("/") ? url : `baseinfo/${url}/`, config);
    },
    createResult({ subjectId = null }: { subjectId: string | undefined | null }, config: AxiosRequestConfig<any> | undefined) {
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
      { resultId, questionnaireId, data }: { resultId: TId | undefined; questionnaireId: string; data: any },
      config: AxiosRequestConfig<any> | undefined = {}
    ) {
      return axios.post(`/assessment/results/${resultId || ""}/metricvalues/`, data, {
        ...config,
        params: {
          metric_category_pk: questionnaireId,
          ...(config.params || {}),
        },
      });
    },
    fetchMetrics({ questionnaireId }: { questionnaireId: string | undefined }, config: AxiosRequestConfig<any> | undefined) {
      return axios.get(`/baseinfo/metriccategories/${questionnaireId}/metrics/`, config);
    },
    fetchMetricsResult(
      { questionnaireId, assessmentId }: { questionnaireId: TId; assessmentId: TId },
      config: AxiosRequestConfig<any> | undefined
    ) {
      return axios.get(`/assessment/result/${assessmentId}/${questionnaireId}/`, config);
    },
    fetchTotalProgress({ assessmentId }: { assessmentId: TId }, config: AxiosRequestConfig<any> | undefined) {
      return axios.get(`/assessment/progress/${assessmentId}/`, config);
    },
    fetchQuestionnairesPageData({ assessmentId }: { assessmentId: TId }, config: AxiosRequestConfig<any> | undefined) {
      return axios.get(`/assessment/subjects/${assessmentId}/`, config);
    },

    fetchQuestionnaireResult(
      { resultId, questionnaireId }: { resultId: string; questionnaireId: string },
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
    fetchCompare(args: any | undefined, config: AxiosRequestConfig<any> | undefined) {
      return axios.get(`/assessment/loadcompare/`, {
        ...config,
        withCredentials: true,
      });
    },
    fetchCompareResult(args: { assessmentIds: string[] }, config: AxiosRequestConfig<any> | undefined) {
      const { assessmentIds } = args || {};
      return axios.post(
        `/assessment/compare/`,
        { assessment_list_ids: assessmentIds || [] },
        {
          ...config,
          withCredentials: true,
        }
      );
    },
    saveCompareItem({ assessmentId }: { assessmentId: TId }, config: AxiosRequestConfig<any> | undefined) {
      return axios.get(`/assessment/savecompare/${assessmentId}/`, {
        ...config,
        withCredentials: true,
      });
    },
    fetchProfiles(args: any, config: AxiosRequestConfig<any> | undefined = {}) {
      const { query } = args || {};
      const params = query ? { query } : {};
      return axios.get(`/baseinfo/profiles/`, { params, ...config });
    },
    fetchCompareItemAssessments(args: any | undefined, config: AxiosRequestConfig<any> | undefined) {
      return axios.get(`/assessment/currentuserprojects/`, config);
    },
    fetchBreadcrumbInfo(
      args: { assessmentId?: TId; spaceId?: TId; questionnaireId?: TId },
      config: AxiosRequestConfig<any> | undefined
    ) {
      const { assessmentId: assessment_id, spaceId: space_id, questionnaireId: category_id } = args || {};
      return axios.post(`/assessment/breadcrumbinfo/`, { assessment_id, space_id, category_id }, config);
    },
    fetchAssessmentsInfo(args: { assessmentIds: TId[] }, config: AxiosRequestConfig<any> | undefined) {
      const { assessmentIds } = args || {};
      return axios.post(`/assessment/compareselect/`, { assessment_list_ids: assessmentIds || [] }, config);
    },
    uploadProfileDSL(file: any, config: AxiosRequestConfig<any> | undefined) {
      return axios.post(
        `/baseinfo/dsl/`,
        { dsl_file: file },
        {
          ...config,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
    },
    deleteProfileDSL(args: { id: TId }, config: AxiosRequestConfig<any> | undefined) {
      const { id } = args || {};
      return axios.delete(`/baseinfo/dsl/${id}/`, config);
    },
    createProfile(args: { data: any }, config: AxiosRequestConfig<any> | undefined) {
      const { data } = args || {};
      return axios.post(`/baseinfo/importprofile/`, data, config);
    },
    updateProfile(args: { id: TId; data: any }, config: AxiosRequestConfig<any> | undefined) {
      const { id, data } = args || {};
      return axios.put(`/baseinfo/importprofile/${id}/`, data, config);
    },
    fetchProfile(args: { id: TId }, config: AxiosRequestConfig<any> | undefined) {
      const { id } = args || {};
      return axios.get(`/baseinfo/inspectprofile/${id}/`, config);
    },
    fetchProfileTags(args: any, config: AxiosRequestConfig<any> | undefined) {
      return axios.get(`/baseinfo/tags/`, config);
    },
    deleteProfile(args: { id: TId }, config: AxiosRequestConfig<any> | undefined) {
      const { id } = args || {};
      return axios.delete(`/baseinfo/importprofile/${id}/`, config);
    },
    uploadProfilePhoto(file: any, config: AxiosRequestConfig<any> | undefined) {
      return axios.post(
        `/baseinfo/profiles/1/images/`,
        { image: file },
        {
          ...config,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
    },
    deleteProfilePhoto(args: { id: TId }, config: AxiosRequestConfig<any> | undefined) {
      return axios.delete(`/baseinfo/profiles/1/images/${args?.id}/`, config);
    },
    inspectProfile(args: { profileId: TId }, config: AxiosRequestConfig<any> | undefined) {
      const { profileId } = args || {};
      return axios.get(`/baseinfo/inspectprofile/${profileId}/`, config);
    },
    fetchUserExpertGroups(args: any, config: AxiosRequestConfig<any> | undefined) {
      const { id } = args || {};

      return axios.get(`/baseinfo/expertgroups/`, { ...(config || {}), params: { user_id: id } });
    },
    fetchUserExpertGroup(args: { id: TId }, config: AxiosRequestConfig<any> | undefined) {
      const { id } = args || {};
      return axios.get(`/baseinfo/expertgroups/${id}/`, config);
    },
    fetchExpertGroupProfiles(args: { id: TId }, config: AxiosRequestConfig<any> | undefined) {
      const { id } = args || {};
      return axios.get(`/baseinfo/expertgroup/profiles/${id}/`, config);
    },
    publishProfile(args: { id: TId }, config: AxiosRequestConfig<any> | undefined) {
      const { id } = args || {};
      return axios.get(`/baseinfo/profiles/publish/${id}/`, config);
    },
    unPublishProfile(args: { id: TId }, config: AxiosRequestConfig<any> | undefined) {
      const { id } = args || {};
      return axios.get(`/baseinfo/profiles/archive/${id}/`, config);
    },
    addMemberToExpertGroup(args: { id: TId; email: string }, config: AxiosRequestConfig<any> | undefined) {
      const { id, email } = args || {};
      return axios.post(`/baseinfo/addexpertgroup/${id}/`, { email }, config);
    },
    createExpertGroup(args: { data: any }, config: AxiosRequestConfig<any> | undefined) {
      const { data = {} } = args || {};

      return axios.post(`/baseinfo/expertgroups/`, data, {
        ...(config || {}),
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
    },
    updateExpertGroup(args: { id: TId; data: any }, config: AxiosRequestConfig<any> | undefined) {
      const { data = {}, id } = args || {};

      return axios.put(`/baseinfo/expertgroups/${id}/`, data, {
        ...(config || {}),
      });
    },
    inviteSpaceMember(args: { id: TId; data: any }, config: AxiosRequestConfig<any> | undefined) {
      const { data = {}, id } = args || {};

      return axios.post(`/authinfo/users/spaces/invite/${id}/`, data, {
        ...(config || {}),
      });
    },
    inviteExpertGroupMember(args: { id: TId; data: any }, config: AxiosRequestConfig<any> | undefined) {
      const { data = {}, id } = args || {};

      return axios.post(`/baseinfo/expertgroups/${id}/`, data, {
        ...(config || {}),
      });
    },
    confirmExpertGroupInvitation(args: { token: TId }, config: AxiosRequestConfig<any> | undefined) {
      const { token } = args || {};

      return axios.get(`/baseinfo/expertgroup/confirm/${token}/`, {
        ...(config || {}),
      });
    },
  };

  return service;
};

const fetchNewAccessToken = async (refresh: string) => {
  const { data = {} } = await axios.post("/authinfo/jwt/refresh", { refresh }, { isRefreshTokenReq: true });

  const { access } = data as any;

  return access;
};

export type TService = ReturnType<typeof createService>;
