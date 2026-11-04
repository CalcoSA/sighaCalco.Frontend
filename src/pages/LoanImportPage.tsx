import {
  Box,
  Button,
  CircularProgress,
  Paper,
  Stack,
  Typography,
} from "@mui/material";

import type {
  ResponseModalSeverity,
  ResponseModalState,
} from "../components/common/ModalType";

import type {
  LoanImportResult,
} from "../models/LoanImport";

import UploadFileOutlinedIcon
  from "@mui/icons-material/UploadFileOutlined";

import CleaningServicesOutlinedIcon
  from "@mui/icons-material/CleaningServicesOutlined";

import CloudUploadOutlinedIcon
  from "@mui/icons-material/CloudUploadOutlined";

import { ResponseModal }
  from "../components/ResponseModal";

import { getErrorMessage }
  from "../services/errorService";

import { loanService }
  from "../services/loanService";

import type {
  ChangeEvent,
} from "react";

import {
  useRef,
  useState,
} from "react";


const emptyResponseModal: ResponseModalState = {
  open: false,
  severity: "info",
  title: "",
  message: "",
};


interface SummaryCardProps {
  label: string;
  value: number;
}


function SummaryCard({
  label,
  value,
}: SummaryCardProps) {

  return (
    <Paper
      elevation={0}
      sx={{
        p: 2,
        border: "1px solid #E0CDBB",
        borderRadius: 2,
      }}
    >
      <Typography
        sx={{
          color: "#8B6A55",
          fontSize: 14,
          mb: 0.5,
        }}
      >
        {label}
      </Typography>

      <Typography
        sx={{
          color: "#4B2E1F",
          fontSize: 24,
          fontWeight: 700,
        }}
      >
        {value}
      </Typography>
    </Paper>
  );
}


export function LoanImportPage() {

  const [
    selectedFile,
    setSelectedFile,
  ] = useState<File | null>(null);

  const [
    result,
    setResult,
  ] = useState<LoanImportResult | null>(
    null
  );

  const [
    loading,
    setLoading,
  ] = useState(false);

  const [
    responseModal,
    setResponseModal,
  ] = useState<ResponseModalState>(
    emptyResponseModal
  );

  const fileInputRef =
    useRef<HTMLInputElement | null>(
      null
    );


  const showResponseModal = (
    severity: ResponseModalSeverity,
    title: string,
    message: string
  ) => {

    setResponseModal({
      open: true,
      severity,
      title,
      message,
    });
  };


  const closeResponseModal = () => {

    setResponseModal(
      (previous) => ({
        ...previous,
        open: false,
      })
    );
  };


  const handleFileChange = (
    event:
      ChangeEvent<HTMLInputElement>
  ) => {

    const file =
      event.target.files?.[0]
      ?? null;

    setSelectedFile(
      file
    );

    setResult(
      null
    );
  };


  const handleImport = async () => {

    if (!selectedFile) {

      showResponseModal(
        "warning",
        "Archivo requerido",
        "Debe seleccionar un archivo Excel para realizar la carga."
      );

      return;
    }


    const fileName =
      selectedFile.name.toLowerCase();


    if (!fileName.endsWith(".xlsx")) {

      showResponseModal(
        "warning",
        "Archivo no válido",
        "El archivo debe tener extensión .xlsx."
      );

      return;
    }


    try {

      setLoading(true);

      setResult(null);


      const response =
        await loanService.importFromExcel(
          selectedFile
        );


      if (
        !response.isSuccess
        || !response.result
      ) {

        showResponseModal(
          "warning",
          "No se pudo realizar la carga",
          response.Message
          || "El proceso terminó sin información."
        );

        return;
      }


      setResult(
        response.result
      );


      showResponseModal(
        "success",
        "Carga realizada",
        response.Message
        || "Préstamos y emolumentos importados correctamente."
      );

    } catch (error) {

      setResult(null);

      showResponseModal(
        "error",
        "Error al importar",
        getErrorMessage(error)
      );

    } finally {

      setLoading(false);
    }
  };


  const handleClear = () => {

    setSelectedFile(null);

    setResult(null);

    if (fileInputRef.current) {

      fileInputRef.current.value = "";
    }
  };


  return (
    <Box>

      <Stack
        direction="row"
        spacing={1.5}
        sx={{
          alignItems: "center",
          mb: 3,
        }}
      >
        <CloudUploadOutlinedIcon
          sx={{
            color: "#4B2E1F",
            fontSize: 30,
          }}
        />

        <Typography
          sx={{
            color: "#4B2E1F",
            fontSize: {
              xs: 22,
              sm: 26,
            },
            fontWeight: 700,
          }}
        >
          Carga inicial
        </Typography>

      </Stack>


      <Paper
        elevation={0}
        sx={{
          p: {
            xs: 2,
            sm: 3,
          },
          mb: 3,
          border:
            "1px solid #E0CDBB",
          borderRadius: 2,
        }}
      >

        <Typography
          sx={{
            color: "#4B2E1F",
            fontSize: 18,
            fontWeight: 700,
            mb: 1,
          }}
        >
          Importar préstamos y emolumentos
        </Typography>


        <Typography
          sx={{
            color: "#6D4C41",
            fontSize: 14,
            mb: 3,
          }}
        >
          Seleccione el archivo Excel
          que contiene la información
          inicial de préstamos,
          emolumentos y cuotas.
        </Typography>


        <Stack
          sx={{
            flexDirection: {
              xs: "column",
              lg: "row",
            },
            gap: 1.5,
            alignItems: {
              xs: "stretch",
              lg: "center",
            },
          }}
        >

          <input
            ref={fileInputRef}
            type="file"
            accept=".xlsx"
            hidden
            onChange={
              handleFileChange
            }
          />


          <Button
            variant="outlined"
            startIcon={
              <UploadFileOutlinedIcon />
            }
            disabled={loading}
            onClick={() =>
              fileInputRef
                .current
                ?.click()
            }
            sx={{
              width: {
                xs: "100%",
                lg: "auto",
              },
              height: 40,
              borderColor:
                "#8B6A55",
              color:
                "#4B2E1F",
              textTransform:
                "none",
              fontWeight: 600,

              "&:hover": {
                borderColor:
                  "#4B2E1F",
                bgcolor:
                  "rgba(75,46,31,0.05)",
              },
            }}
          >
            Seleccionar Excel
          </Button>


          <Typography
            sx={{
              flex: 1,
              minWidth: 0,
              color:
                selectedFile
                  ? "#4B2E1F"
                  : "#8B6A55",
              fontSize: 14,
              overflow:
                "hidden",
              textOverflow:
                "ellipsis",
              whiteSpace:
                "nowrap",
            }}
          >
            {
              selectedFile
                ? selectedFile.name
                : "Ningún archivo seleccionado"
            }
          </Typography>


          <Button
            variant="outlined"
            startIcon={
              loading
                ? (
                  <CircularProgress
                    size={18}
                  />
                )
                : (
                  <CloudUploadOutlinedIcon />
                )
            }
            disabled={
              loading
              || !selectedFile
            }
            onClick={
              handleImport
            }
            sx={{
              width: {
                xs: "100%",
                lg: "auto",
              },
              height: 40,
              minWidth: 120,
              borderColor:
                "#8B6A55",
              color:
                "#4B2E1F",
              textTransform:
                "none",
              fontWeight: 600,

              "&:hover": {
                borderColor:
                  "#4B2E1F",
                bgcolor:
                  "rgba(75,46,31,0.05)",
              },
            }}
          >
            {
              loading
                ? "Importando..."
                : "Importar"
            }
          </Button>


          <Button
            variant="outlined"
            startIcon={
              <CleaningServicesOutlinedIcon />
            }
            disabled={loading}
            onClick={
              handleClear
            }
            sx={{
              width: {
                xs: "100%",
                lg: "auto",
              },
              height: 40,
              borderColor:
                "#8B6A55",
              color:
                "#4B2E1F",
              textTransform:
                "none",
              fontWeight: 600,

              "&:hover": {
                borderColor:
                  "#4B2E1F",
                bgcolor:
                  "rgba(75,46,31,0.05)",
              },
            }}
          >
            Limpiar
          </Button>

        </Stack>

      </Paper>


      {loading && (

        <Paper
          elevation={0}
          sx={{
            py: 6,
            mb: 3,
            border:
              "1px solid #E0CDBB",
            borderRadius: 2,
            display: "flex",
            justifyContent:
              "center",
          }}
        >
          <CircularProgress
            sx={{
              color:
                "#4B2E1F",
            }}
          />
        </Paper>

      )}


      {!loading && result && (

        <Box
          sx={{
            display: "grid",

            gridTemplateColumns: {
              xs:
                "1fr",
              sm:
                "repeat(2, minmax(0, 1fr))",
              lg:
                "repeat(4, minmax(0, 1fr))",
            },

            gap: 2,
          }}
        >

          <SummaryCard
            label="Filas procesadas"
            value={
              result.totalRows
            }
          />

          <SummaryCard
            label="Préstamos creados"
            value={
              result.loansCreated
            }
          />

          <SummaryCard
            label="Emolumentos creados"
            value={
              result.servicesCreated
            }
          />

          <SummaryCard
            label="Cuotas creadas"
            value={
              result.installmentsCreated
            }
          />

        </Box>

      )}


      <ResponseModal
        open={
          responseModal.open
        }
        severity={
          responseModal.severity
        }
        title={
          responseModal.title
        }
        message={
          responseModal.message
        }
        onClose={
          closeResponseModal
        }
      />

    </Box>
  );
}