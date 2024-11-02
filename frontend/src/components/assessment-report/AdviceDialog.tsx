import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Typography from "@mui/material/Typography";
import { LoadingButton } from "@mui/lab";
import { Trans } from "react-i18next";
import { styles } from "@/config/styles";
import Setting from "@assets/svg/setting.svg";
import AdviceSlider from "../common/AdviceSlider";
import { theme } from "@/config/theme";

const AdviceDialog = ({
  open,
  handleClose,
  subjects,
  target,
  setTarget,
  filteredMaturityLevels,
  createAdvice,
  loading,
}: any) => {
  return (
    <Dialog
      open={open}
      onClose={handleClose}
      fullWidth
      maxWidth="md"
      fullScreen={false} // Pass as needed
    >
      <DialogTitle sx={{ ...styles.centerV }}>
        <>
          <img
            src={Setting}
            alt="setting"
            width="24px"
            style={{
              marginRight: theme.direction === "ltr" ? "6px" : "unset",
              marginLeft: theme.direction === "rtl" ? "6px" : "unset",
            }}
          />
          <Trans i18nKey="adviceAssistant" />
        </>
      </DialogTitle>

      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          background: "rgba(36, 102, 168, 0.08)",
          color: "#6C7B8E",
          paddingY: 1,
          paddingX: 4,
          maxWidth: "100%",
          marginTop: "-8px",
        }}
      >
        <Typography variant="titleMedium" fontWeight={400} textAlign="left">
          <Trans i18nKey="wichAttYouWant" />
        </Typography>
      </Box>

      <DialogContent
        sx={{
          padding: "unset",
          background: "#fff",
          overflowX: "hidden",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          textAlign: "center",
          gap: 3,
          p: 2,
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            width: "100%",
            margin: "0 auto",
          }}
        >
          <Box
            mt={2}
            sx={{
              borderRadius: { xs: 0, sm: "0 0 12px 12px" },
              background: "#fff",
              maxHeight: "60vh",
              overflow: "auto",
              overflowX: "hidden",
            }}
          >
            {subjects.map((subject: any) =>
              subject?.attributes.map((attribute: any) => (
                <AdviceSlider
                  key={attribute.id}
                  defaultValue={attribute?.maturityLevel?.value || 0}
                  currentState={attribute?.maturityLevel}
                  attribute={attribute}
                  subject={subject}
                  maturityLevels={filteredMaturityLevels}
                  target={target}
                  setTarget={setTarget}
                />
              )),
            )}
          </Box>
          <Box
            sx={{
              width: "100%",
              display: "flex",
              gap: 2,
              padding: "16px",
              justifyContent: "flex-end",
            }}
          >
            <Button onClick={handleClose}>
              <Trans i18nKey="cancel" />
            </Button>

            <LoadingButton
              variant="contained"
              color="primary"
              onClick={createAdvice}
              loading={loading}
            >
              <Trans i18nKey="setTheseParameters" />
            </LoadingButton>
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default AdviceDialog;
