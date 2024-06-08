import Box from "@mui/material/Box";
import {Divider, Typography} from "@mui/material";
import {Trans} from "react-i18next";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import React from "react";
import {styles} from "@styles";
import Button from "@mui/material/Button";
import AddIcon from '@mui/icons-material/Add';

const AssessmentSettingBox = (props: any) => {

    const {children, assessmentTitle, boxTitle,openModal} = props

    return (
        <Box
            sx={{
                ...styles.centerCVH
                , px: {xs: "15px", sm: "51px"}
            }}
            gap={2}
            textAlign="center"
            height={"auto"}
            // minHeight={"415px"}
            width={"100%"}
            bgcolor={"#FFF"}
            borderRadius={"40.53px"}
            py={"32px"}
        >
            <Box
                height={"100%"}
                width={"100%"}
            >
                {
                    boxTitle == "members" ? (
                        <Box
                            sx={{
                                display:"flex",
                                justifyContent: "space-between",
                                flexDirection: {xs:"column-reverse",
                                    sm:"row"},
                                gap: "10px"
                            }}
                        >
                            <Box
                                sx={{width: '150px'}}
                            ></Box>

                            <Typography color="#9DA7B3" fontSize="32px" fontWeight={700}
                                        lineHeight={"normal"}>
                                <Trans i18nKey={`${boxTitle}`}/>
                            </Typography>
                            <Button
                                sx={{borderRadius: 100 , backgroundColor: "#1CC2C4",
                                    width: "fit-content",
                                    alignSelf: "end",
                                    "&.MuiButtonBase-root:hover": {
                                        bgcolor: "#1CC2C4"
                                    }
                                }}
                                onClick={openModal}
                            >
                                <AddIcon
                                    fontSize="small"
                                    style={{ color: "#EDFCFC" }}
                                />
                                <Typography color="#EDFCFC" fontSize="14px" fontWeight={500}
                                            lineHeight={"normal"}>
                                    <Trans i18nKey={`addMember`}/>
                                </Typography>
                            </Button>

                        </Box>
                    ) : (
                        <Typography color="#9DA7B3" fontSize="32px" fontWeight={700}
                                    lineHeight={"normal"}>
                            <Trans i18nKey={`${boxTitle}`}/>
                        </Typography>
                    )
                }
                <Divider sx={{width: "100%", marginY: "24px"}}/>
                {assessmentTitle && (
                    <>
                        <Box sx={{
                            display: "flex",
                            justifyContent: 'center',
                            alignItems: "center",
                            gap: "10%"
                        }}
                        >
                            <Typography color="#9DA7B3" fontWeight={500}
                                        whiteSpace={"nowrap"}
                                        sx={{fontSize: {xs: "18px", sm: "24px"}}}
                                        lineHeight={"normal"}>
                                <Trans i18nKey="assessmentTitle"/>
                            </Typography>

                            <Box sx={{display: "flex", justifyContent: 'center', alignItems: "center"}}>
                                <Typography color="#1CC2C4" fontWeight={500}
                                            sx={{fontSize: {xs: "18px", sm: "24px"}}}
                                            lineHeight={"normal"}>
                                    {assessmentTitle}
                                </Typography>
                                <EditRoundedIcon sx={{color: "#9DA7B3"}} fontSize="small" width={"32px"}
                                                 height={"32px"}/>
                            </Box>
                        </Box>
                        <Divider sx={{width: "100%", marginY: "24px"}}/>
                    </>
                )}
                {children}
            </Box>
        </Box>
    )
}

export default AssessmentSettingBox;