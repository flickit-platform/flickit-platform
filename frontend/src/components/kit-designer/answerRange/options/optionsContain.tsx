import React, { useState } from "react";
import Box from "@mui/material/Box";
import { styles } from "@styles";
import IconButton from "@mui/material/IconButton";
import ModeEditOutlineOutlinedIcon from "@mui/icons-material/ModeEditOutlineOutlined";
import { Divider, Typography } from "@mui/material";
import { useParams } from "react-router-dom";
import {IOption, KitDesignListItems} from "@types";
import TextField from "@mui/material/TextField";
import {Trans} from "react-i18next";
import CheckRoundedIcon from "@mui/icons-material/CheckRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import {useQuery} from "@utils/useQuery";
import {useServiceContext} from "@providers/ServiceProvider";

interface ITempValues {
    title: string;
    value: number;
}

const OptionContain = (props: any) => {
    const { answerOption, fetchQuery, onEdit } = props;
    const { kitVersionId = "" } = useParams();
    const { service } = useServiceContext();
    const [isEditMode, setEditMode] = useState<any>(null);
    const [tempValues, setTempValues] = useState<ITempValues>({
        title: "",
        value: 0,
    });
    const EditAnswerRangeOption = useQuery({
        service: (args, config) =>
            service.EditAnswerRangeOption(args, config),
    });
    const handleEditClick = (answerOption: KitDesignListItems) => {
        const {id,title,value} = answerOption
        setEditMode(id);
        setTempValues({
            title: title,
            value: value,
        });
    };


    const handleSaveClick =async (item: IOption) => {
        // onEdit({
        //     ...item,
        //     title: tempValues.title,
        //     value: tempValues.value,
        // });
        setEditMode(null);
        const data ={
            ...item,
            title: tempValues.title,
            value: tempValues.value,
        }
        let answerOptionId = item.id
       await EditAnswerRangeOption.query({
            kitVersionId,answerOptionId ,data
        })
       await fetchQuery.query()
    };

    const handleCancelClick = () => {
        setEditMode(null);
        setTempValues({ title: "", value: 0 });
    };

    return (
        <>
            <Box sx={{ display: "flex", py: ".5rem", px: "1rem" }}>
                <Box
                    sx={{
                        ...styles.centerVH,
                        background: "#F3F5F6",
                        width: { xs: "65px", md: "95px" },
                        justifyContent: "space-around",
                    }}
                    borderRadius="0.5rem"
                    mr={2}
                    px={0.2}
                >
                    <Typography variant="semiBoldLarge">{`Q. ${answerOption?.index}`}</Typography>
                </Box>

                <Box sx={{
                    width: { xs: "50%", md: "60%" },
                }}>
                    {isEditMode === answerOption.id  ?
                        <TextField
                            required
                            value={tempValues.title}
                            onChange={(e) =>
                                setTempValues({
                                    ...tempValues,
                                    title: e.target.value,
                                })
                        }
                            inputProps={{
                                "data-testid": "items-title",
                            }}
                            variant="outlined"
                            fullWidth
                            size="small"
                            sx={{
                                mb: 1,
                                fontSize: 14,
                                "& .MuiInputBase-root": {
                                    fontSize: 14,
                                    overflow: "auto",
                                },
                                "& .MuiFormLabel-root": {
                                    fontSize: 14,
                                },
                                width: "90%",
                                background: "#fff",
                                borderRadius: "8px",
                            }}
                            name="title"
                            label={<Trans i18nKey="title" />}
                        />
                        :
                        <Box  sx={{ width: "90%" }}>{answerOption?.title}</Box>
                    }
                </Box>
                {isEditMode === answerOption.id  ?
                    <TextField
                        required
                        value={tempValues.value}
                        onChange={(e) =>
                            setTempValues({
                                ...tempValues,
                                value: Number(e.target.value),
                            })
                        }
                        inputProps={{
                            "data-testid": "items-title",
                        }}
                        variant="outlined"
                        fullWidth
                        size="small"
                        sx={{
                            mb: 1,
                            fontSize: 14,
                            "& .MuiInputBase-root": {
                                fontSize: 14,
                                overflow: "auto",
                            },
                            "& .MuiFormLabel-root": {
                                fontSize: 14,
                            },
                            width: {xs: "20%", md: "10%"  },
                            background: "#fff",
                            borderRadius: "8px",
                        }}
                        name="title"
                        label={<Trans i18nKey="title" />}
                    />
                :
                    <Box  sx={{ width: { xs: "20%", md: "10%" },textAlign:"center" }}>{answerOption?.value}</Box>

                }
                <Box
                    sx={{
                        width: { xs: "20%", md: "10%" },
                        display: "flex",
                        justifyContent: "center",
                        marginLeft:"auto"
                    }}
                >
                    {isEditMode === answerOption.id ? (
                        <>
                            <IconButton
                                size="small"
                                onClick={() => handleSaveClick(answerOption)}
                                sx={{ ml: 1 }}
                                color="success"
                            >
                                <CheckRoundedIcon fontSize="small" />
                            </IconButton>
                            <IconButton
                                size="small"
                                onClick={handleCancelClick}
                                sx={{ ml: 1 }}
                                color="secondary"
                            >
                                <CloseRoundedIcon fontSize="small" />
                            </IconButton>
                        </>
                    ) : (
                        <>
                            <IconButton
                                size="small"
                                onClick={()=>handleEditClick(answerOption)}
                                sx={{ ml: 1 }}
                            >
                                <ModeEditOutlineOutlinedIcon fontSize="small" />
                            </IconButton>
                            {/*<IconButton*/}
                            {/*    size="small"*/}
                            {/*    // onClick={() => onDelete(item.id)}*/}
                            {/*    sx={{ ml: 1 }}*/}
                            {/*>*/}
                            {/*    <DeleteRoundedIcon fontSize="small" />*/}
                            {/*</IconButton>*/}
                        </>
                    )}
                </Box>
            </Box>
            {answerOption.index !== answerOption.total && (
                <Divider sx={{ width: "95%", mx: "auto" }} />
            )}

        </>
    );
};

export default OptionContain;
