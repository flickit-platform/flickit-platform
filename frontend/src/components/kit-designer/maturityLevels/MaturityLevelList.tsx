import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import SwapVertRoundedIcon from "@mui/icons-material/SwapVertRounded";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { styles } from "@/config/styles";
import { IMaturityLevel } from "@/types";

interface MaturityLevelListProps {
  maturityLevels: Array<IMaturityLevel>;
  onEdit: (id: any) => void;
  onDelete: (id: any) => void;
  onReorder: (reorderedItems: IMaturityLevel[]) => void; // Callback for reordering
}

const MaturityLevelList = ({
  maturityLevels,
  onEdit,
  onDelete,
  onReorder,
}: MaturityLevelListProps) => {
  const handleDragEnd = (result: any) => {
    if (!result.destination) return;

    const reorderedItems = Array.from(maturityLevels);
    const [movedItem] = reorderedItems.splice(result.source.index, 1);
    reorderedItems.splice(result.destination.index, 0, movedItem);

    onReorder(reorderedItems);
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Droppable droppableId="maturityLevels">
        {(provided: any) => (
          <Box {...provided.droppableProps} ref={provided.innerRef}>
            {maturityLevels?.map((item, index) => (
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
                      {...provided.dragHandleProps} // Drag handle for SwapVertRoundedIcon
                    >
                      <Typography variant="semiBoldLarge">
                        {item.index}
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
                      <Typography
                        variant="h6"
                        sx={{ display: "flex", alignItems: "center" }}
                      >
                        {item.title}
                        <Box
                          ml="auto"
                          sx={{ display: "flex", alignItems: "center" }}
                        >
                          <IconButton
                            size="small"
                            onClick={() => onEdit(item)}
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
                        </Box>
                      </Typography>

                      <Typography variant="body2" mt={1}>
                        {item.description}
                      </Typography>
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
