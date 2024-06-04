import { lazy, Suspense } from "react";
import { colorPallet } from "./style";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

interface confidenceLevelType {
  inputNumber: number | null | undefined;
  displayNumber?: boolean;
}

const ConfidenceLevel = ({
  inputNumber = 0,
  displayNumber = false,
}: confidenceLevelType) => {
  const { id, colorText, number } = calculate(inputNumber);

  const ImgRate = lazy(() => import(`./confLevel${id}.tsx`));

  return (
    <Suspense fallback={<Box>fallback</Box>}>
      <Box
        sx={{
          display: "inline-flex",
          justifyContent: "center",
          alignItems: "center",
          gap: "2px",
        }}
      >
        {displayNumber && (
          <Typography
            sx={{ fontWeight: 900, fontSize: "1.25rem" }}
            color={colorText}
          >
            {number}%
          </Typography>
        )}
        <ImgRate />
      </Box>
    </Suspense>
  );
};

const calculate = (inputNumber: any) => {
  let number;
  let id;
  let colorText;

  if (!inputNumber || typeof inputNumber !== "number") {
    number = 0;
  } else {
    number = Math.ceil(inputNumber);
  }

  switch (number >= 0) {
    case number <= 10:
      id = 10;
      colorText = colorPallet["10"];
      break;
    case number <= 20:
      id = 20;
      colorText = colorPallet["20"];
      break;
    case number <= 30:
      id = 30;
      colorText = colorPallet["30"];
      break;
    case number <= 40:
      id = 40;
      colorText = colorPallet["40"];
      break;
    case number <= 50:
      id = 50;
      colorText = colorPallet["50"];
      break;
    case number <= 60:
      id = 60;
      colorText = colorPallet["60"];
      break;
    case number <= 70:
      id = 70;
      colorText = colorPallet["70"];
      break;
    case number <= 80:
      id = 80;
      colorText = colorPallet["80"];
      break;
    case number <= 90:
      id = 90;
      colorText = colorPallet["90"];
      break;
    case number <= 100:
      id = 100;
      colorText = colorPallet["100"];
      break;
    default:
      id = 100;
      colorText = colorPallet["100"];
  }

  return { id, colorText, number };
};

export default ConfidenceLevel;
