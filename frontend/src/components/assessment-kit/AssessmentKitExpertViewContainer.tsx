import React, { useEffect, useMemo, useState } from "react";
import { Box, Button, Typography, Alert } from "@mui/material";
import { useServiceContext } from "@providers/ServiceProvider";
import { useParams } from "react-router-dom";
import { useQuery } from "@utils/useQuery";
import Title from "@common/TitleComponent";
import { Trans } from "react-i18next";
import Tab from "@mui/material/Tab";
import TabList from "@mui/lab/TabList";
import { styles, getMaturityLevelColors } from "@styles";
import TabPanel from "@mui/lab/TabPanel";
import TabContext from "@mui/lab/TabContext";
import Tabs from "@mui/material/Tabs";
import Grid from "@mui/material/Grid";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Divider from "@mui/material/Divider";
import AssessmentKitSectionGeneralInfo from "./AssessmentKitSectionGeneralInfo";
import ListAccordion from "@common/lists/ListAccordion";
import setDocumentTitle from "@utils/setDocumentTitle";
import { t } from "i18next";
import useDialog from "@utils/useDialog";
import SupTitleBreadcrumb from "@common/SupTitleBreadcrumb";
import languageDetector from "@utils/languageDetector";
import toastError from "@utils/toastError";
import { ICustomError } from "@utils/CustomError";
import CloudDownloadRoundedIcon from "@mui/icons-material/CloudDownloadRounded";
import CloudUploadRoundedIcon from "@mui/icons-material/CloudUploadRounded";
import { CEDialog, CEDialogActions } from "@common/dialogs/CEDialog";
import { useForm } from "react-hook-form";
import UploadField from "@common/fields/UploadField";
import FormProviderWithForm from "@common/FormProviderWithForm";
import { AssessmentKitDetailsType } from "@types";
import convertToBytes from "@/utils/convertToBytes";
import { useConfigContext } from "@/providers/ConfgProvider";
import { primaryFontFamily, theme } from "@/config/theme";

const AssessmentKitExpertViewContainer = () => {
  const { fetchAssessmentKitDetailsQuery, fetchAssessmentKitDownloadUrlQuery } =
    useAssessmentKit();
  const dialogProps = useDialog();
  const { config } = useConfigContext();
  const [update, setForceUpdate] = useState<boolean>(false);
  const { expertGroupId } = useParams();
  const [details, setDetails] = useState<AssessmentKitDetailsType>();
  const [expertGroup, setExpertGroup] = useState<any>();
  const [assessmentKitTitle, setAssessmentKitTitle] = useState<any>();
  const [hasActiveVersion, setHasActiveVersion] = useState<any>(false);
  const [loaded, setLoaded] = React.useState<boolean | false>(false);

  const AssessmentKitDetails = async () => {
    const data: AssessmentKitDetailsType = hasActiveVersion
      ? await fetchAssessmentKitDetailsQuery.query()
      : undefined;
    setDetails(data);
  };
  const handleDownload = async () => {
    try {
      const response = await fetchAssessmentKitDownloadUrlQuery.query();
      const fileUrl = response.url;
      const a = document.createElement("a");
      a.href = fileUrl;
      a.download = "file_name.zip";
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch (e) {
      const err = e as ICustomError;
      toastError(err);
    }
  };
  useEffect(() => {
    if (!loaded) {
      AssessmentKitDetails();
    }
  }, [loaded, update, hasActiveVersion]);
  useEffect(() => {
    setDocumentTitle(
      `${t("assessmentKit")}: ${assessmentKitTitle || ""}`,
      config.appTitle,
    );
  }, [assessmentKitTitle]);
  return (
    <Box>
      <Box sx={{ flexDirection: { xs: "column", sm: "row" } }}>
        <Title
          backLink={"/"}
          size="large"
          wrapperProps={{
            sx: {
              flexDirection: { xs: "column", md: "row" },
              alignItems: { xs: "flex-start", md: "flex-end" },
            },
          }}
          sup={
            <SupTitleBreadcrumb
              routes={[
                {
                  title: t("expertGroups") as string,
                  to: `/user/expert-groups`,
                },
                // {
                //   title: expertGroup?.title,
                //   to: `/user/expert-groups/${expertGroupId}`,
                // },
                {
                  title: assessmentKitTitle,
                },
              ]}
              displayChip
            />
          }
          toolbar={
            <Box>
              <Button
                variant="contained"
                size="small"
                sx={{ ml: 2 }}
                onClick={() => {
                  dialogProps.openDialog({});
                }}
              >
                <Typography mr={1} variant="button">
                  <Trans i18nKey="updateDSL" />
                </Typography>
                <CloudUploadRoundedIcon />
              </Button>
              <Button
                variant="contained"
                size="small"
                sx={{ ml: 2 }}
                onClick={handleDownload}
              >
                <Typography mr={1} variant="button">
                  <Trans i18nKey="downloadDSL" />
                </Typography>
                <CloudDownloadRoundedIcon />
              </Button>
            </Box>
          }
        >
          {assessmentKitTitle}
        </Title>
        <Box mt={3}>
          <AssessmentKitSectionGeneralInfo
            setExpertGroup={setExpertGroup}
            setAssessmentKitTitle={setAssessmentKitTitle}
            setHasActiveVersion={setHasActiveVersion}
          />
          <UpdateAssessmentKitDialog
            setForceUpdate={setForceUpdate}
            setLoaded={setLoaded}
            loaded={loaded}
            {...dialogProps}
          />
          <AssessmentKitSectionsTabs update={update} details={details} />
        </Box>
      </Box>
    </Box>
  );
};
const AssessmentKitSectionsTabs = (props: {
  details: any;
  update: boolean;
}) => {
  const { fetchAssessmentKitDetailsQuery } = useAssessmentKit();
  const [value, setValue] = useState("maturityLevels");
  const handleTabChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };
  const { details, update } = props;
  return (
    <Box mt={6}>
      {details && (
        <TabContext value={value}>
          <Box>
            <TabList onChange={handleTabChange}>
              <Tab
                label={
                  <Box sx={{ ...styles.centerV }}>
                    <Trans i18nKey="maturityLevels" />
                  </Box>
                }
                value="maturityLevels"
              />
              <Tab
                label={
                  <Box sx={{ ...styles.centerV }}>
                    <Trans i18nKey="subjects" />
                  </Box>
                }
                value="subjects"
              />
              <Tab
                label={
                  <Box sx={{ ...styles.centerV }}>
                    <Trans i18nKey="questionnaires" />
                  </Box>
                }
                value="questionnaires"
              />
            </TabList>
          </Box>
          <TabPanel value="subjects" sx={{ py: { xs: 1, sm: 3 }, px: 0.2 }}>
            <AssessmentKitSubjects details={details.subjects} update={update} />
          </TabPanel>
          <TabPanel
            value="questionnaires"
            sx={{ py: { xs: 1, sm: 3 }, px: 0.2 }}
          >
            <AssessmentKitQuestionnaires
              update={update}
              details={details.questionnaires}
            />
          </TabPanel>
          <TabPanel
            value="maturityLevels"
            sx={{ py: { xs: 1, sm: 3 }, px: 0.2 }}
          >
            <MaturityLevelsDetails
              maturity_levels={details?.maturityLevels}
              update={update}
            />
          </TabPanel>
        </TabContext>
      )}
    </Box>
  );
};
const AssessmentKitSubjects = (props: { details: any[]; update: boolean }) => {
  const { details, update } = props;
  const [expanded, setExpanded] = React.useState<string | false>(false);
  const [assessmentKitSubjectDetails, setAssessmentKitSubjectDetails] =
    useState<any>();
  const [subjectId, setSubjectId] = useState<any>();
  const { fetchAssessmentKitSubjectDetailsQuery } = useAssessmentKit();
  const { assessmentKitId } = useParams();
  const handleChange =
    (panel: any) => (event: React.SyntheticEvent, isExpanded: boolean) => {
      if (isExpanded) {
        setSubjectId(panel?.id);
      }
      setExpanded(isExpanded ? panel?.title : false);
    };
  useEffect(() => {
    if (subjectId) {
      fetchAssessmentKitSubjectDetail();
    }
  }, [subjectId, update]);
  const fetchAssessmentKitSubjectDetail = async () => {
    try {
      const data = await fetchAssessmentKitSubjectDetailsQuery.query({
        assessmentKitId: assessmentKitId,
        subjectId: subjectId,
      });
      setAssessmentKitSubjectDetails(data);
    } catch (e) {}
  };

  return (
    <Box>
      {details.map((subject, index) => {
        const isExpanded = expanded === subject.title;
        return (
          <Accordion
            key={subject?.id}
            expanded={isExpanded}
            onChange={handleChange(subject)}
            sx={{
              mb: 1,
              borderRadius: 2,
              background: "white",
              boxShadow: "none",
              border: "none,",
              "&::before": {
                display: "none",
              },
            }}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon sx={{ color: "#287c71" }} />}
              aria-controls="panel1bh-content"
              id="panel1bh-header"
            >
              <Typography
                sx={{
                  flex: 1,
                  fontWeight: "bold",
                  fontSize: "1.2rem",
                  opacity: 1,
                }}
                variant="h6"
              >
                {subject.index}.{subject.title}
              </Typography>
              {/* <Typography
                sx={{
                  color: "text.secondary",
                  position: "relative",
                  mr: 2,
                  maxWidth: { xs: "90px", md: "130px", lg: "320px" },
                  display: { xs: "none", md: "block" },
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  transition: "opacity .2s ease",
                  opacity: isExpanded ? 0 : 1,
                }}
              >
                {subject.description}
              </Typography> */}
            </AccordionSummary>
            <AccordionDetails>
              <Box p={1}>
                <Grid container spacing={2} sx={{ mb: 1 }}>
                  {/* <Grid item xs={12} sm={5} md={4} lg={3}>
                    {subject.report_infos.map((info: any, index: number) => {
                      return <InfoItem info={info} bg="white" key={index} />;
                    })}
                  </Grid> */}
                  <Grid item xs={12} sm={7} md={8} lg={9}>
                    <Box
                      display="flex"
                      sx={{
                        background: "white",
                        py: 0.6,
                        px: 1,
                        borderRadius: 1,
                      }}
                    >
                      <Typography variant="body2">
                        <Trans i18nKey="questionsCount" />:
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{ ml: 2 }}
                        fontWeight="bold"
                      >
                        {assessmentKitSubjectDetails?.questionsCount}
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={7} md={8} lg={9}>
                    <Box
                      display="flex"
                      sx={{
                        background: "white",
                        py: 0.6,
                        px: 1,
                        borderRadius: 1,
                      }}
                    >
                      <Typography variant="body2">
                        <Trans i18nKey="description" />:
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{ ml: 2 }}
                        fontWeight="bold"
                      >
                        {assessmentKitSubjectDetails?.description}
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              </Box>
              <Divider />
              <Box m={1} mt={2}>
                <Typography variant="h6" fontWeight={"bold"} fontSize="1rem">
                  <Trans i18nKey="attributes" />
                </Typography>
                {assessmentKitSubjectDetails && (
                  <ListAccordion
                    items={assessmentKitSubjectDetails.attributes}
                    renderItem={(item, index, isExpanded) => {
                      return (
                        <React.Fragment key={item?.id}>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: isExpanded ? "stretch" : "center",
                              flexDirection: isExpanded ? "column" : "row",
                            }}
                          >
                            <Typography
                              variant="body1"
                              fontWeight={"bold"}
                              minWidth="180px"
                            >
                              {index + 1}.{item.title}
                            </Typography>
                            {/* <Typography
                            sx={{
                              opacity: 0.9,
                              marginLeft: isExpanded ? 0 : 5,
                              marginTop: isExpanded ? 2 : 0,
                              maxWidth: isExpanded
                                ? undefined
                                : { xs: "90px", md: "130px", lg: "320px" },
                              display: { xs: "none", md: "block" },
                              ...(isExpanded ? {} : styles.ellipsis),
                            }}
                            variant="body2"
                          >
                            {item.description}
                          </Typography> */}
                          </Box>
                          <AssessmentKitQuestionsList
                            isExpanded={isExpanded}
                            attributeId={item.id}
                          />
                        </React.Fragment>
                      );
                    }}
                  />
                )}
              </Box>
            </AccordionDetails>
          </Accordion>
        );
      })}
    </Box>
  );
};
const AssessmentKitQuestionnaires = (props: {
  details: any[];
  update: boolean;
}) => {
  const { details, update } = props;
  const [expanded, setExpanded] = React.useState<string | false>(false);
  const [questionnaireId, setQuestionnaireId] = useState<any>();
  const [questionnaireDetails, setQuestionnaireDetails] = useState<any>();
  const { fetchAssessmentKitQuestionnairesQuery } = useAssessmentKit();
  const { assessmentKitId } = useParams();
  const handleChange =
    (panel: any) => (event: React.SyntheticEvent, isExpanded: boolean) => {
      setExpanded(isExpanded ? panel.title : false);
      setQuestionnaireId(panel.id);
    };
  useEffect(() => {
    if (questionnaireId) {
      fetchAssessmentKitQuestionnaires();
    }
  }, [questionnaireId, update]);
  const fetchAssessmentKitQuestionnaires = async () => {
    try {
      const data = await fetchAssessmentKitQuestionnairesQuery.query({
        assessmentKitId: assessmentKitId,
        questionnaireId: questionnaireId,
      });
      setQuestionnaireDetails(data);
    } catch (e) {}
  };
  return (
    <Box>
      {details.map((questionnaire, index) => {
        const isExpanded = expanded === questionnaire.title;
        return (
          <Accordion
            key={questionnaire?.id}
            expanded={isExpanded}
            onChange={handleChange(questionnaire)}
            sx={{
              mb: 1,
              borderRadius: 2,
              background: "white",
              boxShadow: "none",
              border: "none,",
              "&::before": {
                display: "none",
              },
            }}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon sx={{ color: "#287c71" }} />}
              aria-controls="panel1bh-content"
              id="panel1bh-header"
            >
              <Typography
                sx={{
                  flex: 1,
                  fontWeight: "bold",
                  fontSize: "1.2rem",
                  opacity: 1,
                }}
                variant="h6"
              >
                {questionnaire.index}.{questionnaire.title}
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Grid item xs={12} sm={7} md={8} lg={9}>
                <Box
                  display="flex"
                  sx={{
                    background: "white",
                    py: 0.6,
                    px: 1,
                    borderRadius: 1,
                  }}
                >
                  <Typography variant="body2">
                    <Trans i18nKey="questionsCount" />:
                  </Typography>
                  <Typography variant="body2" sx={{ ml: 2 }} fontWeight="bold">
                    {questionnaireDetails?.questionsCount}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={7} md={8} lg={9}>
                <Box
                  display="flex"
                  sx={{
                    background: "white",
                    py: 0.6,
                    px: 1,
                    borderRadius: 1,
                    my: "16px",
                  }}
                >
                  <Typography variant="body2">
                    <Trans i18nKey="relatedSubjects" />:
                  </Typography>
                  {questionnaireDetails?.relatedSubjects.map(
                    (subject: string, index: number) => (
                      <Typography
                        variant="body2"
                        sx={{ ml: 2 }}
                        fontWeight="bold"
                        key={subject}
                      >
                        {subject}
                      </Typography>
                    ),
                  )}
                </Box>
              </Grid>
              <Grid item xs={12} sm={7} md={8} lg={9}>
                <Box
                  display="flex"
                  sx={{
                    background: "white",
                    py: 0.6,
                    px: 1,
                    borderRadius: 1,
                    my: "16px",
                  }}
                >
                  <Typography variant="body2">
                    <Trans i18nKey="description" />:
                  </Typography>
                  <Typography variant="body2" sx={{ ml: 2 }} fontWeight="bold">
                    {questionnaireDetails?.description}
                  </Typography>
                </Box>
              </Grid>
              <Divider />
              <QuestionnairesQuestionList
                questions={questionnaireDetails?.questions}
              />
            </AccordionDetails>
          </Accordion>
        );
      })}
    </Box>
  );
};
const AssessmentKitQuestionsList = (props: {
  attributeId: number;
  isExpanded: boolean;
}) => {
  const { attributeId, isExpanded } = props;
  const {
    fetchAssessmentKitSubjectAttributesDetailsQuery,
    fetchMaturityLevelQuestionsQuery,
  } = useAssessmentKit();
  const { assessmentKitId } = useParams();
  const [attributesDetails, setAttributesDetails] = useState<any>();
  const [maturityLevelQuestions, setMaturityLevelQuestions] = useState<any>();

  const fetchAttributesDetails = async () => {
    try {
      const data = await fetchAssessmentKitSubjectAttributesDetailsQuery.query({
        assessmentKitId: assessmentKitId,
        attributeId: attributeId,
      });
      setAttributesDetails(data);
    } catch (e) {}
  };
  const fetchMaturityLevelQuestions = async () => {
    try {
      const data = await fetchMaturityLevelQuestionsQuery.query({
        assessmentKitId: assessmentKitId,
        attributeId: attributeId,
        maturityLevelId: value,
      });
      setMaturityLevelQuestions(data);
    } catch (e) {}
  };
  useEffect(() => {
    if (isExpanded && attributeId) {
      fetchAttributesDetails();
    }
  }, [isExpanded]);
  const [value, setValue] = useState("");
  const [selectedTabIndex, setSelectedTabIndex] = useState("");
  const handleTabChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
    setSelectedTabIndex(
      attributesDetails?.maturityLevels.findIndex(
        (obj: any) => obj.id === newValue,
      ),
    );
  };
  const colorPallet = getMaturityLevelColors(
    attributesDetails?.maturityLevels
      ? attributesDetails?.maturityLevels.length
      : 5,
  );
  useEffect(() => {
    if (value) {
      fetchMaturityLevelQuestions();
    }
  }, [value]);
  return (
    <Box m={1} mt={5}>
      <Grid item xs={12} sm={7} md={8} lg={9}>
        <Box
          display="flex"
          sx={{
            background: "white",
            py: 0.6,
            px: 1,
            borderRadius: 1,
          }}
        >
          <Typography variant="body2">
            <Trans i18nKey="questionsCount" />:
          </Typography>
          <Typography variant="body2" sx={{ ml: 2 }} fontWeight="bold">
            {attributesDetails?.questionCount}
          </Typography>
        </Box>
      </Grid>
      <Grid item xs={12} sm={7} md={8} lg={9}>
        <Box
          display="flex"
          sx={{
            background: "white",
            py: 0.6,
            px: 1,
            borderRadius: 1,
          }}
        >
          <Typography variant="body2">
            <Trans i18nKey="weight" />:
          </Typography>
          <Typography variant="body2" sx={{ ml: 2 }} fontWeight="bold">
            {attributesDetails?.weight}
          </Typography>
        </Box>
      </Grid>
      <Grid item xs={12} sm={7} md={8} lg={9}>
        <Box
          display="flex"
          sx={{
            background: "white",
            py: 0.6,
            px: 1,
            borderRadius: 1,
          }}
        >
          <Typography variant="body2">
            <Trans i18nKey="description" />:
          </Typography>
          <Typography variant="body2" sx={{ ml: 2 }} fontWeight="bold">
            {attributesDetails?.description}
          </Typography>
        </Box>
      </Grid>
      <Box mt={4}>
        <TabContext value={value}>
          <Box>
            <Tabs
              value={value}
              onChange={handleTabChange}
              sx={{
                "& .MuiTabs-indicator": {
                  backgroundColor: `${
                    colorPallet[selectedTabIndex || 0]
                  } !important`,
                },
              }}
            >
              {attributesDetails?.maturityLevels.map(
                (item: any, index: number) => {
                  return (
                    <Tab
                      sx={{
                        "&.Mui-selected": {
                          color: `${colorPallet[index]}  !important`,
                          background: `transparent  !important`,
                        },
                        "&:hover": {
                          backgroundColor: "#e1dede !important",
                          color: `${colorPallet[index]} !important`,
                        },
                        background: `${colorPallet[index]}  !important`,
                        color: "#fff !important",
                      }}
                      label={
                        <Box sx={{ ...styles.centerV }}>
                          {item.title}|{item.questionCount}
                        </Box>
                      }
                      value={item.id}
                    />
                  );
                },
              )}
            </Tabs>
          </Box>
          <TabPanel value={value} sx={{ py: { xs: 1, sm: 3 }, px: 0.2 }}>
            {maturityLevelQuestions && (
              <SubjectQuestionList
                questions={maturityLevelQuestions?.questions}
                questions_count={maturityLevelQuestions?.questionsCount}
              />
            )}
          </TabPanel>
        </TabContext>
      </Box>
      {/* <Typography variant="h6" sx={{ opacity: 0.8 }} fontSize=".9rem">
        <Trans i18nKey="questions" />
        <span style={{ float: "right" }}>{questions.length}</span>
      </Typography> */}
      {/* <Box sx={{ overflowX: "auto" }}>
        <Box
          sx={{
            minWidth: "580px",
            marginTop: 6,
            paddingInlineStart: { xs: 0, md: "30px" },
            listStyle: "none",
          }}
          component="ol"
        >
          <AttributeDetails index={index} />
          {questions.map((question: any, index: number) => {
            const {
              title,
              options = [],
              relatedAttributes = [],
              impact,
            } = question || {};
            const hasRelatedAttributes = relatedAttributes.length > 0;
            const hasImpact = impact !== null && impact !== undefined;
            const gridColumns = hasRelatedAttributes || hasImpact ? 15 : 12;
            if (title && questionsRef[title]) {
              return null;
            } else if (title && !questionsRef[title]) {
              questionsRef[title] = true;
            }
            const dialogProps = useDialog();
            return (
              <li style={{ marginBottom: "12px" }} key={index}>
                <Box display="flex" justifyContent={"space-between"} py={1}>
                  <Grid container spacing={2} columns={12}>
                    <Grid xs={12} item>
                      <Typography
                        variant="body1"
                        fontWeight={"bold"}
                        position="relative"
                        sx={{ cursor: "pointer" }}
                        onClick={() => {
                          dialogProps.openDialog({});
                        }}
                      >
                        {index === 0 && (
                          <Typography
                            sx={{
                              position: "absolute",
                              top: "-36px",
                              pb: "2px",
                              color: "#767676",
                              display: "block",
                              fontSize: "0.8rem",
                              width: "100%",
                              borderBottom: (t) =>
                                `1px solid ${t.palette.primary.light}`,
                            }}
                            component="span"
                          >
                            <Trans i18nKey={"title"} />
                          </Typography>
                        )}
                        {title}
                      </Typography>
                    </Grid> */}
      {/* <Grid item xs={5}>
                      <Box position={"relative"} minWidth="160px">
                        {index === 0 && (
                          <Typography
                            sx={{
                              position: "absolute",
                              width: "100%",
                              top: "-36px",
                              pb: "2px",
                              color: "#767676",
                              borderBottom: (t) => `1px solid ${t.palette.warning.main}`,
                            }}
                            variant="subMedium"
                          >
                            <Trans i18nKey={"questionOptions"} />
                          </Typography>
                        )}
                        <ul style={{ paddingInlineStart: "20px" }}>
                          {options.map((option: string, index: number) => {
                            return <li key={option}>{option}</li>;
                          })}
                        </ul>
                      </Box>
                    </Grid> */}
      {/* {hasImpact && (
                      <Grid item xs={2}>
                        <Box position={"relative"}>
                          {index === 0 && (
                            <Typography
                              sx={{
                                width: "100%",
                                position: "absolute",
                                top: "-36px",
                                pb: "2px",
                                color: "#767676",
                                borderBottom: (t) => `1px solid ${t.palette.secondary.dark}`,
                              }}
                              variant="subMedium"
                            >
                              <Trans i18nKey={"Impact"} />
                            </Typography>
                          )}
                          <Box px={1}>{impact}</Box>
                        </Box>
                      </Grid>
                    )} */}
      {/* {hasRelatedAttributes && (
                      <Grid item xs={3}>
                        <Box position={"relative"} minWidth="300px">
                          {index === 0 && (
                            <Typography
                              sx={{
                                width: "100%",
                                position: "absolute",
                                top: "-36px",
                                pb: "2px",
                                color: "#767676",
                                borderBottom: (t) =>
                                  `1px solid ${t.palette.secondary.dark}`,
                              }}
                              variant="subMedium"
                            >
                              <Trans i18nKey={"relatedAttributes"} />
                            </Typography>
                          )}
                          <Box>
                            {relatedAttributes.map((att: any) => {
                              return (
                                <Chip
                                  key={att.id}
                                  label={att.title}
                                  color="secondary"
                                  sx={{ mr: 0.5, mb: 0.2 }}
                                  size="small"
                                />
                              );
                            })}
                          </Box>
                        </Box>
                      </Grid>
                    )} */}
      {/* <AssessmentKitDialog {...dialogProps} question={question} />
                  </Grid>
                </Box>
                {index !== questions.length - 1 && <Divider />}
              </li>
            );
          })}
        </Box>
      </Box> */}
    </Box>
  );
};
const UpdateAssessmentKitDialog = (props: any) => {
  const {
    onClose: closeDialog,
    setForceUpdate,
    setLoaded,
    loaded,
    ...rest
  } = props;

  const { service } = useServiceContext();
  const formMethods = useForm({ shouldUnregister: true });
  const abortController = useMemo(() => new AbortController(), [rest.open]);
  const [showErrorLog, setShowErrorLog] = useState<boolean>(false);
  const [syntaxErrorObject, setSyntaxErrorObject] = useState<any>();
  const [updateErrorObject, setUpdateErrorObject] = useState<any>();
  const { assessmentKitId } = useParams();
  const [isValid, setIsValid] = useState<boolean>(false);
  const { expertGroupId } = useParams();
  const close = () => {
    setSyntaxErrorObject(null);
    setUpdateErrorObject(null);
    setShowErrorLog(false);
    abortController.abort();
    closeDialog();
  };
  useEffect(() => {
    return () => {
      abortController.abort();
    };
  }, []);
  const onSubmit = async (data: any, event: any, shouldView?: boolean) => {
    event.preventDefault();
    const { dsl_id, ...restOfData } = data;
    const formattedData = {
      kitDslId: dsl_id.kitDslId,
      ...restOfData,
    };
    setLoaded(true);
    try {
      const { data: res } = await service.updateAssessmentKitDSL(
        { data: formattedData, assessmentKitId: assessmentKitId },
        { signal: abortController.signal },
      );
      setForceUpdate((prev: boolean) => !prev);
      setLoaded(false);
      close();
    } catch (e: any) {
      const err = e as ICustomError;
      if (e?.response?.status == 422) {
        setSyntaxErrorObject(e?.response?.data?.errors);
        setUpdateErrorObject(null);
        setShowErrorLog(true);
      }
      if (e?.response?.data?.code === "UNSUPPORTED_DSL_CONTENT_CHANGE") {
        setUpdateErrorObject(e?.response?.data?.messages);
        setSyntaxErrorObject(null);
        setShowErrorLog(true);
      }

      if (
        e?.response?.status !== 422 &&
        e?.response?.data?.code !== "UNSUPPORTED_DSL_CONTENT_CHANGE"
      ) {
        toastError(err.message);
      }
      setLoaded(false);
      formMethods.clearErrors();
      return () => {
        abortController.abort();
      };
    }
  };
  const formContent = (
    <FormProviderWithForm formMethods={formMethods}>
      <Typography variant="body1">
        <Trans i18nKey="pleaseNoteThatThereAreSomeLimitations" />
      </Typography>
      <Box sx={{ ml: 4, my: 2 }}>
        {/* <Typography component="li" variant="body1" fontWeight={"bold"}>
          <Trans i18nKey="deletingAnSubjectOrAddingANewOne" />
        </Typography> */}
        {/* <Typography component="li" variant="body1" fontWeight={"bold"}>
          <Trans i18nKey="deletingAnAttributeOrAddingANewOne" />
        </Typography> */}
        <Typography component="li" variant="body1" fontWeight={"bold"}>
          <Trans i18nKey="deletingAQuestionnaire" />
        </Typography>
        <Typography component="li" variant="body1" fontWeight={"bold"}>
          <Trans i18nKey="deletingQuestionFromAPreExistingQuestionnaireOrAddingANewOne" />
        </Typography>
        <Typography component="li" variant="body1" fontWeight={"bold"}>
          <Trans i18nKey="anyChangesInTheNumberOfOptionsForAPreExistingQuestion" />
        </Typography>
      </Box>
      <Grid container spacing={2} sx={styles.formGrid}>
        <Box width="100%" ml={2}>
          <UploadField
            accept={{ "application/zip": [".zip"] }}
            uploadService={(args: any, config: any) =>
              service.uploadAssessmentKitDSLFile(args, config)
            }
            deleteService={(args: any, config: any) =>
              service.deleteAssessmentKitDSL(args, config)
            }
            setIsValid={setIsValid}
            param={expertGroupId}
            name="dsl_id"
            required={true}
            label={<Trans i18nKey="dsl" />}
            maxSize={convertToBytes(5, "MB")}
            setSyntaxErrorObject={setSyntaxErrorObject}
            setShowErrorLog={setShowErrorLog}
          />
        </Box>
      </Grid>
      <CEDialogActions
        closeDialog={close}
        loading={loaded}
        type="submit"
        submitButtonLabel={t("saveChanges") as string}
        onSubmit={formMethods.handleSubmit(onSubmit)}
      />
    </FormProviderWithForm>
  );
  const syntaxErrorContent = (
    <Box>
      {syntaxErrorObject && (
        <Typography ml={1} variant="h6">
          <Trans i18nKey="youveGotSyntaxErrorsInYourDslFile" />
        </Typography>
      )}
      {updateErrorObject && (
        <Typography ml={1} variant="h6">
          <Trans i18nKey="unsupportedDslContentChange" />
        </Typography>
      )}
      <Divider />
      <Box mt={4} sx={{ maxHeight: "260px", overflow: "scroll" }}>
        {syntaxErrorObject &&
          syntaxErrorObject.map((e: any) => {
            return (
              <Box sx={{ ml: 1 }}>
                <Alert severity="error" sx={{ my: 2 }}>
                  <Box sx={{ display: "flex", flexDirection: "column" }}>
                    <Typography variant="subtitle2" color="error">
                      <Trans
                        i18nKey="errorAtLine"
                        values={{
                          message: e.message,
                          fileName: e.fileName,
                          line: e.line,
                          column: e.column,
                        }}
                      />
                    </Typography>
                    <Typography variant="subtitle2" color="error">
                      <Trans
                        i18nKey="errorLine"
                        values={{
                          errorLine: e.errorLine,
                        }}
                      />
                    </Typography>
                  </Box>
                </Alert>
              </Box>
            );
          })}
        {updateErrorObject &&
          updateErrorObject.map((e: any) => {
            return (
              <Box sx={{ ml: 1 }}>
                <Alert severity="error" sx={{ my: 2 }}>
                  <Box sx={{ display: "flex" }}>
                    <Typography variant="subtitle2" color="error">
                      {e}
                    </Typography>
                  </Box>
                </Alert>
              </Box>
            );
          })}
      </Box>
      <Grid mt={4} container spacing={2} justifyContent="flex-end">
        <Grid item>
          <Button onClick={close} data-cy="cancel">
            <Trans i18nKey="cancel" />
          </Button>
        </Grid>
        <Grid item>
          <Button variant="contained" onClick={() => setShowErrorLog(false)}>
            <Trans i18nKey="Back" />
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
  return (
    <CEDialog
      {...rest}
      closeDialog={close}
      title={
        <>
          <CloudUploadRoundedIcon
            sx={{
              marginRight: theme.direction === "ltr" ? 1 : "unset",
              marginLeft: theme.direction === "rtl" ? 1 : "unset",
            }}
          />
          {<Trans i18nKey="updateDSL" />}
        </>
      }
    >
      {!showErrorLog ? formContent : syntaxErrorContent}
    </CEDialog>
  );
};
const SubjectQuestionList = (props: any) => {
  const { questions } = props;
  const [expanded, setExpanded] = React.useState<string | false>(false);
  const handleChange =
    (panel: any) => (event: React.SyntheticEvent, isExpanded: boolean) => {
      if (isExpanded) {
      }
      setExpanded(isExpanded ? panel?.title : false);
    };
  return (
    <Box>
      {questions[0] && (
        <Box m={1} mt={2}>
          <Typography variant="h6" fontWeight={"bold"} fontSize="1rem">
            <Trans i18nKey="questions" />
          </Typography>
        </Box>
      )}
      {questions.map((question: any, index: number) => {
        const is_farsi = languageDetector(question.title);
        const isExpanded = expanded === question.title;
        return (
          <Accordion
            key={question?.id}
            expanded={isExpanded}
            onChange={handleChange(question)}
            sx={{
              mt: 2,
              mb: 1,
              paddingLeft: theme.direction === "ltr" ? 2 : "unset",
              paddingRight: theme.direction === "rtl" ? 2 : "unset",
              borderRadius: 2,
              background: "white",
              boxShadow: "none",
              border: "none,",
              "&::before": {
                display: "none",
              },
            }}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon sx={{ color: "#287c71" }} />}
              aria-controls="panel1bh-content"
              id="panel1bh-header"
            >
              <Typography
                sx={{
                  flex: 1,
                  fontFamily: `${is_farsi ? "Vazirmatn" : primaryFontFamily}`,
                  fontWeight: "bold",
                  opacity: 1,
                  display: "flex",
                  flexWrap: "wrap",
                  direction: `${is_farsi ? "rtl" : "ltr"}`,
                }}
                variant="body2"
              >
                {index + 1}.{question.title}
                {question.mayNotBeApplicable && (
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      borderRadius: "8px",
                      background: "#1976D2",
                      color: "#fff",
                      fontSize: ".75rem",
                      px: "12px",
                      mx: "4px",
                      height: "24px",
                    }}
                  >
                    <Trans i18nKey="na" />
                  </Box>
                )}
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    borderRadius: "8px",
                    background: "#273248",
                    color: "#fff",
                    fontSize: ".75rem",
                    px: "12px",
                    mx: "4px",
                    height: "24px",
                  }}
                >
                  {question.questionnaire}
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    borderRadius: "8px",
                    background: "#7954B3",
                    color: "#fff",
                    fontSize: ".75rem",
                    px: "12px",
                    mx: "4px",
                    height: "24px",
                  }}
                >
                  <Trans
                    i18nKey="weightValue"
                    values={{ weight: question.weight }}
                  />
                </Box>
                {question.advisable && (
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      borderRadius: "8px",
                      background: "#004F83",
                      color: "#fff",
                      fontSize: ".75rem",
                      px: "12px",
                      mx: "4px",
                      height: "24px",
                    }}
                  >
                    <Trans i18nKey="Advisable" />
                  </Box>
                )}
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Box sx={{ maxWidth: "max-content" }}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    borderBottom: "1px solid #4979D1",
                    pb: "8px",
                  }}
                >
                  <Typography
                    variant="body2"
                    sx={{
                      fontWeight: "bold",
                      opacity: 0.6,
                      ml: "4px",
                    }}
                  >
                    <Trans i18nKey="options" />
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      fontWeight: "bold",
                      opacity: 0.6,
                      ml: "4px",
                    }}
                  >
                    <Trans i18nKey="value" />
                  </Typography>
                </Box>
                {question.answerOptions.map((item: any) => (
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      px: "16px",
                      my: "16px",
                    }}
                  >
                    <Typography
                      variant="subtitle2"
                      sx={{
                        fontWeight: "bold",
                        marginRight:
                          theme.direction === "ltr" ? "64px" : "unset",
                        marginLeft:
                          theme.direction === "rtl" ? "64px" : "unset",
                      }}
                    >
                      {item.index}.{item.title}
                    </Typography>
                    <Typography
                      variant="subtitle2"
                      sx={{
                        fontWeight: "bold",
                      }}
                    >
                      {item.value}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </AccordionDetails>
          </Accordion>
        );
      })}
    </Box>
  );
};
const QuestionnairesQuestionList = (props: any) => {
  const { questions } = props;
  const [expanded, setExpanded] = React.useState<string | false>(false);
  const [questionId, setQuestionId] = useState<any>();
  const [questionsDetails, setQuestionsDetails] = useState<any>();
  const { fetchAssessmentKitQuestionnairesQuestionsQuery } = useAssessmentKit();
  const { assessmentKitId } = useParams();
  const handleChange =
    (panel: any) => (event: React.SyntheticEvent, isExpanded: boolean) => {
      setQuestionId(panel.id);
      setExpanded(isExpanded ? panel?.title : false);
    };
  useEffect(() => {
    if (questionId) {
      fetchAssessmentKitQuestionnaires();
    }
  }, [questionId]);
  const fetchAssessmentKitQuestionnaires = async () => {
    try {
      const data = await fetchAssessmentKitQuestionnairesQuestionsQuery.query({
        assessmentKitId: assessmentKitId,
        questionId: questionId,
      });
      setQuestionsDetails(data);
    } catch (e) {}
  };
  function formatNumber(value: any) {
    // Check if the value is an integer (no decimal places)
    if (Number.isInteger(value)) {
      // Convert to string and append '.0'
      return parseFloat(value).toFixed(1);
    }
    // If it already has decimal places, keep it as is
    return value.toString();
  }
  return (
    <Box>
      <Box m={1} mt={2}>
        <Typography variant="h6" fontWeight={"bold"} fontSize="1rem">
          <Trans i18nKey="questions" />
        </Typography>
      </Box>

      {questions?.map((question: any, index: number) => {
        const isExpanded = expanded === question.title;
        const is_farsi = languageDetector(question.title);
        return (
          <Accordion
            key={question?.id}
            expanded={isExpanded}
            onChange={handleChange(question)}
            sx={{
              mt: 2,
              mb: 1,
              paddingLeft: theme.direction === "ltr" ? 2 : "unset",
              paddingRight: theme.direction === "rtl" ? 2 : "unset",
              borderRadius: 2,
              background: "white",
              boxShadow: "none",
              border: "none,",
              "&::before": {
                display: "none",
              },
            }}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon sx={{ color: "#287c71" }} />}
              aria-controls="panel1bh-content"
              id="panel1bh-header"
            >
              <Typography
                sx={{
                  flex: 1,
                  fontFamily: `${is_farsi ? "Vazirmatn" : primaryFontFamily}`,
                  fontWeight: "bold",
                  opacity: 1,
                  display: "flex",
                  flexWrap: "wrap",
                  direction: `${is_farsi ? "rtl" : "ltr"}`,
                }}
                variant="body2"
              >
                {index + 1}.{question.title}
                {question.mayNotBeApplicable && (
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      borderRadius: "8px",
                      background: "#1976D2",
                      color: "#fff",
                      fontSize: ".75rem",
                      px: "12px",
                      mx: "4px",
                      height: "24px",
                    }}
                  >
                    <Trans i18nKey="na" />
                  </Box>
                )}
                {question.advisable && (
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      borderRadius: "8px",
                      background: "#004F83",
                      color: "#fff",
                      fontSize: ".75rem",
                      px: "12px",
                      mx: "4px",
                      height: "24px",
                    }}
                  >
                    <Trans i18nKey="advisable" />
                  </Box>
                )}
              </Typography>
            </AccordionSummary>
            {questionsDetails && (
              <AccordionDetails>
                <Box
                  sx={{
                    maxWidth: "max-content",
                    display: "flex",
                    mb: 4,
                    ml: `${is_farsi ? "auto" : "2"}`,
                    direction: `${is_farsi ? "rtl" : "ltr"}`,
                  }}
                >
                  {questionsDetails?.options.map((option: any) => (
                    <Typography
                      key={option.index}
                      sx={{
                        mx: 2,
                        fontFamily: `${is_farsi ? "Vazirmatn" : primaryFontFamily}`,
                      }}
                      variant="body2"
                    >
                      {option.index}. {option.title}
                    </Typography>
                  ))}
                </Box>
                <Box sx={{ display: "flex", justifyContent: "center" }}>
                  <Box sx={{ width: "90%" }}>
                    <Box sx={{ display: "flex" }}>
                      <Typography
                        sx={{
                          width: "40%",
                          pb: "4px",
                          color: "#767676",
                          display: "block",
                          fontSize: "0.8rem",
                        }}
                      >
                        <Trans i18nKey="affectedQualityAttribute" />
                      </Typography>
                      <Typography
                        sx={{
                          width: "20%",
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          pb: "4px",
                          color: "#767676",
                          fontSize: "0.8rem",
                        }}
                      >
                        <Trans i18nKey="affectedLevel" />
                      </Typography>
                      <Typography
                        sx={{
                          width: "10%",
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          pb: "4px",
                          color: "#767676",
                          fontSize: "0.8rem",
                        }}
                      >
                        <Trans i18nKey="weight" />
                      </Typography>
                      <Box
                        sx={{
                          width: "30%",
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        {questionsDetails?.options.map(
                          (option: any, index: number) => (
                            <Typography
                              sx={{
                                color: "#767676",
                                fontSize: "0.8rem",
                                pb: "4px",
                              }}
                            >
                              <Trans
                                i18nKey="optionValue"
                                values={{ index: index + 1 }}
                              />
                            </Typography>
                          ),
                        )}
                      </Box>
                    </Box>
                    <Divider sx={{ background: "#7A589B" }} />
                    <Box>
                      {questionsDetails?.attributeImpacts.map(
                        (attributes: any, index: number) => {
                          return (
                            <Box
                              sx={{
                                display: "flex",
                                justifyContent: "space-between",
                                borderTop: `${
                                  index !== 0 && "1px solid #D3D3D3"
                                }`,
                                py: 1,
                              }}
                            >
                              <Typography
                                sx={{ width: "40%", py: 1 }}
                                variant="body1"
                                fontWeight={"bold"}
                              >
                                {attributes.title}
                              </Typography>
                              <Box
                                sx={{
                                  display: "flex",
                                  flexDirection: "column",
                                  justifyContent: "center",
                                  alignItems: "center",
                                  width: "20%",
                                }}
                              >
                                {attributes?.affectedLevels.map(
                                  (affectedLevel: any) => {
                                    return (
                                      <Typography
                                        variant="body1"
                                        fontWeight={"bold"}
                                        sx={{ py: 1 }}
                                      >
                                        {affectedLevel.maturityLevel.title} |{" "}
                                        {affectedLevel.maturityLevel.index}
                                      </Typography>
                                    );
                                  },
                                )}
                              </Box>
                              <Box
                                sx={{
                                  display: "flex",
                                  flexDirection: "column",
                                  justifyContent: "center",
                                  alignItems: "center",
                                  width: "10%",
                                }}
                              >
                                {attributes?.affectedLevels.map(
                                  (affectedLevel: any) => {
                                    return (
                                      <Typography
                                        variant="body1"
                                        fontWeight={"bold"}
                                        sx={{ py: 1 }}
                                      >
                                        {affectedLevel.weight}
                                      </Typography>
                                    );
                                  },
                                )}
                              </Box>
                              <Box
                                sx={{
                                  display: "flex",
                                  flexDirection: "column",
                                  justifyContent: "center",
                                  alignItems: "center",
                                  width: "30%",
                                }}
                              >
                                {attributes?.affectedLevels.map(
                                  (affectedLevel: any) => {
                                    return (
                                      <Box
                                        sx={{
                                          display: "flex",
                                          justifyContent: "space-between",
                                          width: "100%",
                                        }}
                                      >
                                        {affectedLevel.optionValues.map(
                                          (option: any) => {
                                            return (
                                              <Typography
                                                variant="body1"
                                                fontWeight={"bold"}
                                                sx={{
                                                  py: 1,
                                                }}
                                              >
                                                {formatNumber(option.value)}
                                              </Typography>
                                            );
                                          },
                                        )}
                                      </Box>
                                    );
                                  },
                                )}
                              </Box>
                            </Box>
                          );
                        },
                      )}
                    </Box>
                  </Box>
                </Box>
              </AccordionDetails>
            )}
          </Accordion>
        );
      })}
    </Box>
  );
};
const MaturityLevelsDetails = (props: any) => {
  const { maturity_levels, update } = props;
  const colorPallet = getMaturityLevelColors(
    maturity_levels ? maturity_levels.length : 5,
  );
  return (
    <Box sx={{ background: "#fff", px: 4, py: 4, borderRadius: "8px" }}>
      <Typography fontWeight={900} fontSize="1.5rem" mb={8}>
        <Trans i18nKey="maturityLevels" />
      </Typography>
      {maturity_levels &&
        maturity_levels
          .map((maturity_level: any, key: number) => {
            const { title, competences, index } = maturity_level;
            return (
              <Box
                sx={{
                  transform: "skew(-30deg);",
                  background: colorPallet[key],
                  borderRadius: "8px",
                  py: "4px",
                  paddingLeft: theme.direction === "ltr" ? 2 : "unset",
                  paddingRight: theme.direction === "rtl" ? 2 : "unset",
                  margin: "16px",
                  width: { xs: "90%", sm: `${90 - 10 * key}%` },
                }}
                key={key}
              >
                <Typography
                  sx={{ transform: "skew(30deg);" }}
                  fontSize="1.5rem"
                  fontWeight={900}
                  color="#fff"
                >
                  {index}.{title}
                </Typography>
                <Box
                  sx={{
                    display: "flex",
                    ml: "64px",
                    flexWrap: "wrap",
                    alignItems: "center",
                  }}
                >
                  <Typography
                    sx={{ transform: "skew(30deg)" }}
                    fontSize=".875rem"
                    color="#fff"
                    fontWeight={900}
                    mr={"4px"}
                  >
                    <Trans i18nKey="competences" />:
                  </Typography>
                  {competences.map((comp: any, key: number) => {
                    const { title, value } = comp;
                    return (
                      <Typography
                        sx={{ transform: "skew(30deg)" }}
                        fontSize=".75rem"
                        color="#fff"
                      >
                        {title}:{value}%{competences.length - 1 !== key && ", "}
                      </Typography>
                    );
                  })}
                </Box>
              </Box>
            );
          })
          .reverse()}
    </Box>
  );
};
const useAssessmentKit = () => {
  const { service } = useServiceContext();
  const { assessmentKitId } = useParams();
  const subjectId = 1;
  // const assessmentKitQueryProps = useQuery({
  //   service: (args = { assessmentKitId }, config) =>
  //     service.inspectAssessmentKit(args, config),
  // });
  // const analyzeAssessmentKitQuery = useQuery({
  //   service: (args = { assessmentKitId }, config) =>
  //     service.analyzeAssessmentKit(args, config),
  //   runOnMount: true,
  // });
  // const fetchAssessmentKitQuery = useQuery({
  //   service: (args = { assessmentKitId }, config) =>
  //     service.fetchAssessmentKitdata(args, config),
  //   runOnMount: true,
  // });
  const fetchAssessmentKitDetailsQuery = useQuery({
    service: (args = { assessmentKitId }, config) =>
      service.fetchAssessmentKitDetails(args, config),
    runOnMount: false,
  });
  const fetchAssessmentKitSubjectDetailsQuery = useQuery({
    service: (args, config) =>
      service.fetchAssessmentKitSubjectDetails(args, config),
    runOnMount: false,
  });
  const fetchAssessmentKitSubjectAttributesDetailsQuery = useQuery({
    service: (args, config) =>
      service.fetchAssessmentKitSubjectAttributesDetails(args, config),
    runOnMount: false,
  });
  const fetchMaturityLevelQuestionsQuery = useQuery({
    service: (args, config) =>
      service.fetchMaturityLevelQuestions(args, config),
    runOnMount: false,
  });
  const fetchAssessmentKitQuestionnairesQuery = useQuery({
    service: (args, config) =>
      service.fetchAssessmentKitQuestionnaires(args, config),
    runOnMount: false,
  });
  const fetchAssessmentKitQuestionnairesQuestionsQuery = useQuery({
    service: (args, config) =>
      service.fetchAssessmentKitQuestionnairesQuestions(args, config),
    runOnMount: false,
  });
  const fetchAssessmentKitDownloadUrlQuery = useQuery({
    service: (args = { assessmentKitId }, config) =>
      service.fetchAssessmentKitDownloadUrl(args, config),
    runOnMount: false,
  });

  return {
    // assessmentKitQueryProps,
    // analyzeAssessmentKitQuery,
    // fetchAssessmentKitQuery,
    fetchAssessmentKitDetailsQuery,
    fetchAssessmentKitSubjectDetailsQuery,
    fetchAssessmentKitSubjectAttributesDetailsQuery,
    fetchMaturityLevelQuestionsQuery,
    fetchAssessmentKitQuestionnairesQuery,
    fetchAssessmentKitQuestionnairesQuestionsQuery,
    fetchAssessmentKitDownloadUrlQuery,
  };
};
export default AssessmentKitExpertViewContainer;
