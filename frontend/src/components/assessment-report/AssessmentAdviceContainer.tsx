import Title from "@common/Title";
import { Trans } from "react-i18next";
import SupTitleBreadcrumb from "@common/SupTitleBreadcrumb";
import AdviceSlider from "../common/AdviceSlider";
import Box from "@mui/material/Box";
import { Button, Divider } from "@mui/material";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
const AssessmentAdviceContainer = () => {
  return (
    <div>
      <Title
        wrapperProps={{
          sx: {
            flexDirection: { xs: "column", md: "row" },
            alignItems: { xs: "flex-start", md: "flex-end" },
          },
        }}
        sup={
          <SupTitleBreadcrumb
            routes={[
              {
                title: "space title",
                to: "",
              },
              {
                title: "assessment title",
                to: "",
              },
            ]}
          />
        }
      >
        Advice
      </Title>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          width: "70%",
          margin: "0 auto",
        }}
      >
        <Box
          sx={{
            background: "#1CC2C4",
            py: 4,
            textAlign: "center",
            color: "#fff",
            fontSize: "32px",
            fontWeight: "700",
            borderRadius: "32px 32px 0 0",
          }}
        >
          Set Your goals
        </Box>
        <Box
          sx={{
            background: "#EDF4FC",
            display: "flex",
            justifyContent: "center",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Box
            sx={{
              color: "#6C7B8E",
              fontSize: "16px",
              fontWeight: "500",
              display: "flex",
              textAlign: "center",
              width: "50%",
              py: 2,
            }}
          >
            Which attributes you want to change? The Advisor will try to provide
            most accurate advice based on your choices
          </Box>
          <Box
            sx={{
              display: "flex",
              width: "50%",
              justifyContent: "space-between",
              alignItems: "baseline",
              my: 4,
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                textAlign: "center",
              }}
            >
              <Box sx={{ fontSize: "16px", fontWeight: "700" }}>Team</Box>
              <Divider sx={{ my: 2 }} />
              <Box>
                <FormGroup>
                  <FormControlLabel
                    control={
                      <Checkbox
                        sx={{
                          color: "#0A2342",
                          "&.Mui-checked": {
                            color: "#1CC2C4",
                          },
                        }}
                      />
                    }
                    label="Team spirit"
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        sx={{
                          color: "#0A2342",
                          "&.Mui-checked": {
                            color: "#1CC2C4",
                          },
                        }}
                      />
                    }
                    label="Agile work frame"
                  />
                </FormGroup>
              </Box>
            </Box>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                textAlign: "center",
              }}
            >
              <Box sx={{ fontSize: "16px", fontWeight: "700" }}>Software</Box>
              <Divider sx={{ my: 2 }} />
              <Box>
                <FormGroup>
                  <FormControlLabel
                    control={
                      <Checkbox
                        sx={{
                          color: "#0A2342",
                          "&.Mui-checked": {
                            color: "#1CC2C4",
                          },
                        }}
                      />
                    }
                    label="Usability"
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        sx={{
                          color: "#0A2342",
                          "&.Mui-checked": {
                            color: "#1CC2C4",
                          },
                        }}
                      />
                    }
                    label="Reliability"
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        sx={{
                          color: "#0A2342",
                          "&.Mui-checked": {
                            color: "#1CC2C4",
                          },
                        }}
                      />
                    }
                    label="Security"
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        sx={{
                          color: "#0A2342",
                          "&.Mui-checked": {
                            color: "#1CC2C4",
                          },
                        }}
                      />
                    }
                    label="Maintainability"
                  />
                </FormGroup>
              </Box>
            </Box>
          </Box>
        </Box>

        <Box sx={{ borderRadius: "0 0 32px 32px", background: "#fff", py: 8 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              px: 8,
              width: "100%",
              margin: "0 auto",
            }}
          >
            <Box sx={{ display: "contents" }}>
              <Box
                sx={{
                  px: "10px",
                  color: "#D81E5B",
                  background: "#FDF1F5",
                  fontSize: "11px",
                  border: "1px solid #D81E5B",
                  borderRadius: "8px",
                }}
              >
                software
              </Box>
              <Box sx={{ fontSize: "24px", fontWeight: "500", ml: 4 }}>
                Usablity
              </Box>
            </Box>
            <AdviceSlider defaultValue={1} />
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                textAlign: "center",
              }}
            >
              <Box
                sx={{ color: "#9DA7B3", fontSize: "11px", fontWeight: "400" }}
              >
                from
              </Box>
              <Box
                sx={{ color: "#FDAE61", fontSize: "11px", fontWeight: "700" }}
              >
                Moderate
              </Box>
              <Box
                sx={{ color: "#9DA7B3", fontSize: "11px", fontWeight: "400" }}
              >
                to
              </Box>
              <Box
                sx={{ color: "#66BD63", fontSize: "16px", fontWeight: "700" }}
              >
                Good
              </Box>
            </Box>
          </Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              px: 8,
              width: "100%",
              margin: "0 auto",
            }}
          >
            <Box sx={{ display: "contents" }}>
              <Box
                sx={{
                  px: "10px",
                  color: "#D81E5B",
                  background: "#FDF1F5",
                  fontSize: "11px",
                  border: "1px solid #D81E5B",
                  borderRadius: "8px",
                }}
              >
                software
              </Box>
              <Box sx={{ fontSize: "24px", fontWeight: "500", ml: 4 }}>
                Usablity
              </Box>
            </Box>
            <AdviceSlider defaultValue={3} />
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                textAlign: "center",
              }}
            >
              <Box
                sx={{ color: "#9DA7B3", fontSize: "11px", fontWeight: "400" }}
              >
                from
              </Box>
              <Box
                sx={{ color: "#FDAE61", fontSize: "11px", fontWeight: "700" }}
              >
                Moderate
              </Box>
              <Box
                sx={{ color: "#9DA7B3", fontSize: "11px", fontWeight: "400" }}
              >
                to
              </Box>
              <Box
                sx={{ color: "#66BD63", fontSize: "16px", fontWeight: "700" }}
              >
                Good
              </Box>
            </Box>
          </Box>
          <Box sx={{ mt: "64px", display: "flex", justifyContent: "center" }}>
            <Button
              sx={{
                color: "#1CC2C4",
                px: 2,
                py: 1,
                borderRadius: "16px",
                fontSize: "16px",
                fontWeight: "700",
                width: "fit-content",
                mr:2
              }}
            >
              cancel
            </Button>
            <Button
              sx={{
                background: "#1CC2C4",
                color: "#EDFCFC",
                px: 2,
                py: 1,
                borderRadius: "16px",
                fontSize: "16px",
                fontWeight: "700",
                width: "fit-content",
              }}
            >
              Set these parameters
            </Button>
          </Box>
        </Box>
      </Box>
      <Box mt={6}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Box sx={{ fontSize: "64px", color: "#1CC2C4", fontWeight: "700" }}>
            1
          </Box>
          <Box
            sx={{
              width: "15%",
              color: "#0A2342",
              fontSize: "16px",
              fontWeight: "700",
            }}
          >
            Invest in team training and education
          </Box>{" "}
          <Box
            sx={{
              width: "40%",
              color: "#0A2342",
              fontSize: "14px",
              fontWeight: "300",
            }}
          >
            Your team should be aware of the latest technologies, tools, and
            standards for software development. They should also learn how to
            write secure, clean, and maintainable code. This can improve the
            quality and performance of your software.
          </Box>
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              width: "15%",
              justifyContent: "center",
            }}
          >
            <Box
              sx={{
                px: "10px",
                color: "#0A2342",
                background: "#EDF4FC",
                fontSize: "11px",
                border: "1px solid #0A2342",
                borderRadius: "8px",
                m: "4px",
              }}
            >
              Team spirit
            </Box>
            <Box
              sx={{
                px: "10px",
                color: "#D81E5B",
                background: "#FDF1F5",
                fontSize: "11px",
                border: "1px solid #D81E5B",
                borderRadius: "8px",
                m: "4px",
              }}
            >
              reliability
            </Box>
            <Box
              sx={{
                px: "10px",
                color: "#F9A03F",
                background: "#FEF5EB",
                fontSize: "11px",
                border: "1px solid #F9A03F",
                borderRadius: "8px",
                m: "4px",
              }}
            >
              maintainability
            </Box>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Box>
              <svg
                width="23"
                height="14"
                viewBox="0 0 23 14"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M18.925 1.00004L11.165 8.76004L3.405 1.00004C2.625 0.220039 1.365 0.220039 0.585 1.00004C-0.195 1.78004 -0.195 3.04004 0.585 3.82004L9.765 13C10.545 13.78 11.805 13.78 12.585 13L21.765 3.82004C22.545 3.04004 22.545 1.78004 21.765 1.00004C20.985 0.240039 19.705 0.220039 18.925 1.00004Z"
                  fill="#1CC2C4"
                />
              </svg>
            </Box>
            <Box sx={{ ml: 2 }}>
              <svg
                width="37"
                height="36"
                viewBox="0 0 37 36"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  opacity="0.3"
                  d="M9.34998 6H27.35V31.5H9.34998V6Z"
                  fill="#1CC2C4"
                />
                <path
                  d="M16.85 27H13.85V10.5H16.85V27ZM22.85 27H19.85V10.5H22.85V27ZM6.34998 4.5H30.35V7.5H6.34998V4.5Z"
                  fill="#1CC2C4"
                />
                <path
                  d="M25.85 7.5L21.35 3H15.35L10.85 7.5H25.85Z"
                  fill="#1CC2C4"
                />
                <path
                  d="M25.85 33H10.85C9.19998 33 7.84998 31.65 7.84998 30V4.5H28.85V30C28.85 31.65 27.5 33 25.85 33ZM10.85 7.5V30H25.85V7.5H10.85Z"
                  fill="#1CC2C4"
                />
              </svg>
            </Box>
          </Box>
        </Box>
        <Divider />
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Box sx={{ fontSize: "64px", color: "#1CC2C4", fontWeight: "700" }}>
            2
          </Box>
          <Box
            sx={{
              width: "15%",
              color: "#0A2342",
              fontSize: "16px",
              fontWeight: "700",
            }}
          >
            Invest in team training and education
          </Box>{" "}
          <Box
            sx={{
              width: "40%",
              color: "#0A2342",
              fontSize: "14px",
              fontWeight: "300",
            }}
          >
            Your team should be aware of the latest technologies, tools, and
            standards for software development. They should also learn how to
            write secure, clean, and maintainable code. This can improve the
            quality and performance of your software.
          </Box>
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              width: "15%",
              justifyContent: "center",
            }}
          >
            <Box
              sx={{
                px: "10px",
                color: "#0A2342",
                background: "#EDF4FC",
                fontSize: "11px",
                border: "1px solid #0A2342",
                borderRadius: "8px",
                m: "4px",
              }}
            >
              Team spirit
            </Box>
            <Box
              sx={{
                px: "10px",
                color: "#D81E5B",
                background: "#FDF1F5",
                fontSize: "11px",
                border: "1px solid #D81E5B",
                borderRadius: "8px",
                m: "4px",
              }}
            >
              reliability
            </Box>
            <Box
              sx={{
                px: "10px",
                color: "#F9A03F",
                background: "#FEF5EB",
                fontSize: "11px",
                border: "1px solid #F9A03F",
                borderRadius: "8px",
                m: "4px",
              }}
            >
              maintainability
            </Box>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Box>
              <svg
                width="23"
                height="14"
                viewBox="0 0 23 14"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M18.925 1.00004L11.165 8.76004L3.405 1.00004C2.625 0.220039 1.365 0.220039 0.585 1.00004C-0.195 1.78004 -0.195 3.04004 0.585 3.82004L9.765 13C10.545 13.78 11.805 13.78 12.585 13L21.765 3.82004C22.545 3.04004 22.545 1.78004 21.765 1.00004C20.985 0.240039 19.705 0.220039 18.925 1.00004Z"
                  fill="#1CC2C4"
                />
              </svg>
            </Box>
            <Box sx={{ ml: 2 }}>
              <svg
                width="37"
                height="36"
                viewBox="0 0 37 36"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  opacity="0.3"
                  d="M9.34998 6H27.35V31.5H9.34998V6Z"
                  fill="#1CC2C4"
                />
                <path
                  d="M16.85 27H13.85V10.5H16.85V27ZM22.85 27H19.85V10.5H22.85V27ZM6.34998 4.5H30.35V7.5H6.34998V4.5Z"
                  fill="#1CC2C4"
                />
                <path
                  d="M25.85 7.5L21.35 3H15.35L10.85 7.5H25.85Z"
                  fill="#1CC2C4"
                />
                <path
                  d="M25.85 33H10.85C9.19998 33 7.84998 31.65 7.84998 30V4.5H28.85V30C28.85 31.65 27.5 33 25.85 33ZM10.85 7.5V30H25.85V7.5H10.85Z"
                  fill="#1CC2C4"
                />
              </svg>
            </Box>
          </Box>
        </Box>
        <Divider />
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Box sx={{ fontSize: "64px", color: "#1CC2C4", fontWeight: "700" }}>
            3
          </Box>
          <Box
            sx={{
              width: "15%",
              color: "#0A2342",
              fontSize: "16px",
              fontWeight: "700",
            }}
          >
            Invest in team training and education
          </Box>{" "}
          <Box
            sx={{
              width: "40%",
              color: "#0A2342",
              fontSize: "14px",
              fontWeight: "300",
            }}
          >
            Your team should be aware of the latest technologies, tools, and
            standards for software development. They should also learn how to
            write secure, clean, and maintainable code. This can improve the
            quality and performance of your software.
          </Box>
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              width: "15%",
              justifyContent: "center",
            }}
          >
            <Box
              sx={{
                px: "10px",
                color: "#0A2342",
                background: "#EDF4FC",
                fontSize: "11px",
                border: "1px solid #0A2342",
                borderRadius: "8px",
                m: "4px",
              }}
            >
              Team spirit
            </Box>
            <Box
              sx={{
                px: "10px",
                color: "#D81E5B",
                background: "#FDF1F5",
                fontSize: "11px",
                border: "1px solid #D81E5B",
                borderRadius: "8px",
                m: "4px",
              }}
            >
              reliability
            </Box>
            <Box
              sx={{
                px: "10px",
                color: "#F9A03F",
                background: "#FEF5EB",
                fontSize: "11px",
                border: "1px solid #F9A03F",
                borderRadius: "8px",
                m: "4px",
              }}
            >
              maintainability
            </Box>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Box>
              <svg
                width="23"
                height="14"
                viewBox="0 0 23 14"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M18.925 1.00004L11.165 8.76004L3.405 1.00004C2.625 0.220039 1.365 0.220039 0.585 1.00004C-0.195 1.78004 -0.195 3.04004 0.585 3.82004L9.765 13C10.545 13.78 11.805 13.78 12.585 13L21.765 3.82004C22.545 3.04004 22.545 1.78004 21.765 1.00004C20.985 0.240039 19.705 0.220039 18.925 1.00004Z"
                  fill="#1CC2C4"
                />
              </svg>
            </Box>
            <Box sx={{ ml: 2 }}>
              <svg
                width="37"
                height="36"
                viewBox="0 0 37 36"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  opacity="0.3"
                  d="M9.34998 6H27.35V31.5H9.34998V6Z"
                  fill="#1CC2C4"
                />
                <path
                  d="M16.85 27H13.85V10.5H16.85V27ZM22.85 27H19.85V10.5H22.85V27ZM6.34998 4.5H30.35V7.5H6.34998V4.5Z"
                  fill="#1CC2C4"
                />
                <path
                  d="M25.85 7.5L21.35 3H15.35L10.85 7.5H25.85Z"
                  fill="#1CC2C4"
                />
                <path
                  d="M25.85 33H10.85C9.19998 33 7.84998 31.65 7.84998 30V4.5H28.85V30C28.85 31.65 27.5 33 25.85 33ZM10.85 7.5V30H25.85V7.5H10.85Z"
                  fill="#1CC2C4"
                />
              </svg>
            </Box>
          </Box>
        </Box>
      </Box>
    </div>
  );
};

export default AssessmentAdviceContainer;
