import Box from "@mui/material/Box";
import Checkbox from "@mui/material/Checkbox";
import Paper from "@mui/material/Paper";
import ToggleButton from "@mui/material/ToggleButton";
import Typography from "@mui/material/Typography";
import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import QASvg from "../../assets/svg/qa.svg";
import AnswerSvg from "../../assets/svg/answer.svg";
import Button from "@mui/material/Button";
import AssignmentRoundedIcon from "@mui/icons-material/AssignmentRounded";
import {
  EAssessmentStatus,
  metricActions,
  useMetricContext,
  useMetricDispatch,
} from "../../providers/MetricProvider";
import { IMetricInfo, TAnswer, TMetricsInfo } from "../../types";
import { Trans } from "react-i18next";
import { LoadingButton } from "@mui/lab";
import { useServiceContext } from "../../providers/ServiceProvider";
import PersonOutlineRoundedIcon from "@mui/icons-material/PersonOutlineRounded";
import { ICustomError } from "../../utils/CustomError";
import { toast } from "react-toastify";
import useDialog from "../../utils/useDialog";
import {
  Avatar,
  Collapse,
  DialogActions,
  DialogContent,
  Grid,
} from "@mui/material";
import Dialog, { DialogProps } from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import { FormProvider, useForm } from "react-hook-form";
import { styles } from "../../config/styles";
import Title from "../../components/shared/Title";
import { InputFieldUC } from "../../components/shared/fields/InputField";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import AccessTimeRoundedIcon from "@mui/icons-material/AccessTimeRounded";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import FormControl from "@mui/material/FormControl";
import NativeSelect from "@mui/material/NativeSelect";
import useScreenResize from "../../utils/useScreenResize";
import toastError from "../../utils/toastError";

interface IMetricCardProps {
  metricInfo: IMetricInfo;
  metricsInfo: TMetricsInfo;
}

export const MetricCard = (props: IMetricCardProps) => {
  const { metricInfo, metricsInfo } = props;
  const { title, answer_templates, index = 0, answer } = metricInfo;
  const { metricIndex } = useMetricContext();
  const abortController = useRef(new AbortController());

  useEffect(() => {
    return () => {
      abortController.current.abort();
    };
  }, []);

  return (
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
        mx: { xs: 1, sm: 3, md: 5 },
        mb: { xs: 0.5, sm: 1, md: 1 },
        borderRadius: "8px",
      }}
      elevation={3}
    >
      <Box>
        <Box>
          <Typography
            variant="subLarge"
            fontFamily={"RobotoRegular"}
            sx={{ color: "white", opacity: 0.65 }}
          >
            <Trans i18nKey="question" />
          </Typography>
          <Typography
            variant="h4"
            letterSpacing=".05em"
            sx={{
              pt: 0.5,
              pb: 5,
              fontSize: { xs: "1.4rem", sm: "2rem" },
              fontFamily: { xs: "RobotoRegular", lg: "RobotoMedium" },
            }}
          >
            {title}
          </Typography>
        </Box>
        <AnswerTemplate
          abortController={abortController}
          metricInfo={metricInfo}
          metricIndex={metricIndex}
          metricsInfo={metricsInfo}
        />
      </Box>
    </Paper>
  );
};

const AnswerTemplate = (props: {
  metricInfo: IMetricInfo;
  metricIndex: number;
  metricsInfo: TMetricsInfo;
  abortController: React.MutableRefObject<AbortController>;
}) => {
  const { submitOnAnswerSelection, isSubmitting } = useMetricContext();
  const { metricInfo, metricIndex, metricsInfo, abortController } = props;
  const { answer_templates, answer } = metricInfo;
  const { total_number_of_metrics, resultId } = metricsInfo;
  const { service } = useServiceContext();
  const dispatch = useMetricDispatch();
  const { categoryId = "" } = useParams();
  const [value, setValue] = useState<TAnswer | null>(answer);
  const navigate = useNavigate();
  const isLastMetric = metricIndex == total_number_of_metrics;
  const isSelectedValueTheSameAsAnswer =
    metricInfo?.answer?.value == value?.value;
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

  const submitQuestion = async () => {
    dispatch(metricActions.setIsSubmitting(true));
    try {
      const res = await service.submitAnswer(
        {
          resultId,
          categoryId,
          data: {
            metric_id: metricInfo?.id,
            answer: value?.id || null,
          },
        },
        { signal: abortController.current.signal }
      );
      dispatch(metricActions.setIsSubmitting(false));
      dispatch(metricActions.setMetricInfo({ ...metricInfo, answer: value }));
      if (isLastMetric) {
        dispatch(metricActions.setAssessmentStatus(EAssessmentStatus.DONE));
        navigate(`../completed`);
        return;
      }
      if (value) {
        dispatch(
          metricActions.setAssessmentStatus(EAssessmentStatus.INPROGRESS)
        );
      }
      const newMetricIndex = metricIndex + 1;
      dispatch(metricActions.goToMetric(newMetricIndex));
      navigate(`../${newMetricIndex}`, {
        replace: newMetricIndex === 1 ? true : false,
      });
    } catch (e) {
      dispatch(metricActions.setIsSubmitting(false));
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
          {answer_templates.map((template) => {
            const { value: templateValue, caption } = template;
            return (
              <Box
                key={template.value}
                mb={2}
                mr={2}
                sx={{ minWidth: { xs: "180px", sm: "320px" } }}
              >
                <ToggleButton
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
                    fontFamily: { xs: "RobotoRegular", sm: "RobotoMedium" },
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
        display={"flex"}
        justifyContent="space-between"
        sx={{
          flexDirection: { xs: "column", md: "row" },
          alignItems: { xs: "stretch", md: "flex-end" },
        }}
      >
        {/* {!submitOnAnswerSelection && (
          <MyAnswer answer_templates={answer_templates} value={value} />
        )} */}
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
      </Box>
    </>
  );
};

const MyAnswer = ({ answer_templates, value }: any) => {
  const dialogProps = useDialog();
  const caption = answer_templates.find(
    (temp: any) => temp.value === value?.value
  )?.caption;

  return (
    <Collapse in={!!caption} sx={{ flex: 1 }}>
      <Box
        mt={8}
        sx={{
          flex: 1,
          mr: { xs: 0, md: 4 },
          position: "relative",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Box mb={1.8}>
          <Typography
            variant="subLarge"
            fontFamily={"RobotoRegular"}
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
            <Box
              display="flex"
              alignItems={"baseline"}
              sx={{ flexDirection: { xs: "column", sm: "row" } }}
            >
              <Typography>
                <Trans i18nKey={"myConfidenceLevelOnThisQuestionIs"} />
              </Typography>
              <Box
                width="90px"
                sx={{ ml: { xs: 0, sm: 1 }, mt: { xs: 1, sm: 0 } }}
                position="relative"
                bottom="1px"
              >
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
        </Box>
        <Box>
          <Typography
            variant="subLarge"
            fontFamily={"RobotoRegular"}
            component={Link}
            to="#"
            sx={{ color: "white", opacity: 0.5, textDecoration: "none" }}
          >
            <Trans i18nKey="gotAnyEvidence" />
          </Typography>
          <Box
            display="flex"
            alignItems={"baseline"}
            sx={{
              flexDirection: "column",
            }}
          >
            <Box
              display="flex"
              alignItems={"baseline"}
              sx={{ flexDirection: { xs: "column", sm: "row" } }}
            >
              <Typography>
                <Trans i18nKey={"noEvidenceYet"} />
              </Typography>
              <Button
                sx={{ ml: { xs: -1, sm: 1 }, minWidth: "112px" }}
                onClick={() => {
                  dialogProps.openDialog({});
                }}
              >
                <Trans i18nKey="addEvidence" />
              </Button>
            </Box>
            <Evidence {...dialogProps} />
          </Box>
        </Box>
      </Box>
    </Collapse>
  );
};

const Evidence = (props: any) => {
  const { onClose: closeDialog, ...rest } = props;
  const formMethods = useForm({ shouldUnregister: true });

  const onSubmit = async (data: any) => {};

  const fullScreen = useScreenResize("sm");

  return (
    <Dialog
      {...rest}
      onClose={() => {
        closeDialog();
      }}
      fullWidth
      maxWidth="lg"
      fullScreen={fullScreen}
    >
      <DialogTitle
        textTransform={"uppercase"}
        sx={{ ...styles.centerV, px: { xs: 1.5, sm: 3 } }}
      >
        <AssignmentRoundedIcon sx={{ mr: 1 }} />
        <Trans i18nKey="evidence" />
      </DialogTitle>
      <DialogContent
        sx={{
          display: "flex",
          flexDirection: "column",
          px: { xs: 1.5, sm: 3 },
        }}
      >
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
                />
              </Grid>
              <Grid item xs={12}>
                <Box display={"flex"}>
                  <LoadingButton sx={{ ml: "auto" }} type="submit">
                    <Trans i18nKey={"addEvidence"} />
                  </LoadingButton>
                </Box>
              </Grid>
            </Grid>
            <Box mt={4}>
              <Title size="small">
                <Trans i18nKey="listOfEvidence" />
              </Title>
              <Box>
                <Box display="flex" flexDirection="column">
                  <ListItem
                    sx={{ px: 0.5, borderBottom: "1px solid #e9e8e8", mb: 1 }}
                  >
                    <ListItemIcon
                      sx={{
                        minWidth: "45px",
                        display: { xs: "none", sm: "inline-flex" },
                      }}
                    >
                      <AssignmentRoundedIcon />
                    </ListItemIcon>
                    <ListItemText
                      sx={{ pr: 2 }}
                      primary="Sing sda sd da sdasda sda  asdf asd fa dsfa df asdf ads fa dsf sdasd asdas asd asd asd asdasda sdas das dasle-line "
                    />
                    <Box display="flex" sx={{ flexDirection: "column" }}>
                      <Box sx={{ ...styles.centerV }}>
                        <AccessTimeRoundedIcon
                          sx={{ mr: 0.7, color: "gray" }}
                          fontSize="small"
                        />
                        2022/02/01
                      </Box>
                      <Box sx={{ ...styles.centerV }}>
                        <PersonOutlineRoundedIcon
                          sx={{ mr: 0.7, color: "gray" }}
                          fontSize="small"
                        />
                        erfan kaboli
                      </Box>
                    </Box>
                  </ListItem>
                </Box>
              </Box>
            </Box>
            <DialogActions
              sx={{
                marginTop: fullScreen ? "auto" : (theme) => theme.spacing(4),
              }}
            >
              <Grid container spacing={2} justifyContent="flex-end">
                <Grid item>
                  <Button onClick={closeDialog}>
                    <Trans i18nKey="close" />
                  </Button>
                </Grid>
              </Grid>
            </DialogActions>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
};

type TAnswerTemplate = { caption: string; value: number }[];
