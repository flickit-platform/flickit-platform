import React, { useRef, useState } from "react";
import { Box, IconButton } from "@mui/material";
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
const AssessmentKitExpertViewContainer = () => {
  const { assessmentKitQueryProps, fetchAssessmentKitQuery } =
    useAssessmentKit();
  const dialogProps = useDialog();
  const { userInfo } = useAuthContext();
  const userId = userInfo.id;
  const { expertGroupId } = useParams();
  return (
    <Box>
      <QueryBatchData
        queryBatchData={[assessmentKitQueryProps, fetchAssessmentKitQuery]}
        render={([data = {}, ana]) => {
          const { is_expert = true, expert_group } = data;
          setDocumentTitle(`${t("assessmentKit")}: ${data.title || ""}`);
          return (
            <>
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
                          title: expert_group?.name,
                          to: `/user/expert-groups/${expertGroupId}`,
                        },
                      ]}
                    />
                  }
                  // sub={data.summary}
                  toolbar={
                    is_expert && (
                      <IconButton
                        title="Setting"
                        color="primary"
                        onClick={() =>
                          dialogProps.openDialog({ type: "update", data })
                        }
                      >
                        <SettingsRoundedIcon />
                      </IconButton>
                    )
                  }
                >
                  {data.title}
                </Title>
                <Box mt={3}>
                  <AssessmentKitSectionGeneralInfo
                    data={data}
                    query={assessmentKitQueryProps.query}
                  />
                  <AssessmentKitSectionsTabs data={data} />
                </Box>
              </Box>
              <AssessmentKitSettingFormDialog
                {...dialogProps}
                onSubmitForm={assessmentKitQueryProps.query}
                fetchAssessmentKitQuery={fetchAssessmentKitQuery}
                tags={ana[0]?.tags}
              />
            </>
          );
        }}
      />
    </Box>
  );
};
const AssessmentKitSectionsTabs = (props: { data: any }) => {
  const { data } = props;
  const [value, setValue] = useState("subjects");
  const handleTabChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };
  return (
    <Box mt={6}>
      <TabContext value={value}>
        <Box>
          <TabList onChange={handleTabChange}>
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
          <AssessmentKitSubjects subjects={data.subjectsInfos} />
        </TabPanel>
        <TabPanel value="questionnaires" sx={{ py: { xs: 1, sm: 3 }, px: 0.2 }}>
          <AssessmentKitQuestionnaires questionnaires={data.questionnaires} />
        </TabPanel>
      </TabContext>
    </Box>
  );
};
const AssessmentKitSubjects = (props: { subjects: any[] }) => {
  const { subjects } = props;
  const [expanded, setExpanded] = React.useState<string | false>(false);
  const dialogProps = useDialog();
  const handleChange =
    (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
      setExpanded(isExpanded ? panel : false);
    };
  return (
    <Box>
      {subjects.map((subject, index) => {
        const isExpanded = expanded === subject.title;
        return (
          <Accordion
            key={index}
            expanded={isExpanded}
            onChange={handleChange(subject.title)}
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
                {subject.title}
              </Typography>
              <Typography
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
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Box p={1}>
                <Grid container spacing={2} sx={{ mb: 1 }}>
                  <Grid item xs={12} sm={5} md={4} lg={3}>
                    {subject.report_infos.map((info: any, index: number) => {
                      return <InfoItem info={info} bg="white" key={index} />;
                    })}
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
                      >
                        {subject.description}
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
                <ListAccordion
                  items={subject.attributes_infos}
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
                            {item.title}
                          </Typography>{" "}
                          <Typography
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
                          </Typography>
                        </Box>
                        <AssessmentKitQuestionsList
                          questions={item.questions}
                          index={index}
                        />
                      </React.Fragment>
                    );
                  }}
                />
              </Box>
            </AccordionDetails>
          </Accordion>
        );
      })}
    </Box>
  );
};
const AssessmentKitQuestionnaires = (props: { questionnaires: any[] }) => {
  const { questionnaires } = props;
  const [expanded, setExpanded] = React.useState<string | false>(false);
  const handleChange =
    (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
      setExpanded(isExpanded ? panel : false);
    };
  return (
    <Box>
      {questionnaires.map((questionnaire, index) => {
        const isExpanded = expanded === questionnaire.title;
        return (
          <Accordion
            key={index}
            expanded={isExpanded}
            onChange={handleChange(questionnaire.title)}
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
                {questionnaire.title}
              </Typography>
              <Typography
                sx={{
                  color: "text.secondary",
                  position: "relative",
                  mr: { xs: "10%" },
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  transition: "opacity .2s ease",
                  opacity: isExpanded ? 0 : 1,
                  maxWidth: { xs: "90px", md: "130px", lg: "320px" },
                  display: { xs: "none", md: "block" },
                }}
              >
                {questionnaire.description}
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Box p={1}>
                <Grid container spacing={3} sx={{ mb: 1 }}>
                  <Grid item xs={12} md={5} lg={4}>
                    {questionnaire.report_infos.map(
                      (info: any, index: number) => {
                        return (
                          <InfoItem
                            key={index}
                            bg="white"
                            info={{
                              ...info,
                              type:
                                info.title === "Related subjects"
                                  ? "array"
                                  : info.type,
                            }}
                          />
                        );
                      }
                    )}
                  </Grid>
                  <Grid item xs={12} md={7} lg={8}>
                    <Box
                      display="flex"
                      sx={{
                        borderRadius: 1,
                        background: "white",
                        px: 1,
                        py: 0.8,
                      }}
                    >
                      <Typography variant="body2" fontFamily="Roboto">
                        <Trans i18nKey="description" />:
                      </Typography>
                      <Typography
                        variant="body2"
                        fontFamily="Roboto"
                        sx={{ ml: 2 }}
                      >
                        {questionnaire.description}
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              </Box>
              <Divider />
              <Box m={1} mt={2}>
                <Typography
                  variant="h6"
                  sx={{ opacity: 0.9 }}
                  fontFamily="Roboto"
                  fontSize=".9rem"
                >
                  <Trans i18nKey="questions" />
                </Typography>
                <Box sx={{ overflowX: "auto" }}>
                  <Box
                    component="ol"
                    sx={{
                      minWidth: "750px",
                      marginTop: 6,
                      paddingInlineStart: "20px",
                      paddingRight: 2,
                    }}
                  >
                    {questionnaire.questions.map(
                      (question: any, index: number) => {
                        const dialogProps = useDialog();
                        return (
                          <li
                            style={{ marginBottom: "12px", marginLeft: "6px" }}
                            key={index}
                          >
                            <Box
                              display="flex"
                              justifyContent={"space-between"}
                              py={1}
                            >
                              <Grid container spacing={2} columns={14}>
                                <Grid xs={14} md={14} lg={14} item>
                                  <Typography
                                    onClick={() => {
                                      dialogProps.openDialog({});
                                    }}
                                    sx={{ cursor: "pointer" }}
                                    variant="body1"
                                    fontFamily="Roboto"
                                    fontWeight={"bold"}
                                    position="relative"
                                  >
                                    {index === 0 && (
                                      <Typography
                                        sx={{
                                          position: "absolute",
                                          top: "-36px",
                                          pb: "2px",
                                          color: "#767676",
                                          fontFamily: "Roboto",
                                          display: "block",
                                          fontSize: ".8rem",
                                          width: "100%",
                                          borderBottom: (t) =>
                                            `1px solid ${t.palette.primary.light}`,
                                        }}
                                        component="span"
                                      >
                                        <Trans i18nKey={"title"} />
                                      </Typography>
                                    )}
                                    {question.title}
                                  </Typography>
                                </Grid>
                                {/* <Grid item xs={4} md={4} lg={4}>
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
                                    {question.listOfOptions.map((op: any, index: number) => {
                                      return <li key={index}>{op}</li>;
                                    })}
                                  </ul>
                                </Box>
                              </Grid> */}
                                {/* <Grid item xs={4} md={4} lg={3}>
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
                                          borderBottom: (t) =>
                                            `1px solid ${t.palette.secondary.dark}`,
                                        }}
                                        variant="subMedium"
                                      >
                                        <Trans i18nKey={"relatedAttributes"} />
                                        <Box
                                          component="span"
                                          sx={{ float: "right", mr: 1 }}
                                        >
                                          <Trans i18nKey="impact" />
                                        </Box>
                                      </Typography>
                                    )}
                                    {question.relatedAttributes.map(
                                      (att: any, index: number) => {
                                        return (
                                          <Box
                                            key={index}
                                            sx={{
                                              background: (t) =>
                                                t.palette.secondary.main,
                                              borderRadius: 8,
                                              color: "white",
                                              width: "auto",
                                            }}
                                          >
                                            <Box
                                              py={0.3}
                                              px={2}
                                              mb={0.5}
                                              mr={0.5}
                                            >
                                              <Typography
                                                variant="body2"
                                                sx={{
                                                  display: "flex",
                                                  justifyContent:
                                                    "space-between",
                                                }}
                                              >
                                                {att.title}
                                                <Typography
                                                  component="span"
                                                  sx={{
                                                    fontWeight: "bold",
                                                    color: "white",
                                                    position: "relative",
                                                  }}
                                                >
                                                  {att.item}
                                                </Typography>
                                              </Typography>
                                            </Box>
                                          </Box>
                                        );
                                      }
                                    )}
                                  
                                  </Box>
                                </Grid> */}
                                <AssessmentKitDialog
                                  {...dialogProps}
                                  question={question}
                                />
                              </Grid>
                            </Box>
                            {index !== questionnaire.questions.length - 1 && (
                              <Divider sx={{ mt: 3 }} />
                            )}
                          </li>
                        );
                      }
                    )}
                  </Box>
                </Box>
              </Box>
            </AccordionDetails>
          </Accordion>
        );
      })}
    </Box>
  );
};
const AssessmentKitQuestionsList = (props: {
  questions: any[];
  index: number;
}) => {
  const { questions, index } = props;
  const questionsRef = {} as Record<string, boolean>;
  return (
    <Box m={1} mt={5}>
      {/* <Typography variant="h6" sx={{ opacity: 0.8 }} fontFamily="Roboto" fontSize=".9rem">
        <Trans i18nKey="questions" />
        <span style={{ float: "right" }}>{questions.length}</span>
      </Typography> */}
      <Box sx={{ overflowX: "auto" }}>
        <Box
          sx={{
            minWidth: "580px",
            marginTop: 6,
            paddingInlineStart: { xs: 0, md: "30px" },
            listStyle: "none",
          }}
          component="ol"
        >
          {/* <AttributeDetails index={index} /> */}
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
                    </Grid>
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
                    <AssessmentKitDialog {...dialogProps} question={question} />
                  </Grid>
                </Box>
                {index !== questions.length - 1 && <Divider />}
              </li>
            );
          })}
        </Box>
      </Box>
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
const AttributeDetails = (props: { index: number }) => {
  const { index } = props;
  const { queryData } = useAssessmentKit();
  const { data, loaded } = queryData;
  const gridColumns =
    (loaded && data[index].metrics_number_by_level.length * 3) || 3;
  return (
    <Box display="flex" justifyContent={"space-between"} marginBottom={5}>
      <Grid container spacing={2} columns={15}>
        {loaded &&
          data[index].metrics_number_by_level.map((item: any) => (
            <Grid item xs={3}>
              <Box position={"relative"}>
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
                  <Trans i18nKey={"level"} />
                  <Box component="span" sx={{ float: "right", mr: 1 }}>
                    <Trans i18nKey="metrics" />
                  </Box>
                </Typography>
                <Box
                  sx={{
                    background: (t) => t.palette.secondary.main,
                    borderRadius: 8,
                    color: "white",
                    width: "auto",
                  }}
                >
                  <Box py={0.3} px={2} mb={0.5} mr={0.5}>
                    <Typography
                      variant="body2"
                      sx={{
                        fontWeight: "bold",
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      {item.level}
                      <Typography
                        component="span"
                        sx={{
                          fontWeight: "bold",
                          color: "white",
                          position: "relative",
                        }}
                      >
                        {item.metric_number}
                      </Typography>
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Grid>
          ))}
      </Grid>
    </Box>
  );
};
const useAssessmentKit = () => {
  const { service } = useServiceContext();
  const { assessmentKitId } = useParams();
  const assessmentKitQueryProps = useQuery({
    service: (args = { assessmentKitId }, config) =>
      service.inspectAssessmentKit(args, config),
  });
  const queryData = useQuery({
    service: (args = { assessmentKitId }, config) =>
      service.analyzeAssessmentKit(args, config),
    runOnMount: true,
  });
  const fetchAssessmentKitQuery = useQuery({
    service: (args = { assessmentKitId }, config) =>
      service.fetchAssessmentKitdata(args, config),
    runOnMount: true,
  });
  return { assessmentKitQueryProps, queryData, fetchAssessmentKitQuery };
};
export default AssessmentKitExpertViewContainer;
