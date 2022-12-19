import React from "react";
import { SpaceLayout } from "./SpaceLayout";
import { Box } from "@mui/material";
import { Trans } from "react-i18next";
import Title from "../../components/shared/Title";
import QueryData from "../../components/shared/QueryData";
import ErrorEmptyData from "../../components/shared/errors/ErrorEmptyData";
import useDialog from "../../utils/useDialog";
import CreateSpaceDialog from "./CreateSpaceDialog";
import { SpacesList } from "./SpaceList";
import { useServiceContext } from "../../providers/ServiceProvider";
import { useQuery } from "../../utils/useQuery";
import AddRounded from "@mui/icons-material/AddRounded";
import { Skeleton, Typography } from "@mui/material";
import { ToolbarCreateItemBtn } from "../../components/shared/buttons/ToolbarCreateItemBtn";
import FolderRoundedIcon from "@mui/icons-material/FolderRounded";
import { ISpacesModel } from "../../types";
import CreateNewFolderRoundedIcon from "@mui/icons-material/CreateNewFolderRounded";

const SpaceContainer = () => {
  const dialogProps = useDialog();
  const { service } = useServiceContext();
  const spacesQueryData = useQuery<ISpacesModel>({
    service: (args, config) => service.fetchSpaces(args, config),
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
              icon={<CreateNewFolderRoundedIcon />}
              onClick={dialogProps.openDialog}
              shouldAnimate={isEmpty}
              text="createSpace"
            />
          }
        >
          <FolderRoundedIcon sx={{ mr: 1 }} /> <Trans i18nKey="spaces" />
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
          <ErrorEmptyData
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

export default SpaceContainer;
