// @ts-nocheck
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import { styles } from "@styles";
import { ICompareResultBaseInfo } from "@types";
import { Gauge } from "@common/charts/Gauge";
import Title from "@common/Title";
import { calcGridSizeBasedOnTheLengthOfAssessments } from "./utils";

const CompareResultAssessmentsSection = (props: {
  data: ICompareResultBaseInfo[];
}) => {
  const { data } = props;
  return (
    <Box
      sx={{
        py: 2,
        px: { xs: 1, sm: 2, md: 3 },
        background: "white",
        borderRadius: 2,
        mt: 1,
      }}
    >
      <Grid container spacing={2}>
        {data.map((item) => {
          return (
            <Grid
              item
              xs={calcGridSizeBasedOnTheLengthOfAssessments(data.length)}
              sx={{
                ...styles.compareResultBorder,
              }}
            >
              <Box
                sx={{
                  p: { xs: 0.5, sm: 1, md: 2 },
                  ...styles.centerCH,
                }}
              >
                <Title>{item.assessment.title}</Title>
                <Box
                  sx={{
                    ...styles.centerV,
                    mt: 2,
                    justifyContent: { xs: "center", lg: "flex-end" },
                  }}
                >
                  <Gauge
                    maturity_level_number={
                      item.assessment.assessment_kit.maturity_level_count
                    }
                    maturity_level_status={
                      item.assessment.assessment_kit.maturity_level.title
                    }
                    level_value={
                      item.assessment.assessment_kit.maturity_level.index
                    }
                    maxWidth="250px"
                    m="auto"
                  />
                </Box>
                <Box
                  display="flex"
                  justifyContent="space-between"
                  sx={{ flexDirection: { xs: "column-reverse", lg: "row" } }}
                ></Box>
              </Box>
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
};

export default CompareResultAssessmentsSection;
