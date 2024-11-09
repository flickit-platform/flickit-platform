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
import { t } from "i18next";

interface OptionValue {
  optionId: number;
  value: number;
}

interface Impact {
  questionImpactId: number;
  weight: number;
  maturityLevel: {
    maturityLevelId: number;
    title: string;
  };
  optionValues: OptionValue[];
}

interface AttributeImpact {
  attributeId: number;
  title: string;
  impacts: Impact[];
}

interface AttributeImpactListProps {
  attributeImpacts: AttributeImpact[];
}

const AttributeImpactList = ({
  attributeImpacts,
}: AttributeImpactListProps) => {
  const [editMode, setEditMode] = useState<number | null>(null);
  const [tempValues, setTempValues] = useState({ title: "", value: 0 });
  // const handleEditClick = (item: Impact) => {
  //   setEditMode(Number(item.id));
  //   setTempValues({ title: item.title, value: item.value });
  // };

  const handleSaveClick = (item: Impact) => {
    // onEdit({
    //   ...item,
    //   title: tempValues.title,
    //   value: tempValues.value,
    // });
    setEditMode(null);
  };

  const handleCancelClick = () => {
    setEditMode(null);
    setTempValues({ title: "", value: 0 });
  };
  return (
    <Box mt={2}>
      {attributeImpacts?.map((attribute) => (
        <Box key={attribute.attributeId} sx={{ mb: 2 }}>
          {attribute.impacts.map((item: Impact) => (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                py: 1.5,
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center" }}>
                {editMode === item.questionImpactId ? (
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
                  <Typography
                    variant="bodyLarge"
                    sx={{ ml: 2, fontWeight: "Bold" }}
                  >
                    {attribute.title}
                  </Typography>
                )}
                {editMode === item.questionImpactId ? (
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
                  <Typography variant="bodyLarge" sx={{ ml: 0.5 }}>
                    {t("impactsOn") + " " + item.maturityLevel.title}
                  </Typography>
                )}
              </Box>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                {editMode === item.questionImpactId ? (
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
                    label={t("weight") + ": " + item.weight}
                    color="primary"
                    size="small"
                    sx={{ ml: 2, fontSize: 12 }}
                  />
                )}

                {editMode === item.questionImpactId ? (
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
                      // onClick={() => handleEditClick(item)}
                      sx={{ ml: 1 }}
                    >
                      <EditRoundedIcon fontSize="small" />
                    </IconButton>
                    <IconButton
                      size="small"
                      // onClick={() => onDelete(item.questionImpactId)}
                      sx={{ ml: 1 }}
                    >
                      <DeleteRoundedIcon fontSize="small" />
                    </IconButton>
                  </>
                )}
              </Box>
            </Box>
            // <Box
            //   key={impact.questionImpactId}
            //   sx={{
            //     border: "1px solid #ddd",
            //     borderRadius: 2,
            //     p: 2,
            //     mb: 2,
            //     mt: 1,
            //   }}
            // >
            //   <Box
            //     sx={{
            //       display: "flex",
            //       alignItems: "center",
            //       justifyContent: "space-between",
            //     }}
            //   >
            //     <Typography variant="subtitle1">
            //       {t("impactsOn")} {impact.maturityLevel.title}
            //     </Typography>
            //     <Chip
            //       label={`${t("weight")}: ${impact.weight}`}
            //       color="primary"
            //       sx={{ mr: 1 }}
            //     />
            //   </Box>
            // </Box>
          ))}

          <Divider sx={{ mt: 2 }} />
        </Box>
      ))}
    </Box>
  );
};

export default AttributeImpactList;
