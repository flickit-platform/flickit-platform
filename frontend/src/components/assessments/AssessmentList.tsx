import { Box, Grid } from "@mui/material";
import AssessmentCard from "./AssessmentCard";
import { IAssessment, TId, TQueryFunction } from "@types";
import { TDialogProps } from "@utils/useDialog";

interface IAssessmentListProps {
  data: IAssessment[];
  space: any;
  dialogProps: TDialogProps;
  deleteAssessment: TQueryFunction<any, TId>;
}

const AssessmentsList = (props: IAssessmentListProps) => {
  const { data, space } = props;
  return (
    <Box>
      <Grid container spacing={4}>
        {data.map((item) => {
          return (
            <AssessmentCard
              item={{ ...item, space }}
              {...props}
              key={item?.id}
            />
          );
        })}
      </Grid>
    </Box>
  );
};

export { AssessmentsList };
