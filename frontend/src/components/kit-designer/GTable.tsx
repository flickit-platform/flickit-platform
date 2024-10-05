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
    TableBody, Table, TableFooter, TablePagination, IconButton
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
        ...rest
    } = props

    return (
        <Box sx={{width:"100%"}}>
            {title && <Box mb={"1.5rem"} height={"100%"} width={"100%"}>
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        position: "relative",
                        width: "100%",

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
                    {hasBtn && <Button
                        variant="contained"
                        sx={{
                            display: "flex", alignItems: "center",
                            color: theme.palette.primary.contrastText,
                        }}
                    >
                        <Trans i18nKey={labelBtn}/>
                    </Button>}
                </Box>
            </Box>
            }
            <ContentTable {...rest} />
        </Box>
    );
};

const ContentTable = (rest) =>{
    const {headerData,bodyData, totalCount} = rest
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);

    return (
        <TableContainer >
            <Table sx={{width:"100%"}}>
                <TableHead>
                    <TableRow>
                        {headerData.map(headerItem=> {
                            return(
                                <TableCell>
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
                <TableFooter>
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
                            // onPageChange={handleChangePage}
                            // onRowsPerPageChange={handleChangeRowsPerPage}
                            ActionsComponent={TablePaginationActions}
                        />
                    </TableRow>
                </TableFooter>
            </Table>
        </TableContainer>
    )
}

function TablePaginationActions(props) {
    const { count, page, rowsPerPage, onPageChange } = props;

    const handleFirstPageButtonClick = (
        event: React.MouseEvent<HTMLButtonElement>,
    ) => {
        onPageChange(event, 0);
    };

    const handleBackButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        onPageChange(event, page - 1);
    };

    const handleNextButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        onPageChange(event, page + 1);
    };

    const handleLastPageButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
    };

    return (
        <Box sx={{ flexShrink: 0, ml: 2.5 }}>
            <IconButton
                onClick={handleFirstPageButtonClick}
                disabled={page === 0}
                aria-label="first page"
            >
                {theme.direction === 'rtl' ? <LastPageIcon /> : <FirstPageIcon />}
            </IconButton>
            <IconButton
                onClick={handleBackButtonClick}
                disabled={page === 0}
                aria-label="previous page"
            >
                {theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
            </IconButton>
            <IconButton
                onClick={handleNextButtonClick}
                disabled={page >= Math.ceil(count / rowsPerPage) - 1}
                aria-label="next page"
            >
                {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
            </IconButton>
            <IconButton
                onClick={handleLastPageButtonClick}
                disabled={page >= Math.ceil(count / rowsPerPage) - 1}
                aria-label="last page"
            >
                {theme.direction === 'rtl' ? <FirstPageIcon /> : <LastPageIcon />}
            </IconButton>
        </Box>
    );
}
export default GTable;