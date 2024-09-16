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

const AddOnsDialog = (props: any) => {
    const {expanded,onClose, title, assessmentId} = props
    const uploadRef = useRef(null)

    const { service } = useServiceContext();

    const handelUpload = () =>{
        if(uploadRef){
            uploadRef.current.click()
        }
    }

    const UploadFile = useQuery({
        service: (args={file ,assessmentId}, config) =>
            service.FactSheetUpload(args, config),
    })

    const handleFileChange = async (event: any) => {
        const file = event.target.files[0];
        if (file) {
            try{
                await UploadFile.query({file,assessmentId})
            } catch(e) {
                console.log(e)
            }
        }
    };

    return (
        <Dialog
            open={expanded.display}
            onClose={onClose}
            maxWidth={"sm"}
            // fullScreen={fullScreen}
            fullWidth
            sx={{
                ".MuiDialog-paper::-webkit-scrollbar": {
                    display: "none",
                    scrollbarWidth: "none",
                    msOverflowStyle: "none",
                },
            }}
        >
            <DialogTitle textTransform="uppercase" sx={{ ...styles.centerV }}>
                    {title}
            </DialogTitle>
            <DialogContent
                sx={{
                    overflowX: "hidden",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "flex-start",
                    textAlign: "left",
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

                <Box mt={2} alignSelf="flex-end" sx={{ display: "flex", gap: 2 }}>
                    <Button onClick={onClose}>
                        <Trans i18nKey={"cancel"} />
                    </Button>
                    {/*<Button variant="contained" onClick={DeletePerson}>*/}
                    {/*    <Trans i18nKey={"confirm"} />*/}
                    {/*</Button>*/}
                </Box>
            </DialogContent>
        </Dialog>
    );
};

export default AddOnsDialog;