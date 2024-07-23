import QueryBatchData from "@common/QueryBatchData";
import { useQuery } from "@utils/useQuery";
import { useServiceContext } from "@providers/ServiceProvider";
import { useParams } from "react-router-dom";
import LoadingSkeletonOfAssessmentRoles from "@common/loadings/LoadingSkeletonOfAssessmentRoles";
import { Trans } from "react-i18next";
import { styles } from "@styles";
import { AssessmentKitInfoType, IAssessmentResponse, IAttribute, IMaturityLevel, ISubject, ISubjectReport, PathInfo, RolesType } from "@types";
import { Checkbox, IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import AssessmentExportTitle from "./AssessmentExportTitle";
import { DownloadRounded } from "@mui/icons-material";
import AssessmentSubjectRadarChart from "../assessment-report/AssessmenetSubjectRadarChart";
import AssessmentSubjectRadialChart from "./AssessmenetSubjectRadial";


const tempData = {
  "assessment": {
    "id": "1c60ff3a-cbe4-436a-a9e6-24365d0d6f90",
    "title": "create testtt",
    "assessmentKit": {
      "id": 393,
      "title": "enterprise 2024 enterprise 2024 enterprise 2024",
      "summary": "The tools a team uses in the software development lifecycle somewhat indicate the maturity of its processes and the quality of its product.  The tools a team uses in the software development li",
      "maturityLevelCount": 5,
      "maturityLevels": [
        {
          "id": 2128,
          "title": "Elementary",
          "index": 1,
          "value": 1
        },
        {
          "id": 2129,
          "title": "Weak",
          "index": 2,
          "value": 2
        },
        {
          "id": 2130,
          "title": "Moderate",
          "index": 3,
          "value": 3
        },
        {
          "id": 2131,
          "title": "Good",
          "index": 4,
          "value": 4
        },
        {
          "id": 2132,
          "title": "Great",
          "index": 5,
          "value": 5
        }
      ],
      "expertGroup": {
        "id": 1,
        "title": "Checkup Consulting",
        "picture": null
      },
      questionnaires: [
        { name: "Test & Quality Assurance", explanation: "Manual and automated testing of system functions at various levels, testing qualitative features, use of code analysis tools, techniques for ensuring qualitative features" },
        { name: "Methodology & Documentation", explanation: "Documenting architecture and data model, managing requirements and feedback, project management, risk management" },
        { name: "DevOps", explanation: "CI/CD mechanisms, build and installation mechanisms" },
        { name: "Code Lifecycle", explanation: "Code production and approval process, quality review and release process" },
        { name: "Architecture & Technology", explanation: "Architecture styles and patterns, quality, validity, and up-to-dateness of used technologies" },
        { name: "API & Integration", explanation: "Interaction with other systems, communication standards and protocols" },
        { name: "Log & Monitoring", explanation: "Capability to generate logs and metrics by services, collecting logs and metrics using appropriate tools, creating technical and business dashboards from logs and metrics, sending alerts to stakeholders under defined conditions" },
        { name: "Quality Consequences", explanation: "The quality status of the system from an external view, examining the quality status from the effects of actions" },
        { name: "Operation Environment", explanation: "Actions to be performed in the operational environment, backup mechanisms, periodic actions in the operational environment, mechanisms related to equipment" },
        { name: "Employer Involvement", explanation: "Client's understanding of the status and planning, quantity and quality of client participation in defining requirements, acceptance of important artifacts by the client, client participation in setup and operation" }
      ],
    },
    "maturityLevel": {
      "id": 2128,
      "title": "Elementary",
      "index": 1,
      "value": 1
    },
    "confidenceValue": null,
    "isCalculateValid": true,
    "isConfidenceValid": true,
    "creationTime": "2024-07-20T14:02:23.456212",
    "lastModificationTime": "2024-07-23T08:50:30.021358",
    "space": {
      "id": 6,
      "title": "Flickit Admin"
    }
  },
  "subjects": [
    {
      "id": 528,
      "title": "Software",
      "index": 1,
      "description": "Software description",
      "confidenceValue": null,
      "maturityLevel": {
        "id": 2128,
        "title": "Elementary",
        "index": 1,
        "value": 1
      },
      "attributes": [
        {
          "id": 1961,
          "title": "Software-Reliability",
          "description": "SoftwareReliability description",
          "index": 1,
          "confidenceValue": null,
          "maturityLevel": {
            "id": 2128,
            "title": "Elementary",
            "index": 1,
            "value": 1
          }
        },
        {
          "id": 1962,
          "title": "Software-Efficiency",
          "description": "SoftwareEfficiency description",
          "index": 2,
          "confidenceValue": null,
          "maturityLevel": {
            "id": 2128,
            "title": "Elementary",
            "index": 1,
            "value": 1
          }
        },
        {
          "id": 1963,
          "title": "Software-Maintainability",
          "description": "SoftwareMaintainability description",
          "index": 3,
          "confidenceValue": null,
          "maturityLevel": {
            "id": 2128,
            "title": "Elementary",
            "index": 1,
            "value": 1
          }
        },
        {
          "id": 1964,
          "title": "Software-Usability",
          "description": "SoftwareUsability description",
          "index": 4,
          "confidenceValue": null,
          "maturityLevel": {
            "id": 2128,
            "title": "Elementary",
            "index": 1,
            "value": 1
          }
        }
      ],

    },
    {
      "id": 529,
      "title": "Team",
      "index": 2,
      "description": "Team description",
      "confidenceValue": null,
      "maturityLevel": {
        "id": 2128,
        "title": "Elementary",
        "index": 1,
        "value": 1
      },
      "attributes": [
        {
          "id": 1965,
          "title": "Team-Agile Workflow",
          "description": "TeamAgileWorkflow description",
          "index": 1,
          "confidenceValue": null,
          "maturityLevel": {
            "id": 2128,
            "title": "Elementary",
            "index": 1,
            "value": 1
          }
        },
        {
          "id": 1966,
          "title": "Team-Performance Stability",
          "description": "TeamPerformanceStability description",
          "index": 2,
          "confidenceValue": null,
          "maturityLevel": {
            "id": 2128,
            "title": "Elementary",
            "index": 1,
            "value": 1
          }
        }
      ],
      evidenceData: [
        {
          criterion: "Vendor Lock-in Prevention",
          positive: [
            "Delivery of the architectural document on the organization's knowledge base, especially the participation of the organization's team in drafting the document, which indicates their level of understanding.",
            "Use of common and valid technologies.",
            "Client participation in configuration and operations.",
            "Client access to servers and databases.",
            "Data interaction with a separate Business Intelligence system provider."
          ],
          negative: [
            "Need to update the data model document.",
            "Need to improve the code handover process.",
            "Lack of cloud infrastructure with a separate service provider.",
            "Deficiency in automated testing of quality features.",
            "Absence of acceptance test documents observed by the evaluation team despite requests and follow-ups."
          ]
        },
        {
          criterion: "Employer Effectiveness",
          positive: [
            "Participation of client experts in creating the architectural document, demonstrating their understanding.",
            "Client involvement in configuration and operations.",
            "Client participation in planning for new features and issue resolution.",
            "Some issues recorded in the contractor’s ticketing system."
          ],
          negative: [
            "Lack of systematic recording of all issues in a unified task management system and the ability to view the latest status of each task.",
            "Absence of periodic planning programs for open project tasks.",
            "No mechanism for quickly gathering user feedback.",
            "Lack of a cohesive risk management mechanism."
          ]
        },
        {
          criterion: "Agile Workflow",
          positive: [
            "Presence of automated tests with nearly adequate coverage."
          ],
          negative: [
            "Lack of a cohesive risk management mechanism.",
            "Absence of automated installation and CI/CD mechanisms.",
            "Need to improve the work process on Git and synchronize it with the issue tracker.",
            "Serious weakness in monitoring and logging mechanisms.",
            "Low system installation rate."
          ]
        }
      ]
    }
  ],
  "assessmentPermissions": {
    "manageable": true
  }
}


const AssessmentExportContainer = () => {
  const { service } = useServiceContext();
  const { assessmentId = "" } = useParams();

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


  return (
    <QueryBatchData
      queryBatchData={[AssessmentReport, fetchPathInfo, AssessmentInfo]}
      renderLoading={() => <LoadingSkeletonOfAssessmentRoles />}
      render={([data = {}, pathInfo = {}, progress]) => {
        const {
          assessment,
          subjects,
          assessmentPermissions: { manageable },
        } = data as IAssessmentResponse || {};
        const colorCode = assessment?.color?.code || "#101c32";
        const { assessmentKit, maturityLevel, confidenceValue } =
          assessment || {};
        const { expertGroup } = assessmentKit || {};
        const { questionsCount, answersCount } = progress;


        const isLowerOrEqual = (score: any, threshold: any) => {
          const scores = assessmentKit?.maturityLevels?.sort((elem1: IMaturityLevel, elem2: IMaturityLevel) => elem1?.index - elem2?.index)?.map((level: IMaturityLevel) => level?.title) || []
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
                    <Trans i18nKey="assessmentDocument" />
                  </Typography>
                  <IconButton data-cy="more-action-btn">
                    <DownloadRounded
                      sx={{ fontSize: "1.5rem", margin: "0.2rem" }}
                    />
                  </IconButton>
                </Box>
              </Grid>
            </Grid>

            <Paper sx={{ padding: 3 }}>
              <Typography variant="titleLarge" gutterBottom>
                Evaluation Criteria
              </Typography>
              <Typography variant="displaySmall" paragraph>
                In this evaluation, {subjects?.length} subjects: {subjects?.map((elem: any) => elem?.title)?.join(', ')} were assessed. The table below provides a detailed definition of these subjects and the qualitative features evaluated for each.
              </Typography>
              <Typography variant="titleLarge" gutterBottom>
                Evaluation Subjects and Qualitative Features
              </Typography>
              <TableContainer component={Paper} sx={{ marginBlock: 2 }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell><strong>Subject</strong></TableCell>
                      <TableCell><strong>Explanation</strong></TableCell>
                      <TableCell><strong>Qualitative Feature</strong></TableCell>
                      <TableCell><strong>Explanation</strong></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {subjects?.map((subject: ISubject, index: number) => (
                      <>
                        {subject?.attributes?.map((feature: IAttribute, featureIndex: number) => (
                          <TableRow key={featureIndex}>
                            <TableCell>{featureIndex === 0 ? subject?.title : ""}</TableCell>
                            <TableCell>{featureIndex === 0 ? subject?.description : ""}</TableCell>
                            <TableCell>{feature?.title}</TableCell>
                            <TableCell>{feature?.description}</TableCell>
                          </TableRow>
                        ))}
                      </>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>

              <Typography variant="titleLarge" gutterBottom>
                Qualitative Classification
              </Typography>
              <TableContainer component={Paper} sx={{ marginBlock: 2 }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell><strong>Classification</strong></TableCell>
                      <TableCell><strong>Score</strong></TableCell>
                      <TableCell><strong>Description</strong></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {assessment.assessmentKit?.maturityLevels.map((maturityLevel: IMaturityLevel, index: number) => (
                      <TableRow key={index}>
                        <TableCell>{maturityLevel?.title}</TableCell>
                        <TableCell>{maturityLevel?.value}</TableCell>
                        <TableCell>{maturityLevel?.index}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>

              <Typography variant="titleLarge" gutterBottom>
                Questionnaires
              </Typography>
              <TableContainer component={Paper} sx={{ marginBlock: 2 }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell><strong>Questionnaire</strong></TableCell>
                      <TableCell><strong>Explanation</strong></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {(assessmentKit as any)?.questionnaires?.map((questionnaire: any, index: number) => (
                      <TableRow key={index}>
                        <TableCell>{questionnaire?.name}</TableCell>
                        <TableCell>{questionnaire?.explanation}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>

              <Typography variant="titleLarge" gutterBottom>
                Evaluation Results
              </Typography>
              <Typography variant="displaySmall" paragraph>
                The overall evaluation status of the system is assessed as {assessment?.maturityLevel?.title}. The status of the evaluated subjects and qualitative features of each is stated in the sub-sections. Also, some of the more influential evidence affecting this scoring will be reported.

              </Typography>

              <Typography variant="titleLarge" gutterBottom>
                Overall Evaluation Scores
              </Typography>
              <Typography variant="displaySmall" paragraph>
                In evaluating the project, {subjects?.length} subjects were scrutinized. The qualitative classification of each subject is visible in the table below. It is worth noting that the score of each subject is calculated from the weighted average of its qualitative features. In the following sections of this report, the scores of the qualitative features of each subject will be detailed.
              </Typography>

              <Typography variant="titleLarge" gutterBottom>
                Overall Scores by Subject
              </Typography>
              <TableContainer component={Paper} sx={{ marginBlock: 2 }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell><strong></strong></TableCell>
                      {assessmentKit?.maturityLevels?.map(({ title }: IMaturityLevel) => (
                        <TableCell><strong>{title}</strong></TableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {subjects?.map(({ id, title, maturityLevel }: ISubject) => (
                      <TableRow key={id}>
                        <TableCell>{title}</TableCell>
                        {assessmentKit?.maturityLevels?.map(({ title }: IMaturityLevel) => (
                          <TableCell>
                            <Checkbox checked={isLowerOrEqual(title, maturityLevel?.title)} disabled />
                          </TableCell>))}

                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>

              {subjects?.map((subject: ISubject) => (
                <>
                  <Typography variant="titleLarge" gutterBottom>
                    {subject?.title}
                  </Typography>
                  <TableContainer component={Paper} sx={{ marginBlock: 2 }}>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell><strong></strong></TableCell>
                          {assessmentKit?.maturityLevels?.map(({ title }: IMaturityLevel) => (
                            <TableCell><strong>{title}</strong></TableCell>
                          ))}
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {subject?.attributes?.map((attribute) => (
                          <TableRow key={attribute?.id}>
                            <TableCell>{attribute?.title}</TableCell>
                            {assessmentKit?.maturityLevels?.map(({ title }: IMaturityLevel) => (
                              <TableCell>
                                <Checkbox checked={isLowerOrEqual(title, attribute?.maturityLevel?.title)} disabled />
                              </TableCell>))}
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                  <Box
                    sx={{ display: { xs: "none", sm: "none", md: "block" } }}
                    height={subject?.attributes?.length > 2 ? "400px" : "300px"}
                  >
                    {subject?.attributes?.length > 2 ? (
                      <AssessmentSubjectRadarChart
                        data={subject?.attributes}
                        maturityLevelsCount={assessmentKit.maturityLevelCount ?? 5}
                        loading={false}
                      />
                    ) : (
                      <AssessmentSubjectRadialChart
                        data={subject?.attributes}
                        maturityLevelsCount={assessmentKit.maturityLevelCount ?? 5}
                        loading={false}
                      />
                    )}
                  </Box >
                  < Typography variant="titleLarge" gutterBottom >
                    Evidence for Scores
                  </Typography>
                  <TableContainer component={Paper} sx={{ marginBlock: 2 }}>
                    {(subject as any)?.evidenceData?.map((data: any, index: any) => (
                      <Table>
                        <TableHead>
                          <TableRow>
                            <TableCell><strong>Criterion</strong></TableCell>
                            <TableCell><strong>Positive Evidence</strong></TableCell>
                            <TableCell><strong>Negative Evidence</strong></TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          <TableRow>
                            <TableCell rowSpan={2} style={{ verticalAlign: 'top' }}>{data?.criterion}</TableCell>
                            <TableCell>
                              <ul>
                                {data?.positive?.map((item: any, index: any) => (
                                  <li key={`positive-${data.criterion}-${index}`}>{item}</li>
                                ))}
                              </ul>
                            </TableCell>
                            <TableCell>
                              <ul>
                                {data?.negative?.map((item: any, index: any) => (
                                  <li key={`negative-${data?.criterion}-${index}`}>{item}</li>
                                ))}
                              </ul>
                            </TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    ))}

                  </TableContainer>
                </>

              ))
              }


            </Paper >

          </Box >
        );
      }}
    />
  );
};

export default AssessmentExportContainer;
