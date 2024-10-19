import React, { useRef, useState } from "react";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import TextField from "@mui/material/TextField";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import { Trans } from "react-i18next";
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";
import TableContainer from "@mui/material/TableContainer";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import TableBody from "@mui/material/TableBody";
import Grid from "@mui/material/Grid";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import { CEDialog, CEDialogActions } from "@common/dialogs/CEDialog";
import FormProviderWithForm from "@common/FormProviderWithForm";
import { styles } from "@styles";
import { useForm } from "react-hook-form";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import { toast } from "react-toastify";
import { ICustomError } from "@utils/CustomError";
import toastError from "@utils/toastError";
import { t } from "i18next";
import { useServiceContext } from "@providers/ServiceProvider";
import { useParams } from "react-router-dom";
import { useQuery } from "@utils/useQuery";
import Avatar from "@mui/material/Avatar";
import stringAvatar from "@utils/stringAvatar";
import Select from "@mui/material/Select";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import MenuItem from "@mui/material/MenuItem";
import { theme } from "@config/theme";

export default function MemberList(props: any) {
  const { title, btnLabel, listOfUser, columns, query, hasBtn } = props;
  const { openEGModal, setOpenEGModal, deleteEGMember, onCloseEGModal } =
    useEGPermision({ query });
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
        px: { xs: "15px", sm: "51px" },
        mb: "2rem",
      }}
      gap={2}
      textAlign="center"
      height={"auto"}
      minHeight={"350px"}
      width={"100%"}
      bgcolor={"#FFF"}
      borderRadius={"40.53px"}
      py={"32px"}
    >
      <Box height={"100%"} width={"100%"}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            position: "relative",
            width: "90%",
            ml: theme.direction === "rtl" ? "unset" : hasBtn ? "10%" : "",
            mr: theme.direction !== "rtl" ? "unset" : hasBtn ? "10%" : "",
          }}
        >
          <Typography
            sx={{
              ml:
                theme.direction === "rtl"
                  ? "unset"
                  : hasBtn
                    ? "auto"
                    : "center",
              mr:
                theme.direction !== "rtl"
                  ? "unset"
                  : hasBtn
                    ? "auto"
                    : "center",
            }}
            color="#9DA7B3"
            variant="headlineMedium"
          >
            <Trans i18nKey={title} />
          </Typography>
          {hasBtn && (
            <Button
              variant="contained"
              onClick={() => setOpenEGModal(true)}
              sx={{
                ml: theme.direction === "rtl" ? "unset" : "auto",
                mr: theme.direction !== "rtl" ? "unset" : "auto",
                display: "flex",
                alignItems: "center",
              }}
            >
              <AddIcon
                sx={{ width: "1.125rem", height: "1.125rem" }}
                fontSize="small"
                style={{ color: "#EDFCFC" }}
              />
              <Trans i18nKey={btnLabel} />
            </Button>
          )}
        </Box>
        <Divider sx={{ width: "100%", marginTop: "24px" }} />
        {/*<Paper sx={{width: '100%', overflow: 'hidden'}}>*/}
        <TableContainer
          sx={{
            maxHeight: 840,
            "&::-webkit-scrollbar": {
              display: "none",
            },
          }}
        >
          <Table stickyHeader aria-label="sticky table">
            <TableHead
              sx={{ width: "100%", overflow: "hidden" }}
              style={{
                position: "sticky",
                top: 0,
                zIndex: 3,
                backgroundColor: "#fff",
              }}
            >
              <TableRow
                sx={{
                  display: "inline",
                  justifyContent: "center",
                  width: "100%",
                }}
              >
                {columns.map((column: any) => (
                  <TableCell
                    key={column.id}
                    align={column.align}
                    sx={{
                      minWidth: {
                        xs: "10rem",
                        sm: "14rem",
                        md: column.minWidth,
                      },
                      maxWidth: {
                        xs: "10rem",
                        sm: "14rem",
                        md: column.minWidth,
                      },
                      textAlign: { xs: column.position, lg: "center" },
                      display: {
                        xs: column.display,
                        md: "inline-block",
                        color: "#9DA7B3",
                        border: "none",
                        fontSize: "1rem",
                      },
                    }}
                  >
                      <Trans i18nKey={`${column.label}`} />
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>

            {/* Move the Divider outside the TableHead */}
            <TableBody>
              {listOfUser.length > 0 &&
                listOfUser.map((row: any) => (
                  <TableRow
                    tabIndex={-1}
                    key={row.id}
                    sx={{
                      background: !row.editable ? "#ebe8e85c" : "",
                    }}
                  >
                    <TableCell
                      sx={{
                        display: "flex",
                        justifyContent: "space-evenly",
                        alignItems: "center",
                        border: "none",
                        gap: { xs: "0px", md: "1.3rem" },
                        paddingX: { xs: "0px", md: "1rem" },
                      }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "flex-start",
                          minWidth: {
                            xs: "10rem",
                            sm: "14rem",
                            md: "20vm",
                          },
                          width: {
                            xs: "10rem",
                            sm: "14rem",
                            md: "20vw",
                          },
                        }}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: { xs: "flex-start" },
                            alignItems: "center",
                            gap: ".5rem",
                            paddingLeft: { lg: "30%" },
                          }}
                        >
                          <Avatar
                            {...stringAvatar(
                              row?.displayName
                                ? row?.displayName.toUpperCase()
                                : row?.name.toUpperCase(),
                            )}
                            src={row.pictureLink}
                            sx={{
                              width: 40,
                              height: 40,
                              display: { xs: "none", sm: "flex" },
                            }}
                          />
                          <Typography
                            sx={{
                              textOverflow: "ellipsis",
                              overflow: "hidden",
                              whiteSpace: "nowrap",
                              fontSize: "0.875rem",
                              color: "#1B1B1E",
                              fontWeight: 500,
                            }}
                          >
                            {row.displayName || row.name}
                          </Typography>
                          {!row.editable && (
                            <Chip
                              sx={{
                                marginRight:
                                  theme.direction === "ltr" ? 1 : "unset",
                                marginLeft:
                                  theme.direction === "rtl" ? 1 : "unset",
                                opacity: 0.7,
                                color: "#9A003C",
                                borderColor: "#9A003C",
                              }}
                              label={<Trans i18nKey={"owner"} />}
                              size="small"
                              variant="outlined"
                            />
                          )}
                        </Box>
                      </Box>
                      <Box
                        sx={{
                          display: { xs: "none", md: "flex" },
                          justifyContent: "center",
                          minWidth: {
                            xs: "10rem",
                            sm: "14rem",
                            md: "20vm",
                          },
                          width: {
                            xs: "10rem",
                            sm: "14rem",
                            md: "20vw",
                          },
                        }}
                      >
                        <Typography
                          sx={{
                            textOverflow: "ellipsis",
                            overflow: "hidden",
                            whiteSpace: "nowrap",
                            color: "#1B1B1E",
                            fontSize: "0.875",
                            wight: 300,
                          }}
                        >
                          {row.email}
                        </Typography>
                      </Box>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                          minWidth: {
                            xs: "10rem",
                            sm: "14rem",
                            md: "20vm",
                          },
                          width: {
                            xs: "10rem",
                            sm: "14rem",
                            md: "20vw",
                          },
                        }}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "flex-start",
                            alignItems: "center",
                            gap: { xs: "0px", md: ".7rem" },
                          }}
                        >
                          <Tooltip
                            disableHoverListener={row.editable}
                            title={
                              <Trans i18nKey="spaceOwnerRoleIsNotEditable" />
                            }
                          >
                            <Box
                              width="30%"
                              display="flex"
                              justifyContent="center"
                              alignItems="center"
                            >
                              <IconButton
                                sx={{ "&:hover": { color: "#d32f2f" } }}
                                size="small"
                                disabled={!row.editable}
                                onClick={() => {
                                  deleteEGMember(row.id);
                                }}
                              >
                                <DeleteRoundedIcon />
                              </IconButton>
                            </Box>
                          </Tooltip>
                        </Box>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
        <Divider sx={{ width: "100%", marginBlock: "24px" }} />
      </Box>
      {openEGModal && (
        <AddMemberModal
          query={query}
          open={openEGModal}
          close={onCloseEGModal}
        />
      )}
    </Box>
  );
}

const useEGPermision = (props: any) => {
  const { query } = props;

  const [openEGModal, setOpenEGModal] = useState(false);

  const { service } = useServiceContext();
  const { assessmentKitId } = useParams();

  const deleteMemberToKitPermissionQueryData = useQuery({
    service: (args, config) =>
      service.deleteMemberToKitPermission(args, config),
    runOnMount: false,
  });
  const deleteEGMember = async (id: any) => {
    try {
      await deleteMemberToKitPermissionQueryData.query({
        assessmentKitId: assessmentKitId,
        userId: id,
      });
      await query.query();
    } catch (e) {
      const err = e as ICustomError;
      toastError(err);
    }
  };

  const onCloseEGModal = () => {
    setOpenEGModal(false);
  };

  return { onCloseEGModal, deleteEGMember, openEGModal, setOpenEGModal };
};

const AddMemberModal = (props: any) => {
  const { close, query, ...rest } = props;
  const formMethods = useForm({ shouldUnregister: true });
  const inputRef = useRef<HTMLInputElement>(null);
  const { service } = useServiceContext();
  const { assessmentKitId } = useParams();

  const addMemberQueryData = useQuery({
    service: (args, config) => service.addMemberToKitPermission(args, config),
    runOnMount: false,
  });
  const onSubmit = async () => {
    try {
      const res = await addMemberQueryData.query({
        assessmentKitId: assessmentKitId,
        email: inputRef.current?.value,
      });
      res?.message && toast.success(res.message);
      await query.query();
      close();
    } catch (e) {
      const error = e as ICustomError;
      close();
      if (error?.response?.data.hasOwnProperty("message")) {
        if (Array.isArray(error.response?.data?.message)) {
          toastError(error.response?.data?.message[0]);
        } else {
          toastError(error);
        }
      }
    }
  };

  return (
    <CEDialog
      {...rest}
      fullScreen={false}
      closeDialog={close}
      title={
        <>
          <PersonAddIcon sx={{ mr: 1 }} />
          <Trans i18nKey="addMember" />
        </>
      }
    >
      <FormProviderWithForm formMethods={formMethods}>
        <Grid container spacing={2} sx={styles.formGrid}>
          {/* <Grid item xs={12}>
            <InputFieldUC
              name="code"
              required={true}
              defaultValue={defaultValues.code || nanoid(5)}
              label={<Trans i18nKey="code" />}
            />
          </Grid> */}
          <Grid item xs={12}>
            <AddMember inputRef={inputRef} queryData={query} />
          </Grid>
        </Grid>
        <CEDialogActions
          closeDialog={close}
          loading={addMemberQueryData.loading}
          type={"submit"}
          onSubmit={formMethods.handleSubmit(onSubmit)}
          submitButtonLabel={"add"}
        />
      </FormProviderWithForm>
    </CEDialog>
  );
};
const AddMember = (props: any) => {
  const { inputRef } = props;
  return (
    <Box component="form" sx={{ mb: 2, mt: 0 }}>
      <TextField
        fullWidth
        type={"email"}
        size="small"
        variant="outlined"
        inputRef={inputRef}
        placeholder={t("enterEmailOfTheUserYouWantToAdd") as string}
        label={<Trans i18nKey="userEmail" />}
      />
    </Box>
  );
};
