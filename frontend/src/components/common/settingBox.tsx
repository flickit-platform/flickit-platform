import React, {useRef, useState} from 'react';
import Box from "@mui/material/Box";
import { Divider, IconButton, TextField, Typography} from "@mui/material";
import {Trans} from "react-i18next";
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";
import TableContainer from "@mui/material/TableContainer";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import TableBody from "@mui/material/TableBody";
import Grid from "@mui/material/Grid";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import {CEDialog, CEDialogActions} from "@common/dialogs/CEDialog";
import FormProviderWithForm from "@common/FormProviderWithForm";
import {styles} from "@styles";
import {useForm} from "react-hook-form";
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import {toast} from "react-toastify";
import {ICustomError} from "@utils/CustomError";
import toastError from "@utils/toastError";
import {t} from "i18next";
import {useServiceContext} from "@providers/ServiceProvider";
import {useParams} from "react-router-dom";
import {useQuery} from "@utils/useQuery";

const SettingBox = (props: any) => {
    const { title, items, deleteMember, queryData } = props
    const[openModal,setOpenModal] = useState(false)


    const onClose = () =>{
        setOpenModal(false)
    }

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
                        justifyContent: "center",
                        alignItems: "center",
                        position: "relative",
                        width: "90%",
                        ml: "10%",
                    }}
                >
                    <Typography ml="auto" color="#9DA7B3" variant="headlineMedium">
                        <Trans i18nKey={title} />
                    </Typography>
                    <Button
                        variant="contained"
                        onClick={()=>setOpenModal(true)}
                        aria-hidden
                        sx={{ ml: "auto", display: "flex", alignItems: "center" }}
                    >
                        <AddIcon
                            sx={{ width: "1.125rem", height: "1.125rem" }}
                            fontSize="small"
                            style={{ color: "#EDFCFC" }}
                        />
                        <Trans i18nKey={"addMember"} />
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
                                tabIndex={-1}
                                sx={{display:"flex",justifyContent:"center"}}
                            >
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
                                    <Box sx={{ width: "18vw" }}>
                                        <Box
                                            sx={{
                                                display: "flex",
                                                justifyContent: { xs: "flex-start" },
                                                alignItems: "center",
                                                gap: ".5rem",
                                                paddingLeft: { lg: "30%" },
                                            }}
                                        >
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
                                           <Trans i18nKey={"name"}/>
                                            </Typography>
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
                                            <Trans i18nKey={"email"}/>
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

                                        <Box
                                            width="100%"
                                            display="flex"
                                            justifyContent="center"
                                            alignItems="center"
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
                                                <Trans i18nKey={"remove"}/>
                                            </Typography>
                                        </Box>
                                    </Box>
                                </TableCell>
                            </TableRow>
                        </TableHead>

                        {/* Move the Divider outside the TableHead */}
                        <TableBody>
                            {items.length > 0 &&
                                items.map((row: any) => (
                                    <TableRow
                                        tabIndex={-1}
                                        key={row.id}
                                        sx={{display:"flex",justifyContent:"center"}}
                                    >
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
                                            <Box sx={{ width: "18vw" }}>
                                                <Box
                                                    sx={{
                                                        display: "flex",
                                                        justifyContent: { xs: "flex-start" },
                                                        alignItems: "center",
                                                        gap: ".5rem",
                                                        paddingLeft: { lg: "30%" },
                                                    }}
                                                >
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
                                                        {row.name}
                                                    </Typography>
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

                                                    <Box
                                                        width="100%"
                                                        display="flex"
                                                        justifyContent="center"
                                                        alignItems="center"
                                                    >
                                                        <IconButton
                                                            sx={{ "&:hover": { color: "#d32f2f" } }}
                                                            size="small"
                                                            onClick={() =>{deleteMember(row.id)}
                                                                // openRemoveModal(row.displayName, row.id)
                                                            }
                                                        >
                                                            <DeleteRoundedIcon />
                                                        </IconButton>
                                                    </Box>
                                            </Box>
                                        </TableCell>
                                    </TableRow>
                                ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>
            <AddMemberModal query={queryData} open={openModal} close={onClose} />
        </Box>
    );
};

const AddMemberModal = (props: any) =>{
    const {close,query, ...rest} = props
    const formMethods = useForm({ shouldUnregister: true });
    const inputRef = useRef<HTMLInputElement>(null);
    const { service } = useServiceContext();
    const { assessmentKitId } = useParams();

    const addMemberQueryData = useQuery({
        service: (args, config) => service.addMemberToKitPermission(args, config),
        runOnMount: false,
    });
    const onSubmit = async () => {
        try {
            const res = await addMemberQueryData.query({
                assessmentKitId: assessmentKitId,
                email: inputRef.current?.value,
            });
            res?.message && toast.success(res.message);
            await query.query();
            close()
        } catch (e) {
            const error = e as ICustomError;
            close()
            if (
                error.response?.data &&
                error.response?.data.hasOwnProperty("message")
            ) {
                if (Array.isArray(error.response?.data?.message)) {
                    toastError(error.response?.data?.message[0]);
                } else {
                    toastError(error);
                }
            }
        }
    };

    return (
        <CEDialog
            {...rest}
            fullScreen={false}
            closeDialog={close}
            title={
            <>
               <PersonAddIcon sx={{ mr: 1 }} />
               <Trans i18nKey="addMember" />
            </>
        }
        >
            <FormProviderWithForm
                formMethods={formMethods}
            >
                <Grid container spacing={2} sx={styles.formGrid}>
                    {/* <Grid item xs={12}>
            <InputFieldUC
              name="code"
              required={true}
              defaultValue={defaultValues.code || nanoid(5)}
              label={<Trans i18nKey="code" />}
            />
          </Grid> */}
                    <Grid item xs={12}>
                        <AddMember inputRef={inputRef} queryData={query} />
                    </Grid>
                </Grid>
                <CEDialogActions
                    closeDialog={close}
                    loading={addMemberQueryData.loading}
                    type={"submit"}
                    onSubmit={formMethods.handleSubmit(onSubmit)}
                    submitButtonLabel={"add"}
                />
            </FormProviderWithForm>
        </CEDialog>
    )
}
const AddMember = (props: any) => {
    const { inputRef } = props;
return (
    <Box
        component="form"
        sx={{ mb: 2, mt: 0 }}
    >
        <TextField
            fullWidth
            type={"email"}
            size="small"
            variant="outlined"
            inputRef={inputRef}
            placeholder={t("enterEmailOfTheUserYouWantToAdd") as string}
            label={<Trans i18nKey="userEmail" />}
        />
    </Box>
);
};

export default SettingBox;