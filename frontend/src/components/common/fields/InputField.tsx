import { Visibility, VisibilityOff } from "@mui/icons-material";
import InputAdornment from "@mui/material/InputAdornment";
import TextField, { OutlinedTextFieldProps } from "@mui/material/TextField";
import React, {
  ReactNode,
  useState,
  useRef,
  useEffect,
  ChangeEvent,
} from "react";
import { useFormContext } from "react-hook-form";
import getFieldError from "@utils/getFieldError";
import firstCharDetector from "@/utils/firstCharDetector";
import { customFontFamily } from "@/config/theme";
import {evidenceAttachmentInput} from "@utils/enumType";

const InputField = () => {
  return <TextField />;
};

interface IInputFieldUCProps extends Omit<OutlinedTextFieldProps, "variant"> {
  name: string;
  minLength?: number;
  maxLength?: number;
  isFocused?: boolean;
  pallet?: any;
  borderRadius?: string
  setValueCount?: any,
  hasCounter?: boolean,
  isFarsi?: boolean,
  isEditing?: boolean,
}

const InputFieldUC = (props: IInputFieldUCProps) => {
  const {
    name,
    required,
    InputLabelProps,
    type,
    minLength,
    maxLength,
    helperText,
    isFocused,
    pallet,
    borderRadius,
    setValueCount,
    hasCounter,
    isFarsi,
    isEditing,
    ...rest
  } = props;
  const inputRef = useRef<HTMLInputElement | null>(null);
  const {
    register,
    formState: { errors },
  } = useFormContext();
  const [showPassword, toggleShowPassword] = usePasswordFieldAdornment();
  const { hasError, errorMessage } = getFieldError(errors, name, minLength, maxLength);
  useEffect(() => {
    if (isFocused && inputRef.current) {
      inputRef?.current?.focus(); // Focus the input if isFocused prop is true
    }
  }, [isFocused]);
  useEffect(() => {
    if (inputRef.current && isFocused) {
      const inputValue = inputRef.current?.value;
      const isFarsi = firstCharDetector(inputValue);
      inputRef.current.style.direction = isFarsi ? "rtl" : "ltr";
      inputRef.current.style.fontFamily = isFarsi ? "VazirMatn" : customFontFamily;
      inputRef?.current?.focus();
    }
    if(inputRef.current && !isFocused){
      inputRef.current.style.direction = isFarsi ? "rtl" : "ltr";
      inputRef.current.style.fontFamily = isFarsi ? "VazirMatn" : customFontFamily;
    }
  }, [inputRef.current?.value,isFocused]);
  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
     setValueCount(event.target.value)
    if (type !== "password") {
      const isFarsi = firstCharDetector(event.target.value);
      event.target.dir = isFarsi ? "rtl" : "ltr";
      event.target.style.fontFamily = isFarsi ? "VazirMatn" : customFontFamily;
    }
    if (type === "password" && inputRef.current) {
      inputRef?.current?.focus();
    }
  };

  return (
    <TextField
      {...rest}
      {...register(name, { required, minLength, maxLength })}
      type={showPassword ? "text" : type}
      fullWidth
      size="small"
      variant="outlined"
      inputRef={inputRef}
      onChange={handleInputChange}
      sx={{
        background: pallet?.background,
        borderRadius: borderRadius,
        "& .MuiOutlinedInput-root": {
          "& fieldset": {
            borderColor: pallet?.borderColor,
            borderRadius: borderRadius,
          },
          "&:hover fieldset": {
            borderColor: pallet?.borderHover,
          },
          "&.Mui-focused fieldset": {
            borderColor: pallet?.borderColor,
          },
          paddingTop: isEditing && name ==  "evidenceDetail" ? evidenceAttachmentInput.paddingTop : "",
          paddingBottom: name ==  "evidence" ?  evidenceAttachmentInput.paddingBottom  :  ""
        },
      }}
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
          : {  style:hasCounter ? isFarsi ? {
                paddingLeft: 60,
                minHeight: "110px"
              }:{
                paddingRight: 60,
                minHeight: "110px"
              } : {} }
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
