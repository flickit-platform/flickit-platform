import { SpaceLayout } from "./SpaceLayout";
import Box from "@mui/material/Box";
import { Trans } from "react-i18next";
import Title from "@common/Title";
import QueryData from "@common/QueryData";
import ErrorEmptyData from "@common/errors/ErrorEmptyData";
import useDialog from "@utils/useDialog";
import CreateSpaceDialog from "./CreateSpaceDialog";
import { SpacesList } from "./SpaceList";
import { useServiceContext } from "@providers/ServiceProvider";
import { useQuery } from "@utils/useQuery";
import AddRounded from "@mui/icons-material/AddRounded";
import { Skeleton, Typography } from "@mui/material";
import { ToolbarCreateItemBtn } from "@common/buttons/ToolbarCreateItemBtn";
import FolderRoundedIcon from "@mui/icons-material/FolderRounded";
import { ISpacesModel } from "@types";
import CreateNewFolderRoundedIcon from "@mui/icons-material/CreateNewFolderRounded";
import { styles } from "@styles";

const SpaceContainer = () => {
  const dialogProps = useDialog();
  const { service } = useServiceContext();
  const spacesQueryData = useQuery<ISpacesModel>({
    service: (args, config) => service.fetchSpaces(args, config),
    toastError: true,
  });

  const isEmpty = spacesQueryData?.data?.results?.length === 0;
  const is_farsi = true;
  return (
    <SpaceLayout
      title={
        <Title borderBottom={true}>
          <FolderRoundedIcon
            sx={{
              mr: `${is_farsi ? 0 : "8px"}`,
              ml: `${is_farsi ? "8px" : 0}`,
            }}
          />{" "}
          <Trans i18nKey="spaces" />
        </Title>
      }
    >
      <Box
        sx={{
          background: "white",
          py: 1,
          px: 2,
          ...styles.centerV,
          borderRadius: 1,
          my: 3,
        }}
      >
        <Box ml={`${is_farsi ? 0 : "auto"}`} mr={`${is_farsi ? "auto" : 0}`}>
          <ToolbarCreateItemBtn
            icon={
              <CreateNewFolderRoundedIcon
                sx={{
                  mr: `${is_farsi ? 0 : "4px"}`,
                  ml: `${is_farsi ? "4px" : 0}`,
                }}
              />
            }
            onClick={dialogProps.openDialog}
            shouldAnimate={isEmpty}
            text="createSpace"
          />
        </Box>
      </Box>
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
