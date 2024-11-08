import React, { useState, useEffect } from "react";
import {
  Grid,
  TextField,
  IconButton,
  Typography,
  Switch,
  Box,
  Button,
} from "@mui/material";
import { Trans } from "react-i18next";
import { useForm, FormProvider } from "react-hook-form";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import { useServiceContext } from "@/providers/ServiceProvider";
import { IQuestionInfo } from "@/types";
import { useQuery } from "@/utils/useQuery";
import {
  CEDialog,
  CEDialogActions,
} from "@/components/common/dialogs/CEDialog";
import FormProviderWithForm from "@/components/common/FormProviderWithForm";
import { t } from "i18next";
import { styles } from "@styles";
import EmptyState from "../../common/EmptyState";

interface QuestionDialogProps {
  open: boolean;
  question: IQuestionInfo;
  kitVersionId: string;
  onClose: () => void;
  fetchQuery: any;
}

const QuestionDialog: React.FC<QuestionDialogProps> = ({
  open,
  question,
  kitVersionId,
  onClose,
  fetchQuery,
}) => {
  const fetchAttributeKit = useQuery({
    service: (args = { kitVersionId }, config) =>
      service.fetchAttributeKit(args, config),
    runOnMount: false,
  });

  const [questionData, setQuestionData] = useState<any>(null);
  const formMethods = useForm({ shouldUnregister: true });

  const { service } = useServiceContext();

  useEffect(() => {
    if (open && question.id) {
      fetchAttributeKit.query();
      formMethods.reset({
        title: question?.title || "",
        hint: question?.hint || "",
        options: question?.options || [{ text: "" }],
        mayNotBeApplicable: question?.mayNotBeApplicable || false,
        advisable: question?.advisable || false,
      });
    }
  }, [open, question, formMethods]);

  const onSubmit = async (data: any) => {
    try {
      const requestData = {
        ...data,
        index: 1,
      };
      await service.updateQuestionsKit({
        kitVersionId,
        questionId: question?.id,
        data: requestData,
      });
      fetchQuery.query();
      onClose();
    } catch (error) {
      console.error("Failed to update question:", error);
    }
  };

  const handleAddNewRow = () => {};

  return (
    <CEDialog
      open={open}
      onClose={onClose}
      title={<Trans i18nKey="addNewQuestion" />}
    >
      <FormProviderWithForm
        formMethods={formMethods}
        style={{
          paddingBlock: 20,
          paddingInline: 40,
        }}
      >
        <Box display="flex" flexDirection="column" gap={1}>
          <Typography variant="semiBoldXLarge" gutterBottom>
            <Trans i18nKey="questionAndOptions" />
          </Typography>
          <Typography variant="bodyMedium" color="textSecondary">
            <Trans i18nKey="questionAndOptionsDescription" />
          </Typography>
        </Box>
        <Grid container spacing={2} mt={2}>
          <Grid item xs={12}>
            <TextField
              {...formMethods.register("title", { required: true })}
              fullWidth
              label="Question"
              placeholder={t("questionPlaceholder").toString()}
              required
              sx={{
                "& .MuiInputBase-root": {
                  height: 46,
                },
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              {...formMethods.register("hint")}
              fullWidth
              label="Hint"
              placeholder={t("hintPlaceholder").toString()}
              sx={{
                "& .MuiInputBase-root": {
                  height: 46,
                },
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <Typography variant="body2">
              <Trans i18nKey="answerOptions" />
            </Typography>
            {/* {formMethods.watch("options").map((option: any, index: number) => (
              <Box display="flex" alignItems="center" mt={1} key={index}>
                <TextField
                  fullWidth
                  placeholder={`Option ${index + 1}`}
                  defaultValue={option.text}
                />
                <IconButton>
                  <CloseIcon />
                </IconButton>
              </Box>
            ))} */}
            <Button
              startIcon={<AddIcon />}
              variant="outlined"
              sx={{ mt: 2 }}
              size="small"
            >
              <Trans i18nKey="newOption" />
            </Button>
          </Grid>
        </Grid>

        <Typography variant="subtitle1" gutterBottom sx={{ mt: 3 }}>
          <Trans i18nKey="optionsImpacts" />
        </Typography>
        {fetchAttributeKit?.data?.items?.length === 0 && (
          <EmptyState
            btnTitle={"newOptionImpact"}
            title={"optionsImpactsEmptyState"}
            SubTitle={"optionsImpactsEmptyStateDetailed"}
            onAddNewRow={handleAddNewRow}
            disabled={fetchAttributeKit?.data?.items?.length === 0}
          />
        )}

        <Box display="flex" flexDirection="column" gap={1}>
          <Typography variant="semiBoldXLarge" gutterBottom>
            <Trans i18nKey="advancedSettings" />
          </Typography>
          <Typography variant="bodyMedium" color="textSecondary">
            <Trans i18nKey="advancedSettingsDescription" />
          </Typography>
        </Box>
        <Grid container spacing={2} alignItems="center" mt={1}>
          <Grid item xs={6}>
            <Box sx={{ ...styles.centerVH }}>
              <Typography variant="semiBoldMedium">
                <Trans i18nKey="notApplicable" />
              </Typography>
              <Switch
                {...formMethods.register("mayNotBeApplicable")}
                checked={formMethods.watch("mayNotBeApplicable")}
              />
            </Box>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="semiBoldMedium">
              <Trans i18nKey="notAdvisable" />
            </Typography>
            <Switch
              {...formMethods.register("advisable")}
              checked={formMethods.watch("advisable")}
            />
          </Grid>
        </Grid>
      </FormProviderWithForm>

      <CEDialogActions
        loading={false}
        onClose={onClose}
        onSubmit={formMethods.handleSubmit(onSubmit)}
        submitButtonLabel="createQuestion"
        type="create"
      />
    </CEDialog>
  );
};

export default QuestionDialog;
