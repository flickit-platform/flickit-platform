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
import { styles } from "@styles";
import { kitDesignListItems } from "@types";
import { Trans } from "react-i18next";
import {theme} from "@config/theme";
import {Button} from "@mui/material";
import languageDetector from "@utils/languageDetector";

interface ListOfItemsProps {
  items: Array<kitDesignListItems>;
  onEdit: (id: any) => void;
  onDelete: (id: any) => void;
  onReorder: (reorderedItems: kitDesignListItems[]) => void;
  deleteBtn: boolean
}

const ListOfItems = ({
  items,
  onEdit,
  onDelete,
  onReorder,
  deleteBtn
}: ListOfItemsProps) => {
  const [reorderedItems, setReorderedItems] = useState(items);
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

  const handleEditClick = (item: kitDesignListItems) => {
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
                      backgroundColor: editMode === item.id ? "#F3F5F6" : "#fff",
                      borderRadius: "8px",
                      border: "0.3px solid #73808c30",
                      display: "flex",
                      alignItems: "flex-start",
                      position: "relative",
                    }}
                  >
                    <Box
                      sx={{ ...styles.centerVH, background: "#F3F5F6",width:"64px",justifyContent:"space-around" }}
                      borderRadius="0.5rem"
                      mr={2}
                      px={1.5}
                    >
                      <Typography variant="semiBoldLarge">
                        {index + 1}
                      </Typography>

                      <IconButton disableRipple disableFocusRipple sx={{
                        '&:hover': {
                          backgroundColor: 'transparent',
                          color: 'inherit',
                        },
                      }} size="small">
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
                              width:"60%",
                              background:"#fff",
                              borderRadius:"8px"
                            }}
                            name="title"
                            label={<Trans i18nKey="title" />}
                          />
                        ) : (
                          <Typography variant="h6" sx={{ flexGrow: 1,width:"80%" }}>
                            {item.title}
                          </Typography>
                        )}

                        {/* Icons (Edit/Delete or Check/Close) */}
                        {editMode === item.id ? (
                          <Box sx={{
                            mr: theme.direction == "rtl" ? "auto" : "unset",
                            ml: theme.direction == "ltr" ?  "auto" : "unset"
                          }}>
                            <IconButton
                              size="small"
                              onClick={() => handleSaveClick(item)}
                              sx={{ mx: 1 }}
                              color="success"
                            >
                              <CheckRoundedIcon fontSize="small" />
                            </IconButton>
                            <IconButton
                              size="small"
                              onClick={handleCancelClick}
                              sx={{ mx: 1}}
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
                            >
                              <EditRoundedIcon fontSize="small" />
                            </IconButton>
                            {deleteBtn && <IconButton
                                size="small"
                                onClick={() => onDelete(item.id)}
                                sx={{ mx: 1 }}
                                color="secondary"
                            >
                              <DeleteRoundedIcon fontSize="small" />
                            </IconButton>
                            }
                          </>
                        )}
                      </Box>
                      <Box sx={{ display: "flex", alignItems: "center", justifyContent:"space-between" }}>
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
                            background:"#fff",
                            borderRadius:"8px",
                            width:"85%",
                          }}
                        />
                      ) : (
                        <Typography sx={{wordBreak:"break-word", textAlign:languageDetector(item.description) ? "right" : "left",width:"80%" }} variant="body2" mt={1}>
                          {item.description}
                        </Typography>
                      )}
                        <Box sx={{
                          width:"fit-content",
                          display:"flex",
                          justifyContent:"center",
                          alignItems:"flex-end",
                          flexDirection:"column",
                          gap:"0.5rem",
                          textAlign:"center"
                        }}>
                            <Typography sx={{
                              ...theme.typography.labelCondensed,
                              color:"#6C8093",
                              width:"100%"
                            }}>
                              <Trans i18nKey={"weight"} />
                            </Typography>
                            <Button
                                aria-label="weight"
                                style={{
                                  width:"3.75rem",
                                  height:"3.75rem",
                                  borderRadius: '50%',  // برای دایره‌ای کردن دکمه
                                  backgroundColor: '#E2E5E9',  // رنگ پس‌زمینه
                                  color: '#2B333B',
                                display:"inline-block"
                                }}
                            >
                              0
                            </Button>
                        </Box>
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