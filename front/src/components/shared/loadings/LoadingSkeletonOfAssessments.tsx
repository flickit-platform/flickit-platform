import React from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import { LoadingSkeleton } from "./LoadingSkeleton";

const LoadingSkeletonOfAssessments = () => {
  return (
    <Box py={6} sx={{ px: { xs: 1, sm: 3 } }}>
      <Grid container spacing={4}>
        {[1, 2, 3, 4, 5, 6].map((item: any) => {
          return (
            <Grid item lg={3} md={4} sm={6} xs={12} key={item}>
              <LoadingSkeleton height="425px" />
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
};

export { LoadingSkeletonOfAssessments };
