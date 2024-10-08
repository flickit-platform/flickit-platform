import Box from "@mui/material/Box";
import Title from "@common/Title";
import {useServiceContext} from "@providers/ServiceProvider";
import {useParams} from "react-router-dom";
import {useQuery} from "@utils/useQuery";
import QueryBatchData from "@common/QueryBatchData";
import {Trans} from "react-i18next";
import SupTitleBreadcrumb from "@common/SupTitleBreadcrumb";
import {t} from "i18next";
import setDocumentTitle from "@utils/setDocumentTitle";
import toastError from "@utils/toastError";
import {ICustomError} from "@utils/CustomError";
import {useConfigContext} from "@/providers/ConfgProvider";
import SettingBox from "@common/settingBox";

const AssessmentKitPermissionsContainer = () => {
    const {service} = useServiceContext();
    const {assessmentKitId} = useParams();
    const assessmentKitUsersListQueryData = useQuery({
        service: (args = {assessmentKitId: assessmentKitId}, config) =>
            service.assessmentKitUsersList(args, config),
    });
    const assessmentKitMinInfoQueryData = useQuery({
        service: (args = {assessmentKitId: assessmentKitId}, config) =>
            service.assessmentKitMinInfo(args, config),
    });

    const {config} = useConfigContext();
    return (
        <QueryBatchData
            queryBatchData={[
                assessmentKitUsersListQueryData,
                assessmentKitMinInfoQueryData,
            ]}
            render={([data = {}, info = {}]) => {
                setDocumentTitle(
                    `${t("assessmentKit")}: ${info?.expertGroup?.title || ""}`,
                    config.appTitle,
                );
                return (
                    <AssessmentKitPermisson
                        data={data}
                        query={assessmentKitUsersListQueryData}
                        info={info}
                    />
                );
            }}
        />
    );
};

const AssessmentKitPermisson = (props: any) => {
    const {data, query, info} = props;
    const {items} = data;
    const {id, title, expertGroup} = info;

    interface Column {
        id: "displayName" | "email" | "remove";
        label: string;
        minWidth?: string;
        align?: "right";
        display?: string;
        position: string;
    }

    const columns: readonly Column[] = [
        {
            id: "displayName",
            label: "Name",
            minWidth: "20vw",
            position: "left"
        },
        {
            id: "email",
            label: "Email",
            display: "none",
            minWidth: "20vw",
            position: "center",
        },
        {
            id: "remove",
            label: "Remove",
            align: "right",
            minWidth: "20vw",
            position: "center",
        },
    ];

    const {service} = useServiceContext();
    const {assessmentKitId} = useParams();
    const deleteMemberToKitPermissionQueryData = useQuery({
        service: (args, config) =>
            service.deleteMemberToKitPermission(args, config),
        runOnMount: false,
    });

    return (
        <Box>
            <Title
                inPageLink="assessmentKitPermissons"
                size="small"
                sx={{mb:"20px"}}
                sup={
                    <SupTitleBreadcrumb
                        routes={[
                            {
                                title: t("expertGroups") as string,
                                to: `/user/expert-groups`,
                            },
                            {
                                title: expertGroup.title,
                                to: `/user/expert-groups/${expertGroup.id} `,
                            },
                            {
                                title: title,
                                to: `/user/expert-groups/${expertGroup.id}/assessment-kits/${id}`,
                            },
                            {
                                title: "permissions",
                                to: `/user/expert-groups/${expertGroup.id}/assessment-kits/${id}/permissions`,
                            },
                        ]}
                    />
                }
            >
                <Trans
                    i18nKey={"assessmentKitPermissons"}
                    values={{assessmentKit: title}}
                />
            </Title>
            <SettingBox
                name={"EGPermissionSettingBox"}
                title={"members"}
                hasBtn={true}
                btnLabel={"addMember"}
                listOfUser={items}
                query={query}
                columns={columns}
            />
        </Box>
    );
};

export default AssessmentKitPermissionsContainer;
