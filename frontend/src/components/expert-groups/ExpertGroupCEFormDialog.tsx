import { useEffect, useMemo, useState } from "react";
import Grid from "@mui/material/Grid";
import { DialogProps } from "@mui/material/Dialog";
import { useForm } from "react-hook-form";
import { Trans } from "react-i18next";
import { InputFieldUC } from "@common/fields/InputField";
import { styles } from "@styles";
import { useServiceContext } from "@providers/ServiceProvider";
import setServerFieldErrors from "@utils/setServerFieldError";
import NoteAddRoundedIcon from "@mui/icons-material/NoteAddRounded";
import { ICustomError } from "@utils/CustomError";
import { useNavigate } from "react-router-dom";
import toastError from "@utils/toastError";
import { CEDialog, CEDialogActions } from "@common/dialogs/CEDialog";
import FormProviderWithForm from "@common/FormProviderWithForm";
import RichEditorField from "@common/fields/RichEditorField";
import UploadField from "@common/fields/UploadField";

interface IExpertGroupCEFromDialogProps extends DialogProps {
  onClose: () => void;
  onSubmitForm: () => void;
  openDialog?: any;
  context?: any;
  hideSubmitAndView?: boolean;
}

const ExpertGroupCEFormDialog = (props: IExpertGroupCEFromDialogProps) => {
  const [loading, setLoading] = useState(false);
  const { service } = useServiceContext();
  const { onClose: closeDialog, onSubmitForm, context = {}, openDialog, hideSubmitAndView, ...rest } = props;
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
      picture: picture || "",
    };
    setLoading(true);
    try {
      const { data: res } =
        type === "update"
          ? await service.updateExpertGroup({ data: formattedData, id }, { signal: abortController.signal })
          : await service.createExpertGroup({ data: formattedData }, { signal: abortController.signal });
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
          {type === "update" ? <Trans i18nKey="updateExpertGroup" /> : <Trans i18nKey="createExpertGroup" />}
        </>
      }
    >
      <FormProviderWithForm formMethods={formMethods}>
        <Grid container spacing={2} sx={styles.formGrid}>
          <Grid item xs={12} md={5}>
            <UploadField
              accept={{
                "image/jpeg": [".jpeg", ".jpg"],
                "image/png": [".png"],
              }}
              defaultValueType="image"
              defaultValue={defaultValues.picture}
              shouldFetchFileInfo={true}
              hideDropText
              name="picture"
              label={<Trans i18nKey="groupPicture" />}
            />
          </Grid>
          <Grid item xs={12} md={7}>
            <InputFieldUC defaultValue={defaultValues.name || ""} name="title" label={<Trans i18nKey="title" />} required />
          </Grid>
          <Grid item xs={12} md={8}>
            <InputFieldUC name="bio" label={<Trans i18nKey="bio" />} defaultValue={defaultValues.bio || ""}  required/>
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
            <RichEditorField name="about" label={<Trans i18nKey="about" />} defaultValue={defaultValues.about || ""} required />
          </Grid>
        </Grid>
        <CEDialogActions
          closeDialog={close}
          loading={loading}
          type={type}
          hasViewBtn={hideSubmitAndView ? false : true}
          onSubmit={(...args) => formMethods.handleSubmit((data) => onSubmit(data, ...args))}
        />
      </FormProviderWithForm>
    </CEDialog>
  );
};

export default ExpertGroupCEFormDialog;
