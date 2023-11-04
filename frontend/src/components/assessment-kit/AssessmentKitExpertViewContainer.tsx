import React, { useEffect, useRef, useState } from "react";
import { Box, Button } from "@mui/material";
import { useServiceContext } from "@providers/ServiceProvider";
import { useParams } from "react-router-dom";
import { useQuery } from "@utils/useQuery";
import QueryData from "@common/QueryData";
import QueryBatchData from "@common/QueryBatchData";
import Title from "@common/Title";
import Chip from "@mui/material/Chip";
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
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Divider from "@mui/material/Divider";
import AssessmentKitSectionGeneralInfo from "./AssessmentKitSectionGeneralInfo";
import ListAccordion from "@common/lists/ListAccordion";
import InfoItem from "@common/InfoItem";
import SettingsRoundedIcon from "@mui/icons-material/SettingsRounded";
import setDocumentTitle from "@utils/setDocumentTitle";
import { t } from "i18next";
import AssessmentKitSettingFormDialog from "./AssessmentKitSettingFormDialog";
import useDialog from "@utils/useDialog";
import SupTitleBreadcrumb from "@common/SupTitleBreadcrumb";
import { useAuthContext } from "@providers/AuthProvider";
import Dialog from "@mui/material/Dialog";
import { DialogActions, DialogContent } from "@mui/material";
import DialogTitle from "@mui/material/DialogTitle";
import useScreenResize from "@utils/useScreenResize";
import languageDetector from "@utils/languageDetector";
import toastError from "@utils/toastError";
import { ICustomError } from "@utils/CustomError";
import CloudDownloadRoundedIcon from "@mui/icons-material/CloudDownloadRounded";
const AssessmentKitExpertViewContainer = () => {
  const { fetchAssessmentKitDetailsQuery, fetchAssessmentKitDownloadUrlQuery } =
    useAssessmentKit();
  const dialogProps = useDialog();
  const { userInfo } = useAuthContext();
  const userId = userInfo.id;
  const { expertGroupId } = useParams();
  const [details, setDetails] = useState();
  const [expertGroup, setExpertGroup] = useState<any>();
  const [assessmentKitTitle, setAssessmentKitTitle] = useState<any>();
  const [loaded, setLoaded] = React.useState<boolean | false>(false);

  const AssessmentKitDetails = async () => {
    const data = await fetchAssessmentKitDetailsQuery.query();
    setDetails(data);
    setLoaded(true);
  };
  const handleDownload = async () => {
    try {
      const response = await fetchAssessmentKitDownloadUrlQuery.query();
      const fileUrl = response.url;
      const a = document.createElement('a');
      a.href = fileUrl;
      a.download = 'file_name.zip';
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
  }, [loaded]);
  useEffect(() => {
    setDocumentTitle(`${t("assessmentKit")}: ${assessmentKitTitle || ""}`);
  }, [assessmentKitTitle]);

  return (
    <Box>
      <Box>
        <Title
          backLink={-1}
          sup={
            <SupTitleBreadcrumb
              routes={[
                {
                  title: t("expertGroups") as string,
                  to: `/user/expert-groups`,
                },
                {
                  title: expertGroup?.name,
                  to: `/user/expert-groups/${expertGroupId}`,
                },
                {
                  title: assessmentKitTitle,
                  to: `/user/expert-groups`,
                },
              ]}
            />
          }
          toolbar={
            <Button
              variant="contained"
              size="small"
              sx={{ ml: 2 }}
              onClick={handleDownload}
            >
              <Typography mr={1} variant="button">
                <Trans i18nKey="download" />
              </Typography>
              <CloudDownloadRoundedIcon />
            </Button>
          }
        >
          {assessmentKitTitle}
        </Title>
        <Box mt={3}>
          <AssessmentKitSectionGeneralInfo
            setExpertGroup={setExpertGroup}
            setAssessmentKitTitle={setAssessmentKitTitle}
          />
          <AssessmentKitSectionsTabs details={details} />
        </Box>
      </Box>
    </Box>
  );
};
const AssessmentKitSectionsTabs = (props: { details: any }) => {
  const { fetchAssessmentKitDetailsQuery } = useAssessmentKit();
  const [value, setValue] = useState("maturityLevels");
  const handleTabChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };
  const { details } = props;
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
            <AssessmentKitSubjects details={details.subjects} />
          </TabPanel>
          <TabPanel
            value="questionnaires"
            sx={{ py: { xs: 1, sm: 3 }, px: 0.2 }}
          >
            <AssessmentKitQuestionnaires details={details.questionnaires} />
          </TabPanel>
          <TabPanel
            value="maturityLevels"
            sx={{ py: { xs: 1, sm: 3 }, px: 0.2 }}
          >
            <MaturityLevelsDetails maturity_levels={details?.maturity_levels} />
          </TabPanel>
        </TabContext>
      )}
    </Box>
  );
};
const AssessmentKitSubjects = (props: { details: any[] }) => {
  const { details } = props;
  const [expanded, setExpanded] = React.useState<string | false>(false);
  const [assessmentKitSubjectDetails, setAssessmentKitSubjectDetails] =
    useState<any>();
  const [subjectId, setSubjectId] = useState<any>();
  const dialogProps = useDialog();
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
  }, [subjectId]);
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
            key={index}
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
                  fontFamily: "Roboto",
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
                      <Typography variant="body2" fontFamily="Roboto">
                        <Trans i18nKey="questionsCount" />:
                      </Typography>
                      <Typography
                        variant="body2"
                        fontFamily="Roboto"
                        sx={{ ml: 2 }}
                        fontWeight="bold"
                      >
                        {assessmentKitSubjectDetails?.questions_count}
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
                      <Typography variant="body2" fontFamily="Roboto">
                        <Trans i18nKey="description" />:
                      </Typography>
                      <Typography
                        variant="body2"
                        fontFamily="Roboto"
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
                <Typography
                  variant="h6"
                  fontFamily="Roboto"
                  fontWeight={"bold"}
                  fontSize="1rem"
                >
                  <Trans i18nKey="attributes" />
                </Typography>
                {assessmentKitSubjectDetails && (
                  <ListAccordion
                    items={assessmentKitSubjectDetails.attributes}
                    renderItem={(item, index, isExpanded) => {
                      return (
                        <React.Fragment key={index}>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: isExpanded ? "stretch" : "center",
                              flexDirection: isExpanded ? "column" : "row",
                            }}
                          >
                            <Typography
                              variant="body1"
                              fontFamily="Roboto"
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
                            fontFamily="Roboto"
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
const AssessmentKitQuestionnaires = (props: { details: any[] }) => {
  const { details } = props;
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
  }, [questionnaireId]);
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
            key={index}
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
                  fontFamily: "Roboto",
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
                  <Typography variant="body2" fontFamily="Roboto">
                    <Trans i18nKey="questionsCount" />:
                  </Typography>
                  <Typography
                    variant="body2"
                    fontFamily="Roboto"
                    sx={{ ml: 2 }}
                    fontWeight="bold"
                  >
                    {questionnaireDetails?.questions_count}
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
                  <Typography variant="body2" fontFamily="Roboto">
                    <Trans i18nKey="relatedSubjects" />:
                  </Typography>
                  {questionnaireDetails?.related_subject.map(
                    (subject: string, index: number) => (
                      <Typography
                        variant="body2"
                        fontFamily="Roboto"
                        sx={{ ml: 2 }}
                        fontWeight="bold"
                        key={index}
                      >
                        {subject}
                      </Typography>
                    )
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
                  <Typography variant="body2" fontFamily="Roboto">
                    <Trans i18nKey="description" />:
                  </Typography>
                  <Typography
                    variant="body2"
                    fontFamily="Roboto"
                    sx={{ ml: 2 }}
                    fontWeight="bold"
                  >
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
  const questionsRef = {} as Record<string, boolean>;
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
      attributesDetails?.questions_on_levels.findIndex(
        (obj: any) => obj.id === newValue
      )
    );
  };
  const colorPallet = getMaturityLevelColors(
    attributesDetails?.questions_on_levels
      ? attributesDetails?.questions_on_levels.length
      : 5
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
          <Typography variant="body2" fontFamily="Roboto">
            <Trans i18nKey="questionsCount" />:
          </Typography>
          <Typography
            variant="body2"
            fontFamily="Roboto"
            sx={{ ml: 2 }}
            fontWeight="bold"
          >
            {attributesDetails?.questions_count}
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
          <Typography variant="body2" fontFamily="Roboto">
            <Trans i18nKey="weight" />:
          </Typography>
          <Typography
            variant="body2"
            fontFamily="Roboto"
            sx={{ ml: 2 }}
            fontWeight="bold"
          >
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
          <Typography variant="body2" fontFamily="Roboto">
            <Trans i18nKey="description" />:
          </Typography>
          <Typography
            variant="body2"
            fontFamily="Roboto"
            sx={{ ml: 2 }}
            fontWeight="bold"
          >
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
                    colorPallet[selectedTabIndex ? selectedTabIndex : 0]
                  } !important`,
                },
              }}
            >
              {attributesDetails?.questions_on_levels.map(
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
                          {item.title}|{item.questions_count}
                        </Box>
                      }
                      value={item.id}
                    />
                  );
                }
              )}
            </Tabs>
          </Box>
          <TabPanel value={value} sx={{ py: { xs: 1, sm: 3 }, px: 0.2 }}>
            {maturityLevelQuestions && (
              <SubjectQuestionList
                questions={maturityLevelQuestions?.questions}
                questions_count={maturityLevelQuestions?.questions_count}
              />
            )}
          </TabPanel>
        </TabContext>
      </Box>
      {/* <Typography variant="h6" sx={{ opacity: 0.8 }} fontFamily="Roboto" fontSize=".9rem">
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
                        fontFamily="Roboto"
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
                              fontFamily: "Roboto",
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
                              fontFamily: "Roboto",
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
                                fontFamily: "Roboto",
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
                                fontFamily: "Roboto",
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
const AssessmentKitDialog = (props: any) => {
  const { question, onClose: closeDialog, ...rest } = props;
  const {
    title,
    options = [],
    relatedAttributes = [],
    impact,
    listOfOptions = [],
  } = question || {};
  const onSubmit = async (data: any) => {};
  const fullScreen = useScreenResize("sm");
  return (
    <Dialog
      {...rest}
      onClose={() => {
        closeDialog();
      }}
      fullWidth
      maxWidth="md"
      fullScreen={fullScreen}
    >
      <DialogTitle mb={4} px="36px" py="36px">
        <Typography
          sx={{
            pb: "2px",
            color: "#767676",
            display: "block",
            fontFamily: "Roboto",
            fontSize: "0.8rem",
            width: "100%",
          }}
          component="span"
        >
          <Trans i18nKey={"title"} />
          <Typography
            variant="body1"
            fontFamily="Roboto"
            fontWeight={"bold"}
            sx={{ color: "black" }}
          >
            {title}
          </Typography>
        </Typography>
      </DialogTitle>
      <DialogContent
        sx={{
          display: "flex",
          flexDirection: "column",
          padding: "36px",
        }}
      >
        {options &&
          options.map((op: any, index: number) => (
            <Box
              sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}
            >
              <Grid container spacing={2} columns={12}>
                <Grid xs={4} sm={6} md={8} item>
                  <Typography
                    variant="body1"
                    fontFamily="Roboto"
                    fontWeight={"bold"}
                  >
                    {index === 0 && (
                      <Typography
                        sx={{
                          pb: "2px",
                          mb: 2,
                          color: "#767676",
                          display: "block",
                          fontFamily: "Roboto",
                          fontSize: "0.8rem",
                          width: "100%",
                          borderBottom: (t) =>
                            `1px solid ${t.palette.primary.light}`,
                        }}
                        component="span"
                      >
                        <Trans i18nKey={"questionOptions"} />
                      </Typography>
                    )}
                    {op.title}
                  </Typography>
                </Grid>
                <Grid xs={4} sm={3} md={2} item>
                  <Typography
                    variant="body1"
                    fontFamily="Roboto"
                    fontWeight={"bold"}
                  >
                    {index === 0 && (
                      <Typography
                        sx={{
                          pb: "2px",
                          mb: 2,
                          color: "#767676",
                          display: "block",
                          fontFamily: "Roboto",
                          fontSize: "0.8rem",
                          width: "100%",
                          borderBottom: (t) =>
                            `1px solid ${t.palette.secondary.dark}`,
                        }}
                        component="span"
                      >
                        <Trans i18nKey={"maturityLevel"} />
                      </Typography>
                    )}
                    {op.option_values[0] && op.option_values[0].maturity_level}
                  </Typography>
                </Grid>
                <Grid xs={4} sm={3} md={2} item>
                  <Typography
                    variant="body1"
                    fontFamily="Roboto"
                    fontWeight={"bold"}
                    // position="relative"
                  >
                    {index === 0 && (
                      <Typography
                        sx={{
                          pb: "2px",
                          mb: 2,
                          color: "#767676",
                          display: "block",
                          fontFamily: "Roboto",
                          fontSize: "0.8rem",
                          width: "100%",
                          borderBottom: (t) =>
                            `1px solid ${t.palette.warning.dark}`,
                        }}
                        component="span"
                      >
                        <Trans i18nKey={"value"} />
                      </Typography>
                    )}
                    {op.option_values[0] && op.option_values[0].value}
                  </Typography>
                </Grid>
              </Grid>
            </Box>
          ))}
        {/* <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            mb: 2,
            flexDirection: "row",
            width: "100%",
          }}
        > */}
        <Grid
          container
          spacing={2}
          columns={12}
          direction="column"
          justifyContent="space-between"
          alignItems="center"
        >
          <Grid item xs sx={{ width: { xs: "100%" } }} mb={2}>
            {listOfOptions &&
              listOfOptions.map((op: any, index: number) => {
                return (
                  <Typography
                    variant="body1"
                    fontFamily="Roboto"
                    fontWeight={"bold"}
                    mb={2}
                  >
                    {index === 0 && (
                      <Typography
                        sx={{
                          pb: "2px",
                          mb: 2,
                          color: "#767676",
                          display: "block",
                          fontFamily: "Roboto",
                          fontSize: "0.8rem",
                          width: "100%",
                          borderBottom: (t) =>
                            `1px solid ${t.palette.primary.light}`,
                        }}
                        component="span"
                      >
                        <Trans i18nKey={"questionOptions"} />
                      </Typography>
                    )}
                    {op}
                  </Typography>
                );
              })}
          </Grid>
          <Grid item xs sx={{ width: { xs: "100%" } }}>
            {relatedAttributes &&
              relatedAttributes.map((item: any, index: number) => (
                <Box>
                  {index === 0 && (
                    <Typography
                      sx={{
                        width: "100%",
                        pb: "2px",
                        mb: 2,
                        color: "#767676",
                        fontFamily: "Roboto",
                        borderBottom: (t) =>
                          `1px solid ${t.palette.secondary.dark}`,
                      }}
                      variant="subMedium"
                    >
                      <Trans i18nKey={"relatedAttributes"} />
                      <Box component="span" sx={{ float: "right", mr: 1 }}>
                        <Trans i18nKey="impact" />
                      </Box>
                    </Typography>
                  )}
                  <Box
                    key={index}
                    sx={{
                      width: { xs: "100%" },
                      margin: "0 auto",
                    }}
                  >
                    <Box py={0.3} px={2} mb={2} mr={0.5}>
                      <Typography
                        variant="body1"
                        fontFamily="Roboto"
                        fontWeight={"bold"}
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          borderBottom: "1px solid rgba(0,0,0,0.05)",
                          py: "4px",
                        }}
                      >
                        {item.title}
                        <Typography
                          component="span"
                          variant="body1"
                          fontFamily="Roboto"
                          fontWeight={"bold"}
                        >
                          {item.item}
                        </Typography>
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              ))}
          </Grid>
        </Grid>
        {/* </Box> */}
        {/* )} */}
      </DialogContent>
    </Dialog>
  );
};
const SubjectQuestionList = (props: any) => {
  const { questions, questions_count } = props;
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
          <Typography
            variant="h6"
            fontFamily="Roboto"
            fontWeight={"bold"}
            fontSize="1rem"
          >
            <Trans i18nKey="questions" />
          </Typography>
        </Box>
      )}
      {questions.map((question: any, index: number) => {
        const is_farsi = languageDetector(question.title);
        const isExpanded = expanded === question.title;
        return (
          <Accordion
            key={index}
            expanded={isExpanded}
            onChange={handleChange(question)}
            sx={{
              mt: 2,
              mb: 1,
              pl: 2,
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
                  fontFamily: `${is_farsi ? "Vazirmatn" : "Roboto"}`,
                  fontWeight: "bold",
                  opacity: 1,
                  display: "flex",
                  flexWrap: "wrap",
                  direction: `${is_farsi ? "rtl" : "ltr"}`,
                }}
                variant="body2"
              >
                {index + 1}.{question.title}
                {question.may_not_be_applicable && (
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      borderRadius: "8px",
                      background: "#1976D2",
                      color: "#fff",
                      fontSize: "12px",
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
                    fontSize: "12px",
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
                    fontSize: "12px",
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
                      fontFamily: "Roboto",
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
                      fontFamily: "Roboto",
                      fontWeight: "bold",
                      opacity: 0.6,
                      ml: "4px",
                    }}
                  >
                    <Trans i18nKey="value" />
                  </Typography>
                </Box>
                {question.option.map((item: any) => (
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
                        fontFamily: "Roboto",
                        fontWeight: "bold",
                        mr: "64px",
                      }}
                    >
                      {item.index}.{item.title}
                    </Typography>
                    <Typography
                      variant="subtitle2"
                      sx={{
                        fontFamily: "Roboto",
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
        <Typography
          variant="h6"
          fontFamily="Roboto"
          fontWeight={"bold"}
          fontSize="1rem"
        >
          <Trans i18nKey="questions" />
        </Typography>
      </Box>

      {questions?.map((question: any, index: number) => {
        const isExpanded = expanded === question.title;
        const is_farsi = languageDetector(question.title);
        return (
          <Accordion
            key={index}
            expanded={isExpanded}
            onChange={handleChange(question)}
            sx={{
              mt: 2,
              mb: 1,
              pl: 2,
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
                  fontFamily: `${is_farsi ? "Vazirmatn" : "Roboto"}`,
                  fontWeight: "bold",
                  opacity: 1,
                  display: "flex",
                  flexWrap: "wrap",
                  direction: `${is_farsi ? "rtl" : "ltr"}`,
                }}
                variant="body2"
              >
                {index + 1}.{question.title}
                {question.may_not_be_applicable && (
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      borderRadius: "8px",
                      background: "#1976D2",
                      color: "#fff",
                      fontSize: "12px",
                      px: "12px",
                      mx: "4px",
                      height: "24px",
                    }}
                  >
                    <Trans i18nKey="na" />
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
                        fontFamily: `${is_farsi ? "Vazirmatn" : "Roboto"}`,
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
                          fontFamily: "Roboto",
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
                          fontFamily: "Roboto",
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
                          fontFamily: "Roboto",
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
                                fontFamily: "Roboto",
                                fontSize: "0.8rem",
                                pb: "4px",
                              }}
                            >
                              <Trans
                                i18nKey="optionValue"
                                values={{ index: index + 1 }}
                              />
                            </Typography>
                          )
                        )}
                      </Box>
                    </Box>
                    <Divider sx={{ background: "#7A589B" }} />
                    <Box>
                      {questionsDetails?.attribute_impacts.map(
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
                                fontFamily="Roboto"
                                fontWeight={"bold"}
                              >
                                {attributes.attribute.title}
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
                                {attributes.attribute?.affected_levels.map(
                                  (affectedLevel: any) => {
                                    return (
                                      <Typography
                                        variant="body1"
                                        fontFamily="Roboto"
                                        fontWeight={"bold"}
                                        sx={{ py: 1 }}
                                      >
                                        {affectedLevel.maturity_level.title} |{" "}
                                        {affectedLevel.maturity_level.index}
                                      </Typography>
                                    );
                                  }
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
                                {attributes.attribute?.affected_levels.map(
                                  (affectedLevel: any) => {
                                    return (
                                      <Typography
                                        variant="body1"
                                        fontFamily="Roboto"
                                        fontWeight={"bold"}
                                        sx={{ py: 1 }}
                                      >
                                        {affectedLevel.weight}
                                      </Typography>
                                    );
                                  }
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
                                {attributes.attribute?.affected_levels.map(
                                  (affectedLevel: any) => {
                                    return (
                                      <Box
                                        sx={{
                                          display: "flex",
                                          justifyContent: "space-between",
                                          width: "100%",
                                        }}
                                      >
                                        {affectedLevel.option_values.map(
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
                                          }
                                        )}
                                      </Box>
                                    );
                                  }
                                )}
                              </Box>
                            </Box>
                          );
                        }
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
  const { maturity_levels } = props;
  const colorPallet = getMaturityLevelColors(
    maturity_levels ? maturity_levels.length : 5
  );
  return (
    <Box sx={{ background: "#fff", px: 4, py: 4, borderRadius: "8px" }}>
      <Typography fontWeight={900} fontSize="24px" mb={8}>
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
                  pl: "16px",
                  margin: "16px",
                  width: `${90 - 10 * key}%`,
                }}
                key={key}
              >
                <Typography
                  sx={{ transform: "skew(30deg);" }}
                  fontSize="24px"
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
                    fontSize="14px"
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
                        fontSize="12px"
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
