import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Skeleton from "@mui/material/Skeleton";
import {LoadingSkeleton} from "./LoadingSkeleton";

const LoadingSkeletonOfAssessmentRoles = () => {
    return (
        <Box m="auto" pb={3} maxWidth="1440px">
            <Skeleton height="60px" sx={{width: {xs: "90%", sm: "80%", md: "60%"}}}/>
            <Grid container columns={14} mt={1}>
                <Grid item xs={14}>
                    <Skeleton variant="rectangular" sx={{borderRadius: 2, height: "270px"}}/>
                </Grid>

                <Grid item sm={14} xs={14} id="subjects">
                    <Box mt={4}>
                        <Skeleton height="60px" sx={{ width: {xs: "90%", sm: "80%", md: "60%"} }}/>
                        <Box mt={3}>
                            <Grid container sx={{px: {lg: 2, md: 4, sm: 9, xs: 0}}}>
                                <Grid item xs={12}>
                                    <LoadingSkeleton height="700px"/>
                                </Grid>
                            </Grid>
                        </Box>
                    </Box>
                </Grid>
            </Grid>
        </Box>
    );
};

export default LoadingSkeletonOfAssessmentRoles;
