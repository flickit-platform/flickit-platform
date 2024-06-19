import React, {useEffect, useState} from "react";
import {useServiceContext} from "@providers/ServiceProvider";
import {useParams} from "react-router-dom";
import {useQuery} from "@utils/useQuery";
import {FormControl, SelectChangeEvent, Typography} from "@mui/material";
import {ICustomError} from "@utils/CustomError";
import toastError from "@utils/toastError";
import {SelectHeight} from "@utils/selectHeight";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import Box from "@mui/material/Box";
import Tooltip from "@mui/material/Tooltip";
import {Trans} from "react-i18next";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import Select from "@mui/material/Select";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import MenuItem from "@mui/material/MenuItem";
import Avatar from "@mui/material/Avatar";
import stringAvatar from "@utils/stringAvatar";
import ListItem from "@mui/material/ListItem";
import Button from "@mui/material/Button";

const AddMemberDialog = (props: {
    expanded: boolean, onClose: () => void,listOfUser: any,setChangeData?: any
    title: any, cancelText: any, confirmText: any
    listOfRoles: any[], assessmentId: any, fetchAssessmentsUserListRoles: any
}) => {
    const {
        expanded, onClose, title, cancelText, confirmText,setChangeData,
        listOfRoles = [],listOfUser, assessmentId, fetchAssessmentsUserListRoles
    } = props;

    const [memberOfSpace, setMemberOfSpace] = useState<any[]>([])
    const [memberSelected, setMemberSelected] = useState<any>("")
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
                    const filtredItems = items.filter((item :any) => !listOfUser.some((userListItem :any) => item.id === userListItem.id));
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
        setMemberSelected("")
        setRoleSelected({id: 0, title: ""})
    }

    const onConfirm = async (e: any) => {
        try {
            await addRoleMemberQueryData.query()
            // await fetchAssessmentsUserListRoles()
            setChangeData((prev: boolean) => !prev)
            closeDialog()
        } catch (e) {
            const err = e as ICustomError;
            toastError(err);
            closeDialog()
        }
    };
    const ITEM_HEIGHT = 59;
    const ITEM_PADDING_TOP = 8;
    const MenuProps = SelectHeight(ITEM_HEIGHT,ITEM_PADDING_TOP)

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
                    sx={{
                        backgroundColor: "#004F83", width: "100%", display: "flex",
                        justifyContent: "center", alignItems: "baseline", gap: "0.4rem"
                    }}
                >
                    <Typography
                        variant={"h5"}
                        sx={{
                            color: "#EDF4FC",
                            fontsize: "2rem",
                            lineHeight: '36.77px',
                            fontWeight: 700,
                            paddingY: "24px",
                            letterSpacing: '1.3px'
                        }}>{title}</Typography>
                    <Tooltip title={<Trans i18nKey={"addMemberParent"}/>}>
                        <InfoOutlinedIcon
                            sx={{
                                width: "1.5rem",
                                height: "1.5rem", color: "#fff",
                            }}/>
                    </Tooltip>
                </Box>
                <Box
                    display="flex"
                    alignItems="center"
                    justifyContent={"center"}
                    sx={{gap: {xs: "0rem", sm:"1rem"}}}
                >
                    <Typography
                    sx={{fontSize: {xs: '0.7rem',sm:"1rem"},
                        fontWeight: 500
                    }}
                    >
                        <Trans i18nKey={"add"}/>
                    </Typography>
                    <Box>
                        <FormControl
                            sx={{
                                m: 1,
                                // width: '100%',
                                textAlign: "right",
                                padding: "6px, 12px, 6px, 12px",
                                minWidth: {xs: 90, sm: 150},
                                maxWidth: {xs: 90, sm: 150},
                            }}
                        >
                            <Select
                                labelId="demo-simple-select-autowidth-label"
                                id="demo-simple-select-autowidth-labelh"
                                value={memberSelected}
                                displayEmpty
                                onChange={handleChangeMember}
                                renderValue={memberSelected == "" ? ()=> <Box sx={{color:"#6C7B8E", fontSize: "0.6rem",textAlign: "left",
                                    overflow: 'hidden',  textOverflow : 'ellipsis',whiteSpace : 'nowrap'
                                }}><Trans i18nKey={"chooseASpaceMember"} /></Box> : undefined }
                                sx={{
                                    boxShadow: 'none',
                                    '.MuiOutlinedInput-notchedOutline': {border: 0},
                                    border: "1px solid #2974B4",
                                    borderRadius: "0.5rem",
                                    "&.MuiOutlinedInput-notchedOutline": {border: 0},
                                    "&.MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline":
                                        {
                                            border: 0,
                                        },
                                    "&.MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline":
                                        {
                                            border: 0,
                                        },
                                    '.MuiSvgIcon-root': {
                                        fill: "#2974B4 !important",
                                    },
                                    "& .MuiSelect-select": {
                                        padding: "4px 5px"
                                    },
                                    height: '40px',
                                    fontSize: {xs: '0.7rem',sm:"1rem"},
                                }}
                                IconComponent={KeyboardArrowDownIcon}
                            >
                                <Box
                                    sx={{
                                        paddingY: "16px",
                                        color: '#9DA7B3',
                                        textAlign: "center",
                                        borderBottom: "1px solid #9DA7B3",
                                    }}
                                >
                                    <Typography
                                    sx={{fontSize:"0.7rem",paddingX: "0.5rem"}}
                                    ><Trans i18nKey={"whoWantToAdd"} /></Typography>
                                </Box>
                                {memberOfSpace && memberOfSpace.length > 0 && memberOfSpace.map((member: any, index: number) => (
                                    <MenuItem
                                        style={{display: "block"}}
                                        key={member.id} value={member.id}
                                        sx={{paddingY: "0px", maxHeight: "200px", gap: "20px",
                                            "&.MuiMenuItem-root:hover":{
                                                backgroundColor: '#EFEDF0',
                                                color:"#1B1B1E"
                                            },
                                    }}
                                    >
                                        <Box sx={{display: "flex", gap: {xs:"2px",sm:"10px"},
                                            justifyContent: "flex-start", alignItems: "center"
                                           }}>
                                            <Avatar
                                                sx={{width: {xs:'1.3rem',sm: '2rem'}, height: {xs:'1.3rem', sm:'2rem'},
                                                fontSize: {xs:'0.7rem',sm: '1rem'}
                                            }}
                                                {...stringAvatar(member.displayName.toUpperCase())}
                                                src={member.pictureLink}
                                            />
                                            <ListItem sx={{paddingX: "unset",
                                              overflow: 'hidden',  textOverflow : 'ellipsis',whiteSpace : 'nowrap'
                                            }}>
                                                {member.displayName}
                                            </ListItem>
                                        </Box>
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                    </Box>
                    <Typography
                        sx={{fontSize: {xs: '0.7rem',sm:"1rem"},
                            fontWeight: 500
                        }}
                    >
                        <Trans i18nKey={"as"}/>
                    </Typography>
                    <div>
                        <FormControl
                            sx={{
                                m: 1,
                                // width: '100%',
                                textAlign: "center",
                                padding: "6px, 12px, 6px, 12px",
                                minWidth: {xs: 90, sm: 150}
                            }}
                        >
                            <Select
                                labelId="demo-multiple-name-label"
                                id="demo-multiple-name"
                                value={roleSelected?.title}
                                displayEmpty
                                onChange={handleChangeRole}
                                disabled={memberSelected == "" ? true : false}
                                sx={{
                                    boxShadow: 'none',
                                    '.MuiOutlinedInput-notchedOutline': {border: 0},
                                    border: "1px solid #2974B4",
                                    borderRadius: "0.5rem",
                                    "&.MuiOutlinedInput-notchedOutline": {border: 0},
                                    "&.MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline":
                                        {
                                            border: 0,
                                        },
                                    "&.MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline":
                                        {
                                            border: 0,
                                        },
                                    '.MuiSvgIcon-root': {
                                        fill: "#2974B4 !important",
                                    },
                                    "& .MuiSelect-select": {
                                        padding: "4px 5px"
                                    },
                                    height: '40px',
                                    fontSize: {xs: '0.7rem',sm:"1rem"}
                                }}
                                IconComponent={KeyboardArrowDownIcon}
                                inputProps={{
                                    renderValue: () => (roleSelected?.title == "" ? <Box sx={{color:"#6C7B8E", fontSize: "0.6rem",textAlign: "left",
                                        overflow: 'hidden',  textOverflow : 'ellipsis',whiteSpace : 'nowrap'
                                    }}><Trans i18nKey={"chooseARole"} /></Box> :   roleSelected.title),
                                }}
                                MenuProps={MenuProps}
                            >
                                <Box
                                    sx={{
                                        paddingY: "16px",
                                        color: '#9DA7B3',
                                        textAlign: "center",
                                        borderBottom: "1px solid #9DA7B3",
                                    }}
                                >
                                    <Typography
                                        sx={{fontSize:"0.875rem"}}
                                    ><Trans i18nKey={"chooseARole"} /></Typography>
                                </Box>
                                {listOfRoles && listOfRoles.map((role: any,index: number) => {
                                    return (
                                        <MenuItem
                                            style={{display: "block"}}
                                            key={role.title}
                                            value={role}
                                            id={role.id}
                                            sx={{maxWidth: "240px",
                                                "&.MuiMenuItem-root:hover":{
                                                    ...(roleSelected?.title == role.title ? {
                                                        backgroundColor: "#9CCAFF",
                                                        color:"#004F83"
                                                    } : {backgroundColor: '#EFEDF0',
                                                        color:"#1B1B1E"
                                                    }),
                                                },
                                               background: roleSelected?.title == role.title ? "#9CCAFF" : ""
                                        }}
                                        >
                                            <Box
                                                sx={{maxWidth: "240px",
                                                    color: "#000",
                                                    fontSize: "0.875rem",
                                                    lineHeight: "21px",
                                                    fontWeight: 500,
                                                    paddingY: "1rem",
                                                }}
                                            >
                                            <Typography>{role.title}</Typography>
                                            <div style={{
                                                color: "#000",
                                                fontSize: "0.875rem",
                                                lineHeight: "21px",
                                                fontWeight: 300,
                                                whiteSpace: "break-spaces",
                                                paddingTop: "1rem"
                                            }}>{role.description}</div>
                                            </Box>
                                            {listOfRoles && listOfRoles.length > index + 1 && <Box sx={{
                                                height: '0.5px', width: "80%",
                                                backgroundColor: "#9DA7B3",
                                                mx: "auto"
                                            }}></Box>}
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
                            fontSize: {xs: '0.7rem',sm:"1rem"},
                            fontWeight: 700,
                            color: "#004F83",
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
                            fontSize: {xs: '0.7rem',sm:"1rem"},
                            fontWeight: 700,
                            "&.MuiButton-root": {
                                color: "#EDFCFC",
                                border: "1px solid #004F83",
                                background: "#004F83",
                                borderRadius: "100px",
                            },
                            "&.MuiButton-root:hover": {
                                background: "#004F83",
                                border: "1px solid #004F83",
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
export default AddMemberDialog