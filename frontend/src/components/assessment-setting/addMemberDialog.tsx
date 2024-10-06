import { useEffect, useRef, useState } from "react";
import { useServiceContext } from "@providers/ServiceProvider";
import { useParams } from "react-router-dom";
import { useQuery } from "@utils/useQuery";
import Typography from "@mui/material/Typography";
import FormControl from "@mui/material/FormControl";
import DialogTitle from "@mui/material/DialogTitle";
import { ICustomError } from "@utils/CustomError";
import toastError from "@utils/toastError";
import { SelectHeight } from "@utils/selectHeight";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import Box from "@mui/material/Box";
import { Trans } from "react-i18next";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import Select from "@mui/material/Select";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import MenuItem from "@mui/material/MenuItem";
import Button from "@mui/material/Button";
import { useForm } from "react-hook-form";
import FormProviderWithForm from "../common/FormProviderWithForm";
import AutocompleteAsyncField, {
  useConnectAutocompleteField,
} from "../common/fields/AutocompleteAsyncField";
import { LoadingButton } from "@mui/lab";
import useScreenResize from "@/utils/useScreenResize";
import { styles } from "@styles";
import { Settings } from "@mui/icons-material";
import { theme } from "@/config/theme";

export enum EUserInfo {
  "NAME" = "displayName",
  "EMAIL" = "email",
}
export enum EUserType {
  "DEFAULT" = "default",
  "NONE" = "none",
  "EXISTED" = "existed",
}

const AddMemberDialog = (props: {
  expanded: boolean;
  onClose: () => void;
  listOfUser: any;
  setChangeData?: any;
  title: any;
  cancelText: any;
  confirmText: any;
  listOfRoles: any[];
  assessmentId: any;
}) => {
  const {
    expanded,
    onClose,
    cancelText,
    confirmText,
    setChangeData,
    listOfRoles = [],
    listOfUser,
    assessmentId,
  } = props;

  const [addedEmailType, setAddedEmailType] = useState<string>(
    EUserType.DEFAULT,
  );
  const [memberOfSpace, setMemberOfSpace] = useState<any[]>([]);
  const [memberSelectedId, setMemberSelectedId] = useState<any>("");
  const [memberSelectedEmail, setMemberSelectedEmail] = useState<any>("");
  const [roleSelected, setRoleSelected] = useState({ id: 0, title: "Viewer" });
  const { service } = useServiceContext();
  const { spaceId = "" } = useParams();

  const inviteMemberToAssessment = useQuery({
    service: (args, config) => service.inviteMemberToAssessment(args, config),
    runOnMount: false,
  });

  const spaceMembersQueryData = useQuery({
    service: (args, config) => service.fetchSpaceMembers({ spaceId }, config),
  });

  const addRoleMemberQueryData = useQuery({
    service: (
      args = {
        assessmentId,
        userId: memberSelectedId,
        roleId: roleSelected.id,
      },
      config,
    ) => service.addRoleMember(args, config),
    runOnMount: false,
  });

  const [loading, setLoading] = useState(false);

  const handleChangeRole = (event: any) => {
    const {
      target: {
        value: { id, title },
      },
    } = event;
    setRoleSelected({ id, title });
  };

  useEffect(() => {
    (async () => {
      try {
        setAddedEmailType(EUserType.DEFAULT);
        const { data } = await spaceMembersQueryData;
        if (data) {
          const { items } = data;
          const filtredItems = items.filter((item: any) =>
            listOfUser.some((userListItem: any) => item.id === userListItem.id),
          );
          setMemberOfSpace(filtredItems);
        }
      } catch (e) {
        const err = e as ICustomError;
        toastError(err);
      }
    })();
  }, [expanded]);

  const closeDialog = () => {
    onClose();
    setMemberSelectedId("");
    setRoleSelected({ id: 0, title: "Viewer" });
  };

  const onConfirm = async (e: any) => {
    try {
      addedEmailType === EUserType.NONE
        ? await inviteMemberToAssessment.query({
            email: memberSelectedEmail,
            assessmentId,
            roleId: roleSelected.id,
          })
        : await addRoleMemberQueryData.query();
      // await fetchAssessmentsUserListRoles()
      setChangeData((prev: boolean) => !prev);
      closeDialog();
    } catch (e) {
      const err = e as ICustomError;
      toastError(err);
    }
  };
  const handleClick = async (e: any) => {
    setLoading(true);
    try {
      await onConfirm(e);
    } finally {
      setLoading(false);
    }
  };
  const ITEM_HEIGHT = 59;
  const ITEM_PADDING_TOP = 8;
  const MenuProps = SelectHeight(ITEM_HEIGHT, ITEM_PADDING_TOP);

  const formMethods = useForm({ shouldUnregister: true });
  useEffect(() => {
    const updateMemberSelected = async () => {
      try {
        const emailValue = await formMethods.getValues("email");
        setMemberSelectedEmail(emailValue?.email);
        if (emailValue?.id) {
          setMemberSelectedId(emailValue?.id);
          if (addedEmailType !== EUserType.EXISTED) {
            setAddedEmailType(EUserType.DEFAULT);
          }
        }
      } catch (error) {
        console.error("Failed to get form value", error);
      }
    };

    updateMemberSelected();
  }, [formMethods.watch("email")]);

  const buttonRef = useRef<HTMLButtonElement | null>(null);
  useEffect(() => {
    const handleEnterKeyDown = (event: any) => {
      if (event.key === "Enter" && buttonRef.current) {
        const openDropdowns = document.querySelectorAll(
          ".MuiAutocomplete-option",
        );
        if (openDropdowns.length === 0) {
          buttonRef.current.click();
        }
      }
    };

    window.addEventListener("keydown", handleEnterKeyDown, true);

    return () => {
      window.removeEventListener("keydown", handleEnterKeyDown, true);
    };
  }, []);
  const fullScreen = useScreenResize("sm");

  return (
    <Dialog
      open={expanded}
      onClose={closeDialog}
      fullWidth
      maxWidth="md"
      fullScreen={fullScreen}
    >
      <DialogTitle textTransform={"uppercase"} sx={{ ...styles.centerV }}>
        {" "}
        <>
          <Settings
            sx={{
              marginRight: theme.direction === "ltr" ? 1 : "unset",
              marginLeft: theme.direction === "rtl" ? 1 : "unset",
            }}
          />
          <Trans i18nKey="assignRole" />
        </>
      </DialogTitle>
      <DialogContent
        sx={{
          padding: "unset",
          background: "#fff",
          overflowX: "hidden",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          textAlign: "center",
          gap: 3,
          p: 1,
        }}
      >
        <Box
          display="flex"
          flexDirection={{ xs: "column", sm: "row" }}
          alignItems="center"
          justifyContent={"flex-start"}
          px={3}
          sx={{ gap: { xs: "0rem", sm: "1rem" } }}
          width="100%"
          mt={1}
        >
          <Typography>
            <Trans i18nKey={"add"} />
          </Typography>
          <Box width="50%">
            <FormProviderWithForm formMethods={formMethods}>
              <EmailField
                memberOfSpace={memberOfSpace}
                setAddedEmailType={setAddedEmailType}
              />
            </FormProviderWithForm>
          </Box>
          <Typography>
            <Trans i18nKey={"as"} />
          </Typography>
          <FormControl sx={{ width: "40%" }}>
            <Select
              labelId="demo-multiple-name-label"
              id="demo-multiple-name"
              value={roleSelected?.title}
              displayEmpty
              onChange={handleChangeRole}
              // disabled={memberSelected == "" ? true : false}
              sx={{
                height: "40px",
              }}
              IconComponent={KeyboardArrowDownIcon}
              inputProps={{
                renderValue: () =>
                  roleSelected?.title == "" ? (
                    <Box
                      sx={{
                        color: "#6C7B8E",
                        fontSize: "0.6rem",
                        textAlign: "left",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      <Trans i18nKey={"chooseARole"} />
                    </Box>
                  ) : (
                    roleSelected.title
                  ),
              }}
              MenuProps={MenuProps}
            >
              <Box
                sx={{
                  paddingY: "16px",
                  color: "#9DA7B3",
                  textAlign: "center",
                  borderBottom: "1px solid #9DA7B3",
                }}
              >
                <Typography sx={{ fontSize: "0.875rem" }}>
                  <Trans i18nKey={"chooseARole"} />
                </Typography>
              </Box>
              {listOfRoles &&
                listOfRoles.map((role: any, index: number) => {
                  return (
                    <MenuItem
                      style={{ display: "block" }}
                      key={role.title}
                      value={role}
                      id={role.id}
                      sx={{
                        "&.MuiMenuItem-root:hover": {
                          ...(roleSelected?.title == role.title
                            ? {
                                backgroundColor: "#9CCAFF",
                                color: "#004F83",
                              }
                            : {
                                backgroundColor: "#EFEDF0",
                                color: "#1B1B1E",
                              }),
                        },
                        background:
                          roleSelected?.title == role.title ? "#9CCAFF" : "",
                      }}
                    >
                      <Box
                        sx={{
                          maxWidth: "240px",
                          color: "#000",
                          fontSize: "0.875rem",
                          lineHeight: "21px",
                          fontWeight: 500,
                          paddingY: "1rem",
                        }}
                      >
                        <Typography>{role.title}</Typography>
                        <div
                          style={{
                            color: "#000",
                            fontSize: "0.875rem",
                            lineHeight: "21px",
                            fontWeight: 300,
                            whiteSpace: "break-spaces",
                            paddingTop: "1rem",
                          }}
                        >
                          {role.description}
                        </div>
                      </Box>
                      {listOfRoles && listOfRoles.length > index + 1 && (
                        <Box
                          sx={{
                            height: "0.5px",
                            width: "80%",
                            backgroundColor: "#9DA7B3",
                            mx: "auto",
                          }}
                        ></Box>
                      )}
                    </MenuItem>
                  );
                })}
            </Select>
          </FormControl>
        </Box>
        {addedEmailType !== EUserType.DEFAULT && (
          <Box
            sx={{
              display: "flex",
              alignItems: "flex-start",
              backgroundColor: "rgba(255, 249, 196, 0.31)",
              padding: 1,
              borderRadius: 2,
              marginInline: 3,
              maxWidth: "100%",
            }}
          >
            <InfoOutlinedIcon
              color="primary"
              sx={{
                marginRight: theme.direction === "ltr" ? 1 : "unset",
                marginLeft: theme.direction === "rtl" ? 1 : "unset",
              }}
            />
            <Typography variant="bodyLarge" textAlign="left">
              {addedEmailType === EUserType.EXISTED ? (
                <Trans i18nKey={"emailExistedInApp"} />
              ) : (
                <Trans i18nKey={"emailDoesntExistedInApp"} />
              )}
            </Typography>
          </Box>
        )}
        <Box
          sx={{
            width: "100%",
            display: "flex",
            gap: 2,
            padding: "16px",
            justifyContent: "flex-end",
          }}
        >
          <Button onClick={closeDialog}>{cancelText}</Button>
          <LoadingButton
            variant="contained"
            onClick={handleClick}
            loading={loading}
            ref={buttonRef}
          >
            {confirmText}
          </LoadingButton>
        </Box>
      </DialogContent>
    </Dialog>
  );
};
const EmailField = ({
  memberOfSpace,
  setAddedEmailType,
}: {
  memberOfSpace: any;
  setAddedEmailType: any;
}) => {
  const { service } = useServiceContext();
  const { spaceId = "" } = useParams();
  const queryData = useConnectAutocompleteField({
    service: (args, config) => service.fetchSpaceMembers({ spaceId }, config),
    accessor: "items",
  });
  const loadUserByEmail = useQuery({
    service: (args, config) => service.loadUserByEmail(args, config),
    runOnMount: false,
  });

  const [error, setError] = useState(undefined);

  const createItemQuery = async (inputValue: any) => {
    try {
      setError(undefined);
      const response = await loadUserByEmail.query({ email: inputValue });
      response.id
        ? setAddedEmailType(EUserType.EXISTED)
        : setAddedEmailType(EUserType.NONE);
      const newOption = { email: inputValue, id: response.id };
      return newOption;
    } catch (err: any) {
      setError(err);
      throw err;
    }
  };

  useEffect(() => {
    setAddedEmailType(EUserType.DEFAULT);
  }, [error]);

  return (
    <Box mt={error ? "20px" : "0px"}>
      <AutocompleteAsyncField
        {...queryData}
        name={EUserInfo.EMAIL}
        required={true}
        label={<Trans i18nKey="email" />}
        data-cy={EUserInfo.EMAIL}
        hasAddBtn={true}
        filterFields={[EUserInfo.EMAIL, EUserInfo.NAME]}
        filterOptionsByProperty={(option) =>
          !option.isOwner &&
          !memberOfSpace.some(
            (userListItem: any) => option.id === userListItem.id,
          )
        }
        createItemQuery={createItemQuery}
        errorObject={error}
        setError={setError}
        searchable={false}
      />
    </Box>
  );
};

export default AddMemberDialog;
