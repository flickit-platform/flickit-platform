import React, {useState} from "react";
import QueryBatchData from "@common/QueryBatchData";
import {useQuery} from "@utils/useQuery";
import {useServiceContext} from "@providers/ServiceProvider";
import {useLocation, useParams} from "react-router-dom";
import LoadingSkeletonOfAssessmentRoles from "@common/loadings/LoadingSkeletonOfAssessmentRoles";
import {Trans} from "react-i18next";
import {styles} from "@styles";
import {RolesType} from "@types";
import {
    AssessmentSettingGeneralBox,
    AssessmentSettingMemberBox
} from "@components/assessment-setting/AssessmentSettingBox";

import {Typography} from "@mui/material";

import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import AddMemberDialog from "@components/assessment-setting/addMemberDialog";
import ConfirmRemoveMemberDialog from "@components/assessment-setting/confirmRemoveMemberDialog";
import AssessmentSettingTitle from "@components/assessment-setting/AssessmentSettingTitle";

const AssessmentSettingContainer = () => {
    const {service} = useServiceContext();
    const {assessmentId = ""} = useParams();
    const [expanded, setExpanded] = useState<boolean>(false);
    const [expandedRemoveModal, setExpandedRemoveModal] = useState<{display: boolean,name: string, id: string}>({display:false,name:"", id:""});

    const { state } = useLocation();
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
    const fetchPathInfo = useQuery({
        service: (args, config) =>
            service.fetchPathInfo({assessmentId, ...(args || {})}, config),
        runOnMount: true,
    });

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

    const handleOpenRemoveModal = (name: string, id: string) =>{
        setExpandedRemoveModal({display: true,name , id})
    }
    const handleCloseRemoveModal = () =>{
        setExpandedRemoveModal({display: false, name:"", id :""})
    }

    return (
        <QueryBatchData
            queryBatchData={[
                fetchPathInfo,
                fetchAssessmentsRoles,
                fetchAssessmentsUserListRoles,
                AssessmentInfo
            ]}
            renderLoading={() => <LoadingSkeletonOfAssessmentRoles/>}
            render={([pathInfo = {},roles = {}, listOfUser = {}, assessmentInfo = {}]) => {
                const {space, assessment: {title}} = pathInfo;
                const {items: listOfRoles} = roles;

                return (
                    <Box m="auto" pb={3} sx={{px: {lg: 14, xs: 2, sm: 3}}}>
                        <AssessmentSettingTitle
                            pathInfo={pathInfo}
                        />
                        <Grid container columns={12} mt={3} mb={5}>
                            <Grid item sm={12} xs={12}>
                                <Box
                                    sx={{...styles.centerCVH}}
                                    gap={2}
                                    textAlign="center"
                                >
                                    <Typography color="#004F83"
                                                sx={{fontSize:{xs:"2.125rem",sm:"3.5rem"}}} fontWeight={900}>
                                        <Trans i18nKey="assessmentSettings"/>
                                    </Typography>
                                </Box>
                            </Grid>
                        </Grid>
                        <Grid container columns={12} mb={"32px"}>
                            <Grid item sm={12} xs={12}>
                                <AssessmentSettingGeneralBox
                                    AssessmentInfo={assessmentInfo}
                                    AssessmentTitle={title}
                                    fetchPathInfo={fetchPathInfo.query}
                                    color={state}
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
                                    openRemoveModal={ handleOpenRemoveModal}
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
                        <ConfirmRemoveMemberDialog
                            expandedRemoveDialog={expandedRemoveModal}
                            onCloseRemoveDialog={handleCloseRemoveModal}
                            assessmentId={assessmentId}
                            fetchAssessmentsUserListRoles={fetchAssessmentsUserListRoles.query}
                            assessmentName ={title}
                        />
                    </Box>
                );
            }}
        />
    )
}

export default AssessmentSettingContainer