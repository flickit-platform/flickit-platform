import { useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import Chip from "@mui/material/Chip";
import SwapVertRoundedIcon from "@mui/icons-material/SwapVertRounded";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import CheckRoundedIcon from "@mui/icons-material/CheckRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import TextField from "@mui/material/TextField";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { IOption } from "@/types";
import { Trans } from "react-i18next";

interface OptionListProps {
  Options: Array<IOption>;
  onEdit: (id: any) => void;
  onDelete: (id: any) => void;
  onReorder: (reorderedItems: IOption[]) => void;
}

const OptionList = ({
  Options,
  onEdit,
  onDelete,
  onReorder,
}: OptionListProps) => {
  const [reorderedItems, setReorderedItems] = useState(Options);
  const [editMode, setEditMode] = useState<number | null>(null);
  const [tempValues, setTempValues] = useState({ title: "", value: 0 });

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;

    const newReorderedItems = Array.from(reorderedItems);
    const [movedItem] = newReorderedItems.splice(result.source.index, 1);
    newReorderedItems.splice(result.destination.index, 0, movedItem);

    setReorderedItems(newReorderedItems);
    onReorder(newReorderedItems);
  };

  const handleEditClick = (item: IOption) => {
    setEditMode(Number(item.id));
    setTempValues({ title: item.title, value: item.value });
  };

  const handleSaveClick = (item: IOption) => {
    onEdit({
      ...item,
      title: tempValues.title,
      value: tempValues.value,
    });
    setEditMode(null);
  };

  const handleCancelClick = () => {
    setEditMode(null);
    setTempValues({ title: "", value: 0 });
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Droppable droppableId="Options">
        {(provided: any) => (
          <Box {...provided.droppableProps} ref={provided.innerRef}>
            {reorderedItems?.map((item, index) => (
              <Draggable
                key={item.id}
                draggableId={item.id.toString()}
                index={index}
              >
                {(provided: any) => (
                  <>
                    <Box
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        py: 1.5,
                      }}
                    >
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <Typography
                          variant="body2"
                          sx={{
                            ml: 1,
                            paddingInlineEnd: 1.5,
                            backgroundColor: "#F3F5F6",
                            borderRadius: "8px",
                          }}
                        >
                          <IconButton size="small">
                            <SwapVertRoundedIcon fontSize="small" />
                          </IconButton>
                          {`option ${index + 1}:`}
                        </Typography>
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
                              fontSize: 14,
                              ml: 2,
                              "& .MuiInputBase-root": {
                                fontSize: 14,
                                overflow: "auto",
                              },
                              "& .MuiFormLabel-root": {
                                fontSize: 14,
                              },
                            }}
                            label={<Trans i18nKey="title" />}
                          />
                        ) : (
                          <Typography variant="bodySmall" sx={{ ml: 2 }}>
                            {item?.title}
                          </Typography>
                        )}
                      </Box>

                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        {editMode === item.id ? (
                          <TextField
                            type="number"
                            required
                            value={tempValues?.value}
                            onChange={(e) =>
                              setTempValues({
                                ...tempValues,
                                value: Number(e.target.value),
                              })
                            }
                            variant="outlined"
                            size="small"
                            label={<Trans i18nKey="value" />}
                            sx={{
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
                          <Chip
                            label={item.value}
                            color="primary"
                            sx={{ ml: 2 }}
                          />
                        )}

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
                            >
                              <EditRoundedIcon fontSize="small" />
                            </IconButton>
                            <IconButton
                              size="small"
                              onClick={() => onDelete(item.id)}
                              sx={{ ml: 1 }}
                            >
                              <DeleteRoundedIcon fontSize="small" />
                            </IconButton>
                          </>
                        )}
                      </Box>
                    </Box>
                    <Divider />
                  </>
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

export default OptionList;
