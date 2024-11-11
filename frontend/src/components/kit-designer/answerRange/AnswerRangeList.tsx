import React, { useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import SwapVertRoundedIcon from "@mui/icons-material/SwapVertRounded";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import CheckRoundedIcon from "@mui/icons-material/CheckRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import TextField from "@mui/material/TextField";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { styles } from "@styles";
import { KitDesignListItems, TId } from "@types";
import { Trans } from "react-i18next";
import { theme } from "@config/theme";
import languageDetector from "@utils/languageDetector";
import QuestionContainer from "@components/kit-designer/questionnaires/questions/QuestionContainer";
import QueryData from "@common/QueryData";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import { useQuery } from "@utils/useQuery";
import { useServiceContext } from "@providers/ServiceProvider";
import { useParams } from "react-router-dom";
import { ICustomError } from "@utils/CustomError";
import toastError from "@utils/toastError";
import { alpha, Button, CircularProgress } from "@mui/material";
import { debounce } from "lodash";
import EmptyStateQuestion from "@components/kit-designer/questionnaires/questions/EmptyStateQuestion";
import { Add } from "@mui/icons-material";
import EmptyStateOptions from "@components/kit-designer/answerRange/options/emptyStateOptions";
import Divider from "@mui/material/Divider";
import OptionContain from "@components/kit-designer/answerRange/options/optionsContain";
import Chip from "@mui/material/Chip";
import {t} from "i18next";

interface ListOfItemsProps {
  // items: Array<KitDesignListItems>;
  items: any;
  onEdit: (id: any) => void;
  onDelete: (id: any) => void;
  onReorder: (reorderedItems: KitDesignListItems[]) => void;
  deleteBtn: boolean;
  name: string;
  fetchQuery?: any;
}
interface ITempValues {
  title: string;
  description: string;
  weight: number | undefined;
  question: number | undefined;
}
interface IQuestion {
  advisable: boolean;
  hint: null | any;
  id: number;
  index: number;
  mayNotBeApplicable: boolean;
  title: string;
}

const ListOfItems = ({
  items,
  fetchQuery,
  onEdit,
  onDelete,
  onReorder,
  deleteBtn,
  name,
}: ListOfItemsProps) => {
  const fetchQuestionListKit = useQuery({
    service: (args, config) => service.fetchQuestionListKit(args, config),
    runOnMount: false,
  });
  const postQuestionsKit = useQuery({
    service: (args, config) => service.postQuestionsKit(args, config),
    runOnMount: false,
  });

  const deleteQuestionnairesKit = useQuery({
    service: (args, config) => service.deleteQuestionnairesKit(args, config),
    runOnMount: false,
  });

  const updateKitQuestionnaires = useQuery({
    service: (args, config) => service.updateKitQuestionnaires(args, config),
    runOnMount: false,
  });
  const [showNewQuestionForm, setShowNewQuestionForm] = useState<{
    [key: string]: boolean;
  }>({});
  const [reorderedItems, setReorderedItems] = useState(items);
  const [editMode, setEditMode] = useState<number | null>(null);
  const [tempValues, setTempValues] = useState<ITempValues>({
    title: "",
    description: "",
    weight: 0,
    question: 0,
  });
  const [expanded, setExpanded] = useState(false);
  const [questionnaireId, setQuestionnaireId] = useState(null);
  const [questionData, setQuestionData] = useState<IQuestion[]>([]);
  const { service } = useServiceContext();
  const { kitVersionId = "" } = useParams();
  const handleDragEnd = (result: any) => {
    if (!result.destination) return;

    const newReorderedItems = Array.from(reorderedItems);
    const [movedItem] = newReorderedItems.splice(result.source.index, 1);
    newReorderedItems.splice(result.destination.index, 0, movedItem);

    setReorderedItems(newReorderedItems);
    onReorder(newReorderedItems);
  };
  const handleEditClick = (e: any, item: KitDesignListItems) => {
    e.stopPropagation();
    setEditMode(Number(item.id));
    setTempValues({
      title: item.title,
      description: item.description,
      weight: item.weight,
      question: item.questionsCount,
    });
  };

  const handleSaveClick = (e: any, item: KitDesignListItems) => {
    e.stopPropagation();
    onEdit({
      ...item,
      title: tempValues.title,
      description: tempValues.description,
      weight: tempValues?.weight,
    });
    setEditMode(null);
  };

  const handleCancelClick = (e: any) => {
    e.stopPropagation();
    setEditMode(null);
    setTempValues({ title: "", description: "", weight: 0, question: 0 });
  };

  const handelChange = (e: any) => {
    const { name, value } = e.target;
    setTempValues({
      ...tempValues,
      [name]: value,
    });
  };

  const handelChangeAccordion =
    ({ id }: { id: TId }) =>
    async (event: React.SyntheticEvent, isExpanded: boolean) => {
      setExpanded(isExpanded);
      setQuestionnaireId(id as any);
      try {
        if (isExpanded) {
          const data = await fetchQuestionListKit.query({
            kitVersionId,
            questionnaireId: id,
          });
          setNewQuestion({
            title: "",
            index: data?.items.length + 1 || 1,
            value: data?.items.length + 1 || 1,
            id: null,
          });
          setQuestionData(data?.items);
        } else {
          handleCancel(id);
        }
      } catch (e) {
        const err = e as ICustomError;
        toastError(err);
      }
    };

  const debouncedHandleReorder = debounce(async (newOrder: any[]) => {
    try {
      const orders = newOrder.map((item, idx) => ({
        questionId: item.id,
        index: idx + 1,
      }));

      await service.changeQuestionsOrder(
        { kitVersionId },
        { questionOrders: orders, questionnaireId: questionnaireId },
      );
    } catch (e) {
      const err = e as ICustomError;
      toastError(err);
    }
  }, 2000);

  const handleReorder = (newOrder: any[]) => {
    debouncedHandleReorder(newOrder);
  };
  const handleQuestionDragEnd = (result: any) => {
    if (!result.destination) return;
    const updatedQuestions = Array.from(questionData);
    const [movedQuestion] = updatedQuestions.splice(result.source.index, 1);
    updatedQuestions.splice(result.destination.index, 0, movedQuestion);

    const reorderedQuestions = updatedQuestions.map((question, idx) => ({
      ...question,
      index: idx + 1,
    }));
    handleReorder(reorderedQuestions);
    setQuestionData(reorderedQuestions);
  };

  const handleAddNewQuestionClick = (id: any) => {
    setShowNewQuestionForm((prev) => ({
      ...prev,
      [id]: true,
    }));
  };

  const [newQuestion, setNewQuestion] = useState({
    title: "",
    index: 1,
    value: 1,
    id: null,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const parsedValue = name === "value" ? parseInt(value) || 1 : value;
    setNewQuestion((prev) => ({
      ...prev,
      [name]: parsedValue,
    }));
  };

  const handleSave = async (id: TId) => {
    try {
      const data = {
        kitVersionId,
        index: newQuestion.index,
        value: newQuestion.value,
        title: newQuestion.title,
        advisable: false,
        mayNotBeApplicable: false,
        questionnaireId: id,
      };
      handleCancel(id);

      await postQuestionsKit.query({ kitVersionId, data }).then(() => {
        fetchQuery.query();
      });
    } catch (e) {
      const err = e as ICustomError;
      toastError(err);
    }
  };

  const handleCancel = (id: TId) => {
    setShowNewQuestionForm((prev) => ({
      ...prev,
      [id]: false,
    }));
    setNewQuestion({
      title: "",
      index: fetchQuestionListKit.data?.items.length + 1 || 1,
      value: fetchQuestionListKit.data?.items.length + 1 || 1,
      id: null,
    });
  };

  return (

          <Box>
            {reorderedItems?.map((item, index) => (
                  <Box
                    mt={1.5}
                    sx={{
                      backgroundColor:
                        editMode === item.id ? "#F3F5F6" : "#fff",
                      borderRadius: "8px",
                      border: "0.3px solid #73808c30",
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    <Accordion
                      onChange={handelChangeAccordion(item)}
                      sx={{
                        boxShadow: "none",
                        "&:before": {
                          display: "none",
                        },
                      }}
                    >
                      <AccordionSummary
                        sx={{
                          backgroundColor:
                            editMode === item.id
                              ? "#F3F5F6"
                              : item.questionsCount == 0
                                ? alpha(theme.palette.error.main, 0.04)
                                : "#fff",
                          borderRadius:
                            questionData.length != 0 ? "8px" : "8px 8px 0 0",
                          border: "0.3px solid #73808c30",
                          display: "flex",
                          position: "relative",
                          margin: 0,
                          padding: 0,
                          "&.Mui-expanded": {
                            backgroundColor:
                              item.questionsCount == 0
                                ? alpha(theme.palette.error.main, 0.08)
                                : "#F3F5F6",
                          },
                          "& .MuiAccordionSummary-content": {
                            margin: 0,
                          },
                          "& .MuiAccordionSummary-content.Mui-expanded": {
                            margin: 0,
                          },
                        }}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "flex-start",
                            position: "relative",
                            pb: "1rem",
                            width: "100%",
                          }}
                          pt={1.5}
                          px={1.5}
                        >
                          <Box
                            sx={{
                              // flexGrow: 1,
                              display: "flex",
                              justifyContent: "space-between",
                              width: "100%",
                            }}
                          >
                            {/* Title and icons in the same row */}
                            <Box sx={{ display: "flex", alignItems: "center",justifyContent:"space-between",width:"100%" }}>
                              {editMode === item.id ? (
                                <TextField
                                  onClick={(e) => e.stopPropagation()}
                                  required
                                  value={tempValues.title}
                                  onChange={(e) => handelChange(e)}
                                  inputProps={{
                                    "data-testid": "items-title",
                                  }}
                                  variant="outlined"
                                  fullWidth
                                  size="small"
                                  sx={{
                                    mb: 1,
                                    fontSize: 14,
                                    "& .MuiInputBase-root": {
                                      fontSize: 14,
                                      overflow: "auto",
                                    },
                                    "& .MuiFormLabel-root": {
                                      fontSize: 14,
                                    },
                                    width: { sx: "100%", md: "40%" },
                                    background: "#fff",
                                    borderRadius: "8px",
                                  }}
                                  name="title"
                                  label={<Trans i18nKey="title" />}
                                />
                              ) : (
                                <Typography
                                  variant="h6"
                                  sx={{ flexGrow: 1, width: "40%" }}
                                >
                                  {item.title}
                                </Typography>
                              )}
                              <Box sx={{ width: "60%",px:3}}>
                                <Chip
                                    label={t("options") + " " + item.answerOptions.length}
                                    size="small"
                                    sx={{backgroundColor: "#EAF2FB", fontSize:14,py: 1.4 }}
                                />
                              </Box>
                              {/* Icons (Edit/Delete or Check/Close) */}
                              {editMode === item.id ? (
                                <Box
                                  sx={{
                                    display:"flex",
                                    mr:
                                      theme.direction == "rtl"
                                        ? "auto"
                                        : "unset",
                                    ml:
                                      theme.direction == "ltr"
                                        ? "auto"
                                        : "unset",
                                  }}
                                >
                                  <IconButton
                                    size="small"
                                    onClick={(e) => handleSaveClick(e, item)}
                                    sx={{ mx: 1 }}
                                    color="success"
                                    data-testid="items-check-icon"
                                  >
                                    <CheckRoundedIcon fontSize="small" />
                                  </IconButton>
                                  <IconButton
                                    size="small"
                                    onClick={handleCancelClick}
                                    sx={{ mx: 1 }}
                                    color="secondary"
                                  >
                                    <CloseRoundedIcon fontSize="small" />
                                  </IconButton>
                                </Box>
                              ) : (
                                <>
                                  <IconButton
                                    size="small"
                                    onClick={(e) => handleEditClick(e, item)}
                                    sx={{ mx: 1 }}
                                    color={
                                      item.questionsCount == 0
                                        ? "error"
                                        : "success"
                                    }
                                    data-testid="items-edit-icon"
                                  >
                                    <EditRoundedIcon fontSize="small" />
                                  </IconButton>
                                  {deleteBtn && (
                                    <IconButton
                                      size="small"
                                      onClick={() => onDelete(item.id)}
                                      sx={{ mx: 1 }}
                                      color="secondary"
                                      data-testid="items-delete-icon"
                                    >
                                      <DeleteRoundedIcon fontSize="small" />
                                    </IconButton>
                                  )}
                                </>
                              )}
                            </Box>
                          </Box>
                        </Box>
                      </AccordionSummary>
                      <AccordionDetails
                        sx={{
                          margin: 0,
                          padding: 0,
                          py: questionData.length != 0 ? "20px" : "unset",
                        }}
                      >
                        <Box sx={{
                          width:"100%",
                          height:36,
                          display: "flex",
                          alignItems:"center",
                          justifyContent:"flex-start",
                          px: "1rem",
                          color: "#6C8093",
                          ...theme.typography.semiBoldMedium
                        }}>
                          <Box
                            sx={{
                              width: { xs: "65px", md: "95px" },
                              textAlign:"center"
                          }}
                            mr={2}
                            px={0.2}
                          >index</Box>
                          <Box
                              sx={{ width: { xs: "50%", md: "60%" } }}
                          >Title</Box>
                          <Box
                          sx={{
                            width: { xs: "20%", md: "10%" },
                            textAlign:"center"
                          }}
                          >Value</Box>
                        </Box>
                        <Divider />
                          <>
                            {item?.answerOptions?.length >= 1 ? (
                              <>
                                <DragDropContext
                                  onDragEnd={handleQuestionDragEnd}
                                >
                                  <Droppable
                                    droppableId={`questions-${item.id}`}
                                  >
                                    {(provided) => (
                                      <Box
                                        {...provided.droppableProps}
                                        ref={provided.innerRef}
                                      >
                                        {item.answerOptions?.map(
                                          (answerOption: any, index: number) => (
                                            <Draggable
                                              key={answerOption.id}
                                              draggableId={answerOption.id.toString()}
                                              index={index}
                                            >
                                              {(provided) => (
                                                <Box
                                                  ref={provided.innerRef}
                                                  {...provided.draggableProps}
                                                  {...provided.dragHandleProps}
                                                  sx={{ marginBottom: 1 }}
                                                >
                                                  <OptionContain
                                                    fetchQuery={fetchQuery}
                                                    key={answerOption.id}
                                                    answerOption={answerOption}
                                                  />
                                                </Box>
                                              )}
                                            </Draggable>
                                          ),
                                        )}
                                        {provided.placeholder}
                                      </Box>
                                    )}
                                  </Droppable>
                                </DragDropContext>
                                {!showNewQuestionForm[item.id] && (
                                  <Box
                                    sx={{
                                      display: "flex",
                                      justifyContent: "center",
                                      mt: 2,
                                    }}
                                  >
                                    <Button
                                      size="small"
                                      variant="outlined"
                                      color="primary"
                                      onClick={() =>
                                        handleAddNewQuestionClick(item.id)
                                      }
                                    >
                                      <Add fontSize="small" />
                                      <Trans i18nKey="newQuestion" />
                                    </Button>
                                  </Box>
                                )}
                              </>
                            ) : (
                              <>
                                {!showNewQuestionForm[item.id] && (
                                  <EmptyStateOptions
                                    btnTitle={"addFirstQuestion"}
                                    title={"noQuestionHere"}
                                    SubTitle={"noQuestionAtTheMoment"}
                                    onAddNewRow={() =>
                                      handleAddNewQuestionClick(item.id)
                                    }
                                  />
                                )}
                              </>
                            )}
                          </>
                        {showNewQuestionForm[item.id] && (
                          <Box sx={{ mt: 2 }}>
                            {/*<QuestionForm*/}
                            {/*  newItem={newQuestion}*/}
                            {/*  handleInputChange={handleInputChange}*/}
                            {/*  handleSave={() => handleSave(item.id)}*/}
                            {/*  handleCancel={() => handleCancel(item.id)}*/}
                            {/*/>*/}
                          </Box>
                        )}
                      </AccordionDetails>
                    </Accordion>
                  </Box>
            ))}
          </Box>
  );
};

export default ListOfItems;
