import FormControl from "@mui/material/FormControl";
import FormHelperText from "@mui/material/FormHelperText";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import React from "react";
import { useFormContext } from "react-hook-form";
import getFieldError from "../../utils/getFieldError";
import ColorLensRoundedIcon from "@mui/icons-material/ColorLensRounded";
import Box from "@mui/material/Box";
import { styles } from "../../config/styles";

const selectField = () => {
  return <div>selectField</div>;
};

const SelectFieldUC = (props: any) => {
  const {
    name,
    required,
    InputLabelProps,
    helperText,
    defaultValue = "",
    label,
    options = [],
    nullable = true,
    ...rest
  } = props;

  const selectOptions = nullable
    ? [{ id: "", title: "---" }, ...options]
    : options;
  const {
    register,
    formState: { errors },
  } = useFormContext();
  const { hasError, errorMessage } = getFieldError(errors, name);

  return (
    <FormControl fullWidth error={hasError} size="small" variant="outlined">
      <InputLabel
        required={required}
        id={`select_label_id_${name}`}
        sx={{ backgroundColor: "white", pl: "4px", pr: "4px" }}
      >
        {label}
      </InputLabel>
      <Select
        defaultValue={defaultValue}
        labelId={`select_label_id_${name}`}
        {...register(name, { required })}
        sx={{
          "& .MuiSelect-select": { display: "flex", alignItems: "center" },
        }}
      >
        {selectOptions.map((option: any) => {
          return (
            <MenuItem
              value={option.id}
              key={option.id}
              sx={{ display: "flex", alignItems: "center" }}
            >
              {option.color_code ? (
                <ColorOption value={option.color_code} />
              ) : null}
              {option.title}
            </MenuItem>
          );
        })}
      </Select>
      {(errorMessage || helperText) && (
        <FormHelperText>{errorMessage || helperText}</FormHelperText>
      )}
    </FormControl>
  );
};

const ColorOption = ({ value }: { value: string }) => {
  return (
    <Box sx={{ ...styles.centerVH }} color={value} mr={1}>
      <ColorLensRoundedIcon color="inherit" fontSize="small" />
    </Box>
  );
};

export { selectField, SelectFieldUC };
