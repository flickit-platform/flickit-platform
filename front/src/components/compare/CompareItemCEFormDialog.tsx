import React, { useMemo } from "react";
import { Trans } from "react-i18next";
import { IDialogProps } from "../../types";
import { CEDialog, CEDialogActions } from "../shared/dialogs/CEDialog";
import AddBoxRoundedIcon from "@mui/icons-material/AddBoxRounded";
import BorderColorRoundedIcon from "@mui/icons-material/BorderColorRounded";
import FormProviderWithForm from "../shared/FormProviderWithForm";
import Grid from "@mui/material/Grid";
import { useForm } from "react-hook-form";
import { useParams } from "react-router-dom";
import { getColorOfStatus, styles } from "../../config/styles";
import { SelectFieldUC } from "../shared/fields/SelectField";
import useConnectSelectField from "../../utils/useConnectSelectField";
import { useServiceContext } from "../../providers/ServiceProvider";
import { ICustomError } from "../../utils/CustomError";
import toastError from "../../utils/toastError";
import setServerFieldErrors from "../../utils/setServerFieldError";
import Alert from "@mui/material/Alert";
import MenuItem from "@mui/material/MenuItem";
import Box from "@mui/material/Box";
import { Typography } from "@mui/material";
import Title from "../shared/Title";
import getStatusText from "../../utils/getStatusText";

interface ICompareItemCEFormDialog
  extends Omit<ICompareItemCEForm, "closeDialog"> {}

const CompareItemCEFormDialog = (props: ICompareItemCEFormDialog) => {
  const { onClose, context, open, openDialog, ...rest } = props;

  const closeDialog = () => {
    onClose();
  };

  return (
    <CEDialog
      {...rest}
      open={open}
      closeDialog={closeDialog}
      title={
        <>
          {context?.type === "update" ? (
            <>
              <BorderColorRoundedIcon />
              <Trans i18nKey="changeAssessment" />
            </>
          ) : (
            <>
              <AddBoxRoundedIcon sx={{ mr: 1 }} />
              <Trans i18nKey="selectAssessment" />
            </>
          )}
        </>
      }
    >
      {/* <Alert severity="info">
        <Trans i18nKey="selectAssessmentForComparison" />
      </Alert> */}
      <CompareItemCEForm {...props} closeDialog={closeDialog} />
    </CEDialog>
  );
};

interface ICompareItemCEForm extends IDialogProps {
  closeDialog: () => void;
}

const CompareItemCEForm = (props: ICompareItemCEForm) => {
  const [loading, setLoading] = React.useState(false);
  const { service } = useServiceContext();
  const { closeDialog, context, onSubmitForm = () => {}, open } = props;
  const { type, data } = context || {};
  const defaultValues = type === "update" ? data || {} : {};
  const formMethods = useForm({ shouldUnregister: true });
  const abortController = useMemo(() => new AbortController(), [open]);

  const onSubmit = async (data: any) => {
    setLoading(true);
    try {
      await service.saveCompareItem(data, { signal: abortController.signal });

      setLoading(false);
      onSubmitForm?.();
      closeDialog();
    } catch (e) {
      const err = e as ICustomError;
      setLoading(false);
      toastError(err);
      setServerFieldErrors(err, formMethods);
    }
  };

  return (
    <FormProviderWithForm
      formMethods={formMethods}
      onSubmit={formMethods.handleSubmit(onSubmit)}
    >
      <Grid container spacing={2} sx={{ ...styles.formGrid, pt: 0, mt: 0 }}>
        <Grid item xs={12}>
          <SelectFieldUC
            {...useConnectSelectField(`/assessment/currentuserprojects/`)}
            required={true}
            autoFocus={true}
            name="assessmentId"
            defaultValue={defaultValues?.id || ""}
            label={<Trans i18nKey="assessment" />}
            size="medium"
            renderOption={(option) => {
              return (
                <MenuItem
                  value={option.id}
                  key={option.id}
                  sx={{ display: "flex", alignItems: "center" }}
                >
                  {option.id === "" ? (
                    option.title
                  ) : (
                    <>
                      <Title size="small" sup={option.space.title}>
                        {option.title}
                      </Title>
                      <Box ml="auto" sx={{ ...styles.centerV }}>
                        <Typography
                          sx={{
                            mr: 1,
                          }}
                          variant="body2"
                        >
                          <Trans i18nKey={"statusIsEvaluatedAs"} />
                        </Typography>
                        <Typography
                          variant="h6"
                          sx={{
                            color: getColorOfStatus(option.status),
                            fontSize: "1.01rem",
                          }}
                        >
                          {getStatusText(option.status, true)}
                        </Typography>
                      </Box>
                    </>
                  )}
                </MenuItem>
              );
            }}
          />
        </Grid>
      </Grid>
      <CEDialogActions
        closeDialog={closeDialog}
        loading={loading}
        type={type}
        submitButtonLabel={"addToCompareList"}
      />
    </FormProviderWithForm>
  );
};

export default CompareItemCEFormDialog;
