import React, { useEffect, useRef, useState } from "react";
import Box from "@mui/material/Box";
import Checkbox from "@mui/material/Checkbox";
import Paper from "@mui/material/Paper";
import ToggleButton from "@mui/material/ToggleButton";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { useNavigate, useParams } from "react-router-dom";
import QASvg from "@assets/svg/qa.svg";
import AnswerSvg from "@assets/svg/answer.svg";
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
import firstCharDetector from "@/utils/firstCharDetector";
import Avatar from "@mui/material/Avatar";
import stringAvatar from "@utils/stringAvatar";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import IconButton from "@mui/material/IconButton";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import CheckRoundedIcon from "@mui/icons-material/CheckRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import useScreenResize from "@utils/useScreenResize";

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
        questionActions.setSelectedConfidenceLevel(
          confidence_level?.id ? confidence_level?.id : confidence_level ?? null
        )
      );
    }
  }, [title, confidence_level]);
  const ConfidenceListQueryData = useQuery({
    service: (args = {}, config) =>
      service.fetchConfidenceLevelsList(args, config),
    toastError: false,
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
            flexDirection: { xs: "column", md: "row" },
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
              flexDirection: { xs: "column", md: "row" },
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
                        <Typography
                          sx={{ display: "flex", fontSize: { xs: "10px" } }}
                        >
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
            questionnaireId: questionnaireId,
            questionId: questionInfo?.id,
            answerOptionId: value?.id || null,
            isNotApplicable: notApplicable,
            confidenceLevelId:
              value?.id || submitOnAnswerSelection || notApplicable
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

  const { service } = useServiceContext();
  const { assessmentId = "" } = useParams();

  return (
    <Box mt={2} width="100%">
      <Title px={1} size="small">
        <Trans i18nKey="answerEvidences" />
      </Title>
      <Box
        mt={2}
        display={"flex"}
        sx={{ cursor: "pointer" }}
        alignItems="center"
        position={"relative"}
        width="100%"
      ></Box>

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
            alignItems: "center",
            wordBreak: "break-word",
          }}
        >
          <Evidence
            {...dialogProps}
            questionInfo={questionInfo}
            evidencesQueryData={evidencesQueryData}
          />
        </Box>
      </Box>
    </Box>
  );
};

const Evidence = (props: any) => {
  const LIMITED = 200;
  const [valueCount, setValueCount] = useState("");
  const is_farsi = firstCharDetector(valueCount);
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
  const [value, setValue] = React.useState("POSITIVE");
  const [evidenceBG, setEvidenceBG] = useState<any>({
    background: "#EDFCFC",
    borderColor: "#1CC2C4",
    borderHover: "#117476",
  });
  useEffect(() => {
    if (value === null) {
      setEvidenceBG({
        background: "#EDF4FC",
        borderColor: "#0A2342",
        borderHover: "#061528",
      });
    }
    if (value === "POSITIVE") {
      setEvidenceBG({
        background: "#EDFCFC",
        borderColor: "#1CC2C4",
        borderHover: "#117476",
      });
    }
    if (value === "NEGATIVE") {
      setEvidenceBG({
        background: "#FDF1F5",
        borderColor: "#D81E5B",
        borderHover: "#821237",
      });
    }
  }, [value]);
  const cancelEditing = async (e: any) => {
    setEvidenceId(null);
    formMethods.reset();
  };
  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };
  //if there is a evidence we should use addEvidence service
  const onSubmit = async (data: any) => {
    try {
      if (data.evidence.length <= LIMITED) {
        await addEvidence.query({
          description: data.evidence,
          questionId: questionInfo.id,
          assessmentId,
          type: value,
          id: evidenceId,
        });
        await await evidencesQueryData.query();
        setValueCount("");
      }
    } catch (e) {
      const err = e as ICustomError;
      toastError(err.response.data.description[0]);
    } finally {
      setEvidenceId(null);
      formMethods.reset();
    }
  };
  return (
    <Box
      display={"flex"}
      flexDirection={"column"}
      width="100%"
      sx={{ width: { md: "80%" } }}
    >
      <FormProvider {...formMethods}>
        <form
          onSubmit={formMethods.handleSubmit(onSubmit)}
          style={{ flex: 1, display: "flex", flexDirection: "column" }}
        >
          <Grid container display={"flex"} justifyContent={"end"} sx={styles.formGrid}>
            <TabContext value={value}>
              <TabList
                onChange={handleChange}
                sx={{
                  width: "100%",

                  "&.MuiTabs-root": {
                    borderBottomColor: "transparent",
                    justifyContent: "space-between",
                    display: "flex",
                  },
                  ".MuiTabs-indicator": {
                    backgroundColor: evidenceBG.borderColor,
                  },
                }}
              >
                <Tab
                  label={<Trans i18nKey="negativeEvidence" />}
                  value="NEGATIVE"
                  sx={{
                    fontSize: "16px",
                    display: "flex",
                    flex: 1,
                    "&.Mui-selected": {
                      color: `${evidenceBG.borderColor}  !important`,
                    },
                  }}
                />
                <Tab
                  label={
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <Trans i18nKey="comment" />
                      {value == null && (
                        <InfoOutlinedIcon
                          style={{ color: evidenceBG.borderColor }}
                          sx={{ ml: 1 }}
                        />
                      )}
                    </Box>
                  }
                  sx={{
                    fontSize: "16px",
                    display: "flex",
                    flex: 1,
                    "&.Mui-selected": {
                      color: `${evidenceBG.borderColor}  !important`,
                    },
                  }}
                  value={null}
                />
                <Tab
                  label={<Trans i18nKey="positiveEvidence" />}
                  sx={{
                    fontSize: "16px",
                    display: "flex",
                    flex: 1,
                    "&.Mui-selected": {
                      color: `${evidenceBG.borderColor}  !important`,
                    },
                  }}
                  value="POSITIVE"
                />
              </TabList>
            </TabContext>
            <Grid item xs={12} position={"relative"}>
              <InputFieldUC
                multiline
                minRows={3}
                maxRows={8}
                minLength={3}
                maxLength={200}
                autoFocus={true}
                defaultValue={""}
                pallet={evidenceBG}
                name="evidence"
                label={null}
                required={true}
                placeholder="Write down your evidence and comment here...."
                isFocused={evidenceId ? true : false}
                borderRadius={"16px"}
                setValueCount={setValueCount}
                hasCounter={true}
                isFarsi={is_farsi}
              />
              <Typography
                style={is_farsi ? { left: 20 } : { right: 20 }}
                sx={{
                  position: "absolute",
                  top: 20,
                  fontSize: "14px",
                  fontWeight: 300,
                  color: valueCount.length > LIMITED ? "#D81E5B" : "#9DA7B3",
                }}
              >
                {valueCount.length || 0} / {LIMITED}
              </Typography>
              {value == null && valueCount.length == 0 && !evidenceId && (
                <Box
                  sx={{
                    position: "absolute",
                    bottom: "8px",
                    right: "80px",
                    display: "flex",
                    alignItems: "center",
                    border: "1px solid #9DA7B3",
                    px: "6px",
                    py: "2px",
                    borderRadius: "16px 0 16px 16px",
                  }}
                >
                  <InfoOutlinedIcon
                    style={{ color: "#0A2342" }}
                    sx={{ mr: 1 }}
                  />
                  <Typography
                    sx={{
                      fontSize: "12px",
                      fontWeight: 300,
                    }}
                  >
                    <Trans i18nKey="commentsWillNotBeShown" />
                  </Typography>
                </Box>
              )}
              <Grid
                item
                xs={12}
                sx={
                  is_farsi
                    ? { position: "absolute", top: 15, left: 5 }
                    : {
                        position: "absolute",
                        top: 15,
                        right: 5,
                      }
                }
              >
              </Grid>
            </Grid>
              <Box display={"flex"} justifyContent={"end"} mt={2}>
                  {!evidenceId ? (
                      <LoadingButton
                          sx={{
                              ml: "auto",
                              borderRadius: "100%",
                              p: 2,
                              minWidth: "56px",
                              background: evidenceBG.borderColor,
                              "&:hover": {
                                  background: evidenceBG.borderHover,
                              },
                          }}
                          type="submit"
                          variant="contained"
                          loading={evidencesQueryData.loading}
                      >
                          <AddRoundedIcon fontSize="large" />
                      </LoadingButton>
                  ) : (
                      <EvidenceEditingBtn cancelEditing={cancelEditing}
                                   evidenceBG={evidenceBG}
                                   evidencesQueryData={evidencesQueryData}
                      />
                  )}
              </Box>
          </Grid>
        </form>
        <Box mt={3}>
          <QueryData
            {...evidencesQueryData}
            render={(data) => {
              const { items } = data;
              return items.map((item: any, index: number) => (
                <EvidenceDetail
                  setValue={setValue}
                  item={item}
                  setEvidenceId={setEvidenceId}
                  evidenceId={evidenceId}
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

const EvidenceEditingBtn = (props : any) =>{
    const { cancelEditing, evidenceBG, evidencesQueryData } = props
    return (
        <Box
            sx={{ display: "flex", gap: 1, alignItems: "baseline" }}
        >
            <IconButton
                aria-label="delete"
                sx={{
                    boxShadow: 2,
                    borderRadius: "100%",
                    width: "46px",
                    height: "46px",
                    p: 1,
                    background: "#F7D2DE",
                    border: "1px solid #D81E5B",
                    "&.MuiButtonBase-root:hover": {
                        background: "#EFA5BD",
                    },
                }}
                onClick={cancelEditing}
            >
                <CloseRoundedIcon style={{ color: "#D81E5B" }} />
            </IconButton>
            <LoadingButton
                sx={{
                    ml: "auto",
                    borderRadius: "100%",
                    p: 2,
                    minWidth: "56px",
                    background: evidenceBG.borderColor,
                    "&:hover": {
                        background: evidenceBG.borderHover,
                    },
                }}
                type="submit"
                variant="contained"
                loading={evidencesQueryData.loading}
            >
                <CheckRoundedIcon fontSize="large" />
            </LoadingButton>
        </Box>
    )
}

const EvidenceDetail = (props: any) => {
  const { item, evidencesQueryData, setEvidenceId, evidenceId, setValue } =
    props;
  const { description, lastModificationTime, createdBy, id, type } = item;
  const is_farsi = firstCharDetector(description);
  const [evidenceBG, setEvidenceBG] = useState<any>();
  const formContext = useFormContext();
  const { service } = useServiceContext();
  const isEditing = evidenceId === id;
  const deleteEvidence = useQuery({
    service: (args = { id }, config) => service.deleteEvidence(args, config),
    runOnMount: false,
  });

  const onUpdate = async () => {
    formContext.setValue("evidence", description);
    setEvidenceId(id);
    if (type === "Positive") {
      setValue("POSITIVE");
    }
    if (type === "Negative") {
      setValue("NEGATIVE");
    }
    if (type === null) {
      setValue(null);
    }
  };

  const deleteItem = async (e: any) => {
    try {
      await deleteEvidence.query();
      await evidencesQueryData.query();
    } catch (e) {
      const err = e as ICustomError;
      toastError(err);
    }
  };

  useEffect(() => {
    if (type === null) {
      setEvidenceBG({
        background: "#EDF4FC",
        borderColor: "#0A2342",
        borderHover: "#061528",
      });
    }
    if (type === "Positive") {
      setEvidenceBG({
        background: "#EDFCFC",
        borderColor: "#1CC2C4",
        borderHover: "#117476",
      });
    }
    if (type === "Negative") {
      setEvidenceBG({
        background: "#FDF1F5",
        borderColor: "#D81E5B",
        borderHover: "#821237",
      });
    }
  }, [type]);
  const [expanded, setExpanded] = useState<boolean>(false);
  const handleClickOpen = () => {
    setExpanded(true);
  };

  const handleClose = () => {
    setExpanded(false);
  };
  return (
    <Box display="flex" flexDirection="column" width="100%">
      <Box sx={{ display: "flex", gap: 2, mb: 4 }}>
        <Avatar
          {...stringAvatar(createdBy.displayName.toUpperCase())}
          // src={pictureLink}
          sx={{ width: 56, height: 56 }}
        ></Avatar>

        <Box
          sx={{
            px: "32px",
            py: "16px",
            height: "fit-content",
            display: "flex",
            flexDirection: "column",
            // alignItems: "flex-end",
            border: `1px solid ${evidenceBG?.borderColor}`,
            background: evidenceBG?.background,
            color: "#0A2342",
            borderRadius: "0 24px 24px 24px ",
            gap: "16px",
            direction: `${is_farsi ? "rtl" : "ltr"}`,
            textAlign: `${is_farsi ? "right" : "left"}`,
          }}
        >
          {isEditing && (
            <Typography
              sx={{
                fontSize: "18px",
                fontWeight: "bold",
                color: evidenceBG?.borderColor,
              }}
            >
              <Trans i18nKey="editing" />
            </Typography>
          )}
          <Box sx={{ display: "flex", alignItems: "flex-end", gap: "48px" }}>
            <Typography>{description}</Typography>
            <Typography
              fontSize="12px"
              variant="overline"
              sx={{ whiteSpace: "nowrap", lineHeight: "12px" }}
            >
              {formatDate(lastModificationTime)}
            </Typography>
          </Box>
        </Box>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 1,
            justifyContent: "center",
          }}
        >
          <Box sx={{ display: "flex", gap: 1 }}>
            <IconButton
              aria-label="edit"
              size="small"
              sx={{ boxShadow: 2, p: 1 }}
              onClick={onUpdate}
            >
              <EditRoundedIcon fontSize="small" style={{ color: "#1CC2C4" }} />
            </IconButton>
            <IconButton
              aria-label="delete"
              size="small"
              sx={{ boxShadow: 2, p: 1 }}
              onClick={handleClickOpen}
            >
              <DeleteRoundedIcon
                fontSize="small"
                style={{ color: "#D81E5B" }}
              />
            </IconButton>
          </Box>

          <DeleteEvidenceDialog
            expanded={expanded}
            onClose={handleClose}
            onConfirm={deleteItem}
            title={<Trans i18nKey={"areYouSureYouWantDeleteThisEvidence"} />}
            cancelText={<Trans i18nKey={"letMeSeeItAgain"} />}
            confirmText={<Trans i18nKey={"yesDeleteIt"} />}
          />
        </Box>
      </Box>
    </Box>
  );
};

const DeleteEvidenceDialog = (props: any) => {
  const { expanded, onClose, onConfirm, title, cancelText, confirmText } =
    props;
  const fullScreen = useScreenResize("sm");
  return (
    <Dialog
      open={expanded}
      onClose={onClose}
      maxWidth={"sm"}
      // fullScreen={fullScreen}
      fullWidth
      sx={{
        ".MuiDialog-paper": {
          borderRadius: { xs: 0, sm: "32px" },
        },
        ".MuiDialog-paper::-webkit-scrollbar": {
          display: "none",
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        },
      }}
    >
      <DialogContent
        sx={{
          padding: "32px",
          background: "#fff",
          overflowX: "hidden",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          gap: 6,
        }}
      >
        <Typography sx={{ color: "#0A2342" }}>{title}</Typography>

        <Box sx={{ display: "flex", gap: 2 }}>
          <Button
            sx={{
              "&.MuiButton-root": {
                color: "#0A2342",
                border: "1px solid #0A2342",
                borderRadius: "100px",
              },
              "&.MuiButton-root:hover": {
                background: "#CED3D9  ",
                border: "1px solid #0A2342",
              },
            }}
            variant="outlined"
            onClick={onClose}
          >
            {cancelText}
          </Button>
          <Button
            sx={{
              "&.MuiButton-root": {
                color: "#FDF1F5",
                border: "1px solid #D81E5B",
                background: "#D81E5B",
                borderRadius: "100px",
              },
              "&.MuiButton-root:hover": {
                background: "#AD1849  ",
                border: "1px solid #AD1849",
              },
            }}
            variant="contained"
            onClick={onConfirm}
          >
            {confirmText}
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
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
