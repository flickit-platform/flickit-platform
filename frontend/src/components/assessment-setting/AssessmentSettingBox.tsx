import Box from "@mui/material/Box";
import {
  Chip,
  Divider,
  FormControl,
  IconButton,
  SelectChangeEvent,
  Tooltip,
  Typography,
} from "@mui/material";
import { Trans } from "react-i18next";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import React, { useState } from "react";
import { styles } from "@styles";
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";
import { useForm } from "react-hook-form";
import { useParams } from "react-router";
import { useServiceContext } from "@providers/ServiceProvider";
import { useQuery } from "@utils/useQuery";
import { toast } from "react-toastify";
import { ICustomError } from "@utils/CustomError";
import toastError from "@utils/toastError";
import firstCharDetector from "@utils/firstCharDetector";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputAdornment from "@mui/material/InputAdornment";
import Grid from "@mui/material/Grid";
import TableContainer from "@mui/material/TableContainer";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import TableBody from "@mui/material/TableBody";
import Avatar from "@mui/material/Avatar";
import stringAvatar from "@utils/stringAvatar";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import formatDate from "@utils/formatDate";
import { Link } from "react-router-dom";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { SelectHeight } from "@utils/selectHeight";
import DoneIcon from "@mui/icons-material/Done";
import CloseIcon from "@mui/icons-material/Close";

export const AssessmentSettingGeneralBox = (props: {
  AssessmentInfo: any;
  AssessmentTitle: string;
  fetchPathInfo: () => void;
  color: any;
}) => {
  const { AssessmentInfo, AssessmentTitle, fetchPathInfo, color } = props;
  const {
    createdBy: { displayName },
    creationTime,
    lastModificationTime,
    kit,
  } = AssessmentInfo;

  const title = ["creator", "created", "lastModified", "assessmentKit"];
  const formMethods = useForm({ shouldUnregister: true });

  return (
    <Box
      sx={{
        ...styles.centerCVH,
        px: { xs: "15px", sm: "51px" },
      }}
      gap={2}
      textAlign="center"
      height={"auto"}
      // minHeight={"415px"}
      width={"100%"}
      bgcolor={"#FFF"}
      borderRadius={"40.53px"}
      py={"32px"}
    >
      <Box height={"100%"} width={"100%"}>
        <Typography
          color="#9DA7B3"
          fontSize="2rem"
          fontWeight={700}
          lineHeight={"normal"}
        >
          <Trans i18nKey={`${"General"}`} />
        </Typography>

        <Divider
          sx={{
            width: "100%",
            marginTop: "24px",
            marginBottom: "10px !important",
          }}
        />
        <Box sx={{ display: "flex", justifyContent: "center" }}>
          <Grid
            item
            xs={12}
            sm={12}
            md={8}
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography
              color="#9DA7B3"
              fontWeight={500}
              sx={{
                fontSize: { xs: "1rem", sm: "1.375rem" },
                whiteSpace: { xs: "wrap", sm: "nowrap" },
              }}
              lineHeight={"normal"}
            >
              <Trans i18nKey="assessmentTitle" />:
            </Typography>

            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                width: { md: "350px" },
              }}
            >
              <OnHoverInputTitleSetting
                formMethods={formMethods}
                data={AssessmentTitle}
                infoQuery={fetchPathInfo}
                editable={true}
                color={color}
              />
            </Box>
          </Grid>
        </Box>

        <Divider
          sx={{ width: "100%", marginBottom: "24px", marginTop: "10px" }}
        />

        <Grid
          container
          sx={{
            height: "100%",
            width: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "space-between",
            gap: "32px",
          }}
        >
          {title &&
            title.map((itemList: string, index: number) => {
              return (
                <Grid item sx={{ display: "flex", justifyContent: "center" }}>
                  <Grid
                    item
                    xs={12}
                    sm={12}
                    md={8}
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Typography
                      color="#9DA7B3"
                      fontWeight={500}
                      whiteSpace={"nowrap"}
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        fontSize: { xs: "1rem", md: "1.375rem" },
                      }}
                      lineHeight={"normal"}
                    >
                      <Trans i18nKey={`${itemList}`} />:
                    </Typography>

                    <Typography
                      color="#0A2342"
                      fontWeight={500}
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        fontSize: { xs: "1rem", md: "1.375rem" },
                        width: { md: "350px" },
                      }}
                      lineHeight={"normal"}
                    >
                      {index == 0 && displayName}
                      {index == 1 && formatDate(creationTime)}
                      {index == 2 && formatDate(lastModificationTime)}
                      {index == 3 && (
                        <Link
                          style={{ textDecoration: "none", color: "inherit" }}
                          to={`/assessment-kits/${kit.id}`}
                        >
                          {kit.title}
                        </Link>
                      )}
                    </Typography>
                  </Grid>
                </Grid>
              );
            })}
        </Grid>
      </Box>
    </Box>
  );
};

export const AssessmentSettingMemberBox = (props: {
  listOfRoles: any[];
  listOfUser: any[];
  fetchAssessmentsUserListRoles: () => void;
  openModal: () => void;
  openRemoveModal: (id: string, name: string) => void;
  setChangeData?: any;
}) => {
  const { service } = useServiceContext();
  const { assessmentId = "" } = useParams();
  const {
    listOfRoles = [],
    listOfUser,
    fetchAssessmentsUserListRoles,
    setChangeData,
    openModal,
    openRemoveModal,
  } = props;

  // const [page, setPage] = React.useState(0);
  // const [rowsPerPage, setRowsPerPage] = React.useState(5);

  interface Column {
    id: "displayName" | "email" | "role";
    label: string;
    minWidth?: string;
    align?: "right";
    display?: string;
    position: string;
  }

  const editUserRole = useQuery({
    service: (args, config) =>
      service.editUserRole({ assessmentId, ...args }, config),
    runOnMount: false,
  });

  const columns: readonly Column[] = [
    { id: "displayName", label: "Name", minWidth: "20vw", position: "left" },
    {
      id: "email",
      label: "Email",
      minWidth: "20vw",
      display: "none",
      position: "center",
    },
    {
      id: "role",
      label: "Role",
      align: "right",
      minWidth: "20vw",
      position: "center",
    },
  ];

  const handleChange = async (event: any) => {
    try {
      const {
        target: { value, name },
      } = event;
      const { id: roleId } = value;
      const { id: userId } = name;
      await editUserRole.query({ userId, roleId });
      setChangeData((prev: boolean) => !prev);
      // await fetchAssessmentsUserListRoles()
    } catch (e) {
      const err = e as ICustomError;
      toastError(err);
    }
  };

  const ITEM_HEIGHT = 59;
  const ITEM_PADDING_TOP = 8;

  const MenuProps = SelectHeight(ITEM_HEIGHT, ITEM_PADDING_TOP);

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
        px: { xs: "15px", sm: "51px" },
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
            justifyContent: { xs: "flex-start", sm: "center" },
            position: "relative",
            gap: "10px",
          }}
        >
          <Typography
            color="#9DA7B3"
            sx={{ fontSize: "2rem" }}
            fontWeight={700}
            lineHeight={"normal"}
          >
            <Trans i18nKey={`member`} />
          </Typography>
          <Button
            sx={{
              borderRadius: 100,
              backgroundColor: "#004F83",
              width: "fit-content",
              alignSelf: "end",
              "&.MuiButtonBase-root:hover": {
                bgcolor: "#004F83",
              },
              position: "absolute",
              right: 0,
              paddingX: "1.5rem",
            }}
            onClick={openModal}
          >
            <AddIcon
              sx={{ width: "1.125rem", height: "1.125rem" }}
              fontSize="small"
              style={{ color: "#EDFCFC" }}
            />
            <Typography
              color="#EDFCFC"
              fontWeight={500}
              lineHeight={"normal"}
              sx={{
                lineHeight: "1.25rem",
                fontSize: { xs: "0.7rem", sm: "0.85rem" },
              }}
            >
              <Trans i18nKey={"addMember"} />
            </Typography>
          </Button>
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
                {columns.map((column) => (
                  <TableCell
                    key={column.id}
                    align={column.align}
                    sx={{
                      minWidth: {
                        xs: "8.1rem",
                        sm: "12rem",
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
                    {column.label}
                  </TableCell>
                ))}
              </TableRow>
              <Divider sx={{ width: "100%" }} />
            </TableHead>
            <TableBody>
              {listOfUser.length > 0 &&
                listOfUser
                  // .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row: any) => {
                    return (
                      <TableRow tabIndex={-1} key={row.id} sx={{ background: !row.editable ? "#ebe8e85c" : "" }}>
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
                              width: "18vw",
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
                                {...stringAvatar(row.displayName.toUpperCase())}
                                src={row.pictureLink}
                                sx={{
                                  width: 40,
                                  height: 40,
                                  display: { xs: "none", sm: "flex" },
                                }}
                              ></Avatar>
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
                                {row.displayName}
                              </Typography>
                              {!row.editable && <Chip
                                sx={{
                                  mr: 1,
                                  opacity: 0.7,
                                  color: "#9A003C",
                                  borderColor: "#9A003C",
                                }}
                                label={<Trans i18nKey={"owner"} />}
                                size="small"
                                variant="outlined"
                              />}

                            </Box>
                          </Box>
                          <Box
                            sx={{
                              display: { xs: "none", md: "flex" },
                              justifyContent: "center",
                              width: { xs: "5rem", md: "20vw" },
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
                              justifyContent: "flex-end",
                              alignItems: "center",
                              gap: { xs: "0px", md: ".7rem" },
                              width: { xs: "10.1rem", md: "20vw" },
                            }}
                          >
                            <FormControl
                              sx={{
                                m: 1,
                                width: "100%",
                                textAlign: "center",
                                padding: "6px, 12px, 6px, 12px",
                                display: "inline-flex",
                                justifyContent: "center",
                                alignItems: "center",
                              }}
                            >
                              {/*<Grid item lg={8} sx={{minWidth: {xs: "100%", md: "12vw", lg:"10vw", xl: "160px"}}} >*/}
                              <Grid
                                item
                                lg={8}
                                sx={{ minWidth: { xs: "100%", md: "160px" } }}
                              >
                                <Tooltip disableHoverListener={row.editable} title={<Trans i18nKey="spaceOwnerRoleIsNotEditable" />}>
                                  <Select
                                    labelId="demo-multiple-name-label"
                                    id="demo-multiple-name"
                                    value={row?.role?.title}
                                    onChange={handleChange}
                                    name={row}
                                    MenuProps={MenuProps}
                                    sx={{
                                      width: "100%",
                                      boxShadow: "none",
                                      ".MuiOutlinedInput-notchedOutline": {
                                        border: 0,
                                      },
                                      border: row.editable ? "1px solid #2974B4" : "1px solid #2974b442",
                                      fontSize: "0.875rem",
                                      borderRadius: "0.5rem",
                                      "&.MuiOutlinedInput-notchedOutline": {
                                        border: 0,
                                      },
                                      "&.MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline":
                                      {
                                        border: 0,
                                      },
                                      "&.MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline":
                                      {
                                        border: 0,
                                      },
                                      ".MuiSvgIcon-root": {
                                        fill: row.editable ? "#2974B4 !important" : "#2974b442 !important",
                                      },
                                      "& .MuiSelect-select": {
                                        padding: "4px 5px",
                                      },
                                    }}
                                    IconComponent={KeyboardArrowDownIcon}
                                    inputProps={{
                                      renderValue: () => row?.role?.title,
                                    }}
                                    disabled={!row.editable}
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
                                      listOfRoles.map(
                                        (role: any, index: number) => (
                                          <MenuItem
                                            style={{ display: "block" }}
                                            key={role.title}
                                            value={role}
                                            sx={{
                                              paddingY: "0px",
                                              maxHeight: "200px",
                                              ...(role.id === row.role.id && {
                                                backgroundColor: "#9CCAFF",
                                              }),
                                              "&.MuiMenuItem-root:hover": {
                                                ...(role.id === row.role.id
                                                  ? {
                                                    backgroundColor: "#9CCAFF",
                                                    color: "#004F83",
                                                  }
                                                  : {
                                                    backgroundColor: "#EFEDF0",
                                                    color: "#1B1B1E",
                                                  }),
                                              },
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
                                              <Typography
                                                sx={{
                                                  fontSize: "0.875rem",
                                                  ...(role.id === row.role.id
                                                    ? {
                                                      color: "#004F83",
                                                    }
                                                    : {
                                                      color: "#1B1B1E",
                                                    }),
                                                }}
                                              >
                                                {role.title}
                                              </Typography>

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
                                            {listOfRoles &&
                                              listOfRoles.length > index + 1 && (
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
                                        )
                                      )}
                                  </Select>
                                </Tooltip>
                              </Grid>
                            </FormControl>
                            <Tooltip disableHoverListener={row.editable} title={<Trans i18nKey="spaceOwnerRoleIsNotEditable" />}>

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
                                  onClick={() =>
                                    openRemoveModal(row.displayName, row.id)
                                  }
                                >
                                  <DeleteRoundedIcon />
                                </IconButton>{" "}
                              </Box>
                            </Tooltip>
                          </Box>
                        </TableCell>
                      </TableRow>
                    );
                  })}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Box>
  );
};

const OnHoverInputTitleSetting = (props: any) => {
  const [show, setShow] = useState<boolean>(false);
  const [isHovering, setIsHovering] = useState(false);
  const handleMouseOver = () => {
    editable && setIsHovering(true);
  };

  const handleMouseOut = () => {
    setIsHovering(false);
  };
  const { data, editable, infoQuery, formMethods, color } = props;
  const [hasError, setHasError] = useState<boolean>(false);
  const [error, setError] = useState<any>({});
  const [inputData, setInputData] = useState<string>(data);
  const handleCancel = () => {
    setShow(false);
    setInputData(data);
    setError({});
    setHasError(false);
  };
  const { assessmentId } = useParams();
  const { service } = useServiceContext();
  const updateAssessmentQuery = useQuery({
    service: (
      args = {
        id: assessmentId,
        data: { title: inputData, colorId: color?.id || 6 },
      },
      config
    ) => service.updateAssessment(args, config),
    runOnMount: false,
    // toastError: true,
  });
  const updateAssessmentTitle = async () => {
    try {
      const res = await updateAssessmentQuery.query();
      res.message && toast.success(res.message);
      await infoQuery();
    } catch (e) {
      const err = e as ICustomError;
      if (Array.isArray(err.response?.data?.message)) {
        toastError(err.response?.data?.message[0]);
      } else if (
        err.response?.data &&
        err.response?.data.hasOwnProperty("message")
      ) {
        toastError(error);
      }
      setError(err);
      setHasError(true);
    }
  };
  const inputProps: React.HTMLProps<HTMLInputElement> = {
    style: {
      textAlign: firstCharDetector(inputData) ? "right" : "left",
    },
  };

  return (
    <Box>
      <Box
        my={1.5}
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          position: "relative",
          cursor: "pointer",
        }}
        width="100%"
      >
        {editable && show ? (
          <Box
            sx={{ display: "flex", flexDirection: "column", width: "100% " }}
          >
            <OutlinedInput
              inputProps={inputProps}
              error={hasError}
              fullWidth
              // name={title}
              defaultValue={data || ""}
              onChange={(e) => setInputData(e.target.value)}
              value={inputData}
              required={true}
              multiline={true}
              sx={{
                minHeight: "38px",
                borderRadius: "4px",
                paddingRight: "12px;",
                fontWeight: "700",
                fontSize: "0.875rem",
                "&.MuiOutlinedInput-notchedOutline": { border: 0 },
                "&.MuiOutlinedInput-root:hover": {
                  border: 0,
                  outline: "none",
                },
                "& .MuiOutlinedInput-input:focused": {
                  border: 0,
                  outline: "none",
                },
                "&.MuiOutlinedInput-root.Mui-selected": {
                  border: 0,
                  outline: "none",
                },
                "&:hover": { border: "1px solid #79747E" },
              }}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    title="Submit Edit"
                    edge="end"
                    sx={{
                      background: "#49CED0",
                      borderRadius: "2px",
                      height: { xs: "26px", sm: "36px" },
                      width: { xs: "26px", sm: "36px" },
                      margin: "3px",
                    }}
                    onClick={updateAssessmentTitle}
                  >
                    <DoneIcon sx={{ color: "#fff" }} />
                  </IconButton>
                  <IconButton
                    title="Cancel Edit"
                    edge="end"
                    sx={{
                      background: "#E04B7C",
                      borderRadius: "2px",
                      height: { xs: "26px", sm: "36px" },
                      width: { xs: "26px", sm: "36px" },
                    }}
                    onClick={handleCancel}
                  >
                    <CloseIcon sx={{ color: "#fff" }} />
                  </IconButton>
                </InputAdornment>
              }
            />
            {/*{hasError && (*/}
            {/*    <Typography color="#ba000d" variant="caption">*/}
            {/*        {error?.data}*/}
            {/*    </Typography>*/}
            {/*)}*/}
          </Box>
        ) : (
          <Box
            sx={{
              minHeight: "38px",
              borderRadius: "4px",
              paddingLeft: "8px;",
              paddingRight: "12px;",
              width: "100%",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              wordBreak: "break-word",
              // "&:hover": {border: "1px solid #79747E"},
            }}
            onClick={() => setShow(!show)}
            onMouseOver={handleMouseOver}
            onMouseOut={handleMouseOut}
          >
            <Typography
              color="#004F83"
              fontWeight={500}
              sx={{ fontSize: { xs: "1rem", sm: "1.375rem" } }}
              lineHeight={"normal"}
            >
              {data.replace(/<\/?p>/g, "")}
            </Typography>
            {isHovering && (
              <EditRoundedIcon
                sx={{ color: "#9DA7B3", position: "absolute", right: -10 }}
                fontSize="small"
                width={"32px"}
                height={"32px"}
                onClick={() => setShow(!show)}
              />
            )}
          </Box>
        )}
      </Box>
    </Box>
  );
};
