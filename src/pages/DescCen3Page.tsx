import { Box, Button, CircularProgress, IconButton, InputAdornment, Paper, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, TextField, Typography, } from "@mui/material";
import type { ResponseModalState, ResponseModalSeverity } from "../components/common/ModalType";
import CleaningServicesOutlinedIcon from "@mui/icons-material/CleaningServicesOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import ApartmentOutlinedIcon from "@mui/icons-material/ApartmentOutlined";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import { descCen3Service } from "../services/descCen3Service";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import { getErrorMessage } from "../services/errorService";
import { ResponseModal } from "../components/ResponseModal";
import { useCallback, useEffect, useState } from "react";
import type { DescCen3 } from "../models/DescCen3";

interface DescCen3Form {
  nameDescCen3: string;
  codeDescCen3: string;
}

const emptyForm: DescCen3Form = {
  nameDescCen3: "",
  codeDescCen3: "",
};

const emptyResponseModal: ResponseModalState = {
  open: false,
  severity: "info",
  title: "",
  message: "",
};

export function DescCen3Page() {
  const [responseModal, setResponseModal] = useState<ResponseModalState>(emptyResponseModal);
  const [selectedDescCen3, setSelectedDescCen3] = useState<DescCen3 | null>(null);
  const [DescCen3ToDelete, setDescCen3ToDelete] = useState<DescCen3 | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [form, setForm] = useState<DescCen3Form>(emptyForm);
  const [items, setItems] = useState<DescCen3[]>([]);
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

  const loadDescCen3s = useCallback(async () => {
    try {
      setLoading(true);
      const response = await descCen3Service.getAll({ page, pageSize, search, });
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
    setSelectedDescCen3(null);
    setForm(emptyForm);
  };

  const buildPayload = () => ({
    nameDescCen3: form.nameDescCen3.trim() || null,
    codeDescCen3: form.codeDescCen3.trim() || null,
  });

  const validateForm = () => {

    if (!form.codeDescCen3.trim()) {
      showResponseModal("warning", "Validación", "El código del DescCen3 es obligatorio.");
      return false;
    }

    if (!form.nameDescCen3.trim()) {
      showResponseModal("warning", "Validación", "El nombre del DescCen3 es obligatorio.");
      return false;
    }

    return true;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    try {
      setSaving(true);
      const payload = buildPayload();

      if (selectedDescCen3) {
        const response = await descCen3Service.update(selectedDescCen3.IdDescCen3, payload);
        showResponseModal(response.isSuccess ? "success" : "warning", "Actualizar DescCen3", response.Message || "DescCen3 actualizado.");
      } else {
        const response = await descCen3Service.create(payload);
        showResponseModal(response.isSuccess ? "success" : "warning", "Crear DescCen3", response.Message || "DescCen3 creado.");
      }

      cleanForm();
      await loadDescCen3s();
    } catch (err) {
      showResponseModal("error", "Error al guardar", getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  const handleSelectForUpdate = (item: DescCen3) => {
    setSelectedDescCen3(item);
    setForm({ codeDescCen3: item.codeDescCen3 ?? "", nameDescCen3: item.nameDescCen3 ?? "", });
  };

  const openDeleteModal = (item: DescCen3) => {
    setDescCen3ToDelete(item);
    setDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setDeleteModalOpen(false);
    setDescCen3ToDelete(null);
  };

  const confirmDelete = async () => {
    if (!DescCen3ToDelete) return;

    try {
      const response = await descCen3Service.delete(DescCen3ToDelete.IdDescCen3);
      showResponseModal( response.isSuccess ? "success" : "warning", "Eliminar DescCen3", response.Message || "DescCen3 eliminado.");

      if (selectedDescCen3?.IdDescCen3 === DescCen3ToDelete.IdDescCen3) {
        cleanForm();
      }

      closeDeleteModal();
      await loadDescCen3s();
    } catch (err) {
      closeDeleteModal();
      showResponseModal("error", "Error al eliminar", getErrorMessage(err));
    }
  };

  useEffect(() => {
    loadDescCen3s();
  }, [loadDescCen3s]);

  return (
    <Box>
      <Stack direction="row" spacing={1.5} sx={{ alignItems: "center", mb: 3, }}>
        <ApartmentOutlinedIcon sx={{ color: "#4B2E1F", fontSize: 30, }}/>
        <Typography sx={{ color: "#4B2E1F", fontSize: 26, fontWeight: 700, }}>
          Maestro - Desc Cen3
        </Typography>
      </Stack>
      <Paper elevation={0} sx={{ border: "1px solid #D8BDA5", borderRadius: 2, bgcolor: "#FFFDF8", mb: 3, p: 3, }}>
        <Typography sx={{ color: "#4B2E1F", fontSize: 18, fontWeight: 800, mb: 2, }}>
          {selectedDescCen3 ? "Actualizar Desc Cen3" : "Crear Desc Cen3"}
        </Typography>
        <Stack direction="row" spacing={2} sx={{ alignItems: "center", }}>
          <TextField label="Código" value={form.codeDescCen3} disabled={saving} fullWidth onChange={(event) => setForm((prev) => ({ ...prev, codeDescCen3: event.target.value, }))} />
          <TextField label="Nombre" value={form.nameDescCen3} disabled={saving} fullWidth onChange={(event) => setForm((prev) => ({ ...prev, nameDescCen3: event.target.value, }))} />
          <Button variant="outlined" startIcon={selectedDescCen3 ? <EditOutlinedIcon /> : <AddOutlinedIcon />} onClick={handleSave} disabled={saving} sx={{ minWidth: 160, height: 56, borderColor: "#8B6A55", color: "#4B2E1F", textTransform: "none", fontWeight: 600, "&:hover": { borderColor: "#4B2E1F", bgcolor: "rgba(75, 46, 31, 0.05)", },}}>
            {saving ? "Guardando..." : selectedDescCen3 ? "Actualizar" : "Crear"}
          </Button>
          {selectedDescCen3 && (
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
                      No hay ausentismos registrados.
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                items.map((item) => (
                  <TableRow key={item.IdDescCen3}>
                    <TableCell sx={{ color: "#4B2E1F" }}>
                      {item.IdDescCen3}
                    </TableCell>
                    <TableCell sx={{ color: "#4B2E1F" }}>
                      {item.codeDescCen3 || "-"}
                    </TableCell>
                    <TableCell sx={{ color: "#4B2E1F" }}>
                      {item.nameDescCen3 || "-"}
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
        message={`¿Seguro que deseas eliminar el DescCen3 "${
          DescCen3ToDelete?.nameDescCen3 ??
          DescCen3ToDelete?.codeDescCen3 ??
          DescCen3ToDelete?.IdDescCen3 ??
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