import { FormControl, FormHelperText, InputLabel } from "@mui/material";
import { useState } from "react";
import { Controller, useFormContext } from "react-hook-form";
import getFieldError from "../../../utils/getFieldError";
import RichEditor from "../rich-editor/RichEditor";

const RichEditorField = (props: any) => {
  const { name, rules = {}, defaultValue, required = false, ...rest } = props;
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      rules={{ ...rules, required }}
      shouldUnregister={true}
      defaultValue={defaultValue}
      render={({ field, fieldState, formState }) => {
        return (
          <RichEditorFieldBase
            {...rest}
            name={name}
            required={required}
            field={field}
            defaultValue={defaultValue}
          />
        );
      }}
    />
  );
};

const RichEditorFieldBase = (props: any) => {
  const { defaultValue, name, field, required, label } = props;
  const [shrink, setShrink] = useState(() => (defaultValue ? true : false));
  const [focus, setFocus] = useState(false);

  const {
    formState: { errors },
  } = useFormContext();
  const { hasError, errorMessage } = getFieldError(errors, name);

  return (
    <FormControl
      fullWidth
      variant="outlined"
      onFocus={(e) => {
        if (e.target?.id === "proseMirror") {
          setFocus(true);
          setShrink(true);
        }
      }}
      onBlur={(e) => {
        if (!field?.value) {
          setFocus(false);
          setShrink(false);
          field.onBlur();
        }
      }}
      sx={{
        position: "relative",
        minHeight: "calc(100% + 8px)",
        "& .MuiInputBase-input": {
          marginTop: shrink ? 0 : 0.8,
        },
      }}
      error={hasError}
    >
      <InputLabel
        className={focus ? "Mui-focused" : ""}
        shrink={shrink}
        sx={{ background: "white", px: 0.2 }}
        required={required}
      >
        {label}
      </InputLabel>
      <RichEditor
        className={
          "MuiInputBase-input MuiOutlinedInput-input MuiInputBase-inputSizeSmall" +
          (focus ? " Mui-focused" : "") +
          (hasError ? " Mui-error" : "")
        }
        defaultValue={defaultValue}
        field={field}
      />
      <FormHelperText>{errorMessage as string}</FormHelperText>
    </FormControl>
  );
};

export default RichEditorField;
