import React, { useEffect, useMemo } from "react";
import Grid from "@mui/material/Grid";
import { DialogProps } from "@mui/material/Dialog";
import { useForm } from "react-hook-form";
import { Trans } from "react-i18next";
import { InputFieldUC } from "../../components/shared/fields/InputField";
import { SelectFieldUC } from "../shared/fields/SelectField";
import { styles } from "../../config/styles";
import { useServiceContext } from "../../providers/ServiceProvider";
import setServerFieldErrors from "../../utils/setServerFieldError";
import useConnectSelectField from "../../utils/useConnectSelectField";
import NoteAddRoundedIcon from "@mui/icons-material/NoteAddRounded";
import { ICustomError } from "../../utils/CustomError";
import { useParams } from "react-router-dom";
import toastError from "../../utils/toastError";
import {
  CEDialog,
  CEDialogActions,
} from "../../components/shared/dialogs/CEDialog";
import FormProviderWithForm from "../../components/shared/FormProviderWithForm";

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
  const abortController = useMemo(() => new AbortController(), [rest.open]);
  const close = () => {
    abortController.abort();
    closeDialog();
  };

  useEffect(() => {
    return () => {
      abortController.abort();
    };
  }, []);

  const onSubmit = async (data: any) => {
    setLoading(true);
    try {
      const { data: res } =
        type === "update"
          ? await service.updateAssessment(
              { rowId, data: { space: spaceId, ...data } },
              { signal: abortController.signal }
            )
          : await service.createAssessment(
              { data: { space: spaceId, ...data } },
              { signal: abortController.signal }
            );
      setLoading(false);
      onSubmitForm();
      close();
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
      closeDialog={close}
      title={
        <>
          <NoteAddRoundedIcon sx={{ mr: 1 }} />
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
        <CEDialogActions closeDialog={close} loading={loading} type={type} />
      </FormProviderWithForm>
    </CEDialog>
  );
};

export default AssessmentCEFromDialog;
