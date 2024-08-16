import { Trans } from "react-i18next";
import { IDialogProps, TId } from "@types";
import { CEDialog, CEDialogActions } from "@common/dialogs/CEDialog";
import AddBoxRoundedIcon from "@mui/icons-material/AddBoxRounded";
import BorderColorRoundedIcon from "@mui/icons-material/BorderColorRounded";
import FormProviderWithForm from "@common/FormProviderWithForm";
import Grid from "@mui/material/Grid";
import { useForm } from "react-hook-form";
import { styles } from "@styles";
import { SelectFieldUC } from "@common/fields/SelectField";
import useConnectSelectField from "@utils/useConnectSelectField";
import MenuItem from "@mui/material/MenuItem";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import Title from "@common/Title";
import {
  compareActions,
  useCompareContext,
  useCompareDispatch,
} from "@providers/CompareProvider";
import { useQuery } from "@utils/useQuery";
import { useServiceContext } from "@providers/ServiceProvider";
import AlertBox from "@common/AlertBox";
import { useState } from "react";

interface ICompareItemCEFormDialog
  extends Omit<ICompareItemCEForm, "closeDialog"> { }

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
      <AlertBox severity="info">
        <Trans i18nKey="youCanOnlyHaveAccessToTheAssessmentsThatAreInYourSpaces" />
      </AlertBox>
      <CompareItemCEForm {...props} closeDialog={closeDialog} />
    </CEDialog>
  );
};

interface ICompareItemCEForm extends IDialogProps {
  closeDialog: () => void;
  index: number;
}

const CompareItemCEForm = (props: ICompareItemCEForm) => {

  const PAGE_SIZE: number = 5
  const ITEM_HEIGHT = 48;
  const ITEM_PADDING_TOP = 8;

  const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      },
    },
  };

  const { closeDialog, context, open, index } = props;
  const { type, data } = context || {};
  const defaultValues = type === "update" ? data || {} : {};
  const formMethods = useForm({ shouldUnregister: true });
  const { assessmentIds, assessment_kit } = useCompareContext();
  const dispatch = useCompareDispatch();
  const { service } = useServiceContext();
  const [PageCount, setPageCount] = useState<number>(0)
  const [total, setTotal] = useState<number>(0)
  const calculateMaturityLevelQuery = useQuery<any>({
    service: (args, config) => service.calculateMaturityLevel(args, config),
    runOnMount: false,
  });
  const calculateConfidenceLevelQuery = useQuery({
    service: (args, config) => service.calculateConfidenceLevel(args, config),
    runOnMount: false,
  });
  const onSubmit = (data: any) => {
    try {
      if (data?.assessment?.id) {
        if (!data?.assessment?.is_calculate_valid) {
          calculateMaturityLevelQuery.query({
            assessmentId: data?.assessment?.id,
          });
        }
        if (!data?.assessment?.is_confidence_valid) {
          calculateConfidenceLevelQuery.query({
            assessmentId: data?.assessment?.id,
          });
        }
        const newAssessmentIds = addToAssessmentIds(
          data.assessmentIds?.id,
          assessmentIds,
          index
        );
        dispatch(
          compareActions.setAssessmentKit([...assessment_kit, data?.assessment])
        );
        closeDialog();
      }
    } catch (e) {
      closeDialog();
    }
  };

  return (
    <FormProviderWithForm formMethods={formMethods}>
      <Grid container spacing={2} sx={{ ...styles.formGrid, pt: 0, mt: 0 }}>
        <Grid item xs={12}>
          <SelectFieldUC
            {...useConnectSelectField({
              url: "/api/v1/comparable-assessments/",
              searchParams: {
                kitId: assessment_kit && assessment_kit[0]?.kit?.id,
                size: PAGE_SIZE,
                page: PageCount
              },
              loadMore: PageCount
            })}
            required={true}
            autoFocus={true}
            name="assessment"
            defaultValue={defaultValues || ""}
            label={<Trans i18nKey="assessment" />}
            size="medium"
            selectedOptions={assessment_kit}
            loadMore={total > ((PAGE_SIZE * PageCount) + PAGE_SIZE)}
            loadMoreHandler={setPageCount}
            getTotalHandler={setTotal}
            MenuProps={MenuProps}
            nullable={total >= 1 ? false : true}
            renderOption={(option = {}) => {
              return (
                <MenuItem
                  value={option}
                  key={option.id}
                  sx={{ display: "flex", alignItems: "center" }}
                >
                  {option.id === "" ? (
                    option.title
                  ) : (
                    <>
                      <Title
                        size="small"
                        sup={option?.space?.title}
                        color={option?.color?.code || "#101c32"}
                      >
                        {option.title}
                      </Title>
                      <Box ml="auto" sx={{ ...styles.centerV }}>
                        <Chip
                          label={option?.kit?.title}
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
        onSubmit={formMethods.handleSubmit(onSubmit)}
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
