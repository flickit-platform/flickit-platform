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
    theme.breakpoints.down("md")
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
          backgroundColor: expanded ? "rgba(10, 35, 66, 0.07)" : "",
          marginY: 2,
          "& .MuiAccordionSummary-content": {
            maxHeight: { md: "160px" },
          },
        }}
      >
        <Grid container alignItems="center" px={4}>
          <Grid item xs={12} lg={2.5} md={2.5} sm={12}>
            <Box
              sx={{
                maxHeight: "100px",
                overflow: "hidden",
                textOverflow: "ellipsis",
                textAlign: isMobileScreen ? "center" : "start",
                width: "100%",
              }}
            >
              <Typography
                variant="h6"
                sx={{
                  textTransform: "none",
                  whiteSpace: "pre-wrap",
                }}
              >
                {title}
              </Typography>
            </Box>
          </Grid>
          {!isMobileScreen && (
            <Grid item xs={12} lg={4} md={4} sm={12}>
              <Box
                sx={{
                  maxHeight: "100px",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  textAlign: "start",
                  width: "100%",
                  whiteSpace: "pre-wrap",
                  wordBreak: "break-all",
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
            <Grid item xs={12} lg={2} md={2} sm={12}>
              <SubjectStatus title={title} maturity_level={maturityLevel} />
            </Grid>
          )}
          {/* <Grid item xs={12} lg={4} md={12} sm={4}>
            <Box sx={{ ...styles.centerCVH, gap: 2, width: "100%" }}>
              <ColorfulProgress
                questionCount={questionCount}
                answerCount={answerCount}
              />
            </Box>
          </Grid> */}
          <Grid item xs={12} lg={4} md={3.5} sm={12}>
            <Box sx={{ ...styles.centerCVH, gap: 2, width: "100%" }}>
              <Typography> Confidence level</Typography>
              <ConfidenceLevel inputNumber={confidenceValue} displayNumber />
            </Box>
          </Grid>
          {!isMobileScreen && (
            <Grid item xs={6} lg={1} md={1} sm={12}>
              <SubjectStatus title={title} maturity_level={maturityLevel} />
            </Grid>
          )}
        </Grid>
      </AccordionSummary>
      <AccordionDetails sx={{ padding: 0 }}>
        <Grid container alignItems="center" padding={2}>
          <Grid item xs={12} sm={12} md={12} lg={7.5}>
            <Box
              sx={{ display: { xs: "none", sm: "none", md: "block" } }}
              height={"400px"}
            >
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
            sm={12}
            md={12}
            lg={4}
            sx={{
              borderLeft: { md: "0.5px solid rgba(0, 0, 0, 0.32)" },
              paddingLeft: { md: 4 },
            }}
          >
            <Box display="flex" flexDirection="column">
              <Box
                display="flex"
                justifyContent="space-between"
                width="100%"
                px={4}
              >
                <Typography color="#9DA7B3">Attribute</Typography>
                <Typography color="#9DA7B3">Status</Typography>
              </Box>
              <Divider sx={{ width: "100%" }} />
              <Box maxHeight="400px" overflow="auto">
                {subjectAttributes.map((element: any) => {
                  return (
                    <Box
                      display="flex"
                      alignItems="center"
                      justifyContent="space-between"
                      margin={2}
                      gap={1}
                      key={element.id}
                    >
                      <Typography fontWeight="bold" fontSize="14px">
                        {element.title}
                      </Typography>
                      <Box display="flex" alignItems="center" gap={0.5}>
                        <Typography
                          sx={{
                            color:
                              getMaturityLevelColors(5)[
                                element.maturityLevel.value - 1
                              ],
                          }}
                          fontWeight="bold"
                          fontSize="14px"
                        >
                          {element.maturityLevel.title}
                        </Typography>
                        <ConfidenceLevel
                          inputNumber={element.confidenceValue}
                        />
                      </Box>
                    </Box>
                  );
                })}
              </Box>
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
    theme.breakpoints.down("md")
  );
  return (
    <Box
      sx={{
        textAlign: "center",
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
            titleSize={getNumberBaseOnScreen(26, 20, 20, 17, 30)}
            height={getNumberBaseOnScreen(240, 240, 200, 150, 200)}
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
