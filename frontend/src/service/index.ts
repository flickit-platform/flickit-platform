import axios, { AxiosRequestConfig } from "axios";
import { t } from "i18next";
import { TId } from "@types";
import { BASE_URL } from "@constants";
import keycloakService from "@/service//keycloakService";
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

  axios.interceptors.request.use(async (req: any) => {
    const accessToken = keycloakService.getToken();
    (req as any).headers["Authorization"] = `Bearer ${accessToken}`;
    localStorage.setItem("accessToken", JSON.stringify(accessToken));
    if (keycloakService._kc.isTokenExpired(5) && accessToken) {
      try {
        await keycloakService._kc.updateToken(-1);
        const newAccessToken = keycloakService.getToken();
        (req as any).headers["Authorization"] = `Bearer ${newAccessToken}`;
        localStorage.setItem("accessToken", JSON.stringify(newAccessToken));
      } catch (error) {
        console.error("Failed to update token:", error);
        keycloakService.doLogin();
      }
    }
    if (!req.headers?.["Authorization"] && accessToken) {
      (req as any).headers["Authorization"] = `Bearer ${accessToken}`;
    }

    return req;
  });

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
      return axios.get(`/api/v1/users/me/`, config);
    },
    getUserProfile(arg: any, config: AxiosRequestConfig<any> | undefined) {
      return axios.get(`/api/v1/user-profile/`, config);
    },
    updateUserInfo(args: any, config: AxiosRequestConfig<any> | undefined) {
      const { data, id } = args ?? {};
      return axios.put(`/api/v1/user-profile/`, data, {
        ...config,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
    },
    fetchSpaces(
      args: { page: number; size: number },
      config: AxiosRequestConfig<any> | undefined
    ) {
      const { page = 1, size = 10 } = args ?? {};
      return axios.get(`/api/v1/spaces/`, {
        ...(config ?? {}),
        params: { size, page: page - 1 },
      });
    },
    fetchSpace(
      { spaceId }: { spaceId: string },
      config: AxiosRequestConfig<any> | undefined
    ) {
      return axios.get(`/api/v1/spaces/${spaceId}/`, config);
    },
    seenSpaceList(
      { spaceId }: { spaceId: TId },
      config: AxiosRequestConfig<any> | undefined
    ) {
      return axios.put(`/api/v1/spaces/${spaceId}/seen/`, config);
    },
    deleteSpace(
      { spaceId }: { spaceId: string },
      config: AxiosRequestConfig<any> | undefined
    ) {
      return axios.delete(`/api/v1/spaces/${spaceId}/`, config);
    },
    createSpace(data: any, config: AxiosRequestConfig<any> | undefined) {
      return axios.post(`/api/v1/spaces/`, data, config);
    },
    updateSpace(
      { spaceId, data }: { spaceId: string; data: any },
      config: AxiosRequestConfig<any> | undefined
    ) {
      return axios.put(`/api/v1/spaces/${spaceId}/`, data, config);
    },
    addMemberToSpace(
      args: { spaceId: string; email: string | undefined },
      config: AxiosRequestConfig<any> | undefined
    ) {
      const { spaceId, email } = args ?? {};
      return axios.post(
        `/api/v1/spaces/${spaceId}/members/`,
        {
          email,
        },
        config
      );
    },
    inviteMemberToAssessment(
      args: { assessmentId: any; email: any; roleId: any },
      config: AxiosRequestConfig<any> | undefined
    ) {
      const { assessmentId, email, roleId } = args ?? {};

      return axios.post(
        `/api/v1/assessments/${assessmentId}/invite/`,
        { email, roleId },
        {
          ...(config ?? {}),
        }
      );
    },
    fetchAssessmentMembersInvitees(
      { assessmentId }: { assessmentId: string },
      config: AxiosRequestConfig<any> | undefined
    ) {
      return axios.get(`/api/v1/assessments/${assessmentId}/invitees/`, config);
    },
    loadUserByEmail(
      args: { email: string },
      config: AxiosRequestConfig<any> | undefined
    ) {
      const { email } = args ?? {};
      return axios.get(`/api/v1/users/email/${email}/`, config);
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
        `/api/v1/spaces/${spaceId}/members/${memberId}/`,
        config
      );
    },
    deleteSpaceInvite(
      { inviteId }: { inviteId: string },
      config: AxiosRequestConfig<any> | undefined
    ) {
      return axios.delete(`/api/v1/space-invitations/${inviteId}/`, config);
    },
    fetchSpaceMembers(
      { spaceId }: { spaceId: string },
      config: AxiosRequestConfig<any> | undefined
    ) {
      return axios.get(`/api/v1/spaces/${spaceId}/members/`, config);
    },
    fetchSpaceMembersInvitees(
      { spaceId }: { spaceId: string },
      config: AxiosRequestConfig<any> | undefined
    ) {
      return axios.get(`/api/v1/spaces/${spaceId}/invitees/`, config);
    },
    fetchPathInfo(
      {
        assessmentId,
        spaceId,
        questionnaireId,
      }: { assessmentId?: string; spaceId?: string; questionnaireId?: string },
      config: AxiosRequestConfig<any> | undefined
    ) {
      return axios.get(
        `/api/v1/path-info?${
          assessmentId ? `assessment_id=${assessmentId}` : ""
        }${spaceId ? `&&space_id=${spaceId}` : ""}${
          questionnaireId ? `&&questionnaire_id=${questionnaireId}` : ""
        }`,
        {
          ...(config ?? {}),
        }
      );
    },
    fetchAssessments(
      {
        spaceId,
        assessmentKitId,
        size,
        page,
      }: {
        spaceId: string | undefined;
        assessmentKitId?: TId;
        size: number;
        page: number;
      },
      config: AxiosRequestConfig<any> | undefined
    ) {
      return axios.get(`/api/v1/space-assessments/`, {
        ...(config ?? {}),
        params: {
          page: page,
          size: size,
          spaceId: spaceId,
          ...(assessmentKitId && { assessment_kit_id: assessmentKitId }),
        },
      });
    },
    AssessmentsLoad(
      { assessmentId }: { assessmentId?: TId },
      config: AxiosRequestConfig<any> | undefined
    ) {
      return axios.get(`/api/v1/assessments/${assessmentId}`, {
        ...(config ?? {}),
      });
    },
    createAssessment(
      { data }: { data: any },
      config: AxiosRequestConfig<any> | undefined
    ) {
      return axios.post(`/api/v2/assessments/`, data, config);
    },
    fetchAssessmentsRoles(
      args: any,
      config: AxiosRequestConfig<any> | undefined
    ) {
      return axios.get(`/api/v1/assessment-user-roles/`, config);
    },
    fetchAssessmentsUserListRoles(
      { assessmentId }: { assessmentId: string },
      config: AxiosRequestConfig<any> | undefined
    ) {
      return axios.get(`/api/v1/assessments/${assessmentId}/users`, config);
    },
    addRoleMember(
      args: { assessmentId: string; userId: string; roleId: number },
      config: AxiosRequestConfig<any> | undefined
    ) {
      const { assessmentId } = args ?? {};
      return axios.post(
        `/api/v1/assessments/${assessmentId}/assessment-user-roles/`,
        args,
        config
      );
    },
    deleteUserRole(
      {
        assessmentId,
        args: userId,
      }: { assessmentId: string; args: string } | any,
      config: AxiosRequestConfig<any> | undefined
    ) {
      return axios.delete(
        `/api/v1/assessments/${assessmentId}/assessment-user-roles/${userId}/
`,
        config
      );
    },
    editUserRole(
      args: { assessmentId: string; userId: string; roleId: number } | any,
      config: AxiosRequestConfig<any> | undefined
    ) {
      const { assessmentId, userId } = args;
      return axios.put(
        `/api/v1/assessments/${assessmentId}/assessment-user-roles/${userId}/`,
        args,
        config
      );
    },
    loadAssessment(
      { rowId }: { rowId: any },
      config: AxiosRequestConfig<any> | undefined
    ) {
      return axios.get(`/assessment/projects/${rowId}/`, config);
    },
    updateAssessment(
      { id, data }: { id: any; data: any },
      config: AxiosRequestConfig<any> | undefined
    ) {
      return axios.put(`/api/v2/assessments/${id}/`, data, config);
    },
    deleteAssessment(
      { id }: { id: any },
      config: AxiosRequestConfig<any> | undefined
    ) {
      return axios.delete(`/api/v1/assessments/${id}/`, config);
    },
    comparessessments(
      { data }: { data: any },
      config: AxiosRequestConfig<any> | undefined
    ) {
      return axios.post(`/api/v1/assessments-compare/${data}`, {
        ...(config ?? {}),
      });
    },
    fetchExportReport(
      { assessmentId, attributeId }: { assessmentId: string; attributeId: TId },
      config: AxiosRequestConfig<any> | undefined
    ) {
      return axios.post(
        `/api/v1/assessments/${assessmentId}/export-report/attributes/${attributeId}/`,
        {
          ...(config ?? {}),
        }
      );
    },
    fetchAIReport(
      {
        assessmentId,
        attributeId,
        data,
      }: { assessmentId: string; attributeId: TId; data: any },
      config: AxiosRequestConfig<any> | undefined
    ) {
      return axios.post(
        `/api/v1/assessments/${assessmentId}/ai-report/attributes/${attributeId}/`,
        data,
        config
      );
    },
    fetchAssessment(
      { assessmentId }: { assessmentId: string },
      config: AxiosRequestConfig<any> | undefined
    ) {
      return axios.get(`/api/v2/assessments/${assessmentId}/report/`, config);
    },
    fetchSubject(
      { subjectId, assessmentId }: { subjectId: string; assessmentId: string },
      config: AxiosRequestConfig<any> | undefined = {}
    ) {
      return axios.get(
        `/api/v2/assessments/${assessmentId}/report/subjects/${subjectId}/`,
        config
      );
    },
    createAdvice(
      {
        assessmentId,
        attributeLevelTargets,
      }: { assessmentId: string; attributeLevelTargets: any },
      config: AxiosRequestConfig<any> | undefined = {}
    ) {
      return axios.post(
        `/api/v1/assessments/${assessmentId}/advice/`,
        {
          attributeLevelTargets,
        },
        config
      );
    },
    fetchSubjectProgress(
      { subjectId, assessmentId }: { subjectId: string; assessmentId: string },
      config: AxiosRequestConfig<any> | undefined = {}
    ) {
      return axios.get(
        `/api/v1/assessments/${assessmentId}/subjects/${subjectId}/progress/`,
        config
      );
    },

    fetchQuestionnaires(
      args: { assessmentId: TId },
      config: AxiosRequestConfig<any> | undefined
    ) {
      const { assessmentId } = args ?? {};
      return axios.get(`/api/v2/assessments/${assessmentId}/questionnaires/`, {
        ...config,
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
      { assessmentId, data }: { assessmentId: TId | undefined; data: any },
      config: AxiosRequestConfig<any> | undefined = {}
    ) {
      return axios.put(
        `/api/v2/assessments/${assessmentId ?? ""}/answer-question/`,
        data,
        { ...config }
      );
    },
    fetchQuestions(
      { questionnaireId }: { questionnaireId: string | undefined },
      config: AxiosRequestConfig<any> | undefined
    ) {
      return axios.get(
        `/baseinfo/questionnaires/${questionnaireId}/questions/`,
        config
      );
    },
    fetchQuestionsResult(
      {
        questionnaireId,
        assessmentId,
        page,
        size,
      }: {
        questionnaireId: TId;
        assessmentId: TId;
        size: number;
        page: number;
      },
      config: AxiosRequestConfig<any> | undefined
    ) {
      return axios.get(
        `/api/v1/assessments/${assessmentId}/questionnaires/${questionnaireId}/`,
        {
          ...(config ?? {}),
          params: {
            page: page,
            size: size,
          },
        }
      );
    },
    fetchAnswersHistory(
      {
        questionId,
        assessmentId,
        page,
        size,
      }: {
        questionId: TId;
        assessmentId: TId;
        size: number;
        page: number;
      },
      config: AxiosRequestConfig<any> | undefined
    ) {
      return axios.get(
        `/api/v1/assessments/${assessmentId}/questions/${questionId}/answer-history/`,
        {
          ...(config ?? {}),
          params: {
            page: page,
            size: size,
          },
        }
      );
    },
    fetchTotalProgress(
      { assessmentId }: { assessmentId: TId },
      config: AxiosRequestConfig<any> | undefined
    ) {
      return axios.get(`/assessment/progress/${assessmentId}/`, config);
    },
    fetchAssessmentTotalProgress(
      { assessmentId }: { assessmentId: TId },
      config: AxiosRequestConfig<any> | undefined
    ) {
      return axios.get(`/api/v2/assessments/${assessmentId}/progress/`, config);
    },
    calculateMaturityLevel(
      { assessmentId }: { assessmentId: TId },
      config: AxiosRequestConfig<any> | undefined
    ) {
      return axios.post(
        `/api/v1/assessments/${assessmentId}/calculate/`,
        config
      );
    },
    calculateConfidenceLevel(
      { assessmentId }: { assessmentId: TId },
      config: AxiosRequestConfig<any> | undefined
    ) {
      return axios.post(
        `/api/v1/assessments/${assessmentId}/calculate-confidence/`,
        config
      );
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
      return axios.get(`/assessment/results/${resultId}/questionvalues/`, {
        ...config,
        params: {
          questionnaire_pk: questionnaireId,
          ...(config.params ?? {}),
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
      const { assessmentIds } = args ?? {};
      return axios.post(
        `/assessment/compare/`,
        { assessment_list_ids: assessmentIds ?? [] },
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
    fetchAssessmentKits(
      args: any,
      config: AxiosRequestConfig<any> | undefined = {}
    ) {
      const { query, isPrivate } = args ?? {};
      const params = query ? { query } : { isPrivate };
      return axios.get(`/api/v2/assessment-kits/`, { params, ...config });
    },
    fetchAssessmentKitsOptions(
      args: any,
      config: AxiosRequestConfig<any> | undefined = {}
    ) {
      const { query } = args ?? {};
      const params = query ? { query } : {};
      return axios.get(`/api/v1/assessment-kits/options/search/`, {
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
      } = args ?? {};
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
      const { assessmentIds } = args ?? {};
      return axios.post(
        `/assessment/compareselect/`,
        { assessment_list_ids: assessmentIds ?? [] },
        config
      );
    },
    uploadAssessmentKitDSL(
      file: any,
      config: AxiosRequestConfig<any> | undefined
    ) {
      return axios.post(
        `/baseinfo/dsl/`,
        { dsl_file: file?.file },
        {
          ...config,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
    },
    uploadAssessmentKitDSLFile(
      args: { file: any; expertGroupId?: TId },
      config: AxiosRequestConfig<any> | undefined
    ) {
      const { file, expertGroupId } = args ?? {};
      return axios.post(
        `/api/v1/assessment-kits/upload-dsl/`,
        { dslFile: file, expertGroupId: expertGroupId },
        {
          ...config,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
    },
    deleteAssessmentKitDSL(
      args: { id: TId },
      config: AxiosRequestConfig<any> | undefined
    ) {
      const { id } = args ?? {};
      return axios.delete(`/baseinfo/dsl/${id}/`, config);
    },
    createAssessmentKit(
      args: { data: any },
      config: AxiosRequestConfig<any> | undefined
    ) {
      const { data } = args ?? {};
      return axios.post(`/api/v1/assessment-kits/create-by-dsl/`, data, config);
    },
    updateAssessmentKit(
      args: { assessmentKitId?: TId; data: any },
      config: AxiosRequestConfig<any> | undefined
    ) {
      const { assessmentKitId, data } = args ?? {};
      return axios.post(
        `/baseinfo/assessmentkits/update/${assessmentKitId}/`,
        data,
        config
      );
    },
    updateAssessmentKitDSL(
      args: { assessmentKitId?: TId; data: any },
      config: AxiosRequestConfig<any> | undefined
    ) {
      const { assessmentKitId, data } = args ?? {};
      return axios.put(
        `/api/v1/assessment-kits/${assessmentKitId}/update-by-dsl/`,
        data,
        config
      );
    },
    fetchAssessmentKitdata(
      args: { assessmentKitId: TId },
      config: AxiosRequestConfig<any> | undefined
    ) {
      const { assessmentKitId } = args ?? {};
      return axios.get(
        `/baseinfo/assessmentkits/get/${assessmentKitId}/`,
        config
      );
    },
    fetchAssessmentKit(
      args: { id: TId },
      config: AxiosRequestConfig<any> | undefined
    ) {
      const { id } = args ?? {};
      return axios.get(`/api/v1/assessment-kits/${id}/`, config);
    },
    fetchAffectedQuestionsOnAttribute(
      args: { assessmentId: TId; attributeId: TId; levelId: TId },
      config: AxiosRequestConfig<any> | undefined
    ) {
      const { assessmentId, attributeId, levelId } = args ?? {};
      return axios.get(
        `/api/v1/assessments/${assessmentId}/report/attributes/${attributeId}/`,
        {
          ...(config ?? {}),
          params: {
            maturityLevelId: levelId,
          },
        }
      );
    },
    fetchRelatedEvidences(
      args: { assessmentId: TId; attributeId: TId; type: TId },
      config: AxiosRequestConfig<any> | undefined
    ) {
      const { assessmentId, attributeId, type } = args ?? {};
      return axios.get(
        `/api/v1/assessments/${assessmentId}/attributes/${attributeId}/evidences`,
        {
          ...(config ?? {}),
          params: {
            type,
          },
        }
      );
    },
    assessmentKitUsersList(
      args: { assessmentKitId: TId },
      config: AxiosRequestConfig<any> | undefined
    ) {
      const { assessmentKitId } = args ?? {};
      return axios.get(
        `/api/v1/assessment-kits/${assessmentKitId}/users/`,
        config
      );
    },
    assessmentKitMinInfo(
      args: { assessmentKitId: TId },
      config: AxiosRequestConfig<any> | undefined
    ) {
      const { assessmentKitId } = args ?? {};
      return axios.get(
        `/api/v1/assessment-kits/${assessmentKitId}/min-info/`,
        config
      );
    },
    fetchAssessmentKitUsersList(
      args: { id: TId },
      config: AxiosRequestConfig<any> | undefined
    ) {
      const { id } = args ?? {};
      return axios.get(`/api/v1/assessment-kits/${id}/users/`, config);
    },
    fetchAssessmentKitInfo(
      args: { assessmentKitId: TId },
      config: AxiosRequestConfig<any> | undefined
    ) {
      const { assessmentKitId } = args ?? {};
      return axios.get(
        `/api/v2/assessment-kits/${assessmentKitId}/info/`,
        config
      );
    },
    fetchAssessmentKitStats(
      args: { assessmentKitId: TId },
      config: AxiosRequestConfig<any> | undefined
    ) {
      const { assessmentKitId } = args ?? {};
      return axios.get(
        `/api/v2/assessment-kits/${assessmentKitId}/stats/`,
        config
      );
    },
    updateAssessmentKitStats(
      args: { assessmentKitId: TId; data: any },
      config: AxiosRequestConfig<any> | undefined
    ) {
      const { assessmentKitId, data } = args ?? {};
      return axios.patch(
        `/api/v2/assessment-kits/${assessmentKitId}/`,
        data,
        config
      );
    },
    fetchAssessmentKitTags(
      args: any,
      config: AxiosRequestConfig<any> | undefined
    ) {
      return axios.get(`/api/v1/assessment-kit-tags/`, config);
    },
    deleteAssessmentKit(
      args: { id: TId },
      config: AxiosRequestConfig<any> | undefined
    ) {
      const { id } = args ?? {};
      return axios.delete(`/api/v2/assessment-kits/${id}/`, config);
    },
    uploadAssessmentKitPhoto(
      file: any,
      config: AxiosRequestConfig<any> | undefined
    ) {
      return axios.post(
        `/baseinfo/assessmentkits/1/images/`,
        { image: file },
        {
          ...config,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
    },
    deleteAssessmentKitPhoto(
      args: { id: TId },
      config: AxiosRequestConfig<any> | undefined
    ) {
      return axios.delete(
        `/baseinfo/assessmentkits/1/images/${args?.id}/`,
        config
      );
    },
    inspectAssessmentKit(
      args: { assessmentKitId: TId },
      config: AxiosRequestConfig<any> | undefined
    ) {
      const { assessmentKitId } = args ?? {};
      return axios.get(
        `/baseinfo/inspectassessmentkit/${assessmentKitId}/`,
        config
      );
    },
    fetchTenantInfo(config: AxiosRequestConfig<any> | undefined) {
      return axios.get(`/api/v1/tenant/info/`, {
        ...(config ?? {}),
      });
    },
    fetchTenantLogo(config: AxiosRequestConfig<any> | undefined) {
      return axios.get(`/api/v1/tenant/logo/`, {
        ...(config ?? {}),
      });
    },
    fetchUserExpertGroups(
      args: any,
      config: AxiosRequestConfig<any> | undefined
    ) {
      const { id } = args ?? {};

      return axios.get(`/baseinfo/expertgroups/`, {
        ...(config ?? {}),
        params: { user_id: id },
      });
    },
    fetchExpertGroups(
      args: { page: number; size: number },
      config: AxiosRequestConfig<any> | undefined
    ) {
      const { page = 1, size = 20 } = args ?? {};

      return axios.get(`/api/v1/expert-groups/`, {
        ...(config ?? {}),
        params: { size: size, page: page - 1 },
      });
    },
    fetchUserExpertGroup(
      args: { id: TId },
      config: AxiosRequestConfig<any> | undefined
    ) {
      const { id } = args ?? {};
      return axios.get(`/api/v1/expert-groups/${id}/`, config);
    },
    deleteExpertGroupMember(
      args: { id: TId; userId: TId },
      config: AxiosRequestConfig<any> | undefined
    ) {
      const { id, userId } = args ?? {};
      return axios.delete(
        `/api/v1/expert-groups/${id}/members/${userId}/`,
        config
      );
    },
    fetchExpertGroupAssessmentKits(
      args: { id: TId },
      config: AxiosRequestConfig<any> | undefined
    ) {
      const { id } = args ?? {};
      return axios.get(`/api/v1/expert-groups/${id}/assessment-kits/`, config);
    },
    fetchExpertGroupUnpublishedAssessmentKits(
      args: { id: TId },
      config: AxiosRequestConfig<any> | undefined
    ) {
      const { id } = args ?? {};
      return axios.get(
        `/baseinfo/expertgroup/unpublishedassessmentkits/${id}/`,
        config
      );
    },
    publishAssessmentKit(
      args: { id: TId },
      config: AxiosRequestConfig<any> | undefined
    ) {
      const { id } = args ?? {};
      return axios.post(`/baseinfo/assessmentkits/publish/${id}/`, config);
    },
    unPublishAssessmentKit(
      args: { id: TId },
      config: AxiosRequestConfig<any> | undefined
    ) {
      const { id } = args ?? {};
      return axios.post(`/baseinfo/assessmentkits/archive/${id}/`, config);
    },
    addMemberToExpertGroup(
      args: { id: TId; email: string },
      config: AxiosRequestConfig<any> | undefined
    ) {
      const { id, email } = args ?? {};
      return axios.post(
        `/api/v1/expert-groups/${id}/invite/`,
        { email },
        config
      );
    },
    addMemberToKitPermission(
      args: { assessmentKitId: TId; email: string },
      config: AxiosRequestConfig<any> | undefined
    ) {
      const { assessmentKitId, email } = args ?? {};
      return axios.post(
        `/api/v1/assessment-kits/${assessmentKitId}/users/`,
        { email },
        config
      );
    },
    deleteMemberToKitPermission(
      args: { assessmentKitId: TId; userId: TId },
      config: AxiosRequestConfig<any> | undefined
    ) {
      const { assessmentKitId, userId } = args ?? {};
      return axios.delete(
        `/api/v1/assessment-kits/${assessmentKitId}/users/${userId}/`,
        config
      );
    },
    createExpertGroup(
      args: { data: any },
      config: AxiosRequestConfig<any> | undefined
    ) {
      const { data = {} } = args ?? {};

      return axios.post(`/api/v1/expert-groups/`, data, {
        ...(config ?? {}),
        responseType: "blob",
        headers: {
          "Content-Type": "multipart/form-data",

        },
      });
    },
    updateExpertGroup(
      args: { id: TId; data: any },
      config: AxiosRequestConfig<any> | undefined
    ) {
      const { data = {}, id } = args ?? {};

      return axios.put(`/api/v1/expert-groups/${id}/`, data, {
        ...(config ?? {}),
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
    },
    updateExpertGroupPicture(
      args: { id: TId; data: any },
      config: AxiosRequestConfig<any> | undefined
    ) {
      const { data = {}, id } = args ?? {};

      return axios.put(`/api/v1/expert-groups/${id}/picture/`, data, {
        ...(config ?? {}),
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
    },
    deleteExpertGroup(
      args: { id: TId },
      config: AxiosRequestConfig<any> | undefined
    ) {
      const { id } = args ?? {};
      return axios.delete(`/api/v1/expert-groups/${id}/`, config);
    },
    deleteExpertGroupImage(
      args: { expertGroupId: number },
      config: AxiosRequestConfig<any> | undefined
    ) {
      const { expertGroupId } = args ?? {};

      return axios.delete(`/api/v1/expert-groups/${expertGroupId}/picture/`, {
        ...(config ?? {}),
      });
    },
    seenExpertGroup(
      args: { id: TId },
      config: AxiosRequestConfig<any> | undefined
    ) {
      const { id } = args ?? {};
      return axios.put(`/api/v1/expert-groups/${id}/seen/`, config);
    },
    inviteSpaceMember(
      args: { id: TId; data: any },
      config: AxiosRequestConfig<any> | undefined
    ) {
      const { data = {}, id } = args ?? {};

      return axios.post(`/api/v1/spaces/${id}/invite/`, data, {
        ...(config ?? {}),
      });
    },
    inviteExpertGroupMember(
      args: { id: TId; data: any },
      config: AxiosRequestConfig<any> | undefined
    ) {
      const { data = {}, id } = args ?? {};

      return axios.post(`/baseinfo/expertgroups/${id}/`, data, {
        ...(config ?? {}),
      });
    },
    fetchExpertGroupMembers(
      args: { id: TId; status: string },
      config: AxiosRequestConfig<any> | undefined
    ) {
      const { id, status } = args ?? {};

      return axios.get(`/api/v1/expert-groups/${id}/members/`, {
        ...(config ?? {}),
        params: {
          status: status,
        },
      });
    },
    confirmExpertGroupInvitation(
      args: { token: TId; expert_group_id: TId },
      config: AxiosRequestConfig<any> | undefined
    ) {
      const { token, expert_group_id } = args ?? {};

      return axios.put(
        `/api/v1/expert-groups/${expert_group_id}/invite/${token}/confirm/`,
        {
          ...(config ?? {}),
        }
      );
    },
    likeAssessmentKit(
      args: { id: TId },
      config: AxiosRequestConfig<any> | undefined
    ) {
      const { id } = args ?? {};

      return axios.post(`/api/v2/assessment-kits/${id}/like/`, {
        ...(config ?? {}),
      });
    },
    fetchImage(
      args: { url: string },
      config: AxiosRequestConfig<any> | undefined
    ) {
      const { url } = args ?? {};

      return axios.get(url, {
        ...(config ?? {}),
        responseType: "blob",
      });
    },
    addEvidence(
      args: {
        description: string;
        questionId: TId;
        assessmentId: TId;
        type: string;
        id?: TId;
      },
      config: AxiosRequestConfig<any> | undefined
    ) {
      const { description, questionId, assessmentId, type, id } = args ?? {};
      return id
        ? axios.put(`/api/v1/evidences/${id}/`, {
            description,
            type,
          })
        : axios.post(`/api/v1/evidences/`, {
            assessmentId: assessmentId,
            questionId: questionId,
            type: type,
            description,
          });
    },
    deleteEvidence(
      args: { id: TId },
      config: AxiosRequestConfig<any> | undefined
    ) {
      const { id } = args ?? {};
      return axios.delete(`/api/v1/evidences/${id}/`, config);
    },
    updateEvidence(
      args: { description: string; id: TId },
      config: AxiosRequestConfig<any> | undefined
    ) {
      const { description, id } = args ?? {};
      return axios.put(`/assessment/updateevidence/${id}/`, {
        description,
      });
    },
    fetchEvidences(
      args: { questionId: TId; assessmentId: TId; page: number; size: number },
      config: AxiosRequestConfig<any> | undefined
    ) {
      const { questionId, assessmentId, page, size } = args ?? {};

      return axios.get(`/api/v1/evidences/`, {
        ...(config ?? {}),
        params: {
          questionId: questionId,
          assessmentId: assessmentId,
          page,
          size,
        },
      });
    },
    fetchEvidenceAttachments(
        args: {evidence_id:string },
        config: AxiosRequestConfig<any> | undefined
    ) {
        const { evidence_id } = args ?? {};

        return axios.get(`/api/v1/evidences/${evidence_id}/attachments/`, {
            ...(config ?? {}),
        });
    },
      addEvidenceAttachments(
          args: {evidenceId: 'string', data: {}},
          config: AxiosRequestConfig<any> | undefined
      ) {
          const { evidenceId, data} = args ?? {};
          return axios.post(`/api/v1/evidences/${evidenceId}/attachments/`, data,{
              ...(config ?? {}),
              responseType: "blob",
              headers: {
                  "Content-Type": "multipart/form-data",
              }
          });
      },
      RemoveEvidenceAttachments(
          args: {evidenceId: string, attachmentId: string},
          config: AxiosRequestConfig<any> | undefined
      ) {
          const { evidenceId, attachmentId} = args ?? {};
          return axios.delete(`/api/v1/evidences/${evidenceId}/attachments/${attachmentId}/`,{
              ...(config ?? {}),
          });
      },
    fetchConfidenceLevelsList(
      args: {},
      config: AxiosRequestConfig<any> | undefined
    ) {
      return axios.get(`/api/v1/confidence-levels/`, {
        ...(config ?? {}),
      });
    },
    leaveSpace(
      args: { spaceId: TId },
      config: AxiosRequestConfig<any> | undefined
    ) {
      const { spaceId } = args ?? {};

      return axios.delete(`/api/v1/spaces/${spaceId}/leave/`, {
        ...(config ?? {}),
      });
    },
    analyzeAssessmentKit(
      args: { assessmentKitId: TId },
      config: AxiosRequestConfig<any> | undefined
    ) {
      const { assessmentKitId } = args ?? {};

      return axios.get(`/baseinfo/analyzeassessmentkit/${assessmentKitId}/`, {
        ...(config ?? {}),
      });
    },
    fetchAssessmentKitDetails(
      args: { assessmentKitId: TId },
      config: AxiosRequestConfig<any> | undefined
    ) {
      const { assessmentKitId } = args ?? {};

      return axios.get(`/api/v2/assessment-kits/${assessmentKitId}/details/`, {
        ...(config ?? {}),
      });
    },
    fetchAssessmentKitSubjectDetails(
      args: { assessmentKitId: TId; subjectId: TId },
      config: AxiosRequestConfig<any> | undefined
    ) {
      const { assessmentKitId, subjectId } = args ?? {};

      return axios.get(
        `/api/v2/assessment-kits/${assessmentKitId}/details/subjects/${subjectId}/`,
        {
          ...(config ?? {}),
        }
      );
    },
    fetchAssessmentKitSubjectAttributesDetails(
      args: { assessmentKitId: TId; attributeId: TId },
      config: AxiosRequestConfig<any> | undefined
    ) {
      const { assessmentKitId, attributeId } = args ?? {};

      return axios.get(
        `/api/v2/assessment-kits/${assessmentKitId}/details/attributes/${attributeId}/`,
        {
          ...(config ?? {}),
        }
      );
    },
    fetchAssessmentKitQuestionnaires(
      args: { assessmentKitId: TId; questionnaireId: TId },
      config: AxiosRequestConfig<any> | undefined
    ) {
      const { assessmentKitId, questionnaireId } = args ?? {};

      return axios.get(
        `/api/v2/assessment-kits/${assessmentKitId}/details/questionnaires/${questionnaireId}`,
        {
          ...(config ?? {}),
        }
      );
    },
    fetchAssessmentKitQuestionnairesQuestions(
      args: { assessmentKitId: TId; questionId: TId },
      config: AxiosRequestConfig<any> | undefined
    ) {
      const { assessmentKitId, questionId } = args ?? {};

      return axios.get(
        `/api/v2/assessment-kits/${assessmentKitId}/details/questions/${questionId}`,
        {
          ...(config ?? {}),
        }
      );
    },
    fetchAssessmentKitDownloadUrl(
      args: { assessmentKitId: TId },
      config: AxiosRequestConfig<any> | undefined
    ) {
      const { assessmentKitId } = args ?? {};

      return axios.get(
        `/api/v1/assessment-kits/${assessmentKitId}/dsl-download-link/`,
        {
          ...(config ?? {}),
        }
      );
    },

    fetchMaturityLevelQuestions(
      args: { assessmentKitId: TId; attributeId: TId; maturityLevelId: TId },
      config: AxiosRequestConfig<any> | undefined
    ) {
      const { assessmentKitId, attributeId, maturityLevelId } = args ?? {};

      return axios.get(
        `/api/v2/assessment-kits/${assessmentKitId}/details/attributes/${attributeId}/maturity-levels/${maturityLevelId}/`,
        {
          ...(config ?? {}),
        }
      );
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
