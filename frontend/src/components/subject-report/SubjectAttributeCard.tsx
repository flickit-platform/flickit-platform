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
import { useParams } from "react-router-dom";
import { useServiceContext } from "@providers/ServiceProvider";
import Tooltip, { TooltipProps, tooltipClasses } from "@mui/material/Tooltip";
import { styled } from "@mui/material/styles";
import emptyState from "@assets/svg/emptyState.svg";
import deleteSvg from "@assets/svg/delete.svg";
import checkmark from "@assets/svg/checkmark.svg";
import RelatedEvidencesContainer, { evidenceType } from "./SubjectEvidences";
import languageDetector from "@utils/languageDetector";
import ConfidenceLevel from "@/utils/confidenceLevel/confidenceLevel";
import ColorfulProgress from "../common/progress/ColorfulProgress";
import { IconButton, useMediaQuery } from "@mui/material";
import { Info, InfoOutlined, InfoRounded } from "@mui/icons-material";

const SUbjectAttributeCard = (props: any) => {
  const {
    title,
    description,
    maturityLevel,
    maturity_levels_count,
    maturityScores,
    confidenceValue,
    id,
  } = props;
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
    <Accordion
      sx={{
        width: "100%",
        borderRadius: "32px !important",
        boxShadow: "0px 0px 8px 0px rgba(10, 35, 66, 0.25)",
        transition: "background-position .4s ease",
        position: "relative",
        "&::before": {
          display: "none",
        },
      }}
      expanded={expandedAttribute === id}
      onChange={handleChange(id)}
    >
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls="panel1a-content"
        id="panel1a-header"
        sx={{
          borderTopLeftRadius: "32px !important",
          borderTopRightRadius: "32px !important",
          textAlign: "center",
          backgroundColor: expandedAttribute ? "rgba(10, 35, 66, 0.07)" : "",
          "& .MuiAccordionSummary-content": {
            minHeight: { md: "100px", lg: "100px" },
            maxHeight: { md: "160px", lg: "160px" },
            paddingLeft: { md: "1rem", lg: "1rem" },
          },
        }}
      >
        <Grid container spacing={2}>
          <Grid item md={11} xs={12} display="flex">
            <AttributeSummary
              title={title}
              description={description}
              status={maturityLevel?.title}
              maturityLevelValue={maturityLevel?.value}
              confidenceValue={Math.ceil(confidenceValue)}
              maturityLevelsCount={maturity_levels_count}
            />
            {/* <Box mt={3}>
              <Typography
                fontSize="1.15rem"
                fontWeight={"bold"}
                sx={{ ml: { xs: 0.75, sm: 1.5, md: 2 } }}
              >
                <Trans i18nKey={"withConfidence"} />
                <Typography
                  component="span"
                  fontWeight={"bold"}
                  color="#3596A1"
                  fontSize="1.12rem"
                  mx={1}
                >
                  {Math.ceil(confidenceValue)}%
                </Typography>
                <Trans i18nKey={"wasEstimate"} values={{ attribute: title }} />
                <Typography
                  component="span"
                  fontWeight={"bold"}
                  color="#6035A1"
                  fontSize="1.2rem"
                >
                  {" "}
                  {maturityLevel?.index}.{" "}
                </Typography>
                <Trans i18nKey={"meaning"} /> {maturityLevel?.title}.
              </Typography>
            </Box> */}
            {/* <Box mt={0.6} sx={{ ml: { xs: 0.75, sm: 1.5, md: 2 } }}>
              <Typography fontSize="1.05rem" >
                {description}
              </Typography>
            </Box> */}
          </Grid>
        </Grid>
      </AccordionSummary>
      <AccordionDetails sx={{ padding: "0 !important", mb: 2 }}>
        <Typography
          mt={4}
          fontSize="1.5rem"
          fontWeight={700}
          sx={{
            gap: "46px",
            ...styles.centerVH,
          }}
        >
          <Trans i18nKey={"relatedEvidences"} />
        </Typography>
        {emptyNegativeEvidence && emptyPositiveEvidence ? (
          <Box width="100%" padding={4} gap={3} sx={{ ...styles.centerCVH }}>
            <img style={{ maxWidth: "50vw" }} src={emptyState} alt="empty" />
            <Typography fontSize="1.25rem" fontWeight={500} color="#9DA7B3">
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

        <Typography
          textAlign="center"
          fontSize="1.5rem"
          fontWeight={700}
          color="#3B4F68"
          my="2rem"
        >
          <Trans i18nKey={"maturityLevelsScoreDetails"} />
        </Typography>
        <Box
          display="flex"
          flexDirection="column"
          gap="0.5rem"
          pb="1rem"
          sx={{ px: { xs: 2, sm: 10 } }}
        >
          {maturityScores
            .map((item: any) => {
              return (
                <MaturityLevelDetailsContainer
                  maturity_score={item}
                  totalml={maturityLevel?.index}
                  mn={maturity_levels_count}
                  expanded={expanded}
                  setExpanded={setExpanded}
                  attributeId={id}
                />
              );
            })
            .reverse()}
        </Box>
      </AccordionDetails>
    </Accordion>
  );
};

const AttributeSummary = (props: any) => {
  const {
    status,
    maturityLevelValue,
    confidenceValue,
    maturityLevelsCount,
    title,
    description,
  } = props;
  const colorPallet = getMaturityLevelColors(maturityLevelsCount);
  const statusColor = colorPallet[maturityLevelsCount - 1];
  const isMobileScreen = useMediaQuery((theme: any) =>
    theme.breakpoints.down("sm")
  );
  return (
    <Grid container alignItems="center">
      <Grid
        item
        xs={6}
        lg={4}
        md={4}
        sm={6}
        display="flex"
        flexDirection="column"
        justifyItems="center"
        alignItems="center"
      >
        <Box
          display="flex"
          justifyItems="center"
          alignItems="center"
          sx={{
            overflow: "hidden",
            textOverflow: "ellipsis",
            textAlign: "center",
          }}
        >
          <Typography
            color="#3B4F68"
            sx={{
              textTransform: "none",
              whiteSpace: "pre-wrap",
              fontSize: "1.25rem",
            }}
            fontWeight={500}
          >
            {title}
          </Typography>
          <Tooltip title={description} arrow>
            <IconButton
              size="small"
              sx={{ mx: 1, "&:hover": { background: "transparent" } }}
            >
              <InfoOutlined fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      </Grid>
      <Grid item xs={1} lg={1} md={1} sm={1}></Grid>
      <Grid item xs={1} lg={3} md={3} sm={1}>
        <Box
          sx={{
            ...styles.centerVH,
            justifyContent: "space-around",
          }}
        >
          <Typography
            fontWeight={500}
            display={{ xs: "none", sm: "none", md: "block" }}
            color="rgba(108, 123, 142, 1)"
          >
            <Trans i18nKey="confidenceLevel" />
          </Typography>
          <ConfidenceLevel
            inputNumber={confidenceValue}
            displayNumber={isMobileScreen ? false : true}
          />
        </Box>
      </Grid>
      <Grid item xs={0} lg={2} md={2} sm={0}></Grid>

      <Grid item xs={4} lg={2} md={2} sm={4}>
        <Box
          sx={{
            ...styles.centerVH,
            textAlign: "center",
          }}
        >
          <Typography
            fontWeight={700}
            pl={1}
            fontSize="1.5rem"
            color={colorPallet[maturityLevelValue - 1]}
          >
            {status}
          </Typography>
        </Box>
      </Grid>
    </Grid>
  );
};

const AttributeStatusBarContainer = (props: any) => {
  const { status, ml, cl, mn } = props;
  const colorPallet = getMaturityLevelColors(mn);
  const statusColor = colorPallet[ml - 1];
  return (
    <Box
      display={"flex"}
      sx={{
        // ml: { xs: -1.5, sm: -3, md: -4 },
        flexDirection: { xs: "column", sm: "row" },
      }}
    >
      <Box display={"flex"} flex={1}>
        <Box width="100%">
          {ml && <AttributeStatusBar ml={ml} isMl={true} mn={mn} />}
          {(cl == 0 || cl) && <AttributeStatusBar cl={cl} mn={mn} />}
        </Box>
      </Box>
      <Box
        sx={{ ...styles.centerV, pl: 2, pr: { xs: 0, sm: 2 } }}
        minWidth={"245px"}
      >
        <Typography
          variant="h4"
          fontWeight={"bold"}
          letterSpacing=".15em"
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
          letterSpacing: { xs: ".09em", sm: ".15em" },
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
      fontSize: ".875rem",
    },
  });
  return (
    <Box display={"flex"}>
      <Accordion
        expanded={expanded === maturityLevel?.id}
        onChange={handleChange(maturityLevel?.id)}
        sx={{
          width: "100%",
          borderRadius: "32px !important",
          transition: "background-position .4s ease",
          position: "relative",
          border: "1px solid #EDF4FC",
          boxShadow: "none !important",
          "&::before": {
            display: "none",
          },
        }}
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1bh-content"
          id="panel1bh-header"
          sx={{
            borderRadius:
              expanded === maturityLevel?.id ? "" : "32px !important",
            borderTopLeftRadius: "32px !important",
            borderTopRightRadius: "32px !important",
            textAlign: "center",
            backgroundColor:
              expanded === maturityLevel?.id ? "#EDFCFC" : "#EDFCFC80",
            "& .MuiAccordionSummary-content": {
              height: { md: "64px" },
              paddingLeft: { md: "1rem", lg: "1rem" },
            },
          }}
        >
          <Box
            sx={{
              display: "flex",
              width: "100%",
              alignItems: "center",
              flexDirection: { xs: "column", sm: "row" },
            }}
          >
            <Grid container spacing={2}>
              <Grid
                item
                lg={7}
                md={7}
                xs={10}
                sm={10}
                display={"flex"}
                flex={1}
                color="#004F83"
                width="100%"
                alignItems="center"
              >
                {/* <MaturityLevelDetailsBar
                  text={text}
                  score={score}
                  highestIndex={is_passed && maturityLevel?.index == totalml}
                  is_passed={is_passed}
                /> */}
                <ColorfulProgress
                  numaratur={score}
                  denominator={100}
                  displayPercent
                  guideText={text}
                  progressHeight="20px"
                />
              </Grid>
              <Grid item lg={2} md={2} xs={2}>
                <Box
                  sx={{
                    ...styles.centerCVH,
                    height: "100%",
                  }}
                >
                  <img
                    src={is_passed ? checkmark : deleteSvg}
                    alt={is_passed ? "is passed" : "failed"}
                  />
                </Box>
              </Grid>

              <Grid item lg={3} md={3} xs={12}>
                {" "}
                <Box
                  sx={{
                    ...styles.centerVH,
                    textAlign: "center",
                  }}
                >
                  <Typography
                    fontWeight={700}
                    fontSize="1.5rem"
                    color={colorPallet[maturityLevel?.value - 1]}
                  >
                    {maturityLevel?.title}
                  </Typography>
                </Box>
              </Grid>
            </Grid>
            {/* <Box sx={{ ...styles.centerV, pl: 2 }} minWidth={"245px"}>
              <Typography
                variant="h4"
                fontWeight={"bold"}
                letterSpacing=".15em"
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
            </Box> */}
          </Box>
        </AccordionSummary>
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
                  <Box
                    display="flex"
                    justifyContent="space-around"
                    alignItems="center"
                    flexDirection={{ sm: "column", xs: "column", md: "row" }}
                  >
                    <Typography mt={2} variant="body2" display={"flex"}>
                      <Trans i18nKey="maxPossibleScore" />
                      <Typography
                        variant="body2"
                        display={"flex"}
                        fontWeight={"bold"}
                        ml={2}
                      >
                        {maxPossibleScore}
                      </Typography>
                    </Typography>
                    <Typography mt={2} variant="body2" display={"flex"}>
                      <Trans i18nKey="gainedScore" />
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
                      <Trans i18nKey="questionsCount" />
                      <Typography variant="body2" fontWeight={"bold"} ml={2}>
                        {questionsCount}
                      </Typography>
                    </Typography>
                  </Box>
                  <Divider sx={{ my: 2 }} />
                  <Box maxHeight="440px" overflow="auto">
                    {questionnaires.map((questionnaire: any) => {
                      const { title, questionScores } = questionnaire;

                      return (
                        <Accordion
                          defaultExpanded
                          sx={{
                            boxShadow: "none",
                            "&:before": {
                              display: "none",
                            },
                          }}
                        >
                          <AccordionSummary
                            sx={{ backgroundColor: "transparent", padding: 0 }}
                          >
                            <Box
                              display="flex"
                              alignItems="center"
                              width="100%"
                            >
                              <Box
                                flexGrow={1}
                                display="flex"
                                flexDirection="column"
                                alignItems="center"
                              >
                                <Typography
                                  variant="body2"
                                  fontWeight="bold"
                                  sx={{ opacity: 0.8 }}
                                >
                                  {title}
                                </Typography>
                                <Divider sx={{ width: "100%", my: 1 }} />
                              </Box>
                              <ExpandMoreIcon sx={{ mt: 2 }} />
                            </Box>
                          </AccordionSummary>
                          <AccordionDetails
                            sx={{ display: "flex", justifyContent: "center" }}
                          >
                            <Box
                              sx={{
                                width: { xs: "100%", sm: "100%", md: "96%" },
                              }}
                            >
                              <Box
                                sx={{
                                  display: "flex",
                                  flexDirection: "column",
                                  alignItems: "center",
                                }}
                              >
                                <Box
                                  sx={{
                                    display: "flex",
                                    flexDirection: "column",
                                    width: "100%",
                                  }}
                                >
                                  <Box
                                    sx={{
                                      display: "flex",
                                      flexDirection: "row",
                                    }}
                                  >
                                    <Box sx={{ width: "4%" }}>
                                      <Typography
                                        sx={{
                                          pb: "4px",
                                          color: "#767676",
                                          display: "block",
                                          fontSize: "0.7rem",
                                        }}
                                        textAlign="center"
                                      >
                                        <Trans i18nKey="index" />
                                      </Typography>
                                    </Box>
                                    <Box
                                      sx={{
                                        width: "36%",
                                      }}
                                    >
                                      <Typography
                                        sx={{
                                          pb: "4px",
                                          color: "#767676",
                                          display: "block",
                                          fontSize: "0.7rem",
                                        }}
                                        textAlign="center"
                                      >
                                        <Trans i18nKey="questions" />
                                      </Typography>
                                    </Box>
                                    <Box
                                      sx={{
                                        width: "10%",
                                      }}
                                    >
                                      <Typography
                                        sx={{
                                          pb: "4px",
                                          color: "#767676",
                                          display: "block",
                                          fontSize: "0.7rem",
                                        }}
                                        textAlign="center"
                                      >
                                        <Trans i18nKey="weight" />
                                      </Typography>
                                    </Box>
                                    <Box
                                      sx={{
                                        width: "25%",
                                      }}
                                    >
                                      <Typography
                                        sx={{
                                          pb: "4px",
                                          color: "#767676",
                                          display: "block",
                                          fontSize: "0.7rem",
                                        }}
                                        textAlign="center"
                                      >
                                        <Trans i18nKey="answer" />
                                      </Typography>
                                    </Box>
                                    <Box
                                      sx={{
                                        width: "10%",
                                      }}
                                    >
                                      <Typography
                                        sx={{
                                          pb: "4px",
                                          color: "#767676",
                                          display: "block",
                                          fontSize: "0.7rem",
                                        }}
                                        textAlign="center"
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
                                          fontSize: "0.7rem",
                                        }}
                                        textAlign="center"
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
                                        key={questionIndex}
                                        sx={{
                                          display: "flex",
                                          flexDirection: "row",
                                          my: 1,
                                        }}
                                      >
                                        <Box sx={{ width: "4%", mr: 2 }}>
                                          <Typography
                                            display="flex"
                                            variant="body1"
                                            textAlign="left"
                                            fontSize="0.75rem"
                                          >
                                            {questionIndex}
                                          </Typography>
                                        </Box>
                                        <CustomWidthTooltip
                                          title={`${questionTitle}`}
                                        >
                                          <Box
                                            sx={{
                                              width: "36%",
                                            }}
                                          >
                                            <Typography
                                              variant="body1"
                                              fontWeight="300"
                                              fontSize="0.75rem"
                                              letterSpacing="0.4px"
                                              textAlign="justify"
                                              dir={is_farsi ? "rtl" : "ltr"}
                                              sx={{
                                                display: "-webkit-box",
                                                WebkitBoxOrient: "vertical",
                                                overflow: "hidden",
                                                textOverflow: "ellipsis",
                                                WebkitLineClamp: 3,
                                                whiteSpace: "normal",
                                              }}
                                            >
                                              {questionTitle}
                                            </Typography>
                                          </Box>
                                        </CustomWidthTooltip>
                                        <Box
                                          sx={{
                                            width: "10%",
                                          }}
                                        >
                                          <Typography
                                            variant="body1"
                                            fontWeight="300"
                                            textAlign="center"
                                            fontSize="0.75rem"
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
                                            }}
                                          >
                                            <Typography
                                              variant="body1"
                                              fontWeight="300"
                                              textAlign="center"
                                              fontSize="0.75rem"
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
                                          }}
                                        >
                                          <Typography
                                            variant="body1"
                                            fontWeight="300"
                                            textAlign="center"
                                            fontSize="0.75rem"
                                          >
                                            {answerIsNotApplicable
                                              ? "---"
                                              : answerScore}
                                          </Typography>
                                        </Box>
                                        <Box sx={{ width: "15%" }}>
                                          <Typography
                                            variant="body1"
                                            fontWeight="bold"
                                            textAlign="center"
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
                            </Box>
                          </AccordionDetails>
                        </Accordion>
                      );
                    })}
                  </Box>
                </>
              );
            }}
          />
        </AccordionDetails>
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
        height="100%"
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
          letterSpacing: { xs: ".09em", sm: ".15em" },
          fontSize: ".75rem",
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

export default SUbjectAttributeCard;
