import QueryBatchData from "@common/QueryBatchData";
import { useQuery } from "@utils/useQuery";
import { useServiceContext } from "@providers/ServiceProvider";
import { useParams } from "react-router-dom";
import LoadingSkeletonOfAssessmentRoles from "@common/loadings/LoadingSkeletonOfAssessmentRoles";
import { Trans } from "react-i18next";
import { t } from "i18next";
import { styles } from "@styles";
import {
  AssessmentKitInfoType,
  ECustomErrorType,
  IAssessmentKit,
  IAssessmentKitInfo,
  IAssessmentResponse,
  IAttribute,
  IMaturityLevel,
  ISubject,
  ISubjectReport,
  PathInfo,
  RolesType,
  TId,
} from "@types";
import {
  Checkbox,
  Chip,
  CircularProgress,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Link,
  Divider,
} from "@mui/material";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import AssessmentExportTitle from "./AssessmentExportTitle";
import {
  DownloadRounded,
  FiberManualRecordOutlined,
  FiberManualRecordRounded,
  InfoOutlined,
  TableChartRounded,
} from "@mui/icons-material";
import AssessmentSubjectRadarChart from "./AssessmenetSubjectRadarChart";
import AssessmentSubjectRadialChart from "./AssessmenetSubjectRadial";
import { Gauge } from "../common/charts/Gauge";
import { PDFDownloadLink } from "@react-pdf/renderer";
import AssessmentReportPDF from "./AssessmentReportPDF";
import { useCallback, useEffect, useRef, useState } from "react";
import { AttributeStatusBarContainer } from "../subject-report-old/SubjectAttributeCard";
import { AssessmentOverallStatus } from "../assessment-report/AssessmentOverallStatus";
import { ErrorNotFoundOrAccessDenied } from "../common/errors/ErrorNotFoundOrAccessDenied";
import setDocumentTitle from "@/utils/setDocumentTitle";
import { useConfigContext } from "@/providers/ConfgProvider";
import { useQuestionnaire } from "../questionnaires/QuestionnaireContainer";
import { Link as RouterLink } from "react-router-dom";
import html2canvas from "html2canvas";
import ContentCopyOutlinedIcon from '@mui/icons-material/ContentCopyOutlined';
import { toast } from "react-toastify";

const handleCopyAsImage = async (
  element: HTMLDivElement | null,
  setLoading: (loading: boolean) => void
) => {
  if (element) {
    setLoading(true); // Set loading to true when starting the operation
    try {
      const canvas = await html2canvas(element);
      canvas.toBlob(async (blob) => {
        if (blob) {
          const item = new ClipboardItem({ "image/png": blob });
          await navigator.clipboard.write([item]);
          toast.success("Chart content copied as an image!");
        } else {
          console.error("Failed to create blob from canvas.");
        }
      });
    } catch (err) {
      console.error("Failed to copy image to clipboard:", err);
    } finally {
      setLoading(false); // Set loading to false when the operation completes
    }
  }
};

const AssessmentExportContainer = () => {
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const { service } = useServiceContext();
  const { assessmentId = "" } = useParams();
  const [errorObject, setErrorObject] = useState<any>(undefined);
  const { config } = useConfigContext();

  const fetchPathInfo = useQuery<PathInfo>({
    service: (args, config) =>
      service.fetchPathInfo({ assessmentId, ...(args || {}) }, config),
    runOnMount: true,
  });

  const progressInfo = useQuery<IAssessmentResponse>({
    service: (args = { assessmentId }, config) =>
      service.fetchAssessmentTotalProgress(args, config),
    toastError: false,
    toastErrorOptions: { filterByStatus: [404] },
  });

  const AssessmentReport = useQuery({
    service: (args = { assessmentId }, config) =>
      service.fetchAssessment(args, config),
    toastError: false,
    toastErrorOptions: { filterByStatus: [404] },
  });

  const calculateMaturityLevelQuery = useQuery({
    service: (args = { assessmentId }, config) =>
      service.calculateMaturityLevel(args, config),
    runOnMount: false,
  });
  const calculateConfidenceLevelQuery = useQuery({
    service: (args = { assessmentId }, config) =>
      service.calculateConfidenceLevel(args, config),
    runOnMount: false,
  });

  const { questionnaireQueryData } = useQuestionnaire();

  const FetchAttributeData = async (assessmentId: string, attributeId: TId) => {
    try {
      const aiReponse = service
        .fetchAIReport(
          {
            assessmentId,
            attributeId,
          },
          undefined
        )
        .then((res: any) => {
          return res?.data?.content || "";
        });

      return aiReponse;
    } catch (error: any) {
      setErrorObject(error?.response?.data);
      if (error?.response?.data?.code == "CALCULATE_NOT_VALID") {
        await calculateMaturityLevelQuery.query();
        fetchAllAttributesData();
      }
      if (error?.response?.data?.code == "CONFIDENCE_CALCULATION_NOT_VALID") {
        await calculateConfidenceLevelQuery.query();
        fetchAllAttributesData();
      }
      console.error(`Error fetching data for attribute ${attributeId}:`, error);
      return null;
    }
  };

  const LoadAttributeData = async (assessmentId: string, attributeId: TId) => {
    try {
      const aiReponse = service
        .loadAIReport(
          {
            assessmentId,
            attributeId,
          },
          undefined
        )
        .then((res: any) => {
          return res?.data || "";
        });

      return aiReponse;
    } catch (error: any) {
      setErrorObject(error?.response?.data);
      if (error?.response?.data?.code == "CALCULATE_NOT_VALID") {
        await calculateMaturityLevelQuery.query();
        fetchAllAttributesData();
      }
      if (error?.response?.data?.code == "CONFIDENCE_CALCULATION_NOT_VALID") {
        await calculateConfidenceLevelQuery.query();
        fetchAllAttributesData();
      }
      console.error(`Error fetching data for attribute ${attributeId}:`, error);
      return null;
    }
  };

  useEffect(() => {
    const hash = window?.location?.hash?.substring(1);
    if (hash) {
      const scrollToElement = () => {
        const element = document.getElementById(hash);
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        }
      };
      setTimeout(scrollToElement, 500);
    }
  }, []);

  useEffect(() => {
    if (
      AssessmentReport?.errorObject?.response?.data?.code ==
      "CALCULATE_NOT_VALID"
    ) {
      calculateMaturityLevelQuery.query().then(() => {
        AssessmentReport.query();
      });
    }
    if (
      AssessmentReport?.errorObject?.response?.data?.code ==
      "CONFIDENCE_CALCULATION_NOT_VALID"
    ) {
      calculateConfidenceLevelQuery.query().then(() => {
        AssessmentReport.query();
      });
    }
  }, [AssessmentReport?.errorObject]);
  const [showSpinner, setShowSpinner] = useState(true);
  const handleCopyClick = (id: string) => {
    handleCopyAsImage(refs.current[id] || null, (loading) =>
      setLoadingId(loading ? id : null)
    );
  };
  const [attributesData, setAttributesData] = useState<any>({});
  const [editable, setEditable] = useState<any>(true);
  const [ignoreIds, setIgnoreIds] = useState<any>([]);
  const [attributesDataPolicy, setAttributesDataPolicy] = useState<any>({});

  const fetchAllAttributesData = async (ignoreIds: any[] = []) => {
    try {
      const attributesDataPromises = AssessmentReport?.data?.subjects.flatMap(
        (subject: any) =>
          subject?.attributes
            ?.filter((attribute: any) => !ignoreIds.includes(attribute?.id))
            .map(async (attribute: any) => {
              try {
                const result = await FetchAttributeData(
                  assessmentId,
                  attribute?.id
                );
                return {
                  id: attribute?.id,
                  data: result,
                };
              } catch (error) {
                console.error(
                  `Failed to fetch data for attribute ${attribute?.id}:`,
                  error
                );
                return null;
              }
            })
      );
      const allAttributesData = attributesDataPromises.length
        ? await Promise.all(attributesDataPromises)
        : [];

      const attributesDataObject = allAttributesData?.reduce(
        (acc, { id, data }) => {
          acc[id] = data;
          return acc;
        },
        {}
      );
      setAttributesData((prevData: any) => ({
        ...prevData,
        ...attributesDataObject,
      }));
    } catch (error) {
      console.error("Error fetching all attributes data:", error);
    }
  };

  const loadAllAttributesData = async () => {
    const newIgnoreIds: any[] = [];

    const attributesDataPolicyPromises =
      AssessmentReport?.data?.subjects.flatMap((subject: any) =>
        subject?.attributes?.map(async (attribute: any) => {
          const result = await LoadAttributeData(assessmentId, attribute?.id);

          if (!result.editable) {
            setEditable(false);
          }

          const shouldIgnore =
            !result.editable &&
            result?.assessorInsight === null &&
            result?.aiInsight === null;
          if (shouldIgnore) {
            newIgnoreIds.push(attribute?.id);
            return null;
          }

          if (result?.aiInsight?.insight && result?.aiInsight?.isValid) {
            setAttributesData((prevData: any) => ({
              ...prevData,
              [attribute?.id]: result?.aiInsight?.insight,
            }));
            newIgnoreIds.push(attribute?.id);
          }

          if (result?.assessorInsight?.insight) {
            setAttributesData((prevData: any) => ({
              ...prevData,
              [attribute?.id]: result?.assessorInsight?.insight,
            }));
            newIgnoreIds.push(attribute?.id);
          }

          return {
            id: attribute?.id,
            data: result,
          };
        })
      );

    const allAttributesDataPolicy = attributesDataPolicyPromises
      ? await Promise.all(attributesDataPolicyPromises)
      : [];

    // Process the fetched data
    const attributesDataPolicyObject = allAttributesDataPolicy?.reduce(
      (acc, { id, data }) => {
        acc[id] = data;
        return acc;
      },
      {}
    );

    // Update states in one go
    setIgnoreIds(newIgnoreIds);
    setAttributesDataPolicy(attributesDataPolicyObject);
    return newIgnoreIds;
  };

  useEffect(() => {
    setTimeout(() => {
      setShowSpinner(false);
    }, 2000);
  }, []);

  const refs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  const handleSetRef = useCallback(
    (id: string) => (element: HTMLDivElement | null) => {
      refs.current[id] = element;
    },
    []
  );

  return errorObject?.code === ECustomErrorType.ACCESS_DENIED ||
    errorObject?.code === ECustomErrorType.NOT_FOUND ? (
    <ErrorNotFoundOrAccessDenied />
  ) : (
    <QueryBatchData
      queryBatchData={[
        AssessmentReport,
        fetchPathInfo,
        progressInfo,
        questionnaireQueryData,
      ]}
      renderLoading={() => <LoadingSkeletonOfAssessmentRoles />}
      render={([
        data = {},
        pathInfo = {},
        progress,
        questionnaireData = {},
      ]) => {
        const { items } = questionnaireData;
        const {
          assessment,
          subjects,
          assessmentPermissions: { manageable },
        } = (data as IAssessmentResponse) || {};
        const colorCode = assessment?.color?.code || "#101c32";
        const { assessmentKit, maturityLevel, confidenceValue } =
          assessment || {};
        const { expertGroup } = assessmentKit || {};
        const { questionsCount, answersCount } = progress;

        useEffect(() => {
          setDocumentTitle(
            `${t("document", { title: assessment?.title })}`,
            config?.appTitle
          );
        }, [assessment]);

        useEffect(() => {
          const loadAndFetchData = async () => {
            const ignoreIds = await loadAllAttributesData();
            if (questionsCount === answersCount && editable) {
              await fetchAllAttributesData(ignoreIds);
            }
          };

          if (AssessmentReport?.data && assessmentId) {
            loadAndFetchData();
          }
        }, [AssessmentReport?.data, assessmentId]);

        return (
          <Box m="auto" pb={3} sx={{ px: { xl: 36, lg: 18, xs: 2, sm: 3 } }}>
            <AssessmentExportTitle pathInfo={pathInfo} />
            <Grid container columns={12} mb={5}>
              <Grid item sm={12} xs={12}>
                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <Typography
                    color="#00365C"
                    textAlign="left"
                    variant="headlineLarge"
                  >
                    <Trans
                      i18nKey="document"
                      values={{ title: assessment?.title }}
                    />
                  </Typography>
                  {/* <PDFDownloadLink
                    document={
                      <AssessmentReportPDF
                        data={data}
                        progress={progress}
                        assessmentKitInfo={assessmentKitInfo}
                      />
                    }
                    fileName="assessment_report.pdf"
                    style={{ textDecoration: "none" }}
                  >
                    {({ loading }: any) =>
                      loading || showSpinner ? (
                        <IconButton data-cy="more-action-btn">
                          <CircularProgress
                            sx={{ fontSize: "1.5rem", margin: "0.2rem" }}
                          />
                        </IconButton>
                      ) : (
                        <IconButton data-cy="more-action-btn">
                          <DownloadRounded
                            sx={{ fontSize: "1.5rem", margin: "0.2rem" }}
                          />
                        </IconButton>
                      )
                    }
                  </PDFDownloadLink> */}
                </Box>
              </Grid>
            </Grid>

            <Paper
              sx={{
                padding: 5,
                borderRadius: 4,
                position: "relative",
                overflow: "hidden",
              }}
            >
              <Box
                sx={{
                  position: "absolute",
                  top: "5.25rem",
                  right: "-1.75rem",
                  transform: "rotate(45deg)",
                  transformOrigin: "top right",
                  backgroundColor: "#D81E5B",
                  color: "white",
                  padding: "0.5rem 2rem",
                  borderRadius: "4px",
                  fontWeight: "bold",
                  zIndex: 1,
                  display: "inline-block",
                  whiteSpace: "nowrap",
                }}
              >
                Beta Version
              </Box>
              <Grid container spacing={2} flexDirection="row-reverse">
                <Grid
                  item
                  xs={12}
                  md={4}
                  display="flex"
                  justifyContent="flex-start"
                >
                  <Box
                    sx={{
                      position: "sticky",
                      top: "5.25rem",
                      padding: "0.5rem 2rem",
                      borderRadius: "4px",
                      fontWeight: "bold",
                      zIndex: 1,
                    }}
                  >
                    <Typography
                      component="div"
                      mt={4}
                      variant="titleMedium"
                      gutterBottom
                      display="flex"
                      alignItems="center"
                    >
                      <TableChartRounded
                        fontSize="small"
                        sx={{ marginRight: 1 }}
                      />
                      <Trans i18nKey="tableOfContents" />
                    </Typography>
                    <Divider />
                    <Link
                      href="#assessment-methodology"
                      sx={{
                        textDecoration: "none",
                        opacity: 0.9,
                        fontWeight: "bold",
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      <FiberManualRecordRounded
                        sx={{ fontSize: "0.5rem", marginRight: 1 }}
                      />
                      <Typography
                        variant="titleSmall"
                        gutterBottom
                        sx={{
                          textDecoration: "none",
                          opacity: 0.9,
                          fontWeight: "bold",
                          display: "flex",
                          alignItems: "center",
                        }}
                      >
                        <Trans i18nKey="assessmentMethodology" />
                      </Typography>
                    </Link>
                    <Box display="flex" flexDirection="column" paddingLeft={2}>
                      <Link
                        href="#assessment-focus"
                        sx={{
                          textDecoration: "none",
                          opacity: 0.9,
                          fontWeight: "bold",
                          display: "flex",
                          alignItems: "center",
                        }}
                      >
                        <FiberManualRecordOutlined
                          sx={{ fontSize: "0.5rem", marginRight: 1 }}
                        />

                        <Typography
                          variant="titleSmall"
                          gutterBottom
                          sx={{
                            textDecoration: "none",
                            opacity: 0.9,
                            fontWeight: "bold",
                            display: "flex",
                            alignItems: "center",
                          }}
                        >
                          <Trans i18nKey="assessmentFocus" />
                        </Typography>
                      </Link>
                      <Link
                        href="#questionnaires"
                        sx={{
                          textDecoration: "none",
                          opacity: 0.9,
                          fontWeight: "bold",
                          display: "flex",
                          alignItems: "center",
                        }}
                      >
                        <FiberManualRecordOutlined
                          sx={{ fontSize: "0.5rem", marginRight: 1 }}
                        />
                        <Typography
                          variant="titleSmall"
                          gutterBottom
                          sx={{
                            textDecoration: "none",
                            opacity: 0.9,
                            fontWeight: "bold",
                          }}
                        >
                          <Trans i18nKey="questionnaires" />
                        </Typography>
                      </Link>
                    </Box>
                    <Link
                      href="#overall-status-report"
                      sx={{
                        textDecoration: "none",
                        opacity: 0.9,
                        fontWeight: "bold",
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      <FiberManualRecordRounded
                        sx={{ fontSize: "0.5rem", marginRight: 1 }}
                      />
                      <Typography
                        variant="titleSmall"
                        gutterBottom
                        sx={{
                          textDecoration: "none",
                          opacity: 0.9,
                          fontWeight: "bold",
                        }}
                      >
                        <Trans i18nKey="overallStatusReport" />
                      </Typography>
                    </Link>
                    {subjects?.map((subject) => (
                      <Link
                        key={subject?.id}
                        href={`#subject-${subject?.id}`}
                        sx={{
                          textDecoration: "none",
                          opacity: 0.9,
                          fontWeight: "bold",
                          display: "flex",
                          alignItems: "center",
                        }}
                      >
                        <FiberManualRecordRounded
                          sx={{ fontSize: "0.5rem", marginRight: 1 }}
                        />
                        <Typography
                          variant="titleSmall"
                          gutterBottom
                          sx={{
                            textDecoration: "none",
                            opacity: 0.9,
                            fontWeight: "bold",
                          }}
                        >
                          <Trans
                            i18nKey="subjectStatusReport"
                            values={{ title: subject?.title }}
                          />
                        </Typography>
                      </Link>
                    ))}
                  </Box>
                </Grid>
                <Grid item xs={12} md={8}>
                  <Typography
                    component="div"
                    mt={4}
                    id="assessment-methodology"
                    variant="headlineMedium"
                    fontWeight={600}
                    gutterBottom
                  >
                    <Trans i18nKey="assessmentMethodology" />
                  </Typography>
                  <Typography
                    variant="displaySmall"
                    paragraph
                    dangerouslySetInnerHTML={{
                      __html: assessment?.assessmentKit?.about ?? "",
                    }}
                  ></Typography>
                  <Typography
                    variant="titleMedium"
                    gutterBottom
                    component="div"
                  >
                    Maturity Levels:
                  </Typography>
                  <Box component="ol" sx={{ paddingLeft: 6 }}>
                    {assessment?.assessmentKit?.maturityLevels.map(
                      (level, index) => (
                        <Box
                          component="li"
                          key={index}
                          sx={{ marginBottom: 1 }}
                        >
                          <Typography variant="displaySmall">
                            <strong>{level.title}: </strong>
                            {level.description}
                          </Typography>
                        </Box>
                      )
                    )}
                  </Box>
                </Grid>

                <Box paddingLeft={3} maxWidth="100%">
                  <Typography
                    component="div"
                    mt={4}
                    variant="titleLarge"
                    id="assessment-focus"
                    gutterBottom
                  >
                    <Trans i18nKey="assessmentFocus" />
                  </Typography>
                  <Typography variant="displaySmall" paragraph>
                    <Trans
                      i18nKey="assessmentFocusDescription"
                      values={{
                        subjectsCount: subjects?.length,
                        subjects: subjects
                          ?.map((elem: ISubject, index: number) =>
                            index === subjects?.length - 1
                              ? " and " + elem?.title
                              : index === 0
                                ? elem?.title
                                : ", " + elem?.title
                          )
                          ?.join(""),
                        attributesCount: subjects?.reduce(
                          (previousValue: number, currentValue: ISubject) => {
                            return (
                              previousValue + currentValue?.attributes?.length
                            );
                          },
                          0
                        ),
                      }}
                    />
                  </Typography>{" "}
                  {subjects?.map((subject: ISubject) => (
                    <Typography
                      variant="displaySmall"
                      paragraph
                      key={subject?.id}
                    >
                      <Trans
                        i18nKey="assessmentFocusDescriptionSubject"
                        values={{
                          title: subject?.title,
                          description: subject?.description,
                        }}
                      />
                    </Typography>
                  ))}
                  <Typography variant="displaySmall" paragraph>
                    <Trans i18nKey="assessmentFocusDescriptionLastSection" />
                  </Typography>
                  <TableContainer
                    component={Paper}
                    sx={{ marginBlock: 2, borderRadius: 4 }}
                  >
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell
                            sx={{
                              backgroundColor: "#f5f5f5",
                              border: "1px solid rgba(224, 224, 224, 1)",
                            }}
                          >
                            <Typography variant="titleMedium">
                              <Trans i18nKey="assessmentSubject" />
                            </Typography>{" "}
                          </TableCell>
                          <TableCell
                            sx={{
                              backgroundColor: "#f5f5f5",
                              border: "1px solid rgba(224, 224, 224, 1)",
                            }}
                          >
                            <Typography variant="titleMedium">
                              <Trans i18nKey="assessmentAttribute" />
                            </Typography>
                          </TableCell>
                          <TableCell
                            sx={{
                              backgroundColor: "#f5f5f5",
                              border: "1px solid rgba(224, 224, 224, 1)",
                            }}
                          >
                            <Typography variant="titleMedium">
                              <Trans i18nKey="description" />
                            </Typography>
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      {subjects?.map((subject: ISubject, index: number) => (
                        <TableBody key={subject?.id}>
                          {subject?.attributes?.map(
                            (feature: IAttribute, featureIndex: number) => (
                              <TableRow key={featureIndex}>
                                {featureIndex === 0 && (
                                  <TableCell
                                    sx={{
                                      borderRight:
                                        "1px solid rgba(224, 224, 224, 1)",
                                    }}
                                    rowSpan={subject?.attributes?.length}
                                  >
                                    <Typography variant="titleMedium">
                                      {subject?.title}
                                    </Typography>
                                    <br />
                                    <Typography variant="displaySmall">
                                      {subject?.description}
                                    </Typography>
                                  </TableCell>
                                )}
                                <TableCell
                                  sx={{
                                    borderRight:
                                      "1px solid rgba(224, 224, 224, 1)",
                                  }}
                                >
                                  {" "}
                                  <Typography variant="displaySmall">
                                    {feature?.title}
                                  </Typography>
                                </TableCell>
                                <TableCell
                                  sx={{
                                    borderRight:
                                      "1px solid rgba(224, 224, 224, 1)",
                                  }}
                                >
                                  {" "}
                                  <Typography variant="displaySmall">
                                    {feature?.description}
                                  </Typography>
                                </TableCell>
                              </TableRow>
                            )
                          )}
                        </TableBody>
                      ))}
                    </Table>
                  </TableContainer>
                  <Typography
                    variant="titleLarge"
                    gutterBottom
                    component="div"
                    mt={4}
                    id="questionnaires"
                  >
                    <Trans i18nKey="questionnaires" />
                  </Typography>
                  <Typography variant="displaySmall" paragraph>
                    <Trans
                      i18nKey="questionnairesDescription"
                      values={{
                        questionnairesCount: items?.length,
                        questionsCount: items?.reduce(
                          (previousValue: number, currentValue: any) => {
                            return previousValue + currentValue?.questionCount;
                          },
                          0
                        ),
                      }}
                    />
                  </Typography>
                  <TableContainer
                    component={Paper}
                    sx={{ marginBlock: 2, borderRadius: 4 }}
                  >
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell
                            sx={{
                              backgroundColor: "#f5f5f5",
                              borderRight: "1px solid rgba(224, 224, 224, 1)",
                            }}
                          >
                            <Typography variant="titleMedium">
                              <Trans i18nKey="number" />
                            </Typography>{" "}
                          </TableCell>
                          <TableCell
                            sx={{
                              backgroundColor: "#f5f5f5",
                              borderRight: "1px solid rgba(224, 224, 224, 1)",
                            }}
                          >
                            <Typography variant="titleMedium">
                              <Trans i18nKey="questionnaire" />
                            </Typography>
                          </TableCell>
                          <TableCell
                            sx={{
                              backgroundColor: "#f5f5f5",
                              borderRight: "1px solid rgba(224, 224, 224, 1)",
                            }}
                          >
                            <Typography variant="titleMedium">
                              <Trans i18nKey="description" />
                            </Typography>
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {items?.map((questionnaire: any, index: number) => (
                          <TableRow key={index}>
                            <TableCell
                              sx={{
                                borderRight: "1px solid rgba(224, 224, 224, 1)",
                              }}
                            >
                              {" "}
                              <Typography variant="displaySmall">
                                {index + 1}
                              </Typography>
                            </TableCell>
                            <TableCell
                              sx={{
                                borderRight: "1px solid rgba(224, 224, 224, 1)",
                              }}
                            >
                              {" "}
                              <Typography variant="titleMedium">
                                {questionnaire?.title}
                              </Typography>
                            </TableCell>
                            <TableCell
                              sx={{
                                borderRight: "1px solid rgba(224, 224, 224, 1)",
                              }}
                            >
                              {" "}
                              <Typography variant="displaySmall">
                                {questionnaire?.description}{" "}
                              </Typography>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Box>
              </Grid>
              <Typography
                component="div"
                mt={6}
                variant="headlineMedium"
                id="overall-status-report"
                gutterBottom
              >
                <Trans i18nKey="overallStatusReport" />
              </Typography>
              <Typography variant="displaySmall" paragraph>
                <Trans
                  i18nKey="overallStatusReportDescription"
                  values={{
                    maturityLevelTitle: assessment?.maturityLevel?.title,
                    questionCentext:
                      questionsCount === answersCount
                        ? `all ${questionsCount} questions`
                        : `${answersCount} out of ${questionsCount} questions`,
                    confidenceValue: Math?.ceil(confidenceValue ?? 0),
                  }}
                />
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} md={12} lg={6} xl={6}>
                  <IconButton
                    size="small"
                    onClick={() => handleCopyClick("globalChart")}
                    disabled={loadingId === "globalChart"}
                  >
                    {loadingId === "globalChart" ? (
                      <CircularProgress size={24} />
                    ) : (
                      <ContentCopyOutlinedIcon fontSize="small"/>
                    )}
                  </IconButton>
                  <Box
                    sx={{ height: "370px" }}
                    ref={handleSetRef("globalChart")}
                  >
                    {subjects?.length > 2 ? (
                      <AssessmentSubjectRadarChart
                        data={subjects}
                        maturityLevelsCount={
                          assessmentKit?.maturityLevelCount ?? 5
                        }
                        loading={false}
                      />
                    ) : (
                      <AssessmentSubjectRadialChart
                        data={subjects}
                        maturityLevelsCount={
                          assessmentKit?.maturityLevelCount ?? 5
                        }
                        loading={false}
                      />
                    )}
                  </Box>
                </Grid>
                <Grid
                  item
                  xs={12}
                  md={12}
                  lg={6}
                  xl={6}
                  display="flex"
                  flexDirection="column"
                  alignItems="flex-end"
                >
                  <IconButton
                    size="small"
                    onClick={() => handleCopyClick("gauge")}
                    disabled={loadingId === "gauge"}
                  >
                    {loadingId === "gauge" ? (
                      <CircularProgress size={24} />
                    ) : (
                      <ContentCopyOutlinedIcon fontSize="small"/>
                    )}
                  </IconButton>
                  <Box ref={handleSetRef("gauge")}>
                    <Gauge
                      level_value={maturityLevel?.index ?? 0}
                      maturity_level_status={maturityLevel?.title}
                      maturity_level_number={assessmentKit?.maturityLevelCount}
                      confidence_value={confidenceValue}
                      confidence_text={t("withPercentConfidence")}
                      isMobileScreen={false}
                      hideGuidance={true}
                      height={370}
                      mb={-8}
                      maturity_status_guide={t("overallMaturityLevelIs")}
                    />
                  </Box>
                </Grid>
              </Grid>
              <br />
              <br />
              <Typography variant="displaySmall" gutterBottom>
                <Trans i18nKey="subjectsSectionTitle" />
              </Typography>{" "}
              {subjects?.map((subject: ISubject) => (
                <div key={subject?.id}>
                  <Typography
                    component="div"
                    mt={6}
                    variant="headlineMedium"
                    id={`subject-${subject?.id}`}
                    gutterBottom
                  >
                    <Trans
                      i18nKey="subjectStatusReport"
                      values={{ title: subject?.title }}
                    />
                  </Typography>
                  <Typography variant="displaySmall" paragraph>
                    <Trans
                      i18nKey="subjectStatusReportDescription"
                      values={{
                        title: subject?.title,
                        description: subject?.description,
                        confidenceValue: Math?.ceil(
                          subject?.confidenceValue ?? 0
                        ),
                        maturityLevelValue: subject?.maturityLevel?.value,
                        maturityLevelTitle: subject?.maturityLevel?.title,
                        maturityLevelCount:
                          assessmentKit?.maturityLevelCount ?? 5,
                        attributesCount: subject?.attributes?.length,
                      }}
                    />
                  </Typography>
                  <Box display="flex" alignItems="flex-start">
                    <Box
                      height={
                        subject?.attributes?.length > 2 ? "400px" : "30vh"
                      }
                      ref={handleSetRef(subject?.id.toString() || "")}
                      flex={1}
                    >
                      {subject?.attributes?.length > 2 ? (
                        <AssessmentSubjectRadarChart
                          data={subject?.attributes}
                          maturityLevelsCount={
                            assessmentKit?.maturityLevelCount ?? 5
                          }
                          loading={false}
                        />
                      ) : (
                        <AssessmentSubjectRadialChart
                          data={subject?.attributes}
                          maturityLevelsCount={
                            assessmentKit?.maturityLevelCount ?? 5
                          }
                          loading={false}
                        />
                      )}
                    </Box>
                    <IconButton
                      size="small"
                      onClick={() =>
                        handleCopyClick(subject?.id.toString() || "")
                      }
                      disabled={loadingId === subject?.id.toString()}
                    >
                      {loadingId === subject?.id.toString() ? (
                        <CircularProgress size={24} />
                      ) : (
                        <ContentCopyOutlinedIcon fontSize="small"/>
                      )}
                    </IconButton>
                  </Box>
                  <TableContainer
                    component={Paper}
                    sx={{ marginBlock: 2, borderRadius: 4 }}
                    className="checkbox-table"
                  >
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell
                            sx={{
                              maxWidth: 140,
                              backgroundColor: "#f5f5f5",
                              borderRight: "1px solid rgba(224, 224, 224, 1)",
                            }}
                          >
                            <Typography variant="titleMedium">
                              <Trans i18nKey="attribute" />
                            </Typography>
                          </TableCell>
                          <TableCell
                            sx={{
                              maxWidth: 300,
                              backgroundColor: "#f5f5f5",
                              borderRight: "1px solid rgba(224, 224, 224, 1)",
                            }}
                          >
                            <Typography variant="titleMedium">
                              <Trans i18nKey="status" />
                            </Typography>
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {subject?.attributes?.map((attribute, index) => (
                          <TableRow key={attribute?.id}>
                            <TableCell
                              sx={{
                                maxWidth: 140,
                                wordWrap: "break-word",
                                borderRight: "1px solid rgba(224, 224, 224, 1)",
                              }}
                            >
                              <Typography variant="titleMedium">
                                {attribute?.title}
                              </Typography>
                              <br />
                              <Typography variant="displaySmall">
                                {attribute?.description}
                              </Typography>
                            </TableCell>
                            <TableCell
                              className="attribute--statusbar"
                              sx={{
                                maxWidth: 300,
                                wordWrap: "break-word",
                                borderRight: "1px solid rgba(224, 224, 224, 1)",
                                position: "relative",
                              }}
                            >
                              <Box
                                display="flex"
                                flexDirection="column"
                                gap={0.5}
                              >
                                <Box display="flex" alignItems="flex-start">
                                  <Box
                                    ref={handleSetRef(
                                      attribute?.id.toString() || ""
                                    )}
                                    flex={1}
                                  >
                                    <AttributeStatusBarContainer
                                      status={attribute?.maturityLevel?.title}
                                      ml={attribute?.maturityLevel?.value}
                                      cl={Math.ceil(
                                        attribute?.confidenceValue ?? 0
                                      )}
                                      mn={
                                        assessmentKit?.maturityLevelCount ?? 5
                                      }
                                      document
                                    />
                                  </Box>
                                  <IconButton
                                    size="small"
                                    onClick={() =>
                                      handleCopyClick(
                                        attribute?.id.toString() || ""
                                      )
                                    }
                                    disabled={
                                      loadingId === attribute?.id.toString()
                                    } // Disable button when loading
                                  >
                                    {loadingId === attribute?.id.toString() ? (
                                      <CircularProgress size={24} />
                                    ) : (
                                      <ContentCopyOutlinedIcon fontSize="small"/>
                                    )}
                                  </IconButton>
                                </Box>

                                <Box
                                  sx={{
                                    zIndex: 1,
                                    display: attributesDataPolicy[
                                      attribute?.id?.toString()
                                    ]?.aiInsight
                                      ? "flex"
                                      : "none",
                                    justifyContent: "flex-start",
                                  }}
                                >
                                  <Typography
                                    variant="labelSmall"
                                    sx={{
                                      backgroundColor: "#D81E5B",
                                      color: "white",
                                      padding: "0.35rem 0.35rem",
                                      borderRadius: "4px",
                                      fontWeight: "bold",
                                    }}
                                  >
                                    <Trans i18nKey="AIGenerated" />
                                  </Typography>
                                </Box>

                                {attributesData[attribute?.id?.toString()] ? (
                                  <Typography variant="displaySmall">
                                    {attributesData[attribute?.id?.toString()]}
                                  </Typography>
                                ) : (
                                  editable && (
                                    <Typography
                                      variant="titleMedium"
                                      fontWeight={400}
                                      color="#243342"
                                    >
                                      <Trans i18nKey="questionsArentCompleteSoAICantBeGeneratedFirstSection" />{" "}
                                      <Box
                                        component={RouterLink}
                                        to={`./../questionnaires?subject_pk=${subject?.id}`}
                                        sx={{
                                          textDecoration: "none",
                                          color: "#2D80D2",
                                        }}
                                      >
                                        <Typography variant="titleMedium">
                                          questions
                                        </Typography>
                                      </Box>{" "}
                                      <Trans i18nKey="questionsArentCompleteSoAICantBeGeneratedSecondSection" />
                                      .
                                    </Typography>
                                  )
                                )}
                                {attributesDataPolicy[attribute?.id?.toString()]
                                  ?.assessorInsight &&
                                  !attributesDataPolicy[
                                    attribute?.id?.toString()
                                  ]?.assessorInsight?.isValid && (
                                    <Box sx={{ ...styles.centerV }} gap={2}>
                                      <Box
                                        sx={{
                                          zIndex: 1,
                                          display: "flex",
                                          justifyContent: "flex-start",
                                        }}
                                      >
                                        <Typography
                                          variant="labelSmall"
                                          sx={{
                                            backgroundColor: "#d85e1e",
                                            color: "white",
                                            padding: "0.35rem 0.35rem",
                                            borderRadius: "4px",
                                            fontWeight: "bold",
                                          }}
                                        >
                                          <Trans i18nKey="Outdated" />
                                        </Typography>
                                      </Box>
                                      <Box
                                        sx={{
                                          display: "flex",
                                          alignItems: "flex-start",
                                          backgroundColor:
                                            "rgba(255, 249, 196, 0.31)",
                                          padding: 1,
                                          borderRadius: 4,
                                          maxWidth: "100%",
                                        }}
                                      >
                                        <InfoOutlined
                                          color="primary"
                                          sx={{ marginRight: 1 }}
                                        />
                                        <Typography
                                          variant="bodyLarge"
                                          textAlign="left"
                                        >
                                          <Trans i18nKey="invalidInsight" />
                                        </Typography>
                                      </Box>
                                    </Box>
                                  )}
                              </Box>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </div>
              ))}
            </Paper>
          </Box>
        );
      }}
    />
  );
};

export default AssessmentExportContainer;
