import { Box, Button, Chip, Dialog, DialogActions, DialogContent, DialogTitle, Divider, IconButton, Paper, Stack, Typography, } from "@mui/material";
import ChevronRightOutlinedIcon from "@mui/icons-material/ChevronRightOutlined";
import ArrowBackOutlinedIcon from "@mui/icons-material/ArrowBackOutlined";
import { useAuth } from "../../context/AuthContext";
import CloseIcon from "@mui/icons-material/Close";
import { useEffect, useState } from "react";

interface HelpDialogProps {
  open: boolean;
  onClose: () => void;
}

type HelpTopic =
  | "create-loan"
  | "loan-management"
  | "sinergy"
  | null;

interface HelpMenuItem {
  id: Exclude<HelpTopic, null>;
  title: string;
  path: string;
}

const helpMenuItems: HelpMenuItem[] = [
  {
    id: "create-loan",
    title: "Crear préstamo",
    path: "/cuotas-prestamos/prestamo",
  },
  {
    id: "loan-management",
    title: "Gestión de préstamos",
    path: "/cuotas-prestamos/prestamos",
  },
  {
    id: "sinergy",
    title: "Integración Sinergy",
    path: "/integracion/sinergy",
  },
];


export function HelpDialog({ open, onClose}: HelpDialogProps) {
  const [selectedTopic, setSelectedTopic] = useState<HelpTopic>(null);
  const { hasPermission } = useAuth();
  const allowedHelpItems = helpMenuItems.filter((item) => hasPermission(item.path));

  useEffect(() => {
    if (open) {
      setSelectedTopic(null);
    }
  }, [open]);

  const handleBack = () => {
    setSelectedTopic(null);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth scroll="paper" slotProps={{ paper: { sx: { borderRadius: 3, overflow: "hidden", bgcolor: "#FFFDF8", },},}}>
      <DialogTitle sx={{ bgcolor: "#4B2E1F", color: "#F7E8D8", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 2, py: 2, }}>
        <Typography sx={{ fontSize: 20, fontWeight: 700, }}>
          Ayuda del sistema
        </Typography>
        <IconButton onClick={onClose} aria-label="Cerrar ayuda" sx={{ color: "#F7E8D8", "&:hover": { bgcolor: "rgba(247, 232, 216, 0.12)", },}}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers sx={{ px: 3, py: 2.5, maxHeight: "72vh", color: "#4B2E1F", }}>
        {selectedTopic === null && (
          <HelpMenu items={allowedHelpItems} onSelect={setSelectedTopic} />
        )}
        {selectedTopic === "create-loan" && (
          <CreateLoanHelp onBack={handleBack} />
        )}
        {selectedTopic === "loan-management" && (
          <LoanManagementHelp onBack={handleBack} />
        )}
        {selectedTopic === "sinergy" && (
          <SinergyHelp onBack={handleBack} />
        )}
      </DialogContent>
      <DialogActions sx={{ px: 3, py: 2, bgcolor: "#FFFDF8", }}>
        <Button variant="contained" onClick={onClose} sx={{ bgcolor: "#4B2E1F", color: "#FFFFFF", textTransform: "none", fontWeight: 700, px: 3, "&:hover": { bgcolor: "#3A2418", },}}>
          Cerrar
        </Button>
      </DialogActions>
    </Dialog>
  );
}

interface HelpMenuProps {
  items: HelpMenuItem[];
  onSelect: (topic: Exclude<HelpTopic, null>) => void;
}

function HelpMenu({items, onSelect}: HelpMenuProps) {
  return (
    <Stack spacing={2.5}>
      <Box>
        <Typography sx={{ fontSize: 18, fontWeight: 700, mb: 0.5, }}>
          ¿En qué podemos ayudarte?
        </Typography>
        <Typography sx={{ fontSize: 14, lineHeight: 1.6, color: "#6B4A38", }}>
          Selecciona una opción para consultar la guía de funcionamiento del módulo.
        </Typography>
      </Box>
      <Stack spacing={1.5}>
        {items.map((item) => (
          <Paper key={item.id} elevation={0} onClick={() => onSelect(item.id)} sx={{ border: "1px solid #E0CDBB", borderRadius: 2, px: 2, py: 1.8, cursor: "pointer", transition: "all 0.15s ease", bgcolor: "#FFFFFF", "&:hover": { borderColor: "#8B6A55", bgcolor: "rgba(247, 232, 216, 0.35)", },}}>
            <Stack direction="row" spacing={2} sx={{ alignItems: "center", justifyContent: "space-between", }}>
              <Typography sx={{ fontSize: 16, fontWeight: 700, color: "#4B2E1F", }}>
                {item.title}
              </Typography>
              <ChevronRightOutlinedIcon sx={{ color: "#8B6A55", }} />
            </Stack>
          </Paper>
        ))}
        {items.length === 0 && (
          <Paper elevation={0} sx={{ border: "1px solid #E0CDBB", borderRadius: 2, p: 3, textAlign: "center", }}>
            <Typography sx={{ fontSize: 14, color: "#6B4A38", }}>
              No tienes módulos de ayuda disponibles según los permisos asignados.
            </Typography>
          </Paper>
        )}
      </Stack>
    </Stack>
  );
}

interface HelpTopicHeaderProps {
  title: string;
  path: string;
  onBack: () => void;
}

function HelpTopicHeader({title, onBack}: HelpTopicHeaderProps) {
  return (
    <Stack spacing={1.5}>
      <Stack direction="row" sx={{ alignItems: "center", justifyContent: "space-between", gap: 2, }}>
        <Typography sx={{ fontSize: 20, fontWeight: 700 }}>
          {title}
        </Typography>
        <Button variant="text" startIcon={ <ArrowBackOutlinedIcon /> } onClick={onBack} sx={{ alignSelf: "flex-start", color: "#4B2E1F", textTransform: "none", fontWeight: 700, px: 0, "&:hover": { bgcolor: "transparent", color: "#8B6A55", },}}>
          Volver
        </Button>
      </Stack>
      <Typography sx={{ fontSize: 13, lineHeight: 1.6, color: "#6B4A38", }}>
        El acceso a esta funcionalidad depende de los
        roles y permisos asignados al usuario. Si la
        opción no aparece en el menú principal del
        sistema, es posible que tu perfil no tenga el
        permiso correspondiente.
      </Typography>
      <Divider />
    </Stack>
  );
}

interface HelpSectionProps {
  number: string;
  title: string;
  children: React.ReactNode;
}

function HelpSection({number, title, children}: HelpSectionProps) {
  return (
    <Paper elevation={0} sx={{ border: "1px solid #E0CDBB", borderRadius: 2, p: 2, bgcolor: "#FFFFFF", }}>
      <Stack direction="row" spacing={2} sx={{ alignItems: "flex-start", }}>
        <Box sx={{ width: 34, height: 34, borderRadius: "50%", bgcolor: "#4B2E1F", color: "#FFFFFF", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, flexShrink: 0, }}>
          {number}
        </Box>
        <Box sx={{ flex: 1 }}>
          <Typography sx={{ fontSize: 15, fontWeight: 700, mb: 0.8, }}>
            {title}
          </Typography>
          <Box
            sx={{
              fontSize: 14,
              lineHeight: 1.65,
              color: "#6B4A38",
              "& p": {
                margin: 0,
              },
              "& ul": {
                mt: 1,
                mb: 0,
                pl: 2.5,
              },
              "& li": {
                mb: 0.6,
              },
            }}
          >
            {children}
          </Box>
        </Box>
      </Stack>
    </Paper>
  );
}

function LoanStatusExplanation() {
  return (
    <Stack spacing={1.5} sx={{ mt: 1 }}>
      <Box>
        <Chip label="Activo" size="small" sx={{ bgcolor: "#E8F5E9", color: "#2E7D32", fontWeight: 600, mb: 0.7, }} />
        <Typography component="p">
          Corresponde a un préstamo habilitado para ser
          procesado y descontado de acuerdo con su plan
          de deducción y las fechas establecidas.
        </Typography>
      </Box>
      <Box>
        <Chip label="Inactivo" size="small" sx={{ bgcolor: "#FFEBEE", color: "#C62828", fontWeight: 600, mb: 0.7, }} />
        <Typography component="p">
          Corresponde a un préstamo registrado que aún
          no debe iniciar descuentos. El préstamo podrá
          activarse cuando llegue la fecha y la quincena
          correspondiente para iniciar el descuento.
        </Typography>
      </Box>
      <Box>
        <Chip label="Suspendido" size="small" sx={{ bgcolor: "#FFF4E5", color: "#ED6C02", fontWeight: 600, mb: 0.7, }} />
        <Typography component="p">
          Indica que el préstamo se encuentra pausado
          temporalmente. Mientras permanezca suspendido
          no se realizan descuentos de cuotas.
        </Typography>
      </Box>
      <Box>
        <Chip label="Terminado" size="small" sx={{ bgcolor: "#E3F2FD", color: "#1565C0", fontWeight: 600, mb: 0.7, }} />
        <Typography component="p">
          Identifica un préstamo que ya cumplió con todas
          sus cuotas y no tiene valores pendientes por
          descontar.
        </Typography>
      </Box>
      <Box>
        <Chip label="Cancelado" size="small" sx={{ bgcolor: "#FCE4EC", color: "#AD1457", fontWeight: 600, mb: 0.7, }} />
        <Typography component="p">
          Corresponde a un préstamo cancelado por un
          motivo administrativo, operativo o cualquier
          otra situación definida por el proceso.
        </Typography>
      </Box>
    </Stack>
  );
}

function CreateLoanHelp({onBack}: {onBack: () => void;}) {
  return (
    <Stack spacing={2.5}>
      <HelpTopicHeader title="Crear préstamo" path="/cuotas-prestamos/prestamo" onBack={onBack}/>
      <HelpSection number="1" title="Estados del préstamo">
        <Typography component="p">
          Los estados permiten identificar la situación actual del préstamo:
        </Typography>
        <LoanStatusExplanation />
      </HelpSection>
      <HelpSection number="2" title="Consultar colaborador">
        <Typography component="p">
          Ingresa el número de documento del colaborador
          y presiona el botón <strong>Buscar</strong>.
          El sistema intentará consultar automáticamente
          la información disponible del colaborador.
        </Typography>
        <Typography component="p" sx={{ mt: 1 }}>
          Si la búsqueda no retorna información o se
          presenta un error en la consulta externa,
          esto <strong>no bloquea la creación del préstamo</strong>.
          Los datos del colaborador pueden diligenciarse
          manualmente en los campos disponibles.
        </Typography>
      </HelpSection>
      <HelpSection number="3" title="Campos obligatorios">
        <Typography component="p">
          Los campos identificados con un
          <strong> asterisco (*)</strong> son
          obligatorios y deben diligenciarse antes de
          guardar el préstamo.
        </Typography>
        <Typography component="p" sx={{ mt: 1 }}>
          Antes de guardar, valida especialmente el
          colaborador, concepto, plan de deducción,
          estado, valor del préstamo, número de cuotas
          y las fechas relacionadas con el descuento.
        </Typography>
      </HelpSection>
      <HelpSection number="4" title="Concepto y plan de deducción">
        <Typography component="p">
          El concepto identifica el descuento de nómina
          asociado al préstamo. Posteriormente debes
          seleccionar el plan que define la frecuencia
          en la que serán procesadas las cuotas.
        </Typography>
        <ul>
          <li>
            <strong>Ambas quincenas:</strong> genera
            descuentos quincenales. Una cuota puede
            corresponder al día 15 y la siguiente al
            último día del mes.
          </li>
          <li>
            <strong>Primera quincena:</strong> realiza
            un descuento mensual únicamente en la
            primera quincena, correspondiente al día 15.
          </li>
          <li>
            <strong>Segunda quincena:</strong> realiza
            un descuento mensual únicamente en la
            segunda quincena, correspondiente al último
            día real de cada mes.
          </li>
        </ul>
      </HelpSection>
      <HelpSection number="5" title="Fechas del préstamo">
        <Typography component="p">
          Debes seleccionar la fecha de solicitud y la
          fecha de inicio del descuento.
        </Typography>
        <Typography component="p" sx={{ mt: 1 }}>
          La <strong>fecha de fin del descuento </strong> 
          se calcula automáticamente utilizando la fecha
          de inicio, el número de cuotas y el plan de
          deducción seleccionado. Por esta razón, este
          campo no necesita ser diligenciado manualmente.
        </Typography>
      </HelpSection>
      <HelpSection number="6" title="Diligenciar las cuotas">
        <Typography component="p">
          Antes de abrir la opción
          <strong> Cuotas</strong>, debes haber
          diligenciado la información necesaria para
          calcularlas.
        </Typography>
        <ul>
          <li>Concepto del descuento.</li>
          <li>Plan de deducción.</li>
          <li>Número de cuotas.</li>
          <li>Fecha de inicio del descuento.</li>
        </ul>
        <Typography component="p" sx={{ mt: 1 }}>
          Al presionar <strong>Cuotas</strong>, el
          sistema genera las fechas compromiso de
          acuerdo con el plan seleccionado.
        </Typography>
      </HelpSection>
      <HelpSection number="7" title="Valores de las cuotas">
        <Typography component="p">
          Debes ingresar el valor correspondiente a
          cada cuota. Los campos monetarios muestran
          separadores de miles para facilitar la lectura
          y disminuir errores al ingresar los valores.
        </Typography>
        <Typography component="p" sx={{ mt: 1 }}>
          El botón con el
          <strong> chulito</strong> ubicado junto a la
          primera cuota permite replicar el valor de la
          primera cuota en todas las demás. Es útil
          cuando todas las cuotas manejan el mismo valor.
        </Typography>
        <Typography component="p" sx={{ mt: 1 }}>
          Después de revisar los valores, presiona
          <strong> Aceptar</strong> para confirmar las
          cuotas.
        </Typography>
      </HelpSection>
      <HelpSection number="8" title="Guardar el préstamo">
        <Typography component="p">
          Finalmente revisa la información ingresada y
          presiona <strong>Guardar préstamo</strong>.
          El sistema validará los datos antes de realizar
          el registro.
        </Typography>
      </HelpSection>
    </Stack>
  );
}

function LoanManagementHelp({onBack,}: {onBack: () => void;}) {
  return (
    <Stack spacing={2.5}>
      <HelpTopicHeader title="Gestión de préstamos" path="/cuotas-prestamos/prestamos" onBack={onBack} />
      <HelpSection number="1" title="Objetivo de la página">
        <Typography component="p">
          Esta página permite consultar y administrar
          los préstamos registrados en el sistema.
          Desde aquí puedes buscar préstamos, revisar su
          avance, consultar las cuotas, visualizar el
          histórico de estados, actualizar el estado y
          ejecutar manualmente el proceso de descuentos.
        </Typography>
      </HelpSection>
      <HelpSection number="2" title="Estados del préstamo">
        <Typography component="p">
          Los estados permiten identificar la situación actual del préstamo:
        </Typography>
        <LoanStatusExplanation />
      </HelpSection>
      <HelpSection number="3" title="Buscar préstamos">
        <Typography component="p">
          Puedes utilizar los filtros ubicados en la
          parte superior para localizar los préstamos
          que necesitas revisar.
        </Typography>
        <ul>
          <li>Documento del colaborador.</li>
          <li>Estado del préstamo.</li>
          <li>Fecha de solicitud desde.</li>
          <li>Fecha de solicitud hasta.</li>
        </ul>
        <Typography component="p" sx={{ mt: 1 }}>
          Presiona <strong>Buscar</strong> para aplicar
          los filtros. El botón
          <strong> Limpiar</strong> restablece los
          filtros y consulta nuevamente la información.
        </Typography>
      </HelpSection>
      <HelpSection number="4" title="Información de la tabla">
        <Typography component="p">
          La tabla presenta información resumida de cada
          préstamo, incluyendo colaborador, concepto,
          plan de descuento, estado, fecha de solicitud,
          valor y avance de cuotas.
        </Typography>
        <Typography component="p" sx={{ mt: 1 }}>
          En la parte inferior puedes cambiar de página
          o modificar la cantidad de registros visibles.
        </Typography>
      </HelpSection>
      <HelpSection number="5" title="Visualizar detalles del préstamo">
        <Typography component="p">
          Utiliza el botón
          <strong> Detalles préstamo</strong> ubicado
          en la columna de acciones.
        </Typography>
        <Typography component="p" sx={{ mt: 1 }}>
          Se abrirá una ventana con la información
          completa del colaborador y del préstamo.
          También podrás consultar:
        </Typography>
        <ul>
          <li>Valor total del préstamo.</li>
          <li>Número de cuotas.</li>
          <li>Cuotas pagadas.</li>
          <li>Saldo restante.</li>
          <li>Fechas del descuento.</li>
          <li>Usuario de creación y modificación.</li>
          <li>Histórico de estados.</li>
          <li>Detalle de todas las cuotas.</li>
          <li>Estado y fecha de pago de cada cuota.</li>
        </ul>
      </HelpSection>
      <HelpSection number="6" title="Histórico de estados">
        <Typography component="p">
          Dentro de los detalles del préstamo encontrarás
          la sección <strong>Histórico</strong>.
        </Typography>
        <Typography component="p" sx={{ mt: 1 }}>
          Allí puedes consultar cada cambio de estado,
          incluyendo el estado asignado, la observación,
          la fecha en la que se realizó el cambio y el
          usuario responsable.
        </Typography>
      </HelpSection>
      <HelpSection number="7" title="Actualizar el estado">
        <Typography component="p">
          En la columna de acciones utiliza el botón
          <strong> Actualizar estado</strong>.
        </Typography>
        <Typography component="p" sx={{ mt: 1 }}>
          Se abrirá una ventana en la que debes
          seleccionar el nuevo estado e ingresar una
          observación que explique el motivo del cambio.
          El usuario que realiza la actualización se
          obtiene automáticamente de la sesión.
        </Typography>
        <Typography component="p" sx={{ mt: 1 }}>
          Cada actualización genera un registro en el
          histórico del préstamo.
        </Typography>
      </HelpSection>
      <HelpSection number="8" title="Restricciones de cambio de estado">
        <Typography component="p">
          Un préstamo que se encuentre en estado
          <strong> Terminado</strong> ya completó todas
          sus cuotas y no puede volver a cambiar de
          estado.
        </Typography>
        <Typography component="p" sx={{ mt: 1 }}>
          De la misma forma, un préstamo en estado
          <strong> Cancelado</strong> se considera
          cerrado y tampoco puede modificarse
          posteriormente.
        </Typography>
      </HelpSection>
      <HelpSection number="9" title="Ejecutar descuentos">
        <Typography component="p">
          El botón
          <strong> Ejecutar descuentos</strong> permite
          ejecutar manualmente el mismo proceso utilizado
          para gestionar las cuotas programadas.
        </Typography>
        <Typography component="p" sx={{ mt: 1 }}>
          El sistema identifica automáticamente la
          quincena según la fecha en que se ejecuta:
        </Typography>
        <ul>
          <li>
            Del día 1 al 15 se procesa la primera
            quincena y se buscan las cuotas con fecha
            compromiso del día 15.
          </li>
          <li>
            Desde el día 16 se procesa la segunda
            quincena y se utilizan las cuotas con fecha
            compromiso correspondiente al último día
            real del mes.
          </li>
        </ul>
        <Typography component="p" sx={{ mt: 1 }}>
          El proceso respeta el plan de deducción
          configurado para cada préstamo y solo procesa
          las cuotas que correspondan.
        </Typography>
      </HelpSection>
      <HelpSection number="10" title="Resultado del proceso">
        <Typography component="p">
          Al finalizar la ejecución se muestra un
          resumen con la quincena identificada, fecha de
          descuento, préstamos revisados, préstamos
          activados, cuotas pagadas, préstamos
          terminados, registros omitidos y errores
          encontrados.
        </Typography>
      </HelpSection>
    </Stack>
  );
}

function SinergyHelp({onBack,}: {onBack: () => void;}) {
  return (
    <Stack spacing={2.5}>
      <HelpTopicHeader title="Integración Sinergy" path="/integracion/sinergy" onBack={onBack} />
      <HelpSection number="1" title="Objetivo de la integración">
        <Typography component="p">
          Esta funcionalidad permite procesar el archivo
          maestro de empleados y generar el reporte
          correspondiente a la integración con Sinergy,
          aplicando las transformaciones definidas por el
          sistema.
        </Typography>
      </HelpSection>
      <HelpSection number="2" title="Preparar el archivo maestro">
        <Typography component="p">
          Antes de generar el reporte, valida que el
          archivo corresponda al maestro de empleados y
          que contenga las columnas requeridas para la
          transformación.
        </Typography>
        <Typography component="p" sx={{ mt: 1 }}>
          El sistema toma la información directamente
          desde el archivo cargado, por lo tanto los
          nombres de las columnas deben coincidir con los
          definidos para la integración.
        </Typography>
      </HelpSection>
      <HelpSection number="3" title="Formato permitido">
        <Typography component="p">
          Solo se permiten archivos de Excel con
          extensión <strong>.xlsx</strong>.
        </Typography>
        <Typography component="p" sx={{ mt: 1 }}>
          No se deben cargar archivos CSV, PDF, imágenes
          u otros formatos, ya que no son procesados por
          esta integración.
        </Typography>
      </HelpSection>
      <HelpSection number="4" title="Seleccionar el rango de fechas">
        <Typography component="p">
          Debes diligenciar la
          <strong> Fecha desde</strong> y la
          <strong> Fecha hasta</strong>.
        </Typography>
        <Typography component="p" sx={{ mt: 1 }}>
          El sistema utilizará este rango para filtrar
          los registros correspondientes según las
          reglas definidas para la generación.
        </Typography>
      </HelpSection>
      <HelpSection number="5" title="Generar el reporte">
        <Typography component="p">
          Después de seleccionar el archivo y completar
          las fechas, presiona
          <strong> Generar</strong>.
        </Typography>
        <Typography component="p" sx={{ mt: 1 }}>
          El sistema procesará el Excel, aplicará las
          transformaciones necesarias y generará el
          documento resultante.
        </Typography>
      </HelpSection>
      <HelpSection number="6" title="Vista previa en ONLYOFFICE">
        <Typography component="p">
          Cuando el proceso termine correctamente se
          mostrará una vista previa del Excel generado
          utilizando ONLYOFFICE.
        </Typography>
        <Typography component="p" sx={{ mt: 1 }}>
          Esta vista permite validar el resultado antes
          de descargarlo.
        </Typography>
      </HelpSection>
      <HelpSection number="7" title="Navegar por el documento">
        <Typography component="p">
          La vista de ONLYOFFICE es de solo lectura.
          Puedes utilizarla para:
        </Typography>
        <ul>
          <li>Cambiar entre las hojas del Excel.</li>
          <li>Desplazarte por filas y columnas.</li>
          <li>Utilizar el zoom.</li>
          <li>Buscar información.</li>
          <li>Revisar el contenido generado.</li>
        </ul>
      </HelpSection>
      <HelpSection number="8" title="Descargar el documento">
        <Typography component="p">
          Para obtener el archivo generado utiliza la
          opción de descarga disponible en el visor de
          ONLYOFFICE.
        </Typography>
        <Typography component="p" sx={{ mt: 1 }}>
          El archivo descargado corresponde al resultado
          generado por el sistema después de aplicar las
          transformaciones.
        </Typography>
      </HelpSection>
      <HelpSection number="9" title="Botón Limpiar">
        <Typography component="p">
          El botón <strong>Limpiar</strong> elimina el
          archivo seleccionado, las fechas ingresadas y
          la vista previa generada.
        </Typography>
        <Typography component="p" sx={{ mt: 1 }}>
          Úsalo cuando necesites comenzar nuevamente el
          proceso con otro archivo o con un nuevo rango
          de fechas.
        </Typography>
      </HelpSection>
    </Stack>
  );
}