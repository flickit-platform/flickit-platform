import { DialogProps } from "@mui/material/Dialog";
import { AxiosPromise, AxiosRequestConfig } from "axios";
import { ToastOptions } from "react-toastify";
import { ICustomError } from "./utils/CustomError";

export enum ECustomErrorType {
  "DEFAULT" = "DEFAULT",
  "UNAUTHORIZED" = "UNAUTHORIZED",
  "NETWORK_CONNECTION" = "NETWORK_CONNECTION",
  "INVALID_TOKEN" = "INVALID_TOKEN",
  "NOT_FOUND" = "NOT_FOUND",
  "CANCELED" = "CANCELED",
  "ACCESS_DENIED" = "ACCESS_DENIED",
}

export enum ESystemStatus {
  "OPTIMIZED" = "OPTIMIZED",
  "GOOD" = "GOOD",
  "NORMAL" = "NORMAL",
  "RISKY" = "RISKY",
  "WEAK" = "WEAK",
  "GREAT" = "GREAT",
  "MODERATE" = "MODERATE",
  "ELEMENTARY" = "ELEMENTARY",
}

export type TId = string | number;

export interface IDefaultModel<T extends any = any> {
  count: number;
  next: null;
  previous: null;
  results: T[];
}

export interface IAnswerTemplate {
  caption: string;
  value: number;
  id: TId;
}

export type TAnswerTemplates = IAnswerTemplate[];
export interface IQuestionInfo {
  id: TId;
  index: number;
  answer: null | TAnswer;
  title: string;
  questionResultId?: string | number;
  answer_options?: TAnswerTemplates;
  description?: string;
}
export type TQuestionsInfo = {
  total_number_of_questions: number;
  resultId: TId | undefined;
  questions: IQuestionInfo[];
};

export type TAnswer = {
  id: TId;
  index: string | number;
  caption: string;
  evidences: TEvidences;
};
export type TEvidences = {
  created_by_id: TId;
  creation_time: TimeRanges;
  description: string;
  id: TId;
  last_modification_date: TimeRanges;
  question_value_id: string;
};
export type TStatus =
  | "WEAK"
  | "RISKY"
  | "NORMAL"
  | "GOOD"
  | "OPTIMIZED"
  | "ELEMENTARY"
  | "MODERATE"
  | "GREAT"
  | "Not Calculated"
  | null;

export interface IUserInfo {
  id: TId;
  display_name: string;
  email: string;
  current_space: ISpaceInfo | null;
  is_expert?: boolean;
  bio?: string;
  picture?: null | string;
  linkedin?: string | null;
  is_active?: boolean;
  default_space?: any;
}

export interface ISpaceInfo {
  id: TId;
  code: string;
  title: string;
  owner: {
    first_name: string;
    id: TId;
    last_name: string;
    username: string;
  };
}

export type TToastConfig = ToastOptions & {
  message: string | JSX.Element;
};

export interface ISubjectInfo {
  description: string;
  id: TId;
  image: string | null;
  progress: number;
  status: string;
  title: string;
  total_answered_question_number: number;
  total_question_number: number;
  maturity_level?:IMaturityLevel
}
export interface IMaturityLevel {
  id: TId;
  title: string;
  value: number;
  index?:number
}

export interface IImage {
  id: TId;
  image: string;
}

export type TImages = IImage[];

export interface IAssessmentKitModel {
  code: string;
  description: string;
  id: TId;
  title: string;
  images: TImages;
  question_categories: IQuestionnaireModel[];
  assessment_subjects: Omit<
    ISubjectInfo,
    | "total_answered_question_number"
    | "total_question_number"
    | "progress"
    | "status"
  >;
}
export interface IAssessmentKitList {
  id: TId;
  maturity_levels_count: number;
}

export interface IAssessmentKit {
  code: string;
  description: string;
  id: TId;
  title: string;
}

export interface IAssessmentResult {
  assessment_project: string;
  id: TId;
}
export interface IAssessmentResultModel
  extends IDefaultModel<IAssessmentResult> {}

export type TAssessmentResultsModel = string[];

export interface IColorModel {
  color_code: string;
  id: TId;
  title: string;
}
export interface IColor {
  code: string;
  id: TId;
}

export interface IOwnerModel {
  id: TId;
  username: string;
  first_name: string;
  last_name: string;
}

export interface ISpaceModel {
  code: string;
  id: TId;
  owner: IOwnerModel;
  title: string;
  last_modification_date?: string;
  members_number?: number;
  assessment_numbers?: number;
  is_default_space_for_current_user?: boolean;
}

export interface ISpacesModel extends IDefaultModel<ISpaceModel> {}
export interface IAssessmentReport {
  assessment_kit: Omit<
    IAssessmentKitModel,
    "question_categories" | "images" | "assessment_subjects"
  >;
  assessment_results: string[];
  color: IColorModel;
  last_modification_date: string;
  space: ISpaceModel;
  title: string;
}

export interface ITotalProgress {
  progress: number;
  total_answered_question_number: number;
  total_question_number: number;
  answers_count?:number;
  question_count?:number;
}

export interface ITotalProgressModel {
  total_progress: ITotalProgress;
  assessment_project_title: string;
}
export interface IAssessmentReportModel {
  subjects_info: ISubjectInfo[];
  status: TStatus;
  most_significant_strength_atts: string[];
  most_significant_weaknessness_atts: string[];
  assessment_project: IAssessmentReport;
  total_progress: ITotalProgress;
  maturity_level_status: string;
}

export interface IQuestionnaireModel {
  code: string;
  id: TId;
  title: string;
}

export interface IQuestion {
  id: TId;
  index: number;
  title: string;
  answer_templates: TAnswerTemplates;
  answer: TAnswer;
}

export interface IQuestionsModel {
  items: IQuestion[];
  assessment_result_id: string;
}

export interface IQuestionImpact {
  id: TId;
  level: number;
  quality_attribute: number;
}

export type TQuestionImpacts = IQuestionImpact[];

export interface IQualityAttribute {
  code: string;
  description: string;
  id: TId;
  images: TImages;
  title: string;
}

export interface IQuestionResult {
  id: TId;
  index: number;
  title: string;
  question_impacts: TQuestionImpacts;
  quality_attributes: IQualityAttribute[];
}

export interface IQuestionsResult extends IAssessmentResult {
  answer: TAnswer;
  question: IQuestionResult;
}

export interface IQuestionsResultsModel
  extends IDefaultModel<IQuestionsResult> {}

export interface IAssessment {
  id: TId;
  last_modification_time: string;
  status: TStatus;
  title: string;
  // code: string;
  color: IColor;
  is_calculate_valid: boolean;
  assessment_results: string[];
  assessment_kit: IAssessmentKitList;
  // total_progress?: ITotalProgress;
  result_maturity_level: IMaturityLevel;
}

export interface IAssessmentModel extends IDefaultModel<IAssessment> {
  requested_space: string | null;
}

export interface IMember {
  id: TId;
  space: TId;
  user: Omit<IUserInfo, "current_space" | "email">;
}

export interface IMemberModel extends IDefaultModel<IMember> {}

export interface ISubjectReport {
  id: TId;
  maturity_level_value: number;
  status: TStatus;
  quality_attribute: IQualityAttribute;
}

export interface IQuestionnaire {
  answered_question: number;
  id: TId;
  question_number: number;
  progress: number;
  title: string;
  last_updated?: string;
}

export interface IQuestionnairesInfo {
  answers_count: number;
  id: TId;
  questions_count: number;
  progress: number;
  last_updated?: string;
  current_question_index: number;
  title: string;
  subjects: { id: TId; title: string }[];
}
export interface IQuestionnairesModel extends ITotalProgress {
  assessment_title: string;
  questionaries_info: IQuestionnairesInfo[];
}

export interface ISubjectReportModel extends IDefaultModel<ISubjectReport> {
  assessment_kit_description: string;
  assessment_project_color_code: string;
  assessment_project_id: string;
  assessment_project_space_id: TId;
  assessment_project_space_title: string;
  assessment_project_title: string;
  maturity_level_value: number;
  progress: number;
  status: TStatus;
  title: string;
  total_answered_question: number;
  total_question_number: number;
  question_categories_info: IQuestionnaire[];
  most_significant_strength_atts: IQualityAttribute[];
  most_significant_weaknessness_atts: IQualityAttribute[];
  no_insight_yet_message?: string;
  total_progress: ITotalProgress;
  attributes:any;
  subject:any;
  top_strengths:any;
  top_weaknesses:any;
}

export type TQueryFunction<T extends any = any, A extends any = any> = (
  args?: A,
  config?: AxiosRequestConfig<any> | undefined
) => Promise<T>;

export type TQueryProps<T extends any = any, A extends any = any> = {
  data: T;
  loading: boolean;
  loaded: boolean;
  error: boolean;
  errorObject: ICustomError | undefined;
  query: (
    args?: A | undefined,
    config?: AxiosRequestConfig<any> | undefined
  ) => Promise<T>;
  abortController?: AbortController;
};

export interface IQuestionnairesPageDataModel {
  assessment_title: string;
  subjects: { id: TId; title: string }[];
}

export interface IDialogProps extends DialogProps {
  onClose: () => void;
  onSubmitForm?: (args: any) => void;
  openDialog?: any;
  context?: IDialogContext;
}

export interface IDialogContext {
  type: TDialogContextType | (string & {});
  data?: any;
  staticData?: any;
  onSubmit?: (...args: any) => any;
  getViewLink?: (data: any) => string;
}

export type TDialogContextType = "update" | "create";

export interface ICompareModel {
  assessment_project_compare_list: any[];
}

export interface ICompareResultBaseInfo {
  id: TId;
  title: string;
  status: TStatus;
  assessment_kit: string;
}
export type TCompareResultBaseInfos = ICompareResultBaseInfo[];

export interface ICompareResultCompareItems {
  title: string;
  items: any[];
}

export type TCompareResultAttributeInfo = {
  title: string;
} & {
  [key: string]: number;
};

export interface ICompareResultSubject {
  title: string;
  subject_report_info: ICompareResultCompareItems[];
  attributes_info: TCompareResultAttributeInfo[];
}

export interface ICompareResultModel {
  base_infos: TCompareResultBaseInfos;
  overall_insights: ICompareResultCompareItems[];
  subjects: ICompareResultSubject[];
}
