import Box from "@mui/material/Box";
import {Divider, FormControl, IconButton, SelectChangeEvent, Typography} from "@mui/material";
import {Trans} from "react-i18next";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import React, {useState} from "react";
import {styles} from "@styles";
import Button from "@mui/material/Button";
import AddIcon from '@mui/icons-material/Add';
import {useForm} from "react-hook-form";
import {useParams} from "react-router";
import {useServiceContext} from "@providers/ServiceProvider";
import {useQuery} from "@utils/useQuery";
import {toast} from "react-toastify";
import {ICustomError} from "@utils/CustomError";
import toastError from "@utils/toastError";
import firstCharDetector from "@utils/firstCharDetector";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputAdornment from "@mui/material/InputAdornment";
import CheckCircleOutlineRoundedIcon from "@mui/icons-material/CheckCircleOutlineRounded";
import CancelRoundedIcon from "@mui/icons-material/CancelRounded";
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
import Paper from "@mui/material/Paper";

export const AssessmentSettingGeneralBox = () => {

    return (
        <Box
            sx={{
                ...styles.centerCVH
                , px: {xs: "15px", sm: "51px"}
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
            <Box
                height={"100%"}
                width={"100%"}
            >
                <Typography color="#9DA7B3" fontSize="32px" fontWeight={700}
                            lineHeight={"normal"}>
                    <Trans i18nKey={`${"General"}`}/>
                </Typography>


                <Divider sx={{width: "100%", marginTop: "24px", marginBottom: "10px"}}/>
                <Box sx={{display: "flex", justifyContent: "center"}}>
                    <Grid item
                          xs={12}
                          sm={12}
                          md={8}
                          sx={{
                              display: "flex",
                              justifyContent: 'space-between',
                              alignItems: "center",
                          }}
                    >
                        <Typography color="#9DA7B3" fontWeight={500}
                                    whiteSpace={"nowrap"}
                                    sx={{fontSize: {xs: "1rem", sm: "24px"}}}
                                    lineHeight={"normal"}>
                            <Trans i18nKey="assessmentTitle"/>:
                        </Typography>

                        <Box sx={{display: "flex", justifyContent: 'center', alignItems: "center"
                        , width:{md: "350px"}
                        }}>
                            {/*TODO*/}
                            <Typography color="#1CC2C4" fontWeight={500}
                                        sx={{fontSize: {xs: "1rem", sm: "24px"}}}
                                        lineHeight={"normal"}>
                                {"assessmentTitle"}
                            </Typography>
                            <EditRoundedIcon sx={{color: "#9DA7B3"}} fontSize="small" width={"32px"}
                                             height={"32px"}/>
                            {/*<OnHoverInputTitleSetting*/}
                            {/*    formMethods={formMethods}*/}
                            {/*    data={assessmentTitle}*/}
                            {/*    infoQuery={assessmentTitle}*/}
                            {/*    type="assessmentTitle"*/}
                            {/*    editable={true}*/}
                            {/*/>*/}
                        </Box>
                    </Grid>
                </Box>

                <Divider sx={{width: "100%", marginBottom: "24px", marginTop: "10px"}}/>

                <Grid container
                      sx={{
                          height: "100%",
                          width: "100%",
                          display: "flex",
                          flexDirection: "column",
                          justifyContent: 'center',
                          alignItems: 'space-between',
                          gap: "32px"
                      }}
                >
                    <Grid item
                          sx={{display: "flex", justifyContent: "center"}}
                    ><Grid item
                           xs={12}
                           sm={12}
                           md={8}

                           sx={{
                               display: "flex",
                               justifyContent: "space-between",
                               alignItems: 'center',
                           }}
                    >
                        <Typography color="#9DA7B3" fontWeight={500}
                                    whiteSpace={"nowrap"}
                                    sx={{
                                        display: "flex",
                                        justifyContent: "center",
                                        fontSize: {xs: "18px", md: "24px"},
                                    }}
                                    lineHeight={"normal"}>
                            <Trans i18nKey="creator"/>
                        </Typography>


                        <Typography color="#0A2342" fontWeight={500}
                                    sx={{
                                        display: "flex",
                                        justifyContent: "center",
                                        fontSize: {xs: "18px", md: "24px"},
                                        width:{md: "350px"}
                                    }}
                                    lineHeight={"normal"}>
                            "hi"
                        </Typography>


                    </Grid>

                    </Grid>

                    {/*<Grid item*/}
                    {/*      sx={{*/}
                    {/*          width: "100%",*/}
                    {/*          display: "flex",*/}
                    {/*          justifyContent: 'space-around',*/}
                    {/*          alignItems: "center",*/}
                    {/*      }}*/}
                    {/*>*/}

                    {/*        <Typography color="#9DA7B3" fontWeight={500}*/}
                    {/*                    whiteSpace={"nowrap"}*/}
                    {/*                    sx={{*/}
                    {/*                        display: "flex",*/}
                    {/*                        justifyContent: "start",*/}
                    {/*                        fontSize: {xs: "18px", md: "24px"},*/}
                    {/*                        width: {xs: "100%", md: "60%"},*/}
                    {/*                    }}*/}
                    {/*                    lineHeight={"normal"}>*/}
                    {/*            <Trans i18nKey="Created"/>*/}
                    {/*        </Typography>*/}
                    {/*    <Typography color="#0A2342" fontWeight={500}*/}
                    {/*                sx={{*/}
                    {/*                    display: "flex",*/}
                    {/*                    justifyContent: {xs: "end", md: "center"},*/}
                    {/*                    fontSize: {xs: "18px", md: "24px"},*/}
                    {/*                    width: {xs: "100%", md: "50%"},*/}
                    {/*                }}*/}
                    {/*                lineHeight={"normal"}>*/}
                    {/*        "hi"*/}
                    {/*    </Typography>*/}
                    {/*</Grid>*/}
                    {/*<Grid item*/}
                    {/*      sx={{*/}
                    {/*          width: "100%",*/}
                    {/*          display: "flex",*/}
                    {/*          justifyContent: 'space-around',*/}
                    {/*          alignItems: "center",*/}
                    {/*      }}*/}
                    {/*>*/}

                    {/*        <Typography color="#9DA7B3" fontWeight={500}*/}
                    {/*                    whiteSpace={"nowrap"}*/}
                    {/*                    sx={{*/}
                    {/*                        display: "flex",*/}
                    {/*                        justifyContent: "start",*/}
                    {/*                        fontSize: {xs: "18px", md: "24px"},*/}
                    {/*                        width: {xs: "100%", md: "60%"},*/}
                    {/*                    }}*/}
                    {/*                    lineHeight={"normal"}>*/}
                    {/*            <Trans i18nKey="assessmentkit"/>*/}
                    {/*        </Typography>*/}
                    {/*    <Typography color="#0A2342" fontWeight={500}*/}
                    {/*                sx={{*/}
                    {/*                    display: "flex",*/}
                    {/*                    justifyContent: {xs: "end", md: "center"},*/}
                    {/*                    fontSize: {xs: "18px", md: "24px"},*/}
                    {/*                    width: {xs: "100%", md: "50%"},*/}
                    {/*                }}*/}
                    {/*                lineHeight={"normal"}>*/}
                    {/*        "hi"*/}
                    {/*    </Typography>*/}
                    {/*</Grid>*/}
                </Grid>
            </Box>
        </Box>
    )
}


export const AssessmentSettingMemberBox = (props: {
    listOfRoles: any,
    listOfUser: any,
    fetchAssessmentsUserListRoles: () => void,
    openModal: () => void,
}) => {
    const {service} = useServiceContext();
    const {assessmentId = ""} = useParams();
    const {listOfRoles, listOfUser, fetchAssessmentsUserListRoles, openModal} = props

    interface Column {
        id: 'displayName' | 'email' | 'role'
        label: string;
        minWidth?: number;
        align?: 'right';
        format?: (value: number) => string;
    }

    const deleteUserRole = useQuery({
        service: (args, config) =>
            service.deleteUserRole({assessmentId, args}, config),
        runOnMount: false,
    });
    // const EditUserRole= useQuery({
    //     service: (args, config) =>
    //         service.EditUserRole({assessmentId,args}, config),
    //     runOnMount: false,
    // });

    const columns: readonly Column[] = [
        {id: 'displayName', label: 'Name', minWidth: 230},
        {id: 'email', label: 'email', minWidth: 230},
        {
            id: 'role',
            label: 'roles',
            align: 'right',
            minWidth: 230
        }
    ];

    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);

    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    const rows = [{
        id: 1,
        email: "hi@1.com",
        displayName: "mostafa",
        pictureLink: "https://cdn.test.flickit.org/media/user/images/images.jpg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=jsSamVF3lQ5OSCpwc2SDdGXPY8jd05zC%2F20240602%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20240602T085956Z&X-Amz-Expires=86400&X-Amz-SignedHeaders=host&X-Amz-Signature=aca9ad1dfcc6978f5ecce5824bb123c6cba43af1d9ddb909bef886401036aca0",
        role: "admin"
    }] as any

    const [changeRole, setChangeRole] = React.useState<string>("");

    const handleChange = (event: SelectChangeEvent<typeof changeRole>) => {
        const {
            target: {value},
        } = event;
        setChangeRole(
            value
        );
    };

    const DeletePerson = async (id: any) => {
        try {
            await deleteUserRole.query(id)
            await fetchAssessmentsUserListRoles()
        } catch (e) {
            const err = e as ICustomError;
            toastError(err);
        }
    }

    return (
        <Box
            sx={{
                ...styles.centerCVH
                , px: {xs: "15px", sm: "51px"}
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
            <Box
                height={"100%"}
                width={"100%"}
            >
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: {xs: "flex-start", sm: "center"},
                        position: "relative",
                        gap: "10px"
                    }}
                >
                    <Typography color="#9DA7B3" sx={{fontSize: "2rem"}} fontWeight={700}
                                lineHeight={"normal"}>
                        <Trans i18nKey={`member`}/>
                    </Typography>
                    <Button
                        sx={{
                            borderRadius: 100, backgroundColor: "#1CC2C4",
                            width: "fit-content",
                            alignSelf: "end",
                            "&.MuiButtonBase-root:hover": {
                                bgcolor: "#1CC2C4"
                            },
                            position: "absolute",
                            right: 10
                        }}
                        onClick={openModal}
                    >
                        <AddIcon
                            fontSize="small"
                            style={{color: "#EDFCFC"}}
                        />
                        <Typography color="#EDFCFC" fontSize="14px" fontWeight={500}
                                    lineHeight={"normal"}>
                            <Trans i18nKey={`addMember`}/>
                        </Typography>
                    </Button>

                </Box>
                <Divider sx={{width: "100%", marginTop: "24px", marginBottom: "10px"}}/>
                <Paper sx={{width: '100%', overflow: 'hidden'}}>
                    <TableContainer sx={{maxHeight: 440}}>
                        <Table stickyHeader aria-label="sticky table">
                            <TableHead
                                sx={{width: '100%', overflow: 'hidden'}}
                            >
                                <TableRow sx={{display: "inline", justifyContent: 'center', width: "100%"}}>
                                    {columns.map((column) => (
                                        <TableCell
                                            key={column.id}
                                            align={column.align}
                                            style={{
                                                minWidth: column.minWidth, textAlign: "center"
                                            }}
                                        >
                                            {column.label}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {listOfUser.items
                                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                    .map((row: any) => {
                                        return (
                                            <TableRow
                                                tabIndex={-1} key={row.id}>
                                                <TableCell
                                                    sx={{
                                                        display: "flex",
                                                        justifyContent: "center",
                                                        alignItems: "center"
                                                    }}
                                                >
                                                    <Box
                                                        sx={{...styles.centerVH, minWidth: "140px"}}
                                                    >
                                                        <Avatar
                                                            {...stringAvatar(row.displayName.toUpperCase())}
                                                            src={row.pictureLink}
                                                            sx={{width: 40, height: 40}}
                                                        ></Avatar>
                                                    </Box>

                                                    <Typography
                                                        sx={{...styles.centerVH, minWidth: "140px"}}
                                                    >
                                                        {row.displayName}
                                                    </Typography>
                                                    <Typography
                                                        sx={{...styles.centerVH, width: "200px", minWidth: "300px"}}
                                                    >
                                                        {row.email}
                                                    </Typography>
                                                    <div>
                                                        <FormControl sx={{m: 1, minWidth: 140}}>
                                                            {/*<InputLabel id="demo-multiple-name-label">Name</InputLabel>*/}
                                                            <Select
                                                                labelId="demo-multiple-name-label"
                                                                id="demo-multiple-name"
                                                                value={changeRole || row?.role?.title}
                                                                onChange={handleChange}
                                                                // input={<OutlinedInput label="Name"/>}
                                                                inputProps={{
                                                                    renderValue: () => (changeRole || row?.role?.title),
                                                                }}
                                                            >
                                                                {listOfRoles.map((role: any) => (
                                                                    <MenuItem
                                                                        style={{display: "block"}}
                                                                        key={role.title}
                                                                        value={role.title}
                                                                        sx={{maxWidth: "240px"}}
                                                                    >
                                                                        <Typography>{role.title}</Typography>

                                                                        <div style={{
                                                                            color: "#D3D3D3",
                                                                            fontSize: "12px",
                                                                            whiteSpace: "break-spaces"
                                                                        }}>{role.description}</div>
                                                                    </MenuItem>
                                                                ))}
                                                            </Select>
                                                        </FormControl>
                                                    </div>
                                                    <Box
                                                        sx={{...styles.centerVH, width: "150px"}}
                                                        onClick={() => DeletePerson(row.id)}
                                                    >
                                                        <IconButton sx={{"&:hover": {color: "#d32f2f"}}} size="small">
                                                            <DeleteRoundedIcon/>
                                                        </IconButton>
                                                    </Box>
                                                </TableCell>

                                            </TableRow>
                                        );
                                    })}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    {/*        <TablePagination
                rowsPerPageOptions={[5, 10]}
                component="div"
                count={rows.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
            />*/}
                </Paper>
            </Box>
        </Box>
    )

}


const OnHoverInputTitleSetting = (props: any) => {
    const [show, setShow] = useState<boolean>(false);
    const [isHovering, setIsHovering] = useState(false);
    const handleMouseOver = () => {
        editable && setIsHovering(true);
    };

    const handleMouseOut = () => {
        setIsHovering(false);
    };
    const {data, editable, infoQuery, type, formMethods} = props;
    const [hasError, setHasError] = useState<boolean>(false);
    const [error, setError] = useState<any>({});
    const [inputData, setInputData] = useState<string>(data);
    const handleCancel = () => {
        setShow(false);
        setInputData(data);
        setError({});
        setHasError(false);
    };
    const {assessmentKitId} = useParams();
    const {service} = useServiceContext();
    const updateAssessmentKitQuery = useQuery({
        service: (
            args = {
                assessmentKitId: assessmentKitId,
                data: {[type]: inputData},
            },
            config
        ) => service.updateAssessmentKitStats(args, config),
        runOnMount: false,
        // toastError: true,
    });
    const updateAssessmentKit = async () => {
        try {
            /*        const res = await updateAssessmentKitQuery.query();
                    res.message && toast.success(res.message);
                    await infoQuery();*/
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
                }}
                width="100%"
            >

                {editable && show ? (
                    <Box
                        sx={{display: "flex", flexDirection: "column", width: "100% "}}
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
                                fontFamily: "Roboto",
                                fontWeight: "700",
                                fontSize: "0.875rem",
                            }}
                            endAdornment={
                                <InputAdornment position="end">
                                    <IconButton
                                        title="Submit Edit"
                                        edge="end"
                                        sx={{
                                            background: "#1976d299",
                                            borderRadius: "3px",
                                            height: "36px",
                                            margin: "3px",
                                        }}
                                        onClick={updateAssessmentKit}
                                    >
                                        <CheckCircleOutlineRoundedIcon sx={{color: "#fff"}}/>
                                    </IconButton>
                                    <IconButton
                                        title="Cancel Edit"
                                        edge="end"
                                        sx={{
                                            background: "#1976d299",
                                            borderRadius: "4px",
                                            height: "36px",
                                        }}
                                        onClick={handleCancel}
                                    >
                                        <CancelRoundedIcon sx={{color: "#fff"}}/>
                                    </IconButton>
                                </InputAdornment>
                            }
                        />
                        {hasError && (
                            <Typography color="#ba000d" variant="caption">
                                {error?.data?.[type]}
                            </Typography>
                        )}
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
                            "&:hover": {border: "1px solid #1976d299"},
                        }}
                        onClick={() => setShow(!show)}
                        onMouseOver={handleMouseOver}
                        onMouseOut={handleMouseOut}
                    >
                        <Typography color="#1CC2C4" fontWeight={500}
                                    sx={{fontSize: {xs: "18px", sm: "24px"}}}
                                    lineHeight={"normal"}>
                            {data.replace(/<\/?p>/g, "")}
                        </Typography>
                        {isHovering && (
                            <IconButton
                                title="Edit"
                                edge="end"
                                sx={{
                                    background: "#1976d299",
                                    borderRadius: "3px",
                                    height: "36px",
                                }}
                                onClick={() => setShow(!show)}
                            >
                                <EditRoundedIcon sx={{color: "#fff"}}/>
                            </IconButton>
                        )}
                    </Box>
                )}
            </Box>
        </Box>
    );
};
