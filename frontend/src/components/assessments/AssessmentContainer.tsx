import React, { useEffect, useRef, useState } from "react";
import { Trans } from "react-i18next";
import Title from "@common/Title";
import QueryData from "@common/QueryData";
import ErrorEmptyData from "@common/errors/ErrorEmptyData";
import AssessmentEmptyState from "@assets/svg/assessmentEmptyState.svg";
import { useServiceContext } from "@providers/ServiceProvider";
import useDialog from "@utils/useDialog";
import { AssessmentsList } from "./AssessmentList";
import { Box, Button, Typography } from "@mui/material";
import { ICustomError } from "@utils/CustomError";
import { useParams, useNavigate } from "react-router-dom";
import { LoadingSkeletonOfAssessments } from "@common/loadings/LoadingSkeletonOfAssessments";
import toastError from "@utils/toastError";
import { ToolbarCreateItemBtn } from "@common/buttons/ToolbarCreateItemBtn";
import { ECustomErrorType } from "@types";
import { ErrorNotFoundOrAccessDenied } from "@common/errors/ErrorNotFoundOrAccessDenied";
import SupTitleBreadcrumb from "@/components/common/SupTitleBreadcrumb";
import FolderRoundedIcon from "@mui/icons-material/FolderRounded";
import DescriptionRoundedIcon from "@mui/icons-material/DescriptionRounded";
import NoteAddRoundedIcon from "@mui/icons-material/NoteAddRounded";
import SettingsRoundedIcon from "@mui/icons-material/SettingsRounded";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import { styles } from "@styles";
import AssessmentCEFromDialog from "./AssessmentCEFromDialog";
import IconButton from "@mui/material/IconButton";
import { Link } from "react-router-dom";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import { useAuthContext } from "@providers/AuthProvider";
import { animations } from "@styles";
import AssessmentTitle from "./AssessmentTitle";
const AssessmentContainer = () => {
  const dialogProps = useDialog();
  const { currentSpace } = useAuthContext();
  const { spaceId, page } = useParams();
  const navigate = useNavigate();
  const { fetchAssessments, ...rest } = useFetchAssessments();
  const { data, error, errorObject, size, total, loading } = rest;
  const isEmpty = data.length === 0;
  const handleChange = (event: React.ChangeEvent<unknown>, value: number) => {
    navigate(`/${spaceId}/assessments/${value}`);
  };
  const pageCount = size === 0 ? 1 : Math.ceil(total / size);
  return error &&
    (errorObject?.code === ECustomErrorType.ACCESS_DENIED ||
      errorObject?.code === ECustomErrorType.NOT_FOUND) ? (
    <ErrorNotFoundOrAccessDenied />
  ) : (
    <Box display="flex" flexDirection="column" m="auto">
      <AssessmentTitle data={currentSpace} />
      <Title size="large"
             toolbar={
               <IconButton
                   size="small"
                   component={Link}
                   to={`/${spaceId}/setting`}
                   sx={{ ml: 2 }}
               >
                 <SettingsRoundedIcon />
               </IconButton>
             }
      >
        <Box>
          {/* <DescriptionRoundedIcon sx={{ mr: 1 }} /> */}
          <Trans i18nKey="assessments" />
        </Box>
      </Title>
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
              data-cy="create-assessment-btn"
              onClick={() =>
                dialogProps.openDialog({
                  type: "create",
                  data: {
                    space: { id: spaceId, title: currentSpace?.title },
                  },
                })
              }
              icon={<NoteAddRoundedIcon />}
              shouldAnimate={isEmpty}
              minWidth="195px"
              text="createAssessment"
              disabled={rest.loading}
            />
          </Box>
        </Box>
      )}
      {isEmpty && !loading && (
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
            src={AssessmentEmptyState}
            alt={"No assesment here!"}
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
            <Trans i18nKey="noAssesmentHere" />
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
            <Trans i18nKey="createAnAssessmentWith" />
          </Typography>
          <Box>
            <Button
              startIcon={<AddRoundedIcon />}
              variant="contained"
              sx={{
                animation: `${animations.pomp} 1.6s infinite cubic-bezier(0.280, 0.840, 0.420, 1)`,
                "&:hover": {
                  animation: `${animations.noPomp}`,
                },
              }}
              onClick={() =>
                dialogProps.openDialog({
                  type: "create",
                  data: {
                    space: { id: spaceId, title: currentSpace?.title },
                  },
                })
              }
            >
              <Typography sx={{ fontSize: "1.25rem" }} variant="button">
                <Trans i18nKey="newAssessment" />
              </Typography>
            </Button>
          </Box>
        </Box>
      )}

      <QueryData
        {...rest}
        // renderLoading={() => <LoadingSkeletonOfAssessments />}
        emptyDataComponent={
          <ErrorEmptyData
            emptyMessage={<Trans i18nKey="nothingToSeeHere" />}
            suggests={
              <Typography variant="subtitle1" textAlign="center">
                <Trans i18nKey="tryCreatingNewAssessment" />
              </Typography>
            }
          />
        }
        render={(data) => {
          return (
            <>
              <AssessmentsList
                {...rest}
                data={data}
                space={{ id: spaceId, title: currentSpace?.title }}
                dialogProps={dialogProps}
              />
              {pageCount > 1 && (
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
                    page={Number(page)}
                    onChange={handleChange}
                  />
                </Stack>
              )}
            </>
          );
        }}
      />
      <AssessmentCEFromDialog
        {...dialogProps}
        onSubmitForm={fetchAssessments}
      />
    </Box>
  );
};

const useFetchAssessments = () => {
  const [data, setData] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [errorObject, setErrorObject] = useState<undefined | ICustomError>(
    undefined
  );
  const { spaceId, page } = useParams();
  const { service } = useServiceContext();
  const abortController = useRef(new AbortController());

  useEffect(() => {
    fetchAssessments();
  }, [page, spaceId]);
  const fetchAssessments = async () => {
    setLoading(true);
    setErrorObject(undefined);
    try {
      const { data: res } = await service.fetchAssessments(
        { spaceId: spaceId, size: 4, page: parseInt(page ?? "1", 10) - 1 },
        { signal: abortController.current.signal }
      );
      if (res) {
        setData(res);
        setError(false);
      } else {
        setData({});
        setError(true);
      }

      setLoading(false);
    } catch (e) {
      const err = e as ICustomError;
      toastError(err, { filterByStatus: [404] });
      setLoading(false);
      setError(true);
      setErrorObject(err);
    }
  };

  const deleteAssessment = async (id: any) => {
    setLoading(true);
    try {
      const { data: res } = await service.deleteAssessment(
        { id },
        { signal: abortController.current.signal }
      );
      fetchAssessments();
    } catch (e) {
      const err = e as ICustomError;
      toastError(err);
      setLoading(false);
      setError(true);
    }
  };

  return {
    data: data.items || [],
    page: data.page || 0,
    size: data.size || 0,
    total: data.total || 0,
    requested_space: data.requested_space,
    loading,
    loaded: !!data,
    error,
    errorObject,
    fetchAssessments,
    deleteAssessment,
  };
};

export default AssessmentContainer;
