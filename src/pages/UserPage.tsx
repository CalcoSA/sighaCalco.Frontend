import { Alert, Box, Button, Chip, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, FormControlLabel, InputAdornment, MenuItem, Paper, Stack, Switch, Table, TableBody, TableCell, TableHead, TableRow, TextField, Typography, } from "@mui/material";
import type { ResponseModalSeverity, ResponseModalState } from "../components/common/ModalType";
import ManageAccountsOutlinedIcon from "@mui/icons-material/ManageAccountsOutlined";
import PersonAddAlt1OutlinedIcon from "@mui/icons-material/PersonAddAlt1Outlined";
import PersonSearchOutlinedIcon from "@mui/icons-material/PersonSearchOutlined";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import SaveOutlinedIcon from "@mui/icons-material/SaveOutlined";
import { ResponseModal } from "../components/ResponseModal";
import { getErrorMessage } from "../services/errorService";
import { userService } from "../services/userService";
import { roleService } from "../services/roleService";
import { useEffect, useState } from "react";
import type { Role } from "../models/Role";
import type { User } from "../models/User";

interface UpdateForm {
  IdUser: number;
  userLogin: string;
  userName: string;
  statusUser: boolean;
  roleId: number;
}

const emptyResponseModal: ResponseModalState = {
  open: false,
  severity: "info",
  title: "",
  message: "",
};

const emptyUpdateForm: UpdateForm = {
  IdUser: 0,
  userLogin: "",
  userName: "",
  statusUser: true,
  roleId: 0,
};

export function UserPage() {
  const [responseModal, setResponseModal] = useState<ResponseModalState>(emptyResponseModal);
  const [updateForm, setUpdateForm] = useState<UpdateForm>(emptyUpdateForm);
  const [loadingUserId, setLoadingUserId] = useState<number | null>(null);
  const [updateValidationError, setUpdateValidationError] = useState("");
  const [selectedRoleId, setSelectedRoleId] = useState<number>(0);
  const [updateModalOpen, setUpdateModalOpen] = useState(false);
  const [validationError, setValidationError] = useState("");
  const [activeRoles, setActiveRoles] = useState<Role[]>([]);
  const [loadingRoles, setLoadingRoles] = useState(false);
  const [intranetUser, setIntranetUser] = useState("");
  const [users, setUsers] = useState<User[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

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

  const loadRoles = async () => {
    try {
      setLoadingRoles(true);

      const [allRolesResponse, activeRolesResponse] = await Promise.all([roleService.getAll(), roleService.getActive(),]);

      setRoles(allRolesResponse.result ?? []);
      setActiveRoles(activeRolesResponse.result ?? []);
    } catch (err) {
      setRoles([]);
      setActiveRoles([]);
      showResponseModal("error", "Error al cargar roles", getErrorMessage(err));
    } finally {
      setLoadingRoles(false);
    }
  };

  const loadUsers = async () => {
    try {
      setLoading(true);
      const response = await userService.getAll();
      setUsers(response.result ?? []);
    } catch (err) {
      setUsers([]);
      showResponseModal("error", "Error al cargar usuarios", getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const getUserRoleLabel = (user: User) => {

    if (!user.roles || user.roles.length === 0) {
      return "Sin rol";
    }

    return user.roles.map((role) => role.nameRole).join(", ");
  };

  const handleCreateUser = async () => {
    try {
      const username = intranetUser.trim();

      if (!username) {
        setValidationError("Debes ingresar el usuario de intranet.");
        return;
      }

      if (username.length < 3) {
        setValidationError("Debes ingresar mínimo 3 caracteres.");
        return;
      }

      if (!selectedRoleId || selectedRoleId <= 0) {
        setValidationError("Debes seleccionar un rol.");
        return;
      }

      setSaving(true);
      setValidationError("");

      const searchResponse = await userService.searchWordpressUsers(username);
      const wordpressUsers = searchResponse.result ?? [];

      if (!searchResponse.isSuccess || wordpressUsers.length === 0) {
        showResponseModal("warning", "Usuario no encontrado", "No se encontró ningún usuario de intranet con el criterio ingresado.");
        return;
      }

      const exactUser = wordpressUsers.find((item) => item.wordpressUserLogin.toLowerCase() === username.toLowerCase()) ?? wordpressUsers[0];

      const response = await userService.create({
        wordpressUserId: exactUser.wordpressUserId,
        userLogin: exactUser.wordpressUserLogin,
        userName: exactUser.wordpressUserName,
        statusUser: true,
        roleIds: [selectedRoleId],
      });

      if (!response.isSuccess) {
        showResponseModal("error", "No se pudo crear", response.Message || "No se pudo autorizar el usuario.");
        return;
      }

      setIntranetUser("");
      setSelectedRoleId(0);

      await loadUsers();

      showResponseModal("success", "Usuario autorizado", response.Message || "Usuario autorizado correctamente.");
    } catch (err) {
      showResponseModal("error", "Error en la operación", getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  const getFirstRoleId = (user: User) => {
    return user.roles?.[0]?.IdRole ?? 0;
  };

  const openUpdateModal = (user: User) => {
    setUpdateValidationError("");
    setUpdateForm({
      IdUser: user.IdUser,
      userLogin: user.userLogin,
      userName: user.userName,
      statusUser: user.statusUser,
      roleId: getFirstRoleId(user),
    });
    setUpdateModalOpen(true);
  };

  const closeUpdateModal = () => {
    if (saving) return;

    setUpdateModalOpen(false);
    setUpdateForm(emptyUpdateForm);
    setUpdateValidationError("");
  };

  const handleUpdateUser = async () => {
    try {
      if (!updateForm.roleId || updateForm.roleId <= 0) {
        setUpdateValidationError("Debes seleccionar un rol.");
        return;
      }

      setSaving(true);
      setUpdateValidationError("");
      setLoadingUserId(updateForm.IdUser);

      const response = await userService.update(
        updateForm.IdUser,
        {
          statusUser: updateForm.statusUser,
          roleIds: [updateForm.roleId],
        }
      );

      if (!response.isSuccess) {
        showResponseModal("error", "No se pudo actualizar", response.Message || "No se pudo actualizar el usuario.");
        return;
      }

      setUpdateModalOpen(false);
      setUpdateForm(emptyUpdateForm);

      await loadUsers();

      showResponseModal("success", "Usuario actualizado", response.Message || "Usuario actualizado correctamente.");
    } catch (err) {
      showResponseModal("error", "Error en la operación", getErrorMessage(err));
    } finally {
      setSaving(false);
      setLoadingUserId(null);
    }
  };

  useEffect(() => {
    loadRoles();
    loadUsers();
  }, []);

  return (
    <Stack spacing={3}>
      <Stack sx={{ display: "flex", flexDirection: "row", gap: 1.5, alignItems: "center", }}>
        <ManageAccountsOutlinedIcon sx={{ color: "#4B2E1F", fontSize: 30 }}/>
        <Typography sx={{ color: "#4B2E1F", fontSize: 26, fontWeight: 700, }}>
          Usuario - Roles
        </Typography>
      </Stack>
      <Paper elevation={0} sx={{ border: "1px solid #E0CDBB", borderRadius: 2, p: 3, }}>
        <Stack spacing={2.5}>
          <Typography sx={{ color: "#4B2E1F", fontSize: 18, fontWeight: 700, }}>
            Autorizar usuario de intranet
          </Typography>
          { validationError && <Alert severity="warning">{validationError}</Alert> }
          <Stack sx={{ display: "flex", flexDirection: { xs: "column", md: "row" }, gap: 2, alignItems: "center", }}>
            <TextField label="Usuario de intranet" value={intranetUser} disabled={saving} fullWidth onChange={(event) => setIntranetUser(event.target.value)} slotProps={{ input: { startAdornment: ( <InputAdornment position="start"> <PersonSearchOutlinedIcon sx={{ color: "#8B6A55" }} /> </InputAdornment> ), },}}/>
            <TextField select label="Rol" value={selectedRoleId} disabled={saving || loadingRoles} fullWidth onChange={(event) => setSelectedRoleId(Number(event.target.value)) }>
              <MenuItem value={0}>Seleccione un rol</MenuItem>
              {activeRoles.map((role) => (
                <MenuItem key={role.IdRole} value={role.IdRole}>
                  {role.nameRole}
                </MenuItem>
              ))}
            </TextField>
            <Button
              variant="outlined"
              startIcon={
                saving ? (
                  <CircularProgress size={16} />
                ) : (
                  <PersonAddAlt1OutlinedIcon />
                )
              }
              onClick={handleCreateUser}
              disabled={saving || loadingRoles}
              sx={{ minWidth: { xs: "100%", md: 180 }, height: 56, borderColor: "#8B6A55", color: "#4B2E1F", textTransform: "none", fontWeight: 600, "&:hover": { borderColor: "#4B2E1F", bgcolor: "rgba(75, 46, 31, 0.05)", },}}>
              {saving ? "Creando..." : "Crear usuario"}
            </Button>
          </Stack>
        </Stack>
      </Paper>
      <Paper elevation={0} sx={{ border: "1px solid #E0CDBB", borderRadius: 2, overflow: "hidden", }}>
        {loading ? (
          <Box sx={{ py: 6, display: "flex", justifyContent: "center", }}>
            <CircularProgress sx={{ color: "#4B2E1F" }} />
          </Box>
        ) : (
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: "#F7E8D8" }}>
                <TableCell sx={{ fontWeight: 700, color: "#4B2E1F" }}>
                  Usuario intranet
                </TableCell>
                <TableCell sx={{ fontWeight: 700, color: "#4B2E1F" }}>
                  Nombre
                </TableCell>
                <TableCell sx={{ fontWeight: 700, color: "#4B2E1F" }}>
                  Rol
                </TableCell>
                <TableCell sx={{ fontWeight: 700, color: "#4B2E1F" }}>
                  Estado
                </TableCell>
                <TableCell align="center" sx={{ fontWeight: 700, color: "#4B2E1F" }}/>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((item) => {
                const isLoadingThisRow = loadingUserId === item.IdUser;

                return (
                  <TableRow key={item.IdUser} hover>
                    <TableCell>{item.userLogin}</TableCell>
                    <TableCell>{item.userName}</TableCell>
                    <TableCell>{getUserRoleLabel(item)}</TableCell>
                    <TableCell>
                      <Chip label={ item.statusUser ? "Activo" : "Inactivo" } size="small" sx={{ bgcolor: item.statusUser ? "#E8F5E9" : "#FFEBEE", color: item.statusUser ? "#2E7D32" : "#C62828", fontWeight: 600, }}/>
                    </TableCell>
                    <TableCell align="center">
                      <Button variant="outlined" size="small"
                        startIcon={
                          isLoadingThisRow ? (
                            <CircularProgress size={16} />
                          ) : (
                            <EditOutlinedIcon />
                          )
                        }
                        onClick={() => openUpdateModal(item)}
                        disabled={saving || loadingUserId !== null}
                        sx={{ borderColor: "#8B6A55", color: "#4B2E1F", textTransform: "none", fontWeight: 600, "&:hover": { borderColor: "#4B2E1F", bgcolor: "rgba(75, 46, 31, 0.05)", },}}>
                        {isLoadingThisRow ? "Cargando..." : "Actualizar"}
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
              {users.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} align="center" sx={{ py: 4 }}>
                    No hay usuarios autorizados para mostrar.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        )}
      </Paper>

      <Dialog open={updateModalOpen} onClose={saving ? undefined : closeUpdateModal} fullWidth maxWidth="sm">
        <DialogTitle sx={{ display: "flex", alignItems: "center", gap: 1, color: "#4B2E1F", fontWeight: 700, }}>
          <EditOutlinedIcon /> Actualizar usuario
        </DialogTitle>
        <DialogContent>
          <Stack spacing={2.5} sx={{ mt: 1 }}>
            <Typography sx={{ color: "#6B4A3A", fontSize: 14 }}>
              Modifica el rol o estado del usuario autorizado.
            </Typography>
            {updateValidationError && ( <Alert severity="warning">{updateValidationError}</Alert>)}
            <TextField label="Usuario de intranet" value={updateForm.userLogin} disabled fullWidth/>
            <TextField select label="Rol" value={updateForm.roleId} disabled={saving || loadingRoles} fullWidth onChange={(event) => setUpdateForm((prev) => ({ ...prev, roleId: Number(event.target.value), }))}>
              <MenuItem value={0}>Seleccione un rol</MenuItem>
              {roles.map((role) => (
                <MenuItem key={role.IdRole} value={role.IdRole}>
                  {role.nameRole}
                </MenuItem>
              ))}
            </TextField>
            <FormControlLabel
              control={
                <Switch
                  checked={updateForm.statusUser}
                  disabled={saving}
                  onChange={(event) =>
                    setUpdateForm((prev) => ({
                      ...prev,
                      statusUser: event.target.checked,
                    }))
                  }
                />
              }
              label={
                updateForm.statusUser ? "Activo" : "Inactivo"
              }
            />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button variant="outlined" startIcon={<CloseOutlinedIcon />} onClick={closeUpdateModal} disabled={saving} sx={{ borderColor: "#8B6A55", color: "#4B2E1F", textTransform: "none", fontWeight: 600, "&:hover": { borderColor: "#4B2E1F", bgcolor: "rgba(75, 46, 31, 0.05)", },}}>
            Cancelar
          </Button>
          <Button variant="contained" startIcon={<SaveOutlinedIcon />} onClick={handleUpdateUser} disabled={saving} sx={{ bgcolor: "#4B2E1F", color: "#FFFFFF", textTransform: "none", fontWeight: 600, "&:hover": { bgcolor: "#3A2318", },}}>
            {saving ? "Guardando..." : "Actualizar"}
          </Button>
        </DialogActions>
      </Dialog>
      
      <ResponseModal open={responseModal.open} severity={responseModal.severity} title={responseModal.title} message={responseModal.message} onClose={closeResponseModal}/>  
    </Stack>
  );
}