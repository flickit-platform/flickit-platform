// @ts-nocheck
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import { styles } from "@styles";
import { ICompareResultBaseInfo } from "@types";
import { Gauge } from "@common/charts/Gauge";
import Title from "@common/Title";
import { calcGridSizeBasedOnTheLengthOfAssessments } from "./utils";
import { t } from "i18next";

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
      <Box
        sx={{
          display: "flex",
          width: "100%",
          justifyContent: "center",
          flexWrap: "wrap",
        }}
      >
        {data.map((item) => {
          return (
            <Box
              // item
              // xs={4}
              sx={{
                // ...styles.compareResultBorder,
                width: "300px",
              }}
            >
              <Box
                sx={{
                  p: { xs: 0.5, sm: 1, md: 2 },
                  height: "100%",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  textAlign: "center",
                  flexDirection: "column",
                }}
              >
                <Title>{item.title}</Title>
                <Box
                  sx={{
                    ...styles.centerV,
                    mt: 2,
                    justifyContent: { xs: "center", lg: "flex-end" },
                  }}
                >
                  <Gauge
                    maturity_level_number={
                      item.maturityLevel.maturityLevelCount
                    }
                    isMobileScreen={true}
                    maturity_level_status={item.maturityLevel.title}
                    level_value={item.maturityLevel.index}
                    confidence_value={item.confidenceValue}
                    confidence_text={t("confidence")}
                    hideGuidance={true}
                    maxWidth="250px"
                    m="auto"
                  />
                </Box>
              </Box>
            </Box>
          );
        })}
      </Box>
    </Box>
  );
};

export default CompareResultAssessmentsSection;
