import { Box, Button, Grid, Pagination, Skeleton, Stack } from "@mui/material";
import { t } from "i18next";
import { Trans } from "react-i18next";
import { styles } from "@styles";
import { useAuthContext } from "@providers/AuthProvider";
import { useServiceContext } from "@providers/ServiceProvider";
import { TQueryFunction } from "@types";
import forLoopComponent from "@utils/forLoopComponent";
import useDialog from "@utils/useDialog";
import useDocumentTitle from "@utils/useDocumentTitle";
import { useQuery } from "@utils/useQuery";
import { LoadingSkeleton } from "@common/loadings/LoadingSkeleton";
import QueryData from "@common/QueryData";
import ExpertGroupCEFormDialog from "./ExpertGroupCEFormDialog";
import ExpertGroupsList from "./ExpertGroupsList";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";

const ExpertGroupsContainer = () => {
  const { service } = useServiceContext();
  const { userInfo } = useAuthContext();
  const { id } = userInfo || {};
  const { is_expert } = userInfo;
  const [pageNumber, setPageNumber] = useState(1);
  const pageSize = 20

  const handleChangePage = (event: React.ChangeEvent<unknown>, value: number) => {
    setPageNumber(value);
  };

  const queryData = useQuery({
    service: (args = { id, size: pageSize, page: pageNumber }, config) =>
      service.fetchExpertGroups(args, config),
  });

  useEffect(() => {
    queryData.query({ id, size: pageSize, page: pageNumber });
  }, [pageNumber]);

  const pageCount =
    !queryData.data || queryData.data?.size === 0
      ? 1
      : Math.ceil(queryData.data?.total / queryData.data?.size);

  useDocumentTitle(t("expertGroups") as string);

  return (
    <Box>
      <Box
        sx={{
          background: "white",
          py: 1,
          px: 2,
          ...styles.centerV,
          borderRadius: 1,
          mt: 2,
        }}
      >
        <Box></Box>
        <Box ml="auto">
          {<CreateExpertGroupButton onSubmitForm={queryData.query} />}
        </Box>
      </Box>

      <QueryData
        {...queryData}
        renderLoading={() => {
          return (
            <Grid container spacing={3} mt={1}>
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
          return (
            <>
              <ExpertGroupsList data={data} />
              <Stack
                spacing={2}
                sx={{
                  mt: 3,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Pagination
                  variant="outlined"
                  color="primary"
                  count={pageCount}
                  onChange={handleChangePage}
                  page={pageNumber}
                />
              </Stack>
            </>
          );
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
