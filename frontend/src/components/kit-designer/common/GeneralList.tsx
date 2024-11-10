import { useState } from "react";
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
import { KitDesignListItems } from "@types";
import { Trans } from "react-i18next";
import { theme } from "@config/theme";
import languageDetector from "@utils/languageDetector";

interface ListOfItemsProps {
  items: Array<KitDesignListItems>;
  onEdit: (id: any) => void;
  onReorder: (reorderedItems: KitDesignListItems[]) => void;
  deleteBtn: boolean;
  name: string;
  setOpenDeleteDialog: ({status: boolean, id: string}) => void;
}
interface ITempValues {
  title: string;
  description: string;
  weight: number | undefined;
  question: number | undefined;
}
const ListOfItems = ({
  items,
  onEdit,
  onReorder,
  deleteBtn,
  name,
  setOpenDeleteDialog
}: ListOfItemsProps) => {
  const [reorderedItems, setReorderedItems] = useState(items);
  const [editMode, setEditMode] = useState<number | null>(null);
  const [tempValues, setTempValues] = useState<ITempValues>({
    title: "",
    description: "",
    weight: 0,
    question: 0,
  });

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;

    const newReorderedItems = Array.from(reorderedItems);
    const [movedItem] = newReorderedItems.splice(result.source.index, 1);
    newReorderedItems.splice(result.destination.index, 0, movedItem);

    setReorderedItems(newReorderedItems);
    onReorder(newReorderedItems);
  };
  const handleEditClick = (item: KitDesignListItems) => {
    setEditMode(Number(item.id));
    setTempValues({
      title: item.title,
      description: item.description,
      weight: item.weight,
      question: item.questionsCount,
    });
  };

  const handleSaveClick = (item: KitDesignListItems) => {
    onEdit({
      ...item,
      title: tempValues.title,
      description: tempValues.description,
      weight: tempValues?.weight,
    });
    setEditMode(null);
  };

  const handleCancelClick = () => {
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

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Droppable droppableId="subjects">
        {(provided: any) => (
          <Box {...provided.droppableProps} ref={provided.innerRef}>
            {reorderedItems?.map((item, index) => (
              <Draggable
                key={item.id}
                draggableId={item.id.toString()}
                index={index}
              >
                {(provided: any) => (
                  <Box
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    mt={1.5}
                    p={1.5}
                    sx={{
                      backgroundColor:
                        editMode === item.id ? "#F3F5F6" : "#fff",
                      borderRadius: "8px",
                      border: "0.3px solid #73808c30",
                      display: "flex",
                      alignItems: "flex-start",
                      position: "relative",
                    }}
                  >
                    <Box
                      sx={{
                        ...styles.centerVH,
                        background: "#F3F5F6",
                        width: { xs: "50px", md: "64px" },
                        justifyContent: "space-around",
                      }}
                      borderRadius="0.5rem"
                      mr={2}
                      px={1.5}
                    >
                      <Typography variant="semiBoldLarge">
                        {index + 1}
                      </Typography>

                      <IconButton
                        disableRipple
                        disableFocusRipple
                        sx={{
                          "&:hover": {
                            backgroundColor: "transparent",
                            color: "inherit",
                          },
                        }}
                        size="small"
                      >
                        <SwapVertRoundedIcon fontSize="small" />
                      </IconButton>
                    </Box>

                    <Box
                      sx={{
                        flexGrow: 1,
                        display: "flex",
                        flexDirection: "column",
                        gap: "5px",
                      }}
                    >
                      {/* Title and icons in the same row */}
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        {editMode === item.id ? (
                          <TextField
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
                              width: { sx: "100%", md: "60%" },
                              background: "#fff",
                              borderRadius: "8px",
                            }}
                            name="title"
                            label={<Trans i18nKey="title" />}
                          />
                        ) : (
                          <Typography
                            variant="h6"
                            sx={{ flexGrow: 1, width: "80%" }}
                          >
                            {item.title}
                          </Typography>
                        )}

                        {editMode === item.id ? (
                          <Box
                            sx={{
                              mr: theme.direction == "rtl" ? "auto" : "unset",
                              ml: theme.direction == "ltr" ? "auto" : "unset",
                            }}
                          >
                            <IconButton
                              size="small"
                              onClick={() => handleSaveClick(item)}
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
                              onClick={() => handleEditClick(item)}
                              sx={{ mx: 1 }}
                              color="success"
                              data-testid="items-edit-icon"
                            >
                              <EditRoundedIcon fontSize="small" />
                            </IconButton>
                            {deleteBtn && (
                              <IconButton
                                size="small"
                                onClick={() => setOpenDeleteDialog({status:true,id: item.id})}
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
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                        }}
                      >
                        {editMode === item.id ? (
                          <TextField
                            required
                            value={tempValues.description}
                            onChange={(e) => handelChange(e)}
                            name="description"
                            inputProps={{
                              "data-testid": "items-description",
                            }}
                            variant="outlined"
                            fullWidth
                            size="small"
                            label={<Trans i18nKey="description" />}
                            margin="normal"
                            multiline
                            minRows={2}
                            maxRows={3}
                            sx={{
                              mb: 1,
                              mt: 1,
                              fontSize: 14,
                              "& .MuiInputBase-root": {
                                fontSize: 14,
                                overflow: "auto",
                              },
                              "& .MuiFormLabel-root": {
                                fontSize: 14,
                              },
                              background: "#fff",
                              borderRadius: "8px",
                              width: { xs: "100%", md: "85%" },
                            }}
                          />
                        ) : (
                          <Typography
                            sx={{
                              wordBreak: "break-word",
                              textAlign: languageDetector(item.description)
                                ? "right"
                                : "left",
                              width: "80%",
                            }}
                            variant="body2"
                            mt={1}
                          >
                            {item.description}
                          </Typography>
                        )}
                        {name === "subject" && (
                          <Box
                            sx={{
                              width: "fit-content",
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "flex-end",
                              flexDirection: "column",
                              gap: "0.5rem",
                              textAlign: editMode ? "end" : "center",
                            }}
                          >
                            <Typography
                              sx={{
                                ...theme.typography.labelCondensed,
                                color: "#6C8093",
                                width: "100%",
                              }}
                            >
                              <Trans i18nKey={"weight"} />
                            </Typography>

                            {editMode === item.id ? (
                              <TextField
                                required
                                value={tempValues.weight}
                                onChange={(e) => handelChange(e)}
                                name="weight"
                                variant="outlined"
                                fullWidth
                                size="small"
                                // label={<Trans i18nKey="weight" />}
                                margin="normal"
                                type="number"
                                inputProps={{
                                  style: { textAlign: "center", width: "40px" },
                                }}
                                sx={{
                                  mb: 1,
                                  mt: 1,
                                  fontSize: 14,
                                  "& .MuiInputBase-root": {
                                    fontSize: 14,
                                    overflow: "auto",
                                  },
                                  "& .MuiFormLabel-root": {
                                    fontSize: 14,
                                  },
                                  background: "#fff",
                                  borderRadius: "8px",
                                }}
                              />
                            ) : (
                              <Box
                                aria-label="weight"
                                style={{
                                  width: "3.75rem",
                                  height: "3.75rem",
                                  borderRadius: "50%", // برای دایره‌ای کردن دکمه
                                  backgroundColor: "#E2E5E9", // رنگ پس‌زمینه
                                  color: "#2B333B",
                                  display: "flex",
                                  alignItems: " center",
                                  justifyContent: "center",
                                }}
                              >
                                {item.weight}
                              </Box>
                            )}
                          </Box>
                        )}
                      </Box>
                    </Box>
                  </Box>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </Box>
        )}
      </Droppable>
    </DragDropContext>
  );
};

export default ListOfItems;
