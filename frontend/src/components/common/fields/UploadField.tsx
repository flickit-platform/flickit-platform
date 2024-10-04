import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import React, { useCallback, useEffect, useState } from "react";
import { Accept, DropEvent, FileRejection, useDropzone } from "react-dropzone";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import FormControl from "@mui/material/FormControl";
import FormHelperText from "@mui/material/FormHelperText";
import FormLabel from "@mui/material/FormLabel";
import ListItemIcon from "@mui/material/ListItemIcon";
import FilePresentRoundedIcon from "@mui/icons-material/FilePresentRounded";
import { styles } from "@styles";
import FileUploadRoundedIcon from "@mui/icons-material/FileUploadRounded";
import { TQueryServiceFunction, useQuery } from "@utils/useQuery";
import toastError from "@utils/toastError";
import { t } from "i18next";
import { ICustomError } from "@utils/CustomError";
import {
  Controller,
  ControllerRenderProps,
  FieldErrorsImpl,
  FieldValues,
  useFormContext,
} from "react-hook-form";
import formatBytes from "@utils/formatBytes";
import getFieldError from "@utils/getFieldError";
import { Trans } from "react-i18next";
import getFileNameFromSrc from "@utils/getFileNameFromSrc";
import { useServiceContext } from "@/providers/ServiceProvider";
import { theme } from "@/config/theme";

interface IUploadFieldProps {
  name: string;
  label: string | JSX.Element;
  required?: boolean;
  defaultValue?: any;
  accept?: Accept;
  maxSize?: number;
  uploadService?: TQueryServiceFunction<any, any>;
  deleteService?: TQueryServiceFunction<any, any>;
  hideDropText?: boolean;
  shouldFetchFileInfo?: boolean;
  defaultValueType?: string;
  param?: string;
  setSyntaxErrorObject?: any;
  setShowErrorLog?: any;
  setIsValid?: any;
}

const UploadField = (props: any) => {
  const { name, required, defaultValue, ...rest } = props;

  const formMethods = useFormContext();
  const { control } = formMethods;
  return (
    <Controller
      name={name}
      control={control}
      rules={{ required }}
      defaultValue={defaultValue}
      render={({ field, formState }) => {
        const { errors } = formState;
        return (
          <Uploader
            fieldProps={field}
            errors={errors}
            required={required}
            defaultValue={defaultValue}
            {...rest}
          />
        );
      }}
    />
  );
};

interface IUploadProps {
  fieldProps: ControllerRenderProps<FieldValues, string>;
  errors: FieldErrorsImpl<{
    [x: string]: any;
  }>;
  label: string | JSX.Element;
  accept?: Accept;
  maxSize?: number;
  required?: boolean;
  defaultValue?: any;
  uploadService?: TQueryServiceFunction<any, any>;
  deleteService?: TQueryServiceFunction<any, any>;
  hideDropText?: boolean;
  shouldFetchFileInfo?: boolean;
  defaultValueType?: string;
  param?: string;
  setSyntaxErrorObject?: any;
  setShowErrorLog?: any;
  setIsValid?: any;
  setButtonStep?: any;
  setZippedData?: any;
  dslGuide?: boolean;
  dropNewFile?: any;
  setConvertData?: any;
  disabled?: boolean;
}

const Uploader = (props: IUploadProps) => {
  const {
    fieldProps,
    errors,
    label,
    accept,
    maxSize,
    required,
    uploadService,
    deleteService,
    hideDropText,
    shouldFetchFileInfo = false,
    defaultValue = [],
    defaultValueType,
    param,
    setSyntaxErrorObject,
    setShowErrorLog,
    setIsValid,
    setButtonStep,
    disabled = false,
    setZippedData,
    setConvertData,
    dropNewFile,
  } = props;

  const { service } = useServiceContext();
  const defaultValueQuery = useQuery({
    service: (
      args = { url: defaultValue?.replace("https://flickit.org", "") },
      config,
    ) => service.fetchImage(args, config),
    runOnMount: false,
  });

  const setTheState = () => {
    if (!defaultValue) {
      return [];
    }
    if (typeof defaultValue === "string") {
      return [
        {
          src: defaultValue,
          name: getFileNameFromSrc(defaultValue),
          type: defaultValueType || "",
        },
      ] as { src: string; name: string; type: string }[];
    }
    console.warn("Type of default value must be array of strings");
    return [];
  };

  const [limitGuide, setLimitGuide] = useState<string>();
  const [myFiles, setMyFiles] =
    useState<(File | { src: string; name: string; type: string })[]>(
      setTheState,
    );

  useEffect(() => {
    if (maxSize) {
      setLimitGuide(
        t("maximumUploadFileSize", {
          maxSize: maxSize ? formatBytes(maxSize) : "2 MB",
        }) as string,
      );
    }
    if (
      typeof defaultValue === "string" &&
      defaultValue &&
      shouldFetchFileInfo
    ) {
      defaultValueQuery.query().then((data) => {
        const myFile = new File([data], "image.jpeg", { type: data.type });
        fieldProps.onChange(myFile);
      });
    }
  }, []);

  const uploadQueryProps = useQuery({
    service: uploadService || ((() => null) as any),
    runOnMount: false,
  });

  const deleteQueryProps = useQuery({
    service: deleteService || ((() => null) as any),
    runOnMount: false,
  });

  const onDrop = useCallback(
    (acceptedFiles: any, fileRejections: FileRejection[], event: DropEvent) => {
      delete errors[fieldProps.name];
      if (acceptedFiles?.[0]) {
        const reader = new FileReader();
        reader.onload = async () => {
          if (!uploadService) {
            setMyFiles(acceptedFiles);
            fieldProps.onChange(acceptedFiles?.[0]);
            return;
          }
          try {
            const res = await uploadQueryProps.query({
              file: acceptedFiles?.[0],
              expertGroupId: param,
            });
            setIsValid(true);
            setMyFiles(acceptedFiles);
            fieldProps.onChange(res);
          } catch (e: any) {
            const err = e as ICustomError;
            if (err?.response?.status === 422) {
              const responseObject = JSON.parse(err?.response?.data?.message);
              setShowErrorLog(true);
              setSyntaxErrorObject(responseObject.errors);
              setIsValid(false);
            }
            if (err?.response?.status !== 422) {
              if (e?.response?.data?.type == "application/json") {
                const blob = new Blob([err.response?.data as any], {
                  type: "application/json",
                }).text();
                blob.then((res: any) => {
                  toastError(JSON.parse(res)?.message);
                });
              } else {
                toastError(err);
              }
              setMyFiles([]);
              setIsValid(false);
              fieldProps.onChange("");
            }
          }
        };

        reader.readAsArrayBuffer(acceptedFiles[0]);
      }
    },
    [],
  );

  const { acceptedFiles, getRootProps, getInputProps } = useDropzone({
    accept,
    maxSize,
    onDrop,
    disabled: disabled,
    multiple: false,
    onDropRejected(rejectedFiles, event) {
      if (rejectedFiles.length > 0) {
        const error = rejectedFiles[0].errors.find(
          (e) => e.code === "file-too-large",
        );
        if (error) {
          errors[fieldProps.name] = {
            type: "maxSize",
            message: t("maximumUploadFileSize", {
              maxSize: maxSize ? formatBytes(maxSize) : "2 MB",
            }) as string,
          };
        } else {
          toastError(t("oneFileOnly") as string);
        }
      }
    },
    onError(err) {
      toastError(err.message);
    },
  });

  const file = myFiles?.[0] || fieldProps.value?.[0];

  const loading = uploadQueryProps.loading || deleteQueryProps.loading;
  const { errorMessage, hasError } = getFieldError(errors, fieldProps.name);

  return (
    <FormControl sx={{ width: "100%" }} error={hasError}>
      <Box
        sx={{
          minHeight: "40px",
          border: (t) =>
            `1px dashed ${hasError ? t.palette.error.main : "gray"}`,
          "&:hover": {
            border: (t) =>
              disabled
                ? `1px solid ${hasError ? t.palette.error.dark : "black"}`
                : "",
          },
          borderRadius: 1,
          cursor: disabled ? "default" : "pointer",
          width: "100%",
        }}
      >
        <Box minHeight={"40px"} display="flex" {...getRootProps()}>
          <input {...getInputProps()} name={fieldProps.name} />
          {file || loading ? (
            <List
              dense={true}
              sx={{ width: "100%" }}
              onClick={(e: any) => {
                loading && e.stopPropagation();
              }}
            >
              <ListItem
                disabled={loading}
                secondaryAction={
                  <Box
                    p={1}
                    sx={{ backgroundColor: "#ffffffc9", borderRadius: 1 }}
                  >
                    {loading && (
                      <IconButton edge="end">
                        <CircularProgress size="20px" />
                      </IconButton>
                    )}
                    {!loading && (
                      <IconButton
                        edge="end"
                        aria-label="delete"
                        onClick={async (e) => {
                          e.stopPropagation();
                          setMyFiles([]);
                          fieldProps.onChange("");
                          setButtonStep(0);
                          setZippedData(null);
                          setConvertData(null);
                          return;
                          // }
                          // if (uploadQueryProps.error) {
                          //   setMyFiles([]);
                          //   return;
                          // }
                          // const id =
                          //   uploadQueryProps.data?.id ||
                          //   fieldProps.value?.[0]?.id;
                          // if (!id) {
                          //   toastError(true);
                          //   return;
                          // }
                          // try {
                          //   await deleteQueryProps.query({
                          //     id,
                          //   });
                          //   setMyFiles([]);
                          //   fieldProps.onChange("");
                          // } catch (e) {
                          //   toastError(e as ICustomError);
                          // }
                        }}
                      >
                        <DeleteRoundedIcon fontSize="small" />
                      </IconButton>
                    )}
                  </Box>
                }
              >
                <ListItemIcon
                  sx={{
                    minWidth: "20px",
                    maxWidth: "40px",
                    maxHeight: "40px",
                    overflow: "hidden",
                    marginRight: theme.direction === "ltr" ? 1.5 : "unset",
                    marginLeft: theme.direction === "rtl" ? 1.5 : "unset",
                    display: { xs: "none", sm: "inline-flex" },
                  }}
                >
                  {file?.type?.includes("image") ? (
                    <Box
                      sx={{
                        maxWidth: "100%",
                        maxHeight: "100%",
                        objectFit: "contain",
                      }}
                      component="img"
                      src={
                        (file as any).src || URL.createObjectURL(file as any)
                      }
                      alt={file.name}
                      title={file.name}
                    />
                  ) : (
                    <FilePresentRoundedIcon />
                  )}
                </ListItemIcon>
                <ListItemText
                  title={`${((dropNewFile && dropNewFile[0]) || acceptedFiles[0] || file)?.name} - ${
                    (
                      (dropNewFile && dropNewFile[0]) ||
                      acceptedFiles[0] ||
                      file
                    )?.size
                      ? formatBytes((acceptedFiles[0] || file)?.size)
                      : ""
                  }`}
                  primaryTypographyProps={{
                    sx: { ...styles.ellipsis, width: "95%" },
                  }}
                  primary={
                    <>
                      {
                        (
                          (dropNewFile && dropNewFile[0]) ||
                          acceptedFiles[0] ||
                          file
                        )?.name
                      }
                    </>
                  }
                  secondary={
                    <>
                      {(
                        (dropNewFile && dropNewFile[0]) ||
                        acceptedFiles[0] ||
                        file
                      )?.size
                        ? formatBytes(
                            (
                              (dropNewFile && dropNewFile[0]) ||
                              acceptedFiles[0] ||
                              file
                            )?.size,
                          )
                        : null}
                    </>
                  }
                />
              </ListItem>
            </List>
          ) : (
            <>
              <FormLabel
                sx={{
                  ...styles.centerV,
                  pl: 2,
                  height: "40px",
                  fontSize: "1rem",
                  cursor: "pointer",
                }}
                required={required}
              >
                {label}
              </FormLabel>
              <Box
                sx={{
                  px: 2,
                  ...styles.centerV,
                  color: (t) => t.palette.info.dark,
                }}
                ml={theme.direction === "rtl" ? "unset" : "auto"}
                mr={theme.direction !== "rtl" ? "unset" : "auto"}
              >
                <FileUploadRoundedIcon sx={{ mr: hideDropText ? 0 : 1 }} />
                {!hideDropText && (
                  <>
                    {" "}
                    <Trans i18nKey="dropYourFileHere" />
                  </>
                )}
              </Box>
            </>
          )}
        </Box>
      </Box>
      <FormHelperText>{limitGuide || (errorMessage as string)}</FormHelperText>
    </FormControl>
  );
};

export default UploadField;
