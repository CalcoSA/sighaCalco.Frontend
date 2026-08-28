import { RequirePermission } from "./components/RequirePermission";
import { TypeBankAccountPage } from "./pages/TypeBankAccountPage";
import { PayrollSinergyPage } from "./pages/PayrollSinergyPage";
import { TypeWithdrawalPage } from "./pages/TypeWithdrawalPage";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ConsolidationPage } from "./pages/ConsolidationPage";
import { AbsenteeismPage } from "./pages/AbsenteeismPage";
import { DescTsueldoPage } from "./pages/DescTsueldoPage";
import { MastersHomePage } from "./pages/MastersHomePage";
import { LoanReportPage } from "./pages/LoanReportPage";
import { CreateLoanPage } from "./pages/CreateLoanPage";
import { IncapacityPage } from "./pages/IncapacityPage";
import { PublicRoute } from "./components/PublicRoute";
import { RequireAuth } from "./components/RequireAuth";
import { DiagnosisPage } from "./pages/DiagnosisPage";
import { DescCen1Page } from "./pages/DescCen1Page";
import { DescCen2Page } from "./pages/DescCen2Page";
import { DescCen3Page } from "./pages/DescCen3Page";
import { DescCen4Page } from "./pages/DescCen4Page";
import { AppLayout } from "./components/AppLayout";
import { MastersPage } from "./pages/MastersPage";
import { LoanLogPage } from "./pages/LoanLogPage";
import { LoginPage } from "./pages/LoginPage";
import { HomePage } from "./pages/HomePage";
import { RolePage } from "./pages/RolePage";
import { UserPage } from "./pages/UserPage";
import { BankPage } from "./pages/BankPage";
import { LoanPage } from "./pages/LoanPage";
import { FilePage } from "./pages/FilePage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={ <PublicRoute> <LoginPage /> </PublicRoute> }/>
        <Route element={<RequireAuth />}>
          <Route element={<AppLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/configuracion/roles" element={ <RequirePermission path="/configuracion/roles"> <RolePage /> </RequirePermission> } />
            <Route path="/configuracion/usuarios" element={ <RequirePermission path="/configuracion/usuarios"> <UserPage /> </RequirePermission> } />
            <Route path="/maestros" element={<MastersPage />}>
              <Route index element={<MastersHomePage />} />
              <Route path="ausentismos" element={ <RequirePermission path="/maestros/ausentismos"> <AbsenteeismPage /> </RequirePermission> } />
              <Route path="bancos" element={ <RequirePermission path="/maestros/bancos"> <BankPage /> </RequirePermission> } />
              <Route path="desccen1" element={ <RequirePermission path="/maestros/desccen1"> <DescCen1Page /> </RequirePermission> } />
              <Route path="desccen2" element={ <RequirePermission path="/maestros/desccen2"> <DescCen2Page /> </RequirePermission> } />
              <Route path="desccen3" element={ <RequirePermission path="/maestros/desccen3"> <DescCen3Page /> </RequirePermission> } />
              <Route path="desccen4" element={ <RequirePermission path="/maestros/desccen4"> <DescCen4Page /> </RequirePermission> } />
              <Route path="desctsueldo" element={ <RequirePermission path="/maestros/desctsueldo"> <DescTsueldoPage /> </RequirePermission> } />
              <Route path="diagnosticos" element={ <RequirePermission path="/maestros/diagnosticos"> <DiagnosisPage /> </RequirePermission> } />
              <Route path="incapacidad" element={ <RequirePermission path="/maestros/incapacidad"> <IncapacityPage /> </RequirePermission> } />
              <Route path="conceptos-nomina" element={ <RequirePermission path="/maestros/conceptos-nomina"> <PayrollSinergyPage /> </RequirePermission> } />
              <Route path="tipo-cuenta" element={ <RequirePermission path="/maestros/tipo-cuenta"> <TypeBankAccountPage /> </RequirePermission> } />
              <Route path="tipo-retiro" element={ <RequirePermission path="/maestros/tipo-retiro"> <TypeWithdrawalPage /> </RequirePermission> } />
            </Route>
            <Route path="/cuotas-prestamos/prestamo" element={ <RequirePermission path="/cuotas-prestamos/prestamo"> <CreateLoanPage /> </RequirePermission> } />
            <Route path="/cuotas-prestamos/prestamos" element={ <RequirePermission path="/cuotas-prestamos/prestamos"> <LoanPage /> </RequirePermission> } />
            <Route path="/cuotas-prestamos/consolidacion" element={ <RequirePermission path="/cuotas-prestamos/consolidacion"><ConsolidationPage /></RequirePermission> } />
            <Route path="/cuotas-prestamos/reportes" element={ <RequirePermission path="/cuotas-prestamos/reportes"> <LoanReportPage /></RequirePermission> } />
            <Route path="/cuotas-prestamos/logs" element={ <RequirePermission path="/cuotas-prestamos/logs"> <LoanLogPage /> </RequirePermission> } />
            <Route path="/integracion/sinergy" element={ <RequirePermission path="/integracion/sinergy"> <FilePage /> </RequirePermission> } />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  )
}