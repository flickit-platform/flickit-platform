import React, { useState, useEffect } from "react";
import {
  Grid,
  TextField,
  IconButton,
  Typography,
  Switch,
  Box,
  Button,
  Divider,
} from "@mui/material";
import { Trans } from "react-i18next";
import { useForm, FormProvider } from "react-hook-form";
import AddIcon from "@mui/icons-material/Add";
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
import { ICustomError } from "@/utils/CustomError";
import toastError from "@/utils/toastError";
import OptionForm from "./OptionForm";
import OptionList from "./OptionsList";
import AttributeImpactList from "./ImpactList";

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
  const fetchImpacts = useQuery({
    service: (args = { kitVersionId, questionId: question.id }, config) =>
      service.loadQuestionImpactsList(args, config),
    runOnMount: false,
  });
  const fetchOptions = useQuery({
    service: (args = { kitVersionId, questionId: question.id }, config) =>
      service.loadAnswerOptionsList(args, config),
    runOnMount: false,
  });

  const [newOption, setNewOption] = useState({
    title: "",
    description: "",
    index: 1,
    value: 1,
    id: null,
  });
  const [questionData, setQuestionData] = useState<any>(null);
  const [showNewOptionForm, setShowNewOptionForm] = useState(false);
  const formMethods = useForm({ shouldUnregister: true });

  const { service } = useServiceContext();

  useEffect(() => {
    if (open && question.id) {
      fetchImpacts.query();
      fetchAttributeKit.query();
      fetchOptions.query();
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const parsedValue = name === "value" ? parseInt(value) || 1 : value;
    setNewOption((prev) => ({
      ...prev,
      [name]: parsedValue,
    }));
  };

  const handleSave = async () => {
    try {
      const data = {
        kitVersionId,
        index: newOption.index,
        value: newOption.value,
        title: newOption.title,
        description: newOption.description,
      };
      // if (NewOption.id) {
      //   await service.updateQue({
      //     kitVersionId,
      //     questionnaireId: NewOption.id,
      //     data,
      //   });
      // } else {
      //   await fetchOptions.query({ kitVersionId, data });
      // }

      await fetchOptions.query();

      setNewOption({
        title: "",
        description: "",
        index: fetchOptions.data?.items.length + 1 || 1,
        value: fetchOptions.data?.items.length + 1 || 1,
        id: null,
      });
    } catch (e) {
      const err = e as ICustomError;
      toastError(err);
    }
  };

  const handleCancel = () => {
    setShowNewOptionForm(false);
    setNewOption({
      title: "",
      description: "",
      index: fetchOptions.data?.items.length + 1 || 1,
      value: fetchOptions.data?.items.length + 1 || 1,
      id: null,
    });
  };

  return (
    <CEDialog
      open={open}
      onClose={onClose}
      title={<Trans i18nKey="createQuestion" />}
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
            {fetchOptions?.data?.answerOptions?.length > 0 ? (
              <>
                <Box maxHeight={500} overflow="auto">
                  <OptionList
                    Options={fetchOptions?.data?.answerOptions}
                    onEdit={handleAddNewRow}
                    onDelete={handleAddNewRow}
                    onReorder={handleAddNewRow}
                  />
                </Box>

                {showNewOptionForm && (
                  <OptionForm
                    newItem={newOption}
                    handleInputChange={handleInputChange}
                    handleSave={handleSave}
                    handleCancel={handleCancel}
                  />
                )}
              </>
            ) : (
              <>
                {showNewOptionForm ? (
                  <OptionForm
                    newItem={newOption}
                    handleInputChange={handleInputChange}
                    handleSave={handleSave}
                    handleCancel={handleCancel}
                  />
                ) : (
                  <EmptyState
                    btnTitle={"newOption"}
                    title={"optionsEmptyState"}
                    SubTitle={"optionsEmptyStateDetailed"}
                    onAddNewRow={handleAddNewRow}
                    disabled={fetchAttributeKit?.data?.items?.length === 0}
                  />
                )}
              </>
            )}
            {/* <Button
              startIcon={<AddIcon />}
              variant="outlined"
              sx={{ mt: 2 }}
              size="small"
            >
              <Trans i18nKey="newOption" />
            </Button> */}
          </Grid>
        </Grid>
        <Divider sx={{ my: 1, mt: 4 }} />

        <Box display="flex" flexDirection="column" gap={1} mt={4}>
          <Typography variant="semiBoldXLarge" gutterBottom>
            <Trans i18nKey="optionsImpacts" />
          </Typography>
          <Typography variant="bodyMedium" color="textSecondary">
            <Trans i18nKey="optionsImpactsDescription" />
          </Typography>
        </Box>
        {fetchImpacts?.data?.attributeImpacts?.length > 0 ? (
          <AttributeImpactList
            attributeImpacts={fetchImpacts?.data?.attributeImpacts}
          />
        ) : (
          <EmptyState
            btnTitle={"newOptionImpact"}
            title={"optionsImpactsEmptyState"}
            SubTitle={"optionsImpactsEmptyStateDetailed"}
            onAddNewRow={handleAddNewRow}
            disabled={fetchAttributeKit?.data?.items?.length === 0}
          />
        )}
        <Divider sx={{ my: 1, mt: 4 }} />

        <Box display="flex" flexDirection="column" gap={1} mt={4}>
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
        <Divider sx={{ mt: 4 }} />
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
