import Box from "@mui/material/Box";
import { Trans } from "react-i18next";
import Grid from "@mui/material/Grid";
import Skeleton from "@mui/material/Skeleton";
import Title from "@common/Title";
import Typography from "@mui/material/Typography";
import SubjectOverallStatusLevelChart from "./SubjectOverallStatusLevelChart";
import { Gauge } from "../common/charts/Gauge";
import { getNumberBaseOnScreen } from "@/utils/returnBasedOnScreen";
import { Divider } from "@mui/material";
import ConfidenceLevel from "@/utils/confidenceLevel/confidenceLevel";
import { getMaturityLevelColors } from "@/config/styles";

const SubjectOverallInsight = ({ data }: any) => {
  const {
    attributes,
    subject,
    topStrengths,
    topWeaknesses,
    maturityLevelsCount,
  } = data;
  const { maturityLevel, confidenceValue } = subject;
  return (
    <Box
      height="100%"
      sx={{
        background: "#fff",
        boxShadow: "0px 0px 8px 0px rgba(0, 0, 0, 0.25)",
        borderRadius: "40px",
      }}
    >
      <Grid
        container
        spacing={2}
        columns={12}
        alignItems="center"
        display="flex"
      >
        <Grid item lg={7} md={12} sm={12} xs={12}>
          <Box
            maxHeight="260px"
            overflow="auto"
            border="1px solid #ddd"
            borderRadius="2rem"
            ml={{ lg: 4 }}
            m={{ sm: 2, xs: 2 }}
          >
            <Grid container>
              {attributes.map((element: any) => (
                <Grid item lg={6} md={6} sm={12} xs={12} key={element.id}>
                  <Box
                    display="flex"
                    flexDirection="column"
                    alignItems="center"
                    justifyContent="space-between"
                    padding={2}
                    margin={1}
                    gap={1}
                  >
                    <Typography
                      fontWeight="500"
                      fontSize="1.5rem"
                      textAlign="center"
                    >
                      {element.title}
                    </Typography>
                    <Box display="flex" alignItems="center" gap={0.5}>
                      <Typography
                        sx={{
                          color:
                            getMaturityLevelColors(5)[
                              element.maturityLevel.value - 1
                            ],
                        }}
                        fontWeight="500"
                        fontSize="1rem"
                      >
                        {element.maturityLevel.title}
                      </Typography>
                      <ConfidenceLevel inputNumber={element.confidenceValue} />
                    </Box>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Box>
        </Grid>
        <Grid item lg={5} md={12} sm={12} xs={12}>
          <Gauge
            level_value={maturityLevel?.value ?? 0}
            maturity_level_status={maturityLevel?.title}
            maturity_level_number={5}
            confidence_value={confidenceValue}
            display_confidence_component={true}
            isMobileScreen={false}
            hideGuidance={true}
            height={getNumberBaseOnScreen(340, 440, 440, 380, 440)}
            mb="-8%"
            mt="8%"
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default SubjectOverallInsight;
