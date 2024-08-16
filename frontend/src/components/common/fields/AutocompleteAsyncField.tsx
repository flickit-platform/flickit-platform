import React, { ReactNode, useEffect, useRef, useState, useMemo } from "react";
import Autocomplete, { AutocompleteProps } from "@mui/material/Autocomplete";
import throttle from "lodash/throttle";
import TextField from "@mui/material/TextField";
import { TQueryServiceFunction, useQuery } from "@utils/useQuery";
import {
  Controller,
  ControllerRenderProps,
  RegisterOptions,
  useFormContext,
} from "react-hook-form";
import getFieldError from "@utils/getFieldError";
import { useServiceContext } from "@providers/ServiceProvider";
import Box from "@mui/material/Box";
import { LoadingSkeleton } from "../loadings/LoadingSkeleton";
import forLoopComponent from "@utils/forLoopComponent";
import ErrorDataLoading from "../errors/ErrorDataLoading";
import { styles } from "@styles";
import { TQueryProps } from "@types";
import LoadingButton from "@mui/lab/LoadingButton";
import { filter } from "lodash";

type TUnionAutocompleteAndAutocompleteAsyncFieldBase = Omit<
  IAutocompleteAsyncFieldBase,
  "serviceQueryData" | "field"
>;

interface IAutocompleteAsyncFieldProps
  extends TUnionAutocompleteAndAutocompleteAsyncFieldBase {
  rules?: Omit<
    RegisterOptions<any, any>,
    "valueAsNumber" | "valueAsDate" | "setValueAs" | "disabled"
  >;
  filterFields?: string[];
  createItemQuery?: any;
  setError?: any;
}

const AutocompleteAsyncField = (
  props: IAutocompleteAsyncFieldProps & Omit<TQueryProps, "data">
) => {
  const {
    name,
    rules = {},
    multiple,
    defaultValue = multiple ? undefined : null,
    required = false,
    hasAddBtn = false,
    editable = false,
    filterFields = ["title"],
    createItemQuery,
    setError,
    ...rest
  } = props;
  const { control, setValue } = useFormContext();
  const { options } = rest;
  return (
    <Controller
      name={name}
      control={control}
      rules={{ ...rules, required }}
      shouldUnregister={true}
      defaultValue={defaultValue}
      render={({ field, fieldState, formState }) => {
        return (
          <AutocompleteBaseField
            {...rest}
            multiple={multiple}
            name={name}
            required={required}
            field={field}
            defaultValue={defaultValue}
            editable={editable}
            hasAddBtn={hasAddBtn}
            filterFields={filterFields}
            createItemQuery={createItemQuery}
            setError={setError}
          />
        );
      }}
    />
  );
};

interface IAutocompleteAsyncFieldBase
  extends Omit<AutocompleteProps<any, any, any, any>, "renderInput"> {
  field: ControllerRenderProps<any, any>;
  formatRequest?: (request: any) => any;
  name: string;
  helperText?: ReactNode;
  label: string | JSX.Element;
  filterSelectedOption?: (options: readonly any[], value: any) => any[];
  required?: boolean;
  searchOnType?: boolean;
  editable?: boolean;
  hasAddBtn?: boolean;
  filterFields?: string[];
  filterOptionsByProperty?: (option: any) => boolean;
  createItemQuery?: any;
  setError?: any;
}

const AutocompleteBaseField = (
  props: IAutocompleteAsyncFieldBase & Omit<TQueryProps, "data">
) => {
  const {
    editable,
    field,
    formatRequest = (request) => request,
    helperText,
    label,
    getOptionLabel = (option) =>
      typeof option === "string" ? option : option?.[filterFields[0]] || null,
    filterSelectedOption = (options: readonly any[], value: any): any[] =>
      value
        ? options.filter((option) => option?.id != value?.id)
        : (options as any[]),
    renderOption,
    noOptionsText,
    required,
    loaded,
    loading,
    error,
    options: optionsData,
    query,
    errorObject,
    abortController,
    defaultValue,
    hasAddBtn,
    searchOnType = true,
    multiple,
    filterFields = ["title"],
    filterOptionsByProperty = () => true,
    createItemQuery,
    setError,
    ...rest
  } = props;
  const { name, onChange, ref, value, ...restFields } = field;
  const {
    formState: { errors },
    setValue,
  } = useFormContext();
  const isFirstFetchRef = useRef(true);
  const { hasError, errorMessage } = getFieldError(errors, name);
  const { service } = useServiceContext();
  const createSpaceQueryData = useQuery({
    service: (args, config) => service.createSpace(args, config),
    runOnMount: false,
  });

  const [inputValue, setInputValue] = useState(
    () => getOptionLabel(defaultValue) || ""
  );
  const [options, setOptions] = useState<any[]>([]);
  const fetch = useMemo(
    () =>
      throttle((request: any) => {
        query?.({ query: formatRequest(request) });
      }, 800),
    []
  );
  const createSpaceQuery = async (option: any) => {
    try {
      setOpen(false);
      const newOption: any = await createItemQuery(inputValue);
      setOptions((prevOptions) => [...prevOptions, newOption]);
      onChange(newOption);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    if (!searchOnType && !isFirstFetchRef.current) {
      return;
    }

    if (getOptionLabel(value) === inputValue) {
      fetch("");
    } else {
      fetch(inputValue);
    }
    isFirstFetchRef.current = false;
  }, [inputValue, fetch]);

  useEffect(() => {
    let active = true;
    if (loaded && active) {
      const opt = filterSelectedOption(optionsData, value);
      setOptions(opt);
      defaultValue && onChange(defaultValue);
    }
    return () => {
      active = false;
    };
  }, [loaded]);

  const getFilteredOptions = (options: any[], params: any) => {
    return options
      .filter(filterOptionsByProperty)
      .filter((option) =>
        filterFields.some((field) =>
          String(option[field])
            ?.toLowerCase()
            ?.includes(params.inputValue.toLowerCase())
        )
      );
  };

  const loadingButtonRef = useRef<HTMLButtonElement | null>(null);
  useEffect(() => {
    const handleKeyDown = (event: any) => {
      if (event?.key === "Enter") {
        event.preventDefault();

        if (loadingButtonRef.current && inputValue && hasAddBtn) {
          loadingButtonRef.current.click();
          setOpen(false);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [inputValue, hasAddBtn]);
  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    // setOpen(true);
  };

  return (
    <Autocomplete
      {...restFields}
      defaultValue={defaultValue}
      value={value || (multiple ? undefined : null)}
      multiple={multiple}
      loading={loading}
      open={open}
      onOpen={handleOpen}
      onClose={handleClose}
      loadingText={
        options.length > 5 ? <LoadingComponent options={options} /> : undefined
      }
      size="small"
      autoHighlight
      getOptionLabel={getOptionLabel}
      options={(() => {
        if (error) {
          return [{}];
        } else if (editable) {
          return options.filter(
            (option: any) =>
              !value.some((selectedOpts: any) => selectedOpts.id === option.id)
          );
        } else {
          return options;
        }
      })()}
      autoComplete
      disablePortal={false}
      includeInputInList
      filterSelectedOptions={true}
      filterOptions={(options, params) => {
        const filtered = getFilteredOptions(options, params);

        if (
          params.inputValue !== "" &&
          !filtered.some(
            (option) => getOptionLabel(option) === params.inputValue
          ) &&
          hasAddBtn
        ) {
          filtered.push({
            inputValue: params.inputValue,
            title: `Add "${params.inputValue}"`,
          });
        }

        return filtered;
      }}
      onBlur={() => {
        setOpen(false);
      }}
      onChange={(event: any, newValue: any | null) => {
        if (newValue && newValue.inputValue) {
          // handle the case where the "Add" button is clicked
          onChange({ [filterFields[0]]: newValue.inputValue });
        } else {
          onChange(newValue);
          setOpen(false);
        }
      }}
      onInputChange={(event: any, newInputValue) => {
        if (event?.key === "Enter") return;
        setInputValue(newInputValue);
        if (setError) {
          setError(undefined);
        }
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          InputLabelProps={{ required, ...params.InputLabelProps }}
          label={label}
          fullWidth
          inputRef={ref}
          error={hasError || errorObject?.response?.data.message}
          helperText={
            (errorMessage as ReactNode) ||
            errorObject?.response?.data.message ||
            helperText
          }
          name={name}
        />
      )}
      renderOption={(props, option) =>
        option.inputValue ? (
          <li {...props}>
            <LoadingButton
              fullWidth
              onClick={createSpaceQuery}
              sx={{ justifyContent: "start", textTransform: "none" }}
              ref={loadingButtonRef}
            >
              Add "{option.inputValue}"
            </LoadingButton>
          </li>
        ) : (
          <li {...props}>{option?.[filterFields[0]]}</li>
        )
      }
      noOptionsText={
        error ? (
          <Box sx={{ ...styles.centerVH }}>
            <ErrorDataLoading />
          </Box>
        ) : (
          noOptionsText
        )
      }
      {...rest}
    />
  );
};

const LoadingComponent = ({ options }: { options: readonly any[] }) => {
  return (
    <Box display="flex" flexDirection="column" m={-1}>
      {forLoopComponent(options.length, (index) => (
        <LoadingSkeleton
          width="100%"
          height="36px"
          sx={{ my: 0.3, borderRadius: 1 }}
          key={index}
        />
      ))}
    </Box>
  );
};

export const useConnectAutocompleteField = <T extends any = any>(props: {
  service: TQueryServiceFunction<T>;
  accessor?: string;
}) => {
  const { service, accessor = "items" } = props;
  const serviceQueryData = useQuery({
    service,
    runOnMount: false,
    initialData: [],
    accessor,
  });

  const { data: options, ...rest } = serviceQueryData;
  return { ...rest, options };
};

export default AutocompleteAsyncField;
