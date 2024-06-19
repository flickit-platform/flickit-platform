import useScreenResize from "@utils/useScreenResize";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import React from "react";
import {ICustomError} from "@utils/CustomError";
import toastError from "@utils/toastError";
import {useQuery} from "@utils/useQuery";
import {useServiceContext} from "@providers/ServiceProvider";
import {Trans} from "react-i18next";

const ConfirmRemoveMemberDialog = (props: any) => {
    const { expandedRemoveDialog, onCloseRemoveDialog, assessmentId,assessmentName,
        fetchAssessmentsUserListRoles,setChangeData
    } = props;

    const {service} = useServiceContext();

    const deleteUserRole = useQuery({
        service: (args, config) =>
            service.deleteUserRole({assessmentId, args}, config),
        runOnMount: false,
    });

    const DeletePerson = async () => {
        try {
            await deleteUserRole.query(expandedRemoveDialog?.id)
            onCloseRemoveDialog()
            setChangeData((prev : boolean) => !prev)
            // await fetchAssessmentsUserListRoles()
        } catch (e) {
            const err = e as ICustomError;
            toastError(err);
        }
    }

    return (
        <Dialog
            open={expandedRemoveDialog.display}
            onClose={onCloseRemoveDialog}
            maxWidth={"sm"}
            // fullScreen={fullScreen}
            fullWidth
            sx={{
                ".MuiDialog-paper": {
                    borderRadius:"32px" ,
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
                    padding: "32px",
                    background: "#fff",
                    overflowX: "hidden",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    textAlign: "center",
                    gap: 6,
                }}
            >
                <Typography sx={{ color: "#0A2342" }}>
                    <Trans
                        i18nKey="areYouSureYouWantDeleteThisMember"
                        values={{
                            name: expandedRemoveDialog?.name,
                            assessment: assessmentName
                        }}
                    />
                </Typography>

                <Box sx={{ display: "flex", gap: 2 }}>
                    <Button
                        sx={{
                            "&.MuiButton-root": {
                                color: "#0A2342",
                                border: "1px solid #0A2342",
                                borderRadius: "100px",
                            },
                            "&.MuiButton-root:hover": {
                                background: "#CED3D9  ",
                                border: "1px solid #0A2342",
                            },
                        }}
                        variant="outlined"
                        onClick={onCloseRemoveDialog}
                    >
                        <Trans i18nKey={"letMeCheckAgain"}/>
                    </Button>
                    <Button
                        sx={{
                            "&.MuiButton-root": {
                                color: "#FDF1F5",
                                border: "1px solid #D81E5B",
                                background: "#D81E5B",
                                borderRadius: "100px",
                            },
                            "&.MuiButton-root:hover": {
                                background: "#AD1849  ",
                                border: "1px solid #AD1849",
                            },
                        }}
                        variant="contained"
                        onClick={DeletePerson}
                    >
                        <Trans i18nKey={"yesContinue"}/>
                    </Button>
                </Box>
            </DialogContent>
        </Dialog>
    );
};

export default ConfirmRemoveMemberDialog;