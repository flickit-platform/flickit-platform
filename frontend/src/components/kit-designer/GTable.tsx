import {
    Box,
    Button,
    TableContainer,
    Paper,
    Tooltip,
    Typography,
    TableHead,
    TableRow,
    TableCell,
    TableBody, Table, TableFooter, TablePagination, IconButton, TextField, MenuItem, Select
} from "@mui/material";
import {Trans} from "react-i18next";
import {theme} from "@config/theme";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import React, {useState} from "react";
import {KeyboardArrowLeft, KeyboardArrowRight} from "@mui/icons-material";
import FirstPageIcon from '@mui/icons-material/FirstPage';
import LastPageIcon from '@mui/icons-material/LastPage';

const GTable = (props: any) => {
    const {
        title,
        infoIcon,
        infoDescription,
        hasBtn,
        labelBtn,
        hasFilterBtn,
        hasSelectBtn,
        ...rest
    } = props

    return (
        <Box sx={{width:"100%",padding: "1rem", background: theme.palette.primary.contrastText}}>
            {title && <Box mb={"1rem"} height={"100%"} width={"100%"}>
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: hasSelectBtn ? "column": "row",
                        justifyContent: hasSelectBtn ? "center" :  "space-between",
                        alignItems: hasSelectBtn ? "space-between" : "center",
                        position: "relative",
                        width: "100%",
                        height: hasSelectBtn ? "auto": "4rem",
                        gap: hasSelectBtn ? "1.5rem" : "0",
                        padding: "1rem"
                    }}
                >
                    <Box sx={{display:"flex", alignItems:"center", gap:".5rem"}}>
                        <Typography sx={{...theme.typography.bodyExtraLarge,color:"#2B333B"}}>
                            <Trans i18nKey={title} />
                        </Typography>
                        {infoIcon && <Tooltip title={infoDescription}>
                            <InfoOutlinedIcon sx={{color:"#6C8093",fontSize:"16px", cursor:"pointer"}} />
                        </Tooltip>}
                    </Box>
                    <Box sx={{display: "flex", justifyContent: "space-between", alignItems : "center"}}>
                        <Box sx={{display: "flex",gap: "1rem"}}>
                            {hasSelectBtn && <TextField
                                // sx={{
                                //     width: "18.75rem",
                                //     '& .MuiOutlinedInput-input': {
                                //         paddingY: 0
                                //     }
                                // }}
                                // inputProps={{   height:"2.5rem",}}
                                size={"small"}
                                placeholder={"Titles, descriptions etc."}
                                id="outlined-basic"
                                label="Search"
                                variant="outlined"
                            />
                            }
                            {hasSelectBtn &&  <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={"age"}
                                size={"small"}
                                sx={{
                                    width: "11.25rem",
                                }}
                                label="Age"
                                onChange={()=>{}}
                            >
                                <MenuItem value={10}>Ten</MenuItem>
                                <MenuItem value={20}>Twenty</MenuItem>
                                <MenuItem value={30}>Thirty</MenuItem>
                            </Select>}
                        </Box>
                        {hasBtn && <Button
                            variant="contained"
                            sx={{
                                display: "flex", alignItems: "center",
                                width:"fit-content",
                                height:"2rem",
                                color: theme.palette.primary.contrastText,
                            }}
                        >
                            <Trans i18nKey={labelBtn}/>
                        </Button>}
                    </Box>
                </Box>
            </Box>
            }
            <ContentTable {...rest} />
        </Box>
    );
};

const ContentTable = (rest) =>{
    const {headerData, bodyData, totalCount, hasPagination} = rest
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);

    return (
        <TableContainer >
            <Table sx={{width:"100%"}}>
                <TableHead>
                    <TableRow>
                        {headerData.map(headerItem=> {
                            return(
                                <TableCell sx={{...theme.typography.bodyMedium, color: "#6C8093",py:0}}>
                                    {headerItem}
                                </TableCell>
                            )
                        })}

                    </TableRow>
                </TableHead>
                <TableBody>
                    <TableRow>
                        {bodyData.map(bodyItem=> {
                            return(
                                <TableCell>
                                    {bodyItem}
                                </TableCell>
                            )
                        })}
                    </TableRow>
                </TableBody>
                {hasPagination &&  <TableFooter>
                    <TableRow>
                        <TablePagination
                            rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
                            colSpan={3}
                            count={totalCount / rowsPerPage}
                            rowsPerPage={rowsPerPage}
                            page={page}
                            slotProps={{
                                select: {
                                    inputProps: {
                                        'aria-label': 'rows per page',
                                    },
                                    native: true,
                                },
                            }}
                        />
                    </TableRow>
                </TableFooter>}
            </Table>
        </TableContainer>
    )
}
export default GTable;