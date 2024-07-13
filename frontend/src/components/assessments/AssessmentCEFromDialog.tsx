import { useEffect, useMemo, useState } from "react";
import Grid from "@mui/material/Grid";
import { DialogProps } from "@mui/material/Dialog";
import { useForm } from "react-hook-form";
import { Trans } from "react-i18next";
import { InputFieldUC } from "@common/fields/InputField";
import { SelectFieldUC } from "@common/fields/SelectField";
import { styles } from "@styles";
import { useServiceContext } from "@providers/ServiceProvider";
import setServerFieldErrors from "@utils/setServerFieldError";
import useConnectSelectField from "@utils/useConnectSelectField";
import NoteAddRoundedIcon from "@mui/icons-material/NoteAddRounded";
import { ICustomError } from "@utils/CustomError";
import { Link, useNavigate, useParams } from "react-router-dom";
import toastError from "@utils/toastError";
import { CEDialog, CEDialogActions } from "@common/dialogs/CEDialog";
import FormProviderWithForm from "@common/FormProviderWithForm";
import { useQuery } from "@utils/useQuery";
import AutocompleteAsyncField, {
  useConnectAutocompleteField,
} from "@common/fields/AutocompleteAsyncField";

interface IAssessmentCEFromDialogProps extends DialogProps {
  onClose: () => void;
  onSubmitForm: () => void;
  openDialog?: any;
  context?: any;
}

const AssessmentCEFromDialog = (props: IAssessmentCEFromDialogProps) => {
  const [loading, setLoading] = useState(false);
  const { service } = useServiceContext();
  const {
    onClose: closeDialog,
    onSubmitForm,
    context = {},
    openDialog,
    ...rest
  } = props;
  const { type, data = {}, staticData = {} } = context;
  const { id: assessmentId } = data;
  const defaultValues = type === "update" ? data : {};
  const { spaceId } = useParams();
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
    const { space, assessment_kit, title, color } = data;
    setLoading(true);
    try {
      type === "update"
        ? await service.updateAssessment(
            {
              id: assessmentId,
              data: {
                title,
                colorId: color,
              },
            },
            { signal: abortController.signal }
          )
        : await service.createAssessment(
            {
              data: {
                spaceId: spaceId || space?.id,
                assessmentKitId: assessment_kit?.id,
                title: title,
                colorId: color,
              },
            },
            { signal: abortController.signal }
          );
      setLoading(false);
      onSubmitForm();
      close();
      !!staticData.assessment_kit &&
        navigate(`/${spaceId || space?.id}/assessments/1`);
    } catch (e) {
      const err = e as ICustomError;
      setLoading(false);
      setServerFieldErrors(err, formMethods);
      formMethods.clearErrors();
      toastError(err);
      return () => {
        abortController.abort();
      };
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
      <FormProviderWithForm formMethods={formMethods}>
        <Grid container spacing={2} sx={styles.formGrid}>
          <Grid item xs={12} md={12}>
            <InputFieldUC
              autoFocus={true}
              defaultValue={defaultValues.title || ""}
              name="title"
              required={true}
              label={<Trans i18nKey="title" />}
              data-cy="title"
            />
          </Grid>
          <Grid item xs={12}>
            <SpaceField defaultValue={defaultValues?.space || data?.space} />
          </Grid>
          <Grid item xs={12}>
            <AssessmentKitField
              staticData={staticData?.assessment_kit}
              defaultValue={defaultValues?.assessment_kit}
            />
          </Grid>
        </Grid>
        <CEDialogActions
          closeDialog={close}
          loading={loading}
          type={type}
          onSubmit={(...args) =>
            formMethods.handleSubmit((data) => onSubmit(data, ...args))
          }
        />
      </FormProviderWithForm>
    </CEDialog>
  );
};

const AssessmentKitField = ({
  defaultValue,
  staticData,
}: {
  defaultValue: any;
  staticData: any;
}) => {
  const { service } = useServiceContext();

  const queryData = useConnectAutocompleteField({
    service: (args, config) => service.fetchAssessmentKitsOptions(args, config),
    accessor: "items",
  });

  return (
    <AutocompleteAsyncField
      {...(defaultValue
        ? ({ loading: false, loaded: true, options: [] } as any)
        : queryData)}
      name="assessment_kit"
      required={true}
      defaultValue={staticData ?? defaultValue}
      disabled={!!staticData || !!defaultValue}
      label={<Trans i18nKey="assessmentKit" />}
      data-cy="assessment_kit"
    />
  );
};

const SpaceField = ({ defaultValue }: { defaultValue: any }) => {
  const { service } = useServiceContext();
  const { spaceId } = useParams();
  const queryData = useConnectAutocompleteField({
    service: (args, config) => service.fetchSpaces(args, config),
  });


  return (
    <AutocompleteAsyncField
      {...queryData}
      name="space"
      required={true}
      disabled={!!spaceId}
      defaultValue={defaultValue}
      label={<Trans i18nKey="space" />}
      data-cy="space"
      hasAddBtn={true}
    />
  );
};

export default AssessmentCEFromDialog;
