import {useState} from 'react';
import Box from "@mui/material/Box";
import {Chip, Divider, FormControl, IconButton, Tooltip, Typography} from "@mui/material";
import {Trans} from "react-i18next";
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";
import TableContainer from "@mui/material/TableContainer";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import TableBody from "@mui/material/TableBody";
import Avatar from "@mui/material/Avatar";
import stringAvatar from "@utils/stringAvatar";
import Grid from "@mui/material/Grid";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import Select from "@mui/material/Select";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import MenuItem from "@mui/material/MenuItem";
import {CEDialog, CEDialogActions} from "@common/dialogs/CEDialog";
import CreateNewFolderRoundedIcon from "@mui/icons-material/CreateNewFolderRounded";
import FormProviderWithForm from "@common/FormProviderWithForm";
import {styles} from "@styles";
import {InputFieldUC} from "@common/fields/InputField";
import {useForm} from "react-hook-form";
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import PersonRemoveIcon from '@mui/icons-material/PersonRemove';

const SettingBox = (props: any) => {
    const {title,items } = props

    interface Column {
        id: "displayName" | "email" | "remove";
        label: string;
        minWidth?: string;
        align?: "right";
        display?: string;
        position: string;
    }
    const[openModal,setOpenModal] = useState(false)


    const onClose = () =>{
        setOpenModal(false)
    }

    // const columns: readonly Column[] = [
    //     { id: "displayName", label: "Name", minWidth: "20vw", position: "left" },
    //     {
    //         id: "email",
    //         label: "Email",
    //         minWidth: "20vw",
    //         display: "none",
    //         position: "center",
    //     },
    //     {
    //         id: "remove",
    //         label: "remove",
    //         align: "right",
    //         minWidth: "20vw",
    //         position: "center",
    //     },
    // ];

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
                                                            disabled={!row.editable}
                                                            onClick={() =>{}
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
            <AddMemberModal open={openModal} type={"add"} close={onClose} />
        </Box>
    );
};

const AddMemberModal = (props: any) =>{
    const {type,close, ...rest} = props
    const formMethods = useForm({ shouldUnregister: true });
    return (
        <CEDialog
            {...rest}
            closeDialog={close}
            title={type === "add" ? (
                        <>
                            <PersonAddIcon sx={{ mr: 1 }} />
                            <Trans i18nKey="addMember" />
                        </>
                    ) : (
                        <>
                            <PersonRemoveIcon sx={{ mr: 1 }} />
                            <Trans i18nKey="removeMember" />
                        </>
                    )
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
                        <InputFieldUC
                            // autoFocus={true}
                            name="title"
                            // defaultValue={defaultValues.title || ""}
                            required={true}
                            label={<Trans i18nKey="email" />}
                            // isFocused={isFocused}
                        />
                    </Grid>
                </Grid>
                <CEDialogActions
                    closeDialog={close}
                    // loading={loading}
                    type={type}
                    // onSubmit={(...args) =>
                    //     formMethods.handleSubmit((data) => onSubmit(data, ...args))
                    // }
                    onSubmit={()=>{}}
                    submitButtonLabel={"add"}
                    loading={false}
                />
            </FormProviderWithForm>
        </CEDialog>
    )
}



export default SettingBox;