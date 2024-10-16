import { useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import SwapVertRoundedIcon from "@mui/icons-material/SwapVertRounded";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import CheckRoundedIcon from "@mui/icons-material/CheckRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import TextField from "@mui/material/TextField";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { styles } from "@/config/styles";
import { IMaturityLevel } from "@/types";
import { Trans } from "react-i18next";

interface MaturityLevelListProps {
  maturityLevels: Array<IMaturityLevel>;
  onEdit: (id: any) => void;
  onDelete: (id: any) => void;
  onReorder: (reorderedItems: IMaturityLevel[]) => void;
}

const MaturityLevelList = ({
  maturityLevels,
  onEdit,
  onDelete,
  onReorder,
}: MaturityLevelListProps) => {
  const [reorderedItems, setReorderedItems] = useState(maturityLevels);
  const [editMode, setEditMode] = useState<number | null>(null);
  const [tempValues, setTempValues] = useState({ title: "", description: "" });

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;

    const newReorderedItems = Array.from(reorderedItems);
    const [movedItem] = newReorderedItems.splice(result.source.index, 1);
    newReorderedItems.splice(result.destination.index, 0, movedItem);

    setReorderedItems(newReorderedItems);
    onReorder(newReorderedItems);
  };

  const handleEditClick = (item: IMaturityLevel) => {
    setEditMode(Number(item.id));
    setTempValues({ title: item.title, description: item.description });
  };

  const handleSaveClick = (item: IMaturityLevel) => {
    onEdit({
      ...item,
      title: tempValues.title,
      description: tempValues.description,
    });
    setEditMode(null);
  };

  const handleCancelClick = () => {
    setEditMode(null);
    setTempValues({ title: "", description: "" });
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Droppable droppableId="maturityLevels">
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
                      backgroundColor: "gray.100",
                      borderRadius: "8px",
                      border: "0.3px solid #73808c30",
                      display: "flex",
                      alignItems: "flex-start",
                      position: "relative",
                    }}
                  >
                    <Box
                      sx={{ ...styles.centerCVH, background: "#F3F5F6" }}
                      borderRadius="0.5rem"
                      mr={2}
                      p={0.25}
                    >
                      <Typography variant="semiBoldLarge">
                        {index + 1}
                      </Typography>
                      <Divider
                        orientation="horizontal"
                        flexItem
                        sx={{ mx: 1 }}
                      />
                      <IconButton size="small">
                        <SwapVertRoundedIcon fontSize="small" />
                      </IconButton>
                    </Box>

                    <Box sx={{ flexGrow: 1 }}>
                      {/* Title and icons in the same row */}
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        {editMode === item.id ? (
                          <TextField
                            required
                            value={tempValues.title}
                            onChange={(e) =>
                              setTempValues({
                                ...tempValues,
                                title: e.target.value,
                              })
                            }
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
                            }}
                            name="title"
                            label={<Trans i18nKey="title" />}
                          />
                        ) : (
                          <Typography variant="h6" sx={{ flexGrow: 1 }}>
                            {item.title}
                          </Typography>
                        )}

                        {/* Icons (Edit/Delete or Check/Close) */}
                        {editMode === item.id ? (
                          <>
                            <IconButton
                              size="small"
                              onClick={() => handleSaveClick(item)}
                              sx={{ ml: 1 }}
                              color="success"
                            >
                              <CheckRoundedIcon fontSize="small" />
                            </IconButton>
                            <IconButton
                              size="small"
                              onClick={handleCancelClick}
                              sx={{ ml: 1 }}
                              color="secondary"
                            >
                              <CloseRoundedIcon fontSize="small" />
                            </IconButton>
                          </>
                        ) : (
                          <>
                            <IconButton
                              size="small"
                              onClick={() => handleEditClick(item)}
                              sx={{ ml: 1 }}
                              color="success"
                            >
                              <EditRoundedIcon fontSize="small" />
                            </IconButton>
                            <IconButton
                              size="small"
                              onClick={() => onDelete(item.id)}
                              sx={{ ml: 1 }}
                              color="secondary"
                            >
                              <DeleteRoundedIcon fontSize="small" />
                            </IconButton>
                          </>
                        )}
                      </Box>

                      {editMode === item.id ? (
                        <TextField
                          required
                          value={tempValues.description}
                          onChange={(e) =>
                            setTempValues({
                              ...tempValues,
                              description: e.target.value,
                            })
                          }
                          name="description"
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
                          }}
                        />
                      ) : (
                        <Typography variant="body2" mt={1}>
                          {item.description}
                        </Typography>
                      )}
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

export default MaturityLevelList;
