import React, { useState, useEffect } from "react";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Box,
  Button,
  Grid,
  Typography,
  List,
  ListItem,
  ListItemText,
  Divider,
  useMediaQuery,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Trans } from "react-i18next";
import { Link, useParams } from "react-router-dom";
import QueryStatsRoundedIcon from "@mui/icons-material/QueryStatsRounded";
import StartRoundedIcon from "@mui/icons-material/StartRounded";
import toastError from "@utils/toastError";
import { useQuery } from "@utils/useQuery";
import { useServiceContext } from "@providers/ServiceProvider";
import ColorfulProgress from "../common/progress/ColorfulProgress";
import { Gauge } from "../common/charts/Gauge";
import { getNumberBaseOnScreen } from "@/utils/returnBasedOnScreen";
import { getMaturityLevelColors, styles } from "@styles";
import { ISubjectInfo, IMaturityLevel, TId, ISubjectReportModel } from "@types";
import { ICustomError } from "@/utils/CustomError";
import SubjectRadarChart from "../subject-report/SubjectRadarChart";
import convertToSubjectChartData from "@/utils/convertToSubjectChartData";
import AssessmentSubjectRadarChart from "./AssessmenetSubjectRadarChart";
import ConfidenceLevel from "@/utils/confidenceLevel/confidenceLevel";
import AssessmentSubjectRadialChart from "./AssessmenetSubjectRadial";

interface IAssessmentSubjectCardProps extends ISubjectInfo {
  colorCode: string;
  maturity_level?: IMaturityLevel;
  confidenceValue?: number;
  attributes?: any;
}

interface IAssessmentSubjectProgress {
  id: TId;
  title: string;
  questionCount: number;
  answerCount: number;
}

export const AssessmentSubjectAccordion = (
  props: IAssessmentSubjectCardProps
) => {
  const {
    title,
    maturityLevel,
    confidenceValue,
    id,
    colorCode,
    attributes,
    description = "",
  } = props;
  const { service } = useServiceContext();
  const { assessmentId = "" } = useParams();
  const [progress, setProgress] = useState<number>(0);
  const [questionCount, setQuestionCount] = useState<number>(0);
  const [answerCount, setAnswerCount] = useState<number>(0);
  const [inProgress, setInProgress] = useState<boolean>(false);
  const [expanded, setExpanded] = useState<boolean>(false);
  const [subjectData, setSubjectData] = useState<any>([]);
  const [subjectAttributes, setSubjectAttributes] = useState<any>([]);
  const [radarData, setRadarData] = useState<any>([]);
  const isMobileScreen = useMediaQuery((theme: any) =>
    theme.breakpoints.down("sm")
  );
  const subjectProgressQueryData = useQuery<IAssessmentSubjectProgress>({
    service: (args = { subjectId: id, assessmentId }, config) =>
      service.fetchSubjectProgress(args, config),
    runOnMount: false,
  });

  const fetchProgress = async () => {
    try {
      const data = await subjectProgressQueryData.query();
      const { answerCount, questionCount } = data;
      const total_progress = ((answerCount ?? 0) / (questionCount ?? 1)) * 100;
      setQuestionCount(questionCount);
      setAnswerCount(answerCount);
      setProgress(total_progress);
    } catch (e) {
      const err = e as ICustomError;
      toastError(err);
    }
  };

  useEffect(() => {
    fetchProgress();
    fetchAttributes();
  }, []);

  function hexToRGBA(hex: string, alpha: number) {
    hex = hex.replace(/^#/, "");

    let bigint = parseInt(hex, 16);
    let r = (bigint >> 16) & 255;
    let g = (bigint >> 8) & 255;
    let b = bigint & 255;

    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }

  const subjectQueryData = useQuery<ISubjectReportModel>({
    service: (args, config) => service.fetchSubject(args, config),
    runOnMount: false,
  });

  const fetchAttributes = async () => {
    const data = { data: { attributes } };
    setSubjectAttributes(attributes);
    setRadarData(convertToSubjectChartData(data));
  };

  const handleAccordionChange = (
    event: React.SyntheticEvent,
    isExpanded: boolean
  ) => {
    setExpanded(isExpanded);
    if (isExpanded) {
      fetchAttributes();
    }
  };

  return (
    <Accordion
      expanded={expanded}
      onChange={handleAccordionChange}
      sx={{
        borderRadius: "32px !important",
        boxShadow: "0px 0px 8px 0px rgba(10, 35, 66, 0.25)",
        transition: "background-position .4s ease",
        position: "relative",
      }}
    >
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls="panel1a-content"
        id="panel1a-header"
        sx={{
          borderTopLeftRadius: "32px !important",
          borderTopRightRadius: "32px !important",
          textAlign: "center",
          py: 3,
          maxHeight: { sm: "160px" },
          backgroundColor: expanded ? "rgba(10, 35, 66, 0.07)" : "",
        }}
      >
        <Grid container spacing={2} alignItems="center" px={4}>
          <Grid item xs={12} sm={2}>
            <Box
              sx={{
                maxHeight: "100px",
                overflow: "hidden",
                textOverflow: "ellipsis",
                textAlign: isMobileScreen ? "center" : "start",
                width: "100%",
              }}
            >
              <Typography variant="h6" sx={{ textTransform: "none" }}>
                {title}
              </Typography>
            </Box>
          </Grid>
          {!isMobileScreen && (
            <Grid item xs={12} sm={2}>
              <Box
                sx={{
                  maxHeight: "100px",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  textAlign: "start",
                  width: "100%",
                }}
              >
                <Typography
                  variant="body2"
                  sx={{ textTransform: "none", wordBreak: "break-word" }}
                >
                  {description}
                </Typography>
              </Box>
            </Grid>
          )}
          {isMobileScreen && (
            <Grid item xs={12} sm={2}>
              <SubjectStatus title={title} maturity_level={maturityLevel} />
            </Grid>
          )}
          <Grid item xs={12} sm={4}>
            <Box sx={{ ...styles.centerCVH, gap: 2, width: "100%" }}>
              <ColorfulProgress
                questionCount={questionCount}
                answerCount={answerCount}
              />
            </Box>
          </Grid>
          <Grid item xs={12} sm={2}>
            <Box sx={{ ...styles.centerCVH, gap: 2, width: "100%" }}>
              <Typography> Confidence level</Typography>
              <ConfidenceLevel inputNumber={confidenceValue} displayNumber />
            </Box>
          </Grid>
          {!isMobileScreen && (
            <Grid item xs={6} sm={1}>
              <SubjectStatus title={title} maturity_level={maturityLevel} />
            </Grid>
          )}
        </Grid>
      </AccordionSummary>
      <AccordionDetails sx={{ padding: 0 }}>
        <Grid container alignItems="center" padding={2}>
          <Grid item xs={12} sm={7.5}>
            <Box height={"400px"}>
              {subjectAttributes.length > 2 ? (
                <AssessmentSubjectRadarChart
                  data={subjectAttributes}
                  maturityLevelsCount={5}
                  loading={false}
                />
              ) : (
                <AssessmentSubjectRadialChart
                  data={subjectAttributes}
                  maturityLevelsCount={5}
                  loading={false}
                />
              )}
            </Box>
          </Grid>

          <Grid
            item
            xs={12}
            sm={4}
            sx={{
              borderLeft: "0.5px solid rgba(0, 0, 0, 0.32)",
              paddingLeft: 4,
            }}
          >
            <Box display="flex" flexDirection="column">
              <Box
                display="flex"
                justifyContent="space-between"
                width="100%"
                px={2}
              >
                <Typography variant="subtitle1" fontWeight="bold">
                  Subject
                </Typography>
                <Typography variant="subtitle1" fontWeight="bold">
                  Status
                </Typography>
              </Box>
              <Divider sx={{ width: "100%" }} />
              {subjectAttributes.map((element: any) => {
                return (
                  <Box
                    display="flex"
                    justifyContent="space-between"
                    margin={2}
                    key={element.id}
                  >
                    <Typography>{element.title}</Typography>
                    <Box display="flex" gap={0.5}>
                      <Typography
                        sx={{
                          color:
                            getMaturityLevelColors(5)[
                              element.maturityLevel.value - 1
                            ],
                        }}
                      >
                        {element.maturityLevel.title}
                      </Typography>
                      <ConfidenceLevel inputNumber={element.confidenceValue} />
                    </Box>
                  </Box>
                );
              })}
            </Box>
          </Grid>
        </Grid>
        <Box mt="auto">
          <Button
            color="success"
            variant="outlined"
            size="large"
            fullWidth
            component={Link}
            to={progress === 100 ? `./${id}#insight` : `./${id}`}
            sx={{
              borderRadius: 0,
              borderBottomRightRadius: "32px",
              borderBottomLeftRadius: "32px",
              padding: 2,
              textTransform: "none",
              fontSize: 24,
              backgroundColor: "#D2F3F3",
              borderColor: "#D2F3F3",
              color: "#1CC2C4",
              "&:hover": {
                backgroundColor: "#D2F3F3",
                borderColor: "#D2F3F3",
              },
            }}
          >
            <Trans i18nKey={"checkMoreDetails"} />
          </Button>
        </Box>
      </AccordionDetails>
    </Accordion>
  );
};

const SubjectStatus = (
  props: Pick<IAssessmentSubjectCardProps, "title" | "maturity_level">
) => {
  const { title, maturity_level } = props;
  const colorPallet = getMaturityLevelColors(maturity_level?.index ?? 0);
  const hasStats = maturity_level?.index ? true : false;
  const isMobileScreen = useMediaQuery((theme: any) =>
    theme.breakpoints.down("sm")
  );
  return (
    <Box
      sx={{
        textAlign: "center",
        paddingTop: isMobileScreen ? "unset" : 6,
        marginRight: isMobileScreen ? "unset" : -10,
      }}
    >
      <Box>
        {hasStats ? (
          <Gauge
            maturity_level_number={5}
            maturity_level_status={maturity_level?.title ?? ""}
            level_value={maturity_level?.index ?? 0}
            shortTitle={true}
            titleSize={20}
            height={getNumberBaseOnScreen(140, 140, 140, 150, 180)}
          />
        ) : (
          <Typography>
            <Trans i18nKey="notEvaluated" />
          </Typography>
        )}
      </Box>
    </Box>
  );
};
