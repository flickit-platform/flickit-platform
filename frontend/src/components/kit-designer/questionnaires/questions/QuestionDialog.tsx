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

interface QuestionDialogProps {
  open: boolean;
  questionId: string;
  kitVersionId: string;
  onClose: () => void;
}

const QuestionDialog: React.FC<QuestionDialogProps> = ({
  open,
  questionId,
  kitVersionId,
  onClose,
}) => {
  const [questionData, setQuestionData] = useState<any>(null);
  const formMethods = useForm();
  const { service } = useServiceContext();

  useEffect(() => {
    if (open && questionId) {
    //   service
    //     .loadQuestionsKit({ kitVersionId, questionId })
    //     .then((response) => {
    //       setQuestionData(response.data);
    //       // Populate form with existing data if needed
    //       formMethods.reset(response.data);
    //     });
    }
  }, [open, questionId, kitVersionId, service, formMethods]);

  const onSubmit = async (data: any) => {
    try {
      await service.updateQuestionsKit({
        kitVersionId,
        questionId,
        data,
      });
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
                  {...formMethods.register("question", { required: true })}
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
                {/* Example option input fields */}
                <Box display="flex" alignItems="center" mt={1}>
                  <TextField {...formMethods.register("options[0]")} fullWidth placeholder="Option 1" />
                  <IconButton>
                    <CloseIcon />
                  </IconButton>
                </Box>
                <Box display="flex" alignItems="center" mt={1}>
                  <TextField {...formMethods.register("options[1]")} fullWidth placeholder="Option 2" />
                  <IconButton>
                    <CloseIcon />
                  </IconButton>
                </Box>
                <Button
                  startIcon={<AddIcon />}
                  variant="outlined"
                  fullWidth
                  sx={{ mt: 2 }}
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
            <Button variant="outlined" fullWidth sx={{ mt: 2 }}>
              <Trans i18nKey="selectAttribute" />
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
                <Switch {...formMethods.register("notApplicable")} />
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2">
                  <Trans i18nKey="notAdvisable" />
                </Typography>
                <Switch {...formMethods.register("notAdvisable")} />
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
