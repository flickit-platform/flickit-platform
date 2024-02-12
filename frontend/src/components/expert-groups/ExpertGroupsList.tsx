import { Box, Grid } from "@mui/material";
import ExpertGroupsItem from "./ExpertGroupsItem";

interface IExpertGroupsListProps {
  data: any;
}

const ExpertGroupsList = (props: IExpertGroupsListProps) => {
  const { data } = props;
  const { items = [] } = data;
  return (
    <Box mt={2}>
      <Grid container spacing={3}>
        {items.map((expertGroup: any) => {
          return (
            <Grid item xs={12} sm={6} lg={4} key={expertGroup.id}>
              <ExpertGroupsItem data={expertGroup} />
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
};

export default ExpertGroupsList;
