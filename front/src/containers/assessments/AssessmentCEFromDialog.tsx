import React from "react";
import Grid from "@mui/material/Grid";
import { DialogProps } from "@mui/material/Dialog";
import { useForm } from "react-hook-form";
import { Trans } from "react-i18next";
import { InputFieldUC, SelectFieldUC } from "../../components";
import { styles } from "../../config/styles";
import { useServiceContext } from "../../providers/ServiceProvider";
import setServerFieldErrors from "../../utils/setServerFieldError";
import useConnectSelectField from "../../utils/useConnectSelectField";
import AddchartRoundedIcon from "@mui/icons-material/AddchartRounded";
import { ICustomError } from "../../utils/CustomError";
import { useParams } from "react-router-dom";
import toastError from "../../utils/toastError";
import { CEDialog, CEDialogActions } from "../../components/dialogs/CEDialog";
import { FormProviderWithForm } from "../../components/form/FormProviderWithForm";

interface IAssessmentCEFromDialogProps extends DialogProps {
  onClose: () => void;
  onSubmitForm: () => void;
  openDialog?: any;
  context?: any;
}

const AssessmentCEFromDialog = (props: IAssessmentCEFromDialogProps) => {
  const [loading, setLoading] = React.useState(false);
  const { service } = useServiceContext();
  const {
    onClose: closeDialog,
    onSubmitForm,
    context = {},
    openDialog,
    ...rest
  } = props;
  const { type, data = {} } = context;
  const { id: rowId } = data;
  const defaultValues = type === "update" ? data : {};
  const { spaceId } = useParams();
  const formMethods = useForm({ shouldUnregister: true });

  const onSubmit = async (data: any) => {
    setLoading(true);
    try {
      const { data: res } =
        type === "update"
          ? await service.updateAssessment(rowId, { space: spaceId, ...data })
          : await service.createAssessment({ space: spaceId, ...data });
      setLoading(false);
      onSubmitForm();
      closeDialog();
    } catch (e) {
      const err = e as ICustomError;
      setLoading(false);
      setServerFieldErrors(err, formMethods);
      toastError(err);
    }
  };

  return (
    <CEDialog
      {...rest}
      closeDialog={closeDialog}
      title={
        <>
          <AddchartRoundedIcon sx={{ mr: 1 }} />
          {type === "update" ? (
            <Trans i18nKey="updateAssessment" />
          ) : (
            <Trans i18nKey="createAssessment" />
          )}
        </>
      }
    >
      <FormProviderWithForm
        formMethods={formMethods}
        onSubmit={formMethods.handleSubmit(onSubmit)}
      >
        <Grid container spacing={2} sx={styles.formGrid}>
          <Grid item xs={12} md={8}>
            <InputFieldUC
              autoFocus={true}
              defaultValue={defaultValues.title || ""}
              name="title"
              required={true}
              label={<Trans i18nKey="title" />}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <SelectFieldUC
              {...useConnectSelectField("/assessment/colors/")}
              name="color"
              defaultValue={defaultValues?.color?.id || ""}
              label={<Trans i18nKey="color" />}
            />
          </Grid>
        </Grid>
        <CEDialogActions
          closeDialog={closeDialog}
          loading={loading}
          type={type}
        />
      </FormProviderWithForm>
    </CEDialog>
  );
};

export default AssessmentCEFromDialog;
