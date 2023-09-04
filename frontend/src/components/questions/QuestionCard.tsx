import React, { useEffect, useRef, useState } from "react";
import Box from "@mui/material/Box";
import Checkbox from "@mui/material/Checkbox";
import Paper from "@mui/material/Paper";
import ToggleButton from "@mui/material/ToggleButton";
import Typography from "@mui/material/Typography";
import { Link, useNavigate, useParams } from "react-router-dom";
import QASvg from "@assets/svg/qa.svg";
import AnswerSvg from "@assets/svg/answer.svg";
import Button from "@mui/material/Button";
import AssignmentRoundedIcon from "@mui/icons-material/AssignmentRounded";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import MinimizeRoundedIcon from "@mui/icons-material/MinimizeRounded";
import {
  EAssessmentStatus,
  questionActions,
  useQuestionContext,
  useQuestionDispatch,
  setEvidenceDescription,
} from "@/providers/QuestionProvider";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import { IQuestionInfo, TAnswer, TQuestionsInfo } from "@types";
import { Trans } from "react-i18next";
import { LoadingButton } from "@mui/lab";
import { useServiceContext } from "@providers/ServiceProvider";
import PersonOutlineRoundedIcon from "@mui/icons-material/PersonOutlineRounded";
import { ICustomError } from "@utils/CustomError";
import { toast } from "react-toastify";
import useDialog from "@utils/useDialog";
import {
  Avatar,
  Collapse,
  DialogActions,
  DialogContent,
  Grid,
} from "@mui/material";
import Dialog, { DialogProps } from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import { FormProvider, useForm, useFormContext } from "react-hook-form";
import { styles } from "@styles";
import Title from "@common/Title";
import { InputFieldUC } from "@common/fields/InputField";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import AccessTimeRoundedIcon from "@mui/icons-material/AccessTimeRounded";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import FormControl from "@mui/material/FormControl";
import NativeSelect from "@mui/material/NativeSelect";
import useScreenResize from "@utils/useScreenResize";
import toastError from "@utils/toastError";
import setDocumentTitle from "@utils/setDocumentTitle";
import { t } from "i18next";
import { useQuery } from "@utils/useQuery";
import formatDate from "@utils/formatDate";
import useMenu from "@/utils/useMenu";
import MoreActions from "../common/MoreActions";
import { SubmitOnSelectCheckBox } from "./QuestionContainer";
import QueryData from "../common/QueryData";
interface IQuestionCardProps {
  questionInfo: IQuestionInfo;
  questionsInfo: TQuestionsInfo;
}

export const QuestionCard = (props: IQuestionCardProps) => {
  const { questionInfo, questionsInfo } = props;
  const { title, answer_templates, index = 0, answer } = questionInfo;
  const { questionIndex } = useQuestionContext();
  const abortController = useRef(new AbortController());

  useEffect(() => {
    return () => {
      abortController.current.abort();
    };
  }, []);

  useEffect(() => {
    setDocumentTitle(`${t("question")} ${questionIndex}: ${title}`);
  }, [title]);

  return (
    <Box>
      <Paper
        sx={{
          px: { xs: 2.5, sm: 4, md: 5 },
          py: { xs: 3, sm: 5 },
          backgroundColor: "#273248",
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
          mb: { xs: 0.5, sm: 1, md: 1 },
          maxWidth: "1376px",
          borderRadius: "8px",
        }}
        elevation={3}
      >
        <Box>
          <Box>
            <Typography
              variant="subLarge"
              fontFamily={"Roboto"}
              sx={{ color: "white", opacity: 0.65 }}
            >
              <Trans i18nKey="question" />
            </Typography>
            <Typography
              variant="h4"
              letterSpacing=".05em"
              sx={{
                pt: 0.5,
                fontSize: { xs: "1.4rem", sm: "2rem" },
                fontFamily: { xs: "Roboto", lg: "Roboto" },
              }}
            >
              {title.split("\n").map((line, index) => (
                <React.Fragment key={index}>
                  {line}
                  <br />
                </React.Fragment>
              ))}
            </Typography>
          </Box>
          <QuestionGuide />
          <AnswerTemplate
            abortController={abortController}
            questionInfo={questionInfo}
            questionIndex={questionIndex}
            questionsInfo={questionsInfo}
          />
        </Box>
      </Paper>
      <Box sx={{ px: { xs: 2, sm: 0 } }}>
        <SubmitOnSelectCheckBox />
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
}) => {
  const { submitOnAnswerSelection, isSubmitting, evidences } =
    useQuestionContext();
  const { questionInfo, questionIndex, questionsInfo, abortController } = props;
  const { answer_templates, answer } = questionInfo;
  const { total_number_of_questions, resultId } = questionsInfo;
  const { service } = useServiceContext();
  const dispatch = useQuestionDispatch();
  const { questionnaireId = "" } = useParams();
  const [value, setValue] = useState<TAnswer | null>(answer);
  const navigate = useNavigate();
  const isLastQuestion = questionIndex == total_number_of_questions;
  const isSelectedValueTheSameAsAnswer =
    questionInfo?.answer?.value == value?.value;
  const changeHappened = useRef(false);
  const onChange = (
    event: React.MouseEvent<HTMLElement>,
    v: TAnswer | null
  ) => {
    if (isSelectedValueTheSameAsAnswer) {
      changeHappened.current = true;
    }
    setValue((prevValue) => (prevValue?.value === v?.value ? null : v));
  };
  // first checking if evidences have been submited or not
  const submitQuestion = async () => {
    dispatch(questionActions.setIsSubmitting(true));
    try {
      const res = await service.submitAnswer(
        {
          resultId,
          questionnaireId,
          data: {
            question_id: questionInfo?.id,
            answer: value?.id || null,
          },
        },
        { signal: abortController.current.signal }
      );
      dispatch(questionActions.setIsSubmitting(false));
      dispatch(
        questionActions.setQuestionInfo({ ...questionInfo, answer: value })
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
    if (submitOnAnswerSelection && value && changeHappened.current) {
      submitQuestion();
    }
  }, [value]);

  return (
    <>
      <Box display={"flex"} justifyContent="flex-start">
        <Box
          display={"flex"}
          sx={{
            flexDirection: { xs: "column", md: "row" },
            width: { xs: "100%", sm: "80%", md: "auto" },
          }}
          flexWrap={"wrap"}
        >
          {answer_templates?.map((template) => {
            const { value: templateValue, caption } = template || {};
            return (
              <Box
                key={template.value}
                mb={2}
                mr={2}
                sx={{ minWidth: { xs: "180px", sm: "320px" } }}
              >
                <ToggleButton
                  data-cy="answer-option"
                  color="success"
                  fullWidth
                  size="large"
                  value={template}
                  selected={templateValue === value?.value}
                  onChange={onChange}
                  disabled={isSubmitting}
                  sx={{
                    color: "white",
                    p: { xs: 0.6, sm: 1 },
                    textAlign: "left",
                    fontSize: { xs: "1.15rem", sm: "1.3rem" },
                    fontFamily: { xs: "Roboto", sm: "Roboto" },
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
                    checked={templateValue === value?.value}
                    disabled
                    sx={{
                      position: "absoulte",
                      zIndex: 1,
                      color: "white",
                      p: 0,
                      mr: "8px",
                      opacity: 0.8,
                      "& svg": { fontSize: { xs: "2.1rem", sm: "2.5rem" } },
                      "&.Mui-checked": { color: "white", opacity: 1 },
                      "&.Mui-disabled": { color: "white" },
                    }}
                  />
                  {caption}
                </ToggleButton>
              </Box>
            );
          })}
        </Box>
      </Box>
      <Box
        sx={{
          mt: { xs: 4, md: 1 },
          mr: { xs: 0, md: 2 },
          display: "flex",
          flexDirection: "column",
          ml: "auto",
        }}
      >
        <LoadingButton
          variant="contained"
          color={"info"}
          loading={isSubmitting}
          sx={{
            fontSize: "1.2rem",
            ml: "auto",
          }}
          onClick={submitQuestion}
        >
          <Trans i18nKey={"nextQuestion"} />
        </LoadingButton>
      </Box>
    </>
  );
};

const AnswerDetails = ({ questionInfo }: any) => {
  const dialogProps = useDialog();
  const evidencesQueryData = useQuery({
    service: (args = { questionId: questionInfo.id, assessmentId }, config) =>
      service.fetchEvidences(args, config),
    toastError: true,
  });
  const hasSetCollapse = useRef(false);
  const [collapse, setCollapse] = useState<boolean>(false);
  const { service } = useServiceContext();
  const { assessmentId = "" } = useParams();

  useEffect(() => {
    if (!hasSetCollapse.current && evidencesQueryData.loaded) {
      if (evidencesQueryData.data?.evidences?.length > 0) {
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
              const { evidences } = data;
              return evidences.map((item: any, index: number) => (
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

  return (
    // useEffect(() => {
    //   if (!hasSetCollapse.current && evidencesQueryData.loaded) {
    //     if (evidencesQueryData.data?.evidences?.length > 0) {
    //       setCollapse(true);
    //       hasSetCollapse.current = true;
    //     }
    //   }
    // }, [evidencesQueryData.loaded]);
    <Box mb={4}>
      <Box mt={1} width="100%">
        <Title
          sup={<Trans i18nKey="whyDoWeAskThis" />}
          size="small"
          sx={{ cursor: "pointer",userSelect:"none" }}
          onClick={() => setCollapse(!collapse)}
          mb={1}
        ></Title>
        {/* <Box
          mt={2}
          display={"flex"}
          sx={{ cursor: "pointer" }}
          alignItems="center"
          position={"relative"}
          width="100%"
        >
          {!collapse ? (
            <AddRoundedIcon />
          ) : (
            <MinimizeRoundedIcon sx={{ position: "relative", bottom: "8px" }} />
          )}
        </Box> */}
        <Collapse
          in={collapse}
        >
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
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Aliquam
                minus, accusamus eligendi officiis itaque laborum commodi odit
                culpa nemo at optio quasi obcaecati fugiat suscipit aut, quas
                dolorum reprehenderit vel?
              </Typography>
            </Box>
          </Box>
        </Collapse>
      </Box>
    </Box>
  );
};
type TAnswerTemplate = { caption: string; value: number }[];
