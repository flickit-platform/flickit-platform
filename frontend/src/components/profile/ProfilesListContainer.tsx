import Box from "@mui/material/Box";
import Skeleton from "@mui/material/Skeleton";
import Typography from "@mui/material/Typography";
import React from "react";
import { styles } from "../../config/styles";
import { useServiceContext } from "../../providers/ServiceProvider";
import { useQuery } from "../../utils/useQuery";
import QueryData from "../shared/QueryData";
import CategoryRoundedIcon from "@mui/icons-material/CategoryRounded";
import QuizRoundedIcon from "@mui/icons-material/QuizRounded";
import { Link } from "react-router-dom";
import forLoopComponent from "../../utils/forLoopComponent";
import { LoadingSkeleton } from "../shared/loadings/LoadingSkeleton";

const ProfilesListContainer = () => {
  const { service } = useServiceContext();
  const profilesQueryData = useQuery({
    service: (args, config) => service.fetchProfiles(args, config),
  });

  return (
    <QueryData
      {...profilesQueryData}
      renderLoading={() => (
        <>
          {forLoopComponent(5, (index) => (
            <LoadingSkeleton key={index} sx={{ height: "60px", mb: 1 }} />
          ))}
        </>
      )}
      render={(data) => {
        const { results = [] } = data;
        return (
          <>
            {results.map((profile: any) => {
              const { id, title, metric_categories, assessment_subjects } =
                profile;
              const numberOfQuestionnaires = metric_categories?.length;
              const numberOfSubjects = assessment_subjects?.length;
              return (
                <Box
                  sx={{
                    ...styles.centerV,
                    boxShadow: (t) => `0 5px 8px -8px ${t.palette.grey[400]}`,
                    borderRadius: 2,
                    pb: 1,
                    pt: 1,
                    mb: 1,
                  }}
                >
                  <Box sx={{ ...styles.centerV, flex: 1 }} alignSelf="stretch">
                    <Box
                      sx={{
                        ...styles.centerV,
                        textDecoration: "none",
                        color: (t) => t.palette.primary.dark,
                      }}
                      alignSelf="stretch"
                      component={Link}
                      to={`${id}`}
                    >
                      <Typography
                        variant="h6"
                        fontFamily={"RobotoBold"}
                        sx={{
                          fontSize: {
                            xs: "1.05rem",
                            sm: "1.1rem",
                            md: "1.2rem",
                          },
                          fontWeight: "bold",
                          textDecoration: "none",
                          height: "100%",
                          display: "flex",
                          alignItems: "center",
                          alignSelf: "stretch",
                        }}
                      >
                        {title}
                      </Typography>
                    </Box>
                    <Box
                      ml="auto"
                      sx={{ ...styles.centerV, color: "#525252" }}
                      alignSelf="stretch"
                    >
                      <Box sx={{ ...styles.centerV }} mr={1.5}>
                        {numberOfQuestionnaires}{" "}
                        <QuizRoundedIcon fontSize="small" sx={{ ml: 0.3 }} />
                      </Box>
                      <Box sx={{ ...styles.centerV }}>
                        {numberOfSubjects}{" "}
                        <CategoryRoundedIcon
                          fontSize="small"
                          sx={{ ml: 0.3 }}
                        />
                      </Box>
                    </Box>
                  </Box>
                </Box>
              );
            })}
          </>
        );
      }}
    />
  );
};

export default ProfilesListContainer;
