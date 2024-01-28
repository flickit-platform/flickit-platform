import Title from "@common/Title";
import { useState } from "react";
import { Trans } from "react-i18next";
import SupTitleBreadcrumb from "@common/SupTitleBreadcrumb";
import AdviceSlider from "../common/AdviceSlider";
import Box from "@mui/material/Box";
import { Button, Divider } from "@mui/material";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
const AssessmentAdviceContainer = () => {
  const [expanded, setExpanded] = useState<string | false>(false);
  return (
    <div>
      <Box mt={4}>
        <Title
          borderBottom={true}
          sx={{ borderBottomColor: "#000" }}
          inPageLink="advice"
        >
          <Trans i18nKey="advice" />
        </Title>
      </Box>
      {expanded && (
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
              Which attributes you want to change? The Advisor will try to
              provide most accurate advice based on your choices
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

          <Box
            sx={{ borderRadius: "0 0 32px 32px", background: "#fff", py: 8 }}
          >
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
                  mr: 2,
                }}
                onClick={() => setExpanded(false)}
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
      )}

      <Box mt={6}>
        <Box
          sx={{
            fontSize: "64px",
            fontWeight: "700",
            color: "#1CC2C4",
            textShadow: "0px 0px 11.2px rgba(28, 194, 196, 0.50)",
            textAlign: "center",
          }}
        >
          Advisor
        </Box>
        <Box
          sx={{
            fontSize: "16px",
            fontWeight: "400",
            color: "#0A2342",
            px: 16,
            margin: "0 auto",
            mb: 16,
          }}
        >
          The Advisor service provides you some tips help you to improve your
          software score in diffrent subjects and attributes. It considers your
          priorities you tell itand tries to Give Advices with most
          effectiveness and least efforts to fullfill. some advices affect more
          than attributes and subject. you can always change your preferences
          and goals via setting new parameteres for advisor. There are many
          factors determining the situation whetere an advice worths its costs
          and efforts or not for you. we are always here to to see if you have
          any further question but the final decision is yours! Make it wise.
        </Box>
        <Box
          sx={{
            fontSize: "32px",
            fontWeight: "700",
            color: "#0A2342",
            textShadow: "0px 0px 11.2px rgba(10, 35, 66, 0.30)",
            textAlign: "center",
            mb: 6,
          }}
        >
          Advices list
        </Box>

        {/* list header */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 4,
          }}
        >
          <Box
            sx={{
              fontSize: "16px",
              color: "#9DA7B3",
              fontWeight: "700",
              textAlign: "center",
              width: "5%",
            }}
          >
            Number
          </Box>
          <Box
            sx={{
              width: "40%",
              fontSize: "16px",
              color: "#9DA7B3",
              fontWeight: "700",
              textAlign: "center",
            }}
          >
            Question
          </Box>
          <Box
            sx={{
              width: "10%",
              fontSize: "16px",
              color: "#9DA7B3",
              fontWeight: "700",
              textAlign: "center",
            }}
          >
            What is now
          </Box>
          <Box
            sx={{
              width: "10%",
              fontSize: "16px",
              color: "#9DA7B3",
              fontWeight: "700",
              textAlign: "center",
            }}
          >
            What should be
          </Box>
          <Box
            sx={{
              width: "15%",
              fontSize: "16px",
              color: "#9DA7B3",
              fontWeight: "700",
              textAlign: "center",
            }}
          >
            Targeted attributes
          </Box>
          <Box
            sx={{
              width: "10%",
              fontSize: "16px",
              color: "#9DA7B3",
              fontWeight: "700",
              textAlign: "center",
            }}
          >
            Questionnaire
          </Box>
        </Box>
        {/* list item */}

        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Box
            sx={{
              fontSize: "64px",
              color: "#1CC2C4",
              fontWeight: "700",
              width: "5%",
            }}
          >
            1
          </Box>
          <Box
            sx={{
              width: "40%",
              color: "#0A2342",
              fontSize: "16px",
              fontWeight: "700",
            }}
          >
            Have suitable architectural styles and patterns (such as
            microservices, service-oriented, message-based, actor model, event
            sourcing, etc.) been chosen for your software?
          </Box>
          <Box
            sx={{
              width: "10%",
              color: "#0A2342",
              fontSize: "14px",
              fontWeight: "300",
              textAlign: "center",
            }}
          >
            opt2 : 20-40 %
          </Box>
          <Box
            sx={{
              width: "10%",
              color: "#0A2342",
              fontSize: "14px",
              fontWeight: "300",
              textAlign: "center",
            }}
          >
            opt3: 60 - 70%
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
          <Box
            sx={{
              width: "10%",
              color: "#1CC2C4",
              fontSize: "14px",
              fontWeight: "500",
              textDecoration: "underline",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            Code Quality
            <Box sx={{ textAlign: "center", textDecoration: "none" }}>Q.11</Box>
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
          <Box
            sx={{
              fontSize: "64px",
              color: "#1CC2C4",
              fontWeight: "700",
              width: "5%",
            }}
          >
            2
          </Box>
          <Box
            sx={{
              width: "40%",
              color: "#0A2342",
              fontSize: "16px",
              fontWeight: "700",
            }}
          >
            Have the functionalities of the system been properly divided among
            the components?
          </Box>
          <Box
            sx={{
              width: "10%",
              color: "#0A2342",
              fontSize: "14px",
              fontWeight: "300",
              textAlign: "center",
            }}
          >
            opt2 : 20-40 %
          </Box>
          <Box
            sx={{
              width: "10%",
              color: "#0A2342",
              fontSize: "14px",
              fontWeight: "300",
              textAlign: "center",
            }}
          >
            opt3: 60 - 70%
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
          <Box
            sx={{
              width: "10%",
              color: "#1CC2C4",
              fontSize: "14px",
              fontWeight: "500",
              textDecoration: "underline",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            Code Quality
            <Box sx={{ textAlign: "center" }}>Q.11</Box>
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
          <Box
            sx={{
              fontSize: "64px",
              color: "#1CC2C4",
              fontWeight: "700",
              width: "5%",
            }}
          >
            3
          </Box>
          <Box
            sx={{
              width: "40%",
              color: "#0A2342",
              fontSize: "16px",
              fontWeight: "700",
            }}
          >
            Has the appropriate layering architecture (e.g. hexagonal,
            three-tier, DDD, etc.) been chosen for the system?
          </Box>
          <Box
            sx={{
              width: "10%",
              color: "#0A2342",
              fontSize: "14px",
              fontWeight: "300",
              textAlign: "center",
            }}
          >
            opt2 : 20-40 %
          </Box>
          <Box
            sx={{
              width: "10%",
              color: "#0A2342",
              fontSize: "14px",
              fontWeight: "300",
              textAlign: "center",
            }}
          >
            opt3: 60 - 70%
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
          <Box
            sx={{
              width: "10%",
              color: "#1CC2C4",
              fontSize: "14px",
              fontWeight: "500",
              textDecoration: "underline",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            Code Quality
            <Box sx={{ textAlign: "center", textDecoration: "none" }}>Q.11</Box>
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
          <Box
            sx={{
              fontSize: "64px",
              color: "#1CC2C4",
              fontWeight: "700",
              width: "5%",
            }}
          >
            4
          </Box>
          <Box
            sx={{
              width: "40%",
              color: "#0A2342",
              fontSize: "16px",
              fontWeight: "700",
            }}
          >
            Is the system resilient to changes in the used technologies (e.g.
            libraries, databases, etc)?
          </Box>
          <Box
            sx={{
              width: "10%",
              color: "#0A2342",
              fontSize: "14px",
              fontWeight: "300",
              textAlign: "center",
            }}
          >
            opt2 : 20-40 %
          </Box>
          <Box
            sx={{
              width: "10%",
              color: "#0A2342",
              fontSize: "14px",
              fontWeight: "300",
              textAlign: "center",
            }}
          >
            opt3: 60 - 70%
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
          <Box
            sx={{
              width: "10%",
              color: "#1CC2C4",
              fontSize: "14px",
              fontWeight: "500",
              textDecoration: "underline",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            Code Quality
            <Box sx={{ textAlign: "center", textDecoration: "none" }}>Q.11</Box>
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
          <Box
            sx={{
              fontSize: "64px",
              color: "#1CC2C4",
              fontWeight: "700",
              width: "5%",
            }}
          >
            5
          </Box>
          <Box
            sx={{
              width: "40%",
              color: "#0A2342",
              fontSize: "16px",
              fontWeight: "700",
            }}
          >
            Is the system deployable on a cloud infrastructure?
          </Box>
          <Box
            sx={{
              width: "10%",
              color: "#0A2342",
              fontSize: "14px",
              fontWeight: "300",
              textAlign: "center",
            }}
          >
            opt2 : 20-40 %
          </Box>
          <Box
            sx={{
              width: "10%",
              color: "#0A2342",
              fontSize: "14px",
              fontWeight: "300",
              textAlign: "center",
            }}
          >
            opt3: 60 - 70%
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
          <Box
            sx={{
              width: "10%",
              color: "#1CC2C4",
              fontSize: "14px",
              fontWeight: "500",
              textDecoration: "underline",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            Code Quality
            <Box sx={{ textAlign: "center", textDecoration: "none" }}>Q.11</Box>
          </Box>
        </Box>
        {/* list item */}
      </Box>
    </div>
  );
};

export default AssessmentAdviceContainer;
