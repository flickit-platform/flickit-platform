import React from "react";
import { Box, Grid } from "@mui/material";
import AssessmentCard from "./AssessmentCard";

const AssessmentsList = (props: any) => {
  const { data } = props;
  return (
    <Box py={6} sx={{ px: { xs: 1, sm: 3 } }}>
      <Grid container spacing={4}>
        {data.map((item: any) => {
          return <AssessmentCard item={item} {...props} key={item?.id} />;
        })}
      </Grid>
    </Box>
  );
};

export { AssessmentsList };
