import React, { useState, useEffect } from "react";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Box,
  Button,
  Grid,
  Typography,
  Divider,
  useMediaQuery,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Trans } from "react-i18next";
import { Link, useParams } from "react-router-dom";
import toastError from "@utils/toastError";
import { useQuery } from "@utils/useQuery";
import { useServiceContext } from "@providers/ServiceProvider";
import { Gauge } from "../common/charts/Gauge";
import { getNumberBaseOnScreen } from "@/utils/returnBasedOnScreen";
import { getMaturityLevelColors, styles } from "@styles";
import { ISubjectInfo, IMaturityLevel, TId, ISubjectReportModel } from "@types";
import { ICustomError } from "@/utils/CustomError";
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
  const [expanded, setExpanded] = useState<boolean>(false);
  const [subjectAttributes, setSubjectAttributes] = useState<any>([]);
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

  const fetchAttributes = async () => {
    setSubjectAttributes(attributes);
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
          "& .MuiAccordionSummary-content": {
            maxHeight: { md: "160px", lg: "160px" },
            paddingLeft: { md: "1rem", lg: "1rem" },
          },
        }}
      >
        <Grid container alignItems="center">
          <Grid item xs={12} lg={2.8} md={2.8} sm={12}>
            <Box
              sx={{
                overflow: "hidden",
                textOverflow: "ellipsis",
                textAlign: "center",
                width: "100%",
              }}
            >
              <Typography
                color="#3B4F68"
                sx={{
                  textTransform: "none",
                  whiteSpace: "pre-wrap",
                  fontSize: "1.75rem",
                }}
                fontWeight={700}
              >
                {title}
              </Typography>
            </Box>
          </Grid>
          {!isMobileScreen && (
            <Grid item xs={12} lg={4.2} md={4.2} sm={12}>
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
                  color="rgba(157, 167, 179, 1)"
                  sx={{ textTransform: "none", whiteSpace: "break-spaces" }}
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
          <Grid item xs={12} lg={3} md={3} sm={12}>
            <Box
              sx={{
                ...styles.centerCVH,
                gap: 2,
                width: "100%",
                mt: { xs: "-72px", sm: "-72px", md: "0" },
              }}
            >
              <Typography
                fontWeight={500}
                fontSize="1rem"
                color="rgba(108, 123, 142, 1)"
              >
                <Trans i18nKey="confidenceLevel" />
              </Typography>
              <ConfidenceLevel inputNumber={confidenceValue} displayNumber />
            </Box>
          </Grid>
          {!isMobileScreen && (
            <Grid item xs={6} lg={2} md={2} sm={12}>
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
                marginBottom="10px"
              >
                <Typography fontWeight={500} color="#73808C">
                  Attribute
                </Typography>
                <Typography fontWeight={500} color="#73808C">
                  Status
                </Typography>
              </Box>
              <Divider sx={{ width: "100%" }} />
              <Box
                sx={{ ...styles.centerCV }}
                maxHeight="400px"
                overflow="auto"
                gap="1.875rem"
                marginTop="1.875rem"
              >
                {subjectAttributes.map((element: any) => {
                  return (
                    <Box
                      display="flex"
                      alignItems="center"
                      justifyContent="space-between"
                      gap={1}
                      key={element.id}
                    >
                      <Typography fontWeight={500} color="#243342">
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
                          fontWeight={500}
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
              fontFamily: "Ubuntu",
              borderRadius: 0,
              borderBottomRightRadius: "32px",
              borderBottomLeftRadius: "32px",
              padding: 2,
              textTransform: "none",
              fontWeight: 700,
              fontSize: "2rem",
              backgroundColor: "#D0ECFF",
              borderColor: "#D0ECFF",
              color: "#00365C",
              letterSpacing: "0",
              "&:hover": {
                backgroundColor: "#D0ECFF",
                borderColor: "#D0ECFF",
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
        marginBottom: isMobileScreen ? "unset" : -3,
      }}
    >
      <Box>
        {hasStats ? (
          <Gauge
            maturity_level_number={5}
            isMobileScreen={isMobileScreen ? false : true}
            maturity_level_status={maturity_level?.title ?? ""}
            level_value={maturity_level?.index ?? 0}
            hideGuidance={true}
            height={getNumberBaseOnScreen(240, 240, 200, 150, 150)}
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
