import Box from "@mui/material/Box";
import {Divider, IconButton, Typography} from "@mui/material";
import {Trans} from "react-i18next";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import React, {useState} from "react";
import {styles} from "@styles";
import Button from "@mui/material/Button";
import AddIcon from '@mui/icons-material/Add';
import {useForm} from "react-hook-form";
import {useParams} from "react-router";
import {useServiceContext} from "@providers/ServiceProvider";
import {useQuery} from "@utils/useQuery";
import {toast} from "react-toastify";
import {ICustomError} from "@utils/CustomError";
import toastError from "@utils/toastError";
import firstCharDetector from "@utils/firstCharDetector";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputAdornment from "@mui/material/InputAdornment";
import CheckCircleOutlineRoundedIcon from "@mui/icons-material/CheckCircleOutlineRounded";
import CancelRoundedIcon from "@mui/icons-material/CancelRounded";

const AssessmentSettingBox = (props: any) => {

    const {children, assessmentTitle, boxTitle, openModal} = props
    const formMethods = useForm({shouldUnregister: true});

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
                                display: "flex",
                                justifyContent: "space-between",
                                flexDirection: {
                                    xs: "column-reverse",
                                    sm: "row"
                                },
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
                                sx={{
                                    borderRadius: 100, backgroundColor: "#1CC2C4",
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
                                    style={{color: "#EDFCFC"}}
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
                                {/*TODO*/}
                                {/*  <Typography color="#1CC2C4" fontWeight={500}*/}
                                {/*              sx={{fontSize: {xs: "18px", sm: "24px"}}}*/}
                                {/*              lineHeight={"normal"}>*/}
                                {/*      {assessmentTitle}*/}
                                {/*  </Typography>*/}
                                {/*  <EditRoundedIcon sx={{color: "#9DA7B3"}} fontSize="small" width={"32px"}*/}
                                {/*                   height={"32px"}/>*/}
                                <OnHoverInputTitleSetting
                                    formMethods={formMethods}
                                    data={assessmentTitle}
                                    infoQuery={assessmentTitle}
                                    type="assessmentTitle"
                                    editable={true}
                                />
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

const OnHoverInputTitleSetting = (props: any) => {
    const [show, setShow] = useState<boolean>(false);
    const [isHovering, setIsHovering] = useState(false);
    const handleMouseOver = () => {
        editable && setIsHovering(true);
    };

    const handleMouseOut = () => {
        setIsHovering(false);
    };
    const {data, editable, infoQuery, type, formMethods} = props;
    const [hasError, setHasError] = useState<boolean>(false);
    const [error, setError] = useState<any>({});
    const [inputData, setInputData] = useState<string>(data);
    const handleCancel = () => {
        setShow(false);
        setInputData(data);
        setError({});
        setHasError(false);
    };
    const {assessmentKitId} = useParams();
    const {service} = useServiceContext();
    const updateAssessmentKitQuery = useQuery({
        service: (
            args = {
                assessmentKitId: assessmentKitId,
                data: {[type]: inputData},
            },
            config
        ) => service.updateAssessmentKitStats(args, config),
        runOnMount: false,
        // toastError: true,
    });
    const updateAssessmentKit = async () => {
        try {
    /*        const res = await updateAssessmentKitQuery.query();
            res.message && toast.success(res.message);
            await infoQuery();*/
        } catch (e) {
            const err = e as ICustomError;
            if (Array.isArray(err.response?.data?.message)) {
                toastError(err.response?.data?.message[0]);
            } else if (
                err.response?.data &&
                err.response?.data.hasOwnProperty("message")
            ) {
                toastError(error);
            }
            setError(err);
            setHasError(true);
        }
    };
    const inputProps: React.HTMLProps<HTMLInputElement> = {
        style: {
            textAlign: firstCharDetector(inputData) ? "right" : "left",
        },
    };

    return (
        <Box>
            <Box
                my={1.5}
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                }}
                width="100%"
            >

                {editable && show ? (
                    <Box
                        sx={{display: "flex", flexDirection: "column", width: "100% "}}
                    >
                        <OutlinedInput
                            inputProps={inputProps}
                            error={hasError}
                            fullWidth
                            name={title}
                            defaultValue={data || ""}
                            onChange={(e) => setInputData(e.target.value)}
                            value={inputData}
                            required={true}
                            multiline={true}
                            sx={{
                                minHeight: "38px",
                                borderRadius: "4px",
                                paddingRight: "12px;",
                                fontFamily: "Roboto",
                                fontWeight: "700",
                                fontSize: "0.875rem",
                            }}
                            endAdornment={
                                <InputAdornment position="end">
                                    <IconButton
                                        title="Submit Edit"
                                        edge="end"
                                        sx={{
                                            background: "#1976d299",
                                            borderRadius: "3px",
                                            height: "36px",
                                            margin: "3px",
                                        }}
                                        onClick={updateAssessmentKit}
                                    >
                                        <CheckCircleOutlineRoundedIcon sx={{color: "#fff"}}/>
                                    </IconButton>
                                    <IconButton
                                        title="Cancel Edit"
                                        edge="end"
                                        sx={{
                                            background: "#1976d299",
                                            borderRadius: "4px",
                                            height: "36px",
                                        }}
                                        onClick={handleCancel}
                                    >
                                        <CancelRoundedIcon sx={{color: "#fff"}}/>
                                    </IconButton>
                                </InputAdornment>
                            }
                        />
                        {hasError && (
                            <Typography color="#ba000d" variant="caption">
                                {error?.data?.[type]}
                            </Typography>
                        )}
                    </Box>
                ) : (
                    <Box
                        sx={{
                            minHeight: "38px",
                            borderRadius: "4px",
                            paddingLeft: "8px;",
                            paddingRight: "12px;",
                            width: "100%",
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            wordBreak: "break-word",
                            "&:hover": {border: "1px solid #1976d299"},
                        }}
                        onClick={() => setShow(!show)}
                        onMouseOver={handleMouseOver}
                        onMouseOut={handleMouseOut}
                    >
                          <Typography color="#1CC2C4" fontWeight={500}
                                      sx={{fontSize: {xs: "18px", sm: "24px"}}}
                                      lineHeight={"normal"}>
                              {data.replace(/<\/?p>/g, "")}
                          </Typography>
                        {isHovering && (
                            <IconButton
                                title="Edit"
                                edge="end"
                                sx={{
                                    background: "#1976d299",
                                    borderRadius: "3px",
                                    height: "36px",
                                }}
                                onClick={() => setShow(!show)}
                            >
                                <EditRoundedIcon sx={{color: "#fff"}}/>
                            </IconButton>
                        )}
                    </Box>
                )}
            </Box>
        </Box>
    );
};
