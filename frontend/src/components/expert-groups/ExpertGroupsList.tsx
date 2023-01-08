import { Box, Grid } from "@mui/material";
import ExpertGroupsItem from "./ExpertGroupsItem";

interface IExpertGroupsListProps {
  data: any;
}

const ExpertGroupsList = (props: IExpertGroupsListProps) => {
  const { data } = props;
  const { results = [] } = data;

  return (
    <Box>
      <Grid container spacing={3}>
        {results.map((expertGroup: any) => {
          return (
            <Grid item xs={12} sm={6} lg={4}>
              <ExpertGroupsItem data={expertGroup} />
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
};

export default ExpertGroupsList;
