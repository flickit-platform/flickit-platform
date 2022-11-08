import React, { useRef } from "react";
import { Gauge } from "../../components/shared/charts/Gauge";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import useMenu from "../../utils/useMenu";
import { useServiceContext } from "../../providers/ServiceProvider";
import { Link } from "react-router-dom";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import { Trans } from "react-i18next";
import { styles } from "../../config/styles";
import formatDate from "../../utils/formatDate";
import { ICustomError } from "../../utils/CustomError";
import toastError from "../../utils/toastError";
import MoreActions from "../../components/shared/MoreActions";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { IAssessment } from "../../types";

interface IAssessmentCardProps {
  item: IAssessment;
}

const AssessmentCard = (props: IAssessmentCardProps) => {
  const [elevation, setElevation] = React.useState(4);
  const { item } = props;
  const abortController = useRef(new AbortController());

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
          minHeight: "320px",
          height: "100%",
          justifyContent: "space-between",
        }}
        elevation={elevation}
        onMouseEnter={() => setElevation(8)}
        onMouseLeave={() => setElevation(4)}
      >
        <Actions {...props} abortController={abortController} />
        <Grid
          container
          component={Link}
          to={`${item.id}`}
          sx={{ textDecoration: "none", height: "100%" }}
        >
          <Grid item xs={12}>
            <Box>
              <Typography
                variant="h5"
                color="CaptionText"
                textTransform={"uppercase"}
                sx={{
                  padding: "8px 28px",
                  pb: 0,
                  textAlign: "center",
                  color: item.color?.color_code || "#101c32",
                }}
              >
                {item.title}
              </Typography>
              <Typography
                variant="subMedium"
                color="GrayText"
                sx={{ padding: "1px 4px", textAlign: "center" }}
              >
                <Trans i18nKey="lastUpdated" />{" "}
                {formatDate(item.last_modification_date)}
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} display="flex" justifyContent={"center"}>
            <Gauge systemStatus={item.status} maxWidth="275px" mt="auto" />
          </Grid>
        </Grid>
      </Paper>
    </Grid>
  );
};

const Actions = (props: any) => {
  const { deleteAssessment, item, dialogProps, abortController } = props;
  const [editLoading, setEditLoading] = React.useState(false);
  const { service } = useServiceContext();

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
        dialogProps.openDialog({ data, type: "update" });
      })
      .catch((e) => {
        setEditLoading(false);
        const err = e as ICustomError;
        toastError(err);
      });
  };

  return (
    <MoreActions
      {...useMenu()}
      loading={editLoading}
      boxProps={{ position: "absolute", top: "10px", right: "10px", zIndex: 2 }}
      items={[
        {
          icon: <EditRoundedIcon fontSize="small" />,
          text: <Trans i18nKey="edit" />,
          onClick: openEditDialog,
        },
        {
          icon: <DeleteRoundedIcon fontSize="small" />,
          text: <Trans i18nKey="delete" />,
          onClick: deleteItem,
        },
      ]}
    />
  );
};
export default AssessmentCard;
