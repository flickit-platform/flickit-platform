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
                        backgroundColor: "#1CC2C4", width: "100%", display: "flex",
                        justifyContent: "center", alignItems: "baseline", gap: "0.4rem"
                    }}
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
                            {/*<InputLabel sx={{width: "fit-content"}} id="demo-simple-select-autowidth-label"><Trans*/}
                            {/*    i18nKey={"chooseASpaceMember"}/></InputLabel>*/}
                            <Select
                                labelId="demo-simple-select-autowidth-label"
                                id="demo-simple-select-autowidth-labelh"
                                value={memberSelected}
                                onChange={handleChangeMember}
                                // label="Choose a space member"
                                sx={{
                                    boxShadow: 'none',
                                    '.MuiOutlinedInput-notchedOutline': {border: 0},
                                    border: "1px solid #A4E7E7",
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
                                        fill: "#A4E7E7 !important",
                                    },
                                    "& .MuiSelect-select": {
                                        padding: "4px 5px"
                                    },
                                    height: '40px',
                                    fontSize: {xs: '0.7rem',sm:"1rem"}
                                }}
                                IconComponent={KeyboardArrowDownIcon}
                            >
                                {memberOfSpace.map((member: any, index: number) => (
                                    <MenuItem
                                        style={{display: "block"}}
                                        key={member.id} value={member.id}
                                        sx={{paddingY: "0px", maxHeight: "200px", gap: "20px"
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
                            placeholder={"Choose a space member"}
                        >
                            {/*<InputLabel id="demo-multiple-name-label"><Trans*/}
                            {/*    i18nKey={"chooseARole"}/> handleChangeMember</InputLabel>*/}
                            <Select
                                labelId="demo-multiple-name-label"
                                id="demo-multiple-name"
                                value={roleSelected?.title}
                                onChange={handleChangeRole}
                                disabled={memberSelected == "" ? true : false}
                                // input={<OutlinedInput label="choose A Role"/>}
                                sx={{
                                    boxShadow: 'none',
                                    '.MuiOutlinedInput-notchedOutline': {border: 0},
                                    border: "1px solid #A4E7E7",
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
                                        fill: "#A4E7E7 !important",
                                    },
                                    "& .MuiSelect-select": {
                                        padding: "4px 5px"
                                    },
                                    height: '40px',
                                    fontSize: {xs: '0.7rem',sm:"1rem"}
                                }}
                                IconComponent={KeyboardArrowDownIcon}
                                inputProps={{
                                    renderValue: () => (roleSelected.title),
                                }}
                                MenuProps={MenuProps}
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
                            fontSize: {xs: '0.7rem',sm:"1rem"},
                            fontWeight: 700,
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
                            fontSize: {xs: '0.7rem',sm:"1rem"},
                            fontWeight: 700,
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
export default AddMemberDialog