import Box from "@mui/material/Box";
import {styles} from "@styles";
import IconButton from "@mui/material/IconButton";
import SwapVertRoundedIcon from "@mui/icons-material/SwapVertRounded";
import Typography from "@mui/material/Typography";
import DeleteForeverOutlinedIcon from '@mui/icons-material/DeleteForeverOutlined';
import ModeEditOutlineOutlinedIcon from '@mui/icons-material/ModeEditOutlineOutlined';
import Divider from "@mui/material/Divider";
const QuestionContain = (props: any) => {

    const {title,index,questionCount} = props
    return (
        <>
        <Box sx={{display:"flex" , py:".5rem", px:"1rem"}}>
            <Box
                sx={{ ...styles.centerVH, background: "#F3F5F6",width: {xs:"65px", md:"95px"},justifyContent:"space-around" }}
                borderRadius="0.5rem"
                mr={2}
                px={.2}
            >
                <IconButton disableRipple disableFocusRipple sx={{
                    '&:hover': {
                        backgroundColor: 'transparent',
                        color: 'inherit',
                    },
                }} size="small">
                    <SwapVertRoundedIcon fontSize="small" />
                </IconButton>
                <Typography variant="semiBoldLarge">
                    {`Q. ${index}`}
                </Typography>
            </Box>
            <Box sx={{width: {xs:"80%",md:"90%"}}}>
                {title}
            </Box>
            <Box  sx={{width: {xs:"20%",md:"10%"}, display:"flex", justifyContent:"center"}}>
                <IconButton>
                    <DeleteForeverOutlinedIcon fontSize="small"/>
                </IconButton>
                <IconButton>
                    <ModeEditOutlineOutlinedIcon fontSize="small"/>
                </IconButton>
            </Box>
        </Box>
            {(index != questionCount ) && <Divider sx={{width:"95%", mx:"auto"}} /> }
        </>
    );
};

export default QuestionContain;