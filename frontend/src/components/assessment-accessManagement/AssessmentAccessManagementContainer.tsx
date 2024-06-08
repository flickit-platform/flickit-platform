import React, {useEffect, useState} from "react";
import Box from "@mui/material/Box";
import AssessmentAccessManagementTitle from "./AssessmentAccessManagementTitle"
import QueryBatchData from "@common/QueryBatchData";
import {useQuery} from "@utils/useQuery";
import {useServiceContext} from "@providers/ServiceProvider";
import {useParams} from "react-router-dom";
import LoadingSkeletonOfAssessmentRoles from "@common/loadings/LoadingSkeletonOfAssessmentRoles";
import stringAvatar from "@utils/stringAvatar";
import {Trans} from "react-i18next";
import {styles} from "@styles";
import {IAssessmentReportModel, IMemberModel, UserRoles} from "@types";
import {ICustomError} from "@utils/CustomError";
import toastError from "@utils/toastError";
import AssessmentAccessManagermentBox from "@components/assessment-accessManagement/AssessmentAccessManagermentBox";

import {FormControl, SelectChangeEvent, Typography} from "@mui/material";
import Paper from '@mui/material/Paper';
import Grid from "@mui/material/Grid";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Avatar from "@mui/material/Avatar";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import IconButton from "@mui/material/IconButton";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import useScreenResize from "@utils/useScreenResize";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import Button from "@mui/material/Button";
import ListItem from "@mui/material/ListItem";

const AssessmentAccessManagementContainer = () => {
    const {service} = useServiceContext();
    const {assessmentId = ""} = useParams();

    const [expanded, setExpanded] = useState<boolean>(false);


    const fetchAssessmentsUserRoles = useQuery<IAssessmentReportModel>({
        service: (args, config) =>
            service.fetchAssessmentsUserRoles(args, config),
        toastError: false,
        toastErrorOptions: {filterByStatus: [404]},
    });

    const fetchAssessmentsUserlistRoles = useQuery<IAssessmentReportModel>({
        service: (args = {assessmentId}, config) =>
            service.fetchAssessmentsUserlistRoles(args, config),
        toastError: false,
        toastErrorOptions: {filterByStatus: [404]},
    });

    const fetchPathInfo = useQuery({
        service: (args, config) =>
            service.fetchPathInfo({assessmentId, ...(args || {})}, config),
        runOnMount: true,
    });

    const addMember = async (e: any) => {
        try {
            // await deleteEvidence.query();
            // await evidencesQueryData.query();
        } catch (e) {
            const err = e as ICustomError;
            toastError(err);
        }
    };

    const handleClickOpen = () => {
        setExpanded(true);
    };

    const handleClose = () => {
        setExpanded(false);
    };

    return (
        <QueryBatchData
            queryBatchData={[fetchPathInfo, fetchAssessmentsUserRoles]}
            renderLoading={() => <LoadingSkeletonOfAssessmentRoles/>}
            render={([pathInfo = {}, UserRoles = {}]) => {
                const {space, assessment: {title}} = pathInfo;
                const {items: listOfRoles} = UserRoles;

                return (
                    <Box m="auto" pb={3} sx={{px: {lg: 14, xs: 2, sm: 3}}}>
                        <AssessmentAccessManagementTitle
                            pathInfo={pathInfo}
                        />
                        <Grid container columns={12} mt={3} mb={5}>
                            <Grid item sm={12} xs={12}>
                                <Box
                                    sx={{...styles.centerCVH}}
                                    gap={2}
                                    textAlign="center"
                                >
                                    <Typography color="#1CC2C4" fontSize="44px" fontWeight={900}>
                                        <Trans i18nKey="assessmentSettings"/>
                                    </Typography>
                                </Box>
                            </Grid>
                        </Grid>
                        <Grid container columns={12} mb={"32px"}>
                            <Grid item sm={12} xs={12}>
                                <AssessmentAccessManagermentBox
                                    assessmentTitle={title}
                                    boxTitle={"general"}
                                >
                                    <GeneralSection/>
                                </AssessmentAccessManagermentBox>
                            </Grid>
                        </Grid>
                        <Grid container columns={12}>
                            <Grid item sm={12} xs={12}>
                                <AssessmentAccessManagermentBox
                                    boxTitle={"members"}
                                    openModal={handleClickOpen}
                                >
                                    <MemberSection listOfRoles={listOfRoles}
                                                   fetchAssessmentsUserlistRoles={fetchAssessmentsUserlistRoles.query}
                                                   fetchAssessmentsUserRoles={fetchAssessmentsUserRoles.query}
                                    />
                                </AssessmentAccessManagermentBox>
                            </Grid>
                        </Grid>
                        <AddMemeberDialog
                            expanded={expanded}
                            onClose={handleClose}
                            onConfirm={addMember}
                            listOfRoles={listOfRoles}
                            title={<Trans i18nKey={"addNewMember"}/>}
                            cancelText={<Trans i18nKey={"cancel"}/>}
                            confirmText={<Trans i18nKey={"addToThisAssessment"}/>}
                        />
                    </Box>
                );
            }}
        />
    )
}

const AddMemeberDialog = (props: {
    expanded: boolean, onClose: () => void, onConfirm: any,
    title: any, cancelText: any, confirmText: any
    listOfRoles: UserRoles[]
}) => {
    const {
        expanded, onClose, onConfirm, title, cancelText, confirmText,
        listOfRoles
    } = props;

    const [memberOfSpace, setMemberOfSpace] = useState<any[]>([])
    const [memberSelected, setMemberSelected] = useState<any>([])
    const [roleSelected, setRoleSelected] = useState("")
    const {service} = useServiceContext();
    const {spaceId = ""} = useParams();

    const fullScreen = useScreenResize("sm");

    const spaceMembersQueryData = useQuery({
        service: (args, config) => service.fetchSpaceMembers({spaceId}, config),
    });

    const handleChangeMember = (event: SelectChangeEvent<typeof memberOfSpace>) => {
        const {
            target: {value},
        } = event;
        setMemberSelected(value)

    };
    const handleChangeRole = (event: SelectChangeEvent<typeof roleSelected>) => {
        const {
            target: {value},
        } = event;
        setRoleSelected(value)
    };

    useEffect(() => {
        (async () => {
            try {
                const {data: {items}} = await spaceMembersQueryData
                const filtredItems = items.filter((item: any) => !item.isOwner)
                setMemberOfSpace(filtredItems)
            } catch (e) {
                console.log(e)
            }
        })()
    }, [expanded]);

    return (
        <Dialog
            open={expanded}
            onClose={onClose}
            maxWidth={"sm"}
            // fullScreen={fullScreen}
            fullWidth
            sx={{
                ".MuiDialog-paper": {
                    borderRadius: "32px",
                },
                ".MuiDialog-paper::-webkit-scrollbar": {
                    display: "none",
                    scrollbarWidth: "none",
                    msOverflowStyle: "none",
                },
            }}
        >
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
                }}
            >
                <Box
                    sx={{backgroundColor: "#1CC2C4", width: "100%"}}
                >
                    <Typography
                        variant={"h5"}
                        sx={{
                            color: "#EDF4FC",
                            fontsize: "32px",
                            lineHeight: '36.77px',
                            fontWeight: 700,
                            paddingY: "24px",
                            letterSpacing: '1.3px'
                        }}>{title}</Typography>
                </Box>
                <Box
                    display="flex"
                    alignItems="center"
                    justifyContent={"center"}
                    gap={1}
                >
                    <Typography>
                        <Trans i18nKey={"add"}/>
                    </Typography>
                    <div>
                        <FormControl sx={{
                            m: 1, minWidth: {xs: 90, sm: 150}
                        }}
                        >
                            <Select
                                labelId="demo-simple-select-autowidth-label"
                                id="demo-simple-select-autowidth"
                                value={memberSelected}
                                onChange={handleChangeMember}
                                autoWidth
                            >
                                {memberOfSpace.map(member => {
                                    return (
                                        <MenuItem key={member.id} value={member.displayName}
                                        >
                                            <Box style={{display: "flex", gap: "2px"}}>
                                                <Avatar
                                                    {...stringAvatar(member.displayName.toUpperCase())}
                                                    src={member.pictureLink}
                                                />
                                                <ListItem sx={{paddingX: "unset"}}>
                                                    {member.displayName}
                                                </ListItem>
                                            </Box>
                                        </MenuItem>
                                    )
                                })}
                            </Select>
                        </FormControl>
                    </div>
                    <Typography>
                        <Trans i18nKey={"as"}/>
                    </Typography>
                    <div>
                        <FormControl sx={{m: 1, minWidth: {xs: 90, sm: 150}, maxWidth: 150}}>
                            <Select
                                labelId="demo-simple-select-autowidth-label"
                                id="demo-simple-select-autowidth"
                                value={roleSelected}
                                onChange={handleChangeRole}
                                autoWidth
                            >
                                {listOfRoles.map(roles => {
                                    return (
                                        <MenuItem key={roles.id} value={roles.title}>{roles.title}</MenuItem>
                                    )
                                })}
                            </Select>
                        </FormControl>
                    </div>
                </Box>
                <Box sx={{
                    width: "100%", display: "flex", gap: 2, padding: "16px",
                    justifyContent: "center"
                }}>
                    <Button
                        sx={{
                            color: "#1CC2C4",
                            "&.MuiButton-root": {
                                border: "unset",
                            },
                            "&.MuiButton-root:hover": {
                                background: "unset",
                                border: "unset",
                            },
                        }}
                        variant="outlined"
                        onClick={onClose}
                    >
                        {cancelText}
                    </Button>
                    <Button
                        sx={{
                            "&.MuiButton-root": {
                                color: "#EDFCFC",
                                border: "1px solid #1CC2C4",
                                background: "#1CC2C4",
                                borderRadius: "100px",
                            },
                            "&.MuiButton-root:hover": {
                                background: "#1CC2C4",
                                border: "1px solid #1CC2C4",
                            },
                        }}
                        variant="contained"
                        onClick={onConfirm}
                    >
                        {confirmText}
                    </Button>
                </Box>
            </DialogContent>
        </Dialog>
    );
};


const GeneralSection = () => {
    return (
        <Grid container
              sx={{
                  height: "100%",
                  width: "100%",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: 'space-between',
                  alignItems: "center",
                  gap: "32px"
              }}
        >
            <Grid item
                  sx={{
                      width: "100%",
                      display: "flex",
                      justifyContent: 'space-around',
                      alignItems: "center",
                  }}
            >
                <Grid item
                      sx={{
                          display: "flex",
                          width: {xs: "100%", md: "50%"},
                          justifyContent: "end"
                      }}
                >
                    <Typography color="#9DA7B3" fontWeight={500}
                                whiteSpace={"nowrap"}
                                sx={{
                                    display: "flex",
                                    justifyContent: "start",
                                    fontSize: {xs: "18px", md: "24px"},
                                    width: {xs: "100%", md: "60%"},
                                }}
                                lineHeight={"normal"}>
                        <Trans i18nKey="creator"/>
                    </Typography>
                </Grid>
                <Typography color="#0A2342" fontWeight={500}
                            sx={{
                                display: "flex",
                                justifyContent: {xs: "end", md: "center"},
                                fontSize: {xs: "18px", md: "24px"},
                                width: {xs: "100%", md: "50%"},
                            }}
                            lineHeight={"normal"}>
                    "hi"
                </Typography>
            </Grid>
            <Grid item
                  sx={{
                      width: "100%",
                      display: "flex",
                      justifyContent: 'space-around',
                      alignItems: "center",
                  }}
            >
                <Grid item
                      sx={{
                          display: "flex",
                          width: {xs: "100%", md: "50%"},
                          justifyContent: "end"
                      }}
                >
                    <Typography color="#9DA7B3" fontWeight={500}
                                whiteSpace={"nowrap"}
                                sx={{
                                    display: "flex",
                                    justifyContent: "start",
                                    fontSize: {xs: "18px", md: "24px"},
                                    width: {xs: "100%", md: "60%"},
                                }}
                                lineHeight={"normal"}>
                        <Trans i18nKey="Created"/>
                    </Typography>
                </Grid>
                <Typography color="#0A2342" fontWeight={500}
                            sx={{
                                display: "flex",
                                justifyContent: {xs: "end", md: "center"},
                                fontSize: {xs: "18px", md: "24px"},
                                width: {xs: "100%", md: "50%"},
                            }}
                            lineHeight={"normal"}>
                    "hi"
                </Typography>
            </Grid>
            <Grid item
                  sx={{
                      width: "100%",
                      display: "flex",
                      justifyContent: 'space-around',
                      alignItems: "center",
                  }}
            >
                <Grid item
                      sx={{
                          display: "flex",
                          width: {xs: "100%", md: "50%"},
                          justifyContent: "end"
                      }}
                >
                    <Typography color="#9DA7B3" fontWeight={500}
                                whiteSpace={"nowrap"}
                                sx={{
                                    display: "flex",
                                    justifyContent: "start",
                                    fontSize: {xs: "18px", md: "24px"},
                                    width: {xs: "100%", md: "60%"},
                                }}
                                lineHeight={"normal"}>
                        <Trans i18nKey="assessmentkit"/>
                    </Typography>
                </Grid>
                <Typography color="#0A2342" fontWeight={500}
                            sx={{
                                display: "flex",
                                justifyContent: {xs: "end", md: "center"},
                                fontSize: {xs: "18px", md: "24px"},
                                width: {xs: "100%", md: "50%"},
                            }}
                            lineHeight={"normal"}>
                    "hi"
                </Typography>
            </Grid>
        </Grid>
    )
}

const MemberSection = (props: { listOfRoles: UserRoles[],
    fetchAssessmentsUserlistRoles: ()=> void,
    fetchAssessmentsUserRoles: ()=> void
}) => {
    const {service} = useServiceContext();
    const {assessmentId = ""} = useParams();

    const {listOfRoles,fetchAssessmentsUserlistRoles,fetchAssessmentsUserRoles} = props

    interface Column {
        id: 'displayName' | 'email' | 'role'
        label: string;
        minWidth?: number;
        align?: 'right';
        format?: (value: number) => string;
    }

    const deleteUserRole = useQuery({
        service: (args, config) =>
            service.deleteUserRole({assessmentId, ...(args || {})}, config),
        runOnMount: true,
    });


    const columns: readonly Column[] = [
        {id: 'displayName', label: '', minWidth: 140},
        {id: 'displayName', label: 'Name', minWidth: 140},
        {id: 'email', label: 'email', minWidth: 140},
        {
            id: 'role',
            label: 'rouls',
            minWidth: 140,
            align: 'right',
        },
        {
            id: 'role',
            label: '',
            minWidth: 140,
            align: 'right',
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


    const Deleteperson = async () => {
     try{
         await  deleteUserRole.query()
         await fetchAssessmentsUserRoles
         await fetchAssessmentsUserlistRoles
     }catch(e){
         console.log(e)
     }


    }

    return (
        <Paper sx={{width: '100%', overflow: 'hidden'}}>
            <TableContainer sx={{maxHeight: 440}}>
                <Table stickyHeader aria-label="sticky table">
                    <TableHead>
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
                        {rows
                            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                            .map((row: any) => {
                                return (
                                    <TableRow
                                        tabIndex={-1} key={row.code}>
                                        <TableCell
                                            sx={{display: "flex", justifyContent: "center", alignItems: "center"}}
                                            key={row.id}>
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
                                                sx={{...styles.centerVH, minWidth: "140px"}}
                                            >
                                                {row.email}
                                            </Typography>
                                            <div>
                                                <FormControl sx={{m: 1, minWidth: 140}}>
                                                    {/*<InputLabel id="demo-multiple-name-label">Name</InputLabel>*/}
                                                    <Select
                                                        labelId="demo-multiple-name-label"
                                                        id="demo-multiple-name"
                                                        value={changeRole}
                                                        onChange={handleChange}
                                                        // input={<OutlinedInput label="Name"/>}
                                                    >
                                                        {listOfRoles.map((role) => (
                                                            <MenuItem
                                                                key={role.title}
                                                                value={role.title}
                                                            >
                                                                {role.title}
                                                            </MenuItem>
                                                        ))}
                                                    </Select>
                                                </FormControl>
                                            </div>
                                            <Box
                                                sx={{...styles.centerVH, width: "150px"}}
                                                onClick={Deleteperson}
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
            <TablePagination
                rowsPerPageOptions={[5, 10]}
                component="div"
                count={rows.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
            />
        </Paper>
    );
}
export default AssessmentAccessManagementContainer