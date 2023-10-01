import React, { useEffect, useRef, useState } from "react";
import { Gauge } from "@common/charts/Gauge";
import LoadingGauge from "@common/charts/LoadingGauge";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import useMenu from "@utils/useMenu";
import { useServiceContext } from "@providers/ServiceProvider";
import {
  createSearchParams,
  Link,
  useLocation,
  useNavigate,
} from "react-router-dom";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import { Trans } from "react-i18next";
import { styles } from "@styles";
import formatDate from "@utils/formatDate";
import { ICustomError } from "@utils/CustomError";
import toastError from "@utils/toastError";
import MoreActions from "@common/MoreActions";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { IAssessment, TId, TQueryFunction } from "@types";
import { TDialogProps } from "@utils/useDialog";
import Button from "@mui/material/Button";
import QuizRoundedIcon from "@mui/icons-material/QuizRounded";
import QueryStatsRounded from "@mui/icons-material/QueryStatsRounded";
import hasStatus from "@utils/hasStatus";
import hasMaturityLevel from "@utils/hasMaturityLevel";
import { toast } from "react-toastify";
import { t } from "i18next";
import CompareRoundedIcon from "@mui/icons-material/CompareRounded";
import QueryData from "../common/QueryData";
import { useQuery } from "@utils/useQuery";
interface IAssessmentCardProps {
  item: IAssessment & { space: any };
  dialogProps: TDialogProps;
  deleteAssessment: TQueryFunction<any, TId>;
}

const AssessmentCard = (props: IAssessmentCardProps) => {
  const [calculateResault, setCalculateResault] = useState<any>();
  const [show, setShow] = useState<boolean | false>(false);
  const { item } = props;
  const abortController = useRef(new AbortController());
  const { result_maturity_level, is_calculate_valid, assessment_kit, id } =
    item;
  const hasML = hasMaturityLevel(result_maturity_level?.value);
  const { maturity_levels_count } = assessment_kit;
  const location = useLocation();
  const { service } = useServiceContext();
  const calculateMaturityLevelQuery = useQuery({
    service: (args = { assessmentId: id }, config) =>
      service.calculateMaturityLevel(args, config),
    runOnMount: false,
  });

  const fetchAssessments = async () => {
    try {
      setShow(is_calculate_valid);
      if (!is_calculate_valid) {
        const data = await calculateMaturityLevelQuery.query();
        setCalculateResault(data);
        if (data.maturity_level?.id) {
          setShow(true);
        }
      }
      
    } catch (e) {
      // const err = e as ICustomError;
      // toastError(err, { filterByStatus: [404] });
      // setLoading(false);
      // setError(true);
      // setErrorObject(err);
    }
  };
  useEffect(() => {
    fetchAssessments();
  }, [is_calculate_valid]);
  return (
    <Grid item lg={3} md={4} sm={6} xs={12}>
      <Paper
        sx={{
          position: "relative",
          pt: 3,
          pb: 3,
          px: 2,
          borderRadius: "16px",
          ...styles.centerCH,
          minHeight: "300px",
          height: "100%",
          justifyContent: "space-between",
          ":hover": {
            boxShadow: 9,
          },
        }}
        elevation={4}
        data-cy="assessment-card"
      >
        <Actions {...props} abortController={abortController} />
        <Grid container sx={{ textDecoration: "none", height: "100%" }}>
          <Grid item xs={12}>
            <Box
              sx={{ textDecoration: "none" }}
              component={Link}
              to={
                is_calculate_valid
                  ? `${item.id}/insights`
                  : `${item.id}/questionnaires`
              }
            >
              <Typography
                variant="h5"
                color="CaptionText"
                textTransform={"uppercase"}
                sx={{
                  padding: "8px 28px",
                  fontWeight: "bold",
                  pb: 0,
                  textAlign: "center",
                  color: item.color?.code || "#101c32",
                  maxWidth: "320px",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  margin: "0 auto",
                }}
                data-cy="assessment-card-title"
              >
                {item.title}
              </Typography>
              <Typography
                variant="subMedium"
                color="GrayText"
                sx={{ padding: "1px 4px", textAlign: "center" }}
              >
                <Trans i18nKey="lastUpdated" />{" "}
                {formatDate(item.last_modification_time)}
              </Typography>
            </Box>
          </Grid>
          <Grid
            item
            xs={12}
            sx={{ ...styles.centerCH, textDecoration: "none" }}
            mt={2}
            component={Link}
            to={hasML ? `${item.id}/insights` : `${item.id}/questionnaires`}
          >
            {show ? (
              <Gauge
                systemStatus={item?.status}
                maturity_level_number={maturity_levels_count}
                level_value={
                  calculateResault?.maturity_level
                    ? calculateResault?.maturity_level?.index
                    : result_maturity_level?.index 
                }
                maturity_level_status={
                  calculateResault?.maturity_level
                    ? calculateResault?.maturity_level?.title
                    : result_maturity_level?.title
                }
                maxWidth="275px"
                mt="auto"
              />
            ) : (
              <LoadingGauge />
            )}
          </Grid>
          <Grid item xs={12} sx={{ ...styles.centerCH }} mt={1}>
            <Button
              startIcon={<QueryStatsRounded />}
              fullWidth
              onClick={(e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
                e.stopPropagation();
                if (!hasML) {
                  e.preventDefault();
                  toast.warn(t("inOrderToViewSomeInsight") as string);
                }
              }}
              component={Link}
              to={hasML ? `${item.id}/insights` : ""}
              // variant={is_calculate_valid ? "contained" : undefined}
              data-cy="view-insights-btn"
            >
              <Trans i18nKey="insights" />
            </Button>
          </Grid>
          <Grid item xs={12} mt={1} sx={{ ...styles.centerCH }}>
            <Button
              startIcon={<QuizRoundedIcon />}
              variant={"contained"}
              fullWidth
              onClick={(e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
                e.stopPropagation();
              }}
              component={Link}
              state={location}
              to={`${item.id}/questionnaires`}
              sx={{
                backgroundColor: "#2e7d72",
                background: `#01221e`,
              }}
              data-cy="questionnaires-btn"
            >
              <Trans i18nKey="questionnaires" />
            </Button>
          </Grid>
        </Grid>
      </Paper>
    </Grid>
  );
};

const Actions = (props: {
  deleteAssessment: TQueryFunction<any, TId>;
  item: IAssessment & { space: any };
  dialogProps: TDialogProps;
  abortController: React.MutableRefObject<AbortController>;
}) => {
  const { deleteAssessment, item, dialogProps, abortController } = props;
  const [editLoading, setEditLoading] = React.useState(false);
  const { service } = useServiceContext();
  const navigate = useNavigate();

  const deleteItem = async (e: any) => {
    try {
      await deleteAssessment(item.id);
    } catch (e) {
      const err = e as ICustomError;
      toastError(err);
    }
  };

  const openEditDialog = (e: any) => {
    setEditLoading(true);
    service
      .loadAssessment(
        { rowId: item.id },
        { signal: abortController.current.signal }
      )
      .then(({ data }) => {
        setEditLoading(false);
        dialogProps.openDialog({
          data: { ...data, space: item.space },
          type: "update",
        });
      })
      .catch((e) => {
        setEditLoading(false);
        const err = e as ICustomError;
        toastError(err);
      });
  };

  const addToCompare = (e: any) => {
    navigate({
      pathname: "/compare",
      search: createSearchParams({
        assessmentIds: item.id as string,
      }).toString(),
    });
  };

  return (
    <MoreActions
      {...useMenu()}
      loading={editLoading}
      boxProps={{ position: "absolute", top: "10px", right: "10px", zIndex: 2 }}
      items={
        hasStatus(item.status)
          ? [
              {
                icon: <EditRoundedIcon fontSize="small" />,
                text: <Trans i18nKey="edit" />,
                onClick: openEditDialog,
              },
              {
                icon: <CompareRoundedIcon fontSize="small" />,
                text: <Trans i18nKey="addToCompare" />,
                onClick: addToCompare,
              },
              {
                icon: <DeleteRoundedIcon fontSize="small" />,
                text: <Trans i18nKey="delete" />,
                onClick: deleteItem,
                menuItemProps: { "data-cy": "delete-action-btn" },
              },
            ]
          : [
              {
                icon: <EditRoundedIcon fontSize="small" />,
                text: <Trans i18nKey="edit" />,
                onClick: openEditDialog,
              },
              {
                icon: <DeleteRoundedIcon fontSize="small" />,
                text: <Trans i18nKey="delete" />,
                onClick: deleteItem,
                menuItemProps: { "data-cy": "delete-action-btn" },
              },
            ]
      }
    />
  );
};
export default AssessmentCard;
