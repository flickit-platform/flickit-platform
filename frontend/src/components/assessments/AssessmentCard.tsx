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
import { useQuery } from "@utils/useQuery";
interface IAssessmentCardProps {

  item: IAssessment & { space: any } & {manageable?: boolean}  & {viewable?: boolean};

  dialogProps: TDialogProps;
  deleteAssessment: TQueryFunction<any, TId>;
}
import SettingsIcon from '@mui/icons-material/Settings';

const AssessmentCard = (props: IAssessmentCardProps) => {
  const [calculateResault, setCalculateResault] = useState<any>();
  const [show, setShow] = useState<boolean | false>();
  const { item } = props;
  const abortController = useRef(new AbortController());

  const { maturityLevel, isCalculateValid, isConfidenceValid, kit, id,lastModificationTime,viewable

  } = item;
  const hasML = hasMaturityLevel(maturityLevel?.value);
  const { maturityLevelsCount } = kit;
  const location = useLocation();
  const { service } = useServiceContext();
  const calculateMaturityLevelQuery = useQuery({
    service: (args = { assessmentId: id }, config) =>
      service.calculateMaturityLevel(args, config),
    runOnMount: false,
  });
  const calculateConfidenceLevelQuery = useQuery({
    service: (args = { assessmentId: id }, config) =>
      service.calculateConfidenceLevel(args, config),
    runOnMount: false,
  });

  const fetchAssessments = async () => {
    try {
      setShow(isCalculateValid);
      if (!isCalculateValid) {
        const data = await calculateMaturityLevelQuery.query();
        setCalculateResault(data);
        if (data?.id) {
          setShow(true);
        }
      }
      // if (!is_confidence_valid) {
      //   await calculateConfidenceLevelQuery.query();
      // }
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
  }, [isCalculateValid]);
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
                isCalculateValid &&
                viewable ? `${item.id}/insights`
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
                {formatDate(lastModificationTime)}
              </Typography>
            </Box>
          </Grid>
          <Grid
            item
            xs={12}
            sx={{ ...styles.centerCH, textDecoration: "none" }}
            mt={2}
            component={Link}
            to={hasML && viewable  ? `${item.id}/insights` : `${item.id}/questionnaires`}
          >
            {show ? (
              <Gauge
                maturity_level_number={maturityLevelsCount}
                level_value={
                  calculateResault?.index
                    ? calculateResault?.index
                    : maturityLevel?.index
                }
                maturity_level_status={
                  calculateResault?.title
                    ? calculateResault?.title
                    : maturityLevel?.title
                }
                maxWidth="275px"
                mt="auto"
              />
            ) : (
              <LoadingGauge />
            )}
          </Grid>

          <Grid item xs={12} mt={1} sx={{ ...styles.centerCH }}>
            <Button
              startIcon={<QuizRoundedIcon />}
              fullWidth
              onClick={(e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
                e.stopPropagation();
              }}
              component={Link}
              state={location}
              to={`${item.id}/questionnaires`}
              data-cy="questionnaires-btn"
            >
              <Trans i18nKey="questionnaires" />
            </Button>
          </Grid>
          <Grid item xs={12} sx={{ ...styles.centerCH }} mt={1}>
            <Button
              startIcon={<QueryStatsRounded />}
              variant={"contained"}
              fullWidth
              onClick={(e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
                e.stopPropagation();
                if (!hasML) {
                  e.preventDefault();
                  toast.warn(t("inOrderToViewSomeInsight") as string);
                }
              }}
              component={Link}
              to={hasML && viewable  ? `${item.id}/insights` : ""}
              sx={{
                backgroundColor: "#2e7d72",
                background: viewable ? `#01221e` : "rgba(0,59,100, 12%)",
                color: !viewable ? "rgba(10,35,66, 38%)" : "",
                boxShadow: !viewable ? "none" : "",
                "&:hover": {background: viewable ? `` : "rgba(0,59,100, 12%)",
                    boxShadow: !viewable ? "none" : "",
                },
              }}
              data-cy="view-insights-btn"
            >
              <Trans i18nKey="insights" />
            </Button>
          </Grid>
        </Grid>
      </Paper>
    </Grid>
  );
};

const Actions = (props: {
  deleteAssessment: TQueryFunction<any, TId>;
  item: IAssessment & { space: any } & { manageable?: boolean };
  dialogProps: TDialogProps;
  abortController: React.MutableRefObject<AbortController>;
}) => {
  const { deleteAssessment, item, dialogProps } = props;
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
    dialogProps.openDialog({
      data: { ...item, space: item.space },
      type: "update",
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

  const assessmentSetting = (e: any) => {
    navigate(`assessmentsettings/${item.id}`, {
      state: item?.color || { code: '#073B4C', id: 6 }
    });
  };

  return (
    <MoreActions
      {...useMenu()}
      boxProps={{ position: "absolute", top: "10px", right: "10px", zIndex: 2 }}
      items={
        hasStatus(item.status)
          ? [
            // {
            //   icon: <EditRoundedIcon fontSize="small" />,
            //   text: <Trans i18nKey="edit" />,
            //   onClick: openEditDialog,
            // },
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
            // {
            //   icon: <EditRoundedIcon fontSize="small" />,
            //   text: <Trans i18nKey="edit" />,
            //   onClick: openEditDialog,
            // },
            item?.manageable && {
              icon: <SettingsIcon fontSize="small" />,
              text: <Trans i18nKey="settings" />,
              onClick: assessmentSetting,
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
