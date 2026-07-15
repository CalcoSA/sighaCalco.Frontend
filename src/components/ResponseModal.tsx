import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  Typography,
} from "@mui/material";
import WarningAmberOutlinedIcon from "@mui/icons-material/WarningAmberOutlined";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import DoneOutlinedIcon from "@mui/icons-material/DoneOutlined";
import type { ResponseModalProps } from "./common/ModalType";

const modalConfig = {
  success: {
    icon: <DoneOutlinedIcon />,
    color: "#2E7D32",
    bgColor: "#E8F5E9",
  },
  error: {
    icon: <CloseOutlinedIcon />,
    color: "#C62828",
    bgColor: "#FFEBEE",
  },
  warning: {
    icon: <WarningAmberOutlinedIcon />,
    color: "#ED6C02",
    bgColor: "#FFF4E5",
  },
  info: {
    icon: <InfoOutlinedIcon />,
    color: "#0288D1",
    bgColor: "#E5F6FD",
  },
};

export function ResponseModal({
  open,
  severity,
  title,
  message,
  buttonText = "Aceptar",
  confirmButtonText,
  onClose,
  onConfirm,
}: ResponseModalProps) {
  const config = modalConfig[severity];
  const isConfirmModal = Boolean(onConfirm);

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
      <DialogContent
        sx={{
          pt: 4,
          pb: 2,
          px: 4,
          textAlign: "center",
        }}
      >
        <Box
          sx={{
            width: 72,
            height: 72,
            borderRadius: "50%",
            bgcolor: config.bgColor,
            color: config.color,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            mx: "auto",
            mb: 2,
            "& svg": {
              fontSize: 44,
            },
          }}
        >
          {config.icon}
        </Box>

        <Typography
          sx={{
            color: "#4B2E1F",
            fontSize: 22,
            fontWeight: 700,
            mb: 1,
          }}
        >
          {title}
        </Typography>

        <Typography
          sx={{
            color: "#6B4A3A",
            fontSize: 15,
            lineHeight: 1.6,
          }}
        >
          {message}
        </Typography>
      </DialogContent>

      <DialogActions
        sx={{
          px: 4,
          pb: 3,
          justifyContent: "center",
          gap: 1,
        }}
      >
        <Button
          variant={isConfirmModal ? "outlined" : "contained"}
          onClick={onClose}
          sx={{
            borderColor: "#8B6A55",
            color: isConfirmModal ? "#4B2E1F" : "#FFFFFF",
            bgcolor: isConfirmModal ? "#FFFFFF" : "#4B2E1F",
            textTransform: "none",
            fontWeight: 600,
            minWidth: 120,
            "&:hover": {
              borderColor: "#4B2E1F",
              bgcolor: isConfirmModal ? "#F7E8D8" : "#3A2318",
            },
          }}
        >
          {isConfirmModal ? "Cancelar" : buttonText}
        </Button>

        {onConfirm && (
          <Button
            variant="contained"
            onClick={onConfirm}
            sx={{
              bgcolor: "#C62828",
              color: "#FFFFFF",
              textTransform: "none",
              fontWeight: 600,
              minWidth: 120,
              "&:hover": {
                bgcolor: "#A61F1F",
              },
            }}
          >
            {confirmButtonText || "Confirmar"}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
}