import { useState, useEffect } from "react";
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
import { Skeleton, Typography, Button } from "@mui/material";
import { ToolbarCreateItemBtn } from "@common/buttons/ToolbarCreateItemBtn";
import FolderRoundedIcon from "@mui/icons-material/FolderRounded";
import { ISpacesModel } from "@types";
import CreateNewFolderRoundedIcon from "@mui/icons-material/CreateNewFolderRounded";
import SpaceEmptyStateSVG from "@assets/svg/spaceEmptyState.svg";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import { styles, animations } from "@styles";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import { useNavigate, useParams } from "react-router-dom";

const SpaceContainer = () => {
  const dialogProps = useDialog();
  const { service } = useServiceContext();
  const navigate = useNavigate();
  const { page } = useParams();
  const PAGESIZE: number = 10;

  let pageNumber = Number(page);

  const handleChangePage = (
    event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    navigate(`/spaces/${value}`);
  };

  const spacesQueryData = useQuery<ISpacesModel>({
    service: (args = { size: PAGESIZE, page: pageNumber }, config) =>
      service.fetchSpaces(args, config),
    toastError: true,
  });

  useEffect(() => {
    spacesQueryData.query({ size: PAGESIZE, page: pageNumber });
  }, [pageNumber]);

  const pageCount =
    !spacesQueryData.data ||
    !spacesQueryData?.data?.total ||
    !spacesQueryData?.data?.size ||
    spacesQueryData.data?.size === 0
      ? 1
      : Math.ceil(spacesQueryData?.data?.total / spacesQueryData?.data?.size);

  const isEmpty = spacesQueryData?.data?.items?.length === 0;

  return (
    <SpaceLayout
      title={
        <Title borderBottom={true}>
          <FolderRoundedIcon sx={{ mr: 1 }} /> <Trans i18nKey="spaces" />
        </Title>
      }
    >
      {!isEmpty && (
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
          <Box ml="auto">
            <ToolbarCreateItemBtn
              icon={<CreateNewFolderRoundedIcon />}
              onClick={dialogProps.openDialog}
              shouldAnimate={isEmpty}
              text="createSpace"
            />
          </Box>
        </Box>
      )}
      {isEmpty && (
        <Box
          sx={{
            width: "100%",
            display: "flex",
            justifyContent: "center",
            flexDirection: "column",
            alignItems: "center",
            mt: 6,
            gap: 4,
          }}
        >
          <img
            src={SpaceEmptyStateSVG}
            alt={"Oh! You have no space?"}
            width="240px"
          />
          <Typography
            textAlign="center"
            variant="h3"
            sx={{
              color: "#9DA7B3",
              fontSize: "3rem",
              fontWeight: "900",
              width: "60%",
            }}
          >
            <Trans i18nKey="noSpaceHere" />
          </Typography>
          <Typography
            textAlign="center"
            variant="h1"
            sx={{
              color: "#9DA7B3",
              fontSize: "1rem",
              fontWeight: "500",
              width: "60%",
            }}
          >
            <Trans i18nKey="spacesAreEssentialForCreating" />
          </Typography>
          <Box>
            <Button
              startIcon={<AddRoundedIcon />}
              variant="contained"
              onClick={dialogProps.openDialog}
              sx={{
                animation: `${animations.pomp} 1.6s infinite cubic-bezier(0.280, 0.840, 0.420, 1)`,
                "&:hover": {
                  animation: `${animations.noPomp}`,
                },
              }}
            >
              <Typography fontSize="1.25rem" variant="button">
                <Trans i18nKey="createYourFirstSpace" />
              </Typography>
            </Button>
          </Box>
        </Box>
      )}
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
      <CreateSpaceDialog
        {...dialogProps}
        onSubmitForm={spacesQueryData.query}
      />
    </SpaceLayout>
  );
};

export default SpaceContainer;
