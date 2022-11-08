import React from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Skeleton from "@mui/material/Skeleton";
import Title from "../Title";
import { LoadingSkeleton } from "./LoadingSkeleton";

const LoadingSkeletonOfAssessmentReport = () => {
  return (
    <Box m="auto" pb={3} maxWidth="1440px">
      <Skeleton
        height="60px"
        sx={{ width: { xs: "90%", sm: "80%", md: "60%" } }}
      />
      <Grid container spacing={3} columns={14} mt={1}>
        <Grid item lg={8} md={14} sm={14} xs={14}>
          <Skeleton
            variant="rectangular"
            sx={{ borderRadius: 2, height: "270px" }}
          />
        </Grid>
        <Grid item lg={3} md={7} sm={14} xs={14}>
          <LoadingSkeleton height="270px" />
        </Grid>
        <Grid item lg={3} md={7} sm={14} xs={14}>
          <LoadingSkeleton height="270px" />
        </Grid>
        <Grid item sm={14} xs={14} id="subjects">
          <Box mt={4}>
            <Title borderBottom={true}>
              <Skeleton width="110px" />
            </Title>
            <Box mt={3}>
              <Grid
                container
                spacing={3}
                sx={{ px: { lg: 2, md: 4, sm: 9, xs: 0 } }}
              >
                {[1, 2, 3].map((item) => {
                  return (
                    <Grid item xs={12} sm={12} md={6} lg={4} key={item}>
                      <LoadingSkeleton height="700px" />
                    </Grid>
                  );
                })}
              </Grid>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default LoadingSkeletonOfAssessmentReport;
