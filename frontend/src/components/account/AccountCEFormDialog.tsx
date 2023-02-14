import React, { useEffect, useMemo } from "react";
import Grid from "@mui/material/Grid";
import { DialogProps } from "@mui/material/Dialog";
import { useForm } from "react-hook-form";
import { Trans } from "react-i18next";
import { InputFieldUC } from "../@components/shared/fields/InputField";
import { SelectFieldUC } from "../shared/fields/SelectField";
import { styles } from "../../config/styles";
import { useServiceContext } from "../@providers/ServiceProvider";
import setServerFieldErrors from "../@utils/setServerFieldError";
import useConnectSelectField from "../@utils/useConnectSelectField";
import AccountBoxRoundedIcon from "@mui/icons-material/AccountBoxRounded";
import { ICustomError } from "../@utils/CustomError";
import { Link, useParams } from "react-router-dom";
import toastError from "../@utils/toastError";
import { CEDialog, CEDialogActions } from "../@components/shared/dialogs/CEDialog";
import FormProviderWithForm from "../@components/shared/FormProviderWithForm";
import AutocompleteAsyncField, { useConnectAutocompleteField } from "../shared/fields/AutocompleteAsyncField";
import { Box } from "@mui/material";
import Button from "@mui/material/Button";
import StorefrontOutlinedIcon from "@mui/icons-material/StorefrontOutlined";
import UploadField from "../shared/fields/UploadField";

interface IAccountCEFormDialogProps extends DialogProps {
  onClose: () => void;
  onSubmitForm: () => void;
  openDialog?: any;
  context?: any;
}

const AccountCEFormDialog = (props: IAccountCEFormDialogProps) => {
  const [loading, setLoading] = React.useState(false);
  const { service } = useServiceContext();
  const { onClose: closeDialog, onSubmitForm, context = {}, openDialog, ...rest } = props;
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
    if (type !== "update") {
      return;
    }
    setLoading(true);
    try {
      const { data: res } = await service.updateAccount(
        {
          id,
          data: { email: defaultValues?.email, id: defaultValues?.id, ...data },
        },
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
          <AccountBoxRoundedIcon sx={{ mr: 1 }} />
          <Trans i18nKey="updateAccount" />
        </>
      }
    >
      <FormProviderWithForm formMethods={formMethods}>
        <Grid container spacing={2} sx={styles.formGrid}>
          {/* <Grid item xs={12} sm={6}>
            <UploadField
              accept={{
                "image/jpeg": [".jpeg", ".jpg"],
                "image/png": [".png"],
              }}
              defaultValueType="image"
              name="picture"
              label={<Trans i18nKey="accountPicture" />}
            />
          </Grid> */}
          <Grid item xs={12}>
            <InputFieldUC
              autoFocus={true}
              defaultValue={defaultValues.display_name || ""}
              name="display_name"
              required={true}
              label={<Trans i18nKey="displayName" />}
            />
          </Grid>
          {/* <Grid item xs={12}>
            <InputFieldUC
              multiline
              defaultValue={defaultValues.bio || ""}
              name="bio"
              label={<Trans i18nKey="bio" />}
            />
          </Grid> */}
        </Grid>
        <CEDialogActions closeDialog={close} loading={loading} type={type} onSubmit={formMethods.handleSubmit(onSubmit)} />
      </FormProviderWithForm>
    </CEDialog>
  );
};

export default AccountCEFormDialog;
