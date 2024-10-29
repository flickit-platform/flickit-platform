import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Box,
  Typography,
  TextField
} from "@mui/material";
import SwapVertRoundedIcon from "@mui/icons-material/SwapVertRounded";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import AttributeForm from "./AttributeForm";

// Define types for Subject and Attribute
interface Attribute {
  id: string | number;
  title: string;
  description: string;
  subject: {
    id: number;
    title: string;
  };
  weight: number;
  index: number;
}

interface Subject {
  id: string | number;
  title: string;
  description: string;
}

interface SubjectTableProps {
  subjects: Subject[];
  initialAttributes: Attribute[];
  onAddAttribute: any;
  onReorder: (newOrder: Attribute[]) => void;
  handleCancel: any;
  handleSave: any;
  showNewAttributeForm: boolean;
  setNewAttribute: any;
  newAttribute: any;
}

const SubjectTable: React.FC<SubjectTableProps> = ({
  subjects,
  initialAttributes,
  onAddAttribute,
  onReorder,
  handleCancel,
  handleSave,
  showNewAttributeForm,
  setNewAttribute,
  newAttribute
}) => {
  const [attributes, setAttributes] = useState<Attribute[]>(initialAttributes);
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const parsedValue = name === "value" ? parseInt(value) || 1 : value;
    setNewAttribute((prev: any) => ({
      ...prev,
      [name]: parsedValue,
    }));
  };
  useEffect(() => {
    setAttributes(initialAttributes);
  }, [initialAttributes]);

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;

    const movedAttributeId = result.draggableId.split('-')[1];
    const movedAttribute = attributes.find(attr => String(attr.id) === movedAttributeId);

    if (!movedAttribute) return;

    const sourceSubjectId = result.source.droppableId;
    const destinationSubjectId = result.destination.droppableId;

    // Allow moving attributes between subjects
    const updatedAttributes = [...attributes.filter(attr => attr.id !== movedAttribute.id)];

    // Insert the moved attribute at the new position
    updatedAttributes.splice(result.destination.index, 0, {
      ...movedAttribute,
      subject: { id: Number(destinationSubjectId), title: "" } // Update the subject ID
    });

    setAttributes(updatedAttributes);
    // onReorder(updatedAttributes); // Notify parent of the reorder
  };

  const handleAddAttribute = (subjectId: string | number) => {
    const attribute = {
      id: Date.now(),
      title: newAttribute.title,
      description: newAttribute.description,
      subject: { id: subjectId, title: "" },
      weight: newAttribute.weight,
      index: 0,
    };
    onAddAttribute(subjectId, attribute);
    setNewAttribute({ title: "", description: "", weight: 1 });
  };


  return (
    <TableContainer>
      <DragDropContext onDragEnd={handleDragEnd}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Order</TableCell>
              <TableCell>Title</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Weight</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {subjects.map((subject, index) => (
              <React.Fragment key={subject.id}>
                <TableRow sx={{ background: "#F9F9F9", borderRadius: "0.5rem", mb: 1 }}>
                  <TableCell>
                    <Box
                      sx={{
                        display: "flex", alignItems: "center",
                        background: "#F3F5F6", borderRadius: "0.5rem", width: { xs: "50px", md: "64px" },
                        justifyContent: "space-around", px: 1.5
                      }}
                    >
                      <Typography variant="semiBoldLarge">{index + 1}</Typography>
                      <IconButton disableRipple disableFocusRipple size="small">
                        <SwapVertRoundedIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  </TableCell>
                  <TableCell>{subject.title}</TableCell>
                  <TableCell>{subject.description}</TableCell>
                  <TableCell />
                </TableRow>

                <Droppable droppableId={String(subject.id)} type="attribute">
                  {(provided) => (
                    <TableRow ref={provided.innerRef} {...provided.droppableProps}>
                      <TableCell colSpan={5}>
                        <Box>
                          {attributes.filter(attr => attr.subject.id === subject.id).map((attribute, attrIndex) => (
                            <Draggable
                              key={attribute.id}
                              draggableId={`attr-${attribute.id}`}
                              index={attrIndex}
                            >
                              {(provided) => (
                                <TableRow
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  sx={{ borderRadius: "0.5rem", mb: 1 }}
                                >
                                  <TableCell>
                                    <Box
                                      sx={{
                                        display: "flex", alignItems: "center",
                                        background: "#F3F5F6", borderRadius: "0.5rem", width: { xs: "50px", md: "64px" },
                                        justifyContent: "space-around", px: 1.5
                                      }}
                                    >
                                      <Typography variant="semiBoldLarge">{attrIndex + 1}</Typography>
                                      <IconButton disableRipple disableFocusRipple size="small">
                                        <SwapVertRoundedIcon fontSize="small" />
                                      </IconButton>
                                    </Box>
                                  </TableCell>
                                  <TableCell sx={{ pl: 3 }}>{attribute.title}</TableCell>
                                  <TableCell>{attribute.description}</TableCell>
                                  <TableCell>{attribute.weight}</TableCell>
                                </TableRow>
                              )}
                            </Draggable>
                          ))}
                          {provided.placeholder}
                          {subject.id === subjects[subjects.length - 1].id && showNewAttributeForm && (
                            <Draggable
                              draggableId={`new-attr`}
                              index={attributes.length}
                            >
                              {(provided) => (
                                <TableRow
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  sx={{ background: "#F9F9F9", borderColor: "white", borderRadius: "0.5rem", mb: 1 }}
                                >
                                  <TableCell colSpan={4}>
                                    <AttributeForm
                                      newAttribute={newAttribute}
                                      handleInputChange={handleInputChange}
                                      handleSave={() => handleSave(subject.id)}
                                      handleCancel={handleCancel}
                                    />
                                  </TableCell>
                                </TableRow>
                              )}
                            </Draggable>
                          )}
                        </Box>
                      </TableCell>
                    </TableRow>
                  )}
                </Droppable>
              </React.Fragment>
            ))}
          </TableBody>
        </Table>
      </DragDropContext>
    </TableContainer>
  );
};

export default SubjectTable;
