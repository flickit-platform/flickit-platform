import React from "react";
import { Box, Grid } from "@mui/material";
import AssessmentCard from "./AssessmentCard";
import { IAssessment, TId, TQueryFunction } from "../../types";
import { TDialogProps } from "../../utils/useDialog";

interface IAssessmentListProps {
  data: IAssessment[];
  dialogProps: TDialogProps;
  deleteAssessment: TQueryFunction<any, TId>;
}

const AssessmentsList = (props: IAssessmentListProps) => {
  const { data } = props;
  return (
    <Box py={6} sx={{ px: { xs: 1, sm: 3 } }}>
      <Grid container spacing={4}>
        {data.map((item) => {
          return <AssessmentCard item={item} {...props} key={item?.id} />;
        })}
      </Grid>
    </Box>
  );
};

export { AssessmentsList };
