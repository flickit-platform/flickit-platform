import React from "react";
import { SpaceLayout } from "../SpaceLayout";
import Box from "@mui/material/Box";
import { Trans } from "react-i18next";
import { Empty, QueryData, Title } from "../../../components";
import useDialog from "../../../utils/useDialog";
import CreateSpaceDialog from "../CreateSpaceDialog";
import { SpacesList } from "../SpacesList";
import { useServiceContext } from "../../../providers/ServiceProvider";
import { useQuery } from "../../../utils/useQuery";
import AddRounded from "@mui/icons-material/AddRounded";
import { Skeleton, Typography } from "@mui/material";
import { ToolbarCreateItemBtn } from "../../../components/buttons/ToolbarCreateItemBtn";

export const SpaceContainer = () => {
  const dialogProps = useDialog();
  const { service } = useServiceContext();
  const spacesQueryData = useQuery({
    service: () => service.fetchSpaces(),
    toastError: true,
  });

  const isEmpty = spacesQueryData?.data?.results?.length === 0;

  return (
    <SpaceLayout
      title={
        <Title
          borderBottom={true}
          toolbar={
            <ToolbarCreateItemBtn
              icon={<AddRounded />}
              onClick={dialogProps.openDialog}
              shouldAnimate={isEmpty}
              text="createSpace"
            />
          }
        >
          <Trans i18nKey="spaces" />
        </Title>
      }
    >
      <QueryData
        {...spacesQueryData}
        renderLoading={() => (
          <Box mt={5}>
            {[1, 2, 3, 4, 5].map((item) => {
              return (
                <Skeleton
                  key={item}
                  variant="rectangular"
                  sx={{ borderRadius: 2, height: "60px", mb: 1 }}
                />
              );
            })}
          </Box>
        )}
        emptyDataComponent={
          <Empty
            emptyMessage={<Trans i18nKey="nothingToSeeHere" />}
            suggests={
              <Typography variant="subtitle1" textAlign="center">
                <Trans i18nKey="tryCreatingNewSpace" />
              </Typography>
            }
          />
        }
        render={(data) => {
          return (
            <SpacesList
              dialogProps={dialogProps}
              data={data}
              fetchSpaces={spacesQueryData.query}
            />
          );
        }}
      />

      <CreateSpaceDialog
        {...dialogProps}
        onSubmitForm={spacesQueryData.query}
      />
    </SpaceLayout>
  );
};
