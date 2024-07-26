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
  IAssessmentKit,
  IAssessmentKitInfo,
  IAssessmentResponse,
  IAttribute,
  IMaturityLevel,
  ISubject,
  ISubjectReport,
  PathInfo,
  RolesType,
} from "@types";
import {
  Checkbox,
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
} from "@mui/material";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import AssessmentExportTitle from "./AssessmentExportTitle";
import { DownloadRounded } from "@mui/icons-material";
import AssessmentSubjectRadarChart from "./AssessmenetSubjectRadarChart";
import AssessmentSubjectRadialChart from "./AssessmenetSubjectRadial";
import { Gauge } from "../common/charts/Gauge";
import { PDFDownloadLink } from "@react-pdf/renderer";
import AssessmentReportPDF from "./AssessmentReportPDF";
import { useEffect, useState } from "react";
import { AttributeStatusBarContainer } from "../subject-report-old/SubjectAttributeCard";

const AssessmentExportContainer = () => {
  const { service } = useServiceContext();
  const { assessmentKitId = "", assessmentId = "" } = useParams();

  const fetchAssessmentsRoles = useQuery<RolesType>({
    service: (args, config) => service.fetchAssessmentsRoles(args, config),
    toastError: false,
    toastErrorOptions: { filterByStatus: [404] },
  });

  const fetchPathInfo = useQuery<PathInfo>({
    service: (args, config) =>
      service.fetchPathInfo({ assessmentId, ...(args || {}) }, config),
    runOnMount: true,
  });

  const AssessmentInfo = useQuery<IAssessmentResponse>({
    service: (args = { assessmentId }, config) =>
      service.AssessmentsLoad(args, config),
    toastError: false,
    toastErrorOptions: { filterByStatus: [404] },
  });

  const AssessmentReport = useQuery({
    service: (args = { assessmentId }, config) =>
      service.fetchAssessment(args, config),
    toastError: false,
    toastErrorOptions: { filterByStatus: [404] },
  });

  const AssessmentKitInfo = useQuery({
    service: (args = { id: assessmentKitId }, config) =>
      service.fetchAssessmentKit(args, config),
    toastError: false,
    toastErrorOptions: { filterByStatus: [404] },
  });

  const [showSpinner, setShowSpinner] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setShowSpinner(false);
    }, 2000);
  }, []);

  return (
    <QueryBatchData
      queryBatchData={[
        AssessmentReport,
        fetchPathInfo,
        AssessmentInfo,
        AssessmentKitInfo,
      ]}
      renderLoading={() => <LoadingSkeletonOfAssessmentRoles />}
      render={([
        data = {},
        pathInfo = {},
        progress,
        assessmentKitInfo = {},
      ]) => {
        const { questionnaires, questionnairesCount } =
          assessmentKitInfo as IAssessmentKitInfo;
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

        const isLowerOrEqual = (score: any, threshold: any) => {
          const scores =
            assessmentKit?.maturityLevels
              ?.sort(
                (elem1: IMaturityLevel, elem2: IMaturityLevel) =>
                  elem1?.index - elem2?.index
              )
              ?.map((level: IMaturityLevel) => level?.title) || [];
          return scores?.indexOf(score) <= scores?.indexOf(threshold);
        };
        return (
          <Box m="auto" pb={3} sx={{ px: { xl: 36, lg: 18, xs: 2, sm: 3 } }}>
            <AssessmentExportTitle pathInfo={pathInfo} />
            <Grid container columns={12} mb={5}>
              <Grid item sm={12} xs={12}>
                <Box display="flex" justifyContent="space-between">
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
                  <PDFDownloadLink
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
                  </PDFDownloadLink>
                </Box>
              </Grid>
            </Grid>

            <Paper sx={{ padding: 3 }}>
              <Typography variant="titleLarge" gutterBottom>
                <Trans i18nKey="assessmentMethodology" />
              </Typography>
              <Typography variant="displaySmall" paragraph>
                <Trans
                  i18nKey="assessmentMethodologyDescription"
                  values={{
                    title: assessment?.title,
                    subjects: subjects
                      ?.map((elem: ISubject, index: number) =>
                        index === 0
                          ? elem?.title + "quality attributes"
                          : index === 1
                          ? elem?.title + "dynamics"
                          : elem?.title
                      )
                      ?.join(", "),
                    maturityLevelsCount:
                      assessment.assessmentKit.maturityLevelCount ?? 5,
                  }}
                />
              </Typography>
              <TableContainer
                component={Paper}
                sx={{ marginBlock: 2, overflow: "hidden" }}
              >
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>
                        <Typography variant="titleMedium">
                          <Trans i18nKey="title" />
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="titleMedium">
                          <Trans i18nKey="description" />
                        </Typography>{" "}
                      </TableCell>
                      <TableCell sx={{ maxWidth: 70 }}>
                        <Typography variant="titleMedium">
                          <Trans i18nKey="level" />
                        </Typography>{" "}
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {assessment.assessmentKit?.maturityLevels.map(
                      (maturityLevel: IMaturityLevel, index: number) => (
                        <TableRow key={index}>
                          <TableCell>
                            {" "}
                            <Typography variant="titleMedium">
                              {maturityLevel?.title}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            {" "}
                            <Typography variant="displaySmall">
                              {maturityLevel?.title}
                            </Typography>
                          </TableCell>
                          <TableCell sx={{ maxWidth: 70 }}>
                            <Gauge
                              level_value={maturityLevel.value ?? 0}
                              maturity_level_status={maturityLevel.title}
                              maturity_level_number={
                                assessmentKit.maturityLevelCount
                              }
                              isMobileScreen={true}
                              hideGuidance={true}
                              height={160}
                              width={175}
                              mb={-8}
                              className="gauge"
                            />
                          </TableCell>
                        </TableRow>
                      )
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
              <Typography variant="titleLarge" gutterBottom>
                <Trans i18nKey="assessmentFocus" />
              </Typography>
              <Typography variant="displaySmall" paragraph>
                <Trans
                  i18nKey="assessmentFocusDescription"
                  values={{
                    subjectsCount: subjects.length,
                    subjects: subjects
                      ?.map((elem: ISubject, index: number) =>
                        index === subjects.length - 1
                          ? " and " + elem?.title
                          : index === 0
                          ? elem?.title
                          : ", " + elem?.title
                      )
                      ?.join(""),
                    attributesCount: subjects.reduce(
                      (previousValue: number, currentValue: ISubject) => {
                        return previousValue + currentValue.attributes.length;
                      },
                      0
                    ),
                  }}
                />
              </Typography>{" "}
              {subjects?.map((subject: ISubject) => (
                <Typography variant="displaySmall" paragraph>
                  <Trans
                    i18nKey="assessmentFocusDescriptionSubject"
                    values={{
                      title: subject.title,
                      description: subject.description,
                    }}
                  />
                </Typography>
              ))}
              <Typography variant="displaySmall" paragraph>
                <Trans i18nKey="assessmentFocusDescriptionLastSection" />
              </Typography>
              <TableContainer component={Paper} sx={{ marginBlock: 2 }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>
                        <Typography variant="titleMedium">
                          <Trans i18nKey="assessmentSubject" />
                        </Typography>{" "}
                      </TableCell>
                      <TableCell>
                        <Typography variant="titleMedium">
                          <Trans i18nKey="assessmentAttribute" />
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="titleMedium">
                          <Trans i18nKey="description" />
                        </Typography>
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {subjects?.map((subject: ISubject, index: number) => (
                      <>
                        {subject?.attributes?.map(
                          (feature: IAttribute, featureIndex: number) => (
                            <TableRow key={featureIndex}>
                              <TableCell>
                                <Typography variant="titleMedium">
                                  {featureIndex === 0 ? subject?.title : ""}
                                </Typography>
                                <br />
                                <Typography variant="displaySmall">
                                  {featureIndex === 0
                                    ? subject?.description
                                    : ""}
                                </Typography>
                              </TableCell>
                              <TableCell>
                                {" "}
                                <Typography variant="displaySmall">
                                  {feature?.title}
                                </Typography>
                              </TableCell>
                              <TableCell>
                                {" "}
                                <Typography variant="displaySmall">
                                  {feature?.description}
                                </Typography>
                              </TableCell>
                            </TableRow>
                          )
                        )}
                      </>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
              <Typography variant="titleLarge" gutterBottom>
                <Trans i18nKey="questionnaires" />
              </Typography>
              <Typography variant="displaySmall" paragraph>
                <Trans
                  i18nKey="questionnairesDescription"
                  values={{ questionnairesCount, questionsCount }}
                />
              </Typography>
              <TableContainer component={Paper} sx={{ marginBlock: 2 }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>
                        <Typography variant="titleMedium">
                          <Trans i18nKey="number" />
                        </Typography>{" "}
                      </TableCell>
                      <TableCell>
                        <Typography variant="titleMedium">
                          <Trans i18nKey="questionnaire" />
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="titleMedium">
                          <Trans i18nKey="description" />
                        </Typography>
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {questionnaires?.map(
                      (questionnaire: any, index: number) => (
                        <TableRow key={index}>
                          <TableCell>
                            {" "}
                            <Typography variant="displaySmall">
                              {index + 1}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            {" "}
                            <Typography variant="titleMedium">
                              {questionnaire?.title}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            {" "}
                            <Typography variant="displaySmall">
                              {questionnaire?.description}{" "}
                            </Typography>
                          </TableCell>
                        </TableRow>
                      )
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
              <Typography variant="titleLarge" gutterBottom>
                Overall Scores by Subject
              </Typography>
              <TableContainer component={Paper} sx={{ marginBlock: 2 }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>
                        <strong></strong>
                      </TableCell>
                      {assessmentKit?.maturityLevels?.map(
                        ({ title }: IMaturityLevel) => (
                          <TableCell>
                            <Typography variant="displaySmall">
                              {title}
                            </Typography>
                          </TableCell>
                        )
                      )}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {subjects?.map(({ id, title, maturityLevel }: ISubject) => (
                      <TableRow key={id}>
                        <TableCell>
                          <Typography variant="displaySmall">
                            {title}
                          </Typography>
                        </TableCell>
                        {assessmentKit?.maturityLevels?.map(
                          ({ title }: IMaturityLevel) => (
                            <TableCell>
                              <Checkbox
                                checked={isLowerOrEqual(
                                  title,
                                  maturityLevel?.title
                                )}
                                disabled
                              />
                            </TableCell>
                          )
                        )}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
              {subjects?.map((subject: ISubject) => (
                <>
                  <Typography variant="titleLarge" gutterBottom>
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
                          assessmentKit.maturityLevelCount ?? 5,
                        attributesCount: subject?.attributes?.length,
                      }}
                    />
                  </Typography>
                  <Box
                    height={subject?.attributes?.length > 2 ? "400px" : "30vh"}
                  >
                    {subject?.attributes?.length > 2 ? (
                      <AssessmentSubjectRadarChart
                        data={subject?.attributes}
                        maturityLevelsCount={
                          assessmentKit.maturityLevelCount ?? 5
                        }
                        loading={false}
                      />
                    ) : (
                      <AssessmentSubjectRadialChart
                        data={subject?.attributes}
                        maturityLevelsCount={
                          assessmentKit.maturityLevelCount ?? 5
                        }
                        loading={false}
                      />
                    )}
                  </Box>
                  <TableContainer
                    component={Paper}
                    sx={{ marginBlock: 2 }}
                    className="checkbox-table"
                  >
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell sx={{ maxWidth: 140 }}>
                            <Typography variant="titleMedium">
                              <Trans i18nKey="attribute" />
                            </Typography>
                          </TableCell>
                          <TableCell sx={{ maxWidth: 300 }}>
                            <Typography variant="titleMedium">
                              <Trans i18nKey="statusReport" />
                            </Typography>
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {subject?.attributes?.map((attribute) => (
                          <TableRow key={attribute?.id}>
                            <TableCell
                              sx={{ maxWidth: 140, wordWrap: "break-word" }}
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
                              sx={{ maxWidth: 300, wordWrap: "break-word" }}
                            >
                              <AttributeStatusBarContainer
                                status={maturityLevel?.title}
                                ml={maturityLevel?.value}
                                cl={Math.ceil(confidenceValue ?? 0)}
                                mn={assessmentKit.maturityLevelCount ?? 5}
                              />
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </>
              ))}
            </Paper>
          </Box>
        );
      }}
    />
  );
};

export default AssessmentExportContainer;
