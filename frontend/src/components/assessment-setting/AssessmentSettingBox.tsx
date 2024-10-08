import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import CircularProgress from "@mui/material/CircularProgress";
import Divider from "@mui/material/Divider";
import FormControl from "@mui/material/FormControl";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import { Trans } from "react-i18next";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import React, { useEffect, useState } from "react";
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
import InfoOutlined from "@mui/icons-material/InfoOutlined";
import { theme } from "@config/theme";
import SettingBox from "@common/settingBox";

export const AssessmentSettingGeneralBox = (props: {
  AssessmentInfo: any;
  AssessmentInfoQuery: any;
  AssessmentTitle: string;
  fetchPathInfo: () => void;
  color: any;
}) => {
  const {
    AssessmentInfo,
    AssessmentInfoQuery,
    AssessmentTitle,
    fetchPathInfo,
    color,
  } = props;
  const {
    createdBy: { displayName },
    creationTime,
    lastModificationTime,
    kit,
    shortTitle,
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
        <Typography color="#9DA7B3" variant="headlineMedium">
          <Trans i18nKey={`${"General"}`} />
        </Typography>

        <Divider
          sx={{
            width: "100%",
            marginTop: "24px",
            marginBottom: "10px !important",
          }}
        />
        <Grid sx={{ display: "flex", justifyContent: "center" }}>
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
                shortTitle={shortTitle}
                infoQuery={fetchPathInfo}
                AssessmentInfoQuery={AssessmentInfoQuery}
                editable={true}
                color={color}
                type={"title"}
              />
            </Box>
          </Grid>
        </Grid>
        {
          <Grid sx={{ display: "flex", justifyContent: "center" }}>
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
                  display: "flex",
                  alignItems: "flex-end",
                  gap: "6px",
                  fontSize: { xs: "1rem", sm: "1.375rem" },
                  whiteSpace: { xs: "wrap", sm: "nowrap" },
                }}
                lineHeight={"normal"}
              >
                <Trans i18nKey="shortTitle" />:
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
                  shortTitle={shortTitle}
                  infoQuery={fetchPathInfo}
                  AssessmentInfoQuery={AssessmentInfoQuery}
                  editable={true}
                  color={color}
                  type={"shortTitle"}
                  displayEdit={shortTitle === "" || shortTitle === null}
                />
              </Box>
            </Grid>
          </Grid>
        }
        <Grid sx={{ display: "flex", justifyContent: "center" }}>
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
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: "5px",
                color: "#9DA7B3",
                ...theme.typography.labelSmall,
              }}
            >
              <InfoOutlined sx={{ width: "17px" }} />
              <Trans i18nKey={"shortTitleInfo"} />
            </Box>
          </Grid>
        </Grid>

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
                <Grid
                  item
                  sx={{ display: "flex", justifyContent: "center" }}
                  key={index}
                >
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
  openModal: () => void;
  openRemoveModal: (id: string, name: string, invited?: boolean) => void;
  setChangeData?: any;
  changeData?: any;
  inviteesMemberList: any;
}) => {

  const {
    listOfRoles = [],
    listOfUser,
    setChangeData,
    openModal,
    openRemoveModal,
    changeData,
    inviteesMemberList,
  } = props;

  useEffect(() => {
    inviteesMemberList.query();
  }, [changeData]);

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

  const inviteesColumns: readonly Column[] = [
    {
      id: "email",
      label: "Email",
      minWidth: "30vw",
      position: "center",
    },
    {
      id: "role",
      label: "Role",
      align: "right",
      minWidth: "30vw",
      position: "center",
    },
  ];

  const ITEM_HEIGHT = 59;
  const ITEM_PADDING_TOP = 8;

  const MenuProps = SelectHeight(ITEM_HEIGHT, ITEM_PADDING_TOP);

  return (
      <>
        <SettingBox
            name={"assessmentSettingBox"}
            MenuProps={MenuProps}
            setChangeData={setChangeData}
            listOfRoles={listOfRoles}
            listOfUser={listOfUser}
            hasBtn={true}
            openRemoveModal={openRemoveModal}
            title={"grantedRoles"}
            columns={columns}
            btnLabel={"addRole"}
            openAssessmentModal={openModal}
        />
        {inviteesMemberList?.data?.items?.length > 0 && (
          <>
            <SettingBox
                name={"assessmentSettingInviteBox"}
                MenuProps={MenuProps}
                setChangeData={setChangeData}
                listOfRoles={listOfRoles}
                listOfUser={inviteesMemberList?.data?.items}
                openRemoveModal={openRemoveModal}
                hasBtn={false}
                title={"invitees"}
                columns={inviteesColumns}
            />
          </>
        )}
      </>
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
  const {
    data,
    shortTitle,
    type,
    editable,
    infoQuery,
    color,
    AssessmentInfoQuery,
    displayEdit,
  } = props;
  const [hasError, setHasError] = useState<boolean>(false);
  const [inputData, setInputData] = useState<string>(data);
  const [inputDataShortTitle, setInputDataShortTitle] =
    useState<string>(shortTitle);
  const handleCancel = () => {
    setShow(false);
    setInputData(data);
    setHasError(false);
  };
  const { assessmentId } = useParams();
  const { service } = useServiceContext();
  const updateAssessmentQuery = useQuery({
    service: (
      args = {
        id: assessmentId,
        data: {
          title: inputData,
          shortTitle: inputDataShortTitle === "" ? null : inputDataShortTitle,
          colorId: color?.id || 6,
        },
      },
      config,
    ) => service.updateAssessment(args, config),
    runOnMount: false,
    // toastError: true,
  });
  const updateAssessmentTitle = async () => {
    try {
      const res = await updateAssessmentQuery.query();
      res.message && toast.success(res.message);
      await infoQuery();
      await AssessmentInfoQuery();
    } catch (e) {
      const err = e as ICustomError;
      setHasError(true);
      if (Array.isArray(err.response?.data?.message)) {
        toastError(err.response?.data?.message[0]);
      } else if (
        err.response?.data &&
        err.response?.data.hasOwnProperty("message")
      ) {
        toastError(err.response?.data?.message);
      }
    }
  };
  const inputProps: React.HTMLProps<HTMLInputElement> = {
    style: {
      textAlign:
        type == "title"
          ? firstCharDetector(inputData)
            ? "right"
            : "left"
          : type == "shortTitle"
            ? firstCharDetector(inputDataShortTitle)
              ? "right"
              : "left"
            : "left",
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
              defaultValue={
                type == "title" ? inputData : inputDataShortTitle || ""
              }
              onChange={(e) =>
                type == "title"
                  ? setInputData(e.target.value)
                  : setInputDataShortTitle(e.target.value)
              }
              value={type == "title" ? inputData : inputDataShortTitle}
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
              {type == "title" && data?.replace(/<\/?p>/g, "")}
              {type == "shortTitle" && shortTitle?.replace(/<\/?p>/g, "")}
            </Typography>
            {(isHovering || displayEdit) && (
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
