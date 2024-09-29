import Dialog from "@mui/material/Dialog";
import {DialogTitle} from "@mui/material";
import {styles} from "@styles";
import {Warning} from "@mui/icons-material";
import {Trans} from "react-i18next";
import DialogContent from "@mui/material/DialogContent";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import React, {useRef} from "react";
import LoadingButton from "@mui/lab/LoadingButton";
import {theme} from "@config/theme";
import toastError from "@utils/toastError";
import formatBytes from "@utils/formatBytes";
import {ICustomError} from "@utils/CustomError";
import {useQuery} from "@utils/useQuery";
import {useServiceContext} from "@providers/ServiceProvider";
import {toast} from "react-toastify";
import {CEDialog, CEDialogActions} from "@common/dialogs/CEDialog";

const AddOnsDialog = (props: any) => {
    const { onClose, title, assessmentId, ...rest } = props
    const uploadRef = useRef<any>(null)

    const { service } = useServiceContext();

    const handelUpload = () =>{
        if(uploadRef.current){
            uploadRef?.current?.click()
        }
    }

    const UploadFile = useQuery({
        service: ({file ,assessmentId :assessment_id}, config) =>
            service.FactSheetUpload({inputFile:file , assessment_id, analysisType:1}, config),
    })

    const handleFileChange = async (event: any) => {
        const file = event.target.files[0];
        if (file) {
            try{
            await UploadFile.query({file,assessmentId})
            onClose()
            toast("upload file successfully",{type:"success"})
            } catch(e) {
             const err = e as ICustomError;
             toastError(err);
            }
        }
    };

    return (
        <CEDialog
            {...rest}
            closeDialog={onClose}
            title={title}
        >
            <Box
                sx={{
                    overflowX: "hidden",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "flex-end",
                    textAlign: "right",
                }}
            >
                <Box sx={{width:"100%", display:"flex", justifyContent:"space-between", alignItems:"center"}}>
                    <Typography><Trans i18nKey={"factSheet"} /></Typography>
                    <LoadingButton loading={UploadFile.loading} onClick={handelUpload} sx={{background:theme.palette.primary.main,color:"#fff",
                        "&:hover":{background:theme.palette.primary.main}}}>
                        <Trans i18nKey={"uploadAttachment"} />
                    </LoadingButton>
                    <input accept="*/*" onChange={handleFileChange} ref={uploadRef} type={"file"} style={{display:"none"}}/>
                </Box>
                <CEDialogActions
                    closeDialog={onClose}
                    loading={UploadFile.loading}
                    hideSubmitButton={true}
                    type={"button"}
                >
                </CEDialogActions>
            </Box>
        </CEDialog>
    );
};

export default AddOnsDialog;