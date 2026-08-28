import { Box, Button, Chip, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, InputAdornment, MenuItem, Paper, Stack, Table, TableBody, TableCell, TableHead, TablePagination, TableRow, TextField, Tooltip, Typography, } from "@mui/material";
import type { ResponseModalSeverity, ResponseModalState, } from "../components/common/ModalType";
import { serviceDiscountHistoryService } from "../services/serviceDiscountHistoryService";
import PlayCircleOutlineOutlinedIcon from "@mui/icons-material/PlayCircleOutlineOutlined";
import CleaningServicesOutlinedIcon from "@mui/icons-material/CleaningServicesOutlined";
import PersonSearchOutlinedIcon from "@mui/icons-material/PersonSearchOutlined";
import ChangeCircleOutlinedIcon from "@mui/icons-material/ChangeCircleOutlined";
import { loanStatusHistoryService } from "../services/loanStatusHistoryService";
import type { ServiceDiscountHistory } from "../models/ServiceDiscountHistory";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import PriceCheckOutlinedIcon from "@mui/icons-material/PriceCheckOutlined";
import HistoryOutlinedIcon from "@mui/icons-material/HistoryOutlined";
import type { LoanStatusHistory } from "../models/LoanStatusHistory";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import { loanStatusService } from "../services/loanStatusService";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import SaveOutlinedIcon from "@mui/icons-material/SaveOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import { ResponseModal } from "../components/ResponseModal";
import { getErrorMessage } from "../services/errorService";
import type { LoanStatus } from "../models/LoanStatus";
import { loanService } from "../services/loanService";
import { NumericFormat } from "react-number-format";
import { useAuth } from "../context/AuthContext";
import { useEffect, useState } from "react";
import type { Loan } from "../models/Loan";

interface LoanFilters {
  employeeDocumentNumber: string;
  IdLoanStatus: number;
  requestDateFrom: string;
  requestDateTo: string;
}

const emptyFilters: LoanFilters = {
  employeeDocumentNumber: "",
  IdLoanStatus: 0,
  requestDateFrom: "",
  requestDateTo: "",
};

const emptyResponseModal: ResponseModalState = {
  open: false,
  severity: "info",
  title: "",
  message: "",
};

const formatMoney = (value: number | null | undefined) => {
  if (value === null || value === undefined) {
    return "";
  }

  return Number(value).toLocaleString("es-CO",
    {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }
  );
};

export function LoanPage() {
  const [serviceDiscountHistories, setServiceDiscountHistories] = useState<ServiceDiscountHistory[]>([]);
  const [responseModal, setResponseModal] = useState<ResponseModalState>(emptyResponseModal);
  const [loanStatusHistories, setLoanStatusHistories] = useState<LoanStatusHistory[]>([]);
  const [loadingServiceDiscounts, setLoadingServiceDiscounts] = useState(false);
  const [serviceDiscountPageSize, setServiceDiscountPageSize] = useState(10);
  const [serviceValueModalOpen, setServiceValueModalOpen] = useState(false);
  const [serviceToUpdate, setServiceToUpdate] = useState<Loan | null>(null);
  const [updatingServiceValue, setUpdatingServiceValue] = useState(false);
  const [processingScheduled, setProcessingScheduled] = useState(false);
  const [allLoanStatus, setAllLoanStatus] = useState<LoanStatus[]>([]);
  const [selectedLoan, setSelectedLoan] = useState<Loan | null>(null);
  const [loanToUpdate, setLoanToUpdate] = useState<Loan | null>(null);
  const [serviceDiscountTotal, setServiceDiscountTotal] = useState(0);
  const [filters, setFilters] = useState<LoanFilters>(emptyFilters);
  const [serviceDiscountPage, setServiceDiscountPage] = useState(0);
  const [loadingHistories, setLoadingHistories] = useState(false);
  const [statusObservation, setStatusObservation] = useState("");
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [statusModalOpen, setStatusModalOpen] = useState(false);
  const [selectedStatusId, setSelectedStatusId] = useState(0);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [loadingStatus, setLoadingStatus] = useState(false);
  const [serviceValue, setServiceValue] = useState("");
  const [loans, setLoans] = useState<Loan[]>([]);
  const [loading, setLoading] = useState(false);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const { user } = useAuth();
  
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

  const loadAllLoanStatus = async () => {
    try {
      setLoadingStatus(true);
      const response = await loanStatusService.getAll();
      setAllLoanStatus(response.result ?? []);
    } catch (err) {
      setAllLoanStatus([]);
      showResponseModal("error", "Error al cargar estados", getErrorMessage(err));
    } finally {
      setLoadingStatus(false);
    }
  };

  const openDetailModal = (loan: Loan) => {
    setSelectedLoan(loan);
    setDetailModalOpen(true);
    setLoanStatusHistories([]);
    setServiceDiscountHistories([]);
    setServiceDiscountTotal(0);
    setServiceDiscountPage(0);

    void loadLoanStatusHistories(loan.IdLoan);

    if (!loan.isLoan) {
      void loadServiceDiscountHistories(loan.IdLoan, 0, serviceDiscountPageSize);
    }
  };

  const closeDetailModal = () => {
    setDetailModalOpen(false);
    setSelectedLoan(null);
    setLoanStatusHistories([]);
    setServiceDiscountHistories([]);
    setServiceDiscountTotal(0);
    setServiceDiscountPage(0);
  };

  const openStatusModal = (loan: Loan) => {
    setLoanToUpdate(loan);
    setSelectedStatusId(0);
    setStatusObservation("");
    setStatusModalOpen(true);
  };

  const closeStatusModal = () => {
    if (updatingStatus) {
      return;
    }

    setStatusModalOpen(false);
    setLoanToUpdate(null);
    setSelectedStatusId(0);
    setStatusObservation("");
  };

  const openServiceValueModal = (loan: Loan) => {
    setServiceToUpdate(loan);
    setServiceValue(loan.serviceValue !== null ? String(loan.serviceValue) : "");
    setServiceValueModalOpen(true);
  };

  const closeServiceValueModal = () => {
    if (updatingServiceValue) {
      return;
    }

    setServiceValueModalOpen(false);
    setServiceToUpdate(null);
    setServiceValue("");
  };

  const loadLoans = async (currentPage = page, currentPageSize = pageSize, currentFilters = filters) => {
    try {
      setLoading(true);

      const response = await loanService.getAll({
        page: currentPage,
        pageSize: currentPageSize,
        employeeDocumentNumber: currentFilters.employeeDocumentNumber.trim(),
        IdLoanStatus: currentFilters.IdLoanStatus,
        requestDateFrom: currentFilters.requestDateFrom,
        requestDateTo: currentFilters.requestDateTo,
      });

      setLoans(response.result?.items ?? []);
      setTotal(response.result?.total ?? 0);
    } catch (err) {
      setLoans([]);
      setTotal(0);
      showResponseModal("error", "Error al cargar préstamos", getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    setPage(1);
    loadLoans(1, pageSize, filters);
  };

  const handleClean = () => {
    setFilters(emptyFilters);
    setPage(1);
    loadLoans(1, pageSize, emptyFilters);
  };

  const loadLoanStatusHistories = async (IdLoan: number) => {
    try {
      setLoadingHistories(true);
      const response = await loanStatusHistoryService.getByLoanId(IdLoan);
      setLoanStatusHistories(response.result ?? []);
    } catch (err) {
      setLoanStatusHistories([]);
      showResponseModal("error", "Error al cargar históricos", getErrorMessage(err));
    } finally {
      setLoadingHistories(false);
    }
  };

  const loadServiceDiscountHistories = async (IdLoan: number, currentPage = 0, currentPageSize = serviceDiscountPageSize) => {
    try {
      setLoadingServiceDiscounts(true);
      const response = await serviceDiscountHistoryService.getByLoanId(IdLoan, currentPage + 1, currentPageSize);
      setServiceDiscountHistories(response.result?.items ?? []);
      setServiceDiscountTotal(response.result?.total ?? 0);
    } catch (err) {
      setServiceDiscountHistories([]);
      setServiceDiscountTotal(0);
      showResponseModal("error", "Error al cargar descuentos", getErrorMessage(err));
    } finally {
      setLoadingServiceDiscounts(false);
    }
  };

  const handleUpdateServiceValue = async () => {
    if (!serviceToUpdate) {
      return;
    }

    const value = Number(serviceValue);

    if (!value || value <= 0) {
      showResponseModal("warning", "Valor requerido", "Debe ingresar un valor válido para el servicio.");
      return;
    }

    try {
      setUpdatingServiceValue(true);

      const response = await loanService.updateServiceValue(
        serviceToUpdate.IdLoan,
        {
          serviceValue: value,
          updatedByUserName: user?.userLogin ?? "",
        }
      );

      if (!response.isSuccess || !response.result) {
        throw new Error(response.Message || "No fue posible actualizar el valor.");
      }

      setServiceValueModalOpen(false);
      setServiceToUpdate(null);
      setServiceValue("");
      showResponseModal("success", "Valor actualizado", response.Message || "Valor del servicio actualizado correctamente.");

      await loadLoans(page, pageSize, filters);
    } catch (err) {
      showResponseModal("error", "Error al actualizar valor", getErrorMessage(err));
    } finally {
      setUpdatingServiceValue(false);
    }
  };

  const handleUpdateLoanStatus = async () => {
    if (!loanToUpdate) {
      return;
    }

    if (selectedStatusId <= 0) {
      showResponseModal("warning", "Estado requerido", "Debe seleccionar el nuevo estado del préstamo.");
      return;
    }

    const observation = statusObservation.trim();

    if (!observation) {
      showResponseModal("warning", "Observación requerida", "Debe ingresar una observación para actualizar el estado.");
      return;
    }

    try {
      setUpdatingStatus(true);

      const response = await loanService.updateStatus(
        loanToUpdate.IdLoan,
        {
          IdLoanStatus: selectedStatusId,
          observation,
          updatedByUserName: user?.userLogin ?? "",
        }
      );

      if (!response.isSuccess || !response.result) {
        throw new Error(response.Message || "No fue posible actualizar el estado.");
      }

      setStatusModalOpen(false);
      setLoanToUpdate(null);
      setSelectedStatusId(0);
      setStatusObservation("");
      showResponseModal("success", "Estado actualizado", response.Message || "Estado del préstamo actualizado correctamente.");

      await loadLoans(page, pageSize, filters);
    } catch (err) {
      showResponseModal("error", "Error al actualizar estado", getErrorMessage(err));
    } finally {
      setUpdatingStatus(false);
    }
  };

  const handleProcessScheduled = async () => {
    try {
      setProcessingScheduled(true);

      const response = await loanService.processScheduled();
      const result = response.result;

      if (!result) {
        showResponseModal("warning", "Proceso finalizado", response.Message || "El proceso terminó sin información de resultado.");
        return;
      }

      const message = [
        `Quincena identificada: ${result.cycleName}.`,
        `Fecha de descuento: ${result.targetInstallmentDate}.`,
        `Préstamos revisados: ${result.reviewedLoans}.`,
        `Servicios revisados: ${result.reviewedServices}.`,
        `Préstamos activados: ${result.activatedLoans}.`,
        `Servicios activados: ${result.activatedServices}.`,
        `Cuotas pagadas: ${result.paidInstallments}.`,
        `Descuentos de servicios: ${result.serviceDiscounts}.`,
        `Préstamos terminados: ${result.finishedLoans}.`,
        `Préstamos omitidos: ${result.skippedLoans}.`,
        `Servicios omitidos: ${result.skippedServices}.`,
        `Errores en préstamos: ${result.failedLoans}.`,
        `Errores en servicios: ${result.failedServices}.`,
      ].join("\n");

      const hasErrors = result.failedLoans > 0 || result.failedServices > 0;
      showResponseModal(hasErrors ? "warning" : "success", "Proceso de descuentos ejecutado", message);
      await loadLoans(page, pageSize, filters);
    } catch (err) {
      showResponseModal("error", "Error al ejecutar descuentos", getErrorMessage(err));
    } finally {
      setProcessingScheduled(false);
    }
  };

  useEffect(() => {
    loadAllLoanStatus();
    loadLoans(1, pageSize, emptyFilters);
  }, []);

  return (
    <Stack spacing={3}>
      <Stack sx={{ display: "flex", flexDirection: "row", gap: 1.5, alignItems: "center", justifyContent: "space-between", }}>
        <Stack sx={{ display: "flex", flexDirection: "row", gap: 1.5, alignItems: "center", }}>
          <PriceCheckOutlinedIcon sx={{ color: "#4B2E1F", fontSize: 30, }} />
          <Typography sx={{ color: "#4B2E1F", fontSize: 26, fontWeight: 700, }}>
            Préstamos
          </Typography>
        </Stack>
        <Button
          variant="outlined"
          startIcon={
            processingScheduled ? (
              <CircularProgress size={16} />
            ) : (
              <PlayCircleOutlineOutlinedIcon />
            )
          }
          onClick={handleProcessScheduled}
          disabled={processingScheduled || loading}
          sx={{
            height: 40,
            borderColor: "#8B6A55",
            color: "#4B2E1F",
            textTransform: "none",
            fontWeight: 600,
            "&:hover": {
              borderColor: "#4B2E1F",
              bgcolor: "rgba(75, 46, 31, 0.05)",
            },
          }}
        >
          { processingScheduled ? "Ejecutando..." : "Ejecutar descuentos" }
        </Button>
      </Stack>
      <Paper elevation={0} sx={{ border: "1px solid #E0CDBB", borderRadius: 2, p: 3, }}>
        <Stack spacing={2.5}>
          <Typography sx={{ color: "#4B2E1F", fontSize: 18, fontWeight: 700, }}>
            Filtros de búsqueda
          </Typography>
          <Stack sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "repeat(2, minmax(0, 1fr))", md: "repeat(4, minmax(0, 1fr))", }, gap: 1.5, alignItems: "center", }}>
            <TextField
              label="Documento colaborador"
              value={filters.employeeDocumentNumber}
              fullWidth
              size="small"
              disabled={loading}
              onChange={(event) =>
                setFilters((prev) => ({
                  ...prev,
                  employeeDocumentNumber: event.target.value,
                }))
              }
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <PersonSearchOutlinedIcon sx={{ color: "#8B6A55" }} />
                    </InputAdornment>
                  ),
                },
              }}
            />
            <TextField
              select
              label="Estado"
              value={filters.IdLoanStatus}
              fullWidth
              size="small"
              disabled={loading || loadingStatus}
              onChange={(event) =>
                setFilters((prev) => ({
                  ...prev,
                  IdLoanStatus: Number(event.target.value),
                }))
              }
            >
              <MenuItem value={0}>Todos</MenuItem>

              {allLoanStatus.map((item) => (
                <MenuItem key={item.IdLoanStatus} value={item.IdLoanStatus}>
                  {item.nameLoanStatus}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              label="Fecha solicitud desde"
              type="date"
              value={filters.requestDateFrom}
              fullWidth
              size="small"
              disabled={loading}
              slotProps={{
                inputLabel: {
                  shrink: true,
                },
              }}
              onChange={(event) =>
                setFilters((prev) => ({
                  ...prev,
                  requestDateFrom: event.target.value,
                }))
              }
            />
            <TextField
              label="Fecha solicitud hasta"
              type="date"
              value={filters.requestDateTo}
              fullWidth
              size="small"
              disabled={loading}
              slotProps={{
                inputLabel: {
                  shrink: true,
                },
              }}
              onChange={(event) =>
                setFilters((prev) => ({
                  ...prev,
                  requestDateTo: event.target.value,
                }))
              }
            />
            <Stack sx={{ display: "flex", flexDirection: "row", gap: 1, justifyContent: "flex-end", gridColumn: { xs: "1 / -1", sm: "1 / -1", md: "1 / -1", },}}>
              <Button
                variant="outlined"
                startIcon={
                  loading ? <CircularProgress size={16} /> : <SearchOutlinedIcon />
                }
                onClick={handleSearch}
                disabled={loading}
                sx={{
                  height: 40,
                  borderColor: "#8B6A55",
                  color: "#4B2E1F",
                  textTransform: "none",
                  fontWeight: 600,
                  "&:hover": {
                    borderColor: "#4B2E1F",
                    bgcolor: "rgba(75, 46, 31, 0.05)",
                  },
                }}
              >
                Buscar
              </Button>
              <Button
                variant="outlined"
                startIcon={<CleaningServicesOutlinedIcon />}
                onClick={handleClean}
                disabled={loading}
                sx={{
                  height: 40,
                  borderColor: "#8B6A55",
                  color: "#4B2E1F",
                  textTransform: "none",
                  fontWeight: 600,
                  "&:hover": {
                    borderColor: "#4B2E1F",
                    bgcolor: "rgba(75, 46, 31, 0.05)",
                  },
                }}
              >
                Limpiar
              </Button>
            </Stack>
          </Stack>
        </Stack>
      </Paper>
      <Paper elevation={0} sx={{ border: "1px solid #E0CDBB", borderRadius: 2, overflow: "hidden", }}>
        {loading ? (
          <Box sx={{ py: 6, display: "flex", justifyContent: "center", }}>
            <CircularProgress sx={{ color: "#4B2E1F" }} />
          </Box>
        ) : (
          <>
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: "#F7E8D8" }}>
                  <TableCell sx={{ fontWeight: 700, color: "#4B2E1F" }}>
                    Documento
                  </TableCell>
                  <TableCell sx={{ fontWeight: 700, color: "#4B2E1F" }}>
                    Colaborador
                  </TableCell>
                  <TableCell sx={{ fontWeight: 700, color: "#4B2E1F" }}>
                    Concepto
                  </TableCell>
                  <TableCell sx={{ fontWeight: 700, color: "#4B2E1F" }}>
                    Plan de descuento
                  </TableCell>
                  <TableCell sx={{ fontWeight: 700, color: "#4B2E1F" }}>
                    Estado
                  </TableCell>
                  <TableCell sx={{ fontWeight: 700, color: "#4B2E1F" }}>
                    Fecha solicitud
                  </TableCell>
                  <TableCell align="right" sx={{ fontWeight: 700, color: "#4B2E1F" }}>
                    Valor
                  </TableCell>
                  <TableCell align="right" sx={{ fontWeight: 700, color: "#4B2E1F" }}>
                    Cuotas
                  </TableCell>
                  <TableCell></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loans.map((item) => (
                  <TableRow key={item.IdLoan} hover>
                    <TableCell>{item.employeeDocumentNumber}</TableCell>
                    <TableCell>{item.employeeFullName}</TableCell>
                    <TableCell>{item.conceptName}</TableCell>
                    <TableCell>{item.deductionPlanName}</TableCell>
                    <TableCell>
                      <Chip
                        label={item.loanStatusName}
                        size="small"
                        sx={{
                          bgcolor:
                            item.loanStatusName === "Activo"
                              ? "#E8F5E9"
                              : item.loanStatusName === "Inactivo"
                              ? "#FFEBEE"
                              : item.loanStatusName === "Suspendido"
                              ? "#FFF4E5"
                              : item.loanStatusName === "Terminado"
                              ? "#E3F2FD"
                              : item.loanStatusName === "Cancelado"
                              ? "#FCE4EC"
                              : "#F5F5F5",

                          color:
                            item.loanStatusName === "Activo"
                              ? "#2E7D32"
                              : item.loanStatusName === "Inactivo"
                              ? "#C62828"
                              : item.loanStatusName === "Suspendido"
                              ? "#ED6C02"
                              : item.loanStatusName === "Terminado"
                              ? "#1565C0"
                              : item.loanStatusName === "Cancelado"
                              ? "#AD1457"
                              : "#616161",

                          fontWeight: 600,
                        }}
                      />
                    </TableCell>
                    <TableCell>{item.requestDate}</TableCell>
                    <TableCell align="right">
                      {formatMoney(item.isLoan ? item.loanAmount : item.serviceValue)}
                    </TableCell>
                    <TableCell align="right">
                      {item.isLoan ? `${item.paidInstallments ?? 0}/${item.numberInstallments ?? 0}` : ""}
                    </TableCell>
                    <TableCell align="center">
                      <Stack direction="row" spacing={1} sx={{ justifyContent: "center", alignItems: "center", }}>
                        <Tooltip title={ item.isLoan ? "Detalles préstamo" : "Detalles servicio" } arrow>
                          <IconButton size="small" onClick={() => openDetailModal(item)} sx={{ border: "1px solid #8B6A55", color: "#4B2E1F", borderRadius: 2, "&:hover": { borderColor: "#4B2E1F", bgcolor: "rgba(75, 46, 31, 0.05)", },}}>
                            <VisibilityOutlinedIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        {!item.isLoan && (
                          <Tooltip title="Actualizar valor del servicio" arrow>
                            <IconButton size="small" onClick={() => openServiceValueModal(item) } sx={{ border:"1px solid #8B6A55", color: "#4B2E1F", borderRadius: 2, "&:hover": { borderColor: "#4B2E1F", bgcolor:"rgba(75, 46, 31, 0.05)", },}}>
                              <EditOutlinedIcon fontSize="small"/>
                            </IconButton>
                          </Tooltip>
                        )}
                        <Tooltip title="Actualizar estado" arrow>
                          <IconButton size="small" onClick={() => openStatusModal(item)} sx={{ border: "1px solid #8B6A55", color: "#4B2E1F", borderRadius: 2, "&:hover": { borderColor: "#4B2E1F", bgcolor: "rgba(75, 46, 31, 0.05)", },}}>
                            <ChangeCircleOutlinedIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))}
                {loans.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={9} align="center" sx={{ py: 4 }}>
                      No hay préstamos para mostrar.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
            <TablePagination
              component="div"
              count={total}
              page={page - 1}
              rowsPerPage={pageSize}
              rowsPerPageOptions={[5, 10, 25, 50]}
              labelRowsPerPage="Filas por página"
              onPageChange={(_, newPage) => {
                const nextPage = newPage + 1;
                setPage(nextPage);
                loadLoans(nextPage, pageSize, filters);
              }}
              onRowsPerPageChange={(event) => {
                const nextPageSize = Number(event.target.value);
                setPageSize(nextPageSize);
                setPage(1);
                loadLoans(1, nextPageSize, filters);
              }}
            />
          </>
        )}
      </Paper>

      <Dialog open={detailModalOpen} onClose={closeDetailModal} fullWidth maxWidth="md">
        <DialogTitle sx={{ display: "flex", alignItems: "center", gap: 1, color: "#4B2E1F", fontWeight: 700, }}>
          <VisibilityOutlinedIcon />
          {selectedLoan?.isLoan ? "Detalles préstamo" : "Detalles servicio"}
        </DialogTitle>
        <DialogContent>
          {selectedLoan && (
            <Stack spacing={3} sx={{ mt: 1 }}>
              <Paper elevation={0} sx={{ border: "1px solid #E0CDBB", borderRadius: 2, p: 2, }}>
                <Typography sx={{ color: "#4B2E1F", fontSize: 16, fontWeight: 700, mb: 2, }}>
                  Datos del colaborador
                </Typography>
                <Stack sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "repeat(2, minmax(0, 1fr))", }, gap: 1.5, }}>
                  <TextField label="Documento" value={selectedLoan.employeeDocumentNumber} size="small" fullWidth disabled />
                  <TextField label="Nombre" value={selectedLoan.employeeFullName} size="small" fullWidth disabled />
                  <TextField label="Cargo" value={selectedLoan.employeeRoleName ?? ""} size="small" fullWidth disabled />
                  <TextField label="Centro de costo" value={selectedLoan.employeeCostCenterName ?? ""} size="small" fullWidth disabled />
                </Stack>
              </Paper>
              <Paper elevation={0} sx={{ border: "1px solid #E0CDBB", borderRadius: 2, p: 2, }}>
                <Typography sx={{ color: "#4B2E1F", fontSize: 16, fontWeight: 700, mb: 2, }}>
                  {selectedLoan.isLoan ? "Datos del préstamo" : "Datos del servicio"}
                </Typography>
                <Stack sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "repeat(2, minmax(0, 1fr))", md: "repeat(3, minmax(0, 1fr))", }, gap: 1.5, }}>
                  <TextField label="Concepto" value={selectedLoan.conceptName} size="small" fullWidth disabled />
                  <TextField label="Plan de descuento" value={selectedLoan.deductionPlanName} size="small" fullWidth disabled />
                  <TextField label="Estado" value={selectedLoan.loanStatusName} size="small" fullWidth disabled />
                  <TextField label="Documento de cruce" value={selectedLoan.crossDocument ?? ""} size="small" fullWidth disabled />
                  {selectedLoan.isLoan && (
                    <>
                      <TextField
                        label="Valor préstamo"
                        value={
                          formatMoney(
                            selectedLoan.loanAmount
                          )
                        }
                        size="small"
                        fullWidth
                        disabled
                      />

                      <TextField
                        label="Número de cuotas"
                        value={
                          selectedLoan
                            .numberInstallments ?? ""
                        }
                        size="small"
                        fullWidth
                        disabled
                      />

                      <TextField
                        label="Cuotas pagadas"
                        value={
                          selectedLoan
                            .paidInstallments ?? ""
                        }
                        size="small"
                        fullWidth
                        disabled
                      />

                      <TextField
                        label="Saldo restante"
                        value={
                          formatMoney(
                            selectedLoan
                              .remainingAmount
                          )
                        }
                        size="small"
                        fullWidth
                        disabled
                      />
                    </>
                  )}
                  {!selectedLoan.isLoan && (
                    <TextField
                      label="Valor actual del servicio"
                      value={
                        formatMoney(
                          selectedLoan.serviceValue
                        )
                      }
                      size="small"
                      fullWidth
                      disabled
                    />
                  )}
                  <TextField label="Fecha solicitud" value={selectedLoan.requestDate} size="small" fullWidth disabled />
                  <TextField label="Inicio descuento" value={selectedLoan.startDiscountDate} size="small" fullWidth disabled />
                  {selectedLoan.isLoan && (
                    <TextField
                      label="Fin descuento"
                      value={
                        selectedLoan.endDiscountDate
                        ?? ""
                      }
                      size="small"
                      fullWidth
                      disabled
                    />
                  )}
                  <TextField label="Creado por" value={selectedLoan.createdByUserName} size="small" fullWidth disabled />
                  <TextField label="Modificado por" value={selectedLoan.updatedByUserName ?? ""} size="small" fullWidth disabled />
                  <TextField label="Fecha creación" value={selectedLoan.createdAt} size="small" fullWidth disabled />
                  <TextField label="Fecha modificación" value={selectedLoan.updatedAt ?? ""} size="small" fullWidth disabled />
                </Stack>
                <TextField label="Observación" value={selectedLoan.observation ?? ""} size="small" fullWidth multiline minRows={2} disabled sx={{ mt: 1.5 }} />
              </Paper>
              <Paper elevation={0} sx={{ border: "1px solid #E0CDBB", borderRadius: 2, p: 2, }}>
                <Stack direction="row" spacing={1} sx={{ alignItems: "center", mb: 2, }}>
                  <HistoryOutlinedIcon sx={{ color: "#4B2E1F" }} />
                  <Typography sx={{ color: "#4B2E1F", fontSize: 16, fontWeight: 700, }}>
                    Histórico
                  </Typography>
                </Stack>
                {loadingHistories ? (
                  <Box sx={{ py: 4, display: "flex", justifyContent: "center", }}>
                    <CircularProgress size={28} sx={{ color: "#4B2E1F" }} />
                  </Box>
                ) : (
                  <Table size="small">
                    <TableHead>
                      <TableRow sx={{ bgcolor: "#F7E8D8" }}>
                        <TableCell align="center" sx={{ fontWeight: 700, color: "#4B2E1F", }}>
                          Estado
                        </TableCell>
                        <TableCell sx={{ fontWeight: 700, color: "#4B2E1F", }}>
                          Observación
                        </TableCell>
                        <TableCell align="center" sx={{ fontWeight: 700, color: "#4B2E1F", }}>
                          Fecha
                        </TableCell>
                        <TableCell align="center" sx={{ fontWeight: 700, color: "#4B2E1F", }}>
                          Usuario
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {loanStatusHistories.map(
                        (history) => (
                          <TableRow key={ history.IdLoanStatusHistory }>
                            <TableCell align="center">
                              <Chip
                                label={history.loanStatus.nameLoanStatus}
                                size="small"
                                sx={{
                                  bgcolor:
                                    history.loanStatus.nameLoanStatus === "Activo"
                                      ? "#E8F5E9"
                                      : history.loanStatus.nameLoanStatus === "Inactivo"
                                      ? "#FFEBEE"
                                      : history.loanStatus.nameLoanStatus === "Suspendido"
                                      ? "#FFF4E5"
                                      : history.loanStatus.nameLoanStatus === "Terminado"
                                      ? "#E3F2FD"
                                      : history.loanStatus.nameLoanStatus === "Cancelado"
                                      ? "#FCE4EC"
                                      : "#F5F5F5",

                                  color:
                                    history.loanStatus.nameLoanStatus === "Activo"
                                      ? "#2E7D32"
                                      : history.loanStatus.nameLoanStatus === "Inactivo"
                                      ? "#C62828"
                                      : history.loanStatus.nameLoanStatus === "Suspendido"
                                      ? "#ED6C02"
                                      : history.loanStatus.nameLoanStatus === "Terminado"
                                      ? "#1565C0"
                                      : history.loanStatus.nameLoanStatus === "Cancelado"
                                      ? "#AD1457"
                                      : "#616161",

                                  fontWeight: 600,
                                }}
                              />
                            </TableCell>
                            <TableCell>{history.observation}</TableCell>
                            <TableCell align="center">{history.createdAt}</TableCell>
                            <TableCell align="center">{ history.createdByUserName }</TableCell>
                          </TableRow>
                        )
                      )}

                      {loanStatusHistories.length === 0 && (
                        <TableRow>
                          <TableCell colSpan={4} align="center" sx={{ py: 3 }}>
                            No existen históricos para este préstamo.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                )}
              </Paper>
              {selectedLoan.isLoan ? (
                <Paper elevation={0} sx={{ border: "1px solid #E0CDBB", borderRadius: 2, p: 2 }}>
                  <Typography sx={{ color: "#4B2E1F", fontSize: 16, fontWeight: 700, mb: 2, }}>
                    Cuotas
                  </Typography>
                  <Table size="small">
                    <TableHead>
                      <TableRow sx={{ bgcolor: "#F7E8D8" }}>
                        <TableCell align="center" sx={{ fontWeight: 700, color: "#4B2E1F" }}>
                          Nro. cuota
                        </TableCell>
                        <TableCell align="center" sx={{ fontWeight: 700, color: "#4B2E1F" }}>
                          Valor cuota
                        </TableCell>
                        <TableCell align="center" sx={{ fontWeight: 700, color: "#4B2E1F" }}>
                          Fecha compromiso
                        </TableCell>
                        <TableCell align="center" sx={{ fontWeight: 700, color: "#4B2E1F" }}>
                          Estado
                        </TableCell>
                        <TableCell align="center" sx={{ fontWeight: 700, color: "#4B2E1F" }}>
                          Fecha pago
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {selectedLoan.loanInstallments?.map((item) => (
                        <TableRow key={item.IdLoanInstallment}>
                          <TableCell>{item.installmentNumber}</TableCell>
                          <TableCell align="center">
                            {formatMoney(item.installmentValue)}
                          </TableCell>
                          <TableCell align="center">{item.commitmentDate ?? ""}</TableCell>
                          <TableCell align="center">
                            <Chip
                              label={Boolean(item.isPaid) ? "Pagada" : "Pendiente"}
                              size="small"
                              sx={{
                                bgcolor: Boolean(item.isPaid) ? "#E8F5E9" : "#FFF4E5",
                                color: Boolean(item.isPaid) ? "#2E7D32" : "#ED6C02",
                                fontWeight: 600,
                              }}
                            />
                          </TableCell>
                          <TableCell align="center">
                            {item.paymentDate ?? ""}
                          </TableCell>
                        </TableRow>
                      ))}
                      {(!selectedLoan.loanInstallments || selectedLoan.loanInstallments.length === 0) && (
                        <TableRow>
                          <TableCell colSpan={5} align="center" sx={{ py: 3 }}>
                            No hay cuotas registradas para este préstamo.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </Paper>
              ) : (
                <Paper elevation={0} sx={{ border: "1px solid #E0CDBB", borderRadius: 2, overflow: "hidden", }}>
                  <Box sx={{ p: 2 }}>
                    <Typography sx={{ color: "#4B2E1F", fontSize: 16, fontWeight: 700, }}>
                      Histórico de descuentos
                    </Typography>
                  </Box>
                  {loadingServiceDiscounts ? (
                    <Box sx={{ py: 4, display: "flex", justifyContent: "center", }}>
                      <CircularProgress size={28} sx={{ color: "#4B2E1F", }} />
                    </Box>
                  ) : (
                    <>
                      <Table size="small">
                        <TableHead>
                          <TableRow sx={{ bgcolor: "#F7E8D8", }}>
                            <TableCell align="center" sx={{ fontWeight: 700, color: "#4B2E1F", }}>
                              Fecha descuento
                            </TableCell>
                            <TableCell align="right" sx={{ fontWeight: 700, color: "#4B2E1F", }}>
                              Valor
                            </TableCell>
                            <TableCell align="center" sx={{ fontWeight: 700, color: "#4B2E1F", }}>
                              Fecha registro
                            </TableCell>
                            <TableCell align="center" sx={{ fontWeight: 700, color: "#4B2E1F", }}>
                              Usuario
                            </TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {serviceDiscountHistories.map(
                            (item) => (
                              <TableRow key={ item.IdServiceDiscountHistory }>
                                <TableCell align="center">
                                  {item.discountDate}
                                </TableCell>
                                <TableCell align="right">
                                  {formatMoney(item.discountValue)}
                                </TableCell>
                                <TableCell align="center">
                                  {item.createdAt}
                                </TableCell>
                                <TableCell align="center">
                                  {item.createdByUserName}
                                </TableCell>
                              </TableRow>
                            )
                          )}
                          {serviceDiscountHistories.length
                            === 0 && (
                            <TableRow>
                              <TableCell colSpan={4} align="center" sx={{ py: 3 }}>
                                No existen descuentos registrados para este servicio.
                              </TableCell>
                            </TableRow>
                          )}
                        </TableBody>
                      </Table>
                      <TablePagination
                        component="div"
                        count={ serviceDiscountTotal }
                        page={ serviceDiscountPage }
                        rowsPerPage={ serviceDiscountPageSize }
                        rowsPerPageOptions={[ 5, 10, 25, 50, ]}
                        labelRowsPerPage={ "Filas por página" }

                        onPageChange={( _, newPage ) => {

                          if (!selectedLoan) {
                            return;
                          }

                          setServiceDiscountPage(newPage);
                          void loadServiceDiscountHistories(selectedLoan.IdLoan, newPage, serviceDiscountPageSize);
                        }}

                        onRowsPerPageChange={(event) => {

                          if (!selectedLoan) {
                            return;
                          }

                          const nextPageSize = Number(event.target.value);
                          setServiceDiscountPageSize(nextPageSize);
                          setServiceDiscountPage(0);
                          void loadServiceDiscountHistories(selectedLoan.IdLoan, 0, nextPageSize); }}
                      />
                    </>
                  )}
                </Paper>
              )}
            </Stack>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button variant="outlined" startIcon={<CloseOutlinedIcon />} onClick={closeDetailModal} sx={{ borderColor: "#8B6A55", color: "#4B2E1F", textTransform: "none", fontWeight: 600, "&:hover": { borderColor: "#4B2E1F", bgcolor: "rgba(75, 46, 31, 0.05)", },}}>
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={statusModalOpen} onClose={closeStatusModal} fullWidth maxWidth="sm">
        <DialogTitle sx={{ display: "flex", alignItems: "center", gap: 1, color: "#4B2E1F", fontWeight: 700, }}>
          <ChangeCircleOutlinedIcon />
          Actualizar estado
        </DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField
              select
              label="Nuevo estado"
              value={selectedStatusId}
              fullWidth
              size="small"
              disabled={ updatingStatus || loadingStatus }
              onChange={(event) =>
                setSelectedStatusId(
                  Number(event.target.value)
                )
              }
            >
              <MenuItem value={0} disabled>
                Seleccione un estado
              </MenuItem>
              {allLoanStatus.map((item) => (
                <MenuItem key={item.IdLoanStatus} value={item.IdLoanStatus}>
                  {item.nameLoanStatus}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              label="Observación"
              value={statusObservation}
              fullWidth
              multiline
              minRows={4}
              disabled={updatingStatus}
              slotProps={{
                htmlInput: {
                  maxLength: 2000,
                },
              }}
              onChange={(event) =>
                setStatusObservation(event.target.value)
              }
            />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2, }}>
          <Button
            variant="outlined"
            startIcon={
              <CloseOutlinedIcon />
            }
            onClick={closeStatusModal}
            disabled={updatingStatus}
            sx={{
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
            Cancelar
          </Button>
          <Button
            variant="outlined"
            startIcon={
              updatingStatus ? (
                <CircularProgress
                  size={16}
                />
              ) : (
                <SaveOutlinedIcon />
              )
            }
            onClick={
              handleUpdateLoanStatus
            }
            disabled={updatingStatus}
            sx={{
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
            {updatingStatus
              ? "Actualizando..."
              : "Actualizar estado"}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={serviceValueModalOpen} onClose={closeServiceValueModal} fullWidth maxWidth="xs">
        <DialogTitle sx={{ display: "flex", alignItems: "center", gap: 1, color: "#4B2E1F", fontWeight: 700, }}>
          <EditOutlinedIcon />
          Actualizar valor del servicio
        </DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField label="Concepto" value={ serviceToUpdate ?.conceptName ?? "" } disabled fullWidth size="small" />
            <NumericFormat
              customInput={TextField}
              label="Nuevo valor"
              value={serviceValue}
              required
              fullWidth
              size="small"
              disabled={
                updatingServiceValue
              }
              thousandSeparator="."
              decimalSeparator=","
              decimalScale={2}
              allowNegative={false}
              valueIsNumericString
              onValueChange={(values) => {
                setServiceValue(
                  values.value
                );
              }}
            />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2, }}>
          <Button
            variant="outlined"
            startIcon={
              <CloseOutlinedIcon />
            }
            onClick={
              closeServiceValueModal
            }
            disabled={
              updatingServiceValue
            }
            sx={{
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
            Cancelar
          </Button>
          <Button
            variant="outlined"
            startIcon={
              updatingServiceValue
                ? (
                  <CircularProgress
                    size={16}
                  />
                )
                : (
                  <SaveOutlinedIcon />
                )
            }
            onClick={
              handleUpdateServiceValue
            }
            disabled={
              updatingServiceValue
            }
            sx={{
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
            {updatingServiceValue
              ? "Actualizando..."
              : "Actualizar valor"}
          </Button>
        </DialogActions>
      </Dialog>

      <ResponseModal open={responseModal.open} severity={responseModal.severity} title={responseModal.title} message={responseModal.message} onClose={closeResponseModal} />
    </Stack>
  );
}