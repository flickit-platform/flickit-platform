import {Box, Divider, Typography} from "@mui/material";
import {Trans} from "react-i18next";
import React from "react";
import Grid from "@mui/material/Grid";
import formatDate from "@utils/formatDate";
import {Link} from "react-router-dom";
import SettingsRoundedIcon from "@mui/icons-material/SettingsRounded";
import {theme} from "@config/theme";
import {styles} from "@styles";
import {display} from "html2canvas/dist/types/css/property-descriptors/display";

const Addons = (props: any) => {
    const {setExpandedAddOnsModal} = props
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
                <Typography color="#9DA7B3" variant="headlineMedium">
                    <Trans i18nKey={`${"addOns"}`} />
                </Typography>
                <Divider
                    sx={{
                        width: "100%",
                        marginY: "24px !important",
                    }}
                />
                <Grid
                    container
                    sx={{
                        height: "100%",
                        width: "100%",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        alignItems: "space-between",
                        gap: "32px",
                    }}
                >

                                <Grid
                                    item
                                    sx={{ display: "flex", justifyContent: "center" }}
                                >
                                    <Grid
                                        item
                                        xs={12}
                                        sm={12}
                                        md={8}
                                        sx={{
                                            display: "flex",
                                            justifyContent: "space-between",
                                            alignItems: "center",
                                        }}
                                    >
                                        <Typography
                                            color="#9DA7B3"
                                            fontWeight={500}
                                            whiteSpace={"nowrap"}
                                            sx={{
                                                display: "flex",
                                                justifyContent: "center",
                                                fontSize: { xs: "1rem", md: "1.375rem" },
                                            }}
                                            lineHeight={"normal"}
                                        >
                                            <Trans i18nKey={`qualityCode`} />:
                                        </Typography>

                                        <Typography
                                            color="#0A2342"
                                            fontWeight={500}
                                            sx={{
                                                display: "flex",
                                                justifyContent: "space-between",
                                                fontSize: { xs: "1rem", md: "1.375rem" },
                                                // width: { md: "100px" },
                                            }}
                                            lineHeight={"normal"}
                                        >
                                           <Box onClick={()=>setExpandedAddOnsModal({display: true})} sx={{...styles.centerVH,cursor:"pointer"}}>
                                               <SettingsRoundedIcon />
                                           </Box>
                                        </Typography>
                                    </Grid>
                                </Grid>
                </Grid>
            </Box>
        </Box>
    );
};

export default Addons;