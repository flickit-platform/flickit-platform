import React, {useEffect, useState} from "react";
import QueryBatchData from "@common/QueryBatchData";
import {useQuery} from "@utils/useQuery";
import {useServiceContext} from "@providers/ServiceProvider";
import {useParams} from "react-router-dom";
import LoadingSkeletonOfAssessmentRoles from "@common/loadings/LoadingSkeletonOfAssessmentRoles";
import stringAvatar from "@utils/stringAvatar";
import {Trans} from "react-i18next";
import {styles} from "@styles";
import {RolesType} from "@types";
import {ICustomError} from "@utils/CustomError";
import toastError from "@utils/toastError";
import {
    AssessmentSettingGeneralBox,
    AssessmentSettingMemberBox
} from "@components/assessment-setting/AssessmentSettingBox";

import {FormControl, SelectChangeEvent, Typography} from "@mui/material";

import Grid from "@mui/material/Grid";
import Avatar from "@mui/material/Avatar";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import Button from "@mui/material/Button";
import ListItem from "@mui/material/ListItem";
import Box from "@mui/material/Box";

const AssessmentSettingContainer = () => {
    const {service} = useServiceContext();
    const {assessmentId = ""} = useParams();
    const [expanded, setExpanded] = useState<boolean>(false);

    const fetchAssessmentsRoles = useQuery<RolesType>({
        service: (args, config) =>
            service.fetchAssessmentsRoles(args, config),
        toastError: false,
        toastErrorOptions: {filterByStatus: [404]},
    });

    const fetchAssessmentsUserListRoles = useQuery({
        service: (args = {assessmentId}, config) =>
            service.fetchAssessmentsUserListRoles(args, config),
        toastError: false,
        toastErrorOptions: {filterByStatus: [404]},
    });
    // const fetchPathInfo = useQuery({
    //     service: (args, config) =>
    //         service.fetchPathInfo({assessmentId, ...(args || {})}, config),
    //     runOnMount: true,
    // });

    const AssessmentInfo = useQuery({
        service: (args = {assessmentId}, config) =>
            service.AssessmentsLoad(args, config),
        toastError: false,
        toastErrorOptions: {filterByStatus: [404]},
    });

    const handleClickOpen = () => {
        setExpanded(true);
    };

    const handleClose = () => {
        setExpanded(false);
    };
    let title = "test"
    return (
        <QueryBatchData
            queryBatchData={[
                // fetchPathInfo,
                fetchAssessmentsRoles,
                fetchAssessmentsUserListRoles,
                AssessmentInfo
            ]}
            renderLoading={() => <LoadingSkeletonOfAssessmentRoles/>}
            render={([
                         // pathInfo = {},
                         Roles = {}, listOfUser = [], AssessmentInfo = {}]) => {
                // const {space, assessment: {title}} = pathInfo;
                const {items: listOfRoles} = Roles;

                return (
                    <Box m="auto" pb={3} sx={{px: {lg: 14, xs: 2, sm: 3}}}>
                        {/*<AssessmentAccessManagementTitle*/}
                        {/*    pathInfo={pathInfo}*/}
                        {/*/>*/}
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
                                <AssessmentSettingGeneralBox
                                    AssessmentInfo={AssessmentInfo}
                                />
                            </Grid>
                        </Grid>
                        <Grid container columns={12}>
                            <Grid item sm={12} xs={12}>
                                <AssessmentSettingMemberBox
                                    listOfRoles={listOfRoles}
                                    listOfUser={listOfUser}
                                    fetchAssessmentsUserListRoles={fetchAssessmentsUserListRoles.query}
                                    openModal={handleClickOpen}
                                />

                            </Grid>
                        </Grid>
                        <AddMemberDialog
                            expanded={expanded}
                            onClose={handleClose}
                            listOfRoles={listOfRoles}
                            assessmentId={assessmentId}
                            fetchAssessmentsUserListRoles={fetchAssessmentsUserListRoles.query}
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

const AddMemberDialog = (props: {
    expanded: boolean, onClose: () => void,
    title: any, cancelText: any, confirmText: any
    listOfRoles: any, assessmentId: any, fetchAssessmentsUserListRoles: any
}) => {
    const {
        expanded, onClose, title, cancelText, confirmText,
        listOfRoles, assessmentId, fetchAssessmentsUserListRoles
    } = props;

    const [memberOfSpace, setMemberOfSpace] = useState<any[]>([])
    const [memberSelected, setMemberSelected] = useState<any>([])
    const [roleSelected, setRoleSelected] = useState({id: 0, title: ""})
    const {service} = useServiceContext();
    const {spaceId = ""} = useParams();

    const spaceMembersQueryData = useQuery({
        service: (args, config) => service.fetchSpaceMembers({spaceId}, config),
    });

    const addRoleMemberQueryData = useQuery({
        service: (args = {assessmentId, userId: memberSelected, roleId: roleSelected.id},
                  config) => service.addRoleMember(
            args, config),
        runOnMount: false,
    });

    const handleChangeMember = (event: SelectChangeEvent<typeof memberOfSpace>) => {
        const {
            target: {value},
        } = event;
        setMemberSelected(value)

    };
    const handleChangeRole = (event: any) => {
        const {
            target: {value: {id, title}},
        } = event;
        setRoleSelected({id, title})
    };

    useEffect(() => {
        (async () => {
            try {
                const {data} = await spaceMembersQueryData
                if (data) {
                    const {items} = data
                    const filtredItems = items.filter((item: any) => !item.isOwner)
                    setMemberOfSpace(filtredItems)
                }
            } catch (e) {
                const err = e as ICustomError;
                toastError(err);
            }
        })()
    }, [expanded]);

    const closeDialog = () => {
        onClose()
        setMemberSelected([])
        setRoleSelected({id: 0, title: ""})
    }

    const onConfirm = async (e: any) => {
        try {
            await addRoleMemberQueryData.query()
            await fetchAssessmentsUserListRoles()
            closeDialog()
        } catch (e) {
            const err = e as ICustomError;
            toastError(err);
            closeDialog()
        }
    };

    return (
        <Dialog
            open={expanded}
            onClose={closeDialog}
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
                                        <MenuItem key={member.id} value={member.id}
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
                        <FormControl
                            sx={{m: 1, minWidth: {xs: 90, sm: 150}, maxWidth: 150}}>
                            <Select
                                labelId="demo-simple-select-autowidth-label"
                                id="demo-simple-select-autowidth"
                                value={roleSelected?.title}
                                onChange={handleChangeRole}
                                autoWidth
                                disabled={!memberSelected}
                                inputProps={{
                                    renderValue: () => (roleSelected.title),
                                }}
                            >
                                {listOfRoles.map((role: any) => {
                                    return (
                                        <MenuItem
                                            style={{display: "block"}}
                                            key={role.title}
                                            value={role}
                                            id={role.id}
                                            sx={{maxWidth: "240px"}}
                                        >
                                            <Typography>{role.title}</Typography>
                                            <div style={{
                                                color: "#D3D3D3",
                                                fontSize: "12px",
                                                whiteSpace: "break-spaces"
                                            }}>{role.description}</div>
                                        </MenuItem>)
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
                        onClick={closeDialog}
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

export default AssessmentSettingContainer