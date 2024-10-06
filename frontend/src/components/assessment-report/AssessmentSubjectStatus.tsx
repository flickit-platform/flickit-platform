import Box from "@mui/material/Box";
import { ISubjectInfo } from "@types";
import Typography from "@mui/material/Typography";
import { getMaturityLevelColors } from "@styles";
import Divider from "@mui/material/Divider";

interface IAssessmentSubjectStatus {
  subjects: ISubjectInfo[];
}

export const AssessmentSubjectStatus = (props: IAssessmentSubjectStatus) => {
  const { subjects } = props;
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      textAlign="center"
      maxHeight="100%"
      gap={3}
      py={4}
      sx={{
        background: "#fff",
        boxShadow: "0px 0px 8px 0px rgba(0, 0, 0, 0.25)",
        borderRadius: "12px",
        px: { xs: 2, sm: 3 },
      }}
    >
      <Box display="flex" justifyContent="space-between" width="100%" px={2}>
        <Typography variant="subtitle1" fontWeight="bold">
          Subject
        </Typography>
        <Typography variant="subtitle1" fontWeight="bold">
          Status
        </Typography>
      </Box>
      <Divider sx={{ width: "100%", paddingX: 2 }} />
      <Box
        display="flex"
        flexDirection="column"
        width="100%"
        height="180px"
        overflow="auto"
        paddingX={2}
      >
        {subjects.map((element: any) => {
          return (
            <div key={element.id}>
              <Box
                display="flex"
                justifyContent="space-between"
                marginY={2}
                width="100%"
              >
                <Typography>{element.title}</Typography>
                <Box display="flex" gap={0.5}>
                  <Typography
                    sx={{
                      color:
                        getMaturityLevelColors(5)[
                          element.maturityLevel.value - 1
                        ],
                    }}
                  >
                    {element.maturityLevel.title}
                  </Typography>
                </Box>
              </Box>
              <Divider sx={{ width: "100%" }} />
            </div>
          );
        })}{" "}
      </Box>
    </Box>
  );
};
