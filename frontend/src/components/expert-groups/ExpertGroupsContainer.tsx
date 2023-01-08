import { Box, Button, Grid, Skeleton } from "@mui/material";
import { Trans } from "react-i18next";
import { useServiceContext } from "../../providers/ServiceProvider";
import { TQueryFunction } from "../../types";
import forLoopComponent from "../../utils/forLoop";
import useDialog from "../../utils/useDialog";
import { useQuery } from "../../utils/useQuery";
import { LoadingSkeleton } from "../shared/loadings/LoadingSkeleton";
import QueryData from "../shared/QueryData";
import ExpertGroupCEFormDialog from "./ExpertGroupCEFormDialog";
import ExpertGroupsList from "./ExpertGroupsList";

const ExpertGroupsContainer = () => {
  const { service } = useServiceContext();
  const queryData = useQuery({
    service: (args, config) => service.fetchUserExpertGroups(args, config),
  });

  return (
    <Box>
      <Box display="flex" sx={{ my: 1 }}>
        <CreateExpertGroupButton onSubmitForm={queryData.query} />
      </Box>
      <QueryData
        {...queryData}
        renderLoading={() => {
          return (
            <Grid container spacing={3}>
              {forLoopComponent(4, (i) => {
                return (
                  <Grid item key={i} xs={12} sm={6} lg={4}>
                    <LoadingSkeleton height="174px" />
                  </Grid>
                );
              })}
            </Grid>
          );
        }}
        render={(data) => {
          return <ExpertGroupsList data={data} />;
        }}
      />
    </Box>
  );
};

const CreateExpertGroupButton = (props: { onSubmitForm: TQueryFunction }) => {
  const { onSubmitForm } = props;
  const dialogProps = useDialog();

  return (
    <>
      <Button
        variant="contained"
        sx={{ ml: "auto" }}
        size="small"
        onClick={dialogProps.openDialog}
      >
        <Trans i18nKey="createExpertGroup" />
      </Button>
      <ExpertGroupCEFormDialog {...dialogProps} onSubmitForm={onSubmitForm} />
    </>
  );
};

export default ExpertGroupsContainer;
