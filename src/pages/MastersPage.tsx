import MedicalInformationOutlinedIcon from "@mui/icons-material/MedicalInformationOutlined";
import AccountBalanceOutlinedIcon from "@mui/icons-material/AccountBalanceOutlined";
import CorporateFareOutlinedIcon from "@mui/icons-material/CorporateFareOutlined";
import ReceiptLongOutlinedIcon from "@mui/icons-material/ReceiptLongOutlined";
import CreditCardOutlinedIcon from "@mui/icons-material/CreditCardOutlined";
import FactCheckOutlinedIcon from "@mui/icons-material/FactCheckOutlined";
import ExitToAppOutlinedIcon from "@mui/icons-material/ExitToAppOutlined";
import ApartmentOutlinedIcon from "@mui/icons-material/ApartmentOutlined";
import BusinessOutlinedIcon from "@mui/icons-material/BusinessOutlined";
import PaymentsOutlinedIcon from "@mui/icons-material/PaymentsOutlined";
import HealingOutlinedIcon from "@mui/icons-material/HealingOutlined";
import DomainOutlinedIcon from "@mui/icons-material/DomainOutlined";
import { NavLink, Outlet, useLocation } from "react-router-dom";
import { Box, Paper, Stack, Typography, } from "@mui/material";
import type { MenuItem } from "../models/MenuItem";
import { useAuth } from "../context/AuthContext";

const masterItems: MenuItem[] = [
  {
    label: "Ausentismos",
    path: "/maestros/ausentismos",
    icon: <MedicalInformationOutlinedIcon />,
  },
  {
    label: "Bancos",
    path: "/maestros/bancos",
    icon: <AccountBalanceOutlinedIcon />,
  },
  {
    label: "Desc Cen1",
    path: "/maestros/desccen1",
    icon: <CorporateFareOutlinedIcon />,
  },
  {
    label: "Desc Cen2",
    path: "/maestros/desccen2",
    icon: <BusinessOutlinedIcon />,
  },
  {
    label: "Desc Cen3",
    path: "/maestros/desccen3",
    icon: <ApartmentOutlinedIcon />,
  },
  {
    label: "Desc Cen4",
    path: "/maestros/desccen4",
    icon: <DomainOutlinedIcon />,
  },
  {
    label: "Desc Tsueldo",
    path: "/maestros/desctsueldo",
    icon: <PaymentsOutlinedIcon />,
  },
  {
    label: "Diagnósticos",
    path: "/maestros/diagnosticos",
    icon: <FactCheckOutlinedIcon />,
  },
  {
    label: "Tipo de Incapacidad",
    path: "/maestros/incapacidad",
    icon: <HealingOutlinedIcon />,
  },
  {
    label: "Conceptos de Nómina",
    path: "/maestros/conceptos-nomina",
    icon: <ReceiptLongOutlinedIcon />,
  },
  {
    label: "Tipo de Cuenta Bancaria",
    path: "/maestros/tipo-cuenta",
    icon: <CreditCardOutlinedIcon />,
  },
  {
    label: "Tipo de Retiro",
    path: "/maestros/tipo-retiro",
    icon: <ExitToAppOutlinedIcon />,
  },
];

const visibleMasterPaths = [
  "/maestros/conceptos-nomina",
];

export function MastersPage() {
  const { hasPermission } = useAuth();
  const location = useLocation();
  //const allowedMasterItems = masterItems.filter((item) => hasPermission(item.path));
  const allowedMasterItems = masterItems.filter(
    (item) =>
      visibleMasterPaths.includes(item.path) &&
      hasPermission(item.path)
  );

  return (
    <Box sx={{ height: "100%", minHeight: 0, display: "grid", gridTemplateColumns: "280px minmax(0, 1fr)", gap: 3, ml: "-40px", mt: -3, mb: -3, }}>
      <Paper elevation={0} sx={{ height: "100%", minHeight: 0, bgcolor: "#FFFFFF", borderLeft: "4px solid #FFFFFF", borderRight: "1px solid #D8BDA5", borderRadius: 0, overflow: "hidden", }}>
        <Stack component="nav" spacing={0} sx={{ height: "100%", overflowY: "auto", bgcolor: "#FFFFFF", }}>
          {allowedMasterItems.map((item) => {
            const selected = location.pathname === item.path;

            return (
              <Box key={item.path} component={NavLink} to={item.path} sx={{ display: "flex", alignItems: "center", gap: 1.1, px: 2.5, py: 1.1, minHeight: 46, textDecoration: "none", bgcolor: selected ? "#F7E8D8" : "#FFFFFF", color: "#4B2E1F", fontWeight: selected ? 700 : 600, transition: "none", borderBottom: "1px solid #E4CBB6", "& svg": { fontSize: 19, }, "&:hover": { bgcolor: selected ? "#F7E8D8" : "#FFFFFF", color: "#4B2E1F", },}}>
                <Box sx={{ display: "flex", alignItems: "center", color: "inherit", }}>
                  {item.icon}
                </Box>
                <Typography
                  sx={{ fontSize: 13, fontWeight: selected ? 700 : 600, whiteSpace: "nowrap", color: "inherit", }}>
                  {item.label}
                </Typography>
              </Box>
            );
          })}
        </Stack>
      </Paper>
      <Box sx={{ minWidth: 0, minHeight: 0, height: "100%", overflow: "auto", pt: 3, pr: 3, pb: 3, }}>
        <Outlet />
      </Box>
    </Box>
  );
}