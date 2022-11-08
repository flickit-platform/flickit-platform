import React from "react";
import Box from "@mui/material/Box";
import { Trans } from "react-i18next";
import Grid from "@mui/material/Grid";
import Skeleton from "@mui/material/Skeleton";
import Title from "../../components/shared/Title";
import Typography from "@mui/material/Typography";
import SubjectOverallStatusLevelChart from "./SubjectOverallStatusLevelChart";

const SubjectOverallInsight = (props: any) => {
  const { data = {} } = props;
  const { title = "" } = data;
  return (
    <Box>
      <Title sx={{ opacity: 0.9 }} inPageLink="#insight">
        <Trans i18nKey="overallStatusOf" values={{ title }} />
      </Title>
      <Box
        display="flex"
        mt={2}
        sx={{ flexDirection: { xs: "column", sm: "row" } }}
      >
        <OverallInsightText {...props} />
        <Box sx={{ pl: { xs: 0, sm: 3, md: 6 }, mt: { xs: 4, sm: 0 } }}>
          <SubjectOverallStatusLevelChart {...props} />
        </Box>
      </Box>
    </Box>
  );
};

const OverallInsightText = (props: any) => {
  const { data = {}, loading } = props;
  const {
    title,
    status,
    cl = 1,
    maturity_level_value: ml,
    most_significant_strength_atts = [],
    most_significant_weaknessness_atts = [],
    results,
  } = data;

  return (
    <Box display="flex" flexDirection={"column"} flex={1}>
      <Typography
        fontFamily={"RobotoMedium"}
        fontSize="1.3rem"
        sx={{ opacity: 0.96 }}
      >
        {loading ? (
          <Skeleton height="60px" />
        ) : (
          <>
            <Trans i18nKey="withConfidence" />{" "}
            <Typography
              component="span"
              fontFamily={"RobotoBold"}
              fontWeight="bold"
              sx={{ color: "#3596A1" }}
              fontSize="1.15rem"
            >
              <Trans i18nKey={"clOf"} values={{ cl }} />
            </Typography>{" "}
            <Trans i18nKey="wasEstimateT" values={{ title }} />{" "}
            <Typography
              component="span"
              fontWeight="bold"
              fontFamily={"RobotoBold"}
              sx={{ color: "#6035A1" }}
              fontSize="1.15rem"
            >
              {ml}.
            </Typography>{" "}
            <Trans i18nKey="meaning" values={{ title }} />{" "}
            <Typography component="span" fontFamily={"RobotoBold"}>
              {status}.
            </Typography>
            <Box>
              <Typography variant="body2">
                <Trans
                  i18nKey="attributesAreConsidered"
                  values={{ length: results?.length }}
                />
              </Typography>
            </Box>
          </>
        )}
      </Typography>
      <Grid container pt={5} spacing={4}>
        <Grid item xs={12} sm={6} md={5} lg={4}>
          <MostSigItems
            color="#005e00"
            text="strengths"
            loading={loading}
            att={most_significant_strength_atts}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={5} lg={4}>
          <MostSigItems
            color="#b10202"
            text="weaknesses"
            loading={loading}
            att={most_significant_weaknessness_atts}
          />
        </Grid>
      </Grid>
    </Box>
  );
};

const MostSigItems = ({
  loading,
  att,
  color,
  text,
}: {
  loading: boolean;
  att: any[];
  color: string;
  text: string;
}) => {
  return (
    <>
      <Title
        fontSize={"1.1rem"}
        borderBottom={true}
        color={color}
        letterSpacing={".08em"}
      >
        <Trans i18nKey={text} />
      </Title>
      <Box p={1}>
        {loading ? (
          <MostSigItemLoadingSkeleton />
        ) : (
          att?.map((attribute: any, index: any) => {
            return <Typography key={index}>{attribute?.title}</Typography>;
          })
        )}
      </Box>
    </>
  );
};

const MostSigItemLoadingSkeleton = () => {
  return (
    <>
      {[1, 2, 3].map((k) => (
        <Skeleton key={k} />
      ))}
    </>
  );
};

export default SubjectOverallInsight;
