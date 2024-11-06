import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Grid,
  TextField,
  Button,
  IconButton,
  Typography,
  Switch,
  Box,
} from "@mui/material";
import { Trans } from "react-i18next";
import { useForm, FormProvider } from "react-hook-form";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import { useServiceContext } from "@/providers/ServiceProvider";
import { IQuestionInfo } from "@/types";
import { useQuery } from "@/utils/useQuery";

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

  useEffect(() => {}, []);
  const [questionData, setQuestionData] = useState<any>(null);
  const formMethods = useForm({
    defaultValues: {
      title: question?.title || "",
      hint: question?.hint || "",
      options: question?.options || [{ text: "" }], // Default to an array with one empty option if none exist
      mayNotBeApplicable: question?.mayNotBeApplicable || false,
      advisable: question?.advisable || false,
    },
  });
  const { service } = useServiceContext();

  useEffect(() => {
    if (open && question.id) {
      fetchAttributeKit.query();
      console.log(fetchAttributeKit.data)
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
        index: 1, // Ensure index is included in the request payload
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

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box display="flex" alignItems="center">
          <Typography variant="h6">
            <Trans i18nKey="addNewQuestion" />
          </Typography>
        </Box>
      </DialogTitle>
      <DialogContent>
        <FormProvider {...formMethods}>
          <form onSubmit={formMethods.handleSubmit(onSubmit)}>
            {/* Section 1: Question and Options */}
            <Typography variant="subtitle1" gutterBottom>
              <Trans i18nKey="questionAndOptions" />
            </Typography>
            <Typography variant="body2" color="textSecondary">
              In this section, enter the question text and its options. You can
              also add a hint.
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  {...formMethods.register("title", { required: true })}
                  fullWidth
                  label="Question"
                  placeholder="Write the question here"
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  {...formMethods.register("hint")}
                  fullWidth
                  label="Hint"
                  placeholder="Leave a hint for assessors"
                />
              </Grid>
              <Grid item xs={12}>
                <Typography variant="body2">
                  <Trans i18nKey="answerOptions" />
                </Typography>
                {formMethods
                  .watch("options")
                  .map((option: any, index: number) => (
                    <Box display="flex" alignItems="center" mt={1} key={index}>
                      <TextField
                        //   {...formMethods.register(`options[${index}].text`)}
                        fullWidth
                        placeholder={`Option ${index + 1}`}
                        defaultValue={option.text}
                      />
                      <IconButton>
                        <CloseIcon />
                      </IconButton>
                    </Box>
                  ))}
                <Button
                  startIcon={<AddIcon />}
                  variant="outlined"
                  fullWidth
                  sx={{ mt: 2 }}
                  //   onClick={() =>
                  //     formMethods.setValue("options", [
                  //       ...formMethods.getValues("options"),
                  //       { text: "" },
                  //     ])
                  //   }
                >
                  <Trans i18nKey="newOption" />
                </Button>
              </Grid>
            </Grid>

            {/* Section 2: Options Impacts */}
            <Typography variant="subtitle1" gutterBottom sx={{ mt: 3 }}>
              <Trans i18nKey="optionsImpacts" />
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Impact indicates how options affect various attributes.
            </Typography>
            <Button variant="outlined" fullWidth sx={{ mt: 2 }} disabled>
              <Trans
                i18nKey="selectAttribute"
                disabled={fetchAttributeKit?.data?.items?.length === 0}
              />
            </Button>

            {/* Section 3: Advanced Settings */}
            <Typography variant="subtitle1" gutterBottom sx={{ mt: 3 }}>
              <Trans i18nKey="advancedSettings" />
            </Typography>
            <Typography variant="body2" color="textSecondary">
              In this section, you can make ancillary settings for the question.
            </Typography>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={6}>
                <Typography variant="body2">
                  <Trans i18nKey="notApplicable" />
                </Typography>
                <Switch
                  {...formMethods.register("mayNotBeApplicable")}
                  checked={formMethods.watch("mayNotBeApplicable")}
                />
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2">
                  <Trans i18nKey="notAdvisable" />
                </Typography>
                <Switch
                  {...formMethods.register("advisable")}
                  checked={formMethods.watch("advisable")}
                />
              </Grid>
            </Grid>
            <Box display="flex" justifyContent="space-between" p={2}>
              <Button onClick={onClose}>
                <Trans i18nKey="cancel" />
              </Button>
              <Button type="submit" variant="contained" color="primary">
                <Trans i18nKey="createQuestion" />
              </Button>
            </Box>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
};

export default QuestionDialog;
