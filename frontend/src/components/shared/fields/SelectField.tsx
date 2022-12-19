import FormControl from "@mui/material/FormControl";
import FormHelperText from "@mui/material/FormHelperText";
import InputLabel, { InputLabelProps } from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select, { SelectProps } from "@mui/material/Select";
import React from "react";
import { useFormContext, UseFormRegister } from "react-hook-form";
import getFieldError from "../../../utils/getFieldError";
import ColorLensRoundedIcon from "@mui/icons-material/ColorLensRounded";
import { Box } from "@mui/material";
import { styles } from "../../../config/styles";
import { LoadingSkeleton } from "../loadings/LoadingSkeleton";

const selectField = () => {
  return <div>selectField</div>;
};

interface ISelectFieldUC extends ISelectField {}

const SelectFieldUC = (props: ISelectFieldUC) => {
  const { name, ...rest } = props;

  const {
    register,
    formState: { errors },
  } = useFormContext();
  const { hasError, errorMessage } = getFieldError(errors, name);

  return (
    <SelectField
      {...rest}
      name={name}
      register={register}
      helperText={errorMessage as string}
      error={hasError}
    />
  );
};

interface ISelectField extends SelectProps {
  renderOption?: (option: any) => JSX.Element;
  InputLabelProps?: InputLabelProps;
  helperText?: string | JSX.Element | Element;
  options: any[];
  nullable?: boolean;
  name: string;
  size?: "small" | "medium" | undefined;
  loading?: boolean;
  renderLoading?: () => JSX.Element;
  error?: boolean;
  fetchOptions?: any;
  register?: UseFormRegister<any>;
}

export const SelectField = (props: ISelectField) => {
  const {
    name,
    required,
    InputLabelProps = {},
    helperText = null,
    defaultValue = "",
    label,
    options = [],
    nullable = true,
    size = "small",
    loading = false,
    renderOption = defaultRenderOption,
    renderLoading = defaultRenderLoading,
    fetchOptions,
    error,
    register,
    ...rest
  } = props;

  const selectOptions = nullable
    ? [{ id: "", title: "---" }, ...options]
    : options;

  return (
    <FormControl fullWidth error={error} size={size} variant="outlined">
      <InputLabel
        required={required}
        id={`select_label_id_${name}`}
        sx={{ backgroundColor: "white", pl: "4px", pr: "4px" }}
      >
        {label}
      </InputLabel>
      <Select
        {...rest}
        {...(register ? register(name, { required }) : {})}
        defaultValue={defaultValue}
        labelId={`select_label_id_${name}`}
        sx={{
          ...(rest?.sx || {}),
          "& .MuiSelect-select": { display: "flex", alignItems: "center" },
        }}
      >
        {loading
          ? renderLoading()
          : selectOptions.map((option: any) => {
              return renderOption(option);
            })}
      </Select>
      {helperText && <FormHelperText>{helperText as any}</FormHelperText>}
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

const defaultRenderOption = (option: any) => {
  return (
    <MenuItem
      value={option.id}
      key={option.id}
      sx={{ display: "flex", alignItems: "center" }}
    >
      {option.color_code ? <ColorOption value={option.color_code} /> : null}
      {option.title}
    </MenuItem>
  );
};

const defaultRenderLoading = () => {
  return [1, 2, 3, 4].map((index) => {
    return (
      <Box m={0.5} key={index}>
        <LoadingSkeleton sx={{ borderRadius: 1 }} height="36px" width="100%" />
      </Box>
    );
  });
};

export { selectField, SelectFieldUC };
