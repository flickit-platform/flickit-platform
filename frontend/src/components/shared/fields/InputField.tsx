import { Visibility, VisibilityOff } from "@mui/icons-material";
import InputAdornment from "@mui/material/InputAdornment";
import TextField, { OutlinedTextFieldProps } from "@mui/material/TextField";
import React, { ReactNode, useState } from "react";
import { useFormContext } from "react-hook-form";
import getFieldError from "../../../utils/getFieldError";

const InputField = () => {
  return <TextField />;
};

interface IInputFieldUCProps extends Omit<OutlinedTextFieldProps, "variant"> {
  name: string;
  minLength?: number;
}

const InputFieldUC = (props: IInputFieldUCProps) => {
  const {
    name,
    required,
    InputLabelProps,
    type,
    minLength,
    helperText,
    ...rest
  } = props;
  const {
    register,
    formState: { errors },
  } = useFormContext();
  const [showPassword, toggleShowPassword] = usePasswordFieldAdornment();
  const { hasError, errorMessage } = getFieldError(errors, name);

  return (
    <TextField
      {...rest}
      {...register(name, { required, minLength })}
      type={showPassword ? "text" : type}
      fullWidth
      size="small"
      variant="outlined"
      InputLabelProps={{ ...InputLabelProps, required }}
      InputProps={
        type === "password"
          ? {
              endAdornment: (
                <InputAdornment
                  sx={{ cursor: "pointer" }}
                  position="end"
                  onClick={toggleShowPassword}
                  onMouseDown={(e: any) => {
                    e.preventDefault();
                  }}
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </InputAdornment>
              ),
            }
          : {}
      }
      error={hasError}
      helperText={(errorMessage as ReactNode) || helperText}
    />
  );
};

export const usePasswordFieldAdornment: () => [boolean, () => void] = () => {
  const [showPassword, setShowPassword] = useState(false);

  const toggleShowPassword = () => {
    setShowPassword((state) => !state);
  };

  return [showPassword, toggleShowPassword];
};

export { InputFieldUC, InputField };
