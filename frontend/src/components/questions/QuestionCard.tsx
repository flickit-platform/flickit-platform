import React, { useEffect, useRef, useState } from "react";
import Box from "@mui/material/Box";
import Checkbox from "@mui/material/Checkbox";
import Paper from "@mui/material/Paper";
import ToggleButton from "@mui/material/ToggleButton";
import Typography from "@mui/material/Typography";
import { useNavigate, useParams } from "react-router-dom";
import QASvg from "@assets/svg/qa.svg";
import AnswerSvg from "@assets/svg/answer.svg";
import AssignmentRoundedIcon from "@mui/icons-material/AssignmentRounded";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import MinimizeRoundedIcon from "@mui/icons-material/MinimizeRounded";
import FormControlLabel from "@mui/material/FormControlLabel";
import {
  EAssessmentStatus,
  questionActions,
  useQuestionContext,
  useQuestionDispatch,
} from "@/providers/QuestionProvider";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import { IQuestionInfo, TAnswer, TQuestionsInfo } from "@types";
import { Trans } from "react-i18next";
import { LoadingButton } from "@mui/lab";
import { useServiceContext } from "@providers/ServiceProvider";
import PersonOutlineRoundedIcon from "@mui/icons-material/PersonOutlineRounded";
import { ICustomError } from "@utils/CustomError";
import useDialog from "@utils/useDialog";
import { Collapse, Grid } from "@mui/material";
import { FormProvider, useForm, useFormContext } from "react-hook-form";
import { styles } from "@styles";
import Title from "@common/Title";
import { InputFieldUC } from "@common/fields/InputField";
import ListItem from "@mui/material/ListItem";
import AccessTimeRoundedIcon from "@mui/icons-material/AccessTimeRounded";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import toastError from "@utils/toastError";
import setDocumentTitle from "@utils/setDocumentTitle";
import { t } from "i18next";
import { useQuery } from "@utils/useQuery";
import formatDate from "@utils/formatDate";
import useMenu from "@/utils/useMenu";
import MoreActions from "../common/MoreActions";
import { SubmitOnSelectCheckBox } from "./QuestionContainer";
import QueryData from "../common/QueryData";
import InfoRoundedIcon from "@mui/icons-material/InfoRounded";
import languageDetector from "@utils/languageDetector";
import WarningAmberRoundedIcon from "@mui/icons-material/WarningAmberRounded";
import Rating from "@mui/material/Rating";
import RadioButtonUncheckedRoundedIcon from "@mui/icons-material/RadioButtonUncheckedRounded";
import RadioButtonCheckedRoundedIcon from "@mui/icons-material/RadioButtonCheckedRounded";
interface IQuestionCardProps {
  questionInfo: IQuestionInfo;
  questionsInfo: TQuestionsInfo;
}

export const QuestionCard = (props: IQuestionCardProps) => {
  const { questionInfo, questionsInfo } = props;
  const {
    title,
    hint,
    may_not_be_applicable,
    is_not_applicable,
    confidence_level,
  } = questionInfo;
  const { questionIndex } = useQuestionContext();
  const abortController = useRef(new AbortController());
  const [notApplicable, setNotApplicable] = useState<boolean>(false);
  const [disabledConfidence, setDisabledConfidence] = useState<boolean>(true);
  const { service } = useServiceContext();
  useEffect(() => {
    return () => {
      abortController.current.abort();
    };
  }, []);
  const is_farsi = languageDetector(title);
  useEffect(() => {
    setDocumentTitle(`${t("question")} ${questionIndex}: ${title}`);
    setNotApplicable(is_not_applicable ?? false);
    if (confidence_level) {
      dispatch(
        questionActions.setSelectedConfidenceLevel(confidence_level?.id ?? null)
      );
    }
  }, [title]);
  const ConfidenceListQueryData = useQuery({
    service: (args = {}, config) =>
      service.fetchConfidenceLevelsList(args, config),
    toastError: true,
  });
  const { selcetedConfidenceLevel } = useQuestionContext();
  const dispatch = useQuestionDispatch();
  return (
    <Box>
      <Paper
        sx={{
          px: { xs: 2.5, sm: 4, md: 5 },
          py: { xs: 3, sm: 5 },
          backgroundColor: `${notApplicable ? "#000000cc" : "#273248"}`,
          flex: 1,
          backgroundImage: `url(${QASvg})`,
          color: "white",
          backgroundRepeat: "no-repeat",
          backgroundSize: "auto",
          backgroundPosition: "-140px -140px",
          position: "relative",
          overflow: "hidden",
          my: { xs: 2, md: 5 },
          mx: { xs: 2, sm: "auto" },
          mb: "0 !important",
          maxWidth: "1376px",
          borderRadius: "8px 8px 0 0",
        }}
        elevation={3}
      >
        <Box>
          <Box>
            <Typography
              variant="subLarge"
              fontFamily={"Roboto"}
              sx={
                is_farsi
                  ? { color: "white", opacity: 0.65, direction: "rtl" }
                  : { color: "white", opacity: 0.65 }
              }
            >
              <Trans i18nKey="question" />
            </Typography>
            <Typography
              variant="h4"
              letterSpacing={is_farsi ? "0" : ".05em"}
              sx={
                is_farsi
                  ? {
                      pt: 0.5,
                      fontSize: { xs: "1.4rem", sm: "2rem" },
                      fontFamily: { xs: "Vazirmatn", lg: "Vazirmatn" },
                      direction: "rtl",
                    }
                  : {
                      pt: 0.5,
                      fontSize: { xs: "1.4rem", sm: "2rem" },
                      fontFamily: { xs: "Roboto", lg: "Roboto" },
                    }
              }
            >
              {title.split("\n").map((line, index) => (
                <React.Fragment key={index}>
                  {line}
                  <br />
                </React.Fragment>
              ))}
            </Typography>
          </Box>
          <Box sx={{ direction: `${is_farsi ? "rtl" : "ltr"}` }}>
            {hint && <QuestionGuide hint={hint} />}
          </Box>
          <AnswerTemplate
            abortController={abortController}
            questionInfo={questionInfo}
            questionIndex={questionIndex}
            questionsInfo={questionsInfo}
            is_farsi={is_farsi}
            setNotApplicable={setNotApplicable}
            notApplicable={notApplicable}
            may_not_be_applicable={may_not_be_applicable ?? false}
            setDisabledConfidence={setDisabledConfidence}
            selcetedConfidenceLevel={selcetedConfidenceLevel}
          />
        </Box>
      </Paper>
      <Box sx={{ px: { xs: 2, sm: 0 } }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            background: `${notApplicable ? "#273248" : "#000000cc"}`,
            borderRadius: " 0 0 8px 8px ",
            px: { xs: 1.75, sm: 2, md: 2.5 },
            py: { xs: 1.5, sm: 2.5 },
          }}
        >
          <SubmitOnSelectCheckBox />
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
            }}
          >
            <QueryData
              {...ConfidenceListQueryData}
              loading={false}
              error={false}
              render={(data) => {
                const labels = data.confidenceLevels;
                return (
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    {selcetedConfidenceLevel !== null ? (
                      <Box sx={{ mr: 2, color: "#fff" }}>
                        <Typography sx={{ display: "flex" }}>
                          <Trans i18nKey={"youSelected"} />
                          <Typography
                            fontWeight={900}
                            sx={{ borderBottom: "1px solid", mx: 1 }}
                          >
                            {labels[selcetedConfidenceLevel - 1]?.title}
                          </Typography>

                          <Trans i18nKey={"asYourConfidenceLevel"} />
                        </Typography>
                      </Box>
                    ) : (
                      <Box
                        sx={{
                          mr: 2,
                          color: `${disabledConfidence ? "#fff" : "#d32f2f"}`,
                        }}
                      >
                        <Typography>
                          {disabledConfidence ? (
                            <Trans i18nKey={"selcetYourConfidenceLevel"} />
                          ) : (
                            <Trans i18nKey={"toContinueToSubmitAnAnswer"} />
                          )}
                        </Typography>
                      </Box>
                    )}
                    <Rating
                      disabled={disabledConfidence}
                      value={
                        selcetedConfidenceLevel !== null
                          ? selcetedConfidenceLevel
                          : null
                      }
                      size="medium"
                      onChange={(event, newValue) => {
                        dispatch(
                          questionActions.setSelectedConfidenceLevel(newValue)
                        );
                      }}
                      icon={
                        <RadioButtonCheckedRoundedIcon
                          sx={{ mx: 0.25, color: "#42a5f5" }}
                          fontSize="inherit"
                        />
                      }
                      emptyIcon={
                        <RadioButtonUncheckedRoundedIcon
                          style={{ opacity: 0.55 }}
                          sx={{ mx: 0.25, color: "#fff" }}
                          fontSize="inherit"
                        />
                      }
                    />
                  </Box>
                );
              }}
            />
          </Box>
        </Box>

        <Box
          display={"flex"}
          justifyContent="space-between"
          mt={3}
          sx={{
            flexDirection: { xs: "column", md: "row" },
            alignItems: { xs: "stretch", md: "flex-end" },
          }}
        >
          <AnswerDetails questionInfo={questionInfo} />
        </Box>
      </Box>
    </Box>
  );
};

const AnswerTemplate = (props: {
  questionInfo: IQuestionInfo;
  questionIndex: number;
  questionsInfo: TQuestionsInfo;
  abortController: React.MutableRefObject<AbortController>;
  setNotApplicable: any;
  notApplicable: boolean;
  may_not_be_applicable: boolean;
  is_farsi: boolean | undefined;
  setDisabledConfidence: any;
  selcetedConfidenceLevel: any;
}) => {
  const { submitOnAnswerSelection, isSubmitting, evidences } =
    useQuestionContext();
  const {
    questionInfo,
    questionsInfo,
    questionIndex,
    abortController,
    setNotApplicable,
    notApplicable,
    may_not_be_applicable,
    is_farsi,
    setDisabledConfidence,
    selcetedConfidenceLevel,
  } = props;
  const { answer_options, answer } = questionInfo;
  const { total_number_of_questions } = questionsInfo;
  const { service } = useServiceContext();
  const dispatch = useQuestionDispatch();
  const { assessmentId = "", questionnaireId } = useParams();
  const [value, setValue] = useState<TAnswer | null>(answer);
  const navigate = useNavigate();
  const isLastQuestion = questionIndex == total_number_of_questions;
  const isSelectedValueTheSameAsAnswer =
    questionInfo?.answer?.index == value?.index;
  const changeHappened = useRef(false);
  const onChange = (
    event: React.MouseEvent<HTMLElement>,
    v: TAnswer | null
  ) => {
    if (isSelectedValueTheSameAsAnswer) {
      changeHappened.current = true;
    }
    if (value?.index !== v?.index) {
      setDisabledConfidence(false);
    } else {
      setDisabledConfidence(true);
    }
    setValue((prevValue) => (prevValue?.index === v?.index ? null : v));
  };
  useEffect(() => {
    if (notApplicable) {
      setValue(null);
    }
  }, [notApplicable]);
  useEffect(() => {
    if (answer) {
      setDisabledConfidence(false);
    }
  }, [answer]);
  // first checking if evidences have been submited or not
  const submitQuestion = async () => {
    dispatch(questionActions.setIsSubmitting(true));
    try {
      const res = await service.submitAnswer(
        {
          assessmentId,
          data: {
            questionnaire_id: questionnaireId,
            question_id: questionInfo?.id,
            answer_option_id: value?.id || null,
            is_not_applicable: notApplicable,
            confidence_level_id:
              value?.id || submitOnAnswerSelection
                ? selcetedConfidenceLevel
                : null,
          },
        },
        { signal: abortController.current.signal }
      );
      dispatch(questionActions.setIsSubmitting(false));
      dispatch(
        questionActions.setQuestionInfo({
          ...questionInfo,
          answer: value,
          is_not_applicable: notApplicable,
          confidence_level: selcetedConfidenceLevel ?? null,
        })
      );
      if (isLastQuestion) {
        dispatch(questionActions.setAssessmentStatus(EAssessmentStatus.DONE));
        navigate(`../completed`, { replace: true });
        return;
      }
      if (value) {
        dispatch(
          questionActions.setAssessmentStatus(EAssessmentStatus.INPROGRESS)
        );
      }
      const newQuestionIndex = questionIndex + 1;
      dispatch(questionActions.goToQuestion(newQuestionIndex));
      navigate(`../${newQuestionIndex}`, {
        replace: true,
      });
    } catch (e) {
      dispatch(questionActions.setIsSubmitting(false));
      const err = e as ICustomError;
      toastError(err);
    }
  };

  useEffect(() => {
    if (
      submitOnAnswerSelection &&
      value &&
      changeHappened.current &&
      selcetedConfidenceLevel
    ) {
      submitQuestion();
    }
  }, [value]);
  const notApplicableonChanhe = (e: any) => {
    setNotApplicable(e.target.checked || false);
    if (e.target.checked) {
      setDisabledConfidence(false);
    } else {
      setDisabledConfidence(true);
    }
  };
  return (
    <>
      <Box
        display={"flex"}
        justifyContent="flex-start"
        mt={4}
        sx={is_farsi ? { direction: "rtl" } : {}}
      >
        <Box
          display={"flex"}
          sx={{
            flexDirection: { xs: "column", md: "row" },
            width: { xs: "100%", sm: "80%", md: "auto" },
          }}
          flexWrap={"wrap"}
        >
          {answer_options?.map((option: any) => {
            const { index: templateValue, caption } = option || {};
            return (
              <Box
                key={option.value}
                mb={2}
                mr={2}
                sx={{ minWidth: { xs: "180px", sm: "320px" } }}
              >
                <ToggleButton
                  data-cy="answer-option"
                  color="success"
                  fullWidth
                  size="large"
                  value={option}
                  selected={templateValue === value?.index}
                  onChange={onChange}
                  disabled={isSubmitting || notApplicable}
                  sx={{
                    letterSpacing: `${is_farsi ? "0" : ".05em"}`,
                    color: "white",
                    p: { xs: 0.6, sm: 1 },
                    textAlign: "left",
                    fontSize: { xs: "1.15rem", sm: "1.3rem" },
                    fontFamily: `${is_farsi ? "Vazirmatn" : "Roboto"}`,
                    justifyContent: "flex-start",
                    boxShadow: "0 0 2px white",
                    borderWidth: "2px",
                    borderColor: "transparent",
                    "&.Mui-selected": {
                      "&:hover": {
                        backgroundColor: "#0ec586",
                      },
                      backgroundImage: `url(${AnswerSvg})`,
                      backgroundRepeat: "no-repeat",
                      backgroundPosition: "right",
                      color: "white",
                      backgroundColor: "#0acb89",
                      borderColor: "transparent",
                      zIndex: 2,
                      position: "relative",
                    },
                  }}
                >
                  <Checkbox
                    disableRipple={true}
                    checked={templateValue === value?.index}
                    disabled
                    sx={{
                      position: "absoulte",
                      zIndex: 1,
                      color: "white",
                      p: 0,
                      mr: "8px",
                      ml: "8px",
                      opacity: 0.8,
                      "& svg": { fontSize: { xs: "2.1rem", sm: "2.5rem" } },
                      "&.Mui-checked": { color: "white", opacity: 1 },
                      "&.Mui-disabled": {
                        color: notApplicable ? "gray" : "white",
                      },
                    }}
                  />
                  {templateValue}. {caption}
                </ToggleButton>
              </Box>
            );
          })}
        </Box>
      </Box>
      {notApplicable && (
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <WarningAmberRoundedIcon color="error" />
          <Typography
            variant="subtitle2"
            color="error"
            sx={{ ml: "4px", mt: "4px" }}
          >
            <Trans i18nKey={"theOptionSelectionIsDisabled"} />
          </Typography>
        </Box>
      )}
      <Box
        sx={{
          mt: { xs: 4, md: 1 },
          mr: { xs: 0, md: 2 },
          display: "flex",
          flexDirection: "row-reverse",
          // ml: "auto",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <LoadingButton
          variant="contained"
          color={"info"}
          loading={isSubmitting}
          disabled={(value || notApplicable) && !selcetedConfidenceLevel}
          sx={
            is_farsi
              ? {
                  fontSize: "1.2rem",
                  mr: "auto",
                }
              : { fontSize: "1.2rem", ml: "auto" }
          }
          onClick={submitQuestion}
        >
          <Trans i18nKey={"nextQuestion"} />
        </LoadingButton>
        {may_not_be_applicable && (
          <FormControlLabel
            sx={{ color: "#0288d1" }}
            data-cy="automatic-submit-check"
            control={
              <Checkbox
                checked={notApplicable}
                onChange={(e) => notApplicableonChanhe(e)}
                sx={{
                  color: "#0288d1",
                  "&.Mui-checked": {
                    color: "#0288d1",
                  },
                }}
              />
            }
            label={<Trans i18nKey={"notApplicable"} />}
          />
        )}
      </Box>
    </>
  );
};

const AnswerDetails = ({ questionInfo }: any) => {
  const dialogProps = useDialog();
  const evidencesQueryData = useQuery({
    service: (
      args = { questionId: questionInfo.id, assessmentId, page: 0, size: 10 },
      config
    ) => service.fetchEvidences(args, config),
    toastError: true,
  });
  const hasSetCollapse = useRef(false);
  const [collapse, setCollapse] = useState<boolean>(false);
  const { service } = useServiceContext();
  const { assessmentId = "" } = useParams();

  useEffect(() => {
    if (!hasSetCollapse.current && evidencesQueryData.loaded) {
      if (evidencesQueryData.data?.items?.length > 0) {
        setCollapse(true);
        hasSetCollapse.current = true;
      }
    }
  }, [evidencesQueryData.loaded]);

  return (
    <Box mt={2} width="100%">
      <Title sup={<Trans i18nKey="addDetailsToYourAnswer" />} size="small">
        <Trans i18nKey="answerDetail" />
      </Title>
      <Box
        mt={2}
        display={"flex"}
        sx={{ cursor: "pointer" }}
        alignItems="center"
        position={"relative"}
        width="100%"
        onClick={() => setCollapse(!collapse)}
      >
        {!collapse ? (
          <AddRoundedIcon />
        ) : (
          <MinimizeRoundedIcon sx={{ position: "relative", bottom: "8px" }} />
        )}
        <Typography ml={1} variant="h6">
          <Trans i18nKey={"evidences"} />
        </Typography>
      </Box>
      <Collapse
        in={collapse}
        sx={{
          flex: 1,
          borderLeft: "1px dashed purple",
          px: 1,
          ml: 1.5,
          width: "100%",
        }}
      >
        <Box
          sx={{
            flex: 1,
            mr: { xs: 0, md: 4 },
            position: "relative",
            display: "flex",
            flexDirection: "column",
            width: "100%",
          }}
        >
          {/* <Box mb={1.8}>
          <Typography
            variant="subLarge"
            fontFamily={"Roboto"}
            component={Link}
            to="#"
            sx={{ color: "white", opacity: 0.5, textDecoration: "none" }}
          >
            <Trans i18nKey="howSureAreYou" />
          </Typography>
          <Box
            display="flex"
            alignItems={"baseline"}
            sx={{
              flexDirection: "column",
            }}
          >
            <Box display="flex" alignItems={"baseline"} sx={{ flexDirection: { xs: "column", sm: "row" } }}>
              <Typography>
                <Trans i18nKey={"myConfidenceLevelOnThisQuestionIs"} />
              </Typography>
              <Box width="90px" sx={{ ml: { xs: 0, sm: 1 }, mt: { xs: 1, sm: 0 } }} position="relative" bottom="1px">
                <FormControl fullWidth>
                  <NativeSelect
                    sx={{
                      "&::before": {
                        display: "none",
                      },
                      "&::after": {
                        display: "none",
                      },
                      background: "#04a56e",
                      fontSize: ".92rem",
                      borderRadius: 1.5,
                      "& select": {
                        pl: 1.2,
                        py: 0.5,
                      },
                      color: "white",
                      "& option": {
                        backgroundColor: "#424242 !important",
                      },
                      "& svg": {
                        color: "white",
                      },
                    }}
                    defaultValue={1}
                    inputProps={{
                      name: "confidenceLevel",
                      id: "uncontrolled-native",
                    }}
                  >
                    <option value={1}>1 of 5</option>
                    <option value={2}>2 of 5</option>
                    <option value={3}>3 of 5</option>
                    <option value={4}>4 of 5</option>
                    <option value={5}>5 of 5</option>
                  </NativeSelect>
                </FormControl>
              </Box>
            </Box>
          </Box>
        </Box> */}
          <Box
            display="flex"
            alignItems={"baseline"}
            sx={{
              flexDirection: "column",
              px: 2,
              width: "100%",
            }}
          >
            <Evidence
              {...dialogProps}
              questionInfo={questionInfo}
              evidencesQueryData={evidencesQueryData}
            />
          </Box>
        </Box>
      </Collapse>
    </Box>
  );
};

const Evidence = (props: any) => {
  const { service } = useServiceContext();
  const { onClose: closeDialog, openDialog, ...rest } = props;
  const { questionInfo, evidencesQueryData } = props;
  const { assessmentId = "" } = useParams();
  const [evidenceId, setEvidenceId] = useState(null);
  const formMethods = useForm({ shouldUnregister: true });
  const addEvidence = useQuery({
    service: (args, config) => service.addEvidence(args, config),
    runOnMount: false,
  });

  //if there is a evidence we should use addEvidence service
  const onSubmit = async (data: any) => {
    try {
      await addEvidence.query({
        description: data.evidence,
        questionId: questionInfo.id,
        assessmentId,
        id: evidenceId,
      });
      await await evidencesQueryData.query();
    } catch (e) {
      const err = e as ICustomError;
      toastError(err);
    } finally {
      setEvidenceId(null);
      formMethods.reset();
    }
  };
  return (
    <Box display={"flex"} flexDirection={"column"} width="100%">
      <FormProvider {...formMethods}>
        <form
          onSubmit={formMethods.handleSubmit(onSubmit)}
          style={{ flex: 1, display: "flex", flexDirection: "column" }}
        >
          <Grid container spacing={1} sx={styles.formGrid}>
            <Grid item xs={12}>
              <InputFieldUC
                multiline
                minRows={3}
                maxRows={8}
                autoFocus={true}
                defaultValue={""}
                name="evidence"
                label={<Trans i18nKey="evidence" />}
                required={true}
                placeholder="Please write your evidence"
                isFocused={evidenceId ? true : false}
              />
            </Grid>
            <Grid item xs={12}>
              <Box display={"flex"}>
                <LoadingButton
                  sx={{ ml: "auto" }}
                  type="submit"
                  variant="contained"
                  loading={evidencesQueryData.loading}
                >
                  <Trans
                    i18nKey={evidenceId ? "updateEvidence" : "addEvidence"}
                  />
                </LoadingButton>
              </Box>
            </Grid>
          </Grid>
        </form>
        <Box mt={3}>
          <QueryData
            {...evidencesQueryData}
            render={(data) => {
              const { items } = data;
              return items.map((item: any, index: number) => (
                <EvidenceDetail
                  item={item}
                  setEvidenceId={setEvidenceId}
                  evidencesQueryData={evidencesQueryData}
                  questionInfo={questionInfo}
                  assessmentId={assessmentId}
                />
              ));
            }}
          />
        </Box>
      </FormProvider>
    </Box>
  );
};

const EvidenceDetail = (props: any) => {
  const { item, evidencesQueryData, setEvidenceId } = props;
  const { description, last_modification_date, created_by, id } = item;

  return (
    <Box display="flex" flexDirection="column" width="100%">
      <ListItem sx={{ px: 0.5, borderBottom: "1px solid #e9e8e8", mb: 1 }}>
        <ListItemIcon
          sx={{
            minWidth: "45px",
            display: { xs: "none", sm: "inline-flex" },
          }}
        >
          <AssignmentRoundedIcon />
        </ListItemIcon>
        <ListItemText sx={{ pr: 2 }} primary={description} />
        <Box display="flex">
          <Box sx={{ ...styles.centerV, mr: 2 }}>
            <PersonOutlineRoundedIcon
              sx={{ mr: 0.7, color: "gray" }}
              fontSize="small"
            />
            {created_by.display_name}
          </Box>
          <Box sx={{ ...styles.centerV }}>
            <AccessTimeRoundedIcon
              sx={{ mr: 0.7, color: "gray" }}
              fontSize="small"
            />
            {formatDate(last_modification_date)}
          </Box>
        </Box>
        <Box>
          <Actions
            fetchEvidences={evidencesQueryData.query}
            id={id}
            setEvidenceId={setEvidenceId}
            description={description}
          />
        </Box>
      </ListItem>
    </Box>
  );
};

const Actions = (props: any) => {
  const { fetchEvidences, id, setEvidenceId, description } = props;
  const { service } = useServiceContext();
  const formContext = useFormContext();
  const deleteEvidence = useQuery({
    service: (args = { id }, config) => service.deleteEvidence(args, config),
    runOnMount: false,
  });

  const onUpdate = async () => {
    formContext.setValue("evidence", description);
    setEvidenceId(id);
  };

  const deleteItem = async (e: any) => {
    try {
      await deleteEvidence.query();
      await fetchEvidences?.();
    } catch (e) {
      const err = e as ICustomError;
      toastError(err);
    }
  };

  return (
    <MoreActions
      {...useMenu()}
      boxProps={{ ml: 0.4 }}
      loading={deleteEvidence.loading}
      items={[
        {
          icon: <EditRoundedIcon fontSize="small" />,
          text: <Trans i18nKey="edit" />,
          onClick: onUpdate,
        },
        {
          icon: <DeleteRoundedIcon fontSize="small" />,
          text: <Trans i18nKey="delete" />,
          onClick: deleteItem,
        },
      ]}
    />
  );
};

const QuestionGuide = (props: any) => {
  const hasSetCollapse = useRef(false);
  const [collapse, setCollapse] = useState<boolean>(false);
  const { service } = useServiceContext();
  const { assessmentId = "" } = useParams();
  const { hint } = props;
  const is_farsi = languageDetector(hint);
  return (
    <Box>
      <Box mt={1} width="100%">
        <Title
          sup={
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <InfoRoundedIcon sx={{ mr: "4px" }} />
              <Trans i18nKey="hint" />
            </Box>
          }
          size="small"
          sx={{ cursor: "pointer", userSelect: "none" }}
          onClick={() => setCollapse(!collapse)}
          mb={1}
        ></Title>
        <Collapse in={collapse}>
          <Box
            sx={{
              flex: 1,
              mr: { xs: 0, md: 4 },
              position: "relative",
              display: "flex",
              flexDirection: "column",
              width: "100%",
              border: "1px dashed #ffffff99",
              borderRadius: "8px",
              direction: `${is_farsi ? "rtl" : "ltr"}`,
            }}
          >
            <Box
              display="flex"
              alignItems={"baseline"}
              sx={{
                p: 2,
                width: "100%",
              }}
            >
              <Typography variant="body2">
                {hint.startsWith("\n")
                  ? hint
                      .substring(1)
                      .split("\n")
                      .map((line: string, index: number) => (
                        <React.Fragment key={index}>
                          {line}
                          <br />
                        </React.Fragment>
                      ))
                  : hint.split("\n").map((line: string, index: number) => (
                      <React.Fragment key={index}>
                        {line}
                        <br />
                      </React.Fragment>
                    ))}
              </Typography>
            </Box>
          </Box>
        </Collapse>
      </Box>
    </Box>
  );
};
type TAnswerTemplate = { caption: string; value: number }[];
