import React, { useEffect, useMemo, useState } from "react";
import Grid from "@mui/material/Grid";
import { DialogProps } from "@mui/material/Dialog";
import { useForm } from "react-hook-form";
import { Trans } from "react-i18next";
import { InputFieldUC } from "@common/fields/InputField";
import { styles } from "@styles";
import { useServiceContext } from "@providers/ServiceProvider";
import setServerFieldErrors from "@utils/setServerFieldError";
import { ICustomError } from "@utils/CustomError";
import { useNavigate, useParams } from "react-router-dom";
import toastError from "@utils/toastError";
import { CEDialog, CEDialogActions } from "@common/dialogs/CEDialog";
import FormProviderWithForm from "@common/FormProviderWithForm";
import AutocompleteAsyncField, {
  useConnectAutocompleteField,
} from "@common/fields/AutocompleteAsyncField";
import RichEditorField from "@common/fields/RichEditorField";
import { t } from "i18next";
import SettingsRoundedIcon from "@mui/icons-material/SettingsRounded";

interface IProfileSettingFormDialogProps extends DialogProps {
  onClose: () => void;
  onSubmitForm: () => void;
  openDialog?: any;
  context?: any;
  fetchProfileQuery?: any;
}

const ProfileSettingFormDialog = (props: IProfileSettingFormDialogProps) => {
  const [loading, setLoading] = useState(false);
  const { service } = useServiceContext();
  const {
    onClose: closeDialog,
    onSubmitForm,
    context = {},
    fetchProfileQuery,
    openDialog,
    ...rest
  } = props;
  const { type, data = {} } = context;
  const { expertGroupId: fallbackExpertGroupId, profileId } = useParams();
  const { id, expertGroupId = fallbackExpertGroupId } = data;
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
    event.preventDefault();
    const { dsl_id, tags = [], ...restOfData } = data;
    const formattedData = {
      tags: tags.map((t: any) => t.id),
      ...restOfData,
    };
    setLoading(true);
    try {
      const { data: res } =
        type === "update"
          ? await service.updateProfile(
              { data: formattedData, profileId },
              { signal: abortController.signal }
            )
          : await service.createProfile(
              { data: formattedData },
              { signal: abortController.signal }
            );
      setLoading(false);
      onSubmitForm();
      close();
      shouldView && res?.id && navigate(`profiles/${res.id}`);
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
          <SettingsRoundedIcon sx={{ mr: 1 }} />
          {<Trans i18nKey="profileSetting" />}
        </>
      }
    >
      <FormProviderWithForm formMethods={formMethods}>
        <Grid container spacing={2} sx={styles.formGrid}>
          <Grid item xs={12} md={12}>
            <AutocompleteAsyncField
              {...useConnectAutocompleteField({
                service: (args, config) =>
                  service.fetchProfileTags(args, config),
              })}
              name="tags"
              multiple={true}
              defaultValue={
                fetchProfileQuery?.data && fetchProfileQuery?.data[0].tags
              }
              searchOnType={false}
              label={<Trans i18nKey="tags" />}
            />
          </Grid>
          <Grid item xs={12} md={12}>
            <InputFieldUC
              name="summary"
              label={<Trans i18nKey="summary" />}
              defaultValue={defaultValues.summary || ""}
            />
          </Grid>
          <Grid item xs={12} md={12}>
            <RichEditorField
              name="about"
              label={<Trans i18nKey="about" />}
              defaultValue={defaultValues.about || ""}
            />
          </Grid>
        </Grid>
        <CEDialogActions
          closeDialog={close}
          loading={loading}
          type={type}
          submitButtonLabel={t("saveChanges") as string}
          onSubmit={formMethods.handleSubmit(onSubmit)}
        />
      </FormProviderWithForm>
    </CEDialog>
  );
};

export default ProfileSettingFormDialog;
