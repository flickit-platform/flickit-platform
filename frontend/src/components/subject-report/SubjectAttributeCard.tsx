import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import Title from "@common/Title";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { Trans } from "react-i18next";
import Hidden from "@mui/material/Hidden";
import { getMaturityLevelColors, styles } from "@styles";

const SUbjectAttributeCard = (props: any) => {
  const { title, description, maturity_level, maturity_levels_count } = props;
  return (
    <Paper
      elevation={2}
      sx={{
        borderRadius: 3,
        py: { xs: 3, sm: 4 },
        px: { xs: 1.5, sm: 3, md: 4 },
        mb: 5,
      }}
    >
      <Grid container spacing={2}>
        <Grid item md={11} xs={12}>
          <Box mb={1}>
            <Title
              textTransform={"uppercase"}
              fontWeight="bolder"
              sx={{ opacity: 0.95, letterSpacing: ".05em" }}
              fontFamily="Roboto"
            >
              {title}
            </Title>
          </Box>
          <AttributeStatusBarContainer
            status={maturity_level?.title}
            ml={maturity_level?.index}
            cl={1}
            mn={maturity_levels_count}
          />
          <Box mt={3}>
            <Typography
              fontSize="1.15rem"
              fontFamily="Roboto"
              fontWeight={"bold"}
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
              <Trans i18nKey={"wasEstimate"} values={{ attribute: title }} />
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
          <Box mt={0.6}>
            <Typography fontSize="1.05rem" fontFamily="Roboto">
              {description}
            </Typography>
          </Box>
        </Grid>
      </Grid>
    </Paper>
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
        ml: { xs: -1.5, sm: -3, md: -4 },
        flexDirection: { xs: "column", sm: "row" },
      }}
    >
      <Box display={"flex"} flex={1}>
        <Box width="100%">
          {ml && <AttributeStatusBar ml={ml} isMl={true} mn={mn} />}
          {cl && <AttributeStatusBar cl={cl} mn={mn} />}
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
    ? `${(cl / 5) * 100}%`
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
        {isMl ? `${ml} / ${mn}` : `${cl} / 5`}
      </Typography>
    </Box>
  );
};

export default SUbjectAttributeCard;
