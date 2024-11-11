import React from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import { Trans } from "react-i18next";
import { IAttribute, IMaturityLevel, TId } from "@/types";

interface ImpactFormProps {
  newItem: {
    attributeId?: any;
    maturityLevelId?: any;
    weight: number;
    questionId: TId;
  };
  handleInputChange: any;
  handleSave: () => void;
  handleCancel: () => void;
  attributes: IAttribute[];
  maturityLevels: IMaturityLevel[];
}

export const dropdownStyle = {
  fullWidth: true,
  displayEmpty: true,
  backgroundColor: "#fff",
  fontSize: "14px"
};

const ImpactForm: React.FC<ImpactFormProps> = ({
  newItem,
  handleInputChange,
  handleSave,
  handleCancel,
  attributes,
  maturityLevels,
}) => {
  const handleSelectChange = (e: SelectChangeEvent<string>) => {
    const { name, value } = e.target;
    console.log(e.target)
    handleInputChange(name, value);
  };

  const handleTextFieldChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    handleInputChange(name, value);
  };

  return (
    <Box
      mt={1.5}
      p={1.5}
      sx={{
        backgroundColor: "#F3F5F6",
        borderRadius: "8px",
        border: "0.3px solid #73808c30",
        display: "flex",
        alignItems: "center",
        gap: 2,
      }}
    >
      {/* Attribute Dropdown */}
      <Select
        name="attributeId"
        value={newItem.attributeId || ""}
        onChange={handleSelectChange}
        sx={dropdownStyle}
        size="small"
        fullWidth
        displayEmpty
      >
        <MenuItem value="" disabled>
          <Trans i18nKey="selectAttribute" />
        </MenuItem>
        {attributes.map((attr) => (
          <MenuItem key={attr.id} value={attr.id}>
            {attr.title}
          </MenuItem>
        ))}
      </Select>

      {/* Maturity Level Dropdown */}
      <Select
        name="maturityLevelId"
        value={newItem.maturityLevelId || ""}
        onChange={handleSelectChange}
        sx={dropdownStyle}
        size="small"
        fullWidth
        displayEmpty
      >
        <MenuItem value="" disabled>
          <Trans i18nKey="selectMaturityLevel" />
        </MenuItem>
        {maturityLevels.map((level) => (
          <MenuItem key={level.id} value={level.id}>
            {level.title}
          </MenuItem>
        ))}
      </Select>

      {/* Weight Text Field */}
      <TextField
        required
        name="weight"
        label={<Trans i18nKey="weight" />}
        value={newItem.weight}
        onChange={handleTextFieldChange}
        fullWidth
        type="number"
        size="small"
        sx={{ mx: 1, backgroundColor: "#fff", textFieldStyle, width: "50%" }}
      />

      {/* Action Buttons */}
      <Box display="flex" alignItems="center">
        <IconButton size="small" color="primary" onClick={handleSave}>
          <CheckIcon />
        </IconButton>
        <IconButton size="small" color="secondary" onClick={handleCancel}>
          <CloseIcon />
        </IconButton>
      </Box>
    </Box>
  );
};

const textFieldStyle = {
  fontSize: 14,
  ml: 2,
  "& .MuiInputBase-root": { fontSize: 14, overflow: "auto" },
  "& .MuiFormLabel-root": { fontSize: 14 },
};

export default ImpactForm;
