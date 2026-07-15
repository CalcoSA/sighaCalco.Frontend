import { Box, Button, CircularProgress, IconButton, InputAdornment, Paper, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, TextField, Typography, } from "@mui/material";
import type { ResponseModalState, ResponseModalSeverity } from "../components/common/ModalType";
import CleaningServicesOutlinedIcon from "@mui/icons-material/CleaningServicesOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import ReceiptLongOutlinedIcon from "@mui/icons-material/ReceiptLongOutlined";
import { payrollSinergyService } from "../services/payrollSinergyService";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import type { PayrollSinergy } from "../models/PayrollSinergy";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import { getErrorMessage } from "../services/errorService";
import { ResponseModal } from "../components/ResponseModal";
import { useCallback, useEffect, useState } from "react";


interface PayrollSinergyForm {
  namePayrollSinergy: string;
  codePayrollSinergy: string;
}

const emptyForm: PayrollSinergyForm = {
  namePayrollSinergy: "",
  codePayrollSinergy: "",
};

const emptyResponseModal: ResponseModalState = {
  open: false,
  severity: "info",
  title: "",
  message: "",
};

export function PayrollSinergyPage() {
  const [responseModal, setResponseModal] = useState<ResponseModalState>(emptyResponseModal);
  const [selectedPayrollSinergy, setSelectedPayrollSinergy] = useState<PayrollSinergy | null>(null);
  const [PayrollSinergyToDelete, setPayrollSinergyToDelete] = useState<PayrollSinergy | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [form, setForm] = useState<PayrollSinergyForm>(emptyForm);
  const [items, setItems] = useState<PayrollSinergy[]>([]);
  const [searchInput, setSearchInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [pageSize, setPageSize] = useState(10);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState("");
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

  const loadPayrollSinergys = useCallback(async () => {
    try {
      setLoading(true);
      const response = await payrollSinergyService.getAll({ page, pageSize, search, });
      setItems(response.result.items ?? []);
      setTotal(response.result.total ?? 0);
    } catch (err) {
      setItems([]);
      setTotal(0);
      showResponseModal("error", "Error al cargar", getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [page, pageSize, search]);

  const handleSearch = () => {
    setPage(1);
    setSearch(searchInput.trim());
  };

  const handleClearSearch = () => {
    setSearchInput("");
    setSearch("");
    setPage(1);
  };

  const cleanForm = () => {
    setSelectedPayrollSinergy(null);
    setForm(emptyForm);
  };

  const buildPayload = () => ({
    namePayrollSinergy: form.namePayrollSinergy.trim() || null,
    codePayrollSinergy: form.codePayrollSinergy.trim() || null,
  });

  const validateForm = () => {

    if (!form.codePayrollSinergy.trim()) {
      showResponseModal("warning", "Validación", "El código del concepto de nómina es obligatorio.");
      return false;
    }

    if (!form.namePayrollSinergy.trim()) {
      showResponseModal("warning", "Validación", "El nombre del concepto de nómina es obligatorio.");
      return false;
    }

    return true;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    try {
      setSaving(true);
      const payload = buildPayload();

      if (selectedPayrollSinergy) {
        const response = await payrollSinergyService.update(selectedPayrollSinergy.IdPayrollSinergy, payload);
        showResponseModal(response.isSuccess ? "success" : "warning", "Actualizar concepto de nómina", response.Message || "Concepto de nómina actualizado.");
      } else {
        const response = await payrollSinergyService.create(payload);
        showResponseModal(response.isSuccess ? "success" : "warning", "Crear concepto de nómina", response.Message || "Concepto de nómina creado.");
      }

      cleanForm();
      await loadPayrollSinergys();
    } catch (err) {
      showResponseModal("error", "Error al guardar", getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  const handleSelectForUpdate = (item: PayrollSinergy) => {
    setSelectedPayrollSinergy(item);
    setForm({ codePayrollSinergy: item.codePayrollSinergy ?? "", namePayrollSinergy: item.namePayrollSinergy ?? "", });
  };

  const openDeleteModal = (item: PayrollSinergy) => {
    setPayrollSinergyToDelete(item);
    setDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setDeleteModalOpen(false);
    setPayrollSinergyToDelete(null);
  };

  const confirmDelete = async () => {
    if (!PayrollSinergyToDelete) return;

    try {
      const response = await payrollSinergyService.delete(PayrollSinergyToDelete.IdPayrollSinergy);
      showResponseModal( response.isSuccess ? "success" : "warning", "Eliminar concepto de nómina", response.Message || "Concepto de nómina eliminado.");

      if (selectedPayrollSinergy?.IdPayrollSinergy === PayrollSinergyToDelete.IdPayrollSinergy) {
        cleanForm();
      }

      closeDeleteModal();
      await loadPayrollSinergys();
    } catch (err) {
      closeDeleteModal();
      showResponseModal("error", "Error al eliminar", getErrorMessage(err));
    }
  };

  useEffect(() => {
    loadPayrollSinergys();
  }, [loadPayrollSinergys]);

  return (
    <Box>
      <Stack direction="row" spacing={1.5} sx={{ alignItems: "center", mb: 3, }}>
        <ReceiptLongOutlinedIcon sx={{ color: "#4B2E1F", fontSize: 30, }}/>
        <Typography sx={{ color: "#4B2E1F", fontSize: 26, fontWeight: 700, }}>
          Maestro - Conceptos de Nómina
        </Typography>
      </Stack>
      <Paper elevation={0} sx={{ border: "1px solid #D8BDA5", borderRadius: 2, bgcolor: "#FFFDF8", mb: 3, p: 3, }}>
        <Typography sx={{ color: "#4B2E1F", fontSize: 18, fontWeight: 800, mb: 2, }}>
          {selectedPayrollSinergy ? "Actualizar concepto de nómina" : "Crear concepto de nómina"}
        </Typography>
        <Stack direction="row" spacing={2} sx={{ alignItems: "center", }}>
          <TextField label="Código" value={form.codePayrollSinergy} disabled={saving} fullWidth onChange={(event) => setForm((prev) => ({ ...prev, codePayrollSinergy: event.target.value, }))} />
          <TextField label="Nombre" value={form.namePayrollSinergy} disabled={saving} fullWidth onChange={(event) => setForm((prev) => ({ ...prev, namePayrollSinergy: event.target.value, }))} />
          <Button variant="outlined" startIcon={selectedPayrollSinergy ? <EditOutlinedIcon /> : <AddOutlinedIcon />} onClick={handleSave} disabled={saving} sx={{ minWidth: 160, height: 56, borderColor: "#8B6A55", color: "#4B2E1F", textTransform: "none", fontWeight: 600, "&:hover": { borderColor: "#4B2E1F", bgcolor: "rgba(75, 46, 31, 0.05)", },}}>
            {saving ? "Guardando..." : selectedPayrollSinergy ? "Actualizar" : "Crear"}
          </Button>
          {selectedPayrollSinergy && (
            <IconButton onClick={cleanForm} disabled={saving} sx={{ width: 48, height: 48, border: "1px solid #D8BDA5", color: "#4B2E1F", borderRadius: 2, }}>
              <CleaningServicesOutlinedIcon />
            </IconButton>
          )}
        </Stack>
      </Paper>
      <Paper elevation={0} sx={{ border: "1px solid #D8BDA5", borderRadius: 2, bgcolor: "#FFFDF8", overflow: "hidden", }}>
        <Box sx={{ px: 3, py: 2, borderBottom: "1px solid #E0CDBB", }}>
          <Stack sx={{ display: "flex", flexDirection: "row", gap: 1.5, alignItems: "center", justifyContent: "flex-end", }}>
            <TextField
              size="small"
              placeholder="Buscar por código o nombre"
              value={searchInput}
              disabled={loading}
              onChange={(event) => setSearchInput(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  handleSearch();
                }
              }}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchOutlinedIcon sx={{ color: "#8B6A55", fontSize: 18 }} />
                    </InputAdornment>
                  ),
                },
              }}
              sx={{ width: 300, }}
            />
            <Button variant="outlined" onClick={handleSearch} disabled={loading} sx={{ height: 40, borderColor: "#8B6A55", color: "#4B2E1F", textTransform: "none", fontWeight: 600, "&:hover": { borderColor: "#4B2E1F", bgcolor: "rgba(75, 46, 31, 0.05)", },}}>
              Buscar
            </Button>
            <Button variant="outlined" startIcon={<CleaningServicesOutlinedIcon />} onClick={handleClearSearch} disabled={loading} sx={{ height: 40, borderColor: "#8B6A55", color: "#4B2E1F", textTransform: "none", fontWeight: 600, "&:hover": { borderColor: "#4B2E1F", bgcolor: "rgba(75, 46, 31, 0.05)", },}}>
              Limpiar
            </Button>
          </Stack>
        </Box>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: "#F7E8D8", }}>
                <TableCell sx={{ color: "#4B2E1F", fontWeight: 800 }}>
                  ID
                </TableCell>
                <TableCell sx={{ color: "#4B2E1F", fontWeight: 800 }}>
                  Código
                </TableCell>
                <TableCell sx={{ color: "#4B2E1F", fontWeight: 800 }}>
                  Nombre
                </TableCell>
                <TableCell align="right" sx={{ color: "#4B2E1F", fontWeight: 800 }}>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={4} align="center" sx={{ py: 5 }}>
                    <CircularProgress size={30} sx={{ color: "#4B2E1F" }} />
                  </TableCell>
                </TableRow>
              ) : items.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} align="center" sx={{ py: 5 }}>
                    <Typography sx={{ color: "#8B6A55", fontWeight: 600 }}>
                      No hay conceptos de nómina registrados.
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                items.map((item) => (
                  <TableRow key={item.IdPayrollSinergy}>
                    <TableCell sx={{ color: "#4B2E1F" }}>
                      {item.IdPayrollSinergy}
                    </TableCell>
                    <TableCell sx={{ color: "#4B2E1F" }}>
                      {item.codePayrollSinergy || "-"}
                    </TableCell>
                    <TableCell sx={{ color: "#4B2E1F" }}>
                      {item.namePayrollSinergy || "-"}
                    </TableCell>
                    <TableCell align="right">
                      <Stack direction="row" spacing={1} sx={{ justifyContent: "flex-end", }}>
                        <Button variant="outlined" startIcon={<EditOutlinedIcon />} onClick={() => handleSelectForUpdate(item)} sx={{ borderColor: "#8B6A55", color: "#4B2E1F", textTransform: "none", fontWeight: 600, px: 2, "&:hover": { borderColor: "#4B2E1F", bgcolor: "rgba(75, 46, 31, 0.05)", },}}>
                          Actualizar
                        </Button>
                        <Button variant="outlined" startIcon={<DeleteOutlineOutlinedIcon />} onClick={() => openDeleteModal(item)} sx={{ borderColor: "#E4B4B4", color: "#C62828", textTransform: "none", fontWeight: 600, px: 2, "&:hover": { borderColor: "#C62828", bgcolor: "#FFEBEE", },}}>
                          Eliminar
                        </Button>
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination component="div" count={total} page={page - 1} rowsPerPage={pageSize} rowsPerPageOptions={[5, 10, 25, 50]} labelRowsPerPage="Filas por página" labelDisplayedRows={({ from, to, count }) => `${from}-${to} de ${count !== -1 ? count : `más de ${to}`}` } onPageChange={(_, newPage) => { setPage(newPage + 1); }} onRowsPerPageChange={(event) => { setPageSize(parseInt(event.target.value, 10)); setPage(1); }} />
      </Paper>

      <ResponseModal
        open={deleteModalOpen}
        severity="warning"
        title="Confirmar eliminación"
        message={`¿Seguro que deseas eliminar el concepto de nómina "${
          PayrollSinergyToDelete?.namePayrollSinergy ??
          PayrollSinergyToDelete?.codePayrollSinergy ??
          PayrollSinergyToDelete?.IdPayrollSinergy ??
          ""
        }"?`}
        buttonText="Cancelar"
        confirmButtonText="Eliminar"
        onClose={closeDeleteModal}
        onConfirm={confirmDelete}
      />        
      <ResponseModal open={responseModal.open} severity={responseModal.severity} title={responseModal.title} message={responseModal.message} onClose={closeResponseModal} />
    </Box>
  );
}