import { useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import Chip from "@mui/material/Chip";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { Add } from "@mui/icons-material";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import CheckRoundedIcon from "@mui/icons-material/CheckRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import { Trans } from "react-i18next";
import { t } from "i18next";
import ImpactForm from "./ImpactForm";
import { IAttribute, IMaturityLevel, IOption, TId } from "@/types";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import { useServiceContext } from "@/providers/ServiceProvider";
import { useQuery } from "@/utils/useQuery";
import { useParams } from "react-router-dom";

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
  attributes: IAttribute[];
  maturityLevels: IMaturityLevel[];
  questionId: TId;
  isAddingNew: boolean;
  setIsAddingNew: any;
  handleDeleteImpact: any;
  handleEditImpact: any;
}

const AttributeImpactList = ({
  attributeImpacts,
  attributes,
  maturityLevels,
  questionId,
  isAddingNew,
  setIsAddingNew,
  handleDeleteImpact,
  handleEditImpact,
}: AttributeImpactListProps) => {
  const { service } = useServiceContext();
  const { kitVersionId = "" } = useParams();
  const [editMode, setEditMode] = useState<number | null>(null);
  const [tempValues, setTempValues] = useState({
    questionId,
    attributeId: undefined,
    maturityLevelId: undefined,
    weight: 1,
  });

  const toggleEditMode = (id: number | null, item?: any, attribute?: any) => {
    if (id !== null && item && attribute) {
      setTempValues({
        questionId,
        attributeId: attribute?.attributeId || undefined,
        maturityLevelId: item?.maturityLevel?.maturityLevelId || undefined,
        weight: item.weight || 1,
      });
    }
    setEditMode(id);
  };

  const handleInputChange = (field: string, value: any) => {
    setTempValues((prev) => ({ ...prev, [field]: value }));
  };

  const handleSaveClick = async (item: Impact) => {
    handleEditImpact(tempValues, item);
    toggleEditMode(null);
  };

  const handleCancelClick = () => {
    toggleEditMode(null);
    setTempValues({
      questionId,
      attributeId: undefined,
      maturityLevelId: undefined,
      weight: 1,
    });
  };

  return (
    <Box mt={2}>
      {attributeImpacts.map((attribute) => (
        <Box
          key={attribute.attributeId}
          sx={{ mb: 2 }}
          paddingX={2}
          maxHeight={200}
          overflow="auto"
        >
          {attribute.impacts.map((item) => (
            <Box
              key={item.questionImpactId}
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                py: 1.5,
              }}
            >
              <ImpactDetails
                attribute={attribute}
                item={item}
                editMode={editMode}
                tempValues={tempValues}
                handleInputChange={handleInputChange}
                toggleEditMode={() =>
                  toggleEditMode(item.questionImpactId, item, attribute)
                }
                attributes={attributes}
                maturityLevels={maturityLevels}
              />

              <ActionButtons
                item={item}
                editMode={editMode === item.questionImpactId}
                onSave={() => handleSaveClick(item)}
                onCancel={handleCancelClick}
                onEdit={() =>
                  toggleEditMode(item.questionImpactId, item, attribute)
                }
                onDelete={() => handleDeleteImpact(item)}
              />
            </Box>
          ))}
          <Divider sx={{ mt: 2 }} />
        </Box>
      ))}

      {!isAddingNew && (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
          <Button
            onClick={() => setIsAddingNew(true)}
            variant="outlined"
            color="primary"
            size="small"
          >
            <Add fontSize="small" />
            <Trans i18nKey="newImpact" />
          </Button>
        </Box>
      )}
    </Box>
  );
};

// Rest of your components here

const ImpactDetails = ({
  attribute,
  item,
  editMode,
  tempValues,
  handleInputChange,
  toggleEditMode,
  attributes,
  maturityLevels,
}: any) => (
  <Box sx={{ display: "flex", alignItems: "center" }}>
    {editMode === item.questionImpactId ? (
      <>
        <Select
          value={tempValues.attributeId || ""}
          onChange={(e) => handleInputChange("attributeId", e.target.value)}
          variant="outlined"
          fullWidth
          size="small"
          sx={textFieldStyle}
        >
          {attributes?.map((attr: IAttribute) => (
            <MenuItem key={attr.id} value={attr.id}>
              {attr.title}
            </MenuItem>
          ))}
        </Select>

        <Select
          value={tempValues.maturityLevelId || ""}
          onChange={(e) => handleInputChange("maturityLevelId", e.target.value)}
          variant="outlined"
          size="small"
          sx={textFieldStyle}
        >
          {maturityLevels?.map((level: IMaturityLevel) => (
            <MenuItem key={level.id} value={level.id}>
              {level.title}
            </MenuItem>
          ))}
        </Select>

        <TextField
          type="number"
          required
          value={tempValues.weight}
          onChange={(e) => handleInputChange("weight", e.target.value)}
          variant="outlined"
          size="small"
          label={<Trans i18nKey="value" />}
          sx={textFieldStyle}
        />
      </>
    ) : (
      <>
        <Typography variant="bodyLarge" sx={{ ml: 2, fontWeight: "bold" }}>
          {attribute.title}
        </Typography>
        <Typography variant="bodyLarge" sx={{ ml: 0.5 }}>
          {t("impactsOn") + " " + item.maturityLevel.title}
        </Typography>
      </>
    )}
  </Box>
);

const ActionButtons = ({
  editMode,
  onSave,
  onCancel,
  onEdit,
  item,
  onDelete,
}: any) => {
  return (
    <Box sx={{ display: "flex", alignItems: "center" }}>
      <Chip
        label={`${t("weight")}: ${item.weight}`}
        color="primary"
        size="small"
        sx={{ ml: 2, fontSize: 12 }}
      />
      {editMode ? (
        <>
          <IconButton
            size="small"
            onClick={onSave}
            sx={{ ml: 1 }}
            color="success"
          >
            <CheckRoundedIcon fontSize="small" />
          </IconButton>
          <IconButton
            size="small"
            onClick={onCancel}
            sx={{ ml: 1 }}
            color="secondary"
          >
            <CloseRoundedIcon fontSize="small" />
          </IconButton>
        </>
      ) : (
        <>
          <IconButton size="small" onClick={onEdit} sx={{ ml: 1 }}>
            <EditRoundedIcon fontSize="small" />
          </IconButton>
          <IconButton size="small" sx={{ ml: 1 }} onClick={onDelete}>
            <DeleteRoundedIcon fontSize="small" />
          </IconButton>
        </>
      )}
    </Box>
  );
};

const textFieldStyle = {
  fontSize: 14,
  ml: 2,
  "& .MuiInputBase-root": { fontSize: 14, overflow: "auto" },
  "& .MuiFormLabel-root": { fontSize: 14 },
};

export default AttributeImpactList;
