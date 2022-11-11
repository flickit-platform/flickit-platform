import React from "react";
import Grid from "@mui/material/Grid";
import { LoadingSkeleton } from "./LoadingSkeleton";

const LoadingSkeletonOfQuestionnaires = () => {
  return (
    <Grid container spacing={2} mt={2}>
      {[1, 2, 3, 4, 5].map((item) => {
        return (
          <Grid item xl={4} md={6} sm={12} xs={12} key={item}>
            <LoadingSkeleton height="153px" />
          </Grid>
        );
      })}
    </Grid>
  );
};

export default LoadingSkeletonOfQuestionnaires;
