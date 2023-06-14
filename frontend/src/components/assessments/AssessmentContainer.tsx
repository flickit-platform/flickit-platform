import React, { useEffect, useRef, useState } from "react";
import { Trans } from "react-i18next";
import Title from "@common/Title";
import QueryData from "@common/QueryData";
import ErrorEmptyData from "@common/errors/ErrorEmptyData";
import { useServiceContext } from "@providers/ServiceProvider";
import useDialog from "@utils/useDialog";
import { AssessmentsList } from "./AssessmentList";
import { Box, Typography } from "@mui/material";
import { ICustomError } from "@utils/CustomError";
import { useParams } from "react-router-dom";
import { LoadingSkeletonOfAssessments } from "@common/loadings/LoadingSkeletonOfAssessments";
import toastError from "@utils/toastError";
import { ToolbarCreateItemBtn } from "@common/buttons/ToolbarCreateItemBtn";
import { ECustomErrorType } from "@types";
import { ErrorNotFoundOrAccessDenied } from "@common/errors/ErrorNotFoundOrAccessDenied";
import SupTitleBreadcrumb from "@common/SupTitleBreadcrumb";
import FolderRoundedIcon from "@mui/icons-material/FolderRounded";
import DescriptionRoundedIcon from "@mui/icons-material/DescriptionRounded";
import NoteAddRoundedIcon from "@mui/icons-material/NoteAddRounded";
import SettingsRoundedIcon from "@mui/icons-material/SettingsRounded";
import { styles } from "@styles";
import AssessmentCEFromDialog from "./AssessmentCEFromDialog";
import IconButton from "@mui/material/IconButton";
import { Link } from "react-router-dom";

const AssessmentContainer = () => {
  const dialogProps = useDialog();
  const { fetchAssessments, ...rest } = useFetchAssessments();
  const { data, error, errorObject, requested_space } = rest;
  const isEmpty = data.length == 0;
  const { spaceId } = useParams();

  return error &&
    (errorObject?.type === ECustomErrorType.ACCESS_DENIED ||
      errorObject?.type === ECustomErrorType.NOT_FOUND) ? (
    <ErrorNotFoundOrAccessDenied />
  ) : (
    <Box display="flex" flexDirection="column" m="auto">
      <Title
        borderBottom={true}
        sup={
          <SupTitleBreadcrumb
            routes={[
              {
                title: requested_space,
                sup: "spaces",
                icon: <FolderRoundedIcon fontSize="inherit" sx={{ mr: 0.5 }} />,
              },
            ]}
          />
        }
      >
        <DescriptionRoundedIcon sx={{ mr: 1 }} />
        <Trans i18nKey="assessments" />
      </Title>
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
        <Box></Box>
        <Box ml="auto">
          <ToolbarCreateItemBtn
            data-cy="create-assessment-btn"
            onClick={() =>
              dialogProps.openDialog({
                type: "create",
                data: { space: { id: spaceId, title: requested_space } },
              })
            }
            icon={<NoteAddRoundedIcon />}
            shouldAnimate={isEmpty}
            minWidth="195px"
            text="createAssessment"
            disabled={rest.loading}
          />
          <IconButton size="small" component={Link} to={`/${spaceId}/setting`} sx={{ml:2}}>
            <SettingsRoundedIcon color="primary" />
          </IconButton>
        </Box>
      </Box>
      <QueryData
        {...rest}
        renderLoading={() => <LoadingSkeletonOfAssessments />}
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
            <AssessmentsList
              {...rest}
              data={data}
              space={{ id: spaceId, title: requested_space }}
              dialogProps={dialogProps}
            />
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
  const { spaceId } = useParams();
  const { service } = useServiceContext();
  const abortController = useRef(new AbortController());

  useEffect(() => {
    fetchAssessments();
    return () => {
      abortController.current.abort();
    };
  }, []);

  const fetchAssessments = async () => {
    setLoading(true);
    setErrorObject(undefined);
    try {
      const { data: res } = await service.fetchAssessments(
        { spaceId },
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
    data: data.results || [],
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
