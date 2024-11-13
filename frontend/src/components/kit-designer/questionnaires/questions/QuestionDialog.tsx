import React, { useState, useEffect } from "react";
import {
  Grid,
  TextField,
  Typography,
  Switch,
  Box,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Tooltip,
} from "@mui/material";
import { Trans } from "react-i18next";
import { useForm } from "react-hook-form";
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
import ImpactForm, { dropdownStyle } from "./ImpactForm";

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
  const fetchMaturityLevels = useQuery({
    service: (args = { kitVersionId }, config) =>
      service.getMaturityLevels(args, config),
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

  const postQuestionImpactsKit = useQuery({
    service: (args, config) => service.postQuestionImpactsKit(args, config),
    runOnMount: false,
  });

  const [newOption, setNewOption] = useState({
    title: "",
    index: 1,
    value: 1,
    id: null,
  });
  const [newImpact, setnewImpact] = useState({
    questionId: question.id,
    attributeId: undefined,
    maturityLevelId: undefined,
    weight: 1,
  });
  const [questionData, setQuestionData] = useState<any>(null);
  const [showNewOptionForm, setShowNewOptionForm] = useState(false);
  const [showNewImpactForm, setShowNewImpactForm] = useState(false);
  const formMethods = useForm({ shouldUnregister: true });

  const { service } = useServiceContext();

  useEffect(() => {
    if (open && question.id) {
      fetchImpacts.query();
      fetchAttributeKit.query();
      fetchMaturityLevels.query();
      fetchOptions.query();
      fetchAnswerRanges.query();
      formMethods.reset({
        title: question?.title || "",
        hint: question?.hint || "",
        options: question?.options || [{ text: "" }],
        mayNotBeApplicable: question?.mayNotBeApplicable || false,
        advisable: question?.advisable || false,
      });
      setSelectedAnswerRange(question?.answerRangeId);
    }
  }, [open, question, formMethods]);

  const onSubmit = async (data: any) => {
    try {
      const requestData = {
        ...data,
        index: question.index,
        answerRangeId: selectedAnswerRange,
      };
      await service.updateQuestionsKit({
        kitVersionId,
        questionId: question?.id,
        data: requestData,
      });
      fetchQuery.query();
      onClose();
    } catch (error) {
      const err = error as ICustomError;
      toastError(err);
    }
  };

  const handleAddNewRow = () => {
    setShowNewOptionForm(true);
  };

  const handleAddNewImpactRow = () => {
    setShowNewImpactForm(true);
  };

  const handleImpactInputChange = (field: string, value: any) => {
    setnewImpact((prev) => ({ ...prev, [field]: value }));
  };

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

      // await fetchOptions.query();

      setShowNewOptionForm(false);
      setNewOption({
        title: "",
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
      index: fetchOptions.data?.items.length + 1 || 1,
      value: fetchOptions.data?.items.length + 1 || 1,
      id: null,
    });
  };

  const handleSaveNewOption = async () => {
    try {
      await postQuestionImpactsKit
        .query({ kitVersionId, data: newImpact })
        .then(() => {
          fetchImpacts.query();
        });
      handleCancelNewOption();
    } catch (err) {
      const error = err as ICustomError;
      toastError(error);
    }
  };

  const handleCancelNewOption = () => {
    setShowNewImpactForm(false);
    setnewImpact({
      questionId: question.id,
      attributeId: undefined,
      maturityLevelId: undefined,
      weight: 1,
    });
  };

  const deleteQuestionImpactsKit = useQuery({
    service: (args, config) => service.deleteQuestionImpactsKit(args, config),
    runOnMount: false,
  });
  const updateQuestionImpactsKit = useQuery({
    service: (args, config) => service.updateQuestionImpactsKit(args, config),
    runOnMount: false,
  });
  const handleDeleteImpact = (item: any) => {
    try {
      deleteQuestionImpactsKit
        .query({
          kitVersionId: kitVersionId,
          questionImpactId: item.questionImpactId,
        })
        .then(() => {
          fetchImpacts.query();
        });
    } catch (err) {
      const error = err as ICustomError;
      toastError(error);
    }
  };

  const handleEditImpact = (tempValues: any, item: any) => {
    try {
      updateQuestionImpactsKit
        .query({
          kitVersionId: kitVersionId,
          questionImpactId: item.questionImpactId,
          data: tempValues,
        })
        .then(() => {
          fetchImpacts.query();
        });
    } catch (err) {
      const error = err as ICustomError;
      toastError(error);
    }
  };

  const fetchAnswerRanges = useQuery({
    service: (args = { kitVersionId }, config) =>
      service.loadAnswerRangesList(args, config),
    runOnMount: false,
  });

  const postAnswerOptionsKit = useQuery({
    service: (args = { kitVersionId, data: {} }, config) =>
      service.postAnswerOptionsKit(args, config),
    runOnMount: false,
  });

  const [selectedAnswerRange, setSelectedAnswerRange] = useState<
    number | undefined
  >(question.answerRangeId);

  const handleAnswerRangeChange = async (event: any) => {
    const requestData = {
      ...question,
      answerRangeId: event.target.value,
    };
    try {
      await service
        .updateQuestionsKit({
          ...question,
          kitVersionId,
          questionId: question?.id,
          data: requestData,
        })
        .then(() => {
          setSelectedAnswerRange(event.target.value);
          fetchOptions.query();
        });
    } catch (err) {
      const error = err as ICustomError;
      toastError(error);
    }
  };

  const handleAddOption = async (item: any) => {
    try {
      await postAnswerOptionsKit
        .query({
          kitVersionId,
          data: { ...item, questionId: question.id },
        })
        .then(() => {
          fetchOptions.query();
          setShowNewOptionForm(false);
        });
    } catch (err) {
      const error = err as ICustomError;
      toastError(error);
    }
  };

  return (
    <CEDialog
      open={open}
      onClose={onClose}
      title={<Trans i18nKey="editQuestion" />}
    >
      <FormProviderWithForm
        formMethods={formMethods}
        style={{
          paddingBlock: 20,
          paddingInline: 40,
          maxHeight: "80vh",
          overflow: "auto",
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
              multiline
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              {...formMethods.register("hint")}
              fullWidth
              label="Hint"
              placeholder={t("hintPlaceholder").toString()}
              multiline
            />
          </Grid>
          <Grid item xs={12}>
            <Box
              mt={1.5}
              p={1.5}
              sx={{
                borderRadius: "8px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 2,
              }}
            >
              <Typography variant="body2">
                <Trans i18nKey="answerOptions" />
              </Typography>
              <Tooltip
                title={
                  fetchAnswerRanges?.data?.items.length === 0 &&
                  t("emptyAnswerRange")
                }
              >
                <Select
                  value={selectedAnswerRange || ""}
                  onChange={handleAnswerRangeChange}
                  sx={dropdownStyle}
                  size="small"
                  displayEmpty
                  disabled={fetchAnswerRanges?.data?.items?.length === 0}
                >
                  <MenuItem value="" disabled>
                    <Trans i18nKey="chooseAnswerRange" />
                  </MenuItem>
                  {fetchAnswerRanges?.data?.items?.map((range: any) => (
                    <MenuItem key={range.id} value={range.id}>
                      {range.title}
                    </MenuItem>
                  ))}
                </Select>
              </Tooltip>
            </Box>
            {fetchOptions?.data?.answerOptions?.length > 0 ? (
              <>
                <Box maxHeight={500} overflow="auto">
                  <OptionList
                    Options={fetchOptions?.data?.answerOptions}
                    onEdit={handleAddNewRow}
                    onDelete={handleAddNewRow}
                    onReorder={handleAddNewRow}
                    onAdd={handleAddOption}
                    isAddingNew={showNewOptionForm}
                    setIsAddingNew={setShowNewOptionForm}
                    disableAddOption={selectedAnswerRange !== null}
                  />
                </Box>
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
                  />
                )}
              </>
            )}
          </Grid>
        </Grid>
        <Divider sx={{ my: 1, mt: 4 }} />

        <Box display="flex" flexDirection="column" gap={1} mt={4}>
          <Typography variant="semiBoldXLarge" gutterBottom>
            <Trans i18nKey="questionImpacts" />
          </Typography>
          <Typography variant="bodyMedium" color="textSecondary">
            <Trans i18nKey="optionsImpactsDescription" />
          </Typography>
        </Box>
        {fetchImpacts?.data?.attributeImpacts?.length > 0 ? (
          <>
            <Box maxHeight={500} overflow="auto">
              <AttributeImpactList
                attributeImpacts={fetchImpacts?.data?.attributeImpacts}
                attributes={fetchAttributeKit?.data?.items}
                maturityLevels={fetchMaturityLevels?.data?.items}
                questionId={question.id}
                isAddingNew={showNewImpactForm}
                setIsAddingNew={setShowNewImpactForm}
                handleDeleteImpact={handleDeleteImpact}
                handleEditImpact={handleEditImpact}
              />
            </Box>
            {showNewImpactForm && (
              <ImpactForm
                newItem={newImpact}
                handleInputChange={handleImpactInputChange}
                handleSave={handleSaveNewOption}
                handleCancel={handleCancelNewOption}
                attributes={fetchAttributeKit?.data?.items}
                maturityLevels={fetchMaturityLevels?.data?.items}
              />
            )}
          </>
        ) : (
          <>
            {showNewImpactForm ? (
              <ImpactForm
                newItem={newImpact}
                handleInputChange={handleImpactInputChange}
                handleSave={handleSaveNewOption}
                handleCancel={handleCancelNewOption}
                attributes={fetchAttributeKit?.data?.items}
                maturityLevels={fetchMaturityLevels?.data?.items}
              />
            ) : (
              <EmptyState
                btnTitle={"newOptionImpact"}
                title={"optionsImpactsEmptyState"}
                SubTitle={"optionsImpactsEmptyStateDetailed"}
                onAddNewRow={handleAddNewImpactRow}
                disabled={
                  fetchAttributeKit?.data?.items?.length === 0 ||
                  fetchOptions.data?.answerOptions?.length === 0
                }
                disableTextBox={<Trans i18nKey="optionsImpactsDisabled" />}
              />
            )}
          </>
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
        submitButtonLabel="editQuestion"
        type="create"
      />
    </CEDialog>
  );
};

export default QuestionDialog;
