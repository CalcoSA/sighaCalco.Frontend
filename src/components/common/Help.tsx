import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Divider, IconButton, Stack, Typography, } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import HelpOutlineOutlinedIcon from "@mui/icons-material/HelpOutlineOutlined";

interface SinergyHelpDialogProps {
  open: boolean;
  onClose: () => void;
}

export function HelpDialog({ open, onClose }: SinergyHelpDialogProps) {

  return (    
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth scroll="paper" slotProps={{ paper: { sx: { borderRadius: 3, overflow: "hidden", bgcolor: "#FFFDF8", },},}}>
      <DialogTitle sx={{ bgcolor: "#4B2E1F", color: "#F7E8D8", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 2, py: 2, }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.2 }}>
          <HelpOutlineOutlinedIcon />
          <Typography sx={{ fontSize: 20, fontWeight: 700 }}>
            Ayuda - Integración Sinergy
          </Typography>
        </Box>
        <IconButton onClick={onClose} aria-label="Cerrar ayuda" sx={{ color: "#F7E8D8", "&:hover": { bgcolor: "rgba(247, 232, 216, 0.12)", },}}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers sx={{ px: 3, py: 2.5, maxHeight: "70vh", color: "#4B2E1F", }}>
        <Stack spacing={2.5}>
          <Divider />
          <HelpSection
            number="1"
            title="Preparar el archivo maestro"
            description="Antes de generar el reporte, valida que el archivo corresponda al maestro de empleados y que contenga las columnas requeridas para la transformación. El sistema toma la información directamente desde el archivo cargado, por lo tanto, los nombres de las columnas deben coincidir con los definidos para la integración."
          />
          <HelpSection
            number="2"
            title="Formato permitido"
            description="Solo se permiten archivos de Excel con extensión .xlsx. No se deben cargar archivos .csv, PDF, imágenes u otros formatos, porque el sistema no los procesa para esta integración."
          />
          <HelpSection
            number="3"
            title="Seleccionar el rango de fechas"
            description="Debes diligenciar la Fecha desde y la Fecha hasta. El sistema usará ese rango para filtrar los registros del maestro según la fecha de ingreso definida en el archivo."
          />
          <HelpSection
            number="4"
            title="Generar el reporte"
            description="Después de seleccionar el archivo y completar el rango de fechas, presiona el botón Generar. El sistema procesará el Excel, aplicará las transformaciones necesarias y mostrará una vista previa del documento generado."
          />
          <HelpSection
            number="5"
            title="Revisar el documento generado"
            description="Cuando el proceso finalice, se abrirá la vista previa del archivo generado en ONLYOFFICE. Desde allí puedes revisar las hojas del documento, validar los datos generados y moverte por el archivo usando las barras de desplazamiento horizontal y vertical."
          />
          <HelpSection
            number="6"
            title="Moverse en ONLYOFFICE"
            description="La vista de ONLYOFFICE es de solo lectura. Puedes cambiar entre hojas usando las pestañas inferiores, desplazarte por filas y columnas, usar el zoom, buscar información dentro del documento y revisar el contenido generado sin modificarlo."
          />
          <HelpSection
            number="7"
            title="Descargar el documento"
            description="Para descargar el archivo generado, usa el botón de descarga ubicado en la parte superior derecha del visor de ONLYOFFICE. El archivo descargado corresponde al Excel generado por el sistema."
          />
          <HelpSection
            number="8"
            title="Botón Limpiar"
            description="El botón Limpiar borra el archivo seleccionado, las fechas ingresadas y la vista previa generada. Úsalo cuando necesites cargar otro maestro o iniciar nuevamente el proceso."
          />
        </Stack>
      </DialogContent>
      <DialogActions sx={{ px: 3, py: 2, bgcolor: "#FFFDF8", }}>
        <Button variant="contained" onClick={onClose} sx={{ bgcolor: "#4B2E1F", color: "#FFFFFF", textTransform: "none", fontWeight: 700, px: 3, "&:hover": { bgcolor: "#3A2418", },}}>
          Entendido
        </Button>
      </DialogActions>
    </Dialog>
  );
}

interface HelpSectionProps {
  number: string;
  title: string;
  description: string;
}

function HelpSection({ number, title, description }: HelpSectionProps) {

  return (
    <Box sx={{ border: "1px solid #E0CDBB", borderRadius: 2, p: 2, bgcolor: "#FFFDF8", }}>
      <Box sx={{ display: "flex", flexDirection: "row", gap: 2, alignItems: "flex-start", }}>
        <Box sx={{ width: 34, height: 34, borderRadius: "50%", bgcolor: "#4B2E1F", color: "#FFFFFF", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, flexShrink: 0, }}>
          {number}
        </Box>
        <Box>
          <Typography sx={{ fontSize: 15, fontWeight: 700, mb: 0.5 }}>
            {title}
          </Typography>
          <Typography sx={{ fontSize: 14, lineHeight: 1.65, color: "#6B4A38" }}>
            {description}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}