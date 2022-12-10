import React, { PropsWithChildren } from "react";
import Box from "@mui/material/Box";
import { useServiceContext } from "../../providers/ServiceProvider";
import { useParams } from "react-router-dom";
import { useQuery } from "../../utils/useQuery";
import QueryData from "../shared/QueryData";
import Title from "../shared/Title";
import Chip from "@mui/material/Chip";
import { Trans } from "react-i18next";
import Button from "@mui/material/Button";
import Tab from "@mui/material/Tab";
import TabList from "@mui/lab/TabList";
import { styles } from "../../config/styles";
import TabPanel from "@mui/lab/TabPanel";
import TabContext from "@mui/lab/TabContext";
import Grid from "@mui/material/Grid";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Divider from "@mui/material/Divider";
import { styled } from "@mui/material";
import get from "lodash/get";
import Collapse from "@mui/material/Collapse";
import ProfileSectionGeneralInfo from "./ProfileSectionGeneralInfo";
import ListAccordion from "../shared/lists/ListAccordion";
import InfoItem from "../shared/InfoItem";

const ProfileContainer = () => {
  const { profileQueryProps } = useProfile();

  return (
    <Box>
      <QueryData
        {...profileQueryProps}
        render={(data) => {
          const {
            profileInfos: { createdAt },
          } = data;
          return (
            <Box>
              <Title
                toolbar={
                  <Typography variant="subMedium">
                    <Trans i18nKey="created" />: {createdAt}
                  </Typography>
                }
              >
                {data.title}
              </Title>
              <ProfileSectionGeneralInfo data={data} />
              <ProfileSectionsTabs data={data} />
            </Box>
          );
        }}
      />
    </Box>
  );
};

const ProfileSectionsTabs = (props: { data: any }) => {
  const { data } = props;

  const [value, setValue] = React.useState("subjects");
  const handleTabChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  return (
    <Box mt={4} mx={1.5}>
      <TabContext value={value}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
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
        <TabPanel value="subjects" sx={{ p: { xs: 1, sm: 3 } }}>
          <ProfileSubjects subjects={data.subjects} />
        </TabPanel>
        <TabPanel value="questionnaires" sx={{ p: { xs: 1, sm: 3 } }}>
          <ProfileQuestionnaires questionnaires={data.questionnaires} />
        </TabPanel>
      </TabContext>
    </Box>
  );
};

const ProfileSubjects = (props: { subjects: any[] }) => {
  const { subjects } = props;
  const [expanded, setExpanded] = React.useState<string | false>(false);

  const handleChange =
    (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
      setExpanded(isExpanded ? panel : false);
    };

  return (
    <Box>
      {subjects.map((subject) => {
        const isExpanded = expanded === subject.title;
        return (
          <Accordion
            expanded={isExpanded}
            onChange={handleChange(subject.title)}
            sx={{
              background: isExpanded
                ? "linear-gradient(154deg, #d9c1ff 0%, transparent 100%)"
                : "linear-gradient(154deg, #d9c1ff 0%, transparent 50%)",
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
                  fontFamily: "RobotoBold",
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
                  mr: { xs: "10%" },
                  maxWidth: { xs: "360px" },
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
                <Grid container spacing={4} sx={{ mb: 1 }}>
                  <Grid item xs={3}>
                    {subject.infos.map((info: any) => {
                      return <InfoItem info={info} />;
                    })}
                  </Grid>
                  <Grid item xs={9}>
                    <Box display="flex">
                      <Typography variant="body2" fontFamily="RobotoRegular">
                        <Trans i18nKey="description" />:
                      </Typography>
                      <Typography
                        variant="body2"
                        fontFamily="RobotoMedium"
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
                  fontFamily="RobotoBold"
                  fontSize="1rem"
                >
                  <Trans i18nKey="attributes" />
                </Typography>
                <ListAccordion
                  items={subject.attributes}
                  renderItem={(item, index, isExpanded) => {
                    return (
                      <>
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: isExpanded ? "stretch" : "center",
                            flexDirection: isExpanded ? "column" : "row",
                          }}
                        >
                          <Typography
                            variant="body1"
                            fontFamily="RobotoBold"
                            minWidth="180px"
                          >
                            {item.title}
                          </Typography>{" "}
                          <Typography
                            sx={{
                              opacity: 0.9,
                              marginLeft: isExpanded ? 0 : 5,
                              marginTop: isExpanded ? 2 : 0,
                              maxWidth: isExpanded ? undefined : "340px",
                              ...(isExpanded ? {} : styles.ellipsis),
                            }}
                            variant="body2"
                            fontFamily="RobotoRegular"
                          >
                            {item.item}
                          </Typography>
                        </Box>
                        <ProfileQuestionsList questions={item.questions} />
                      </>
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

const ProfileQuestionnaires = (props: { questionnaires: any[] }) => {
  const { questionnaires } = props;
  const [expanded, setExpanded] = React.useState<string | false>(false);

  const handleChange =
    (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
      setExpanded(isExpanded ? panel : false);
    };

  return (
    <Box>
      {questionnaires.map((questionnaire) => {
        const isExpanded = expanded === questionnaire.title;
        return (
          <Accordion
            expanded={isExpanded}
            onChange={handleChange(questionnaire.title)}
            sx={{
              background:
                "linear-gradient(154deg, #d9c1ff 0%, transparent 50%)",
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
                  fontFamily: "RobotoBold",
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
                  maxWidth: { xs: "360px" },
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  transition: "opacity .2s ease",
                  opacity: isExpanded ? 0 : 1,
                }}
              >
                {questionnaire.description}
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Box p={1}>
                <Grid container spacing={4} sx={{ mb: 1 }}>
                  <Grid item xs={3}>
                    {questionnaire.infos.map((info: any) => {
                      return <InfoItem info={info} />;
                    })}
                  </Grid>
                  <Grid item xs={9}>
                    <Box display="flex" justifyContent={"space-between"}>
                      <Typography variant="body2" fontFamily="RobotoRegular">
                        Description:
                      </Typography>
                      <Typography
                        variant="body2"
                        fontFamily="RobotoMedium"
                        sx={{ ml: 2 }}
                      >
                        Lorem ipsum dolor sit amet consectetur adipisicing elit.
                        Esse, sed tenetur sint consectetur maxime dolorum amet
                        quae fugit! Accusantium, eum numquam at esse ut vel unde
                        earum voluptate nam error. sed tenetur sint consectetur
                        maxime dolorum amet quae fugit! Accusantium, eum numquam
                        at esse ut vel unde earum voluptate nam error.
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
                  fontFamily="RobotoRegular"
                  fontSize=".9rem"
                >
                  <Trans i18nKey="questions" />
                </Typography>
                <Box
                  component="ol"
                  sx={{
                    marginTop: 6,
                    paddingInlineStart: "20px",
                    paddingRight: 2,
                  }}
                >
                  {questionnaire.questions.map(
                    (question: any, index: number) => {
                      return (
                        <li style={{ marginBottom: "12px" }}>
                          <Box
                            display="flex"
                            justifyContent={"space-between"}
                            py={1}
                          >
                            <Grid container spacing={2} columns={14}>
                              <Grid xs={5} item>
                                <Typography
                                  variant="body1"
                                  fontFamily="RobotoBold"
                                  position="relative"
                                >
                                  {index === 0 && (
                                    <Typography
                                      sx={{
                                        position: "absolute",
                                        top: "-36px",
                                        pb: "2px",
                                        color: "#767676",
                                        fontFamily: "RobotoRegular",
                                        width: "100%",
                                        borderBottom: (t) =>
                                          `1px solid ${t.palette.primary.light}`,
                                      }}
                                      variant="subMedium"
                                    >
                                      <Trans i18nKey={"title"} />
                                    </Typography>
                                  )}
                                  {question.title}
                                </Typography>{" "}
                              </Grid>
                              <Grid item xs={5}>
                                {" "}
                                <Box position={"relative"} minWidth="160px">
                                  {index === 0 && (
                                    <Typography
                                      sx={{
                                        position: "absolute",
                                        width: "100%",
                                        top: "-36px",
                                        pb: "2px",
                                        fontFamily: "RobotoRegular",
                                        color: "#767676",
                                        borderBottom: (t) =>
                                          `1px solid ${t.palette.warning.main}`,
                                      }}
                                      variant="subMedium"
                                    >
                                      <Trans i18nKey={"question options"} />
                                    </Typography>
                                  )}
                                  <ul style={{ paddingInlineStart: "20px" }}>
                                    <li>option 1 im not so sure about this</li>
                                    <li>option 2</li>
                                    <li>option 1 im not so sure about this</li>
                                    <li>option 1 im not so sure about this</li>
                                  </ul>
                                </Box>
                              </Grid>
                              <Grid item xs={4}>
                                <Box position={"relative"} minWidth="300px">
                                  {index === 0 && (
                                    <Typography
                                      sx={{
                                        width: "100%",
                                        position: "absolute",
                                        top: "-36px",
                                        pb: "2px",
                                        color: "#767676",
                                        fontFamily: "RobotoRegular",
                                        borderBottom: (t) =>
                                          `1px solid ${t.palette.secondary.dark}`,
                                      }}
                                      variant="subMedium"
                                    >
                                      <Trans i18nKey={"Related attributes"} />
                                      <Box
                                        component="span"
                                        sx={{ float: "right", mr: 1 }}
                                      >
                                        <Trans i18nKey="impact" />
                                      </Box>
                                    </Typography>
                                  )}
                                  <Box
                                    sx={{
                                      background: (t) =>
                                        t.palette.secondary.main,
                                      borderRadius: 8,
                                      color: "white",
                                      width: "auto",
                                    }}
                                  >
                                    <Box py={0.3} px={2} mb={0.5} mr={0.5}>
                                      <Typography
                                        variant="body2"
                                        sx={{
                                          display: "flex",
                                          justifyContent: "space-between",
                                        }}
                                      >
                                        att.title
                                        <Typography
                                          variant="subMedium"
                                          sx={{
                                            color: "white",
                                            position: "relative",
                                          }}
                                        >
                                          4
                                        </Typography>
                                      </Typography>
                                    </Box>
                                  </Box>
                                </Box>
                              </Grid>
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
            </AccordionDetails>
          </Accordion>
        );
      })}
    </Box>
  );
};

const ProfileQuestionsList = (props: { questions: any[] }) => {
  const { questions } = props;

  return (
    <Box m={1} mt={5}>
      <Typography
        variant="h6"
        sx={{ opacity: 0.8 }}
        fontFamily="RobotoMedium"
        fontSize=".9rem"
      >
        <Trans i18nKey="questions" />
        <span style={{ float: "right" }}>32</span>
      </Typography>
      <Box sx={{ marginTop: 6 }} component="ol">
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

          return (
            <li style={{ marginBottom: "12px" }}>
              <Box display="flex" justifyContent={"space-between"} py={1}>
                <Grid container spacing={2} columns={gridColumns}>
                  <Grid xs={8} item>
                    <Typography
                      variant="body1"
                      fontFamily="RobotoBold"
                      position="relative"
                    >
                      {index === 0 && (
                        <Typography
                          sx={{
                            position: "absolute",
                            top: "-36px",
                            pb: "2px",
                            color: "#767676",
                            fontFamily: "RobotoRegular",
                            width: "100%",
                            borderBottom: (t) =>
                              `1px solid ${t.palette.primary.light}`,
                          }}
                          variant="subMedium"
                        >
                          <Trans i18nKey={"title"} />
                        </Typography>
                      )}
                      {title}
                    </Typography>
                  </Grid>
                  <Grid item xs={5}>
                    <Box position={"relative"} minWidth="160px">
                      {index === 0 && (
                        <Typography
                          sx={{
                            position: "absolute",
                            width: "100%",
                            top: "-36px",
                            pb: "2px",
                            fontFamily: "RobotoRegular",
                            color: "#767676",
                            borderBottom: (t) =>
                              `1px solid ${t.palette.warning.main}`,
                          }}
                          variant="subMedium"
                        >
                          <Trans i18nKey={"question options"} />
                        </Typography>
                      )}
                      <ul style={{ paddingInlineStart: "20px" }}>
                        {options.map((option: string) => {
                          return <li key={option}>{option}</li>;
                        })}
                      </ul>
                    </Box>
                  </Grid>
                  {hasImpact && (
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
                              fontFamily: "RobotoRegular",
                              borderBottom: (t) =>
                                `1px solid ${t.palette.secondary.dark}`,
                            }}
                            variant="subMedium"
                          >
                            <Trans i18nKey={"Impact"} />
                          </Typography>
                        )}
                        <Box px={1}>{impact}</Box>
                      </Box>
                    </Grid>
                  )}
                  {hasRelatedAttributes && (
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
                              fontFamily: "RobotoRegular",
                              borderBottom: (t) =>
                                `1px solid ${t.palette.secondary.dark}`,
                            }}
                            variant="subMedium"
                          >
                            <Trans i18nKey={"Related attributes"} />
                          </Typography>
                        )}
                        <Box>
                          {relatedAttributes.map((att: any) => {
                            return (
                              <Chip
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
                  )}
                </Grid>
              </Box>
              {index !== questions.length - 1 && <Divider />}
            </li>
          );
        })}
      </Box>
    </Box>
  );
};

const useProfile = () => {
  const { service } = useServiceContext();
  const { profileId } = useParams();
  const profileQueryProps = useQuery({
    service: (args = { profileId }, config) =>
      service.fetchProfile(args, config),
    runOnMount: false,
    initialData: {
      title: "Common profile",
      profileInfos: {
        authorInfos: {
          name: "Erfan kaboli",
          description: `Lorem ipsum dolor sit amet consectetur adipisicing elit.
        Esse, sed tenetur sint consectetur maxime dolorum amet
        quae fugit! Accusantium, eum numquam at esse ut vel unde
        earum voluptate nam error.`,
        },
        primaryInfos: [
          {
            type: "tags",
            title: "Tags",
            item: ["Security", "Operation"],
          },
          {
            title: "last update",
            item: "2022/02/01",
          },
          {
            type: "array",
            title: "Subjects",
            item: ["Team", "Operation", "Software"],
          },
        ],
        secondaryInfos: [
          {
            title: "Questionnaires count",
            item: 6,
          },
          {
            title: "Total questions count",
            item: 150,
          },
          { title: "Attributes count", item: 18 },
        ],
      },
      subjects: [
        {
          title: "Team",
          description: "Some description about this subject",
          infos: [
            { title: "Number of attributes", item: 32 },
            { title: "Index of the Team", item: 1 },
          ],
          attributes: [
            {
              title: "Team-security",
              item: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Esse, sed tenetur sint consectetur maxime dolorum amet quae fugit! Accusantium, eum numquam at esse ut vel unde earum voluptate nam error. sed tenetur sint consectetur maxime dolorum amet quae fugit! Accusantium, eum numquam at esse ut vel unde earum voluptate nam error.",
              questions: [
                {
                  title: "how is it?",
                  options: ["option 1", "option 2"],
                  impact: 4,
                },
                {
                  title: "how is it?",
                  options: ["option 1", "option 2"],
                  impact: 4,
                },
                {
                  title: "how is it?",
                  options: ["option 1", "option 2"],
                  impact: 4,
                },
                {
                  title: "how is it?",
                  options: ["option 1", "option 2"],
                  impact: 4,
                },
              ],
            },
            {
              title: "Team-Agility",
              item: "Team has the security",
              questions: [
                {
                  title: "how is it?",
                  options: ["option 1", "option 2"],
                  impact: 4,
                },
              ],
            },
            {
              title: "Team-Performance",
              item: "Team has the security",
              questions: [
                {
                  title: "how is it?",
                  options: ["option 1", "option 2"],
                  impact: 4,
                },
              ],
            },
          ],
        },
        {
          title: "Operation",
          description: "Some description about this subject",
          infos: [
            { title: "Number of attributes", item: 32 },
            { title: "Index of the Team", item: 1 },
          ],
          attributes: [
            {
              title: "Team-security",
              item: "Team has the security",
              questions: [
                {
                  title: "how is it?",
                  options: ["option 1", "option 2"],
                  impact: 4,
                },
              ],
            },
            {
              title: "Team-security",
              item: "Team has the security",
              questions: [
                {
                  title: "how is it?",
                  options: ["option 1", "option 2"],
                  impact: 4,
                },
              ],
            },
            {
              title: "Team-security",
              item: "Team has the security",
              questions: [
                {
                  title: "how is it?",
                  options: ["option 1", "option 2"],
                  impact: 4,
                },
              ],
            },
          ],
        },
        {
          title: "Software",
          description: "Some description about this subject",
          infos: [
            { title: "Number of attributes", item: 32 },
            { title: "Index of the Team", item: 1 },
          ],
          attributes: [
            {
              title: "Team-security",
              item: "Team has the security",
              questions: [
                {
                  title: "how is it?",
                  options: ["option 1", "option 2"],
                  impact: 4,
                },
              ],
            },
            {
              title: "Team-security",
              item: "Team has the security",
              questions: [
                {
                  title: "how is it?",
                  options: ["option 1", "option 2"],
                  impact: 4,
                },
              ],
            },
            {
              title: "Team-security",
              item: "Team has the security",
              questions: [
                {
                  title: "how is it?",
                  options: ["option 1", "option 2"],
                  impact: 4,
                },
              ],
            },
          ],
        },
      ],
      questionnaires: [
        {
          title: "Monitoring",
          description: "Some description about this Monitoring",
          infos: [
            {
              title: "Related subjects",
              item: ["Team", "Software"],
              type: "array",
            },
            { title: "Number of questions", item: 32 },
            { title: "Questionnaire index", item: 32 },
          ],
          questions: [
            {
              title: "How was your day?",
              questionIndex: 3,
              listOfOptions: [],
              questionImpact: 5,
              relatedAttributes: [
                { title: "Software-softness", item: 4 },
                { title: "Software-security", item: 2 },
              ],
            },
            {
              title: "How was your day?",
              questionIndex: 3,
              listOfOptions: [],
              questionImpact: 5,
              relatedAttributes: [
                { title: "Software-softness", item: 4 },
                { title: "Software-security", item: 2 },
              ],
            },
            {
              title: "How was your day?",
              questionIndex: 3,
              listOfOptions: [],
              questionImpact: 5,
              relatedAttributes: [
                { title: "Software-softness", item: 4 },
                { title: "Software-security", item: 2 },
              ],
            },
          ],
        },
        {
          title: "Team learning",
          description: "Some description about this Monitoring",
          infos: [
            {
              title: "Related subjects",
              item: ["Team", "Software"],
              type: "array",
            },
            { title: "Number of questions", item: 32 },
            { title: "Questionnaire index", item: 32 },
          ],
          questions: [
            {
              title: "How was your day?",
              questionIndex: 3,
              listOfOptions: [],
              questionImpact: 5,
              relatedAttributes: [],
            },
            {
              title: "How was your day?",
              questionIndex: 3,
              listOfOptions: [],
              questionImpact: 5,
              relatedAttributes: [],
            },
            {
              title: "How was your day?",
              questionIndex: 3,
              listOfOptions: [],
              questionImpact: 5,
              relatedAttributes: [],
            },
          ],
        },
        {
          title: "Human resource",
          description: "Some description about this Monitoring",
          infos: [
            {
              title: "Related subjects",
              item: ["Team", "Software"],
              type: "array",
            },
            { title: "Number of questions", item: 32 },
            { title: "Questionnaire index", item: 32 },
          ],
          questions: [
            {
              title: "How was your day?",
              questionIndex: 3,
              listOfOptions: [],
              questionImpact: 5,
              relatedAttributes: [],
            },
            {
              title:
                "Is it possible to automatically monitor the health of services, servers, and software components and send a warning when a service is unavailable and monitor the health of software sub-components?",
              questionIndex: 3,
              listOfOptions: [],
              questionImpact: 5,
              relatedAttributes: [],
            },
            {
              title: "How was your day?",
              questionIndex: 3,
              listOfOptions: [],
              questionImpact: 5,
              relatedAttributes: [],
            },
          ],
        },
      ],
    },
  });

  return { profileQueryProps };
};

export default ProfileContainer;
