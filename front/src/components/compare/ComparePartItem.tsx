import React from "react";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import { Trans } from "react-i18next";
import { styles } from "../../config/styles";
import AddBoxRoundedIcon from "@mui/icons-material/AddBoxRounded";
import useDialog from "../../utils/useDialog";
import CompareItemCEFormDialog from "./CompareItemCEFormDialog";
import Title from "../shared/Title";
import { Gauge } from "../shared/charts/Gauge";
import ProgressChip from "../shared/ProgressChip";
import { ICompareModel, TQueryFunction } from "../../types";

interface IComparePartsItemProps {
  data: any;
  fetchCompare: TQueryFunction<ICompareModel>;
}

const ComparePartItem = (props: IComparePartsItemProps) => {
  const { data, fetchCompare } = props;
  const dialogProps = useDialog();
  return (
    <Paper>
      <Button
        fullWidth
        color="inherit"
        sx={{
          p: 3,
          px: 3.5,
          borderRadius: 2,
          minHeight: "264px",
          ...(data
            ? {
                display: "flex",
                flexDirection: "column",
                alignItems: "stretch",
              }
            : styles.centerCVH),
        }}
        onClick={dialogProps.openDialog}
      >
        {data ? (
          <Box>
            <Title>
              {data.title}
              <ProgressChip
                progress={data?.total_progress?.progress}
                size="small"
                sx={{ ml: 2 }}
              />
            </Title>
            <Box display="flex" justifyContent="space-between">
              <Box></Box>
              <Gauge systemStatus={data.status} maxWidth="255px" mt="auto" />
            </Box>
          </Box>
        ) : (
          <>
            <AddBoxRoundedIcon sx={{ mb: 0.5 }} fontSize="large" />
            <Typography textTransform={"none"} textAlign="center">
              <Trans i18nKey="selectAssessmentForComparison" />
            </Typography>
          </>
        )}
      </Button>
      <CompareItemCEFormDialog {...dialogProps} onSubmitForm={fetchCompare} />
    </Paper>
  );
};

export default ComparePartItem;
