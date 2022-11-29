import React from "react";
import { Trans } from "react-i18next";
import { IDialogProps, TId } from "../../types";
import { CEDialog, CEDialogActions } from "../shared/dialogs/CEDialog";
import AddBoxRoundedIcon from "@mui/icons-material/AddBoxRounded";
import BorderColorRoundedIcon from "@mui/icons-material/BorderColorRounded";
import FormProviderWithForm from "../shared/FormProviderWithForm";
import Grid from "@mui/material/Grid";
import { useForm } from "react-hook-form";
import { styles } from "../../config/styles";
import { SelectFieldUC } from "../shared/fields/SelectField";
import useConnectSelectField from "../../utils/useConnectSelectField";
import MenuItem from "@mui/material/MenuItem";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import Title from "../shared/Title";
import {
  compareActions,
  useCompareContext,
  useCompareDispatch,
} from "../../providers/CompareProvider";

interface ICompareItemCEFormDialog
  extends Omit<ICompareItemCEForm, "closeDialog"> {}

const CompareItemCEFormDialog = (props: ICompareItemCEFormDialog) => {
  const { onClose, context, open, openDialog, onSubmitForm, ...rest } = props;

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
              <BorderColorRoundedIcon sx={{ mr: 1 }} />
              <Trans i18nKey="changeSelectedAssessment" />
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
      <CompareItemCEForm {...props} closeDialog={closeDialog} />
    </CEDialog>
  );
};

interface ICompareItemCEForm extends IDialogProps {
  closeDialog: () => void;
  index: number;
}

const CompareItemCEForm = (props: ICompareItemCEForm) => {
  const { closeDialog, context, open, index } = props;
  const { type, data } = context || {};
  const defaultValues = type === "update" ? data || {} : {};
  const formMethods = useForm({ shouldUnregister: true });
  const { assessmentIds, profile } = useCompareContext();
  const dispatch = useCompareDispatch();

  const onSubmit = (data: any) => {
    try {
      const newAssessmentIds = addToAssessmentIds(
        data.assessmentId,
        assessmentIds,
        index
      );
      dispatch(compareActions.setAssessmentIds(newAssessmentIds));
      closeDialog();
    } catch (e) {
      closeDialog();
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
            {...useConnectSelectField({
              url: `/assessment/currentuserprojects/`,
              searchParams: { profile_id: profile?.id },
              filterOptions: (options) =>
                options.filter(
                  (option) =>
                    !assessmentIds.includes(option?.id) ||
                    option?.id == defaultValues?.id
                ),
            })}
            required={true}
            autoFocus={true}
            name="assessmentId"
            defaultValue={defaultValues.id || ""}
            label={<Trans i18nKey="assessment" />}
            size="medium"
            renderOption={(option = {}) => {
              console.log("opt", option.id);
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
                      <Title
                        size="small"
                        sup={option.space.title}
                        color={option?.color?.color_code || "#101c32"}
                      >
                        {option.title}
                      </Title>
                      <Box ml="auto" sx={{ ...styles.centerV }}>
                        <Chip
                          label={option.assessment_profile.title}
                          size="small"
                        />
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
        loading={false}
        type={type}
        submitButtonLabel={"addToCompareList"}
      />
    </FormProviderWithForm>
  );
};

const addToAssessmentIds = (
  assessmentId: TId,
  assessmentIds: TId[],
  index: number
) => {
  const newAssessmentIds: TId[] = assessmentIds;
  if (assessmentIds[index] && assessmentIds[index] == assessmentId) {
    return assessmentIds;
  }
  newAssessmentIds[index] = assessmentId;
  return newAssessmentIds;
};

export default CompareItemCEFormDialog;
