import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import createCustomErrorFromResponseError from "@utils/createCustomErrorFromResponseError";
import { t } from "i18next";
import { ECustomErrorType, TId } from "@types";
import { BASE_URL } from "@constants";

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
  axios.defaults.timeoutErrorMessage = t("checkNetworkConnection") as string;

  const rejectResponseInterceptor = async (err: any = {}) => {
    if (err._isCustomError) {
      // if its our generated error don't do the process again and throw the error
      throw err;
    }

    const { response = {}, config = {} } = err;
    const { status } = response;
    const { isRefreshTokenReq } = config;
    const prevRequest = config;
    const Error = createCustomErrorFromResponseError(err);

    if (status) {
      // checks if the error is about authentication
      if (status === 401 && !prevRequest.sent) {
        if (isRefreshTokenReq) {
          // if the request is refresh token request (which we fire in order to refresh the access token when its expired)
          // This means refreshing token failed and refresh token is expired or not valid any more so we should sign the user out
          signOut();
          Error.action = "signOut";
          Error.type = ECustomErrorType.INVALID_TOKEN;
          throw Error;
        }

        prevRequest.sent = true;

        const lRefreshToken = localStorage.getItem("refreshToken");
        const refreshToken = lRefreshToken && JSON.parse(lRefreshToken);

        if (refreshToken) {
          // checks if any refresh token is available (we save the refresh token inside local storage which is not safe!!!)
          // remember that we are on the auth failed request this might be because of access token expiration so we try the refresh it using our refresh token
          const newAccessToken = await fetchNewAccessToken(refreshToken);
          if (newAccessToken) {
            setAccessToken(newAccessToken);
            axios.defaults.headers["Authorization"] = `JWT ${newAccessToken}`;
            prevRequest.headers["Authorization"] = `JWT ${newAccessToken}`;
            // if we got the new access token we set it then we try to call the last request again which failed because of the access token expiration with new token
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
    const { config } = res;
    // We intercept the response and if the url is jwt/create we set the access token received in response on headers
    if (config?.url === "authinfo/jwt/create/" && res.data?.access) {
      axios.defaults.headers["Authorization"] = `JWT ${res.data?.access}`;
    }
    return res;
  };

  axios.interceptors.request.use((req: AxiosRequestConfig = {}) => {
    // We check the request headers and if there is no header and we have the access token we set it on the request
    if (!req.headers?.["Authorization"] && accessToken) {
      (req as any).headers["Authorization"] = `JWT ${accessToken}`;
    }
    return req as any;
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
      return axios.get(`/authinfo/activate/${uid}/${token}/`, config);
    },
    signIn(
      data: { email: string; password: string },
      config: AxiosRequestConfig<any> | undefined
    ) {
      return axios.post(`/authinfo/jwt/create/`, data, config);
    },
    signUp(
      data: { display_name: string; email: string; password: string },
      config: AxiosRequestConfig<any> | undefined
    ) {
      return axios.post(`/authinfo/users/`, data, config);
    },
    getSignedInUser(arg: any, config: AxiosRequestConfig<any> | undefined) {
      return axios.get(`/authinfo/users/me/`, config);
    },
    updateUserInfo(args: any, config: AxiosRequestConfig<any> | undefined) {
      const { data, id } = args || {};
      return axios.put(`/authinfo/users/${id}/`, data, {
        ...config,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
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
    addMemberToSpace(
      args: { spaceId: string; email: string | undefined },
      config: AxiosRequestConfig<any> | undefined
    ) {
      const { spaceId, email } = args || {};
      return axios.post(
        `/authinfo/spaces/adduser/${spaceId}/`,
        {
          email,
        },
        config
      );
    },
    setCurrentSpace(
      { spaceId }: { spaceId: string | number },
      config: AxiosRequestConfig<any> | undefined
    ) {
      return axios.post(`/authinfo/changecurrentspace/${spaceId}/`, config);
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
      args: { subject_pk?: TId | null; assessmentId: TId },
      config: AxiosRequestConfig<any> | undefined
    ) {
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
      return axios.get(`/baseinfo/questionnaires/${questionnaireId}/`, config);
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
            questionnaire_pk: questionnaireId,
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
        `/baseinfo/questionnaires/${questionnaireId}/metrics/`,
        config
      );
    },
    fetchMetricsResult(
      {
        questionnaireId,
        assessmentId,
      }: { questionnaireId: TId; assessmentId: TId },
      config: AxiosRequestConfig<any> | undefined
    ) {
      return axios.get(
        `/assessment/result/${assessmentId}/${questionnaireId}/`,
        config
      );
    },
    fetchTotalProgress(
      { assessmentId }: { assessmentId: TId },
      config: AxiosRequestConfig<any> | undefined
    ) {
      return axios.get(`/assessment/progress/${assessmentId}/`, config);
    },
    fetchQuestionnairesPageData(
      { assessmentId }: { assessmentId: TId },
      config: AxiosRequestConfig<any> | undefined
    ) {
      return axios.get(`/assessment/subjects/${assessmentId}/`, config);
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
          questionnaire_pk: questionnaireId,
          ...(config.params || {}),
        },
      });
    },
    fetchCompare(
      args: any | undefined,
      config: AxiosRequestConfig<any> | undefined
    ) {
      return axios.get(`/assessment/loadcompare/`, {
        ...config,
        withCredentials: true,
      });
    },
    fetchCompareResult(
      args: { assessmentIds: string[] },
      config: AxiosRequestConfig<any> | undefined
    ) {
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
    saveCompareItem(
      { assessmentId }: { assessmentId: TId },
      config: AxiosRequestConfig<any> | undefined
    ) {
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
    fetchProfilesOptions(
      args: any,
      config: AxiosRequestConfig<any> | undefined = {}
    ) {
      const { query } = args || {};
      const params = query ? { query } : {};
      return axios.get(`/baseinfo/profiles/options/select/`, {
        params,
        ...config,
      });
    },
    fetchCompareItemAssessments(
      args: any | undefined,
      config: AxiosRequestConfig<any> | undefined
    ) {
      return axios.get(`/assessment/currentuserprojects/`, config);
    },
    fetchBreadcrumbInfo(
      args: { assessmentId?: TId; spaceId?: TId; questionnaireId?: TId },
      config: AxiosRequestConfig<any> | undefined
    ) {
      const {
        assessmentId: assessment_id,
        spaceId: space_id,
        questionnaireId: questionnaire_id,
      } = args || {};
      return axios.post(
        `/assessment/breadcrumbinfo/`,
        { assessment_id, space_id, questionnaire_id },
        config
      );
    },
    fetchAssessmentsInfo(
      args: { assessmentIds: TId[] },
      config: AxiosRequestConfig<any> | undefined
    ) {
      const { assessmentIds } = args || {};
      return axios.post(
        `/assessment/compareselect/`,
        { assessment_list_ids: assessmentIds || [] },
        config
      );
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
    deleteProfileDSL(
      args: { id: TId },
      config: AxiosRequestConfig<any> | undefined
    ) {
      const { id } = args || {};
      return axios.delete(`/baseinfo/dsl/${id}/`, config);
    },
    createProfile(
      args: { data: any },
      config: AxiosRequestConfig<any> | undefined
    ) {
      const { data } = args || {};
      return axios.post(`/baseinfo/importprofile/`, data, config);
    },
    updateProfile(
      args: { profileId?: TId; expertGroupId?: TId; data: any },
      config: AxiosRequestConfig<any> | undefined
    ) {
      const { expertGroupId, profileId, data } = args || {};
      return axios.put(
        `/baseinfo/expertgroup/profiles/${expertGroupId}/${profileId}/`,
        data,
        config
      );
    },
    fetchProfile(
      args: { id: TId },
      config: AxiosRequestConfig<any> | undefined
    ) {
      const { id } = args || {};
      return axios.get(`/baseinfo/profiles/${id}/`, config);
    },
    fetchProfileTags(args: any, config: AxiosRequestConfig<any> | undefined) {
      return axios.get(`/baseinfo/tags/`, config);
    },
    deleteProfile(
      args: { id: TId },
      config: AxiosRequestConfig<any> | undefined
    ) {
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
    deleteProfilePhoto(
      args: { id: TId },
      config: AxiosRequestConfig<any> | undefined
    ) {
      return axios.delete(`/baseinfo/profiles/1/images/${args?.id}/`, config);
    },
    inspectProfile(
      args: { profileId: TId },
      config: AxiosRequestConfig<any> | undefined
    ) {
      const { profileId } = args || {};
      return axios.get(`/baseinfo/inspectprofile/${profileId}/`, config);
    },
    fetchUserExpertGroups(
      args: any,
      config: AxiosRequestConfig<any> | undefined
    ) {
      const { id } = args || {};

      return axios.get(`/baseinfo/expertgroups/`, {
        ...(config || {}),
        params: { user_id: id },
      });
    },
    fetchUserExpertGroup(
      args: { id: TId },
      config: AxiosRequestConfig<any> | undefined
    ) {
      const { id } = args || {};
      return axios.get(`/baseinfo/expertgroups/${id}/`, config);
    },
    deleteExpertGroupMember(
      args: { id: TId; userId: TId },
      config: AxiosRequestConfig<any> | undefined
    ) {
      const { id, userId } = args || {};
      return axios.delete(
        `/baseinfo/expertgroups/${id}/expertgroupaccess/${userId}/`,
        config
      );
    },
    fetchExpertGroupProfiles(
      args: { id: TId },
      config: AxiosRequestConfig<any> | undefined
    ) {
      const { id } = args || {};
      return axios.get(`/baseinfo/expertgroup/profiles/${id}/`, config);
    },
    publishProfile(
      args: { id: TId },
      config: AxiosRequestConfig<any> | undefined
    ) {
      const { id } = args || {};
      return axios.get(`/baseinfo/profiles/publish/${id}/`, config);
    },
    unPublishProfile(
      args: { id: TId },
      config: AxiosRequestConfig<any> | undefined
    ) {
      const { id } = args || {};
      return axios.post(`/baseinfo/profiles/archive/${id}/`, config);
    },
    addMemberToExpertGroup(
      args: { id: TId; email: string },
      config: AxiosRequestConfig<any> | undefined
    ) {
      const { id, email } = args || {};
      return axios.post(`/baseinfo/addexpertgroup/${id}/`, { email }, config);
    },
    createExpertGroup(
      args: { data: any },
      config: AxiosRequestConfig<any> | undefined
    ) {
      const { data = {} } = args || {};

      return axios.post(`/baseinfo/expertgroups/`, data, {
        ...(config || {}),
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
    },
    updateExpertGroup(
      args: { id: TId; data: any },
      config: AxiosRequestConfig<any> | undefined
    ) {
      const { data = {}, id } = args || {};

      return axios.put(`/baseinfo/expertgroups/${id}/`, data, {
        ...(config || {}),
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
    },
    inviteSpaceMember(
      args: { id: TId; data: any },
      config: AxiosRequestConfig<any> | undefined
    ) {
      const { data = {}, id } = args || {};

      return axios.post(`/authinfo/users/spaces/invite/${id}/`, data, {
        ...(config || {}),
      });
    },
    inviteExpertGroupMember(
      args: { id: TId; data: any },
      config: AxiosRequestConfig<any> | undefined
    ) {
      const { data = {}, id } = args || {};

      return axios.post(`/baseinfo/expertgroups/${id}/`, data, {
        ...(config || {}),
      });
    },
    fetchExpertGroupMembers(
      args: { id: TId },
      config: AxiosRequestConfig<any> | undefined
    ) {
      const { id } = args || {};

      return axios.get(`/baseinfo/expertgroups/${id}/expertgroupaccess/`, {
        ...(config || {}),
      });
    },
    confirmExpertGroupInvitation(
      args: { token: TId },
      config: AxiosRequestConfig<any> | undefined
    ) {
      const { token } = args || {};

      return axios.post(`/baseinfo/expertgroup/confirm/${token}/`, {
        ...(config || {}),
      });
    },
    likeProfile(
      args: { id: TId },
      config: AxiosRequestConfig<any> | undefined
    ) {
      const { id } = args || {};

      return axios.post(`/baseinfo/profiles/like/${id}/`, {
        ...(config || {}),
      });
    },
    fetchImage(
      args: { url: string },
      config: AxiosRequestConfig<any> | undefined
    ) {
      const { url } = args || {};

      return axios.get(url, {
        ...(config || {}),
        responseType: "blob",
      });
    },
    addEvidence(
      args: { description: string; metricId:TId,assessmentId: TId },
      config: AxiosRequestConfig<any> | undefined
    ) {
      const { description, metricId, assessmentId } = args || {};
      return axios.post(`/assessment/addevidence/${metricId}/${assessmentId}`, {
        description,
      });
    },
    deleteEvidence(
      args: { pk: TId },
      config: AxiosRequestConfig<any> | undefined
    ) {
      const { pk } = args || {};
      return axios.delete(`/assessment/deleteevidence/${pk}/`, config);
    },
    updateEvidence(
      args: { description: string; pk: TId },
      config: AxiosRequestConfig<any> | undefined
    ) {
      const { description, pk } = args || {};
      return axios.put(`/assessment/updateevidence/${pk}/`, {
        description,
      });
    },
    fetchEvidences(
      args: { metricId:TId,assessmentId: TId },
      config: AxiosRequestConfig<any> | undefined
    ) {
      const { metricId, assessmentId} = args || {};

      return axios.get(`/assessment/evidences/${metricId}/${assessmentId}/`, {
        ...(config || {}),
      });
    },
  };

  return service;
};

/**
 * fetches new access token
 */
const fetchNewAccessToken = async (refresh: string) => {
  const { data = {} } = await axios.post(
    "/authinfo/jwt/refresh",
    { refresh },
    { isRefreshTokenReq: true }
  );

  const { access } = data as any;

  return access;
};

export type TService = ReturnType<typeof createService>;
