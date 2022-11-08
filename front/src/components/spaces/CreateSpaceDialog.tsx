import React, { useEffect, useMemo, useRef } from "react";
import Grid from "@mui/material/Grid";
import { DialogProps } from "@mui/material/Dialog";
import { nanoid } from "nanoid";
import { useForm } from "react-hook-form";
import { Trans } from "react-i18next";
import { InputFieldUC } from "../../components/shared/fields/InputField";
import {
  CEDialog,
  CEDialogActions,
} from "../../components/shared/dialogs/CEDialog";
import FormProviderWithForm from "../shared/FormProviderWithForm";
import { styles } from "../../config/styles";
import { useServiceContext } from "../../providers/ServiceProvider";
import { ICustomError } from "../../utils/CustomError";
import setServerFieldErrors from "../../utils/setServerFieldError";
import toastError from "../../utils/toastError";

interface ICreateSpaceDialogProps extends DialogProps {
  onClose: () => void;
  onSubmitForm: () => void;
  openDialog?: any;
  context?: any;
}

const CreateSpaceDialog = (props: ICreateSpaceDialogProps) => {
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
  const { id: spaceId } = data;
  const defaultValues =
    type === "update" ? data : { title: "", code: nanoid(5) };
  const formMethods = useForm({ shouldUnregister: true });
  const abortController = useMemo(() => new AbortController(), [rest.open]);

  const close = () => {
    abortController.abort();
    closeDialog();
  };

  const onSubmit = async (data: any) => {
    setLoading(true);
    try {
      type === "update"
        ? await service.updateSpace(
            { spaceId, data },
            { signal: abortController.signal }
          )
        : await service.createSpace(data, { signal: abortController.signal });

      setLoading(false);
      onSubmitForm();
      close();
    } catch (e) {
      const err = e as ICustomError;
      setLoading(false);
      toastError(err);
      setServerFieldErrors(err, formMethods);
    }
  };

  useEffect(() => {
    return () => {
      abortController.abort();
    };
  }, []);

  return (
    <CEDialog
      {...rest}
      closeDialog={close}
      title={
        type === "update" ? (
          <Trans i18nKey="updateSpace" />
        ) : (
          <Trans i18nKey="createSpace" />
        )
      }
    >
      <FormProviderWithForm
        formMethods={formMethods}
        onSubmit={formMethods.handleSubmit(onSubmit)}
      >
        <Grid container spacing={2} sx={styles.formGrid}>
          <Grid item xs={12}>
            <InputFieldUC
              name="code"
              required={true}
              defaultValue={defaultValues.code || nanoid(5)}
              label={<Trans i18nKey="code" />}
            />
          </Grid>
          <Grid item xs={12}>
            <InputFieldUC
              autoFocus={true}
              name="title"
              defaultValue={defaultValues.title || ""}
              required={true}
              label={<Trans i18nKey="title" />}
            />
          </Grid>
        </Grid>
        <CEDialogActions closeDialog={close} loading={loading} type={type} />
      </FormProviderWithForm>
    </CEDialog>
  );
};

export default CreateSpaceDialog;
