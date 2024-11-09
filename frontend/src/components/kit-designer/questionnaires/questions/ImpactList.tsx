import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import Chip from "@mui/material/Chip";

interface OptionValue {
  optionId: number;
  value: number;
}

interface Impact {
  questionImpactId: number;
  weight: number;
  maturityLevel: {
    maturityLevelId: number;
    title: string;
  };
  optionValues: OptionValue[];
}

interface AttributeImpact {
  attributeId: number;
  title: string;
  impacts: Impact[];
}

interface AttributeImpactListProps {
  attributeImpacts: AttributeImpact[];
}

const AttributeImpactList = ({
  attributeImpacts,
}: AttributeImpactListProps) => {
  return (
    <Box mt={2}>
      {attributeImpacts?.map((attribute) => (
        <Box key={attribute.attributeId} sx={{ mb: 2 }}>
          <Typography variant="semiBoldLarge" gutterBottom>
            {attribute.title}
          </Typography>

          {attribute.impacts.map((impact) => (
            <Box
              key={impact.questionImpactId}
              sx={{
                border: "1px solid #ddd",
                borderRadius: 2,
                p: 2,
                mb: 2,
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Typography variant="subtitle1">
                  Impact on {impact.maturityLevel.title}
                </Typography>
                <Chip
                  label={`Weight: ${impact.weight}`}
                  color="primary"
                  sx={{ mr: 1 }}
                />
              </Box>

              <Box mt={1}>
                <Typography variant="body2">Option Values:</Typography>
                {impact.optionValues.map((option, index) => (
                  <Chip
                    key={option.optionId}
                    label={`Option ${index + 1}: ${option.value}`}
                    sx={{ mr: 1, mt: 0.5 }}
                  />
                ))}
              </Box>
            </Box>
          ))}

          <Divider sx={{ mt: 2 }} />
        </Box>
      ))}
    </Box>
  );
};

export default AttributeImpactList;
