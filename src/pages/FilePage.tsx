import { Box, Button, CircularProgress, InputAdornment, Paper, Stack, TextField, Typography, } from "@mui/material";
import type { ResponseModalSeverity, ResponseModalState, } from "../components/common/ModalType";
import PlayCircleOutlineOutlinedIcon from "@mui/icons-material/PlayCircleOutlineOutlined";
import CleaningServicesOutlinedIcon from "@mui/icons-material/CleaningServicesOutlined";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import UploadFileOutlinedIcon from "@mui/icons-material/UploadFileOutlined";
import type { OnlyOfficeGenerateResult } from "../models/File";
import { ResponseModal } from "../components/ResponseModal";
import { getErrorMessage } from "../services/errorService";
import { fileService } from "../services/fileService";
import { useEffect, useState } from "react";

declare global {
  interface Window {
    DocsAPI?: any;
    onlyOfficeEditor?: any;
  }
}

interface FileForm {
  dateFrom: string;
  dateTo: string;
}

const emptyFileForm: FileForm = {
  dateFrom: "",
  dateTo: "",
};

const emptyResponseModal: ResponseModalState = {
  open: false,
  severity: "info",
  title: "",
  message: "",
};

const loadOnlyOfficeScript = (documentServerUrl: string): Promise<void> => {
  return new Promise((resolve, reject) => { const existingScript = document.getElementById("onlyoffice-api-script");

    if (existingScript) {
      resolve();
      return;
    }

    const cleanUrl = documentServerUrl.replace(/\/$/, "");
    const script = document.createElement("script");

    script.id = "onlyoffice-api-script";
    script.src = `${cleanUrl}/web-apps/apps/api/documents/api.js`;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("No se pudo cargar OnlyOffice."));

    document.body.appendChild(script);
  });
};

const destroyOnlyOfficeEditor = () => {
  if (window.onlyOfficeEditor) {
    window.onlyOfficeEditor.destroyEditor();
    window.onlyOfficeEditor = undefined;
  }
};

export function FilePage() {
  const [onlyOfficeData, setOnlyOfficeData] = useState<OnlyOfficeGenerateResult | null>(null);
  const [responseModal, setResponseModal] = useState<ResponseModalState>(emptyResponseModal);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileForm, setFileForm] = useState<FileForm>(emptyFileForm);
    const [viewerRenderKey, setViewerRenderKey] = useState(0);
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

  useEffect(() => {
    if (!onlyOfficeData) {
      return;
    }

    let isMounted = true;

    const openOnlyOfficeViewer = async () => {
      try {
        await loadOnlyOfficeScript(onlyOfficeData.documentServerUrl);

        if (!isMounted) {
          return;
        }

        if (!window.DocsAPI) {
          throw new Error("OnlyOffice DocsAPI no está disponible.");
        }

        destroyOnlyOfficeEditor();

        window.onlyOfficeEditor = new window.DocsAPI.DocEditor(
          "onlyoffice-editor",
          onlyOfficeData.config
        );
      } catch (err) {
        showResponseModal("error", "Error al cargar visor", getErrorMessage(err));
      }
    };

    openOnlyOfficeViewer();

    return () => {
      isMounted = false;
    };
  }, [onlyOfficeData, viewerRenderKey]);

  useEffect(() => {
    return () => {
      destroyOnlyOfficeEditor();
    };
  }, []);

  const handleGenerate = async () => {
    try {
      setLoading(true);
      setOnlyOfficeData(null);
      destroyOnlyOfficeEditor();

      const response = await fileService.generate({
        file: selectedFile!,
        dateFrom: fileForm.dateFrom,
        dateTo: fileForm.dateTo,
      });

      setOnlyOfficeData(response.result!);
      setViewerRenderKey((prev) => prev + 1);

      showResponseModal(
        response.isSuccess ? "success" : "warning",
        response.isSuccess ? "Archivo generado" : "No se pudo generar",
        response.Message || "Proceso finalizado."
      );
    } catch (err) {
      showResponseModal("error", "Error al generar reporte", getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const handleClean = () => {
    destroyOnlyOfficeEditor();
    setSelectedFile(null);
    setFileForm(emptyFileForm);
    setOnlyOfficeData(null);

    const input = document.getElementById(
      "sinergy-file-input"
    ) as HTMLInputElement | null;

    if (input) {
      input.value = "";
    }
  };

  return (
    <Stack spacing={3}>
      <Stack sx={{ display: "flex", flexDirection: "row", gap: 1.5, alignItems: "center", }}>
        <UploadFileOutlinedIcon sx={{ color: "#4B2E1F", fontSize: 30 }} />
        <Typography sx={{ color: "#4B2E1F", fontSize: 26, fontWeight: 700, }}>
          Integración Sinergy
        </Typography>
      </Stack>
      <Paper elevation={0} sx={{ border: "1px solid #E0CDBB", borderRadius: 2, p: 3, }}>
        <Stack spacing={2.5}>
          <Typography sx={{ color: "#4B2E1F", fontSize: 18, fontWeight: 700, }}>
            Generar reporte
          </Typography>
          <Stack sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "repeat(2, minmax(0, 1fr))", md: "1.5fr 1fr 1fr auto", }, gap: 1.5, alignItems: "center", }}>
            <Button variant="outlined" component="label" disabled={loading} startIcon={<DescriptionOutlinedIcon />} sx={{ height: 40, borderColor: "#8B6A55", color: "#4B2E1F", textTransform: "none", fontWeight: 600, justifyContent: "flex-start", overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis", "&:hover": { borderColor: "#4B2E1F", bgcolor: "rgba(75, 46, 31, 0.05)", },}}>
              {selectedFile ? selectedFile.name : "Seleccionar archivo Excel"}
              <input id="sinergy-file-input" type="file" accept=".xlsx" hidden onChange={(event) => { const file = event.target.files?.[0] ?? null; setSelectedFile(file); setOnlyOfficeData(null); destroyOnlyOfficeEditor(); }} />
            </Button>
            <TextField
              label="Fecha desde"
              type="date"
              value={fileForm.dateFrom}
              fullWidth
              size="small"
              disabled={loading}
              slotProps={{
                inputLabel: {
                  shrink: true,
                },
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <CalendarMonthOutlinedIcon sx={{ color: "#8B6A55" }} />
                    </InputAdornment>
                  ),
                },
              }}
              onChange={(event) =>
                setFileForm((prev) => ({
                  ...prev,
                  dateFrom: event.target.value,
                }))
              }
            />
            <TextField
              label="Fecha hasta"
              type="date"
              value={fileForm.dateTo}
              fullWidth
              size="small"
              disabled={loading}
              slotProps={{
                inputLabel: {
                  shrink: true,
                },
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <CalendarMonthOutlinedIcon sx={{ color: "#8B6A55" }} />
                    </InputAdornment>
                  ),
                },
              }}
              onChange={(event) =>
                setFileForm((prev) => ({
                  ...prev,
                  dateTo: event.target.value,
                }))
              }
            />
            <Stack sx={{ display: "flex", flexDirection: "row", gap: 1, justifyContent: "flex-end", }}>
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
      {onlyOfficeData && (
        <Paper elevation={0} sx={{ border: "1px solid #E0CDBB", borderRadius: 2, p: 2, height: "calc(100vh - 280px)", minHeight: "750px", display: "flex", flexDirection: "column", }}>
          <Typography sx={{ color: "#4B2E1F", fontSize: 18, fontWeight: 700, mb: 2, flexShrink: 0, }}>
            Vista previa del Excel generado
          </Typography>
          <Box sx={{ flex: 1, minHeight: 0, width: "100%", border: "1px solid #C9A98E", borderRadius: 1, overflow: "hidden", bgcolor: "#FFFFFF", }}>
            <Box key={viewerRenderKey} id="onlyoffice-editor" sx={{ width: "100%", height: "100%", minHeight: "700px", overflow: "hidden", bgcolor: "#FFFFFF", "& iframe": { width: "100% !important", height: "100% !important", }, "& > div": { width: "100% !important", height: "100% !important", },}} />
          </Box>
        </Paper>
      )}

      <ResponseModal open={responseModal.open} severity={responseModal.severity} title={responseModal.title} message={responseModal.message} onClose={closeResponseModal} />
    </Stack>
  );
}