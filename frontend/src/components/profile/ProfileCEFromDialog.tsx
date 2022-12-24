import React, { useEffect, useMemo } from "react";
import Grid from "@mui/material/Grid";
import { DialogProps } from "@mui/material/Dialog";
import { useForm } from "react-hook-form";
import { Trans } from "react-i18next";
import { InputFieldUC } from "../shared/fields/InputField";
import { SelectFieldUC } from "../shared/fields/SelectField";
import { styles } from "../../config/styles";
import { useServiceContext } from "../../providers/ServiceProvider";
import setServerFieldErrors from "../../utils/setServerFieldError";
import useConnectSelectField from "../../utils/useConnectSelectField";
import NoteAddRoundedIcon from "@mui/icons-material/NoteAddRounded";
import { ICustomError } from "../../utils/CustomError";
import { Link, useParams } from "react-router-dom";
import toastError from "../../utils/toastError";
import { CEDialog, CEDialogActions } from "../shared/dialogs/CEDialog";
import FormProviderWithForm from "../shared/FormProviderWithForm";
import AutocompleteAsyncField, {
  useConnectAutocompleteField,
} from "../shared/fields/AutocompleteAsyncField";
import UploadField from "../shared/fields/UploadField";

interface IProfileCEFromDialogProps extends DialogProps {
  onClose: () => void;
  onSubmitForm: () => void;
  openDialog?: any;
  context?: any;
}

const ProfileCEFromDialog = (props: IProfileCEFromDialogProps) => {
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
  const { id } = data;
  const defaultValues = type === "update" ? data : {};
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
    const formattedData = { dsl_id: data.dsl_id.id };
    setLoading(true);
    try {
      const { data: res } =
        type === "update"
          ? await service.updateProfile(
              { data: formattedData, id },
              { signal: abortController.signal }
            )
          : await service.createProfile(
              { data: formattedData },
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
            <Trans i18nKey="updateProfile" />
          ) : (
            <Trans i18nKey="createProfile" />
          )}
        </>
      }
    >
      <FormProviderWithForm
        formMethods={formMethods}
        onSubmit={formMethods.handleSubmit(onSubmit)}
      >
        <Grid container spacing={2} sx={styles.formGrid}>
          <Grid item xs={12}>
            <UploadField
              accept={{ "application/zip": [".zip"] }}
              uploadService={(args, config) =>
                service.uploadProfileDSL(args, config)
              }
              deleteService={(args, config) =>
                service.deleteProfileDSL(args, config)
              }
              name="dsl_id"
              required={true}
              label={<Trans i18nKey="dsl" />}
            />
          </Grid>
        </Grid>
        <CEDialogActions closeDialog={close} loading={loading} type={type} />
      </FormProviderWithForm>
    </CEDialog>
  );
};

export default ProfileCEFromDialog;
