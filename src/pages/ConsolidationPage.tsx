import { Box, Button, Chip, CircularProgress, Paper, Stack, Table, TableBody, TableCell, TableHead, TableRow, Typography } from "@mui/material";
import type { LoanReconciliationResult, LoanReconciliationStatus } from "../models/LoanReconciliation";
import type { ResponseModalSeverity, ResponseModalState } from "../components/common/ModalType";
import PlayCircleOutlineOutlinedIcon from "@mui/icons-material/PlayCircleOutlineOutlined";
import CleaningServicesOutlinedIcon from "@mui/icons-material/CleaningServicesOutlined";
import UploadFileOutlinedIcon from "@mui/icons-material/UploadFileOutlined";
import SummarizeOutlinedIcon from "@mui/icons-material/SummarizeOutlined";
import { ResponseModal } from "../components/ResponseModal";
import { getErrorMessage } from "../services/errorService";
import { loanService } from "../services/loanService";
import type { ChangeEvent } from "react";
import { useRef, useState } from "react";

interface SummaryCardProps {
  label: string;
  value: number;
}

const emptyResponseModal: ResponseModalState = {
  open: false,
  severity: "info",
  title: "",
  message: "",
};

function SummaryCard({label, value}: SummaryCardProps) {
  return (
    <Paper elevation={0} sx={{ p: 2, border: "1px solid #E0CDBB", borderRadius: 2, }}>
      <Typography sx={{ fontSize: 14, color: "#8B6A55", mb: 0.5, }}>
        {label}
      </Typography>
      <Typography sx={{ fontSize: 24, color: "#4B2E1F", fontWeight: 700, }}>
        {value}
      </Typography>
    </Paper>
  );
}

export function ConsolidationPage() {
  const [responseModal, setResponseModal] = useState<ResponseModalState>(emptyResponseModal);
  const [result, setResult] = useState<LoanReconciliationResult | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [loading, setLoading] = useState(false);

  const showResponseModal = (severity: ResponseModalSeverity, title: string, message: string) => {
    setResponseModal({
      open: true,
      severity,
      title,
      message,
    });
  };

  const closeResponseModal = () => {
    setResponseModal((prev) => ({
      ...prev,
      open: false,
    }));
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null;
    setSelectedFile(file);
    setResult(null);
  };

  const handleConsolidate = async () => {
    if (!selectedFile) {
      showResponseModal("warning", "Archivo requerido", "Debe seleccionar un archivo Excel para realizar la conciliación.");
      return;
    }

    try {
      setLoading(true);
      setResult(null);

      const response = await loanService.getReconciliation(selectedFile);

      if (!response.isSuccess || !response.result) {
        showResponseModal("warning", "No se pudo realizar la conciliación", response.Message || "El proceso terminó sin información para mostrar.");
        return;
      }

      setResult(response.result);

      if (response.result.total === 0) {
        showResponseModal("warning", "Sin resultados", response.Message || "No se encontraron registros para conciliar.");
        return;
      }

      showResponseModal("success", "Conciliación realizada", response.Message || "La conciliación se realizó correctamente.");

    } catch (err) {
      setResult(null);
      showResponseModal("error", "Error al realizar conciliación", getErrorMessage(err));

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


  const formatMoney = (value: number | null) => {
    if (value === null) {
      return "";
    }

    return new Intl.NumberFormat(
      "es-CO",
      {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
      }
    ).format(value);
  };


  const formatDate = (value: string | null) => {
    if (!value) {
      return "";
    }

    const dateValue = value.includes("T") ? value.split("T")[0] : value;
    return new Date(`${dateValue}T00:00:00`).toLocaleDateString("es-CO");
  };


  const getStatusChip = (status: LoanReconciliationStatus) => {
    const config: Record<LoanReconciliationStatus,
      {
        label: string;
        bgcolor: string;
        color: string;
      }

    > = {
      IGUAL: {
        label: "Igual",
        bgcolor: "#E8F5E9",
        color: "#2E7D32",
      },

      DIFERENTE: {
        label: "Diferente",
        bgcolor: "#FFF3E0",
        color: "#EF6C00",
      },

      NO_EN_ARCHIVO: {
        label: "No está en archivo",
        bgcolor: "#FFEBEE",
        color: "#C62828",
      },

      NO_EN_SIGHA: {
        label: "No está en SIGHA",
        bgcolor: "#E3F2FD",
        color: "#1565C0",
      },
    };

    const statusConfig = config[status];

    return (
      <Chip label={statusConfig.label} size="small" sx={{ bgcolor: statusConfig.bgcolor, color: statusConfig.color, fontWeight: 700, }} />
    );
  };

  return (
    <Box>
      <Stack direction="row" spacing={1.5} sx={{ alignItems: "center", mb: 3, }}>
        <SummarizeOutlinedIcon sx={{ color: "#4B2E1F", fontSize: 30, }} />
        <Typography sx={{ color: "#4B2E1F", fontSize: 26, fontWeight: 700, }}>
          Conciliación
        </Typography>
      </Stack>
      <Paper elevation={0} sx={{ p: 3, mb: 3, border: "1px solid #E0CDBB", borderRadius: 2, }}>
        <Typography sx={{ color: "#4B2E1F", fontSize: 18, fontWeight: 700, mb: 2, }}>
          Archivo para conciliación
        </Typography>
        <Stack sx={{ flexDirection: { xs: "column", lg: "row",}, gap: 1.5, alignItems: { xs: "stretch", lg: "center", },}}>
          <input ref={fileInputRef} type="file" accept=".xlsx,.xlsm" hidden onChange={handleFileChange} />
          <Button
            variant="outlined"
            startIcon={ <UploadFileOutlinedIcon /> }
            onClick={() => fileInputRef.current?.click()}
            disabled={loading}
            sx={{
              width: {
                xs: "100%",
                lg: "auto",
              },
              height: 40,
              borderColor: "#8B6A55",
              color: "#4B2E1F",
              textTransform: "none",
              fontWeight: 600,
              "&:hover": {
                borderColor: "#4B2E1F",
                bgcolor:
                  "rgba(75, 46, 31, 0.05)",
              },
            }}
          >
            Seleccionar Excel
          </Button>
          <Typography
            sx={{
              flex: 1,
              color: selectedFile
                ? "#4B2E1F"
                : "#8B6A55",
              fontSize: 14,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {selectedFile
              ? selectedFile.name
              : "Ningún archivo seleccionado"}
          </Typography>
          <Button
            variant="outlined"
            disabled={
              !selectedFile ||
              loading
            }
            startIcon={
              loading ? (
                <CircularProgress
                  size={18}
                />
              ) : (
                <PlayCircleOutlineOutlinedIcon />
              )
            }
            onClick={
              handleConsolidate
            }
            sx={{
              width: {
                xs: "100%",
                lg: "auto",
              },
              height: 40,
              borderColor: "#8B6A55",
              color: "#4B2E1F",
              textTransform: "none",
              fontWeight: 600,
              minWidth: 120,
              "&:hover": {
                borderColor: "#4B2E1F",
                bgcolor:
                  "rgba(75, 46, 31, 0.05)",
              },
            }}
          >
            {loading
              ? "Conciliando..."
              : "Conciliar"}
          </Button>
          <Button
            variant="outlined"
            disabled={loading}
            startIcon={
              <CleaningServicesOutlinedIcon />
            }
            onClick={
              handleClear
            }
            sx={{
              width: {
                xs: "100%",
                lg: "auto",
              },
              height: 40,
              borderColor: "#8B6A55",
              color: "#4B2E1F",
              textTransform: "none",
              fontWeight: 600,
              "&:hover": {
                borderColor: "#4B2E1F",
                bgcolor:
                  "rgba(75, 46, 31, 0.05)",
              },
            }}
          >
            Limpiar
          </Button>
        </Stack>
      </Paper>
      {loading && (
        <Paper elevation={0} sx={{ py: 6, mb: 3, border: "1px solid #E0CDBB", borderRadius: 2, display: "flex", justifyContent: "center", }}>
          <CircularProgress sx={{ color: "#4B2E1F", }} />
        </Paper>
      )}
      {!loading && result && (
        <>
          <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "repeat(2, minmax(0, 1fr))", lg: "repeat(4, minmax(0, 1fr))", }, gap: 2, mb: 3, }}>
            <SummaryCard label="Iguales" value={ result.equals } />
            <SummaryCard label="Diferentes" value={ result.different } />
            <SummaryCard label="No están en archivo" value={ result.notInFile } />
            <SummaryCard label="No están en SIGHA" value={ result.notInSigha } />
          </Box>
          <Typography sx={{ color: "#6D4C41", fontSize: 14, mb: 2, }}>
            Total de registros conciliados:{" "}
            <strong>
              {result.total}
            </strong>
          </Typography>
          {result.groups.map(
            (group) => (
              <Paper key={ group.conceptName } elevation={0} sx={{ mb: 3, border: "1px solid #E0CDBB", borderRadius: 2, overflow: "hidden", }}>
                <Box sx={{ px: 2.5, py: 2, bgcolor:"#F7E8D8", }}>
                  <Stack sx={{ flexDirection: { xs: "column", md: "row", }, justifyContent: "space-between", alignItems: { xs: "flex-start", md: "center", }, gap: 1.5, }}>
                    <Typography sx={{ color: "#4B2E1F", fontWeight: 700, fontSize: 17, }}>
                      { group.conceptName }
                    </Typography>
                    <Stack sx={{ flexDirection: "row", flexWrap: "wrap", gap: 1, }}>
                      <Chip size="small" label={ `Total: ${group.total}` } sx={{ fontWeight: 600, }} />
                      <Chip size="small" label={ `Iguales: ${group.equals}` } sx={{ bgcolor: "#E8F5E9", color: "#2E7D32", fontWeight: 600, }} />
                      <Chip size="small" label={ `Diferentes: ${group.different}` } sx={{ bgcolor: "#FFF3E0", color: "#EF6C00", fontWeight: 600, }} />
                      {
                        group.notInFile > 0 && (
                          <Chip size="small" label={ `No archivo: ${group.notInFile}` } sx={{ bgcolor: "#FFEBEE", color: "#C62828", fontWeight: 600, }} />
                        )
                      }
                      {
                        group.notInSigha > 0 && (
                          <Chip size="small" label={ `No SIGHA: ${group.notInSigha}` } sx={{ bgcolor: "#E3F2FD", color: "#1565C0", fontWeight: 600, }} />
                        )
                      }
                    </Stack>
                  </Stack>
                </Box>
                <Box sx={{ width: "100%", overflowX: "auto", WebkitOverflowScrolling: "touch", }}>
                  <Table sx={{ minWidth: 1450, }}>
                    <TableHead>
                      <TableRow>
                        <TableCell colSpan={3} align="center" sx={{ bgcolor:"#FBEFE3", color: "#4B2E1F", fontWeight: 700, borderRight: "2px solid #E0CDBB", }}>
                          ARCHIVO
                        </TableCell>
                        <TableCell colSpan={6} align="center" sx={{ bgcolor: "#EFE5DB", color: "#4B2E1F", fontWeight: 700, borderRight: "2px solid #E0CDBB", }}>
                          SIGHA
                        </TableCell>
                        <TableCell colSpan={2} align="center" sx={{ bgcolor: "#F7E8D8", color: "#4B2E1F", fontWeight: 700, }}>
                          RESULTADO
                        </TableCell>
                      </TableRow>
                      <TableRow sx={{ bgcolor: "#FFF9F4", }}>
                        <TableCell sx={{ fontWeight: 700, color: "#4B2E1F", }}>
                          Documento
                        </TableCell>
                        <TableCell sx={{ fontWeight: 700, color: "#4B2E1F", }}>
                          Nombre
                        </TableCell>
                        <TableCell align="right" sx={{ fontWeight: 700, color: "#4B2E1F", borderRight: "2px solid #E0CDBB", }}>
                          Cuota
                        </TableCell>
                        <TableCell sx={{ fontWeight: 700, color: "#4B2E1F", }}>
                          Documento
                        </TableCell>
                        <TableCell sx={{ fontWeight: 700, color: "#4B2E1F", }}>
                          Nombre
                        </TableCell>
                        <TableCell sx={{ fontWeight: 700, color: "#4B2E1F", }}>
                          Tipo
                        </TableCell>
                        <TableCell sx={{ fontWeight: 700, color: "#4B2E1F", }}>
                          Concepto
                        </TableCell>
                        <TableCell sx={{ fontWeight: 700, color: "#4B2E1F", }}>
                          Último descuento
                        </TableCell>
                        <TableCell align="right" sx={{ fontWeight: 700, color: "#4B2E1F", borderRight: "2px solid #E0CDBB", }}>
                          Cuota
                        </TableCell>
                        <TableCell sx={{ fontWeight: 700, color: "#4B2E1F", }}>
                          Estado
                        </TableCell>
                        <TableCell align="right" sx={{ fontWeight: 700, color: "#4B2E1F", }}>
                          Diferencia
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {group.items.map(
                        (item, index) => (
                          <TableRow key={ `${group.conceptName}-${item.IdLoan ?? "file"}-${index}` } hover>
                            <TableCell>
                              { item.fileDocumentNumber ?? "" }
                            </TableCell>
                            <TableCell>
                              { item.fileFullName ?? "" }
                            </TableCell>
                            <TableCell align="right" sx={{ borderRight: "2px solid #E0CDBB", }}>
                              { formatMoney(item.fileAmount) }
                            </TableCell>
                            <TableCell>
                              { item.sighaDocumentNumber ?? "" }
                            </TableCell>
                            <TableCell>
                              { item.sighaFullName ?? "" }
                            </TableCell>
                            <TableCell>
                              {
                                item.isLoan ===
                                null
                                  ? ""
                                  : (
                                    <Chip
                                      size="small"
                                      label={
                                        item.isLoan
                                          ? "Préstamo"
                                          : "Emolumento"
                                      }
                                      sx={{
                                        bgcolor:
                                          item.isLoan
                                            ? "#E3F2FD"
                                            : "#F3E5F5",
                                        color:
                                          item.isLoan
                                            ? "#1565C0"
                                            : "#7B1FA2",
                                        fontWeight:
                                          600,
                                      }}
                                    />
                                  )
                              }
                            </TableCell>
                            <TableCell>
                              { item.conceptName ?? "" }
                            </TableCell>
                            <TableCell>
                              { formatDate(item.lastDiscountDate) }
                            </TableCell>
                            <TableCell align="right" sx={{ borderRight: "2px solid #E0CDBB", }}>
                              { formatMoney(item.sighaAmount) }
                            </TableCell>
                            <TableCell>
                              { getStatusChip(item.status) }
                            </TableCell>
                            <TableCell
                              align="right"
                              sx={{
                                color:
                                  item.difference ===
                                  0
                                    ? "#2E7D32"
                                    : item.difference !==
                                        null
                                      ? "#C62828"
                                      : "#4B2E1F",
                                fontWeight:
                                  item.difference !==
                                  null
                                    ? 600
                                    : 400,
                              }}
                            >
                              { item.difference === null ? "" : formatMoney(item.difference) }
                            </TableCell>
                          </TableRow>
                        )
                      )}
                    </TableBody>
                  </Table>
                </Box>
              </Paper>
            )
          )}
          {result.total === 0 && (
            <Paper elevation={0} sx={{ p: 4, border: "1px solid #E0CDBB", borderRadius: 2, textAlign: "center", }}>
              <Typography sx={{ color: "#6D4C41", }}>
                No se encontraron registros para conciliar.
              </Typography>
            </Paper>
          )}
        </>
      )}

      <ResponseModal open={ responseModal.open } severity={ responseModal.severity } title={ responseModal.title } message={ responseModal.message } onClose={ closeResponseModal } />
    </Box>
  );
}