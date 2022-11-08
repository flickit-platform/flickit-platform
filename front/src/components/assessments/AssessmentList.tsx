import React from "react";
import { Box, Grid } from "@mui/material";
import AssessmentCard from "./AssessmentCard";
import { IAssessment } from "../../types";
import { TDialogProps } from "../../utils/useDialog";

interface IAssessmentListProps {
  data: IAssessment[];
  dialogProps: TDialogProps;
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
