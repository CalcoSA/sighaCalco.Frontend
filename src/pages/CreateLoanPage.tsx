import { Alert, Autocomplete, Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, InputAdornment, MenuItem, Paper, Stack, TextField, Tooltip, Typography, } from "@mui/material";
import type { ResponseModalSeverity, ResponseModalState, } from "../components/common/ModalType";
import AccountBalanceWalletOutlinedIcon from "@mui/icons-material/AccountBalanceWalletOutlined";
import CheckCircleOutlineOutlinedIcon from "@mui/icons-material/CheckCircleOutlineOutlined";
import CleaningServicesOutlinedIcon from "@mui/icons-material/CleaningServicesOutlined";
import PersonSearchOutlinedIcon from "@mui/icons-material/PersonSearchOutlined";
import { payrollSinergyService } from "../services/payrollSinergyService";
import { deductionPlanService } from "../services/deductionPlanService";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import { bukEmployeeService } from "../services/bukEmployeeService";
import { loanStatusService } from "../services/loanStatusService";
import type { PayrollSinergy } from "../models/PayrollSinergy";
import type { DeductionPlan } from "../models/DeductionPlan";
import { ResponseModal } from "../components/ResponseModal";
import { getErrorMessage } from "../services/errorService";
import type { LoanStatus } from "../models/LoanStatus";
import { loanService } from "../services/loanService";
import { NumericFormat } from "react-number-format";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

interface LoanEmployeeForm {
  documentNumber: string;
  fullName: string;
  roleName: string;
  costCenterName: string;
}

const emptyEmployeeForm: LoanEmployeeForm = {
  documentNumber: "",
  fullName: "",
  roleName: "",
  costCenterName: "",
};

interface LoanForm {
  isLoan: boolean;
  crossDocument: string;
  IdConcept: number;
  conceptName: string;
  IdDeductionPlan: number;
  deductionPlanName: string;
  IdLoanStatus: number;
  loanStatusName: string;
  loanAmount: string;
  serviceValue: string;
  numberInstallments: string;
  remainingAmount: string;
  requestDate: string;
  startDiscountDate: string;
  endDiscountDate: string;
  observation: string;
}

const emptyLoanForm: LoanForm = {
  isLoan: true,
  crossDocument: "",
  IdConcept: 0,
  conceptName: "",
  IdDeductionPlan: 0,
  deductionPlanName: "",
  IdLoanStatus: 0,
  loanStatusName: "",
  loanAmount: "",
  serviceValue: "",
  numberInstallments: "",
  remainingAmount: "",
  requestDate: "",
  startDiscountDate: "",
  endDiscountDate: "",
  observation: "",
};

interface LoanInstallmentForm {
  installmentNumber: number;
  installmentValue: string;
  commitmentDate: string;
}

const emptyResponseModal: ResponseModalState = {
  open: false,
  severity: "info",
  title: "",
  message: "",
};

const parseLocalDate = (value: string) => {

  if (!value) return null;

  const [year, month, day] = value.split("-").map(Number);

  if (!year || !month || !day) return null;

  return new Date(year, month - 1, day);
};

const formatLocalDate = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

const getLastDayOfMonth = (year: number, monthIndex: number) => {
  return new Date(year, monthIndex + 1, 0).getDate();
};

const calculateCommitmentDates = (startDiscountDate: string, numberInstallments: string, deductionPlanName: string) => {
  const startDate = parseLocalDate(startDiscountDate);
  const installments = Number(numberInstallments);
  const planName = deductionPlanName.trim().toLowerCase();

  if (!startDate || !installments || installments <= 0 || !planName) {
    return [];
  }

  const startYear = startDate.getFullYear();
  const startMonth = startDate.getMonth();
  const startDay = startDate.getDate();
  const dates: string[] = [];

  if (planName.includes("primera")) {
    const monthOffset = startDay <= 15 ? 0 : 1;

    for (let index = 0; index < installments; index++) {
      const commitmentDate = new Date(startYear, startMonth + monthOffset + index, 15);
      dates.push(formatLocalDate(commitmentDate));
    }

    return dates;
  }

  if (planName.includes("segunda")) {
    for (let index = 0; index < installments; index++) {
      const currentMonth = new Date(startYear, startMonth + index, 1);
      const lastDay = getLastDayOfMonth(currentMonth.getFullYear(), currentMonth.getMonth());
      const commitmentDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), lastDay);
      dates.push(formatLocalDate(commitmentDate));
    }

    return dates;
  }

  if (planName.includes("ambas")) {
    let currentYear = startYear;
    let currentMonth = startMonth;
    let isFirstFortnight = startDay <= 15;

    for (let index = 0; index < installments; index++) {
      if (isFirstFortnight) {
        const commitmentDate = new Date(currentYear, currentMonth, 15);
        dates.push(formatLocalDate(commitmentDate));
        isFirstFortnight = false;
      } else {
        const lastDay = getLastDayOfMonth(currentYear, currentMonth);
        const commitmentDate = new Date(currentYear, currentMonth, lastDay);

        dates.push(formatLocalDate(commitmentDate));

        isFirstFortnight = true;
        currentMonth += 1;

        if (currentMonth > 11) {
          currentMonth = 0;
          currentYear += 1;
        }
      }
    }

    return dates;
  }

  return [];
};

const calculateEndDiscountDate = ( startDiscountDate: string, numberInstallments: string, deductionPlanName: string) => {
  const dates = calculateCommitmentDates(startDiscountDate, numberInstallments, deductionPlanName);
  return dates.length > 0 ? dates[dates.length - 1] : "";
};

export function CreateLoanPage() {
  const [responseModal, setResponseModal] = useState<ResponseModalState>(emptyResponseModal);
  const [installmentDrafts, setInstallmentDrafts] = useState<LoanInstallmentForm[]>([]);
  const [employeeForm, setEmployeeForm] = useState<LoanEmployeeForm>(emptyEmployeeForm);
  const [selectedPayroll, setSelectedPayroll] = useState<PayrollSinergy | null>(null);
  const [loanInstallments, setLoanInstallments] = useState<LoanInstallmentForm[]>([]);
  const [allDeductionPlans, setAllDeductionPlants] = useState<DeductionPlan[]>([]);
  const [installmentModalOpen, setInstallmentModalOpen] = useState(false);
  const [allLoanStatus, setAllLoanStatus] = useState<LoanStatus[]>([]);
  const [allPayrolls, setPayrolls] = useState<PayrollSinergy[]>([]);
  const [loanForm, setLoanForm] = useState<LoanForm>(emptyLoanForm);
  const [loadingEmployee, setLoadingEmployee] = useState(false);
  const [validationError, setValidationError] = useState("");
  const [documentNumber, setDocumentNumber] = useState("");
  const [savingLoan, setSavingLoan] = useState(false);
  const navigate = useNavigate();
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

  const loadPayrolls = async (search?: string) => {
    try {
      const response = await payrollSinergyService.getPayroll(search);
      setPayrolls(response.result ?? []);
    } catch (err) {
      setPayrolls([]);
      showResponseModal("error", "Error al cargar conceptos de nómina", getErrorMessage(err));
    }
  };

  const loadAllDeductionPlans = async () => {
    try {
      const response = await deductionPlanService.getAll();
      setAllDeductionPlants(response.result ?? []);
    } catch (err) {
      setAllDeductionPlants([]);
      showResponseModal("error", "Error al cargar los planes de dedución", getErrorMessage(err));
    }
  };

  const loadAllLoanStatus = async () => {
    try {
      const response = await loanStatusService.getAll();
      const filteredStatus = (response.result ?? []).filter((item) => ["activo", "inactivo"].includes(item.nameLoanStatus.toLowerCase()));
      setAllLoanStatus(filteredStatus);
    } catch (err) {
      setAllLoanStatus([]);
      showResponseModal("error", "Error al cargar los estados de préstamos", getErrorMessage(err));
    }
  };

  const handleSearchEmployee = async () => {
    try {
      const cleanDocumentNumber = documentNumber.trim().replace(/\D/g, "");

      if (!cleanDocumentNumber) {
        setValidationError("Debes ingresar el número de documento.");
        return;
      }

      if (cleanDocumentNumber.length < 3) {
        setValidationError("Debes ingresar mínimo 3 caracteres.");
        return;
      }

      setValidationError("");
      setLoadingEmployee(true);
      setEmployeeForm(emptyEmployeeForm);

      const response = await bukEmployeeService.getByDocument(cleanDocumentNumber);

      if (!response.isSuccess || !response.result) {
        showResponseModal("warning", "Colaborador no encontrado", response.Message || "No se encontró ningún colaborador con ese documento.");
        return;
      }

      const employee = response.result;

      setEmployeeForm({
        documentNumber: (employee.documentNumber ?? cleanDocumentNumber).replace(/\D/g, ""),
        fullName: employee.fullName ?? "",
        roleName: employee.roleName ?? "",
        costCenterName: employee.costCenterName ?? "",
      });

    } catch (err) {
      showResponseModal("error", "Error al consultar BUK", getErrorMessage(err));
    } finally {
      setLoadingEmployee(false);
    }
  };

  const openInstallmentModal = () => {
    const numberInstallments = Number(loanForm.numberInstallments);

    if (!numberInstallments || numberInstallments <= 0) {
      showResponseModal("warning", "Número de cuotas", "Debes ingresar primero el número de cuotas.");
      return;
    }

    if (!loanForm.startDiscountDate) {
      showResponseModal("warning", "Inicio descuento", "Debes ingresar primero la fecha de inicio de descuento.");
      return;
    }

    if (!loanForm.deductionPlanName) {
      showResponseModal("warning", "Plan de deducción", "Debes seleccionar primero el plan de deducción.");
      return;
    }

    const commitmentDates = calculateCommitmentDates(loanForm.startDiscountDate, loanForm.numberInstallments, loanForm.deductionPlanName);

    const drafts = Array.from({ length: numberInstallments }, (_, index) => {
      const installmentNumber = index + 1;

      const existingInstallment = loanInstallments.find(
        (item) => item.installmentNumber === installmentNumber
      );

      return {
        installmentNumber,
        installmentValue: existingInstallment?.installmentValue ?? "",
        commitmentDate: commitmentDates[index] ?? "",
      };
    });

    setInstallmentDrafts(drafts);
    setInstallmentModalOpen(true);
  };

  const closeInstallmentModal = () => {
    setInstallmentModalOpen(false);
  };

  const acceptInstallments = () => {
    setLoanInstallments(installmentDrafts);
    setInstallmentModalOpen(false);
  };

  const replicateFirstInstallmentValue = () => {
    const firstValue = installmentDrafts[0]?.installmentValue ?? "";

    setInstallmentDrafts((prev) =>
      prev.map((item) => ({
        ...item,
        installmentValue: firstValue,
      }))
    );
  };

  const cleanForm = () => {
    setDocumentNumber("");
    setEmployeeForm(emptyEmployeeForm);
    setLoanForm(emptyLoanForm);
    setValidationError("");
    setPayrolls([]);
    setSelectedPayroll(null);
    setLoanInstallments([]);
    setInstallmentDrafts([]);
    setInstallmentModalOpen(false);
  };

  const handleCreateLoan = async () => {
    try {
      setSavingLoan(true);

      const response = await loanService.create({
        employeeDocumentNumber: employeeForm.documentNumber.trim().replace(/\D/g, ""),
        employeeFullName: employeeForm.fullName.trim(),
        employeeRoleName: employeeForm.roleName.trim() || null,
        employeeCostCenterName: employeeForm.costCenterName.trim() || null,
        isLoan: loanForm.isLoan,
        crossDocument: loanForm.crossDocument.trim() || null,
        IdConcept: loanForm.IdConcept,
        conceptName: loanForm.conceptName.trim(),
        IdDeductionPlan: loanForm.IdDeductionPlan,
        deductionPlanName: loanForm.deductionPlanName.trim(),
        IdLoanStatus: loanForm.IdLoanStatus,
        loanStatusName: loanForm.loanStatusName.trim(),
        loanAmount: loanForm.isLoan ? Number(loanForm.loanAmount) : null,
        serviceValue: loanForm.isLoan ? null : Number(loanForm.serviceValue),
        numberInstallments: loanForm.isLoan ? Number(loanForm.numberInstallments) : null,
        requestDate: loanForm.requestDate,
        startDiscountDate: loanForm.startDiscountDate,
        endDiscountDate: loanForm.isLoan ? loanForm.endDiscountDate || null : null,
        observation: loanForm.observation.trim() || null,
        createdByUserName: user?.userLogin ?? "",
        loanInstallments:
          loanForm.isLoan ? loanInstallments.map(
            (item) => ({
              installmentNumber: item.installmentNumber,
              installmentValue: Number(item.installmentValue),
              isPaid: false,
              commitmentDate: item.commitmentDate,
              paymentDate: null,
            })
          )
        : [],
      });

      if (!response.isSuccess) {
        showResponseModal("warning", "No se pudo crear", response.Message || "No se pudo crear el préstamo.");
        return;
      }

      navigate("/cuotas-prestamos/prestamos", { replace: true });
    } catch (err) {
      showResponseModal("error", "Error al crear préstamo", getErrorMessage(err));
    } finally {
      setSavingLoan(false);
    }
  };

  useEffect(() => {

    if (!loanForm.isLoan) {
      setLoanForm((prev) => {

        if (!prev.endDiscountDate) {
          return prev;
        }

        return {
          ...prev,
          endDiscountDate: "",
        };
      });

      return;
    }

    const calculatedEndDate = calculateEndDiscountDate(loanForm.startDiscountDate, loanForm.numberInstallments, loanForm.deductionPlanName);

    setLoanForm((prev) => {

      if (prev.endDiscountDate === calculatedEndDate) {
        return prev;
      }

      return {
        ...prev,
        endDiscountDate:
          calculatedEndDate,
      };
    });

  }, [
    loanForm.isLoan,
    loanForm.startDiscountDate,
    loanForm.numberInstallments,
    loanForm.deductionPlanName,
  ]);

  useEffect(() => {
    loadPayrolls();
    loadAllLoanStatus();
    loadAllDeductionPlans();
  }, []);

  return (
    <Stack spacing={3}>
      <Stack sx={{ display: "flex",flexDirection: "row", gap: 1.5, alignItems: "center", }}>
        <AccountBalanceWalletOutlinedIcon sx={{ color: "#4B2E1F", fontSize: 30, }} />
        <Typography sx={{ color: "#4B2E1F", fontSize: 26, fontWeight: 700, }}>
          Crear Préstamo
        </Typography>
      </Stack>
      <Paper elevation={0} sx={{ border: "1px solid #E0CDBB", borderRadius: 2, p: 3, }}>
        <Stack spacing={2.5}>
          <Typography sx={{ color: "#4B2E1F", fontSize: 18, fontWeight: 700, }}>
            Consultar colaborador
          </Typography>
          {validationError && ( <Alert severity="warning">{validationError}</Alert> )}
          <Stack sx={{ display: "flex", flexDirection: { xs: "column", md: "row" }, gap: 2, alignItems: "center", }}>
            <TextField
              label="Número de documento"
              value={documentNumber}
              disabled={loadingEmployee}
              fullWidth
              onChange={(event) => setDocumentNumber(event.target.value.replace(/\D/g, ""))}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  handleSearchEmployee();
                }
              }}
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
            <Button
              variant="outlined"
              startIcon={
                loadingEmployee ? (
                  <CircularProgress size={16} />
                ) : (
                  <SearchOutlinedIcon />
                )
              }
              onClick={handleSearchEmployee}
              disabled={loadingEmployee}
              sx={{
                minWidth: { xs: "100%", md: 180 },
                height: 56,
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
              {loadingEmployee ? "Buscando..." : "Buscar"}
            </Button>
            <Button
              variant="outlined"
              startIcon={<CleaningServicesOutlinedIcon />}
              onClick={cleanForm}
              disabled={loadingEmployee}
              sx={{
                minWidth: { xs: "100%", md: 140 },
                height: 56,
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
      </Paper>
      <Paper elevation={0} sx={{ border: "1px solid #E0CDBB", borderRadius: 2, p: 3, }}>
        <Stack spacing={2.5}>
          <Typography sx={{ color: "#4B2E1F", fontSize: 18, fontWeight: 700, }}>
            Datos del colaborador
          </Typography>
          <Stack sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "repeat(2, minmax(0, 1fr))", md: "repeat(4, minmax(0, 1fr))", }, gap: 1.5, }}>
            <TextField label="Documento" value={employeeForm.documentNumber} required fullWidth size="small" onChange={(event) => setEmployeeForm((prev) => ({ ...prev, documentNumber: event.target.value.replace(/\D/g, ""), }))} sx={{ "& .MuiInputBase-input": { fontSize: 13, }, "& .MuiInputLabel-root": { fontSize: 13, },}} />
            <TextField label="Nombre" value={employeeForm.fullName} required fullWidth size="small" onChange={(event) => setEmployeeForm((prev) => ({ ...prev, fullName: event.target.value, }))} sx={{ "& .MuiInputBase-input": { fontSize: 13, }, "& .MuiInputLabel-root": { fontSize: 13, },}} />
            <TextField label="Cargo"  value={employeeForm.roleName} fullWidth size="small" onChange={(event) => setEmployeeForm((prev) => ({ ...prev, roleName: event.target.value, }))} sx={{ "& .MuiInputBase-input": { fontSize: 13, }, "& .MuiInputLabel-root": { fontSize: 13, },}} />
            <TextField label="Nombre centro de costo" value={employeeForm.costCenterName} fullWidth size="small" onChange={(event) => setEmployeeForm((prev) => ({ ...prev, costCenterName: event.target.value, }))} sx={{ "& .MuiInputBase-input": { fontSize: 13, }, "& .MuiInputLabel-root": { fontSize: 13, },}} />
          </Stack>
          <Typography sx={{ color: "#4B2E1F", fontSize: 18, fontWeight: 700, }}>
            Datos del préstamo
          </Typography>
          <Stack sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "repeat(2, minmax(0, 1fr))", md: "repeat(4, minmax(0, 1fr))", }, gap: 1.5, }}>
            <TextField
              select
              label="Tipo"
              value={loanForm.isLoan ? "loan" : "service"}
              required
              fullWidth
              size="small"
              disabled={savingLoan}
              onChange={(event) => {
                const isLoan =
                  event.target.value === "loan";
                setLoanForm((prev) => ({
                  ...prev,
                  isLoan,
                  loanAmount: "",
                  serviceValue: "",
                  numberInstallments: "",
                  endDiscountDate: "",
                }));
                setLoanInstallments([]);
                setInstallmentDrafts([]);
              }}
              sx={{
                "& .MuiInputBase-input": {
                  fontSize: 13,
                },
                "& .MuiInputLabel-root": {
                  fontSize: 13,
                },
              }}
            >
              <MenuItem value="loan">
                Préstamo
              </MenuItem>
              <MenuItem value="service">
                Emolumento
              </MenuItem>
            </TextField>
            <Autocomplete
              value={selectedPayroll}
              options={allPayrolls}
              filterOptions={(options) => options}
              getOptionLabel={(option) => {
                const code = option.codePayrollSinergy ?? "";
                const name = option.namePayrollSinergy ?? "";
                return code ? `${code} - ${name}` : name;
              }}
              isOptionEqualToValue={(option, value) =>
                option.IdPayrollSinergy === value.IdPayrollSinergy
              }
              onInputChange={(_, value) => {
                loadPayrolls(value);
              }}
              onChange={(_, value) => {
                setSelectedPayroll(value);
                setLoanForm((prev) => ({
                  ...prev,
                  IdConcept: value?.IdPayrollSinergy ?? 0,
                  conceptName: value?.namePayrollSinergy ?? "",
                }));
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Concepto"
                  required
                  fullWidth
                  size="small"
                  sx={{
                    "& .MuiInputBase-input": {
                      fontSize: 13,
                    },
                    "& .MuiInputLabel-root": {
                      fontSize: 13,
                    },
                  }}
                />
              )}
            />
            <TextField
              select
              label="Plan de deducción"
              value={loanForm.IdDeductionPlan}
              required
              fullWidth
              size="small"
              disabled={savingLoan}
              onChange={(event) => {
                const selectedId = Number(event.target.value);
                const selectedDeductionPlan = allDeductionPlans.find(
                  (item) => item.IdDeductionPlan === selectedId
                );
                setLoanForm((prev) => ({
                  ...prev,
                  IdDeductionPlan: selectedId,
                  deductionPlanName: selectedDeductionPlan?.nameDeductionPlan ?? "",
                }));
              }}
              sx={{
                "& .MuiInputBase-input": {
                  fontSize: 13,
                },
                "& .MuiInputLabel-root": {
                  fontSize: 13,
                },
              }}
            >
              <MenuItem value={0}>Seleccione</MenuItem>
              {allDeductionPlans.map((item) => (
                <MenuItem key={item.IdDeductionPlan} value={item.IdDeductionPlan}>
                  {item.nameDeductionPlan}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              select
              label="Estado"
              value={loanForm.IdLoanStatus}
              required
              fullWidth
              size="small"
              disabled={savingLoan}
              onChange={(event) => {
                const selectedId = Number(event.target.value);
                const selectedStatus = allLoanStatus.find(
                  (item) => item.IdLoanStatus === selectedId
                );
                setLoanForm((prev) => ({
                  ...prev,
                  IdLoanStatus: selectedId,
                  loanStatusName: selectedStatus?.nameLoanStatus ?? "",
                }));
              }}
              sx={{
                "& .MuiInputBase-input": {
                  fontSize: 13,
                },
                "& .MuiInputLabel-root": {
                  fontSize: 13,
                },
              }}
            >
              <MenuItem value={0}>Seleccione</MenuItem>
              {allLoanStatus.map((item) => (
                <MenuItem key={item.IdLoanStatus} value={item.IdLoanStatus}>
                  {item.nameLoanStatus}
                </MenuItem>
              ))}
            </TextField>
            <NumericFormat
              customInput={TextField}
              label={
                loanForm.isLoan
                  ? "Valor préstamo"
                  : "Valor servicio"
              }
              value={
                loanForm.isLoan
                  ? loanForm.loanAmount
                  : loanForm.serviceValue
              }
              required
              fullWidth
              size="small"
              disabled={savingLoan}
              thousandSeparator="."
              decimalSeparator=","
              decimalScale={2}
              allowNegative={false}
              valueIsNumericString
              onValueChange={(values) => {
                setLoanForm((prev) => ({
                  ...prev,
                  ...(prev.isLoan
                    ? {
                        loanAmount: values.value,
                      }
                    : {
                        serviceValue: values.value,
                      }),
                }));
              }}
              sx={{
                "& .MuiInputBase-input": {
                  fontSize: 13,
                },
                "& .MuiInputLabel-root": {
                  fontSize: 13,
                },
              }}
            />
            {loanForm.isLoan && (
              <TextField
                label="Número de cuotas"
                type="number"
                value={loanForm.numberInstallments}
                required
                fullWidth
                size="small"
                disabled={savingLoan}
                slotProps={{
                  htmlInput: {
                    step: "1",
                    min: "1",
                  },
                }}
                onChange={(event) => {
                  setLoanForm((prev) => ({
                    ...prev,
                    numberInstallments:
                      event.target.value,
                  }));
                  setLoanInstallments([]);
                  setInstallmentDrafts([]);
                }}
                sx={{
                  "& .MuiInputBase-input": {
                    fontSize: 13,
                  },
                  "& .MuiInputLabel-root": {
                    fontSize: 13,
                  },
                }}
              />
            )}
            <TextField label="Fecha solicitud" type="date" value={loanForm.requestDate} required fullWidth size="small" disabled={savingLoan} slotProps={{ inputLabel: { shrink: true, },}} onChange={(event) => setLoanForm((prev) => ({ ...prev, requestDate: event.target.value, }))} sx={{ "& .MuiInputBase-input": { fontSize: 13, }, "& .MuiInputLabel-root": { fontSize: 13, },}} />
            <TextField label="Inicio descuento" type="date" value={loanForm.startDiscountDate} required fullWidth size="small" disabled={savingLoan} slotProps={{ inputLabel: { shrink: true, },}} onChange={(event) => setLoanForm((prev) => ({ ...prev, startDiscountDate: event.target.value, }))} sx={{ "& .MuiInputBase-input": { fontSize: 13, }, "& .MuiInputLabel-root": { fontSize: 13, },}} />
            {loanForm.isLoan && ( <TextField label="Fin descuento" type="date" value={loanForm.endDiscountDate} fullWidth size="small" disabled slotProps={{ inputLabel: { shrink: true, },}} sx={{ "& .MuiInputBase-input": { fontSize: 13, }, "& .MuiInputLabel-root": { fontSize: 13, },}}/> )}
            <TextField label="Documento de cruce" value={loanForm.crossDocument} fullWidth size="small" disabled={savingLoan} onChange={(event) => setLoanForm((prev) => ({ ...prev, crossDocument: event.target.value, }))} sx={{ "& .MuiInputBase-input": { fontSize: 13, }, "& .MuiInputLabel-root": { fontSize: 13, },}} />
            {loanForm.isLoan && (  
              <Button variant="outlined" onClick={openInstallmentModal} disabled={savingLoan} sx={{ height: 40, borderColor: "#8B6A55",  color: "#4B2E1F", textTransform: "none", fontWeight: 600, "&:hover": { borderColor: "#4B2E1F", bgcolor: "rgba(75, 46, 31, 0.05)", },}}>
                Cuotas
              </Button>
            )}
          </Stack>
          <TextField label="Observación" value={loanForm.observation} fullWidth multiline minRows={1} disabled={savingLoan} onChange={(event) => setLoanForm((prev) => ({ ...prev, observation: event.target.value, }))} sx={{ "& .MuiInputBase-input": { fontSize: 13, }, "& .MuiInputLabel-root": { fontSize: 13, }, }} />
            <Stack sx={{ display: "flex", flexDirection: "row", justifyContent: "flex-end", }}>
              <Button variant="outlined" onClick={handleCreateLoan} disabled={savingLoan} sx={{ minWidth: 180, height: 40, borderColor: "#8B6A55", color: "#4B2E1F", textTransform: "none", fontWeight: 600, "&:hover": { borderColor: "#4B2E1F", bgcolor: "rgba(75, 46, 31, 0.05)", },}}>
                {savingLoan ? "Guardando..." : "Guardar préstamo"}
              </Button>
            </Stack>
        </Stack>
      </Paper>

      <Dialog open={installmentModalOpen} onClose={closeInstallmentModal} fullWidth maxWidth="sm">
        <DialogTitle sx={{ color: "#4B2E1F", fontWeight: 700, }}>
          Cuotas
        </DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            {installmentDrafts.map((item, index) => (
              <Stack key={item.installmentNumber} direction="row" spacing={1} sx={{ alignItems: "center" }}>
                <TextField
                  label={`Fecha cuota ${item.installmentNumber}`}
                  type="date"
                  value={item.commitmentDate}
                  disabled
                  fullWidth
                  size="small"
                  slotProps={{
                    inputLabel: {
                      shrink: true,
                    },
                  }}
                  sx={{
                    "& .MuiInputBase-input": { fontSize: 13 },
                    "& .MuiInputLabel-root": { fontSize: 13 },
                  }}
                />
                <NumericFormat
                  customInput={TextField}
                  label={`Valor cuota ${item.installmentNumber}`}
                  value={item.installmentValue}
                  fullWidth
                  size="small"
                  thousandSeparator="."
                  decimalSeparator=","
                  decimalScale={2}
                  allowNegative={false}
                  valueIsNumericString
                  onValueChange={(values) => {
                    setInstallmentDrafts((prev) =>
                      prev.map((installment) =>
                        installment.installmentNumber ===
                        item.installmentNumber
                          ? {
                              ...installment,
                              installmentValue: values.value,
                            }
                          : installment
                      )
                    );
                  }}
                  sx={{
                    "& .MuiInputBase-input": {
                      fontSize: 13,
                    },
                    "& .MuiInputLabel-root": {
                      fontSize: 13,
                    },
                  }}
                />
                {index === 0 && (
                  <Tooltip title="Replicar valor en todas las cuotas" arrow>
                    <IconButton
                      onClick={replicateFirstInstallmentValue}
                      sx={{
                        p: 0,
                        minWidth: "auto",
                        color: "#4B2E1F",
                        backgroundColor: "transparent",
                        "&:hover": {
                          backgroundColor: "transparent",
                          color: "#3A2318",
                        },
                      }}
                    >
                      <CheckCircleOutlineOutlinedIcon sx={{ fontSize: 34 }} />
                    </IconButton>
                  </Tooltip>
                )}
              </Stack>
            ))}
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button variant="outlined" onClick={closeInstallmentModal} sx={{ borderColor: "#8B6A55", color: "#4B2E1F", textTransform: "none", fontWeight: 600, "&:hover": { borderColor: "#4B2E1F", bgcolor: "rgba(75, 46, 31, 0.05)", },}}>
            Cancelar
          </Button>
          <Button variant="contained" onClick={acceptInstallments} sx={{ bgcolor: "#4B2E1F", color: "#FFFFFF", textTransform: "none", fontWeight: 600, "&:hover": { bgcolor: "#3A2318", },}}>
            Aceptar
          </Button>
        </DialogActions>
      </Dialog>

      <ResponseModal open={responseModal.open} severity={responseModal.severity} title={responseModal.title} message={responseModal.message} onClose={closeResponseModal} />
    </Stack>
  );
}