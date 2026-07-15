import { Avatar, Box, Button, Collapse, Divider, IconButton, Tooltip, Typography, Dialog, DialogActions, DialogContent, DialogTitle, Paper, Stack, } from "@mui/material";
import AccountBalanceWalletOutlinedIcon from "@mui/icons-material/AccountBalanceWalletOutlined";
import AdminPanelSettingsOutlinedIcon from "@mui/icons-material/AdminPanelSettingsOutlined";
import DashboardCustomizeOutlinedIcon from "@mui/icons-material/DashboardCustomizeOutlined";
import RequestQuoteOutlinedIcon from "@mui/icons-material/RequestQuoteOutlined";
import ManageSearchOutlinedIcon from "@mui/icons-material/ManageSearchOutlined";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import UploadFileOutlinedIcon from "@mui/icons-material/UploadFileOutlined";
import PriceCheckOutlinedIcon from "@mui/icons-material/PriceCheckOutlined";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import PeopleAltOutlinedIcon from "@mui/icons-material/PeopleAltOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import HubOutlinedIcon from "@mui/icons-material/HubOutlined";
import InstagramIcon from "@mui/icons-material/Instagram";
import LanguageIcon from "@mui/icons-material/Language";
import FacebookIcon from "@mui/icons-material/Facebook";
import LogoutIcon from "@mui/icons-material/Logout";
import CoffeeIcon from "@mui/icons-material/Coffee";
import type { MenuItem } from "../models/MenuItem";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";

const SIDEBAR_CLOSED_WIDTH = 82;
const SIDEBAR_OPEN_WIDTH = 260;

const configurationItems: MenuItem[] = [
  {
    label: "Roles",
    path: "/configuracion/roles",
    icon: <AdminPanelSettingsOutlinedIcon />,
  },
  {
    label: "Usuarios",
    path: "/configuracion/usuarios",
    icon: <PeopleAltOutlinedIcon />,
  },
];

const mainItems: MenuItem[] = [
  {
    label: "Maestros",
    path: "/maestros",
    icon: <DashboardCustomizeOutlinedIcon />,
  },
];

const loanItems: MenuItem[] = [
  {
    label: "Crear préstamo",
    path: "/cuotas-prestamos/prestamo",
    icon: <RequestQuoteOutlinedIcon />,
  },
  {
    label: "Préstamo",
    path: "/cuotas-prestamos/prestamos",
    icon: <PriceCheckOutlinedIcon />,
  },
  {
    label: "Logs",
    path: "/cuotas-prestamos/logs",
    icon: <ManageSearchOutlinedIcon />,
  },
];

const integrationItems: MenuItem[] = [
  {
    label: "Sinergy",
    path: "/integracion/sinergy",
    icon: <UploadFileOutlinedIcon />,
  },
];

interface SidebarProps {
  sidebarOpen: boolean;
  onToggleSidebar: () => void;
}

export function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const toggleSidebar = () => { setSidebarOpen((prev) => !prev); };

  return (
    <Box sx={{ height: "100vh", width: "100%", bgcolor: "#FFFDF8", display: "grid", gridTemplateColumns: `${ sidebarOpen ? SIDEBAR_OPEN_WIDTH : SIDEBAR_CLOSED_WIDTH }px 1fr`, transition: "grid-template-columns 0.25s ease", overflow: "hidden", }}>
      <Sidebar sidebarOpen={sidebarOpen} onToggleSidebar={toggleSidebar} />
      <Box sx={{ height: "100vh", display: "grid", gridTemplateRows: "86px minmax(0, 1fr) 95px", minWidth: 0, overflow: "hidden", }}>
        <Header />
        <Box component="main" sx={{ bgcolor: "#FFFDF8", p: 4, overflowY: "auto", overflowX: "hidden", minHeight: 0, }}>
          <Outlet />
        </Box>
        <Footer />
      </Box>
    </Box>
  );
}

function Sidebar({ sidebarOpen, onToggleSidebar }: SidebarProps) {
  const { user, hasPermission } = useAuth();
  const location = useLocation();

  const allowedConfigurationItems = configurationItems.filter((item) => hasPermission(item.path));
  const allowedMainItems = mainItems.filter((item) => hasPermission(item.path));
  const allowedLoanItems = loanItems.filter((item) => hasPermission(item.path));
  const allowedIntegrationItems = integrationItems.filter((item) => hasPermission(item.path));

  const isConfigurationActive = location.pathname.startsWith("/configuracion");
  const isLoansActive = location.pathname.startsWith("/cuotas-prestamos");
  const isIntegrationActive = location.pathname.startsWith("/integracion");

  const [configurationsOpen, setconfigurationsOpen] = useState(isConfigurationActive);
  const [loansOpen, setLoansOpen] = useState(isLoansActive);
  const [integrationsOpen, setIntegrationsOpen] = useState(isIntegrationActive);

  const displayName = user?.userName || "Usuario";
  const roleName = user?.roles?.[0]?.nameRole || "Sin rol";
  const avatarLetter = displayName.trim().charAt(0).toUpperCase() || "U";
  
  const handleToggleMasters = () => {
    if (!sidebarOpen) {
      onToggleSidebar();
      setconfigurationsOpen(true);
      return;
    }
    setconfigurationsOpen((prev) => !prev);
  };

  const handleToggleLoans = () => {
    if (!sidebarOpen) {
      onToggleSidebar();
      setLoansOpen(true);
      return;
    }

    setLoansOpen((prev) => !prev);
  };

  const handleToggleIntegrations = () => {
    if (!sidebarOpen) {
      onToggleSidebar();
      setIntegrationsOpen(true);
      return;
    }

    setIntegrationsOpen((prev) => !prev);
  };

  return (
    <Box sx={{ height: "100vh", maxHeight: "100vh", bgcolor: "#4B2E1F", color: "#FFFFFF", display: "grid", gridTemplateRows: "155px minmax(0, 1fr) 95px", borderRight: "1px solid rgba(255,255,255,0.15)", position: "relative", transition: "all 0.25s ease", overflow: "hidden", }}>
      <IconButton onClick={onToggleSidebar} aria-label={sidebarOpen ? "Ocultar menú" : "Mostrar menú"} sx={{ position: "absolute", top: 16, right: 10, zIndex: 10, color: "#F7E8D8", bgcolor: "transparent", border: "none", boxShadow: "none", p: 0.5, width: 30, height: 30, "&:hover": { bgcolor: "rgba(247, 232, 216, 0.08)", color: "#FFFFFF", },}}>
        {sidebarOpen ? <ChevronLeftIcon /> : <ChevronRightIcon />}
      </IconButton>
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", px: 1, overflow: "hidden", }}>
        <Box component={NavLink} to="/" sx={{ display: "flex", alignItems: "center", justifyContent: "center", textDecoration: "none", }}>
          <Box component="img" src="/images/MonedaCrepes.png" alt="Crepes & Waffles" sx={{ width: sidebarOpen ? 115 : 52, height: sidebarOpen ? 115 : 52, objectFit: "contain", transition: "all 0.25s ease", cursor: "pointer", }}/>
        </Box>
      </Box>
      <Box sx={{ minHeight: 0, height: "100%", overflow: "hidden", }}>
        <Box component="nav" sx={{ height: "100%", minHeight: 0, px: sidebarOpen ? 2 : 1, pr: sidebarOpen ? 1 : 0.5, display: "flex", flexDirection: "column", gap: 1.2, transition: "all 0.25s ease", overflowY: "auto", overflowX: "hidden", pb: 2, "&::-webkit-scrollbar": { width: 6, }, "&::-webkit-scrollbar-thumb": { bgcolor: "rgba(247, 232, 216, 0.35)", borderRadius: 10, }, "&::-webkit-scrollbar-track": { bgcolor: "transparent", },}}>
          {allowedConfigurationItems.length > 0 && (
            <>
              <Tooltip title={!sidebarOpen ? "Configuración" : ""} placement="right" arrow>
                <Box onClick={handleToggleMasters} sx={{ display: "flex", alignItems: "center", justifyContent: sidebarOpen ? "flex-start" : "center", gap: sidebarOpen ? 1.5 : 0, px: sidebarOpen ? 2 : 0, py: 1.25, minHeight: 48, flexShrink: 0, borderRadius: 2, color: isConfigurationActive ? "#4B2E1F" : "#F8EBDD", bgcolor: isConfigurationActive ? "#F7E8D8" : "transparent", fontSize: 16, fontWeight: 600, textDecoration: "none", cursor: "pointer", transition: "all 0.25s ease", "& svg": { fontSize: 25, }, "&:hover": { bgcolor: isConfigurationActive ? "#F7E8D8" : "rgba(247, 232, 216, 0.18)", },}}>
                  <Box sx={{ display: "flex", alignItems: "center", color: "inherit", }}>
                    <SettingsOutlinedIcon />
                  </Box>
                  {sidebarOpen && (
                    <>
                      <Typography sx={{ flex: 1, fontSize: 16, fontWeight: 600, whiteSpace: "nowrap", }}>
                        Configuración
                      </Typography>
                      {configurationsOpen ? (
                        <KeyboardArrowUpIcon sx={{ fontSize: 20 }} />
                      ) : (
                        <KeyboardArrowDownIcon sx={{ fontSize: 20 }} />
                      )}
                    </>
                  )}
                </Box>
              </Tooltip>
              <Collapse in={sidebarOpen && configurationsOpen} timeout="auto" unmountOnExit sx={{ flexShrink: 0, }}>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 0.8, mt: 0.5, pl: 1.5, }}>
                  {allowedConfigurationItems.map((item) => (
                    <Box key={item.path} component={NavLink} to={item.path} sx={{ display: "flex", alignItems: "center", gap: 1.2, px: 1.5, py: 1, minHeight: 40, flexShrink: 0, borderRadius: 2, color: "#F8EBDD", fontWeight: 500, textDecoration: "none", transition: "all 0.25s ease", "& svg": { fontSize: 21, }, "&.active": { bgcolor: "rgba(247, 232, 216, 0.22)", color: "#FFFFFF", }, "&:hover": { bgcolor: "rgba(247, 232, 216, 0.14)", },}}>
                      <Box sx={{ display: "flex", alignItems: "center", color: "inherit", }}>
                        {item.icon}
                      </Box>
                      <Typography sx={{ fontSize: 14, fontWeight: 600, whiteSpace: "nowrap", }}>
                        {item.label}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </Collapse>
            </>
          )}
          {allowedMainItems.map((item) => (
            <Tooltip key={item.path} title={!sidebarOpen ? item.label : ""} placement="right" arrow>
              <Box component={NavLink} to={item.path} sx={{ display: "flex", alignItems: "center", justifyContent: sidebarOpen ? "flex-start" : "center", gap: sidebarOpen ? 1.5 : 0, px: sidebarOpen ? 2 : 0, py: 1.25, minHeight: 48, flexShrink: 0, borderRadius: 2, color: "#F8EBDD", fontSize: 16, fontWeight: 600, textDecoration: "none", transition: "all 0.25s ease", "& svg": { fontSize: 25, }, "&.active": { bgcolor: "#F7E8D8", color: "#4B2E1F", }, "&:hover": { bgcolor: "rgba(247, 232, 216, 0.18)", }, "&.active:hover": { bgcolor: "#F7E8D8", },}}>
                <Box sx={{ display: "flex", alignItems: "center", color: "inherit", }}>
                  {item.icon}
                </Box>
                {sidebarOpen && (
                  <Typography sx={{ fontSize: 16, fontWeight: 600, whiteSpace: "nowrap", }}>
                    {item.label}
                  </Typography>
                )}
              </Box>
            </Tooltip>
          ))}
          {allowedLoanItems.length > 0 && (
            <>
              <Tooltip title={!sidebarOpen ? "Cuotas y Préstamos" : ""} placement="right" arrow>
                <Box onClick={handleToggleLoans} sx={{ display: "flex", alignItems: "center", justifyContent: sidebarOpen ? "flex-start" : "center", gap: sidebarOpen ? 1.5 : 0, px: sidebarOpen ? 2 : 0, py: 1.25, minHeight: 48, flexShrink: 0, borderRadius: 2, color: isLoansActive ? "#4B2E1F" : "#F8EBDD", bgcolor: isLoansActive ? "#F7E8D8" : "transparent", fontSize: 16, fontWeight: 600, textDecoration: "none", cursor: "pointer", transition: "all 0.25s ease", "& svg": { fontSize: 25, }, "&:hover": { bgcolor: isLoansActive ? "#F7E8D8" : "rgba(247, 232, 216, 0.18)", },}}>
                  <Box sx={{ display: "flex", alignItems: "center", color: "inherit" }}>
                    <AccountBalanceWalletOutlinedIcon />
                  </Box>
                  {sidebarOpen && (
                    <>
                      <Typography sx={{ flex: 1, fontSize: 16, fontWeight: 600, whiteSpace: "nowrap", }}>
                        Cuotas y Préstamos
                      </Typography>
                      {loansOpen ? (
                        <KeyboardArrowUpIcon sx={{ fontSize: 20 }} />
                      ) : (
                        <KeyboardArrowDownIcon sx={{ fontSize: 20 }} />
                      )}
                    </>
                  )}
                </Box>
              </Tooltip>
              <Collapse in={sidebarOpen && loansOpen} timeout="auto" unmountOnExit sx={{ flexShrink: 0 }}>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 0.8, mt: 0.5, pl: 1.5, }}>
                  {allowedLoanItems.map((item) => (
                    <Box key={item.path} component={NavLink} to={item.path} sx={{ display: "flex", alignItems: "center", gap: 1.2, px: 1.5, py: 1, minHeight: 40, flexShrink: 0, borderRadius: 2, color: "#F8EBDD", fontWeight: 500, textDecoration: "none", transition: "all 0.25s ease", "& svg": { fontSize: 21, }, "&.active": { bgcolor: "rgba(247, 232, 216, 0.22)", color: "#FFFFFF", }, "&:hover": { bgcolor: "rgba(247, 232, 216, 0.14)", },}}>
                      <Box sx={{ display: "flex", alignItems: "center", color: "inherit" }}>
                        {item.icon}
                      </Box>
                      <Typography sx={{ fontSize: 14, fontWeight: 600, whiteSpace: "nowrap", }}>
                        {item.label}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </Collapse>
            </>
          )}
          {allowedIntegrationItems.length > 0 && (
            <>
              <Tooltip title={!sidebarOpen ? "Integraciones" : ""} placement="right" arrow>
                <Box onClick={handleToggleIntegrations} sx={{ display: "flex", alignItems: "center", justifyContent: sidebarOpen ? "flex-start" : "center", gap: sidebarOpen ? 1.5 : 0, px: sidebarOpen ? 2 : 0, py: 1.25, minHeight: 48, flexShrink: 0, borderRadius: 2, color: isIntegrationActive ? "#4B2E1F" : "#F8EBDD", bgcolor: isIntegrationActive ? "#F7E8D8" : "transparent", fontSize: 16, fontWeight: 600, textDecoration: "none", cursor: "pointer", transition: "all 0.25s ease", "& svg": { fontSize: 25 }, "&:hover": { bgcolor: isIntegrationActive ? "#F7E8D8" : "rgba(247, 232, 216, 0.18)", },}}>
                  <Box sx={{ display: "flex", alignItems: "center", color: "inherit" }}>
                    <HubOutlinedIcon />
                  </Box>
                  {sidebarOpen && (
                    <>
                      <Typography sx={{ flex: 1, fontSize: 16, fontWeight: 600, whiteSpace: "nowrap", }}>
                        Integraciones
                      </Typography>
                      {integrationsOpen ? (
                        <KeyboardArrowUpIcon sx={{ fontSize: 20 }} />
                      ) : (
                        <KeyboardArrowDownIcon sx={{ fontSize: 20 }} />
                      )}
                    </>
                  )}
                </Box>
              </Tooltip>
              <Collapse in={sidebarOpen && integrationsOpen} timeout="auto" unmountOnExit sx={{ flexShrink: 0 }}>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 0.8, mt: 0.5, pl: 1.5, }}>
                  {allowedIntegrationItems.map((item) => (
                    <Box key={item.path} component={NavLink} to={item.path} sx={{ display: "flex", alignItems: "center", gap: 1.2, px: 1.5, py: 1, minHeight: 40, flexShrink: 0, borderRadius: 2, color: "#F8EBDD", fontWeight: 500, textDecoration: "none", transition: "all 0.25s ease", "& svg": { fontSize: 21 }, "&.active": { bgcolor: "rgba(247, 232, 216, 0.22)", color: "#FFFFFF", }, "&:hover": { bgcolor: "rgba(247, 232, 216, 0.14)", },}}>
                      <Box sx={{ display: "flex", alignItems: "center", color: "inherit" }}>
                        {item.icon}
                      </Box>
                      <Typography sx={{ fontSize: 14, fontWeight: 600, whiteSpace: "nowrap", }}>
                        {item.label}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </Collapse>
            </>
          )}
        </Box>
      </Box>
      <Box sx={{ minHeight: 95, overflow: "hidden", }}>
        <Divider sx={{ borderColor: "rgba(255,255,255,0.18)" }} />
        <Box sx={{ px: sidebarOpen ? 2 : 1, py: 1.2, display: "flex", alignItems: "center", justifyContent: sidebarOpen ? "flex-start" : "center", gap: 1.2, transition: "all 0.25s ease", }}>
          <Avatar sx={{ bgcolor: "#F7E8D8", color: "#4B2E1F", width: 42, height: 42, flexShrink: 0, }}>
            {avatarLetter}
          </Avatar>
          {sidebarOpen && (
            <>
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography sx={{ fontSize: 11, fontWeight: 700, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", }}>
                  {displayName}
                </Typography>
                <Typography sx={{ fontSize: 12, color: "#EAD9C9" }}>
                  {roleName}
                </Typography>
              </Box>
            </>
          )}
        </Box>
      </Box>
    </Box>
  );
}

function Header() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const handleLogout = () => { logout(); navigate("/login", { replace: true }); };

  return(
    <Box sx={{ bgcolor: "#F7E8D8", borderBottom: "1px solid #C9A98E", px: 5, display: "flex", alignItems: "center", justifyContent: "space-between", minHeight: 86, overflow: "hidden", }}>
      <Box sx={{ display: "flex", alignItems: "center", gap: 2, minWidth: 0, }}>
        <CoffeeIcon sx={{ fontSize: 42, color: "#4B2E1F", flexShrink: 0, }}/>
        <Box sx={{ minWidth: 0 }}>
          <Typography variant="h6" color="primary.main" sx={{ fontWeight: 700, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", }}>
            BIENVENIDO A SIGHA CALCO S.A
          </Typography>
        </Box>
      </Box>
      <Button variant="outlined" startIcon={<LogoutIcon />} onClick={handleLogout} sx={{ borderColor: "#8B6A55", color: "#4B2E1F", bgcolor: "rgba(255,255,255,0.35)", px: 2, py: 1, flexShrink: 0, "&:hover": { borderColor: "#4B2E1F", bgcolor: "rgba(255,255,255,0.55)", },}}>
        Cerrar Sesión
      </Button>
    </Box>
  );
}

function Footer() {
  const location = useLocation();
  const [helpOpen, setHelpOpen] = useState(false);
  const [termsOpen, setTermsOpen] = useState(false);
  const [privacyOpen, setPrivacyOpen] = useState(false);
  const handleCloseHelp = () => { setHelpOpen(false); };
  const handleOpenTerms = () => { setTermsOpen(true); };
  const handleCloseTerms = () => { setTermsOpen(false); };
  const handleOpenPrivacy = () => { setPrivacyOpen(true); };
  const handleClosePrivacy = () => { setPrivacyOpen(false); };
  //const [selectedHelpPath, setSelectedHelpPath] = useState<HelpPath>(() => getHelpPathFromCurrentRoute(location.pathname));
  //const selectedHelpContent = helpContentByPath[selectedHelpPath];
  //const handleOpenHelp = () => { setSelectedHelpPath(getHelpPathFromCurrentRoute(location.pathname)); setHelpOpen(true); };
    
  return(
    <>
      <Box sx={{ bgcolor: "#4B2E1F", color: "#F7E8D8", px: 5, display: "grid", gridTemplateColumns: "1fr auto", alignItems: "center", columnGap: 4, minHeight: 95, overflow: "hidden", }}>
        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 1.5, minWidth: 0, }}>
          <Typography sx={{ fontSize: 15, mt: 1, textAlign: "center", }}>
            © Compañía de Alimentos Colombianos Calco S.A - Todos los derechos reservados
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2.5, }}>
            <IconButton component="a" href="https://web.facebook.com/CrepesyWafflesOficial/" target="_blank" rel="noopener noreferrer" aria-label="Ir a FacebookIcon" sx={{ color: "#F7E8D8" }}>
              <FacebookIcon />
            </IconButton>
            <IconButton component="a" href="https://www.instagram.com/crepesywaffles/" target="_blank" rel="noopener noreferrer" aria-label="Ir a Instagram" sx={{ color: "#F7E8D8" }}>
              <InstagramIcon />
            </IconButton>
            <IconButton component="a" href="https://calcoweb.net/" target="_blank" rel="noopener noreferrer" aria-label="Ir a CalcoWeb" sx={{ color: "#F7E8D8" }}>
              <LanguageIcon />
            </IconButton>
            <Divider orientation="vertical" flexItem sx={{ borderColor: "rgba(247,232,216,0.35)" }}/>
            <Typography onClick={handleOpenTerms} sx={{ fontSize: 14, whiteSpace: "nowrap", cursor: "pointer", }}>
              Términos y condiciones
            </Typography>
            <Divider orientation="vertical" flexItem sx={{ borderColor: "rgba(247,232,216,0.35)" }}/>
            <Typography onClick={handleOpenPrivacy} sx={{ fontSize: 14, whiteSpace: "nowrap", cursor: "pointer", }}>
              Privacidad
            </Typography>
            <Divider orientation="vertical" flexItem sx={{ borderColor: "rgba(247,232,216,0.35)" }}/>
            <Typography sx={{ fontSize: 14, whiteSpace: "nowrap", cursor: "pointer", }}>
              Ayuda
            </Typography>
          </Box>
          </Box>
        </Box>
    </>
  );
}