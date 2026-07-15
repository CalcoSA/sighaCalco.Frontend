import { Box, Button, CircularProgress, InputAdornment, Paper, Stack, Table, TableBody, TableCell, TableHead, TablePagination, TableRow, TextField, Typography, } from "@mui/material";
import type { ResponseModalSeverity, ResponseModalState, } from "../components/common/ModalType";
import CleaningServicesOutlinedIcon from "@mui/icons-material/CleaningServicesOutlined";
import PersonSearchOutlinedIcon from "@mui/icons-material/PersonSearchOutlined";
import ManageSearchOutlinedIcon from "@mui/icons-material/ManageSearchOutlined";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import { loanLogService } from "../services/loanLogService";
import { ResponseModal } from "../components/ResponseModal";
import { getErrorMessage } from "../services/errorService";
import type { LoanLog } from "../models/LoanLog";
import { useEffect, useState } from "react";

interface LoanLogFilters {
  employeeDocumentNumber: string;
  actionDateFrom: string;
  actionDateTo: string;
}

const emptyFilters: LoanLogFilters = {
  employeeDocumentNumber: "",
  actionDateFrom: "",
  actionDateTo: "",
};

const emptyResponseModal: ResponseModalState = {
  open: false,
  severity: "info",
  title: "",
  message: "",
};

export function LoanLogPage() {
  const [responseModal, setResponseModal] = useState<ResponseModalState>(emptyResponseModal);
  const [filters, setFilters] = useState<LoanLogFilters>(emptyFilters);
  const [logs, setLogs] = useState<LoanLog[]>([]);
  const [loading, setLoading] = useState(false);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  
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

  const loadLoanLogs = async (currentPage = page, currentPageSize = pageSize, currentFilters = filters) => {
    try {
      setLoading(true);

      const response = await loanLogService.getAll({
        page: currentPage,
        pageSize: currentPageSize,
        employeeDocumentNumber: currentFilters.employeeDocumentNumber.trim(),
        actionDateFrom: currentFilters.actionDateFrom,
        actionDateTo: currentFilters.actionDateTo,
      });

      setLogs(response.result?.items ?? []);
      setTotal(response.result?.total ?? 0);
    } catch (err) {
      setLogs([]);
      setTotal(0);
      showResponseModal("error", "Error al cargar logs", getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    setPage(1);
    loadLoanLogs(1, pageSize, filters);
  };

  const handleClean = () => {
    setFilters(emptyFilters);
    setPage(1);
    loadLoanLogs(1, pageSize, emptyFilters);
  };

  useEffect(() => {
    loadLoanLogs(1, pageSize, emptyFilters);
  }, []);

  return (
    <Stack spacing={3}>
      <Stack sx={{ display: "flex", flexDirection: "row", gap: 1.5, alignItems: "center", }}>
        <ManageSearchOutlinedIcon sx={{ color: "#4B2E1F", fontSize: 30 }} />
        <Typography sx={{ color: "#4B2E1F", fontSize: 26, fontWeight: 700, }}>
          Logs
        </Typography>
      </Stack>
      <Paper elevation={0} sx={{ border: "1px solid #E0CDBB", borderRadius: 2, p: 3, }}>
        <Stack spacing={2.5}>
          <Typography sx={{ color: "#4B2E1F", fontSize: 18, fontWeight: 700, }}>
            Filtros de búsqueda
          </Typography>
          <Stack sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "repeat(2, minmax(0, 1fr))", md: "1.2fr 1fr 1fr auto", }, gap: 1.5, alignItems: "center", }}>
            <TextField
              label="Documento colaborador"
              value={filters.employeeDocumentNumber}
              fullWidth
              size="small"
              disabled={loading}
              onChange={(event) =>
                setFilters((prev) => ({
                  ...prev,
                  employeeDocumentNumber: event.target.value.replace(/\D/g, ""),
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
              label="Fecha desde"
              type="date"
              value={filters.actionDateFrom}
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
                  actionDateFrom: event.target.value,
                }))
              }
            />
            <TextField
              label="Fecha hasta"
              type="date"
              value={filters.actionDateTo}
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
                  actionDateTo: event.target.value,
                }))
              }
            />
            <Stack sx={{ display: "flex", flexDirection: "row", gap: 1, justifyContent: { xs: "flex-end", sm: "flex-end", md: "flex-start", }, alignItems: "center", }}>
              <Button variant="outlined" startIcon={ loading ? <CircularProgress size={16} /> : <SearchOutlinedIcon /> } onClick={handleSearch} disabled={loading} sx={{ height: 40, borderColor: "#8B6A55", color: "#4B2E1F", textTransform: "none", fontWeight: 600, "&:hover": { borderColor: "#4B2E1F", bgcolor: "rgba(75, 46, 31, 0.05)", },}}>
                Buscar
              </Button>
              <Button variant="outlined" startIcon={<CleaningServicesOutlinedIcon />} onClick={handleClean} disabled={loading} sx={{ height: 40, borderColor: "#8B6A55", color: "#4B2E1F", textTransform: "none", fontWeight: 600, "&:hover": { borderColor: "#4B2E1F", bgcolor: "rgba(75, 46, 31, 0.05)", },}}>
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
                    Acción
                  </TableCell>
                  <TableCell sx={{ fontWeight: 700, color: "#4B2E1F" }}>
                    Id préstamo
                  </TableCell>
                  <TableCell sx={{ fontWeight: 700, color: "#4B2E1F" }}>
                    Documento
                  </TableCell>
                  <TableCell sx={{ fontWeight: 700, color: "#4B2E1F" }}>
                    Concepto
                  </TableCell>
                  <TableCell sx={{ fontWeight: 700, color: "#4B2E1F" }}>
                    Estado
                  </TableCell>
                  <TableCell sx={{ fontWeight: 700, color: "#4B2E1F" }}>
                    Cuota
                  </TableCell>
                  <TableCell sx={{ fontWeight: 700, color: "#4B2E1F" }}>
                    Estado cuota
                  </TableCell>
                  <TableCell sx={{ fontWeight: 700, color: "#4B2E1F" }}>
                    Observación
                  </TableCell>
                  <TableCell sx={{ fontWeight: 700, color: "#4B2E1F" }}>
                    Usuario
                  </TableCell>
                  <TableCell sx={{ fontWeight: 700, color: "#4B2E1F" }}>
                    Fecha acción
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {logs.map((item) => (
                  <TableRow key={item.IdLoanLog} hover>
                    <TableCell>{item.actionType}</TableCell>
                    <TableCell>{item.IdLoan}</TableCell>
                    <TableCell>{item.employeeDocumentNumber ?? ""}</TableCell>
                    <TableCell>{item.conceptName ?? ""}</TableCell>
                    <TableCell>{item.loanStatusName ?? ""}</TableCell>
                    <TableCell>{item.installmentNumber ?? ""}</TableCell>
                    <TableCell>{item.installmentStatusName ?? ""}</TableCell>
                    <TableCell>{item.observation ?? ""}</TableCell>
                    <TableCell>{item.actorUserName ?? ""}</TableCell>
                    <TableCell>{item.actionDate}</TableCell>
                  </TableRow>
                ))}
                {logs.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={10} align="center" sx={{ py: 4 }}>
                      No hay logs para mostrar.
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
                loadLoanLogs(nextPage, pageSize, filters);
              }}
              onRowsPerPageChange={(event) => {
                const nextPageSize = Number(event.target.value);
                setPageSize(nextPageSize);
                setPage(1);
                loadLoanLogs(1, nextPageSize, filters);
              }}
            />
          </>
        )}
      </Paper>

      <ResponseModal open={responseModal.open} severity={responseModal.severity} title={responseModal.title} message={responseModal.message} onClose={closeResponseModal}/>
    </Stack>
  );
}