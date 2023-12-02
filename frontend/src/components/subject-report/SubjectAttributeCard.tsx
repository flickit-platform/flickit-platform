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

const SUbjectAttributeCard = (props: any) => {
  const {
    title,
    description,
    maturity_level,
    maturity_levels_count,
    maturity_scores,
    confidence_level,
  } = props;
  console.log(Math.ceil(confidence_level));
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
      <Accordion sx={{ boxShadow: "none !important" }}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
          sx={{ padding: "0 !important", alignItems: "flex-start", mr: 2 }}
        >
          <Grid container spacing={2}>
            <Grid item md={11} xs={12}>
              <Box mb={1}>
                <Title
                  textTransform={"uppercase"}
                  fontWeight="bolder"
                  sx={{
                    opacity: 0.95,
                    letterSpacing: ".05em",
                    ml: { xs: 0.75, sm: 1.5, md: 2 },
                  }}
                  fontFamily="Roboto"
                >
                  {title}
                </Title>
              </Box>
              <AttributeStatusBarContainer
                status={maturity_level?.title}
                ml={maturity_level?.index}
                cl={Math.ceil(confidence_level)}
                mn={maturity_levels_count}
              />
              <Box mt={3}>
                <Typography
                  fontSize="1.15rem"
                  fontFamily="Roboto"
                  fontWeight={"bold"}
                  sx={{ ml: { xs: 0.75, sm: 1.5, md: 2 } }}
                >
                  <Trans i18nKey={"withConfidence"} />
                  <Typography
                    component="span"
                    fontFamily="Roboto"
                    fontWeight={"bold"}
                    color="#3596A1"
                    fontSize="1.12rem"
                  >
                    {" "}
                    1 of 5{" "}
                  </Typography>
                  <Trans
                    i18nKey={"wasEstimate"}
                    values={{ attribute: title }}
                  />
                  <Typography
                    component="span"
                    fontFamily="Roboto"
                    fontWeight={"bold"}
                    color="#6035A1"
                    fontSize="1.2rem"
                  >
                    {" "}
                    {maturity_level?.index}.{" "}
                  </Typography>
                  <Trans i18nKey={"meaning"} /> {maturity_level?.title}.
                </Typography>
              </Box>
              <Box mt={0.6} sx={{ ml: { xs: 0.75, sm: 1.5, md: 2 } }}>
                <Typography fontSize="1.05rem" fontFamily="Roboto">
                  {description}
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </AccordionSummary>
        <Divider sx={{ mx: 2 }} />
        <AccordionDetails sx={{ padding: "0 !important" }}>
          <Typography
            variant="h6"
            mt={4}
            mb={2}
            sx={{ ml: { xs: 0.75, sm: 1.5, md: 2 } }}
          >
            <Trans i18nKey={"theAchivedScores"} />
          </Typography>
          <Box sx={{ pr: 6 }}>
            {maturity_scores
              .map((item: any) => {
                return (
                  <MaturityLevelDetailsContainer
                    maturity_score={item}
                    totalml={maturity_level?.index}
                    mn={maturity_levels_count}
                  />
                );
              })
              .reverse()}
          </Box>
        </AccordionDetails>
      </Accordion>
    </Paper>
  );
};

const AttributeStatusBarContainer = (props: any) => {
  const { status, ml, cl, mn } = props;
  const colorPallet = getMaturityLevelColors(mn);
  const statusColor = colorPallet[ml - 1];
  console.log(cl)
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
          {(cl==0||cl) && <AttributeStatusBar cl={cl} mn={mn} />}
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
  const { maturity_score, totalml, mn } = props;
  const colorPallet = getMaturityLevelColors(mn);
  const statusColor = colorPallet[maturity_score?.maturity_level?.index - 1];
  const is_passed = maturity_score?.maturity_level?.index <= totalml;

  let text;
  if (maturity_score?.score == null) {
    text = <Trans i18nKey="noQuestionOnLevel" />;
  }
  if (is_passed && maturity_score?.maturity_level?.index == totalml) {
    text = <Trans i18nKey="theHighestLevelAchived" />;
  }
  return (
    <Box
      display={"flex"}
      sx={{
        maxWidth: { xs: "100%", sm: "100%", md: "91%", lg: "92%" },
        flexDirection: { xs: "column", sm: "row" },
      }}
    >
      <Box display={"flex"} flex={1}>
        <Box width="100%">
          <MaturityLevelDetailsBar
            text={text}
            score={maturity_score?.score}
            highestIndex={
              is_passed && maturity_score?.maturity_level?.index == totalml
            }
            is_passed={is_passed}
          />
        </Box>
      </Box>
      <Box sx={{ ...styles.centerV, pl: 2 }} minWidth={"245px"}>
        <Typography
          variant="h4"
          fontWeight={"bold"}
          letterSpacing=".15em"
          sx={{
            borderLeft: `2px solid ${is_passed ? statusColor : "#808080"}`,
            pl: 1,
            ml: { xs: -2, sm: 0 },
            pr: { xs: 0, sm: 1 },
            color: is_passed ? statusColor : "#808080",
          }}
        >
          {maturity_score?.maturity_level?.title}
        </Typography>
      </Box>
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
