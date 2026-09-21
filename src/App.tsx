import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AppLayout } from './layouts/AppLayout'
import { PublicLayout } from './layouts/PublicLayout'
import {
  AgendaPage,
  DailyReportPage,
  DashboardPage,
  ReportsPage,
  SettingsPage,
  TasksPage,
  TeamPage,
  TimePage,
} from './pages/app'
import { AboutPage } from './pages/public/AboutPage'
import { CeereSioPage } from './pages/public/CeereSioPage'
import { ContactPage } from './pages/public/ContactPage'
import { HomePage } from './pages/public/HomePage'
import { LoginPage } from './pages/public/LoginPage'
import { ServicesPage } from './pages/public/ServicesPage'
import { ProtectedRoute } from './routes/ProtectedRoute'
import { RoleRoute } from './routes/RoleRoute'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<PublicLayout />}>
          <Route index element={<HomePage />} />
          <Route path="ceere-sio" element={<CeereSioPage />} />
          <Route path="servicios" element={<ServicesPage />} />
          <Route path="nosotros" element={<AboutPage />} />
          <Route path="contacto" element={<ContactPage />} />
        </Route>

        <Route path="login" element={<LoginPage />} />

        <Route element={<ProtectedRoute />}>
          <Route path="app" element={<AppLayout />}>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="tareas" element={<TasksPage />} />
            <Route path="tiempo" element={<TimePage />} />
            <Route path="reporte-diario" element={<DailyReportPage />} />
            <Route path="agenda" element={<AgendaPage />} />

            <Route element={<RoleRoute roles={['ADMIN', 'LEADER']} />}>
              <Route path="equipo" element={<TeamPage />} />
              <Route path="reportes" element={<ReportsPage />} />
            </Route>

            <Route element={<RoleRoute roles={['ADMIN']} />}>
              <Route path="configuracion" element={<SettingsPage />} />
            </Route>
          </Route>
        </Route>

        {/* Compatibilidad con la demo anterior */}
        <Route path="admin" element={<Navigate to="/app/dashboard" replace />} />
        <Route path="admin/*" element={<Navigate to="/app/dashboard" replace />} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
