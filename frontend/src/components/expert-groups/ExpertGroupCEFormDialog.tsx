import React, { useEffect, useMemo } from "react";
import Grid from "@mui/material/Grid";
import { DialogProps } from "@mui/material/Dialog";
import { useForm } from "react-hook-form";
import { Trans } from "react-i18next";
import { InputFieldUC } from "../shared/fields/InputField";
import { styles } from "../../config/styles";
import { useServiceContext } from "../../providers/ServiceProvider";
import setServerFieldErrors from "../../utils/setServerFieldError";
import NoteAddRoundedIcon from "@mui/icons-material/NoteAddRounded";
import { ICustomError } from "../../utils/CustomError";
import { Link, useNavigate, useParams } from "react-router-dom";
import toastError from "../../utils/toastError";
import { CEDialog, CEDialogActions } from "../shared/dialogs/CEDialog";
import FormProviderWithForm from "../shared/FormProviderWithForm";
import RichEditorField from "../shared/fields/RichEditorField";
import UploadField from "../shared/fields/UploadField";

interface IExpertGroupCEFromDialogProps extends DialogProps {
  onClose: () => void;
  onSubmitForm: () => void;
  openDialog?: any;
  context?: any;
}

const ExpertGroupCEFormDialog = (props: IExpertGroupCEFromDialogProps) => {
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
  const navigate = useNavigate();
  const close = () => {
    abortController.abort();
    closeDialog();
  };

  useEffect(() => {
    return () => {
      abortController.abort();
    };
  }, []);

  const onSubmit = async (data: any, event: any, shouldView?: boolean) => {
    const { picture, ...restOfData } = data;
    const formattedData = {
      ...restOfData,
      picture: picture || null,
    };
    setLoading(true);
    try {
      const { data: res } =
        type === "update"
          ? await service.updateExpertGroup(
              { data: formattedData, id },
              { signal: abortController.signal }
            )
          : await service.createExpertGroup(
              { data: formattedData },
              { signal: abortController.signal }
            );
      setLoading(false);
      onSubmitForm();
      close();
      shouldView && res?.id && navigate(`${res.id}`);
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
            <Trans i18nKey="updateExpertGroup" />
          ) : (
            <Trans i18nKey="createExpertGroup" />
          )}
        </>
      }
    >
      <FormProviderWithForm formMethods={formMethods}>
        <Grid container spacing={2} sx={styles.formGrid}>
          <Grid item xs={12} md={5}>
            <UploadField
              defaultValue={defaultValues.picture}
              defaultValueType="image"
              hideDropText
              name="picture"
              label={<Trans i18nKey="groupPicture" />}
            />
          </Grid>
          <Grid item xs={12} md={7}>
            <InputFieldUC
              defaultValue={defaultValues.name || ""}
              name="name"
              label={<Trans i18nKey="name" />}
              required
            />
          </Grid>
          <Grid item xs={12} md={8}>
            <InputFieldUC
              name="about"
              label={<Trans i18nKey="about" />}
              defaultValue={defaultValues.about || ""}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <InputFieldUC
              name="website"
              label={<Trans i18nKey="website" />}
              placeholder="https://example.com"
              defaultValue={defaultValues.website || ""}
            />
          </Grid>
          <Grid item xs={12}>
            <RichEditorField
              name="description"
              label={<Trans i18nKey="description" />}
              defaultValue={defaultValues.description || ""}
            />
          </Grid>
        </Grid>
        <CEDialogActions
          closeDialog={close}
          loading={loading}
          type={type}
          hasViewBtn={true}
          onSubmit={(...args) =>
            formMethods.handleSubmit((data) => onSubmit(data, ...args))
          }
        />
      </FormProviderWithForm>
    </CEDialog>
  );
};

export default ExpertGroupCEFormDialog;
