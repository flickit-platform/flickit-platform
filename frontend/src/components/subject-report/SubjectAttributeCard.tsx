import React from "react";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import Title from "../../components/shared/Title";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { Trans } from "react-i18next";
import Hidden from "@mui/material/Hidden";
import { getColorOfStatus, styles } from "../../config/styles";

const SUbjectAttributeCard = (props: any) => {
  const { quality_attribute = {}, maturity_level_value: ml, status } = props;
  const { title, description, images = [] } = quality_attribute;
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
        <Grid item md={9} xs={12}>
          <Box mb={1}>
            <Title
              textTransform={"uppercase"}
              fontWeight="bolder"
              sx={{ opacity: 0.95, letterSpacing: ".05em" }}
              fontFamily="RobotoBold"
            >
              {title}
            </Title>
          </Box>
          <AttributeStatusBarContainer status={status} ml={ml} cl={1} />
          <Box mt={3}>
            <Typography fontSize="1.15rem" fontFamily={"RobotoBold"}>
              <Trans i18nKey={"withConfidence"} />
              <Typography
                component="span"
                fontFamily={"RobotoBold"}
                color="#3596A1"
                fontSize="1.12rem"
              >
                {" "}
                1 of 5{" "}
              </Typography>
              <Trans i18nKey={"wasEstimate"} values={{ attribute: title }} />
              <Typography
                component="span"
                fontFamily={"RobotoBold"}
                color="#6035A1"
                fontSize="1.2rem"
              >
                {" "}
                {ml}.{" "}
              </Typography>
              <Trans i18nKey={"meaning"} /> {status}.
            </Typography>
          </Box>
          <Box mt={0.6}>
            <Typography fontSize="1.05rem" fontFamily="RobotoMedium">
              {description}
            </Typography>
          </Box>
        </Grid>
        <Hidden smDown>
          {images[0] && (
            <Grid item md={3} xs={0}>
              <Box sx={{ ...styles.centerVH }} height="100%" width="100%">
                <img
                  src={images[0].image}
                  alt={title}
                  width="100%"
                  style={{ maxHeight: "270px" }}
                />
              </Box>
            </Grid>
          )}
        </Hidden>
      </Grid>
    </Paper>
  );
};

const AttributeStatusBarContainer = (props: any) => {
  const { status, ml, cl } = props;
  const statusColor = getColorOfStatus(status);

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
          {ml && <AttributeStatusBar ml={ml} isMl={true} />}
          {cl && <AttributeStatusBar cl={cl} />}
        </Box>
      </Box>
      <Box
        sx={{ ...styles.centerV, pl: 2, pr: { xs: 0, sm: 2 } }}
        minWidth={"245px"}
      >
        <Typography
          variant="h4"
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
  const { ml, cl, isMl, isBasic } = props;
  const width = isMl
    ? ml
      ? `${(ml / 5) * 100}%`
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
        borderTopRightRadius: 1,
        borderBottomRightRadius: 1,
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
          borderTopRightRadius: 1,
          borderBottomRightRadius: 1,
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
        {isMl ? ml : cl}/5
      </Typography>
    </Box>
  );
};

export default SUbjectAttributeCard;
