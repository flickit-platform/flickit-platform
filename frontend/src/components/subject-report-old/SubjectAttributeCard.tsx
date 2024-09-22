import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import Title from "@common/Title";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { Trans } from "react-i18next";
import { getMaturityLevelColors, styles } from "@styles";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Divider from "@mui/material/Divider";
import { theme } from "@config/theme";
import { useEffect, useState } from "react";
import QueryData from "@common/QueryData";
import { useQuery } from "@utils/useQuery";
import { Link, useParams } from "react-router-dom";
import { useServiceContext } from "@providers/ServiceProvider";
import Tooltip, { TooltipProps, tooltipClasses } from "@mui/material/Tooltip";
import { styled } from "@mui/material/styles";
import emptyState from "@assets/svg/emptyState.svg";
import RelatedEvidencesContainer, { evidenceType } from "./SubjectEvidences";
import languageDetector from "@utils/languageDetector";
import firstCharDetector from "@/utils/firstCharDetector";
import toastError from "@/utils/toastError";
import { ICustomError } from "@/utils/CustomError";
import { toast } from "react-toastify";
import {
  Button,
  IconButton,
  InputAdornment,
  OutlinedInput,
} from "@mui/material";
import {
  CancelRounded,
  CheckCircleOutlineRounded,
  EditRounded,
  InfoOutlined,
} from "@mui/icons-material";
import { IPermissions } from "@/types";
import AIGenerated from "../common/tags/AIGenerated";

const SUbjectAttributeCard = (props: any) => {
  const {
    title,
    description,
    maturityLevel,
    maturity_levels_count,
    maturityScores,
    confidenceValue,
    id,
    attributesData,
    updateAttributeAndData,
    attributesDataPolicy,
    editable,
  } = props;
  const { permissions }: { permissions: IPermissions } = props;
  const { assessmentId } = useParams();
  const [expanded, setExpanded] = useState<string | false>(false);
  const [expandedAttribute, setExpandedAttribute] = useState<string | false>(
    false
  );
  const [emptyPositiveEvidence, setEmptyPositiveEvidence] =
    useState<boolean>(false);
  const [emptyNegativeEvidence, setEmptyNegativeEvidence] =
    useState<boolean>(false);
  const [positiveEvidenceLoading, setPositiveEvidenceLoading] =
    useState<boolean>(false);
  const [negativeEvidenceLoading, setNegativeEvidenceLoading] =
    useState<boolean>(false);
  const handleChange =
    (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
      setExpandedAttribute(isExpanded ? panel : false);
    };
  return (
    <Paper
      elevation={2}
      sx={{
        borderRadius: 3,
        py: { xs: 3, sm: 4 },
        // pr: { xs: 1.5, sm: 3, md: 4 },
        mb: 5,
      }}
    >
      <Accordion
        sx={{ boxShadow: "none !important" }}
        expanded={expandedAttribute === id}
        onChange={handleChange(id)}
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
          sx={{
            padding: "0 !important",
            alignItems: "flex-start",
            mr: 2,
            "&.Mui-focusVisible": {
              background: "#fff",
            },
          }}
          onClick={(event) => event.stopPropagation()}
        >
          <Grid container spacing={2}>
            <Grid item md={12} xs={12}>
              <Box mb={1}>
                <Title
                  sx={{
                    opacity: 0.95,
                    ml: { xs: 0.75, sm: 1.5, md: 2 },
                  }}
                >
                  <Typography variant="titleLarge" fontWeight={600}>
                    {title}
                  </Typography>
                </Title>
              </Box>

              <Box marginY={1} sx={{ ml: { xs: 0.75, sm: 1.5, md: 2 } }}>
                <Typography
                  variant="titleMedium"
                  fontWeight={400}
                  sx={{ ml: { xs: 0.75, sm: 1.5, md: 2 } }}
                >
                  {description}
                </Typography>
              </Box>
              <AttributeStatusBarContainer
                status={maturityLevel?.title}
                ml={maturityLevel?.index}
                cl={Math.ceil(confidenceValue)}
                mn={maturity_levels_count}
              />
              <Box mt={1} sx={{ ml: { xs: 0.75, sm: 1.5, md: 2 } }}>
                <Typography
                  variant="titleMedium"
                  sx={{ ml: { xs: 0.75, sm: 1.5, md: 2 } }}
                >
                  <Trans i18nKey={"withConfidence"} />
                  <Typography
                    component="span"
                    variant="titleMedium"
                    color="#3596A1"
                    mx={1}
                  >
                    {Math.ceil(confidenceValue)}%
                  </Typography>
                  <Trans
                    i18nKey={"wasEstimate"}
                    values={{ attribute: title }}
                  />
                  <Typography
                    component="span"
                    color="#6035A1"
                    variant="titleMedium"
                  >
                    {" "}
                    {maturityLevel?.index}.{" "}
                  </Typography>
                  <Trans i18nKey={"meaning"} /> {maturityLevel?.title}.
                </Typography>
              </Box>
              <Box
                mt={1}
                sx={{ ml: { xs: 0.75, sm: 1.5, md: 2 } }}
                onClick={(event) => {
                  event.stopPropagation();
                }}
              >
                {attributesData[id?.toString()] ? (
                  <Box display="flex" alignItems="center" gap="4px">
                    <OnHoverInput
                      attributeId={id}
                      width={
                        attributesDataPolicy[id?.toString()]?.aiInsight
                          ? "90%"
                          : "100%"
                      }
                      // formMethods={formMethods}
                      data={attributesData[id?.toString()]}
                      infoQuery={updateAttributeAndData}
                      type="summary"
                      editable={attributesDataPolicy[id?.toString()]?.editable}
                    />
                  </Box>
                ) : (
                  editable && (
                    <Box sx={{ ...styles.centerV }} gap={0.5} my={1}>
                      <Box
                        sx={{
                          zIndex: 1,
                          display: "flex",
                          justifyContent: "flex-start",
                          ml: { xs: 0.75, sm: 0.75, md: 1 },
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
                          <Trans i18nKey={"warning"} />
                        </Typography>
                      </Box>{" "}
                      <Typography variant="titleMedium" fontWeight={400}>
                        <Trans i18nKey="questionsArentCompleteSoAICantBeGeneratedFirstSection" />
                      </Typography>
                      <Typography
                        component={Link}
                        to={`./../../questionnaires?subject_pk=${id}`}
                        color="#2D80D2"
                        variant="titleMedium"
                        sx={{
                          textDecoration: "none",
                        }}
                      >
                        the assessment question
                      </Typography>
                      <Typography variant="titleMedium" fontWeight={400}>
                        <Trans i18nKey="questionsArentCompleteSoAICantBeGeneratedSecondSection" />
                      </Typography>
                    </Box>
                  )
                )}
                {attributesDataPolicy[id?.toString()]?.aiInsight &&
                  attributesDataPolicy[id?.toString()]?.aiInsight.isValid && (
                    <Box sx={{ ...styles.centerV }} gap={2}>
                      <AIGenerated />
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "flex-start",
                          backgroundColor: "rgba(255, 249, 196, 0.31)",
                          padding: 1,
                          borderRadius: 2,
                          maxWidth: "80%",
                        }}
                      >
                        <InfoOutlined color="primary" sx={{ marginRight: 1 }} />
                        <Typography
                          variant="titleMedium"
                          fontWeight={400}
                          textAlign="left"
                        >
                          <Trans i18nKey="invalidAIInsight" />
                        </Typography>
                      </Box>
                    </Box>
                  )}

                {((attributesDataPolicy[id?.toString()]?.assessorInsight &&
                  !attributesDataPolicy[id?.toString()]?.assessorInsight
                    ?.isValid) ||
                  (attributesDataPolicy[id?.toString()]?.aiInsight &&
                    !attributesDataPolicy[id?.toString()]?.aiInsight
                      ?.isValid)) && (
                  <Box sx={{ ...styles.centerV }} gap={2}>
                    <Box
                      sx={{
                        zIndex: 1,
                        display: "flex",
                        justifyContent: "flex-start",
                        ml: { xs: 0.75, sm: 1.5, md: 2 },
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
                        backgroundColor: "rgba(255, 249, 196, 0.31)",
                        padding: 1,
                        borderRadius: 2,
                        maxWidth: "80%",
                      }}
                    >
                      <InfoOutlined color="primary" sx={{ marginRight: 1 }} />
                      <Typography
                        variant="titleMedium"
                        fontWeight={400}
                        textAlign="left"
                      >
                        <Trans i18nKey="invalidInsight" />
                      </Typography>
                    </Box>
                    {attributesDataPolicy[id?.toString()]?.editable && (
                      <Button
                        variant="contained"
                        size="small"
                        onClick={() =>
                          updateAttributeAndData(id, assessmentId, "", true)
                        }
                      >
                        <Trans i18nKey="regenerate" />
                      </Button>
                    )}
                  </Box>
                )}
              </Box>
            </Grid>
          </Grid>
        </AccordionSummary>
        <Divider sx={{ mx: 2 }} />
        <AccordionDetails sx={{ padding: "0 !important" }}>
          {permissions.viewEvidence && (
            <>
              <Typography
                variant="h4"
                mt={4}
                mb={2}
                sx={{
                  gap: "46px",
                  ...styles.centerVH,
                }}
              >
                <Trans i18nKey={"relatedEvidences"} />
              </Typography>
              {emptyNegativeEvidence && emptyPositiveEvidence ? (
                <Box
                  width="100%"
                  padding={4}
                  gap={3}
                  sx={{ ...styles.centerCVH }}
                >
                  <img
                    style={{ maxWidth: "50vw" }}
                    src={emptyState}
                    alt="empty"
                  />
                  <Typography variant="h5" color="#9DA7B3">
                    <Trans i18nKey={"noEvidence"} />
                  </Typography>
                </Box>
              ) : (
                <Box
                  sx={{
                    ...styles.centerVH,
                    paddingX: "10vw",
                  }}
                >
                  <Grid container spacing={4} mt={1}>
                    {/* passing loading negative evidence for displaying circular progess till both of them had been loaded */}
                    <Grid item lg={6} md={6} xs={12}>
                      <RelatedEvidencesContainer
                        expandedAttribute={expandedAttribute}
                        attributeId={id}
                        type={evidenceType.positive}
                        setEmptyEvidence={setEmptyPositiveEvidence}
                        setOpositeEvidenceLoading={setPositiveEvidenceLoading}
                        opositeEvidenceLoading={negativeEvidenceLoading}
                      />
                    </Grid>
                    {/* passing loading positive evidence for displaying circular progess till both of them had been loaded */}
                    <Grid item lg={6} md={6} xs={12}>
                      <RelatedEvidencesContainer
                        expandedAttribute={expandedAttribute}
                        attributeId={id}
                        type={evidenceType.negative}
                        setEmptyEvidence={setEmptyNegativeEvidence}
                        setOpositeEvidenceLoading={setNegativeEvidenceLoading}
                        opositeEvidenceLoading={positiveEvidenceLoading}
                      />
                    </Grid>
                  </Grid>
                </Box>
              )}
            </>
          )}
          <Typography
            variant="h6"
            mt={4}
            mb={2}
            sx={{ ml: { xs: 0.75, sm: 1.5, md: 2 } }}
          >
            <Trans i18nKey={"theAchivedScores"} />
          </Typography>
          <Box sx={{ pr: { xs: 2, sm: 6 } }}>
            {maturityScores
              .map((item: any, index: number) => {
                return (
                  <div key={index}>
                    <MaturityLevelDetailsContainer
                      maturity_score={item}
                      totalml={maturityLevel?.index}
                      mn={maturity_levels_count}
                      expanded={expanded}
                      setExpanded={setExpanded}
                      attributeId={id}
                      permissions={permissions}
                    />
                  </div>
                );
              })
              .reverse()}
          </Box>
        </AccordionDetails>
      </Accordion>
    </Paper>
  );
};

export const AttributeStatusBarContainer = (props: any) => {
  const { status, ml, cl, mn, document } = props;
  const colorPallet = getMaturityLevelColors(mn);
  const statusColor = colorPallet[ml - 1];
  return (
    <Box
      display={"flex"}
      sx={{
        // ml: { xs: -1.5, sm: -3, md: -4 },
        flexDirection: { xs: "column", md: "row" },
      }}
    >
      <Box display={"flex"} flex={document ? 0.8 : 1}>
        <Box width="100%">
          {ml && <AttributeStatusBar ml={ml} isMl={true} mn={mn} />}
          {(cl == 0 || cl) && <AttributeStatusBar cl={cl} mn={mn} />}
        </Box>
      </Box>
      <Box
        sx={{ ...styles.centerV, pl: 2, pr: { xs: 0, sm: 2 } }}
        minWidth={"245px"}
        flex={document ? 0.2 : 0}
      >
        <Typography
          variant="headlineLarge"
          sx={{
            borderLeft: `2px solid ${statusColor}`,
            pl: 1,
            ml: { xs: -2, sm: 0 },
            pr: { xs: 0, sm: 1 },
            color: statusColor,
          }}
        >
          {status}
        </Typography>
      </Box>
    </Box>
  );
};

export const AttributeStatusBar = (props: any) => {
  const { ml, cl, isMl, isBasic, mn } = props;
  const width = isMl
    ? ml
      ? `${(ml / mn) * 100}%`
      : "0%"
    : cl
      ? `${cl}%`
      : "0%";
  return (
    <Box
      height={"38px"}
      width="100%"
      sx={{
        my: 0.5,
        background: "gray",
        borderTopRightRadius: "8px",
        borderBottomRightRadius: "8px",
        position: "relative",
        color: "white",
        display: "flex",
        alignItems: "center",
      }}
    >
      <Box
        height="100%"
        width={width}
        sx={{
          background: isMl ? "#6035A1" : "#3596A1",
          borderTopRightRadius: "8px",
          borderBottomRightRadius: "8px",
        }}
      ></Box>
      <Typography
        sx={{
          position: "absolute",
          zIndex: 1,
          left: "12px",
          opacity: 0.8,
        }}
        textTransform="uppercase"
        variant="h6"
      >
        <Trans i18nKey={isMl ? "maturityLevel" : "confidenceLevel"} />
      </Typography>
      <Typography
        sx={{ position: "absolute", zIndex: 1, right: "12px" }}
        variant="h6"
      >
        {isMl ? `${ml} / ${mn}` : `${cl !== null ? cl : "--"}%`}
      </Typography>
    </Box>
  );
};

const MaturityLevelDetailsContainer = (props: any) => {
  const { maturity_score, totalml, mn, expanded, setExpanded, attributeId } =
    props;
  const { permissions }: { permissions: IPermissions } = props;
  const { maturityLevel, score } = maturity_score;
  const colorPallet = getMaturityLevelColors(mn);
  const statusColor = colorPallet[maturityLevel?.index - 1];
  const is_passed = maturityLevel?.index <= totalml;
  const { service } = useServiceContext();
  const { assessmentId } = useParams();
  const fetchAffectedQuestionsOnAttributeQueryData = useQuery({
    service: (
      args = { assessmentId, attributeId: attributeId, levelId: expanded },
      config
    ) => service.fetchAffectedQuestionsOnAttribute(args, config),
    runOnMount: false,
  });

  const handleChange =
    (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
      setExpanded(isExpanded ? panel : false);
    };
  useEffect(() => {
    if (expanded === maturityLevel?.id) {
      fetchAffectedQuestionsOnAttributeQueryData.query();
    }
  }, [expanded]);

  let text;
  if (score == null) {
    text = <Trans i18nKey="noQuestionOnLevel" />;
  }
  if (is_passed && maturityLevel?.index == totalml) {
    text = <Trans i18nKey="theHighestLevelAchived" />;
  }

  const CustomWidthTooltip = styled(({ className, ...props }: TooltipProps) => (
    <Tooltip placement="bottom" {...props} classes={{ popper: className }} />
  ))({
    [`& .${tooltipClasses.tooltip}`]: {
      maxWidth: 600,
      marginLeft: "36px",
      fontSize: "14px",
    },
  });
  return (
    <Box
      display={"flex"}
      sx={{
        maxWidth: { xs: "100%", sm: "100%" },
        flexDirection: { xs: "column", sm: "row" },
      }}
    >
      <Accordion
        expanded={expanded === maturityLevel?.id}
        onChange={handleChange(maturityLevel?.id)}
        sx={{ width: "100%", boxShadow: "none !important" }}
      >
        <AccordionSummary
          expandIcon={
            permissions.viewQuestionnaireQuestions && <ExpandMoreIcon />
          }
          aria-controls="panel1bh-content"
          id="panel1bh-header"
          sx={{ padding: "0 !important" }}
        >
          <Box
            sx={{
              display: "flex",
              width: "100%",
              flexDirection: { xs: "column", md: "row" },
            }}
          >
            <Box display={"flex"} flex={1}>
              <Box width="100%">
                <MaturityLevelDetailsBar
                  text={text}
                  score={score}
                  highestIndex={is_passed && maturityLevel?.index == totalml}
                  is_passed={is_passed}
                />
              </Box>
            </Box>
            <Box
              sx={{
                ...styles.centerV,
                pl: 2,
                width: { xs: "100%", md: "30%", lg: "19%" },
              }}
            >
              <Typography
                variant="h4"
                fontWeight={"bold"}
                sx={{
                  borderLeft: `2px solid ${
                    is_passed ? statusColor : "#808080"
                  }`,
                  pl: 1,
                  ml: { xs: -2, sm: 0 },
                  pr: { xs: 0, sm: 1 },
                  color: is_passed ? statusColor : "#808080",
                }}
              >
                {maturityLevel?.title}
              </Typography>
            </Box>
          </Box>
        </AccordionSummary>
        {permissions.viewQuestionnaireQuestions && (
          <AccordionDetails>
            <QueryData
              {...fetchAffectedQuestionsOnAttributeQueryData}
              render={(data) => {
                const {
                  maxPossibleScore,
                  gainedScore,
                  gainedScorePercentage,
                  questionsCount,
                  questionnaires,
                } = data;
                return (
                  <>
                    <Typography variant="body2" display={"flex"}>
                      <Trans i18nKey="maxPossibleScore" />:
                      <Typography variant="body2" fontWeight={"bold"} ml={2}>
                        {maxPossibleScore}
                      </Typography>
                    </Typography>
                    <Typography mt={2} variant="body2" display={"flex"}>
                      <Trans i18nKey="gainedScore" />:
                      <Typography
                        variant="body2"
                        display={"flex"}
                        fontWeight={"bold"}
                        ml={2}
                      >
                        {Math.ceil(gainedScore)}
                        <Typography
                          variant="body2"
                          fontWeight={"bold"}
                          ml={0.5}
                        >
                          ({Math.ceil(gainedScorePercentage * 100)} %)
                        </Typography>
                      </Typography>
                    </Typography>
                    <Typography mt={2} variant="body2" display={"flex"}>
                      <Trans i18nKey="questionsCount" />:
                      <Typography variant="body2" fontWeight={"bold"} ml={2}>
                        {questionsCount}
                      </Typography>
                    </Typography>
                    <Divider sx={{ my: 2 }} />
                    {questionnaires.map((questionnaire: any) => {
                      const { title, questionScores } = questionnaire;

                      return (
                        <>
                          <Box>
                            <Typography
                              variant="body2"
                              fontWeight={"bold"}
                              sx={{ opacity: "0.8", ml: 1 }}
                            >
                              {title}
                            </Typography>
                          </Box>

                          <Box mt={2}>
                            <Box
                              sx={{
                                display: "flex",
                                width: { xs: "100%", sm: "100%", md: "80%" },
                                flexDirection: "column",
                              }}
                            >
                              <Box
                                sx={{
                                  display: "flex",
                                  flexDirection: "column",
                                  ml: { xs: 0, sm: 4 },
                                }}
                              >
                                <Box
                                  sx={{
                                    display: "flex",
                                    flexDirection: "row",
                                  }}
                                >
                                  <Box sx={{ width: "40%" }}>
                                    <Typography
                                      variant="titleSmall"
                                      sx={{
                                        pb: "4px",
                                        color: "#767676",
                                        display: "block",
                                      }}
                                      textAlign={"center"}
                                    >
                                      <Trans i18nKey="questions" />
                                    </Typography>
                                  </Box>
                                  <Box sx={{ width: "10%" }}>
                                    <Typography
                                      variant="titleSmall"
                                      sx={{
                                        pb: "4px",
                                        color: "#767676",
                                        display: "block",
                                      }}
                                      textAlign={"center"}
                                    >
                                      <Trans i18nKey="weight" />
                                    </Typography>
                                  </Box>
                                  <Box sx={{ width: "25%" }}>
                                    <Typography
                                      sx={{
                                        pb: "4px",
                                        color: "#767676",
                                        display: "block",
                                      }}
                                      variant="titleSmall"
                                      textAlign={"center"}
                                    >
                                      <Trans i18nKey="answer" />
                                    </Typography>
                                  </Box>
                                  <Box sx={{ width: "10%" }}>
                                    <Typography
                                      sx={{
                                        pb: "4px",
                                        color: "#767676",
                                        display: "block",
                                      }}
                                      variant="titleSmall"
                                      textAlign={"center"}
                                    >
                                      <Trans i18nKey="score" />
                                    </Typography>
                                  </Box>
                                  <Box sx={{ width: "15%" }}>
                                    <Typography
                                      sx={{
                                        pb: "4px",
                                        color: "#767676",
                                        display: "block",
                                      }}
                                      variant="titleSmall"
                                      textAlign={"center"}
                                    >
                                      <Trans i18nKey="weightedScore" />
                                    </Typography>
                                  </Box>
                                </Box>
                                <Divider sx={{ my: 1 }} />
                                {questionScores.map((question: any) => {
                                  const {
                                    questionIndex,
                                    questionTitle,
                                    questionWeight,
                                    answerOptionIndex,
                                    answerOptionTitle,
                                    answerIsNotApplicable,
                                    answerScore,
                                    weightedScore,
                                  } = question;

                                  let is_farsi =
                                    languageDetector(questionTitle);

                                  return (
                                    <Box
                                      sx={{
                                        display: "flex",
                                        flexDirection: "row",
                                        my: 1,
                                      }}
                                    >
                                      <CustomWidthTooltip
                                        title={`${questionIndex}.${questionTitle}`}
                                      >
                                        <Box sx={{ width: "40%" }}>
                                          <Typography
                                            display="flex"
                                            variant="titleMedium"
                                            textAlign={"left"}
                                          >
                                            {questionIndex}.
                                            <Typography
                                              variant="titleMedium"
                                              dir={is_farsi ? "rtl" : "ltr"}
                                              sx={{
                                                whiteSpace: "nowrap",
                                                overflow: "hidden",
                                                textOverflow: "ellipsis",
                                              }}
                                            >
                                              {questionTitle}
                                            </Typography>
                                          </Typography>
                                        </Box>
                                      </CustomWidthTooltip>
                                      <Box
                                        sx={{
                                          width: "10%",
                                          textAlign: "center",
                                        }}
                                      >
                                        <Typography
                                          variant="titleMedium"
                                          textAlign={"center"}
                                        >
                                          {questionWeight}
                                        </Typography>
                                      </Box>
                                      <Tooltip
                                        title={
                                          answerIsNotApplicable
                                            ? "NA"
                                            : answerOptionTitle !== null
                                              ? `${answerOptionIndex}.${answerOptionTitle}`
                                              : "---"
                                        }
                                      >
                                        <Box
                                          sx={{
                                            width: "25%",
                                            textAlign: "center",
                                          }}
                                        >
                                          <Typography
                                            variant="titleMedium"
                                            textAlign={"center"}
                                          >
                                            {answerIsNotApplicable
                                              ? "NA"
                                              : answerOptionTitle !== null
                                                ? `${answerOptionIndex}.${answerOptionTitle}`
                                                : "---"}
                                          </Typography>
                                        </Box>
                                      </Tooltip>
                                      <Box
                                        sx={{
                                          width: "10%",
                                          textAlign: "center",
                                        }}
                                      >
                                        <Typography
                                          variant="titleMedium"
                                          textAlign={"center"}
                                        >
                                          {answerIsNotApplicable
                                            ? "---"
                                            : answerScore}
                                        </Typography>
                                      </Box>
                                      <Box
                                        sx={{
                                          width: "15%",
                                          textAlign: "center",
                                        }}
                                      >
                                        <Typography
                                          variant="titleMedium"
                                          textAlign={"center"}
                                        >
                                          {answerIsNotApplicable
                                            ? "---"
                                            : weightedScore}
                                        </Typography>
                                      </Box>
                                    </Box>
                                  );
                                })}
                              </Box>
                            </Box>
                            <Divider
                              sx={{
                                my: 4,
                                background: "#7A589B",
                                opacity: "40%",
                              }}
                            />
                          </Box>
                        </>
                      );
                    })}
                  </>
                );
              }}
            />
          </AccordionDetails>
        )}
      </Accordion>
    </Box>
  );
};
export const MaturityLevelDetailsBar = (props: any) => {
  const { score, is_passed, text, highestIndex } = props;
  const width = `${score != null ? score : 100}%`;
  const bg_color = is_passed ? "#1769aa" : "#545252";
  const color = is_passed ? "#d1e6f8" : "#808080";
  return (
    <Box
      height={"38px"}
      width="100%"
      sx={{
        my: 0.5,
        background: color,
        borderTopRightRadius: "8px",
        borderBottomRightRadius: "8px",
        position: "relative",
        color: "white",
        display: "flex",
        alignItems: "center",
      }}
    >
      <Box
        height="70%"
        width={width}
        sx={{
          background: `${score != null ? bg_color : ""}`,
          borderTopRightRadius: "8px",
          borderBottomRightRadius: "8px",
        }}
      ></Box>
      <Typography
        sx={{
          position: "absolute",
          zIndex: 1,
          left: "12px",
          opacity: 0.8,
          fontSize: { xs: "12px", sm: "16px" },
          color: theme.palette.getContrastText(color),
        }}
        textTransform="uppercase"
        variant="h6"
      >
        {text}
      </Typography>
      <Typography
        sx={{
          position: "absolute",
          zIndex: 1,
          right: "12px",
          color: theme.palette.getContrastText(color),
        }}
        variant="h6"
      >
        {score != null && Math.ceil(score)}
        {score != null ? "%" : ""}
      </Typography>
    </Box>
  );
};

const OnHoverInput = (props: any) => {
  const [show, setShow] = useState<boolean>(false);
  const [isHovering, setIsHovering] = useState(false);
  const handleMouseOver = () => {
    editable && setIsHovering(true);
  };

  const handleMouseOut = () => {
    setIsHovering(false);
  };
  const { data, title, editable, type, attributeId, infoQuery } = props;
  const [hasError, setHasError] = useState<boolean>(false);
  const [error, setError] = useState<any>({});
  const [inputData, setInputData] = useState<string>("");
  const handleCancel = () => {
    setShow(false);
    setInputData(data);
    setError({});
    setHasError(false);
  };
  useEffect(() => {
    setInputData(data);
  }, [data]);
  const { assessmentKitId, assessmentId = "" } = useParams();
  const { service } = useServiceContext();
  const updateAssessmentKitQuery = useQuery({
    service: (
      args = {
        attributeId: attributeId,
        assessmentId: assessmentId,
        data: { assessorInsight: inputData },
      },
      config
    ) => service.updateAIReport(args, config),
    runOnMount: false,
    // toastError: true,
  });
  const updateAssessmentKit = async () => {
    try {
      const res = await infoQuery(attributeId, assessmentId, inputData);
      res?.message && toast.success(res?.message);
      setShow(false);
    } catch (e) {
      const err = e as ICustomError;
      if (Array.isArray(err.response?.data?.message)) {
        toastError(err.response?.data?.message[0]);
      } else if (
        err.response?.data &&
        err.response?.data.hasOwnProperty("message")
      ) {
        toastError(error);
      }
      setError(err);
      setHasError(true);
    }
  };

  return (
    <Box
      my={1.5}
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        ml: { xs: 0.5, sm: 0.75, md: 1 },
      }}
      width={props.width ? props.width : "100%"}
    >
      {editable && show ? (
        <Box sx={{ display: "flex", flexDirection: "column", width: "100% " }}>
          <OutlinedInput
            error={hasError}
            fullWidth
            name={title}
            defaultValue={data || ""}
            onChange={(e) => setInputData(e.target.value)}
            value={inputData}
            required={true}
            multiline={true}
            sx={{
              minHeight: "38px",
              borderRadius: "4px",
              paddingRight: "12px;",
              fontWeight: "700",
              fontSize: "0.875rem",
            }}
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  title="Submit Edit"
                  edge="end"
                  sx={{
                    background: "#1976d299",
                    borderRadius: "3px",
                    height: "36px",
                    margin: "3px",
                  }}
                  onClick={updateAssessmentKit}
                >
                  <CheckCircleOutlineRounded sx={{ color: "#fff" }} />
                </IconButton>
                <IconButton
                  title="Cancel Edit"
                  edge="end"
                  sx={{
                    background: "#1976d299",
                    borderRadius: "4px",
                    height: "36px",
                  }}
                  onClick={handleCancel}
                >
                  <CancelRounded sx={{ color: "#fff" }} />
                </IconButton>
              </InputAdornment>
            }
          />
          {hasError && (
            <Typography color="#ba000d" variant="caption">
              {error?.data?.[type]}
            </Typography>
          )}
        </Box>
      ) : (
        <Box
          sx={{
            minHeight: "38px",
            borderRadius: "4px",
            paddingLeft: "8px;",
            paddingRight: "12px;",
            width: "100%",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            wordBreak: "break-word",
            "&:hover": {
              border: editable ? "1px solid #1976d299" : "unset",
            },
          }}
          onClick={() => setShow(!show)}
          onMouseOver={handleMouseOver}
          onMouseOut={handleMouseOut}
        >
          <Typography variant="titleMedium" fontWeight="400">
            {data?.replace(/<\/?p>/g, "")}
          </Typography>
          {isHovering && (
            <IconButton
              title="Edit"
              edge="end"
              sx={{
                background: "#1976d299",
                borderRadius: "3px",
                height: "36px",
              }}
              onClick={() => setShow(!show)}
            >
              <EditRounded sx={{ color: "#fff" }} />
            </IconButton>
          )}
        </Box>
      )}
    </Box>
  );
};

export default SUbjectAttributeCard;
