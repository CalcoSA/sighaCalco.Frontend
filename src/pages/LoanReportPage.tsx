import { Box, Button, CircularProgress, InputAdornment, Paper, Stack, Table, TableBody, TableCell, TableHead, TableRow, TextField, Typography } from "@mui/material";
import type { ResponseModalSeverity, ResponseModalState } from "../components/common/ModalType";
import PlayCircleOutlineOutlinedIcon from "@mui/icons-material/PlayCircleOutlineOutlined";
import CleaningServicesOutlinedIcon from "@mui/icons-material/CleaningServicesOutlined";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";
import AssessmentOutlinedIcon from "@mui/icons-material/SummarizeOutlined";
import { ResponseModal } from "../components/ResponseModal";
import { getErrorMessage } from "../services/errorService";
import { loanService } from "../services/loanService";
import type { LoanReport } from "../models/Loan";
import { useState } from "react";
import ExcelJS from "exceljs";

interface LoanReportFilters {
  dateFrom: string;
  dateTo: string;
}

const emptyFilters: LoanReportFilters = {
  dateFrom: "",
  dateTo: "",
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

  return Number(value).toLocaleString("es-CO", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};

const getApplicableFortnight = (IdDeductionPlan: number) => {
  switch (IdDeductionPlan) {
    case 1:
      return 3;
    case 2:
      return 1;
    case 3:
      return 2;
    default:
      return "";
  }
};

const formatDateForExcel = (value: string | null) => {
  if (!value) return "";

  const [year, month, day] = value.split("-");

  if (!year || !month || !day) {
    return "";
  }

  return `${day}/${month}/${year}`;
};

export function LoanReportPage() {
  const [responseModal, setResponseModal] = useState<ResponseModalState>(emptyResponseModal);
  const [filters, setFilters] = useState<LoanReportFilters>(emptyFilters);
  const [report, setReport] = useState<LoanReport[]>([]);
  const [exporting, setExporting] = useState(false);
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

  const handleGenerate = async () => {

    if (!filters.dateFrom) {
      showResponseModal("warning", "Fecha requerida", "Debe seleccionar la fecha desde.");
      return;
    }

    if (!filters.dateTo) {
      showResponseModal("warning", "Fecha requerida", "Debe seleccionar la fecha hasta.");
      return;
    }

    if (filters.dateFrom > filters.dateTo) {
      showResponseModal("warning", "Rango de fechas inválido", "La fecha desde no puede ser mayor a la fecha hasta.");
      return;
    }

    try {

      setLoading(true);
      const response = await loanService.getReport({ dateFrom: filters.dateFrom, dateTo: filters.dateTo });
      const data = response.result ?? [];
      setReport(data);

      if (data.length === 0) {
        showResponseModal("warning", "Sin resultados", response.Message || "No existen registros para el rango de fechas seleccionado.");
      }

    } catch (err) {
      setReport([]);
      showResponseModal("error", "Error al generar reporte", getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const handleClean = () => {
    setFilters(emptyFilters);
    setReport([]);
  };

  const handleExportExcel = async () => {

    if (report.length === 0) {
      showResponseModal("warning", "Sin información", "Debe generar primero el reporte antes de exportarlo.");
      return;
    }

    try {
      setExporting(true);

      const templateUrl = `${import.meta.env.BASE_URL}templates/Template_1.xlsx`;
      const templateResponse = await fetch(templateUrl);

      if (!templateResponse.ok) {
        throw new Error("No fue posible cargar la plantilla Template_1.xlsx.");
      }

      const templateBuffer = await templateResponse.arrayBuffer();
      const workbook = new ExcelJS.Workbook();

      await workbook.xlsx.load(templateBuffer);

      const fixedWorksheet = workbook.getWorksheet("Deducciones Fijas");
      const occasionalWorksheet = workbook.getWorksheet("Deducciones Ocasionales");

      if (!fixedWorksheet) {
        throw new Error("La hoja 'Deducciones Fijas' no existe en Template_1.xlsx.");
      }

      if (!occasionalWorksheet) {
        throw new Error("La hoja 'Deducciones Ocasionales' no existe en Template_1.xlsx.");
      }

      const occasionalReport = report.filter((item) => item.isLoan && Number(item.numberInstallments) === 1);
      const fixedReport = report.filter((item) => !item.isLoan || Number(item.numberInstallments) !== 1);

      for (let rowNumber = 2; rowNumber <= fixedWorksheet.rowCount; rowNumber++) {
        for (let columnNumber = 1; columnNumber <= 12; columnNumber++) {
          fixedWorksheet.getCell(rowNumber, columnNumber).value = null;
        }
      }

      for (let rowNumber = 2; rowNumber <= occasionalWorksheet.rowCount; rowNumber++) {
        for (let columnNumber = 1; columnNumber <= 8; columnNumber++) {
          occasionalWorksheet.getCell(rowNumber, columnNumber).value = null;
        }
      }

      const firstDataRow = 2;
      const templateLastRow = 51;
      const fixedTemplateCapacity = templateLastRow - firstDataRow + 1;

      if (fixedReport.length > fixedTemplateCapacity) {
        const sourceRow = fixedWorksheet.getRow(firstDataRow);

        for (let index = fixedTemplateCapacity; index < fixedReport.length; index++) {
          const rowNumber = firstDataRow + index;
          const targetRow = fixedWorksheet.getRow(rowNumber);

          targetRow.height = sourceRow.height;

          for (let columnNumber = 1; columnNumber <= 12; columnNumber++) {
            const sourceCell = sourceRow.getCell(columnNumber);
            const targetCell = targetRow.getCell(columnNumber);

            targetCell.style = JSON.parse(JSON.stringify(sourceCell.style));

            if (sourceCell.dataValidation) {
              targetCell.dataValidation = JSON.parse(JSON.stringify(sourceCell.dataValidation));
            }
          }
        }
      }

      const occasionalTemplateCapacity = templateLastRow - firstDataRow + 1;

      if (occasionalReport.length > occasionalTemplateCapacity) {
        const sourceRow = occasionalWorksheet.getRow(firstDataRow);

        for (let index = occasionalTemplateCapacity; index < occasionalReport.length; index++) {
          const rowNumber = firstDataRow + index;
          const targetRow = occasionalWorksheet.getRow(rowNumber);

          targetRow.height = sourceRow.height;

          for (let columnNumber = 1; columnNumber <= 8; columnNumber++) {
            const sourceCell = sourceRow.getCell(columnNumber);
            const targetCell = targetRow.getCell(columnNumber);

            targetCell.style = JSON.parse(JSON.stringify(sourceCell.style));

            if (sourceCell.dataValidation) {
              targetCell.dataValidation = JSON.parse(JSON.stringify(sourceCell.dataValidation));
            }
          }
        }
      }

      fixedReport.forEach(
        (item, index) => {
          const rowNumber = index + 2;

          const totalValue = item.isLoan ? item.loanAmount : item.serviceValue;
          const applicableFortnight = getApplicableFortnight(item.IdDeductionPlan);
          const employeeCell = fixedWorksheet.getCell(`A${rowNumber}`);
          employeeCell.value = Number(item.employeeDocumentNumber);
          employeeCell.numFmt = "0";
          fixedWorksheet.getCell(`B${rowNumber}`).value = item.employeeFullName;
          fixedWorksheet.getCell(`C${rowNumber}`).value = item.action;
          const conceptCell = fixedWorksheet.getCell(`D${rowNumber}`);
          conceptCell.value = Number(item.IdConcept);
          conceptCell.numFmt = "0";
          fixedWorksheet.getCell(`E${rowNumber}`).value = item.conceptName;
          const startDateCell = fixedWorksheet.getCell(`F${rowNumber}`);
          startDateCell.value = formatDateForExcel(item.startDiscountDate);
          startDateCell.numFmt = "@";
          const endDateCell = fixedWorksheet.getCell(`G${rowNumber}`);
          endDateCell.value = formatDateForExcel(item.endDiscountDate);
          endDateCell.numFmt = "@";
          const totalCell = fixedWorksheet.getCell(`H${rowNumber}`);
          totalCell.value = totalValue !== null && totalValue !== undefined ? Number(totalValue) : null;
          totalCell.numFmt = "0.##";
          const installmentCell = fixedWorksheet.getCell(`I${rowNumber}`);
          installmentCell.value =
            item.isLoan &&
            item.installmentValue !== null &&
            item.installmentValue !== undefined
              ? Number(item.installmentValue)
              : null;
          installmentCell.numFmt = "0.##";
          const installmentCountCell = fixedWorksheet.getCell(`J${rowNumber}`);
          installmentCountCell.value =
            item.isLoan &&
            item.numberInstallments !== null &&
            item.numberInstallments !== undefined
              ? Number(item.numberInstallments)
              : null;
          installmentCountCell.numFmt = "0";
          const fortnightCell = fixedWorksheet.getCell(`K${rowNumber}`);
          fortnightCell.value = applicableFortnight;
          fortnightCell.numFmt = "0";
          fixedWorksheet.getCell(`L${rowNumber}`).value = "";
        }
      );

      occasionalReport.forEach(
        (item, index) => {
          const rowNumber = index + 2;

          const employeeCell = occasionalWorksheet.getCell(`A${rowNumber}`);
          employeeCell.value = Number(item.employeeDocumentNumber);
          employeeCell.numFmt = "0";
          occasionalWorksheet.getCell(`B${rowNumber}`).value = item.employeeFullName;
          const conceptCell = occasionalWorksheet.getCell(`C${rowNumber}`);
          conceptCell.value = Number(item.IdConcept);
          conceptCell.numFmt = "0";
          occasionalWorksheet.getCell(`D${rowNumber}`).value = item.conceptName;
          const startDateCell = occasionalWorksheet.getCell(`E${rowNumber}`);
          startDateCell.value = formatDateForExcel(item.startDiscountDate);
          startDateCell.numFmt = "@";
          const endDateCell = occasionalWorksheet.getCell(`F${rowNumber}`);
          endDateCell.value = formatDateForExcel(item.endDiscountDate);
          endDateCell.numFmt = "@";
          const valueCell = occasionalWorksheet.getCell(`G${rowNumber}`);
          valueCell.value =
            item.loanAmount !== null &&
            item.loanAmount !== undefined
              ? Number(item.loanAmount)
              : null;
          valueCell.numFmt = "0.##";
          occasionalWorksheet.getCell(`H${rowNumber}`).value = "";
        }
      );

      const excelBuffer = await workbook.xlsx.writeBuffer();

      const blob = new Blob(
        [excelBuffer as BlobPart],
        {
          type:
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        }
      );

      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");

      link.href = url;
      link.download = `Template_1_${filters.dateFrom}_${filters.dateTo}.xlsx`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

    } catch (err) {
      showResponseModal("error", "Error al exportar", getErrorMessage(err));
    } finally {
      setExporting(false);
    }
  };

  return (
    <Stack spacing={3}>
      <Stack sx={{ flexDirection: { xs: "column", md: "row" }, alignItems: { xs: "stretch", md: "center" }, justifyContent: "space-between", gap: 1.5, }}>
        <Stack direction="row" spacing={1.5} sx={{ alignItems: "center", }}>
          <AssessmentOutlinedIcon sx={{ color: "#4B2E1F", fontSize: 30, }} />
          <Typography sx={{ color: "#4B2E1F", fontSize: 26, fontWeight: 700, }}>
            Reportes
          </Typography>
        </Stack>
        <Button
          variant="outlined"
          startIcon={
            exporting ? (
              <CircularProgress size={16} />
            ) : (
              <FileDownloadOutlinedIcon />
            )
          }
          onClick={handleExportExcel}
          disabled={ loading || exporting || report.length === 0 }
          sx={{
            width: { xs: "100%", md: "auto" },
            height: 40,
            borderColor: "#8B6A55",
            color: "#4B2E1F",
            textTransform: "none",
            fontWeight: 600,
            minWidth: 120,
            "&:hover": {
              borderColor: "#4B2E1F",
              bgcolor: "rgba(75, 46, 31, 0.05)",
            },
          }}
        >
          {exporting ? "Exportando..." : "Exportar"}
        </Button>
      </Stack>
      <Paper elevation={0} sx={{ border: "1px solid #E0CDBB", borderRadius: 2, p: 3, }}>
        <Stack spacing={2.5}>
          <Typography sx={{ color: "#4B2E1F", fontSize: 18, fontWeight: 700, }}>
            Generar reporte
          </Typography>
          <Stack sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", lg: "1fr 1fr auto", }, gap: 1.5, alignItems: "center", }}>
            <TextField
              label="Fecha desde"
              type="date"
              value={filters.dateFrom}
              fullWidth
              size="small"
              disabled={loading}
              slotProps={{
                inputLabel: { shrink: true, },
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <CalendarMonthOutlinedIcon sx={{ color: "#8B6A55", }} />
                    </InputAdornment>
                  ),
                },
              }}
              onChange={(event) =>
                setFilters((prev) => ({
                  ...prev,
                  dateFrom: event.target.value,
                }))
              }
            />
            <TextField
              label="Fecha hasta"
              type="date"
              value={filters.dateTo}
              fullWidth
              size="small"
              disabled={loading}
              slotProps={{
                inputLabel: { shrink: true, },
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <CalendarMonthOutlinedIcon sx={{ color: "#8B6A55", }} />
                    </InputAdornment>
                  ),
                },
              }}
              onChange={(event) =>
                setFilters((prev) => ({
                  ...prev,
                  dateTo: event.target.value,
                }))
              }
            />
            <Stack sx={{ flexDirection: { xs: "column", md: "row" }, gap: 1, justifyContent: "flex-end", width: "100%", }}>
              <Button
                variant="outlined"
                startIcon={
                  loading ? (
                    <CircularProgress size={16} />
                  ) : (
                    <PlayCircleOutlineOutlinedIcon />
                  )
                }
                onClick={handleGenerate}
                disabled={loading}
                sx={{
                  width: { xs: "100%", md: "auto" },
                  height: 40,
                  borderColor: "#8B6A55",
                  color: "#4B2E1F",
                  textTransform: "none",
                  fontWeight: 600,
                  minWidth: 120,
                  "&:hover": {
                    borderColor: "#4B2E1F",
                    bgcolor: "rgba(75, 46, 31, 0.05)",
                  },
                }}
              >
                {loading ? "Generando..." : "Generar"}
              </Button>
              <Button
                variant="outlined"
                startIcon={<CleaningServicesOutlinedIcon />}
                onClick={handleClean}
                disabled={loading}
                sx={{
                  width: { xs: "100%", md: "auto" },
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
      {loading ? (
        <Paper elevation={0} sx={{ border: "1px solid #E0CDBB", borderRadius: 2, py: 6, display: "flex", justifyContent: "center", }}>
          <CircularProgress sx={{ color: "#4B2E1F", }} />
        </Paper>
      ) : report.length > 0 ? (
        <Paper elevation={0} sx={{ border: "1px solid #E0CDBB", borderRadius: 2, overflow: "hidden", }}>
          <Box sx={{ width: "100%", overflowX: "auto", WebkitOverflowScrolling: "touch", }}>
            <Table sx={{ minWidth: 1200, }}>
              <TableHead>
                <TableRow sx={{ bgcolor: "#F7E8D8", }}>
                  <TableCell sx={{ fontWeight: 700, color: "#4B2E1F", }}>
                    EMPLEADO
                  </TableCell>
                  <TableCell sx={{ fontWeight: 700, color: "#4B2E1F", }}>
                    NOMBRE COMPLETO
                  </TableCell>
                  <TableCell sx={{ fontWeight: 700, color: "#4B2E1F", }}>
                    ACCIÓN
                  </TableCell>
                  <TableCell sx={{ fontWeight: 700, color: "#4B2E1F", }}>
                    CÓDIGO CONCEPTO
                  </TableCell>
                  <TableCell sx={{ fontWeight: 700, color: "#4B2E1F", }}>
                    DESCRIPCIÓN CONCEPTO
                  </TableCell>
                  <TableCell sx={{ fontWeight: 700, color: "#4B2E1F", }}>
                    FECHA INICIO
                  </TableCell>
                  <TableCell sx={{ fontWeight: 700, color: "#4B2E1F", }}>
                    FECHA FINAL
                  </TableCell>
                  <TableCell align="center" sx={{ fontWeight: 700, color: "#4B2E1F", }}>
                    VALOR TOTAL
                  </TableCell>
                  <TableCell align="center" sx={{ fontWeight: 700, color: "#4B2E1F", }}>
                    VALOR CUOTA
                  </TableCell>
                  <TableCell align="center" sx={{ fontWeight: 700, color: "#4B2E1F", }}>
                    N° CUOTAS
                  </TableCell>
                  <TableCell sx={{ fontWeight: 700, color: "#4B2E1F", }}>
                    QUINCENA APLICATBLE
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {report.map(
                  (item, index) => (
                    <TableRow key={`${item.employeeDocumentNumber}-${item.IdConcept}-${index}`} hover>
                      <TableCell> {item.employeeDocumentNumber} </TableCell>
                      <TableCell> {item.employeeFullName} </TableCell>
                      <TableCell> {item.action} </TableCell>
                      <TableCell> {item.IdConcept} </TableCell>
                      <TableCell> {item.conceptName} </TableCell>
                      <TableCell> {item.startDiscountDate} </TableCell>
                      <TableCell> {item.endDiscountDate ?? ""} </TableCell>
                      <TableCell align="right">
                        {formatMoney(
                          item.isLoan
                            ? item.loanAmount
                            : item.serviceValue
                        )}
                      </TableCell>
                      <TableCell align="right">
                        {item.isLoan
                          ? formatMoney(item.installmentValue)
                          : ""}
                      </TableCell>
                      <TableCell align="center">
                        {item.isLoan
                          ? item.numberInstallments
                          : ""}
                      </TableCell>
                      <TableCell> {getApplicableFortnight(item.IdDeductionPlan)} </TableCell>
                    </TableRow>
                  )
                )}
              </TableBody>
            </Table>
          </Box>
        </Paper>
      ) : null}

      <ResponseModal open={responseModal.open} severity={responseModal.severity} title={responseModal.title} message={responseModal.message} onClose={closeResponseModal} />
    </Stack>
  );
}